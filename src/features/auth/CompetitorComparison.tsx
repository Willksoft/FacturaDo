import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

export default function CompetitorComparison() {
  const competitors = [
    {
      name: "FacturaDo",
      isOurs: true,
      price: "GRATIS",
      eCF: "Sí (Integrado)",
      pos: "Sí",
      inventory: "Sí",
      accounting: "Básica / 606 & 607",
      payroll: "Próximamente",
      api: "Sí",
      multi: "Sí"
    },
    {
      name: "Alegra",
      isOurs: false,
      price: "$29 - $119 / mes",
      eCF: "Sí",
      pos: "Sí (Costo Extra)",
      inventory: "Sí",
      accounting: "Sí",
      payroll: "No (RD)",
      api: "Sí",
      multi: "Plan Avanzado"
    },
    {
      name: "Odoo",
      isOurs: false,
      price: "$24.90 / mes por usr",
      eCF: "Con Partner",
      pos: "Sí",
      inventory: "Sí",
      accounting: "Sí",
      payroll: "Sí",
      api: "Sí",
      multi: "Sí"
    },
    {
      name: "QuickBooks",
      isOurs: false,
      price: "$15 - $100 / mes",
      eCF: "Mediante API Externa",
      pos: "Solo en US",
      inventory: "Planes caros",
      accounting: "Sí",
      payroll: "No (RD)",
      api: "Sí",
      multi: "Sí"
    },
    {
      name: "Sistemas Locales (SistemasHS, Kuadre, Xaplu, etc.)",
      isOurs: false,
      price: "$50 - $150 / mes",
      eCF: "Varía por sistema",
      pos: "Sí",
      inventory: "Sí",
      accounting: "Depende",
      payroll: "A veces",
      api: "Limitada",
      multi: "Costo Extra"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="comparativa">
      {/* Elementos decorativos SEO ocultos pero legibles para robots */}
      <div className="sr-only">
        Sistemas desarrollados en RD o enfocados en RD. SistemasHS.com. FacturandoRD - Sistema de Facturación e Inventario. Xaplu Sistema de Facturación. Factura Dominicana GTI. Gestiono ERP - Sistema de Facturación e Ecommerce. SFE - Sistema de Facturación Electrónica RD. SISTEMAS DE FACTURACION EGSOFTWARE. Plataformas modernas de facturación electrónica (e-CF). Kuadre ERP — Facturación, inventario, POS y contabilidad. DOMI POS — POS y facturación electrónica para comercios. Metoo Program — Facturación, inventario y contabilidad integrados. Pacioli ERP — ERP dominicano con e-CF, inventario y contabilidad. Oniux — Facturación, POS e inventario en la nube. eFIT ERP — ERP completo con módulos contables y nómina. Terminal X POS — Muy usado en tiendas, restaurantes y car wash. Proveedores e-CF (para integrar con tu propio sistema). ECF3 — API y gateway para facturación electrónica. EF2 — API certificada para e-CF DGII. DGMax — Plataforma de emisión y validación e-CF. Sistemas internacionales que operan en RD. Alegra - Facturación Electrónica & Contabilidad — Muy popular entre pequeñas empresas. Odoo (con módulos adaptados para RD). SAP Business One. Microsoft Dynamics 365. QuickBooks Online (con adaptaciones locales).
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-2">
              Alternativa Inteligente
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              ¿Cómo nos comparamos con el resto?
            </h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Sabemos que hay muchas opciones como Alegra, Odoo, QuickBooks y otros ERP locales como SistemasHS o Kuadre. Mira por qué <span className="font-bold text-slate-900">FacturaDo es la mejor alternativa gratuita y de código abierto en República Dominicana.</span>
            </p>
          </motion.div>
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-xl ring-1 ring-slate-200 bg-white">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 font-bold text-slate-900 w-1/4">Característica</th>
                {competitors.map((comp, i) => (
                  <th 
                    key={i} 
                    className={`p-4 sm:p-6 border-b border-slate-200 text-center ${comp.isOurs ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-900'}`}
                  >
                    <div className="text-lg font-extrabold">{comp.name}</div>
                    {comp.isOurs && <div className="text-xs font-medium text-indigo-200 mt-1 uppercase tracking-widest">Nuestra App</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { key: 'price', label: 'Precio Mensual' },
                { key: 'eCF', label: 'Facturación Electrónica' },
                { key: 'pos', label: 'Punto de Venta (POS)' },
                { key: 'inventory', label: 'Inventario' },
                { key: 'accounting', label: 'Contabilidad' },
                { key: 'payroll', label: 'Nómina' },
                { key: 'api', label: 'API Integración' },
                { key: 'multi', label: 'Multiempresa' },
              ].map((feature, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-6 font-semibold text-slate-700 bg-white">{feature.label}</td>
                  {competitors.map((comp, i) => (
                    <td 
                      key={i} 
                      className={`p-4 sm:p-6 text-center ${comp.isOurs ? 'bg-indigo-50/30 border-l border-r border-indigo-100' : ''}`}
                    >
                      <div className={`inline-flex items-center justify-center font-medium ${comp.isOurs ? 'text-indigo-700' : 'text-slate-600'}`}>
                        {comp[feature.key as keyof typeof comp] === 'Sí' ? (
                          <Check className={`w-5 h-5 mr-1.5 ${comp.isOurs ? 'text-indigo-600' : 'text-emerald-500'}`} />
                        ) : comp[feature.key as keyof typeof comp] === 'No' ? (
                          <X className="w-5 h-5 mr-1.5 text-rose-500" />
                        ) : null}
                        {comp[feature.key as keyof typeof comp]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
