const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace state.searchInvoices with searchInvoices
content = content.replace(/searchInvoices=\{state\.searchInvoices\}/g, 'searchInvoices={searchInvoices}');
content = content.replace(/loadMoreInvoices=\{state\.loadMoreInvoices\}/g, 'loadMoreInvoices={loadMoreInvoices}');

// Add them to the destructuring
if (!content.includes('searchInvoices,')) {
  content = content.replace(
    'loadAllDataFromPostgres,',
    'loadAllDataFromPostgres,\n    searchInvoices,\n    loadMoreInvoices,'
  );
}

fs.writeFileSync(file, content);
console.log("Fixed App.tsx state references");
