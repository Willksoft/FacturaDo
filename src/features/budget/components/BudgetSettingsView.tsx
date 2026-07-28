import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { BudgetRolePermission } from '../../../types/budget';

const DEFAULT_ROLES_PERMISSIONS: BudgetRolePermission[] = [
  { role: 'Administrador', canCreateBudget: true, canEditBudget: true, canDeleteBudget: true, canApproveBudget: true, canViewCosts: true, canManageResources: true, canManageTemplates: true },
  { role: 'Supervisor', canCreateBudget: true, canEditBudget: true, canDeleteBudget: false, canApproveBudget: true, canViewCosts: true, canManageResources: true, canManageTemplates: true },
  { role: 'Ventas', canCreateBudget: true, canEditBudget: true, canDeleteBudget: false, canApproveBudget: false, canViewCosts: false, canManageResources: false, canManageTemplates: false },
  { role: 'Producción', canCreateBudget: false, canEditBudget: false, canDeleteBudget: false, canApproveBudget: false, canViewCosts: false, canManageResources: true, canManageTemplates: false },
  { role: 'Contabilidad', canCreateBudget: false, canEditBudget: false, canDeleteBudget: false, canApproveBudget: true, canViewCosts: true, canManageResources: false, canManageTemplates: false },
  { role: 'Invitado', canCreateBudget: false, canEditBudget: false, canDeleteBudget: false, canApproveBudget: false, canViewCosts: false, canManageResources: false, canManageTemplates: false }
];

export default function BudgetSettingsView() {
  const [permissions, setPermissions] = useState<BudgetRolePermission[]>(DEFAULT_ROLES_PERMISSIONS);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const togglePermission = (role: string, field: keyof BudgetRolePermission) => {
    setPermissions(prev => prev.map(p => {
      if (p.role === role && typeof p[field] === 'boolean') {
        return { ...p, [field]: !p[field] };
      }
      return p;
    }));
  };

  const handleSavePermissions = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl" id="budget-settings-view">
      <Card className="border-neutral-200 bg-white rounded-xl shadow-xs overflow-hidden">
        <CardHeader className="bg-neutral-50 border-b border-neutral-150 p-4">
          <CardTitle className="text-sm font-extrabold text-neutral-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Configuración de Permisos por Rol en Presupuestos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {savedFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ¡Permisos actualizados correctamente!
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-neutral-200">
              <thead className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                <tr>
                  <th className="p-2.5">Rol de Usuario</th>
                  <th className="p-2.5 text-center">Crear</th>
                  <th className="p-2.5 text-center">Editar</th>
                  <th className="p-2.5 text-center">Eliminar</th>
                  <th className="p-2.5 text-center">Aprobar</th>
                  <th className="p-2.5 text-center">Ver Costos</th>
                  <th className="p-2.5 text-center">Recursos</th>
                  <th className="p-2.5 text-center">Plantillas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {permissions.map(p => (
                  <tr key={p.role} className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">{p.role}</td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={p.canCreateBudget} onChange={() => togglePermission(p.role, 'canCreateBudget')} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={p.canEditBudget} onChange={() => togglePermission(p.role, 'canEditBudget')} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={p.canDeleteBudget} onChange={() => togglePermission(p.role, 'canDeleteBudget')} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={p.canApproveBudget} onChange={() => togglePermission(p.role, 'canApproveBudget')} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={p.canViewCosts} onChange={() => togglePermission(p.role, 'canViewCosts')} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={p.canManageResources} onChange={() => togglePermission(p.role, 'canManageResources')} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={p.canManageTemplates} onChange={() => togglePermission(p.role, 'canManageTemplates')} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-150">
            <Button onClick={handleSavePermissions} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-5">
              Guardar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
