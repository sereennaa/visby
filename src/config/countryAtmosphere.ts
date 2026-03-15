/**
 * VR-style atmosphere per country: sky "window", immersive background, particle mood.
 * Makes walking through each house feel like being inside a magical French castle,
 * Japanese cherry blossom garden, etc. Your Visby is with you in this world.
 */

export type ParticleVariant = 'sparkle' | 'stars' | 'mixed' | 'snow' | 'hearts' | 'petals' | 'dust' | 'aurora';

export interface CountryAtmosphere {
  /** Gradient for the "window" strip at top of room (looking out into the world) */
  windowSky: readonly [string, string, string?];
  /** Full-screen immersive background gradient [top, middle, bottom] */
  immersiveBg: readonly [string, string, string];
  /** Particle variant for this country's mood */
  particleVariant: ParticleVariant;
  /** Optional custom particle colors (overrides variant palette) */
  particleColors?: readonly string[];
  /** Short label for the vibe (e.g. "Cherry blossom garden", "Château window") */
  vibeLabel: string;
}

const JP_SKY = ['#FFE4EC', '#FFC0CB', '#F8B4C4'] as const;
const FR_SKY = ['#C9B8E0', '#B8A5D4', '#E8E0F0'] as const;
const MX_SKY = ['#FFF5E6', '#FFE4B5', '#F0E68C'] as const;
const IT_SKY = ['#E8F4F8', '#D4E8F0', '#F5E6D3'] as const;
const GB_SKY = ['#E8E4DC', '#D4C8B8', '#C4B8A8'] as const;
const BR_SKY = ['#E8F5E9', '#C8E6C9', '#FFF8E1'] as const;
const KR_SKY = ['#F3E5F5', '#E1BEE7', '#FFECB3'] as const;
const TH_SKY = ['#FFF8E1', '#FFECB3', '#F5E6C8'] as const;
const MA_SKY = ['#FFF3E0', '#FFE0B2', '#E8D4B8'] as const;
const PE_SKY = ['#EFEBE9', '#D7CCC8', '#BCAAA4'] as const;
const KE_SKY = ['#FFF8E1', '#FFECB3', '#D4C4A0'] as const;
const NO_SKY = ['#E3F2FD', '#BBDEFB', '#90CAF9'] as const;
const TR_SKY = ['#FBE9E7', '#FFCCBC', '#D7CCC8'] as const;
const GR_SKY = ['#E3F2FD', '#B3E5FC', '#F5F5DC'] as const;

const DEFAULT_BG = ['#F5F0FF', '#FDFBF8', '#F7F4EF'] as const;

export const COUNTRY_ATMOSPHERE: Record<string, CountryAtmosphere> = {
  jp: {
    windowSky: ['#FFE4EC', '#FFB6C1', '#FFF0F5'],
    immersiveBg: ['#FFF5F8', '#FFE4EC', '#F8E8ED'],
    particleVariant: 'petals',
    particleColors: ['#FFB6C1', '#FFC0CB', '#FFE4EC', '#FFFFFF', '#F8B4C4'],
    vibeLabel: 'Cherry blossom garden',
  },
  fr: {
    windowSky: FR_SKY,
    immersiveBg: ['#EDE8F2', '#E0D8EC', '#F5F0FA'],
    particleVariant: 'dust',
    particleColors: ['#E8DCC8', '#D4C4B0', '#FFE4B5', '#C9B8E0', '#F5F0DC'],
    vibeLabel: 'Château window',
  },
  mx: {
    windowSky: MX_SKY,
    immersiveBg: ['#FFF8F0', '#FFEFE0', '#F5E6D8'],
    particleVariant: 'sparkle',
    vibeLabel: 'Sunny courtyard',
  },
  it: {
    windowSky: IT_SKY,
    immersiveBg: ['#F5F8FA', '#EDF2F5', '#F8F4EF'],
    particleVariant: 'mixed',
    vibeLabel: 'Terrazza view',
  },
  gb: {
    windowSky: GB_SKY,
    immersiveBg: ['#F0EDE8', '#E8E4DC', '#E0DCD4'],
    particleVariant: 'dust',
    vibeLabel: 'Castle window',
  },
  br: {
    windowSky: BR_SKY,
    immersiveBg: ['#F1F8E9', '#E8F5E9', '#FFF8E1'],
    particleVariant: 'mixed',
    vibeLabel: 'Rainforest light',
  },
  kr: {
    windowSky: KR_SKY,
    immersiveBg: ['#FAF5FC', '#F3E5F5', '#FFF8E1'],
    particleVariant: 'sparkle',
    vibeLabel: 'Hanok garden',
  },
  th: {
    windowSky: TH_SKY,
    immersiveBg: ['#FFFDE7', '#FFF8E1', '#F5F0E0'],
    particleVariant: 'hearts',
    vibeLabel: 'Temple garden',
  },
  ma: {
    windowSky: MA_SKY,
    immersiveBg: ['#FFF8F0', '#FFEFE0', '#F5E6D8'],
    particleVariant: 'dust',
    vibeLabel: 'Riad courtyard',
  },
  pe: {
    windowSky: PE_SKY,
    immersiveBg: ['#F5F2EF', '#EDE8E4', '#E8E0D8'],
    particleVariant: 'mixed',
    vibeLabel: 'Andean light',
  },
  ke: {
    windowSky: KE_SKY,
    immersiveBg: ['#FFF8E1', '#FFECB3', '#F0E6C8'],
    particleVariant: 'sparkle',
    vibeLabel: 'Safari sky',
  },
  no: {
    windowSky: NO_SKY,
    immersiveBg: ['#E8F4FC', '#E3F2FD', '#F5F5F5'],
    particleVariant: 'aurora',
    particleColors: ['#A5D6A7', '#81C784', '#B3E5FC', '#90CAF9', '#CE93D8'],
    vibeLabel: 'Northern window',
  },
  tr: {
    windowSky: TR_SKY,
    immersiveBg: ['#FDF5F2', '#FBE9E7', '#F5F0ED'],
    particleVariant: 'dust',
    vibeLabel: 'Bazaar light',
  },
  gr: {
    windowSky: GR_SKY,
    immersiveBg: ['#E8F4FC', '#F5F8FA', '#FAFAF5'],
    particleVariant: 'sparkle',
    vibeLabel: 'Aegean window',
  },
};

export function getCountryAtmosphere(countryId: string): CountryAtmosphere {
  return (
    COUNTRY_ATMOSPHERE[countryId] ?? {
      windowSky: ['#F0ECF9', '#E8E4F0', '#FFFFFF'],
      immersiveBg: DEFAULT_BG,
      particleVariant: 'sparkle',
      vibeLabel: 'Exploring',
    }
  );
}
