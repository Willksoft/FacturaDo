# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: business-flows\01-pos-sale-flow.spec.ts >> Core Business: POS Sale Flow >> Complete cash sale successfully
- Location: tests\e2e\business-flows\01-pos-sale-flow.spec.ts:4:3

# Error details

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('input[type="number"]').first()

```

# Page snapshot

```yaml
- generic [ref=f2e2]:
  - generic [ref=f2e4]:
    - banner [ref=f2e5]:
      - generic [ref=f2e6]:
        - navigation [ref=f2e21]:
          - button "Blog" [ref=f2e22] [cursor=pointer]
          - link "Funcionalidades" [ref=f2e23] [cursor=pointer]:
            - /url: "#funcionalidades"
          - link "Opiniones" [ref=f2e24] [cursor=pointer]:
            - /url: "#testimonios"
          - button "Centro de Ayuda" [ref=f2e25] [cursor=pointer]
          - link "Preguntas Frecuentes" [ref=f2e26] [cursor=pointer]:
            - /url: "#faq"
        - generic [ref=f2e27]:
          - button "Iniciar Sesión" [ref=f2e28] [cursor=pointer]
          - button "Registrarse Gratis" [ref=f2e29] [cursor=pointer]
    - button [ref=f2e31] [cursor=pointer]:
      - img "Promoción Especial FacturaDo - Tu software contable y de nómina en República Dominicana con NCF y TSS" [ref=f2e32]
    - generic [ref=f2e37]:
      - generic [ref=f2e38]:
        - generic [ref=f2e40]:
          - heading "Nómina Empresarial & R.H. 100% ley 16-92, tss e ir-3" [level=1] [ref=f2e41]
          - paragraph [ref=f2e42]: Gestión 360° de plantilla laboral, generación automática de contratos de trabajo, cálculo de deducciones AFP/ARS, retenciones ISR DGII, prestaciones laborales (cesantía/preaviso) e impresión en lote de volantes de pago formato cheque.
          - generic [ref=f2e43]:
            - generic [ref=f2e44]:
              - generic [ref=f2e45]: ✓
              - generic [ref=f2e46]: Ley 16-92
            - generic [ref=f2e47]:
              - generic [ref=f2e48]: ✓
              - generic [ref=f2e49]: Reporte TXT TSS
            - generic [ref=f2e50]:
              - generic [ref=f2e51]: ✓
              - generic [ref=f2e52]: IR-3 & IR-13 DGII
            - generic [ref=f2e53]:
              - generic [ref=f2e54]: ✓
              - generic [ref=f2e55]: Volantes Cheque 3xPágina
            - generic [ref=f2e56]:
              - generic [ref=f2e57]: ✓
              - generic [ref=f2e58]: Contratos PDF
        - generic [ref=f2e59]:
          - button "Slide 1" [ref=f2e60]
          - button "Slide 2" [ref=f2e61]
          - button "Slide 3" [ref=f2e62]
          - button "Slide 4" [ref=f2e63]
        - generic [ref=f2e64]:
          - button "Probar FacturaDo Ahora Gratis →" [ref=f2e65] [cursor=pointer]:
            - generic [ref=f2e66]: Probar FacturaDo Ahora Gratis
            - generic [ref=f2e67]: →
          - button "Instalar App Móvil / PC" [ref=f2e68] [cursor=pointer]
      - generic [ref=f2e74] [cursor=pointer]:
        - img "FacturaDo Dashboard de Contabilidad, Nómina y NCF" [ref=f2e75]
        - generic [ref=f2e76]: Haz clic para ampliar vista
    - generic [ref=f2e79]:
      - generic [ref=f2e80]:
        - generic [ref=f2e81]: 2,542,000+
        - generic [ref=f2e83]: Facturas Emitidas
      - generic [ref=f2e84]:
        - generic [ref=f2e85]: 10,500+
        - generic [ref=f2e87]: Negocios Activos
      - generic [ref=f2e88]:
        - generic [ref=f2e89]: 85%
        - generic [ref=f2e91]: Ahorro de Tiempo
      - generic [ref=f2e92]:
        - generic [ref=f2e93]: 99.9%
        - generic [ref=f2e95]: Uptime Sistema
    - generic [ref=f2e97]:
      - generic [ref=f2e98]:
        - generic [ref=f2e99]: Migración sin Esfuerzo en 1 Clic
        - heading "¿Vienes de WooCommerce, Shopify, Alegra o QuickBooks?" [level=2] [ref=f2e102]
        - paragraph [ref=f2e103]: Transfiere automáticamente todo tu catálogo de productos, existencias de inventario, clientes con RNC y comprobantes NCF a FacturaDo sin perder datos ni digitar a mano.
      - generic [ref=f2e104]:
        - generic [ref=f2e105]:
          - generic [ref=f2e106]:
            - img "WooCommerce WordPress" [ref=f2e108]
            - heading [level=3] [ref=f2e109]:
              - link "WooCommerce / WordPress" [ref=f2e110] [cursor=pointer]:
                - /url: https://woocommerce.com
            - paragraph [ref=f2e115]: Importa productos, SKU, precios regulares y de oferta, existencias de stock y categorías de tu tienda WordPress en formato CSV o Excel.
          - generic [ref=f2e116]:
            - generic [ref=f2e117]: E-Commerce Listo ✓
            - link "woocommerce.com" [ref=f2e118] [cursor=pointer]:
              - /url: https://woocommerce.com
        - generic [ref=f2e119]:
          - generic [ref=f2e120]:
            - img "Shopify Store" [ref=f2e122]
            - heading [level=3] [ref=f2e123]:
              - link "Shopify Store" [ref=f2e124] [cursor=pointer]:
                - /url: https://www.shopify.com
            - paragraph [ref=f2e129]:
              - text: Reconoce la estructura nativa exportada de Shopify (
              - code [ref=f2e130]: Title
              - text: ","
              - code [ref=f2e131]: Variant SKU
              - text: ","
              - code [ref=f2e132]: Variant Price
              - text: ) y la convierte en comprobantes NCF.
          - generic [ref=f2e133]:
            - generic [ref=f2e134]: Sincronización Total ✓
            - link "shopify.com" [ref=f2e135] [cursor=pointer]:
              - /url: https://www.shopify.com
        - generic [ref=f2e136]:
          - generic [ref=f2e137]:
            - img "Alegra Dominicana" [ref=f2e139]
            - heading [level=3] [ref=f2e140]:
              - link "Alegra República Dominicana" [ref=f2e141] [cursor=pointer]:
                - /url: https://www.alegra.com/dominicana/
            - paragraph [ref=f2e146]: Migra de forma directa tu catálogo de ítems, clientes con RNC/Cédula y listas de precios exportadas de Alegra.
          - generic [ref=f2e147]:
            - generic [ref=f2e148]: Soporte Nativo RD ✓
            - link "alegra.com/dominicana" [ref=f2e149] [cursor=pointer]:
              - /url: https://www.alegra.com/dominicana/
        - generic [ref=f2e150]:
          - generic [ref=f2e151]:
            - img "Cashflow Software" [ref=f2e153]
            - heading [level=3] [ref=f2e154]:
              - link "Cashflow Software" [ref=f2e155] [cursor=pointer]:
                - /url: https://www.cashflow.do
            - paragraph [ref=f2e160]: Carga archivos exportados de Cashflow Dominicano con detección automática de RNCs, NCFs e inventarios.
          - generic [ref=f2e161]:
            - generic [ref=f2e162]: Formato Dominicano ✓
            - link "cashflow.do" [ref=f2e163] [cursor=pointer]:
              - /url: https://www.cashflow.do
        - generic [ref=f2e164]:
          - generic [ref=f2e165]:
            - img "QuickBooks Intuit" [ref=f2e167]
            - heading [level=3] [ref=f2e168]:
              - link "QuickBooks (Online / Desktop)" [ref=f2e169] [cursor=pointer]:
                - /url: https://quickbooks.intuit.com
            - paragraph [ref=f2e174]: Sube reportes CSV de Customers, Vendor List e Item List de QuickBooks sin perder referencias contables.
          - generic [ref=f2e175]:
            - generic [ref=f2e176]: Líder Mundial ✓
            - link "quickbooks.intuit.com" [ref=f2e177] [cursor=pointer]:
              - /url: https://quickbooks.intuit.com
        - generic [ref=f2e178]:
          - generic [ref=f2e179]:
            - img "Odoo ERP" [ref=f2e181]
            - heading [level=3] [ref=f2e182]:
              - link "Odoo ERP" [ref=f2e183] [cursor=pointer]:
                - /url: https://www.odoo.com
            - paragraph [ref=f2e188]: Mapeo instantáneo para exportaciones de Odoo ERP (partner name, internal reference, unit price, stock value).
          - generic [ref=f2e189]:
            - generic [ref=f2e190]: Open Source ERP ✓
            - link "odoo.com" [ref=f2e191] [cursor=pointer]:
              - /url: https://www.odoo.com
        - generic [ref=f2e192]:
          - generic [ref=f2e193]:
            - img "Zoho Books CRM" [ref=f2e195]
            - heading [level=3] [ref=f2e196]:
              - link "Zoho CRM & Books" [ref=f2e197] [cursor=pointer]:
                - /url: https://www.zoho.com
            - paragraph [ref=f2e202]: Compatible con exportaciones de contactos, inventario y cuentas de Zoho Books y Zoho CRM.
          - generic [ref=f2e203]:
            - generic [ref=f2e204]: Sincronización CRM ✓
            - link "zoho.com" [ref=f2e205] [cursor=pointer]:
              - /url: https://www.zoho.com
        - generic [ref=f2e206]:
          - generic [ref=f2e207]:
            - heading [level=3] [ref=f2e211]:
              - link "Sage / Softland ERP" [ref=f2e212] [cursor=pointer]:
                - /url: https://www.sage.com
            - paragraph [ref=f2e217]: Soporta plantillas empresariales de Sage 50 / Softland con desinfección automática de RNC y monedas.
          - generic [ref=f2e218]:
            - generic [ref=f2e219]: Grado Empresarial ✓
            - link "sage.com" [ref=f2e220] [cursor=pointer]:
              - /url: https://www.sage.com
        - generic [ref=f2e221]:
          - generic [ref=f2e222]:
            - heading "Excel, CSV o XML Libre" [level=3] [ref=f2e228]
            - paragraph [ref=f2e229]: Sube cualquier hoja de cálculo. Nuestro motor con inteligencia de sinónimos empareja tus columnas automáticamente.
          - generic [ref=f2e230]:
            - generic [ref=f2e231]: Plantillas Libre ✓
            - generic [ref=f2e232]: .csv / .xlsx / .xml
        - generic [ref=f2e234]:
          - generic [ref=f2e235]:
            - heading "¿Listo para migrar tu negocio a FacturaDo?" [level=3] [ref=f2e236]
            - paragraph [ref=f2e237]: Prueba nuestro Asistente Inteligente de Migración en 4 pasos con mapeo automático de columnas e inspección de RNCs en vivo.
          - button "Probar Asistente de Migración" [ref=f2e238] [cursor=pointer]
    - generic [ref=f2e242]:
      - generic [ref=f2e243]:
        - generic [ref=f2e244]: Poderosas Funcionalidades
        - 'heading "Ecosistema Integral: Facturación, Nómina & R.H." [level=2] [ref=f2e245]'
        - paragraph [ref=f2e246]: "Diseñado para simplificar la operación de tu negocio en la República Dominicana: Ley 16-92, TSS, DGII y Facturación NCF."
      - generic [ref=f2e247]:
        - generic [ref=f2e249]:
          - generic [ref=f2e250]:
            - text: "🇩🇴 Módulo Estrella: Nómina Empresarial & Recursos Humanos"
            - heading "Cumplimiento Ley 16-92, TSS (SUIR) & Retenciones DGII" [level=3] [ref=f2e251]
            - paragraph [ref=f2e252]: Todo lo que tu departamento de Recursos Humanos necesita para procesar salarios, generar contratos legales, imprimir comprobantes de pago e informar a la Tesorería de la Seguridad Social.
          - button "Comenzar a Administrar Nómina →" [ref=f2e253] [cursor=pointer]
        - generic [ref=f2e254]:
          - generic [ref=f2e255]:
            - generic [ref=f2e256]: Ficha 360° & Expediente Digital
            - paragraph [ref=f2e262]: Matriz de casillas fiscales independientes (TSS/ISR/INFOTEP), estatus migratorio, pasaportes y expedientes en PDF/JPG.
          - generic [ref=f2e263]:
            - generic [ref=f2e264]: Generador de Contratos & Cartas
            - paragraph [ref=f2e268]: Auto-generador de Contratos de Trabajo Ley 16-92 con cláusulas libres, Cartas de Despido/Renuncia y Certificaciones.
          - generic [ref=f2e269]:
            - generic [ref=f2e270]: Volantes Cheque (3 por página)
            - paragraph [ref=f2e275]: Impresión en lote con logo de empresa de recibos de pago en formato cheque bancario o tamaño carta.
          - generic [ref=f2e276]:
            - generic [ref=f2e277]: Exportador TXT Novedades TSS
            - paragraph [ref=f2e281]: Genera con 1 clic el archivo plano para la plataforma SUIR de la TSS filtrando personal exento o internacional.
          - generic [ref=f2e282]:
            - generic [ref=f2e283]: Nómina Manual Flex
            - paragraph [ref=f2e286]: Formulario de carga directa para ingresar montos arbitrarios de salarios, bonos y retroactivos libres.
          - generic [ref=f2e287]:
            - generic [ref=f2e288]: Auditor IA Copilot & Migración
            - paragraph [ref=f2e292]: Escaneo en tiempo real de pasaportes/visas por vencer en 60 días y alertas preventivas DGM.
      - generic [ref=f2e293]:
        - generic [ref=f2e294]:
          - generic [ref=f2e295]:
            - heading "Caja y Flujo de Efectivo" [level=3] [ref=f2e300]
            - paragraph [ref=f2e301]: Lleva un control diario de aperturas, egresos, ventas en efectivo o tarjeta, y haz tus cuadres de caja sin errores.
          - generic [ref=f2e302]: Cuadre rápido integrado
        - generic [ref=f2e303]:
          - generic [ref=f2e304]:
            - heading "Inventario e Historial" [level=3] [ref=f2e308]
            - paragraph [ref=f2e309]: Conoce las existencias exactas en tus almacenes, configura alertas de stock mínimo y recibe avisos automáticos de reposición.
          - generic [ref=f2e310]: Alertas de stock mínimo
        - generic [ref=f2e311]:
          - generic [ref=f2e312]:
            - heading "Multiplataforma Nube" [level=3] [ref=f2e316]
            - paragraph [ref=f2e317]: Administra desde tu computadora de escritorio, tablet o celular en tiempo real con sincronización instantánea.
          - generic [ref=f2e318]: Acceso ilimitado 24/7
        - generic [ref=f2e319]:
          - generic [ref=f2e320]:
            - heading "Estadísticas y Reportes" [level=3] [ref=f2e326]
            - paragraph [ref=f2e327]: Visualiza tus ingresos, egresos y márgenes netos de utilidad en gráficos claros para una toma de decisiones informada.
          - generic [ref=f2e328]: Reportes detallados en vivo
        - generic [ref=f2e329]:
          - generic [ref=f2e330]:
            - heading "Clientes y Proveedores" [level=3] [ref=f2e337]
            - paragraph [ref=f2e338]: Centraliza la información de contactos, saldos pendientes y estados de cuenta para una gestión de cobros ágil.
          - generic [ref=f2e339]: Base de datos de contactos
        - generic [ref=f2e340]:
          - generic [ref=f2e341]:
            - heading "Comprobantes NCF DGII" [level=3] [ref=f2e346]
            - paragraph [ref=f2e347]: Emisión legal de secuenciales B01, B02, B14 y B15 para la República Dominicana con exportación directa a 606 y 607.
          - generic [ref=f2e348]: Normativa fiscal R.D.
    - generic [ref=f2e350]:
      - generic [ref=f2e351]:
        - generic [ref=f2e352]: Novedades 2026 • FacturaDo Enterprise
        - heading "El Módulo de Presupuestos y Operaciones Más Potente de la República Dominicana" [level=2] [ref=f2e356]
        - paragraph [ref=f2e357]: Calcula costos dinámicos por área, volumen o jornadas, emite e-CF ante la DGII, gestiona la nómina con TSS/ISR Ley 16-92 y concilia tus bancos en tiempo real.
      - generic [ref=f2e359]:
        - button "Centro de Presupuestos" [ref=f2e360] [cursor=pointer]
        - button "e-CF Electrónico & MSeller" [ref=f2e363] [cursor=pointer]
        - button "Nómina TSS & Ley 16-92" [ref=f2e367] [cursor=pointer]
        - button "Conciliación Bancaria OFX" [ref=f2e373] [cursor=pointer]
      - generic [ref=f2e380]:
        - generic [ref=f2e381]:
          - generic [ref=f2e382]: Estimación Inteligente sin Fórmulas Manuales
          - heading "Diseñado para Imprentas, Obras, Carpinterías, Rotulación y Servicios" [level=3] [ref=f2e385]
          - paragraph [ref=f2e386]: Crea presupuestos precisos con costeo automático por m², m³, perímetros, horas hombre o fletes. Desglosa costos reales frente a márgenes de ganancia y convierte presupuestos aprobados en cotizaciones oficiales en 1 clic.
          - generic [ref=f2e387]:
            - generic [ref=f2e392]:
              - generic [ref=f2e393]: Modo Multicálculo
              - text: Área, Volumen, Perímetro, Días y Km
            - generic [ref=f2e398]:
              - generic [ref=f2e399]: Plantillas por Industria
              - text: Modelos pre-diseñados por sector
            - generic [ref=f2e404]:
              - generic [ref=f2e405]: Carpetas de Proyectos
              - text: Agrupa presupuestos de un trabajo
            - generic [ref=f2e410]:
              - generic [ref=f2e411]: Vistas Personalizadas
              - text: Cliente, Interna y Producción
          - generic [ref=f2e412]:
            - button "Probar Centro de Presupuestos Gratis" [ref=f2e413] [cursor=pointer]
            - button "Ver Guía en el Manual →" [ref=f2e414] [cursor=pointer]
        - generic [ref=f2e415]:
          - generic [ref=f2e416]:
            - generic [ref=f2e417]: PRES-2026-0001 v2
            - generic [ref=f2e422]: Aprobado
          - generic [ref=f2e423]:
            - generic [ref=f2e424]:
              - generic [ref=f2e425]:
                - generic [ref=f2e426]: Plancha PVC Celular 10mm (4x8ft)
                - generic [ref=f2e427]: Alto 2.44m x Ancho 1.22m • Merma 8%
              - generic [ref=f2e428]:
                - generic [ref=f2e429]: RD$ 2,592.00
                - generic [ref=f2e430]: Monto Venta
            - generic [ref=f2e431]:
              - generic [ref=f2e432]:
                - generic [ref=f2e433]: Instalación Exterior con Grúa
                - generic [ref=f2e434]: 4 Horas • 2 Técnicos Certificados
              - generic [ref=f2e435]:
                - generic [ref=f2e436]: RD$ 3,800.00
                - generic [ref=f2e437]: Monto Venta
          - generic [ref=f2e438]:
            - generic [ref=f2e439]:
              - text: "Margen de Ganancia:"
              - strong [ref=f2e440]: 38.5%
            - generic [ref=f2e441]: "TOTAL: RD$ 7,542.56"
    - generic [ref=f2e446]:
      - generic [ref=f2e447]:
        - generic [ref=f2e448]:
          - generic [ref=f2e449]: Para Emprendedores
          - heading "Diseñado para emprendedores dominicanos" [level=2] [ref=f2e453]
          - paragraph [ref=f2e454]: No necesitas ser contador ni experto en tecnología. FacturaDo simplifica la facturación fiscal para que tú te enfoques en vender y hacer crecer tu negocio.
        - generic [ref=f2e455]:
          - generic [ref=f2e462]:
            - heading "Enfócate en vender" [level=4] [ref=f2e463]
            - paragraph [ref=f2e464]: La facturación se resuelve en segundos. Tú dedícate a tus clientes.
          - generic [ref=f2e469]:
            - heading "Sin curva de aprendizaje" [level=4] [ref=f2e470]
            - paragraph [ref=f2e471]: Interfaz intuitiva que cualquier miembro de tu equipo domina al instante.
          - generic [ref=f2e476]:
            - heading "Decisiones con datos" [level=4] [ref=f2e477]
            - paragraph [ref=f2e478]: Reportes de ventas, cuadre de caja y 606/607 listos para la DGII.
          - generic [ref=f2e483]:
            - heading "Soporte humano local" [level=4] [ref=f2e484]
            - paragraph [ref=f2e485]: Asistencia en español por WhatsApp cuando lo necesites.
        - button "Regístrate ahora" [ref=f2e486] [cursor=pointer]
      - 'img "Beneficios para emprendedores: 100% Gratis, Registro en 2 mins, Acceso 24/7 y cero cuotas" [ref=f2e493]'
    - generic [ref=f2e495]:
      - generic [ref=f2e496]:
        - heading "Diseñado para todo tipo de comercio en R.D." [level=2] [ref=f2e497]
        - paragraph [ref=f2e498]: FacturaDo es flexible y está adaptado para acomodar las necesidades comerciales locales.
      - generic [ref=f2e499]:
        - generic [ref=f2e500]:
          - generic [ref=f2e501]:
            - heading "Gastronomía" [level=3] [ref=f2e502]
            - list [ref=f2e503]:
              - listitem [ref=f2e504]: • Restaurantes y Pizzerías
              - listitem [ref=f2e505]: • Cafeterías y Reposterías
              - listitem [ref=f2e506]: • Bares y Foodtrucks Dominicanos
          - button "Conocer más" [ref=f2e507] [cursor=pointer]
        - generic [ref=f2e510]:
          - generic [ref=f2e511]:
            - heading "Comercios" [level=3] [ref=f2e512]
            - list [ref=f2e513]:
              - listitem [ref=f2e514]: • Tiendas de Ropa y Calzado
              - listitem [ref=f2e515]: • Ferreterías y Constructoras
              - listitem [ref=f2e516]: • Farmacias y Tiendas de Celulares
          - button "Conocer más" [ref=f2e517] [cursor=pointer]
        - generic [ref=f2e520]:
          - generic [ref=f2e521]:
            - heading "Servicios" [level=3] [ref=f2e522]
            - list [ref=f2e523]:
              - listitem [ref=f2e524]: • Consultorías Profesionales
              - listitem [ref=f2e525]: • Clínicas y Salones de Estética
              - listitem [ref=f2e526]: • Talleres mecánicos y Courier
          - button "Conocer más" [ref=f2e527] [cursor=pointer]
        - generic [ref=f2e530]:
          - generic [ref=f2e531]:
            - heading "Distribución / Retail" [level=3] [ref=f2e532]
            - list [ref=f2e533]:
              - listitem [ref=f2e534]: • Colmados y Minimarkets
              - listitem [ref=f2e535]: • Repuestos e Importadoras
              - listitem [ref=f2e536]: • Mayoristas y Suplidores
          - button "Conocer más" [ref=f2e537] [cursor=pointer]
    - generic [ref=f2e541]:
      - generic [ref=f2e542]:
        - generic [ref=f2e543]: Sin Suscripción • 100% Libre
        - heading "FacturaDo es 100% Gratis para Todos" [level=2] [ref=f2e544]
        - paragraph [ref=f2e545]: Creemos en el desarrollo de las pymes dominicanas. Utiliza todos los módulos premium sin trucos de cobro ni límites de facturación.
      - generic [ref=f2e549]:
        - generic [ref=f2e550]:
          - generic [ref=f2e551]:
            - generic [ref=f2e552]: ✔ Todo Incluido de Por Vida
            - heading "¿Cómo es posible?" [level=3] [ref=f2e553]
            - paragraph [ref=f2e554]: Nuestra meta es facilitar la digitalización contable en República Dominicana. Automatiza tu facturación fiscal, controla tus inventarios y genera tus reportes 606/607 sin pagar licencias de software complejas.
          - generic [ref=f2e555]:
            - generic [ref=f2e556]:
              - generic [ref=f2e557]: ✔
              - generic [ref=f2e558]: Terminales de caja (POS) totalmente ilimitados
            - generic [ref=f2e559]:
              - generic [ref=f2e560]: ✔
              - generic [ref=f2e561]: Emisión integral de NCF (Crédito Fiscal, Consumo, etc.)
            - generic [ref=f2e562]:
              - generic [ref=f2e563]: ✔
              - generic [ref=f2e564]: Módulos analíticos completos de compras y ventas
            - generic [ref=f2e565]:
              - generic [ref=f2e566]: ✔
              - generic [ref=f2e567]: Generador automático de reportes formato 606 y 607
        - generic [ref=f2e568]:
          - generic [ref=f2e569]:
            - generic [ref=f2e570]: RD$ 0
            - generic [ref=f2e571]: Cero mensualidades • Cero costos ocultos
          - generic [ref=f2e572]:
            - button "Crear Cuenta Gratis Ahora" [ref=f2e573] [cursor=pointer]
            - paragraph [ref=f2e574]: Únete a cientos de comerciantes dominicanos que ya confían en nosotros
    - generic [ref=f2e576]:
      - generic [ref=f2e577]:
        - heading "Historias de Éxito Locales" [level=2] [ref=f2e578]
        - paragraph [ref=f2e579]: Miles de comerciantes dominicanos respaldan la velocidad de FacturaDo para automatizar su administración.
      - generic [ref=f2e580]:
        - generic [ref=f2e581]:
          - generic [ref=f2e582]:
            - img "Carlos Rodriguez" [ref=f2e583]
            - generic [ref=f2e584]:
              - generic [ref=f2e585]: Carlos Rodríguez
              - generic [ref=f2e586]: Ferretería El Canal SRL, Santo Domingo
          - paragraph [ref=f2e587]: "\"Antes perdía preciadas horas tabulando las compras de mis proveedores. FacturaDo nos ayudó a generar los reportes mensuales de la DGII en un solo clic.\""
        - generic [ref=f2e588]:
          - generic [ref=f2e589]:
            - img "Ana Herrera" [ref=f2e590]
            - generic [ref=f2e591]:
              - generic [ref=f2e592]: Ana M. Herrera
              - generic [ref=f2e593]: Salón & Estética Glamour, Santiago
          - paragraph [ref=f2e594]: "\"Tener el POS en la tablet nos libera de cables molestos. El cliente recibe su recibo por correo al instante y nosotros cuadramos cajas sin fallar.\""
        - generic [ref=f2e595]:
          - generic [ref=f2e596]:
            - img "Joel Almonte" [ref=f2e597]
            - generic [ref=f2e598]:
              - generic [ref=f2e599]: Joel Almonte
              - generic [ref=f2e600]: Súper Colmado El Sol, La Romana
          - paragraph [ref=f2e601]: "\"En República Dominicana es mandatorio cumplir con la validación de RNC y cédulas de clientes de forma segura. FacturaDo lo hace automático.\""
    - generic [ref=f2e603]:
      - generic [ref=f2e604]:
        - generic [ref=f2e605]: Migración e Importación Inteligente
        - heading "Importa tus Productos, Clientes, Facturas y Cotizaciones desde Cualquier Sistema" [level=2] [ref=f2e609]
        - paragraph [ref=f2e610]:
          - text: ¿Vienes de
          - strong [ref=f2e611]: Alegra, QuickBooks, Cashflow, Odoo, Zoho, Sage, Softland
          - text: o archivos Excel personalizados? Nuestro motor lee directamente archivos
          - code [ref=f2e612]: .xlsx
          - text: ","
          - code [ref=f2e613]: .csv
          - text: ","
          - code [ref=f2e614]: .xml
          - text: o
          - code [ref=f2e615]: .txt
          - text: sin reestructurar datos.
      - generic [ref=f2e616]:
        - generic [ref=f2e617]:
          - generic [ref=f2e618]: "1"
          - heading "Compatibilidad Total" [level=3] [ref=f2e619]
          - paragraph [ref=f2e620]:
            - text: "Reconoce encabezados en español e inglés:"
            - emphasis [ref=f2e621]: RNC, Cédula, Razón Social, SKU, Precio de Venta, Tax ID, Qty On Hand
            - text: y más.
        - generic [ref=f2e622]:
          - generic [ref=f2e623]: "2"
          - heading "Desinfección de RNCs" [level=3] [ref=f2e624]
          - paragraph [ref=f2e625]: Limpia guiones, puntos y espacios automáticamente. Clasifica entre Persona Física (11 dígitos) y Empresa (9 dígitos).
        - generic [ref=f2e626]:
          - generic [ref=f2e627]: "3"
          - heading "Monedas y Precios" [level=3] [ref=f2e628]
          - paragraph [ref=f2e629]:
            - text: Detecta precios con símbolos monetarios (
            - code [ref=f2e630]: RD$ 1,500.00
            - text: ➔
            - code [ref=f2e631]: "1500"
            - text: ) y costos unitarios sin margen de error.
        - generic [ref=f2e632]:
          - generic [ref=f2e633]: "4"
          - heading "Vista Previa & Algoritmo Fuzzy" [level=3] [ref=f2e634]
          - paragraph [ref=f2e635]: Verifica las columnas mapeadas y la vista previa de datos antes de importar miles de filas a tu base de datos PostgreSQL.
    - generic [ref=f2e636]:
      - generic [ref=f2e637]: Sistemas desarrollados en RD o enfocados en RD. SistemasHS.com. FacturandoRD - Sistema de Facturación e Inventario. Xaplu Sistema de Facturación. Factura Dominicana GTI. Gestiono ERP - Sistema de Facturación e Ecommerce. SFE - Sistema de Facturación Electrónica RD. SISTEMAS DE FACTURACION EGSOFTWARE. Plataformas modernas de facturación electrónica (e-CF). Kuadre ERP — Facturación, inventario, POS y contabilidad. DOMI POS — POS y facturación electrónica para comercios. Metoo Program — Facturación, inventario y contabilidad integrados. Pacioli ERP — ERP dominicano con e-CF, inventario y contabilidad. Oniux — Facturación, POS e inventario en la nube. eFIT ERP — ERP completo con módulos contables y nómina. Terminal X POS — Muy usado en tiendas, restaurantes y car wash. Proveedores e-CF (para integrar con tu propio sistema). ECF3 — API y gateway para facturación electrónica. EF2 — API certificada para e-CF DGII. DGMax — Plataforma de emisión y validación e-CF. Sistemas internacionales que operan en RD. Alegra - Facturación Electrónica & Contabilidad — Muy popular entre pequeñas empresas. Odoo (con módulos adaptados para RD). SAP Business One. Microsoft Dynamics 365. QuickBooks Online (con adaptaciones locales).
      - generic [ref=f2e638]:
        - generic [ref=f2e640]:
          - heading "Alternativa Inteligente" [level=2] [ref=f2e641]
          - heading "¿Cómo nos comparamos con el resto?" [level=3] [ref=f2e642]
          - paragraph [ref=f2e643]: Sabemos que hay muchas opciones como Alegra, Odoo, QuickBooks y otros ERP locales como SistemasHS o Kuadre. Mira por qué FacturaDo es la mejor alternativa gratuita y de código abierto en República Dominicana.
        - table [ref=f2e645]:
          - rowgroup [ref=f2e646]:
            - row [ref=f2e647]:
              - columnheader "Característica" [ref=f2e648]
              - columnheader "FacturaDo Nuestra App" [ref=f2e649]:
                - generic [ref=f2e650]: FacturaDo
                - generic [ref=f2e651]: Nuestra App
              - columnheader "Alegra" [ref=f2e652]
              - columnheader "Odoo" [ref=f2e654]
              - columnheader "QuickBooks" [ref=f2e656]
              - columnheader "Sistemas Locales (SistemasHS, Kuadre, Xaplu, etc.)" [ref=f2e658]
          - rowgroup [ref=f2e660]:
            - row [ref=f2e661]:
              - cell "Precio Mensual" [ref=f2e662]
              - cell "GRATIS" [ref=f2e663]
              - cell "$29 - $119 / mes" [ref=f2e665]
              - cell "$24.90 / mes por usr" [ref=f2e667]
              - cell "$15 - $100 / mes" [ref=f2e669]
              - cell "$50 - $150 / mes" [ref=f2e671]
            - row [ref=f2e673]:
              - cell "Facturación Electrónica" [ref=f2e674]
              - cell "Sí (Integrado)" [ref=f2e675]
              - cell [ref=f2e677]
              - cell "Con Partner" [ref=f2e681]
              - cell "Mediante API Externa" [ref=f2e683]
              - cell "Varía por sistema" [ref=f2e685]
            - row [ref=f2e687]:
              - cell "Punto de Venta (POS)" [ref=f2e688]
              - cell [ref=f2e689]
              - cell "Sí (Costo Extra)" [ref=f2e693]
              - cell [ref=f2e695]
              - cell "Solo en US" [ref=f2e699]
              - cell [ref=f2e701]
            - row [ref=f2e705]:
              - cell "Inventario" [ref=f2e706]
              - cell [ref=f2e707]
              - cell [ref=f2e711]
              - cell [ref=f2e715]
              - cell "Planes caros" [ref=f2e719]
              - cell [ref=f2e721]
            - row [ref=f2e725]:
              - cell "Contabilidad" [ref=f2e726]
              - cell "Básica / 606 & 607" [ref=f2e727]
              - cell [ref=f2e729]
              - cell [ref=f2e733]
              - cell [ref=f2e737]
              - cell "Depende" [ref=f2e741]
            - row [ref=f2e743]:
              - cell "Nómina" [ref=f2e744]
              - cell "Próximamente" [ref=f2e745]
              - cell "No (RD)" [ref=f2e747]
              - cell [ref=f2e749]
              - cell "No (RD)" [ref=f2e753]
              - cell "A veces" [ref=f2e755]
            - row [ref=f2e757]:
              - cell "API Integración" [ref=f2e758]
              - cell [ref=f2e759]
              - cell [ref=f2e763]
              - cell [ref=f2e767]
              - cell [ref=f2e771]
              - cell "Limitada" [ref=f2e775]
            - row [ref=f2e777]:
              - cell "Multiempresa" [ref=f2e778]
              - cell [ref=f2e779]
              - cell "Plan Avanzado" [ref=f2e783]
              - cell [ref=f2e785]
              - cell [ref=f2e789]
              - cell "Costo Extra" [ref=f2e793]
    - generic [ref=f2e796]:
      - generic [ref=f2e797]:
        - generic [ref=f2e798]: Respuestas Rápidas
        - heading "Preguntas frecuentes sobre FacturaDo" [level=2] [ref=f2e799]
        - paragraph [ref=f2e800]: Resolvemos las principales dudas sobre la integración fiscal dominicana y la facturación digital.
      - generic [ref=f2e801]:
        - generic [ref=f2e802]:
          - button "¿Qué es FacturaDo y cómo funciona para declarar a la DGII? −" [ref=f2e803]:
            - generic [ref=f2e804]: ¿Qué es FacturaDo y cómo funciona para declarar a la DGII?
            - generic [ref=f2e805]: −
          - generic [ref=f2e806]: FacturaDo es una plataforma web y móvil para control administrative y fiscal. Le permite registrar sus facturas y registrar los tipos de comprobantes fiscales (B01, B02, B14, B15), para luego exportar directamente los archivos de texto requeridos por los formatos 606, 607 y 608 de la DGII Dominicana sin errores de numeración.
        - generic [ref=f2e807]:
          - button "¿Requiere conexión a internet activa para facturar en el POS? −" [active] [ref=f2e808]:
            - generic [ref=f2e809]: ¿Requiere conexión a internet activa para facturar en el POS?
            - generic [ref=f2e810]: −
          - generic [ref=f2e811]: Sí. Para validar los nombres fiscales de los clientes en tiempo real contra la base de datos oficial del padrón DGII, el sistema requiere conexión a internet estable. De lo contrario, registrará la factura de forma normal del padrón clásico offline.
        - button "¿Es seguro guardar mi información contable e inventarios en la nube? +" [ref=f2e813]:
          - generic [ref=f2e814]: ¿Es seguro guardar mi información contable e inventarios en la nube?
          - generic [ref=f2e815]: +
    - generic [ref=f2e818]:
      - generic [ref=f2e819]:
        - generic [ref=f2e820]: Casos de Éxito
        - heading "Comercios que confían en FacturaDo" [level=2] [ref=f2e821]
        - paragraph [ref=f2e822]: No tome solo nuestra palabra. Vea lo que dueños de negocios dominicanos opinan de nuestra plataforma.
      - generic [ref=f2e823]:
        - generic [ref=f2e824]:
          - paragraph [ref=f2e836]: "\"Poder facturar y generar los reportes de la DGII en un solo clic me ahorra días de trabajo y pago de igualas complejas. Mi negocio está más organizado que nunca.\""
          - generic [ref=f2e837]:
            - generic [ref=f2e838]: C
            - generic [ref=f2e839]:
              - paragraph [ref=f2e840]: Carlos Méndez
              - paragraph [ref=f2e841]: Ferretería Méndez, Santiago
        - generic [ref=f2e842]:
          - paragraph [ref=f2e854]: "\"El módulo de POS es rapidísimo y el cuadre de caja al final del día ahora es exacto. Saber que todo está guardado en la nube me da mucha tranquilidad.\""
          - generic [ref=f2e855]:
            - generic [ref=f2e856]: M
            - generic [ref=f2e857]:
              - paragraph [ref=f2e858]: María Rosario
              - paragraph [ref=f2e859]: Boutique MR, Distrito Nacional
        - generic [ref=f2e860]:
          - paragraph [ref=f2e872]: "\"Antes gastaba miles de pesos en sistemas lentos de escritorio. FacturaDo no solo es más moderno y fácil de usar, ¡sino que no pago licencias!\""
          - generic [ref=f2e873]:
            - generic [ref=f2e874]: J
            - generic [ref=f2e875]:
              - paragraph [ref=f2e876]: José Pimentel
              - paragraph [ref=f2e877]: Super Colmado José, La Romana
    - generic [ref=f2e879]:
      - heading "Únete hoy a la comunidad de FacturaDo" [level=2] [ref=f2e880]
      - paragraph [ref=f2e881]: Eleve el control financiero de su negocio dominicano con la plataforma de mayor crecimiento local.
      - button "Registrar mi cuenta gratis" [ref=f2e883] [cursor=pointer]
    - contentinfo [ref=f2e884]:
      - generic [ref=f2e885]:
        - paragraph [ref=f2e899]: Simplificando las operaciones tributarias dominicanas.
        - generic [ref=f2e900]:
          - generic [ref=f2e901]: Producto
          - generic [ref=f2e902]: Facturación Clásica
          - button "Centro de Ayuda" [ref=f2e903] [cursor=pointer]
          - generic [ref=f2e904]: Reporterías DGII (606, 607)
          - generic [ref=f2e905]: Puntos de Ventas (Cafés/Retail)
        - generic [ref=f2e906]:
          - generic [ref=f2e907]: Legal
          - button "Términos y Condiciones" [ref=f2e908] [cursor=pointer]
          - link "/terminos" [ref=f2e909] [cursor=pointer]:
            - /url: /terminos
          - button "Políticas de Uso y Privacidad" [ref=f2e910] [cursor=pointer]
          - link "/privacidad" [ref=f2e911] [cursor=pointer]:
            - /url: /privacidad
      - generic [ref=f2e912]: © 2026 FacturaDo. Sincronizado fiscalmente para República Dominicana. Todos los derechos reservados.
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '../helpers/auth';
  2  | 
  3  | test.describe('Core Business: POS Sale Flow', () => {
  4  |   test('Complete cash sale successfully', async ({ adminPage }) => {
  5  |     test.setTimeout(90000);
  6  |     
  7  |     // 1. Navigate to POS
  8  |     await adminPage.goto('/dashboard/pos');
  9  |     
  10 |     // 2. Open Shift if needed
  11 |     const openShiftBtn = adminPage.getByRole('button', { name: /Abrir Turno/i });
  12 |     if (await openShiftBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  13 |       await adminPage.getByLabel(/Fondo Inicial/i).fill('500');
  14 |       await openShiftBtn.click();
  15 |       await adminPage.waitForLoadState('networkidle');
  16 |     }
  17 | 
  18 |     // 3. Add product to cart (FacturaDo usually has cards with 'Agregar' or a plus icon)
  19 |     // We try to find a generic add to cart button
  20 |     const addToCartBtn = adminPage.locator('button:has-text("Agregar"), button[aria-label="Agregar"]').first();
  21 |     
  22 |     try {
  23 |       await addToCartBtn.waitFor({ state: 'visible', timeout: 5000 });
  24 |       await addToCartBtn.click();
  25 |     } catch (e) {
  26 |       console.log('No products found or add button different, clicking first generic button inside product grid');
  27 |       // Click on the first visible card in the grid as fallback
  28 |       await adminPage.locator('.grid > div').first().click(); 
  29 |     }
  30 | 
  31 |     // 4. Initiate Checkout
  32 |     const checkoutBtn = adminPage.getByRole('button', { name: /Cobrar|Facturar|Procesar/i });
  33 |     await checkoutBtn.click();
  34 | 
  35 |     // 5. Fill Cash Amount to exactly match total
  36 |     // We overpay to ensure it covers
  37 |     const cashInput = adminPage.locator('input[type="number"]').first();
> 38 |     await cashInput.fill('99999'); 
     |                     ^ TimeoutError: locator.fill: Timeout 30000ms exceeded.
  39 | 
  40 |     // 6. Finalize Sale
  41 |     const finalizeBtn = adminPage.getByRole('button', { name: /Registrar Venta/i });
  42 |     await finalizeBtn.click();
  43 | 
  44 |     // 7. Verify Success
  45 |     await expect(adminPage.getByText(/Procesado con Éxito/i)).toBeVisible({ timeout: 10000 });
  46 |   });
  47 | });
  48 | 
```