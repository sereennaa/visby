// Visby App Constants
import { IconName } from '../components/ui/Icon';

// ===================================
// AURA & PROGRESSION
// ===================================

export const AURA_REWARDS = {
  // Stamps
  STAMP_CITY: 50,
  STAMP_COUNTRY: 100,
  STAMP_LANDMARK: 75,
  STAMP_PARK: 40,
  STAMP_BEACH: 60,
  STAMP_MOUNTAIN: 80,
  STAMP_MUSEUM: 55,
  STAMP_RESTAURANT: 30,
  STAMP_CAFE: 25,
  STAMP_MARKET: 35,
  STAMP_HIDDEN_GEM: 150,
  
  // Bites
  BITE_UPLOAD: 25,
  BITE_WITH_RECIPE: 40,
  BITE_FIRST_IN_CUISINE: 75,
  
  // Learning
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 100,
  QUIZ_PASS: 30,
  FLASHCARD_SESSION: 15,
  
  // Social
  DAILY_CHECK_IN: 10,
  STREAK_BONUS_MULTIPLIER: 5, // per day of streak
  FIRST_POST: 25,
  
  // Badges
  BADGE_COMMON: 50,
  BADGE_UNCOMMON: 100,
  BADGE_RARE: 200,
  BADGE_EPIC: 500,
  BADGE_LEGENDARY: 1000,
};

// Fast Travel Costs
export const FAST_TRAVEL_COSTS = {
  BASE_COST: 100,
  DISTANCE_MULTIPLIER: 0.01, // per km
  DISCOUNT_PER_LEVEL: 2, // percentage
  MAX_DISCOUNT: 50, // percentage
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, aura: 0, title: 'Novice Explorer' },
  { level: 2, aura: 100, title: 'Curious Wanderer' },
  { level: 3, aura: 250, title: 'Path Finder' },
  { level: 4, aura: 500, title: 'Trail Blazer' },
  { level: 5, aura: 800, title: 'Globe Trotter' },
  { level: 6, aura: 1200, title: 'World Walker' },
  { level: 7, aura: 1800, title: 'Culture Seeker' },
  { level: 8, aura: 2500, title: 'Memory Keeper' },
  { level: 9, aura: 3500, title: 'Horizon Chaser' },
  { level: 10, aura: 5000, title: 'Legendary Voyager' },
  { level: 11, aura: 7000, title: 'Master Explorer' },
  { level: 12, aura: 10000, title: 'Grand Adventurer' },
  { level: 13, aura: 15000, title: 'Eternal Wanderer' },
  { level: 14, aura: 22000, title: 'Mythic Traveler' },
  { level: 15, aura: 30000, title: 'Visby Legend' },
];

// ===================================
// LOCATION
// ===================================

export const LOCATION_CONFIG = {
  STAMP_RADIUS_METERS: 100, // How close you need to be to collect a stamp
  UPDATE_INTERVAL_MS: 10000, // How often to update location
  HIGH_ACCURACY: true,
};

// ===================================
// COLLECTIONS
// ===================================

export interface StampTypeInfo {
  label: string;
  icon: IconName;
  color: string;
}

export const STAMP_TYPES_INFO: Record<string, StampTypeInfo> = {
  city: { label: 'City', icon: 'city', color: '#9B89D0' },
  country: { label: 'Country', icon: 'country', color: '#6B9B6B' },
  landmark: { label: 'Landmark', icon: 'landmark', color: '#FFD700' },
  park: { label: 'Park', icon: 'park', color: '#4CAF50' },
  beach: { label: 'Beach', icon: 'beach', color: '#64B5F6' },
  mountain: { label: 'Mountain', icon: 'mountain', color: '#8D6E63' },
  museum: { label: 'Museum', icon: 'museum', color: '#9C27B0' },
  restaurant: { label: 'Restaurant', icon: 'restaurant', color: '#FF5722' },
  cafe: { label: 'Café', icon: 'cafe', color: '#795548' },
  market: { label: 'Market', icon: 'market', color: '#FF9800' },
  temple: { label: 'Temple', icon: 'temple', color: '#E91E63' },
  castle: { label: 'Castle', icon: 'castle', color: '#607D8B' },
  monument: { label: 'Monument', icon: 'monument', color: '#3F51B5' },
  nature: { label: 'Nature', icon: 'nature', color: '#8BC34A' },
  hidden_gem: { label: 'Hidden Gem', icon: 'hiddenGem', color: '#00BCD4' },
};

