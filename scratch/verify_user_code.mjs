import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://zdwuav42.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs'
});

async function confirmUserEmail() {
  const email = process.argv[2] || 'willksoft+test2026@gmail.com';
  const otp = process.argv[3];

  if (!otp) {
    console.log('Uso: node verify_user_code.mjs <correo> <codigo_otp>');
    return;
  }

  console.log(`Verificando correo ${email} con código OTP ${otp}...`);
  try {
    const res = await insforge.auth.verifyEmail({ email, otp });
    console.log('Resultado de verificación:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error durante la verificación:', err);
  }
}

confirmUserEmail();
