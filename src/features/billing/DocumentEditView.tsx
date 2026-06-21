import React, { useState, useEffect } from 'react';
import { Invoice, Client, Product, Seller, InvoiceItem, NcfType, PaymentMethod } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ArrowLeft, Save, Plus, Trash2, ShieldAlert, Sparkles } from 'lucide-react';

interface DocumentEditViewProps {
  invoice: Invoice;
  clients: Client[];
  sellers?: Seller[];
  products: Product[];
  onCancel: () => void;
  onSave: (id: string, updatedFields: Partial<Invoice>) => void;
}

export default function DocumentEditView({
  invoice,
  clients,
  products,
  onCancel,
  onSave,
}: DocumentEditViewProps) {
  const isQuote = invoice.type === 'Cotizacion';

  // Base edit fields initialized with existing document attributes
  const [selectedClientId, setSelectedClientId] = useState(invoice.client.id);
  const [editNcfType, setEditNcfType] = useState<NcfType>(invoice.ncfType);
  const [editSequenceNum, setEditSequenceNum] = useState(String(invoice.sequenceNumber));
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>(invoice.paymentMethod);
  const [editDueDate, setEditDueDate] = useState(() => {
    try {
      return invoice.dueDate.split('T')[0];
    } catch {
      return '';
    }
  });
  const [editNotes, setEditNotes] = useState(invoice.notes || '');
  
  // Concept lines state
  const [editItems, setEditItems] = useState<InvoiceItem[]>(() => {
    return invoice.items.map(it => ({
      productId: it.productId || '',
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      taxRate: it.taxRate,
      taxAmount: it.taxAmount,
      total: it.total,
    }));
  });

  // Current item selector helpers
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentTax, setCurrentTax] = useState(18);

  // Update item selector when product selected
  useEffect(() => {
    const prod = products.find(p => p.id === currentProductId);
    if (prod) {
      setCurrentPrice(prod.price);
      setCurrentTax(prod.taxRate);
      setCurrentName(prod.name);
    } else {
      setCurrentName('');
    }
  }, [currentProductId, products]);

  // Append new option parameter to concept array
  const handleAddConcept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProductId) return;

    const prod = products.find(p => p.id === currentProductId);
    if (!prod) return;

    // Support custom/modified names when matching existing rows
    const finalName = currentName.trim() || prod.name;
    const existingIndex = editItems.findIndex(it => it.productId === prod.id && it.name === finalName);
    if (existingIndex !== -1) {
      const updated = [...editItems];
      const newQty = updated[existingIndex].quantity + currentQty;
      const subtotal = newQty * currentPrice;
      const taxAmount = subtotal * (currentTax / 100);
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].price = currentPrice;
      updated[existingIndex].taxRate = currentTax;
      updated[existingIndex].taxAmount = parseFloat(taxAmount.toFixed(2));
      updated[existingIndex].total = parseFloat((subtotal + taxAmount).toFixed(2));
      setEditItems(updated);
    } else {
      const subtotal = currentQty * currentPrice;
      const taxAmount = subtotal * (currentTax / 100);
      const newItem: InvoiceItem = {
        productId: prod.id,
        name: finalName,
        price: currentPrice,
        quantity: currentQty,
        taxRate: currentTax,
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat((subtotal + taxAmount).toFixed(2)),
      };
      setEditItems([...editItems, newItem]);
    }

    // Reset picker
    setCurrentProductId('');
    setCurrentName('');
    setCurrentQty(1);
    setCurrentPrice(0);
    setCurrentTax(18);
  };

  const handleRemoveConcept = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const handleUpdateLineName = (index: number, newName: string) => {
    const updated = [...editItems];
    updated[index] = {
      ...updated[index],
      name: newName,
    };
    setEditItems(updated);
  };

  const handleUpdateLineQty = (index: number, qty: number) => {
    if (qty < 1) return;
    const updated = [...editItems];
    const item = updated[index];
    const subtotal = qty * item.price;
    const taxValue = subtotal * (item.taxRate / 100);
    updated[index] = {
      ...item,
      quantity: qty,
      taxAmount: parseFloat(taxValue.toFixed(2)),
      total: parseFloat((subtotal + taxValue).toFixed(2)),
    };
    setEditItems(updated);
  };

  const handleUpdateLinePrice = (index: number, price: number) => {
    if (price < 0) return;
    const updated = [...editItems];
    const item = updated[index];
    const subtotal = item.quantity * price;
    const taxValue = subtotal * (item.taxRate / 100);
    updated[index] = {
      ...item,
      price,
      taxAmount: parseFloat(taxValue.toFixed(2)),
      total: parseFloat((subtotal + taxValue).toFixed(2)),
    };
    setEditItems(updated);
  };

  const handleSubmitEdits = () => {
    if (editItems.length === 0) {
      alert('Debe tener al menos un concepto o artículo en el documento.');
      return;
    }

    const clientObj = clients.find(c => c.id === selectedClientId);
    if (!clientObj) {
      alert('Asocie un cliente válido para el documento.');
      return;
    }

    // Recalculate totals
    const subtotal = editItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const taxAmount = editItems.reduce((acc, it) => acc + it.taxAmount, 0);
    const total = subtotal + taxAmount;

    // Generate new NCF if document type is Factura
    let newNcf = invoice.ncf;
    if (invoice.type === 'Factura') {
      if (editNcfType === 'SIN') {
        newNcf = 'SIN_COMPROBANTE';
      } else {
        const padding = String(editSequenceNum).padStart(8, '0');
        newNcf = `${editNcfType}${padding}`;
      }
    }

    const updatedData: Partial<Invoice> = {
      client: clientObj,
      ncfType: editNcfType,
      sequenceNumber: Number(editSequenceNum) || 0,
      ncf: newNcf,
      paymentMethod: editPaymentMethod,
      dueDate: new Date(editDueDate).toISOString(),
      notes: editNotes,
      items: editItems,
      subtotal,
      taxAmount,
      total,
    };

    onSave(invoice.id, updatedData);
  };

  // Calculates totals for live previews on the form
  const liveSubtotal = editItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const liveTax = editItems.reduce((acc, it) => acc + it.taxAmount, 0);
  const liveTotal = liveSubtotal + liveTax;

  return (
    <div className="space-y-6" id="edit-invoice-page">
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-250">
        <div className="space-y-1">
          <button
            onClick={onCancel}
            className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors gap-1.5"
            id="cancel-edit-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a Detalle
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading">
            Editar {isQuote ? 'Cotización' : 'Factura Fiscal'}
          </h2>
          <p className="text-xs text-neutral-500">
            Modifique los conceptos financieros de la operación {invoice.invoiceNumber}.
          </p>
        </div>
      </div>

      <div className="space-y-6" id="edit-invoice-content-area">
        {/* EDIT DETAILS COLUMN */}
        <div className="w-full space-y-6">
          <Card className="border-neutral-200 shadow-xs rounded-xl bg-white">
            <CardContent className="p-6 space-y-6">
              {/* PRIMARY PROPERTIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-client" className="text-xs font-semibold text-neutral-700">Cliente Asociado</Label>
                  <Select value={selectedClientId} onValueChange={(val) => setSelectedClientId(val)}>
                    <SelectTrigger id="edit-client" className="w-full h-9 bg-white border border-neutral-250 rounded-lg text-xs font-semibold text-neutral-900 focus:ring-1 focus:ring-neutral-950 shadow-xs">
                      {selectedClientId ? (
                        <span className="flex flex-1 text-left line-clamp-1">
                          {clients.find(c => c.id === selectedClientId)?.name || selectedClientId}
                        </span>
                      ) : (
                        <SelectValue placeholder="Seleccione un cliente" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="cli-consumo" className="text-xs hidden" disabled>Seleccione un cliente...</SelectItem>
                      {clients.map(c => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">
                          {c.name} ({c.type === 'Empresa' ? 'RNC: ' : 'Céd: '}{c.rncOrCedula})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-pmethod" className="text-xs font-semibold text-neutral-700">Condición de Pago</Label>
                  <Select value={editPaymentMethod} onValueChange={(val: PaymentMethod) => setEditPaymentMethod(val)}>
                    <SelectTrigger id="edit-pmethod" className="h-9 border-neutral-250 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo" className="text-xs">Efectivo</SelectItem>
                      <SelectItem value="Transferencia" className="text-xs">Transferencia</SelectItem>
                      <SelectItem value="Tarjeta" className="text-xs">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="Crédito" className="text-xs">Crédito a 30 Días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-ddate" className="text-xs font-semibold text-neutral-700">Fecha de Vencimiento</Label>
                  <Input
                    id="edit-ddate"
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="h-9 text-xs border-neutral-250"
                  />
                </div>
              </div>

              {/* DGII NCF TAX PARAMETERS - SHOWN ONLY FOR INVOICES */}
              {!isQuote && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-ncftype" className="text-xs font-bold text-neutral-700">Comprobante DGII NCF</Label>
                    <Select value={editNcfType} onValueChange={(val: NcfType) => setEditNcfType(val)}>
                      <SelectTrigger id="edit-ncftype" className="h-9 bg-white border-neutral-250 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B01" className="text-xs">Crédito Fiscal (B01)</SelectItem>
                        <SelectItem value="B02" className="text-xs">Consumo / Consumidor Final (B02)</SelectItem>
                        <SelectItem value="B14" className="text-xs">Regímenes Especiales (B14)</SelectItem>
                        <SelectItem value="B15" className="text-xs">Gubernamental (B15)</SelectItem>
                        <SelectItem value="SIN" className="text-xs">Gastos Menores / Sin NCF (SIN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editNcfType !== 'SIN' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-seq" className="text-xs font-bold text-neutral-700">Secuencia Numérica</Label>
                      <Input
                        id="edit-seq"
                        type="number"
                        value={editSequenceNum}
                        onChange={(e) => setEditSequenceNum(e.target.value)}
                        className="h-9 bg-white text-xs border-neutral-250"
                        placeholder="Ej. 182"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ADD DYNAMIC CONCEPTS FORM */}
              <div className="border border-neutral-150 p-4 rounded-xl space-y-4">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Insertar Concepto a la Lista</span>
                <form onSubmit={handleAddConcept} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3 space-y-1.5 font-semibold">
                    <Label htmlFor="add-prod" className="text-[10px] text-neutral-550 font-semibold">Producto o Servicio</Label>
                    <Select value={currentProductId} onValueChange={setCurrentProductId}>
                      <SelectTrigger id="add-prod" className="h-9 bg-white border-neutral-250 text-xs text-left">
                        {products.find(p => p.id === currentProductId) ? (
                          <span className="line-clamp-1">{products.find(p => p.id === currentProductId)?.name}</span>
                        ) : (
                          <SelectValue placeholder="Seleccione un artículo" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id} className="text-xs">
                            {p.name} ({p.code}) - {p.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3 space-y-1.5 font-semibold">
                    <Label htmlFor="add-concept-detail" className="text-[10px] text-neutral-550 font-semibold">Detalle o Concepto</Label>
                    <Input
                      id="add-concept-detail"
                      type="text"
                      placeholder="Nombre o descripción"
                      value={currentName}
                      onChange={(e) => setCurrentName(e.target.value)}
                      className="h-9 bg-white border-neutral-250 text-xs"
                    />
                  </div>

                  <div className="md:col-span-1 space-y-1.5 font-semibold">
                    <Label htmlFor="add-qty" className="text-[10px] text-neutral-550 font-semibold">Cant.</Label>
                    <Input
                      id="add-qty"
                      type="number"
                      min="1"
                      value={currentQty}
                      onChange={(e) => setCurrentQty(Number(e.target.value) || 1)}
                      className="h-9 bg-white border-neutral-250 text-xs text-center"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5 font-semibold">
                    <Label htmlFor="add-price" className="text-[10px] text-neutral-550 font-semibold">Unitario (DOP)</Label>
                    <Input
                      id="add-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                      className="h-9 bg-white border-neutral-250 text-xs text-right font-mono"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5 font-semibold">
                    <Label htmlFor="add-tax" className="text-[10px] text-neutral-550 font-semibold">ITBIS [%]</Label>
                    <Select value={String(currentTax)} onValueChange={(val) => setCurrentTax(Number(val))}>
                      <SelectTrigger id="add-tax" className="h-9 bg-white border-neutral-250 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18" className="text-xs">Gravado (18% ITBIS)</SelectItem>
                        <SelectItem value="16" className="text-xs">Reducido (16% ITBIS)</SelectItem>
                        <SelectItem value="0" className="text-xs">Exento (0% ITBIS)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-1">
                    <Button type="submit" className="h-9 w-full bg-black text-white hover:bg-neutral-800">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* LIST OF CONCEPTS TABLE LIST */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Conceptos Registrados del Documento</span>
                <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-xs divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-3 py-2 text-center w-16">Cant.</th>
                        <th className="px-3 py-2">Detalle o Concepto</th>
                        <th className="px-3 py-2 text-right w-28">P. Unitario</th>
                        <th className="px-3 py-2 text-center w-20">ITBIS %</th>
                        <th className="px-3 py-2 text-right w-28">Suma Total</th>
                        <th className="px-3 py-2 text-center w-12">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {editItems.map((it, index) => {
                        const prod = products.find(p => p.id === it.productId);
                        return (
                          <tr key={index} className="hover:bg-neutral-50/50">
                            <td className="px-3 py-1.5 text-center">
                              <Input
                                type="number"
                                min="1"
                                value={it.quantity}
                                onChange={(e) => handleUpdateLineQty(index, Number(e.target.value) || 1)}
                                className="w-14 h-7 text-xs p-1 text-center border-neutral-250"
                              />
                            </td>
                            <td className="px-3 py-2 font-medium text-neutral-800">
                              <div className="space-y-1.5 py-1">
                                <Input
                                  value={it.name}
                                  onChange={(e) => handleUpdateLineName(index, e.target.value)}
                                  className="w-full h-8 px-2 text-xs border-neutral-250 rounded font-semibold bg-white"
                                />
                                {prod ? (
                                  <div className="text-[10px] text-neutral-550 space-y-1 bg-neutral-50 border border-neutral-150 rounded p-1.5">
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-neutral-550">Código:</span>
                                      <span className="font-mono bg-neutral-200/60 text-neutral-700 px-1 rounded font-semibold">{prod.code}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-neutral-550">Referencia:</span>
                                      <span className="text-neutral-700">{prod.type === 'Producto' ? 'Artículo de Inventario' : 'Servicio Autorizado'}</span>
                                    </div>
                                  </div>
                                ) : (
                                  it.productId && !it.productId.startsWith('custom-') && (
                                    <div className="text-[10px] text-neutral-550 bg-neutral-50 border border-neutral-150 rounded p-1.5">
                                      <span className="font-bold text-neutral-550">ID Referencia:</span> <span className="font-mono">{it.productId}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </td>
                          <td className="px-3 py-1.5">
                            <Input
                              type="number"
                              step="0.01"
                              value={it.price}
                              onChange={(e) => handleUpdateLinePrice(index, parseFloat(e.target.value) || 0)}
                              className="w-24 h-7 text-xs text-right pr-1 border-neutral-250 ml-auto"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-center text-neutral-550">{it.taxRate}%</td>
                          <td className="px-3 py-1.5 text-right font-semibold text-neutral-900">
                            {it.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
                              onClick={() => handleRemoveConcept(index)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      )})}
                      {editItems.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-xs text-neutral-400">
                            No hay conceptos asociados en la lista. Agregue conceptos con el formulario superior.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FOOTNOTES & COMMENTS */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-notes" className="text-xs font-semibold text-neutral-700">Notas / Términos de la Operación</Label>
                <Input
                  id="edit-notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ej. Esta factura fiscal vence a final de mes y descuenta almacén principal..."
                  className="text-xs border-neutral-250"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SUMMARY LIVE ESTIMATED BOARD - STACKED BELOW */}
        <div className="w-full space-y-6">
          <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-neutral-50 border-b border-neutral-150 p-4">
              <CardTitle className="text-xs uppercase text-neutral-400 font-bold tracking-wider">Cálculo en Vivo</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Monto Imponible:</span>
                  <span className="font-semibold text-neutral-800">{liveSubtotal.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Suma de ITBIS:</span>
                  <span className="font-semibold text-neutral-800">{liveTax.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-neutral-200 pt-2 font-black text-neutral-900 text-sm">
                  <span>Importe Neto Total:</span>
                  <span className="text-base text-black font-heading font-bold">
                    {liveTotal.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-150 space-y-2">
                <Button
                  onClick={handleSubmitEdits}
                  className="w-full h-9 bg-neutral-950 text-white hover:bg-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5"
                  id="save-changes-doc-btn"
                >
                  <Save className="w-3.5 h-3.5" />
                  Sincronizar y Sellar Cambios
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="w-full h-9 text-xs border-neutral-250 hover:bg-neutral-100"
                >
                  Cancelar Edición
                </Button>
              </div>

              {/* DGII PREVIEW NOTIFICATION */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-900 rounded-lg text-[10px] leading-relaxed border border-blue-150">
                <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Consistencia Fiscal DGII</span>
                  Se recalcularán los campos de reportes de rentabilidades en el formato 607 de manera transparente y automática.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
