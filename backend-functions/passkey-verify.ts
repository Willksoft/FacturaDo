import { createClient } from 'npm:@supabase/supabase-js';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from 'npm:@simplewebauthn/server';

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
    const body = await req.json();

    // STEP 1: Generate Authentication Options
    if (body.action === 'generate') {
      const { email } = body;
      
      // Get user passkeys (if they have an email)
      let allowCredentials = [];
      if (email) {
        // Find user by email
        // We query auth_challenges table to find user_id? No, we can query passkeys joined with auth.users?
        // Let's use supabase admin to get user by email
        // Or we just don't pass allowCredentials and let the user pick from device
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(email); // Not supported by email easily. 
        // Best approach: query an internal table or let simplewebauthn handle discoverable credentials.
      }

      const options = await generateAuthenticationOptions({
        rpID,
        userVerification: 'preferred',
      });

      // Save challenge in DB (without user_id since we don't know who is logging in yet)
      await supabase.from('auth_challenges').insert([{
        challenge: options.challenge
      }]);

      return new Response(JSON.stringify({ options }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 2: Verify Authentication Response
    if (body.action === 'verify') {
      const { response, email } = body; // email might be needed to find the user, or we extract credential_id

      const credIdString = response.id; // Base64url

      // Find passkey in DB
      const { data: passkeys, error: pkError } = await supabase
        .from('passkeys')
        .select('*, auth.users(email)')
        .eq('credential_id', credIdString)
        .limit(1);

      if (pkError || !passkeys || passkeys.length === 0) {
        throw new Error('Passkey not found in our records');
      }

      const passkey = passkeys[0];

      // Get latest challenge
      const { data: challenges, error: challengeError } = await supabase
        .from('auth_challenges')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (challengeError || !challenges || challenges.length === 0) {
        throw new Error('Challenge not found');
      }

      const expectedChallenge = challenges[0].challenge;
      const authenticator = {
        credentialPublicKey: new Uint8Array(Array.from(atob(passkey.public_key)).map(c => c.charCodeAt(0))),
        credentialID: new Uint8Array(Array.from(atob(passkey.credential_id)).map(c => c.charCodeAt(0))),
        counter: passkey.counter,
        transports: passkey.transports
      };

      let verification;
      try {
        verification = await verifyAuthenticationResponse({
          response,
          expectedChallenge,
          expectedOrigin: origin,
          expectedRPID: rpID,
          authenticator,
        });
      } catch (error: any) {
        throw new Error(`Verification failed: ${error.message}`);
      }

      if (verification.verified) {
        // Update counter
        await supabase.from('passkeys').update({ counter: verification.authenticationInfo.newCounter }).eq('id', passkey.id);

        // --- THE HACK: Generate Magic Link Token for frontend to verify ---
        // Need user email
        // To get email safely, we fetch user from admin api using passkey.user_id
        const { data: { user }, error: adminUserError } = await supabase.auth.admin.getUserById(passkey.user_id);
        if (adminUserError || !user || !user.email) throw new Error('User email not found');

        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: user.email
        });

        if (linkError) throw new Error(`Failed to generate auth token: ${linkError.message}`);

        // Extract token from URL
        // Format: https://site.com/auth/v1/verify?token=PKK2e...&type=magiclink
        const url = new URL(linkData.properties.action_link);
        const magicToken = url.searchParams.get('token');

        return new Response(JSON.stringify({ 
          success: true, 
          magicToken, 
          email: user.email 
        }), {
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
