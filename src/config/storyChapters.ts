/**
 * Story chapters: overarching "explorer's journey" unlocked by milestones.
 * When a chapter is unlocked, we show a story beat (ProgressionOverlay or modal).
 */

export type ChapterUnlockType =
  | 'countriesVisited'
  | 'bitesCount'
  | 'lessonsCompleted'
  | 'badgesCount'
  | 'stampsCount'
  | 'housesOwned'
  | 'streakDays'
  | 'sustainabilityLessonsCompleted';

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
  /** Cosmetic ID awarded when chapter is unlocked */
  cosmeticReward: string;
  /** Hint for what to work toward for the next chapter */
  nextHint: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  // Act 1: The Awakening (Days 1-7)
  {
    id: 'chapter_1',
    title: 'First Steps',
    subtitle: 'Every journey starts with one visit. You\'ve opened your map — the world awaits!',
    storyBeatId: 'chapter_1_first_steps',
    unlock: { type: 'countriesVisited', value: 1 },
    cosmeticReward: 'chapter_1_badge',
    nextHint: 'Log 3 bites to taste the world!',
  },
  {
    id: 'chapter_2',
    title: 'A Taste of the World',
    subtitle: 'Food connects us to cultures. You\'ve logged 3 bites — your palate is expanding!',
    storyBeatId: 'chapter_2_taste_of_world',
    unlock: { type: 'bitesCount', value: 3 },
    cosmeticReward: 'chapter_2_badge',
    nextHint: 'Complete 3 lessons to feed your curious mind!',
  },
  {
    id: 'chapter_3',
    title: 'The Curious Mind',
    subtitle: 'Learning opens doors. You\'ve completed 3 lessons — soon you\'ll discover festivals from every corner of the globe!',
    storyBeatId: 'chapter_3_curious_mind',
    unlock: { type: 'lessonsCompleted', value: 3 },
    cosmeticReward: 'chapter_3_badge',
    nextHint: 'Earn 1 badge to start making friends!',
  },
  {
    id: 'chapter_4',
    title: 'Making Friends',
    subtitle: 'Badges prove your journey. You\'ve earned your first badge — you\'re officially part of the explorer community!',
    storyBeatId: 'chapter_4_making_friends',
    unlock: { type: 'badgesCount', value: 1 },
    cosmeticReward: 'chapter_4_badge',
    nextHint: 'Collect 5 stamps to grow your passport!',
  },
  // Act 2: The Explorer (Days 7-30)
  {
    id: 'chapter_5',
    title: 'Passport Growing',
    subtitle: 'Your passport is filling up. 5 stamps and counting — from lantern festivals to midnight sun!',
    storyBeatId: 'chapter_5_passport_growing',
    unlock: { type: 'stampsCount', value: 5 },
    cosmeticReward: 'chapter_5_badge',
    nextHint: 'Buy your first house to become a homemaker!',
  },
  {
    id: 'chapter_6',
    title: 'Homemaker',
    subtitle: 'You\'ve put down roots! Your first house means unlimited access — a true explorer\'s home base.',
    storyBeatId: 'chapter_6_homemaker',
    unlock: { type: 'housesOwned', value: 1 },
    cosmeticReward: 'chapter_6_badge',
    nextHint: 'Complete 10 lessons to become a quiz champion!',
  },
  {
    id: 'chapter_7',
    title: 'Quiz Champion',
    subtitle: '10 lessons completed! Your knowledge is growing — you\'re mastering the world\'s cultures.',
    storyBeatId: 'chapter_7_quiz_champion',
    unlock: { type: 'lessonsCompleted', value: 10 },
    cosmeticReward: 'chapter_7_badge',
    nextHint: 'Reach a 7-day streak to become a streak warrior!',
  },
  {
    id: 'chapter_8',
    title: 'Streak Warrior',
    subtitle: '7 days in a row! Your dedication is unstoppable — keep the flame burning!',
    storyBeatId: 'chapter_8_streak_warrior',
    unlock: { type: 'streakDays', value: 7 },
    cosmeticReward: 'chapter_8_badge',
    nextHint: 'Visit 3 countries to become a culture collector!',
  },
  {
    id: 'chapter_9',
    title: 'Culture Collector',
    subtitle: '3 countries explored! You\'re building a rich tapestry of global experiences.',
    storyBeatId: 'chapter_9_culture_collector',
    unlock: { type: 'countriesVisited', value: 3 },
    cosmeticReward: 'chapter_9_badge',
    nextHint: 'Complete 20 lessons to become a memory master!',
  },
  // Act 3: The Scholar (Days 30-90)
  {
    id: 'chapter_10',
    title: 'Memory Master',
    subtitle: '20 lessons completed! Your brain is a treasure trove of cultural knowledge.',
    storyBeatId: 'chapter_10_memory_master',
    unlock: { type: 'lessonsCompleted', value: 20 },
    cosmeticReward: 'chapter_10_badge',
    nextHint: 'Collect 15 stamps to become a world citizen!',
  },
  {
    id: 'chapter_11',
    title: 'World Citizen',
    subtitle: '15 stamps in your passport! You\'re a true citizen of the world.',
    storyBeatId: 'chapter_11_world_citizen',
    unlock: { type: 'stampsCount', value: 15 },
    cosmeticReward: 'chapter_11_badge',
    nextHint: 'Visit 5 countries to watch Visby grow up!',
  },
  {
    id: 'chapter_12',
    title: 'Visby Grows Up',
    subtitle: '5 countries explored! Visby has grown alongside you — a loyal companion on your journey.',
    storyBeatId: 'chapter_12_visby_grows_up',
    unlock: { type: 'countriesVisited', value: 5 },
    cosmeticReward: 'chapter_12_badge',
    nextHint: 'Earn 8 badges to become a language learner!',
  },
  {
    id: 'chapter_13',
    title: 'Language Learner',
    subtitle: '8 badges earned! You\'re mastering the languages of culture and connection.',
    storyBeatId: 'chapter_13_language_learner',
    unlock: { type: 'badgesCount', value: 8 },
    cosmeticReward: 'chapter_13_badge',
    nextHint: 'Visit 10 countries to become a global explorer!',
  },
  // Act 4: The Legend (Days 90+)
  {
    id: 'chapter_14',
    title: 'Global Explorer',
    subtitle: '10 countries visited! You\'ve explored a tenth of the world — an incredible achievement!',
    storyBeatId: 'chapter_14_global_explorer',
    unlock: { type: 'countriesVisited', value: 10 },
    cosmeticReward: 'chapter_14_badge',
    nextHint: 'Earn 15 badges to become a Visby Legend!',
  },
  {
    id: 'chapter_15',
    title: 'Visby Legend',
    subtitle: '15 badges! You\'ve reached legendary status — a true master of exploration and culture.',
    storyBeatId: 'chapter_15_visby_legend',
    unlock: { type: 'badgesCount', value: 15 },
    cosmeticReward: 'chapter_15_badge',
    nextHint: 'You\'ve reached the pinnacle! Keep exploring and inspiring others.',
  },
  // Planet & People
  {
    id: 'chapter_planet_keeper',
    title: 'Planet Keeper',
    subtitle: 'You and Visby are helping the planet! Every sustainability lesson grows your garden.',
    storyBeatId: 'chapter_planet_keeper',
    unlock: { type: 'sustainabilityLessonsCompleted', value: 2 },
    cosmeticReward: 'earth_guardian_badge',
    nextHint: 'Complete all 3 planet lessons to become a true earth guardian!',
  },
];

export type ChapterUnlockContext = {
  countriesVisited?: number;
  bitesCount?: number;
  lessonsCompleted?: number;
  badgesCount?: number;
  stampsCount?: number;
  housesOwned?: number;
  streakDays?: number;
  sustainabilityLessonsCompleted?: number;
};

export function getChapterUnlockCurrent(type: ChapterUnlockType, state: ChapterUnlockContext): number {
  switch (type) {
    case 'countriesVisited':
      return state.countriesVisited ?? 0;
    case 'bitesCount':
      return state.bitesCount ?? 0;
    case 'lessonsCompleted':
      return state.lessonsCompleted ?? 0;
    case 'badgesCount':
      return state.badgesCount ?? 0;
    case 'stampsCount':
      return state.stampsCount ?? 0;
    case 'housesOwned':
      return state.housesOwned ?? 0;
    case 'streakDays':
      return state.streakDays ?? 0;
    case 'sustainabilityLessonsCompleted':
      return state.sustainabilityLessonsCompleted ?? 0;
    default:
      return 0;
  }
}
