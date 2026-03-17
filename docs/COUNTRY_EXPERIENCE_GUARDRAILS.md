# Country Experience Guardrails

This checklist protects the country exploration surfaces from regressions while the repo still has unrelated global type debt.

## Scope

Core protected surfaces:

- `src/screens/world/CountryRoomScreen.tsx`
- `src/screens/world/CountryMapScreen.tsx`
- `src/screens/games/WordMatchScreen.tsx`
- `src/screens/games/MemoryCardsScreen.tsx`
- `src/screens/games/CookingGameScreen.tsx`
- `src/screens/games/SortCategorizeScreen.tsx`
- `src/screens/games/FlagMatchScreen.tsx`
- `src/screens/games/StoryBuilderScreen.tsx`
- `src/screens/games/CultureDressUpScreen.tsx`
- `src/components/maps/PinPreviewTooltip.tsx`
- `src/components/room/RoomObjectInteraction.tsx`
- `src/config/countryKnowledge.ts`
- `src/config/countryGameContent.ts`
- `src/config/constants.ts`
- `src/config/learningContent.ts`
- `src/types/index.ts`

## Required checks before merge

1. Run guarded typecheck:

```bash
npm run quality:country
```

This command compares current type errors in protected country surfaces against `tools/country-quality-baseline.txt` and fails only on new regressions.

2. Run lints in editor for touched files and resolve all new diagnostics.

3. Run mapping smoke check:

```bash
npm run test:country-data
```

4. Smoke test critical user flows:

- Open world map and enter a country.
- Open room knowledge map and verify category cards render.
- Launch each country game from room and verify country context appears.
- Open country map tooltip and verify knowledge hint text appears.
- Complete one game and verify return flow remains responsive.

## Rules

- Do not read nested route params directly without null-safe handling.
- Prefer memoized selectors/derived arrays in large screens.
- Avoid adding synchronous heavy transforms in render paths.
- Keep country content access behind helper functions where possible.

## Performance sanity

- No expensive object/array recreation inside deeply repeated list items.
- Memoize map pin metadata and modal section data.
- Use lazy modal mounting for heavy overlays.
