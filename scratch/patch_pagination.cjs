const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

// List of tables to paginate
const tablesToPaginate = [
  { table: 'invoices', name: 'invoices' },
  { table: 'receipts', name: 'receipts' },
  { table: 'purchase_orders', name: 'purchaseOrders' },
  { table: 'purchase_order_payments', name: 'purchaseOrderPayments' },
  { table: 'expenses', name: 'expenses' },
  { table: 'expense_payments', name: 'expensePayments' },
  { table: 'shifts', name: 'shifts' },
  { table: 'audit_logs', name: 'auditLogs' },
  { table: 'inventory_movements', name: 'inventoryMovements' }
];

// We will replace .select('*') with .select('*').order('created_at', { ascending: false }).limit(200)
tablesToPaginate.forEach(t => {
  const searchRegex1 = new RegExp(`from\\('${t.table}'\\)\\.select\\('\\*'\\)\\.or\\('is_deleted\\.is\\.null,is_deleted\\.eq\\.false'\\)`, 'g');
  const replace1 = `from('${t.table}').select('*').or('is_deleted.is.null,is_deleted.eq.false').limit(200)`;
  
  const searchRegex2 = new RegExp(`from\\('${t.table}'\\)\\.select\\('\\*'\\)(?!\\.)`, 'g');
  const replace2 = `from('${t.table}').select('*').limit(200)`;

  content = content.replace(searchRegex1, replace1);
  content = content.replace(searchRegex2, replace2);
});

fs.writeFileSync(file, content);
console.log("Patched loadAllDataFromPostgres to limit to 200 records for transactions.");
