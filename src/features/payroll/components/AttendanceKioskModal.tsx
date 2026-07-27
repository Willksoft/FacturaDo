import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck, 
  Key, 
  Power, 
  QrCode, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  Calendar,
  Delete,
  Check
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../../../types/payroll';

interface AttendanceKioskModalProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onAddAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  onClose: () => void;
}

export const AttendanceKioskModal: React.FC<AttendanceKioskModalProps> = ({
  employees,
  attendanceRecords,
  onAddAttendanceRecord,
  onClose,
}) => {
  const [kioskEnabled, setKioskEnabled] = useState<boolean>(true);
  const [clockType, setClockType] = useState<'Entrada' | 'Salida' | 'Almuerzo_Inicio' | 'Almuerzo_Fin'>('Entrada');
  const [pinInput, setPinInput] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [lastCheckInSuccess, setLastCheckInSuccess] = useState<{
    employeeName: string;
    type: string;
    timestamp: string;
    photoUrl?: string;
  } | null>(null);

  // Reloj Digital en Tiempo Real
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeEmployees = employees.filter((e) => e.status === 'Activo');

  const handlePinPress = (digit: string) => {
    if (pinInput.length < 4) {
      setPinInput((prev) => prev + digit);
    }
  };

  const handlePinClear = () => {
    setPinInput('');
  };

  const handlePinDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleProcessCheckIn = (empId?: string) => {
    const targetEmpId = empId || selectedEmployeeId;
    const emp = activeEmployees.find((e) => e.id === targetEmpId || e.nationalId.endsWith(pinInput));

    if (!emp) {
      alert('Colaborador o PIN no encontrado. Por favor verifica los datos.');
      setPinInput('');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const timeStr = currentTime.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let typeLabel = 'Entrada Ordinaria';
    if (clockType === 'Salida') typeLabel = 'Salida Ordinaria';
    if (clockType === 'Almuerzo_Inicio') typeLabel = 'Inicio de Almuerzo';
    if (clockType === 'Almuerzo_Fin') typeLabel = 'Fin de Almuerzo';

    onAddAttendanceRecord({
      employeeId: emp.id,
      employeeName: emp.fullName,
      date: todayStr,
      checkInTime: clockType === 'Entrada' ? timeStr : '08:00 AM',
      checkOutTime: clockType === 'Salida' ? timeStr : undefined,
      regularHours: 8,
      overtime35Hours: 0,
      overtime100Hours: 0,
      status: 'Puntual',
      notes: `Marcaje Kiosco PIN: ${typeLabel}`
    });

    setLastCheckInSuccess({
      employeeName: emp.fullName,
      type: typeLabel,
      timestamp: timeStr,
      photoUrl: emp.photoUrl
    });

    setPinInput('');
    setSelectedEmployeeId('');

    // Auto-ocultar notificación a los 4 segundos
    setTimeout(() => {
      setLastCheckInSuccess(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans text-slate-900 text-left">
      <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-800 text-white">
        
        {/* Encabezado del Kiosco */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Kiosco Checador HD
                </span>
                <span className="text-xs text-slate-400">FacturaDo RRHH</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white tracking-tight">
                Reloj Checador de Asistencia en Tiempo Real
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Switch de Activación */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800">
              <Power className={`w-4 h-4 ${kioskEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="text-xs font-semibold text-slate-300">
                {kioskEnabled ? 'Kiosco Activo' : 'Kiosco Inactivo'}
              </span>
              <button
                type="button"
                onClick={() => setKioskEnabled(!kioskEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  kioskEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    kioskEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/10 rounded-2xl text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* SI EL KIOSCO ESTÁ DESACTIVADO */}
        {!kioskEnabled ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
            <h3 className="text-2xl font-bold text-white">El Kiosco Checador se encuentra desactivado</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Para habilitar la marcación por PIN o código QR para los empleados, activa el interruptor de encendido arriba a la derecha.
            </p>
            <button
              onClick={() => setKioskEnabled(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg cursor-pointer"
            >
              Activar Modo Kiosco Checador
            </button>
          </div>
        ) : (
          /* SI EL KIOSCO ESTÁ ACTIVADO */
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LADO IZQUIERDO: Reloj Digital + Selector de Modo + PIN Pad */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Reloj Digital Grande */}
              <div className="bg-gradient-to-br from-slate-950 to-indigo-950 border border-slate-800 p-6 rounded-3xl text-center space-y-1 shadow-inner">
                <div className="text-4xl sm:text-6xl font-mono font-bold tracking-wider text-white">
                  {currentTime.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-xs sm:text-sm text-indigo-300 font-medium capitalize">
                  {currentTime.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Botones de Selección de Tipo de Marcaje */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setClockType('Entrada')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    clockType === 'Entrada'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ☀️ Entrada
                </button>

                <button
                  type="button"
                  onClick={() => setClockType('Almuerzo_Inicio')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    clockType === 'Almuerzo_Inicio'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🥪 Salida Almuerzo
                </button>

                <button
                  type="button"
                  onClick={() => setClockType('Almuerzo_Fin')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    clockType === 'Almuerzo_Fin'
                      ? 'bg-sky-600 text-white border-sky-500 shadow-md ring-2 ring-sky-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🔄 Regreso Almuerzo
                </button>

                <button
                  type="button"
                  onClick={() => setClockType('Salida')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    clockType === 'Salida'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🌙 Salida
                </button>
              </div>

              {/* Display de PIN y Teclado Numérico Táctil */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-indigo-400" /> Digita tu PIN de 4 dígitos:
                  </span>
                  <span className="font-mono text-indigo-400 font-bold">{pinInput.length} / 4</span>
                </div>

                <div className="flex justify-center gap-3 py-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-xl transition-all ${
                        pinInput.length > idx
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
                          : 'border-slate-800 bg-slate-900 text-slate-600'
                      }`}
                    >
                      {pinInput.length > idx ? '●' : ''}
                    </div>
                  ))}
                </div>

                {/* Teclado Táctil */}
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handlePinPress(digit)}
                      className="h-14 bg-slate-900 hover:bg-indigo-600 active:scale-95 text-white font-mono text-xl font-bold rounded-2xl border border-slate-800 transition-all cursor-pointer shadow-sm flex items-center justify-center"
                    >
                      {digit}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handlePinClear}
                    className="h-14 bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs rounded-2xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center"
                  >
                    Borrar
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePinPress('0')}
                    className="h-14 bg-slate-900 hover:bg-indigo-600 active:scale-95 text-white font-mono text-xl font-bold rounded-2xl border border-slate-800 transition-all cursor-pointer shadow-sm flex items-center justify-center"
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProcessCheckIn()}
                    className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="w-5 h-5" /> Marcar
                  </button>
                </div>
              </div>

            </div>

            {/* LADO DERECHO: Selector Visual de Colaborador + Confirmación en Tiempo Real */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              
              {/* Banner de Confirmación Inmediata */}
              {lastCheckInSuccess ? (
                <div className="bg-emerald-950/80 border-2 border-emerald-500 p-6 rounded-3xl text-center space-y-3 shadow-2xl animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-300">¡Marcaje Exitoso!</h3>
                  <div className="text-sm font-semibold text-white">{lastCheckInSuccess.employeeName}</div>
                  <div className="inline-block px-3 py-1 bg-emerald-500/30 text-emerald-300 rounded-full text-xs font-mono">
                    {lastCheckInSuccess.type} • {lastCheckInSuccess.timestamp}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl space-y-3">
                  <h4 className="font-heading font-medium text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>O Selecciona tu Foto/Perfil:</span>
                    <span className="text-indigo-400 font-mono">{activeEmployees.length} Activos</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                    {activeEmployees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => handleProcessCheckIn(emp.id)}
                        className="p-3 bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                          {emp.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-white text-xs truncate block">{emp.fullName.split(' ')[0]}</span>
                          <span className="text-[10px] text-slate-400 truncate block">{emp.jobTitle}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bitácora Reciente del Día */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl space-y-3 flex-1">
                <h4 className="font-heading font-medium text-xs text-slate-400 uppercase tracking-wider">
                  Bitácora de Marcajes de Hoy ({attendanceRecords.length})
                </h4>

                {attendanceRecords.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No hay registros de marcaje hoy.</p>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {attendanceRecords.slice(0, 5).map((rec) => (
                      <div key={rec.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block">{rec.employeeName}</span>
                          <span className="text-[10px] text-slate-400">{rec.notes || 'Entrada'}</span>
                        </div>
                        <span className="font-mono text-emerald-400 text-xs">{rec.checkInTime}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
