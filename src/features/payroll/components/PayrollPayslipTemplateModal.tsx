import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  Check, 
  Building, 
  User, 
  Layers, 
  Sliders, 
  FileText, 
  CheckSquare, 
  Sparkles,
  CreditCard,
  LayoutGrid
} from 'lucide-react';
import { Employee, PayrollDetail, PayrollPeriod } from '../../../types/payroll';

interface PayrollPayslipTemplateModalProps {
  period: PayrollPeriod;
  details: PayrollDetail[];
  employees: Employee[];
  onClose: () => void;
}

export const PayrollPayslipTemplateModal: React.FC<PayrollPayslipTemplateModalProps> = ({
  period,
  details,
  employees,
  onClose,
}) => {
  const [printFormat, setPrintFormat] = useState<'check-3-per-page' | 'check-single' | 'letter-full'>('check-3-per-page');
  const [printScope, setPrintScope] = useState<'all' | 'single'>('all');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(details[0]?.employeeId || '');
  const [companyName, setCompanyName] = useState('FacturaDo S.R.L.');
  const [companyRnc, setCompanyRnc] = useState('1-31-00000-1');
  const [showLogo, setShowLogo] = useState(true);
  const [accentColor, setAccentColor] = useState('#0f172a'); // Slate 900

  const periodDetails = details.filter((d) => d.periodId === period.id);

  const activeDetails = printScope === 'all'
    ? periodDetails
    : periodDetails.filter((d) => d.employeeId === selectedEmployeeId);

  const handlePrintBatch = () => {
    let payslipsHtml = '';

    if (printFormat === 'check-3-per-page') {
      // Agrupar de a 3 recibos por página
      for (let i = 0; i < activeDetails.length; i += 3) {
        const chunk = activeDetails.slice(i, i + 3);
        const chunkHtml = chunk.map((d) => generateCheckVoucherHtml(d, true)).join('');
        payslipsHtml += `
          <div style="page-break-after: always; padding: 10px; box-sizing: border-box; min-height: 98vh; display: flex; flex-direction: column; justify-content: space-between;">
            ${chunkHtml}
          </div>
        `;
      }
    } else if (printFormat === 'check-single') {
      payslipsHtml = activeDetails.map((d) => `
        <div style="page-break-after: always; padding: 20px;">
          ${generateCheckVoucherHtml(d, false)}
        </div>
      `).join('');
    } else {
      // Formato carta completo
      payslipsHtml = activeDetails.map((d) => `
        <div style="page-break-after: always; padding: 30px;">
          ${generateLetterPayslipHtml(d)}
        </div>
      `).join('');
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Volantes de Pago - ${period.periodName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #1e293b; font-size: 12px; }
            @media print {
              @page { size: letter; margin: 8mm; }
              body { background: #fff; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${payslipsHtml}
        </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(fullHtml);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  const generateCheckVoucherHtml = (d: PayrollDetail, isTripleLayout: boolean) => {
    return `
      <div style="border: 1.5px dashed #94a3b8; border-radius: 8px; padding: 12px; background: #ffffff; margin-bottom: 12px; box-sizing: border-box; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${accentColor}; padding-bottom: 6px; margin-bottom: 8px;">
          <div>
            <span style="font-weight: bold; font-size: 13px; color: ${accentColor}; text-transform: uppercase;">${companyName}</span>
            <span style="font-size: 10px; color: #64748b; margin-left: 8px;">RNC: ${companyRnc} • VOLANTE DE NÓMINA (TAMAÑO CHEQUE)</span>
          </div>
          <div style="text-align: right; font-size: 10px; font-weight: bold; color: #0f172a;">
            PERÍODO: ${period.periodName}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; background: #f8fafc; padding: 6px; border-radius: 4px;">
          <div>
            <strong>EMPLEADO:</strong> ${d.employeeName}<br/>
            <strong>CÉDULA:</strong> ${d.nationalId} | <strong>CARGO:</strong> ${d.jobTitle}
          </div>
          <div style="text-align: right;">
            <strong>BANCO:</strong> ${d.paymentBank || 'N/A'}<br/>
            <strong>CUENTA:</strong> ${d.accountNumber || 'N/A'}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 8px;">
          <thead>
            <tr style="background: #f1f5f9; text-transform: uppercase; font-size: 9.5px;">
              <th style="padding: 4px; text-align: left;">Sueldo Bruto</th>
              <th style="padding: 4px; text-align: right; color: #dc2626;">AFP (2.87%)</th>
              <th style="padding: 4px; text-align: right; color: #dc2626;">ARS (3.04%)</th>
              <th style="padding: 4px; text-align: right; color: #dc2626;">ISR DGII</th>
              <th style="padding: 4px; text-align: right; color: #dc2626;">Otr. Ded.</th>
              <th style="padding: 4px; text-align: right; font-weight: bold; color: #15803d; background: #dcfce7;">NETO RECIBIDO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 4px; font-weight: bold;">RD$ ${d.grossSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 4px; text-align: right;">RD$ ${d.afpEmployee.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 4px; text-align: right;">RD$ ${d.arsEmployee.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 4px; text-align: right;">RD$ ${d.isrEmployee.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 4px; text-align: right;">RD$ ${d.otherDeductions.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 4px; text-align: right; font-weight: bold; color: #15803d; font-size: 12px; background: #f0fdf4;">RD$ ${d.netSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 9.5px; margin-top: 10px;">
          <div style="width: 40%; border-top: 1px solid #94a3b8; text-align: center; padding-top: 2px;">
            Firma Entregado (Recursos Humanos)
          </div>
          <div style="width: 40%; border-top: 1px solid #94a3b8; text-align: center; padding-top: 2px;">
            Firma Recibido Conforme (${d.employeeName})
          </div>
        </div>
      </div>
    `;
  };

  const generateLetterPayslipHtml = (d: PayrollDetail) => {
    return `
      <div style="max-width: 750px; margin: 0 auto; font-family: Arial, sans-serif; color: #1e293b; border: 1px solid #cbd5e1; padding: 30px; border-radius: 12px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid ${accentColor}; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; color: ${accentColor}; text-transform: uppercase;">${companyName}</h2>
            <p style="margin: 3px 0 0; font-size: 11px; color: #64748b;">RNC: ${companyRnc} • Comprobante Oficial de Nómina</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin: 0; font-size: 14px;">RECIBO DE NÓMINA</h3>
            <p style="margin: 3px 0 0; font-size: 11px; color: #64748b;">${period.periodName}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 11.5px; margin-bottom: 20px;">
          <div>
            <strong>Colaborador:</strong> ${d.employeeName}<br/>
            <strong>Documento Identidad:</strong> ${d.nationalId}<br/>
            <strong>Cargo:</strong> ${d.jobTitle}
          </div>
          <div>
            <strong>Departamento:</strong> ${d.department}<br/>
            <strong>Banco / Método:</strong> ${d.paymentBank || 'Transferencia'}<br/>
            <strong>No. Cuenta:</strong> ${d.accountNumber || 'Registrada'}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11.5px;">
          <thead>
            <tr style="background: ${accentColor}; color: #ffffff; text-transform: uppercase; font-size: 10px;">
              <th style="padding: 8px; text-align: left;">Concepto</th>
              <th style="padding: 8px; text-align: right;">Ingresos (DOP)</th>
              <th style="padding: 8px; text-align: right;">Deducciones (DOP)</th>
            </tr>
          </thead>
          <tbody style="border-bottom: 1px solid #e2e8f0;">
            <tr>
              <td style="padding: 8px;">Salario Ordinario del Período</td>
              <td style="padding: 8px; text-align: right;">RD$ ${d.baseSalaryPeriod.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 8px; text-align: right;">-</td>
            </tr>
            ${d.overtimePay > 0 ? `<tr><td style="padding: 8px;">Horas Extras / Adicionales</td><td style="padding: 8px; text-align: right;">RD$ ${d.overtimePay.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td><td style="padding: 8px; text-align: right;">-</td></tr>` : ''}
            <tr>
              <td style="padding: 8px;">Aporte AFP Empleado (2.87%)</td>
              <td style="padding: 8px; text-align: right;">-</td>
              <td style="padding: 8px; text-align: right; color: #dc2626;">RD$ ${d.afpEmployee.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Aporte ARS Empleado (3.04%)</td>
              <td style="padding: 8px; text-align: right;">-</td>
              <td style="padding: 8px; text-align: right; color: #dc2626;">RD$ ${d.arsEmployee.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
            </tr>
            ${d.isrEmployee > 0 ? `<tr><td style="padding: 8px;">Impuesto sobre la Renta (ISR DGII)</td><td style="padding: 8px; text-align: right;">-</td><td style="padding: 8px; text-align: right; color: #dc2626;">RD$ ${d.isrEmployee.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td></tr>` : ''}
            ${d.otherDeductions > 0 ? `<tr><td style="padding: 8px;">Otras Deducciones / Préstamos</td><td style="padding: 8px; text-align: right;">-</td><td style="padding: 8px; text-align: right; color: #dc2626;">RD$ ${d.otherDeductions.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td></tr>` : ''}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background: #f1f5f9;">
              <td style="padding: 8px;">SUBTOTALES:</td>
              <td style="padding: 8px; text-align: right;">RD$ ${d.grossSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 8px; text-align: right; color: #dc2626;">RD$ ${d.totalDeductions.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr style="font-size: 13px; font-weight: bold; background: #dcfce7; color: #15803d;">
              <td style="padding: 10px;" colSpan="2">MONTO NETO DEPOSITADO / RECIBIDO:</td>
              <td style="padding: 10px; text-align: right;">RD$ ${d.netSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 60px; display: flex; justify-content: space-between; text-align: center; font-size: 11px;">
          <div style="width: 45%; border-top: 1px solid #0f172a; padding-top: 5px;">
            <strong>Recursos Humanos / Empresa</strong>
          </div>
          <div style="width: 45%; border-top: 1px solid #0f172a; padding-top: 5px;">
            <strong>Recibido Conforme (${d.employeeName})</strong>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs sm:text-sm text-left text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Impresor & Diseñador de Volantes de Pago de Nómina
              </h3>
              <p className="text-xs text-slate-300">
                Personaliza el diseño con logo, selecciona el formato cheque o carta e imprime en lote.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel de Configuración e Impresión */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opciones de Formato & Lote */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                1. Formato y Tamaño de Impresión
              </h4>

              <div className="space-y-2">
                <label className="font-medium text-slate-700 block">Estilo de Plantilla:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrintFormat('check-3-per-page')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      printFormat === 'check-3-per-page'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs">🎟️ Cheque / Voucher</span>
                    <span className="text-[10px] opacity-80">(3 por página)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintFormat('check-single')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      printFormat === 'check-single'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs">🎟️ Cheque Único</span>
                    <span className="text-[10px] opacity-80">(1 por hoja)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintFormat('letter-full')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      printFormat === 'letter-full'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs">📄 Formato Carta</span>
                    <span className="text-[10px] opacity-80">(Detallado)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="font-medium text-slate-700 block">Modo de Selección:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrintScope('all')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold cursor-pointer ${
                      printScope === 'all'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    📦 Toda la Nómina en Lote ({periodDetails.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintScope('single')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold cursor-pointer ${
                      printScope === 'single'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    👤 Empleado Específico
                  </button>
                </div>

                {printScope === 'single' && (
                  <div className="pt-2">
                    <label className="font-medium text-slate-700 block mb-1">Seleccionar Colaborador:</label>
                    <select
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      {periodDetails.map((d) => (
                        <option key={d.employeeId} value={d.employeeId}>
                          {d.employeeName} ({d.nationalId})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Opciones de Personalización Corporativa */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                2. Personalización Corporativa (Logo y Colores)
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nombre Comercial Empresa</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">RNC Institucional</label>
                  <input
                    type="text"
                    value={companyRnc}
                    onChange={(e) => setCompanyRnc(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={showLogo}
                      onChange={(e) => setShowLogo(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>Mostrar Logo Institucional en Encabezado</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Container */}
          <div className="space-y-3">
            <h4 className="font-heading font-medium text-slate-900 text-xs uppercase flex items-center justify-between">
              <span>Vista Previa del Volante ({activeDetails.length} Comprobantes)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {printFormat === 'check-3-per-page' ? 'Ahorro de Papel (3 por hoja)' : 'Página individual'}
              </span>
            </h4>

            <div className="bg-slate-100 border border-slate-300 p-4 rounded-2xl max-h-[320px] overflow-y-auto space-y-3 shadow-inner">
              {activeDetails.slice(0, 2).map((d) => (
                <div
                  key={d.id}
                  className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900">{companyName}</span>
                    <span className="text-[10px] font-mono text-slate-500">RNC: {companyRnc}</span>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{d.employeeName}</span>
                      <span className="text-[10px] text-slate-500">{d.jobTitle} • Céd: {d.nationalId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Salario Neto:</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">RD$ {d.netSalary.toLocaleString('es-DO')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            {printScope === 'all' ? `Impresión en Lote: ${activeDetails.length} volantes` : `Impresión Individual`}
          </span>

          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-xs cursor-pointer">
              Cancelar
            </button>
            <button
              onClick={handlePrintBatch}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" /> Generar & Imprimir PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
