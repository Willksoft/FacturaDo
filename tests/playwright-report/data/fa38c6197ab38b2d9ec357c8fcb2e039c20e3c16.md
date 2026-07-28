# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard\generated_dashboard_test_19.spec.ts >> Dashboard Module - Test Suite 19 >> UI responsiveness test 19 for dashboard
- Location: tests\e2e\dashboard\generated_dashboard_test_19.spec.ts:17:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*dashboard/
Received string:  "https://facturadord.com/"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    12 × locator resolved to <html lang="es-DO">…</html>
       - unexpected value "https://facturadord.com/"

```

```yaml
- banner:
  - img "FacturaDo"
  - text: FacturaDo
  - button "Menú principal"
- button "Promoción Especial FacturaDo - Tu software contable y de nómina en República Dominicana con NCF y TSS":
  - img "Promoción Especial FacturaDo - Tu software contable y de nómina en República Dominicana con NCF y TSS"
- heading "El Futuro de la facturación y nómina gratis" [level=1]
- paragraph: Digitaliza la emisión de facturas fiscales NCF, nómina empresarial Ley 16-92, inventarios activos, cajas y almacenes sin pagar licencias costosas ni mensualidades. ¡El software premium que tu negocio dominicano merece, libre para siempre!
- text: ✓ NCF Válido ✓ Nómina Ley 16-92 ✓ Reportes TSS & DGII ✓ Cajas & Almacenes
- button "Slide 1"
- button "Slide 2"
- button "Slide 3"
- button "Slide 4"
- button "Probar FacturaDo Ahora Gratis →"
- button "Instalar App Móvil / PC"
- img "FacturaDo Dashboard de Contabilidad, Nómina y NCF"
- text: Haz clic para ampliar vista 2,542,000+ Facturas Emitidas 10,500+ Negocios Activos 85% Ahorro de Tiempo 99.9% Uptime Sistema Migración sin Esfuerzo en 1 Clic
- heading "¿Vienes de WooCommerce, Shopify, Alegra o QuickBooks?" [level=2]
- paragraph: Transfiere automáticamente todo tu catálogo de productos, existencias de inventario, clientes con RNC y comprobantes NCF a FacturaDo sin perder datos ni digitar a mano.
- img "WooCommerce WordPress"
- heading "WooCommerce / WordPress" [level=3]:
  - link "WooCommerce / WordPress":
    - /url: https://woocommerce.com
- paragraph: Importa productos, SKU, precios regulares y de oferta, existencias de stock y categorías de tu tienda WordPress en formato CSV o Excel.
- text: E-Commerce Listo ✓
- link "woocommerce.com":
  - /url: https://woocommerce.com
- img "Shopify Store"
- heading "Shopify Store" [level=3]:
  - link "Shopify Store":
    - /url: https://www.shopify.com
- paragraph:
  - text: Reconoce la estructura nativa exportada de Shopify (
  - code: Title
  - text: ","
  - code: Variant SKU
  - text: ","
  - code: Variant Price
  - text: ) y la convierte en comprobantes NCF.
- text: Sincronización Total ✓
- link "shopify.com":
  - /url: https://www.shopify.com
- img "Alegra Dominicana"
- heading "Alegra República Dominicana" [level=3]:
  - link "Alegra República Dominicana":
    - /url: https://www.alegra.com/dominicana/
- paragraph: Migra de forma directa tu catálogo de ítems, clientes con RNC/Cédula y listas de precios exportadas de Alegra.
- text: Soporte Nativo RD ✓
- link "alegra.com/dominicana":
  - /url: https://www.alegra.com/dominicana/
- img "Cashflow Software"
- heading "Cashflow Software" [level=3]:
  - link "Cashflow Software":
    - /url: https://www.cashflow.do
- paragraph: Carga archivos exportados de Cashflow Dominicano con detección automática de RNCs, NCFs e inventarios.
- text: Formato Dominicano ✓
- link "cashflow.do":
  - /url: https://www.cashflow.do
- img "QuickBooks Intuit"
- heading "QuickBooks (Online / Desktop)" [level=3]:
  - link "QuickBooks (Online / Desktop)":
    - /url: https://quickbooks.intuit.com
