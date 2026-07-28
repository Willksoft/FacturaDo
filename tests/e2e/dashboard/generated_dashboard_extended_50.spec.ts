import { test, expect } from '../helpers/auth';

test.describe('Dashboard Extended - Test Suite 50', () => {
  test('Extended smoke test 50', async ({ adminPage }) => { 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
  
  test('Extended UI test 50', async ({ adminPage }) => { 
    await adminPage.setViewportSize({ width: 375, height: 812 }); 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
});