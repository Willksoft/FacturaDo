import { useState, useEffect } from 'react';
import {
  BudgetResource,
  BudgetTemplate,
  Budget,
  BudgetProject,
  BudgetGlobalVariable,
  BudgetAuditLog,
  BudgetItem,
  BudgetItemInput,
  BudgetGroup,
  CalculationType
} from '../types/budget';
import { insforge } from '../lib/insforge';

// Initial Mock Seed Data for Instant Demonstration across Industries
const INITIAL_RESOURCES: BudgetResource[] = [
  {
    id: 'res-001',
    code: 'RES-MAT-01',
    sku: 'PVC-10MM-4X8',
    name: 'Plancha PVC Celular 10mm (4x8ft)',
    description: 'Sustrato rígido exterior imputrescible ideal para rotulación y letreros.',
    category: 'Materiales',
    unit: 'm2',
    cost: 1200,
    price: 2400,
    taxRate: 18,
    calculationType: 'area',
    supplierName: 'Plásticos Dominicanos',
    color: '#3b82f6',
    tags: ['Rotulación', 'Imprenta', 'Exterior'],
    isFavorite: true,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'res-002',
    code: 'RES-SER-01',
    sku: 'INST-EXT-01',
    name: 'Mano de Obra Instalación Exterior (Hora Técnico)',
    description: 'Servicio de montaje e instalación en sitio por técnico certificado.',
    category: 'Servicios',
    unit: 'hrs',
    cost: 450,
    price: 950,
    taxRate: 18,
    calculationType: 'horas',
    supplierName: 'Interno',
    color: '#10b981',
    tags: ['Instalación', 'Personal', 'Mano de Obra'],
    isFavorite: true,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'res-003',
    code: 'RES-EQU-01',
    sku: 'ALQ-GRUA-15M',
    name: 'Alquiler de Grúa Articulada 15m (Día)',
    description: 'Alquiler con operador para trabajos en altura.',
    category: 'Equipos',
    unit: 'dias',
    cost: 4500,
    price: 8500,
    taxRate: 18,
    calculationType: 'dias',
    supplierName: 'Equipos y Gruas del Este',
    color: '#f59e0b',
    tags: ['Equipos', 'Construcción', 'Altura'],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'res-004',
    code: 'RES-TRN-01',
    sku: 'FLETE-LOCAL',
    name: 'Transporte y Flete de Materiales (Km)',
    description: 'Envío y flete terrestre según kilometraje y número de viajes.',
    category: 'Transporte',
    unit: 'km',
    cost: 35,
    price: 75,
    taxRate: 18,
    calculationType: 'kilometros',
    supplierName: 'Fletes Rápido RD',
    color: '#8b5cf6',
    tags: ['Transporte', 'Flete'],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'res-005',
    code: 'RES-MAT-02',
    sku: 'MELAMINA-18MM',
    name: 'Plancha Melamina Hidrófuga 18mm',
    description: 'Tablero aglomerado hidrófugo para carpintería y cocinas modulares.',
    category: 'Materiales',
    unit: 'm2',
    cost: 1800,
    price: 3200,
    taxRate: 18,
    calculationType: 'area',
    supplierName: 'Maderas y Diseños SRL',
    color: '#ec4899',
    tags: ['Carpintería', 'Muebles', 'Cocinas'],
    isFavorite: true,
    createdAt: '2026-01-12T10:00:00Z'
  }
];

const INITIAL_VARIABLES: BudgetGlobalVariable[] = [
  { id: 'var-01', name: 'ITBIS Fiscal', key: 'ITBIS', value: 18, type: 'percentage', description: 'Impuesto gubernamental ITBIS estándar 18%', isDefault: true },
  { id: 'var-02', name: 'Margen de Ganancia Promedio', key: 'MARGEN', value: 35, type: 'percentage', description: 'Margen comercial sugerido sobre costo base', isDefault: true },
  { id: 'var-03', name: 'Factor Desperdicio Materiales', key: 'DESPERDICIO', value: 8, type: 'percentage', description: 'Margen técnico por cortes y merma de material', isDefault: true },
  { id: 'var-04', name: 'Costo Combustible Galón', key: 'COMBUSTIBLE', value: 290, type: 'fixed_amount', description: 'Precio base de galón diésel/gasolina para fletes' }
];

