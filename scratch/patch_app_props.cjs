const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<InvoiceList/g, '<InvoiceList\n              searchInvoices={state.searchInvoices}\n              loadMoreInvoices={state.loadMoreInvoices}');

fs.writeFileSync(file, content);
console.log("Updated App.tsx to pass searchInvoices and loadMoreInvoices");
