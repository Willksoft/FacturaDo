import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Warehouse, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  AlertTriangle,
  Lock,
  Globe,
  Database,
  Users,
  ShieldCheck,
  DollarSign,
  Calculator,
  RefreshCw
} from 'lucide-react';

interface HelpManualViewProps {
  onBackToLanding?: () => void;
  isInsideApp?: boolean;
}

export default function HelpManualView({ onBackToLanding, isInsideApp = false }: HelpManualViewProps) {
  const [activeTopic, setActiveTopic] = useState<string>('presupuestos');

  const topics = [
    {
      id: 'presupuestos',
      title: 'Centro de Presupuestos',
      description: 'Estimación inteligente de costos por m², m³, horas y proyectos.',
      icon: Calculator,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      id: 'ecf',
      title: 'Facturación e-CF & MSeller',
      description: 'Comprobantes electrónicos firmados digitalmente con la DGII.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      id: 'nomina',
      title: 'Nómina Empresarial & R.H.',
      description: 'Gestión 360 de empleados, Ley 16-92, TSS, IR-3/13 y contratos.',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      id: 'ncf',
      title: 'El Universo de los NCF',
      description: 'Explicación detallada de B01, B02, B14 y B15 para R.D.',
      icon: FileText,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      id: 'dgii',
      title: 'Formatos 606 y 607 (DGII)',
      description: 'Cómo generar y enviar tus reportes mensuales sin errores.',
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      id: 'caja',
      title: 'Control de Caja y POS',
      description: 'Cuadre diario, registro de egresos e ingresos rápidos.',
      icon: Store,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      id: 'inventario',
      title: 'Inventarios y Almacenes',
      description: 'Control de stock mínimo, mermas y multialmacenes.',
      icon: Warehouse,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 font-sans text-slate-900 text-left">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-indigo-300 rounded-full text-xs font-semibold backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5" />
            Centro de Conocimiento FacturaDo
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Manual Operativo & Guía Práctica
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Todo lo que necesitas saber para operar tu negocio en cumplimiento con la Ley 16-92, la TSS y las regulaciones fiscales de la DGII.
          </p>
        </div>

        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            ← Volver a Inicio
          </button>
        )}
      </div>

      {/* Topics Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTopic === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${t.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">{t.title}</h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
            </button>
          );
        })}
      </div>

      {/* Content View Area */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        
        {/* NÓMINA EMPRESARIAL */}
        {activeTopic === 'nomina' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-900">Módulo de Nómina Empresarial & Recursos Humanos</h2>
                <p className="text-xs text-slate-500">Gestión de plantilla, liquidaciones Ley 16-92, exenciones fiscales y TSS.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  1. Perfiles Fiscales e Información Migratoria
                </h4>
                <p className="text-slate-600">
                  Cada empleado tiene una matriz independiente de casillas fiscales (Aplica ISR, TSS, AFP, ARS, INFOTEP, Regalía, Cesantía). Puedes asignar perfiles prediseñados (*Empleado Fijo, Pasante, Consultor, Contratista Internacional*).
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  2. Generador Automático de Documentos
                </h4>
                <p className="text-slate-600">
                  Al registrar a cualquier colaborador se auto-genera el **Contrato Individual de Trabajo** en tiempo real. También puedes generar Cartas Oficiales de Despido, Aceptación de Renuncias y Certificaciones Salariales para bancos.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  3. Exportador TSS SUIR & DGII (IR-3/IR-13)
                </h4>
                <p className="text-slate-600">
                  Genera con 1 clic el archivo `.TXT` de novedades para la plataforma de la Tesorería de la Seguridad Social (TSS) filtrando automáticamente al personal exento o contratista internacional.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  4. Integración Automática a la Contabilidad
                </h4>
                <p className="text-slate-600">
                  Al procesar cada período de nómina (quincenal o mensual), se crea automáticamente el asiento contable de Partida Doble acreditando las retenciones por pagar y debitando la cuenta de Gastos Salariales.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* INICIO GUÍA */}
        {activeTopic === 'inicio' && (
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-slate-900">Bienvenido a FacturaDo</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              FacturaDo es una plataforma contable y de nómina empresarial de nivel corporativo desarrollada para la República Dominicana. Todo se procesa de forma rápida, segura y almacenada localmente o sincronizada con tu base de datos de InsForge.
            </p>
          </div>
        )}

        {/* NCF GUÍA */}
        {activeTopic === 'ncf' && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-slate-900">Comprobantes Fiscales NCF en R.D.</h2>
            <p className="text-sm text-slate-600">
              - **B01 (Crédito Fiscal)**: Para empresas y personas físicas con RNC que deducen ITBIS.<br/>
              - **B02 (Consumidor Final)**: Para ventas a clientes finales sin valor fiscal crediticio.<br/>
              - **B14 / B15**: Regímenes especiales y gubernamentales.
            </p>
          </div>
        )}

        {/* DGII GUÍA */}
        {activeTopic === 'dgii' && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-slate-900">Reportes DGII (606, 607 e IR-3)</h2>
            <p className="text-sm text-slate-600">
              Genera tus archivos planos listos para la Oficina Virtual de la DGII sin errores de formato.
            </p>
          </div>
        )}

        {/* CAJA GUÍA */}
        {activeTopic === 'caja' && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-slate-900">Punto de Venta POS & Cuadre de Caja</h2>
            <p className="text-sm text-slate-600">
              Controla aperturas, turnos de cajeros, retiros de efectivo y cuadre ciego al cierre de turno.
            </p>
          </div>
        )}

        {/* INVENTARIO GUÍA */}
        {activeTopic === 'inventario' && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-slate-900">Inventarios y Multialmacén</h2>
            <p className="text-sm text-slate-600">
              Kardex en tiempo real, alertas de stock mínimo y transferencias entre sucursales.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
