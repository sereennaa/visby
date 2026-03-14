import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { COUNTRIES } from '../config/constants';
import {
  ALL_QUIZ_QUESTIONS,
  ALL_FLASHCARDS,
  LESSON_CONTENT,
  COUNTRY_QUIZ_QUESTIONS,
  type QuizQuestion,
  type FlashcardItem,
  type LessonData,
} from '../config/learningContent';
import {
  COUNTRY_HOUSES,
  type CountryHouseData,
  type HouseRoom,
  type RoomObject,
} from '../config/countryRooms';
import { COSMETICS_CATALOG, type ShopCosmetic } from '../config/cosmetics';
import { SAMPLE_LOCATIONS, type SampleLocation } from '../config/locations';
import type { Country, CountryFact } from '../types';

// -------------------------------------------------------------------
// Cache keys & in-memory store
// -------------------------------------------------------------------

const STORAGE_PREFIX = 'visby_content_';

const CACHE_KEYS = {
  countries: `${STORAGE_PREFIX}countries`,
  quizQuestions: `${STORAGE_PREFIX}quiz_questions`,
  countryQuizQuestions: `${STORAGE_PREFIX}country_quiz_questions`,
  flashcards: `${STORAGE_PREFIX}flashcards`,
  lessons: `${STORAGE_PREFIX}lessons`,
  rooms: `${STORAGE_PREFIX}rooms`,
  locations: `${STORAGE_PREFIX}locations`,
  cosmetics: `${STORAGE_PREFIX}cosmetics`,
} as const;

const cache = new Map<string, unknown>();

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function warn(msg: string, err?: unknown) {
  if (__DEV__) {
    console.warn(`[contentService] ${msg}`, err ?? '');
  }
}

async function persistToStorage<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {
    warn(`Failed to persist ${key}`);
  }
}

async function loadFromStorage<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    warn(`Failed to load ${key} from storage`);
    return null;
  }
}

// -------------------------------------------------------------------
// Row → local-type transformers (snake_case → camelCase)
// -------------------------------------------------------------------

function rowToCountryFact(r: Record<string, unknown>): CountryFact {
  return {
    id: r.id as string,
    countryId: r.country_id as string,
    title: r.title as string,
    content: r.content as string,
    icon: r.icon as string,
    category: r.category as CountryFact['category'],
  };
}

function rowToCountry(r: Record<string, unknown>, facts: CountryFact[]): Country {
  return {
    id: r.id as string,
    name: r.name as string,
    countryCode: r.country_code as string,
    flagEmoji: r.flag_emoji as string,
    visitCostAura: r.visit_cost_aura as number,
    housePriceAura: r.house_price_aura as number,
    description: r.description as string,
    roomTheme: r.room_theme as Country['roomTheme'],
    accentColor: r.accent_color as string,
    imageUrl: (r.image_url as string) || undefined,
    facts,
  };
}

function rowToQuizQuestion(r: Record<string, unknown>): QuizQuestion {
  return {
    id: r.id as string,
    question: r.question as string,
    options: r.options as string[],
    correct: r.correct as number,
    category: r.category as string,
  };
}

function rowToFlashcard(r: Record<string, unknown>): FlashcardItem {
  return {
    id: r.id as string,
    front: r.front as string,
    back: r.back as string,
    icon: r.icon as string,
    deck: r.deck as string,
  };
}

function rowToLessonSlide(r: Record<string, unknown>) {
  return {
    text: r.text as string,
    icon: r.icon as string,
  };
}

function rowToRoomObject(r: Record<string, unknown>): RoomObject {
  return {
    id: r.id as string,
    icon: r.icon as string,
    label: r.label as string,
    x: r.x as number,
    y: r.y as number,
    interactive: (r.interactive as boolean) || undefined,
    learnTitle: (r.learn_title as string) || undefined,
    learnContent: (r.learn_content as string) || undefined,
    auraReward: (r.aura_reward as number) || undefined,
  };
}

function rowToHouseRoom(r: Record<string, unknown>, objects: RoomObject[]): HouseRoom {
  return {
    id: r.id as string,
    name: r.name as string,
    icon: r.icon as string,
    wallColor: r.wall_color as string,
    floorColor: r.floor_color as string,
    objects,
  };
}

