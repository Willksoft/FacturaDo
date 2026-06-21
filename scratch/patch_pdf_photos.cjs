const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/pdfGenerator.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace the forEach with a for loop
const target = `  invoice.items.forEach((item, index) => {
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
    doc.text(descText, rX + 2, y + 5.5);`;

const replacement = `  for (let index = 0; index < invoice.items.length; index++) {
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
            const dims = await getImageDimensions(item.imageUrl);
            if (dims.height > 0) {
               const h = 5; // 5mm height
               const w = (dims.width / dims.height) * h;
               // Extract format to avoid jsPDF errors, fallback to PNG
               let format = 'PNG';
               if (item.imageUrl.toLowerCase().endsWith('.jpg') || item.imageUrl.toLowerCase().endsWith('.jpeg')) {
                   format = 'JPEG';
               } else if (item.imageUrl.toLowerCase().endsWith('.webp')) {
                   format = 'WEBP';
               }
               doc.addImage(item.imageUrl, format, rX + 2, y + 1.5, w, h);
               imgShift = w + 3; // Shift text right
            }
        } catch(e) {
            console.warn("Failed to load item image for PDF", e);
        }
    }

    doc.text(descText, rX + 2 + imgShift, y + 5.5);`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    // Also we need to replace the closing `});` of the forEach with `}`
    const endTarget = `    // Total General (item total)
    rX += colWidths[3];
    doc.text(item.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), rX + colWidths[4] - 2, y + 5.5, { align: 'right' });

    y += 8;
  });`;
    const endReplacement = `    // Total General (item total)
    rX += colWidths[3];
    doc.text(item.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }), rX + colWidths[4] - 2, y + 5.5, { align: 'right' });

    y += 8;
  }`;
    content = content.replace(endTarget, endReplacement);
} else {
    console.log("Could not find the target string in pdfGenerator.ts");
}

fs.writeFileSync(file, content);
console.log('pdfGenerator.ts patched with item photos');
