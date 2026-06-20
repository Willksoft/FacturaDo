const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/setFinancialAccounts\(\(current\)/g, "setFinancialAccounts((current: FinancialAccount[])");
content = content.replace(/setFinancialAccounts\(current =>/g, "setFinancialAccounts((current: FinancialAccount[]) =>");
content = content.replace(/setFinancialAccounts\(\(prev\)/g, "setFinancialAccounts((prev: FinancialAccount[])");

content = content.replace(/setPurchaseOrders\(\(current\)/g, "setPurchaseOrders((current: PurchaseOrder[])");
content = content.replace(/setPurchaseOrders\(current =>/g, "setPurchaseOrders((current: PurchaseOrder[]) =>");

fs.writeFileSync(file, content);
console.log("Fixed explicit types in useInvoiceState.");
