export type CalculationType =
  | 'precio_fijo'
  | 'cantidad'
  | 'area'
  | 'volumen'
  | 'perimetro'
  | 'metros_lineales'
  | 'horas'
  | 'dias'
  | 'semanas'
  | 'meses'
  | 'peso'
  | 'kilometros'
  | 'litros'
  | 'galones'
  | 'unidades'
  | 'piezas'
  | 'caja'
  | 'paquete'
  | 'servicio'
  | 'personalizado';

export type ResourceCategory =
  | 'Materiales'
  | 'Servicios'
  | 'Herramientas'
  | 'Equipos'
  | 'Personal'
  | 'Acabados'
  | 'Publicidad'
  | 'Transporte'
  | 'Alquiler'
  | 'Otros';

export interface BudgetResource {
  id: string;
  code: string;
  sku?: string;
  name: string;
  description?: string;
  category: ResourceCategory | string;
  unit: string; // e.g. "m2", "m3", "ml", "hrs", "unidad", "kg", "gal"
  cost: number;
  price: number;
  taxRate: number; // e.g. 18
  calculationType: CalculationType;
  supplierName?: string;
  imageUrl?: string;
  color?: string; // Hex tag color
  tags?: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
  notes?: string;
  createdAt: string;
}

export interface BudgetGlobalVariable {
  id: string;
  name: string;
  key: string; // e.g. ITBIS, MARGEN, DESPERDICIO, COMBUSTIBLE
  value: number; // e.g. 18 for 18%, 1.15 for multiplier, 500 for fixed
  type: 'percentage' | 'fixed_amount' | 'multiplier';
  description?: string;
  isDefault?: boolean;
}

export interface BudgetItemInput {
  ancho?: number;
  alto?: number;
  largo?: number;
  cantidad?: number;
  horas?: number;
  empleados?: number;
  distanciaKm?: number;
  viajes?: number;
  dias?: number;
  pesoKg?: number;
  factorDesperdicioPct?: number; // e.g. 5 for 5% waste
  factorMargenPct?: number; // e.g. 30 for 30% margin
  [key: string]: number | undefined;
}

export interface BudgetItem {
  id: string;
  resourceId?: string;
  resourceName: string;
  category: string;
  unit: string;
  calculationType: CalculationType;
  inputs: BudgetItemInput;
  unitCost: number;
  unitPrice: number;
  quantityCalculated: number;
  subtotalCost: number;
  subtotalPrice: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
}

export interface BudgetGroup {
  id: string;
  name: string; // e.g. "Materiales Base", "Instalación y Mano de Obra", "Transporte"
  items: BudgetItem[];
  subtotalCost: number;
  subtotalPrice: number;
  taxTotal: number;
  total: number;
}

export interface BudgetTemplateItem {
  id: string;
  groupName: string;
  resourceId: string;
  defaultInputs?: BudgetItemInput;
}

export interface BudgetTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  industryTag?: string; // e.g. Imprenta, Constructora, Ferretería, Eventos
  items: BudgetTemplateItem[];
  isFavorite?: boolean;
  isArchived?: boolean;
  version: number;
  createdAt: string;
}

export type BudgetStatus = 'Borrador' | 'Enviado' | 'Aprobado' | 'Rechazado' | 'Convertido';

export interface BudgetAttachment {
  id: string;
  name: string;
  url: string;
  fileType: string; // e.g. "pdf", "dwg", "cad", "png", "xlsx"
  sizeBytes?: number;
  uploadedAt: string;
}

export interface Budget {
  id: string;
  budgetNumber: string; // e.g. PRES-2026-0001
  title: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;
  templateId?: string;
  templateName?: string;
  version: number;
  status: BudgetStatus;
  viewMode?: 'cliente' | 'interno' | 'produccion' | 'contabilidad';
  groups: BudgetGroup[];
  globalVariables: Record<string, number>;
  subtotalCost: number;
  subtotalPrice: number;
  discountRate?: number;
  discountAmount?: number;
  taxTotal: number;
  total: number;
  profitMarginAmount?: number;
  profitMarginPct?: number;
  notes?: string;
  tags?: string[];
  attachments?: BudgetAttachment[];
  isFavorite?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  convertedToQuoteId?: string;
  convertedToQuoteNo?: string;
  convertedToInvoiceId?: string;
  convertedToInvoiceNo?: string;
  clientSignatureUrl?: string;
  clientSignatureDate?: string;
  isStockReserved?: boolean;
  workOrderNo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetProject {
  id: string;
  projectNumber: string; // e.g. PRJ-2026-001
  name: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  budgetIds: string[];
  status: 'En Planificación' | 'En Ejecución' | 'Completado' | 'Cancelado';
  totalAmount: number;
  notes?: string;
  attachments?: BudgetAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAuditLog {
  id: string;
  budgetId: string;
  budgetNumber: string;
  action: 'CREAR' | 'EDITAR' | 'VERSIONAR' | 'CONVERTIR' | 'ELIMINAR' | 'RESTAURAR';
  userName: string;
  userRole?: string;
  date: string;
  ipAddress?: string;
  device?: string;
  reason?: string;
  beforeSnapshot?: string;
  afterSnapshot?: string;
}

export interface BudgetRolePermission {
  role: 'Administrador' | 'Supervisor' | 'Ventas' | 'Producción' | 'Contabilidad' | 'Invitado';
  canCreateBudget: boolean;
  canEditBudget: boolean;
  canDeleteBudget: boolean;
  canApproveBudget: boolean;
  canViewCosts: boolean;
  canManageResources: boolean;
  canManageTemplates: boolean;
}
