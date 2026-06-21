import React, { useState, useEffect } from 'react';
import { Client, Product, Invoice, Receipt, Expense } from '../../types';
import { 
  CheckCircle2, Circle, ArrowRight, X, Building, ShoppingBag, 
  Users, FileText, Sparkles, UserPlus, FileSignature, Receipt as ReceiptIcon,
  PieChart, CreditCard, PlayCircle
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface DashboardSetupGuideProps {
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
  receipts: Receipt[];
  expenses: Expense[];
  setCurrentTab: (tab: any) => void;
}

export default function DashboardSetupGuide({
  clients,
  products,
  invoices,
  receipts,
  expenses,
  setCurrentTab
}: DashboardSetupGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);

  useEffect(() => {
    const isHidden = localStorage.getItem('facturado_hide_setup_guide_v2');
    if (isHidden !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('facturado_hide_setup_guide_v2', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const hasCotizaciones = invoices.some(i => i.type === 'Cotizacion');
  const hasFacturas = invoices.some(i => i.type === 'Factura');

  const steps = [
    {
      id: 1,
      title: 'Datos Legales y NCF',
      description: 'Solución: Te permite emitir comprobantes válidos ante la DGII sin errores fiscales.',
      icon: <Building className="w-5 h-5" />,
      isCompleted: true, // Si llegó aquí, ya pasó el onboarding wizard
      actionLabel: 'Ver Configuración',
      action: () => setCurrentTab('settings'),
    },
    {
      id: 2,
      title: 'Tu Primer Almacén o Caja',
      description: 'Solución: Organiza exactamente dónde se guarda tu mercancía física y tu dinero en efectivo.',
      icon: <PieChart className="w-5 h-5" />,
      isCompleted: true, // Asumimos default creado, idealmente verificamos store
      actionLabel: 'Gestionar Cajas',
      action: () => setCurrentTab('finanzas'),
    },
    {
      id: 3,
      title: 'Tu Primer Producto o Servicio',
      description: 'Solución: Agiliza tus ventas al tener precios y stock pre-registrados para facturar rápido.',
      icon: <ShoppingBag className="w-5 h-5" />,
      isCompleted: products.length > 0,
      actionLabel: 'Crear Producto',
      action: () => setCurrentTab('directories'),
    },
    {
      id: 4,
      title: 'Registra un Cliente',
      description: 'Solución: Evita pedir el RNC en cada compra y lleva un historial de quién te debe dinero.',
      icon: <Users className="w-5 h-5" />,
      isCompleted: clients.length > 0,
      actionLabel: 'Crear Cliente',
      action: () => setCurrentTab('directories'),
    },
    {
      id: 5,
      title: 'Crea un Vendedor (Personal)',
      description: 'Solución: Mide el rendimiento de tus empleados y calcula comisiones automáticamente.',
      icon: <UserPlus className="w-5 h-5" />,
      isCompleted: false, // FacturaDo asume usuarios, por ahora motivamos a explorar ajustes de equipo
      actionLabel: 'Agregar Vendedor',
      action: () => setCurrentTab('settings'),
    },
    {
      id: 6,
      title: 'Emite una Cotización',
      description: 'Solución: Envía propuestas formales a clientes que luego se convierten en factura con 1 clic.',
      icon: <FileSignature className="w-5 h-5" />,
      isCompleted: hasCotizaciones,
      actionLabel: 'Crear Cotización',
      action: () => setCurrentTab('invoices'),
    },
    {
      id: 7,
      title: 'Genera tu Primera Factura',
      description: 'Solución: Registra tus ingresos reales, descuenta el inventario y genera el NCF automáticamente.',
      icon: <FileText className="w-5 h-5" />,
      isCompleted: hasFacturas,
      actionLabel: 'Crear Factura',
      action: () => setCurrentTab('invoices'),
    },
    {
      id: 8,
      title: 'Registra un Gasto (Compras)',
      description: 'Solución: Mantén un registro de tus egresos para conocer tu verdadera ganancia neta mensual.',
      icon: <CreditCard className="w-5 h-5" />,
      isCompleted: expenses.length > 0,
      actionLabel: 'Registrar Gasto',
      action: () => setCurrentTab('finanzas'),
    },
    {
      id: 9,
      title: 'Registra un Abono (Cuentas por Cobrar)',
      description: 'Solución: Cobra parcialmente las facturas a crédito y mantén un flujo de liquidez sano.',
      icon: <ReceiptIcon className="w-5 h-5" />,
      isCompleted: receipts.length > 0,
      actionLabel: 'Registrar Abono',
      action: () => setCurrentTab('finanzas'),
    },
    {
      id: 10,
      title: 'Revisa tus Reportes DGII',
      description: 'Solución: Ahorra horas de trabajo contable al final del mes exportando formatos 606/607 listos.',
      icon: <PieChart className="w-5 h-5" />,
      isCompleted: false, // Manual check
      actionLabel: 'Ver Reportes',
      action: () => setCurrentTab('reports'),
    }
  ];

  const completedSteps = steps.filter(s => s.isCompleted).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  // Ocultar si ya completó todo
  if (completedSteps === totalSteps) {
    return null; 
  }

  // Si hay muchos, podemos mostrar solo los primeros 5 o los que faltan,
  // pero el usuario pidió ver las funciones disponibles.
  const visibleSteps = showAllSteps ? steps : steps.filter(s => !s.isCompleted).slice(0, 4);

  return (
    <Card className="mb-6 border-[#1A2732]/20 shadow-sm overflow-hidden animate-fade-in relative bg-white">
      <button 
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors z-20"
        title="Omitir Guía"
      >
        <X className="w-5 h-5" />
      </button>

      <CardContent className="p-0 flex flex-col xl:flex-row">
        {/* Left Side: Summary & Progress */}
        <div className="bg-[#1A2732] text-white p-6 xl:w-[350px] flex flex-col justify-between shrink-0 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-white/90 text-[10px] font-bold uppercase rounded-full tracking-wider mb-4 border border-white/10">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Domina FacturaDo
            </div>
            <h2 className="text-xl font-bold mb-3 tracking-tight">Desbloquea todo el potencial</h2>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              Esta academia interactiva te guiará por todas las herramientas del sistema. Completa los pasos para dominar tu negocio.
            </p>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
              <div className="flex items-start gap-3">
                <PlayCircle className="w-8 h-8 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">¿Aprendes mejor viendo?</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Mira nuestro recorrido guiado de 3 minutos y vuélvete un experto al instante.
                  </p>
                  <button className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Ver Tour Interactivo →
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 relative z-10 mt-auto pt-6 border-t border-white/10">
            <div className="flex justify-between items-end text-sm">
              <span className="font-bold text-neutral-200">Progreso Total</span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-full bg-gradient-to-l from-white/20 to-transparent"></div>
              </div>
            </div>
            <div className="text-[10px] text-neutral-400 text-right mt-1">
              {completedSteps} de {totalSteps} pasos completados
            </div>
          </div>
        </div>

        {/* Right Side: Steps List */}
        <div className="p-6 xl:w-full flex flex-col bg-neutral-50/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-neutral-800">
              {showAllSteps ? 'Todos los pasos disponibles' : 'Siguientes pasos recomendados'}
            </h3>
            <button 
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
            >
              {showAllSteps ? 'Ocultar completados' : 'Ver los 10 pasos'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {visibleSteps.map((step) => (
              <div 
                key={step.id} 
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all ${
                  step.isCompleted 
                    ? 'bg-neutral-100/50 border-transparent opacity-60' 
                    : 'bg-white border-neutral-200 shadow-sm hover:border-indigo-300 hover:shadow-md group relative overflow-hidden'
                }`}
              >
                {!step.isCompleted && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${step.isCompleted ? 'text-emerald-500' : 'text-indigo-500 bg-indigo-50 p-1.5 rounded-lg'}`}>
                    {step.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold ${step.isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-900'}`}>
                      {step.id}. {step.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 leading-relaxed mt-1 line-clamp-2" title={step.description}>
                      <strong className="text-neutral-700">Por qué importa:</strong> {step.description.replace('Solución: ', '')}
                    </p>
                  </div>
                </div>
                
                {!step.isCompleted && (
                  <div className="mt-auto pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <button className="text-[10px] font-bold text-neutral-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                      <PlayCircle className="w-3 h-3" /> Ver Demo
                    </button>
                    <Button
                      size="sm"
                      className="shrink-0 bg-[#1A2732] hover:bg-neutral-800 text-white text-[10px] uppercase font-bold tracking-wider h-7 px-3 rounded-lg shadow-xs"
                      onClick={step.action}
                    >
                      {step.actionLabel}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg text-xs border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span><strong>Consejo:</strong> Usa el botón "Llenar con datos de prueba" en ajustes para practicar sin afectar tu contabilidad real.</span>
            </div>
            
            <button 
              onClick={handleDismiss}
              className="text-[11px] font-bold text-neutral-400 hover:text-neutral-600 uppercase tracking-wider whitespace-nowrap"
            >
              No volver a mostrar
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
