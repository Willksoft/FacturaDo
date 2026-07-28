import { 
  Sliders, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Globe, 
  Briefcase, 
  Zap, 
  AlertCircle, 
  FileText,
  Sparkles,
  Trash2
} from 'lucide-react';
import { LaborProfile, PayrollRule } from '../../../types/payroll';

interface LaborProfilesRulesViewProps {
  laborProfiles: LaborProfile[];
  payrollRules: PayrollRule[];
  onToggleRuleActive: (id: string) => void;
  onAddPayrollRule: (rule: Omit<PayrollRule, 'id'>) => void;
  onDeletePayrollRule?: (id: string) => void;
}

export const LaborProfilesRulesView: React.FC<LaborProfilesRulesViewProps> = ({
  laborProfiles,
  payrollRules,
  onToggleRuleActive,
  onAddPayrollRule,
  onDeletePayrollRule,
}) => {
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [condNationality, setCondNationality] = useState<'Dominicana' | 'Extranjera' | 'Cualquiera'>('Extranjera');
  const [condContract, setCondContract] = useState<string>('Contratista');
  const [disableTss, setDisableTss] = useState(true);
  const [disableIsr, setDisableIsr] = useState(true);

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName) return;

    onAddPayrollRule({
      name: ruleName,
      description: ruleDesc || 'Regla personalizada inteligente',
      isActive: true,
      conditionNationality: condNationality,
      conditionContractType: condContract as any,
      setAplicaTSS: !disableTss,
      setAplicaISR: !disableIsr,
      setCotizaSeguridadSocial: !disableTss,
      setEsExentoImpuestos: disableIsr
    });

    setRuleName('');
    setRuleDesc('');
    setShowAddRuleModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-600" />
            Perfiles Laborales & Motor de Reglas Fiscales
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configuración global de perfiles (Fijo, Extranjero, Contratista, Remoto) y motor de reglas sin tocar código.
          </p>
        </div>

        <button
          onClick={() => setShowAddRuleModal(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-medium text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Crear Nueva Regla Inteligente
        </button>
      </div>

      {/* Perfiles Laborales Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Catálogo de Perfiles Laborales Configurables ({laborProfiles.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {laborProfiles.map((prof) => (
            <div
              key={prof.id}
              className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm block">{prof.name}</span>
                  <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                    ID: {prof.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{prof.description}</p>

                <div className="grid grid-cols-2 gap-1.5 pt-3 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${prof.aplicaTSS ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-slate-700">TSS: {prof.aplicaTSS ? 'Sí' : 'No'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${prof.aplicaISR ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-slate-700">ISR: {prof.aplicaISR ? 'Sí' : 'No'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${prof.aplicaCesantia ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-slate-700">Cesantía: {prof.aplicaCesantia ? 'Sí' : 'No'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${prof.cotizaSeguridadSocial ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-slate-700">Cotiza TSS: {prof.cotizaSeguridadSocial ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motor de Reglas Inteligentes List */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
        <h2 className="text-base font-heading font-medium text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Reglas Inteligentes Activas en la Evaluación ({payrollRules.length})
          </span>
          <span className="text-xs text-slate-400 font-normal">Evaluadas en cada cierre de nómina</span>
        </h2>

        <div className="space-y-3">
          {payrollRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                rule.isActive
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/40 border-slate-150 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{rule.name}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      rule.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {rule.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleRuleActive(rule.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    rule.isActive
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {rule.isActive ? 'Desactivar Regla' : 'Activar Regla'}
                </button>
                {onDeletePayrollRule && (
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la regla "${rule.name}"?`)) {
                        onDeletePayrollRule(rule.id);
                      }
                    }}
                    className="p-2 bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                    title="Eliminar Regla"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Crear Regla Inteligente */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs sm:text-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 text-left border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h3 className="font-heading font-bold text-slate-900 text-base">Crear Regla Fiscal Inteligente</h3>
              <button onClick={() => setShowAddRuleModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRuleSubmit} className="space-y-4">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nombre de la Regla *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Exención Especial Diplomáticos"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Explique en lenguaje claro lo que realiza la regla..."
                  value={ruleDesc}
                  onChange={(e) => setRuleDesc(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-3">
                <span className="font-bold text-indigo-900 block text-xs uppercase tracking-wider">
                  Condiciones (SI se cumple):
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Nacionalidad</label>
                    <select
                      value={condNationality}
                      onChange={(e) => setCondNationality(e.target.value as any)}
                      className="w-full h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Extranjera">Extranjera</option>
                      <option value="Dominicana">Dominicana</option>
                      <option value="Cualquiera">Cualquiera</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Tipo Contrato</label>
                    <select
                      value={condContract}
                      onChange={(e) => setCondContract(e.target.value)}
                      className="w-full h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Contratista">Contratista</option>
                      <option value="Honorarios">Honorarios</option>
                      <option value="Temporal">Temporal</option>
                      <option value="Cualquiera">Cualquiera</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-2">
                <span className="font-bold text-emerald-900 block text-xs uppercase tracking-wider">
                  Acción (ENTONCES):
                </span>

                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disableTss}
                      onChange={(e) => setDisableTss(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span>Desactivar Retenciones TSS</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disableIsr}
                      onChange={(e) => setDisableIsr(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span>Desactivar Retención ISR</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-medium cursor-pointer"
                >
                  Guardar Regla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
