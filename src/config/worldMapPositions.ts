/**
 * Approximate position of each country on a flat world map (0–100 percent).
 * Used for the illustrated world map: x = longitude (-180..180 → 0..100), y = latitude (90..-90 → 0..100).
 */

export interface WorldMapPosition {
  xPercent: number;
  yPercent: number;
}

export const WORLD_MAP_POSITIONS: Record<string, WorldMapPosition> = {
  jp: { xPercent: 89, yPercent: 30 },
  fr: { xPercent: 51, yPercent: 23 },
  mx: { xPercent: 23, yPercent: 39 },
  it: { xPercent: 54, yPercent: 27 },
  gb: { xPercent: 49, yPercent: 20 },
  br: { xPercent: 37, yPercent: 59 },
  kr: { xPercent: 85, yPercent: 29 },
  th: { xPercent: 78, yPercent: 42 },
  ma: { xPercent: 48, yPercent: 31 },
  pe: { xPercent: 29, yPercent: 57 },
  ke: { xPercent: 60, yPercent: 51 },
  no: { xPercent: 53, yPercent: 17 },
  tr: { xPercent: 59, yPercent: 28 },
  gr: { xPercent: 57, yPercent: 29 },
};

export function getWorldMapPosition(countryId: string): WorldMapPosition | null {
  return WORLD_MAP_POSITIONS[countryId] ?? null;
}

/** Short label for the world map so names fit (e.g. "UK" not "United Kingdom"). */
export const WORLD_MAP_LABELS: Record<string, string> = {
  gb: 'UK',
  br: 'Brazil',
  kr: 'S. Korea',
  ma: 'Morocco',
  pe: 'Peru',
  ke: 'Kenya',
  no: 'Norway',
  tr: 'Turkey',
  gr: 'Greece',
  jp: 'Japan',
  fr: 'France',
  mx: 'Mexico',
  it: 'Italy',
  th: 'Thailand',
};

export function getWorldMapLabel(countryId: string, fullName: string): string {
  return WORLD_MAP_LABELS[countryId] ?? fullName;
}
