import React from 'react';
import { Star, Package, Layers, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { BudgetResource, BudgetTemplate, Budget, BudgetProject } from '../../../types/budget';

interface BudgetFavoritesViewProps {
  resources: BudgetResource[];
  templates: BudgetTemplate[];
  budgets: Budget[];
  projects: BudgetProject[];
  onSelectBudget: (b: Budget) => void;
}

export default function BudgetFavoritesView({
  resources,
  templates,
  budgets,
  projects,
  onSelectBudget
}: BudgetFavoritesViewProps) {
  const favoriteResources = resources.filter(r => r.isFavorite);
  const favoriteTemplates = templates.filter(t => t.isFavorite);
  const favoriteBudgets = budgets.filter(b => b.isFavorite && !b.isDeleted);
  const favoriteProjects = projects.filter(p => p.budgetIds && p.budgetIds.length > 0);

  const totalFavorites = favoriteResources.length + favoriteTemplates.length + favoriteBudgets.length + favoriteProjects.length;

  return (
    <div className="space-y-6 animate-fade-in" id="budget-favorites-view">
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-neutral-900 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-300" /> Marcadores Rápidos
          </div>
          <h2 className="text-xl font-extrabold font-heading">Elementos Favoritos ({totalFavorites})</h2>
          <p className="text-xs text-amber-200/80">Acceso prioritario a recursos, plantillas y presupuestos marcados con estrella.</p>
        </div>
      </div>

      {totalFavorites === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-400 bg-white border border-neutral-200 rounded-xl space-y-2">
          <Star className="w-8 h-8 text-neutral-300 mx-auto" />
          <p>No tienes elementos marcados como favoritos.</p>
          <p className="text-[10px] text-neutral-400">Haz clic en la estrella de cualquier recurso, plantilla o presupuesto para destacarlo aquí.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* FAVORITE BUDGETS */}
          {favoriteBudgets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Presupuestos Destacados ({favoriteBudgets.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {favoriteBudgets.map(b => (
                  <Card key={b.id} className="p-3.5 bg-white border-neutral-200 hover:border-neutral-300 rounded-xl shadow-xs flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-neutral-900">{b.title}</div>
                      <div className="text-[10px] text-neutral-500">{b.budgetNumber} • {b.clientName || 'General'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs font-black text-emerald-700">RD$ {b.total.toLocaleString('es-DO')}</div>
                      <Button size="sm" variant="ghost" onClick={() => onSelectBudget(b)} className="h-7 w-7 text-neutral-500 hover:text-neutral-900">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* FAVORITE RESOURCES */}
          {favoriteResources.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" /> Recursos Más Utilizados ({favoriteResources.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteResources.map(r => (
                  <Card key={r.id} className="p-3 bg-white border-neutral-200 rounded-xl shadow-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-neutral-900">{r.name}</div>
                      <div className="text-[9px] text-neutral-500">{r.category} • {r.calculationType}</div>
                    </div>
                    <div className="text-right text-xs font-extrabold text-neutral-800">
                      RD$ {r.price.toLocaleString('es-DO')}/{r.unit}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* FAVORITE TEMPLATES */}
          {favoriteTemplates.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" /> Plantillas Favoritas ({favoriteTemplates.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteTemplates.map(t => (
                  <Card key={t.id} className="p-3 bg-white border-neutral-200 rounded-xl shadow-xs">
                    <div className="font-bold text-xs text-neutral-900">{t.name}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{t.industryTag || t.category}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
