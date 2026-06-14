import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Configura Vercel AI SDK Gateway
const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY || '',
  // Nota: Si usas una base URL de Vercel Gateway específica, añádela aquí:
  // baseURL: 'https://gateway.vercel.com/v1/projects/my-project/endpoints/my-endpoint',
});

// Opción para ejecutar en el Edge (más rápido y barato en Vercel)
export const config = {
  runtime: 'edge',
};

// Vercel Serverless Function (Web Request API)
export default async function POST(req: Request) {
  try {
    // Analiza los mensajes enviados desde el frontend (useChat hook)
    const { messages } = await req.json();

    // Stream de texto usando el modelo correspondiente
    const result = await streamText({
      model: openai('gpt-4o-mini'), // Usamos un modelo rápido y barato/gratis
      system: `Eres el Asistente AI de FacturaDo, una plataforma SaaS moderna dominicana de facturación, inventario y reportes.
      Tu tono es profesional, súper amigable, útil y directo.
      El usuario te preguntará sobre cómo usar la plataforma, consejos de negocio, o sobre los datos de sus ventas.
      Responde de forma concisa. Usa emojis ocasionalmente para mantener el estilo "Pro Max" de la plataforma.`,
      messages,
    });

    // Devuelve el stream directamente al cliente
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Error en AI Gateway:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
