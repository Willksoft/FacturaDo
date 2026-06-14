<div align="center">
  <img src="public/facturaDonuevologo_favicon.svg" alt="FacturaDo Logo" width="120" height="120" />
  <h1>FacturaDo</h1>
  <p><strong>El ERP & Sistema de Facturación Web Definitivo (PWA)</strong></p>
</div>

---

**FacturaDo** es una plataforma web moderna e integral (Progressive Web App - PWA) diseñada para la gestión empresarial, facturación, control de inventario y contabilidad. Está especialmente optimizada y adaptada con reportes (606, 607, etc.) y normativas para facilitar la administración financiera de negocios.

## 🚀 Características Principales

- **📊 Dashboard Interactivo:** Visualización en tiempo real del estado de tu negocio, flujo de caja, ingresos, gastos y analíticas avanzadas.
- **🧾 Facturación y Cotizaciones:** Creador de facturas dinámico con autoguardado, soporte para múltiples formatos, impuestos y cálculo de subtotales al vuelo.
- **🛒 Punto de Venta (POS):** Interfaz rápida y táctil para cajeros, ideal para ventas de mostrador y minimarkets.
- **📦 Control de Inventario:** Gestión de almacenes, múltiples sucursales, ajustes de inventario, y control de stock mínimo.
- **👥 Gestión de Clientes y Suplidores:** Historial de cuentas por cobrar/pagar, estados de cuenta y directorios completos.
- **🏦 Finanzas y Bancos:** Control de cajas chicas, cuentas bancarias, órdenes de compra y control estricto de gastos.
- **📈 Reportes Especializados (DGII):** Generación automática de reportes impositivos (606, 607, 608, 609) listos para exportar en TXT o Excel.
- **⚙️ PWA Optimizada:** Aplicación web ultra rápida con Lazy Loading, sin dependencias pesadas de escritorio. Instalable directamente en tu PC o Móvil desde el navegador.

## 🛠 Stack Tecnológico

El proyecto está construido bajo una arquitectura moderna *Serverless* y *Frontend-driven*:

- **Frontend:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) + TypeScript
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Enrutamiento:** React Router DOM (con *Code Splitting* y *React.lazy*)
- **Backend as a Service (BaaS):** [InsForge](https://insforge.dev/) (Basado en Supabase/PostgreSQL) para Autenticación, Base de Datos con *Row Level Security* (RLS) y Almacenamiento (Storage).

## 📥 Instalación Local y Desarrollo

**Prerequisitos:** 
- [Node.js](https://nodejs.org/) (v18 o superior)
- Una cuenta y proyecto configurado en **InsForge**.

1. **Clonar el Repositorio e instalar dependencias:**
   ```bash
   git clone https://github.com/Willksoft/FacturaDo.git
   cd FacturaDo
   npm install
   ```

2. **Configuración de Variables de Entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de InsForge:
   ```env
   VITE_INSFORGE_URL=https://tu-proyecto.region.insforge.app
   VITE_INSFORGE_ANON_KEY=tu_anon_key
   ```

3. **Ejecutar en modo Desarrollo:**
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible en `http://localhost:5173`.*

4. **Construir para Producción:**
   ```bash
   npm run build
   ```
   *Los archivos compilados, optimizados y listos para producción se generarán en la carpeta `dist/`.*

## 🔒 Seguridad (Middleware & RLS)

FacturaDo **no requiere un middleware tradicional de servidor**. Toda la seguridad de las rutas está garantizada del lado del cliente a través de React (Redirecciones basadas en `isLoggedIn`), y la seguridad crítica de los datos se maneja a nivel de Base de Datos utilizando **Row Level Security (RLS)** en el ecosistema de InsForge/Supabase.

---
*© 2026 FacturaDo. Todos los derechos reservados.*
