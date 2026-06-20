const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

const loadMoreFn = `
  const loadMoreInvoices = async () => {
    try {
      const currentLength = invoices.length;
      const { data: dbInvoices } = await insforge.database
        .from('invoices')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .range(currentLength, currentLength + 200 - 1);
        
      if (dbInvoices && dbInvoices.length > 0) {
        const currentUserId = authUserIdRef.current;
        const userInvoices = dbInvoices.filter(i => i.id.startsWith(currentUserId + '_'));
        if (userInvoices.length > 0) {
          const mapped = userInvoices.map(mapInvoiceFromDb).map(i => ({
            ...i,
            id: i.id.replace(currentUserId + '_', '')
          }));
          setInvoices((prev: Invoice[]) => {
            const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
            return [...prev, ...newItems];
          });
        }
      }
    } catch (e) {
      console.error("Error loading more invoices", e);
    }
  };

  const loadAllDataFromPostgres = async () => {`;

content = content.replace("const loadAllDataFromPostgres = async () => {", loadMoreFn);

content = content.replace("loadAllDataFromPostgres,", "loadAllDataFromPostgres,\n    loadMoreInvoices,");

fs.writeFileSync(file, content);
console.log("Added loadMoreInvoices to useInvoiceState.ts");
