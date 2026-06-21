const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/auth/LandingAndAuth.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Import UserManual
const importTarget = `import HelpManualView from '../help/HelpManualView';`;
const importReplacement = `import HelpManualView from '../help/HelpManualView';
import UserManual from '../help/UserManual';`;
if (content.includes(importTarget)) {
  content = content.replace(importTarget, importReplacement);
}

// 2. Add view === 'ayuda'
const renderTarget = `      {/* 4. MODALS FOR TERMS AND PRIVACY */}`;
const renderReplacement = `      {/* 3.5 AYUDA / MANUAL DE USUARIO */}
      {view === 'ayuda' && (
        <div className="flex flex-col min-h-screen bg-white animate-fade-in">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
                <div className="hidden sm:block">
                  <LogoFacturaDo className="h-8 w-auto" />
                </div>
                <div className="block sm:hidden flex items-center gap-2">
                  <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8 shrink-0 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">FacturaDo</span>
                </div>
              </div>
              <button
                onClick={() => setView('landing')}
                className="whitespace-nowrap px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Volver al inicio
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            <UserManual />
          </div>
        </div>
      )}

      {/* 4. MODALS FOR TERMS AND PRIVACY */}`;
if (content.includes(renderTarget)) {
  content = content.replace(renderTarget, renderReplacement);
}

fs.writeFileSync(file, content);
console.log('LandingAndAuth.tsx patched successfully for UserManual!');
