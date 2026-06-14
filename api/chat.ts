import { streamText } from 'ai';

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
      model: 'openai/gpt-4o-mini', // Usamos un modelo rápido y barato/gratis
      system: `Eres el Asistente AI de FacturaDo, una plataforma SaaS moderna dominicana de facturación, inventario y reportes.
      Tu tono es profesional, súper amigable, útil y directo.
      El usuario te preguntará sobre cómo usar la plataforma, consejos de negocio, o sobre los datos de sus ventas.
      Responde de forma concisa. Usa emojis ocasionalmente para mantener el estilo "Pro Max" de la plataforma.`,
      messages,
    });

    // Devuelve el stream directamente al cliente usando el protocolo de UI Message Stream
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('Error en AI Gateway:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
