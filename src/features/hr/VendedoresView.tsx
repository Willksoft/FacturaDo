import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Users, Briefcase, Plus, Search, Mail, Phone, Percent, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Seller } from '../../types';

interface VendedoresViewProps {
  sellers: Seller[];
  onAddSeller: (seller: Omit<Seller, 'id' | 'createdAt'>) => void;
  onUpdateSeller: (id: string, updates: Partial<Seller>) => void;
  onDeleteSeller: (id: string) => void;
}

export function VendedoresView({ sellers = [], onAddSeller, onUpdateSeller, onDeleteSeller }: VendedoresViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  
  const [notice, setNotice] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("El nombre del vendedor es obligatorio.");
      return;
    }

    onAddSeller({
      name: name.trim(),
      phone: phone.trim() || undefined,
      commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
      isActive: true,
    });

    setName('');
    setPhone('');
    setCommissionRate('');
    setIsAdding(false);
    
    setNotice('¡Vendedor registrado exitosamente!');
    setTimeout(() => setNotice(null), 3000);
  };

  const toggleActive = (id: string, currentActive: boolean) => {
    onUpdateSeller(id, { isActive: !currentActive });
  };

  const filteredSellers = sellers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.phone && s.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Gestión de Vendedores
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Cree y administre perfiles de vendedores para cálculos de comisiones sin requerir acceso al sistema.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-black hover:bg-neutral-800 text-white text-xs h-9">
            <Plus className="w-4 h-4 mr-2" />
            Añadir Vendedor
          </Button>
        )}
      </div>

      {notice && (
        <div className="p-3 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-250 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {notice}
        </div>
      )}

      {isAdding && (
        <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
          <CardHeader className="py-4 border-b border-indigo-100/50 bg-white/50">
            <CardTitle className="text-sm font-bold text-indigo-900">Registrar Nuevo Vendedor</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nombre Completo *</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Juan Pérez" className="text-xs h-9 bg-white" autoFocus />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Teléfono (Opcional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(809) 000-0000" className="text-xs h-9 pl-9 bg-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">% Comisión Base (Opcional)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <Input type="number" step="0.1" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} placeholder="0.0" className="text-xs h-9 pl-9 bg-white" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="h-9 text-xs">Cancelar</Button>
                <Button type="submit" className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">Guardar Vendedor</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-neutral-200 shadow-none">
        <CardHeader className="py-4 border-b border-neutral-100 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-sm font-semibold text-neutral-800">Directorio de Vendedores</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <Input 
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs h-8 pl-8 bg-white"
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-500 font-semibold border-b border-neutral-100">
                <th className="px-5 py-3">Nombre Vendedor</th>
                <th className="px-5 py-3">Contacto</th>
                <th className="px-5 py-3 text-center">Comisión</th>
                <th className="px-5 py-3 text-center">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-400 italic">
                    {searchTerm ? 'No se encontraron vendedores que coincidan con la búsqueda.' : 'No hay vendedores registrados en el sistema.'}
                  </td>
                </tr>
              ) : (
                filteredSellers.map(seller => (
                  <tr key={seller.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-neutral-800">
                      {seller.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-500">
                      {seller.phone || '-'}
                    </td>
                    <td className="px-5 py-3 text-center font-medium text-emerald-600">
                      {seller.commissionRate ? `${seller.commissionRate}%` : '-'}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button 
                        onClick={() => toggleActive(seller.id, seller.isActive)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${seller.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}
                      >
                        {seller.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => onDeleteSeller(seller.id)} className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 text-xs">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
        <p>
          <strong>Nota aclaratoria:</strong> Los vendedores creados en esta sección son entidades exclusivas para registro en facturas e histórico de comisiones. 
          <strong> No tienen acceso ni credenciales de inicio de sesión</strong> al sistema. Si un vendedor necesita facturar él mismo, debe primero ser creado como "Facturador" en la sección de Usuarios.
        </p>
      </div>
    </div>
  );
}
