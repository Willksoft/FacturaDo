const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// Destructure searchReceipts and searchExpenses in App.tsx
if (!content.includes('searchReceipts,')) {
  content = content.replace(
    'searchInvoices,',
    'searchInvoices,\n    searchReceipts,\n    searchExpenses,'
  );
}

// Update ReceiptsList props
if (!content.includes('searchReceipts={searchReceipts}')) {
  content = content.replace(
    /<ReceiptsList/g,
    '<ReceiptsList\n              searchReceipts={searchReceipts}'
  );
}

// Update ExpensesView props
if (!content.includes('searchExpenses={searchExpenses}')) {
  content = content.replace(
    /<ExpensesView/g,
    '<ExpensesView\n              searchExpenses={searchExpenses}'
  );
}

fs.writeFileSync(file, content);
console.log("Updated App.tsx to pass searchReceipts and searchExpenses");
