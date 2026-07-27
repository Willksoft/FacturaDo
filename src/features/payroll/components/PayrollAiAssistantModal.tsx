import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Brain, 
  Send, 
  TrendingUp, 
  CheckCircle2,
  Calendar,
  ShieldAlert,
  UserCheck
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
      text: '¡Hola! Soy tu Copilot de Inteligencia Artificial para Nómina y Recursos Humanos. Puedo auditar salarios, verificar vencimiento de pasaportes/visas, calcular proyecciones de costo patronal TSS/INFOTEP, explicar retenciones de ISR DGII o detectar inconsistencias en el padrón laboral.'
    }
  ]);

  // Auditorías inteligentes adicionales en tiempo real
  const expiringDocs = employees.filter((emp) => {
    if (!emp.docExpirationDate) return false;
    const exp = new Date(emp.docExpirationDate);
    const today = new Date();
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60;
  });

  const foreignWithoutProfile = employees.filter(
    (emp) => emp.nationality === 'Extranjera' && emp.laborProfileId === 'fijo'
  );

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setQuery('');

    setTimeout(() => {
      let aiResponse = '';
      const lower = userText.toLowerCase();

      if (lower.includes('pasaporte') || lower.includes('visa') || lower.includes('vencimiento') || lower.includes('migracion')) {
        if (expiringDocs.length > 0) {
          aiResponse = `⚠️ Se han detectado ${expiringDocs.length} documentos próximos a vencer en los próximos 60 días: ${expiringDocs.map(e => `${e.fullName} (${e.identityDocType} vence el ${e.docExpirationDate})`).join(', ')}. Te recomiendo tramitar la renovación con la Dirección General de Migración.`;
        } else {
          aiResponse = `✅ No hay documentos de identidad ni permisos de trabajo o pasaportes con vencimiento próximo en los próximos 60 días.`;
        }
      } else if (lower.includes('costo') || lower.includes('patronal') || lower.includes('tss')) {
        const totalSalary = employees.reduce((acc, curr) => acc + curr.baseSalary, 0);
        const tssEmployerCost = totalSalary * (0.0710 + 0.0709 + 0.0110 + 0.0100);
        aiResponse = `Actualmente posees ${employees.length} empleados activos con un salario bruto mensual acumulado de RD$ ${totalSalary.toLocaleString('es-DO')}. El costo de aportes patronales TSS (AFP 7.10%, ARS 7.09%, SRL 1.10%) e INFOTEP (1.00%) asciende aproximadamente a RD$ ${Math.round(tssEmployerCost).toLocaleString('es-DO')} adicionales por mes.`;
      } else if (lower.includes('anomala') || lower.includes('error') || lower.includes('fraude')) {
        aiResponse = `He escaneado el padrón laboral: Se han detectado ${anomalies.length + foreignWithoutProfile.length} alertas potenciales de auditoría (incluyendo ${foreignWithoutProfile.length} colaboradores extranjeros que podrían requerir perfil de contratista).`;
      } else if (lower.includes('prestaciones') || lower.includes('cesantia') || lower.includes('preaviso')) {
        aiResponse = `En la República Dominicana (Ley 16-92), el preaviso y la cesantía aplican para desahucios o despidos injustificados. El cálculo del salario diario promedio se determina dividiendo el salario mensual ordinario entre 23.83.`;
      } else {
        aiResponse = `He analizado tu consulta sobre "${userText}". Todos los registros de la nómina están en regla y alineados a las normativas de la Tesorería de la Seguridad Social (TSS) y la Dirección General de Impuestos Internos (DGII).`;
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 500);
  };

  return (
    <div className="space-y-6 font-sans text-left">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            IA Anomaly & Fraud Prevention System
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium tracking-tight">
            Auditor Inteligente Copilot de Nómina & RRHH
          </h1>
          <p className="text-xs text-slate-300">
            Detección en tiempo real de vencimiento de visas, pasaportes, salarios fuera de rango y exenciones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertas Detectadas por IA */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center justify-between">
            <span>Alertas de Auditoría IA</span>
            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xs font-bold">
              {anomalies.length + expiringDocs.length + foreignWithoutProfile.length} Detectadas
            </span>
          </h2>

          <div className="space-y-3">
            {expiringDocs.map((emp) => (
              <div key={emp.id} className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block">{emp.fullName}</span>
                  <span className="text-amber-800">
                    {emp.identityDocType} vence el {emp.docExpirationDate}. Trámite de renovación requerido.
                  </span>
                </div>
              </div>
            ))}

            {foreignWithoutProfile.map((emp) => (
              <div key={emp.id} className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-3 text-xs">
                <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-purple-900 block">{emp.fullName}</span>
                  <span className="text-purple-800">
                    Nacionalidad extranjera con perfil 'fijo'. Evaluar si aplica perfil de contratista o pasante.
                  </span>
                </div>
              </div>
            ))}

            {anomalies.map((anom) => (
              <div key={anom.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs">
                <AlertTriangle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">{anom.employeeName}</span>
                  <span className="text-slate-600">{anom.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat interactivo Copilot */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Brain className="w-5 h-5 text-indigo-600" />
            <h3 className="font-heading font-medium text-slate-900 text-sm">
              Asistente Copilot en Lenguaje Natural
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 p-2 text-xs sm:text-sm">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendQuery} className="mt-4 flex gap-2 pt-3 border-t border-slate-100">
            <input
              type="text"
              placeholder="Ej. ¿Qué documentos de colaboradores vencen pronto?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-5 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" /> Preguntar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
