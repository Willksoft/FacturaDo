import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  FolderOpen, 
  FileText, 
  Building, 
  CreditCard, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  X,
  Sliders,
  Sparkles,
  Printer,
  CheckCircle2,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { 
  Employee, 
  ContractType, 
  EmployeeStatus, 
  MigratoryStatus, 
  IdentityDocumentType, 
  ExemptionReason, 
  LaborProfileId 
} from '../../../types/payroll';
import { DEFAULT_LABOR_PROFILES } from '../utils/payrollRuleEngine';
import { generateEmploymentContractHtml } from '../utils/payrollDocumentTemplates';

interface EmployeeDirectoryProps {
  employees: Employee[];
  onAddEmployee: (emp: Omit<Employee, 'id'>) => Employee;
  onUpdateEmployee: (id: string, emp: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  onOpenExpediente: (emp: Employee) => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onOpenExpediente,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('TODOS');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newlyCreatedEmployeeForContract, setNewlyCreatedEmployeeForContract] = useState<Employee | null>(null);

  // Formulario local
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    code: `EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
    fullName: '',
    gender: 'M',
    maritalStatus: 'Soltero/a',
    nationality: 'Dominicana',
    countryOfOrigin: 'República Dominicana',
    migratoryStatus: 'Ciudadano',
    identityDocType: 'Cédula',
    nationalId: '',
    docExpirationDate: '',
    docIssuingCountry: 'República Dominicana',
    birthDate: '1990-01-01',
    address: '',
    province: 'Distrito Nacional',
    municipality: 'Santo Domingo',
    phone: '',
    mobile: '',
    email: '',
    company: 'FacturaDo S.R.L.',
    branch: 'Sede Principal',
    department: 'Contabilidad y Finanzas',
    area: 'Administración',
    costCenter: 'CC-101',
    jobTitle: '',
    employeeType: 'Permanente',
    status: 'Activo',
    hireDate: new Date().toISOString().slice(0, 10),
    contractType: 'Indefinido',

    laborProfileId: 'fijo',
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
    motivoExencion: 'Ninguno',

    baseSalary: 30000,
    hourlyRate: 30000 / 176,
    dailyRate: 30000 / 23.83,
    currency: 'DOP',
    paymentMethod: 'Transferencia Bancaria',
    bankName: 'Banco Popular Dominicano',
    accountNumber: '',
    accountType: 'Ahorros',
    shiftType: 'Fijo',
    afpName: 'AFP Popular',
    arsName: 'ARS Humano',
    dependentsCount: 0
  });

  const departments = ['TODOS', ...Array.from(new Set(employees.map((e) => e.department)))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.nationalId.includes(searchTerm) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDepartment === 'TODOS' || emp.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  // Exportar lista completa a CSV / Excel
  const handleExportCsv = () => {
    const headers = [
      'Código',
      'Nombre Completo',
      'Nacionalidad',
      'País Origen',
      'Estatus Migratorio',
      'Tipo Documento',
      'No. Documento',
      'Vencimiento Doc',
      'Departamento',
      'Cargo',
      'Tipo Contrato',
      'Estado',
      'Fecha Ingreso',
      'Perfil Fiscal',
      'Salario Base (DOP)',
      'Aplica TSS',
      'Aplica ISR',
      'Banco',
      'No. Cuenta'
    ];

    const rows = filteredEmployees.map((e) => [
      e.code,
      `"${e.fullName}"`,
      e.nationality,
      `"${e.countryOfOrigin}"`,
      `"${e.migratoryStatus}"`,
      e.identityDocType,
      `"${e.nationalId}"`,
      e.docExpirationDate || '',
      `"${e.department}"`,
      `"${e.jobTitle}"`,
      e.contractType,
      e.status,
      e.hireDate,
      e.laborProfileId,
      e.baseSalary,
      e.aplicaTSS ? 'SI' : 'NO',
      e.aplicaISR ? 'SI' : 'NO',
      `"${e.bankName}"`,
      `"${e.accountNumber}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Directorio_Empleados_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyLaborProfile = (profileId: LaborProfileId) => {
    const prof = DEFAULT_LABOR_PROFILES.find((p) => p.id === profileId);
    if (!prof) return;

