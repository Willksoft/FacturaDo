import { Client, Product, Provider, Invoice, Receipt, NcfSequence, TemplateSettings, UserPermission, SupportTicket } from './types';

export const initialNcfSequences: NcfSequence[] = [
  { type: 'B01', name: 'Factura de Crédito Fiscal', prefix: 'B01', currentNumber: 15, suffixLength: 8, startNumber: 1, endNumber: 150 },
  { type: 'B02', name: 'Factura de Consumo', prefix: 'B02', currentNumber: 42, suffixLength: 8, startNumber: 1, endNumber: 200 },
  { type: 'B14', name: 'Regímenes Especiales', prefix: 'B14', currentNumber: 3, suffixLength: 8, startNumber: 1, endNumber: 50 },
  { type: 'B15', name: 'Comprobante Gubernamental', prefix: 'B15', currentNumber: 7, suffixLength: 8, startNumber: 1, endNumber: 50 },
  { type: 'SIN', name: 'Sin Comprobante Fiscal', prefix: 'SIN', currentNumber: 104, suffixLength: 8, startNumber: 1, endNumber: 9999 },
];

export const initialClients: Client[] = [
  {
    id: 'cli-1',
    type: 'Empresa',
    name: 'Constructora Santo Domingo SRL',
    rncOrCedula: '131456789',
    email: 'compras@constructorasd.com.do',
    phone: '809-555-0192',
    address: 'Av. Winston Churchill No. 423, Santo Domingo, R.D.',
    createdAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'cli-2',
    type: 'Empresa',
    name: 'Supermercados del Caribe SAS',
    rncOrCedula: '101987654',
    email: 'finanzas@supercaribe.com',
    phone: '809-222-3456',
    address: 'Av. John F. Kennedy, Santiago de los Caballeros, R.D.',
    createdAt: '2026-02-15T09:15:00Z',
  },
  {
    id: 'cli-3',
    type: 'Fisica',
    name: 'Carlos Manuel Gómez Rodríguez',
    rncOrCedula: '402-1234567-8',
    email: 'carlos.gomez@gmail.com',
    phone: '829-444-9876',
    address: 'Calle El Sol No. 12, Santiago, R.D.',
    createdAt: '2026-03-01T11:45:00Z',
  },
  {
    id: 'cli-4',
    type: 'Fisica',
    name: 'María Alejandra Peralta Almonte',
    rncOrCedula: '001-9876543-2',
    email: 'maria.peralta@outlook.com',
    phone: '809-777-1234',
    address: 'Av. Indepedencia, Santo Domingo, R.D.',
    createdAt: '2026-03-20T16:00:00Z',
  },
  {
    id: 'cli-consumo',
    type: 'Fisica',
    name: 'Cliente de Consumo (Público General)',
    rncOrCedula: '224-00125-4',
    email: 'consumidor@correo.com',
    phone: '809-555-5555',
    address: 'Público General, R.D.',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const initialProviders: Provider[] = [
  {
    id: 'prov-1',
    name: 'Distribuidora Industrial Dominicana',
    rnc: '101112233',
    email: 'ventas@did-industrial.com',
    phone: '809-567-8901',
    address: 'Zona Industrial de Haina, San Cristóbal, R.D.',
    contactName: 'Ing. Jose Alcantara',
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'prov-2',
    name: 'Suministros Tecnológicos del Caribe',
    rnc: '130887766',
    email: 'servicio@suminteccaribe.com.do',
    phone: '829-541-2323',
    address: 'Av. Charles de Gaulle, Santo Domingo Este',
    contactName: 'Ing. Rafael Medina',
    createdAt: '2026-02-02T10:30:00Z',
  },
];

export const initialWarehouses = [
  { id: 'wh-1', name: 'Almacén Central Santo Domingo', code: 'ALM-CENTRAL', location: 'Av. Luperón, Santo Domingo', createdAt: '2026-01-01T08:00:00Z' },
  { id: 'wh-2', name: 'Almacén Satélite Haina', code: 'ALM-HAINA', location: 'Zona Industrial Haina', createdAt: '2026-02-01T08:00:00Z' }
];

export const initialFinancialAccounts = [
  { id: 'acc-1', name: 'Caja Principal (Efectivo)', type: 'Caja' as const, balance: 0.00, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'acc-2', name: 'Banco Popular - Cuenta Corriente', type: 'Banco' as const, balance: 0.00, accountNumber: '784512963', bankName: 'Banco Popular Dominicano', createdAt: '2026-01-01T08:00:00Z' },
  { id: 'acc-3', name: 'Terminal Verifone (Tarjetas)', type: 'Verifone' as const, balance: 0.00, createdAt: '2026-01-01T08:00:00Z' }
];

export const initialPurchaseOrders = [
  {
    id: 'po-1',
    poNumber: 'OC-2026-0001',
    providerId: 'prov-1',
    providerName: 'Distribuidora Industrial Dominicana',
    items: [
      { productId: 'prod-1', name: 'Cemento Gris Portland Gris 42.5 kg', cost: 320.00, quantity: 100, total: 32000.00 }
    ],
    subtotal: 32000.00,
    total: 32000.00,
    status: 'Recibida' as const,
    createdAt: '2026-05-10T10:00:00Z',
    deliveryDate: '2026-05-15T14:00:00Z',
    notes: 'Despacho urgente para reposición de inventario.'
  },
  {
    id: 'po-2',
    poNumber: 'OC-2026-0002',
    providerId: 'prov-2',
    providerName: 'Suministros Tecnológicos del Caribe',
    items: [
      { productId: 'prod-4', name: 'Laptops Corporativas Intel Core i7 16GB RAM', cost: 38000.00, quantity: 2, total: 76000.00 }
    ],
    subtotal: 76000.00,
    total: 76000.00,
    status: 'Solicitada' as const,
    createdAt: '2026-06-05T09:30:00Z',
    notes: 'Equipo pendiente de aprobación por administración.'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Cemento Gris Portland Gris 42.5 kg',
    code: 'CEM-001',
    type: 'Producto',
    price: 495.00,
    cost: 320.00,
    taxRate: 18,
    stock: 450,
    minStock: 50,
    providerId: 'prov-1',
    warehouseId: 'wh-1',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=250&q=80',
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Varilla de Acero de Construcción 3/8"',
    code: 'VAR-38',
    type: 'Producto',
    price: 360.00,
    cost: 240.00,
    taxRate: 18,
    stock: 280,
    minStock: 40,
    providerId: 'prov-1',
    warehouseId: 'wh-1',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=250&q=80',
    createdAt: '2026-01-10T12:10:00Z',
  },
  {
    id: 'prod-3',
    name: 'Servicio de Consultoría de Ingeniería Civil (Hora)',
    code: 'CONS-CIV',
    type: 'Servicio',
    price: 3500.00,
    cost: 0.00,
    taxRate: 18, // standard rate, or some professional fees are 18% but require withholding simulation in DGII
    stock: 0,
    minStock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&q=80',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Laptops Corporativas Intel Core i7 16GB RAM',
    code: 'LAP-I7',
    type: 'Producto',
    price: 54000.00,
    cost: 38000.00,
    taxRate: 18,
    stock: 12,
    minStock: 3,
    providerId: 'prov-2',
    warehouseId: 'wh-2',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=250&q=80',
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Soporte y Mantenimiento Técnico Anual de Servidores',
    code: 'SERV-MAINT',
    type: 'Servicio',
    price: 25000.00,
    cost: 5000.00,
    taxRate: 18,
    stock: 0,
    minStock: 0,
    providerId: 'prov-2',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80',
    createdAt: '2026-02-10T14:15:00Z',
  },
  {
    id: 'prod-6',
    name: 'Bloque de Hormigón de 6 pulgadas (Pzs)',
    code: 'BLQ-06',
    type: 'Producto',
    price: 65.00,
    cost: 41.00,
    taxRate: 0, // Exempted or specific tax scheme
    stock: 1500,
    minStock: 200,
    providerId: 'prov-1',
    warehouseId: 'wh-1',
    imageUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=250&q=80',
    createdAt: '2026-01-11T09:00:00Z',
  },
];

export const initialInvoices: Invoice[] = [
  // Invoice 1 - Crédito Fiscal (B01)
  {
    id: 'inv-1',
    invoiceNumber: 'FAC-2026-0001',
    type: 'Factura',
    client: initialClients[0], // Constructora Santo Domingo SRL
    items: [
      {
        productId: 'prod-1',
        name: 'Cemento Gris Portland Gris 42.5 kg',
        price: 495.00,
        quantity: 200,
        taxRate: 18,
        taxAmount: 17820.00, // 200 * 495 * 0.18
        total: 116820.00, // 200 * 495 * 1.18
      },
      {
        productId: 'prod-2',
        name: 'Varilla de Acero de Construcción 3/8"',
        price: 360.00,
        quantity: 150,
        taxRate: 18,
        taxAmount: 9720.00,
        total: 63720.00,
      }
    ],
    subtotal: 153000.00,
    taxAmount: 27540.00,
    total: 180540.00,
    status: 'Pagada',
    ncfType: 'B01',
    ncf: 'B0100000001',
    sequenceNumber: 1,
    paymentMethod: 'Transferencia',
    notes: 'Despachado en obra Churchill. NCF Crédito Fiscal.',
    createdAt: '2026-04-12T10:00:00Z',
    dueDate: '2026-05-12T10:00:00Z',
    sentByEmail: true,
  },
  // Invoice 2 - Consumo (B02)
  {
    id: 'inv-2',
    invoiceNumber: 'FAC-2026-0002',
    type: 'Factura',
    client: initialClients[2], // Carlos Manuel Gómez (Física)
    items: [
      {
        productId: 'prod-1',
        name: 'Cemento Gris Portland Gris 42.5 kg',
        price: 495.00,
        quantity: 10,
        taxRate: 18,
        taxAmount: 891.00,
        total: 5841.00,
      }
    ],
    subtotal: 4950.00,
    taxAmount: 891.00,
    total: 5841.00,
    status: 'Pagada',
    ncfType: 'B02',
    ncf: 'B0200000001',
    sequenceNumber: 1,
    paymentMethod: 'Efectivo',
    createdAt: '2026-04-18T15:30:00Z',
    dueDate: '2026-04-18T15:30:00Z',
    sentByEmail: false,
  },
  // Invoice 3 - Crédito Fiscal (B01)
  {
    id: 'inv-3',
    invoiceNumber: 'FAC-2026-0003',
    type: 'Factura',
    client: initialClients[1], // Supermercados del Caribe SAS
    items: [
      {
        productId: 'prod-4',
        name: 'Laptops Corporativas Intel Core i7 16GB RAM',
        price: 54000.00,
        quantity: 2,
        taxRate: 18,
        taxAmount: 19440.00,
        total: 127440.00,
      },
      {
        productId: 'prod-5',
        name: 'Soporte y Mantenimiento Técnico Anual de Servidores',
        price: 25000.00,
        quantity: 1,
        taxRate: 18,
        taxAmount: 4500.00,
        total: 29500.00,
      }
    ],
    subtotal: 133000.00,
    taxAmount: 23940.00,
    total: 156940.00,
    status: 'Pendiente',
    ncfType: 'B01',
    ncf: 'B0100000002',
    sequenceNumber: 2,
    paymentMethod: 'Crédito',
    notes: 'Pago acordado a 30 días. RNC empresa autorizada.',
    createdAt: '2026-05-05T11:00:00Z',
    dueDate: '2026-06-05T11:00:00Z',
    sentByEmail: true,
  },
  // Invoice 4 - Consumo (B02)
  {
    id: 'inv-4',
    invoiceNumber: 'FAC-2026-0004',
    type: 'Factura',
    client: initialClients[3], // María Peralta (Física)
    items: [
      {
        productId: 'prod-6',
        name: 'Bloque de Hormigón de 6 pulgadas (Pzs)',
        price: 65.00,
        quantity: 150,
        taxRate: 0,
        taxAmount: 0.00,
        total: 9750.00,
      }
    ],
    subtotal: 9750.00,
    taxAmount: 0.00,
    total: 9750.00,
    status: 'Pendiente',
    ncfType: 'B02',
    ncf: 'B0200000002',
    sequenceNumber: 2,
    paymentMethod: 'Efectivo',
    createdAt: '2026-05-20T09:45:00Z',
    dueDate: '2026-05-20T09:45:00Z',
    sentByEmail: false,
  },
  // Invoice 5 - Cotización (Cotización - No afecta stock ni reporte DGII hasta facturar!)
  {
    id: 'cot-1',
    invoiceNumber: 'COT-2026-0001',
    type: 'Cotizacion',
    client: initialClients[0],
    items: [
      {
        productId: 'prod-4',
        name: 'Laptops Corporativas Intel Core i7 16GB RAM',
        price: 54000.00,
        quantity: 5,
        taxRate: 18,
        taxAmount: 48600.00,
        total: 318600.00,
      }
    ],
    subtotal: 270000.00,
    taxAmount: 48600.00,
    total: 318600.00,
    status: 'Pendiente',
    ncfType: 'B01',
    ncf: 'COTIZACIÓN',
    sequenceNumber: 0,
    paymentMethod: 'Transferencia',
    notes: 'Válido por 15 días. Sujeto a disponibilidad de inventario.',
    createdAt: '2026-06-01T15:00:00Z',
    dueDate: '2026-06-15T15:00:00Z',
  }
];

export const initialReceipts: Receipt[] = [
  {
    id: 'rec-1',
    receiptNumber: 'REC-2026-0001',
    invoiceId: 'inv-1',
    invoiceNumber: 'FAC-2026-0001',
    clientName: 'Constructora Santo Domingo SRL',
    amountPaid: 180540.00,
    paymentMethod: 'Transferencia',
    date: '2026-04-15T14:00:00Z',
    notes: 'Cancelación total factura No. 1'
  },
  {
    id: 'rec-2',
    receiptNumber: 'REC-2026-0002',
    invoiceId: 'inv-2',
    invoiceNumber: 'FAC-2026-0002',
    clientName: 'Carlos Manuel Gómez Rodríguez',
    amountPaid: 5841.00,
    paymentMethod: 'Efectivo',
    date: '2026-04-18T15:35:00Z',
    notes: 'Pago en caja central'
  }
];

export const defaultTemplateSettings: TemplateSettings = {
  businessName: 'MULTISERVICIOS S&E DOMINO SRL',
  businessRNC: '130998877',
  businessPhone: '809-543-9876',
  businessEmail: 'facturacion@sedomino.com.do',
  businessAddress: 'Av. 27 de Febrero No. 200, Bella Vista, Santo Domingo, R.D.',
  logoUrl: '', // generated dynamic text or icon if empty
  primaryColor: '#000000',
  accentColor: '#171717',
  footerNote: 'Términos y Condiciones: La mercancía viaja por cuenta y riesgo del comprador. Favor verificar su mercancía al momento de recibirla. No se aceptan reclamaciones después de transcurridas 48 horas de la entrega.',
  pageSize: 'Letter' as const,
  bankAccountBank: 'Banco Popular Dominicano',
  bankAccountName: 'MULTISERVICIOS S&E DOMINO SRL',
  bankAccountRef: '784512963',
  bankAccountType: 'Corriente',
  bankAccountCurrency: 'DOP'
};

export const defaultUsers: UserPermission[] = [
  {
    id: 'usr-1',
    username: 'sedphotord',
    email: 'sedphotord@gmail.com',
    role: 'Administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    permissions: {
      canCreateInvoice: true,
      canEditInvoice: true,
      canDeleteInvoice: true,
      canExportReports: true,
      canManageUsers: true
    }
  },
  {
    id: 'usr-2',
    username: 'ramonalmonte',
    email: 'ramon@sedomino.com.do',
    role: 'Facturador',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    permissions: {
      canCreateInvoice: true,
      canEditInvoice: true,
      canDeleteInvoice: false,
      canExportReports: false,
      canManageUsers: false
    }
  },
  {
    id: 'usr-3',
    username: 'auditoradgii',
    email: 'auditoria@sedomino.com.do',
    role: 'Auditor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    permissions: {
      canCreateInvoice: false,
      canEditInvoice: false,
      canDeleteInvoice: false,
      canExportReports: true,
      canManageUsers: false
    }
  }
];

export const initialTickets: SupportTicket[] = [
  {
    id: 'tkt-001',
    subject: '¿Cómo reportar facturas anuladas?',
    category: 'DGII',
    description: 'Tengo facturas anuladas con NCF B02, ¿debo reportarlas en el formato de compras 606 o en el de anulados 608?',
    status: 'Resulto',
    createdAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'tkt-002',
    subject: 'Control de inventario al convertir cotización',
    category: 'Inventario',
    description: 'Quisiera saber si el stock de bloques se descuenta inmediatamente cuando hago la cotización o hasta que la convierto en factura.',
    status: 'Resulto',
    createdAt: '2026-06-03T11:45:00Z'
  },
  {
    id: 'tkt-003',
    subject: 'Error al importar masivamente desde Excel',
    category: 'Sistema',
    description: 'Tengo una lista de 45 clientes en un archivo Excel. Me sale error de formato en el RNC porque tiene guiones. ¿Qué formato debo usar?',
    status: 'Abierto',
    createdAt: '2026-06-08T16:20:00Z'
  }
];
