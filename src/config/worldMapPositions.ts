/**
 * Country pin positions on the world map (0-100 percent of the canvas).
 * The background SVG uses a 1000x500 viewBox with equirectangular-ish projection.
 * x: 0 = far left (Pacific), 100 = far right (Pacific)
 * y: 0 = top (north pole), 100 = bottom (south pole)
 */

export interface WorldMapPosition {
  xPercent: number;
  yPercent: number;
}

export const WORLD_MAP_POSITIONS: Record<string, WorldMapPosition> = {
  // East Asia
  jp: { xPercent: 85, yPercent: 22 },
  kr: { xPercent: 83, yPercent: 22 },
  cn: { xPercent: 76, yPercent: 26 },
  tw: { xPercent: 82, yPercent: 36 },

  // Southeast Asia
  th: { xPercent: 74, yPercent: 44 },
  vn: { xPercent: 76, yPercent: 42 },
  id: { xPercent: 80, yPercent: 56 },

  // South Asia / Middle East
  in: { xPercent: 69, yPercent: 42 },
  lb: { xPercent: 60, yPercent: 34 },
  ae: { xPercent: 63, yPercent: 40 },
  tr: { xPercent: 57, yPercent: 28 },

  // Northern Europe
  is: { xPercent: 44, yPercent: 12 },
  no: { xPercent: 51, yPercent: 10 },
  se: { xPercent: 53, yPercent: 12 },
  fi: { xPercent: 55, yPercent: 10 },

  // Western Europe
  gb: { xPercent: 47, yPercent: 19 },
  nl: { xPercent: 50, yPercent: 18 },
  be: { xPercent: 50, yPercent: 20 },
  fr: { xPercent: 49, yPercent: 24 },
  de: { xPercent: 53, yPercent: 20 },
  ch: { xPercent: 52, yPercent: 24 },
  mc: { xPercent: 51, yPercent: 26 },
  es: { xPercent: 46, yPercent: 28 },
  pt: { xPercent: 44, yPercent: 28 },
  it: { xPercent: 53, yPercent: 28 },
  va: { xPercent: 54, yPercent: 30 },

  // Central / Eastern Europe
  pl: { xPercent: 55, yPercent: 18 },
  cz: { xPercent: 54, yPercent: 20 },
  sk: { xPercent: 56, yPercent: 21 },
  at: { xPercent: 54, yPercent: 22 },
  hu: { xPercent: 56, yPercent: 23 },
  si: { xPercent: 54, yPercent: 25 },
  hr: { xPercent: 55, yPercent: 26 },
  ba: { xPercent: 56, yPercent: 27 },
  me: { xPercent: 56, yPercent: 29 },
  al: { xPercent: 55, yPercent: 30 },
  gr: { xPercent: 56, yPercent: 31 },
  ro: { xPercent: 57, yPercent: 24 },
  bg: { xPercent: 57, yPercent: 27 },

  // North Africa
  ma: { xPercent: 47, yPercent: 34 },
  tn: { xPercent: 51, yPercent: 34 },
  eg: { xPercent: 57, yPercent: 38 },

  // Sub-Saharan Africa
  ke: { xPercent: 57, yPercent: 52 },
  tz: { xPercent: 57, yPercent: 56 },
  za: { xPercent: 53, yPercent: 68 },
  mg: { xPercent: 60, yPercent: 62 },

  // North America
  ca: { xPercent: 15, yPercent: 20 },
  us: { xPercent: 16, yPercent: 32 },
  mx: { xPercent: 13, yPercent: 44 },

  // Caribbean
  cu: { xPercent: 16, yPercent: 48 },
  jm: { xPercent: 17, yPercent: 50 },
  do: { xPercent: 19, yPercent: 48 },
  bb: { xPercent: 20, yPercent: 50 },
  lc: { xPercent: 21, yPercent: 50 },
  cw: { xPercent: 19, yPercent: 52 },

  // South America
  co: { xPercent: 17, yPercent: 56 },
  ec: { xPercent: 15, yPercent: 58 },
  pe: { xPercent: 16, yPercent: 64 },
  br: { xPercent: 21, yPercent: 62 },
  cl: { xPercent: 15, yPercent: 76 },
  uy: { xPercent: 19, yPercent: 76 },
  ar: { xPercent: 17, yPercent: 80 },

  // Oceania
  au: { xPercent: 86, yPercent: 70 },
  nz: { xPercent: 93, yPercent: 76 },
};

export function getWorldMapPosition(countryId: string): WorldMapPosition | null {
  return WORLD_MAP_POSITIONS[countryId] ?? null;
}

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
