import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Lightbulb, BarChart3, Heart, Rocket, ChevronRight } from 'lucide-react';

interface LandingPricingSectionProps {
  onRegisterClick: () => void;
}

export function LandingPricingSection({ onRegisterClick }: LandingPricingSectionProps) {
  return (
    <>
      {/* Diseñado para Emprendedores */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 sm:py-28 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-sky-300 text-xs font-medium uppercase tracking-widest px-4 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Para Emprendedores
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium tracking-tight leading-tight">
                  Diseñado para <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">emprendedores</span> dominicanos
                </h2>
                <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed">
                  No necesitas ser contador ni experto en tecnología. FacturaDo simplifica la facturación fiscal para que tú te enfoques en vender y hacer crecer tu negocio.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Target, title: 'Enfócate en vender', desc: 'La facturación se resuelve en segundos. Tú dedícate a tus clientes.' },
                  { icon: Lightbulb, title: 'Sin curva de aprendizaje', desc: 'Interfaz intuitiva que cualquier miembro de tu equipo domina al instante.' },
                  { icon: BarChart3, title: 'Decisiones con datos', desc: 'Reportes de ventas, cuadre de caja y 606/607 listos para la DGII.' },
                  { icon: Heart, title: 'Soporte humano local', desc: 'Asistencia en español por WhatsApp cuando lo necesites.' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex gap-4 items-start group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/15 transition-colors">
                      <item.icon className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={onRegisterClick}
                className="px-7 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl font-medium text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-0.5 duration-150 flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Regístrate ahora
              </button>
            </div>

            {/* Right Column - Image Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-end w-full"
            >
              <img 
                src="https://res.cloudinary.com/dap38hi9l/image/upload/v1782018933/banner4x4_wntjic.png" 
                alt="Beneficios para emprendedores: 100% Gratis, Registro en 2 mins, Acceso 24/7 y cero cuotas" 
                className="w-full max-w-md lg:max-w-full h-auto object-contain rounded-3xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Business Niches Select */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 font-heading">Diseñado para todo tipo de comercio en R.D.</h2>
            <p className="text-sm sm:text-base text-slate-500">FacturaDo es flexible y está adaptado para acomodar las necesidades comerciales locales.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left font-sans">
            {/* Gastronómico */}
            <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-slate-800 uppercase tracking-wide">Gastronomía</h3>
                <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                  <li>• Restaurantes y Pizzerías</li>
                  <li>• Cafeterías y Reposterías</li>
                  <li>• Bares y Foodtrucks Dominicanos</li>
                </ul>
              </div>
              <button onClick={onRegisterClick} className="text-xs text-sky-600 font-medium flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
              </button>
            </div>

            {/* Comercio */}
            <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-slate-800 uppercase tracking-wide">Comercios</h3>
                <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                  <li>• Tiendas de Ropa y Calzado</li>
                  <li>• Ferreterías y Constructoras</li>
                  <li>• Farmacias y Tiendas de Celulares</li>
                </ul>
              </div>
              <button onClick={onRegisterClick} className="text-xs text-sky-600 font-medium flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
              </button>
            </div>

            {/* Servicios */}
            <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-slate-800 uppercase tracking-wide">Servicios</h3>
                <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                  <li>• Consultorías Profesionales</li>
                  <li>• Clínicas y Salones de Estética</li>
                  <li>• Talleres mecánicos y Courier</li>
                </ul>
              </div>
              <button onClick={onRegisterClick} className="text-xs text-sky-600 font-medium flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
              </button>
            </div>

            {/* Mercados */}
            <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-slate-800 uppercase tracking-wide">Distribución / Retail</h3>
                <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                  <li>• Colmados y Minimarkets</li>
                  <li>• Repuestos e Importadoras</li>
                  <li>• Mayoristas y Suplidores</li>
                </ul>
              </div>
              <button onClick={onRegisterClick} className="text-xs text-sky-600 font-medium flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Totally Free style) */}
      <section id="planes" className="py-16 sm:py-24 bg-white border-b border-slate-100 text-center space-y-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-medium uppercase text-sky-700 block tracking-widest bg-sky-50 max-w-max mx-auto px-3.5 py-1 rounded-full border border-sky-100">Sin Suscripción • 100% Libre</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-medium text-slate-900 tracking-tight leading-none">FacturaDo es 100% Gratis para Todos</h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">Creemos en el desarrollo de las pymes dominicanas. Utiliza todos los módulos premium sin trucos de cobro ni límites de facturación.</p>
          </div>

          {/* Free Feature Bento Highlight */}
          <div className="bg-slate-50 border border-slate-200/60 p-8 sm:p-10 rounded-3xl max-w-4xl mx-auto shadow-sm space-y-8 text-left font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <span className="text-emerald-600 text-sm font-medium uppercase tracking-wider block">✔ Todo Incluido de Por Vida</span>
                  <h3 className="text-xl font-medium text-slate-950 font-heading">¿Cómo es posible?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Nuestra meta es facilitar la digitalización contable en República Dominicana. Automatiza tu facturación fiscal, controla tus inventarios y genera tus reportes 606/607 sin pagar licencias de software complejas.
                  </p>
                </div>

                <div className="space-y-3 font-semibold text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                    <span>Terminales de caja (POS) totalmente ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                    <span>Emisión integral de NCF (Crédito Fiscal, Consumo, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                    <span>Módulos analíticos completos de compras y ventas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                    <span>Generador automático de reportes formato 606 y 607</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 text-center space-y-6 shadow-sm">
                <div className="space-y-1">
                  <span className="text-5xl sm:text-6xl font-heading font-medium text-slate-900 tracking-tight block">RD$ 0</span>
                  <span className="text-xs font-medium text-slate-450 uppercase tracking-widest block">Cero mensualidades • Cero costos ocultos</span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onRegisterClick}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium rounded-2xl text-sm sm:text-base tracking-wide transition-all block text-center cursor-pointer uppercase shadow-sm h-14 flex items-center justify-center"
                  >
                    Crear Cuenta Gratis Ahora
                  </button>
                  <p className="text-xs text-slate-400 font-medium">Únete a cientos de comerciantes dominicanos que ya confían en nosotros</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
