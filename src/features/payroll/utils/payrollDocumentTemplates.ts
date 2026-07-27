import { Employee } from '../../../types/payroll';

export function generateEmploymentContractHtml(employee: Employee, companyName = 'FacturaDo S.R.L.', companyRnc = '1-31-00000-1'): string {
  const dateStr = new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
    <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #1e293b; padding: 30px; max-w: 800px; margin: 0 auto; border: 1px solid #e2e8f0;">
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px;">
        <h2 style="margin: 0; text-transform: uppercase; letter-spacing: 1px; color: #0f172a;">CONTRATO INDIVIDUAL DE TRABAJO</h2>
        <p style="margin: 5px 0 0; font-size: 11px; color: #64748b;">Código Ley 16-92 • República Dominicana</p>
      </div>

      <p><strong>ENTRE:</strong> Por una parte, la empresa <strong>${companyName}</strong>, titular del RNC No. <strong>${companyRnc}</strong>, con su domicilio social principal en la República Dominicana (en lo adelante denominada "EL EMPLEADOR"); y por la otra parte, el señor(a) <strong>${employee.fullName}</strong>, de nacionalidad ${employee.nationality}, portador(a) del documento de identidad <strong>${employee.identityDocType} No. ${employee.nationalId}</strong>, domiciliado(a) en ${employee.address}, ${employee.province} (en lo adelante denominado(a) "EL EMPLEADO").</p>

      <h3 style="font-size: 14px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-top: 20px;">CLÁUSULAS CONTRATUALES</h3>

      <p><strong>PRIMERA (Objeto del Contrato):</strong> EL EMPLEADO es contratado para desempeñar las funciones de <strong>${employee.jobTitle}</strong> en el departamento de <strong>${employee.department}</strong>, comprometiéndose a poner toda su capacidad de trabajo y diligencia al servicio de EL EMPLEADOR.</p>

      <p><strong>SEGUNDA (Modalidad de Contratación):</strong> El presente contrato se suscribe bajo la modalidad de <strong>${employee.contractType}</strong>, iniciando sus labores a partir de la fecha <strong>${employee.hireDate}</strong>.</p>

      <p><strong>TERCERA (Remuneración y Forma de Pago):</strong> EL EMPLEADOR pagará a EL EMPLEADO un salario base ordinario de <strong>RD$ ${employee.baseSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })} DOP</strong> mensuales, pagaderos en cuotas ${employee.shiftType === 'Flexible' ? 'quincenales' : 'quincenales'} mediante ${employee.paymentMethod} en la cuenta No. ${employee.accountNumber || 'registrada'} de ${employee.bankName}.</p>

      <p><strong>CUARTA (Obligaciones Fiscales y TSS):</strong> Las partes convienen que la retención e ingreso del Impuesto sobre la Renta (ISR) y las cotizaciones a la Tesorería de la Seguridad Social (TSS: AFP/ARS) se realizarán de conformidad con el perfil fiscal asignado (Perfil: ${employee.laborProfileId}).</p>

      <p>Hecho y firmado de buena fe en dos (2) originales de un mismo tenor y efecto en Santo Domingo, República Dominicana, a los ${dateStr}.</p>

      <div style="margin-top: 70px; display: flex; justify-content: space-between; text-align: center;">
        <div style="width: 45%; border-top: 1px solid #0f172a; pt: 8px;">
          <p style="margin: 0; font-weight: bold;">${companyName}</p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">EL EMPLEADOR (Firma y Sello)</p>
        </div>
        <div style="width: 45%; border-top: 1px solid #0f172a; pt: 8px;">
          <p style="margin: 0; font-weight: bold;">${employee.fullName}</p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">EL EMPLEADO (Firma y Cédula)</p>
        </div>
      </div>
    </div>
  `;
}

export function generateDismissalLetterHtml(
  employee: Employee, 
  exitReason: string, 
  totalSeveranceAmount: number,
  companyName = 'FacturaDo S.R.L.'
): string {
  const dateStr = new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
    <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #1e293b; padding: 30px; max-w: 800px; margin: 0 auto; border: 1px solid #e2e8f0;">
      <div style="text-align: right; margin-bottom: 30px;">
        <p style="margin: 0; font-weight: bold;">Santo Domingo, R.D.</p>
        <p style="margin: 0; color: #64748b;">${dateStr}</p>
      </div>

      <p>Señor(a):<br/><strong>${employee.fullName}</strong><br/>${employee.jobTitle} - ${employee.department}<br/>${employee.identityDocType}: ${employee.nationalId}</p>

      <p style="margin-top: 25px;"><strong>ASUNTO: COMUNICACIÓN OFICIAL DE TÉRMINO DE CONTRATO Y LIQUIDACIÓN LABORAL</strong></p>

      <p>Por medio de la presente, le notificamos formalmente la decisión de la empresa <strong>${companyName}</strong> de dar por terminado el contrato de trabajo que le vinculaba con la institución, efectivo a partir de la fecha de recepción de la presente comunicación, bajo el motivo de: <strong>${exitReason}</strong>.</p>

      <p>Agradecemos sinceramente los servicios prestados durante su permanencia en la empresa desde su fecha de ingreso en <strong>${employee.hireDate}</strong>.</p>

      <p>Le informamos que sus valores correspondientes a Prestaciones Laborales (Preaviso, Cesantía, Vacaciones no disfrutadas y Regalía Pascual) según los Artículos 76 y 80 de la Ley 16-92 del Código de Trabajo de la República Dominicana, ascienden al monto total de <strong>RD$ ${totalSeveranceAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })} DOP</strong>, los cuales estarán disponibles para entrega mediante cheque o transferencia bancaria en la fecha legalmente establecida.</p>

      <div style="margin-top: 80px; display: flex; justify-content: space-between; text-align: center;">
        <div style="width: 45%; border-top: 1px solid #0f172a; pt: 8px;">
          <p style="margin: 0; font-weight: bold;">Recursos Humanos</p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">${companyName}</p>
        </div>
        <div style="width: 45%; border-top: 1px solid #0f172a; pt: 8px;">
          <p style="margin: 0; font-weight: bold;">${employee.fullName}</p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">Recibido Conforme (Firma y Fecha)</p>
        </div>
      </div>
    </div>
  `;
}

