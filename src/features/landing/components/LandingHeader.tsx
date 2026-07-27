import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoFacturaDo } from '../../core/LogoFacturaDo';
import { X, Menu } from 'lucide-react';

interface LandingHeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHelpClick: () => void;
}

export function LandingHeader({ isLoggedIn, onLoginClick, onRegisterClick, onHelpClick }: LandingHeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Desktop Logo */}
          <div className="hidden sm:block">
            <LogoFacturaDo className="h-9 w-auto" />
          </div>
          {/* Mobile Logo using favicon */}
          <div className="block sm:hidden flex items-center gap-2">
            <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8 shrink-0 object-contain" referrerPolicy="no-referrer" />
            <span className="text-lg font-medium tracking-tight text-slate-900 font-sans">FacturaDo</span>
          </div>
        </div>

        {/* Desktop Nav Actions */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 text-[13px] xl:text-sm font-semibold text-slate-600">
          <button onClick={() => navigate('/blog')} className="hover:text-sky-600 transition-colors cursor-pointer font-semibold bg-transparent border-0 p-0 text-[13px] xl:text-sm whitespace-nowrap">Blog</button>
          <a href="#funcionalidades" className="hover:text-sky-600 transition-colors whitespace-nowrap">Funcionalidades</a>
          <a href="#testimonios" className="hover:text-sky-600 transition-colors whitespace-nowrap">Opiniones</a>
          <button onClick={onHelpClick} className="hover:text-sky-600 transition-colors cursor-pointer font-semibold bg-transparent border-0 p-0 text-[13px] xl:text-sm whitespace-nowrap">Centro de Ayuda</button>
          <a href="#faq" className="hover:text-sky-600 transition-colors whitespace-nowrap">Preguntas Frecuentes</a>
        </nav>

        {/* Desktop CTA actions */}
        <div className="hidden md:flex items-center gap-2 xl:gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="whitespace-nowrap px-4 xl:px-6 py-2.5 text-[13px] xl:text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Ir al Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="whitespace-nowrap px-4 xl:px-5 py-2.5 text-[13px] xl:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="whitespace-nowrap px-4 xl:px-6 py-2.5 text-[13px] xl:text-sm font-medium bg-slate-900 hover:bg-black text-white rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Registrarse Gratis
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-slate-200"
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg"
          >
            <div className="px-5 py-6 space-y-4 flex flex-col text-left">
              <a 
                href="#funcionalidades" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100"
              >
                Funcionalidades
              </a>
              <a 
                href="#testimonios" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100"
              >
                Opiniones
              </a>
              <button 
                onClick={() => { setMobileMenuOpen(false); navigate('/blog'); }} 
                className="text-left text-sm font-medium text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100 cursor-pointer w-full"
              >
                Blog
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onHelpClick(); }} 
                className="text-left text-sm font-medium text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100 cursor-pointer w-full"
              >
                Centro de Ayuda
              </button>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2.5"
              >
                Preguntas Frecuentes
              </a>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                {isLoggedIn ? (
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                    className="col-span-2 w-full py-3 text-xs font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-md cursor-pointer text-center"
                  >
                    Ir al Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                      className="w-full py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200 text-center"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onRegisterClick(); }}
                      className="w-full py-3 text-xs font-medium bg-slate-900 hover:bg-black text-white rounded-xl transition-all shadow-md cursor-pointer text-center"
                    >
                      Registrarse
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
