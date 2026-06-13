import React, { useState } from 'react';
import { Invoice, Receipt, NcfType, PaymentMethod, Client, TemplateSettings } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Edit, Copy, Download, ReceiptIcon, CircleAlert, CheckCircle2, Landmark, HelpCircle, Mail, AlertTriangle, Calendar, Printer, Palette, MessageCircle } from 'lucide-react';
import { generateInvoicePDF } from '../lib/pdfGenerator';
import TemplateStylePicker from './TemplateStylePicker';

interface DocumentDetailsViewProps {
  invoice: Invoice;
  receipts: Receipt[];
  invoices: Invoice[];
  templateSettings: TemplateSettings;
  currentUser: any;
  payInvoice: (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string) => void;
  onBack: () => void;
  onEdit: (invoice: Invoice) => void;
  onDuplicate: (invoice: Invoice) => void;
  onNavigateToDocument: (invoice: Invoice) => void;
  convertQuoteToInvoice?: (quoteId: string, ncfType: NcfType) => Invoice | null;
  saveTemplateSettings?: (updates: TemplateSettings) => void;
}

export default function DocumentDetailsView({
  invoice,
  receipts,
  invoices,
  templateSettings,
  currentUser,
  payInvoice,
  onBack,
  onEdit,
  onDuplicate,
  onNavigateToDocument,
  convertQuoteToInvoice,
  saveTemplateSettings,
}: DocumentDetailsViewProps) {
  const [inlinePaying, setInlinePaying] = useState(false);
  const [payAmount, setPayAmount] = useState(String(invoice.total));
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Efectivo');
  const [payNotes, setPayNotes] = useState('');

  // Mixed Payments states
  const [isMixedPayment, setIsMixedPayment] = useState(false);
  const [mixedCash, setMixedCash] = useState('0');
  const [mixedCard, setMixedCard] = useState('0');
  const [mixedTransfer, setMixedTransfer] = useState('0');
  
  // Convert Quote State
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedConvertNcf, setSelectedConvertNcf] = useState<NcfType>('B02');

  // Settle payments linked to this document
  const associatedReceipts = receipts.filter(r => r.invoiceId === invoice.id);
  const totalPaidSum = associatedReceipts.reduce((sum, r) => sum + r.amountPaid, 0);
  const remaingBalance = Math.max(0, invoice.total - totalPaidSum);

  const canEdit = currentUser.permissions.canEditInvoice || currentUser.role === 'Administrador';
  const isQuote = invoice.type === 'Cotizacion';

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${invoice.type} ${invoice.invoiceNumber || ''} - ${templateSettings.businessName}`);
    const body = encodeURIComponent(`Hola ${invoice.client.name},\n\nAdjunto encontrará la ${invoice.type.toLowerCase()} correspondiente.\n\nPor favor, descargue el PDF generado desde nuestro sistema.\n\nSaludos,\n${templateSettings.businessName}`);
    window.location.href = `mailto:${invoice.client.email || ''}?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppShare = () => {
    const phone = invoice.client.phone?.replace(/\D/g, '') || '';
    const text = encodeURIComponent(`Hola ${invoice.client.name}, le enviamos los detalles de su ${invoice.type.toLowerCase()} ${invoice.invoiceNumber || ''} por un total de RD$ ${invoice.total.toLocaleString('es-DO')}.\n\nSaludos,\n${templateSettings.businessName}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (isMixedPayment) {
      const cashVal = parseFloat(mixedCash) || 0;
      const cardVal = parseFloat(mixedCard) || 0;
      const transVal = parseFloat(mixedTransfer) || 0;
      const totalMixed = cashVal + cardVal + transVal;

      if (totalMixed <= 0) {
        alert('Por favor, ingrese al menos un monto mayor a cero en los métodos de pago mixto.');
        return;
      }

      if (totalMixed > remaingBalance + 0.1) {
        alert(`La suma del pago mixto (RD$ ${totalMixed.toFixed(2)}) supera el balance pendiente de RD$ ${remaingBalance.toFixed(2)}.`);
        return;
      }

      // Register payment for each selected method
      if (cashVal > 0) {
        payInvoice(invoice.id, cashVal, 'Efectivo', payNotes ? `${payNotes} (Mixto - Efectivo)` : 'Pago Mixto - Efectivo');
      }
      if (cardVal > 0) {
        payInvoice(invoice.id, cardVal, 'Tarjeta', payNotes ? `${payNotes} (Mixto - Tarjeta)` : 'Pago Mixto - Tarjeta');
      }
      if (transVal > 0) {
        payInvoice(invoice.id, transVal, 'Transferencia', payNotes ? `${payNotes} (Mixto - Transf.)` : 'Pago Mixto - Transferencia');
      }

      setInlinePaying(false);
      setPayNotes('');
      setMixedCash('0');
      setMixedCard('0');
      setMixedTransfer('0');
      setIsMixedPayment(false);
      setPayAmount(String(Math.max(0, remaingBalance - totalMixed)));
    } else {
      const parsedAmount = parseFloat(payAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert('Por favor ingrese un monto válido para registrar el recibo.');
        return;
      }
      payInvoice(invoice.id, parsedAmount, payMethod, payNotes);
      setInlinePaying(false);
      setPayNotes('');
      // Auto align state
      setPayAmount(String(Math.max(0, remaingBalance - parsedAmount)));
    }
  };

  return (
    <div className="space-y-6" id="document-detail-page">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-250">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors gap-1.5"
            id="back-list-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isQuote ? 'Volver a Cotizaciones' : 'Volver a Facturas'}
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading" id="detail-view-heading">
            {isQuote ? 'Detalles de la Cotización' : 'Detalles de la Factura'}
          </h2>
          <p className="text-xs text-neutral-500">
            Registro comercial oficial y visualización de NCF / impuestos de la República Dominicana.
          </p>
        </div>

        {/* COMPREHENSIVE ACTIONS TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2">
          {isQuote && !invoice.convertedToInvoiceNo && convertQuoteToInvoice && (
            <Button
              type="button"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-8.5 px-3.5 font-bold animate-pulse shadow-sm flex items-center gap-1.5"
              onClick={() => setShowConvertModal(true)}
              id="convert-quote-btn"
            >
              <Landmark className="w-4 h-4 text-emerald-100" />
              Convertir en Factura ➜
            </Button>
          )}

          {/* Quick theme picker customization */}
          {saveTemplateSettings && (
            <TemplateStylePicker
              settings={templateSettings}
              saveTemplateSettings={saveTemplateSettings}
              variant="dropdown"
            />
          )}

          {/* Duplicate document button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-neutral-200 bg-white h-8.5 hover:bg-neutral-50 transition-colors"
            onClick={() => onDuplicate(invoice)}
            id="duplicate-doc-btn"
            title="Hacer una copia duplicada de este documento"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5 text-neutral-600" />
            Duplicar / Copiar
          </Button>

          {/* Download PDF button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-neutral-200 bg-white h-8.5 hover:bg-neutral-50 transition-colors"
            onClick={() => generateInvoicePDF(invoice, templateSettings)}
            id="download-doc-btn"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-neutral-600" />
            Descargar PDF
          </Button>

          {/* Email button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-neutral-200 bg-white h-8.5 hover:bg-neutral-50 transition-colors"
            onClick={handleEmailShare}
            id="email-doc-btn"
            title="Enviar documento por correo"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5 text-neutral-600" />
            Enviar
          </Button>

          {/* WhatsApp button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-neutral-200 bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-colors h-8.5"
            onClick={handleWhatsAppShare}
            id="whatsapp-doc-btn"
            title="Compartir por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-[#25D366]" />
            WhatsApp
          </Button>

          {/* Print button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-neutral-200 bg-white h-8.5 hover:bg-neutral-50 transition-colors"
            onClick={() => window.print()}
            id="print-doc-btn"
            title="Imprimir documento desde el navegador"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-neutral-600" />
            Imprimir
          </Button>

          {/* Edit button */}
          {canEdit && (
            <Button
              type="button"
              className="text-xs bg-neutral-950 text-white hover:bg-neutral-800 h-8.5 px-3.5 font-semibold"
              onClick={() => onEdit(invoice)}
              id="edit-doc-btn"
            >
              <Edit className="w-3.5 h-3.5 mr-1.5 text-neutral-200" />
              Editar {isQuote ? 'Cotización' : 'Factura'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6" id="document-detail-content-area">
        {/* THE VISUAL DOCUMENT SHEET */}
        <div className="w-full">
          <div className="bg-white p-8 md:p-12 rounded-xl border border-neutral-200 shadow-sm space-y-6 mx-auto w-full md:max-w-[8.5in] md:min-h-[11in] flex flex-col justify-between" id="printable-commercial-sheet" style={{ fontFamily: templateSettings.fontFamily || "Inter" }}>
            <div className="space-y-6">
            {/* BRANDING SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-neutral-150 pb-5 gap-4">
              <div className="space-y-2 flex items-start gap-4">
                {templateSettings.logoUrl ? (
                  <img
                    src={templateSettings.logoUrl}
                    alt="Logo"
                    className="h-12 w-auto object-contain rounded border border-neutral-100 bg-white"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div 
                    className="w-11 h-11 rounded-xl text-white flex items-center justify-center p-2 shadow-xs shrink-0"
                    style={{ backgroundColor: templateSettings.primaryColor || '#171717' }}
                  >
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                )}
                <div>
                  <h4 className="text-[13px] font-extrabold text-neutral-950">{templateSettings.businessName}</h4>
                  <p className="text-[9px] text-neutral-550">RNC: {templateSettings.businessRNC}</p>
                  <p className="text-[9px] text-neutral-550">{templateSettings.businessAddress}</p>
                  <p className="text-[9px] text-neutral-550">Tel: {templateSettings.businessPhone} | {templateSettings.businessEmail}</p>
                </div>
              </div>
              <div className="text-left sm:text-right space-y-1.5">
                <span 
                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase ${isQuote ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'text-white'}`}
                  style={!isQuote ? { backgroundColor: templateSettings.primaryColor || '#171717' } : undefined}
                >
                  {isQuote ? 'Presupuesto / Cotización' : 'Factura Comercial'}
                </span>
                <p className="text-[13px] font-black text-neutral-950 block leading-none">{invoice.invoiceNumber}</p>
                <p className="text-[9px] text-neutral-500">Fecha de Emisión: {new Date(invoice.createdAt).toLocaleDateString('es-DO')}</p>
              </div>
            </div>

            {/* CLIENT & TERMS INFO BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-neutral-50 p-3 rounded-lg border border-neutral-150">
                <span className="text-[8.5px] text-neutral-400 uppercase font-bold tracking-wider">Cliente Receptor</span>
                <div className="font-bold text-[11px] text-neutral-900 leading-tight">{invoice.client.name}</div>
                <div className="text-[9.5px] text-neutral-550">
                  {invoice.client.type === 'Empresa' ? 'RNC Fiscal' : 'Cédula de Identidad'}: {invoice.client.rncOrCedula}
                </div>
                <div className="text-[9.5px] text-neutral-550">Dirección: {invoice.client.address || 'SD, Rep. Dominicana'}</div>
              </div>

              <div className="space-y-1.5 bg-neutral-50 p-3 rounded-lg border border-neutral-150">
                <span className="text-[8.5px] text-neutral-400 uppercase font-bold tracking-wider">Términos de la Operación</span>
                <div><span className="font-medium text-neutral-500">Condición de Pago: </span> <span className="font-bold text-slate-900">{invoice.paymentCondition || 'Contado'}</span></div>
                <div><span className="font-medium text-neutral-500">Moneda Emisión: </span> <span className="font-bold text-slate-900">{invoice.currency || 'DOP'}</span></div>
                <div><span className="font-medium text-neutral-500">Comprobante Fiscal: </span> <span className="font-bold text-blue-800">{isQuote ? 'N/A (Cotización)' : `${invoice.ncfType} (${invoice.ncf})`}</span></div>
                <div><span className="font-medium text-neutral-500">Vía de Liquidación: </span> <span className="text-neutral-900 font-medium">{invoice.paymentMethod}</span></div>
                <div><span className="font-medium text-neutral-500">Vence / Vencimiento: </span> <span className="text-neutral-550 font-medium">{new Date(invoice.dueDate).toLocaleDateString('es-DO')}</span></div>
              </div>
            </div>

            {/* QUOTE AND INVOICE LINKING BAR */}
            {(invoice.originalQuoteNo || invoice.convertedToInvoiceNo) && (
              <div className="bg-blue-50 border border-blue-150 p-3 py-2.5 rounded-lg flex items-center justify-between text-xs" id="invoice-quote-relationship-ribbon-subview">
                <div className="flex items-center space-x-1.5 text-blue-900 leading-tight">
                  <span className="font-bold text-blue-700">⛓️ Relación Comercial:</span>
                  {invoice.type === 'Factura' && invoice.originalQuoteNo && (
                    <span>Generada a partir de la cotización <span className="font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200">{invoice.originalQuoteNo}</span></span>
                  )}
                  {invoice.type === 'Cotizacion' && invoice.convertedToInvoiceNo && (
                    <span>Procesada y emitida en la factura <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{invoice.convertedToInvoiceNo}</span></span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const targetNo = invoice.type === 'Factura' ? invoice.originalQuoteNo : invoice.convertedToInvoiceNo;
                    const related = invoices.find(inv => inv.invoiceNumber === targetNo);
                    if (related) {
                      onNavigateToDocument(related);
                    } else {
                      alert(`El documento ${targetNo} no pudo ser cargado.`);
                    }
                  }}
                  className="text-[10px] font-extrabold text-blue-700 bg-white hover:bg-blue-100 hover:text-blue-900 border border-blue-250 px-2.5 py-1 rounded-md transition-all shadow-xs shrink-0"
                >
                  Ver Relación
                </button>
              </div>
            )}

            {/* CONCEPTS DETAILED TABLE */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[10px] divide-y divide-neutral-200">
                <thead className="text-[9px] text-white uppercase tracking-wider" style={{ backgroundColor: templateSettings.primaryColor || '#171717' }}>
                  <tr className="divide-x divide-white/20">
                    <th className="px-3 py-2.5 font-bold text-center w-12 text-white">Cant.</th>
                    <th className="px-3 py-2.5 font-bold text-white">Concepto / Descripción</th>
                    <th className="px-3 py-2.5 font-bold text-right w-24 text-white">P. Unitario</th>
                    <th className="px-3 py-2.5 font-bold text-center w-16 text-white">Desc. %</th>
                    <th className="px-3 py-2.5 font-bold text-center w-14 text-white">ITBIS %</th>
                    <th className="px-3 py-2.5 font-bold text-right w-24 text-white">Suma Neto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white text-[10px]">
                  {invoice.items.map((it, idx) => (
                    <tr key={idx} className="divide-x divide-neutral-150 hover:bg-neutral-50/25">
                      <td className="px-3 py-1.5 text-center text-neutral-900 font-semibold">{it.quantity}</td>
                      <td className="px-3 py-1.5 text-neutral-900 font-medium">{it.name}</td>
                      <td className="px-3 py-1.5 text-right text-neutral-700">
                        {invoice.currency === 'USD' ? 'US$' : invoice.currency === 'EUR' ? '€' : 'RD$'} {it.price.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-1.5 text-center text-neutral-500 font-semibold">{it.discount ? `${it.discount}%` : '-'}</td>
                      <td className="px-3 py-1.5 text-center text-neutral-500">{it.taxRate}%</td>
                      <td className="px-3 py-1.5 text-right font-semibold text-neutral-950">
                        {invoice.currency === 'USD' ? 'US$' : invoice.currency === 'EUR' ? '€' : 'RD$'} {it.total.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTALS WRAPPER */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2 border-t border-neutral-100 mt-2">
              <div className="flex-1 text-left text-[10px] text-neutral-500 max-w-lg">
                {/* Dynamically render bank details on quotation/invoice if enabled */}
                {templateSettings.showBankAccountsOnQuote && (
                  <div className="space-y-1.5 mt-1 text-left" id="quotation-banking-panel">
                    <span className="font-extrabold uppercase tracking-wider text-neutral-600 text-[9px] block">Coordenadas de Depósito / Transferencia Bancaria:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[9px] text-neutral-855 leading-snug">
                      {templateSettings.bankAccounts && templateSettings.bankAccounts.length > 0 ? (
                        templateSettings.bankAccounts.slice(0, 3).map((acc, index) => (
                          <div key={index} className="bg-neutral-50/50 p-2 rounded-xl border border-neutral-200">
                            <div className="font-extrabold text-neutral-900 truncate leading-tight">{acc.bank}</div>
                            <div className="text-neutral-700 mt-0.5"><span className="font-semibold text-neutral-400">Nº:</span> {acc.number}</div>
                            <div className="flex justify-between items-center text-[8px] text-neutral-500 mt-0.5">
                              <span>{acc.type}</span>
                              <span className="font-extrabold text-neutral-700">{acc.currency}</span>
                            </div>
                            <div className="text-neutral-500 text-[8px] mt-0.5 truncate"><span className="text-neutral-450">Titular:</span> {acc.holder}</div>
                          </div>
                        ))
                      ) : templateSettings.bankAccountRef ? (
                        <div className="bg-neutral-50/50 p-2 rounded-xl border border-neutral-200">
                          <div className="font-extrabold text-neutral-900 truncate leading-tight">{templateSettings.bankAccountBank}</div>
                          <div className="text-neutral-700 mt-0.5"><span className="font-semibold text-neutral-400">Nº:</span> {templateSettings.bankAccountRef}</div>
                          <div className="flex justify-between items-center text-[8px] text-neutral-500 mt-0.5">
                            <span>{templateSettings.bankAccountType || 'Corriente'}</span>
                            <span className="font-extrabold text-neutral-700">{templateSettings.bankAccountCurrency || 'DOP'}</span>
                          </div>
                          <div className="text-neutral-500 text-[8px] mt-0.5 truncate"><span className="text-neutral-450">Titular:</span> {templateSettings.bankAccountName || templateSettings.businessName}</div>
                        </div>
                      ) : (
                        <div className="text-neutral-400 italic text-[9px]">No hay cuentas bancarias configuradas.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-60 space-y-1.5 text-[11px] text-right">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal Neto:</span>
                  <span className="font-semibold text-neutral-950">
                    {invoice.currency === 'USD' ? 'US$' : invoice.currency === 'EUR' ? '€' : 'RD$'} {invoice.subtotal.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {invoice.discountRate ? (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Desc. Global ({invoice.discountRate}%):</span>
                    <span>
                      - {invoice.currency === 'USD' ? 'US$' : invoice.currency === 'EUR' ? '€' : 'RD$'} {(invoice.discountAmount || 0).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between text-neutral-500">
                  <span>Suma Impuestos (ITBIS):</span>
                  <span className="font-semibold text-neutral-950">
                    {invoice.currency === 'USD' ? 'US$' : invoice.currency === 'EUR' ? '€' : 'RD$'} {invoice.taxAmount.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-neutral-950 pt-1.5 border-t border-neutral-200 mt-1.5">
                  <span>Monto Total Neto:</span>
                  <span className="text-base text-emerald-800 font-black font-heading leading-none">
                    {invoice.currency === 'USD' ? 'US$' : invoice.currency === 'EUR' ? '€' : 'RD$'} {invoice.total.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

            {/* CONDITIONS FOOTNOTE ACCENT */}
            {invoice.notes && (
              <div className="pt-3 border-t border-neutral-150 text-[10px] text-neutral-500">
                <span className="font-semibold block text-neutral-700 uppercase tracking-wider text-[9px]">Notas / Cláusulas Comerciales:</span>
                <p className="mt-0.5 leading-relaxed italic">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* FINANCIAL SUMMARY AND ACTIONS PANEL - POSITIONED BELOW */}
        <div className="mx-auto w-full md:max-w-[8.5in] grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* COMMERCIAL SHEET SUMMARY */}
          <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-neutral-50 border-b border-neutral-150 p-4">
              <CardTitle className="text-xs uppercase text-neutral-400 font-bold tracking-wider">Estado Técnico-Fiscal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-neutral-500">Estado del Documento:</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  invoice.status === 'Pagada' ? 'bg-emerald-50 text-emerald-850 border border-emerald-250' :
                  invoice.status === 'Anulada' ? 'bg-neutral-100 text-neutral-800' : 'bg-amber-50 text-amber-850 border border-amber-250'
                }`}>
                  {invoice.status}
                </span>
              </div>

              {isQuote && (
                <div className="border-t border-neutral-150 my-2 pt-2 space-y-2 text-xs">
                  {invoice.convertedToInvoiceNo ? (
                    <div className="space-y-1.5">
                      <span className="font-semibold text-neutral-550 block">Conversión de Factura:</span>
                      <p className="text-[10px] text-neutral-500 leading-normal">
                        Esta cotización ya fue convertida e integrada a la <strong>Factura No. {invoice.convertedToInvoiceNo}</strong>.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-[11px] border-neutral-250 hover:bg-neutral-50 text-blue-700 font-bold"
                        onClick={() => {
                          const linkedInvoice = invoices.find(inv => inv.invoiceNumber === invoice.convertedToInvoiceNo || inv.id === invoice.convertedToInvoiceId);
                          if (linkedInvoice) {
                            onNavigateToDocument(linkedInvoice);
                          } else {
                            alert("No se pudo cargar la factura vinculada.");
                          }
                        }}
                      >
                        Ver Factura Vinculada ➜
                      </Button>
                    </div>
                  ) : (
                    convertQuoteToInvoice && (
                      <div className="space-y-1.5">
                        <span className="font-semibold text-neutral-550 block">Acción Operativa:</span>
                        <p className="text-[10px] text-neutral-400 leading-normal">
                          Convierta esta cotización directamente en una factura comercial registrando los comprobantes impositivos válidos.
                        </p>
                        <Button
                          type="button"
                          className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 h-8.5 rounded-lg"
                          onClick={() => setShowConvertModal(true)}
                        >
                          <Landmark className="w-3.5 h-3.5 text-white" />
                          Generar Factura de Venta
                        </Button>
                      </div>
                    )
                  )}
                </div>
              )}

              {!isQuote && (
                <>
                  <div className="border-t border-neutral-150 my-2 pt-2 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-500">
                      <span>Monto Total:</span>
                      <span className="font-semibold text-neutral-800">{invoice.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Registrado Cobrado:</span>
                      <span className="font-semibold text-emerald-700">+{totalPaidSum.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-neutral-200 mt-1 pt-1 font-bold text-neutral-900">
                      <span>Balance Pendiente:</span>
                      <span className={remaingBalance > 0 ? 'text-amber-850' : 'text-emerald-700'}>
                        {remaingBalance.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </span>
                    </div>
                  </div>

                  {/* INLINE PAYMENT ACTIONS PANEL */}
                  {invoice.status !== 'Anulada' && canEdit && (
                    <div className="pt-2 border-t border-neutral-150">
                      {invoice.status === 'Pagada' ? (
                        <div className="text-center p-3 text-emerald-850 bg-emerald-50 rounded-xl border border-emerald-250 text-xs font-bold block">
                          ✅ Factura cobrada en su totalidad. Balance completado.
                        </div>
                      ) : !inlinePaying ? (
                        <Button
                          type="button"
                          className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5"
                          onClick={() => {
                            setPayAmount(String(remaingBalance > 0 ? remaingBalance : invoice.total));
                            setInlinePaying(true);
                          }}
                        >
                          <ReceiptIcon className="w-3.5 h-3.5 animate-pulse" />
                          Registrar Abono / Pago
                        </Button>
                      ) : (
                        <form onSubmit={handleRegisterPayment} className="space-y-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200 animate-fade-in">
                          <div className="flex justify-between items-center border-b border-neutral-200 pb-1.5">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Registrar Recibo</span>
                            
                            {/* Toggle Pago Mixto */}
                            <label className="flex items-center gap-1.5 select-none text-[10px] text-neutral-600 cursor-pointer font-extrabold uppercase">
                              <input
                                type="checkbox"
                                checked={isMixedPayment}
                                onChange={(e) => {
                                  setIsMixedPayment(e.target.checked);
                                  if (e.target.checked) {
                                    setMixedCash(String(remaingBalance));
                                    setMixedCard('0');
                                    setMixedTransfer('0');
                                  }
                                }}
                                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                              />
                              <span>Pago Mixto</span>
                            </label>
                          </div>

                          {isMixedPayment ? (
                            <div className="space-y-2.5 p-2.5 bg-white rounded-lg border border-neutral-200 text-xs shadow-xs">
                              <p className="text-[9px] text-neutral-400 font-extrabold uppercase">Monto por cada método:</p>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-[9px] font-bold text-neutral-600 block">Efectivo RD$</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={mixedCash}
                                    onChange={(e) => setMixedCash(e.target.value)}
                                    className="h-8 text-xs font-mono bg-neutral-50/30"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[9px] font-bold text-neutral-600 block">Tarjeta RD$</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={mixedCard}
                                    onChange={(e) => setMixedCard(e.target.value)}
                                    className="h-8 text-xs font-mono bg-neutral-50/30"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[9px] font-bold text-neutral-600 block">Transfer. RD$</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={mixedTransfer}
                                    onChange={(e) => setMixedTransfer(e.target.value)}
                                    className="h-8 text-xs font-mono bg-neutral-50/30"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-[10px] text-neutral-450 font-bold leading-none">
                                <span>Suma Mixta:</span>
                                <span className="font-mono text-neutral-800">
                                  RD$ {(parseFloat(mixedCash || '0') + parseFloat(mixedCard || '0') + parseFloat(mixedTransfer || '0')).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-1">
                                <Label htmlFor="pay-amt" className="text-[10px] font-semibold text-neutral-700">Monto del Pago (DOP)</Label>
                                <Input
                                  id="pay-amt"
                                  type="number"
                                  step="0.01"
                                  value={payAmount}
                                  onChange={(e) => setPayAmount(e.target.value)}
                                  className="h-8 text-xs bg-white border-neutral-250"
                                  max={remaingBalance > 0 ? remaingBalance : undefined}
                                  min={0.01}
                                  required
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="pay-met" className="text-[10px] font-semibold text-neutral-700">Vía / Método</Label>
                                <Select value={payMethod} onValueChange={(val: PaymentMethod) => setPayMethod(val)}>
                                  <SelectTrigger id="pay-met" className="h-8 bg-white border-neutral-250 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Efectivo">Efectivo (Cash)</SelectItem>
                                    <SelectItem value="Transferencia">Transferencia Bancaria</SelectItem>
                                    <SelectItem value="Tarjeta">Tarjeta de Crédito / Débito</SelectItem>
                                    <SelectItem value="Crédito">Crédito Asociado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}

                          <div className="space-y-1">
                            <Label htmlFor="pay-note" className="text-[10px] font-semibold text-neutral-700">Notas / Comentario (Opcional)</Label>
                            <Input
                              id="pay-note"
                              value={payNotes}
                              onChange={(e) => setPayNotes(e.target.value)}
                              placeholder="Ej. Recibo No. 71927"
                              className="h-8 text-xs bg-white border-neutral-250"
                            />
                          </div>

                          <div className="flex gap-1.5 pt-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1 h-7 text-[10px] border-neutral-250 hover:bg-neutral-100"
                              onClick={() => setInlinePaying(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              className="flex-1 h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                              Aplicar Cobro
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* ASSOCIATED PAYMENTS LOGS */}
          {!isQuote && (
            <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
              <CardHeader className="bg-neutral-50 border-b border-neutral-150 p-4">
                <CardTitle className="text-xs uppercase text-neutral-400 font-bold tracking-wider flex items-center justify-between">
                  <span>Suma Recibos Emitidos</span>
                  <span className="text-[10px] text-neutral-500 font-mono">({associatedReceipts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {associatedReceipts.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400 text-xs">
                    <CircleAlert className="w-5 h-5 mx-auto mb-2 text-neutral-300" />
                    No hay pagos registrados para esta factura fiscal.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {associatedReceipts.map((rec) => (
                      <div key={rec.id} className="flex flex-col p-2.5 rounded-lg border border-neutral-150 text-[11px] hover:bg-neutral-50 transition-colors">
                        <div className="flex justify-between items-start font-semibold text-neutral-900 leading-tight">
                           <span>{rec.receiptNumber}</span>
                          <span className="text-emerald-700 font-bold">{rec.amountPaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-1 leading-none">
                          <span>{new Date(rec.date).toLocaleDateString('es-DO')}</span>
                          <span>Vía: {rec.paymentMethod}</span>
                        </div>
                        {rec.notes && (
                          <div className="mt-1 text-[9px] text-neutral-450 italic border-t border-dashed border-neutral-150 pt-1 leading-normal">
                            Obs: {rec.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* CONVERT QUOTE TO INVOICE DIALOG MODAL */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-sm w-full p-5 space-y-4 shadow-2xl animate-fade-in font-sans">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mt-2.5">Autorizar y Convertir en Factura</h3>
              <p className="text-xs text-neutral-500">
                Está a un paso de generar una factura oficial basada en la cotización <strong>{invoice.invoiceNumber}</strong>. Elija el tipo de comprobante (NCF) requerido:
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="convert-ncf-select" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tipo Comprobante (NCF)</Label>
              <Select
                value={selectedConvertNcf}
                onValueChange={(val: NcfType) => setSelectedConvertNcf(val)}
              >
                <SelectTrigger id="convert-ncf-select" className="h-9 bg-white border-neutral-250 text-xs text-neutral-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="B02">B02 - Consumidor Final / Consumo</SelectItem>
                  <SelectItem value="B01">B01 - Crédito Fiscal (Válido para Costos y Gastos)</SelectItem>
                  <SelectItem value="B14">B14 - Regímenes Especiales de Tributación</SelectItem>
                  <SelectItem value="B15">B15 - Gubernamental</SelectItem>
                  <SelectItem value="SIN">SIN COMPROBANTE - Consumo Interno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2.5 pt-1.5">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-xs h-9 border-neutral-250 font-semibold"
                onClick={() => setShowConvertModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={() => {
                  if (convertQuoteToInvoice) {
                    const newInvoice = convertQuoteToInvoice(invoice.id, selectedConvertNcf);
                    if (newInvoice) {
                      setShowConvertModal(false);
                      onNavigateToDocument(newInvoice);
                    }
                  }
                }}
              >
                Generar Factura
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
