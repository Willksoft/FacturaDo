const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/billing/InvoiceList.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update filter status type
content = content.replace(
  `useState<'Todas' | 'Pagada' | 'Pendiente' | 'Anulada'>`,
  `useState<'Todas' | 'Pagada' | 'Pendiente' | 'Anulada' | 'Parcial'>`
);

// 2. Add 'Parcial' to filter dropdown
content = content.replace(
  `<SelectItem value="Pendiente">Pendientes</SelectItem>`,
  `<SelectItem value="Pendiente">Pendientes</SelectItem>\n              <SelectItem value="Parcial">Parciales</SelectItem>`
);

// 3. Update status badge logic inside the table (three occurrences or more of isPaid / status badge)
// Let's replace the common badge rendering:
// inv.status === 'Pagada' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : inv.status === 'Pendiente' ? 'bg-amber-50 text-amber-800 border border-amber-250' : 'bg-red-50 text-red-800 border border-red-250'
const oldBadgeLogic1 = `inv.status === 'Pagada' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' :`;
const oldBadgeLogic2 = `inv.status === 'Pendiente' ? 'bg-amber-50 text-amber-800 border border-amber-250' :`;
const newBadgeLogic1 = `inv.status === 'Pagada' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : inv.status === 'Parcial' ? 'bg-orange-50 text-orange-800 border border-orange-250' :`;

content = content.split(oldBadgeLogic1).join(newBadgeLogic1);

// Add remaining balance if status is Parcial
const oldTotal = `<div className="font-bold text-neutral-900">{formatCurrency(inv.total)}</div>`;
const newTotal = `<div className="font-bold text-neutral-900">{formatCurrency(inv.total)}</div>
                        {inv.status === 'Parcial' && (
                          <div className="text-[10px] text-orange-600 font-semibold mt-0.5">
                            Restante: {formatCurrency(inv.total - (receipts.filter(r => r.invoiceId === inv.id).reduce((sum, r) => sum + r.amountPaid, 0)))}
                          </div>
                        )}`;
content = content.split(oldTotal).join(newTotal);

fs.writeFileSync(file, content);
console.log("InvoiceList patched successfully!");
