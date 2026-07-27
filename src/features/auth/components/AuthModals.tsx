import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AuthModalsProps {
  showTermsModal: boolean;
  setShowTermsModal: (show: boolean) => void;
  showPrivacyModal: boolean;
  setShowPrivacyModal: (show: boolean) => void;
}

export function AuthModals({ showTermsModal, setShowTermsModal, showPrivacyModal, setShowPrivacyModal }: AuthModalsProps) {
  return (
    <AnimatePresence>
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-150 flex items-center justify-between bg-neutral-50 shrink-0">
              <div className="space-y-0.5 animate-fade-in">
                <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wider">Términos y Condiciones de Servicio</h3>
                <p className="text-[10px] text-neutral-400">Última actualización: 12 de Junio de 2026 • República Dominicana</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="p-1.5 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer text-neutral-500 hover:text-neutral-900 outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="p-6 overflow-y-auto space-y-5 text-neutral-600 leading-relaxed text-[11px] sm:text-xs">
              <p>
                Bienvenido a <strong>FacturaDo</strong>. La presente plataforma es un Software como Servicio (SaaS) diseñado para la facturación comercial, control de inventario y cuadres de caja. Al registrar una cuenta u operar nuestros servicios, usted acepta apegarse a los términos estipulados a continuación. Si usted no está de acuerdo con alguna parte de estos términos, no debe utilizar la plataforma.
              </p>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">1. Objeto y Alcance del Servicio</h4>
                <p>
                  FacturaDo provee una infraestructura en la nube que permite a los comercios gestionar su facturación diaria. El servicio se provee "tal cual" (As Is) y sujeto a disponibilidad. FacturaDo se reserva el derecho de modificar, actualizar, suspender temporalmente o descontinuar funciones de la plataforma en cualquier momento sin que esto derive en obligaciones de indemnización para el usuario.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">2. Exención de Responsabilidad Tributaria y Fiscal</h4>
                <p>
                  FacturaDo es estrictamente una herramienta de gestión administrativa y no actúa como representante fiscal, contable ni legal. El usuario asume absoluta responsabilidad civil y penal sobre la legitimidad, montos, impuestos declarados y secuencias de Comprobantes Fiscales (NCF) registradas en nuestro sistema. El usuario garantiza que dichas secuencias corresponden fielmente con autorizaciones vigentes emitidas por la Dirección General de Impuestos Internos (DGII). FacturaDo no asume bajo ningún concepto deudas, multas, recargos, penalidades o contingencias fiscales derivadas de errores de digitación, fraude o declaraciones tributarias anómalas.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">3. Limitación de Responsabilidad (Daños y Pérdida de Datos)</h4>
                <p>
                  En la máxima medida permitida por las leyes dominicanas, FacturaDo, sus creadores, directivos o afiliados no serán responsables de daños directos, indirectos, incidentales, punitivos, especiales o consecuentes (incluyendo, sin limitación, pérdida de lucro cesante, interrupción de negocio, o pérdida de información) resultantes del uso o la incapacidad de usar la plataforma. Aunque realizamos respaldos periódicos, usted es responsable de mantener registros y exportaciones independientes de sus facturas. El servicio no garantiza un 100% de disponibilidad ni la inmunidad absoluta ante ciberataques de terceros ajenos a la empresa.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">4. Seguridad, Cuentas y Uso Adecuado</h4>
                <p>
                  Usted es el único responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada desde su cuenta será considerada autorizada por el titular del RNC registrado. Queda estrictamente prohibido utilizar la plataforma para (i) emitir facturas bajo RNC ajenos o inactivos sin poder representativo legal, (ii) llevar operaciones de "doble contabilidad" o lavado de activos, y (iii) realizar ingeniería inversa o extraer datos masivos (scraping) de nuestra infraestructura.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">5. Suscripciones, Pagos y Políticas de Reembolso</h4>
                <p>
                  El uso de características avanzadas está sujeto al pago de la suscripción aplicable. Todos los cobros se realizan por adelantado. Las tarifas no son reembolsables, salvo que la ley exija lo contrario. El incumplimiento de pago resultará en la suspensión del acceso a la plataforma o la restricción al plan gratuito. FacturaDo puede modificar los precios informándole con treinta (30) días de antelación.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">6. Propiedad Intelectual y Propiedad de la Información</h4>
                <p>
                  Todo el código, diseño gráfico, logos y estructura funcional de FacturaDo son propiedad exclusiva de la empresa y están protegidos por leyes de derechos de autor. No obstante, los datos insertados en su cuenta (clientes, artículos, montos) son de su total propiedad. FacturaDo únicamente actuará como custodio de los mismos.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">7. Terminación y Suspensión de Cuentas</h4>
                <p>
                  Nos reservamos el derecho de suspender o cancelar su cuenta de manera inmediata, sin previo aviso, en caso de detectar violaciones flagrantes a estos términos, reportes de actividad fraudulenta emitidos por las autoridades, o inactividad prolongada mayor a un (1) año en planes gratuitos.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">8. Ley Aplicable y Jurisdicción</h4>
                <p>
                  Este acuerdo y su ejecución se interpretarán en virtud de las leyes de la República Dominicana. Para cualquier divergencia en la interpretación o ejecución de los presentes términos que no pudiese ser resuelta de manera amistosa, las partes se someten a la competencia y jurisdicción de los tribunales del Distrito Nacional.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#f0f0f0] bg-neutral-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2 bg-[#1A2732] hover:bg-neutral-800 text-white font-medium rounded-xl transition-all cursor-pointer text-xs uppercase"
              >
                Entendido y Acepto
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-150 flex items-center justify-between bg-neutral-50 shrink-0">
              <div className="space-y-0.5 animate-fade-in">
                <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wider">Políticas de Uso y Privacidad de Datos</h3>
                <p className="text-[10px] text-neutral-400">Última actualización: 12 de Junio de 2026 • República Dominicana</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-1.5 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer text-neutral-500 hover:text-neutral-900 outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="p-6 overflow-y-auto space-y-5 text-neutral-600 leading-relaxed text-[11px] sm:text-xs">
              <p>
                En <strong>FacturaDo</strong> ("nosotros", "nuestro" o "la Plataforma"), operada bajo las regulaciones de la República Dominicana, nos tomamos muy en serio la seguridad financiera, la privacidad operativa de su comercio y la confidencialidad de sus datos. La siguiente política describe cómo recopilamos, procesamos y salvaguardamos su información de conformidad con la Ley Nº 172-13.
              </p>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">1. Recopilación de Información (Qué recogemos y Por qué)</h4>
                <p>
                  Recopilamos únicamente los datos operativos y comerciales de su negocio requeridos para la correcta operación del software. Esto abarca: Datos de Creación de Cuenta (Correos, nombres de dueños, RNC, teléfonos), Datos Operacionales (inventario de productos, listas de proveedores y base de clientes) y Datos Transaccionales (facturas emitidas, cotizaciones y cuadres). Además, integramos en tiempo real consultas públicas al padrón oficial de la Dirección General de Impuestos Internos (DGII) para autocompletar formularios basados en su RNC. Adicionalmente recopilamos métricas técnicas automatizadas (Cookies, IP, Tipo de Navegador) para prevenir el fraude, gestionar sesiones activas y asegurar el óptimo funcionamiento.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">2. Uso y Finalidad del Tratamiento de los Datos</h4>
                <p>
                  Toda la información captada se utiliza de manera estricta para: (a) Prestación efectiva del servicio de facturación y control de inventarios, (b) Generación de reportes auxiliares contables (como el 606 y 607), (c) Validación de identidad en integraciones, (d) Asistencia de soporte técnico e (e) Investigaciones internas de control anti-fraude o ataques cibernéticos.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">3. Compartición de Información con Terceros (No Venta de Datos)</h4>
                <p>
                  FacturaDo se compromete rigurosamente a <strong>no vender, alquilar, sublicenciar ni exponer para fines mercadotécnicos de terceros</strong> sus transacciones comerciales. Solo se compartirá información con: (i) Proveedores de alojamiento en la nube (ej: Supabase, AWS) cuyas políticas cumplen con el cifrado moderno de nivel bancario, (ii) Procesadores de pagos (Stripe, PayPal, Azul) para procesar el pago de su suscripción, y (iii) Entidades gubernamentales dominicanas, tribunales o la Policía Nacional <strong>sólo cuando medie una orden judicial o requerimiento legal válido</strong>.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">4. Seguridad, Cifrado y Retención de la Información</h4>
                <p>
                  Los datos son resguardados en servidores de infraestructura de alta disponibilidad. Empleamos protocolos de cifrado asimétrico SSL/TLS de 256 bits durante la transmisión y políticas de encriptación en bases de datos en reposo (AES). Los datos comerciales se retienen mientras su cuenta se encuentre activa. Si decide cancelar su suscripción, conservamos la data operacional por un tiempo legal prudente (típicamente hasta 6 meses a solicitud de recuperación) antes de eliminarla definitivamente o anonimizarla irreversiblemente.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">5. Derechos ARCO de los Titulares</h4>
                <p>
                  En cumplimiento de la Ley N.º 172-13 que tiene por objeto la protección integral de los datos personales en archivos, registros públicos y bancos de datos privados en República Dominicana, usted tiene el derecho en cualquier momento de solicitar el Acceso, Rectificación, Cancelación u Oposición del uso de sus datos personales. Dicha acción la puede ejercer enviándonos un correo de soporte oficial. Cabe acotar que el ejercicio del derecho a supresión total inhabilitará permanentemente su capacidad de emitir facturas en FacturaDo.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-medium text-[#1A2732] uppercase text-[10px] tracking-wide">6. Limitación Frente a Fugas Masivas por Ataques Estatales</h4>
                <p>
                  Mientras operamos con estándares de la industria, ninguna transmisión electrónica por el Internet es 100% invulnerable. FacturaDo se exime de responsabilidades en eventuales casos de fuerza mayor relacionados con ataques coordinados de extrema sofisticación o fallas catastróficas del proveedor de la nube.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#f0f0f0] bg-neutral-150 flex justify-end shrink-0 bg-neutral-50">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 bg-[#1A2732] hover:bg-neutral-800 text-white font-medium rounded-xl transition-all cursor-pointer text-xs uppercase"
              >
                Entendido y Acepto
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
