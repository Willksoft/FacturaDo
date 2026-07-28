import React from 'react';
import {
  History,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Clock,
  UserCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Budget, BudgetAuditLog } from '../../../types/budget';

interface BudgetAuditTrashViewProps {
  budgets: Budget[];
  auditLogs: BudgetAuditLog[];
  onRestoreFromTrash: (id: string) => void;
  onDeletePermanently: (id: string) => void;
}

export default function BudgetAuditTrashView({
  budgets,
  auditLogs,
  onRestoreFromTrash,
  onDeletePermanently
}: BudgetAuditTrashViewProps) {
  const deletedBudgets = budgets.filter(b => b.isDeleted);

  return (
    <div className="space-y-6 animate-fade-in" id="budget-audit-trash-view">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PAPELERA DE RECICLAJE */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-600" /> Papelera de Reciclaje ({deletedBudgets.length})
          </h3>

          <Card className="border-neutral-200 bg-white rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y divide-neutral-100">
              {deletedBudgets.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  La papelera está vacía. Ningún presupuesto eliminado.
                </div>
              ) : (
                deletedBudgets.map(b => (
                  <div key={b.id} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          {b.budgetNumber}
                        </span>
                        <span className="font-extrabold text-xs text-neutral-900">{b.title}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Cliente: {b.clientName || 'General'} • Total: RD$ {b.total.toLocaleString('es-DO')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestoreFromTrash(b.id)}
                        className="text-xs h-7 px-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restaurar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeletePermanently(b.id)}
                        className="h-7 w-7 text-red-600 hover:bg-red-50 rounded-md"
                        title="Eliminar Definitivamente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* HISTORIAL Y AUDITORÍA */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" /> Bitácora de Auditoría e Historial de Cambios
          </h3>

          <Card className="border-neutral-200 bg-white rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y divide-neutral-100 max-h-[450px] overflow-y-auto">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No hay registros de auditoría aún.
                </div>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="p-3 text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-indigo-700 font-mono">{log.budgetNumber}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(log.date).toLocaleString('es-DO')}
                      </span>
                    </div>
                    <div className="text-neutral-800 font-medium">
                      Acción: <span className="font-extrabold uppercase text-indigo-900">{log.action}</span> por {log.userName}
                    </div>
                    {log.reason && (
                      <p className="text-[10px] text-neutral-500 italic">Motivo: {log.reason}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
