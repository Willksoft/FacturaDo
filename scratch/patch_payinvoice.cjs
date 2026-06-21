const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

const target = `  const payInvoice = (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string, accountId?: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const previousPaid = receipts.filter(r => r.invoiceId === invoiceId).reduce((sum, r) => sum + r.amountPaid, 0);
    const newTotalPaid = previousPaid + amount;
    const newStatus = newTotalPaid >= (invoice.total - 0.1) ? 'Pagada' : 'Pendiente';`;

const replacement = `  const payInvoice = (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string, accountId?: string, retainedItbis?: number, retainedIsr?: number, retentionNumber?: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const previousPaid = receipts.filter(r => r.invoiceId === invoiceId).reduce((sum, r) => sum + r.amountPaid + (r.retainedItbis || 0) + (r.retainedIsr || 0), 0);
    const newTotalPaid = previousPaid + amount + (retainedItbis || 0) + (retainedIsr || 0);
    const newStatus = newTotalPaid >= (invoice.total - 0.1) ? 'Pagada' : 'Pendiente';`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  
  const targetNewReceipt = `      accountId,
      accountName: selectedAccountName || undefined,
      date: new Date().toISOString(),
      notes,
    };`;
    
  const replacementNewReceipt = `      accountId,
      accountName: selectedAccountName || undefined,
      date: new Date().toISOString(),
      notes,
      retainedItbis,
      retainedIsr,
      retentionNumber,
    };`;
    
  if (content.includes(targetNewReceipt)) {
    content = content.replace(targetNewReceipt, replacementNewReceipt);
    fs.writeFileSync(file, content);
    console.log("Updated payInvoice function successfully.");
  } else {
    console.log("Could not find newReceipt target.");
  }
} else {
  console.log("Could not find payInvoice target.");
}
