import { jsPDF } from 'jspdf';
import { Invoice, TemplateSettings } from '../types';

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return {
    r: isNaN(r) ? 0 : r,
    g: isNaN(g) ? 0 : g,
    b: isNaN(b) ? 0 : b
  };
};

const getImageDimensionsAndData = (url: string): Promise<{ width: number; height: number; dataUrl: string | null; format: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve({ 
            width: canvas.width, 
            height: canvas.height, 
            dataUrl,
            format: 'PNG'
          });
          return;
        }
      } catch (e) {
        console.warn('Failed to convert image to canvas data url', e);
      }
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height, dataUrl: null, format: 'PNG' });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0, dataUrl: null, format: 'PNG' });
    };
    img.src = url;
  });
};

export const generateInvoicePDF = async (invoice: Invoice, settings: TemplateSettings) => {
  // Create instance
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const isQuote = invoice.type === 'Cotizacion';
  const style = settings.templateStyle || 'Moderna';

  // Helper to apply font based on selected style
  const applyFont = (pdfDoc: jsPDF, type: 'normal' | 'bold' | 'italic' | 'bolditalic') => {
    let fontName = 'helvetica';
    if (style === 'Elegante' || style === 'Clásica') {
      fontName = 'times';
    } else if (style === 'Minimalista' || style === 'Tecnológica') {
      fontName = 'courier';
    }
    pdfDoc.setFont(fontName, type);
  };

  // Coordinates
  let y = 15;
  const leftMargin = 15;
  const rightMargin = 195;
  const colWidths = [15, 95, 25, 20, 25]; // Qty, Desc, Price, Tax, Total

  // Define styling colors based on custom template settings
  const brandColor = settings.primaryColor || '#171717';
  const rgb = hexToRgb(brandColor);

  // Draw double borders for Clásica Style
  if (style === 'Clásica') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.4);
    doc.rect(5, 5, 206, 269, 'S'); // Outer
    doc.setLineWidth(0.2);
    doc.rect(6.2, 6.2, 203.6, 266.6, 'S'); // Inner
  }

  // 1. HEADER BRANDING & LOGO REPRESENTATION
  let logoWidth = 25; // default starting width estimation
  const logoHeight = 15; // Fixed height in mm as requested
  let logoDataUrl: string | null = null;
  let logoFormat = 'PNG';
  if (settings.logoUrl) {
    try {
      const dimensions = await getImageDimensionsAndData(settings.logoUrl);
      if (dimensions.height > 0) {
        logoWidth = (dimensions.width / dimensions.height) * logoHeight;
        logoDataUrl = dimensions.dataUrl;
        logoFormat = dimensions.format;
      }
    } catch (e) {
      console.warn("Failed to retrieve logo dimensions, using defaults", e);
    }
  }

  if (style === 'Corporativa') {
    // Solid background banner for Corporativa
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 30, 'F');

    let logoRendered = false;
    if (settings.logoUrl) {
      try {
        doc.addImage(logoDataUrl || settings.logoUrl, logoFormat, leftMargin + 5, y + 7.5, logoWidth, logoHeight);
        logoRendered = true;
      } catch (e) {
        console.warn("Failed to embed logo", e);
      }
    }
    
    if (!logoRendered) {
      doc.setFillColor(255, 255, 255);
      doc.rect(leftMargin + 5, y + 7.5, 15, 15, 'F');
    }

    doc.setTextColor(255, 255, 255);
    applyFont(doc, 'bold');
    doc.setFontSize(15);
    doc.text(settings.businessName || 'Mi Empresa', leftMargin + 5 + (settings.logoUrl ? logoWidth + 5 : 22), y + 13);

    doc.setFontSize(8);
    applyFont(doc, 'normal');
    doc.text(`RNC: ${settings.businessRNC || 'N/D'} | Tel: ${settings.businessPhone || 'N/D'}`, leftMargin + 5 + (settings.logoUrl ? logoWidth + 5 : 22), y + 20);
    doc.text(`Email: ${settings.businessEmail || 'N/D'} | Dirección: ${settings.businessAddress || 'N/D'}`, leftMargin + 5 + (settings.logoUrl ? logoWidth + 5 : 22), y + 25);

    y += 38;
  } else if (style === 'Clásica') {
    // Centered header layout for Clásica
    if (settings.logoUrl) {
      try {
        doc.addImage(logoDataUrl || settings.logoUrl, logoFormat, (210 - logoWidth) / 2, y, logoWidth, logoHeight);
        y += logoHeight + 5;
      } catch (e) {
        console.warn("Failed to embed logo", e);
        y += 5;
      }
    }

    doc.setTextColor(30, 30, 30);
    applyFont(doc, 'bold');
    doc.setFontSize(15);
    doc.text(settings.businessName || 'Mi Empresa', 105, y + 2, { align: 'center' });

    y += 8;
    applyFont(doc, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`RNC: ${settings.businessRNC || 'N/D'} | Tel: ${settings.businessPhone || 'N/D'}`, 105, y, { align: 'center' });
    doc.text(`Email: ${settings.businessEmail || 'N/D'} | Dirección: ${settings.businessAddress || 'N/D'}`, 105, y + 4, { align: 'center' });
    
    y += 10;
  } else {
    // Left-aligned header for Moderna, Minimalista, Elegante, Tecnológica
    let logoRendered = false;
    if (settings.logoUrl) {
      try {
        doc.addImage(logoDataUrl || settings.logoUrl, logoFormat, leftMargin, y, logoWidth, logoHeight);
        logoRendered = true;
      } catch (e) {
        console.warn("Failed to embed logo", e);
      }
    }

    if (!logoRendered) {
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(leftMargin, y, 15, 15, 'F');
    }

    doc.setTextColor(30, 30, 30);
    applyFont(doc, 'bold');
    doc.setFontSize(15);
    doc.text(settings.businessName || 'Mi Empresa', leftMargin + (logoRendered ? logoWidth + 5 : 20), y + 8);

    y += logoHeight + 4;
    applyFont(doc, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`RNC: ${settings.businessRNC || 'N/D'} | Tel: ${settings.businessPhone || 'N/D'}`, leftMargin, y);
    doc.text(`Email: ${settings.businessEmail || 'N/D'} | Dirección: ${settings.businessAddress || 'N/D'}`, leftMargin, y + 4);
    
    y += 10;
  }

  // Divider line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  if (style === 'Minimalista') {
    doc.setDrawColor(150, 150, 150);
    doc.line(leftMargin, y, rightMargin, y);
  } else if (style === 'Tecnológica') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(leftMargin, y, rightMargin, y);
    doc.setLineDashPattern([], 0); // Reset
  } else if (style === 'Elegante') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.line(leftMargin, y, rightMargin, y);
    doc.line(leftMargin, y + 0.8, rightMargin, y + 0.8);
    y += 1.5;
  } else {
    doc.line(leftMargin, y, rightMargin, y);
  }

  // 2. DOCUMENT CLASSIFICATION & METADATA
  y += 8;
  applyFont(doc, 'bold');
  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text(isQuote ? 'COTIZACIÓN / PROFORMA' : 'FACTURA DE VENTA', leftMargin, y);

  applyFont(doc, 'bold');
  doc.setFontSize(9.5);
  doc.text(isQuote ? 'No. Cotización:' : 'No. Factura:', 130, y - 1);
  applyFont(doc, 'normal');
  doc.text(invoice.invoiceNumber, 162, y - 1);

  if (!isQuote && invoice.ncfType !== 'SIN') {
    applyFont(doc, 'bold');
    doc.text('RNC Emisor:', 130, y + 4);
    applyFont(doc, 'normal');
    doc.text(settings.businessRNC || 'N/D', 162, y + 4);

    applyFont(doc, 'bold');
    doc.text('NCF Comprobante:', 130, y + 9);
    applyFont(doc, 'bold');
    if (style === 'Tecnológica') {
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
    } else {
      doc.setTextColor(0, 0, 200); // Blue accented NCF
    }
    doc.text(invoice.ncf, 162, y + 9);
    doc.setTextColor(0, 0, 0);
  } else if (!isQuote) {
    applyFont(doc, 'bold');
    doc.text('Tipo Comprobante:', 130, y + 4);
    applyFont(doc, 'normal');
    doc.text('Consumo Interno', 162, y + 4);
  }

  // 3. CLIENT AND TERMS INFORMATION
  y += 16;
  
  if (style === 'Elegante') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, 115, y);
    doc.line(leftMargin, y + 28, 115, y + 28);
    
    doc.line(125, y, rightMargin, y);
    doc.line(125, y + 28, rightMargin, y + 28);
  } else if (style === 'Minimalista') {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.25);
    doc.rect(leftMargin, y, 100, 28, 'S');
    doc.rect(125, y, 70, 28, 'S');
  } else if (style === 'Tecnológica') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.4);
    doc.rect(leftMargin, y, 100, 28, 'S');
    doc.rect(125, y, 70, 28, 'S');
  } else {
    // Moderna, Clásica, Corporativa: Gray background cards
    doc.setFillColor(248, 249, 250);
    doc.rect(leftMargin, y, 100, 28, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.rect(leftMargin, y, 100, 28, 'S');

    doc.setFillColor(248, 249, 250);
    doc.rect(125, y, 70, 28, 'F');
    doc.rect(125, y, 70, 28, 'S');
  }

  // Client Info Details
  applyFont(doc, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text('CLIENTE ACORDADO:', leftMargin + 4, y + 5);

  applyFont(doc, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.client.name, leftMargin + 4, y + 11);

  applyFont(doc, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  
  let currentClientY = y + 16;
  const isConsumo = invoice.client.name === 'Cliente de Consumo';
  
  const showRnc = !isConsumo || (invoice.client.rncOrCedula && invoice.client.rncOrCedula.trim() !== '');
  if (showRnc) {
    doc.text(`RNC / Cédula: ${invoice.client.rncOrCedula || 'N/D'}`, leftMargin + 4, currentClientY);
    currentClientY += 5;
  }
  
  const hasPhone = invoice.client.phone && invoice.client.phone.trim() !== '';
  const hasEmail = invoice.client.email && invoice.client.email.trim() !== '';
  const showContact = !isConsumo || hasPhone || hasEmail;
  if (showContact) {
    const pText = hasPhone ? invoice.client.phone : 'N/D';
    const eText = hasEmail ? invoice.client.email : 'N/D';
    doc.text(`Tel: ${pText} | Correo: ${eText}`, leftMargin + 4, currentClientY);
    currentClientY += 4;
  }
  
  const hasAddr = invoice.client.address && invoice.client.address.trim() !== '';
  const showAddr = !isConsumo || hasAddr;
  if (showAddr) {
    doc.text(`Dirección: ${invoice.client.address || 'N/D'}`, leftMargin + 4, currentClientY);
  }

  // Metadata Card right side
  applyFont(doc, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text('DATOS DE LA OPERACIÓN', 129, y + 5);

  applyFont(doc, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text('Fecha Emisión:', 129, y + 11);
  applyFont(doc, 'normal');
  doc.text(new Date(invoice.createdAt).toLocaleDateString('es-DO'), 158, y + 11);

  applyFont(doc, 'bold');
  doc.text('Fecha Vence:', 129, y + 16);
  applyFont(doc, 'normal');
  doc.text(new Date(invoice.dueDate).toLocaleDateString('es-DO'), 158, y + 16);

  if (!isQuote) {
    applyFont(doc, 'bold');
    doc.text('Condición Pago:', 129, y + 21);
    applyFont(doc, 'normal');
    doc.text(invoice.paymentCondition || 'Contado', 158, y + 21);

    if (invoice.ncfType !== 'SIN') {
      applyFont(doc, 'bold');
      doc.text('Secuencia NCF:', 129, y + 25);
      applyFont(doc, 'normal');
      doc.text(`${invoice.ncfType}-${invoice.sequenceNumber}`, 158, y + 25);
    } else {
      applyFont(doc, 'bold');
      doc.text('Vía de Cobro:', 129, y + 25);
      applyFont(doc, 'normal');
      doc.text(invoice.paymentMethod, 158, y + 25);
    }
  }

  // 4. ITEMS TABLE
  y += 34;

  if (style === 'Minimalista' || style === 'Elegante') {
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, rightMargin, y);
    doc.line(leftMargin, y + 8, rightMargin, y + 8);
    doc.setTextColor(0, 0, 0);
  } else if (style === 'Tecnológica') {
    doc.setFillColor(30, 30, 30);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 8, 'F');
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.4);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 8, 'S');
    doc.setTextColor(255, 255, 255);
  } else {
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 8, 'F');
    doc.setTextColor(255, 255, 255);
  }

  applyFont(doc, 'bold');
  doc.setFontSize(8.5);
  
  let currentX = leftMargin;
  doc.text('CANT.', currentX + 3, y + 5.5, { align: 'left' });
  
  currentX += colWidths[0];
  doc.text('CONCEPTO / DESCRIPCIÓN', currentX + 2, y + 5.5, { align: 'left' });

  currentX += colWidths[1];
  doc.text('PRECIO UNIT.', currentX + colWidths[2] - 2, y + 5.5, { align: 'right' });

  currentX += colWidths[2];
  doc.text('ITBIS %', currentX + colWidths[3] - 2, y + 5.5, { align: 'right' });

  currentX += colWidths[3];
  doc.text('TOTAL GENERAL', currentX + colWidths[4] - 2, y + 5.5, { align: 'right' });

  // Rows
  y += 8;
  doc.setFontSize(8.5);

  for (let index = 0; index < invoice.items.length; index++) {
    const item = invoice.items[index];
    // Alternating background colors
    if (style !== 'Minimalista' && style !== 'Elegante' && index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(leftMargin, y, rightMargin - leftMargin, 8, 'F');
    }
    
    // Bottom line divider
    doc.setDrawColor(240, 240, 240);
    if (style === 'Minimalista' || style === 'Tecnológica') {
      doc.setDrawColor(220, 220, 220);
    }
    doc.line(leftMargin, y + 8, rightMargin, y + 8);

    doc.setTextColor(40, 40, 40);
    applyFont(doc, 'normal');
    let rX = leftMargin;
    
    // Qty
    doc.text(String(item.quantity), rX + 3, y + 5.5);
    
    // Description
    rX += colWidths[0];
    const descText = item.name.length > 52 ? item.name.substring(0, 50) + '...' : item.name;
    
    let imgShift = 0;
    if (settings.showProductPhotos !== false && item.showImage !== false && item.imageUrl) {
        try {
            const dims = await getImageDimensionsAndData(item.imageUrl);
            if (dims.height > 0) {
               const h = 5; // 5mm height
               const w = (dims.width / dims.height) * h;
               // Extract format to avoid jsPDF errors, fallback to PNG
               let format = dims.format || 'PNG';
               doc.addImage(dims.dataUrl || item.imageUrl, format, rX + 2, y + 1.5, w, h);
               imgShift = w + 3; // Shift text right
            }
        } catch(e) {
            console.warn("Failed to load item image for PDF", e);
        }
    }

    doc.text(descText, rX + 2 + imgShift, y + 5.5);

    // Price
    rX += colWidths[1];
    doc.text(item.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), rX + colWidths[2] - 2, y + 5.5, { align: 'right' });

    // Tax rate %
    rX += colWidths[2];
    doc.text(`${item.taxRate}%`, rX + colWidths[3] - 2, y + 5.5, { align: 'right' });

    // Total General (item total)
    rX += colWidths[3];
    doc.text(item.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), rX + colWidths[4] - 2, y + 5.5, { align: 'right' });

    y += 8;
  }

  // 5. TOTALS CALCULATIONS BLOCK
  y += 5;

  // Prevent overlap if we are at edge of paper
  if (y > 230) {
    doc.addPage();
    if (style === 'Clásica') {
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.setLineWidth(0.4);
      doc.rect(5, 5, 206, 269, 'S');
      doc.setLineWidth(0.2);
      doc.rect(6.2, 6.2, 203.6, 266.6, 'S');
    }
    y = 20;
  }

  // Draw notes
  if (invoice.notes) {
    applyFont(doc, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text('NOTAS / CONDICIONES INTERNAS:', leftMargin, y + 4);
    
    applyFont(doc, 'normal');
    doc.setTextColor(130, 130, 130);
    const splitNotes = doc.splitTextToSize(invoice.notes, 100);
    doc.text(splitNotes, leftMargin, y + 8);
  }

  // Totals calculations box
  const totalsX = 130;
  applyFont(doc, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  doc.text('Subtotal Neto:', totalsX, y + 4);
  doc.text(invoice.subtotal.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), rightMargin - 2, y + 4, { align: 'right' });

  doc.text('ITBIS Liquidado:', totalsX, y + 9);
  doc.text(invoice.taxAmount.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), rightMargin - 2, y + 9, { align: 'right' });

  // Double thin line before Total
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  if (style === 'Elegante') {
    doc.line(totalsX, y + 12, rightMargin, y + 12);
    doc.line(totalsX, y + 13.5, rightMargin, y + 13.5);
    y += 1.5;
  } else {
    doc.line(totalsX, y + 12, rightMargin, y + 12);
  }

  applyFont(doc, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL A PAGAR:', totalsX, y + 18);
  doc.text(invoice.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), rightMargin - 2, y + 18, { align: 'right' });

  // 6. OFFICIAL FOOTER / DGII COMPLIANCE WARNINGS
  y += 28;
  if (y < 250) {
    y = 250; // Pin to bottom
  }

  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, y, rightMargin, y);

  applyFont(doc, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  const footerText = settings.footerNote || 'Cualquier modificación o reclamo debe realizarse dentro de los primeros 5 días. Documento emitido de acuerdo a la normativa fiscal de República Dominicana.';
  const splitFooter = doc.splitTextToSize(footerText, rightMargin - leftMargin);
  doc.text(splitFooter, leftMargin, y + 4);

  // Download the generated file
  const filename = `${invoice.type === 'Cotizacion' ? 'Cotizacion' : 'Factura'}_${invoice.invoiceNumber}.pdf`;
  doc.save(filename);
};