    setFormData((prev) => ({
      ...prev,
      laborProfileId: profileId,
      aplicaISR: prof.aplicaISR,
      aplicaTSS: prof.aplicaTSS,
      aplicaAFP: prof.aplicaAFP,
      aplicaARS: prof.aplicaARS,
      aplicaINFOTEP: prof.aplicaINFOTEP,
      aplicaRegalia: prof.aplicaRegalia,
      aplicaCesantia: prof.aplicaCesantia,
      aplicaVacaciones: prof.aplicaVacaciones,
      aplicaPrestaciones: prof.aplicaPrestaciones,
      cotizaSeguridadSocial: prof.cotizaSeguridadSocial,
      esExentoImpuestos: prof.esExentoImpuestos,
      motivoExencion: prof.motivoExencionDefault || 'Ninguno'
    }));
  };

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      code: `EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
      fullName: '',
      gender: 'M',
      maritalStatus: 'Soltero/a',
      nationality: 'Dominicana',
      countryOfOrigin: 'República Dominicana',
      migratoryStatus: 'Ciudadano',
      identityDocType: 'Cédula',
      nationalId: '',
      docExpirationDate: '',
      docIssuingCountry: 'República Dominicana',
      birthDate: '1990-01-01',
      address: '',
      province: 'Distrito Nacional',
      municipality: 'Santo Domingo',
      phone: '',
      mobile: '',
      email: '',
      company: 'FacturaDo S.R.L.',
      branch: 'Sede Principal',
      department: 'Contabilidad y Finanzas',
      area: 'Administración',
      costCenter: 'CC-101',
      jobTitle: '',
      employeeType: 'Permanente',
      status: 'Activo',
      hireDate: new Date().toISOString().slice(0, 10),
      contractType: 'Indefinido',

      laborProfileId: 'fijo',
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
      motivoExencion: 'Ninguno',

      baseSalary: 30000,
      hourlyRate: 30000 / 176,
      dailyRate: 30000 / 23.83,
      currency: 'DOP',
      paymentMethod: 'Transferencia Bancaria',
      bankName: 'Banco Popular Dominicano',
      accountNumber: '',
      accountType: 'Ahorros',
      shiftType: 'Fijo',
      afpName: 'AFP Popular',
      arsName: 'ARS Humano',
      dependentsCount: 0
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setShowModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const baseSal = Number(formData.baseSalary) || 0;
    const computedData = {
      ...formData,
      baseSalary: baseSal,
      hourlyRate: Math.round((baseSal / 176) * 100) / 100,
      dailyRate: Math.round((baseSal / 23.83) * 100) / 100
    };

    if (editingEmployee) {
      onUpdateEmployee(editingEmployee.id, computedData);
      setShowModal(false);
    } else {
      const created = onAddEmployee(computedData);
      setShowModal(false);
      setNewlyCreatedEmployeeForContract(created);
    }
  };

  const handlePrintContract = () => {
    if (!newlyCreatedEmployeeForContract) return;
    const htmlContent = generateEmploymentContractHtml(newlyCreatedEmployeeForContract);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<html><head><title>Contrato de Trabajo - ${newlyCreatedEmployeeForContract.fullName}</title></head><body>${htmlContent}</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Directorio de Empleados & Perfiles Fiscales
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administra los datos personales, migratorios, perfiles laborales y reglas fiscales independientes de cada colaborador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Exportar Excel / CSV
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            Imprimir Lista PDF
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-medium text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Registrar Empleado
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula/pasaporte, código o cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Grid Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Código / Empleado</th>
                <th className="p-4">Nacionalidad & Doc.</th>
                <th className="p-4">Perfil Fiscal Individual</th>
                <th className="p-4">Cargo & Depto</th>
                <th className="p-4 text-right">Salario Base (DOP)</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No se encontraron empleados registrados.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-150 flex items-center justify-center font-bold text-sm shrink-0">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">{emp.fullName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{emp.code}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-slate-800 block">
                        {emp.nationality === 'Extranjera' ? `🌍 Extranjero (${emp.countryOfOrigin})` : '🇩🇴 Dominicana'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        {emp.identityDocType}: {emp.nationalId}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 inline-block">
                          {emp.laborProfileId}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span>TSS: {emp.aplicaTSS ? '✓' : '✗'}</span>
                          <span>ISR: {emp.aplicaISR ? '✓' : '✗'}</span>
                          <span>Cotiza: {emp.cotizaSeguridadSocial ? '✓' : 'Exento'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-slate-800 block">{emp.jobTitle}</span>
                      <span className="text-[11px] text-slate-500">{emp.department}</span>
                    </td>

                    <td className="p-4 text-right font-mono font-semibold text-slate-900">
                      RD$ {emp.baseSalary.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onOpenExpediente(emp)}
                          title="Ficha 360° y Expediente Digital"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          title="Editar Empleado"
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`¿Desea eliminar al empleado ${emp.fullName}?`)) {
                              onDeleteEmployee(emp.id);
                            }
                          }}
                          title="Eliminar"
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ficha Completa de Empleado */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="text-base font-heading font-medium text-slate-900">
                  {editingEmployee ? 'Editar Ficha y Perfil Fiscal' : 'Registrar Nuevo Colaborador'}
                </h3>
                <p className="text-xs text-slate-500">Configuración migratoria y matriz de reglas fiscales individuales.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              <div className="space-y-4">
                <h4 className="font-heading font-medium text-indigo-700 text-xs uppercase tracking-wider border-b border-indigo-100 pb-1">
                  1. Información Personal & Identidad
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Código Interno *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-slate-700 block mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Carlos Martínez"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Celular / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-slate-700 block mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Información Fiscal y Migratoria */}
              <div className="space-y-4 pt-2">
                <h4 className="font-heading font-medium text-indigo-700 text-xs uppercase tracking-wider border-b border-indigo-100 pb-1 flex items-center justify-between">
                  <span>2. Información Fiscal y Migratoria</span>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    Configuración Independiente
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Nacionalidad *</label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value as any })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="Dominicana">Dominicana</option>
                      <option value="Extranjera">Extranjera</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">País de Origen *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. República Dominicana, Haití, España..."
                      value={formData.countryOfOrigin}
                      onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Estatus Migratorio *</label>
                    <select
                      value={formData.migratoryStatus}
                      onChange={(e) => setFormData({ ...formData, migratoryStatus: e.target.value as MigratoryStatus })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    >
                      <option value="Ciudadano">Ciudadano</option>
                      <option value="Residente Permanente">Residente Permanente</option>
                      <option value="Residente Temporal">Residente Temporal</option>
                      <option value="Trabajador Extranjero">Trabajador Extranjero</option>
                      <option value="Visa de Trabajo">Visa de Trabajo</option>
                      <option value="Permiso Temporal de Trabajo">Permiso Temporal de Trabajo</option>
                      <option value="Refugiado">Refugiado</option>
                      <option value="Diplomático">Diplomático</option>
                      <option value="Contratista Internacional">Contratista Internacional</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Tipo de Documento Identidad *</label>
                    <select
                      value={formData.identityDocType}
                      onChange={(e) => setFormData({ ...formData, identityDocType: e.target.value as IdentityDocumentType })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    >
                      <option value="Cédula">Cédula</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Permiso de Trabajo">Permiso de Trabajo</option>
                      <option value="Documento de Residencia">Documento de Residencia</option>
                      <option value="Documento Identidad Extranjero">Doc. Identidad Extranjero</option>
                      <option value="Documento Diplomático">Documento Diplomático</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Número de Documento *</label>
                    <input
                      type="text"
                      required
                      placeholder="001-0000000-0 o PAS-12345"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Fecha Vencimiento Documento</label>
                    <input
                      type="date"
                      value={formData.docExpirationDate || ''}
                      onChange={(e) => setFormData({ ...formData, docExpirationDate: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Perfil Laboral */}
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    Cargar Perfil Laboral Predeterminado
                  </span>
                  <span className="text-[11px] text-slate-500">Aplica reglas automáticas</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEFAULT_LABOR_PROFILES.map((prof) => (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => handleApplyLaborProfile(prof.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        formData.laborProfileId === prof.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block truncate">{prof.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Matriz Checkboxes */}
              <div className="space-y-4 pt-2">
                <h4 className="font-heading font-medium text-indigo-700 text-xs uppercase tracking-wider border-b border-indigo-100 pb-1">
                  4. Matriz de Obligaciones Fiscales y Beneficios Individuales
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 border border-slate-200 rounded-2xl">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaISR}
                      onChange={(e) => setFormData({ ...formData, aplicaISR: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica ISR?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaTSS}
                      onChange={(e) => setFormData({ ...formData, aplicaTSS: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica TSS?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaAFP}
                      onChange={(e) => setFormData({ ...formData, aplicaAFP: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica AFP?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaARS}
                      onChange={(e) => setFormData({ ...formData, aplicaARS: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica ARS?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaINFOTEP}
                      onChange={(e) => setFormData({ ...formData, aplicaINFOTEP: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica INFOTEP?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaRegalia}
                      onChange={(e) => setFormData({ ...formData, aplicaRegalia: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica Regalía?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaCesantia}
                      onChange={(e) => setFormData({ ...formData, aplicaCesantia: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica Cesantía?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.aplicaVacaciones}
                      onChange={(e) => setFormData({ ...formData, aplicaVacaciones: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Aplica Vacaciones?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.cotizaSeguridadSocial}
                      onChange={(e) => setFormData({ ...formData, cotizaSeguridadSocial: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Cotiza a TSS?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.esExentoImpuestos}
                      onChange={(e) => setFormData({ ...formData, esExentoImpuestos: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>¿Empleado Exento?</span>
                  </label>
                </div>
              </div>

              {/* Salario y Bancos */}
              <div className="space-y-4 pt-2">
                <h4 className="font-heading font-medium text-indigo-700 text-xs uppercase tracking-wider border-b border-indigo-100 pb-1">
                  5. Información Salarial & Datos Bancarios
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Salario Base Mensual (DOP) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Banco para Nómina</label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                    >
                      <option value="Banco Popular Dominicano">Banco Popular Dominicano</option>
                      <option value="Banreservas">Banreservas</option>
                      <option value="Banco BHD">Banco BHD</option>
                      <option value="Banco Santa Cruz">Banco Santa Cruz</option>
                      <option value="Efectivo / Cheque">Efectivo / Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Número de Cuenta Bancaria</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs cursor-pointer shadow-sm"
                >
                  Guardar y Generar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal AUTO-GENERACIÓN DE CONTRATO INMEDIATO TRAS CREAR EMPLEADO */}
      {newlyCreatedEmployeeForContract && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans text-xs sm:text-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-left border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    ¡Empleado Registrado Exitosamente!
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Se ha generado automáticamente el Contrato Individual de Trabajo para {newlyCreatedEmployeeForContract.fullName}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintContract}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" /> Imprimir Contrato PDF
                </button>
                <button
                  onClick={() => setNewlyCreatedEmployeeForContract(null)}
                  className="p-2 text-slate-300 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-100">
              <div
                className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{
                  __html: generateEmploymentContractHtml(newlyCreatedEmployeeForContract)
                }}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setNewlyCreatedEmployeeForContract(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-medium text-xs cursor-pointer"
              >
                Cerrar e Ir al Directorio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
