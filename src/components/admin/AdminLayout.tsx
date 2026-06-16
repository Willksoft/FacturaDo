// Force TS re-parse
import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';
import { UserPermission } from '../../types';

// Subcomponents (we will create these next)
import AdminAnalytics from './AdminAnalytics.tsx';
import AdminUsersManager from './AdminUsersManager.tsx';

interface AdminLayoutProps {
  currentUser: UserPermission;
  users: UserPermission[];
  invoices: any[];
  clients: any[];
  products: any[];
  updateUserRole: (id: string, role: any) => void;
  deleteUser: (id: string) => void;
  banUser?: (id: string, isBanned: boolean) => void; // We will handle this
}

export default function AdminLayout({ 
  currentUser, 
  users, 
  invoices, 
  clients, 
  products,
  updateUserRole,
  deleteUser,
  banUser
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Guard: Only Administrador can access
  if (currentUser?.role !== 'Administrador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white font-sans p-4">
        <div className="max-w-md w-full bg-neutral-950 p-8 rounded-3xl border border-red-900/30 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-neutral-400 mb-8 text-sm">El Panel de Superusuario está reservado únicamente para administradores del sistema.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
          >
            Volver al Punto de Venta
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: '', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'Usuarios', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">Super Admin</h2>
              <p className="text-[10px] text-neutral-400 font-mono">Panel de Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === `/admin${item.id ? `/${item.id}` : ''}`;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/admin${item.id ? `/${item.id}` : ''}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Salir a Facturación
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-neutral-950/50">
        <div className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminAnalytics invoices={invoices} clients={clients} products={products} />} />
            <Route path="users" element={<AdminUsersManager users={users} updateUserRole={updateUserRole} deleteUser={deleteUser} banUser={banUser} />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
