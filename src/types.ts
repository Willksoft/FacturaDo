export type ClientType = 'Fisica' | 'Empresa';
export type InvoiceType = 'Factura' | 'Cotizacion';
export type InvoiceStatus = 'Pagada' | 'Pendiente' | 'Anulada' | 'Parcial' | 'Borrador';
export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Crédito';
export type NcfType = 'B01' | 'B02' | 'B14' | 'B15' | 'SIN' | 'E31' | 'E32' | 'E33' | 'E34' | 'E44' | 'E45'; // B*: Clásicos, E*: Electrónicos

export interface Client {
  id: string;
  type: ClientType;
  name: string;
  rncOrCedula: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  // DGII properties
  dgiiVerified?: boolean;
  dgiiEstatus?: string | null;
  dgiiRegimen?: string | null;
  dgiiCategoria?: string | null;
  dgiiActividad?: string | null;
  dgiiProvincia?: string | null;
  dgiiMunicipio?: string | null;
}

export interface Provider {
  id: string;
  name: string;
  rnc: string;
  email: string;
  phone: string;
  address: string;
  contactName: string;
  createdAt: string;
  // DGII properties
  dgiiVerified?: boolean;
  dgiiEstatus?: string | null;
  dgiiRegimen?: string | null;
  dgiiCategoria?: string | null;
  dgiiActividad?: string | null;
  dgiiProvincia?: string | null;
  dgiiMunicipio?: string | null;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  type: 'Producto' | 'Servicio';
  price: number;
  cost: number;
  taxRate: number; // e.g. 18 for 18% ITBIS, 0 for exempt
  priceIncludesTax?: boolean; // Whether the base price already includes the ITBIS
  stock: number;
  minStock: number;
  providerId?: string; // linked supplier
  warehouseId?: string; // linked warehouse if type is 'Producto'
  imageUrl?: string; // photo/picture URL of the product
  category?: string; // category tag
  createdAt: string;
  // Refined Inventory
  isKit?: boolean;
  kitItems?: { productId: string; quantity: number }[];
  batches?: { batchNumber: string; expirationDate: string; stock: number }[];
  stockLevels?: { warehouseId: string; stock: number; minStock: number }[];
}

export interface PaymentDetail {
  id?: string;
  method: PaymentMethod;
  amount: number;
  accountId?: string;
  date?: string;
  notes?: string;
  receiptId?: string;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  taxRate: number; // e.g. 18%
  taxAmount: number;
  total: number;
  discount?: number; // percentage discount (e.g., 5 for 5%)
  imageUrl?: string; // Product image at time of invoice
  showImage?: boolean; // Whether to display this image on the PDF
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. FACT-0001 or COT-0001
  type: InvoiceType;
  client: Client;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number; // sum of all item tax amounts (ITBIS)
  total: number;
  status: InvoiceStatus;
  ncfType: NcfType;
  ncf: string; // e.g. B0100000123
  sequenceNumber: number;
  paymentMethod: PaymentMethod;
  payments?: PaymentDetail[];
  notes?: string;
  originalQuoteId?: string; // if quote converted to invoice
  originalQuoteNo?: string; // quote number
  convertedToInvoiceId?: string; // if quote was converted to invoice
  convertedToInvoiceNo?: string; // target invoice number
  createdAt: string;
  dueDate: string;
  sentByEmail?: boolean;
  currency?: string; // e.g. "DOP", "USD", "EUR"
  paymentCondition?: string; // e.g. "Contado", "15 Días", "30 Días"
  discountRate?: number; // global invoice discount rate %
  discountAmount?: number; // global flat discount amount
  // e-CF fields
  isEcf?: boolean;
  ecfTrackId?: string; // MSeller/DGII TrackID for the electronic receipt
  ecfQrUrl?: string; // QR data or URL for the printed receipt
  sellerId?: string; // Vendedor/Seller assigned
  sellerName?: string;
  shiftId?: string; // Turno ID
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  accountId?: string; // Linked bank or cash register/box account
  accountName?: string;
  retainedItbis?: number;
  retainedIsr?: number;
  retentionNumber?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location?: string;
  phone?: string;
  manager?: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. OC-0001
  providerId: string;
  providerName: string;
  items: {
    productId: string;
    name: string;
    cost: number;
    quantity: number;
    total: number;
  }[];
  subtotal: number;
  total: number;
  status: 'Solicitada' | 'Aprobada' | 'Recibida' | 'Cancelada';
  createdAt: string;
  deliveryDate?: string;
  notes?: string;
  amountPaid?: number;
}

export interface PurchaseOrderPayment {
  id: string;
  poId: string;
  poNumber: string;
  providerName: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  accountId?: string;
  accountName?: string;
}

export interface FinancialAccount {
  id: string;
  name: string; // e.g. "Caja General", "Banco Popular", "Verifone"
  type: 'Caja' | 'Banco' | 'Verifone' | 'Transferencia' | 'Tarjeta';
  balance: number;
  accountNumber?: string;
  bankName?: string;
  createdAt: string;
}

