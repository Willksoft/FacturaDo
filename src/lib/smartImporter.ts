import ExcelJS from 'exceljs';
import { Client, Product, Provider, Invoice } from '../types';

export type ImportEntityType = 'clients' | 'products' | 'providers' | 'invoices';

export interface SmartColumnMapping {
  sourceColumn: string;
  targetField: string;
  confidence: number; // 0 to 1
}

export interface SmartImportResult<T> {
  entityType: ImportEntityType;
  validRecords: T[];
  errorRecords: { rowNumber: number; data: any; errors: string[] }[];
  totalRows: number;
  detectedHeaders: string[];
  mappings: SmartColumnMapping[];
}

// Normalized string for fuzzy matching (removes accents, hyphens, spaces, uppercase)
const normalizeKey = (str: string): string => {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, ''); // keep only alphanumeric
};

// Synonym Dictionaries for Dominican Republic DGII & Standard Commerce (Alegra, QuickBooks, Cashflow, Odoo, Zoho, Sage, Softland)
const FIELD_SYNONYMS: Record<string, string[]> = {
  // Client / Provider Name (Alegra: "Nombre / Razón Social", QuickBooks: "Customer"/"Company", Cashflow: "Razón Social")
  name: [
    'nombre', 'razonsocial', 'nombrerazonsocial', 'cliente', 'proveedor',
    'suplidor', 'empresa', 'name', 'businessname', 'company', 'contact',
    'nombredelcliente', 'nombredelproveedor', 'titular', 'customer',
    'vendor', 'customername', 'vendorname', 'contacto', 'nombrecontacto',
    'firstname', 'lastname', 'displayname', 'tercero', 'nombretercero'
  ],
  // RNC / Cédula (Alegra: "Identificación", QuickBooks: "Tax ID", Cashflow: "RNC/Cédula")
  rncOrCedula: [
    'rnc', 'cedula', 'rnccedula', 'rncocedula', 'documento', 'taxid',
    'identificacion', 'numdocumento', 'rncsuplidor', 'rnccliente',
    'numeroidentificacion', 'cedulaornc', 'numeroidentificacionfiscal',
    'nit', 'nif', 'idnumber', 'vatnumber', 'taxnumber', 'cuit', 'rut'
  ],
  // Email
  email: [
    'email', 'correo', 'mail', 'correoelectronico', 'emailaddress', 'contactoemail',
    'emailcontacto', 'primaryemail', 'correodefacturas'
  ],
  // Phone
  phone: [
    'telefono', 'celular', 'tel', 'phone', 'mobile', 'telefonos', 'whatsapp', 'contacto',
    'telefonomovil', 'telefonofijo', 'primaryphone', 'workphone', 'phonenumber'
  ],
  // Address
  address: [
    'direccion', 'ubicacion', 'address', 'calle', 'domicilio', 'location', 'ciudad',
    'direccionprincipal', 'billtoaddress', 'shiptoaddress', 'street', 'city', 'provincia'
  ],
  // Client Type
  type: [
    'tipo', 'tipocliente', 'tipopersona', 'clasificacion', 'categoria', 'clienttype',
    'personatipo', 'tipodeidentificacion'
  ],
  // Product Code / SKU (Alegra: "Código / Referencia", QuickBooks: "Item / SKU")
  code: [
    'codigo', 'sku', 'referencia', 'codigoproducto', 'code', 'barcode', 'codigodebarra',
    'idproducto', 'itemnumber', 'itemcode', 'productcode', 'ref', 'codigorapido'
  ],
  // Product Name (Alegra: "Descripción", QuickBooks: "Item Description")
  productName: [
    'producto', 'descripcion', 'articulo', 'item', 'productname', 'title', 'nombreproducto',
    'itemdescription', 'productdescription', 'concepto', 'detalledelproducto'
  ],
  // Price (Alegra: "Precio de venta", QuickBooks: "Sales Price")
  price: [
    'precio', 'preciodeventa', 'price', 'monto', 'unitprice', 'pvp', 'valor', 'preciounitario',
    'salesprice', 'rate', 'montounitario', 'preciosubtotal'
  ],
  // Cost (Alegra: "Costo unitario", QuickBooks: "Cost")
  cost: [
    'costo', 'costounitario', 'costcompra', 'costoestimado', 'cost', 'unitcost', 'purchaseprice'
  ],
  // Stock (Alegra: "Stock inicial", QuickBooks: "Qty On Hand")
  stock: [
    'stock', 'cantidad', 'existencia', 'inventario', 'qty', 'stockactual', 'unidades',
    'qtyonhand', 'stockinicial', 'quantity', 'balance', 'existenciaactual'
  ],
  // Product Type
  productType: [
    'tipoproducto', 'tipo', 'esservicio', 'itemtype', 'producttype', 'esproducto'
  ],
  // NCF (Facturas/Cotizaciones)
  ncf: [
    'ncf', 'comprobante', 'comprobantefiscal', 'numeroncf', 'ncffactura', 'ncfsecuencia',
    'invoicenumber', 'facturanumero', 'numfactura', 'invoiceno', 'foliorefiscal'
  ],
  // Invoice Total
  total: [
    'total', 'monto', 'subtotal', 'grandtotal', 'montototal', 'valor', 'amount', 'totalamount'
  ]
};

