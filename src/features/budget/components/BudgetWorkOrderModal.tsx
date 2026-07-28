import React from 'react';
import { X, Printer, HardHat, Wrench, CheckSquare, Layers, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Budget } from '../../../types/budget';

interface BudgetWorkOrderModalProps {
  budget: Budget;
  onClose: () => void;
}

export default function BudgetWorkOrderModal({ budget, onClose }: BudgetWorkOrderModalProps) {
  const handlePrintWorkOrder = () => {
    window.print();
  };

  const workOrderNo = budget.workOrderNo || `OT-${budget.budgetNumber.replace('PRES-', '')}`;

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-fade-in font-sans max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-150 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900">
                Orden de Trabajo / Hoja de Producción Técnica Taller
              </h2>
              <span className="text-[10px] text-neutral-500 font-mono">Documento Operativo (Sin Valores Financieros)</span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE WORK ORDER SHEET */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-100 rounded-xl border border-neutral-200" id="printable-work-order-document">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-6 text-xs font-sans text-neutral-900">
            {/* WORK ORDER HEADER */}
            <div className="flex items-start justify-between border-b-2 border-amber-500 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Wrench className="w-3 h-3" /> Hoja de Fabricación
                </span>
                <h1 className="text-lg font-black text-neutral-900 uppercase tracking-tight">FacturaDo — Taller & Producción</h1>
                <p className="text-[10px] text-neutral-500 font-mono">Referencia Presupuesto Origen: {budget.budgetNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-amber-700 font-mono">{workOrderNo}</div>
                <div className="text-[10px] font-bold text-neutral-400">Fecha de Emisión: {new Date().toLocaleDateString('es-DO')}</div>
              </div>
            </div>

            {/* PROJECT & CLIENT TARGET */}
            <div className="grid grid-cols-2 gap-4 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 text-[11px]">
              <div>
                <span className="text-[9px] text-amber-800 uppercase font-extrabold block">Proyecto / Obra</span>
                <span className="font-extrabold text-neutral-900">{budget.title}</span>
              </div>
              <div>
                <span className="text-[9px] text-amber-800 uppercase font-extrabold block">Destinatario / Entrega</span>
                <span className="font-bold text-neutral-800">{budget.clientName || 'Cliente General'}</span>
              </div>
            </div>

            {/* TECHNICAL GROUPS AND ITEMS (NO PRICES SHOWN!) */}
            <div className="space-y-4">
              {budget.groups.map((grp, gIdx) => (
                <div key={grp.id} className="space-y-2 border border-neutral-200 rounded-xl p-3 bg-neutral-50/30">
                  <div className="font-extrabold text-xs text-neutral-900 border-b border-neutral-200 pb-1 flex items-center justify-between">
                    <span>#{gIdx + 1}. {grp.name}</span>
                    <span className="text-[9px] font-mono text-neutral-400">{grp.items.length} Insumos/Tareas</span>
                  </div>

                  <table className="w-full text-left text-[11px] divide-y divide-neutral-150">
                    <thead>
                      <tr className="text-[9px] text-neutral-400 uppercase font-bold">
                        <th className="py-1">Especificación Insumo / Recurso</th>
                        <th className="py-1 text-center">Unidad</th>
                        <th className="py-1 text-center">Cantidad Requerida</th>
                        <th className="py-1 text-right">Verificación Taller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {grp.items.map(item => (
                        <tr key={item.id}>
                          <td className="py-1.5 font-bold text-neutral-800">
                            {item.resourceName}
                            {item.inputs && (
                              <div className="text-[9.5px] font-mono text-neutral-500 font-normal">
                                {item.inputs.ancho && item.inputs.alto ? `Medidas: ${item.inputs.ancho}m x ${item.inputs.alto}m` : ''}
                                {item.inputs.factorDesperdicioPct ? ` • Merma: ${item.inputs.factorDesperdicioPct}%` : ''}
                              </div>
                            )}
                          </td>
                          <td className="py-1.5 text-center font-mono text-neutral-600">{item.unit}</td>
                          <td className="py-1.5 text-center font-mono font-bold text-indigo-700 bg-indigo-50/50 rounded">{item.quantityCalculated}</td>
                          <td className="py-1.5 text-right">
                            <span className="inline-block w-4 h-4 border-2 border-neutral-300 rounded" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* TECHNICIAN CHECKLIST & SIGNATURE */}
            <div className="border-t border-neutral-200 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> Control de Calidad y Firma del Encargado
              </h4>
              <div className="grid grid-cols-2 gap-4 text-[10px] pt-4">
                <div className="border-t border-neutral-300 pt-2 text-center text-neutral-500">
                  Firma Técnico Ensamblador / Taller
                </div>
                <div className="border-t border-neutral-300 pt-2 text-center text-neutral-500">
                  Firma Supervisor de Calidad / Entrega
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between border-t border-neutral-150 pt-3 shrink-0">
          <Button variant="outline" onClick={onClose} className="text-xs h-9">
            Cerrar
          </Button>

          <Button
            onClick={handlePrintWorkOrder}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-9 px-4 font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            Imprimir Hoja de Taller
          </Button>
        </div>
      </div>
    </div>
  );
}
