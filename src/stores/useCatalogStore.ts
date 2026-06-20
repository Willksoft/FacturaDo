import { create } from 'zustand';
import { Client, Product, Provider, ProductCategory as Category } from '../types';

interface CatalogState {
  clients: Client[];
  products: Product[];
  providers: Provider[];
  categories: Category[];
  
  // Initialization
  setCatalogData: (data: { clients: Client[], products: Product[], providers: Provider[], categories: Category[] }) => void;
  
  // Local State Updaters
  setClients: (clients: Client[]) => void;
  setProducts: (products: Product[]) => void;
  setProviders: (providers: Provider[]) => void;
  setCategories: (categories: Category[]) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  clients: [],
  products: [],
  providers: [],
  categories: [],

  setCatalogData: (data) => set(state => ({
    clients: data.clients,
    products: data.products,
    providers: data.providers,
    categories: data.categories
  })),

  setClients: (clients) => set({ clients }),
  setProducts: (products) => set({ products }),
  setProviders: (providers) => set({ providers }),
  setCategories: (categories) => set({ categories }),
}));
