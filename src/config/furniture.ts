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

  // Thai
  { id: 'th_silk_pillow', name: 'Thai Silk Pillow', icon: 'home', category: 'decor', countryOrigin: 'th', price: 70, width: 1, height: 1, rarity: 'common' },
  { id: 'th_spirit_house', name: 'Spirit House', icon: 'temple', category: 'decor', countryOrigin: 'th', price: 200, width: 1, height: 1, rarity: 'rare' },

  // Korean (additional)
  { id: 'kr_mirror', name: 'Celadon Mirror', icon: 'star', category: 'wall', countryOrigin: 'kr', price: 140, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'kr_screen', name: 'Korean Folding Screen', icon: 'culture', category: 'wall', countryOrigin: 'kr', price: 220, width: 2, height: 2, rarity: 'rare' },

  // Moroccan
  { id: 'ma_pouf', name: 'Moroccan Leather Pouf', icon: 'home', category: 'furniture', countryOrigin: 'ma', price: 90, width: 1, height: 1, rarity: 'common' },
  { id: 'ma_tile_table', name: 'Mosaic Tile Table', icon: 'culture', category: 'furniture', countryOrigin: 'ma', price: 160, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'ma_fountain', name: 'Mosaic Fountain', icon: 'nature', category: 'decor', countryOrigin: 'ma', price: 350, width: 2, height: 2, rarity: 'epic' },

  // Peruvian
  { id: 'pe_blanket', name: 'Peruvian Woven Blanket', icon: 'culture', category: 'decor', countryOrigin: 'pe', price: 80, width: 1, height: 1, rarity: 'common' },
  { id: 'pe_pottery', name: 'Peruvian Pottery', icon: 'star', category: 'decor', countryOrigin: 'pe', price: 100, width: 1, height: 1, rarity: 'common' },

  // Kenyan
  { id: 'ke_basket', name: 'Kenyan Basket', icon: 'culture', category: 'decor', countryOrigin: 'ke', price: 60, width: 1, height: 1, rarity: 'common' },
  { id: 'ke_shield', name: 'Maasai Shield', icon: 'landmark', category: 'wall', countryOrigin: 'ke', price: 180, width: 1, height: 1, rarity: 'uncommon' },

  // Norwegian
  { id: 'no_ski_set', name: 'Vintage Ski Set', icon: 'compass', category: 'wall', countryOrigin: 'no', price: 150, width: 1, height: 2, rarity: 'uncommon' },
  { id: 'no_viking_shield', name: 'Viking Shield Display', icon: 'landmark', category: 'wall', countryOrigin: 'no', price: 250, width: 1, height: 1, rarity: 'rare' },

  // Turkish
  { id: 'tr_lamp', name: 'Turkish Mosaic Lamp', icon: 'flame', category: 'decor', countryOrigin: 'tr', price: 110, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'tr_carpet', name: 'Turkish Carpet', icon: 'culture', category: 'floor', countryOrigin: 'tr', price: 200, width: 2, height: 2, rarity: 'rare' },
  { id: 'tr_evil_eye', name: 'Evil Eye Wall Hanging', icon: 'sparkles', category: 'wall', countryOrigin: 'tr', price: 60, width: 1, height: 1, rarity: 'common' },

  // Greek
  { id: 'gr_amphora', name: 'Greek Amphora', icon: 'landmark', category: 'decor', countryOrigin: 'gr', price: 160, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'gr_column', name: 'Greek Column', icon: 'landmark', category: 'decor', countryOrigin: 'gr', price: 280, width: 1, height: 2, rarity: 'rare' },
  { id: 'gr_olive_tree', name: 'Olive Tree', icon: 'nature', category: 'decor', countryOrigin: 'gr', price: 120, width: 1, height: 1, rarity: 'uncommon' },

  // Universal/Premium
  { id: 'uni_bookshelf', name: 'World Bookshelf', icon: 'book', category: 'furniture', price: 200, width: 2, height: 2, rarity: 'uncommon' },
  { id: 'uni_globe', name: 'Spinning Globe', icon: 'geography', category: 'decor', price: 150, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'uni_telescope', name: 'Telescope', icon: 'compass', category: 'decor', price: 250, width: 1, height: 1, rarity: 'rare' },
  { id: 'uni_clock', name: 'World Clock', icon: 'clock', category: 'wall', price: 180, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'uni_plant', name: 'Potted Plant', icon: 'nature', category: 'decor', price: 40, width: 1, height: 1, rarity: 'common' },
  { id: 'uni_rug', name: 'Plush Rug', icon: 'home', category: 'floor', price: 80, width: 2, height: 2, rarity: 'common' },
  { id: 'uni_trophy', name: 'Trophy Cabinet', icon: 'trophy', category: 'furniture', price: 500, width: 2, height: 2, rarity: 'epic' },
  { id: 'uni_map_poster', name: 'World Map Poster', icon: 'compass', category: 'wall', price: 50, width: 2, height: 1, rarity: 'common' },
  { id: 'uni_disco_ball', name: 'Disco Ball', icon: 'sparkles', category: 'wall', price: 180, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'uni_aquarium', name: 'Aquarium', icon: 'nature', category: 'furniture', price: 300, width: 2, height: 1, rarity: 'rare' },
  { id: 'uni_piano', name: 'Grand Piano', icon: 'star', category: 'furniture', price: 500, width: 2, height: 2, rarity: 'epic' },
  { id: 'uni_beanbag', name: 'Beanbag Chair', icon: 'home', category: 'furniture', price: 70, width: 1, height: 1, rarity: 'common' },
  { id: 'uni_neon_sign', name: 'Neon Sign', icon: 'sparkles', category: 'wall', price: 150, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'uni_star_projector', name: 'Star Projector', icon: 'star', category: 'decor', price: 200, width: 1, height: 1, rarity: 'rare' },
  { id: 'uni_game_console', name: 'Game Console', icon: 'sparkles', category: 'furniture', price: 250, width: 1, height: 1, rarity: 'uncommon' },
  { id: 'uni_lava_lamp', name: 'Lava Lamp', icon: 'flame', category: 'decor', price: 60, width: 1, height: 1, rarity: 'common' },
  { id: 'uni_vinyl_player', name: 'Vinyl Record Player', icon: 'culture', category: 'furniture', price: 180, width: 1, height: 1, rarity: 'uncommon' },
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
  { id: 'coral', name: 'Coral', color: '#FFE4E1' },
  { id: 'slate', name: 'Slate', color: '#E2E8F0' },
  { id: 'buttercup', name: 'Buttercup', color: '#FFF9C4' },
  { id: 'ocean', name: 'Ocean', color: '#D6EAF8' },
  { id: 'charcoal', name: 'Charcoal', color: '#D5D8DC' },
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
  { id: 'walnut', name: 'Walnut', color: '#8B7355' },
  { id: 'terracotta', name: 'Terracotta', color: '#CD853F' },
  { id: 'slate_floor', name: 'Slate', color: '#9BA8AB' },
  { id: 'sandstone', name: 'Sandstone', color: '#D2B48C' },
  { id: 'cherry', name: 'Cherry Wood', color: '#C07050' },
];
