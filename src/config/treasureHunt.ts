/**
 * Treasure Hunt config: build room hunts from country rooms and location hunts from CountryLocation.
 */

import { COUNTRY_HOUSES, HouseRoom, RoomObject } from './countryRooms';
import { getCountryLocations, CountryLocation } from './learningContent';

export interface RoomHuntItem {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  /** Clue shown to the player (from learnContent or "Find the [label]") */
  clue: string;
  learnTitle?: string;
  learnContent?: string;
  auraReward?: number;
  /** Optional image URL for reveal (real photo of the object) */
  imageUrl?: string;
}

/** Derive a short clue from learnContent (first sentence) or fallback to "Find the [label]" */
function getClueForObject(obj: RoomObject): string {
  if (obj.learnContent && obj.learnContent.trim().length > 0) {
    const firstSentence = obj.learnContent.split(/[.!?]/)[0]?.trim();
    if (firstSentence) return firstSentence + (obj.learnContent.includes('.') ? '.' : '');
  }
  return `Find the ${obj.label}.`;
}

/** All hunt items for a room (for display and selection) */
export function getRoomHuntItems(room: HouseRoom): RoomHuntItem[] {
  return room.objects.map((obj) => ({
    id: obj.id,
    label: obj.label,
    icon: obj.icon,
    x: obj.x,
    y: obj.y,
    clue: getClueForObject(obj),
    learnTitle: obj.learnTitle,
    learnContent: obj.learnContent,
    auraReward: obj.auraReward,
    imageUrl: obj.imageUrl,
  }));
}

export function getRoomsForCountry(countryId: string): HouseRoom[] {
  const data = COUNTRY_HOUSES[countryId];
  return data?.rooms ?? [];
}

/** Pick up to `count` items from the room for this play, preferring items with learnContent. Shuffled. */
export function getRoomHuntForPlay(
  countryId: string,
  roomId: string,
  count: number = 5
): { room: HouseRoom; items: RoomHuntItem[] } | null {
  const rooms = getRoomsForCountry(countryId);
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];
  if (!room) return null;

  const allItems = getRoomHuntItems(room);
  const withContent = allItems.filter((i) => i.learnContent);
  const withoutContent = allItems.filter((i) => !i.learnContent);
  const pooled = [...withContent, ...withoutContent];
  shuffleArray(pooled);
  const take = Math.min(count, pooled.length);
  const selected = pooled.slice(0, take);
  return { room, items: selected };
}

/** Get a random room for the country, optionally preferring less-played (caller can pass completedRoomIds). */
export function getRandomRoomForCountry(
  countryId: string,
  completedRoomIds: string[] = []
): HouseRoom | null {
  const rooms = getRoomsForCountry(countryId);
  if (rooms.length === 0) return null;
  const unplayed = rooms.filter((r) => !completedRoomIds.includes(r.id));
  const pool = unplayed.length > 0 ? unplayed : rooms;
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ─── Location Hunt (photo-based) ───

export interface LocationHuntRound {
  target: CountryLocation;
  options: CountryLocation[];
  /** Clue: first sentence of description or short phrase */
  clue: string;
}

/** One round of Location Hunt: one correct location + 3 decoys. Clue from target's description. */
export function getLocationHuntRound(countryId: string): LocationHuntRound | null {
  const locations = getCountryLocations(countryId);
  if (locations.length < 4) return null;

  const shuffled = [...locations];
  shuffleArray(shuffled);
  const target = shuffled[0];
  const decoys = shuffled.slice(1, 4);

  const clue = target.description.split(/[.!?]/)[0]?.trim()
    ? target.description.split(/[.!?]/)[0].trim() + '.'
    : `A place in this country: ${target.name}`;

  const options = [target, ...decoys];
  shuffleArray(options);

  return { target, options, clue };
}

/** Whether a country has enough locations for Location Hunt (need 4+). */
export function countryHasLocationHunt(countryId: string): boolean {
  return getCountryLocations(countryId).length >= 4;
}
