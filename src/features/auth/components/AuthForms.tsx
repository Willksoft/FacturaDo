import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Building, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Loader2, 
  CheckCircle2,
  ShieldCheck 
} from 'lucide-react';
import { insforge } from '../../../lib/insforge';

interface AuthFormsProps {
  view: 'login' | 'register';
  setView: (v: 'login' | 'register') => void;
  authStage: 'methods' | 'email_credentials' | 'remaining_details';
  setAuthStage: (stage: 'methods' | 'email_credentials' | 'remaining_details') => void;
  registerForm: {
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    ownerName: string;
    phone: string;
    agree: boolean;
  };
  setRegisterForm: React.Dispatch<React.SetStateAction<any>>;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  loginError: string;
  setLoginError: (error: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  isEmailRegisterMode: boolean;
  setIsEmailRegisterMode: (mode: boolean) => void;
  twoFactorStep: boolean;
  setTwoFactorStep: (step: boolean) => void;
  setPendingLoggedUser: (user: any) => void;
  totpVerificationCode: string;
  setTotpVerificationCode: (code: string) => void;
  totpVerificationError: string;
  setTotpVerificationError: (error: string) => void;
  registerSuccess: boolean;
  setRegisterSuccess: (success: boolean) => void;
  emailConfirmationRequired: boolean;
  setEmailConfirmationRequired: (req: boolean) => void;
  socialProviderName: string;
  strength: number;
  strengthColors: string[];
  strengthLabels: string[];
  handleLoginSubmit: (e: React.FormEvent) => void;
  handlePasskeyLogin: () => void;
  handleVerifyTwoFactorLogin: (e: React.FormEvent) => void;
  handleRemainingDetailsSubmit: (e: React.FormEvent) => void;
  setShowTermsModal: (show: boolean) => void;
  setShowPrivacyModal: (show: boolean) => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({
  view,
  setView,
  authStage,
  setAuthStage,
  registerForm,
  setRegisterForm,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loginError,
  setLoginError,
  isSubmitting,
  setIsSubmitting,
  isEmailRegisterMode,
  setIsEmailRegisterMode,
  twoFactorStep,
  setTwoFactorStep,
  setPendingLoggedUser,
  totpVerificationCode,
  setTotpVerificationCode,
  totpVerificationError,
  setTotpVerificationError,
  registerSuccess,
  setRegisterSuccess,
  emailConfirmationRequired,
  setEmailConfirmationRequired,
  socialProviderName,
  strength,
  strengthColors,
  strengthLabels,
  handleLoginSubmit,
  handlePasskeyLogin,
  handleVerifyTwoFactorLogin,
  handleRemainingDetailsSubmit,
  setShowTermsModal,
  setShowPrivacyModal,
}) => {
  return (
    <>
      {/* STAGE 1: METHODS SELECTOR (Google, Apple, Correo) */}
      {authStage === 'methods' && !registerSuccess && (
        <div className="space-y-4 animate-fade-in text-sm font-sans">
          {view === 'register' && (
            <div className="flex items-start gap-2.5 font-sans text-xs text-neutral-600 py-2 select-none bg-neutral-50 p-3 rounded-xl border border-neutral-100 mb-4">
              <input
                type="checkbox"
                id="agree-checkbox-methods"
                checked={registerForm.agree}
                onChange={(e) => {
                  setRegisterForm((prev: any) => ({ ...prev, agree: e.target.checked }));
                  setLoginError('');
                }}
                className="w-5 h-5 accent-[#1A2732] shrink-0 mt-0.5 cursor-pointer"
              />
              <label htmlFor="agree-checkbox-methods" className="cursor-pointer leading-relaxed">
                Acepto los{' '}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowTermsModal(true);
                  }}
                  className="text-[#1A2732] font-semibold hover:underline cursor-pointer"
                >
                  términos y condiciones
                </span>{' '}
                y las{' '}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPrivacyModal(true);
                  }}
                  className="text-[#1A2732] font-semibold hover:underline cursor-pointer"
                >
                  políticas de privacidad
                </span>{' '}
                de FacturaDo.
              </label>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={async () => {
              if (view === 'register' && !registerForm.agree) {
                setLoginError('Debes aceptar los Términos y Condiciones para registrarte.');
                return;
              }
              setIsSubmitting(true);
              setLoginError('');
              try {
                const { error } = await insforge.auth.signInWithOAuth('google', {
                  redirectTo: window.location.origin
                });
                if (error) {
                  setLoginError(error.message || 'Error al iniciar sesión con Google.');
                  setIsSubmitting(false);
                }
              } catch (err: any) {
                setLoginError(err.message || 'Error de conexión con Google.');
                setIsSubmitting(false);
              }
            }}
            className="w-full h-12 bg-white hover:bg-neutral-50 border border-neutral-250 hover:border-neutral-400 text-neutral-800 font-medium rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer text-sm uppercase tracking-wider"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-1.37-.81-3.37.81-4.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{view === 'register' ? 'Registrarse con Google' : 'Iniciar con Google'}</span>
          </button>

          {/* Apple Login Button */}
          <button
            type="button"
            onClick={async () => {
              if (view === 'register' && !registerForm.agree) {
                setLoginError('Debes aceptar los Términos y Condiciones para registrarte.');
                return;
              }
              setIsSubmitting(true);
              setLoginError('');
              try {
                const { error } = await insforge.auth.signInWithOAuth('apple', {
                  redirectTo: window.location.origin
                });
                if (error) {
                  setLoginError(error.message || 'Error al iniciar sesión con Apple.');
                  setIsSubmitting(false);
                }
              } catch (err: any) {
                setLoginError(err.message || 'Error de conexión con Apple.');
                setIsSubmitting(false);
              }
            }}
            className="w-full h-12 bg-neutral-900 hover:bg-neutral-850 text-white font-medium rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer text-sm uppercase tracking-wider"
          >
            <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.13.67-2.85 1.49-.62.72-1.16 1.87-1.01 2.98 1.1.09 2.16-.57 2.87-1.41Z" />
            </svg>
            <span>{view === 'register' ? 'Registrarse con Apple' : 'Iniciar con Apple'}</span>
          </button>

          {/* Passkey Login Button (Only visible in login view) */}
          {view === 'login' && (
            <button
              type="button"
              onClick={handlePasskeyLogin}
              className="w-full h-12 bg-neutral-900 hover:bg-black border border-neutral-800 text-white font-medium rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer text-sm uppercase tracking-wider"
            >
              <ShieldCheck className="w-5 h-5 text-white shrink-0" />
              <span>Iniciar con Huella / Rostro</span>
            </button>
          )}

          {/* Email Login Button */}
          <button
            type="button"
            onClick={() => {
              if (view === 'register' && !registerForm.agree) {
                setLoginError('Debes aceptar los Términos y Condiciones para registrarte.');
                return;
              }
              setAuthStage('email_credentials');
              setIsEmailRegisterMode(view === 'register');
              setLoginError('');
            }}
            className="w-full h-12 bg-white hover:bg-neutral-55 border border-neutral-250 text-[#1A2732] font-medium rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer text-sm uppercase tracking-wider"
          >
            <Mail className="w-5 h-5 text-neutral-500 shrink-0" />
            <span>{view === 'register' ? 'Registrarse con Correo' : 'Iniciar con Correo'}</span>
          </button>

          <div className="text-center pt-4 text-xs text-neutral-500 font-sans space-y-3">
            <div>
              {view === 'register' 
                ? '¿Ya tienes una cuenta registrada en FacturaDo? ' 
                : '¿Aún no tienes una cuenta de comercio? '}
              <span
                onClick={() => {
                  const targetView = view === 'register' ? 'login' : 'register';
                  setView(targetView);
                }}
                className="text-[#1A2732] font-medium hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                {view === 'register' ? 'Inicia sesión aquí' : 'Regístrate totalmente gratis'}
              </span>
            </div>
            <div className="text-[10px] text-neutral-400">
              Al continuar, aceptas la creación y configuración contable dominicana autorizada de FacturaDo.
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: EMAIL & PASSWORD INPUTS */}
      {authStage === 'email_credentials' && !registerSuccess && (
        twoFactorStep ? (
          <form 
            className="space-y-4 text-left font-sans text-xs animate-fade-in" 
            onSubmit={handleVerifyTwoFactorLogin}
          >
            <button
              type="button"
              onClick={() => {
                setTwoFactorStep(false);
                setPendingLoggedUser(null);
                setTotpVerificationError('');
                setLoginError('');
              }}
              className="text-[#1A2732] font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 outline-none"
            >
              ← Cancelar verificación 2FA
            </button>

            <div className="space-y-2 text-center py-2">
              <div className="inline-flex items-center justify-center p-2 bg-[#1A2732]/10 border border-[#1A2732]/20 rounded-2xl text-[#1A2732]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-neutral-900 text-sm">Autenticación en Dos Pasos (2FA)</h3>
              <p className="text-[11px] text-neutral-500 leading-normal max-w-xs mx-auto">
                Ingrese el código de verificación de 6 dígitos que muestra su aplicación de autenticación (Google Authenticator, Authy, etc.).
              </p>
            </div>

            {totpVerificationError && (
              <div className="p-3 rounded-lg text-xs font-semibold bg-red-50 text-red-800 border border-red-200 text-center">
                {totpVerificationError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-medium text-neutral-700 block uppercase tracking-wider text-[10px] text-center">Código de Seguridad</label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={totpVerificationCode}
                onChange={(e) => setTotpVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center font-mono tracking-[0.4em] text-lg font-medium h-12 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent bg-neutral-50 focus:bg-white transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#1A2732] hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider font-sans"
            >
              Verificar y Acceder
            </button>
          </form>
        ) : (
          <form 
            className="space-y-4 text-left font-sans text-xs animate-fade-in" 
            onSubmit={async (e) => {
              e.preventDefault();
              if (isEmailRegisterMode) {
                // Email Register Pre-validation, then go to Step 2 remaining details
                if (!email || !password) {
                  setLoginError('Por favor complete su correo y clave.');
                  return;
                }
                const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
                if (!passwordRegex.test(password)) {
                  setLoginError('La clave debe tener al menos 6 caracteres y contener letras y números.');
                  return;
                }
                if (password !== confirmPassword) {
                  setLoginError('Las contraseñas no coinciden.');
                  return;
                }
                if (!registerForm.agree) {
                  setLoginError('Debes aceptar los Términos y Condiciones y Políticas de Privacidad para continuar.');
                  return;
                }
                setRegisterForm((prev: any) => ({
                  ...prev,
                  email: email,
                  password: password,
                  confirmPassword: password,
                  ownerName: email.split('@')[0]
                }));
                setLoginError('');
                setAuthStage('remaining_details');
              } else {
                // Form Login Submit
                handleLoginSubmit(e);
              }
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAuthStage('methods');
                setLoginError('');
              }}
              className="text-[#1A2732] font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 outline-none"
            >
              ← Volver a opciones de acceso
            </button>

            <div className="space-y-1">
              <label className="font-medium text-neutral-700 block uppercase tracking-wider text-xs">Correo Electrónico *</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Ej. mi-comercio@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-3.5 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                  required
                />
                <Mail className="absolute right-3.5 top-4 w-4 h-4 text-neutral-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-medium text-neutral-700 block uppercase tracking-wider text-xs">Clave de Acceso *</label>
                {!isEmailRegisterMode && <span className="text-xs text-neutral-500 hover:underline cursor-pointer">¿Olvidó su clave?</span>}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-3.5 pr-10 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isEmailRegisterMode && <p className="text-[10px] text-neutral-500 pt-1">Sugerencia: Usa al menos 6 caracteres con letras y números.</p>}
              {isEmailRegisterMode && password.length > 0 && (
                <div className="flex items-center gap-2 mt-2 w-full">
                  <div className="flex-1 flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 1 ? strengthColors[strength] : 'bg-neutral-200'}`}></div>
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 2 ? strengthColors[strength] : 'bg-neutral-200'}`}></div>
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 3 ? strengthColors[strength] : 'bg-neutral-200'}`}></div>
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${strength === 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-600' : 'text-red-600'}`}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            {isEmailRegisterMode && (
              <div className="space-y-1">
                <label className="font-medium text-neutral-700 block uppercase tracking-wider text-xs">Confirmar Clave de Acceso *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-3.5 pr-10 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#1A2732] hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando de forma segura...
                </>
              ) : (
                isEmailRegisterMode ? 'Siguiente: Datos de Comercio' : 'Entrar en mi Terminal'
              )}
            </button>

            <div className="text-center pt-2 text-xs text-neutral-500 font-sans">
              {isEmailRegisterMode 
                ? '¿Ya tienes una cuenta de FacturaDo? ' 
                : '¿Aún no tienes cuenta gratis para tu negocio? '}
              <span
                onClick={() => {
                  const targetView = isEmailRegisterMode ? 'login' : 'register';
                  setView(targetView);
                  setIsEmailRegisterMode(targetView === 'register');
                  setLoginError('');
                }}
                className="text-[#1A2732] font-medium hover:underline cursor-pointer"
              >
                {isEmailRegisterMode ? 'Inicia sesión aquí' : 'Crea una cuenta gratis'}
              </span>
            </div>
          </form>
        )
      )}

      {/* STAGE 3: REMAINING REGISTRATION DETAILS FORM */}
      {authStage === 'remaining_details' && !registerSuccess && (
        <form className="space-y-4 text-left font-sans text-sm animate-fade-in" onSubmit={handleRemainingDetailsSubmit}>
          <button
            type="button"
            onClick={() => {
              setAuthStage(socialProviderName ? 'methods' : 'email_credentials');
              setLoginError('');
            }}
            className="text-[#1A2732] font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 outline-none"
          >
            ← Volver atrás
          </button>

          {/* Preloaded info warning if social login */}
          {socialProviderName && (
            <div className="p-3 bg-neutral-50 border rounded-xl text-xs text-neutral-600 flex items-center gap-2">
              <span className="text-sm">👋</span>
              <span>Ingresaste con <strong>{socialProviderName}</strong> ({registerForm.email}). Solo faltan los detalles de tu comercio para finalizar.</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-medium text-neutral-700 block uppercase tracking-wider text-xs">Nombre del Comercio o Razón Social *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Distribuidora del Este SRL"
                value={registerForm.businessName}
                onChange={(e) => setRegisterForm({ ...registerForm, businessName: e.target.value })}
                className="w-full h-12 px-3.5 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                required
              />
              <Building className="absolute right-3.5 top-4 w-4 h-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-neutral-700 block uppercase tracking-wider text-xs">Nombre de Propietario o Representante *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Juan Pérez Martínez"
                value={registerForm.ownerName}
                onChange={(e) => setRegisterForm({ ...registerForm, ownerName: e.target.value })}
                className="w-full h-12 px-3.5 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
                required
              />
              <User className="absolute right-3.5 top-4 w-4 h-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-neutral-700 block uppercase tracking-wider text-xs">Celular / WhatsApp (Opcional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. 809-555-1234"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                className="w-full h-12 px-3.5 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-all font-sans"
              />
              <Phone className="absolute right-3.5 top-4 w-4 h-4 text-neutral-400" />
            </div>
          </div>

          <div className="flex items-start gap-2.5 font-sans text-xs text-neutral-600 py-1 select-none">
            <input
              type="checkbox"
              id="agree-checkbox-social"
              checked={registerForm.agree}
              onChange={(e) => setRegisterForm({ ...registerForm, agree: e.target.checked })}
              className="w-5 h-5 accent-[#1A2732] shrink-0 mt-0.5"
            />
            <label htmlFor="agree-checkbox-social" className="cursor-pointer leading-relaxed">
              Acepto los{' '}
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
                className="text-[#1A2732] font-semibold hover:underline cursor-pointer"
              >
                términos y condiciones de servicio
              </span>{' '}
              y las{' '}
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacyModal(true);
                }}
                className="text-[#1A2732] font-semibold hover:underline cursor-pointer"
              >
                comprobaciones de uso y política de privacidad
              </span>{' '}
              comercial de FacturaDo.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !registerForm.agree}
            className="w-full h-12 bg-[#1A2732] hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creando terminal de negocio...
              </>
            ) : (
              'Completar Registro'
            )}
          </button>
        </form>
      )}

      {/* Simulated success animation and loaders */}
      {registerSuccess && emailConfirmationRequired && (
        <div className="text-center py-8 space-y-5 font-sans text-xs animate-fade-in max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto text-xl animate-bounce">
            <Mail className="w-9 h-9 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium text-neutral-900 leading-none">¡Confirma tu correo electrónico!</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Hemos enviado un enlace de confirmación a <strong className="text-neutral-900">{registerForm.email}</strong>.
            </p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Por favor, revisa tu bandeja de entrada (y la carpeta de spam o correo no deseado) y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.
            </p>
          </div>
          
          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                setRegisterSuccess(false);
                setEmailConfirmationRequired(false);
                setView('login');
              }}
              className="w-full h-11 bg-[#1A2732] hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      )}

      {registerSuccess && !emailConfirmationRequired && (
        <div className="text-center py-10 space-y-4 font-sans text-xs animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-xl animate-bounce">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium text-neutral-900 leading-none">¡Felicidades, registro completo!</h3>
            <p className="text-xs text-neutral-500">Estamos preparando su almacén, base de datos de comprobantes y padrón fiscal DGII dominicano.</p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2 text-[#1A2732] font-semibold text-[11px]">
            <Loader2 className="w-4 h-4 animate-spin" /> Integrando oficina virtual...
          </div>
        </div>
      )}
    </>
  );
};
