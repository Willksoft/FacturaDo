import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  FileText,
  Paperclip,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { BudgetProject, Budget } from '../../../types/budget';

interface BudgetProjectsViewProps {
  projects: BudgetProject[];
  budgets: Budget[];
  onSaveProject: (project: Omit<BudgetProject, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

export default function BudgetProjectsView({
  projects,
  budgets,
  onSaveProject
}: BudgetProjectsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    onSaveProject({
      name: projectName,
      clientName: clientName || 'Cliente General',
      description,
      budgetIds: [],
      status: 'En Planificación',
      totalAmount: 0
    });

    setProjectName('');
    setClientName('');
    setDescription('');
    setShowModal(false);
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in" id="budget-projects-view">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar proyecto por nombre, cliente, número..."
            className="pl-9 text-xs h-9"
          />
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 px-4 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-neutral-400 bg-white border border-neutral-200 rounded-xl">
            No hay proyectos configurados. Agrupe múltiples presupuestos en carpetas de proyecto.
          </div>
        ) : (
          filteredProjects.map(p => (
            <Card key={p.id} className="border-neutral-200 bg-white rounded-xl p-4 space-y-3 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                    {p.projectNumber}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded-md">
                    {p.status}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-neutral-900 leading-snug">{p.name}</h4>
                <div className="text-[10px] text-neutral-500">Cliente: <strong>{p.clientName || 'General'}</strong></div>

                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {p.description || 'Sin notas adicionales.'}
                </p>

                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-150 text-[10px] font-mono text-neutral-600 flex justify-between">
                  <span>Presupuestos agrupados:</span>
                  <span className="font-bold text-neutral-900">{p.budgetIds.length}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-150 flex items-center justify-between">
                <div className="text-[10px] text-neutral-400">
                  Creado: {new Date(p.createdAt).toLocaleDateString('es-DO')}
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 h-7 px-2">
                  <FolderOpen className="w-3.5 h-3.5 mr-1" />
                  Abrir Proyecto
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in font-sans">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Nuevo Proyecto Comercial
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700">Nombre del Proyecto *</label>
                <Input value={projectName} onChange={e => setProjectName(e.target.value)} required placeholder="Ej. Rotulación Flotilla Camiones" className="text-xs h-9" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700">Cliente Asociado</label>
                <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ej. Empresa ABC" className="text-xs h-9" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700">Descripción / Alcance</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detalles sobre entregables y planos adjuntos..."
                  className="w-full text-xs p-2 border border-neutral-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-neutral-150">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 text-xs h-9">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 font-bold">
                  Crear Proyecto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
