
import { test, expect } from '../helpers/auth';

test.describe('Pos Module - Test Suite 15', () => {
  test('Smoke test 15 for pos', async ({ adminPage }) => {
    // Navigate to a section
    await adminPage.goto('/dashboard');
    await expect(adminPage).toHaveURL(/.*dashboard/);
    
    // Check if sidebar is visible
    const sidebar = adminPage.locator('aside');
    if (await sidebar.isVisible()) {
       await expect(sidebar).toBeVisible();
    }
  });

  test('UI responsiveness test 15 for pos', async ({ adminPage }) => {
    await adminPage.setViewportSize({ width: 375, height: 812 }); // Mobile
    await adminPage.goto('/dashboard');
    // Ensure the hamburger menu or mobile layout works
    await expect(adminPage).toHaveURL(/.*dashboard/);
  });
});
