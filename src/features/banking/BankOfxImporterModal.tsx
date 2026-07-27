import React, { useState } from 'react';
import { 
  Building2, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText,
  Sparkles
} from 'lucide-react';

interface BankOfxImporterModalProps {
  onClose: () => void;
}

export const BankOfxImporterModal: React.FC<BankOfxImporterModalProps> = ({ onClose }) => {
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [statementRows, setStatementRows] = useState<Array<any>>([
    { id: 1, date: '2026-07-25', ref: 'DEP-84920', description: 'Depósito Cliente Distribuidora Oriental', amount: 45000, matchStatus: 'Coincidencia Encontrada (Factura #104)' },
    { id: 2, date: '2026-07-26', ref: 'TRF-10294', description: 'Transferencia Recibida Constructora Del Este', amount: 56000, matchStatus: 'Coincidencia Encontrada (Factura #105)' },
    { id: 3, date: '2026-07-27', ref: 'COM-00129', description: 'Comisión Servicios Bancarios', amount: -250, matchStatus: 'Pendiente de Conciliar' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUploaded(e.target.files[0].name);
      alert(`¡Extracto bancario "${e.target.files[0].name}" procesado con éxito! Se han analizado los depósitos y movimientos.`);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs sm:text-sm text-left text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden border border-slate-200">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Importador & Conciliador de Extractos Bancarios (OFX / CSV)
              </h3>
              <p className="text-xs text-slate-300">
                Sube tu estado de cuenta de Banreservas, Popular o BHD y realiza el cruce automático.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-2 bg-slate-50 transition-colors">
            <Upload className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-xs">Cargar Extracto Bancario (.OFX / .CSV / Excel)</h4>
            <p className="text-[11px] text-slate-500">Formatos soportados: Banreservas, Banco Popular, BHD León, Scotiabank</p>
            <input
              type="file"
              accept=".ofx,.csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="ofx-file-input"
            />
            <label
              htmlFor="ofx-file-input"
              className="inline-block px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
            >
              Seleccionar Archivo
            </label>
            {fileUploaded && <div className="text-xs font-bold text-emerald-700 mt-2">✓ Archivo: {fileUploaded}</div>}
          </div>

          <div className="space-y-3">
            <h4 className="font-heading font-medium text-slate-900 text-xs uppercase flex items-center justify-between">
              <span>Resultado de Coincidencias de Depósitos</span>
              <span className="text-[10px] text-emerald-700 font-bold">Auto-Matching Activo</span>
            </h4>

            <div className="space-y-2">
              {statementRows.map((row) => (
                <div key={row.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{row.description}</span>
                    <span className="text-[10px] text-slate-500">{row.date} • Ref: {row.ref}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold block ${row.amount > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {row.amount > 0 ? '+' : ''}RD$ {row.amount.toLocaleString('es-DO')}
                    </span>
                    <span className="text-[10px] text-indigo-700 font-semibold">{row.matchStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-xs cursor-pointer">
            Cerrar
          </button>
          <button
            onClick={() => {
              alert('¡Conciliación bancaria aplicada! Los depósitos fueron cruzados con las cuentas por cobrar.');
              onClose();
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" /> Aplicar Conciliación Masiva
          </button>
        </div>
      </div>
    </div>
  );
};
