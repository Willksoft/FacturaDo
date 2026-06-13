import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function test() {
  console.log("Testing select...");
  const { data, error } = await supabase.database.from('clients').select('*');
  
  if (error) {
    console.error("Select error:", error);
  } else {
    console.log("Select success! Number of records:", data.length);
    console.log("Found our test record?", data.some(d => d.id === 'test_123'));
  }
}

test();
