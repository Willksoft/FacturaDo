import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function test() {
  console.log("Testing insert with dgii columns...");
  const { data, error } = await supabase.database.from('clients').insert([
    {
      id: 'test_full_123',
      type: 'Fisica',
      name: 'Test Client',
      rnc_or_cedula: '123',
      email: 'a@a.com',
      phone: '123',
      address: '123',
      created_at: new Date().toISOString(),
      dgii_verified: false,
      dgii_estatus: null,
      dgii_regimen: null,
      dgii_categoria: null,
      dgii_actividad: null,
      dgii_provincia: null,
      dgii_municipio: null
    }
  ]);
  
  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Insert success:", data);
  }
}

test();
