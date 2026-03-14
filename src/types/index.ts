// ===================================
// VISBY TYPE DEFINITIONS
// ===================================

// ===================================
// USER & PROFILE
// ===================================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastActive: Date;
  
  // Progression
  level: number;
  aura: number;
  totalAuraEarned: number;
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
  
  // Stats
  stampsCollected: number;
  bitesCollected: number;
  badgesEarned: number;
  countriesVisited: number;
  citiesVisited: number;
  totalCarePoints: number;
  
  // Daily learning tracking
  lessonsCompletedToday?: number;
  lastLessonDate?: string;

  // Avatar Reference
  visbyId: string;
  
  // Settings
  settings: UserSettings;
}

export interface UserSettings {
  notifications: boolean;
  locationTracking: boolean;
  privateProfile: boolean;
  language: string;
  measurementUnit: 'metric' | 'imperial';
}

// ===================================
// VISBY AVATAR
// ===================================

export interface Visby {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  
  // Base Appearance
  appearance: VisbyAppearance;
  
  // Equipped Cosmetics
  equipped: EquippedCosmetics;
  
  // Owned Cosmetics
  ownedCosmetics: string[]; // Array of cosmetic IDs
  
  // Expression/Mood
  currentMood: VisbyMood;
  
  // Tamagotchi-style needs
  needs: VisbyNeeds;
}

export interface VisbyAppearance {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  eyeShape: string;
}

export interface EquippedCosmetics {
  hat?: string;
  outfit?: string;
  accessory?: string;
  backpack?: string;
  shoes?: string;
  companion?: string;
}

export type VisbyMood = 
  | 'happy'
  | 'excited'
  | 'curious'
  | 'sleepy'
  | 'proud'
  | 'adventurous'
  | 'cozy'
  | 'hungry'
  | 'bored'
  | 'confused'
  | 'sick';

export interface VisbyNeeds {
  hunger: number;    // 0-100
  happiness: number; // 0-100
  energy: number;    // 0-100
  knowledge: number; // 0-100
  lastUpdated: string; // ISO timestamp
}

// ===================================
// COSMETICS
// ===================================

export interface Cosmetic {
  id: string;
  name: string;
  description: string;
  type: CosmeticType;
  rarity: CosmeticRarity;
  
  // Unlock Conditions
  unlockType: 'level' | 'badge' | 'purchase' | 'event' | 'default';
  unlockRequirement?: string; // Level number, badge ID, or event name
  
  // Visual
  imageUrl: string;
  previewUrl: string;
  
  // Metadata
  createdAt: Date;
  isLimited: boolean;
  seasonalEvent?: string;
}

export type CosmeticType = 
  | 'hat'
  | 'outfit'
  | 'accessory'
  | 'backpack'
  | 'shoes'
  | 'companion';

export type CosmeticRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary';

// ===================================
// STAMPS (Location Collectibles)
// ===================================

export interface Stamp {
  id: string;
  userId: string;
  
  // Location Info
  type: StampType;
  locationId: string;
  locationName: string;
  city: string;
  country: string;
  countryCode: string;
  
  // Coordinates
  latitude: number;
  longitude: number;
  
  // Collection Details
  collectedAt: Date;
  photoUrl?: string;
  notes?: string;
  
  // Fast Travel
  isFastTravel: boolean;
  auraSpent?: number;
  
  // Social
  isPublic: boolean;
  likes: number;
}

export type StampType = 
  | 'city'
  | 'country'
  | 'landmark'
  | 'park'
  | 'beach'
  | 'mountain'
  | 'museum'
  | 'restaurant'
  | 'cafe'
  | 'market'
  | 'temple'
  | 'castle'
  | 'monument'
  | 'nature'
  | 'hidden_gem';

export interface StampLocation {
  id: string;
  name: string;
  type: StampType;
  description: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  auraReward: number;
  fastTravelCost: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

// ===================================
// BITES (Food Collectibles)
// ===================================

export interface Bite {
  id: string;
  userId: string;
  
  // Food Info
  name: string;
  description: string;
  cuisine: string;
  category: BiteCategory;
  
  // Location
  city?: string;
  country?: string;
  restaurantName?: string;
  
  // User Input
  photoUrl: string;
  rating: number; // 1-5
  notes?: string;
  isMadeAtHome: boolean;
  
  // Recipe Info
  recipe?: Recipe;
  
  // Metadata
  collectedAt: Date;
  isPublic: boolean;
  likes: number;
  
