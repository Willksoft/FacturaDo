import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { Invoice, Client, Product, Expense } from '../types';

interface AnalyticsDashboardProps {
  invoices: Invoice[];
  clients: Client[];
  products: Product[];
  expenses: Expense[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function AnalyticsDashboard({ invoices, clients, products, expenses }: AnalyticsDashboardProps) {
  // Solo facturas pagadas o registradas (excluye cotizaciones)
  const validInvoices = invoices.filter(inv => inv.type === 'Factura');

  // 1. Métricas Generales
  const totalRevenue = validInvoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  
  // 2. Ingresos vs Egresos por Mes (Últimos 6 meses)
  const monthlyData = useMemo(() => {
    const data: Record<string, { name: string, ingresos: number, egresos: number, monthIndex: number }> = {};
    
    // Rellenar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const monthName = d.toLocaleString('es-DO', { month: 'short', year: '2-digit' });
      data[key] = { name: monthName, ingresos: 0, egresos: 0, monthIndex: d.getTime() };
    }

    validInvoices.forEach(inv => {
      const d = new Date(inv.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (data[key]) {
        data[key].ingresos += inv.total;
      }
    });

    expenses.forEach(exp => {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (data[key]) {
        data[key].egresos += exp.amount;
      }
    });

    return Object.values(data).sort((a, b) => a.monthIndex - b.monthIndex);
  }, [validInvoices, expenses]);

  // 3. Top Clientes (Por Monto Facturado)
  const topClientsData = useMemo(() => {
    const clientTotals: Record<string, number> = {};
    validInvoices.forEach(inv => {
      if (!clientTotals[inv.client?.id]) {
        clientTotals[inv.client?.id] = 0;
      }
      clientTotals[inv.client?.id] += inv.total;
    });

    return Object.entries(clientTotals)
      .map(([clientId, total]) => {
        const client = clients.find(c => c.id === clientId);
        return { name: client?.name || 'Cliente Desconocido', value: total };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5
  }, [validInvoices, clients]);

  // 4. Top Productos Vendidos (Por Cantidad)
  const topProductsData = useMemo(() => {
    const productSales: Record<string, { qty: number, name: string }> = {};
    validInvoices.forEach(inv => {
      inv.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { qty: 0, name: item.name };
        }
        productSales[item.productId].qty += item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 7) // Top 7
      .map(p => ({ name: p.name.substring(0, 20) + (p.name.length > 20 ? '...' : ''), Cantidad: p.qty }));
  }, [validInvoices]);

  return (
    <div className="space-y-6 animate-fade-in" id="analytics-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 font-heading">Inteligencia de Negocios</h2>
          <p className="text-sm text-neutral-500 font-medium mt-1">Métricas clave, rendimiento y análisis de ventas.</p>
        </div>
      </div>

      {/* Tarjetas KPI Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Ingresos</p>
              <h3 className="text-2xl font-black text-neutral-900">{totalRevenue.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Gastos</p>
              <h3 className="text-2xl font-black text-neutral-900">{totalExpenses.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</h3>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Beneficio Neto</p>
              <h3 className={`text-2xl font-black ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {totalProfit.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${totalProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <DollarSign className={`w-6 h-6 ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Clientes</p>
              <h3 className="text-2xl font-black text-neutral-900">{clients.length} Registrados</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Ingresos vs Egresos */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-neutral-800">Flujo de Caja Mensual</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Últimos 6 meses (Ingresos vs Gastos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={(val) => `RD$${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    cursor={{ fill: '#f5f5f5' }}
                    formatter={(value: number) => value.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="egresos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico 2: Top Clientes */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-neutral-800">Top 5 Mejores Clientes</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Volumen de ventas acumuladas por cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {topClientsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topClientsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                    >
                      {topClientsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-neutral-400">Aún no hay suficientes datos de facturación.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico 3: Top Productos */}
        <Card className="border-neutral-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-neutral-800">Top Productos de Mayor Rotación</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Cantidad de unidades vendidas por producto o servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={topProductsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                  <Tooltip cursor={{ fill: '#f5f5f5' }} />
                  <Line type="monotone" dataKey="Cantidad" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
