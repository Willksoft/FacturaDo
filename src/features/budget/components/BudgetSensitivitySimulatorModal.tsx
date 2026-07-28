import React, { useState } from 'react';
import { X, Sliders, TrendingUp, DollarSign, Percent, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Budget } from '../../../types/budget';

interface BudgetSensitivitySimulatorModalProps {
  budget: Budget;
  onClose: () => void;
}

export default function BudgetSensitivitySimulatorModal({ budget, onClose }: BudgetSensitivitySimulatorModalProps) {
  // Simulator SLIDERS:
  // 1. Cost Fluctuation (-20% to +50%)
  const [costMultiplierPct, setCostMultiplierPct] = useState<number>(0);
  // 2. Commercial Discount (0% to 30%)
  const [extraDiscountPct, setExtraDiscountPct] = useState<number>(budget.discountRate || 0);
  // 3. Target Margin % (10% to 70%)
  const [targetMarginPct, setTargetMarginPct] = useState<number>(budget.profitMarginPct || 35);

  const baseCost = budget.subtotalCost;
  const basePrice = budget.subtotalPrice;

  // Recalculated values:
  const simulatedCost = baseCost * (1 + costMultiplierPct / 100);
  const rawPriceWithTargetMargin = simulatedCost / (1 - targetMarginPct / 100);
  const discountAmount = rawPriceWithTargetMargin * (extraDiscountPct / 100);
  const finalPriceBeforeTax = rawPriceWithTargetMargin - discountAmount;
  const simulatedTax = finalPriceBeforeTax * 0.18;
  const simulatedTotal = finalPriceBeforeTax + simulatedTax;
  const simulatedProfit = finalPriceBeforeTax - simulatedCost;
  const simulatedProfitMarginPct = finalPriceBeforeTax > 0 ? (simulatedProfit / finalPriceBeforeTax) * 100 : 0;

  const costDifference = simulatedCost - baseCost;
  const totalDifference = simulatedTotal - budget.total;

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-fade-in font-sans max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-150 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900">
                Simulador de Sensibilidad & Análisis "What-If"
              </h2>
              <span className="text-[10px] text-neutral-500 font-mono">Proyección Financiera en Tiempo Real ({budget.budgetNumber})</span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SLIDERS & REALTIME METRICS */}
        <div className="flex-1 overflow-y-auto space-y-6 p-1">
          {/* SLIDERS CONTROLS */}
          <div className="space-y-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            {/* Slider 1: Fluctación de Costo de Insumos */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
                <span>1. Fluctuación de Costo de Materiales:</span>
                <span className={`font-mono ${costMultiplierPct >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {costMultiplierPct > 0 ? `+${costMultiplierPct}%` : `${costMultiplierPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="1"
                value={costMultiplierPct}
                onChange={(e) => setCostMultiplierPct(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[9px] text-neutral-400">
                <span>-20% (Oferta Proveedor)</span>
                <span>0% (Costo Base)</span>
                <span>+50% (Inflación)</span>
              </div>
            </div>

            {/* Slider 2: Descuento Comercial al Cliente */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-200">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
                <span>2. Descuento Comercial Aplicado:</span>
                <span className="font-mono text-indigo-600">{extraDiscountPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={extraDiscountPct}
                onChange={(e) => setExtraDiscountPct(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Slider 3: Margen Objetivo de Ganancia */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-200">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
                <span>3. Margen Objetivo de Utilidad (%):</span>
                <span className="font-mono text-emerald-600">{targetMarginPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="1"
                value={targetMarginPct}
                onChange={(e) => setTargetMarginPct(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* SIMULATED RESULT DASHBOARD */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
            <div className="bg-neutral-900 text-white p-3.5 rounded-xl border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Costo Simulado</span>
              <div className="text-sm font-black font-mono">
                RD$ {simulatedCost.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </div>
              <span className={`text-[9px] block ${costDifference >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {costDifference >= 0 ? `+RD$ ${costDifference.toFixed(2)}` : `-RD$ ${Math.abs(costDifference).toFixed(2)}`} vs Base
              </span>
            </div>

            <div className="bg-emerald-950 text-emerald-100 p-3.5 rounded-xl border border-emerald-800/60 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Utilidad Neta Simulada</span>
              <div className="text-sm font-black font-mono text-emerald-300">
                RD$ {simulatedProfit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[9px] text-emerald-300 font-bold block">
                Margen Real: {simulatedProfitMarginPct.toFixed(1)}%
              </span>
            </div>

            <div className="bg-indigo-950 text-indigo-100 p-3.5 rounded-xl border border-indigo-800/60 space-y-1">
              <span className="text-[10px] text-indigo-300 uppercase font-bold block">Total Final (con ITBIS)</span>
              <div className="text-sm font-black font-mono text-indigo-200">
                RD$ {simulatedTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[9px] text-indigo-300 block">
                {totalDifference >= 0 ? `+RD$ ${totalDifference.toFixed(2)}` : `-RD$ ${Math.abs(totalDifference).toFixed(2)}`} vs Actual
              </span>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between border-t border-neutral-150 pt-3 shrink-0">
          <Button variant="outline" onClick={onClose} className="text-xs h-9">
            Cerrar
          </Button>

          <Button
            onClick={() => {
              setCostMultiplierPct(0);
              setExtraDiscountPct(budget.discountRate || 0);
              setTargetMarginPct(budget.profitMarginPct || 35);
            }}
            variant="ghost"
            className="text-xs text-neutral-600 hover:text-neutral-900"
          >
            Restablecer Valores
          </Button>
        </div>
      </div>
    </div>
  );
}
