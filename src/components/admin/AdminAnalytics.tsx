import React from 'react';
import { Activity, Users, Database, Globe, ArrowUpRight, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface AdminAnalyticsProps {
  invoices: any[];
  clients: any[];
  products: any[];
}

export default function AdminAnalytics({ invoices, clients, products }: AdminAnalyticsProps) {
  // Mock data for server analytics
  const serverMetrics = [
    { name: '00:00', load: 30, visitors: 120 },
    { name: '04:00', load: 20, visitors: 80 },
    { name: '08:00', load: 50, visitors: 300 },
    { name: '12:00', load: 80, visitors: 850 },
    { name: '16:00', load: 75, visitors: 700 },
    { name: '20:00', load: 45, visitors: 400 },
    { name: '24:00', load: 35, visitors: 200 },
  ];

  const totalSales = invoices.reduce((acc, curr) => acc + (curr.total || 0), 0);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Analítico</h1>
          <p className="text-neutral-400 text-sm mt-1">Monitoreo global de operaciones y estado del servidor</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-semibold">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          SISTEMA EN LÍNEA
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Globe className="w-5 h-5" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight">1,248</h3>
          <p className="text-neutral-400 text-xs mt-1 font-medium">Visitas de Hoy</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight">{clients.length}</h3>
          <p className="text-neutral-400 text-xs mt-1 font-medium">Clientes Registrados</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight">{invoices.length}</h3>
          <p className="text-neutral-400 text-xs mt-1 font-medium">Comprobantes Emitidos</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            RD$ {totalSales >= 1000000 ? (totalSales / 1000000).toFixed(1) + 'M' : totalSales.toLocaleString()}
          </h3>
          <p className="text-neutral-400 text-xs mt-1 font-medium">Volumen Transaccional</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-neutral-400" />
          <h3 className="font-semibold text-white">Rendimiento y Carga del Servidor (24h)</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={serverMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                itemStyle={{ color: '#e4e4e7' }}
              />
              <Area 
                type="monotone" 
                dataKey="load" 
                stroke="#818cf8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorLoad)" 
                activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
