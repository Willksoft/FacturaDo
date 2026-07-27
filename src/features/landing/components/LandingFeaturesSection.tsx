import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  FolderOpen,
  Laptop,
  Database,
  Users,
  ShieldCheck,
  CreditCard,
  Download,
  RefreshCw,
  Sparkles,
  Clock,
  UserPlus,
  Layers,
  Receipt,
  Lock,
  FileText,
  Printer,
  Edit3,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';

interface LandingFeaturesSectionProps {
  onRegisterClick: () => void;
}

export function LandingFeaturesSection({ onRegisterClick }: LandingFeaturesSectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="funcionalidades" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-sky-600 font-medium uppercase tracking-widest text-xs sm:text-sm block">Poderosas Funcionalidades</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-medium text-slate-900 tracking-tight">Ecosistema Integral: Facturación, Nómina & R.H.</h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
            Diseñado para simplificar la operación de tu negocio en la República Dominicana: Ley 16-92, TSS, DGII y Facturación NCF.
          </p>
        </div>

        {/* DESTACADO DE NÓMINA EMPRESARIAL */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-2xl border border-slate-800 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2 max-w-2xl">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                🇩🇴 Módulo Estrella: Nómina Empresarial & Recursos Humanos
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                Cumplimiento Ley 16-92, TSS (SUIR) & Retenciones DGII
              </h3>
              <p className="text-sm text-slate-300">
                Todo lo que tu departamento de Recursos Humanos necesita para procesar salarios, generar contratos legales, imprimir comprobantes de pago e informar a la Tesorería de la Seguridad Social.
              </p>
            </div>

            <button
              onClick={onRegisterClick}
              className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-bold text-xs shadow-lg transition-all shrink-0 cursor-pointer"
            >
              Comenzar a Administrar Nómina →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <Users className="w-4 h-4" />
                Ficha 360° & Expediente Digital
              </div>
              <p className="text-xs text-slate-300">
                Matriz de casillas fiscales independientes (TSS/ISR/INFOTEP), estatus migratorio, pasaportes y expedientes en PDF/JPG.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <FileText className="w-4 h-4" />
                Generador de Contratos & Cartas
              </div>
              <p className="text-xs text-slate-300">
                Auto-generador de Contratos de Trabajo Ley 16-92 con cláusulas libres, Cartas de Despido/Renuncia y Certificaciones.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Printer className="w-4 h-4" />
                Volantes Cheque (3 por página)
              </div>
              <p className="text-xs text-slate-300">
                Impresión en lote con logo de empresa de recibos de pago en formato cheque bancario o tamaño carta.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
                <Download className="w-4 h-4" />
                Exportador TXT Novedades TSS
              </div>
              <p className="text-xs text-slate-300">
                Genera con 1 clic el archivo plano para la plataforma SUIR de la TSS filtrando personal exento o internacional.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Edit3 className="w-4 h-4" />
                Nómina Manual Flex
              </div>
              <p className="text-xs text-slate-300">
                Formulario de carga directa para ingresar montos arbitrarios de salarios, bonos y retroactivos libres.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                Auditor IA Copilot & Migración
              </div>
              <p className="text-xs text-slate-300">
                Escaneo en tiempo real de pasaportes/visas por vencer en 60 días y alertas preventivas DGM.
              </p>
            </div>
          </div>
        </div>

        {/* GRID DE OTRAS FUNCIONALIDADES COMERCIALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Controla tu flujo de caja */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-medium shrink-0">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Caja y Flujo de Efectivo</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Lleva un control diario de aperturas, egresos, ventas en efectivo o tarjeta, y haz tus cuadres de caja sin errores.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide block pt-2 border-t border-slate-50 uppercase">Cuadre rápido integrado</span>
          </div>

          {/* 2. Gestiona tu inventario */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-medium shrink-0">
                <FolderOpen className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Inventario e Historial</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Conoce las existencias exactas en tus almacenes, configura alertas de stock mínimo y recibe avisos automáticos de reposición.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide block pt-2 border-t border-slate-50 uppercase">Alertas de stock mínimo</span>
          </div>

          {/* 3. Accede desde cualquier dispositivo */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-medium shrink-0">
                <Laptop className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Multiplataforma Nube</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Administra desde tu computadora de escritorio, tablet o celular en tiempo real con sincronización instantánea.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide block pt-2 border-t border-slate-50 uppercase">Acceso ilimitado 24/7</span>
          </div>

          {/* 4. Decisiones con datos reales */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-medium shrink-0">
                <Database className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Estadísticas y Reportes</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Visualiza tus ingresos, egresos y márgenes netos de utilidad en gráficos claros para una toma de decisiones informada.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide block pt-2 border-t border-slate-50 uppercase">Reportes detallados en vivo</span>
          </div>

          {/* 5. Clientes y Proveedores */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 font-medium shrink-0">
                <Users className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Clientes y Proveedores</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Centraliza la información de contactos, saldos pendientes y estados de cuenta para una gestión de cobros ágil.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide block pt-2 border-t border-slate-50 uppercase">Base de datos de contactos</span>
          </div>

          {/* 6. Comprobantes NCF DGII */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-medium shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Comprobantes NCF DGII</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Emisión legal de secuenciales B01, B02, B14 y B15 para la República Dominicana con exportación directa a 606 y 607.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide block pt-2 border-t border-slate-50 uppercase">Normativa fiscal R.D.</span>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