- paragraph: Sube reportes CSV de Customers, Vendor List e Item List de QuickBooks sin perder referencias contables.
- text: Líder Mundial ✓
- link "quickbooks.intuit.com":
  - /url: https://quickbooks.intuit.com
- img "Odoo ERP"
- heading "Odoo ERP" [level=3]:
  - link "Odoo ERP":
    - /url: https://www.odoo.com
- paragraph: Mapeo instantáneo para exportaciones de Odoo ERP (partner name, internal reference, unit price, stock value).
- text: Open Source ERP ✓
- link "odoo.com":
  - /url: https://www.odoo.com
- img "Zoho Books CRM"
- heading "Zoho CRM & Books" [level=3]:
  - link "Zoho CRM & Books":
    - /url: https://www.zoho.com
- paragraph: Compatible con exportaciones de contactos, inventario y cuentas de Zoho Books y Zoho CRM.
- text: Sincronización CRM ✓
- link "zoho.com":
  - /url: https://www.zoho.com
- heading "Sage / Softland ERP" [level=3]:
  - link "Sage / Softland ERP":
    - /url: https://www.sage.com
- paragraph: Soporta plantillas empresariales de Sage 50 / Softland con desinfección automática de RNC y monedas.
- text: Grado Empresarial ✓
- link "sage.com":
  - /url: https://www.sage.com
