const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/accounting/ExpensesView.tsx');
let content = fs.readFileSync(file, 'utf8');

// Fix the Props interface
if (!content.includes('searchExpenses?: (q: string) => void;')) {
  content = content.replace(
    /currentUser: \{ role: string \};/g,
    'currentUser: { role: string };\n  searchExpenses?: (q: string) => void;'
  );
  fs.writeFileSync(file, content);
  console.log("Updated ExpensesView.tsx props");
} else {
  console.log("Already updated");
}
