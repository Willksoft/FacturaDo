import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Warehouse, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  AlertTriangle,
  Lock,
  Globe,
  Database
} from 'lucide-react';

interface HelpManualViewProps {
  onBackToLanding?: () => void;
  isInsideApp?: boolean;
}

export default function HelpManualView({ onBackToLanding, isInsideApp = false }: HelpManualViewProps) {
  const [activeTopic, setActiveTopic] = useState<string>('inicio');

  const topics = [
    {
      id: 'inicio',
      title: 'Guía Rápida de Inicio',
      description: 'Aprende a emitir tu primera factura en menos de 2 minutos.',
      icon: Compass,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      id: 'ncf',
      title: 'El Universo de los NCF',
      description: 'Explicación detallada de B01, B02, B14 y B15 para R.D.',
      icon: FileText,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      id: 'dgii',
      title: 'Formatos 606 y 607 (DGII)',
      description: 'Cómo generar y enviar tus reportes mensuales sin errores.',
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      id: 'caja',
      title: 'Control de Caja y POS',
      description: 'Cuadre diario, registro de egresos e ingresos rápidos.',
      icon: Store,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      id: 'inventario',
      title: 'Inventarios y Almacenes',
      description: 'Control de stock mínimo, mermas y multialmacenes.',
      icon: Warehouse,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    },
    {
      id: 'seguridad',
      title: 'Seguridad y Ciberseguridad',
      description: 'Nuestras capas de blindaje: anti-fuerza bruta, rate-limiting y frameguard.',
      icon: Lock,
      color: 'text-neutral-700 bg-neutral-100 border-neutral-200'
    }
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto ${isInsideApp ? 'p-0' : 'px-4 sm:px-6 lg:px-8 py-10'} font-sans`}>
      {/* Title block */}
      {!isInsideApp && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-6 mb-8 gap-4 text-left animate-fade-in animate-duration-150">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#1A2732] font-semibold bg-[#1A2732]/5 px-2.5 py-1 rounded-full border border-[#1A2732]/10">Manual de Usuario Oficial</span>
            <h1 className="text-3xl font-extrabold text-[#1A2732] leading-tight mt-2">Centro de Ayuda & Guía Tributaria</h1>
            <p className="text-neutral-500 text-xs mt-1">Aprende a dominar la facturación fiscal, control de cuadre de cajas y almacenes dominicanos de forma profesional.</p>
          </div>
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-5 py-2.5 bg-[#1A2732] hover:bg-neutral-800 text-white hover:scale-[1.02] active:scale-[0.98] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs self-start"
            >
              ← Volver al Portal de FacturaDo
            </button>
          )}
        </div>
      )}

      {/* Grid Layout: left column tabs, right column interactive detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Navigation topics side panel */}
        <div className="lg:col-span-4 space-y-3 shrink-0">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Temas Disponibles</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {topics.map((topic) => {
              const TopicIcon = topic.icon;
              const isActive = activeTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`w-full p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer flex gap-3.5 items-center group relative overflow-hidden outline-none ${
                    isActive 
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 border ${topic.color}`}>
                    <TopicIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 truncate pr-2">
                    <div className={`text-xs font-extrabold tracking-wide uppercase transition-colors ${isActive ? 'text-white' : 'text-neutral-900'}`}>
                      {topic.title}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {topic.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg--neutral px-4 rounded-xl border border-neutral-150 text-[11px] leading-relaxed text-neutral-500 space-y-2 mt-4">
            <div className="font-bold text-neutral-800 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-neutral-500" /> Soporte Oficial DGII R.D.
            </div>
            <p>FacturaDo implementa algoritmos optimizados para alinearse rigurosamente con la norma de tributación fiscal vigente dominicana de forma 100% nativa.</p>
          </div>
        </div>

        {/* Detailed Topic view screen */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-xs min-h-[500px] flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Inicio (Quickstart) */}
            {activeTopic === 'inicio' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg"><Compass className="w-5 h-5" /></div>
                  <h2 className="text-lg font-extrabold text-neutral-900 uppercase tracking-wide">Guía Rápida de Inicio - FacturaDo</h2>
                </div>

                <p className="text-neutral-600 text-xs leading-relaxed">
                  FacturaDo simplifica drásticamente tu ciclo comercial. Para emitir una factura, no necesitas ser un experto contador. Sigue esta guía paso a paso para realizar tu primera emisión fiscal en República Dominicana:
                </p>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">1</div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-neutral-900">Configura tus secuencias NCF autorizadas</h3>
                      <p className="text-neutral-500 text-[11px] leading-normal">
                        Dirígete a <strong>Configuración {'>'} Comprobantes (NCF)</strong>. Agrega las secuencias vigentes que te haya asignado la DGII para Crédito Fiscal (B01) o Consumo (B02), ingresando el número inicial, número final y la fecha de vencimiento autorizada.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">2</div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-neutral-900">Registra tu Catálogo de Clientes y Productos</h3>
                      <p className="text-neutral-500 text-[11px] leading-normal">
                        Ingresa a <strong>Directorio / Clientes</strong> para guardar tus clientes frecuentes. Si tienen NCF B01, introduce su RNC. FacturaDo buscará automáticamente los datos en el padrón DGII para verificar su nombre comercial oficial. Registra tus artículos en <strong>Productos / Inventario</strong> con sus precios e impuestos.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">3</div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-neutral-900">Emite y Envía la Factura</h3>
                      <p className="text-neutral-550 text-[11px] leading-normal">
                        Haz clic en <strong>Nueva Factura</strong>. Selecciona el tipo de comprobante que solicita tu cliente, asocia el cliente, agrega los productos de tu carrito y presiona **Sellar e Imprimir**. Al instante podrás generar un PDF oficial en formato Carta o formato Ticket de 80mm (térmica) o enviarlo por correo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-150 text-[11px] text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tip de Contabilidad:</strong> FacturaDo guarda copias en la base de datos de manera inmediata. Si expiras de red, el sistema te permite seguir digitando el borrador y sincronizarlo al retornar tu enlace.</span>
                </div>
              </div>
            )}

            {/* NCF Universe */}
            {activeTopic === 'ncf' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <div className="p-2 bg-rose-50 text-rose-700 rounded-lg"><FileText className="w-5 h-5" /></div>
                  <h2 className="text-lg font-extrabold text-neutral-900 uppercase tracking-wide">El Universo de los NCF Dominicanos</h2>
                </div>

                <p className="text-neutral-600 text-xs leading-relaxed font-sans">
                  El <strong>Número de Comprobante Fiscal (NCF)</strong> es la secuencia numérica autorizada por la DGII que controla la facturación en República Dominicana. Comprender cada tipo es vital para evitar multas:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1.5 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#1A2732] text-white font-mono text-[10px] font-bold rounded">B01</span>
                      <strong className="text-neutral-900 text-xs">Crédito Fiscal</strong>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Se emite obligatoriamente a empresas, corporaciones o profesionales independientes registrados en el RNC. Les permite sustentar gastos del ISR y recuperar el ITBIS adelantado como crédito fiscal.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1.5 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-neutral-400 text-white font-mono text-[10px] font-bold rounded">B02</span>
                      <strong className="text-neutral-900 text-xs">Consumo Final</strong>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Se emite a personas físicas (ciudadanos comunes) que van a consumir el bien o servicio de forma final y no deducirán el gasto comercialmente para impuestos de renta.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1.5 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-cyan-600 text-white font-mono text-[10px] font-bold rounded">B14</span>
                      <strong className="text-neutral-900 text-xs">Régimen Especial</strong>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Emitido exclusivamente a instituciones acogidas a leyes de exención especial (por ejemplo: Empresas de Zonas Francas, Embajadas, u ONGs calificadas que no pagan ITBIS).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1.5 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-neutral-700 text-white font-mono text-[10px] font-bold rounded">B15</span>
                      <strong className="text-neutral-900 text-xs">Gubernamental</strong>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Emisiones para ventas y contrataciones realizadas con el Estado Dominicano, Ministerios, Ayuntamientos, y dependencias gubernamentales en general.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-150 text-[11px] text-rose-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Importante:</strong> Los errores por vencimiento de secuencia o digitación incorrecta del RNC invalidan la deducción de tu cliente. FacturaDo rechaza secuencias vencidas automáticamente.</span>
                </div>
              </div>
            )}

            {/* DGII Reports (606, 607) */}
            {activeTopic === 'dgii' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                  <h2 className="text-lg font-extrabold text-neutral-900 uppercase tracking-wide">Formatos de Envío Mensual (606 y 607)</h2>
                </div>

                <p className="text-neutral-600 text-xs leading-relaxed font-sans">
                  Todo negocio formalizado en Rep. Dominicana debe reportarle a la DGII sus transacciones financieras mensuales en formatos específicos estructurados. El sistema te permite generar estos consolidados listos para exportar:
                </p>

                <div className="space-y-4 font-sans text-xs">
                  <div className="p-4 rounded-xl border border-neutral-150 space-y-2">
                    <div className="font-extrabold text-neutral-900 flex items-center justify-between">
                      <span>✓ Formato 606 (Registro de Compras de Bienes y Servicios)</span>
                      <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">Compras</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      En este formato se reportan todas las compras sustentadas bajo tiques o facturas de Crédito Fiscal (B01) realizadas por tu negocio para su propia operación. Permite deducir gastos. Se envía mensualmente antes del día 15 de cada mes.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-2">
                    <div className="font-extrabold text-neutral-900 flex items-center justify-between font-sans">
                      <span>✓ Formato 607 (Registro de Ventas de Bienes y Servicios)</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">Ventas</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Este formato consolida todas las ventas del mes que realizas a tus clientes. FacturaDo ordena e incluye automáticamente en cada renglón el RNC, NCF, ITBIS facturado, fecha, tipo de retención e ingresos.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-neutral-600 text-[11px] bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <span className="font-bold text-neutral-900 block uppercase tracking-wide text-[10px]">Procedimiento para subir los formatos en la Oficina Virtual (OFV):</span>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-550 pl-1 mt-1">
                    <li>Dirígete a <strong className="text-neutral-700">Tributaciones & Reportes</strong> en tu terminal de FacturaDo.</li>
                    <li>Selecciona el formato correspondiente (606 o 607) y el período mensual que vas a reportar.</li>
                    <li>Presiona **Generar y Exportar Excel / TXT**. El sistema creará el archivo formateado bajo el padrón exacto de la DGII.</li>
                    <li>Abre tu sesión oficial de Oficina Virtual DGII, ve a la sección "Enviar Formatos", sube el archivo generado y presiona enviar.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* POS & Cash management */}
            {activeTopic === 'caja' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg"><Store className="w-5 h-5" /></div>
                  <h2 className="text-lg font-extrabold text-neutral-900 uppercase tracking-wide">Módulo de Cuadre de Cajas y POS Express</h2>
                </div>

                <p className="text-neutral-600 text-xs leading-relaxed">
                  Para negocios minoristas, cafés, colmados o ferreterías, el flujo rápido de dinero en efectivo exige un estricto control diario de ingresos y egresos. Sigue estas recomendaciones:
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-xl space-y-1 text-center bg-neutral-50/50">
                      <span className="font-bold text-neutral-900 text-[11px] block uppercase">1. Apertura de Caja</span>
                      <p className="text-[10px] text-neutral-500">
                        Inicia el día con un fondo fijo en efectivo (ejemplo: RD$ 2,000) destinado para dar vueltas / devueltas. Regístralo como balance de apertura.
                      </p>
                    </div>

                    <div className="p-3 border rounded-xl space-y-1 text-center bg-neutral-50/50">
                      <span className="font-bold text-neutral-900 text-[11px] block uppercase">2. Registrar Salidas</span>
                      <p className="text-[10px] text-neutral-500">
                        Si pagas un delivery o compras suministros de caja, regístralo de inmediato en el botón **Registrar Egreso** para no alterar el arqueo final.
                      </p>
                    </div>

                    <div className="p-3 border rounded-xl space-y-1 text-center bg-neutral-50/50">
                      <span className="font-bold text-neutral-900 text-[11px] block uppercase">3. Arqueo y Cuadre</span>
                      <p className="text-[10px] text-neutral-500">
                        Al final del día laboral, realiza un recuento de todo el efectivo, comprobantes de tarjetas de crédito y transferencias. El software validará si hay sobrantes o faltantes.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 bg-[#1A2732]/5 p-4 rounded-xl border border-[#1A2732]/10 text-xs">
                    <strong className="text-[#1A2732]">El POS Táctil de FacturaDo:</strong>
                    <p className="text-neutral-600 text-[11px] leading-relaxed mt-1">
                      Nuestra interfaz táctil de mostrador agiliza el servicio: puedes buscar por lector de código de barras o tocando directamente las pestañas bento de tus categorías de productos, seleccionar el método de pago (Efectivo, Tarjeta, Transferencia) y emitir el ticket fiscal en formatos térmicos (80mm) con un clic.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Inventario and almacenes */}
            {activeTopic === 'inventario' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-lg"><Warehouse className="w-5 h-5" /></div>
                  <h2 className="text-lg font-extrabold text-neutral-900 uppercase tracking-wide">Módulo de Inventarios y Almacenes Activos</h2>
                </div>

                <p className="text-neutral-600 text-xs leading-relaxed">
                  Evita que tu negocio se quede sin stock de tus productos estrellas o acumule mermas financieras. FacturaDo cuenta con un poderoso motor inteligente de inventario:
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1.5 text-xs">
                    <strong className="text-neutral-900">1. Alertas de Existencia Crítica:</strong>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Al registrar un artículo, puedes definir su stock mínimo (ej. 5 unidades). Cuando el sistema registre ventas que lo dejen por debajo, FacturaDo emitirá una alerta visual en el panel superior para prevenir desabastecimientos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1.5 text-xs">
                    <strong className="text-neutral-900">2. Múltiples Almacenes & Ajuste Financiero:</strong>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Si posees una sucursal o una bodega de distribución principal, puedes transferir inventario entre almacenes sin alterar tus costos unitarios promedio habituales, y realizar ajustes manuales por daños físicos o mermas con un supervisor autorizado.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Seguridad y Ciberseguridad */}
            {activeTopic === 'seguridad' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <div className="p-2 bg-neutral-100 text-neutral-800 rounded-lg"><Lock className="w-5 h-5" /></div>
                  <h2 className="text-lg font-extrabold text-neutral-900 uppercase tracking-wide">Sistemas de Seguridad y Protección de tu Negocio</h2>
                </div>

                <p className="text-neutral-600 text-xs leading-relaxed">
                  Para resguardar de forma impenetrable tus finanzas, facturas y datos de clientes frente a ataques, FacturaDo cuenta con rigurosas capas de blindaje de seguridad activas:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-950">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Protección Clickjacking & Frame Guard</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Impedimos activamente que el portal sea incrustado en iframes maliciosos de terceras partes no autorizadas mediante cabeceras HTTP estrictas y bloqueos automáticos en tiempo de ejecución.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1 bg-neutral-50/50 font-sans">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-950">
                      <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Protección DOS & Bloqueo Antipeticiones</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Nuestra plataforma de autenticación inteligente bloquea temporalmente las IPs de origen o los usuarios que introduzcan claves de acceso incorrectas o envíen spam de peticiones consecutivas en menos de 5 segundos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-950">
                      <Database className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Validación de Inputs e Inyección</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Todos los datos de entrada (RNC, correos, montos e inventario) son filtrados y saneados bajo expresiones regulares estrictas antes de ser enviados a PostgreSQL, impidiendo inyecciones SQL u XSS.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-150 space-y-1 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-950">
                      <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Canal Seguro Cifrado SSL AES-256</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Toda comunicación de datos viaja de forma invisible encriptada bajo el protocolo criptográfico seguro TLS 1.3 con clave criptográfica AES de 256 bits directa.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prompt banner footer */}
          <div className="pt-6 border-t border-neutral-150 flex flex-col sm:flex-row items-center sm:justify-between text-neutral-450 text-[10px] gap-2">
            <div>© 2026 FacturaDo SRL • Sincronizado fiscalmente con la DGII.</div>
            <div className="flex items-center gap-1 bg-neutral-50 p-1 px-2.5 rounded border border-neutral-100 uppercase tracking-widest font-mono text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Servidor Nube Activo
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
