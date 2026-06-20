import React, { useState } from 'react';
import { SupportTicket } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { HeartHandshake, Compass, Megaphone, Plus, Sparkles, AlertCircle, CheckCircle2, RefreshCw, BookOpen, Clock } from 'lucide-react';
import HelpManualView from './HelpManualView';

interface SupportSectionProps {
  tickets: SupportTicket[];
  addTicket: (desc: { subject: string; category: SupportTicket['category']; description: string }) => void;
}

export default function SupportSection({ tickets, addTicket }: SupportSectionProps) {
  const [activeTab, setActiveTab] = useState<'guia' | 'tickets'>('guia');
  
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Facturas');
  const [description, setDescription] = useState('');

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    addTicket({
      subject,
      category,
      description,
    });

    setSubject('');
    setDescription('');
    setFeedback('¡Su tique de soporte ha sido registrado! Un asesor de contabilidad se pondrá en contacto pronto.');
    setTimeout(() => setFeedback(null), 5000);
  };

  const faqList = [
    {
      q: '¿Cómo reporto las facturas anuladas?',
      a: 'Toda secuencia NCF omitida o interrumpida por errores de impresión o cambios estructurales debe reportarse detalladamente en el formato mensual 608 de la DGII, indicando el código de motivo.'
    }
  ];

  return (
    <div className="space-y-6" id="support-workbench">
      
      {/* Upper Navigation Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('guia')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'guia'
              ? 'border-neutral-900 text-neutral-900 font-extrabold'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Guía Técnica & Manual del Usuario
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'tickets'
              ? 'border-neutral-900 text-neutral-900 font-extrabold'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Tiques & Consultas Directas
        </button>
      </div>

      {activeTab === 'guia' ? (
        <div className="bg-neutral-50 p-4 sm:p-6 rounded-2xl border border-neutral-150 animate-fade-in text-left">
          <HelpManualView isInsideApp={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* FAQ SECTION */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
              <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center">
                    <Compass className="w-4 h-4 mr-1.5 text-neutral-800" />
                    Asistencias Frecuentes
                  </CardTitle>
                  <CardDescription className="text-xs">Respuestas inmediatas para la tributación de su negocio con NCF.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 divide-y divide-neutral-150 space-y-4">
                {faqList.map((faq, i) => (
                  <div key={i} className="pt-4 first:pt-0 space-y-1">
                    <h4 className="text-xs font-bold text-neutral-900 flex items-start">
                      <span className="bg-neutral-100 text-neutral-850 px-1.5 rounded mr-1.5 font-mono text-[10px]">P</span>
                      {faq.q}
                    </h4>
                    <p className="text-xs text-neutral-550 leading-relaxed pl-5">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* LOGGED CONSOLE TICKETS */}
            <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
              <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4">
                <CardTitle className="text-sm font-semibold text-neutral-900">Historial de Tiques de Soporte levantados</CardTitle>
                <CardDescription className="text-xs">Consulte el estado operativo de sus solicitudes de asesoramiento.</CardDescription>
              </CardHeader>
              <Table>
                <TableHeader className="bg-neutral-50/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Tique ID</TableHead>
                    <TableHead className="text-xs font-semibold">Asunto</TableHead>
                    <TableHead className="text-xs font-semibold">Categoría</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Estado</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-neutral-450 text-xs font-sans">
                        No ha levantado tiques de soporte en este terminal.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tickets.map((t) => (
                      <TableRow key={t.id} className="hover:bg-neutral-50/30 text-xs">
                        <TableCell className="font-semibold font-mono text-neutral-500">#{t.id}</TableCell>
                        <TableCell className="font-semibold text-neutral-900">
                          <div>{t.subject}</div>
                          <div className="text-[10px] text-neutral-400 font-medium truncate max-w-[250px]">{t.description}</div>
                        </TableCell>
                        <TableCell className="font-medium text-neutral-600">{t.category}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Resulto' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {t.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-neutral-450 text-[11px] whitespace-nowrap">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* TICKET ENTRY FORM */}
          <div className="lg:col-span-1 space-y-6 text-left">
            <Card className="border-neutral-200 shadow-none rounded-xl">
              <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4">
                <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center">
                  <Megaphone className="w-4 h-4 mr-1.5 text-neutral-800" />
                  Levantar Tique de Soporte
                </CardTitle>
                <CardDescription className="text-xs">Registre una consulta técnica si experimenta alguna incidencia.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {feedback && <div className="mb-4 p-2.5 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-250 font-medium">{feedback}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <Label htmlFor="tkt-sub" className="text-xs font-semibold">Asunto Principal *</Label>
                    <Input id="tkt-sub" placeholder="Ej. Duda con retención de ITBIS ley 39..." value={subject} onChange={(e) => setSubject(e.target.value)} required />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="tkt-cat" className="text-xs font-semibold">Categoría Directa</Label>
                    <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                      <SelectTrigger id="tkt-cat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        <SelectItem value="Facturas">Emisión de Facturas / NCF</SelectItem>
                        <SelectItem value="DGII">Tributación / Format 606/607</SelectItem>
                        <SelectItem value="Inventario">Problemas de Almacén e Inventario</SelectItem>
                        <SelectItem value="Sistema">Error general del Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="tkt-des" className="text-xs font-semibold">Descripción del Problema *</Label>
                    <textarea
                      id="tkt-des"
                      placeholder="Detalle los pasos o códigos involucrados para acelerar el diagnóstico..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-xs rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:ring-1 focus:ring-black h-24"
                      required
                    />
                  </div>

                  <Button type="submit" size="sm" className="w-full bg-black hover:bg-neutral-850 text-white font-semibold">
                    Sellar y Enviar Tique
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
