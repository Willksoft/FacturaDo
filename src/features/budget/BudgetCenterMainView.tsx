import React, { useState } from 'react';
import {
  Calculator,
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  Package,
  Sliders,
  History,
  Settings,
  Star,
  Plus
} from 'lucide-react';
import { useBudgetState } from '../../hooks/useBudgetState';
import { Budget } from '../../types/budget';
import BudgetDashboard from './components/BudgetDashboard';
import BudgetsListView from './components/BudgetsListView';
import BudgetResourcesView from './components/BudgetResourcesView';
import BudgetTemplatesView from './components/BudgetTemplatesView';
import BudgetProjectsView from './components/BudgetProjectsView';
import BudgetVariablesCategoriesView from './components/BudgetVariablesCategoriesView';
import BudgetAuditTrashView from './components/BudgetAuditTrashView';
import BudgetSettingsView from './components/BudgetSettingsView';
import BudgetFavoritesView from './components/BudgetFavoritesView';
import BudgetEditorModal from './components/BudgetEditorModal';
import NewBudgetWizardModal from './components/NewBudgetWizardModal';

interface BudgetCenterMainViewProps {
  onNavigateToTab?: (tab: string, params?: any) => void;
  createInvoiceOrQuote?: (data: any) => any;
}

export default function BudgetCenterMainView({
  onNavigateToTab,
  createInvoiceOrQuote
}: BudgetCenterMainViewProps) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'presupuestos' | 'proyectos' | 'plantillas' | 'recursos' | 'variables' | 'favoritos' | 'auditoria' | 'config'
  >('dashboard');

  const {
    resources,
    globalVariables,
    templates,
    budgets,
    projects,
    auditLogs,
    saveResource,
    deleteResource,
    toggleFavoriteResource,
    saveGlobalVariable,
    deleteGlobalVariable,
    saveTemplate,
    duplicateTemplate,
    deleteTemplate,
    saveBudget,
    duplicateBudget,
    createNewVersionBudget,
    moveToTrash,
    restoreFromTrash,
    deleteBudgetPermanently,
    toggleFavoriteBudget,
    saveProject,
    saveClientSignature
  } = useBudgetState();

  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Partial<Budget> | null>(null);

  const handleOpenNewBudget = () => {
    setShowWizardModal(true);
  };

  const handleStartBudgetFromWizard = (config: {
    title: string;
    clientName: string;
    projectName?: string;
    templateId?: string;
    duplicateFromBudgetId?: string;
    mode: 'template' | 'blank' | 'duplicate' | 'import';
  }) => {
    setShowWizardModal(false);

    if (config.mode === 'template' && config.templateId) {
      const tpl = templates.find(t => t.id === config.templateId);
      if (tpl) {
        setEditingBudget({
          title: config.title,
          clientName: config.clientName,
          projectName: config.projectName,
          groups: [
            {
              id: `grp-${Date.now()}`,
              name: tpl.name,
              items: [],
              subtotalCost: 0,
              subtotalPrice: 0,
              taxTotal: 0,
              total: 0
            }
          ]
        });
        setShowEditorModal(true);
        return;
      }
    } else if (config.mode === 'duplicate' && config.duplicateFromBudgetId) {
      const source = budgets.find(b => b.id === config.duplicateFromBudgetId);
      if (source) {
        setEditingBudget({
          ...source,
          id: undefined,
          budgetNumber: undefined,
          title: config.title,
          clientName: config.clientName || source.clientName,
          projectName: config.projectName || source.projectName,
          status: 'Borrador'
        });
        setShowEditorModal(true);
        return;
      }
    }

    setEditingBudget({
      title: config.title,
      clientName: config.clientName,
      projectName: config.projectName
    });
    setShowEditorModal(true);
  };

  const handleOpenEditBudget = (b: Budget) => {
    setEditingBudget(b);
    setShowEditorModal(true);
  };

  const handleConvertToQuote = (budget: Budget) => {
    handleConvertMultipleToQuote([budget]);
  };

  const handleConvertMultipleToQuote = (selectedBudgets: Budget[]) => {
    if (!selectedBudgets || selectedBudgets.length === 0) return;

    if (createInvoiceOrQuote) {
      // Consolidate groups and items across all selected budgets
      const mappedItems = selectedBudgets.flatMap(budget =>
        budget.groups.flatMap(g =>
          g.items.map(item => ({
            productId: item.resourceId || 'prod-custom',
            name: `[${budget.budgetNumber}] ${g.name} - ${item.resourceName} (${item.quantityCalculated} ${item.unit})`,
            price: item.unitPrice,
            quantity: item.quantityCalculated,
            taxRate: item.taxRate,
            taxAmount: item.taxAmount,
            total: item.total
          }))
        )
      );

      const budgetRefs = selectedBudgets.map(b => b.budgetNumber).join(', ');
      const mainClient = selectedBudgets[0].clientName || 'Cliente General';

      const quoteData = {
        type: 'Cotizacion',
        client: {
          id: selectedBudgets[0].clientId || 'cli-consumo',
          name: mainClient,
          rncOrCedula: '',
          email: '',
          phone: '',
          address: '',
          createdAt: new Date().toISOString()
        },
        items: mappedItems,
        paymentMethod: 'Efectivo',
        ncfType: 'B02',
        notes: `Cotización consolidada a partir de ${selectedBudgets.length} presupuesto(s): ${budgetRefs}.`
      };

      const createdQuote = createInvoiceOrQuote(quoteData);

      // Update statuses to 'Convertido'
      selectedBudgets.forEach(b => {
        b.status = 'Convertido';
        if (createdQuote && createdQuote.id) {
          b.convertedToQuoteId = createdQuote.id;
          b.convertedToQuoteNo = createdQuote.number || createdQuote.id;
        }
      });

      if (onNavigateToTab) {
        onNavigateToTab('cotizaciones');
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start" id="budget-center-root">
      {/* SIDEBAR SECUNDARIO DE PRESUPUESTOS */}
      <aside className="w-full lg:w-60 shrink-0 bg-white border border-neutral-200 rounded-2xl p-3.5 space-y-1.5 shadow-xs font-sans">
        <div className="px-2 py-2 border-b border-neutral-150 mb-2 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-neutral-900 leading-none">Centro Presupuestos</h2>
            <span className="text-[10px] text-neutral-500 font-medium mt-0.5 block">Menú Secundario</span>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>🏠 Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('presupuestos')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'presupuestos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>📄 Presupuestos</span>
          </button>

          <button
            onClick={() => setActiveTab('proyectos')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'proyectos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>📁 Proyectos</span>
          </button>

          <button
            onClick={() => setActiveTab('plantillas')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'plantillas' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>🧩 Plantillas</span>
          </button>

          <button
            onClick={() => setActiveTab('recursos')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'recursos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>📦 Recursos</span>
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'variables' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span>🧮 Variables & Categorías</span>
          </button>

          <button
            onClick={() => setActiveTab('favoritos')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'favoritos' ? 'bg-amber-500 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Star className="w-4 h-4 shrink-0 fill-amber-200" />
            <span>⭐ Favoritos</span>
          </button>

          <button
            onClick={() => setActiveTab('auditoria')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'auditoria' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span>📜 Historial & Papelera</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'config' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>⚙ Configuración</span>
          </button>
        </nav>
      </aside>

      {/* WORKSPACE CONTENT AREA */}
      <main className="flex-1 min-w-0 w-full space-y-6">

      {/* RENDER ACTIVE SUBMODULE */}
      {activeTab === 'dashboard' && (
        <BudgetDashboard
          budgets={budgets}
          resources={resources}
          templates={templates}
          projects={projects}
          onCreateNewBudget={handleOpenNewBudget}
          onOpenResources={() => setActiveTab('recursos')}
          onOpenTemplates={() => setActiveTab('plantillas')}
          onOpenProjects={() => setActiveTab('proyectos')}
          onSelectBudget={handleOpenEditBudget}
        />
      )}

      {activeTab === 'presupuestos' && (
        <BudgetsListView
          budgets={budgets}
          onCreateNew={handleOpenNewBudget}
          onEditBudget={handleOpenEditBudget}
          onDuplicateBudget={duplicateBudget}
          onCreateVersion={createNewVersionBudget}
          onMoveToTrash={moveToTrash}
          onToggleFavorite={toggleFavoriteBudget}
          onConvertToQuote={handleConvertToQuote}
          onConvertMultipleToQuote={handleConvertMultipleToQuote}
          onSaveClientSignature={saveClientSignature}
        />
      )}

      {activeTab === 'proyectos' && (
        <BudgetProjectsView
          projects={projects}
          budgets={budgets}
          onSaveProject={saveProject}
          onConvertProjectToQuote={handleConvertMultipleToQuote}
        />
      )}

      {activeTab === 'plantillas' && (
        <BudgetTemplatesView
          templates={templates}
          resources={resources}
          onSaveTemplate={saveTemplate}
          onDuplicateTemplate={duplicateTemplate}
          onDeleteTemplate={deleteTemplate}
        />
      )}

      {activeTab === 'recursos' && (
        <BudgetResourcesView
          resources={resources}
          onSaveResource={saveResource}
          onDeleteResource={deleteResource}
          onToggleFavorite={toggleFavoriteResource}
        />
      )}

      {activeTab === 'variables' && (
        <BudgetVariablesCategoriesView
          globalVariables={globalVariables}
          onSaveGlobalVariable={saveGlobalVariable}
          onDeleteGlobalVariable={deleteGlobalVariable}
        />
      )}

      {activeTab === 'favoritos' && (
        <BudgetFavoritesView
          resources={resources}
          templates={templates}
          budgets={budgets}
          projects={projects}
          onSelectBudget={handleOpenEditBudget}
        />
      )}

      {activeTab === 'auditoria' && (
        <BudgetAuditTrashView
          budgets={budgets}
          auditLogs={auditLogs}
          onRestoreFromTrash={restoreFromTrash}
          onDeletePermanently={deleteBudgetPermanently}
        />
      )}

      {activeTab === 'config' && (
        <BudgetSettingsView />
      )}

      {/* NEW BUDGET WIZARD MODAL */}
      {showWizardModal && (
        <NewBudgetWizardModal
          templates={templates}
          existingBudgets={budgets}
          resources={resources}
          onClose={() => setShowWizardModal(false)}
          onStartBudget={handleStartBudgetFromWizard}
        />
      )}

      {/* BUDGET EDITOR MODAL */}
      {showEditorModal && (
        <BudgetEditorModal
          budget={editingBudget}
          resources={resources}
          templates={templates}
          onClose={() => setShowEditorModal(false)}
          onSave={saveBudget}
          onConvertToQuote={handleConvertToQuote}
        />
      )}

      </main>

      {/* FLOATING ACTION BUTTON (+) FOR QUICK CREATION */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenNewBudget}
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-all font-bold group"
          title="Crear Nuevo Presupuesto (Asistente Visual)"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>
      </div>
    </div>
  );
}
