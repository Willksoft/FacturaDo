import React, { useState } from 'react';
import { 
  Edit3, 
  FileText, 
  Printer, 
  Plus, 
  Trash2, 
  DollarSign, 
  CheckCircle2, 
  Building, 
  User, 
  Sliders, 
  Sparkles,
  Calculator,
  Save,
  BookOpen
} from 'lucide-react';
import { Employee } from '../../../types/payroll';

interface ManualPayrollAndDocsViewProps {
  employees: Employee[];
}

export const ManualPayrollAndDocsView: React.FC<ManualPayrollAndDocsViewProps> = ({ employees }) => {
  const [subTab, setSubTab] = useState<'payroll-manual' | 'contract-editor'>('payroll-manual');

  // ---------------------------------------------------------------------------
  // ESTADO 1: NÓMINA MANUAL
  // ---------------------------------------------------------------------------
  const [manualForm, setManualForm] = useState({
    employeeName: 'Juan Carlos Martínez',
    nationalId: '001-1458294-3',
    department: 'Contabilidad y Finanzas',
    jobTitle: 'Contador Senior',
    periodName: 'Pago Especial / Ajuste Retroactivo',
    grossSalary: 50000,
    afpEmployee: 1435,
    arsEmployee: 1520,
    isrEmployee: 1854,
    otherDeductions: 0,
    afpEmployer: 3550,
    arsEmployer: 3545,
    infotepEmployer: 500,
    notes: 'Pago registrado manualmente por ajuste administrativo.'
  });

  const [savedManualEntries, setSavedManualEntries] = useState<Array<any>>([]);

  const manualTotalDeductions = manualForm.afpEmployee + manualForm.arsEmployee + manualForm.isrEmployee + manualForm.otherDeductions;
  const manualNetSalary = Math.max(0, manualForm.grossSalary - manualTotalDeductions);
  const manualEmployerCost = manualForm.afpEmployer + manualForm.arsEmployer + manualForm.infotepEmployer;

  const handleSelectEmployeeForManual = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    setManualForm((prev) => ({
      ...prev,
      employeeName: emp.fullName,
      nationalId: emp.nationalId,
      department: emp.department,
      jobTitle: emp.jobTitle,
      grossSalary: emp.baseSalary,
      afpEmployee: Math.round(emp.baseSalary * 0.0287),
      arsEmployee: Math.round(emp.baseSalary * 0.0304),
      isrEmployee: 0,
      otherDeductions: 0,
      afpEmployer: Math.round(emp.baseSalary * 0.0710),
      arsEmployer: Math.round(emp.baseSalary * 0.0709),
      infotepEmployer: Math.round(emp.baseSalary * 0.0100)
    }));
  };

  const handleSaveManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: `manual-${Date.now()}`,
      ...manualForm,
      totalDeductions: manualTotalDeductions,
      netSalary: manualNetSalary,
      totalEmployerCost: manualEmployerCost,
      date: new Date().toLocaleDateString('es-DO')
    };

    setSavedManualEntries((prev) => [entry, ...prev]);
    alert('Nómina manual registrada e integrada al libro mayor contable.');
  };

  // ---------------------------------------------------------------------------
  // ESTADO 2: REDACTOR MANUAL DE CONTRATOS & CLAUSULAS CUSTOM
  // ---------------------------------------------------------------------------
  const [contractForm, setContractForm] = useState({
    companyName: 'FacturaDo S.R.L.',
    companyRnc: '1-31-00000-1',
    employeeName: 'Carlos Manuel De La Rosa',
    identityDocType: 'Cédula',
    nationalId: '001-1982049-5',
    nationality: 'Dominicana',
    jobTitle: 'Director de Innovación & TI',
    department: 'Tecnología',
    baseSalary: 95000,
    paymentFrequency: 'Quincenal',
    hireDate: new Date().toISOString().slice(0, 10),
    contractType: 'Indefinido',
    clauses: [
      { id: '1', title: 'PRIMERA (Objeto del Contrato)', text: 'El empleado es contratado para ejercer las funciones de su cargo respondiendo directamente a la Gerencia.' },
      { id: '2', title: 'SEGUNDA (Remuneración y Ajustes)', text: 'Se establece un salario ordinario mensual pagadero mediante transferencia bancaria quincenal.' },
      { id: '3', title: 'TERCERA (Acuerdo de Confidencialidad)', text: 'El empleado se compromete a resguardar los secretos comerciales, códigos fuente y datos de clientes de la empresa.' },
      { id: '4', title: 'CUARTA (Asignación de Equipos)', text: 'La empresa provee una computadora portatil ejecutiva y herramientas de software para el desempeño de sus funciones.' }
    ]
  });

  const handleAddClause = () => {
    const newId = (contractForm.clauses.length + 1).toString();
    setContractForm((prev) => ({
      ...prev,
      clauses: [
        ...prev.clauses,
        { id: newId, title: `CLÁUSULA ESPECIAL ${newId}`, text: 'Escriba aquí los términos y condiciones de esta nueva cláusula...' }
      ]
    }));
  };

  const handleRemoveClause = (id: string) => {
    setContractForm((prev) => ({
      ...prev,
      clauses: prev.clauses.filter((c) => c.id !== id)
    }));
  };

  const handleUpdateClause = (id: string, field: 'title' | 'text', value: string) => {
    setContractForm((prev) => ({
      ...prev,
      clauses: prev.clauses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    }));
  };

  const handlePrintContractHtml = () => {
    const dateStr = new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' });

    const clausesHtml = contractForm.clauses
      .map(
        (c) => `<p><strong>${c.title}:</strong> ${c.text}</p>`
      )
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #1e293b; padding: 35px; max-w: 800px; margin: 0 auto; border: 1px solid #cbd5e1;">
        <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px;">
          <h2 style="margin: 0; text-transform: uppercase; color: #0f172a;">${contractForm.companyName}</h2>
          <p style="margin: 3px 0 0; font-size: 11px; color: #64748b;">RNC: ${contractForm.companyRnc} • Contrato Individual de Trabajo Personalizado</p>
        </div>

        <p><strong>ENTRE:</strong> Por una parte, <strong>${contractForm.companyName}</strong>, RNC No. <strong>${contractForm.companyRnc}</strong>; y por la otra parte, el señor(a) <strong>${contractForm.employeeName}</strong>, portador(a) de la <strong>${contractForm.identityDocType} No. ${contractForm.nationalId}</strong>, de nacionalidad ${contractForm.nationality}.</p>

        <h3 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-top: 20px;">CLÁUSULAS CONTRACTUALES</h3>
        ${clausesHtml}

        <p style="margin-top: 30px;">Firmado en Santo Domingo, República Dominicana, a los ${dateStr}.</p>

        <div style="margin-top: 70px; display: flex; justify-content: space-between; text-align: center;">
          <div style="width: 45%; border-top: 1px solid #0f172a; pt: 8px;">
            <p style="margin: 0; font-weight: bold;">${contractForm.companyName}</p>
            <p style="margin: 0; font-size: 11px; color: #64748b;">EL EMPLEADOR</p>
          </div>
          <div style="width: 45%; border-top: 1px solid #0f172a; pt: 8px;">
            <p style="margin: 0; font-weight: bold;">${contractForm.employeeName}</p>
            <p style="margin: 0; font-size: 11px; color: #64748b;">EL EMPLEADO</p>
          </div>
        </div>
      </div>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<html><head><title>Contrato Personalizado - ${contractForm.employeeName}</title></head><body>${htmlContent}</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  return (
    <div className="space-y-6 font-sans text-left text-slate-900">
      
      {/* Header del Submódulo */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-indigo-600" />
            Nómina & Redactor Manual de Documentos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ingresa montos de nómina personalizados o redacta contratos de trabajo libres con cláusulas a la medida.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setSubTab('payroll-manual')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'payroll-manual' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            Nómina Manual
          </button>

          <button
            onClick={() => setSubTab('contract-editor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'contract-editor' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            Redactor de Contratos
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: PROCESADOR DE NÓMINA MANUAL */}
      {subTab === 'payroll-manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveManualEntry} className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h3 className="font-heading font-medium text-slate-900 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                Formulario de Carga Directa de Nómina
              </h3>

              {employees.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Auto-llenar desde:</span>
                  <select
                    onChange={(e) => handleSelectEmployeeForManual(e.target.value)}
                    className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  >
                    <option value="">-- Seleccionar Colaborador --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nombre Colaborador *</label>
                <input
                  type="text"
                  required
                  value={manualForm.employeeName}
                  onChange={(e) => setManualForm({ ...manualForm, employeeName: e.target.value })}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Cédula / Pasaporte *</label>
                <input
                  type="text"
                  required
                  value={manualForm.nationalId}
                  onChange={(e) => setManualForm({ ...manualForm, nationalId: e.target.value })}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Concepto / Período *</label>
                <input
                  type="text"
                  required
                  value={manualForm.periodName}
                  onChange={(e) => setManualForm({ ...manualForm, periodName: e.target.value })}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Salario Bruto (DOP) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={manualForm.grossSalary}
                  onChange={(e) => setManualForm({ ...manualForm, grossSalary: Number(e.target.value) })}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Deducciones Manuales */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider">
                Deducciones del Empleado (Ingreso Manual)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">AFP Empleado (DOP)</label>
                  <input
                    type="number"
                    min={0}
                    value={manualForm.afpEmployee}
                    onChange={(e) => setManualForm({ ...manualForm, afpEmployee: Number(e.target.value) })}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">ARS Empleado (DOP)</label>
                  <input
                    type="number"
                    min={0}
                    value={manualForm.arsEmployee}
                    onChange={(e) => setManualForm({ ...manualForm, arsEmployee: Number(e.target.value) })}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">ISR DGII (DOP)</label>
                  <input
                    type="number"
                    min={0}
                    value={manualForm.isrEmployee}
                    onChange={(e) => setManualForm({ ...manualForm, isrEmployee: Number(e.target.value) })}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Otros Descuentos</label>
                  <input
                    type="number"
                    min={0}
                    value={manualForm.otherDeductions}
                    onChange={(e) => setManualForm({ ...manualForm, otherDeductions: Number(e.target.value) })}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Aportes Patronales Manuales */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider">
                Aportes Patronales Empresa (Ingreso Manual)
              </h4>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">AFP Empresa</label>
                  <input
                    type="number"
                    min={0}
                    value={manualForm.afpEmployer}
                    onChange={(e) => setManualForm({ ...manualForm, afpEmployer: Number(e.target.value) })}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">ARS Empresa</label>
                  <input
                    type="number"
                    min={0}
                    value={manualForm.arsEmployer}
                    onChange={(e) => setManualForm({ ...manualForm, arsEmployer: Number(e.target.value) })}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">INFOTEP Empresa</label>
                  <input
                    type="number"
                    min={0}
                    value={manualForm.infotepEmployer}
                    onChange={(e) => setManualForm({ ...manualForm, infotepEmployer: Number(e.target.value) })}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" /> Guardar Nómina Manual
              </button>
            </div>
          </form>

          {/* Resumen & Volante en Tiempo Real */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md space-y-4">
              <h4 className="font-heading font-medium text-xs uppercase tracking-wider text-indigo-300">
                Resultado de Liquidación Manual
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span>Salario Bruto:</span>
                  <span className="font-bold text-white">RD$ {manualForm.grossSalary.toLocaleString('es-DO')}</span>
                </div>
                <div className="flex justify-between text-rose-300">
                  <span>Total Deducciones:</span>
                  <span>- RD$ {manualTotalDeductions.toLocaleString('es-DO')}</span>
                </div>
                <div className="border-t border-white/20 pt-2 flex justify-between text-sm font-bold text-emerald-400">
                  <span>Salario Neto a Pagar:</span>
                  <span>RD$ {manualNetSalary.toLocaleString('es-DO')}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 text-[11px] text-slate-300 font-mono">
                <div>Aportes Patronales: <strong>RD$ {manualEmployerCost.toLocaleString('es-DO')}</strong></div>
              </div>
            </div>

            {/* Historial de Cargas Manuales */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="font-heading font-medium text-slate-900 text-xs uppercase">
                Historial de Registros Manuales ({savedManualEntries.length})
              </h4>

              {savedManualEntries.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No hay nóminas manuales guardadas en esta sesión.</p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {savedManualEntries.map((entry) => (
                    <div key={entry.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{entry.employeeName}</span>
                        <span className="text-[10px] text-slate-500">{entry.periodName} • {entry.date}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">RD$ {entry.netSalary.toLocaleString('es-DO')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: REDACTOR DE CONTRATOS Y CLAUSULAS LIBRES */}
      {subTab === 'contract-editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h3 className="font-heading font-medium text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Editor de Cláusulas y Términos Contractuales
              </h3>

              <button
                onClick={handlePrintContractHtml}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" /> Imprimir PDF
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nombre de Empresa</label>
                <input
                  type="text"
                  value={contractForm.companyName}
                  onChange={(e) => setContractForm({ ...contractForm, companyName: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">RNC de Empresa</label>
                <input
                  type="text"
                  value={contractForm.companyRnc}
                  onChange={(e) => setContractForm({ ...contractForm, companyRnc: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Nombre de Colaborador</label>
                <input
                  type="text"
                  value={contractForm.employeeName}
                  onChange={(e) => setContractForm({ ...contractForm, employeeName: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">No. Documento / Cédula</label>
                <input
                  type="text"
                  value={contractForm.nationalId}
                  onChange={(e) => setContractForm({ ...contractForm, nationalId: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* Cláusulas Dinámicas Personalizables */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-medium text-slate-900 text-xs uppercase tracking-wider">
                  Cláusulas del Contrato ({contractForm.clauses.length})
                </h4>

                <button
                  type="button"
                  onClick={handleAddClause}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Cláusula
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {contractForm.clauses.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => handleUpdateClause(c.id, 'title', e.target.value)}
                        className="font-bold text-slate-900 text-xs bg-white px-2 py-1 border border-slate-200 rounded-lg flex-1"
                      />
                      <button
                        onClick={() => handleRemoveClause(c.id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={c.text}
                      onChange={(e) => handleUpdateClause(c.id, 'text', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Document Preview */}
          <div className="bg-slate-100 p-6 rounded-3xl border border-slate-300 shadow-inner flex flex-col justify-between">
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs font-sans text-xs leading-relaxed text-left max-h-[500px] overflow-y-auto">
              <div className="text-center border-b border-slate-900 pb-3 mb-4">
                <h3 className="font-bold uppercase text-slate-900 text-sm">{contractForm.companyName}</h3>
                <p className="text-[11px] font-mono text-slate-500">RNC: {contractForm.companyRnc} • Contrato de Trabajo Libre</p>
              </div>

              <p>
                <strong>ENTRE:</strong> {contractForm.companyName} y {contractForm.employeeName} ({contractForm.identityDocType}: {contractForm.nationalId}).
              </p>

              {contractForm.clauses.map((c) => (
                <div key={c.id} className="space-y-1">
                  <strong className="block text-slate-900">{c.title}:</strong>
                  <p className="text-slate-700 text-justify">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handlePrintContractHtml}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" /> Imprimir Documento Final
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
