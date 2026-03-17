#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const WATCH_PATHS = [
  'src/types/index.ts',
  'src/store/useStore.ts',
  'src/navigation/AppNavigator.tsx',
  'src/screens/world/CountryRoomScreen.tsx',
  'src/screens/world/CountryMapScreen.tsx',
  'src/screens/games/WordMatchScreen.tsx',
  'src/screens/games/MemoryCardsScreen.tsx',
  'src/screens/games/CookingGameScreen.tsx',
  'src/screens/games/SortCategorizeScreen.tsx',
  'src/screens/games/FlagMatchScreen.tsx',
  'src/screens/games/StoryBuilderScreen.tsx',
  'src/screens/games/CultureDressUpScreen.tsx',
  'src/components/maps/PinPreviewTooltip.tsx',
  'src/components/room/RoomObjectInteraction.tsx',
  'src/config/countryKnowledge.ts',
  'src/config/countryGameContent.ts',
  'src/config/constants.ts',
  'src/config/learningContent.ts',
];

const BASELINE_PATH = resolve(process.cwd(), 'tools/country-quality-baseline.txt');

function normalizeLine(line) {
  return line.replace(/\\/g, '/').trim();
}

function normalizeTypeErrorKey(line) {
  const normalized = normalizeLine(line);
  return normalized
    .replace(/\(\d+,\d+\):/g, ':')
    .replace(/\.\.\. \d+ more \.\.\./g, '... N more ...');
}

function isWatchedTypeError(line) {
  const normalized = normalizeLine(line);
  return WATCH_PATHS.some((path) => normalized.startsWith(path + '(') || normalized.includes('/' + path + '('));
}

console.log('Running full typecheck and filtering country-experience surfaces...');

const typecheck = spawnSync('npx', ['tsc', '--noEmit', '--pretty', 'false'], {
  encoding: 'utf8',
  stdio: 'pipe',
});

const combined = `${typecheck.stdout ?? ''}\n${typecheck.stderr ?? ''}`
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const watchedErrors = combined.filter(isWatchedTypeError);
let baselineSet = new Set();

try {
  const baselineLines = readFileSync(BASELINE_PATH, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  baselineSet = new Set(baselineLines.map(normalizeTypeErrorKey));
} catch {
  // If baseline file is missing we fail closed.
}

const newWatchedErrors = watchedErrors.filter((line) => !baselineSet.has(normalizeTypeErrorKey(line)));

if (baselineSet.size === 0) {
  console.error('\nNo baseline found at tools/country-quality-baseline.txt. Cannot run guarded check.');
  process.exit(1);
}

if (newWatchedErrors.length > 0) {
  console.error('\nNew country-surface type errors detected:\n');
  for (const line of newWatchedErrors) console.error(line);
  console.error('\nFailing quality:country check.');
  process.exit(1);
}

if (typecheck.status !== 0) {
  console.warn('\nTypecheck has unrelated repo-wide errors outside watched country surfaces.');
  console.warn('Proceeding because watched surfaces are clean.');
} else {
  console.log('\nTypecheck clean.');
}

console.log('\ncountry-quality-check passed.');
if (watchedErrors.length > 0) {
  console.log(`Known baseline country-surface errors: ${watchedErrors.length}.`);
}
