import { createClient } from 'npm:@supabase/supabase-js';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from 'npm:@simplewebauthn/server';

const rpName = 'FacturaDo';
const rpID = 'facturado.netlify.app'; // En producción, usar el dominio real
const origin = `https://${rpID}`;

export default async function (req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('INSFORGE_BASE_URL') || Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('INSFORGE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Auth token from request
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new Error('Missing auth token');

    // Get the user verifying their token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error('Unauthorized');

    const body = await req.json();

    // STEP 1: Generate Registration Options
    if (body.action === 'generate') {
      const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: new TextEncoder().encode(user.id),
        userName: user.email || 'user',
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'preferred',
        },
      });

      // Save challenge in DB
      await supabase.from('auth_challenges').insert([{
        user_id: user.id,
        email: user.email,
        challenge: options.challenge
      }]);

      return new Response(JSON.stringify({ options }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 2: Verify Registration Response
    if (body.action === 'verify') {
      const { response, challengeId } = body;

      // Get challenge from DB
      const { data: challenges, error: challengeError } = await supabase
        .from('auth_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (challengeError || !challenges || challenges.length === 0) {
        throw new Error('Challenge not found');
      }

      const expectedChallenge = challenges[0].challenge;

      let verification;
      try {
        verification = await verifyRegistrationResponse({
          response,
          expectedChallenge,
          expectedOrigin: origin,
          expectedRPID: rpID,
        });
      } catch (error: any) {
        throw new Error(`Verification failed: ${error.message}`);
      }

      if (verification.verified && verification.registrationInfo) {
        const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

        // Ensure credentialID is string (base64url)
        const credIdString = btoa(String.fromCharCode(...new Uint8Array(credentialID)));
        const pubKeyString = btoa(String.fromCharCode(...new Uint8Array(credentialPublicKey)));

        // Save passkey in DB
        const { error: insertError } = await supabase.from('passkeys').insert([{
          user_id: user.id,
          credential_id: credIdString,
          public_key: pubKeyString,
          counter: counter,
          transports: response.response.transports || []
        }]);

        if (insertError) throw new Error(`DB Error: ${insertError.message}`);

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error('Not verified');
    }

    throw new Error('Invalid action');
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
