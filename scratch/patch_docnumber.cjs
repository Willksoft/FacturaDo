const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

// Patch docNumber generation
const oldCode = `    // Use max sequence from existing docs to avoid numbering collisions after deletions
    const existingDocs = invoices.filter(inv => inv.type === data.type);
    const maxExistingNumber = existingDocs.reduce((max, inv) => {
      const match = inv.invoiceNumber?.match(/-(\\d{4})$/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    const count = maxExistingNumber + 1;
    const docPrefix = isQuote ? 'COT' : 'FAC';
    const docNumber = \`\${docPrefix}-\${new Date().getFullYear()}-\${String(count).padStart(4, '0')}\`;`;

const newCode = `    // Use max sequence from existing docs to avoid numbering collisions after deletions
    const existingDocs = invoices.filter(inv => inv.type === data.type);
    const maxExistingNumber = existingDocs.reduce((max, inv) => {
      const match = inv.invoiceNumber?.match(/[-](\\d{4,6})$/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    const count = maxExistingNumber + 1;
    const docPrefix = isQuote ? 'COT' : 'FAC';
    const docNumber = templateSettings.informalMode
      ? \`\${docPrefix}-\${String(count).padStart(6, '0')}\`
      : \`\${docPrefix}-\${new Date().getFullYear()}-\${String(count).padStart(4, '0')}\`;`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(file, content);
  console.log('Patched docNumber in createInvoiceOrQuote.');
} else {
  // Try a trimmer approach
  const alt = `    const docNumber = \`\${docPrefix}-\${new Date().getFullYear()}-\${String(count).padStart(4, '0')}\`;`;
  const altReplacement = `    const docNumber = templateSettings.informalMode
      ? \`\${docPrefix}-\${String(count).padStart(6, '0')}\`
      : \`\${docPrefix}-\${new Date().getFullYear()}-\${String(count).padStart(4, '0')}\`;`;
  if (content.includes(alt)) {
    content = content.replace(alt, altReplacement);
    // Also patch the regex
    const regexOld = `      const match = inv.invoiceNumber?.match(/-(\\\\d{4})$/);`;
    const regexNew = `      const match = inv.invoiceNumber?.match(/[-.](\\\\d{4,6})$/);`;
    content = content.replace(regexOld, regexNew);
    fs.writeFileSync(file, content);
    console.log('Patched docNumber (alt approach) in createInvoiceOrQuote.');
  } else {
    console.error('Could not find target to patch');
    process.exit(1);
  }
}
