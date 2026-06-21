const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

const target = `const mapReceiptFromDb = (db: any): Receipt => ({
  id: db.id,
  receiptNumber: db.receipt_number,
  invoiceId: db.invoice_id,
  invoiceNumber: db.invoice_number,
  clientName: db.client_name,
  amountPaid: parseFloat(db.amount_paid || 0),
  paymentMethod: db.payment_method as PaymentMethod,
  date: db.date,
  notes: db.notes || undefined,
  accountId: db.account_id || undefined,
  accountName: db.account_name || undefined
});

const mapReceiptToDb = (rec: Receipt) => ({
  id: rec.id,
  receipt_number: rec.receiptNumber,
  invoice_id: rec.invoiceId || null,
  invoice_number: rec.invoiceNumber,
  client_name: rec.clientName,
  amount_paid: rec.amountPaid,
  payment_method: rec.paymentMethod,
  date: rec.date,
  notes: rec.notes || null,
  account_id: rec.accountId || null,
  account_name: rec.accountName || null,
  is_deleted: false
});`;

const replacement = `const mapReceiptFromDb = (db: any): Receipt => ({
  id: db.id,
  receiptNumber: db.receipt_number,
  invoiceId: db.invoice_id,
  invoiceNumber: db.invoice_number,
  clientName: db.client_name,
  amountPaid: parseFloat(db.amount_paid || 0),
  paymentMethod: db.payment_method as PaymentMethod,
  date: db.date,
  notes: db.notes || undefined,
  accountId: db.account_id || undefined,
  accountName: db.account_name || undefined,
  retainedItbis: parseFloat(db.retained_itbis || 0) || undefined,
  retainedIsr: parseFloat(db.retained_isr || 0) || undefined,
  retentionNumber: db.retention_number || undefined
});

const mapReceiptToDb = (rec: Receipt) => ({
  id: rec.id,
  receipt_number: rec.receiptNumber,
  invoice_id: rec.invoiceId || null,
  invoice_number: rec.invoiceNumber,
  client_name: rec.clientName,
  amount_paid: rec.amountPaid,
  payment_method: rec.paymentMethod,
  date: rec.date,
  notes: rec.notes || null,
  account_id: rec.accountId || null,
  account_name: rec.accountName || null,
  retained_itbis: rec.retainedItbis || 0,
  retained_isr: rec.retainedIsr || 0,
  retention_number: rec.retentionNumber || null,
  is_deleted: false
});`;

if (content.includes(target)) {
  fs.writeFileSync(file, content.replace(target, replacement));
  console.log("Updated mapReceipt DB mappers in useInvoiceState.ts");
} else {
  console.log("Could not find target to replace.");
}
