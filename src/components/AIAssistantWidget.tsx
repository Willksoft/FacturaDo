import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, MessageSquare, Terminal, ChevronRight } from 'lucide-react';
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
      return `### ¡Hola! 👋 Soy tu Asistente Inteligente

Puedo analizar los datos de tu plataforma de facturación al instante para darte respuestas rápidas. Prueba pidiéndome:

- **📊 Resumen de ventas** (Ventas totales, cobradas y pendientes)
- **👥 Lista de clientes** (Tus últimos clientes agregados)
- **🧾 Facturas generadas** (Estatus y últimas facturas comerciales)
- **💰 Reporte de ITBIS** (ITBIS facturado en ventas vs pagado en gastos)

¿En qué te puedo colaborar hoy? 😊`;
    }

    // Resumen de ventas
    if (query.includes('venta') || query.includes('ganancia') || query.includes('ingreso') || query.includes('resumen') || query.includes('dinero')) {
      const realInvoices = invoices.filter((i: any) => i.type !== 'Cotizacion');
      const totalSales = realInvoices.reduce((acc: number, cur: any) => acc + (cur.total || 0), 0);
      const paidInvoices = realInvoices.filter((i: any) => i.status === 'Pagada' || i.status === 'Cobrada');
      const pendingInvoices = realInvoices.filter((i: any) => i.status === 'Pendiente' || i.status === 'Por Cobrar');
      const totalPaid = paidInvoices.reduce((acc: number, cur: any) => acc + (cur.total || 0), 0);
      const totalPending = pendingInvoices.reduce((acc: number, cur: any) => acc + (cur.total || 0), 0);

      return `### 📊 Resumen de Ventas de tu Negocio

Aquí tienes un desglose del rendimiento financiero en tiempo real obtenido de tu base de datos:

*   **Ventas Totales Facturadas:** RD$ **${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (de un total de **${realInvoices.length}** facturas emitidas).
*   **Monto Cobrado (Pagado):** RD$ **${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (${paidInvoices.length} facturas).
*   **Monto Pendiente (Cuentas por Cobrar):** RD$ **${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (${pendingInvoices.length} facturas).
*   **Ticket Promedio:** RD$ **${(realInvoices.length > 0 ? totalSales / realInvoices.length : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**.

*Nota: Estos valores excluyen cotizaciones en proceso.*`;
    }

    // Lista de clientes
    if (query.includes('cliente') || query.includes('clientes') || query.includes('persona')) {
      if (clients.length === 0) {
        return `### 👥 Lista de Clientes\n\nActualmente no tienes clientes registrados en la plataforma. Puedes agregar clientes en la pestaña **Lista de clientes** del menú principal.`;
      }

      const top5 = clients.slice(0, 5);
      const listStr = top5.map((c: any, index: number) => {
        const rncStr = c.rncOrCedula ? ` | RNC/Céd: ${c.rncOrCedula}` : '';
        return `${index + 1}. **${c.name}**${rncStr}`;
      }).join('\n');

      return `### 👥 Lista de Clientes Registrados

Actualmente tienes un total de **${clients.length}** clientes registrados en tu cartera. 

**Tus últimos clientes agregados:**
${listStr}

${clients.length > 5 ? `*... y ${clients.length - 5} clientes más.*` : ''}

*Tip: Puedes ver detalles financieros y estados de cuentas individuales en la sección **Clientes**.*`;
    }

    // Facturas generadas
    if (query.includes('factura') || query.includes('facturas') || query.includes('comprobante') || query.includes('ncf')) {
      const realInvoices = invoices.filter((i: any) => i.type !== 'Cotizacion');
      if (realInvoices.length === 0) {
        return `### 🧾 Facturas Generadas\n\nNo has generado facturas comerciales todavía en la plataforma. Dirígete a **Punto de Venta (POS)** o **Crear Factura** para generar tu primera factura fiscal.`;
      }

      const recentInvoices = realInvoices.slice(-3).reverse();
      const listStr = recentInvoices.map((i: any) => {
        const clientName = i.client?.name || 'Consumidor Final';
        const statusEmoji = i.status === 'Pagada' || i.status === 'Cobrada' ? '🟢' : '🟡';
        return `- **${i.invoiceNumber || 'Factura'}** | ${clientName} | RD$ **${(i.total || 0).toLocaleString('en-US')}** ${statusEmoji} *${i.status || 'Pendiente'}*`;
      }).join('\n');

      return `### 🧾 Facturas Recientes Generadas

Has emitido un total de **${realInvoices.length}** facturas en la plataforma.

**Últimas 3 facturas emitidas:**
${listStr}

*Nota: Los comprobantes fiscales están debidamente reportados en tus reportes DGII de la sección **Reportes**.*`;
    }

    // Reporte de ITBIS
    if (query.includes('itbis') || query.includes('impuesto') || query.includes('impuestos') || query.includes('isr')) {
      const realInvoices = invoices.filter((i: any) => i.type !== 'Cotizacion');
      
      // ITBIS Facturado (Ventas)
      const itbisFacturado = realInvoices.reduce((acc: number, cur: any) => acc + (cur.taxAmount || cur.itbis || 0), 0);
      
      // ITBIS Comprado (Gastos)
      const itbisGastos = expenses.reduce((acc: number, cur: any) => acc + (cur.itbis || cur.itbisAmount || 0), 0);
      
      // Saldo Neto
      const saldoNeto = itbisFacturado - itbisGastos;

      return `### 💰 Reporte Fiscal de ITBIS (Estimación)

Calculando ITBIS acumulado en base a tus facturas y gastos declarados en FacturaDo:

*   **ITBIS Facturado (Ventas):** RD$ **${itbisFacturado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (Retenido a tus clientes).
*   **ITBIS Comprado (Gastos):** RD$ **${itbisGastos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** (Pagado con comprobantes válidos para crédito fiscal).
*   **Saldo Estimado a Declarar (DGII):** RD$ **${Math.abs(saldoNeto).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** ${
        saldoNeto >= 0 
          ? '🔴 **por pagar** (ITBIS a pagar al estado).' 
          : '🟢 **a favor** (Saldo fiscal acumulado a tu favor).'
      }

*Recomendación: Asegúrate de declarar todos tus gastos con comprobantes de crédito fiscal (B01) en la pestaña **Gastos** para deducir el ITBIS correctamente antes de presentar el formato 606.*`;
    }

    // Fallback
    return `### 🤖 Asistente Automatizado FacturaDo

No logré entender completamente tu consulta. Para darte información exacta y rápida, por favor selecciona o escribe una de las siguientes opciones:

1.  **📊 Resumen de ventas** (Ganancias, facturado, cobrado y ticket promedio)
2.  **👥 Lista de clientes** (Clientes registrados y últimos agregados)
3.  **🧾 Facturas generadas** (Facturas recientes y desglose de estatus)
4.  **💰 Reporte de ITBIS** (ITBIS de ventas vs ITBIS deducible de gastos)

*Escribe la palabra clave (ej. **"itbis"** o **"ventas"**) o haz clic en uno de los botones rápidos.*`;
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
        return (
          <h4 key={idx} className="font-bold text-sm text-neutral-900 dark:text-neutral-50 mt-3 first:mt-0 mb-1.5 pb-1 flex items-center border-b border-neutral-100 dark:border-neutral-800">
            {parseBoldText(trimmed.slice(4))}
          </h4>
        );
      }
      
      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-neutral-700 dark:text-neutral-300 my-1 leading-relaxed">
            {parseBoldText(trimmed.slice(2))}
          </li>
        );
      }

      // Ordered lists (numbers)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <li key={idx} className="ml-4 list-decimal text-neutral-700 dark:text-neutral-300 my-1 leading-relaxed">
            {parseBoldText(numMatch[2])}
          </li>
        );
      }

      // Empty lines
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Default paragraph
      return (
        <p key={idx} className="text-neutral-750 dark:text-neutral-300 my-1 leading-relaxed">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  const suggestionChips = [
    { label: '📊 Resumen de ventas', query: 'Resumen de ventas' },
    { label: '👥 Lista de clientes', query: 'Lista de clientes' },
    { label: '🧾 Facturas recientes', query: 'Facturas generadas' },
    { label: '💰 Reporte de ITBIS', query: 'Reporte de ITBIS' }
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
            style={{ height: '500px', maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-200" />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm leading-none">Asistente Local</h3>
                  <span className="text-[9px] text-blue-200 mt-0.5 flex items-center gap-1">
                    <Terminal className="w-2.5 h-2.5" /> Procesamiento instantáneo
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
                <div className="h-full flex flex-col justify-between p-2">
                  <div className="flex flex-col items-center justify-center text-center text-neutral-500 space-y-3 mt-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm px-4">¡Hola! Soy tu asistente de FacturaDo. ¿De qué quieres ver un reporte hoy?</p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {suggestionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuery(chip.query)}
                        className="text-left p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xs transition-all flex items-center justify-between group"
                      >
                        <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{chip.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
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
                        className={`max-w-[90%] rounded-2xl px-4 py-2 text-sm shadow-xs ${
                          m.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-sm'
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
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border-none text-sm rounded-full pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Pregunta algo..."
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
