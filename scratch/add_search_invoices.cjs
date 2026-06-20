const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

const searchInvoicesFn = `
  const searchInvoices = async (query: string) => {
    if (!query || query.length < 2) return;
    try {
      const { data: dbInvoices } = await insforge.database
        .from('invoices')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .ilike('invoice_number', \`%\${query}%\`)
        .limit(50);
        
      if (dbInvoices && dbInvoices.length > 0) {
        const mapped = dbInvoices.map(db => mapInvoiceFromDb(db, clients)).map(i => ({
          ...i,
          id: i.id.replace(getDbPrefix(), '')
        }));
        
        setInvoices((prev: Invoice[]) => {
          const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Error searching invoices", e);
    }
  };

  const loadAllDataFromPostgres = async () => {`;

content = content.replace("const loadAllDataFromPostgres = async () => {", searchInvoicesFn);

content = content.replace("loadMoreInvoices,", "loadMoreInvoices,\n    searchInvoices,");

fs.writeFileSync(file, content);
console.log("Added searchInvoices to useInvoiceState.ts");
