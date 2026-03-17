# Country Performance Profile

## Scope

- `CountryRoomScreen`
- `CountryMapScreen`
- country-context game screens (`WordMatch`, `MemoryCards`, `CookingGame`)

## Hotspots found

1. **Large modal sections render eagerly**
   - Knowledge/fact overlays mount with full content trees, even when closed.
   - Impact: extra mount work on first room render.

2. **Repeated derived data creation on room/map re-renders**
   - Section arrays and pin hint strings are recreated frequently.
   - Impact: avoidable churn in child props and list items.

3. **Animated overlays with broad update surface**
   - Tooltip and room interaction overlays use rich visuals plus dynamic text.
   - Impact: frame drops on open/close on mid-range devices.

4. **Action card/list rows have unstable inline style objects**
   - Inline dynamic objects in map/room lists can trigger extra child rerenders.
   - Impact: lower interaction snappiness while scrolling/tapping.

## Optimization plan mapped to hotspots

- Lazy-mount heavy modal content only when visible.
- Consolidate knowledge section data into memoized structures.
- Memoize reusable card/list item components.
- Stabilize callbacks and derived props passed to repeated children.
- Slightly shorten animation durations for overlay transitions.

## Validation checklist

- Room screen opens without visible hitch.
- Map list scroll remains smooth while tooltips are used.
- Game launch from room/map feels immediate.
- No new errors in `npm run quality:country`.
