const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o';
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const isAIConfigured = API_KEY.length > 0;

const ANALYSIS_TIMEOUT_MS = 30_000;
const RETRY_DELAY_MS = 2_000;

const VALID_COUNTRY_IDS = [
  'jp', 'fr', 'mx', 'it', 'gb', 'br', 'kr', 'th', 'ma', 'pe', 'ke', 'no', 'tr', 'gr',
];

const VALID_CATEGORIES = ['landmark', 'food', 'nature', 'culture', 'hidden_gem'];
const VALID_TYPES = ['city', 'landmark', 'park', 'beach', 'museum', 'market', 'temple', 'mountain', 'restaurant'];

export interface LocationAnalysis {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  country_id: string;
  country_name: string;
  category: string;
  type: string;
  learning_points: number;
  confidence: 'low' | 'medium' | 'high';
}

function stripMarkdownFences(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return raw.trim();
}

function buildRequestBody(imageUrl: string) {
  return {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an expert travel and geography analyst for a kids' educational app (ages 6-12). Given a photo, identify the location and provide structured data about it.

You MUST respond with valid JSON matching this exact schema:
{
  "name": "Name of the place or landmark",
  "description": "A 1-2 sentence kid-friendly interesting fact or caption about this place. Make it fun and educational.",
  "latitude": 0.0,
  "longitude": 0.0,
  "country_id": "two-letter country code",
  "country_name": "Full country name",
  "category": "one of: landmark, food, nature, culture, hidden_gem",
  "type": "one of: city, landmark, park, beach, museum, market, temple, mountain, restaurant",
  "learning_points": 10,
  "confidence": "one of: low, medium, high"
}

Rules:
- country_id must be one of: ${VALID_COUNTRY_IDS.join(', ')}. If the country is not in this list, pick the closest match or leave empty.
- category must be one of: ${VALID_CATEGORIES.join(', ')}
- type must be one of: ${VALID_TYPES.join(', ')}
- learning_points: integer 1-15 reflecting educational significance (famous world wonder = 15, local restaurant = 5, typical landmark = 10)
- confidence should reflect how certain you are about the specific location (high = recognized landmark, medium = general area identified, low = best guess)
- Coordinates should be as accurate as possible for the identified location
- The description should be engaging for kids -- fun facts, superlatives, comparisons they can relate to`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this photo. Identify the location, provide coordinates, and write a kid-friendly caption.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'high' },
          },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  };
}

async function callVisionAPI(imageUrl: string, signal: AbortSignal): Promise<Response> {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(buildRequestBody(imageUrl)),
    signal,
  });
}

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function analyzeLocationImage(imageUrl: string): Promise<LocationAnalysis> {
  if (!isAIConfigured) {
    throw new Error('OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);

  try {
    let response = await callVisionAPI(imageUrl, controller.signal);

    if (!response.ok && isRetryable(response.status)) {
      console.warn(`[AI] Retrying after ${response.status}...`);
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      response = await callVisionAPI(imageUrl, controller.signal);
    }

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error(`[AI] OpenAI error ${response.status}:`, errBody);
      throw new Error('Analysis failed. Please try again.');
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';
    const cleaned = stripMarkdownFences(raw);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('[AI] Failed to parse response:', raw);
      throw new Error('Analysis failed. The AI returned an invalid response.');
    }

    return {
      name: String(parsed.name || ''),
      description: String(parsed.description || ''),
      latitude: Number(parsed.latitude) || 0,
      longitude: Number(parsed.longitude) || 0,
      country_id: VALID_COUNTRY_IDS.includes(parsed.country_id as string) ? (parsed.country_id as string) : '',
      country_name: String(parsed.country_name || ''),
      category: VALID_CATEGORIES.includes(parsed.category as string) ? (parsed.category as string) : 'landmark',
      type: VALID_TYPES.includes(parsed.type as string) ? (parsed.type as string) : 'landmark',
      learning_points: Math.max(1, Math.min(15, Math.round(Number(parsed.learning_points) || 10))),
      confidence: ['low', 'medium', 'high'].includes(parsed.confidence as string) ? (parsed.confidence as 'low' | 'medium' | 'high') : 'medium',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
