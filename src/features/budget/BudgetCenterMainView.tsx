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
    <div className="space-y-6" id="budget-center-root">
      {/* HEADER TITLE & SUBMODULE TAB BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-neutral-200 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 font-heading">
              Centro de Presupuestos
            </h1>
            <p className="text-xs text-neutral-500">
              Estimación de costos dinámica, recursos, plantillas e integración con ventas.
            </p>
          </div>
        </div>

        {/* SUBMODULE TABS */}
        <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('presupuestos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'presupuestos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Presupuestos
          </button>

          <button
            onClick={() => setActiveTab('proyectos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proyectos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Proyectos
          </button>

          <button
            onClick={() => setActiveTab('plantillas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'plantillas' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Plantillas
          </button>

          <button
            onClick={() => setActiveTab('recursos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recursos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Recursos
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'variables' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Variables
          </button>

          <button
            onClick={() => setActiveTab('favoritos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'favoritos' ? 'bg-amber-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-300" /> Favoritos
          </button>

          <button
            onClick={() => setActiveTab('auditoria')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'auditoria' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Historial
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'config' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Config
          </button>
        </div>
      </div>

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
