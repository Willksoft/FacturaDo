import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Apple, MonitorSmartphone, Laptop, Users, ShieldCheck, FileText, Calculator } from 'lucide-react';

interface LandingHeroProps {
  onRegisterClick: () => void;
}

export function LandingHero({ onRegisterClick }: LandingHeroProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showPwaInstructions, setShowPwaInstructions] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: ["El Futuro de la", "facturación y nómina gratis"],
      description: "Digitaliza la emisión de facturas fiscales NCF, nómina empresarial Ley 16-92, inventarios activos, cajas y almacenes sin pagar licencias costosas ni mensualidades. ¡El software premium que tu negocio dominicano merece, libre para siempre!",
      image: "/facturadomockup.png",
      badges: ["NCF Válido", "Nómina Ley 16-92", "Reportes TSS & DGII", "Cajas & Almacenes"]
    },
    {
      title: ["Nómina Empresarial & R.H.", "100% ley 16-92, tss e ir-3"],
      description: "Gestión 360° de plantilla laboral, generación automática de contratos de trabajo, cálculo de deducciones AFP/ARS, retenciones ISR DGII, prestaciones laborales (cesantía/preaviso) e impresión en lote de volantes de pago formato cheque.",
      image: "/facturadomockup.png",
      badges: ["Ley 16-92", "Reporte TXT TSS", "IR-3 & IR-13 DGII", "Volantes Cheque 3xPágina", "Contratos PDF"]
    },
    {
      title: ["Gestión Inteligente", "de clientes y proveedores"],
      description: "Mantén un registro detallado de todas tus operaciones. Administra cuentas por cobrar, historial de transacciones y mejora las relaciones comerciales de tu negocio con información centralizada.",
      image: "/facturadomockup.png",
      badges: ["Directorio Central", "Cuentas por Cobrar", "Historial Completo", "Fácil Acceso"]
    },
    {
      title: ["Control Total", "de tu inventario"],
      description: "Administra múltiples almacenes, recibe alertas de bajo stock y haz inventarios físicos con facilidad. Toma decisiones basadas en datos reales y maximiza tus ganancias.",
      image: "/facturadomockup.png",
      badges: ["Múltiples Almacenes", "Alertas de Stock", "Kardex Detallado", "Ajustes Rápidos"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <>
      {/* Promotional Banner */}
      <div className="w-full bg-slate-50 pt-24 pb-4 px-4 sm:px-6 lg:px-8 flex justify-center border-b border-slate-100/50">
        <button 
          onClick={onRegisterClick} 
          className="cursor-pointer outline-none border-none bg-transparent p-0 block w-full max-w-7xl hover:opacity-95 transition-opacity"
          type="button"
        >
          <img 
            src="https://res.cloudinary.com/dap38hi9l/image/upload/f_auto,q_auto/v1782018265/banner_2_znlyym.png" 
            alt="Promoción Especial FacturaDo - Tu software contable y de nómina en República Dominicana con NCF y TSS" 
            title="Promoción Exclusiva FacturaDo"
            fetchPriority="high"
            loading="eager"
            className="w-full h-auto object-contain rounded-2xl shadow-sm border border-slate-200/50"
          />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-white pt-10 border-b border-slate-100">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
            
            {/* Hero Top Info */}
            <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left relative min-h-[260px] sm:min-h-[220px]">
              
              <div className="relative w-full flex-1 min-h-[220px] sm:min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col items-center lg:items-start w-full"
                  >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-slate-900 tracking-tight leading-tight mb-4">
                      {heroSlides[currentSlide].title[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 block sm:inline">{heroSlides[currentSlide].title[1]}</span>
                    </h1>
                    
                    <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mb-6">
                      {heroSlides[currentSlide].description}
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-5 text-slate-700 font-medium text-xs sm:text-sm">
                      {heroSlides[currentSlide].badges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-medium text-xs border border-emerald-100 shrink-0">✓</span>
                          <span>{badge}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider dots */}
              <div className="flex items-center gap-2 mt-6 mb-6">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-sky-600' : 'w-2 bg-slate-200'}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-600 text-white font-medium text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-3 group"
                >
                  <span>Probar FacturaDo Ahora Gratis</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => setShowPwaInstructions(true)}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-black text-white font-medium text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <MonitorSmartphone className="w-4 h-4 text-sky-400" />
                  <span>Instalar App Móvil / PC</span>
                </button>
              </div>
            </div>

            {/* Hero Image Mockup */}
            <div className="w-full lg:w-[650px] xl:w-[760px] relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
                <img
                  src="/facturadomockup.png"
                  alt="FacturaDo Dashboard de Contabilidad, Nómina y NCF"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                  <span className="px-4 py-2 bg-slate-900/80 text-white rounded-full text-xs font-medium backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Haz clic para ampliar vista
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
