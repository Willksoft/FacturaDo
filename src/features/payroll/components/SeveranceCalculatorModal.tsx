import React, { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  Award, 
  Printer, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Employee, SeveranceCalculation } from '../../../types/payroll';
import { calculateSeveranceDominicanLaw } from '../utils/dominicanTaxCalculators';

interface SeveranceCalculatorModalProps {
  employees: Employee[];
}

export const SeveranceCalculatorModal: React.FC<SeveranceCalculatorModalProps> = ({
  employees,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  const [exitDate, setExitDate] = useState(new Date().toISOString().slice(0, 10));
  const [exitReason, setExitReason] = useState<'Despido Injustificado (Cesantía)' | 'Renuncia Voluntaria' | 'Desahucio' | 'Mutuo Acuerdo'>('Despido Injustificado (Cesantía)');

  const selectedEmp = employees.find((e) => e.id === selectedEmployeeId);

  const calculationResult: SeveranceCalculation | null = selectedEmp
    ? calculateSeveranceDominicanLaw(
        selectedEmp.id,
        selectedEmp.fullName,
        selectedEmp.nationalId,
        selectedEmp.hireDate,
        exitDate,
        selectedEmp.baseSalary,
        exitReason
      )
    : null;

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-amber-600" />
            Calculadora de Prestaciones Laborales (Ley 16-92 R.D.)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulador oficial de Preaviso (Art. 76), Cesantía (Art. 80), Vacaciones y Regalía Pascual (Sueldo 13).
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Imprimir Simulación
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parametros de Entrada */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900">
            Parámetros de Simulación
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Empleado a Liquidar *</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            {selectedEmp && (
              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs space-y-1.5 font-mono text-slate-600">
                <div>Cédula: <strong>{selectedEmp.nationalId}</strong></div>
                <div>Fecha Ingreso: <strong>{selectedEmp.hireDate}</strong></div>
                <div>Salario Base: <strong>RD$ {selectedEmp.baseSalary.toLocaleString('es-DO')}</strong></div>
              </div>
            )}

            <div>
              <label className="font-medium text-slate-700 block mb-1">Fecha de Salida / Término *</label>
              <input
                type="date"
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Motivo de Salida</label>
              <select
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value as any)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Despido Injustificado (Cesantía)">Despido Injustificado (Con Cesantía)</option>
                <option value="Desahucio">Desahucio por el Empleador</option>
                <option value="Renuncia Voluntaria">Renuncia Voluntaria</option>
                <option value="Mutuo Acuerdo">Mutuo Acuerdo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Informe del Resultado del Calculo */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-6">
          {calculationResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                <div>
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest block">
                    Resultado de Liquidación R.D.
                  </span>
                  <h3 className="text-xl font-heading font-bold text-slate-900">
                    {calculationResult.employeeName}
                  </h3>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-slate-500 block">Antigüedad Calculada</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {calculationResult.yearsOfService} años, {calculationResult.monthsOfService} meses y {calculationResult.daysOfService} días
                  </span>
                </div>
              </div>

              {/* Salario Diario Promedio */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between font-mono text-xs">
                <span>Salario Diario Promedio (Salario Mensual / 23.83):</span>
                <span className="font-bold text-slate-900 text-sm">
                  RD$ {calculationResult.averageDailySalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Desglose de Valores */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-700 font-sans font-medium">1. Preaviso (Art. 76 Ley 16-92):</span>
                  <span className="font-bold text-slate-900 text-sm">
                    RD$ {calculationResult.noticeAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-700 font-sans font-medium">2. Auxilio de Cesantía (Art. 80 Ley 16-92):</span>
                  <span className="font-bold text-slate-900 text-sm">
                    RD$ {calculationResult.severanceAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-700 font-sans font-medium">3. Vacaciones No Disfrutadas (Art. 177):</span>
                  <span className="font-bold text-slate-900 text-sm">
                    RD$ {calculationResult.unusedVacationAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-700 font-sans font-medium">4. Regalía Pascual Proporcional (Sueldo 13 - Art. 219):</span>
                  <span className="font-bold text-slate-900 text-sm">
                    RD$ {calculationResult.christmasBonusAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Total Final */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-300 font-medium uppercase tracking-wider block">
                    TOTAL GENERAL LIQUIDACIÓN A PAGAR
                  </span>
                  <span className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400">
                    RD$ {calculationResult.totalLiquidation.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  onClick={() => alert('Simulación registrada en el expediente laboral del empleado.')}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs rounded-2xl cursor-pointer"
                >
                  Guardar Simulación
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Seleccione un empleado para calcular el desglose de prestaciones laborales.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
