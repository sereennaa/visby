/**
 * Seasonal events configuration.
 * Time-limited events with special rewards, missions, and cosmetics.
 */

import type { SeasonalEvent, DailyMission } from '../types';
import type { ParticleShape } from './countryAtmosphere';

export interface SeasonalVisuals {
  particleVariant: 'sparkle' | 'stars' | 'mixed' | 'snow' | 'hearts' | 'petals' | 'dust' | 'aurora';
  particleShape?: ParticleShape;
  particleColors?: readonly string[];
  backgroundTint: string;
  backgroundTintOpacity: number;
  houseDecoration?: 'lanterns' | 'snowcaps' | 'leaves' | 'flowers' | 'lights' | 'flags';
}

export const SEASONAL_VISUALS: Record<string, SeasonalVisuals> = {
  cherry_blossom: {
    particleVariant: 'petals',
    particleShape: 'petal',
    particleColors: ['#FFB6C1', '#FFC0CB', '#FFE4EC', '#FFFFFF'],
    backgroundTint: '#FFE4EC',
    backgroundTintOpacity: 0.08,
    houseDecoration: 'lanterns',
  },
  summer_explorer: {
    particleVariant: 'sparkle',
    particleShape: 'star',
    particleColors: ['#FFD700', '#FFA500', '#FFE082', '#FFF59D'],
    backgroundTint: '#FFF8DC',
    backgroundTintOpacity: 0.06,
    houseDecoration: 'flags',
  },
  harvest_feast: {
    particleVariant: 'mixed',
    particleShape: 'leaf',
    particleColors: ['#D2691E', '#DEB887', '#F4A460', '#CD853F', '#FFE4B5'],
    backgroundTint: '#FAEBD7',
    backgroundTintOpacity: 0.07,
    houseDecoration: 'leaves',
  },
  winter_lights: {
    particleVariant: 'snow',
    particleShape: 'snowflake',
    particleColors: ['#E3F2FD', '#BBDEFB', '#E0E0E0', '#F5F5F5'],
    backgroundTint: '#E3F2FD',
    backgroundTintOpacity: 0.1,
    houseDecoration: 'snowcaps',
  },
  world_culture_week: {
    particleVariant: 'mixed',
    particleColors: ['#9370DB', '#E6E6FA', '#DDA0DD', '#BA55D3'],
    backgroundTint: '#E6E6FA',
    backgroundTintOpacity: 0.06,
    houseDecoration: 'flags',
  },
  earth_week: {
    particleVariant: 'mixed',
    particleShape: 'leaf',
    particleColors: ['#90EE90', '#98FB98', '#8FBC8F', '#3CB371'],
    backgroundTint: '#E8F5E9',
    backgroundTintOpacity: 0.08,
    houseDecoration: 'flowers',
  },
};

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'cherry_blossom',
    name: 'Cherry Blossom Festival',
    description: 'Celebrate spring in Japan! Double Aura on all Japanese activities.',
    icon: 'flower',
    startDate: '03-20',
    endDate: '04-10',
    auraMultiplier: 2.0,
    featuredCountryId: 'jp',
    exclusiveCosmetics: ['sakura_hat', 'blossom_outfit'],
    specialMissions: [
      { type: 'read_facts', label: 'Read 3 facts about Japan', target: 3 },
      { type: 'play_minigame', label: 'Play 2 mini-games in Japan', target: 2 },
    ],
    bgGradient: ['#FFB7C5', '#FFF0F5'],
  },
  {
    id: 'summer_explorer',
    name: 'Summer Explorer',
    description: 'The world is waiting! Visit 5 countries and earn exclusive beach gear.',
    icon: 'sun',
    startDate: '06-15',
    endDate: '07-15',
    auraMultiplier: 1.5,
    featuredCountryId: 'br',
    exclusiveCosmetics: ['sunglasses', 'beach_outfit', 'surfboard_accessory'],
    specialMissions: [
      { type: 'collect_stamp', label: 'Collect 2 stamps', target: 2 },
      { type: 'add_bite', label: 'Log 2 summer dishes', target: 2 },
    ],
    bgGradient: ['#FFD700', '#FFF8DC'],
  },
  {
    id: 'harvest_feast',
    name: 'Harvest Feast',
    description: 'Celebrate autumn harvests from around the world! Cooking games give triple Aura.',
    icon: 'nature',
    startDate: '10-01',
    endDate: '10-31',
    auraMultiplier: 1.5,
    featuredCountryId: 'mx',
    exclusiveCosmetics: ['harvest_hat', 'autumn_scarf'],
    specialMissions: [
      { type: 'add_bite', label: 'Log 3 bites', target: 3 },
      { type: 'complete_lesson', label: 'Complete 2 food lessons', target: 2 },
    ],
    bgGradient: ['#D2691E', '#FAEBD7'],
  },
  {
    id: 'winter_lights',
    name: 'Winter Lights',
    description: 'Discover winter traditions from around the globe! Special cosmetics and bonus Aura.',
    icon: 'snowflake',
    startDate: '12-15',
    endDate: '01-05',
    auraMultiplier: 2.0,
    featuredCountryId: 'no',
    exclusiveCosmetics: ['winter_crown', 'aurora_outfit', 'snowflake_accessory'],
    specialMissions: [
      { type: 'read_facts', label: 'Read 5 winter facts', target: 5 },
      { type: 'chat_with_visby', label: 'Chat with Visby about winter', target: 1 },
    ],
    bgGradient: ['#B0E0E6', '#F0F8FF'],
  },
  {
    id: 'world_culture_week',
    name: 'World Culture Week',
    description: "Learn about cultures you haven't explored yet! Bonus Aura for new countries.",
    icon: 'globe',
    startDate: '05-20',
    endDate: '05-27',
    auraMultiplier: 1.75,
    exclusiveCosmetics: ['globe_hat', 'diplomat_outfit'],
    specialMissions: [
      { type: 'complete_lesson', label: 'Complete 3 culture lessons', target: 3 },
      { type: 'play_minigame', label: 'Play 3 different mini-games', target: 3 },
    ],
    bgGradient: ['#9370DB', '#E6E6FA'],
  },
  {
    id: 'earth_week',
    name: 'Earth Week',
    description: 'Double Aura on sustainability lessons! Help the planet by learning with Visby.',
    icon: 'seedling',
    startDate: '04-18',
    endDate: '04-25',
    auraMultiplier: 2.0,
    exclusiveCosmetics: ['leaf_hat', 'earth_guardian_outfit', 'recycled_accessory'],
    specialMissions: [
      { type: 'complete_sustainability_lesson', label: 'Complete 2 sustainability lessons', target: 2 },
      { type: 'complete_lesson', label: 'Complete 1 planet lesson', target: 1 },
    ],
    bgGradient: ['#90EE90', '#E8F5E9'],
  },
];

