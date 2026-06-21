import React, { useState, useRef } from 'react';
import { Client, Product, Provider, ClientType, Warehouse } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Download, Upload, Plus, Search, Trash2, Edit, FileSpreadsheet, Sparkles, Building, User, Package, Check, CheckCircle2, AlertTriangle, Loader2, Eye, Phone, Mail, MapPin, Calendar, Hash, Tag, DollarSign, Layers, Warehouse as WarehouseIcon, ShieldCheck, Globe, UserCircle, ScanBarcode, TrendingUp } from 'lucide-react';
import { exportClientsToExcel, importClientsFromExcel, exportProductsToExcel, importProductsFromExcel, exportProvidersToExcel, importProvidersFromExcel, downloadImportTemplate } from '../../lib/excelExport';
import { getDgiiAutocomplete, validateDgiiRnc } from '../../lib/dgiiApi';

interface DirectoriesProps {
  clients: Client[];
  products: Product[];
  providers: Provider[];
  warehouses: Warehouse[];
  addClient: (c: Omit<Client, 'id' | 'createdAt'>) => void | Promise<any>;
  updateClient: (id: string, updated: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  importClientsBulk: (clients: Omit<Client, 'id' | 'createdAt'>[]) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void | Promise<any>;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importProductsBulk: (products: Omit<Product, 'id' | 'createdAt'>[]) => void;
  addProvider: (prov: Omit<Provider, 'id' | 'createdAt'>) => void | Promise<any>;
  updateProvider: (id: string, updated: Partial<Provider>) => void;
  deleteProvider: (id: string) => void;
  importProvidersBulk: (providers: Omit<Provider, 'id' | 'createdAt'>[]) => void;
  currentUser: any;
  initialSearchQuery?: string;
  clearInitialSearchQuery?: () => void;
  initialTab?: 'clients' | 'products' | 'providers';
  triggerClientModal?: boolean;
  clearTriggerClientModal?: () => void;
  triggerProductModal?: boolean;
  clearTriggerProductModal?: () => void;
}

export default function Directories({
  clients,
  products,
  providers,
  warehouses,
  addClient,
  updateClient,
  deleteClient,
  importClientsBulk,
  addProduct,
  updateProduct,
  deleteProduct,
  importProductsBulk,
  addProvider,
  updateProvider,
  deleteProvider,
  importProvidersBulk,
  currentUser,
  initialSearchQuery,
  clearInitialSearchQuery,
  initialTab,
  triggerClientModal,
  clearTriggerClientModal,
  triggerProductModal,
  clearTriggerProductModal,
}: DirectoriesProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'products' | 'providers'>('clients');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (triggerClientModal) {
      resetClientForm();
      setClientModalOpen(true);
      if (clearTriggerClientModal) {
        clearTriggerClientModal();
      }
    }
  }, [triggerClientModal]);

  React.useEffect(() => {
    if (triggerProductModal) {
      resetProductForm();
      setProductModalOpen(true);
      if (clearTriggerProductModal) {
        clearTriggerProductModal();
      }
    }
  }, [triggerProductModal]);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      // Try to intelligently switch tabs based on query
      const isProductMatch = products.some(p => p.code.toLowerCase() === initialSearchQuery.toLowerCase() || p.name.toLowerCase().includes(initialSearchQuery.toLowerCase()));
      if (isProductMatch) {
        setActiveTab('products');
      } else {
        const isProviderMatch = providers.some(pv => pv.name.toLowerCase().includes(initialSearchQuery.toLowerCase()) || pv.rnc.includes(initialSearchQuery));
        if (isProviderMatch) {
          setActiveTab('providers');
        } else {
          setActiveTab('clients');
        }
      }
      
      if (clearInitialSearchQuery) {
        clearInitialSearchQuery();
      }
    }
  }, [initialSearchQuery]);
  
  // Dialog Open States
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [providerModalOpen, setProviderModalOpen] = useState(false);

  // Edit States
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  // View Detail States
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [viewingProvider, setViewingProvider] = useState<Provider | null>(null);

  // File Upload Reference Hidden Inputs
  const clientFileRef = useRef<HTMLInputElement>(null);
  const productFileRef = useRef<HTMLInputElement>(null);
  const providerFileRef = useRef<HTMLInputElement>(null);

  // Inline Notification
  const [importNotice, setImportNotice] = useState<{ text: string; success: boolean } | null>(null);

  // Form Fields - Clients
  const [clientType, setClientType] = useState<ClientType>('Empresa');
  const [clientName, setClientName] = useState('');
  const [clientRnc, setClientRnc] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // DGII API Cloud Autocomplete & Validation States
  const [dgiiSuggestions, setDgiiSuggestions] = useState<any[]>([]);
  const [showDgiiSuggestions, setShowDgiiSuggestions] = useState(false);
  const [isSearchingDgii, setIsSearchingDgii] = useState(false);
  const [dgiiValidation, setDgiiValidation] = useState<any | null>(null);
  const [dgiiError, setDgiiError] = useState<string | null>(null);

  // Form Fields - Products
  const [prodCode, setProdCode] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodType, setProdType] = useState<'Producto' | 'Servicio'>('Producto');
  const [prodPrice, setProdPrice] = useState('0');
  const [prodCost, setProdCost] = useState('0');
  const [prodTax, setProdTax] = useState('18');
  const [prodPriceIncludesTax, setProdPriceIncludesTax] = useState(true);
  const [prodStock, setProdStock] = useState('0');
  const [prodMinStock, setProdMinStock] = useState('0');
  const [prodProviderId, setProdProviderId] = useState('');
  const [prodWarehouseId, setProdWarehouseId] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [prodCategory, setProdCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isKit, setIsKit] = useState(false);
  const [kitItems, setKitItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [batches, setBatches] = useState<{ batchNumber: string; expirationDate: string; stock: number }[]>([]);
  const [showQuickProvider, setShowQuickProvider] = useState(false);
  const [quickProvName, setQuickProvName] = useState('');
  const [quickProvPhone, setQuickProvPhone] = useState('');
  const [quickProvEmail, setQuickProvEmail] = useState('');
  const prodImageFileRef = useRef<HTMLInputElement>(null);
  const [stockLevels, setStockLevels] = useState<{ warehouseId: string; stock: number; minStock: number }[]>([]);

  // Form Fields - Providers
  const [provName, setProvName] = useState('');
  const [provRnc, setProvRnc] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPhone, setProvPhone] = useState('');
  const [provAddress, setProvAddress] = useState('');
  const [provContact, setProvContact] = useState('');

  // DGII States for Providers
  const [provDgiiSuggestions, setProvDgiiSuggestions] = useState<any[]>([]);
  const [showProvDgiiSuggestions, setShowProvDgiiSuggestions] = useState(false);
  const [isSearchingProvDgii, setIsSearchingProvDgii] = useState(false);
  const [provDgiiValidation, setProvDgiiValidation] = useState<any | null>(null);
  const [provDgiiError, setProvDgiiError] = useState<string | null>(null);

  // Handle Client Save
  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = clientName.trim() || "Cliente Sin Nombre";

    const data = {
      type: clientType,
      name: finalName,
      rncOrCedula: clientRnc,
      email: clientEmail,
      phone: clientPhone,
      address: clientAddress,
      // DGII extracted properties
      dgiiVerified: dgiiValidation?.valid || false,
      dgiiEstatus: dgiiValidation?.data?.estatus || dgiiValidation?.data?.status || null,
      dgiiRegimen: dgiiValidation?.data?.regimen || null,
      dgiiCategoria: dgiiValidation?.data?.categoria || null,
      dgiiActividad: dgiiValidation?.data?.actividad_economica || null,
      dgiiProvincia: dgiiValidation?.data?.provincia || null,
      dgiiMunicipio: dgiiValidation?.data?.municipio || null,
    };

    if (editingClient) {
      updateClient(editingClient.id, data);
    } else {
      addClient(data);
    }

    resetClientForm();
    setClientModalOpen(false);
  };

  const resetClientForm = () => {
    setEditingClient(null);
    setClientType('Empresa');
    setClientName('');
    setClientRnc('');
    setClientEmail('');
    setClientPhone('');
    setClientAddress('');
    setDgiiSuggestions([]);
    setShowDgiiSuggestions(false);
    setDgiiValidation(null);
    setDgiiError(null);
  };

  const handleClientNameChange = async (val: string) => {
    setClientName(val);
    if (!val || val.trim().length < 3) {
      setDgiiSuggestions([]);
      setShowDgiiSuggestions(false);
      return;
    }
    setIsSearchingDgii(true);
    try {
      const typeParam = clientType === 'Fisica' ? 'cedula' : 'rnc';
      const results = await getDgiiAutocomplete(val, 6, typeParam);
      setDgiiSuggestions(results);
      setShowDgiiSuggestions(results.length > 0);
    } catch (err) {
      console.error('Error fetching autocomplete:', err);
    } finally {
      setIsSearchingDgii(false);
    }
  };

  const handleValidateRnc = async () => {
    if (!clientRnc) return;
    setIsSearchingDgii(true);
    setDgiiError(null);
    setDgiiValidation(null);
    try {
      const res = await validateDgiiRnc(clientRnc);
      if (res && res.valid) {
        setDgiiValidation(res);
        if (res.data) {
          setClientName(res.data.nombre);
          if (res.data.provincia && res.data.municipio) {
            setClientAddress(`${res.data.provincia}, ${res.data.municipio}, R.D.`);
          }
        }
      } else {
        setDgiiValidation({ valid: false });
        setDgiiError('RNC/Cédula no encontrado en los registros de la DGII.');
      }
    } catch (err) {
      console.error(err);
      setDgiiError('Error al contactar con la DGII API Cloud.');
    } finally {
      setIsSearchingDgii(false);
    }
  };

  const startEditClient = (c: Client) => {
    setEditingClient(c);
    setClientType(c.type);
    setClientName(c.name);
    setClientRnc(c.rncOrCedula);
    setClientEmail(c.email);
    setClientPhone(c.phone);
    setClientAddress(c.address);
    if (c.dgiiVerified) {
      setDgiiValidation({
        valid: true,
        found_in_dgii: true,
        data: {
          nombre: c.name,
          rnc: c.rncOrCedula,
          estatus: c.dgiiEstatus,
          regimen: c.dgiiRegimen,
          categoria: c.dgiiCategoria,
          actividad_economica: c.dgiiActividad,
          provincia: c.dgiiProvincia,
          municipio: c.dgiiMunicipio,
        }
      });
    } else {
      setDgiiValidation(null);
    }
    setClientModalOpen(true);
  };

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;

    let finalImageUrl = prodImageUrl;
    // If a file was selected, upload it to InsForge Storage
    if (prodImageFile) {
      setIsUploadingImage(true);
      try {
        const { insforge } = await import('../../lib/insforge');
        const { data: uploadData, error: uploadError } = await insforge.storage
          .from('product-images')
          .uploadAuto(prodImageFile);
        if (uploadData?.url) {
          finalImageUrl = uploadData.url;
        } else if (uploadError) {
          console.warn('Image upload failed:', uploadError);
          // Keep blob URL as fallback
        }
      } catch (err) {
        console.warn('Image upload failed, using local blob URL', err);
      } finally {
        setIsUploadingImage(false);
      }
    }

    const data = {
      code: prodCode || `PROD-${Math.floor(100 + Math.random() * 900)}`,
      name: prodName,
      type: prodType,
      price: Number(prodPrice) || 0,
      cost: Number(prodCost) || 0,
      taxRate: Number(prodTax) || 0,
      priceIncludesTax: prodPriceIncludesTax,
      stock: prodType === 'Servicio' ? 0 : Number(prodStock) || 0,
      minStock: Number(prodMinStock) || 0,
      providerId: prodProviderId && prodProviderId !== 'none_selected' ? prodProviderId : undefined,
      warehouseId: prodType === 'Producto' && prodWarehouseId ? prodWarehouseId : undefined,
      imageUrl: finalImageUrl || undefined,
      category: prodCategory || undefined,
      isKit,
      kitItems,
      batches,
      stockLevels,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }

    resetProductForm();
    setProductModalOpen(false);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdCode('');
    setProdName('');
    setProdType('Producto');
    setProdPrice('0');
    setProdCost('0');
    setProdTax('18');
    setProdPriceIncludesTax(true);
    setProdStock('0');
    setProdMinStock('0');
    setProdProviderId('');
    // Auto-select default warehouse
    const defaultWh = warehouses.find(w => w.isDefault) || warehouses[0];
    setProdWarehouseId(defaultWh?.id || '');
    setProdImageUrl('');
    setProdImageFile(null);
    setProdCategory('');
    setIsCustomCategory(false);
    setShowQuickProvider(false);
    setQuickProvName('');
    setQuickProvPhone('');
    setQuickProvEmail('');
  };

  const handleProdImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProdImageFile(file);
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setProdImageUrl(localUrl);
  };

  const handleQuickCreateProvider = async () => {
    if (!quickProvName.trim()) return;
    const newProv = await addProvider({
      name: quickProvName.trim(),
      rnc: '',
      email: quickProvEmail.trim(),
      phone: quickProvPhone.trim(),
      address: '',
      contactName: '',
    });
    // Select the newly created provider
    if (newProv?.id) setProdProviderId(newProv.id);
    setShowQuickProvider(false);
    setQuickProvName('');
    setQuickProvPhone('');
    setQuickProvEmail('');
  };

  // Barcode Scanner using BarcodeDetector API (supported in Chrome/Edge on mobile/desktop)
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

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdCode(p.code);
    setProdName(p.name);
    setProdType(p.type);
    setProdPrice(String(p.price));
    setProdCost(String(p.cost));
    setProdTax(String(p.taxRate));
    setProdPriceIncludesTax(p.priceIncludesTax !== false);
    setProdStock(String(p.stock));
    setProdMinStock(String(p.minStock));
    setProdProviderId(p.providerId || '');
    setProdWarehouseId(p.warehouseId || '');
    setProdImageUrl(p.imageUrl || '');
    setProdCategory(p.category || '');
    setIsCustomCategory(false);
    setIsKit(p.isKit || false);
    setKitItems(p.kitItems || []);
    setBatches(p.batches || []);
    setStockLevels(p.stockLevels || []);
    setProductModalOpen(true);
  };

  // Handle Provider Save
  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provName) return;

    const data = {
      name: provName,
      rnc: provRnc,
      email: provEmail,
      phone: provPhone,
      address: provAddress,
      contactName: provContact,
      // DGII extracted properties for Provider
      dgiiVerified: provDgiiValidation?.valid || false,
      dgiiEstatus: provDgiiValidation?.data?.estatus || provDgiiValidation?.data?.status || null,
      dgiiRegimen: provDgiiValidation?.data?.regimen || null,
      dgiiCategoria: provDgiiValidation?.data?.categoria || null,
      dgiiActividad: provDgiiValidation?.data?.actividad_economica || null,
      dgiiProvincia: provDgiiValidation?.data?.provincia || null,
      dgiiMunicipio: provDgiiValidation?.data?.municipio || null,
    };

    if (editingProvider) {
      updateProvider(editingProvider.id, data);
    } else {
      addProvider(data);
    }

    resetProviderForm();
    setProviderModalOpen(false);
  };

  const resetProviderForm = () => {
    setEditingProvider(null);
    setProvName('');
    setProvRnc('');
    setProvEmail('');
    setProvPhone('');
    setProvAddress('');
    setProvContact('');
    setProvDgiiSuggestions([]);
    setShowProvDgiiSuggestions(false);
    setProvDgiiValidation(null);
    setProvDgiiError(null);
  };

  const handleProvNameChange = async (val: string) => {
    setProvName(val);
    if (!val || val.trim().length < 3) {
      setProvDgiiSuggestions([]);
      setShowProvDgiiSuggestions(false);
      return;
    }
    setIsSearchingProvDgii(true);
    try {
      const results = await getDgiiAutocomplete(val, 6, 'rnc');
      setProvDgiiSuggestions(results);
      setShowProvDgiiSuggestions(results.length > 0);
    } catch (err) {
      console.error('Error fetching provider autocomplete:', err);
    } finally {
      setIsSearchingProvDgii(false);
    }
  };

  const handleValidateProvRnc = async () => {
    if (!provRnc) return;
    setIsSearchingProvDgii(true);
    setProvDgiiError(null);
    setProvDgiiValidation(null);
    try {
      const res = await validateDgiiRnc(provRnc);
      if (res && res.valid) {
        setProvDgiiValidation(res);
        if (res.data) {
          setProvName(res.data.nombre);
          if (res.data.provincia && res.data.municipio) {
            setProvAddress(`${res.data.provincia}, ${res.data.municipio}, R.D.`);
          }
        }
      } else {
        setProvDgiiValidation({ valid: false });
        setProvDgiiError('RNC/Cédula no encontrado en los registros de la DGII.');
      }
    } catch (err) {
      console.error(err);
      setProvDgiiError('Error al contactar con la DGII API Cloud.');
    } finally {
      setIsSearchingProvDgii(false);
    }
  };

  const startEditProvider = (p: Provider) => {
    setEditingProvider(p);
    setProvName(p.name);
    setProvRnc(p.rnc);
    setProvEmail(p.email);
    setProvPhone(p.phone);
    setProvAddress(p.address);
    setProvContact(p.contactName);
    if (p.dgiiVerified) {
      setProvDgiiValidation({
        valid: true,
        found_in_dgii: true,
        data: {
          nombre: p.name,
          rnc: p.rnc,
          estatus: p.dgiiEstatus,
          regimen: p.dgiiRegimen,
          categoria: p.dgiiCategoria,
          actividad_economica: p.dgiiActividad,
          provincia: p.dgiiProvincia,
          municipio: p.dgiiMunicipio,
        }
      });
    } else {
      setProvDgiiValidation(null);
    }
    setProviderModalOpen(true);
  };

  // Excel Carga Masiva Upload Handlers
  const handleClientExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx') {
      showNotice('Seguridad: Solo se admiten archivos de hoja de cálculo con extensión oficial .xlsx.', false);
      if (clientFileRef.current) clientFileRef.current.value = '';
      return;
    }

    try {
      const parsed = await importClientsFromExcel(file);
      if (parsed.length > 0) {
        importClientsBulk(parsed as any);
        showNotice(`Se cargaron exitosamente ${parsed.length} clientes desde el Excel.`, true);
      } else {
        showNotice('No se encontraron registros de clientes válidos en el archivo.', false);
      }
    } catch (err) {
      console.error(err);
      showNotice('Error al procesar el archivo Excel. Verifique que use la estructura correcta.', false);
    }
    if (clientFileRef.current) clientFileRef.current.value = '';
  };

  const handleProductExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx') {
      showNotice('Seguridad: Solo se admiten archivos de hoja de cálculo con extensión oficial .xlsx.', false);
      if (productFileRef.current) productFileRef.current.value = '';
      return;
    }

    try {
      const parsed = await importProductsFromExcel(file);
      if (parsed.length > 0) {
        importProductsBulk(parsed as any);
        showNotice(`Se cargaron exitosamente ${parsed.length} productos/servicios desde el Excel.`, true);
      } else {
        showNotice('No se encontraron registros válidos en la plantilla.', false);
      }
    } catch (err) {
      console.error(err);
      showNotice('Error al leer el archivo. Compruebe las extensiones y columnas.', false);
    }
    if (productFileRef.current) productFileRef.current.value = '';
  };

  const handleProviderExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx') {
      showNotice('Seguridad: Solo se admiten archivos de hoja de cálculo con extensión oficial .xlsx.', false);
      if (providerFileRef.current) providerFileRef.current.value = '';
      return;
    }

    try {
      const parsed = await importProvidersFromExcel(file);
      if (parsed.length > 0) {
        importProvidersBulk(parsed as any);
        showNotice(`Se cargaron exitosamente ${parsed.length} proveedores desde el Excel.`, true);
      } else {
        showNotice('No hay registros válidos del proveedor en el archivo.', false);
      }
    } catch (err) {
      console.error(err);
      showNotice('Error de importación del proveedor. Verifique columnas requeridas.', false);
    }
    if (providerFileRef.current) providerFileRef.current.value = '';
  };

  const showNotice = (text: string, success: boolean) => {
    setImportNotice({ text, success });
    setTimeout(() => setImportNotice(null), 5000);
  };

  // Search filter
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.rncOrCedula.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.rnc.includes(searchQuery)
  );

  const canEdit = currentUser.permissions.canEditInvoice || currentUser.role === 'Administrador';
  const canDelete = currentUser.permissions.canDeleteInvoice || currentUser.role === 'Administrador';

  return (
    <div className="space-y-6" id="directories-panel">
      {/* Tab Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading">Clientes</h2>
          <p className="text-sm text-neutral-500">Administre su cartera de clientes, su catálogo de proveedores y su inventario de artículos.</p>
        </div>

        <div className="flex items-center space-x-1.5 bg-neutral-100 p-1 rounded-lg self-start">
          <Button
            id="tab-clients"
            variant={activeTab === 'clients' ? 'default' : 'ghost'}
            className="text-xs h-8 px-3 rounded-md transition-all font-medium"
            onClick={() => { setActiveTab('clients'); setSearchQuery(''); }}
          >
            Clientes
          </Button>
          <Button
            id="tab-products"
            variant={activeTab === 'products' ? 'default' : 'ghost'}
            className="text-xs h-8 px-3 rounded-md transition-all font-medium"
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
          >
            Mobiliario e Inventario
          </Button>
          <Button
            id="tab-providers"
            variant={activeTab === 'providers' ? 'default' : 'ghost'}
            className="text-xs h-8 px-3 rounded-md transition-all font-medium"
            onClick={() => { setActiveTab('providers'); setSearchQuery(''); }}
          >
            Proveedores
          </Button>
        </div>
      </div>

      {/* Global Alerts for operations */}
      {importNotice && (
        <div id="import-alert" className={`p-4 rounded-xl text-xs flex items-center justify-between border ${importNotice.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>{importNotice.text}</span>
          </div>
          <button className="font-bold underline" onClick={() => setImportNotice(null)}>Cerrar</button>
        </div>
      )}

      {/* Search & Bulk Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-neutral-200 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 h-4 text-neutral-400" />
          <Input
            id="directory-search"
            placeholder={`Buscar por nombre, código o identificación fiscal...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full md:max-w-md bg-neutral-50 border-neutral-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export action */}
          <Button
            id="export-directory"
            variant="outline"
            size="sm"
            className="text-xs border-neutral-200 bg-white"
            onClick={() => {
              if (activeTab === 'clients') exportClientsToExcel(clients);
              else if (activeTab === 'products') exportProductsToExcel(products);
              else exportProvidersToExcel(providers);
            }}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Exportar Excel
          </Button>

          {/* Import action - check permissions */}
          {canEdit && (
            <>
              <Button
                id="template-download"
                variant="outline"
                size="sm"
                className="text-xs border-neutral-200 bg-white text-neutral-600"
                onClick={() => downloadImportTemplate(activeTab === 'clients' ? 'clientes' : activeTab === 'products' ? 'productos' : 'proveedores')}
                title="Descargar plantilla Excel limpia"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Descargar Plantilla
              </Button>

              <Button
                id="import-excel"
                variant="outline"
                size="sm"
                className="text-xs border-neutral-200 bg-white text-neutral-700"
                onClick={() => {
                  if (activeTab === 'clients') clientFileRef.current?.click();
                  else if (activeTab === 'products') productFileRef.current?.click();
                  else providerFileRef.current?.click();
                }}
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                Carga Masiva (Excel)
              </Button>
            </>
          )}

          {/* Hidden inputs */}
          <input type="file" ref={clientFileRef} accept=".xlsx" onChange={handleClientExcelUpload} className="hidden" />
          <input type="file" ref={productFileRef} accept=".xlsx" onChange={handleProductExcelUpload} className="hidden" />
          <input type="file" ref={providerFileRef} accept=".xlsx" onChange={handleProviderExcelUpload} className="hidden" />

          {/* Add Dialog Triggers */}
          {canEdit && (
            <Button
              id="add-entry-btn"
              size="sm"
              className="text-xs bg-black text-white hover:bg-neutral-800"
              onClick={() => {
                if (activeTab === 'clients') { resetClientForm(); setClientModalOpen(true); }
                else if (activeTab === 'products') { resetProductForm(); setProductModalOpen(true); }
                else { resetProviderForm(); setProviderModalOpen(true); }
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {activeTab === 'clients' ? 'Nuevo Cliente' : activeTab === 'products' ? 'Nuevo Producto' : 'Nuevo Proveedor'}
            </Button>
          )}
        </div>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'clients' && (
        <Card className="border-neutral-200 overflow-hidden shadow-none rounded-xl">
          <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4">
            <CardTitle className="text-sm font-semibold text-neutral-900">Cartera de Clientes ({filteredClients.length})</CardTitle>
            <CardDescription className="text-xs">Clientes registrados aptos para ser asociados a cotizaciones y facturas fiscales.</CardDescription>
          </CardHeader>
        <div className="hidden lg:block">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="w-[80px] text-xs font-semibold text-neutral-700">Tipo</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Nombre / Razón Social</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">ID Fiscal (RNC/Cédula)</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Contacto</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Dirección</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-neutral-400 py-12 text-sm">
                    No se encontraron clientes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-neutral-50/50">
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium leading-none ${client.type === 'Empresa' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                        {client.type === 'Empresa' ? <Building className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                        {client.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-neutral-900 text-xs sm:text-sm">{client.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{client.rncOrCedula}</span>
                        {client.dgiiVerified && (
                          <span className="inline-flex items-center px-1 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded border border-emerald-200" title={`DGII Activo • Régimen: ${client.dgiiRegimen || 'Ordinario'}`}>
                            <Check className="w-2.5 h-2.5 text-emerald-600 mr-0.5" /> DGII
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs space-y-0.5">
                      <div className="text-neutral-850 font-medium">{client.phone}</div>
                      <div className="text-neutral-500">{client.email}</div>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-600 max-w-[200px] truncate">{client.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600 hover:bg-indigo-50 rounded-md" onClick={() => setViewingClient(client)} title="Ver detalle">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {canEdit && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 rounded-md" onClick={() => startEditClient(client)}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-650 hover:bg-red-50 hover:text-red-700 rounded-md" onClick={() => deleteClient(client.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* MOBILE RESPONSIVE CLIENT GRID */}
        <div className="block lg:hidden bg-neutral-50/10">
          {filteredClients.length === 0 ? (
            <div className="text-center text-neutral-400 py-16 text-xs">
              No se encontraron clientes registrados.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-3">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 rounded-xl border border-neutral-150 bg-white hover:border-neutral-300 transition-all flex flex-col gap-3 relative shadow-xs"
                >
                  {/* Top: title & badge */}
                  <div className="flex items-start justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs sm:text-sm block leading-snug">
                      {client.name}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold leading-none shrink-0 ${client.type === 'Empresa' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                      {client.type === 'Empresa' ? <Building className="w-2.5 h-2.5 mr-1" /> : <User className="w-2.5 h-2.5 mr-1" />}
                      {client.type}
                    </span>
                  </div>

                  {/* Body data */}
                  <div className="space-y-1.5 py-1.5 px-2 bg-neutral-50/70 rounded-lg text-xs">
                    <div>
                      <span className="text-neutral-400 font-medium mr-1 text-[9px] uppercase block">ID Fiscal (RNC/Cédula)</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-neutral-850 font-bold">{client.rncOrCedula}</span>
                        {client.dgiiVerified && (
                          <span className="inline-flex items-center px-1 bg-emerald-50 text-emerald-700 text-[8.5px] font-extrabold rounded border border-emerald-200" title={`DGII Activo • Régimen: ${client.dgiiRegimen}`}>
                            <Check className="w-2.5 h-2.5 text-emerald-600 mr-0.5" /> DGII
                          </span>
                        )}
                      </div>
                    </div>

                    {(client.phone || client.email) && (
                      <div className="border-t border-neutral-100/55 pt-1.5 mt-1.5 grid grid-cols-2 gap-2">
                        {client.phone && (
                          <div>
                            <span className="text-neutral-400 text-[9px] uppercase block">Teléfono</span>
                            <span className="text-neutral-800 font-semibold block mt-0.5">{client.phone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div>
                            <span className="text-neutral-400 text-[9px] uppercase block col-span-2">Correo</span>
                            <span className="text-neutral-800 block truncate mt-0.5" title={client.email}>{client.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {client.address && (
                      <div className="border-t border-neutral-100/55 pt-1.5 mt-1.5">
                        <span className="text-neutral-400 text-[9px] uppercase block font-medium">Dirección</span>
                        <span className="text-neutral-700 block mt-0.5 text-[11px] leading-relaxed">{client.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Large tactile action buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 active:scale-95 duration-100 py-2 h-9 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer font-bold text-[11px]"
                      onClick={() => setViewingClient(client)}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Ver</span>
                    </button>
                    {canEdit && (
                      <button
                        type="button"
                        className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 active:scale-95 duration-100 py-2 h-9 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer font-bold text-[11px]"
                        onClick={() => startEditClient(client)}
                      >
                        <Edit className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Editar</span>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        className="bg-red-50 hover:bg-red-105 border border-red-150 text-red-750 active:scale-95 duration-100 py-2 h-9 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer font-bold text-[11px]"
                        onClick={() => deleteClient(client.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </Card>
      )}

      {activeTab === 'products' && (
        <Card className="border-neutral-200 overflow-hidden shadow-none rounded-xl">
          <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4">
            <CardTitle className="text-sm font-semibold text-neutral-900">Catálogo de Productos y Servicios ({filteredProducts.length})</CardTitle>
            <CardDescription className="text-xs">Control de existencias e ITBIS integrado. Los servicios no contienen stock.</CardDescription>
          </CardHeader>
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="w-[100px] text-xs font-semibold text-neutral-700">SKU</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Nombre del Artículo</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Tipo</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Costo (RD$)</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Precio Venta (RD$)</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">ITBIS</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Margen</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Stock</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-neutral-400 py-12 text-sm">
                    No hay productos o servicios registrados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.type === 'Producto' && p.stock <= p.minStock;
                  return (
                    <TableRow key={p.id} className="hover:bg-neutral-50/50">
                      <TableCell className="font-mono text-xs font-medium text-neutral-600">{p.code}</TableCell>
                      <TableCell className="font-medium text-neutral-900 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2.5">
                          {p.type === 'Producto' && (
                            <div className="w-8 h-8 rounded-lg border border-neutral-200 overflow-hidden shrink-0 bg-neutral-100 flex items-center justify-center">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <Package className="w-4 h-4 text-neutral-400" />
                              )}
                            </div>
                          )}
                          <div>
                            <span className="block font-medium">{p.name}</span>
                            {p.type === 'Producto' && p.warehouseId && (
                              <span className="text-[10px] text-neutral-500 font-sans block mt-0.5">
                                Almacén: {warehouses.find(w => w.id === p.warehouseId)?.name || 'N/A'}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium leading-none ${p.type === 'Producto' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-purple-50 text-purple-800 border border-purple-200'}`}>
                          {p.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-neutral-600">
                        {p.cost > 0 ? p.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }) : 'Exento'}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-medium text-neutral-900">
                        {p.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </TableCell>
                      <TableCell className="text-center text-xs text-neutral-500 font-mono">{p.taxRate}%</TableCell>
                      <TableCell className="text-center">
                        {p.cost > 0 && p.price > 0 ? (() => {
                          const margin = ((p.price - p.cost) / p.price) * 100;
                          return (
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${margin >= 30 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : margin >= 10 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                              {margin.toFixed(0)}%
                            </span>
                          );
                        })() : <span className="text-[10px] text-neutral-400">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.type === 'Servicio' ? (
                          <span className="text-xs text-neutral-400">—</span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono ${isLow ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-neutral-100 text-neutral-800'}`}>
                            {p.stock} <span className="text-[10px] text-neutral-500 ml-1">/ {p.minStock}</span>
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600 hover:bg-indigo-50 rounded-md" onClick={() => setViewingProduct(p)} title="Ver detalle">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {canEdit && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 rounded-md" onClick={() => startEditProduct(p)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-655 hover:bg-red-50 hover:text-red-700 rounded-md" onClick={() => deleteProduct(p.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === 'providers' && (
        <Card className="border-neutral-200 overflow-hidden shadow-none rounded-xl">
          <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4">
            <CardTitle className="text-sm font-semibold text-neutral-900">Catálogo de Proveedores / Distribuidores ({filteredProviders.length})</CardTitle>
            <CardDescription className="text-xs">Proveedores autorizados para auditar facturas de compras (606) y reabastecimiento.</CardDescription>
          </CardHeader>
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="text-xs font-semibold text-neutral-700">Razón Social</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">RNC</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Contacto Principal</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Contacto Digital</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Dirección</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-neutral-400 py-12 text-sm">
                    No se encontraron proveedores registrados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProviders.map((p) => (
                  <TableRow key={p.id} className="hover:bg-neutral-50/50">
                    <TableCell className="font-semibold text-neutral-900 text-xs sm:text-sm">{p.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{p.rnc}</span>
                        {p.dgiiVerified && (
                          <span className="inline-flex items-center px-1 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded border border-emerald-200" title={`DGII Activo • Régimen: ${p.dgiiRegimen || 'Ordinario'}`}>
                            <Check className="w-2.5 h-2.5 text-emerald-600 mr-0.5" /> DGII
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{p.contactName || 'No especificado'}</TableCell>
                    <TableCell className="text-xs space-y-0.5">
                      <div className="font-semibold">{p.phone}</div>
                      <div className="text-neutral-500">{p.email}</div>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-600 max-w-[150px] truncate">{p.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600 hover:bg-indigo-50 rounded-md" onClick={() => setViewingProvider(p)} title="Ver detalle">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {canEdit && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 rounded-md" onClick={() => startEditProvider(p)}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-655 hover:bg-red-50 hover:text-red-700 rounded-md" onClick={() => deleteProvider(p.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* MODAL - CLIENT FORM (INSERT / UPDATE) */}
      <Dialog open={clientModalOpen} onOpenChange={setClientModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleSaveClient}>
            <DialogHeader>
              <DialogTitle className="text-base text-neutral-900 font-heading">{editingClient ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>
              <DialogDescription className="text-xs">Complete los datos de la persona física o empresa.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={clientType === 'Empresa' ? 'default' : 'outline'}
                  className={`text-xs h-9 justify-center ${clientType === 'Empresa' ? 'bg-black text-white hover:bg-black/95' : 'text-neutral-700 bg-white hover:bg-neutral-50'}`}
                  onClick={() => setClientType('Empresa')}
                >
                  <Building className="w-4 h-4 mr-1.5" />
                  Empresa / Jurídico
                </Button>
                <Button
                  type="button"
                  variant={clientType === 'Fisica' ? 'default' : 'outline'}
                  className={`text-xs h-9 justify-center ${clientType === 'Fisica' ? 'bg-black text-white hover:bg-black/95' : 'text-neutral-700 bg-white hover:bg-neutral-50'}`}
                  onClick={() => setClientType('Fisica')}
                >
                  <User className="w-4 h-4 mr-1.5" />
                  Persona Física
                </Button>
              </div>

              <div className="space-y-1 relative">
                <Label htmlFor="cli-name" className="text-xs">Nombre o Razón Social</Label>
                <div className="relative">
                  <Input 
                    id="cli-name" 
                    placeholder="Ej. Ferretería El Canal SRL o Pedro Martínez" 
                    value={clientName} 
                    onChange={(e) => handleClientNameChange(e.target.value)} 
                    onFocus={() => { if (clientName.length >= 3 && dgiiSuggestions.length > 0) setShowDgiiSuggestions(true); }}
                  />
                  {isSearchingDgii && !clientRnc && (
                    <span className="absolute right-2.5 top-2.5 animate-spin">
                      <Loader2 className="w-4 h-4 text-neutral-400" />
                    </span>
                  )}
                </div>

                {/* Autocomplete suggestions dropdown */}
                {showDgiiSuggestions && dgiiSuggestions.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDgiiSuggestions(false)} />
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-neutral-100 font-sans text-xs">
                      {dgiiSuggestions.map((s) => (
                        <div
                          key={s.id}
                          className="px-3 py-2 hover:bg-neutral-50 cursor-pointer flex justify-between items-center gap-2"
                          onClick={() => {
                            setClientName(s.nombre);
                            setClientRnc(s.id);
                            setShowDgiiSuggestions(false);
                            setDgiiValidation({
                              valid: true,
                              found_in_dgii: true,
                              data: s
                            });
                          }}
                        >
                          <div className="min-w-0 text-left">
                            <span className="font-bold text-neutral-900 block truncate">{s.nombre}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">RNC: {s.id} {s.regimen ? `• ${s.regimen}` : ''}</span>
                          </div>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded shrink-0 border border-emerald-200">DGII Clásico</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor="cli-rnc" className="text-xs">{clientType === 'Empresa' ? 'RNC Fiscal (9 dígitos)' : 'Cédula de Identidad (11 dígitos)'}</Label>
                  <button
                    type="button"
                    onClick={handleValidateRnc}
                    disabled={!clientRnc || isSearchingDgii}
                    className="text-[10px] text-emerald-700 hover:text-emerald-950 font-bold uppercase tracking-wider h-5 flex items-center bg-emerald-50 hover:bg-emerald-100 px-1.5 rounded border border-emerald-200 cursor-pointer disabled:opacity-50"
                  >
                    {isSearchingDgii && clientRnc ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Validando...
                      </>
                    ) : 'Consultar DGII'}
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    id="cli-rnc" 
                    placeholder={clientType === 'Empresa' ? 'Escriba un RNC de 9 dígitos sin guiones' : '402-XXXXXXX-X'} 
                    value={clientRnc} 
                    onChange={(e) => {
                      setClientRnc(e.target.value);
                      if (dgiiValidation) {
                        setDgiiValidation(null);
                      }
                      if (dgiiError) {
                        setDgiiError(null);
                      }
                    }} 
                  />
                  {dgiiValidation?.valid && dgiiValidation?.found_in_dgii && (
                    <span className="absolute right-2.5 top-2.5 text-emerald-600" title="Verificado DGII">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </span>
                  )}
                </div>

                {/* Validation Feedbacks */}
                {dgiiValidation?.valid && (
                  <div className="text-[10px] bg-emerald-50 border border-emerald-150 p-2 rounded-lg text-emerald-950 flex gap-1.5 mt-1 animate-fade-in font-sans text-left">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="font-bold text-[10.5px] block truncate">Padrón Contribuyente Validado:</span>
                      <span className="text-[9.5px] block text-emerald-800 font-semibold leading-none">Régimen: {dgiiValidation?.data?.regimen || 'Ordinario'}</span>
                      {dgiiValidation?.data?.provincia && (
                        <span className="text-[9px] text-emerald-600 block truncate">{dgiiValidation.data.provincia}, RD</span>
                      )}
                    </div>
                  </div>
                )}

                {dgiiError && (
                  <div className="text-[10px] bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-950 flex gap-1.5 mt-1 animate-fade-in font-sans text-left">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">{dgiiError}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="cli-phone" className="text-xs">Teléfono</Label>
                  <Input id="cli-phone" placeholder="809-555-0100" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cli-email" className="text-xs">Correo Electrónico</Label>
                  <Input id="cli-email" type="email" placeholder="cliente@correo.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="cli-address" className="text-xs">Dirección de Despacho</Label>
                <Input id="cli-address" placeholder="Av. Duarte, Santiago, República Dominicana" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setClientModalOpen(false)}>Cancelar</Button>
              <Button type="submit" size="sm" className="bg-black hover:bg-neutral-800 text-white">Guardar Cliente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL - PRODUCT / SERVICE FORM (INSERT / UPDATE) */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="sm:max-w-[800px] md:max-w-[850px]">
          <form onSubmit={handleSaveProduct}>
            <DialogHeader>
              <DialogTitle className="text-base text-neutral-900 font-heading">{editingProduct ? 'Editar Ítems / Servicio' : 'Agregar Ítem o Servicio'}</DialogTitle>
              <DialogDescription className="text-xs">Registre un nuevo código para facturar de manera unificada y asociarle stock.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 p-1">
              {/* LEFT COLUMN: BASIC & FINANCIAL DATA */}
              <div className="space-y-4">
                <div className="px-3 py-2 bg-neutral-50/50 rounded-lg font-bold text-[10px] text-neutral-400 uppercase tracking-wider">
                  Información Básica y Precios
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="prod-type" className="text-xs">Tipo de Ítem</Label>
                    <Select value={prodType} onValueChange={(val: any) => setProdType(val)}>
                      <SelectTrigger id="prod-type" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="p-code" className="text-xs">Código Corto / SKU / Código de Barras</Label>
                    <div className="flex gap-1.5">
                      <Input id="p-code" placeholder="Ej. VAR-12 o escanea" value={prodCode} onChange={(e) => setProdCode(e.target.value)} className="font-mono" />
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
                      <p className="text-[10px] text-blue-600 animate-pulse font-medium">Apunta la cámara al código de barras del producto...</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="p-name" className="text-xs font-semibold">Nombre o Descripción Comercial *</Label>
                  <Input id="p-name" placeholder="Ej. Funda de Cemento Gris Portland" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="p-cost" className="text-xs">Costo RD$</Label>
                    <Input id="p-cost" type="number" step="0.01" value={prodCost} onChange={(e) => setProdCost(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-price" className="text-xs font-semibold">Venta RD$ *</Label>
                    <Input id="p-price" type="number" step="0.01" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-tax" className="text-xs">Tasa ITBIS</Label>
                    <Select value={prodTax} onValueChange={(val) => setProdTax(val)}>
                      <SelectTrigger id="p-tax" className="h-9">
                        <SelectValue placeholder="Seleccione tasa">
                          {(val: string | null) => {
                            if (val === '18') return "18% ITBIS";
                            if (val === '16') return "16% ITBIS";
                            if (val === '8') return "8% ITBIS";
                            if (val === '0') return "0% (Exento)";
                            return val || "Seleccione tasa";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18">18% (Estándar)</SelectItem>
                        <SelectItem value="16">16% (Reducido)</SelectItem>
                        <SelectItem value="8">8% (Especial)</SelectItem>
                        <SelectItem value="0">0% (Exento)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1 mt-1">
                  <input 
                    type="checkbox" 
                    id="p-price-includes-tax" 
                    checked={prodPriceIncludesTax}
                    onChange={(e) => setProdPriceIncludesTax(e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 w-4 h-4"
                  />
                  <Label htmlFor="p-price-includes-tax" className="text-[11px] text-neutral-600 font-medium cursor-pointer">
                    El precio de venta digitado ya incluye el ITBIS (Recomendado)
                  </Label>
                </div>

                {/* LIVE PROFIT MARGIN WIDGET */}
                {prodType !== 'Servicio' && Number(prodCost) > 0 && Number(prodPrice) > 0 && (() => {
                  const cost = Number(prodCost);
                  const price = Number(prodPrice);
                  const profit = price - cost;
                  const margin = ((profit / price) * 100);
                  const markup = ((profit / cost) * 100);
                  const isGood = margin >= 30;
                  const isWarning = margin >= 10 && margin < 30;
                  return (
                    <div className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs ${isGood ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : isWarning ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
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

                {isKit && prodType === 'Producto' && (
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
                {/* Categoría / Departamento de Producto */}
                <div className="space-y-1.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-150">
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="p-category" className="text-xs font-bold text-neutral-800">Categoría / Departamento</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        setProdCategory('');
                      }}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-extrabold bg-transparent border-0 cursor-pointer"
                    >
                      {isCustomCategory ? "Seleccionar de la lista" : "+ Crear Nueva"}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <div className="space-y-1">
                      <Input
                        id="p-category-custom"
                        placeholder="Ej. Plomería, Electricidad..."
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="h-9 font-sans bg-white"
                        autoFocus
                      />
                      <span className="text-[9px] text-neutral-500 block leading-tight">Escriba un nuevo departamento. Se guardará de forma inteligente.</span>
                    </div>
                  ) : (
                    <Select value={prodCategory} onValueChange={(val) => setProdCategory(val)}>
                      <SelectTrigger id="p-category" className="h-9 bg-white">
                        <SelectValue placeholder="Seleccione un Departamento / Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(new Set([
                          'Tecnología', 'Ferretería', 'Servicios', 'Materiales de Oficina', 'Consumos Varios', 'Alimentos', 'Logística',
                          ...products.map(p => p.category).filter(Boolean)
                        ])).map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: DISTRIBUTION, PHOTO & LOGISTICS */}
              <div className="space-y-4">
                <div className="px-3 py-2 bg-neutral-50/50 rounded-lg font-bold text-[10px] text-neutral-400 uppercase tracking-wider">
                  Distribución, Proveedor y Catálogo
                </div>

                {prodType === 'Producto' && (
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
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="space-y-1">
                        <Label htmlFor="p-stock" className="text-xs font-semibold text-neutral-800">Cantidad en Existencia</Label>
                        <Input id="p-stock" type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="p-minstock" className="text-xs font-semibold text-neutral-800">Stock Límite Mínimo</Label>
                        <Input id="p-minstock" type="number" value={prodMinStock} onChange={(e) => setProdMinStock(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="p-warehouse" className="text-xs font-semibold text-neutral-800">Almacén (Ubicación de Stock)</Label>
                      <Select value={prodWarehouseId} onValueChange={(val) => setProdWarehouseId(val)}>
                        <SelectTrigger id="p-warehouse" className="h-9">
                          <SelectValue placeholder="Seleccione un Almacén">
                            {(val: string | null) => {
                              if (!val) return "Seleccione un Almacén";
                              return warehouses.find(w => w.id === val)?.name || val;
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map(wh => (
                            <SelectItem key={wh.id} value={wh.id}>
                              {wh.name} ({wh.code}){wh.isDefault ? ' ✓' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Proveedor + Quick Create */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="p-prov" className="text-xs font-semibold">Proveedor Suministrante</Label>
                    <button
                      type="button"
                      onClick={() => setShowQuickProvider(!showQuickProvider)}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-extrabold bg-transparent border-0 cursor-pointer"
                    >
                      {showQuickProvider ? 'Cancelar' : '+ Crear Proveedor'}
                    </button>
                  </div>
                  {showQuickProvider ? (
                    <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-150 rounded-xl">
                      <p className="text-[10px] font-bold text-blue-700">Nuevo Proveedor (Rápido)</p>
                      <Input placeholder="Nombre del proveedor *" value={quickProvName} onChange={e => setQuickProvName(e.target.value)} className="h-8 text-xs bg-white" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Teléfono (opcional)" value={quickProvPhone} onChange={e => setQuickProvPhone(e.target.value)} className="h-8 text-xs bg-white" />
                        <Input type="email" placeholder="Correo (opcional)" value={quickProvEmail} onChange={e => setQuickProvEmail(e.target.value)} className="h-8 text-xs bg-white" />
                      </div>
                      <button
                        type="button"
                        onClick={handleQuickCreateProvider}
                        disabled={!quickProvName.trim()}
                        className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg disabled:opacity-50 cursor-pointer transition-all"
                      >
                        Guardar y Seleccionar Proveedor
                      </button>
                    </div>
                  ) : (
                    <Select value={prodProviderId} onValueChange={(val) => setProdProviderId(val)}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Seleccione un proveedor (Opcional)">
                          {(val: string | null) => {
                            if (!val) return "Seleccione un proveedor (Opcional)";
                            if (val === 'none_selected') return <span className="text-neutral-500 italic">-- Sin proveedor --</span>;
                            return providers.find(p => p.id === val)?.name || val;
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none_selected">Ninguno</SelectItem>
                        {providers.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Foto del Producto - Upload desde PC/Dispositivo */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-neutral-800">Foto del Producto / Servicio</Label>
                  <input
                    ref={prodImageFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProdImageFileChange}
                  />
                  <div className="flex gap-2 items-start">
                    {/* Preview */}
                    <div
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-neutral-400 transition-all"
                      onClick={() => prodImageFileRef.current?.click()}
                    >
                      {prodImageUrl ? (
                        <img src={prodImageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-neutral-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => prodImageFileRef.current?.click()}
                        className="w-full h-9 flex items-center justify-center gap-2 border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        {prodImageFile ? 'Cambiar imagen' : 'Subir desde PC / Dispositivo'}
                      </button>
                      {prodImageUrl && !prodImageFile && (
                        <Input
                          placeholder="O pega una URL de imagen"
                          value={prodImageUrl}
                          onChange={e => setProdImageUrl(e.target.value)}
                          className="h-8 text-xs"
                        />
                      )}
                      {(prodImageUrl || prodImageFile) && (
                        <button
                          type="button"
                          onClick={() => { setProdImageUrl(''); setProdImageFile(null); }}
                          className="text-[10px] text-red-500 hover:text-red-700 font-semibold cursor-pointer bg-transparent border-0"
                        >
                          Quitar imagen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 pt-3 border-t border-neutral-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setProductModalOpen(false)}>Cancelar</Button>
              <Button type="submit" size="sm" disabled={isUploadingImage} className="bg-black hover:bg-neutral-800 text-white font-bold">
                {isUploadingImage ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Subiendo imagen...</> : 'Guardar Ítem o Servicio'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL - SUPPLIER FORM (INSERT / UPDATE) */}
      <Dialog open={providerModalOpen} onOpenChange={setProviderModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleSaveProvider}>
            <DialogHeader>
              <DialogTitle className="text-base text-neutral-900 font-heading">{editingProvider ? 'Editar Proveedor' : 'Agregar Proveedor'}</DialogTitle>
              <DialogDescription className="text-xs">Complete los datos legales del proveedor encargado del reabastecimiento.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="space-y-1 relative">
                <Label htmlFor="prov-name" className="text-xs">Razón Social del Proveedor *</Label>
                <div className="relative">
                  <Input 
                    id="prov-name" 
                    placeholder="Ej. Dominicana de Cementos Industrial SAS" 
                    value={provName} 
                    onChange={(e) => handleProvNameChange(e.target.value)} 
                    onFocus={() => { if (provName.length >= 3 && provDgiiSuggestions.length > 0) setShowProvDgiiSuggestions(true); }}
                    required 
                  />
                  {isSearchingProvDgii && !provRnc && (
                    <span className="absolute right-2.5 top-2.5 animate-spin">
                      <Loader2 className="w-4 h-4 text-neutral-400" />
                    </span>
                  )}
                </div>

                {/* Autocomplete suggestions dropdown */}
                {showProvDgiiSuggestions && provDgiiSuggestions.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProvDgiiSuggestions(false)} />
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-40 overflow-y-auto z-50 divide-y divide-neutral-100 font-sans text-xs">
                      {provDgiiSuggestions.map((s) => (
                        <div
                          key={s.id}
                          className="px-3 py-2 hover:bg-neutral-50 cursor-pointer flex justify-between items-center gap-2"
                          onClick={() => {
                            setProvName(s.nombre);
                            setProvRnc(s.id);
                            setShowProvDgiiSuggestions(false);
                            setProvDgiiValidation({
                              valid: true,
                              found_in_dgii: true,
                              data: s
                            });
                          }}
                        >
                          <div className="min-w-0 text-left">
                            <span className="font-bold text-neutral-900 block truncate">{s.nombre}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">RNC: {s.id} {s.regimen ? `• ${s.regimen}` : ''}</span>
                          </div>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded shrink-0 border border-emerald-200">DGII Clásico</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="prov-rnc" className="text-xs">RNC (9 dígitos) <span className="text-neutral-400 font-normal">(Opcional)</span></Label>
                    <button
                      type="button"
                      onClick={handleValidateProvRnc}
                      disabled={!provRnc || isSearchingProvDgii}
                      className="text-[9px] text-emerald-700 hover:text-emerald-950 font-extrabold uppercase h-4 flex items-center bg-emerald-50 hover:bg-emerald-100 px-1 rounded border border-emerald-200 cursor-pointer disabled:opacity-50 animate-pulse-subtle"
                    >
                      {isSearchingProvDgii && provRnc ? '...' : 'Buscar'}
                    </button>
                  </div>
                  <div className="relative">
                    <Input 
                      id="prov-rnc" 
                      placeholder="101112233 (opcional)" 
                      value={provRnc} 
                      onChange={(e) => {
                        setProvRnc(e.target.value);
                        if (provDgiiValidation) setProvDgiiValidation(null);
                        if (provDgiiError) setProvDgiiError(null);
                      }} 
                    />
                    {provDgiiValidation?.valid && provDgiiValidation?.found_in_dgii && (
                      <span className="absolute right-2 top-2 text-emerald-600" title="Verificado DGII">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prov-contact" className="text-xs">Contacto Principal</Label>
                  <Input id="prov-contact" placeholder="Ing. Carlos Pérez" value={provContact} onChange={(e) => setProvContact(e.target.value)} />
                </div>
              </div>

              {/* Validation Feedbacks */}
              {provDgiiValidation?.valid && (
                <div className="text-[10px] bg-emerald-50 border border-emerald-150 p-2 rounded-lg text-emerald-950 flex gap-1.5 animate-fade-in font-sans text-left">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="font-bold text-[10.5px] block truncate">Proveedor Validado DGII:</span>
                    <span className="text-[9.5px] block text-emerald-800 font-semibold leading-none font-sans">Régimen: {provDgiiValidation?.data?.regimen || 'Ordinario'}</span>
                    {provDgiiValidation?.data?.provincia && (
                      <span className="text-[9px] text-emerald-600 block truncate font-sans">{provDgiiValidation.data.provincia}, RD</span>
                    )}
                  </div>
                </div>
              )}

              {provDgiiError && (
                <div className="text-[10px] bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-950 flex gap-1.5 animate-fade-in font-sans text-left">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{provDgiiError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="prov-phone" className="text-xs">Teléfono Oficina</Label>
                  <Input id="prov-phone" placeholder="809-540-1234" value={provPhone} onChange={(e) => setProvPhone(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prov-email" className="text-xs">Correo Soporte</Label>
                  <Input id="prov-email" type="email" placeholder="ventas@proveedor.com.do" value={provEmail} onChange={(e) => setProvEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="prov-address" className="text-xs">Ubicación Física</Label>
                <Input id="prov-address" placeholder="Zona Industrial Herrera, Santo Domingo Oeste" value={provAddress} onChange={(e) => setProvAddress(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setProviderModalOpen(false)}>Cancelar</Button>
              <Button type="submit" size="sm" className="bg-black hover:bg-neutral-800 text-white">Guardar Proveedor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============== VIEW CLIENT DETAIL MODAL ============== */}
      <Dialog open={!!viewingClient} onOpenChange={() => setViewingClient(null)}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
          {viewingClient && (
            <>
              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-6 pt-6 pb-5 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      {viewingClient.type === 'Empresa' ? <Building className="w-5 h-5 text-white/90" /> : <User className="w-5 h-5 text-white/90" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight">{viewingClient.name}</h3>
                      <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold leading-none ${viewingClient.type === 'Empresa' ? 'bg-white/20 text-white' : 'bg-white/15 text-white/90'}`}>
                        {viewingClient.type === 'Empresa' ? 'Empresa / Jurídico' : 'Persona Física'}
                      </span>
                    </div>
                  </div>
                  {viewingClient.dgiiVerified && (
                    <span className="inline-flex items-center px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold rounded-lg border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 mr-1" /> DGII Verificado
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {/* ID Fiscal */}
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Hash className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">RNC / Cédula</span>
                    <span className="text-sm font-mono font-bold text-neutral-900">{viewingClient.rncOrCedula || '—'}</span>
                  </div>
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Teléfono</span>
                      <span className="text-xs font-semibold text-neutral-800">{viewingClient.phone || '—'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Correo</span>
                      <span className="text-xs font-semibold text-neutral-800 break-all">{viewingClient.email || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Dirección</span>
                    <span className="text-xs text-neutral-800">{viewingClient.address || '—'}</span>
                  </div>
                </div>

                {/* DGII Details */}
                {viewingClient.dgiiVerified && (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] uppercase text-emerald-700 font-bold">Información DGII</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {viewingClient.dgiiEstatus && (
                        <div><span className="text-neutral-400 text-[10px] block">Estatus</span><span className="font-semibold text-neutral-800">{viewingClient.dgiiEstatus}</span></div>
                      )}
                      {viewingClient.dgiiRegimen && (
                        <div><span className="text-neutral-400 text-[10px] block">Régimen</span><span className="font-semibold text-neutral-800">{viewingClient.dgiiRegimen}</span></div>
                      )}
                      {viewingClient.dgiiCategoria && (
                        <div><span className="text-neutral-400 text-[10px] block">Categoría</span><span className="font-semibold text-neutral-800">{viewingClient.dgiiCategoria}</span></div>
                      )}
                      {viewingClient.dgiiActividad && (
                        <div><span className="text-neutral-400 text-[10px] block">Actividad Económica</span><span className="font-semibold text-neutral-800">{viewingClient.dgiiActividad}</span></div>
                      )}
                      {viewingClient.dgiiProvincia && (
                        <div><span className="text-neutral-400 text-[10px] block">Provincia</span><span className="font-semibold text-neutral-800">{viewingClient.dgiiProvincia}</span></div>
                      )}
                      {viewingClient.dgiiMunicipio && (
                        <div><span className="text-neutral-400 text-[10px] block">Municipio</span><span className="font-semibold text-neutral-800">{viewingClient.dgiiMunicipio}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Created at */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                  <Calendar className="w-3 h-3" />
                  Registrado el {new Date(viewingClient.createdAt).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 flex gap-2">
                {canEdit && (
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { startEditClient(viewingClient); setViewingClient(null); }}>
                    <Edit className="w-3.5 h-3.5 mr-1.5" /> Editar
                  </Button>
                )}
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setViewingClient(null)}>
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ============== VIEW PRODUCT DETAIL MODAL ============== */}
      <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
          {viewingProduct && (() => {
            const prov = providers.find(pr => pr.id === viewingProduct.providerId);
            const wh = warehouses.find(w => w.id === viewingProduct.warehouseId);
            const isLow = viewingProduct.type === 'Producto' && viewingProduct.stock <= viewingProduct.minStock;
            const margin = viewingProduct.cost > 0 ? (((viewingProduct.price - viewingProduct.cost) / viewingProduct.cost) * 100).toFixed(1) : null;
            return (
              <>
                {/* Header */}
                <div className={`px-6 pt-6 pb-5 text-white ${viewingProduct.type === 'Producto' ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900' : 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      {viewingProduct.imageUrl ? (
                        <img src={viewingProduct.imageUrl} alt={viewingProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Package className="w-6 h-6 text-white/80" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base leading-tight">{viewingProduct.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-mono text-white/70 text-xs">{viewingProduct.code}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold leading-none ${viewingProduct.type === 'Producto' ? 'bg-blue-400/20 text-blue-200' : 'bg-purple-400/20 text-purple-200'}`}>
                          {viewingProduct.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                  {/* Pricing row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Costo</span>
                      <span className="text-sm font-bold font-mono text-neutral-700">
                        {viewingProduct.cost > 0 ? viewingProduct.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }) : '—'}
                      </span>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                      <span className="text-[10px] uppercase text-indigo-500 font-semibold block">Precio Venta</span>
                      <span className="text-sm font-bold font-mono text-indigo-900">
                        {viewingProduct.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold block">ITBIS</span>
                      <span className="text-sm font-bold font-mono text-neutral-700">{viewingProduct.taxRate}%</span>
                    </div>
                  </div>

                  {/* Margin */}
                  {margin && (
                    <div className="flex items-center gap-2.5 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase text-emerald-600 font-semibold block">Margen de Ganancia</span>
                        <span className="text-sm font-bold text-emerald-800">{margin}%</span>
                      </div>
                    </div>
                  )}

                  {/* Stock (only for products) */}
                  {viewingProduct.type === 'Producto' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${isLow ? 'bg-amber-50 border-amber-200' : 'bg-neutral-50 border-neutral-100'}`}>
                        <Layers className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Stock Actual</span>
                          <span className={`text-sm font-bold font-mono ${isLow ? 'text-amber-700' : 'text-neutral-900'}`}>
                            {viewingProduct.stock} {isLow && <AlertTriangle className="inline w-3 h-3 text-amber-500 ml-1" />}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <Layers className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Stock Mínimo</span>
                          <span className="text-sm font-bold font-mono text-neutral-900">{viewingProduct.minStock}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category, Provider, Warehouse */}
                  <div className="space-y-2.5">
                    {viewingProduct.category && (
                      <div className="flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <Tag className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Categoría</span>
                          <span className="text-xs font-semibold text-neutral-800">{viewingProduct.category}</span>
                        </div>
                      </div>
                    )}
                    {prov && (
                      <div className="flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <Building className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Proveedor</span>
                          <span className="text-xs font-semibold text-neutral-800">{prov.name}</span>
                        </div>
                      </div>
                    )}
                    {wh && (
                      <div className="flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <WarehouseIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Almacén</span>
                          <span className="text-xs font-semibold text-neutral-800">{wh.name}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Created at */}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                    <Calendar className="w-3 h-3" />
                    Registrado el {new Date(viewingProduct.createdAt).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex gap-2">
                  {canEdit && (
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { startEditProduct(viewingProduct); setViewingProduct(null); }}>
                      <Edit className="w-3.5 h-3.5 mr-1.5" /> Editar
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setViewingProduct(null)}>
                    Cerrar
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ============== VIEW PROVIDER DETAIL MODAL ============== */}
      <Dialog open={!!viewingProvider} onOpenChange={() => setViewingProvider(null)}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
          {viewingProvider && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-800 px-6 pt-6 pb-5 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Building className="w-5 h-5 text-white/90" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight">{viewingProvider.name}</h3>
                      <span className="text-white/60 text-xs mt-0.5 block">Proveedor / Distribuidor</span>
                    </div>
                  </div>
                  {viewingProvider.dgiiVerified && (
                    <span className="inline-flex items-center px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold rounded-lg border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 mr-1" /> DGII
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {/* RNC */}
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Hash className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">RNC</span>
                    <span className="text-sm font-mono font-bold text-neutral-900">{viewingProvider.rnc || '—'}</span>
                  </div>
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <UserCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Contacto</span>
                      <span className="text-xs font-semibold text-neutral-800">{viewingProvider.contactName || '—'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Teléfono</span>
                      <span className="text-xs font-semibold text-neutral-800">{viewingProvider.phone || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Correo</span>
                    <span className="text-xs font-semibold text-neutral-800 break-all">{viewingProvider.email || '—'}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Dirección</span>
                    <span className="text-xs text-neutral-800">{viewingProvider.address || '—'}</span>
                  </div>
                </div>

                {/* DGII Details */}
                {viewingProvider.dgiiVerified && (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] uppercase text-emerald-700 font-bold">Información DGII</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {viewingProvider.dgiiEstatus && (
                        <div><span className="text-neutral-400 text-[10px] block">Estatus</span><span className="font-semibold text-neutral-800">{viewingProvider.dgiiEstatus}</span></div>
                      )}
                      {viewingProvider.dgiiRegimen && (
                        <div><span className="text-neutral-400 text-[10px] block">Régimen</span><span className="font-semibold text-neutral-800">{viewingProvider.dgiiRegimen}</span></div>
                      )}
                      {viewingProvider.dgiiCategoria && (
                        <div><span className="text-neutral-400 text-[10px] block">Categoría</span><span className="font-semibold text-neutral-800">{viewingProvider.dgiiCategoria}</span></div>
                      )}
                      {viewingProvider.dgiiActividad && (
                        <div><span className="text-neutral-400 text-[10px] block">Actividad Económica</span><span className="font-semibold text-neutral-800">{viewingProvider.dgiiActividad}</span></div>
                      )}
                      {viewingProvider.dgiiProvincia && (
                        <div><span className="text-neutral-400 text-[10px] block">Provincia</span><span className="font-semibold text-neutral-800">{viewingProvider.dgiiProvincia}</span></div>
                      )}
                      {viewingProvider.dgiiMunicipio && (
                        <div><span className="text-neutral-400 text-[10px] block">Municipio</span><span className="font-semibold text-neutral-800">{viewingProvider.dgiiMunicipio}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Created at */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                  <Calendar className="w-3 h-3" />
                  Registrado el {new Date(viewingProvider.createdAt).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 flex gap-2">
                {canEdit && (
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { startEditProvider(viewingProvider); setViewingProvider(null); }}>
                    <Edit className="w-3.5 h-3.5 mr-1.5" /> Editar
                  </Button>
                )}
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setViewingProvider(null)}>
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
