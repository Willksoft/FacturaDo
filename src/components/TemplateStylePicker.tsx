import React, { useState } from 'react';
import { TemplateSettings } from '../types';
import { Palette, Check, Paintbrush, ChevronDown } from 'lucide-react';
import { INVOICE_TEMPLATES } from './AppearanceSettingsView';

export interface StylingPreset {
  name: string;
  primaryColor: string;
  accentColor: string;
  description: string;
}

// Export ORIGINAL_PRESETS derived from the 15 templates for backwards compatibility
export const ORIGINAL_PRESETS: StylingPreset[] = INVOICE_TEMPLATES.map(t => ({
  name: t.name,
  primaryColor: t.primaryColor,
  accentColor: t.accentColor,
  description: t.description,
}));

interface TemplateStylePickerProps {
  settings: TemplateSettings;
  saveTemplateSettings: (updates: TemplateSettings) => void;
  variant?: 'inline' | 'dropdown';
}

export default function TemplateStylePicker({
  settings,
  saveTemplateSettings,
  variant = 'dropdown',
}: TemplateStylePickerProps) {
  const [open, setOpen] = useState(false);

  const activeTemplate = INVOICE_TEMPLATES.find(
    t => t.id === settings.templateStyle
  ) || INVOICE_TEMPLATES.find(
    t => t.primaryColor.toLowerCase() === (settings.primaryColor || '#171717').toLowerCase()
  );

  const activeName = activeTemplate?.name || 'Personalizado';

  const handleSelectTemplate = (tmpl: typeof INVOICE_TEMPLATES[0]) => {
    saveTemplateSettings({
      ...settings,
      primaryColor: tmpl.primaryColor,
      accentColor: tmpl.accentColor,
      templateStyle: tmpl.id,
      fontFamily: tmpl.fontFamily,
    });
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    saveTemplateSettings({
      ...settings,
      primaryColor: e.target.value,
    });
  };

  const menuContent = (
    <div className="space-y-3 p-3.5 w-72 bg-white rounded-xl border border-neutral-200 shadow-xl text-xs font-sans">
      <div className="flex items-center space-x-1.5 border-b border-neutral-100 pb-2">
        <Palette className="w-4 h-4 text-neutral-700" />
        <span className="font-bold text-neutral-900">Plantilla Rápida</span>
        <span className="text-[9px] text-neutral-400 ml-auto">{INVOICE_TEMPLATES.length} diseños</span>
      </div>

      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
        {INVOICE_TEMPLATES.map((tmpl) => {
          const isSelected = tmpl.id === settings.templateStyle ||
            (tmpl.primaryColor.toLowerCase() === (settings.primaryColor || '#171717').toLowerCase() && !settings.templateStyle);
          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tmpl)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all border ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-200'
                  : 'border-transparent hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="relative shrink-0">
                  <span
                    className="w-5 h-5 rounded-md border border-neutral-200 block shadow-sm"
                    style={{ backgroundColor: tmpl.primaryColor }}
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white"
                    style={{ backgroundColor: tmpl.accentColor }}
                  />
                </div>
                <div className="min-w-0 leading-tight">
                  <span className="truncate block font-semibold text-[11px]">{tmpl.name}</span>
                  <span className="truncate block text-[9px] text-neutral-400">{tmpl.category} · {tmpl.fontFamily}</span>
                </div>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>

      <div className="border-t border-neutral-100 pt-3 space-y-2">
        <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
          Color Personalizado
        </label>
        <div className="flex items-center space-x-2.5">
          <input
            type="color"
            value={settings.primaryColor || '#171717'}
            onChange={handleCustomColorChange}
            className="w-7 h-7 rounded-lg cursor-pointer border border-neutral-300 p-0"
          />
          <input
            type="text"
            value={settings.primaryColor || '#171717'}
            onChange={handleCustomColorChange}
            className="flex-1 h-8 px-2 border border-neutral-200 text-[11px] font-mono rounded-lg outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className="bg-neutral-50/50 p-4 border border-neutral-200 rounded-xl space-y-3">
        {menuContent}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left font-sans">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center space-x-2 px-3 py-1.5 h-8.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-all text-xs font-semibold shadow-2xs"
      >
        <Paintbrush className="w-4 h-4 text-neutral-600" />
        <span className="font-semibold text-neutral-700 truncate max-w-[110px]">
          {activeName}
        </span>
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-40 origin-top-right">
            {menuContent}
          </div>
        </>
      )}
    </div>
  );
}
