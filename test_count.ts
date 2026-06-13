import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function test() {
  const { data, error, count } = await supabase.database
    .from('clients')
    .select('*', { count: 'exact', head: true });
    
  console.log("Clients count:", count);
}

test();
