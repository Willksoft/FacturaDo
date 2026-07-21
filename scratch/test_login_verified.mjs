import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://zdwuav42.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs'
});

async function testSignIn() {
  const res = await insforge.auth.signInWithPassword({
    email: 'willksoft+test2026@gmail.com',
    password: 'FacturaDo2026#Pass'
  });
  console.log('Test Login Result:', JSON.stringify(res, null, 2));
}

testSignIn();
