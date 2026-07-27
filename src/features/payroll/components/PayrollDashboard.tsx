import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  FileText,
  Building,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Employee, PayrollPeriod, VacationRequest, LeaveRequest } from '../../../types/payroll';

interface PayrollDashboardProps {
  employees: Employee[];
  payrollPeriods: PayrollPeriod[];
  vacationRequests: VacationRequest[];
  leaveRequests: LeaveRequest[];
  onNavigateTab: (tab: string) => void;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({
  employees,
  payrollPeriods,
  vacationRequests,
  leaveRequests,
  onNavigateTab,
}) => {
  const activeEmployees = employees.filter((e) => e.status === 'Activo');
  const inactiveEmployees = employees.filter((e) => e.status === 'Inactivo');
  const onLeaveEmployees = employees.filter((e) => e.status === 'Licencia' || e.status === 'Vacaciones');

  // Última nómina procesada
  const latestPeriod = payrollPeriods.length > 0 ? payrollPeriods[0] : null;

  const totalMonthlyPayrollCost = activeEmployees.reduce((acc, curr) => acc + curr.baseSalary, 0);
  const pendingVacations = vacationRequests.filter((v) => v.status === 'Pendiente').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pendiente').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium uppercase tracking-widest px-3.5 py-1 rounded-full">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              Gestión de Recursos Humanos & TSS R.D.
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight">
              Módulo de Nómina Empresarial
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Control de salarios, prestaciones de ley (Cesantía/Preaviso), retenciones de ISR DGII y aportes TSS integrados al libro contable.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('procesar')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-medium text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              Procesar Nómina
            </button>

            <button
              onClick={() => onNavigateTab('empleados')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium text-xs sm:text-sm transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Ver Empleados
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Employees */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Empleados Activos</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-heading font-medium text-slate-900">{activeEmployees.length}</span>
            <span className="text-xs text-slate-400 block mt-1">Total registrados: {employees.length}</span>
          </div>
        </div>

        {/* Total Monthly Base Payroll */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Nómina Mensual Base</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-heading font-medium text-slate-900">
              RD$ {totalMonthlyPayrollCost.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Monto base bruto registrado</span>
          </div>
        </div>

        {/* Last Processed Period */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Última Nómina Pagada</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-heading font-medium text-slate-900 block truncate">
              {latestPeriod ? latestPeriod.periodName : 'Ninguna'}
            </span>
            <span className="text-xs text-emerald-600 font-medium block mt-1">
              {latestPeriod ? `RD$ ${latestPeriod.totalNetSalary.toLocaleString('es-DO')} Neto` : 'Pendiente de cierre'}
            </span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Solicitudes Pendientes</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-heading font-medium text-slate-900">{pendingVacations + pendingLeaves}</span>
            <span className="text-xs text-amber-700 font-medium block mt-1">
              {pendingVacations} vacaciones, {pendingLeaves} licencias
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Navigation Hub */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Accesos Rápida de Recursos Humanos
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigateTab('empleados')}
              className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-left hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
            >
              <Users className="w-6 h-6 text-slate-700 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-900 block">Directorio de Empleados</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Expedientes y cargos</span>
            </button>

            <button
              onClick={() => onNavigateTab('asistencia')}
              className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-left hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
            >
              <Clock className="w-6 h-6 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-900 block">Asistencia & Extras</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Marcajes y recargos</span>
            </button>

            <button
              onClick={() => onNavigateTab('vacaciones')}
              className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-left hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
            >
              <Calendar className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-900 block">Vacaciones & Permisos</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Licencias médicas</span>
            </button>

            <button
              onClick={() => onNavigateTab('prestaciones')}
              className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-left hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
            >
              <FileText className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-900 block">Calculadora Prestaciones</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Cesantía y Preaviso</span>
            </button>

            <button
              onClick={() => onNavigateTab('tss')}
              className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-left hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
            >
              <ShieldCheck className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-900 block">TSS & DGII Reports</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Exportación TXT TSS</span>
            </button>

            <button
              onClick={() => onNavigateTab('ia')}
              className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-150 rounded-2xl text-left hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <Sparkles className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-indigo-950 block">IA Copilot Auditor</span>
              <span className="text-[10px] text-indigo-600 block mt-0.5">Detección de anomalías</span>
            </button>
          </div>
        </div>

        {/* HR Alerts */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-medium text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Alertas e Indicadores R.H.
              </h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">En vivo</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2">
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <span>Empleados Inactivos</span>
                <span className="font-semibold text-rose-400">{inactiveEmployees.length}</span>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <span>En Licencia o Vacaciones</span>
                <span className="font-semibold text-amber-400">{onLeaveEmployees.length}</span>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <span>Próximo Cierre de Nómina</span>
                <span className="font-semibold text-sky-400">15 de cada mes</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('procesar')}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            Abrir Simulador de Nómina <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
