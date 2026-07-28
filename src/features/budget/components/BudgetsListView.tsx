import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Star,
  Copy,
  GitBranch,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  Eye,
  FileSpreadsheet,
  ArrowRight,
  Filter,
  Printer
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Budget, BudgetStatus } from '../../../types/budget';
import BudgetPdfModal from './BudgetPdfModal';

interface BudgetsListViewProps {
  budgets: Budget[];
  onCreateNew: () => void;
  onEditBudget: (budget: Budget) => void;
  onDuplicateBudget: (id: string) => void;
  onCreateVersion: (id: string) => void;
  onMoveToTrash: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onConvertToQuote: (budget: Budget) => void;
}

export default function BudgetsListView({
  budgets,
  onCreateNew,
  onEditBudget,
  onDuplicateBudget,
  onCreateVersion,
  onMoveToTrash,
  onToggleFavorite,
  onConvertToQuote
}: BudgetsListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [selectedPdfBudget, setSelectedPdfBudget] = useState<Budget | null>(null);

  const activeBudgets = budgets.filter(b => !b.isDeleted);

  const filteredBudgets = activeBudgets.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.budgetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.clientName && b.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'TODOS' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="budgets-list-view">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, número PRES-..., cliente..."
              className="pl-9 text-xs h-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 text-xs h-9 bg-white">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="TODOS">Todos los Estados</SelectItem>
              <SelectItem value="Borrador">Borradores</SelectItem>
              <SelectItem value="Enviado">Enviados</SelectItem>
              <SelectItem value="Aprobado">Aprobados</SelectItem>
              <SelectItem value="Convertido">Convertidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 px-4 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Crear Presupuesto
        </Button>
      </div>

      {/* BUDGETS CARDS / LIST */}
      <div className="space-y-3">
        {filteredBudgets.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400 bg-white border border-neutral-200 rounded-xl">
            No hay presupuestos registrados que coincidan con el filtro.
          </div>
        ) : (
          filteredBudgets.map(b => (
            <Card key={b.id} className="border-neutral-200 bg-white rounded-xl p-4 shadow-xs hover:border-neutral-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => onToggleFavorite(b.id)} className="text-neutral-300 hover:text-amber-500 cursor-pointer p-0.5">
                    <Star className={`w-4 h-4 ${b.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                    {b.budgetNumber} v{b.version}
                  </span>
                  <h3 className="font-extrabold text-sm text-neutral-900 truncate">{b.title}</h3>
                </div>

                <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-3">
                  <span>Cliente: <strong>{b.clientName || 'General'}</strong></span>
                  {b.projectName && <span>Proyecto: <strong>{b.projectName}</strong></span>}
                  <span>Creado: {new Date(b.createdAt).toLocaleDateString('es-DO')}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-neutral-150 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <div className="text-xs font-black text-neutral-900">
                    RD$ {b.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    Margen Utilidad: {b.profitMarginPct || 0}%
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  b.status === 'Aprobado' || b.status === 'Convertido'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-250'
                    : 'bg-amber-50 text-amber-800 border border-amber-250'
                }`}>
                  {b.status}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditBudget(b)}
                    className="text-xs h-8 px-2.5 border-neutral-250 hover:bg-neutral-50 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onConvertToQuote(b)}
                    className="text-xs h-8 px-2.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold"
                    title="Convertir este presupuesto en una Cotización oficial del ERP"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-1" />
                    Cotizar
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPdfBudget(b)}
                    className="h-8 w-8 text-slate-700 hover:bg-slate-100 rounded-md"
                    title="Vista PDF e Imprimir Presupuesto"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDuplicateBudget(b.id)}
                    className="h-8 w-8 text-neutral-600 hover:bg-neutral-100 rounded-md"
                    title="Duplicar Presupuesto"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCreateVersion(b.id)}
                    className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-md"
                    title="Crear Nueva Versión (v+1)"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMoveToTrash(b.id)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-md"
                    title="Mover a Papelera"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedPdfBudget && (
        <BudgetPdfModal
          budget={selectedPdfBudget}
          onClose={() => setSelectedPdfBudget(null)}
        />
      )}
    </div>
  );
}
