/**
 * Approximate position of each country on a flat world map (0–100 percent).
 * Used for the illustrated world map: x = longitude (-180..180 → 0..100), y = latitude (90..-90 → 0..100).
 */

export interface WorldMapPosition {
  xPercent: number;
  yPercent: number;
}

export const WORLD_MAP_POSITIONS: Record<string, WorldMapPosition> = {
  jp: { xPercent: 88, yPercent: 30 },
  fr: { xPercent: 51, yPercent: 24 },
  mx: { xPercent: 22, yPercent: 37 },
  it: { xPercent: 53, yPercent: 26 },
  gb: { xPercent: 49, yPercent: 20 },
  br: { xPercent: 35, yPercent: 56 },
  kr: { xPercent: 86, yPercent: 30 },
  th: { xPercent: 78, yPercent: 42 },
  ma: { xPercent: 48, yPercent: 32 },
  pe: { xPercent: 29, yPercent: 56 },
  ke: { xPercent: 61, yPercent: 50 },
  no: { xPercent: 53, yPercent: 16 },
  tr: { xPercent: 60, yPercent: 28 },
  gr: { xPercent: 56, yPercent: 28 },
};

export function getWorldMapPosition(countryId: string): WorldMapPosition | null {
  return WORLD_MAP_POSITIONS[countryId] ?? null;
}
