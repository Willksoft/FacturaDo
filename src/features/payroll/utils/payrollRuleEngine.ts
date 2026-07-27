import { Employee, LaborProfile, PayrollRule, LaborProfileId } from '../../../types/payroll';

/**
 * CATÁLOGO PREDETERMINADO DE PERFILES LABORALES
 */
export const DEFAULT_LABOR_PROFILES: LaborProfile[] = [
  {
    id: 'fijo',
    name: 'Empleado Fijo (Ordinario R.D.)',
    description: 'Empleado permanente con todas las obligaciones de TSS, ISR, INFOTEP, Regalía y Cesantía.',
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
    motivoExencionDefault: 'Ninguno'
  },
  {
    id: 'temporal',
    name: 'Empleado Temporal / Eventual',
    description: 'Empleado por tiempo determinado. Aplica TSS, ISR y Vacaciones, pero sin Cesantía.',
    aplicaISR: true,
    aplicaTSS: true,
    aplicaAFP: true,
    aplicaARS: true,
    aplicaINFOTEP: true,
    aplicaRegalia: true,
    aplicaCesantia: false,
    aplicaVacaciones: true,
    aplicaPrestaciones: false,
    cotizaSeguridadSocial: true,
    esExentoImpuestos: false,
    motivoExencionDefault: 'Ninguno'
  },
  {
    id: 'extranjero',
    name: 'Trabajador Extranjero con Permiso',
    description: 'Extranjero registrado en TSS con permiso temporal de trabajo.',
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
    motivoExencionDefault: 'Ninguno'
  },
  {
    id: 'contratista',
    name: 'Contratista Independiente / Honorarios',
    description: 'Sin relación de dependencia laboral. No cotiza a TSS ni aplican prestaciones ni INFOTEP.',
    aplicaISR: false,
    aplicaTSS: false,
    aplicaAFP: false,
    aplicaARS: false,
    aplicaINFOTEP: false,
    aplicaRegalia: false,
    aplicaCesantia: false,
    aplicaVacaciones: false,
    aplicaPrestaciones: false,
    cotizaSeguridadSocial: false,
    esExentoImpuestos: true,
    motivoExencionDefault: 'Empresa Extranjera'
  },
  {
    id: 'remoto_internacional',
    name: 'Personal Remoto Internacional',
    description: 'Contratado en el extranjero. Exento de retenciones dominicanas (TSS/ISR) y excluido de reportes.',
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
    motivoExencionDefault: 'Convenio Internacional'
  },
  {
    id: 'consultor',
    name: 'Consultor Profesional',
    description: 'Pagos por servicios profesionales o asesoría técnica.',
    aplicaISR: true, // Retención de ISR servicios si aplica
    aplicaTSS: false,
    aplicaAFP: false,
    aplicaARS: false,
    aplicaINFOTEP: false,
    aplicaRegalia: false,
    aplicaCesantia: false,
    aplicaVacaciones: false,
    aplicaPrestaciones: false,
    cotizaSeguridadSocial: false,
    esExentoImpuestos: false,
    motivoExencionDefault: 'Ninguno'
  },
  {
    id: 'pasante',
    name: 'Pasante / Aprendiz INFOTEP',
    description: 'Asignación por estipendio educativo. Exento de ISR y Cesantía.',
    aplicaISR: false,
    aplicaTSS: true,
    aplicaAFP: true,
    aplicaARS: true,
    aplicaINFOTEP: false,
    aplicaRegalia: true,
    aplicaCesantia: false,
    aplicaVacaciones: true,
    aplicaPrestaciones: false,
    cotizaSeguridadSocial: true,
    esExentoImpuestos: true,
    motivoExencionDefault: 'Temporal'
  }
];

/**
 * REGLAS INTELIGENTES PREDETERMINADAS DEL MOTOR
 */
