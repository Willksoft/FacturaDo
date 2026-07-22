import React, { useState, useMemo } from 'react';
import { 
  UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, 
  RefreshCw, Sparkles, Database, FileText, Users, ShoppingBag, Truck, Download, 
  HelpCircle, ShieldCheck, Layers, FileCheck, Search, Filter, Info
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { processSmartImport, UniversalMigrationResult, EntityType } from '../../lib/smartImporter';

interface SystemMigrationViewProps {
  onImportClients?: (clients: any[]) => void;
  onImportProducts?: (products: any[]) => void;
  onImportProviders?: (providers: any[]) => void;
  onImportInvoices?: (invoices: any[]) => void;
  showNotice?: (msg: string, success?: boolean) => void;
}

type OriginSystem = 'woocommerce' | 'shopify' | 'alegra' | 'quickbooks' | 'cashflow' | 'odoo' | 'zoho' | 'sage_softland' | 'custom_excel';

export const SystemMigrationView: React.FC<SystemMigrationViewProps> = ({
  onImportClients,
  onImportProducts,
  onImportProviders,
  onImportInvoices,
  showNotice
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSystem, setSelectedSystem] = useState<OriginSystem>('woocommerce');
  const [targetEntity, setTargetEntity] = useState<EntityType>('product');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<UniversalMigrationResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValidOnly, setFilterValidOnly] = useState(false);

  // Column Mapping Overrides
  const [columnOverrides, setColumnOverrides] = useState<Record<string, string>>({});

  const systemsList = [
    {
      id: 'woocommerce' as OriginSystem,
      name: 'WooCommerce (WordPress)',
      logo: '🛒',
      logoImg: '/logosbrands/Woo_logo_color.svg',
      badge: 'E-Commerce Popular',
      desc: 'Importa catálogo de productos, SKU, precios regulares/oferta, stock y categorías desde exportación de WordPress.',
      color: 'border-purple-500/40 bg-purple-50/40 text-purple-950 hover:bg-purple-50'
    },
    {
      id: 'shopify' as OriginSystem,
      name: 'Shopify Store',
      logo: '🛍️',
      logoImg: '/logosbrands/shopify_monotone_white.svg',
      badge: 'Tienda Online',
      desc: 'Soporta exportación CSV oficial de productos (Title, Variant SKU, Variant Price, Variant Inventory Qty) y clientes.',
      color: 'border-emerald-600/40 bg-emerald-50/40 text-emerald-950 hover:bg-emerald-50'
    },
    {
      id: 'alegra' as OriginSystem,
      name: 'Alegra',
      logo: '⚡',
      logoImg: '/logosbrands/alegra-seeklogo.svg',
      badge: 'Recomendado RD',
      desc: 'Importa clientes, catálogo de productos con stock e historial exportado de Alegra.',
      color: 'border-emerald-500/40 bg-emerald-50/40 text-emerald-950 hover:bg-emerald-50'
    },
    {
      id: 'cashflow' as OriginSystem,
      name: 'Cashflow Software',
      logo: '💵',
      logoImg: '/logosbrands/cahsflow.svg',
      badge: 'Dominicano',
      desc: 'Importación optimizada para RNC, Cédula, Comprobantes Fiscales NCF y Listados.',
      color: 'border-amber-500/40 bg-amber-50/40 text-amber-950 hover:bg-amber-50'
    },
    {
      id: 'quickbooks' as OriginSystem,
      name: 'QuickBooks (Online / Desktop)',
      logo: '💼',
      logoImg: '/logosbrands/descarga.svg',
      badge: 'Internacional',
      desc: 'Compatible con reportes CSV de Customers, Item List, Vendor List e Invoices.',
      color: 'border-blue-500/40 bg-blue-50/40 text-blue-950 hover:bg-blue-50'
    },
    {
      id: 'odoo' as OriginSystem,
      name: 'Odoo ERP',
      logo: '🟣',
      logoImg: '/logosbrands/odoo-official-partner.png',
      badge: 'Open Source ERP',
      desc: 'Detecta automáticamente campos de Odoo (partner name, internal reference, unit price, qty_available).',
      color: 'border-purple-500/40 bg-purple-50/40 text-purple-950 hover:bg-purple-50'
    },
    {
      id: 'zoho' as OriginSystem,
      name: 'Zoho CRM & Books',
      logo: '🚀',
      logoImg: '/logosbrands/zoho-logo-web.svg',
      badge: 'Sincronización CRM',
      desc: 'Formato directo para exportaciones de contactos, inventario y facturación de Zoho.',
      color: 'border-rose-500/40 bg-rose-50/40 text-rose-950 hover:bg-rose-50'
    },
    {
      id: 'sage_softland' as OriginSystem,
      name: 'Sage / Softland ERP',
      logo: '🏢',
      badge: 'Empresarial',
      desc: 'Soporta plantillas de Sage 50 / Softland con desinfección automática de RNC y monedas.',
      color: 'border-cyan-500/40 bg-cyan-50/40 text-cyan-950 hover:bg-cyan-50'
    },
    {
      id: 'custom_excel' as OriginSystem,
      name: 'Excel / CSV / XML Libre',
      logo: '📊',
      badge: 'Universal',
      desc: 'Sube cualquier hoja de cálculo. Nuestro algoritmo fuzzy mapea las columnas automáticamente.',
      color: 'border-slate-500/40 bg-slate-50/40 text-slate-900 hover:bg-slate-50'
    }
  ];

  const entitiesList = [
    { id: 'client' as EntityType, label: 'Clientes y RNCs', icon: Users, desc: 'Nombre, RNC/Cédula, Teléfono, Correo, Dirección' },
    { id: 'product' as EntityType, label: 'Productos y Servicios', icon: ShoppingBag, desc: 'Código/SKU, Descripción, Precio, Costo, Stock' },
    { id: 'provider' as EntityType, label: 'Proveedores y Suplidores', icon: Truck, desc: 'Razón Social, RNC, Contacto, Correo, Dirección' },
    { id: 'invoice' as EntityType, label: 'Facturas / Historial de Ventas', icon: FileText, desc: 'NCF, Cliente, Subtotal, ITBIS, Monto Total' },
  ];

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    try {
      const result = await processSmartImport(uploadedFile, targetEntity);
      setImportResult(result);
      // Reset column overrides
      const initialOverrides: Record<string, string> = {};
      result.mappedColumns.forEach(col => {
        initialOverrides[col.excelHeader] = col.targetField;
      });
      setColumnOverrides(initialOverrides);
      setActiveStep(3);
    } catch (err: any) {
      showNotice?.(`Error procesando archivo: ${err.message || 'Formato no soportado'}`, false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const filteredPreviewData = useMemo(() => {
    if (!importResult) return [];
    return importResult.previewData.filter(row => {
      if (filterValidOnly && !row._isValid) return false;
      if (!searchTerm) return true;
      const jsonStr = JSON.stringify(row).toLowerCase();
      return jsonStr.includes(searchTerm.toLowerCase());
    });
  }, [importResult, filterValidOnly, searchTerm]);

  const handleExecuteMigration = () => {
    if (!importResult || importResult.sanitizedRecords.length === 0) return;

    if (targetEntity === 'client' && onImportClients) {
      onImportClients(importResult.sanitizedRecords);
    } else if (targetEntity === 'product' && onImportProducts) {
      onImportProducts(importResult.sanitizedRecords);
    } else if (targetEntity === 'provider' && onImportProviders) {
      onImportProviders(importResult.sanitizedRecords);
    } else if (targetEntity === 'invoice' && onImportInvoices) {
      onImportInvoices(importResult.sanitizedRecords);
    }

    showNotice?.(`¡Migración Exitosa! Se importaron ${importResult.sanitizedRecords.length} registros desinfectados.`, true);
    setActiveStep(4);
  };

  const downloadSampleTemplate = (type: EntityType) => {
    let csvContent = '';
    let filename = '';

    if (type === 'client') {
      csvContent = 'Nombre / Razón Social,RNC / Cédula,Teléfono,Correo Electrónico,Dirección,Tipo\nJuan Pérez,402-1234567-8,809-555-0199,juan@ejemplo.com,Santo Domingo,Persona Física\nComercial Sol SRL,130-99999-9,809-555-0200,contacto@comercialsol.do,Santiago,Empresa';
      filename = 'plantilla_clientes_facturado.csv';
    } else if (type === 'product') {
      csvContent = 'Código / SKU,Descripción / Producto,Precio de Venta,Costo Unitario,Stock Inicial,Tipo\nPROD-001,Laptop HP 15 i5 16GB,45000.00,35000.00,10,Producto\nSERV-002,Asesoría Contable Mensual,12000.00,0,0,Servicio';
      filename = 'plantilla_productos_facturado.csv';
    } else if (type === 'provider') {
      csvContent = 'Razón Social,RNC / Cédula,Teléfono,Correo,Dirección\nDistribuidora Dominicana SRL,101-88888-8,809-555-0300,ventas@distribuidora.do,Santo Domingo Este';
      filename = 'plantilla_proveedores_facturado.csv';
    } else {
      csvContent = 'NCF,Cliente,Subtotal,ITBIS,Monto Total,Fecha\nB0100000001,Comercial Sol SRL,10000.00,1800.00,11800.00,2026-07-21';
      filename = 'plantilla_facturas_facturado.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Asistente Masivo de Migración de Sistemas
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Migración Universal de Software
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Importa fácilmente todos tus datos desde <strong>Alegra, QuickBooks, Cashflow, Odoo, Zoho</strong> o archivos <strong>Excel / CSV / XML</strong> libres con desinfección automática de RNCs y monedas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => downloadSampleTemplate(targetEntity)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-9 font-semibold gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar Plantilla ({targetEntity})
            </Button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { step: 1, label: '1. Origen y Entidad', desc: 'Seleccionar software' },
          { step: 2, label: '2. Cargar Archivo', desc: 'Excel, CSV, XML' },
          { step: 3, label: '3. Mapeo y Vista Previa', desc: 'Verificación en vivo' },
          { step: 4, label: '4. Confirmación', desc: 'Migración finalizada' },
        ].map((s) => {
          const isActive = activeStep === s.step;
          const isDone = activeStep > s.step;
          return (
            <button
              key={s.step}
              onClick={() => {
                if (s.step === 1 || (s.step === 2 && file) || (s.step === 3 && importResult)) {
                  setActiveStep(s.step as any);
                }
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/30'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                isActive
                  ? 'bg-white text-indigo-700'
                  : isDone
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate leading-none">{s.label}</p>
                <p className={`text-[10px] truncate mt-1 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* STEP 1: SELECT SYSTEM AND ENTITY */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Paso 1: Selecciona el Sistema de Origen de tus Datos
              </CardTitle>
              <CardDescription className="text-xs">
                Selecciona la plataforma desde donde exportaste tus archivos para aplicar reglas de detección fuzzy optimizadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemsList.map((sys) => {
                  const isSelected = selectedSystem === sys.id;
                  return (
                    <div
                      key={sys.id}
                      onClick={() => setSelectedSystem(sys.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                        isSelected
                          ? `${sys.color} ring-2 ring-indigo-500/20 shadow-sm border-indigo-600`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        {sys.logoImg ? (
                          <div className="h-10 flex items-center">
                            <img src={sys.logoImg} alt={sys.name} className="h-8 sm:h-9 w-auto max-w-[130px] object-contain" />
                          </div>
                        ) : (
                          <span className="text-2xl">{sys.logo}</span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                          {sys.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{sys.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sys.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Target Entity Selector */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <Label className="text-xs font-bold text-slate-900 block">¿Qué tipo de datos deseas migrar primero?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {entitiesList.map((ent) => {
                    const Icon = ent.icon;
                    const isSelected = targetEntity === ent.id;
                    return (
                      <div
                        key={ent.id}
                        onClick={() => setTargetEntity(ent.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-1 ring-indigo-600/30'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                          <span className="text-xs font-bold">{ent.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-normal leading-normal">{ent.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => setActiveStep(2)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 font-semibold gap-2"
              >
                Continuar a Carga de Archivo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* STEP 2: UPLOAD FILE */}
      {activeStep === 2 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              Paso 2: Carga tu Archivo de {selectedSystem.toUpperCase()} para {entitiesList.find(e => e.id === targetEntity)?.label}
            </CardTitle>
            <CardDescription className="text-xs">
              Soporta archivos Excel (.xlsx, .xls), CSV (.csv), TSV (.tsv), XML (.xml) y texto (.txt).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 p-8 sm:p-12 rounded-3xl text-center transition-all cursor-pointer group"
            >
              <input
                type="file"
                id="fileInput"
                accept=".xlsx,.xls,.csv,.tsv,.xml,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="fileInput" className="cursor-pointer space-y-3 block">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  {isProcessing ? <RefreshCw className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    {isProcessing ? 'Analizando estructura de columnas...' : 'Arrastra tu archivo aquí o haz clic para examinar'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Extensiones soportadas: Excel (.xlsx, .xls), CSV, TSV, XML o TXT
                  </p>
                </div>
              </label>
            </div>

            {file && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{file.name}</p>
                    <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB • Preparado para análisis</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setFile(null)}
                  className="text-xs text-red-600 hover:bg-red-50 h-8"
                >
                  Cambiar Archivo
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveStep(1)}
              className="text-xs h-9 font-semibold gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: MAPPING AND PREVIEW */}
      {activeStep === 3 && importResult && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-emerald-50/70 border-emerald-200 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Filas Válidas y Listas</p>
                  <p className="text-2xl font-extrabold text-emerald-950">{importResult.totalValid}</p>
                  <p className="text-[10px] text-emerald-700">Listas para insertar en PostgreSQL</p>
                </div>
              </div>
            </Card>

            <Card className="bg-indigo-50/70 border-indigo-200 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-indigo-900">RNCs y Cédulas Limpios</p>
                  <p className="text-2xl font-extrabold text-indigo-950">
                    {importResult.sanitizedRecords.filter(r => r.rncOrCedula).length}
                  </p>
                  <p className="text-[10px] text-indigo-700">Formato DGII sin guiones</p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-50 border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <FileCheck className="w-8 h-8 text-slate-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Columnas Mapeadas</p>
                  <p className="text-2xl font-extrabold text-slate-950">{importResult.mappedColumns.length}</p>
                  <p className="text-[10px] text-slate-600">Reconocidas vía algoritmo fuzzy</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Mapped Columns Accordion / Interactive Manual Mapping */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Relación y Enlace Manual de Columnas
                </CardTitle>
                <CardDescription className="text-xs">
                  Relaciona manualmente los encabezados de tu archivo con los campos requeridos por FacturaDo si difieren.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (file) {
                    setColumnOverrides({});
                    setIsProcessing(true);
                    const res = await processSmartImport(file, targetEntity);
                    setImportResult(res);
                    setIsProcessing(false);
                    showNotice?.('Mapeo restablecido al algoritmo automático', true);
                  }
                }}
                className="text-xs h-8 bg-white border-slate-200 text-slate-700 font-semibold gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                Restablecer Mapeo Auto
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {importResult.availableTargetFields?.map((tf) => {
                  // Current mapped Excel header for this targetField
                  const currentMappedObj = importResult.mappedColumns.find(c => c.targetField === tf.field);
                  const currentHeaderValue = columnOverrides[tf.field] || currentMappedObj?.excelHeader || '';

                  return (
                    <div key={tf.field} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                          {tf.label}
                          {tf.required && <span className="text-red-500 font-bold">*</span>}
                        </span>
                        {currentHeaderValue ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Enlazado ✓
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                            Sin Enlace
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">
                          Columna Origen en tu Excel/CSV:
                        </label>
                        <select
                          value={currentHeaderValue}
                          onChange={async (e) => {
                            const newHeader = e.target.value;
                            const newOverrides = { ...columnOverrides, [tf.field]: newHeader };
                            setColumnOverrides(newOverrides);
                            if (file) {
                              setIsProcessing(true);
                              try {
                                const newRes = await processSmartImport(file, targetEntity, newOverrides);
                                setImportResult(newRes);
                              } catch (err) {
                                console.error(err);
                              } finally {
                                setIsProcessing(false);
                              }
                            }
                          }}
                          className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option value="">-- Ignorar / No mapear --</option>
                          {importResult.detectedHeaders?.map((headerName, hIdx) => (
                            <option key={hIdx} value={headerName}>
                              {headerName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Data Preview Table */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Vista Previa de Registros Sanitizados ({filteredPreviewData.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Revisa los primeros datos limpios antes de confirmar la inserción definitiva.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar registros..."
                    className="text-xs h-8 pl-8 w-44 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFilterValidOnly(!filterValidOnly)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 cursor-pointer ${
                    filterValidOnly ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  {filterValidOnly ? 'Solo Válidos' : 'Todos'}
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Estado</th>
                    {targetEntity === 'client' && (
                      <>
                        <th className="p-3">Nombre / Razón Social</th>
                        <th className="p-3">RNC / Cédula</th>
                        <th className="p-3">Teléfono</th>
                        <th className="p-3">Correo</th>
                        <th className="p-3">Tipo Persona</th>
                      </>
                    )}
                    {targetEntity === 'product' && (
                      <>
                        <th className="p-3">Código / SKU</th>
                        <th className="p-3">Descripción</th>
                        <th className="p-3">Precio Venta</th>
                        <th className="p-3">Costo</th>
                        <th className="p-3">Stock</th>
                      </>
                    )}
                    {targetEntity === 'provider' && (
                      <>
                        <th className="p-3">Razón Social</th>
                        <th className="p-3">RNC / Cédula</th>
                        <th className="p-3">Teléfono</th>
                        <th className="p-3">Correo</th>
                      </>
                    )}
                    {targetEntity === 'invoice' && (
                      <>
                        <th className="p-3">NCF</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Subtotal</th>
                        <th className="p-3">ITBIS</th>
                        <th className="p-3">Total</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredPreviewData.slice(0, 50).map((row, i) => (
                    <tr key={i} className={row._isValid ? 'hover:bg-slate-50' : 'bg-red-50/50 hover:bg-red-50'}>
                      <td className="p-3">
                        {row._isValid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Válido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Incompleto
                          </span>
                        )}
                      </td>
                      {targetEntity === 'client' && (
                        <>
                          <td className="p-3 font-bold">{row.name || '-'}</td>
                          <td className="p-3 font-mono font-bold text-indigo-700">{row.rncOrCedula || '-'}</td>
                          <td className="p-3">{row.phone || '-'}</td>
                          <td className="p-3 text-slate-500">{row.email || '-'}</td>
                          <td className="p-3 text-slate-600">{row.type || 'Persona Física'}</td>
                        </>
                      )}
                      {targetEntity === 'product' && (
                        <>
                          <td className="p-3 font-mono font-bold">{row.code || '-'}</td>
                          <td className="p-3 font-bold">{row.name || '-'}</td>
                          <td className="p-3 font-bold text-emerald-700">RD$ {(row.price || 0).toLocaleString()}</td>
                          <td className="p-3 text-slate-500">RD$ {(row.cost || 0).toLocaleString()}</td>
                          <td className="p-3 font-bold">{row.stock || 0}</td>
                        </>
                      )}
                      {targetEntity === 'provider' && (
                        <>
                          <td className="p-3 font-bold">{row.name || '-'}</td>
                          <td className="p-3 font-mono font-bold text-indigo-700">{row.rncOrCedula || '-'}</td>
                          <td className="p-3">{row.phone || '-'}</td>
                          <td className="p-3 text-slate-500">{row.email || '-'}</td>
                        </>
                      )}
                      {targetEntity === 'invoice' && (
                        <>
                          <td className="p-3 font-mono font-bold text-amber-700">{row.ncf || '-'}</td>
                          <td className="p-3 font-bold">{row.clientName || '-'}</td>
                          <td className="p-3">RD$ {(row.subtotal || 0).toLocaleString()}</td>
                          <td className="p-3 text-slate-500">RD$ {(row.itbis || 0).toLocaleString()}</td>
                          <td className="p-3 font-bold text-emerald-700">RD$ {(row.total || 0).toLocaleString()}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
            <CardFooter className="py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveStep(2)}
                className="text-xs h-9 font-semibold gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Cargar Otro Archivo
              </Button>

              <Button
                onClick={handleExecuteMigration}
                disabled={importResult.sanitizedRecords.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9.5 px-5 font-bold gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Ejecutar Migración de {importResult.sanitizedRecords.length} Registros
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* STEP 4: CONFIRMATION */}
      {activeStep === 4 && (
        <Card className="border-emerald-200 bg-emerald-50/30 text-center p-8 sm:p-12 space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              ¡Migración Completada Exitosamente!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Los datos extraídos de <strong>{selectedSystem.toUpperCase()}</strong> se han desinfectado y guardado correctamente en tu base de datos de FacturaDo.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={() => {
                setFile(null);
                setImportResult(null);
                setActiveStep(1);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-9 font-semibold"
            >
              Realizar Otra Migración
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
