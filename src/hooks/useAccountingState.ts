import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AccountItem, 
  JournalEntry, 
  FixedAsset, 
  FiscalPeriod, 
  Dgii608Item, 
  Dgii609Item, 
  DgiiIt1Draft 
} from '../types/accounting';

const INITIAL_CHART_OF_ACCOUNTS: AccountItem[] = [
  // 1. ACTIVOS
  { id: 'acc-100', code: '1.0.0.00', name: 'ACTIVOS', category: 'ACTIVO', balance: 0, isHeader: true, isSystem: true },
  { id: 'acc-111', code: '1.1.1.01', name: 'Caja General y Efectivo', category: 'ACTIVO', parentCode: '1.0.0.00', balance: 145000, isSystem: true },
  { id: 'acc-112', code: '1.1.1.02', name: 'Bancos y Cuentas Bancarias', category: 'ACTIVO', parentCode: '1.0.0.00', balance: 380000, isSystem: true },
  { id: 'acc-113', code: '1.1.2.01', name: 'Cuentas por Cobrar Clientes', category: 'ACTIVO', parentCode: '1.0.0.00', balance: 95000, isSystem: true },
  { id: 'acc-114', code: '1.1.3.01', name: 'Inventario de Mercancías', category: 'ACTIVO', parentCode: '1.0.0.00', balance: 210000, isSystem: true },
  { id: 'acc-121', code: '1.2.1.01', name: 'Propiedad, Planta y Equipos (Activos Fijos)', category: 'ACTIVO', parentCode: '1.0.0.00', balance: 450000, isSystem: true },
  { id: 'acc-122', code: '1.2.1.02', name: '(-) Depreciación Acumulada', category: 'ACTIVO', parentCode: '1.0.0.00', balance: -45000, isSystem: true },

  // 2. PASIVOS
  { id: 'acc-200', code: '2.0.0.00', name: 'PASIVOS', category: 'PASIVO', balance: 0, isHeader: true, isSystem: true },
  { id: 'acc-211', code: '2.1.1.01', name: 'Cuentas por Pagar Proveedores', category: 'PASIVO', parentCode: '2.0.0.00', balance: 68000, isSystem: true },
  { id: 'acc-212', code: '2.1.2.01', name: 'ITBIS por Pagar a DGII', category: 'PASIVO', parentCode: '2.0.0.00', balance: 28400, isSystem: true },
  { id: 'acc-213', code: '2.1.3.01', name: 'Retenciones de ISR por Pagar', category: 'PASIVO', parentCode: '2.0.0.00', balance: 12500, isSystem: true },

  // 3. PATRIMONIO
  { id: 'acc-300', code: '3.0.0.00', name: 'PATRIMONIO', category: 'PATRIMONIO', balance: 0, isHeader: true, isSystem: true },
  { id: 'acc-311', code: '3.1.1.01', name: 'Capital Social Autorizado', category: 'PATRIMONIO', parentCode: '3.0.0.00', balance: 500000, isSystem: true },
  { id: 'acc-321', code: '3.2.1.01', name: 'Utilidades Acumuladas / Ejercicio', category: 'PATRIMONIO', parentCode: '3.0.0.00', balance: 626100, isSystem: true },

  // 4. INGRESOS
  { id: 'acc-400', code: '4.0.0.00', name: 'INGRESOS OPERATIVOS', category: 'INGRESO', balance: 0, isHeader: true, isSystem: true },
  { id: 'acc-411', code: '4.1.1.01', name: 'Ventas de Productos y Servicios', category: 'INGRESO', parentCode: '4.0.0.00', balance: 850000, isSystem: true },

  // 5. COSTOS
  { id: 'acc-500', code: '5.0.0.00', name: 'COSTOS DE VENTAS', category: 'COSTO', balance: 0, isHeader: true, isSystem: true },
  { id: 'acc-511', code: '5.1.1.01', name: 'Costo de Mercancías Vendidas', category: 'COSTO', parentCode: '5.0.0.00', balance: 340000, isSystem: true },

  // 6. GASTOS
  { id: 'acc-600', code: '6.0.0.00', name: 'GASTOS OPERATIVOS', category: 'GASTO', balance: 0, isHeader: true, isSystem: true },
  { id: 'acc-611', code: '6.1.1.01', name: 'Gastos de Nómina y Personal', category: 'GASTO', parentCode: '6.0.0.00', balance: 110000, isSystem: true },
  { id: 'acc-612', code: '6.1.1.02', name: 'Gastos de Alquiler y Servicios Públicos', category: 'GASTO', parentCode: '6.0.0.00', balance: 45000, isSystem: true },
  { id: 'acc-613', code: '6.1.2.01', name: 'Gastos de Depreciación de Activos', category: 'GASTO', parentCode: '6.0.0.00', balance: 18000, isSystem: true },
  { id: 'acc-614', code: '6.1.3.01', name: 'Comisiones y Comisiones Bancarias', category: 'GASTO', parentCode: '6.0.0.00', balance: 10900, isSystem: true },
];

