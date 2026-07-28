import {
  X,
  Plus,
  Trash2,
  Calculator,
  Eye,
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Copy,
  GitBranch,
  FileEdit,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  Budget,
  BudgetGroup,
  BudgetItem,
  BudgetItemInput,
  BudgetResource,
  BudgetStatus,
  BudgetTemplate
} from '../../../types/budget';
import { calculateBudgetItemQuantity } from '../../../hooks/useBudgetState';

interface BudgetEditorModalProps {
  budget: Partial<Budget> | null;
  resources: BudgetResource[];
  templates: BudgetTemplate[];
  onClose: () => void;
  onSave: (budget: Partial<Budget> & { title: string }) => void;
  onConvertToQuote?: (budget: Budget) => void;
  onDuplicateBudget?: (id: string) => void;
  onCreateVersion?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onDeletePermanently?: (id: string) => void;
}

export default function BudgetEditorModal({
  budget,
  resources,
  templates,
  onClose,
  onSave,
  onConvertToQuote,
  onDuplicateBudget,
  onCreateVersion,
  onMoveToTrash,
  onDeletePermanently
}: BudgetEditorModalProps) {
  const [title, setTitle] = useState(budget?.title || '');
  const [clientName, setClientName] = useState(budget?.clientName || '');
  const [projectName, setProjectName] = useState(budget?.projectName || '');
  const [notes, setNotes] = useState(budget?.notes || '');
  const [status, setStatus] = useState<BudgetStatus>(budget?.status || 'Borrador');
  const [viewMode, setViewMode] = useState<'cliente' | 'interno' | 'produccion' | 'contabilidad'>(budget?.viewMode || 'interno');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const [groups, setGroups] = useState<BudgetGroup[]>(() => {
    if (budget?.groups && budget.groups.length > 0) {
      return budget.groups;
    }
    return [
      {
        id: `grp-${Date.now()}-1`,
        name: 'Sustratos y Materiales Principal',
        items: [],
        subtotalCost: 0,
        subtotalPrice: 0,
        taxTotal: 0,
        total: 0
      }
    ];
  });

  // Load template structure into budget
  const handleApplyTemplate = (tplId: string) => {
    const tpl = templates.find(t => t.id === tplId);
    if (!tpl) return;

    setSelectedTemplateId(tplId);
    if (!title) setTitle(`Presupuesto - ${tpl.name}`);

    // Group items by groupName
    const groupMap: Record<string, BudgetItem[]> = {};
    tpl.items.forEach(ti => {
      const res = resources.find(r => r.id === ti.resourceId);
      if (res) {
        const inputs = ti.defaultInputs || { cantidad: 1 };
        const qtyCalculated = calculateBudgetItemQuantity(res.calculationType, inputs);
        const subtotalCost = Number((res.cost * qtyCalculated).toFixed(2));
        const subtotalPrice = Number((res.price * qtyCalculated).toFixed(2));
        const taxAmount = Number((subtotalPrice * (res.taxRate / 100)).toFixed(2));
        const total = Number((subtotalPrice + taxAmount).toFixed(2));

        const newItem: BudgetItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          resourceId: res.id,
          resourceName: res.name,
          category: res.category,
          unit: res.unit,
          calculationType: res.calculationType,
          inputs,
          unitCost: res.cost,
          unitPrice: res.price,
          quantityCalculated: qtyCalculated,
          subtotalCost,
          subtotalPrice,
          taxRate: res.taxRate,
          taxAmount,
          total
        };

        if (!groupMap[ti.groupName]) groupMap[ti.groupName] = [];
        groupMap[ti.groupName].push(newItem);
      }
    });

    const newGroups: BudgetGroup[] = Object.keys(groupMap).map((gName, idx) => {
      const items = groupMap[gName];
      const subtotalCost = items.reduce((a, i) => a + i.subtotalCost, 0);
      const subtotalPrice = items.reduce((a, i) => a + i.subtotalPrice, 0);
      const taxTotal = items.reduce((a, i) => a + i.taxAmount, 0);
      const total = items.reduce((a, i) => a + i.total, 0);

      return {
        id: `grp-${Date.now()}-${idx}`,
        name: gName,
        items,
        subtotalCost,
        subtotalPrice,
        taxTotal,
        total
      };
    });

    setGroups(newGroups);
  };

  // Add Item to Group
  const handleAddItemToGroup = (groupId: string, resourceId: string) => {
    const res = resources.find(r => r.id === resourceId);
    if (!res) return;

    const defaultInputs = { cantidad: 1, ancho: 1, alto: 1, largo: 1, horas: 1, empleados: 1, distanciaKm: 10, viajes: 1 };
    const qtyCalculated = calculateBudgetItemQuantity(res.calculationType, defaultInputs);
    const subtotalCost = Number((res.cost * qtyCalculated).toFixed(2));
    const subtotalPrice = Number((res.price * qtyCalculated).toFixed(2));
    const taxAmount = Number((subtotalPrice * (res.taxRate / 100)).toFixed(2));
    const total = Number((subtotalPrice + taxAmount).toFixed(2));

    const newItem: BudgetItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      resourceId: res.id,
      resourceName: res.name,
      category: res.category,
      unit: res.unit,
      calculationType: res.calculationType,
      inputs: defaultInputs,
      unitCost: res.cost,
      unitPrice: res.price,
      quantityCalculated: qtyCalculated,
      subtotalCost,
      subtotalPrice,
      taxRate: res.taxRate,
      taxAmount,
      total
    };

    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const items = [...g.items, newItem];
        return recalculateGroup(g.id, g.name, items);
      }
      return g;
    }));
  };

  // Update item input parameters dynamically
  const handleUpdateItemInputs = (groupId: string, itemId: string, newInputs: Partial<BudgetItemInput>) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const items = g.items.map(item => {
          if (item.id === itemId) {
            const mergedInputs = { ...item.inputs, ...newInputs };
            const qtyCalculated = calculateBudgetItemQuantity(item.calculationType, mergedInputs);
            const subtotalCost = Number((item.unitCost * qtyCalculated).toFixed(2));
            const subtotalPrice = Number((item.unitPrice * qtyCalculated).toFixed(2));
            const taxAmount = Number((subtotalPrice * (item.taxRate / 100)).toFixed(2));
            const total = Number((subtotalPrice + taxAmount).toFixed(2));

            return {
              ...item,
              inputs: mergedInputs,
              quantityCalculated: qtyCalculated,
              subtotalCost,
              subtotalPrice,
              taxAmount,
              total
            };
          }
          return item;
        });
        return recalculateGroup(g.id, g.name, items);
      }
      return g;
    }));
  };

  const handleRemoveItem = (groupId: string, itemId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const items = g.items.filter(i => i.id !== itemId);
        return recalculateGroup(g.id, g.name, items);
      }
      return g;
    }));
  };

  const handleAddGroup = () => {
    const newGroup: BudgetGroup = {
      id: `grp-${Date.now()}`,
      name: `Grupo #${groups.length + 1}`,
      items: [],
      subtotalCost: 0,
      subtotalPrice: 0,
      taxTotal: 0,
      total: 0
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const handleRemoveGroup = (groupId: string) => {
    if (groups.length <= 1) return;
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  function recalculateGroup(id: string, name: string, items: BudgetItem[]): BudgetGroup {
    const subtotalCost = items.reduce((a, i) => a + i.subtotalCost, 0);
    const subtotalPrice = items.reduce((a, i) => a + i.subtotalPrice, 0);
    const taxTotal = items.reduce((a, i) => a + i.taxAmount, 0);
    const total = items.reduce((a, i) => a + i.total, 0);
    return { id, name, items, subtotalCost, subtotalPrice, taxTotal, total };
  }

  // Calculate Global Budget Totals
  const globalSubtotalCost = groups.reduce((a, g) => a + g.subtotalCost, 0);
  const globalSubtotalPrice = groups.reduce((a, g) => a + g.subtotalPrice, 0);
  const globalTaxTotal = groups.reduce((a, g) => a + g.taxTotal, 0);
  const globalTotal = groups.reduce((a, g) => a + g.total, 0);
  const globalProfitAmount = globalSubtotalPrice - globalSubtotalCost;
  const globalProfitPct = globalSubtotalCost > 0 ? (globalProfitAmount / globalSubtotalCost) * 100 : 0;

  const handleSaveBudgetForm = (overrideStatus?: BudgetStatus) => {
    if (!title.trim()) {
      alert("Por favor ingrese el título del presupuesto.");
      return;
    }

    const finalStatus = overrideStatus || status || 'Borrador';

    onSave({
      id: budget?.id,
      budgetNumber: budget?.budgetNumber,
      title,
      clientName: clientName || 'Cliente General',
      projectName,
      version: budget?.version || 1,
      status: finalStatus,
      viewMode,
      groups,
      subtotalCost: globalSubtotalCost,
      subtotalPrice: globalSubtotalPrice,
      taxTotal: globalTaxTotal,
      total: globalTotal,
      profitMarginAmount: globalProfitAmount,
      profitMarginPct: Number(globalProfitPct.toFixed(2)),
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-5xl w-full p-4 sm:p-6 space-y-6 shadow-2xl animate-fade-in font-sans my-auto max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-150 pb-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-extrabold text-neutral-900">
                {budget?.id ? `Editar Presupuesto ${budget.budgetNumber}` : 'Nuevo Presupuesto Dinámico'}
              </h2>
            </div>
            <p className="text-xs text-neutral-500">
              Calcule automáticamente costos, precios y márgenes agregando recursos y dimensiones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* VIEW MODE TOGGLE */}
            <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('interno')}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-all ${viewMode === 'interno' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Interno (Costos)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cliente')}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-all ${viewMode === 'cliente' ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Cliente (Totales)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('produccion')}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-all ${viewMode === 'produccion' ? 'bg-slate-800 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Producción (Medidas)
              </button>
            </div>

            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY CONTAINER WITH SCROLL */}
        <div className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* HEADER FORM INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className="space-y-1 sm:col-span-2 md:col-span-1">
              <Label className="text-[11px] font-bold text-neutral-700">Título del Presupuesto *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Remodelación Local Comercial" className="text-xs h-9 bg-white" />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-neutral-700">Cliente / Proyecto</Label>
              <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Empresa o Persona" className="text-xs h-9 bg-white" />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-neutral-700">Estado del Presupuesto</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as BudgetStatus)}>
                <SelectTrigger className="text-xs h-9 bg-white font-bold">
                  <SelectValue placeholder="Estado..." />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Borrador">📝 Borrador</SelectItem>
                  <SelectItem value="Enviado">📩 Enviado</SelectItem>
                  <SelectItem value="Aprobado">✅ Aprobado</SelectItem>
                  <SelectItem value="Rechazado">❌ Rechazado</SelectItem>
                  <SelectItem value="Convertido">🔄 Convertido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-neutral-700">Cargar desde Plantilla</Label>
              <Select value={selectedTemplateId} onValueChange={handleApplyTemplate}>
                <SelectTrigger className="text-xs h-9 bg-white">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  <SelectValue placeholder="Seleccionar plantilla..." />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} ({t.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* GROUPS & ITEMS */}
          <div className="space-y-4">
            {groups.map((grp, gIndex) => (
              <div key={grp.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs space-y-3 p-4">
                <div className="flex items-center justify-between border-b border-neutral-150 pb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center">
                      #{gIndex + 1}
                    </span>
                    <Input
                      value={grp.name}
                      onChange={e => {
                        const newName = e.target.value;
                        setGroups(prev => prev.map(g => g.id === grp.id ? { ...g, name: newName } : g));
                      }}
                      className="text-xs font-bold border-none shadow-none h-8 w-64 text-neutral-900 bg-neutral-50 hover:bg-neutral-100"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Add Resource Selector */}
                    <Select onValueChange={(resId: string) => handleAddItemToGroup(grp.id, resId)}>
                      <SelectTrigger className="text-xs h-8 bg-indigo-50 border-indigo-200 text-indigo-700 font-bold">
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        <span>Agregar Recurso</span>
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        {resources.map(r => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} — RD$ {r.price}/{r.unit} ({r.calculationType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {groups.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveGroup(grp.id)} className="h-8 w-8 text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* UNIFIED GROUP DIMENSION BAR (VARIABLES AUTOMÁTICAS) */}
                {grp.items.some(i => i.calculationType === 'area') && (
                  <div className="bg-indigo-50/80 p-2.5 rounded-lg border border-indigo-150 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Variables Automáticas del Grupo (Área)</span>
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 font-normal px-2 py-0.5 rounded-md">
                        Aplica a todos los recursos de área en este grupo
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700">Ancho (m):</span>
                        <Input
                          type="number"
                          step="0.01"
                          defaultValue={grp.items.find(i => i.calculationType === 'area')?.inputs.ancho || 1}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            grp.items.filter(i => i.calculationType === 'area').forEach(i => {
                              handleUpdateItemInputs(grp.id, i.id, { ancho: val });
                            });
                          }}
                          className="h-7 w-20 text-xs font-bold bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700">Alto (m):</span>
                        <Input
                          type="number"
                          step="0.01"
                          defaultValue={grp.items.find(i => i.calculationType === 'area')?.inputs.alto || 1}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            grp.items.filter(i => i.calculationType === 'area').forEach(i => {
                              handleUpdateItemInputs(grp.id, i.id, { alto: val });
                            });
                          }}
                          className="h-7 w-20 text-xs font-bold bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700">Cantidad:</span>
                        <Input
                          type="number"
                          defaultValue={grp.items.find(i => i.calculationType === 'area')?.inputs.cantidad || 1}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            grp.items.filter(i => i.calculationType === 'area').forEach(i => {
                              handleUpdateItemInputs(grp.id, i.id, { cantidad: val });
                            });
                          }}
                          className="h-7 w-20 text-xs font-bold bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ITEMS TABLE IN GROUP */}
                {grp.items.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-400 italic">
                    Sin recursos agregados a este grupo. Seleccione un recurso arriba.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 font-sans">
                    {grp.items.map(item => (
                      <div key={item.id} className="py-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                        {/* ITEM NAME & DESCRIPTION */}
                        <div className="md:col-span-4 space-y-0.5">
                          <div className="font-extrabold text-neutral-900">{item.resourceName}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            {item.category} • Cálculo: <span className="font-bold text-indigo-600">{item.calculationType}</span>
                          </div>
                        </div>

                        {/* DYNAMIC INPUT VALUES FOR CALCULATION */}
                        <div className="md:col-span-4 flex flex-wrap items-center gap-2 bg-neutral-50 p-2 rounded-lg border border-neutral-150">
                          {item.calculationType === 'area' && (
                            <>
                              <div className="w-16">
                                <span className="text-[9px] text-neutral-400 block font-bold">Ancho (m)</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.inputs.ancho || 1}
                                  onChange={e => handleUpdateItemInputs(grp.id, item.id, { ancho: parseFloat(e.target.value) || 0 })}
                                  className="h-7 text-[11px] p-1 font-mono"
                                />
                              </div>
                              <div className="w-16">
                                <span className="text-[9px] text-neutral-400 block font-bold">Alto (m)</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.inputs.alto || 1}
                                  onChange={e => handleUpdateItemInputs(grp.id, item.id, { alto: parseFloat(e.target.value) || 0 })}
                                  className="h-7 text-[11px] p-1 font-mono"
                                />
                              </div>
                            </>
                          )}

                          {item.calculationType === 'horas' && (
                            <>
                              <div className="w-16">
                                <span className="text-[9px] text-neutral-400 block font-bold">Horas</span>
                                <Input
                                  type="number"
                                  value={item.inputs.horas || 1}
                                  onChange={e => handleUpdateItemInputs(grp.id, item.id, { horas: parseFloat(e.target.value) || 0 })}
                                  className="h-7 text-[11px] p-1 font-mono"
                                />
                              </div>
                              <div className="w-16">
                                <span className="text-[9px] text-neutral-400 block font-bold">Empleados</span>
                                <Input
                                  type="number"
                                  value={item.inputs.empleados || 1}
                                  onChange={e => handleUpdateItemInputs(grp.id, item.id, { empleados: parseFloat(e.target.value) || 0 })}
                                  className="h-7 text-[11px] p-1 font-mono"
                                />
                              </div>
                            </>
                          )}

                          {item.calculationType === 'kilometros' && (
                            <>
                              <div className="w-16">
                                <span className="text-[9px] text-neutral-400 block font-bold">Km</span>
                                <Input
                                  type="number"
                                  value={item.inputs.distanciaKm || 10}
                                  onChange={e => handleUpdateItemInputs(grp.id, item.id, { distanciaKm: parseFloat(e.target.value) || 0 })}
                                  className="h-7 text-[11px] p-1 font-mono"
                                />
                              </div>
                              <div className="w-16">
                                <span className="text-[9px] text-neutral-400 block font-bold">Viajes</span>
                                <Input
                                  type="number"
                                  value={item.inputs.viajes || 1}
                                  onChange={e => handleUpdateItemInputs(grp.id, item.id, { viajes: parseFloat(e.target.value) || 0 })}
                                  className="h-7 text-[11px] p-1 font-mono"
                                />
                              </div>
                            </>
                          )}

                          <div className="w-16">
                            <span className="text-[9px] text-neutral-400 block font-bold">Cantidad</span>
                            <Input
                              type="number"
                              value={item.inputs.cantidad || 1}
                              onChange={e => handleUpdateItemInputs(grp.id, item.id, { cantidad: parseFloat(e.target.value) || 0 })}
                              className="h-7 text-[11px] p-1 font-mono"
                            />
                          </div>

                          <div className="w-16">
                            <span className="text-[9px] text-amber-600 block font-bold">Merma %</span>
                            <Input
                              type="number"
                              value={item.inputs.factorDesperdicioPct || 0}
                              onChange={e => handleUpdateItemInputs(grp.id, item.id, { factorDesperdicioPct: parseFloat(e.target.value) || 0 })}
                              className="h-7 text-[11px] p-1 font-mono border-amber-200"
                            />
                          </div>
                        </div>

                        {/* RESULT TOTALS DISPLAY */}
                        <div className="md:col-span-3 text-right">
                          <div className="text-[10px] text-neutral-450 font-mono">
                            {item.quantityCalculated} {item.unit} x RD$ {item.unitPrice}
                          </div>
                          {viewMode === 'interno' && (
                            <div className="text-[10px] text-neutral-500 font-mono">
                              Costo: RD$ {item.subtotalCost.toLocaleString('es-DO')}
                            </div>
                          )}
                          <div className="font-extrabold text-neutral-900 text-xs mt-0.5">
                            RD$ {item.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        {/* REMOVE BUTTON */}
                        <div className="md:col-span-1 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(grp.id, item.id)} className="h-7 w-7 text-red-500 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Button onClick={handleAddGroup} variant="outline" className="w-full text-xs h-9 border-dashed border-neutral-300 hover:border-indigo-500 text-indigo-700 font-bold">
              <Plus className="w-4 h-4 mr-1.5" /> Agregar Nuevo Grupo de Recursos
            </Button>
          </div>
        </div>

        {/* FOOTER TOTALS & ACTION BAR */}
        <div className="border-t border-neutral-200 pt-4 shrink-0 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-900 text-white p-4 rounded-xl font-mono text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-sans font-bold">Costo Directo Base</span>
              <span className="text-sm font-bold text-neutral-300">RD$ {globalSubtotalCost.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-sans font-bold">Subtotal Precio Venta</span>
              <span className="text-sm font-bold text-neutral-100">RD$ {globalSubtotalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 block uppercase font-sans font-bold">Margen Utilidad</span>
              <span className="text-sm font-bold text-emerald-400">RD$ {globalProfitAmount.toLocaleString('es-DO')} ({globalProfitPct.toFixed(1)}%)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-300 block uppercase font-sans font-bold">Monto Total Neto</span>
              <span className="text-base font-black text-amber-300">RD$ {globalTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="text-xs h-10 px-4">
                Cancelar
              </Button>
              {budget?.id && (onMoveToTrash || onDeletePermanently) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm(`¿Está seguro de eliminar el presupuesto "${title}"?`)) {
                      if (onDeletePermanently) {
                        onDeletePermanently(budget.id!);
                      } else if (onMoveToTrash) {
                        onMoveToTrash(budget.id!);
                      }
                      onClose();
                    }
                  }}
                  className="text-xs h-10 px-3 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Eliminar este presupuesto"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {budget?.id && onDuplicateBudget && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onDuplicateBudget(budget.id!);
                    onClose();
                  }}
                  className="text-xs h-10 px-3 border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Crear una copia idéntica de este presupuesto"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicar
                </Button>
              )}

              {budget?.id && onCreateVersion && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCreateVersion(budget.id!);
                    onClose();
                  }}
                  className="text-xs h-10 px-3 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Generar nueva versión (v+1)"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  Crear Versión
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSaveBudgetForm('Borrador')}
                className="text-xs h-10 px-4 font-bold text-neutral-700 border-neutral-300 hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
                title="Guardar estado de trabajo en Borrador"
              >
                <FileEdit className="w-4 h-4" />
                Guardar Borrador
              </Button>

              <Button
                type="button"
                onClick={() => handleSaveBudgetForm(status)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-10 px-5 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                Guardar Presupuesto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
