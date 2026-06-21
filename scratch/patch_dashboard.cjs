const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/dashboard/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Calculate Aging Report Data
const agingTarget = `  const OverdueInvoicesList = listFacturas.filter(inv => inv.status === 'Pendiente' && inv.dueDate < todayDateString);`;
const agingReplacement = `  const OverdueInvoicesList = listFacturas.filter(inv => inv.status === 'Pendiente' && inv.dueDate < todayDateString);

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
      
      bars.push({ label: \`Semana \${i+1}\`, amount: inFlow });
    }
    return bars;
  };
  const cashFlowData = getPredictiveCashFlow();
  const maxCashFlow = Math.max(...cashFlowData.map(c => c.amount), 1000);
`;

if(content.includes(agingTarget)) content = content.replace(agingTarget, agingReplacement);

// 2. Inject BI UI
const uiTarget = `      {/* ULTIMAS FACTURAS & ALERTAS (AS DEMANDED) */}`;
const uiReplacement = `      {/* BI PANEL: Inteligencia de Negocio */}
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
                <div className="text-[9px] text-red-800 font-bold uppercase mb-1">> 90 Días</div>
                <div className="text-[10px] font-mono font-bold text-red-950">{(agingData.days90Plus / 1000).toFixed(1)}k</div>
              </div>
            </div>
            {/* Progress Bar representation */}
            <div className="w-full h-3 bg-neutral-100 rounded-full flex overflow-hidden mt-2 border border-neutral-200">
              <div style={{width: \`\${(agingData.current / cuentasPorCobrarSum) * 100 || 0}%\`}} className="bg-emerald-500 h-full"></div>
              <div style={{width: \`\${(agingData.days30 / cuentasPorCobrarSum) * 100 || 0}%\`}} className="bg-yellow-400 h-full"></div>
              <div style={{width: \`\${(agingData.days60 / cuentasPorCobrarSum) * 100 || 0}%\`}} className="bg-amber-500 h-full"></div>
              <div style={{width: \`\${(agingData.days90 / cuentasPorCobrarSum) * 100 || 0}%\`}} className="bg-orange-500 h-full"></div>
              <div style={{width: \`\${(agingData.days90Plus / cuentasPorCobrarSum) * 100 || 0}%\`}} className="bg-red-600 h-full"></div>
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
                    <div className="w-full bg-emerald-100 rounded-t-md relative overflow-hidden transition-all group-hover:bg-emerald-200" style={{ height: \`\${h}px\` }}>
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

      {/* ULTIMAS FACTURAS & ALERTAS (AS DEMANDED) */}`;

if(content.includes(uiTarget)) content = content.replace(uiTarget, uiReplacement);

fs.writeFileSync(file, content);
console.log('Dashboard.tsx patched successfully with BI Widgets!');
