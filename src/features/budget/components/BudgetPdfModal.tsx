import React from 'react';
import { X, Printer, Download, Share2, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Budget } from '../../../types/budget';

interface BudgetPdfModalProps {
  budget: Budget;
  onClose: () => void;
}

export default function BudgetPdfModal({ budget, onClose }: BudgetPdfModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-fade-in font-sans max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-150 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-neutral-900">
              Vista de Impresión / PDF: {budget.budgetNumber}
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE SHEET VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-100 rounded-xl border border-neutral-200" id="printable-budget-document">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-6 text-xs font-sans text-neutral-900">
            {/* COMPANY & BUDGET HEADER */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <h1 className="text-lg font-black text-indigo-950 uppercase tracking-tight">FacturaDo ERP</h1>
                <p className="text-[10px] text-neutral-500 font-mono">Documento de Presupuesto Técnico Comercial</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-indigo-700">{budget.budgetNumber}</div>
                <div className="text-[10px] font-bold text-neutral-400">Versión: v{budget.version}</div>
                <div className="text-[10px] text-neutral-500">{new Date(budget.createdAt).toLocaleDateString('es-DO')}</div>
              </div>
            </div>

            {/* CLIENT & PROJECT DETAILS */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-3 rounded-lg border border-neutral-150 text-[11px]">
              <div>
                <span className="text-[9px] text-neutral-400 uppercase font-bold block">Cliente</span>
                <span className="font-extrabold text-neutral-900">{budget.clientName || 'Cliente General'}</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 uppercase font-bold block">Proyecto</span>
                <span className="font-bold text-neutral-800">{budget.projectName || budget.title}</span>
              </div>
            </div>

            {/* GROUPS & ITEMS TABLE */}
            <div className="space-y-4">
              {budget.groups.map((grp, gIdx) => (
                <div key={grp.id} className="space-y-1">
                  <div className="font-extrabold text-xs text-indigo-900 border-b border-neutral-200 pb-1">
                    #{gIdx + 1}. {grp.name}
                  </div>
                  <table className="w-full text-left text-[11px] divide-y divide-neutral-150">
                    <thead>
                      <tr className="text-[9px] text-neutral-400 uppercase font-bold">
                        <th className="py-1">Descripción / Recurso</th>
                        <th className="py-1 text-center">Cantidad</th>
                        <th className="py-1 text-right">Precio Unitario</th>
                        <th className="py-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {grp.items.map(item => (
                        <tr key={item.id}>
                          <td className="py-1.5 font-bold text-neutral-800">{item.resourceName}</td>
                          <td className="py-1.5 text-center font-mono">{item.quantityCalculated} {item.unit}</td>
                          <td className="py-1.5 text-right font-mono">RD$ {item.unitPrice.toLocaleString('es-DO')}</td>
                          <td className="py-1.5 text-right font-mono font-bold">RD$ {item.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* TOTALS SUMMARY */}
            <div className="border-t-2 border-neutral-900 pt-3 flex flex-col items-end space-y-1 font-mono text-xs">
              <div className="flex justify-between w-48">
                <span className="text-neutral-500 font-sans text-[11px]">Subtotal:</span>
                <span className="font-bold">RD$ {budget.subtotalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-48">
                <span className="text-neutral-500 font-sans text-[11px]">ITBIS (18%):</span>
                <span className="font-bold">RD$ {budget.taxTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-48 text-sm font-black border-t border-neutral-200 pt-1 text-indigo-950">
                <span className="font-sans">TOTAL:</span>
                <span>RD$ {budget.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* FOOTER & NOTES */}
            {budget.notes && (
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-150 text-[10px] text-neutral-600">
                <span className="font-bold block uppercase text-[9px] text-neutral-400">Notas & Observaciones</span>
                {budget.notes}
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="flex items-center justify-between border-t border-neutral-150 pt-3 shrink-0">
          <Button variant="outline" onClick={onClose} className="text-xs h-9">
            Cerrar
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 px-4 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
