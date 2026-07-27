import React, { useState } from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Building, 
  Users, 
  Download, 
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Employee, PayrollPeriod, PayrollDetail } from '../../../types/payroll';
import { calculateTssDeductions, calculateIsrDgii } from '../utils/dominicanTaxCalculators';

interface PayrollProcessorModalProps {
  employees: Employee[];
  payrollPeriods: PayrollPeriod[];
  payrollDetails: PayrollDetail[];
  onProcessPayroll: (
    periodName: string,
    frequency: 'Semanal' | 'Quincenal' | 'Mensual',
    startDate: string,
    endDate: string,
    additionalEarningsMap: Record<string, { overtimePay?: number; commissionsPay?: number; bonusesPay?: number }>,
    additionalDeductionsMap: Record<string, { loansDeduction?: number; advancesDeduction?: number; otherDeductions?: number }>
  ) => { newPeriod: PayrollPeriod; newDetails: PayrollDetail[] };
}

export const PayrollProcessorModal: React.FC<PayrollProcessorModalProps> = ({
  employees,
  payrollPeriods,
  payrollDetails,
  onProcessPayroll,
}) => {
  const activeEmployees = employees.filter((e) => e.status === 'Activo');

  const [periodName, setPeriodName] = useState('1ra Quincena ' + new Date().toLocaleString('es-DO', { month: 'long', year: 'numeric' }));
  const [frequency, setFrequency] = useState<'Quincenal' | 'Semanal' | 'Mensual'>('Quincenal');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 8) + '01');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 8) + '15');

  // Ajustes por empleado para esta nómina
  const [earningsMap, setEarningsMap] = useState<Record<string, { overtimePay?: number; commissionsPay?: number; bonusesPay?: number }>>({});
  const [deductionsMap, setDeductionsMap] = useState<Record<string, { loansDeduction?: number; advancesDeduction?: number; otherDeductions?: number }>>({});

  // Recibo imprimible modal
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollDetail | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleUpdateEarning = (empId: string, field: 'overtimePay' | 'commissionsPay' | 'bonusesPay', val: number) => {
    setEarningsMap((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: val
      }
    }));
  };

  const handleUpdateDeduction = (empId: string, field: 'loansDeduction' | 'advancesDeduction' | 'otherDeductions', val: number) => {
    setDeductionsMap((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: val
      }
    }));
  };

  const handleExecuteProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeEmployees.length === 0) {
      alert('No hay empleados activos registrados para procesar la nómina.');
      return;
    }

    const { newPeriod } = onProcessPayroll(
      periodName,
      frequency,
      startDate,
      endDate,
      earningsMap,
      deductionsMap
    );

    setSuccessNotice(`¡Nómina "${newPeriod.periodName}" procesada y contabilizada automáticamente en el Libro Diario de FacturaDo!`);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Procesador de Nómina Empresarial & Cierre Contable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simula y procesa la nómina con retenciones exactas de TSS (AFP/ARS) e ISR DGII R.D.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Asiento Contable Automático Activo
          </span>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{successNotice}</span>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-700 underline cursor-pointer">
            Entendido
          </button>
        </div>
      )}

      {/* Formulario de Configuración del Período */}
      <form onSubmit={handleExecuteProcess} className="space-y-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Configurar Período a Procesar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="sm:col-span-2">
              <label className="font-medium text-slate-700 block mb-1">Nombre del Período *</label>
              <input
                type="text"
                required
                value={periodName}
                onChange={(e) => setPeriodName(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Frecuencia de Pago</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Quincenal">Quincenal (15 días)</option>
                <option value="Semanal">Semanal (7 días)</option>
                <option value="Mensual">Mensual (30 días)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 px-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla Previa de Empleados Activos y Cálculos */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-medium text-slate-900">
              Desglose de Salarios y Deducciones R.D. ({activeEmployees.length} Empleados)
            </h2>
            <span className="text-xs text-slate-500 font-medium">Leyes TSS + ISR DGII</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Empleado</th>
                  <th className="p-3 text-right">Salario Período</th>
                  <th className="p-3 text-center">Ingresos Extras (Comisión/Bonos)</th>
                  <th className="p-3 text-center">TSS (2.87% AFP + 3.04% ARS)</th>
                  <th className="p-3 text-center">ISR DGII Retenido</th>
                  <th className="p-3 text-center">Deducciones Adicionales</th>
                  <th className="p-3 text-right">Salario Neto a Pagar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {activeEmployees.map((emp) => {
                  const divisor = frequency === 'Quincenal' ? 2 : frequency === 'Semanal' ? 4 : 1;
                  const baseSalaryPeriod = Math.round((emp.baseSalary / divisor) * 100) / 100;

                  const ext = earningsMap[emp.id] || {};
                  const overtimePay = ext.overtimePay || 0;
                  const commissionsPay = ext.commissionsPay || 0;
                  const bonusesPay = ext.bonusesPay || 0;

                  const gross = baseSalaryPeriod + overtimePay + commissionsPay + bonusesPay;
                  const tss = calculateTssDeductions(gross);
                  const isr = calculateIsrDgii(gross - tss.totalEmployeeTss);

                  const ded = deductionsMap[emp.id] || {};
                  const loans = ded.loansDeduction || 0;
                  const advances = ded.advancesDeduction || 0;
                  const otherDeds = ded.otherDeductions || 0;

                  const totalDeds = tss.totalEmployeeTss + isr + loans + advances + otherDeds;
                  const netPay = Math.max(0, gross - totalDeds);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-medium text-slate-900">
                        <span className="block font-semibold">{emp.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{emp.nationalId}</span>
                      </td>

                      <td className="p-3 text-right font-mono font-medium text-slate-700">
                        RD$ {baseSalaryPeriod.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            placeholder="Comisión"
                            value={commissionsPay || ''}
                            onChange={(e) => handleUpdateEarning(emp.id, 'commissionsPay', Number(e.target.value))}
                            className="w-20 h-8 px-2 border border-slate-200 rounded-lg text-xs font-mono text-right"
                          />
                          <input
                            type="number"
                            placeholder="Bonos"
                            value={bonusesPay || ''}
                            onChange={(e) => handleUpdateEarning(emp.id, 'bonusesPay', Number(e.target.value))}
                            className="w-20 h-8 px-2 border border-slate-200 rounded-lg text-xs font-mono text-right"
                          />
                        </div>
                      </td>

                      <td className="p-3 text-center font-mono text-rose-600 font-semibold">
                        - RD$ {tss.totalEmployeeTss.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-3 text-center font-mono text-rose-600 font-semibold">
                        - RD$ {isr.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            placeholder="Préstamo"
                            value={loans || ''}
                            onChange={(e) => handleUpdateDeduction(emp.id, 'loansDeduction', Number(e.target.value))}
                            className="w-20 h-8 px-2 border border-slate-200 rounded-lg text-xs font-mono text-right text-rose-600"
                          />
                        </div>
                      </td>

                      <td className="p-3 text-right font-mono font-bold text-emerald-700 text-sm">
                        RD$ {netPay.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              Procesar y Asentar Nómina Contable
            </button>
          </div>
        </div>
      </form>

      {/* Historial de Nóminas Procesadas */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
        <h2 className="text-base font-heading font-medium text-slate-900">
          Historial de Nóminas Procesadas ({payrollPeriods.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="p-3">Período</th>
                <th className="p-3">Frecuencia</th>
                <th className="p-3 text-right">Total Bruto</th>
                <th className="p-3 text-right">TSS Empleado</th>
                <th className="p-3 text-right">ISR DGII</th>
                <th className="p-3 text-right">Total Neto Pagado</th>
                <th className="p-3 text-center">Comprobantes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {payrollPeriods.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No se han procesado períodos de nómina aún.
                  </td>
                </tr>
              ) : (
                payrollPeriods.map((period) => (
                  <tr key={period.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900">{period.periodName}</td>
                    <td className="p-3 text-slate-600">{period.frequency}</td>
                    <td className="p-3 text-right font-mono text-slate-700">
                      RD$ {period.totalGrossSalary.toLocaleString('es-DO')}
                    </td>
                    <td className="p-3 text-right font-mono text-rose-600 font-semibold">
                      RD$ {(period.totalAfpEmployee + period.totalArsEmployee).toLocaleString('es-DO')}
                    </td>
                    <td className="p-3 text-right font-mono text-rose-600 font-semibold">
                      RD$ {period.totalIsr.toLocaleString('es-DO')}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                      RD$ {period.totalNetSalary.toLocaleString('es-DO')}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const dt = payrollDetails.find((d) => d.periodId === period.id);
                          if (dt) setSelectedPayslip(dt);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-medium cursor-pointer inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Volante Pago
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Imprimir Volante de Pago */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs sm:text-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 text-left border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">Volante de Pago de Nómina</h3>
                <p className="text-[11px] text-slate-500">FacturaDo S.R.L. • RNC: 1-31-00000-1</p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Empleado:</span>
                <span className="font-bold text-slate-900">{selectedPayslip.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cédula R.D.:</span>
                <span className="font-mono text-slate-700">{selectedPayslip.nationalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cargo:</span>
                <span>{selectedPayslip.jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Banco & Cuenta:</span>
                <span className="font-mono text-slate-700">{selectedPayslip.paymentBank} ({selectedPayslip.accountNumber})</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-b border-slate-150 py-3 font-mono">
              <div className="flex justify-between">
                <span>Salario Bruto Período:</span>
                <span className="font-bold">RD$ {selectedPayslip.grossSalary.toLocaleString('es-DO')}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Retención AFP (2.87%):</span>
                <span>- RD$ {selectedPayslip.afpEmployee.toLocaleString('es-DO')}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Retención ARS (3.04%):</span>
                <span>- RD$ {selectedPayslip.arsEmployee.toLocaleString('es-DO')}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Retención ISR DGII:</span>
                <span>- RD$ {selectedPayslip.isrEmployee.toLocaleString('es-DO')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold text-base pt-2 border-t border-slate-200">
                <span>SUELDO NETO RECIBIDO:</span>
                <span>RD$ {selectedPayslip.netSalary.toLocaleString('es-DO')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir Comprobante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
