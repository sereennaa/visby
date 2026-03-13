import { CosmeticType, CosmeticRarity } from '../types';

export interface ShopCosmetic {
  id: string;
  name: string;
  description: string;
  type: CosmeticType;
  rarity: CosmeticRarity;
  price: number;
  country?: string;
  emoji: string;
  membersOnly?: boolean;
}

// Cultural cosmetics from around the world
export const COSMETICS_CATALOG: ShopCosmetic[] = [
  // ===================== HATS =====================
  { id: 'viking_helmet', name: 'Viking Helmet', description: 'A classic horned helmet from Scandinavia', type: 'hat', rarity: 'common', price: 0, emoji: '⚔️' },
  { id: 'samurai_helmet', name: 'Samurai Kabuto', description: 'Fearsome warrior helmet from Japan', type: 'hat', rarity: 'rare', price: 300, country: 'Japan', emoji: '🎌' },
  { id: 'sombrero', name: 'Sombrero', description: 'Wide-brimmed hat for sunny days in Mexico', type: 'hat', rarity: 'uncommon', price: 150, country: 'Mexico', emoji: '🇲🇽' },
  { id: 'beret', name: 'French Beret', description: 'Très chic! A soft round cap from France', type: 'hat', rarity: 'uncommon', price: 120, country: 'France', emoji: '🇫🇷' },
  { id: 'fez', name: 'Fez', description: 'Red felt hat worn in Turkey and Morocco', type: 'hat', rarity: 'uncommon', price: 140, country: 'Turkey', emoji: '🎩' },
  { id: 'top_hat', name: 'Top Hat', description: 'Jolly good! A fancy British top hat', type: 'hat', rarity: 'rare', price: 250, country: 'United Kingdom', emoji: '🇬🇧' },
  { id: 'rice_hat', name: 'Nón Lá', description: 'Cone-shaped leaf hat from Vietnam', type: 'hat', rarity: 'uncommon', price: 130, country: 'Vietnam', emoji: '🌾' },
  { id: 'crown', name: 'Royal Crown', description: 'A sparkling crown fit for royalty', type: 'hat', rarity: 'legendary', price: 1000, emoji: '👑', membersOnly: true },
  { id: 'turban', name: 'Turban', description: 'Colorful wrapped headwear from India', type: 'hat', rarity: 'uncommon', price: 160, country: 'India', emoji: '🇮🇳' },
  { id: 'ushanka', name: 'Ushanka', description: 'Fuzzy ear-flap hat from Russia', type: 'hat', rarity: 'uncommon', price: 170, country: 'Russia', emoji: '🇷🇺' },
  { id: 'feather_headdress', name: 'Feather Headdress', description: 'Colorful ceremonial feathers from Brazil', type: 'hat', rarity: 'epic', price: 500, country: 'Brazil', emoji: '🪶' },

  // ===================== OUTFITS =====================
  { id: 'kimono', name: 'Kimono', description: 'Elegant Japanese traditional robe', type: 'outfit', rarity: 'rare', price: 350, country: 'Japan', emoji: '👘' },
  { id: 'lederhosen', name: 'Lederhosen', description: 'Bavarian leather shorts from Germany', type: 'outfit', rarity: 'uncommon', price: 200, country: 'Germany', emoji: '🇩🇪' },
  { id: 'sari', name: 'Sari', description: 'Beautiful draped garment from India', type: 'outfit', rarity: 'rare', price: 300, country: 'India', emoji: '🇮🇳' },
  { id: 'kilt', name: 'Scottish Kilt', description: 'Plaid knee-length skirt from Scotland', type: 'outfit', rarity: 'uncommon', price: 220, country: 'United Kingdom', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { id: 'hanbok', name: 'Hanbok', description: 'Vibrant Korean traditional dress', type: 'outfit', rarity: 'rare', price: 320, country: 'Korea', emoji: '🇰🇷' },
  { id: 'dashiki', name: 'Dashiki', description: 'Bright patterned tunic from West Africa', type: 'outfit', rarity: 'uncommon', price: 200, country: 'Nigeria', emoji: '🇳🇬' },
  { id: 'poncho', name: 'Poncho', description: 'Warm colorful poncho from Peru', type: 'outfit', rarity: 'uncommon', price: 180, country: 'Mexico', emoji: '🇵🇪' },
  { id: 'toga', name: 'Roman Toga', description: 'When in Rome, wear a toga!', type: 'outfit', rarity: 'rare', price: 280, country: 'Italy', emoji: '🏛️' },

  // ===================== ACCESSORIES =====================
  { id: 'sword', name: 'Viking Sword', description: 'A trusty blade for brave explorers', type: 'accessory', rarity: 'common', price: 0, emoji: '⚔️' },
  { id: 'shield', name: 'Viking Shield', description: 'Round shield with a golden crest', type: 'accessory', rarity: 'uncommon', price: 100, emoji: '🛡️' },
  { id: 'fan', name: 'Paper Fan', description: 'Elegant folding fan from Japan', type: 'accessory', rarity: 'uncommon', price: 120, country: 'Japan', emoji: '🪭' },
  { id: 'maracas', name: 'Maracas', description: 'Shake, shake, shake from Mexico!', type: 'accessory', rarity: 'common', price: 80, country: 'Mexico', emoji: '🎶' },
  { id: 'lantern', name: 'Paper Lantern', description: 'Glowing red lantern from China', type: 'accessory', rarity: 'uncommon', price: 140, country: 'China', emoji: '🏮' },
  { id: 'bagpipes', name: 'Bagpipes', description: 'Make some noise, Scottish style!', type: 'accessory', rarity: 'rare', price: 250, country: 'United Kingdom', emoji: '🎵' },
  { id: 'necklace', name: 'Turquoise Necklace', description: 'Beautiful gemstone necklace', type: 'accessory', rarity: 'uncommon', price: 150, emoji: '💎' },
  { id: 'scarf', name: 'Red Scarf', description: 'Cozy scarf for cold adventures', type: 'accessory', rarity: 'common', price: 60, emoji: '🧣' },
];

export const COSMETIC_TYPES: { type: CosmeticType; label: string; emoji: string }[] = [
  { type: 'hat', label: 'Hats', emoji: '🎩' },
  { type: 'outfit', label: 'Outfits', emoji: '👘' },
  { type: 'accessory', label: 'Accessories', emoji: '⚔️' },
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

// Membership tiers
export interface MembershipTier {
  id: string;
  name: string;
  emoji: string;
  color: string;
  priceLabel: string;
  perks: string[];
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'free',
    name: 'Explorer',
    emoji: '🧭',
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
    emoji: '⛵',
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
    emoji: '👑',
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
  emoji: string;
  popular?: boolean;
}

export const AURA_PACKS: AuraPack[] = [
  { id: 'pack_small', amount: 200, priceLabel: '$0.99', emoji: '✨' },
  { id: 'pack_medium', amount: 500, priceLabel: '$1.99', bonus: '+50 bonus', emoji: '🌟', popular: true },
  { id: 'pack_large', amount: 1200, priceLabel: '$3.99', bonus: '+200 bonus', emoji: '💫' },
  { id: 'pack_mega', amount: 3000, priceLabel: '$7.99', bonus: '+750 bonus', emoji: '⭐' },
];
