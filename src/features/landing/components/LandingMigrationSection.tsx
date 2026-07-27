import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, ExternalLink, Landmark, Database, ArrowRight } from 'lucide-react';

interface LandingMigrationSectionProps {
  onRegisterClick: () => void;
}

export function LandingMigrationSection({ onRegisterClick }: LandingMigrationSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-20 sm:py-28 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white relative z-20 overflow-hidden border-t border-slate-800"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-indigo-400" />
            Migración sin Esfuerzo en 1 Clic
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-white tracking-tight">
            ¿Vienes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400">WooCommerce, Shopify, Alegra o QuickBooks?</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Transfiere automáticamente todo tu catálogo de productos, existencias de inventario, clientes con RNC y comprobantes NCF a FacturaDo sin perder datos ni digitar a mano.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 1. WooCommerce */}
          <div className="bg-slate-800/60 border border-purple-500/30 rounded-3xl p-6 hover:border-purple-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <img src="/logosbrands/Woo_logo_color.svg" alt="WooCommerce WordPress" className="h-11 sm:h-13 w-auto max-w-[160px] object-contain" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://woocommerce.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors inline-flex items-center gap-1.5">
                  WooCommerce / WordPress <ExternalLink className="w-3.5 h-3.5 text-purple-400 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Importa productos, SKU, precios regulares y de oferta, existencias de stock y categorías de tu tienda WordPress en formato CSV o Excel.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                E-Commerce Listo ✓
              </span>
              <a href="https://woocommerce.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                woocommerce.com
              </a>
            </div>
          </div>

          {/* 2. Shopify */}
          <div className="bg-slate-800/60 border border-emerald-500/30 rounded-3xl p-6 hover:border-emerald-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <img src="/logosbrands/shopify_monotone_white.svg" alt="Shopify Store" className="h-11 sm:h-13 w-auto max-w-[160px] object-contain" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5">
                  Shopify Store <ExternalLink className="w-3.5 h-3.5 text-emerald-400 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Reconoce la estructura nativa exportada de Shopify (<code className="text-emerald-300">Title</code>, <code className="text-emerald-300">Variant SKU</code>, <code className="text-emerald-300">Variant Price</code>) y la convierte en comprobantes NCF.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-50/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Sincronización Total ✓
              </span>
              <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                shopify.com
              </a>
            </div>
          </div>

          {/* 3. Alegra */}
          <div className="bg-slate-800/60 border border-emerald-400/30 rounded-3xl p-6 hover:border-emerald-400/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform overflow-visible">
                <img src="/logosbrands/alegra-seeklogo.svg" alt="Alegra Dominicana" className="h-14 sm:h-16 w-auto max-w-[200px] object-contain scale-110 origin-left" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://www.alegra.com/dominicana/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5">
                  Alegra República Dominicana <ExternalLink className="w-3.5 h-3.5 text-emerald-400 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Migra de forma directa tu catálogo de ítems, clientes con RNC/Cédula y listas de precios exportadas de Alegra.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Soporte Nativo RD ✓
              </span>
              <a href="https://www.alegra.com/dominicana/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                alegra.com/dominicana
              </a>
            </div>
          </div>

          {/* 4. Cashflow */}
          <div className="bg-slate-800/60 border border-amber-500/30 rounded-3xl p-6 hover:border-amber-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <img src="/logosbrands/cahsflow.svg" alt="Cashflow Software" className="h-11 sm:h-13 w-auto max-w-[160px] object-contain" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://www.cashflow.do" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5">
                  Cashflow Software <ExternalLink className="w-3.5 h-3.5 text-amber-400 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Carga archivos exportados de Cashflow Dominicano con detección automática de RNCs, NCFs e inventarios.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Formato Dominicano ✓
              </span>
              <a href="https://www.cashflow.do" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                cashflow.do
              </a>
            </div>
          </div>

          {/* 5. QuickBooks */}
          <div className="bg-slate-800/60 border border-blue-500/30 rounded-3xl p-6 hover:border-blue-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <img src="/logosbrands/descarga.svg" alt="QuickBooks Intuit" className="h-11 sm:h-13 w-auto max-w-[160px] object-contain" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://quickbooks.intuit.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors inline-flex items-center gap-1.5">
                  QuickBooks (Online / Desktop) <ExternalLink className="w-3.5 h-3.5 text-blue-400 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Sube reportes CSV de Customers, Vendor List e Item List de QuickBooks sin perder referencias contables.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                Líder Mundial ✓
              </span>
              <a href="https://quickbooks.intuit.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                quickbooks.intuit.com
              </a>
            </div>
          </div>

          {/* 6. Odoo */}
          <div className="bg-slate-800/60 border border-purple-400/30 rounded-3xl p-6 hover:border-purple-400/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <img src="/logosbrands/odoo-official-partner.png" alt="Odoo ERP" className="h-12 sm:h-14 w-auto max-w-[160px] object-contain" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://www.odoo.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors inline-flex items-center gap-1.5">
                  Odoo ERP <ExternalLink className="w-3.5 h-3.5 text-purple-300 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Mapeo instantáneo para exportaciones de Odoo ERP (partner name, internal reference, unit price, stock value).
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                Open Source ERP ✓
              </span>
              <a href="https://www.odoo.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                odoo.com
              </a>
            </div>
          </div>

          {/* 7. Zoho */}
          <div className="bg-slate-800/60 border border-rose-500/30 rounded-3xl p-6 hover:border-rose-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <img src="/logosbrands/zoho-logo-web.svg" alt="Zoho Books CRM" className="h-11 sm:h-13 w-auto max-w-[160px] object-contain" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://www.zoho.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors inline-flex items-center gap-1.5">
                  Zoho CRM & Books <ExternalLink className="w-3.5 h-3.5 text-rose-400 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Compatible con exportaciones de contactos, inventario y cuentas de Zoho Books y Zoho CRM.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                Sincronización CRM ✓
              </span>
              <a href="https://www.zoho.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1">
                zoho.com
              </a>
            </div>
          </div>

          {/* 8. Sage & Softland */}
          <div className="bg-slate-800/60 border border-cyan-500/30 rounded-3xl p-6 hover:border-cyan-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <Landmark className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">
                <a href="https://www.sage.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5">
                  Sage / Softland ERP <ExternalLink className="w-3.5 h-3.5 text-cyan-400 opacity-70" />
                </a>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Soporta plantillas empresariales de Sage 50 / Softland con desinfección automática de RNC y monedas.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Grado Empresarial ✓
              </span>
              <a href="https://www.sage.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                sage.com
              </a>
            </div>
          </div>

          {/* 9. Excel Libre */}
          <div className="bg-slate-800/60 border border-slate-500/30 rounded-3xl p-6 hover:border-slate-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-16 flex items-center mb-4 group-hover:scale-105 transition-transform">
                <Database className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 font-heading">Excel, CSV o XML Libre</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Sube cualquier hoja de cálculo. Nuestro motor con inteligencia de sinónimos empareja tus columnas automáticamente.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[11px] font-medium text-slate-300 bg-slate-500/10 px-2.5 py-1 rounded-full border border-slate-500/20">
                Plantillas Libre ✓
              </span>
              <span className="text-[11px] text-slate-400">.csv / .xlsx / .xml</span>
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-950 border border-indigo-500/50 rounded-3xl p-6 flex flex-col justify-between text-center sm:text-left md:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-medium text-white mb-2 font-heading">¿Listo para migrar tu negocio a FacturaDo?</h3>
                <p className="text-xs text-indigo-200 leading-relaxed max-w-2xl">
                  Prueba nuestro Asistente Inteligente de Migración en 4 pasos con mapeo automático de columnas e inspección de RNCs en vivo.
                </p>
              </div>
              <button
                onClick={onRegisterClick}
                className="py-3 px-6 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-medium text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                Probar Asistente de Migración <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
