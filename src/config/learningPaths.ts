/**
 * Learning path definitions — structured curriculum as a skill tree.
 * Each node is a lesson, quiz, flashcard deck, or game that unlocks the next.
 */

import type { LearningPathNode } from '../types';

export const LEARNING_PATH_NODES: LearningPathNode[] = [
  // ─── TIER 1: WELCOME (no prerequisites) ───
  {
    id: 'welcome_greetings',
    type: 'lesson',
    title: 'Greetings & Hello',
    icon: 'chat',
    requires: [],
    routeName: 'Lesson',
    routeParams: { lessonId: 'lang1' },
    skillCategory: 'language',
  },
  {
    id: 'welcome_quiz',
    type: 'quiz',
    title: 'Greetings Quiz',
    icon: 'quiz',
    requires: ['welcome_greetings'],
    routeName: 'Quiz',
    routeParams: { category: 'language' },
    skillCategory: 'language',
  },
  {
    id: 'welcome_flashcards',
    type: 'flashcards',
    title: 'Greeting Flashcards',
    icon: 'cards',
    requires: ['welcome_greetings'],
    routeName: 'Flashcards',
    routeParams: { deckId: 'greetings' },
    skillCategory: 'language',
  },

  // ─── TIER 2: GEOGRAPHY BASICS ───
  {
    id: 'geo_intro',
    type: 'lesson',
    title: 'World Geography',
    icon: 'globe',
    requires: ['welcome_quiz'],
    routeName: 'Lesson',
    routeParams: { lessonId: 'geo1' },
    skillCategory: 'geography',
  },
  {
    id: 'geo_flag_game',
    type: 'game',
    title: 'Flag Match Challenge',
    icon: 'flag',
    requires: ['geo_intro'],
    routeName: 'FlagMatch',
    skillCategory: 'geography',
  },
  {
    id: 'geo_map_pin',
    type: 'game',
    title: 'Map Pin Challenge',
    icon: 'map',
    requires: ['geo_intro'],
    routeName: 'MapPin',
    skillCategory: 'geography',
  },

  // ─── TIER 3: PLANET & PEOPLE (woven into early journey) ───
  {
    id: 'sustain_travel',
    type: 'lesson',
    title: 'Sustainable Travel',
    icon: 'compass',
    requires: ['geo_intro'],
    routeName: 'Lesson',
    routeParams: { lessonId: 'sustain_travel' },
    skillCategory: 'sustainability',
  },
  {
    id: 'sustain_flashcards',
    type: 'flashcards',
    title: 'Eco Words',
    icon: 'cards',
    requires: ['sustain_travel'],
    routeName: 'Flashcards',
    routeParams: { deckId: 'sustainability' },
    skillCategory: 'sustainability',
  },

  // ─── TIER 3: JAPAN DEEP DIVE ───
  {
    id: 'jp_intro',
    type: 'lesson',
    title: 'Discover Japan',
    icon: 'temple',
    requires: ['geo_flag_game'],
    countryId: 'jp',
    routeName: 'Lesson',
    routeParams: { lessonId: 'jp_intro' },
    skillCategory: 'culture',
  },
  {
    id: 'jp_food',
    type: 'lesson',
    title: 'Japanese Food',
    icon: 'food',
    requires: ['jp_intro'],
    countryId: 'jp',
    routeName: 'Lesson',
    routeParams: { lessonId: 'food1' },
    skillCategory: 'cooking',
  },
  {
    id: 'jp_cooking',
    type: 'game',
    title: 'Japanese Cooking',
    icon: 'cooking',
    requires: ['jp_food'],
    countryId: 'jp',
    routeName: 'CookingGame',
    routeParams: { countryId: 'jp' },
    skillCategory: 'cooking',
  },
  {
    id: 'jp_quiz',
    type: 'quiz',
    title: 'Japan Quiz',
    icon: 'quiz',
    requires: ['jp_intro'],
    countryId: 'jp',
    routeName: 'Quiz',
    routeParams: { category: 'culture' },
    skillCategory: 'culture',
  },
  {
    id: 'jp_word_match',
    type: 'game',
    title: 'Japanese Words',
    icon: 'language',
    requires: ['jp_intro'],
    countryId: 'jp',
    routeName: 'WordMatch',
    routeParams: { countryId: 'jp' },
    skillCategory: 'language',
  },

  // ─── TIER 4: FRANCE DEEP DIVE ───
  {
    id: 'fr_intro',
    type: 'lesson',
    title: 'Discover France',
    icon: 'landmark',
    requires: ['geo_map_pin'],
    countryId: 'fr',
    routeName: 'Lesson',
    routeParams: { lessonId: 'fr_intro' },
    skillCategory: 'culture',
  },
  {
    id: 'fr_food',
    type: 'lesson',
    title: 'French Cuisine',
    icon: 'food',
    requires: ['fr_intro'],
    countryId: 'fr',
    routeName: 'Lesson',
    routeParams: { lessonId: 'food1' },
    skillCategory: 'cooking',
  },
  {
    id: 'fr_quiz',
    type: 'quiz',
    title: 'France Quiz',
    icon: 'quiz',
    requires: ['fr_intro'],
    countryId: 'fr',
    routeName: 'Quiz',
    routeParams: { category: 'geography' },
    skillCategory: 'geography',
  },

  // ─── TIER 5: MORE PLANET LESSONS ───
  {
    id: 'sustain_food',
    type: 'lesson',
    title: 'Food & the Planet',
    icon: 'food',
    requires: ['jp_food'],
    routeName: 'Lesson',
    routeParams: { lessonId: 'sustain_food' },
    skillCategory: 'sustainability',
  },
  {
    id: 'sustain_oceans',
    type: 'lesson',
    title: 'Oceans & Beaches',
    icon: 'nature',
    requires: ['fr_intro'],
    routeName: 'Lesson',
    routeParams: { lessonId: 'sustain_oceans' },
    skillCategory: 'sustainability',
  },

  // ─── TIER 5: CULTURE & HISTORY ───
  {
    id: 'culture_lesson',
    type: 'lesson',
    title: 'World Cultures',
    icon: 'culture',
    requires: ['jp_quiz', 'fr_quiz'],
    routeName: 'Lesson',
    routeParams: { lessonId: 'culture1' },
    skillCategory: 'culture',
  },
  {
    id: 'culture_sort',
    type: 'game',
    title: 'Culture Sort',
    icon: 'sort',
    requires: ['culture_lesson'],
    routeName: 'SortCategorize',
    skillCategory: 'culture',
  },
  {
    id: 'history_intro',
    type: 'lesson',
    title: 'World History',
    icon: 'history',
    requires: ['culture_lesson'],
    routeName: 'Lesson',
    routeParams: { lessonId: 'hist1' },
    skillCategory: 'history',
  },
  {
    id: 'story_builder',
    type: 'game',
    title: 'Story Builder',
    icon: 'book',
    requires: ['history_intro'],
    routeName: 'StoryBuilder',
    skillCategory: 'culture',
  },

  // ─── TIER 6: DRESS UP & EXPLORE ───
  {
    id: 'dress_up',
    type: 'game',
    title: 'Culture Dress-Up',
    icon: 'outfit',
    requires: ['culture_sort'],
    routeName: 'CultureDressUp',
    skillCategory: 'culture',
  },
  {
    id: 'treasure_hunt_master',
    type: 'game',
    title: 'Master Treasure Hunt',
    icon: 'treasure',
    requires: ['dress_up', 'story_builder'],
    routeName: 'TreasureHunt',
    skillCategory: 'exploration',
  },

  // ─── TIER 7: ADVANCED SUSTAINABILITY ───
  {
    id: 'sustain_quiz',
    type: 'quiz',
    title: 'Planet Quiz',
    icon: 'quiz',
    requires: ['sustain_travel', 'sustain_food', 'sustain_oceans'],
    routeName: 'Quiz',
    routeParams: { category: 'sustainability' },
    skillCategory: 'sustainability',
  },
];

/** Get nodes that are currently unlockable (all prerequisites met) */
export function getUnlockableNodes(completedIds: string[]): LearningPathNode[] {
  const completed = new Set(completedIds);
  return LEARNING_PATH_NODES.filter(
    (node) => !completed.has(node.id) && node.requires.every((r) => completed.has(r)),
  );
}

/** Get a flat list of tiers for visual layout */
export function getPathTiers(): LearningPathNode[][] {
  const completed = new Set<string>();
  const tiers: LearningPathNode[][] = [];
  let remaining = [...LEARNING_PATH_NODES];

  while (remaining.length > 0) {
    const tier = remaining.filter((n) => n.requires.every((r) => completed.has(r)));
    if (tier.length === 0) break;
    tiers.push(tier);
    tier.forEach((n) => completed.add(n.id));
    remaining = remaining.filter((n) => !completed.has(n.id));
  }

  return tiers;
}

export function getNodeById(id: string): LearningPathNode | undefined {
  return LEARNING_PATH_NODES.find((n) => n.id === id);
}
