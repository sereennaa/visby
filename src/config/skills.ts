import type { IconName } from '../components/ui/Icon';
import type { SkillProgress } from '../types';

export interface SkillAction {
  label: string;
  screen: string;
  params?: Record<string, unknown>;
}

export interface SkillConfigItem {
  key: keyof SkillProgress;
  label: string;
  icon: IconName;
  hint: string;
  actions: SkillAction[];
}

/** Order matches RadarChart axes: Language, Geography, Culture, History, Cooking, Exploration */
export const SKILL_CONFIG: SkillConfigItem[] = [
  {
    key: 'language',
    label: 'Language',
    icon: 'language',
    hint: 'Lessons, Word Match, and quizzes boost this skill.',
    actions: [
      { label: 'Do a lesson', screen: 'LessonCategory', params: { categoryId: 'language' } },
      { label: 'Play Word Match', screen: 'WordMatch' },
      { label: 'Take a quiz', screen: 'Quiz' },
    ],
  },
  {
    key: 'geography',
    label: 'Geography',
    icon: 'geography',
    hint: 'Treasure Hunt, map exploration, and geography lessons boost this skill.',
    actions: [
      { label: 'Play Treasure Hunt', screen: 'TreasureHunt' },
      { label: 'Explore the map', screen: 'Main', params: { screen: 'Explore', params: { screen: 'WorldMap' } } },
      { label: 'Geography lessons', screen: 'LessonCategory', params: { categoryId: 'geography' } },
    ],
  },
  {
    key: 'culture',
    label: 'Culture',
    icon: 'culture',
    hint: 'Lessons, quizzes, and collecting stamps boost this skill.',
    actions: [
      { label: 'Culture lessons', screen: 'LessonCategory', params: { categoryId: 'culture' } },
      { label: 'Take a quiz', screen: 'Quiz' },
      { label: 'View stamps', screen: 'Stamps' },
    ],
  },
  {
    key: 'history',
    label: 'History',
    icon: 'history',
    hint: 'History lessons and quizzes boost this skill.',
    actions: [
      { label: 'History lessons', screen: 'LessonCategory', params: { categoryId: 'history' } },
      { label: 'Take a quiz', screen: 'Quiz' },
    ],
  },
  {
    key: 'cooking',
    label: 'Cooking',
    icon: 'food',
    hint: 'Cooking game and logging bites boost this skill.',
    actions: [
      { label: 'Play Cooking Game', screen: 'CookingGame' },
      { label: 'Log a bite', screen: 'AddBite' },
    ],
  },
  {
    key: 'exploration',
    label: 'Exploration',
    icon: 'compass',
    hint: 'Treasure Hunt, exploring the map, and visiting country rooms boost this skill.',
    actions: [
      { label: 'Play Treasure Hunt', screen: 'TreasureHunt' },
      { label: 'Explore the map', screen: 'Main', params: { screen: 'Explore', params: { screen: 'WorldMap' } } },
      { label: 'Explore the world', screen: 'Main', params: { screen: 'Explore' } },
    ],
  },
];

export const SKILL_KEYS_ORDER: (keyof SkillProgress)[] = [
  'language',
  'geography',
  'culture',
  'history',
  'cooking',
  'exploration',
];

export function getSkillConfig(key: keyof SkillProgress): SkillConfigItem | undefined {
  return SKILL_CONFIG.find((c) => c.key === key);
}
