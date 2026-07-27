import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  User, 
  FileText, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { Employee, VacationRequest, LeaveRequest } from '../../../types/payroll';

interface VacationsLeaveModalProps {
  employees: Employee[];
  vacationRequests: VacationRequest[];
  leaveRequests: LeaveRequest[];
  onAddVacationRequest: (req: Omit<VacationRequest, 'id' | 'createdAt'>) => void;
  onUpdateVacationStatus: (id: string, status: 'Aprobado' | 'Rechazado', approvedBy: string) => void;
  onAddLeaveRequest: (req: Omit<LeaveRequest, 'id'>) => void;
  onUpdateLeaveStatus: (id: string, status: 'Aprobado' | 'Rechazado', approvedBy: string) => void;
}

export const VacationsLeaveModal: React.FC<VacationsLeaveModalProps> = ({
  employees,
  vacationRequests,
  leaveRequests,
  onAddVacationRequest,
  onUpdateVacationStatus,
  onAddLeaveRequest,
  onUpdateLeaveStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'vacaciones' | 'licencias'>('vacaciones');

  // Formulario Vacaciones
  const [vacEmpId, setVacEmpId] = useState(employees[0]?.id || '');
  const [vacStart, setVacStart] = useState(new Date().toISOString().slice(0, 10));
  const [vacEnd, setVacEnd] = useState(new Date().toISOString().slice(0, 10));
  const [vacDays, setVacDays] = useState(14);
  const [vacComments, setVacComments] = useState('');

  // Formulario Licencias
  const [leaEmpId, setLeaEmpId] = useState(employees[0]?.id || '');
  const [leaType, setLeaType] = useState<LeaveRequest['type']>('Enfermedad');
  const [leaStart, setLeaStart] = useState(new Date().toISOString().slice(0, 10));
  const [leaEnd, setLeaEnd] = useState(new Date().toISOString().slice(0, 10));
  const [leaDays, setLeaDays] = useState(3);
  const [leaIsPaid, setLeaIsPaid] = useState(true);
  const [leaNotes, setLeaNotes] = useState('');

  const handleCreateVacation = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === vacEmpId);
    if (!emp) return;

    const dailyRate = emp.baseSalary / 23.83;
    const vacationPayAmount = Math.round(dailyRate * vacDays * 100) / 100;

    onAddVacationRequest({
      employeeId: vacEmpId,
      startDate: vacStart,
      endDate: vacEnd,
      daysRequested: Number(vacDays),
      status: 'Pendiente',
      vacationPayAmount,
      comments: vacComments
    });

    setVacComments('');
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === leaEmpId);
    if (!emp) return;

    onAddLeaveRequest({
      employeeId: leaEmpId,
      type: leaType,
      startDate: leaStart,
      endDate: leaEnd,
      daysCount: Number(leaDays),
      isPaid: leaIsPaid,
      status: 'Pendiente',
      notes: leaNotes
    });

    setLeaNotes('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Gestión de Vacaciones & Licencias Médicas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Solicitudes de descansos anuales (Art. 177), permisos con o sin disfrute de sueldo y acumulados.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('vacaciones')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'vacaciones'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vacaciones
          </button>
          <button
            onClick={() => setActiveTab('licencias')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'licencias'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Licencias Médicas & Permisos
          </button>
        </div>
      </div>

      {activeTab === 'vacaciones' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Solicitud Vacaciones Form */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Solicitar Vacaciones
            </h2>

            <form onSubmit={handleCreateVacation} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Empleado *</label>
                <select
                  value={vacEmpId}
                  onChange={(e) => setVacEmpId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={vacStart}
                    onChange={(e) => setVacStart(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={vacEnd}
                    onChange={(e) => setVacEnd(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Días Solicitados</label>
                <input
                  type="number"
                  min={1}
                  value={vacDays}
                  onChange={(e) => setVacDays(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Comentarios / Observaciones</label>
                <textarea
                  rows={2}
                  value={vacComments}
                  onChange={(e) => setVacComments(e.target.value)}
                  placeholder="Ej. Vacaciones correspondientes al periodo 2025-2026"
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Registrar Solicitud Vacaciones
              </button>
            </form>
          </div>

          {/* Tabla de Vacaciones */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-base font-heading font-medium text-slate-900">
              Solicitudes de Vacaciones Registradas ({vacationRequests.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="p-3">Empleado</th>
                    <th className="p-3">Fechas / Días</th>
                    <th className="p-3 text-right">Pago Estimado</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {vacationRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        No hay solicitudes de vacaciones registradas.
                      </td>
                    </tr>
                  ) : (
                    vacationRequests.map((v) => {
                      const emp = employees.find((e) => e.id === v.employeeId);
                      return (
                        <tr key={v.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-medium text-slate-900">{emp?.fullName || 'Empleado'}</td>
                          <td className="p-3">
                            <span className="font-mono text-xs block text-slate-600">
                              {v.startDate} al {v.endDate}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600">{v.daysRequested} días</span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            RD$ {v.vacationPayAmount.toLocaleString('es-DO')}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                v.status === 'Aprobado'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : v.status === 'Rechazado'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {v.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {v.status === 'Pendiente' && (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => onUpdateVacationStatus(v.id, 'Aprobado', 'Gerente RRHH')}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg cursor-pointer"
                                  title="Aprobar"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onUpdateVacationStatus(v.id, 'Rechazado', 'Gerente RRHH')}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                                  title="Rechazar"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Pestaña Licencias Médicas y Permisos */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Solicitar Licencia / Permiso
            </h2>

            <form onSubmit={handleCreateLeave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Empleado *</label>
                <select
                  value={leaEmpId}
                  onChange={(e) => setLeaEmpId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Tipo de Licencia</label>
                <select
                  value={leaType}
                  onChange={(e) => setLeaType(e.target.value as any)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Enfermedad">Enfermedad / Médica</option>
                  <option value="Maternidad">Maternidad (Pre y Post Natal)</option>
                  <option value="Paternidad">Paternidad</option>
                  <option value="Matrimonio">Matrimonio</option>
                  <option value="Fallecimiento">Fallecimiento Familiar</option>
                  <option value="Estudios">Estudios / Exámenes</option>
                  <option value="Permiso Especial">Permiso Especial</option>
                  <option value="Sin Disfrute de Sueldo">Sin Disfrute de Sueldo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={leaStart}
                    onChange={(e) => setLeaStart(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={leaEnd}
                    onChange={(e) => setLeaEnd(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="font-medium text-slate-700 block mb-1">Días</label>
                  <input
                    type="number"
                    min={1}
                    value={leaDays}
                    onChange={(e) => setLeaDays(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="lea-paid"
                    checked={leaIsPaid}
                    onChange={(e) => setLeaIsPaid(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <label htmlFor="lea-paid" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Con Goce de Sueldo
                  </label>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Detalle / Diagnóstico / Certificado</label>
                <textarea
                  rows={2}
                  value={leaNotes}
                  onChange={(e) => setLeaNotes(e.target.value)}
                  placeholder="Detalles de la licencia médica o justificación..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Registrar Licencia
              </button>
            </form>
          </div>

          {/* Tabla de Licencias */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-base font-heading font-medium text-slate-900">
              Licencias y Permisos Registrados ({leaveRequests.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="p-3">Empleado</th>
                    <th className="p-3">Tipo Licencia</th>
                    <th className="p-3">Fechas / Días</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {leaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        No hay licencias registradas.
                      </td>
                    </tr>
                  ) : (
                    leaveRequests.map((l) => {
                      const emp = employees.find((e) => e.id === l.employeeId);
                      return (
                        <tr key={l.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-medium text-slate-900">{emp?.fullName || 'Empleado'}</td>
                          <td className="p-3 font-semibold text-indigo-700">{l.type}</td>
                          <td className="p-3">
                            <span className="font-mono text-xs block text-slate-600">
                              {l.startDate} al {l.endDate}
                            </span>
                            <span className="text-[11px] text-slate-500">{l.daysCount} días</span>
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                l.status === 'Aprobado'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : l.status === 'Rechazado'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {l.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {l.status === 'Pendiente' && (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => onUpdateLeaveStatus(l.id, 'Aprobado', 'Gerente RRHH')}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg cursor-pointer"
                                  title="Aprobar"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onUpdateLeaveStatus(l.id, 'Rechazado', 'Gerente RRHH')}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                                  title="Rechazar"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
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
