import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoFacturaDo, OldLogoFacturaDo } from '../core/LogoFacturaDo';
import { insforge } from '../../lib/insforge';
import HelpManualView from '../help/HelpManualView';
import UserManual from '../help/UserManual';
import CompetitorComparison from './CompetitorComparison';
import { StatCounters } from '../landing/components/StatCounters';
import { LandingHeader } from '../landing/components/LandingHeader';
import { LandingHero } from '../landing/components/LandingHero';
import { LandingMigrationSection } from '../landing/components/LandingMigrationSection';
import { LandingFeaturesSection } from '../landing/components/LandingFeaturesSection';
import { LandingBudgetSection } from '../landing/components/LandingBudgetSection';
import { LandingPricingSection } from '../landing/components/LandingPricingSection';
import { LandingFaqSection } from '../landing/components/LandingFaqSection';
import { LandingFooter } from '../landing/components/LandingFooter';
import { AuthModals } from './components/AuthModals';
import { AuthForms } from './components/AuthForms';
import * as OTPAuth from 'otpauth';
import { startAuthentication } from '@simplewebauthn/browser';
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
  DollarSign,
  Layers,
  Briefcase,
  Landmark,
  ExternalLink,
  Receipt,
  Settings,
  Lightbulb,
  BadgeCheck,
  Sparkles,
  Heart,
  Store,
  ShoppingBag,
  Download,
  MonitorSmartphone,
  Apple,
  CreditCard,
  FileText,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface LandingAndAuthProps {
  onLoginSuccess: (user: any) => void;
  usersList: any[];
  initialView?: 'landing' | 'login' | 'register' | 'ayuda' | 'privacidad' | 'terminos';
  isLoggedIn?: boolean;
}



