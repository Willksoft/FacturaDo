const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add BankReconciliationView lazy import
const lazyTarget = "const ConfigRolesView = React.lazy(() => Specialized.then(m => ({ default: m.ConfigRolesView })));";
const newLazy = `const ConfigRolesView = React.lazy(() => Specialized.then(m => ({ default: m.ConfigRolesView })));\nconst BankReconciliationView = React.lazy(() => import('./features/accounting/BankReconciliationView').then(m => ({ default: m.BankReconciliationView })));`;
if (!content.includes('BankReconciliationView = React.lazy')) {
  content = content.replace(lazyTarget, newLazy);
}

// 2. Add 'conciliacion' to TabType
const tabTypeTarget = "| 'estado-negocio';";
const newTabType = "| 'estado-negocio'\n  | 'conciliacion';";
if (!content.includes("| 'conciliacion';")) {
  content = content.replace(tabTypeTarget, newTabType);
}

// 3. Add to sidebarCategories under "Finanzas"
const finanzasTarget = "{ id: 'bancos', name: 'Bancos', icon: Landmark },";
const newFinanzas = `{ id: 'bancos', name: 'Bancos', icon: Landmark },
      { id: 'conciliacion', name: 'Conciliación Bancaria', icon: FileSpreadsheet },`;
if (!content.includes("{ id: 'conciliacion'")) {
  content = content.replace(finanzasTarget, newFinanzas);
}

// 4. Add the component to render tree
const renderTarget = `currentTab === 'bancos' ? (
              <FinancialBancosView financialAccounts={financialAccounts} />
            ) :`;
const newRender = `currentTab === 'bancos' ? (
              <FinancialBancosView financialAccounts={financialAccounts} />
            ) : currentTab === 'conciliacion' ? (
              <BankReconciliationView 
                financialAccounts={financialAccounts} 
                receipts={receipts} 
                expenses={expenses} 
                currentUser={currentUser} 
              />
            ) :`;
if (!content.includes("currentTab === 'conciliacion' ?")) {
  content = content.replace(renderTarget, newRender);
}

fs.writeFileSync(file, content);
console.log("App.tsx patched for Bank Reconciliation successfully!");
