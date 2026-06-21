const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Import UserManual
const lazyTarget = `const SupportSection = React.lazy(() => import('./features/help/SupportSection'));`;
const lazyReplacement = `const SupportSection = React.lazy(() => import('./features/help/SupportSection'));
const UserManual = React.lazy(() => import('./features/help/UserManual'));`;
if(content.includes(lazyTarget)) content = content.replace(lazyTarget, lazyReplacement);

// 2. Import BookOpen
const importTarget = `  FileText,
  AlertTriangle,
  TrendingDown,`;
const importReplacement = `  FileText,
  AlertTriangle,
  TrendingDown,
  BookOpen,`;
if(content.includes(importTarget)) content = content.replace(importTarget, importReplacement);

// 3. Add to TabType
const tabTypeTarget = `  | 'cfg-audit'
  | 'cfg-seguridad'
  | 'cfg-soporte'
  | 'estado-negocio';`;
const tabTypeReplacement = `  | 'cfg-audit'
  | 'cfg-seguridad'
  | 'cfg-soporte'
  | 'estado-negocio'
  | 'user-manual';`;
if(content.includes(tabTypeTarget)) content = content.replace(tabTypeTarget, tabTypeReplacement);

// 4. Add to sidebarCategories
const sidebarTarget = `  {
    title: "Configuración",`;
const sidebarReplacement = `  {
    title: "Ayuda y Soporte",
    icon: BookOpen,
    items: [
      { id: 'user-manual', name: 'Manual de Usuario', icon: BookOpen },
    ]
  },
  {
    title: "Configuración",`;
if(content.includes(sidebarTarget)) content = content.replace(sidebarTarget, sidebarReplacement);

// 5. Render inside Main Content
const renderTarget = `          {currentTab === 'dashboard' && (`;
const renderReplacement = `          {currentTab === 'user-manual' && <UserManual />}
          
          {currentTab === 'dashboard' && (`;
if(content.includes(renderTarget)) content = content.replace(renderTarget, renderReplacement);

fs.writeFileSync(file, content);
console.log('App.tsx patched successfully for UserManual!');
