const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/billing/InvoiceList.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Destructure searchInvoices
if (!content.includes('searchInvoices')) {
  content = content.replace(
    /const { invoices, loadMoreInvoices, products, clients, /g,
    "const { invoices, loadMoreInvoices, searchInvoices, products, clients, "
  );

  // 2. Add useEffect for debounced search
  const useEffectCode = `
  // Server-Side Search Debounce
  React.useEffect(() => {
    if (listSearch.trim().length >= 2) {
      const handler = setTimeout(() => {
        if (searchInvoices) {
          searchInvoices(listSearch.trim());
        }
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [listSearch, searchInvoices]);

  // Filtering Logic`;

  content = content.replace("// Filtering Logic", useEffectCode);

  fs.writeFileSync(file, content);
  console.log("Added server-side search hook to InvoiceList.tsx");
} else {
  console.log("Already added");
}
