import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { insforge } from './lib/insforge';
import { LogoFacturaDo, OldLogoFacturaDo } from './components/LogoFacturaDo';
import { useInvoiceState } from './hooks/useInvoiceState';
// Componentes comunes
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import AIAssistantWidget from './components/AIAssistantWidget';
// Vistas Lazy Load
const LandingAndAuth = React.lazy(() => import('./components/LandingAndAuth'));
const OnboardingWizard = React.lazy(() => import('./components/OnboardingWizard'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
const InvoiceCreator = React.lazy(() => import('./components/InvoiceCreator'));
const InvoiceList = React.lazy(() => import('./components/InvoiceList'));
const Directories = React.lazy(() => import('./components/Directories'));
const DgiiReports = React.lazy(() => import('./components/DgiiReports'));
const InventoryManager = React.lazy(() => import('./components/InventoryManager'));
const TemplateSettingsPanel = React.lazy(() => import('./components/TemplateSettingsPanel'));
const AppearanceSettingsView = React.lazy(() => import('./components/AppearanceSettingsView'));
const ShiftsView = React.lazy(() => import('./components/ShiftsView'));
const UserPermissions = React.lazy(() => import('./components/UserPermissions'));
const SupportSection = React.lazy(() => import('./components/SupportSection'));
const ReceiptsList = React.lazy(() => import('./components/ReceiptsList'));
const POSView = React.lazy(() => import('./components/POSView'));
const WarehousesView = React.lazy(() => import('./components/WarehousesView'));
const FinancialAccountsView = React.lazy(() => import('./components/FinancialAccountsView'));
const PurchaseOrdersView = React.lazy(() => import('./components/PurchaseOrdersView'));
const DocumentDetailsView = React.lazy(() => import('./components/DocumentDetailsView'));
const DocumentEditView = React.lazy(() => import('./components/DocumentEditView'));
const BusinessStateView = React.lazy(() => import('./components/BusinessStateView'));

// Named exports to Lazy
const InsForgeServicesView = React.lazy(() => import('./components/InsForgeServicesView').then(m => ({ default: m.InsForgeServicesView })));
const ExpensesView = React.lazy(() => import('./components/ExpensesView').then(m => ({ default: m.ExpensesView })));
const VendedoresView = React.lazy(() => import('./components/VendedoresView').then(m => ({ default: m.VendedoresView })));
const AuditLogsView = React.lazy(() => import('./components/AuditLogsView').then(m => ({ default: m.AuditLogsView })));
const SecuritySettingsView = React.lazy(() => import('./components/SecuritySettingsView').then(m => ({ default: m.SecuritySettingsView })));

const Specialized = import('./components/SpecializedViews');
const ClientHistoryView = React.lazy(() => Specialized.then(m => ({ default: m.ClientHistoryView })));
const ClientAccountStatementView = React.lazy(() => Specialized.then(m => ({ default: m.ClientAccountStatementView })));
const ProductCategoriesView = React.lazy(() => Specialized.then(m => ({ default: m.ProductCategoriesView })));
const InventoryAdjustmentsView = React.lazy(() => Specialized.then(m => ({ default: m.InventoryAdjustmentsView })));
const FinancialCajaView = React.lazy(() => Specialized.then(m => ({ default: m.FinancialCajaView })));
const FinancialBancosView = React.lazy(() => Specialized.then(m => ({ default: m.FinancialBancosView })));
const AccountsReceivableView = React.lazy(() => Specialized.then(m => ({ default: m.AccountsReceivableView })));
const AccountsPayableView = React.lazy(() => Specialized.then(m => ({ default: m.AccountsPayableView })));
const CreditNotesView = React.lazy(() => Specialized.then(m => ({ default: m.CreditNotesView })));
const ConfigLogoView = React.lazy(() => Specialized.then(m => ({ default: m.ConfigLogoView })));
const ConfigImpuestosView = React.lazy(() => Specialized.then(m => ({ default: m.ConfigImpuestosView })));
const ReportVentasView = React.lazy(() => Specialized.then(m => ({ default: m.ReportVentasView })));
const ReportGastosView = React.lazy(() => Specialized.then(m => ({ default: m.ReportGastosView })));
const ReportUtilidadesView = React.lazy(() => Specialized.then(m => ({ default: m.ReportUtilidadesView })));
const ReportInventoryView = React.lazy(() => Specialized.then(m => ({ default: m.ReportInventoryView })));
const ReportClientsView = React.lazy(() => Specialized.then(m => ({ default: m.ReportClientsView })));
const ReportExcelView = React.lazy(() => Specialized.then(m => ({ default: m.ReportExcelView })));
const ConfigUsuariosView = React.lazy(() => Specialized.then(m => ({ default: m.ConfigUsuariosView })));
const ConfigRolesView = React.lazy(() => Specialized.then(m => ({ default: m.ConfigRolesView })));


import {
  LayoutDashboard,
  FileSpreadsheet,
  FilePlus,
  History,
  FolderOpen,
  Warehouse,
  Settings,
  Users,
  Compass,
  Building,
  Menu,
  Shield,
  Loader2,
  Lock,
  Receipt as ReceiptIcon,
  ClipboardList,
  Package,
  Plus,
  Store,
  ShoppingCart,
  Landmark,
  Camera,
  Upload,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ChevronRight,
  Search,
  FileText,
  AlertTriangle,
  TrendingDown,
  Image,
  Percent,
  Bell,
  Info,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Palette,
  Briefcase,
  Eye,
  EyeOff,
} from 'lucide-react';

type TabType =
  | 'dashboard'
  | 'clientes'
  | 'productos'
  | 'facturas'
  | 'cotizaciones'
  | 'recibos'
  | 'inventario'
  | 'reportes'
  | 'configuracion'
  | 'create'
  | 'users'
  | 'support'
  | 'pos'
  | 'vendedores'
  | 'turnos'
  | 'purchase-orders'
  | 'warehouses'
  | 'financial-accounts'
  | 'view-document'
  | 'edit-document'
  | 'suplidores'
  | 'gastos'
  | 'analiticas'
  | 'compras-hist'
  | 'estado-cuenta'
  | 'categorias'
  | 'inventario-ajustes'
  | 'caja'
  | 'bancos'
  | 'cobrar'
  | 'pagar'
  | 'notas-credito'
  | 'rep-ventas'
  | 'rep-gastos'
  | 'rep-utilidades'
  | 'rep-inv'
  | 'rep-cli'
  | 'rep-dgii'
  | 'rep-606'
  | 'rep-607'
  | 'rep-608'
  | 'rep-609'
  | 'rep-excel'
  | 'cfg-datos'
  | 'cfg-apariencia'
  | 'cfg-impuestos'
  | 'cfg-usuarios'
  | 'cfg-roles'
  | 'cfg-audit'
  | 'cfg-seguridad'
  | 'cfg-soporte'
  | 'estado-negocio';

const sidebarCategories = [
  {
    title: "Facturación",
    icon: FilePlus,
    items: [
      { id: 'pos', name: 'Punto de Venta (POS)', icon: Store },
      { id: 'facturas', name: 'Facturas', icon: FilePlus, params: 'facturas_all' },
      { id: 'vendedores', name: 'Vendedores', icon: Briefcase },
      { id: 'cotizaciones', name: 'Cotizaciones', icon: ClipboardList, params: 'cotizaciones_all' },
      { id: 'notas-credito', name: 'Notas de crédito', icon: AlertTriangle },
      { id: 'recibos', name: 'Recibos', icon: ReceiptIcon },
    ]
  },
  {
    title: "Clientes",
    icon: Users,
    items: [
      { id: 'clientes', name: 'Lista de clientes', icon: Users },
      { id: 'compras-hist', name: 'Historial de compras', icon: History },
      { id: 'estado-cuenta', name: 'Estado de cuenta', icon: Landmark },
    ]
  },
  {
    title: "Productos",
    icon: Package,
    items: [
      { id: 'productos', name: 'Productos', icon: Package },
      { id: 'categorias', name: 'Categorías', icon: FolderOpen },
      { id: 'inventario', name: 'Inventario', icon: Warehouse },
      { id: 'inventario-ajustes', name: 'Ajustes de stock', icon: Warehouse },
    ]
  },
  {
    title: "Compras",
    icon: ShoppingCart,
    items: [
      { id: 'suplidores', name: 'Suplidores', icon: Users },
      { id: 'purchase-orders', name: 'Órdenes de compra', icon: ShoppingCart },
      { id: 'gastos', name: 'Gastos', icon: TrendingDown },
    ]
  },
  {
    title: "Finanzas",
    icon: Landmark,
    items: [
      { id: 'caja', name: 'Caja', icon: Landmark },
      { id: 'turnos', name: 'Turnos', icon: Landmark },
      { id: 'bancos', name: 'Bancos', icon: Landmark },
      { id: 'cobrar', name: 'Cuentas por cobrar', icon: ReceiptIcon },
      { id: 'pagar', name: 'Cuentas por pagar', icon: Landmark },
    ]
  },
  {
    title: "Reportes",
    icon: FileSpreadsheet,
    items: [
      { id: 'rep-ventas', name: 'Ventas', icon: FileSpreadsheet },
      { id: 'rep-gastos', name: 'Gastos', icon: TrendingDown },
      { id: 'rep-utilidades', name: 'Utilidades', icon: Landmark },
      { id: 'rep-inv', name: 'Inventario', icon: Warehouse },
      { id: 'rep-cli', name: 'Clientes', icon: Users },
      { id: 'rep-dgii', name: 'DGII', icon: FileSpreadsheet },
      { id: 'rep-606', name: 'Reporte 606', icon: FileSpreadsheet },
      { id: 'rep-607', name: 'Reporte 607', icon: FileSpreadsheet },
      { id: 'rep-608', name: 'Reporte 608', icon: FileSpreadsheet },
      { id: 'rep-609', name: 'Reporte 609', icon: FileSpreadsheet },
      { id: 'rep-excel', name: 'Exportar Excel', icon: FileSpreadsheet },
    ]
  },
  {
    title: "Configuración",
    icon: Settings,
    items: [
      { id: 'cfg-datos', name: 'Datos de empresa', icon: Building },
      { id: 'cfg-apariencia', name: 'Apariencia y Plantillas', icon: Palette },
      { id: 'cfg-impuestos', name: 'Impuestos', icon: Percent },
      { id: 'cfg-usuarios', name: 'Usuarios y Roles', icon: Users },
      { id: 'cfg-seguridad', name: 'Mi Cuenta y Seguridad', icon: Shield },
      { id: 'cfg-audit', name: 'Historial de Auditoría', icon: History },
      { id: 'cfg-soporte', name: 'Soporte Técnico', icon: Compass },
    ]
  }
];

export default function App() {
  const {
    loaded,
    needsOnboarding,
    setNeedsOnboarding,
    purgePostgresData,
    loadAllDataFromPostgres,
    auditLogs,
    clients,
    products,
    providers,
    invoices,
    receipts,
    ncfSequences,
    templateSettings,
    users,
    tickets,
    currentUser,
    globalSearch,
    setGlobalSearch,
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
    createInvoiceOrQuote,
    updateInvoice,
    deleteInvoice,
    convertQuoteToInvoice,
    payInvoice,
    saveTemplateSettings,
    updateNcfSequences,
    addUser,
    updateUserRole,
    deleteUser,
    handleActiveUserChange,
    handleLoginSuccessUser,
    addTicket,
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    warehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    financialAccounts,
    addFinancialAccount,
    updateFinancialAccount,
    deleteFinancialAccount,
    purchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    updateUserAvatar,
    shifts,
    activeShift,
    addShift,
    updateShift,
    sellers,
    addSeller,
    updateSeller,
    deleteSeller,
    logActivity,
  } = useInvoiceState();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  React.useEffect(() => {
    // Inicializar estado desde la sesión de InsForge
    insforge.auth.getCurrentUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      setAuthChecking(false);
    });
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  // Determine current tab from browser path
  const currentTab = (() => {
    const rawPath = location.pathname.substring(1);
    if (!rawPath || rawPath === 'login' || rawPath === 'register' || rawPath === 'onboarding') return 'dashboard';
    const mainTab = rawPath.split('/')[0];
    return mainTab as TabType;
  })();

  const setCurrentTab = (newTab: TabType) => {
    navigate('/' + newTab);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileCreateOpen, setMobileCreateOpen] = useState(false);
  const [inventorySubTab, setInventorySubTab] = useState<'stock' | 'warehouses'>('stock');

  // Sidebar collapsible dropdown folders state
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (title: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Header Search & Actions states
  const [headerSearch, setHeaderSearch] = useState('');
  const [headerResults, setHeaderResults] = useState<any[]>([]);
  const [headerCreateOpen, setHeaderCreateOpen] = useState(false);

  interface AppNotification {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: 'warning' | 'danger' | 'success' | 'info';
  }

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Smart auto-notifications: low stock, overdue invoices, NCF limits
  React.useEffect(() => {
    if (!loaded) return;
    const autoAlerts: AppNotification[] = [];
    const now = new Date();

    // Low-stock products
    products.forEach(p => {
      const minStock = p.minStock ?? 5;
      if (p.stock !== undefined && p.stock <= minStock && p.stock >= 0) {
        autoAlerts.push({
          id: `low-stock-${p.id}`,
          title: `Stock bajo: ${p.name}`,
          description: `Solo quedan ${p.stock} unidades (mínimo: ${minStock}).`,
          time: 'Ahora',
          read: false,
          type: 'warning'
        });
      }
    });

    // Overdue invoices
    invoices.forEach(inv => {
      if (inv.status === 'Pendiente' && inv.dueDate) {
        const due = new Date(inv.dueDate);
        if (due < now) {
          autoAlerts.push({
            id: `overdue-${inv.id}`,
            title: `Factura vencida: ${inv.invoiceNumber}`,
            description: `${inv.client?.name || 'Cliente'} — RD$ ${inv.total?.toLocaleString()}`,
            time: inv.dueDate,
            read: false,
            type: 'danger'
          });
        }
      }
    });

    // NCF sequences nearing limit (>= 90% used)
    ncfSequences.forEach(seq => {
      if (seq.endNumber && seq.currentNumber) {
        const range = seq.endNumber - (seq.startNumber || 1);
        const used = seq.currentNumber - (seq.startNumber || 1);
        if (range > 0 && (used / range) >= 0.9) {
          autoAlerts.push({
            id: `ncf-limit-${seq.type}`,
            title: `NCF ${seq.type} casi agotado`,
            description: `Usado ${used}/${range} secuencias. Solicite nuevo rango a la DGII.`,
            time: 'Ahora',
            read: false,
            type: 'danger'
          });
        }
      }
    });

    if (autoAlerts.length > 0) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newAlerts = autoAlerts.filter(a => !existingIds.has(a.id));
        return newAlerts.length > 0 ? [...newAlerts, ...prev] : prev;
      });
    }
  }, [loaded, products, invoices, ncfSequences]);

  const handleHeaderSearch = (val: string) => {
    setHeaderSearch(val);
    if (!val.trim()) {
      setHeaderResults([]);
      return;
    }

    const query = val.toLowerCase();
    const results: any[] = [];

    clients.forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.rncOrCedula.includes(query)) {
        results.push({
          type: 'Clientes',
          title: c.name,
          subtitle: `Identificación: ${c.rncOrCedula}`,
          action: () => {
            setGlobalSearch(c.name);
            setCurrentTab('clientes');
          },
        });
      }
    });

    invoices.forEach(inv => {
      if (inv.invoiceNumber.toLowerCase().includes(query) || inv.ncf.toLowerCase().includes(query) || inv.client.name.toLowerCase().includes(query)) {
        results.push({
          type: inv.type === 'Cotizacion' ? 'Cotizaciones' : 'Facturas',
          title: `${inv.invoiceNumber} - ${inv.client.name}`,
          subtitle: `NCF: ${inv.ncf} | RD$${inv.total.toLocaleString()}`,
          action: () => {
            setGlobalSearch(inv.invoiceNumber);
            setCurrentTab(inv.type === 'Cotizacion' ? 'cotizaciones' : 'facturas');
          },
        });
      }
    });

    products.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)) {
        results.push({
          type: 'Inventario',
          title: p.name,
          subtitle: `SKU: ${p.code} | RD$${p.price.toLocaleString()}`,
          action: () => {
            setGlobalSearch(p.code);
            setCurrentTab('productos');
          },
        });
      }
    });

    setHeaderResults(results.slice(0, 5));
  };

  // Navigation exit guard & draft interception states
  const [pendingTabDestination, setPendingTabDestination] = useState<TabType | null>(null);
  const [showDraftExitDialog, setShowDraftExitDialog] = useState(false);

  // Profile sidebar triggers
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [customAvatarUrlInput, setCustomAvatarUrlInput] = useState(currentUser?.avatarUrl || '');
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>({});

  // Image Cropper states
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropImageIsLandscape, setCropImageIsLandscape] = useState(true);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX - cropPan.x;
    const startY = e.clientY - cropPan.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setCropPan({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const startX = touch.clientX - cropPan.x;
    const startY = touch.clientY - cropPan.y;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      setCropPan({
        x: moveTouch.clientX - startX,
        y: moveTouch.clientY - startY
      });
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const performCropAndSave = () => {
    if (!cropImageSrc || !currentUser) return;
    setAvatarUploading(true);
    
    const img = new window.Image();
    img.src = cropImageSrc;
    img.onload = async () => {
      const R = 80;
      const cropSize = R * 2;
      
      let baseWidth = cropSize;
      let baseHeight = cropSize;
      if (img.naturalWidth > img.naturalHeight) {
        baseHeight = cropSize;
        baseWidth = cropSize * (img.naturalWidth / img.naturalHeight);
      } else {
        baseWidth = cropSize;
        baseHeight = cropSize * (img.naturalHeight / img.naturalWidth);
      }
      
      const renderedWidth = baseWidth * cropZoom;
      const renderedHeight = baseHeight * cropZoom;
      
      const W = 256;
      const H = 256;
      const cx = W / 2;
      const cy = H / 2;
      const cropX = cx - R;
      const cropY = cy - R;
      
      const imgX = cx + cropPan.x - renderedWidth / 2;
      const imgY = cy + cropPan.y - renderedHeight / 2;
      
      const dx = cropX - imgX;
      const dy = cropY - imgY;
      
      const scaleX = renderedWidth / img.naturalWidth;
      const scaleY = renderedHeight / img.naturalHeight;
      
      const sourceX = dx / scaleX;
      const sourceY = dy / scaleY;
      const sourceWidth = cropSize / scaleX;
      const sourceHeight = cropSize / scaleY;
      
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          320,
          320
        );
      }
      
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      try {
        const response = await fetch(croppedDataUrl);
        const blob = await response.blob();
        
        const uniqueKey = `${Date.now()}_cropped_profile.jpg`;
        const bucket = insforge.storage.from("profile_pictures");
        const { error } = await bucket.upload(uniqueKey, new File([blob], uniqueKey, { type: 'image/jpeg' }));
        
        if (error) {
          throw error;
        }
        
        const url = bucket.getPublicUrl(uniqueKey);
        setCustomAvatarUrlInput(url);
        updateUserAvatar(currentUser.id, url);
        setBrokenAvatars((prev: any) => ({ ...prev, [url]: false }));
      } catch (err) {
        console.warn("Storage upload failed, fallback to local Data URL:", err);
        setCustomAvatarUrlInput(croppedDataUrl);
        updateUserAvatar(currentUser.id, croppedDataUrl);
        setBrokenAvatars((prev: any) => ({ ...prev, [croppedDataUrl]: false }));
      } finally {
        setAvatarUploading(false);
        setCropImageSrc(null);
        setShowAvatarModal(false);
      }
    };
    
    img.onerror = () => {
      alert("Error al procesar la imagen para el recorte.");
      setAvatarUploading(false);
    };
  };

  // Lock screen & Idle states
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const lastActivityRef = React.useRef<number>(Date.now());

  // Lock Screen Inactivity Check
  React.useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      setIsScreenLocked(false);
      return;
    }

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
    };

    // Listen to user events
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    // Check inactivity every 5 seconds
    const interval = setInterval(() => {
      if (isScreenLocked) return;

      const autoLockMinutes = localStorage.getItem(`inv_autolock_${currentUser.id}`) || '0';
      if (autoLockMinutes !== '0') {
        const thresholdMs = Number(autoLockMinutes) * 60 * 1000;
        const timeDiff = Date.now() - lastActivityRef.current;
        if (timeDiff >= thresholdMs) {
          setIsScreenLocked(true);
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearInterval(interval);
    };
  }, [isLoggedIn, currentUser, isScreenLocked]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');
    setIsUnlocking(true);

    try {
      // 1. Try real authentication with InsForge
      const { data, error } = await insforge.auth.signInWithPassword({
        email: currentUser.email,
        password: passwordInput
      });

      if (!error && data?.user) {
        setIsScreenLocked(false);
        setPasswordInput('');
        lastActivityRef.current = Date.now();
        setIsUnlocking(false);
        return;
      }

      // 2. Fallback for demo / offline / simulated users
      if (passwordInput === 'admin123' || passwordInput === '123456' || passwordInput === 'factura123' || passwordInput.toLowerCase() === currentUser.username.toLowerCase() + '123') {
        setIsScreenLocked(false);
        setPasswordInput('');
        lastActivityRef.current = Date.now();
        setIsUnlocking(false);
        return;
      }

      setUnlockError(error?.message || 'Contraseña incorrecta. (Pruebe con "admin123" o su contraseña del sistema)');
    } catch (err: any) {
      setUnlockError('Error al validar la contraseña. Intente de nuevo.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const addNotification = (notif: { title: string; message: string; type: 'info' | 'warning' | 'error' | 'success' }) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: notif.title,
      description: notif.message,
      type: (notif.type === 'error' ? 'danger' : notif.type) as 'warning' | 'danger' | 'success' | 'info',
      read: false,
      time: 'Ahora'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Keep avatar input in sync on user toggles
  React.useEffect(() => {
    if (currentUser) {
      setCustomAvatarUrlInput(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  // Page level document tracking states
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<any | null>(null);
  const [prefilledDocForCopy, setPrefilledDocForCopy] = useState<any | null>(null);

  // Programmatic shortcuts and state triggers
  const [initialDocType, setInitialDocType] = useState<'Factura' | 'Cotizacion'>('Factura');
  const [appTriggerClientModal, setAppTriggerClientModal] = useState(false);
  const [appTriggerProductModal, setAppTriggerProductModal] = useState(false);
  const [initialStatusFilter, setInitialStatusFilter] = useState<'Todas' | 'Pagada' | 'Pendiente' | 'Anulada'>('Todas');
   const [configSubTab, setConfigSubTab] = useState<'emisor' | 'roles' | 'soporte' | 'seguridad'>(
    currentUser?.role === 'Administrador' ? 'emisor' : 'soporte'
  );

  // Keep configuration sub-tab active on active user changes
  React.useEffect(() => {
    if (currentUser) {
      setConfigSubTab(currentUser.role === 'Administrador' ? 'emisor' : 'soporte');
    }
  }, [currentUser?.role]);

  // General Quick Create handler for sidebar interactive triggers (+)
  const handleQuickCreate = (tabId: string) => {
    if (tabId === 'clientes') {
      setCurrentTab('clientes');
      setAppTriggerClientModal(true);
    } else if (tabId === 'productos') {
      setCurrentTab('productos');
      setAppTriggerProductModal(true);
    } else if (tabId === 'facturas') {
      setInitialDocType('Factura');
      setCurrentTab('create');
    } else if (tabId === 'cotizaciones') {
      setInitialDocType('Cotizacion');
      setCurrentTab('create');
    } else if (tabId === 'recibos') {
      setInitialStatusFilter('Pendiente');
      setCurrentTab('facturas');
    } else if (tabId === 'categorias') {
      setCurrentTab('categorias');
    }
  };

  if (!loaded) {
    return null;
  }

  const navItems = [
    { id: 'dashboard', name: 'Panel Principal', icon: LayoutDashboard },
    { id: 'analiticas', name: 'Analíticas (BI)', icon: TrendingUp },
    { id: 'facturas', name: 'Facturas', icon: FilePlus },
    { id: 'cotizaciones', name: 'Cotizaciones', icon: ClipboardList },
    { id: 'purchase-orders', name: 'Órdenes de Compra', icon: ShoppingCart },
    { id: 'pos', name: 'Punto de Venta (POS)', icon: Store },
    { id: 'recibos', name: 'Recibos (Cobros)', icon: ReceiptIcon },
    { id: 'clientes', name: 'Clientes', icon: Users },
    { id: 'productos', name: 'Catálogo Productos', icon: Package },
    { id: 'inventario', name: 'Almacenes e Inventario', icon: Warehouse },
    { id: 'financial-accounts', name: 'Cuentas & Cajas', icon: Landmark },
    { id: 'gastos', name: 'Gastos & Compras', icon: TrendingDown },
    { id: 'reportes', name: 'Formatos DGII 606/7', icon: FileSpreadsheet },
    { id: 'configuracion', name: 'Configuración', icon: Settings, permission: true },
  ];

  const checkAndNavigate = (destination: TabType) => {
    if (currentTab === 'create') {
      try {
        const draft = localStorage.getItem('inv_creator_draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          const hasDraftContent = (parsed.items && parsed.items.length > 0) || parsed.selectedClientId;
          if (hasDraftContent) {
            setPendingTabDestination(destination);
            setShowDraftExitDialog(true);
            return;
          }
        }
      } catch (err) {
        console.error('Error checking draft', err);
      }
    }
    executeNavigation(destination);
  };

  const executeNavigation = (destination: TabType) => {
    setCurrentTab(destination);
    setMobileMenuOpen(false);
    setSelectedInvoiceForPreview(null);
    setPrefilledDocForCopy(null);
    if (destination === 'facturas' || destination === 'cotizaciones') {
      setInitialStatusFilter('Todas');
    }
  };

  // Pantalla de Carga (Splash Screen)
  if (!loaded || authChecking) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center animate-in fade-in duration-700">
          <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-20 h-20 mb-6 drop-shadow-2xl animate-pulse" />
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">FacturaDo</h1>
          <p className="text-neutral-400 text-sm mb-8 font-medium">Preparando tu espacio de trabajo...</p>
          <div className="w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-white rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ transformOrigin: 'left' }} />
          </div>
        </div>
        <style>{`
          @keyframes progress {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(0.5); }
            100% { transform: scaleX(1); transform-origin: right; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <React.Suspense fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
        </div>
      }>
        <Routes>
      <Route 
        path="/" 
        element={
          isLoggedIn ? (
            needsOnboarding ? <Navigate to="/onboarding" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <LandingAndAuth 
              initialView="landing"
              usersList={users} 
              onLoginSuccess={async (user) => {
                await handleLoginSuccessUser(user);
                setIsLoggedIn(true);
              }} 
            />
          )
        } 
      />

      <Route 
        path="/login" 
        element={
          isLoggedIn ? (
            needsOnboarding ? <Navigate to="/onboarding" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <LandingAndAuth 
              initialView="login"
              usersList={users} 
              onLoginSuccess={async (user) => {
                await handleLoginSuccessUser(user);
                setIsLoggedIn(true);
              }} 
            />
          )
        } 
      />

      <Route 
        path="/register" 
        element={
          isLoggedIn ? (
            needsOnboarding ? <Navigate to="/onboarding" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <LandingAndAuth 
              initialView="register"
              usersList={users} 
              onLoginSuccess={async (user) => {
                await handleLoginSuccessUser(user);
                setIsLoggedIn(true);
              }} 
            />
          )
        } 
      />

      <Route 
        path="/ayuda" 
        element={
          isLoggedIn ? (
            needsOnboarding ? <Navigate to="/onboarding" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <LandingAndAuth 
              initialView="ayuda"
              usersList={users} 
              onLoginSuccess={async (user) => {
                await handleLoginSuccessUser(user);
                setIsLoggedIn(true);
              }} 
            />
          )
        } 
      />

      <Route 
        path="/onboarding" 
        element={
          !isLoggedIn ? (
            <Navigate to="/" replace />
          ) : !needsOnboarding ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <OnboardingWizard
              onComplete={async (newSettings) => {
                setNeedsOnboarding(false);
                await loadAllDataFromPostgres();
              }}
            />
          )
        } 
      />

      <Route
        path="/*"
        element={
          !isLoggedIn ? (
            <Navigate to="/" replace />
          ) : needsOnboarding ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <div id="full-system-container" className="flex flex-col lg:flex-row min-h-screen bg-[#fafafa] text-neutral-950 font-sans">
      {/* DESKTOP SIDEBAR - Menú Lateral */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-neutral-200 sticky top-0 h-screen max-h-screen shrink-0 overflow-visible select-none font-sans transition-all duration-300 relative ${isSidebarCollapsed ? 'w-[76px]' : 'w-[260px]'}`} id="desktop-sidebar-menu">
        <div className={`p-4 border-b border-neutral-150 flex items-center bg-neutral-50/50 shrink-0 select-none ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          {isSidebarCollapsed ? (
            <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8" />
          ) : (
            <LogoFacturaDo className="h-8 w-auto px-1" />
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="absolute -right-3 top-5 bg-white border border-neutral-200 rounded-full p-1 hover:bg-neutral-100 shadow-sm z-50 text-neutral-500"
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* SIDEBAR MAIN MENU WRAPPER */}
        <div className={`flex-1 overflow-y-auto ${isSidebarCollapsed ? 'p-2 space-y-2 overflow-x-hidden' : 'p-3 space-y-4'}`}>
          {/* Top-level Dashboard Link without Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              title={isSidebarCollapsed ? "Dashboard" : undefined}
              onClick={() => checkAndNavigate('dashboard')}
              className={`w-full flex items-center py-2 rounded-lg transition-all text-left text-[14px] ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 space-x-2'} ${
                currentTab === 'dashboard'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 font-medium'
              }`}
            >
              <LayoutDashboard className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'} shrink-0`} />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>
          </div>
          <div className="space-y-1 mt-1">
            <button
              type="button"
              title={isSidebarCollapsed ? "Estado de mi negocio" : undefined}
              onClick={() => checkAndNavigate('estado-negocio')}
              className={`w-full flex items-center py-2 rounded-lg transition-all text-left text-[14px] ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 space-x-2'} ${
                currentTab === 'estado-negocio'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 font-medium'
              }`}
            >
              <TrendingUp className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'} shrink-0`} />
              {!isSidebarCollapsed && <span>Estado de mi negocio</span>}
            </button>
          </div>

          {sidebarCategories.map((cat, catIdx) => {
            const isOpen = !!openCategories[cat.title];
            return (
              <div key={catIdx} className="space-y-1">
                {!isSidebarCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.title)}
                    className="w-full text-left text-[12px] font-extrabold text-neutral-500 uppercase tracking-wider pl-2 pr-1.5 py-1.5 flex items-center justify-between gap-1.5 border-b border-neutral-100 mb-1 hover:text-neutral-900 transition-colors cursor-pointer bg-transparent border-0"
                  >
                    <div className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4 shrink-0 text-neutral-400" />
                      <span className="font-bold tracking-wider">{cat.title}</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                  </button>
                ) : (
                  <div className="flex justify-center py-2 border-b border-neutral-100 mb-1 mt-2" title={cat.title}>
                    <cat.icon className="w-5 h-5 text-neutral-300" />
                  </div>
                )}
                {(isOpen || isSidebarCollapsed) && (
                  <div className={isSidebarCollapsed ? 'space-y-2' : 'space-y-0.5'}>
                    {cat.items.map((item) => {
                      const mappedTab = item.id;
                      const isActive = currentTab === mappedTab;
                      const IconComp = item.icon;
                      const hasQuickCreate = ['clientes', 'productos', 'facturas', 'cotizaciones', 'recibos', 'categorias'].includes(item.id);

                      return (
                        <div key={item.id} className={`relative group flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`} title={isSidebarCollapsed ? item.name : undefined}>
                          <button
                            onClick={() => {
                              checkAndNavigate(mappedTab as TabType);
                            }}
                            className={`w-full flex items-center py-2 rounded-lg transition-all text-left text-[14px] ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 space-x-2 pr-8'} ${
                              isActive
                                ? 'bg-neutral-950 text-white font-bold shadow-xs'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 font-medium'
                            }`}
                          >
                            <IconComp className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'} shrink-0`} />
                            {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                          </button>
                          {hasQuickCreate && !isSidebarCollapsed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickCreate(item.id);
                              }}
                              title="Añadir nuevo"
                              className={`absolute right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${
                                isActive ? 'text-white hover:bg-neutral-800' : 'text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* LOGGED USER DETAILED DETAILS AT SIDEBAR BOTTOM */}
        <div className={`p-3 border-t border-neutral-150 bg-neutral-50/50 flex items-center shrink-0 relative ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
          <div 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`flex items-center cursor-pointer transition-all select-none ${isSidebarCollapsed ? 'justify-center hover:bg-neutral-100/80 p-1 rounded-lg' : 'space-x-2 truncate hover:bg-neutral-100/80 p-1.5 -ml-1.5 rounded-lg'}`}
            title="Configuración de Perfil"
          >
            <div className="w-8 h-8 rounded-full border border-neutral-200 bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden active:scale-95 transition-transform">
              {currentUser?.avatarUrl && !brokenAvatars[currentUser.avatarUrl] ? (
                <img
                  referrerPolicy="no-referrer"
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-full h-full object-cover"
                  onError={() => {
                    if (currentUser.avatarUrl) {
                      setBrokenAvatars(prev => ({ ...prev, [currentUser.avatarUrl!]: true }));
                    }
                  }}
                />
              ) : (
                <span className="text-[10px] font-bold uppercase">{currentUser?.username?.charAt(0) || 'A'}</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate leading-tight">
                <span className="text-[11px] font-semibold text-neutral-805 block truncate leading-none">{currentUser?.username}</span>
                <span className="text-[9px] text-neutral-450 truncate block leading-none">{currentUser?.role}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowLogoutOverlay(true)}
            className={`p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 shrink-0 ${isSidebarCollapsed ? 'w-full flex justify-center' : ''}`}
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {profileDropdownOpen && (
            <div
              id="desktop-profile-dropdown"
              className="absolute bottom-14 left-3 w-52 bg-white rounded-xl border border-neutral-205 shadow-2xl overflow-hidden z-50 text-xs py-1 animate-in slide-in-from-bottom-2 duration-150"
            >
              <div className="px-3.5 py-2.5 border-b border-neutral-100 bg-neutral-50/70">
                <span className="font-semibold text-neutral-400 text-[10px] uppercase block tracking-wider mb-1">
                  Sesión activa
                </span>
                <span className="font-bold text-neutral-900 text-[11px] block">
                  {currentUser?.username}
                </span>
                <span className="text-[10px] text-neutral-500">
                  Acceso: {currentUser?.role}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  setShowAvatarModal(true);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center space-x-2 font-medium border-0 bg-transparent cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                <span>Configurar Foto de Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  setCurrentTab('cfg-seguridad');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center space-x-2 font-medium border-0 bg-transparent cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                <div>
                  <span className="block font-bold">Mi Cuenta y Seguridad</span>
                  <span className="text-[9px] text-neutral-400 block -mt-0.5">Claves, 2FA y sesiones locales</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  setShowLogoutOverlay(true);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-red-600 transition-colors flex items-center space-x-2 font-semibold border-t border-neutral-100 mt-1 bg-transparent border-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT SIDE WORKSPACE (MAIN APP PAGE STAGE) */}
      <div className="flex-1 flex flex-col min-h-screen relative pb-20 lg:pb-8">
        {/* GLOBAL APPLICATION HEADER (UNIVERSAL FOR MOBILE & DESKTOP) */}
        <header className="flex h-16 items-center justify-between px-3 md:px-8 bg-white border-b border-neutral-150 sticky top-0 z-40 shrink-0" id="global-application-header">
          {/* LEFT: LOGO ON MOBILE / SPACE HOLDER ON DESKTOP */}
          <div className="flex items-center lg:w-1/3 shrink-0">
            {/* Mobile Logo */}
            <div className="flex items-center lg:hidden select-none mr-2 gap-2 font-sans">
              <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="h-7 w-7 object-contain shrink-0" referrerPolicy="no-referrer" />
              <span className="text-base font-bold tracking-tight text-[#1A2732]">FacturaDo</span>
            </div>
          </div>

          {/* CENTER: SEARCH BAR & NUEVO BUTTON */}
          <div className="flex items-center justify-center flex-grow lg:flex-1 max-w-xs sm:max-w-lg mx-auto gap-1.5 sm:gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <Input
                id="header-drilldown-input"
                placeholder="Buscar rápido..."
                value={headerSearch}
                onChange={(e) => handleHeaderSearch(e.target.value)}
                className="pl-8 h-8.5 w-full bg-neutral-50 border-neutral-200 text-xs rounded-lg focus-visible:ring-neutral-400 shadow-xs"
              />
              
              {/* Header Search Results dropdown */}
              {headerSearch.trim() && headerResults.length > 0 && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => { setHeaderSearch(''); setHeaderResults([]); }} />
                  <div id="header-search-overlay-results" className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 p-2 divide-y divide-neutral-100 font-sans text-xs">
                    {headerResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          res.action();
                          setHeaderSearch('');
                          setHeaderResults([]);
                        }}
                        className="w-full text-left p-2 hover:bg-neutral-50 flex items-center justify-between text-[11.5px] transition-colors rounded-lg border-0 bg-transparent cursor-pointer"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-neutral-950 block truncate">{res.title}</span>
                          <span className="text-neutral-400 text-[10px] block truncate mt-0.5">{res.subtitle}</span>
                        </div>
                        <span className="text-[9px] bg-neutral-100 text-neutral-650 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">{res.type}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* "+" creation button with dropdown */}
            <div className="relative shrink-0">
              <Button
                id="header-create-btn"
                onClick={() => setHeaderCreateOpen(!headerCreateOpen)}
                className="bg-black text-white hover:bg-neutral-800 h-8.5 w-8.5 p-0 rounded-lg flex items-center justify-center shadow-xs"
                title="Nueva Operación"
              >
                <Plus className="w-4.5 h-4.5" />
              </Button>

              {headerCreateOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setHeaderCreateOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 p-1 animate-fade-in text-xs font-semibold text-neutral-800">
                    <div className="px-2 py-1 text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Crear Nuevo</div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setHeaderCreateOpen(false);
                        setInitialDocType('Factura');
                        setCurrentTab('create');
                      }}
                      className="w-full text-left p-2 hover:bg-neutral-50 rounded flex items-center space-x-2 text-neutral-900 border-0 bg-transparent cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Factura de Venta</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setHeaderCreateOpen(false);
                        setInitialDocType('Cotizacion');
                        setCurrentTab('create');
                      }}
                      className="w-full text-left p-2 hover:bg-neutral-50 rounded flex items-center space-x-2 text-neutral-950 border-0 bg-transparent cursor-pointer"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Cotización Comercial</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          
            {/* Notification Bell */}
            <div className="relative shrink-0">
              <Button
                id="header-notifications-btn"
                variant="ghost"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="hover:bg-neutral-100 h-8.5 w-8.5 p-0 rounded-lg flex items-center justify-center relative border border-neutral-150 bg-white"
                title="Notificaciones"
              >
                <Bell className="w-4 h-4 text-neutral-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[8px] h-4 w-4 rounded-full flex items-center justify-center border border-white scale-100 animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-xl shadow-2xl z-50 p-3 font-sans text-xs flex flex-col gap-2 animate-fade-in text-left">
                    <div className="flex items-center justify-between border-b border-neutral-150 pb-2">
                      <span className="font-extrabold text-neutral-900 text-xs sm:text-sm">Notificaciones ({notifications.filter(n => !n.read).length})</span>
                      <div className="flex items-center gap-1.5">
                        {notifications.length > 0 && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                              }}
                              className="text-neutral-500 hover:text-neutral-900 bg-transparent border-0 cursor-pointer text-[10px] font-bold"
                            >
                              Marcar todo leído
                            </button>
                            <span className="text-neutral-300">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                setNotifications([]);
                              }}
                              className="text-rose-500 hover:text-rose-700 bg-transparent border-0 cursor-pointer text-[10px] font-bold"
                            >
                              Limpiar todo
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-neutral-400 text-[11px]">
                          No tienes ninguna notificación pendiente.
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const indicatorColor = 
                            n.type === 'danger' ? 'bg-rose-50 text-rose-600' :
                            n.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                            n.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-blue-50 text-blue-600';

                          return (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                              }}
                              className={`py-2.5 px-2 flex gap-2.5 items-start cursor-pointer transition-colors rounded-lg ${n.read ? 'opacity-60 hover:bg-neutral-50/55' : 'bg-neutral-50/60 hover:bg-neutral-50'}`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${indicatorColor}`}>
                                {n.type === 'danger' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> :
                                 n.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> :
                                 n.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
                                 <Info className="w-3.5 h-3.5 text-blue-600" />}
                              </div>

                              <div className="flex-1 text-left min-w-0">
                                <div className="flex justify-between gap-1 items-start">
                                  <span className={`text-[11px] text-neutral-900 truncate leading-snug ${!n.read ? 'font-extrabold' : 'font-medium'}`}>{n.title}</span>
                                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1" />}
                                </div>
                                <p className="text-neutral-550 text-[10px] mt-0.5 leading-normal">{n.description}</p>
                                <span className="text-neutral-400 text-[9px] font-mono block mt-1">{n.time}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            </div>

          {/* RIGHT: COMPACT ACTION BUTTONS (Empresa Spacer) */}
          <div className="hidden lg:flex items-center justify-end lg:w-1/3 gap-3">
          </div>
        </header>

        {/* COMPACT BOTTOM FLOATING DOCK */}
        <div id="bottom-navigation-dock" className="fixed bottom-4 left-6 right-6 h-16 bg-white/70 border border-white/40 shadow-[0_12px_32px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.03)] z-50 flex items-center justify-around px-2 select-none rounded-full lg:hidden transition-all duration-300" style={{ backdropFilter: 'blur(20px) saturate(190%)', WebkitBackdropFilter: 'blur(20px) saturate(190%)' }}>
          {/* 1. PERFIL (Profile Button, Leftmost) */}
          <div className="relative flex flex-col items-center justify-center">
            <button
              type="button"
              id="admin-popover-trigger-mobile"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setMobileCreateOpen(false);
                setMobileMenuOpen(false);
              }}
              className="w-10 h-10 rounded-full border border-neutral-200/60 bg-white/80 flex items-center justify-center hover:bg-neutral-100 transition-all overflow-hidden focus:outline-none cursor-pointer"
            >
              {currentUser?.avatarUrl && !brokenAvatars[currentUser.avatarUrl] ? (
                <img
                  referrerPolicy="no-referrer"
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-full h-full object-cover"
                  onError={() => {
                    if (currentUser.avatarUrl) {
                      setBrokenAvatars(prev => ({ ...prev, [currentUser.avatarUrl!]: true }));
                    }
                  }}
                />
              ) : (
                <span className="text-xs font-bold uppercase">{currentUser?.username?.charAt(0) || 'A'}</span>
              )}
            </button>

            {profileDropdownOpen && (
              <div
                id="admin-profile-dropdown-mobile"
                className="absolute bottom-18 left-0 w-52 bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden z-50 text-xs py-1 animate-in slide-in-from-bottom-2 duration-150"
              >
                <div className="px-3.5 py-2.5 border-b border-neutral-100 bg-neutral-50/70">
                  <span className="font-semibold text-neutral-400 text-[10px] uppercase block tracking-wider mb-1">
                    Sesión activa
                  </span>
                  <span className="font-bold text-neutral-850 text-[11px] block text-left">
                    {currentUser?.username}
                  </span>
                  <span className="text-[10px] text-neutral-500 block text-left">
                    Acceso: {currentUser?.role}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setShowAvatarModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center space-x-2 font-medium border-0 bg-transparent cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                  <span>Configurar Foto de Perfil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setCurrentTab('cfg-seguridad');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center space-x-2 font-medium border-0 bg-transparent cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                  <div>
                    <span className="block font-bold">Mi Cuenta y Seguridad</span>
                    <span className="text-[9px] text-neutral-400 block -mt-0.5">Claves, 2FA y sesiones locales</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setShowLogoutOverlay(true);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-red-600 transition-colors flex items-center space-x-2 font-semibold border-t border-neutral-100 mt-1 bg-transparent border-0 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. DASHBOARD (Panel Principal) */}
          <button
            type="button"
            onClick={() => {
              checkAndNavigate('dashboard');
              setProfileDropdownOpen(false);
              setMobileCreateOpen(false);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              currentTab === 'dashboard'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          {/* 3. MAS (Plus Button Center) */}
          <div className="relative flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setMobileCreateOpen(!mobileCreateOpen);
                setProfileDropdownOpen(false);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border-0 bg-gradient-to-br from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-500/25 active:scale-95 duration-100 focus:outline-none cursor-pointer -translate-y-2.5 transition-all ${
                mobileCreateOpen ? 'rotate-45' : ''
              }`}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {mobileCreateOpen && (
              <div
                id="mobile-quick-create-menu"
                className="absolute bottom-18 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-2xl p-2.5 z-50 text-xs flex flex-col gap-1 animate-in slide-in-from-bottom-3 duration-200"
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 mb-1 text-left">
                  Crear Nuevo
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setMobileCreateOpen(false);
                    setInitialDocType('Factura');
                    setCurrentTab('create');
                  }}
                  className="w-full text-left p-2 hover:bg-neutral-50 rounded-xl flex items-center space-x-2.5 text-neutral-900 border-0 bg-transparent cursor-pointer font-medium"
                >
                  <FilePlus className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Nueva Factura</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileCreateOpen(false);
                    setInitialDocType('Cotizacion');
                    setCurrentTab('create');
                  }}
                  className="w-full text-left p-2 hover:bg-neutral-50 rounded-xl flex items-center space-x-2.5 text-neutral-900 border-0 bg-transparent cursor-pointer font-medium"
                >
                  <ClipboardList className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Nueva Cotización</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileCreateOpen(false);
                    setCurrentTab('clientes');
                    setAppTriggerClientModal(true);
                  }}
                  className="w-full text-left p-2 hover:bg-neutral-50 rounded-xl flex items-center space-x-2.5 text-neutral-900 border-0 bg-transparent cursor-pointer font-medium"
                >
                  <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Nuevo Cliente</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileCreateOpen(false);
                    setCurrentTab('productos');
                    setAppTriggerProductModal(true);
                  }}
                  className="w-full text-left p-2 hover:bg-neutral-50 rounded-xl flex items-center space-x-2.5 text-neutral-900 border-0 bg-transparent cursor-pointer font-medium"
                >
                  <Package className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>Nuevo Producto</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileCreateOpen(false);
                    setCurrentTab('gastos');
                  }}
                  className="w-full text-left p-2 hover:bg-neutral-50 rounded-xl flex items-center space-x-2.5 text-neutral-900 border-0 bg-transparent cursor-pointer font-medium"
                >
                  <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Nuevo Gasto / Compra</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileCreateOpen(false);
                    setInitialStatusFilter('Pendiente');
                    setCurrentTab('facturas');
                  }}
                  className="w-full text-left p-2 hover:bg-neutral-50 rounded-xl flex items-center space-x-2.5 text-neutral-900 border-0 bg-transparent cursor-pointer font-medium"
                >
                  <ReceiptIcon className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Nuevo Recibo (Cobro)</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. FACTURAS (Facturas View) */}
          <button
            type="button"
            onClick={() => {
              checkAndNavigate('facturas');
              setProfileDropdownOpen(false);
              setMobileCreateOpen(false);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              currentTab === 'facturas'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* 5. HAMBURGER (Menu Dialog on Right) */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setProfileDropdownOpen(false);
              setMobileCreateOpen(false);
            }}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              mobileMenuOpen
                ? 'bg-neutral-950 text-white shadow-md'
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      {/* MAIN VIEW CONTENT AREA */}
      <main id="applet-primary-stage" className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* DYNAMIC TAB SWITCH RENDERER */}
        <div className="max-w-7xl mx-auto space-y-6">
          {currentTab === 'dashboard' && (
            <Dashboard
              invoices={invoices}
              clients={clients}
              products={products}
              receipts={receipts}
              expenses={expenses}
              setCurrentTab={setCurrentTab}
              setGlobalSearch={setGlobalSearch}
              currentUser={currentUser}
              onNavigateToCreate={(type) => {
                setInitialDocType(type);
                setCurrentTab('create');
              }}
            />
          )}

          {currentTab === 'estado-negocio' && (
            <BusinessStateView
              invoices={invoices}
              expenses={expenses}
              currentUser={currentUser}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'analiticas' && (
            <AnalyticsDashboard
              invoices={invoices}
              clients={clients}
              products={products}
              expenses={expenses}
            />
          )}

          {currentTab === 'create' && (
            <InvoiceCreator sellers={sellers} clients={clients}
              products={products}
              ncfSequences={ncfSequences}
              createInvoiceOrQuote={createInvoiceOrQuote}
              onSuccess={(createdDoc) => {
                setPrefilledDocForCopy(null);
                if (createdDoc) {
                  setSelectedInvoiceForPreview(createdDoc);
                  setCurrentTab('view-document');
                } else {
                  setCurrentTab('facturas');
                }
              }}
              currentUser={currentUser}
              initialDocType={initialDocType}
              initialPrefilledDoc={prefilledDocForCopy || undefined}
              addClient={addClient}
              addProduct={addProduct}
              users={users}
              activeShift={activeShift}
              templateSettings={templateSettings}
              saveTemplateSettings={saveTemplateSettings}
              financialAccounts={financialAccounts}
              payInvoice={payInvoice}
            />
          )}

          {currentTab === 'facturas' && (
            <InvoiceList
              invoices={invoices}
              clients={clients}
              receipts={receipts}
              updateInvoice={updateInvoice}
              deleteInvoice={deleteInvoice}
              convertQuoteToInvoice={convertQuoteToInvoice}
              payInvoice={payInvoice}
              templateSettings={templateSettings}
              currentUser={currentUser}
              initialDocFilter="Factura"
              initialStatusFilter={initialStatusFilter}
              onNavigateToCreate={(type) => {
                setPrefilledDocForCopy(null);
                setInitialDocType(type || 'Factura');
                setCurrentTab('create');
              }}
              onNavigateToPos={() => checkAndNavigate('pos')}
              onViewDocument={(doc) => {
                setSelectedInvoiceForPreview(doc);
                setCurrentTab('view-document');
              }}
              onEditDocument={(doc) => {
                setSelectedInvoiceForPreview(doc);
                setCurrentTab('edit-document');
              }}
            />
          )}

          {currentTab === 'cotizaciones' && (
            <InvoiceList
              invoices={invoices}
              clients={clients}
              receipts={receipts}
              updateInvoice={updateInvoice}
              deleteInvoice={deleteInvoice}
              convertQuoteToInvoice={convertQuoteToInvoice}
              payInvoice={payInvoice}
              templateSettings={templateSettings}
              currentUser={currentUser}
              initialDocFilter="Cotizacion"
              initialStatusFilter={initialStatusFilter}
              onNavigateToCreate={(type) => {
                setPrefilledDocForCopy(null);
                setInitialDocType(type || 'Cotizacion');
                setCurrentTab('create');
              }}
              onNavigateToPos={() => checkAndNavigate('pos')}
              onViewDocument={(doc) => {
                setSelectedInvoiceForPreview(doc);
                setCurrentTab('view-document');
              }}
              onEditDocument={(doc) => {
                setSelectedInvoiceForPreview(doc);
                setCurrentTab('edit-document');
              }}
            />
          )}

          {currentTab === 'view-document' && (
            (() => {
              const freshDoc = invoices.find(inv => inv.id === selectedInvoiceForPreview?.id) || selectedInvoiceForPreview;
              if (!freshDoc) return null;
              return (
                <DocumentDetailsView
                  invoice={freshDoc}
                  receipts={receipts}
                  invoices={invoices}
                  templateSettings={templateSettings}
                  currentUser={currentUser}
                  payInvoice={payInvoice}
                  convertQuoteToInvoice={convertQuoteToInvoice}
                  saveTemplateSettings={saveTemplateSettings}
                  onBack={() => {
                    setCurrentTab(freshDoc.type === 'Cotizacion' ? 'cotizaciones' : 'facturas');
                    setSelectedInvoiceForPreview(null);
                  }}
                  onEdit={(doc) => {
                    setCurrentTab('edit-document');
                  }}
                  onDuplicate={(doc) => {
                    setPrefilledDocForCopy(doc);
                    setCurrentTab('create');
                  }}
                  onNavigateToDocument={(doc) => {
                    setSelectedInvoiceForPreview(doc);
                  }}
                />
              );
            })()
          )}

          {currentTab === 'edit-document' && selectedInvoiceForPreview && (
            <DocumentEditView sellers={sellers} invoice={selectedInvoiceForPreview}
              clients={clients}
              products={products}
              onCancel={() => {
                setCurrentTab('view-document');
              }}
              onSave={(id, updatedFields) => {
                updateInvoice(id, updatedFields);
                const fresh = { ...selectedInvoiceForPreview, ...updatedFields };
                setSelectedInvoiceForPreview(fresh);
                setCurrentTab('view-document');
              }}
            />
          )}

          {(currentTab === 'clientes' || currentTab === 'suplidores') && (
            <Directories
              clients={clients}
              products={products}
              providers={providers}
              warehouses={warehouses}
              addClient={addClient}
              updateClient={updateClient}
              deleteClient={deleteClient}
              importClientsBulk={importClientsBulk}
              addProduct={addProduct}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
              importProductsBulk={importProductsBulk}
              addProvider={addProvider}
              updateProvider={updateProvider}
              deleteProvider={deleteProvider}
              importProvidersBulk={importProvidersBulk}
              currentUser={currentUser}
              initialSearchQuery={globalSearch}
              clearInitialSearchQuery={() => setGlobalSearch('')}
              initialTab={currentTab === 'suplidores' ? 'providers' : 'clients'}
              triggerClientModal={appTriggerClientModal}
              clearTriggerClientModal={() => setAppTriggerClientModal(false)}
            />
          )}

          {currentTab === 'productos' && (
            <Directories
              clients={clients}
              products={products}
              providers={providers}
              warehouses={warehouses}
              addClient={addClient}
              updateClient={updateClient}
              deleteClient={deleteClient}
              importClientsBulk={importClientsBulk}
              addProduct={addProduct}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
              importProductsBulk={importProductsBulk}
              addProvider={addProvider}
              updateProvider={updateProvider}
              deleteProvider={deleteProvider}
              importProvidersBulk={importProvidersBulk}
              currentUser={currentUser}
              initialSearchQuery={globalSearch}
              clearInitialSearchQuery={() => setGlobalSearch('')}
              initialTab="products"
              triggerProductModal={appTriggerProductModal}
              clearTriggerProductModal={() => setAppTriggerProductModal(false)}
            />
          )}

          {currentTab === 'recibos' && (
            <ReceiptsList
              receipts={receipts}
              templateSettings={templateSettings}
              currentUser={currentUser}
              onNavigateToPendingInvoices={() => {
                setInitialStatusFilter('Pendiente');
                setCurrentTab('facturas');
              }}
            />
          )}

          {currentTab === 'inventario' && (
            <div className="space-y-6" id="inventario-almacenes-combined-container">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-2.5 gap-4">
                <div>
                  <h2 className="text-xl font-bold font-heading text-neutral-900">Almacenes e Inventario</h2>
                  <p className="text-xs text-neutral-500">Supervise existencias físicas, valor de inventario y controle múltiples zonas de despacho.</p>
                </div>
                <div className="flex space-x-1.5 bg-neutral-100 p-1 rounded-xl w-fit" id="combined-tabs-trigger">
                  <button
                    onClick={() => setInventorySubTab('stock')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      inventorySubTab === 'stock'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Niveles de Stock
                  </button>
                  <button
                    onClick={() => setInventorySubTab('warehouses')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      inventorySubTab === 'warehouses'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Distribución de Almacenes
                  </button>
                </div>
              </div>

              {inventorySubTab === 'stock' ? (
                <InventoryManager
                  products={products}
                  providers={providers}
                  updateProduct={updateProduct}
                  currentUser={currentUser}
                />
              ) : (
                <WarehousesView
                  warehouses={warehouses}
                  products={products}
                  addWarehouse={addWarehouse}
                  updateWarehouse={updateWarehouse}
                  deleteWarehouse={deleteWarehouse}
                />
              )}
            </div>
          )}

          {currentTab === 'pos' && (
            <POSView sellers={sellers} products={products}
              clients={clients}
              ncfSequences={ncfSequences}
              financialAccounts={financialAccounts}
              currentUser={currentUser}
              createInvoiceOrQuote={createInvoiceOrQuote}
              payInvoice={payInvoice}
              warehouses={warehouses}
              addClient={addClient}
              templateSettings={templateSettings}
            />
          )}

          {currentTab === 'turnos' && (
            <ShiftsView
              shifts={shifts}
              activeShift={activeShift}
              addShift={addShift}
              updateShift={updateShift}
              users={users}
              financialAccounts={financialAccounts}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'purchase-orders' && (
            <PurchaseOrdersView
              purchaseOrders={purchaseOrders}
              providers={providers}
              products={products}
              createPurchaseOrder={createPurchaseOrder}
              updatePurchaseOrder={updatePurchaseOrder}
              updateProduct={updateProduct}
            />
          )}

          {currentTab === 'financial-accounts' && (
            <FinancialAccountsView
              financialAccounts={financialAccounts}
              receipts={receipts}
              addFinancialAccount={addFinancialAccount}
              updateFinancialAccount={updateFinancialAccount}
              deleteFinancialAccount={deleteFinancialAccount}
            />
          )}

          {currentTab === 'caja' && (
            <FinancialCajaView
              financialAccounts={financialAccounts}
              receipts={receipts}
              addFinancialAccount={addFinancialAccount}
              updateFinancialAccount={updateFinancialAccount}
              deleteFinancialAccount={deleteFinancialAccount}
            />
          )}

          {currentTab === 'bancos' && (
            <FinancialBancosView
              financialAccounts={financialAccounts}
              receipts={receipts}
              addFinancialAccount={addFinancialAccount}
              updateFinancialAccount={updateFinancialAccount}
              deleteFinancialAccount={deleteFinancialAccount}
            />
          )}

          {currentTab === 'cobrar' && (
            <AccountsReceivableView invoices={invoices} />
          )}

          {currentTab === 'pagar' && (
            <AccountsPayableView purchaseOrders={purchaseOrders} expenses={expenses} />
          )}

          {currentTab === 'compras-hist' && (
            <ClientHistoryView clients={clients} invoices={invoices} />
          )}

          {currentTab === 'estado-cuenta' && (
            <ClientAccountStatementView clients={clients} invoices={invoices} receipts={receipts} />
          )}

          {currentTab === 'categorias' && (
            <ProductCategoriesView products={products} addProduct={addProduct} />
          )}

          {currentTab === 'inventario-ajustes' && (
            <InventoryAdjustmentsView products={products} updateProduct={updateProduct} />
          )}

          {currentTab === 'notas-credito' && (
            <CreditNotesView invoices={invoices} updateInvoice={updateInvoice} />
          )}

          {currentTab === 'rep-ventas' && (
            <ReportVentasView invoices={invoices} />
          )}

          {currentTab === 'rep-gastos' && (
            <ReportGastosView expenses={expenses} />
          )}

          {currentTab === 'rep-utilidades' && (
            <ReportUtilidadesView invoices={invoices} expenses={expenses} />
          )}

          {currentTab === 'rep-inv' && (
            <ReportInventoryView products={products} />
          )}

          {currentTab === 'rep-cli' && (
            <ReportClientsView clients={clients} invoices={invoices} />
          )}

           {currentTab === 'rep-dgii' && (
            <DgiiReports
              invoices={invoices}
              providers={providers}
              currentUser={currentUser}
              expenses={expenses}
            />
          )}

          {currentTab === 'rep-606' && (
            <DgiiReports
              invoices={invoices}
              providers={providers}
              currentUser={currentUser}
              initialReportTab="606"
              expenses={expenses}
            />
          )}

          {currentTab === 'rep-607' && (
            <DgiiReports
              invoices={invoices}
              providers={providers}
              currentUser={currentUser}
              initialReportTab="607"
              expenses={expenses}
            />
          )}

          {currentTab === 'rep-608' && (
            <DgiiReports
              invoices={invoices}
              providers={providers}
              currentUser={currentUser}
              initialReportTab="608"
              expenses={expenses}
            />
          )}

          {currentTab === 'rep-609' && (
            <DgiiReports
              invoices={invoices}
              providers={providers}
              currentUser={currentUser}
              initialReportTab="609"
              expenses={expenses}
            />
          )}

          {currentTab === 'rep-excel' && (
            <ReportExcelView />
          )}

          {currentTab === 'cfg-datos' && (
            <TemplateSettingsPanel
              settings={templateSettings}
              saveTemplateSettings={saveTemplateSettings}
              ncfSequences={ncfSequences}
              updateNcfSequences={updateNcfSequences}
            />
          )}

          {currentTab === 'cfg-apariencia' && (
            <AppearanceSettingsView
              settings={templateSettings}
              saveTemplateSettings={saveTemplateSettings}
            />
          )}

          {currentTab === 'cfg-impuestos' && (
            <ConfigImpuestosView />
          )}

          {currentTab === 'cfg-usuarios' && (
            <UserPermissions
              users={users}
              currentUser={currentUser}
              addUser={addUser}
              updateUserRole={updateUserRole}
              deleteUser={deleteUser}
              handleActiveUserChange={handleActiveUserChange}
            />
          )}

          {currentTab === 'vendedores' && (
            <VendedoresView
              sellers={sellers}
              onAddSeller={addSeller}
              onUpdateSeller={updateSeller}
              onDeleteSeller={deleteSeller}
            />
          )}

          {currentTab === 'cfg-roles' && (
            <ConfigRolesView />
          )}

          {currentTab === 'cfg-audit' && (
            <AuditLogsView
              auditLogs={auditLogs}
              onRefresh={loadAllDataFromPostgres}
            />
          )}

          {currentTab === 'cfg-seguridad' && (
            <SecuritySettingsView 
              currentUser={currentUser}
              logActivity={logActivity}
              addNotification={addNotification}
            />
          )}

          {currentTab === 'cfg-soporte' && (
            <SupportSection tickets={tickets} addTicket={addTicket} />
          )}

          {currentTab === 'reportes' && (
            <DgiiReports
              invoices={invoices}
              providers={providers}
              currentUser={currentUser}
              expenses={expenses}
            />
          )}

          {currentTab === 'gastos' && (
            <ExpensesView
              expenses={expenses}
              addExpense={addExpense}
              deleteExpense={deleteExpense}
              currentUser={currentUser}
              financialAccounts={financialAccounts}
            />
          )}

          {currentTab === 'configuracion' && (
            <TemplateSettingsPanel
              settings={templateSettings}
              saveTemplateSettings={saveTemplateSettings}
              ncfSequences={ncfSequences}
              updateNcfSequences={updateNcfSequences}
            />
          )}
        </div>
      </main>

      {/* MOBILE HAMBURGER DRAWER */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          />
          {/* Bottom Drawer */}
          <div
            id="mobile-hamburger-drawer"
            className="fixed bottom-0 left-0 right-0 max-h-[75vh] bg-white rounded-t-3xl border-t border-neutral-250 shadow-2xl z-55 flex flex-col overflow-hidden lg:hidden animate-in slide-in-from-bottom duration-250"
          >
            {/* Header Drag Handle Spawner */}
            <div className="flex justify-center py-3 border-b border-neutral-100 shrink-0">
              <div className="w-12 h-1.5 bg-neutral-200 rounded-full" />
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Menú Principal
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  RNC: {templateSettings.businessRNC}
                </span>
              </div>

              {/* Menu Grid / List */}
              <div className="flex flex-col space-y-1 mt-2 pb-8">
                {/* 1. Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    checkAndNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                    currentTab === 'dashboard'
                      ? 'bg-neutral-950 text-white font-bold shadow-xs'
                      : 'text-neutral-600 active:bg-neutral-100 font-medium'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Panel Principal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    checkAndNavigate('estado-negocio');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                    currentTab === 'estado-negocio'
                      ? 'bg-neutral-950 text-white font-bold shadow-xs'
                      : 'text-neutral-600 active:bg-neutral-100 font-medium'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 shrink-0" />
                  <span>Estado de mi negocio</span>
                </button>

                {sidebarCategories.map((cat, catIdx) => {
                  const isOpen = !!openCategories[cat.title];
                  return (
                    <div key={catIdx} className="space-y-1 mt-2">
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.title)}
                        className="w-full text-left text-[13px] font-extrabold text-neutral-500 uppercase tracking-wider pl-3 pr-2 py-3 flex items-center justify-between gap-1.5 border-b border-neutral-100 mb-1 active:bg-neutral-50 transition-colors cursor-pointer bg-transparent border-0"
                      >
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4 shrink-0 text-neutral-400" />
                          <span className="font-bold tracking-wider">{cat.title}</span>
                        </div>
                        {isOpen ? <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="space-y-1 px-1">
                          {cat.items.map((item) => {
                            const mappedTab = item.id;
                            const isActive = currentTab === mappedTab;
                            const IconComp = item.icon;

                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  checkAndNavigate(mappedTab as TabType);
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                                  isActive
                                    ? 'bg-neutral-950 text-white font-bold shadow-xs'
                                    : 'text-neutral-600 active:bg-neutral-100 font-medium'
                                }`}
                              >
                                <IconComp className="w-5 h-5 shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="space-y-1 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      checkAndNavigate('cfg-datos');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                      currentTab.startsWith('cfg-')
                        ? 'bg-neutral-950 text-white font-bold shadow-xs'
                        : 'text-neutral-600 active:bg-neutral-100 font-medium'
                    }`}
                  >
                    <Settings className="w-5 h-5 shrink-0" />
                    <span>Configuración del Sistema</span>
                  </button>
                </div>
              </div>
              {/*

              {/* Support contact info */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Versión 2.4 (Estable)</span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentTab('cfg-soporte');
                  }}
                  className="text-rose-600 hover:underline border-0 bg-transparent cursor-pointer font-bold"
                >
                  Soporte Técnico
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 1. DRAFT EXIT GUARD WARNING DIALOG */}
      {showDraftExitDialog && (
        <div className="fixed inset-0 bg-neutral-950/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-neutral-200 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-55 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <AlertTriangle className="w-6 h-6 shrink-0" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">¿Deseas guardar esto como borrador?</h3>
              <p className="text-xs text-neutral-500 leading-normal">
                Tienes un documento comercial en proceso. Tu progreso ya se guardó automáticamente. Puedes regresar a él más tarde en cualquier momento o vaciarlo ahora.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <Button
                variant="outline"
                className="h-9 font-semibold text-[11px]"
                onClick={() => {
                  // Keep as draft and proceed to destination!
                  setShowDraftExitDialog(false);
                  if (pendingTabDestination) {
                    executeNavigation(pendingTabDestination);
                  }
                }}
              >
                Salir (Guardar copia)
              </Button>
              <Button
                className="h-9 bg-black text-white hover:bg-neutral-800 font-semibold text-[11px]"
                onClick={() => {
                  // Discard draft completely and proceed
                  try {
                    localStorage.removeItem('inv_creator_draft');
                  } catch {}
                  setShowDraftExitDialog(false);
                  if (pendingTabDestination) {
                    executeNavigation(pendingTabDestination);
                  }
                }}
              >
                Descartar y Salir
              </Button>
            </div>
            
            <button
              onClick={() => setShowDraftExitDialog(false)}
              className="w-full text-center text-[10px] text-neutral-400 hover:text-neutral-600 block mt-1"
            >
              Seguir editando este documento
            </button>
          </div>
        </div>
      )}

      {/* 2. CHOOSE PROFILE SWITCH (LOGOUT SIMULATOR) OVERLAY */}
      {showLogoutOverlay && (
        <div className="fixed inset-0 bg-neutral-950/40 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl space-y-4">
            <div className="text-center space-y-1 pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Cambiar Perfil de Trabajo</h3>
              <p className="text-xs text-neutral-400">Seleccione el perfil con el que desea facturar en esta terminal.</p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.map(u => {
                const isActive = u.id === currentUser?.id;
                return (
                  <div
                    key={u.id}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isActive ? 'border-neutral-950 bg-neutral-50 font-semibold' : 'border-neutral-200 bg-white hover:bg-neutral-50/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        handleActiveUserChange(u.id);
                        setShowLogoutOverlay(false);
                      }}
                      className="flex-1 flex items-center space-x-3 text-xs text-left bg-transparent border-0 cursor-pointer p-0"
                    >
                      {u.avatarUrl && !brokenAvatars[u.avatarUrl] ? (
                        <img
                          referrerPolicy="no-referrer"
                          src={u.avatarUrl}
                          alt={u.username}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                          onError={() => {
                            if (u.avatarUrl) {
                              setBrokenAvatars(prev => ({ ...prev, [u.avatarUrl!]: true }));
                            }
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-805 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {u.username.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="block font-semibold text-neutral-800">{u.username}</span>
                        <span className="text-[10px] text-neutral-500 font-medium">{u.role}</span>
                      </div>
                    </button>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      {isActive ? (
                        <span className="text-[10px] bg-neutral-950 text-white px-2 py-0.5 rounded-full font-mono">ACTIVA</span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              handleActiveUserChange(u.id);
                              setShowLogoutOverlay(false);
                            }}
                            className="text-[10px] text-neutral-500 hover:text-neutral-950 font-semibold px-2 py-1 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
                          >
                            Entrar ➜
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUser(u.id);
                            }}
                            className="p-1 px-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
                            title="Eliminar perfil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-100 gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  try {
                    await insforge.auth.signOut();
                  } catch (e) {
                    console.error('Error closing session', e);
                  }
                  setIsLoggedIn(false);
                  setShowLogoutOverlay(false);
                }}
                className="text-xs text-white border-none rounded-xl cursor-pointer font-bold px-3.5 py-1.5 h-8 bg-red-600 hover:bg-red-700"
              >
                Cerrar sesión completa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutOverlay(false)}
                className="text-xs px-4 cursor-pointer"
              >
                Permanecer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SET PROFILE AVATAR PHOTO DIALOG */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-neutral-955/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-neutral-200 shadow-2xl space-y-4">
            <div className="space-y-1.5 text-center sm:text-left animate-fade-in">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Configurar Foto de Perfil</h3>
              <p className="text-xs text-neutral-500">Sube una imagen desde tu PC o dispositivo y encuádrala a tu gusto.</p>
            </div>

            <div className="space-y-4">
              {/* Image cropper viewport */}
              {cropImageSrc ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Viewport Box */}
                  <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className="w-64 h-64 mx-auto relative overflow-hidden bg-neutral-950 rounded-xl select-none cursor-grab active:cursor-grabbing border border-neutral-200 shadow-inner"
                  >
                    <img
                      src={cropImageSrc}
                      alt="Crop View"
                      className={`absolute pointer-events-none max-w-none max-h-none ${
                        cropImageIsLandscape ? 'h-[160px] w-auto' : 'w-[160px] h-auto'
                      }`}
                      style={{
                        left: `calc(50% + ${cropPan.x}px)`,
                        top: `calc(50% + ${cropPan.y}px)`,
                        transform: `translate(-50%, -50%) scale(${cropZoom})`,
                      }}
                    />
                    {/* circular mask overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <mask id="crop-mask">
                          <rect width="100%" height="100%" fill="white" />
                          <circle cx="50%" cy="50%" r="80" fill="black" />
                        </mask>
                      </defs>
                      <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#crop-mask)" />
                      <circle cx="50%" cy="50%" r="80" stroke="white" strokeDasharray="4" strokeWidth="2" fill="none" />
                    </svg>
                  </div>

                  {/* Zoom slider */}
                  <div className="space-y-1 px-4">
                    <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      <span>Zoom de la imagen</span>
                      <span>{Math.round(cropZoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3.5"
                      step="0.02"
                      value={cropZoom}
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                    />
                  </div>

                  {/* Change Image Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setCropImageSrc(null);
                      const fileInput = document.getElementById('avatar-file-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-[10px] text-[#1A2732] hover:underline font-bold uppercase tracking-wider block mx-auto cursor-pointer border-0 bg-transparent"
                  >
                    ← Elegir otra imagen
                  </button>
                </div>
              ) : (
                /* Select file screen */
                <div className="space-y-4 py-4 animate-fade-in">
                  <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 transition-all rounded-xl p-6 text-center bg-neutral-50 relative group">
                    <input
                      id="avatar-file-upload"
                      type="file"
                      accept="image/*"
                      disabled={avatarUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
                          const fileExt = file.name.split('.').pop()?.toLowerCase();
                          const validExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
                          
                          if (!validTypes.includes(file.type) || !fileExt || !validExtensions.includes(fileExt)) {
                            alert("Por seguridad, solo se permiten formatos de imagen estándar (PNG, JPG, JPEG, WEBP, GIF).");
                            e.target.value = '';
                            return;
                          }

                          if (file.size > 5 * 1024 * 1024) {
                            alert("La imagen excede el límite de 5MB. Elija una imagen más pequeña.");
                            e.target.value = '';
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              const img = new window.Image();
                              img.src = event.target.result as string;
                              img.onload = () => {
                                setCropImageIsLandscape(img.naturalWidth > img.naturalHeight);
                                setCropImageSrc(event.target.result as string);
                                setCropZoom(1);
                                setCropPan({ x: 0, y: 0 });
                              };
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:opacity-0"
                    />
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-500 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-neutral-800">
                          {avatarUploading ? 'Procesando...' : 'Haz clic para seleccionar foto'}
                        </p>
                        <p className="text-[10px] text-neutral-400">PNG, JPG, JPEG o WEBP de hasta 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Current image info */}
                  {currentUser?.avatarUrl && (
                    <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl">
                      <img
                        referrerPolicy="no-referrer"
                        src={currentUser.avatarUrl}
                        alt="Avatar actual"
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[10px] text-neutral-500 leading-normal">Esta es tu foto de perfil activa. Puedes cambiarla subiendo una nueva arriba.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCropImageSrc(null);
                  setShowAvatarModal(false);
                }}
                className="text-xs h-8 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="text-xs bg-black text-white hover:bg-neutral-800 h-8 font-semibold disabled:opacity-50 cursor-pointer"
                disabled={avatarUploading || !cropImageSrc}
                onClick={performCropAndSave}
              >
                {avatarUploading ? 'Guardando...' : 'Guardar Foto'}
              </Button>
            </div>
          </div>
        </div>
      )}
            </div>
          </div>
        )
      }
    />
  </Routes>
      </React.Suspense>
      

  {isLoggedIn && isScreenLocked && (
    <div className="fixed inset-0 z-[9999] bg-neutral-955/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 text-white font-sans animate-fade-in" style={{ zIndex: 99999 }}>
      <div className="max-w-sm w-full text-center space-y-6 bg-neutral-900/90 p-8 rounded-3xl border border-neutral-800 shadow-2xl relative">
        {/* Lock Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative animate-bounce-subtle">
            <div className="w-20 h-20 rounded-full border-2 border-indigo-500/30 bg-neutral-950 flex items-center justify-center overflow-hidden shadow-2xl">
              {currentUser?.avatarUrl && !brokenAvatars[currentUser.avatarUrl] ? (
                <img 
                  referrerPolicy="no-referrer"
                  src={currentUser.avatarUrl} 
                  alt={currentUser.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold uppercase">{currentUser?.username?.charAt(0) || 'A'}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1.5 border border-neutral-950 shadow-md">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{currentUser?.username}</h3>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">{currentUser?.email}</p>
          </div>
        </div>

        {/* Lock Notice */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-950/40 rounded-full text-[9px] font-extrabold tracking-widest uppercase text-indigo-400 border border-indigo-900/30">
            Sesión Bloqueada
          </div>
          <p className="text-[11px] text-neutral-400 leading-normal max-w-xs mx-auto">
            Terminal de facturación inactiva. Ingrese su contraseña de acceso para reanudar operaciones.
          </p>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="space-y-4 max-w-xs mx-auto">
          <div className="space-y-1.5 text-left">
            <div className="relative">
              <input
                type={showUnlockPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full text-center text-xs h-10 px-3 pr-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-sans transition-all"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0 bg-transparent border-0 cursor-pointer"
              >
                {showUnlockPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {unlockError && (
              <p className="text-[10px] text-red-400 text-center font-semibold mt-1.5 leading-snug">{unlockError}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button 
              type="submit"
              disabled={isUnlocking}
              className="w-full text-xs h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md"
            >
              {isUnlocking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : 'Desbloquear Terminal'}
            </Button>
            
            <button
              type="button"
              onClick={async () => {
                try {
                  await insforge.auth.signOut();
                } catch (e) {
                  console.error('Error closing session', e);
                }
                setIsScreenLocked(false);
                setIsLoggedIn(false);
                setPasswordInput('');
                setUnlockError('');
              }}
              className="text-neutral-400 hover:text-red-400 text-xs font-semibold bg-transparent border-0 p-0 cursor-pointer pt-2"
            >
              Cerrar Sesión / Cambiar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
<Toaster position="top-right" richColors />
<AIAssistantWidget />
</>
);
}
