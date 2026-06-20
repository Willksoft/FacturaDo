const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const mapped = userInvoices.map(mapInvoiceFromDb).map(i => ({",
  "const mapped = userInvoices.map(db => mapInvoiceFromDb(db, clients)).map(i => ({"
);

fs.writeFileSync(file, content);
console.log("Fixed mapInvoiceFromDb call in useInvoiceState.ts");
