import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Building, 
  CheckCircle2, 
  Printer, 
  Layers
} from 'lucide-react';
import { Employee, PayrollPeriod, PayrollDetail } from '../../../types/payroll';
import { generateTssNovedadesTxt, generateTssPayrollTxt, downloadTxtFile } from '../utils/tssFileGenerator';

interface TssDgiiReportsModalProps {
  employees: Employee[];
  payrollPeriods: PayrollPeriod[];
  payrollDetails: PayrollDetail[];
}

export const TssDgiiReportsModal: React.FC<TssDgiiReportsModalProps> = ({
  employees,
  payrollPeriods,
  payrollDetails,
}) => {
  const [companyRnc, setCompanyRnc] = useState('131000001');

  const handleDownloadTssNovedades = () => {
    const txtContent = generateTssNovedadesTxt(companyRnc, employees);
    downloadTxtFile(`TSS_NOVEDADES_${companyRnc}_${new Date().toISOString().slice(0, 10)}.txt`, txtContent);
  };

  const handleDownloadTssPayroll = () => {
    const txtContent = generateTssPayrollTxt(companyRnc, payrollDetails);
    downloadTxtFile(`TSS_NOMINA_${companyRnc}_${new Date().toISOString().slice(0, 10)}.txt`, txtContent);
  };

  const totalAfp = payrollPeriods.reduce((acc, curr) => acc + curr.totalAfpEmployee + curr.totalAfpEmployer, 0);
  const totalArs = payrollPeriods.reduce((acc, curr) => acc + curr.totalArsEmployee + curr.totalArsEmployer, 0);
  const totalIsr = payrollPeriods.reduce((acc, curr) => acc + curr.totalIsr, 0);
  const totalInfotep = payrollPeriods.reduce((acc, curr) => acc + curr.totalInfotepEmployer, 0);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Reportes Oficiales TSS, DGII & INFOTEP (República Dominicana)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generador de archivos de texto (.txt) para la Tesorería de la Seguridad Social y retenciones fiscales IR-3.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="RNC Empresa"
            value={companyRnc}
            onChange={(e) => setCompanyRnc(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
          />
        </div>
      </div>

      {/* Grid de Exportación Oficial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TSS Export Card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-heading font-medium text-slate-900">
                Archivos Planos TSS (Ley 87-01)
              </h2>
              <span className="text-xs text-slate-500">Formatos TXT para subir a la SUIR de TSS</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Genera automáticamente los archivos de novedades de empleados (entradas, salidas, cambios salariales) y montos cotizables de AFP/ARS.
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleDownloadTssNovedades}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Descargar Archivo Novedades TSS (.TXT)
            </button>

            <button
              onClick={handleDownloadTssPayroll}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Descargar Reporte Nómina Cotizable TSS (.TXT)
            </button>
          </div>
        </div>

        {/* DGII & INFOTEP Summary Card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-heading font-medium text-slate-900">
                Resumen DGII (IR-3) & INFOTEP (1%)
              </h2>
              <span className="text-xs text-slate-500">Retenciones fiscales acumuladas</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono pt-2">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span>Total Retenido ISR (DGII IR-3):</span>
              <span className="font-bold text-slate-900">RD$ {totalIsr.toLocaleString('es-DO')}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span>Aportes Totales AFP (Empleado + Patrono):</span>
              <span className="font-bold text-slate-900">RD$ {totalAfp.toLocaleString('es-DO')}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span>Aportes Totales ARS (Empleado + Patrono):</span>
              <span className="font-bold text-slate-900">RD$ {totalArs.toLocaleString('es-DO')}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span>Aporte Patronal INFOTEP (1%):</span>
              <span className="font-bold text-slate-900">RD$ {totalInfotep.toLocaleString('es-DO')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
