import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Apple, MonitorSmartphone, Laptop } from 'lucide-react';

interface LandingHeroProps {
  onRegisterClick: () => void;
}

export function LandingHero({ onRegisterClick }: LandingHeroProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showPwaInstructions, setShowPwaInstructions] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: ["El Futuro de la", "facturación totalmente gratis"],
      description: "Digitaliza la emisión de facturas fiscales, control de inventarios activos, cajas y almacenes sin pagar licencias costosas ni mensualidades. ¡El software premium que tu negocio dominicano merece, libre para siempre!",
      image: "/facturadomockup.png",
      badges: ["NCF Válido", "Multi-dispositivo", "Control de Gastos", "Reportes DGII"]
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
            alt="Promoción Especial FacturaDo - Tu software contable en República Dominicana con NCF" 
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

              {/* Slider Controls */}
              <div className="flex justify-center lg:justify-start gap-2 mt-6 z-10 w-full">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-sky-600' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                    aria-label={`Ir a diapositiva ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Hero Bottom Visuals - Dashboard Image */}
            <div className="w-full lg:w-[540px] xl:w-[620px] shrink-0 z-10 flex justify-center lg:justify-end relative mt-6 lg:mt-0">
              <div className="absolute inset-0 bg-sky-200/30 rounded-full blur-3xl transform rotate-3 -z-10" />
              <motion.div className="relative w-full drop-shadow-xl">
                <motion.img 
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  src={heroSlides[currentSlide].image} 
                  alt="FacturaDo Dashboard" 
                  onClick={() => setIsLightboxOpen(true)}
                  fetchPriority="high"
                  loading="eager"
                  className="w-full h-auto max-h-[360px] sm:max-h-[420px] object-contain rounded-xl sm:rounded-2xl shadow-xl ring-1 ring-slate-900/5 cursor-pointer hover:opacity-95 transition-opacity"
                />
              </motion.div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
              {isLightboxOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm cursor-pointer"
                    onClick={() => setIsLightboxOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    className="relative z-10 w-full max-w-7xl max-h-full flex items-center justify-center"
                  >
                    <button 
                      onClick={() => setIsLightboxOpen(false)}
                      className="absolute -top-12 right-0 text-white hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <X className="w-8 h-8" />
                    </button>
                    <img 
                      src="/facturadomockup.png" 
                      alt="FacturaDo Dashboard Fullscreen" 
                      className="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                    />
                  </motion.div>
                </div>
              )}

              {showPwaInstructions && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm cursor-pointer"
                    onClick={() => setShowPwaInstructions(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-medium text-slate-900 font-heading">Instalar en tu dispositivo</h3>
                      <button 
                        onClick={() => setShowPwaInstructions(false)}
                        className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-6 text-left">
                      <div>
                        <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                          <Apple className="w-5 h-5" /> En iPhone / iPad (Safari)
                        </h4>
                        <ol className="text-sm text-slate-600 space-y-2 ml-7 list-decimal">
                          <li>Toca el botón <strong>Compartir</strong> (cuadrado con flecha hacia arriba) en la barra inferior.</li>
                          <li>Desliza hacia abajo y selecciona <strong>"Agregar a Inicio"</strong>.</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                          <MonitorSmartphone className="w-5 h-5" /> En Android (Chrome)
                        </h4>
                        <ol className="text-sm text-slate-600 space-y-2 ml-7 list-decimal">
                          <li>Toca el icono de <strong>Menú</strong> (tres puntos) arriba a la derecha.</li>
                          <li>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                          <Laptop className="w-5 h-5" /> En Computadora (Chrome/Edge)
                        </h4>
                        <p className="text-sm text-slate-600 ml-7">
                          Haz clic en el icono de instalación que aparece en el lado derecho de la <strong>barra de direcciones (URL)</strong> del navegador.
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowPwaInstructions(false)}
                      className="w-full mt-8 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-medium transition-colors"
                    >
                      Entendido
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>
    </>
  );
}
