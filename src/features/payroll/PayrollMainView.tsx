import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  Calculator, 
  ShieldCheck, 
  User, 
  UserCheck, 
  Sparkles,
  Sliders,
  Edit3
} from 'lucide-react';
import { usePayrollState } from './hooks/usePayrollState';
import { PayrollDashboard } from './components/PayrollDashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { EmployeeProfile360Modal } from './components/EmployeeProfile360Modal';
import { AttendanceOvertimeModal } from './components/AttendanceOvertimeModal';
import { VacationsLeaveModal } from './components/VacationsLeaveModal';
import { PayrollProcessorModal } from './components/PayrollProcessorModal';
import { SeveranceCalculatorModal } from './components/SeveranceCalculatorModal';
import { TssDgiiReportsModal } from './components/TssDgiiReportsModal';
import { EmployeeSelfServicePortal } from './components/EmployeeSelfServicePortal';
import { SupervisorPortal } from './components/SupervisorPortal';
import { PayrollAiAssistantModal } from './components/PayrollAiAssistantModal';
import { LaborProfilesRulesView } from './components/LaborProfilesRulesView';
import { ManualPayrollAndDocsView } from './components/ManualPayrollAndDocsView';
import { Employee } from '../../types/payroll';

export default function PayrollMainView() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'empleados' | 'reglas-perfiles' | 'asistencia' | 'vacaciones' | 'procesar' | 'nomina-manual' | 'prestaciones' | 'tss' | 'portal-empleado' | 'portal-supervisor' | 'ia'
  >('dashboard');

  const {
    employees,
    documents,
    attendanceRecords,
    vacationRequests,
    leaveRequests,
    payrollPeriods,
    payrollDetails,
    payrollRules,
    laborProfiles,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addDocument,
    deleteDocument,
    addAttendanceRecord,
    addVacationRequest,
    updateVacationStatus,
    addLeaveRequest,
    updateLeaveStatus,
    toggleRuleActive,
    addPayrollRule,
    deletePayrollRule,
    deleteVacationRequest,
    deleteLeaveRequest,
    deleteAttendanceRecord,
    deletePayrollPeriod,
    processNewPayrollPeriod,
    getPayrollAnomalies
  } = usePayrollState();

  const [selectedExpedienteEmp, setSelectedExpedienteEmp] = useState<Employee | null>(null);

  const anomalies = getPayrollAnomalies();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'empleados', label: 'Empleados & Perfiles', icon: Users },
    { id: 'reglas-perfiles', label: 'Perfiles & Reglas Fiscales', icon: Sliders },
    { id: 'asistencia', label: 'Asistencia & Extras', icon: Clock },
    { id: 'vacaciones', label: 'Vacaciones & Permisos', icon: Calendar },
    { id: 'procesar', label: 'Procesar Nómina', icon: DollarSign },
    { id: 'nomina-manual', label: 'Nómina & Docs Manuales', icon: Edit3 },
    { id: 'prestaciones', label: 'Prestaciones (Cesantía)', icon: Calculator },
    { id: 'tss', label: 'TSS & DGII Reports', icon: ShieldCheck },
    { id: 'portal-empleado', label: 'Portal Empleado', icon: User },
    { id: 'portal-supervisor', label: 'Portal Supervisor', icon: UserCheck },
    { id: 'ia', label: 'IA Copilot', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start font-sans text-slate-900 pb-12">
      {/* SIDEBAR SECUNDARIO DE NÓMINA */}
      <aside className="w-full lg:w-60 shrink-0 bg-white border border-slate-200 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
        <div className="px-2 py-2 border-b border-slate-150 mb-2 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-slate-900 leading-none">Nómina & R.H.</h2>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Menú Secundario</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* DYNAMIC TAB VIEWS AREA */}
      <main className="flex-1 min-w-0 w-full space-y-6">
        {activeTab === 'dashboard' && (
          <PayrollDashboard
            employees={employees}
            payrollPeriods={payrollPeriods}
            vacationRequests={vacationRequests}
            leaveRequests={leaveRequests}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'empleados' && (
          <EmployeeDirectory
            employees={employees}
            onAddEmployee={addEmployee}
            onUpdateEmployee={updateEmployee}
            onDeleteEmployee={deleteEmployee}
            onOpenExpediente={(emp) => setSelectedExpedienteEmp(emp)}
          />
        )}

        {activeTab === 'reglas-perfiles' && (
          <LaborProfilesRulesView
            laborProfiles={laborProfiles}
            payrollRules={payrollRules}
            onToggleRuleActive={toggleRuleActive}
            onAddPayrollRule={addPayrollRule}
            onDeletePayrollRule={deletePayrollRule}
          />
        )}

        {activeTab === 'asistencia' && (
          <AttendanceOvertimeModal
            employees={employees}
            attendanceRecords={attendanceRecords}
            onAddAttendanceRecord={addAttendanceRecord}
            onDeleteAttendanceRecord={deleteAttendanceRecord}
          />
        )}

        {activeTab === 'vacaciones' && (
          <VacationsLeaveModal
            employees={employees}
            vacationRequests={vacationRequests}
            leaveRequests={leaveRequests}
            onAddVacationRequest={addVacationRequest}
            onUpdateVacationStatus={updateVacationStatus}
            onDeleteVacationRequest={deleteVacationRequest}
            onAddLeaveRequest={addLeaveRequest}
            onUpdateLeaveStatus={updateLeaveStatus}
            onDeleteLeaveRequest={deleteLeaveRequest}
          />
        )}

        {activeTab === 'procesar' && (
          <PayrollProcessorModal
            employees={employees}
            payrollPeriods={payrollPeriods}
            payrollDetails={payrollDetails}
            onProcessPayroll={processNewPayrollPeriod}
            onDeletePayrollPeriod={deletePayrollPeriod}
          />
        )}

        {activeTab === 'nomina-manual' && (
          <ManualPayrollAndDocsView employees={employees} />
        )}

        {activeTab === 'prestaciones' && (
          <SeveranceCalculatorModal employees={employees} />
        )}

        {activeTab === 'tss' && (
          <TssDgiiReportsModal
            employees={employees}
            payrollPeriods={payrollPeriods}
            payrollDetails={payrollDetails}
          />
        )}

        {activeTab === 'portal-empleado' && (
          <EmployeeSelfServicePortal
            employees={employees}
            payrollDetails={payrollDetails}
            vacationRequests={vacationRequests}
          />
        )}

        {activeTab === 'portal-supervisor' && (
          <SupervisorPortal
            employees={employees}
            vacationRequests={vacationRequests}
            leaveRequests={leaveRequests}
            onUpdateVacationStatus={updateVacationStatus}
            onUpdateLeaveStatus={updateLeaveStatus}
          />
        )}

        {activeTab === 'ia' && (
          <PayrollAiAssistantModal
            employees={employees}
            anomalies={anomalies}
          />
        )}
      </main>

      {selectedExpedienteEmp && (
        <EmployeeProfile360Modal
          employee={selectedExpedienteEmp}
          documents={documents}
          payrollDetails={payrollDetails}
          onAddDocument={addDocument}
          onDeleteDocument={deleteDocument}
          onUpdateEmployee={updateEmployee}
          onClose={() => setSelectedExpedienteEmp(null)}
        />
      )}
    </div>
  );
}
