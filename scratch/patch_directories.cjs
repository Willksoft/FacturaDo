const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/contacts/Directories.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add Scan icon to imports
const importTarget = `import { Download, Upload, Plus, Search, Trash2, Edit, FileSpreadsheet, Sparkles, Building, User, Package, Check, CheckCircle2, AlertTriangle, Loader2, Eye, Phone, Mail, MapPin, Calendar, Hash, Tag, DollarSign, Layers, Warehouse as WarehouseIcon, ShieldCheck, Globe, UserCircle } from 'lucide-react';`;
const importReplacement = `import { Download, Upload, Plus, Search, Trash2, Edit, FileSpreadsheet, Sparkles, Building, User, Package, Check, CheckCircle2, AlertTriangle, Loader2, Eye, Phone, Mail, MapPin, Calendar, Hash, Tag, DollarSign, Layers, Warehouse as WarehouseIcon, ShieldCheck, Globe, UserCircle, ScanBarcode, TrendingUp } from 'lucide-react';`;
content = content.replace(importTarget, importReplacement);

// 2. Add barcode scanner state after prodCategory state
const stateTarget = `  const [isCustomCategory, setIsCustomCategory] = useState(false);`;
const stateReplacement = `  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);`;
content = content.replace(stateTarget, stateReplacement);

// 3. Add barcode scan function after resetProductForm
const resetTarget = `  const startEditProduct = (p: Product) => {`;
const resetReplacement = `  // Barcode Scanner using BarcodeDetector API (supported in Chrome/Edge on mobile/desktop)
  const handleScanBarcode = async () => {
    if (!('BarcodeDetector' in window)) {
      // Fallback: prompt for manual input
      const code = prompt('Tu navegador no soporta el lector automático. Ingresa el código de barras manualmente:');
      if (code) setProdCode(code.trim());
      return;
    }
    setIsScanningBarcode(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      const detector = new (window as any).BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'] });
      let found = false;
      const scan = async () => {
        if (found) return;
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) {
          found = true;
          setProdCode(barcodes[0].rawValue);
          stream.getTracks().forEach(t => t.stop());
          setIsScanningBarcode(false);
        } else {
          requestAnimationFrame(scan);
        }
      };
      video.addEventListener('loadeddata', () => scan());
      setTimeout(() => {
        if (!found) {
          stream.getTracks().forEach(t => t.stop());
          setIsScanningBarcode(false);
          alert('No se detectó ningún código. Intente de nuevo acercando el código a la cámara.');
        }
      }, 10000);
    } catch (err) {
      console.error('Barcode scan error', err);
      setIsScanningBarcode(false);
      alert('No se pudo acceder a la cámara. Verifique los permisos del navegador.');
    }
  };

  const startEditProduct = (p: Product) => {`;
content = content.replace(resetTarget, resetReplacement);

// 4. Replace SKU field to include barcode scan button
const skuTarget = `                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="p-code" className="text-xs">Código Corto / SKU</Label>
                    <Input id="p-code" placeholder="Ej. VAR-12" value={prodCode} onChange={(e) => setProdCode(e.target.value)} />
                  </div>`;
const skuReplacement = `                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="p-code" className="text-xs">Código Corto / SKU / Código de Barras</Label>
                    <div className="flex gap-1.5">
                      <Input id="p-code" placeholder="Ej. VAR-12 o escanea 📷" value={prodCode} onChange={(e) => setProdCode(e.target.value)} className="font-mono" />
                      <button
                        type="button"
                        onClick={handleScanBarcode}
                        disabled={isScanningBarcode}
                        title="Escanear código de barras con la cámara"
                        className="shrink-0 h-9 w-9 flex items-center justify-center bg-neutral-950 hover:bg-neutral-700 text-white rounded-md border border-neutral-200 transition-colors disabled:opacity-50"
                      >
                        {isScanningBarcode ? <span className="animate-spin text-[10px]">⟳</span> : <ScanBarcode className="w-4 h-4" />}
                      </button>
                    </div>
                    {isScanningBarcode && (
                      <p className="text-[10px] text-blue-600 animate-pulse font-medium">📷 Apunta la cámara al código de barras del producto...</p>
                    )}
                  </div>`;
content = content.replace(skuTarget, skuReplacement);

// 5. Add live margin widget between cost/price/tax grid and category
const costGridTarget = `                {/* Categoría / Departamento de Producto */}`;
const marginWidget = `                {/* LIVE PROFIT MARGIN WIDGET */}
                {Number(prodCost) > 0 && Number(prodPrice) > 0 && (() => {
                  const cost = Number(prodCost);
                  const price = Number(prodPrice);
                  const profit = price - cost;
                  const margin = ((profit / price) * 100);
                  const markup = ((profit / cost) * 100);
                  const isGood = margin >= 30;
                  const isWarning = margin >= 10 && margin < 30;
                  return (
                    <div className={\`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs \${isGood ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : isWarning ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-red-900'}\`}>
                      <div className="flex items-center gap-1.5 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Ganancia neta: <strong className="font-mono">RD$ {profit.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                      </div>
                      <div className="flex gap-2 font-mono text-[10px] font-bold">
                        <span className="bg-white/70 px-1.5 py-0.5 rounded border border-current/20">Margen {margin.toFixed(1)}%</span>
                        <span className="bg-white/70 px-1.5 py-0.5 rounded border border-current/20">Markup {markup.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Categoría / Departamento de Producto */}`;
content = content.replace(costGridTarget, marginWidget);

// 6. Add margin column to the product TABLE header (after ITBIS column)
const tableHeadTarget = `                <TableHead className="text-center text-xs font-semibold text-neutral-700">ITBIS</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Stock</TableHead>`;
const tableHeadReplacement = `                <TableHead className="text-center text-xs font-semibold text-neutral-700">ITBIS</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Margen</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Stock</TableHead>`;
content = content.replace(tableHeadTarget, tableHeadReplacement);

// 7. Add margin badge cell in table rows (after ITBIS cell)
const tableTaxCellTarget = `                      <TableCell className="text-center text-xs text-neutral-500 font-mono">{p.taxRate}%</TableCell>
                      <TableCell className="text-center">`;
const tableTaxCellReplacement = `                      <TableCell className="text-center text-xs text-neutral-500 font-mono">{p.taxRate}%</TableCell>
                      <TableCell className="text-center">
                        {p.cost > 0 && p.price > 0 ? (() => {
                          const margin = ((p.price - p.cost) / p.price) * 100;
                          return (
                            <span className={\`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold font-mono \${margin >= 30 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : margin >= 10 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-800 border border-red-200'}\`}>
                              {margin.toFixed(0)}%
                            </span>
                          );
                        })() : <span className="text-[10px] text-neutral-400">—</span>}
                      </TableCell>
                      <TableCell className="text-center">`;
content = content.replace(tableTaxCellTarget, tableTaxCellReplacement);

// 8. Update colSpan for empty state from 8 to 9
const colSpanTarget = `                  <TableCell colSpan={8} className="text-center text-neutral-400 py-12 text-sm">
                    No hay productos o servicios registrados.
                  </TableCell>`;
const colSpanReplacement = `                  <TableCell colSpan={9} className="text-center text-neutral-400 py-12 text-sm">
                    No hay productos o servicios registrados.
                  </TableCell>`;
content = content.replace(colSpanTarget, colSpanReplacement);

fs.writeFileSync(file, content);
console.log('Directories.tsx updated: barcode scanner + profit margin + informal improvements.');
