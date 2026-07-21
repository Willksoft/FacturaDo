import ExcelJS from 'exceljs';
import { Client, Product, Provider, Invoice, Dgii606Record, Dgii607Record } from '../types';

// Helper to download a workbook blob
const saveWorkbook = async (workbook: ExcelJS.Workbook, fileName: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

// Export Clients
export const exportClientsToExcel = async (clients: Client[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Clientes');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 12 },
    { header: 'Tipo (Fisica / Empresa)', key: 'type', width: 15 },
    { header: 'Nombre / Razón Social', key: 'name', width: 35 },
    { header: 'RNC o Cédula', key: 'rncOrCedula', width: 20 },
    { header: 'Correo Electrónico', key: 'email', width: 30 },
    { header: 'Teléfono', key: 'phone', width: 15 },
    { header: 'Dirección', key: 'address', width: 40 },
    { header: 'Fecha Registro', key: 'createdAt', width: 25 },
  ];

  // Enable header style
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };

  clients.forEach(c => {
    sheet.addRow({
      id: c.id,
      type: c.type,
      name: c.name,
      rncOrCedula: c.rncOrCedula,
      email: c.email,
      phone: c.phone,
      address: c.address,
      createdAt: new Date(c.createdAt).toLocaleDateString(),
    });
  });

  await saveWorkbook(workbook, 'Clientes_Facturacion.xlsx');
};

// Parse Clients Excel for Carga Masiva
export const importClientsFromExcel = async (file: File): Promise<Partial<Client>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const sheet = workbook.worksheets[0];
        const clients: Partial<Client>[] = [];

        // Assuming row 1 is header
        sheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const cells = row.values as any[];
            const typeValue = (cells[2] || '').trim();
            const type: 'Fisica' | 'Empresa' = typeValue.toLowerCase().includes('empresa') || typeValue.toLowerCase() === 'empresa' ? 'Empresa' : 'Fisica';
            const name = String(cells[3] || '').trim();
            // Automatically strip hyphens, spaces and non-digit characters from RNC/Cédula for clean DGII compatibility
            const rncOrCedula = String(cells[4] || '').replace(/[^0-9]/g, '');
            const email = String(cells[5] || '').trim();
            const phone = String(cells[6] || '').trim();
            const address = String(cells[7] || '').trim();

            if (name) {
              clients.push({
                type,
                name,
                rncOrCedula,
                email,
                phone,
                address,
              });
            }
          }
        });
        resolve(clients);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

