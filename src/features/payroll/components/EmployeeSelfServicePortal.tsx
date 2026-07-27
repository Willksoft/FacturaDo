import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Calendar, 
  Download, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { Employee, PayrollDetail, VacationRequest } from '../../../types/payroll';

interface EmployeeSelfServicePortalProps {
  employees: Employee[];
  payrollDetails: PayrollDetail[];
  vacationRequests: VacationRequest[];
}

export const EmployeeSelfServicePortal: React.FC<EmployeeSelfServicePortalProps> = ({
  employees,
  payrollDetails,
  vacationRequests,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');

  const emp = employees.find((e) => e.id === selectedEmpId);
  const myPayslips = payrollDetails.filter((d) => d.employeeId === selectedEmpId);
  const myVacations = vacationRequests.filter((v) => v.employeeId === selectedEmpId);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            Portal del Empleado (Self-Service)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulta de recibos de pago, solicitudes de vacaciones, beneficios y expediente personal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Ver como:</label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName} ({e.jobTitle})
              </option>
            ))}
          </select>
        </div>
      </div>

      {emp && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Perfil Empleado */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                {emp.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white">{emp.fullName}</h2>
                <span className="text-xs text-indigo-300 block">{emp.jobTitle}</span>
                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{emp.code} • {emp.department}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-800 pt-4 text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>Cédula:</span>
                <span className="font-bold text-white">{emp.nationalId}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha Ingreso:</span>
                <span className="text-white">{emp.hireDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Banco:</span>
                <span className="text-white">{emp.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>No. Cuenta:</span>
                <span className="text-white">{emp.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>AFP / ARS:</span>
                <span className="text-white">{emp.afpName} / {emp.arsName}</span>
              </div>
            </div>
          </div>

          {/* Mis Volantes de Pago */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Mis Comprobantes de Pago ({myPayslips.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="p-3">Período</th>
                    <th className="p-3 text-right">Salario Bruto</th>
                    <th className="p-3 text-right">Deducciones (TSS/ISR)</th>
                    <th className="p-3 text-right">Monto Neto Recibido</th>
                    <th className="p-3 text-center">Descargar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {myPayslips.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">
                        No hay comprobantes de pago aún para este empleado.
                      </td>
                    </tr>
                  ) : (
                    myPayslips.map((ps) => (
                      <tr key={ps.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-semibold text-slate-900">{ps.periodId}</td>
                        <td className="p-3 text-right font-mono text-slate-700">
                          RD$ {ps.grossSalary.toLocaleString('es-DO')}
                        </td>
                        <td className="p-3 text-right font-mono text-rose-600 font-semibold">
                          - RD$ {ps.totalDeductions.toLocaleString('es-DO')}
                        </td>
                        <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                          RD$ {ps.netSalary.toLocaleString('es-DO')}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => window.print()}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                            title="Imprimir Recibo"
                          >
                            <Download className="w-4 h-4" />
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
      )}
    </div>
  );
};
