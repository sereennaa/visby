/**
 * Story chapters: overarching "explorer's journey" unlocked by milestones.
 * When a chapter is unlocked, we show a story beat (ProgressionOverlay or modal).
 */

export type ChapterUnlockType = 'countries_visited' | 'lessons_completed' | 'badges_earned' | 'stamps_collected';

export interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  /** Story beat id to mark when shown (e.g. 'chapter_1') */
  storyBeatId: string;
  unlock: {
    type: ChapterUnlockType;
    value: number;
  };
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter_1',
    title: 'First Festival Step',
    subtitle: 'Every journey starts with one visit. You\'ve opened your map — Holi in India, lanterns in Taiwan, apres ski in the Alps… the world\'s festivals await!',
    storyBeatId: 'chapter_first_map',
    unlock: { type: 'countries_visited', value: 1 },
  },
  {
    id: 'chapter_2',
    title: 'Curious Mind',
    subtitle: 'Learning opens doors. You\'ve completed 3 lessons — soon you\'ll discover Songkran, Carnival, and Diwali!',
    storyBeatId: 'chapter_curious_mind',
    unlock: { type: 'lessons_completed', value: 3 },
  },
  {
    id: 'chapter_3',
    title: 'Stamp Collector',
    subtitle: 'Your passport is filling up. 5 stamps and counting — from lantern festivals to midnight sun!',
    storyBeatId: 'chapter_stamp_collector',
    unlock: { type: 'stamps_collected', value: 5 },
  },
  {
    id: 'chapter_4',
    title: 'Rising Star',
    subtitle: 'Badges prove your journey. You\'ve earned 3 — festivals from 60 countries are within reach!',
    storyBeatId: 'chapter_rising_star',
    unlock: { type: 'badges_earned', value: 3 },
  },
];

export function getChapterUnlockCurrent(
  type: ChapterUnlockType,
  state: { countriesVisited?: number; lessonsCompleted?: number; stampsCount?: number; badgesCount?: number }
): number {
  switch (type) {
    case 'countries_visited':
      return state.countriesVisited ?? 0;
    case 'lessons_completed':
      return state.lessonsCompleted ?? 0;
    case 'stamps_collected':
      return state.stampsCount ?? 0;
    case 'badges_earned':
      return state.badgesCount ?? 0;
    default:
      return 0;
  }
}
