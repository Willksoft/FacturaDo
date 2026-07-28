# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: business-flows\01-pos-sale-flow.spec.ts >> Core Business: POS Sale Flow >> Complete cash sale successfully
- Location: tests\e2e\business-flows\01-pos-sale-flow.spec.ts:4:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Cobrar|Facturar|Procesar/i })

```

# Page snapshot

```yaml
- generic [ref=f2e2]:
  - generic [ref=f2e3]:
    - complementary [ref=f2e4]:
      - button [ref=f2e18]
      - generic [ref=f2e21]:
        - button "Dashboard" [ref=f2e23]
        - button "Estado de mi negocio" [ref=f2e31]
        - button "Facturación" [ref=f2e37] [cursor=pointer]
        - button "Clientes" [ref=f2e46] [cursor=pointer]
        - button "Productos" [ref=f2e57] [cursor=pointer]
        - button "Compras" [ref=f2e67] [cursor=pointer]
        - button "Finanzas" [ref=f2e77] [cursor=pointer]
        - button "Reportes" [ref=f2e85] [cursor=pointer]
        - generic [ref=f2e93]:
          - button "Nómina y R.H." [ref=f2e94]
          - button "Centro de Presupuestos" [ref=f2e101]
        - button "Configuración" [ref=f2e106] [cursor=pointer]
      - generic [ref=f2e114]:
        - generic "Configuración de Perfil" [ref=f2e115] [cursor=pointer]:
          - generic [ref=f2e116]: U
          - generic [ref=f2e118]:
            - generic [ref=f2e119]: Usuario Pruebas FacturaDo
            - generic [ref=f2e120]: Administrador
        - button "Cerrar sesión" [ref=f2e121]
    - generic [ref=f2e125]:
      - banner [ref=f2e126]:
        - generic [ref=f2e127]:
          - textbox "Buscar rápido..." [ref=f2e132]
          - button "Nueva Operación" [ref=f2e134] [cursor=pointer]
          - button "Notificaciones" [ref=f2e137] [cursor=pointer]
      - main [ref=f2e141]:
        - generic [ref=f2e143]:
          - button "7 Nivel 2 850 / 1400 XP" [ref=f2e145]:
            - generic [ref=f2e146]: "7"
            - generic [ref=f2e151]:
              - generic [ref=f2e152]: Nivel 2
              - generic [ref=f2e153]: 850 / 1400 XP
          - generic [ref=f2e156]:
            - generic [ref=f2e163]:
              - heading "Calendario & Recordatorios Fiscales DGII julio 2026" [level=3] [ref=f2e164]:
                - text: Calendario & Recordatorios Fiscales DGII
                - generic [ref=f2e165]: julio 2026
              - paragraph [ref=f2e166]: Fechas límites de presentación e impuestos vigentes de la República Dominicana
            - generic [ref=f2e167]:
              - generic [ref=f2e168]:
                - generic [ref=f2e169]:
                  - generic [ref=f2e170]:
                    - generic [ref=f2e171]: Día 20
                    - generic [ref=f2e175]: Vencido (día 20)
                  - generic [ref=f2e176]:
                    - heading "Declaración y Pago de IT-1 (ITBIS)" [level=4] [ref=f2e177]
                    - paragraph [ref=f2e178]: Presentación mensual de Ventas, Compras e ITBIS cobrado vs pagado.
                - generic [ref=f2e179]:
                  - generic [ref=f2e180]: "Fecha: 20 de julio"
                  - button "Ir a Reporte" [ref=f2e181]
              - generic [ref=f2e184]:
                - generic [ref=f2e185]:
                  - generic [ref=f2e186]:
                    - generic [ref=f2e187]: Día 15
                    - generic [ref=f2e192]: Vencido (día 15)
                  - generic [ref=f2e193]:
                    - heading "Envío de Formatos 606 y 607 (DGII)" [level=4] [ref=f2e194]
                    - paragraph [ref=f2e195]: Envío obligatorio de compras, gastos y ventas del periodo a la Oficina Virtual.
                - generic [ref=f2e196]:
                  - generic [ref=f2e197]: "Fecha: 15 de julio"
                  - button "Ir a Reporte" [ref=f2e198]
              - generic [ref=f2e201]:
                - generic [ref=f2e202]:
                  - generic [ref=f2e203]:
                    - generic [ref=f2e204]: Día 10
                    - generic [ref=f2e208]: Vencido (día 10)
                  - generic [ref=f2e209]:
                    - heading "Declaración IR-17 / Retenciones" [level=4] [ref=f2e210]
                    - paragraph [ref=f2e211]: Declaración jurada de retenciones de ISR y retenciones a terceros.
                - generic [ref=f2e212]:
                  - generic [ref=f2e213]: "Fecha: 10 de julio"
                  - button "Ir a Reporte" [ref=f2e214]
          - generic [ref=f2e217]:
            - generic [ref=f2e222]:
              - generic [ref=f2e223]: Ventas de Hoy
              - generic [ref=f2e228]:
                - generic "RD$ 1,218" [ref=f2e229]: RD$ 1,218.00
                - paragraph [ref=f2e230]: Cierre diario en tiempo real.
            - generic [ref=f2e235]:
              - generic [ref=f2e236]: Ventas del Mes
              - generic [ref=f2e242]:
                - generic "RD$ 1,218" [ref=f2e243]: RD$ 1,218.00
                - paragraph [ref=f2e244]: Volumen imponible gravable.
            - generic [ref=f2e249]:
              - generic [ref=f2e250]: Gastos del Mes
              - generic [ref=f2e255]:
                - generic "RD$ 2,000" [ref=f2e256]: RD$ 2,000.00
                - paragraph [ref=f2e257]: Reportados bajo formato 606.
            - generic [ref=f2e262]:
              - generic [ref=f2e263]: Ganancia Neta
              - generic [ref=f2e269]:
                - generic "RD$ -782" [ref=f2e270]: RD$ -782.00
                - paragraph [ref=f2e271]: Margen neto operativo estimado.
            - generic [ref=f2e278]:
              - generic [ref=f2e279]: Facturas Pendientes
              - generic [ref=f2e280]: 1 documentos
              - paragraph [ref=f2e281]: Pendientes de abono fiscal.
            - generic [ref=f2e290]:
              - generic [ref=f2e291]: Clientes Nuevos
              - generic [ref=f2e292]: +5 este mes
              - paragraph [ref=f2e293]: Prospectos y empresas de valor.
            - generic [ref=f2e299]:
              - generic [ref=f2e300]: Poco Inventario
              - generic [ref=f2e301]: 0 ítems
              - paragraph [ref=f2e302]: Requieren reorden urgente.
            - generic [ref=f2e309]:
              - generic [ref=f2e310]: Cuentas por Cobrar
              - generic "RD$ 118" [ref=f2e311]: RD$ 118.00
              - paragraph [ref=f2e312]: Cartera de cobros corriente.
          - generic [ref=f2e313]:
            - generic [ref=f2e314]:
              - generic [ref=f2e315]:
                - generic [ref=f2e316]:
                  - heading "Gráfico de Ventas" [level=3] [ref=f2e317]
                  - paragraph [ref=f2e318]: Evolución de facturación de comprobantes según rango seleccionado.
                - generic [ref=f2e319]:
                  - button "Últimos 7 días" [ref=f2e320]
                  - button "Últimos 30 días" [ref=f2e321]
                  - button "Últimos 12 meses" [ref=f2e322]
              - img [ref=f2e325]:
                - generic [ref=f2e326] [cursor=pointer]:
                  - generic [ref=f2e328]: RD$0k
                  - generic [ref=f2e329]: M 22
                - generic [ref=f2e330] [cursor=pointer]:
                  - generic [ref=f2e332]: RD$0k
                  - generic [ref=f2e333]: J 23
                - generic [ref=f2e334] [cursor=pointer]:
                  - generic [ref=f2e336]: RD$0k
                  - generic [ref=f2e337]: V 24
                - generic [ref=f2e338] [cursor=pointer]:
                  - generic [ref=f2e340]: RD$0k
                  - generic [ref=f2e341]: S 25
                - generic [ref=f2e342] [cursor=pointer]:
                  - generic [ref=f2e344]: RD$0k
                  - generic [ref=f2e345]: D 26
                - generic [ref=f2e346] [cursor=pointer]:
                  - generic [ref=f2e348]: RD$0k
                  - generic [ref=f2e349]: L 27
                - generic [ref=f2e350] [cursor=pointer]:
                  - generic [ref=f2e352]: RD$1k
                  - generic [ref=f2e353]: M 28
            - generic [ref=f2e354]:
              - generic [ref=f2e355]:
                - heading "Métodos de Pago" [level=3] [ref=f2e356]
                - paragraph [ref=f2e357]: Distribución de cobros y facturación según medio.
              - generic [ref=f2e358]:
                - generic [ref=f2e360]:
                  - generic [ref=f2e361]: Efectivo
                  - generic [ref=f2e363]: 100% (1,218 DOP)
                - generic [ref=f2e367]:
                  - generic [ref=f2e368]: Transferencia
                  - generic [ref=f2e370]: 0% (0 DOP)
                - generic [ref=f2e373]:
                  - generic [ref=f2e374]: Tarjeta
                  - generic [ref=f2e376]: 0% (0 DOP)
                - generic [ref=f2e379]:
                  - generic [ref=f2e380]: Cheque / Crédito
                  - generic [ref=f2e382]: 0% (0 DOP)
          - generic [ref=f2e384]:
            - generic [ref=f2e385]:
              - generic [ref=f2e386]:
                - heading "Antigüedad de Saldos" [level=3] [ref=f2e387]
                - paragraph [ref=f2e391]: Distribución de cuentas por cobrar según días de atraso.
              - generic [ref=f2e393]:
                - generic [ref=f2e394]:
                  - generic [ref=f2e395]: Al Día
                  - generic [ref=f2e396]: 0.1k
                - generic [ref=f2e397]:
                  - generic [ref=f2e398]: 1-30 Días
                  - generic [ref=f2e399]: 0.0k
                - generic [ref=f2e400]:
                  - generic [ref=f2e401]: 31-60 Días
                  - generic [ref=f2e402]: 0.0k
                - generic [ref=f2e403]:
                  - generic [ref=f2e404]: 61-90 Días
                  - generic [ref=f2e405]: 0.0k
                - generic [ref=f2e406]:
                  - generic [ref=f2e407]: "> 90 Días"
                  - generic [ref=f2e408]: 0.0k
            - generic [ref=f2e411]:
              - generic [ref=f2e412]:
                - heading "Flujo de Caja Predictivo (Próx. 4 Sem)" [level=3] [ref=f2e413]
                - paragraph [ref=f2e416]: Proyección de liquidez basada en cuentas por cobrar.
              - generic [ref=f2e418]:
                - generic [ref=f2e419]:
                  - generic [ref=f2e420]: 0.0k
                  - generic [ref=f2e423]: Semana 1
                - generic [ref=f2e424]:
                  - generic [ref=f2e425]: 0.0k
                  - generic [ref=f2e428]: Semana 2
                - generic [ref=f2e429]:
                  - generic [ref=f2e430]: 0.0k
                  - generic [ref=f2e433]: Semana 3
                - generic [ref=f2e434]:
                  - generic [ref=f2e435]: 0.0k
                  - generic [ref=f2e438]: Semana 4
          - generic [ref=f2e439]:
            - generic [ref=f2e441]:
              - generic [ref=f2e442]:
                - generic [ref=f2e443]:
                  - heading "Últimas facturas" [level=3] [ref=f2e444]
                  - paragraph [ref=f2e445]: Listado cronológico de comprobantes fiscales de venta autorizados.
                - button "Ver Todo" [ref=f2e446] [cursor=pointer]
              - table [ref=f2e449]:
                - rowgroup [ref=f2e450]:
                  - row [ref=f2e451]:
                    - columnheader "Factura" [ref=f2e452]
                    - columnheader "Cliente" [ref=f2e453]
                    - columnheader "Total" [ref=f2e454]
                    - columnheader "Estado" [ref=f2e455]
                - rowgroup [ref=f2e456]:
                  - row [ref=f2e457]:
                    - cell "FAC-2026-0006" [ref=f2e458]
                    - cell "Cliente de Consumo" [ref=f2e459]
                    - cell "RD$ 100.00" [ref=f2e460]
                    - cell "Pagada" [ref=f2e461]
                  - row [ref=f2e463]:
                    - cell "FAC-2026-0005" [ref=f2e464]
                    - cell "Cliente de Consumo" [ref=f2e465]
                    - cell "RD$ 1,000.00" [ref=f2e466]
                    - cell "Pagada" [ref=f2e467]
                  - row [ref=f2e469]:
                    - cell "FAC-2026-0007" [ref=f2e470]
                    - cell "Cliente de Consumo" [ref=f2e471]
                    - cell "RD$ 118.00" [ref=f2e472]
                    - cell "Pendiente" [ref=f2e473]
            - generic [ref=f2e476]:
              - generic [ref=f2e480]:
                - heading "Alertas Operativas" [level=3] [ref=f2e481]
                - paragraph [ref=f2e482]: Puntos de control tributario, stock y carteras.
              - generic [ref=f2e483]:
                - generic [ref=f2e484]:
                  - generic [ref=f2e485]: Inventario bajo (0)
                  - paragraph [ref=f2e489]: Todos los productos con existencias seguras.
                - generic [ref=f2e490]:
                  - generic [ref=f2e491]: Facturas vencidas (0)
                  - paragraph [ref=f2e495]: Ningún cobro fuera de vencimiento.
                - generic [ref=f2e496]:
                  - generic [ref=f2e497]: Suscripción premium activa
                  - paragraph [ref=f2e502]: Renovación PRO programada en 18 días. Servicio integrado DGII ilimitado habilitado.
                - generic [ref=f2e503]:
                  - generic [ref=f2e504]: Secuencias NCF seguras
                  - paragraph [ref=f2e508]: Secuencia B02 de consumo con 391 timbres restantes. Sin peligro de agotamiento inmediato.
  - region "Notifications alt+T"
  - button "Abrir asistente AI" [ref=f2e510]
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
> 33 |     await checkoutBtn.click();
     |                       ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  34 | 
  35 |     // 5. Fill Cash Amount to exactly match total
  36 |     // We overpay to ensure it covers
  37 |     const cashInput = adminPage.locator('input[type="number"]').first();
  38 |     await cashInput.fill('99999'); 
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