const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-101',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    concept: 'Registro automático de venta fiscal comprobante B0100000042',
    reference: 'B0100000042',
    totalDebit: 11800,
    totalCredit: 11800,
    isAutomatic: true,
    sourceDocument: 'INVOICE',
    lines: [
      { id: 'l1', accountCode: '1.1.1.01', accountName: 'Caja General y Efectivo', debit: 11800, credit: 0 },
      { id: 'l2', accountCode: '4.1.1.01', accountName: 'Ventas de Productos y Servicios', debit: 0, credit: 10000 },
      { id: 'l3', accountCode: '2.1.2.01', accountName: 'ITBIS por Pagar a DGII', debit: 0, credit: 1800 },
    ]
  },
  {
    id: 'je-102',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    concept: 'Registro automático de compra con NCF B0100000109',
    reference: 'EXP-2026-004',
    totalDebit: 5900,
    totalCredit: 5900,
    isAutomatic: true,
    sourceDocument: 'EXPENSE',
    lines: [
      { id: 'l4', accountCode: '6.1.1.02', accountName: 'Gastos de Alquiler y Servicios Públicos', debit: 5000, credit: 0 },
      { id: 'l5', accountCode: '2.1.2.01', accountName: 'ITBIS por Pagar a DGII', debit: 900, credit: 0 },
      { id: 'l6', accountCode: '1.1.1.02', accountName: 'Bancos y Cuentas Bancarias', debit: 0, credit: 5900 },
    ]
  }
];

const INITIAL_FIXED_ASSETS: FixedAsset[] = [
  {
    id: 'fa-001',
    code: 'ACT-001',
    name: 'Computadoras de Oficina i7 (Set 3 Unidades)',
    category: 'CAT_2_EQUIPOS_VEHICULOS',
    ratePercent: 25,
    acquisitionDate: '2025-01-15',
    acquisitionCost: 120000,
    accumulatedDepreciation: 30000,
    currentBookValue: 90000,
    status: 'ACTIVO',
    notes: 'Uso en departamento contable y caja'
  },
  {
    id: 'fa-002',
    code: 'ACT-002',
    name: 'Camioneta de Reparto Hilux 2023',
    category: 'CAT_2_EQUIPOS_VEHICULOS',
    ratePercent: 25,
    acquisitionDate: '2024-06-10',
    acquisitionCost: 850000,
    accumulatedDepreciation: 318750,
    currentBookValue: 531250,
    status: 'ACTIVO',
    notes: 'Entregas a domicilio clientes'
  }
];

const INITIAL_FISCAL_PERIODS: FiscalPeriod[] = [
  { id: 'fp-2026-05', year: 2026, month: 5, label: 'Mayo 2026', status: 'CLOSED', closedAt: '2026-06-01T10:00:00Z', closedBy: 'admin@facturado.do', totalIncome: 740000, totalExpense: 310000, netProfit: 430000 },
  { id: 'fp-2026-06', year: 2026, month: 6, label: 'Junio 2026', status: 'OPEN', totalIncome: 850000, totalExpense: 383900, netProfit: 466100 },
  { id: 'fp-2026-07', year: 2026, month: 7, label: 'Julio 2026', status: 'OPEN', totalIncome: 11800, totalExpense: 5900, netProfit: 5900 },
];

