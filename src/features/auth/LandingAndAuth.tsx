import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoFacturaDo, OldLogoFacturaDo } from '../core/LogoFacturaDo';
import { insforge } from '../../lib/insforge';
import HelpManualView from '../help/HelpManualView';
import UserManual from '../help/UserManual';
import * as OTPAuth from 'otpauth';
import { 
  Infinity,
  Eye,
  EyeOff,
  Building, 
  User, 
  Mail, 
  Key, 
  Phone, 
  Check, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  Loader2, 
  MessageSquare, 
  Laptop, 
  ShieldCheck, 
  TrendingUp, 
  FolderOpen, 
  Users, 
  Database,
  ArrowRight,
  HelpCircle,
  HelpCircle as QuestionIcon,
  HelpCircle as FAQIcon,
  HelpCircle as HelpIcon,
  X,
  Menu,
  Lock,
  Plus,
  Zap,
  Rocket,
  Target,
  BarChart3,
  Clock,
  UserPlus,
  Receipt,
  Settings,
  Lightbulb,
  BadgeCheck,
  Sparkles,
  Heart,
  Store,
  Download,
  MonitorSmartphone,
  Apple
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface LandingAndAuthProps {
  onLoginSuccess: (user: any) => void;
  usersList: any[];
  initialView?: 'landing' | 'login' | 'register' | 'ayuda';
  isLoggedIn?: boolean;
}


function LiveCounter() {
  const [count, setCount] = useState(100000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 2));
    }, 300); // Much faster updates for dynamic feel
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-2 py-4 animate-fade-in z-10 mt-6">
      <div className="flex items-baseline gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-sky-100/50 shadow-sm">
        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
          {count.toLocaleString()}
        </span>
        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-sky-600" />
          comercios operando
        </span>
      </div>
      <p className="text-xs text-slate-500 font-medium">¿Qué esperas para unirte al sistema de mayor crecimiento?</p>
    </div>
  );
}

