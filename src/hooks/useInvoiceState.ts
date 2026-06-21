import { useState, useEffect, useRef } from 'react';
import {
  AppNotification, Client, Product, Provider, Invoice, Receipt, NcfSequence, TemplateSettings, 
  UserPermission, SupportTicket, NcfType, InvoiceItem, PaymentMethod, Warehouse, 
  PurchaseOrder, FinancialAccount, Expense, ClientType, InvoiceType, InvoiceStatus,
  BankAccountItem, Shift, Seller, AuditLog, InventoryMovement, ExpensePayment, PurchaseOrderPayment
} from '../types';
import { 
  initialClients, initialInvoices, initialNcfSequences, initialProducts, 
  initialProviders, initialReceipts, defaultTemplateSettings, defaultUsers, 
  initialTickets, initialWarehouses, initialFinancialAccounts, initialPurchaseOrders 
} from '../dbSeed';
import { insforge } from '../lib/insforge';
import { useCatalogStore } from '../stores/useCatalogStore';
import { useFinanceStore } from '../stores/useFinanceStore';
import { useConfigStore } from '../stores/useConfigStore';
import { useCustomDialog } from '../components/ui/CustomDialogProvider';

// --- Database Mapping Helpers ---

const mapClientFromDb = (db: any): Client => ({
  id: db.id,
  type: db.type as ClientType,
  name: db.name,
  rncOrCedula: db.rnc_or_cedula,
  email: db.email,
  phone: db.phone,
  address: db.address,
  createdAt: db.created_at,
  dgiiVerified: db.dgii_verified,
  dgiiEstatus: db.dgii_estatus,
  dgiiRegimen: db.dgii_regimen,
  dgiiCategoria: db.dgii_categoria,
  dgiiActividad: db.dgii_actividad,
  dgiiProvincia: db.dgii_provincia,
  dgiiMunicipio: db.dgii_municipio
});

const mapClientToDb = (client: Client) => ({
  id: client.id,
  type: client.type,
  name: client.name,
  rnc_or_cedula: client.rncOrCedula || '',
  email: client.email || '',
  phone: client.phone || '',
  address: client.address || '',
  created_at: client.createdAt,
  dgii_verified: client.dgiiVerified || false,
  dgii_estatus: client.dgiiEstatus || null,
  dgii_regimen: client.dgiiRegimen || null,
  dgii_categoria: client.dgiiCategoria || null,
  dgii_actividad: client.dgiiActividad || null,
  dgii_provincia: client.dgiiProvincia || null,
  dgii_municipio: client.dgiiMunicipio || null,
  is_deleted: false
});

const mapProviderFromDb = (db: any): Provider => ({
  id: db.id,
  name: db.name,
  rnc: db.rnc,
  email: db.email,
  phone: db.phone,
  address: db.address,
  contactName: db.contact_name,
  createdAt: db.created_at,
  dgiiVerified: db.dgii_verified,
  dgiiEstatus: db.dgii_estatus,
  dgiiRegimen: db.dgii_regimen,
  dgiiCategoria: db.dgii_categoria,
  dgiiActividad: db.dgii_actividad,
  dgiiProvincia: db.dgii_provincia,
  dgiiMunicipio: db.dgii_municipio
});

const mapProviderToDb = (prov: Provider) => ({
  id: prov.id,
  name: prov.name,
  rnc: prov.rnc || '',
  email: prov.email || '',
  phone: prov.phone || '',
  address: prov.address || '',
  contact_name: prov.contactName || '',
  created_at: prov.createdAt,
  dgii_verified: prov.dgiiVerified || false,
  dgii_estatus: prov.dgiiEstatus || null,
  dgii_regimen: prov.dgiiRegimen || null,
  dgii_categoria: prov.dgiiCategoria || null,
  dgii_actividad: prov.dgiiActividad || null,
  dgii_provincia: prov.dgiiProvincia || null,
  dgii_municipio: prov.dgiiMunicipio || null,
  is_deleted: false
});

const mapProductFromDb = (db: any): Product => ({
  id: db.id,
  name: db.name,
  code: db.code,
  type: db.type as 'Producto' | 'Servicio',
  price: parseFloat(db.price || 0),
  cost: parseFloat(db.cost || 0),
  taxRate: parseFloat(db.tax_rate || 0),
  stock: parseInt(db.stock || 0),
  minStock: parseInt(db.min_stock || 0),
  providerId: db.provider_id || undefined,
  warehouseId: db.warehouse_id || undefined,
  imageUrl: db.image_url || undefined,
  category: db.category || undefined,
  createdAt: db.created_at
});

const mapProductToDb = (prod: Product) => ({
  id: prod.id,
  name: prod.name,
  code: prod.code,
  type: prod.type,
  price: prod.price,
  cost: prod.cost,
  tax_rate: prod.taxRate,
  stock: prod.stock,
  min_stock: prod.minStock,
  provider_id: prod.providerId || null,
  warehouse_id: prod.warehouseId || null,
  image_url: prod.imageUrl || null,
  category: prod.category || null,
  created_at: prod.createdAt,
  is_deleted: false
});

const mapInvoiceFromDb = (db: any, resolvedClients: Client[]): Invoice => {
  const client = resolvedClients.find(c => c.id === db.client_id) || {
    id: db.client_id,
    type: 'Fisica',
    name: 'Cliente de Consumo',
    rncOrCedula: '',
    email: '',
    phone: '',
    address: '',
    createdAt: new Date().toISOString()
  };

  const parsedItems = typeof db.items === 'string' ? JSON.parse(db.items) : db.items;


  return {
    id: db.id,
    invoiceNumber: db.invoice_number,
    type: db.type as InvoiceType,
    client,
    items: (parsedItems || []) as InvoiceItem[],
    subtotal: parseFloat(db.subtotal || 0),
    taxAmount: parseFloat(db.tax_amount || 0),
    total: parseFloat(db.total || 0),
    status: db.status as InvoiceStatus,
    ncfType: db.ncf_type as NcfType,
    ncf: db.ncf,
    sequenceNumber: parseInt(db.sequence_number || 0),
    paymentMethod: db.payment_method as PaymentMethod,
    notes: db.notes || undefined,
    originalQuoteId: db.original_quote_id || undefined,
    originalQuoteNo: db.original_quote_no || undefined,
    convertedToInvoiceId: db.converted_to_invoice_id || undefined,
    convertedToInvoiceNo: db.converted_to_invoice_no || undefined,
    createdAt: db.created_at,
    dueDate: db.due_date,
    sentByEmail: db.sent_by_email || false,
    currency: db.currency || 'DOP',
    paymentCondition: db.payment_condition || 'Contado',
    discountRate: parseFloat(db.discount_rate || 0),
    discountAmount: parseFloat(db.discount_amount || 0)
  };
};

const mapInvoiceToDb = (inv: Invoice) => ({
  id: inv.id,
  invoice_number: inv.invoiceNumber,
  type: inv.type,
  client_id: inv.client.id,
  items: inv.items,
  subtotal: inv.subtotal,
  tax_amount: inv.taxAmount,
  total: inv.total,
  status: inv.status,
  ncf_type: inv.ncfType,
  ncf: inv.ncf,
  sequence_number: inv.sequenceNumber,
  payment_method: inv.paymentMethod,
  notes: inv.notes || null,
  original_quote_id: inv.originalQuoteId || null,
  original_quote_no: inv.originalQuoteNo || null,
  converted_to_invoice_id: inv.convertedToInvoiceId || null,
  converted_to_invoice_no: inv.convertedToInvoiceNo || null,
  created_at: inv.createdAt,
  due_date: inv.dueDate,
  sent_by_email: inv.sentByEmail || false,
  currency: inv.currency || 'DOP',
  payment_condition: inv.paymentCondition || 'Contado',
  discount_rate: inv.discountRate || 0,
  discount_amount: inv.discountAmount || 0,
  is_deleted: false
});

const mapReceiptFromDb = (db: any): Receipt => ({
  id: db.id,
  receiptNumber: db.receipt_number,
  invoiceId: db.invoice_id,
  invoiceNumber: db.invoice_number,
  clientName: db.client_name,
  amountPaid: parseFloat(db.amount_paid || 0),
  paymentMethod: db.payment_method as PaymentMethod,
  date: db.date,
  notes: db.notes || undefined,
  accountId: db.account_id || undefined,
  accountName: db.account_name || undefined,
  retainedItbis: parseFloat(db.retained_itbis || 0) || undefined,
  retainedIsr: parseFloat(db.retained_isr || 0) || undefined,
  retentionNumber: db.retention_number || undefined
});

const mapReceiptToDb = (rec: Receipt) => ({
  id: rec.id,
  receipt_number: rec.receiptNumber,
  invoice_id: rec.invoiceId || null,
  invoice_number: rec.invoiceNumber,
  client_name: rec.clientName,
  amount_paid: rec.amountPaid,
  payment_method: rec.paymentMethod,
  date: rec.date,
  notes: rec.notes || null,
  account_id: rec.accountId || null,
  account_name: rec.accountName || null,
  retained_itbis: rec.retainedItbis || 0,
  retained_isr: rec.retainedIsr || 0,
  retention_number: rec.retentionNumber || null,
  is_deleted: false
});

const mapExpensePaymentFromDb = (db: any): ExpensePayment => ({
  id: db.id,
  expenseId: db.expense_id,
  expenseConcept: db.expense_concept,
  providerName: db.provider_name,
  amountPaid: parseFloat(db.amount_paid || 0),
  paymentMethod: db.payment_method as PaymentMethod,
  date: db.date,
  notes: db.notes || undefined,
  accountId: db.account_id || undefined,
  accountName: db.account_name || undefined
});

const mapExpensePaymentToDb = (ep: ExpensePayment) => ({
  id: ep.id,
  expense_id: ep.expenseId || null,
  expense_concept: ep.expenseConcept,
  provider_name: ep.providerName,
  amount_paid: ep.amountPaid,
  payment_method: ep.paymentMethod,
  date: ep.date,
  notes: ep.notes || null,
  account_id: ep.accountId || null,
  account_name: ep.accountName || null
});

const mapPurchaseOrderPaymentFromDb = (db: any): PurchaseOrderPayment => ({
  id: db.id,
  poId: db.po_id,
  poNumber: db.po_number,
  providerName: db.provider_name,
  amountPaid: parseFloat(db.amount_paid || 0),
  paymentMethod: db.payment_method as PaymentMethod,
  date: db.date,
  notes: db.notes || undefined,
  accountId: db.account_id || undefined,
  accountName: db.account_name || undefined
});

const mapPurchaseOrderPaymentToDb = (pop: PurchaseOrderPayment) => ({
  id: pop.id,
  po_id: pop.poId || null,
  po_number: pop.poNumber,
  provider_name: pop.providerName,
  amount_paid: pop.amountPaid,
  payment_method: pop.paymentMethod,
  date: pop.date,
  notes: pop.notes || null,
  account_id: pop.accountId || null,
  account_name: pop.accountName || null
});

const mapWarehouseFromDb = (db: any): Warehouse => ({
  id: db.id,
  name: db.name,
  code: db.code,
  location: db.location || undefined,
  phone: db.phone || undefined,
  manager: db.manager || undefined,
  isDefault: db.is_default || false,
  createdAt: db.created_at
});

const mapWarehouseToDb = (wh: Warehouse) => ({
  id: wh.id,
  name: wh.name,
  code: wh.code,
  location: wh.location || null,
  phone: wh.phone || null,
  manager: wh.manager || null,
  is_default: wh.isDefault || false,
  created_at: wh.createdAt,
  is_deleted: false
});

const mapFinancialAccountFromDb = (db: any): FinancialAccount => ({
  id: db.id,
  name: db.name,
  type: db.type as any,
  balance: parseFloat(db.balance || 0),
  accountNumber: db.account_number || undefined,
  bankName: db.bank_name || undefined,
  createdAt: db.created_at
});

const mapFinancialAccountToDb = (acc: FinancialAccount) => ({
  id: acc.id,
  name: acc.name,
  type: acc.type,
  balance: acc.balance,
  account_number: acc.accountNumber || null,
  bank_name: acc.bankName || null,
  created_at: acc.createdAt,
  is_deleted: false
});

const mapPurchaseOrderFromDb = (db: any): PurchaseOrder => ({
  id: db.id,
  poNumber: db.po_number,
  providerId: db.provider_id,
  providerName: db.provider_name,
  items: (typeof db.items === 'string' ? JSON.parse(db.items) : db.items) as any,
  subtotal: parseFloat(db.subtotal || 0),
  total: parseFloat(db.total || 0),
  status: db.status as any,
  createdAt: db.created_at,
  deliveryDate: db.delivery_date || undefined,
  notes: db.notes || undefined
});

const mapPurchaseOrderToDb = (po: PurchaseOrder) => ({
  id: po.id,
  po_number: po.poNumber,
  provider_id: po.providerId,
  provider_name: po.providerName,
  items: po.items,
  subtotal: po.subtotal,
  total: po.total,
  status: po.status,
  created_at: po.createdAt,
  delivery_date: po.deliveryDate || null,
  notes: po.notes || null,
  is_deleted: false
});

const mapExpenseFromDb = (db: any): Expense => ({
  id: db.id,
  providerRNC: db.provider_rnc,
  providerName: db.provider_name,
  ncf: db.ncf,
  concept: db.concept,
  amount: parseFloat(db.amount || 0),
  itbis: parseFloat(db.itbis || 0),
  itbisWithheld: db.itbis_withheld ? parseFloat(db.itbis_withheld) : undefined,
  isrWithheld: db.isr_withheld ? parseFloat(db.isr_withheld) : undefined,
  date: db.date,
  paymentMethod: db.payment_method as PaymentMethod,
  notes: db.notes || undefined
});

const mapExpenseToDb = (exp: Expense) => ({
  id: exp.id,
  provider_rnc: exp.providerRNC,
  provider_name: exp.providerName,
  ncf: exp.ncf,
  concept: exp.concept,
  amount: exp.amount,
  itbis: exp.itbis,
  itbis_withheld: exp.itbisWithheld || 0,
  isr_withheld: exp.isrWithheld || 0,
  date: exp.date,
  payment_method: exp.paymentMethod,
  notes: exp.notes || null,
  is_deleted: false
});

const mapShiftFromDb = (db: any): Shift => ({
  id: db.id,
  startTime: db.start_time,
  endTime: db.end_time || undefined,
  openingBalance: parseFloat(db.opening_balance || 0),
  closingBalanceExpected: db.closing_balance_expected ? parseFloat(db.closing_balance_expected) : undefined,
  closingBalanceActual: db.closing_balance_actual ? parseFloat(db.closing_balance_actual) : undefined,
  discrepancy: db.discrepancy ? parseFloat(db.discrepancy) : undefined,
  openedById: db.opened_by_id || undefined,
  openedByName: db.opened_by_name,
  closedById: db.closed_by_id || undefined,
  closedByName: db.closed_by_name || undefined,
  status: db.status as 'Abierto' | 'Cerrado',
  cajaId: db.caja_id || undefined
});

