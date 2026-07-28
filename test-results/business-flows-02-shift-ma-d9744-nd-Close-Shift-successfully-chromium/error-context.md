# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: business-flows\02-shift-management.spec.ts >> Core Business: Shift Management >> Open and Close Shift successfully
- Location: tests\e2e\business-flows\02-shift-management.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Abrir Turno/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /Abrir Turno/i }).first()

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
  3  | test.describe('Core Business: Shift Management', () => {
  4  |   test('Open and Close Shift successfully', async ({ adminPage }) => {
  5  |     test.setTimeout(90000);
  6  |     await adminPage.goto('/dashboard/pos');
  7  |     
  8  |     // 1. Close shift if already open to ensure clean state
  9  |     const closeShiftBtn = adminPage.getByRole('button', { name: /Cerrar Turno/i }).first();
  10 |     if (await closeShiftBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  11 |       await closeShiftBtn.click();
  12 |       
  13 |       // Fill the cash recount
  14 |       const actualCashInput = adminPage.locator('input[type="number"]').first();
  15 |       await actualCashInput.fill('99999'); 
  16 |       
  17 |       // Submit close
  18 |       await adminPage.getByRole('button', { name: /Cerrar Turno y Guardar/i }).click();
  19 |       await adminPage.waitForLoadState('networkidle');
  20 |     }
  21 | 
  22 |     // 2. Open a new shift
  23 |     const openShiftBtn = adminPage.getByRole('button', { name: /Abrir Turno/i }).first();
> 24 |     await expect(openShiftBtn).toBeVisible({ timeout: 5000 });
     |                                ^ Error: expect(locator).toBeVisible() failed
  25 |     
  26 |     // Add initial balance
  27 |     const initBalanceInput = adminPage.getByLabel(/Fondo Inicial/i);
  28 |     if (await initBalanceInput.isVisible()) {
  29 |       await initBalanceInput.fill('500');
  30 |     }
  31 |     
  32 |     await openShiftBtn.click();
  33 | 
  34 |     // 3. Verify it opened by checking if the close shift button appears
  35 |     await expect(adminPage.getByRole('button', { name: /Cerrar Turno/i }).first()).toBeVisible({ timeout: 10000 });
  36 |   });
  37 | });
  38 | 
```