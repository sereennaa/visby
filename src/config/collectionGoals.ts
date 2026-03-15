/**
 * Collection goals: stamps per country, bites per cuisine (optional).
 * Surfaces "Complete your Japan set" style CTAs in country room and Collections.
 */
import { COUNTRIES } from './constants';
import type { Stamp, Bite } from '../types';

export const STAMP_TARGET_PER_COUNTRY = 5;

/** Country id -> stamp target (default 5) */
export function getStampTarget(countryId: string): number {
  return STAMP_TARGET_PER_COUNTRY;
}

/** Count stamps that belong to a country (match by name or countryCode) */
export function getStampCountForCountry(stamps: Stamp[], countryId: string): number {
  const country = COUNTRIES.find((c) => c.id === countryId);
  if (!country) return 0;
  return stamps.filter(
    (s) => s.country === country.name || s.countryCode === country.countryCode
  ).length;
}

export interface CountryStampProgress {
  countryId: string;
  countryName: string;
  current: number;
  target: number;
  completed: boolean;
  remaining: number;
}

export function getStampProgressByCountry(stamps: Stamp[]): CountryStampProgress[] {
  return COUNTRIES.map((c) => {
    const current = getStampCountForCountry(stamps, c.id);
    const target = getStampTarget(c.id);
    return {
      countryId: c.id,
      countryName: c.name,
      current,
      target,
      completed: current >= target,
      remaining: Math.max(0, target - current),
    };
  }).filter((p) => p.current > 0);
}

/** For a single country: progress for the collection goal */
export function getCountryStampProgress(stamps: Stamp[], countryId: string): CountryStampProgress | null {
  const country = COUNTRIES.find((c) => c.id === countryId);
  if (!country) return null;
  const current = getStampCountForCountry(stamps, countryId);
  const target = getStampTarget(countryId);
  return {
    countryId,
    countryName: country.name,
    current,
    target,
    completed: current >= target,
    remaining: Math.max(0, target - current),
  };
}

/** Bites: target per cuisine (e.g. 3 bites per cuisine for "explore cuisines" goal) */
export const BITE_TARGET_PER_CUISINE = 3;

export function getBiteCountByCuisine(bites: Bite[]): Record<string, number> {
  const out: Record<string, number> = {};
  bites.forEach((b) => {
    const key = (b.cuisine || 'Other').trim() || 'Other';
    out[key] = (out[key] || 0) + 1;
  });
  return out;
}

export interface CuisineBiteProgress {
  cuisine: string;
  current: number;
  target: number;
  completed: boolean;
}

export function getBiteProgressByCuisine(bites: Bite[]): CuisineBiteProgress[] {
  const byCuisine = getBiteCountByCuisine(bites);
  return Object.entries(byCuisine).map(([cuisine, current]) => ({
    cuisine,
    current,
    target: BITE_TARGET_PER_CUISINE,
    completed: current >= BITE_TARGET_PER_CUISINE,
  }));
}
