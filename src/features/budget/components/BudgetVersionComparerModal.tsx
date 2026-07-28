import React from 'react';
import { X, GitBranch, ArrowRight, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Budget } from '../../../types/budget';

interface BudgetVersionComparerModalProps {
  currentBudget: Budget;
  allBudgets: Budget[];
  onClose: () => void;
}

export default function BudgetVersionComparerModal({ currentBudget, allBudgets, onClose }: BudgetVersionComparerModalProps) {
  // Find versions of the same budget sequence or title
  const otherVersions = allBudgets.filter(
    b => (b.id !== currentBudget.id && (b.budgetNumber === currentBudget.budgetNumber || b.title === currentBudget.title))
  );

  const compareTarget = otherVersions.length > 0 ? otherVersions[0] : null;

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-4xl w-full p-6 space-y-6 shadow-2xl animate-fade-in font-sans max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-150 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900">
                Comparador Lado a Lado de Versiones ({currentBudget.budgetNumber})
              </h2>
              <span className="text-[10px] text-neutral-500 font-mono">Auditoría Visual de Cambios entre Revisiones</span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPARISON VIEWPORT */}
        {!compareTarget ? (
          <div className="py-12 text-center text-xs text-neutral-500 space-y-2">
            <GitBranch className="w-8 h-8 text-neutral-300 mx-auto" />
            <p>No se encontraron otras versiones históricas registradas para este presupuesto.</p>
            <p className="text-[10px] text-neutral-400">Haz clic en el botón de ramificación "Crear Versión" para crear v2, v3 y habilitar la comparación.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* COMPARISON CARDS */}
            <div className="grid grid-cols-2 gap-4">
              {/* VERSION ANTERIOR */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                  <span className="font-extrabold text-neutral-800">Versión v{compareTarget.version} (Anterior)</span>
                  <span className="text-[10px] font-mono text-neutral-500">{new Date(compareTarget.createdAt).toLocaleDateString('es-DO')}</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><span>Costo Total:</span> <span>RD$ {compareTarget.subtotalCost.toLocaleString('es-DO')}</span></div>
                  <div className="flex justify-between"><span>Precio Venta:</span> <span>RD$ {compareTarget.subtotalPrice.toLocaleString('es-DO')}</span></div>
                  <div className="flex justify-between font-bold text-neutral-900"><span>Total con ITBIS:</span> <span>RD$ {compareTarget.total.toLocaleString('es-DO')}</span></div>
                  <div className="flex justify-between text-indigo-700 font-bold"><span>Margen:</span> <span>{compareTarget.profitMarginPct || 0}%</span></div>
                </div>
              </div>

              {/* VERSION ACTUAL */}
              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-200 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                  <span className="font-extrabold text-indigo-950">Versión v{currentBudget.version} (Actual)</span>
                  <span className="text-[10px] font-mono text-indigo-700">{new Date(currentBudget.createdAt).toLocaleDateString('es-DO')}</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><span>Costo Total:</span> <span>RD$ {currentBudget.subtotalCost.toLocaleString('es-DO')}</span></div>
                  <div className="flex justify-between"><span>Precio Venta:</span> <span>RD$ {currentBudget.subtotalPrice.toLocaleString('es-DO')}</span></div>
                  <div className="flex justify-between font-bold text-indigo-950"><span>Total con ITBIS:</span> <span>RD$ {currentBudget.total.toLocaleString('es-DO')}</span></div>
                  <div className="flex justify-between text-indigo-700 font-bold"><span>Margen:</span> <span>{currentBudget.profitMarginPct || 0}%</span></div>
                </div>
              </div>
            </div>

            {/* VARIANCE SUMMARY */}
            <div className="p-3 bg-neutral-900 text-white rounded-xl flex items-center justify-between text-xs font-mono">
              <span>Variación Neta en Total:</span>
              <span className={`font-black text-sm ${currentBudget.total >= compareTarget.total ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentBudget.total >= compareTarget.total
                  ? `+RD$ ${(currentBudget.total - compareTarget.total).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`
                  : `-RD$ ${(compareTarget.total - currentBudget.total).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-end border-t border-neutral-150 pt-3 shrink-0">
          <Button variant="outline" onClick={onClose} className="text-xs h-9">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
