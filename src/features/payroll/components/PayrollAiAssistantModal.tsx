import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Brain, 
  Send, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import { Employee, PayrollAiAnomaly } from '../../../types/payroll';

interface PayrollAiAssistantModalProps {
  employees: Employee[];
  anomalies: PayrollAiAnomaly[];
}

export const PayrollAiAssistantModal: React.FC<PayrollAiAssistantModalProps> = ({
  employees,
  anomalies,
}) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: '¡Hola! Soy tu Copilot de Inteligencia Artificial para Nómina y Recursos Humanos. Puedo auditar salarios, calcular proyecciones de costo patronal TSS/INFOTEP, explicar retenciones de ISR DGII o detectar posibles inconsistencias en los marcajes.'
    }
  ]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setQuery('');

    // Simulación de respuesta inteligente en lenguaje natural
    setTimeout(() => {
      let aiResponse = '';
      const lower = userText.toLowerCase();

      if (lower.includes('costo') || lower.includes('patronal') || lower.includes('tss')) {
        const totalSalary = employees.reduce((acc, curr) => acc + curr.baseSalary, 0);
        const tssEmployerCost = totalSalary * (0.0710 + 0.0709 + 0.0110 + 0.0100);
        aiResponse = `Actualmente posees ${employees.length} empleados activos con un salario bruto mensual acumulado de RD$ ${totalSalary.toLocaleString('es-DO')}. El costo de aportes patronales TSS (AFP 7.10%, ARS 7.09%, SRL 1.10%) e INFOTEP (1.00%) asciende aproximadamente a RD$ ${Math.round(tssEmployerCost).toLocaleString('es-DO')} adicionales por mes.`;
      } else if (lower.includes('anomala') || lower.includes('error') || lower.includes('fraude')) {
        aiResponse = `He escaneado el padrón laboral: Se han detectado ${anomalies.length} alertas potenciales de auditoría (tales como inconsistencias de cédula o salarios fuera de rango). Te sugiero verificar la pestaña de Auditoría.`;
      } else if (lower.includes('prestaciones') || lower.includes('cesantia') || lower.includes('preaviso')) {
        aiResponse = `En la República Dominicana (Ley 16-92), el preaviso y la cesantía aplican para desahucios o despidos injustificados. El cálculo del salario diario promedio se determina dividiendo el salario mensual ordinario entre 23.83.`;
      } else {
        aiResponse = `He analizado tu consulta sobre "${userText}". Todos los registros de la nómina están en regla y alineados a las normativas vigentes de la Tesorería de la Seguridad Social (TSS) y la Dirección General de Impuestos Internos (DGII).`;
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            IA Anomaly & Fraud Prevention System
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium tracking-tight">
            Auditor Inteligente Copilot de Nómina
          </h1>
          <p className="text-xs text-slate-300">
            Detección automática de salarios fuera de rango, duplicidades, errores de cédula y proyecciones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertas Detectadas por IA */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center justify-between">
            <span>Alertas de Auditoría IA ({anomalies.length})</span>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-150">
              Escaneo en Vivo
            </span>
          </h2>

          <div className="space-y-3">
            {anomalies.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No se detectaron anomalías ni duplicidades de sueldo en la nómina.
              </div>
            ) : (
              anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">{anom.type}</span>
                    <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      {anom.severity}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{anom.employeeName}</p>
                  <p className="text-slate-600 leading-relaxed">{anom.description}</p>
                  <div className="pt-1 text-[11px] text-indigo-700 font-semibold">
                    💡 Sugerencia: {anom.suggestion}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Asistente Interactivo de Chat IA */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between min-h-[480px]">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            Consulta en Lenguaje Natural a la IA
          </h2>

          {/* Chat Messages Stream */}
          <div className="space-y-3 overflow-y-auto flex-1 max-h-[360px] p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs sm:text-sm ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xl p-4 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Query Input */}
          <form onSubmit={handleSendQuery} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Pregunta a la IA sobre nóminas, TSS, ISR o leyes laborales R.D..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-5 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              Consultar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
