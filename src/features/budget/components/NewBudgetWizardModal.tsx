import React, { useState } from 'react';
import {
  X,
  FileText,
  Copy,
  Upload,
  LayoutTemplate,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calculator,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Budget, BudgetTemplate, BudgetResource } from '../../../types/budget';

interface NewBudgetWizardModalProps {
  templates: BudgetTemplate[];
  existingBudgets: Budget[];
  resources: BudgetResource[];
  onClose: () => void;
  onStartBudget: (config: {
    title: string;
    clientName: string;
    projectName?: string;
    templateId?: string;
    duplicateFromBudgetId?: string;
    mode: 'template' | 'blank' | 'duplicate' | 'import';
  }) => void;
}

export default function NewBudgetWizardModal({
  templates,
  existingBudgets,
  resources,
  onClose,
  onStartBudget
}: NewBudgetWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMode, setSelectedMode] = useState<'template' | 'blank' | 'duplicate' | 'import'>('template');
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedDuplicateBudgetId, setSelectedDuplicateBudgetId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const handleSelectMode = (mode: 'template' | 'blank' | 'duplicate' | 'import') => {
    setSelectedMode(mode);
    if (mode === 'blank') {
      setTitle('Mi Nuevo Presupuesto');
      setStep(3);
    } else if (mode === 'template') {
      setStep(2);
    } else if (mode === 'duplicate') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleConfirmTemplate = (template: BudgetTemplate) => {
    setSelectedTemplateId(template.id);
    setTitle(`Presupuesto - ${template.name}`);
    setStep(3);
  };

  const handleConfirmDuplicate = (b: Budget) => {
    setSelectedDuplicateBudgetId(b.id);
    setTitle(`${b.title} (Copia)`);
    setClientName(b.clientName || '');
    setProjectName(b.projectName || '');
    setStep(3);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBudget({
      title: title || 'Nuevo Presupuesto',
      clientName: clientName || 'Cliente General',
      projectName,
      templateId: selectedTemplateId,
      duplicateFromBudgetId: selectedDuplicateBudgetId,
      mode: selectedMode
    });
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-fade-in font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-150 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
                Asistente de Presupuesto
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  Paso {step} de {selectedMode === 'blank' ? 2 : 3}
                </span>
              </h2>
              <p className="text-xs text-neutral-500">Diseñe y calcule presupuestos profesionales en minutos sin fórmulas.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: ELEGIR CÓMO COMENZAR */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 text-center">¿Cómo deseas comenzar?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card
                onClick={() => handleSelectMode('template')}
                className="p-4 border-2 border-neutral-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/30 transition-all cursor-pointer rounded-xl flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-indigo-700">Desde una Plantilla</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">Use estructuras listas para PVC, ACM, Impresión, Muebles o Fachadas.</p>
                </div>
              </Card>

              <Card
                onClick={() => handleSelectMode('blank')}
                className="p-4 border-2 border-neutral-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer rounded-xl flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">Desde Cero (Lienzo Blanco)</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">Inicie un documento vacío y agregue materiales o servicios al gusto.</p>
                </div>
              </Card>

              <Card
                onClick={() => handleSelectMode('duplicate')}
                className="p-4 border-2 border-neutral-200 hover:border-amber-500 bg-white hover:bg-amber-50/30 transition-all cursor-pointer rounded-xl flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Copy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-amber-700">Duplicar Presupuesto</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">Reutilice un presupuesto anterior para un cliente similar.</p>
                </div>
              </Card>

              <Card
                onClick={() => handleSelectMode('import')}
                className="p-4 border-2 border-neutral-200 hover:border-blue-500 bg-white hover:bg-blue-50/30 transition-all cursor-pointer rounded-xl flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-blue-700">Importar Archivo / CSV</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">Cargue rápido ítems estructurados desde una hoja externa.</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 2: BUSCAR PLANTILLA O ELEGIR PRESUPUESTO */}
        {step === 2 && selectedMode === 'template' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-800">Seleccione la Plantilla de Trabajo:</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs text-neutral-500">
                ← Volver
              </Button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <Input
                value={templateSearch}
                onChange={e => setTemplateSearch(e.target.value)}
                placeholder="Buscar plantilla (Ej: PVC, ACM, Fachada, Cocina...)"
                className="pl-9 text-xs h-9 bg-neutral-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-xs text-neutral-400 border border-dashed rounded-xl">
                  No se encontraron plantillas. <button onClick={() => setStep(1)} className="text-indigo-600 underline font-bold">Crear desde cero</button>
                </div>
              ) : (
                filteredTemplates.map(t => (
                  <Card
                    key={t.id}
                    onClick={() => handleConfirmTemplate(t)}
                    className="p-3 border border-neutral-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/20 cursor-pointer rounded-xl transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                        {t.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900">{t.name}</h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">{t.description || 'Sin notas.'}</p>
                    <div className="text-[10px] text-neutral-600 font-mono">
                      {t.items.length} recursos pre-configurados
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {step === 2 && selectedMode === 'duplicate' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-800">Seleccione el Presupuesto a Duplicar:</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs text-neutral-500">
                ← Volver
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
              {existingBudgets.map(b => (
                <Card
                  key={b.id}
                  onClick={() => handleConfirmDuplicate(b)}
                  className="p-3 border border-neutral-200 hover:border-amber-500 bg-white hover:bg-amber-50/20 cursor-pointer rounded-xl transition-all space-y-1"
                >
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                    {b.budgetNumber}
                  </span>
                  <h4 className="text-xs font-bold text-neutral-900">{b.title}</h4>
                  <p className="text-[11px] text-neutral-500">Cliente: {b.clientName || 'General'}</p>
                  <div className="text-[10px] font-bold text-emerald-700">
                    RD$ {b.total.toLocaleString('es-DO')}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: DATOS PRINCIPALES Y CONFIRMACIÓN */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-800">Nombre / Título del Presupuesto *</label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="Ej. Letrero PVC Exterior 4x8 ft"
                className="text-xs h-9 bg-neutral-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-800">Cliente Asociado (Opcional)</label>
                <Input
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="Ej. Comercial Plaza R.D."
                  className="text-xs h-9 bg-neutral-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-800">Proyecto Comercial (Opcional)</label>
                <Input
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="Ej. Remodelación Sucursal Central"
                  className="text-xs h-9 bg-neutral-50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-150 flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="text-xs h-9">
                ← Volver a opciones
              </Button>

              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-5 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Abrir Área de Trabajo
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
