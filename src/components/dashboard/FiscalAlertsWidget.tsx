import React from 'react';
import { Calendar, AlertTriangle, CheckCircle2, Clock, ArrowRight, FileText, Landmark, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface FiscalAlertsWidgetProps {
  onNavigateTab?: (tab: string) => void;
}

export default function FiscalAlertsWidget({ onNavigateTab }: FiscalAlertsWidgetProps) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthName = today.toLocaleString('es-DO', { month: 'long' });
  const year = today.getFullYear();

  // Fiscal deadlines calculation for Dominican Republic
  // 1. IR-17 / Retenciones (Day 10)
  // 2. Formatos 606 / 607 (Day 15)
  // 3. IT-1 / ITBIS (Day 20)

  const getDeadlineStatus = (dayOfMonth: number) => {
    const diff = dayOfMonth - currentDay;
    if (diff < 0) {
      return {
        status: 'OVERDUE',
        label: `Vencido (día ${dayOfMonth})`,
        color: 'text-red-400 bg-red-950/40 border-red-800/50',
        badge: 'bg-red-500/20 text-red-400 border-red-500/30'
      };
    } else if (diff === 0) {
      return {
        status: 'TODAY',
        label: 'Vence Hoy',
        color: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30 font-bold animate-pulse'
      };
    } else if (diff <= 5) {
      return {
        status: 'SOON',
        label: `Vence en ${diff} día${diff > 1 ? 's' : ''}`,
        color: 'text-amber-300 bg-amber-950/30 border-amber-800/30',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
      };
    } else {
      return {
        status: 'OK',
        label: `${diff} días restantes`,
        color: 'text-emerald-400 bg-emerald-950/20 border-emerald-800/30',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      };
    }
  };

  const ir17Status = getDeadlineStatus(10);
  const f606Status = getDeadlineStatus(15);
  const it1Status = getDeadlineStatus(20);

  const obligations = [
    {
      id: 'it1',
      title: 'Declaración y Pago de IT-1 (ITBIS)',
      description: 'Presentación mensual de Ventas, Compras e ITBIS cobrado vs pagado.',
      deadlineDay: 20,
      infoInfo: `20 de ${currentMonthName}`,
      statusInfo: it1Status,
      icon: Landmark,
      targetTab: 'reportes'
    },
    {
      id: 'f606_607',
      title: 'Envío de Formatos 606 y 607 (DGII)',
      description: 'Envío obligatorio de compras, gastos y ventas del periodo a la Oficina Virtual.',
      deadlineDay: 15,
      infoInfo: `15 de ${currentMonthName}`,
      statusInfo: f606Status,
      icon: FileText,
      targetTab: 'reportes'
    },
    {
      id: 'ir17',
      title: 'Declaración IR-17 / Retenciones',
      description: 'Declaración jurada de retenciones de ISR y retenciones a terceros.',
      deadlineDay: 10,
      infoInfo: `10 de ${currentMonthName}`,
      statusInfo: ir17Status,
      icon: ShieldAlert,
      targetTab: 'reportes'
    }
  ];

  return (
    <Card className="bg-neutral-900/90 border-neutral-800 backdrop-blur-md shadow-xl overflow-hidden">
      <CardHeader className="border-b border-neutral-800/80 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                Calendario & Recordatorios Fiscales DGII
                <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
                  {currentMonthName} {year}
                </span>
              </CardTitle>
              <p className="text-xs text-neutral-400">
                Fechas límites de presentación e impuestos vigentes de la República Dominicana
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {obligations.map(item => {
          const Icon = item.icon;
          const { statusInfo } = item;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all hover:border-neutral-700 flex flex-col justify-between ${statusInfo.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Día {item.deadlineDay}
                    </span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusInfo.badge}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-mono">
                  Fecha: {item.infoInfo}
                </span>

                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab(item.targetTab)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    Ir a Reporte
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