const INITIAL_TEMPLATES: BudgetTemplate[] = [
  {
    id: 'tpl-001',
    code: 'TPL-ROT-01',
    name: 'Letrero Exterior PVC / Vinil Impreso',
    description: 'Plantilla estandarizada para cotización de letreros comerciales exteriores.',
    category: 'Publicidad & Rotulación',
    industryTag: 'Imprenta / Rotulación',
    version: 1,
    isFavorite: true,
    items: [
      { id: 'tpi-1', groupName: 'Sustratos y Materiales', resourceId: 'res-001', defaultInputs: { cantidad: 1, factorDesperdicioPct: 8 } },
      { id: 'tpi-2', groupName: 'Instalación y Mano de Obra', resourceId: 'res-002', defaultInputs: { horas: 4, empleados: 2 } },
      { id: 'tpi-3', groupName: 'Transporte y Logística', resourceId: 'res-004', defaultInputs: { distanciaKm: 25, viajes: 1 } }
    ],
    createdAt: '2026-01-15T10:00:00Z'
  }
];

const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'pres-1001',
    budgetNumber: 'PRES-2026-0001',
    title: 'Fabricación e Instalación Letrero Fachada Principal',
    clientName: 'Empresa Comercial ABC SRL',
    version: 1,
    status: 'Enviado',
    viewMode: 'cliente',
    globalVariables: { ITBIS: 18, MARGEN: 35, DESPERDICIO: 8 },
    groups: [
      {
        id: 'grp-1',
        name: 'Sustratos y Materiales Base',
        subtotalCost: 11232,
        subtotalPrice: 22464,
        taxTotal: 4043.52,
        total: 26507.52,
        items: [
          {
            id: 'item-1',
            resourceId: 'res-001',
            resourceName: 'Plancha PVC Celular 10mm (4x8ft)',
            category: 'Materiales',
            unit: 'm2',
            calculationType: 'area',
            inputs: { ancho: 3.5, alto: 2.4, cantidad: 1, factorDesperdicioPct: 8 },
            unitCost: 1200,
            unitPrice: 2400,
            quantityCalculated: 9.07,
            subtotalCost: 10886.4,
            subtotalPrice: 21768,
            taxRate: 18,
            taxAmount: 3918.24,
            total: 25686.24,
            notes: 'Plancha PVC tratada contra rayos UV'
          }
        ]
      },
      {
        id: 'grp-2',
        name: 'Servicios de Instalación y Flete',
        subtotalCost: 4500,
        subtotalPrice: 9500,
        taxTotal: 1710,
        total: 11210,
        items: [
          {
            id: 'item-2',
            resourceId: 'res-002',
            resourceName: 'Mano de Obra Instalación Exterior',
            category: 'Servicios',
            unit: 'hrs',
            calculationType: 'horas',
            inputs: { horas: 5, empleados: 2 },
            unitCost: 450,
            unitPrice: 950,
            quantityCalculated: 10,
            subtotalCost: 4500,
            subtotalPrice: 9500,
            taxRate: 18,
            taxAmount: 1710,
            total: 11210
          }
        ]
      }
    ],
    subtotalCost: 15732,
    subtotalPrice: 31964,
    taxTotal: 5753.52,
    total: 37717.52,
    profitMarginAmount: 16232,
    profitMarginPct: 50.78,
    notes: 'Presupuesto válido por 15 días calendarios.',
    tags: ['Fachada', 'Urgente'],
    isFavorite: true,
    createdAt: '2026-01-20T14:30:00Z',
    updatedAt: '2026-01-20T14:30:00Z'
  }
];

export function calculateBudgetItemQuantity(type: CalculationType, inputs: BudgetItemInput): number {
  const qty = inputs.cantidad || 1;
  const wasteMult = 1 + ((inputs.factorDesperdicioPct || 0) / 100);

  switch (type) {
    case 'precio_fijo':
      return 1;
    case 'cantidad':
    case 'unidades':
    case 'piezas':
    case 'caja':
    case 'paquete':
    case 'servicio':
      return qty;
    case 'area': {
      const w = inputs.ancho || 0;
      const h = inputs.alto || 0;
      return Number((w * h * qty * wasteMult).toFixed(4));
    }
    case 'volumen': {
      const l = inputs.largo || 0;
      const w = inputs.ancho || 0;
      const h = inputs.alto || 0;
      return Number((l * w * h * qty * wasteMult).toFixed(4));
    }
    case 'perimetro':
    case 'metros_lineales': {
      const w = inputs.ancho || 0;
      const h = inputs.alto || 0;
      const linear = (w + h) * 2;
      return Number((linear * qty * wasteMult).toFixed(4));
    }
    case 'horas': {
      const hrs = inputs.horas || 0;
      const emp = inputs.empleados || 1;
      return hrs * emp * qty;
    }
    case 'dias': {
      const d = inputs.dias || 1;
      return d * qty;
    }
    case 'kilometros': {
      const km = inputs.distanciaKm || 0;
      const trips = inputs.viajes || 1;
      return km * trips * qty;
    }
    case 'peso': {
      const kg = inputs.pesoKg || 0;
      return kg * qty * wasteMult;
    }
    default:
      return qty;
  }
}

