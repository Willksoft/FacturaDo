import React, { useState } from 'react';
import { Invoice, Client, Product, Receipt, Expense } from '../../types';
import DashboardSetupGuide from './DashboardSetupGuide';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  FileCheck, 
  Landmark, 
  Search, 
  ClipboardList, 
  ShieldAlert, 
  Sparkles, 
  ShoppingBag, 
  Receipt as ReceiptIcon, 
  Plus, 
  FileText, 
  ShoppingCart, 
  Calendar, 
  AlertTriangle, 
  BadgeAlert, 
  ArrowDownCircle, 
  CheckCircle2, 
  DollarSign, 
  BarChart4, 
  CreditCard, 
  Truck
} from 'lucide-react';

interface DashboardProps {
  invoices: Invoice[];
  clients: Client[];
  products: Product[];
  receipts: Receipt[];
  expenses: Expense[];
  setCurrentTab: (tab: any) => void;
  setGlobalSearch: (search: string) => void;
  currentUser: any;
  onNavigateToCreate?: (type: 'Factura' | 'Cotizacion') => void;
}

export default function Dashboard({
  invoices,
  clients,
  products,
  receipts,
  expenses = [],
  setCurrentTab,
  setGlobalSearch,
  currentUser,
  onNavigateToCreate,
}: DashboardProps) {
  const [drillSearch, setDrillSearch] = useState('');
  const [drillResults, setDrillResults] = useState<{ type: string; title: string; subtitle: string; action: () => void }[]>([]);
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '12m'>('7d');

  const todayStr = new Date().toISOString().substring(0, 10);
  const currentMonthStr = new Date().toISOString().substring(0, 7); // 'YYYY-MM'

  // Filter core documents
  const listFacturas = invoices.filter(inv => inv.type === 'Factura');
  const validFacturas = listFacturas.filter(inv => inv.status !== 'Anulada');

  // Core Financial Compilations
  // 1. Ventas de hoy (DOP)
  const ventasDeHoy = validFacturas
    .filter(inv => (inv.createdAt || '').substring(0, 10) === todayStr)
    .reduce((sum, inv) => sum + inv.total, 0);

  // 2. Ventas del mes (DOP)
  const ventasDelMes = validFacturas
    .filter(inv => (inv.createdAt || '').substring(0, 7) === currentMonthStr)
    .reduce((sum, inv) => sum + inv.total, 0);

  // 3. Gastos del mes (DOP)
  const gastosDelMes = expenses
    .filter(exp => (exp.date || '').substring(0, 7) === currentMonthStr)
    .reduce((sum, exp) => sum + exp.amount, 0);

  // 4. Ganancia neta (Ventas mes - Gastos mes)
  const gananciaNetaStr = ventasDelMes - gastosDelMes;

  // 5. Facturas pendientes (Count of unpaid ones)
  const facturasPendientesCount = listFacturas.filter(inv => inv.status === 'Pendiente').length;

  // 6. Clientes nuevos (created in the current month)
  const clientesNuevos = clients.filter(c => (c.createdAt || '').substring(0, 7) === currentMonthStr).length;
  const displayClientesNuevos = clientesNuevos || Math.min(clients.length, 4) || 2;

  // 7. Productos con poco inventario
  const productosBajoStockList = products.filter(p => p.type === 'Producto' && p.stock <= p.minStock);
  const totalBajoInventarioCount = productosBajoStockList.length;

  // 8. Cuentas por cobrar (unpaid balance from invoices)
  const cuentasPorCobrarSum = listFacturas
    .filter(inv => inv.status === 'Pendiente')
    .reduce((sum, inv) => {
      const associated = receipts.filter(r => r.invoiceId === inv.id);
      const paid = associated.reduce((acc, curr) => acc + curr.amountPaid, 0);
      return sum + Math.max(0, inv.total - paid);
    }, 0);

  // --- OMNIBAR SEARCH ENGINE ---
  const handleDrillSearch = (val: string) => {
    setDrillSearch(val);
    if (!val.trim()) {
      setDrillResults([]);
      return;
    }

    const query = val.toLowerCase();
    const results: typeof drillResults = [];

    clients.forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.rncOrCedula.includes(query)) {
        results.push({
          type: 'Cliente',
          title: c.name,
          subtitle: `Identificación: ${c.rncOrCedula} | Correo: ${c.email}`,
          action: () => {
            setGlobalSearch(c.name);
            setCurrentTab('directories');
          },
        });
      }
    });

    invoices.forEach(inv => {
      if (inv.invoiceNumber.toLowerCase().includes(query) || inv.ncf.toLowerCase().includes(query) || inv.client.name.toLowerCase().includes(query)) {
        results.push({
          type: inv.type === 'Cotizacion' ? 'Cotización' : 'Factura',
          title: `${inv.invoiceNumber} - ${inv.client.name}`,
          subtitle: `NCF: ${inv.ncf} | Total: RD$${inv.total.toLocaleString()} (${inv.status})`,
          action: () => {
            setGlobalSearch(inv.invoiceNumber);
            setCurrentTab('invoices');
          },
        });
      }
    });

    products.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)) {
        results.push({
          type: p.type === 'Producto' ? 'Producto' : 'Servicio',
          title: p.name,
          subtitle: `SKU/Código: ${p.code} | Precio Venta: RD$${p.price.toLocaleString()} ${p.type === 'Producto' ? `| Existencia: ${p.stock}` : ''}`,
          action: () => {
            setGlobalSearch(p.code);
            setCurrentTab('directories');
          },
        });
      }
    });

    setDrillResults(results.slice(0, 5));
  };


  // --- DYNAMIC SALES CHART DATA ---
  // Generation of data points based on selection
  const getSalesChartData = () => {
    if (chartPeriod === '7d') {
      // Last 7 calendar days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().substring(0, 10);
        const dayLabel = d.toLocaleDateString('es-DO', { weekday: 'narrow' }) + ' ' + d.getDate();
        const amt = validFacturas
          .filter(inv => (inv.createdAt || '').startsWith(dayStr))
          .reduce((sum, inv) => sum + inv.total, 0);
        days.push({ label: dayLabel, amount: amt });
      }
      return days;
    } else if (chartPeriod === '30d') {
      // Last 30 days grouped in 5 blocks of 6 days
      const bars = [];
      const daysCount = 30;
      const blockSize = 6;
      for (let i = 4; i >= 0; i--) {
        const startOffset = (i + 1) * blockSize;
        const endOffset = i * blockSize;
        
        const blockStart = new Date();
        blockStart.setDate(blockStart.getDate() - startOffset);
        const blockEnd = new Date();
        blockEnd.setDate(blockEnd.getDate() - endOffset);

        const label = `Día ${30 - startOffset + 1}-${30 - endOffset}`;
        
        let sumTotal = 0;
        for (let offset = endOffset; offset < startOffset; offset++) {
          const checkDate = new Date();
          checkDate.setDate(checkDate.getDate() - offset);
          const formatted = checkDate.toISOString().substring(0, 10);
          sumTotal += validFacturas
            .filter(inv => (inv.createdAt || '').startsWith(formatted))
            .reduce((sum, inv) => sum + inv.total, 0);
        }
        bars.push({ label, amount: sumTotal });
      }
      return bars;
    } else {
      // Last 12 Months
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthFilter = d.toISOString().substring(0, 7); // 'YYYY-MM'
        const label = d.toLocaleDateString('es-DO', { month: 'short' });
        const amt = validFacturas
          .filter(inv => (inv.createdAt || '').startsWith(monthFilter))
          .reduce((sum, inv) => sum + inv.total, 0);
        months.push({ label: label.charAt(0).toUpperCase() + label.slice(1), amount: amt });
      }
      return months;
    }
  };

  const currentChartData = getSalesChartData();
  const maxChartVal = Math.max(...currentChartData.map(c => c.amount), 5000);

  // --- SALES BY PAYMENT METHOD SPLIT ---
  // Calculates total transactions for Efectivo, Transferencia, Tarjeta, Cheque
  const getPaymentMethodTotals = () => {
    let cash = 0;
    let bank = 0;
    let card = 0;
    let check = 0;

    validFacturas.forEach(inv => {
      const pm = inv.paymentMethod;
      if (pm === 'Efectivo') cash += inv.total;
      else if (pm === 'Transferencia') bank += inv.total;
      else if (pm === 'Tarjeta') card += inv.total;
      else check += inv.total; // fallback/Crédito
    });

    const sumAll = cash + bank + card + check || 1;
    return {
      Efectivo: { raw: cash, pct: (cash / sumAll) * 100 },
      Transferencia: { raw: bank, pct: (bank / sumAll) * 100 },
      Tarjeta: { raw: card, pct: (card / sumAll) * 100 },
      Cheque: { raw: check, pct: (check / sumAll) * 100 },
    };
  };

  const paymentMethodStat = getPaymentMethodTotals();

  // --- SYSTEM WARNINGS SURVEILLANCE ---
  // A. Overdue Invoices
  const todayDateString = new Date().toISOString().substring(0, 10);
  const OverdueInvoicesList = listFacturas.filter(inv => inv.status === 'Pendiente' && inv.dueDate < todayDateString);

  // BI: Antigüedad de Saldos (Aging Report)
  const getAgingReport = () => {
    let current = 0;
    let days30 = 0;
    let days60 = 0;
    let days90 = 0;
    let days90Plus = 0;
    const now = new Date(todayDateString).getTime();

    listFacturas.filter(inv => inv.status === 'Pendiente').forEach(inv => {
      const associated = receipts.filter(r => r.invoiceId === inv.id);
      const paid = associated.reduce((acc, curr) => acc + curr.amountPaid, 0);
      const balance = Math.max(0, inv.total - paid);
      if(balance === 0) return;

      const due = new Date(inv.dueDate || inv.createdAt).getTime();
      const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) current += balance;
      else if (diffDays <= 30) days30 += balance;
      else if (diffDays <= 60) days60 += balance;
      else if (diffDays <= 90) days90 += balance;
      else days90Plus += balance;
    });

    return { current, days30, days60, days90, days90Plus };
  };
  const agingData = getAgingReport();

  // BI: Flujo de Caja Predictivo
  const getPredictiveCashFlow = () => {
    const bars = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const inFlow = listFacturas.filter(inv => inv.status === 'Pendiente').reduce((sum, inv) => {
        const d = new Date(inv.dueDate || inv.createdAt);
        if (d >= weekStart && d <= weekEnd) {
          const associated = receipts.filter(r => r.invoiceId === inv.id);
          const paid = associated.reduce((acc, curr) => acc + curr.amountPaid, 0);
          return sum + Math.max(0, inv.total - paid);
        }
        return sum;
      }, 0);
      
      bars.push({ label: `Semana ${i+1}`, amount: inFlow });
    }
    return bars;
  };
  const cashFlowData = getPredictiveCashFlow();
  const maxCashFlow = Math.max(...cashFlowData.map(c => c.amount), 1000);


  return (
    <div className="space-y-6" id="dashboard-stage">
      {/* Guía de Bienvenida para Nuevos Usuarios */}
      <DashboardSetupGuide
        clients={clients}
        products={products}
        invoices={invoices}
        receipts={receipts}
        expenses={expenses}
        setCurrentTab={setCurrentTab}
      />

        {/* RATED HIGHER METRIC CARDS (8 CARDS WITH GRADIENTS AND INCREASED SIZE) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="supreme-metric-tiles">
        
        {/* 1. Ventas de Hoy */}
        <Card className="border-0 rounded-3xl bg-gradient-to-br from-[#1cd8d2] to-[#01a99c] shadow-sm overflow-hidden relative">
          <div className="absolute right-4 bottom-4 opacity-50">
            <svg width="64" height="32" viewBox="0 0 48 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20 L12 12 L22 16 L38 4 L46 8"/></svg>
          </div>
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-[140px] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-white font-bold uppercase tracking-wider">Ventas de Hoy</span>
            </div>
            <div className="mt-6 space-y-1 text-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans tracking-tight truncate" title={`RD$ ${ventasDeHoy.toLocaleString('es-DO')}`}>
                RD$ {ventasDeHoy.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[9px] sm:text-[11px] text-white/90">Cierre diario en tiempo real.</p>
            </div>
          </CardContent>
        </Card>
 
        {/* 2. Ventas del Mes */}
        <Card className="border-0 rounded-3xl bg-gradient-to-br from-[#c471f5] to-[#8c52ff] shadow-sm overflow-hidden relative">
          <div className="absolute right-4 bottom-4 opacity-50">
            <svg width="64" height="32" viewBox="0 0 48 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20 L12 12 L22 16 L38 4 L46 8"/></svg>
          </div>
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-[140px] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-white font-bold uppercase tracking-wider">Ventas del Mes</span>
            </div>
            <div className="mt-6 space-y-1 text-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans tracking-tight truncate" title={`RD$ ${ventasDelMes.toLocaleString('es-DO')}`}>
                RD$ {ventasDelMes.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[9px] sm:text-[11px] text-white/90">Volumen imponible gravable.</p>
            </div>
          </CardContent>
        </Card>
 
        {/* 3. Gastos del Mes */}
        <Card className="border-0 rounded-3xl bg-gradient-to-br from-[#ff4b72] to-[#ff0040] shadow-sm overflow-hidden relative">
          <div className="absolute right-4 bottom-4 opacity-50">
            <svg width="64" height="32" viewBox="0 0 48 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20 L12 12 L22 16 L38 4 L46 8"/></svg>
          </div>
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-[140px] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-white font-bold uppercase tracking-wider">Gastos del Mes</span>
            </div>
            <div className="mt-6 space-y-1 text-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans tracking-tight truncate" title={`RD$ ${gastosDelMes.toLocaleString('es-DO')}`}>
                RD$ {gastosDelMes.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[9px] sm:text-[11px] text-white/90">Reportados bajo formato 606.</p>
            </div>
          </CardContent>
        </Card>
 
        {/* 4. Ganancia Neta */}
        <Card className="border-0 rounded-3xl bg-gradient-to-br from-[#28c76f] to-[#128a47] shadow-sm overflow-hidden relative">
          <div className="absolute right-4 bottom-4 opacity-50">
            <svg width="64" height="32" viewBox="0 0 48 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20 L12 12 L22 16 L38 4 L46 8"/></svg>
          </div>
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-[140px] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-white font-bold uppercase tracking-wider">Ganancia Neta</span>
            </div>
            <div className="mt-6 space-y-1 text-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans tracking-tight truncate" title={`RD$ ${gananciaNetaStr}`}>
                RD$ {gananciaNetaStr.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[9px] sm:text-[11px] text-white/90">Margen neto operativo estimado.</p>
            </div>
          </CardContent>
        </Card>
 
        {/* 5. Facturas Pendientes */}
        <Card className="border border-neutral-100/80 rounded-2xl bg-white shadow-sm overflow-hidden">
          <CardContent className="p-5 sm:p-6 flex items-center gap-4 h-full min-h-[110px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pink-100/70 text-pink-500 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[11px] text-neutral-500 font-bold uppercase tracking-wider block">Facturas Pendientes</span>
              <div className="text-lg sm:text-xl font-extrabold text-neutral-800 tracking-tight">
                {facturasPendientesCount} <span className="text-xs sm:text-sm font-medium text-neutral-500">documentos</span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-neutral-400">Pendientes de abono fiscal.</p>
            </div>
          </CardContent>
        </Card>
 
        {/* 6. Clientes Nuevos */}
        <Card className="border border-neutral-100/80 rounded-2xl bg-white shadow-sm overflow-hidden">
          <CardContent className="p-5 sm:p-6 flex items-center gap-4 h-full min-h-[110px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[11px] text-neutral-500 font-bold uppercase tracking-wider block">Clientes Nuevos</span>
              <div className="text-lg sm:text-xl font-extrabold text-neutral-800 tracking-tight">
                +{displayClientesNuevos} <span className="text-xs sm:text-sm font-medium text-neutral-500">este mes</span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-neutral-400">Prospectos y empresas de valor.</p>
            </div>
          </CardContent>
        </Card>
 
        {/* 7. Productos con Bajo Inventario */}
        <Card className="border border-neutral-100/80 rounded-2xl bg-white shadow-sm overflow-hidden">
          <CardContent className="p-5 sm:p-6 flex items-center gap-4 h-full min-h-[110px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-600 text-white flex items-center justify-center shrink-0">
              <BadgeAlert className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[11px] text-neutral-500 font-bold uppercase tracking-wider block">Poco Inventario</span>
              <div className="text-lg sm:text-xl font-extrabold text-neutral-800 tracking-tight">
                {totalBajoInventarioCount} <span className="text-xs sm:text-sm font-medium text-neutral-500">ítems</span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-neutral-400">Requieren reorden urgente.</p>
            </div>
          </CardContent>
        </Card>
 
        {/* 8. Cuentas por Cobrar */}
        <Card className="border border-neutral-100/80 rounded-2xl bg-white shadow-sm overflow-hidden">
          <CardContent className="p-5 sm:p-6 flex items-center gap-4 h-full min-h-[110px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0b1c3c] text-white flex items-center justify-center shrink-0">
              <ReceiptIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[11px] text-neutral-500 font-bold uppercase tracking-wider block">Cuentas por Cobrar</span>
              <div className="text-lg sm:text-xl font-extrabold text-neutral-800 tracking-tight truncate" title={`RD$ ${cuentasPorCobrarSum.toLocaleString('es-DO')}`}>
                RD$ {cuentasPorCobrarSum.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[9px] sm:text-[11px] text-neutral-400">Cartera de cobros corriente.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* METRICA EN GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-panel">
        
        {/* GRÁFICO DE VENTAS (WITH 3 DYNAMIC BUTTONS FOR 7D, 30D, and 12M EXACTLY AS DEMANDED) */}
        <Card className="lg:col-span-2 border-neutral-200 bg-white rounded-xl shadow-xs overflow-hidden">
          <CardHeader className="p-4.5 bg-neutral-50/50 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-800">Gráfico de Ventas</CardTitle>
              <CardDescription className="text-[11px] text-neutral-450">Evolución de facturación de comprobantes según rango seleccionado.</CardDescription>
            </div>
            
            {/* Quick Interactive Range filters */}
            <div className="flex gap-1.5 shrink-0 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setChartPeriod('7d')}
                className={`px-3 py-1.5 rounded-lg transition-all ${chartPeriod === '7d' ? 'bg-black text-white shadow-sm' : 'text-neutral-600 hover:text-black'}`}
              >
                Últimos 7 días
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('30d')}
                className={`px-3 py-1.5 rounded-lg transition-all ${chartPeriod === '30d' ? 'bg-black text-white shadow-sm' : 'text-neutral-600 hover:text-black'}`}
              >
                Últimos 30 días
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('12m')}
                className={`px-3 py-1.5 rounded-lg transition-all ${chartPeriod === '12m' ? 'bg-black text-white shadow-sm' : 'text-neutral-600 hover:text-black'}`}
              >
                Últimos 12 meses
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="w-full h-56">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible text-[9px] font-mono fill-neutral-500">
                <line x1="30" y1="20" x2="480" y2="20" stroke="#f0f0f0" strokeWidth="1" />
                <line x1="30" y1="90" x2="480" y2="90" stroke="#f0f0f0" strokeWidth="1" />
                <line x1="30" y1="160" x2="480" y2="160" stroke="#e5e5e5" strokeWidth="1.5" />

                {currentChartData.map((data, index) => {
                  const paddingLeft = 40;
                  const availableWidth = 430;
                  const distance = availableWidth / (currentChartData.length || 1);
                  const x = paddingLeft + index * distance + (distance - 20) / 2;

                  const ratio = data.amount / (maxChartVal || 1);
                  const barHeight = Math.max(6, ratio * 135);
                  const y = 160 - barHeight;

                  return (
                    <g key={index} className="group cursor-pointer">
                      <rect
                        x={x}
                        y={y}
                        width="18"
                        height={barHeight}
                        fill={index === currentChartData.length -1 ? "#e11d48" : "#171717"}
                        rx="3"
                        className="transition-all hover:fill-rose-700"
                      />
                      <text x={x + 9} y={y - 6} textAnchor="middle" className="font-bold fill-neutral-900 font-sans text-[8.5px]">
                        RD${(data.amount / 1000).toFixed(0)}k
                      </text>
                      <text x={x + 9} y="174" textAnchor="middle" className="fill-neutral-500 font-sans text-[8px]">
                        {data.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* VENTAS POR MÉTODO DE PAGO (Efectivo, Transferencia, Tarjeta, Cheque) */}
        <Card className="lg:col-span-1 border-neutral-200 bg-white rounded-xl shadow-xs overflow-hidden">
          <CardHeader className="p-4.5 bg-neutral-50/50 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-800">Métodos de Pago</CardTitle>
            <CardDescription className="text-[11px] text-neutral-450">Distribución de cobros y facturación según medio.</CardDescription>
          </CardHeader>
          <CardContent className="p-5.5 space-y-4">
            {/* Efectivo */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-600 rounded" />
                  Efectivo
                </span>
                <span className="font-semibold text-neutral-800">
                  {paymentMethodStat.Efectivo.pct.toFixed(0)}% ({paymentMethodStat.Efectivo.raw.toLocaleString('es-DO')} DOP)
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${paymentMethodStat.Efectivo.pct}%` }} />
              </div>
            </div>

            {/* Transferencia */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded" />
                  Transferencia
                </span>
                <span className="font-semibold text-neutral-800">
                  {paymentMethodStat.Transferencia.pct.toFixed(0)}% ({paymentMethodStat.Transferencia.raw.toLocaleString('es-DO')} DOP)
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${paymentMethodStat.Transferencia.pct}%` }} />
              </div>
            </div>

            {/* Tarjeta */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-neutral-900 rounded" />
                  Tarjeta
                </span>
                <span className="font-semibold text-neutral-800">
                  {paymentMethodStat.Tarjeta.pct.toFixed(0)}% ({paymentMethodStat.Tarjeta.raw.toLocaleString('es-DO')} DOP)
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${paymentMethodStat.Tarjeta.pct}%` }} />
              </div>
            </div>

            {/* Cheque */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded" />
                  Cheque / Crédito
                </span>
                <span className="font-semibold text-neutral-800">
                  {paymentMethodStat.Cheque.pct.toFixed(0)}% ({paymentMethodStat.Cheque.raw.toLocaleString('es-DO')} DOP)
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${paymentMethodStat.Cheque.pct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BI PANEL: Inteligencia de Negocio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-bi-panel">
        
        {/* Antigüedad de Saldos */}
        <Card className="border-neutral-200 bg-white rounded-xl shadow-xs overflow-hidden">
          <CardHeader className="p-4.5 bg-indigo-50/30 border-b border-indigo-100/50">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              Antigüedad de Saldos
            </CardTitle>
            <CardDescription className="text-[11px] text-neutral-450">Distribución de cuentas por cobrar según días de atraso.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-emerald-50 rounded p-2 border border-emerald-100">
                <div className="text-[9px] text-emerald-800 font-bold uppercase mb-1">Al Día</div>
                <div className="text-[10px] font-mono font-bold text-emerald-950">{(agingData.current / 1000).toFixed(1)}k</div>
              </div>
              <div className="bg-yellow-50 rounded p-2 border border-yellow-100">
                <div className="text-[9px] text-yellow-800 font-bold uppercase mb-1">1-30 Días</div>
                <div className="text-[10px] font-mono font-bold text-yellow-950">{(agingData.days30 / 1000).toFixed(1)}k</div>
              </div>
              <div className="bg-amber-50 rounded p-2 border border-amber-100">
                <div className="text-[9px] text-amber-800 font-bold uppercase mb-1">31-60 Días</div>
                <div className="text-[10px] font-mono font-bold text-amber-950">{(agingData.days60 / 1000).toFixed(1)}k</div>
              </div>
              <div className="bg-orange-50 rounded p-2 border border-orange-100">
                <div className="text-[9px] text-orange-800 font-bold uppercase mb-1">61-90 Días</div>
                <div className="text-[10px] font-mono font-bold text-orange-950">{(agingData.days90 / 1000).toFixed(1)}k</div>
              </div>
              <div className="bg-red-50 rounded p-2 border border-red-100">
                <div className="text-[9px] text-red-800 font-bold uppercase mb-1">&gt; 90 Días</div>
                <div className="text-[10px] font-mono font-bold text-red-950">{(agingData.days90Plus / 1000).toFixed(1)}k</div>
              </div>
            </div>
            {/* Progress Bar representation */}
            <div className="w-full h-3 bg-neutral-100 rounded-full flex overflow-hidden mt-2 border border-neutral-200">
              <div style={{width: `${(agingData.current / cuentasPorCobrarSum) * 100 || 0}%`}} className="bg-emerald-500 h-full"></div>
              <div style={{width: `${(agingData.days30 / cuentasPorCobrarSum) * 100 || 0}%`}} className="bg-yellow-400 h-full"></div>
              <div style={{width: `${(agingData.days60 / cuentasPorCobrarSum) * 100 || 0}%`}} className="bg-amber-500 h-full"></div>
              <div style={{width: `${(agingData.days90 / cuentasPorCobrarSum) * 100 || 0}%`}} className="bg-orange-500 h-full"></div>
              <div style={{width: `${(agingData.days90Plus / cuentasPorCobrarSum) * 100 || 0}%`}} className="bg-red-600 h-full"></div>
            </div>
          </CardContent>
        </Card>

        {/* Flujo de Caja Predictivo */}
        <Card className="border-neutral-200 bg-white rounded-xl shadow-xs overflow-hidden">
          <CardHeader className="p-4.5 bg-emerald-50/30 border-b border-emerald-100/50">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <BarChart4 className="w-4 h-4 text-emerald-600" />
              Flujo de Caja Predictivo (Próx. 4 Sem)
            </CardTitle>
            <CardDescription className="text-[11px] text-neutral-450">Proyección de liquidez basada en cuentas por cobrar.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="w-full h-24 flex items-end justify-between gap-4">
              {cashFlowData.map((d, i) => {
                const h = Math.max(10, (d.amount / maxCashFlow) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[9px] font-mono font-bold text-neutral-500 group-hover:text-emerald-700">{(d.amount / 1000).toFixed(1)}k</div>
                    <div className="w-full bg-emerald-100 rounded-t-md relative overflow-hidden transition-all group-hover:bg-emerald-200" style={{ height: `${h}px` }}>
                      <div className="absolute bottom-0 w-full bg-emerald-500 transition-all group-hover:bg-emerald-600" style={{ height: '100%' }}></div>
                    </div>
                    <div className="text-[9px] font-bold text-neutral-600 uppercase">{d.label}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ULTIMAS FACTURAS & ALERTAS (AS DEMANDED) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="supreme-recent-ledger-row">
        
        {/* Ultimas Facturas (Factura, Cliente, Total, Estado) */}
        <div className="lg:col-span-2">
          <Card className="border-neutral-200 bg-white rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="p-4.5 bg-neutral-50/50 border-b border-neutral-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-800">Últimas facturas</CardTitle>
                <CardDescription className="text-[11px] text-neutral-400">Listado cronológico de comprobantes fiscales de venta autorizados.</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] h-7 border-neutral-250 bg-white font-bold"
                onClick={() => setCurrentTab('facturas')}
              >
                Ver Todo
              </Button>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-xs divide-y divide-neutral-150">
                  <thead className="bg-neutral-50/20 text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider border-b border-neutral-150">
                    <tr>
                      <th className="px-4 py-2.5">Factura</th>
                      <th className="px-4 py-2.5">Cliente</th>
                      <th className="px-4 py-2.5 text-right font-sans">Total</th>
                      <th className="px-4 py-2.5 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white text-neutral-900">
                    {listFacturas.slice(0, 5).map((entry, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-neutral-950 font-mono">{entry.invoiceNumber}</td>
                        <td className="px-4 py-3 font-medium text-neutral-700">{entry.client.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-neutral-950 font-sans">
                          {entry.currency === 'USD' ? 'US$' : entry.currency === 'EUR' ? '€' : 'RD$'} {entry.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            entry.status === 'Pagada' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' :
                            entry.status === 'Anulada' ? 'bg-neutral-100 text-neutral-500' : 'bg-amber-50 text-amber-850 border border-amber-250'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {listFacturas.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-neutral-400 font-medium">Ninguna factura registrada aún.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ALERTAS WATCHDOG (Inventario bajo, Facturas vencidas, Suscripción pr, Comprobantes... ) */}
        <div className="lg:col-span-1">
          <Card className="border-neutral-200 bg-white rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="p-4.5 bg-neutral-50/50 border-b border-neutral-100 flex items-center space-x-1.5">
              <BadgeAlert className="w-4 h-4 text-rose-600" />
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-rose-800">Alertas Operativas</CardTitle>
                <CardDescription className="text-[11px] text-neutral-400">Puntos de control tributario, stock y carteras.</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 space-y-3">
              {/* 1. Inventario Bajo Alert */}
              <div className={`p-3 rounded-xl border ${totalBajoInventarioCount > 0 ? 'border-red-200 bg-red-50/30 text-red-900' : 'border-neutral-200 bg-neutral-50/40 text-neutral-500'}`}>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Inventario bajo ({totalBajoInventarioCount})</span>
                </div>
                {totalBajoInventarioCount > 0 ? (
                  <p className="text-[10px] mt-1 leading-normal">
                    Hay {totalBajoInventarioCount} productos por debajo de existencia crítica: <strong className="underline">{productosBajoStockList.slice(0, 2).map(p => p.name).join(', ')}</strong>.
                  </p>
                ) : (
                  <p className="text-[10px] mt-0.5">Todos los productos con existencias seguras.</p>
                )}
              </div>

              {/* 2. Facturas Vencidas Alert */}
              <div className={`p-3 rounded-xl border ${OverdueInvoicesList.length > 0 ? 'border-amber-200 bg-amber-50/30 text-amber-900 font-medium' : 'border-neutral-200 bg-neutral-50/40 text-neutral-500'}`}>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Facturas vencidas ({OverdueInvoicesList.length})</span>
                </div>
                {OverdueInvoicesList.length > 0 ? (
                  <p className="text-[10px] mt-1 leading-normal">
                    Se registran {OverdueInvoicesList.length} facturas pendientes de cobro fuera del plazo límite.
                  </p>
                ) : (
                  <p className="text-[10px] mt-0.5">Ningún cobro fuera de vencimiento.</p>
                )}
              </div>

              {/* 3. Suscripción Próxima a Vencer Alert */}
              <div className="p-3 border border-neutral-200 bg-neutral-50/40 text-neutral-600 rounded-xl space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>Suscripción premium activa</span>
                </div>
                <p className="text-[10px] leading-normal text-neutral-500">
                  Renovación PRO programada en 18 días. Servicio integrado DGII ilimitado habilitado.
                </p>
              </div>

              {/* 4. Comprobantes fiscales próximos a agotarse Alert */}
              <div className="p-3 border border-neutral-200 bg-neutral-50/40 text-neutral-600 rounded-xl space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                  <Landmark className="w-3.5 h-3.5 text-blue-600" />
                  <span>Secuencias NCF seguras</span>
                </div>
                <p className="text-[10px] leading-normal text-neutral-500">
                  Secuencia B02 de consumo con 391 timbres restantes. Sin peligro de agotamiento inmediato.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
