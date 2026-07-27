import React, { useState } from 'react';
import { 
  Building2, 
  Download, 
  X, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { PayrollPeriod, PayrollDetail } from '../../../types/payroll';

interface AchBankExportModalProps {
  period: PayrollPeriod;
  details: PayrollDetail[];
  onClose: () => void;
}

export const AchBankExportModal: React.FC<AchBankExportModalProps> = ({
  period,
  details,
  onClose,
}) => {
  const [bankTarget, setBankTarget] = useState<'banreservas' | 'popular' | 'bhd'>('banreservas');
  const [companyAccount, setCompanyAccount] = useState('9601482910');

  const periodDetails = details.filter((d) => d.periodId === period.id);

  const handleGenerateAchTxt = () => {
    let txtContent = '';
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    if (bankTarget === 'banreservas') {
      // Formato Oficial Banreservas NetBanking
      txtContent += `HEADER|${companyAccount}|${dateStr}|${period.periodName}|${periodDetails.length}|${period.totalNetSalary.toFixed(2)}\n`;
      periodDetails.forEach((d) => {
        txtContent += `DETAIL|${d.nationalId.replace(/-/g, '')}|${d.employeeName}|${d.accountNumber || '0000000000'}|${d.netSalary.toFixed(2)}|DOP|NOMI\n`;
      });
    } else if (bankTarget === 'popular') {
      // Formato Oficial Banco Popular BPD Cash Management
      txtContent += `01${companyAccount.padStart(15, '0')}${dateStr}${period.totalNetSalary.toFixed(2).replace('.', '').padStart(13, '0')}\n`;
      periodDetails.forEach((d) => {
        const amtStr = d.netSalary.toFixed(2).replace('.', '').padStart(11, '0');
        const accStr = (d.accountNumber || '').padStart(12, '0');
        txtContent += `02${d.nationalId.replace(/-/g, '').padEnd(15, ' ')}${accStr}${amtStr}${d.employeeName.padEnd(30, ' ')}\n`;
      });
    } else {
      // Formato Oficial Banco BHD León Empresarial
      txtContent += `H,${companyAccount},${dateStr},${periodDetails.length},${period.totalNetSalary.toFixed(2)}\n`;
      periodDetails.forEach((d) => {
        txtContent += `D,${d.nationalId.replace(/-/g, '')},"${d.employeeName}",${d.accountNumber || ''},${d.netSalary.toFixed(2)},ACH\n`;
      });
    }

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NOMI_ACH_${bankTarget.toUpperCase()}_${period.periodName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs sm:text-sm text-left text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-slate-200">
        
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Exportador de Pago de Nómina ACH Bancario
              </h3>
              <p className="text-xs text-slate-300">
                Genera el archivo plano oficial formateado para la banca en línea de la R.D.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="font-medium text-slate-700 block">Selecciona el Banco Destino:</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setBankTarget('banreservas')}
                className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                  bankTarget === 'banreservas'
                    ? 'bg-sky-50 border-sky-600 text-sky-900 ring-2 ring-sky-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                🏦 Banreservas
                <span className="block text-[10px] font-normal text-slate-500">NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setBankTarget('popular')}
                className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                  bankTarget === 'popular'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                🏦 Banco Popular
                <span className="block text-[10px] font-normal text-slate-500">BPD Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setBankTarget('bhd')}
                className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                  bankTarget === 'bhd'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                🏦 Banco BHD
                <span className="block text-[10px] font-normal text-slate-500">Internet Banking</span>
              </button>
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">No. Cuenta Origen de la Empresa *</label>
            <input
              type="text"
              value={companyAccount}
              onChange={(e) => setCompanyAccount(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono text-xs"
            />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span>Período a Pagar:</span>
              <span className="font-bold text-slate-900">{period.periodName}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Colaboradores:</span>
              <span className="font-bold text-slate-900">{periodDetails.length} Empleados</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1">
              <span>Monto Total ACH:</span>
              <span>RD$ {period.totalNetSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-xs cursor-pointer">
            Cancelar
          </button>

          <button
            onClick={handleGenerateAchTxt}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" /> Descargar Archivo .TXT ACH
          </button>
        </div>

      </div>
    </div>
  );
};
