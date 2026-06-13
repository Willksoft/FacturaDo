import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

const currentUserId = '16051afa-55f3-4296-bb43-5e788e75d2d6';

async function run() {
  try {
    console.log("1. Fetch template settings");
    const { data: dbSettings, error: errSettings } = await supabase.database.from('template_settings').select('*');
    if (errSettings) console.error("  Settings error:", errSettings);
    const userSettings = dbSettings ? dbSettings.find(s => s.id === currentUserId) : null;
    console.log("  Settings found:", !!userSettings);

    console.log("2. Fetch clients");
    const { data: dbClients, error: errClients } = await supabase.database.from('clients').select('*').neq('is_deleted', true);
    if (errClients) console.error("  Clients error:", errClients);
    const userClients = dbClients ? dbClients.filter(c => c.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Clients found: ${userClients.length} (out of ${dbClients ? dbClients.length : 0} total)`);

    console.log("3. Fetch NCF sequences");
    const { data: dbNcf, error: errNcf } = await supabase.database.from('ncf_sequences').select('*');
    if (errNcf) console.error("  NCF error:", errNcf);
    const userNcf = dbNcf ? dbNcf.filter(n => n.type.startsWith(`${currentUserId}_`)) : [];
    console.log(`  NCF found: ${userNcf.length} (out of ${dbNcf ? dbNcf.length : 0} total)`);

    console.log("4. Fetch providers");
    const { data: dbProviders, error: errProviders } = await supabase.database.from('providers').select('*').neq('is_deleted', true);
    if (errProviders) console.error("  Providers error:", errProviders);
    const userProviders = dbProviders ? dbProviders.filter(p => p.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Providers found: ${userProviders.length}`);

    console.log("5. Fetch warehouses");
    const { data: dbWarehouses, error: errWarehouses } = await supabase.database.from('warehouses').select('*').neq('is_deleted', true);
    if (errWarehouses) console.error("  Warehouses error:", errWarehouses);
    const userWarehouses = dbWarehouses ? dbWarehouses.filter(w => w.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Warehouses found: ${userWarehouses.length}`);

    console.log("6. Fetch products");
    const { data: dbProducts, error: errProducts } = await supabase.database.from('products').select('*').neq('is_deleted', true);
    if (errProducts) console.error("  Products error:", errProducts);
    const userProducts = dbProducts ? dbProducts.filter(p => p.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Products found: ${userProducts.length}`);

    console.log("7. Fetch financial accounts");
    const { data: dbAccounts, error: errAccounts } = await supabase.database.from('financial_accounts').select('*').neq('is_deleted', true);
    if (errAccounts) console.error("  Accounts error:", errAccounts);
    const userAccounts = dbAccounts ? dbAccounts.filter(a => a.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Accounts found: ${userAccounts.length}`);

    console.log("8. Fetch invoices");
    const { data: dbInvoices, error: errInvoices } = await supabase.database.from('invoices').select('*').neq('is_deleted', true);
    if (errInvoices) console.error("  Invoices error:", errInvoices);
    const userInvoices = dbInvoices ? dbInvoices.filter(i => i.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Invoices found: ${userInvoices.length}`);

    console.log("9. Fetch receipts");
    const { data: dbReceipts, error: errReceipts } = await supabase.database.from('receipts').select('*').neq('is_deleted', true);
    if (errReceipts) console.error("  Receipts error:", errReceipts);
    const userReceipts = dbReceipts ? dbReceipts.filter(r => r.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Receipts found: ${userReceipts.length}`);

    console.log("10. Fetch purchase orders");
    const { data: dbPo, error: errPo } = await supabase.database.from('purchase_orders').select('*').neq('is_deleted', true);
    if (errPo) console.error("  PO error:", errPo);
    const userPo = dbPo ? dbPo.filter(po => po.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  PO found: ${userPo.length}`);

    console.log("11. Fetch support tickets");
    const { data: dbTickets, error: errTickets } = await supabase.database.from('support_tickets').select('*');
    if (errTickets) console.error("  Tickets error:", errTickets);
    const userTickets = dbTickets ? dbTickets.filter(t => t.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Tickets found: ${userTickets.length}`);

    console.log("12. Fetch expenses");
    const { data: dbExpenses, error: errExpenses } = await supabase.database.from('expenses').select('*').neq('is_deleted', true);
    if (errExpenses) console.error("  Expenses error:", errExpenses);
    const userExpenses = dbExpenses ? dbExpenses.filter(e => e.id.startsWith(`${currentUserId}_`)) : [];
    console.log(`  Expenses found: ${userExpenses.length}`);

  } catch (err) {
    console.error("Uncaught sync error:", err);
  }
}

run();
