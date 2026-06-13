import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function run() {
  console.log("Selecting all clients...");
  const resAll = await supabase.database.from('clients').select('*');
  console.log("All clients count:", resAll.data ? resAll.data.length : 'null');
  if (resAll.error) console.error("All clients error:", resAll.error);
  if (resAll.data && resAll.data.length > 0) {
    console.log("Columns of first client:", Object.keys(resAll.data[0]));
    console.log("Sample clients:", resAll.data.slice(0, 3));
  }

  console.log("\nSelecting with .neq('is_deleted', true)...");
  const resNeq = await supabase.database.from('clients').select('*').neq('is_deleted', true);
  console.log("Filtered clients count:", resNeq.data ? resNeq.data.length : 'null');
  if (resNeq.error) {
    console.error("Filtered clients error:", resNeq.error);
  }
}

run();
