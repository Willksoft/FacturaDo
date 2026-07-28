import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Layers, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Sliders, 
  TrendingUp, 
  Cpu, 
  Package, 
  Users, 
  BadgeCheck, 
  RefreshCw,
  Printer
} from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface LandingBudgetSectionProps {
  onOpenRegister?: () => void;
  onOpenGuide?: () => void;
}

export function LandingBudgetSection({ onOpenRegister, onOpenGuide }: LandingBudgetSectionProps) {
  const [activeTab, setActiveTab] = useState<'presupuestos' | 'ecf' | 'nomina' | 'bancos'>('presupuestos');

  return (
    <section className="py-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-indigo-950 text-white relative overflow-hidden font-sans" id="nuevas-funcionalidades">
      {/* Background glowing ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* HEADER TITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Novedades 2026 • FacturaDo Enterprise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            El Módulo de Presupuestos y Operaciones Más Potente de la República Dominicana
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Calcula costos dinámicos por área, volumen o jornadas, emite e-CF ante la DGII, gestiona la nómina con TSS/ISR Ley 16-92 y concilia tus bancos en tiempo real.
          </p>
        </div>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl gap-2 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('presupuestos')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'presupuestos'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Centro de Presupuestos
            </button>

            <button
              onClick={() => setActiveTab('ecf')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ecf'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              e-CF Electrónico & MSeller
            </button>

            <button
              onClick={() => setActiveTab('nomina')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'nomina'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              Nómina TSS & Ley 16-92
            </button>

            <button
              onClick={() => setActiveTab('bancos')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'bancos'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Conciliación Bancaria OFX
            </button>
          </div>
        </div>

        {/* TAB CONTENT SHOWCASE */}
        <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          {activeTab === 'presupuestos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-extrabold">
                  <Calculator className="w-4 h-4 text-indigo-400" /> Estimación Inteligente sin Fórmulas Manuales
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                  Diseñado para Imprentas, Obras, Carpinterías, Rotulación y Servicios
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Crea presupuestos precisos con costeo automático por m², m³, perímetros, horas hombre o fletes. Desglosa costos reales frente a márgenes de ganancia y convierte presupuestos aprobados en cotizaciones oficiales en 1 clic.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Modo Multicálculo</span>
                      <span className="text-[11px] text-neutral-400">Área, Volumen, Perímetro, Días y Km</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Plantillas por Industria</span>
                      <span className="text-[11px] text-neutral-400">Modelos pre-diseñados por sector</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Carpetas de Proyectos</span>
                      <span className="text-[11px] text-neutral-400">Agrupa presupuestos de un trabajo</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Vistas Personalizadas</span>
                      <span className="text-[11px] text-neutral-400">Cliente, Interna y Producción</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={onOpenRegister}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    Probar Centro de Presupuestos Gratis
                  </Button>
                  {onOpenGuide && (
                    <Button
                      variant="outline"
                      onClick={onOpenGuide}
                      className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs h-11 px-5 rounded-xl cursor-pointer"
                    >
                      Ver Guía en el Manual →
                    </Button>
                  )}
                </div>
              </div>

              {/* MOCKUP INTERFACiAL */}
              <div className="lg:col-span-6 bg-gradient-to-br from-neutral-950 to-indigo-950/80 p-5 rounded-2xl border border-neutral-800 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-neutral-400 font-bold ml-2">PRES-2026-0001 v2</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/50">
                    Aprobado
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Plancha PVC Celular 10mm (4x8ft)</div>
                      <div className="text-[10px] text-neutral-400">Alto 2.44m x Ancho 1.22m • Merma 8%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-extrabold">RD$ 2,592.00</div>
                      <div className="text-[9px] text-neutral-500">Monto Venta</div>
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Instalación Exterior con Grúa</div>
                      <div className="text-[10px] text-neutral-400">4 Horas • 2 Técnicos Certificados</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-extrabold">RD$ 3,800.00</div>
                      <div className="text-[9px] text-neutral-500">Monto Venta</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <div className="text-neutral-400">Margen de Ganancia: <strong className="text-indigo-400">38.5%</strong></div>
                  <div className="text-base font-black text-white font-mono">TOTAL: RD$ 7,542.56</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ecf' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Facturación Electrónica Oficial DGII
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                  Integración Transparente con la API de MSeller y CerteCF
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Carga tu certificado digital `.p12` con clave encriptada de forma segura. Emite comprobantes electrónicos E31, E32, E44, E45 directamente con la DGII o mantén comprobantes tradicionales B01/B02 opcionales.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                    <span className="font-bold text-white block">Firma Digital .p12</span>
                    <span className="text-[11px] text-neutral-400">Almacenamiento seguro e inmutable</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                    <span className="font-bold text-white block">Asistente CerteCF</span>
                    <span className="text-[11px] text-neutral-400">8 pasos guiados de certificación DGII</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-3 font-mono text-xs">
                <div className="text-emerald-400 font-bold flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span>🟢 Conexión MSeller API: ACTIVA</span>
                  <span>Latencia: 12ms</span>
                </div>
                <div className="text-neutral-300 text-[11px]">
                  e-CF E3100000001 — Firmado digitalmente y aceptado por DGII en entorno de Pruebas CerteCF.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nomina' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-extrabold">
                  <Users className="w-4 h-4 text-purple-400" /> Cumplimiento Legal Dominicana Ley 16-92
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                  Gestión Completa de Nómina, TSS, ISR y Prestaciones Laborales
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Calcula de forma exacta las retenciones de AFP/ARS (Ley 87-01), escalafón del ISR DGII, prestaciones por desahucio/cesantía y exporta directamente el archivo TXT para la TSS.
                </p>
              </div>

              <div className="lg:col-span-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2 font-bold text-purple-300">
                  <span>Simulación Nómina Ejecutiva RD$ 150,000</span>
                  <span>TSS + ISR</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-neutral-300">
                  <div className="flex justify-between"><span>AFP (2.87%):</span> <span>RD$ 4,305.00</span></div>
                  <div className="flex justify-between"><span>ARS (3.04% Topado):</span> <span>RD$ 4,560.00</span></div>
                  <div className="flex justify-between text-amber-400 font-bold"><span>ISR DGII Retención:</span> <span>RD$ 23,866.69</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bancos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-extrabold">
                  <RefreshCw className="w-4 h-4 text-amber-400" /> Conciliación Bancaria Automática
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                  Importa Estados de Cuenta OFX/CSV de Banreservas, BHD y Popular
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Conecta y cruza tus movimientos bancarios contra facturas y gastos registrados. Detecta inmediatamente depósitos no registrados o diferencias de saldo.
                </p>
              </div>

              <div className="lg:col-span-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-3 text-xs font-mono">
                <div className="text-amber-400 font-bold border-b border-neutral-800 pb-2">
                  Archivo OFX Importado — 128 Movimientos Cruce 100%
                </div>
                <div className="text-neutral-400 text-[11px]">
                  Conciliación realizada exitosamente con la caja chica y cuenta corriente comercial.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
