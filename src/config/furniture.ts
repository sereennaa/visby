import { FurnitureItem, FurnitureSet } from '../types';

/** Country-origin IDs to display names for the shop (e.g. "Japan", "France"). */
export const COUNTRY_ORIGIN_NAMES: Record<string, string> = {
  jp: 'Japan', fr: 'France', mx: 'Mexico', it: 'Italy', gb: 'United Kingdom', br: 'Brazil',
  in: 'India', eg: 'Egypt', kr: 'South Korea', th: 'Thailand', ma: 'Morocco', pe: 'Peru',
  ke: 'Kenya', no: 'Norway', tr: 'Turkey', gr: 'Greece',
};

/** Returns only furniture the user can see: universal items + items from countries they've visited. */
export function getAvailableFurniture(visitedCountryIds: string[]): FurnitureItem[] {
  return FURNITURE_CATALOG.filter(
    (item) => !item.countryOrigin || visitedCountryIds.includes(item.countryOrigin),
  );
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  // === Functional furniture (Visby can eat, cook, rest, study, play) ===
  { id: 'uni_dining_table', name: 'Dining Table', icon: 'food', category: 'furniture', price: 100, width: 2, height: 1, rarity: 'common', description: 'Solid wood table with a smooth finish; perfect for shared meals and homework.', interactionType: 'table', interactionLabel: 'Eat a meal with Visby', interactionAura: 15 },
  { id: 'uni_stove', name: 'Kitchen Stove', icon: 'food', category: 'furniture', price: 150, width: 1, height: 1, rarity: 'uncommon', description: 'Classic four-burner stove with oven; the heart of every kitchen.', interactionType: 'stove', interactionLabel: 'Cook a traditional meal', interactionAura: 25 },
  { id: 'uni_bed', name: 'Cozy Bed', icon: 'home', category: 'furniture', price: 120, width: 2, height: 1, rarity: 'common', description: 'Soft mattress, plush pillows, and a warm duvet — the ultimate rest spot.', interactionType: 'bed', interactionLabel: 'Rest with Visby', interactionAura: 15 },
  { id: 'uni_study_desk', name: 'Study Desk', icon: 'book', category: 'furniture', price: 110, width: 1, height: 1, rarity: 'common', description: 'Sturdy desk with drawer and cable management; built for focus.', interactionType: 'bookshelf', interactionLabel: 'Study together', interactionAura: 15 },
  { id: 'uni_toy_chest', name: 'Toy Chest', icon: 'sparkles', category: 'furniture', price: 80, width: 1, height: 1, rarity: 'common', description: 'Hand-painted wooden chest full of games and plushies.', interactionType: 'toy', interactionLabel: 'Play with Visby', interactionAura: 15 },

  // Japanese — traditional materials and clean lines
  { id: 'jp_tatami', name: 'Tatami Mat', icon: 'home', category: 'floor', countryOrigin: 'jp', price: 50, width: 2, height: 1, rarity: 'common', description: 'Woven rush straw with cloth border; the classic Japanese floor surface, soft and fragrant.' },
  { id: 'jp_kotatsu', name: 'Kotatsu Table', icon: 'home', category: 'furniture', countryOrigin: 'jp', price: 120, width: 2, height: 1, rarity: 'uncommon', description: 'Low wooden frame with a heavy futon blanket and built-in heater — cozy for winter evenings.', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', interactionType: 'table', interactionLabel: 'Eat at the kotatsu', interactionAura: 18 },
  { id: 'jp_screen', name: 'Shoji Paper Screen', icon: 'culture', category: 'wall', countryOrigin: 'jp', price: 80, width: 1, height: 2, rarity: 'common', description: 'Wood-framed panels with translucent rice paper; diffuses light beautifully.', imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4b40?w=400' },
  { id: 'jp_bonsai', name: 'Bonsai Tree', icon: 'nature', category: 'decor', countryOrigin: 'jp', price: 100, width: 1, height: 1, rarity: 'uncommon', description: 'Miniature pine in a glazed pot; centuries of care in one tiny tree.', imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400' },
  { id: 'jp_lantern', name: 'Chochin Lantern', icon: 'flame', category: 'decor', countryOrigin: 'jp', price: 60, width: 1, height: 1, rarity: 'common', description: 'Collapsible paper lantern with bamboo frame; warm, soft glow.' },
  { id: 'jp_zabuton', name: 'Zabuton Cushion', icon: 'home', category: 'furniture', countryOrigin: 'jp', price: 45, width: 1, height: 1, rarity: 'common', description: 'Square floor cushion in indigo cotton; traditional seating for tea or meditation.' },
  { id: 'jp_tansu', name: 'Tansu Chest', icon: 'home', category: 'furniture', countryOrigin: 'jp', price: 220, width: 1, height: 2, rarity: 'rare', description: 'Antique-style wooden chest with iron fittings; multiple drawers for treasures.' },

  // French — elegant and decorative
  { id: 'fr_chandelier', name: 'Crystal Chandelier', icon: 'sparkles', category: 'wall', countryOrigin: 'fr', price: 300, width: 2, height: 1, rarity: 'rare', description: 'Multi-tiered crystal drops and candle-style bulbs; pure Parisian elegance.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { id: 'fr_table', name: 'Bistro Table', icon: 'cafe', category: 'furniture', countryOrigin: 'fr', price: 150, width: 1, height: 1, rarity: 'uncommon', description: 'Round marble-top table with wrought-iron base; café-style for two.', imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400', interactionType: 'table', interactionLabel: 'Eat a meal with Visby', interactionAura: 18 },
  { id: 'fr_painting', name: 'Impressionist Painting', icon: 'edit', category: 'wall', countryOrigin: 'fr', price: 200, width: 2, height: 1, rarity: 'rare', description: 'Oil-on-canvas replica; soft brushstrokes and dappled light, museum quality.' },
  { id: 'fr_vase', name: 'Limoges Vase', icon: 'nature', category: 'decor', countryOrigin: 'fr', price: 80, width: 1, height: 1, rarity: 'common', description: 'White porcelain vase with delicate floral trim; French classic.' },
  { id: 'fr_armoire', name: 'Provence Armoire', icon: 'home', category: 'furniture', countryOrigin: 'fr', price: 280, width: 2, height: 2, rarity: 'rare', description: 'Pale blue distressed wood, carved doors; holds linens and keeps the room chic.' },
  { id: 'fr_baguette_rack', name: 'Baguette Wall Rack', icon: 'food', category: 'wall', countryOrigin: 'fr', price: 55, width: 1, height: 1, rarity: 'common', description: 'Wrought-iron rack for bread and herbs; boulangerie at home.' },

  // Mexican — bold colors and craft
  { id: 'mx_cactus', name: 'Talavera Cactus Pot', icon: 'nature', category: 'decor', countryOrigin: 'mx', price: 60, width: 1, height: 1, rarity: 'common', description: 'Hand-painted ceramic pot with a small cactus; blue-and-white or colorful design.' },
  { id: 'mx_hammock', name: 'Woven Hammock', icon: 'home', category: 'furniture', countryOrigin: 'mx', price: 180, width: 2, height: 1, rarity: 'uncommon', description: 'Cotton or nylon weave in bright stripes; authentic Yucatán siesta vibes.' },
  { id: 'mx_rug', name: 'Sarape Rug', icon: 'culture', category: 'floor', countryOrigin: 'mx', price: 100, width: 2, height: 1, rarity: 'uncommon', description: 'Thick wool rug with traditional stripes and geometric patterns; warm underfoot.' },
  { id: 'mx_pottery', name: 'Talavera Pottery', icon: 'star', category: 'decor', countryOrigin: 'mx', price: 90, width: 1, height: 1, rarity: 'common', description: 'Glazed earthenware from Puebla; intricate patterns and vivid colors.' },
  { id: 'mx_otomi', name: 'Otomi Embroidery Panel', icon: 'culture', category: 'wall', countryOrigin: 'mx', price: 160, width: 2, height: 1, rarity: 'uncommon', description: 'Hand-embroidered cotton with animals and flowers; Huasteca tradition.' },
  { id: 'mx_sugar_skull', name: 'Sugar Skull Shelf', icon: 'culture', category: 'wall', countryOrigin: 'mx', price: 75, width: 1, height: 1, rarity: 'common', description: 'Colorful decorative skull and small shelf; Día de los Muertos at home.' },

  // Italian — Tuscan and classic Mediterranean
  { id: 'it_tuscan_table', name: 'Tuscan Dining Table', icon: 'food', category: 'furniture', countryOrigin: 'it', price: 240, width: 2, height: 1, rarity: 'rare', description: 'Heavy reclaimed wood with wrought-iron base; farmhouse Italian style.', imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400', interactionType: 'table', interactionLabel: 'Eat a meal with Visby', interactionAura: 20 },
  { id: 'it_venetian_mirror', name: 'Venetian Mirror', icon: 'sparkles', category: 'wall', countryOrigin: 'it', price: 190, width: 1, height: 2, rarity: 'uncommon', description: 'Ornate gold-leaf frame with aged glass; Murano elegance.', imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400' },
  { id: 'it_espresso_set', name: 'Espresso Set', icon: 'cafe', category: 'decor', countryOrigin: 'it', price: 95, width: 1, height: 1, rarity: 'common', description: 'Small moka pot and ceramic cups; authentic Italian coffee corner.' },
  { id: 'it_olive_jars', name: 'Terracotta Olive Oil Jars', icon: 'food', category: 'decor', countryOrigin: 'it', price: 70, width: 1, height: 1, rarity: 'common', description: 'Glazed terracotta vessels with cork stoppers; kitchen décor from Tuscany.' },
  { id: 'it_roman_bust', name: 'Roman Bust', icon: 'landmark', category: 'decor', countryOrigin: 'it', price: 200, width: 1, height: 1, rarity: 'rare', description: 'Classical marble-style bust on a pedestal; a touch of the Forum.' },
  { id: 'it_leather_chair', name: 'Italian Leather Armchair', icon: 'home', category: 'furniture', countryOrigin: 'it', price: 320, width: 1, height: 1, rarity: 'rare', description: 'Butter-soft leather, tufted; timeless Italian design.' },
  { id: 'it_gondola_oar', name: 'Gondola Oar', icon: 'compass', category: 'wall', countryOrigin: 'it', price: 85, width: 1, height: 2, rarity: 'common', description: 'Decorative Venetian oar with painted stripes; bring the canals home.' },

  // United Kingdom — cozy and traditional
  { id: 'gb_wingback', name: 'Wingback Chair', icon: 'home', category: 'furniture', countryOrigin: 'gb', price: 260, width: 1, height: 1, rarity: 'rare', description: 'High-backed armchair in velvet or tweed; classic British comfort.', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { id: 'gb_tea_trolley', name: 'Afternoon Tea Trolley', icon: 'culture', category: 'furniture', countryOrigin: 'gb', price: 170, width: 1, height: 1, rarity: 'uncommon', description: 'Rolling cart with tiers for teapot, scones, and jam; proper tea time.', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', interactionType: 'table', interactionLabel: 'Eat a meal with Visby', interactionAura: 18 },
  { id: 'gb_tartan_throw', name: 'Tartan Throw', icon: 'home', category: 'decor', countryOrigin: 'gb', price: 65, width: 1, height: 1, rarity: 'common', description: 'Wool blanket in classic Scottish plaid; drape over a sofa or bed.' },
  { id: 'gb_bigben_clock', name: 'Big Ben Clock', icon: 'clock', category: 'wall', countryOrigin: 'gb', price: 140, width: 1, height: 1, rarity: 'uncommon', description: 'Miniature tower clock with chime; London landmark on your wall.' },
  { id: 'gb_book_nook', name: 'Library Book Nook', icon: 'book', category: 'furniture', countryOrigin: 'gb', price: 210, width: 2, height: 2, rarity: 'rare', description: 'Floor-to-ceiling style bookshelf with ladder; British study vibes.', interactionType: 'bookshelf', interactionLabel: 'Study together', interactionAura: 20 },
  { id: 'gb_fireplace_guard', name: 'Fireplace Fender', icon: 'flame', category: 'decor', countryOrigin: 'gb', price: 120, width: 2, height: 1, rarity: 'uncommon', description: 'Brass fender and tools for a cosy hearth; very British.' },
  { id: 'gb_fish_chips_sign', name: 'Fish & Chips Sign', icon: 'food', category: 'wall', countryOrigin: 'gb', price: 55, width: 1, height: 1, rarity: 'common', description: 'Vintage-style shop sign; a bit of the high street at home.' },

  // Indian
  { id: 'in_elephant', name: 'Elephant Statue', icon: 'star', category: 'decor', countryOrigin: 'in', price: 150, width: 1, height: 1, rarity: 'uncommon', description: 'Carved wooden or brass elephant; symbol of wisdom and luck.' },
  { id: 'in_tapestry', name: 'Silk Tapestry', icon: 'culture', category: 'wall', countryOrigin: 'in', price: 200, width: 2, height: 1, rarity: 'rare', description: 'Hand-woven silk with intricate patterns; Rajasthani craft.' },
  { id: 'in_cushion', name: 'Floor Cushion', icon: 'home', category: 'furniture', countryOrigin: 'in', price: 70, width: 1, height: 1, rarity: 'common', description: 'Brightly covered bolster for sitting or meditation; versatile and colourful.' },
  { id: 'in_diya', name: 'Diya Lamp', icon: 'flame', category: 'decor', countryOrigin: 'in', price: 50, width: 1, height: 1, rarity: 'common', description: 'Small clay or brass oil lamp; used in festivals and daily prayer.' },

  // Egyptian
  { id: 'eg_sphinx', name: 'Mini Sphinx', icon: 'landmark', category: 'decor', countryOrigin: 'eg', price: 250, width: 1, height: 1, rarity: 'rare', description: 'Stone-look replica of the Great Sphinx; ancient Egypt on your shelf.' },
  { id: 'eg_vase', name: 'Canopic Jar', icon: 'home', category: 'decor', countryOrigin: 'eg', price: 120, width: 1, height: 1, rarity: 'uncommon', description: 'Replica jar with hieroglyphics; once held organs in tombs.' },
  { id: 'eg_carpet', name: 'Egyptian Carpet', icon: 'culture', category: 'floor', countryOrigin: 'eg', price: 160, width: 2, height: 2, rarity: 'uncommon', description: 'Woven rug with Pharaonic motifs; rich colours and pattern.' },

  // Korean
  { id: 'kr_table', name: 'Low Dining Table', icon: 'food', category: 'furniture', countryOrigin: 'kr', price: 100, width: 2, height: 1, rarity: 'common', description: 'Low wooden table for floor dining; clean lines and natural finish.', interactionType: 'table', interactionLabel: 'Eat together', interactionAura: 18 },
  { id: 'kr_fan', name: 'Decorative Fan', icon: 'culture', category: 'wall', countryOrigin: 'kr', price: 80, width: 1, height: 1, rarity: 'common', description: 'Folded paper or silk fan with painted design; traditional accessory.' },
  { id: 'kr_vase', name: 'Celadon Vase', icon: 'star', category: 'decor', countryOrigin: 'kr', price: 180, width: 1, height: 1, rarity: 'rare', description: 'Jade-green glazed pottery; iconic Korean ceramic art.' },
  { id: 'kr_mirror', name: 'Celadon Mirror', icon: 'star', category: 'wall', countryOrigin: 'kr', price: 140, width: 1, height: 1, rarity: 'uncommon', description: 'Round mirror in celadon-style frame; elegant and understated.' },
  { id: 'kr_screen', name: 'Korean Folding Screen', icon: 'culture', category: 'wall', countryOrigin: 'kr', price: 220, width: 2, height: 2, rarity: 'rare', description: 'Multi-panel screen with landscape or floral painting; room divider and art.' },

  // Brazilian
  { id: 'br_hammock', name: 'Tropical Hammock', icon: 'nature', category: 'furniture', countryOrigin: 'br', price: 160, width: 2, height: 1, rarity: 'uncommon', description: 'Colorful woven hammock; sway in the shade, Brazilian style.' },
  { id: 'br_mask', name: 'Carnival Mask', icon: 'sparkles', category: 'wall', countryOrigin: 'br', price: 120, width: 1, height: 1, rarity: 'uncommon', description: 'Feathered and sequined mask; a splash of Rio Carnival.' },
  { id: 'br_drum', name: 'Samba Drum', icon: 'sparkles', category: 'decor', countryOrigin: 'br', price: 90, width: 1, height: 1, rarity: 'common', description: 'Hand drum with bold design; ready for a rhythm break.' },

  // Thai
  { id: 'th_silk_pillow', name: 'Thai Silk Pillow', icon: 'home', category: 'decor', countryOrigin: 'th', price: 70, width: 1, height: 1, rarity: 'common', description: 'Iridescent silk cushion in jewel colours; Thai craft.' },
  { id: 'th_spirit_house', name: 'Spirit House', icon: 'temple', category: 'decor', countryOrigin: 'th', price: 200, width: 1, height: 1, rarity: 'rare', description: 'Miniature shrine on a post; traditional offering to land spirits.' },

  // Moroccan
  { id: 'ma_pouf', name: 'Moroccan Leather Pouf', icon: 'home', category: 'furniture', countryOrigin: 'ma', price: 90, width: 1, height: 1, rarity: 'common', description: 'Hand-stitched leather pouf in jewel tones; seating or footrest.' },
  { id: 'ma_tile_table', name: 'Mosaic Tile Table', icon: 'culture', category: 'furniture', countryOrigin: 'ma', price: 160, width: 1, height: 1, rarity: 'uncommon', description: 'Small table with zellige tile top; Marrakech in your room.', interactionType: 'table', interactionLabel: 'Eat a meal with Visby', interactionAura: 18 },
  { id: 'ma_fountain', name: 'Mosaic Fountain', icon: 'nature', category: 'decor', countryOrigin: 'ma', price: 350, width: 2, height: 2, rarity: 'epic', description: 'Ceramic tile fountain with gentle water; riad courtyard centrepiece.' },

  // Peruvian
  { id: 'pe_blanket', name: 'Peruvian Woven Blanket', icon: 'culture', category: 'decor', countryOrigin: 'pe', price: 80, width: 1, height: 1, rarity: 'common', description: 'Alpaca wool blanket with Andean patterns; soft and warm.' },
  { id: 'pe_pottery', name: 'Peruvian Pottery', icon: 'star', category: 'decor', countryOrigin: 'pe', price: 100, width: 1, height: 1, rarity: 'common', description: 'Hand-thrown clay vessel with geometric design; Inca-inspired.' },

  // Kenyan
  { id: 'ke_basket', name: 'Kenyan Basket', icon: 'culture', category: 'decor', countryOrigin: 'ke', price: 60, width: 1, height: 1, rarity: 'common', description: 'Coiled sisal or grass basket; natural and sturdy.' },
  { id: 'ke_shield', name: 'Maasai Shield', icon: 'landmark', category: 'wall', countryOrigin: 'ke', price: 180, width: 1, height: 1, rarity: 'uncommon', description: 'Decorative leather shield with beadwork; warrior heritage.' },

  // Norwegian
  { id: 'no_ski_set', name: 'Vintage Ski Set', icon: 'compass', category: 'wall', countryOrigin: 'no', price: 150, width: 1, height: 2, rarity: 'uncommon', description: 'Wooden skis and poles as wall art; Nordic cabin feel.' },
  { id: 'no_viking_shield', name: 'Viking Shield Display', icon: 'landmark', category: 'wall', countryOrigin: 'no', price: 250, width: 1, height: 1, rarity: 'rare', description: 'Round wooden shield with metal boss; Scandinavian history.' },

  // Turkish
  { id: 'tr_lamp', name: 'Turkish Mosaic Lamp', icon: 'flame', category: 'decor', countryOrigin: 'tr', price: 110, width: 1, height: 1, rarity: 'uncommon', description: 'Coloured glass pieces in metal frame; casts patterned light.' },
  { id: 'tr_carpet', name: 'Turkish Carpet', icon: 'culture', category: 'floor', countryOrigin: 'tr', price: 200, width: 2, height: 2, rarity: 'rare', description: 'Hand-knotted wool rug; rich colours and traditional motifs.' },
  { id: 'tr_evil_eye', name: 'Evil Eye Wall Hanging', icon: 'sparkles', category: 'wall', countryOrigin: 'tr', price: 60, width: 1, height: 1, rarity: 'common', description: 'Nazar boncuğu charm; believed to ward off bad luck.' },

  // Greek
  { id: 'gr_amphora', name: 'Greek Amphora', icon: 'landmark', category: 'decor', countryOrigin: 'gr', price: 160, width: 1, height: 1, rarity: 'uncommon', description: 'Terracotta two-handled vessel; ancient Greek style.' },
  { id: 'gr_column', name: 'Greek Column', icon: 'landmark', category: 'decor', countryOrigin: 'gr', price: 280, width: 1, height: 2, rarity: 'rare', description: 'Miniature Ionic or Doric column; a piece of the Acropolis.' },
  { id: 'gr_olive_tree', name: 'Olive Tree', icon: 'nature', category: 'decor', countryOrigin: 'gr', price: 120, width: 1, height: 1, rarity: 'uncommon', description: 'Potted olive tree; Mediterranean sunshine in a pot.' },

  // Universal/Premium — high-detail, Sims-style quality
  { id: 'uni_bookshelf', name: 'World Bookshelf', icon: 'book', category: 'furniture', price: 200, width: 2, height: 2, rarity: 'uncommon', description: 'Tall wooden shelves with adjustable heights; holds books, plants, and keepsakes.', interactionType: 'bookshelf', interactionLabel: 'Study together', interactionAura: 20 },
  { id: 'uni_globe', name: 'Spinning Globe', icon: 'geography', category: 'decor', price: 150, width: 1, height: 1, rarity: 'uncommon', description: 'Vintage-style globe on a brass stand; spin and explore every continent.' },
  { id: 'uni_telescope', name: 'Telescope', icon: 'compass', category: 'decor', price: 250, width: 1, height: 1, rarity: 'rare', description: 'Brass telescope on a tripod; stargazing and adventure in one piece.' },
  { id: 'uni_clock', name: 'World Clock', icon: 'clock', category: 'wall', price: 180, width: 1, height: 1, rarity: 'uncommon', description: 'Multi-timezone clock with city names; track the world from your wall.' },
  { id: 'uni_plant', name: 'Potted Plant', icon: 'nature', category: 'decor', price: 40, width: 1, height: 1, rarity: 'common', description: 'Lush green foliage in a ceramic pot; a breath of nature indoors.' },
  { id: 'uni_rug', name: 'Plush Rug', icon: 'home', category: 'floor', price: 80, width: 2, height: 2, rarity: 'common', description: 'Soft, thick pile in a neutral tone; cozy underfoot and ties the room together.' },
  { id: 'uni_trophy', name: 'Trophy Cabinet', icon: 'trophy', category: 'furniture', price: 500, width: 2, height: 2, rarity: 'epic', description: 'Glass-front display case for medals and trophies; show off every win.' },
  { id: 'uni_map_poster', name: 'World Map Poster', icon: 'compass', category: 'wall', price: 50, width: 2, height: 1, rarity: 'common', description: 'Vintage-style map with pins; plan your next trip or mark where you’ve been.' },
  { id: 'uni_disco_ball', name: 'Disco Ball', icon: 'sparkles', category: 'wall', price: 180, width: 1, height: 1, rarity: 'uncommon', description: 'Mirrored ball that spins and catches the light; instant party mood.' },
  { id: 'uni_aquarium', name: 'Aquarium', icon: 'nature', category: 'furniture', price: 300, width: 2, height: 1, rarity: 'rare', description: 'Glass tank with plants and tiny fish; calming and colourful.' },
  { id: 'uni_piano', name: 'Grand Piano', icon: 'star', category: 'furniture', price: 500, width: 2, height: 2, rarity: 'epic', description: 'Polished black grand with raised lid; the centrepiece of any room.' },
  { id: 'uni_beanbag', name: 'Beanbag Chair', icon: 'home', category: 'furniture', price: 70, width: 1, height: 1, rarity: 'common', description: 'Oversized beanbag in soft fabric; sink in and relax.' },
  { id: 'uni_neon_sign', name: 'Neon Sign', icon: 'sparkles', category: 'wall', price: 150, width: 1, height: 1, rarity: 'uncommon', description: 'Custom-style neon tube; pick your message and glow.' },
  { id: 'uni_star_projector', name: 'Star Projector', icon: 'star', category: 'decor', price: 200, width: 1, height: 1, rarity: 'rare', description: 'Projects a galaxy on the ceiling; drift off under the stars.' },
  { id: 'uni_game_console', name: 'Game Console', icon: 'sparkles', category: 'furniture', price: 250, width: 1, height: 1, rarity: 'uncommon', description: 'Retro console with cartridges; gaming nostalgia in one unit.' },
  { id: 'uni_lava_lamp', name: 'Lava Lamp', icon: 'flame', category: 'decor', price: 60, width: 1, height: 1, rarity: 'common', description: 'Classic wax-and-liquid lamp; mesmerising blobs of colour.' },
  { id: 'uni_vinyl_player', name: 'Vinyl Record Player', icon: 'culture', category: 'furniture', price: 180, width: 1, height: 1, rarity: 'uncommon', description: 'Turntable with built-in speakers; warm sound and vintage style.' },
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

export const FURNITURE_SETS: FurnitureSet[] = [
  {
    id: 'set_japanese_tea',
    name: 'Japanese Tea Room',
    countryOrigin: 'jp',
    items: ['jp_tatami', 'jp_kotatsu', 'jp_screen', 'jp_zabuton', 'jp_bonsai'],
    bundlePrice: 300,
    description: 'Everything for a serene Japanese tea ceremony space',
  },
  {
    id: 'set_french_salon',
    name: 'French Salon',
    countryOrigin: 'fr',
    items: ['fr_chandelier', 'fr_table', 'fr_painting', 'fr_armoire'],
    bundlePrice: 700,
    description: 'Elegant Parisian salon with crystal and marble',
  },
  {
    id: 'set_british_study',
    name: 'British Study',
    countryOrigin: 'gb',
    items: ['gb_wingback', 'gb_tea_trolley', 'gb_book_nook', 'gb_tartan_throw', 'gb_bigben_clock'],
    bundlePrice: 650,
    description: 'The cosiest reading corner this side of London',
  },
  {
    id: 'set_mexican_fiesta',
    name: 'Mexican Fiesta',
    countryOrigin: 'mx',
    items: ['mx_cactus', 'mx_hammock', 'mx_rug', 'mx_pottery', 'mx_otomi'],
    bundlePrice: 400,
    description: 'Bright colors and bold patterns from Mexico',
  },
  {
    id: 'set_starter_home',
    name: 'Starter Home',
    items: ['uni_dining_table', 'uni_bed', 'uni_study_desk', 'uni_toy_chest', 'uni_plant'],
    bundlePrice: 320,
    description: 'All the essentials for your first Visby home',
  },
];
