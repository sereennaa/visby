/**
 * Simplified SVG path data for country outlines (viewBox 0 0 100 100).
 * Used for country map and "where is this?" mini maps. Pins use the same 0-100 coordinate space.
 */

export const COUNTRY_OUTLINE_PATHS: Record<string, string> = {
  // Japan – elongated (main islands)
  jp: 'M 68 8 L 88 18 L 85 42 L 90 65 L 82 88 L 72 92 L 62 78 L 65 52 L 58 28 L 62 12 Z',
  // France – hexagon
  fr: 'M 48 5 L 92 28 L 88 62 L 52 95 L 8 68 L 12 32 Z',
  // Mexico – wedge
  mx: 'M 18 15 L 88 22 L 92 55 L 78 88 L 35 92 L 8 62 L 12 38 Z',
  // Italy – boot
  it: 'M 52 4 L 58 18 L 55 45 L 60 75 L 56 96 L 48 92 L 44 65 L 46 42 L 42 22 Z',
  // United Kingdom
  gb: 'M 28 22 L 72 18 L 82 42 L 78 72 L 52 88 L 22 75 L 18 48 Z',
  // Brazil – broad
  br: 'M 78 8 L 95 35 L 88 72 L 72 95 L 35 88 L 12 62 L 8 35 L 22 12 Z',
  // South Korea
  kr: 'M 42 18 L 58 15 L 62 42 L 55 75 L 48 88 L 38 72 L 35 42 Z',
  // Thailand
  th: 'M 22 25 L 78 18 L 88 48 L 82 82 L 48 92 L 18 72 L 12 48 Z',
  // Morocco
  ma: 'M 18 22 L 82 15 L 88 55 L 72 88 L 32 92 L 8 62 L 12 38 Z',
  // Peru – vertical
  pe: 'M 25 5 L 75 8 L 72 45 L 78 82 L 55 95 L 28 88 L 22 52 L 18 28 Z',
  // Kenya
  ke: 'M 45 25 L 82 18 L 88 55 L 78 88 L 52 92 L 35 72 L 38 42 Z',
  // Norway – elongated
  no: 'M 25 2 L 75 5 L 72 35 L 78 72 L 65 95 L 35 92 L 28 62 L 22 35 Z',
  // Turkey
  tr: 'M 35 15 L 88 22 L 85 55 L 72 82 L 42 88 L 18 62 L 22 38 Z',
  // Greece
  gr: 'M 35 35 L 72 28 L 78 55 L 68 82 L 42 88 L 28 62 Z',
};

export function getCountryOutlinePath(countryId: string): string | null {
  return COUNTRY_OUTLINE_PATHS[countryId] ?? null;
}
