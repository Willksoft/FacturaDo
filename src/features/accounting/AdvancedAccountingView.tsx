import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Scale, 
  TrendingUp, 
  Building2, 
  Lock, 
  Plus, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useAccountingState } from '../../hooks/useAccountingState';

export default function AdvancedAccountingView() {
  const {
    accounts,
    journalEntries,
    fixedAssets,
    fiscalPeriods,
    balanceSheet,
    profitAndLoss,
    addAccount,
    addJournalEntry,
    addFixedAsset,
    runAssetDepreciation,
    closeFiscalPeriod
  } = useAccountingState();

  const [activeTab, setActiveTab] = useState<'balance' | 'accounts' | 'ledger' | 'pnl' | 'assets' | 'close'>('balance');

  // Modal State for New Account
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newAccCode, setNewAccCode] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccCategory, setNewAccCategory] = useState<'ACTIVO' | 'PASIVO' | 'PATRIMONIO' | 'INGRESO' | 'COSTO' | 'GASTO'>('ACTIVO');

  // Modal State for New Journal Entry
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalConcept, setJournalConcept] = useState('');
  const [journalRef, setJournalRef] = useState('');
  const [journalDebitAcc, setJournalDebitAcc] = useState('1.1.1.01');
  const [journalCreditAcc, setJournalCreditAcc] = useState('4.1.1.01');
  const [journalAmount, setJournalAmount] = useState<number>(0);

  // Handle New Account submit
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccCode || !newAccName) return;
    addAccount({
      code: newAccCode,
      name: newAccName,
      category: newAccCategory,
      parentCode: newAccCategory === 'ACTIVO' ? '1.0.0.00' : '2.0.0.00'
    });
    setNewAccCode('');
    setNewAccName('');
    setShowAccountModal(false);
  };

  // Handle New Manual Journal Entry submit
  const handleCreateJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalConcept || journalAmount <= 0) return;

    const debitAccObj = accounts.find(a => a.code === journalDebitAcc);
    const creditAccObj = accounts.find(a => a.code === journalCreditAcc);

    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      concept: journalConcept,
      reference: journalRef || 'MANUAL-01',
      totalDebit: journalAmount,
      totalCredit: journalAmount,
      isAutomatic: false,
      sourceDocument: 'MANUAL',
      lines: [
        {
          id: `l-deb-${Date.now()}`,
          accountCode: journalDebitAcc,
          accountName: debitAccObj?.name || journalDebitAcc,
          debit: journalAmount,
          credit: 0
        },
        {
          id: `l-cred-${Date.now()}`,
          accountCode: journalCreditAcc,
          accountName: creditAccObj?.name || journalCreditAcc,
          debit: 0,
          credit: journalAmount
        }
      ]
    });

    setJournalConcept('');
    setJournalRef('');
    setJournalAmount(0);
    setShowJournalModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900">
              Contabilidad Avanzada NIIF / DGII
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Partida doble automática, balance general, estado de resultados (P&L) y control de activos fijos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowJournalModal(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nuevo Asiento Diario
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Imprimir Estado
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'balance', label: 'Balance General', icon: Scale },
          { id: 'pnl', label: 'Estado de Resultados (P&L)', icon: TrendingUp },
          { id: 'accounts', label: 'Catálogo de Cuentas', icon: Layers },
          { id: 'ledger', label: 'Libro Diario / Mayor', icon: BookOpen },
          { id: 'assets', label: 'Activos Fijos', icon: Building2 },
          { id: 'close', label: 'Cierre Fiscal', icon: Lock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BALANCE GENERAL */}
      {activeTab === 'balance' && (
        <div className="space-y-6">
          {/* Equation Health Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            balanceSheet.isBalanced 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-3">
              {balanceSheet.isBalanced ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <h3 className="font-medium text-sm">
                  {balanceSheet.isBalanced 
                    ? 'Ecuación Contable Balanceada (Activo = Pasivo + Patrimonio)' 
                    : 'Descuadre en Ecuación Contable'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {balanceSheet.isBalanced 
                    ? 'Todos los débitos y créditos están perfectamente nivelados en los libros.' 
                    : `Diferencia detectada de RD$ ${balanceSheet.difference.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
              NIIF PYMES ✓
            </span>
          </div>

          {/* 3 Main Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Activos */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">TOTAL ACTIVOS</span>
                <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-medium text-xs">1</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-medium text-slate-900">
                RD$ {balanceSheet.totalAssets.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                <span>Caja, Bancos, Cuentas por Cobrar e Inventario</span>
              </div>
            </div>

            {/* Pasivos */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">TOTAL PASIVOS</span>
                <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-medium text-xs">2</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-medium text-rose-900">
                RD$ {balanceSheet.totalLiabilities.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                <span>Proveedores, ITBIS por pagar e Impuestos</span>
              </div>
            </div>

            {/* Patrimonio */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">PATRIMONIO NETO</span>
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-medium text-xs">3</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-medium text-indigo-900">
                RD$ {balanceSheet.totalEquity.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Capital Social + Utilidades Acumuladas</span>
              </div>
            </div>
          </div>

          {/* Detailed Balance Sheet Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activos Details */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="font-heading font-medium text-base text-slate-900 border-b pb-3 flex items-center justify-between">
                <span>1. Desglose de Activos</span>
                <span className="text-xs font-medium text-sky-600">RD$ {balanceSheet.totalAssets.toLocaleString()}</span>
              </h3>
              <div className="space-y-2">
                {accounts.filter(a => a.category === 'ACTIVO' && !a.isHeader).map(acc => (
                  <div key={acc.id} className="flex items-center justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <div>
                      <span className="font-mono text-slate-400 mr-2">{acc.code}</span>
                      <span className="text-slate-800 font-medium">{acc.name}</span>
                    </div>
                    <span className="font-mono font-medium text-slate-900">
                      RD$ {acc.balance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pasivos & Patrimonio Details */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
              <div>
                <h3 className="font-heading font-medium text-base text-slate-900 border-b pb-3 flex items-center justify-between">
                  <span>2. Desglose de Pasivos</span>
                  <span className="text-xs font-medium text-rose-600">RD$ {balanceSheet.totalLiabilities.toLocaleString()}</span>
                </h3>
                <div className="space-y-2 pt-2">
                  {accounts.filter(a => a.category === 'PASIVO' && !a.isHeader).map(acc => (
                    <div key={acc.id} className="flex items-center justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                      <div>
                        <span className="font-mono text-slate-400 mr-2">{acc.code}</span>
                        <span className="text-slate-800 font-medium">{acc.name}</span>
                      </div>
                      <span className="font-mono font-medium text-rose-900">
                        RD$ {acc.balance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-medium text-base text-slate-900 border-b pb-3 flex items-center justify-between">
                  <span>3. Desglose de Patrimonio</span>
                  <span className="text-xs font-medium text-indigo-600">RD$ {balanceSheet.totalEquity.toLocaleString()}</span>
                </h3>
                <div className="space-y-2 pt-2">
                  {accounts.filter(a => a.category === 'PATRIMONIO' && !a.isHeader).map(acc => (
                    <div key={acc.id} className="flex items-center justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                      <div>
                        <span className="font-mono text-slate-400 mr-2">{acc.code}</span>
                        <span className="text-slate-800 font-medium">{acc.name}</span>
                      </div>
                      <span className="font-mono font-medium text-indigo-900">
                        RD$ {acc.balance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ESTADO DE RESULTADOS (P&L) */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase">Ingresos Operativos</span>
              <p className="text-xl sm:text-2xl font-heading font-medium text-slate-900 mt-1">
                RD$ {profitAndLoss.totalIncome.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase">Costo de Ventas</span>
              <p className="text-xl sm:text-2xl font-heading font-medium text-amber-900 mt-1">
                RD$ {profitAndLoss.totalCostOfSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase">Gastos Operativos</span>
              <p className="text-xl sm:text-2xl font-heading font-medium text-rose-900 mt-1">
                RD$ {profitAndLoss.totalExpenses.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-emerald-950 text-white p-5 rounded-2xl shadow-sm">
              <span className="text-xs font-medium text-emerald-400 uppercase">Ganancia Neta</span>
              <p className="text-xl sm:text-2xl font-heading font-medium text-emerald-300 mt-1">
                RD$ {profitAndLoss.netProfit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-emerald-400 font-medium block mt-1">Margen: {profitAndLoss.marginPercent}%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 max-w-4xl mx-auto">
            <h3 className="font-heading font-medium text-lg text-slate-900 border-b pb-3">
              Estado de Ganancias y Pérdidas (P&L Auditado)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 font-medium">
                <span>(+) Ingresos por Ventas y Servicios</span>
                <span>RD$ {profitAndLoss.totalIncome.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600 font-medium pl-4">
                <span>(-) Costo de Mercancías Vendidas</span>
                <span>RD$ ({profitAndLoss.totalCostOfSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })})</span>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-slate-300 font-medium text-slate-900 bg-slate-50 px-3 rounded-xl">
                <span>(=) GANANCIA BRUTA</span>
                <span>RD$ {profitAndLoss.grossProfit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600 font-medium pl-4">
                <span>(-) Gastos de Operación y Administración</span>
                <span>RD$ ({profitAndLoss.totalExpenses.toLocaleString('es-DO', { minimumFractionDigits: 2 })})</span>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-emerald-500 font-medium text-emerald-950 bg-emerald-50 px-3 rounded-xl text-base">
                <span>(=) UTILIDAD NETA DEL EJERCICIO</span>
                <span>RD$ {profitAndLoss.netProfit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATÁLOGO DE CUENTAS */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-medium text-base text-slate-900">Árbol del Catálogo NIIF</h3>
            <button
              onClick={() => setShowAccountModal(true)}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Cuenta
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase text-[11px]">
                <tr>
                  <th className="p-4">Código</th>
                  <th className="p-4">Nombre de la Cuenta</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4 text-right">Balance Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map(acc => (
                  <tr key={acc.id} className={acc.isHeader ? 'bg-slate-50/70 font-medium' : 'hover:bg-slate-50/50'}>
                    <td className="p-4 font-mono font-medium text-slate-700">{acc.code}</td>
                    <td className="p-4 text-slate-900 font-medium">
                      {acc.isHeader ? (
                        <span className="uppercase text-slate-900 tracking-wide font-medium">{acc.name}</span>
                      ) : (
                        <span className="pl-4 text-slate-700">{acc.name}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium ${
                        acc.category === 'ACTIVO' ? 'bg-sky-50 text-sky-700' :
                        acc.category === 'PASIVO' ? 'bg-rose-50 text-rose-700' :
                        acc.category === 'PATRIMONIO' ? 'bg-indigo-50 text-indigo-700' :
                        acc.category === 'INGRESO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {acc.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-medium text-slate-900">
                      RD$ {acc.balance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LIBRO DIARIO / MAYOR */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <h3 className="font-heading font-medium text-base text-slate-900">Asientos Registrados en el Libro Diario</h3>
          <div className="space-y-4">
            {journalEntries.map(entry => (
              <div key={entry.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                  <div>
                    <span className="text-xs font-mono font-medium text-sky-600 mr-2">{entry.id}</span>
                    <span className="font-medium text-sm text-slate-900">{entry.concept}</span>
                    {entry.reference && <span className="ml-2 text-xs text-slate-400 font-mono">Ref: {entry.reference}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {entry.date}</span>
                    {entry.isAutomatic && (
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium text-[10px]">Automático ✓</span>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 font-medium border-b border-slate-100">
                        <th className="py-1 text-left">Código</th>
                        <th className="py-1 text-left">Cuenta</th>
                        <th className="py-1 text-right">Débito (RD$)</th>
                        <th className="py-1 text-right">Crédito (RD$)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {entry.lines.map((line, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 font-mono text-slate-500">{line.accountCode}</td>
                          <td className="py-1.5 text-slate-800 font-medium">{line.accountName}</td>
                          <td className="py-1.5 text-right font-mono font-medium text-slate-900">
                            {line.debit > 0 ? `RD$ ${line.debit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}` : '-'}
                          </td>
                          <td className="py-1.5 text-right font-mono font-medium text-slate-900">
                            {line.credit > 0 ? `RD$ ${line.credit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVOS FIJOS */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading font-medium text-base text-slate-900">Propiedad, Planta y Equipos</h3>
              <p className="text-xs text-slate-500">Depreciación fiscal automática según normas de la DGII (5%, 25%, 15%).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixedAssets.map(asset => (
              <div key={asset.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{asset.code}</span>
                    <h4 className="font-medium text-sm text-slate-900">{asset.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                    Tasa DGII: {asset.ratePercent}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Costo Inicial</span>
                    <span className="font-medium text-slate-800">RD$ {asset.acquisitionCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dep. Acumulada</span>
                    <span className="font-medium text-rose-600">RD$ {asset.accumulatedDepreciation.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Valor Libros</span>
                    <span className="font-medium text-emerald-700">RD$ {asset.currentBookValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => runAssetDepreciation(asset.id)}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  >
                    Ejecutar Depreciación Mensual
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CIERRE FISCAL */}
      {activeTab === 'close' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-medium text-base text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" /> Períodos Fiscales y Cierre Auditable
            </h3>
            <p className="text-xs text-slate-500">
              Al cerrar un período fiscal, se bloquea la modificación de facturas y egresos pasados para garantizar consistencia con las declaraciones mensuales de la DGII.
            </p>

            <div className="space-y-3 pt-2">
              {fiscalPeriods.map(period => (
                <div key={period.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className="font-medium text-sm text-slate-900">{period.label}</span>
                    <span className="text-xs text-slate-500 block">
                      Ingresos: RD$ {period.totalIncome.toLocaleString()} | Egresos: RD$ {period.totalExpense.toLocaleString()}
                    </span>
                  </div>

                  {period.status === 'CLOSED' ? (
                    <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Cerrado Auditable
                    </span>
                  ) : (
                    <button
                      onClick={() => closeFiscalPeriod(period.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
                    >
                      Cerrar Período
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Account */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-medium text-lg text-slate-900">Agregar Nueva Cuenta al Catálogo</h3>
            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Código de Cuenta</label>
                <input
                  type="text"
                  placeholder="Ej: 1.1.1.03"
                  value={newAccCode}
                  onChange={e => setNewAccCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nombre de la Cuenta</label>
                <input
                  type="text"
                  placeholder="Ej: Caja Chica Sucursal Santiago"
                  value={newAccName}
                  onChange={e => setNewAccName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Categoría</label>
                <select
                  value={newAccCategory}
                  onChange={e => setNewAccCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="PASIVO">PASIVO</option>
                  <option value="PATRIMONIO">PATRIMONIO</option>
                  <option value="INGRESO">INGRESO</option>
                  <option value="COSTO">COSTO</option>
                  <option value="GASTO">GASTO</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl font-medium"
                >
                  Guardar Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Manual Journal Entry */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-medium text-lg text-slate-900">Registrar Asiento Manual (Partida Doble)</h3>
            <form onSubmit={handleCreateJournalEntry} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Concepto / Explicación del Asiento</label>
                <input
                  type="text"
                  placeholder="Ej: Registro de provisión o ajuste mensual de seguro"
                  value={journalConcept}
                  onChange={e => setJournalConcept(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Referencia / Comprobante</label>
                <input
                  type="text"
                  placeholder="Ej: ADJ-2026-001"
                  value={journalRef}
                  onChange={e => setJournalRef(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cuenta Débito</label>
                  <select
                    value={journalDebitAcc}
                    onChange={e => setJournalDebitAcc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {accounts.filter(a => !a.isHeader).map(a => (
                      <option key={a.id} value={a.code}>{a.code} - {a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cuenta Crédito</label>
                  <select
                    value={journalCreditAcc}
                    onChange={e => setJournalCreditAcc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {accounts.filter(a => !a.isHeader).map(a => (
                      <option key={a.id} value={a.code}>{a.code} - {a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Monto Total (RD$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={journalAmount || ''}
                  onChange={e => setJournalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJournalModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl font-medium"
                >
                  Guardar Asiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
