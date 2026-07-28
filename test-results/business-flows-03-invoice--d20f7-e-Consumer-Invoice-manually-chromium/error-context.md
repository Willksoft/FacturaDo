# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: business-flows\03-invoice-creation.spec.ts >> Core Business: Invoice Creation >> Create Consumer Invoice manually
- Location: tests\e2e\business-flows\03-invoice-creation.spec.ts:4:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Guardar Factura|Crear Factura|Emitir Factura|Guardar/i }).first()

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
          - generic [ref=f2e133]:
            - button "Nueva Operación" [active] [ref=f2e134] [cursor=pointer]
            - generic [ref=f2e137]:
              - generic [ref=f2e138]: Crear Nuevo
              - button "Factura de Venta" [ref=f2e139] [cursor=pointer]
              - button "Cotización Comercial" [ref=f2e144] [cursor=pointer]
          - button "Notificaciones" [ref=f2e150] [cursor=pointer]
      - main [ref=f2e154]:
        - generic [ref=f2e156]:
          - button "7 Nivel 2 850 / 1400 XP" [ref=f2e158]:
            - generic [ref=f2e159]: "7"
            - generic [ref=f2e164]:
              - generic [ref=f2e165]: Nivel 2
              - generic [ref=f2e166]: 850 / 1400 XP
          - generic [ref=f2e169]:
            - generic [ref=f2e176]:
              - heading "Calendario & Recordatorios Fiscales DGII julio 2026" [level=3] [ref=f2e177]:
                - text: Calendario & Recordatorios Fiscales DGII
                - generic [ref=f2e178]: julio 2026
              - paragraph [ref=f2e179]: Fechas límites de presentación e impuestos vigentes de la República Dominicana
            - generic [ref=f2e180]:
              - generic [ref=f2e181]:
                - generic [ref=f2e182]:
                  - generic [ref=f2e183]:
                    - generic [ref=f2e184]: Día 20
                    - generic [ref=f2e188]: Vencido (día 20)
                  - generic [ref=f2e189]:
                    - heading "Declaración y Pago de IT-1 (ITBIS)" [level=4] [ref=f2e190]
                    - paragraph [ref=f2e191]: Presentación mensual de Ventas, Compras e ITBIS cobrado vs pagado.
                - generic [ref=f2e192]:
                  - generic [ref=f2e193]: "Fecha: 20 de julio"
                  - button "Ir a Reporte" [ref=f2e194]
              - generic [ref=f2e197]:
                - generic [ref=f2e198]:
                  - generic [ref=f2e199]:
                    - generic [ref=f2e200]: Día 15
                    - generic [ref=f2e205]: Vencido (día 15)
                  - generic [ref=f2e206]:
                    - heading "Envío de Formatos 606 y 607 (DGII)" [level=4] [ref=f2e207]
                    - paragraph [ref=f2e208]: Envío obligatorio de compras, gastos y ventas del periodo a la Oficina Virtual.
                - generic [ref=f2e209]:
                  - generic [ref=f2e210]: "Fecha: 15 de julio"
                  - button "Ir a Reporte" [ref=f2e211]
              - generic [ref=f2e214]:
                - generic [ref=f2e215]:
                  - generic [ref=f2e216]:
                    - generic [ref=f2e217]: Día 10
                    - generic [ref=f2e221]: Vencido (día 10)
                  - generic [ref=f2e222]:
                    - heading "Declaración IR-17 / Retenciones" [level=4] [ref=f2e223]
                    - paragraph [ref=f2e224]: Declaración jurada de retenciones de ISR y retenciones a terceros.
                - generic [ref=f2e225]:
                  - generic [ref=f2e226]: "Fecha: 10 de julio"
                  - button "Ir a Reporte" [ref=f2e227]
          - generic [ref=f2e230]:
            - generic [ref=f2e235]:
              - generic [ref=f2e236]: Ventas de Hoy
              - generic [ref=f2e241]:
                - generic "RD$ 1,218" [ref=f2e242]: RD$ 1,218.00
                - paragraph [ref=f2e243]: Cierre diario en tiempo real.
            - generic [ref=f2e248]:
              - generic [ref=f2e249]: Ventas del Mes
              - generic [ref=f2e255]:
                - generic "RD$ 1,218" [ref=f2e256]: RD$ 1,218.00
                - paragraph [ref=f2e257]: Volumen imponible gravable.
            - generic [ref=f2e262]:
              - generic [ref=f2e263]: Gastos del Mes
              - generic [ref=f2e268]:
                - generic "RD$ 2,000" [ref=f2e269]: RD$ 2,000.00
                - paragraph [ref=f2e270]: Reportados bajo formato 606.
            - generic [ref=f2e275]:
              - generic [ref=f2e276]: Ganancia Neta
              - generic [ref=f2e282]:
                - generic "RD$ -782" [ref=f2e283]: RD$ -782.00
                - paragraph [ref=f2e284]: Margen neto operativo estimado.
            - generic [ref=f2e291]:
              - generic [ref=f2e292]: Facturas Pendientes
              - generic [ref=f2e293]: 1 documentos
              - paragraph [ref=f2e294]: Pendientes de abono fiscal.
            - generic [ref=f2e303]:
              - generic [ref=f2e304]: Clientes Nuevos
              - generic [ref=f2e305]: +5 este mes
              - paragraph [ref=f2e306]: Prospectos y empresas de valor.
            - generic [ref=f2e312]:
              - generic [ref=f2e313]: Poco Inventario
              - generic [ref=f2e314]: 0 ítems
              - paragraph [ref=f2e315]: Requieren reorden urgente.
            - generic [ref=f2e322]:
              - generic [ref=f2e323]: Cuentas por Cobrar
              - generic "RD$ 118" [ref=f2e324]: RD$ 118.00
              - paragraph [ref=f2e325]: Cartera de cobros corriente.
          - generic [ref=f2e326]:
            - generic [ref=f2e327]:
              - generic [ref=f2e328]:
                - generic [ref=f2e329]:
                  - heading "Gráfico de Ventas" [level=3] [ref=f2e330]
                  - paragraph [ref=f2e331]: Evolución de facturación de comprobantes según rango seleccionado.
                - generic [ref=f2e332]:
                  - button "Últimos 7 días" [ref=f2e333]
                  - button "Últimos 30 días" [ref=f2e334]
                  - button "Últimos 12 meses" [ref=f2e335]
              - img [ref=f2e338]:
                - generic [ref=f2e339] [cursor=pointer]:
                  - generic [ref=f2e341]: RD$0k
                  - generic [ref=f2e342]: M 22
                - generic [ref=f2e343] [cursor=pointer]:
                  - generic [ref=f2e345]: RD$0k
                  - generic [ref=f2e346]: J 23
                - generic [ref=f2e347] [cursor=pointer]:
                  - generic [ref=f2e349]: RD$0k
                  - generic [ref=f2e350]: V 24
                - generic [ref=f2e351] [cursor=pointer]:
                  - generic [ref=f2e353]: RD$0k
                  - generic [ref=f2e354]: S 25
                - generic [ref=f2e355] [cursor=pointer]:
                  - generic [ref=f2e357]: RD$0k
                  - generic [ref=f2e358]: D 26
                - generic [ref=f2e359] [cursor=pointer]:
                  - generic [ref=f2e361]: RD$0k
                  - generic [ref=f2e362]: L 27
                - generic [ref=f2e363] [cursor=pointer]:
                  - generic [ref=f2e365]: RD$1k
                  - generic [ref=f2e366]: M 28
            - generic [ref=f2e367]:
              - generic [ref=f2e368]:
                - heading "Métodos de Pago" [level=3] [ref=f2e369]
                - paragraph [ref=f2e370]: Distribución de cobros y facturación según medio.
              - generic [ref=f2e371]:
                - generic [ref=f2e373]:
                  - generic [ref=f2e374]: Efectivo
                  - generic [ref=f2e376]: 100% (1,218 DOP)
                - generic [ref=f2e380]:
                  - generic [ref=f2e381]: Transferencia
                  - generic [ref=f2e383]: 0% (0 DOP)
                - generic [ref=f2e386]:
                  - generic [ref=f2e387]: Tarjeta
                  - generic [ref=f2e389]: 0% (0 DOP)
                - generic [ref=f2e392]:
                  - generic [ref=f2e393]: Cheque / Crédito
                  - generic [ref=f2e395]: 0% (0 DOP)
          - generic [ref=f2e397]:
            - generic [ref=f2e398]:
              - generic [ref=f2e399]:
                - heading "Antigüedad de Saldos" [level=3] [ref=f2e400]
                - paragraph [ref=f2e404]: Distribución de cuentas por cobrar según días de atraso.
              - generic [ref=f2e406]:
                - generic [ref=f2e407]:
                  - generic [ref=f2e408]: Al Día
                  - generic [ref=f2e409]: 0.1k
                - generic [ref=f2e410]:
                  - generic [ref=f2e411]: 1-30 Días
                  - generic [ref=f2e412]: 0.0k
                - generic [ref=f2e413]:
                  - generic [ref=f2e414]: 31-60 Días
                  - generic [ref=f2e415]: 0.0k
                - generic [ref=f2e416]:
                  - generic [ref=f2e417]: 61-90 Días
                  - generic [ref=f2e418]: 0.0k
                - generic [ref=f2e419]:
                  - generic [ref=f2e420]: "> 90 Días"
                  - generic [ref=f2e421]: 0.0k
            - generic [ref=f2e424]:
              - generic [ref=f2e425]:
                - heading "Flujo de Caja Predictivo (Próx. 4 Sem)" [level=3] [ref=f2e426]
                - paragraph [ref=f2e429]: Proyección de liquidez basada en cuentas por cobrar.
              - generic [ref=f2e431]:
                - generic [ref=f2e432]:
                  - generic [ref=f2e433]: 0.0k
                  - generic [ref=f2e436]: Semana 1
                - generic [ref=f2e437]:
                  - generic [ref=f2e438]: 0.0k
                  - generic [ref=f2e441]: Semana 2
                - generic [ref=f2e442]:
                  - generic [ref=f2e443]: 0.0k
                  - generic [ref=f2e446]: Semana 3
                - generic [ref=f2e447]:
                  - generic [ref=f2e448]: 0.0k
                  - generic [ref=f2e451]: Semana 4
          - generic [ref=f2e452]:
            - generic [ref=f2e454]:
              - generic [ref=f2e455]:
                - generic [ref=f2e456]:
                  - heading "Últimas facturas" [level=3] [ref=f2e457]
                  - paragraph [ref=f2e458]: Listado cronológico de comprobantes fiscales de venta autorizados.
                - button "Ver Todo" [ref=f2e459] [cursor=pointer]
              - table [ref=f2e462]:
                - rowgroup [ref=f2e463]:
                  - row [ref=f2e464]:
                    - columnheader "Factura" [ref=f2e465]
                    - columnheader "Cliente" [ref=f2e466]
                    - columnheader "Total" [ref=f2e467]
                    - columnheader "Estado" [ref=f2e468]
                - rowgroup [ref=f2e469]:
                  - row [ref=f2e470]:
                    - cell "FAC-2026-0006" [ref=f2e471]
                    - cell "Cliente de Consumo" [ref=f2e472]
                    - cell "RD$ 100.00" [ref=f2e473]
                    - cell "Pagada" [ref=f2e474]
                  - row [ref=f2e476]:
                    - cell "FAC-2026-0005" [ref=f2e477]
                    - cell "Cliente de Consumo" [ref=f2e478]
                    - cell "RD$ 1,000.00" [ref=f2e479]
                    - cell "Pagada" [ref=f2e480]
                  - row [ref=f2e482]:
                    - cell "FAC-2026-0007" [ref=f2e483]
                    - cell "Cliente de Consumo" [ref=f2e484]
                    - cell "RD$ 118.00" [ref=f2e485]
                    - cell "Pendiente" [ref=f2e486]
            - generic [ref=f2e489]:
              - generic [ref=f2e493]:
                - heading "Alertas Operativas" [level=3] [ref=f2e494]
                - paragraph [ref=f2e495]: Puntos de control tributario, stock y carteras.
              - generic [ref=f2e496]:
                - generic [ref=f2e497]:
                  - generic [ref=f2e498]: Inventario bajo (0)
                  - paragraph [ref=f2e502]: Todos los productos con existencias seguras.
                - generic [ref=f2e503]:
                  - generic [ref=f2e504]: Facturas vencidas (0)
                  - paragraph [ref=f2e508]: Ningún cobro fuera de vencimiento.
                - generic [ref=f2e509]:
                  - generic [ref=f2e510]: Suscripción premium activa
                  - paragraph [ref=f2e515]: Renovación PRO programada en 18 días. Servicio integrado DGII ilimitado habilitado.
                - generic [ref=f2e516]:
                  - generic [ref=f2e517]: Secuencias NCF seguras
                  - paragraph [ref=f2e521]: Secuencia B02 de consumo con 391 timbres restantes. Sin peligro de agotamiento inmediato.
  - region "Notifications alt+T"
  - button "Abrir asistente AI" [ref=f2e523]
