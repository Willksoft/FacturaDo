import { test, expect } from '../helpers/auth';

test.describe('Dashboard Extended - Test Suite 49', () => {
  test('Extended smoke test 49', async ({ adminPage }) => { 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
  
  test('Extended UI test 49', async ({ adminPage }) => { 
    await adminPage.setViewportSize({ width: 375, height: 812 }); 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
});