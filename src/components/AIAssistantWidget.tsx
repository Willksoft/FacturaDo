import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Send, MessageSquare, Terminal, ChevronRight,
  BarChart3, Users, FileText, Percent, HelpCircle, 
  CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Settings,
  RotateCcw, Info, Wallet, ShieldAlert, BadgeInfo
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAssistantWidgetProps {
  invoices?: any[];
  clients?: any[];
  products?: any[];
  expenses?: any[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistantWidget({
  invoices = [],
  clients = [],
  products = [],
  expenses = []
}: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'faqs'>('metrics');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: queryText
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate short loading to mimic thinking/processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate response using application state
    const responseContent = generateMockAIResponse(queryText);
    const assistantMessage: Message = {
      id: Math.random().toString(),
      role: 'assistant',
      content: responseContent
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    handleQuery(inputValue);
    setInputValue('');
  };

  const generateMockAIResponse = (input: string): string => {
    const query = input.toLowerCase().trim();

    // Hola / Saludos
    if (query.includes('hola') || query.includes('buenos') || query.includes('saludo') || query.includes('buenas')) {
      return `### Asistente de Operaciones FacturaDo

Procesamiento automático de consultas e informes del sistema. Puedes hacerme preguntas sobre tu negocio o de soporte fiscal. Prueba escribiendo o seleccionando una de estas consultas:

*   **Resumen de ventas**: Informe financiero de facturación en tiempo real.
*   **Lista de clientes**: Conteo y listado de los últimos clientes registrados.
*   **Facturas generadas**: Desglose y estatus de los comprobantes emitidos.
*   **Reporte de ITBIS**: Análisis neto de débito y crédito fiscal.
*   **Preguntas frecuentes**: Guías operativas sobre NCF, e-CF y reportes 606.`;
    }

    // FAQ 1: ¿Cómo emito un NCF de Consumo?
    if (query.includes('consumo') || query.includes('ncf de consumo') || query.includes('b02')) {
      return `### Facturación NCF de Consumo (B02)

Para emitir una factura de Consumo (B02) a un consumidor final en FacturaDo:

*   Dirígete a la pestaña de **Punto de Venta (POS)** o a la sección de **Crear Factura**.
*   Selecciona **Consumidor Final** en el campo del cliente.
*   El sistema cargará automáticamente la siguiente secuencia válida disponible en tu rango de NCF de Consumo (B02).
*   Agrega los ítems correspondientes a la venta.
*   Selecciona el método de pago (Efectivo, Tarjeta, Transferencia) y genera el documento.
*   Podrás imprimir la factura en formato ticket (80mm) o guardarla como PDF tamaño carta.`;
    }

    // FAQ 2: ¿Qué hago si se agotan mis secuencias de NCF?
    if (query.includes('agotan') || query.includes('secuencia') || query.includes('rango') || query.includes('actualizar ncf')) {
      return `### Renovación de Rangos NCF (DGII)

Si tus secuencias autorizadas de comprobantes fiscales están próximas a vencer o agotarse:

*   Solicita una nueva autorización de rangos NCF a través de la Oficina Virtual de la DGII.
*   Una vez aprobados por la DGII, entra al menú de **Configuración del Sistema** en FacturaDo.
*   Selecciona la pestaña **Secuencias NCF**.
*   Ubica el tipo de comprobante que deseas renovar (ej. Crédito Fiscal o Consumo) y actualiza el **Número Final** con el nuevo límite autorizado.
*   El sistema reiniciará la numeración basándose en el contador de forma automatizada y transparente.`;
    }

    // FAQ 3: ¿Cómo declaro el ITBIS en el formato 606?
    if (query.includes('606') || query.includes('formato 606') || query.includes('declarar itbis')) {
      return `### Declaración de ITBIS (Formato de Envío 606)

FacturaDo genera automáticamente la matriz de datos para reportar tus compras y gastos:

*   Registra todos tus costos y gastos operativos en la sección de **Gastos**.
*   Asegúrate de ingresar correctamente el RNC del proveedor, la tasa de ITBIS y el NCF de Crédito Fiscal (B01) para deducir el impuesto.
*   Ve a **Reportes** y haz clic en la pestaña **Reporte 606**.
*   Filtra por el periodo fiscal correspondiente (Mes/Año).
*   Presiona el botón de **Exportar Excel (Formato DGII)**. El sistema descargará un archivo estructurado listo para validar en la herramienta de envío de la DGII.`;
    }

    // FAQ 4: ¿Cómo anulo una factura con nota de crédito?
    if (query.includes('anular') || query.includes('nota de credito') || query.includes('cancelar factura') || query.includes('b04')) {
      return `### Emisión de Notas de Crédito (B04)

Para anular o modificar los valores de una factura fiscal emitida previamente:

*   Entra a la sección de **Notas de Crédito** en el menú de facturación.
*   Selecciona la factura fiscal original que deseas corregir o anular.
*   Elige el motivo de la transacción (ej. Error en RNC, Descuento, Devolución o Anulación total).
*   El sistema generará automáticamente un comprobante de Nota de Crédito (B04) vinculado a la factura original.
*   Esto restará el saldo pendiente de tus cuentas por cobrar y devolverá la mercancía al inventario (si aplica).`;
    }

    // FAQ 5: ¿Cómo controlo la Caja (Turnos)?
    if (query.includes('caja') || query.includes('turno') || query.includes('apertura') || query.includes('cierre')) {
      return `### Control de Turnos y Cuadre de Caja

Monitorea la entrada y salida de efectivo de tu Punto de Venta (POS):

*   Antes de vender, ve a **Turnos** en el menú financiero y presiona **Abrir Caja**.
*   Registra el monto inicial (efectivo base de fondo para caja).
*   Todas las operaciones de cobro realizadas en el POS se guardarán en el turno activo.
*   Al concluir el turno o el día, regresa a la sección **Turnos** y presiona **Cerrar Caja**.
*   Ingresa el dinero físico contado en caja. El sistema calculará automáticamente el desglose y reportará cualquier sobrante o faltante.`;
    }

    // FAQ 6: ¿Cómo funciona la Facturación Electrónica?
    if (query.includes('electrónica') || query.includes('e-cf') || query.includes('ecf') || query.includes('mseller')) {
      return `### Integración de Facturación Electrónica (e-CF)

FacturaDo está equipado con integración nativa hacia la DGII mediante la API de MSeller:

*   Al activar esta configuración, tus facturas tradicionales de Crédito Fiscal (B01) y Consumo (B02) se convertirán en e-CF (E31 y E32 respectivamente).
*   Cada comprobante se firmará digitalmente con tu certificado y se validará ante los servidores de la DGII en tiempo real al momento de guardarse.
*   Tus clientes recibirán el XML y la representación impresa con código QR vía email.`;
    }

    // Resumen de ventas
    if (query.includes('venta') || query.includes('ganancia') || query.includes('ingreso') || query.includes('resumen') || query.includes('dinero')) {
      const realInvoices = invoices.filter((i: any) => i.type !== 'Cotizacion');
      const totalSales = realInvoices.reduce((acc: number, cur: any) => acc + (cur.total || 0), 0);
      const paidInvoices = realInvoices.filter((i: any) => i.status === 'Pagada' || i.status === 'Cobrada');
      const pendingInvoices = realInvoices.filter((i: any) => i.status === 'Pendiente' || i.status === 'Por Cobrar');
      const totalPaid = paidInvoices.reduce((acc: number, cur: any) => acc + (cur.total || 0), 0);
      const totalPending = pendingInvoices.reduce((acc: number, cur: any) => acc + (cur.total || 0), 0);

      return `### Resumen de Ventas

Análisis de la facturación comercial obtenida de tus registros:

*   **Ventas Totales Facturadas:** RD$ **${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (de un total de **${realInvoices.length}** facturas emitidas).
*   **Monto Cobrado (Pagado):** RD$ **${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (${paidInvoices.length} facturas).
*   **Monto Pendiente (Cuentas por Cobrar):** RD$ **${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (${pendingInvoices.length} facturas).
*   **Ticket Promedio:** RD$ **${(realInvoices.length > 0 ? totalSales / realInvoices.length : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**.

*Nota: Estos valores excluyen cotizaciones en proceso.*`;
    }

    // Lista de clientes
    if (query.includes('cliente') || query.includes('clientes') || query.includes('persona')) {
      if (clients.length === 0) {
        return `### Lista de Clientes\n\nActualmente no tienes clientes registrados en la plataforma. Puedes registrar clientes en la sección **Clientes** del menú principal.`;
      }

      const top5 = clients.slice(0, 5);
      const listStr = top5.map((c: any, index: number) => {
        const rncStr = c.rncOrCedula ? ` | RNC/Céd: ${c.rncOrCedula}` : '';
        return `${index + 1}. **${c.name}**${rncStr}`;
      }).join('\n');

      return `### Lista de Clientes Registrados

Actualmente tienes un total de **${clients.length}** clientes registrados en tu cartera. 

**Tus últimos clientes agregados:**
${listStr}

${clients.length > 5 ? `*... y ${clients.length - 5} clientes más.*` : ''}

*Nota: Puedes ver detalles financieros y estados de cuentas individuales en la sección **Clientes**.*`;
    }

    // Facturas generadas
    if (query.includes('factura') || query.includes('facturas') || query.includes('comprobante')) {
      const realInvoices = invoices.filter((i: any) => i.type !== 'Cotizacion');
      if (realInvoices.length === 0) {
        return `### Facturas Generadas\n\nNo has generado facturas comerciales todavía en la plataforma. Dirígete a **Punto de Venta (POS)** o **Crear Factura** para generar tu primera factura fiscal.`;
      }

      const recentInvoices = realInvoices.slice(-3).reverse();
      const listStr = recentInvoices.map((i: any) => {
        const clientName = i.client?.name || 'Consumidor Final';
        const statusEmoji = i.status === 'Pagada' || i.status === 'Cobrada' ? 'Cobrada' : 'Pendiente';
        return `- **${i.invoiceNumber || 'Factura'}** | ${clientName} | RD$ **${(i.total || 0).toLocaleString('en-US')}** (${statusEmoji})`;
      }).join('\n');

      return `### Facturas Recientes Generadas

Has emitido un total de **${realInvoices.length}** facturas en la plataforma.

**Últimas 3 facturas emitidas:**
${listStr}

*Nota: Los comprobantes fiscales están debidamente reportados en tus reportes DGII de la sección **Reportes**.*`;
    }

    // Reporte de ITBIS
    if (query.includes('itbis') || query.includes('impuesto') || query.includes('impuestos') || query.includes('isr')) {
      const realInvoices = invoices.filter((i: any) => i.type !== 'Cotizacion');
      const itbisFacturado = realInvoices.reduce((acc: number, cur: any) => acc + (cur.taxAmount || cur.itbis || 0), 0);
      const itbisGastos = expenses.reduce((acc: number, cur: any) => acc + (cur.itbis || cur.itbisAmount || 0), 0);
      const saldoNeto = itbisFacturado - itbisGastos;

      return `### Reporte Fiscal de ITBIS (Estimación)

Calculando ITBIS acumulado en base a tus facturas y gastos declarados en FacturaDo:

*   **ITBIS Facturado (Ventas):** RD$ **${itbisFacturado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (Retenido a tus clientes).
*   **ITBIS Comprado (Gastos):** RD$ **${itbisGastos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (Pagado con comprobantes válidos para crédito fiscal).
*   **Saldo Estimado a Declarar (DGII):** RD$ **${Math.abs(saldoNeto).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (${
        saldoNeto >= 0 
          ? 'Monto por pagar al estado.' 
          : 'Saldo fiscal acumulado a tu favor.'
      })

*Nota: Asegúrate de declarar todos tus gastos con comprobantes de crédito fiscal (B01) en la pestaña **Gastos** para deducir el ITBIS correctamente antes de presentar el formato 606.*`;
    }

    // Fallback
    return `### Asistente Operativo FacturaDo

No logré identificar la consulta. Por favor escribe una palabra clave o selecciona una de las siguientes opciones rápidas:

*   **Resumen de ventas**: Ganancias y balance de facturas.
*   **Lista de clientes**: Cartera de clientes y últimos registros.
*   **Facturas generadas**: Historial y estatus de emisión.
*   **Reporte de ITBIS**: Análisis neto de débito y crédito fiscal.
*   **Preguntas frecuentes**: Guías del POS, NCF y e-CF.`;
  };

  const getHeaderIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('venta')) return <BarChart3 className="w-4 h-4 text-blue-500 shrink-0" />;
    if (lower.includes('cliente')) return <Users className="w-4 h-4 text-indigo-500 shrink-0" />;
    if (lower.includes('factura')) return <FileText className="w-4 h-4 text-emerald-500 shrink-0" />;
    if (lower.includes('itbis') || lower.includes('fiscal')) return <Percent className="w-4 h-4 text-amber-500 shrink-0" />;
    if (lower.includes('caja') || lower.includes('turno')) return <Wallet className="w-4 h-4 text-rose-500 shrink-0" />;
    if (lower.includes('ncf') || lower.includes('secuencia')) return <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />;
    return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-neutral-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const parseMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('### ')) {
        const headerText = trimmed.slice(4);
        return (
          <h4 key={idx} className="font-bold text-xs text-neutral-900 dark:text-neutral-50 mt-3 first:mt-0 mb-1.5 pb-1 flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800">
            {getHeaderIcon(headerText)}
            {parseBoldText(headerText)}
          </h4>
        );
      }
      
      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-2 list-none text-neutral-700 dark:text-neutral-300 my-1.5 leading-relaxed flex items-start gap-1.5">
            <span className="mt-1 shrink-0 text-blue-500"><ArrowRight className="w-2.5 h-2.5" /></span>
            <span>{parseBoldText(trimmed.slice(2))}</span>
          </li>
        );
      }

      // Ordered lists (numbers)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <li key={idx} className="ml-2 list-none text-neutral-700 dark:text-neutral-300 my-1.5 leading-relaxed flex items-start gap-1.5">
            <span className="shrink-0 text-neutral-400 font-mono text-[10px] mt-0.5">{numMatch[1]}.</span>
            <span>{parseBoldText(numMatch[2])}</span>
          </li>
        );
      }

      // Empty lines
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      // Default paragraph
      return (
        <p key={idx} className="text-neutral-750 dark:text-neutral-300 my-1 leading-relaxed text-xs">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  const suggestionChips = [
    { label: 'Resumen de ventas', query: 'Resumen de ventas', icon: BarChart3 },
    { label: 'Lista de clientes', query: 'Lista de clientes', icon: Users },
    { label: 'Facturas generadas', query: 'Facturas generadas', icon: FileText },
    { label: 'Reporte de ITBIS', query: 'Reporte de ITBIS', icon: Percent }
  ];

  const faqList = [
    { label: '¿Cómo emito un NCF de Consumo (B02)?', query: 'ncf de consumo b02' },
    { label: '¿Qué hacer si se agotan las secuencias?', query: 'agotan secuencia rango' },
    { label: '¿Cómo declaro el ITBIS en el 606?', query: 'formato 606 declarar' },
    { label: '¿Cómo anulo facturas con Nota de Crédito?', query: 'anular nota de credito' },
    { label: '¿Cómo controlo la Caja (Turnos)?', query: 'caja turno apertura cierre' },
    { label: '¿Cómo configuro la facturación electrónica?', query: 'facturacion electronica e-cf' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '520px', maxHeight: '75vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-200" />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm leading-none">Asistente Operativo</h3>
                  <span className="text-[9px] text-blue-200 mt-0.5 flex items-center gap-1">
                    <Terminal className="w-2.5 h-2.5" /> Motor de respuestas automatizado
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Cerrar asistente"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-between p-1">
                  <div>
                    {/* Welcome Banner */}
                    <div className="flex flex-col items-center justify-center text-center text-neutral-500 space-y-2 mt-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold text-neutral-850 dark:text-neutral-200">¿Qué información del negocio necesitas?</p>
                      <p className="text-[11px] text-neutral-400 px-4">Selecciona una consulta rápida o consulta las preguntas frecuentes.</p>
                    </div>

                    {/* Segment Control Tab Bar */}
                    <div className="flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg mt-4 text-xs">
                      <button
                        onClick={() => setActiveTab('metrics')}
                        className={`flex-1 py-1.5 rounded-md text-center font-medium transition-colors ${
                          activeTab === 'metrics'
                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                      >
                        Métricas de Negocio
                      </button>
                      <button
                        onClick={() => setActiveTab('faqs')}
                        className={`flex-1 py-1.5 rounded-md text-center font-medium transition-colors ${
                          activeTab === 'faqs'
                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                      >
                        Preguntas Frecuentes
                      </button>
                    </div>
                  </div>

                  {/* Suggestion Chips list based on active tab */}
                  <div className="mt-4 flex-1 overflow-y-auto max-h-48 scrollbar-thin">
                    {activeTab === 'metrics' ? (
                      <div className="grid grid-cols-2 gap-2 pb-2">
                        {suggestionChips.map((chip, idx) => {
                          const Icon = chip.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuery(chip.query)}
                              className="text-left p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xs transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold">{chip.label}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2 pb-2">
                        {faqList.map((faq, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuery(faq.query)}
                            className="text-left p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span className="text-[11px] text-neutral-700 dark:text-neutral-300 font-medium truncate">{faq.label}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) => (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl px-4 py-2 shadow-xs ${
                          m.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-sm text-xs'
                            : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-tl-sm p-3'
                        }`}
                      >
                        {m.role === 'user' ? m.content : parseMessageContent(m.content)}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm px-4 py-3 flex space-x-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
              <form onSubmit={handleSubmit} className="flex relative">
                <input
                  id="ai-chat-input"
                  name="ai-chat-input"
                  type="text"
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border-none text-xs rounded-full pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu consulta sobre el negocio..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-7 h-7 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-neutral-800 dark:bg-neutral-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-label="Abrir asistente AI"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>
    </div>
  );
}
