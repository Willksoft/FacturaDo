const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace all redundant filters
content = content.replace(/dbClients \? dbClients\.filter\(c => c\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbClients || []');
content = content.replace(/dbNcf \? dbNcf\.filter\(n => n\.type\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbNcf || []');
content = content.replace(/dbProviders \? dbProviders\.filter\(p => p\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbProviders || []');
content = content.replace(/dbWarehouses \? dbWarehouses\.filter\(w => w\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbWarehouses || []');
content = content.replace(/dbProducts \? dbProducts\.filter\(p => p\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbProducts || []');
content = content.replace(/dbAccounts \? dbAccounts\.filter\(a => a\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbAccounts || []');
content = content.replace(/dbInvoices \? dbInvoices\.filter\(i => i\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbInvoices || []');
content = content.replace(/dbReceipts \? dbReceipts\.filter\(r => r\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbReceipts || []');
content = content.replace(/dbPo \? dbPo\.filter\(po => po\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbPo || []');
content = content.replace(/dbTickets \? dbTickets\.filter\(t => t\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbTickets || []');
content = content.replace(/dbExpenses \? dbExpenses\.filter\(e => e\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbExpenses || []');
content = content.replace(/dbExpensePayments \? dbExpensePayments\.filter\(ep => ep\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbExpensePayments || []');
content = content.replace(/dbPoPayments \? dbPoPayments\.filter\(pop => pop\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbPoPayments || []');
content = content.replace(/dbShifts \? dbShifts\.filter\(sh => sh\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbShifts || []');
content = content.replace(/dbSellers \? dbSellers\.filter\(s => s\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbSellers || []');
content = content.replace(/dbMovements \? dbMovements\.filter\(m => m\.id\.startsWith\(`\${currentUserId}_`\)\) : \[\]/g, 'dbMovements || []');

// Also the loadMoreInvoices logic
content = content.replace(/const userInvoices = dbInvoices\.filter\(i => i\.id\.startsWith\(currentUserId \+ '_'\)\);/g, 'const userInvoices = dbInvoices || [];');
content = content.replace(/if \(userInvoices\.length > 0\) {/g, 'if (userInvoices && userInvoices.length > 0) {');

fs.writeFileSync(file, content);
console.log("Removed RLS filters from useInvoiceState.ts");