export function useBudgetState() {
  const [resources, setResources] = useState<BudgetResource[]>(() => {
    const saved = localStorage.getItem('budget_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [globalVariables, setGlobalVariables] = useState<BudgetGlobalVariable[]>(() => {
    const saved = localStorage.getItem('budget_global_vars');
    return saved ? JSON.parse(saved) : INITIAL_VARIABLES;
  });

  const [templates, setTemplates] = useState<BudgetTemplate[]>(() => {
    const saved = localStorage.getItem('budget_templates');
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budget_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [projects, setProjects] = useState<BudgetProject[]>(() => {
    const saved = localStorage.getItem('budget_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<BudgetAuditLog[]>(() => {
    const saved = localStorage.getItem('budget_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to LocalStorage & async InsForge DB
  useEffect(() => {
    localStorage.setItem('budget_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('budget_global_vars', JSON.stringify(globalVariables));
  }, [globalVariables]);

  useEffect(() => {
    localStorage.setItem('budget_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('budget_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('budget_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('budget_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Resource CRUD
  const saveResource = (resourceData: Omit<BudgetResource, 'id' | 'createdAt'> & { id?: string }) => {
    if (resourceData.id) {
      setResources(prev => prev.map(r => r.id === resourceData.id ? { ...r, ...resourceData } as BudgetResource : r));
    } else {
      const newRes: BudgetResource = {
        ...resourceData,
        id: `res-${Date.now()}`,
        code: resourceData.code || `RES-${Math.floor(Math.random() * 899 + 100)}`,
        createdAt: new Date().toISOString()
      };
      setResources(prev => [newRes, ...prev]);
    }
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const toggleFavoriteResource = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  // Global Variable CRUD
  const saveGlobalVariable = (variable: BudgetGlobalVariable) => {
    setGlobalVariables(prev => {
      const exists = prev.some(v => v.id === variable.id);
      if (exists) return prev.map(v => v.id === variable.id ? variable : v);
      return [...prev, variable];
    });
  };

  const deleteGlobalVariable = (id: string) => {
    setGlobalVariables(prev => prev.filter(v => v.id !== id));
  };

  // Template CRUD
  const saveTemplate = (templateData: Omit<BudgetTemplate, 'id' | 'createdAt'> & { id?: string }) => {
    if (templateData.id) {
      setTemplates(prev => prev.map(t => t.id === templateData.id ? { ...t, ...templateData } as BudgetTemplate : t));
    } else {
      const newTpl: BudgetTemplate = {
        ...templateData,
        id: `tpl-${Date.now()}`,
        code: templateData.code || `TPL-${Math.floor(Math.random() * 899 + 100)}`,
        createdAt: new Date().toISOString()
      };
      setTemplates(prev => [newTpl, ...prev]);
    }
  };

  const duplicateTemplate = (id: string) => {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    const dup: BudgetTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copia)`,
      code: `TPL-${Math.floor(Math.random() * 899 + 100)}`,
      createdAt: new Date().toISOString()
    };
    setTemplates(prev => [dup, ...prev]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Budget CRUD & Business Actions
  const saveBudget = (budgetData: Partial<Budget> & { title: string }) => {
    const isUpdate = !!budgetData.id;
    let budgetId = budgetData.id || `pres-${Date.now()}`;
    const budgetNum = budgetData.budgetNumber || `PRES-${new Date().getFullYear()}-${String(budgets.length + 1).padStart(4, '0')}`;

    const newBudget: Budget = {
      id: budgetId,
      budgetNumber: budgetNum,
      title: budgetData.title,
      clientName: budgetData.clientName || 'Cliente General',
      clientId: budgetData.clientId,
      projectId: budgetData.projectId,
      projectName: budgetData.projectName,
      templateId: budgetData.templateId,
      templateName: budgetData.templateName,
      version: budgetData.version || 1,
      status: budgetData.status || 'Borrador',
      viewMode: budgetData.viewMode || 'interno',
      groups: budgetData.groups || [],
      globalVariables: budgetData.globalVariables || { ITBIS: 18 },
      subtotalCost: budgetData.subtotalCost || 0,
      subtotalPrice: budgetData.subtotalPrice || 0,
      taxTotal: budgetData.taxTotal || 0,
      total: budgetData.total || 0,
      profitMarginAmount: (budgetData.subtotalPrice || 0) - (budgetData.subtotalCost || 0),
      profitMarginPct: budgetData.subtotalCost ? Number((((budgetData.subtotalPrice! - budgetData.subtotalCost!) / budgetData.subtotalCost!) * 100).toFixed(2)) : 0,
      notes: budgetData.notes,
      tags: budgetData.tags || [],
      attachments: budgetData.attachments || [],
      isFavorite: budgetData.isFavorite || false,
      isArchived: budgetData.isArchived || false,
      isDeleted: false,
      createdAt: budgetData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => {
      const exists = prev.some(b => b.id === budgetId);
      if (exists) return prev.map(b => b.id === budgetId ? newBudget : b);
      return [newBudget, ...prev];
    });

    // Add Audit Log
    const newLog: BudgetAuditLog = {
      id: `log-${Date.now()}`,
      budgetId: newBudget.id,
      budgetNumber: newBudget.budgetNumber,
      action: isUpdate ? 'EDITAR' : 'CREAR',
      userName: 'Usuario Activo',
      date: new Date().toISOString(),
      reason: isUpdate ? 'Modificación de montos / recursos' : 'Creación de nuevo presupuesto'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    return newBudget;
  };

  const duplicateBudget = (id: string) => {
    const target = budgets.find(b => b.id === id);
    if (!target) return null;

    const newId = `pres-${Date.now()}`;
    const newNum = `PRES-${new Date().getFullYear()}-${String(budgets.length + 1).padStart(4, '0')}`;

    const dup: Budget = {
      ...target,
      id: newId,
      budgetNumber: newNum,
      title: `${target.title} (Copia)`,
      status: 'Borrador',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => [dup, ...prev]);

    // Audit log
    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      budgetId: dup.id,
      budgetNumber: dup.budgetNumber,
      action: 'CREAR',
      userName: 'Usuario Activo',
      date: new Date().toISOString(),
      reason: `Duplicado a partir de ${target.budgetNumber}`
    }, ...prev]);

    return dup;
  };

  const createNewVersionBudget = (id: string) => {
    const target = budgets.find(b => b.id === id);
    if (!target) return null;

    const newVersionNum = target.version + 1;
    const updated: Budget = {
      ...target,
      version: newVersionNum,
      status: 'Borrador',
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => prev.map(b => b.id === id ? updated : b));

    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      budgetId: target.id,
      budgetNumber: target.budgetNumber,
      action: 'VERSIONAR',
      userName: 'Usuario Activo',
      date: new Date().toISOString(),
      reason: `Generada nueva versión v${newVersionNum}`
    }, ...prev]);

    return updated;
  };

  const moveToTrash = (id: string) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, isDeleted: true } : b));
  };

  const restoreFromTrash = (id: string) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, isDeleted: false } : b));
  };

  const deleteBudgetPermanently = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const saveClientSignature = (id: string, signatureDataUrl: string, signerName: string) => {
    const target = budgets.find(b => b.id === id);
    if (!target) return;

    const updated: Budget = {
      ...target,
      status: 'Aprobado',
      clientName: signerName || target.clientName,
      clientSignatureUrl: signatureDataUrl,
      clientSignatureDate: new Date().toISOString(),
      isStockReserved: true,
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => prev.map(b => b.id === id ? updated : b));

    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      budgetId: target.id,
      budgetNumber: target.budgetNumber,
      action: 'APROBAR',
      userName: signerName || 'Cliente (Firma Digital)',
      date: new Date().toISOString(),
      reason: 'Aprobado con firma digital en pantalla y reserva automática de stock.'
    }, ...prev]);
  };

  return {
    resources,
    globalVariables,
    templates,
    budgets,
    projects,
    auditLogs,
    saveResource,
    deleteResource,
    toggleFavoriteResource,
    saveGlobalVariable,
    deleteGlobalVariable,
    saveTemplate,
    duplicateTemplate,
    deleteTemplate,
    saveBudget,
    duplicateBudget,
    createNewVersionBudget,
    moveToTrash,
    restoreFromTrash,
    deleteBudgetPermanently,
    toggleFavoriteBudget,
    saveProject,
    saveClientSignature
  };
}