export function useAccountingState() {
  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    try {
      const saved = localStorage.getItem('facturado_chart_accounts');
      return saved ? JSON.parse(saved) : INITIAL_CHART_OF_ACCOUNTS;
    } catch {
      return INITIAL_CHART_OF_ACCOUNTS;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('facturado_journal_entries');
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(() => {
    try {
      const saved = localStorage.getItem('facturado_fixed_assets');
      return saved ? JSON.parse(saved) : INITIAL_FIXED_ASSETS;
    } catch {
      return INITIAL_FIXED_ASSETS;
    }
  });

  const [fiscalPeriods, setFiscalPeriods] = useState<FiscalPeriod[]>(() => {
    try {
      const saved = localStorage.getItem('facturado_fiscal_periods');
      return saved ? JSON.parse(saved) : INITIAL_FISCAL_PERIODS;
    } catch {
      return INITIAL_FISCAL_PERIODS;
    }
  });

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('facturado_chart_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.warn('Could not save accounts to localStorage', e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('facturado_journal_entries', JSON.stringify(journalEntries));
    } catch (e) {
      console.warn('Could not save journal entries to localStorage', e);
    }
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem('facturado_fixed_assets', JSON.stringify(fixedAssets));
    } catch (e) {
      console.warn('Could not save fixed assets to localStorage', e);
    }
  }, [fixedAssets]);

  useEffect(() => {
    try {
      localStorage.setItem('facturado_fiscal_periods', JSON.stringify(fiscalPeriods));
    } catch (e) {
      console.warn('Could not save fiscal periods to localStorage', e);
    }
  }, [fiscalPeriods]);

  // Add Account
  const addAccount = useCallback((newAccount: Omit<AccountItem, 'id' | 'balance'>) => {
    const item: AccountItem = {
      ...newAccount,
      id: `acc-${Date.now()}`,
      balance: 0
    };
    setAccounts(prev => [...prev, item]);
    return item;
  }, []);

  // Post Manual Journal Entry
  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `je-${Date.now()}`
    };

    setJournalEntries(prev => [newEntry, ...prev]);

    // Update Account Balances
    setAccounts(prevAccounts => {
      const updatedMap = new Map<string, AccountItem>(prevAccounts.map(a => [a.code, { ...a }]));

      for (const line of newEntry.lines) {
        const acc = updatedMap.get(line.accountCode);
        if (acc) {
          if (acc.category === 'ACTIVO' || acc.category === 'COSTO' || acc.category === 'GASTO') {
            acc.balance += (line.debit - line.credit);
          } else {
            acc.balance += (line.credit - line.debit);
          }
          updatedMap.set(line.accountCode, acc);
        }
      }

      return Array.from(updatedMap.values());
    });

    return newEntry;
  }, []);

  // Post Automatic Journal Entry from Invoices
  const postInvoiceJournalEntry = useCallback((invoice: {
    id: string;
    ncf?: string;
    subtotal: number;
    itbis: number;
    total: number;
    paymentMethod?: string;
  }) => {
    const subtotal = invoice.subtotal || 0;
    const itbis = invoice.itbis || 0;
    const total = invoice.total || (subtotal + itbis);
    const codeDebit = (invoice.paymentMethod?.toLowerCase().includes('crédito') || invoice.paymentMethod?.toLowerCase().includes('credito')) 
      ? '1.1.2.01' // Cuentas por cobrar
      : '1.1.1.01'; // Caja general

    const entry: Omit<JournalEntry, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      concept: `Venta fiscal con comprobante ${invoice.ncf || invoice.id}`,
      reference: invoice.ncf || invoice.id,
      totalDebit: total,
      totalCredit: total,
      isAutomatic: true,
      sourceDocument: 'INVOICE',
      sourceId: invoice.id,
      lines: [
        {
          id: `l-${Date.now()}-1`,
          accountCode: codeDebit,
          accountName: codeDebit === '1.1.2.01' ? 'Cuentas por Cobrar Clientes' : 'Caja General y Efectivo',
          debit: total,
          credit: 0,
        },
        {
          id: `l-${Date.now()}-2`,
          accountCode: '4.1.1.01',
          accountName: 'Ventas de Productos y Servicios',
          debit: 0,
          credit: subtotal,
        },
        ...(itbis > 0 ? [{
          id: `l-${Date.now()}-3`,
          accountCode: '2.1.2.01',
          accountName: 'ITBIS por Pagar a DGII',
          debit: 0,
          credit: itbis,
        }] : [])
      ]
    };

    return addJournalEntry(entry);
  }, [addJournalEntry]);

  // Post Automatic Journal Entry from Expenses
  const postExpenseJournalEntry = useCallback((expense: {
    id: string;
    concept: string;
    amount: number;
    itbis?: number;
    ncf?: string;
    paymentMethod?: string;
  }) => {
    const total = expense.amount || 0;
    const itbis = expense.itbis || 0;
    const netAmount = total - itbis;

    const entry: Omit<JournalEntry, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      concept: `Registro de Gasto: ${expense.concept} ${expense.ncf ? `(NCF ${expense.ncf})` : ''}`,
      reference: expense.ncf || expense.id,
      totalDebit: total,
      totalCredit: total,
      isAutomatic: true,
      sourceDocument: 'EXPENSE',
      sourceId: expense.id,
      lines: [
        {
          id: `l-${Date.now()}-exp1`,
          accountCode: '6.1.1.01',
          accountName: 'Gastos Operativos y Administrativos',
          debit: netAmount,
          credit: 0
        },
        ...(itbis > 0 ? [{
          id: `l-${Date.now()}-exp2`,
          accountCode: '2.1.2.01',
          accountName: 'ITBIS por Pagar a DGII',
          debit: itbis,
          credit: 0
        }] : []),
        {
          id: `l-${Date.now()}-exp3`,
          accountCode: '1.1.1.01',
          accountName: 'Caja General y Efectivo',
          debit: 0,
          credit: total
        }
      ]
    };

    return addJournalEntry(entry);
  }, [addJournalEntry]);

  // Add Fixed Asset
  const addFixedAsset = useCallback((asset: Omit<FixedAsset, 'id' | 'accumulatedDepreciation' | 'currentBookValue' | 'status'>) => {
    const newAsset: FixedAsset = {
      ...asset,
      id: `fa-${Date.now()}`,
      accumulatedDepreciation: 0,
      currentBookValue: asset.acquisitionCost,
      status: 'ACTIVO'
    };
    setFixedAssets(prev => [newAsset, ...prev]);
    return newAsset;
  }, []);

  // Calculate & Post Monthly Depreciation
  const runAssetDepreciation = useCallback((assetId: string) => {
    setFixedAssets(prev => prev.map(asset => {
      if (asset.id !== assetId || asset.status !== 'ACTIVO') return asset;

      const annualAmount = (asset.acquisitionCost * asset.ratePercent) / 100;
      const monthlyAmount = Math.round((annualAmount / 12) * 100) / 100;
      const newAccumulated = Math.min(asset.acquisitionCost, asset.accumulatedDepreciation + monthlyAmount);
      const newBookValue = Math.max(0, asset.acquisitionCost - newAccumulated);

      // Post Journal Entry for Depreciation
      addJournalEntry({
        date: new Date().toISOString().split('T')[0],
        concept: `Depreciación Mensual de Activo: ${asset.name} (${asset.code})`,
        reference: asset.code,
        totalDebit: monthlyAmount,
        totalCredit: monthlyAmount,
        isAutomatic: true,
        sourceDocument: 'ASSET',
        sourceId: asset.id,
        lines: [
          {
            id: `dep-l1-${Date.now()}`,
            accountCode: '6.1.2.01',
            accountName: 'Gastos de Depreciación de Activos',
            debit: monthlyAmount,
            credit: 0
          },
          {
            id: `dep-l2-${Date.now()}`,
            accountCode: '1.2.1.02',
            accountName: '(-) Depreciación Acumulada',
            debit: 0,
            credit: monthlyAmount
          }
        ]
      });

      return {
        ...asset,
        accumulatedDepreciation: newAccumulated,
        currentBookValue: newBookValue,
        status: newBookValue <= 0 ? 'DEPRECIADO' : 'ACTIVO'
      };
    }));
  }, [addJournalEntry]);

  // Close Fiscal Period
  const closeFiscalPeriod = useCallback((periodId: string, username: string = 'Admin') => {
    setFiscalPeriods(prev => prev.map(period => {
      if (period.id !== periodId) return period;
      return {
        ...period,
        status: 'CLOSED',
        closedAt: new Date().toISOString(),
        closedBy: username
      };
    }));
  }, []);

  // Compute Balance Sheet Metrics ($A = P + E$)
  const balanceSheet = useMemo(() => {
    const totalAssets = accounts.filter(a => a.category === 'ACTIVO' && !a.isHeader).reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = accounts.filter(a => a.category === 'PASIVO' && !a.isHeader).reduce((sum, a) => sum + a.balance, 0);
    const totalEquity = accounts.filter(a => a.category === 'PATRIMONIO' && !a.isHeader).reduce((sum, a) => sum + a.balance, 0);

    const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1;

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      isBalanced,
      difference: Math.abs(totalAssets - (totalLiabilities + totalEquity))
    };
  }, [accounts]);

  // Compute Profit & Loss (P&L) Statement
  const profitAndLoss = useMemo(() => {
    const totalIncome = accounts.filter(a => a.category === 'INGRESO' && !a.isHeader).reduce((sum, a) => sum + a.balance, 0);
    const totalCostOfSales = accounts.filter(a => a.category === 'COSTO' && !a.isHeader).reduce((sum, a) => sum + a.balance, 0);
    const totalExpenses = accounts.filter(a => a.category === 'GASTO' && !a.isHeader).reduce((sum, a) => sum + a.balance, 0);

    const grossProfit = totalIncome - totalCostOfSales;
    const netProfit = grossProfit - totalExpenses;
    const marginPercent = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalCostOfSales,
      grossProfit,
      totalExpenses,
      netProfit,
      marginPercent: Math.round(marginPercent * 10) / 10
    };
  }, [accounts]);

  return {
    accounts,
    journalEntries,
    fixedAssets,
    fiscalPeriods,
    balanceSheet,
    profitAndLoss,
    addAccount,
    addJournalEntry,
    postInvoiceJournalEntry,
    postExpenseJournalEntry,
    addFixedAsset,
    runAssetDepreciation,
    closeFiscalPeriod
  };
}
