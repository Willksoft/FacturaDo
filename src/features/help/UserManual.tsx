import React, { useState } from 'react';
import { 
  BookOpen, 
  Settings, 
  Users, 
  Package, 
  FileText, 
  BarChart4, 
  CheckCircle2, 
  ChevronRight,
  Info,
  AlertTriangle,
  Calculator,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

type ManualSection = 'intro' | 'budget' | 'ecf' | 'payroll' | 'banking' | 'clients' | 'inventory' | 'invoicing' | 'reports';

export default function UserManual() {
  const [activeSection, setActiveSection] = useState<ManualSection>('intro');

  const menuItems: { id: ManualSection, icon: any, label: string, badge?: string }[] = [
    { id: 'intro', icon: Settings, label: 'Primeros Pasos' },
    { id: 'budget', icon: Calculator, label: 'Centro de Presupuestos', badge: 'Nuevo' },
    { id: 'ecf', icon: ShieldCheck, label: 'Facturación e-CF & MSeller', badge: 'DGII' },
    { id: 'payroll', icon: Users, label: 'Nómina TSS & ISR DGII', badge: 'Ley 16-92' },
    { id: 'banking', icon: RefreshCw, label: 'Conciliación Bancaria' },
    { id: 'clients', icon: Users, label: 'Directorio y Clientes' },
    { id: 'inventory', icon: Package, label: 'Inventario Avanzado' },
    { id: 'invoicing', icon: FileText, label: 'Facturación y Cotizaciones' },
    { id: 'reports', icon: BarChart4, label: 'Reportes y Dashboard' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4 font-sans" id="manual-usuario-completo">
      {/* SIDEBAR DE NAVEGACIÓN DEL MANUAL */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-2">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold mb-1">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Centro de Ayuda ERP
          </div>
          <p className="text-[11px] text-indigo-700 leading-tight">
            Manual de usuario interactivo y guía oficial de FacturaDo 2026.
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all text-xs font-bold cursor-pointer ${
                  isActive 
                    ? 'bg-neutral-900 text-white shadow-md' 
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 bg-white border border-neutral-200 rounded-3xl p-6 md:p-10 shadow-xs overflow-y-auto">
        
        {/* PRIMEROS PASOS */}
        {activeSection === 'intro' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Primeros Pasos con FacturaDo</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Bienvenido al manual oficial. Para comenzar a facturar de manera profesional, es vital configurar correctamente la identidad de tu negocio y tus secuencias fiscales.
            </p>

            <div className="grid gap-4 mt-6">
              <Card className="border-neutral-200 shadow-none bg-neutral-50/50">
                <CardHeader>
                  <CardTitle className="text-sm">1. Configuración del Negocio</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 space-y-2">
                  <p>Dirígete a <strong>Configuración del Sistema {'>'} Datos de la Empresa</strong> para establecer el nombre legal, RNC y logotipo de tu negocio.</p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 shadow-none bg-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-sm text-emerald-900">2. Timbres Fiscales (NCF & e-CF)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-emerald-800 space-y-2">
                  <p>Navega a <strong>Secuencias NCF</strong> para definir tus talonarios B01, B02, B14, B15 o activa el módulo e-CF para comprobantes electrónicos firmados con certificado .p12.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* CENTRO DE PRESUPUESTOS (NUEVO) */}
        {activeSection === 'budget' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold w-fit border border-indigo-100">
              <Calculator className="w-4 h-4" /> Módulo Universal de Costeo
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Centro de Presupuestos</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              El Centro de Presupuestos centraliza recursos, plantillas por industria y carpetas de proyectos para calcular cotizaciones de alta precisión sin fórmulas escritas a mano.
            </p>

            <div className="space-y-4">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader className="bg-neutral-50/50 pb-3">
                  <CardTitle className="text-sm font-extrabold text-neutral-900">1. Tipos de Cálculos Soportados</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-xs text-neutral-600 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-150">
                      <strong>📐 Área ($m^2$)</strong>: Ancho x Alto x Cantidad (Mermas % de corte).
                    </div>
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-150">
                      <strong>📦 Volumen ($m^3$)</strong>: Ancho x Largo x Alto x Cantidad.
                    </div>
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-150">
                      <strong>⏱️ Horas / Días Hombre</strong>: Empleados x Horas/Jornadas.
                    </div>
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-150">
                      <strong>🚚 Fletes & Kilometraje</strong>: Distancia Km x Precio Galón Combustible.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader className="bg-neutral-50/50 pb-3">
                  <CardTitle className="text-sm font-extrabold text-neutral-900">2. Conversión a Cotización o Factura</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-xs text-neutral-600 space-y-2">
                  <p>Al hacer clic en el botón <strong>"Cotizar"</strong> dentro de cualquier presupuesto aprobado, FacturaDo convierte los grupos y recursos calculados en renglones oficiales de Cotización o Factura comercial, preservando la trazabilidad.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* FACTURACIÓN E-CF & MSELLER */}
        {activeSection === 'ecf' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold w-fit border border-emerald-100">
              <ShieldCheck className="w-4 h-4" /> Certificación DGII CerteCF
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Facturación Electrónica (e-CF)</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Permite a los contribuyentes de República Dominicana firmar y transmitir comprobantes e-CF (E31, E32, E44, E45) directamente a la DGII mediante la infraestructura de MSeller API.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                <h3 className="font-bold text-xs text-emerald-950">Pasos para activar e-CF:</h3>
                <ol className="list-decimal list-inside text-xs text-emerald-900 space-y-1">
                  <li>Sube tu archivo de Certificado Digital <strong>.p12</strong> y escribe tu contraseña encriptada.</li>
                  <li>Sigue el asistente <strong>CerteCF de 8 Pasos</strong> para enviar los conjuntos de prueba exigidos por la DGII.</li>
                  <li>Genera la API Key en MSeller y configura el entorno de <strong>Pruebas</strong> o <strong>Producción</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* NÓMINA TSS & ISR */}
        {activeSection === 'payroll' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-purple-700 bg-purple-50 px-3 py-1 rounded-full text-xs font-bold w-fit border border-purple-100">
              <Users className="w-4 h-4" /> Ley 16-92 & Ley 87-01
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Nómina Empresarial & TSS</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Automatiza la nómina quincenal/mensual calculando exactamente los topes salariales y desahucios estipulados por el Ministerio de Trabajo y la Tesorería de la Seguridad Social (TSS).
            </p>

            <div className="space-y-3 text-xs text-neutral-600">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <strong>Deducciones Automatizadas</strong>: AFP (2.87%), ARS (3.04% topada a 10 salarios mínimos) e ISR DGII según la escala anual exenta.
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <strong>Exportador TXT TSS</strong>: Genera en 1 clic el archivo con formato oficial de la TSS para carga masiva de novedades sin digitar manualmente.
              </div>
            </div>
          </div>
        )}

        {/* CONCILIACIÓN BANCARIA */}
        {activeSection === 'banking' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold w-fit border border-amber-100">
              <RefreshCw className="w-4 h-4" /> Formatos OFX / CSV
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Conciliación Bancaria</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Sube tus extractos bancarios bajados del internet banking de Banreservas, BHD, Popular u otros bancos comerciales y cruza automáticamente los registros contra facturas cobradas y gastos emitidos.
            </p>
          </div>
        )}

        {/* CLIENTES */}
        {activeSection === 'clients' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Directorio y Clientes</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              El directorio centraliza la información de todos tus clientes comerciales. Puedes categorizarlos como B01 (Crédito Fiscal) o B02 (Consumo Final).
            </p>
          </div>
        )}

        {/* INVENTARIO */}
        {activeSection === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Inventario Avanzado</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Soporte para múltiples almacenes, transferencias de productos, alertas de stock mínimo y registro de Kardex físico.
            </p>
          </div>
        )}

        {/* FACTURACIÓN */}
        {activeSection === 'invoicing' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Facturación y Cotizaciones</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Emisión de Facturas tradicionales B01/B02, e-CF Electrónicas E31/E32 y Cotizaciones/Proformas independientes.
            </p>
          </div>
        )}

        {/* REPORTES */}
        {activeSection === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Reportes y DGII (606 / 607 / 608)</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Genera tus archivos 606 de compras y 607 de ventas para envío mensual en el portal de la DGII.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
