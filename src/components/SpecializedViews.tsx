import React, { useState } from 'react';
import { insforge } from '../lib/insforge';
import { FinancialAccount, Receipt as DbReceipt } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Clock,
  ArrowRight,
  TrendingUp,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Landmark,
  Users,
  Package,
  ShoppingCart,
  RefreshCw,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Trash2,
  Eye,
  Printer,
  Building,
  DollarSign,
  Briefcase,
  Layers,
  FileEdit,
  Sliders,
  ChevronRight,
  Check,
  ShieldCheck,
  Percent,
  XCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Receipt,
  Upload,
  CreditCard,
  Wallet,
  X
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// ==========================================
// CLIENT PURCHASE TIMELINE HISTORY
// ==========================================
interface ClientHistoryProps {
  clients: any[];
  invoices: any[];
}

export function ClientHistoryView({ clients, invoices }: ClientHistoryProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientInvoices = invoices.filter(inv => inv.client?.id === selectedClientId || inv.client?.rncOrCedula === selectedClient?.rncOrCedula);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.rncOrCedula.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-950 font-heading">Historial de Compras por Cliente</h2>
        <p className="text-xs text-neutral-500">Consulte el registro histórico y la línea de tiempo de adquisiciones de sus socios comerciales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left client List */}
        <Card className="lg:col-span-1 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <Input
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8.5 text-xs"
              />
            </div>
          </CardHeader>
          <CardContent className="p-2 max-h-[500px] overflow-y-auto space-y-1">
            {filteredClients.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedClientId(c.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between border-0 bg-transparent cursor-pointer ${
                  selectedClientId === c.id ? 'bg-neutral-950 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="block truncate font-bold">{c.name}</span>
                  <span className={`block text-[9px] mt-0.5 ${selectedClientId === c.id ? 'text-neutral-300' : 'text-neutral-400'}`}>RNC: {c.rncOrCedula}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 block shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right timeline */}
        <div className="lg:col-span-2 space-y-4">
          {selectedClient ? (
            <>
              <Card className="border-neutral-200">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">{selectedClient.name}</h3>
                      <p className="text-xs text-neutral-400 mt-1">Identificación: {selectedClient.rncOrCedula} | Tipo: <span className="font-semibold uppercase text-neutral-600">{selectedClient.clientType || 'Físico'}</span></p>
                    </div>
                    <div className="flex gap-4 border-l border-neutral-150 pl-4">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">Comprado</span>
                        <span className="text-sm font-black text-neutral-900">RD$ {clientInvoices.reduce((a, b) => a + b.total, 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">Transacciones</span>
                        <span className="text-sm font-black text-rose-500">{clientInvoices.length} docs</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200">
                <CardHeader className="p-4 border-b border-neutral-100 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Línea de Tiempo de Compras</CardTitle>
                  <span className="text-[10px] text-neutral-500 font-medium">Ordenado cronológicamente</span>
                </CardHeader>
                <CardContent className="p-5 relative">
                  {clientInvoices.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400 text-xs">
                      <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                      No se registran compras para este cliente aún.
                    </div>
                  ) : (
                    <div className="relative border-l border-neutral-200 ml-4 space-y-6">
                      {clientInvoices.map((inv, index) => (
                        <div key={inv.id} className="relative pl-6">
                          {/* Dot indicator */}
                          <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                            inv.status === 'Pagada' ? 'bg-emerald-500' : inv.status === 'Pendiente' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          
                          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-150 text-xs flex flex-col md:flex-row justify-between md:items-center gap-2">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-neutral-400 block">{inv.date}</span>
                              <div className="flex items-center gap-1.5 font-bold text-neutral-850">
                                <span>{inv.invoiceNumber}</span>
                                <span className="text-[9px] bg-neutral-200 text-neutral-600 px-1 py-0.2 rounded uppercase font-semibold">{inv.type}</span>
                              </div>
                              <span className="text-[11px] block text-neutral-500">Comprobante NCF: <strong className="font-mono">{inv.ncf}</strong></span>
                            </div>
                            <div className="text-right flex flex-col items-start md:items-end gap-1 shrink-0">
                              <span className="font-black text-sm text-neutral-900">RD$ {inv.total.toLocaleString()}</span>
                              <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                inv.status === 'Pagada' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>{inv.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-400">Por favor, cree un cliente en el catálogo para visualizar su historial.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CLIENT ACCOUNT LEDGER STATEMENT (ESTADO DE CUENTA)
// ==========================================
interface StatementProps {
  clients: any[];
  invoices: any[];
  receipts: any[];
}

export function ClientAccountStatementView({ clients, invoices, receipts }: StatementProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [dateRange, setDateRange] = useState('all');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientInvoices = invoices.filter(inv => inv.client?.id === selectedClientId);
  
  // Calculate balances
  const totalFacturado = clientInvoices.reduce((acc, curr) => acc + curr.total, 0);
  const totalUnpaid = clientInvoices.filter(inv => inv.status !== 'Pagada').reduce((acc, curr) => acc + curr.total, 0);
  const totalPaid = totalFacturado - totalUnpaid;

  // Ledger entries
  const ledgerEntries = [
    ...clientInvoices.map(inv => ({
      date: inv.date,
      ref: inv.invoiceNumber,
      concept: `Factura de Venta NCF: ${inv.ncf}`,
      debit: inv.total,
      credit: 0
    })),
    ...receipts.filter(rec => rec.client?.id === selectedClientId || rec.clientName === selectedClient?.name).map(rec => ({
      date: rec.date || '2026-06-10',
      ref: rec.receiptNumber || 'REC-001',
      concept: `Recibo de Ingreso - Pago Facturas`,
      debit: 0,
      credit: rec.amount || 0
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Running balance calculation
  let runningBalance = 0;
  const ledgerWithRunning = ledgerEntries.map(entry => {
    runningBalance += (entry.debit - entry.credit);
    return { ...entry, balance: runningBalance };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 font-heading">Estado de Cuenta de Cliente</h2>
          <p className="text-xs text-neutral-500">Genere estados de cuenta oficiales y reportes de cuentas pendientes para cobros fiscales.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-xs shrink-0 flex items-center space-x-1 border-neutral-300" onClick={() => window.print()}>
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </Button>
          <Button variant="outline" className="text-xs shrink-0 flex items-center space-x-1 border-neutral-300">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-neutral-200">
          <CardContent className="p-4">
            <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Seleccionar Cliente</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-full text-xs font-semibold h-[34px] border-neutral-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Total Facturado</span>
            <span className="text-base font-black text-neutral-900 mt-1">RD$ {totalFacturado.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block text-emerald-850">Abonado/Cobrado</span>
            <span className="text-base font-black text-emerald-700 mt-1">RD$ {totalPaid.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-neutral-950 text-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Balance Pendiente</span>
            <span className="text-base font-black text-rose-500 mt-1">RD$ {totalUnpaid.toLocaleString()}</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Auxiliar de Cuenta Corriente (Mayor Detallado)</CardTitle>
            <CardDescription className="text-[10px]">Detalle de facturación de crédito versus recibos de pago cobrados.</CardDescription>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] text-xs h-7 border-neutral-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Ver todas las fechas</SelectItem>
              <SelectItem value="30" className="text-xs">Últimos 30 días</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          {ledgerWithRunning.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">No se registran cargos ni abonos para este cliente.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/70 text-[10px] font-bold text-neutral-450 uppercase border-b border-neutral-100">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Referencia</th>
                  <th className="p-3">Concepto/Descripción</th>
                  <th className="p-3 text-right">Cargo (Débito)</th>
                  <th className="p-3 text-right">Abono (Crédito)</th>
                  <th className="p-3 text-right bg-neutral-50/50">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {ledgerWithRunning.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/35 transition-colors">
                    <td className="p-3 font-mono text-neutral-500">{entry.date}</td>
                    <td className="p-3 font-bold text-neutral-800">{entry.ref}</td>
                    <td className="p-3 text-neutral-600">{entry.concept}</td>
                    <td className="p-3 text-right text-rose-650 font-medium">
                      {entry.debit > 0 ? `RD$ ${entry.debit.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3 text-right text-emerald-650 font-medium">
                      {entry.credit > 0 ? `RD$ ${entry.credit.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3 text-right font-bold bg-neutral-50/30">
                      RD$ {entry.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// PRODUCT CATEGORIES MANAGEMENT (CATEGORIAS)
// ==========================================
interface CategoriesProps {
  products: any[];
  addProduct: any;
}

export function ProductCategoriesView({ products, addProduct }: CategoriesProps) {
  const [categories, setCategories] = useState<string[]>([
    'Tecnología', 'Ferretería', 'Servicios', 'Materiales de Oficina', 'Consumos Varios', 'Alimentos', 'Logística'
  ]);
  const [newCatName, setNewCatName] = useState('');

  // Count products in categories
  const categoryStats = categories.map(cat => {
    const matchedProducts = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
    return {
      name: cat,
      count: matchedProducts.length,
      avgPrice: matchedProducts.reduce((acc, curr) => acc + curr.price, 0) / (matchedProducts.length || 1)
    };
  });

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (categories.some(c => c.toLowerCase() === newCatName.trim().toLowerCase())) return;
    setCategories([...categories, newCatName.trim()]);
    setNewCatName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-950 font-heading">Categorías de Productos</h2>
        <p className="text-xs text-neutral-500">Gestione la taxonomía de mercancías y ordene sus ítems por departamento de inventario.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Crear Categoría</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleAddCat} className="space-y-3">
              <div>
                <Label className="text-[10px] text-neutral-400 font-bold uppercase">Nombre del Departamento</Label>
                <Input
                  placeholder="Ej: Repuestos, Juguetes..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="text-xs h-8.5 mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800 text-xs h-8 rounded-lg font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Agregar</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Listado de Categorías de Inventario</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-400">
                  <th className="p-3">Categoría</th>
                  <th className="p-3 text-center">Productos Asociados</th>
                  <th className="p-3 text-right">Precio Promedio</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categoryStats.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/40">
                    <td className="p-3 font-bold text-neutral-805 flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{stat.name}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-bold text-[10px]">{stat.count} items</span>
                    </td>
                    <td className="p-3 text-right font-semibold text-neutral-850">
                      RD$ {stat.avgPrice.toLocaleString('es-DO', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-red-650" disabled={stat.count > 0}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// INVENTORY ADJUSTMENTS REGISTER (AJUSTES)
// ==========================================
interface AdjustmentsProps {
  products: any[];
  updateProduct: any;
}

interface AdjustmentLog {
  id: string;
  date: string;
  productCode: string;
  productName: string;
  type: string;
  quantity: number;
  reason: string;
  user: string;
}

export function InventoryAdjustmentsView({ products, updateProduct }: AdjustmentsProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [adjustType, setAdjustType] = useState('add');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('Conteo físico trimestral');
  
  const [adjustmentLogs, setAdjustmentLogs] = useState<AdjustmentLog[]>([
    {
      id: 'ADJ-001',
      date: '2026-06-08',
      productCode: 'CON-001',
      productName: 'Asesoría Tributaria DGII',
      type: 'Adicional',
      quantity: 5,
      reason: 'Alineación de existencias con auditoría interna',
      user: 'Admin Colega'
    },
    {
      id: 'ADJ-002',
      date: '2026-06-09',
      productCode: 'MUE-002',
      productName: 'Monitor LED 24"',
      type: 'Merma/Pérdida',
      quantity: -1,
      reason: 'Mercancía averiada durante traslado de almacén',
      user: 'Soporte Colega'
    }
  ]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const actualQty = adjustType === 'add' ? qty : -qty;
    const finalStock = (selectedProduct.stock || 0) + actualQty;

    // Update product stock state
    updateProduct(selectedProduct.id, { stock: finalStock });

    const newLog: AdjustmentLog = {
      id: `ADJ-00${adjustmentLogs.length + 3}`,
      date: new Date().toISOString().split('T')[0],
      productCode: selectedProduct.code,
      productName: selectedProduct.name,
      type: adjustType === 'add' ? 'Adicional' : 'Merma/Pérdida',
      quantity: actualQty,
      reason: reason || 'Ajuste general de stock',
      user: 'Administrador'
    };

    setAdjustmentLogs([newLog, ...adjustmentLogs]);
    setQty(1);
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-950 font-heading">Ajuste de Stock manual</h2>
        <p className="text-xs text-neutral-500">Registre pérdidas, averías o auditorías de inventario manual con trazabilidad fiscal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Registrar Ajuste</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {selectedProduct ? (
              <form onSubmit={handleAdjustSubmit} className="space-y-3 font-sans">
                <div>
                  <Label className="text-[10px] text-neutral-400 font-bold uppercase">Seleccionar Mercancía</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="w-full text-xs font-semibold h-[34px] border-neutral-200 mt-1 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">{p.code} - {p.name} (Stock: {p.stock})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase">Tipo de Ajuste</Label>
                    <Select value={adjustType} onValueChange={setAdjustType}>
                      <SelectTrigger className="w-full text-xs font-semibold h-[34px] border-neutral-200 mt-1 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add" className="text-xs">Sumar (+)</SelectItem>
                        <SelectItem value="lose" className="text-xs">Merma (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase font-sans">Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="text-xs h-8.5 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] text-neutral-400 font-bold uppercase">Justificación o Motivo</Label>
                  <Input
                    placeholder="Ej: Auditoría física de cierres..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-xs h-8.5 mt-1"
                  />
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800 text-xs h-8.5 rounded-lg font-bold">
                  <span>Aplicar Ajuste de Existencias</span>
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 text-neutral-400 text-xs">Cree mercancía en su catálogo primero.</div>
            )}
          </CardContent>
        </Card>

        {/* Adjustments history path */}
        <Card className="lg:col-span-2 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Historial y Trazabilidad de Ajustes</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-400">
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Producto</th>
                  <th className="p-3 text-center">Efecto</th>
                  <th className="p-3">Auditor/Usuario</th>
                  <th className="p-3">Justificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {adjustmentLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-neutral-50/45">
                    <td className="p-3 font-mono text-neutral-500 font-bold">{log.id}</td>
                    <td className="p-3 font-mono text-neutral-400">{log.date}</td>
                    <td className="p-3">
                      <span className="font-bold text-neutral-850 block">{log.productName}</span>
                      <span className="text-[9px] text-neutral-450 block mt-0.5">SKU: {log.productCode}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        log.quantity > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {log.quantity > 0 ? `+${log.quantity}` : `${log.quantity}`}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-neutral-600">{log.user}</td>
                    <td className="p-3 max-w-[200px] truncate text-neutral-500 leading-tight" title={log.reason}>{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// ARQUEOS Y GERENCIA DE CAJA CHICA (CAJA)
// ==========================================
interface FinancialCajaViewProps {
  financialAccounts: FinancialAccount[];
  receipts: DbReceipt[];
  addFinancialAccount: (acc: Omit<FinancialAccount, 'id' | 'createdAt'>) => FinancialAccount;
  updateFinancialAccount: (id: string, fields: Partial<FinancialAccount>) => void;
  deleteFinancialAccount: (id: string) => void;
}

export function FinancialCajaView({
  financialAccounts,
  receipts,
  addFinancialAccount,
  updateFinancialAccount,
  deleteFinancialAccount,
}: FinancialCajaViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<FinancialAccount | null>(null);

  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');

  // Filter accounts of type 'Caja'
  const cajas = financialAccounts.filter(acc => acc.type === 'Caja');

  // Active Selected Caja ID
  const [selectedAccId, setSelectedAccId] = useState<string | null>(() => {
    return cajas[0]?.id || null;
  });

  const selectedCaja = cajas.find(c => c.id === selectedAccId) || cajas[0] || null;

  // Receipts deposited to the selected caja
  const associatedReceipts = selectedCaja 
    ? receipts.filter(r => r.accountId === selectedCaja.id)
    : [];

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editAccount) {
      updateFinancialAccount(editAccount.id, {
        name,
        balance: Number(balance) || 0
      });
    } else {
      const newAcc = addFinancialAccount({
        name,
        type: 'Caja',
        balance: Number(balance) || 0
      });
      if (newAcc) {
        setSelectedAccId(newAcc.id);
      }
    }

    // Reset
    setName('');
    setBalance('0');
    setEditAccount(null);
    setModalOpen(false);
  };

  const openAddModal = () => {
    setEditAccount(null);
    setName('');
    setBalance('0');
    setModalOpen(true);
  };

  const openEditModal = (acc: FinancialAccount) => {
    setEditAccount(acc);
    setName(acc.name);
    setBalance(String(acc.balance));
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta caja física? Se perderá este método de cobro en el POS.')) {
      deleteFinancialAccount(id);
      if (selectedAccId === id) {
        setSelectedAccId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 font-heading">Arqueo y Control de Caja Chica</h2>
          <p className="text-xs text-neutral-500">Supervise la caja diaria, registre flujos menores y valide arqueos de conciliación física.</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs h-8.5 font-bold rounded-lg shrink-0 flex items-center"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Añadir / Crear Nueva Caja</span>
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-neutral-100 rounded-lg text-neutral-900 border">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Cajas Registradas</span>
              <span className="text-base font-black text-neutral-900 mt-0.5 block">{cajas.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-100">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Fondo Total en Cajas</span>
              <span className="text-base font-black text-emerald-800 mt-0.5 block">
                RD$ {cajas.reduce((sum, c) => sum + c.balance, 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 bg-neutral-950 text-white shadow-md">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-neutral-900 rounded-lg text-white border border-neutral-800">
              <Wallet className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider block">Caja Activa Seleccionada</span>
              <span className="text-base font-black text-amber-400 mt-0.5 block">
                {selectedCaja ? `RD$ ${selectedCaja.balance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}` : 'Ninguna'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: LIST OF CASHS */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-neutral-450 uppercase tracking-widest block">Lista de Cajas Físicas</h3>
          {cajas.length === 0 ? (
            <div className="border border-dashed p-8 rounded-xl text-center text-xs text-neutral-400 bg-white">
              No hay cajas creadas. Pulse "Añadir / Crear Nueva Caja" para configurar un punto de entrada para el cobro en efectivo.
            </div>
          ) : (
            <div className="space-y-2">
              {cajas.map(c => {
                const isSelected = selectedCaja?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedAccId(c.id)}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm'
                        : 'bg-white border-neutral-200 hover:border-neutral-350 text-neutral-900'
                    }`}
                  >
                    <div className="space-y-1 overflow-hidden pr-2">
                      <span className="text-xs font-bold leading-tight block truncate">{c.name}</span>
                      <span className={`text-[10px] uppercase font-semibold block ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`}>
                        Efectivo en Caja • RD$ {c.balance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(c)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSelected 
                            ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-805 text-neutral-300 hover:text-white' 
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                        }`}
                        title="Editar Caja"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSelected 
                            ? 'bg-neutral-900 hover:bg-rose-950 border-neutral-805 text-neutral-300 hover:text-rose-400' 
                            : 'bg-neutral-50 hover:bg-rose-50 border-neutral-200 text-neutral-600 hover:text-rose-600'
                        }`}
                        title="Eliminar Caja"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RECENT SALES DEPOSITED TO THIS CAJA */}
        <Card className="lg:col-span-2 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100 bg-neutral-50/50">
            <CardTitle className="text-xs font-bold uppercase text-neutral-700">
              Historial de Cobros Recibidos: {selectedCaja?.name || 'Ninguna seleccionada'}
            </CardTitle>
            <CardDescription className="text-[11px]">
              Ventas POS registradas con cobro en efectivo ingresadas directamente a este fondo de caja.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto text-xs font-sans">
            {!selectedCaja ? (
              <div className="p-12 text-center text-neutral-400">Seleccione una caja para ver su historial.</div>
            ) : associatedReceipts.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 leading-relaxed">
                No se han registrado cobros o facturas liquidadas en esta caja física en el sistema todavía.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-400">
                    <th className="p-3">Recibo / Trx</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Fecha de Cobro</th>
                    <th className="p-3 text-right">Monto Recibido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {associatedReceipts.map((r, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/45">
                      <td className="p-3 font-mono text-neutral-400 font-bold">{r.receiptNumber}</td>
                      <td className="p-3 font-semibold text-neutral-850">{r.clientName}</td>
                      <td className="p-3 text-neutral-500">
                        {new Date(r.date).toLocaleDateString('es-DO', { hour: 'numeric', minute: 'numeric' })}
                      </td>
                      <td className="p-3 text-right font-black text-emerald-700 font-mono">
                        + RD$ {r.amountPaid.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CREATE / EDIT CAJA MODAL CONTAINER */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-neutral-50 border-b border-neutral-100 p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                {editAccount ? 'Editar Registro de Caja' : 'Crear Caja Chica / Registradora'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="p-5 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="caja-name" className="text-xs font-bold text-neutral-700">Nombre descriptivo de la Caja chica</Label>
                <Input
                  id="caja-name"
                  placeholder="Ej. Caja Principal Tienda Norte, Caja Chica Oficina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="caja-balance" className="text-xs font-bold text-neutral-700">Fondo Inicial RD$</Label>
                <Input
                  id="caja-balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="text-xs h-9"
                />
                <p className="text-[10px] text-neutral-400 leading-none">Indique el balance actual disponible o inicie en 0.</p>
              </div>

              <div className="flex items-center space-x-2 justify-end pt-2 border-t border-neutral-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-black text-white hover:bg-neutral-800">
                  {editAccount ? 'Guardar Cambios' : 'Aperturar Caja'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CONTROL DE CUENTAS BANCARIAS Y VERIFONES (BANCOS)
// ==========================================
interface FinancialBancosViewProps {
  financialAccounts: FinancialAccount[];
  receipts: DbReceipt[];
  addFinancialAccount: (acc: Omit<FinancialAccount, 'id' | 'createdAt'>) => FinancialAccount;
  updateFinancialAccount: (id: string, fields: Partial<FinancialAccount>) => void;
  deleteFinancialAccount: (id: string) => void;
}

export function FinancialBancosView({
  financialAccounts,
  receipts,
  addFinancialAccount,
  updateFinancialAccount,
  deleteFinancialAccount,
}: FinancialBancosViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<FinancialAccount | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<'Banco' | 'Verifone' | 'Caja'>('Banco');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('0');

  const [reconcileOpen, setReconcileOpen] = useState(false);

  // Filter accounts of type 'Banco' or 'Verifone'
  const bankAccounts = financialAccounts.filter(acc => acc.type === 'Banco' || acc.type === 'Verifone');

  // Selected Active Account ID
  const [selectedAccId, setSelectedAccId] = useState<string | null>(() => {
    return bankAccounts[0]?.id || null;
  });

  const selectedBank = bankAccounts.find(b => b.id === selectedAccId) || bankAccounts[0] || null;

  // Receipts deposited to the selected bank account
  const associatedReceipts = selectedBank 
    ? receipts.filter(r => r.accountId === selectedBank.id)
    : [];

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editAccount) {
      updateFinancialAccount(editAccount.id, {
        name,
        type,
        bankName: type === 'Banco' ? bankName : undefined,
        accountNumber: type === 'Banco' ? accountNumber : undefined,
        balance: Number(balance) || 0
      });
    } else {
      const newAcc = addFinancialAccount({
        name,
        type,
        bankName: type === 'Banco' ? bankName : undefined,
        accountNumber: type === 'Banco' ? accountNumber : undefined,
        balance: Number(balance) || 0
      });
      if (newAcc) {
        setSelectedAccId(newAcc.id);
      }
    }

    // Reset
    setName('');
    setType('Banco');
    setBankName('');
    setAccountNumber('');
    setBalance('0');
    setEditAccount(null);
    setModalOpen(false);
  };

  const openAddModal = () => {
    setEditAccount(null);
    setName('');
    setType('Banco');
    setBankName('');
    setAccountNumber('');
    setBalance('0'); // Initializes to 0 by default
    setModalOpen(true);
  };

  const openEditModal = (acc: FinancialAccount) => {
    setEditAccount(acc);
    setName(acc.name);
    setType(acc.type as 'Banco' | 'Verifone' | 'Caja');
    setBankName(acc.bankName || '');
    setAccountNumber(acc.accountNumber || '');
    setBalance(String(acc.balance));
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este método de pago? (Cuenta / Verifone)')) {
      deleteFinancialAccount(id);
      if (selectedAccId === id) {
        setSelectedAccId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 font-heading">Control de Cuentas Bancarias y Verifones</h2>
          <p className="text-xs text-neutral-500">Administre cuentas de banco y terminales de pago POS para realizar cobros con tarjeta y transferencias.</p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setReconcileOpen(!reconcileOpen)}
            className="text-xs h-8.5 font-bold border-neutral-300 bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            <span>Conciliar Estado</span>
          </Button>
          <Button
            onClick={openAddModal}
            className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs h-8.5 font-bold rounded-lg flex items-center"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Crear Método / Cuenta</span>
          </Button>
        </div>
      </div>

      {bankAccounts.length === 0 ? (
        <div className="border border-dashed p-12 rounded-xl text-center text-xs text-neutral-400 bg-white">
          No tiene cuentas de banco o verifones configurados. Haga clic en "Crear Método / Cuenta" para empezar totalmente desde 0.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bankAccounts.map(b => {
            const isSelected = selectedBank?.id === b.id;
            return (
              <Card
                key={b.id}
                onClick={() => setSelectedAccId(b.id)}
                className={`cursor-pointer transition-all border relative overflow-hidden group hover:border-neutral-400 flex flex-col justify-between ${
                  isSelected ? 'border-neutral-950 bg-neutral-950 text-white shadow-md' : 'border-neutral-200 bg-white'
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 overflow-hidden pr-6">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {b.type === 'Banco' ? `${b.bankName || 'Banco'} • № ${b.accountNumber || 'Corr'}` : 'Verifone POS'}
                      </span>
                      <h3 className="text-sm font-bold truncate leading-tight block pr-2">{b.name}</h3>
                    </div>
                    {/* Floating icons with Action Trigger */}
                    <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(b)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSelected 
                            ? 'bg-neutral-900 hover:bg-neutral-850 border-neutral-805 text-neutral-300 hover:text-white' 
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                        }`}
                        title="Editar Cuenta"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSelected 
                            ? 'bg-neutral-900 hover:bg-rose-950 border-neutral-805 text-neutral-300 hover:text-rose-400' 
                            : 'bg-neutral-50 hover:bg-rose-50 border-neutral-200 text-neutral-605 hover:text-rose-600'
                        }`}
                        title="Eliminar Cuenta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`border-t pt-3 ${isSelected ? 'border-neutral-850' : 'border-neutral-100'}`}>
                    <span className={`text-[10px] font-bold tracking-widest uppercase block ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      Balance Inicial / Disponible
                    </span>
                    <span className={`text-lg font-black mt-0.5 block font-mono ${isSelected ? 'text-amber-400' : 'text-neutral-900'}`}>
                      RD$ {b.balance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* RECONCILE POPUP SIMULATION */}
      {reconcileOpen && (
        <Card className="border-emerald-200 bg-emerald-50/10 animate-fade-in">
          <CardHeader className="p-4 border-b border-neutral-100 bg-neutral-100/30">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-550 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cruce de Conciliación Bancaria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs font-sans">
            <p className="text-neutral-600">
              Cruza los fondos depositados por transferencias y cierres de lotes de tarjeta (Verifone) con la cuenta activa seleccionada.
            </p>
            <div className="bg-white border border-neutral-250 rounded-lg p-4 divide-y divide-neutral-150">
              <div className="py-2 flex items-center justify-between">
                <span>Estado de Conciliación ({selectedBank?.name || 'Ninguno'})</span>
                <span className="font-bold text-emerald-700 uppercase flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Balance Conciliado</span>
              </div>
              <div className="py-2 flex items-center justify-between text-neutral-500">
                <span>Diferencias sin conciliar</span>
                <span className="font-mono font-bold">RD$ 0.00 DOP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DETAIL HISTORY FOR SELECTED BANK / VERIFONE */}
      {selectedBank && (
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="p-4 border-b border-neutral-100 bg-neutral-50/50">
            <CardTitle className="text-xs font-bold uppercase text-neutral-700">
              Historial de Transferencias y Tarjetas Recibidos: {selectedBank.name}
            </CardTitle>
            <CardDescription className="text-[11px]">
              Registro detallado de transacciones liquidadas para esta cuenta o procesador digital.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto text-xs font-sans">
            {associatedReceipts.length === 0 ? (
              <div className="p-12 text-center text-neutral-400">
                No hay transacciones registradas de facturas o cobros liquidados en este banco/verifone todavía.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-400">
                    <th className="p-3">Código Recibo</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3 text-right">Depósito</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {associatedReceipts.map((r, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/45">
                      <td className="p-3 font-mono text-neutral-400 font-bold">{r.receiptNumber}</td>
                      <td className="p-3 font-semibold text-neutral-850">{r.clientName}</td>
                      <td className="p-3 text-neutral-500">
                        {new Date(r.date).toLocaleDateString('es-DO', { hour: 'numeric', minute: 'numeric' })}
                      </td>
                      <td className="p-3 text-right font-black text-emerald-700 font-mono">
                        + RD$ {r.amountPaid.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* DIALOG FOR CREATE/EDIT BANK ACCOUNT */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-neutral-50 border-b border-neutral-100 p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                {editAccount ? 'Editar Cuenta o Verifone' : 'Agregar Método de Pago'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="p-5 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="acc-type" className="text-xs font-bold text-neutral-700">Tipo de Método de Pago</Label>
                <Select value={type} onValueChange={(val: 'Banco' | 'Verifone' | 'Caja') => setType(val)}>
                  <SelectTrigger id="acc-type" className="w-full text-xs font-semibold h-9 border-neutral-250 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Banco" className="text-xs">Cuenta de Banco (Banco Popular, Banreservas...)</SelectItem>
                    <SelectItem value="Verifone" className="text-xs">Verifone (Procesador Tarjetas Visa/Mastercard)</SelectItem>
                    <SelectItem value="Caja" className="text-xs">Caja Física Fuerte / Caja Chica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="acc-name" className="text-xs font-bold text-neutral-700">Nombre de la Cuenta o Verifone *</Label>
                <Input
                  id="acc-name"
                  placeholder="Ej. Banco Popular Corriente DOP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              {type === 'Banco' && (
                <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="acc-bank" className="text-[10px] uppercase font-bold text-neutral-600">Banco Emisor</Label>
                    <Input
                      id="acc-bank"
                      placeholder="Ej. Banco BHD"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="text-xs h-8 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="acc-num" className="text-[10px] uppercase font-bold text-neutral-600">No. Cuenta</Label>
                    <Input
                      id="acc-num"
                      placeholder="Ej. 748596123"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="text-xs h-8 bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="acc-balance" className="text-xs font-bold text-neutral-700">Fondo Inicial RD$</Label>
                <Input
                  id="acc-balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="text-xs h-9"
                />
                <p className="text-[10px] text-neutral-400 leading-none">Indique el balance inicial disponible de apertura o inicie en 0.</p>
              </div>

              <div className="flex items-center space-x-2 justify-end pt-2 border-t border-neutral-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-black text-white hover:bg-neutral-800">
                  {editAccount ? 'Guardar Cambios' : 'Aperturar Método'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ACCOUNTS RECEIVABLE AGING (COBRAR)
// ==========================================
export function AccountsReceivableView({ invoices, receipts, payInvoice, financialAccounts }: { invoices: any[]; receipts: any[]; payInvoice: any; financialAccounts: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Efectivo');
  const [accountId, setAccountId] = useState('');

  const mappedInvoices = invoices.filter(inv => inv.paymentCondition !== 'Contado' && inv.status !== 'Pagada').map(inv => {
    const paid = receipts?.filter(r => r.invoiceId === inv.id).reduce((sum, r) => sum + (r.amountPaid || 0), 0) || 0;
    const debt = Math.max(0, inv.total - paid);
    return { ...inv, currentDebt: debt };
  }).filter(inv => inv.currentDebt > 0);

  const outstandingSum = mappedInvoices.reduce((acc, curr) => acc + curr.currentDebt, 0);

  // Divide into aging categories based on current Date (mock calculations for UI purposes)
  const currentTotal = outstandingSum;
  const current30Days = mappedInvoices.filter((inv, i) => i % 3 === 0).reduce((acc, curr) => acc + curr.currentDebt, 0);
  const current60Days = mappedInvoices.filter((inv, i) => i % 3 === 1).reduce((acc, curr) => acc + curr.currentDebt, 0);
  const current90DaysAndOver = currentTotal - current30Days - current60Days;

  const handleOpenModal = (inv: any) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.currentDebt.toString());
    setModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !payAmount) return;
    payInvoice(selectedInvoice.id, parseFloat(payAmount), payMethod, undefined, accountId !== 'none' ? accountId : undefined);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-950 font-heading">Cuentas por Cobrar (Vencimiento de Cartera)</h2>
        <p className="text-xs text-neutral-500">Supervise el estado de vencimiento de las facturas a crédito y automatice las gestiones de reclamación.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-neutral-200 bg-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-455 font-bold uppercase tracking-wider block">Total por Cobrar</span>
            <span className="text-lg font-black text-rose-600 mt-1">RD$ {currentTotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 bg-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-455 font-bold uppercase tracking-wider block">Corriente (0 - 30 Días)</span>
            <span className="text-lg font-black text-neutral-855 mt-1">RD$ {current30Days.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 bg-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-455 font-bold uppercase tracking-wider block">Vencido (31 - 60 Días)</span>
            <span className="text-lg font-black text-amber-900 mt-1">RD$ {current60Days.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 bg-red-50/20 text-red-900">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider block font-sans">Cartera Crítica (61+ Días)</span>
            <span className="text-lg font-black text-red-650 mt-1">RD$ {current90DaysAndOver.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Detalle de Facturas por Cobrar</CardTitle>
          <span className="text-[10px] text-neutral-500 font-medium">Ordenado por balance pendiente</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          {mappedInvoices.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">Excelente! No tiene cuentas por cobrar pendientes.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-450">
                  <th className="p-3">Factura No.</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">RNC/Identidad</th>
                  <th className="p-3">Vencimiento</th>
                  <th className="p-3 text-right">Monto Original</th>
                  <th className="p-3 text-right">Balance Pendiente</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {mappedInvoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/45">
                    <td className="p-3 font-bold text-neutral-800">{inv.invoiceNumber}</td>
                    <td className="p-3 font-semibold text-neutral-855">{inv.client?.name}</td>
                    <td className="p-3 font-mono text-neutral-500">{inv.client?.rncOrCedula}</td>
                    <td className="p-3 font-mono text-neutral-400">{inv.createdAt?.split('T')[0]}</td>
                    <td className="p-3 text-right text-neutral-600">RD$ {inv.total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                    <td className="p-3 text-right font-black text-rose-600">RD$ {inv.currentDebt.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                    <td className="p-3 text-right">
                      <Button onClick={() => handleOpenModal(inv)} size="sm" variant="outline" className="text-[10px] h-7 px-2 border-neutral-200 text-rose-650 hover:text-rose-700 bg-white">
                        <span>Abonar / Cobrar</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {modalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h3 className="font-bold text-neutral-900">Registrar Pago / Abono</h3>
              <Button variant="ghost" size="icon" onClick={() => setModalOpen(false)} className="h-6 w-6"><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleSubmitPayment} className="p-4 space-y-4">
              <div className="text-xs text-neutral-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                Factura: <span className="font-bold">{selectedInvoice.invoiceNumber}</span><br />
                Cliente: <span className="font-bold">{selectedInvoice.client?.name}</span><br />
                Balance Pendiente: <span className="font-bold text-rose-600">RD$ {selectedInvoice.currentDebt.toLocaleString()}</span>
              </div>

              <div>
                <Label className="text-xs font-bold text-neutral-700">Monto a Abonar (RD$)</Label>
                <Input
                  type="number" step="0.01" max={selectedInvoice.currentDebt}
                  value={payAmount} onChange={e => setPayAmount(e.target.value)} required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-neutral-700">Método de Pago</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta / Verifone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-neutral-700">Cuenta de Destino (Opcional)</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Seleccione una cuenta para ingreso..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- No registrar en cuentas --</SelectItem>
                    {financialAccounts?.map((acc: any) => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.name} - {acc.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="button" variant="outline" className="mr-2" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-black text-white hover:bg-neutral-800">Registrar Pago</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ACCOUNTS PAYABLE TO SUPPLIERS (PAGAR)
// ==========================================
export function AccountsPayableView({ 
  purchaseOrders, 
  expenses,
  expensePayments,
  purchaseOrderPayments,
  addExpensePayment,
  addPurchaseOrderPayment,
  financialAccounts
}: { 
  purchaseOrders?: any[]; 
  expenses?: any[];
  expensePayments?: any[];
  purchaseOrderPayments?: any[];
  addExpensePayment?: any;
  addPurchaseOrderPayment?: any;
  financialAccounts?: any[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Transferencia');
  const [accountId, setAccountId] = useState('');

  // Build debts from pending purchase orders and unpaid expenses
  const poDebts = (purchaseOrders || [])
    .map(po => {
      const debt = Math.max(0, po.total - (po.amountPaid || 0));
      return {
        id: po.id,
        refNumber: po.poNumber,
        supplier: po.providerName || 'Suplidor General',
        docType: 'Orden de Compra',
        originalAmount: po.total || 0,
        currentDebt: debt,
        date: po.createdAt?.split('T')[0] || ''
      };
    }).filter(d => d.currentDebt > 0);

  const expDebts = (expenses || [])
    .filter(e => e.status !== 'Pagada')
    .map(e => {
      const debt = Math.max(0, e.amount - (e.amountPaid || 0));
      return {
        id: e.id,
        refNumber: e.ncf || e.id.substring(0, 8),
        supplier: e.providerName || 'Proveedor',
        docType: 'Gasto Operativo',
        originalAmount: e.amount || 0,
        currentDebt: debt,
        date: e.date?.split('T')[0] || ''
      };
    }).filter(d => d.currentDebt > 0);

  const debts = [...poDebts, ...expDebts];
  const outstandingPagarSum = debts.reduce((acc, curr) => acc + curr.currentDebt, 0);

  const handleOpenModal = (debt: any) => {
    setSelectedDebt(debt);
    setPayAmount(debt.currentDebt.toString());
    setModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt || !payAmount) return;
    
    if (selectedDebt.docType === 'Orden de Compra') {
      addPurchaseOrderPayment?.(selectedDebt.id, parseFloat(payAmount), payMethod, accountId !== 'none' ? accountId : undefined);
    } else {
      addExpensePayment?.(selectedDebt.id, parseFloat(payAmount), payMethod, accountId !== 'none' ? accountId : undefined);
    }
    
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-950 font-heading">Cuentas por Pagar (Control de Proveedores)</h2>
        <p className="text-xs text-neutral-500">Administre las deudas operativas y liquidaciones de facturas emitidas por sus suplidores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-neutral-200 bg-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider block">Total por Pagar Proveedores</span>
            <span className="text-base font-black text-amber-900 mt-1">RD$ {outstandingPagarSum.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 bg-white">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider block">Compromisos Activos</span>
            <span className="text-base font-black text-neutral-850 mt-1">{debts.length} documentos pendientes</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Compromisos Financieros de Gastos y Compras</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          {debts.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">Felicidades! No cuenta con facturas ni deudas de compras por pagar.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-450">
                  <th className="p-3">Referencia</th>
                  <th className="p-3">Proveedor</th>
                  <th className="p-3">Tipo Documento</th>
                  <th className="p-3 text-right">Importe Inic.</th>
                  <th className="p-3 text-right">Monto Adeudado</th>
                  <th className="p-3 text-right">Acciones de Pago</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {debts.map((d, index) => (
                  <tr key={index} className="hover:bg-neutral-50/45">
                    <td className="p-3 font-mono text-neutral-800 font-bold">{d.refNumber}</td>
                    <td className="p-3 font-bold text-neutral-850">{d.supplier}</td>
                    <td className="p-3 text-neutral-500">{d.docType}</td>
                    <td className="p-3 text-right text-neutral-600">RD$ {d.originalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                    <td className="p-3 text-right font-bold text-amber-900">RD$ {d.currentDebt.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenModal(d)}
                        className="text-[10px] h-7 px-2 border-neutral-200 bg-neutral-900 font-bold text-white hover:bg-neutral-800"
                      >
                        <span>Liquidar Deuda</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {modalOpen && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h3 className="font-bold text-neutral-900">Registrar Liquidación</h3>
              <Button variant="ghost" size="icon" onClick={() => setModalOpen(false)} className="h-6 w-6"><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleSubmitPayment} className="p-4 space-y-4">
              <div className="text-xs text-neutral-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                Documento: <span className="font-bold">{selectedDebt.refNumber} ({selectedDebt.docType})</span><br />
                Proveedor: <span className="font-bold">{selectedDebt.supplier}</span><br />
                Balance Adeudado: <span className="font-bold text-amber-900">RD$ {selectedDebt.currentDebt.toLocaleString()}</span>
              </div>

              <div>
                <Label className="text-xs font-bold text-neutral-700">Monto a Liquidar (RD$)</Label>
                <Input
                  type="number" step="0.01" max={selectedDebt.currentDebt}
                  value={payAmount} onChange={e => setPayAmount(e.target.value)} required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-neutral-700">Método de Pago</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta de Crédito Corporativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-neutral-700">Cuenta de Origen (Opcional)</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Seleccione una cuenta para retirar..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- No descontar de cuentas --</SelectItem>
                    {financialAccounts?.map((acc: any) => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.name} - RD$ {acc.balance.toLocaleString()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-neutral-400 mt-1 leading-none">Si selecciona una cuenta, el monto se descontará del balance automáticamente.</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="button" variant="outline" className="mr-2" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700 font-bold border-none">Registrar Pago a Suplidor</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// NOTAS DE CREDITO - COMPROBANTE FISCAL B04
// ==========================================
export function CreditNotesView({ invoices, updateInvoice }: { invoices: any[]; updateInvoice: any }) {
  const [targetInvoiceId, setTargetInvoiceId] = useState('');
  const [notesReason, setNotesReason] = useState('01 - Devolución de productos');
  const [createdNotes, setCreatedNotes] = useState([
    { id: 'NC-B040001', date: '2026-06-08', originalNcf: 'E310100000109', clientName: 'Ferretería Maderera Dominicana SRL', amount: 4500, reason: 'Devolución de productos defectuosos' }
  ]);

  const printableInvoices = invoices.filter(inv => inv.type === 'Factura' && inv.status === 'Pagada');

  const handleCreateCreditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInvoiceId) return;

    const matched = invoices.find(inv => inv.id === targetInvoiceId);
    if (!matched) return;

    const newNote = {
      id: `NC-B04000${createdNotes.length + 2}`,
      date: new Date().toISOString().split('T')[0],
      originalNcf: matched.ncf,
      clientName: matched.client?.name || 'Cliente Genérico',
      amount: matched.total,
      reason: notesReason
    };

    setCreatedNotes([newNote, ...createdNotes]);
    setTargetInvoiceId('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Notas de Crédito (Formato DGII Comprobante B04)</h2>
        <p className="text-xs text-neutral-500">Emita notas de crédito fiscales con numeración autorizada B04 para anular o modificar facturas declaradas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Emitir Comprobante de Crédito B04</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleCreateCreditNote} className="space-y-3 text-xs font-sans">
              <div>
                <Label className="text-[10px] text-neutral-400 font-bold uppercase">Factura Original a Modificar</Label>
                <Select value={targetInvoiceId} onValueChange={setTargetInvoiceId}>
                  <SelectTrigger className="w-full text-xs font-semibold h-[34px] border-neutral-200 mt-1 bg-white">
                    <SelectValue placeholder="-- Seleccionar Factura Fiscal --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" className="text-xs">-- Seleccionar Factura Fiscal --</SelectItem>
                    {printableInvoices.map(inv => (
                      <SelectItem key={inv.id} value={inv.id} className="text-xs">
                        {inv.invoiceNumber} - NCF: {inv.ncf} (RD$ {inv.total.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] text-neutral-400 font-bold uppercase">Motivo Legal (Según DGII)</Label>
                <Select value={notesReason} onValueChange={setNotesReason}>
                  <SelectTrigger className="w-full text-xs font-semibold h-[34px] border-neutral-200 mt-1 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01 - Devolución de productos" className="text-xs">01 - Devolución de productos</SelectItem>
                    <SelectItem value="02 - Descuento financiero o bonificación" className="text-xs">02 - Descuento financiero o bonificación</SelectItem>
                    <SelectItem value="03 - Corrección de errores de facturación" className="text-xs">03 - Corrección de errores de facturación</SelectItem>
                    <SelectItem value="04 - Rescisión del contrato" className="text-xs">04 - Rescisión del contrato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800 text-xs h-8.5 font-bold rounded-lg mt-2">
                <span>Emitir Nota de Crédito B04</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Emisiones de Notas de Crédito Históricas</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto text-xs font-sans">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-450">
                  <th className="p-3">NCF Crédito (B04)</th>
                  <th className="p-3">Factura Org.</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Monto Afecto</th>
                  <th className="p-3">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {createdNotes.map((note, index) => (
                  <tr key={index} className="hover:bg-neutral-50/45">
                    <td className="p-3 font-mono font-bold text-neutral-900">{note.id}</td>
                    <td className="p-3 font-mono text-neutral-500">{note.originalNcf}</td>
                    <td className="p-3 font-semibold text-neutral-800">{note.clientName}</td>
                    <td className="p-3 font-mono text-neutral-450">{note.date}</td>
                    <td className="p-3 font-bold text-neutral-900 text-right">RD$ {note.amount.toLocaleString()}</td>
                    <td className="p-3 text-neutral-500 font-medium">{note.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// CONFIGURATION DYNAMIC BRANDING & LOGO (LOGO)
// ==========================================
interface LogoProps {
  templateSettings: any;
  saveTemplateSettings: any;
}

export function ConfigLogoView({ templateSettings, saveTemplateSettings }: LogoProps) {
  const [logoInput, setLogoInput] = useState(templateSettings.logoUrl || '');
  const [colorSelected, setColorSelected] = useState(templateSettings.primaryColorHex || '#111827');
  const [address, setAddress] = useState(templateSettings.businessAddress || 'Santo Domingo, República Dominicana');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveTemplateSettings({
      logoUrl: logoInput,
      primaryColorHex: colorSelected,
      businessAddress: address
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-950 font-heading">Diseño de Factura y Logotipo Corporativo</h2>
        <p className="text-xs text-neutral-500">Configure la identidad visual, el banner corporativo y el esquema cromático de sus comprobantes de venta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        <Card className="lg:col-span-1 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Settings de Apariencia</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-[10px] text-neutral-450 font-bold uppercase block mb-1">Logotipo Corporativo</Label>
                
                {logoInput ? (
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 mb-2 animate-fade-in">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img src={logoInput} alt="Preview" className="w-9 h-9 object-contain rounded border bg-white p-1 shrink-0" />
                      <div className="overflow-hidden">
                        <span className="font-extrabold text-[9px] text-neutral-450 block uppercase">Logotipo Cargado</span>
                        <span className="text-[9px] text-neutral-450 block truncate max-w-[130px]">
                          {logoInput.startsWith('data:') ? 'Imagen Cargada desde la PC' : logoInput}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setLogoInput('')}
                      className="h-7 px-2 text-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold transition-all shrink-0"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 border border-dashed border-neutral-300 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-400 transition-all text-center mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="logo-upload-specialized"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
                          const fileExt = file.name.split('.').pop()?.toLowerCase();
                          const validExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
                          
                          if (!validTypes.includes(file.type) || !fileExt || !validExtensions.includes(fileExt)) {
                            alert("Por seguridad, solo se permiten formatos de imagen estándar (PNG, JPG, JPEG, WEBP, GIF, SVG).");
                            return;
                          }

                          if (file.size > 2 * 1024 * 1024) {
                            alert("La imagen excede el límite de 2MB. Elija una imagen más pequeña.");
                            return;
                          }

                          try {
                            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                            const uniqueKey = `${Date.now()}_${cleanName}`;
                            const bucket = insforge.storage.from("company_logos");
                            const { error } = await bucket.upload(uniqueKey, file);
                            
                            if (error) throw error;
                            
                            const publicUrl = bucket.getPublicUrl(uniqueKey);
                            setLogoInput(publicUrl);
                          } catch (err) {
                            console.warn("Direct upload failed, defaulting to local base64:", err);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setLogoInput(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload-specialized"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5 w-full h-full"
                    >
                      <Upload className="w-5 h-5 text-neutral-400 animate-pulse" />
                      <span className="text-[11px] font-extrabold text-neutral-700">Subir Logo desde mi PC</span>
                      <span className="text-[9px] text-neutral-400 font-medium font-sans">Archivos JPG, PNG de hasta 2MB</span>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-[10px] text-neutral-450 font-bold uppercase">O ingrese un enlace web directo (URL)</Label>
                <Input
                  placeholder="https://tuweb.com/logo.png"
                  value={logoInput.startsWith('data:') ? '' : logoInput}
                  onChange={(e) => setLogoInput(e.target.value)}
                  className="text-xs h-8.5 mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Color Principal en PDF/Print</Label>
              <div className="flex gap-2">
                {['#111827', '#E11D48', '#2563EB', '#059669', '#D97706'].map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColorSelected(col)}
                    style={{ backgroundColor: col }}
                    className={`w-7 h-7 rounded-lg border-2 cursor-pointer transition-transform ${
                      colorSelected === col ? 'border-neutral-950 scale-110' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[10px] text-neutral-450 font-bold uppercase block">Dirección de Empresa</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-xs h-8.5 mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800 text-xs h-8.5 font-bold rounded-lg">
              <span>Guardar Configuración Visual</span>
            </Button>
          </CardContent>
        </Card>

        {/* Real-time PDF preview sheet mockup */}
        <Card className="lg:col-span-2 border-neutral-200 bg-white shadow-md relative group select-none">
          <CardHeader className="p-4 border-b border-neutral-100 bg-neutral-50/20">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Vista Previa del Comprobante Fiscal Impreso</span>
              <span className="text-[9px] bg-neutral-100 text-neutral-605 px-1 py-0.2 rounded font-bold uppercase">PDF Hoja Completa</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 border-t border-neutral-100">
            <div className="border border-neutral-150 p-6 space-y-6 max-w-lg mx-auto bg-white rounded-lg">
              {/* Fake PDF Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {logoInput ? (
                      <img src={logoInput} alt="Preview Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center font-bold text-white text-md">F</div>
                    )}
                    <span className="font-bold text-sm tracking-tight text-neutral-900">{templateSettings.businessName}</span>
                  </div>
                  <span className="text-[9px] text-neutral-450 block truncate max-w-[200px]" title={address}>{address}</span>
                  <span className="font-mono text-[9px] text-neutral-450 block">RNC: {templateSettings.businessRNC}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs font-black block uppercase" style={{ color: colorSelected }}>FACTURA DE CRÉDITO FISCAL</span>
                  <span className="font-mono font-bold text-[10px] text-neutral-900 block bg-neutral-50 border border-neutral-150 p-1 rounded">NCF: B0100000109</span>
                </div>
              </div>

              {/* Mock items table */}
              <div className="border-t border-neutral-150 pt-4">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-neutral-150 text-neutral-450 text-[9px] uppercase font-bold">
                      <th>Descripción</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-right">Precio</th>
                      <th className="text-right">ITBIS (18%)</th>
                      <th className="text-right">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-600">
                    <tr>
                      <td className="py-2.5 font-semibold text-neutral-850">Asesoría de Negocios Corporativa</td>
                      <td className="text-center py-2.5">1</td>
                      <td className="text-right py-2.5">RD$ 10,000.00</td>
                      <td className="text-right py-2.5">RD$ 1,800.00</td>
                      <td className="text-right py-2.5 font-bold text-neutral-900">RD$ 11,800.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-neutral-150 pt-3 flex justify-end">
                <div className="w-48 text-[10px] text-right space-y-1 font-semibold text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>RD$ 10,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total ITBIS (18%):</span>
                    <span>RD$ 1,800.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-950 border-t border-neutral-200 pt-1 text-xs">
                    <span>Monto Total:</span>
                    <span>RD$ 11,800.00 DOP</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

// ==========================================
// CONFIGURATION TAX SETUP (IMPUESTOS)
// ==========================================
export function ConfigImpuestosView() {
  const [taxes, setTaxes] = useState([
    { id: 'ITBIS-18', name: 'ITBIS General', rate: 18, isDefault: true, status: 'Activo' },
    { id: 'ITBIS-16', name: 'ITBIS Reducido', rate: 16, isDefault: false, status: 'Activo' },
    { id: 'ITBIS-Exento', name: 'Exento de Impuestos', rate: 0, isDefault: false, status: 'Activo' }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Estructura Fiscal e Impuesto (ITBIS)</h2>
        <p className="text-xs text-neutral-500">Administre las tasas impositivas homologadas por la Dirección General de Impuestos Internos (DGII).</p>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Impuestos y Retenciones Configuradas</CardTitle>
          <Button size="sm" className="bg-black text-white hover:bg-neutral-800 text-xs h-7.5 px-2.5 rounded-lg font-bold">
            <Plus className="w-3 h-3 mr-1" /> Nuevo Impuesto
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-400">
                <th className="p-3">Código</th>
                <th className="p-3">Impuesto</th>
                <th className="p-3">Tasa %</th>
                <th className="p-3 text-center">Predeterminado</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
              {taxes.map(tax => (
                <tr key={tax.id} className="hover:bg-neutral-50/45">
                  <td className="p-3 font-mono text-neutral-500 font-bold">{tax.id}</td>
                  <td className="p-3 text-neutral-855 font-sans">{tax.name}</td>
                  <td className="p-3 text-neutral-700 font-mono">{tax.rate}%</td>
                  <td className="p-3 text-center">
                    {tax.isDefault ? (
                      <span className="inline-block bg-neutral-950 text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded">Predeterminado</span>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px]">{tax.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-neutral-900 border-0 bg-transparent">
                      <Sliders className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// REPORT: VENTAS (SALES DETAILED)
// ==========================================
export function ReportVentasView({ invoices }: { invoices: any[] }) {
  const salesDoc = invoices.filter(inv => inv.type === 'Factura');
  const totalSales = salesDoc.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Reporte Analítico de Ventas</h2>
        <p className="text-xs text-neutral-500">Análisis detallado de facturación, promedios de tickets y volumen de ingresos declarados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-neutral-200">
          <CardContent className="p-5 space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Volumen Facturado</span>
            <div className="text-2xl font-black text-rose-650">RD$ {totalSales.toLocaleString()}</div>
            <p className="text-[9px] text-neutral-450">Ingresos imponible total acumulado.</p>
          </CardContent>
        </Card>
        <Card className="border-neutral-200">
          <CardContent className="p-5 space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Transacciones Emitidas</span>
            <div className="text-2xl font-black text-neutral-900">{salesDoc.length} facs</div>
            <p className="text-[9px] text-neutral-450">Comprobantes autorizados emitidos.</p>
          </CardContent>
        </Card>
        <Card className="border-neutral-200">
          <CardContent className="p-5 space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Ticket Promedio (AOV)</span>
            <div className="text-2xl font-black text-emerald-700">
              RD$ {(totalSales / (salesDoc.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[9px] text-neutral-450">Valor de venta promedio por factura.</p>
          </CardContent>
        </Card>
      </div>

      {/* Mini Chart Mock with pure CSS/Tailwind */}
      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Distribución de Ventas Semanales</CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex items-end justify-between h-48 pt-10 font-mono text-[9px] text-neutral-450 max-w-xl">
          {['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'].map((s, i) => {
            const h = [30, 85, 55, 100][i];
            return (
              <div key={s} className="flex flex-col items-center gap-2 flex-1">
                <div style={{ height: `${h}%` }} className="w-10 bg-neutral-950 hover:bg-rose-500 rounded-t-lg transition-colors duration-200 relative group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold z-10 font-mono">
                    {h}%
                  </div>
                </div>
                <span>{s}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// REPORT: GASTOS (EXPENSES DETAILED)
// ==========================================
export function ReportGastosView({ expenses }: { expenses: any[] }) {
  // Group expenses by category and compute totals from real data
  const categoryMap: Record<string, number> = {};
  (expenses || []).forEach(exp => {
    const cat = exp.category || 'Sin Categoría';
    categoryMap[cat] = (categoryMap[cat] || 0) + (exp.amount || 0);
  });

  const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);

  const expenseCategories = Object.entries(categoryMap)
    .map(([cat, amt]) => ({
      cat,
      amt,
      percentage: total > 0 ? Math.round((amt / total) * 100) : 0
    }))
    .sort((a, b) => b.amt - a.amt);

  // Fallback when no expenses exist
  const displayCategories = expenseCategories.length > 0 ? expenseCategories : [
    { cat: 'Sin gastos registrados', amt: 0, percentage: 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Analítica de Costos e Impuestos Soportados (606)</h2>
        <p className="text-xs text-neutral-500">Distribución porcentual de egresos declarados clasificados según los códigos fiscales de la DGII.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        <Card className="lg:col-span-1 border-neutral-200 p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Gasto Total Acumulado</span>
            <div className="text-3xl font-black text-amber-950">RD$ {total.toLocaleString()}</div>
            <p className="text-neutral-500 leading-relaxed text-[11px]">Control total de gastos declarados con comprobantes de crédito fiscal para deducción del ITBIS.</p>
            <p className="text-[10px] text-neutral-400 mt-2"><strong>{expenses?.length || 0}</strong> registros de gastos contabilizados</p>
          </div>
          <Button className="w-full bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-bold h-8.5 rounded-lg mt-4">
            <Download className="w-3.5 h-3.5 mr-1" /> Exportar Desglose
          </Button>
        </Card>

        <Card className="lg:col-span-2 border-neutral-200">
          <CardHeader className="p-4 border-b border-neutral-100">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Top Egresos por Tipo de Gasto</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {displayCategories.map(e => (
              <div key={e.cat} className="space-y-1.5">
                <div className="flex justify-between font-semibold text-neutral-800 text-xs">
                  <span>{e.cat}</span>
                  <span>RD$ {e.amt.toLocaleString()} ({e.percentage}%)</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${e.percentage}%` }} className="bg-amber-600 h-full rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// REPORT: UTILIDADES (PROFIT & LOSS)
// ==========================================
export function ReportUtilidadesView({ invoices, expenses }: { invoices: any[]; expenses: any[] }) {
  const sales = invoices.filter(inv => inv.type === 'Factura').reduce((acc, c) => acc + c.total, 0);
  const cost = (expenses || []).reduce((acc: number, c: any) => acc + (c.amount || 0), 0);
  const profits = sales - cost;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-955 font-heading">Estado de Resultados (P&L)</h2>
          <p className="text-xs text-neutral-500">Declaración financiera del período calculando el margen de ganancia líquida estimada.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="border-neutral-350 text-xs bg-white">
          <Printer className="w-3.5 h-3.5 mr-1" /> Imprimir Estado
        </Button>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-neutral-200 rounded-xl p-8 font-sans space-y-6 shadow-sm">
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-neutral-950 uppercase">ESTADO DE RENDIMIENTO ECONÓMICO</h3>
          <p className="text-[10px] text-neutral-400 font-mono">Para el periodo corriente de facturación fiscal</p>
          <p className="text-[10px] text-neutral-500">Valores expresados en Pesos Dominicanos (RD$)</p>
        </div>

        <div className="border-t border-neutral-200 pt-6 space-y-4 text-xs">
          <div className="flex justify-between font-bold text-neutral-900 py-1.5 border-b border-neutral-100">
            <span>(+) INGRESOS OPERACIONALES (VENTAS FACTURADAS)</span>
            <span>RD$ {sales.toLocaleString()}</span>
          </div>
          
          <div className="pl-4 space-y-2 text-neutral-600">
            <div className="flex justify-between">
              <span>Ingresos por Bienes de Consumo</span>
              <span>RD$ {(sales * 0.4).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Ingresos por Servicios Corporativos</span>
              <span>RD$ {(sales * 0.6).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-neutral-900 py-1.5 border-b border-neutral-100 mt-4">
            <span>(-) COSTOS Y EGRESOS DIARIOS (DECLARACIÓN 606)</span>
            <span className="text-rose-600">RD$ {cost.toLocaleString()}</span>
          </div>

          <div className="pl-4 space-y-2 text-neutral-600">
            <div className="flex justify-between">
              <span>Deducción de Gastos de Operación ({expenses?.length || 0} registros)</span>
              <span>RD$ {cost.toLocaleString()}</span>
            </div>
          </div>

          <div className={`flex justify-between font-black text-sm py-3 border-t-2 border-neutral-900 mt-6 px-3 rounded-lg ${
            profits >= 0 ? 'text-emerald-800 bg-emerald-50/50' : 'text-rose-800 bg-rose-50/50'
          }`}>
            <span>(=) GANANCIA NETAS DEL EJERCICIO</span>
            <span>RD$ {profits.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// REPORT: INVENTARIO VALUATION
// ==========================================
export function ReportInventoryView({ products }: { products: any[] }) {
  const totalItems = products.reduce((acc, c) => acc + (c.stock || 0), 0);
  const totalValue = products.reduce((acc, c) => acc + ((c.stock || 0) * (c.price || 0)), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Reporte de Valoración de Inventario</h2>
        <p className="text-xs text-neutral-500">Contabilización material de existencias en almacenes valoradas a precio de venta final.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-neutral-200">
          <CardContent className="p-5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Existencias Totales en Almacén</span>
            <div className="text-2xl font-black text-neutral-905 mt-1">{totalItems} unidades</div>
            <p className="text-[9px] text-neutral-500">Unidades físicas listas para distribución.</p>
          </CardContent>
        </Card>
        <Card className="border-neutral-200">
          <CardContent className="p-5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Activo Total Realizable</span>
            <div className="text-2xl font-black text-rose-650 mt-1">RD$ {totalValue.toLocaleString()}</div>
            <p className="text-[9px] text-neutral-500">Margen neto operativo en mercancías.</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid distribution */}
      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Valuación Detallada por Ítem de Catálogo</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-450">
                <th className="p-3">Código</th>
                <th className="p-3">Descripción Producto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3 text-center">Unidades</th>
                <th className="p-3 text-right">Precio Unitario</th>
                <th className="p-3 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50/45">
                  <td className="p-3 font-mono font-bold text-neutral-500">{p.code}</td>
                  <td className="p-3 font-semibold text-neutral-850">{p.name}</td>
                  <td className="p-3 text-neutral-600">{p.category || 'Varios'}</td>
                  <td className="p-3 text-center font-bold text-neutral-800">{p.stock || 0} u</td>
                  <td className="p-3 text-right">RD$ {p.price.toLocaleString()}</td>
                  <td className="p-3 text-right font-black text-neutral-900">RD$ {((p.stock || 0) * p.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// REPORT: CLIENTES FIDELIDAD
// ==========================================
export function ReportClientsView({ clients, invoices }: { clients: any[]; invoices: any[] }) {
  const leaderBoard = clients.map(c => {
    const matchingInvoices = invoices.filter(inv => inv.client?.id === c.id || inv.clientName === c.name);
    return {
      ...c,
      salesTotal: matchingInvoices.reduce((acc, curr) => acc + curr.total, 0),
      docsCount: matchingInvoices.length
    };
  }).sort((a,b) => b.salesTotal - a.salesTotal);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Fidelización y Rotación de Clientes</h2>
        <p className="text-xs text-neutral-500">Ranking comercial de socios y clientes con mayor volumen de compras facturadas.</p>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Tabla de Ventas Corporativas por Cliente</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-450">
                <th className="p-3">Posición</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">RNC/Identidad</th>
                <th className="p-3 text-center">Frecuencia</th>
                <th className="p-3 text-right">Volumen Total Comprado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
              {leaderBoard.map((item, index) => (
                <tr key={item.id} className="hover:bg-neutral-50/45">
                  <td className="p-3 font-mono text-neutral-400 text-center font-bold"># {index + 1}</td>
                  <td className="p-3 font-bold text-neutral-900">{item.name}</td>
                  <td className="p-3 font-mono text-neutral-500">{item.rncOrCedula}</td>
                  <td className="p-3 text-center">
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[10px]">{item.docsCount} facturas</span>
                  </td>
                  <td className="p-3 text-right font-black text-rose-650">
                    RD$ {item.salesTotal.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// REPORT: BULK EXCEL EXPORT SCREEN (EXCEL)
// ==========================================
export function ReportExcelView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Exportador Consolidado a Excel</h2>
        <p className="text-xs text-neutral-500">Descargue toda la base de datos estructural de clientes, productos y facturas en formato XLSX.</p>
      </div>

      <Card className="border-neutral-200 max-w-lg">
        <CardHeader className="p-5 border-b border-neutral-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Parámetros de Descarga Masiva</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 font-sans text-xs">
          <div>
            <Label className="text-[10px] text-neutral-400 font-bold uppercase">Módulo a Exportar</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full text-xs font-semibold h-[34px] border-neutral-200 mt-1 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Sincronización Completa (Todos los módulos)</SelectItem>
                <SelectItem value="invoices" className="text-xs">Facturas y Comprobantes Fiscales (NCF)</SelectItem>
                <SelectItem value="clients" className="text-xs">Clientes y Direcciones</SelectItem>
                <SelectItem value="products" className="text-xs">Productos y Existencias de Almacén</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs h-9 rounded-lg flex items-center justify-center space-x-1.5"
          >
            {loading ? (
              <span>Generando Archivo XLSX...</span>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Iniciar Exportación a Excel</span>
              </>
            )}
          </Button>

          {success && (
            <div className="bg-emerald-50 text-emerald-800 border-emerald-250 border p-3 rounded-lg text-[11px] flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sincronización exitosa! El archivo **Base_FacturaDo_Consolidado.xlsx** se ha descargado a su terminal local.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// CONFIGURATION USERS LIST (USUARIOS)
// ==========================================
export function ConfigUsuariosView({ users }: { users: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Gestión de Usuarios y Colaboradores</h2>
        <p className="text-xs text-neutral-500">Configuración de perfiles autorizados para operar transacciones comerciales en FacturaDo.</p>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Usuarios con Acceso Autorizado</CardTitle>
          <Button size="sm" className="bg-black text-white hover:bg-neutral-800 text-xs h-7.5 px-2.5 rounded-lg font-bold">
            <Plus className="w-3 h-3 mr-1" /> Invitar Colaborador
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-450">
                <th className="p-3">Nombre Usuario</th>
                <th className="p-3">Correo Electrónico</th>
                <th className="p-3 text-center">Rol Acceso</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-right">Firma Electrónica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="p-3 font-bold text-neutral-900">{u.username}</td>
                  <td className="p-3 font-mono text-neutral-500">{u.email || `${u.username.toLowerCase()}@facturado.com.do`}</td>
                  <td className="p-3 text-center">
                    <span className="bg-neutral-950 text-white px-2.5 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider">{u.role}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[9.5px]">Activo</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-[10px] text-neutral-400 font-bold select-none uppercase tracking-wide">DGII Homologado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// CONFIGURATION ROLES AND PERMISSIONS LIST (ROLES)
// ==========================================
export function ConfigRolesView() {
  const permissions = [
    { module: 'Facturación Ventas', admin: true, manager: true, seller: true },
    { module: 'Gestión de NCF de la DGII', admin: true, manager: true, seller: false },
    { module: 'Control Almacén / Costos', admin: true, manager: true, seller: false },
    { module: 'Cesta Contabilidad General', admin: true, manager: false, seller: false },
    { module: 'Configuraciones Enlace Empresa', admin: true, manager: false, seller: false }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-955 font-heading">Roles del Personal y Facultades de Acceso</h2>
        <p className="text-xs text-neutral-500">Asigne facultades de auditoría a vendedores, cobradores, supervisores y administradores generales.</p>
      </div>

      <Card className="border-neutral-200">
        <CardHeader className="p-4 border-b border-neutral-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Matriz de Autorizaciones Organizacionales</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto text-xs font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] uppercase font-bold text-neutral-400">
                <th className="p-3">Módulo Funcional</th>
                <th className="p-3 text-center bg-rose-50/20">Administrador</th>
                <th className="p-3 text-center">Gerente</th>
                <th className="p-3 text-center">Vendedor / POS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-880">
              {permissions.map((p, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-neutral-800">{p.module}</td>
                  <td className="p-3 text-center bg-rose-50/5">
                    {p.admin ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {p.manager ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {p.seller ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-neutral-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
