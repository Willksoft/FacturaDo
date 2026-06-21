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
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

type ManualSection = 'intro' | 'clients' | 'inventory' | 'invoicing' | 'reports';

export default function UserManual() {
  const [activeSection, setActiveSection] = useState<ManualSection>('intro');

  const menuItems: { id: ManualSection, icon: any, label: string }[] = [
    { id: 'intro', icon: Settings, label: 'Primeros Pasos' },
    { id: 'clients', icon: Users, label: 'Directorio y Clientes' },
    { id: 'inventory', icon: Package, label: 'Inventario Avanzado' },
    { id: 'invoicing', icon: FileText, label: 'Facturación y Cotizaciones' },
    { id: 'reports', icon: BarChart4, label: 'Reportes y Dashboard' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-6 p-4">
      {/* Sidebar de Navegación del Manual */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-2">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold mb-1">
            <BookOpen className="w-5 h-5" />
            Centro de Ayuda
          </div>
          <p className="text-[11px] text-indigo-700 leading-tight">
            Manual interactivo de usuario para aprovechar al máximo FacturaDo.
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
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all text-sm font-bold ${
                  isActive 
                    ? 'bg-neutral-900 text-white shadow-md' 
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Área de Contenido Principal */}
      <div className="flex-1 bg-white border border-neutral-200 rounded-3xl p-6 md:p-10 shadow-sm overflow-y-auto">
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
                  <p>Dirígete a <strong>Configuración (Engranaje) {'>'} Negocio</strong> para establecer el nombre legal, RNC y logotipo de tu empresa. Estos datos aparecerán en los encabezados de tus facturas y en la plataforma de facturación.</p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 shadow-none bg-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-sm text-emerald-900">2. Timbres Fiscales (NCF)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-emerald-800 space-y-2">
                  <p>Si eres un contribuyente formal (DGII), navega a <strong>Timbres Fiscales</strong> para registrar tus secuencias B01 (Crédito Fiscal), B02 (Consumo), B14 (Gubernamental), etc.</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li>Indica la cantidad otorgada por la DGII.</li>
                    <li>El sistema alertará automáticamente cuando te queden pocos NCF.</li>
                  </ul>
                  <div className="flex items-center gap-2 text-xs font-bold bg-emerald-100 p-2 rounded-lg mt-2 text-emerald-900">
                    <Info className="w-4 h-4" /> Los NCF se asignan automáticamente al facturar según el tipo de cliente.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'clients' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Directorio y Clientes</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              El directorio centraliza la información de todas tus entidades comerciales.
            </p>

            <div className="space-y-4">
              <div className="p-5 border border-neutral-200 rounded-2xl bg-white space-y-3">
                <h3 className="font-bold text-neutral-900">Crear un Nuevo Cliente</h3>
                <p className="text-sm text-neutral-600">
                  Ve a <strong>Directorio</strong> y haz clic en "Añadir Cliente". Tienes dos modalidades:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="font-bold text-xs mb-1">Cliente Formal (B01)</div>
                    <p className="text-[11px] text-neutral-500">Requiere RNC válido (9 o 11 dígitos). Se le emitirán Facturas de Crédito Fiscal para deducción de ITBIS.</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="font-bold text-xs mb-1">Cliente Informal (B02)</div>
                    <p className="text-[11px] text-neutral-500">Para consumidores finales. Puede usarse cédula o dejar el campo de identificación vacío si el monto no supera el tope establecido por DGII.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Inventario Avanzado</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Domina la gestión de stock con herramientas para farmacias, supermercados o servicios profesionales.
            </p>

            <div className="space-y-4">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader className="bg-neutral-50/50 pb-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Kits y Combos de Productos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-sm text-neutral-600 space-y-2">
                  <p>Un Combo te permite vender un grupo de artículos como una sola unidad.</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2 text-xs text-neutral-700">
                    <li>Al crear un producto, marca la casilla <strong>"Es un Combo/Kit"</strong>.</li>
                    <li>Selecciona los productos individuales que conforman este combo y sus cantidades.</li>
                    <li>Al vender el Combo, el sistema deducirá automáticamente el stock de sus <strong>componentes base</strong>. El combo en sí no maneja stock propio.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-amber-200 shadow-none bg-amber-50/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Lotes y Fechas de Vencimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-amber-900 space-y-2">
                  <p>Ideal para negocios de alimentos o medicamentos (FIFO).</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li>Almacena múltiples lotes para un mismo producto con fechas de caducidad diferentes.</li>
                    <li>Al registrar una venta, el sistema despacha automáticamente unidades del lote <strong>más próximo a vencer</strong>.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'invoicing' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Facturación y Cotizaciones</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Crea comprobantes fiscales y envía cotizaciones que luego puedes convertir en ventas cerradas.
            </p>

            <div className="grid gap-4">
              <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                <h3 className="font-bold text-sm mb-2">Crear Factura</h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-600">
                  <li>Navega a <strong>Facturación</strong> y haz clic en <strong>Nueva Factura</strong>.</li>
                  <li>Selecciona un cliente. El sistema elegirá el NCF correcto (B01 o B02) según si el cliente tiene RNC corporativo o Cédula/Consumidor Final.</li>
                  <li>Añade productos. Puedes aplicar descuentos globales o individuales.</li>
                  <li>En la pestaña de Configuración, ajusta el Método de Pago (Efectivo, Tarjeta, Crédito a plazos) y la Moneda (DOP, USD, EUR).</li>
                  <li>Haz clic en <strong>Finalizar Factura</strong>. ¡Listo! Obtendrás un PDF y un ticket térmico de 80mm.</li>
                </ol>
              </div>

              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <h3 className="font-bold text-sm text-indigo-900 mb-2">Imágenes en Facturas</h3>
                <p className="text-xs text-indigo-700">
                  ¿Quieres sorprender a tus clientes? Activa <strong>"Mostrar fotos de productos en el PDF"</strong> al final del documento. Esto añadirá miniaturas visuales de tus ítems en la cotización o factura final.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Dashboards y Reportes (BI)</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Analiza la salud financiera de tu empresa utilizando métricas en tiempo real.
            </p>

            <div className="space-y-4">
              <div className="p-4 border-l-4 border-emerald-500 bg-neutral-50 rounded-r-xl shadow-sm">
                <h4 className="font-bold text-neutral-800 text-sm mb-1">Flujo de Caja Predictivo</h4>
                <p className="text-xs text-neutral-600">
                  Proyecta tu liquidez a 4 semanas. Este gráfico ubicado en el Dashboard analiza todas tus facturas "A Crédito" (Pendientes) y suma los montos que deben ser pagados en cada semana futura basándose en sus fechas de vencimiento.
                </p>
              </div>

              <div className="p-4 border-l-4 border-amber-500 bg-neutral-50 rounded-r-xl shadow-sm">
                <h4 className="font-bold text-neutral-800 text-sm mb-1">Antigüedad de Saldos</h4>
                <p className="text-xs text-neutral-600">
                  Monitorea tu cartera de cuentas por cobrar. Clasifica las facturas vencidas en grupos: <strong>1-30 días, 31-60 días, y más de 90 días</strong> de mora. Utilízalo para enfocar esfuerzos de cobro en facturas críticas.
                </p>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-neutral-50 rounded-r-xl shadow-sm">
                <h4 className="font-bold text-neutral-800 text-sm mb-1">Exportación DGII (Formato 606 y 607)</h4>
                <p className="text-xs text-neutral-600">
                  Ve a la pestaña <strong>Reportes DGII</strong>. Genera el archivo TXT para el formulario 606 (Compras y Gastos) y el 607 (Ventas de Bienes y Servicios) con un solo clic, listo para subir a la Oficina Virtual (OFV).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
