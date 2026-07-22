export type AccountCategory = 'ACTIVO' | 'PASIVO' | 'PATRIMONIO' | 'INGRESO' | 'COSTO' | 'GASTO';

export interface AccountItem {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  parentCode?: string;
  balance: number;
  isHeader?: boolean;
  isSystem?: boolean;
  description?: string;
}

export interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  memo?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  concept: string;
  reference?: string; // e.g. Invoice # B0100000001 or Expense # EXP-001
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  isAutomatic?: boolean;
  sourceDocument?: 'INVOICE' | 'EXPENSE' | 'PAYMENT' | 'ASSET' | 'MANUAL';
  sourceId?: string;
  createdBy?: string;
}

export type FixedAssetCategory = 'CAT_1_EDIFICIOS' | 'CAT_2_EQUIPOS_VEHICULOS' | 'CAT_3_MAQUINARIAS';

export interface FixedAsset {
  id: string;
  code: string;
  name: string;
  category: FixedAssetCategory;
  ratePercent: number; // e.g. 5, 25, 15
  acquisitionDate: string;
  acquisitionCost: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  status: 'ACTIVO' | 'DEPRECIADO' | 'VENDIDO' | 'DESECHADO';
  notes?: string;
}

export interface FiscalPeriod {
  id: string;
  year: number;
  month: number;
  label: string; // e.g. "Enero 2026"
  status: 'OPEN' | 'CLOSED';
  closedAt?: string;
  closedBy?: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export interface Dgii608Item {
  id: string;
  ncf: string;
  cancellationDate: string;
  cancellationReasonCode: string; // e.g. 01: Deterioro, 02: Errores, 03: Impresión, 04: Cambio
  cancellationReasonText: string;
}

export interface Dgii609Item {
  id: string;
  vendorName: string;
  vendorIdOrTaxId: string;
  countryCode: string; // ISO e.g. USA, ESP, CHN
  paymentDate: string;
  serviceConcept: string;
  amountGross: number;
  taxWithheld: number;
}

export interface DgiiIt1Draft {
  period: string; // e.g. "2026-06"
  totalBilledGross: number;
  totalItbisBilled: number;
  totalExemptSales: number;
  totalPurchasesGross: number;
  totalItbisPaidPurchases: number;
  itbisNetBalance: number; // Charged - Paid
  itbisWithheldByThirdParties: number;
  finalItbisToPay: number;
}
