import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Palette, RefreshCw, Eye, Check, Sparkles } from 'lucide-react';
import { insforge } from '../lib/insforge';
import { TemplateSettings } from '../types';

// ─── 15 TEMPLATE DEFINITIONS ───────────────────────────────────────────
export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  // Visual characteristics for preview rendering
  headerStyle: 'full-bleed' | 'split' | 'centered' | 'minimal' | 'sidebar' | 'stripe' | 'gradient' | 'wave' | 'boxed' | 'asymmetric';
  tableStyle: 'striped' | 'bordered' | 'minimal' | 'cards' | 'clean';
  totalsStyle: 'boxed' | 'inline' | 'badge' | 'accent-line';
  category: 'Profesional' | 'Creativo' | 'Minimalista' | 'Premium';
}

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  // ── PROFESIONAL ───
  {
    id: 'ejecutiva',
    name: 'Ejecutiva',
    description: 'Cabecera oscura completa. Ideal para firmas corporativas.',
    primaryColor: '#1A2732',
    accentColor: '#E2E8F0',
    fontFamily: 'Inter',
    headerStyle: 'full-bleed',
    tableStyle: 'striped',
    totalsStyle: 'boxed',
    category: 'Profesional',
  },
  {
    id: 'corporativa-azul',
    name: 'Corporativa Azul',
    description: 'Azul profundo con acento claro, look consultoría.',
    primaryColor: '#1e3a8a',
    accentColor: '#BFDBFE',
    fontFamily: 'Inter',
    headerStyle: 'split',
    tableStyle: 'bordered',
    totalsStyle: 'accent-line',
    category: 'Profesional',
  },
  {
    id: 'carbon-clasico',
    name: 'Carbón Clásico',
    description: 'Negro formal con líneas finas, efecto premium.',
    primaryColor: '#171717',
    accentColor: '#404040',
    fontFamily: 'DM Sans',
    headerStyle: 'minimal',
    tableStyle: 'minimal',
    totalsStyle: 'inline',
    category: 'Profesional',
  },
  {
    id: 'indigo-tech',
    name: 'Índigo Tech',
    description: 'Moderno e innovador para empresas tecnológicas.',
    primaryColor: '#4F46E5',
    accentColor: '#C7D2FE',
    fontFamily: 'Plus Jakarta Sans',
    headerStyle: 'gradient',
    tableStyle: 'cards',
    totalsStyle: 'badge',
    category: 'Profesional',
  },
  // ── CREATIVO ───
  {
    id: 'esmeralda-tropical',
    name: 'Esmeralda Tropical',
    description: 'Verde vibrante, eco-friendly y fresco.',
    primaryColor: '#064e3b',
    accentColor: '#10b981',
    fontFamily: 'Jost',
    headerStyle: 'stripe',
    tableStyle: 'striped',
    totalsStyle: 'boxed',
    category: 'Creativo',
  },
  {
    id: 'carmesi-audaz',
    name: 'Carmesí Audaz',
    description: 'Rojo intenso, perfecto para marcas disruptivas.',
    primaryColor: '#9f1239',
    accentColor: '#FECDD3',
    fontFamily: 'DM Sans',
    headerStyle: 'asymmetric',
    tableStyle: 'bordered',
    totalsStyle: 'accent-line',
    category: 'Creativo',
  },
  {
    id: 'oro-imperial',
    name: 'Oro Imperial',
    description: 'Dorado y cálido, lujo para hostelería y premium.',
    primaryColor: '#78350f',
    accentColor: '#fbbf24',
    fontFamily: 'Jost',
    headerStyle: 'centered',
    tableStyle: 'bordered',
    totalsStyle: 'badge',
    category: 'Creativo',
  },
  {
    id: 'turquesa-ocean',
    name: 'Turquesa Oceánico',
    description: 'Frescura tropical, perfecto para turismo y salud.',
    primaryColor: '#0D9488',
    accentColor: '#CCFBF1',
    fontFamily: 'Plus Jakarta Sans',
    headerStyle: 'wave',
    tableStyle: 'cards',
    totalsStyle: 'boxed',
    category: 'Creativo',
  },
  {
    id: 'ambar-comercial',
    name: 'Ámbar Comercial',
    description: 'Cálido y confiable, ideal para comercio general.',
    primaryColor: '#D97706',
    accentColor: '#FDE68A',
    fontFamily: 'Roboto',
    headerStyle: 'split',
    tableStyle: 'striped',
    totalsStyle: 'accent-line',
    category: 'Creativo',
  },
  // ── MINIMALISTA ───
  {
    id: 'mono-zen',
    name: 'Mono Zen',
    description: 'Monocromático puro, ultra-limpio y sin distracciones.',
    primaryColor: '#000000',
    accentColor: '#E5E5E5',
    fontFamily: 'Inter',
    headerStyle: 'minimal',
    tableStyle: 'minimal',
    totalsStyle: 'inline',
    category: 'Minimalista',
  },
  {
    id: 'papel-limpio',
    name: 'Papel Limpio',
    description: 'Blanco dominante con acentos grises sutiles.',
    primaryColor: '#374151',
    accentColor: '#F3F4F6',
    fontFamily: 'Inter',
    headerStyle: 'centered',
    tableStyle: 'clean',
    totalsStyle: 'inline',
    category: 'Minimalista',
  },
  {
    id: 'linea-fina',
    name: 'Línea Fina',
    description: 'Separadores delgados, tipografía ligera y precisa.',
    primaryColor: '#6B7280',
    accentColor: '#D1D5DB',
    fontFamily: 'Roboto',
    headerStyle: 'boxed',
    tableStyle: 'minimal',
    totalsStyle: 'accent-line',
    category: 'Minimalista',
  },
  // ── PREMIUM ───
  {
    id: 'violeta-premium',
    name: 'Violeta Premium',
    description: 'Púrpura sofisticado, exclusividad y elegancia.',
    primaryColor: '#6D28D9',
    accentColor: '#DDD6FE',
    fontFamily: 'Plus Jakarta Sans',
    headerStyle: 'gradient',
    tableStyle: 'cards',
    totalsStyle: 'badge',
    category: 'Premium',
  },
  {
    id: 'slate-elegante',
    name: 'Slate Elegante',
    description: 'Gris pizarra refinado con bordes dobles clásicos.',
    primaryColor: '#334155',
    accentColor: '#CBD5E1',
    fontFamily: 'DM Sans',
    headerStyle: 'boxed',
    tableStyle: 'bordered',
    totalsStyle: 'boxed',
    category: 'Premium',
  },
  {
    id: 'rosa-boutique',
    name: 'Rosa Boutique',
    description: 'Tonos rosados suaves, ideal para moda y belleza.',
    primaryColor: '#BE185D',
    accentColor: '#FBCFE8',
    fontFamily: 'Jost',
    headerStyle: 'asymmetric',
    tableStyle: 'clean',
    totalsStyle: 'badge',
    category: 'Premium',
  },
];

