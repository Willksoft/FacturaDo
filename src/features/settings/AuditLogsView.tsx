import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  History, Search, Filter, Calendar, Eye, User, FileText, 
  Trash2, Edit, Plus, Info, RefreshCw, X, ShieldAlert 
} from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogsViewProps {
  auditLogs: AuditLog[];
  onRefresh: () => Promise<void>;
}

export function AuditLogsView({ auditLogs = [], onRefresh }: AuditLogsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act === 'CREAR') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Plus className="w-3 h-3 mr-1" />
          Crear
        </span>
      );
    } else if (act === 'ACTUALIZAR') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <Edit className="w-3 h-3 mr-1" />
          Actualizar
        </span>
      );
    } else if (act === 'ELIMINAR') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <Trash2 className="w-3 h-3 mr-1" />
          Eliminar
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-50 text-neutral-700 border border-neutral-200">
        <Info className="w-3 h-3 mr-1" />
        {action}
      </span>
    );
  };

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case 'invoices':
        return 'Facturas / Cotizaciones';
      case 'products':
        return 'Productos';
      case 'clients':
        return 'Clientes';
      case 'providers':
        return 'Proveedores';
      case 'receipts':
        return 'Recibos';
      default:
        return entity;
    }
  };

  const formatDetails = (detailsStr: string | null) => {
    if (!detailsStr) return 'Sin detalles adicionales.';
    
    // Scrub Supabase UUID prefixes (e.g. 123e4567-e89b-12d3-a456-426614174000_)
    const cleanStr = detailsStr.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_/gi, '');
    
    try {
      const parsed = JSON.parse(cleanStr);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return cleanStr;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action.toUpperCase() === actionFilter.toUpperCase();
    const matchesEntity = entityFilter === 'ALL' || log.entity.toLowerCase() === entityFilter.toLowerCase();

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Historial de Auditoría
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Registro de operaciones críticas y trazabilidad de cambios en tiempo real en la base de datos.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="text-xs h-9"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Sincronizando...' : 'Sincronizar'}
        </Button>
      </div>

      {/* Grid of Summary cards or filters */}
      <Card className="border-neutral-200 shadow-none">
        <CardHeader className="py-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-sm font-semibold text-neutral-800">Filtros de Búsqueda</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <Input 
                placeholder="Buscar por usuario o detalle..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs h-8.5 pl-8.5 bg-white"
              />
            </div>
            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs h-8.5 px-3 rounded-lg border border-neutral-200 bg-white text-neutral-700 outline-none focus:border-neutral-300"
            >
              <option value="ALL">Todas las acciones</option>
              <option value="CREAR">Creaciones</option>
              <option value="ACTUALIZAR">Actualizaciones</option>
              <option value="ELIMINAR">Eliminaciones</option>
            </select>
            {/* Entity Filter */}
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="text-xs h-8.5 px-3 rounded-lg border border-neutral-200 bg-white text-neutral-700 outline-none focus:border-neutral-300"
            >
              <option value="ALL">Todas las entidades</option>
              <option value="invoices">Facturas / Cotizaciones</option>
              <option value="products">Productos</option>
              <option value="clients">Clientes</option>
              <option value="providers">Proveedores</option>
              <option value="receipts">Recibos</option>
            </select>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-500 font-semibold border-b border-neutral-100">
                <th className="px-5 py-3">Fecha y Hora</th>
                <th className="px-5 py-3">Usuario / Email</th>
                <th className="px-5 py-3">Acción</th>
                <th className="px-5 py-3">Módulo</th>
                <th className="px-5 py-3">Resumen de Cambios</th>
                <th className="px-5 py-3 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-neutral-400 italic">
                    No hay registros de auditoría que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const logDate = new Date(log.createdAt);
                  const formattedDate = logDate.toLocaleDateString('es-DO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                  const formattedTime = logDate.toLocaleTimeString('es-DO', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });

                  // Scrub UUID from entityId for display
                  const displayEntityId = log.entityId.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_/gi, '');

                  // Extract short details for summary
                  let summary = 'Sin detalles';
                  if (log.details) {
                    const cleanDetails = log.details.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_/gi, '');
                    try {
                      const parsed = JSON.parse(cleanDetails);
                      if (log.action === 'CREAR') {
                        summary = parsed.name || parsed.number || parsed.receiptNumber || `Registro ID: ${displayEntityId}`;
                      } else if (log.action === 'ACTUALIZAR') {
                        summary = Object.keys(parsed).join(', ');
                      } else {
                        summary = `Registro ID: ${displayEntityId}`;
                      }
                    } catch {
                      summary = cleanDetails;
                    }
                  }

                  return (
                    <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-neutral-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{formattedDate}</span>
                          <span className="text-neutral-400 font-normal text-[10px] bg-neutral-100 px-1 py-0.5 rounded">
                            {formattedTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-neutral-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                            <User className="w-3 h-3 text-neutral-500" />
                          </div>
                          <span>{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-500 font-medium">
                        {getEntityLabel(log.entity)}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600 max-w-[200px] truncate font-mono text-[11px]" title={summary}>
                        {summary}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setSelectedLog(log)}
                          className="h-7 w-7 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Slide-over Drawer / Dialog */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                  <History className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">Detalles de Operación</h3>
                  <p className="text-[11px] text-neutral-500">ID de Log: {selectedLog.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Basic Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Usuario Responsable</span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{selectedLog.userName}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Fecha y Hora</span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{new Date(selectedLog.createdAt).toLocaleString('es-DO')}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Acción Realizada</span>
                  <div>{getActionBadge(selectedLog.action)}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Módulo Afectado</span>
                  <div className="text-xs font-semibold text-neutral-800">{getEntityLabel(selectedLog.entity)}</div>
                </div>
              </div>

              {/* Entity IDs */}
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">ID de Registro (Postgres):</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 text-[11px]">
                    {selectedLog.entityId}
                  </span>
                </div>
                {selectedLog.userId && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">ID de Usuario Auth:</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 text-[11px]">
                      {selectedLog.userId}
                    </span>
                  </div>
                )}
              </div>

              {/* Payload Details */}
              <div className="space-y-2 flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Datos de Transacción</span>
                <div className="flex-1 bg-neutral-900 rounded-xl p-4 font-mono text-xs text-neutral-200 overflow-auto max-h-[300px] border border-neutral-950">
                  <pre className="whitespace-pre-wrap">{formatDetails(selectedLog.details)}</pre>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setSelectedLog(null)}
                className="text-xs h-9 px-4"
              >
                Cerrar Panel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
