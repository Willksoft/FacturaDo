import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Printer, 
  Sliders, 
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';
import { Employee, PayrollPeriod, PayrollDetail } from '../../../types/payroll';
import { PayrollPayslipTemplateModal } from './PayrollPayslipTemplateModal';

interface PayrollProcessorModalProps {
  employees: Employee[];
  payrollPeriods: PayrollPeriod[];
  payrollDetails: PayrollDetail[];
  onProcessPayroll: (periodName: string, frequency: 'Quincenal' | 'Mensual', startDate: string, endDate: string) => void;
}

export const PayrollProcessorModal: React.FC<PayrollProcessorModalProps> = ({
  employees,
  payrollPeriods,
  payrollDetails,
  onProcessPayroll,
}) => {
  const [periodName, setPeriodName] = useState('Nómina 2da Quincena Julio 2026');
  const [frequency, setFrequency] = useState<'Quincenal' | 'Mensual'>('Quincenal');
  const [startDate, setStartDate] = useState('2026-07-16');
  const [endDate, setEndDate] = useState('2026-07-31');
  const [selectedPeriodForPrint, setSelectedPeriodForPrint] = useState<PayrollPeriod | null>(null);

  const activeEmployees = employees.filter((e) => e.status === 'Activo');

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProcessPayroll(periodName, frequency, startDate, endDate);
    alert(`¡Nómina "${periodName}" procesada exitosamente con ${activeEmployees.length} empleados! Se han generado los comprobantes e integrados los asientos contables.`);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Procesador de Períodos de Nómina & Cierre Quincenal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calcula automáticamente los salarios brutos, TSS (AFP/ARS), ISR DGII y genera el asiento contable de partida doble.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-900 text-xs block">{activeEmployees.length} Empleados Activos</span>
            <span className="text-[10px] text-emerald-700">Listos para procesar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario para Procesar Nueva Nómina */}
        <form onSubmit={handleProcessSubmit} className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm">
          <h3 className="font-heading font-medium text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Procesar Nuevo Período
          </h3>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Nombre del Período *</label>
            <input
              type="text"
              required
              value={periodName}
              onChange={(e) => setPeriodName(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Frecuencia de Pago *</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl"
            >
              <option value="Quincenal">Quincenal (15 / 30 del mes)</option>
              <option value="Mensual">Mensual (Cierre de mes)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Fecha Inicio *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Fecha Fin *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Calcular & Cerrar Nómina
            </button>
          </div>
        </form>

        {/* Tabla de Períodos Procesados */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-heading font-medium text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Períodos de Nómina Procesados ({payrollPeriods.length})</span>
            <span className="text-xs text-slate-500 font-mono">Partida doble integrada</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="p-3">Período / Cierre</th>
                  <th className="p-3 text-right">Salario Bruto</th>
                  <th className="p-3 text-right">Salario Neto</th>
                  <th className="p-3 text-right">Costo Empresa</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {payrollPeriods.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No hay períodos procesados previamente.
                    </td>
                  </tr>
                ) : (
                  payrollPeriods.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 font-sans">
                        {p.periodName}
                        <span className="text-[10px] text-slate-400 block font-mono">{p.startDate} a {p.endDate}</span>
                      </td>
                      <td className="p-3 text-right">RD$ {p.totalGrossSalary.toLocaleString('es-DO')}</td>
                      <td className="p-3 text-right font-bold text-emerald-700">RD$ {p.totalNetSalary.toLocaleString('es-DO')}</td>
                      <td className="p-3 text-right text-indigo-700">RD$ {p.totalEmployerCost.toLocaleString('es-DO')}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedPeriodForPrint(p)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[11px] font-semibold flex items-center gap-1.5 mx-auto cursor-pointer shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" /> Volantes / Cheques
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Impresor de Volantes y Cheques en Lote */}
      {selectedPeriodForPrint && (
        <PayrollPayslipTemplateModal
          period={selectedPeriodForPrint}
          details={payrollDetails}
          employees={employees}
          onClose={() => setSelectedPeriodForPrint(null)}
        />
      )}
    </div>
  );
};
