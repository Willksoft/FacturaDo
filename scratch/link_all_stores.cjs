const fs = require('fs');
const path = require('path');

const statePath = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(statePath, 'utf8');

if (!content.includes('useFinanceStore')) {
    // Inject import
    content = content.replace(
        "import { useCatalogStore } from '../stores/useCatalogStore';", 
        "import { useCatalogStore } from '../stores/useCatalogStore';\nimport { useFinanceStore } from '../stores/useFinanceStore';\nimport { useConfigStore } from '../stores/useConfigStore';"
    );

    // Replace useStates
    const replacements = [
        ["const [invoices, setInvoices] = useState<Invoice[]>([]);", "const invoices = useFinanceStore(s => s.invoices);\n  const setInvoices = useFinanceStore(s => s.setInvoices);"],
        ["const [receipts, setReceipts] = useState<Receipt[]>([]);", "const receipts = useFinanceStore(s => s.receipts);\n  const setReceipts = useFinanceStore(s => s.setReceipts);"],
        ["const [financialAccounts, setFinancialAccounts] = useState<FinancialAccount[]>([]);", "const financialAccounts = useFinanceStore(s => s.financialAccounts);\n  const setFinancialAccounts = useFinanceStore(s => s.setFinancialAccounts);"],
        ["const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);", "const purchaseOrders = useFinanceStore(s => s.purchaseOrders);\n  const setPurchaseOrders = useFinanceStore(s => s.setPurchaseOrders);"],
        ["const [expenses, setExpenses] = useState<Expense[]>([]);", "const expenses = useFinanceStore(s => s.expenses);\n  const setExpenses = useFinanceStore(s => s.setExpenses);"],
        ["const [shifts, setShifts] = useState<Shift[]>([]);", "const shifts = useFinanceStore(s => s.shifts);\n  const setShifts = useFinanceStore(s => s.setShifts);"],
        
        // ConfigStore
        ["const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(defaultTemplateSettings);", "const templateSettings = useConfigStore(s => s.templateSettings);\n  const setTemplateSettings = useConfigStore(s => s.setTemplateSettings);"],
        ["const [users, setUsers] = useState<UserPermission[]>(defaultUsers);", "const users = useConfigStore(s => s.users);\n  const setUsers = useConfigStore(s => s.setUsers);"]
    ];

    replacements.forEach(([search, replacement]) => {
        if (content.includes(search)) {
            content = content.replace(search, replacement);
        } else {
            console.warn("Could not find:", search);
        }
    });
    
    // In ConfigStore, templateSettings initializes to null, but here we want to fallback to defaultTemplateSettings.
    // Actually, Zustand starts with null, but setTemplateSettings will be called soon. However, App might crash if it's null on first render.
    // So let's make sure it falls back to defaultTemplateSettings if null.
    content = content.replace(
        "const templateSettings = useConfigStore(s => s.templateSettings);",
        "const _templateSettings = useConfigStore(s => s.templateSettings);\n  const templateSettings = _templateSettings || defaultTemplateSettings;"
    );

    // Same for users
    content = content.replace(
        "const users = useConfigStore(s => s.users);",
        "const _users = useConfigStore(s => s.users);\n  const users = _users.length > 0 ? _users : defaultUsers;"
    );

    fs.writeFileSync(statePath, content);
    console.log("Linked all stores successfully!");
} else {
    console.log("Already linked.");
}
