import { test, expect } from '../helpers/auth';

test.describe('Core Business: POS Sale Flow', () => {
  test('Complete cash sale successfully', async ({ adminPage }) => {
    test.setTimeout(90000);
    
    // 1. Navigate to POS
    await adminPage.goto('/dashboard/pos');
    
    // 2. Open Shift if needed
    const openShiftBtn = adminPage.getByRole('button', { name: /Abrir Turno/i });
    if (await openShiftBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await adminPage.getByLabel(/Fondo Inicial/i).fill('500');
      await openShiftBtn.click();
      await adminPage.waitForLoadState('networkidle');
    }

    // 3. Add product to cart (FacturaDo usually has cards with 'Agregar' or a plus icon)
    // We try to find a generic add to cart button
    const addToCartBtn = adminPage.locator('button:has-text("Agregar"), button[aria-label="Agregar"]').first();
    
    try {
      await addToCartBtn.waitFor({ state: 'visible', timeout: 5000 });
      await addToCartBtn.click();
    } catch (e) {
      console.log('No products found or add button different, clicking first generic button inside product grid');
      // Click on the first visible card in the grid as fallback
      await adminPage.locator('.grid > div').first().click(); 
    }

    // 4. Initiate Checkout
    const checkoutBtn = adminPage.getByRole('button', { name: /Cobrar|Facturar|Procesar/i });
    await checkoutBtn.click();

    // 5. Fill Cash Amount to exactly match total
    // We overpay to ensure it covers
    const cashInput = adminPage.locator('input[type="number"]').first();
    await cashInput.fill('99999'); 

    // 6. Finalize Sale
    const finalizeBtn = adminPage.getByRole('button', { name: /Registrar Venta/i });
    await finalizeBtn.click();

    // 7. Verify Success
    await expect(adminPage.getByText(/Procesado con Éxito/i)).toBeVisible({ timeout: 10000 });
  });
});
