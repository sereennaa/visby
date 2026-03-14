import { CosmeticType, CosmeticRarity } from '../types';
import { IconName } from '../components/ui/Icon';

export interface ShopCosmetic {
  id: string;
  name: string;
  description: string;
  type: CosmeticType;
  rarity: CosmeticRarity;
  price: number;
  country?: string;
  icon: IconName;
  membersOnly?: boolean;
}

// Cultural cosmetics from around the world
export const COSMETICS_CATALOG: ShopCosmetic[] = [
  // ===================== HATS =====================
  { id: 'viking_helmet', name: 'Viking Helmet', description: 'A classic horned helmet from Scandinavia', type: 'hat', rarity: 'common', price: 0, icon: 'viking' },
  { id: 'samurai_helmet', name: 'Samurai Kabuto', description: 'Fearsome warrior helmet from Japan', type: 'hat', rarity: 'rare', price: 300, country: 'Japan', icon: 'star' },
  { id: 'sombrero', name: 'Sombrero', description: 'Wide-brimmed hat for sunny days in Mexico', type: 'hat', rarity: 'uncommon', price: 150, country: 'Mexico', icon: 'star' },
  { id: 'beret', name: 'French Beret', description: 'Tres chic! A soft round cap from France', type: 'hat', rarity: 'uncommon', price: 120, country: 'France', icon: 'star' },
  { id: 'fez', name: 'Fez', description: 'Red felt hat worn in Turkey and Morocco', type: 'hat', rarity: 'uncommon', price: 140, country: 'Turkey', icon: 'crown' },
  { id: 'top_hat', name: 'Top Hat', description: 'Jolly good! A fancy British top hat', type: 'hat', rarity: 'rare', price: 250, country: 'United Kingdom', icon: 'crown' },
  { id: 'rice_hat', name: 'Non La', description: 'Cone-shaped leaf hat from Vietnam', type: 'hat', rarity: 'uncommon', price: 130, country: 'Vietnam', icon: 'nature' },
  { id: 'crown', name: 'Royal Crown', description: 'A sparkling crown fit for royalty', type: 'hat', rarity: 'legendary', price: 1000, icon: 'crown', membersOnly: true },
  { id: 'turban', name: 'Turban', description: 'Colorful wrapped headwear from India', type: 'hat', rarity: 'uncommon', price: 160, country: 'India', icon: 'star' },
  { id: 'ushanka', name: 'Ushanka', description: 'Fuzzy ear-flap hat from Russia', type: 'hat', rarity: 'uncommon', price: 170, country: 'Russia', icon: 'star' },
  { id: 'feather_headdress', name: 'Feather Headdress', description: 'Colorful ceremonial feathers from Brazil', type: 'hat', rarity: 'epic', price: 500, country: 'Brazil', icon: 'nature' },

  // ===================== OUTFITS =====================
  { id: 'kimono', name: 'Kimono', description: 'Elegant Japanese traditional robe', type: 'outfit', rarity: 'rare', price: 350, country: 'Japan', icon: 'shirt' },
  { id: 'lederhosen', name: 'Lederhosen', description: 'Bavarian leather shorts from Germany', type: 'outfit', rarity: 'uncommon', price: 200, country: 'Germany', icon: 'shirt' },
  { id: 'sari', name: 'Sari', description: 'Beautiful draped garment from India', type: 'outfit', rarity: 'rare', price: 300, country: 'India', icon: 'shirt' },
  { id: 'kilt', name: 'Scottish Kilt', description: 'Plaid knee-length skirt from Scotland', type: 'outfit', rarity: 'uncommon', price: 220, country: 'United Kingdom', icon: 'shirt' },
  { id: 'hanbok', name: 'Hanbok', description: 'Vibrant Korean traditional dress', type: 'outfit', rarity: 'rare', price: 320, country: 'Korea', icon: 'shirt' },
  { id: 'dashiki', name: 'Dashiki', description: 'Bright patterned tunic from West Africa', type: 'outfit', rarity: 'uncommon', price: 200, country: 'Nigeria', icon: 'shirt' },
  { id: 'poncho', name: 'Poncho', description: 'Warm colorful poncho from Peru', type: 'outfit', rarity: 'uncommon', price: 180, country: 'Mexico', icon: 'shirt' },
  { id: 'toga', name: 'Roman Toga', description: 'When in Rome, wear a toga!', type: 'outfit', rarity: 'rare', price: 280, country: 'Italy', icon: 'landmark' },

  // ===================== ACCESSORIES =====================
  { id: 'sword', name: 'Viking Sword', description: 'A trusty blade for brave explorers', type: 'accessory', rarity: 'common', price: 0, icon: 'viking' },
  { id: 'shield', name: 'Viking Shield', description: 'Round shield with a golden crest', type: 'accessory', rarity: 'uncommon', price: 100, icon: 'viking' },
  { id: 'fan', name: 'Paper Fan', description: 'Elegant folding fan from Japan', type: 'accessory', rarity: 'uncommon', price: 120, country: 'Japan', icon: 'star' },
  { id: 'maracas', name: 'Maracas', description: 'Shake, shake, shake from Mexico!', type: 'accessory', rarity: 'common', price: 80, country: 'Mexico', icon: 'sparkles' },
  { id: 'lantern', name: 'Paper Lantern', description: 'Glowing red lantern from China', type: 'accessory', rarity: 'uncommon', price: 140, country: 'China', icon: 'flame' },
  { id: 'bagpipes', name: 'Bagpipes', description: 'Make some noise, Scottish style!', type: 'accessory', rarity: 'rare', price: 250, country: 'United Kingdom', icon: 'sparkles' },
  { id: 'necklace', name: 'Turquoise Necklace', description: 'Beautiful gemstone necklace', type: 'accessory', rarity: 'uncommon', price: 150, icon: 'sparkles' },
  { id: 'scarf', name: 'Red Scarf', description: 'Cozy scarf for cold adventures', type: 'accessory', rarity: 'common', price: 60, icon: 'shirt' },
];

