/**
 * Servicio de Integración con DGII API Cloud
 * Provee búsqueda en tiempo real (autocomplete), validación de RNC/Cédulas y validación de NCFs.
 */

const DEFAULT_API_KEY = 'dgii_9b3fe9dcc6c44e5ebdde4eaa7e6f8f7c';
const BASE_URL = 'https://pptonanntevatndjyzmk.supabase.co/functions/v1/dgii-api';

function getApiKey(): string {
  return ((import.meta as any).env?.VITE_DGII_API_KEY as string) || DEFAULT_API_KEY;
}

export interface DgiiSuggestion {
  id: string;
  label: string;
  value: string;
  nombre: string;
  estatus: string | null;
  categoria: string | null;
  regimen: string | null;
  actividad_economica: string | null;
  provincia: string | null;
  municipio: string | null;
}

export interface DgiiTypeValidation {
  rnc: string;
  valid: boolean;
  checksum_valid: boolean;
  format_valid: boolean;
  found_in_dgii: boolean;
  source: string;
  status: string | null;
  data: {
    id: number;
    rnc: string;
    nombre: string;
    categoria: string | null;
    regimen: string | null;
    estatus: string | null;
    actividad_economica: string | null;
    provincia: string | null;
    municipio: string | null;
    actualizado: string;
  } | null;
}

export interface DgiiNcfValidation {
  ncf: string;
  valid: boolean;
  format_valid: boolean;
  type: string;
  format: string;
  is_electronic: boolean;
  series: string;
  sequence: string;
}

/**
 * Busca sugerencias de contribuyentes por nombre o dígitos parciales de RNC/Cédula.
 */
export async function getDgiiAutocomplete(query: string, limit = 10, tipo: 'rnc' | 'cedula' = 'rnc'): Promise<DgiiSuggestion[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `${BASE_URL}/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}&tipo=${tipo}`;
    const res = await fetch(url, {
      headers: {
        'x-api-key': getApiKey(),
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      console.warn('DGII Autocomplete response status error:', res.status);
      return [];
    }
    const data = await res.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Error fetching DGII Autocomplete:', error);
    return [];
  }
}

/**
 * Valida un RNC o Cédula Dominicana contra el padrón oficial de la DGII.
 */
export async function validateDgiiRnc(rncOrCedula: string): Promise<DgiiTypeValidation | null> {
  const cleanRnc = rncOrCedula.replace(/[^0-9]/g, '');
  if (!cleanRnc) return null;
  try {
    const url = `${BASE_URL}/validate/rnc/${cleanRnc}`;
    const res = await fetch(url, {
      headers: {
        'x-api-key': getApiKey(),
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      console.warn('DGII Validation response status error:', res.status);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error validating DGII RNC:', error);
    return null;
  }
}

/**
 * Valida un NCF (Número de Comprobante Fiscal) o e-CF electrónico.
 */
export async function validateDgiiNcf(ncf: string): Promise<DgiiNcfValidation | null> {
  const cleanNcf = ncf.trim().toUpperCase();
  if (!cleanNcf) return null;
  try {
    const url = `${BASE_URL}/validate/ncf/${cleanNcf}`;
    const res = await fetch(url, {
      headers: {
        'x-api-key': getApiKey(),
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      console.warn('DGII NCF validation response error:', res.status);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error validating DGII NCF:', error);
    return null;
  }
}
