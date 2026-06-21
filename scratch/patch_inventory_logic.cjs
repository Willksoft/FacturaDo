const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(file, 'utf8');

const targetLogic = `    if (!isQuote) {
      const updatedProducts = products.map(prod => {
        const itemOrdered = resolvedItems.find(it => it.productId === prod.id);
        if (itemOrdered && prod.type === 'Producto') {
          const newStock = Math.max(0, prod.stock - itemOrdered.quantity);
          const prefix = getDbPrefix();
          insforge.database.from('products').update({ stock: newStock }).eq('id', \`\${prefix}\${prod.id}\`).then(({ error }) => {
            if (error) console.error('Database stock update error', error);
          });

          addInventoryMovement(
            prod.id,
            'Salida',
            itemOrdered.quantity,
            prod.stock,
            newStock,
            'Venta',
            newDoc.id,
            \`Venta facturada bajo No. \${newDoc.invoiceNumber}\`
          );

          return {
            ...prod,
            stock: newStock,
          };
        }
        return prod;
      });
      setProducts(updatedProducts);
      saveToStorage('inv_products', updatedProducts);
    }`;

const newLogic = `    if (!isQuote) {
      let updatedProducts = [...products];
      const prefix = getDbPrefix();

      resolvedItems.forEach(itemOrdered => {
        const prodIndex = updatedProducts.findIndex(p => p.id === itemOrdered.productId);
        if (prodIndex === -1) return;
        
        let prod = { ...updatedProducts[prodIndex] };
        
        if (prod.type === 'Producto') {
          // If it's a Kit, deduct components
          if (prod.isKit && prod.kitItems && prod.kitItems.length > 0) {
            prod.kitItems.forEach(ki => {
              const compIndex = updatedProducts.findIndex(p => p.id === ki.productId);
              if (compIndex !== -1) {
                let comp = { ...updatedProducts[compIndex] };
                const qtyToDeduct = ki.quantity * itemOrdered.quantity;
                const newStock = Math.max(0, comp.stock - qtyToDeduct);
                
                insforge.database.from('products').update({ stock: newStock }).eq('id', \`\${prefix}\${comp.id}\`).then(({ error }) => {
                  if (error) console.error('Kit Component update error', error);
                });
                
                addInventoryMovement(comp.id, 'Salida', qtyToDeduct, comp.stock, newStock, 'Venta', newDoc.id, \`Venta Kit \${prod.name} (Factura \${newDoc.invoiceNumber})\`);
                comp.stock = newStock;
                updatedProducts[compIndex] = comp;
              }
            });
          }

          // Deduct from Batches (FIFO)
          let remainingToDeduct = itemOrdered.quantity;
          let newBatches = [...(prod.batches || [])];
          if (newBatches.length > 0) {
            newBatches.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
            for (let i = 0; i < newBatches.length; i++) {
              if (remainingToDeduct <= 0) break;
              if (newBatches[i].stock > 0) {
                const deduction = Math.min(newBatches[i].stock, remainingToDeduct);
                newBatches[i].stock -= deduction;
                remainingToDeduct -= deduction;
              }
            }
          }
          
          // Deduct main stock
          const newStock = Math.max(0, prod.stock - itemOrdered.quantity);
          
          const updates: any = { stock: newStock };
          if(prod.batches && prod.batches.length > 0) {
            updates.batches = newBatches;
          }

          insforge.database.from('products').update(updates).eq('id', \`\${prefix}\${prod.id}\`).then(({ error }) => {
            if (error) console.error('Database stock update error', error);
          });

          addInventoryMovement(prod.id, 'Salida', itemOrdered.quantity, prod.stock, newStock, 'Venta', newDoc.id, \`Venta facturada bajo No. \${newDoc.invoiceNumber}\`);

          prod.stock = newStock;
          prod.batches = newBatches;
          updatedProducts[prodIndex] = prod;
        }
      });
      
      setProducts(updatedProducts);
      saveToStorage('inv_products', updatedProducts);
    }`;

if(content.includes(targetLogic)) {
    content = content.replace(targetLogic, newLogic);
    fs.writeFileSync(file, content);
    console.log('useInvoiceState.ts patched for Refined Inventory logic!');
} else {
    console.error('Target logic not found in useInvoiceState.ts');
}
