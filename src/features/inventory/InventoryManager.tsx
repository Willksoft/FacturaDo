import React, { useState } from 'react';
import { Product, Provider, InventoryMovement } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Package, AlertTriangle, ArrowUpDown, TrendingDown, Sparkles, Filter, Edit, ClipboardCheck, History } from 'lucide-react';

interface InventoryManagerProps {
  products: Product[];
  providers: Provider[];
  updateProduct: (id: string, updated: Partial<Product>) => void;
  currentUser: any;
  inventoryMovements?: InventoryMovement[];
}

export default function InventoryManager({
  products,
  providers,
  updateProduct,
  currentUser,
  inventoryMovements = [],
}: InventoryManagerProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'kardex'>('inventory');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedProviderFilter, setSelectedProviderFilter] = useState('all');

  // Adjust stock inline states
  const [adjustModal, setAdjustModal] = useState(false);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState('0');
  const [adjustType, setAdjustType] = useState<'Ajuste Sellar' | 'Entrada Suministro' | 'Salida Pérdida'>('Entrada Suministro');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Filtering products to represent physical stock items (type === 'Producto')
  const baseProducts = products.filter(p => p.type === 'Producto');

  const filtered = baseProducts.filter(p => {
    const matchesLow = !filterLowStock || p.stock <= p.minStock;
    const matchesProv = selectedProviderFilter === 'all' || p.providerId === selectedProviderFilter;
    return matchesLow && matchesProv;
  });

  // Calculate stats
  const totalStockItems = baseProducts.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = baseProducts.filter(p => p.stock <= p.minStock).length;
  const totalValueAtCost = baseProducts.reduce((acc, p) => acc + (p.cost * p.stock), 0);

  const startAdjustStock = (p: Product) => {
    setTargetProduct(p);
    setAdjustQty('10');
    setAdjustNotes('');
    setAdjustModal(true);
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct) return;

    const value = parseInt(adjustQty) || 0;
    let newStock = targetProduct.stock;

    if (adjustType === 'Entrada Suministro') {
      newStock += value;
    } else if (adjustType === 'Salida Pérdida') {
      newStock = Math.max(0, targetProduct.stock - value);
    } else {
      // Direct rewrite
      newStock = Math.max(0, value);
    }

    updateProduct(targetProduct.id, { stock: newStock, notes: adjustNotes } as any);
    setAdjustModal(false);
    setTargetProduct(null);
  };

  const canEdit = currentUser.permissions.canEditInvoice || currentUser.role === 'Administrador';

  return (
    <div className="space-y-6" id="inventory-watchdog">
      {/* TABS SELECTOR */}
      <div className="flex border-b border-neutral-200">
        <button
          type="button"
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all ${
            activeTab === 'inventory'
              ? 'border-neutral-950 text-neutral-950 font-extrabold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
          onClick={() => setActiveTab('inventory')}
        >
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            Existencias de Almacén
          </span>
        </button>
        <button
          type="button"
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all ${
            activeTab === 'kardex'
              ? 'border-neutral-950 text-neutral-950 font-extrabold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
          onClick={() => setActiveTab('kardex')}
        >
          <span className="flex items-center gap-1.5">
            <History className="w-4 h-4" />
            Historial Kardex
          </span>
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* SUMMARY BOX */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="inventory-metrics-board">
            <Card className="border-neutral-200 shadow-none rounded-xl">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 border border-neutral-150 rounded-lg bg-neutral-55 text-neutral-800">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">Unidades Totales</span>
                  <span className="text-xl font-bold font-mono text-neutral-900">{totalStockItems.toLocaleString()} Pzs</span>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-neutral-200 shadow-none rounded-xl ${lowStockCount > 0 ? 'bg-amber-50 border-amber-250' : ''}`}>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className={`p-2 border rounded-lg ${lowStockCount > 0 ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-neutral-50 text-neutral-600'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">Alertas por Agotamiento</span>
                  <span className="text-xl font-bold font-mono text-neutral-900">{lowStockCount} Artículos</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-none rounded-xl bg-neutral-950 text-white">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 border border-neutral-800 rounded-lg bg-neutral-900 text-neutral-300">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">Costo de Inversión (RD$)</span>
                  <span className="text-xl font-bold font-mono text-white">{totalValueAtCost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FILTERS CONTROL */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Button
                id="toggle-lowstock-filter"
                variant={filterLowStock ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-8 border-neutral-200 bg-white"
                onClick={() => setFilterLowStock(!filterLowStock)}
              >
                <Filter className="w-3.5 h-3.5 mr-1" />
                {filterLowStock ? 'Mostrando: Bajos en Stock' : 'Ver Bajos en Stock'}
              </Button>

              <Select value={selectedProviderFilter} onValueChange={(val) => setSelectedProviderFilter(val)}>
                <SelectTrigger id="provider-inventary-filter" className="text-xs h-8 w-44 bg-neutral-50 border-neutral-200">
                  <SelectValue placeholder="Suplidor">
                    {(val: string | null) => {
                      if (!val || val === 'all') return "Todos los Proveedores";
                      return providers.find(p => p.id === val)?.name || val;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">Todos los Proveedores</SelectItem>
                  {providers.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-neutral-500 flex items-center">
              <ClipboardCheck className="w-4 h-4 mr-1 text-neutral-700" />
              <span>El stock se sincroniza en vivo de cada facturación NCF procesada.</span>
            </div>
          </div>

          {/* INVENTORY TABLE */}
          <Card className="border-neutral-200 shadow-none rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4">
              <CardTitle className="text-sm font-semibold text-neutral-900">Nivel de Inventarios del Negocio</CardTitle>
              <CardDescription className="text-xs">Monitoree la reserva física de sus materiales del almacén central.</CardDescription>
            </CardHeader>

            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow>
                  <TableHead className="w-[110px] text-xs font-semibold text-neutral-700">Código</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Artículos Suministrados</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-neutral-700">Valor Unit. Costo</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-neutral-700">Precio Venta</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-neutral-700">Límite Reorden</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-neutral-700">Existencias Disponibles</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-neutral-700">Estado de Reserva</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-neutral-700">Ajuste Manual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16 text-neutral-400 text-xs">
                      No hay productos que requieran atención en estos momentos.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((prod) => {
                    const isUnderlimit = prod.stock <= prod.minStock;
                    const outOfStock = prod.stock === 0;

                    return (
                      <TableRow key={prod.id} className="hover:bg-neutral-50/50">
                        <TableCell className="font-mono text-xs font-semibold text-neutral-500">{prod.code}</TableCell>
                        <TableCell className="font-semibold text-neutral-900 text-xs sm:text-sm">
                          <div>{prod.name}</div>
                          <div className="flex flex-wrap gap-1 items-center mt-1">
                            {prod.providerId && (
                              <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded border">
                                Suplidor: {providers.find(p => p.id === prod.providerId)?.name || 'Catálogo propio'}
                              </span>
                            )}
                            {(prod as any).batchNumber && (
                              <span className="text-[10px] font-bold font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                Lote: {(prod as any).batchNumber}
                              </span>
                            )}
                            {(prod as any).expiryDate && (
                              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                                new Date((prod as any).expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
                                  ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                Exp: {new Date((prod as any).expiryDate).toLocaleDateString('es-DO')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-neutral-500">
                          {prod.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold text-neutral-900">
                          {prod.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs text-neutral-600">
                          Min: {prod.minStock} Pzs
                        </TableCell>
                        <TableCell className="text-center font-semibold text-xs font-mono">
                          <span className={`inline-flex px-2 py-0.5 rounded ${isUnderlimit ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-neutral-100 text-neutral-800'}`}>
                            {prod.stock} Pzs
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {outOfStock ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                              AGOTADO
                            </span>
                          ) : isUnderlimit ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                              STOCK MÍNIMO
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-150 text-emerald-800 border border-emerald-300">
                              DISPONIBLE
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {canEdit ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[11px] text-neutral-700 border border-neutral-250 bg-neutral-50"
                              onClick={() => startAdjustStock(prod)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Ajustar
                            </Button>
                          ) : (
                            <span className="text-neutral-400 text-[10px]">Bloqueado</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </>
      ) : (
        <Card className="border-neutral-200 shadow-none rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-neutral-900">Historial Kardex de Inventarios</CardTitle>
              <CardDescription className="text-xs">Registro de transacciones físicas, compras, ventas y auditorías manuales.</CardDescription>
            </div>
            <div className="text-xs font-semibold text-neutral-500 flex items-center bg-white border px-3 py-1.5 rounded-lg shadow-sm">
              Total movimientos: {inventoryMovements.length}
            </div>
          </CardHeader>
          
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="text-xs font-semibold text-neutral-700">Fecha</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Producto</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Tipo</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Cantidad</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Stock Previo</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Nuevo Stock</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Concepto / Referencia</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Responsable</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-neutral-400 text-xs">
                    No se han registrado movimientos de inventario todavía.
                  </TableCell>
                </TableRow>
              ) : (
                inventoryMovements.map((mv) => (
                  <TableRow key={mv.id} className="hover:bg-neutral-50/50 text-xs font-sans">
                    <TableCell className="font-mono text-neutral-500">
                      {new Date(mv.createdAt).toLocaleString('es-DO', { hour12: false })}
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-900">{mv.productName}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        mv.type === 'Entrada'
                          ? 'bg-emerald-50 text-emerald-850 border-emerald-200'
                          : mv.type === 'Salida'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {mv.type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold font-mono">
                      {mv.type === 'Entrada' ? '+' : mv.type === 'Salida' ? '-' : ''}{mv.quantity} Pzs
                    </TableCell>
                    <TableCell className="text-center font-mono text-neutral-500">{mv.previousStock} Pzs</TableCell>
                    <TableCell className="text-center font-semibold font-mono text-neutral-900">{mv.newStock} Pzs</TableCell>
                    <TableCell className="font-medium">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-105 text-neutral-600 border font-mono text-[10px]">
                        {mv.referenceType}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-705">{mv.createdByName}</TableCell>
                    <TableCell className="text-neutral-500 italic max-w-xs truncate" title={mv.notes}>
                      {mv.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* QUICK INLINE STOCK ADJUSTER MODAL */}
      <Dialog open={adjustModal} onOpenChange={setAdjustModal}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleApplyAdjustment}>
            <DialogHeader>
              <DialogTitle className="text-base text-neutral-900 font-heading">Ajustar Inventario Manualmente</DialogTitle>
              <DialogDescription className="text-xs">
                Usted está editando el stock de <span className="font-semibold text-black">{targetProduct?.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4 text-xs">
              <div className="space-y-1">
                <Label htmlFor="adj-type" className="text-xs">Tipo de Movimiento</Label>
                <Select value={adjustType} onValueChange={(val: any) => setAdjustType(val)}>
                  <SelectTrigger id="adj-type">
                    <SelectValue>
                      {(val: string | null) => {
                        if (val === 'Entrada Suministro') return "Entrada de Almacén (Abastecimiento)";
                        if (val === 'Salida Pérdida') return "Salida Directa (Rotura, Robo, Pérdida)";
                        if (val === 'Ajuste Sellar') return "Ajuste Físico Auditoría (Sobrescribir Stock)";
                        return val || "";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="Entrada Suministro">Entrada de Almacén (Abastecimiento)</SelectItem>
                    <SelectItem value="Salida Pérdida">Salida Directa (Rotura, Robo, Pérdida)</SelectItem>
                    <SelectItem value="Ajuste Sellar">Ajuste Físico Auditoría (Sobrescribir Stock)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="adj-curr" className="text-xs">Stock Físico Actual</Label>
                  <Input id="adj-curr" value={`${targetProduct?.stock} Piezas`} disabled className="bg-neutral-50" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="adj-qty" className="text-xs">Valor del Ajuste (Numérico) *</Label>
                  <Input id="adj-qty" type="number" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="adj-not" className="text-xs">Razones de Auditoría</Label>
                <Input id="adj-not" placeholder="Ej. Conteo anual de inventario de cemento" value={adjustNotes} onChange={(e) => setAdjustNotes(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => { setAdjustModal(false); setTargetProduct(null); }}>Cancelar</Button>
              <Button type="submit" size="sm" className="bg-black text-white hover:bg-neutral-800">Sellar Ajustes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
