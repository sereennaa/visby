/**
 * Simplified but recognizable SVG path data for country outlines (viewBox 0 0 100 100).
 * Used for country map and "where is this?" mini maps. Pins use the same 0-100 coordinate space.
 */

export const COUNTRY_OUTLINE_PATHS: Record<string, string> = {
  // Japan – four main islands: Hokkaido (top), Honshu (large central), Shikoku (small), Kyushu (bottom-left)
  jp: [
    // Hokkaido
    'M 72 4 L 78 3 L 84 6 L 88 12 L 86 18 L 80 20 L 74 17 L 70 12 L 69 7 Z',
    // Honshu
    'M 76 22 L 82 24 L 88 28 L 92 34 L 90 40 L 85 44 L 78 48 L 72 54 L 66 58 L 58 60 L 52 56 L 48 50 L 44 44 L 46 38 L 52 34 L 58 30 L 64 26 L 70 23 Z',
    // Shikoku
    'M 42 56 L 50 54 L 54 58 L 52 64 L 46 66 L 40 62 Z',
    // Kyushu
    'M 34 60 L 40 58 L 44 62 L 46 68 L 44 76 L 38 80 L 32 78 L 28 72 L 30 66 Z',
  ].join(' '),

  // France – recognizable hexagonal shape with Brittany peninsula, Mediterranean coast, Corsica hint
  fr: 'M 38 6 L 52 4 L 68 8 L 82 16 L 90 30 L 92 46 L 88 58 L 80 68 L 72 78 L 60 88 L 48 94 L 36 90 L 24 82 L 14 70 L 8 56 L 6 42 L 10 30 L 16 20 L 24 12 L 32 8 Z M 14 48 L 8 52 L 6 48 L 10 44 Z',

  // Mexico – distinctive shape with Baja California peninsula and Yucatan
  mx: 'M 6 18 L 18 12 L 32 8 L 48 10 L 62 14 L 78 18 L 90 24 L 94 32 L 88 42 L 80 50 L 72 56 L 64 60 L 58 68 L 52 72 L 46 68 L 40 72 L 34 78 L 28 74 L 22 66 L 16 58 L 12 48 L 8 38 L 4 28 Z M 4 22 L 8 16 L 6 26 L 2 32 L 4 42 L 6 52 L 4 46 L 2 38 Z M 76 52 L 84 50 L 90 56 L 86 62 L 78 60 Z',

  // Italy – boot shape with Sicily and Sardinia
  it: 'M 38 6 L 48 4 L 58 8 L 64 16 L 62 24 L 58 32 L 56 40 L 58 48 L 62 56 L 66 64 L 70 72 L 68 78 L 62 82 L 56 78 L 52 72 L 48 66 L 44 60 L 40 54 L 38 46 L 40 38 L 42 30 L 40 22 L 36 14 Z M 48 84 L 56 82 L 62 86 L 60 92 L 52 94 L 46 90 Z M 26 52 L 32 48 L 36 54 L 34 62 L 28 64 L 24 58 Z',

  // United Kingdom – Great Britain outline with Scotland, Wales, England
  gb: 'M 40 4 L 48 2 L 56 6 L 62 14 L 58 22 L 52 18 L 48 22 L 54 28 L 60 34 L 64 42 L 68 50 L 72 58 L 74 66 L 70 74 L 64 80 L 56 84 L 48 82 L 42 76 L 38 68 L 34 60 L 36 52 L 32 46 L 28 40 L 32 34 L 36 28 L 34 22 L 38 14 L 36 8 Z',

  // Brazil – large landmass with distinctive eastern bulge
  br: 'M 58 4 L 72 6 L 82 12 L 90 20 L 94 30 L 92 42 L 88 52 L 82 60 L 76 68 L 68 76 L 58 84 L 48 90 L 38 94 L 28 90 L 20 82 L 14 72 L 10 60 L 8 48 L 12 36 L 18 26 L 26 18 L 36 12 L 46 8 Z',

  // South Korea – peninsula shape
  kr: 'M 38 8 L 50 4 L 62 8 L 68 18 L 66 28 L 62 38 L 58 48 L 56 58 L 58 68 L 54 78 L 48 86 L 40 90 L 34 84 L 32 74 L 34 64 L 38 54 L 40 44 L 38 34 L 34 24 L 36 16 Z',

  // Thailand – distinctive shape with long southern peninsula
  th: 'M 28 8 L 42 4 L 58 6 L 72 12 L 80 22 L 82 34 L 76 44 L 68 50 L 60 54 L 54 60 L 50 68 L 48 76 L 44 84 L 40 90 L 36 94 L 32 88 L 34 80 L 36 72 L 34 64 L 30 56 L 24 48 L 20 38 L 22 26 L 24 16 Z',

  // Morocco – with Atlas Mountains ridge and Strait of Gibraltar
  ma: 'M 12 14 L 28 8 L 46 6 L 62 8 L 78 14 L 88 24 L 92 36 L 88 48 L 82 58 L 74 66 L 64 74 L 52 80 L 40 84 L 28 80 L 18 72 L 10 60 L 6 48 L 8 36 L 10 24 Z',

  // Peru – vertical shape with coastal strip and Andes
  pe: 'M 22 4 L 36 2 L 50 6 L 62 14 L 70 24 L 74 36 L 72 48 L 68 58 L 72 68 L 76 78 L 70 88 L 60 94 L 48 92 L 36 86 L 26 76 L 20 64 L 18 52 L 20 40 L 22 28 L 20 16 Z',

  // Kenya – roughly rectangular with coast indent
  ke: 'M 30 12 L 48 8 L 66 10 L 80 16 L 88 28 L 90 42 L 86 54 L 82 64 L 74 72 L 64 78 L 52 82 L 40 80 L 30 72 L 22 62 L 16 50 L 14 38 L 18 26 L 24 18 Z',

  // Norway – elongated with fjord-like western coast
  no: 'M 44 2 L 56 4 L 66 10 L 72 18 L 70 28 L 66 36 L 68 44 L 72 52 L 68 60 L 64 68 L 60 76 L 56 84 L 50 90 L 42 94 L 36 88 L 32 80 L 28 72 L 26 62 L 30 52 L 28 44 L 24 36 L 28 28 L 32 20 L 36 12 L 40 6 Z',

  // Turkey – distinctive east-west landmass with Bosphorus
  tr: 'M 8 28 L 20 22 L 34 18 L 48 16 L 62 18 L 76 22 L 88 28 L 94 36 L 92 46 L 86 54 L 76 60 L 64 64 L 52 66 L 40 64 L 28 58 L 18 50 L 10 42 L 6 34 Z',

  // Greece – mainland with Peloponnese peninsula and island hints
  gr: 'M 32 18 L 44 14 L 56 16 L 66 22 L 72 32 L 68 42 L 62 48 L 58 42 L 52 46 L 56 54 L 62 60 L 58 68 L 50 74 L 42 70 L 36 62 L 32 54 L 28 46 L 26 38 L 28 28 Z M 68 56 L 74 52 L 78 58 L 76 64 L 70 62 Z M 62 72 L 68 68 L 72 74 L 68 80 L 62 78 Z',
};

export function getCountryOutlinePath(countryId: string): string | null {
  return COUNTRY_OUTLINE_PATHS[countryId] ?? null;
}
