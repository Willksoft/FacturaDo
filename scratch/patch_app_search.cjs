const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add the state variable
if (!content.includes('const [headerSearchFocused, setHeaderSearchFocused]')) {
  content = content.replace(
    "const [headerSearch, setHeaderSearch] = useState('');",
    "const [headerSearch, setHeaderSearch] = useState('');\n  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);"
  );
}

// Add the event listeners to the input
if (!content.includes('onFocus={() => setHeaderSearchFocused(true)}')) {
  content = content.replace(
    'onChange={(e) => handleHeaderSearch(e.target.value)}',
    'onChange={(e) => handleHeaderSearch(e.target.value)}\n                onFocus={() => setHeaderSearchFocused(true)}\n                onBlur={() => setTimeout(() => setHeaderSearchFocused(false), 200)}'
  );
}

// Add the UI for empty suggestions
const suggestionsUI = `
              {/* Header Search Suggestions (Empty State) */}
              {headerSearchFocused && !headerSearch.trim() && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setHeaderSearchFocused(false)} />
                  <div id="header-search-suggestions" className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 p-2 font-sans text-xs">
                    <div className="px-2 py-1 mb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Sugerencias de Búsqueda</div>
                    <div className="divide-y divide-neutral-100">
                      {[
                        { title: 'Crear nueva factura', action: () => setCurrentTab('pos'), type: 'Acción' },
                        { title: 'Ver mis clientes', action: () => setCurrentTab('clientes'), type: 'Módulo' },
                        { title: 'Reporte 606 (DGII)', action: () => setCurrentTab('rep-606'), type: 'Fiscal' },
                        { title: 'Inventario de productos', action: () => setCurrentTab('inventario'), type: 'Módulo' },
                      ].map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            sug.action();
                            setHeaderSearchFocused(false);
                          }}
                          className="w-full text-left p-2 hover:bg-neutral-50 flex items-center justify-between text-[11.5px] transition-colors rounded-lg border-0 bg-transparent cursor-pointer"
                        >
                          <span className="font-semibold text-neutral-800">{sug.title}</span>
                          <span className="text-[9px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">{sug.type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
`;

if (!content.includes('Header Search Suggestions (Empty State)')) {
  content = content.replace(
    '{/* Header Search Results dropdown */}',
    suggestionsUI.trim() + '\n\n              {/* Header Search Results dropdown */}'
  );
}

fs.writeFileSync(file, content);
console.log("Updated App.tsx search suggestions");
