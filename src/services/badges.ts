import { BadgeDefinition, BADGE_DEFINITIONS, TOTAL_COUNTRIES } from '../config/badges';

export interface BadgeCheckContext {
  stamps: number;
  bites: number;
  countriesVisited: number;
  totalAuraEarned: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  housesOwned: number;
  cosmeticsOwned: number;
  cuisinesCount: number;
  quizPerfect: boolean;
  earnedBadgeIds: string[];
}

export interface BadgeProgress {
  current: number;
  target: number;
  label: string;
}

interface BadgeRequirement {
  getValue: (ctx: BadgeCheckContext) => number;
  target: number;
  label: string;
}

const BADGE_REQUIREMENTS: Record<string, BadgeRequirement> = {
  // Exploration
  first_stamp:        { getValue: (c) => c.stamps, target: 1,  label: 'stamps' },
  five_stamps:        { getValue: (c) => c.stamps, target: 5,  label: 'stamps' },
  ten_stamps:         { getValue: (c) => c.stamps, target: 10, label: 'stamps' },
  twenty_five_stamps: { getValue: (c) => c.stamps, target: 25, label: 'stamps' },
  three_countries:    { getValue: (c) => c.countriesVisited, target: 3, label: 'countries' },
  all_countries:      { getValue: (c) => c.countriesVisited, target: TOTAL_COUNTRIES, label: 'countries' },

  // Food
  first_bite:    { getValue: (c) => c.bites, target: 1,  label: 'bites' },
  five_bites:    { getValue: (c) => c.bites, target: 5,  label: 'bites' },
  ten_bites:     { getValue: (c) => c.bites, target: 10, label: 'bites' },
  five_cuisines: { getValue: (c) => c.cuisinesCount, target: 5, label: 'cuisines' },

  // Learning
  first_lesson:         { getValue: (c) => c.lessonsCompleted, target: 1, label: 'lessons' },
  five_lessons:         { getValue: (c) => c.lessonsCompleted, target: 5, label: 'lessons' },
  quiz_master:          { getValue: (c) => c.quizPerfect ? 1 : (c.earnedBadgeIds.includes('quiz_master') ? 1 : 0), target: 1, label: 'perfect quiz' },
  seven_day_streak:     { getValue: (c) => c.longestStreak, target: 7,  label: 'day streak' },
  fourteen_day_streak:  { getValue: (c) => c.longestStreak, target: 14, label: 'day streak' },
  thirty_day_streak:    { getValue: (c) => c.longestStreak, target: 30, label: 'day streak' },

  // Economy
  earn_500_aura:  { getValue: (c) => c.totalAuraEarned, target: 500,  label: 'Aura' },
  earn_2000_aura: { getValue: (c) => c.totalAuraEarned, target: 2000, label: 'Aura' },
  first_house:    { getValue: (c) => c.housesOwned, target: 1, label: 'houses' },
  three_houses:   { getValue: (c) => c.housesOwned, target: 3, label: 'houses' },

  // Avatar
  first_cosmetic: { getValue: (c) => c.cosmeticsOwned, target: 1, label: 'cosmetics' },
  five_cosmetics: { getValue: (c) => c.cosmeticsOwned, target: 5, label: 'cosmetics' },
};

export function checkNewBadges(context: BadgeCheckContext): BadgeDefinition[] {
  const earned = new Set(context.earnedBadgeIds);

  return BADGE_DEFINITIONS.filter((badge) => {
    if (earned.has(badge.id)) return false;
    const req = BADGE_REQUIREMENTS[badge.id];
    if (!req) return false;
    return req.getValue(context) >= req.target;
  });
}

export function getBadgeProgress(badgeId: string, context: BadgeCheckContext): BadgeProgress {
  const req = BADGE_REQUIREMENTS[badgeId];
  if (!req) return { current: 0, target: 1, label: '' };
  return {
    current: req.getValue(context),
    target: req.target,
    label: req.label,
  };
}
