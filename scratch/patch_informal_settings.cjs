const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/settings/TemplateSettingsPanel.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add informalMode state after footerNote state
const stateTarget = `  const [footerNote, setFooterNote] = useState(settings.footerNote);`;
const stateReplacement = `  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [informalMode, setInformalMode] = useState(!!settings.informalMode);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Add informalMode to handleFormSubmit
const submitTarget = `      templateStyle,
    };
    saveTemplateSettings(updated);`;
const submitReplacement = `      templateStyle,
      informalMode,
    };
    saveTemplateSettings(updated);`;
content = content.replace(submitTarget, submitReplacement);

// 3. Add informalMode toggle UI — before the "Guardar Perfil Fiscal" button
const uiTarget = `              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <Button type="submit" className="bg-black text-white hover:bg-neutral-800 text-xs font-semibold h-10 px-6">
                  Guardar Perfil Fiscal
                </Button>
              </div>`;
const uiReplacement = `              {/* MODO NEGOCIO INFORMAL */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-900">🧾 Modo Negocio Informal / Sin Declarar</p>
                    <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                      Actívalo si tu negocio <strong>no tiene RNC ni emite comprobantes fiscales DGII</strong>. Las facturas usarán numeración interna (Ej: FAC-003718) en lugar de B01/B02. El RNC de clientes y el campo ITBIS quedan opcionales.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={informalMode}
                      onChange={(e) => setInformalMode(e.target.checked)}
                      id="informal-mode-toggle"
                    />
                    <div className="w-10 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                {informalMode && (
                  <div className="bg-amber-100/60 rounded-lg p-2 text-[10px] text-amber-800 leading-relaxed font-medium">
                    ✅ Modo informal activo. Tus facturas y cotizaciones tendrán numeración interna (FAC-000001, COT-000001). Puedes igual colocar el nombre del negocio, teléfono y dirección arriba. Cuando te formalices, solo desactiva este modo y configura tu RNC.
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <Button type="submit" className="bg-black text-white hover:bg-neutral-800 text-xs font-semibold h-10 px-6">
                  Guardar Perfil Fiscal
                </Button>
              </div>`;
content = content.replace(uiTarget, uiReplacement);

fs.writeFileSync(file, content);
console.log('TemplateSettingsPanel updated with informalMode toggle.');
