const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/settings/TemplateSettingsPanel.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add state for showProductPhotos
const stateTarget = `  const [informalMode, setInformalMode] = useState(!!settings.informalMode);`;
const stateReplacement = `  const [informalMode, setInformalMode] = useState(!!settings.informalMode);
  const [showProductPhotos, setShowProductPhotos] = useState(!!settings.showProductPhotos);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Add to handleFormSubmit
const submitTarget = `      informalMode,
      templateStyle,`;
const submitReplacement = `      informalMode,
      showProductPhotos,
      templateStyle,`;
if (content.includes('informalMode,')) {
    content = content.replace(submitTarget, submitReplacement);
} else {
    // If not found, add it after templateStyle
    const altTarget = `      templateStyle,
    };`;
    const altReplacement = `      templateStyle,
      showProductPhotos,
    };`;
    content = content.replace(altTarget, altReplacement);
}

// 3. Add toggle UI after informalMode toggle
const uiTarget = `                  <p className="text-[10px] text-amber-700/80 mt-1 leading-tight">Desactiva el requerimiento de RNC y NCF. Las facturas usarán una numeración secuencial interna (Ej. FAC-000001).</p>
                </div>
              </div>`;
const uiReplacement = `                  <p className="text-[10px] text-amber-700/80 mt-1 leading-tight">Desactiva el requerimiento de RNC y NCF. Las facturas usarán una numeración secuencial interna (Ej. FAC-000001).</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                <div className="flex items-center h-5">
                  <input
                    id="show-product-photos"
                    type="checkbox"
                    checked={showProductPhotos}
                    onChange={(e) => setShowProductPhotos(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-neutral-300 rounded focus:ring-indigo-600"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="show-product-photos" className="text-xs font-bold text-neutral-900 cursor-pointer">
                    Mostrar Fotos de Productos en PDFs
                  </Label>
                  <p className="text-[10px] text-neutral-500 mt-1 leading-tight">Si está activo, las facturas y cotizaciones incluirán una pequeña miniatura de la foto del producto junto a su descripción.</p>
                </div>
              </div>`;
content = content.replace(uiTarget, uiReplacement);

fs.writeFileSync(file, content);
console.log('TemplateSettingsPanel.tsx patched with showProductPhotos');
