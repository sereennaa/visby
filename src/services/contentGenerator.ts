/**
 * AI-powered content generation pipeline for the admin panel.
 * Generates quiz questions, flashcards, country facts, and story templates
 * using an OpenAI-compatible API. Designed for batch generation through the admin dashboard.
 */

const API_URL = process.env.EXPO_PUBLIC_AI_CHAT_URL || '';
const API_KEY = process.env.EXPO_PUBLIC_AI_CHAT_KEY || '';

export const isContentGenConfigured = API_URL.length > 0 && API_KEY.length > 0;

interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correct: number;
  category: string;
}

interface GeneratedFlashcard {
  front: string;
  back: string;
  icon: string;
  deck: string;
}

interface GeneratedFact {
  title: string;
  content: string;
  icon: string;
  category: string;
}

interface GeneratedStory {
  title: string;
  segments: Array<{ text: string; blank?: { answer: string; options: string[] } }>;
}

const CONTENT_TIMEOUT_MS = 30_000;

async function callAI(systemPrompt: string, userPrompt: string, wantJson = true): Promise<string> {
  if (!isContentGenConfigured) {
    throw new Error('AI content generation not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONTENT_TIMEOUT_MS);

  try {
    const body: Record<string, unknown> = {
      model: process.env.EXPO_PUBLIC_AI_CHAT_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    };

    if (wantJson) {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseJsonArray<T>(raw: string): T[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') {
      const firstArray = Object.values(parsed).find(Array.isArray);
      if (firstArray) return firstArray as T[];
    }
  } catch {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch { /* fall through */ }
    }
  }
  return [];
}

function parseJsonObject<T>(raw: string): T | null {
  try {
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch { /* fall through */ }
    }
  }
  return null;
}

export async function generateQuizQuestions(
  countryName: string,
  countryId: string,
  category: string,
  count: number = 10,
): Promise<GeneratedQuizQuestion[]> {
  const systemPrompt = `You are a kids educational content creator for a travel learning app. Generate age-appropriate (6-12) quiz questions about ${countryName}. Each question should have 4 options with one correct answer. Respond with valid JSON.`;

  const userPrompt = `Generate ${count} multiple-choice quiz questions about ${countryName} in the "${category}" category. Return as JSON: {"questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"category":"${category}"}]}`;

  try {
    const raw = await callAI(systemPrompt, userPrompt);
    return parseJsonArray<GeneratedQuizQuestion>(raw);
  } catch {
    return [];
  }
}

export async function generateFlashcards(
  countryName: string,
  deck: string,
  count: number = 15,
): Promise<GeneratedFlashcard[]> {
  const systemPrompt = `You are creating flashcards for a kids travel learning app. Cards should teach words, phrases, or cultural facts about ${countryName}. Respond with valid JSON.`;

  const userPrompt = `Generate ${count} flashcards for the "${deck}" deck about ${countryName}. Return as JSON: {"flashcards":[{"front":"...(question/word)","back":"...(answer/translation)","icon":"🌍","deck":"${deck}"}]}`;

  try {
    const raw = await callAI(systemPrompt, userPrompt);
    return parseJsonArray<GeneratedFlashcard>(raw);
  } catch {
    return [];
  }
}

export async function generateCountryFacts(
  countryName: string,
  count: number = 10,
): Promise<GeneratedFact[]> {
  const systemPrompt = `You are writing fun, kid-friendly facts about ${countryName} for a travel learning app (ages 6-12). Facts should be fascinating, accurate, and engaging. Respond with valid JSON.`;

  const userPrompt = `Generate ${count} fun facts about ${countryName}. Mix categories: culture, food, language, nature, history, fun. Return as JSON: {"facts":[{"title":"...","content":"...","icon":"culture|food|language|nature|history|fun","category":"culture|food|language|nature|history|fun"}]}`;

  try {
    const raw = await callAI(systemPrompt, userPrompt);
    return parseJsonArray<GeneratedFact>(raw);
  } catch {
    return [];
  }
}

export async function generateStoryTemplate(
  countryName: string,
  topic: string,
): Promise<GeneratedStory | null> {
  const systemPrompt = `You create fill-in-the-blank cultural stories for a kids travel learning app. Stories teach about ${countryName}. Each blank has one correct answer and three wrong options. Respond with valid JSON.`;

  const userPrompt = `Create a fill-in-the-blank story about "${topic}" in ${countryName}. The story should have 4 blanks. Return as JSON: {"title":"...","segments":[{"text":"..."},{"text":"","blank":{"answer":"correct","options":["correct","wrong1","wrong2","wrong3"]}},{"text":"..."},...]}`;

  try {
    const raw = await callAI(systemPrompt, userPrompt);
    return parseJsonObject<GeneratedStory>(raw);
  } catch {
    return null;
  }
}

/** Batch generate all content types for a country */
export async function generateCountryContent(
  countryName: string,
  countryId: string,
): Promise<{
  quizQuestions: GeneratedQuizQuestion[];
  flashcards: GeneratedFlashcard[];
  facts: GeneratedFact[];
  story: GeneratedStory | null;
}> {
  const [quizQuestions, flashcards, facts, story] = await Promise.all([
    generateQuizQuestions(countryName, countryId, 'culture', 10),
    generateFlashcards(countryName, `${countryId}_basics`, 15),
    generateCountryFacts(countryName, 8),
    generateStoryTemplate(countryName, `traditions of ${countryName}`),
  ]);

  return { quizQuestions, flashcards, facts, story };
}
