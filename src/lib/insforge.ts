import { createClient } from '@insforge/sdk';

const baseUrl = (import.meta as any).env?.VITE_INSFORGE_BASE_URL || 'https://zdwuav42.us-east.insforge.app';
const anonKey = (import.meta as any).env?.VITE_INSFORGE_API_KEY || 'ik_6c00d197d71798784cb69a5536c67fe1';

export const insforge = createClient({
  baseUrl,
  anonKey
});
