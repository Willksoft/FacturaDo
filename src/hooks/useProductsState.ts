import { useState, useCallback } from 'react';
import { Product } from '../types';
import { initialProducts } from '../dbSeed';
import { insforge } from '../lib/insforge';

export const mapProductFromDb = (db: any): Product => ({
  id: db.id,
  name: db.name,
  code: db.code,
  type: db.type as 'Producto' | 'Servicio',
  price: parseFloat(db.price || 0),
  taxRate: parseFloat(db.tax_rate || 0),
  stock: parseInt(db.stock || 0),
  minStock: parseInt(db.min_stock || 0),
  cost: parseFloat(db.cost || 0),
  category: db.category || 'General',
  imageUrl: db.image_url || db.image || undefined,
  warehouseId: db.warehouse_id || undefined,
  createdAt: db.created_at || new Date().toISOString()
});

export const mapProductToDb = (prod: Product) => ({
  id: prod.id,
  name: prod.name,
  code: prod.code,
  type: prod.type,
  price: prod.price,
  tax_rate: prod.taxRate,
  stock: prod.type === 'Producto' ? prod.stock : 0,
  min_stock: prod.type === 'Producto' ? prod.minStock : 0,
  cost: prod.cost || 0,
  category: prod.category || 'General',
  image_url: prod.imageUrl || null,
  warehouse_id: prod.warehouseId || null,
  created_at: prod.createdAt,
  is_deleted: false
});

export function useProductsState(getDbPrefix: () => string) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('inv_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const saveProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('inv_products', JSON.stringify(newProducts));
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      stock: product.type === 'Producto' ? product.stock : 0,
      minStock: product.type === 'Producto' ? product.minStock : 0
    };

    setProducts(prev => {
      const updated = [newProd, ...prev];
      localStorage.setItem('inv_products', JSON.stringify(updated));
      return updated;
    });

    const prefix = getDbPrefix();
    const dbProd = mapProductToDb({ ...newProd, id: `${prefix}${newProd.id}` });
    insforge.database.from('products').insert([dbProd]).then(({ error }) => {
      if (error) console.error('Error al agregar producto en BD:', error);
    });

    return newProd;
  }, [getDbPrefix]);

  const updateProduct = useCallback((id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const next = { ...p, ...updatedFields };
          if (next.type === 'Servicio') {
            next.stock = 0;
            next.minStock = 0;
          }
          return next;
        }
        return p;
      });
      localStorage.setItem('inv_products', JSON.stringify(updated));
      return updated;
    });

    const prefix = getDbPrefix();
    insforge.database.from('products')
      .update(updatedFields)
      .eq('id', `${prefix}${id}`)
      .then(({ error }) => {
        if (error) console.error('Error al actualizar producto en BD:', error);
      });
  }, [getDbPrefix]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('inv_products', JSON.stringify(updated));
      return updated;
    });

    const prefix = getDbPrefix();
    insforge.database.from('products')
      .update({ is_deleted: true })
      .eq('id', `${prefix}${id}`)
      .then(({ error }) => {
        if (error) console.error('Error al eliminar producto en BD:', error);
      });
  }, [getDbPrefix]);

  const importProductsBulk = useCallback((newProductsData: Omit<Product, 'id' | 'createdAt'>[]) => {
    const prefix = getDbPrefix();
    const newProds: Product[] = newProductsData.map((p, i) => ({
      ...p,
      id: `prod-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
      stock: p.type === 'Producto' ? p.stock : 0,
      minStock: p.type === 'Producto' ? p.minStock : 0
    }));

    setProducts(prev => {
      const updated = [...newProds, ...prev];
      localStorage.setItem('inv_products', JSON.stringify(updated));
      return updated;
    });

    const dbProds = newProds.map(p => mapProductToDb({ ...p, id: `${prefix}${p.id}` }));
    insforge.database.from('products').insert(dbProds).then(({ error }) => {
      if (error) console.error('Error al importar productos masivos:', error);
    });
  }, [getDbPrefix]);

  return {
    products,
    setProducts: saveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    importProductsBulk
  };
}
