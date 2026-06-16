import React, { useState } from 'react';
import { UserPermission } from '../../types';
import { Shield, ShieldAlert, MoreVertical, Edit2, Ban, Mail, Key, UserCheck, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AdminUsersManagerProps {
  users: UserPermission[];
  updateUserRole: (id: string, role: any) => void;
  deleteUser: (id: string) => void;
  banUser?: (id: string, isBanned: boolean) => void;
}

export default function AdminUsersManager({ users, updateUserRole, deleteUser, banUser }: AdminUsersManagerProps) {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock states for action modals
  const [actionModal, setActionModal] = useState<'password' | 'email' | 'ban' | null>(null);
  const [actionInputValue, setActionInputValue] = useState('');

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Administrador': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Auditor': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Vendedor / POS': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  const executeAction = () => {
    if (!selectedUser) return;
    
    if (actionModal === 'ban') {
      if (banUser) {
        banUser(selectedUser.id, !selectedUser.isBanned);
      } else {
        alert('Esta acción requiere habilitar el Backend API o el Service Role de Supabase.');
      }
    } else if (actionModal === 'password') {
      alert(`Contraseña para ${selectedUser.email} cambiada exitosamente (Simulado). \nRequiere Service Role para aplicar en Auth real.`);
    } else if (actionModal === 'email') {
      alert(`Correo para ${selectedUser.username} cambiado a ${actionInputValue} (Simulado). \nRequiere Service Role para aplicar en Auth real.`);
    }
    
    setActionModal(null);
    setActionInputValue('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Gestión de Usuarios</h1>
          <p className="text-neutral-400 text-sm mt-1">Administra los accesos, roles y credenciales del sistema.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Input 
            type="search" 
            placeholder="Buscar por correo o nombre..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500"
          />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-4">Usuario</th>
                <th scope="col" className="px-6 py-4">Rol</th>
                <th scope="col" className="px-6 py-4">Estado</th>
                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs uppercase border border-neutral-700">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.username.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className={user.isBanned ? 'line-through text-neutral-500' : ''}>{user.username}</div>
                        <div className="text-xs text-neutral-500 font-mono">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBanned ? (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
                        <Ban className="w-3.5 h-3.5" /> Suspendido
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                        <UserCheck className="w-3.5 h-3.5" /> Activo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedUser(user); setActionModal('email'); }}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Cambiar Correo"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(user); setActionModal('password'); }}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Cambiar Contraseña"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(user); setActionModal('ban'); }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.isBanned 
                            ? 'text-green-400 hover:bg-green-400/10' 
                            : 'text-red-400 hover:bg-red-400/10'
                        }`}
                        title={user.isBanned ? "Quitar Suspensión" : "Suspender Usuario"}
                      >
                        {user.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                    No se encontraron usuarios con ese criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modals */}
      {actionModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              {actionModal === 'ban' ? (selectedUser.isBanned ? 'Reactivar Usuario' : 'Suspender Usuario') : ''}
              {actionModal === 'password' ? 'Cambiar Contraseña' : ''}
              {actionModal === 'email' ? 'Cambiar Correo Electrónico' : ''}
            </h3>
            <p className="text-sm text-neutral-400 mb-6">
              {actionModal === 'ban' && `¿Estás seguro que deseas ${selectedUser.isBanned ? 'reactivar a' : 'suspender el acceso de'} ${selectedUser.username}?`}
              {actionModal === 'password' && `Ingrese la nueva contraseña provisoria para ${selectedUser.username}.`}
              {actionModal === 'email' && `Ingrese el nuevo correo electrónico para ${selectedUser.username}.`}
            </p>

            {actionModal === 'password' && (
              <Input 
                type="password" 
                placeholder="Nueva Contraseña" 
                value={actionInputValue}
                onChange={e => setActionInputValue(e.target.value)}
                className="mb-4 bg-neutral-950 border-neutral-800 text-white"
              />
            )}

            {actionModal === 'email' && (
              <Input 
                type="email" 
                placeholder="Nuevo Correo" 
                value={actionInputValue}
                onChange={e => setActionInputValue(e.target.value)}
                className="mb-4 bg-neutral-950 border-neutral-800 text-white"
              />
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setActionModal(null); setActionInputValue(''); }} className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800">
                Cancelar
              </Button>
              <Button 
                onClick={executeAction}
                className={actionModal === 'ban' && !selectedUser.isBanned ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
              >
                Confirmar Acción
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
