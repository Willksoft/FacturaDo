import { Employee, PayrollDetail } from '../../../types/payroll';

/**
 * Generador de Archivos .TXT para la Plataforma TSS (Tesorería de la Seguridad Social R.D.)
 * Excluye a los empleados que NO cotizan a la Seguridad Social (ej. Contratistas Internacionales).
 */

export function generateTssNovedadesTxt(companyRnc: string, employees: Employee[]): string {
  // Filtrar solo empleados que cotizan a TSS y cuya casilla de TSS está activa
  const eligibleEmployees = employees.filter((e) => e.cotizaSeguridadSocial !== false && e.aplicaTSS !== false);

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let fileLines: string[] = [];

  fileLines.push(`H|${companyRnc.padEnd(11, ' ')}|${dateStr}|${eligibleEmployees.length}`);

  eligibleEmployees.forEach((emp) => {
    const cleanId = emp.nationalId.replace(/\D/g, '').padEnd(11, ' ');
    const names = emp.fullName.trim();
    const salary = Math.round(emp.baseSalary).toString().padStart(10, '0');
    const hireDateFormatted = emp.hireDate.replace(/-/g, '');
    const noveltyType = emp.status === 'Activo' ? 'ING' : emp.status === 'Inactivo' ? 'SAL' : 'CAM';

    fileLines.push(`D|${cleanId}|${names.padEnd(40, ' ')}|${salary}|${hireDateFormatted}|${noveltyType}`);
  });

  return fileLines.join('\r\n');
}

export function generateTssPayrollTxt(companyRnc: string, payrollDetails: PayrollDetail[], employeesMap?: Record<string, Employee>): string {
  // Filtrar solo detalles de empleados que cotizan a la TSS
  const eligibleDetails = payrollDetails.filter((dt) => {
    if (employeesMap && employeesMap[dt.employeeId]) {
      const emp = employeesMap[dt.employeeId];
      return emp.cotizaSeguridadSocial !== false && emp.aplicaTSS !== false;
    }
    // Si la suma de retenciones AFP/ARS es 0, no cotiza
    return (dt.afpEmployee + dt.arsEmployee) > 0;
  });

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let fileLines: string[] = [];

  fileLines.push(`H|${companyRnc.padEnd(11, ' ')}|${dateStr}|${eligibleDetails.length}`);

  eligibleDetails.forEach((dt) => {
    const cleanId = dt.nationalId.replace(/\D/g, '').padEnd(11, ' ');
    const grossSalary = Math.round(dt.grossSalary).toString().padStart(10, '0');
    const afp = Math.round(dt.afpEmployee).toString().padStart(8, '0');
    const ars = Math.round(dt.arsEmployee).toString().padStart(8, '0');
    const isr = Math.round(dt.isrEmployee).toString().padStart(8, '0');

    fileLines.push(`D|${cleanId}|${dt.employeeName.padEnd(35, ' ')}|${grossSalary}|${afp}|${ars}|${isr}`);
  });

  return fileLines.join('\r\n');
}

export function downloadTxtFile(filename: string, textContent: string) {
  const element = document.createElement('a');
  const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
