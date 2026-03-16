/**
 * Default "Home Base" room shown on the Home tab when the user has no house yet,
 * or as a fallback. Club Penguin / Sims style: your Visby lives here with their mood.
 */

import type { HouseRoom } from './countryRooms';

export const DEFAULT_HOME_ROOM: HouseRoom = {
  id: 'home_base',
  name: 'Home Base',
  icon: 'home',
  wallColor: '#FFF8F2',
  floorColor: '#E8DCC8',
  objects: [
    { id: 'home_deco1', icon: 'culture', label: 'Plant', x: 18, y: 35 },
    { id: 'home_deco2', icon: 'book', label: 'Books', x: 78, y: 30 },
    { id: 'home_deco3', icon: 'star', label: 'Lamp', x: 50, y: 55 },
  ],
};

/** Window sky gradient for home (no country) — cozy default */
export const HOME_ATMOSPHERE = {
  windowSky: ['#F5F0FF', '#E8E0F5', '#FFF8F0'] as const,
  wallGradientBottom: 'rgba(184, 165, 224, 0.08)',
};
