import React from 'react';
import { LogoFacturaDo } from '../../core/LogoFacturaDo';

interface LandingFooterProps {
  onRegisterClick: () => void;
  onHelpClick: () => void;
  onTermsClick: () => void;
  onPrivacyClick: () => void;
}

export function LandingFooter({ onRegisterClick, onHelpClick, onTermsClick, onPrivacyClick }: LandingFooterProps) {
  return (
    <>
      {/* CTA Footer Form */}
      <section className="py-16 bg-[#1A2732] text-white text-center space-y-6">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-xl sm:text-2xl font-medium font-heading">Únete hoy a la comunidad de FacturaDo</h2>
          <p className="text-xs text-white/70">Eleve el control financiero de su negocio dominicano con la plataforma de mayor crecimiento local.</p>
          <div className="pt-2">
            <button
              onClick={onRegisterClick}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs sm:text-sm font-medium uppercase rounded-xl shadow-lg cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
            >
              Registrar mi cuenta gratis
            </button>
          </div>
        </div>
      </section>

      {/* Mini Real Footer Section */}
      <footer className="bg-neutral-900 text-neutral-400 py-10 text-xs border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <LogoFacturaDo className="h-6 w-auto brightness-0 invert mx-auto md:mx-0" />
            <p className="text-[11px] text-neutral-500">Simplificando las operaciones tributarias dominicanas.</p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-neutral-200 block uppercase text-[10px] tracking-wider mb-2">Producto</span>
            <span className="block">Facturación Clásica</span>
            <button onClick={onHelpClick} className="block text-left text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 text-xs cursor-pointer mx-auto md:mx-0 outline-none pb-0.5 font-sans">
              Centro de Ayuda
            </button>
            <span className="block">Reporterías DGII (606, 607)</span>
            <span className="block">Puntos de Ventas (Cafés/Retail)</span>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-neutral-200 block uppercase text-[10px] tracking-wider mb-2">Legal</span>
            {/* Términos — modal + href para SEO */}
            <button
              type="button"
              onClick={onTermsClick}
              className="block text-left text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 text-xs cursor-pointer mx-auto md:mx-0 outline-none"
            >
              Términos y Condiciones
            </button>
            <a
              href="/terminos"
              onClick={(e) => { e.preventDefault(); onTermsClick(); }}
              className="block text-left text-neutral-500 hover:text-neutral-300 text-[10px] cursor-pointer mx-auto md:mx-0 no-underline"
              rel="nofollow"
            >
              /terminos
            </a>
            {/* Privacidad — modal + href para SEO */}
            <button
              type="button"
              onClick={onPrivacyClick}
              className="block text-left text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 text-xs cursor-pointer mx-auto md:mx-0 outline-none py-1"
            >
              Políticas de Uso y Privacidad
            </button>
            <a
              href="/privacidad"
              onClick={(e) => { e.preventDefault(); onPrivacyClick(); }}
              className="block text-left text-neutral-500 hover:text-neutral-300 text-[10px] cursor-pointer mx-auto md:mx-0 no-underline"
              rel="nofollow"
            >
              /privacidad
            </a>
          </div>

        </div>
        <div className="text-center pt-8 mt-8 border-t border-neutral-800 text-[10px] text-neutral-600 font-sans">
          &copy; {new Date().getFullYear()} FacturaDo. Sincronizado fiscalmente para República Dominicana. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}
