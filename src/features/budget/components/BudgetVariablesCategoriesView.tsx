import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Percent,
  Sliders,
  DollarSign,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { BudgetGlobalVariable } from '../../../types/budget';

interface BudgetVariablesCategoriesViewProps {
  globalVariables: BudgetGlobalVariable[];
  onSaveGlobalVariable: (variable: BudgetGlobalVariable) => void;
  onDeleteGlobalVariable: (id: string) => void;
}

export default function BudgetVariablesCategoriesView({
  globalVariables,
  onSaveGlobalVariable,
  onDeleteGlobalVariable
}: BudgetVariablesCategoriesViewProps) {
  const [varName, setVarName] = useState('');
  const [varKey, setVarKey] = useState('');
  const [varValue, setVarValue] = useState<number>(0);
  const [varType, setVarType] = useState<'percentage' | 'fixed_amount' | 'multiplier'>('percentage');
  const [varDescription, setVarDescription] = useState('');

  const handleCreateVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!varName.trim() || !varKey.trim()) return;

    onSaveGlobalVariable({
      id: `var-${Date.now()}`,
      name: varName,
      key: varKey.toUpperCase().replace(/\s+/g, '_'),
      value: varValue,
      type: varType,
      description: varDescription
    });

    setVarName('');
    setVarKey('');
    setVarValue(0);
    setVarDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="budget-variables-categories-view">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CREATE VARIABLE FORM (1 COL) */}
        <Card className="border-neutral-200 bg-white rounded-xl shadow-xs">
          <CardHeader className="bg-neutral-50 border-b border-neutral-150 p-4">
            <CardTitle className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" /> Nueva Variable Global
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <form onSubmit={handleCreateVariable} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-neutral-700">Nombre de la Variable *</Label>
                <Input value={varName} onChange={e => setVarName(e.target.value)} required placeholder="Ej. Margen Utilidad Estándar" className="text-xs h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-neutral-700">Clave / Identificador *</Label>
                <Input value={varKey} onChange={e => setVarKey(e.target.value)} required placeholder="Ej. MARGEN_GANANCIA" className="text-xs h-9 font-mono uppercase" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Valor</Label>
                  <Input type="number" step="0.01" value={varValue} onChange={e => setVarValue(parseFloat(e.target.value) || 0)} className="text-xs h-9 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Tipo Valor</Label>
                  <select
                    value={varType}
                    onChange={e => setVarType(e.target.value as any)}
                    className="w-full text-xs h-9 px-2 border border-neutral-200 rounded-md bg-white"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed_amount">Monto Fijo (RD$)</option>
                    <option value="multiplier">Multiplicador (x)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-neutral-700">Descripción / Propósito</Label>
                <Input value={varDescription} onChange={e => setVarDescription(e.target.value)} placeholder="Ej. Aplicable a trabajos de rotulación" className="text-xs h-9" />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9">
                <Plus className="w-4 h-4 mr-1" /> Crear Variable
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* VARIABLES LIST (2 COLS) */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4 text-indigo-600" /> Variables Reutilizables en Presupuestos
          </h3>

          <Card className="border-neutral-200 bg-white rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y divide-neutral-100">
              {globalVariables.map(v => (
                <div key={v.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-neutral-900">{v.name}</span>
                      <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                        {v.key}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500">{v.description || 'Sin descripción.'}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-700 font-mono">
                        {v.type === 'percentage' ? `${v.value}%` : v.type === 'fixed_amount' ? `RD$ ${v.value}` : `x${v.value}`}
                      </div>
                      <div className="text-[9px] text-neutral-400 uppercase">{v.type}</div>
                    </div>

                    {!v.isDefault && (
                      <Button variant="ghost" size="icon" onClick={() => onDeleteGlobalVariable(v.id)} className="h-7 w-7 text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
