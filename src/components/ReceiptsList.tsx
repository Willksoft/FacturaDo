import React, { useState } from 'react';
import { Receipt, TemplateSettings } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Download, Receipt as ReceiptIcon, Calendar, CheckSquare, Sparkles, Plus, Info } from 'lucide-react';
import { generateReceiptPDF } from '../lib/pdfGenerator';

interface ReceiptsListProps {
  receipts: Receipt[];
  templateSettings: TemplateSettings;
  currentUser: any;
  onNavigateToPendingInvoices?: () => void;
}

export default function ReceiptsList({
  receipts,
  templateSettings,
  currentUser,
  onNavigateToPendingInvoices,
}: ReceiptsListProps) {
  const [search, setSearch] = useState('');

  const filtered = receipts.filter(rec => {
    const q = search.toLowerCase();
    return (
      rec.receiptNumber.toLowerCase().includes(q) ||
      rec.clientName.toLowerCase().includes(q) ||
      rec.invoiceNumber.toLowerCase().includes(q) ||
      rec.paymentMethod.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6" id="receipts-list-wrapper">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Control de Recibos de Cobros</h2>
          <p className="text-xs text-neutral-500">Historial oficial de cobros efectuados y abonos registrados a sus comprobantes fiscales.</p>
        </div>
        {onNavigateToPendingInvoices && (
          <Button
            size="sm"
            onClick={onNavigateToPendingInvoices}
            className="text-xs bg-black text-white hover:bg-neutral-800 font-semibold h-8.5 rounded-lg flex items-center transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Registrar Nuevo Cobro
          </Button>
        )}
      </div>

      {onNavigateToPendingInvoices && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start md:items-center space-x-2.5 text-xs text-neutral-600">
            <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5 md:mt-0" />
            <span>Los recibos de ingreso se generan de manera secuencial y segura cada vez que aplica un <strong>Abono o Liquidación</strong> sobre una <strong>Factura Pendiente</strong> en el Renglón de Facturas.</span>
          </div>
          <button
            onClick={onNavigateToPendingInvoices}
            className="text-[11px] font-bold text-neutral-900 hover:underline shrink-0 pl-7 md:pl-0"
          >
            Ir a Facturas Pendientes &rarr;
          </button>
        </div>
      )}

      <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
        <CardHeader className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-50/50">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-450" />
            <Input
              placeholder="Buscar por recibo, cliente, factura..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs w-full bg-white border-neutral-200"
            />
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">
            Mostrando <span className="font-bold text-neutral-850">{filtered.length}</span> cobros registrados
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <ReceiptIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-neutral-900">No se encontraron recibos</h3>
                <p className="text-xs text-neutral-500">Intente modificar sus palabras clave o registre un abono en Renglón Facturas.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50">
                  <TableRow className="hover:bg-transparent border-b border-neutral-150">
                    <TableHead className="text-xs font-bold text-neutral-700 w-28">No. Recibo</TableHead>
                    <TableHead className="text-xs font-bold text-neutral-700">Cliente</TableHead>
                    <TableHead className="text-xs font-bold text-neutral-700 w-36">Factura Ref.</TableHead>
                    <TableHead className="text-xs font-bold text-neutral-700 w-36">Fecha Registro</TableHead>
                    <TableHead className="text-xs font-bold text-neutral-700 w-32">Método Pago</TableHead>
                    <TableHead className="text-xs font-bold text-neutral-700 text-right w-32">Monto Cobrado</TableHead>
                    <TableHead className="text-xs font-bold text-neutral-700 text-right w-24">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-neutral-150">
                  {filtered.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-neutral-50/20">
                      <TableCell className="text-xs font-extrabold text-neutral-950">
                        {rec.receiptNumber}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-semibold text-neutral-900">{rec.clientName}</div>
                        {rec.notes && <div className="text-[10px] text-neutral-450 truncate max-w-[250px]">{rec.notes}</div>}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-neutral-700">
                        {rec.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-500 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{new Date(rec.date).toLocaleDateString('es-DO')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-neutral-600">
                        {rec.paymentMethod}
                      </TableCell>
                      <TableCell className="text-right text-xs font-extrabold text-emerald-700 whitespace-nowrap">
                        {rec.amountPaid.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-lg hover:bg-neutral-100/80 text-neutral-600 hover:text-neutral-900 transition-colors"
                          onClick={() => generateReceiptPDF(rec, templateSettings)}
                          title="Descargar Volante de Cobro PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
