import { CosmeticType, CosmeticRarity, CosmeticBundle, VisbyGift } from '../types';
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
  isNew?: boolean;
  isFeatured?: boolean;
  seasonalEvent?: string;
  availableUntil?: string;
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
  { id: 'pharaoh_crown', name: 'Pharaoh Crown', description: 'Ancient golden headdress of the Egyptian pharaohs', type: 'hat', rarity: 'epic', price: 450, country: 'Egypt', icon: 'crown', isNew: true },
  { id: 'geisha_hairpin', name: 'Geisha Hairpin', description: 'Ornate floral hairpin from traditional Japan', type: 'hat', rarity: 'rare', price: 280, country: 'Japan', icon: 'sparkles' },
  { id: 'cowboy_hat', name: 'Cowboy Hat', description: 'Yeehaw! A rugged hat from the American frontier', type: 'hat', rarity: 'uncommon', price: 160, country: 'USA', icon: 'star' },
  { id: 'toque_chef_hat', name: 'Toque Chef Hat', description: 'Tall white hat worn by master French chefs', type: 'hat', rarity: 'uncommon', price: 140, country: 'France', icon: 'food' },
  { id: 'conical_straw_hat', name: 'Conical Straw Hat', description: 'Lightweight woven hat from the rice fields of China', type: 'hat', rarity: 'common', price: 90, country: 'China', icon: 'nature' },
  { id: 'flower_crown', name: 'Flower Crown', description: 'A delicate ring of fresh wildflowers', type: 'hat', rarity: 'common', price: 60, icon: 'nature' },
  { id: 'pirate_hat', name: 'Pirate Hat', description: 'Arr matey! A fearsome tricorn with skull and crossbones', type: 'hat', rarity: 'rare', price: 300, icon: 'star' },
  { id: 'astronaut_helmet', name: 'Astronaut Helmet', description: 'One small step — a real space-grade helmet', type: 'hat', rarity: 'legendary', price: 1200, icon: 'rocket', membersOnly: true },
  { id: 'festival_headband', name: 'Festival Headband', description: 'Vibrant feathered headband from Brazilian carnival', type: 'hat', rarity: 'uncommon', price: 130, country: 'Brazil', icon: 'sparkles' },
  { id: 'arctic_hood', name: 'Arctic Hood', description: 'Warm fur-lined hood for polar expeditions', type: 'hat', rarity: 'uncommon', price: 150, icon: 'mountain' },

  // ===================== OUTFITS =====================
  { id: 'default_tunic', name: 'Comfy Tunic', description: 'Your Visby\'s first outfit — soft and cozy, perfect for adventure', type: 'outfit', rarity: 'common', price: 0, icon: 'shirt' },
  { id: 'kimono', name: 'Kimono', description: 'Elegant Japanese traditional robe', type: 'outfit', rarity: 'rare', price: 350, country: 'Japan', icon: 'shirt' },
  { id: 'lederhosen', name: 'Lederhosen', description: 'Bavarian leather shorts from Germany', type: 'outfit', rarity: 'uncommon', price: 200, country: 'Germany', icon: 'shirt' },
  { id: 'sari', name: 'Sari', description: 'Beautiful draped garment from India', type: 'outfit', rarity: 'rare', price: 300, country: 'India', icon: 'shirt' },
  { id: 'kilt', name: 'Scottish Kilt', description: 'Plaid knee-length skirt from Scotland', type: 'outfit', rarity: 'uncommon', price: 220, country: 'United Kingdom', icon: 'shirt' },
  { id: 'hanbok', name: 'Hanbok', description: 'Vibrant Korean traditional dress', type: 'outfit', rarity: 'rare', price: 320, country: 'Korea', icon: 'shirt' },
  { id: 'dashiki', name: 'Dashiki', description: 'Bright patterned tunic from West Africa', type: 'outfit', rarity: 'uncommon', price: 200, country: 'Nigeria', icon: 'shirt' },
  { id: 'poncho', name: 'Poncho', description: 'Warm colorful poncho from Peru', type: 'outfit', rarity: 'uncommon', price: 180, country: 'Mexico', icon: 'shirt' },
  { id: 'toga', name: 'Roman Toga', description: 'When in Rome, wear a toga!', type: 'outfit', rarity: 'rare', price: 280, country: 'Italy', icon: 'landmark' },
  { id: 'pharaoh_robe', name: 'Pharaoh Robe', description: 'Majestic golden robe of ancient Egyptian royalty', type: 'outfit', rarity: 'epic', price: 500, country: 'Egypt', icon: 'crown' },
  { id: 'hawaiian_shirt', name: 'Hawaiian Shirt', description: 'Aloha! A breezy tropical-print shirt', type: 'outfit', rarity: 'common', price: 80, icon: 'nature' },
  { id: 'mariachi_suit', name: 'Mariachi Suit', description: 'Ornate silver-studded suit for Mexican serenades', type: 'outfit', rarity: 'rare', price: 350, country: 'Mexico', icon: 'sparkles' },
  { id: 'ninja_outfit', name: 'Ninja Outfit', description: 'Stealthy black garb of the Japanese shinobi', type: 'outfit', rarity: 'rare', price: 380, country: 'Japan', icon: 'star' },
  { id: 'safari_outfit', name: 'Safari Outfit', description: 'Khaki explorer gear for wildlife adventures', type: 'outfit', rarity: 'uncommon', price: 200, icon: 'compass' },
  { id: 'space_suit', name: 'Space Suit', description: 'Full interstellar EVA suit for cosmic explorers', type: 'outfit', rarity: 'legendary', price: 1500, icon: 'rocket', membersOnly: true },
  { id: 'pirate_coat', name: 'Pirate Coat', description: 'Swashbuckling long coat with golden trim', type: 'outfit', rarity: 'rare', price: 320, icon: 'star' },
  { id: 'knight_armor', name: 'Knight Armor', description: 'Full plate armor of a medieval knight', type: 'outfit', rarity: 'epic', price: 600, icon: 'castle' },
  { id: 'hula_outfit', name: 'Hula Outfit', description: 'Traditional grass skirt and lei from Hawaii', type: 'outfit', rarity: 'uncommon', price: 180, icon: 'nature' },
  { id: 'flamenco_dress', name: 'Flamenco Dress', description: 'Fiery ruffled dress for passionate Spanish dance', type: 'outfit', rarity: 'rare', price: 340, country: 'Spain', icon: 'flame', isNew: true },

  // ===================== ACCESSORIES =====================
  { id: 'sword', name: 'Viking Sword', description: 'A trusty blade for brave explorers', type: 'accessory', rarity: 'common', price: 0, icon: 'viking' },
  { id: 'shield', name: 'Viking Shield', description: 'Round shield with a golden crest', type: 'accessory', rarity: 'uncommon', price: 100, icon: 'viking' },
  { id: 'fan', name: 'Paper Fan', description: 'Elegant folding fan from Japan', type: 'accessory', rarity: 'uncommon', price: 120, country: 'Japan', icon: 'star' },
  { id: 'maracas', name: 'Maracas', description: 'Shake, shake, shake from Mexico!', type: 'accessory', rarity: 'common', price: 80, country: 'Mexico', icon: 'sparkles' },
  { id: 'lantern', name: 'Paper Lantern', description: 'Glowing red lantern from China', type: 'accessory', rarity: 'uncommon', price: 140, country: 'China', icon: 'flame' },
  { id: 'bagpipes', name: 'Bagpipes', description: 'Make some noise, Scottish style!', type: 'accessory', rarity: 'rare', price: 250, country: 'United Kingdom', icon: 'sparkles' },
  { id: 'necklace', name: 'Turquoise Necklace', description: 'Beautiful gemstone necklace', type: 'accessory', rarity: 'uncommon', price: 150, icon: 'sparkles' },
  { id: 'scarf', name: 'Red Scarf', description: 'Cozy scarf for cold adventures', type: 'accessory', rarity: 'common', price: 60, icon: 'shirt' },
  { id: 'magic_wand', name: 'Magic Wand', description: 'A shimmering wand that trails sparkles', type: 'accessory', rarity: 'rare', price: 250, icon: 'sparkles' },
  { id: 'compass_acc', name: 'Compass', description: 'A trusty compass that always points to adventure', type: 'accessory', rarity: 'common', price: 50, icon: 'compass' },
  { id: 'telescope', name: 'Telescope', description: 'Spot distant lands and starry skies', type: 'accessory', rarity: 'uncommon', price: 120, icon: 'star' },
  { id: 'golden_necklace', name: 'Golden Necklace', description: 'Ornate golden necklace from ancient Egypt', type: 'accessory', rarity: 'rare', price: 280, country: 'Egypt', icon: 'sparkles' },
  { id: 'friendship_bracelet', name: 'Friendship Bracelet', description: 'Woven bracelet to share with a travel buddy', type: 'accessory', rarity: 'common', price: 40, icon: 'heart' },
  { id: 'drum', name: 'Drum', description: 'Rhythmic hand drum from Africa', type: 'accessory', rarity: 'uncommon', price: 130, country: 'Africa', icon: 'culture' },
  { id: 'paintbrush', name: 'Paintbrush', description: 'A fine brush for artistic French masterpieces', type: 'accessory', rarity: 'common', price: 70, country: 'France', icon: 'edit' },
  { id: 'camera_acc', name: 'Camera', description: 'Snap memories from every destination', type: 'accessory', rarity: 'uncommon', price: 110, icon: 'camera' },
  { id: 'fishing_rod', name: 'Fishing Rod', description: 'Cast a line and relax by the water', type: 'accessory', rarity: 'common', price: 60, icon: 'nature' },
  { id: 'musical_instrument', name: 'Musical Instrument', description: 'A small ukulele to serenade the world', type: 'accessory', rarity: 'uncommon', price: 140, icon: 'sparkles' },

  // ===================== SHOES =====================
  { id: 'default_boots', name: 'Starter Boots', description: 'Comfy first boots for your Visby\'s travels', type: 'shoes', rarity: 'common', price: 0, icon: 'footsteps' },
  { id: 'wooden_clogs', name: 'Wooden Clogs', description: 'Traditional klompen from the Netherlands', type: 'shoes', rarity: 'uncommon', price: 140, country: 'Netherlands', icon: 'footsteps' },
  { id: 'sandals', name: 'Sandals', description: 'Simple open-toed sandals for warm climates', type: 'shoes', rarity: 'common', price: 40, icon: 'footsteps' },
  { id: 'cowboy_boots', name: 'Cowboy Boots', description: 'Leather boots with spurs from the Wild West', type: 'shoes', rarity: 'uncommon', price: 160, country: 'USA', icon: 'star' },
  { id: 'ballet_slippers', name: 'Ballet Slippers', description: 'Graceful pink slippers from the Paris Opera', type: 'shoes', rarity: 'uncommon', price: 150, country: 'France', icon: 'sparkles' },
  { id: 'ninja_tabi', name: 'Ninja Tabi', description: 'Split-toed stealth boots from feudal Japan', type: 'shoes', rarity: 'uncommon', price: 130, country: 'Japan', icon: 'star' },
  { id: 'hiking_boots', name: 'Hiking Boots', description: 'Sturdy boots built for mountain trails', type: 'shoes', rarity: 'common', price: 80, icon: 'mountain' },
  { id: 'gladiator_sandals', name: 'Gladiator Sandals', description: 'Strappy sandals worn by Roman warriors', type: 'shoes', rarity: 'rare', price: 220, country: 'Italy', icon: 'landmark' },
  { id: 'snow_boots', name: 'Snow Boots', description: 'Insulated boots for snowy adventures', type: 'shoes', rarity: 'common', price: 70, icon: 'mountain' },
  { id: 'moon_boots', name: 'Moon Boots', description: 'Bouncy anti-gravity boots for lunar walks', type: 'shoes', rarity: 'epic', price: 400, icon: 'rocket' },
  { id: 'running_shoes', name: 'Running Shoes', description: 'Lightweight trainers for speedy explorers', type: 'shoes', rarity: 'common', price: 50, icon: 'footsteps' },

  // ===================== BACKPACKS =====================
  { id: 'default_backpack', name: 'Starter Pack', description: 'A trusty first backpack for your Visby', type: 'backpack', rarity: 'common', price: 0, icon: 'backpack' },
  { id: 'explorer_backpack', name: 'Explorer Backpack', description: 'Rugged canvas pack for world travelers', type: 'backpack', rarity: 'common', price: 80, icon: 'backpack' },
  { id: 'samurai_pack', name: 'Samurai Pack', description: 'Warrior-style pack adorned with Japanese crests', type: 'backpack', rarity: 'rare', price: 260, country: 'Japan', icon: 'viking' },
  { id: 'school_backpack', name: 'School Backpack', description: 'Classic backpack for young learners', type: 'backpack', rarity: 'common', price: 50, icon: 'backpack' },
  { id: 'treasure_chest_pack', name: 'Treasure Chest Pack', description: 'A miniature treasure chest strapped to your back', type: 'backpack', rarity: 'epic', price: 450, icon: 'gift' },
  { id: 'camping_backpack', name: 'Camping Backpack', description: 'Large pack with a sleeping bag attached', type: 'backpack', rarity: 'uncommon', price: 120, icon: 'backpack' },
  { id: 'jetpack', name: 'Jetpack', description: 'Blast off with this rocket-powered pack!', type: 'backpack', rarity: 'legendary', price: 1000, icon: 'rocket', membersOnly: true },
  { id: 'messenger_bag', name: 'Messenger Bag', description: 'Chic leather satchel inspired by Parisian couriers', type: 'backpack', rarity: 'uncommon', price: 100, country: 'France', icon: 'backpack' },
  { id: 'drum_backpack', name: 'Drum Backpack', description: 'A drum-shaped pack echoing Brazilian beats', type: 'backpack', rarity: 'uncommon', price: 140, country: 'Brazil', icon: 'culture' },

  // ===================== COMPANIONS =====================
  { id: 'shiba_inu', name: 'Shiba Inu', description: 'A loyal fluffy Shiba from Japan', type: 'companion', rarity: 'rare', price: 350, country: 'Japan', icon: 'heart' },
  { id: 'parrot', name: 'Parrot', description: 'Colorful talking parrot from the Brazilian rainforest', type: 'companion', rarity: 'uncommon', price: 200, country: 'Brazil', icon: 'nature' },
  { id: 'cat', name: 'Cat', description: 'A curious cat that follows you everywhere', type: 'companion', rarity: 'common', price: 80, icon: 'heart' },
  { id: 'penguin', name: 'Penguin', description: 'Adorable tuxedo bird from the frozen south', type: 'companion', rarity: 'rare', price: 300, country: 'Antarctica', icon: 'heart' },
  { id: 'baby_dragon', name: 'Baby Dragon', description: 'A tiny fire-breathing dragon friend', type: 'companion', rarity: 'legendary', price: 2000, icon: 'flame', membersOnly: true },
  { id: 'owl', name: 'Owl', description: 'Wise nocturnal companion for late-night quests', type: 'companion', rarity: 'uncommon', price: 150, icon: 'star' },
  { id: 'panda', name: 'Panda', description: 'Gentle bamboo-munching panda from China', type: 'companion', rarity: 'epic', price: 500, country: 'China', icon: 'nature' },
  { id: 'fox', name: 'Fox', description: 'A clever red fox that scouts the path ahead', type: 'companion', rarity: 'uncommon', price: 180, icon: 'flash' },
  { id: 'butterfly_swarm', name: 'Butterfly Swarm', description: 'A magical cloud of colorful butterflies', type: 'companion', rarity: 'common', price: 60, icon: 'sparkles' },
  { id: 'golden_eagle', name: 'Golden Eagle', description: 'Majestic raptor soaring above your shoulder', type: 'companion', rarity: 'epic', price: 600, icon: 'star', isFeatured: true },

  // ===================== SEASONAL EVENT EXCLUSIVES =====================
  { id: 'sakura_hat', name: 'Sakura Hat', description: 'Delicate cherry-blossom crown for spring', type: 'hat', rarity: 'rare', price: 0, icon: 'nature', seasonalEvent: 'cherry_blossom' },
  { id: 'blossom_outfit', name: 'Blossom Outfit', description: 'Soft pink kimono adorned with petals', type: 'outfit', rarity: 'rare', price: 0, icon: 'shirt', seasonalEvent: 'cherry_blossom' },
  { id: 'sunglasses', name: 'Cool Sunglasses', description: 'Stylish shades for sunny summer days', type: 'accessory', rarity: 'uncommon', price: 0, icon: 'star', seasonalEvent: 'summer_explorer' },
  { id: 'beach_outfit', name: 'Beach Outfit', description: 'Breezy tropical outfit for the coast', type: 'outfit', rarity: 'uncommon', price: 0, icon: 'shirt', seasonalEvent: 'summer_explorer' },
  { id: 'surfboard_accessory', name: 'Surfboard', description: 'A rad surfboard to carry on your back', type: 'accessory', rarity: 'rare', price: 0, icon: 'sparkles', seasonalEvent: 'summer_explorer' },
  { id: 'harvest_hat', name: 'Harvest Hat', description: 'Woven straw hat with autumn leaves', type: 'hat', rarity: 'uncommon', price: 0, icon: 'nature', seasonalEvent: 'harvest_feast' },
  { id: 'autumn_scarf', name: 'Autumn Scarf', description: 'Warm orange scarf with leaf embroidery', type: 'accessory', rarity: 'uncommon', price: 0, icon: 'shirt', seasonalEvent: 'harvest_feast' },
  { id: 'winter_crown', name: 'Winter Crown', description: 'Icy crystal crown that sparkles in the light', type: 'hat', rarity: 'rare', price: 0, icon: 'crown', seasonalEvent: 'winter_lights' },
  { id: 'aurora_outfit', name: 'Aurora Outfit', description: 'Shimmering outfit that glows like the Northern Lights', type: 'outfit', rarity: 'epic', price: 0, icon: 'sparkles', seasonalEvent: 'winter_lights' },
  { id: 'snowflake_accessory', name: 'Snowflake Charm', description: 'A magical snowflake that never melts', type: 'accessory', rarity: 'uncommon', price: 0, icon: 'sparkles', seasonalEvent: 'winter_lights' },
  { id: 'globe_hat', name: 'Globe Hat', description: 'A tiny spinning globe perched on your head', type: 'hat', rarity: 'rare', price: 0, icon: 'globe', seasonalEvent: 'world_culture_week' },
  { id: 'diplomat_outfit', name: 'Diplomat Outfit', description: 'Dapper suit fit for a world ambassador', type: 'outfit', rarity: 'rare', price: 0, icon: 'shirt', seasonalEvent: 'world_culture_week' },
  { id: 'leaf_hat', name: 'Leaf Hat', description: 'Hat woven from fresh green leaves', type: 'hat', rarity: 'uncommon', price: 0, icon: 'nature', seasonalEvent: 'earth_week' },
  { id: 'earth_guardian_outfit', name: 'Earth Guardian Outfit', description: 'Verdant green outfit of a planet protector', type: 'outfit', rarity: 'rare', price: 0, icon: 'nature', seasonalEvent: 'earth_week' },
  { id: 'recycled_accessory', name: 'Recycled Charm', description: 'Colorful bracelet made from upcycled materials', type: 'accessory', rarity: 'uncommon', price: 0, icon: 'heart', seasonalEvent: 'earth_week' },
];

