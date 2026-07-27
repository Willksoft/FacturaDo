import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { Employee, VacationRequest, LeaveRequest } from '../../../types/payroll';

interface SupervisorPortalProps {
  employees: Employee[];
  vacationRequests: VacationRequest[];
  leaveRequests: LeaveRequest[];
  onUpdateVacationStatus: (id: string, status: 'Aprobado' | 'Rechazado', approvedBy: string) => void;
  onUpdateLeaveStatus: (id: string, status: 'Aprobado' | 'Rechazado', approvedBy: string) => void;
}

export const SupervisorPortal: React.FC<SupervisorPortalProps> = ({
  employees,
  vacationRequests,
  leaveRequests,
  onUpdateVacationStatus,
  onUpdateLeaveStatus,
}) => {
  const pendingVacations = vacationRequests.filter((v) => v.status === 'Pendiente');
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pendiente');

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            Portal del Supervisor & Aprobaciones R.H.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Revisión y aprobación de vacaciones, licencias médicas, horas extras e indicadores de departamento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 bg-amber-50 text-amber-700 border border-amber-150 rounded-full text-xs font-bold">
            {pendingVacations.length + pendingLeaves.length} Aprobaciones Pendientes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aprobación Vacaciones */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center justify-between">
            <span>Aprobación de Vacaciones</span>
            <span className="text-xs text-slate-400">{pendingVacations.length} pendientes</span>
          </h2>

          <div className="space-y-3">
            {pendingVacations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No hay solicitudes de vacaciones pendientes de aprobación.
              </div>
            ) : (
              pendingVacations.map((vac) => {
                const emp = employees.find((e) => e.id === vac.employeeId);
                return (
                  <div
                    key={vac.id}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block text-xs">{emp?.fullName}</span>
                      <span className="text-[11px] text-slate-500 block">
                        {vac.startDate} al {vac.endDate} ({vac.daysRequested} días)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onUpdateVacationStatus(vac.id, 'Aprobado', 'Supervisor Directo')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() => onUpdateVacationStatus(vac.id, 'Rechazado', 'Supervisor Directo')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Aprobación Licencias */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center justify-between">
            <span>Aprobación de Licencias / Permisos</span>
            <span className="text-xs text-slate-400">{pendingLeaves.length} pendientes</span>
          </h2>

          <div className="space-y-3">
            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No hay solicitudes de licencias o permisos pendientes.
              </div>
            ) : (
              pendingLeaves.map((lea) => {
                const emp = employees.find((e) => e.id === lea.employeeId);
                return (
                  <div
                    key={lea.id}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block text-xs">{emp?.fullName}</span>
                      <span className="text-[11px] text-indigo-700 font-bold block">
                        {lea.type} ({lea.daysCount} días)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onUpdateLeaveStatus(lea.id, 'Aprobado', 'Supervisor Directo')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() => onUpdateLeaveStatus(lea.id, 'Rechazado', 'Supervisor Directo')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
