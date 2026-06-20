import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  FileText, 
  Building2, 
  FileCheck, 
  Grid,
  Info,
  CreditCard,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Expense, PaymentMethod } from '../../types';

import { FinancialAccount } from '../../types';

interface ExpensesViewProps {
  financialAccounts?: FinancialAccount[];
  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  currentUser: { role: string };
  searchExpenses?: (q: string) => void;
}

const DGII_CONCEPTS = [
  '01 - Gastos de Personal',
  '02 - Gastos por Trabajos, Suministros y Servicios',
  '03 - Arrendamientos',
  '04 - Gastos de Activos Fijos',
  '05 - Gastos de Representación',
  '06 - Otras Deducciones Admitidas',
  '07 - Gastos Financieros',
  '08 - Gastos de Seguros',
  '09 - Adquisición de Activos',
  '10 - Gastos por Seguros de Salud',
  '11 - Otros Gastos Indirectas'
];

export function ExpensesView({ expenses, addExpense, deleteExpense, currentUser, financialAccounts = [], searchExpenses }: ExpensesViewProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Expense form state
  const [providerRNC, setProviderRNC] = useState('');
  const [providerName, setProviderName] = useState('');
  const [ncf, setNcf] = useState('B0100000001');
  const [concept, setConcept] = useState('02 - Gastos por Trabajos, Suministros y Servicios');
  const [amountInput, setAmountInput] = useState('');
  const [itbisInput, setItbisInput] = useState('');
  const [itbisWithheldInput, setItbisWithheldInput] = useState('');
  const [isrWithheldInput, setIsrWithheldInput] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transferencia');
  const [notes, setNotes] = useState('');
  const [accountId, setAccountId] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(undefined);

  const filtered = expenses.filter(exp => 
    exp.providerName.toLowerCase().includes(search.toLowerCase()) ||
    exp.providerRNC.includes(search) ||
    exp.ncf.toLowerCase().includes(search.toLowerCase()) ||
    exp.concept.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = filtered.reduce((sum, e) => sum + e.amount, 0);
  const totalItbis = filtered.reduce((sum, e) => sum + e.itbis, 0);
  const totalItbisWithheld = filtered.reduce((sum, e) => sum + (e.itbisWithheld || 0), 0);
  const totalIsrWithheld = filtered.reduce((sum, e) => sum + (e.isrWithheld || 0), 0);

  // Auto-calculate 18% ITBIS on amount change for easier typing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo no puede exceder los 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAmountChange = (val: string) => {
    setAmountInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      // Suggest 18% standard ITBIS by default
      const suggestedItbis = Math.round(parsed * 0.18 * 100) / 100;
      setItbisInput(String(suggestedItbis));
    } else {
      setItbisInput('');
    }
  };

  const handleRegisterExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerRNC || !providerName || !ncf) {
      alert('Por favor complete todos los datos del proveedor y NCF.');
      return;
    }

    const parsedAmount = parseFloat(amountInput);
    const parsedItbis = parseFloat(itbisInput) || 0;
    const parsedItbisWithheld = parseFloat(itbisWithheldInput) || 0;
    const parsedIsrWithheld = parseFloat(isrWithheldInput) || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Favor ingresar un monto válido de compra.');
      return;
    }

    addExpense({
      providerRNC,
      providerName,
      ncf,
      concept,
      amount: parsedAmount,
      itbis: parsedItbis,
      itbisWithheld: parsedItbisWithheld > 0 ? parsedItbisWithheld : undefined,
      isrWithheld: parsedIsrWithheld > 0 ? parsedIsrWithheld : undefined,
      date,
      paymentMethod,
      accountId: accountId || undefined,
      attachmentUrl,
      notes: notes || undefined
    });

    // Reset Form
    setProviderRNC('');
    setProviderName('');
    setNcf('B0100000001');
    setConcept('02 - Gastos por Trabajos, Suministros y Servicios');
    setAmountInput('');
    setItbisInput('');
    setItbisWithheldInput('');
    setIsrWithheldInput('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Transferencia');
    setNotes('');
    setAccountId('');
    setAttachmentUrl(undefined);
    setShowModal(false);
  };

  const canDelete = currentUser.role === 'Administrador' || currentUser.role === 'Auditor';

  return (
    <div className="space-y-6" id="expenses-module-section">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading">Gastos & Compras Comerciales</h2>
          <p className="text-xs text-neutral-500">
            Seguimiento de compras y egresos corporativos con comprobantes NCF válidos para crédito fiscal e ITBIS (Formulario mensual 606).
          </p>
        </div>
        <Button 
          id="btn-register-expense-trigger"
          onClick={() => setShowModal(true)}
          className="bg-black text-white hover:bg-neutral-800 text-xs h-9 font-semibold gap-1.5 shrink-0 self-start sm:self-auto rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          Registrar Gasto (606)
        </Button>
      </div>

      {/* SUMMARY BENTO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="expenses-summary-cards">
        <Card className="border-neutral-200 shadow-none rounded-xl bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
              <TrendingUp className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Total Egresos</span>
              <span className="text-lg font-bold text-neutral-900 font-mono">
                {totalSpent.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none rounded-xl bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-650 shrink-0 border border-red-100">
              <FileCheck className="w-5 h-5 text-red-650" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">ITBIS Adelantado</span>
              <span className="text-lg font-bold text-red-655 font-mono">
                {totalItbis.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none rounded-xl bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0 border border-indigo-100">
              <FileText className="w-5 h-5 text-indigo-650" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Retenciones (ITBIS/ISR)</span>
              <span className="text-lg font-bold text-indigo-650 font-mono">
                {(totalItbisWithheld + totalIsrWithheld).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none rounded-xl bg-amber-50/50 border-amber-200 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-[10px] text-amber-950 leading-tight">
              <strong>Soporte Fiscal 606:</strong> Todos los egresos y retenciones con NCF (e.g. <code className="bg-amber-100/80 px-1 font-bold rounded">B01</code> o <code className="bg-amber-100/80 px-1 font-bold rounded">B11</code>) son transferidos al formato oficial mensual de compras.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTER & FILTER LAYOUT */}
      <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
        <CardHeader className="bg-neutral-50/50 p-4 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-neutral-900">Listado Cronológico de Compras</CardTitle>
            <CardDescription className="text-xs">Visualice y filtre todas las facturas de gastos recibidas.</CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <Input
              type="text"
              placeholder="Buscar por RNC, Proveedor, NCF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs border-neutral-200 rounded-lg h-9 bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-100">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Proveedor</th>
                  <th className="px-4 py-3 text-center">NCF Comprobante</th>
                  <th className="px-4 py-3">Concepto Gasto DGII</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3 text-right">Subtotal Neto</th>
                  <th className="px-4 py-3 text-right">Suma ITBIS</th>
                  <th className="px-4 py-3 text-right">Retención (ITBIS/ISR)</th>
                  <th className="px-4 py-3 text-right">Monto Total</th>
                  <th className="px-4 py-3 text-center w-12">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white text-neutral-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-16 text-neutral-400 text-xs">
                      No se encontraron registros de gastos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/35 transition-colors">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {new Date(item.date).toLocaleDateString('es-DO')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-neutral-900 leading-tight">{item.providerName}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">RNC: {item.providerRNC}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-blue-800 whitespace-nowrap">
                        {item.ncf}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] whitespace-nowrap">
                          {item.concept}
                        </span>
                        {item.notes && <div className="text-[10px] text-neutral-400 italic mt-0.5">{item.notes}</div>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-0.5 text-neutral-600 text-[11px]">
                          <CreditCard className="w-2.5 h-2.5" />
                          {item.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-neutral-600">
                        {item.amount.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-red-650">
                        {item.itbis.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <div className="inline-flex flex-col gap-0.5">
                          {item.itbisWithheld && (
                            <span className="text-[10px] bg-red-50 text-red-750 px-1.5 py-0.5 rounded font-semibold text-right">
                              Ret.ITBIS: {item.itbisWithheld.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                            </span>
                          )}
                          {item.isrWithheld && (
                            <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-semibold text-right">
                              Ret.ISR: {item.isrWithheld.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                            </span>
                          )}
                          {!item.itbisWithheld && !item.isrWithheld && <span className="text-neutral-400 text-xs text-center">-</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-neutral-950">
                        {(item.amount + item.itbis).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {canDelete ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('¿Está seguro de eliminar este registro de gasto?')) {
                                deleteExpense(item.id);
                              }
                            }}
                            className="h-7 w-7 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <span className="text-[9px] text-neutral-400">Restringido</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE EXPENSE SLIDE/MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="register-expense-modal">
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-neutral-50 border-b border-neutral-100 p-4 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 font-heading">
                  <Sparkles className="w-4 h-4 text-neutral-900" />
                  Registrar Documento de Gasto (DGII 606)
                </h3>
                <p className="text-[10px] text-neutral-400">Incorpore facturas recibidas de proveedores con impacto fiscal inmediato.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterExpense} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="exp-rnc" className="text-xs font-semibold text-neutral-700">RNC o Cédula del Proveedor</Label>
                  <Input
                    id="exp-rnc"
                    placeholder="Ej. 131-00214-5"
                    value={providerRNC}
                    onChange={(e) => setProviderRNC(e.target.value)}
                    className="h-8.5 text-xs bg-white border-neutral-200"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="exp-prov-name" className="text-xs font-semibold text-neutral-700">Razón Social del Proveedor</Label>
                  <Input
                    id="exp-prov-name"
                    placeholder="Ej. Claro Dominicana"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="h-8.5 text-xs bg-white border-neutral-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="exp-ncf" className="text-xs font-semibold text-neutral-700">Comprobante NCF (Crédito Fiscal)</Label>
                  <Input
                    id="exp-ncf"
                    placeholder="Ej. B0100021948"
                    value={ncf}
                    onChange={(e) => setNcf(e.target.value)}
                    className="h-8.5 text-xs font-mono font-bold bg-white border-neutral-200 uppercase"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="exp-date" className="text-xs font-semibold text-neutral-700">Fecha del Documento</Label>
                  <Input
                    id="exp-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-8.5 text-xs bg-white border-neutral-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-concept" className="text-xs font-semibold text-neutral-700">Concepto de Gasto (Formulario 606)</Label>
                <Select value={concept} onValueChange={(val) => setConcept(val)}>
                  <SelectTrigger id="exp-concept" className="w-full text-xs h-8.5 px-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-1 focus:ring-neutral-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {DGII_CONCEPTS.map((conceptStr) => (
                      <SelectItem key={conceptStr} value={conceptStr} className="text-xs">
                        {conceptStr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="exp-amount" className="text-xs font-semibold text-neutral-700">Monto Neto Gravado (Base DOP)</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] text-neutral-400 font-bold">RD$</span>
                    <Input
                      id="exp-amount"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={amountInput}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="h-8.5 text-xs pl-9 bg-white border-neutral-200 font-bold font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="exp-itbis" className="text-xs font-semibold text-neutral-700">ITBIS Facturado (DOP)</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] text-neutral-400 font-bold">RD$</span>
                    <Input
                      id="exp-itbis"
                      type="number"
                      step="any"
                      placeholder="Sugerido (18%)"
                      value={itbisInput}
                      onChange={(e) => setItbisInput(e.target.value)}
                      className="h-8.5 text-xs pl-9 bg-white border-neutral-200 font-mono text-red-650"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-neutral-200 pt-3 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Retenciones Especiales (DGII - Formato 606)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="exp-itbis-withheld" className="text-xs font-semibold text-neutral-700 font-sans">ITBIS Retenido</Label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseFloat(itbisInput) || 0;
                            setItbisWithheldInput(String(Math.round(parsed * 0.3 * 100) / 100));
                          }}
                          className="text-[8px] bg-red-50 text-red-700 px-1 rounded hover:bg-red-100 font-bold"
                        >
                          30%
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseFloat(itbisInput) || 0;
                            setItbisWithheldInput(String(parsed));
                          }}
                          className="text-[8px] bg-red-50 text-red-700 px-1 rounded hover:bg-red-100 font-bold"
                        >
                          100%
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-[10px] text-neutral-450 font-bold">RD$</span>
                      <Input
                        id="exp-itbis-withheld"
                        type="number"
                        step="any"
                        placeholder="Ej. Retener 30% o 100%"
                        value={itbisWithheldInput}
                        onChange={(e) => setItbisWithheldInput(e.target.value)}
                        className="h-8.5 text-xs pl-9 bg-white border-neutral-200 font-mono text-red-700 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="exp-isr-withheld" className="text-xs font-semibold text-neutral-700 font-sans">ISR Retenido</Label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseFloat(amountInput) || 0;
                            setIsrWithheldInput(String(Math.round(parsed * 0.02 * 100) / 100));
                          }}
                          className="text-[8px] bg-amber-50 text-amber-800 px-1 rounded hover:bg-amber-100 font-bold"
                        >
                          2% Serv
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseFloat(amountInput) || 0;
                            setIsrWithheldInput(String(Math.round(parsed * 0.10 * 100) / 100));
                          }}
                          className="text-[8px] bg-amber-50 text-amber-800 px-1 rounded hover:bg-amber-100 font-bold"
                        >
                          10% Hon
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-[10px] text-neutral-450 font-bold">RD$</span>
                      <Input
                        id="exp-isr-withheld"
                        type="number"
                        step="any"
                        placeholder="Ej. Retener 2% o 10%"
                        value={isrWithheldInput}
                        onChange={(e) => setIsrWithheldInput(e.target.value)}
                        className="h-8.5 text-xs pl-9 bg-white border-neutral-200 font-mono text-amber-850 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-payment-method" className="text-xs font-semibold text-neutral-700">Forma de Pago del Gasto</Label>
                <div className="grid grid-cols-4 gap-1.5 bg-neutral-100 p-1 rounded-lg">
                  {(['Efectivo', 'Transferencia', 'Tarjeta', 'Crédito'] as PaymentMethod[]).map((method) => (
                    <Button
                      key={method}
                      type="button"
                      variant={paymentMethod === method ? 'default' : 'ghost'}
                      className="text-[10px] h-7 rounded-md font-semibold py-0 shrink-0"
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </Button>
                  ))}
                </div>
              </div>

              {paymentMethod !== 'Efectivo' && financialAccounts && financialAccounts.length > 0 && (
                <div className="space-y-1">
                  <Label htmlFor="exp-account" className="text-xs font-semibold text-neutral-700">Cuenta / Tarjeta de Origen</Label>
                  <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger id="exp-account" className="h-8.5 text-xs bg-white border-neutral-200">
                      <SelectValue placeholder="Seleccionar de dónde salió el dinero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs text-neutral-500">Ninguna en específico</SelectItem>
                      {financialAccounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id} className="text-xs">
                          {acc.name} ({acc.bankName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="exp-attachment" className="text-xs font-semibold text-neutral-700">Documento o Foto de Referencia</Label>
                <div className="flex gap-2">
                  <Input
                    id="exp-attachment"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAttachmentUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="h-8.5 text-xs bg-white border-neutral-200 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 file:text-neutral-700"
                  />
                  {attachmentUrl && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setAttachmentUrl(undefined)} className="h-8.5 w-8.5 p-0 text-red-500 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-notes" className="text-xs font-semibold text-neutral-700">Notas Adicionales / Comentario</Label>
                <Input
                  id="exp-notes"
                  placeholder="Detalle conceptual de la compra (ej. Compra de papelería)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-8.5 text-xs bg-white border-neutral-200"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-3 border-t border-neutral-100 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="h-8 text-xs font-semibold px-4.5 border-neutral-200"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="h-8 text-xs font-semibold px-4.5 bg-black text-white hover:bg-neutral-800"
                >
                  Guardar Egresos (606)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