export interface BiteCategoryInfo {
  label: string;
  icon: IconName;
}

export const BITE_CATEGORIES_INFO: Record<string, BiteCategoryInfo> = {
  main_dish: { label: 'Main Dish', icon: 'mainDish' },
  appetizer: { label: 'Appetizer', icon: 'appetizer' },
  dessert: { label: 'Dessert', icon: 'dessert' },
  snack: { label: 'Snack', icon: 'snack' },
  drink: { label: 'Drink', icon: 'drink' },
  street_food: { label: 'Street Food', icon: 'streetFood' },
  breakfast: { label: 'Breakfast', icon: 'breakfast' },
  soup: { label: 'Soup', icon: 'soup' },
  salad: { label: 'Salad', icon: 'salad' },
  bread: { label: 'Bread', icon: 'bread' },
};

// ===================================
// BADGES
// ===================================

export const BADGE_DEFINITIONS = [
  // Explorer Badges
  { id: 'first_stamp', name: 'First Step', requirement: 1, type: 'stamp_count', icon: 'footsteps' as IconName },
  { id: 'ten_stamps', name: 'Stamp Collector', requirement: 10, type: 'stamp_count', icon: 'stamp' as IconName },
  { id: 'fifty_stamps', name: 'Stamp Master', requirement: 50, type: 'stamp_count', icon: 'sparkles' as IconName },
  { id: 'hundred_stamps', name: 'Stamp Legend', requirement: 100, type: 'stamp_count', icon: 'star' as IconName },
  
  // Park Badges
  { id: 'park_explorer', name: 'Nature Lover', requirement: 5, type: 'stamp_type', stampType: 'park', icon: 'park' as IconName },
  { id: 'park_ranger', name: 'Park Ranger', requirement: 10, type: 'stamp_type', stampType: 'park', icon: 'nature' as IconName },
  
  // Beach Badges
  { id: 'beach_lover', name: 'Beach Bum', requirement: 5, type: 'stamp_type', stampType: 'beach', icon: 'beach' as IconName },
  { id: 'beach_master', name: 'Ocean Spirit', requirement: 10, type: 'stamp_type', stampType: 'beach', icon: 'globe' as IconName },
  
  // Country Badges
  { id: 'two_countries', name: 'Border Crosser', requirement: 2, type: 'country_count', icon: 'passport' as IconName },
  { id: 'five_countries', name: 'Passport Stamper', requirement: 5, type: 'country_count', icon: 'airplane' as IconName },
  { id: 'ten_countries', name: 'World Traveler', requirement: 10, type: 'country_count', icon: 'country' as IconName },
  
  // Foodie Badges
  { id: 'first_bite', name: 'First Taste', requirement: 1, type: 'bite_count', icon: 'food' as IconName },
  { id: 'ten_bites', name: 'Food Explorer', requirement: 10, type: 'bite_count', icon: 'bowl' as IconName },
  { id: 'fifty_bites', name: 'Culinary Master', requirement: 50, type: 'bite_count', icon: 'crown' as IconName },
  
  // Streak Badges
  { id: 'week_streak', name: 'Week Warrior', requirement: 7, type: 'streak', icon: 'flame' as IconName },
  { id: 'month_streak', name: 'Monthly Maven', requirement: 30, type: 'streak', icon: 'flash' as IconName },
  
  // Learning Badges
  { id: 'first_lesson', name: 'Eager Student', requirement: 1, type: 'lesson_count', icon: 'book' as IconName },
  { id: 'quiz_ace', name: 'Quiz Ace', requirement: 5, type: 'perfect_quiz', icon: 'school' as IconName },
];

// ===================================
// UI CONSTANTS
// ===================================

export const ANIMATION_CONFIG = {
  SPRING: {
    damping: 15,
    stiffness: 150,
  },
  GENTLE: {
    damping: 20,
    stiffness: 100,
  },
};

// ===================================
// LIMITS
// ===================================

export const LIMITS = {
  MAX_USERNAME_LENGTH: 20,
  MAX_DISPLAY_NAME_LENGTH: 30,
  MAX_NOTE_LENGTH: 500,
  MAX_CAPTION_LENGTH: 280,
  MAX_PHOTO_SIZE_MB: 10,
  NEARBY_LOCATIONS_RADIUS_KM: 50,
};
