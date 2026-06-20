import { useState, useMemo } from 'react';
import { Product, Client, Seller, Shift, Receipt, PaymentMethod, FinancialAccount } from '../../../types';
import { getDgiiAutocomplete, validateDgiiRnc } from '../../../lib/dgiiApi';

export interface UsePOSProps {
  products: Product[];
  clients: Client[];
  sellers?: Seller[];
  receipts: Receipt[];
  activeShift: Shift | null;
  addShift: (sh: Omit<Shift, 'id'>) => void | Promise<void>;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  createInvoiceOrQuote: (invoice: any) => any;
  payInvoice: (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string, accountId?: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client | Promise<Client>;
  financialAccounts: FinancialAccount[];
  currentUser: any;
  ncfSequences?: any[];
  warehouses?: any[];
  templateSettings?: any;
}

export function usePOS({
  products,
  clients,
  sellers = [],
  receipts,
  activeShift,
  addShift,
  updateShift,
  createInvoiceOrQuote,
  payInvoice,
  addClient,
  financialAccounts,
  currentUser,
  ncfSequences,
  warehouses,
  templateSettings
}: UsePOSProps) {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients.some(c => c.id === 'cli-consumo') ? 'cli-consumo' : (clients[0]?.id || 'cli-consumo'));
  const [selectedSellerId, setSelectedSellerId] = useState<string>('sel-admin-default');
  const [docType, setDocType] = useState<'Factura' | 'Cotizacion'>('Factura');
  const [selectedNcfType, setSelectedNcfType] = useState<string>('B02');
  const [paymentNotes, setPaymentNotes] = useState('');
  
  // Shift Management
  const [openingBalance, setOpeningBalance] = useState('0');
  const [selectedCajaId, setSelectedCajaId] = useState('');
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [closingBalanceActual, setClosingBalanceActual] = useState('');
  const [selectedShiftSellerId, setSelectedShiftSellerId] = useState('sel-admin-default');

  const cajas = useMemo(() => financialAccounts.filter(acc => acc.type === 'Caja'), [financialAccounts]);
  const displaySellers = useMemo(() => {
    const active = sellers.filter(s => s.isActive);
    if (active.some(s => s.id === 'sel-admin-default')) return active;
    return [{ id: 'sel-admin-default', name: 'Administrador', isActive: true, commissionRate: 0, createdAt: '' }, ...active];
  }, [sellers]);
  const selectedShiftSellerName = displaySellers.find(s => s.id === selectedShiftSellerId)?.name || 'Administrador';

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
    const chosenSeller = displaySellers.find(s => s.id === selectedShiftSellerId) || displaySellers[0];
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
    setSelectedShiftSellerId('sel-admin-default');
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

