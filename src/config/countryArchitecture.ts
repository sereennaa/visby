/**
 * Country-specific architectural styles for house exteriors.
 * Each country maps to a visual style that reflects its traditional architecture.
 */

export type RoofStyle = 'pagoda' | 'mansard' | 'flat' | 'flatDome' | 'chalet' | 'thatched' | 'tiered' | 'stave' | 'gabled' | 'colonial' | 'stepped' | 'hipped';
export type WallStyle = 'plain' | 'timber' | 'stone' | 'whitewash' | 'colorStripe' | 'brick' | 'log' | 'adobe' | 'round' | 'ndebele' | 'oaxaca';
export type DoorStyle = 'rounded' | 'arched' | 'sliding' | 'wooden' | 'horseshoe' | 'dutch' | 'ornate';
export type WindowStyle = 'square' | 'shuttered' | 'arched' | 'lattice' | 'tall' | 'round' | 'porthole';
export type DecoElement = 'cherry_blossom' | 'bamboo' | 'lantern' | 'lavender' | 'cactus' | 'olive' | 'palm' | 'tulips' | 'acacia' | 'pine' | 'maple' | 'cedar' | 'sunflower' | 'bougainvillea' | 'vine' | 'hedge' | 'fern' | 'lotus' | 'potted_orange' | 'cypress' | 'rose' | 'protea' | 'papyrus';
export type PathStyle = 'stone' | 'cobble' | 'wood' | 'tile' | 'sand' | 'brick' | 'plain';
export type CountryRegion =
  | 'east_asia'
  | 'europe'
  | 'mediterranean'
  | 'caribbean_latin'
  | 'mena'
  | 'africa'
  | 'north_america'
  | 'oceania'
  | 'special';
export type MaterialProfile = 'timber' | 'stone' | 'limewash' | 'adobe' | 'brick' | 'painted';
export type SignatureLevel = 1 | 2 | 3;

export interface RegionStyleProfile {
  region: CountryRegion;
  wallLuminanceRange: [number, number];
  roofSaturationCap: number;
  accentContrastThreshold: number;
  preferredMaterials: MaterialProfile[];
}

export interface CountryArchStyle {
  roof: RoofStyle;
  roofColor: string;
  roofDark: string;
  wall: WallStyle;
  wallColor: string;
  wallDark: string;
  door: DoorStyle;
  doorColor: string;
  accent: string;
  trim: string;
  decorations: DecoElement[];
  windowStyle: WindowStyle;
  pathStyle: PathStyle;
  signature?: string[];
  signatureLevel?: SignatureLevel;
  materialProfile?: MaterialProfile;
}