- heading "Excel, CSV o XML Libre" [level=3]
- paragraph: Sube cualquier hoja de cálculo. Nuestro motor con inteligencia de sinónimos empareja tus columnas automáticamente.
- text: Plantillas Libre ✓ .csv / .xlsx / .xml
- heading "¿Listo para migrar tu negocio a FacturaDo?" [level=3]
- paragraph: Prueba nuestro Asistente Inteligente de Migración en 4 pasos con mapeo automático de columnas e inspección de RNCs en vivo.
- button "Probar Asistente de Migración"
- text: Poderosas Funcionalidades
- 'heading "Ecosistema Integral: Facturación, Nómina & R.H." [level=2]'
- paragraph: "Diseñado para simplificar la operación de tu negocio en la República Dominicana: Ley 16-92, TSS, DGII y Facturación NCF."
- text: "🇩🇴 Módulo Estrella: Nómina Empresarial & Recursos Humanos"
- heading "Cumplimiento Ley 16-92, TSS (SUIR) & Retenciones DGII" [level=3]
- paragraph: Todo lo que tu departamento de Recursos Humanos necesita para procesar salarios, generar contratos legales, imprimir comprobantes de pago e informar a la Tesorería de la Seguridad Social.
- button "Comenzar a Administrar Nómina →"
- text: Ficha 360° & Expediente Digital
- paragraph: Matriz de casillas fiscales independientes (TSS/ISR/INFOTEP), estatus migratorio, pasaportes y expedientes en PDF/JPG.
- text: Generador de Contratos & Cartas
- paragraph: Auto-generador de Contratos de Trabajo Ley 16-92 con cláusulas libres, Cartas de Despido/Renuncia y Certificaciones.
- text: Volantes Cheque (3 por página)
- paragraph: Impresión en lote con logo de empresa de recibos de pago en formato cheque bancario o tamaño carta.
- text: Exportador TXT Novedades TSS
- paragraph: Genera con 1 clic el archivo plano para la plataforma SUIR de la TSS filtrando personal exento o internacional.
- text: Nómina Manual Flex
- paragraph: Formulario de carga directa para ingresar montos arbitrarios de salarios, bonos y retroactivos libres.
- text: Auditor IA Copilot & Migración
- paragraph: Escaneo en tiempo real de pasaportes/visas por vencer en 60 días y alertas preventivas DGM.
- heading "Caja y Flujo de Efectivo" [level=3]
- paragraph: Lleva un control diario de aperturas, egresos, ventas en efectivo o tarjeta, y haz tus cuadres de caja sin errores.
- text: Cuadre rápido integrado
- heading "Inventario e Historial" [level=3]
- paragraph: Conoce las existencias exactas en tus almacenes, configura alertas de stock mínimo y recibe avisos automáticos de reposición.
- text: Alertas de stock mínimo
- heading "Multiplataforma Nube" [level=3]
- paragraph: Administra desde tu computadora de escritorio, tablet o celular en tiempo real con sincronización instantánea.
- text: Acceso ilimitado 24/7
- heading "Estadísticas y Reportes" [level=3]
- paragraph: Visualiza tus ingresos, egresos y márgenes netos de utilidad en gráficos claros para una toma de decisiones informada.
- text: Reportes detallados en vivo
- heading "Clientes y Proveedores" [level=3]
- paragraph: Centraliza la información de contactos, saldos pendientes y estados de cuenta para una gestión de cobros ágil.
- text: Base de datos de contactos
- heading "Comprobantes NCF DGII" [level=3]
- paragraph: Emisión legal de secuenciales B01, B02, B14 y B15 para la República Dominicana con exportación directa a 606 y 607.
- text: Normativa fiscal R.D. Novedades 2026 • FacturaDo Enterprise
- heading "El Módulo de Presupuestos y Operaciones Más Potente de la República Dominicana" [level=2]
- paragraph: Calcula costos dinámicos por área, volumen o jornadas, emite e-CF ante la DGII, gestiona la nómina con TSS/ISR Ley 16-92 y concilia tus bancos en tiempo real.
- button "Centro de Presupuestos"
- button "e-CF Electrónico & MSeller"
- button "Nómina TSS & Ley 16-92"
- button "Conciliación Bancaria OFX"
- text: Estimación Inteligente sin Fórmulas Manuales
- heading "Diseñado para Imprentas, Obras, Carpinterías, Rotulación y Servicios" [level=3]
- paragraph: Crea presupuestos precisos con costeo automático por m², m³, perímetros, horas hombre o fletes. Desglosa costos reales frente a márgenes de ganancia y convierte presupuestos aprobados en cotizaciones oficiales en 1 clic.
- text: Modo Multicálculo Área, Volumen, Perímetro, Días y Km Plantillas por Industria Modelos pre-diseñados por sector Carpetas de Proyectos Agrupa presupuestos de un trabajo Vistas Personalizadas Cliente, Interna y Producción
- button "Probar Centro de Presupuestos Gratis"
- button "Ver Guía en el Manual →"
- text: "PRES-2026-0001 v2 Aprobado Plancha PVC Celular 10mm (4x8ft) Alto 2.44m x Ancho 1.22m • Merma 8% RD$ 2,592.00 Monto Venta Instalación Exterior con Grúa 4 Horas • 2 Técnicos Certificados RD$ 3,800.00 Monto Venta Margen de Ganancia:"
- strong: 38.5%
- text: "TOTAL: RD$ 7,542.56 Para Emprendedores"
- heading "Diseñado para emprendedores dominicanos" [level=2]
- paragraph: No necesitas ser contador ni experto en tecnología. FacturaDo simplifica la facturación fiscal para que tú te enfoques en vender y hacer crecer tu negocio.
- heading "Enfócate en vender" [level=4]
- paragraph: La facturación se resuelve en segundos. Tú dedícate a tus clientes.
- heading "Sin curva de aprendizaje" [level=4]
- paragraph: Interfaz intuitiva que cualquier miembro de tu equipo domina al instante.
- heading "Decisiones con datos" [level=4]
- paragraph: Reportes de ventas, cuadre de caja y 606/607 listos para la DGII.
- heading "Soporte humano local" [level=4]
- paragraph: Asistencia en español por WhatsApp cuando lo necesites.
- button "Regístrate ahora"
- 'img "Beneficios para emprendedores: 100% Gratis, Registro en 2 mins, Acceso 24/7 y cero cuotas"'
- heading "Diseñado para todo tipo de comercio en R.D." [level=2]
- paragraph: FacturaDo es flexible y está adaptado para acomodar las necesidades comerciales locales.
- heading "Gastronomía" [level=3]
- list:
  - listitem: • Restaurantes y Pizzerías
  - listitem: • Cafeterías y Reposterías
  - listitem: • Bares y Foodtrucks Dominicanos
- button "Conocer más"
- heading "Comercios" [level=3]
- list:
  - listitem: • Tiendas de Ropa y Calzado
  - listitem: • Ferreterías y Constructoras
  - listitem: • Farmacias y Tiendas de Celulares
