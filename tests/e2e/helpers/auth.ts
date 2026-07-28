import { test as base, expect, Page } from '@playwright/test';

export const test = base.extend<{ adminPage: Page }>({
  adminPage: async ({ page }, use) => {
    await page.goto('/login');
    
    // Hacer clic en "INICIAR CON CORREO" si existe para revelar el formulario
    const emailLoginBtn = page.getByRole('button', { name: /INICIAR CON CORREO/i }).first();
    await emailLoginBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    if (await emailLoginBtn.isVisible()) {
      await emailLoginBtn.click();
    }
    
    // Check if we need to log in
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    if (await emailInput.isVisible()) {
      await emailInput.fill('willksoft+test2026@gmail.com');
      await page.locator('input[type="password"]').fill('FacturaDo2026#Pass');
      await page.locator('button:has-text("Iniciar sesión"), button:has-text("Entrar")').first().click();
      await page.waitForURL(/.*dashboard/);
    }

    // Handle onboarding skip if present
    const skipButton = page.locator('button:has-text("Omitir por ahora"), a:has-text("Omitir por ahora")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
      await page.waitForTimeout(1000); // Wait for transition
    }

    await use(page);
  },
});

export { expect };