/** Get the currently active event (if any) based on today's date */
export function getActiveEvent(): SeasonalEvent | null {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${month}-${day}`;

  return SEASONAL_EVENTS.find((event) => {
    if (event.startDate <= event.endDate) {
      return today >= event.startDate && today <= event.endDate;
    }
    // Wraps around year boundary (e.g., Dec 15 - Jan 5)
    return today >= event.startDate || today <= event.endDate;
  }) || null;
}

/** Get upcoming events (next 60 days) */
export function getUpcomingEvents(): SeasonalEvent[] {
  const now = new Date();
  const sixtyDaysLater = new Date(now);
  sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);

  return SEASONAL_EVENTS.filter((event) => {
    const [mm, dd] = event.startDate.split('-').map(Number);
    const eventDate = new Date(now.getFullYear(), mm - 1, dd);
    if (eventDate < now) eventDate.setFullYear(eventDate.getFullYear() + 1);
    return eventDate >= now && eventDate <= sixtyDaysLater;
  });
}

/** Get Aura multiplier including any active event bonus */
export function getEventAuraMultiplier(): number {
  const event = getActiveEvent();
  return event?.auraMultiplier || 1.0;
}

/** Get event-specific missions for today */
export function getEventMissions(): DailyMission[] {
  const event = getActiveEvent();
  return event?.specialMissions || [];
}

/** Get active event's visual overrides (particles, tint, house deco) */
export function getActiveSeasonalVisuals(): SeasonalVisuals | null {
  const event = getActiveEvent();
  if (!event) return null;
  return SEASONAL_VISUALS[event.id] ?? null;
}

// ─── WEEKLY EXPLORER CHALLENGES ───

export interface WeeklyChallenge {
  id: string;
  title: string;
  theme: string;
  icon: string;
  tasks: { description: string; type: string; target: number }[];
  cosmeticRewardName: string;
  auraBonus: number;
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'mythology_week', title: 'Mythology Week', theme: 'myths', icon: 'sparkles',
    tasks: [
      { description: 'Read 3 myth stories', type: 'read_myths', target: 3 },
      { description: 'Complete 2 myth quizzes', type: 'myth_quiz', target: 2 },
      { description: 'Visit 2 different country rooms', type: 'visit_countries', target: 2 },
      { description: 'Answer 10 quiz questions correctly', type: 'correct_answers', target: 10 },
      { description: 'Complete your daily streak', type: 'daily_streak', target: 1 },
    ],
    cosmeticRewardName: 'Mythkeeper Crown',
    auraBonus: 200,
  },
  {
    id: 'food_week', title: 'Food Around the World', theme: 'food', icon: 'food',
    tasks: [
      { description: 'Complete the Food lesson', type: 'complete_lesson', target: 1 },
      { description: 'Read 5 facts about food', type: 'read_food_facts', target: 5 },
      { description: 'Play the Cooking Game', type: 'play_cooking', target: 1 },
      { description: 'Learn 5 new food phrases', type: 'learn_phrases', target: 5 },
      { description: 'Visit 3 country rooms', type: 'visit_countries', target: 3 },
    ],
    cosmeticRewardName: 'Master Chef Hat',
    auraBonus: 200,
  },
  {
    id: 'language_week', title: 'Language Explorer', theme: 'language', icon: 'language',
    tasks: [
      { description: 'Learn 10 new phrases', type: 'learn_phrases', target: 10 },
      { description: 'Complete 3 language lessons', type: 'complete_lesson', target: 3 },
      { description: 'Play Word Match game', type: 'play_word_match', target: 1 },
      { description: 'Review 15 flashcards', type: 'review_flashcards', target: 15 },
      { description: 'Say hello in 5 languages', type: 'hello_languages', target: 5 },
    ],
    cosmeticRewardName: 'Polyglot Badge',
    auraBonus: 250,
  },
  {
    id: 'nature_week', title: 'Nature Detective', theme: 'nature', icon: 'nature',
    tasks: [
      { description: 'Read 5 animal facts', type: 'read_nature', target: 5 },
      { description: 'Visit a country with unique wildlife', type: 'visit_countries', target: 1 },
      { description: 'Complete 2 nature quizzes', type: 'nature_quiz', target: 2 },
      { description: 'Read about 3 endangered species', type: 'endangered_species', target: 3 },
      { description: 'Earn 100 Aura from learning', type: 'earn_aura', target: 100 },
    ],
    cosmeticRewardName: 'Wildlife Explorer Vest',
    auraBonus: 200,
  },
  {
    id: 'history_week', title: 'Ancient History', theme: 'history', icon: 'history',
    tasks: [
      { description: 'Read 3 history moments', type: 'read_history', target: 3 },
      { description: 'Complete 2 history quizzes', type: 'history_quiz', target: 2 },
      { description: 'Visit Egypt or Greece room', type: 'visit_ancient', target: 1 },
      { description: 'Play the Treasure Hunt game', type: 'play_treasure', target: 1 },
      { description: 'Answer a What-If question', type: 'what_if', target: 1 },
    ],
    cosmeticRewardName: 'Time Traveler Cloak',
    auraBonus: 200,
  },
];

export function getCurrentWeeklyChallenge(): WeeklyChallenge {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
}
