import { Invoice } from '../types';

/**
 * Downloads a string content as a .txt file in the browser
 */
export function downloadTxtFile(filename: string, textContent: string) {
  const element = document.createElement('a');
  const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Generates DGII 606 Format File (.TXT)
 */
export function generateDgii606Txt(
  records: any[],
  companyRnc: string,
  periodYyyyMm: string
): string {
  const cleanRnc = (companyRnc || '').replace(/[^0-9]/g, '');
  const cleanPeriod = (periodYyyyMm || '').replace(/[^0-9]/g, '');
  const header = `606|${cleanRnc}|${cleanPeriod}|${records.length}`;

  const lines = records.map((r: any) => {
    const rnc = (r.rncOrCedula || '').replace(/[^0-9]/g, '');
    const idType = rnc.length === 11 ? '2' : '1'; // 1=RNC, 2=Cedula
    const expenseType = String(r.expenseType || '02').padStart(2, '0');
    const ncf = r.ncf || '';
    const modifiedNcf = r.modifiedNcf || '';
    const date = (r.date || '').replace(/[^0-9]/g, '');
    const paymentDate = (r.paymentDate || r.date || '').replace(/[^0-9]/g, '');
    
    const serviceAmt = Number(r.serviceAmount || 0).toFixed(2);
    const goodsAmt = Number(r.goodsAmount || 0).toFixed(2);
    const totalAmt = Number(r.totalAmount || (r.serviceAmount || 0) + (r.goodsAmount || 0)).toFixed(2);
    const itbisBilled = Number(r.itbisBilled || 0).toFixed(2);
    const itbisWithheld = Number(r.itbisWithheldByState || r.itbisWithheld || 0).toFixed(2);
    const itbisProportional = '0.00';
    const itbisToCost = '0.00';
    const itbisToAdvance = Number(r.itbisBilled || 0).toFixed(2);
    const itbisPerceived = '0.00';
    const isrType = r.isrType || '';
    const isrWithheld = Number(r.isrWithheld || 0).toFixed(2);
    const isc = '0.00';
    const otherTaxes = '0.00';
    const tip = '0.00';
    const paymentMethod = String(r.paymentMethod || '01').padStart(2, '0');

    return [
      rnc,
      idType,
      expenseType,
      ncf,
      modifiedNcf,
      date,
      paymentDate,
      serviceAmt,
      goodsAmt,
      totalAmt,
      itbisBilled,
      itbisWithheld,
      itbisProportional,
      itbisToCost,
      itbisToAdvance,
      itbisPerceived,
      isrType,
      isrWithheld,
      isc,
      otherTaxes,
      tip,
      paymentMethod
    ].join('|');
  });

  return [header, ...lines].join('\r\n');
}

/**
 * Generates DGII 607 Format File (.TXT)
 */
export function generateDgii607Txt(
  invoices: Invoice[],
  companyRnc: string,
  periodYyyyMm: string
): string {
  const cleanRnc = (companyRnc || '').replace(/[^0-9]/g, '');
  const cleanPeriod = (periodYyyyMm || '').replace(/[^0-9]/g, '');
  const validInvoices = invoices.filter(inv => inv.status !== 'Anulada');
  const header = `607|${cleanRnc}|${cleanPeriod}|${validInvoices.length}`;

  const lines = validInvoices.map(inv => {
    const clientRnc = (inv.client?.rncOrCedula || '').replace(/[^0-9]/g, '');
    const idType = clientRnc.length === 11 ? '2' : clientRnc ? '1' : '3';
    const ncf = inv.ncf || '';
    const modifiedNcf = '';
    const incomeType = '01'; // 01=Ingresos por Operaciones
    const date = (inv.createdAt || '').replace(/[-/T:]/g, '').slice(0, 8);
    const withholdingDate = '';
    const billedAmt = Number(inv.subtotal || inv.total || 0).toFixed(2);
    const itbisAmt = Number(inv.taxAmount || 0).toFixed(2);
    const itbisWithheld = '0.00';
    const itbisPerceived = '0.00';
    const isrWithheld = '0.00';
    const isrPerceived = '0.00';
    const isc = '0.00';
    const otherTaxes = '0.00';
    const tip = '0.00';

    // Payment methods breakdown
    const isCredit = (inv.paymentMethod || '').toLowerCase().includes('crédito') || (inv.paymentMethod || '').toLowerCase().includes('credito');
    const isCard = (inv.paymentMethod || '').toLowerCase().includes('tarjeta');
    const isTransfer = (inv.paymentMethod || '').toLowerCase().includes('transferencia');

    const total = Number(inv.total || 0).toFixed(2);
    const cash = (!isCredit && !isCard && !isTransfer) ? total : '0.00';
    const transfer = isTransfer ? total : '0.00';
    const card = isCard ? total : '0.00';
    const credit = isCredit ? total : '0.00';
    const giftCert = '0.00';
    const permuta = '0.00';
    const otherPay = '0.00';

    return [
      clientRnc,
      idType,
      ncf,
      modifiedNcf,
      incomeType,
      date,
      withholdingDate,
      billedAmt,
      itbisAmt,
      itbisWithheld,
      itbisPerceived,
      isrWithheld,
      isrPerceived,
      isc,
      otherTaxes,
      tip,
      cash,
      transfer,
      card,
      credit,
      giftCert,
      permuta,
      otherPay
    ].join('|');
  });

  return [header, ...lines].join('\r\n');
}

/**
 * Generates DGII 608 Format File (.TXT) - Anulaciones de Comprobantes Fiscales
 */
export function generateDgii608Txt(
  cancelledInvoices: Invoice[],
  companyRnc: string,
  periodYyyyMm: string
): string {
  const cleanRnc = (companyRnc || '').replace(/[^0-9]/g, '');
  const cleanPeriod = (periodYyyyMm || '').replace(/[^0-9]/g, '');
  const header = `608|${cleanRnc}|${cleanPeriod}|${cancelledInvoices.length}`;

  const lines = cancelledInvoices.map(inv => {
    const ncf = inv.ncf || '';
    const date = (inv.createdAt || '').replace(/[-/T:]/g, '').slice(0, 8);
    const cancelReason = '04'; // 04=Errores de digitación / Modificación de factura

    return [
      ncf,
      date,
      cancelReason
    ].join('|');
  });

  return [header, ...lines].join('\r\n');
}
