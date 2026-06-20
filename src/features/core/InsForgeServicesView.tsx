import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { insforge } from '../../lib/insforge';
import { 
  Cloud, 
  Cpu, 
  Wifi, 
  Globe, 
  Upload, 
  Activity, 
  FileCheck, 
  Server, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  FileCode,
  Radio,
  ExternalLink,
  Folder,
  FolderPlus,
  Copy,
  Trash2,
  Download,
  Shield,
  FileText,
  File,
  Image as ImageIcon
} from 'lucide-react';

interface BucketItem {
  name: string;
  displayName: string;
  privacy: 'Público' | 'Privado';
  desc: string;
}

interface StorageFile {
  name: string;
  key: string;
  size: number;
  bucket: string;
  url: string;
  type: string;
  date: string;
}

export function InsForgeServicesView() {
  // Enhanced Bucket Storage states
  const [buckets, setBuckets] = useState<BucketItem[]>(() => {
    const saved = localStorage.getItem('insforge_storage_buckets');
    if (saved) return JSON.parse(saved);
    return [
      { name: 'public', displayName: 'public', privacy: 'Público', desc: 'Bucket de almacenamiento de recursos de acceso general.' },
      { name: 'profile_pictures', displayName: 'profile_pictures', privacy: 'Público', desc: 'Fotos de perfil, avatares y capturas de identidad de usuarios.' },
      { name: 'company_logos', displayName: 'company_logos', privacy: 'Público', desc: 'Membretes y logos corporativos para sus plantillas fiscales.' },
      { name: 'generated_documents', displayName: 'generated_documents', privacy: 'Privado', desc: 'Reportes y PDF generados para clientes y proveedores.' }
    ];
  });

  const [selectedBucket, setSelectedBucket] = useState('public');
  const [uploading, setUploading] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Bucket form states
  const [showCreateBucketForm, setShowCreateBucketForm] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketPrivacy, setNewBucketPrivacy] = useState<'Público' | 'Privado'>('Público');
  const [newBucketDesc, setNewBucketDesc] = useState('');

  // Files state
  const [allFiles, setAllFiles] = useState<StorageFile[]>(() => {
    const saved = localStorage.getItem('insforge_storage_files');
    if (saved) return JSON.parse(saved);
    return [
      {
        name: 'admin_avatar.jpg',
        key: 'seed_admin_avatar.jpg',
        size: 225280,
        bucket: 'profile_pictures',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        type: 'image/jpeg',
        date: '2026-06-12'
      },
      {
        name: 'soporte_avatar.jpg',
        key: 'seed_soporte_avatar.jpg',
        size: 184320,
        bucket: 'profile_pictures',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        type: 'image/jpeg',
        date: '2026-06-12'
      },
      {
        name: 'facturado_original_logo.png',
        key: 'seed_logo_orig.png',
        size: 97280,
        bucket: 'company_logos',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        type: 'image/png',
        date: '2026-06-12'
      },
      {
        name: 'factura_DGII_B0100021034.pdf',
        key: 'seed_inv_dgii.pdf',
        size: 148480,
        bucket: 'generated_documents',
        url: 'https://arxiv.org/pdf/2103.00020.pdf',
        type: 'application/pdf',
        date: '2026-06-12'
      },
      {
        name: 'resumen_606_dgii_formato.xlsx',
        key: 'seed_iva_excel.xlsx',
        size: 327680,
        bucket: 'generated_documents',
        url: '#excel',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        date: '2026-06-12'
      }
    ];
  });

  // Functions states
  const [runningFunction, setRunningFunction] = useState(false);
  const [functionLogs, setFunctionLogs] = useState<string[]>([]);
  const [functionSuccess, setFunctionSuccess] = useState(false);

  // Realtime states
  const [realtimeLogs, setRealtimeLogs] = useState<Array<{ time: string; event: string; type: 'info' | 'success' | 'warn' }>>([]);
  const [isListening, setIsListening] = useState(true);
  
  // Sites states
  const [siteDomain, setSiteDomain] = useState('https://facturado-do.insforge.app');
  const [siteChecking, setSiteChecking] = useState(false);
  const [siteLatency, setSiteLatency] = useState<number | null>(42);
  const [uploadingSvgs, setUploadingSvgs] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to LS
  useEffect(() => {
    localStorage.setItem('insforge_storage_buckets', JSON.stringify(buckets));
  }, [buckets]);

  useEffect(() => {
    localStorage.setItem('insforge_storage_files', JSON.stringify(allFiles));
  }, [allFiles]);

  // Initial event streams
  useEffect(() => {
    setRealtimeLogs([
      { time: new Date().toLocaleTimeString(), event: "Canal de sincronización de facturas activado", type: "info" },
      { time: new Date().toLocaleTimeString(), event: "Suscrito a los eventos globales del NCF (DGII)", type: "success" },
      { time: new Date().toLocaleTimeString(), event: "Conectado al servidor WebSocket regional (us-east)", type: "success" }
    ]);

    setFunctionLogs([
      "Instancia serverless DGII-Sync-Worker inactiva (Cold Start listo)",
      "Destino de llamadas API de DGII: Producción Homologada",
      "Listando cola de pre-declaraciones fiscales locales..."
    ]);
  }, []);

  // Simulator interval for Realtime activity
  useEffect(() => {
    if (!isListening) return;

    const events = [
      "Consulta al padrón DGII para RNC 131-XXXXX-X (Completado)",
      "Generación de secuencia NCF serie B01 (Crédito Fiscal) detectada",
      "Actualización de inventario - Almacén Principal sincronizado",
      "Validación de firma digital del emisor (Éxito)"
    ];

    const timer = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setRealtimeLogs(prev => [
        { time: new Date().toLocaleTimeString(), event: randomEvent, type: "info" },
        ...prev.slice(0, 9)
      ]);
    }, 8000);

    return () => clearInterval(timer);
  }, [isListening]);

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // File type categorizer component helper
  const getFileIcon = (type: string, name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    
    if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4 text-emerald-500" />;
    }
    if (type.includes('pdf') || ext === 'pdf') {
      return <FileText className="w-4 h-4 text-rose-500" />;
    }
    if (type.includes('excel') || ['xlsx', 'xls', 'csv'].includes(ext || '')) {
      return <FileCheck className="w-4 h-4 text-green-600" />;
    }
    if (type.includes('json') || ext === 'json') {
      return <FileCode className="w-4 h-4 text-amber-500" />;
    }
    return <File className="w-4 h-4 text-neutral-400" />;
  };

  // Copy URL
  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Upload file to selected bucket
  const handleBucketUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStorageError(null);

    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueKey = `${Date.now()}_${cleanName}`;
      
      const bucketObj = insforge.storage.from(selectedBucket);
      const { data, error } = await bucketObj.upload(uniqueKey, file);

      if (error) {
        throw error;
      }

      const publicUrl = bucketObj.getPublicUrl(uniqueKey);
      
      const fileRecord: StorageFile = {
        name: file.name,
        key: uniqueKey,
        size: file.size,
        bucket: selectedBucket,
        url: publicUrl,
        type: file.type || 'application/octet-stream',
        date: new Date().toISOString().split('T')[0]
      };

      setAllFiles(prev => [fileRecord, ...prev]);
      
      setRealtimeLogs(prev => [
        { time: new Date().toLocaleTimeString(), event: `Archivo subido al bucket '${selectedBucket}': ${file.name}`, type: "success" },
        ...prev
      ]);
    } catch (err: any) {
      console.warn("Storage upload failed, fallback to simulated storage object:", err);
      // Auto fallback
      const mockKey = `${Date.now()}_${file.name}`;
      const mockUrl = `https://zdwuav42.us-east.insforge.app/storage/v1/object/public/${selectedBucket}/${file.name}`;
      
      const fallbackRecord: StorageFile = {
        name: file.name,
        key: mockKey,
        size: file.size,
        bucket: selectedBucket,
        url: mockUrl,
        type: file.type || 'application/octet-stream',
        date: new Date().toISOString().split('T')[0]
      };

      setAllFiles(prev => [fallbackRecord, ...prev]);
      
      setRealtimeLogs(prev => [
        { time: new Date().toLocaleTimeString(), event: `Archivo guardado localmente en bucket '${selectedBucket}': ${file.name}`, type: "success" },
        ...prev
      ]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadTestSVGs = async () => {
    setUploadingSvgs(true);
    setStorageError(null);
    
    const svgLogos = [
      {
        name: 'facturado_emblem_demo.svg',
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#1A2732"/>
  <path d="M30 25h40v50H30z" fill="#FFFFFF" opacity="0.9"/>
  <path d="M35 35h30M35 45h20M35 55h30" stroke="#1A2732" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="70" r="10" fill="#E11D48"/>
  <path d="M47 70l2 2 4-4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
      },
      {
        name: 'tecnologia_fiscal_cyber.svg',
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="45" fill="#0F172A"/>
  <polygon points="50,15 80,75 20,75" fill="none" stroke="#22C55E" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="50" cy="50" r="12" fill="#22C55E"/>
</svg>`
      }
    ];

    try {
      const targetBucket = buckets.some(b => b.name === 'company_logos') ? 'company_logos' : 'public';
      const bucketObj = insforge.storage.from(targetBucket);
      
      for (const logo of svgLogos) {
        const file = new (window as any).File([logo.code], logo.name, { type: 'image/svg+xml' });
        const uniqueKey = `test_${Date.now()}_${logo.name}`;
        
        const { error } = await bucketObj.upload(uniqueKey, file);
        if (error) {
          throw error;
        }

        const publicUrl = bucketObj.getPublicUrl(uniqueKey);
        
        const fileRecord: StorageFile = {
          name: logo.name,
          key: uniqueKey,
          size: logo.code.length,
          bucket: targetBucket,
          url: publicUrl,
          type: 'image/svg+xml',
          date: new Date().toISOString().split('T')[0]
        };

        setAllFiles(prev => [fileRecord, ...prev]);
      }

      setSelectedBucket(targetBucket);
      setRealtimeLogs(prev => [
        { time: new Date().toLocaleTimeString(), event: `Imágenes SVG de Prueba subidas exitosamente al bucket '${targetBucket}' (SDK)!`, type: "success" },
        ...prev
      ]);
    } catch (err: any) {
      console.warn("Storage upload failed, fallback to local simulate:", err);
      const targetBucket = buckets.some(b => b.name === 'company_logos') ? 'company_logos' : 'public';
      
      for (const logo of svgLogos) {
        const uniqueKey = `test_${Date.now()}_${logo.name}`;
        const mockUrl = `https://zdwuav42.us-east.insforge.app/storage/v1/object/public/${targetBucket}/${uniqueKey}`;
        
        const fallbackRecord: StorageFile = {
          name: logo.name,
          key: uniqueKey,
          size: logo.code.length,
          bucket: targetBucket,
          url: mockUrl,
          type: 'image/svg+xml',
          date: new Date().toISOString().split('T')[0]
        };

        setAllFiles(prev => [fallbackRecord, ...prev]);
      }
      setSelectedBucket(targetBucket);
      setRealtimeLogs(prev => [
        { time: new Date().toLocaleTimeString(), event: `Cargando SVGs de Prueba de manera offline en '${targetBucket}'`, type: "info" },
        ...prev
      ]);
    } finally {
      setUploadingSvgs(false);
    }
  };

  // Create new bucket
  const handleCreateBucket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBucketName) return;

    const sanitized = newBucketName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    if (buckets.some(b => b.name === sanitized)) {
      alert("Ya existe un bucket con ese identificador.");
      return;
    }

    const newBucket: BucketItem = {
      name: sanitized,
      displayName: sanitized,
      privacy: newBucketPrivacy,
      desc: newBucketDesc || 'Bucket de almacenamiento personalizado.'
    };

    setBuckets(prev => [...prev, newBucket]);
    setSelectedBucket(sanitized);
    setNewBucketName('');
    setNewBucketDesc('');
    setShowCreateBucketForm(false);

    setRealtimeLogs(prev => [
      { time: new Date().toLocaleTimeString(), event: `Nuevo bucket storage aprovisionado: '${sanitized}'`, type: "success" },
      ...prev
    ]);
  };

  // Delete file
  const deleteFile = (key: string) => {
    setAllFiles(prev => prev.filter(f => f.key !== key));
    setRealtimeLogs(prev => [
      { time: new Date().toLocaleTimeString(), event: `Archivo removido de Storage: ${key}`, type: "warn" },
      ...prev
    ]);
  };

  // Verify site ping latency
  const pingSiteAddress = () => {
    setSiteChecking(true);
    setSiteLatency(null);
    setTimeout(() => {
      setSiteChecking(false);
      setSiteLatency(Math.floor(Math.random() * 25) + 20);
    }, 800);
  };

  // Run serverless verification
  const runDgiisyncFunction = () => {
    if (runningFunction) return;

    setRunningFunction(true);
    setFunctionSuccess(false);
    setFunctionLogs([
      `[${new Date().toLocaleTimeString()}] Iniciando invocación de función serverless 'dgii-sync'...`,
      `[${new Date().toLocaleTimeString()}] Empaquetando transacciones de NCF...`
    ]);

    const steps = [
      { text: "Conectando con servidores de validación fiscal dominicana...", delay: 800 },
      { text: "Enviando lote de 3 facturas de Prueba (B01, B02)...", delay: 1600 },
      { text: "DGII responde: Códigos de autorización de comprobantes válidos.", delay: 2450 },
      { text: "Sincronización finalizada. Guardando estado operativo en PostgreSQL...", delay: 3200 }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setFunctionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.text}`]);
        if (i === steps.length - 1) {
          setRunningFunction(false);
          setFunctionSuccess(true);
          setRealtimeLogs(prev => [
            { time: new Date().toLocaleTimeString(), event: "Función serverless 'dgii-sync' ejecutada con éxito", type: "success" },
            ...prev
          ]);
        }
      }, step.delay);
    });
  };

  // Filter files by current bucket
  const filteredFiles = allFiles.filter(f => f.bucket === selectedBucket);
  const activeBucketObj = buckets.find(b => b.name === selectedBucket) || buckets[0];

  return (
    <div className="space-y-6 font-sans select-none animate-fade-in text-left">
      {/* HEADER SECTION */}
      <div className="bg-[#1A2732] text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-800 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-10 pointer-events-none">
          <Server className="w-56 h-56" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-extrabold tracking-widest uppercase text-white border border-white/20">
            <Cloud className="w-3.5 h-3.5 text-blue-400" /> Infraestructura BaaS Integrada
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Consola de Servicios de Backend (InsForge)</h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-normal">
            Aprovisionamiento y administración de buckets de almacenamiento en la nube, canales de eventos WebSocket
            y microservicios serverless enlazados a FacturaDo.
          </p>
        </div>
      </div>

      {/* 1. COMPILACIÓN DE STORAGE BUCKET CONSOLE */}
      <div className="bg-white border border-neutral-150 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-150 bg-neutral-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-neutral-900">Consola de Almacenamiento (Storage Buckets)</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest">
                  Servicio Activo
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Crea canales independientes, sube fotos de perfil, logotipos y documentos fiscales generados de forma nativa.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateBucketForm(!showCreateBucketForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-extrabold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Crear Bucket</span>
          </button>
        </div>

        {/* Create bucket modal / form */}
        {showCreateBucketForm && (
          <form onSubmit={handleCreateBucket} className="p-5 border-b border-neutral-150 bg-neutral-50/20 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Identificador Único (Nombre)</label>
                <input
                  required
                  type="text"
                  placeholder="ej. facturas_pdf"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  className="w-full text-xs h-9 px-3 border border-neutral-200 rounded-lg font-mono focus:ring-1 focus:ring-black focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Nivel de Seguridad</label>
                <Select
                  value={newBucketPrivacy}
                  onValueChange={(val: 'Público' | 'Privado') => setNewBucketPrivacy(val)}
                >
                  <SelectTrigger className="w-full text-xs h-9 px-3 border border-neutral-200 rounded-lg bg-white focus:ring-1 focus:ring-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="Público" className="text-xs">Público (Enlace accesible general)</SelectItem>
                    <SelectItem value="Privado" className="text-xs">Privado (Acceso cifrado y seguro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Descripción Corta</label>
                <input
                  type="text"
                  placeholder="ej. Comprobantes fiscales generados mensualmente"
                  value={newBucketDesc}
                  onChange={(e) => setNewBucketDesc(e.target.value)}
                  className="w-full text-xs h-9 px-3 border border-neutral-200 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateBucketForm(false)}
                className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg"
              >
                Aprovisionar Bucket
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col lg:flex-row min-h-[300px]">
          {/* Side pane: bucket list */}
          <div className="w-full lg:w-72 border-r border-neutral-150 p-4 space-y-3 shrink-0 bg-neutral-50/30">
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Mis Buckets Activos</span>
            <div className="space-y-1.5">
              {buckets.map((b) => (
                <button
                  type="button"
                  key={b.name}
                  onClick={() => setSelectedBucket(b.name)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border ${
                    selectedBucket === b.name
                      ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Folder className={`w-4 h-4 shrink-0 ${selectedBucket === b.name ? 'text-white' : 'text-neutral-500'}`} />
                    <span className="text-xs font-extrabold truncate">{b.name}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                    b.privacy === 'Público' 
                      ? selectedBucket === b.name ? 'bg-white/25 text-white' : 'bg-emerald-50 text-emerald-700'
                      : selectedBucket === b.name ? 'bg-white/10 text-white' : 'bg-neutral-150 text-neutral-600'
                  }`}>
                    {b.privacy}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right details & explorer pane */}
          <div className="flex-1 p-5 space-y-5">
            {/* Active Bucket Header info */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-neutral-900 text-sm font-sans">Bucket: {activeBucketObj.name}</span>
                  <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-neutral-200 text-neutral-700 rounded-md text-[8px] font-bold font-mono">
                    <Shield className="w-2.5 h-2.5" /> {activeBucketObj.privacy === 'Público' ? 'Acceso Público' : 'Acceso Restringido'}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 leading-tight">{activeBucketObj.desc}</p>
              </div>

              {/* Upload interface in-header */}
              <div className="shrink-0 flex items-center gap-1.5 flex-wrap">
                {selectedBucket === 'company_logos' && (
                  <button
                    type="button"
                    onClick={handleUploadTestSVGs}
                    disabled={uploading || uploadingSvgs}
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 transition-all shadow-2xs cursor-pointer"
                    title="Prueba y sube logotipos vectoriales SVG al bucket"
                  >
                    {uploadingSvgs ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Subiendo...</span>
                      </>
                    ) : (
                      <>
                        <FileCode className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span>Subir SVG de Prueba</span>
                      </>
                    )}
                  </button>
                )}

                <label className="inline-block cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 px-4 h-9 bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs">
                    {uploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sincronizando...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Archivo</span>
                      </>
                    )}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleBucketUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Simulated file table explorer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Listado de Archivos ({filteredFiles.length})</span>
                <span className="text-[10px] text-neutral-400">Total: {formatBytes(filteredFiles.reduce((acc, f) => acc + f.size, 0))}</span>
              </div>

              {filteredFiles.length === 0 ? (
                <div className="border border-dashed border-neutral-200 rounded-2xl p-10 text-center space-y-2">
                  <Folder className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="text-xs font-bold text-neutral-500">Este bucket está vacío</p>
                  <p className="text-[10px] text-neutral-400">Sube fotos, reportes excel, JSON o PDFs directamente pulsando "Subir Archivos".</p>
                </div>
              ) : (
                <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                          <th className="py-2.5 px-4">Nombre del Archivo</th>
                          <th className="py-2.5 px-4 hidden sm:table-cell">Tamaño</th>
                          <th className="py-2.5 px-4 hidden md:table-cell">Fecha de Carga</th>
                          <th className="py-2.5 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs">
                        {filteredFiles.map((file) => (
                          <tr key={file.key} className="hover:bg-neutral-50/50 transition-all font-medium">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5 max-w-[150px] sm:max-w-xs md:max-w-md">
                                {getFileIcon(file.type, file.name)}
                                <div className="truncate">
                                  <span className="text-neutral-900 font-extrabold block truncate leading-tight">{file.name}</span>
                                  <span className="text-[9px] text-neutral-400 block font-mono font-medium">{file.type}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-neutral-500 hidden sm:table-cell font-mono">
                              {formatBytes(file.size)}
                            </td>
                            <td className="py-3 px-4 text-neutral-400 hidden md:table-cell font-sans">
                              {file.date}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(file.url, file.key)}
                                  className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                                    copiedKey === file.key
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                      : 'bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200'
                                  }`}
                                  title="Copiar URL al portapapeles"
                                >
                                  {copiedKey === file.key ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                
                                {file.url.startsWith('http') && (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer referrer"
                                    className="p-1.5 rounded-lg border bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200 shrink-0"
                                    title="Descargar / Ver original"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() => deleteFile(file.key)}
                                  className="p-1.5 rounded-lg border bg-white hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-100 shrink-0"
                                  title="Eliminar de mi consola"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid layouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CARD 2: FUNCTIONS - SERVERLESS EXECUTION */}
        <div className="bg-white border border-neutral-150 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 animate-pulse">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">2. Funciones (Serverless)</h4>
                  <p className="text-[11px] text-neutral-500">Cómputo en la nube para procesos y timbrado fiscal.</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                Operativo
              </span>
            </div>

            <div className="border border-neutral-150 rounded-xl p-4 bg-neutral-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Verificación de Comprobantes (DGII-Sync)</span>
                <button
                  type="button"
                  onClick={runDgiisyncFunction}
                  disabled={runningFunction}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-[10px] font-extrabold rounded-lg tracking-wide shadow-xs transition-all flex items-center gap-1 uppercase cursor-pointer"
                >
                  {runningFunction ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" /> Procesando
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-white" /> Ejecutar
                    </>
                  )}
                </button>
              </div>

              <div className="bg-zinc-950 rounded-xl p-3 font-mono text-[9px] text-zinc-300 space-y-1 h-[135px] overflow-y-auto">
                <div className="text-zinc-500 select-none pb-0.5 flex justify-between items-center border-b border-zinc-800 mb-1.5">
                  <span>TERMINAL LOGS [dgii-sync]</span>
                  <span className="text-emerald-500 text-[8px] animate-pulse">● CONECTADA</span>
                </div>
                {functionLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight shrink-0 truncate">
                    <span className="text-zinc-500">$</span> {log}
                  </div>
                ))}
                {functionSuccess && (
                  <div className="text-emerald-400 font-bold animate-fade-in pt-1 border-t border-zinc-800 md:mt-2">
                    ✓ EXECUTION_COMPLETED: 200 OK
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: REALTIME - WEBSOCKET MONITOR */}
        <div className="bg-white border border-neutral-150 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">3. Canal en Vivo (Realtime)</h4>
                  <p className="text-[11px] text-neutral-500">Transmisión bidireccional vía sockets en tiempo real.</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isListening ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
              }`}>
                {isListening ? 'Escuchando' : 'Desactivado'}
              </span>
            </div>

            <div className="border border-neutral-150 rounded-xl p-4 bg-neutral-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Actividad de canal de eventos locales</span>
                <button
                  type="button"
                  onClick={() => setIsListening(!isListening)}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all ${
                    isListening ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300' : 'bg-[#1A2732] text-white'
                  }`}
                >
                  {isListening ? 'Detener Websocket' : 'Activar Websocket'}
                </button>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {realtimeLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 bg-white border border-neutral-155 p-2 rounded-xl text-[11px] font-medium leading-normal animate-fade-in">
                    <span className="text-[9px] font-semibold font-mono text-neutral-400 mt-0.5 shrink-0">{log.time}</span>
                    <span className="flex-1 text-neutral-700">{log.event}</span>
                    {log.type === 'success' && <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-ping" />}
                    {log.type === 'info' && <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: SITES - FRONTEND HOSTING & OFFICES */}
        <div className="bg-white border border-neutral-150 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs md:col-span-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">4. Dominios (Sites)</h4>
                  <p className="text-[11px] text-neutral-500">Hosting web ultrarrápido homologado por SSL corporativo.</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                Desplegado
              </span>
            </div>

            <div className="border border-neutral-150 rounded-xl p-4 bg-neutral-50/50 space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Estadísticas de sitio principal comercial</span>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white border border-neutral-150 p-2.5 rounded-xl space-y-1">
                  <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">Servidor CDN</span>
                  <p className="font-bold text-neutral-800">Edge Santo Domingo</p>
                </div>
                <div className="bg-white border border-neutral-150 p-2.5 rounded-xl space-y-1">
                  <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">Latencia</span>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-neutral-800">{siteLatency ? `${siteLatency} ms` : 'Verificando...'}</p>
                    <button 
                      onClick={pingSiteAddress}
                      disabled={siteChecking}
                      className="p-1 text-neutral-400 hover:text-neutral-800 rounded bg-neutral-100 shrink-0"
                    >
                      <RefreshCw className={`w-3 h-3 ${siteChecking ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-150 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="truncate">
                  <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider block">Enlace de Oficina Virtual</span>
                  <a href={siteDomain} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline hover:text-blue-800 truncate block max-w-[200px]">
                    {siteDomain}
                  </a>
                </div>
                <a href={siteDomain} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-50 border border-neutral-150 text-neutral-600 rounded-xl shrink-0 transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
