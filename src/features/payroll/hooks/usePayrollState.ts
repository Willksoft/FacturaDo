import { useState, useEffect } from 'react';
import { 
  Employee, 
  EmployeeDocument, 
  AttendanceRecord, 
  VacationRequest, 
  LeaveRequest, 
  PayrollPeriod, 
  PayrollDetail,
  PayrollAiAnomaly,
  LaborProfile,
  PayrollRule
} from '../../../types/payroll';
import { calculateTssDeductions, calculateIsrDgii } from '../utils/dominicanTaxCalculators';
import { DEFAULT_LABOR_PROFILES, DEFAULT_PAYROLL_RULES, evaluateEmployeePayrollRules } from '../utils/payrollRuleEngine';

const STORAGE_EMPLOYEES = 'facturado_payroll_employees_v2';
const STORAGE_DOCUMENTS = 'facturado_payroll_documents_v1';
const STORAGE_ATTENDANCE = 'facturado_payroll_attendance_v1';
const STORAGE_VACATIONS = 'facturado_payroll_vacations_v1';
const STORAGE_LEAVES = 'facturado_payroll_leaves_v1';
const STORAGE_PERIODS = 'facturado_payroll_periods_v1';
const STORAGE_DETAILS = 'facturado_payroll_details_v1';
const STORAGE_RULES = 'facturado_payroll_rules_v1';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    code: 'EMP-001',
    fullName: 'Juan Carlos Martínez Ramírez',
    gender: 'M',
    maritalStatus: 'Casado/a',
    nationality: 'Dominicana',
    countryOfOrigin: 'República Dominicana',
    migratoryStatus: 'Ciudadano',
    identityDocType: 'Cédula',
    nationalId: '001-1458294-3',
    birthDate: '1988-04-12',
    address: 'Av. Winston Churchill No. 45',
    province: 'Distrito Nacional',
    municipality: 'Santo Domingo',
    phone: '809-555-0192',
    mobile: '829-555-8821',
    email: 'j.martinez@comercio.do',
    company: 'FacturaDo S.R.L.',
    branch: 'Sede Principal Naco',
    department: 'Contabilidad y Finanzas',
    area: 'Administración',
    costCenter: 'CC-101',
    jobTitle: 'Contador General Senior',
    employeeType: 'Permanente',
    status: 'Activo',
    hireDate: '2021-02-15',
    contractType: 'Indefinido',
    
    // Fiscal Individual Config
    laborProfileId: 'fijo',
    aplicaISR: true,
    aplicaTSS: true,
    aplicaAFP: true,
    aplicaARS: true,
    aplicaINFOTEP: true,
    aplicaRegalia: true,
    aplicaCesantia: true,
    aplicaVacaciones: true,
    aplicaPrestaciones: true,
    cotizaSeguridadSocial: true,
    esExentoImpuestos: false,

    baseSalary: 65000,
    hourlyRate: 65000 / 176,
    dailyRate: 65000 / 23.83,
    currency: 'DOP',
    paymentMethod: 'Transferencia Bancaria',
    bankName: 'Banco Popular Dominicano',
    accountNumber: '7984102948',
    accountType: 'Ahorros',
    shiftType: 'Fijo',
    afpName: 'AFP Crecer',
    arsName: 'ARS Primera',
    dependentsCount: 2
  },
  {
    id: 'emp-102',
    code: 'EMP-002',
    fullName: 'María Altagracia Rosario Peña',
    gender: 'F',
    maritalStatus: 'Soltero/a',
    nationality: 'Dominicana',
    countryOfOrigin: 'República Dominicana',
    migratoryStatus: 'Ciudadano',
    identityDocType: 'Cédula',
    nationalId: '031-0082914-1',
    birthDate: '1993-09-24',
    address: 'Calle Del Sol No. 120',
    province: 'Santiago',
    municipality: 'Santiago de los Caballeros',
    phone: '809-582-1200',
    mobile: '809-555-3344',
    email: 'm.rosario@comercio.do',
    company: 'FacturaDo S.R.L.',
    branch: 'Sucursal Santiago',
    department: 'Ventas y POS',
    area: 'Comercial',
    costCenter: 'CC-201',
    jobTitle: 'Cajera Encargada de Turno',
    employeeType: 'Permanente',
    status: 'Activo',
    hireDate: '2022-06-01',
    contractType: 'Indefinido',

    // Fiscal Individual Config
    laborProfileId: 'fijo',
    aplicaISR: true,
    aplicaTSS: true,
    aplicaAFP: true,
    aplicaARS: true,
    aplicaINFOTEP: true,
    aplicaRegalia: true,
    aplicaCesantia: true,
    aplicaVacaciones: true,
    aplicaPrestaciones: true,
    cotizaSeguridadSocial: true,
    esExentoImpuestos: false,

    baseSalary: 32000,
    hourlyRate: 32000 / 176,
    dailyRate: 32000 / 23.83,
    currency: 'DOP',
    paymentMethod: 'Transferencia Bancaria',
    bankName: 'Banreservas',
    accountNumber: '9602814012',
    accountType: 'Ahorros',
    shiftType: 'Fijo',
    afpName: 'AFP Popular',
    arsName: 'ARS Humano',
    dependentsCount: 1
  },
  {
    id: 'emp-103',
    code: 'EMP-003',
    fullName: 'Alexander Pierre Louis',
    gender: 'M',
    maritalStatus: 'Soltero/a',
    nationality: 'Extranjera',
    countryOfOrigin: 'Haití',
    migratoryStatus: 'Contratista Internacional',
    identityDocType: 'Pasaporte',
    nationalId: 'PAS-982104912',
    docExpirationDate: '2026-09-15',
    docIssuingCountry: 'Haití',
    birthDate: '1995-11-05',
    address: 'Calle San Vicente de Paúl No. 88',
    province: 'Santo Domingo',
    municipality: 'Santo Domingo Este',
    phone: '809-591-3320',
    mobile: '829-555-9012',
    email: 'a.pierre@comercio.do',
    company: 'FacturaDo S.R.L.',
    branch: 'Almacén Central',
    department: 'Desarrollo de Software',
    area: 'Tecnología',
    costCenter: 'CC-301',
    jobTitle: 'Consultor de Integración Backend',
    employeeType: 'Contratado',
    status: 'Activo',
    hireDate: '2023-01-10',
    contractType: 'Contratista',

    // Fiscal Individual Config (Contratista Extranjero - Exento TSS/ISR)
    laborProfileId: 'remoto_internacional',
    aplicaISR: false,
    aplicaTSS: false,
    aplicaAFP: false,
    aplicaARS: false,
    aplicaINFOTEP: false,
    aplicaRegalia: false,
    aplicaCesantia: false,
    aplicaVacaciones: true,
    aplicaPrestaciones: false,
    cotizaSeguridadSocial: false,
    esExentoImpuestos: true,
    motivoExencion: 'Convenio Internacional',

    baseSalary: 120000,
    hourlyRate: 120000 / 176,
    dailyRate: 120000 / 23.83,
    currency: 'DOP',
    paymentMethod: 'Transferencia Bancaria',
    bankName: 'Banco BHD',
    accountNumber: '1029485712',
    accountType: 'Ahorros',
    shiftType: 'Flexible',
    afpName: 'N/A',
    arsName: 'N/A',
    dependentsCount: 0
  }
];