const mapShiftToDb = (sh: Shift) => ({
  id: sh.id,
  start_time: sh.startTime,
  end_time: sh.endTime || null,
  opening_balance: sh.openingBalance,
  closing_balance_expected: sh.closingBalanceExpected ?? null,
  closing_balance_actual: sh.closingBalanceActual ?? null,
  discrepancy: sh.discrepancy ?? null,
  opened_by_id: sh.openedById || null,
  opened_by_name: sh.openedByName,
  closed_by_id: sh.closedById || null,
  closed_by_name: sh.closedByName || null,
  status: sh.status,
  caja_id: sh.cajaId || null,
  is_deleted: false
});

// For UPDATE operations: excludes 'id' to avoid WITH CHECK policy violations when updating PK
const mapShiftUpdateToDb = (sh: Partial<Shift>) => ({
  end_time: sh.endTime || null,
  closing_balance_expected: sh.closingBalanceExpected ?? null,
  closing_balance_actual: sh.closingBalanceActual ?? null,
  discrepancy: sh.discrepancy ?? null,
  closed_by_id: sh.closedById || null,
  closed_by_name: sh.closedByName || null,
  status: sh.status || undefined,
  is_deleted: false
});

const mapNcfSequenceFromDb = (db: any): NcfSequence => ({
  type: db.type as NcfType,
  name: db.name,
  prefix: db.prefix,
  currentNumber: parseInt(db.current_number || 0),
  suffixLength: parseInt(db.suffix_length || 8),
  startNumber: db.start_number ? parseInt(db.start_number) : undefined,
  endNumber: db.end_number ? parseInt(db.end_number) : undefined
});

const mapNcfSequenceToDb = (ncf: NcfSequence) => ({
  type: ncf.type,
  name: ncf.name,
  prefix: ncf.prefix,
  current_number: ncf.currentNumber,
  suffix_length: ncf.suffixLength,
  start_number: ncf.startNumber || null,
  end_number: ncf.endNumber || null
});

const mapTemplateSettingsFromDb = (db: any): TemplateSettings => {
  let parsedAccounts: BankAccountItem[] = [];
  if (db.bank_account_name && db.bank_account_name.startsWith('[')) {
    try {
      parsedAccounts = JSON.parse(db.bank_account_name);
    } catch (e) {
      console.error('Error parsing bank accounts JSON', e);
    }
  } else if (db.bank_account_ref && db.bank_account_bank) {
    parsedAccounts = [{
      bank: db.bank_account_bank,
      number: db.bank_account_ref,
      type: db.bank_account_type || 'Corriente',
      holder: db.bank_account_name || db.business_name || '',
      currency: db.bank_account_currency && db.bank_account_currency !== 'true' && db.bank_account_currency !== 'false' ? db.bank_account_currency : 'DOP'
    }];
  }

  const showQuote = db.bank_account_currency === 'true';

  return {
    businessName: db.business_name,
    businessRNC: db.business_rnc,
    businessPhone: db.business_phone,
    businessEmail: db.business_email,
    businessAddress: db.business_address,
    logoUrl: db.logo_url || '',
    primaryColor: db.primary_color || '#000000',
    accentColor: db.accent_color || '#171717',
    footerNote: db.footer_note || '',
    pageSize: (db.page_size || 'Letter') as 'Letter' | 'Thermal',
    bankAccountName: db.bank_account_name || undefined,
    bankAccountRef: db.bank_account_ref || undefined,
    bankAccountType: db.bank_account_type || undefined,
    bankAccountCurrency: db.bank_account_currency || undefined,
    bankAccountBank: db.bank_account_bank || undefined,
    bankAccounts: parsedAccounts,
    showBankAccountsOnQuote: showQuote,
    templateStyle: db.template_style || 'Moderna',
    informalMode: !!db.informal_mode,
    showProductPhotos: !!db.show_product_photos
  };
};

const mapTemplateSettingsToDb = (s: TemplateSettings) => ({
  id: 'default',
  business_name: s.businessName,
  business_rnc: s.businessRNC,
  business_phone: s.businessPhone,
  business_email: s.businessEmail,
  business_address: s.businessAddress,
  logo_url: s.logoUrl || null,
  primary_color: s.primaryColor || '#000000',
  accent_color: s.accentColor || '#171717',
  footer_note: s.footerNote || null,
  page_size: s.pageSize || 'Letter',
  bank_account_name: s.bankAccounts ? JSON.stringify(s.bankAccounts) : (s.bankAccountName || null),
  bank_account_ref: s.bankAccounts && s.bankAccounts.length > 0 ? s.bankAccounts[0].number : (s.bankAccountRef || null),
  bank_account_type: s.bankAccounts && s.bankAccounts.length > 0 ? s.bankAccounts[0].type : (s.bankAccountType || null),
  bank_account_currency: s.showBankAccountsOnQuote ? 'true' : (s.bankAccounts && s.bankAccounts.length > 0 ? s.bankAccounts[0].currency : 'false'),
  bank_account_bank: s.bankAccounts && s.bankAccounts.length > 0 ? s.bankAccounts[0].bank : (s.bankAccountBank || null),
  template_style: s.templateStyle || 'Moderna',
  informal_mode: s.informalMode || false,
  show_product_photos: s.showProductPhotos || false
});

const mapSupportTicketFromDb = (db: any): SupportTicket => ({
  id: db.id,
  subject: db.subject,
  category: db.category as any,
  description: db.description,
  status: db.status as any,
  createdAt: db.created_at
});

const mapSupportTicketToDb = (t: SupportTicket) => ({
  id: t.id,
  subject: t.subject,
  category: t.category,
  description: t.description,
  status: t.status,
  created_at: t.createdAt
});

const mapSellerFromDb = (db: any): Seller => ({
  id: db.id,
  name: db.name,
  phone: db.phone || undefined,
  commissionRate: db.commission_rate ? parseFloat(db.commission_rate) : undefined,
  isActive: db.is_active ?? true,
  createdAt: db.created_at
});

const mapSellerToDb = (s: Seller) => ({
  id: s.id,
  name: s.name,
  phone: s.phone || null,
  commission_rate: s.commissionRate || 0,
  is_active: s.isActive,
  created_at: s.createdAt,
  is_deleted: false
});

// For UPDATE operations: excludes 'id' to avoid WITH CHECK policy violations when updating PK
const mapSellerUpdateToDb = (s: Partial<Seller>) => ({
  name: s.name,
  phone: s.phone || null,
  commission_rate: s.commissionRate || 0,
  is_active: s.isActive,
  is_deleted: false
});

const mapInventoryMovementFromDb = (db: any): InventoryMovement => ({
  id: db.id,
  productId: db.product_id,
  productName: db.product_name,
  type: db.type as 'Entrada' | 'Salida' | 'Ajuste',
  quantity: parseInt(db.quantity || 0),
  previousStock: parseInt(db.previous_stock || 0),
  newStock: parseInt(db.new_stock || 0),
  referenceType: db.reference_type || undefined,
  referenceId: db.reference_id || undefined,
  createdByName: db.created_by_name,
  notes: db.notes || undefined,
  createdAt: db.created_at
});

const mapInventoryMovementToDb = (mv: InventoryMovement) => ({
  id: mv.id,
  product_id: mv.productId,
  product_name: mv.productName,
  type: mv.type,
  quantity: mv.quantity,
  previous_stock: mv.previousStock,
  new_stock: mv.newStock,
  reference_type: mv.referenceType || null,
  reference_id: mv.referenceId || null,
  created_by_name: mv.createdByName,
  notes: mv.notes || null,
  created_at: mv.createdAt,
  is_deleted: false
});

