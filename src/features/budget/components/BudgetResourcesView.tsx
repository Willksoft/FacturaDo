import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Filter,
  DollarSign,
  Tag,
  Check,
  X
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BudgetResource, CalculationType } from '../../../types/budget';

interface BudgetResourcesViewProps {
  resources: BudgetResource[];
  onSaveResource: (res: Omit<BudgetResource, 'id' | 'createdAt'> & { id?: string }) => void;
  onDeleteResource: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const CALCULATION_TYPES: { value: CalculationType; label: string; description: string }[] = [
  { value: 'precio_fijo', label: 'Precio Fijo (Flat)', description: 'No requiere datos adicionales' },
  { value: 'cantidad', label: 'Por Cantidad / Pieza', description: 'Multiplica por unidades requeridas' },
  { value: 'area', label: 'Por Área (m² / ft²)', description: 'Solicita Ancho x Alto x Cantidad' },
  { value: 'volumen', label: 'Por Volumen (m³ / ft³)', description: 'Solicita Largo x Ancho x Alto x Cantidad' },
  { value: 'perimetro', label: 'Por Perímetro / Borde', description: 'Solicita Ancho x Alto (calcula perímetro)' },
  { value: 'metros_lineales', label: 'Metros Lineales (ml)', description: 'Calcula tiras y bordes continuos' },
  { value: 'horas', label: 'Horas Hombre / Técnico', description: 'Solicita Horas x Empleados' },
  { value: 'dias', label: 'Por Día / Jornada', description: 'Solicita Días x Cantidad' },
  { value: 'kilometros', label: 'Por Kilómetro / Flete', description: 'Solicita Distancia (Km) x Viajes' },
  { value: 'peso', label: 'Por Peso (Kg / Libras)', description: 'Solicita Kilos x Cantidad' }
];

export default function BudgetResourcesView({
  resources,
  onSaveResource,
  onDeleteResource,
  onToggleFavorite
}: BudgetResourcesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');
  const [showModal, setShowModal] = useState(false);
  const [editingRes, setEditingRes] = useState<BudgetResource | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Materiales');
  const [unit, setUnit] = useState('unidad');
  const [cost, setCost] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [calculationType, setCalculationType] = useState<CalculationType>('area');
  const [supplierName, setSupplierName] = useState('');
  const [description, setDescription] = useState('');

  const openCreateModal = () => {
    setEditingRes(null);
    setName('');
    setCode(`RES-${Math.floor(Math.random() * 899 + 100)}`);
    setSku('');
    setCategory('Materiales');
    setUnit('m2');
    setCost(0);
    setPrice(0);
    setTaxRate(18);
    setCalculationType('area');
    setSupplierName('');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (res: BudgetResource) => {
    setEditingRes(res);
    setName(res.name);
    setCode(res.code);
    setSku(res.sku || '');
    setCategory(res.category);
    setUnit(res.unit);
    setCost(res.cost);
    setPrice(res.price);
    setTaxRate(res.taxRate);
    setCalculationType(res.calculationType);
    setSupplierName(res.supplierName || '');
    setDescription(res.description || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveResource({
      id: editingRes?.id,
      name,
      code,
      sku,
      category,
      unit,
      cost,
      price,
      taxRate,
      calculationType,
      supplierName,
      description
    });

    setShowModal(false);
  };

  const categories = Array.from(new Set(resources.map(r => r.category)));

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.sku && r.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'TODAS' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="budget-resources-view">
      {/* TOOLBAR & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por recurso, código, SKU..."
              className="pl-9 text-xs h-9"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 text-xs h-9 bg-white">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="TODAS">Todas las Categorías</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 px-4 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Recurso
        </Button>
      </div>

      {/* RESOURCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-neutral-400 bg-white border border-neutral-200 rounded-xl">
            No se encontraron recursos que coincidan con la búsqueda.
          </div>
        ) : (
          filteredResources.map(r => (
            <Card key={r.id} className="border-neutral-200 bg-white rounded-xl p-4 space-y-3 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                      {r.category}
                    </span>
                    <h4 className="font-extrabold text-xs text-neutral-900 mt-1.5 leading-snug">{r.name}</h4>
                  </div>
                  <button
                    onClick={() => onToggleFavorite(r.id)}
                    className="text-neutral-300 hover:text-amber-500 cursor-pointer transition-colors p-1"
                  >
                    <Star className={`w-4 h-4 ${r.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {r.description || 'Sin descripción adicional.'}
                </p>

                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-150 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-450">Código / SKU:</span>
                    <span className="font-bold text-neutral-800">{r.code} {r.sku ? `(${r.sku})` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-450">Tipo de Cálculo:</span>
                    <span className="font-bold text-indigo-600 uppercase">{r.calculationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-450">Proveedor:</span>
                    <span className="text-neutral-700">{r.supplierName || 'Interno'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-150 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-neutral-400">Precio Venta / {r.unit}:</div>
                  <div className="text-xs font-black text-emerald-700">
                    RD$ {r.price.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] text-neutral-400">Costo: RD$ {r.cost.toLocaleString('es-DO')}</div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(r)}
                    className="h-7 w-7 text-neutral-600 hover:bg-neutral-100 rounded-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteResource(r.id)}
                    className="h-7 w-7 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in font-sans">
            <div className="flex items-center justify-between border-b border-neutral-150 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                {editingRes ? 'Editar Recurso de Costeo' : 'Nuevo Recurso de Costeo'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Nombre Recurso *</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Ej. PVC 10mm" className="text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Categoría</Label>
                  <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Materiales, Servicios..." className="text-xs h-9" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Código</Label>
                  <Input value={code} onChange={e => setCode(e.target.value)} className="text-xs h-9 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">SKU (Opcional)</Label>
                  <Input value={sku} onChange={e => setSku(e.target.value)} className="text-xs h-9 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Unidad Mínima</Label>
                  <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="m2, hrs, unidad..." className="text-xs h-9" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-neutral-700">Tipo de Cálculo Dinámico *</Label>
                <Select value={calculationType} onValueChange={(val: CalculationType) => setCalculationType(val)}>
                  <SelectTrigger className="text-xs h-9 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {CALCULATION_TYPES.map(ct => (
                      <SelectItem key={ct.value} value={ct.value}>
                        {ct.label} — <span className="text-neutral-400 text-[10px]">{ct.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Costo Base (RD$)</Label>
                  <Input type="number" step="0.01" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">Precio Venta (RD$)</Label>
                  <Input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">ITBIS %</Label>
                  <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="text-xs h-9" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-neutral-700">Proveedor Sugerido</Label>
                <Input value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder="Ej. Distribuidora Central" className="text-xs h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-neutral-700">Descripción / Especificación Técnica</Label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detalles sobre densidad, acabado, origen..."
                  className="w-full text-xs p-2 border border-neutral-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-neutral-150">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 text-xs h-9">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 font-bold">
                  Guardar Recurso
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
