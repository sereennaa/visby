import { IconName } from '../components/ui/Icon';
import { COUNTRIES } from './constants';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'exploration' | 'food' | 'learning' | 'economy' | 'avatar';
}

export const TOTAL_COUNTRIES = COUNTRIES.length;

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── Exploration ──
  {
    id: 'first_stamp',
    name: 'First Step',
    description: 'Collect your very first stamp',
    icon: 'footsteps',
    rarity: 'common',
    category: 'exploration',
  },
  {
    id: 'five_stamps',
    name: 'Stamp Seeker',
    description: 'Collect 5 stamps',
    icon: 'stamp',
    rarity: 'common',
    category: 'exploration',
  },
  {
    id: 'ten_stamps',
    name: 'Stamp Collector',
    description: 'Collect 10 stamps',
    icon: 'stamp',
    rarity: 'uncommon',
    category: 'exploration',
  },
  {
    id: 'twenty_five_stamps',
    name: 'Stamp Master',
    description: 'Collect 25 stamps',
    icon: 'medal',
    rarity: 'rare',
    category: 'exploration',
  },
  {
    id: 'three_countries',
    name: 'Border Crosser',
    description: 'Visit 3 different countries',
    icon: 'passport',
    rarity: 'uncommon',
    category: 'exploration',
  },
  {
    id: 'all_countries',
    name: 'World Traveler',
    description: 'Visit every country on the map',
    icon: 'globe',
    rarity: 'legendary',
    category: 'exploration',
  },

  // ── Food ──
  {
    id: 'first_bite',
    name: 'First Bite',
    description: 'Log your first food bite',
    icon: 'food',
    rarity: 'common',
    category: 'food',
  },
  {
    id: 'five_bites',
    name: 'Taste Tester',
    description: 'Log 5 food bites',
    icon: 'bowl',
    rarity: 'common',
    category: 'food',
  },
  {
    id: 'ten_bites',
    name: 'Food Explorer',
    description: 'Log 10 food bites',
    icon: 'foodFork',
    rarity: 'uncommon',
    category: 'food',
  },
  {
    id: 'five_cuisines',
    name: 'World Palate',
    description: 'Try food from 5 different cuisines',
    icon: 'restaurant',
    rarity: 'rare',
    category: 'food',
  },

  // ── Learning ──
  {
    id: 'first_lesson',
    name: 'Eager Student',
    description: 'Complete your first lesson',
    icon: 'book',
    rarity: 'common',
    category: 'learning',
  },
  {
    id: 'five_lessons',
    name: 'Knowledge Seeker',
    description: 'Complete 5 lessons',
    icon: 'school',
    rarity: 'uncommon',
    category: 'learning',
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Score 100% on a quiz',
    icon: 'trophy',
    rarity: 'rare',
    category: 'learning',
  },
  {
    id: 'seven_day_streak',
    name: 'Week Warrior',
    description: 'Reach a 7-day streak',
    icon: 'flame',
    rarity: 'uncommon',
    category: 'learning',
  },
  {
    id: 'fourteen_day_streak',
    name: 'Fortnight Focus',
    description: 'Reach a 14-day streak',
    icon: 'flash',
    rarity: 'rare',
    category: 'learning',
  },
  {
    id: 'thirty_day_streak',
    name: 'Monthly Maven',
    description: 'Reach a 30-day streak',
    icon: 'rocket',
    rarity: 'epic',
    category: 'learning',
  },

  // ── Economy ──
  {
    id: 'earn_500_aura',
    name: 'Aura Spark',
    description: 'Earn a total of 500 Aura',
    icon: 'sparkles',
    rarity: 'common',
    category: 'economy',
  },
  {
    id: 'earn_2000_aura',
    name: 'Aura Glow',
    description: 'Earn a total of 2,000 Aura',
    icon: 'crown',
    rarity: 'uncommon',
    category: 'economy',
  },
  {
    id: 'first_house',
    name: 'Homeowner',
    description: 'Buy your first house',
    icon: 'home',
    rarity: 'rare',
    category: 'economy',
  },
  {
    id: 'three_houses',
    name: 'Real Estate Mogul',
    description: 'Own 3 houses around the world',
    icon: 'star',
    rarity: 'epic',
    category: 'economy',
  },

  // ── Avatar ──
  {
    id: 'first_cosmetic',
    name: 'Fashion Forward',
    description: 'Buy your first cosmetic',
    icon: 'shirt',
    rarity: 'common',
    category: 'avatar',
  },
  {
    id: 'five_cosmetics',
    name: 'Style Collector',
    description: 'Collect 5 cosmetics',
    icon: 'ribbon',
    rarity: 'uncommon',
    category: 'avatar',
  },
];
