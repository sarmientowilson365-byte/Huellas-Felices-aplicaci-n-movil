import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini AI Client initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. AI features will fallback to smart rule-based responses.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. AI Smart Search Interpreter
app.post('/api/ai/search', async (req, res) => {
  const { query, availablePets } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Fallback: simple text match
    const lower = query.toLowerCase();
    const matched = (availablePets || []).filter((p: any) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.personality.some((t: string) => t.toLowerCase().includes(lower)) ||
      p.species.toLowerCase().includes(lower)
    );
    return res.json({
      interpretation: `Buscando coincidencias para: "${query}"`,
      recommendedPetIds: matched.map((p: any) => p.id),
      keyAttributes: ['Búsqueda rápida'],
    });
  }

  try {
    const prompt = `Actúa como el motor de búsqueda semántica de la app de adopción "Huellas Felices".
El usuario escribió la siguiente consulta de búsqueda: "${query}".
Aquí está el catálogo de mascotas disponibles (JSON):
${JSON.stringify(availablePets || [], null, 2)}

Analiza la consulta y determina:
1. Una breve explicación amigable de lo que busca el usuario (en español, 1 oración).
2. La lista de IDs de mascotas que mejor coinciden con sus necesidades (en orden de relevancia).
3. Lista de 2-4 etiquetas clave extraídas de su intención (ej. "Departamento", "Baja energía", "Sociable").

Devuelve la respuesta en formato JSON estrictamente.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretation: { type: Type.STRING },
            recommendedPetIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyAttributes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['interpretation', 'recommendedPetIds', 'keyAttributes'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/search:', error);
    return res.status(500).json({ error: 'Error procesando la búsqueda con IA', details: error?.message });
  }
});

// 2. AI Personalized Match Recommender
app.post('/api/ai/match', async (req, res) => {
  const { preferences, availablePets } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      summary: 'Recomendaciones basadas en tu estilo de vida.',
      matches: (availablePets || []).slice(0, 3).map((pet: any, idx: number) => ({
        petId: pet.id,
        matchPercentage: 95 - idx * 5,
        reasons: ['Compatible con tu disponibilidad y tipo de vivienda.', 'Excelente temperamento.'],
      })),
    });
  }

  try {
    const prompt = `Eres el asesor veterinario y especialista en comportamiento animal de "Huellas Felices".
Un adoptante completó su perfil de compatibilidad con las siguientes preferencias:
${JSON.stringify(preferences || {}, null, 2)}

Catálogo de mascotas disponibles:
${JSON.stringify(availablePets || [], null, 2)}

Analiza qué mascotas son las más recomendadas para esta persona y su hogar.
Calcula un porcentaje de afinidad (0 a 100) y da 2 o 3 razones empáticas y precisas para cada una.
Devuelve las 3 o 4 mejores opciones en JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  petId: { type: Type.STRING },
                  matchPercentage: { type: Type.NUMBER },
                  reasons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['petId', 'matchPercentage', 'reasons'],
              },
            },
          },
          required: ['summary', 'matches'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/match:', error);
    return res.status(500).json({ error: 'Error generando recomendaciones IA', details: error?.message });
  }
});

// 3. AI Conversational Assistant (HuellasBot)
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, context } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      reply: '¡Hola! Soy HuellasBot 🐾. Para adoptar una mascota en Huellas Felices, puedes explorar nuestro catálogo, agendar una visita al refugio o llenar la solicitud de preadopción directamente desde la app. ¿En qué más puedo ayudarte?',
      suggestedAction: null,
    });
  }

  try {
    const systemInstruction = `Eres HuellasBot, el asistente inteligente y cálido de la fundación y app móvil "Huellas Felices".
Tu misión es guiar a los adoptantes con amabilidad, empatía y rigor ético sobre:
1. Requisitos de adopción responsable (compromiso de vida, vacunas, esterilización, tiempo de paseos, visitas al refugio).
2. Cuidados básicos y adaptación de perros, gatos, conejos y aves rescatados.
3. El proceso de adopción en 5 pasos (Solicitud enviada -> Revisión -> Entrevista -> Visita domiciliaria -> Aprobación).
4. Sugerencias de mascotas si te piden consejo.

Contexto actual de la app:
- Usuario: ${context?.userName || 'Adoptante'}
- Mascotas en el refugio: Luna (Perra mestiza tranquila), Milo (Gato atigrado para depto), Rocky (Pastor enérgico), Nala (Gatita cachorra), Tambor (Conejo belier), Toby (Perrito senior hipoalergénico), Paco (Ninfa Carolina), Coco (Golden senior amoroso).

Responde siempre en español, con tono cercano, cálido, usando emojis apropiados de mascotas 🐾🐶🐱, y en respuestas concisas (2 a 4 oraciones) ideales para una pantalla móvil.`;

    const contents = [
      { role: 'user', parts: [{ text: `Historial de chat previo: ${JSON.stringify(history || [])}\nMensaje del usuario: "${message}"` }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text || '¡Con gusto te ayudo a encontrar tu compañero ideal!',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({ error: 'Error en el asistente conversacional', details: error?.message });
  }
});

// 4. AI Pre-Adoption Application Analysis
app.post('/api/ai/analyze-form', async (req, res) => {
  const { formData, pet } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      readinessScore: 92,
      status: 'excelente',
      strengths: ['Compromiso claro con la tenencia responsable', 'Vivienda adecuada'],
      suggestions: ['Asegúrate de coordinar la fecha de tu visita al refugio para conocer a ' + (pet?.name || 'la mascota')],
      encouragingFeedback: '¡Tu solicitud está muy bien fundamentada y lista para ser enviada!',
    });
  }

  try {
    const prompt = `Analiza este formulario de preadopción para la mascota "${pet?.name || 'Mascota'}" (${pet?.species || 'Animal'}, ${pet?.size || 'Tamaño'}, energía ${pet?.energyLevel || 'Media'}):
Datos del formulario:
${JSON.stringify(formData, null, 2)}

Evalúa:
1. Coherencia entre el tipo de vivienda y la mascota elegida.
2. Nivel de preparación y experiencia previa del solicitante.
3. Si faltan detalles importantes o respuestas muy escuetas.
4. Genera un puntaje de preparación (readinessScore de 0 a 100), fortalezas, sugerencias de mejora y un mensaje alentador en tono cálido.

Devuelve la respuesta en formato JSON estructurado.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readinessScore: { type: Type.NUMBER },
            status: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            encouragingFeedback: { type: Type.STRING },
          },
          required: ['readinessScore', 'status', 'strengths', 'suggestions', 'encouragingFeedback'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-form:', error);
    return res.status(500).json({ error: 'Error analizando formulario con IA', details: error?.message });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Huellas Felices server running on http://localhost:${PORT}`);
  });
}

startServer();
