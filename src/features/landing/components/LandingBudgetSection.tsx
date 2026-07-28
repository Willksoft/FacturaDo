import React from 'react';
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
  Printer,
  FileSpreadsheet,
  Banknote,
  Clock,
  PieChart
} from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface LandingBudgetSectionProps {
  onOpenRegister?: () => void;
  onOpenGuide?: () => void;
}

export function LandingBudgetSection({ onOpenRegister, onOpenGuide }: LandingBudgetSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-indigo-950 text-white relative overflow-hidden font-sans" id="nuevas-funcionalidades">
      {/* Background glowing ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* =======================================
            SECTION 1: CENTRO DE PRESUPUESTOS
        ======================================= */}
        <div className="space-y-12">
          {/* HEADER TITLE */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <Calculator className="w-4 h-4 text-indigo-400" />
              Ingeniería y Servicios
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-tight">
              El Centro de Presupuestos y Operaciones Más Potente de RD
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              Diseñado exclusivamente para empresas de construcción, imprentas, carpinterías, agencias y proveedores de servicios que necesitan cálculos exactos basados en m², m³, horas/hombre y materiales físicos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900/90 rounded-3xl border border-neutral-800 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                Costeo Inteligente Sin Usar Excel
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Olvídate de las hojas de cálculo rotas. Con el Centro de Presupuestos de FacturaDo, puedes estructurar costos de materiales, insumos, mano de obra e indirectos en una misma vista. Todo con un sistema que te calcula el margen de ganancia en tiempo real.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Cálculos Multidimensionales</span>
                    <span className="text-[11px] text-neutral-400">Cotiza por Área (m²), Volumen (m³), Perímetro, Días y Kilómetros de forma automática.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <Layers className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Manejo de Mermas</span>
                    <span className="text-[11px] text-neutral-400">Aplica porcentajes de desperdicio a los materiales para no perder dinero.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <PieChart className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Márgenes y Rentabilidad</span>
                    <span className="text-[11px] text-neutral-400">Conoce al centavo cuánto dinero vas a ganar antes de enviar la propuesta.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">PDFs Premium Elegantes</span>
                    <span className="text-[11px] text-neutral-400">Genera propuestas formales para tus clientes con tu logo, firma y términos legales.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={onOpenRegister}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Probar Presupuestos Gratis
                </Button>
              </div>
            </div>

            {/* MOCKUP INTERFACIAL PRESUPUESTOS */}
            <div className="lg:col-span-6 bg-gradient-to-br from-neutral-950 to-indigo-950/80 p-5 rounded-2xl border border-neutral-800 shadow-2xl space-y-4 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-neutral-400 font-bold ml-2">ESTIMACIÓN-2026-A10</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/50">
                  Rentabilidad: 42.5%
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">1. Estructura y Obra Gris</div>
                    <div className="text-[10px] text-neutral-400">Mano de obra + Cemento + Varillas</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-extrabold">RD$ 450,200.00</div>
                    <div className="text-[9px] text-neutral-500">Costo Directo</div>
                  </div>
                </div>

                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">2. Terminaciones en Sheetrock</div>
                    <div className="text-[10px] text-neutral-400">145 m² • Incluye empastado y pintura</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-extrabold">RD$ 125,500.00</div>
                    <div className="text-[9px] text-neutral-500">Costo Directo</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div className="text-neutral-400">Subtotal Costos: RD$ 575,700.00</div>
                <div className="text-base font-black text-white font-mono">P. VENTA: RD$ 820,372.50</div>
              </div>
            </div>
          </div>
        </div>


        {/* =======================================
            SECTION 2: NÓMINA Y RRHH
        ======================================= */}
        <div className="space-y-12">
          {/* HEADER TITLE */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <Users className="w-4 h-4 text-purple-400" />
              Recursos Humanos (RH)
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-tight">
              Gestión Integral de Nómina bajo Ley 16-92 y TSS
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              No más errores en retenciones. El motor de planillas de FacturaDo aplica las reglas fiscales dominicanas más actualizadas para sueldos, vacaciones, regalía pascual y cálculos de liquidación.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900/90 rounded-3xl border border-neutral-800 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
            {/* MOCKUP INTERFACIAL NÓMINA (Left side this time) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-neutral-950 to-purple-950/80 p-5 rounded-2xl border border-neutral-800 shadow-2xl space-y-4 transform hover:scale-[1.02] transition-transform lg:order-1 order-2">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3 font-bold text-purple-300">
                <span className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" /> Recibo de Pago de Empleado</span>
                <span className="text-xs bg-purple-950 border border-purple-800 px-2 py-0.5 rounded text-white">Quincenal</span>
              </div>
              <div className="space-y-2 font-mono text-[11px] text-neutral-300">
                <div className="flex justify-between text-white font-bold text-xs pb-1">
                  <span>Sueldo Bruto Mensual</span>
                  <span>RD$ 85,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Salario Quincena 1:</span> 
                  <span>RD$ 42,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">(-) Retención AFP (2.87%):</span> 
                  <span className="text-red-400">- RD$ 1,219.75</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">(-) Retención SFS/ARS (3.04%):</span> 
                  <span className="text-red-400">- RD$ 1,292.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">(-) Retención ISR (Escalafón DGII):</span> 
                  <span className="text-red-400">- RD$ 3,189.50</span>
                </div>
                <div className="border-t border-neutral-800 my-2 pt-2 flex justify-between text-white font-black text-sm">
                  <span>Sueldo Neto a Pagar:</span> 
                  <span className="text-emerald-400">RD$ 36,798.75</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 lg:order-2 order-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                Control de Personal y Cumplimiento
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Genera los archivos TXT y plantillas de Excel oficiales que la TSS exige mes a mes. Emite volantes de pago profesionales, gestiona horas extras, controla inasistencias y lleva el récord histórico laboral (IR-3, IR-4) de cada empleado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5 text-purple-400"/> Liquidaciones Exactas</span>
                  <span className="text-[11px] text-neutral-400">Calcula preaviso y cesantía sin romperte la cabeza.</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-purple-400"/> Horas Extras (35% y 100%)</span>
                  <span className="text-[11px] text-neutral-400">Procesa jornadas dobles y nocturnas bajo la ley laboral.</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-purple-400"/> Archivo SUIR / TSS</span>
                  <span className="text-[11px] text-neutral-400">Exporta las novedades directamente al formato SUIR Plus.</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5"><Printer className="w-3.5 h-3.5 text-purple-400"/> Recibos Digitales</span>
                  <span className="text-[11px] text-neutral-400">Envía volantes PDF por correo a toda la plantilla en 1 clic.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 3: E-CF Y BANCOS
        ======================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* E-CF CARD */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-extrabold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> API Facturación Electrónica DGII
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading leading-tight mb-3">
              Certificado Digital y e-CF
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              Carga tu certificado digital <code>.p12</code> con clave encriptada. Emite comprobantes electrónicos (E31, E32, E44) aprobados directamente con la DGII o mantén el sistema tradicional B01/B02 si aún no eres contribuyente electrónico. Integración Nativa con MSeller.
            </p>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-[11px]">
              <div className="text-emerald-400 font-bold flex items-center justify-between mb-2">
                <span>🟢 MSeller API: Conectado</span>
                <span>Latencia: 12ms</span>
              </div>
              <div className="text-neutral-500">
                e-CF E3100000001 — Firmado digitalmente y procesado en entorno CerteCF.
              </div>
            </div>
          </div>

          {/* BANCOS CARD */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-extrabold mb-4">
              <RefreshCw className="w-4 h-4 text-amber-400" /> Finanzas y Conciliación
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading leading-tight mb-3">
              Conciliación Bancaria Automática
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              Importa tus estados de cuenta (CSV, OFX) de bancos dominicanos (Popular, BHD, Banreservas). El sistema cruza inteligentemente los movimientos contra facturas emitidas y compras (606) registradas.
            </p>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-[11px]">
              <div className="text-amber-400 font-bold mb-2 border-b border-neutral-800 pb-2">
                Importación Exitosa OFX — 128 Movimientos
              </div>
              <div className="text-neutral-500">
                Detectados: 4 depósitos sin identificar. 124 transacciones pareadas 100% con contabilidad de la empresa.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
