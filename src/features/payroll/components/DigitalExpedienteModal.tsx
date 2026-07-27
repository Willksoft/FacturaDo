import React, { useState } from 'react';
import { 
  FolderOpen, 
  FileText, 
  Upload, 
  Trash2, 
  X, 
  Check, 
  ExternalLink, 
  Building, 
  User, 
  ShieldCheck, 
  Calendar,
  FileCheck
} from 'lucide-react';
import { Employee, EmployeeDocument } from '../../../types/payroll';

interface DigitalExpedienteModalProps {
  employee: Employee;
  documents: EmployeeDocument[];
  onAddDocument: (doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
  onDeleteDocument: (id: string) => void;
  onClose: () => void;
}

export const DigitalExpedienteModal: React.FC<DigitalExpedienteModalProps> = ({
  employee,
  documents,
  onAddDocument,
  onDeleteDocument,
  onClose,
}) => {
  const [docType, setDocType] = useState<EmployeeDocument['type']>('Contrato');
  const [docTitle, setDocTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');

  const empDocs = documents.filter((d) => d.employeeId === employee.id);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    onAddDocument({
      employeeId: employee.id,
      type: docType,
      title: docTitle,
      fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      notes
    });

    setDocTitle('');
    setFileUrl('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs sm:text-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-heading font-medium text-slate-900">
                Expediente Digital: {employee.fullName}
              </h3>
              <p className="text-xs text-slate-500">
                Cédula: {employee.nationalId} • Cargo: {employee.jobTitle} ({employee.department})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Subir Documento Form */}
          <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
            <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              Adjuntar Nuevo Documento Digital
            </h4>

            <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Tipo de Documento</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Contrato">Contrato de Trabajo</option>
                  <option value="Cedula">Cédula o Pasaporte</option>
                  <option value="Curriculum">Curriculum Vitae (CV)</option>
                  <option value="CertificadoMedico">Certificado Médico</option>
                  <option value="Titulo">Título Académico</option>
                  <option value="Evaluacion">Evaluación de Desempeño</option>
                  <option value="Amonestacion">Amonestación / Carta</option>
                  <option value="Permiso">Permiso o Licencia</option>
                  <option value="Vacaciones">Comprobante Vacaciones</option>
                  <option value="Otro">Otro Documento</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-medium text-slate-700 block mb-1">Nombre o Título del Documento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Contrato Indefinido 2026 firmado.pdf"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  Subir Expediente
                </button>
              </div>
            </form>
          </div>

          {/* Archivos Guardados */}
          <div className="space-y-3">
            <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Documentos Archivados ({empDocs.length})</span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                Almacenamiento Ilimitado Activo
              </span>
            </h4>

            {empDocs.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                No hay documentos adjuntos en el expediente de este empleado. Suba contratos, cédulas o certificaciones arriba.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {empDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-semibold text-slate-900 block truncate">{doc.title}</span>
                        <span className="text-[10px] text-slate-500 block">
                          {doc.type} • {doc.uploadDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                        title="Ver Documento"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Eliminar del Expediente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs cursor-pointer"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
