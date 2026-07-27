import React, { useState } from 'react';
import { 
  RefreshCw, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  Building, 
  Clock,
  Sparkles
} from 'lucide-react';

export interface RecurringInvoiceRule {
  id: string;
  clientName: string;
  clientRnc: string;
  concept: string;
  amount: number;
  ncfType: 'B01' | 'B02';
  frequency: 'Mensual' | 'Quincenal';
  nextRunDate: string;
  active: boolean;
}

export const RecurringInvoicesView: React.FC = () => {
  const [rules, setRules] = useState<RecurringInvoiceRule[]>([
    {
      id: 'rec-1',
      clientName: 'Distribuidora Oriental S.A.',
      clientRnc: '1-30-94821-2',
      concept: 'Iguala Contable & Asesoría Fiscal Mensual',
      amount: 25000,
      ncfType: 'B01',
      frequency: 'Mensual',
      nextRunDate: '2026-08-01',
      active: true
    },
    {
      id: 'rec-2',
      clientName: 'Constructora Del Este S.R.L.',
      clientRnc: '1-01-85920-4',
      concept: 'Mantenimiento de Servidores Nube',
      amount: 18000,
      ncfType: 'B01',
      frequency: 'Mensual',
      nextRunDate: '2026-08-05',
      active: true
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientRnc, setClientRnc] = useState('');
  const [concept, setConcept] = useState('Servicio Recurrente Igualas');
  const [amount, setAmount] = useState<number>(10000);
  const [ncfType, setNcfType] = useState<'B01' | 'B02'>('B01');
  const [frequency, setFrequency] = useState<'Mensual' | 'Quincenal'>('Mensual');

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newRule: RecurringInvoiceRule = {
      id: `rec-${Date.now()}`,
      clientName,
      clientRnc,
      concept,
      amount,
      ncfType,
      frequency,
      nextRunDate: '2026-08-15',
      active: true
    };

    setRules([newRule, ...rules]);
    setIsCreating(false);
    setClientName('');
    alert(`¡Programación de Factura Recurrente para "${clientName}" guardada!`);
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-emerald-600" />
            Facturación Recurrente & Igualas Automáticas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programa la emisión periódica de facturas fiscales NCF para contratos de alquiler, servicios e igualas contables.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Ver Programaciones' : 'Nueva Facturación Recurrente'}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleSaveRule} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm">
          <h3 className="font-heading font-medium text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Programar Nueva Iguala / Cobro Periódico
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Nombre del Cliente *</label>
              <input
                type="text"
                required
                placeholder="Razón Social"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">RNC / Cédula Cliente</label>
              <input
                type="text"
                placeholder="1-01-00000-0"
                value={clientRnc}
                onChange={(e) => setClientRnc(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Concepto del Servicio *</label>
              <input
                type="text"
                required
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Monto Mensual (DOP) *</label>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Tipo NCF DGII *</label>
              <select
                value={ncfType}
                onChange={(e) => setNcfType(e.target.value as any)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              >
                <option value="B01">B01 - Crédito Fiscal</option>
                <option value="B02">B02 - Consumidor Final</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Frecuencia de Emisión *</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              >
                <option value="Mensual">Mensual (Día 1 de cada mes)</option>
                <option value="Quincenal">Quincenal (Día 15 y 30)</option>
              </select>
            </div>
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer"
            >
              Guardar Recurrencia
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="p-3">Cliente / RNC</th>
                  <th className="p-3">Concepto Recurrente</th>
                  <th className="p-3 text-center">Frecuencia / NCF</th>
                  <th className="p-3 text-right">Monto (DOP)</th>
                  <th className="p-3 text-center">Próxima Emisión</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 font-sans">
                      {r.clientName}
                      <span className="text-[10px] text-slate-400 block font-mono">RNC: {r.clientRnc || 'N/A'}</span>
                    </td>
                    <td className="p-3 font-sans text-slate-700">{r.concept}</td>
                    <td className="p-3 text-center font-sans">
                      {r.frequency}
                      <span className="text-[10px] text-indigo-700 font-bold block font-mono">NCF {r.ncfType}</span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">RD$ {r.amount.toLocaleString('es-DO')}</td>
                    <td className="p-3 text-center text-slate-600">{r.nextRunDate}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleRule(r.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold font-sans cursor-pointer ${
                          r.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {r.active ? 'Activa ✓' : 'Pausada'}
                      </button>
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
