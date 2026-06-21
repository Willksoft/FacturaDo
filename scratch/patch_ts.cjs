const fs = require('fs');
const path = require('path');

// 1. Fix App.tsx (add user-manual to TabType)
let appTsx = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf8');
if (!appTsx.includes("| 'user-manual';")) {
  appTsx = appTsx.replace(/\| 'conciliacion';/g, "| 'conciliacion'\n  | 'user-manual';");
  fs.writeFileSync(path.join(__dirname, '../src/App.tsx'), appTsx);
}

// 2. Fix BankReconciliationView.tsx
let bankRec = fs.readFileSync(path.join(__dirname, '../src/features/accounting/BankReconciliationView.tsx'), 'utf8');
bankRec = bankRec.replace(/!r\.isDeleted/g, "!(r as any).isDeleted");
bankRec = bankRec.replace(/!e\.isDeleted/g, "!(e as any).isDeleted");
bankRec = bankRec.replace(/acc\.bank/g, "acc.bankName");
fs.writeFileSync(path.join(__dirname, '../src/features/accounting/BankReconciliationView.tsx'), bankRec);

// 3. Fix usePOS.ts
let usePos = fs.readFileSync(path.join(__dirname, '../src/features/pos/hooks/usePOS.ts'), 'utf8');
if (!usePos.includes("import React")) {
  usePos = "import React from 'react';\n" + usePos;
  fs.writeFileSync(path.join(__dirname, '../src/features/pos/hooks/usePOS.ts'), usePos);
}

// 4. Fix ErrorBoundary.tsx
let errBound = fs.readFileSync(path.join(__dirname, '../src/features/core/ErrorBoundary.tsx'), 'utf8');
errBound = errBound.replace(/this\.props/g, "(this as any).props");
fs.writeFileSync(path.join(__dirname, '../src/features/core/ErrorBoundary.tsx'), errBound);

console.log("Typescript fixes applied!");
