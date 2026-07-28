# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: business-flows\04-payroll-processing.spec.ts >> Core Business: Payroll Processing >> Calculate payroll for current period
- Location: tests\e2e\business-flows\04-payroll-processing.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1, h2, h3').filter({ hasText: /Nómina|Nomina|Payroll/i }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1, h2, h3').filter({ hasText: /Nómina|Nomina|Payroll/i }).first()

```

```yaml
- complementary:
  - img
  - button
  - button "Dashboard"
  - button "Estado de mi negocio"
  - button "Facturación"
  - button "Clientes"
  - button "Productos"
  - button "Compras"
  - button "Finanzas"
  - button "Reportes"
  - button "Nómina y R.H."
  - button "Centro de Presupuestos"
  - button "Configuración"
  - text: U Usuario Pruebas FacturaDo Administrador
  - button "Cerrar sesión"
- banner:
  - textbox "Buscar rápido..."
  - button "Nueva Operación"
  - button "Notificaciones"
- main:
  - button "7 Nivel 2 850 / 1400 XP":
    - img
    - text: 7 Nivel 2 850 / 1400 XP
  - heading "Calendario & Recordatorios Fiscales DGII julio 2026" [level=3]
  - paragraph: Fechas límites de presentación e impuestos vigentes de la República Dominicana
  - text: Día 20 Vencido (día 20)
  - heading "Declaración y Pago de IT-1 (ITBIS)" [level=4]
  - paragraph: Presentación mensual de Ventas, Compras e ITBIS cobrado vs pagado.
  - text: "Fecha: 20 de julio"
  - button "Ir a Reporte"
  - text: Día 15 Vencido (día 15)
  - heading "Envío de Formatos 606 y 607 (DGII)" [level=4]
  - paragraph: Envío obligatorio de compras, gastos y ventas del periodo a la Oficina Virtual.
  - text: "Fecha: 15 de julio"
  - button "Ir a Reporte"
  - text: Día 10 Vencido (día 10)
  - heading "Declaración IR-17 / Retenciones" [level=4]
  - paragraph: Declaración jurada de retenciones de ISR y retenciones a terceros.
  - text: "Fecha: 10 de julio"
  - button "Ir a Reporte"
  - img
  - text: Ventas de Hoy RD$ 1,218.00
  - paragraph: Cierre diario en tiempo real.
  - img
  - text: Ventas del Mes RD$ 1,218.00
  - paragraph: Volumen imponible gravable.
  - img
  - text: Gastos del Mes RD$ 2,000.00
  - paragraph: Reportados bajo formato 606.
  - img
  - text: Ganancia Neta RD$ -782.00
  - paragraph: Margen neto operativo estimado.
  - text: Facturas Pendientes 1 documentos
  - paragraph: Pendientes de abono fiscal.
  - text: Clientes Nuevos +5 este mes
  - paragraph: Prospectos y empresas de valor.
  - text: Poco Inventario 0 ítems
  - paragraph: Requieren reorden urgente.
  - text: Cuentas por Cobrar RD$ 118.00
  - paragraph: Cartera de cobros corriente.
  - heading "Gráfico de Ventas" [level=3]
  - paragraph: Evolución de facturación de comprobantes según rango seleccionado.
  - button "Últimos 7 días"
  - button "Últimos 30 días"
  - button "Últimos 12 meses"
  - img: RD$0k M 22 RD$0k J 23 RD$0k V 24 RD$0k S 25 RD$0k D 26 RD$0k L 27 RD$1k M 28
  - heading "Métodos de Pago" [level=3]
  - paragraph: Distribución de cobros y facturación según medio.
  - text: Efectivo 100% (1,218 DOP) Transferencia 0% (0 DOP) Tarjeta 0% (0 DOP) Cheque / Crédito 0% (0 DOP)
  - heading "Antigüedad de Saldos" [level=3]
  - paragraph: Distribución de cuentas por cobrar según días de atraso.
  - text: Al Día 0.1k 1-30 Días 0.0k 31-60 Días 0.0k 61-90 Días 0.0k > 90 Días 0.0k
  - heading "Flujo de Caja Predictivo (Próx. 4 Sem)" [level=3]
  - paragraph: Proyección de liquidez basada en cuentas por cobrar.
  - text: 0.0k Semana 1 0.0k Semana 2 0.0k Semana 3 0.0k Semana 4
  - heading "Últimas facturas" [level=3]
  - paragraph: Listado cronológico de comprobantes fiscales de venta autorizados.
  - button "Ver Todo"
  - table:
    - rowgroup:
      - row "Factura Cliente Total Estado":
        - columnheader "Factura"
        - columnheader "Cliente"
        - columnheader "Total"
        - columnheader "Estado"
    - rowgroup:
      - row "FAC-2026-0006 Cliente de Consumo RD$ 100.00 Pagada":
        - cell "FAC-2026-0006"
        - cell "Cliente de Consumo"
        - cell "RD$ 100.00"
        - cell "Pagada"
      - row "FAC-2026-0005 Cliente de Consumo RD$ 1,000.00 Pagada":
        - cell "FAC-2026-0005"
        - cell "Cliente de Consumo"
        - cell "RD$ 1,000.00"
        - cell "Pagada"
      - row "FAC-2026-0007 Cliente de Consumo RD$ 118.00 Pendiente":
        - cell "FAC-2026-0007"
        - cell "Cliente de Consumo"
        - cell "RD$ 118.00"
        - cell "Pendiente"
  - heading "Alertas Operativas" [level=3]
  - paragraph: Puntos de control tributario, stock y carteras.
  - text: Inventario bajo (0)
  - paragraph: Todos los productos con existencias seguras.
  - text: Facturas vencidas (0)
  - paragraph: Ningún cobro fuera de vencimiento.
  - text: Suscripción premium activa
  - paragraph: Renovación PRO programada en 18 días. Servicio integrado DGII ilimitado habilitado.
  - text: Secuencias NCF seguras
  - paragraph: Secuencia B02 de consumo con 391 timbres restantes. Sin peligro de agotamiento inmediato.
- region "Notifications alt+T"
- button "Abrir asistente AI"
```

# Test source

```ts
  1  | import { test, expect } from '../helpers/auth';
  2  | 
  3  | test.describe('Core Business: Payroll Processing', () => {
  4  |   test('Calculate payroll for current period', async ({ adminPage }) => {
  5  |     test.setTimeout(90000);
  6  |     
  7  |     // 1. Navigate to Payroll
  8  |     await adminPage.goto('/dashboard/nomina');
  9  |     
  10 |     // 2. Ensure page loaded without crashing (Smoke Check)
  11 |     await expect(adminPage.locator('body')).not.toContainText('useState is not defined');
  12 |     
  13 |     // 3. We look for a Calculate or Process button
  14 |     const processBtn = adminPage.getByRole('button', { name: /Calcular Nómina|Procesar Nómina|Generar Nómina|Calcular/i }).first();
  15 |     if (await processBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  16 |        await processBtn.click();
  17 |        
  18 |        // Verify some success message or table update
  19 |        await expect(adminPage.getByText(/Éxito|Procesada|Calculada/i).first()).toBeVisible({ timeout: 10000 }).catch(() => true);
  20 |     }
  21 |     
  22 |     // 4. Ensure no runtime errors crashed the page after interaction
> 23 |     await expect(adminPage.locator('h1, h2, h3').filter({ hasText: /Nómina|Nomina|Payroll/i }).first()).toBeVisible({ timeout: 10000 });
     |                                                                                                         ^ Error: expect(locator).toBeVisible() failed
  24 |   });
  25 | });
  26 | 
```