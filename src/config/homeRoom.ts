/**
 * Default "Home Base" room shown on the Home tab when the user has no house yet,
 * or as a fallback. Club Penguin / Sims style: your Visby lives here with their mood.
 */

import type { HouseRoom } from './countryRooms';

/** Cozy default room: warm wall, wood-tone floor, lived-in decor (Club Penguin / Sims vibe). */
export const DEFAULT_HOME_ROOM: HouseRoom = {
  id: 'home_base',
  name: 'Home Base',
  icon: 'home',
  wallColor: '#F5EDE4',
  floorColor: '#C4A77D',
  objects: [
    { id: 'home_deco1', icon: 'culture', label: 'Plant', x: 12, y: 32 },
    { id: 'home_deco2', icon: 'book', label: 'Books', x: 82, y: 28 },
    { id: 'home_deco3', icon: 'star', label: 'Lamp', x: 50, y: 52 },
    { id: 'home_deco4', icon: 'edit', label: 'Picture', x: 50, y: 12 },
  ],
};

/** Window sky gradient for home (no country) — cozy default */
export const HOME_ATMOSPHERE = {
  windowSky: ['#F5F0FF', '#E8E0F5', '#FFF8F0'] as const,
  wallGradientBottom: 'rgba(184, 165, 224, 0.08)',
};