- button "Conocer más"
- heading "Servicios" [level=3]
- list:
  - listitem: • Consultorías Profesionales
  - listitem: • Clínicas y Salones de Estética
  - listitem: • Talleres mecánicos y Courier
- button "Conocer más"
- heading "Distribución / Retail" [level=3]
- list:
  - listitem: • Colmados y Minimarkets
  - listitem: • Repuestos e Importadoras
  - listitem: • Mayoristas y Suplidores
- button "Conocer más"
- text: Sin Suscripción • 100% Libre
- heading "FacturaDo es 100% Gratis para Todos" [level=2]
- paragraph: Creemos en el desarrollo de las pymes dominicanas. Utiliza todos los módulos premium sin trucos de cobro ni límites de facturación.
- text: ✔ Todo Incluido de Por Vida
- heading "¿Cómo es posible?" [level=3]
- paragraph: Nuestra meta es facilitar la digitalización contable en República Dominicana. Automatiza tu facturación fiscal, controla tus inventarios y genera tus reportes 606/607 sin pagar licencias de software complejas.
- text: ✔ Terminales de caja (POS) totalmente ilimitados ✔ Emisión integral de NCF (Crédito Fiscal, Consumo, etc.) ✔ Módulos analíticos completos de compras y ventas ✔ Generador automático de reportes formato 606 y 607 RD$ 0 Cero mensualidades • Cero costos ocultos
- button "Crear Cuenta Gratis Ahora"
- paragraph: Únete a cientos de comerciantes dominicanos que ya confían en nosotros
- heading "Historias de Éxito Locales" [level=2]
- paragraph: Miles de comerciantes dominicanos respaldan la velocidad de FacturaDo para automatizar su administración.
- img "Carlos Rodriguez"
- text: Carlos Rodríguez Ferretería El Canal SRL, Santo Domingo
- paragraph: "\"Antes perdía preciadas horas tabulando las compras de mis proveedores. FacturaDo nos ayudó a generar los reportes mensuales de la DGII en un solo clic.\""
- img "Ana Herrera"
- text: Ana M. Herrera Salón & Estética Glamour, Santiago
- paragraph: "\"Tener el POS en la tablet nos libera de cables molestos. El cliente recibe su recibo por correo al instante y nosotros cuadramos cajas sin fallar.\""
- img "Joel Almonte"
- text: Joel Almonte Súper Colmado El Sol, La Romana
- paragraph: "\"En República Dominicana es mandatorio cumplir con la validación de RNC y cédulas de clientes de forma segura. FacturaDo lo hace automático.\""
- text: Migración e Importación Inteligente
- heading "Importa tus Productos, Clientes, Facturas y Cotizaciones desde Cualquier Sistema" [level=2]
- paragraph:
  - text: ¿Vienes de
  - strong: Alegra, QuickBooks, Cashflow, Odoo, Zoho, Sage, Softland
  - text: o archivos Excel personalizados? Nuestro motor lee directamente archivos
  - code: .xlsx
  - text: ","
  - code: .csv
  - text: ","
  - code: .xml
  - text: o
  - code: .txt
  - text: sin reestructurar datos.
- text: "1"
- heading "Compatibilidad Total" [level=3]
- paragraph:
  - text: "Reconoce encabezados en español e inglés:"
  - emphasis: RNC, Cédula, Razón Social, SKU, Precio de Venta, Tax ID, Qty On Hand
  - text: y más.
- text: "2"
- heading "Desinfección de RNCs" [level=3]
- paragraph: Limpia guiones, puntos y espacios automáticamente. Clasifica entre Persona Física (11 dígitos) y Empresa (9 dígitos).
- text: "3"
- heading "Monedas y Precios" [level=3]
- paragraph:
  - text: Detecta precios con símbolos monetarios (
  - code: RD$ 1,500.00
  - text: ➔
  - code: "1500"
  - text: ) y costos unitarios sin margen de error.