export default function LandingAndAuth({ onLoginSuccess, usersList, initialView = 'landing', isLoggedIn = false }: LandingAndAuthProps) {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 120]);
  const navigate = useNavigate();
  const [view, rawSetView] = useState<'landing' | 'login' | 'register' | 'ayuda'>(initialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaInstructions, setShowPwaInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowPwaInstructions(true);
    }
  };

  const handleDownloadDesktop = (e: React.MouseEvent<HTMLAnchorElement>, os: 'win' | 'mac') => {
    // Para prevenir errores locales de "archivo corrupto" cuando el release no ha sido compilado.
    if (window.location.hostname === 'localhost') {
      e.preventDefault();
      alert(`Para descargar la versión de ${os === 'win' ? 'Windows' : 'Mac'} en entorno local, asegúrate de haber ejecutado 'npm run electron:build' primero y que el archivo exista en la carpeta 'release', o cópialo a 'public/release'.`);
    }
  };

  const [showDownloads, setShowDownloads] = useState(false);

  // Sync state if initialView changes
  useEffect(() => {
    rawSetView(initialView);
  }, [initialView]);

  // ANTI-CLICKJACKING FRAME GUARD
  useEffect(() => {
    try {
      if (window.self !== window.top) {
        const parentUrl = document.referrer;
        const isAllowedSandbox = parentUrl.includes('google.com') || 
                                 parentUrl.includes('ai.studio') || 
                                 parentUrl.includes('run.app') || 
                                 parentUrl.includes('localhost') ||
                                 !parentUrl;
        if (!isAllowedSandbox) {
          console.warn('Bloqueo de Clickjacking activo. Redirigiendo a terminal segura.');
          window.top.location.href = window.location.href;
        }
      }
    } catch (e) {
      // Cross-origin checks blocked, safe by default
    }
  }, []);

  // Brute force / DDoS Prevention state (Client-side request defense)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loginLockedUntil, setLoginLockedUntil] = useState<number | null>(null);

  // Slider controls inside login page
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto slide effect for marketing benefits
  useEffect(() => {
    if (view === 'login' || view === 'register') {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 4500);
      return () => clearInterval(timer);
    }
  }, [view]);
  const slides = [
    {
      title: "Sincronizado en todos tus dispositivos",
      description: "Usa FacturaDo en tu celular, tablet o en tu computador de forma 104% fluida y en tiempo real.",
      benefit: "Soporte Multi-dispositivo de fábrica",
      accent: "bg-[#1A2732]"
    },
    {
      title: "Validez Fiscal DGII Dominicana",
      description: "Emisión automática de comprobantes de Crédito Fiscal (B01), Consumo (B02) y regímenes especiales.",
      benefit: "Padrón DGII totalmente integrado gratis",
      accent: "bg-[#1E2E3C]"
    },
    {
      title: "Control total de tu Caja e Inventarios",
      description: "Controla egresos, ingresos, cuadres diarios de cajas, cuentas por cobrar y stock mínimo.",
      benefit: "Módulos de Finanzas, Bancos y Ventas POS",
      accent: "bg-[#25394B]"
    }
  ];

  // Pricing calculations
  const [billingPeriod, setBillingPeriod] = useState<'Mensual' | 'Trimestral' | 'Anual'>('Mensual');
  const getPrice = (base: number) => {
    if (billingPeriod === 'Trimestral') return (base * 0.9).toFixed(2);
    if (billingPeriod === 'Anual') return (base * 0.75).toFixed(2);
    return base.toFixed(2);
  };

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 3);
  };
  const strength = getPasswordStrength(password);
  const strengthColors = ['bg-neutral-200', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Débil', 'Buena', 'Fuerte'];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 2FA login states
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [pendingLoggedUser, setPendingLoggedUser] = useState<any | null>(null);
  const [totpVerificationCode, setTotpVerificationCode] = useState('');
  const [totpVerificationError, setTotpVerificationError] = useState('');

  // Unified authentication state variables (Apple, Google, Correo Flow)
  const [authStage, setAuthStage] = useState<'methods' | 'email_credentials' | 'remaining_details'>('methods');
  const [socialProviderName, setSocialProviderName] = useState<'Google' | 'Apple' | null>(null);
  const [isEmailRegisterMode, setIsEmailRegisterMode] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const setView = (newView: 'landing' | 'login' | 'register' | 'ayuda') => {
    rawSetView(newView);
    setMobileMenuOpen(false);
    setAuthStage('methods');
    setIsEmailRegisterMode(newView === 'register');
    setLoginError('');
    setEmailConfirmationRequired(false);
    
    // Sync browser URL route path
    if (newView === 'landing') {
      navigate('/');
    } else {
      navigate('/' + newView);
    }
  };

  // FAQ open state
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true
  });

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      title: ["El Futuro de la", "facturación totalmente gratis"],
      description: "Digitaliza la emisión de facturas fiscales, control de inventarios activos, cajas y almacenes sin pagar licencias costosas ni mensualidades. ¡El software premium que tu negocio dominicano merece, libre para siempre!",
      image: "/facturadomockup.png",
      badges: ["NCF Válido", "Multi-dispositivo", "Control de Gastos", "Reportes DGII"]
    },
    {
      title: ["Gestión Inteligente", "de clientes y proveedores"],
      description: "Mantén un registro detallado de todas tus operaciones. Administra cuentas por cobrar, historial de transacciones y mejora las relaciones comerciales de tu negocio con información centralizada.",
      image: "/facturadomockup.png", // Usando la misma para la demo, pero en el futuro se pueden cambiar
      badges: ["Directorio Central", "Cuentas por Cobrar", "Historial Completo", "Fácil Acceso"]
    },
    {
      title: ["Control Total", "de tu inventario"],
      description: "Administra múltiples almacenes, recibe alertas de bajo stock y haz inventarios físicos con facilidad. Toma decisiones basadas en datos reales y maximiza tus ganancias.",
      image: "/facturadomockup.png",
      badges: ["Múltiples Almacenes", "Alertas de Stock", "Kardex Detallado", "Ajustes Rápidos"]
    }
  ];

  useEffect(() => {
    if (view !== 'landing') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [view, heroSlides.length]);


  const toggleFaq = (idx: number) => {
    setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAttemptsLimitCheck = (): boolean => {
    if (loginLockedUntil && Date.now() < loginLockedUntil) {
      const secondsLeft = Math.ceil((loginLockedUntil - Date.now()) / 1000);
      setLoginError(`Acceso suspendido temporalmente por seguridad (Mitigación DDoS / Fuerza Bruta). Intente nuevamente en ${secondsLeft} segundos.`);
      return false;
    }
    return true;
  };

  const registerFailedAttempt = () => {
    setFailedAttempts(prev => {
      const nextVal = prev + 1;
      if (nextVal >= 3) {
        setLoginLockedUntil(Date.now() + 20000); // Lock for 20 seconds
        setLoginError('Demasiados intentos de acceso fallidos consecutivos. Para contrarrestar posibles ataques (DDoS), su sesión ha sido suspendida durante 20 segundos.');
      }
      return nextVal;
    });
  };

  // Handle Form Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleAttemptsLimitCheck()) return;

    if (!email || !password) {
      setLoginError('Por favor complete su correo y clave de acceso.');
      return;
    }

    // Input sanitization against SQL probe and scripting characters
    const hasSuspiciousChars = /[<>'"\\;]/.test(email);
    if (hasSuspiciousChars) {
      setLoginError('Se detectaron caracteres no permitidos en el correo electrónico por motivos de seguridad.');
      return;
    }

    // Regex email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLoginError('Por favor ingrese un formato de correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const { data, error } = await insforge.auth.signInWithPassword({ 
        email: email.trim(), 
        password: password 
      });
      if (error) {
        registerFailedAttempt();
        setLoginError(error.message || 'Error de autenticación. Verifique sus credenciales.');
        setIsSubmitting(false);
        return;
      }

      if (data && data.user) {
        setFailedAttempts(0);
        setLoginLockedUntil(null);
        const loggedUser = {
          id: data.user.id,
          username: data.user.profile?.name || data.user.email.split('@')[0],
          email: data.user.email,
          role: 'Administrador' as const,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
          permissions: {
            canCreateInvoice: true,
            canEditInvoice: true,
            canDeleteInvoice: true,
            canExportReports: true,
            canManageUsers: true
          }
        };

        // Check if 2FA is active for this user
        const is2faActive = localStorage.getItem(`inv_2fa_${data.user.id}`) === 'true';
        if (is2faActive) {
          setPendingLoggedUser(loggedUser);
          setTwoFactorStep(true);
          setIsSubmitting(false);
          setTotpVerificationCode('');
          setTotpVerificationError('');
          return;
        }

        setIsSubmitting(false);
        onLoginSuccess(loggedUser);
      } else {
        setLoginError('No se recibió la sesión del servidor.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
      setIsSubmitting(false);
    }
  };

  const handleVerifyTwoFactorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setTotpVerificationError('');

    if (totpVerificationCode.length !== 6 || isNaN(Number(totpVerificationCode))) {
      setTotpVerificationError('Introduce un código numérico de 6 dígitos.');
      return;
    }

    if (!pendingLoggedUser) return;

    try {
      const secret = localStorage.getItem(`inv_2fa_secret_${pendingLoggedUser.id}`) || '';
      const totp = new OTPAuth.TOTP({
        issuer: 'FacturaDo',
        label: pendingLoggedUser.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret)
      });

      const delta = totp.validate({
        token: totpVerificationCode.trim(),
        window: 2 // Allow clock drift
      });

      if (delta !== null) {
        // Success
        onLoginSuccess(pendingLoggedUser);
        setPendingLoggedUser(null);
        setTwoFactorStep(false);
      } else {
        setTotpVerificationError('Código de verificación incorrecto o expirado.');
      }
    } catch (err: any) {
      setTotpVerificationError('Error al validar el código. Asegúrese de ingresar el código actual de su app.');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleAttemptsLimitCheck()) return;

    if (!registerForm.businessName || !registerForm.ownerName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setLoginError('Todos los campos con asteriscos son mandatorios.');
      return;
    }

    if (!registerForm.agree) {
      setLoginError('Debes aceptar los Términos y Condiciones y las Políticas de Privacidad para continuar.');
      return;
    }

    // Input sanitization / injection checks
    const hasSuspiciousChars = /[<>'"\\;]/.test(registerForm.email) || /[<>'"\\;]/.test(registerForm.businessName) || /[<>'"\\;]/.test(registerForm.ownerName);
    if (hasSuspiciousChars) {
      setLoginError('Se detectaron caracteres no permitidos en los campos de texto por motivos de seguridad.');
      return;
    }

    // Regex email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email.trim())) {
      setLoginError('Por favor ingrese un formato de correo electrónico válido.');
      return;
    }

    // Phone validation for Dominican Republic
    if (registerForm.phone) {
      const cleanPhone = registerForm.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length !== 10) {
        setLoginError('El número de teléfono dominicano debe contener exactamente 10 dígitos (ej. 809-543-9876).');
        return;
      }
      const areaCode = cleanPhone.slice(0, 3);
      if (areaCode !== '809' && areaCode !== '829' && areaCode !== '849') {
        setLoginError('El número de teléfono dominicano debe iniciar con un código de área válido: 809, 829 o 849.');
        return;
      }
    } else {
      setLoginError('El número de teléfono dominicano es requerido para dar validez fiscal a sus documentos.');
      return;
    }

    // Password strength safeguard (Vulnerability #2 / #3)
    if (registerForm.password.length < 6) {
      setLoginError('Por motivos de seguridad, su contraseña debe de contener al menos 6 caracteres.');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setLoginError('La clave de acceso y su confirmación no coinciden.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const { data, error } = await insforge.auth.signUp({
        email: registerForm.email.trim(),
        password: registerForm.password,
        name: registerForm.ownerName
      });

      if (error) {
        setLoginError(error.message || 'Error al crear la cuenta.');
        setIsSubmitting(false);
        return;
      }

      const userId = data?.user?.id || 'temp-' + Date.now();
      const userEmail = data?.user?.email || registerForm.email;

      // Create default business settings record in Postgres database
      try {
        await insforge.database.from('template_settings').insert([{
          id: userId,
          business_name: registerForm.businessName,
          business_rnc: '',
          business_phone: registerForm.phone || '',
          business_email: userEmail,
          business_address: 'Santo Domingo, República Dominicana',
          page_size: 'Letter',
          primary_color: '#000000',
          accent_color: '#171717'
        }]);
      } catch (dbErr) {
        console.warn('Could not insert default template settings', dbErr);
      }

      setIsSubmitting(false);
      setEmailConfirmationRequired(true);
      setRegisterSuccess(true);
    } catch (err: any) {
      setLoginError(err.message || 'Ocurrió un error inesperado al registrar.');
      setIsSubmitting(false);
    }
  };

  const handleRemainingDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.businessName || !registerForm.ownerName) {
      setLoginError('El nombre del comercio y de propietario son obligatorios.');
      return;
    }

    if (!registerForm.agree) {
      setLoginError('Debes aceptar los Términos y Condiciones y las Políticas de Privacidad para continuar.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      let finalUserId = '';
      let finalEmail = registerForm.email;

      if (!socialProviderName) {
        // 1. Email credentials flow -> register only, verification email sent by InsForge
        const signUpResult = await insforge.auth.signUp({
          email: registerForm.email.trim(),
          password: registerForm.password,
          name: registerForm.ownerName
        });

        if (signUpResult.error) {
          setLoginError(signUpResult.error.message || 'Error al crear la cuenta. Por favor verifique los datos.');
          setIsSubmitting(false);
          return;
        }

        finalUserId = signUpResult.data?.user?.id || 'temp-' + Date.now();
        finalEmail = signUpResult.data?.user?.email || registerForm.email;

        // Create default business settings record in Postgres database
        try {
          await insforge.database.from('template_settings').insert([{
            id: finalUserId,
            business_name: registerForm.businessName,
            business_rnc: '',
            business_phone: registerForm.phone || '',
            business_email: finalEmail,
            business_address: 'Santo Domingo, República Dominicana',
            page_size: 'Letter',
            primary_color: '#000000',
            accent_color: '#171717'
          }]);
        } catch (dbErr) {
          console.warn('Could not insert default template settings', dbErr);
        }

        setIsSubmitting(false);
        setEmailConfirmationRequired(true);
        setRegisterSuccess(true);
      } else {
        // 2. Social OAuth flow -> they are already logged in to InsForge
        const { data: authData } = await insforge.auth.getCurrentUser();
        if (authData?.user) {
          finalUserId = authData.user.id;
          finalEmail = authData.user.email;
        } else {
          setLoginError('No se pudo verificar la sesión social activa.');
          setIsSubmitting(false);
          return;
        }

        // Create default business settings record in Postgres database
        try {
          await insforge.database.from('template_settings').insert([{
            id: finalUserId,
            business_name: registerForm.businessName,
            business_rnc: '',
            business_phone: registerForm.phone || '',
            business_email: finalEmail,
            business_address: 'Santo Domingo, República Dominicana',
            page_size: 'Letter',
            primary_color: '#000000',
            accent_color: '#171717'
          }]);
        } catch (dbErr) {
          console.warn('Could not insert default template settings', dbErr);
        }

        // Create custom user profile for local state
        const customUser = {
          id: finalUserId || 'user-' + Date.now().toString().slice(-4),
          username: registerForm.ownerName,
          email: finalEmail,
          role: 'Administrador' as const,
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
          permissions: {
            canCreateInvoice: true,
            canEditInvoice: true,
            canDeleteInvoice: true,
            canExportReports: true,
            canManageUsers: true
          }
        };

        setIsSubmitting(false);
        setRegisterSuccess(true);
        setTimeout(() => {
          onLoginSuccess(customUser);
        }, 1200);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error al completar los datos de registro.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-[#1A2732]/10 selection:text-[#FAFAFA] overflow-x-hidden">
      {/* 1. PUBLIC MARKETING LANDING PAGE VIEW */}
      {view === 'landing' && (
        <div className="flex flex-col min-h-screen">
          
          {/* Header Navigation */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Desktop Logo */}
                <div className="hidden sm:block">
                  <LogoFacturaDo className="h-9 w-auto" />
                </div>
                {/* Mobile Logo using favicon */}
                <div className="block sm:hidden flex items-center gap-2">
                  <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8 shrink-0 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">FacturaDo</span>
                </div>
              </div>

              {/* Desktop Nav Actions */}
              <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 text-[13px] xl:text-sm font-semibold text-slate-600">
                <a href="#funcionalidades" className="hover:text-sky-600 transition-colors whitespace-nowrap">Funcionalidades</a>
                <a href="#testimonios" className="hover:text-sky-600 transition-colors whitespace-nowrap">Opiniones</a>
                <button onClick={() => setView('ayuda')} className="hover:text-sky-600 transition-colors cursor-pointer font-semibold bg-transparent border-0 p-0 text-[13px] xl:text-sm whitespace-nowrap">Centro de Ayuda</button>
                <a href="#faq" className="hover:text-sky-600 transition-colors whitespace-nowrap">Preguntas Frecuentes</a>
              </nav>

              {/* Desktop CTA actions */}
              <div className="hidden md:flex items-center gap-2 xl:gap-3">
                {isLoggedIn ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="whitespace-nowrap px-4 xl:px-6 py-2.5 text-[13px] xl:text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Ir al Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setView('login')}
                      className="whitespace-nowrap px-4 xl:px-5 py-2.5 text-[13px] xl:text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => setView('register')}
                      className="whitespace-nowrap px-4 xl:px-6 py-2.5 text-[13px] xl:text-sm font-bold bg-slate-900 hover:bg-black text-white rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Registrarse Gratis
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <div className="flex lg:hidden items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-slate-200"
                  aria-label="Menú principal"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg"
                >
                  <div className="px-5 py-6 space-y-4 flex flex-col text-left">
                    <a 
                      href="#funcionalidades" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100"
                    >
                      Funcionalidades
                    </a>
                    <a 
                      href="#testimonios" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100"
                    >
                      Opiniones
                    </a>
                    <button 
                      onClick={() => setView('ayuda')} 
                      className="text-left text-sm font-bold text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100 cursor-pointer w-full"
                    >
                      Centro de Ayuda
                    </button>
                    <a 
                      href="#faq" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-slate-700 hover:text-sky-600 py-2.5"
                    >
                      Preguntas Frecuentes
                    </a>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                      {isLoggedIn ? (
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="col-span-2 w-full py-3 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-md cursor-pointer text-center"
                        >
                          Ir al Dashboard
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setView('login')}
                            className="w-full py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200 text-center"
                          >
                            Iniciar Sesión
                          </button>
                          <button
                            onClick={() => setView('register')}
                            className="w-full py-3 text-xs font-bold bg-slate-900 hover:bg-black text-white rounded-xl transition-all shadow-md cursor-pointer text-center"
                          >
                            Registrarse
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Promotional Banner */}
          <div className="w-full bg-slate-50 pt-24 pb-4 px-4 sm:px-6 lg:px-8 flex justify-center border-b border-slate-100/50">
            <button 
              onClick={() => setView('register')} 
              className="cursor-pointer outline-none border-none bg-transparent p-0 block w-full max-w-7xl hover:opacity-95 transition-opacity"
              type="button"
            >
              <img 
                src="https://res.cloudinary.com/dap38hi9l/image/upload/v1782018265/banner_2_znlyym.png" 
                alt="Promoción Especial FacturaDo - Tu software contable en República Dominicana con NCF" 
                title="Promoción Exclusiva FacturaDo"
                className="w-full h-auto object-contain rounded-2xl shadow-sm border border-slate-200/50"
              />
            </button>
          </div>

          {/* Hero Section */}
          <section className="relative overflow-visible bg-gradient-to-b from-white via-white to-white pt-10 border-b border-slate-100">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-64 sm:pb-[420px]">
              <div className="flex flex-col items-center text-center space-y-12">
                
                {/* Hero Top Info */}
                <div className="w-full max-w-4xl flex flex-col items-center relative min-h-[450px] sm:min-h-[380px] lg:min-h-[360px]">

                  
                  <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[280px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex flex-col items-center w-full"
                      >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                          {heroSlides[currentSlide].title[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 block sm:inline">{heroSlides[currentSlide].title[1]}</span>
                        </h1>
                        
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mb-8">
                          {heroSlides[currentSlide].description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-slate-700 font-semibold text-sm">
                          {heroSlides[currentSlide].badges.map((badge, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-100 shrink-0">✓</span>
                              <span>{badge}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>


                  {/* Eliminated Hero Buttons to avoid duplication with Header */}
                  
                  <LiveCounter />



                  {/* Slider Controls */}
                  <div className="flex justify-center gap-2 mt-8 z-10">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-sky-600' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                        aria-label={`Ir a diapositiva ${idx + 1}`}
                      />
                    ))}
                </div>
              </div>

                {/* Hero Bottom Visuals - Dashboard Image */}
                <div className="sticky top-24 sm:top-28 z-10 flex justify-center w-full mt-12 max-w-5xl">
                  <div className="absolute inset-0 bg-sky-200/30 rounded-full blur-3xl transform rotate-3 -z-10" />
                  <motion.div
                    className="relative w-full drop-shadow-2xl"
                  >
                    <motion.img 
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      src={heroSlides[currentSlide].image} 
                      alt="FacturaDo Dashboard" 
                      onClick={() => setIsLightboxOpen(true)}
                      className="w-full h-auto object-contain rounded-xl sm:rounded-3xl shadow-2xl ring-1 ring-slate-900/5 cursor-pointer hover:opacity-95 transition-opacity"
                    />
                  </motion.div>
                </div>



                {/* Lightbox Modal */}
                <AnimatePresence>
                  {isLightboxOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm cursor-pointer"
                        onClick={() => setIsLightboxOpen(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }} 
                        className="relative z-10 w-full max-w-7xl max-h-full flex items-center justify-center"
                      >
                        <button 
                          onClick={() => setIsLightboxOpen(false)}
                          className="absolute -top-12 right-0 text-white hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          <X className="w-8 h-8" />
                        </button>
                        <img 
                          src="/facturadomockup.png" 
                          alt="FacturaDo Dashboard Fullscreen" 
                          className="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                      </motion.div>
                    </div>
                  )}

                  {showPwaInstructions && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm cursor-pointer"
                        onClick={() => setShowPwaInstructions(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }} 
                        className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-xl font-bold text-slate-900 font-heading">Instalar en tu dispositivo</h3>
                          <button 
                            onClick={() => setShowPwaInstructions(false)}
                            className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-6 text-left">
                          <div>
                            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                              <Apple className="w-5 h-5" /> En iPhone / iPad (Safari)
                            </h4>
                            <ol className="text-sm text-slate-600 space-y-2 ml-7 list-decimal">
                              <li>Toca el botón <strong>Compartir</strong> (cuadrado con flecha hacia arriba) en la barra inferior.</li>
                              <li>Desliza hacia abajo y selecciona <strong>"Agregar a Inicio"</strong>.</li>
                            </ol>
                          </div>
                          
                          <div>
                            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                              <MonitorSmartphone className="w-5 h-5" /> En Android (Chrome)
                            </h4>
                            <ol className="text-sm text-slate-600 space-y-2 ml-7 list-decimal">
                              <li>Toca el icono de <strong>Menú</strong> (tres puntos) arriba a la derecha.</li>
                              <li>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</li>
                            </ol>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                              <Laptop className="w-5 h-5" /> En Computadora (Chrome/Edge)
                            </h4>
                            <p className="text-sm text-slate-600 ml-7">
                              Haz clic en el icono de instalación que aparece en el lado derecho de la <strong>barra de direcciones (URL)</strong> del navegador.
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setShowPwaInstructions(false)}
                          className="w-full mt-8 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
                        >
                          Entendido
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </section>

                    {/* SECCION ILIMITADO Y GRATIS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="py-16 sm:py-24 bg-slate-900 relative z-20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15),transparent_70%)]" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col items-center text-center space-y-8">
                
                <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  <Infinity className="w-4 h-4" />
                  Totalmente Gratis. Sin Límites.
                </div>
                
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight max-w-4xl">
                  Todo el poder de FacturaDo <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Sin Restricciones</span>
                </h2>
                
                <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
                  No pagues suscripciones abusivas. Crece tu negocio sin preocuparte por límites de uso. Todo incluido desde el primer día.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 w-full pt-8">
                  {[
                    { label: 'Facturas', icon: Receipt },
                    { label: 'Ventas y POS', icon: Store },
                    { label: 'Usuarios', icon: Users },
                    { label: 'Reportes DGII', icon: BarChart3 },
                    { label: 'Clientes', icon: UserPlus },
                    { label: 'Inventario', icon: Database },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-slate-800 hover:border-sky-500/30 transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center group-hover:bg-sky-500/10 group-hover:scale-110 transition-all">
                        <item.icon className="w-6 h-6 text-slate-300 group-hover:text-sky-400 transition-colors" />
                      </div>
                      <span className="text-white font-bold text-[13px] sm:text-sm">{item.label}</span>
                      <span className="text-sky-400 text-[10px] sm:text-xs font-extrabold bg-sky-400/10 px-2.5 py-1 rounded-md tracking-wider uppercase">Ilimitado</span>
                    </div>
                  ))}
                </div>

                <div className="pt-10">
                  <button
                    onClick={() => setView('register')}
                    className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-bold text-base transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 duration-200"
                  >
                    Empieza Ya - Es Gratis <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </div>
            </div>
          </motion.section>

          {/* Empieza a Facturar en 2 Minutos */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="py-20 sm:py-28 bg-white relative z-20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.04),transparent_60%)]" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  <Zap className="w-3.5 h-3.5" />
                  Rápido y Sencillo
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
                  Empieza a facturar en <span className="text-emerald-600">2 minutos</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
                  Sin instalaciones complicadas, sin contratos. Crea tu cuenta y emite tu primera factura fiscal al instante.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 max-w-5xl mx-auto">
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0 }}
                  className="relative group"
                >
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-7 h-7 text-sky-600" />
                    </div>
                    <div className="text-[11px] font-bold text-sky-600 uppercase tracking-widest mb-2">Paso 1</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Crea tu cuenta gratis</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Registra tu negocio con nombre, RNC y correo. Sin tarjeta de crédito ni compromisos de pago.</p>
                  </div>
                  <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-slate-300" />
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="relative group"
                >
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Settings className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2">Paso 2</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Configura tu secuencia NCF</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Agrega tus secuencias de comprobantes fiscales (B01, B02, B14, B15) y personaliza tu plantilla.</p>
                  </div>
                  <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-slate-300" />
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Receipt className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Paso 3</div>
                    <h3 className="text-lg font-bold text-white mb-2 font-heading">¡Factura al instante!</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Emite facturas, cotizaciones y recibos con NCF válido. Imprime o envía por correo directamente.</p>
                  </div>
                </motion.div>
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => setView('register')}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mx-auto hover:-translate-y-0.5 duration-150"
                >
                  <Rocket className="w-5 h-5" />
                  Crear mi cuenta ahora — Es gratis
                </button>
              </div>
            </div>
          </motion.section>

          {/* Features Grid: What you can do with FacturaDo */}
          <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="funcionalidades" className="py-16 sm:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <span className="text-sky-600 font-bold uppercase tracking-widest text-xs sm:text-sm block">Poderosas Funcionalidades</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Todo lo que tu comercio necesita</h2>
                <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
                  Diseñado para simplificar tu operación comercial y fiscal sin complicaciones financieras ni barreras tecnológicas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Controla tu flujo de caja */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-extrabold shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-wide">Caja y Flujo de Efectivo</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Lleva un control diario de aperturas, egresos, ventas en efectivo o tarjeta, y haz tus cuadres de caja sin errores.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold tracking-wide block pt-2 border-t border-slate-50 uppercase">Cuadre rápido integrado</span>
                </div>

                {/* 2. Gestiona tu inventario */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-extrabold shrink-0">
                      <FolderOpen className="w-5 h-5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-wide">Inventario e Historial</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Conoce las existencias exactas en tus almacenes, configura alertas de stock mínimo y recibe avisos automáticos de reposición.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold tracking-wide block pt-2 border-t border-slate-50 uppercase">Alertas de stock mínimo</span>
                </div>

                {/* 3. Accede desde cualquier dispositivo */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-extrabold shrink-0">
                      <Laptop className="w-5 h-5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-wide">Multiplataforma Nube</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Administra desde tu computadora de escritorio, tablet o celular en tiempo real con sincronización instantánea.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold tracking-wide block pt-2 border-t border-slate-50 uppercase">Acceso ilimitado 24/7</span>
                </div>

                {/* 4. Decisiones con datos reales */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-extrabold shrink-0">
                      <Database className="w-5 h-5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-wide">Estadísticas y Reportes</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Visualiza tus ingresos, egresos y márgenes netos de utilidad en gráficos claros para una toma de decisiones informada.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold tracking-wide block pt-2 border-t border-slate-50 uppercase">Reportes detallados en vivo</span>
                </div>

                {/* 5. Clientes y Proveedores */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 font-extrabold shrink-0">
                      <Users className="w-5 h-5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-wide">Directorio Inteligente</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Registra clientes y proveedores con RNC/Cédula y gestiona cuentas por cobrar de manera centralizada y ágil.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold tracking-wide block pt-2 border-t border-slate-50 uppercase">Cuentas por cobrar integradas</span>
                </div>

                {/* 6. Formaliza tu negocio con la DGII */}
                <div className="bg-white border border-emerald-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left space-y-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-extrabold shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-wide">Formatos 606 y 607 DGII</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Genera automáticamente los formatos exigidos por la DGII listos para enviar a la oficina virtual, eliminando el trabajo manual.
                    </p>
                  </div>
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold block text-center uppercase">100% libre de errores</span>
                </div>

              </div>

              <div className="pt-4">
                <button
                  onClick={() => setView('register')}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base transition-all cursor-pointer shadow-md hover:-translate-y-0.5 duration-150"
                >
                  Comenzar gratis ahora
                </button>
              </div>
            </div>
          </motion.section>

          {/* Redesigned NCF / DGII comparison table based on UI/UX Pro Max */}
          <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="comparativa" className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <span className="text-sky-600 font-bold uppercase tracking-widest text-xs sm:text-sm block">Comparación Transparente</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">FacturaDo frente a las alternativas</h2>
                <p className="text-base sm:text-lg text-slate-500">
                  Compara por qué cientos de comerciantes dominicanos han migrado su facturación fiscal con nosotros.
                </p>
              </div>

              {/* Comparison table */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-sm bg-white">
                <table className="w-full min-w-[640px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 sm:p-5 text-sm font-bold text-slate-700 w-1/3">Características</th>
                      <th className="p-4 sm:p-5 text-sm font-bold text-sky-700 bg-sky-50/50 border-x border-sky-100 text-center w-1/4">
                        <span className="inline-block px-2.5 py-0.5 text-[10px] bg-sky-100 text-sky-800 rounded-full font-bold uppercase tracking-wider mb-1">Tu Opción</span>
                        <span className="block text-base font-extrabold text-slate-900">FacturaDo</span>
                      </th>
                      <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500 text-center w-1/4">Sistemas Tradicionales</th>
                      <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500 text-center w-1/4">Excel o Papel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-800 text-sm">Costo Mensual</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 border-x border-sky-100 text-center text-sm font-bold text-emerald-600">
                        RD$ 0 <span className="block text-[10px] text-slate-400 font-normal">Gratis de por vida</span>
                      </td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">RD$ 3,000 - RD$ 6,000+</td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500 font-semibold text-emerald-600">Gratis <span className="block text-[10px] text-slate-400 font-normal">(Requiere mucho tiempo)</span></td>
                    </tr>

                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-800 text-sm">Validación DGII R.D.</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 border-x border-sky-100 text-center text-sm text-slate-700 font-medium">
                        <span className="text-emerald-600 font-bold block">✓ Automática</span>
                        <span className="text-[10px] text-slate-400">Consulta en vivo padrón DGII</span>
                      </td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Manual / Requiere módulo de costo adicional</td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Inexistente (Sujeto a multas fiscales)</td>
                    </tr>

                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-800 text-sm">Reportes 606 y 607</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 border-x border-sky-100 text-center text-sm text-slate-700 font-medium">
                        <span className="text-emerald-600 font-bold block">✓ 1 Solo Clic</span>
                        <span className="text-[10px] text-slate-400">Listos para subir a oficina virtual</span>
                      </td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Complejo / Requiere intervención contable</td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Manual (Horas tabulando celda por celda)</td>
                    </tr>

                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-800 text-sm">Dispositivos en Simultáneo</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 border-x border-sky-100 text-center text-sm text-slate-700 font-medium">
                        <span className="text-emerald-600 font-bold block">✓ Ilimitados</span>
                        <span className="text-[10px] text-slate-400">Celular, Tablet y PC sync</span>
                      </td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Instalación local por máquina (cobro extra)</td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Un solo archivo (No compartido)</td>
                    </tr>

                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-800 text-sm">Módulo Inventario / POS</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 border-x border-sky-100 text-center text-sm text-slate-700 font-medium">
                        <span className="text-emerald-600 font-bold block">✓ Incluidos</span>
                        <span className="text-[10px] text-slate-400">Todo en una sola cuenta</span>
                      </td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Se cobran como módulos separados</td>
                      <td className="p-4 sm:p-5 text-center text-sm text-slate-500">Manual en hojas de cálculo separadas</td>
                    </tr>

                  </tbody>
                </table>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between text-left gap-4 max-w-4xl mx-auto">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">Únete gratis y simplifica la administración de tu negocio</h4>
                  <p className="text-sm text-slate-500">Disfruta de todos los beneficios premium de FacturaDo sin pagar suscripciones ni licencias.</p>
                </div>
                <button
                  onClick={() => setView('register')}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg shrink-0 transition-all cursor-pointer"
                >
                  Registrarse Gratis de Por Vida
                </button>
              </div>

            </div>
          </motion.section>

          {/* Diseñado para Emprendedores */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="py-20 sm:py-28 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_60%)]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Column - Text */}
                <div className="space-y-8">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-amber-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" />
                      Para Emprendedores
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-tight">
                      Diseñado para <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">emprendedores</span> dominicanos
                    </h2>
                    <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed">
                      No necesitas ser contador ni experto en tecnología. FacturaDo simplifica la facturación fiscal para que tú te enfoques en vender y hacer crecer tu negocio.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Target, title: 'Enfócate en vender', desc: 'La facturación se resuelve en segundos. Tú dedícate a tus clientes.' },
                      { icon: Lightbulb, title: 'Sin curva de aprendizaje', desc: 'Interfaz intuitiva que cualquier miembro de tu equipo domina al instante.' },
                      { icon: BarChart3, title: 'Decisiones con datos', desc: 'Reportes de ventas, cuadre de caja y 606/607 listos para la DGII.' },
                      { icon: Heart, title: 'Soporte humano local', desc: 'Asistencia en español por WhatsApp cuando lo necesites.' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="flex gap-4 items-start group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/15 transition-colors">
                          <item.icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={() => setView('register')}
                    className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-0.5 duration-150 flex items-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Empezar gratis ahora
                  </button>
                </div>

                {/* Right Column - Stats Cards */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  {[
                    { value: '100%', label: 'Gratis para siempre', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', textColor: 'text-emerald-400' },
                    { value: '<2 min', label: 'Tiempo de registro', color: 'from-sky-500/20 to-sky-600/10', border: 'border-sky-500/20', textColor: 'text-sky-400' },
                    { value: '24/7', label: 'Acceso desde cualquier lugar', color: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/20', textColor: 'text-violet-400' },
                    { value: '0 RD$', label: 'Sin cuotas mensuales', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', textColor: 'text-amber-400' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-6 sm:p-7 text-center hover:scale-105 transition-transform duration-300`}
                    >
                      <div className={`text-3xl sm:text-4xl font-extrabold font-heading ${stat.textColor} mb-1.5`}>{stat.value}</div>
                      <div className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Business Niches Select / Treinta layout */}
          <section className="py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
              <div className="max-w-3xl mx-auto space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">Diseñado para todo tipo de comercio en R.D.</h2>
                <p className="text-sm sm:text-base text-slate-500">FacturaDo es flexible y está adaptado para acomodar las necesidades comerciales locales.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left font-sans">
                {/* Gastronómico */}
                <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Gastronomía</h3>
                    <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                      <li>• Restaurantes y Pizzerías</li>
                      <li>• Cafeterías y Reposterías</li>
                      <li>• Bares y Foodtrucks Dominicanos</li>
                    </ul>
                  </div>
                  <button onClick={() => setView('register')} className="text-xs text-sky-600 font-bold flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                    Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
                  </button>
                </div>

                {/* Comercio */}
                <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Comercios</h3>
                    <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                      <li>• Tiendas de Ropa y Calzado</li>
                      <li>• Ferreterías y Constructoras</li>
                      <li>• Farmacias y Tiendas de Celulares</li>
                    </ul>
                  </div>
                  <button onClick={() => setView('register')} className="text-xs text-sky-600 font-bold flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                    Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
                  </button>
                </div>

                {/* Servicios */}
                <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Servicios</h3>
                    <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                      <li>• Consultorías Profesionales</li>
                      <li>• Clínicas y Salones de Estética</li>
                      <li>• Talleres mecánicos y Courier</li>
                    </ul>
                  </div>
                  <button onClick={() => setView('register')} className="text-xs text-sky-600 font-bold flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                    Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
                  </button>
                </div>

                {/* Mercados */}
                <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Distribución / Retail</h3>
                    <ul className="text-sm text-slate-500 space-y-1.5 font-medium">
                      <li>• Colmados y Minimarkets</li>
                      <li>• Repuestos e Importadoras</li>
                      <li>• Mayoristas y Suplidores</li>
                    </ul>
                  </div>
                  <button onClick={() => setView('register')} className="text-xs text-sky-600 font-bold flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left">
                    Conocer más <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 duration-100" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section (Totally Free style) */}
          <section id="planes" className="py-16 sm:py-24 bg-white border-b border-slate-100 text-center space-y-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase text-sky-700 block tracking-widest bg-sky-50 max-w-max mx-auto px-3.5 py-1 rounded-full border border-sky-100">Sin Suscripción • 100% Libre</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight leading-none">FacturaDo es 100% Gratis para Todos</h2>
                <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">Creemos en el desarrollo de las pymes dominicanas. Utiliza todos los módulos premium sin trucos de cobro ni límites de facturación.</p>
              </div>

              {/* Free Feature Bento Highlight */}
              <div className="bg-slate-50 border border-slate-200/60 p-8 sm:p-10 rounded-3xl max-w-4xl mx-auto shadow-sm space-y-8 text-left font-sans relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <span className="text-emerald-600 text-sm font-bold uppercase tracking-wider block">✔ Todo Incluido de Por Vida</span>
                      <h3 className="text-xl font-extrabold text-slate-950 font-heading">¿Cómo es posible?</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Nuestra meta es facilitar la digitalización contable en República Dominicana. Automatiza tu facturación fiscal, controla tus inventarios y genera tus reportes 606/607 sin pagar licencias de software complejas.
                      </p>
                    </div>

                    <div className="space-y-3 font-semibold text-sm text-slate-700">
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                        <span>Terminales de caja (POS) totalmente ilimitados</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                        <span>Emisión integral de NCF (Crédito Fiscal, Consumo, etc.)</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                        <span>Módulos analíticos completos de compras y ventas</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-600 block shrink-0 text-base">✔</span>
                        <span>Generador automático de reportes formato 606 y 607</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 text-center space-y-6 shadow-sm">
                    <div className="space-y-1">
                      <span className="text-5xl sm:text-6xl font-heading font-extrabold text-slate-900 tracking-tight block">RD$ 0</span>
                      <span className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Cero mensualidades • Cero costos ocultos</span>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setView('register')}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-2xl text-sm sm:text-base tracking-wide transition-all block text-center cursor-pointer uppercase shadow-sm h-14 flex items-center justify-center"
                      >
                        Crear Cuenta Gratis Ahora
                      </button>
                      <p className="text-xs text-slate-400 font-medium">Únete a cientos de comerciantes dominicanos que ya confían en nosotros</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Social Testimonials Block */}
          <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="testimonios" className="py-16 bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
              <div className="max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight leading-none">Historias de Éxito Locales</h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-normal">Miles de comerciantes dominicanos respaldan la velocidad de FacturaDo para automatizar su administración.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Testimonial 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4 font-sans hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="Carlos Rodriguez" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-slate-900 leading-none">Carlos Rodríguez</span>
                      <span className="text-[10px] text-slate-400 block leading-none mt-1">Ferretería El Canal SRL, Santo Domingo</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-relaxed">
                    "Antes perdía preciadas horas tabulando las compras de mis proveedores. FacturaDo nos ayudó a generar los reportes mensuales de la DGII en un solo clic."
                  </p>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4 font-sans hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="Ana Herrera" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-slate-900 leading-none">Ana M. Herrera</span>
                      <span className="text-[10px] text-slate-400 block leading-none mt-1">Salón & Estética Glamour, Santiago</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-relaxed">
                    "Tener el POS en la tablet nos libera de cables molestos. El cliente recibe su recibo por correo al instante y nosotros cuadramos cajas sin fallar."
                  </p>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4 font-sans hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" alt="Joel Almonte" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-slate-900 leading-none">Joel Almonte</span>
                      <span className="text-[10px] text-slate-400 block leading-none mt-1">Súper Colmado El Sol, La Romana</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-relaxed">
                    "En República Dominicana es mandatorio cumplir con la validación de RNC y cédulas de clientes de forma segura. FacturaDo lo hace automático."
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* FAQ Accordion Section (Page 3 of Screenshot style) */}
          <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200 text-center space-y-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="space-y-2">
                <span className="text-sky-600 font-bold uppercase tracking-widest text-xs block">Respuestas Rápidas</span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight leading-none">Preguntas frecuentes sobre FacturaDo</h2>
                <p className="text-xs text-slate-400">Resolvemos las principales dudas sobre la integración fiscal dominicana y la facturación digital.</p>
              </div>

              <div className="space-y-3 text-left font-sans text-xs">
                
                {/* FAQ 1 */}
                <div className="bg-slate-50 border rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(0)}
                    className="w-full flex items-center justify-between p-4 font-bold text-slate-800 hover:bg-slate-100 text-left outline-none gap-2 border-0 bg-transparent"
                  >
                    <span>¿Qué es FacturaDo y cómo funciona para declarar a la DGII?</span>
                    <span className="font-bold text-slate-400 text-lg">{faqOpen[0] ? '−' : '+'}</span>
                  </button>
                  {faqOpen[0] && (
                    <div className="px-4 pb-4 text-slate-500 leading-relaxed font-normal border-t border-slate-200/50 pt-3">
                      FacturaDo es una plataforma web y móvil para control administrative y fiscal. Le permite registrar sus facturas y registrar los tipos de comprobantes fiscales (B01, B02, B14, B15), para luego exportar directamente los archivos de texto requeridos por los formatos 606, 607 y 608 de la DGII Dominicana sin errores de numeración.
                    </div>
                  )}
                </div>

                {/* FAQ 2 */}
                <div className="bg-slate-50 border rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(1)}
                    className="w-full flex items-center justify-between p-4 font-bold text-slate-800 hover:bg-slate-100 text-left outline-none gap-2 border-0 bg-transparent"
                  >
                    <span>¿Requiere conexión a internet activa para facturar en el POS?</span>
                    <span className="font-bold text-slate-400 text-lg">{faqOpen[1] ? '−' : '+'}</span>
                  </button>
                  {faqOpen[1] && (
                    <div className="px-4 pb-4 text-slate-500 leading-relaxed font-normal border-t border-slate-200/50 pt-3">
                      Sí. Para validar los nombres fiscales de los clientes en tiempo real contra la base de datos oficial del padrón DGII, el sistema requiere conexión a internet estable. De lo contrario, registrará la factura de forma normal del padrón clásico offline.
                    </div>
                  )}
                </div>

                {/* FAQ 3 */}
                <div className="bg-slate-50 border rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(2)}
                    className="w-full flex items-center justify-between p-4 font-bold text-slate-800 hover:bg-slate-100 text-left outline-none gap-2 border-0 bg-transparent"
                  >
                    <span>¿Es seguro guardar mi información contable e inventarios en la nube?</span>
                    <span className="font-bold text-slate-400 text-lg">{faqOpen[2] ? '−' : '+'}</span>
                  </button>
                  {faqOpen[2] && (
                    <div className="px-4 pb-4 text-slate-500 leading-relaxed font-normal border-t border-slate-200/50 pt-3">
                      Totalmente seguro. Utilizamos cifrado AES-256 en servidores de Google Cloud Run, garantizando copias de seguridad cada 2 horas para que nunca pierda su stock de productos o reportes históricos de cierre de caja.
                    </div>
                  )}
                </div>

              </div>

            </div>
          </section>

          
          {/* Testimonios Section */}
          <section id="testimonios" className="py-16 sm:py-24 bg-white border-t border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl -z-10 -mr-20 -mt-20" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <span className="text-amber-600 font-bold uppercase tracking-widest text-xs sm:text-sm block">Casos de Éxito</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Comercios que confían en FacturaDo</h2>
                <p className="text-base sm:text-lg text-slate-500">
                  No tome solo nuestra palabra. Vea lo que dueños de negocios dominicanos opinan de nuestra plataforma.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex gap-1 text-amber-400 mb-4">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-700 italic mb-6">"Poder facturar y generar los reportes de la DGII en un solo clic me ahorra días de trabajo y pago de igualas complejas. Mi negocio está más organizado que nunca."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">C</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Carlos Méndez</p>
                      <p className="text-xs text-slate-500">Ferretería Méndez, Santiago</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex gap-1 text-amber-400 mb-4">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-700 italic mb-6">"El módulo de POS es rapidísimo y el cuadre de caja al final del día ahora es exacto. Saber que todo está guardado en la nube me da mucha tranquilidad."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">M</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">María Rosario</p>
                      <p className="text-xs text-slate-500">Boutique MR, Distrito Nacional</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex gap-1 text-amber-400 mb-4">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-700 italic mb-6">"Antes gastaba miles de pesos en sistemas lentos de escritorio. FacturaDo no solo es más moderno y fácil de usar, ¡sino que no pago licencias!"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold">J</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">José Pimentel</p>
                      <p className="text-xs text-slate-500">Super Colmado José, La Romana</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comparativa Section (SEO & Conversion) */}
          <section id="comparativa" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200 overflow-hidden relative">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl -z-10 -ml-20 -mt-20" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <span className="text-sky-600 font-bold uppercase tracking-widest text-xs sm:text-sm block">Análisis Competitivo</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">La mejor alternativa a QuickBooks, Alegra y Odoo en RD</h2>
                <p className="text-base sm:text-lg text-slate-500">
                  Descubre por qué cientos de pymes locales están migrando a FacturaDo, el único software diseñado 100% en torno al cumplimiento fiscal de la DGII.
                </p>
              </div>

              {/* Comparison Table for Desktop, Stacked Cards for Mobile */}
              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="p-6 text-sm font-bold text-slate-900 uppercase tracking-wide bg-slate-50 rounded-tl-3xl">Característica</th>
                      <th className="p-6 text-sm font-extrabold text-sky-700 bg-sky-50 border-x border-sky-100 text-center">FacturaDo</th>
                      <th className="p-6 text-sm font-bold text-slate-500 text-center">QuickBooks / Odoo</th>
                      <th className="p-6 text-sm font-bold text-slate-500 text-center rounded-tr-3xl">Alegra / Cashflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 text-sm font-semibold text-slate-800">Costo Mensual Base</td>
                      <td className="p-5 text-center font-extrabold text-emerald-600 bg-sky-50/30 border-x border-sky-100/50">RD$ 0 (Gratis)</td>
                      <td className="p-5 text-center text-sm text-slate-500">$30+ USD al mes</td>
                      <td className="p-5 text-center text-sm text-slate-500">$25+ USD al mes</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 text-sm font-semibold text-slate-800">Formatos DGII 606 y 607 Nativos</td>
                      <td className="p-5 text-center bg-sky-50/30 border-x border-sky-100/50"><span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Automático</span></td>
                      <td className="p-5 text-center text-sm text-slate-500"><span className="text-red-500">Módulo Externo</span></td>
                      <td className="p-5 text-center text-sm text-slate-500">Incluido</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 text-sm font-semibold text-slate-800">Punto de Venta (POS) Ilimitado</td>
                      <td className="p-5 text-center bg-sky-50/30 border-x border-sky-100/50"><span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Sí</span></td>
                      <td className="p-5 text-center text-sm text-slate-500">Costo Extra</td>
                      <td className="p-5 text-center text-sm text-slate-500">Límites por Plan</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 text-sm font-semibold text-slate-800">Validación RNC en Tiempo Real</td>
                      <td className="p-5 text-center bg-sky-50/30 border-x border-sky-100/50"><span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Sí</span></td>
                      <td className="p-5 text-center text-sm text-slate-500"><span className="text-red-500">No soportado</span></td>
                      <td className="p-5 text-center text-sm text-slate-500">Sí</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                      <td className="p-5 text-sm font-semibold text-slate-800 rounded-bl-3xl">Límites de Emisión de Facturas</td>
                      <td className="p-5 text-center font-bold text-slate-900 bg-sky-50 border-x border-sky-100">Ilimitado</td>
                      <td className="p-5 text-center text-sm text-slate-500">Según Plan</td>
                      <td className="p-5 text-center text-sm text-slate-500 rounded-br-3xl">Límite de Documentos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* CTA Footer Form */}
          <section className="py-16 bg-[#1A2732] text-white text-center space-y-6">
            <div className="max-w-3xl mx-auto px-4 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading">Únete hoy a la comunidad de FacturaDo</h2>
              <p className="text-xs text-white/70">Eleve el control financiero de su negocio dominicano con la plataforma de mayor crecimiento local.</p>
              <div className="pt-2">
                <button
                  onClick={() => setView('register')}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold uppercase rounded-xl shadow-lg cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
                >
                  Registrar mi cuenta gratis
                </button>
              </div>
            </div>
          </section>



          {/* Mini Real Footer Section */}
          <footer className="bg-neutral-900 text-neutral-400 py-10 text-xs border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="space-y-2">
                <LogoFacturaDo className="h-6 w-auto brightness-0 invert mx-auto md:mx-0" />
                <p className="text-[11px] text-neutral-500">Simplificando las operaciones tributarias dominicanas.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-neutral-200 block uppercase text-[10px] tracking-wider mb-2">Producto</span>
                <span className="block">Facturación Clásica</span>
                <button onClick={() => setView('ayuda')} className="block text-left text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 text-xs cursor-pointer mx-auto md:mx-0 outline-none pb-0.5 font-sans">
                  Centro de Ayuda
                </button>
                <span className="block">Reporterías DGII (606, 607)</span>
                <span className="block">Puntos de Ventas (Cafés/Retail)</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-neutral-200 block uppercase text-[10px] tracking-wider mb-2">Legal</span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="block text-left text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 text-xs cursor-pointer mx-auto md:mx-0 outline-none"
                >
                  Términos y Condiciones
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="block text-left text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 text-xs cursor-pointer mx-auto md:mx-0 outline-none py-1"
                >
                  Políticas de Uso y Privacidad
                </button>
              </div>

            </div>
            <div className="text-center pt-8 mt-8 border-t border-neutral-800 text-[10px] text-neutral-600 font-sans">
              © 2026 FacturaDo. Sincronizado fiscalmente para República Dominicana. Todos los derechos reservados.
            </div>
          </footer>



        </div>
      )}

      {/* 1.5 OUTSIDE THE WEB OFFICIAL HELP CENTER (ACCESSIBLE TO GUESTS) */}
      {view === 'ayuda' && (
        <div className="min-h-screen bg-white flex flex-col justify-between">
          <header className="sticky top-0 z-50 bg-white border-b border-neutral-150 backdrop-blur-md bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
                {/* Desktop Logo */}
                <div className="hidden sm:block">
                  <LogoFacturaDo className="h-9 w-auto" />
                </div>
                {/* Mobile Logo using favicon */}
                <div className="block sm:hidden flex items-center gap-2">
                  <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8 shrink-0 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-lg font-bold tracking-tight text-[#1A2732] font-sans">FacturaDo</span>
                </div>
              </div>
              <button
                onClick={() => setView('landing')}
                className="px-5 py-2.5 text-xs font-bold text-[#1A2732] hover:bg-neutral-100 rounded-xl transition-all cursor-pointer border border-neutral-200"
              >
                ← Volver al Portal
              </button>
            </div>
          </header>
          
          <div className="flex-1 bg-neutral-50/50 py-4">
            <HelpManualView onBackToLanding={() => setView('landing')} isInsideApp={false} />
          </div>

          <footer className="bg-neutral-900 text-neutral-400 py-6 text-xs border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <LogoFacturaDo className="h-5 w-auto brightness-0 invert" />
                <span className="text-[10px] text-neutral-500">Apoyo operacional y tributario 24/7.</span>
              </div>
              <div className="text-[10px] text-neutral-500">
                © 2026 FacturaDo. Todos los derechos reservados.
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* 2. SECURITY SPLIT SCREEN VIEW FOR LOGIN & REGISTRATION */}
      {(view === 'login' || view === 'register') && (
        <div className="flex flex-col lg:flex-row min-h-screen">
          
          {/* LEFT PANEL: slider benefit slider cards (slate bg gradient) */}
          <div className="hidden lg:flex lg:w-5/12 bg-neutral-900 text-white p-12 flex-col justify-between relative selection:bg-white/10 selection:text-white">
            <div className="relative z-10">
              <button
                onClick={() => setView('landing')}
                className="flex items-center gap-1.5 text-xs font-bold hover:text-white/85 transition-colors cursor-pointer text-left focus:outline-none"
              >
                ← Volver a Inicio
              </button>
            </div>

            <div className="my-auto space-y-8 z-10 text-left">
              {/* Logo highlight */}
              <div className="flex items-center gap-2">
                <LogoFacturaDo className="h-9 w-auto brightness-0 invert" />
              </div>

              {/* Slider screen container with framer motion entry */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <span className="px-2.5 py-0.5 bg-white/10 text-white text-[9.5px] font-extrabold uppercase rounded border border-white/20 tracking-wider">
                    {slides[activeSlide].benefit}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white font-heading">
                    {slides[activeSlide].title}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm font-normal leading-relaxed">
                    {slides[activeSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Bullet page indicators */}
              <div className="flex items-center gap-2">
                {slides.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setActiveSlide(sIdx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${sIdx === activeSlide ? 'w-6 bg-white' : 'w-2 bg-neutral-600'}`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom credential text */}
            <div className="z-10 text-[10px] text-neutral-500 font-sans tracking-wide text-left">
              AUTOCORRECTO • CONEXIÓN PROTEGIDA POR SSL AES-256
            </div>

            <div className="absolute inset-0 bg-radial-gradient from-[#1A2732] to-[#0A1015] opacity-95 shrink-0" />
          </div>

          {/* RIGHT PANEL: actual interactive login of seed data / input details */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 bg-white py-12 relative">
            
            {/* Top mobile navigation */}
            <div className="absolute top-6 left-6 flex lg:hidden">
              <button
                onClick={() => {
                  setView('landing');
                  setAuthStage('methods');
                }}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer animate-fade-in"
              >
                ← Volver al Inicio
              </button>
            </div>

            <div id="unified-auth-container" className="max-w-md w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${view}-${authStage}-${registerSuccess}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="space-y-6"
                >
              
              {/* Header intro */}
              {!registerSuccess && (
                <div className="text-center lg:text-left space-y-2">
                  {/* Mobile Mobile/Tablet Logo using favicon */}
                  <div className="flex items-center justify-center lg:justify-start lg:hidden mb-4 gap-2">
                    <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8 shrink-0 object-contain" referrerPolicy="no-referrer" />
                    <span className="text-lg font-bold tracking-tight text-[#1A2732] font-sans">FacturaDo</span>
                  </div>
                  
                  {authStage === 'methods' && (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-heading">
                        {view === 'login' ? 'Inicia sesión en FacturaDo' : 'Crea tu cuenta de comercio'}
                      </h2>
                      <p className="text-sm text-neutral-500 leading-normal">
                        Selecciona un método de acceso instantáneo y seguro para ingresar a tu terminal comercial de FacturaDo.
                      </p>
                    </>
                  )}

                  {authStage === 'email_credentials' && (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-heading">
                        {isEmailRegisterMode ? 'Registrarme con Correo' : 'Iniciar sesión con Correo'}
                      </h2>
                      <p className="text-sm text-neutral-500 leading-normal">
                        {isEmailRegisterMode 
                          ? 'Crea tu cuenta con correo electrónico y luego configura los datos de tu comercio en el Paso 2.'
                          : 'Ingresa con tus credenciales de FacturaDo o de tutoría.'}
                      </p>
                    </>
                  )}

                  {authStage === 'remaining_details' && (
                    <>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase rounded-full border border-emerald-150 tracking-wider">
                        Paso 2: Datos de Registro
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-heading">
                        Completar Datos de tu Comercio
                      </h2>
                      <p className="text-sm text-neutral-500 leading-normal">
                        Por favor completa los datos restantes para configurar tu terminal comercial y activar el padrón fiscal DGII.
                      </p>
                    </>
                  )}
                </div>
              )}

              {loginError && !registerSuccess && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-sans text-left animate-fade-in flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">!</span>
                  <span>{loginError}</span>
                </div>
              )}

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
                          setRegisterForm({ ...registerForm, agree: e.target.checked });
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
                    className="w-full h-12 bg-white hover:bg-neutral-50 border border-neutral-250 hover:border-neutral-400 text-neutral-800 font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer text-sm uppercase tracking-wider"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92(3.28-4.74 3.28-8.09z" />
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
                    className="w-full h-12 bg-neutral-900 hover:bg-neutral-850 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer text-sm uppercase tracking-wider"
                  >
                    <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.13.67-2.85 1.49-.62.72-1.16 1.87-1.01 2.98 1.1.09 2.16-.57 2.87-1.41Z" />
                    </svg>
                    <span>{view === 'register' ? 'Registrarse con Apple' : 'Iniciar con Apple'}</span>
                  </button>

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
                    className="w-full h-12 bg-white hover:bg-neutral-55 border border-neutral-250 text-[#1A2732] font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer text-sm uppercase tracking-wider"
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
                        className="text-[#1A2732] font-bold hover:underline cursor-pointer bg-transparent border-0 p-0"
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
                      className="text-[#1A2732] font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 outline-none"
                    >
                      ← Cancelar verificación 2FA
                    </button>

                    <div className="space-y-2 text-center py-2">
                      <div className="inline-flex items-center justify-center p-2 bg-[#1A2732]/10 border border-[#1A2732]/20 rounded-2xl text-[#1A2732]">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-neutral-900 text-sm">Autenticación en Dos Pasos (2FA)</h3>
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
                      <label className="font-bold text-neutral-700 block uppercase tracking-wider text-[10px] text-center">Código de Seguridad</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={totpVerificationCode}
                        onChange={(e) => setTotpVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center font-mono tracking-[0.4em] text-lg font-bold h-12 border border-neutral-250 rounded-xl focus:ring-2 focus:ring-[#1A2732] focus:border-transparent bg-neutral-50 focus:bg-white transition-all"
                        required
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#1A2732] hover:bg-neutral-800 text-white font-extrabold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider font-sans"
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
                        setRegisterForm(prev => ({
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
                      className="text-[#1A2732] font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 outline-none"
                    >
                      ← Volver a opciones de acceso
                    </button>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700 block uppercase tracking-wider text-xs">Correo Electrónico *</label>
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
                        <label className="font-bold text-neutral-700 block uppercase tracking-wider text-xs">Clave de Acceso *</label>
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
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${strength === 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-600' : 'text-red-600'}`}>{strengthLabels[strength]}</span>
                        </div>
                      )}
                    </div>

                    {isEmailRegisterMode && (
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700 block uppercase tracking-wider text-xs">Confirmar Clave de Acceso *</label>
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
                      className="w-full h-12 bg-[#1A2732] hover:bg-neutral-800 text-white font-extrabold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider"
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
                        className="text-[#1A2732] font-bold hover:underline cursor-pointer"
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
                    className="text-[#1A2732] font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 outline-none"
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
                    <label className="font-bold text-neutral-700 block uppercase tracking-wider text-xs">Nombre del Comercio o Razón Social *</label>
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
                    <label className="font-bold text-neutral-700 block uppercase tracking-wider text-xs">Nombre de Propietario o Representante *</label>
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
                    <label className="font-bold text-neutral-700 block uppercase tracking-wider text-xs">Celular / WhatsApp (Opcional)</label>
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
                    className="w-full h-12 bg-[#1A2732] hover:bg-neutral-800 text-white font-extrabold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider"
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
                    <h3 className="text-base font-bold text-neutral-900 leading-none">¡Confirma tu correo electrónico!</h3>
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
                      className="w-full h-11 bg-[#1A2732] hover:bg-neutral-800 text-white font-extrabold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
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
                    <h3 className="text-base font-bold text-neutral-900 leading-none">¡Felicidades, registro completo!</h3>
                    <p className="text-xs text-neutral-500">Estamos preparando su almacén, base de datos de comprobantes y padrón fiscal DGII dominicano.</p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-2 text-[#1A2732] font-semibold text-[11px]">
                    <Loader2 className="w-4 h-4 animate-spin" /> Integrando oficina virtual...
                  </div>
                </div>
              )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      )}

      {/* 3.5 AYUDA / MANUAL DE USUARIO */}
      {view === 'ayuda' && (
        <div className="flex flex-col min-h-screen bg-white animate-fade-in">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
                <div className="hidden sm:block">
                  <LogoFacturaDo className="h-8 w-auto" />
                </div>
                <div className="block sm:hidden flex items-center gap-2">
                  <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8 shrink-0 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">FacturaDo</span>
                </div>
              </div>
              <button
                onClick={() => setView('landing')}
                className="whitespace-nowrap px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Volver al inicio
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            <UserManual />
          </div>
        </div>
      )}

      {/* 4. MODALS FOR TERMS AND PRIVACY */}
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
                  <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">Términos y Condiciones de Servicio</h3>
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
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">1. Objeto y Alcance del Servicio</h4>
                  <p>
                    FacturaDo provee una infraestructura en la nube que permite a los comercios gestionar su facturación diaria. El servicio se provee "tal cual" (As Is) y sujeto a disponibilidad. FacturaDo se reserva el derecho de modificar, actualizar, suspender temporalmente o descontinuar funciones de la plataforma en cualquier momento sin que esto derive en obligaciones de indemnización para el usuario.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">2. Exención de Responsabilidad Tributaria y Fiscal</h4>
                  <p>
                    FacturaDo es estrictamente una herramienta de gestión administrativa y no actúa como representante fiscal, contable ni legal. El usuario asume absoluta responsabilidad civil y penal sobre la legitimidad, montos, impuestos declarados y secuencias de Comprobantes Fiscales (NCF) registradas en nuestro sistema. El usuario garantiza que dichas secuencias corresponden fielmente con autorizaciones vigentes emitidas por la Dirección General de Impuestos Internos (DGII). FacturaDo no asume bajo ningún concepto deudas, multas, recargos, penalidades o contingencias fiscales derivadas de errores de digitación, fraude o declaraciones tributarias anómalas.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">3. Limitación de Responsabilidad (Daños y Pérdida de Datos)</h4>
                  <p>
                    En la máxima medida permitida por las leyes dominicanas, FacturaDo, sus creadores, directivos o afiliados no serán responsables de daños directos, indirectos, incidentales, punitivos, especiales o consecuentes (incluyendo, sin limitación, pérdida de lucro cesante, interrupción de negocio, o pérdida de información) resultantes del uso o la incapacidad de usar la plataforma. Aunque realizamos respaldos periódicos, usted es responsable de mantener registros y exportaciones independientes de sus facturas. El servicio no garantiza un 100% de disponibilidad ni la inmunidad absoluta ante ciberataques de terceros ajenos a la empresa.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">4. Seguridad, Cuentas y Uso Adecuado</h4>
                  <p>
                    Usted es el único responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada desde su cuenta será considerada autorizada por el titular del RNC registrado. Queda estrictamente prohibido utilizar la plataforma para (i) emitir facturas bajo RNC ajenos o inactivos sin poder representativo legal, (ii) llevar operaciones de "doble contabilidad" o lavado de activos, y (iii) realizar ingeniería inversa o extraer datos masivos (scraping) de nuestra infraestructura.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">5. Suscripciones, Pagos y Políticas de Reembolso</h4>
                  <p>
                    El uso de características avanzadas está sujeto al pago de la suscripción aplicable. Todos los cobros se realizan por adelantado. Las tarifas no son reembolsables, salvo que la ley exija lo contrario. El incumplimiento de pago resultará en la suspensión del acceso a la plataforma o la restricción al plan gratuito. FacturaDo puede modificar los precios informándole con treinta (30) días de antelación.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">6. Propiedad Intelectual y Propiedad de la Información</h4>
                  <p>
                    Todo el código, diseño gráfico, logos y estructura funcional de FacturaDo son propiedad exclusiva de la empresa y están protegidos por leyes de derechos de autor. No obstante, los datos insertados en su cuenta (clientes, artículos, montos) son de su total propiedad. FacturaDo únicamente actuará como custodio de los mismos.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">7. Terminación y Suspensión de Cuentas</h4>
                  <p>
                    Nos reservamos el derecho de suspender o cancelar su cuenta de manera inmediata, sin previo aviso, en caso de detectar violaciones flagrantes a estos términos, reportes de actividad fraudulenta emitidos por las autoridades, o inactividad prolongada mayor a un (1) año en planes gratuitos.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">8. Ley Aplicable y Jurisdicción</h4>
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
                  className="px-5 py-2 bg-[#1A2732] hover:bg-neutral-800 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
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
                  <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">Políticas de Uso y Privacidad de Datos</h3>
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
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">1. Recopilación de Información (Qué recogemos y Por qué)</h4>
                  <p>
                    Recopilamos únicamente los datos operativos y comerciales de su negocio requeridos para la correcta operación del software. Esto abarca: Datos de Creación de Cuenta (Correos, nombres de dueños, RNC, teléfonos), Datos Operacionales (inventario de productos, listas de proveedores y base de clientes) y Datos Transaccionales (facturas emitidas, cotizaciones y cuadres). Además, integramos en tiempo real consultas públicas al padrón oficial de la Dirección General de Impuestos Internos (DGII) para autocompletar formularios basados en su RNC. Adicionalmente recopilamos métricas técnicas automatizadas (Cookies, IP, Tipo de Navegador) para prevenir el fraude, gestionar sesiones activas y asegurar el óptimo funcionamiento.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">2. Uso y Finalidad del Tratamiento de los Datos</h4>
                  <p>
                    Toda la información captada se utiliza de manera estricta para: (a) Prestación efectiva del servicio de facturación y control de inventarios, (b) Generación de reportes auxiliares contables (como el 606 y 607), (c) Validación de identidad en integraciones, (d) Asistencia de soporte técnico e (e) Investigaciones internas de control anti-fraude o ataques cibernéticos.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">3. Compartición de Información con Terceros (No Venta de Datos)</h4>
                  <p>
                    FacturaDo se compromete rigurosamente a <strong>no vender, alquilar, sublicenciar ni exponer para fines mercadotécnicos de terceros</strong> sus transacciones comerciales. Solo se compartirá información con: (i) Proveedores de alojamiento en la nube (ej: Supabase, AWS) cuyas políticas cumplen con el cifrado moderno de nivel bancario, (ii) Procesadores de pagos (Stripe, PayPal, Azul) para procesar el pago de su suscripción, y (iii) Entidades gubernamentales dominicanas, tribunales o la Policía Nacional <strong>sólo cuando medie una orden judicial o requerimiento legal válido</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">4. Seguridad, Cifrado y Retención de la Información</h4>
                  <p>
                    Los datos son resguardados en servidores de infraestructura de alta disponibilidad. Empleamos protocolos de cifrado asimétrico SSL/TLS de 256 bits durante la transmisión y políticas de encriptación en bases de datos en reposo (AES). Los datos comerciales se retienen mientras su cuenta se encuentre activa. Si decide cancelar su suscripción, conservamos la data operacional por un tiempo legal prudente (típicamente hasta 6 meses a solicitud de recuperación) antes de eliminarla definitivamente o anonimizarla irreversiblemente.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">5. Derechos ARCO de los Titulares</h4>
                  <p>
                    En cumplimiento de la Ley N.º 172-13 que tiene por objeto la protección integral de los datos personales en archivos, registros públicos y bancos de datos privados en República Dominicana, usted tiene el derecho en cualquier momento de solicitar el Acceso, Rectificación, Cancelación u Oposición del uso de sus datos personales. Dicha acción la puede ejercer enviándonos un correo de soporte oficial. Cabe acotar que el ejercicio del derecho a supresión total inhabilitará permanentemente su capacidad de emitir facturas en FacturaDo.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1A2732] uppercase text-[10px] tracking-wide">6. Limitación Frente a Fugas Masivas por Ataques Estatales</h4>
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
                  className="px-5 py-2 bg-[#1A2732] hover:bg-neutral-800 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
                >
                  Entendido y Acepto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
