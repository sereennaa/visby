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
  
  // Countries the user has visited at least once (country IDs)
  visitedCountries: string[];
  
  // Daily learning tracking
  lessonsCompletedToday?: number;
  lastLessonDate?: string;

  // Mini-game stats
  gamesPlayed: number;
  perfectCookingGames: number;
  perfectWordMatches: number;
  treasureHuntsCompleted: number;

  // Avatar Reference
  visbyId: string;
  
  // Skills
  skills: SkillProgress;

  // Settings
  settings: UserSettings;
}

/** Per-country treasure hunt completion: room IDs and (optional) location IDs completed */
export type TreasureHuntProgress = Record<string, { completedRoomIds: string[]; completedLocationIds?: string[] }>;

export interface UserSettings {
  notifications: boolean;
  locationTracking: boolean;
  privateProfile: boolean;
  language: string;
  measurementUnit: 'metric' | 'imperial';
}

// ===================================
// FRIENDS (Club Penguin–style)
// ===================================

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromDisplayName: string;
  toUserId: string;
  status: FriendRequestStatus;
  createdAt: Date;
}

/** Friend record: cached profile so we can show level, badges, and visit their house */
export interface Friend {
  userId: string;
  username: string;
  displayName: string;
  /** Cached when we load their profile */
  level?: number;
  aura?: number;
  badgesCount?: number;
  visbyId?: string;
  /** Countries they have a house in (for "Visit house") */
  houseCountryIds?: string[];
  /** When we became friends (for sorting) */
  addedAt: Date;
}

/** Where a user is right now — for live presence and "who's here" / chat */
export type PresencePlaceType = 'home' | 'country_room' | 'place_street';

export interface PresencePlace {
  type: PresencePlaceType;
  countryId?: string;
  pinId?: string;
  roomId?: string;
  /** Human-readable label for UI, e.g. "Paris · Eiffel Tower" */
  label?: string;
}

/** One message in a place chat (Club Penguin style) */
export interface PlaceChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: Date;
}

// ===================================
// DAILY MISSION (Phase 1: Make It Stick)
// ===================================

export type DailyMissionType =
  | 'collect_stamp'
  | 'add_bite'
  | 'play_minigame'
  | 'chat_with_visby'
  | 'read_facts'
  | 'complete_lesson';

export interface DailyMission {
  type: DailyMissionType;
  label: string;
  target: number; // e.g. 1 or 2
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
  | 'sick'
  | 'lonely'; // when social battery is low

export type VisbyGrowthStage = 'egg' | 'baby' | 'kid' | 'teen' | 'adult';

export interface VisbyNeeds {
  hunger: number;    // 0-100
  happiness: number; // 0-100
  energy: number;    // 0-100
  knowledge: number; // 0-100
  socialBattery: number; // 0-100 — filled by chatting with Visby or socializing with others
  lastUpdated: string; // ISO timestamp
}

/** One message in the Visby check-in / chat (user or Visby) */
export interface VisbyChatMessage {
  id: string;
  role: 'user' | 'visby';
  text: string;
  createdAt: string; // ISO
}

/** Something the user shared that Visby can remember and bring up later */
export interface VisbyMemory {
  id: string;
  summary: string;   // e.g. "working on a big project", "had a test today"
  createdAt: string; // ISO
}

export interface SkillProgress {
  language: number;    // 0-100
  geography: number;   // 0-100
  culture: number;     // 0-100
  history: number;     // 0-100
  cooking: number;     // 0-100
  exploration: number; // 0-100
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
  /** Optional image URL (e.g. croissant, Eiffel Tower) for dreamy learning */
  imageUrl?: string;
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
  roomCustomizations?: Record<string, RoomCustomization>;
}

/** What the Visby can do with this furniture — fulfills needs + earns Aura */
export type FurnitureInteractionType = 'table' | 'stove' | 'bed' | 'bookshelf' | 'toy';

export interface FurnitureItem {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  category: 'wall' | 'floor' | 'furniture' | 'decor' | 'outdoor';
  countryOrigin?: string;
  price: number;
  width: number;
  height: number;
  rarity: CosmeticRarity;
  /** Sims-style rich description: materials, style, where it's from */
  description?: string;
  /** If set, Visby can use this furniture to fulfill a need and earn Aura */
  interactionType?: FurnitureInteractionType | null;
  /** Short label for the action, e.g. "Eat a meal", "Cook traditional meal" */
  interactionLabel?: string;
  /** Aura reward when using this furniture */
  interactionAura?: number;
}

export interface PlacedFurniture {
  id: string;
  furnitureId: string;
  roomId: string;
  x: number;
  y: number;
  rotation: number;
}

export interface RoomCustomization {
  wallColor?: string;
  floorColor?: string;
  placedFurniture: PlacedFurniture[];
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

  // Tab roots
  Home: undefined;
  Explore: undefined;
  Inbox: undefined;

  // Map & Explore (stack screens, reachable from Explore tab)
  // Map is inside Explore stack; kept on root for direct access if needed
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
  
  // Profile & Friends
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Friends: undefined;
  AddFriend: undefined;
  FriendProfile: { friendUserId: string };
  
  // Mini-Games
  WordMatch: { countryId?: string } | undefined;
  MemoryCards: { category?: string } | undefined;
  CookingGame: { countryId?: string } | undefined;
  TreasureHunt: { countryId?: string } | undefined;

  // Shop & Membership
  CosmeticShop: undefined;
  FurnitureShop: undefined;
  AuraStore: undefined;
  Membership: undefined;
}

// Explore tab has its own stack so Map/CountryWorld/CountryRoom keep the tab bar visible
export type ExploreStackParamList = {
  Explore: undefined;
  Map: undefined;
  CountryWorld: undefined;
  CountryRoom: { countryId: string; /** When set, viewing a friend's house (read-only) */ friendUserId?: string };
  /** Map of the country with pinned cities and landmarks */
  CountryMap: { countryId: string };
  /** Street view: walk through a pinned place and see stops with pictures and facts */
  PlaceStreet: { countryId: string; pinId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Explore: import('@react-navigation/native').NavigatorScreenParams<ExploreStackParamList>;
  Inbox: undefined;
  Profile: undefined;
};
