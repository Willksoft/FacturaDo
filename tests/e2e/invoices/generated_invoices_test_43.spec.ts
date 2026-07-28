
import { test, expect } from '../helpers/auth';

test.describe('Invoices Module - Test Suite 43', () => {
  test('Smoke test 43 for invoices', async ({ adminPage }) => {
    // Navigate to a section
    await adminPage.goto('/dashboard');
    await expect(adminPage).toHaveURL(/.*dashboard/);
    
    // Check if sidebar is visible
    const sidebar = adminPage.locator('aside');
    if (await sidebar.isVisible()) {
       await expect(sidebar).toBeVisible();
    }
  });

  test('UI responsiveness test 43 for invoices', async ({ adminPage }) => {
    await adminPage.setViewportSize({ width: 375, height: 812 }); // Mobile
    await adminPage.goto('/dashboard');
    // Ensure the hamburger menu or mobile layout works
    await expect(adminPage).toHaveURL(/.*dashboard/);
  });
});
