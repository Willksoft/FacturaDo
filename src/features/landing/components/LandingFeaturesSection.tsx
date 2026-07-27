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
  Lock
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
          <h2 className="text-3xl sm:text-4xl font-heading font-medium text-slate-900 tracking-tight">Todo lo que tu comercio necesita</h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
            Diseñado para simplificar tu operación comercial y fiscal sin complicaciones financieras ni barreras tecnológicas.
          </p>
        </div>

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
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Directorio Inteligente</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Registra clientes y proveedores con RNC/Cédula y gestiona cuentas por cobrar de manera centralizada y ágil.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide block pt-2 border-t border-slate-50 uppercase">Cuentas por cobrar integradas</span>
          </div>

          {/* 6. Formatos 606 y 607 DGII */}
          <div className="bg-white border border-emerald-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-medium shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Formatos 606 y 607 DGII</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Genera automáticamente los formatos exigidos por la DGII listos para enviar a la oficina virtual, eliminando el trabajo manual.
              </p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-medium block text-center uppercase">100% libre de errores</span>
          </div>

          {/* 7. Conciliación Bancaria Automática */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-medium shrink-0">
                <CreditCard className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Conciliación Bancaria Automática</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Importa estados de cuenta CSV/Excel de Banreservas, Banco Popular o BHD y realiza el cuadre contable automático de depósitos y pagos.
              </p>
            </div>
            <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-medium block text-center uppercase">Popular, BHD, Banreservas</span>
          </div>

          {/* 8. Descarga Directa TXT para DGII */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-medium shrink-0">
                <Download className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Archivos TXT para Oficina Virtual</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Descarga en 1-clic archivos en texto plano (.txt) ajustados exactamente a la plantilla de carga masiva de la DGII (606, 607 y 608).
              </p>
            </div>
            <span className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-medium block text-center uppercase">Exportación directa .TXT</span>
          </div>

          {/* 9. Cierre de Periodo Fiscal Automático */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-medium shrink-0">
                <RefreshCw className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Cierre de Periodo Fiscal 1-Clic</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Cierra periodos mensuales o anuales en un clic. Transfiere los saldos de Ingresos y Gastos a la cuenta de Utilidades Acumuladas del Patrimonio.
              </p>
            </div>
            <span className="text-xs text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded font-medium block text-center uppercase">Cierres Mensuales y Anuales</span>
          </div>

          {/* 10. Asistente IA Copilot Tributario */}
          <div className="bg-white border border-indigo-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-medium shrink-0">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Asistente IA Copilot Fiscal</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Inteligencia Artificial integrada para responder dudas de normativas fiscales dominicanas, retenciones de ITBIS y sugerencias de categorización.
              </p>
            </div>
            <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-medium block text-center uppercase">IA Especializada en DGII</span>
          </div>

          {/* 11. Alertas & Recordatorios Fiscales IT-1 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-medium shrink-0">
                <Clock className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Alertas Fiscales IT-1 en Vivo</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Alertas inteligentes en el Dashboard que recuerdan el vencimiento del pago del IT-1 (los días 20 de cada mes) y fechas límite de envío.
              </p>
            </div>
            <span className="text-xs text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded font-medium block text-center uppercase">Recordatorio de Vencimientos</span>
          </div>

          {/* 12. Vendedores y Comisiones */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-medium shrink-0">
                <UserPlus className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Comisiones de Venta</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Asigna comisiones a tus vendedores por factura o recaudo de cobro, calcula incentivos automáticamente y mide el desempeño comercial.
              </p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-medium block text-center uppercase">Control de Vendedores</span>
          </div>

          {/* 13. Multialmacén y Transferencias */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-medium shrink-0">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Multialmacén y Sucursales</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Gestiona mercancía en múltiples depósitos o sucursales, autorizando transferencias internas de inventario con auditoría de movimientos.
              </p>
            </div>
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded font-medium block text-center uppercase">Transferencias de Stock</span>
          </div>

          {/* 14. POS y Cuadre de Turnos */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 font-medium shrink-0">
                <Receipt className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">POS y Tickets Térmicos</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Módulo de Punto de Venta optimizado para facturación ultra-rápida, apertura/cierre de turnos de caja e impresión en impresoras 80mm/58mm.
              </p>
            </div>
            <span className="text-xs text-cyan-700 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded font-medium block text-center uppercase">Facturación Rápida POS</span>
          </div>

          {/* 15. Seguridad Biometrica Passkeys y Audit Logs */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-medium shrink-0">
                <Lock className="w-5 h-5" />
              </span>
              <h3 className="text-base font-medium text-slate-900 tracking-wide">Passkeys Biométricas & Auditoría</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Inicio de sesión biométrico con Huella/FaceID vía WebAuthn, 2FA con App Autenticadora y registro histórico detallado de auditoría (Audit Logs).
              </p>
            </div>
            <span className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium block text-center uppercase">Máxima Seguridad Biométrica</span>
          </div>

        </div>

        <div className="pt-4">
          <button
            onClick={onRegisterClick}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-base transition-all cursor-pointer shadow-md hover:-translate-y-0.5 duration-150"
          >
            Comenzar gratis ahora
          </button>
        </div>
      </div>
    </motion.section>
  );
}
