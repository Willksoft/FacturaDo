const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

const searchFunctions = `
  const searchReceipts = async (query: string) => {
    if (!query || query.length < 2) return;
    try {
      const { data: dbReceipts } = await insforge.database
        .from('receipts')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .ilike('receipt_number', \`%\${query}%\`)
        .limit(50);
        
      if (dbReceipts && dbReceipts.length > 0) {
        const prefix = getDbPrefix();
        const mapped = dbReceipts.map(db => {
          return {
            id: db.id,
            receiptNumber: db.receipt_number,
            date: db.date,
            invoiceId: db.invoice_id || null,
            clientId: db.client_id,
            amountPaid: parseFloat(db.amount_paid || 0),
            paymentMethod: db.payment_method,
            notes: db.notes || '',
            createdAt: db.created_at,
            accountId: db.account_id || null,
            pdfUrl: db.pdf_url || null
          };
        }).map(r => ({
          ...r,
          id: r.id.replace(prefix, ''),
          clientId: r.clientId.replace(prefix, ''),
          invoiceId: r.invoiceId ? r.invoiceId.replace(prefix, '') : undefined,
          accountId: r.accountId ? r.accountId.replace(prefix, '') : undefined
        }));
        
        setReceipts((prev: any[]) => {
          const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Error searching receipts", e);
    }
  };

  const searchExpenses = async (query: string) => {
    if (!query || query.length < 2) return;
    try {
      const { data: dbExpenses } = await insforge.database
        .from('expenses')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .or(\`expense_number.ilike.%\${query}%,description.ilike.%\${query}%\`)
        .limit(50);
        
      if (dbExpenses && dbExpenses.length > 0) {
        const prefix = getDbPrefix();
        const mapped = dbExpenses.map(db => {
          return {
            id: db.id,
            expenseNumber: db.expense_number,
            date: db.date,
            providerId: db.provider_id || null,
            description: db.description,
            amount: parseFloat(db.amount || 0),
            category: db.category,
            status: db.status || 'Pendiente',
            createdAt: db.created_at,
            receiptUrl: db.receipt_url || null,
            ncf: db.ncf || null
          };
        }).map(e => ({
          ...e,
          id: e.id.replace(prefix, ''),
          providerId: e.providerId ? e.providerId.replace(prefix, '') : undefined
        }));
        
        setExpenses((prev: any[]) => {
          const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Error searching expenses", e);
    }
  };

  const loadAllDataFromPostgres = async () => {`;

if (!content.includes('searchReceipts')) {
  content = content.replace("const loadAllDataFromPostgres = async () => {", searchFunctions);
  
  content = content.replace(
    "searchInvoices,",
    "searchInvoices,\n    searchReceipts,\n    searchExpenses,"
  );
  
  fs.writeFileSync(file, content);
  console.log("Added searchReceipts and searchExpenses");
} else {
  console.log("Functions already exist.");
}
