import React, { useState, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, PenTool, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Budget } from '../../../types/budget';

interface BudgetClientSignatureModalProps {
  budget: Budget;
  onSaveSignature: (budgetId: string, signatureDataUrl: string, signerName: string) => void;
  onClose: () => void;
}

export default function BudgetClientSignatureModal({
  budget,
  onSaveSignature,
  onClose
}: BudgetClientSignatureModalProps) {
  const [signerName, setSignerName] = useState(budget.clientName || '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleConfirmSignature = (skipSignature: boolean = false) => {
    const canvas = canvasRef.current;
    const signatureDataUrl = (!skipSignature && canvas && hasSignature) ? canvas.toDataURL('image/png') : '';
    onSaveSignature(budget.id, signatureDataUrl, signerName || 'Aprobado sin Firma');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-lg w-full p-6 space-y-6 shadow-2xl animate-fade-in font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-150 pb-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900">
                Aprobación Rápida & Firma (Opcional)
              </h2>
              <span className="text-[10px] text-neutral-500 font-mono">{budget.budgetNumber} — RD$ {budget.total.toLocaleString('es-DO')}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIGNATURE FORM */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-800">Nombre del Cliente / Representante (Opcional)</label>
            <Input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Ej: Lic. Carlos Pérez (Opcional)"
              className="text-xs h-9 bg-neutral-50"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
              <span>Trazo de Firma (Opcional)</span>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Limpiar Trazo
              </button>
            </div>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl bg-neutral-50 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={460}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[160px] cursor-crosshair touch-none"
              />
              {!hasSignature && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-neutral-400 text-xs font-semibold">
                  Firme aquí si lo desea (Opcional)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER WITH QUICK EXIT */}
        <div className="flex items-center justify-between border-t border-neutral-150 pt-3">
          <Button variant="outline" onClick={onClose} className="text-xs h-9">
            Cancelar
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => handleConfirmSignature(true)}
              className="text-xs h-9 text-neutral-700 hover:bg-neutral-100 font-bold"
            >
              Aprobar Directamente (Sin Firma)
            </Button>
            <Button
              onClick={() => handleConfirmSignature(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              Guardar con Firma
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
