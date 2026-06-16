import { createClient } from '@insforge/sdk';

const baseUrl = (import.meta as any).env?.VITE_INSFORGE_BASE_URL || 'https://zdwuav42.us-east.insforge.app';
const anonKey = (import.meta as any).env?.VITE_INSFORGE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs';

export const insforge = createClient({
  baseUrl,
  anonKey
});
