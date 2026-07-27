import { Employee, SeveranceCalculation } from '../../../types/payroll';

const MINIMUM_SALARY_REF = 19352.50;
const AFP_CAP = MINIMUM_SALARY_REF * 20;
const ARS_CAP = MINIMUM_SALARY_REF * 10;

/**
 * Calculador de TSS para República Dominicana respetando la Configuración Fiscal Individual del Empleado.
 */
export function calculateTssDeductions(
  monthlyGrossSalary: number,
  flags: {
    aplicaTSS?: boolean;
    aplicaAFP?: boolean;
    aplicaARS?: boolean;
    aplicaINFOTEP?: boolean;
  } = { aplicaTSS: true, aplicaAFP: true, aplicaARS: true, aplicaINFOTEP: true }
) {
  // Si no aplica TSS en absoluto para este empleado, todo es 0
  if (flags.aplicaTSS === false) {
    return {
      afpEmployee: 0,
      arsEmployee: 0,
      totalEmployeeTss: 0,
      afpEmployer: 0,
      arsEmployer: 0,
      srlEmployer: 0,
      infotepEmployer: 0,
      totalEmployerTss: 0
    };
  }

  const salaryAfp = Math.min(monthlyGrossSalary, AFP_CAP);
  const salaryArs = Math.min(monthlyGrossSalary, ARS_CAP);

  // Retenciones Empleado
  const afpEmployee = flags.aplicaAFP !== false ? Math.round(salaryAfp * 0.0287 * 100) / 100 : 0;
  const arsEmployee = flags.aplicaARS !== false ? Math.round(salaryArs * 0.0304 * 100) / 100 : 0;

  // Aportes Patronales
  const afpEmployer = flags.aplicaAFP !== false ? Math.round(salaryAfp * 0.0710 * 100) / 100 : 0;
  const arsEmployer = flags.aplicaARS !== false ? Math.round(salaryArs * 0.0709 * 100) / 100 : 0;
  const srlEmployer = Math.round(salaryAfp * 0.0110 * 100) / 100;
  const infotepEmployer = flags.aplicaINFOTEP !== false ? Math.round(monthlyGrossSalary * 0.0100 * 100) / 100 : 0;

  const totalEmployeeTss = afpEmployee + arsEmployee;
  const totalEmployerTss = afpEmployer + arsEmployer + srlEmployer + infotepEmployer;

  return {
    afpEmployee,
    arsEmployee,
    totalEmployeeTss,
    afpEmployer,
    arsEmployer,
    srlEmployer,
    infotepEmployer,
    totalEmployerTss
  };
}

/**
 * Escala Graduada de ISR DGII R.D. respetando la casilla ¿Aplica ISR? o ¿Es Exento de Impuestos?
 */
export function calculateIsrDgii(
  monthlyTaxableSalary: number,
  flags: { aplicaISR?: boolean; esExentoImpuestos?: boolean } = { aplicaISR: true, esExentoImpuestos: false }
): number {
  if (flags.aplicaISR === false || flags.esExentoImpuestos === true) {
    return 0;
  }

  const annualTaxableSalary = monthlyTaxableSalary * 12;
  let annualIsr = 0;

  if (annualTaxableSalary <= 416220.00) {
    annualIsr = 0;
  } else if (annualTaxableSalary <= 624329.00) {
    const excess = annualTaxableSalary - 416220.01;
    annualIsr = excess * 0.15;
  } else if (annualTaxableSalary <= 867123.00) {
    const excess = annualTaxableSalary - 624329.01;
    annualIsr = 31216.00 + (excess * 0.20);
  } else {
    const excess = annualTaxableSalary - 867123.01;
    annualIsr = 79776.00 + (excess * 0.25);
  }

  const monthlyIsr = Math.max(0, annualIsr / 12);
  return Math.round(monthlyIsr * 100) / 100;
}

/**
 * Cálculo de Horas Extras según Ley 16-92 R.D.
 */
