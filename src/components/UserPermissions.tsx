import React, { useState } from 'react';
import { UserPermission } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Sparkles, User, Key, Check, AlertCircle, Settings } from 'lucide-react';

interface UserPermissionsProps {
  users: UserPermission[];
  currentUser: UserPermission;
  addUser: (u: Omit<UserPermission, 'id'>) => void;
  updateUserRole: (id: string, role: 'Administrador' | 'Facturador' | 'Auditor' | 'Vendedor / POS') => void;
  deleteUser: (id: string) => void;
  handleActiveUserChange: (userId: string) => void;
}

export default function UserPermissions({
  users,
  currentUser,
  addUser,
  updateUserRole,
  deleteUser,
  handleActiveUserChange,
}: UserPermissionsProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Administrador' | 'Facturador' | 'Auditor' | 'Vendedor / POS'>('Facturador');
  

  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) return;

    const perms = {
      canCreateInvoice: true,
      canEditInvoice: true,
      canDeleteInvoice: true,
      canExportReports: true,
      canManageUsers: true,
    };

    addUser({
      username,
      email,
      role,
      
      permissions: perms,
    });

    setUsername('');
    setEmail('');
    setRole('Facturador');
    
    setNotice('¡Usuario incorporado de forma segura al esquema corporativo!');
    setTimeout(() => setNotice(null), 4000);
  };

  const currentPermissionsList = [
    { name: 'Emitir Facturas / Boletas NCF', active: currentUser.permissions.canCreateInvoice },
    { name: 'Visualizar / Editar secuencia NCF manual', active: currentUser.permissions.canEditInvoice },
    { name: 'Anular Facturas fiscales despachadas', active: currentUser.permissions.canDeleteInvoice },
    { name: 'Exportar Reportes 606 / 607 impositivos', active: currentUser.permissions.canExportReports },
    { name: 'Gestionar Permisos & Roles de personal', active: currentUser.permissions.canManageUsers },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="auth-panel">
      {/* RIGHT PANEL: USERS LIST AND USER INTAKE */}
      <div className="lg:col-span-3 space-y-6">
        {/* USERS REGISTRATION */}
        {currentUser.role === 'Administrador' ? (
          <Card className="border-neutral-200 shadow-none rounded-xl">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-3.5">
              <CardTitle className="text-sm font-semibold text-neutral-900">Dar de Alta Colaborador</CardTitle>
              <CardDescription className="text-xs">Registre secretarias, contadores o auditores independientes.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {notice && <div className="mb-4 p-2.5 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-250">{notice}</div>}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-1">
                  <Label htmlFor="usr-name" className="text-xs">Usuario Único *</Label>
                  <Input id="usr-name" placeholder="ramonalmonte" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="usr-email" className="text-xs">Correo Electrónico *</Label>
                  <Input id="usr-email" type="email" placeholder="ramon@dominio.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="usr-role" className="text-xs">Perfil Credencial</Label>
                  <Select value={role} onValueChange={(val: any) => setRole(val)}>
                    <SelectTrigger id="usr-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-xs font-sans">
                      <SelectItem value="Facturador">Facturador (Operador)</SelectItem>
                      <SelectItem value="Auditor">Auditor (Verificador)</SelectItem>
                      <SelectItem value="Vendedor / POS">Vendedor / POS (Comisiones)</SelectItem>
                      <SelectItem value="Administrador">Administrador (Total)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <Button type="submit" size="sm" className="bg-black hover:bg-neutral-800 text-white text-xs">
                    Crear Credenciales
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="p-4 rounded-xl border border-neutral-150 bg-neutral-50 text-neutral-600 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-neutral-500 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 block">Restricción de Rol Administrador</span>
              <span>La creación y enrolamiento de nuevos usuarios está bloqueada para su perfil actual. Cambie su usuario a "sedphotord" (Administrador) en el controlador izquierdo para desbloquear el formulario.</span>
            </div>
          </div>
        )}

        {/* WORK EMPLOYEES DIRECTORY TABLE */}
        <Card className="border-neutral-200 shadow-none rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-neutral-50 border-b border-neutral-150 py-4">
            <CardTitle className="text-sm font-semibold text-neutral-900">Catálogo de Usuarios Registrados</CardTitle>
            <CardDescription className="text-xs">Muestra el organigrama y credenciales operativas del sistema de facturación.</CardDescription>
          </CardHeader>
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow>
                <TableHead className="text-xs font-semibold text-neutral-700">Usuario</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Correo Electrónico</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Rol Operacional</TableHead>
                <TableHead className="text-center text-xs font-semibold text-neutral-700">Permisos Inmediatos</TableHead>
                <TableHead className="text-right text-xs font-semibold text-neutral-700">Modificar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isAdmin = u.role === 'Administrador';
                const isAuditor = u.role === 'Auditor';
                const isVendedor = u.role === 'Vendedor / POS';

                return (
                  <TableRow key={u.id} className="hover:bg-neutral-50/50 text-xs">
                    <TableCell className="font-semibold text-neutral-900">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-neutral-150 flex items-center justify-center text-[10px] uppercase font-bold">{u.username.charAt(0)}</div>
                        <span>{u.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-500 font-mono">{u.email}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isAdmin ? 'bg-neutral-950 text-white' :
                        isAuditor ? 'bg-blue-50 text-blue-800' : 
                        isVendedor ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {u.role}
                        {isVendedor && u.commissionRate !== undefined && ` (${u.commissionRate}%)`}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-[10px] text-neutral-500">
                        {u.permissions.canCreateInvoice ? 'Factura/Venta' : 'Solo-Lectura'} | {u.permissions.canDeleteInvoice ? 'Anula' : 'Sin-Anular'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {currentUser.role === 'Administrador' && u.id !== currentUser.id ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] h-7 w-7 text-neutral-400 hover:text-red-500 rounded"
                            onClick={() => deleteUser(u.id)}
                            title="Desasociar Usuario"
                          >
                            Eliminar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-[10px]">Protegido</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
