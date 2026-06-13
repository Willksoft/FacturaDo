import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

async function run() {
  console.log("=== CLIENTS ===");
  const { data: clients, error: errClients } = await supabase.database.from('clients').select('*');
  if (errClients) console.error("Clients error:", errClients);
  else console.log(`Clients total: ${clients.length}`, clients);

  console.log("\n=== INVOICES ===");
  const { data: invoices, error: errInvoices } = await supabase.database.from('invoices').select('*');
  if (errInvoices) console.error("Invoices error:", errInvoices);
  else console.log(`Invoices total: ${invoices.length}`, invoices);
}

run();
