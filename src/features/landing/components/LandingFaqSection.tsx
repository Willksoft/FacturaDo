import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import CompetitorComparison from '../../auth/CompetitorComparison';

interface LandingFaqSectionProps {
  onRegisterClick: () => void;
}

export function LandingFaqSection({ onRegisterClick }: LandingFaqSectionProps) {
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true
  });

  const toggleFaq = (idx: number) => {
    setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <>
      {/* Social Testimonials Block */}
      <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="testimonios" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-medium font-heading text-slate-900 tracking-tight leading-none">Historias de Éxito Locales</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-normal">Miles de comerciantes dominicanos respaldan la velocidad de FacturaDo para automatizar su administración.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4 font-sans hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="Carlos Rodriguez" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <span className="text-xs font-medium block text-slate-900 leading-none">Carlos Rodríguez</span>
                  <span className="text-[10px] text-slate-400 block leading-none mt-1">Ferretería El Canal SRL, Santo Domingo</span>
                </div>
              </div>
              <p className="text-xs text-slate-650 italic leading-relaxed">
                "Antes perdía preciadas horas tabulando las compras de mis proveedores. FacturaDo nos ayudó a generar los reportes mensuales de la DGII en un solo clic."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4 font-sans hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="Ana Herrera" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <span className="text-xs font-medium block text-slate-900 leading-none">Ana M. Herrera</span>
                  <span className="text-[10px] text-slate-400 block leading-none mt-1">Salón & Estética Glamour, Santiago</span>
                </div>
              </div>
              <p className="text-xs text-slate-650 italic leading-relaxed">
                "Tener el POS en la tablet nos libera de cables molestos. El cliente recibe su recibo por correo al instante y nosotros cuadramos cajas sin fallar."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4 font-sans hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" alt="Joel Almonte" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <span className="text-xs font-medium block text-slate-900 leading-none">Joel Almonte</span>
                  <span className="text-[10px] text-slate-400 block leading-none mt-1">Súper Colmado El Sol, La Romana</span>
                </div>
              </div>
              <p className="text-xs text-slate-650 italic leading-relaxed">
                "En República Dominicana es mandatorio cumplir con la validación de RNC y cédulas de clientes de forma segura. FacturaDo lo hace automático."
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Importación Masiva Universal y Migración desde Otros Sistemas */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Migración e Importación Inteligente
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium font-heading text-white tracking-tight leading-tight">
              Importa tus Productos, Clientes, Facturas y Cotizaciones desde Cualquier Sistema
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              ¿Vienes de <strong>Alegra, QuickBooks, Cashflow, Odoo, Zoho, Sage, Softland</strong> o archivos Excel personalizados? 
              Nuestro motor lee directamente archivos <code>.xlsx</code>, <code>.csv</code>, <code>.xml</code> o <code>.txt</code> sin reestructurar datos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-medium">1</div>
              <h3 className="text-base font-medium text-white">Compatibilidad Total</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reconoce encabezados en español e inglés: <em>RNC, Cédula, Razón Social, SKU, Precio de Venta, Tax ID, Qty On Hand</em> y más.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-medium">2</div>
              <h3 className="text-base font-medium text-white">Desinfección de RNCs</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Limpia guiones, puntos y espacios automáticamente. Clasifica entre Persona Física (11 dígitos) y Empresa (9 dígitos).
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-medium">3</div>
              <h3 className="text-base font-medium text-white">Monedas y Precios</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Detecta precios con símbolos monetarios (<code>RD$ 1,500.00</code> ➔ <code>1500</code>) y costos unitarios sin margen de error.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-medium">4</div>
              <h3 className="text-base font-medium text-white">Vista Previa & Algoritmo Fuzzy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verifica las columnas mapeadas y la vista previa de datos antes de importar miles de filas a tu base de datos PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CompetitorComparison />

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200 text-center space-y-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="space-y-2">
            <span className="text-sky-600 font-medium uppercase tracking-widest text-xs block">Respuestas Rápidas</span>
            <h2 className="text-xl sm:text-2xl font-medium font-heading text-slate-900 tracking-tight leading-none">Preguntas frecuentes sobre FacturaDo</h2>
            <p className="text-xs text-slate-400">Resolvemos las principales dudas sobre la integración fiscal dominicana y la facturación digital.</p>
          </div>

          <div className="space-y-3 text-left font-sans text-xs">
            
            {/* FAQ 1 */}
            <div className="bg-slate-50 border rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
              <button
                type="button"
                onClick={() => toggleFaq(0)}
                className="w-full flex items-center justify-between p-4 font-medium text-slate-800 hover:bg-slate-100 text-left outline-none gap-2 border-0 bg-transparent"
              >
                <span>¿Qué es FacturaDo y cómo funciona para declarar a la DGII?</span>
                <span className="font-medium text-slate-400 text-lg">{faqOpen[0] ? '−' : '+'}</span>
              </button>
              {faqOpen[0] && (
                <div className="px-4 pb-4 text-slate-500 leading-relaxed font-normal border-t border-slate-200/50 pt-3">
                  FacturaDo es una plataforma web y móvil para control administrative y fiscal. Le permite registrar sus facturas y registrar los tipos de comprobantes fiscales (B01, B02, B14, B15), para luego exportar directamente los archivos de texto requeridos por los formatos 606, 607 y 608 de la DGII Dominicana sin errores de numeración.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-slate-50 border rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
              <button
                type="button"
                onClick={() => toggleFaq(1)}
                className="w-full flex items-center justify-between p-4 font-medium text-slate-800 hover:bg-slate-100 text-left outline-none gap-2 border-0 bg-transparent"
              >
                <span>¿Requiere conexión a internet activa para facturar en el POS?</span>
                <span className="font-medium text-slate-400 text-lg">{faqOpen[1] ? '−' : '+'}</span>
              </button>
              {faqOpen[1] && (
                <div className="px-4 pb-4 text-slate-500 leading-relaxed font-normal border-t border-slate-200/50 pt-3">
                  Sí. Para validar los nombres fiscales de los clientes en tiempo real contra la base de datos oficial del padrón DGII, el sistema requiere conexión a internet estable. De lo contrario, registrará la factura de forma normal del padrón clásico offline.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-slate-50 border rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
              <button
                type="button"
                onClick={() => toggleFaq(2)}
                className="w-full flex items-center justify-between p-4 font-medium text-slate-800 hover:bg-slate-100 text-left outline-none gap-2 border-0 bg-transparent"
              >
                <span>¿Es seguro guardar mi información contable e inventarios en la nube?</span>
                <span className="font-medium text-slate-400 text-lg">{faqOpen[2] ? '−' : '+'}</span>
              </button>
              {faqOpen[2] && (
                <div className="px-4 pb-4 text-slate-500 leading-relaxed font-normal border-t border-slate-200/50 pt-3">
                  Totalmente seguro. Utilizamos cifrado AES-256 en servidores de Google Cloud Run, garantizando copias de seguridad cada 2 horas para que nunca pierda su stock de productos o reportes históricos de cierre de caja.
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Testimonios Extra Section */}
      <section id="casos-exito" className="py-16 sm:py-24 bg-white border-t border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl -z-10 -mr-20 -mt-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-amber-600 font-medium uppercase tracking-widest text-xs sm:text-sm block">Casos de Éxito</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-medium text-slate-900 tracking-tight">Comercios que confían en FacturaDo</h2>
            <p className="text-base sm:text-lg text-slate-500">
              No tome solo nuestra palabra. Vea lo que dueños de negocios dominicanos opinan de nuestra plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex gap-1 text-amber-400 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-700 italic mb-6">"Poder facturar y generar los reportes de la DGII en un solo clic me ahorra días de trabajo y pago de igualas complejas. Mi negocio está más organizado que nunca."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">C</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Carlos Méndez</p>
                  <p className="text-xs text-slate-500">Ferretería Méndez, Santiago</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex gap-1 text-amber-400 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-700 italic mb-6">"El módulo de POS es rapidísimo y el cuadre de caja al final del día ahora es exacto. Saber que todo está guardado en la nube me da mucha tranquilidad."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-medium">M</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">María Rosario</p>
                  <p className="text-xs text-slate-500">Boutique MR, Distrito Nacional</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex gap-1 text-amber-400 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-700 italic mb-6">"Antes gastaba miles de pesos en sistemas lentos de escritorio. FacturaDo no solo es más moderno y fácil de usar, ¡sino que no pago licencias!"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-medium">J</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">José Pimentel</p>
                  <p className="text-xs text-slate-500">Super Colmado José, La Romana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