export default function LandingAndAuth({ onLoginSuccess, usersList, initialView = 'landing', isLoggedIn = false }: LandingAndAuthProps) {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 120]);
  const navigate = useNavigate();
  const [view, rawSetView] = useState<'landing' | 'login' | 'register' | 'ayuda' | 'privacidad' | 'terminos'>(initialView);
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

  // OTP Email Verification States
  const [verificationOtp, setVerificationOtp] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

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

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setResendMessage('');

    if (!verificationOtp || verificationOtp.trim().length !== 6) {
      setLoginError('Por favor ingrese el código completo de 6 dígitos.');
      return;
    }

    setIsSubmitting(true);

    try {
      const targetEmail = (registerForm.email || email).trim();
      const { data, error } = await insforge.auth.verifyEmail({
        email: targetEmail,
        otp: verificationOtp.trim()
      });

      if (error) {
        setLoginError(error.message || 'El código de verificación es incorrecto o ha expirado. Revisa tu correo e intenta nuevamente.');
        setIsSubmitting(false);
        return;
      }

      // Email successfully verified! InsForge returns user & session token.
      const userId = data?.user?.id || 'usr_' + Date.now();
      const userEmail = data?.user?.email || targetEmail;

      const loggedUser = {
        id: userId,
        username: registerForm.ownerName || data?.user?.profile?.name || userEmail.split('@')[0],
        email: userEmail,
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

      setIsSubmitting(false);
      setRegisterSuccess(false);
      setEmailConfirmationRequired(false);

      // Auto log-in to app immediately ("luego lo que sigue")
      onLoginSuccess(loggedUser);
    } catch (err: any) {
      setLoginError(err.message || 'Error al verificar el código de correo.');
      setIsSubmitting(false);
    }
  };

  const handleResendEmailOtp = async () => {
    setLoginError('');
    setResendMessage('');
    setIsResendingOtp(true);

    try {
      const targetEmail = (registerForm.email || email).trim();
      const { error } = await insforge.auth.resendVerificationEmail({
        email: targetEmail
      });

      if (error) {
        setLoginError(error.message || 'No se pudo reenviar el código de verificación.');
      } else {
        setResendMessage('Se ha reenviado un nuevo código de 6 dígitos a su correo electrónico.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error al solicitar reenvío del código.');
    } finally {
      setIsResendingOtp(false);
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

  const handlePasskeyLogin = async () => {
    setIsSubmitting(true);
    setLoginError('');
    try {
      const { data: resData, error: invokeErr } = await insforge.functions.invoke('passkey-verify', {
        body: { action: 'generate' }
      });
      if (invokeErr || !resData) throw new Error(invokeErr?.message || 'Error contactando servidor de Passkeys');
      if (resData.error) throw new Error(resData.error);

      const asseResp = await startAuthentication({ optionsJSON: resData.options });

      const { data: verifyData, error: verifyErr } = await insforge.functions.invoke('passkey-verify', {
        body: { action: 'verify', response: asseResp }
      });
      
      if (verifyErr || !verifyData || verifyData.error) throw new Error(verifyErr?.message || verifyData?.error || 'Huella no reconocida');

      // The backend already verified the magic link token server-side and returned session data.
      // Use refreshSession to establish the httpOnly cookie session, then get the user.
      const { data: refreshed } = await insforge.auth.refreshSession();
      const { data: { user } } = await insforge.auth.getCurrentUser();

      if (user) {
        const loggedUser = {
          id: user.id,
          username: user.profile?.name || user.email?.split('@')[0] || 'Usuario',
          email: user.email || verifyData.email,
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
        setIsSubmitting(false);
        onLoginSuccess(loggedUser);
      } else {
        throw new Error('No se pudo establecer la sesión biométrica.');
      }
      
    } catch (err: any) {
      console.error('Passkey login error:', err);
      setLoginError(err.message || 'No se pudo iniciar sesión con biometría.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-[#1A2732]/10 selection:text-[#FAFAFA] overflow-x-hidden">
      {/* 1. PUBLIC MARKETING LANDING PAGE VIEW */}
      {view === 'landing' && (
        <div className="flex flex-col min-h-screen">
          <LandingHeader
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setView('login')}
            onRegisterClick={() => setView('register')}
            onHelpClick={() => setView('ayuda')}
          />
          <LandingHero onRegisterClick={() => setView('register')} />
          <StatCounters />
          <LandingMigrationSection onRegisterClick={() => setView('register')} />
          <LandingFeaturesSection onRegisterClick={() => setView('register')} />
          <LandingBudgetSection onOpenRegister={() => setView('register')} onOpenGuide={() => setView('ayuda')} />
          <LandingPricingSection onRegisterClick={() => setView('register')} />
          <LandingFaqSection onRegisterClick={() => setView('register')} />
          <LandingFooter
            onRegisterClick={() => setView('register')}
            onHelpClick={() => setView('ayuda')}
            onTermsClick={() => setShowTermsModal(true)}
            onPrivacyClick={() => setShowPrivacyModal(true)}
          />
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
                  <span className="text-lg font-medium tracking-tight text-[#1A2732] font-sans">FacturaDo</span>
                </div>
              </div>
              <button
                onClick={() => setView('landing')}
                className="px-5 py-2.5 text-xs font-medium text-[#1A2732] hover:bg-neutral-100 rounded-xl transition-all cursor-pointer border border-neutral-200"
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
                className="flex items-center gap-1.5 text-xs font-medium hover:text-white/85 transition-colors cursor-pointer text-left focus:outline-none"
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
                  <span className="px-2.5 py-0.5 bg-white/10 text-white text-[9.5px] font-medium uppercase rounded border border-white/20 tracking-wider">
                    {slides[activeSlide].benefit}
                  </span>
                  <h3 className="text-2xl font-medium tracking-tight text-white font-heading">
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
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer animate-fade-in"
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
                    <span className="text-lg font-medium tracking-tight text-[#1A2732] font-sans">FacturaDo</span>
                  </div>
                  
                  {authStage === 'methods' && (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 font-heading">
                        {view === 'login' ? 'Inicia sesión en FacturaDo' : 'Crea tu cuenta de comercio'}
                      </h2>
                      <p className="text-sm text-neutral-500 leading-normal">
                        Selecciona un método de acceso instantáneo y seguro para ingresar a tu terminal comercial de FacturaDo.
                      </p>
                    </>
                  )}

                  {authStage === 'email_credentials' && (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 font-heading">
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
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium uppercase rounded-full border border-emerald-150 tracking-wider">
                        Paso 2: Datos de Registro
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 font-heading">
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
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 font-medium flex items-center justify-center text-[10px] shrink-0 mt-0.5">!</span>
                  <span>{loginError}</span>
                </div>
              )}

              <AuthForms
                view={view}
                setView={setView}
                authStage={authStage}
                setAuthStage={setAuthStage}
                registerForm={registerForm}
                setRegisterForm={setRegisterForm}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                loginError={loginError}
                setLoginError={setLoginError}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                isEmailRegisterMode={isEmailRegisterMode}
                setIsEmailRegisterMode={setIsEmailRegisterMode}
                twoFactorStep={twoFactorStep}
                setTwoFactorStep={setTwoFactorStep}
                setPendingLoggedUser={setPendingLoggedUser}
                totpVerificationCode={totpVerificationCode}
                setTotpVerificationCode={setTotpVerificationCode}
                totpVerificationError={totpVerificationError}
                setTotpVerificationError={setTotpVerificationError}
                registerSuccess={registerSuccess}
                setRegisterSuccess={setRegisterSuccess}
                emailConfirmationRequired={emailConfirmationRequired}
                setEmailConfirmationRequired={setEmailConfirmationRequired}
                socialProviderName={socialProviderName}
                strength={strength}
                strengthColors={strengthColors}
                strengthLabels={strengthLabels}
                verificationOtp={verificationOtp}
                setVerificationOtp={setVerificationOtp}
                handleVerifyEmailOtp={handleVerifyEmailOtp}
                handleResendEmailOtp={handleResendEmailOtp}
                isResendingOtp={isResendingOtp}
                resendMessage={resendMessage}
                handleLoginSubmit={handleLoginSubmit}
                handlePasskeyLogin={handlePasskeyLogin}
                handleVerifyTwoFactorLogin={handleVerifyTwoFactorLogin}
                handleRemainingDetailsSubmit={handleRemainingDetailsSubmit}
                setShowTermsModal={setShowTermsModal}
                setShowPrivacyModal={setShowPrivacyModal}
              />

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
                  <span className="text-lg font-medium tracking-tight text-slate-900 font-sans">FacturaDo</span>
                </div>
              </div>
              <button
                onClick={() => setView('landing')}
                className="whitespace-nowrap px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-2"
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
      <AuthModals
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
        showPrivacyModal={showPrivacyModal}
        setShowPrivacyModal={setShowPrivacyModal}
      />
    </div>
  );
}