export function usePayrollState() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EMPLOYEES);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [documents, setDocuments] = useState<EmployeeDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DOCUMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ATTENDANCE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VACATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEAVES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PERIODS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [payrollDetails, setPayrollDetails] = useState<PayrollDetail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DETAILS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [payrollRules, setPayrollRules] = useState<PayrollRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RULES);
      return saved ? JSON.parse(saved) : DEFAULT_PAYROLL_RULES;
    } catch {
      return DEFAULT_PAYROLL_RULES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_VACATIONS, JSON.stringify(vacationRequests));
  }, [vacationRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PERIODS, JSON.stringify(payrollPeriods));
  }, [payrollPeriods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DETAILS, JSON.stringify(payrollDetails));
  }, [payrollDetails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_RULES, JSON.stringify(payrollRules));
  }, [payrollRules]);

  // CRUD Empleados
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [newEmp, ...prev]);
    return newEmp;
  };

  const updateEmployee = (id: string, emp: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...emp } : e)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // CRUD Expedientes Digitales
  const addDocument = (doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    const newDoc: EmployeeDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10)
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Asistencia & Marcajes
  const addAttendanceRecord = (rec: Omit<AttendanceRecord, 'id'>) => {
    const newRec: AttendanceRecord = {
      ...rec,
      id: `att-${Date.now()}`
    };
    setAttendanceRecords((prev) => [newRec, ...prev]);
  };

  // Solicitudes de Vacaciones
  const addVacationRequest = (req: Omit<VacationRequest, 'id' | 'createdAt'>) => {
    const newReq: VacationRequest = {
      ...req,
      id: `vac-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setVacationRequests((prev) => [newReq, ...prev]);
  };

  const updateVacationStatus = (id: string, status: 'Aprobado' | 'Rechazado', approvedBy: string) => {
    setVacationRequests((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status, approvedBy } : v))
    );
  };

  // Solicitudes de Licencias
  const addLeaveRequest = (req: Omit<LeaveRequest, 'id'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lea-${Date.now()}`
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: 'Aprobado' | 'Rechazado', approvedBy: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, approvedBy } : l))
    );
  };

  // CRUD Reglas Inteligentes
  const toggleRuleActive = (id: string) => {
    setPayrollRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const addPayrollRule = (rule: Omit<PayrollRule, 'id'>) => {
    const newRule: PayrollRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };
    setPayrollRules((prev) => [newRule, ...prev]);
  };

  // Procesamiento de Nómina con Reglas Evaluadas por Empleado
  const processNewPayrollPeriod = (
    periodName: string,
    frequency: 'Semanal' | 'Quincenal' | 'Mensual',
    startDate: string,
    endDate: string,
    additionalEarningsMap: Record<string, { overtimePay?: number; commissionsPay?: number; bonusesPay?: number }>,
    additionalDeductionsMap: Record<string, { loansDeduction?: number; advancesDeduction?: number; otherDeductions?: number }>
  ) => {
    const periodId = `period-${Date.now()}`;
    const activeEmployees = employees.filter((e) => e.status === 'Activo');

    let totalGrossSalary = 0;
    let totalOvertime = 0;
    let totalCommissions = 0;
    let totalBonuses = 0;
    let totalAfpEmployee = 0;
    let totalArsEmployee = 0;
    let totalIsr = 0;
    let totalOtherDeductions = 0;
    let totalNetSalary = 0;
    let totalAfpEmployer = 0;
    let totalArsEmployer = 0;
    let totalSrlEmployer = 0;
    let totalInfotepEmployer = 0;

    const newDetails: PayrollDetail[] = activeEmployees.map((emp) => {
      const isQuincenal = frequency === 'Quincenal';
      const isSemanal = frequency === 'Semanal';
      
      const divisor = isQuincenal ? 2 : isSemanal ? 4 : 1;
      const baseSalaryPeriod = Math.round((emp.baseSalary / divisor) * 100) / 100;

      const extras = additionalEarningsMap[emp.id] || {};
      const overtimePay = extras.overtimePay || 0;
      const commissionsPay = extras.commissionsPay || 0;
      const bonusesPay = extras.bonusesPay || 0;

      const grossSalary = Math.round((baseSalaryPeriod + overtimePay + commissionsPay + bonusesPay) * 100) / 100;

      // Evaluar Reglas Inteligentes sobre el Empleado
      const evaluatedFlags = evaluateEmployeePayrollRules(emp, payrollRules);

      // TSS retenciones respetando las banderas fiscales del empleado
      const tss = calculateTssDeductions(grossSalary, {
        aplicaTSS: evaluatedFlags.aplicaTSS,
        aplicaAFP: evaluatedFlags.aplicaAFP,
        aplicaARS: evaluatedFlags.aplicaARS,
        aplicaINFOTEP: evaluatedFlags.aplicaINFOTEP
      });

      // ISR retención respetando exención e ISR flag
      const isr = calculateIsrDgii(grossSalary - tss.totalEmployeeTss, {
        aplicaISR: evaluatedFlags.aplicaISR,
        esExentoImpuestos: evaluatedFlags.esExentoImpuestos
      });

      const deductions = additionalDeductionsMap[emp.id] || {};
      const loansDeduction = deductions.loansDeduction || 0;
      const advancesDeduction = deductions.advancesDeduction || 0;
      const otherDeductions = deductions.otherDeductions || 0;

      const totalDeductions = Math.round((tss.totalEmployeeTss + isr + loansDeduction + advancesDeduction + otherDeductions) * 100) / 100;
      const netSalary = Math.round((grossSalary - totalDeductions) * 100) / 100;

      // Acumular totales
      totalGrossSalary += grossSalary;
      totalOvertime += overtimePay;
      totalCommissions += commissionsPay;
      totalBonuses += bonusesPay;
      totalAfpEmployee += tss.afpEmployee;
      totalArsEmployee += tss.arsEmployee;
      totalIsr += isr;
      totalOtherDeductions += (loansDeduction + advancesDeduction + otherDeductions);
      totalNetSalary += netSalary;

      totalAfpEmployer += tss.afpEmployer;
      totalArsEmployer += tss.arsEmployer;
      totalSrlEmployer += tss.srlEmployer;
      totalInfotepEmployer += tss.infotepEmployer;

      return {
        id: `dt-${Date.now()}-${emp.id}`,
        periodId,
        employeeId: emp.id,
        employeeName: emp.fullName,
        nationalId: emp.nationalId,
        department: emp.department,
        jobTitle: emp.jobTitle,
        baseSalaryPeriod,
        overtimePay,
        commissionsPay,
        bonusesPay,
        grossSalary,
        afpEmployee: tss.afpEmployee,
        arsEmployee: tss.arsEmployee,
        isrEmployee: isr,
        loansDeduction,
        advancesDeduction,
        otherDeductions,
        totalDeductions,
        netSalary,
        afpEmployer: tss.afpEmployer,
        arsEmployer: tss.arsEmployer,
        srlEmployer: tss.srlEmployer,
        infotepEmployer: tss.infotepEmployer,
        totalEmployerCost: Math.round((grossSalary + tss.totalEmployerTss) * 100) / 100,
        paymentBank: emp.bankName,
        accountNumber: emp.accountNumber,
        isPaid: true
      };
    });

    const totalEmployerCost = Math.round((totalGrossSalary + totalAfpEmployer + totalArsEmployer + totalSrlEmployer + totalInfotepEmployer) * 100) / 100;

    const newPeriod: PayrollPeriod = {
      id: periodId,
      periodName,
      frequency,
      startDate,
      endDate,
      status: 'Procesada',
      totalGrossSalary: Math.round(totalGrossSalary * 100) / 100,
      totalOvertime: Math.round(totalOvertime * 100) / 100,
      totalCommissions: Math.round(totalCommissions * 100) / 100,
      totalBonuses: Math.round(totalBonuses * 100) / 100,
      totalAfpEmployee: Math.round(totalAfpEmployee * 100) / 100,
      totalArsEmployee: Math.round(totalArsEmployee * 100) / 100,
      totalIsr: Math.round(totalIsr * 100) / 100,
      totalOtherDeductions: Math.round(totalOtherDeductions * 100) / 100,
      totalNetSalary: Math.round(totalNetSalary * 100) / 100,
      totalAfpEmployer: Math.round(totalAfpEmployer * 100) / 100,
      totalArsEmployer: Math.round(totalArsEmployer * 100) / 100,
      totalSrlEmployer: Math.round(totalSrlEmployer * 100) / 100,
      totalInfotepEmployer: Math.round(totalInfotepEmployer * 100) / 100,
      totalEmployerCost,
      processedAt: new Date().toISOString()
    };

    setPayrollPeriods((prev) => [newPeriod, ...prev]);
    setPayrollDetails((prev) => [...newDetails, ...prev]);

    return { newPeriod, newDetails };
  };

  // Detector de Anomalías incluyendo Vencimientos de Pasaportes/Visas
  const getPayrollAnomalies = (): PayrollAiAnomaly[] => {
    const anomalies: PayrollAiAnomaly[] = [];

    employees.forEach((emp) => {
      // Alerta de Documento Expirado
      if (emp.docExpirationDate) {
        const expDate = new Date(emp.docExpirationDate);
        const today = new Date();
        const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 60) {
          anomalies.push({
            id: `anom-${emp.id}-doc`,
            type: 'Documento Expirado',
            employeeId: emp.id,
            employeeName: emp.fullName,
            severity: diffDays <= 15 ? 'Alta' : 'Media',
            description: `El documento (${emp.identityDocType} ${emp.nationalId}) de estatus ${emp.migratoryStatus} vence en ${diffDays} días (${emp.docExpirationDate}).`,
            suggestion: 'Solicitar prórroga de visa o renovación de pasaporte para mantener estatus laboral legal.'
          });
        }
      }

      if (emp.baseSalary > 300000) {
        anomalies.push({
          id: `anom-${emp.id}-sal`,
          type: 'Salario Fuera de Rango',
          employeeId: emp.id,
          employeeName: emp.fullName,
          severity: 'Media',
          description: `El salario de RD$ ${emp.baseSalary.toLocaleString()} supera el promedio para ${emp.jobTitle}.`,
          suggestion: 'Verificar contrato o aprobación especial.'
        });
      }
    });

    return anomalies;
  };

  return {
    employees,
    documents,
    attendanceRecords,
    vacationRequests,
    leaveRequests,
    payrollPeriods,
    payrollDetails,
    payrollRules,
    laborProfiles: DEFAULT_LABOR_PROFILES,
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
  };
}
