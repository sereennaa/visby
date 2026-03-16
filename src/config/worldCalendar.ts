/**
 * Visby World Calendar: seasons rotate to make the world feel alive.
 * Used for seasonal quests, optional theming, and seasonal cosmetics.
 */

export type WorldSeason = 'spring' | 'summer' | 'fall' | 'winter';

const SEASON_LABELS: Record<WorldSeason, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

/** Rotate season every 4 weeks (month-ish). Returns a stable key for the current "season window". */
function getSeasonWindowKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const weekOfMonth = Math.min(3, Math.floor(d.getDate() / 7));
  return `${year}-${String(month + 1).padStart(2, '0')}-${weekOfMonth}`;
}

/**
 * Derive current Visby World Season from the calendar.
 * Default: 3 months per season (Jan–Mar = winter, Apr–Jun = spring, etc. for northern hemisphere).
 */
export function getCurrentSeason(): WorldSeason {
  const month = new Date().getMonth(); // 0–11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/** Stable key for "this season" (e.g. "2025-spring") for persistence. */
export function getCurrentSeasonKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const season = getCurrentSeason();
  return `${year}-${season}`;
}

export function getSeasonLabel(season: WorldSeason): string {
  return SEASON_LABELS[season];
}

export function getCurrentSeasonLabel(): string {
  return SEASON_LABELS[getCurrentSeason()];
}

/** Optional: theme hint for UI (gradients, particles). */
export const SEASON_THEME_HINT: Record<WorldSeason, { label: string; icon: string }> = {
  spring: { label: 'Cherry blossoms', icon: 'flower' },
  summer: { label: 'Sunny adventure', icon: 'sunny' },
  fall: { label: 'Cozy leaves', icon: 'leaf' },
  winter: { label: 'Snowy explore', icon: 'snow' },
};

export { getSeasonWindowKey };
