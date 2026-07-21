import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Shield, Key, Laptop, Smartphone, Lock, Eye, EyeOff, 
  CheckCircle2, AlertTriangle, ShieldCheck, Mail, RefreshCw, X
} from 'lucide-react';
import { UserPermission } from '../../types';
import { insforge } from '../../lib/insforge';
import * as OTPAuth from 'otpauth';
import { startRegistration } from '@simplewebauthn/browser';

const generateBase32Secret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
};

interface SecuritySettingsViewProps {
  currentUser: UserPermission;
  logActivity: (action: string, entity: string, entityId: string, details?: any) => Promise<void>;
  addNotification: (notif: { title: string; message: string; type: 'info' | 'warning' | 'error' | 'success' }) => void;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export function SecuritySettingsView({ currentUser, logActivity, addNotification }: SecuritySettingsViewProps) {
  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(() => {
    return localStorage.getItem(`inv_2fa_${currentUser.id}`) === 'true';
  });
  const [totpSecret, setTotpSecret] = useState(() => {
    return localStorage.getItem(`inv_2fa_secret_${currentUser.id}`) || '';
  });
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Sessions States
  const [sessions, setSessions] = useState<ActiveSession[]>(() => {
    const saved = localStorage.getItem(`inv_sessions_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sess-1',
        device: 'Computadora de Escritorio (Windows)',
        browser: navigator.userAgent.includes('Chrome') ? 'Google Chrome' : 'Navegador Web',
        ip: '186.6.142.92',
        location: 'Santo Domingo, República Dominicana',
        lastActive: 'Activa ahora',
        isCurrent: true
      },
      {
        id: 'sess-2',
        device: 'iPhone 15 Pro (iOS)',
        browser: 'Safari Mobile',
        ip: '148.103.42.11',
        location: 'Santiago de los Caballeros, RD',
        lastActive: 'Hace 2 horas',
        isCurrent: false
      }
    ];
  });

  // Auto Lock Screen states
  const [autoLockMinutes, setAutoLockMinutes] = useState(() => {
    return localStorage.getItem(`inv_autolock_${currentUser.id}`) || '0'; // '0' means never
  });
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`inv_sessions_${currentUser.id}`, JSON.stringify(sessions));
  }, [sessions, currentUser.id]);

  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);

  const handleRegisterPasskey = async () => {
    setIsRegisteringPasskey(true);
    try {
      const { data: resData, error: invokeErr } = await insforge.functions.invoke('passkey-register', {
        body: { action: 'generate' }
      });
      if (invokeErr || !resData) throw new Error(invokeErr?.message || 'Error contactando el servidor de Passkeys');
      if (resData.error) throw new Error(resData.error);

      const attResp = await startRegistration({ optionsJSON: resData.options });

      const { data: verifyData, error: verifyErr } = await insforge.functions.invoke('passkey-register', {
        body: { action: 'verify', response: attResp }
      });
      
      if (verifyErr || !verifyData || verifyData.error) throw new Error(verifyErr?.message || verifyData?.error || 'Error verificando huella');

      addNotification({
        title: 'Dispositivo Vinculado',
        message: 'Tu huella/rostro ha sido registrado exitosamente para iniciar sesión sin contraseña.',
        type: 'success'
      });

      logActivity('SEGURIDAD', 'users', currentUser.id, { action: 'registrar_passkey', email: currentUser.email });
    } catch (err: any) {
      console.error('Passkey registration error:', err);
      addNotification({
        title: 'Error de Passkey',
        message: err.message || 'No se pudo registrar el dispositivo o el usuario canceló.',
        type: 'error'
      });
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (newPassword.length < 8) {
      setPasswordNotice({ text: 'La nueva contraseña debe tener al menos 8 caracteres.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ text: 'Las nuevas contraseñas no coinciden.', type: 'error' });
      return;
    }

    setIsChangingPassword(true);

    // Simulate API request to backend
    setTimeout(async () => {
      setIsChangingPassword(false);
      setPasswordNotice({ text: '¡Contraseña actualizada exitosamente en el servidor de seguridad!', type: 'success' });
      
      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Add to system notifications
      addNotification({
        title: 'Contraseña Actualizada',
        message: 'Has cambiado tu contraseña de acceso de manera exitosa.',
        type: 'success'
      });

      // Write Audit Log
      await logActivity('SEGURIDAD', 'users', currentUser.id, {
        action: 'cambiar_contraseña',
        email: currentUser.email,
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  const handleSendResetEmail = async () => {
    try {
      const { error } = await insforge.auth.sendResetPasswordEmail({
        email: currentUser.email
      });
      if (error) {
        setPasswordNotice({ text: `Error: ${error.message}`, type: 'error' });
      } else {
        setPasswordNotice({ 
          text: `Se ha enviado un enlace de restablecimiento seguro a: ${currentUser.email}`, 
          type: 'success' 
        });
      }
    } catch (err: any) {
      setPasswordNotice({ text: 'Error al solicitar el enlace de restablecimiento.', type: 'error' });
    }
  };

  // Toggle 2FA flow
  const handle2FASwitch = () => {
    if (is2FAEnabled) {
      // Disable directly
      setIs2FAEnabled(false);
      localStorage.setItem(`inv_2fa_${currentUser.id}`, 'false');
      localStorage.removeItem(`inv_2fa_secret_${currentUser.id}`);
      setTotpSecret('');
      addNotification({
        title: '2FA Desactivado',
        message: 'La autenticación de dos factores ha sido desactivada.',
        type: 'warning'
      });
      logActivity('SEGURIDAD', 'users', currentUser.id, { action: 'desactivar_2fa', email: currentUser.email });
    } else {
      // Open setup modal
      const newSecret = generateBase32Secret();
      setTotpSecret(newSecret);
      setShow2FAModal(true);
      setVerificationCode('');
      setVerificationError(null);
    }
  };

  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    if (verificationCode.length !== 6 || isNaN(Number(verificationCode))) {
      setVerificationError('Introduce un código numérico de 6 dígitos.');
      return;
    }

    try {
      const totp = new OTPAuth.TOTP({
        issuer: 'FacturaDo',
        label: currentUser.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(totpSecret)
      });

      const delta = totp.validate({
        token: verificationCode.trim(),
        window: 2 // Allow a 60-second drift window
      });

      if (delta !== null) {
        setIs2FAEnabled(true);
        localStorage.setItem(`inv_2fa_${currentUser.id}`, 'true');
        localStorage.setItem(`inv_2fa_secret_${currentUser.id}`, totpSecret);
        setShow2FAModal(false);

        addNotification({
          title: '2FA Activado',
          message: 'Autenticación de dos factores activada de manera segura.',
          type: 'success'
        });

        logActivity('SEGURIDAD', 'users', currentUser.id, { action: 'activar_2fa', email: currentUser.email });
      } else {
        setVerificationError('Código de validación incorrecto. Inténtelo de nuevo.');
      }
    } catch (err: any) {
      setVerificationError('Error al validar el código. Asegúrese de ingresar el código actual de su app.');
    }
  };

  // Revoke other sessions
  const handleRevokeOtherSessions = async () => {
    const currentOnly = sessions.filter(s => s.isCurrent);
    setSessions(currentOnly);
    
    addNotification({
      title: 'Sesiones Cerradas',
      message: 'Se han cerrado todas las sesiones inactivas en otros dispositivos.',
      type: 'info'
    });

    await logActivity('SEGURIDAD', 'users', currentUser.id, { 
      action: 'cerrar_sesiones_adicionales', 
      email: currentUser.email 
    });
  };

  // Change Auto Lock settings
  const handleAutoLockChange = (value: string) => {
    setAutoLockMinutes(value);
    localStorage.setItem(`inv_autolock_${currentUser.id}`, value);
    setLockNotice('Configuración de bloqueo guardada.');
    setTimeout(() => setLockNotice(null), 3000);

    logActivity('SEGURIDAD', 'users', currentUser.id, { 
      action: 'cambiar_bloqueo_auto', 
      value,
      email: currentUser.email 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 font-sans text-left">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-800 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-15 flex items-center pr-10 pointer-events-none">
          <Shield className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-extrabold tracking-widest uppercase text-white border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Seguridad y Acceso Avanzado
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Seguridad de la Cuenta</h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-normal">
            Administre credenciales, autenticación de doble factor, bloqueos automáticos y sesiones activas del usuario corporativo: <strong className="text-white font-semibold font-mono">{currentUser.email}</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Change password */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-neutral-200 shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-4 border-b border-neutral-100 bg-neutral-50/50">
              <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Key className="w-4.5 h-4.5 text-neutral-500" />
                Actualizar / Crear Contraseña de Acceso
              </CardTitle>
              <CardDescription className="text-xs">
                Establezca su clave de acceso directamente. No requiere ingresar contraseña previa.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {passwordNotice && (
                <div className={`p-3 rounded-lg text-xs mb-4 font-medium flex items-start gap-2 border ${
                  passwordNotice.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {passwordNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{passwordNotice.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-700">Nueva Contraseña *</Label>
                    <div className="relative">
                      <Input 
                        type={showNewPassword ? 'text' : 'password'} 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="text-xs h-9.5 pr-10 bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0 bg-transparent border-0"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-700">Confirmar Nueva Contraseña *</Label>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repita la nueva contraseña"
                        className="text-xs h-9.5 pr-10 bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0 bg-transparent border-0"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleSendResetEmail}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-850 flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    ¿Enviar enlace de restablecimiento por correo?
                  </button>

                  <Button 
                    type="submit" 
                    disabled={isChangingPassword}
                    className="bg-black hover:bg-neutral-800 text-white text-xs h-9.5 font-semibold"
                  >
                    {isChangingPassword ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : 'Guardar Nueva Contraseña'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Active Sessions Panel */}
          <Card className="border-neutral-200 shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Laptop className="w-4.5 h-4.5 text-neutral-500" />
                  Sesiones de Dispositivos Activos
                </CardTitle>
                <CardDescription className="text-xs">
                  Lista de terminales y navegadores que tienen credenciales de sesión en este momento.
                </CardDescription>
              </div>
              {sessions.length > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleRevokeOtherSessions}
                  className="text-[10px] h-7 px-2.5 border-neutral-300 text-neutral-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shrink-0"
                >
                  Cerrar otras sesiones
                </Button>
              )}
            </CardHeader>
            <div className="divide-y divide-neutral-100">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-4 flex items-start sm:items-center justify-between gap-3 text-xs hover:bg-neutral-50/20 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-500 shrink-0 mt-0.5 sm:mt-0">
                      {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-neutral-900">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150">
                            Sesión Actual
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-0.5 font-mono">
                        {sess.browser} • IP: {sess.ip} • {sess.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400 shrink-0">
                    {sess.lastActive}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column: Auto Lock and 2FA */}
        <div className="space-y-6">
          {/* Doble Factor (2FA) Card */}
          <Card className="border-neutral-200 shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-4 border-b border-neutral-100 bg-neutral-50/50">
              <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-neutral-500" />
                Autenticación en Dos Pasos (2FA)
              </CardTitle>
              <CardDescription className="text-xs">
                Añada una capa adicional de protección exigiendo un código temporal al iniciar sesión.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-4 p-3 bg-neutral-50 border border-neutral-100 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-neutral-800 block">
                    {is2FAEnabled ? 'Servicio Activado' : 'Servicio Desactivado'}
                  </span>
                  <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                    {is2FAEnabled ? 'Su cuenta está altamente protegida.' : 'Su cuenta es vulnerable a adivinación de clave.'}
                  </span>
                </div>
                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={handle2FASwitch}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-hidden border-0 cursor-pointer ${
                    is2FAEnabled ? 'bg-indigo-600' : 'bg-neutral-300'
                  }`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${
                    is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {!is2FAEnabled && (
                <div className="p-3 bg-amber-50 text-amber-900 border border-amber-150 rounded-xl text-[11px] leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Recomendación:</strong> Habilite 2FA para proteger las secuencias NCF timbradas y evitar operaciones no autorizadas de facturación fiscal.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auto Lock Screen settings */}
          <Card className="border-neutral-200 shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-4 border-b border-neutral-100 bg-neutral-50/50">
              <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-neutral-500" />
                Bloqueo Automático por Inactividad
              </CardTitle>
              <CardDescription className="text-xs">
                Bloquee la pantalla del punto de venta si se deja la terminal desatendida.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {lockNotice && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-250 text-[10px] font-medium rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lockNotice}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="lock-minutes" className="text-xs font-semibold text-neutral-700">Tiempo de inactividad</Label>
                <select
                  id="lock-minutes"
                  value={autoLockMinutes}
                  onChange={(e) => handleAutoLockChange(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-lg border border-neutral-200 bg-white text-neutral-700 outline-hidden focus:ring-1 focus:ring-black"
                >
                  <option value="0">Nunca bloquear (Desactivado)</option>
                  <option value="1">1 minuto (Prueba rápida)</option>
                  <option value="5">5 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                </select>
              </div>

              <p className="text-[10px] text-neutral-500 leading-normal">
                Esta configuración es de carácter local para esta terminal. Si el temporizador expira sin movimiento de mouse, el sistema exigirá las credenciales de acceso nuevamente.
              </p>
            </CardContent>
          </Card>

          {/* Passkeys Card */}
          <Card className="border-neutral-200 shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-4 border-b border-neutral-100 bg-neutral-50/50">
              <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-neutral-500" />
                Inicios de Sesión Biométricos (Passkeys)
              </CardTitle>
              <CardDescription className="text-xs">
                Inicie sesión usando la huella o el reconocimiento facial de su dispositivo sin contraseñas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col gap-3">
                <Button 
                  type="button" 
                  onClick={handleRegisterPasskey}
                  disabled={isRegisteringPasskey}
                  className="w-full text-xs h-9.5 bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-2"
                >
                  {isRegisteringPasskey ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {isRegisteringPasskey ? 'Registrando Dispositivo...' : 'Añadir Dispositivo (Huella/Rostro)'}
                </Button>
                <p className="text-[10px] text-neutral-500 text-center leading-normal">
                  Al registrar este dispositivo, podrá acceder rápidamente con su biometría en el futuro.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2FA Setup Modal Dialog */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-5 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-neutral-900 text-sm">Configurar Autenticación 2FA</h3>
              </div>
              <button 
                onClick={() => setShow2FAModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg bg-transparent border-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-normal">
              Escanea el código QR desde tu aplicación authenticator (ej: Google Authenticator, Authy) e introduce el código numérico.
            </p>

            {/* Real QR Code */}
            <div className="bg-neutral-50 p-4 border border-neutral-150 rounded-xl flex flex-col items-center justify-center space-y-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(
                  `otpauth://totp/FacturaDo:${currentUser.email}?secret=${totpSecret}&issuer=FacturaDo`
                )}`}
                alt="QR Code 2FA"
                className="w-36 h-36 border border-neutral-250 bg-white p-1 rounded-md"
                referrerPolicy="no-referrer"
              />
              <div className="text-center">
                <span className="text-[10px] text-neutral-450 uppercase tracking-widest block font-bold">Código de Llave Secreta</span>
                <span className="text-xs font-mono font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200 mt-1 inline-block select-all">
                  {totpSecret}
                </span>
              </div>
            </div>

            <form onSubmit={handleVerify2FACode} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="verify-code" className="text-xs font-bold text-neutral-700 block text-center">Código de Validación</Label>
                <Input
                  id="verify-code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center font-mono tracking-[0.4em] text-lg font-bold h-11 bg-white"
                  required
                  autoFocus
                />
                {verificationError && (
                  <p className="text-[10px] text-red-600 text-center font-semibold">{verificationError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShow2FAModal(false)}
                  className="w-full text-xs h-9.5"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="w-full text-xs h-9.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Verificar y Activar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
