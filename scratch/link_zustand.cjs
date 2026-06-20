const fs = require('fs');
const path = require('path');

const statePath = path.join(__dirname, '../src/hooks/useInvoiceState.ts');
let content = fs.readFileSync(statePath, 'utf8');

if (!content.includes('useCatalogStore')) {
    // Inject import
    content = content.replace(
        "import { insforge } from '../lib/insforge';", 
        "import { insforge } from '../lib/insforge';\nimport { useCatalogStore } from '../stores/useCatalogStore';"
    );

    // Replace useState for Catalog data with Zustand store inside InvoiceStateProvider
    const search1 = "const [clients, setClients] = useState<Client[]>([]);";
    const search2 = "const [products, setProducts] = useState<Product[]>([]);";
    const search3 = "const [categories, setCategories] = useState<Category[]>([]);";
    const search4 = "const [providers, setProviders] = useState<Provider[]>([]);";

    const replaceZustand = `
  const clients = useCatalogStore(s => s.clients);
  const setClients = useCatalogStore(s => s.setClients);
  const products = useCatalogStore(s => s.products);
  const setProducts = useCatalogStore(s => s.setProducts);
  const categories = useCatalogStore(s => s.categories);
  const setCategories = useCatalogStore(s => s.setCategories);
  const providers = useCatalogStore(s => s.providers);
  const setProviders = useCatalogStore(s => s.setProviders);
  const setCatalogData = useCatalogStore(s => s.setCatalogData);
`;

    content = content.replace(search1, replaceZustand);
    content = content.replace(search2, "");
    content = content.replace(search3, "");
    content = content.replace(search4, "");

    // Also in loadAllDataFromPostgres, we can call setCatalogData but for now setClients etc works fine because they are bound to Zustand.
    
    fs.writeFileSync(statePath, content);
    console.log("Linked Zustand with useInvoiceState successfully!");
} else {
    console.log("Already linked.");
}
