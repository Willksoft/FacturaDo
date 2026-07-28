import { test, expect } from '../helpers/auth';

test.describe('Core Business: Shift Management', () => {
  test('Open and Close Shift successfully', async ({ adminPage }) => {
    test.setTimeout(90000);
    await adminPage.goto('/dashboard/pos');
    
    // 1. Close shift if already open to ensure clean state
    const closeShiftBtn = adminPage.getByRole('button', { name: /Cerrar Turno/i }).first();
    if (await closeShiftBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await closeShiftBtn.click();
      
      // Fill the cash recount
      const actualCashInput = adminPage.locator('input[type="number"]').first();
      await actualCashInput.fill('99999'); 
      
      // Submit close
      await adminPage.getByRole('button', { name: /Cerrar Turno y Guardar/i }).click();
      await adminPage.waitForLoadState('networkidle');
    }

    // 2. Open a new shift
    const openShiftBtn = adminPage.getByRole('button', { name: /Abrir Turno/i }).first();
    await expect(openShiftBtn).toBeVisible({ timeout: 5000 });
    
    // Add initial balance
    const initBalanceInput = adminPage.getByLabel(/Fondo Inicial/i);
    if (await initBalanceInput.isVisible()) {
      await initBalanceInput.fill('500');
    }
    
    await openShiftBtn.click();

    // 3. Verify it opened by checking if the close shift button appears
    await expect(adminPage.getByRole('button', { name: /Cerrar Turno/i }).first()).toBeVisible({ timeout: 10000 });
  });
});
