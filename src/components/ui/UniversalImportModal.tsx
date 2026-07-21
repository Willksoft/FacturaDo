import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, Sparkles, Layers, FileText, Table, Check, Loader2 } from 'lucide-react';
import { 
  ImportEntityType, 
  SmartImportResult, 
  smartImportClients, 
  smartImportProducts, 
  smartImportProviders, 
  detectEntityType 
} from '../../lib/smartImporter';
import { Client, Product, Provider } from '../../types';

interface UniversalImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEntity?: ImportEntityType;
  onImportClients?: (clients: Omit<Client, 'id' | 'createdAt'>[]) => void;
  onImportProducts?: (products: Omit<Product, 'id' | 'createdAt'>[]) => void;
  onImportProviders?: (providers: Omit<Provider, 'id' | 'createdAt'>[]) => void;
}

export function UniversalImportModal({
  isOpen,
  onClose,
  defaultEntity = 'clients',
  onImportClients,
  onImportProducts,
  onImportProviders,
}: UniversalImportModalProps) {
  const [selectedEntity, setSelectedEntity] = useState<ImportEntityType>(defaultEntity);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<SmartImportResult<any> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setErrorMessage(null);
    setImportResult(null);

    try {
      let result: SmartImportResult<any>;

      if (selectedEntity === 'clients') {
        result = await smartImportClients(selectedFile);
      } else if (selectedEntity === 'products') {
        result = await smartImportProducts(selectedFile);
      } else if (selectedEntity === 'providers') {
        result = await smartImportProviders(selectedFile);
      } else {
        result = await smartImportClients(selectedFile);
      }

      setImportResult(result);
    } catch (err: any) {
      console.error('Smart Import Error:', err);
      setErrorMessage(err.message || 'Error al procesar el archivo. Verifique el formato e intente nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!importResult || importResult.validRecords.length === 0) return;

    if (importResult.entityType === 'clients' && onImportClients) {
      onImportClients(importResult.validRecords);
    } else if (importResult.entityType === 'products' && onImportProducts) {
      onImportProducts(importResult.validRecords);
    } else if (importResult.entityType === 'providers' && onImportProviders) {
      onImportProviders(importResult.validRecords);
    }

    onClose();
    resetState();
  };

  const resetState = () => {
    setFile(null);
    setImportResult(null);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-200 p-0 overflow-hidden font-sans text-left">
        <DialogHeader className="bg-neutral-900 text-white p-6 border-b border-neutral-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              IA Mapeador Inteligente
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            Importación Masiva Universal (.xlsx, .csv, .xml, .txt)
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-300">
            Suba cualquier archivo de hojas de cálculo. Nuestro motor limpiará automáticamente guiones en RNC, formatos monetarios y nombres de columnas.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Entity Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">Tipo de Catálogo a Importar:</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => { setSelectedEntity('clients'); setImportResult(null); setFile(null); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                  selectedEntity === 'clients'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                Clientes
              </button>
              <button
                type="button"
                onClick={() => { setSelectedEntity('products'); setImportResult(null); setFile(null); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                  selectedEntity === 'products'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                Productos / Servicios
              </button>
              <button
                type="button"
                onClick={() => { setSelectedEntity('providers'); setImportResult(null); setFile(null); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                  selectedEntity === 'providers'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                Proveedores
              </button>
            </div>
          </div>

          {/* File Upload Dropzone */}
          {!importResult && (
            <div className="border-2 border-dashed border-neutral-300 hover:border-neutral-800 rounded-2xl p-8 text-center bg-neutral-50/50 hover:bg-neutral-50 transition-all">
              <input
                type="file"
                id="universal-import-input"
                accept=".xlsx, .xls, .csv, .tsv, .txt, .xml"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="universal-import-input" className="cursor-pointer block space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Upload className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">
                    {isProcessing ? 'Analizando campos y desinfectando RNCs...' : 'Haga clic para seleccionar o arrastre su archivo'}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Soporta Excel (.xlsx, .xls), CSV (.csv), TSV (.tsv) y XML (.xml).
                  </p>
                </div>
              </label>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Import Result & Field Mapping Preview */}
          {importResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">
                      ¡Archivo reconocido exitosamente! ({importResult.validRecords.length} filas válidas de {importResult.totalRows})
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      RNCs limpios de guiones, precios formateados y columnas vinculadas.
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setImportResult(null); setFile(null); }}
                  className="text-xs h-8 bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                >
                  Cambiar Archivo
                </Button>
              </div>

              {/* Detected Column Mappings Badges */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-800 block">Columnas Mapeadas Automáticamente:</span>
                <div className="flex flex-wrap gap-2">
                  {importResult.mappings.map((m, i) => (
                    <div key={i} className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-[11px] font-mono border border-neutral-250 flex items-center gap-1.5">
                      <span className="font-bold text-neutral-600">{m.sourceColumn}</span>
                      <span className="text-neutral-400">➔</span>
                      <span className="font-bold text-indigo-700">{m.targetField}</span>
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-800 block">Vista Previa de Datos (Primeros 3 Registros):</span>
                <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white text-xs">
                  <div className="max-h-40 overflow-y-auto divide-y divide-neutral-100">
                    {importResult.validRecords.slice(0, 3).map((rec, i) => (
                      <div key={i} className="p-2.5 font-mono text-[11px] text-neutral-700 bg-neutral-50/50">
                        {JSON.stringify(rec)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-neutral-50 p-4 border-t border-neutral-150 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 bg-white border-neutral-300 text-neutral-700"
          >
            Cancelar
          </Button>
          {importResult && (
            <Button
              onClick={handleConfirmImport}
              disabled={importResult.validRecords.length === 0}
              className="text-xs h-9 bg-black hover:bg-neutral-800 text-white font-bold px-5"
            >
              Confirmar e Importar {importResult.validRecords.length} Registros
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