  // Tags
  tags: string[];
}

export type BiteCategory = 
  | 'main_dish'
  | 'appetizer'
  | 'dessert'
  | 'snack'
  | 'drink'
  | 'street_food'
  | 'breakfast'
  | 'soup'
  | 'salad'
  | 'bread';

export interface Recipe {
  ingredients: string[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ===================================
// BADGES
// ===================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  
  // Visual
  imageUrl: string;
  iconEmoji: string;
  color: string;
  
  // Requirements
  requirement: BadgeRequirement;
  
  // Rewards
  auraReward: number;
  unlocksCosmetic?: string; // Cosmetic ID
  unlocksPerk?: string; // Perk ID
  
  // Rarity
  rarity: CosmeticRarity;
  
  // Metadata
  isSecret: boolean;
  totalEarned: number; // How many users have it
}

export interface BadgeRequirement {
  type: 'stamp_count' | 'bite_count' | 'stamp_type' | 'country_count' | 'streak' | 'level' | 'quiz_score' | 'special';
  target: number;
  stampType?: StampType;
  description: string;
}

export type BadgeCategory = 
  | 'explorer'
  | 'foodie'
  | 'collector'
  | 'learner'
  | 'social'
  | 'milestone'
  | 'seasonal'
  | 'secret';

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  progress: number; // 0-100
  isNew: boolean;
}

// ===================================
// LEARNING
// ===================================

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  
  // Content
  country?: string;
  city?: string;
  content: LessonContent[];
  
  // Quiz
  quiz: Quiz;
  
  // Rewards
  auraReward: number;
  
  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  imageUrl: string;
  tags: string[];
}

export type LessonCategory = 
  | 'language'
  | 'slang'
  | 'culture'
  | 'history'
  | 'food'
  | 'etiquette'
  | 'geography'
  | 'fun_facts';

export interface LessonContent {
  type: 'text' | 'image' | 'audio' | 'flashcard' | 'tip';
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  translation?: string;
}

export interface Quiz {
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // seconds
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'match';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  imageUrl?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  imageUrl?: string;
  audioUrl?: string;
  category: string;
  country?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  started: boolean;
  completed: boolean;
  startedAt?: Date;
  completedAt?: Date;
  quizScore?: number;
  attempts: number;
}

// ===================================
// AURA & PROGRESSION
// ===================================

export interface AuraTransaction {
  id: string;
  userId: string;
  amount: number;
  type: AuraTransactionType;
  description: string;
  referenceId?: string;
  createdAt: Date;
}

export type AuraTransactionType = 
  | 'stamp_collect'
  | 'bite_collect'
  | 'quiz_complete'
  | 'lesson_complete'
  | 'badge_earn'
  | 'daily_bonus'
  | 'streak_bonus'
  | 'fast_travel'
  | 'achievement'
  | 'country_visit'
  | 'house_purchase';

export interface Level {
  level: number;
  auraRequired: number;
  title: string;
  perks: string[];
  unlockedCosmetics: string[];
}

// ===================================
// COUNTRIES, HOUSES & WALK-THROUGH (Club Penguin style)
// ===================================

export interface Country {
  id: string;
  name: string;
  countryCode: string;
  flagEmoji: string;
  /** Aura cost to visit (one-time per visit) */
  visitCostAura: number;
  /** Aura cost to buy a house here (then visit free) */
  housePriceAura: number;
  /** Short kid-friendly description */
  description: string;
  /** Background / room style for walk-through */
  roomTheme: 'traditional' | 'modern' | 'nature' | 'city' | 'coastal' | 'mountain';
  /** Hex or theme key for room accent */
  accentColor: string;
  imageUrl?: string;
  /** Learning facts shown while in the room */
  facts: CountryFact[];
}

export interface CountryFact {
  id: string;
  countryId: string;
  title: string;
  content: string;
  /** Icon name for display */
  icon: string;
  category: 'culture' | 'food' | 'language' | 'nature' | 'history' | 'fun';
}

export interface UserHouse {
  id: string;
  userId: string;
  countryId: string;
  purchasedAt: Date;
  /** Custom name kid gave their house */
  houseName?: string;
  /** Last time they visited this room */
  lastVisitedAt?: Date;
}

/** Avatar position in the walk-through room (percentage 0-100) */
export interface RoomAvatarPosition {
  x: number;
  y: number;
  direction: 'left' | 'right';
}

// ===================================
// MAP & LOCATION
// ===================================

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: StampType | 'user';
  name: string;
  isCollected: boolean;
  imageUrl?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  countryCode?: string;
  accuracy?: number;
}

// ===================================
// NAVIGATION
// ===================================

export type RootStackParamList = {
  // Auth Stack
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
  
  // Main App
  Main: undefined;
  
  // Home
  Home: undefined;
  
  // Map & Explore
  Map: undefined;
  LocationDetail: { locationId: string };
  CollectStamp: { locationId: string };
  
  // Collections
  Stamps: undefined;
  StampDetail: { stampId: string };
  Bites: undefined;
  BiteDetail: { biteId: string };
  AddBite: undefined;
  Badges: undefined;
  
  // Avatar
  Avatar: undefined;
  
  // Learning
  Learn: undefined;
  LessonCategory: { categoryId: string };
  Lesson: { lessonId: string };
  Quiz: { category?: string } | undefined;
  Flashcards: { deckId?: string } | undefined;
  
  // Profile
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  
  // Countries & Houses (visit, buy house, walk through like Club Penguin)
  CountryWorld: undefined;
  CountryRoom: { countryId: string };

  // Shop & Membership
  CosmeticShop: undefined;
  AuraStore: undefined;
  Membership: undefined;
}

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Stamps: undefined;
  Bites: undefined;
  Learn: undefined;
  Profile: undefined;
};
