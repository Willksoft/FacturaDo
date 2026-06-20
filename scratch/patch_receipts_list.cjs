const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/billing/ReceiptsList.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update Props Interface
if (!content.includes('searchReceipts?:')) {
  content = content.replace(
    /onNavigateToPendingInvoices\?: \(\) => void;/g,
    'onNavigateToPendingInvoices?: () => void;\n  searchReceipts?: (q: string) => void;'
  );
}

// Update component destructuring
if (!content.includes('searchReceipts,')) {
  content = content.replace(
    /onNavigateToPendingInvoices\n}: ReceiptsListProps/g,
    'onNavigateToPendingInvoices,\n  searchReceipts\n}: ReceiptsListProps'
  );
}

// Add useEffect for debounced search
const useEffectCode = `
  // Server-Side Search Debounce
  React.useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const handler = setTimeout(() => {
        if (searchReceipts) {
          searchReceipts(searchTerm.trim());
        }
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [searchTerm, searchReceipts]);

  // Filtering Logic`;

if (!content.includes('Server-Side Search Debounce')) {
  content = content.replace(
    /const filteredReceipts = receipts\.filter/g,
    useEffectCode.trim() + '\n\n  const filteredReceipts = receipts.filter'
  );
}

fs.writeFileSync(file, content);
console.log("Updated ReceiptsList.tsx");
