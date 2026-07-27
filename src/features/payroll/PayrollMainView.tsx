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
    <div className="space-y-6 font-sans text-slate-900 pb-12">
      {/* Sub-navigation bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Views */}
      <div>
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
          />
        )}

        {activeTab === 'asistencia' && (
          <AttendanceOvertimeModal
            employees={employees}
            attendanceRecords={attendanceRecords}
            onAddAttendanceRecord={addAttendanceRecord}
          />
        )}

        {activeTab === 'vacaciones' && (
          <VacationsLeaveModal
            employees={employees}
            vacationRequests={vacationRequests}
            leaveRequests={leaveRequests}
            onAddVacationRequest={addVacationRequest}
            onUpdateVacationStatus={updateVacationStatus}
            onAddLeaveRequest={addLeaveRequest}
            onUpdateLeaveStatus={updateLeaveStatus}
          />
        )}

        {activeTab === 'procesar' && (
          <PayrollProcessorModal
            employees={employees}
            payrollPeriods={payrollPeriods}
            payrollDetails={payrollDetails}
            onProcessPayroll={processNewPayrollPeriod}
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
      </div>

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
