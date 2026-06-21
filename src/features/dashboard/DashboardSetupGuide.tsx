import React, { useState, useEffect, useRef } from 'react';
import { Client, Product, Invoice, Receipt, Expense } from '../../types';
import { 
  CheckCircle2, X, Building, ShoppingBag, 
  Users, FileText, Sparkles, UserPlus, FileSignature, Receipt as ReceiptIcon,
  PieChart, CreditCard, ChevronUp, Lock, Trophy
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

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
  const [showModal, setShowModal] = useState(false);
  const previousCompletedCount = useRef<number>(0);

  useEffect(() => {
    const isHidden = localStorage.getItem('facturado_hide_setup_guide_v4');
    if (isHidden !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('facturado_hide_setup_guide_v4', 'true');
    setIsVisible(false);
    setShowModal(false);
  };

  const hasCotizaciones = invoices.some(i => i.type === 'Cotizacion');
  const hasFacturas = invoices.some(i => i.type === 'Factura');

  const steps = [
    {
      id: 1, level: 1, xp: 50,
      title: 'Datos Legales y NCF',
      description: 'Te permite emitir comprobantes válidos ante la DGII sin errores fiscales.',
      icon: <Building className="w-5 h-5" />,
      isCompleted: true, 
      actionLabel: 'Ver Configuración',
      action: () => { setCurrentTab('settings'); setShowModal(false); },
    },
    {
      id: 2, level: 1, xp: 50,
      title: 'Tu Primer Almacén o Caja',
      description: 'Organiza exactamente dónde se guarda tu mercancía física y tu dinero en efectivo.',
      icon: <PieChart className="w-5 h-5" />,
      isCompleted: true, 
      actionLabel: 'Gestionar Cajas',
      action: () => { setCurrentTab('finanzas'); setShowModal(false); },
    },
    {
      id: 3, level: 1, xp: 100,
      title: 'Tu Primer Producto o Servicio',
      description: 'Agiliza tus ventas al tener precios y stock pre-registrados para facturar rápido.',
      icon: <ShoppingBag className="w-5 h-5" />,
      isCompleted: products.length > 0,
      actionLabel: 'Crear Producto',
      action: () => { setCurrentTab('directories'); setShowModal(false); },
    },
    {
      id: 4, level: 1, xp: 100,
      title: 'Registra un Cliente',
      description: 'Evita pedir el RNC en cada compra y lleva un historial de quién te debe dinero.',
      icon: <Users className="w-5 h-5" />,
      isCompleted: clients.length > 0,
      actionLabel: 'Crear Cliente',
      action: () => { setCurrentTab('directories'); setShowModal(false); },
    },
    {
      id: 5, level: 2, xp: 150,
      title: 'Emite una Cotización',
      description: 'Envía propuestas formales a clientes que luego se convierten en factura con 1 clic.',
      icon: <FileSignature className="w-5 h-5" />,
      isCompleted: hasCotizaciones,
      actionLabel: 'Crear Cotización',
      action: () => { setCurrentTab('invoices'); setShowModal(false); },
    },
    {
      id: 6, level: 2, xp: 200,
      title: 'Genera tu Primera Factura',
      description: 'Registra tus ingresos reales, descuenta el inventario y genera el NCF automáticamente.',
      icon: <FileText className="w-5 h-5" />,
      isCompleted: hasFacturas,
      actionLabel: 'Crear Factura',
      action: () => { setCurrentTab('invoices'); setShowModal(false); },
    },
    {
      id: 7, level: 2, xp: 100,
      title: 'Crea un Vendedor (Personal)',
      description: 'Mide el rendimiento de tus empleados y calcula comisiones automáticamente.',
      icon: <UserPlus className="w-5 h-5" />,
      isCompleted: false, 
      actionLabel: 'Agregar Vendedor',
      action: () => { setCurrentTab('settings'); setShowModal(false); },
    },
    {
      id: 8, level: 3, xp: 150,
      title: 'Registra un Gasto (Compras)',
      description: 'Mantén un registro de tus egresos para conocer tu verdadera ganancia neta mensual.',
      icon: <CreditCard className="w-5 h-5" />,
      isCompleted: expenses.length > 0,
      actionLabel: 'Registrar Gasto',
      action: () => { setCurrentTab('finanzas'); setShowModal(false); },
    },
    {
      id: 9, level: 3, xp: 200,
      title: 'Registra un Abono',
      description: 'Cobra parcialmente las facturas a crédito y mantén un flujo de liquidez sano.',
      icon: <ReceiptIcon className="w-5 h-5" />,
      isCompleted: receipts.length > 0,
      actionLabel: 'Registrar Abono',
      action: () => { setCurrentTab('finanzas'); setShowModal(false); },
    },
    {
      id: 10, level: 3, xp: 300,
      title: 'Revisa tus Reportes DGII',
      description: 'Ahorra horas de trabajo contable al final del mes exportando formatos 606/607 listos.',
      icon: <PieChart className="w-5 h-5" />,
      isCompleted: false, 
      actionLabel: 'Ver Reportes',
      action: () => { setCurrentTab('reports'); setShowModal(false); },
    }
  ];

  const completedSteps = steps.filter(s => s.isCompleted).length;
  const totalSteps = steps.length;
  const currentXP = steps.filter(s => s.isCompleted).reduce((acc, curr) => acc + curr.xp, 0);
  const totalXP = steps.reduce((acc, curr) => acc + curr.xp, 0);
  const progressPercent = Math.round((currentXP / totalXP) * 100);

  // Lógica de Confetti
  useEffect(() => {
    if (completedSteps > previousCompletedCount.current && previousCompletedCount.current > 0) {
      // Disparar confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#6366f1', '#fcd34d']
      });
      
      // Intentar reproducir sonido corto (opcional)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        // Ignorar si el navegador bloquea audio sin interacción
      }
    }
    previousCompletedCount.current = completedSteps;
  }, [completedSteps]);

  if (!isVisible) return null;

  if (completedSteps === totalSteps) {
    return null; 
  }

  // Determinar Nivel Actual (El nivel más bajo que aún tiene pasos incompletos)
  const isLevel1Complete = steps.filter(s => s.level === 1).every(s => s.isCompleted);
  const isLevel2Complete = steps.filter(s => s.level === 2).every(s => s.isCompleted);
  
  let currentLevelNum = 1;
  if (isLevel1Complete) currentLevelNum = 2;
  if (isLevel1Complete && isLevel2Complete) currentLevelNum = 3;

  const levelsData = [
    { id: 1, name: 'Nivel 1: Fundamentos (Bronce)', isUnlocked: true, isComplete: isLevel1Complete },
    { id: 2, name: 'Nivel 2: Operaciones (Plata)', isUnlocked: isLevel1Complete, isComplete: isLevel2Complete },
    { id: 3, name: 'Nivel 3: Dominio (Oro)', isUnlocked: isLevel2Complete, isComplete: false }
  ];

  return (
    <>
      {/* Floating Badge above Chatbot */}
      <div className="fixed bottom-40 md:bottom-24 right-6 z-40 flex flex-col items-end animate-fade-in">
        <button
          onClick={() => setShowModal(true)}
          className="group relative bg-[#1A2732] hover:bg-neutral-900 text-white shadow-xl rounded-full py-2 px-3 pr-4 flex items-center gap-3 transition-all hover:scale-105 border border-white/10"
        >
          {/* Progress Circular Indicator */}
          <div className="relative w-8 h-8 flex items-center justify-center bg-white/10 rounded-full shrink-0">
            <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeWidth="3"
                strokeDasharray={`${progressPercent}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[10px] font-bold text-white relative z-10">{completedSteps}</span>
          </div>
          
          <div className="flex flex-col items-start justify-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider leading-none">Nivel {currentLevelNum}</span>
            <span className="text-xs font-medium text-neutral-200 mt-0.5">{currentXP} / {totalXP} XP</span>
          </div>
          
          <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 p-2 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                {/* Left Side: Summary & Progress */}
                <div className="bg-[#1A2732] text-white p-8 md:w-[320px] flex flex-col shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold uppercase rounded-full tracking-wider mb-6 shadow-xs border border-amber-400/50">
                      <Trophy className="w-3.5 h-3.5" /> Nivel Actual: {currentLevelNum}
                    </div>
                    <h2 className="text-2xl font-bold mb-4 tracking-tight">Academia FacturaDo</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed mb-8">
                      Gana experiencia completando misiones para desbloquear nuevas herramientas de administración en tu plataforma.
                    </p>
                  </div>
                  
                  <div className="space-y-3 relative z-10 mt-auto pt-6 border-t border-white/10">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-neutral-200">Experiencia Global</span>
                      <span className="text-emerald-400 font-bold text-lg">{currentXP} XP</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out relative" 
                        style={{ width: `${progressPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400 text-right mt-1">
                      {completedSteps} de {totalSteps} misiones
                    </div>
                  </div>
                </div>

                {/* Right Side: Steps List */}
                <div className="p-0 md:flex-1 overflow-y-auto bg-neutral-50 scrollbar-thin">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-neutral-800 mb-6">Misiones Disponibles</h3>

                    <div className="space-y-8">
                      {levelsData.map(level => (
                        <div key={level.id} className={`space-y-4 ${!level.isUnlocked ? 'opacity-60 grayscale' : ''}`}>
                          <h4 className="font-bold flex items-center gap-2 text-neutral-700">
                            {level.isUnlocked ? (
                              level.isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            ) : (
                              <Lock className="w-4 h-4 text-neutral-400" />
                            )}
                            {level.name}
                          </h4>

                          <div className="grid grid-cols-1 gap-4">
                            {steps.filter(s => s.level === level.id).map(step => (
                              <div 
                                key={step.id} 
                                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border transition-all ${
                                  !level.isUnlocked 
                                    ? 'bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed pointer-events-none'
                                    : step.isCompleted 
                                      ? 'bg-emerald-50/50 border-emerald-100' 
                                      : 'bg-white border-neutral-200 shadow-xs hover:border-indigo-300 relative overflow-hidden'
                                }`}
                              >
                                {(!step.isCompleted && level.isUnlocked) && (
                                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-2xl"></div>
                                )}
                                
                                <div className="flex items-start sm:items-center gap-4 flex-1">
                                  <div className={`shrink-0 ${!level.isUnlocked ? 'text-neutral-400' : step.isCompleted ? 'text-emerald-500' : 'text-indigo-500 bg-indigo-50 p-2.5 rounded-xl'}`}>
                                    {step.isCompleted ? (
                                      <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                      step.icon
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className={`text-sm font-bold ${!level.isUnlocked ? 'text-neutral-500' : step.isCompleted ? 'text-emerald-800' : 'text-neutral-900'}`}>
                                        {step.title}
                                      </h4>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                        +{step.xp} XP
                                      </span>
                                    </div>
                                    <p className={`text-xs ${step.isCompleted ? 'text-emerald-600/80' : 'text-neutral-500'} leading-relaxed`}>
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                                
                                {level.isUnlocked && (
                                  <div className="mt-3 sm:mt-0 sm:ml-auto shrink-0 flex items-center justify-end">
                                    {step.isCompleted ? (
                                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                                      </span>
                                    ) : (
                                      <Button
                                        className="bg-[#1A2732] hover:bg-neutral-800 text-white text-[11px] uppercase font-bold tracking-wider h-8 px-4 rounded-xl shadow-xs w-full sm:w-auto"
                                        onClick={step.action}
                                      >
                                        {step.actionLabel}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sticky bottom-0 p-4 border-t border-neutral-200 bg-white/80 backdrop-blur-md flex justify-end">
                    <button 
                      onClick={handleDismiss}
                      className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                      Saltar Tutorial Definitivamente
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
