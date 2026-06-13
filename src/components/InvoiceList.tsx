import React, { useState } from 'react';
import { Invoice, Receipt, NcfType, PaymentMethod, Client, TemplateSettings } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Mail, RefreshCw, Trash2, Edit2, CheckCircle2, AlertTriangle, Play, HelpCircle, FileText, Sparkles, ReceiptIcon, Eye, Plus, Store } from 'lucide-react';
import { generateInvoicePDF } from '../lib/pdfGenerator';
import { exportMonthlyReportToExcel } from '../lib/excelExport';

interface InvoiceListProps {
  invoices: Invoice[];
  clients: Client[];
  receipts: Receipt[];
  updateInvoice: (id: string, updated: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  convertQuoteToInvoice: (id: string, ncf: NcfType) => Invoice | null;
  payInvoice: (invoiceId: string, amount: number, paymentMethod: PaymentMethod, notes?: string) => void;
  templateSettings: TemplateSettings;
  currentUser: any;
  initialDocFilter?: 'Todas' | 'Factura' | 'Cotizacion';
  initialStatusFilter?: 'Todas' | 'Pagada' | 'Pendiente' | 'Anulada';
  onNavigateToCreate?: (initialDocType?: 'Factura' | 'Cotizacion') => void;
  onNavigateToPos?: () => void;
  onViewDocument?: (invoice: Invoice) => void;
  onEditDocument?: (invoice: Invoice) => void;
}

export default function InvoiceList({
  invoices,
  clients,
  receipts,
  updateInvoice,
  deleteInvoice,
  convertQuoteToInvoice,
  payInvoice,
  templateSettings,
  currentUser,
  initialDocFilter,
  initialStatusFilter,
  onNavigateToCreate,
  onNavigateToPos,
  onViewDocument,
  onEditDocument,
}: InvoiceListProps) {
  const [docFilter, setDocFilter] = useState<'Todas' | 'Factura' | 'Cotizacion'>('Todas');
  const [statusFilter, setStatusFilter] = useState<'Todas' | 'Pagada' | 'Pendiente' | 'Anulada'>('Todas');
  const [listSearch, setListSearch] = useState('');
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'grid'>('list');

  React.useEffect(() => {
    if (initialDocFilter) {
      setDocFilter(initialDocFilter);
    }
  }, [initialDocFilter]);

  React.useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  // Edit / Viewer Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [editInvoiceModal, setEditInvoiceModal] = useState(false);
  const [payInvoiceModal, setPayInvoiceModal] = useState(false);
  const [convertQuoteModal, setConvertQuoteModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  // Editable fields in top-of-invoice visual editor
  const [editNcfType, setEditNcfType] = useState<NcfType>('B02');
  const [editSequenceNum, setEditSequenceNum] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [editDueDate, setEditDueDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editItems, setEditItems] = useState<{ productId: string; name: string; quantity: number; price: number; taxRate: number; taxAmount: number; total: number }[]>([]);

  // Payment dialog helper states
  const [payAmount, setPayAmount] = useState('0');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Efectivo');
  const [payNotes, setPayNotes] = useState('');

  // Convert dialog helper states
  const [convertNcfType, setConvertNcfType] = useState<NcfType>('B02');

  // Simulated email progress states
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentLogs, setEmailSentLogs] = useState<string[]>([]);
  const [emailCustomRec, setEmailCustomRec] = useState('');

  // Filtering Logic
  const filtered = invoices.filter(inv => {
    const matchesDoc = docFilter === 'Todas' || inv.type === docFilter;
    const matchesStatus = statusFilter === 'Todas' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(listSearch.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(listSearch.toLowerCase()) ||
      inv.ncf.toLowerCase().includes(listSearch.toLowerCase());
    return matchesDoc && matchesStatus && matchesSearch;
  });

  // Start Visual Edit on live overlay
  const openEditVisual = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setEditNcfType(inv.ncfType);
    setEditSequenceNum(String(inv.sequenceNumber));
    setEditPaymentMethod(inv.paymentMethod);
    setEditDueDate(inv.dueDate.split('T')[0]);
    setEditNotes(inv.notes || '');
    setEditItems(inv.items.map(it => ({
      productId: it.productId || '',
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      taxRate: it.taxRate,
      taxAmount: it.taxAmount,
      total: it.total,
    })));
    setEditInvoiceModal(true);
  };

  const handleSaveVisualEdits = () => {
    if (!selectedInvoice) return;

    // Generate new NCF string
    let newNcf = selectedInvoice.ncf;
    if (selectedInvoice.type === 'Factura') {
      if (editNcfType === 'SIN') {
        newNcf = 'SIN_COMPROBANTE';
      } else {
        const padding = String(editSequenceNum).padStart(8, '0');
        newNcf = `${editNcfType}${padding}`;
      }
    }

    const updatedData: Partial<Invoice> = {
      ncfType: editNcfType,
      sequenceNumber: Number(editSequenceNum) || 0,
      ncf: newNcf,
      paymentMethod: editPaymentMethod,
      dueDate: new Date(editDueDate).toISOString(),
      notes: editNotes,
      items: editItems,
    };

    updateInvoice(selectedInvoice.id, updatedData);
    setEditInvoiceModal(false);
    setSelectedInvoice(null);
  };

  // Convert quote trigger
  const handleTriggerConvert = () => {
    if (!selectedInvoice) return;
    const invoiceCreated = convertQuoteToInvoice(selectedInvoice.id, convertNcfType);
    if (invoiceCreated) {
      setConvertQuoteModal(false);
      setSelectedInvoice(null);
    }
  };

  // Payment execution
  const handleTriggerPayment = () => {
    if (!selectedInvoice) return;
    payInvoice(selectedInvoice.id, parseFloat(payAmount) || selectedInvoice.total, payMethod, payNotes);
    setPayInvoiceModal(false);
    setSelectedInvoice(null);
  };

  // Automated Email SMTP Simulation
  const handleSimulateEmail = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setEmailCustomRec(inv.client.email || 'correo@cliente.com.do');
    setEmailSentLogs([]);
    setEmailSending(false);
    setEmailModal(true);
  };

