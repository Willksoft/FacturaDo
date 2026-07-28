import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Copy,
  Trash2,
  Sparkles,
  Tag,
  Star
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { BudgetTemplate, BudgetResource } from '../../../types/budget';

interface BudgetTemplatesViewProps {
  templates: BudgetTemplate[];
  resources: BudgetResource[];
  onSaveTemplate: (tpl: Omit<BudgetTemplate, 'id' | 'createdAt'> & { id?: string }) => void;
  onDuplicateTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function BudgetTemplatesView({
  templates,
  resources,
  onSaveTemplate,
  onDuplicateTemplate,
  onDeleteTemplate
}: BudgetTemplatesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.industryTag && t.industryTag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in" id="budget-templates-view">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar plantilla por industria, rotulación, obra..."
            className="pl-9 text-xs h-9"
          />
        </div>

        <Button
          onClick={() => {
            onSaveTemplate({
              code: `TPL-${Math.floor(Math.random() * 899 + 100)}`,
              name: 'Nueva Plantilla Personalizada',
              description: 'Estructura reusable de recursos y mano de obra',
              category: 'General',
              industryTag: 'Manufactura / Servicios',
              version: 1,
              items: []
            });
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 px-4 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Crear Plantilla
        </Button>
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-neutral-400 bg-white border border-neutral-200 rounded-xl">
            No hay plantillas que coincidan con la búsqueda.
          </div>
        ) : (
          filteredTemplates.map(t => (
            <Card key={t.id} className="border-neutral-200 bg-white rounded-xl p-4 space-y-3 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {t.industryTag || t.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-neutral-400">
                    {t.code} v{t.version}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-neutral-900 leading-snug">{t.name}</h4>
                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {t.description || 'Estructura pre-diseñada con recursos agrupados.'}
                </p>

                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-150 text-[10px] font-mono text-neutral-600">
                  Incluye {t.items.length} recursos preconfigurados
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-150 flex items-center justify-between">
                <div className="text-[10px] text-neutral-400">
                  Creado: {new Date(t.createdAt).toLocaleDateString('es-DO')}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDuplicateTemplate(t.id)}
                    className="h-7 w-7 text-neutral-600 hover:bg-neutral-100 rounded-md"
                    title="Duplicar Plantilla"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTemplate(t.id)}
                    className="h-7 w-7 text-red-600 hover:bg-red-50 rounded-md"
                    title="Eliminar Plantilla"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
