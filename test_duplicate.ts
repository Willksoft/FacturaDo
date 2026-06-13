import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function test() {
  console.log("Testing insert duplicate...");
  const { data, error } = await supabase.database.from('clients').insert([
    {
      id: 'test_full_1234',
      type: 'Fisica',
      name: 'Test Client 2',
      rnc_or_cedula: '123', // Same RNC as before!
      email: 'a@a.com',
      phone: '123',
      address: '123',
      created_at: new Date().toISOString()
    }
  ]);
  
  if (error) {
    console.error("Insert duplicate error:", error);
  } else {
    console.log("Insert duplicate success:", data);
  }
}

test();
