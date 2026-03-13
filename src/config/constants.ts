// Visby App Constants
import { IconName } from '../components/ui/Icon';
import type { Country } from '../types';

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
// COUNTRIES – Visit, buy a house, walk through & learn (Club Penguin style)
// ===================================

export const COUNTRIES: Country[] = [
  {
    id: 'jp',
    name: 'Japan',
    countryCode: 'JP',
    flagEmoji: '',
    visitCostAura: 80,
    housePriceAura: 500,
    description: 'Land of cherry blossoms, sushi, and friendly bowing!',
    roomTheme: 'traditional',
    accentColor: '#E8B4B8',
    facts: [
      { id: 'jp1', countryId: 'jp', title: 'Bowing hello', content: 'In Japan people bow to say hello instead of shaking hands. The deeper the bow, the more respect!', icon: 'culture', category: 'culture' },
      { id: 'jp2', countryId: 'jp', title: 'Yummy sushi', content: 'Sushi started in Japan over 1,000 years ago. The word "sushi" means "sour rice."', icon: 'food', category: 'food' },
      { id: 'jp3', countryId: 'jp', title: 'Say konnichiwa', content: '"Konnichiwa" means "hello" in Japanese. Try saying it: cone-nee-chee-wah!', icon: 'language', category: 'language' },
      { id: 'jp4', countryId: 'jp', title: 'Cherry blossoms', content: 'In spring, pink cherry blossoms bloom everywhere. Families have picnics under the trees!', icon: 'nature', category: 'nature' },
      { id: 'jp5', countryId: 'jp', title: 'Take off your shoes', content: 'In Japanese homes and some restaurants you take off your shoes at the door. Slippers wait for you!', icon: 'culture', category: 'culture' },
    ],
  },
  {
    id: 'fr',
    name: 'France',
    countryCode: 'FR',
    flagEmoji: '',
    visitCostAura: 75,
    housePriceAura: 450,
    description: 'Home of the Eiffel Tower, croissants, and saying "Ooh la la!"',
    roomTheme: 'city',
    accentColor: '#A8D4E6',
    facts: [
      { id: 'fr1', countryId: 'fr', title: 'Bonjour!', content: '"Bonjour" means "hello" in French. Say it with a smile: bon-ZHOOR!', icon: 'language', category: 'language' },
      { id: 'fr2', countryId: 'fr', title: 'Croissants for breakfast', content: 'French people love fresh croissants in the morning. They are flaky and buttery!', icon: 'food', category: 'food' },
      { id: 'fr3', countryId: 'fr', title: 'The Eiffel Tower', content: 'The Eiffel Tower in Paris is one of the most famous landmarks in the world. It has 1,665 steps!', icon: 'landmark', category: 'fun' },
      { id: 'fr4', countryId: 'fr', title: 'Cheese please', content: 'France has over 1,000 types of cheese. Saying "fromage" (fro-MAHJ) means "cheese"!', icon: 'food', category: 'food' },
      { id: 'fr5', countryId: 'fr', title: 'Kiss on the cheek', content: 'Friends in France often greet each other with a light kiss on each cheek. It\'s called "la bise"!', icon: 'culture', category: 'culture' },
    ],
  },
  {
    id: 'mx',
    name: 'Mexico',
    countryCode: 'MX',
    flagEmoji: '',
    visitCostAura: 60,
    housePriceAura: 350,
    description: 'Colorful markets, tacos, and the home of chocolate!',
    roomTheme: 'coastal',
    accentColor: '#86EFAC',
    facts: [
      { id: 'mx1', countryId: 'mx', title: 'Hola!', content: '"Hola" means "hello" in Spanish. Mexico has the most Spanish speakers in the world!', icon: 'language', category: 'language' },
      { id: 'mx2', countryId: 'mx', title: 'Chocolate started here', content: 'Chocolate was first made in Mexico thousands of years ago. The Aztecs loved it!', icon: 'history', category: 'history' },
      { id: 'mx3', countryId: 'mx', title: 'Tacos any time', content: 'Tacos are a favorite food. You can put meat, beans, salsa, and lime in a soft or crunchy shell!', icon: 'food', category: 'food' },
      { id: 'mx4', countryId: 'mx', title: 'Day of the Dead', content: 'Dia de los Muertos is a happy celebration to remember loved ones. There are flowers, music, and treats!', icon: 'culture', category: 'culture' },
      { id: 'mx5', countryId: 'mx', title: 'Beautiful butterflies', content: 'Millions of monarch butterflies fly to Mexico every winter. They rest in the trees like orange clouds!', icon: 'nature', category: 'nature' },
    ],
  },
  {
    id: 'it',
    name: 'Italy',
    countryCode: 'IT',
    flagEmoji: '',
    visitCostAura: 85,
    housePriceAura: 520,
    description: 'Pizza, pasta, gelato, and ancient ruins!',
    roomTheme: 'traditional',
    accentColor: '#FDE047',
    facts: [
      { id: 'it1', countryId: 'it', title: 'Ciao!', content: '"Ciao" means both "hello" and "goodbye" in Italian. Say it: CHOW!', icon: 'language', category: 'language' },
      { id: 'it2', countryId: 'it', title: 'Pizza was born here', content: 'Pizza started in Naples, Italy. The first pizza was made over 200 years ago!', icon: 'food', category: 'food' },
      { id: 'it3', countryId: 'it', title: 'Leaning Tower', content: 'The Leaning Tower of Pisa really leans! It started leaning while it was being built 800 years ago.', icon: 'landmark', category: 'fun' },
      { id: 'it4', countryId: 'it', title: 'Gelato', content: 'Italian gelato is like ice cream but creamier and often made fresh every day. Yum!', icon: 'food', category: 'food' },
      { id: 'it5', countryId: 'it', title: 'Romans and gladiators', content: 'Ancient Rome was in Italy. Gladiators fought in big arenas. Today we can visit the old ruins!', icon: 'history', category: 'history' },
    ],
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    countryCode: 'GB',
    flagEmoji: '',
    visitCostAura: 70,
    housePriceAura: 400,
    description: 'Tea time, castles, and the home of Harry Potter!',
    roomTheme: 'modern',
    accentColor: '#C4B5FD',
    facts: [
      { id: 'gb1', countryId: 'gb', title: 'Tea time', content: 'In the UK many people have "tea" in the afternoon with sandwiches, scones, and of course tea!', icon: 'culture', category: 'culture' },
      { id: 'gb2', countryId: 'gb', title: 'Cheerio!', content: '"Cheerio" is a friendly way to say goodbye in Britain. "Hello" is hello there too!', icon: 'language', category: 'language' },
      { id: 'gb3', countryId: 'gb', title: 'Castles everywhere', content: 'The UK has lots of old castles. Kings and queens used to live in them!', icon: 'history', category: 'history' },
      { id: 'gb4', countryId: 'gb', title: 'Fish and chips', content: 'A classic British meal is fish and chips -- fried fish with thick fries. Often wrapped in paper!', icon: 'food', category: 'food' },
      { id: 'gb5', countryId: 'gb', title: 'Double-decker buses', content: 'London is famous for red double-decker buses. You can sit on the top and see the whole street!', icon: 'sparkles', category: 'fun' },
    ],
  },
  {
    id: 'br',
    name: 'Brazil',
    countryCode: 'BR',
    flagEmoji: '',
    visitCostAura: 65,
    housePriceAura: 380,
    description: 'Rainforests, carnival, and the Amazon!',
    roomTheme: 'nature',
    accentColor: '#FECDD3',
    facts: [
      { id: 'br1', countryId: 'br', title: 'Ola!', content: '"Ola" means "hello" in Portuguese. Brazil is the biggest country in South America!', icon: 'language', category: 'language' },
      { id: 'br2', countryId: 'br', title: 'The Amazon', content: 'The Amazon rainforest is in Brazil. It has more types of plants and animals than almost anywhere on Earth!', icon: 'nature', category: 'nature' },
      { id: 'br3', countryId: 'br', title: 'Carnival', content: 'Carnival is a huge party with music, dancing, and colorful costumes. It happens every year!', icon: 'culture', category: 'culture' },
      { id: 'br4', countryId: 'br', title: 'Yummy fruits', content: 'Brazil has amazing fruits like acai, passion fruit, and guava. Try acai bowls -- they\'re like a smoothie!', icon: 'food', category: 'food' },
      { id: 'br5', countryId: 'br', title: 'Soccer passion', content: 'Brazilians love soccer (they call it "futebol"). Brazil has won the World Cup more than any other country!', icon: 'sparkles', category: 'fun' },
    ],
  },
];

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
