import { FurnitureItem } from '../types';

export const FURNITURE_CATALOG: FurnitureItem[] = [
  // Japanese
  { id: 'jp_tatami', name: 'Tatami Mat', icon: 'home', category: 'floor', countryOrigin: 'jp', price: 50, width: 2, height: 1, rarity: 'common' },
  { id: 'jp_kotatsu', name: 'Kotatsu Table', icon: 'home', category: 'furniture', countryOrigin: 'jp', price: 120, width: 2, height: 1, rarity: 'uncommon' },
  { id: 'jp_screen', name: 'Paper Screen', icon: 'culture', category: 'wall', countryOrigin: 'jp', price: 80, width: 1, height: 2, rarity: 'common' },
  { id: 'jp_bonsai', name: 'Bonsai Tree', icon: 'nature', category: 'decor', countryOrigin: 'jp', price: 100, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'jp_lantern', name: 'Paper Lantern', icon: 'flame', category: 'decor', countryOrigin: 'jp', price: 60, width: 1, height: 1, rarity: 'common' },

  // French
  { id: 'fr_chandelier', name: 'Crystal Chandelier', icon: 'sparkles', category: 'wall', countryOrigin: 'fr', price: 300, width: 2, height: 1, rarity: 'rare' },
  { id: 'fr_table', name: 'Bistro Table', icon: 'cafe', category: 'furniture', countryOrigin: 'fr', price: 150, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'fr_painting', name: 'Impressionist Painting', icon: 'edit', category: 'wall', countryOrigin: 'fr', price: 200, width: 2, height: 1, rarity: 'rare' },
  { id: 'fr_vase', name: 'Flower Vase', icon: 'nature', category: 'decor', countryOrigin: 'fr', price: 80, width: 1, height: 1, rarity: 'common' },

  // Mexican
  { id: 'mx_cactus', name: 'Cactus Pot', icon: 'nature', category: 'decor', countryOrigin: 'mx', price: 60, width: 1, height: 1, rarity: 'common' },
  { id: 'mx_hammock', name: 'Woven Hammock', icon: 'home', category: 'furniture', countryOrigin: 'mx', price: 180, width: 2, height: 1, rarity: 'uncommon' },
  { id: 'mx_rug', name: 'Colorful Sarape Rug', icon: 'culture', category: 'floor', countryOrigin: 'mx', price: 100, width: 2, height: 1, rarity: 'uncommon' },
  { id: 'mx_pottery', name: 'Talavera Pottery', icon: 'star', category: 'decor', countryOrigin: 'mx', price: 90, width: 1, height: 1, rarity: 'common' },

  // Indian
  { id: 'in_elephant', name: 'Elephant Statue', icon: 'star', category: 'decor', countryOrigin: 'in', price: 150, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'in_tapestry', name: 'Silk Tapestry', icon: 'culture', category: 'wall', countryOrigin: 'in', price: 200, width: 2, height: 1, rarity: 'rare' },
  { id: 'in_cushion', name: 'Floor Cushion', icon: 'home', category: 'furniture', countryOrigin: 'in', price: 70, width: 1, height: 1, rarity: 'common' },
  { id: 'in_diya', name: 'Diya Lamp', icon: 'flame', category: 'decor', countryOrigin: 'in', price: 50, width: 1, height: 1, rarity: 'common' },

  // Egyptian
  { id: 'eg_sphinx', name: 'Mini Sphinx', icon: 'landmark', category: 'decor', countryOrigin: 'eg', price: 250, width: 1, height: 1, rarity: 'rare' },
  { id: 'eg_vase', name: 'Canopic Jar', icon: 'home', category: 'decor', countryOrigin: 'eg', price: 120, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'eg_carpet', name: 'Egyptian Carpet', icon: 'culture', category: 'floor', countryOrigin: 'eg', price: 160, width: 2, height: 2, rarity: 'uncommon' },

  // Korean
  { id: 'kr_table', name: 'Low Dining Table', icon: 'food', category: 'furniture', countryOrigin: 'kr', price: 100, width: 2, height: 1, rarity: 'common' },
  { id: 'kr_fan', name: 'Decorative Fan', icon: 'culture', category: 'wall', countryOrigin: 'kr', price: 80, width: 1, height: 1, rarity: 'common' },
  { id: 'kr_vase', name: 'Celadon Vase', icon: 'star', category: 'decor', countryOrigin: 'kr', price: 180, width: 1, height: 1, rarity: 'rare' },

  // Brazilian
  { id: 'br_hammock', name: 'Tropical Hammock', icon: 'nature', category: 'furniture', countryOrigin: 'br', price: 160, width: 2, height: 1, rarity: 'uncommon' },
  { id: 'br_mask', name: 'Carnival Mask', icon: 'sparkles', category: 'wall', countryOrigin: 'br', price: 120, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'br_drum', name: 'Samba Drum', icon: 'sparkles', category: 'decor', countryOrigin: 'br', price: 90, width: 1, height: 1, rarity: 'common' },

  // Universal/Premium
  { id: 'uni_bookshelf', name: 'World Bookshelf', icon: 'book', category: 'furniture', price: 200, width: 2, height: 2, rarity: 'uncommon' },
  { id: 'uni_globe', name: 'Spinning Globe', icon: 'geography', category: 'decor', price: 150, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'uni_telescope', name: 'Telescope', icon: 'compass', category: 'decor', price: 250, width: 1, height: 1, rarity: 'rare' },
  { id: 'uni_clock', name: 'World Clock', icon: 'clock', category: 'wall', price: 180, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'uni_plant', name: 'Potted Plant', icon: 'nature', category: 'decor', price: 40, width: 1, height: 1, rarity: 'common' },
  { id: 'uni_rug', name: 'Plush Rug', icon: 'home', category: 'floor', price: 80, width: 2, height: 2, rarity: 'common' },
  { id: 'uni_trophy', name: 'Trophy Cabinet', icon: 'trophy', category: 'furniture', price: 500, width: 2, height: 2, rarity: 'epic' },
];

export const WALLPAPER_OPTIONS = [
  { id: 'default', name: 'Default', color: '#FFF8F0' },
  { id: 'cream', name: 'Cream', color: '#FFFDD0' },
  { id: 'sky', name: 'Sky Blue', color: '#E6F2FC' },
  { id: 'lavender', name: 'Lavender', color: '#F0ECF9' },
  { id: 'mint', name: 'Mint', color: '#F0FFF0' },
  { id: 'peach', name: 'Peach', color: '#FFE8D6' },
  { id: 'rose', name: 'Rose', color: '#FFF0F5' },
  { id: 'sage', name: 'Sage', color: '#F0F5EC' },
  { id: 'sunset', name: 'Sunset', color: '#FFF0E0' },
  { id: 'midnight', name: 'Midnight', color: '#E8E0F0' },
];

export const FLOORING_OPTIONS = [
  { id: 'default', name: 'Default', color: '#D4C5A0' },
  { id: 'oak', name: 'Oak Wood', color: '#C8A882' },
  { id: 'marble', name: 'Marble', color: '#E8E0D8' },
  { id: 'tatami', name: 'Tatami', color: '#D4C480' },
  { id: 'tile', name: 'Tile', color: '#D0D0D0' },
  { id: 'carpet', name: 'Carpet', color: '#B8A8C8' },
  { id: 'bamboo', name: 'Bamboo', color: '#C8B888' },
  { id: 'stone', name: 'Stone', color: '#B0A898' },
];
