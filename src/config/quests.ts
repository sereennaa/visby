import { getCurrentSeason, getCurrentSeasonLabel } from './worldCalendar';

/**
 * Quest chains: multi-step challenges that award bonus Aura (and optionally badges).
 * Progress is derived from store state; completion is persisted.
 */
export interface QuestDefinition {
  id: string;
  label: string;
  subtitle: string;
  target: number;
  rewardAura: number;
  /** How we derive current value */
  progressType: 'lessons_completed' | 'stamp_countries' | 'seasonal_visit' | 'first_country' | 'facts_read_total';
  /** If set, quest is only active and shown during this season key (e.g. "2025-spring"). */
  seasonal?: boolean;
  /** Optional chapter/story id for narrative grouping. */
  chapterId?: string;
  /** Short story blurb for narrative payoff. */
  storyBlurb?: string;
}

export const QUEST_DEFINITIONS: QuestDefinition[] = [
  {
    id: 'three_lessons',
    label: 'Complete 3 lessons',
    subtitle: 'Finish any 3 lessons to earn bonus Aura',
    target: 3,
    rewardAura: 50,
    progressType: 'lessons_completed',
  },
  {
    id: 'three_countries_stamps',
    label: 'Stamps in 3 countries',
    subtitle: 'Collect at least one stamp in 3 different countries',
    target: 3,
    rewardAura: 75,
    progressType: 'stamp_countries',
  },
  {
    id: 'seasonal_explorer',
    label: `Visit a country this ${getCurrentSeasonLabel()}`,
    subtitle: `Explore anywhere in the world during ${getCurrentSeasonLabel()} to earn bonus Aura!`,
    target: 1,
    rewardAura: 40,
    progressType: 'seasonal_visit',
    seasonal: true,
    storyBlurb: "Visby's world changes with the seasons — you made it part of this one!",
  },
  {
    id: 'first_journey',
    label: 'Visit your first country',
    subtitle: 'Open the world map and visit any country to begin your journey.',
    target: 1,
    rewardAura: 30,
    progressType: 'first_country',
    chapterId: 'chapter_1',
    storyBlurb: "You've opened your first map. The world is waiting!",
  },
  {
    id: 'discovery_learner',
    label: 'Read 5 facts in country rooms',
    subtitle: 'Tap objects in country rooms to learn fun facts.',
    target: 5,
    rewardAura: 45,
    progressType: 'facts_read_total',
    chapterId: 'chapter_2',
    storyBlurb: "Every fact is a step toward being a world explorer!",
  },
];

export function getQuestById(id: string): QuestDefinition | undefined {
  return QUEST_DEFINITIONS.find((q) => q.id === id);
}

/** Returns the seasonal explorer quest with label updated for current season. */
export function getSeasonalExplorerQuest(): QuestDefinition | undefined {
  const q = QUEST_DEFINITIONS.find((x) => x.id === 'seasonal_explorer');
  if (!q) return undefined;
  return {
    ...q,
    label: `Visit a country this ${getCurrentSeasonLabel()}`,
    subtitle: `Explore anywhere in the world during ${getCurrentSeasonLabel()} to earn bonus Aura!`,
  };
}