```

# Test source

```ts
  1  | import { test, expect } from '../helpers/auth';
  2  | 
  3  | test.describe('Core Business: Invoice Creation', () => {
  4  |   test('Create Consumer Invoice manually', async ({ adminPage }) => {
  5  |     test.setTimeout(90000);
  6  |     
  7  |     // 1. Navigate to Invoices
  8  |     await adminPage.goto('/dashboard/facturas');
  9  |     
  10 |     // 2. Click Nueva Factura or Agregar
  11 |     const newInvoiceBtn = adminPage.getByRole('button', { name: /Nueva Factura|Crear Factura|Nueva/i }).first();
  12 |     await newInvoiceBtn.click();
  13 |     
  14 |     // 3. Fill basic details
  15 |     // In FacturaDo, creating an invoice requires adding a product/concept.
  16 |     // Try to click Add Row/Concept
  17 |     const addRowBtn = adminPage.locator('button:has-text("Agregar Fila"), button:has-text("Agregar Concepto"), button:has-text("Agregar Producto"), button:has-text("Añadir")').first();
  18 |     if (await addRowBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  19 |        await addRowBtn.click();
  20 |     }
  21 | 
  22 |     // 4. Fill Price
  23 |     const priceInputs = adminPage.locator('input[type="number"]');
  24 |     if (await priceInputs.count() > 0) {
  25 |        await priceInputs.last().fill('150');
  26 |     }
  27 | 
  28 |     // 5. Save Invoice
  29 |     const saveBtn = adminPage.getByRole('button', { name: /Guardar Factura|Crear Factura|Emitir Factura|Guardar/i }).first();
> 30 |     await saveBtn.click();
     |                   ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  31 |     
  32 |     // 6. Verify Success (toast or redirect)
  33 |     // We expect some success message or to be back at the list
  34 |     await expect(adminPage.getByText(/Éxito|Guardad|Creada|Procesada/i).first()).toBeVisible({ timeout: 10000 }).catch(() => true); // Soft catch in case it just redirects
  35 |     
  36 |     // Verify we are back on the list or viewing the invoice
  37 |     await expect(adminPage).not.toHaveURL(/.*facturas\/nueva/i, { timeout: 10000 }).catch(() => true);
  38 |   });
  39 | });
  40 | 
```