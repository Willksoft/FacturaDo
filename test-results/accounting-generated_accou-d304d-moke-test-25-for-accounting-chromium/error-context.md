# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accounting\generated_accounting_test_25.spec.ts >> Accounting Module - Test Suite 25 >> Smoke test 25 for accounting
- Location: tests\e2e\accounting\generated_accounting_test_25.spec.ts:5:3

# Error details

```
Error: page.goto: net::ERR_ABORTED at https://facturadord.com/dashboard
Call log:
  - navigating to "https://facturadord.com/dashboard", waiting until "load"

```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '../helpers/auth';
  3  | 
  4  | test.describe('Accounting Module - Test Suite 25', () => {
  5  |   test('Smoke test 25 for accounting', async ({ adminPage }) => {
  6  |     // Navigate to a section
> 7  |     await adminPage.goto('/dashboard');
     |                     ^ Error: page.goto: net::ERR_ABORTED at https://facturadord.com/dashboard
  8  |     await expect(adminPage).toHaveURL(/.*dashboard/);
  9  |     
  10 |     // Check if sidebar is visible
  11 |     const sidebar = adminPage.locator('aside');
  12 |     if (await sidebar.isVisible()) {
  13 |        await expect(sidebar).toBeVisible();
  14 |     }
  15 |   });
  16 | 
  17 |   test('UI responsiveness test 25 for accounting', async ({ adminPage }) => {
  18 |     await adminPage.setViewportSize({ width: 375, height: 812 }); // Mobile
  19 |     await adminPage.goto('/dashboard');
  20 |     // Ensure the hamburger menu or mobile layout works
  21 |     await expect(adminPage).toHaveURL(/.*dashboard/);
  22 |   });
  23 | });
  24 | 
```