import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Client, Product, Seller, InvoiceItem, NcfType, PaymentMethod, Invoice } from '../../types';
import { validateDgiiRnc } from '../../lib/dgiiApi';
import { emitirEcfMSeller } from '../../lib/msellerApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Trash2, ShieldCheck, UserCheck, Calendar, ShieldAlert, Briefcase, ShoppingBag, Layers, Loader2 } from 'lucide-react';

interface InvoiceCreatorProps {
  clients: Client[];
  sellers?: Seller[];
  products: Product[];
  ncfSequences: any[];
  createInvoiceOrQuote: (data: any) => Invoice;
  onSuccess: (createdDoc?: Invoice) => void;
  currentUser: any;
  initialDocType?: 'Factura' | 'Cotizacion';
  initialPrefilledDoc?: Invoice;
  deleteInvoice?: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client | Promise<Client>;
  addProduct: (product: Omit<Product, 'id'>) => Product | Promise<Product>;
  templateSettings?: any;
  saveTemplateSettings?: (settings: any) => void;
  financialAccounts?: any[];
  payInvoice?: any;
  users?: any[];
  activeShift?: any;
}

export default function InvoiceCreator({
  clients,
  products,
  ncfSequences,
  createInvoiceOrQuote,
  onSuccess,
  currentUser,
  initialDocType,
  initialPrefilledDoc,
  deleteInvoice,
  addClient,
  addProduct,
  sellers = [],
  financialAccounts = [],
  payInvoice,
  users = [],
  activeShift,
  templateSettings,
  saveTemplateSettings,
}: InvoiceCreatorProps) {
  // Main Selection Fields
  const [docType, setDocType] = useState<'Factura' | 'Cotizacion'>(initialPrefilledDoc ? initialPrefilledDoc.type : 'Factura');

  useEffect(() => {
    if (initialDocType && !initialPrefilledDoc) {
      setDocType(initialDocType);
    }
  }, [initialDocType, initialPrefilledDoc]);

  const [selectedClientId, setSelectedClientId] = useState(initialPrefilledDoc ? initialPrefilledDoc.client.id : '');
  const [selectedNcfType, setSelectedNcfType] = useState<NcfType>(initialPrefilledDoc ? initialPrefilledDoc.ncfType : 'B02');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPrefilledDoc ? initialPrefilledDoc.paymentMethod : 'Efectivo');
  
  // Vendedor (Seller) logic
  const [selectedSellerId, setSelectedSellerId] = useState<string>(
    initialPrefilledDoc && initialPrefilledDoc.sellerId 
      ? initialPrefilledDoc.sellerId 
      : 'sel-admin-default'
  );

  // e-CF Mode
  const [isEcfMode, setIsEcfMode] = useState<boolean>(initialPrefilledDoc ? !!initialPrefilledDoc.isEcf : false);
  const [isEmitting, setIsEmitting] = useState(false);
  
  // Custom Sequence override
  const [overrideSequence, setOverrideSequence] = useState(false);
  const [customSequenceNum, setCustomSequenceNum] = useState('');

  // Immediate payments state for invoice creation
  const [payments, setPayments] = useState<{ amount: number; paymentMethod: PaymentMethod; accountId?: string; notes?: string }[]>([]);
  const [newPayAmount, setNewPayAmount] = useState<string>('');
  const [newPayMethod, setNewPayMethod] = useState<PaymentMethod>('Efectivo');
  const [newPayAccountId, setNewPayAccountId] = useState<string>('');
  const [newPayNotes, setNewPayNotes] = useState<string>('');

  // Date and notes
  const [dueDate, setDueDate] = useState(() => {
    if (initialPrefilledDoc) {
      try {
        return initialPrefilledDoc.dueDate.split('T')[0];
      } catch {}
    }
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [issueDate, setIssueDate] = useState(() => {
    if (initialPrefilledDoc) {
      try {
        return initialPrefilledDoc.createdAt.split('T')[0];
      } catch {}
    }
    return new Date().toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState(initialPrefilledDoc ? `Copia de ${initialPrefilledDoc.invoiceNumber}. ${initialPrefilledDoc.notes || ''}` : '');

  // Currency & Payment Conditions
  const [currency, setCurrency] = useState<'DOP' | 'USD' | 'EUR'>(initialPrefilledDoc ? ((initialPrefilledDoc.currency as any) || 'DOP') : 'DOP');
  const [paymentCondition, setPaymentCondition] = useState<string>(initialPrefilledDoc ? (initialPrefilledDoc.paymentCondition || 'Contado') : 'Contado');

  // Discounts
  const [discountRate, setDiscountRate] = useState<number>(initialPrefilledDoc ? (initialPrefilledDoc.discountRate || 0) : 0);
  const [currentLineDiscount, setCurrentLineDiscount] = useState<number>(0);

  // Success Confirmation overlay
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successAnimationMessage, setSuccessAnimationMessage] = useState('');

  // Item lines state
  const [items, setItems] = useState<InvoiceItem[]>(initialPrefilledDoc ? initialPrefilledDoc.items : []);

  // Item selector helpers
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentTax, setCurrentTax] = useState(18);

  // Custom (dynamic one-off) products/services state helpers
  const [isCustomProductMode, setIsCustomProductMode] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemType, setCustomItemType] = useState<'Producto' | 'Servicio'>('Servicio');
  const [saveCustomToCatalog, setSaveCustomToCatalog] = useState(false);

  // Quick Client creation modal/inline panel state
  const [showQuickClientModal, setShowQuickClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientRnc, setNewClientRnc] = useState('');
  const [newClientType, setNewClientType] = useState<'Empresa' | 'Persona Física'>('Empresa');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');

  // Quick Product creation modal/inline panel state
  const [showQuickProductModal, setShowQuickProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCode, setNewProdCode] = useState('');
  const [newProdType, setNewProdType] = useState<'Producto' | 'Servicio'>('Producto');
  const [newProdPrice, setNewProdPrice] = useState<number>(0);
  const [newProdCost, setNewProdCost] = useState<number>(0);
  const [newProdTaxRate, setNewProdTaxRate] = useState<number>(18);
  const [newProdStock, setNewProdStock] = useState<number>(0);
  const [newProdMinStock, setNewProdMinStock] = useState<number>(0);
  const [newProdCategory, setNewProdCategory] = useState('');

  // DGII search state
  const [isSearchingDgii, setIsSearchingDgii] = useState(false);
  const [dgiiError, setDgiiError] = useState('');

  // Draft banner indicator state
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);


  // Prevent accidental tab closure if there are unsaved items
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (items.length > 0 || selectedClientId) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [items, selectedClientId]);

  // Load from LocalStorage draft on mount (ONLY if NOT prefilled duplicating document)
  useEffect(() => {
    if (!initialPrefilledDoc) {
      try {
        const savedDraft = localStorage.getItem('inv_creator_draft');
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          let loadedAny = false;
          if (draft.items && draft.items.length > 0) {
            setItems(draft.items);
            loadedAny = true;
          }
          if (draft.selectedClientId) {
            setSelectedClientId(draft.selectedClientId);
            loadedAny = true;
          }
          if (draft.selectedNcfType) setSelectedNcfType(draft.selectedNcfType);
          if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
          if (draft.notes) setNotes(draft.notes);
          if (draft.docType) setDocType(draft.docType);
          if (draft.dueDate) setDueDate(draft.dueDate);
          if (draft.issueDate) setIssueDate(draft.issueDate);
          if (draft.currency) setCurrency(draft.currency);
          if (draft.paymentCondition) setPaymentCondition(draft.paymentCondition);
          if (draft.discountRate) setDiscountRate(draft.discountRate);

          if (loadedAny) {
            setHasRestoredDraft(true);
            toast.info('Borrador recuperado', { description: 'Hemos restaurado tu sesión anterior.' });
          }
        }
      } catch (err) {
        console.error('Error restoring draft', err);
      }
    }
  }, [initialPrefilledDoc]);

  // Persist current draft to LocalStorage whenever changes happen 
  useEffect(() => {
    const draftData = {
      docType,
      selectedClientId,
      selectedNcfType,
      paymentMethod,
      dueDate,
      issueDate,
      notes,
      items,
      currency,
      paymentCondition,
      discountRate,
    };
    localStorage.setItem('inv_creator_draft', JSON.stringify(draftData));
  }, [docType, selectedClientId, selectedNcfType, paymentMethod, dueDate, issueDate, notes, items, currency, paymentCondition, discountRate]);

  // Clear draft helper
  const handleClearDraft = () => {
    localStorage.removeItem('inv_creator_draft');
    setItems([]);
    setPayments([]);
    setSelectedClientId('');
    setNotes('');
    setOverrideSequence(false);
    setCustomSequenceNum('');
    setCurrency('DOP');
    setPaymentCondition('Contado');
    setDiscountRate(0);
    setHasRestoredDraft(false);
  };

  // Load client details instantly on client change
  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Update starting unit prices automatically when item selected or NCF changes
  useEffect(() => {
    if (!isCustomProductMode) {
      const prod = products.find(p => p.id === currentProductId);
      if (prod) {
        const isInformal = templateSettings?.informalMode || !templateSettings?.businessRNC || docType === 'Cotizacion' || (docType === 'Factura' && selectedNcfType === 'SIN');
        let basePrice = prod.price;
        let tax = prod.taxRate;
        
        if (isInformal) {
          if (prod.priceIncludesTax !== false) {
            basePrice = prod.price;
          } else {
            basePrice = prod.price * (1 + prod.taxRate / 100);
          }
          tax = 0;
        } else {
          if (prod.priceIncludesTax !== false) {
            basePrice = prod.price / (1 + prod.taxRate / 100);
          } else {
            basePrice = prod.price;
          }
          tax = prod.taxRate;
        }

        setCurrentPrice(parseFloat(basePrice.toFixed(2)));
        setCurrentTax(tax);
        setCustomItemName(prod.name);
      } else {
        setCustomItemName('');
      }
    }
  }, [currentProductId, products, isCustomProductMode, docType, selectedNcfType]);

  // Recalculate existing items if NCF or DocType changes
  useEffect(() => {
    setItems(prevItems => {
      if (prevItems.length === 0) return prevItems;
      const isInformal = templateSettings?.informalMode || !templateSettings?.businessRNC || docType === 'Cotizacion' || (docType === 'Factura' && selectedNcfType === 'SIN');
      
      let changed = false;
      const newItems = prevItems.map(it => {
        const prod = products.find(p => p.id === it.productId);
        if (!prod) return it; // skip custom

        const shouldBeInformal = isInformal;
        const currentlyInformal = it.taxRate === 0;

        // If the item is already in the correct tax state, do not override its price
        if (shouldBeInformal === currentlyInformal && !isInformal) {
           // We only check if taxRate needs update if they are formal and change NCF tax rules
           // But since NCFs mostly keep the same tax rate (except SIN which makes it informal),
           // we can safely assume it's correct.
           return it;
        }
        if (shouldBeInformal === currentlyInformal && isInformal) {
           return it;
        }

        let newPrice = it.price;
        let newTaxRate = it.taxRate;
        
        if (shouldBeInformal && !currentlyInformal) {
          // Transition to Informal: The user wants final price. We add the tax back into the base price.
          newPrice = it.price * (1 + it.taxRate / 100);
          newTaxRate = 0;
        } else if (!shouldBeInformal && currentlyInformal) {
          // Transition to Formal: We extract the tax from the price (if it was tax-inclusive)
          newTaxRate = prod.taxRate;
          if (prod.priceIncludesTax !== false) {
            newPrice = it.price / (1 + newTaxRate / 100);
          } else {
            newPrice = it.price;
          }
        }

        newPrice = parseFloat(newPrice.toFixed(2));
        if (it.price === newPrice && it.taxRate === newTaxRate) return it; // no change
        changed = true;

        const subNoDisc = it.quantity * newPrice;
        const discountAm = subNoDisc * ((it.discount || 0) / 100);
        const suball = subNoDisc - discountAm;
        const taxAmount = suball * (newTaxRate / 100);

        return {
          ...it,
          price: newPrice,
          taxRate: newTaxRate,
          taxAmount: parseFloat(taxAmount.toFixed(2)),
          total: parseFloat((suball + taxAmount).toFixed(2))
        };
      });

      return changed ? newItems : prevItems;
    });
  }, [docType, selectedNcfType, products]);

  // Next NCF sequence helper
  const getNextNcfPreview = () => {
    if (selectedNcfType === 'SIN') return 'Consumo Interno (Sin NCF)';
    const seq = ncfSequences.find(s => s.type === selectedNcfType);
    if (!seq) return 'B0200000001';
    
    let num = seq.currentNumber + 1;
    if (overrideSequence && Number(customSequenceNum) > 0) {
      num = Number(customSequenceNum);
    }
    const numPadding = String(num).padStart(seq.suffixLength, '0');
    return `${seq.prefix}${numPadding}`;
  };

  // Add Item to lines list
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    let name = '';
    let targetProductId = '';

    if (isCustomProductMode) {
      if (!customItemName.trim()) {
        alert('Ingrese la descripción del concepto personalizado para poder agregarlo.');
        return;
      }
      name = customItemName.trim();

      if (saveCustomToCatalog) {
        // Create product permanently in database catalog list
        const slugCode = 'DYN-' + Date.now().toString().slice(-4);
        const added = await addProduct({
          name,
          code: slugCode,
          type: customItemType,
          price: currentPrice,
          cost: Math.round(currentPrice * 0.7),
          taxRate: currentTax,
          stock: customItemType === 'Producto' ? 50 : 0,
          minStock: 5,
          createdAt: new Date().toISOString(),
        });
        targetProductId = added.id;
      } else {
        // Just unique temporary custom prefix
        targetProductId = `custom-${Date.now()}`;
      }
    } else {
      if (!currentProductId) return;
      const prod = products.find(p => p.id === currentProductId);
      if (!prod) return;
      name = customItemName.trim() || prod.name;
      targetProductId = prod.id;
    }

    // Check if item is already added with same discount, if so, increase quantity
    const existingIndex = items.findIndex(it => it.productId === targetProductId && (it.discount || 0) === currentLineDiscount);
    if (existingIndex !== -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + currentQty;
      const subNoDisc = newQty * currentPrice;
      const discountAm = subNoDisc * (currentLineDiscount / 100);
      const suball = subNoDisc - discountAm;
      const taxAmount = suball * (currentTax / 100);
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].price = currentPrice;
      updated[existingIndex].taxRate = currentTax;
      updated[existingIndex].taxAmount = parseFloat(taxAmount.toFixed(2));
      updated[existingIndex].total = parseFloat((suball + taxAmount).toFixed(2));
      setItems(updated);
    } else {
      const subNoDisc = currentQty * currentPrice;
      const discountAm = subNoDisc * (currentLineDiscount / 100);
      const suball = subNoDisc - discountAm;
      const taxAmount = suball * (currentTax / 100);
      const newItem: InvoiceItem = {
        productId: targetProductId,
        name,
        price: currentPrice,
        quantity: currentQty,
        taxRate: currentTax,
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat((suball + taxAmount).toFixed(2)),
        discount: currentLineDiscount,
      };
      setItems([...items, newItem]);
    }

    // Reset item selectors
    setCurrentProductId('');
    setCustomItemName('');
    setCurrentQty(1);
    setCurrentPrice(0);
    setCurrentTax(18);
    setCurrentLineDiscount(0);
  };

  // Remove Item line
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update line quantity inline
  const handleUpdateLineQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...items];
    const line = updated[index];
    const discPercent = line.discount || 0;
    const subNoDisc = newQty * line.price;
    const suball = subNoDisc * (1 - discPercent / 100);
    const taxAmount = suball * (line.taxRate / 100);
    
    updated[index] = {
      ...line,
      quantity: newQty,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat((suball + taxAmount).toFixed(2)),
    };
    setItems(updated);
  };

  // Update line name inline
  const handleUpdateLineName = (index: number, newName: string) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      name: newName,
    };
    setItems(updated);
  };

  // Update line price inline
  const handleUpdateLinePrice = (index: number, newPrice: number) => {
    const updated = [...items];
    const line = updated[index];
    const discPercent = line.discount || 0;
    const subNoDisc = line.quantity * newPrice;
    const suball = subNoDisc * (1 - discPercent / 100);
    const taxAmount = suball * (line.taxRate / 100);
    
    updated[index] = {
      ...line,
      price: newPrice,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat((suball + taxAmount).toFixed(2)),
    };
    setItems(updated);
  };

  // Update line discount inline
  const handleUpdateLineDiscount = (index: number, newDiscount: number) => {
    const discountVal = Math.min(100, Math.max(0, newDiscount || 0));
    const updated = [...items];
    const line = updated[index];
    const subNoDisc = line.quantity * line.price;
    const suball = subNoDisc * (1 - discountVal / 100);
    const taxAmount = suball * (line.taxRate / 100);

    updated[index] = {
      ...line,
      discount: discountVal,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat((suball + taxAmount).toFixed(2)),
    };
    setItems(updated);
  };

  // Update line tax rate inline
  const handleUpdateLineTaxRate = (index: number, newTaxRate: number) => {
    const updated = [...items];
    const line = updated[index];
    const discPercent = line.discount || 0;
    const subNoDisc = line.quantity * line.price;
    const suball = subNoDisc * (1 - discPercent / 100);
    const taxAmount = suball * (newTaxRate / 100);
    
    updated[index] = {
      ...line,
      taxRate: newTaxRate,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat((suball + taxAmount).toFixed(2)),
    };
    setItems(updated);
  };

  const handleValidateRnc = async () => {
    if (!newClientRnc.trim()) {
      setDgiiError('Por favor introduzca un RNC o Cédula para validar.');
      return;
    }
    setIsSearchingDgii(true);
    setDgiiError('');
    try {
      const result = await validateDgiiRnc(newClientRnc);
      if (result && result.valid && result.data) {
        setNewClientName(result.data.nombre);
        if (result.data.provincia && result.data.municipio) {
          setNewClientAddress(`${result.data.provincia}, ${result.data.municipio}`);
        } else if (result.data.provincia) {
          setNewClientAddress(result.data.provincia);
        }
        setDgiiError('');
      } else {
        setDgiiError('No se encontró el contribuyente en el padrón oficial.');
      }
    } catch (err) {
      setDgiiError('Error al conectar con el servicio DGII.');
    } finally {
      setIsSearchingDgii(false);
    }
  };

  const handleQuickProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert('Favor introducir el nombre del producto o servicio.');
      return;
    }

    const finalCode = newProdCode.trim() || 'PROD-' + Date.now().toString().slice(-6);

    const created = await addProduct({
      name: newProdName.trim(),
      code: finalCode,
      type: newProdType,
      price: newProdPrice,
      cost: newProdCost,
      taxRate: newProdTaxRate,
      stock: newProdType === 'Producto' ? newProdStock : 0,
      minStock: newProdType === 'Producto' ? newProdMinStock : 0,
      category: newProdCategory.trim() || undefined,
      createdAt: new Date().toISOString()
    });

    // Auto-select in selector
    setCurrentProductId(created.id);
    setCurrentPrice(created.price);
    setCurrentTax(created.taxRate);
    setCustomItemName(created.name);

    // Reset fields
    setNewProdName('');
    setNewProdCode('');
    setNewProdType('Producto');
    setNewProdPrice(0);
    setNewProdCost(0);
    setNewProdTaxRate(18);
    setNewProdStock(0);
    setNewProdMinStock(0);
    setNewProdCategory('');

    // Close modal
    setShowQuickProductModal(false);
  };

  // Quick Client creation handler
  const handleQuickClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      alert('Favor introducir el Nombre.');
      return;
    }

    const created = await addClient({
      name: newClientName.trim(),
      rncOrCedula: newClientRnc.trim(),
      type: newClientType === 'Persona Física' ? 'Fisica' : 'Empresa',
      phone: newClientPhone.trim(),
      email: newClientEmail.trim(),
      address: newClientAddress.trim(),
    });

    // Auto select client!
    setSelectedClientId(created.id);
    
    // Reset fields
    setNewClientName('');
    setNewClientRnc('');
    setNewClientPhone('');
    setNewClientEmail('');
    setNewClientAddress('');
    
    // Close modal
    setShowQuickClientModal(false);
  };

  // Calculate totals
  const subtotalSum = items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const taxSum = items.reduce((acc, it) => acc + it.taxAmount, 0);

  const finalSubtotal = parseFloat((subtotalSum - parseFloat((subtotalSum * (discountRate / 100)).toFixed(2))).toFixed(2));
  const finalTax = parseFloat((taxSum * (1 - discountRate / 100)).toFixed(2));
  const finalTotal = parseFloat((finalSubtotal + finalTax).toFixed(2));

  const isRoleAuthorized = currentUser.permissions.canCreateInvoice;

  const handleSaveDraft = () => {
    if (!selectedClientId) {
      alert('Favor seleccionar un cliente para procesar la transacci\u00f3n.');
      return;
    }
    if (items.length === 0) {
      alert('Debe agregar al menos un art\u00edculo o servicio al documento.');
      return;
    }
    const draftDoc = createInvoiceOrQuote({
      type: docType,
      client: selectedClient!,
      items,
      paymentMethod,
      ncfType: docType === 'Cotizacion' ? 'SIN' : selectedNcfType,
      customSequenceNumber: overrideSequence && customSequenceNum ? Number(customSequenceNum) - 1 : undefined,
      notes,
      dueDate,
      createdAt: new Date(issueDate + "T12:00:00Z").toISOString(),
      currency,
      paymentCondition,
      discountRate,
      status: 'Borrador',
      isDraft: true,
      sellerId: selectedSellerId || undefined,
      sellerName: selectedSellerId ? sellers.find(s => s.id === selectedSellerId)?.name : undefined,
      shiftId: activeShift ? activeShift.id : undefined,
    });

    if (initialPrefilledDoc && initialPrefilledDoc.status === 'Borrador' && deleteInvoice) {
      deleteInvoice(initialPrefilledDoc.id);
    }

    localStorage.removeItem('inv_creator_draft');
    setSuccessAnimationMessage('Borrador Guardado');
    setShowSuccessAnimation(true);
    
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setSelectedClientId('');
      setItems([]);
      setPayments([]);
      setNotes('');
      setHasRestoredDraft(false);
      onSuccess(draftDoc);
    }, 1500);
  };

  const handleCreateDocument = async () => {
    if (!selectedClientId) {
      alert('Favor seleccionar un cliente para procesar la transacción.');
      return;
    }
    if (items.length === 0) {
      alert('Debe cargar por lo menos una línea de productos o servicios antes de facturar.');
      return;
    }

    setIsEmitting(true);

    try {
      let trackId = undefined;
      let qrUrl = undefined;

      // Si es factura y está en modo e-CF, conectamos con MSeller
      if (docType === 'Factura' && isEcfMode) {
        const msellerResult = await emitirEcfMSeller({
          client: selectedClient,
          items,
          total: finalTotal,
          ncfType: selectedNcfType,
          // otros datos necesarios
        });

        if (!msellerResult.success) {
          alert('Error emitiendo e-CF con MSeller: ' + msellerResult.error);
          setIsEmitting(false);
          return;
        }

        trackId = msellerResult.trackId;
        qrUrl = msellerResult.qrUrl;
      }

      const createdDoc = createInvoiceOrQuote({
        type: docType,
        client: selectedClient!,
        items,
        paymentMethod,
        ncfType: docType === 'Cotizacion' ? 'SIN' : selectedNcfType,
        customSequenceNumber: overrideSequence && customSequenceNum ? Number(customSequenceNum) - 1 : undefined,
        notes,
        dueDate,
        createdAt: new Date(issueDate + "T12:00:00Z").toISOString(),
        currency,
        paymentCondition,
        discountRate,
        isEcf: docType === 'Factura' && isEcfMode,
        ecfTrackId: trackId,
        ecfQrUrl: qrUrl,
        sellerId: selectedSellerId || undefined,
        sellerName: selectedSellerId ? sellers.find(s => s.id === selectedSellerId)?.name : undefined,
        shiftId: activeShift ? activeShift.id : undefined,
      });

      if (initialPrefilledDoc && initialPrefilledDoc.status === 'Borrador' && deleteInvoice) {
        deleteInvoice(initialPrefilledDoc.id);
      }

    // Capture and immediately apply payments if it's a Factura
    if (docType === 'Factura' && payments.length > 0 && payInvoice && createdDoc) {
      payments.forEach(p => {
        payInvoice(createdDoc.id, p.amount, p.paymentMethod, p.notes || 'Abono inicial en creación', p.accountId);
      });
    }

    // Clear draft from localStorage on success
    localStorage.removeItem('inv_creator_draft');

    setSuccessAnimationMessage(
      docType === 'Cotizacion' 
        ? '¡Cotización Creada con Éxito!' 
        : '¡Factura Registrada con Éxito!'
    );
    setShowSuccessAnimation(true);
    
    setTimeout(() => {
      setShowSuccessAnimation(false);
      // Reset Form
      setSelectedClientId('');
      setItems([]);
      setPayments([]);
      setNotes('');
      setOverrideSequence(false);
      setCustomSequenceNum('');
      setCurrency('DOP');
      setPaymentCondition('Contado');
      setDiscountRate(0);
      setHasRestoredDraft(false);

      // Trigger parent callback with newly created document
      onSuccess(createdDoc);
    }, 2200);
    } catch (err) {
      console.error(err);
      alert('Error inesperado procesando el documento.');
    } finally {
      setIsEmitting(false);
    }
  };

  return (
    <div className="space-y-6" id="create-invoice-page">
      {/* RESTORED ACCORDION BANNER */}
      {hasRestoredDraft && (
        <div id="restored-draft-banner" className="bg-amber-50 text-amber-900 border border-amber-250 p-3 rounded-xl mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold block">Borrador en proceso recuperado</span>
            <span className="text-[11px] text-amber-750">Se ha cargado automáticamente tu última sesión sin guardar. Puedes continuar editando o limpiar el formulario.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearDraft}
            className="border-amber-300 text-amber-900 hover:bg-amber-100 text-[11px] h-8 shrink-0 bg-transparent"
          >
            Descartar y Limpiar
          </Button>
        </div>
      )}

      {/* QUICK CLIENT MODAL OVERLAY */}
      {showQuickClientModal && (
        <div className="fixed inset-0 bg-neutral-905/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-neutral-800" />
                Registrar Cliente Rápido
              </h3>
              <button
                onClick={() => setShowQuickClientModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-semibold text-sm"
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickClientSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="qc-rnc" className="text-[10px] font-bold text-neutral-500 uppercase">RNC o Cédula</Label>
                  <div className="flex gap-1">
                    <Input
                      id="qc-rnc"
                      type="text"
                      placeholder="Ej. 131150243"
                      value={newClientRnc}
                      onChange={(e) => setNewClientRnc(e.target.value)}
                      className="h-9 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleValidateRnc}
                      disabled={isSearchingDgii}
                      className="h-9 px-2.5 bg-neutral-900 text-white hover:bg-neutral-800 text-[10px] font-bold shrink-0 animate-none"
                    >
                      {isSearchingDgii ? '...' : 'Validar'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qc-type" className="text-[10px] font-bold text-neutral-500 uppercase">Tipo</Label>
                  <Select value={newClientType} onValueChange={(val: 'Empresa' | 'Persona Física') => setNewClientType(val)}>
                    <SelectTrigger id="qc-type" className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Empresa">Régimen Empresa</SelectItem>
                      <SelectItem value="Persona Física">Persona Física</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {dgiiError && (
                <div className="text-[10px] text-red-650 bg-red-50 border border-red-150 p-2 rounded-lg font-semibold">
                  ⚠️ {dgiiError}
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="qc-name" className="text-[10px] font-bold text-neutral-500 uppercase">Nombre o Razón Social</Label>
                <Input
                  id="qc-name"
                  type="text"
                  placeholder="Ej. Comercial Dominicana Logística Industrial SRL"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="qc-phone" className="text-[10px] font-bold text-neutral-500 uppercase">Teléfono</Label>
                  <Input
                    id="qc-phone"
                    type="text"
                    placeholder="Ej. 809-555-0122"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qc-email" className="text-[10px] font-bold text-neutral-500 uppercase">Email / Correo</Label>
                  <Input
                    id="qc-email"
                    type="email"
                    placeholder="Ej. facturas@empresa.com.do"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="qc-address" className="text-[10px] font-bold text-neutral-500 uppercase">Dirección Física</Label>
                <textarea
                  id="qc-address"
                  placeholder="Ej. Calle Max Henríquez Ureña #22, Piantini, Santo Domingo"
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg h-16 outline-none focus:border-neutral-400 bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuickClientModal(false)}
                  className="h-8 text-[11px] px-3.5 font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="h-8 text-[11px] px-3.5 bg-black text-white hover:bg-neutral-800 font-bold"
                >
                  Registrar e Incorporar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PRODUCT MODAL OVERLAY */}
      {showQuickProductModal && (
        <div className="fixed inset-0 bg-neutral-905/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-neutral-800" />
                Registrar Producto / Servicio Rápido
              </h3>
              <button
                onClick={() => setShowQuickProductModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-semibold text-sm"
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickProductSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <Label htmlFor="qp-name" className="text-[10px] font-bold text-neutral-500 uppercase">Nombre del Artículo / Servicio</Label>
                <Input
                  id="qp-name"
                  type="text"
                  placeholder="Ej. Servicio de Asesoría Fiscal Mensual"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="qp-code" className="text-[10px] font-bold text-neutral-500 uppercase">Código / SKU (Opcional)</Label>
                  <Input
                    id="qp-code"
                    type="text"
                    placeholder="Autogenerado si vacío"
                    value={newProdCode}
                    onChange={(e) => setNewProdCode(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qp-type" className="text-[10px] font-bold text-neutral-500 uppercase">Tipo</Label>
                  <Select value={newProdType} onValueChange={(val: 'Producto' | 'Servicio') => setNewProdType(val)}>
                    <SelectTrigger id="qp-type" className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Producto">Producto (Con Inventario)</SelectItem>
                      <SelectItem value="Servicio">Servicio (Sin Inventario)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="qp-price" className="text-[10px] font-bold text-neutral-500 uppercase">Precio Venta</Label>
                  <Input
                    id="qp-price"
                    type="number"
                    step="any"
                    value={newProdPrice || ''}
                    onChange={(e) => setNewProdPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-9 text-xs text-right"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qp-cost" className="text-[10px] font-bold text-neutral-500 uppercase">Costo Compra</Label>
                  <Input
                    id="qp-cost"
                    type="number"
                    step="any"
                    value={newProdCost || ''}
                    onChange={(e) => setNewProdCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-9 text-xs text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qp-tax" className="text-[10px] font-bold text-neutral-500 uppercase">ITBIS %</Label>
                  <Select value={String(newProdTaxRate)} onValueChange={(val) => setNewProdTaxRate(Number(val))}>
                    <SelectTrigger id="qp-tax" className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="16">16%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="8">8%</SelectItem>
                      <SelectItem value="0">0%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newProdType === 'Producto' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="qp-stock" className="text-[10px] font-bold text-neutral-500 uppercase">Stock Inicial</Label>
                    <Input
                      id="qp-stock"
                      type="number"
                      value={newProdStock || ''}
                      onChange={(e) => setNewProdStock(Math.max(0, parseInt(e.target.value) || 0))}
                      className="h-9 text-xs text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="qp-min-stock" className="text-[10px] font-bold text-neutral-500 uppercase">Stock Mínimo</Label>
                    <Input
                      id="qp-min-stock"
                      type="number"
                      value={newProdMinStock || ''}
                      onChange={(e) => setNewProdMinStock(Math.max(0, parseInt(e.target.value) || 0))}
                      className="h-9 text-xs text-center"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="qp-category" className="text-[10px] font-bold text-neutral-500 uppercase">Categoría / Línea (Opcional)</Label>
                <Input
                  id="qp-category"
                  type="text"
                  placeholder="Ej. Consultoría, Hardware, etc."
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuickProductModal(false)}
                  className="h-8 text-[11px] px-3.5 font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="h-8 text-[11px] px-3.5 bg-black text-white hover:bg-neutral-800 font-bold"
                >
                  Registrar e Incorporar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP CARDS */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 border border-neutral-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-sm font-extrabold text-neutral-900">{successAnimationMessage}</h4>
            <p className="text-[11px] text-neutral-500">Volviendo de forma automática al listado general de transacciones...</p>
          </div>
        </div>
      )}

      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-250">
        <div className="space-y-1">
          <button
            onClick={() => onSuccess()}
            className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors gap-1.5"
            id="cancel-create-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a Facturas
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading">
            Crear {docType === 'Cotizacion' ? 'Cotización' : 'Factura'}
          </h2>
          <p className="text-xs text-neutral-500">
            Confeccione un nuevo documento comercial en el sistema.
          </p>
        </div>
      </div>

      {/* COMPACT DOCUMENT TYPE SWITCH */}
      <div className="max-w-md space-y-1">
        <Label className="text-xs font-semibold text-neutral-700">Tipo de Documento Principal</Label>
        <div className="grid grid-cols-2 gap-1.5 bg-neutral-100 p-1 rounded-lg">
          <Button
            id="btntype-factura"
            variant={docType === 'Factura' ? 'default' : 'ghost'}
            className="text-xs h-8 rounded-md transition-all font-medium py-0"
            onClick={() => setDocType('Factura')}
          >
            Factura de Venta
          </Button>
          <Button
            id="btntype-cotizacion"
            variant={docType === 'Cotizacion' ? 'default' : 'ghost'}
            className="text-xs h-8 rounded-md transition-all font-medium py-0"
            onClick={() => setDocType('Cotizacion')}
          >
            Cotización / Proforma
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT STACKED COMPONENT */}
      <div className="space-y-6" id="create-document-content-area">
        <div className="w-full space-y-6">
          <Card className="border-neutral-200 shadow-xs rounded-xl bg-white">
            <CardContent className="p-6 space-y-6">
              {/* COMPACT CORPORATE PROFILE FOR ISSUER */}
              {templateSettings && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-150 gap-4 mb-2">
                  <div className="flex items-center space-x-3">
                    {templateSettings.logoUrl ? (
                      <img
                        src={templateSettings.logoUrl}
                        alt="Logo"
                        className="w-10 h-10 rounded bg-white object-contain border border-neutral-150 p-1"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-neutral-150 flex items-center justify-center font-bold text-neutral-600 text-xs border border-neutral-200">
                        {templateSettings.businessName ? templateSettings.businessName.charAt(0).toUpperCase() : 'E'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">{templateSettings.businessName || 'Mi Empresa Dominicana'}</h4>
                      <p className="text-[10px] text-neutral-500">RNC: {templateSettings.businessRNC || 'No configurado'} • Tel: {templateSettings.businessPhone || 'No configurado'}</p>
                      <p className="text-[10px] text-neutral-500">{templateSettings.businessAddress || 'República Dominicana'}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-bold text-emerald-800 uppercase px-2 py-0.5 rounded bg-emerald-50 border border-emerald-250">
                      Emisor Autorizado
                    </span>
                    <p className="text-[9px] text-neutral-450 mt-1">{templateSettings.businessEmail || ''}</p>
                  </div>
                </div>
              )}

              {/* PRIMARY PROPERTIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inv-sel-client" className="text-xs font-semibold text-neutral-700">Cliente Asociado</Label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedClientId('cli-consumo')}
                        className="text-[9px] text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                      >
                        Consumo
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowQuickClientModal(true)}
                        className="text-[9px] text-blue-600 hover:underline font-bold"
                      >
                        + Nuevo
                      </button>
                    </div>
                  </div>
                  <Select value={selectedClientId} onValueChange={(val) => setSelectedClientId(val)}>
                    <SelectTrigger id="inv-sel-client" className="w-full h-9 bg-white border border-neutral-250 rounded-lg text-xs font-semibold text-neutral-900 focus:ring-1 focus:ring-neutral-950 shadow-xs">
                      <SelectValue placeholder="Seleccione un cliente...">
                        {(val: string | null) => {
                          if (!val) return "Seleccione un cliente...";
                          return clients.find(c => c.id === val)?.name || val;
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="cli-consumo" className="text-xs hidden" disabled>Seleccione un cliente...</SelectItem>
                      {clients.map(c => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">
                          {c.name} ({c.type === 'Empresa' ? 'RNC: ' : 'Céd: '}{c.rncOrCedula})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inv-currency" className="text-xs font-semibold text-neutral-700">Moneda</Label>
                  <Select value={currency} onValueChange={(val: 'DOP' | 'USD' | 'EUR') => setCurrency(val)}>
                    <SelectTrigger id="inv-currency" className="h-9 border-neutral-250 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DOP" className="text-xs">DOP - Pesos Dominicanos</SelectItem>
                      <SelectItem value="USD" className="text-xs">USD - Dólares</SelectItem>
                      <SelectItem value="EUR" className="text-xs">EUR - Euros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inv-condition" className="text-xs font-semibold text-neutral-700">Condición de Pago</Label>
                  <Select value={paymentCondition} onValueChange={(val: string) => setPaymentCondition(val)}>
                    <SelectTrigger id="inv-condition" className="h-9 border-neutral-250 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contado" className="text-xs">Contado</SelectItem>
                      <SelectItem value="Crédito 15 días" className="text-xs">Crédito 15 días</SelectItem>
                      <SelectItem value="Crédito 30 días" className="text-xs">Crédito 30 días</SelectItem>
                      <SelectItem value="Crédito 45 días" className="text-xs">Crédito 45 días</SelectItem>
                      <SelectItem value="Crédito 60 días" className="text-xs">Crédito 60 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inv-pay-method" className="text-xs font-semibold text-neutral-700">Método de Pago</Label>
                  <Select value={paymentMethod} onValueChange={(val: PaymentMethod) => setPaymentMethod(val)}>
                    <SelectTrigger id="inv-pay-method" className="h-9 border-neutral-250 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo" className="text-xs">Efectivo</SelectItem>
                      <SelectItem value="Transferencia" className="text-xs">Transferencia</SelectItem>
                      <SelectItem value="Tarjeta" className="text-xs">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="Crédito" className="text-xs">Crédito / Cuentas por Cobrar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inv-seller" className="text-xs font-semibold text-neutral-700">Vendedor</Label>
                  <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                    <SelectTrigger id="inv-seller" className="h-9 border-neutral-250 text-xs">
                      <SelectValue placeholder="Seleccionar Vendedor">
                        {(val: string | null) => {
                          if (!val) return "Seleccionar Vendedor";
                          if (val === 'sel-admin-default') return <span className="text-neutral-500">Administrador (Predeterminado)</span>;
                          return sellers.find(s => s.id === val)?.name || val;
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="" className="text-xs text-neutral-500">Sin Vendedor Asignado</SelectItem>
                      {sellers.map((s) => {
                        if (!s.isActive && s.id !== selectedSellerId) return null;
                        return (
                          <SelectItem key={s.id} value={s.id} className="text-xs">
                            {s.name} {!s.isActive ? '(Inactivo)' : ''} {s.commissionRate ? `(${s.commissionRate}%)` : ''}
                          </SelectItem>
                        );
                      })}
                      {selectedSellerId && !sellers.some(s => s.id === selectedSellerId) && selectedSellerId !== 'sel-admin-default' && (
                        <SelectItem value={selectedSellerId} className="text-xs text-red-500">
                          Vendedor no encontrado o eliminado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* --- TEMPLATE SELECTOR --- */}
                {templateSettings && saveTemplateSettings && (
                  <div className="space-y-1.5">
                    <Label htmlFor="inv-template" className="text-xs font-semibold text-neutral-700">Plantilla de Diseño</Label>
                    <Select 
                      value={templateSettings.templateStyle || 'Moderno'} 
                      onValueChange={(val) => saveTemplateSettings({ ...templateSettings, templateStyle: val })}
                    >
                      <SelectTrigger id="inv-template" className="h-9 border-neutral-250 text-xs font-medium text-indigo-700 bg-indigo-50/50">
                        <SelectValue placeholder="Seleccionar Plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Moderno" className="text-xs">Estilo Moderno (Default)</SelectItem>
                        <SelectItem value="Corporativo" className="text-xs">Estilo Corporativo</SelectItem>
                        <SelectItem value="Clásico" className="text-xs">Estilo Clásico</SelectItem>
                        <SelectItem value="Minimalista" className="text-xs">Estilo Minimalista</SelectItem>
                        <SelectItem value="Elegante" className="text-xs">Estilo Elegante</SelectItem>
                        <SelectItem value="Creativo" className="text-xs">Estilo Creativo</SelectItem>
                        <SelectItem value="Tecnológico" className="text-xs">Estilo Tecnológico</SelectItem>
                        <SelectItem value="Bold" className="text-xs">Estilo Bold (Impacto)</SelectItem>
                        <SelectItem value="Retail" className="text-xs">Estilo Retail</SelectItem>
                        <SelectItem value="Servicios" className="text-xs">Estilo Servicios Pro</SelectItem>
                        <SelectItem value="Gourmet" className="text-xs">Estilo Gourmet</SelectItem>
                        <SelectItem value="Boutique" className="text-xs">Estilo Boutique</SelectItem>
                        <SelectItem value="Industrial" className="text-xs">Estilo Industrial</SelectItem>
                        <SelectItem value="Startup" className="text-xs">Estilo Startup</SelectItem>
                        <SelectItem value="Eco" className="text-xs">Estilo Eco-Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="inv-issue-date" className="text-xs font-semibold text-neutral-700">Fecha de Emisión</Label>
                  <Input
                    id="inv-issue-date"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="h-9 text-xs border-neutral-250"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inv-due-date" className="text-xs font-semibold text-neutral-700">Fecha de Vencimiento</Label>
                  <Input
                    id="inv-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-9 text-xs border-neutral-250"
                  />
                </div>
              </div>

              {/* DGII NCF TAX PARAMETERS - SHOWN ONLY FOR INVOICES */}
              {docType === 'Factura' && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <Label className="text-sm font-bold text-neutral-800">Modalidad de Facturación DGII</Label>
                    <div className="flex bg-neutral-200 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEcfMode(false);
                          setSelectedNcfType('B02');
                        }}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${!isEcfMode ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                      >
                        Clásica (NCF)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEcfMode(true);
                          setSelectedNcfType('E32');
                        }}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors flex items-center gap-1 ${isEcfMode ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Electrónica (e-CF)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="inv-ncftype" className="text-xs font-bold text-neutral-700">Comprobante DGII</Label>
                      <Select
                        value={selectedNcfType}
                        onValueChange={(val: NcfType) => {
                          setSelectedNcfType(val);
                          if (val === 'B01' || val === 'E31') setPaymentMethod('Transferencia');
                        }}
                      >
                        <SelectTrigger id="inv-ncftype" className="h-9 bg-white border-neutral-250 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {!isEcfMode ? (
                            <>
                              <SelectItem value="B02" className="text-xs">Consumo / Consumidor Final (B02)</SelectItem>
                              <SelectItem value="B14" className="text-xs">Regímenes Especiales (B14)</SelectItem>
                              <SelectItem value="B15" className="text-xs">Gubernamental (B15)</SelectItem>
                              <SelectItem value="B01" className="text-xs">Crédito Fiscal (B01)</SelectItem>
                              <SelectItem value="SIN" className="text-xs">Factura sin Comprobante Fiscal (SIN)</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="E32" className="text-xs">e-CF Consumo (E32)</SelectItem>
                              <SelectItem value="E31" className="text-xs">e-CF Crédito Fiscal (E31)</SelectItem>
                              <SelectItem value="E33" className="text-xs">e-CF Notas de Débito (E33)</SelectItem>
                              <SelectItem value="E34" className="text-xs">e-CF Notas de Crédito (E34)</SelectItem>
                              <SelectItem value="E44" className="text-xs">e-CF Regímenes Especiales (E44)</SelectItem>
                              <SelectItem value="E45" className="text-xs">e-CF Gubernamental (E45)</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-neutral-700">Número de secuencia NCF</Label>
                      <button
                        type="button"
                        onClick={() => setOverrideSequence(!overrideSequence)}
                        className="text-[10px] text-blue-600 hover:underline font-semibold"
                      >
                        {overrideSequence ? 'Automático' : 'Personalizar'}
                      </button>
                    </div>

                    {!overrideSequence ? (
                      <div className="h-9 bg-neutral-100 border border-neutral-200 rounded-md px-3 flex items-center text-xs text-neutral-600 font-mono">
                        Secuencia prevista: {getNextNcfPreview()}
                      </div>
                    ) : (
                      <Input
                        id="custom-seq-num"
                        type="number"
                        placeholder="Ej. 1"
                        value={customSequenceNum}
                        onChange={(e) => setCustomSequenceNum(e.target.value)}
                        className="h-9 bg-white text-xs border-neutral-250 font-mono"
                      />
                    )}
                  </div>
                </div>
                </div>
              )}

              {/* ITEM APPENDER FORM WITH NOVEL CATALOGUE & CUSTOM MODE TOGGLES */}
              <div className="border border-neutral-150 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Insertar Concepto a la Lista</span>
                  <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-150">
                    <button
                      type="button"
                      onClick={() => setIsCustomProductMode(false)}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center ${
                        !isCustomProductMode ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      Catálogo Autorizado
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomProductMode(true)}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center ${
                        isCustomProductMode ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      Concepto Personalizado
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  {!isCustomProductMode ? (
                    <>
                      <div className="md:col-span-3 space-y-1.5 font-semibold">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="add-prod" className="text-[10px] text-neutral-550 font-semibold">Producto o Servicio</Label>
                          <button
                            type="button"
                            onClick={() => setShowQuickProductModal(true)}
                            className="text-[9px] text-blue-600 hover:underline font-bold"
                          >
                            + Nuevo
                          </button>
                        </div>
                        <Select value={currentProductId} onValueChange={setCurrentProductId}>
                          <SelectTrigger id="add-prod" className="h-9 bg-white border-neutral-250 text-xs text-left">
                            {products.find(p => p.id === currentProductId) ? (
                              <span className="line-clamp-1">{products.find(p => p.id === currentProductId)?.name}</span>
                            ) : (
                              <SelectValue placeholder="Seleccione un artículo" />
                            )}
                          </SelectTrigger>
                          <SelectContent className="max-w-[340px] sm:max-w-[480px]">
                            {products.map(p => {
                              const lowStock = p.type === 'Producto' && p.stock <= p.minStock;
                              return (
                                <SelectItem key={p.id} value={p.id} className="text-xs">
                                  <div className="flex flex-col text-left py-0.5 whitespace-normal break-words leading-snug">
                                    <span>{p.name}</span>
                                    <span className="text-[9px] text-neutral-450 mt-0.5 block">
                                      Cód: {p.code} • RD$ {p.price.toLocaleString('es-DO')} {lowStock ? ' [Stock Mínimo]' : ''}
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-3 space-y-1.5 font-semibold">
                        <Label htmlFor="add-custom-name" className="text-[10px] text-neutral-550 font-semibold">Detalle o Concepto</Label>
                        <Input
                          id="add-custom-name"
                          type="text"
                          placeholder="Modifique descripción"
                          value={customItemName}
                          onChange={(e) => setCustomItemName(e.target.value)}
                          className="h-9 bg-white border-neutral-250 text-xs font-semibold"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-6 space-y-1.5 font-semibold">
                      <Label htmlFor="add-custom-name" className="text-[10px] text-neutral-550 font-semibold">Concepto Personalizado</Label>
                      <Input
                        id="add-custom-name"
                        type="text"
                        placeholder="Ej. Diagnóstico Técnico Adicional"
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        className="h-9 bg-white border-neutral-250 text-xs font-semibold"
                      />
                    </div>
                  )}

                  <div className="md:col-span-1 space-y-1.5 font-semibold">
                    <Label htmlFor="add-qty" className="text-[10px] text-neutral-550 font-semibold">Cant.</Label>
                    <Input
                      id="add-qty"
                      type="number"
                      min="1"
                      value={currentQty}
                      onChange={(e) => setCurrentQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-9 bg-white border-neutral-250 text-xs text-center"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5 font-semibold">
                    <Label htmlFor="add-price" className="text-[10px] text-neutral-550 font-semibold">Unitario ({currency})</Label>
                    <Input
                      id="add-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="h-9 bg-white border-neutral-250 text-xs text-right font-mono"
                    />
                  </div>

                  <div className="md:col-span-1 space-y-1.5 font-semibold">
                    <Label htmlFor="add-discount" className="text-[10px] text-neutral-550 font-semibold">Desc. %</Label>
                    <Input
                      id="add-discount"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={currentLineDiscount || ''}
                      onChange={(e) => setCurrentLineDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="h-9 bg-white border-neutral-250 text-xs text-center font-mono font-bold"
                    />
                  </div>

                  <div className="md:col-span-1 space-y-1.5 font-semibold">
                    <Label htmlFor="add-tax" className="text-[10px] text-neutral-550 font-semibold">ITBIS %</Label>
                    <Select value={String(currentTax)} onValueChange={(val) => setCurrentTax(Number(val))}>
                      <SelectTrigger id="add-tax" className="h-9 bg-white border-neutral-250 text-xs px-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18" className="text-xs">18%</SelectItem>
                        <SelectItem value="16" className="text-xs">16%</SelectItem>
                        <SelectItem value="10" className="text-xs">10%</SelectItem>
                        <SelectItem value="8" className="text-xs">8%</SelectItem>
                        <SelectItem value="0" className="text-xs">0%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-1 font-semibold">
                    <Button type="submit" className="h-9 w-full bg-black text-white hover:bg-neutral-800">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </form>

                {isCustomProductMode && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 px-1 border-t border-neutral-200/55 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="save-catalog-chk"
                        checked={saveCustomToCatalog}
                        onChange={(e) => setSaveCustomToCatalog(e.target.checked)}
                        className="rounded border-neutral-300 text-black focus:ring-black h-4 w-4"
                      />
                      <Label htmlFor="save-catalog-chk" className="text-[11px] text-neutral-600 font-medium cursor-pointer">Registrar en catálogo para usos futuros</Label>
                    </div>
                    
                    {saveCustomToCatalog && (
                      <div className="flex items-center space-x-4 bg-white px-3 py-1.5 rounded-lg border border-neutral-200">
                        <span className="text-[10px] font-bold text-neutral-400">Tipo:</span>
                        <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="custom-type-radio"
                            checked={customItemType === 'Servicio'}
                            onChange={() => setCustomItemType('Servicio')}
                            className="text-black focus:ring-black h-3.5 w-3.5"
                          />
                          <span className="text-[11px] text-neutral-600">Servicio</span>
                        </label>
                        <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="custom-type-radio"
                            checked={customItemType === 'Producto'}
                            onChange={() => setCustomItemType('Producto')}
                            className="text-black focus:ring-black h-3.5 w-3.5"
                          />
                          <span className="text-[11px] text-neutral-600">Producto</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* DRAFT ITEMS TABLE LIST */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Conceptos Registrados del Documento</span>
                <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-xs divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-3 py-2 text-center w-16">Cant.</th>
                        <th className="px-3 py-2">Detalle o Concepto</th>
                        <th className="px-3 py-2 text-right w-28">P. Unitario</th>
                        <th className="px-3 py-2 text-center w-20">Desc. %</th>
                        <th className="px-3 py-2 text-center w-20">ITBIS %</th>
                        <th className="px-3 py-2 text-right w-28">Suma Total</th>
                        <th className="px-3 py-2 text-center w-12">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {items.map((it, idx) => {
                        const prod = products.find(p => p.id === it.productId);
                        const stockShortage = prod && prod.type === 'Producto' && prod.stock < it.quantity;

                        return (
                          <tr key={idx} className="hover:bg-neutral-50/50">
                            <td className="px-3 py-1.5 text-center">
                              <Input
                                type="number"
                                min="1"
                                value={it.quantity}
                                onChange={(e) => handleUpdateLineQty(idx, Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-14 h-7 text-xs p-1 text-center border-neutral-250 font-mono"
                              />
                            </td>
                            <td className="px-3 py-2 font-medium text-neutral-800">
                              <div className="space-y-1.5 py-1">
                                <Input
                                  value={it.name}
                                  onChange={(e) => handleUpdateLineName(idx, e.target.value)}
                                  className="w-full h-8 px-2 text-xs border-neutral-250 rounded font-semibold bg-white"
                                />
                                {prod ? (
                                  <div className="text-[10px] text-neutral-550 space-y-1 bg-neutral-50 border border-neutral-150 rounded p-1.5">
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-neutral-550">Código:</span>
                                      <span className="font-mono bg-neutral-200/60 text-neutral-700 px-1 rounded font-semibold">{prod.code}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-neutral-550">Referencia:</span>
                                      <span className="text-neutral-700">{prod.type === 'Producto' ? 'Artículo de Inventario' : 'Servicio Autorizado'}</span>
                                    </div>
                                  </div>
                                ) : (
                                  it.productId && !it.productId.startsWith('custom-') && (
                                    <div className="text-[10px] text-neutral-550 bg-neutral-50 border border-neutral-150 rounded p-1.5">
                                      <span className="font-bold text-neutral-550">ID Referencia:</span> <span className="font-mono">{it.productId}</span>
                                    </div>
                                  )
                                )}
                                {stockShortage && (
                                  <div className="text-[9px] text-rose-700 font-bold bg-rose-50 border border-rose-150 px-2 py-0.5 rounded flex items-center gap-1 max-w-fit">
                                    <span>⚠️ Alerta: Stock actual de {prod?.stock} uds. es insuficiente.</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-1.5">
                              <div className="flex items-center space-x-1 justify-end">
                                <span className="text-neutral-400 text-[10px]">{currency}</span>
                                <input
                                  type="number"
                                  step="any"
                                  value={it.price}
                                  onChange={(e) => handleUpdateLinePrice(idx, parseFloat(e.target.value) || 0)}
                                  className="w-24 h-7 px-2 text-xs text-right border border-neutral-250 rounded font-mono bg-white"
                                />
                              </div>
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={it.discount || 0}
                                onChange={(e) => handleUpdateLineDiscount(idx, parseFloat(e.target.value) || 0)}
                                className="w-12 h-7 text-center border border-neutral-250 rounded font-mono bg-white font-bold text-xs"
                              />
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <Select value={String(it.taxRate)} onValueChange={(val) => handleUpdateLineTaxRate(idx, Number(val))}>
                                <SelectTrigger className="h-7 text-xs border-neutral-250 bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="18" className="text-[11px]">18%</SelectItem>
                                  <SelectItem value="16" className="text-[11px]">16%</SelectItem>
                                  <SelectItem value="10" className="text-[11px]">10%</SelectItem>
                                  <SelectItem value="8" className="text-[11px]">8%</SelectItem>
                                  <SelectItem value="0" className="text-[11px]">0%</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-1.5 text-right font-semibold text-neutral-900">
                              {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {it.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-650 hover:bg-red-50 hover:text-red-700 rounded-md"
                                onClick={() => handleRemoveItem(idx)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-xs text-neutral-400">
                            No hay conceptos asociados en la lista. Agregue conceptos con el formulario superior.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ADVANCED PAYMENT REGISTRATION */}
              {docType === 'Factura' && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-150 space-y-4" id="immediate-payments-section">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Cobros / Pagos Registrados</h4>
                      <p className="text-[10px] text-neutral-500">Registre uno o más cobros recibidos de forma inmediata para esta factura.</p>
                    </div>
                    {payments.length > 0 && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })} Registrado
                      </span>
                    )}
                  </div>

                  {/* Payments List Table */}
                  {payments.length > 0 ? (
                    <div className="overflow-hidden border border-neutral-200 rounded-lg bg-white">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-neutral-100 text-neutral-650 font-bold border-b border-neutral-200">
                            <th className="p-2">Método</th>
                            <th className="p-2">Cuenta Destino</th>
                            <th className="p-2">Comentario / Ref</th>
                            <th className="p-2 text-right">Monto</th>
                            <th className="p-2 text-center w-10">✕</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-150">
                          {payments.map((p, idx) => {
                            const acc = financialAccounts.find(fa => fa.id === p.accountId);
                            return (
                              <tr key={idx} className="hover:bg-neutral-50/50">
                                <td className="p-2 font-medium text-neutral-800">{p.paymentMethod}</td>
                                <td className="p-2 text-neutral-600">{acc ? acc.name : <em className="text-neutral-400">Sin cuenta vinculada</em>}</td>
                                <td className="p-2 text-neutral-550 italic">{p.notes || '-'}</td>
                                <td className="p-2 text-right font-semibold text-neutral-800">
                                  {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {p.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setPayments(payments.filter((_, i) => i !== idx))}
                                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-white border border-dashed border-neutral-200 rounded-lg text-neutral-400 text-[11px]">
                      No has agregado abonos o cobros todavía. Esta factura se guardará como <strong className="text-amber-800">Crédito / Pendiente</strong> a menos que agregues un pago aquí.
                    </div>
                  )}

                  {/* Payment insertion form inline */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-150 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-neutral-500">Monto del Pago</Label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={newPayAmount}
                          onChange={(e) => setNewPayAmount(e.target.value)}
                          className="w-full h-8 px-2 border border-neutral-250 rounded-md text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-neutral-950 pr-10"
                          placeholder="Monto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const pending = Math.max(0, finalTotal - payments.reduce((sum, p) => sum + p.amount, 0));
                            setNewPayAmount(String(pending));
                          }}
                          className="absolute right-1 top-1 bottom-1 px-1.5 bg-neutral-150 hover:bg-neutral-200 text-[9px] font-bold rounded text-neutral-650 h-6 h-fit self-center"
                          title="Auto-completar saldo restante"
                        >
                          Saldo
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-neutral-500">Método de Recibo</Label>
                      <Select value={newPayMethod} onValueChange={(val) => setNewPayMethod(val as PaymentMethod)}>
                        <SelectTrigger className="h-8 border-neutral-250 bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Efectivo" className="text-[11px]">Efectivo</SelectItem>
                          <SelectItem value="Transferencia" className="text-[11px]">Transferencia de Banco</SelectItem>
                          <SelectItem value="Tarjeta" className="text-[11px]">Tarjeta de Crédito</SelectItem>
                          <SelectItem value="Cheque" className="text-[11px]">Cheque</SelectItem>
                          <SelectItem value="Crédito" className="text-[11px]">Crédito / Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-neutral-500">Cuenta de Destino</Label>
                      <Select value={newPayAccountId || "none"} onValueChange={(val) => setNewPayAccountId(val === "none" ? "" : val)}>
                        <SelectTrigger className="h-8 border-neutral-250 bg-white text-xs">
                          <SelectValue placeholder="Seleccionar cuenta contable (Opcional)">
                            {(val: string | null) => {
                              if (!val || val === "none") return "Seleccionar cuenta contable (Opcional)";
                              return financialAccounts?.find((a: any) => a.id === val)?.name || val;
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-[11px] text-neutral-400">Seleccionar cuenta contable (Opcional)</SelectItem>
                          {financialAccounts.map((acc: any) => (
                            <SelectItem key={acc.id} value={acc.id} className="text-[11px]">
                              {acc.name} (Saldo: RD$ {acc.balance.toLocaleString('es-DO')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-neutral-500">Referencia / Comentario</Label>
                      <input
                        type="text"
                        value={newPayNotes}
                        onChange={(e) => setNewPayNotes(e.target.value)}
                        className="w-full h-8 px-2 border border-neutral-250 rounded-md text-xs focus:outline-none"
                        placeholder="Ej. Transferencia Popular #3812"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const amt = parseFloat(newPayAmount);
                        if (isNaN(amt) || amt <= 0) {
                          alert('Por favor ingrese un monto válido para el abono.');
                          return;
                        }
                        setPayments([...payments, {
                          amount: amt,
                          paymentMethod: newPayMethod,
                          accountId: newPayAccountId || undefined,
                          notes: newPayNotes.trim(),
                        }]);
                        setNewPayAmount('');
                        setNewPayNotes('');
                      }}
                      className="h-8 text-[11px] font-bold border-neutral-300 hover:bg-neutral-100 px-3.5 bg-neutral-200 text-neutral-800"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-emerald-800" />
                      Agregar Abono / Pago
                    </Button>
                  </div>
                </div>
              )}

              {/* FOOTNOTES & COMMENTS */}
              <div className="space-y-1.5">
                <Label htmlFor="inv-notes" className="text-xs font-semibold text-neutral-700">Notas / Términos de la Operación</Label>
                <textarea
                  id="inv-notes"
                  placeholder="Indique condiciones especiales adicionales..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-neutral-250 bg-white p-2.5 text-xs focus:ring-1 focus:ring-neutral-400 placeholder:text-neutral-400 h-20 outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SUMMARY LIVE ESTIMATED BOARD */}
        <div className="w-full space-y-6">
          <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-neutral-50 border-b border-neutral-150 p-4">
              <CardTitle className="text-xs uppercase text-neutral-400 font-bold tracking-wider">Cálculo en Vivo</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Monto Imponible:</span>
                  <span className="font-semibold text-neutral-800">
                    {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {subtotalSum.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between border-y border-dashed border-neutral-200/40 py-2.5 my-1.5 items-center">
                  <span className="text-neutral-550 font-bold uppercase tracking-wider text-[10px]">Desc. Global (%):</span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountRate || ''}
                      onChange={(e) => setDiscountRate(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-14 h-7 text-center rounded border border-neutral-250 text-xs font-mono bg-white font-bold"
                      placeholder="0"
                    />
                    <span className="font-bold text-neutral-400">%</span>
                  </div>
                </div>

                {discountRate > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold py-1">
                    <span>Descuento ({discountRate}%):</span>
                    <span className="font-mono">
                      - {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {(subtotalSum * (discountRate / 100)).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500">
                  <span>Suma de ITBIS {discountRate > 0 ? `(-${discountRate}%)` : ''}:</span>
                  <span className="font-semibold text-neutral-800">
                    {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {finalTax.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between border-t border-dashed border-neutral-200 pt-2 font-black text-neutral-900 text-sm">
                  <span>Importe Neto Total:</span>
                  <span className="text-base text-emerald-800 font-heading font-bold">
                    {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {finalTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {docType === 'Factura' && payments.length > 0 && (
                  <>
                    <div className="flex justify-between text-emerald-700 font-bold py-1 border-t border-dashed border-neutral-200 mt-1">
                      <span>Total Pagado:</span>
                      <span>
                        {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between text-amber-900 font-semibold py-1">
                      <span>Balance Pendiente:</span>
                      <span>
                        {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'} {Math.max(0, finalTotal - payments.reduce((sum, p) => sum + p.amount, 0)).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-150 space-y-2">
                {isRoleAuthorized ? (
                  <>
                    <Button
                      onClick={handleCreateDocument}
                      disabled={isEmitting}
                      className="w-full h-9 bg-neutral-950 text-white hover:bg-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5"
                      id="submit-invoice-btn"
                    >
                      {isEmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {isEmitting ? 'Procesando...' : 'Guardar'}
                    </Button>
                    <Button
                      onClick={handleSaveDraft}
                      disabled={isEmitting}
                      variant="outline"
                      className="w-full h-9 text-xs border-neutral-250 hover:bg-neutral-100 font-semibold"
                    >
                      Guardar como Borrador
                    </Button>
                  </>
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-red-50 text-red-900 rounded-lg text-xs leading-relaxed border border-red-150">
                    Su perfil de usuario no cuenta con los permisos necesarios para emitir documentos.
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => onSuccess()}
                  className="w-full h-9 text-xs border-neutral-250 hover:bg-neutral-100"
                >
                  Cancelar Operación
                </Button>
              </div>

              {/* DGII PREVIEW NOTIFICATION */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-900 rounded-lg text-[10px] leading-relaxed border border-blue-150">
                <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Consistencia Fiscal DGII</span>
                  Se registrarán de forma segura todos los cálculos y reportes DGII automatizados en las transacciones vigentes.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