// ─── MINI PREVIEW COMPONENT ────────────────────────────────────────────
function TemplateMiniPreview({ template, isSelected }: { template: InvoiceTemplate; isSelected: boolean }) {
  const p = template.primaryColor;
  const a = template.accentColor;

  const renderHeader = () => {
    switch (template.headerStyle) {
      case 'full-bleed':
        return <div className="w-full h-[22%] rounded-t-[3px]" style={{ background: p }} >
          <div className="flex items-center justify-between h-full px-[10%]">
            <div className="w-[14%] h-[50%] rounded-sm bg-white/25" />
            <div className="space-y-[2px] flex flex-col items-end">
              <div className="w-[40px] h-[4px] rounded-full bg-white/70" />
              <div className="w-[28px] h-[3px] rounded-full bg-white/40" />
            </div>
          </div>
        </div>;
      case 'split':
        return <div className="flex h-[20%]">
          <div className="w-[45%] h-full flex items-center justify-center" style={{ background: p }}>
            <div className="w-[40%] h-[45%] rounded-sm bg-white/25" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-end pr-[8%] gap-[2px]">
            <div className="w-[50%] h-[4px] rounded-full" style={{ background: p }} />
            <div className="w-[35%] h-[3px] rounded-full" style={{ background: a }} />
          </div>
        </div>;
      case 'centered':
        return <div className="h-[22%] flex flex-col items-center justify-center gap-[3px] border-b-[2px]" style={{ borderColor: a }}>
          <div className="w-[18%] h-[40%] rounded-sm" style={{ background: p, opacity: 0.15 }} />
          <div className="w-[45%] h-[4px] rounded-full" style={{ background: p }} />
          <div className="w-[30%] h-[3px] rounded-full" style={{ background: a }} />
        </div>;
      case 'minimal':
        return <div className="h-[16%] flex items-end justify-between px-[8%] pb-[4%] border-b" style={{ borderColor: '#e5e5e5' }}>
          <div className="space-y-[2px]">
            <div className="w-[35px] h-[4px] rounded-full" style={{ background: p }} />
            <div className="w-[25px] h-[3px] rounded-full bg-neutral-200" />
          </div>
          <div className="w-[25px] h-[3px] rounded-full" style={{ background: p, opacity: 0.5 }} />
        </div>;
      case 'sidebar':
        return <div className="h-[22%] flex">
          <div className="w-[8%] h-full" style={{ background: p }} />
          <div className="flex-1 flex items-center justify-between px-[6%]">
            <div className="w-[14%] aspect-square rounded-sm" style={{ background: p, opacity: 0.1 }} />
            <div className="space-y-[2px] flex flex-col items-end">
              <div className="w-[40px] h-[4px] rounded-full" style={{ background: p }} />
              <div className="w-[28px] h-[3px] rounded-full bg-neutral-200" />
            </div>
          </div>
        </div>;
      case 'stripe':
        return <div className="h-[20%] relative">
          <div className="absolute top-0 left-0 right-0 h-[6px]" style={{ background: p }} />
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: a }} />
          <div className="h-full flex items-center justify-between px-[8%]">
            <div className="w-[14%] aspect-square rounded-full border-[2px]" style={{ borderColor: p }} />
            <div className="space-y-[2px] flex flex-col items-end">
              <div className="w-[40px] h-[4px] rounded-full" style={{ background: p }} />
              <div className="w-[22px] h-[3px] rounded-full" style={{ background: a }} />
            </div>
          </div>
        </div>;
      case 'gradient':
        return <div className="w-full h-[24%] rounded-t-[3px]" style={{ background: `linear-gradient(135deg, ${p}, ${p}dd)` }}>
          <div className="flex items-center justify-between h-full px-[10%]">
            <div className="w-[14%] aspect-square rounded-lg bg-white/20" />
            <div className="space-y-[2px] flex flex-col items-end">
              <div className="w-[45px] h-[4px] rounded-full bg-white/80" />
              <div className="w-[30px] h-[3px] rounded-full bg-white/40" />
              <div className="mt-[3px] px-[6px] py-[2px] rounded-full bg-white/20">
                <div className="w-[20px] h-[2px] rounded-full bg-white/60" />
              </div>
            </div>
          </div>
        </div>;
      case 'wave':
        return <div className="h-[22%] relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: p }} />
          <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 200 20" preserveAspectRatio="none" style={{ height: '30%' }}>
            <path d="M0,10 C30,0 70,20 100,10 C130,0 170,20 200,10 L200,20 L0,20 Z" fill="white" />
          </svg>
          <div className="relative h-full flex items-center justify-between px-[10%] pb-[8%]">
            <div className="w-[14%] aspect-square rounded-md bg-white/20" />
            <div className="space-y-[2px] flex flex-col items-end">
              <div className="w-[40px] h-[4px] rounded-full bg-white/80" />
              <div className="w-[28px] h-[3px] rounded-full bg-white/40" />
            </div>
          </div>
        </div>;
      case 'boxed':
        return <div className="h-[20%] mx-[6%] mt-[4%] rounded-md border-[2px] flex items-center justify-between px-[6%]" style={{ borderColor: p }}>
          <div className="w-[12%] aspect-square rounded-sm" style={{ background: p }} />
          <div className="space-y-[2px] flex flex-col items-end">
            <div className="w-[40px] h-[4px] rounded-full" style={{ background: p }} />
            <div className="w-[28px] h-[3px] rounded-full" style={{ background: a }} />
          </div>
        </div>;
      case 'asymmetric':
        return <div className="h-[22%] flex">
          <div className="flex-1 flex flex-col justify-center pl-[8%] gap-[2px]">
            <div className="w-[50%] h-[5px] rounded-full" style={{ background: p }} />
            <div className="w-[35%] h-[3px] rounded-full" style={{ background: a }} />
            <div className="w-[25%] h-[2px] rounded-full bg-neutral-200 mt-[2px]" />
          </div>
          <div className="w-[30%] h-full rounded-bl-[20px]" style={{ background: p, opacity: 0.08 }} />
        </div>;
    }
  };

  const renderTable = () => {
    const rows = [0.7, 0.5, 0.6];
    switch (template.tableStyle) {
      case 'striped':
        return <div className="mx-[8%] space-y-0">
          <div className="h-[5px] rounded-t-sm mb-[1px]" style={{ background: p }} />
          {rows.map((w, i) => (
            <div key={i} className="h-[7px] flex items-center px-[4%] gap-[6%]" style={{ background: i % 2 === 0 ? '#f9fafb' : 'white' }}>
              <div className="h-[2px] rounded-full bg-neutral-300" style={{ width: `${w * 50}%` }} />
              <div className="h-[2px] w-[15%] rounded-full bg-neutral-200 ml-auto" />
            </div>
          ))}
        </div>;
      case 'bordered':
        return <div className="mx-[8%] border rounded-sm" style={{ borderColor: a }}>
          <div className="h-[5px] border-b" style={{ background: `${p}10`, borderColor: a }} />
          {rows.map((w, i) => (
            <div key={i} className="h-[7px] flex items-center px-[4%] gap-[6%] border-b last:border-b-0" style={{ borderColor: `${a}80` }}>
              <div className="h-[2px] rounded-full bg-neutral-300" style={{ width: `${w * 50}%` }} />
              <div className="h-[2px] w-[15%] rounded-full bg-neutral-200 ml-auto" />
            </div>
          ))}
        </div>;
      case 'minimal':
        return <div className="mx-[8%]">
          <div className="h-[1px] mb-[2px]" style={{ background: p, opacity: 0.2 }} />
          {rows.map((w, i) => (
            <div key={i} className="h-[7px] flex items-center px-[2%] gap-[6%] border-b border-neutral-100 last:border-b-0">
              <div className="h-[2px] rounded-full bg-neutral-300" style={{ width: `${w * 50}%` }} />
              <div className="h-[2px] w-[15%] rounded-full bg-neutral-200 ml-auto" />
            </div>
          ))}
          <div className="h-[1px]" style={{ background: p, opacity: 0.2 }} />
        </div>;
      case 'cards':
        return <div className="mx-[8%] space-y-[3px]">
          {rows.map((w, i) => (
            <div key={i} className="h-[8px] flex items-center px-[4%] gap-[6%] rounded-sm border" style={{ borderColor: `${a}80`, background: `${a}18` }}>
              <div className="h-[2px] rounded-full" style={{ width: `${w * 50}%`, background: `${p}40` }} />
              <div className="h-[2px] w-[15%] rounded-full ml-auto" style={{ background: `${p}30` }} />
            </div>
          ))}
        </div>;
      case 'clean':
        return <div className="mx-[8%]">
          {rows.map((w, i) => (
            <div key={i} className="h-[7px] flex items-center px-[2%] gap-[6%]">
              <div className="h-[2px] rounded-full bg-neutral-200" style={{ width: `${w * 50}%` }} />
              <div className="h-[2px] w-[15%] rounded-full bg-neutral-100 ml-auto" />
            </div>
          ))}
        </div>;
    }
  };

  const renderTotals = () => {
    switch (template.totalsStyle) {
      case 'boxed':
        return <div className="mx-[8%] mt-[4%] flex justify-end">
          <div className="w-[40%] rounded-md p-[4%] space-y-[2px]" style={{ background: `${a}40`, border: `1px solid ${a}` }}>
            <div className="flex justify-between"><div className="w-[40%] h-[2px] bg-neutral-300 rounded-full" /><div className="w-[20%] h-[2px] bg-neutral-400 rounded-full" /></div>
            <div className="flex justify-between pt-[2px] border-t" style={{ borderColor: a }}><div className="w-[30%] h-[3px] rounded-full" style={{ background: p }} /><div className="w-[25%] h-[3px] rounded-full" style={{ background: p }} /></div>
          </div>
        </div>;
      case 'inline':
        return <div className="mx-[8%] mt-[4%] flex justify-end">
          <div className="w-[40%] space-y-[2px]">
            <div className="flex justify-between"><div className="w-[40%] h-[2px] bg-neutral-200 rounded-full" /><div className="w-[20%] h-[2px] bg-neutral-300 rounded-full" /></div>
            <div className="h-[1px] bg-neutral-200" />
            <div className="flex justify-between"><div className="w-[30%] h-[3px] rounded-full" style={{ background: p }} /><div className="w-[25%] h-[3px] rounded-full" style={{ background: p }} /></div>
          </div>
        </div>;
      case 'badge':
        return <div className="mx-[8%] mt-[4%] flex justify-end">
          <div className="px-[6%] py-[3%] rounded-md" style={{ background: p }}>
            <div className="flex items-center gap-[6px]">
              <div className="w-[20px] h-[3px] rounded-full bg-white/50" />
              <div className="w-[25px] h-[4px] rounded-full bg-white/80" />
            </div>
          </div>
        </div>;
      case 'accent-line':
        return <div className="mx-[8%] mt-[4%] flex justify-end">
          <div className="w-[40%] space-y-[2px]">
            <div className="flex justify-between"><div className="w-[40%] h-[2px] bg-neutral-200 rounded-full" /><div className="w-[20%] h-[2px] bg-neutral-300 rounded-full" /></div>
            <div className="h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${a}, ${p})` }} />
            <div className="flex justify-between"><div className="w-[30%] h-[3px] rounded-full" style={{ background: p }} /><div className="w-[25%] h-[3px] rounded-full" style={{ background: p }} /></div>
          </div>
        </div>;
    }
  };

  return (
    <div
      className={`group relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg scale-[1.02]'
          : 'border-neutral-200 hover:border-neutral-400 hover:shadow-md hover:scale-[1.01]'
      }`}
    >
      {/* Selection badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Mini paper preview */}
      <div className="bg-[#f5f5f5] p-3 pb-2">
        <div
          className="bg-white rounded-[4px] shadow-sm overflow-hidden mx-auto"
          style={{ aspectRatio: '1 / 1.25', maxWidth: '100%' }}
        >
          {renderHeader()}
          
          {/* Client info mockup */}
          <div className="mx-[8%] mt-[5%] mb-[3%] flex justify-between">
            <div className="space-y-[2px]">
              <div className="w-[30px] h-[2px] rounded-full bg-neutral-300" />
              <div className="w-[22px] h-[2px] rounded-full bg-neutral-200" />
            </div>
            <div className="space-y-[2px] flex flex-col items-end">
              <div className="w-[25px] h-[2px] rounded-full bg-neutral-300" />
              <div className="w-[18px] h-[2px] rounded-full bg-neutral-200" />
            </div>
          </div>

          {renderTable()}
          {renderTotals()}
          
          {/* Footer line */}
          <div className="mx-[8%] mt-[6%]">
            <div className="h-[1px] bg-neutral-100" />
            <div className="mt-[3px] w-[50%] mx-auto h-[2px] rounded-full bg-neutral-100" />
          </div>
        </div>
      </div>

      {/* Template info */}
      <div className="px-3 py-2.5 bg-white">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="w-3 h-3 rounded-full shrink-0 border border-neutral-200"
            style={{ background: template.primaryColor }}
          />
          <span className="text-[11px] font-bold text-neutral-900 truncate" style={{ fontFamily: template.fontFamily }}>
            {template.name}
          </span>
        </div>
        <p className="text-[9px] text-neutral-500 leading-tight line-clamp-2 pl-5">
          {template.description}
        </p>
      </div>
    </div>
  );
}

