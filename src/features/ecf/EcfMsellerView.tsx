import React, { useState } from 'react';
import { 
  Upload, 
  Key, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  Sparkles, 
  Building, 
  Lock, 
  FileCode,
  Sliders,
  Search,
  Filter,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { EcfDocument, uploadCertificateP12, generateMsellerApiKey, simulateEcfTestDocument, signXmlWithCertificate } from '../../lib/msellerApi';

export const EcfMsellerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certificacion' | 'emitidos' | 'recibidos' | 'firmar-xml' | 'config'>('certificacion');
  const [environment, setEnvironment] = useState<'Prueba | TesteCF' | 'Producción | eCF'>('Prueba | TesteCF');

  // ---------------------------------------------------------------------------
  // ESTADO PASO A PASO CERTIFICACIÓN CerteCF
  // ---------------------------------------------------------------------------
  const [certStep, setCertStep] = useState(1);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certPassword, setCertPassword] = useState('');
  const [certUploadedSuccess, setCertUploadedSuccess] = useState(false);
  const [apiKeyGenerated, setApiKeyGenerated] = useState('dd3bb871-fe7f-4204-9540-5abf51c382b9');

  // ---------------------------------------------------------------------------
  // ESTADO DOCUMENTOS EMITIDOS
  // ---------------------------------------------------------------------------
  const [emitidosList, setEmitidosList] = useState<EcfDocument[]>([
    {
      id: 'doc-101',
      ecf: 'E310000004912',
      tipoDocumento: '31 - Factura de Crédito Fiscal Electrónica',
      fecha: '2026-07-27',
      actualizado: '18:42:10',
      total: 45000,
      status: 'Aceptado',
      trackId: 'TRK-9842014',
      environment: 'Prueba | TesteCF'
    },
    {
      id: 'doc-102',
      ecf: 'E320000001048',
      tipoDocumento: '32 - Factura de Consumo Electrónica',
      fecha: '2026-07-27',
      actualizado: '19:10:05',
      total: 12500,
      status: 'Aceptado',
      trackId: 'TRK-9842015',
      environment: 'Prueba | TesteCF'
    }
  ]);

  const [filterEcf, setFilterEcf] = useState('');
  const [filterTipoDoc, setFilterTipoDoc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTrackId, setFilterTrackId] = useState('');

  // ---------------------------------------------------------------------------
  // ESTADO DOCUMENTOS RECIBIDOS
  // ---------------------------------------------------------------------------
  const [recibidosList, setRecibidosList] = useState<Array<any>>([
    {
      id: 'rec-1',
      ecf: 'E310000094120',
      rncEmisor: '1-30-49210-9',
      nombreEmisor: 'Suplidores Industriales S.R.L.',
      fecha: '2026-07-25',
      tipoEcf: '31 - Crédito Fiscal',
      total: 89000,
      status: 'Aceptado Comercial'
    }
  ]);

  // ---------------------------------------------------------------------------
  // ESTADO FIRMADOR XML
  // ---------------------------------------------------------------------------
  const [rawXml, setRawXml] = useState<string>(
    `<Documento>\n  <Encabezado>\n    <Emisor>\n      <RNCEmisor>131000001</RNCEmisor>\n      <RazónSocial>FACTURADO S.R.L.</RazónSocial>\n    </Emisor>\n    <eCF>E310000000001</eCF>\n  </Encabezado>\n</Documento>`
  );
  const [signedXmlResult, setSignedXmlResult] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // HANDLERS CERTIFICACIÓN
  // ---------------------------------------------------------------------------
  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFile) {
      alert('Por favor selecciona un archivo .p12');
      return;
    }
    const res = await uploadCertificateP12(certFile, certPassword);
    if (res.success) {
      setCertUploadedSuccess(true);
      setCertStep(2);
      alert(res.message);
    }
  };

  const handleGenerateKey = async () => {
    const res = await generateMsellerApiKey();
    if (res.success) {
      setApiKeyGenerated(res.apiKey);
      alert('¡Nueva API Key CerteCF generada con éxito!');
    }
  };

  const handleSimulateEcfTest = async (type: 'E31' | 'E32' | 'E44' | 'E45') => {
    const doc = await simulateEcfTestDocument(type);
    setEmitidosList((prev) => [doc, ...prev]);
    alert(`¡Documento de Prueba ${doc.ecf} (${doc.tipoDocumento}) enviado a CerteCF DGII! Estatus: ACEPTADO.`);
  };

  const handleSignXml = async () => {
    const res = await signXmlWithCertificate(rawXml);
    if (res.success) {
      setSignedXmlResult(res.signedXml);
      alert('¡XML firmado digitalmente con éxito!');
    }
  };

  // Filtrado de emitidos
  const filteredEmitidos = emitidosList.filter((doc) => {
    if (filterEcf && !doc.ecf.toLowerCase().includes(filterEcf.toLowerCase())) return false;
    if (filterTrackId && !doc.trackId.toLowerCase().includes(filterTrackId.toLowerCase())) return false;
    if (filterStatus && doc.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-left text-slate-900 pb-12">
      
      {/* Header Estilo eCF-MSeller */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-400 rounded-full text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Integración Oficial eCF-MSeller & DGII
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Facturación Electrónica e-CF & Firma Digital (.p12)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Emisión legal de comprobantes electrónicos E31, E32, E44, E45 firmados con tu certificado digital `.p12`.
          </p>
        </div>

        {/* Entorno Selector */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col gap-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Entorno Activo:</span>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as any)}
            className="bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
          >
            <option value="Prueba | TesteCF">🟢 Prueba | TesteCF (Certificación)</option>
            <option value="Producción | eCF">🚀 Producción | eCF (Oficial DGII)</option>
          </select>
        </div>
      </div>

      {/* Sub-Navegación de eCF */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('certificacion')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'certificacion' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Certificación DGII (CerteCF)
        </button>

        <button
          onClick={() => setActiveTab('emitidos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'emitidos' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-500" /> Documentos Emitidos
        </button>

        <button
          onClick={() => setActiveTab('recibidos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'recibidos' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4 text-sky-500" /> Documentos Recibidos
        </button>

        <button
          onClick={() => setActiveTab('firmar-xml')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'firmar-xml' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCode className="w-4 h-4 text-amber-500" /> Firmar XML
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'config' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4 text-purple-500" /> API Keys & Config
        </button>
      </div>

      {/* PESTAÑA 1: ASISTENTE DE CERTIFICACIÓN CerteCF */}
      {activeTab === 'certificacion' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Certificación DGII (CerteCF)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Siga estos pasos sencillos para completar la homologación y certificación e-CF ante la DGII.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            {/* Paso 01: Cargar certificado digital */}
            <div className={`p-6 rounded-3xl border transition-all ${certStep === 1 ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  01
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Cargar certificado digital (.p12)</h3>
                    <p className="text-xs text-slate-500">
                      Suba su archivo `.p12` para firmar documentos e-CF en el entorno de certificación (CerteCF).
                    </p>
                  </div>

                  <form onSubmit={handleUploadCertificate} className="space-y-3">
                    <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-2 bg-white transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-emerald-600 mx-auto" />
                      <div className="font-bold text-xs text-slate-900">Arrastre su certificado .p12 aquí</div>
                      <div className="text-[11px] text-slate-400">ó busque el archivo en su equipo</div>
                      <input
                        type="file"
                        accept=".p12,.pfx"
                        onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="p12-file-input"
                      />
                      <label
                        htmlFor="p12-file-input"
                        className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                      >
                        Buscar Certificado
                      </label>
                      {certFile && <div className="text-xs font-bold text-emerald-700">✓ Seleccionado: {certFile.name}</div>}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        placeholder="Contraseña del archivo .p12"
                        value={certPassword}
                        onChange={(e) => setCertPassword(e.target.value)}
                        className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                      <button
                        type="submit"
                        className="px-6 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Guardar Certificado
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Paso 02: Crear API Key */}
            <div className={`p-6 rounded-3xl border transition-all ${certStep === 2 ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  02
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Crear API Key CerteCF</h3>
                    <p className="text-xs text-slate-500">
                      Genera la llave que se usará como `x-api-key` en la integración con MSeller.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      readOnly
                      value={apiKeyGenerated}
                      className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                    />
                    <button
                      onClick={handleGenerateKey}
                      className="px-5 h-10 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Generar Nueva Key
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 03: Pruebas de Simulación e-CF */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  03
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Pruebas de Simulación e-CF</h3>
                    <p className="text-xs text-slate-500">
                      Envía un documento por cada tipo e-CF requerido por la DGII para aprobar la postulación.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleSimulateEcfTest('E31')}
                      className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <span className="font-bold text-xs block text-slate-900">E31 Crédito Fiscal</span>
                      <span className="text-[10px] text-slate-500">Enviar Prueba</span>
                    </button>

                    <button
                      onClick={() => handleSimulateEcfTest('E32')}
                      className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <span className="font-bold text-xs block text-slate-900">E32 Consumo</span>
                      <span className="text-[10px] text-slate-500">Enviar Prueba</span>
                    </button>

                    <button
                      onClick={() => handleSimulateEcfTest('E44')}
                      className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <span className="font-bold text-xs block text-slate-900">E44 Especial</span>
                      <span className="text-[10px] text-slate-500">Enviar Prueba</span>
                    </button>

                    <button
                      onClick={() => handleSimulateEcfTest('E45')}
                      className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <span className="font-bold text-xs block text-slate-900">E45 Gubernamental</span>
                      <span className="text-[10px] text-slate-500">Enviar Prueba</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PESTAÑA 2: MONITOR DE DOCUMENTOS EMITIDOS (Diseño exacto de la pantalla enviada) */}
      {activeTab === 'emitidos' && (
        <div className="space-y-6">
          {/* Card de Filtros */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-slate-900 text-sm">Filtros de Documentos</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">eCF</label>
                <input
                  type="text"
                  placeholder="Buscar eCF (ej. E31...)"
                  value={filterEcf}
                  onChange={(e) => setFilterEcf(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Internal Track ID</label>
                <input
                  type="text"
                  placeholder="TRK-..."
                  value={filterTrackId}
                  onChange={(e) => setFilterTrackId(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-200 rounded-xl"
                >
                  <option value="">Todos los Status</option>
                  <option value="Aceptado">Aceptado</option>
                  <option value="Rechazado">Rechazado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Entorno</label>
                <input
                  type="text"
                  readOnly
                  value={environment}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setFilterEcf('');
                  setFilterTrackId('');
                  setFilterStatus('');
                }}
                className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Restaurar filtro
              </button>
            </div>
          </div>

          {/* Tabla de Documentos Emitidos */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-slate-900 text-sm">Documentos Emitidos ({filteredEmitidos.length})</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('Lista actualizada.')}
                  className="px-3 py-1.5 border border-emerald-500 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ↻ Actualizar
                </button>
                <button
                  onClick={() => alert('Exportando archivo CSV...')}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ↓ Exportar CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3">ECF</th>
                    <th className="p-3">Tipo Documento</th>
                    <th className="p-3">Creado</th>
                    <th className="p-3">Actualizado</th>
                    <th className="p-3 text-right">Monto (DOP)</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {filteredEmitidos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-sans">
                        No hay datos disponibles en este filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredEmitidos.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-indigo-700">{doc.ecf}</td>
                        <td className="p-3 font-sans">{doc.tipoDocumento}</td>
                        <td className="p-3">{doc.fecha}</td>
                        <td className="p-3">{doc.actualizado}</td>
                        <td className="p-3 text-right font-bold text-slate-900">RD$ {doc.total.toLocaleString('es-DO')}</td>
                        <td className="p-3 text-center font-sans">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-3 text-center font-sans">
                          <button
                            onClick={() => alert(`Visualizando Track ID ${doc.trackId}...`)}
                            className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Ver e-CF
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: DOCUMENTOS RECIBIDOS */}
      {activeTab === 'recibidos' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-slate-900 text-sm">Filtros de Documentos Recibidos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input type="text" placeholder="eCF" className="h-9 px-3 border border-slate-200 rounded-xl" />
              <input type="text" placeholder="RNC Emisor" className="h-9 px-3 border border-slate-200 rounded-xl" />
              <input type="text" placeholder="Tipo de Documento" className="h-9 px-3 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-slate-900 text-sm">Documentos Recibidos de Proveedores</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                    <th className="p-3">ECF</th>
                    <th className="p-3">RNC Emisor</th>
                    <th className="p-3">Nombre Emisor</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {recibidosList.map((r) => (
                    <tr key={r.id}>
                      <td className="p-3 font-bold text-indigo-700">{r.ecf}</td>
                      <td className="p-3">{r.rncEmisor}</td>
                      <td className="p-3 font-sans">{r.nombreEmisor}</td>
                      <td className="p-3">{r.fecha}</td>
                      <td className="p-3 text-right font-bold">RD$ {r.total.toLocaleString('es-DO')}</td>
                      <td className="p-3 text-center font-sans">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: FIRMADOR DE DOCUMENTOS XML */}
      {activeTab === 'firmar-xml' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-6 h-6 text-amber-600" />
              Firmar Documento XML con Certificado Activo (.p12)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Herramienta para firmar digitalmente cualquier estructura XML (ECF, RFCE, ARECF u otros) usando la llave privada.
            </p>
          </div>

          <div className="space-y-3">
            <label className="font-medium text-slate-700 block text-xs">Contenido XML a Firmar:</label>
            <textarea
              rows={8}
              value={rawXml}
              onChange={(e) => setRawXml(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800"
            />
          </div>

          <button
            onClick={handleSignXml}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> Firmar XML con Certificado Digital Active
          </button>

          {signedXmlResult && (
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs">XML Firmado Digitalmente (Resultado):</h4>
              <textarea
                readOnly
                rows={8}
                value={signedXmlResult}
                className="w-full p-3 font-mono text-xs bg-slate-50 text-slate-800 rounded-2xl border border-slate-200"
              />
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 5: CONFIGURACIÓN & API KEYS */}
      {activeTab === 'config' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-slate-900">Configuración de Credenciales MSeller</h2>
            <p className="text-xs text-slate-500 mt-1">
              Claves de autenticación y conexión con el backend de MSeller.
            </p>
          </div>

          <div className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">MSeller x-api-key (Producción / Test):</label>
              <input
                type="text"
                value={apiKeyGenerated}
                onChange={(e) => setApiKeyGenerated(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <span className="font-bold text-emerald-900 block">Estatus del Certificado Digital:</span>
              <span className="text-xs text-emerald-800">
                {certUploadedSuccess ? '✓ Certificado .p12 Activo y Encriptado en Almacenamiento Seguro' : '⚠️ No se ha cargado un certificado .p12 aún.'}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