function rowToLocation(r: Record<string, unknown>): SampleLocation {
  return {
    id: r.id as string,
    name: r.name as string,
    type: r.type as SampleLocation['type'],
    distanceKm: r.distance_km as number,
    description: r.description as string,
  };
}

function rowToCosmetic(r: Record<string, unknown>): ShopCosmetic {
  return {
    id: r.id as string,
    name: r.name as string,
    description: r.description as string,
    type: r.type as ShopCosmetic['type'],
    rarity: r.rarity as ShopCosmetic['rarity'],
    price: r.price as number,
    country: (r.country as string) || undefined,
    icon: r.icon as ShopCosmetic['icon'],
    membersOnly: (r.members_only as boolean) || undefined,
  };
}

// -------------------------------------------------------------------
// Fetch helpers (Supabase → transform → cache → persist)
// -------------------------------------------------------------------

async function fetchCountries(): Promise<Country[]> {
  const { data: countryRows, error: cErr } = await supabase
    .from('countries')
    .select('*')
    .order('name');
  if (cErr) throw cErr;

  const { data: factRows, error: fErr } = await supabase
    .from('country_facts')
    .select('*');
  if (fErr) throw fErr;

  const factsByCountry = new Map<string, CountryFact[]>();
  for (const r of factRows ?? []) {
    const fact = rowToCountryFact(r);
    const list = factsByCountry.get(fact.countryId) ?? [];
    list.push(fact);
    factsByCountry.set(fact.countryId, list);
  }

  return (countryRows ?? []).map(r =>
    rowToCountry(r, factsByCountry.get(r.id as string) ?? []),
  );
}

async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  const { data, error } = await supabase.from('quiz_questions').select('*');
  if (error) throw error;
  return (data ?? []).map(rowToQuizQuestion);
}

async function fetchFlashcards(): Promise<FlashcardItem[]> {
  const { data, error } = await supabase.from('flashcards').select('*');
  if (error) throw error;
  return (data ?? []).map(rowToFlashcard);
}

async function fetchLessons(): Promise<Record<string, LessonData>> {
  const { data: lessonRows, error: lErr } = await supabase
    .from('lessons')
    .select('*');
  if (lErr) throw lErr;

  const { data: slideRows, error: sErr } = await supabase
    .from('lesson_slides')
    .select('*')
    .order('sort_order');
  if (sErr) throw sErr;

  const slidesByLesson = new Map<string, { text: string; icon: string }[]>();
  for (const r of slideRows ?? []) {
    const lessonId = r.lesson_id as string;
    const list = slidesByLesson.get(lessonId) ?? [];
    list.push(rowToLessonSlide(r));
    slidesByLesson.set(lessonId, list);
  }

  const result: Record<string, LessonData> = {};
  for (const r of lessonRows ?? []) {
    const id = r.id as string;
    result[id] = {
      title: r.title as string,
      slides: slidesByLesson.get(id) ?? [],
    };
  }
  return result;
}

async function fetchRooms(countryId: string): Promise<CountryHouseData> {
  const { data: roomRows, error: rErr } = await supabase
    .from('rooms')
    .select('*')
    .eq('country_id', countryId)
    .order('sort_order');
  if (rErr) throw rErr;

  const roomIds = (roomRows ?? []).map(r => r.id as string);
  const { data: objRows, error: oErr } = await supabase
    .from('room_objects')
    .select('*')
    .in('room_id', roomIds.length > 0 ? roomIds : ['__none__']);
  if (oErr) throw oErr;

  const objectsByRoom = new Map<string, RoomObject[]>();
  for (const r of objRows ?? []) {
    const roomId = r.room_id as string;
    const list = objectsByRoom.get(roomId) ?? [];
    list.push(rowToRoomObject(r));
    objectsByRoom.set(roomId, list);
  }

  return {
    rooms: (roomRows ?? []).map(r =>
      rowToHouseRoom(r, objectsByRoom.get(r.id as string) ?? []),
    ),
  };
}

async function fetchLocations(): Promise<SampleLocation[]> {
  const { data, error } = await supabase.from('locations').select('*');
  if (error) throw error;
  return (data ?? []).map(rowToLocation);
}

