/**
 * Visby personality and evolution system.
 * Personality traits develop based on play patterns. Growth stages have visual and behavioral effects.
 */

import type { VisbyPersonality, VisbyTrait, VisbyGrowthStage, VisbyNeeds } from '../types';

// ─── TRAIT DEFINITIONS ───

export const TRAIT_DEFINITIONS: Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  /** How this trait is earned */
  earnedBy: string;
}> = [
  { id: 'foodie', name: 'Foodie', description: 'Loves trying new foods from around the world', icon: 'food', earnedBy: 'Logging bites and playing cooking games' },
  { id: 'bookworm', name: 'Bookworm', description: 'Can never get enough lessons and facts', icon: 'book', earnedBy: 'Completing lessons and reading facts' },
  { id: 'adventurer', name: 'Adventurer', description: 'Always ready to explore a new country', icon: 'map', earnedBy: 'Visiting countries and collecting stamps' },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Loves chatting and making friends', icon: 'heart', earnedBy: 'Chatting with Visby and friends' },
  { id: 'linguist', name: 'Linguist', description: 'Picks up new words like a sponge', icon: 'chat', earnedBy: 'Word Match and language flashcards' },
  { id: 'gamer', name: 'Gamer', description: 'Unstoppable in mini-games', icon: 'game', earnedBy: 'Playing and perfecting mini-games' },
  { id: 'collector', name: 'Collector', description: 'Must catch them all — stamps, bites, badges', icon: 'camera', earnedBy: 'Collecting stamps, bites, and badges' },
  { id: 'caring', name: 'Caring', description: "Always makes sure everyone's happy", icon: 'heart', earnedBy: 'Keeping Visby needs high' },
  { id: 'earth_guardian', name: 'Earth Guardian', description: 'Cares for the planet — sustainability lessons, cleanups, and green choices', icon: 'globe', earnedBy: 'Sustainability lessons, impact actions, and planet quests' },
];

// ─── EVOLUTION STAGE DETAILS ───

export interface GrowthStageInfo {
  stage: VisbyGrowthStage;
  name: string;
  description: string;
  minCarePoints: number;
  sizeMultiplier: number;
  unlocks: string[];
}

export const GROWTH_STAGES: GrowthStageInfo[] = [
  {
    stage: 'egg',
    name: 'Egg',
    description: "Your Visby is getting ready to hatch! Keep caring for it.",
    minCarePoints: 0,
    sizeMultiplier: 0.7,
    unlocks: [],
  },
  {
    stage: 'baby',
    name: 'Baby Visby',
    description: "Just hatched! Everything is new and exciting.",
    minCarePoints: 1,
    sizeMultiplier: 0.8,
    unlocks: ['Basic expressions', 'Simple chat'],
  },
  {
    stage: 'kid',
    name: 'Kid Visby',
    description: 'Growing fast! Starting to show personality.',
    minCarePoints: 50,
    sizeMultiplier: 1.0,
    unlocks: ['Personality traits', 'All games', 'Cosmetics'],
  },
  {
    stage: 'teen',
    name: 'Teen Visby',
    description: 'Developing strong opinions and favorites!',
    minCarePoints: 200,
    sizeMultiplier: 1.1,
    unlocks: ['Advanced chat', 'Trait bonuses', 'Exclusive cosmetics'],
  },
  {
    stage: 'adult',
    name: 'Adult Visby',
    description: 'A wise explorer with deep personality and knowledge.',
    minCarePoints: 500,
    sizeMultiplier: 1.2,
    unlocks: ['Mentor mode', 'Teaching mini-games', 'Legendary cosmetics'],
  },
];

// ─── PERSONALITY CALCULATION ───