export const generateReceiptPDF = async (receipt: any, settings: TemplateSettings) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const style = settings.templateStyle || 'Moderna';

  const applyFont = (pdfDoc: jsPDF, type: 'normal' | 'bold' | 'italic' | 'bolditalic') => {
    let fontName = 'helvetica';
    if (style === 'Elegante' || style === 'Clásica') {
      fontName = 'times';
    } else if (style === 'Minimalista' || style === 'Tecnológica') {
      fontName = 'courier';
    }
    pdfDoc.setFont(fontName, type);
  };

  let y = 15;
  const leftMargin = 15;
  const rightMargin = 195;

  const brandColor = settings.primaryColor || '#171717';
  const rgb = hexToRgb(brandColor);

  // Draw double borders for Clásica Style
  if (style === 'Clásica') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.4);
    doc.rect(5, 5, 206, 269, 'S');
    doc.setLineWidth(0.2);
    doc.rect(6.2, 6.2, 203.6, 266.6, 'S');
  }

  // Logo representation
  let logoWidth = 25;
  const logoHeight = 15; // Fixed height
  let logoDataUrl: string | null = null;
  let logoFormat = 'PNG';
  if (settings.logoUrl) {
    try {
      const dimensions = await getImageDimensionsAndData(settings.logoUrl);
      if (dimensions.height > 0) {
        logoWidth = (dimensions.width / dimensions.height) * logoHeight;
        logoDataUrl = dimensions.dataUrl;
        logoFormat = dimensions.format;
      }
    } catch (e) {
      console.warn("Failed to retrieve logo dimensions inside receipt", e);
    }
  }

  if (style === 'Corporativa') {
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 30, 'F');

    let logoRendered = false;
    if (settings.logoUrl) {
      try {
        doc.addImage(logoDataUrl || settings.logoUrl, logoFormat, leftMargin + 5, y + 7.5, logoWidth, logoHeight);
        logoRendered = true;
      } catch (e) {
        console.warn("Failed to embed logo inside receipt", e);
      }
    }
    
    if (!logoRendered) {
      doc.setFillColor(255, 255, 255);
      doc.rect(leftMargin + 5, y + 7.5, 15, 15, 'F');
    }

    doc.setTextColor(255, 255, 255);
    applyFont(doc, 'bold');
    doc.setFontSize(15);
    doc.text(settings.businessName || 'Mi Empresa', leftMargin + 5 + (settings.logoUrl ? logoWidth + 5 : 22), y + 13);

    doc.setFontSize(8);
    applyFont(doc, 'normal');
    doc.text(`RNC: ${settings.businessRNC || 'N/D'} | Tel: ${settings.businessPhone || 'N/D'}`, leftMargin + 5 + (settings.logoUrl ? logoWidth + 5 : 22), y + 20);
    doc.text(`Email: ${settings.businessEmail || 'N/D'} | Dirección: ${settings.businessAddress || 'N/D'}`, leftMargin + 5 + (settings.logoUrl ? logoWidth + 5 : 22), y + 25);

    y += 38;
  } else if (style === 'Clásica') {
    if (settings.logoUrl) {
      try {
        doc.addImage(logoDataUrl || settings.logoUrl, logoFormat, (210 - logoWidth) / 2, y, logoWidth, logoHeight);
        y += logoHeight + 5;
      } catch (e) {
        console.warn("Failed to embed logo inside receipt", e);
        y += 5;
      }
    }

    doc.setTextColor(30, 30, 30);
    applyFont(doc, 'bold');
    doc.setFontSize(15);
    doc.text(settings.businessName || 'Mi Empresa', 105, y + 2, { align: 'center' });

    y += 8;
    applyFont(doc, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`RNC: ${settings.businessRNC || 'N/D'} | Tel: ${settings.businessPhone || 'N/D'}`, 105, y, { align: 'center' });
    doc.text(`Email: ${settings.businessEmail || 'N/D'} | Dirección: ${settings.businessAddress || 'N/D'}`, 105, y + 4, { align: 'center' });
    
    y += 10;
  } else {
    let logoRendered = false;
    if (settings.logoUrl) {
      try {
        doc.addImage(logoDataUrl || settings.logoUrl, logoFormat, leftMargin, y, logoWidth, logoHeight);
        logoRendered = true;
      } catch (e) {
        console.warn("Failed to embed logo inside receipt", e);
      }
    }

    if (!logoRendered) {
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(leftMargin, y, 15, 15, 'F');
    }

    doc.setTextColor(30, 30, 30);
    applyFont(doc, 'bold');
    doc.setFontSize(15);
    doc.text(settings.businessName || 'Mi Empresa', leftMargin + (logoRendered ? logoWidth + 5 : 20), y + 8);

    y += logoHeight + 4;
    applyFont(doc, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`RNC: ${settings.businessRNC || 'N/D'} | Tel: ${settings.businessPhone || 'N/D'}`, leftMargin, y);
    doc.text(`Email: ${settings.businessEmail || 'N/D'} | Dirección: ${settings.businessAddress || 'N/D'}`, leftMargin, y + 4);
    
    y += 10;
  }

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  if (style === 'Minimalista') {
    doc.setDrawColor(150, 150, 150);
    doc.line(leftMargin, y, rightMargin, y);
  } else if (style === 'Tecnológica') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(leftMargin, y, rightMargin, y);
    doc.setLineDashPattern([], 0);
  } else if (style === 'Elegante') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.line(leftMargin, y, rightMargin, y);
    doc.line(leftMargin, y + 0.8, rightMargin, y + 0.8);
    y += 1.5;
  } else {
    doc.line(leftMargin, y, rightMargin, y);
  }

  // Classification
  y += 10;
  applyFont(doc, 'bold');
  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text('RECIBO OFICIAL DE PAGO', leftMargin, y);

  applyFont(doc, 'bold');
  doc.setFontSize(9.5);
  doc.text('No. Recibo:', 130, y);
  applyFont(doc, 'normal');
  doc.text(receipt.receiptNumber, 162, y);

  applyFont(doc, 'bold');
  doc.text('Fecha Pago:', 130, y + 6);
  applyFont(doc, 'normal');
  doc.text(new Date(receipt.date).toLocaleDateString('es-DO'), 162, y + 6);

  // Client breakdown card
  y += 15;
  if (style === 'Elegante') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, rightMargin, y);
    doc.line(leftMargin, y + 40, rightMargin, y + 40);
  } else if (style === 'Minimalista') {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.25);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 40, 'S');
  } else if (style === 'Tecnológica') {
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.4);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 40, 'S');
  } else {
    doc.setFillColor(248, 249, 250);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 40, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.rect(leftMargin, y, rightMargin - leftMargin, 40, 'S');
  }

  applyFont(doc, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text('INFORMACIÓN DE LA TRANSACCIÓN', leftMargin + 5, y + 6);

  applyFont(doc, 'normal');
  doc.setFontSize(9);
  doc.text(`Recibimos de:`, leftMargin + 5, y + 14);
  applyFont(doc, 'bold');
  doc.text(receipt.clientName, leftMargin + 40, y + 14);

  applyFont(doc, 'normal');
  doc.text(`La suma de:`, leftMargin + 5, y + 21);
  applyFont(doc, 'bold');
  doc.text(receipt.amountPaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), leftMargin + 40, y + 21);

  applyFont(doc, 'normal');
  doc.text(`Por concepto de:`, leftMargin + 5, y + 28);
  doc.text(`Abono / Liquidación a la Factura Ref. ${receipt.invoiceNumber}`, leftMargin + 40, y + 28);

  applyFont(doc, 'normal');
  doc.text(`Vía de Pago:`, leftMargin + 5, y + 35);
  applyFont(doc, 'bold');
  doc.text(receipt.paymentMethod, leftMargin + 40, y + 35);

  // Notes Block
  if (receipt.notes) {
    y += 48;
    applyFont(doc, 'bold');
    doc.setFontSize(9.5);
    doc.text('Comentarios / Anotaciones:', leftMargin, y);
    applyFont(doc, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(receipt.notes, leftMargin, y + 6);
  }

  // Stamp Block
  y = 200;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, y, leftMargin + 60, y);
  doc.line(rightMargin - 60, y, rightMargin, y);

  applyFont(doc, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text('Firma Recibido AUTORIZADO', leftMargin + 12, y + 5);
  doc.text('Firma Entregado por Cliente', rightMargin - 48, y + 5);

  // Footer line
  y = 250;
  doc.setDrawColor(230, 230, 230);
  doc.line(leftMargin, y, rightMargin, y);

  applyFont(doc, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Este documento es un comprobante de abono oficial. Gracias por preferir FacturaDo.', leftMargin, y + 5);

  doc.save(`Recibo_${receipt.receiptNumber}.pdf`);
};
