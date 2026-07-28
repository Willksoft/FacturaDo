import { createClient } from '@insforge/sdk';

const originalFetch = globalThis.fetch;
globalThis.fetch = async function(url, options) {
  console.log('FETCH URL:', url);
  console.log('FETCH METHOD:', options?.method || 'GET');
  if (options?.body) {
    console.log('FETCH BODY:', options.body);
  }
  const res = await originalFetch(url, options);
  console.log('FETCH RESPONSE STATUS:', res.status);
  return res;
};

const insforge = createClient({
  baseUrl: 'https://zdwuav42.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs'
});

async function run() {
  console.log('--- Testing Invoices ---');
  await insforge.database.from('invoices').select('*').limit(2);

  console.log('--- Testing Products ---');
  await insforge.database.from('products').select('*').limit(2);

  console.log('--- Testing NCF ---');
  await insforge.database.from('ncf_sequences').select('*').limit(2);

  console.log('--- Testing Auth ---');
  await insforge.auth.signInWithPassword({
    email: 'willksoft+test2026@gmail.com',
    password: 'FacturaDo2026#Pass'
  });
}

run();