  const executeEmailDeliveryRoute = () => {
    setEmailSending(true);
    setEmailSentLogs([]);

    const log = (msg: string) => {
      setEmailSentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    setTimeout(() => log(`Conectando de forma segura con el servidor SMTP saliente...`), 400);
    setTimeout(() => log(`Autenticando como emisor autorizado (${templateSettings.businessEmail})...`), 1000);
    setTimeout(() => log(`Validando bandeja destinatario: <${emailCustomRec}>...`), 1600);
    setTimeout(() => log(`Renderizando factura ${selectedInvoice?.invoiceNumber} en plantilla HTML-PDF de alta resolución...`), 2400);
    setTimeout(() => log(`Estampando secuencia NCF ${selectedInvoice?.ncf} y anexando documento digital adjunto .pdf...`), 3200);
    setTimeout(() => log(`¡Envío completado exitosamente de forma autorizada!`), 4200);
    
    setTimeout(() => {
      setEmailSending(false);
      // Mark as Email Sent
      if (selectedInvoice) {
        updateInvoice(selectedInvoice.id, { sentByEmail: true });
      }
    }, 4500);
  };

  const canEdit = currentUser.permissions.canEditInvoice || currentUser.role === 'Administrador';
  const canDelete = currentUser.permissions.canDeleteInvoice || currentUser.role === 'Administrador';

  return (
    <div className="space-y-6" id="invoice-ledger">
      {/* FILTER CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-neutral-200 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Document filter tabs */}
          <div className="flex items-center space-x-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-150">
            <Button
              id="filter-doc-all"
              variant={docFilter === 'Todas' ? 'secondary' : 'ghost'}
              className="text-[11px] h-7 px-2.5 rounded-md text-neutral-800"
              onClick={() => setDocFilter('Todas')}
            >
              Todos
            </Button>
            <Button
              id="filter-doc-fac"
              variant={docFilter === 'Factura' ? 'secondary' : 'ghost'}
              className="text-[11px] h-7 px-2.5 rounded-md text-neutral-800"
              onClick={() => setDocFilter('Factura')}
            >
              Facturas
            </Button>
            <Button
              id="filter-doc-cot"
              variant={docFilter === 'Cotizacion' ? 'secondary' : 'ghost'}
              className="text-[11px] h-7 px-2.5 rounded-md text-neutral-800"
              onClick={() => setDocFilter('Cotizacion')}
            >
              Cotizaciones
            </Button>
          </div>

          {/* Status quick select */}
          <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
            <SelectTrigger id="filter-status-select" className="h-8 border-neutral-200 text-[11px] bg-neutral-50 w-32">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="Todas">Todos los Estados</SelectItem>
              <SelectItem value="Pagada">Pagadas</SelectItem>
              <SelectItem value="Pendiente">Pendientes</SelectItem>
              <SelectItem value="Anulada">Anuladas</SelectItem>
            </SelectContent>
          </Select>

          <Input
            id="list-filter-search"
            placeholder="No. Factura, cliente, NCF..."
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            className="h-8 text-xs border-neutral-200 w-44 md:w-56"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {onNavigateToPos && (
            <Button
              id="goto-pos-from-list"
              variant="outline"
              size="sm"
              className="text-xs border-emerald-250 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 font-semibold h-8 flex items-center justify-center transition-all shadow-xs w-full sm:w-auto"
              onClick={onNavigateToPos}
            >
              <Store className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              Punto de Venta (POS)
            </Button>
          )}

          {onNavigateToCreate && currentUser.permissions.canCreateInvoice && (
            <Button
              id="new-document-from-list"
              size="sm"
              className="text-xs bg-black text-white hover:bg-neutral-800 h-8 font-semibold flex items-center justify-center transition-all shadow-sm w-full sm:w-auto"
              onClick={() => onNavigateToCreate(docFilter === 'Cotizacion' ? 'Cotizacion' : 'Factura')}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {docFilter === 'Cotizacion' ? 'Nueva Cotización' : 'Nueva Factura'}
            </Button>
          )}

          <Button
            id="export-sales-excel"
            variant="outline"
            size="sm"
            className="text-xs border-neutral-200 bg-white h-8 hover:bg-neutral-50 transition-colors w-full sm:w-auto justify-center flex items-center"
            onClick={() => exportMonthlyReportToExcel(filtered)}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Exportar Grid (Excel)
          </Button>
        </div>
      </div>

      {/* DOCUMENT DIRECTORY GRID */}
      <Card className="border-neutral-200 shadow-none overflow-hidden rounded-xl">
        <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-neutral-900">Historial de Operaciones Comerciales ({filtered.length})</CardTitle>
            <CardDescription className="text-xs">Consolidador de fiscalidad. Las facturas son vinculadas en sus reportes de ventas 607.</CardDescription>
          </div>
          {/* Mobile view switcher */}
          <div className="flex lg:hidden items-center justify-end self-end sm:self-auto bg-neutral-155 p-0.5 rounded-lg border border-neutral-200">
            <button
              type="button"
              className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md transition-all border-0 cursor-pointer ${mobileViewMode === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 bg-transparent'}`}
              onClick={() => setMobileViewMode('list')}
            >
              Lista
            </button>
            <button
              type="button"
              className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md transition-all border-0 cursor-pointer ${mobileViewMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 bg-transparent'}`}
              onClick={() => setMobileViewMode('grid')}
            >
              Detalle
            </button>
          </div>
        </CardHeader>

        <div className="hidden lg:block">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="text-xs font-semibold text-neutral-700">No. Correlativo</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Fecha Emisión</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Cliente Asociado</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">NCF Comprobante</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Condición</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Valor Bruto</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Estado</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-neutral-400 py-16 text-sm">
                    Ningún documento coincide con los criterios de búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => {
                  const isQuote = inv.type === 'Cotizacion';
                  const isPaid = inv.status === 'Pagada';
                  const isCanceled = inv.status === 'Anulada';

                  return (
                    <TableRow
                      key={inv.id}
                      className="hover:bg-neutral-50/50 cursor-pointer transition-colors"
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('button') || target.closest('a') || target.closest('svg')) {
                          return;
                        }
                        if (onViewDocument) {
                          onViewDocument(inv);
                        } else {
                          setSelectedInvoice(inv);
                          setViewInvoiceModal(true);
                        }
                      }}
                    >
                      <TableCell className="font-semibold text-neutral-900 text-xs">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-500 whitespace-nowrap">
                        {new Date(inv.createdAt).toLocaleDateString('es-DO')}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-semibold text-neutral-850">{inv.client.name}</div>
                        <div className="text-[10px] text-neutral-450">{inv.client.rncOrCedula}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {isQuote ? (
                          <span className="text-neutral-400 italic text-[11px]">No Aplica (Cotización)</span>
                        ) : (
                          <span className={`text-xs font-bold ${inv.ncfType === 'SIN' ? 'text-neutral-500' : 'text-blue-750'}`}>
                            {inv.ncf}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-600">
                        {inv.paymentMethod}
                      </TableCell>
                      <TableCell className="text-right text-xs font-semibold text-neutral-900 whitespace-nowrap">
                        <div>{inv.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</div>
                        {!isQuote && (() => {
                          const invoicePaid = receipts.filter(r => r.invoiceId === inv.id).reduce((sum, r) => sum + r.amountPaid, 0);
                          if (invoicePaid > 0 && invoicePaid < inv.total) {
                            return (
                              <div className="text-[10px] text-amber-850 font-bold leading-none mt-0.5">
                                Cobrado: {invoicePaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                              </div>
                            );
                          } else if (invoicePaid >= inv.total) {
                            return (
                              <div className="text-[10px] text-emerald-700 font-bold leading-none mt-0.5">
                                Saldado Completo
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                          isPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          isCanceled ? 'bg-neutral-100 text-neutral-800' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {inv.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {/* VIEW & PRINT PDF */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-neutral-600 hover:bg-neutral-100 rounded-md"
                            onClick={() => generateInvoicePDF(inv, templateSettings)}
                            title="Descargar PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>

                          {/* EMAIL SEND SIMULATOR */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 rounded-md ${inv.sentByEmail ? 'text-emerald-600 hover:bg-emerald-50' : 'text-neutral-500 hover:bg-neutral-100'}`}
                            onClick={() => handleSimulateEmail(inv)}
                            title={inv.sentByEmail ? "Email Enviado" : "Enviar por Correo"}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </Button>

                          {/* CONVERT QUOTE TO INVOICE TRIGGER */}
                          {isQuote && isRoleAuthorizedAndOpen(currentUser) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-630 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                              onClick={() => { setSelectedInvoice(inv); setConvertNcfType('B02'); setConvertQuoteModal(true); }}
                              title="Convertir a Factura"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </Button>
                          )}

                          {/* PAY INVOICE TRIGGER */}
                          {!isQuote && !isPaid && !isCanceled && canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-emerald-655 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
                              onClick={() => { setSelectedInvoice(inv); setPayAmount(String(inv.total)); setPayNotes(''); setPayInvoiceModal(true); }}
                              title="Registrar Pago"
                            >
                              <ReceiptIcon className="w-3.5 h-3.5" />
                            </Button>
                          )}

                          {/* VISUAL COMPREHENSIVE EDITOR OVERLAY */}
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-neutral-600 hover:bg-neutral-100 rounded-md"
                              onClick={() => {
                                if (onEditDocument) {
                                  onEditDocument(inv);
                                } else {
                                  openEditVisual(inv);
                                }
                              }}
                              title="Editor de Factura (NCF y Datos)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          )}

                          {/* ANNIHILATE / CANCEL DOCUMENT */}
                          {canDelete && !isCanceled && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-655 hover:bg-red-50 hover:text-red-750 rounded-md"
                              onClick={() => {
                                if (isQuote) {
                                  deleteInvoice(inv.id);
                                } else {
                                  if (confirm('¿Está seguro de anular esta factura fiscal? Esto restaurará el stock de inventario y registrará la anulación para el reporte DGII 608.')) {
                                    updateInvoice(inv.id, { status: 'Anulada' });
                                  }
                                }
                              }}
                              title={isQuote ? "Eliminar Cotización" : "Anular Factura Fiscal"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* MOBILE RESPONSIVE CARD GRID LIST (NO SCROLL REQUIRED) */}
        <div className="block lg:hidden bg-neutral-50/20">
          {filtered.length === 0 ? (
            <div className="text-center text-neutral-400 py-16 text-xs">
              Ningún documento coincide con los criterios de búsqueda.
            </div>
          ) : mobileViewMode === 'list' ? (
            /* APPLE LEDGER-STYLE LIST MODE */
            <div className="flex flex-col bg-white divide-y divide-neutral-100">
              {filtered.map((inv) => {
                const isQuote = inv.type === 'Cotizacion';
                const isPaid = inv.status === 'Pagada';
                const isCanceled = inv.status === 'Anulada';
                const paymentMethodLabel = inv.paymentMethod;
                const formattedDate = new Date(inv.createdAt).toLocaleDateString('es-DO', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={inv.id}
                    onClick={() => {
                      if (onViewDocument) {
                        onViewDocument(inv);
                      } else {
                        setSelectedInvoice(inv);
                        setViewInvoiceModal(true);
                      }
                    }}
                    className="flex items-center justify-between p-4 active:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    {/* Left side: Icon inside round indicator circle & text */}
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                      {/* Round indicator circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isPaid ? 'bg-emerald-50 text-emerald-600' :
                        isCanceled ? 'bg-neutral-100 text-neutral-400' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {isPaid ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isCanceled ? (
                          <Trash2 className="w-5 h-5 text-neutral-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                        )}
                      </div>

                      {/* Detail texts */}
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-extrabold text-neutral-900 text-xs sm:text-sm truncate">
                          {inv.client.name}
                        </div>
                        <div className="text-[10px] text-neutral-450 mt-1 flex flex-wrap items-center gap-1 font-medium">
                          <span className="font-bold text-neutral-700">{inv.invoiceNumber}</span>
                          <span className="text-neutral-300">·</span>
                          <span>{paymentMethodLabel}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="font-mono text-[9px]">{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Cost & status badge */}
                    <div className="flex flex-col items-end justify-center ml-3 shrink-0 text-right">
                      <span className="font-extrabold text-xs sm:text-sm text-neutral-900">
                        {inv.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </span>
                      <span className={`text-[10px] font-bold mt-1 ${
                        isPaid ? 'text-emerald-600' :
                        isCanceled ? 'text-neutral-400 font-normal line-through' : 'text-amber-600'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-3">
              {filtered.map((inv) => {
                const isQuote = inv.type === 'Cotizacion';
                const isPaid = inv.status === 'Pagada';
                const isCanceled = inv.status === 'Anulada';
                const invoicePaid = receipts.filter(r => r.invoiceId === inv.id).reduce((sum, r) => sum + r.amountPaid, 0);

                return (
                  <div
                    key={inv.id}
                    onClick={() => {
                      if (onViewDocument) {
                        onViewDocument(inv);
                      } else {
                        setSelectedInvoice(inv);
                        setViewInvoiceModal(true);
                      }
                    }}
                    className="p-4 rounded-xl border border-neutral-150 bg-white hover:border-neutral-300 transition-all flex flex-col gap-3 relative shadow-xs active:bg-neutral-50"
                  >
                    {/* Header: Core correlative, date, status */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-neutral-900 text-xs sm:text-sm">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {new Date(inv.createdAt).toLocaleDateString('es-DO')}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                        isPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        isCanceled ? 'bg-neutral-105 text-neutral-800' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    {/* Client & NCF information */}
                    <div className="space-y-1.5 py-1.5 px-2 bg-neutral-50/70 rounded-lg p-2.5">
                      <div className="text-xs">
                        <span className="text-neutral-400 font-medium mr-1 text-[10px] uppercase block mb-0.5">Cliente</span>
                        <span className="font-bold text-neutral-850 block">{inv.client.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono block">RNC/Cédula: {inv.client.rncOrCedula}</span>
                      </div>
                      <div className="text-xs flex items-center justify-between border-t border-neutral-100/50 pt-2 mt-2">
                        <div>
                          <span className="text-neutral-400 font-medium mr-1 text-[10px] uppercase block mb-0.5">NCF</span>
                          {isQuote ? (
                            <span className="text-neutral-400 italic text-[10px]">No Aplica (Cotización)</span>
                          ) : (
                            <span className="text-[11px] font-mono font-extrabold text-blue-750">
                              {inv.ncf}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] bg-white border border-neutral-200 text-neutral-600 px-1.5 py-0.5  rounded font-bold select-none h-5 flex items-center">
                          {inv.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* Total cost details & Partials */}
                    <div className="flex items-center justify-between border-t border-neutral-100/70 pt-2">
                      <span className="text-xs font-semibold text-neutral-500">Monto Liquidado</span>
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-extrabold text-neutral-950">
                          {inv.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </span>
                        {!isQuote && (() => {
                          if (invoicePaid > 0 && invoicePaid < inv.total) {
                            return (
                              <div className="text-[9px] text-amber-800 font-bold leading-none mt-0.5">
                                Cobrado: {invoicePaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                              </div>
                            );
                          } else if (invoicePaid >= inv.total) {
                            return (
                              <div className="text-[9px] text-emerald-700 font-bold leading-none mt-0.5">
                                Saldado Completo
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    {/* Button Controls tailored to fingers */}
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="grid grid-cols-4 gap-1.5 pt-2 border-t border-neutral-100/70 mt-1"
                    >
                      {/* VIEW & PRINT PDF */}
                      <button
                        type="button"
                        className="bg-neutral-100 hover:bg-neutral-150 text-neutral-700 active:scale-95 duration-100 py-2 h-9 rounded-lg flex items-center justify-center cursor-pointer border-0 font-bold text-[10px]"
                        onClick={() => generateInvoicePDF(inv, templateSettings)}
                        title="Descargar PDF"
                      >
                        <Download className="w-4 h-4 text-neutral-500" />
                      </button>

                      {/* EMAIL SEND SIMULATION */}
                      <button
                        type="button"
                        className={`active:scale-95 duration-100 py-2 h-9 rounded-lg flex items-center justify-center cursor-pointer border-0 font-bold text-[10px] ${
                          inv.sentByEmail 
                            ? 'bg-emerald-55 text-emerald-800 hover:bg-emerald-100' 
                            : 'bg-neutral-100 hover:bg-neutral-150 text-neutral-705'
                        }`}
                        onClick={() => handleSimulateEmail(inv)}
                        title="Enviar Correo"
                      >
                        <Mail className={`w-4 h-4 ${inv.sentByEmail ? 'text-emerald-600' : 'text-neutral-500'}`} />
                      </button>

                      {/* QUICK CONVERT OR TRANSACTION REGISTER */}
                      {isQuote ? (
                        isRoleAuthorizedAndOpen(currentUser) ? (
                          <button
                            type="button"
                            className="col-span-2 bg-blue-630 hover:bg-blue-700 text-white active:scale-95 duration-100 py-2 h-9 rounded-lg flex items-center justify-center gap-1 cursor-pointer border-0 font-bold text-[10px]"
                            onClick={() => { setSelectedInvoice(inv); setConvertNcfType('B02'); setConvertQuoteModal(true); }}
                          >
                            <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
                            <span>Facturar</span>
                          </button>
                        ) : (
                          <div className="col-span-2" />
                        )
                      ) : (
                        !isPaid && !isCanceled && canEdit ? (
                          <button
                            type="button"
                            className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 duration-100 py-2 h-9 rounded-lg flex items-center justify-center gap-1 cursor-pointer border-0 font-bold text-[10px]"
                            onClick={() => { setSelectedInvoice(inv); setPayAmount(String(inv.total)); setPayNotes(''); setPayInvoiceModal(true); }}
                          >
                            <ReceiptIcon className="w-3.5 h-3.5" />
                            <span>Cobrar</span>
                          </button>
                        ) : (
                          <div className="col-span-2 bg-neutral-50 border border-neutral-150 text-neutral-400 rounded-lg flex items-center justify-center text-[9px] font-semibold italic">
                            Liquidada
                          </div>
                        )
                      )}

                      {/* ADDITIONAL CONTROL DOTS PANEL FOR EDIT/DELETE */}
                      <div className="col-span-4 grid grid-cols-2 gap-2 mt-1">
                        {canEdit && (
                          <button
                            type="button"
                            className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 active:scale-95 duration-100 py-1.5 h-8 rounded-lg flex items-center justify-center space-x-1 cursor-pointer font-bold text-[10px]"
                            onClick={() => {
                              if (onEditDocument) {
                                onEditDocument(inv);
                              } else {
                                openEditVisual(inv);
                              }
                            }}
                          >
                            <Edit2 className="w-3 w-3 text-neutral-500" />
                            <span>Editar</span>
                          </button>
                        )}
                        {canDelete && !isCanceled && (
                          <button
                            type="button"
                            className="bg-red-50 hover:bg-red-105 border border-red-150 text-red-700 active:scale-95 duration-100 py-1.5 h-8 rounded-lg flex items-center justify-center space-x-1 cursor-pointer font-bold text-[10px]"
                            onClick={() => {
                              if (isQuote) {
                                deleteInvoice(inv.id);
                              } else {
                                if (confirm('¿Está seguro de anular esta factura fiscal? Esto restaurará el stock de inventario y registrará la anulación para el reporte DGII 608.')) {
                                  updateInvoice(inv.id, { status: 'Anulada' });
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-3 w-3 text-red-500" />
                            <span>Anular</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* DIALOG - QUOTE CONVERSION DIALOG */}
      <Dialog open={convertQuoteModal} onOpenChange={setConvertQuoteModal}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-base text-neutral-900 font-heading">Convertir Cotización a Factura</DialogTitle>
            <DialogDescription className="text-xs">
              Usted está a punto de procesar la cotización oficial <span className="font-semibold text-black">{selectedInvoice?.invoiceNumber}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-1">
              <Label htmlFor="conv-ncf" className="text-xs">Tipo de Comprobante Fiscal a Asignar</Label>
              <Select value={convertNcfType} onValueChange={(val: NcfType) => setConvertNcfType(val)}>
                <SelectTrigger id="conv-ncf">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B02">B02 - Comprobante de Consumo</SelectItem>
                  <SelectItem value="B01">B01 - Crédito Fiscal (Empresas)</SelectItem>
                  <SelectItem value="B14">B14 - Regímenes Especiales</SelectItem>
                  <SelectItem value="B15">B15 - Gubernamental</SelectItem>
                  <SelectItem value="SIN">Sin Comprobante Fiscal (Consumo Interno)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-[11px] text-amber-700 bg-amber-50 p-2 text-xs rounded border border-amber-200">
              Al convertir, el inventario del negocio disminuirá automáticamente según las cantidades acordadas.
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => { setConvertQuoteModal(false); setSelectedInvoice(null); }}>Cancelar</Button>
            <Button type="button" size="sm" className="bg-black hover:bg-neutral-800 text-white" onClick={handleTriggerConvert}>Facturar e Incrementar NCF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG - RECORD INVOICE PAYMENT (VOUCHER) */}
      <Dialog open={payInvoiceModal} onOpenChange={setPayInvoiceModal}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-base text-neutral-900 font-heading">Registrar Recibo de Pago</DialogTitle>
            <DialogDescription className="text-xs">
              Fije el ingreso de efectivo para la factura <span className="font-semibold text-neutral-900">{selectedInvoice?.invoiceNumber}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-1">
              <Label htmlFor="pay-amt" className="text-xs">Monto Recibido DOP *</Label>
              <Input id="pay-amt" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
              <p className="text-[10px] text-neutral-450">Saldo total a liquidar: <span className="font-semibold text-neutral-800">{selectedInvoice?.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</span></p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pay-met" className="text-xs">Método de Cobro</Label>
              <Select value={payMethod} onValueChange={(val: PaymentMethod) => setPayMethod(val)}>
                <SelectTrigger id="pay-met">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="Tarjeta">Tarjeta de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pay-not" className="text-xs">Notas del Pago</Label>
              <Input id="pay-not" placeholder="Ej. Depósito Banco Popular Ref#3485" value={payNotes} onChange={(e) => setPayNotes(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => { setPayInvoiceModal(false); setSelectedInvoice(null); }}>Cancelar</Button>
            <Button type="button" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleTriggerPayment}>Sellar Recibo de Pago</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG - SMTP AUTOMATIC EMAIL DELIVERY SIMULATOR */}
      <Dialog open={emailModal} onOpenChange={setEmailModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader className="border-b border-neutral-100 pb-3">
            <DialogTitle className="text-sm font-semibold text-neutral-950 flex items-center">
              <Mail className="w-4.5 h-4.5 mr-2 text-neutral-800 animate-bounce" />
              Envío de Comprobante por Correo Electrónico
            </DialogTitle>
            <DialogDescription className="text-xs">Servicio de despacho automático de comprobantes de facturación digital.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2 text-xs">
            <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-150">
              <div>
                <span className="text-[10px] text-neutral-450 uppercase block font-semibold">De (Emisor):</span>
                <span className="font-medium text-neutral-800">{templateSettings.businessEmail}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-450 uppercase block font-semibold">Documento Comercial:</span>
                <span className="font-semibold text-neutral-900">{selectedInvoice?.invoiceNumber}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email-rec" className="text-xs font-semibold">Correo Electrónico Destinatario *</Label>
              <Input
                id="email-rec"
                placeholder="cliente@correo.com"
                value={emailCustomRec}
                onChange={(e) => setEmailCustomRec(e.target.value)}
                required
                disabled={emailSending}
              />
            </div>

            {/* Simulated Live Console Logs */}
            {emailSentLogs.length > 0 && (
              <div id="smtp-live-logs" className="bg-neutral-950 text-[10px] text-neutral-300 font-mono p-3 rounded-lg max-h-[140px] overflow-y-auto space-y-1 scrollbar-thin">
                {emailSentLogs.map((logStr, i) => (
                  <div key={i} className={i === emailSentLogs.length - 1 ? "text-emerald-400" : ""}>{logStr}</div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-neutral-100 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setEmailModal(false)} disabled={emailSending}>Cerrar</Button>
            <Button
              type="button"
              size="sm"
              className="bg-black hover:bg-neutral-800 text-white"
              onClick={executeEmailDeliveryRoute}
              disabled={emailSending}
            >
              {emailSending ? 'Procesando SMTP...' : 'Ejecutar Canal de Envío'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG - THE COMPREHENSIVE VISUAL OVERLAY / IN-SITU LIVE FACTURA EDITOR */}
      <Dialog open={editInvoiceModal} onOpenChange={setEditInvoiceModal}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-neutral-900 text-white">
          <div className="p-4 bg-black border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-neutral-300" />
              <div>
                <DialogTitle className="text-sm font-semibold font-heading text-white">Editor de Factura Digital</DialogTitle>
                <div className="text-[10px] text-neutral-400">Edición en sitio de comprobantes emitida por DGII.</div>
              </div>
            </div>
            
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-neutral-800 text-white border border-neutral-700">
              OVERLAY MODE
            </span>
          </div>

          {/* SKELETON OF THE LIVE FACTURA PAGE */}
          <div className="p-6 bg-white text-neutral-900 text-xs space-y-4 max-h-[420px] overflow-y-auto">
            {/* Header branding */}
            <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">{templateSettings.businessName}</h4>
                <p className="text-[10px] text-neutral-500">RNC: {templateSettings.businessRNC}</p>
                <p className="text-[10px] text-neutral-500">{templateSettings.businessAddress}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block">{selectedInvoice?.type === 'Cotizacion' ? 'COTIZACIÓN' : 'FACTURA COMERCIAL'}</span>
                <span className="font-mono text-[11px] text-neutral-700">{selectedInvoice?.invoiceNumber}</span>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="v-ncf-t" className="text-[10px] font-bold text-neutral-500">TIPO COMPROBANTE NCF</Label>
                  <Select value={editNcfType} onValueChange={(val: NcfType) => setEditNcfType(val)} disabled={selectedInvoice?.type === 'Cotizacion'}>
                    <SelectTrigger id="v-ncf-t" className="h-8 bg-white border-neutral-200 text-neutral-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B02">B02 - Consumo</SelectItem>
                      <SelectItem value="B01">B01 - Crédito Fiscal</SelectItem>
                      <SelectItem value="B14">B14 - Regímenes Especiales</SelectItem>
                      <SelectItem value="B15">B15 - Gubernamental</SelectItem>
                      <SelectItem value="SIN">Sin Comprobante Fiscal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="v-seq-n" className="text-[10px] font-bold text-neutral-500">NÚMERO SECUENCIAL CORRIENTE</Label>
                  <Input
                    id="v-seq-n"
                    type="number"
                    value={editSequenceNum}
                    onChange={(e) => setEditSequenceNum(e.target.value)}
                    className="h-8 bg-white text-neutral-900 font-mono"
                    disabled={selectedInvoice?.type === 'Cotizacion' || editNcfType === 'SIN'}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="v-pay-m" className="text-[10px] font-bold text-neutral-500">MÉTODO DE PAGO</Label>
                  <Select value={editPaymentMethod} onValueChange={(val: PaymentMethod) => setEditPaymentMethod(val)}>
                    <SelectTrigger id="v-pay-m" className="h-8 bg-white border-neutral-200 text-neutral-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="Crédito">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="v-due-d" className="text-[10px] font-bold text-neutral-500">FECHA VENCIMIENTO</Label>
                  <Input
                    id="v-due-d"
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="h-8 bg-white text-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Editable Notes */}
            <div className="space-y-1">
              <Label htmlFor="v-notes" className="text-[10px] font-bold text-neutral-500">TÉRMINOS / CONDICIONES INTERNAS DE LA OPERACIÓN</Label>
              <textarea
                id="v-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full h-16 p-2 rounded-lg border border-neutral-200 outline-none text-neutral-900 focus:ring-1 focus:ring-black"
                placeholder="Comentarios o términos adicionales..."
              />
            </div>

            {/* Editable Items summary (live quantity / price visual editor) */}
            <div className="space-y-3.5" id="visual-modal-editable-items">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block font-mono leading-none">Artículos & Precios de Factura</label>
              
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {editItems.map((it, idx) => (
                  <div key={idx} className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-150 flex items-start justify-between gap-3 text-[11px]">
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-neutral-900 block truncate">{it.name}</span>
                      <span className="text-[9px] text-neutral-450 font-mono">ITBIS: {it.taxRate}%</span>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {/* Price change input */}
                      <div className="w-[85px] space-y-0.5">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Precio Unit.</span>
                        <input
                          type="number"
                          value={it.price}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setEditItems(prev => prev.map((item, i) => {
                              if (i !== idx) return item;
                              const taxAmount = val * item.quantity * (item.taxRate / 100);
                              const total = (val * item.quantity) + taxAmount;
                              return { ...item, price: val, taxAmount, total };
                            }));
                          }}
                          className="h-7 w-full border border-neutral-250 rounded px-1.5 focus:outline-none focus:ring-1 focus:ring-black text-[10px] font-mono font-bold bg-white"
                        />
                      </div>

                      {/* Quantity change input */}
                      <div className="w-[50px] space-y-0.5">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Cant.</span>
                        <input
                          type="number"
                          value={it.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditItems(prev => prev.map((item, i) => {
                              if (i !== idx) return item;
                              const taxAmount = item.price * val * (item.taxRate / 100);
                              const total = (item.price * val) + taxAmount;
                              return { ...item, quantity: val, taxAmount, total };
                            }));
                          }}
                          className="h-7 w-full border border-neutral-255 rounded px-1.5 focus:outline-none focus:ring-1 focus:ring-black text-[10px] font-mono font-bold bg-white"
                        />
                      </div>

                      {/* Line total metric */}
                      <div className="w-[85px] text-right">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Importe Neto</span>
                        <span className="font-mono font-bold text-neutral-900 block mt-1">
                          {(it.price * it.quantity).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end space-x-2">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-neutral-700 hover:bg-neutral-850 text-neutral-300 hover:text-white" onClick={() => setEditInvoiceModal(false)}>Cancelar</Button>
            <Button type="button" size="sm" className="h-8 text-xs bg-white text-neutral-900 hover:bg-neutral-100 font-semibold" onClick={handleSaveVisualEdits}>Sincronizar y Sellar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG - THE BEAUTIFUL CLICK-TO-VIEW INVOICE/QUOTE DETAIL OVERLAY */}
      <Dialog open={viewInvoiceModal} onOpenChange={setViewInvoiceModal}>
        <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden bg-neutral-900 border border-neutral-700 rounded-xl">
          <div className="p-4 bg-black border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-neutral-300" />
              <div>
                <DialogTitle className="text-sm font-semibold text-white">Vista Previa de Comprobante</DialogTitle>
                <div className="text-[10px] text-neutral-400">Detalles oficiales y bases imponibles del documento.</div>
              </div>
            </div>
            
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
              selectedInvoice?.status === 'Pagada' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
              selectedInvoice?.status === 'Anulada' ? 'bg-neutral-850 text-neutral-400 border-neutral-700' :
              'bg-amber-950 text-amber-400 border-amber-800'
            }`}>
              {selectedInvoice?.status}
            </span>
          </div>

          <div className="p-6 bg-neutral-50/50 text-neutral-900 text-xs space-y-4 max-h-[500px] overflow-y-auto">
            {/* INVOICE SHEET BACKGROUND MOCK */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-5">
              {/* BRANDING SECTION */}
              <div className="flex justify-between items-start border-b border-neutral-150 pb-4">
                <div className="space-y-1.5 flex items-start gap-3">
                  {templateSettings.logoUrl ? (
                    <img
                      src={templateSettings.logoUrl}
                      alt="Logo"
                      className="h-10 w-auto object-contain rounded border border-neutral-100 bg-white"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center p-2 shadow-xs shrink-0">
                      <svg className="w-full h-full text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-950">{templateSettings.businessName}</h4>
                    <p className="text-[10px] text-neutral-550">RNC: {templateSettings.businessRNC}</p>
                    <p className="text-[10px] text-neutral-550">{templateSettings.businessAddress}</p>
                    <p className="text-[10px] text-neutral-550">Tel: {templateSettings.businessPhone} | {templateSettings.businessEmail}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-neutral-800 text-white text-[9px] font-extrabold tracking-wider uppercase">
                    {selectedInvoice?.type === 'Cotizacion' ? 'Cotización' : 'Factura de Venta'}
                  </span>
                  <p className="text-xs font-bold text-neutral-900 block">{selectedInvoice?.invoiceNumber}</p>
                  <p className="text-[10px] text-neutral-500">Fecha: {selectedInvoice && new Date(selectedInvoice.createdAt).toLocaleDateString('es-DO')}</p>
                </div>
              </div>

              {/* CLIENT & TERMS INFO BLOCK */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-neutral-50 p-2.5 rounded-lg border border-neutral-150">
                  <span className="text-[9px] text-neutral-450 uppercase font-semibold">Cliente Receptor</span>
                  <div className="font-bold text-neutral-900 leading-tight">{selectedInvoice?.client.name}</div>
                  <div className="text-[10px] text-neutral-550">
                    {selectedInvoice?.client.type === 'Empresa' ? 'RNC Fiscal' : 'Cédula de Identidad'}: {selectedInvoice?.client.rncOrCedula}
                  </div>
                  <div className="text-[10px] text-neutral-550">Despacho: {selectedInvoice?.client.address || 'Habilitado'}</div>
                </div>

                <div className="space-y-1 bg-neutral-50 p-2.5 rounded-lg border border-neutral-150">
                  <span className="text-[9px] text-neutral-450 uppercase font-semibold">Términos de la Operación</span>
                  <div><span className="font-semibold text-neutral-750">Comprobante NCF: </span> <span className="font-bold text-blue-800">{selectedInvoice?.type === 'Cotizacion' ? 'N/A' : selectedInvoice?.ncf}</span></div>
                  <div><span className="font-semibold text-neutral-750">Vía de Liquidación: </span> <span className="text-neutral-900">{selectedInvoice?.paymentMethod}</span></div>
                  <div><span className="font-semibold text-neutral-750">Límite Vencimiento: </span> <span className="text-neutral-550">{selectedInvoice && new Date(selectedInvoice.dueDate).toLocaleDateString('es-DO')}</span></div>
                </div>
              </div>

              {/* QUOTE AND INVOICE LINKING BAR */}
              {selectedInvoice && (selectedInvoice.originalQuoteNo || selectedInvoice.convertedToInvoiceNo) && (
                <div className="bg-blue-50 border border-blue-150 p-3 rounded-lg flex items-center justify-between text-xs" id="invoice-quote-relationship-ribbon">
                  <div className="flex items-center space-x-1.5 text-blue-900 leading-tight">
                    <span className="font-bold text-blue-705">Relación Comercial:</span>
                    {selectedInvoice.type === 'Factura' && selectedInvoice.originalQuoteNo && (
                      <span>Factura generada a partir del presupuesto <span className="font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200">{selectedInvoice.originalQuoteNo}</span></span>
                    )}
                    {selectedInvoice.type === 'Cotizacion' && selectedInvoice.convertedToInvoiceNo && (
                      <span>Presupuesto convertido y facturado con comprobante NCF <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{selectedInvoice.convertedToInvoiceNo}</span></span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const targetNo = selectedInvoice.type === 'Factura' ? selectedInvoice.originalQuoteNo : selectedInvoice.convertedToInvoiceNo;
                      const related = invoices.find(inv => inv.invoiceNumber === targetNo);
                      if (related) {
                        setSelectedInvoice(related);
                      } else {
                        alert(`El documento ${targetNo} no pudo ser cargado o fue retirado.`);
                      }
                    }}
                    className="text-[10px] font-extrabold text-blue-700 bg-white hover:bg-blue-105 hover:text-blue-900 border border-blue-250 px-2 py-1 rounded-md transition-all shrink-0 ml-2 shadow-xs"
                  >
                    Ver Documento
                  </button>
                </div>
              )}

              {selectedInvoice && selectedInvoice.type === 'Cotizacion' && !selectedInvoice.convertedToInvoiceNo && (
                <div className="bg-amber-55/65 border border-amber-250 p-3 rounded-lg flex items-center justify-between text-xs" id="quick-quote-convert-ribbon-embedded">
                  <div className="flex items-center space-x-1.5 text-amber-950 leading-tight">
                    <span className="font-bold text-amber-850">Presupuesto Pendiente:</span>
                    <span>Esta cotización no ha sido convertida en factura aún.</span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setViewInvoiceModal(false);
                      setConvertNcfType('B02');
                      setConvertQuoteModal(true);
                    }}
                    className="text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 h-8 rounded-md shrink-0 ml-2 shadow"
                  >
                    Convertir en Factura
                  </Button>
                </div>
              )}

              {/* CONCEPTS DETAILED TABLE */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[10px] divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr className="divide-x divide-neutral-150">
                      <th className="px-3 py-1.5 font-bold text-neutral-700 text-center w-12">Cant.</th>
                      <th className="px-3 py-1.5 font-bold text-neutral-700">Concepto o Producto</th>
                      <th className="px-3 py-1.5 font-bold text-neutral-700 text-right w-24">P. Unitario</th>
                      <th className="px-3 py-1.5 font-bold text-neutral-700 text-center w-14">ITBIS %</th>
                      <th className="px-3 py-1.5 font-bold text-neutral-700 text-right w-24">Suma Neto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {selectedInvoice?.items.map((it, idx) => (
                      <tr key={idx} className="divide-x divide-neutral-150 hover:bg-neutral-50/20">
                        <td className="px-3 py-1.5 text-center text-neutral-900 font-semibold">{it.quantity}</td>
                        <td className="px-3 py-1.5 text-neutral-900 font-medium">{it.name}</td>
                        <td className="px-3 py-1.5 text-right text-neutral-700">{it.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</td>
                        <td className="px-3 py-1.5 text-center text-neutral-500">{it.taxRate}%</td>
                        <td className="px-3 py-1.5 text-right font-semibold text-neutral-955">{it.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTALS WRAPPER */}
              <div className="flex justify-end pt-2">
                <div className="w-48 space-y-1.5 text-[11px] text-right">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      {selectedInvoice && (selectedInvoice.total - selectedInvoice.items.reduce((acc, it) => acc + it.taxAmount, 0)).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Suma Impuestos (ITBIS):</span>
                    <span className="font-medium">
                      {selectedInvoice && selectedInvoice.items.reduce((acc, it) => acc + it.taxAmount, 0).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-neutral-900 border-t border-neutral-150 pt-1.5">
                    <span>Importe Liquidado:</span>
                    <span className="text-sm">
                      {selectedInvoice?.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* CONDITIONS FOOTNOTE ACCENT */}
              {selectedInvoice?.notes && (
                <div className="pt-2 border-t border-neutral-150 text-[10px] text-neutral-500">
                  <span className="font-semibold block text-neutral-700">Notas / Términos de la Operación:</span>
                  <p className="mt-0.5 leading-relaxed italic">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs border-neutral-700 hover:bg-neutral-850 text-neutral-300 hover:text-white"
              onClick={() => { setViewInvoiceModal(false); setSelectedInvoice(null); }}
            >
              Cerrar Vista
            </Button>

            {/* QUICK RETRIGGERS */}
            {selectedInvoice?.type === 'Cotizacion' && isRoleAuthorizedAndOpen(currentUser) && (
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => { setViewInvoiceModal(false); setConvertNcfType('B02'); setConvertQuoteModal(true); }}
              >
                Convertir a Factura
              </Button>
            )}

            {selectedInvoice?.type === 'Factura' && selectedInvoice.status === 'Pendiente' && canEdit && (
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => { setViewInvoiceModal(false); setPayAmount(String(selectedInvoice.total)); setPayNotes(''); setPayInvoiceModal(true); }}
              >
                Efectuar Cobro
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              className="h-8 text-xs bg-white text-neutral-900 hover:bg-neutral-100 font-semibold"
              onClick={() => generateInvoicePDF(selectedInvoice!, templateSettings)}
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Descargar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const isRoleAuthorizedAndOpen = (currentUser: any) => {
  return currentUser.permissions.canCreateInvoice;
};
