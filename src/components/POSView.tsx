import React, { useState, useMemo } from 'react';
import { Product, Client, Seller, NcfSequence, PaymentMethod, FinancialAccount, UserPermission, TemplateSettings, Shift, Receipt } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { ShoppingCart, Package, Users, Receipt as ReceiptIcon, CreditCard, Landmark, Check, Trash2, Search, Printer, FileText, CheckCircle2, AlertTriangle, Loader2, PlayCircle, StopCircle, Calculator, Clock } from 'lucide-react';
import { generateInvoicePDF } from '../lib/pdfGenerator';
import { getDgiiAutocomplete, validateDgiiRnc } from '../lib/dgiiApi';

interface POSViewProps {
  products: Product[];
  clients: Client[];
  sellers?: Seller[];
  ncfSequences: NcfSequence[];
  financialAccounts: FinancialAccount[];
  currentUser: UserPermission;
  createInvoiceOrQuote: (invoice: any) => any;
  payInvoice: (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string, accountId?: string) => void;
  warehouses: any[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client | Promise<Client>;
  templateSettings: TemplateSettings;
  activeShift: Shift | null;
  addShift: (sh: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  receipts: Receipt[];
  onNavigateToTurnos?: () => void;
}

export default function POSView({
  products,
  clients,
  sellers = [],
  ncfSequences,
  financialAccounts,
  currentUser,
  createInvoiceOrQuote,
  payInvoice,
  warehouses,
  addClient,
  templateSettings,
  activeShift,
  addShift,
  updateShift,
  receipts,
  onNavigateToTurnos,
}: POSViewProps) {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients.some(c => c.id === 'cli-consumo') ? 'cli-consumo' : (clients[0]?.id || 'cli-consumo'));
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [docType, setDocType] = useState<'Factura' | 'Cotizacion'>('Factura');
  const [selectedNcfType, setSelectedNcfType] = useState<string>('B02'); // Consumer standard B02 by default (corrected from 02)
  const [paymentNotes, setPaymentNotes] = useState('');

  // Shift/Turn Opening/Closing Local States
  const [openingBalance, setOpeningBalance] = useState('0');
  const [selectedCajaId, setSelectedCajaId] = useState('');
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [closingBalanceActual, setClosingBalanceActual] = useState('');
  const [selectedShiftSellerId, setSelectedShiftSellerId] = useState('');

  // Shift helpers and computations
  const cajas = useMemo(() => financialAccounts.filter(acc => acc.type === 'Caja'), [financialAccounts]);

  const activeShiftCashPayments = useMemo(() => {
    if (!activeShift) return 0;
    return receipts
      .filter(r => {
        const isAfterStart = new Date(r.date) >= new Date(activeShift.startTime);
        const isCash = r.paymentMethod === 'Efectivo';
        const isThisCaja = r.accountId === activeShift.cajaId;
        return isAfterStart && isCash && isThisCaja;
      })
      .reduce((sum, r) => sum + r.amountPaid, 0);
  }, [activeShift, receipts]);

  const expectedClosingBalance = useMemo(() => {
    if (!activeShift) return 0;
    return activeShift.openingBalance + activeShiftCashPayments;
  }, [activeShift, activeShiftCashPayments]);

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCajaId) {
      alert('Por favor seleccione una caja física para operar.');
      return;
    }
    const chosenSeller = sellers.find(s => s.id === selectedShiftSellerId);
    if (!selectedShiftSellerId || !chosenSeller) {
      alert('Por favor seleccione un vendedor para abrir el turno.');
      return;
    }
    addShift({
      startTime: new Date().toISOString(),
      openingBalance: parseFloat(openingBalance) || 0,
      openedById: chosenSeller.id,
      openedByName: chosenSeller.name,
      status: 'Abierto',
      cajaId: selectedCajaId
    });
    setOpeningBalance('0');
    setSelectedCajaId('');
    setSelectedShiftSellerId('');
  };

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    const actual = parseFloat(closingBalanceActual) || 0;
    const discrepancy = actual - expectedClosingBalance;

    updateShift(activeShift.id, {
      endTime: new Date().toISOString(),
      closingBalanceActual: actual,
      closingBalanceExpected: expectedClosingBalance,
      discrepancy,
      closedById: currentUser.id,
      closedByName: currentUser.username,
      status: 'Cerrado'
    });
    setClosingBalanceActual('');
    setShowCloseShiftModal(false);
  };

  // Quick Client States
  const [showQuickClient, setShowQuickClient] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickRnc, setQuickRnc] = useState('');
  const [quickType, setQuickType] = useState<'Empresa' | 'Persona Física'>('Empresa');

  // DGII States for quick client
  const [dgiiSuggestions, setDgiiSuggestions] = useState<any[]>([]);
  const [showDgiiSuggestions, setShowDgiiSuggestions] = useState(false);
  const [isSearchingDgii, setIsSearchingDgii] = useState(false);
  const [dgiiValidation, setDgiiValidation] = useState<any | null>(null);
  const [dgiiError, setDgiiError] = useState<string | null>(null);

  const handleQuickNameChange = async (val: string) => {
    setQuickName(val);
    if (!val || val.trim().length < 3) {
      setDgiiSuggestions([]);
      setShowDgiiSuggestions(false);
      return;
    }
    setIsSearchingDgii(true);
    try {
      const typeParam = quickType === 'Persona Física' ? 'cedula' : 'rnc';
      const results = await getDgiiAutocomplete(val, 5, typeParam);
      setDgiiSuggestions(results);
      setShowDgiiSuggestions(results.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingDgii(false);
    }
  };

  const handleValidateQuickRnc = async () => {
    if (!quickRnc) return;
    setIsSearchingDgii(true);
    setDgiiError(null);
    setDgiiValidation(null);
    try {
      const res = await validateDgiiRnc(quickRnc);
      if (res && res.valid) {
        setDgiiValidation(res);
        if (res.data) {
          setQuickName(res.data.nombre);
        }
      } else {
        setDgiiValidation({ valid: false });
        setDgiiError('No encontrado');
      }
    } catch (err) {
      setDgiiError('Error');
    } finally {
      setIsSearchingDgii(false);
    }
  };

  // Complete Payment/Cobro Modal States
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentCash, setPaymentCash] = useState<number>(0);
  const [paymentCard, setPaymentCard] = useState<number>(0);
  const [paymentTransfer, setPaymentTransfer] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number>(0);

  // Completed document review
  const [completedDoc, setCompletedDoc] = useState<any | null>(null);
  const [printSize, setPrintSize] = useState<'Letter' | 'Thermal'>('Letter');

  const handleSaveQuickClient = async () => {
    if (!quickName.trim()) {
      alert('Por favor complete el nombre del cliente.');
      return;
    }
    if (!quickRnc.trim()) {
      alert('Por favor complete el RNC o Cédula.');
      return;
    }
    try {
      const newCli = await addClient({
        name: quickName.trim(),
        rncOrCedula: quickRnc.trim(),
        type: quickType === 'Persona Física' ? 'Fisica' : 'Empresa',
        email: '',
        phone: '',
        address: dgiiValidation?.valid && dgiiValidation?.data?.provincia 
          ? `${dgiiValidation.data.provincia}${dgiiValidation.data.municipio ? `, ${dgiiValidation.data.municipio}` : ''}, R.D.`
          : 'Santo Domingo, R.D.',
        // DGII extracted properties
        dgiiVerified: dgiiValidation?.valid || false,
        dgiiEstatus: dgiiValidation?.data?.estatus || dgiiValidation?.data?.status || null,
        dgiiRegimen: dgiiValidation?.data?.regimen || null,
        dgiiCategoria: dgiiValidation?.data?.categoria || null,
        dgiiActividad: dgiiValidation?.data?.actividad_economica || null,
        dgiiProvincia: dgiiValidation?.data?.provincia || null,
        dgiiMunicipio: dgiiValidation?.data?.municipio || null,
      });
      if (newCli && newCli.id) {
        setSelectedClientId(newCli.id);
        setShowQuickClient(false);
        setQuickName('');
        setQuickRnc('');
        setQuickType('Empresa');
        setDgiiSuggestions([]);
        setShowDgiiSuggestions(false);
        setDgiiValidation(null);
        setDgiiError(null);
      }
    } catch (e) {
      console.error('Error creating quick client', e);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    if (product.type === 'Producto' && product.stock <= 0) {
      alert(`El producto "${product.name}" no tiene existencias disponibles en almacén.`);
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (product.type === 'Producto' && existing.quantity >= product.stock) {
          alert(`No se puede agregar más unidades. El stock disponible es ${product.stock}.`);
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;
    
    if (item.product.type === 'Producto' && qty > item.product.stock) {
      alert(`Solo hay ${item.product.stock} unidades en existencia de este producto.`);
      return;
    }

    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const getCartTotals = () => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const tax = cart.reduce((acc, item) => {
      const itbisRate = item.product.taxRate / 100;
      const val = item.product.price * item.quantity;
      return acc + (val * itbisRate);
    }, 0);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = getCartTotals();

  // Initiates checkout
  const handleCheckoutInitiate = () => {
    if (cart.length === 0) {
      alert('Por favor agregue por lo menos un producto al carrito de compras.');
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    if (!client) {
      alert('Seleccione un cliente para confeccionar el documento.');
      return;
    }

    if (docType === 'Cotizacion') {
      // Create Cotizacion immediately
      const invoiceItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        taxRate: item.product.taxRate,
        warehouseId: item.product.warehouseId || undefined,
      }));

      const newDoc = createInvoiceOrQuote({
        clientId: selectedClientId,
      sellerId: selectedSellerId || undefined,
        type: 'Cotizacion',
        items: invoiceItems,
        discount: 0,
        notes: paymentNotes || 'Cotización generada en el Punto de Venta POS',
      });

      if (!newDoc) {
        alert('Error al generar la cotización.');
        return;
      }

      setCompletedDoc({
        ...newDoc,
        paymentMethod: 'Cotización',
        totalPaid: 0,
        accountName: 'N/A'
      });

      setCart([]);
      setPaymentNotes('');
    } else {
      // It is a Factura: Open the complete mixed payment cash register modal
      setPaymentCash(total);
      setPaymentCard(0);
      setPaymentTransfer(0);
      setCashReceived(total);
      setShowCheckoutModal(true);
    }
  };

  // Finalizes checkout with full mixed payment breakdown
  const handleFinalizeMixedCheckout = () => {
    const totalPayments = paymentCash + paymentCard + paymentTransfer;
    const diff = Math.abs(totalPayments - total);
    
    if (diff > 0.05) {
      alert(`La suma de los pagos (${totalPayments.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}) debe ser igual al total de la venta (${total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}).`);
      return;
    }

    if (paymentCash > 0 && cashReceived < paymentCash) {
      alert('El efectivo entregado es menor que el monto a pagar en efectivo.');
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    if (!client) {
      alert('Seleccione un cliente válido.');
      return;
    }

    const invoiceItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      taxRate: item.product.taxRate,
      warehouseId: item.product.warehouseId || undefined,
    }));

    const newDoc = createInvoiceOrQuote({
      clientId: selectedClientId,
      sellerId: selectedSellerId || undefined,
      type: 'Factura',
      ncfType: selectedNcfType,
      items: invoiceItems,
      discount: 0,
      notes: paymentNotes || 'Venta realizada a través de terminal POS del Punto de Venta',
    });

    if (!newDoc) {
      alert('Error interno al generar el documento de venta.');
      return;
    }

    // Register active payment chunks to specific financial accounts
    // Select accounts by type or id
    const cashAccount = financialAccounts.find(a => a.type === 'Caja' || a.id === 'acc-1') || financialAccounts[0];
    const cardAccount = financialAccounts.find(a => a.type === 'Verifone' || a.id === 'acc-3') || financialAccounts[0];
    const bankAccount = financialAccounts.find(a => a.type === 'Banco' || a.id === 'acc-2') || financialAccounts[0];

    const actualPaymentsRecorded: { method: string; amount: number; account: string }[] = [];

    if (paymentCash > 0) {
      payInvoice(newDoc.id, paymentCash, 'Efectivo', paymentNotes, cashAccount?.id);
      actualPaymentsRecorded.push({ method: 'Efectivo', amount: paymentCash, account: cashAccount?.name || 'Caja Principal' });
    }
    if (paymentCard > 0) {
      payInvoice(newDoc.id, paymentCard, 'Tarjeta', paymentNotes, cardAccount?.id);
      actualPaymentsRecorded.push({ method: 'Tarjeta', amount: paymentCard, account: cardAccount?.name || 'Verifone' });
    }
    if (paymentTransfer > 0) {
      payInvoice(newDoc.id, paymentTransfer, 'Transferencia', paymentNotes, bankAccount?.id);
      actualPaymentsRecorded.push({ method: 'Transferencia', amount: paymentTransfer, account: bankAccount?.name || 'Popular Pesos' });
    }

    // Set complete status for printable invoice ticket
    setCompletedDoc({
      ...newDoc,
      paymentMethod: 'Pagos Mixtos',
      actualPaymentsRecorded,
      paymentCash,
      paymentCard,
      paymentTransfer,
      cashReceived,
      changeReturned: Math.max(0, cashReceived - paymentCash),
      totalPaid: total,
    });

    // Reset parameters
    setCart([]);
    setPaymentNotes('');
    setShowCheckoutModal(false);
  };

  if (!activeShift) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in" id="pos-shift-blocker">
        <Card className="border-red-200 shadow-lg bg-white overflow-hidden rounded-2xl">
          <CardHeader className="bg-red-50 border-b border-red-150 p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-550 flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-red-950">Apertura de Turno Obligatoria</CardTitle>
            <CardDescription className="text-xs text-red-800">
              Para poder vender y facturar en la terminal POS, es obligatorio iniciar un turno de caja para control y cuadre de efectivo.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleOpenShift} className="space-y-4 font-sans text-xs">
              <div className="space-y-2">
                <Label className="text-neutral-800 font-bold block">Caja a Operar *</Label>
                <Select value={selectedCajaId} onValueChange={setSelectedCajaId}>
                  <SelectTrigger className="w-full h-10 bg-white border border-neutral-250 font-bold text-neutral-850 focus:ring-1 focus:ring-black">
                    <SelectValue placeholder="Seleccionar Caja Física...">
                      {cajas.find(c => c.id === selectedCajaId)?.name || selectedCajaId}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs bg-white">
                    {cajas.map(c => (
                      <SelectItem key={c.id} value={c.id} className="text-xs font-bold text-neutral-855">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-800 font-bold block">Vendedor Asignado *</Label>
                <Select value={selectedShiftSellerId} onValueChange={setSelectedShiftSellerId}>
                  <SelectTrigger className="w-full h-10 bg-white border border-neutral-250 font-bold text-neutral-850 focus:ring-1 focus:ring-black">
                    <SelectValue placeholder="Seleccionar Vendedor...">
                      {sellers.find(s => s.id === selectedShiftSellerId)?.name || selectedShiftSellerId}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs bg-white">
                    {sellers.filter(s => s.isActive).map(seller => (
                      <SelectItem key={seller.id} value={seller.id} className="text-xs font-bold text-neutral-855">
                        {seller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-800 font-bold block">Fondo Inicial (Menudo / Caja Chica) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-neutral-450">RD$</span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={openingBalance} 
                    onChange={e => setOpeningBalance(e.target.value)}
                    required 
                    className="h-10 pl-11 text-xs font-bold font-mono focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 rounded-lg shadow-sm">
                  <PlayCircle className="w-4 h-4" />
                  Abrir Turno de Caja
                </Button>
                {onNavigateToTurnos && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onNavigateToTurnos}
                    className="w-full h-10 text-neutral-600 font-semibold text-xs border border-neutral-300 hover:bg-neutral-50 rounded-lg"
                  >
                    Ver Historial de Turnos
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="pos-terminal-root">
      {/* ACTIVE SHIFT STATUS BANNER */}
      {activeShift && (
        <div className="bg-neutral-900 text-white rounded-xl p-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans shadow-sm border border-neutral-800">
          <div className="flex items-center space-x-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <PlayCircle className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase text-[10px] tracking-wider text-emerald-400">Turno en Operación</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="font-semibold text-neutral-200 mt-0.5">
                Caja: <span className="text-white font-extrabold">{cajas.find(c => c.id === activeShift.cajaId)?.name || 'Caja General'}</span> • 
                Cajero: <span className="text-white font-extrabold">{activeShift.openedByName}</span> • 
                Fondo Inicial: <span className="font-mono text-neutral-300">RD$ {activeShift.openingBalance.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setClosingBalanceActual(String(expectedClosingBalance));
                setShowCloseShiftModal(true);
              }}
              className="h-8 text-[11px] font-bold bg-red-650 hover:bg-red-755 text-white flex items-center gap-1.5 rounded-lg transition-all"
            >
              <StopCircle className="w-3.5 h-3.5" />
              Cerrar Turno (Cuadre)
            </Button>
          </div>
        </div>
      )}

      {/* PROFESSIONAL SHIFT CLOSE & CASH CLOSURE MODAL */}
      {showCloseShiftModal && activeShift && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-250 overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-red-900 text-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200">Cierre de Turno y Cuadre de Caja</h3>
              <p className="text-xl font-black mt-1">Caja: {cajas.find(c => c.id === activeShift.cajaId)?.name || 'Caja General'}</p>
            </div>

            <form onSubmit={handleCloseShift} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div className="flex justify-between font-bold text-neutral-600">
                  <span>Fondo Inicial:</span>
                  <span className="font-mono text-neutral-900">{activeShift.openingBalance.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-600">
                  <span>Ventas en Efectivo:</span>
                  <span className="font-mono text-neutral-900">{activeShiftCashPayments.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between font-extrabold text-neutral-900 pt-2 border-t border-neutral-250 border-dashed text-sm">
                  <span>Efectivo Esperado:</span>
                  <span className="font-mono text-blue-700">{expectedClosingBalance.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-neutral-800 font-bold block">Efectivo Real en Caja *</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={closingBalanceActual} 
                  onChange={e => setClosingBalanceActual(e.target.value)}
                  required 
                  className="text-lg bg-neutral-50 font-mono h-11 border-neutral-300 focus:ring-1 focus:ring-black"
                  placeholder="Ej. 15000"
                />
                <span className="text-[10px] text-neutral-500 block">Indique la cantidad total de dinero físico contado en la caja registradora.</span>
              </div>

              {closingBalanceActual && (
                <div className="p-3.5 rounded-xl border flex justify-between items-center bg-neutral-50 border-neutral-200">
                  <span className="font-bold text-neutral-700">Diferencia / Descuadre:</span>
                  <span className={`font-mono font-bold text-sm ${(parseFloat(closingBalanceActual) || 0) - expectedClosingBalance === 0 ? 'text-emerald-750' : 'text-red-700'}`}>
                    {((parseFloat(closingBalanceActual) || 0) - expectedClosingBalance).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                  </span>
                </div>
              )}

              <div className="flex space-x-2 pt-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-9 font-bold"
                  onClick={() => {
                    setShowCloseShiftModal(false);
                    setClosingBalanceActual('');
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="destructive" 
                  className="h-9 font-bold flex items-center gap-1 bg-red-650 hover:bg-red-750"
                >
                  <StopCircle className="w-4 h-4" />
                  Cerrar Turno y Guardar Cuadre
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* PROFESSIONAL MULTIPLE SPLIT-PAYMENTS COBRO DIALOG */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-250 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-neutral-900 text-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Procesamiento del Cobro y Registro en Caja</h3>
              <p className="text-2xl font-black tracking-tight text-white mt-1">Total a Registrar: {total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</p>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Sale Info Summary */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-neutral-550 font-bold block uppercase text-[9px] mb-0.5">Cliente Relacionado</span>
                  <span className="font-extrabold text-neutral-900 text-sm">
                    {clients.find(c => c.id === selectedClientId)?.name || 'Cliente de Consumo'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-550 font-bold block uppercase text-[9px] mb-0.5">Comprobante Fiscal</span>
                  <span className="font-mono font-bold text-neutral-900 text-xs bg-white px-2 py-0.5 rounded border border-neutral-250">
                    {docType === 'Factura' ? `Comprobante NCF ${selectedNcfType}` : 'Sin Comprobante'}
                  </span>
                </div>
              </div>

              {/* Mixed Payment Split Settings */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-800 uppercase tracking-widest text-[9.5px]">Distribución de Fondos Cobrados (Pagos Mixtos)</h4>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* Cash Split input */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <label className="font-bold text-[10px] text-neutral-500 uppercase block">Moneda / Efectivo</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono font-semibold text-neutral-450">RD$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={paymentCash || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPaymentCash(val);
                          setCashReceived(Math.max(val, cashReceived));
                        }}
                        className="w-full text-right bg-white border border-neutral-250 font-mono font-bold text-neutral-900 rounded-md py-1 px-2 h-8 text-xs focus:ring-1 focus:ring-neutral-950"
                      />
                    </div>
                  </div>

                  {/* Card Split input */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <label className="font-bold text-[10px] text-neutral-500 uppercase block">Tarjeta / Verifone</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono font-semibold text-neutral-450">RD$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={paymentCard || ''}
                        onChange={(e) => setPaymentCard(parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-white border border-neutral-250 font-mono font-bold text-neutral-900 rounded-md py-1 px-2 h-8 text-xs focus:ring-1 focus:ring-neutral-950"
                      />
                    </div>
                  </div>

                  {/* Bank Transfer split */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <label className="font-bold text-[10px] text-neutral-500 uppercase block">Transferencia Popular</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono font-semibold text-neutral-450">RD$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={paymentTransfer || ''}
                        onChange={(e) => setPaymentTransfer(parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-white border border-neutral-250 font-mono font-bold text-neutral-900 rounded-md py-1 px-2 h-8 text-xs focus:ring-1 focus:ring-neutral-950"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash hand over and change calculator */}
              {paymentCash > 0 && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-250 rounded-xl grid grid-cols-2 gap-4 animate-fade-in animate-duration-150">
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-emerald-800 uppercase block">Efectivo Entregado por Cliente</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-emerald-700">RD$</span>
                      <input
                        type="number"
                        min="0"
                        value={cashReceived || ''}
                        onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-white border border-emerald-300 font-mono font-black text-emerald-950 rounded-md py-1.5 px-3 h-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-emerald-800 uppercase block">Devuelta / Cambio Correspondiente</label>
                    <div className="h-9 px-3 bg-emerald-100/50 border border-emerald-200 rounded-md flex items-center justify-end">
                      <span className="font-mono text-sm font-black text-emerald-900">
                        {Math.max(0, cashReceived - paymentCash).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Status Indicator */}
              {(() => {
                const totalEntered = paymentCash + paymentCard + paymentTransfer;
                const diffValue = total - totalEntered;
                const isMatched = Math.abs(diffValue) <= 0.05;

                return (
                  <div className="p-1 rounded-xl flex items-center justify-between text-xs transition-all font-sans">
                    {isMatched ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center text-emerald-800 w-full font-bold">
                        <span>Pago validado de forma satisfactoria. Listo para emitir en el sistema.</span>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex flex-col justify-between text-red-800 w-full border">
                        <span className="font-bold">La conciliación de montos es parcial.</span>
                        <div className="flex justify-between mt-1.5 text-[11px] font-sans font-medium text-red-700">
                          <span>Suma Registrada: {totalEntered.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                          <span>{diffValue > 0 ? `Pendiente por distribuir: RD$ ${diffValue.toFixed(2)}` : `Sobrante no conciliable: RD$ ${Math.abs(diffValue).toFixed(2)}`}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex justify-end space-x-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCheckoutModal(false)}
                className="h-9 text-xs px-4 border-neutral-300 font-bold"
              >
                Volver al Carrito
              </Button>
              <Button
                type="button"
                onClick={handleFinalizeMixedCheckout}
                disabled={Math.abs((paymentCash + paymentCard + paymentTransfer) - total) > 0.05}
                className="bg-neutral-950 text-white hover:bg-neutral-900 h-9 text-xs px-5 font-bold rounded-lg transition-all"
              >
                Registrar Venta y Finalizar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION TICKET PREVIEW */}
      {completedDoc && (
        <Card className="border-neutral-200 shadow-xl bg-white max-w-md mx-auto rounded-xl overflow-hidden animate-fade-in my-6">
          <CardHeader className="bg-neutral-950 text-white text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3 shadow">
              <Check className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Procesado con Éxito</CardTitle>
            <CardDescription className="text-xs text-neutral-450">
              {completedDoc.type === 'Factura' 
                ? `Venta comercial ${completedDoc.invoiceNumber} registrada` 
                : `Presupuesto ${completedDoc.quoteNumber} guardado`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Visual ticket preview of payment */}
            <div id="pos-thermal-ticket" className="text-xs space-y-2.5 border border-dashed border-neutral-300 pb-4 max-w-sm mx-auto font-sans bg-neutral-50 p-4 rounded-xl">
              <div className="text-center border-b border-neutral-250 pb-2 mb-2 text-neutral-850">
                <div className="font-black uppercase text-[11px] tracking-tight leading-tight text-neutral-900">{templateSettings.businessName}</div>
                <div className="text-[9px] text-neutral-500 font-mono mt-0.5">RNC: {templateSettings.businessRNC}</div>
                <div className="text-[8px] text-neutral-500 leading-tight mt-0.5">{templateSettings.businessAddress}</div>
                <div className="font-bold tracking-widest uppercase text-[9px] mt-2 pt-2 border-t border-dashed border-neutral-200 text-neutral-800">
                  {completedDoc.type === 'Cotizacion' ? 'Cotización / Presupuesto' : 'Factura de Venta / POS'}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-505">Razón Social:</span>
                <span className="font-extrabold text-neutral-900">{completedDoc.client.name}</span>
              </div>
              {completedDoc.ncf && (
                <div className="flex justify-between">
                  <span className="text-neutral-505">NCF Control:</span>
                  <span className="font-mono font-bold text-neutral-900 bg-white px-1 py-0.5 border rounded text-[10px]">{completedDoc.ncf}</span>
                </div>
              )}
              
              <div className="border-t border-neutral-200 border-dashed my-2 pt-2">
                <h5 className="font-extrabold text-[9px] uppercase text-neutral-400 mb-1 leading-none tracking-wider">Detalles de Operación</h5>
                <div className="flex justify-between text-neutral-600 mt-1">
                  <span>Monto Neto:</span>
                  <span className="font-mono">{completedDoc.subtotal.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>ITBIS Regulado (18%):</span>
                  <span className="font-mono">{completedDoc.taxAmount?.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between text-[13px] font-black text-neutral-950 pt-1.5 border-t border-neutral-250 mt-1">
                  <span>TOTAL COBRADO:</span>
                  <span className="font-mono">{completedDoc.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
              </div>

              {completedDoc.type === 'Factura' && (
                <div className="border-t border-neutral-200 border-dashed pt-2.5 mt-2 space-y-1">
                  <h5 className="font-extrabold text-[9px] uppercase text-neutral-400 mb-1.5 leading-none tracking-wider">Desglose de Formas de Pago</h5>
                  
                  {completedDoc.paymentCash > 0 && (
                    <div className="flex justify-between text-neutral-700">
                      <span>Efectivo Registrado:</span>
                      <span className="font-mono font-semibold">{completedDoc.paymentCash.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                    </div>
                  )}

                  {completedDoc.paymentCard > 0 && (
                    <div className="flex justify-between text-neutral-700">
                      <span>Tarjetas / Verifone:</span>
                      <span className="font-mono font-semibold">{completedDoc.paymentCard.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                    </div>
                  )}

                  {completedDoc.paymentTransfer > 0 && (
                    <div className="flex justify-between text-neutral-700">
                      <span>Bancos / Transferencia:</span>
                      <span className="font-mono font-semibold">{completedDoc.paymentTransfer.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                    </div>
                  )}

                  {completedDoc.paymentCash > 0 && (
                    <div className="flex justify-between text-emerald-800 bg-emerald-50/50 p-2 rounded border border-emerald-200 font-bold mt-2 text-[10px] leading-tight">
                      <span>Efectivo Entregado:</span>
                      <span className="font-mono">
                        {completedDoc.cashReceived.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })} (Cambio: RD$ {completedDoc.changeReturned.toFixed(2)})
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Print Selection formats */}
            <div className="bg-neutral-50 border border-neutral-150 p-3.5 rounded-lg text-xs space-y-2.5">
              <label className="font-bold text-[9.5px] uppercase text-neutral-500 tracking-wider block">Diseño de Impresión Fiscal</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPrintSize('Letter')}
                  className={`p-2 rounded-md border text-center transition-all text-[11px] font-bold ${
                    printSize === 'Letter' 
                      ? 'border-neutral-900 bg-neutral-950 text-white' 
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-855'
                  }`}
                >
                  Formato Carta (8.5x11)
                </button>
                <button
                  onClick={() => setPrintSize('Thermal')}
                  className={`p-2 rounded-md border text-center transition-all text-[11px] font-bold ${
                    printSize === 'Thermal' 
                      ? 'border-neutral-900 bg-neutral-950 text-white' 
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-855'
                  }`}
                >
                  Ticket Térmico (80mm)
                </button>
              </div>
            </div>

            {/* Trigger actions */}
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  if (printSize === 'Letter') {
                    generateInvoicePDF(completedDoc, templateSettings);
                  } else {
                    window.print();
                  }
                }}
                className="flex-1 bg-neutral-950 text-white hover:bg-neutral-800 text-xs py-5 font-bold rounded-lg shadow-sm"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Imprimir Factura ({printSize})
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCompletedDoc(null)}
                className="text-neutral-800 border-neutral-300 text-xs font-bold py-5 rounded-lg hover:bg-neutral-50"
              >
                Siguiente Venta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* POS WORKSPACE GRID */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${completedDoc ? 'opacity-30 pointer-events-none' : ''}`} id="pos-grid-workspace">
        {/* PRODUCT CATALOG SEARCH AND GRID (7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-neutral-200 p-2.5 sticky top-0 z-10 shadow-xs" id="pos-search-belt">
            <Search className="w-4 h-4 text-neutral-450 ml-1" />
            <Input 
              type="text" 
              placeholder="Digite códigos de barras, SKU o nombres para buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-xs placeholder:text-neutral-400 h-8"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 overflow-y-auto max-h-[580px] pr-1.5" id="pos-catalog-grid">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-xs text-neutral-400 font-semibold bg-white rounded-xl border">
                No se encontraron artículos con la especificación dada.
              </div>
            ) : (
              filteredProducts.map(p => {
                const isOutOfStock = p.type === 'Producto' && p.stock <= 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="flex flex-col text-left bg-white border border-neutral-200 hover:border-neutral-950 rounded-xl overflow-hidden focus:outline-none transition-all hover:shadow-sm"
                  >
                    {/* Product picture box */}
                    <div className="w-full aspect-[4/3] bg-neutral-100 border-b border-neutral-100 relative overflow-hidden flex items-center justify-center shrink-0">
                      {p.imageUrl ? (
                        <img 
                          src={p.imageUrl} 
                          alt={p.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Package className="w-7 h-7 text-neutral-300" />
                      )}
                      
                      <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${p.type === 'Producto' ? 'bg-neutral-950 text-white' : 'bg-neutral-500 text-white'}`}>
                        {p.type}
                      </span>

                      {p.type === 'Producto' && (
                        <span className={`absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                          isOutOfStock ? 'bg-red-500 text-white' : p.stock <= p.minStock ? 'bg-amber-400 text-neutral-900 border border-amber-500' : 'bg-black/60 text-white'
                        }`}>
                          {isOutOfStock ? 'S/S' : `Stock: ${p.stock}`}
                        </span>
                      )}
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono leading-none mb-1">{p.code}</h4>
                        <span className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-tight block">{p.name}</span>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-neutral-100/50 flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-neutral-950">
                          {p.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium">18% ITBIS</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* SHOPPING CART AND BILLING PARAMETERS (5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-neutral-200 shadow-none rounded-xl overflow-hidden">
            <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-3.5 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-neutral-900" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-900">Carrito de Compra ({cart.length})</CardTitle>
              </div>
              {cart.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCart([])}
                  className="h-7 text-[10px] text-neutral-605 hover:text-red-600 font-bold px-2 rounded hover:bg-neutral-100"
                >
                  Vaciar Todo
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-xs text-neutral-400">
                  El carrito está vacío. Haga clic en los productos del catálogo izquierdo para agregarlos.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[220px]">
                  {cart.map(item => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-neutral-900 block truncate">{item.product.name}</span>
                        <span className="text-[10px] text-neutral-505 font-mono">
                          {item.product.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })} c/u
                        </span>
                      </div>

                      <div className="flex items-center space-x-2.5 shrink-0">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center bg-neutral-100 rounded-md border border-neutral-150 h-7 overflow-hidden">
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 h-full hover:bg-neutral-200 text-xs font-bold text-neutral-600 transition-all focus:outline-none"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-mono text-xs text-neutral-850 bg-white font-semibold flex items-center justify-center h-full">
                            {item.quantity}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 h-full hover:bg-neutral-200 text-xs font-bold text-neutral-600 transition-all focus:outline-none"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-neutral-404 hover:text-red-500 rounded-md transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TOTALS BOARD */}
              <div className="bg-neutral-50 border border-neutral-150 p-3 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-550">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono">{subtotal.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between text-neutral-550">
                  <span>ITBIS Acumulado:</span>
                  <span className="font-mono">{tax.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-950 pt-1.5 border-t border-neutral-200 border-dashed">
                  <span>Total RD$:</span>
                  <span className="font-mono">{total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                </div>
              </div>

              {/* BILLING PARAMETERS FORM */}

                {/* Vendedor Selector */}
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-350 space-y-2 font-sans">
                  <Label className="text-xs font-black text-neutral-900 block uppercase tracking-wider text-[10.5px]">
                    Vendedor Asignado (Comisión):
                  </Label>
                  <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                    <SelectTrigger className="w-full h-10 bg-white border-neutral-300 font-bold text-neutral-800 text-xs shadow-sm">
                      <SelectValue placeholder="-- Sin vendedor --">
                        {sellers.find(s => s.id === selectedSellerId)?.name || (selectedSellerId === 'none' || !selectedSellerId ? '-- Sin vendedor --' : selectedSellerId)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs italic text-neutral-500">-- Sin vendedor --</SelectItem>
                      {sellers.filter(s => s.isActive).map(seller => (
                        <SelectItem key={seller.id} value={seller.id} className="text-xs font-bold text-neutral-800">
                          {seller.name} {seller.commissionRate ? `(${seller.commissionRate}%)` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              <div className="space-y-3.5 pt-2 border-t border-neutral-100">
                {/* Client Selector (Highly Visible Alert Box with Quick Creation) */}
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-350 space-y-2 font-sans" id="pos-client-selector-highlight">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black text-neutral-900 block uppercase tracking-wider text-[10.5px]">
                      Cliente Asociado a Venta:
                    </Label>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedClientId('cli-consumo')}
                        className="text-[9px] font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                      >
                        Consumo Rápido
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowQuickClient(!showQuickClient)}
                        className="text-[10px] font-extrabold text-blue-750 hover:text-blue-900 flex items-center bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                      >
                        {showQuickClient ? 'Cancelar' : '+ Nuevo'}
                      </button>
                    </div>
                  </div>

                  {showQuickClient ? (
                    <div className="space-y-2 bg-white p-3 rounded-lg border border-neutral-300 shadow-sm" id="quick-client-form">
                      <h4 className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-wider">Nuevo Cliente Especial (POS)</h4>
                      
                      <div className="space-y-0.5 relative">
                        <Label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide">Nombre o Razón Social *</Label>
                        <div className="relative">
                          <Input 
                            placeholder="Ej. Comercializadora Dominicana" 
                            value={quickName} 
                            onChange={(e) => handleQuickNameChange(e.target.value)}
                            onFocus={() => { if (quickName.length >= 3 && dgiiSuggestions.length > 0) setShowDgiiSuggestions(true); }}
                            className="h-8 text-xs bg-neutral-50 border-neutral-250 focus:ring-1 focus:ring-black font-sans"
                          />
                          {isSearchingDgii && !quickRnc && (
                            <span className="absolute right-2 top-2 animate-spin">
                              <Loader2 className="w-3.5 h-3.5 text-neutral-400" />
                            </span>
                          )}
                        </div>

                        {/* Dropdown autocompleter */}
                        {showDgiiSuggestions && dgiiSuggestions.length > 0 && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDgiiSuggestions(false)} />
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-32 overflow-y-auto z-50 divide-y divide-neutral-100 font-sans text-[11px]">
                              {dgiiSuggestions.map((s) => (
                                <div
                                  key={s.id}
                                  className="px-2 py-1.5 hover:bg-neutral-50 cursor-pointer flex justify-between items-center gap-1 text-left"
                                  onClick={() => {
                                    setQuickName(s.nombre);
                                    setQuickRnc(s.id);
                                    setShowDgiiSuggestions(false);
                                    setDgiiValidation({
                                      valid: true,
                                      found_in_dgii: true,
                                      data: s
                                    });
                                  }}
                                >
                                  <div className="min-w-0 text-left">
                                    <span className="font-extrabold text-neutral-800 block truncate">{s.nombre}</span>
                                    <span className="text-[9px] text-neutral-400 font-mono">RNC: {s.id}</span>
                                  </div>
                                  <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded border border-emerald-200 shrink-0">DGII</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5 font-sans">
                          <Label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide">Tipo de Cliente *</Label>
                          <Select 
                            value={quickType} 
                            onValueChange={(val: any) => {
                              setQuickType(val);
                              setDgiiSuggestions([]);
                              setShowDgiiSuggestions(false);
                              setDgiiValidation(null);
                              setDgiiError(null);
                            }}
                          >
                            <SelectTrigger className="w-full h-8 bg-neutral-50 border border-neutral-250 rounded-md text-xs font-semibold text-neutral-800 focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="font-sans text-xs">
                              <SelectItem value="Empresa">Empresa (RNC)</SelectItem>
                              <SelectItem value="Persona Física">Física (Cédula)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-0.5 relative">
                          <div className="flex justify-between items-center font-sans">
                            <Label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide">RNC / Cédula *</Label>
                            <button
                              type="button"
                              onClick={handleValidateQuickRnc}
                              disabled={!quickRnc || isSearchingDgii}
                              className="text-[8px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-1 rounded font-bold cursor-pointer disabled:opacity-50"
                            >
                              {isSearchingDgii && quickRnc ? '...' : 'Consultar'}
                            </button>
                          </div>
                          <div className="relative">
                            <Input 
                              placeholder="Ej. 101850043" 
                              value={quickRnc} 
                              onChange={(e) => {
                                setQuickRnc(e.target.value);
                                if (dgiiValidation) setDgiiValidation(null);
                                if (dgiiError) setDgiiError(null);
                              }}
                              className="h-8 text-xs bg-neutral-50 border-neutral-250 focus:ring-1 focus:ring-black pr-6"
                            />
                            {dgiiValidation?.valid && (
                              <span className="absolute right-1.5 top-2 text-emerald-650">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {dgiiValidation?.valid && (
                        <div className="text-[9px] bg-emerald-50 border border-emerald-150 p-1.5 rounded text-emerald-950 text-left flex items-start gap-1 font-sans">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold block text-emerald-900">Validado DGII</span>
                            <span className="opacity-95 leading-none block text-emerald-800">{dgiiValidation.data?.regimen || 'Listo para facturar'}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-1.5 pt-1.5 justify-end font-sans">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-[10px] text-neutral-500 font-bold hover:bg-neutral-100"
                          onClick={() => {
                            setShowQuickClient(false);
                            setQuickName('');
                            setQuickRnc('');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="button" 
                          size="sm" 
                          className="h-7 text-[10px] font-black bg-[#171717] hover:bg-black text-white px-2.5 rounded-md"
                          onClick={handleSaveQuickClient}
                        >
                          Guardar y Asociar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="font-sans">
                      <Select 
                        value={selectedClientId} 
                        onValueChange={(val) => setSelectedClientId(val)}
                      >
                        <SelectTrigger className="w-full h-10 bg-white border border-neutral-305 rounded-lg text-xs font-extrabold text-neutral-900 focus:ring-2 focus:ring-neutral-950 transition-all shadow-sm">
                          <SelectValue placeholder="Seleccionar Cliente">
                            {clients.find(c => c.id === selectedClientId)?.name || 
                             (selectedClientId === 'cli-consumo' ? 'Cliente de Consumo (Público General)' : selectedClientId)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="font-sans text-xs">
                          {clients.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} {c.id !== 'cli-consumo' ? `(${c.rncOrCedula})` : ''}
                            </SelectItem>
                          ))}
                          {!clients.some(c => c.id === 'cli-consumo') && (
                            <SelectItem value="cli-consumo">
                              Cliente de Consumo (Público General)
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-neutral-500 font-medium font-sans mt-1.5">
                        Importante: Seleccione para asignar el comprobante fiscal NCF al registrar.
                      </p>
                    </div>
                  )}
                </div>

                {/* Dropdown list selector for Document Type */}
                <div className="grid grid-cols-2 gap-2 font-sans">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-neutral-450 block uppercase tracking-wider text-[9.5px]">Documento a Emitir</Label>
                    <Select 
                      value={docType} 
                      onValueChange={(val: any) => setDocType(val)}
                    >
                      <SelectTrigger className="w-full h-9 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-850 focus:ring-2 focus:ring-neutral-950 transition-all shadow-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="font-sans text-xs">
                        <SelectItem value="Factura">Factura Comercial</SelectItem>
                        <SelectItem value="Cotizacion">Cotización / Presupuesto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ncf sequence selector (only used if type is Factura) */}
                  {docType === 'Factura' ? (
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-neutral-450 block uppercase tracking-wider text-[9.5px]">Comprobante Fiscal</Label>
                      <Select 
                        value={selectedNcfType} 
                        onValueChange={(val) => setSelectedNcfType(val)}
                      >
                        <SelectTrigger className="w-full h-9 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-850 focus:ring-2 focus:ring-neutral-950 transition-all shadow-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-sans text-xs">
                          <SelectItem value="B01">B01 - Crédito Fiscal</SelectItem>
                          <SelectItem value="B02">B02 - Consumidor</SelectItem>
                          <SelectItem value="B14">B14 - Regímenes Especiales</SelectItem>
                          <SelectItem value="B15">B15 - Gubernamental</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-1 opacity-50">
                      <Label className="text-xs font-semibold text-neutral-450 block uppercase tracking-wider text-[9.5px]">Comprobante Fiscal</Label>
                      <div className="h-9 rounded-md border border-neutral-200 bg-neutral-50 px-3 flex items-center text-xs text-neutral-400 font-medium select-none">
                        Sin NCF (Presupuesto)
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes Input */}
                <div className="space-y-1 font-sans">
                  <Label htmlFor="pos-notes" className="text-xs font-semibold text-neutral-450 block uppercase tracking-wider text-[9.5px]">
                    Notas Informativas (Ticket/Factura)
                  </Label>
                  <Input 
                    id="pos-notes" 
                    placeholder="Ej. Entregar en despacho directo" 
                    value={paymentNotes} 
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="h-8 text-xs font-sans"
                  />
                </div>

                {/* Submit Action */}
                <Button
                  onClick={handleCheckoutInitiate}
                  disabled={cart.length === 0}
                  className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-black text-xs py-5 rounded-xl transition-all shadow"
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  {docType === 'Factura' ? 'Completar Cobro & Registrar Venta' : 'Guardar Cotización Oficial'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
