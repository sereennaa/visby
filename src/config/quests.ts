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
  /** How we derive current value: 'lessons_completed' | 'stamp_countries' */
  progressType: 'lessons_completed' | 'stamp_countries';
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
];

export function getQuestById(id: string): QuestDefinition | undefined {
  return QUEST_DEFINITIONS.find((q) => q.id === id);
}