// Export Products
export const exportProductsToExcel = async (products: Product[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Productos & Servicios');

  sheet.columns = [
    { header: 'Código', key: 'code', width: 12 },
    { header: 'Nombre', key: 'name', width: 35 },
    { header: 'Tipo (Producto / Servicio)', key: 'type', width: 18 },
    { header: 'Precio de Venta (RD$)', key: 'price', width: 22 },
    { header: 'Costo (RD$)', key: 'cost', width: 15 },
    { header: 'Tasa ITBIS (%)', key: 'taxRate', width: 15 },
    { header: 'Stock Actual', key: 'stock', width: 15 },
    { header: 'Stock Mínimo', key: 'minStock', width: 15 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };

  products.forEach(p => {
    sheet.addRow({
      code: p.code,
      name: p.name,
      type: p.type,
      price: p.price,
      cost: p.cost,
      taxRate: p.taxRate,
      stock: p.stock,
      minStock: p.minStock,
    });
  });

  // Align price and cost numbers
  sheet.getColumn('price').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('cost').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('taxRate').numFmt = '0"%"';

  await saveWorkbook(workbook, 'Productos_Servicios.xlsx');
};

// Process Excel for Products/Services Carga Masiva
export const importProductsFromExcel = async (file: File): Promise<Partial<Product>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const sheet = workbook.worksheets[0];
        const products: Partial<Product>[] = [];

        sheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const cells = row.values as any[];
            const code = cells[1] ? String(cells[1]).trim() : '';
            const name = cells[2] ? String(cells[2]).trim() : '';
            const typeStr = cells[3] ? String(cells[3]).trim() : 'Producto';
            const type: 'Producto' | 'Servicio' = typeStr.toLowerCase().includes('servicio') ? 'Servicio' : 'Producto';
            const price = Number(cells[4]) || 0;
            const cost = Number(cells[5]) || 0;
            const taxRate = cells[6] !== undefined ? Number(cells[6]) : 18;
            const stock = Number(cells[7]) || 0;
            const minStock = Number(cells[8]) || 0;

            if (name) {
              products.push({
                code: code || `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
                name,
                type,
                price,
                cost,
                taxRate,
                stock: type === 'Servicio' ? 0 : stock,
                minStock,
              });
            }
          }
        });
        resolve(products);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

// Export Providers
export const exportProvidersToExcel = async (providers: Provider[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Proveedores');

  sheet.columns = [
    { header: 'Proveedor', key: 'name', width: 35 },
    { header: 'RNC', key: 'rnc', width: 18 },
    { header: 'Correo', key: 'email', width: 25 },
    { header: 'Teléfono', key: 'phone', width: 15 },
    { header: 'Dirección', key: 'address', width: 40 },
    { header: 'Contacto Principal', key: 'contactName', width: 25 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };

  providers.forEach(p => {
    sheet.addRow({
      name: p.name,
      rnc: p.rnc,
      email: p.email,
      phone: p.phone,
      address: p.address,
      contactName: p.contactName,
    });
  });

  await saveWorkbook(workbook, 'Proveedores.xlsx');
};

// Process Excel for Providers Carga Masiva
export const importProvidersFromExcel = async (file: File): Promise<Partial<Provider>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const sheet = workbook.worksheets[0];
        const providers: Partial<Provider>[] = [];

        sheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const cells = row.values as any[];
            const name = cells[1] ? String(cells[1]).trim() : '';
            const rnc = cells[2] ? String(cells[2]).replace(/[^0-9]/g, '') : '';
            const email = cells[3] ? String(cells[3]).trim() : '';
            const phone = cells[4] ? String(cells[4]).trim() : '';
            const address = cells[5] ? String(cells[5]).trim() : '';
            const contactName = cells[6] ? String(cells[6]).trim() : '';

            if (name) {
              providers.push({
                name,
                rnc,
                email,
                phone,
                address,
                contactName,
              });
            }
          }
        });
        resolve(providers);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

// Export Monthly Sales Report
export const exportMonthlyReportToExcel = async (invoices: Invoice[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Reporte de Ventas');

  sheet.columns = [
    { header: 'No. Factura/Cotización', key: 'invoiceNumber', width: 22 },
    { header: 'Tipo', key: 'type', width: 15 },
    { header: 'Cliente', key: 'clientName', width: 35 },
    { header: 'RNC / CC Cliente', key: 'clientRnc', width: 18 },
    { header: 'Fecha de Emisión', key: 'date', width: 18 },
    { header: 'NCF / Comprobante', key: 'ncf', width: 20 },
    { header: 'Método Pago', key: 'payment', width: 15 },
    { header: 'Subtotal (RD$)', key: 'subtotal', width: 16 },
    { header: 'ITBIS 18% (RD$)', key: 'tax', width: 16 },
    { header: 'Total General (RD$)', key: 'total', width: 18 },
    { header: 'Estado', key: 'status', width: 12 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };

  invoices.forEach(inv => {
    sheet.addRow({
      invoiceNumber: inv.invoiceNumber,
      type: inv.type,
      clientName: inv.client.name,
      clientRnc: inv.client.rncOrCedula,
      date: new Date(inv.createdAt).toLocaleDateString(),
      ncf: inv.ncf,
      payment: inv.paymentMethod,
      subtotal: inv.subtotal,
      tax: inv.taxAmount,
      total: inv.total,
      status: inv.status,
    });
  });

  // Format numbers
  sheet.getColumn('subtotal').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('tax').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('total').numFmt = '"RD$"#,##0.00';

  // Add formula row at the end
  const nextRowIndex = invoices.length + 2;
  const rowSummary = sheet.getRow(nextRowIndex);
  rowSummary.getCell(7).value = 'TOTALES:';
  rowSummary.getCell(7).font = { bold: true };
  rowSummary.getCell(8).value = { formula: `SUM(H2:H${nextRowIndex - 1})` };
  rowSummary.getCell(8).font = { bold: true };
  rowSummary.getCell(8).numFmt = '"RD$"#,##0.00';
  rowSummary.getCell(9).value = { formula: `SUM(I2:I${nextRowIndex - 1})` };
  rowSummary.getCell(9).font = { bold: true };
  rowSummary.getCell(9).numFmt = '"RD$"#,##0.00';
  rowSummary.getCell(10).value = { formula: `SUM(J2:J${nextRowIndex - 1})` };
  rowSummary.getCell(10).font = { bold: true };
  rowSummary.getCell(10).numFmt = '"RD$"#,##0.00';

  await saveWorkbook(workbook, 'Reporte_Mensual_Ventas.xlsx');
};

// Download Template helper for Carga Masiva
export const downloadImportTemplate = async (type: 'clientes' | 'productos' | 'proveedores') => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Plantilla Carga Masiva');

  if (type === 'clientes') {
    sheet.columns = [
      { header: 'Consecutivo (Opcional)', key: 'num', width: 10 },
      { header: 'Tipo (Fisica o Empresa)', key: 'type', width: 22 },
      { header: 'Nombre / Razón Social', key: 'name', width: 35 },
      { header: 'RNC o Cédula (Sin Guiones preferible)', key: 'rncOrCedula', width: 25 },
      { header: 'Correo Electrónico', key: 'email', width: 25 },
      { header: 'Teléfono', key: 'phone', width: 15 },
      { header: 'Dirección', key: 'address', width: 35 },
    ];
    sheet.addRow([1, 'Empresa', 'Induveca S.A.', '101014234', 'ventas@induveca.com.do', '809-573-2222', 'La Vega, República Dominicana']);
    sheet.addRow([2, 'Fisica', 'Juan Perez', '402-0987654-3', 'juan.perez@gmail.com', '829-999-5555', 'Av. Duarte, Santiago']);
  } else if (type === 'productos') {
    sheet.columns = [
      { header: 'Código / SKU', key: 'code', width: 15 },
      { header: 'Nombre del Artículo / Descripción', key: 'name', width: 32 },
      { header: 'Tipo (Producto o Servicio)', key: 'type', width: 22 },
      { header: 'Precio de Venta (Numérico)', key: 'price', width: 22 },
      { header: 'Costo Unitario (Numérico)', key: 'cost', width: 18 },
      { header: 'ITBIS Tasa % (0 para Exento, 18 para Estándar)', key: 'tax', width: 22 },
      { header: 'Stock Inicial (Numérico)', key: 'stock', width: 15 },
      { header: 'Alerta Stock Mínimo (Numérico)', key: 'minStock', width: 15 },
    ];
    sheet.addRow(['CEM-02', 'Cemento Portland Light 42.5kg', 'Producto', 485.00, 310.00, 18, 500, 50]);
    sheet.addRow(['MANO-OBR', 'Instalación Básica de Componentes', 'Servicio', 1500.00, 200.00, 18, 0, 0]);
  } else {
    sheet.columns = [
      { header: 'Nombre del Proveedor', key: 'name', width: 32 },
      { header: 'RNC', key: 'rnc', width: 20 },
      { header: 'Correo electrónico', key: 'email', width: 25 },
      { header: 'Teléfono', key: 'phone', width: 15 },
      { header: 'Dirección', key: 'address', width: 32 },
      { header: 'Contacto Principal', key: 'contactName', width: 25 },
    ];
    sheet.addRow(['Ligas Mayores R.D.', '130887766', 'contacto@ligasmayores.com', '809-541-0000', 'Santo Domingo Norte', 'Franklin Mirabal']);
  }

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };

  await saveWorkbook(workbook, `Plantilla_Carga_Masiva_${type}.xlsx`);
};

// Export DGII Formats (606 Purchases / 607 Sales)
export const exportDgii606ToExcel = async (records: Dgii606Record[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Format 606 - Compras');

  sheet.columns = [
    { header: 'RNC o Cédula de Identidad', key: 'rncOrCedula', width: 25 },
    { header: 'Tipo de Gasto (01-11)', key: 'expenseType', width: 22 },
    { header: 'NCF Adquirido', key: 'ncf', width: 20 },
    { header: 'NCF Modificado (Opcional)', key: 'modifiedNcf', width: 22 },
    { header: 'Fecha Comprobante (AAAAMMDD)', key: 'date', width: 25 },
    { header: 'Monto Facturado en Servicios (RD$)', key: 'serviceAmount', width: 28 },
    { header: 'Monto Facturado en Bienes (RD$)', key: 'goodsAmount', width: 28 },
    { header: 'Monto Total Facturado (RD$)', key: 'totalAmount', width: 25 },
    { header: 'ITBIS Facturado (RD$)', key: 'itbisBilled', width: 20 },
    { header: 'ITBIS Retenido por el Estado (RD$)', key: 'itbisWithheldByState', width: 28 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '005A36' } }; // Dark green for tax format

  records.forEach(r => {
    sheet.addRow({
      rncOrCedula: r.rncOrCedula,
      expenseType: r.expenseType,
      ncf: r.ncf,
      modifiedNcf: r.modifiedNcf || '',
      date: r.date,
      serviceAmount: r.serviceAmount,
      goodsAmount: r.goodsAmount,
      totalAmount: r.totalAmount,
      itbisBilled: r.itbisBilled,
      itbisWithheldByState: r.itbisWithheldByState,
    });
  });

  sheet.getColumn('serviceAmount').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('goodsAmount').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('totalAmount').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('itbisBilled').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('itbisWithheldByState').numFmt = '"RD$"#,##0.00';

  await saveWorkbook(workbook, 'DGII_Formato_606_Compras.xlsx');
};

export const exportDgii607ToExcel = async (records: Dgii607Record[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Format 607 - Ventas');

  sheet.columns = [
    { header: 'RNC o Cédula del Cliente o Pasaporte', key: 'rncOrCedula', width: 25 },
    { header: 'Tipo de Identificación (1: RNC, 2: Cédula, 3: Pasaporte)', key: 'idType', width: 28 },
    { header: 'Número de Comprobante Fiscal (NCF)', key: 'ncf', width: 25 },
    { header: 'NCF Modificado (Opcional)', key: 'modifiedNcf', width: 22 },
    { header: 'Tipo de Ingreso (01-16)', key: 'incomeType', width: 22 },
    { header: 'Fecha de Comprobante (AAAAMMDD)', key: 'date', width: 25 },
    { header: 'Monto Facturado (RD$)', key: 'saleAmount', width: 22 },
    { header: 'ITBIS Facturado (RD$)', key: 'itbisAmount', width: 22 },
    { header: 'Monto Pago en Efectivo (RD$)', key: 'cash', width: 22 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } }; // Soft Navy for tax sales

  records.forEach(r => {
    sheet.addRow({
      rncOrCedula: r.rncOrCedula,
      idType: r.idType,
      ncf: r.ncf,
      modifiedNcf: r.modifiedNcf || '',
      incomeType: r.incomeType,
      date: r.date,
      saleAmount: r.saleAmount,
      itbisAmount: r.itbisAmount,
      cash: r.paymentMethod === 'Efectivo' ? r.saleAmount + r.itbisAmount : 0,
    });
  });

  sheet.getColumn('saleAmount').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('itbisAmount').numFmt = '"RD$"#,##0.00';
  sheet.getColumn('cash').numFmt = '"RD$"#,##0.00';

  await saveWorkbook(workbook, 'DGII_Formato_607_Ventas.xlsx');
};
