import re

file_path = r"c:\Users\MANUEL GRAPHICS\Downloads\facturado\src\App.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = r"\{\/\*\s*Menu Grid \/ List\s*\*\/\}\s*<div className=\"grid grid-cols-2 gap-2 text-xs\">"
end_marker = r"<\/div>\s*\{\/\*\s*13\. CONFIGURACIÓN"

replacement = """{/* Menu Grid / List */}
              <div className="flex flex-col space-y-1 mt-2 pb-8">
                {/* 1. Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    checkAndNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                    currentTab === 'dashboard'
                      ? 'bg-neutral-950 text-white font-bold shadow-xs'
                      : 'text-neutral-600 active:bg-neutral-100 font-medium'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Panel Principal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    checkAndNavigate('estado-negocio');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                    currentTab === 'estado-negocio'
                      ? 'bg-neutral-950 text-white font-bold shadow-xs'
                      : 'text-neutral-600 active:bg-neutral-100 font-medium'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 shrink-0" />
                  <span>Estado de mi negocio</span>
                </button>

                {sidebarCategories.map((cat, catIdx) => {
                  const isOpen = !!openCategories[cat.title];
                  return (
                    <div key={catIdx} className="space-y-1 mt-2">
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.title)}
                        className="w-full text-left text-[13px] font-extrabold text-neutral-500 uppercase tracking-wider pl-3 pr-2 py-3 flex items-center justify-between gap-1.5 border-b border-neutral-100 mb-1 active:bg-neutral-50 transition-colors cursor-pointer bg-transparent border-0"
                      >
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4 shrink-0 text-neutral-400" />
                          <span className="font-bold tracking-wider">{cat.title}</span>
                        </div>
                        {isOpen ? <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="space-y-1 px-1">
                          {cat.items.map((item) => {
                            const mappedTab = item.id;
                            const isActive = currentTab === mappedTab;
                            const IconComp = item.icon;

                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  checkAndNavigate(mappedTab as TabType);
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                                  isActive
                                    ? 'bg-neutral-950 text-white font-bold shadow-xs'
                                    : 'text-neutral-600 active:bg-neutral-100 font-medium'
                                }`}
                              >
                                <IconComp className="w-5 h-5 shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="space-y-1 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      checkAndNavigate('configuracion');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center py-3 rounded-xl transition-all text-left text-[14px] px-3 space-x-3 ${
                      currentTab === 'configuracion'
                        ? 'bg-neutral-950 text-white font-bold shadow-xs'
                        : 'text-neutral-600 active:bg-neutral-100 font-medium'
                    }`}
                  >
                    <Settings className="w-5 h-5 shrink-0" />
                    <span>Configuración del Sistema</span>
                  </button>
                </div>
              </div>
              {/*"""

# Finding the full end of the grid logic
# It ends right after button 13.
end_marker_real = r"\{\/\*\s*13\. CONFIGURACIÓN.*?<\/button>\s*<\/div>"

match = re.search(start_marker + r".*?" + end_marker_real, content, re.DOTALL)
if match:
    new_content = content[:match.start()] + replacement + content[match.end():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Mobile menu replaced successfully!")
else:
    print("Markers not found.")
