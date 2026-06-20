const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/accounting/ExpensesView.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update Props Interface
if (!content.includes('searchExpenses?:')) {
  content = content.replace(
    /currentUser: any;/g,
    'currentUser: any;\n  searchExpenses?: (q: string) => void;'
  );
}

// Update component destructuring
if (!content.includes('searchExpenses,')) {
  content = content.replace(
    /export function ExpensesView\(\{ expenses, addExpense, deleteExpense, currentUser, financialAccounts = \[\] \}: ExpensesViewProps\) \{/g,
    'export function ExpensesView({ expenses, addExpense, deleteExpense, currentUser, financialAccounts = [], searchExpenses }: ExpensesViewProps) {'
  );
}

// Add useEffect for debounced search
const useEffectCode = `
  // Server-Side Search Debounce
  React.useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const handler = setTimeout(() => {
        if (searchExpenses) {
          searchExpenses(searchTerm.trim());
        }
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [searchTerm, searchExpenses]);

  // Filtering Logic`;

if (!content.includes('Server-Side Search Debounce')) {
  content = content.replace(
    /const filteredExpenses = expenses\.filter/g,
    useEffectCode.trim() + '\n\n  const filteredExpenses = expenses.filter'
  );
}

fs.writeFileSync(file, content);
console.log("Updated ExpensesView.tsx");
