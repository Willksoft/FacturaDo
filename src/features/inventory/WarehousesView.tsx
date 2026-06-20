import React, { useState } from 'react';
import { Warehouse, Product } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Warehouse as WarehouseIcon, Plus, MapPin, Eye, Building, ClipboardList, Package } from 'lucide-react';

interface WarehousesViewProps {
  warehouses: Warehouse[];
  products: Product[];
  addWarehouse: (wh: Omit<Warehouse, 'id' | 'createdAt'>) => Warehouse;
  updateWarehouse: (id: string, fields: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
}

export default function WarehousesView({
  warehouses,
  products,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
}: WarehousesViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [manager, setManager] = useState('');

  // Selected warehouse details to view items inside
  const [selectedWh, setSelectedWh] = useState<Warehouse | null>(warehouses[0] || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newWh = addWarehouse({
      name,
      code: code.toUpperCase(),
      location,
      phone,
      manager,
      isDefault: warehouses.length === 0,
    });

    // Reset and complete
    setName('');
    setCode('');
    setLocation('');
    setPhone('');
    setManager('');
    setModalOpen(false);
    setSelectedWh(newWh);
  };

  // Filter products located in the currently-inspected Warehouse
  const whItems = products.filter(p => p.type === 'Producto' && p.warehouseId === (selectedWh?.id || ''));

  return (
    <div className="space-y-6" id="warehouse-view-root">
      
      {/* GRID LAYOUT FOR WAREHOUSES MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIST OF WAREHOUSES - (1 COLUMN) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">Zonas y Almacenes</h3>
            <Button 
              onClick={() => setModalOpen(true)}
              size="sm" 
              className="bg-black hover:bg-neutral-800 text-white font-semibold text-xs h-8 px-2.5 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nuevo Almacén
            </Button>
          </div>

          <div className="space-y-3">
            {warehouses.map(w => {
              const activeCount = products.filter(p => p.type === 'Producto' && p.warehouseId === w.id).length;
              const totalItemsCount = products.filter(p => p.type === 'Producto' && p.warehouseId === w.id).reduce((acc, currentItem) => acc + currentItem.stock, 0);

              const isInspecting = selectedWh?.id === w.id;

              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWh(w)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between ${
                    isInspecting 
                      ? 'bg-neutral-950 border-neutral-950 text-white shadow-md' 
                      : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-900'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isInspecting ? 'bg-white/15 text-neutral-200' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {w.code}
                    </span>
                    <h4 className="text-sm font-bold block mt-1.5">{w.name}</h4>
                    
                    {w.location && (
                      <span className={`text-xs flex items-center mt-1 leading-none ${isInspecting ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        <MapPin className="w-3 h-3 mr-0.5 shrink-0" />
                        {w.location}
                      </span>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold font-mono block ${isInspecting ? 'text-emerald-400' : 'text-neutral-900'}`}>
                      {totalItemsCount} Pzs
                    </span>
                    <span className={`text-[10px] leading-tight ${isInspecting ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {activeCount} SKU catalogados
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAILED STOCK ITEMS FOR CURRENT SELECTED WAREHOUSE - (2 COLUMNS) */}
        <div className="lg:col-span-2">
          {selectedWh ? (
            <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
              <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center">
                    <WarehouseIcon className="w-4 h-4 mr-2 text-neutral-850" />
                    Inventario en {selectedWh.name} ({selectedWh.code})
                  </CardTitle>
                  <CardDescription className="text-xs">Ubicación Física: {selectedWh.location || 'No especificada'} | Administrador: {selectedWh.manager || 'N/A'}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow>
                      <TableHead className="w-[100px] text-xs text-neutral-700">SKU / SKU</TableHead>
                      <TableHead className="text-xs text-neutral-700">Nombre de Producto</TableHead>
                      <TableHead className="text-right text-xs text-neutral-700">Precio (RD$)</TableHead>
                      <TableHead className="text-center text-xs text-neutral-700">Nivel de Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-neutral-400 py-16 text-xs">
                          No hay productos asignados a este almacén o el stock está totalmente vacío en este local.
                        </TableCell>
                      </TableRow>
                    ) : (
                      whItems.map(p => {
                        const isLow = p.stock <= p.minStock;
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="font-mono text-xs text-neutral-500">{p.code}</TableCell>
                            <TableCell className="font-semibold text-neutral-950 text-xs sm:text-xs leading-none">
                              <div className="flex items-center space-x-2">
                                {p.imageUrl && (
                                  <img src={p.imageUrl} alt={p.name} className="w-7 h-7 rounded object-cover border border-neutral-200" referrerPolicy="no-referrer" />
                                )}
                                <span>{p.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs">{p.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</TableCell>
                            <TableCell className="text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded font-mono font-bold text-xs ${isLow ? 'bg-amber-100 text-amber-900' : 'bg-neutral-100 text-neutral-700'}`}>
                                {p.stock} pzas <span className="opacity-60 text-[10px] font-normal ml-1">/ {p.minStock} min</span>
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white border rounded-xl border-dashed border-neutral-300 p-12 text-center text-xs text-neutral-400">
              Registre o elija un almacén en la lista de la izquierda para ver su stock.
            </div>
          )}
        </div>
      </div>

      {/* DIALOG TO CREATE NEW WAREHOUSE */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-neutral-900">Crear Nuevo Almacén Físico</DialogTitle>
              <DialogDescription className="text-xs">Los productos físicos podrán distribuirse e imputarse a diferentes almacenes para controlar sus stocks por separado.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 col-span-1">
                  <Label htmlFor="wh-code" className="text-xs font-semibold text-neutral-800">Código Corto</Label>
                  <Input id="wh-code" placeholder="Ej. ALM1" value={code} onChange={(e) => setCode(e.target.value)} required />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="wh-name" className="text-xs font-semibold text-neutral-800">Nombre Razón Comercial</Label>
                  <Input id="wh-name" placeholder="Ej. Almacén Central Santiago" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="wh-location" className="text-xs font-semibold text-neutral-800">Ubicación / Dirección Física</Label>
                <Input id="wh-location" placeholder="Av. Duarte esq. Texas, Santiago" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="wh-manager" className="text-xs font-semibold text-neutral-800">Administrador / Encargado</Label>
                  <Input id="wh-manager" placeholder="Ej. Roberto Gómez" value={manager} onChange={(e) => setManager(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="wh-phone" className="text-xs font-semibold text-neutral-800">Teléfono Local</Label>
                  <Input id="wh-phone" placeholder="809-555-4422" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" size="sm" className="bg-black text-white hover:bg-neutral-800">Dar de Alta Almacén</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