export const COSMETIC_TYPES: { type: CosmeticType; label: string; icon: IconName }[] = [
  { type: 'hat', label: 'Hats', icon: 'crown' },
  { type: 'outfit', label: 'Outfits', icon: 'shirt' },
  { type: 'accessory', label: 'Accessories', icon: 'viking' },
  { type: 'shoes', label: 'Shoes', icon: 'footsteps' },
  { type: 'backpack', label: 'Backpacks', icon: 'backpack' },
  { type: 'companion', label: 'Companions', icon: 'heart' },
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
  'South Korea': 'kr',
  'Korea': 'kr',
  'Thailand': 'th',
  'Morocco': 'ma',
  'Peru': 'pe',
  'Kenya': 'ke',
  'Norway': 'no',
  'Turkey': 'tr',
  'Greece': 'gr',
  'Canada': 'ca',
  'Lebanon': 'lb',
  'Cuba': 'cu',
  'United States': 'us',
  'USA': 'us',
  'United Arab Emirates': 'ae',
  'Dominican Republic': 'do',
  'Jamaica': 'jm',
  'Barbados': 'bb',
  'Netherlands': 'nl',
  'Belgium': 'be',
  'Croatia': 'hr',
  'Hungary': 'hu',
  'China': 'cn',
  'Taiwan': 'tw',
  'Indonesia': 'id',
  'Curaçao': 'cw',
  'Poland': 'pl',
  'Spain': 'es',
  'Bosnia and Herzegovina': 'ba',
  'Monaco': 'mc',
  'Montenegro': 'me',
  'Ecuador': 'ec',
  'Argentina': 'ar',
  'Switzerland': 'ch',
  'Bulgaria': 'bg',
  'Romania': 'ro',
  'Slovenia': 'si',
  'Slovakia': 'sk',
  'Austria': 'at',
  'Czech Republic': 'cz',
  'Germany': 'de',
  'Portugal': 'pt',
  'Tunisia': 'tn',
  'Albania': 'al',
  'Saint Lucia': 'lc',
  'Chile': 'cl',
  'Uruguay': 'uy',
  'Colombia': 'co',
  'Vatican City': 'va',
  'Tanzania': 'tz',
  'Madagascar': 'mg',
  'Finland': 'fi',
  'Sweden': 'se',
  'India': 'in',
  'Vietnam': 'vn',
  'Iceland': 'is',
  'Australia': 'au',
  'New Zealand': 'nz',
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

// ===================== BUNDLES =====================
export const COSMETIC_BUNDLES: CosmeticBundle[] = [
  {
    id: 'bundle_japanese_explorer',
    name: 'Japanese Explorer',
    description: 'Everything you need for a journey through Japan',
    items: ['samurai_helmet', 'kimono', 'ninja_tabi', 'fan'],
    bundlePrice: 650,
    originalPrice: 890,
    icon: 'star',
    gradient: ['#FFE4E1', '#FFD4D4'],
  },
  {
    id: 'bundle_pirate_captain',
    name: 'Pirate Captain',
    description: 'Set sail with full pirate gear',
    items: ['pirate_hat', 'pirate_coat', 'sword', 'telescope'],
    bundlePrice: 600,
    originalPrice: 860,
    icon: 'star',
    gradient: ['#E8F0FE', '#D0E0FF'],
  },
  {
    id: 'bundle_world_traveler',
    name: 'World Traveler',
    description: 'Essential gear for the ultimate explorer',
    items: ['safari_outfit', 'hiking_boots', 'explorer_backpack', 'compass_acc'],
    bundlePrice: 300,
    originalPrice: 410,
    icon: 'compass',
    gradient: ['#E8FFE8', '#D4F5D4'],
  },
  {
    id: 'bundle_royal_collection',
    name: 'Royal Collection',
    description: 'Dress like true royalty from around the world',
    items: ['crown', 'knight_armor', 'golden_necklace'],
    bundlePrice: 1400,
    originalPrice: 1880,
    icon: 'crown',
    gradient: ['#FFF8E0', '#FFE8A0'],
    isLimited: true,
  },
  {
    id: 'bundle_culture_pack',
    name: 'Culture Mix',
    description: 'A taste of traditions from every corner',
    items: ['beret', 'sombrero', 'turban', 'fez'],
    bundlePrice: 400,
    originalPrice: 570,
    icon: 'globe',
    gradient: ['#F0ECFF', '#E0D8F8'],
  },
];

// ===================== FEATURED ITEMS =====================
export function getFeaturedItems(): ShopCosmetic[] {
  return COSMETICS_CATALOG.filter((c) => c.isFeatured || c.isNew || c.rarity === 'legendary').slice(0, 6);
}

export function getEquippedGlowColor(equipped: Record<string, string | undefined>): string | undefined {
  const equippedIds = Object.values(equipped).filter(Boolean) as string[];
  const equippedItems = COSMETICS_CATALOG.filter((c) => equippedIds.includes(c.id));
  const hasLegendary = equippedItems.some((c) => c.rarity === 'legendary');
  if (hasLegendary) return '#FFD700';
  const hasEpic = equippedItems.some((c) => c.rarity === 'epic');
  if (hasEpic) return '#9B59B6';
  return undefined;
}

// ===================== VISBY GIFTS =====================
export const VISBY_GIFTS: VisbyGift[] = [
  { id: 'gift_snack', name: 'Tasty Snack', icon: 'food', price: 30, bondBonus: 3, needsBoost: { hunger: 30 }, visbyReaction: 'Yummy! This is so good!' },
  { id: 'gift_toy', name: 'Fun Toy', icon: 'sparkles', price: 40, bondBonus: 3, needsBoost: { happiness: 25 }, visbyReaction: 'Woohoo! I love playing with this!' },
  { id: 'gift_book', name: 'Story Book', icon: 'book', price: 35, bondBonus: 3, needsBoost: { knowledge: 25 }, visbyReaction: 'Ooh, a new story! Let me read it!' },
  { id: 'gift_blanket', name: 'Cozy Blanket', icon: 'home', price: 25, bondBonus: 2, needsBoost: { energy: 20 }, visbyReaction: 'So warm and snuggly...' },
  { id: 'gift_special', name: 'Special Treat', icon: 'heart', price: 200, bondBonus: 10, needsBoost: { hunger: 15, happiness: 15, energy: 15, knowledge: 15, socialBattery: 15 }, visbyReaction: 'You\'re the best friend ever! I love you!' },
];
