import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function test() {
  console.log("Testing update...");
  const { data, error } = await supabase.database.from('clients')
    .update({ name: 'Test Updated' })
    .eq('id', 'test_123');
  
  if (error) {
    console.error("Update error:", error);
  } else {
    console.log("Update success:", data);
  }
}

test();
