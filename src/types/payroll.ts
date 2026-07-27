export type ContractType = 
  | 'Indefinido' 
  | 'Determinado' 
  | 'Temporal' 
  | 'Por Proyecto' 
  | 'Medio Tiempo' 
  | 'Freelance' 
  | 'Comisionista' 
  | 'Honorarios' 
  | 'Contratista';

export type EmployeeStatus = 'Activo' | 'Inactivo' | 'Licencia' | 'Vacaciones' | 'Suspendido';

export type ShiftType = 'Fijo' | 'Flexible' | 'Rotativo' | 'Nocturno' | 'Mixto' | 'Personalizado';

export type MigratoryStatus =
  | 'Ciudadano'
  | 'Residente Permanente'
  | 'Residente Temporal'
  | 'Trabajador Extranjero'
  | 'Visa de Trabajo'
  | 'Permiso Temporal de Trabajo'
  | 'Refugiado'
  | 'Diplomático'
  | 'Contratista Internacional'
  | 'Otro';

export type IdentityDocumentType =
  | 'Cédula'
  | 'Pasaporte'
  | 'Permiso de Trabajo'
  | 'Documento de Residencia'
  | 'Documento Identidad Extranjero'
  | 'Documento Diplomático'
  | 'Otro';

export type ExemptionReason =
  | 'Convenio Internacional'
  | 'Contrato Diplomático'
  | 'Organización Internacional'
  | 'Empresa Extranjera'
  | 'Temporal'
  | 'Exención Gubernamental'
  | 'Ninguno'
  | 'Otro';

export type LaborProfileId =
  | 'fijo'
  | 'temporal'
  | 'extranjero'
  | 'contratista'
  | 'consultor'
  | 'freelancer'
  | 'pasante'
  | 'ejecutivo'
  | 'remoto_internacional'
  | 'personalizado';

export interface LaborProfile {
  id: LaborProfileId;
  name: string;
  description: string;

  // Beneficios y obligaciones predeterminados
  aplicaISR: boolean;
  aplicaTSS: boolean;
  aplicaAFP: boolean;
  aplicaARS: boolean;
  aplicaINFOTEP: boolean;
  aplicaRegalia: boolean;
  aplicaCesantia: boolean;
  aplicaVacaciones: boolean;
  aplicaPrestaciones: boolean;
  cotizaSeguridadSocial: boolean;
  esExentoImpuestos: boolean;
  motivoExencionDefault?: ExemptionReason;
}

export interface PayrollRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;

  // Condiciones SI
  conditionNationality?: 'Dominicana' | 'Extranjera' | 'Cualquiera';
  conditionMigratoryStatus?: MigratoryStatus | 'Cualquiera';
  conditionContractType?: ContractType | 'Cualquiera';
  conditionIdentityDocType?: IdentityDocumentType | 'Cualquiera';

  // Acciones ENTONCES
  setAplicaISR?: boolean;
  setAplicaTSS?: boolean;
  setAplicaAFP?: boolean;
  setAplicaARS?: boolean;
  setAplicaINFOTEP?: boolean;
  setAplicaRegalia?: boolean;
  setAplicaCesantia?: boolean;
  setCotizaSeguridadSocial?: boolean;
  setEsExentoImpuestos?: boolean;
}

export interface Employee {
  id: string;
  code: string;
  photoUrl?: string;
  fullName: string;
  gender: 'M' | 'F' | 'Otro';
  maritalStatus: 'Soltero/a' | 'Casado/a' | 'Divorciado/a' | 'Viudo/a' | 'Unión Libre';
  nationality: 'Dominicana' | 'Extranjera';
  countryOfOrigin: string;
  birthDate: string;

  // Información Migratoria e Identidad
  migratoryStatus: MigratoryStatus;
  identityDocType: IdentityDocumentType;
  nationalId: string; // Número de documento
  docExpirationDate?: string;
  docIssuingCountry?: string;
  rnc?: string;

  address: string;
  province: string;
  municipality: string;
  phone: string;
  mobile: string;
  email: string;

  // Información Laboral
  company: string;
  branch: string;
  department: string;
  area: string;
  costCenter: string;
  jobTitle: string;
  supervisorId?: string;
  employeeType: 'Permanente' | 'Probatorio' | 'Contratado';
  status: EmployeeStatus;
  hireDate: string;
  exitDate?: string;
  contractType: ContractType;
  exitReason?: string;