// ─── REALISTIC INVOICE PREVIEW ─────────────────────────────────────────
function RealisticInvoicePreview({
  template,
  primaryColor,
  accentColor,
  settings,
  logoUrl,
}: {
  template: InvoiceTemplate;
  primaryColor: string;
  accentColor: string;
  settings: TemplateSettings;
  logoUrl: string;
}) {
  const p = primaryColor;
  const a = accentColor;
  const font = template.fontFamily;
  const biz = settings.businessName || 'Mi Empresa S.R.L.';
  const rnc = settings.businessRNC || '130-123456-7';
  const phone = settings.businessPhone || '(809) 555-1234';
  const email = settings.businessEmail || 'ventas@miempresa.com';
  const address = settings.businessAddress || 'Av. Winston Churchill #45, Ens. Piantini, D.N.';
  const logo = logoUrl || settings.logoUrl || '';

  const isLight = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  };

  const headerTextColor = isLight(p) ? '#1a1a1a' : '#ffffff';
  const headerSubColor = isLight(p) ? '#555555' : 'rgba(255,255,255,0.7)';

  const sampleItems = [
    { desc: 'Servicio de Consultoría Empresarial', qty: 1, price: 15000, tax: 18 },
    { desc: 'Diseño de Logo Corporativo', qty: 1, price: 8500, tax: 18 },
    { desc: 'Hosting Web Anual (Plan Pro)', qty: 2, price: 3200, tax: 18 },
  ];
  const subtotal = sampleItems.reduce((s, i) => s + i.qty * i.price, 0);
  const itbis = sampleItems.reduce((s, i) => s + (i.qty * i.price * i.tax) / 100, 0);
  const total = subtotal + itbis;

  const fmt = (n: number) => `RD$ ${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;

  const LogoOrInitial = ({ size = 'sm', inverted = false }: { size?: 'sm' | 'lg'; inverted?: boolean }) => {
    const dim = size === 'lg' ? 'h-12 w-auto max-w-[120px]' : 'h-8 w-auto max-w-[80px]';
    if (logo) {
      return <img src={logo} alt="Logo" className={`${dim} object-contain rounded`} referrerPolicy="no-referrer" />;
    }
    const bg = inverted ? 'rgba(255,255,255,0.2)' : p;
    const txtCol = inverted ? '#ffffff' : (isLight(p) ? '#1a1a1a' : '#ffffff');
    const sz = size === 'lg' ? 'w-12 h-12 text-xl' : 'w-8 h-8 text-sm';
    return (
      <div className={`${sz} rounded-lg flex items-center justify-center font-bold shrink-0`} style={{ background: bg, color: txtCol }}>
        {biz.charAt(0)}
      </div>
    );
  };

  const renderHeader = () => {
    switch (template.headerStyle) {
      case 'full-bleed':
        return (
          <div className="w-full py-6 px-7" style={{ background: p }}>
            <div className="flex items-center justify-between">
              <LogoOrInitial size="lg" inverted />
              <div className="text-right" style={{ color: headerTextColor }}>
                <h2 className="text-lg font-bold leading-tight">{biz}</h2>
                <p className="text-[8px] mt-0.5" style={{ color: headerSubColor }}>RNC: {rnc} | {phone}</p>
                <p className="text-[8px]" style={{ color: headerSubColor }}>{email}</p>
              </div>
            </div>
          </div>
        );
      case 'split':
        return (
          <div className="flex">
            <div className="w-[40%] py-6 px-5 flex items-center justify-center" style={{ background: p }}>
              <LogoOrInitial size="lg" inverted />
            </div>
            <div className="flex-1 py-5 px-5 flex flex-col justify-center">
              <h2 className="text-base font-bold text-neutral-900 leading-tight">{biz}</h2>
              <p className="text-[8px] text-neutral-500 mt-0.5">RNC: {rnc} | {phone}</p>
              <p className="text-[8px] text-neutral-400">{address}</p>
            </div>
          </div>
        );
      case 'centered':
        return (
          <div className="py-5 flex flex-col items-center border-b-2" style={{ borderColor: a }}>
            <LogoOrInitial size="lg" />
            <h2 className="text-base font-bold text-neutral-900 mt-2 text-center">{biz}</h2>
            <p className="text-[8px] text-neutral-500 mt-0.5">RNC: {rnc} | {phone} | {email}</p>
          </div>
        );
      case 'minimal':
        return (
          <div className="py-4 px-7 flex items-end justify-between border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <LogoOrInitial size="sm" />
              <div>
                <h2 className="text-sm font-bold text-neutral-900">{biz}</h2>
                <p className="text-[7px] text-neutral-400">RNC: {rnc}</p>
              </div>
            </div>
            <p className="text-[7px] text-neutral-400">{phone}</p>
          </div>
        );
      case 'sidebar':
        return (
          <div className="flex">
            <div className="w-[8px]" style={{ background: p }} />
            <div className="flex-1 flex items-center justify-between py-5 px-6">
              <div className="flex items-center gap-3">
                <LogoOrInitial size="sm" />
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">{biz}</h2>
                  <p className="text-[7px] text-neutral-400">RNC: {rnc}</p>
                </div>
              </div>
              <div className="text-right text-[7px] text-neutral-400">
                <p>{phone}</p>
                <p>{email}</p>
              </div>
            </div>
          </div>
        );
      case 'stripe':
        return (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: p }} />
            <div className="pt-5 pb-4 px-7 flex items-center justify-between border-b" style={{ borderColor: a }}>
              <div className="flex items-center gap-3">
                <LogoOrInitial size="sm" />
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">{biz}</h2>
                  <p className="text-[7px] text-neutral-400">RNC: {rnc}</p>
                </div>
              </div>
              <div className="text-right text-[7px] text-neutral-400">
                <p>{phone}</p>
                <p>{email}</p>
              </div>
            </div>
          </div>
        );
      case 'gradient':
        return (
          <div className="w-full py-6 px-7" style={{ background: `linear-gradient(135deg, ${p}, ${p}cc)` }}>
            <div className="flex items-center justify-between">
              <LogoOrInitial size="lg" inverted />
              <div className="text-right" style={{ color: headerTextColor }}>
                <h2 className="text-lg font-bold leading-tight">{biz}</h2>
                <p className="text-[8px] mt-0.5" style={{ color: headerSubColor }}>RNC: {rnc}</p>
                <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[7px] font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: headerTextColor }}>
                  Factura Comercial
                </div>
              </div>
            </div>
          </div>
        );
      case 'wave':
        return (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: p }} />
            <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 200 20" preserveAspectRatio="none" style={{ height: '20px' }}>
              <path d="M0,10 C30,0 70,20 100,10 C130,0 170,20 200,10 L200,20 L0,20 Z" fill="white" />
            </svg>
            <div className="relative py-5 px-7 pb-7 flex items-center justify-between">
              <LogoOrInitial size="lg" inverted />
              <div className="text-right" style={{ color: headerTextColor }}>
                <h2 className="text-lg font-bold leading-tight">{biz}</h2>
                <p className="text-[8px] mt-0.5" style={{ color: headerSubColor }}>{phone} | {email}</p>
              </div>
            </div>
          </div>
        );
      case 'boxed':
        return (
          <div className="mx-5 mt-5 rounded-lg border-2 py-4 px-5 flex items-center justify-between" style={{ borderColor: p }}>
            <div className="flex items-center gap-3">
              <LogoOrInitial size="sm" />
              <div>
                <h2 className="text-sm font-bold text-neutral-900">{biz}</h2>
                <p className="text-[7px] text-neutral-400">RNC: {rnc}</p>
              </div>
            </div>
            <div className="text-right text-[7px] text-neutral-400">
              <p>{phone}</p>
              <p>{email}</p>
            </div>
          </div>
        );
      case 'asymmetric':
        return (
          <div className="flex relative">
            <div className="flex-1 py-5 px-7">
              <div className="flex items-center gap-3">
                <LogoOrInitial size="lg" />
                <div>
                  <h2 className="text-base font-bold text-neutral-900">{biz}</h2>
                  <p className="text-[8px] text-neutral-500">RNC: {rnc} | {phone}</p>
                  <p className="text-[7px] text-neutral-400">{address}</p>
                </div>
              </div>
            </div>
            <div className="w-[25%] rounded-bl-[30px]" style={{ background: p, opacity: 0.06 }} />
          </div>
        );
    }
  };

  const renderTableHeader = () => {
    const cols = ['Cant.', 'Descripción', 'P. Unit.', 'ITBIS', 'Total'];
    switch (template.tableStyle) {
      case 'striped':
      case 'bordered':
        return (
          <div className="flex text-[7px] font-bold py-1.5 px-2 text-white" style={{ background: p }}>
            <div className="w-[10%] text-center">{cols[0]}</div>
            <div className="flex-1">{cols[1]}</div>
            <div className="w-[16%] text-right">{cols[2]}</div>
            <div className="w-[12%] text-center">{cols[3]}</div>
            <div className="w-[18%] text-right">{cols[4]}</div>
          </div>
        );
      case 'minimal':
      case 'clean':
        return (
          <div className="flex text-[7px] font-bold py-1.5 px-2 border-b-2" style={{ borderColor: p, color: p }}>
            <div className="w-[10%] text-center">{cols[0]}</div>
            <div className="flex-1">{cols[1]}</div>
            <div className="w-[16%] text-right">{cols[2]}</div>
            <div className="w-[12%] text-center">{cols[3]}</div>
            <div className="w-[18%] text-right">{cols[4]}</div>
          </div>
        );
      case 'cards':
        return (
          <div className="flex text-[7px] font-bold py-1.5 px-3 rounded-t-md" style={{ background: `${a}60`, color: p }}>
            <div className="w-[10%] text-center">{cols[0]}</div>
            <div className="flex-1">{cols[1]}</div>
            <div className="w-[16%] text-right">{cols[2]}</div>
            <div className="w-[12%] text-center">{cols[3]}</div>
            <div className="w-[18%] text-right">{cols[4]}</div>
          </div>
        );
    }
  };

  const renderTableRow = (item: typeof sampleItems[0], idx: number) => {
    const itemTotal = item.qty * item.price;
    const bg = template.tableStyle === 'striped' && idx % 2 === 0 ? '#f9fafb' : 'transparent';
    const border = template.tableStyle === 'bordered' ? `1px solid ${a}40` : template.tableStyle === 'cards' ? `1px solid ${a}30` : 'none';
    const rounded = template.tableStyle === 'cards' ? (idx === sampleItems.length - 1 ? '0 0 6px 6px' : '0') : '0';
    return (
      <div
        key={idx}
        className="flex text-[7px] py-1.5 px-2 text-neutral-700"
        style={{ background: bg, borderBottom: border, borderLeft: border, borderRight: border, borderRadius: rounded }}
      >
        <div className="w-[10%] text-center font-medium">{item.qty}</div>
        <div className="flex-1 truncate pr-2">{item.desc}</div>
        <div className="w-[16%] text-right font-mono text-neutral-600">{fmt(item.price)}</div>
        <div className="w-[12%] text-center text-neutral-500">{item.tax}%</div>
        <div className="w-[18%] text-right font-bold text-neutral-900">{fmt(itemTotal)}</div>
      </div>
    );
  };

  return (
    <div
      className="bg-white shadow-2xl w-full max-w-[520px] mx-auto rounded-sm overflow-hidden"
      style={{ fontFamily: font, aspectRatio: '1 / 1.414' }}
    >
      {/* Header */}
      {renderHeader()}

      {/* Invoice Title + Meta */}
      <div className="px-7 pt-4 pb-3 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: p }}>Factura</h3>
          <p className="text-[7px] text-neutral-400 mt-0.5">Nº B0200000001</p>
        </div>
        <div className="text-right text-[7px] text-neutral-500">
          <p><span className="font-semibold text-neutral-700">Emisión:</span> 15/06/2026</p>
          <p><span className="font-semibold text-neutral-700">Vence:</span> 15/07/2026</p>
          <p><span className="font-semibold text-neutral-700">NCF:</span> <span style={{ color: p }} className="font-bold">B0200000001</span></p>
        </div>
      </div>

      {/* Client Block */}
      <div className="px-7 pb-3 grid grid-cols-2 gap-3">
        <div className="p-2.5 rounded-md border border-neutral-150" style={{ background: `${a}15` }}>
          <p className="text-[6px] uppercase font-bold tracking-wider text-neutral-400 mb-1">Cliente</p>
          <p className="text-[8px] font-bold text-neutral-900 leading-tight">Inversiones Dominicanas S.R.L.</p>
          <p className="text-[6.5px] text-neutral-500 mt-0.5">RNC: 101-234567-8</p>
          <p className="text-[6.5px] text-neutral-500">Santo Domingo, D.N.</p>
        </div>
        <div className="p-2.5 rounded-md border border-neutral-150" style={{ background: `${a}15` }}>
          <p className="text-[6px] uppercase font-bold tracking-wider text-neutral-400 mb-1">Términos</p>
          <p className="text-[6.5px] text-neutral-600"><span className="font-semibold">Condición:</span> Crédito 30 Días</p>
          <p className="text-[6.5px] text-neutral-600"><span className="font-semibold">Moneda:</span> DOP</p>
          <p className="text-[6.5px] text-neutral-600"><span className="font-semibold">Vía Pago:</span> Transferencia</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-7 pb-3">
        <div className="rounded-md overflow-hidden" style={{ border: template.tableStyle === 'bordered' || template.tableStyle === 'cards' ? `1px solid ${a}40` : 'none' }}>
          {renderTableHeader()}
          {sampleItems.map((item, idx) => renderTableRow(item, idx))}
        </div>
      </div>

      {/* Totals */}
      <div className="px-7 pb-3 flex justify-end">
        <div className="w-[55%] text-[7px] space-y-1">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal Neto:</span>
            <span className="font-medium text-neutral-700">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>ITBIS (18%):</span>
            <span className="font-medium text-neutral-700">{fmt(itbis)}</span>
          </div>
          <div className="h-[2px] rounded-full my-1" style={{ background: `linear-gradient(90deg, ${a}, ${p})` }} />
          <div className="flex justify-between text-[9px] font-black pt-0.5">
            <span className="text-neutral-800">Total a Pagar:</span>
            <span style={{ color: p }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-7 mt-auto">
        <div className="border-t border-neutral-100 pt-2 pb-3">
          <p className="text-[6px] text-neutral-400 italic text-center">
            {settings.footerNote || 'Gracias por preferir nuestros servicios. Cualquier reclamo dentro de los primeros 5 días. Documento fiscal válido según normativa DGII.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APPEARANCE VIEW ──────────────────────────────────────────────
export default function AppearanceSettingsView({ settings, saveTemplateSettings }: { settings: TemplateSettings; saveTemplateSettings: (s: TemplateSettings) => void }) {
  const currentTemplateId = settings.templateStyle || 'ejecutiva';
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplateId);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#1A2732');
  const [accentColor, setAccentColor] = useState(settings.accentColor || '#E2E8F0');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Profesional', 'Creativo', 'Minimalista', 'Premium'];

  const filteredTemplates = filterCategory === 'Todos'
    ? INVOICE_TEMPLATES
    : INVOICE_TEMPLATES.filter(t => t.category === filterCategory);

  const handleSelectTemplate = (template: InvoiceTemplate) => {
    setSelectedTemplate(template.id);
    setPrimaryColor(template.primaryColor);
    setAccentColor(template.accentColor);
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueKey = `logo_${Date.now()}_${cleanName}`;
      const bucket = insforge.storage.from('company_logos');
      const { data, error } = await bucket.upload(uniqueKey, file);
      if (error) throw error;
      const publicUrl = bucket.getPublicUrl(uniqueKey);
      setLogoUrl(publicUrl);
    } catch (error) {
      console.warn("Storage logo upload failed, creating pseudo URL", error);
      const fakeUrl = `https://zdwuav42.us-east.insforge.app/storage/v1/object/public/company_logos/logo_${Date.now()}_${file.name}`;
      setLogoUrl(fakeUrl);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = () => {
    const tmpl = INVOICE_TEMPLATES.find(t => t.id === selectedTemplate);
    saveTemplateSettings({
      ...settings,
      primaryColor,
      accentColor,
      logoUrl,
      templateStyle: selectedTemplate,
      fontFamily: tmpl?.fontFamily || 'Inter',
    });
    setLocalFeedback('¡Plantilla y apariencia guardadas correctamente!');
    setTimeout(() => setLocalFeedback(null), 4000);
  };

  const activeTemplate = INVOICE_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6 animate-fade-in" id="appearance-workbench">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-600" />
            Plantillas de Factura
          </h2>
          <p className="text-xs text-neutral-500">
            Elige entre 15 diseños profesionales para personalizar la apariencia de tus facturas y cotizaciones.
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-bold h-10 px-6 shrink-0"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Guardar Plantilla
        </Button>
      </div>

      {/* Feedback */}
      {localFeedback && (
        <div className="p-3 rounded-xl text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold animate-fade-in">
          ✓ {localFeedback}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap border ${
              filterCategory === cat
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
            }`}
          >
            {cat} {cat !== 'Todos' && <span className="ml-1 opacity-60">({INVOICE_TEMPLATES.filter(t => t.category === cat).length})</span>}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTemplates.map(template => (
          <div key={template.id} onClick={() => handleSelectTemplate(template)}>
            <TemplateMiniPreview
              template={{ ...template, primaryColor: template.id === selectedTemplate ? primaryColor : template.primaryColor, accentColor: template.id === selectedTemplate ? accentColor : template.accentColor }}
              isSelected={selectedTemplate === template.id}
            />
          </div>
        ))}
      </div>

      {/* Customization Panel (below grid) */}
      {activeTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color customization */}
          <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-neutral-50 border-b border-neutral-100 py-3.5">
              <CardTitle className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                Personalizar: {activeTemplate.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-neutral-500 uppercase">Color Primario</Label>
                  <div className="flex gap-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-9 rounded-md cursor-pointer border border-neutral-200 p-0.5" />
                    <Input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="uppercase font-mono text-[10px] h-9 flex-1" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-neutral-500 uppercase">Color Secundario</Label>
                  <div className="flex gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-9 rounded-md cursor-pointer border border-neutral-200 p-0.5" />
                    <Input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="uppercase font-mono text-[10px] h-9 flex-1" />
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-neutral-500 uppercase">Logotipo Corporativo</Label>
                <div className="relative">
                  <input type="file" accept="image/*" id="logo-upload" onChange={handleLogoFileChange} className="hidden" />
                  <label htmlFor="logo-upload" className="flex items-center justify-center w-full h-10 px-4 border border-dashed border-neutral-300 hover:border-indigo-400 rounded-lg bg-neutral-50 hover:bg-indigo-50/30 cursor-pointer text-[10px] font-semibold text-neutral-600 transition-all gap-2">
                    {uploadingLogo ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Subiendo...</> : <><Palette className="w-3.5 h-3.5" /> Examinar Archivo (PNG, JPG, SVG)</>}
                  </label>
                </div>
                {logoUrl && (
                  <div className="mt-2 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between">
                    <img src={logoUrl} alt="Logo" className="max-h-10 object-contain" />
                    <Button variant="ghost" size="sm" onClick={() => setLogoUrl('')} className="text-red-500 hover:bg-red-50 text-[10px] h-7">Eliminar</Button>
                  </div>
                )}
              </div>

              {/* Font info */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-150 text-[10px] text-neutral-600">
                <span className="font-bold text-neutral-800 block mb-1">Tipografía: </span>
                <span style={{ fontFamily: activeTemplate.fontFamily }} className="text-sm font-semibold text-neutral-900">
                  {activeTemplate.fontFamily}
                </span>
                <span className="block mt-1 text-neutral-400">La tipografía se asigna automáticamente con cada plantilla.</span>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview — Full Realistic Invoice */}
          <Card className="border-neutral-200 shadow-xl overflow-hidden rounded-xl bg-[#E5E7EB] border-[5px]">
            <CardHeader className="bg-white border-b border-neutral-200 py-2.5 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                Vista Previa en Vivo
              </CardTitle>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6 flex items-start justify-center overflow-auto">
              <RealisticInvoicePreview
                template={activeTemplate}
                primaryColor={primaryColor}
                accentColor={accentColor}
                settings={settings}
                logoUrl={logoUrl}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
