/**
 * Approximate position of each country on a flat world map (0–100 percent).
 * Used for the illustrated world map: x = longitude (-180..180 → 0..100), y = latitude (90..-90 → 0..100).
 */

export interface WorldMapPosition {
  xPercent: number;
  yPercent: number;
}

export const WORLD_MAP_POSITIONS: Record<string, WorldMapPosition> = {
  // East Asia
  jp: { xPercent: 89, yPercent: 30 },
  kr: { xPercent: 85, yPercent: 29 },
  cn: { xPercent: 79, yPercent: 30 },
  tw: { xPercent: 84, yPercent: 36 },

  // Southeast Asia
  th: { xPercent: 78, yPercent: 42 },
  vn: { xPercent: 80, yPercent: 42 },
  id: { xPercent: 82, yPercent: 52 },

  // South Asia / Middle East
  in: { xPercent: 72, yPercent: 38 },
  lb: { xPercent: 61, yPercent: 30 },
  ae: { xPercent: 65, yPercent: 36 },
  tr: { xPercent: 59, yPercent: 28 },

  // Northern Europe
  is: { xPercent: 43, yPercent: 14 },
  no: { xPercent: 53, yPercent: 17 },
  se: { xPercent: 55, yPercent: 15 },
  fi: { xPercent: 57, yPercent: 14 },

  // Western Europe
  gb: { xPercent: 49, yPercent: 20 },
  nl: { xPercent: 50, yPercent: 21 },
  be: { xPercent: 49, yPercent: 22 },
  fr: { xPercent: 51, yPercent: 23 },
  de: { xPercent: 53, yPercent: 21 },
  ch: { xPercent: 52, yPercent: 25 },
  mc: { xPercent: 52, yPercent: 26 },
  es: { xPercent: 48, yPercent: 27 },
  pt: { xPercent: 46, yPercent: 28 },
  it: { xPercent: 54, yPercent: 27 },
  va: { xPercent: 53, yPercent: 28 },

  // Central / Eastern Europe
  pl: { xPercent: 55, yPercent: 20 },
  cz: { xPercent: 54, yPercent: 23 },
  sk: { xPercent: 56, yPercent: 23 },
  at: { xPercent: 53, yPercent: 24 },
  hu: { xPercent: 56, yPercent: 25 },
  si: { xPercent: 54, yPercent: 26 },
  hr: { xPercent: 55, yPercent: 27 },
  ba: { xPercent: 56, yPercent: 27 },
  me: { xPercent: 57, yPercent: 28 },
  al: { xPercent: 56, yPercent: 29 },
  gr: { xPercent: 57, yPercent: 29 },
  ro: { xPercent: 58, yPercent: 25 },
  bg: { xPercent: 58, yPercent: 27 },

  // North Africa
  ma: { xPercent: 48, yPercent: 31 },
  tn: { xPercent: 52, yPercent: 32 },
  eg: { xPercent: 58, yPercent: 35 },

  // Sub-Saharan Africa
  ke: { xPercent: 60, yPercent: 51 },
  tz: { xPercent: 60, yPercent: 54 },
  za: { xPercent: 56, yPercent: 67 },
  mg: { xPercent: 63, yPercent: 60 },

  // North America
  ca: { xPercent: 19, yPercent: 22 },
  us: { xPercent: 17, yPercent: 30 },
  mx: { xPercent: 23, yPercent: 39 },

  // Caribbean
  cu: { xPercent: 25, yPercent: 40 },
  jm: { xPercent: 26, yPercent: 42 },
  do: { xPercent: 28, yPercent: 41 },
  bb: { xPercent: 31, yPercent: 43 },
  lc: { xPercent: 33, yPercent: 43 },
  cw: { xPercent: 30, yPercent: 44 },

  // South America
  co: { xPercent: 27, yPercent: 49 },
  ec: { xPercent: 25, yPercent: 51 },
  pe: { xPercent: 29, yPercent: 57 },
  br: { xPercent: 37, yPercent: 59 },
  cl: { xPercent: 28, yPercent: 69 },
  uy: { xPercent: 33, yPercent: 70 },
  ar: { xPercent: 31, yPercent: 71 },

  // Oceania
  au: { xPercent: 87, yPercent: 64 },
  nz: { xPercent: 94, yPercent: 71 },
};

export function getWorldMapPosition(countryId: string): WorldMapPosition | null {
  return WORLD_MAP_POSITIONS[countryId] ?? null;
}

/** Short label for the world map so names fit (e.g. "UK" not "United Kingdom"). */
export const WORLD_MAP_LABELS: Record<string, string> = {
  gb: 'UK',
  us: 'USA',
  ae: 'UAE',
  kr: 'S. Korea',
  do: 'Dom. Rep.',
  ba: 'Bosnia',
  cz: 'Czechia',
  va: 'Vatican',
  lc: 'St. Lucia',
  za: 'S. Africa',
  nz: 'N. Zealand',
  cw: 'Curaçao',
};

export function getWorldMapLabel(countryId: string, fullName: string): string {
  return WORLD_MAP_LABELS[countryId] ?? fullName;
}