export function calculateTraitLevels(stats: {
  bites: number;
  lessonsCompleted: number;
  countriesVisited: number;
  chatMessages: number;
  wordMatchGames: number;
  gamesPlayed: number;
  stampsCollected: number;
  averageNeedLevel: number;
  sustainabilityLessonsCompleted?: number;
}): VisbyTrait[] {
  const sustain = (stats.sustainabilityLessonsCompleted ?? 0) * 15;
  return [
    { id: 'foodie', name: 'Foodie', level: Math.min(100, stats.bites * 5) },
    { id: 'bookworm', name: 'Bookworm', level: Math.min(100, stats.lessonsCompleted * 8) },
    { id: 'adventurer', name: 'Adventurer', level: Math.min(100, stats.countriesVisited * 7 + stats.stampsCollected * 2) },
    { id: 'social_butterfly', name: 'Social Butterfly', level: Math.min(100, stats.chatMessages * 3) },
    { id: 'linguist', name: 'Linguist', level: Math.min(100, stats.wordMatchGames * 10) },
    { id: 'gamer', name: 'Gamer', level: Math.min(100, stats.gamesPlayed * 4) },
    { id: 'collector', name: 'Collector', level: Math.min(100, stats.stampsCollected * 3 + stats.bites * 3) },
    { id: 'caring', name: 'Caring', level: Math.min(100, Math.round(stats.averageNeedLevel * 1.2)) },
    { id: 'earth_guardian', name: 'Earth Guardian', level: Math.min(100, sustain) },
  ];
}

export function getDominantTrait(traits: VisbyTrait[]): VisbyTrait | null {
  if (traits.length === 0) return null;
  return traits.reduce((a, b) => (b.level > a.level ? b : a));
}

/** Get Visby's favorite country based on visit frequency and time spent */
export function inferFavoriteCountry(visitedCountries: string[], countryProgress: Record<string, { factsReadCount: number; gamesPlayedCount: number }>): string | undefined {
  let best: string | undefined;
  let bestScore = 0;
  for (const cid of visitedCountries) {
    const prog = countryProgress[cid];
    const score = (prog?.factsReadCount || 0) * 2 + (prog?.gamesPlayedCount || 0) * 3;
    if (score > bestScore) {
      bestScore = score;
      best = cid;
    }
  }
  return best;
}

/** Get a personality-driven greeting from Visby */
export function getPersonalityGreeting(dominant: VisbyTrait | null, stage: VisbyGrowthStage): string {
  if (stage === 'egg') return '...';
  if (stage === 'baby') return "Waa! Hi!";

  if (!dominant || dominant.level < 20) {
    return "Hey! How are you? I'm so glad you're here.";
  }

  const greetings: Record<string, string[]> = {
    foodie: [
      "Hey! I've been thinking about food all day!",
      "Ooh, I'm a bit hungry. Did you try anything yummy today?",
    ],
    bookworm: [
      "Hi! I just learned the coolest fact. Want to hear it?",
      "Hey there, smarty! Ready to discover something new?",
    ],
    adventurer: [
      "Hey explorer! Where are we going today?",
      "I've got my backpack ready! Let's go somewhere amazing!",
    ],
    social_butterfly: [
      "Yay, you're here! I missed talking to you!",
      "Hi friend! How's everyone doing today?",
    ],
    linguist: [
      "Konnichiwa! ...wait, was that right?",
      "Bonjour! I've been practicing my words!",
    ],
    gamer: [
      "Hey champ! Ready for a rematch?",
      "I've been training! Want to play something?",
    ],
    collector: [
      "Look at all our stamps! Want to add more?",
      "I found something cool — want to see?",
    ],
    caring: [
      "Thanks for always taking such good care of me!",
      "I feel so happy when you're around!",
    ],
    earth_guardian: [
      "We're helping the planet today!",
      "Hey! Ready to do something good for the Earth?",
    ],
  };

  const options = greetings[dominant.id] || ["Hey! How are you?"];
  return options[Math.floor(Math.random() * options.length)];
}

/** Consequences of neglect — what happens when needs are low */
export function getNeglectEffects(needs: VisbyNeeds): {
  moodOverride?: string;
  auraMultiplier: number;
  gamePerformance: number; // 0-1 multiplier
  message?: string;
} {
  const avg = (needs.hunger + needs.happiness + needs.energy + needs.knowledge + (needs.socialBattery ?? 50)) / 5;

  if (avg <= 10) {
    return {
      moodOverride: 'sick',
      auraMultiplier: 0.5,
      gamePerformance: 0.7,
      message: "I don't feel so good... could you help me?",
    };
  }
  if (avg <= 25) {
    return {
      moodOverride: 'bored',
      auraMultiplier: 0.75,
      gamePerformance: 0.85,
      message: "I'm not at my best today... but I'll try my hardest!",
    };
  }
  if (avg >= 80) {
    return {
      auraMultiplier: 1.15,
      gamePerformance: 1.0,
      message: "I feel amazing! Let's go!",
    };
  }
  return { auraMultiplier: 1.0, gamePerformance: 1.0 };
}
