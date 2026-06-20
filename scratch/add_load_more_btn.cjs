const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/billing/InvoiceList.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('loadMoreInvoices')) {
  // 1. Destructure loadMoreInvoices
  content = content.replace(
    /const { invoices, products, clients, /g,
    "const { invoices, loadMoreInvoices, products, clients, "
  );

  // 2. Add button at the bottom of the table
  const buttonHtml = `
      {invoices.length >= 200 && (
        <div className="p-4 border-t flex justify-center bg-gray-50">
          <button 
            onClick={() => loadMoreInvoices()}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cargar mÃ¡s facturas antiguas...
          </button>
        </div>
      )}
    </div>
  </div>`;
  
  // Replace the closing div of the table container
  content = content.replace(/<\/table>\s*<\/div>\s*<\/div>/g, "</table></div>" + buttonHtml);
  
  // Fix encoding issues if any in the replacement
  content = content.replace("mÃ¡s", "más");

  fs.writeFileSync(file, content);
  console.log("Added loadMoreInvoices button to InvoiceList.tsx");
} else {
  console.log("Already added");
}
