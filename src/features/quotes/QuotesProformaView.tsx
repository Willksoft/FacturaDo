import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Printer, 
  CheckCircle2, 
  ArrowRight, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Building, 
  User, 
  Sparkles,
  Copy
} from 'lucide-react';

export interface QuoteProformaItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuoteProforma {
  id: string;
  type: 'Cotización' | 'Proforma';
  number: string;
  clientName: string;
  clientRnc: string;
  date: string;
  validUntil: string;
  items: QuoteProformaItem[];
  total: number;
  status: 'Borrador' | 'Enviada' | 'Aprobada' | 'Convertida';
}

export const QuotesProformaView: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteProforma[]>([
    {
      id: 'q-1',
      type: 'Cotización',
      number: 'COT-2026-001',
      clientName: 'Distribuidora Oriental S.A.',
      clientRnc: '1-30-94821-2',
      date: new Date().toISOString().slice(0, 10),
      validUntil: '2026-08-15',
      items: [
        { id: 'i1', description: 'Servicios de Implementación Software', quantity: 1, unitPrice: 45000, subtotal: 45000 }
      ],
      total: 45000,
      status: 'Aprobada'
    },
    {
      id: 'q-2',
      type: 'Proforma',
      number: 'PROF-2026-002',
      clientName: 'Constructora Del Este S.R.L.',
      clientRnc: '1-01-85920-4',
      date: new Date().toISOString().slice(0, 10),
      validUntil: '2026-08-30',
      items: [
        { id: 'i2', description: 'Licencia de Software Empresarial Anual', quantity: 2, unitPrice: 28000, subtotal: 56000 }
      ],
      total: 56000,
      status: 'Enviada'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formType, setFormType] = useState<'Cotización' | 'Proforma'>('Cotización');
  const [formClient, setFormClient] = useState('');
  const [formRnc, setFormRnc] = useState('');
  const [formValidUntil, setFormValidUntil] = useState('2026-08-30');
  const [items, setItems] = useState<Array<{ description: string; quantity: number; price: number }>>([
    { description: 'Consultoría Especializada', quantity: 1, price: 15000 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { description: 'Nuevo Producto / Servicio', quantity: 1, price: 1000 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClient.trim()) return;

    const formattedItems: QuoteProformaItem[] = items.map((it, idx) => ({
      id: `it-${Date.now()}-${idx}`,
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.price,
      subtotal: it.quantity * it.price
    }));

    const total = formattedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    const prefix = formType === 'Cotización' ? 'COT' : 'PROF';

    const newQuote: QuoteProforma = {
      id: `q-${Date.now()}`,
      type: formType,
      number: `${prefix}-2026-${(quotes.length + 1).toString().padStart(3, '0')}`,
      clientName: formClient,
      clientRnc: formRnc,
      date: new Date().toISOString().slice(0, 10),
      validUntil: formValidUntil,
      items: formattedItems,
      total,
      status: 'Aprobada'
    };

    setQuotes([newQuote, ...quotes]);
    setIsCreating(false);
    setFormClient('');
    setFormRnc('');
    alert(`¡${formType} "${newQuote.number}" creada exitosamente!`);
  };

  const handleConvertToInvoice = (quote: QuoteProforma, ncfType: 'B01' | 'B02') => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quote.id ? { ...q, status: 'Convertida' } : q))
    );

    alert(`¡${quote.type} "${quote.number}" convertida a Factura Fiscal NCF ${ncfType} (${ncfType === 'B01' ? 'Crédito Fiscal' : 'Consumidor Final'})! Asiento contable y secuencial asignados.`);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Cotizaciones & Proformas Comerciales
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Diseña cotizaciones y facturas proforma profesionales sin valor fiscal previo y conviértelas en NCF B01 o B02 en 1 clic.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Ver Lista' : 'Nueva Cotización / Proforma'}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleSaveQuote} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-heading font-medium text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Crear Cotización / Proforma
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Tipo de Documento *</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Cotización">Cotización Comercial</option>
                <option value="Proforma">Factura Proforma</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Cliente / Empresa *</label>
              <input
                type="text"
                required
                placeholder="Nombre o Razón Social"
                value={formClient}
                onChange={(e) => setFormClient(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">RNC / Cédula Cliente</label>
              <input
                type="text"
                placeholder="1-01-00000-0"
                value={formRnc}
                onChange={(e) => setFormRnc(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Válido Hasta *</label>
              <input
                type="date"
                required
                value={formValidUntil}
                onChange={(e) => setFormValidUntil(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-medium text-xs uppercase text-slate-700">Líneas de Productos / Servicios</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Línea
              </button>
            </div>

            {items.map((it, idx) => (
              <div key={idx} className="flex gap-2 items-center text-xs">
                <input
                  type="text"
                  value={it.description}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].description = e.target.value;
                    setItems(newItems);
                  }}
                  className="flex-1 h-9 px-3 border border-slate-200 rounded-xl"
                />
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].quantity = Number(e.target.value);
                    setItems(newItems);
                  }}
                  className="w-20 h-9 px-2 border border-slate-200 rounded-xl font-mono text-center"
                />
                <input
                  type="number"
                  min={0}
                  value={it.price}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].price = Number(e.target.value);
                    setItems(newItems);
                  }}
                  className="w-32 h-9 px-2 border border-slate-200 rounded-xl font-mono text-right"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer"
            >
              Guardar {formType}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="p-3">Tipo / Número</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3 text-center">Vigencia</th>
                  <th className="p-3 text-right">Monto Total</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Convertir a NCF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 font-sans">
                      {q.number}
                      <span className="text-[10px] text-slate-400 block font-mono">{q.type}</span>
                    </td>
                    <td className="p-3 font-sans">
                      {q.clientName}
                      <span className="text-[10px] text-slate-400 block font-mono">RNC: {q.clientRnc || 'N/A'}</span>
                    </td>
                    <td className="p-3 text-center text-slate-600">{q.validUntil}</td>
                    <td className="p-3 text-right font-bold text-slate-900">RD$ {q.total.toLocaleString('es-DO')}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                        q.status === 'Convertida' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {q.status === 'Convertida' ? (
                        <span className="text-[10px] text-slate-400 font-sans">Facturada ✓</span>
                      ) : (
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleConvertToInvoice(q, 'B01')}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            B01 Crédito
                          </button>
                          <button
                            onClick={() => handleConvertToInvoice(q, 'B02')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            B02 Final
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
