import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function run() {
  const testId = 'test_null_' + Date.now();
  console.log("Inserting client with NULL is_deleted...");
  const { error: insErr } = await supabase.database.from('clients').insert([{
    id: testId,
    type: 'Fisica',
    name: 'Test Null Client',
    rnc_or_cedula: '123',
    email: 'test@null.com',
    phone: '123',
    address: '123'
  }]);

  if (insErr) {
    console.error("Insert error:", insErr);
    return;
  }
  console.log("Insert success!");

  console.log("Querying with select('*').neq('is_deleted', true)...");
  const { data: dataNeq, error: errNeq } = await supabase.database.from('clients').select('*').neq('is_deleted', true);
  if (errNeq) console.error("neq error:", errNeq);
  const foundNeq = dataNeq ? dataNeq.some(c => c.id === testId) : false;
  console.log(`Found using neq('is_deleted', true): ${foundNeq}`);

  console.log("Querying with select('*').or('is_deleted.is.null,is_deleted.eq.false')...");
  const { data: dataOr, error: errOr } = await supabase.database.from('clients').select('*').or('is_deleted.is.null,is_deleted.eq.false');
  if (errOr) console.error("or error:", errOr);
  const foundOr = dataOr ? dataOr.some(c => c.id === testId) : false;
  console.log(`Found using or: ${foundOr}`);

  // Clean up
  await supabase.database.from('clients').delete().eq('id', testId);
}

run();
