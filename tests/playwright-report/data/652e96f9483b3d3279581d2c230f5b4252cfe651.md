# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard\generated_dashboard_test_13.spec.ts >> Dashboard Module - Test Suite 13 >> Smoke test 13 for dashboard
- Location: tests\e2e\dashboard\generated_dashboard_test_13.spec.ts:5:3

# Error details

```
Error: page.goto: Navigation to "https://facturadord.com/dashboard" is interrupted by another navigation to "https://facturadord.com/"
Call log:
  - navigating to "https://facturadord.com/dashboard", waiting until "load"

```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '../helpers/auth';
  3  | 
  4  | test.describe('Dashboard Module - Test Suite 13', () => {
  5  |   test('Smoke test 13 for dashboard', async ({ adminPage }) => {
  6  |     // Navigate to a section
> 7  |     await adminPage.goto('/dashboard');
     |                     ^ Error: page.goto: Navigation to "https://facturadord.com/dashboard" is interrupted by another navigation to "https://facturadord.com/"
  8  |     await expect(adminPage).toHaveURL(/.*dashboard/);
  9  |     
  10 |     // Check if sidebar is visible
  11 |     const sidebar = adminPage.locator('aside');
  12 |     if (await sidebar.isVisible()) {
  13 |        await expect(sidebar).toBeVisible();
  14 |     }
  15 |   });
  16 | 
  17 |   test('UI responsiveness test 13 for dashboard', async ({ adminPage }) => {
  18 |     await adminPage.setViewportSize({ width: 375, height: 812 }); // Mobile
  19 |     await adminPage.goto('/dashboard');
  20 |     // Ensure the hamburger menu or mobile layout works
  21 |     await expect(adminPage).toHaveURL(/.*dashboard/);
  22 |   });
  23 | });
  24 | 
```