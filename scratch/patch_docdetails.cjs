const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/billing/DocumentDetailsView.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add states
const stateTarget = `  const [payMethod, setPayMethod] = useState<PaymentMethod>('Efectivo');
  const [payNotes, setPayNotes] = useState('');`;
const stateReplacement = `  const [payMethod, setPayMethod] = useState<PaymentMethod>('Efectivo');
  const [payNotes, setPayNotes] = useState('');
  const [retainedItbis, setRetainedItbis] = useState('');
  const [retainedIsr, setRetainedIsr] = useState('');
  const [retentionNumber, setRetentionNumber] = useState('');
  const [showRetentions, setShowRetentions] = useState(false);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Add signature type update for payInvoice
const propTarget = `payInvoice: (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string) => void;`;
const propReplacement = `payInvoice: (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string, accountId?: string, retainedItbis?: number, retainedIsr?: number, retentionNumber?: string) => void;`;
content = content.replace(propTarget, propReplacement);

// 3. Update remaining balance logic (summing retentions from previous receipts)
const balanceTarget = `const totalPaidSum = associatedReceipts.reduce((sum, r) => sum + r.amountPaid, 0);`;
const balanceReplacement = `const totalPaidSum = associatedReceipts.reduce((sum, r) => sum + r.amountPaid + (r.retainedItbis || 0) + (r.retainedIsr || 0), 0);`;
content = content.replace(balanceTarget, balanceReplacement);

// 4. Update handleRegisterPayment
const submitTarget = `      payInvoice(invoice.id, parsedAmount, payMethod, payNotes);
      setInlinePaying(false);
      setPayNotes('');
      // Auto align state
      setPayAmount(String(Math.max(0, remaingBalance - parsedAmount)));`;
const submitReplacement = `      payInvoice(invoice.id, parsedAmount, payMethod, payNotes, undefined, parseFloat(retainedItbis) || undefined, parseFloat(retainedIsr) || undefined, retentionNumber || undefined);
      setInlinePaying(false);
      setPayNotes('');
      setRetainedItbis('');
      setRetainedIsr('');
      setRetentionNumber('');
      setShowRetentions(false);
      // Auto align state
      const totalDed = parsedAmount + (parseFloat(retainedItbis) || 0) + (parseFloat(retainedIsr) || 0);
      setPayAmount(String(Math.max(0, remaingBalance - totalDed)));`;
content = content.replace(submitTarget, submitReplacement);

// 5. Add UI fields in the form (before payNotes)
const uiTarget = `                          <div className="space-y-1">
                            <Label htmlFor="pay-note" className="text-[10px] font-semibold text-neutral-700">Notas / Comentario (Opcional)</Label>`;
const uiReplacement = `                          {/* RETENTION TOGGLE */}
                          {!isMixedPayment && (
                            <div className="pt-2 border-t border-neutral-150">
                              <label className="flex items-center gap-1.5 select-none text-[10px] text-neutral-600 cursor-pointer font-bold">
                                <input
                                  type="checkbox"
                                  checked={showRetentions}
                                  onChange={(e) => setShowRetentions(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3 h-3"
                                />
                                <span>Aplicar Notas de Retención (ITBIS/ISR)</span>
                              </label>
                            </div>
                          )}

                          {showRetentions && !isMixedPayment && (
                            <div className="grid grid-cols-2 gap-2 bg-neutral-100/50 p-2 rounded border border-neutral-200">
                              <div className="space-y-1">
                                <Label className="text-[9px] font-bold text-neutral-600 block">ITBIS Retenido</Label>
                                <Input
                                  type="number" step="0.01" value={retainedItbis} onChange={(e) => setRetainedItbis(e.target.value)}
                                  className="h-7 text-xs" placeholder="0.00"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[9px] font-bold text-neutral-600 block">ISR Retenido</Label>
                                <Input
                                  type="number" step="0.01" value={retainedIsr} onChange={(e) => setRetainedIsr(e.target.value)}
                                  className="h-7 text-xs" placeholder="0.00"
                                />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <Label className="text-[9px] font-bold text-neutral-600 block">Nº Constancia Retención</Label>
                                <Input
                                  type="text" value={retentionNumber} onChange={(e) => setRetentionNumber(e.target.value)}
                                  className="h-7 text-xs" placeholder="Ej. 12345678"
                                />
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <Label htmlFor="pay-note" className="text-[10px] font-semibold text-neutral-700">Notas / Comentario (Opcional)</Label>`;
content = content.replace(uiTarget, uiReplacement);

// 6. Fix the "Suma Recibos Emitidos" list to show retentions
const receiptListTarget = `                          <span className="text-emerald-700 font-bold">{rec.amountPaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-1 leading-none">
                          <span>{new Date(rec.date).toLocaleDateString('es-DO')}</span>
                          <span>Vía: {rec.paymentMethod}</span>
                        </div>
                        {rec.notes && (`;
const receiptListReplacement = `                          <span className="text-emerald-700 font-bold">{rec.amountPaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-1 leading-none">
                          <span>{new Date(rec.date).toLocaleDateString('es-DO')}</span>
                          <span>Vía: {rec.paymentMethod}</span>
                        </div>
                        {(rec.retainedItbis || rec.retainedIsr) && (
                          <div className="mt-1 text-[9px] text-amber-600 font-semibold leading-none">
                            Retenciones: ITBIS {rec.retainedItbis || 0} | ISR {rec.retainedIsr || 0}
                            {rec.retentionNumber && \` (Nº \${rec.retentionNumber})\`}
                          </div>
                        )}
                        {rec.notes && (`;
content = content.replace(receiptListTarget, receiptListReplacement);

fs.writeFileSync(file, content);
console.log("DocumentDetailsView updated with Retentions logic.");