export interface NcfSequence {
  type: NcfType;
  name: string;
  prefix: string;
  currentNumber: number;
  suffixLength: number; // e.g. 8 characters => 00000001
  startNumber?: number;
  endNumber?: number;
}

export interface Shift {
  id: string;
  startTime: string;
  endTime?: string;
  openingBalance: number;
  closingBalanceExpected?: number;
  closingBalanceActual?: number;
  discrepancy?: number;
  openedById?: string;
  openedByName: string;
  closedById?: string;
  closedByName?: string;
  status: 'Abierto' | 'Cerrado';
  cajaId?: string; // Linked FinancialAccount of type 'Caja'
}

export interface BankAccountItem {
  bank: string;
  number: string;
  type: string;
  holder: string;
  currency: string;
}

export interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  reference?: string;
  isReconciled: boolean;
  matchedEntityType?: 'receipt' | 'expense' | null;
  matchedEntityId?: string | null;
  createdAt: string;
}

export interface TemplateSettings {
  businessName: string;
  businessRNC: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  logoUrl: string; // Base64 or online placeholder
  primaryColor: string; // Hex code (e.g. #000000)
  accentColor: string; // Hex code (e.g. #000000)
  footerNote: string;
  pageSize: 'Letter' | 'Thermal'; // Default page size for invoices, quotes, receipts; 'Letter' (8.5x11 inches) or 'Thermal' (80mm)
  bankAccountName?: string;
  bankAccountRef?: string; // account number
  bankAccountType?: string; // e.g. Ahorros / Corriente
  bankAccountCurrency?: string; // e.g. DOP, USD, EUR
  bankAccountBank?: string; // e.g. Banco Popular, Banco de Reservas, etc.
  bankAccounts?: BankAccountItem[];
  showBankAccountsOnQuote?: boolean;
  templateStyle?: string;
  fontFamily?: string;
  informalMode?: boolean; // Si es true, el negocio es informal: sin RNC, sin NCF DGII, numeración interna FAC-######
  showProductPhotos?: boolean; // Global toggle to show product photos on PDFs
}

export interface Seller {
  id: string;
  name: string;
  phone?: string;
  commissionRate?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Dgii606Record {
  rncOrCedula: string;
  expenseType: string; // 01 to 11
  ncf: string;
  modifiedNcf?: string;
  date: string; // YYYYMMDD
  paymentDate?: string;
  serviceAmount: number;
  goodsAmount: number;
  totalAmount: number;
  itbisBilled: number;
  itbisWithheldByState: number;
}

export interface Dgii607Record {
  rncOrCedula: string;
  idType: string; // 1 (RNC), 2 (Cédula), 3 (Pasaporte)
  ncf: string;
  modifiedNcf?: string;
  incomeType: string; // 01 to 16
  date: string; // YYYYMMDD
  itbisBilled: number;
  itbisWithheld: number;
  saleAmount: number;
  itbisAmount: number;
  paymentMethod: string; // Efectivo, Tarjeta, etc.
}

export interface UserPermission {
  id: string;
  username: string;
  email: string;
  role: 'Administrador' | 'Facturador' | 'Auditor' | 'Vendedor / POS';
  commissionRate?: number; // percentage
  avatarUrl?: string;
  isBanned?: boolean; // Indicates if user access is revoked
  permissions: {
    canCreateInvoice: boolean;
    canEditInvoice: boolean;
    canDeleteInvoice: boolean;
    canExportReports: boolean;
    canManageUsers: boolean;
  };
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Sistema' | 'DGII' | 'Facturas' | 'Inventario';
  description: string;
  status: 'Abierto' | 'En Proceso' | 'Resulto' | 'Resuelto';
  createdAt: string;
  response?: string;
}

export interface Expense {
  id: string;
  providerRNC: string;
  providerName: string;
  ncf: string;
  concept: string; // standard DGII category e.g. "01 - Gastos de Personal", "02 - Gastos por Trabajos, Suministros y Servicios", etc.
  amount: number;
  itbis: number;
  itbisWithheld?: number; // Retención ITBIS
  isrWithheld?: number; // Retención ISR (Impuesto sobre la Renta)
  date: string;
  paymentMethod: PaymentMethod;
  accountId?: string;
  attachmentUrl?: string;
  notes?: string;
  status?: 'Pagada' | 'Pendiente' | 'Anulada';
  amountPaid?: number;
}

export interface ExpensePayment {
  id: string;
  expenseId: string;
  expenseConcept: string;
  providerName: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  accountId?: string;
  accountName?: string;
}


export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  linkTo?: string; // Optional TabType ID to navigate to when clicked
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string | null;
  userId?: string;
  userName: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'Entrada' | 'Salida' | 'Ajuste';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceType?: 'Venta' | 'Compra' | 'Manual' | 'Ajuste';
  referenceId?: string; // e.g. invoiceId or purchaseOrderId
  createdByName: string;
  notes?: string;
  createdAt: string;
}

