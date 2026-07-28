import { test, expect } from '../helpers/auth';

test.describe('Dashboard Extended - Test Suite 47', () => {
  test('Extended smoke test 47', async ({ adminPage }) => { 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
  
  test('Extended UI test 47', async ({ adminPage }) => { 
    await adminPage.setViewportSize({ width: 375, height: 812 }); 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
});