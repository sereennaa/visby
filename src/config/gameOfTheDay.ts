/**
 * Game of the day: one mini-game gets a small Aura bonus to encourage daily variety.
 * Rotates by date (same game for everyone on the same calendar day).
 */
const GAMES = [
  { key: 'WordMatch', label: 'Word Match', shortLabel: 'Word Match' },
  { key: 'MemoryCards', label: 'Memory Cards', shortLabel: 'Memory' },
  { key: 'CookingGame', label: 'World Cooking', shortLabel: 'Cooking' },
  { key: 'TreasureHunt', label: 'Treasure Hunt', shortLabel: 'Treasure Hunt' },
] as const;

export const GAME_OF_THE_DAY_BONUS_AURA = 15;

/** Date-based seed so the same game is chosen for the same calendar day */
function getDaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
}

export interface GameOfTheDay {
  gameKey: (typeof GAMES)[number]['key'];
  label: string;
  shortLabel: string;
  bonusAura: number;
}

export function getGameOfTheDay(): GameOfTheDay {
  const seed = getDaySeed();
  const index = Math.abs(seed) % GAMES.length;
  const game = GAMES[index];
  return {
    gameKey: game.key,
    label: game.label,
    shortLabel: game.shortLabel,
    bonusAura: GAME_OF_THE_DAY_BONUS_AURA,
  };
}

export function isGameOfTheDay(gameKey: string): boolean {
  return getGameOfTheDay().gameKey === gameKey;
}

/** Returns bonus Aura to add when finishing this mini-game if it's the game of the day */
export function getGameOfTheDayBonusAura(gameKey: string): number {
  return isGameOfTheDay(gameKey) ? GAME_OF_THE_DAY_BONUS_AURA : 0;
}