export const COUNTRY_ARCHITECTURE: Record<string, CountryArchStyle> = {
  // ─── EAST ASIAN ───
  jp: {
    roof: 'pagoda', roofColor: '#5C4033', roofDark: '#3B2716',
    wall: 'plain', wallColor: '#FAF5E8', wallDark: '#EDE5D0',
    door: 'sliding', doorColor: '#8B6F4E',
    accent: '#C0392B', trim: '#D4B896',
    decorations: ['cherry_blossom', 'lantern'],
    windowStyle: 'lattice', pathStyle: 'stone',
  },
  kr: {
    roof: 'pagoda', roofColor: '#2E7D6F', roofDark: '#1B5E4F',
    wall: 'plain', wallColor: '#F0E6D3', wallDark: '#DDD0B8',
    door: 'wooden', doorColor: '#6D4C3D',
    accent: '#C0392B', trim: '#C4A87C',
    decorations: ['lantern', 'bamboo'],
    windowStyle: 'lattice', pathStyle: 'stone',
  },
  cn: {
    roof: 'pagoda', roofColor: '#B22222', roofDark: '#8B1A1A',
    wall: 'plain', wallColor: '#FAE8D0', wallDark: '#E8D4B8',
    door: 'ornate', doorColor: '#8B0000',
    accent: '#FFD700', trim: '#D4A020',
    decorations: ['lantern', 'bamboo', 'lotus'],
    windowStyle: 'lattice', pathStyle: 'stone',
  },
  tw: {
    roof: 'pagoda', roofColor: '#8B4513', roofDark: '#6B3410',
    wall: 'plain', wallColor: '#FFF0DB', wallDark: '#EDDCC4',
    door: 'ornate', doorColor: '#8B4513',
    accent: '#C0392B', trim: '#C4A87C',
    decorations: ['lantern', 'bamboo'],
    windowStyle: 'lattice', pathStyle: 'stone',
  },
  vn: {
    roof: 'pagoda', roofColor: '#6B4226', roofDark: '#4A2E1A',
    wall: 'plain', wallColor: '#FFF3CD', wallDark: '#EDDFB0',
    door: 'wooden', doorColor: '#5C3A1E',
    accent: '#DAA520', trim: '#C4A87C',
    decorations: ['lotus', 'bamboo'],
    windowStyle: 'lattice', pathStyle: 'stone',
  },

  // ─── FRENCH / BELGIAN ───
  fr: {
    roof: 'mansard', roofColor: '#6B7B8D', roofDark: '#4E5E6F',
    wall: 'plain', wallColor: '#FFFBF5', wallDark: '#F2E9D8',
    door: 'ornate', doorColor: '#1E3A5F',
    accent: '#5D6D7E', trim: '#D6CFC0',
    decorations: ['lavender', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },
  be: {
    roof: 'mansard', roofColor: '#6B5B4F', roofDark: '#4E4238',
    wall: 'brick', wallColor: '#C87D55', wallDark: '#A86840',
    door: 'wooden', doorColor: '#4A3728',
    accent: '#FDDA0D', trim: '#D4B896',
    decorations: ['tulips', 'hedge'],
    windowStyle: 'tall', pathStyle: 'cobble',
  },
  mc: {
    roof: 'mansard', roofColor: '#4A4A5A', roofDark: '#333345',
    wall: 'plain', wallColor: '#FDECD0', wallDark: '#F0D8B0',
    door: 'ornate', doorColor: '#2C3E50',
    accent: '#CE1126', trim: '#E8D4B8',
    decorations: ['bougainvillea', 'palm'],
    windowStyle: 'tall', pathStyle: 'tile',
  },

  // ─── MEDITERRANEAN ───
  gr: {
    roof: 'flatDome', roofColor: '#2E86C1', roofDark: '#1A5276',
    wall: 'whitewash', wallColor: '#FFFFFF', wallDark: '#ECF0F1',
    door: 'arched', doorColor: '#1E6FBA',
    accent: '#2E86C1', trim: '#D5D8DC',
    decorations: ['bougainvillea', 'olive'],
    windowStyle: 'round', pathStyle: 'stone',
  },
  it: {
    roof: 'hipped', roofColor: '#B8633D', roofDark: '#8E4A2A',
    wall: 'stone', wallColor: '#FBE8C0', wallDark: '#E6CFA0',
    door: 'arched', doorColor: '#5D4037',
    accent: '#8B6914', trim: '#D4B896',
    decorations: ['olive', 'vine', 'cypress'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },
  hr: {
    roof: 'hipped', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'stone', wallColor: '#F0EAD6', wallDark: '#DDD4BD',
    door: 'arched', doorColor: '#1565C0',
    accent: '#FF0000', trim: '#C9BFA4',
    decorations: ['cypress', 'olive'],
    windowStyle: 'shuttered', pathStyle: 'stone',
  },
  me: {
    roof: 'hipped', roofColor: '#B5633A', roofDark: '#8D4C2D',
    wall: 'stone', wallColor: '#F2EBD9', wallDark: '#DDD4BD',
    door: 'arched', doorColor: '#5D4037',
    accent: '#C41E3A', trim: '#C9BFA4',
    decorations: ['olive', 'cypress'],
    windowStyle: 'arched', pathStyle: 'stone',
  },
  es: {
    roof: 'hipped', roofColor: '#C0724A', roofDark: '#9A5B38',
    wall: 'plain', wallColor: '#FFF5E1', wallDark: '#F0E0C0',
    door: 'arched', doorColor: '#5D4037',
    accent: '#F1BF00', trim: '#E8D4B8',
    decorations: ['bougainvillea', 'olive'],
    windowStyle: 'shuttered', pathStyle: 'tile',
  },
  pt: {
    roof: 'hipped', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'plain', wallColor: '#E8F0FA', wallDark: '#D0DFF0',
    door: 'arched', doorColor: '#1A5276',
    accent: '#006600', trim: '#B0C8E0',
    decorations: ['vine', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'tile',
  },
  tr: {
    roof: 'hipped', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'plain', wallColor: '#FFF0DB', wallDark: '#F0E0C0',
    door: 'arched', doorColor: '#5D4037',
    accent: '#E30A17', trim: '#D4B896',
    decorations: ['tulips', 'bougainvillea'],
    windowStyle: 'arched', pathStyle: 'tile',
  },

  // ─── TUDOR / NORTH EUROPEAN ───
  gb: {
    roof: 'gabled', roofColor: '#4A4A4A', roofDark: '#333333',
    wall: 'timber', wallColor: '#FAF0E6', wallDark: '#E8DECE',
    door: 'rounded', doorColor: '#2C3E50',
    accent: '#1E6FBA', trim: '#C4A87C',
    decorations: ['hedge', 'rose'],
    windowStyle: 'tall', pathStyle: 'brick',
  },
  nl: {
    roof: 'stepped', roofColor: '#5C4033', roofDark: '#3B2716',
    wall: 'brick', wallColor: '#C06030', wallDark: '#A04820',
    door: 'dutch', doorColor: '#1B5E20',
    accent: '#FF6600', trim: '#D4B896',
    decorations: ['tulips', 'hedge'],
    windowStyle: 'tall', pathStyle: 'brick',
  },
  de: {
    roof: 'gabled', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'timber', wallColor: '#FFF5E1', wallDark: '#F0E0C0',
    door: 'wooden', doorColor: '#4E342E',
    accent: '#000000', trim: '#8D6E63',
    decorations: ['hedge', 'sunflower'],
    windowStyle: 'tall', pathStyle: 'cobble',
  },

  // ─── CARIBBEAN / COLONIAL ───
  cu: {
    roof: 'colonial', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'colorStripe', wallColor: '#FFECB3', wallDark: '#FFD54F',
    door: 'arched', doorColor: '#4E342E',
    accent: '#002A8F', trim: '#E8D4B8',
    decorations: ['palm', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },
  jm: {
    roof: 'colonial', roofColor: '#78909C', roofDark: '#546E7A',
    wall: 'colorStripe', wallColor: '#4CAF50', wallDark: '#388E3C',
    door: 'wooden', doorColor: '#4E342E',
    accent: '#FFD700', trim: '#A5D6A7',
    decorations: ['palm', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'sand',
  },
  bb: {
    roof: 'colonial', roofColor: '#78909C', roofDark: '#546E7A',
    wall: 'plain', wallColor: '#F8BBD0', wallDark: '#F48FB1',
    door: 'wooden', doorColor: '#4E342E',
    accent: '#00267F', trim: '#F0E6D3',
    decorations: ['palm', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'sand',
  },
  'do': {
    roof: 'colonial', roofColor: '#78909C', roofDark: '#546E7A',
    wall: 'plain', wallColor: '#B3E5FC', wallDark: '#81D4FA',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#002D62', trim: '#E0E0E0',
    decorations: ['palm', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'sand',
  },
  cw: {
    roof: 'colonial', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'colorStripe', wallColor: '#64B5F6', wallDark: '#42A5F5',
    door: 'arched', doorColor: '#4E342E',
    accent: '#FFD700', trim: '#E0E0E0',
    decorations: ['palm', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'tile',
  },
  lc: {
    roof: 'colonial', roofColor: '#78909C', roofDark: '#546E7A',
    wall: 'colorStripe', wallColor: '#81C784', wallDark: '#66BB6A',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#6CF0A5', trim: '#C8E6C9',
    decorations: ['palm', 'fern'],
    windowStyle: 'shuttered', pathStyle: 'sand',
  },

  // ─── LATIN AMERICAN ───
  mx: {
    roof: 'flat', roofColor: '#C0724A', roofDark: '#9A5B38',
    wall: 'oaxaca', wallColor: '#F48FB1', wallDark: '#FFB74D',
    door: 'arched', doorColor: '#1565C0',
    accent: '#D32F2F', trim: '#FFCC80',
    decorations: ['cactus'],
    windowStyle: 'arched', pathStyle: 'tile',
  },
  br: {
    roof: 'colonial', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'colorStripe', wallColor: '#FFD54F', wallDark: '#2E7D32',
    door: 'arched', doorColor: '#1B5E20',
    accent: '#2E7D32', trim: '#FFE082',
    decorations: ['palm', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'tile',
  },
  pe: {
    roof: 'flat', roofColor: '#8D6E63', roofDark: '#6D4C41',
    wall: 'adobe', wallColor: '#EFCFA0', wallDark: '#D4AD70',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#D32F2F', trim: '#BCAAA4',
    decorations: ['cactus', 'fern'],
    windowStyle: 'square', pathStyle: 'stone',
  },
  ec: {
    roof: 'colonial', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'plain', wallColor: '#FFF9C4', wallDark: '#FFF59D',
    door: 'arched', doorColor: '#5D4037',
    accent: '#FFD100', trim: '#FFE082',
    decorations: ['fern', 'palm'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },
  ar: {
    roof: 'colonial', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'plain', wallColor: '#E8EAF6', wallDark: '#C5CAE9',
    door: 'arched', doorColor: '#37474F',
    accent: '#75AADB', trim: '#D5D8DC',
    decorations: ['vine', 'hedge'],
    windowStyle: 'shuttered', pathStyle: 'tile',
  },
  cl: {
    roof: 'colonial', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'colorStripe', wallColor: '#EF9A9A', wallDark: '#E57373',
    door: 'wooden', doorColor: '#4E342E',
    accent: '#0039A6', trim: '#E0E0E0',
    decorations: ['vine', 'fern'],
    windowStyle: 'square', pathStyle: 'cobble',
  },
  uy: {
    roof: 'colonial', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'plain', wallColor: '#E3F2FD', wallDark: '#BBDEFB',
    door: 'arched', doorColor: '#37474F',
    accent: '#0038A8', trim: '#D5D8DC',
    decorations: ['palm', 'vine'],
    windowStyle: 'shuttered', pathStyle: 'tile',
  },
  co: {
    roof: 'colonial', roofColor: '#B8602A', roofDark: '#8E4820',
    wall: 'colorStripe', wallColor: '#FFF176', wallDark: '#FFD54F',
    door: 'arched', doorColor: '#1565C0',
    accent: '#FCD116', trim: '#FFE082',
    decorations: ['palm', 'bougainvillea'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },

  // ─── MIDDLE EASTERN / NORTH AFRICAN ───
  ma: {
    roof: 'flat', roofColor: '#C07850', roofDark: '#A06038',
    wall: 'adobe', wallColor: '#F0C8A0', wallDark: '#DDB080',
    door: 'horseshoe', doorColor: '#1565C0',
    accent: '#1E88E5', trim: '#E8D4B8',
    decorations: ['potted_orange', 'bougainvillea'],
    windowStyle: 'arched', pathStyle: 'tile',
  },
  lb: {
    roof: 'hipped', roofColor: '#C0392B', roofDark: '#962D22',
    wall: 'stone', wallColor: '#FFF5E1', wallDark: '#F0E0C0',
    door: 'arched', doorColor: '#5D4037',
    accent: '#C41E3A', trim: '#D4B896',
    decorations: ['cedar', 'olive'],
    windowStyle: 'arched', pathStyle: 'stone',
  },
  ae: {
    roof: 'flat', roofColor: '#D4956A', roofDark: '#B8784E',
    wall: 'adobe', wallColor: '#FFF0DB', wallDark: '#F0DCC0',
    door: 'arched', doorColor: '#5D4037',
    accent: '#00732F', trim: '#E8D4B8',
    decorations: ['palm', 'potted_orange'],
    windowStyle: 'arched', pathStyle: 'sand',
  },
  tn: {
    roof: 'flat', roofColor: '#D4956A', roofDark: '#B8784E',
    wall: 'whitewash', wallColor: '#FFFFFF', wallDark: '#F0F0F0',
    door: 'horseshoe', doorColor: '#1E88E5',
    accent: '#E70013', trim: '#D5D8DC',
    decorations: ['potted_orange', 'bougainvillea'],
    windowStyle: 'arched', pathStyle: 'tile',
  },
  in: {
    roof: 'flatDome', roofColor: '#FF9933', roofDark: '#E07A20',
    wall: 'plain', wallColor: '#FFF8E8', wallDark: '#F5E6C8',
    door: 'ornate', doorColor: '#8B4513',
    accent: '#FF9933', trim: '#E8D4B8',
    decorations: ['lotus', 'bougainvillea'],
    windowStyle: 'arched', pathStyle: 'tile',
  },

  // ─── AFRICAN ───
  ke: {
    roof: 'thatched', roofColor: '#C4A356', roofDark: '#A88B40',
    wall: 'round', wallColor: '#D4956A', wallDark: '#B87A50',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#D32F2F', trim: '#C4A87C',
    decorations: ['acacia', 'fern'],
    windowStyle: 'square', pathStyle: 'sand',
  },
  tz: {
    roof: 'thatched', roofColor: '#C4A356', roofDark: '#A88B40',
    wall: 'round', wallColor: '#D49A6A', wallDark: '#B88050',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#00A3DD', trim: '#C4A87C',
    decorations: ['acacia', 'fern'],
    windowStyle: 'square', pathStyle: 'sand',
  },
  mg: {
    roof: 'thatched', roofColor: '#A08050', roofDark: '#86693C',
    wall: 'plain', wallColor: '#E8D4B8', wallDark: '#D4BEA0',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#FC3F32', trim: '#C4A87C',
    decorations: ['palm', 'fern'],
    windowStyle: 'square', pathStyle: 'sand',
  },
  eg: {
    roof: 'flat', roofColor: '#D4956A', roofDark: '#B8784E',
    wall: 'adobe', wallColor: '#F5DEB3', wallDark: '#DEB887',
    door: 'arched', doorColor: '#8B4513',
    accent: '#C41E3A', trim: '#D2B48C',
    decorations: ['papyrus', 'palm'],
    windowStyle: 'arched', pathStyle: 'sand',
    signature: ['pyramid', 'ankh', 'papyrus_reed'],
  },
  za: {
    roof: 'gabled', roofColor: '#78909C', roofDark: '#546E7A',
    wall: 'ndebele', wallColor: '#FAFAFA', wallDark: '#EEEEEE',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#007749', trim: '#E0E0E0',
    decorations: ['protea', 'acacia'],
    windowStyle: 'square', pathStyle: 'sand',
    signature: ['protea', 'ndebele_band', 'table_mountain'],
  },

  // ─── NORDIC ───
  no: {
    roof: 'stave', roofColor: '#3E2723', roofDark: '#2A1B14',
    wall: 'log', wallColor: '#6D4C3D', wallDark: '#5A3D30',
    door: 'wooden', doorColor: '#3E2723',
    accent: '#1565C0', trim: '#8D6E63',
    decorations: ['pine', 'fern'],
    windowStyle: 'square', pathStyle: 'wood',
  },
  se: {
    roof: 'gabled', roofColor: '#8B0000', roofDark: '#6B0000',
    wall: 'plain', wallColor: '#C62828', wallDark: '#B71C1C',
    door: 'wooden', doorColor: '#FAFAFA',
    accent: '#FFEB3B', trim: '#FAFAFA',
    decorations: ['pine', 'hedge'],
    windowStyle: 'square', pathStyle: 'wood',
  },
  fi: {
    roof: 'gabled', roofColor: '#546E7A', roofDark: '#37474F',
    wall: 'log', wallColor: '#8D6E63', wallDark: '#6D4C41',
    door: 'wooden', doorColor: '#3E2723',
    accent: '#003580', trim: '#BCAAA4',
    decorations: ['pine', 'fern'],
    windowStyle: 'square', pathStyle: 'wood',
  },
  is: {
    roof: 'gabled', roofColor: '#558B2F', roofDark: '#33691E',
    wall: 'stone', wallColor: '#E0E0E0', wallDark: '#BDBDBD',
    door: 'wooden', doorColor: '#3E2723',
    accent: '#02529C', trim: '#9E9E9E',
    decorations: ['fern', 'pine'],
    windowStyle: 'square', pathStyle: 'stone',
  },

  // ─── ALPINE ───
  ch: {
    roof: 'chalet', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'plain', wallColor: '#FAFAFA', wallDark: '#E0E0E0',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#FF0000', trim: '#8D6E63',
    decorations: ['pine', 'hedge'],
    windowStyle: 'shuttered', pathStyle: 'stone',
  },
  at: {
    roof: 'chalet', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'plain', wallColor: '#FFF8E1', wallDark: '#FFF0C0',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#ED2939', trim: '#8D6E63',
    decorations: ['pine', 'hedge'],
    windowStyle: 'shuttered', pathStyle: 'stone',
  },
  sk: {
    roof: 'chalet', roofColor: '#6D4C41', roofDark: '#4E342E',
    wall: 'log', wallColor: '#A1887F', wallDark: '#8D6E63',
    door: 'wooden', doorColor: '#4E342E',
    accent: '#0B4EA2', trim: '#8D6E63',
    decorations: ['pine', 'fern'],
    windowStyle: 'square', pathStyle: 'stone',
  },
  si: {
    roof: 'chalet', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'plain', wallColor: '#F5F5F5', wallDark: '#E0E0E0',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#005DA4', trim: '#8D6E63',
    decorations: ['fern', 'pine'],
    windowStyle: 'square', pathStyle: 'stone',
  },

  // ─── EASTERN EUROPEAN ───
  pl: {
    roof: 'gabled', roofColor: '#C0392B', roofDark: '#962D22',
    wall: 'brick', wallColor: '#D7A868', wallDark: '#C29050',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#DC143C', trim: '#D4B896',
    decorations: ['sunflower', 'hedge'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },
  hu: {
    roof: 'gabled', roofColor: '#5D8040', roofDark: '#456830',
    wall: 'whitewash', wallColor: '#FAFAFA', wallDark: '#EEEEEE',
    door: 'wooden', doorColor: '#1B5E20',
    accent: '#477050', trim: '#BCAAA4',
    decorations: ['sunflower', 'vine'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },
  bg: {
    roof: 'gabled', roofColor: '#6D4C41', roofDark: '#4E342E',
    wall: 'whitewash', wallColor: '#FAFAFA', wallDark: '#EEEEEE',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#00966E', trim: '#A1887F',
    decorations: ['rose', 'vine'],
    windowStyle: 'shuttered', pathStyle: 'cobble',
  },
  ro: {
    roof: 'gabled', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'log', wallColor: '#8D6E63', wallDark: '#6D4C41',
    door: 'wooden', doorColor: '#3E2723',
    accent: '#002B7F', trim: '#A1887F',
    decorations: ['pine', 'fern'],
    windowStyle: 'square', pathStyle: 'wood',
  },
  ba: {
    roof: 'hipped', roofColor: '#8B6F4E', roofDark: '#6B5535',
    wall: 'stone', wallColor: '#F5F0E1', wallDark: '#E8DFC8',
    door: 'arched', doorColor: '#5D4037',
    accent: '#002395', trim: '#C4A87C',
    decorations: ['vine', 'olive'],
    windowStyle: 'arched', pathStyle: 'stone',
  },
  cz: {
    roof: 'gabled', roofColor: '#C0392B', roofDark: '#962D22',
    wall: 'plain', wallColor: '#FFF8E1', wallDark: '#FFF0C0',
    door: 'ornate', doorColor: '#4E342E',
    accent: '#D7141A', trim: '#D4B896',
    decorations: ['hedge', 'rose'],
    windowStyle: 'tall', pathStyle: 'cobble',
  },
  al: {
    roof: 'flat', roofColor: '#9E9E9E', roofDark: '#757575',
    wall: 'stone', wallColor: '#F5F5F5', wallDark: '#E0E0E0',
    door: 'arched', doorColor: '#5D4037',
    accent: '#E41E20', trim: '#BDBDBD',
    decorations: ['olive', 'cypress'],
    windowStyle: 'arched', pathStyle: 'stone',
  },

  // ─── SOUTHEAST ASIAN ───
  th: {
    roof: 'tiered', roofColor: '#B8860B', roofDark: '#966B08',
    wall: 'plain', wallColor: '#FFF8E1', wallDark: '#FFF0C0',
    door: 'ornate', doorColor: '#5D4037',
    accent: '#FFD700', trim: '#D4A020',
    decorations: ['lotus', 'bamboo'],
    windowStyle: 'lattice', pathStyle: 'stone',
  },
  id: {
    roof: 'tiered', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'plain', wallColor: '#EFEBE9', wallDark: '#D7CCC8',
    door: 'wooden', doorColor: '#4E342E',
    accent: '#CE1126', trim: '#A1887F',
    decorations: ['fern', 'palm'],
    windowStyle: 'lattice', pathStyle: 'stone',
  },

  // ─── NORTH AMERICAN ───
  us: {
    roof: 'gabled', roofColor: '#546E7A', roofDark: '#37474F',
    wall: 'plain', wallColor: '#FAFAFA', wallDark: '#EEEEEE',
    door: 'rounded', doorColor: '#C62828',
    accent: '#3C3B6E', trim: '#E0E0E0',
    decorations: ['hedge', 'maple'],
    windowStyle: 'shuttered', pathStyle: 'brick',
  },
  ca: {
    roof: 'gabled', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'log', wallColor: '#8D6E63', wallDark: '#6D4C41',
    door: 'wooden', doorColor: '#3E2723',
    accent: '#E63946', trim: '#BCAAA4',
    decorations: ['maple', 'pine'],
    windowStyle: 'square', pathStyle: 'wood',
  },

  // ─── OCEANIAN ───
  au: {
    roof: 'gabled', roofColor: '#78909C', roofDark: '#546E7A',
    wall: 'plain', wallColor: '#FFF8E1', wallDark: '#FFF0C0',
    door: 'wooden', doorColor: '#5D4037',
    accent: '#00008B', trim: '#E0E0E0',
    decorations: ['fern', 'palm'],
    windowStyle: 'square', pathStyle: 'sand',
  },
  nz: {
    roof: 'gabled', roofColor: '#5D4037', roofDark: '#3E2723',
    wall: 'plain', wallColor: '#EFEBE9', wallDark: '#D7CCC8',
    door: 'wooden', doorColor: '#4E342E',
    accent: '#00247D', trim: '#BCAAA4',
    decorations: ['fern', 'hedge'],
    windowStyle: 'square', pathStyle: 'stone',
  },

  // ─── SPECIAL ───
  va: {
    roof: 'flatDome', roofColor: '#D4AF37', roofDark: '#B8962E',
    wall: 'stone', wallColor: '#FFF8EF', wallDark: '#F0E6D0',
    door: 'ornate', doorColor: '#5D4037',
    accent: '#FFE000', trim: '#D4B896',
    decorations: ['hedge', 'cypress'],
    windowStyle: 'arched', pathStyle: 'tile',
  },
};

export const COUNTRY_REGION: Record<string, CountryRegion> = {
  jp: 'east_asia', kr: 'east_asia', cn: 'east_asia', tw: 'east_asia', vn: 'east_asia', th: 'east_asia', id: 'east_asia',
  fr: 'europe', be: 'europe', mc: 'europe', gb: 'europe', nl: 'europe', de: 'europe', no: 'europe', se: 'europe', fi: 'europe', is: 'europe',
  ch: 'europe', at: 'europe', sk: 'europe', si: 'europe', pl: 'europe', hu: 'europe', bg: 'europe', ro: 'europe', ba: 'europe', cz: 'europe', al: 'europe',
  gr: 'mediterranean', it: 'mediterranean', hr: 'mediterranean', me: 'mediterranean', es: 'mediterranean', pt: 'mediterranean', tr: 'mediterranean',
  cu: 'caribbean_latin', jm: 'caribbean_latin', bb: 'caribbean_latin', do: 'caribbean_latin', cw: 'caribbean_latin', lc: 'caribbean_latin',
  mx: 'caribbean_latin', br: 'caribbean_latin', pe: 'caribbean_latin', ec: 'caribbean_latin', ar: 'caribbean_latin', cl: 'caribbean_latin', uy: 'caribbean_latin', co: 'caribbean_latin',
  ma: 'mena', lb: 'mena', ae: 'mena', tn: 'mena', in: 'mena', eg: 'mena',
  ke: 'africa', tz: 'africa', mg: 'africa', za: 'africa',
  us: 'north_america', ca: 'north_america',
  au: 'oceania', nz: 'oceania',
  va: 'special',
};

export const REGION_STYLE_PROFILES: Record<CountryRegion, RegionStyleProfile> = {
  east_asia: {
    region: 'east_asia',
    wallLuminanceRange: [0.72, 0.92],
    roofSaturationCap: 0.72,
    accentContrastThreshold: 3.1,
    preferredMaterials: ['timber', 'painted', 'limewash'],
  },
  europe: {
    region: 'europe',
    wallLuminanceRange: [0.62, 0.9],
    roofSaturationCap: 0.62,
    accentContrastThreshold: 3.2,
    preferredMaterials: ['stone', 'timber', 'brick', 'limewash'],
  },
  mediterranean: {
    region: 'mediterranean',
    wallLuminanceRange: [0.78, 0.98],
    roofSaturationCap: 0.7,
    accentContrastThreshold: 3.0,
    preferredMaterials: ['limewash', 'stone', 'adobe', 'painted'],
  },
  caribbean_latin: {
    region: 'caribbean_latin',
    wallLuminanceRange: [0.62, 0.95],
    roofSaturationCap: 0.82,
    accentContrastThreshold: 2.8,
    preferredMaterials: ['painted', 'adobe', 'brick', 'timber'],
  },
  mena: {
    region: 'mena',
    wallLuminanceRange: [0.68, 0.94],
    roofSaturationCap: 0.66,
    accentContrastThreshold: 3.3,
    preferredMaterials: ['adobe', 'stone', 'limewash'],
  },
  africa: {
    region: 'africa',
    wallLuminanceRange: [0.56, 0.9],
    roofSaturationCap: 0.72,
    accentContrastThreshold: 2.9,
    preferredMaterials: ['adobe', 'timber', 'painted'],
  },
  north_america: {
    region: 'north_america',
    wallLuminanceRange: [0.64, 0.94],
    roofSaturationCap: 0.6,
    accentContrastThreshold: 3.2,
    preferredMaterials: ['timber', 'brick', 'painted'],
  },
  oceania: {
    region: 'oceania',
    wallLuminanceRange: [0.7, 0.94],
    roofSaturationCap: 0.68,
    accentContrastThreshold: 3.0,
    preferredMaterials: ['timber', 'painted', 'stone'],
  },
  special: {
    region: 'special',
    wallLuminanceRange: [0.7, 0.96],
    roofSaturationCap: 0.74,
    accentContrastThreshold: 3.0,
    preferredMaterials: ['stone', 'painted'],
  },
};

const REGION_SIGNATURE_LEVEL: Record<CountryRegion, SignatureLevel> = {
  east_asia: 3,
  europe: 3,
  mediterranean: 3,
  caribbean_latin: 3,
  mena: 3,
  africa: 3,
  north_america: 3,
  oceania: 3,
  special: 3,
};

export const COUNTRY_SIGNATURE_COMPLEXITY: Record<string, SignatureLevel> = Object.fromEntries(
  Object.keys(COUNTRY_ARCHITECTURE).map((countryId) => {
    const region = COUNTRY_REGION[countryId] ?? 'special';
    return [countryId, REGION_SIGNATURE_LEVEL[region]];
  }),
) as Record<string, SignatureLevel>;

export function getCountryStyleProfile(countryId?: string): RegionStyleProfile {
  const region = (countryId && COUNTRY_REGION[countryId]) || 'special';
  return REGION_STYLE_PROFILES[region];
}