// Find matching target field using normalized fuzzy check
export const matchHeaderToField = (header: string): { field: string; confidence: number } | null => {
  const norm = normalizeKey(header);
  if (!norm) return null;

  for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS)) {
    for (const syn of synonyms) {
      if (norm === syn) return { field, confidence: 1.0 };
      if (norm.includes(syn) || syn.includes(norm)) return { field, confidence: 0.8 };
    }
  }
  return null;
};

// Data Cleansing Helpers
export const cleanRncOrCedula = (val: any): string => {
  if (!val) return '';
  return String(val).replace(/[^0-9]/g, '');
};

export const cleanCurrency = (val: any): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val)
    .replace(/RD\$/gi, '')
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const cleanPhone = (val: any): string => {
  if (!val) return '';
  return String(val).replace(/[^0-9+]/g, '');
};

// Parse CSV, TSV or Delimited Text intelligently
export const parseTextGrid = (text: string): { headers: string[]; rows: string[][] } => {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Detect delimiter (, ; \t |)
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) delimiter = '\t';
  else if (firstLine.includes(';')) delimiter = ';';
  else if (firstLine.includes('|')) delimiter = '|';

  const parseLine = (line: string) => {
    const values: string[] = [];
    let insideQuotes = false;
    let currentVal = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
    return values;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
};

// Read Excel (.xlsx, .xls) or CSV file into standard grid
export const readFileGrid = async (file: File): Promise<{ headers: string[]; rows: any[][] }> => {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
    const text = await file.text();
    return parseTextGrid(text);
  }

  // Handle Excel (.xlsx, .xls)
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  
  const headers: string[] = [];
  const rows: any[][] = [];

  sheet.eachRow((row, rowNumber) => {
    const values = (row.values as any[]).slice(1); // ExcelJS index 1 is column A
    if (rowNumber === 1) {
      values.forEach(v => headers.push(String(v || '').trim()));
    } else {
      rows.push(values);
    }
  });

  return { headers, rows };
};

// Auto-detect entity type from headers
export const detectEntityType = (headers: string[]): ImportEntityType => {
  const normHeaders = headers.map(normalizeKey);
  
  if (normHeaders.some(h => h.includes('ncf') || h.includes('comprobante'))) return 'invoices';
  if (normHeaders.some(h => h.includes('precio') || h.includes('sku') || h.includes('stock') || h.includes('producto'))) return 'products';
  if (normHeaders.some(h => h.includes('suplidor') || h.includes('proveedor'))) return 'providers';
  return 'clients';
};

// Smart Import Clients
export const smartImportClients = async (file: File): Promise<SmartImportResult<Omit<Client, 'id' | 'createdAt'>>> => {
  const { headers, rows } = await readFileGrid(file);
  const validRecords: Omit<Client, 'id' | 'createdAt'>[] = [];
  const errorRecords: { rowNumber: number; data: any; errors: string[] }[] = [];

  // Map headers to fields
  const fieldIndexes: Record<string, number> = {};
  headers.forEach((h, idx) => {
    const match = matchHeaderToField(h);
    if (match && match.field) {
      fieldIndexes[match.field] = idx;
    }
  });

  rows.forEach((row, rowIdx) => {
    const rowNum = rowIdx + 2; // header is row 1
    const rawName = row[fieldIndexes['name']] ?? row[1] ?? row[0];
    const rawRnc = row[fieldIndexes['rncOrCedula']] ?? row[2] ?? row[1];
    const rawEmail = row[fieldIndexes['email']] ?? row[3] ?? '';
    const rawPhone = row[fieldIndexes['phone']] ?? row[4] ?? '';
    const rawAddress = row[fieldIndexes['address']] ?? row[5] ?? '';
    const rawType = row[fieldIndexes['type']] ?? '';

    const name = String(rawName || '').trim();
    const rncOrCedula = cleanRncOrCedula(rawRnc);
    const email = String(rawEmail || '').trim();
    const phone = cleanPhone(rawPhone);
    const address = String(rawAddress || '').trim();
    
    // Auto-detect Fisica vs Empresa
    let type: 'Fisica' | 'Empresa' = 'Fisica';
    if (String(rawType).toLowerCase().includes('empresa') || rncOrCedula.length === 9) {
      type = 'Empresa';
    }

    const errors: string[] = [];
    if (!name) errors.push('Falta el nombre o razón social');

    if (errors.length === 0) {
      validRecords.push({
        name,
        rncOrCedula,
        email,
        phone,
        address,
        type,
      });
    } else {
      errorRecords.push({ rowNumber: rowNum, data: row, errors });
    }
  });

  return {
    entityType: 'clients',
    validRecords,
    errorRecords,
    totalRows: rows.length,
    detectedHeaders: headers,
    mappings: Object.entries(fieldIndexes).map(([field, colIdx]) => ({
      sourceColumn: headers[colIdx],
      targetField: field,
      confidence: 0.95
    }))
  };
};