- text: "4"
- heading "Vista Previa & Algoritmo Fuzzy" [level=3]
- paragraph: Verifica las columnas mapeadas y la vista previa de datos antes de importar miles de filas a tu base de datos PostgreSQL.
- text: Sistemas desarrollados en RD o enfocados en RD. SistemasHS.com. FacturandoRD - Sistema de Facturación e Inventario. Xaplu Sistema de Facturación. Factura Dominicana GTI. Gestiono ERP - Sistema de Facturación e Ecommerce. SFE - Sistema de Facturación Electrónica RD. SISTEMAS DE FACTURACION EGSOFTWARE. Plataformas modernas de facturación electrónica (e-CF). Kuadre ERP — Facturación, inventario, POS y contabilidad. DOMI POS — POS y facturación electrónica para comercios. Metoo Program — Facturación, inventario y contabilidad integrados. Pacioli ERP — ERP dominicano con e-CF, inventario y contabilidad. Oniux — Facturación, POS e inventario en la nube. eFIT ERP — ERP completo con módulos contables y nómina. Terminal X POS — Muy usado en tiendas, restaurantes y car wash. Proveedores e-CF (para integrar con tu propio sistema). ECF3 — API y gateway para facturación electrónica. EF2 — API certificada para e-CF DGII. DGMax — Plataforma de emisión y validación e-CF. Sistemas internacionales que operan en RD. Alegra - Facturación Electrónica & Contabilidad — Muy popular entre pequeñas empresas. Odoo (con módulos adaptados para RD). SAP Business One. Microsoft Dynamics 365. QuickBooks Online (con adaptaciones locales).
- heading "Alternativa Inteligente" [level=2]
- heading "¿Cómo nos comparamos con el resto?" [level=3]
- paragraph: Sabemos que hay muchas opciones como Alegra, Odoo, QuickBooks y otros ERP locales como SistemasHS o Kuadre. Mira por qué FacturaDo es la mejor alternativa gratuita y de código abierto en República Dominicana.
- table:
  - rowgroup:
    - row "Característica FacturaDo Nuestra App Alegra Odoo QuickBooks Sistemas Locales (SistemasHS, Kuadre, Xaplu, etc.)":
      - columnheader "Característica"
      - columnheader "FacturaDo Nuestra App"
      - columnheader "Alegra"
      - columnheader "Odoo"
      - columnheader "QuickBooks"
      - columnheader "Sistemas Locales (SistemasHS, Kuadre, Xaplu, etc.)"
  - rowgroup:
    - row "Precio Mensual GRATIS $29 - $119 / mes $24.90 / mes por usr $15 - $100 / mes $50 - $150 / mes":
      - cell "Precio Mensual"
      - cell "GRATIS"
      - cell "$29 - $119 / mes"
      - cell "$24.90 / mes por usr"
      - cell "$15 - $100 / mes"
      - cell "$50 - $150 / mes"
    - row "Facturación Electrónica Sí (Integrado) Sí Con Partner Mediante API Externa Varía por sistema":
      - cell "Facturación Electrónica"
      - cell "Sí (Integrado)"
      - cell "Sí"
      - cell "Con Partner"
      - cell "Mediante API Externa"
      - cell "Varía por sistema"
    - row "Punto de Venta (POS) Sí Sí (Costo Extra) Sí Solo en US Sí":
      - cell "Punto de Venta (POS)"
      - cell "Sí"
      - cell "Sí (Costo Extra)"
      - cell "Sí"
      - cell "Solo en US"
      - cell "Sí"
    - row "Inventario Sí Sí Sí Planes caros Sí":
      - cell "Inventario"
      - cell "Sí"
      - cell "Sí"
      - cell "Sí"
      - cell "Planes caros"
      - cell "Sí"
    - row "Contabilidad Básica / 606 & 607 Sí Sí Sí Depende":
      - cell "Contabilidad"
      - cell "Básica / 606 & 607"
      - cell "Sí"
      - cell "Sí"
      - cell "Sí"
      - cell "Depende"
    - row "Nómina Próximamente No (RD) Sí No (RD) A veces":
      - cell "Nómina"
      - cell "Próximamente"
      - cell "No (RD)"
      - cell "Sí"
      - cell "No (RD)"
      - cell "A veces"
    - row "API Integración Sí Sí Sí Sí Limitada":
      - cell "API Integración"
      - cell "Sí"
      - cell "Sí"
      - cell "Sí"
      - cell "Sí"
      - cell "Limitada"
    - row "Multiempresa Sí Plan Avanzado Sí Sí Costo Extra":
      - cell "Multiempresa"
      - cell "Sí"
      - cell "Plan Avanzado"
      - cell "Sí"
      - cell "Sí"
      - cell "Costo Extra"
