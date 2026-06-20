import React, { useState } from 'react';
import { PurchaseOrder, Provider, Product } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ShoppingCart, Plus, Check, Eye, Trash2, ArrowUpDown, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PurchaseOrdersViewProps {
  purchaseOrders: PurchaseOrder[];
  providers: Provider[];
  products: Product[];
  createPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'poNumber'>) => PurchaseOrder;
  updatePurchaseOrder: (id: string, fields: Partial<PurchaseOrder>) => void;
  updateProduct: (id: string, fields: Partial<Product>) => void;
}

export default function PurchaseOrdersView({
  purchaseOrders,
  providers,
  products,
  createPurchaseOrder,
  updatePurchaseOrder,
  updateProduct,
}: PurchaseOrdersViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [poNotes, setPoNotes] = useState('');
  const [poStatus, setPoStatus] = useState<PurchaseOrder['status']>('Solicitada');
  
  // Basket items states
  const [poItems, setPoItems] = useState<{ productId: string; quantity: number; cost: number }[]>([]);
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentQty, setCurrentQty] = useState('10');
  const [currentCost, setCurrentCost] = useState('0');

  // Currently inspected Purchase Order details
  const [viewingPo, setViewingPo] = useState<PurchaseOrder | null>(purchaseOrders[0] || null);

  const handleAddBasketItem = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentProductId) return;

    const selectedProduct = products.find(p => p.id === currentProductId);
    if (!selectedProduct) return;

    const qty = parseInt(currentQty) || 0;
    const cost = parseFloat(currentCost) || selectedProduct.cost;

    if (qty <= 0) return;

    setPoItems(prev => {
      const existing = prev.find(item => item.productId === currentProductId);
      if (existing) {
        return prev.map(item => item.productId === currentProductId ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { productId: currentProductId, quantity: qty, cost }];
    });

    // Reset single picker
    setCurrentProductId('');
    setCurrentQty('10');
    setCurrentCost('0');
  };

  const handleRemoveBasketItem = (prodId: string) => {
    setPoItems(prev => prev.filter(itm => itm.productId !== prodId));
  };

  const handleProductSelectChange = (pId: string) => {
    setCurrentProductId(pId);
    const prod = products.find(p => p.id === pId);
    if (prod) {
      setCurrentCost(String(prod.cost));
    }
  };

  const handleSavePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (poItems.length === 0) {
      alert('Debe agregar por lo menos un artículo de costo al carrito de compras para generar una orden de compra.');
      return;
    }

    const provider = providers.find(p => p.id === selectedProviderId);
    if (!provider) {
      alert('Seleccione un proveedor suministrante legal.');
      return;
    }

    const subtotalAndTotal = poItems.reduce((acc, itm) => acc + (itm.cost * itm.quantity), 0);

    // Format for state
    const orderItems = poItems.map(itm => {
      const prod = products.find(p => p.id === itm.productId);
      return {
        productId: itm.productId,
        name: prod?.name || 'Art. Desconocido',
        quantity: itm.quantity,
        cost: itm.cost,
        total: itm.cost * itm.quantity,
      };
    });

    const newPO = createPurchaseOrder({
      providerId: provider.id,
      providerName: provider.name,
      items: orderItems,
      subtotal: subtotalAndTotal,
      total: subtotalAndTotal,
      status: poStatus,
      notes: poNotes || 'Orden de reposición de stock autorizada',
    });

    // Update inventory if immediately received
    if (poStatus === 'Recibida') {
      orderItems.forEach(itm => {
        const prod = products.find(p => p.id === itm.productId);
        if (prod) {
          updateProduct(prod.id, { stock: prod.stock + itm.quantity });
        }
      });
    }

    // Reset form states
    setSelectedProviderId('');
    setPoNotes('');
    setPoItems([]);
    setPoStatus('Solicitada');
    setModalOpen(false);
    setViewingPo(newPO);
  };

  const handleStatusChange = (poId: string, status: PurchaseOrder['status']) => {
    // If transitioning to 'Recibida', increment product stock
    if (status === 'Recibida' && viewingPo?.status !== 'Recibida') {
      viewingPo?.items.forEach(itm => {
        const prod = products.find(p => p.id === itm.productId);
        if (prod) {
          updateProduct(prod.id, { stock: prod.stock + itm.quantity });
        }
      });
    }

    updatePurchaseOrder(poId, { status });
    if (viewingPo?.id === poId) {
      setViewingPo(prev => prev ? { ...prev, status } : null);
    }
  };

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Solicitada':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200"><Clock className="w-3" /> {status}</span>;
      case 'Aprobada':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><Clock className="w-3" /> {status}</span>;
      case 'Recibida':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-250"><CheckCircle className="w-3" /> {status}</span>;
      case 'Cancelada':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200"><XCircle className="w-3" /> {status}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" id="po-workbench-root">
      
      {/* ORDERS INDEX VIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PURCHASE ORDERS MASTER LIST - (1 COLUMN) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">Órdenes Realizadas</h3>
            <Button 
              onClick={() => {
                setSelectedProviderId(providers[0]?.id || '');
                setPoItems([]);
                setModalOpen(true);
              }}
              size="sm" 
              className="bg-black text-white hover:bg-neutral-800 font-semibold text-xs h-8 px-2.5 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nueva Orden (OC)
            </Button>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto">
            {purchaseOrders.length === 0 ? (
              <div className="bg-white border text-center p-6 text-xs text-neutral-400 font-medium rounded-xl border-dashed">
                Ninguna orden de compra asentada en el histórico.
              </div>
            ) : (
              purchaseOrders.map(po => {
                const isInspecting = viewingPo?.id === po.id;
                return (
                  <button
                    key={po.id}
                    onClick={() => setViewingPo(po)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                      isInspecting 
                        ? 'bg-neutral-950 border-neutral-950 text-white shadow-md' 
                        : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-900'
                    }`}
                  >
                    <div className="flex justify-between w-full items-start">
                      <div>
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isInspecting ? 'bg-white/15 text-neutral-200' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {po.poNumber}
                        </span>
                        <h4 className="text-xs font-bold block mt-1.5 leading-tight">{po.providerName}</h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold font-mono block">
                          {po.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between w-full items-center pt-1.5 border-t border-dashed border-neutral-200/20">
                      <span className={`text-[10px] ${isInspecting ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        {new Date(po.createdAt).toLocaleDateString('es-DO')}
                      </span>
                      {getStatusBadge(po.status)}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* PO VIEW IN DETAIL - (2 COLUMNS) */}
        <div className="lg:col-span-2">
          {viewingPo ? (
            <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
              <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Detalles del Pedido de Compra: {viewingPo.poNumber}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Proveedor: {viewingPo.providerName} | {providers.find(p => p.id === viewingPo.providerId) ? `RNC: ${providers.find(p => p.id === viewingPo.providerId)?.rnc} |` : ''} Solicitado: {new Date(viewingPo.createdAt).toLocaleDateString('es-DO', { hour: 'numeric', minute: 'numeric' })}
                  </CardDescription>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  {viewingPo.status !== 'Recibida' ? (
                    <Select 
                      value={viewingPo.status} 
                      onValueChange={(val: any) => handleStatusChange(viewingPo.id, val)}
                    >
                      <SelectTrigger className="h-8 text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solicitada">Solicitada</SelectItem>
                        <SelectItem value="Aprobada">Aprobada</SelectItem>
                        <SelectItem value="Recibida">Recibida (Sumar Stock)</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-1 rounded border border-emerald-250">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Stock Ingresado
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow>
                      <TableHead className="text-xs text-neutral-700">Artículos Reabastecidos</TableHead>
                      <TableHead className="text-right text-xs text-neutral-700">Costo Unitario (RD$)</TableHead>
                      <TableHead className="text-center text-xs text-neutral-700">Cantidad</TableHead>
                      <TableHead className="text-right text-xs text-neutral-700">Importe Bruto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingPo.items.map((itm, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-semibold text-neutral-900 text-xs sm:text-xs">
                          {itm.name}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {itm.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs font-bold">{itm.quantity} pzas</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-neutral-900">
                          {(itm.cost * itm.quantity).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* TOTAL PANEL */}
                    <TableRow className="bg-neutral-50/50 font-bold">
                      <TableCell colSpan={3} className="text-right text-neutral-600 font-sans text-xs uppercase">Total de Inversión:</TableCell>
                      <TableCell className="text-right font-mono text-xs font-black text-neutral-950">
                        {viewingPo.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {viewingPo.notes && (
                  <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 text-[11px] text-neutral-600 font-sans">
                    <strong>Notas Adicionales de la Compra:</strong> {viewingPo.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white border rounded-xl border-dashed border-neutral-300 p-12 text-center text-xs text-neutral-400">
              Seleccione una orden de reposición a la izquierda para ver su contenido en detalle.
            </div>
          )}
        </div>
      </div>

      {/* DIALOG TO CREATE NEW PURCHASE ORDER (OC) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSavePo}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-neutral-900">Generar Orden de Compra & Reposición</DialogTitle>
              <DialogDescription className="text-xs">Añada los costos unitarios del proveedor. Una vez configurada como "Recibida", se acumularán las existencias en inventario de forma automática.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-3 text-xs">
              
              {/* SELECT SUPPLIER */}
              <div className="space-y-1">
                <Label htmlFor="po-provider" className="text-xs font-semibold text-neutral-800">Proveedor Distribuidor</Label>
                <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
                  <SelectTrigger id="po-provider" className="h-9">
                    <SelectValue placeholder="Seleccione un Proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} (RNC: {p.rnc})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ITEM BASKET COMPILER PANEL */}
              <div className="border border-neutral-200 rounded-xl p-3 bg-neutral-50/50 space-y-3">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Agregar Producto a la Lista de Carga</label>
                
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6 space-y-1">
                    <span className="text-[10px] font-medium text-neutral-500 block">Producto</span>
                    <Select value={currentProductId} onValueChange={handleProductSelectChange}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Seleccione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.filter(p => p.type === 'Producto').map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3 space-y-1">
                    <span className="text-[10px] font-medium text-neutral-500 block">Cantidad</span>
                    <Input 
                      type="number" 
                      value={currentQty} 
                      onChange={(e) => setCurrentQty(e.target.value)} 
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <span className="text-[10px] font-medium text-neutral-500 block">Costo RD$</span>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={currentCost} 
                      onChange={(e) => setCurrentCost(e.target.value)} 
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button 
                    type="button" 
                    onClick={handleAddBasketItem} 
                    className="h-7 text-[10px] bg-neutral-900 text-white hover:bg-neutral-800"
                  >
                    Añadir Fila de Costo
                  </Button>
                </div>
              </div>

              {/* ACTIVE BASKET PREVIEW */}
              {poItems.length > 0 && (
                <div className="border rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-neutral-50">
                      <TableRow>
                        <TableHead className="text-[10px] py-1.5">Artículos</TableHead>
                        <TableHead className="text-[10px] py-1.5 text-center">Cant</TableHead>
                        <TableHead className="text-[10px] py-1.5 text-right">Costo</TableHead>
                        <TableHead className="text-[10px] py-1.5 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poItems.map((itm, index) => {
                        const product = products.find(p => p.id === itm.productId);
                        return (
                          <TableRow key={index} className="py-1">
                            <TableCell className="text-[11px] font-semibold py-1.5">{product?.name}</TableCell>
                            <TableCell className="text-[11px] font-mono text-center py-1.5">{itm.quantity}</TableCell>
                            <TableCell className="text-[11px] font-mono text-right py-1.5">
                              {itm.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                            </TableCell>
                            <TableCell className="text-right py-1.5">
                              <button 
                                type="button" 
                                onClick={() => handleRemoveBasketItem(itm.productId)}
                                className="text-red-500 hover:text-red-655"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* STATUS & NOTES */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="po-status-sel" className="text-xs font-semibold">Estado de Orden</Label>
                  <Select value={poStatus} onValueChange={(val: any) => setPoStatus(val)}>
                    <SelectTrigger id="po-status-sel" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solicitada">Solicitada (Borrador)</SelectItem>
                      <SelectItem value="Recibida">Recibida (Sumar Stock Ya)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="po-notes" className="text-xs font-semibold">Notas Informativas</Label>
                  <Input 
                    id="po-notes" 
                    placeholder="Ref. Factura nro..." 
                    value={poNotes} 
                    onChange={(e) => setPoNotes(e.target.value)} 
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" size="sm" className="bg-black text-white hover:bg-neutral-800">Radicar Orden de Compra</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
