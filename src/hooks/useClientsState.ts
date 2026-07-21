import { useState, useCallback } from 'react';
import { Client, ClientType } from '../types';
import { initialClients } from '../dbSeed';
import { insforge } from '../lib/insforge';

export const mapClientFromDb = (db: any): Client => ({
  id: db.id,
  type: db.type as ClientType,
  name: db.name,
  rncOrCedula: db.rnc_or_cedula,
  email: db.email,
  phone: db.phone,
  address: db.address,
  createdAt: db.created_at,
  dgiiVerified: db.dgii_verified,
  dgiiEstatus: db.dgii_estatus,
  dgiiRegimen: db.dgii_regimen,
  dgiiCategoria: db.dgii_categoria,
  dgiiActividad: db.dgii_actividad,
  dgiiProvincia: db.dgii_provincia,
  dgiiMunicipio: db.dgii_municipio
});

export const mapClientToDb = (client: Client) => ({
  id: client.id,
  type: client.type,
  name: client.name,
  rnc_or_cedula: client.rncOrCedula || '',
  email: client.email || '',
  phone: client.phone || '',
  address: client.address || '',
  created_at: client.createdAt,
  dgii_verified: client.dgiiVerified || false,
  dgii_estatus: client.dgiiEstatus || null,
  dgii_regimen: client.dgiiRegimen || null,
  dgii_categoria: client.dgiiCategoria || null,
  dgii_actividad: client.dgiiActividad || null,
  dgii_provincia: client.dgiiProvincia || null,
  dgii_municipio: client.dgiiMunicipio || null,
  is_deleted: false
});

export function useClientsState(getDbPrefix: () => string) {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('inv_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const saveClients = useCallback((newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem('inv_clients', JSON.stringify(newClients));
  }, []);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setClients(prev => {
      const updated = [newClient, ...prev];
      localStorage.setItem('inv_clients', JSON.stringify(updated));
      return updated;
    });

    const prefix = getDbPrefix();
    const dbClient = mapClientToDb({ ...newClient, id: `${prefix}${newClient.id}` });

    insforge.database.from('clients').insert([dbClient]).then(({ error }) => {
      if (error) console.error('Error insertando cliente en BD:', error);
    });

    return newClient;
  }, [getDbPrefix]);

  const updateClient = useCallback((id: string, updatedFields: Partial<Client>) => {
    setClients(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updatedFields } : c);
      localStorage.setItem('inv_clients', JSON.stringify(updated));
      return updated;
    });

    const prefix = getDbPrefix();
    insforge.database.from('clients')
      .update(updatedFields)
      .eq('id', `${prefix}${id}`)
      .then(({ error }) => {
        if (error) console.error('Error actualizando cliente en BD:', error);
      });
  }, [getDbPrefix]);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('inv_clients', JSON.stringify(updated));
      return updated;
    });

    const prefix = getDbPrefix();
    insforge.database.from('clients')
      .update({ is_deleted: true })
      .eq('id', `${prefix}${id}`)
      .then(({ error }) => {
        if (error) console.error('Error eliminando cliente en BD:', error);
      });
  }, [getDbPrefix]);

  const importClientsBulk = useCallback((newClientsData: Omit<Client, 'id' | 'createdAt'>[]) => {
    const prefix = getDbPrefix();
    const newClients: Client[] = newClientsData.map((c, i) => ({
      ...c,
      id: `cli-${Date.now()}-${i}`,
      createdAt: new Date().toISOString()
    }));

    setClients(prev => {
      const updated = [...newClients, ...prev];
      localStorage.setItem('inv_clients', JSON.stringify(updated));
      return updated;
    });

    const dbClients = newClients.map(c => mapClientToDb({ ...c, id: `${prefix}${c.id}` }));
    insforge.database.from('clients').insert(dbClients).then(({ error }) => {
      if (error) console.error('Error al importar clientes masivos:', error);
    });
  }, [getDbPrefix]);

  return {
    clients,
    setClients: saveClients,
    addClient,
    updateClient,
    deleteClient,
    importClientsBulk
  };
}
