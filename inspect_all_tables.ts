import { createClient } from '@insforge/sdk';

const url = 'https://zdwuav42.us-east.insforge.app';
const key = 'ik_6c00d197d71798784cb69a5536c67fe1';

const supabase = createClient({ baseUrl: url, anonKey: key });

const tables = [
  'template_settings',
  'clients',
  'ncf_sequences',
  'providers',
  'warehouses',
  'products',
  'financial_accounts',
  'invoices',
  'receipts',
  'purchase_orders',
  'support_tickets',
  'expenses'
];

async function run() {
  for (const table of tables) {
    console.log(`Checking table: ${table}...`);
    const { data, error } = await supabase.database.from(table).select('*').limit(1);
    if (error) {
      console.error(`  Error reading table ${table}:`, error.message);
    } else {
      console.log(`  Success. Column names:`, data && data.length > 0 ? Object.keys(data[0]) : '(empty table)');
      // If table is empty, let's check by querying one row with is_deleted if we can, or just print info
      if (!data || data.length === 0) {
        // Let's try querying with is_deleted column to see if it errors
        const testDel = await supabase.database.from(table).select('is_deleted').limit(1);
        if (testDel.error) {
          console.log(`  Table ${table} does NOT have 'is_deleted' column.`);
        } else {
          console.log(`  Table ${table} HAS 'is_deleted' column.`);
        }
      }
    }
  }
}

run();