  // Perfil Laboral y Configuración Fiscal Individual
  laborProfileId: LaborProfileId;
  aplicaISR: boolean;
  aplicaTSS: boolean;
  aplicaAFP: boolean;
  aplicaARS: boolean;
  aplicaINFOTEP: boolean;
  aplicaRegalia: boolean;
  aplicaCesantia: boolean;
  aplicaVacaciones: boolean;
  aplicaPrestaciones: boolean;
  cotizaSeguridadSocial: boolean;
  esExentoImpuestos: boolean;
  motivoExencion?: ExemptionReason;

  // Información Salarial
  baseSalary: number;
  hourlyRate: number;
  dailyRate: number;
  currency: 'DOP' | 'USD';
  paymentMethod: 'Transferencia Bancaria' | 'Efectivo' | 'Cheque';
  bankName: string;
  accountNumber: string;
  accountType: 'Ahorros' | 'Corriente';

  shiftType: ShiftType;
  afpName: string;
  arsName: string;
  dependentsCount: number;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  type: 'Contrato' | 'Curriculum' | 'Cedula' | 'Pasaporte' | 'Licencia' | 'CertificadoMedico' | 'Titulo' | 'Evaluacion' | 'Amonestacion' | 'Permiso' | 'Vacaciones' | 'Otro';
  title: string;
  fileUrl: string;
  uploadDate: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  lunchStart?: string;
  lunchEnd?: string;
  hoursWorked: number;
  overtimeHours: number;
  nightOvertimeHours: number;
  holidayOvertimeHours: number;
  isLate: boolean;
  lateMinutes: number;
  status: 'Presente' | 'Ausente' | 'Tardanza' | 'Licencia' | 'Vacaciones';
  source: 'Biométrico' | 'Facial' | 'QR' | 'GPS Mobile' | 'Web Manual';
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  approvedBy?: string;
  vacationPayAmount: number;
  comments?: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Enfermedad' | 'Maternidad' | 'Paternidad' | 'Matrimonio' | 'Fallecimiento' | 'Estudios' | 'Permiso Especial' | 'Sin Disfrute de Sueldo';
  startDate: string;
  endDate: string;
  daysCount: number;
  isPaid: boolean;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  approvedBy?: string;
  notes?: string;
  attachmentUrl?: string;
}

export interface PayrollPeriod {
  id: string;
  periodName: string;
  frequency: 'Semanal' | 'Quincenal' | 'Mensual';
  startDate: string;
  endDate: string;
  status: 'Borrador' | 'Procesada' | 'Cerrada';
  totalGrossSalary: number;
  totalOvertime: number;
  totalCommissions: number;
  totalBonuses: number;
  totalAfpEmployee: number;
  totalArsEmployee: number;
  totalIsr: number;
  totalOtherDeductions: number;
  totalNetSalary: number;
  totalAfpEmployer: number;
  totalArsEmployer: number;
  totalSrlEmployer: number;
  totalInfotepEmployer: number;
  totalEmployerCost: number;
  processedAt?: string;
}

export interface PayrollDetail {
  id: string;
  periodId: string;
  employeeId: string;
  employeeName: string;
  nationalId: string;
  department: string;
  jobTitle: string;
  baseSalaryPeriod: number;
  overtimePay: number;
  commissionsPay: number;
  bonusesPay: number;
  grossSalary: number;
  
  afpEmployee: number;
  arsEmployee: number;
  isrEmployee: number;
  loansDeduction: number;
  advancesDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;

  afpEmployer: number;
  arsEmployer: number;
  srlEmployer: number;
  infotepEmployer: number;
  totalEmployerCost: number;

  paymentBank: string;
  accountNumber: string;
  isPaid: boolean;
}

export interface SeveranceCalculation {
  employeeId: string;
  employeeName: string;
  nationalId: string;
  hireDate: string;
  exitDate: string;
  yearsOfService: number;
  monthsOfService: number;
  daysOfService: number;
  averageMonthlySalary: number;
  averageDailySalary: number;
  exitReason: 'Despido Injustificado (Cesantía)' | 'Renuncia Voluntaria' | 'Desahucio' | 'Mutuo Acuerdo';
  
  noticeAmount: number;
  severanceAmount: number;
  unusedVacationAmount: number;
  christmasBonusAmount: number;
  totalLiquidation: number;
}

export interface PayrollAiAnomaly {
  id: string;
  type: 'Salario Fuera de Rango' | 'Pago Duplicado' | 'Horas Extras Inusuales' | 'Tardanza Repetitiva' | 'RNC/Cédula Inválida' | 'Documento Expirado';
  employeeId: string;
  employeeName: string;
  severity: 'Alta' | 'Media' | 'Baja';
  description: string;
  suggestion: string;
}
