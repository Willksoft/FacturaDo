const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/billing/InvoiceList.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "onEditDocument?: (invoice: Invoice) => void;\n}",
  "onEditDocument?: (invoice: Invoice) => void;\n  searchInvoices?: (q: string) => void;\n  loadMoreInvoices?: () => void;\n}"
);

content = content.replace(
  "export default function InvoiceList({\n  invoices,\n  clients,",
  "export default function InvoiceList({\n  invoices,\n  searchInvoices,\n  loadMoreInvoices,\n  clients,"
);

fs.writeFileSync(file, content);
console.log("Updated InvoiceList props");