export const DEFAULT_PAYROLL_RULES: PayrollRule[] = [
  {
    id: 'rule-extranjero-contratista',
    name: 'Regla 1: Contratista Internacional Extranjero',
    description: 'Si la nacionalidad es Extranjera y el estatus es Contratista Internacional, desactivar todas las retenciones y TSS.',
    isActive: true,
    conditionNationality: 'Extranjera',
    conditionMigratoryStatus: 'Contratista Internacional',
    setAplicaISR: false,
    setAplicaTSS: false,
    setAplicaAFP: false,
    setAplicaARS: false,
    setAplicaINFOTEP: false,
    setAplicaRegalia: false,
    setAplicaCesantia: false,
    setCotizaSeguridadSocial: false,
    setEsExentoImpuestos: true
  },
  {
    id: 'rule-pasaporte-honorarios',
    name: 'Regla 2: Pasaporte Honorarios / Servicios',
    description: 'Si posee Pasaporte y Contrato por Honorarios, desactivar TSS, AFP, ARS y prestaciones.',
    isActive: true,
    conditionIdentityDocType: 'Pasaporte',
    conditionContractType: 'Honorarios',
    setAplicaTSS: false,
    setAplicaAFP: false,
    setAplicaARS: false,
    setAplicaRegalia: false,
    setAplicaCesantia: false,
    setCotizaSeguridadSocial: false
  }
];

/**
 * Motor Evaluador de Reglas Inteligentes
 * Toma un empleado y el listado de reglas activas y devuelve las banderas fiscales resultantes.
 */
export function evaluateEmployeePayrollRules(employee: Employee, rules: PayrollRule[]) {
  const result = {
    aplicaISR: employee.aplicaISR,
    aplicaTSS: employee.aplicaTSS,
    aplicaAFP: employee.aplicaAFP,
    aplicaARS: employee.aplicaARS,
    aplicaINFOTEP: employee.aplicaINFOTEP,
    aplicaRegalia: employee.aplicaRegalia,
    aplicaCesantia: employee.aplicaCesantia,
    cotizaSeguridadSocial: employee.cotizaSeguridadSocial,
    esExentoImpuestos: employee.esExentoImpuestos
  };

  const activeRules = rules.filter((r) => r.isActive);

  activeRules.forEach((rule) => {
    let match = true;

    if (rule.conditionNationality && rule.conditionNationality !== 'Cualquiera' && rule.conditionNationality !== employee.nationality) {
      match = false;
    }
    if (rule.conditionMigratoryStatus && rule.conditionMigratoryStatus !== 'Cualquiera' && rule.conditionMigratoryStatus !== employee.migratoryStatus) {
      match = false;
    }
    if (rule.conditionContractType && rule.conditionContractType !== 'Cualquiera' && rule.conditionContractType !== employee.contractType) {
      match = false;
    }
    if (rule.conditionIdentityDocType && rule.conditionIdentityDocType !== 'Cualquiera' && rule.conditionIdentityDocType !== employee.identityDocType) {
      match = false;
    }

    if (match) {
      if (rule.setAplicaISR !== undefined) result.aplicaISR = rule.setAplicaISR;
      if (rule.setAplicaTSS !== undefined) result.aplicaTSS = rule.setAplicaTSS;
      if (rule.setAplicaAFP !== undefined) result.aplicaAFP = rule.setAplicaAFP;
      if (rule.setAplicaARS !== undefined) result.aplicaARS = rule.setAplicaARS;
      if (rule.setAplicaINFOTEP !== undefined) result.aplicaINFOTEP = rule.setAplicaINFOTEP;
      if (rule.setAplicaRegalia !== undefined) result.aplicaRegalia = rule.setAplicaRegalia;
      if (rule.setAplicaCesantia !== undefined) result.aplicaCesantia = rule.setAplicaCesantia;
      if (rule.setCotizaSeguridadSocial !== undefined) result.cotizaSeguridadSocial = rule.setCotizaSeguridadSocial;
      if (rule.setEsExentoImpuestos !== undefined) result.esExentoImpuestos = rule.setEsExentoImpuestos;
    }
  });

  return result;
}