- text: Respuestas Rápidas
- heading "Preguntas frecuentes sobre FacturaDo" [level=2]
- paragraph: Resolvemos las principales dudas sobre la integración fiscal dominicana y la facturación digital.
- button "¿Qué es FacturaDo y cómo funciona para declarar a la DGII? −"
- text: FacturaDo es una plataforma web y móvil para control administrative y fiscal. Le permite registrar sus facturas y registrar los tipos de comprobantes fiscales (B01, B02, B14, B15), para luego exportar directamente los archivos de texto requeridos por los formatos 606, 607 y 608 de la DGII Dominicana sin errores de numeración.
- button "¿Requiere conexión a internet activa para facturar en el POS? +"
- button "¿Es seguro guardar mi información contable e inventarios en la nube? +"
- text: Casos de Éxito
- heading "Comercios que confían en FacturaDo" [level=2]
- paragraph: No tome solo nuestra palabra. Vea lo que dueños de negocios dominicanos opinan de nuestra plataforma.
- paragraph: "\"Poder facturar y generar los reportes de la DGII en un solo clic me ahorra días de trabajo y pago de igualas complejas. Mi negocio está más organizado que nunca.\""
- text: C
- paragraph: Carlos Méndez
- paragraph: Ferretería Méndez, Santiago
- paragraph: "\"El módulo de POS es rapidísimo y el cuadre de caja al final del día ahora es exacto. Saber que todo está guardado en la nube me da mucha tranquilidad.\""
- text: M
- paragraph: María Rosario
- paragraph: Boutique MR, Distrito Nacional
- paragraph: "\"Antes gastaba miles de pesos en sistemas lentos de escritorio. FacturaDo no solo es más moderno y fácil de usar, ¡sino que no pago licencias!\""
- text: J
- paragraph: José Pimentel
- paragraph: Super Colmado José, La Romana
- heading "Únete hoy a la comunidad de FacturaDo" [level=2]
- paragraph: Eleve el control financiero de su negocio dominicano con la plataforma de mayor crecimiento local.
- button "Registrar mi cuenta gratis"
- contentinfo:
  - img
  - paragraph: Simplificando las operaciones tributarias dominicanas.
  - text: Producto Facturación Clásica
  - button "Centro de Ayuda"
  - text: Reporterías DGII (606, 607) Puntos de Ventas (Cafés/Retail) Legal
  - button "Términos y Condiciones"
  - link "/terminos":
    - /url: /terminos
  - button "Políticas de Uso y Privacidad"
  - link "/privacidad":
    - /url: /privacidad
  - text: © 2026 FacturaDo. Sincronizado fiscalmente para República Dominicana. Todos los derechos reservados.
- region "Notifications alt+T"
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '../helpers/auth';
  3  | 
  4  | test.describe('Dashboard Module - Test Suite 19', () => {
  5  |   test('Smoke test 19 for dashboard', async ({ adminPage }) => {
  6  |     // Navigate to a section
  7  |     await adminPage.goto('/dashboard');
  8  |     await expect(adminPage).toHaveURL(/.*dashboard/);
  9  |     
  10 |     // Check if sidebar is visible
  11 |     const sidebar = adminPage.locator('aside');
  12 |     if (await sidebar.isVisible()) {
  13 |        await expect(sidebar).toBeVisible();
  14 |     }
  15 |   });
  16 | 
  17 |   test('UI responsiveness test 19 for dashboard', async ({ adminPage }) => {
  18 |     await adminPage.setViewportSize({ width: 375, height: 812 }); // Mobile
  19 |     await adminPage.goto('/dashboard');
  20 |     // Ensure the hamburger menu or mobile layout works
> 21 |     await expect(adminPage).toHaveURL(/.*dashboard/);
     |                             ^ Error: expect(page).toHaveURL(expected) failed
  22 |   });
  23 | });
  24 | 
```