  // Quick Client State
  const [showQuickClient, setShowQuickClient] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickRnc, setQuickRnc] = useState('');
  const [quickType, setQuickType] = useState<'Empresa' | 'Persona Física'>('Empresa');
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
        if (res.data) setQuickName(res.data.nombre);
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

  const handleSaveQuickClient = async () => {
    if (!quickName.trim() || !quickRnc.trim()) {
      alert('Por favor complete todos los campos.');
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
          ? `${dgiiValidation.data.provincia}, R.D.`
          : 'Santo Domingo, R.D.',
        dgiiVerified: dgiiValidation?.valid || false,
      });
      if (newCli && newCli.id) {
        setSelectedClientId(newCli.id);
        setShowQuickClient(false);
        setQuickName('');
        setQuickRnc('');
        setDgiiSuggestions([]);
        setShowDgiiSuggestions(false);
        setDgiiValidation(null);
      }
    } catch (e) {
      console.error('Error creating client', e);
    }
  };

  // Cart Management
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    if (product.type === 'Producto' && product.stock <= 0) {
      alert(`El producto "${product.name}" no tiene existencias disponibles.`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (product.type === 'Producto' && existing.quantity >= product.stock) {
          alert(`Solo hay ${product.stock} disponibles.`);
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
      return;
    }
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;
    if (item.product.type === 'Producto' && qty > item.product.stock) {
      alert(`Solo hay ${item.product.stock} unidades en existencia.`);
      return;
    }
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(i => i.product.id !== productId));

  const { subtotal, tax, total } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const tx = cart.reduce((acc, item) => acc + ((item.product.price * item.quantity) * (item.product.taxRate / 100)), 0);
    return { subtotal: sub, tax: tx, total: sub + tx };
  }, [cart]);

  // Checkout
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentCash, setPaymentCash] = useState<number>(0);
  const [paymentCard, setPaymentCard] = useState<number>(0);
  const [paymentTransfer, setPaymentTransfer] = useState(0);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [cashReceived, setCashReceived] = useState(0);
  const [completedDoc, setCompletedDoc] = useState<any | null>(null);
  const [printSize, setPrintSize] = useState<'Letter' | 'Thermal'>('Letter');

  const handleCheckoutInitiate = () => {
    if (cart.length === 0) return alert('El carrito está vacío.');
    if (!selectedClientId) return alert('Seleccione un cliente.');

    if (docType === 'Cotizacion') {
      const items = cart.map(i => ({ productId: i.product.id, productName: i.product.name, quantity: i.quantity, price: i.product.price, taxRate: i.product.taxRate }));
      const newDoc = createInvoiceOrQuote({ clientId: selectedClientId, sellerId: selectedSellerId, type: 'Cotizacion', items, discount: 0, notes: paymentNotes });
      if (newDoc) {
        setCompletedDoc({ ...newDoc, paymentMethod: 'Cotización', totalPaid: 0, accountName: 'N/A' });
        setCart([]); setPaymentNotes('');
      }
    } else {
      setPaymentCash(total); setPaymentCard(0); setPaymentTransfer(0); setSelectedBankAccountId(''); setCashReceived(total);
      setShowCheckoutModal(true);
    }
  };

  const handleFinalizeMixedCheckout = () => {
    const totalPayments = paymentCash + paymentCard + paymentTransfer;
    if (Math.abs(totalPayments - total) > 0.05) return alert('La suma de pagos debe igualar al total.');
    if (paymentCash > 0 && cashReceived < paymentCash) return alert('Efectivo entregado es menor al pago en efectivo.');

    const items = cart.map(i => ({ productId: i.product.id, productName: i.product.name, quantity: i.quantity, price: i.product.price, taxRate: i.product.taxRate }));
    const newDoc = createInvoiceOrQuote({ clientId: selectedClientId, sellerId: selectedSellerId, type: 'Factura', ncfType: selectedNcfType, items, discount: 0, notes: paymentNotes });
    if (!newDoc) return alert('Error al generar factura.');

    const cashAcc = financialAccounts.find(a => a.type === 'Caja' || a.id === 'acc-1') || financialAccounts[0];
    const cardAcc = financialAccounts.find(a => a.type === 'Verifone' || a.id === 'acc-3') || financialAccounts[0];
    const bankAcc = financialAccounts.find(a => a.id === selectedBankAccountId) || financialAccounts.find(a => a.type === 'Banco') || financialAccounts[0];

    const actualPayments = [];
    if (paymentCash > 0) { payInvoice(newDoc.id, paymentCash, 'Efectivo', paymentNotes, cashAcc?.id); actualPayments.push({ method: 'Efectivo', amount: paymentCash, account: cashAcc?.name }); }
    if (paymentCard > 0) { payInvoice(newDoc.id, paymentCard, 'Tarjeta', paymentNotes, cardAcc?.id); actualPayments.push({ method: 'Tarjeta', amount: paymentCard, account: cardAcc?.name }); }
    if (paymentTransfer > 0) { payInvoice(newDoc.id, paymentTransfer, 'Transferencia', paymentNotes, bankAcc?.id); actualPayments.push({ method: 'Transferencia', amount: paymentTransfer, account: bankAcc?.name }); }

    setCompletedDoc({ ...newDoc, paymentMethod: 'Pagos Mixtos', actualPaymentsRecorded: actualPayments, paymentCash, paymentCard, paymentTransfer, cashReceived, changeReturned: Math.max(0, cashReceived - paymentCash), totalPaid: total });
    setCart([]); setPaymentNotes(''); setShowCheckoutModal(false);
  };

  return {
    cart, setCart,
    selectedClientId, setSelectedClientId,
    selectedSellerId, setSelectedSellerId,
    docType, setDocType,
    selectedNcfType, setSelectedNcfType,
    paymentNotes, setPaymentNotes,
    openingBalance, setOpeningBalance,
    selectedCajaId, setSelectedCajaId,
    showCloseShiftModal, setShowCloseShiftModal,
    closingBalanceActual, setClosingBalanceActual,
    selectedShiftSellerId, setSelectedShiftSellerId,
    cajas, displaySellers, selectedShiftSellerName,
    activeShiftCashPayments, expectedClosingBalance,
    handleOpenShift, handleCloseShift,
    showQuickClient, setShowQuickClient,
    quickName, setQuickName,
    quickRnc, setQuickRnc,
    quickType, setQuickType,
    dgiiSuggestions, setDgiiSuggestions,
    showDgiiSuggestions, setShowDgiiSuggestions,
    isSearchingDgii, setIsSearchingDgii,
    dgiiValidation, setDgiiValidation,
    dgiiError, setDgiiError,
    handleQuickNameChange, handleValidateQuickRnc, handleSaveQuickClient,
    searchTerm, setSearchTerm, filteredProducts,
    addToCart, updateQuantity, removeFromCart,
    subtotal, tax, total,
    showCheckoutModal, setShowCheckoutModal,
    paymentCash, setPaymentCash,
    paymentCard, setPaymentCard,
    paymentTransfer, setPaymentTransfer,
    selectedBankAccountId, setSelectedBankAccountId,
    cashReceived, setCashReceived,
    completedDoc, setCompletedDoc,
    printSize, setPrintSize,
    handleCheckoutInitiate, handleFinalizeMixedCheckout
  };
}