export function generateResignationLetterHtml(employee: Employee, companyName = 'FacturaDo S.R.L.'): string {
  const dateStr = new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
    <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #1e293b; padding: 30px; max-w: 800px; margin: 0 auto; border: 1px solid #e2e8f0;">
      <div style="text-align: right; margin-bottom: 30px;">
        <p style="margin: 0;">Santo Domingo, R.D., ${dateStr}</p>
      </div>

      <p>Señores:<br/><strong>${companyName}</strong><br/>Atención: Dirección de Recursos Humanos</p>

      <p style="margin-top: 25px;"><strong>ASUNTO: CARTA DE RENUNCIA VOLUNTARIA</strong></p>

      <p>Por medio de la presente, yo, <strong>${employee.fullName}</strong>, portador(a) del documento de identidad <strong>${employee.identityDocType} No. ${employee.nationalId}</strong>, quien me he desempeñado como <strong>${employee.jobTitle}</strong> en el departamento de ${employee.department}, presento formalmente mi RENUNCIA VOLUNTARIA a las funciones que he venido ejerciendo en esta empresa.</p>

      <p>Expreso mi más sincero agradecimiento por la oportunidad brindada y por el excelente ambiente de trabajo durante mi gestión laboral.</p>

      <div style="margin-top: 80px; text-align: center;">
        <div style="width: 50%; margin: 0 auto; border-top: 1px solid #0f172a; pt: 8px;">
          <p style="margin: 0; font-weight: bold;">${employee.fullName}</p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">${employee.identityDocType}: ${employee.nationalId}</p>
        </div>
      </div>
    </div>
  `;
}

export function generateSalaryCertificateHtml(employee: Employee, companyName = 'FacturaDo S.R.L.', companyRnc = '1-31-00000-1'): string {
  const dateStr = new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
    <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #1e293b; padding: 35px; max-w: 800px; margin: 0 auto; border: 1px solid #e2e8f0;">
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 30px;">
        <h2 style="margin: 0; text-transform: uppercase; color: #0f172a;">${companyName}</h2>
        <p style="margin: 3px 0 0; font-size: 11px; font-mono; color: #64748b;">RNC: ${companyRnc} • Certificación Laboral y Salarial</p>
      </div>

      <p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px;">A QUIEN PUEDA INTERESAR</p>

      <p style="text-align: justify; text-indent: 30px;">Por medio de la presente, certificamos que el señor(a) <strong>${employee.fullName}</strong>, de nacionalidad ${employee.nationality}, portador(a) de la <strong>${employee.identityDocType} No. ${employee.nationalId}</strong>, labora para nuestra institución desde el <strong>${employee.hireDate}</strong>, desempeñando libre y activamente el cargo de <strong>${employee.jobTitle}</strong> en el departamento de <strong>${employee.department}</strong>.</p>

      <p style="text-align: justify; text-indent: 30px;">Certificamos que devenga un salario devengado mensual ordinario bruto de <strong>RD$ ${employee.baseSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })} DOP</strong> (pesos dominicanos), percibidos mediante ${employee.paymentMethod}.</p>

      <p style="text-align: justify; text-indent: 30px;">Se expide la presente certificación a solicitud de parte interesada, en la ciudad de Santo Domingo, República Dominicana, a los ${dateStr}.</p>

      <div style="margin-top: 90px; text-align: center;">
        <div style="width: 50%; margin: 0 auto; border-top: 1px solid #0f172a; pt: 8px;">
          <p style="margin: 0; font-weight: bold;">Gerencia de Recursos Humanos</p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">${companyName} (Sello Oficial)</p>
        </div>
      </div>
    </div>
  `;
}