async function fetchCosmetics(): Promise<ShopCosmetic[]> {
  const { data, error } = await supabase.from('cosmetics').select('*');
  if (error) throw error;
  return (data ?? []).map(rowToCosmetic);
}

// -------------------------------------------------------------------
// Generic cached-fetch wrapper
// -------------------------------------------------------------------

async function cachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached as T;

  if (!isSupabaseConfigured) {
    const result = fallback();
    cache.set(cacheKey, result);
    return result;
  }

  try {
    const result = await fetcher();
    cache.set(cacheKey, result);
    persistToStorage(cacheKey, result);
    return result;
  } catch (err) {
    warn(`Fetch failed for ${cacheKey}, using fallback`, err);
    const result = fallback();
    cache.set(cacheKey, result);
    return result;
  }
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

export const contentService = {
  async getCountries(): Promise<Country[]> {
    return cachedFetch(
      CACHE_KEYS.countries,
      fetchCountries,
      () => COUNTRIES,
    );
  },

  async getQuizQuestions(category?: string): Promise<QuizQuestion[]> {
    const all = await cachedFetch(
      CACHE_KEYS.quizQuestions,
      fetchQuizQuestions,
      () => ALL_QUIZ_QUESTIONS,
    );
    return category ? all.filter(q => q.category === category) : all;
  },

  async getFlashcards(deck?: string): Promise<FlashcardItem[]> {
    const all = await cachedFetch(
      CACHE_KEYS.flashcards,
      fetchFlashcards,
      () => ALL_FLASHCARDS,
    );
    return deck ? all.filter(f => f.deck === deck) : all;
  },

  async getLessons(): Promise<Record<string, LessonData>> {
    return cachedFetch(
      CACHE_KEYS.lessons,
      fetchLessons,
      () => LESSON_CONTENT,
    );
  },

  async getRooms(countryId: string): Promise<CountryHouseData> {
    const key = `${CACHE_KEYS.rooms}_${countryId}`;
    return cachedFetch(
      key,
      () => fetchRooms(countryId),
      () => COUNTRY_HOUSES[countryId] ?? { rooms: [] },
    );
  },

  async getLocations(): Promise<SampleLocation[]> {
    return cachedFetch(
      CACHE_KEYS.locations,
      fetchLocations,
      () => SAMPLE_LOCATIONS,
    );
  },

  async getCosmetics(): Promise<ShopCosmetic[]> {
    return cachedFetch(
      CACHE_KEYS.cosmetics,
      fetchCosmetics,
      () => COSMETICS_CATALOG,
    );
  },
};

// -------------------------------------------------------------------
// Cache management
// -------------------------------------------------------------------

export async function refreshContent(): Promise<void> {
  cache.clear();

  await Promise.all([
    contentService.getCountries(),
    contentService.getQuizQuestions(),
    contentService.getFlashcards(),
    contentService.getLessons(),
    contentService.getLocations(),
    contentService.getCosmetics(),
  ]);
}

export async function loadCachedContent(): Promise<void> {
  const pairs: [string, (data: unknown) => void][] = [
    [CACHE_KEYS.countries, d => cache.set(CACHE_KEYS.countries, d)],
    [CACHE_KEYS.quizQuestions, d => cache.set(CACHE_KEYS.quizQuestions, d)],
    [CACHE_KEYS.flashcards, d => cache.set(CACHE_KEYS.flashcards, d)],
    [CACHE_KEYS.lessons, d => cache.set(CACHE_KEYS.lessons, d)],
    [CACHE_KEYS.locations, d => cache.set(CACHE_KEYS.locations, d)],
    [CACHE_KEYS.cosmetics, d => cache.set(CACHE_KEYS.cosmetics, d)],
  ];

  await Promise.all(
    pairs.map(async ([key, setter]) => {
      const stored = await loadFromStorage(key);
      if (stored != null) setter(stored);
    }),
  );

  // Refresh from network in background (non-blocking)
  if (isSupabaseConfigured) {
    refreshContent().catch(err => warn('Background refresh failed', err));
  }
}

export default contentService;