export function calculateOvertimePay(
  hourlyRate: number, 
  dayOvertimeHours: number, 
  nightOvertimeHours: number, 
  holidayOvertimeHours: number
): number {
  const dayPay = dayOvertimeHours * (hourlyRate * 1.35);
  const nightPay = nightOvertimeHours * (hourlyRate * 1.50);
  const holidayPay = holidayOvertimeHours * (hourlyRate * 2.00);

  return Math.round((dayPay + nightPay + holidayPay) * 100) / 100;
}

/**
 * Calculadora de Prestaciones Laborales (Ley 16-92 República Dominicana)
 */
export function calculateSeveranceDominicanLaw(
  employeeId: string,
  employeeName: string,
  nationalId: string,
  hireDateStr: string,
  exitDateStr: string,
  monthlySalary: number,
  exitReason: 'Despido Injustificado (Cesantía)' | 'Renuncia Voluntaria' | 'Desahucio' | 'Mutuo Acuerdo',
  flags: { aplicaCesantia?: boolean; aplicaRegalia?: boolean; aplicaVacaciones?: boolean } = {
    aplicaCesantia: true,
    aplicaRegalia: true,
    aplicaVacaciones: true
  }
): SeveranceCalculation {
  const hireDate = new Date(hireDateStr);
  const exitDate = new Date(exitDateStr);

  const diffTime = Math.max(0, exitDate.getTime() - hireDate.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  const dailyRate = Math.round((monthlySalary / 23.83) * 100) / 100;

  let noticeDays = 0;
  let severanceDays = 0;

  const isEligibleForSeverance =
    flags.aplicaCesantia !== false &&
    (exitReason === 'Despido Injustificado (Cesantía)' || exitReason === 'Desahucio');

  if (isEligibleForSeverance) {
    if (months >= 3 && months < 6) noticeDays = 7;
    else if (months >= 6 && months < 12) noticeDays = 14;
    else if (years >= 1) noticeDays = 28;

    if (months >= 3 && months < 6) severanceDays = 6;
    else if (months >= 6 && months < 12) severanceDays = 13;
    else if (years >= 1 && years < 5) severanceDays = (years * 21) + (months >= 6 ? 13 : (months >= 3 ? 6 : 0));
    else if (years >= 5) severanceDays = (years * 23) + (months >= 6 ? 13 : (months >= 3 ? 6 : 0));
  }

  let vacationDays = 0;
  if (flags.aplicaVacaciones !== false) {
    if (months >= 5 && months < 6) vacationDays = 6;
    else if (months >= 6 && months < 7) vacationDays = 7;
    else if (months >= 7 && months < 8) vacationDays = 8;
    else if (months >= 8 && months < 9) vacationDays = 9;
    else if (months >= 9 && months < 10) vacationDays = 10;
    else if (months >= 10 && months < 11) vacationDays = 11;
    else if (months >= 11 || years >= 1) vacationDays = 14;
  }

  const monthsInCurrentYear = Math.min(12, Math.max(1, exitDate.getMonth() + 1));
  const christmasBonusAmount = flags.aplicaRegalia !== false 
    ? Math.round(((monthlySalary * monthsInCurrentYear) / 12) * 100) / 100 
    : 0;

  const noticeAmount = Math.round(noticeDays * dailyRate * 100) / 100;
  const severanceAmount = Math.round(severanceDays * dailyRate * 100) / 100;
  const unusedVacationAmount = Math.round(vacationDays * dailyRate * 100) / 100;

  const totalLiquidation = Math.round((noticeAmount + severanceAmount + unusedVacationAmount + christmasBonusAmount) * 100) / 100;

  return {
    employeeId,
    employeeName,
    nationalId,
    hireDate: hireDateStr,
    exitDate: exitDateStr,
    yearsOfService: years,
    monthsOfService: months,
    daysOfService: days,
    averageMonthlySalary: monthlySalary,
    averageDailySalary: dailyRate,
    exitReason,
    noticeAmount,
    severanceAmount,
    unusedVacationAmount,
    christmasBonusAmount,
    totalLiquidation
  };
}
