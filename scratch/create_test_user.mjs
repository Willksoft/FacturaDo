import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://zdwuav42.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs'
});

async function registerTestUser() {
  const email = process.argv[2] || 'test.facturado.user@gmail.com';
  const password = process.argv[3] || 'FacturaDo2026#Test';

  console.log(`Intentando registrar usuario con correo: ${email}`);

  try {
    const res = await insforge.auth.signUp({
      email,
      password,
      name: 'Usuario Pruebas FacturaDo'
    });
    console.log('Resultado del registro InsForge Auth:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error al registrar usuario:', err);
  }
}

registerTestUser();