export function useInvoiceState() {
  const { showConfirm, showAlert } = useCustomDialog();
  // --- Persistent States ---
  
  const clients = useCatalogStore(s => s.clients);
  const setClients = useCatalogStore(s => s.setClients);
  const products = useCatalogStore(s => s.products);
  const setProducts = useCatalogStore(s => s.setProducts);
      const providers = useCatalogStore(s => s.providers);
  const setProviders = useCatalogStore(s => s.setProviders);
  const setCatalogData = useCatalogStore(s => s.setCatalogData);

  
  
  const invoices = useFinanceStore(s => s.invoices);
  const setInvoices = useFinanceStore(s => s.setInvoices);
  const receipts = useFinanceStore(s => s.receipts);
  const setReceipts = useFinanceStore(s => s.setReceipts);
  const [ncfSequences, setNcfSequences] = useState<NcfSequence[]>([]);
  const _templateSettings = useConfigStore(s => s.templateSettings);
  const templateSettings = _templateSettings || defaultTemplateSettings;
  const setTemplateSettings = useConfigStore(s => s.setTemplateSettings);
  const _users = useConfigStore(s => s.users);
  const users = _users.length > 0 ? _users : defaultUsers;
  const setUsers = useConfigStore(s => s.setUsers);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const financialAccounts = useFinanceStore(s => s.financialAccounts);
  const setFinancialAccounts = useFinanceStore(s => s.setFinancialAccounts);
  const purchaseOrders = useFinanceStore(s => s.purchaseOrders);
  const setPurchaseOrders = useFinanceStore(s => s.setPurchaseOrders);
  const [purchaseOrderPayments, setPurchaseOrderPayments] = useState<PurchaseOrderPayment[]>([]);
  const expenses = useFinanceStore(s => s.expenses);
  const setExpenses = useFinanceStore(s => s.setExpenses);
  const [expensePayments, setExpensePayments] = useState<ExpensePayment[]>([]);
  const shifts = useFinanceStore(s => s.shifts);
  const setShifts = useFinanceStore(s => s.setShifts);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);
  
  // Active App States
  const [currentUser, setCurrentUser] = useState<UserPermission>(defaultUsers[0]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Cached real auth user ID â€” set once during auth check, used by all CRUD ops.
  // This avoids the race condition where React state (currentUser) still has
  // the stale default 'usr-1' ID when the user creates items right after login.
  const authUserIdRef = useRef<string>('default');

  /** Returns the DB prefix for the current authenticated user */
  const getDbPrefix = (): string => {
    const id = authUserIdRef.current;
    return id && id !== 'default' ? `${id}_` : '';
  };

  // Load from Postgres or seed/LocalStorage fallback
  
  const loadMoreInvoices = async () => {
    try {
      const currentLength = invoices.length;
      const { data: dbInvoices } = await insforge.database
        .from('invoices')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .range(currentLength, currentLength + 200 - 1);
        
      if (dbInvoices && dbInvoices.length > 0) {
        const currentUserId = authUserIdRef.current;
        const userInvoices = dbInvoices || [];
        if (userInvoices && userInvoices.length > 0) {
          const mapped = userInvoices.map(db => mapInvoiceFromDb(db, clients)).map(i => ({
            ...i,
            id: i.id.replace(currentUserId + '_', '')
          }));
          setInvoices((prev: Invoice[]) => {
            const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
            return [...prev, ...newItems];
          });
        }
      }
    } catch (e) {
      console.error("Error loading more invoices", e);
    }
  };

  
  const searchInvoices = async (query: string) => {
    if (!query || query.length < 2) return;
    try {
      const { data: dbInvoices } = await insforge.database
        .from('invoices')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .ilike('invoice_number', `%${query}%`)
        .limit(50);
        
      if (dbInvoices && dbInvoices.length > 0) {
        const mapped = dbInvoices.map(db => mapInvoiceFromDb(db, clients)).map(i => ({
          ...i,
          id: i.id.replace(getDbPrefix(), '')
        }));
        
        setInvoices((prev: Invoice[]) => {
          const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Error searching invoices", e);
    }
  };

  
  const searchReceipts = async (query: string) => {
    if (!query || query.length < 2) return;
    try {
      const { data: dbReceipts } = await insforge.database
        .from('receipts')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .ilike('receipt_number', `%${query}%`)
        .limit(50);
        
      if (dbReceipts && dbReceipts.length > 0) {
        const prefix = getDbPrefix();
        const mapped = dbReceipts.map(db => {
          return {
            id: db.id,
            receiptNumber: db.receipt_number,
            date: db.date,
            invoiceId: db.invoice_id || null,
            clientId: db.client_id,
            amountPaid: parseFloat(db.amount_paid || 0),
            paymentMethod: db.payment_method,
            notes: db.notes || '',
            createdAt: db.created_at,
            accountId: db.account_id || null,
            pdfUrl: db.pdf_url || null
          };
        }).map(r => ({
          ...r,
          id: r.id.replace(prefix, ''),
          clientId: r.clientId.replace(prefix, ''),
          invoiceId: r.invoiceId ? r.invoiceId.replace(prefix, '') : undefined,
          accountId: r.accountId ? r.accountId.replace(prefix, '') : undefined
        }));
        
        setReceipts((prev: any[]) => {
          const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Error searching receipts", e);
    }
  };

  const searchExpenses = async (query: string) => {
    if (!query || query.length < 2) return;
    try {
      const { data: dbExpenses } = await insforge.database
        .from('expenses')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .or(`expense_number.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(50);
        
      if (dbExpenses && dbExpenses.length > 0) {
        const prefix = getDbPrefix();
        const mapped = dbExpenses.map(db => {
          return {
            id: db.id,
            expenseNumber: db.expense_number,
            date: db.date,
            providerId: db.provider_id || null,
            description: db.description,
            amount: parseFloat(db.amount || 0),
            category: db.category,
            status: db.status || 'Pendiente',
            createdAt: db.created_at,
            receiptUrl: db.receipt_url || null,
            ncf: db.ncf || null
          };
        }).map(e => ({
          ...e,
          id: e.id.replace(prefix, ''),
          providerId: e.providerId ? e.providerId.replace(prefix, '') : undefined
        }));
        
        setExpenses((prev: any[]) => {
          const newItems = mapped.filter(m => !prev.some(p => p.id === m.id));
          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Error searching expenses", e);
    }
  };

  const loadAllDataFromPostgres = async () => {
    try {
      const { data: authData } = await insforge.auth.getCurrentUser();
      const currentUserId = authData?.user?.id || 'default';
      const userEmail = authData?.user?.email || '';
      const isRealUser = currentUserId !== 'default';

      // 1. Fetch template settings
      const { data: dbSettings } = await insforge.database.from('template_settings').select('*');
      const userSettings = dbSettings ? dbSettings.find(s => s.id === currentUserId) : null;
      let isNewUser = false;
      let finalSettings: TemplateSettings;
      if (userSettings) {
        finalSettings = mapTemplateSettingsFromDb(userSettings);
        setTemplateSettings(finalSettings);
        if (
          !userSettings.business_name || 
          userSettings.business_name === 'Mi Comercio Nuevo'
        ) {
          isNewUser = true;
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      } else {
        isNewUser = true;
        setNeedsOnboarding(true);
        
        // Create an unconfigured placeholder setting
        const placeholderSettings = {
          id: currentUserId,
          business_name: 'Mi Comercio Nuevo',
          business_rnc: '',
          business_phone: '',
          business_email: userEmail || 'correo@ejemplo.com',
          business_address: '',
          logo_url: '',
          primary_color: '#1A2732',
          accent_color: '#4f46e5',
          footer_note: 'Gracias por su preferencia.',
          page_size: 'Letter',
          bank_account_bank: '',
          bank_account_name: '',
          bank_account_ref: '',
          bank_account_type: 'Corriente',
          bank_account_currency: 'DOP',
          template_style: 'Moderna'
        };
        await insforge.database.from('template_settings').insert([placeholderSettings]);
        finalSettings = mapTemplateSettingsFromDb(placeholderSettings);
        setTemplateSettings(finalSettings);
      }
      localStorage.setItem('inv_settings', JSON.stringify(finalSettings));

      // 2. Fetch clients
      const { data: dbClients } = await insforge.database.from('clients').select('*').or('is_deleted.is.null,is_deleted.eq.false');
      let loadedClients: Client[] = [];
      const userClients = dbClients || [];
      if (userClients.length > 0) {
        loadedClients = userClients.map(mapClientFromDb).map(c => ({
          ...c,
          id: c.id.replace(`${currentUserId}_`, '')
        }));
        if (!loadedClients.some(c => c.id === 'cli-consumo')) {
          const consumptionClient: Client = {
            id: 'cli-consumo',
            type: 'Fisica',
            name: 'Cliente de Consumo (Público General)',
            rncOrCedula: '224-00125-4',
            email: 'consumidor@correo.com',
            phone: '809-555-5555',
            address: 'Público General, R.D.',
            createdAt: new Date().toISOString(),
            dgiiVerified: false,
          };
          const dbCli = mapClientToDb(consumptionClient);
          dbCli.id = `${currentUserId}_${consumptionClient.id}`;
          await insforge.database.from('clients').insert([dbCli]);
          loadedClients.push(consumptionClient);
        }
        setClients(loadedClients);
      } else {
        if (isRealUser) {
          // A real new user has no clients at start! Create a Consumption Client with prefix in db, clean in local state!
          const consumptionClient: Client = {
            id: 'cli-consumo',
            type: 'Fisica',
            name: 'Cliente de Consumo (PÃºblico General)',
            rncOrCedula: '224-00125-4',
            email: 'consumidor@correo.com',
            phone: '809-555-5555',
            address: 'PÃºblico General, R.D.',
            createdAt: new Date().toISOString(),
            dgiiVerified: false,
          };
          const dbCli = mapClientToDb(consumptionClient);
          dbCli.id = `${currentUserId}_${consumptionClient.id}`;
          await insforge.database.from('clients').insert([dbCli]);
          loadedClients = [consumptionClient];
          setClients(loadedClients);
        } else {
          const seedMapped = initialClients.map(mapClientToDb);
          await insforge.database.from('clients').insert(seedMapped);
          loadedClients = initialClients;
          setClients(initialClients);
        }
      }
      localStorage.setItem('inv_clients', JSON.stringify(loadedClients));

      // 3. Fetch NCF sequences
      const { data: dbNcf } = await insforge.database.from('ncf_sequences').select('*');
      const userNcf = dbNcf || [];
      let loadedNcfSequences = [];
      if (userNcf.length > 0) {
        loadedNcfSequences = userNcf.map(mapNcfSequenceFromDb).map(n => ({
          ...n,
          type: n.type.replace(`${currentUserId}_`, '') as any
        }));
        setNcfSequences(loadedNcfSequences);
      } else {
        if (isRealUser) {
          const defaultUserNcf = initialNcfSequences.map(seq => ({
            ...seq,
            type: `${currentUserId}_${seq.type}` as any
          }));
          await insforge.database.from('ncf_sequences').insert(defaultUserNcf.map(mapNcfSequenceToDb));
          loadedNcfSequences = initialNcfSequences;
          setNcfSequences(initialNcfSequences);
        } else {
          const seedNcfMapped = initialNcfSequences.map(mapNcfSequenceToDb);
          await insforge.database.from('ncf_sequences').insert(seedNcfMapped);
          loadedNcfSequences = initialNcfSequences;
          setNcfSequences(initialNcfSequences);
        }
      }
      localStorage.setItem('inv_ncf_seq', JSON.stringify(loadedNcfSequences));

      // 4. Fetch providers
      const { data: dbProviders } = await insforge.database.from('providers').select('*').or('is_deleted.is.null,is_deleted.eq.false');
      const userProviders = dbProviders || [];
      let loadedProviders = [];
      if (userProviders.length > 0) {
        loadedProviders = userProviders.map(mapProviderFromDb).map(p => ({
          ...p,
          id: p.id.replace(`${currentUserId}_`, '')
        }));
        setProviders(loadedProviders);
      } else {
        if (isRealUser) {
          loadedProviders = [];
          setProviders([]);
        } else {
          const seedProvidersMapped = initialProviders.map(mapProviderToDb);
          await insforge.database.from('providers').insert(seedProvidersMapped);
          loadedProviders = initialProviders;
          setProviders(initialProviders);
        }
      }
      localStorage.setItem('inv_providers', JSON.stringify(loadedProviders));

      // 5. Fetch warehouses
      const { data: dbWarehouses } = await insforge.database.from('warehouses').select('*').or('is_deleted.is.null,is_deleted.eq.false');
      const userWarehouses = dbWarehouses || [];
      let loadedWarehouses = [];
      if (userWarehouses.length > 0) {
        loadedWarehouses = userWarehouses.map(mapWarehouseFromDb).map(w => ({
          ...w,
          id: w.id.replace(`${currentUserId}_`, '')
        }));
        setWarehouses(loadedWarehouses);
      } else {
        if (isRealUser) {
          const defaultWh = {
            id: 'wh-default',
            name: 'AlmacÃ©n Principal',
            code: 'ALM-01',
            location: 'Santo Domingo',
            phone: '809-555-0199',
            manager: 'Administrador',
            is_default: true
          };
          const dbWh = { ...defaultWh, id: `${currentUserId}_${defaultWh.id}` };
          await insforge.database.from('warehouses').insert([dbWh]);
          loadedWarehouses = [mapWarehouseFromDb(defaultWh)];
          setWarehouses(loadedWarehouses);
        } else {
          const seedWhMapped = initialWarehouses.map(mapWarehouseToDb);
          await insforge.database.from('warehouses').insert(seedWhMapped);
          loadedWarehouses = initialWarehouses;
          setWarehouses(initialWarehouses);
        }
      }
      localStorage.setItem('inv_warehouses', JSON.stringify(loadedWarehouses));

      // 6. Fetch products
      const { data: dbProducts } = await insforge.database.from('products').select('*').or('is_deleted.is.null,is_deleted.eq.false');
      const userProducts = dbProducts || [];
      let loadedProducts = [];
      if (userProducts.length > 0) {
        loadedProducts = userProducts.map(mapProductFromDb).map(p => ({
          ...p,
          id: p.id.replace(`${currentUserId}_`, ''),
          providerId: p.providerId ? p.providerId.replace(`${currentUserId}_`, '') : undefined,
          warehouseId: p.warehouseId ? p.warehouseId.replace(`${currentUserId}_`, '') : undefined
        }));
        setProducts(loadedProducts);
      } else {
        if (isRealUser) {
          loadedProducts = [];
          setProducts([]);
        } else {
          const seedProdMapped = initialProducts.map(mapProductToDb);
          await insforge.database.from('products').insert(seedProdMapped);
          loadedProducts = initialProducts;
          setProducts(initialProducts);
        }
      }
      localStorage.setItem('inv_products', JSON.stringify(loadedProducts));

      // 7. Fetch financial accounts
      const { data: dbAccounts } = await insforge.database.from('financial_accounts').select('*').or('is_deleted.is.null,is_deleted.eq.false');
      const userAccounts = dbAccounts || [];
      let loadedAccounts = [];
      if (userAccounts.length > 0) {
        loadedAccounts = userAccounts.map(mapFinancialAccountFromDb).map(a => ({
          ...a,
          id: a.id.replace(`${currentUserId}_`, '')
        }));
        setFinancialAccounts(loadedAccounts);
      } else {
        if (isRealUser) {
          const defaultAccounts = [
            { id: 'acc-1', name: 'Caja General (Efectivo)', type: 'Caja' as any, balance: 0, account_number: 'N/A', bank_name: 'Efectivo', createdAt: new Date().toISOString() },
            { id: 'acc-2', name: 'Cuenta Operativa Popular', type: 'Banco' as any, balance: 0, account_number: '748596123', bank_name: 'Banco Popular', createdAt: new Date().toISOString() }
          ];
          await insforge.database.from('financial_accounts').insert(defaultAccounts.map(a => ({
            ...mapFinancialAccountToDb(a),
            id: `${currentUserId}_${a.id}`
          })));
          loadedAccounts = defaultAccounts;
          setFinancialAccounts(loadedAccounts);
        } else {
          const seedAccMapped = initialFinancialAccounts.map(mapFinancialAccountToDb);
          await insforge.database.from('financial_accounts').insert(seedAccMapped);
          loadedAccounts = initialFinancialAccounts;
          setFinancialAccounts(initialFinancialAccounts);
        }
      }
      localStorage.setItem('inv_accounts', JSON.stringify(loadedAccounts));

      // 8. Fetch invoices
      const { data: dbInvoices } = await insforge.database.from('invoices').select('*').or('is_deleted.is.null,is_deleted.eq.false').limit(200);
      const userInvoices = dbInvoices || [];
      let loadedInvoices = [];
      if (userInvoices && userInvoices.length > 0) {
        loadedInvoices = userInvoices.map(inv => {
          const cleaned = mapInvoiceFromDb(inv, loadedClients);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          if (cleaned.client) {
            cleaned.client.id = cleaned.client.id.replace(`${currentUserId}_`, '');
          }
          return cleaned;
        });
        setInvoices(loadedInvoices);
      } else {
        loadedInvoices = [];
        setInvoices([]);
      }
      localStorage.setItem('inv_invoices', JSON.stringify(loadedInvoices));

      // 9. Fetch receipts
      const { data: dbReceipts } = await insforge.database.from('receipts').select('*').or('is_deleted.is.null,is_deleted.eq.false').limit(200);
      const userReceipts = dbReceipts || [];
      let loadedReceipts = [];
      if (userReceipts.length > 0) {
        loadedReceipts = userReceipts.map(r => {
          const cleaned = mapReceiptFromDb(r);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          if (cleaned.invoiceId) {
            cleaned.invoiceId = cleaned.invoiceId.replace(`${currentUserId}_`, '');
          }
          return cleaned;
        });
        setReceipts(loadedReceipts);
      } else {
        loadedReceipts = [];
        setReceipts([]);
      }
      localStorage.setItem('inv_receipts', JSON.stringify(loadedReceipts));

      // 10. Fetch purchase orders
      const { data: dbPo } = await insforge.database.from('purchase_orders').select('*').or('is_deleted.is.null,is_deleted.eq.false').limit(200);
      const userPo = dbPo || [];
      let loadedPo = [];
      if (userPo.length > 0) {
        loadedPo = userPo.map(po => {
          const cleaned = mapPurchaseOrderFromDb(po);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          if (cleaned.providerId) {
            cleaned.providerId = cleaned.providerId.replace(`${currentUserId}_`, '');
          }
          return cleaned;
        });
        setPurchaseOrders(loadedPo);
      } else {
        loadedPo = [];
        setPurchaseOrders([]);
      }
      localStorage.setItem('inv_po', JSON.stringify(loadedPo));

      // 11. Fetch support tickets
      const { data: dbTickets } = await insforge.database.from('support_tickets').select('*');
      const userTickets = dbTickets || [];
      let loadedTickets = [];
      if (userTickets.length > 0) {
        loadedTickets = userTickets.map(t => {
          const cleaned = mapSupportTicketFromDb(t);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          return cleaned;
        });
        setTickets(loadedTickets);
      } else {
        loadedTickets = [];
        setTickets([]);
      }
      localStorage.setItem('inv_tickets', JSON.stringify(loadedTickets));

      // 12. Fetch expenses
      const { data: dbExpenses } = await insforge.database.from('expenses').select('*').or('is_deleted.is.null,is_deleted.eq.false').limit(200);
      const userExpenses = dbExpenses || [];
      let loadedExpenses = [];
      if (userExpenses.length > 0) {
        loadedExpenses = userExpenses.map(e => {
          const cleaned = mapExpenseFromDb(e);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          return cleaned;
        });
        setExpenses(loadedExpenses);
      } else {
        loadedExpenses = [];
        setExpenses([]);
      }
      localStorage.setItem('inv_expenses', JSON.stringify(loadedExpenses));

      // 12.1 Fetch expense payments
      const { data: dbExpensePayments } = await insforge.database.from('expense_payments').select('*').limit(200);
      const userExpensePayments = dbExpensePayments || [];
      let loadedExpensePayments: ExpensePayment[] = [];
      if (userExpensePayments.length > 0) {
        loadedExpensePayments = userExpensePayments.map(ep => {
          const cleaned = mapExpensePaymentFromDb(ep);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          cleaned.expenseId = cleaned.expenseId.replace(`${currentUserId}_`, '');
          return cleaned;
        });
        setExpensePayments(loadedExpensePayments);
      } else {
        setExpensePayments([]);
      }
      localStorage.setItem('inv_expense_payments', JSON.stringify(loadedExpensePayments));

      // 12.2 Fetch po payments
      const { data: dbPoPayments } = await insforge.database.from('purchase_order_payments').select('*').limit(200);
      const userPoPayments = dbPoPayments || [];
      let loadedPoPayments: PurchaseOrderPayment[] = [];
      if (userPoPayments.length > 0) {
        loadedPoPayments = userPoPayments.map(pop => {
          const cleaned = mapPurchaseOrderPaymentFromDb(pop);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          cleaned.poId = cleaned.poId.replace(`${currentUserId}_`, '');
          return cleaned;
        });
        setPurchaseOrderPayments(loadedPoPayments);
      } else {
        setPurchaseOrderPayments([]);
      }
      localStorage.setItem('inv_po_payments', JSON.stringify(loadedPoPayments));

      // 13. Fetch shifts
      const { data: dbShifts } = await insforge.database.from('shifts').select('*').or('is_deleted.is.null,is_deleted.eq.false').limit(200);
      const userShifts = dbShifts || [];
      let loadedShifts = [];
      if (userShifts.length > 0) {
        loadedShifts = userShifts.map(sh => {
          const cleaned = mapShiftFromDb(sh);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          return cleaned;
        });
        setShifts(loadedShifts);
        const active = loadedShifts.find(s => s.status === 'Abierto');
        setActiveShift(active || null);
      } else {
        loadedShifts = [];
        setShifts([]);
        setActiveShift(null);
      }
      localStorage.setItem('inv_shifts', JSON.stringify(loadedShifts));

      // 14. Fetch sellers from InsForge
      const { data: dbSellers } = await insforge.database.from('sellers').select('*').or('is_deleted.is.null,is_deleted.eq.false');
      const userSellers = dbSellers || [];
      let loadedSellers: Seller[] = [];
      const defaultSeller: Seller = {
        id: 'sel-admin-default',
        name: 'Administrador',
        phone: undefined,
        commissionRate: 0,
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
      };
      if (userSellers.length > 0) {
        loadedSellers = userSellers.map(s => {
          const cleaned = mapSellerFromDb(s);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          return cleaned;
        });
        if (!loadedSellers.some(s => s.id === 'sel-admin-default')) {
          loadedSellers.unshift(defaultSeller);
          const dbSel = mapSellerToDb(defaultSeller);
          dbSel.id = `${currentUserId}_${defaultSeller.id}`;
          await insforge.database.from('sellers').insert([dbSel]);
        }
        setSellers(loadedSellers);
      } else {
        if (isRealUser) {
          loadedSellers = [defaultSeller];
          const dbSel = mapSellerToDb(defaultSeller);
          dbSel.id = `${currentUserId}_${defaultSeller.id}`;
          await insforge.database.from('sellers').insert([dbSel]);
          setSellers(loadedSellers);
        } else {
          loadedSellers = [defaultSeller];
          setSellers(loadedSellers);
        }
      }
      localStorage.setItem('facturado_sellers', JSON.stringify(loadedSellers));

      // 15. Fetch inventory movements (Kardex) from InsForge
      const { data: dbMovements } = await insforge.database.from('inventory_movements').select('*').or('is_deleted.is.null,is_deleted.eq.false').limit(200);
      const userMovements = dbMovements || [];
      let loadedMovements: InventoryMovement[] = [];
      if (userMovements.length > 0) {
        loadedMovements = userMovements.map(m => {
          const cleaned = mapInventoryMovementFromDb(m);
          cleaned.id = cleaned.id.replace(`${currentUserId}_`, '');
          cleaned.productId = cleaned.productId.replace(`${currentUserId}_`, '');
          return cleaned;
        });
        setInventoryMovements(loadedMovements);
      } else {
        setInventoryMovements([]);
      }
      localStorage.setItem('facturado_kardex', JSON.stringify(loadedMovements));

      // 16. Fetch audit logs
      try {
        const { data: dbAudit } = await insforge.database.from('audit_logs')
          .select('*')
          .eq('user_id', currentUserId)
          .order('created_at', { ascending: false })
          .limit(200);
        if (dbAudit) {
          const mappedAudit = dbAudit.map((log: any) => ({
            id: log.id ? log.id.replace(`${currentUserId}_`, '') : '',
            action: log.action,
            entity: log.entity,
            entityId: log.entity_id ? log.entity_id.replace(`${currentUserId}_`, '') : '',
            details: log.details,
            userId: log.user_id ? log.user_id.replace(`${currentUserId}_`, '') : '',
            userName: log.user_name,
            createdAt: log.created_at
          }));
          setAuditLogs(mappedAudit);
        }
      } catch (logErr) {
        console.error('Failed to load audit logs', logErr);
      }

    } catch (err) {
      console.error('Failed to sync state with Postgres, falling back to local state', err);
    }
  };


  // Keep local storage loading logic intact for safety/fallback
  useEffect(() => {
    const initLocalStorage = () => {
      try {
        const storedClients = localStorage.getItem('inv_clients');
        const storedProducts = localStorage.getItem('inv_products');
        const storedProviders = localStorage.getItem('inv_providers');
        const storedInvoices = localStorage.getItem('inv_invoices');
        const storedReceipts = localStorage.getItem('inv_receipts');
        const storedNcf = localStorage.getItem('inv_ncf_seq');
        const storedSettings = localStorage.getItem('inv_settings');
        const storedUsers = localStorage.getItem('inv_users');
        const storedTickets = localStorage.getItem('inv_tickets');
        const storedActiveUser = localStorage.getItem('inv_active_user');
        const storedWarehouses = localStorage.getItem('inv_warehouses');
        const storedAccounts = localStorage.getItem('inv_accounts');
        const storedPurchaseOrders = localStorage.getItem('inv_po');
        const storedExpenses = localStorage.getItem('inv_expenses');
        const storedShifts = localStorage.getItem('inv_shifts');
        const storedSellers = localStorage.getItem('facturado_sellers');

        const isLoggedInCheck = localStorage.getItem('facturado_logged_in') === 'true';

        if (storedClients) {
          const parsed = JSON.parse(storedClients);
          if (!parsed.some((c: any) => c.id === 'cli-consumo')) {
            parsed.push({
              id: 'cli-consumo',
              type: 'Fisica',
              name: 'Cliente de Consumo (PÃºblico General)',
              rncOrCedula: '224-00125-4',
              email: 'consumidor@correo.com',
              phone: '809-555-5555',
              address: 'PÃºblico General, R.D.',
              createdAt: '2026-01-01T00:00:00Z',
            });
            localStorage.setItem('inv_clients', JSON.stringify(parsed));
          }
          setClients(parsed);
        } else { 
          const cleanClients = isLoggedInCheck ? [{
            id: 'cli-consumo',
            type: 'Fisica' as const,
            name: 'Cliente de Consumo (PÃºblico General)',
            rncOrCedula: '224-00125-4',
            email: 'consumidor@correo.com',
            phone: '809-555-5555',
            address: 'PÃºblico General, R.D.',
            createdAt: '2026-01-01T00:00:00Z',
            dgiiVerified: false
          }] : initialClients;
          setClients(cleanClients); 
          localStorage.setItem('inv_clients', JSON.stringify(cleanClients)); 
        }

        if (storedProducts) setProducts(JSON.parse(storedProducts));
        else { 
          const cleanProducts = isLoggedInCheck ? [] : initialProducts;
          setProducts(cleanProducts); 
          localStorage.setItem('inv_products', JSON.stringify(cleanProducts)); 
        }

        if (storedProviders) setProviders(JSON.parse(storedProviders));
        else { 
          const cleanProviders = isLoggedInCheck ? [] : initialProviders;
          setProviders(cleanProviders); 
          localStorage.setItem('inv_providers', JSON.stringify(cleanProviders)); 
        }

        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
        else { 
          const cleanInvoices = isLoggedInCheck ? [] : initialInvoices;
          setInvoices(cleanInvoices); 
          localStorage.setItem('inv_invoices', JSON.stringify(cleanInvoices)); 
        }

        if (storedReceipts) setReceipts(JSON.parse(storedReceipts));
        else { 
          const cleanReceipts = isLoggedInCheck ? [] : initialReceipts;
          setReceipts(cleanReceipts); 
          localStorage.setItem('inv_receipts', JSON.stringify(cleanReceipts)); 
        }

        if (storedNcf) setNcfSequences(JSON.parse(storedNcf));
        else { 
          setNcfSequences(initialNcfSequences); 
          localStorage.setItem('inv_ncf_seq', JSON.stringify(initialNcfSequences)); 
        }

        if (storedSettings) setTemplateSettings(JSON.parse(storedSettings));
        else { 
          setTemplateSettings(defaultTemplateSettings); 
          localStorage.setItem('inv_settings', JSON.stringify(defaultTemplateSettings)); 
        }

        if (storedUsers) setUsers(JSON.parse(storedUsers));
        else { 
          setUsers(defaultUsers); 
          localStorage.setItem('inv_users', JSON.stringify(defaultUsers)); 
        }

        if (storedTickets) setTickets(JSON.parse(storedTickets));
        else { 
          const cleanTickets = isLoggedInCheck ? [] : initialTickets;
          setTickets(cleanTickets); 
          localStorage.setItem('inv_tickets', JSON.stringify(cleanTickets)); 
        }

        if (storedWarehouses) setWarehouses(JSON.parse(storedWarehouses));
        else { 
          const cleanWarehouses = isLoggedInCheck ? [{
            id: 'wh-default',
            name: 'AlmacÃ©n Principal',
            code: 'ALM-01',
            location: 'Santo Domingo',
            phone: '809-555-0199',
            manager: 'Administrador',
            is_default: true,
            createdAt: new Date().toISOString()
          }] : initialWarehouses;
          setWarehouses(cleanWarehouses); 
          localStorage.setItem('inv_warehouses', JSON.stringify(cleanWarehouses)); 
        }

        if (storedAccounts) setFinancialAccounts(JSON.parse(storedAccounts));
        else { 
          const cleanAccounts = isLoggedInCheck ? [
            { id: 'acc-1', name: 'Caja General (Efectivo)', type: 'Caja' as any, balance: 0, account_number: 'N/A', bank_name: 'Efectivo', createdAt: new Date().toISOString() },
            { id: 'acc-2', name: 'Cuenta Operativa Popular', type: 'Banco' as any, balance: 0, account_number: '748596123', bank_name: 'Banco Popular', createdAt: new Date().toISOString() }
          ] : initialFinancialAccounts;
          setFinancialAccounts(cleanAccounts); 
          localStorage.setItem('inv_accounts', JSON.stringify(cleanAccounts)); 
        }

        if (storedPurchaseOrders) setPurchaseOrders(JSON.parse(storedPurchaseOrders));
        else { 
          const cleanPo = isLoggedInCheck ? [] : initialPurchaseOrders;
          setPurchaseOrders(cleanPo); 
          localStorage.setItem('inv_po', JSON.stringify(cleanPo)); 
        }

        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        } else {
          const cleanExpenses: Expense[] = isLoggedInCheck ? [] : [
            {
              id: 'exp-101',
              providerRNC: '131-10022-4',
              providerName: 'Distribuidora de EnergÃ­a del Este',
              ncf: 'B0100001254',
              concept: '02 - Gastos por Trabajos, Suministros y Servicios',
              amount: 14500,
              itbis: 2610,
              date: '2026-06-01',
              paymentMethod: 'Transferencia',
              notes: 'Servicio elÃ©ctrico correspondiente a Mayo 2026'
            },
            {
              id: 'exp-102',
              providerRNC: '101-01258-2',
              providerName: 'Oficinas Dominicanas S.A.',
              ncf: 'B0100000845',
              concept: '01 - Gastos de Personal',
              amount: 45000,
              itbis: 0,
              date: '2026-06-02',
              paymentMethod: 'Transferencia',
              notes: 'Alquiler mensual local comercial'
            }
          ];
          setExpenses(cleanExpenses);
          localStorage.setItem('inv_expenses', JSON.stringify(cleanExpenses));
        }

        if (storedShifts) {
          const parsed = JSON.parse(storedShifts);
          setShifts(parsed);
          const active = parsed.find((s: Shift) => s.status === 'Abierto');
          setActiveShift(active || null);
        } else {
          setShifts([]);
          setActiveShift(null);
          localStorage.setItem('inv_shifts', JSON.stringify([]));
        }

        // Load sellers with default "Administrador"
        const defaultSeller: Seller = {
          id: 'sel-admin-default',
          name: 'Administrador',
          phone: undefined,
          commissionRate: 0,
          isActive: true,
          createdAt: '2026-01-01T00:00:00Z',
        };
        if (storedSellers) {
          const parsedSellers = JSON.parse(storedSellers);
          // Ensure the default "Administrador" seller exists
          if (!parsedSellers.some((s: Seller) => s.id === 'sel-admin-default')) {
            parsedSellers.unshift(defaultSeller);
            localStorage.setItem('facturado_sellers', JSON.stringify(parsedSellers));
          }
          setSellers(parsedSellers);
        } else {
          const initialSellers = [defaultSeller];
          setSellers(initialSellers);
          localStorage.setItem('facturado_sellers', JSON.stringify(initialSellers));
        }

        const storedKardex = localStorage.getItem('facturado_kardex');
        if (storedKardex) {
          setInventoryMovements(JSON.parse(storedKardex));
        } else {
          setInventoryMovements([]);
        }

        if (storedActiveUser) {
          setCurrentUser(JSON.parse(storedActiveUser));
        } else {
          setCurrentUser(defaultUsers[0]);
        }
      } catch (err) {
        console.error('LocalStorage load failed', err);
      }
    };

    const checkAndSyncDb = async () => {
      try {
        if ((insforge.auth as any).authCallbackHandled) {
          await (insforge.auth as any).authCallbackHandled;
        }
        const { data: authData } = await insforge.auth.getCurrentUser();
        if (authData?.user) {
          // Set the ref IMMEDIATELY so all CRUD operations use the real UUID
          authUserIdRef.current = authData.user.id;
          localStorage.setItem('facturado_logged_in', 'true');
          await loadAllDataFromPostgres();
          
          let preservedAvatar = '';
          const storedUsersRaw = localStorage.getItem('inv_users');
          if (storedUsersRaw) {
            try {
              const parsed = JSON.parse(storedUsersRaw);
              const foundLocally = parsed.find((u: any) => u.id === authData.user.id || u.email === authData.user.email);
              if (foundLocally?.avatarUrl) {
                preservedAvatar = foundLocally.avatarUrl;
              }
            } catch (e) {}
          }

          const socialAvatar = authData.user.profile?.avatarUrl || 
                               (authData.user.profile as any)?.picture || 
                               (authData.user.profile as any)?.avatar_url || 
                               (authData.user as any).user_metadata?.avatar_url || 
                               (authData.user as any).user_metadata?.picture || 
                               preservedAvatar ||
                               '';
          const finalUser = {
            id: authData.user.id,
            username: authData.user.profile?.name || authData.user.email.split('@')[0],
            email: authData.user.email,
            avatarUrl: socialAvatar,
            role: 'Administrador' as const,
            permissions: {
              canCreateInvoice: true,
              canEditInvoice: true,
              canDeleteInvoice: true,
              canExportReports: true,
              canManageUsers: true
            }
          };
          setCurrentUser(finalUser);
          localStorage.setItem('inv_active_user', JSON.stringify(finalUser));

          // Clean up mock seed users & synchronize logged in user with the list
          let parsedUsers: any[] = [];
          if (storedUsersRaw) {
            try {
              parsedUsers = JSON.parse(storedUsersRaw);
            } catch (e) {}
          }
          
          // Remove the default static dummy profiles who were never explicitly created by this account
          parsedUsers = parsedUsers.filter((u: any) => 
            u.id !== 'usr-1' && 
            u.id !== 'usr-2' && 
            u.id !== 'usr-3' &&
            u.email !== 'ramon@sedomino.com.do' && 
            u.email !== 'auditoria@sedomino.com.do'
          );

          // Insert or update current active real user profile so they are displayed correctly
          const existingUserIndex = parsedUsers.findIndex((u: any) => u.id === finalUser.id || u.email === finalUser.email);
          if (existingUserIndex >= 0) {
            parsedUsers[existingUserIndex] = {
              ...parsedUsers[existingUserIndex],
              ...finalUser,
              avatarUrl: finalUser.avatarUrl || parsedUsers[existingUserIndex].avatarUrl
            };
          } else {
            parsedUsers.push(finalUser);
          }

          setUsers(parsedUsers);
          localStorage.setItem('inv_users', JSON.stringify(parsedUsers));
        } else {
          initLocalStorage();
        }
      } catch (err) {
        initLocalStorage();
      }
      setLoaded(true);
    };

    checkAndSyncDb();

    // SincronizaciÃ³n en tiempo real (Phase 5)
    insforge.realtime.subscribe('public-changes');
    insforge.realtime.on('postgres_changes', () => {
      // Cuando hay un cambio en la base de datos (insert, update, delete)
      // en cualquier tabla, recargamos los datos para sincronizar.
      loadAllDataFromPostgres();
    });

    return () => {
      insforge.realtime.unsubscribe('public-changes');
    };
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // --- Core Model Triggers ---

  // Clients
  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...clients, newClient];
    setClients(updated);
    saveToStorage('inv_clients', updated);

    const prefix = getDbPrefix();
    const dbClient = {
      ...mapClientToDb(newClient),
      id: `${prefix}${newClient.id}`
    };

    const { error } = await insforge.database.from('clients').insert([dbClient]);
    if (error) {
      console.error('Database insertion error', error);
      showAlert(`Error al guardar cliente en BD: ${error.message}`);
      const reverted = clients.filter(c => c.id !== newClient.id);
      setClients(reverted);
      saveToStorage('inv_clients', reverted);
    } else {
      logActivity('CREAR', 'clients', newClient.id, { name: newClient.name, rncOrCedula: newClient.rncOrCedula });
    }

    return newClient;
  };

  const updateClient = async (id: string, updatedFields: Partial<Client>) => {
    const originalClients = [...clients];
    const updated = clients.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    setClients(updated);
    saveToStorage('inv_clients', updated);

    const clientToUpdate = updated.find(c => c.id === id);
    if (clientToUpdate) {
      const prefix = getDbPrefix();
      const dbClient = {
        ...mapClientToDb(clientToUpdate),
        id: `${prefix}${clientToUpdate.id}`
      };
      const { error } = await insforge.database.from('clients').update(dbClient).eq('id', `${prefix}${id}`);
      if (error) {
        console.error('Database update error', error);
        showAlert(`Error al actualizar cliente en BD: ${error.message}`);
        setClients(originalClients);
        saveToStorage('inv_clients', originalClients);
      } else {
        logActivity('ACTUALIZAR', 'clients', id, updatedFields);
      }
    }
  };

  const deleteClient = async (id: string) => {
    const confirmed = await showConfirm("¿Estás seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    // Foreign key constraint check before DB call
    

    const originalClients = [...clients];
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    saveToStorage('inv_clients', updated);

    const prefix = getDbPrefix();
    const { error } = await insforge.database.from('clients').update({ is_deleted: true }).eq('id', `${prefix}${id}`);
    if (error) {
      console.error('Database deletion error', error);
      showAlert(`Error al eliminar cliente en BD: ${error.message}`);
      setClients(originalClients);
      saveToStorage('inv_clients', originalClients);
    } else {
      logActivity('ELIMINAR', 'clients', id);
    }
  };

  const importClientsBulk = (newClients: Omit<Client, 'id' | 'createdAt'>[]) => {
    const prepared = newClients.map((c, i) => ({
      ...c,
      id: `cli-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
    }));
    const updated = [...clients, ...prepared];
    setClients(updated);
    saveToStorage('inv_clients', updated);

    const prefix = getDbPrefix();
    const dbClientsList = prepared.map(c => ({
      ...mapClientToDb(c),
      id: `${prefix}${c.id}`
    }));

    insforge.database.from('clients').insert(dbClientsList).then(({ error }) => {
      if (error) console.error('Database insertion error', error);
    });
  };

  // Providers
  const addProvider = async (prov: Omit<Provider, 'id' | 'createdAt'>) => {
    const newProv: Provider = {
      ...prov,
      id: `prov-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...providers, newProv];
    setProviders(updated);
    saveToStorage('inv_providers', updated);

    const prefix = getDbPrefix();
    const dbProv = {
      ...mapProviderToDb(newProv),
      id: `${prefix}${newProv.id}`
    };

    const { error } = await insforge.database.from('providers').insert([dbProv]);
    if (error) {
      console.error('Database insertion error', error);
      showAlert(`Error al guardar proveedor en BD: ${error.message}`);
      const reverted = providers.filter(p => p.id !== newProv.id);
      setProviders(reverted);
      saveToStorage('inv_providers', reverted);
    } else {
      logActivity('CREAR', 'providers', newProv.id, { name: newProv.name, rnc: newProv.rnc });
    }

    return newProv;
  };

  const updateProvider = async (id: string, updatedFields: Partial<Provider>) => {
    const originalProviders = [...providers];
    const updated = providers.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProviders(updated);
    saveToStorage('inv_providers', updated);

    const providerToUpdate = updated.find(p => p.id === id);
    if (providerToUpdate) {
      const prefix = getDbPrefix();
      const dbProv = {
        ...mapProviderToDb(providerToUpdate),
        id: `${prefix}${providerToUpdate.id}`
      };
      const { error } = await insforge.database.from('providers').update(dbProv).eq('id', `${prefix}${id}`);
      if (error) {
        console.error('Database update error', error);
        showAlert(`Error al actualizar proveedor en BD: ${error.message}`);
        setProviders(originalProviders);
        saveToStorage('inv_providers', originalProviders);
      } else {
        logActivity('ACTUALIZAR', 'providers', id, updatedFields);
      }
    }
  };

  const deleteProvider = async (id: string) => {
    const confirmed = await showConfirm("¿Estás seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    const originalProviders = [...providers];
    const updated = providers.filter(p => p.id !== id);
    setProviders(updated);
    saveToStorage('inv_providers', updated);

    const prefix = getDbPrefix();
    const { error } = await insforge.database.from('providers').update({ is_deleted: true }).eq('id', `${prefix}${id}`);
    if (error) {
      console.error('Database deletion error', error);
      showAlert(`Error al eliminar proveedor en BD: ${error.message}`);
      setProviders(originalProviders);
      saveToStorage('inv_providers', originalProviders);
    } else {
      logActivity('ELIMINAR', 'providers', id);
    }
  };

  const importProvidersBulk = (newProvs: Omit<Provider, 'id' | 'createdAt'>[]) => {
    const prepared = newProvs.map((p, i) => ({
      ...p,
      id: `prov-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
    }));
    const updated = [...providers, ...prepared];
    setProviders(updated);
    saveToStorage('inv_providers', updated);

    const prefix = getDbPrefix();
    const dbProvsList = prepared.map(p => ({
      ...mapProviderToDb(p),
      id: `${prefix}${p.id}`
    }));

    insforge.database.from('providers').insert(dbProvsList).then(({ error }) => {
      if (error) console.error('Database insertion error', error);
    });
  };

  // Products
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveToStorage('inv_products', updated);

    const prefix = getDbPrefix();
    const dbProduct = {
      ...mapProductToDb(newProduct),
      id: `${prefix}${newProduct.id}`,
      provider_id: newProduct.providerId ? `${prefix}${newProduct.providerId}` : null,
      warehouse_id: newProduct.warehouseId ? `${prefix}${newProduct.warehouseId}` : null,
    };

    const { error } = await insforge.database.from('products').insert([dbProduct]);
    if (error) {
      console.error('Database insertion error', error);
      showAlert(`Error al guardar producto en BD: ${error.message}`);
      const reverted = products.filter(p => p.id !== newProduct.id);
      setProducts(reverted);
      saveToStorage('inv_products', reverted);
    } else {
      logActivity('CREAR', 'products', newProduct.id, { name: newProduct.name, price: newProduct.price });
    }

    return newProduct;
  };

  const addInventoryMovement = (
    productId: string,
    type: 'Entrada' | 'Salida' | 'Ajuste',
    quantity: number,
    previousStock: number,
    newStock: number,
    referenceType?: 'Venta' | 'Compra' | 'Manual' | 'Ajuste',
    referenceId?: string,
    notes?: string
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newMv: InventoryMovement = {
      id: `mv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName: product.name,
      type,
      quantity,
      previousStock,
      newStock,
      referenceType,
      referenceId,
      createdByName: currentUser?.username || 'Administrador',
      notes,
      createdAt: new Date().toISOString()
    };

    setInventoryMovements(current => {
      const updated = [newMv, ...current];
      saveToStorage('facturado_kardex', updated);
      return updated;
    });

    const prefix = getDbPrefix();
    const dbMv = {
      ...newMv,
      id: `${prefix}${newMv.id}`,
      productId: `${prefix}${newMv.productId}`
    };

    insforge.database.from('inventory_movements').insert([mapInventoryMovementToDb(dbMv as any)]).then(({ error }) => {
      if (error) {
        console.error('Database inventory_movements insert error', error);
      }
    });
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const originalProducts = [...products];
    const originalProduct = originalProducts.find(p => p.id === id);

    if (updatedFields.stock !== undefined && originalProduct && originalProduct.stock !== updatedFields.stock) {
      const diff = updatedFields.stock - originalProduct.stock;
      const type = diff > 0 ? 'Entrada' : 'Salida';
      const notes = (updatedFields as any).notes || (diff > 0 ? 'Ajuste manual de stock (Entrada)' : 'Ajuste manual de stock (Salida)');
      
      addInventoryMovement(
        id,
        type,
        Math.abs(diff),
        originalProduct.stock,
        updatedFields.stock,
        'Manual',
        undefined,
        notes
      );
    }

    const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProducts(updated);
    saveToStorage('inv_products', updated);

    const productToUpdate = updated.find(p => p.id === id);
    if (productToUpdate) {
      const prefix = getDbPrefix();
      const dbProduct = {
        ...mapProductToDb(productToUpdate),
        id: `${prefix}${productToUpdate.id}`,
        provider_id: productToUpdate.providerId ? `${prefix}${productToUpdate.providerId}` : null,
        warehouse_id: productToUpdate.warehouseId ? `${prefix}${productToUpdate.warehouseId}` : null,
      };
      const { error } = await insforge.database.from('products').update(dbProduct).eq('id', `${prefix}${id}`);
      if (error) {
        console.error('Database update error', error);
        showAlert(`Error al actualizar producto en BD: ${error.message}`);
        setProducts(originalProducts);
        saveToStorage('inv_products', originalProducts);
      } else {
        logActivity('ACTUALIZAR', 'products', id, updatedFields);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmed = await showConfirm("¿Estás seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    const originalProducts = [...products];
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveToStorage('inv_products', updated);

    const prefix = getDbPrefix();
    const { error } = await insforge.database.from('products').update({ is_deleted: true }).eq('id', `${prefix}${id}`);
    if (error) {
      console.error('Database deletion error', error);
      showAlert(`Error al eliminar producto en BD: ${error.message}`);
      setProducts(originalProducts);
      saveToStorage('inv_products', originalProducts);
    } else {
      logActivity('ELIMINAR', 'products', id);
    }
  };

  const importProductsBulk = (newProducts: Omit<Product, 'id' | 'createdAt'>[]) => {
    const prepared = newProducts.map((p, i) => ({
      ...p,
      id: `prod-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
    }));
    const updated = [...products, ...prepared];
    setProducts(updated);
    saveToStorage('inv_products', updated);

    const prefix = getDbPrefix();
    const dbProductsList = prepared.map(p => ({
      ...mapProductToDb(p),
      id: `${prefix}${p.id}`,
      provider_id: p.providerId ? `${prefix}${p.providerId}` : null,
      warehouse_id: p.warehouseId ? `${prefix}${p.warehouseId}` : null,
    }));

    insforge.database.from('products').insert(dbProductsList).then(({ error }) => {
      if (error) console.error('Database insertion error', error);
    });
  };

  // NCF Sequence Handler (Generates exact alphanumeric string)
  const generateNcfString = (type: NcfType, seqNumber: number) => {
    if (type === 'SIN') return 'SIN_COMPROBANTE';
    // In informal mode, generate internal sequential number (e.g. 003718)
    if (templateSettings.informalMode) return String(seqNumber).padStart(6, '0');
    const numStr = String(seqNumber).padStart(8, '0');
    return `${type}${numStr}`;
  };

  // Invoices & Quotes
  const createInvoiceOrQuote = (data: {
    type: 'Factura' | 'Cotizacion';
    client?: Client;
    clientId?: string;
    items: any[];
    paymentMethod?: PaymentMethod;
    ncfType?: NcfType;
    customSequenceNumber?: number;
    notes?: string;
    dueDate?: string;
    originalQuoteId?: string;
    originalQuoteNo?: string;
    status?: InvoiceStatus;
    isDraft?: boolean;
  }) => {
    const isQuote = data.type === 'Cotizacion';
    
    let resolvedClient = data.client;
    if (!resolvedClient && data.clientId) {
      resolvedClient = clients.find(c => c.id === data.clientId);
    }
    if (!resolvedClient) {
      resolvedClient = clients[0] || {
        id: 'cli-default',
        type: 'Fisica',
        name: 'Consumidor Final',
        rncOrCedula: '224-0012345-6',
        email: 'consumidor@correo.com',
        phone: '809-555-5555',
        address: 'R.D.',
        createdAt: new Date().toISOString()
      };
    }

    const resolvedNcfType = isQuote ? 'SIN' : (data.ncfType || 'B02');
    const resolvedPaymentMethod = data.paymentMethod || 'Efectivo';

    let selectedSequenceNumber = 0;
    let computedNcf = '';

    if (!isQuote) {
      if (data.customSequenceNumber !== undefined) {
        selectedSequenceNumber = data.customSequenceNumber;
        computedNcf = generateNcfString(resolvedNcfType, selectedSequenceNumber);
      } else {
        const seqIndex = ncfSequences.findIndex(s => s.type === resolvedNcfType);
        if (seqIndex !== -1) {
          const seq = ncfSequences[seqIndex];
          let nextSeq = seq.currentNumber + 1;
          
          if (seq.startNumber !== undefined && nextSeq < seq.startNumber) {
            nextSeq = seq.startNumber;
          }

          if (seq.endNumber !== undefined && nextSeq > seq.endNumber) {
            console.warn(`Alerta de LÃ­mite NCF: El consecuente nÃºmero ${nextSeq} para el comprobante ${resolvedNcfType} excede el rango lÃ­mite asignado (${seq.endNumber}).`);
          }

          selectedSequenceNumber = nextSeq;
          computedNcf = generateNcfString(resolvedNcfType, nextSeq);

          const updatedNcfSeq = [...ncfSequences];
          updatedNcfSeq[seqIndex].currentNumber = nextSeq;
          setNcfSequences(updatedNcfSeq);
          saveToStorage('inv_ncf_seq', updatedNcfSeq);

          const ncfPrefix = getDbPrefix();
          insforge.database.from('ncf_sequences').update({ current_number: nextSeq }).eq('type', `${ncfPrefix}${resolvedNcfType}`).then(({ error }) => {
            if (error) console.error('Database sequence error', error);
          });
        } else {
          selectedSequenceNumber = 1;
          computedNcf = generateNcfString(resolvedNcfType, 1);
        }
      }
    } else {
      computedNcf = 'COTIZACIÃ“N';
    }

    const resolvedItems: InvoiceItem[] = data.items.map(item => {
      const name = item.name || item.productName || 'Producto/Servicio';
      const price = item.price ?? 0;
      const quantity = item.quantity ?? 1;
      const taxRate = item.taxRate ?? 18;
      const discount = item.discount ?? 0;
      
      const suball = (price * quantity) * (1 - discount / 100);
      const taxAmount = item.taxAmount ?? parseFloat((suball * (taxRate / 100)).toFixed(2));
      const total = item.total ?? parseFloat((suball + taxAmount).toFixed(2));
      
      return {
        productId: item.productId,
        name,
        price,
        quantity,
        taxRate,
        taxAmount,
        total,
        discount
      };
    });

    const subtotalSum = resolvedItems.reduce((acc, item) => acc + ((item.price * item.quantity) * (1 - (item.discount || 0) / 100)), 0);
    const taxSum = resolvedItems.reduce((acc, item) => acc + item.taxAmount, 0);
    const discountRate = (data as any).discountRate ?? 0;
    const computedDiscountAmount = parseFloat((subtotalSum * (discountRate / 100)).toFixed(2));
    
    const subtotal = parseFloat((subtotalSum - computedDiscountAmount).toFixed(2));
    const taxAmount = parseFloat((taxSum * (1 - discountRate / 100)).toFixed(2));
    const total = parseFloat((subtotal + taxAmount).toFixed(2));

    // Use max sequence from existing docs to avoid numbering collisions after deletions
    const existingDocs = invoices.filter(inv => inv.type === data.type);
    const maxExistingNumber = existingDocs.reduce((max, inv) => {
      const match = inv.invoiceNumber?.match(/-(\d{4})$/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    const count = maxExistingNumber + 1;
    const docPrefix = isQuote ? 'COT' : 'FAC';
    const docNumber = templateSettings.informalMode
      ? `${docPrefix}-${String(count).padStart(6, '0')}`
      : `${docPrefix}-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;

    const currentYear = new Date().getFullYear();
    let computedDueDate = data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    if (data.type === 'Factura' && (resolvedNcfType === 'B01' || resolvedNcfType === 'B02')) {
      computedDueDate = `${currentYear}-12-31T23:59:59.000Z`;
    }

    const newDoc: Invoice = {
      id: `doc-${Date.now()}`,
      invoiceNumber: docNumber,
      type: data.type,
      client: resolvedClient,
      items: resolvedItems,
      subtotal,
      taxAmount,
      total,
      status: data.status || 'Pendiente',
      ncfType: resolvedNcfType,
      ncf: computedNcf,
      sequenceNumber: selectedSequenceNumber,
      paymentMethod: resolvedPaymentMethod,
      notes: data.notes,
      createdAt: (data as any).createdAt || new Date().toISOString(),
      dueDate: computedDueDate,
      originalQuoteId: data.originalQuoteId,
      originalQuoteNo: data.originalQuoteNo,
      currency: (data as any).currency || 'DOP',
      paymentCondition: (data as any).paymentCondition || 'Contado',
      discountRate,
      discountAmount: computedDiscountAmount,
    };

    if (!isQuote && data.status !== 'Borrador') {
      let updatedProducts = [...products];
      const prefix = getDbPrefix();

      resolvedItems.forEach(itemOrdered => {
        const prodIndex = updatedProducts.findIndex(p => p.id === itemOrdered.productId);
        if (prodIndex === -1) return;
        
        let prod = { ...updatedProducts[prodIndex] };
        
        if (prod.type === 'Producto') {
          // If it's a Kit, deduct components
          if (prod.isKit && prod.kitItems && prod.kitItems.length > 0) {
            prod.kitItems.forEach(ki => {
              const compIndex = updatedProducts.findIndex(p => p.id === ki.productId);
              if (compIndex !== -1) {
                let comp = { ...updatedProducts[compIndex] };
                const qtyToDeduct = ki.quantity * itemOrdered.quantity;
                const newStock = Math.max(0, comp.stock - qtyToDeduct);
                
                insforge.database.from('products').update({ stock: newStock }).eq('id', `${prefix}${comp.id}`).then(({ error }) => {
                  if (error) console.error('Kit Component update error', error);
                });
                
                addInventoryMovement(comp.id, 'Salida', qtyToDeduct, comp.stock, newStock, 'Venta', newDoc.id, `Venta Kit ${prod.name} (Factura ${newDoc.invoiceNumber})`);
                comp.stock = newStock;
                updatedProducts[compIndex] = comp;
              }
            });
          }

          // Deduct from Batches (FIFO)
          let remainingToDeduct = itemOrdered.quantity;
          let newBatches = [...(prod.batches || [])];
          if (newBatches.length > 0) {
            newBatches.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
            for (let i = 0; i < newBatches.length; i++) {
              if (remainingToDeduct <= 0) break;
              if (newBatches[i].stock > 0) {
                const deduction = Math.min(newBatches[i].stock, remainingToDeduct);
                newBatches[i].stock -= deduction;
                remainingToDeduct -= deduction;
              }
            }
          }
          
          // Deduct main stock
          const newStock = Math.max(0, prod.stock - itemOrdered.quantity);
          
          const updates: any = { stock: newStock };
          if(newBatches.length > 0) {
            updates.batches = newBatches;
          }

          insforge.database.from('products').update(updates).eq('id', `${prefix}${prod.id}`).then(({ error }) => {
            if (error) console.error('Database stock update error', error);
          });

          addInventoryMovement(prod.id, 'Salida', itemOrdered.quantity, prod.stock, newStock, 'Venta', newDoc.id, `Venta facturada bajo No. ${newDoc.invoiceNumber}`);

          prod.stock = newStock;
          prod.batches = newBatches;
          updatedProducts[prodIndex] = prod;
        }
      });
      
      setProducts(updatedProducts);
      saveToStorage('inv_products', updatedProducts);
    }

    const updatedInvoices = [newDoc, ...invoices];
    setInvoices(updatedInvoices);
    saveToStorage('inv_invoices', updatedInvoices);

    const prefix = getDbPrefix();
    const dbDoc = {
      ...newDoc,
      id: `${prefix}${newDoc.id}`,
    };
    if (dbDoc.client) {
      dbDoc.client = {
        ...dbDoc.client,
        id: `${prefix}${dbDoc.client.id}`
      };
    }
    insforge.database.from('invoices').insert([mapInvoiceToDb(dbDoc)]).then(({ error }) => {
      if (error) {
        console.error('Database insertion error', error);
        showAlert(`Error al generar factura en BD: ${error.message}`);
        setInvoices(current => {
          const reverted = current.filter(i => i.id !== newDoc.id);
          saveToStorage('inv_invoices', reverted);
          return reverted;
        });
      } else {
        logActivity('CREAR', 'invoices', newDoc.id, { number: newDoc.invoiceNumber, total: newDoc.total, type: newDoc.type });
      }
    });

    return newDoc;
  };

  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    const previous = invoices.find(inv => inv.id === id);
    const updated = invoices.map(inv => {
      if (inv.id === id) {
        const newInvoice = { ...inv, ...updatedFields };
        if (updatedFields.items) {
          const subtotal = updatedFields.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
          const taxAmount = updatedFields.items.reduce((acc, item) => acc + item.taxAmount, 0);
          const total = subtotal + taxAmount;
          newInvoice.subtotal = subtotal;
          newInvoice.taxAmount = taxAmount;
          newInvoice.total = total;
        }
        return newInvoice;
      }
      return inv;
    });

    if (previous && previous.type === 'Factura' && updatedFields.items) {
      let tempProducts = [...products];
      const prefix = getDbPrefix();
      previous.items.forEach(itm => {
        tempProducts = tempProducts.map(p => {
          if (p.id === itm.productId) {
            const newStock = p.stock + itm.quantity;
            insforge.database.from('products').update({ stock: newStock }).eq('id', `${prefix}${p.id}`).then(({ error }) => {
              if (error) console.error(error);
            });
            return { ...p, stock: newStock };
          }
          return p;
        });
      });
      updatedFields.items.forEach(itm => {
        tempProducts = tempProducts.map(p => {
          if (p.id === itm.productId) {
            const newStock = Math.max(0, p.stock - itm.quantity);
            insforge.database.from('products').update({ stock: newStock }).eq('id', `${prefix}${p.id}`).then(({ error }) => {
              if (error) console.error(error);
            });
            return { ...p, stock: newStock };
          }
          return p;
        });
      });
      setProducts(tempProducts);
      saveToStorage('inv_products', tempProducts);
    }

    setInvoices(updated);
    saveToStorage('inv_invoices', updated);

    const docToUpdate = updated.find(inv => inv.id === id);
    if (docToUpdate) {
      const prefix = getDbPrefix();
      const dbDoc = {
        ...docToUpdate,
        id: `${prefix}${docToUpdate.id}`,
      };
      if (dbDoc.client) {
        dbDoc.client = {
          ...dbDoc.client,
          id: `${prefix}${dbDoc.client.id}`
        };
      }
      insforge.database.from('invoices').update(mapInvoiceToDb(dbDoc)).eq('id', `${prefix}${id}`).then(({ error }) => {
        if (error) {
          console.error('Database update error', error);
          showAlert(`Error al actualizar factura en BD: ${error.message}`);
          setInvoices(current => {
            const reverted = current.map(inv => inv.id === id ? (previous || inv) : inv);
            saveToStorage('inv_invoices', reverted);
            return reverted;
          });
        } else {
          logActivity('ACTUALIZAR', 'invoices', id, updatedFields);
        }
      });
    }
  };

  const deleteInvoice = async (id: string) => {
    const confirmed = await showConfirm("Â¿EstÃ¡s seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    const target = invoices.find(inv => inv.id === id);
    if (!target) return;

    if (target.type === 'Factura' && target.status !== 'Anulada') {
      const prefix = getDbPrefix();
      const updatedProducts = products.map(prod => {
        const itemOrdered = target.items.find(it => it.productId === prod.id);
        if (itemOrdered && prod.type === 'Producto') {
          const newStock = prod.stock + itemOrdered.quantity;
          insforge.database.from('products').update({ stock: newStock }).eq('id', `${prefix}${prod.id}`).then(({ error }) => {
            if (error) console.error(error);
          });
          return {
            ...prod,
            stock: newStock,
          };
        }
        return prod;
      });
      setProducts(updatedProducts);
      saveToStorage('inv_products', updatedProducts);
    }

    const updated = invoices.filter(inv => inv.id !== id);
    setInvoices(updated);
    saveToStorage('inv_invoices', updated);

    const prefix = getDbPrefix();
    insforge.database.from('invoices').update({ is_deleted: true }).eq('id', `${prefix}${id}`).then(({ error }) => {
      if (error) {
        console.error('Database deletion error', error);
        showAlert(`Error al eliminar factura en BD: ${error.message}`);
        setInvoices(current => {
          const reverted = [...current, target].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          saveToStorage('inv_invoices', reverted);
          return reverted;
        });
      } else {
        logActivity('ELIMINAR', 'invoices', id);
      }
    });
  };

  const convertQuoteToInvoice = (quoteId: string, ncfType: NcfType = 'B02') => {
    const quote = invoices.find(i => i.id === quoteId && i.type === 'Cotizacion');
    if (!quote) return null;

    const nInvoice = createInvoiceOrQuote({
      type: 'Factura',
      client: quote.client,
      items: quote.items,
      paymentMethod: quote.paymentMethod,
      ncfType: ncfType,
      notes: `Convertida de CotizaciÃ³n No. ${quote.invoiceNumber}. ${quote.notes || ''}`,
      originalQuoteId: quote.id,
      originalQuoteNo: quote.invoiceNumber,
    });

    if (nInvoice) {
      updateInvoice(quoteId, { 
        status: 'Pagada', 
        convertedToInvoiceId: nInvoice.id,
        convertedToInvoiceNo: nInvoice.invoiceNumber,
        notes: `${quote.notes || ''} (Convertida a factura ${nInvoice.invoiceNumber})` 
      });
    }

    return nInvoice;
  };

  const payInvoice = (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string, accountId?: string, retainedItbis?: number, retainedIsr?: number, retentionNumber?: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const previousPaid = receipts.filter(r => r.invoiceId === invoiceId).reduce((sum, r) => sum + r.amountPaid + (r.retainedItbis || 0) + (r.retainedIsr || 0), 0);
    const newTotalPaid = previousPaid + amount + (retainedItbis || 0) + (retainedIsr || 0);
    const newStatus = newTotalPaid >= (invoice.total - 0.1) 
      ? 'Pagada' 
      : newTotalPaid > 0 
        ? 'Parcial' 
        : 'Pendiente';

    updateInvoice(invoiceId, { status: newStatus });

    let selectedAccountName = '';
    if (accountId) {
      const accIndex = financialAccounts.findIndex(acc => acc.id === accountId);
      if (accIndex !== -1) {
        selectedAccountName = financialAccounts[accIndex].name;
        const updatedAccounts = [...financialAccounts];
        updatedAccounts[accIndex].balance = Number((updatedAccounts[accIndex].balance + amount).toFixed(2));
        setFinancialAccounts(updatedAccounts);
        saveToStorage('inv_accounts', updatedAccounts);

        const accPrefix = getDbPrefix();
        insforge.database.from('financial_accounts').update({ balance: updatedAccounts[accIndex].balance }).eq('id', `${accPrefix}${accountId}`).then(({ error }) => {
          if (error) console.error('Database update balance error', error);
        });
      }
    }

    // Use max sequence from existing receipts to avoid numbering collisions after deletions
    const maxReceiptNumber = receipts.reduce((max, r) => {
      const match = r.receiptNumber?.match(/-(\d{4})$/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    const receiptCount = maxReceiptNumber + 1;
    const newReceipt: Receipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: `REC-${new Date().getFullYear()}-${String(receiptCount).padStart(4, '0')}`,
      invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.name,
      amountPaid: amount,
      paymentMethod,
      accountId,
      accountName: selectedAccountName || undefined,
      date: new Date().toISOString(),
      notes,
      retainedItbis,
      retainedIsr,
      retentionNumber,
    };

    const updatedReceipts = [newReceipt, ...receipts];
    setReceipts(updatedReceipts);
    saveToStorage('inv_receipts', updatedReceipts);

    const prefix = getDbPrefix();
    const dbReceipt = {
      ...newReceipt,
      id: `${prefix}${newReceipt.id}`,
      invoiceId: newReceipt.invoiceId ? `${prefix}${newReceipt.invoiceId}` : null,
      accountId: newReceipt.accountId ? `${prefix}${newReceipt.accountId}` : null
    };
    insforge.database.from('receipts').insert([mapReceiptToDb(dbReceipt as any)]).then(({ error }) => {
      if (error) {
        console.error('Database receipts insert error', error);
      } else {
        logActivity('CREAR', 'receipts', newReceipt.id, { number: newReceipt.receiptNumber, amount: newReceipt.amountPaid, clientName: newReceipt.clientName });
      }
    });
  };

  // --- Warehouses CRUD ---
  const addWarehouse = (wh: Omit<Warehouse, 'id' | 'createdAt'>) => {
    const newWh: Warehouse = {
      ...wh,
      id: `wh-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...warehouses, newWh];
    setWarehouses(updated);
    saveToStorage('inv_warehouses', updated);

    const prefix = getDbPrefix();
    const dbWh = { ...newWh, id: `${prefix}${newWh.id}` };
    insforge.database.from('warehouses').insert([mapWarehouseToDb(dbWh)]).then(({ error }) => {
      if (error) {
        console.error('Database insertion error', error);
        showAlert(`Error al guardar almacÃ©n en BD: ${error.message}`);
        setWarehouses(current => {
          const reverted = current.filter(w => w.id !== newWh.id);
          saveToStorage('inv_warehouses', reverted);
          return reverted;
        });
      }
    });

    return newWh;
  };

  const updateWarehouse = (id: string, fields: Partial<Warehouse>) => {
    const updated = warehouses.map(w => w.id === id ? { ...w, ...fields } : w);
    setWarehouses(updated);
    saveToStorage('inv_warehouses', updated);

    const matchWh = updated.find(w => w.id === id);
    if (matchWh) {
      const prefix = getDbPrefix();
      const dbWh = { ...matchWh, id: `${prefix}${matchWh.id}` };
      insforge.database.from('warehouses').update(mapWarehouseToDb(dbWh)).eq('id', `${prefix}${id}`).then(({ error }) => {
        if (error) {
          console.error('Database update error', error);
          showAlert(`Error al actualizar almacÃ©n en BD: ${error.message}`);
          setWarehouses(current => {
            const reverted = current.map(w => w.id === id ? (warehouses.find(old => old.id === id) || w) : w);
            saveToStorage('inv_warehouses', reverted);
            return reverted;
          });
        }
      });
    }
  };

  const deleteWarehouse = async (id: string) => {
    const confirmed = await showConfirm("Â¿EstÃ¡s seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    const updated = warehouses.filter(w => w.id !== id);
    setWarehouses(updated);
    saveToStorage('inv_warehouses', updated);

    const prefix = getDbPrefix();
    const target = warehouses.find(w => w.id === id);
    insforge.database.from('warehouses').update({ is_deleted: true }).eq('id', `${prefix}${id}`).then(({ error }) => {
      if (error && target) {
        console.error('Database delete error', error);
        showAlert(`Error al eliminar almacÃ©n en BD: ${error.message}`);
        setWarehouses(current => {
          const reverted = [...current, target];
          saveToStorage('inv_warehouses', reverted);
          return reverted;
        });
      }
    });
  };

  // --- Financial Accounts CRUD ---
  const addFinancialAccount = (acc: Omit<FinancialAccount, 'id' | 'createdAt'>) => {
    const newAcc: FinancialAccount = {
      ...acc,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...financialAccounts, newAcc];
    setFinancialAccounts(updated);
    saveToStorage('inv_accounts', updated);

    const prefix = getDbPrefix();
    const dbAcc = { ...newAcc, id: `${prefix}${newAcc.id}` };
    insforge.database.from('financial_accounts').insert([mapFinancialAccountToDb(dbAcc)]).then(({ error }) => {
      if (error) {
        console.error('Database insertion error', error);
        showAlert(`Error al guardar cuenta financiera en BD: ${error.message}`);
        setFinancialAccounts((current: FinancialAccount[]) => {
          const reverted = current.filter(a => a.id !== newAcc.id);
          saveToStorage('inv_accounts', reverted);
          return reverted;
        });
      }
    });

    return newAcc;
  };

  const updateFinancialAccount = (id: string, fields: Partial<FinancialAccount>) => {
    const updated = financialAccounts.map(a => a.id === id ? { ...a, ...fields } : a);
    setFinancialAccounts(updated);
    saveToStorage('inv_accounts', updated);

    const matchAcc = updated.find(a => a.id === id);
    if (matchAcc) {
      const prefix = getDbPrefix();
      const dbAcc = { ...matchAcc, id: `${prefix}${matchAcc.id}` };
      insforge.database.from('financial_accounts').update(mapFinancialAccountToDb(dbAcc)).eq('id', `${prefix}${id}`).then(({ error }) => {
        if (error) {
          console.error('Database update error', error);
          showAlert(`Error al actualizar cuenta financiera en BD: ${error.message}`);
          setFinancialAccounts((current: FinancialAccount[]) => {
            const reverted = current.map(a => a.id === id ? (financialAccounts.find(old => old.id === id) || a) : a);
            saveToStorage('inv_accounts', reverted);
            return reverted;
          });
        }
      });
    }
  };

  const deleteFinancialAccount = async (id: string) => {
    const confirmed = await showConfirm("Â¿EstÃ¡s seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    const updated = financialAccounts.filter(a => a.id !== id);
    setFinancialAccounts(updated);
    saveToStorage('inv_accounts', updated);

    const prefix = getDbPrefix();
    const target = financialAccounts.find(a => a.id === id);
    insforge.database.from('financial_accounts').update({ is_deleted: true }).eq('id', `${prefix}${id}`).then(({ error }) => {
      if (error && target) {
        console.error('Database delete error', error);
        showAlert(`Error al eliminar cuenta financiera en BD: ${error.message}`);
        setFinancialAccounts((current: FinancialAccount[]) => {
          const reverted = [...current, target];
          saveToStorage('inv_accounts', reverted);
          return reverted;
        });
      }
    });
  };

  // --- Purchase Orders CRUD ---
  const createPurchaseOrder = (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'poNumber'>) => {
    const count = purchaseOrders.length + 1;
    const poNumber = `OC-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;
    const newPo: PurchaseOrder = {
      ...order,
      id: `po-${Date.now()}`,
      poNumber,
      createdAt: new Date().toISOString()
    };

    if (newPo.status === 'Recibida') {
      const prefix = getDbPrefix();
      const tempProducts = products.map(p => {
        const matchItem = newPo.items.find(itm => itm.productId === p.id);
        if (matchItem) {
          const newStock = p.stock + matchItem.quantity;
          insforge.database.from('products').update({ stock: newStock }).eq('id', `${prefix}${p.id}`).then(({ error }) => {
            if (error) console.error(error);
          });
          return { ...p, stock: newStock };
        }
        return p;
      });
      setProducts(tempProducts);
      saveToStorage('inv_products', tempProducts);
    }

    const updated = [newPo, ...purchaseOrders];
    setPurchaseOrders(updated);
    saveToStorage('inv_po', updated);

    const prefix = getDbPrefix();
    const dbPo = {
      ...newPo,
      id: `${prefix}${newPo.id}`,
      providerId: newPo.providerId ? `${prefix}${newPo.providerId}` : null
    };
    insforge.database.from('purchase_orders').insert([mapPurchaseOrderToDb(dbPo as any)]).then(({ error }) => {
      if (error) {
        console.error('Database insertion error', error);
        showAlert(`Error al guardar orden de compra en BD: ${error.message}`);
        setPurchaseOrders((current: PurchaseOrder[]) => {
          const reverted = current.filter(po => po.id !== newPo.id);
          saveToStorage('inv_po', reverted);
          return reverted;
        });
      }
    });

    return newPo;
  };

  const updatePurchaseOrder = (id: string, fields: Partial<PurchaseOrder>) => {
    const previous = purchaseOrders.find(po => po.id === id);
    const updated = purchaseOrders.map(po => {
      if (po.id === id) {
        const upPo = { ...po, ...fields };
        if (fields.items) {
          const subtotal = fields.items.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
          upPo.subtotal = subtotal;
          upPo.total = subtotal;
        }
        return upPo;
      }
      return po;
    });

    if (previous && previous.status !== 'Recibida' && fields.status === 'Recibida') {
      const targetPo = updated.find(po => po.id === id) || previous;
      const prefix = getDbPrefix();
      const tempProducts = products.map(p => {
        const matchItem = targetPo.items.find(itm => itm.productId === p.id);
        if (matchItem) {
          const newStock = p.stock + matchItem.quantity;
          insforge.database.from('products').update({ stock: newStock }).eq('id', `${prefix}${p.id}`).then(({ error }) => {
            if (error) console.error(error);
          });

          addInventoryMovement(
            p.id,
            'Entrada',
            matchItem.quantity,
            p.stock,
            newStock,
            'Compra',
            targetPo.id,
            `Compra recibida según Orden de Compra No. ${targetPo.poNumber}`
          );

          return { ...p, stock: newStock };
        }
        return p;
      });
      setProducts(tempProducts);
      saveToStorage('inv_products', tempProducts);
    }

    setPurchaseOrders(updated);
    saveToStorage('inv_po', updated);

    const matchPo = updated.find(po => po.id === id);
    if (matchPo) {
      const prefix = getDbPrefix();
      const dbPo = {
        ...matchPo,
        id: `${prefix}${matchPo.id}`,
        providerId: matchPo.providerId ? `${prefix}${matchPo.providerId}` : null
      };
      insforge.database.from('purchase_orders').update(mapPurchaseOrderToDb(dbPo as any)).eq('id', `${prefix}${id}`).then(({ error }) => {
        if (error) {
          console.error('Database update error', error);
          showAlert(`Error al actualizar orden de compra en BD: ${error.message}`);
          setPurchaseOrders((current: PurchaseOrder[]) => {
            const reverted = current.map(po => po.id === id ? (purchaseOrders.find(old => old.id === id) || po) : po);
            saveToStorage('inv_po', reverted);
            return reverted;
          });
        }
      });
    }
  };

  // Update Settings
  const saveTemplateSettings = (settings: TemplateSettings) => {
    setTemplateSettings(settings);
    saveToStorage('inv_settings', settings);

    const currentUserId = currentUser?.id || 'default';
    const dbSettings = { ...settings, id: currentUserId };
    insforge.database.from('template_settings').update(mapTemplateSettingsToDb(dbSettings as any)).eq('id', currentUserId).then(({ error }) => {
      if (error) console.error('Database settings error', error);
    });
  };

  // Register New Custom NCF Sequences Visual Admin
  
  const addSeller = async (seller: Omit<Seller, 'id' | 'createdAt'>) => {
    const prefix = getDbPrefix();
    if (!prefix) {
      // Not authenticated yet – show alert, do not save
      showAlert('Debes iniciar sesión para guardar vendedores. Por favor recarga la página e inténtalo de nuevo.');
      return;
    }

    const newSeller: Seller = {
      ...seller,
      id: 'sel-' + Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [...sellers, newSeller];
    setSellers(updated);
    localStorage.setItem('facturado_sellers', JSON.stringify(updated));

    // DB record uses prefixed id for user isolation
    const dbRecord = mapSellerToDb({ ...newSeller, id: `${prefix}${newSeller.id}` });
    const { error } = await insforge.database.from('sellers').insert([dbRecord]);
    if (error) {
      console.error('Database sellers insert error', error);
      showAlert(`Error al guardar vendedor en BD: ${error.message}`);
      // Revert optimistic update
      setSellers(current => {
        const reverted = current.filter(s => s.id !== newSeller.id);
        localStorage.setItem('facturado_sellers', JSON.stringify(reverted));
        return reverted;
      });
    }
  };

  const updateSeller = async (id: string, updates: Partial<Seller>) => {
    const previous = sellers.find(s => s.id === id);
    const updated = sellers.map(s => s.id === id ? { ...s, ...updates } : s);
    setSellers(updated);
    localStorage.setItem('facturado_sellers', JSON.stringify(updated));

    const prefix = getDbPrefix();
    if (!prefix) return; // Not authenticated
    const matchSeller = updated.find(s => s.id === id);
    if (matchSeller) {
      // Use update-specific mapper to avoid PK updates
      const dbUpdateRecord = mapSellerUpdateToDb(matchSeller);
      const { error } = await insforge.database.from('sellers').update(dbUpdateRecord).eq('id', `${prefix}${id}`);
      if (error) {
        console.error('Database sellers update error', error);
        showAlert(`Error al actualizar vendedor en BD: ${error.message}`);
        setSellers(current => {
          const reverted = current.map(s => s.id === id ? (previous || s) : s);
          localStorage.setItem('facturado_sellers', JSON.stringify(reverted));
          return reverted;
        });
      }
    }
  };

  const deleteSeller = async (id: string) => {
    const confirmed = await showConfirm("¿Está seguro de que desea eliminar este vendedor?");
    if (!confirmed) return;

    const previous = sellers.find(s => s.id === id);
    const updated = sellers.filter(s => s.id !== id);
    setSellers(updated);
    localStorage.setItem('facturado_sellers', JSON.stringify(updated));

    const prefix = getDbPrefix();
    if (!prefix) return; // Not authenticated
    const { error } = await insforge.database.from('sellers').update({ is_deleted: true }).eq('id', `${prefix}${id}`);
    if (error) {
      console.error('Database sellers delete error', error);
      showAlert(`Error al eliminar vendedor en BD: ${error.message}`);
      setSellers(current => {
        const reverted = previous ? [...current, previous] : current;
        localStorage.setItem('facturado_sellers', JSON.stringify(reverted));
        return reverted;
      });
    }
  };

  const updateNcfSequences = (seqs: NcfSequence[]) => {
    setNcfSequences(seqs);
    saveToStorage('inv_ncf_seq', seqs);

    const prefix = getDbPrefix();
    seqs.forEach(seq => {
      const dbType = `${prefix}${seq.type}`;
      const dbSeq = { ...seq, type: dbType as any };
      insforge.database.from('ncf_sequences').update(mapNcfSequenceToDb(dbSeq)).eq('type', dbType).then(({ error }) => {
        if (error) console.error(error);
      });
    });
  };

  // Users management
  const addUser = (user: Omit<UserPermission, 'id'>) => {
    const newUser: UserPermission = {
      ...user,
      id: `usr-${Date.now()}`,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveToStorage('inv_users', updated);
  };

  const updateUserRole = (id: string, role: 'Administrador' | 'Facturador' | 'Auditor') => {
    const updated = users.map(u => {
      if (u.id === id) {
        const perms = {
          canCreateInvoice: true,
          canEditInvoice: true,
          canDeleteInvoice: true,
          canExportReports: true,
          canManageUsers: true,
        };
        return { ...u, role, permissions: perms };
      }
      return u;
    });
    setUsers(updated);
    saveToStorage('inv_users', updated);
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('inv_users', JSON.stringify(updatedUsers));
  };

  const banUser = (id: string, isBanned: boolean) => {
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, isBanned } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('inv_users', JSON.stringify(updatedUsers));
  };

  const updateUserAvatar = (id: string, avatarUrl: string) => {
    const updated = users.map(u => u.id === id ? { ...u, avatarUrl } : u);
    setUsers(updated);
    saveToStorage('inv_users', updated);
    
    if (currentUser && currentUser.id === id) {
      const updatedUser = { ...currentUser, avatarUrl };
      setCurrentUser(updatedUser);
      saveToStorage('inv_active_user', updatedUser);
    }
  };

  const handleActiveUserChange = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      const isLoggedIn = localStorage.getItem('facturado_logged_in') === 'true';
      const userToSet = isLoggedIn ? {
        ...found,
        permissions: {
          canCreateInvoice: true,
          canEditInvoice: true,
          canDeleteInvoice: true,
          canExportReports: true,
          canManageUsers: true
        }
      } : found;
      setCurrentUser(userToSet);
      saveToStorage('inv_active_user', userToSet);
    }
  };

  const handleLoginSuccessUser = async (user: UserPermission) => {
    // Force all permissions to true since they are a logged in user
    const fullPermUser = {
      ...user,
      permissions: {
        canCreateInvoice: true,
        canEditInvoice: true,
        canDeleteInvoice: true,
        canExportReports: true,
        canManageUsers: true
      }
    };

    // 1. Add them to users array if they aren't there
    setUsers(prev => {
      if (!prev.some(u => u.id === fullPermUser.id)) {
        const updated = [...prev, fullPermUser];
        saveToStorage('inv_users', updated);
        return updated;
      }
      return prev;
    });

    // 2. Set current user immediately and cache auth ID
    setCurrentUser(fullPermUser);
    authUserIdRef.current = fullPermUser.id;
    saveToStorage('inv_active_user', fullPermUser);

    // 3. Set logged in item
    localStorage.setItem('facturado_logged_in', 'true');

    // 4. Trigger database fetch and sync immediately
    await loadAllDataFromPostgres();
  };

  // Support tickets
  const addTicket = (desc: { subject: string; category: SupportTicket['category']; description: string }) => {
    const newTkt: SupportTicket = {
      id: `tkt-${Date.now()}`,
      subject: desc.subject,
      category: desc.category,
      description: desc.description,
      status: 'Abierto',
      createdAt: new Date().toISOString(),
    };
    const updated = [newTkt, ...tickets];
    setTickets(updated);
    saveToStorage('inv_tickets', updated);

    const prefix = getDbPrefix();
    const dbTkt = { ...newTkt, id: `${prefix}${newTkt.id}` };
    insforge.database.from('support_tickets').insert([mapSupportTicketToDb(dbTkt)]).then(({ error }) => {
      if (error) console.error('Database tickets error', error);
    });
  };

  // Expenses Module methods
  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    const updated = expenses.map(e => e.id === id ? { ...e, ...updatedFields } : e);
    setExpenses(updated);
    saveToStorage('inv_expenses', updated);

    const expenseToUpdate = updated.find(e => e.id === id);
    if (expenseToUpdate) {
      const prefix = getDbPrefix();
      const dbExp = { ...expenseToUpdate, id: `${prefix}${expenseToUpdate.id}` };
      insforge.database.from('expenses').update(mapExpenseToDb(dbExp)).eq('id', `${prefix}${id}`).then(({ error }) => {
        if (error) {
          console.error('Database update error', error);
          showAlert(`Error al actualizar gasto en BD: ${error.message}`);
          setExpenses(current => {
            const reverted = current.map(e => e.id === id ? (expenses.find(old => old.id === id) || e) : e);
            saveToStorage('inv_expenses', reverted);
            return reverted;
          });
        }
      });
    }
  };

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`
    };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    saveToStorage('inv_expenses', updated);

    const prefix = getDbPrefix();
    const dbExp = { ...newExp, id: `${prefix}${newExp.id}` };
    insforge.database.from('expenses').insert([mapExpenseToDb(dbExp)]).then(({ error }) => {
      if (error) {
        console.error('Database insertion error', error);
        showAlert(`Error al guardar gasto en BD: ${error.message}`);
        setExpenses(current => {
          const reverted = current.filter(e => e.id !== newExp.id);
          saveToStorage('inv_expenses', reverted);
          return reverted;
        });
      }
    });
  };

  const addExpensePayment = (expenseId: string, amount: number, paymentMethod: PaymentMethod, accountId?: string, notes?: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const previousPaid = expense.amountPaid || 0;
    const newTotalPaid = previousPaid + amount;
    const newStatus = newTotalPaid >= (expense.amount - 0.1) ? 'Pagada' : 'Pendiente';

    updateExpense(expenseId, { status: newStatus, amountPaid: newTotalPaid });

    let selectedAccountName = '';
    if (accountId) {
      const accIndex = financialAccounts.findIndex(acc => acc.id === accountId);
      if (accIndex !== -1) {
        selectedAccountName = financialAccounts[accIndex].name;
        const updatedAccounts = [...financialAccounts];
        // For expenses, we subtract from balance
        updatedAccounts[accIndex].balance = Number((updatedAccounts[accIndex].balance - amount).toFixed(2));
        setFinancialAccounts(updatedAccounts);
        saveToStorage('inv_accounts', updatedAccounts);

        const accPrefix = getDbPrefix();
        insforge.database.from('financial_accounts').update({ balance: updatedAccounts[accIndex].balance }).eq('id', `${accPrefix}${accountId}`).then(({ error }) => {
          if (error) console.error('Database update balance error', error);
        });
      }
    }

    const newPayment: ExpensePayment = {
      id: `exp-pay-${Date.now()}`,
      expenseId,
      expenseConcept: expense.concept,
      providerName: expense.providerName,
      amountPaid: amount,
      paymentMethod,
      accountId,
      accountName: selectedAccountName || undefined,
      date: new Date().toISOString(),
      notes,
    };

    const updatedPayments = [newPayment, ...expensePayments];
    setExpensePayments(updatedPayments);
    saveToStorage('inv_expense_payments', updatedPayments);

    const prefix = getDbPrefix();
    const dbPayment = {
      ...newPayment,
      id: `${prefix}${newPayment.id}`,
      expenseId: newPayment.expenseId ? `${prefix}${newPayment.expenseId}` : null,
      accountId: newPayment.accountId ? `${prefix}${newPayment.accountId}` : null
    };
    insforge.database.from('expense_payments').insert([mapExpensePaymentToDb(dbPayment as any)]).then(({ error }) => {
      if (error) console.error('Database expense_payments insert error', error);
    });
  };

  const addPurchaseOrderPayment = (poId: string, amount: number, paymentMethod: PaymentMethod, accountId?: string, notes?: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    const previousPaid = po.amountPaid || 0;
    const newTotalPaid = previousPaid + amount;

    updatePurchaseOrder(poId, { amountPaid: newTotalPaid });

    let selectedAccountName = '';
    if (accountId) {
      const accIndex = financialAccounts.findIndex(acc => acc.id === accountId);
      if (accIndex !== -1) {
        selectedAccountName = financialAccounts[accIndex].name;
        const updatedAccounts = [...financialAccounts];
        // For purchase orders, we subtract from balance
        updatedAccounts[accIndex].balance = Number((updatedAccounts[accIndex].balance - amount).toFixed(2));
        setFinancialAccounts(updatedAccounts);
        saveToStorage('inv_accounts', updatedAccounts);

        const accPrefix = getDbPrefix();
        insforge.database.from('financial_accounts').update({ balance: updatedAccounts[accIndex].balance }).eq('id', `${accPrefix}${accountId}`).then(({ error }) => {
          if (error) console.error('Database update balance error', error);
        });
      }
    }

    const newPayment: PurchaseOrderPayment = {
      id: `po-pay-${Date.now()}`,
      poId,
      poNumber: po.poNumber,
      providerName: po.providerName,
      amountPaid: amount,
      paymentMethod,
      accountId,
      accountName: selectedAccountName || undefined,
      date: new Date().toISOString(),
      notes,
    };

    const updatedPayments = [newPayment, ...purchaseOrderPayments];
    setPurchaseOrderPayments(updatedPayments);
    saveToStorage('inv_po_payments', updatedPayments);

    const prefix = getDbPrefix();
    const dbPayment = {
      ...newPayment,
      id: `${prefix}${newPayment.id}`,
      poId: newPayment.poId ? `${prefix}${newPayment.poId}` : null,
      accountId: newPayment.accountId ? `${prefix}${newPayment.accountId}` : null
    };
    insforge.database.from('purchase_order_payments').insert([mapPurchaseOrderPaymentToDb(dbPayment as any)]).then(({ error }) => {
      if (error) console.error('Database purchase_order_payments insert error', error);
    });
  };

  const addShift = async (sh: Omit<Shift, 'id'>) => {
    const prefix = getDbPrefix();
    if (!prefix) {
      showAlert('Debes iniciar sesión para abrir un turno. Por favor recarga la página e inténtalo de nuevo.');
      return;
    }

    const newSh: Shift = {
      ...sh,
      id: `sh-${Date.now()}`
    };
    const updated = [newSh, ...shifts];
    setShifts(updated);
    if (newSh.status === 'Abierto') setActiveShift(newSh);
    saveToStorage('inv_shifts', updated);

    const dbRecord = mapShiftToDb({ ...newSh, id: `${prefix}${newSh.id}` });
    const { error } = await insforge.database.from('shifts').insert([dbRecord]);
    if (error) {
      console.error('Database insertion error for shift', error);
      showAlert(`Error al guardar turno en BD: ${error.message}`);
      setShifts(current => {
        const reverted = current.filter(s => s.id !== newSh.id);
        saveToStorage('inv_shifts', reverted);
        if (newSh.status === 'Abierto') setActiveShift(reverted.find(s => s.status === 'Abierto') || null);
        return reverted;
      });
    }
  };

  const updateShift = (id: string, updates: Partial<Shift>) => {
    // Capture the current shift BEFORE state update to avoid stale closure issue
    const existingShift = shifts.find(s => s.id === id);

    setShifts(current => {
      const updated = current.map(sh => sh.id === id ? { ...sh, ...updates } : sh);
      saveToStorage('inv_shifts', updated);
      const target = updated.find(s => s.id === id);
      if (target) {
        if (target.status === 'Abierto') {
          setActiveShift(target);
        } else if (activeShift?.id === id && target.status === 'Cerrado') {
          setActiveShift(null);
        }
      }
      return updated;
    });

    const prefix = getDbPrefix();
    if (!prefix) {
      console.warn('updateShift: no auth prefix, skipping DB update');
      return;
    }
    // Use update-specific mapper (excludes 'id') to avoid RLS WITH CHECK policy violations
    const dbUpdateRecord = mapShiftUpdateToDb(updates);
    insforge.database.from('shifts').update(dbUpdateRecord).eq('id', `${prefix}${id}`).then(({ error }) => {
      if (error) {
        console.error('Database update error for shift', error);
        showAlert(`Error al actualizar turno en BD: ${error.message}`);
      }
    });
  };

  const deleteExpense = async (id: string) => {
    const confirmed = await showConfirm("Â¿EstÃ¡s seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveToStorage('inv_expenses', updated);

    const prefix = getDbPrefix();
    const target = expenses.find(e => e.id === id);
    insforge.database.from('expenses').update({ is_deleted: true }).eq('id', `${prefix}${id}`).then(({ error }) => {
      if (error && target) {
        console.error('Database deletion error', error);
        showAlert(`Error al eliminar gasto en BD: ${error.message}`);
        setExpenses(current => {
          const reverted = [...current, target];
          saveToStorage('inv_expenses', reverted);
          return reverted;
        });
      }
    });
  };

  const deletePurchaseOrder = async (id: string) => {
    const confirmed = await showConfirm("Â¿EstÃ¡s seguro de que deseas eliminar este elemento?");
    if (!confirmed) return;
    const target = purchaseOrders.find(po => po.id === id);
    if (!target) return;

    // If the order was received, reverse the stock additions
    if (target.status === 'Recibida') {
      const prefix = getDbPrefix();
      const tempProducts = products.map(p => {
        const matchItem = target.items.find(itm => itm.productId === p.id);
        if (matchItem) {
          const newStock = Math.max(0, p.stock - matchItem.quantity);
          insforge.database.from('products').update({ stock: newStock }).eq('id', `${prefix}${p.id}`).then(({ error }) => {
            if (error) console.error(error);
          });
          return { ...p, stock: newStock };
        }
        return p;
      });
      setProducts(tempProducts);
      saveToStorage('inv_products', tempProducts);
    }

    const updated = purchaseOrders.filter(po => po.id !== id);
    setPurchaseOrders(updated);
    saveToStorage('inv_po', updated);

    const prefix = getDbPrefix();
    insforge.database.from('purchase_orders').update({ is_deleted: true }).eq('id', `${prefix}${id}`).then(({ error }) => {
      if (error && target) {
        console.error('Database deletion error', error);
        showAlert(`Error al eliminar orden de compra en BD: ${error.message}`);
        setPurchaseOrders((current: PurchaseOrder[]) => {
          const reverted = [...current, target];
          saveToStorage('inv_po', reverted);
          return reverted;
        });
      }
    });
  };

  const purgePostgresData = async () => {
    try {
      await insforge.database.from('invoices').delete().neq('id', 'dummy');
      await insforge.database.from('receipts').delete().neq('id', 'dummy');
      await insforge.database.from('purchase_orders').delete().neq('id', 'dummy');
      await insforge.database.from('expenses').delete().neq('id', 'dummy');
      await insforge.database.from('products').delete().neq('id', 'dummy');
      await insforge.database.from('clients').delete().neq('id', 'keep_all');
      await insforge.database.from('providers').delete().neq('id', 'keep_all');
      
      setInvoices([]);
      setReceipts([]);
      setPurchaseOrders([]);
      setExpenses([]);
      setProducts([]);
      setClients([]);
      setProviders([]);
    } catch (e) {
      console.error('Error purging data', e);
    }
  };



  // Audit Logs
  const logActivity = async (action: string, entity: string, entityId: string, details?: any) => {
    try {
      const { data: authData } = await insforge.auth.getCurrentUser();
      const currentUserId = authData?.user?.id || 'default';
      const userEmail = authData?.user?.email || 'admin@facturado.com';
      
      const logId = currentUserId + '_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
      const logRecord = {
        id: logId,
        action,
        entity,
        entity_id: entityId,
        details: details ? JSON.stringify(details) : null,
        user_id: currentUserId,
        user_name: userEmail,
        created_at: new Date().toISOString()
      };
      
      await insforge.database.from('audit_logs').insert([logRecord]);
    } catch (err) {
      console.error('Failed to write audit log', err);
    }
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (!loaded) return;
    
    // Check Stock
    products.forEach(p => {
      if (p.type === 'Producto' && p.stock <= p.minStock) {
        const title = 'Stock Bajo';
        const message = `El producto "${p.name}" ha alcanzado el nivel mínimo de stock (${p.stock} unidades).`;
        const exists = notifications.some(n => n.title === title && n.message === message && !n.read);
        if (!exists) {
          addNotification({ title, message, type: 'warning', linkTo: 'inventario' });
        }
      }
    });

    // Check NCF
    ncfSequences.forEach(seq => {
      const remaining = (seq.endNumber || 0) - seq.currentNumber;
      if (remaining <= 50 && remaining >= 0) {
        const title = 'Pocos Comprobantes Faltantes';
        const message = `Te quedan ${remaining} comprobantes para la secuencia ${seq.name} (${seq.type}).`;
        const exists = notifications.some(n => n.title === title && n.message === message && !n.read);
        if (!exists) {
          addNotification({ title, message, type: 'warning', linkTo: 'configuracion' });
        }
      }
    });
  }, [loaded, products, ncfSequences]);

  return {
    loaded,
    needsOnboarding,
    setNeedsOnboarding,
    purgePostgresData,
    loadAllDataFromPostgres,
    loadMoreInvoices,
    searchInvoices,
    searchReceipts,
    searchExpenses,
    logActivity,
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
    expenses,
    expensePayments,
    addExpense,
    updateExpense,
    deleteExpense,
    addExpensePayment,
    shifts,
    activeShift,
    addShift,
    updateShift,
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
    banUser,
    updateUserAvatar,
    handleActiveUserChange,
    handleLoginSuccessUser,
    addTicket,
    warehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    financialAccounts,
    addFinancialAccount,
    updateFinancialAccount,
    deleteFinancialAccount,
    purchaseOrders,
    purchaseOrderPayments,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    addPurchaseOrderPayment,
    sellers,
    addSeller,
    updateSeller,
    deleteSeller,
    notifications,
    addNotification,
    markNotificationRead,
    clearNotifications,
    inventoryMovements,
    addInventoryMovement,
  };
}
