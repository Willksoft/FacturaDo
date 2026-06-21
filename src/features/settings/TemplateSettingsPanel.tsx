import React, { useState } from 'react';
import { insforge } from '../../lib/insforge';
import { TemplateSettings, NcfSequence, BankAccountItem } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Sparkles, Palette, ShieldCheck, Mail, Building, Laptop, HeartHandshake, Upload, RefreshCw, Receipt } from 'lucide-react';
import { ORIGINAL_PRESETS } from './TemplateStylePicker';


interface TemplateSettingsPanelProps {
  settings: TemplateSettings;
  saveTemplateSettings: (s: TemplateSettings) => void;
  ncfSequences?: NcfSequence[];
  updateNcfSequences?: (seqs: NcfSequence[]) => void;
}

export default function TemplateSettingsPanel({
  settings,
  saveTemplateSettings,
  ncfSequences,
  updateNcfSequences,
}: TemplateSettingsPanelProps) {
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [businessRNC, setBusinessRNC] = useState(settings.businessRNC);
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone);
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail);
  const [businessAddress, setBusinessAddress] = useState(settings.businessAddress);
  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [informalMode, setInformalMode] = useState(!!settings.informalMode);
  const [showProductPhotos, setShowProductPhotos] = useState(!!settings.showProductPhotos);

  const [ncfB01, setNcfB01] = useState(ncfSequences?.find(s => s.type === 'B01')?.currentNumber || 1);
  const [ncfB02, setNcfB02] = useState(ncfSequences?.find(s => s.type === 'B02')?.currentNumber || 1);
  const [ncfB14, setNcfB14] = useState(ncfSequences?.find(s => s.type === 'B14')?.currentNumber || 1);
  const [ncfB15, setNcfB15] = useState(ncfSequences?.find(s => s.type === 'B15')?.currentNumber || 1);

  const handleNcfSubmit = () => {
    if (updateNcfSequences) {
      updateNcfSequences([
        { type: 'B01', currentNumber: ncfB01, name: 'Crédito Fiscal', prefix: 'B01', suffixLength: 8 },
        { type: 'B02', currentNumber: ncfB02, name: 'Consumo / Consumidor Final', prefix: 'B02', suffixLength: 8 },
        { type: 'B14', currentNumber: ncfB14, name: 'Regímenes Especiales', prefix: 'B14', suffixLength: 8 },
        { type: 'B15', currentNumber: ncfB15, name: 'Gubernamental', prefix: 'B15', suffixLength: 8 },
      ]);
      setLocalFeedback('¡Secuencias de NCF actualizadas!');
      setTimeout(() => setLocalFeedback(null), 4000);
    }
  };
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [pageSize, setPageSize] = useState<'Letter' | 'Thermal'>(settings.pageSize || 'Letter');
  const [templateStyle, setTemplateStyle] = useState(settings.templateStyle || 'ejecutiva');

  // Styling presets
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#000000');
  const [accentColor, setAccentColor] = useState(settings.accentColor || '#171717');

  const [showBankAccountsOnQuote, setShowBankAccountsOnQuote] = useState(!!settings.showBankAccountsOnQuote);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>(() => {
    if (settings.bankAccounts && settings.bankAccounts.length > 0) {
      return settings.bankAccounts;
    }
    if (settings.bankAccountRef) {
      return [{
        bank: settings.bankAccountBank || 'Banco Popular Dominicano',
        number: settings.bankAccountRef,
        type: settings.bankAccountType || 'Corriente',
        holder: settings.bankAccountName || settings.businessName || '',
        currency: settings.bankAccountCurrency || 'DOP'
      }];
    }
    return [];
  });

  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  const applyColorPreset = (primary: string, accent: string) => {
    setPrimaryColor(primary);
    setAccentColor(accent);
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Robust file signature and representation safeguard
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
      
      if (!validTypes.includes(file.type) || !fileExt || !validExtensions.includes(fileExt)) {
        alert("Por seguridad, solo se permiten formatos de imagen estándar (PNG, JPG, JPEG, WEBP, GIF, SVG).");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen excede el límite de 2MB. Elija una imagen más pequeña para optimizar el rendimiento.");
        return;
      }

      setUploadingLogo(true);
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const uniqueKey = `${Date.now()}_${cleanName}`;
        const bucket = insforge.storage.from("company_logos");
        const { data, error } = await bucket.upload(uniqueKey, file);
        
        if (error) {
          throw error;
        }
        
        const publicUrl = bucket.getPublicUrl(uniqueKey);
        setLogoUrl(publicUrl);
      } catch (err) {
        console.warn("Storage upload failed, falling back to base64 encoding:", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setLogoUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TemplateSettings = {
      businessName,
      businessRNC,
      businessPhone,
      businessEmail,
      businessAddress,
      logoUrl,
      primaryColor,
      accentColor,
      footerNote,
      pageSize,
      bankAccounts,
      showBankAccountsOnQuote,
      bankAccountBank: bankAccounts[0]?.bank || '',
      bankAccountRef: bankAccounts[0]?.number || '',
      bankAccountType: bankAccounts[0]?.type || 'Corriente',
      bankAccountName: bankAccounts[0]?.holder || businessName,
      bankAccountCurrency: showBankAccountsOnQuote ? 'true' : (bankAccounts[0]?.currency || 'false'),
      templateStyle,
    };
    saveTemplateSettings(updated);
    setLocalFeedback('¡Perfiles de facturación, cuentas bancarias, estilos y plantillas almacenados de forma segura!');
    setTimeout(() => setLocalFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="company-settings">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-heading flex items-center gap-2">
            <Building className="w-6 h-6 text-indigo-600" />
            Datos de la Empresa
          </h2>
          <p className="text-xs text-neutral-500">
            Configure la información fiscal, números de contacto y comprobantes de la empresa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
          <CardHeader className="bg-neutral-50 border-b border-neutral-100 py-4">
            <CardTitle className="text-sm font-semibold text-neutral-900">Perfil Fiscal e Información Base</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {localFeedback && (
              <div className="p-3 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-250 font-medium">
                {localFeedback}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biz-name" className="text-xs font-semibold">Nombre Comercial o Razón Social</Label>
                  <Input id="biz-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ej. Mi Empresa S.R.L." className="text-xs h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-rnc" className="text-xs font-semibold">RNC o Cédula Comercial</Label>
                  <Input id="biz-rnc" value={businessRNC} onChange={(e) => setBusinessRNC(e.target.value)} placeholder="Ej. 130123456" className="text-xs h-10 font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-phone" className="text-xs font-semibold">Teléfono(s) de Contacto</Label>
                  <Input id="biz-phone" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} placeholder="Ej. (809) 555-1234" className="text-xs h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-email" className="text-xs font-semibold">Correo Electrónico (Ventas/Facturación)</Label>
                  <Input id="biz-email" type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="ventas@miempresa.com" className="text-xs h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-address" className="text-xs font-semibold">Dirección Física (Local o Sucursal Principal)</Label>
                <Input id="biz-address" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Av. Principal #123, Distrito Nacional" className="text-xs h-10" />
              </div>
              
              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <Button type="submit" className="bg-black text-white hover:bg-neutral-800 text-xs font-semibold h-10 px-6">
                  Guardar Perfil Fiscal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* NCF SECTION */}
        <Card className="border-neutral-200 shadow-none rounded-xl bg-white overflow-hidden">
          <CardHeader className="bg-neutral-50 border-b border-neutral-100 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-neutral-900">Secuencias Fiscales (Comprobantes DGII)</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">Controla las secuencias de inicio para cada tipo de comprobante.</CardDescription>
            </div>
            <Receipt className="w-5 h-5 text-neutral-400" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 bg-neutral-50 p-4 rounded-lg border border-neutral-150">
                <Label className="text-xs font-semibold">Crédito Fiscal (B01)</Label>
                <Input type="number" min="1" value={ncfB01} onChange={(e) => setNcfB01(Number(e.target.value) || 1)} className="text-xs h-9 font-mono bg-white" />
              </div>
              <div className="space-y-2 bg-neutral-50 p-4 rounded-lg border border-neutral-150">
                <Label className="text-xs font-semibold">Consumidor Final (B02)</Label>
                <Input type="number" min="1" value={ncfB02} onChange={(e) => setNcfB02(Number(e.target.value) || 1)} className="text-xs h-9 font-mono bg-white" />
              </div>
              <div className="space-y-2 bg-neutral-50 p-4 rounded-lg border border-neutral-150">
                <Label className="text-xs font-semibold">Reg. Especiales (B14)</Label>
                <Input type="number" min="1" value={ncfB14} onChange={(e) => setNcfB14(Number(e.target.value) || 1)} className="text-xs h-9 font-mono bg-white" />
              </div>
              <div className="space-y-2 bg-neutral-50 p-4 rounded-lg border border-neutral-150">
                <Label className="text-xs font-semibold">Gubernamental (B15)</Label>
                <Input type="number" min="1" value={ncfB15} onChange={(e) => setNcfB15(Number(e.target.value) || 1)} className="text-xs h-9 font-mono bg-white" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNcfSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-10 px-6">
                Sincronizar Secuencias
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

