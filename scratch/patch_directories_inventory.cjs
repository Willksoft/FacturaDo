const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/contacts/Directories.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add State Hooks
const stateTarget = `  const [isScanningBarcode, setIsScanningBarcode] = useState(false);`;
const stateReplacement = `  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isKit, setIsKit] = useState(false);
  const [kitItems, setKitItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [batches, setBatches] = useState<{ batchNumber: string; expirationDate: string; stock: number }[]>([]);
  const [stockLevels, setStockLevels] = useState<{ warehouseId: string; stock: number; minStock: number }[]>([]);`;
if(content.includes(stateTarget)) content = content.replace(stateTarget, stateReplacement);

// 2. Update resetProductForm
const resetTarget = `    setIsCustomCategory(false);
    setProductModalOpen(false);
  };`;
const resetReplacement = `    setIsCustomCategory(false);
    setIsKit(false);
    setKitItems([]);
    setBatches([]);
    setStockLevels([]);
    setProductModalOpen(false);
  };`;
if(content.includes(resetTarget)) content = content.replace(resetTarget, resetReplacement);

// 3. Update startEditProduct
const editTarget = `    setProdCategory(p.category || '');
    setIsCustomCategory(false);
    setProductModalOpen(true);
  };`;
const editReplacement = `    setProdCategory(p.category || '');
    setIsCustomCategory(false);
    setIsKit(p.isKit || false);
    setKitItems(p.kitItems || []);
    setBatches(p.batches || []);
    setStockLevels(p.stockLevels || []);
    setProductModalOpen(true);
  };`;
if(content.includes(editTarget)) content = content.replace(editTarget, editReplacement);

// 4. Update handleSaveProduct
const saveTarget = `      imageUrl: prodImageUrl || undefined,
      category: prodCategory || undefined,
    };`;
const saveReplacement = `      imageUrl: prodImageUrl || undefined,
      category: prodCategory || undefined,
      isKit,
      kitItems,
      batches,
      stockLevels,
    };`;
if(content.includes(saveTarget)) content = content.replace(saveTarget, saveReplacement);

// 5. Inject UI elements in the form
// We inject the Kit toggle right after the Type select
const typeTarget = `                      <SelectContent>
                        <SelectItem value="Producto">Producto</SelectItem>
                        <SelectItem value="Servicio">Servicio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>`;
const typeReplacement = `                      <SelectContent>
                        <SelectItem value="Producto">Producto</SelectItem>
                        <SelectItem value="Servicio">Servicio</SelectItem>
                      </SelectContent>
                    </Select>
                    {prodType === 'Producto' && (
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="is-kit" checked={isKit} onChange={(e) => setIsKit(e.target.checked)} className="w-3 h-3 text-indigo-600 rounded border-gray-300" />
                        <Label htmlFor="is-kit" className="text-[10px] font-bold">Es un Combo/Kit</Label>
                      </div>
                    )}
                  </div>`;
if(content.includes(typeTarget)) content = content.replace(typeTarget, typeReplacement);

// We inject the Kit Items UI if it's a kit
const basicTarget = `                {/* Categoría / Departamento de Producto */}`;
const basicReplacement = `                {isKit && prodType === 'Producto' && (
                  <div className="space-y-1.5 p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-150">
                    <Label className="text-xs font-bold text-indigo-900">Productos del Combo</Label>
                    <div className="space-y-2">
                      {kitItems.map((ki, i) => {
                        const p = products.find(prod => prod.id === ki.productId);
                        return (
                          <div key={i} className="flex gap-2 items-center bg-white p-1 rounded border border-indigo-100">
                            <span className="text-[10px] truncate flex-1 font-semibold pl-1">{p?.name || 'Desconocido'}</span>
                            <Input type="number" value={ki.quantity} onChange={(e) => {
                               const arr = [...kitItems]; arr[i].quantity = Number(e.target.value); setKitItems(arr);
                            }} className="w-16 h-6 text-[10px] text-center" />
                            <button type="button" onClick={() => setKitItems(kitItems.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 px-1 text-[10px] font-bold">x</button>
                          </div>
                        );
                      })}
                      <select onChange={(e) => {
                        if(e.target.value) {
                           setKitItems([...kitItems, { productId: e.target.value, quantity: 1 }]);
                           e.target.value = "";
                        }
                      }} className="w-full text-[10px] h-7 border-indigo-200 rounded">
                        <option value="">+ Añadir producto al combo</option>
                        {products.filter(p => !p.isKit && p.type === 'Producto').map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {/* Categoría / Departamento de Producto */}`;
if(content.includes(basicTarget)) content = content.replace(basicTarget, basicReplacement);

// We inject the Batches UI
const distTarget = `                {prodType === 'Producto' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">`;
const distReplacement = `                {prodType === 'Producto' && (
                  <>
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center">
                         <Label className="text-xs font-semibold text-neutral-800">Lotes y Vencimientos (Opcional)</Label>
                         <button type="button" onClick={() => setBatches([...batches, { batchNumber: '', expirationDate: '', stock: 0 }])} className="text-[9px] font-bold text-indigo-600">+ Lote</button>
                      </div>
                      {batches.length > 0 && (
                        <div className="space-y-2 border border-neutral-200 rounded p-2 bg-white">
                          {batches.map((b, i) => (
                            <div key={i} className="flex gap-1 items-center">
                              <Input placeholder="Lote" value={b.batchNumber} onChange={(e) => { const arr = [...batches]; arr[i].batchNumber = e.target.value; setBatches(arr); }} className="h-6 text-[10px] w-1/3" />
                              <Input type="date" value={b.expirationDate} onChange={(e) => { const arr = [...batches]; arr[i].expirationDate = e.target.value; setBatches(arr); }} className="h-6 text-[10px] w-1/3" />
                              <Input type="number" placeholder="Cant." value={b.stock} onChange={(e) => { const arr = [...batches]; arr[i].stock = Number(e.target.value); setBatches(arr); }} className="h-6 text-[10px] w-1/4" />
                              <button type="button" onClick={() => setBatches(batches.filter((_, idx) => idx !== i))} className="text-red-500 font-bold px-1 text-[10px]">x</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">`;
if(content.includes(distTarget)) content = content.replace(distTarget, distReplacement);


fs.writeFileSync(file, content);
console.log('Directories.tsx patched for Refined Inventory!');
