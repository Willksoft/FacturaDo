import React, { useState } from 'react';
import { 
  User, 
  FolderOpen, 
  FileText, 
  Printer, 
  Upload, 
  Trash2, 
  X, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  AlertTriangle, 
  CreditCard, 
  Building, 
  DollarSign, 
  UserCheck, 
  UserX, 
  Edit3,
  Sliders,
  Sparkles,
  FileCheck,
  Award
} from 'lucide-react';
import { Employee, EmployeeDocument, PayrollDetail, VacationRequest } from '../../../types/payroll';
import { 
  generateEmploymentContractHtml, 
  generateDismissalLetterHtml, 
  generateResignationLetterHtml, 
  generateSalaryCertificateHtml 
} from '../utils/payrollDocumentTemplates';
import { calculateSeveranceDominicanLaw } from '../utils/dominicanTaxCalculators';

interface EmployeeProfile360ModalProps {
  employee: Employee;
  documents: EmployeeDocument[];
  payrollDetails: PayrollDetail[];
  onAddDocument: (doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
  onDeleteDocument: (id: string) => void;
  onUpdateEmployee: (id: string, emp: Partial<Employee>) => void;
  onClose: () => void;
}

export const EmployeeProfile360Modal: React.FC<EmployeeProfile360ModalProps> = ({
  employee,
  documents,
  payrollDetails,
  onAddDocument,
  onDeleteDocument,
  onUpdateEmployee,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'kardex' | 'fiscal-migratorio' | 'expediente' | 'generador-doc' | 'historial-pagos'>('kardex');

  // Subida de documento
  const [docType, setDocType] = useState<EmployeeDocument['type']>('Contrato');
  const [docTitle, setDocTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  // Generador de documentos plantilla
  const [selectedTemplate, setSelectedTemplate] = useState<'contrato' | 'despido' | 'renuncia' | 'certificacion'>('contrato');

  const empDocs = documents.filter((d) => d.employeeId === employee.id);
  const empPayslips = payrollDetails.filter((d) => d.employeeId === employee.id);

  // Alerta si el pasaporte o visa vence pronto
  let docExpiryDays: number | null = null;
  if (employee.docExpirationDate) {
    const expDate = new Date(employee.docExpirationDate);
    const today = new Date();
    docExpiryDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    onAddDocument({
      employeeId: employee.id,
      type: docType,
      title: docTitle,
      fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    });

    setDocTitle('');
    setFileUrl('');
  };

  // Generar HTML de la plantilla seleccionada
  let generatedDocumentHtml = '';
  if (selectedTemplate === 'contrato') {
    generatedDocumentHtml = generateEmploymentContractHtml(employee);
  } else if (selectedTemplate === 'despido') {
    const severance = calculateSeveranceDominicanLaw(
      employee.id,
      employee.fullName,
      employee.nationalId,
      employee.hireDate,
      new Date().toISOString().slice(0, 10),
      employee.baseSalary,
      'Despido Injustificado (Cesantía)'
    );
    generatedDocumentHtml = generateDismissalLetterHtml(employee, 'Despido Injustificado / Desahucio', severance.totalLiquidation);
  } else if (selectedTemplate === 'renuncia') {
    generatedDocumentHtml = generateResignationLetterHtml(employee);
  } else if (selectedTemplate === 'certificacion') {
    generatedDocumentHtml = generateSalaryCertificateHtml(employee);
  }

  const handlePrintGeneratedDoc = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<html><head><title>Documento Oficial - ${employee.fullName}</title></head><body>${generatedDocumentHtml}</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs sm:text-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-left border border-slate-200">
        
        {/* Header 360° */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-indigo-400">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-white">{employee.fullName}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    employee.status === 'Activo'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  ● {employee.status}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {employee.jobTitle} • {employee.department} ({employee.code})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sub-Navegación de Pestañas del Perfil */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('kardex')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'kardex' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-indigo-600" />
            Visión General & Kardex
          </button>

          <button
            onClick={() => setActiveTab('fiscal-migratorio')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'fiscal-migratorio' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Fiscal & Migratorio
          </button>

          <button
            onClick={() => setActiveTab('expediente')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'expediente' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-sky-600" />
            Expediente Digital ({empDocs.length})
          </button>

          <button
            onClick={() => setActiveTab('generador-doc')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'generador-doc' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            Generar Contrato / Cartas
          </button>

          <button
            onClick={() => setActiveTab('historial-pagos')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'historial-pagos' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Volantes de Pago ({empPayslips.length})
          </button>
        </div>

        {/* Cuerpo de la Pestaña Activa */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* TAB 1: VISIÓN GENERAL & KARDEX */}
          {activeTab === 'kardex' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
                  <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider">
                    Datos Personales
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700 font-mono">
                    <div>Cédula / Doc: <strong className="text-slate-900">{employee.nationalId}</strong></div>
                    <div>Teléfono: <strong>{employee.phone || employee.mobile}</strong></div>
                    <div>Correo: <strong>{employee.email}</strong></div>
                    <div>Dirección: <strong>{employee.address}, {employee.province}</strong></div>
                    <div>Estado Civil: <strong>{employee.maritalStatus}</strong></div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
                  <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider">
                    Datos Laborales
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700 font-mono">
                    <div>Cargo: <strong className="text-slate-900">{employee.jobTitle}</strong></div>
                    <div>Departamento: <strong>{employee.department}</strong></div>
                    <div>Tipo Contrato: <strong>{employee.contractType}</strong></div>
                    <div>Fecha Ingreso: <strong>{employee.hireDate}</strong></div>
                    <div>Perfil Fiscal: <strong>{employee.laborProfileId}</strong></div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
                  <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider">
                    Salario & Cuentas
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700 font-mono">
                    <div>Salario Mensual: <strong className="text-emerald-700 font-bold text-sm">RD$ {employee.baseSalary.toLocaleString('es-DO')}</strong></div>
                    <div>Salario Diario: <strong>RD$ {employee.dailyRate.toLocaleString('es-DO')}</strong></div>
                    <div>Banco Pago: <strong>{employee.bankName}</strong></div>
                    <div>No. Cuenta: <strong>{employee.accountNumber}</strong></div>
                    <div>AFP / ARS: <strong>{employee.afpName} / {employee.arsName}</strong></div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción de Estado Laboral */}
              <div className="p-5 bg-indigo-50/50 border border-indigo-150 rounded-2xl space-y-3">
                <h4 className="font-heading font-medium text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Acciones Rápidas de Estatus Laboral
                </h4>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (confirm(`¿Confirma procesar el despido/término para ${employee.fullName}?`)) {
                        onUpdateEmployee(employee.id, { status: 'Inactivo', exitReason: 'Despido Injustificado (Cesantía)' });
                        alert('Estatus actualizado a Inactivo. Puede generar la carta de despido y liquidación en las pestañas correspondientes.');
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <UserX className="w-4 h-4" /> Registrar Despido / Término
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Registrar renuncia voluntaria para ${employee.fullName}?`)) {
                        onUpdateEmployee(employee.id, { status: 'Inactivo', exitReason: 'Renuncia Voluntaria' });
                        alert('Renuncia registrada.');
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-4 h-4" /> Registrar Renuncia
                  </button>

                  {employee.status !== 'Activo' && (
                    <button
                      onClick={() => {
                        onUpdateEmployee(employee.id, { status: 'Activo' });
                        alert('Empleado re-activado.');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <UserCheck className="w-4 h-4" /> Reactivar Empleado
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FISCAL & MIGRATORIO */}
          {activeTab === 'fiscal-migratorio' && (
            <div className="space-y-6">
              {docExpiryDays !== null && docExpiryDays <= 60 && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-xs">Alerta de Expiración Documental</span>
                    <p className="text-xs">
                      El documento ({employee.identityDocType} No. {employee.nationalId}) vence en {docExpiryDays} días ({employee.docExpirationDate}). Renueve el permiso antes de la fecha límite.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
                  <h4 className="font-heading font-medium text-slate-900 uppercase">Perfil Migratorio</h4>
                  <div>Nacionalidad: <strong>{employee.nationality}</strong></div>
                  <div>País Origen: <strong>{employee.countryOfOrigin}</strong></div>
                  <div>Estatus Migratorio: <strong>{employee.migratoryStatus}</strong></div>
                  <div>Tipo Documento: <strong>{employee.identityDocType}</strong></div>
                  <div>Número Documento: <strong>{employee.nationalId}</strong></div>
                  <div>Vencimiento Doc: <strong>{employee.docExpirationDate || 'Sin vencimiento'}</strong></div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-heading font-medium text-slate-900 uppercase">Matriz de Casillas Fiscales</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${employee.aplicaTSS ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>Aplica TSS: {employee.aplicaTSS ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${employee.aplicaISR ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>Aplica ISR: {employee.aplicaISR ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${employee.aplicaAFP ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>Aplica AFP: {employee.aplicaAFP ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${employee.aplicaARS ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>Aplica ARS: {employee.aplicaARS ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${employee.aplicaINFOTEP ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>INFOTEP: {employee.aplicaINFOTEP ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${employee.cotizaSeguridadSocial ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>Cotiza TSS: {employee.cotizaSeguridadSocial ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPEDIENTE DIGITAL */}
          {activeTab === 'expediente' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
                <h4 className="font-heading font-medium text-slate-900 text-xs uppercase flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Adjuntar Documento Digital (Cédula, Pasaporte, CV, Título)
                </h4>

                <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Tipo Documento</label>
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
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-slate-700 block mb-1">Título del Documento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Copia Cédula de Identidad escaneada.pdf"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" /> Subir Archivo
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {empDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-semibold text-slate-900 block truncate">{doc.title}</span>
                        <span className="text-[10px] text-slate-500">{doc.type} • {doc.uploadDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => onDeleteDocument(doc.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GENERADOR DE CONTRATOS & CARTAS */}
          {activeTab === 'generador-doc' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-slate-900 text-xs uppercase">Plantilla Oficial:</span>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as any)}
                    className="h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="contrato">Contrato Individual de Trabajo</option>
                    <option value="despido">Carta Oficial de Despido / Desahucio</option>
                    <option value="renuncia">Carta de Aceptación de Renuncia</option>
                    <option value="certificacion">Certificación Laboral y Salarial (Bancos / Visas)</option>
                  </select>
                </div>

                <button
                  onClick={handlePrintGeneratedDoc}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Imprimir Documento PDF
                </button>
              </div>

              {/* Document Live Preview Container */}
              <div
                className="bg-white border border-slate-300 p-8 rounded-2xl shadow-inner min-h-[450px]"
                dangerouslySetInnerHTML={{ __html: generatedDocumentHtml }}
              />
            </div>
          )}

          {/* TAB 5: HISTORIAL DE VOLANTES DE PAGO */}
          {activeTab === 'historial-pagos' && (
            <div className="space-y-4">
              <h4 className="font-heading font-medium text-slate-900 text-xs uppercase">
                Comprobantes de Pago Generados ({empPayslips.length})
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                      <th className="p-3">Período</th>
                      <th className="p-3 text-right">Salario Bruto</th>
                      <th className="p-3 text-right">Deducciones</th>
                      <th className="p-3 text-right">Monto Neto</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-mono">
                    {empPayslips.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">
                          No hay recibos procesados para este empleado.
                        </td>
                      </tr>
                    ) : (
                      empPayslips.map((ps) => (
                        <tr key={ps.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900 font-sans">{ps.periodId}</td>
                          <td className="p-3 text-right">RD$ {ps.grossSalary.toLocaleString('es-DO')}</td>
                          <td className="p-3 text-right text-rose-600">- RD$ {ps.totalDeductions.toLocaleString('es-DO')}</td>
                          <td className="p-3 text-right font-bold text-emerald-700">RD$ {ps.netSalary.toLocaleString('es-DO')}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => window.print()} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">
                              <Printer className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs cursor-pointer"
          >
            Cerrar Ficha 360°
          </button>
        </div>
      </div>
    </div>
  );
};