export const COSMETIC_TYPES: { type: CosmeticType; label: string; icon: IconName }[] = [
  { type: 'hat', label: 'Hats', icon: 'crown' },
  { type: 'outfit', label: 'Outfits', icon: 'shirt' },
  { type: 'accessory', label: 'Accessories', icon: 'viking' },
];

export const RARITY_COLORS: Record<CosmeticRarity, string> = {
  common: '#9B9B9B',
  uncommon: '#5CB85C',
  rare: '#4A90D9',
  epic: '#9B59B6',
  legendary: '#FFD700',
};

export const RARITY_LABELS: Record<CosmeticRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

// Default cosmetics every new user gets
export const DEFAULT_OWNED = ['viking_helmet', 'sword'];

// Maps the display country name on cosmetics → in-game country ID from COUNTRIES config.
// Cosmetics whose country is NOT in this map are always available (their country isn't in the game yet).
export const COUNTRY_NAME_TO_ID: Record<string, string> = {
  'Japan': 'jp',
  'France': 'fr',
  'Mexico': 'mx',
  'Italy': 'it',
  'United Kingdom': 'gb',
  'Brazil': 'br',
};

// Set of country IDs that exist in-game
export const IN_GAME_COUNTRY_IDS = new Set(Object.values(COUNTRY_NAME_TO_ID));

// One souvenir cosmetic per country -- gifted FREE on first visit as a keepsake
export const COUNTRY_SOUVENIRS: Record<string, { cosmeticId: string; name: string }> = {
  'jp': { cosmeticId: 'samurai_helmet', name: 'Samurai Kabuto' },
  'fr': { cosmeticId: 'beret', name: 'French Beret' },
  'mx': { cosmeticId: 'sombrero', name: 'Sombrero' },
  'it': { cosmeticId: 'toga', name: 'Roman Toga' },
  'gb': { cosmeticId: 'top_hat', name: 'Top Hat' },
  'br': { cosmeticId: 'feather_headdress', name: 'Feather Headdress' },
};

/** Check if a cosmetic is locked for a user based on their visited countries */
export function isCosmeticLocked(cosmetic: ShopCosmetic, visitedCountries: string[]): boolean {
  if (!cosmetic.country) return false;
  const countryId = COUNTRY_NAME_TO_ID[cosmetic.country];
  if (!countryId) return false; // country not in game yet → always available
  return !visitedCountries.includes(countryId);
}

/** Get the country name that needs visiting to unlock a cosmetic, or null */
export function getUnlockCountryName(cosmetic: ShopCosmetic): string | null {
  if (!cosmetic.country) return null;
  const countryId = COUNTRY_NAME_TO_ID[cosmetic.country];
  if (!countryId) return null;
  return cosmetic.country;
}

// Membership tiers
export interface MembershipTier {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  priceLabel: string;
  perks: string[];
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'free',
    name: 'Explorer',
    icon: 'compass',
    color: '#9B9B9B',
    priceLabel: 'Free',
    perks: [
      'Visit countries with Aura',
      'Collect stamps & bites',
      'Basic lessons & quizzes',
      'Default avatar cosmetics',
    ],
  },
  {
    id: 'plus',
    name: 'Voyager',
    icon: 'globe',
    color: '#4A90D9',
    priceLabel: '$4.99/mo',
    perks: [
      'Everything in Explorer',
      '2x Aura from lessons',
      'Exclusive Voyager cosmetics',
      '3 free country visits/month',
      'No ads',
    ],
  },
  {
    id: 'premium',
    name: 'Legend',
    icon: 'crown',
    color: '#FFD700',
    priceLabel: '$9.99/mo',
    perks: [
      'Everything in Voyager',
      '3x Aura from lessons',
      'ALL cosmetics unlocked',
      'Unlimited free country visits',
      'Exclusive Legend badge',
      'Early access to new countries',
    ],
  },
];

// Aura packs for purchase
export interface AuraPack {
  id: string;
  amount: number;
  priceLabel: string;
  bonus?: string;
  icon: IconName;
  popular?: boolean;
}

export const AURA_PACKS: AuraPack[] = [
  { id: 'pack_small', amount: 200, priceLabel: '$0.99', icon: 'sparkles' },
  { id: 'pack_medium', amount: 500, priceLabel: '$1.99', bonus: '+50 bonus', icon: 'star', popular: true },
  { id: 'pack_large', amount: 1200, priceLabel: '$3.99', bonus: '+200 bonus', icon: 'sparkles' },
  { id: 'pack_mega', amount: 3000, priceLabel: '$7.99', bonus: '+750 bonus', icon: 'star' },
];
