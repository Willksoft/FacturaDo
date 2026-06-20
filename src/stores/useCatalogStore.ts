import { create } from 'zustand';
import { Client, Product, Provider } from '../types';

interface CatalogState {
  clients: Client[];
  products: Product[];
  providers: Provider[];
  // Initialization
  setCatalogData: (data: { clients: Client[], products: Product[], providers: Provider[] }) => void;
  
  // Local State Updaters
  setClients: (update: Client[] | ((prev: Client[]) => Client[])) => void;
  setProducts: (update: Product[] | ((prev: Product[]) => Product[])) => void;
  setProviders: (update: Provider[] | ((prev: Provider[]) => Provider[])) => void;
  }

export const useCatalogStore = create<CatalogState>((set) => ({
  clients: [],
  products: [],
  providers: [],
  setCatalogData: (data) => set(state => ({
    clients: data.clients,
    products: data.products,
    providers: data.providers,
    })),

  setClients: (update) => set(state => ({ clients: typeof update === 'function' ? (update as any)(state.clients) : update })),
  setProducts: (update) => set(state => ({ products: typeof update === 'function' ? (update as any)(state.products) : update })),
  setProviders: (update) => set(state => ({ providers: typeof update === 'function' ? (update as any)(state.providers) : update })),
  }));
