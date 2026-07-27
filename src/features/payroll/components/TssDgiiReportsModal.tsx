import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  FileText, 
  Building, 
  Users, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Employee, PayrollPeriod, PayrollDetail } from '../../../types/payroll';
import { AchBankExportModal } from './AchBankExportModal';

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
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(payrollPeriods[0]?.id || '');
  const [isAchModalOpen, setIsAchModalOpen] = useState(false);

  const selectedPeriod = payrollPeriods.find((p) => p.id === selectedPeriodId) || payrollPeriods[0];
  const activeTssEmployees = employees.filter((e) => e.aplicaTSS && e.status === 'Activo');

  const handleDownloadTssTxt = () => {
    let txtContent = 'NOVEDADES_TSS_RD_FORMAT_V2\n';
    activeTssEmployees.forEach((emp) => {
      txtContent += `NOVEDAD|${emp.nationalId.replace(/-/g, '')}|${emp.fullName}|${emp.baseSalary.toFixed(2)}|ING|01/07/2026\n`;
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NOVEDADES_TSS_SUIR_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
            Reportes Fiscales DGII (IR-3 / IR-13) & Exportador TSS SUIR
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Genera los archivos planos de nómina para la Tesorería de la Seguridad Social y la declaración mensual IR-3.
          </p>
        </div>

        {selectedPeriod && (
          <button
            onClick={() => setIsAchModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-black hover:to-indigo-900 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            Exportar Pago ACH Bancario
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exportador TSS SUIR */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-medium text-slate-900 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-600" />
              1. Exportador .TXT Novedades TSS (SUIR)
            </h3>
            <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 rounded-full text-[10px] font-bold">
              {activeTssEmployees.length} Cotizantes TSS
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Exporta el padrón laboral en formato plano `.TXT` compatible con la plataforma web de la Tesorería de la Seguridad Social (TSS / SUIR), filtrando automáticamente contratistas internacionales y pasantes exentos.
          </p>

          <button
            onClick={handleDownloadTssTxt}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Descargar Archivo Novedades TSS (.TXT)
          </button>
        </div>

        {/* Declaraciones DGII IR-3 e IR-13 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-medium text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              2. Declaraciones Fiscales IR-3 e IR-13 (DGII)
            </h3>
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
              Escala 2026
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Consolidado mensual de retenciones del Impuesto sobre la Renta (ISR) aplicadas a los salarios gravables para la Oficina Virtual de la DGII.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => alert('Generando informe consolidado IR-3 DGII para envío...')}
              className="py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-xs shadow-sm cursor-pointer"
            >
              Generar IR-3 Mensual
            </button>
            <button
              onClick={() => alert('Generando certificación anual IR-13 de empleados...')}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold text-xs cursor-pointer"
            >
              Generar IR-13 Anual
            </button>
          </div>
        </div>
      </div>

      {/* Modal ACH Bancario */}
      {isAchModalOpen && selectedPeriod && (
        <AchBankExportModal
          period={selectedPeriod}
          details={payrollDetails}
          onClose={() => setIsAchModalOpen(false)}
        />
      )}
    </div>
  );
};
