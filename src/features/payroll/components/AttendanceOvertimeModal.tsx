import React, { useState } from 'react';
import { 
  Clock, 
  UserCheck, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  Zap,
  Sparkles,
  Smartphone,
  QrCode,
  Fingerprint
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../../../types/payroll';
import { calculateOvertimePay } from '../utils/dominicanTaxCalculators';

interface AttendanceOvertimeModalProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onAddAttendanceRecord: (rec: Omit<AttendanceRecord, 'id'>) => void;
}

export const AttendanceOvertimeModal: React.FC<AttendanceOvertimeModalProps> = ({
  employees,
  attendanceRecords,
  onAddAttendanceRecord,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [checkIn, setCheckIn] = useState('08:00');
  const [checkOut, setCheckOut] = useState('17:00');
  const [dayOvertimeHours, setDayOvertimeHours] = useState(0);
  const [nightOvertimeHours, setNightOvertimeHours] = useState(0);
  const [holidayOvertimeHours, setHolidayOvertimeHours] = useState(0);
  const [isLate, setIsLate] = useState(false);
  const [lateMinutes, setLateMinutes] = useState(0);
  const [source, setSource] = useState<AttendanceRecord['source']>('Biométrico');

  const selectedEmp = employees.find((e) => e.id === selectedEmployeeId);

  const handleCreateAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const totalOvertime = Number(dayOvertimeHours) + Number(nightOvertimeHours) + Number(holidayOvertimeHours);

    onAddAttendanceRecord({
      employeeId: selectedEmp.id,
      date,
      checkIn,
      checkOut,
      hoursWorked: 8,
      overtimeHours: Number(dayOvertimeHours),
      nightOvertimeHours: Number(nightOvertimeHours),
      holidayOvertimeHours: Number(holidayOvertimeHours),
      isLate,
      lateMinutes: Number(lateMinutes),
      status: isLate ? 'Tardanza' : 'Presente',
      source
    });

    setDayOvertimeHours(0);
    setNightOvertimeHours(0);
    setHolidayOvertimeHours(0);
    setIsLate(false);
    setLateMinutes(0);
  };

  const calculatedOvertimePay = selectedEmp
    ? calculateOvertimePay(selectedEmp.hourlyRate, dayOvertimeHours, nightOvertimeHours, holidayOvertimeHours)
    : 0;

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-sky-600" />
            Control de Asistencia & Horas Extras (Ley 16-92 R.D.)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registro automático de marcajes biométricos, horas diurnas (35%), nocturnas (50%) y días feriados (100%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-full text-xs font-medium flex items-center gap-1.5">
            <Fingerprint className="w-4 h-4 text-sky-600" />
            Integración Biométrica Activa
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registrar Marcaje / Horas Extras Form */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Registrar Asistencia u Horas Extras
          </h2>

          <form onSubmit={handleCreateAttendance} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Empleado *</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Método de Marcaje</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Biométrico">Biométrico / Huella</option>
                  <option value="Facial">Reconocimiento Facial</option>
                  <option value="QR">Código QR</option>
                  <option value="GPS Mobile">GPS App Móvil</option>
                  <option value="Web Manual">Manual Web</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Hora Entrada</label>
                <input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Hora Salida</label>
                <input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Horas Extras Desglose */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <span className="font-medium text-slate-900 block text-xs uppercase tracking-wider">
                Desglose Horas Extras (R.D.)
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Diurnas (35%)</label>
                  <input
                    type="number"
                    min={0}
                    value={dayOvertimeHours}
                    onChange={(e) => setDayOvertimeHours(Number(e.target.value))}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Nocturnas (50%)</label>
                  <input
                    type="number"
                    min={0}
                    value={nightOvertimeHours}
                    onChange={(e) => setNightOvertimeHours(Number(e.target.value))}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Feriados (100%)</label>
                  <input
                    type="number"
                    min={0}
                    value={holidayOvertimeHours}
                    onChange={(e) => setHolidayOvertimeHours(Number(e.target.value))}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                </div>
              </div>

              {selectedEmp && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Recargo Total a Pagar:</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    RD$ {calculatedOvertimePay.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Guardar Registro de Asistencia
            </button>
          </form>
        </div>

        {/* Historial de Asistencia */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-heading font-medium text-slate-900 flex items-center justify-between">
            <span>Historial de Marcajes y Horas Extras ({attendanceRecords.length})</span>
            <span className="text-xs text-slate-400 font-normal">Período actual</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Empleado</th>
                  <th className="p-3">Entrada / Salida</th>
                  <th className="p-3">Horas Extras</th>
                  <th className="p-3">Método</th>
                  <th className="p-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                      No hay registros de marcaje aún. Complete el formulario a la izquierda.
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((rec) => {
                    const emp = employees.find((e) => e.id === rec.employeeId);
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono text-slate-600">{rec.date}</td>
                        <td className="p-3 font-medium text-slate-900">{emp?.fullName || 'Empleado'}</td>
                        <td className="p-3 font-mono text-xs">
                          {rec.checkIn} - {rec.checkOut || 'N/A'}
                        </td>
                        <td className="p-3 font-bold text-sky-600">
                          {rec.overtimeHours + rec.nightOvertimeHours + rec.holidayOvertimeHours} hrs
                        </td>
                        <td className="p-3 text-slate-500 text-xs">{rec.source}</td>
                        <td className="p-3 text-right font-medium">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              rec.status === 'Tardanza'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
