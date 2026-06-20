import { create } from 'zustand';
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
  setInvoices: (update: Invoice[] | ((prev: Invoice[]) => Invoice[])) => void;
  setQuotes: (update: Invoice[] | ((prev: Invoice[]) => Invoice[])) => void;
  setFinancialAccounts: (update: FinancialAccount[] | ((prev: FinancialAccount[]) => FinancialAccount[])) => void;
  setReceipts: (update: Receipt[] | ((prev: Receipt[]) => Receipt[])) => void;
  setShifts: (update: Shift[] | ((prev: Shift[]) => Shift[])) => void;
  setPurchaseOrders: (update: PurchaseOrder[] | ((prev: PurchaseOrder[]) => PurchaseOrder[])) => void;
  setExpenses: (update: Expense[] | ((prev: Expense[]) => Expense[])) => void;
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
  setInvoices: (update) => set(state => ({ invoices: typeof update === 'function' ? (update as any)(state.invoices) : update })),
  setQuotes: (update) => set(state => ({ quotes: typeof update === 'function' ? (update as any)(state.quotes) : update })),
  setFinancialAccounts: (update) => set(state => ({ financialAccounts: typeof update === 'function' ? (update as any)(state.financialAccounts) : update })),
  setReceipts: (update) => set(state => ({ receipts: typeof update === 'function' ? (update as any)(state.receipts) : update })),
  setShifts: (update) => set(state => ({ shifts: typeof update === 'function' ? (update as any)(state.shifts) : update })),
  setPurchaseOrders: (update) => set(state => ({ purchaseOrders: typeof update === 'function' ? (update as any)(state.purchaseOrders) : update })),
  setExpenses: (update) => set(state => ({ expenses: typeof update === 'function' ? (update as any)(state.expenses) : update })),
}));