// Smart Import Products
export const smartImportProducts = async (file: File): Promise<SmartImportResult<Omit<Product, 'id' | 'createdAt'>>> => {
  const { headers, rows } = await readFileGrid(file);
  const validRecords: Omit<Product, 'id' | 'createdAt'>[] = [];
  const errorRecords: { rowNumber: number; data: any; errors: string[] }[] = [];

  const fieldIndexes: Record<string, number> = {};
  headers.forEach((h, idx) => {
    const match = matchHeaderToField(h);
    if (match && match.field) {
      fieldIndexes[match.field] = idx;
    }
  });

  rows.forEach((row, rowIdx) => {
    const rowNum = rowIdx + 2;
    const rawCode = row[fieldIndexes['code']] ?? row[0] ?? `PROD-${rowNum}`;
    const rawName = row[fieldIndexes['productName']] ?? row[1] ?? '';
    const rawPrice = row[fieldIndexes['price']] ?? row[2] ?? 0;
    const rawCost = row[fieldIndexes['cost']] ?? row[3] ?? 0;
    const rawStock = row[fieldIndexes['stock']] ?? row[4] ?? 0;
    const rawType = row[fieldIndexes['productType']] ?? '';

    const name = String(rawName || '').trim();
    const code = String(rawCode || '').trim() || `SKU-${Date.now()}-${rowIdx}`;
    const price = cleanCurrency(rawPrice);
    const cost = cleanCurrency(rawCost);
    
    // Services have 0 stock and no alerts
    const typeStr = String(rawType).toLowerCase();
    const type: 'Producto' | 'Servicio' = typeStr.includes('servicio') || typeStr.includes('service') ? 'Servicio' : 'Producto';
    const stock = type === 'Servicio' ? 0 : Math.max(0, parseInt(String(rawStock || 0)));

    const errors: string[] = [];
    if (!name) errors.push('Falta el nombre o descripción del producto');

    if (errors.length === 0) {
      validRecords.push({
        code,
        name,
        type,
        price,
        cost,
        stock,
        minStock: 5,
        taxRate: 18, // Default ITBIS 18%
      });
    } else {
      errorRecords.push({ rowNumber: rowNum, data: row, errors });
    }
  });

  return {
    entityType: 'products',
    validRecords,
    errorRecords,
    totalRows: rows.length,
    detectedHeaders: headers,
    mappings: Object.entries(fieldIndexes).map(([field, colIdx]) => ({
      sourceColumn: headers[colIdx],
      targetField: field,
      confidence: 0.95
    }))
  };
};

// Smart Import Providers
export const smartImportProviders = async (file: File): Promise<SmartImportResult<Omit<Provider, 'id' | 'createdAt'>>> => {
  const { headers, rows } = await readFileGrid(file);
  const validRecords: Omit<Provider, 'id' | 'createdAt'>[] = [];
  const errorRecords: { rowNumber: number; data: any; errors: string[] }[] = [];

  const fieldIndexes: Record<string, number> = {};
  headers.forEach((h, idx) => {
    const match = matchHeaderToField(h);
    if (match && match.field) {
      fieldIndexes[match.field] = idx;
    }
  });

  rows.forEach((row, rowIdx) => {
    const rowNum = rowIdx + 2;
    const rawName = row[fieldIndexes['name']] ?? row[0] ?? '';
    const rawRnc = row[fieldIndexes['rncOrCedula']] ?? row[1] ?? '';
    const rawEmail = row[fieldIndexes['email']] ?? row[2] ?? '';
    const rawPhone = row[fieldIndexes['phone']] ?? row[3] ?? '';
    const rawAddress = row[fieldIndexes['address']] ?? row[4] ?? '';

    const name = String(rawName || '').trim();
    const rnc = cleanRncOrCedula(rawRnc);
    const email = String(rawEmail || '').trim();
    const phone = cleanPhone(rawPhone);
    const address = String(rawAddress || '').trim();

    const errors: string[] = [];
    if (!name) errors.push('Falta el nombre o razón social del suplidor');

    if (errors.length === 0) {
      validRecords.push({
        name,
        rnc,
        email,
        phone,
        address,
        contactName: name,
      });
    } else {
      errorRecords.push({ rowNumber: rowNum, data: row, errors });
    }
  });

  return {
    entityType: 'providers',
    validRecords,
    errorRecords,
    totalRows: rows.length,
    detectedHeaders: headers,
    mappings: Object.entries(fieldIndexes).map(([field, colIdx]) => ({
      sourceColumn: headers[colIdx],
      targetField: field,
      confidence: 0.95
    }))
  };
};
