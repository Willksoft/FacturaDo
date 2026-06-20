const fs = require('fs');
const path = require('path');

const financeStoreContent = `import { create } from 'zustand';
import { Invoice, FinancialAccount, Receipt, Shift, PurchaseOrder, Expense } from '../types';

interface FinanceState {
  invoices: Invoice[];
  quotes: Invoice[];
  financialAccounts: FinancialAccount[];
  receipts: Receipt[];
  shifts: Shift[];
  purchaseOrders: PurchaseOrder[];
  expenses: Expense[];
  
  setFinanceData: (data: Partial<FinanceState>) => void;
  setInvoices: (invoices: Invoice[]) => void;
  setQuotes: (quotes: Invoice[]) => void;
  setFinancialAccounts: (accounts: FinancialAccount[]) => void;
  setReceipts: (receipts: Receipt[]) => void;
  setShifts: (shifts: Shift[]) => void;
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;
  setExpenses: (expenses: Expense[]) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  invoices: [],
  quotes: [],
  financialAccounts: [],
  receipts: [],
  shifts: [],
  purchaseOrders: [],
  expenses: [],

  setFinanceData: (data) => set(state => ({ ...state, ...data })),
  setInvoices: (invoices) => set({ invoices }),
  setQuotes: (quotes) => set({ quotes }),
  setFinancialAccounts: (financialAccounts) => set({ financialAccounts }),
  setReceipts: (receipts) => set({ receipts }),
  setShifts: (shifts) => set({ shifts }),
  setPurchaseOrders: (purchaseOrders) => set({ purchaseOrders }),
  setExpenses: (expenses) => set({ expenses }),
}));
`;

const configStoreContent = `import { create } from 'zustand';
import { UserPermission, TemplateSettings } from '../types';

interface ConfigState {
  users: UserPermission[];
  templateSettings: TemplateSettings | null;
  
  setConfigData: (data: Partial<ConfigState>) => void;
  setUsers: (users: UserPermission[]) => void;
  setTemplateSettings: (settings: TemplateSettings) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  users: [],
  templateSettings: null,

  setConfigData: (data) => set(state => ({ ...state, ...data })),
  setUsers: (users) => set({ users }),
  setTemplateSettings: (templateSettings) => set({ templateSettings }),
}));
`;

fs.writeFileSync(path.join(__dirname, '../src/stores/useFinanceStore.ts'), financeStoreContent);
fs.writeFileSync(path.join(__dirname, '../src/stores/useConfigStore.ts'), configStoreContent);
console.log("Stores created successfully.");
