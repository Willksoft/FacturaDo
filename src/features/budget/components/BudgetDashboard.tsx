import React from 'react';
import {
  Calculator,
  PlusCircle,
  FileText,
  FolderPlus,
  Package,
  Layers,
  CheckCircle,
  TrendingUp,
  Star,
  Clock,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Budget, BudgetResource, BudgetTemplate, BudgetProject } from '../../../types/budget';

interface BudgetDashboardProps {
  budgets: Budget[];
  resources: BudgetResource[];
  templates: BudgetTemplate[];
  projects: BudgetProject[];
  onCreateNewBudget: () => void;
  onOpenResources: () => void;
  onOpenTemplates: () => void;
  onOpenProjects: () => void;
  onSelectBudget: (budget: Budget) => void;
}

export default function BudgetDashboard({
  budgets,
  resources,
  templates,
  projects,
  onCreateNewBudget,
  onOpenResources,
  onOpenTemplates,
  onOpenProjects,
  onSelectBudget
}: BudgetDashboardProps) {
  const activeBudgets = budgets.filter(b => !b.isDeleted);
  const totalAmountBudgeted = activeBudgets.reduce((acc, b) => acc + b.total, 0);
  const approvedBudgets = activeBudgets.filter(b => b.status === 'Aprobado' || b.status === 'Convertido');
  const totalMargin = activeBudgets.reduce((acc, b) => acc + (b.profitMarginAmount || 0), 0);
  const avgMarginPct = activeBudgets.length > 0 ? (totalMargin / (totalAmountBudgeted || 1)) * 100 : 0;

  const favoriteBudgets = activeBudgets.filter(b => b.isFavorite);
  const recentBudgets = [...activeBudgets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in" id="budget-center-dashboard">
      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" /> Centro de Presupuestos Universal
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">
            Cotice e Inspeccione Costos Sin Fórmulas Complejas
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Dimensione cualquier trabajo para rotulación, construcción, imprenta, carpintería o eventos reutilizando materiales, mano de obra y variables globales.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={onCreateNewBudget}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Nuevo Presupuesto
          </Button>
          <Button
            variant="outline"
            onClick={onOpenTemplates}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-10 px-4 rounded-xl cursor-pointer"
          >
            <Layers className="w-4 h-4 mr-1.5" />
            Plantillas ({templates.length})
          </Button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-200 shadow-none bg-white rounded-xl">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500">Presupuestos Emitidos</CardTitle>
            <FileText className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-neutral-900">{activeBudgets.length}</div>
            <p className="text-[10px] text-neutral-450 mt-1 font-medium">
              {approvedBudgets.length} aprobados / convertidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none bg-white rounded-xl">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500">Monto Total Presupuestado</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-emerald-700">
              RD$ {totalAmountBudgeted.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-neutral-450 mt-1 font-medium">Valor comercial acumulado</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none bg-white rounded-xl">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500">Margen Promedio (%)</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-blue-800">
              {avgMarginPct.toFixed(1)}%
            </div>
            <p className="text-[10px] text-neutral-450 mt-1 font-medium">
              Utilidad neta estimada: RD$ {totalMargin.toLocaleString('es-DO')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-none bg-white rounded-xl">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500">Recursos en Catálogo</CardTitle>
            <Package className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-neutral-900">{resources.length}</div>
            <p className="text-[10px] text-neutral-450 mt-1 font-medium">
              {resources.filter(r => r.isFavorite).length} destacados favoritos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACCESS ACTION TILES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={onCreateNewBudget}
          className="p-4 bg-white border border-neutral-200 hover:border-indigo-500 hover:shadow-md transition-all rounded-xl text-left cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900">Crear Presupuesto</div>
            <div className="text-[10px] text-neutral-500">Nuevo cálculo interactivo</div>
          </div>
        </button>

        <button
          onClick={onOpenTemplates}
          className="p-4 bg-white border border-neutral-200 hover:border-indigo-500 hover:shadow-md transition-all rounded-xl text-left cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900">Usar Plantillas</div>
            <div className="text-[10px] text-neutral-500">Modelos preconfigurados</div>
          </div>
        </button>

        <button
          onClick={onOpenResources}
          className="p-4 bg-white border border-neutral-200 hover:border-indigo-500 hover:shadow-md transition-all rounded-xl text-left cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900">Catálogo Recursos</div>
            <div className="text-[10px] text-neutral-500">Materiales y servicios</div>
          </div>
        </button>

        <button
          onClick={onOpenProjects}
          className="p-4 bg-white border border-neutral-200 hover:border-indigo-500 hover:shadow-md transition-all rounded-xl text-left cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900">Proyectos Activos</div>
            <div className="text-[10px] text-neutral-500">Multisitio y carpetas</div>
          </div>
        </button>
      </div>

      {/* RECENT BUDGETS & TOP RESOURCES REUSE TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT BUDGETS (2 COLS) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Últimos Presupuestos Editados
            </h3>
            <span className="text-[10px] text-neutral-400">Total {recentBudgets.length}</span>
          </div>

          <Card className="border-neutral-200 shadow-none bg-white rounded-xl overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {recentBudgets.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No hay presupuestos creados aún. ¡Empiece creando el primero!
                </div>
              ) : (
                recentBudgets.map(b => (
                  <div
                    key={b.id}
                    onClick={() => onSelectBudget(b)}
                    className="p-3.5 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-neutral-900 truncate">{b.title}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono">
                          {b.budgetNumber} v{b.version}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-2">
                        <span>Cliente: <strong>{b.clientName || 'General'}</strong></span>
                        <span>•</span>
                        <span>{new Date(b.createdAt).toLocaleDateString('es-DO')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right shrink-0">
                      <div>
                        <div className="text-xs font-extrabold text-neutral-900">
                          RD$ {b.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[9px] font-bold text-emerald-700">
                          Margen: {b.profitMarginPct}%
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        b.status === 'Aprobado' || b.status === 'Convertido'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* FAVORITE RESOURCES & REUSABLE ASSETS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Recursos Más Utilizados
            </h3>
            <Button variant="ghost" onClick={onOpenResources} className="text-[10px] h-6 px-2 text-indigo-600">
              Ver Catálogo
            </Button>
          </div>

          <Card className="border-neutral-200 shadow-none bg-white rounded-xl overflow-hidden p-3 space-y-2">
            {resources.filter(r => r.isFavorite).length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-400">
                Marque sus recursos con una estrella para tenerlos a mano.
              </div>
            ) : (
              resources.filter(r => r.isFavorite).slice(0, 6).map(r => (
                <div key={r.id} className="p-2 bg-neutral-50 rounded-lg flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-neutral-900 truncate">{r.name}</div>
                    <div className="text-[9px] text-neutral-500 font-mono">
                      {r.category} • Cálculo por {r.calculationType}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-neutral-800">RD$ {r.price.toLocaleString('es-DO')} / {r.unit}</div>
                    <div className="text-[9px] text-neutral-400">Costo: RD$ {r.cost.toLocaleString('es-DO')}</div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
