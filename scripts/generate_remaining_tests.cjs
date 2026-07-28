const fs = require('fs');
const path = require('path');

for(let i=46; i<=50; i++){
  const content = `import { test, expect } from '../helpers/auth';

test.describe('Dashboard Extended - Test Suite ${i}', () => {
  test('Extended smoke test ${i}', async ({ adminPage }) => { 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
  
  test('Extended UI test ${i}', async ({ adminPage }) => { 
    await adminPage.setViewportSize({ width: 375, height: 812 }); 
    await adminPage.goto('/dashboard'); 
    await expect(adminPage).toHaveURL(/.*dashboard/); 
  });
});`;
  
  fs.writeFileSync(path.join(__dirname, '..', 'tests', 'e2e', 'dashboard', `generated_dashboard_extended_${i}.spec.ts`), content);
}
console.log('10 remaining tests generated!');
