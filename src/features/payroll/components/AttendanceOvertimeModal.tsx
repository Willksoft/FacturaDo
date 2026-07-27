import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  UserCheck, 
  QrCode,
  Sparkles
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../../../types/payroll';
import { AttendanceKioskModal } from './AttendanceKioskModal';

interface AttendanceOvertimeModalProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onAddAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
}

export const AttendanceOvertimeModal: React.FC<AttendanceOvertimeModalProps> = ({
  employees,
  attendanceRecords,
  onAddAttendanceRecord,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  const [recordDate, setRecordDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checkInTime, setCheckInTime] = useState<string>('08:00');
  const [checkOutTime, setCheckOutTime] = useState<string>('17:00');
  const [overtime35, setOvertime35] = useState<number>(0);
  const [overtime100, setOvertime100] = useState<number>(0);
  const [status, setStatus] = useState<'Puntual' | 'Tardanza' | 'Ausente_Justificada' | 'Ausente_Injustificada'>('Puntual');
  const [notes, setNotes] = useState<string>('');

  const [isKioskOpen, setIsKioskOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    if (!emp) return;

    onAddAttendanceRecord({
      employeeId: emp.id,
      employeeName: emp.fullName,
      date: recordDate,
      checkInTime,
      checkOutTime,
      regularHours: 8,
      overtime35Hours: overtime35,
      overtime100Hours: overtime100,
      status,
      notes,
    });

    alert(`¡Asistencia de "${emp.fullName}" registrada correctamente!`);
    setOvertime35(0);
    setOvertime100(0);
    setNotes('');
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-medium text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            Control de Asistencia, Tardanzas & Horas Extras (35% y 100%)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registra los marcajes diarios e integra el cómputo de recargos según el Código de Trabajo Ley 16-92.
          </p>
        </div>

        <button
          onClick={() => setIsKioskOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-black hover:to-indigo-900 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          Abrir Kiosco Checador PIN/QR
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Asistencia */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm">
          <h3 className="font-heading font-medium text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Registro Manual de Asistencia
          </h3>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Empleado *</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.jobTitle})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Fecha *</label>
            <input
              type="date"
              required
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Hora Entrada</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Hora Salida</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Horas Extras 35%</label>
              <input
                type="number"
                min={0}
                max={12}
                value={overtime35}
                onChange={(e) => setOvertime35(Number(e.target.value))}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Horas Extras 100%</label>
              <input
                type="number"
                min={0}
                max={12}
                value={overtime100}
                onChange={(e) => setOvertime100(Number(e.target.value))}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Estado de Asistencia *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl"
            >
              <option value="Puntual">Puntual</option>
              <option value="Tardanza">Tardanza</option>
              <option value="Ausente_Justificada">Ausencia Justificada (Permiso)</option>
              <option value="Ausente_Injustificada">Ausencia Injustificada (Descuento)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Guardar Marcaje
          </button>
        </form>

        {/* Tabla de Registros */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-heading font-medium text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Bitácora de Marcajes y Recargos ({attendanceRecords.length})</span>
            <span className="text-xs text-slate-500 font-mono">Ley 16-92 R.D.</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="p-3">Empleado</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3 text-center">Horario</th>
                  <th className="p-3 text-center">HE 35% / 100%</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {attendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 font-sans">{r.employeeName}</td>
                    <td className="p-3">{r.date}</td>
                    <td className="p-3 text-center">{r.checkInTime} - {r.checkOutTime || 'En jornada'}</td>
                    <td className="p-3 text-center">
                      <span className="text-amber-700 font-bold">{r.overtime35Hours}h</span> / <span className="text-rose-700 font-bold">{r.overtime100Hours}h</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                        r.status === 'Puntual' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Kiosco Checador PIN/QR */}
      {isKioskOpen && (
        <AttendanceKioskModal
          employees={employees}
          attendanceRecords={attendanceRecords}
          onAddAttendanceRecord={onAddAttendanceRecord}
          onClose={() => setIsKioskOpen(false)}
        />
      )}
    </div>
  );
};
