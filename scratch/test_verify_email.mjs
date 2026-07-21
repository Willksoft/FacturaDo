import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://zdwuav42.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs'
});

async function testOtp() {
  const res1 = await insforge.auth.verifyEmail({ email: 'willksoft+test2026@gmail.com', otp: '123456' });
  console.log('Res with otp:', res1);

  const res2 = await insforge.auth.verifyEmail({ email: 'willksoft+test2026@gmail.com', code: '123456' });
  console.log('Res with code:', res2);
}

testOtp();
