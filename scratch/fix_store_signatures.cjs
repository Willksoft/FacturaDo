const fs = require('fs');
const path = require('path');

function processStore(filePath, typeMappings) {
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [stateName, typeName] of Object.entries(typeMappings)) {
        const setName = 'set' + stateName.charAt(0).toUpperCase() + stateName.slice(1);
        
        // Update interface
        const oldInterface = `${setName}: (${stateName}: ${typeName}[]) => void;`;
        const newInterface = `${setName}: (update: ${typeName}[] | ((prev: ${typeName}[]) => ${typeName}[])) => void;`;
        content = content.replace(oldInterface, newInterface);
        
        // Handle UserPermission case
        const oldInterface2 = `${setName}: (${stateName}: ${typeName}) => void;`;
        const newInterface2 = `${setName}: (update: ${typeName} | ((prev: ${typeName}) => ${typeName})) => void;`;
        if (content.includes(oldInterface2)) content = content.replace(oldInterface2, newInterface2);

        // Update implementation
        // Old: setClients: (clients) => set({ clients })
        // New: setClients: (update) => set(state => ({ clients: typeof update === 'function' ? update(state.clients) : update }))
        const regex = new RegExp(`${setName}: \\(\\w+\\) => set\\({ \\w+ }\\)`, 'g');
        const replacement = `${setName}: (update) => set(state => ({ ${stateName}: typeof update === 'function' ? update(state.${stateName}) : update }))`;
        content = content.replace(regex, replacement);
    }
    
    fs.writeFileSync(filePath, content);
}

// Catalog Store
processStore(path.join(__dirname, '../src/stores/useCatalogStore.ts'), {
    clients: 'Client',
    products: 'Product',
    providers: 'Provider'
});

// Remove categories from CatalogStore completely
let catContent = fs.readFileSync(path.join(__dirname, '../src/stores/useCatalogStore.ts'), 'utf8');
catContent = catContent.replace(/import \{ Client, Product, Provider, ProductCategory as Category \} from '\.\.\/types';/, "import { Client, Product, Provider } from '../types';");
catContent = catContent.replace(/categories: Category\[\];\n\s+/g, '');
catContent = catContent.replace(/setCategories: \(categories: Category\[\]\) => void;\n\s+/g, '');
catContent = catContent.replace(/categories: \[\],\n\s+/g, '');
catContent = catContent.replace(/categories: data\.categories\n\s+/g, '');
catContent = catContent.replace(/setCategories: .*?\n/g, '');
catContent = catContent.replace(/providers: Provider\[\], categories: Category\[\] \}/g, 'providers: Provider[] }');
catContent = catContent.replace(/categories: data\.categories,/g, '');
fs.writeFileSync(path.join(__dirname, '../src/stores/useCatalogStore.ts'), catContent);

// Finance Store
processStore(path.join(__dirname, '../src/stores/useFinanceStore.ts'), {
    invoices: 'Invoice',
    quotes: 'Invoice',
    financialAccounts: 'FinancialAccount',
    receipts: 'Receipt',
    shifts: 'Shift',
    purchaseOrders: 'PurchaseOrder',
    expenses: 'Expense'
});

// Config Store
processStore(path.join(__dirname, '../src/stores/useConfigStore.ts'), {
    users: 'UserPermission',
    templateSettings: 'TemplateSettings'
});

// Remove categories from useInvoiceState replacement script traces
let invContent = fs.readFileSync(path.join(__dirname, '../src/hooks/useInvoiceState.ts'), 'utf8');
invContent = invContent.replace(/const categories = useCatalogStore\(s => s\.categories\);\n/g, '');
invContent = invContent.replace(/const setCategories = useCatalogStore\(s => s\.setCategories\);\n/g, '');
fs.writeFileSync(path.join(__dirname, '../src/hooks/useInvoiceState.ts'), invContent);

console.log("Fixed store signatures!");
