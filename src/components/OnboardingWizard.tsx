import React, { useState } from 'react';
import { Sparkles, Building, Phone, Mail, MapPin, ArrowRight, CheckCircle2, Lock, Upload, X, Image as ImageIcon } from 'lucide-react';
import { LogoFacturaDo } from './LogoFacturaDo';
import { insforge } from '../lib/insforge';

interface OnboardingWizardProps {
  onComplete: (settings: any) => Promise<void>;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Legal Identity
  const [businessName, setBusinessName] = useState('');
  const [businessRNC, setBusinessRNC] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Step 2: NCF Preferences
  const [ncfCCF, setNcfCCF] = useState(true); // B01
  const [ncfConsumo, setNcfConsumo] = useState(true); // B02
  const [ncfRegEsp, setNcfRegEsp] = useState(false); // B14
  const [ncfGov, setNcfGov] = useState(false); // B15

  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      if (!businessName || !businessRNC) {
        setFormError('Por favor introduce la Razón Social y el RNC del Comercio.');
        return;
      }
      const cleanRNC = businessRNC.replace(/[^0-9]/g, '');
      if (cleanRNC.length !== 9 && cleanRNC.length !== 11) {
        setFormError('El RNC dominicano debe contener exactamente 9 u 11 dígitos.');
        return;
      }
      if (businessPhone) {
        const cleanPhone = businessPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.length !== 10) {
          setFormError('El número de teléfono dominicano debe contener exactamente 10 dígitos (ej. 8095550100).');
          return;
        }
        const areaCode = cleanPhone.slice(0, 3);
        if (areaCode !== '809' && areaCode !== '829' && areaCode !== '849') {
          setFormError('El número de teléfono dominicano debe iniciar con un código de área válido: 809, 829 o 849.');
          return;
        }
      }
      if (businessEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(businessEmail)) {
          setFormError('Por favor introduce un correo electrónico de facturación válido (ej. correo@empresa.com.do).');
          return;
        }
      }
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setFormError('');
    setStep(1);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('El logo no debe pesar más de 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('El archivo debe ser una imagen (PNG, JPG o SVG).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFormError('El logo no debe pesar más de 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const { data: authData } = await insforge.auth.getCurrentUser();
      const currentUserId = authData?.user?.id || 'default';

      const finalSettingsDb = {
        id: currentUserId,
        business_name: businessName,
        business_rnc: businessRNC.replace(/[^0-9]/g, ''),
        business_phone: businessPhone || '809-555-0100',
        business_email: businessEmail || 'info@comercio.com',
        business_address: businessAddress || 'Santo Domingo, República Dominicana',
        logo_url: logoUrl || null,
        primary_color: '#1A2732',
        accent_color: '#4f46e5',
        footer_note: 'Términos de Facturación: Comprobante de Crédito Fiscal autorizado por la DGII. Gracias por su pago.',
        page_size: 'Letter',
        bank_account_currency: 'false'
      };

      // Save to template_settings database
      const { error: dbErr } = await insforge.database
        .from('template_settings')
        .update(finalSettingsDb)
        .eq('id', currentUserId);

      if (dbErr) {
        throw dbErr;
      }

      await onComplete({
        businessName: businessName,
        businessRNC: businessRNC.replace(/[^0-9]/g, ''),
        businessPhone: businessPhone || '809-555-0100',
        businessEmail: businessEmail || 'info@comercio.com',
        businessAddress: businessAddress || 'Santo Domingo, República Dominicana',
        logoUrl: logoUrl || '',
        primaryColor: '#1A2732',
        accentColor: '#4f46e5',
        footerNote: 'Términos de Facturación: Comprobante de Crédito Fiscal autorizado por la DGII. Gracias por su pago.',
        pageSize: 'Letter',
        showBankAccountsOnQuote: false,
        bankAccounts: []
      });
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Error guardando datos de configuración inicial.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-neutral-800 selection:text-white" id="onboarding-wizard-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <LogoFacturaDo className="mx-auto h-11 w-auto mb-3" />
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Asistente de Activación Contable</p>
      </div>

      <div className="max-w-xl w-full mx-auto bg-white rounded-3xl shadow-xs border border-neutral-200 overflow-hidden text-neutral-900">
        
        {/* Progress header */}
        <div className="bg-neutral-50 border-b border-neutral-150 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1A2732]" />
            <span className="text-sm font-bold text-neutral-800">Paso {step} de 2: {step === 1 ? 'Identificación Legal' : 'Comprobantes Fiscales NCF'}</span>
          </div>
          <div className="text-[10px] text-neutral-400 bg-white border px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500" /> Servidor Seguro
          </div>
        </div>

        {/* Form body */}
        <div className="p-6 sm:p-8">
          {formError && (
            <div className="mb-6 p-4 rounded-xl text-xs bg-red-50 text-red-800 border border-red-200 font-medium">
              {formError}
            </div>
          )}

          {/* STEP 1: IDENTIFICACIÓN LEGAL */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in text-sm">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Configure los datos de su Empresa</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Establezca los datos de facturación con los que se emitirán las facturas electrónicas oficiales.</p>
              </div>

              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Nombre del Comercio o Razón Social *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ej. S&E Investments SRL"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full h-11 px-3.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                    />
                    <Building className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Registro Nacional de Contribuyente (RNC) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ej. 131-00000-1"
                      value={businessRNC}
                      onChange={(e) => setBusinessRNC(e.target.value)}
                      className="w-full h-11 px-3.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                    />
                    <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Celular / WhatsApp Comercial</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ej. 809-543-9876"
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                        className="w-full h-11 px-3.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                      />
                      <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Correo de Facturación</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Ej. facturas@empresa.com.do"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full h-11 px-3.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                      />
                      <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Dirección Física de la Casa Matriz</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ej. Calle 27 de Febrero 201, Santo Domingo"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full h-11 px-3.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                    />
                    <MapPin className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">Logo de la Empresa (Opcional)</label>
                  {logoUrl ? (
                    <div className="relative border border-neutral-300 bg-neutral-50 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border bg-white flex items-center justify-center overflow-hidden shrink-0">
                        <img src={logoUrl} alt="Logo de la Empresa" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-800 truncate">Logo cargado correctamente</p>
                        <p className="text-[10px] text-neutral-400">Se mostrará en todas sus facturas y cotizaciones.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-red-600 rounded-lg transition-all cursor-pointer"
                        title="Eliminar logo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-[#1A2732] bg-neutral-100/50 scale-[0.99]'
                          : 'border-neutral-300 hover:border-[#1A2732] bg-neutral-50 hover:bg-neutral-100/30'
                      }`}
                    >
                      <input
                        type="file"
                        id="logo-upload-input"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="hidden"
                      />
                      <label htmlFor="logo-upload-input" className="cursor-pointer flex flex-col items-center w-full">
                        <Upload className="w-6 h-6 text-neutral-400 mb-1.5" />
                        <span className="text-xs font-bold text-neutral-700">Arrastre aquí su imagen o haga clic para examinar</span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">Formatos soportados: PNG, JPG, SVG (Máx. 2MB)</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: NCF PREFERENCES */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in text-sm">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Secuencias de Comprobantes Fiscales (NCF)</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Active las series autorizadas por la DGII dominicana para empezar a emitir documentos válidos.</p>
              </div>

              <div className="space-y-3 pt-1">
                <div 
                  onClick={() => setNcfCCF(!ncfCCF)}
                  className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${ncfCCF ? 'bg-neutral-50 border-neutral-900 border-2 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <input type="checkbox" checked={ncfCCF} readOnly className="mt-1 w-4 h-4 accent-[#1A2732]" />
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">B01 - Comprobante de Crédito Fiscal</span>
                    <span className="text-xs text-neutral-500 block leading-normal">Para sustentar gastos de ITBIS e ISR requeridos por clientes jurídicos nacionales (empresas).</span>
                  </div>
                </div>

                <div 
                  onClick={() => setNcfConsumo(!ncfConsumo)}
                  className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${ncfConsumo ? 'bg-neutral-50 border-neutral-900 border-2 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <input type="checkbox" checked={ncfConsumo} readOnly className="mt-1 w-4 h-4 accent-[#1A2732]" />
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">B02 - Comprobante de Consumo</span>
                    <span className="text-xs text-neutral-500 block leading-normal">Para operaciones de ventas a consumidores finales sin necesidad de sustentar ITBIS/gastos corporativos.</span>
                  </div>
                </div>

                <div 
                  onClick={() => setNcfRegEsp(!ncfRegEsp)}
                  className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${ncfRegEsp ? 'bg-neutral-50 border-neutral-900 border-2 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <input type="checkbox" checked={ncfRegEsp} readOnly className="mt-1 w-4 h-4 accent-[#1A2732]" />
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">B14 - Regímenes Especiales de Tributación</span>
                    <span className="text-xs text-neutral-500 block leading-normal">Obligatorio para facturar a empresas acogidas a incentivos por ley especial (Zona Franca, PROINDUSTRIA, etc.).</span>
                  </div>
                </div>

                <div 
                  onClick={() => setNcfGov(!ncfGov)}
                  className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${ncfGov ? 'bg-neutral-50 border-neutral-900 border-2 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <input type="checkbox" checked={ncfGov} readOnly className="mt-1 w-4 h-4 accent-[#1A2732]" />
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">B15 - Comprobantes Gubernamentales</span>
                    <span className="text-xs text-neutral-500 block leading-normal">Requeridos obligatoriamente para facturar a cualquier institución pública del Estado Dominicano.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-[#1A2732] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer bg-white h-11 flex items-center"
            >
              Atrás
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-7 py-3 bg-[#1A2732] hover:bg-neutral-800 text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider h-11"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider h-11 disabled:opacity-50"
            >
              {isSubmitting ? 'Finalizando...' : 'Finalizar Configuración'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
