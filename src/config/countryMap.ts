/**
 * Country map pins: cities and landmarks shown on the map.
 * User taps a pin to "walk the street" and see stops (locations) with pictures and fun facts.
 */

export type MapPinType = 'city' | 'landmark';

export interface CountryMapPin {
  id: string;
  name: string;
  type: MapPinType;
  /** Location IDs (stops) that belong to this pin — shown in street view */
  locationIds: string[];
  /** Position on map: 0–100 percent from left */
  xPercent: number;
  /** Position on map: 0–100 percent from top */
  yPercent: number;
}

const COUNTRY_MAP_PINS: Record<string, CountryMapPin[]> = {
  jp: [
    { id: 'jp_tokyo', name: 'Tokyo', type: 'city', locationIds: ['jp_loc1', 'jp_loc3', 'jp_loc5'], xPercent: 72, yPercent: 42 },
    { id: 'jp_kyoto', name: 'Kyoto', type: 'city', locationIds: ['jp_loc2', 'jp_loc4'], xPercent: 38, yPercent: 48 },
  ],
  fr: [
    { id: 'fr_paris', name: 'Paris', type: 'city', locationIds: ['fr_loc1', 'fr_loc2', 'fr_loc4'], xPercent: 42, yPercent: 35 },
    { id: 'fr_mont', name: 'Mont Saint-Michel', type: 'landmark', locationIds: ['fr_loc3'], xPercent: 18, yPercent: 28 },
    { id: 'fr_nice', name: 'Nice', type: 'city', locationIds: ['fr_loc5'], xPercent: 62, yPercent: 72 },
  ],
  mx: [
    { id: 'mx_yucatan', name: 'Yucatán', type: 'landmark', locationIds: ['mx_loc1', 'mx_loc3'], xPercent: 78, yPercent: 38 },
    { id: 'mx_oaxaca', name: 'Oaxaca', type: 'city', locationIds: ['mx_loc2'], xPercent: 32, yPercent: 52 },
    { id: 'mx_cdmx', name: 'Mexico City', type: 'city', locationIds: ['mx_loc4', 'mx_loc5'], xPercent: 38, yPercent: 42 },
  ],
  it: [
    { id: 'it_rome', name: 'Rome', type: 'city', locationIds: ['it_loc1', 'it_loc5'], xPercent: 48, yPercent: 52 },
    { id: 'it_venice', name: 'Venice', type: 'city', locationIds: ['it_loc2'], xPercent: 58, yPercent: 28 },
    { id: 'it_pompeii', name: 'Pompeii', type: 'landmark', locationIds: ['it_loc3'], xPercent: 52, yPercent: 68 },
    { id: 'it_amalfi', name: 'Amalfi Coast', type: 'landmark', locationIds: ['it_loc4'], xPercent: 58, yPercent: 78 },
  ],
  gb: [
    { id: 'gb_london', name: 'London', type: 'city', locationIds: ['gb_loc1', 'gb_loc4'], xPercent: 52, yPercent: 48 },
    { id: 'gb_stonehenge', name: 'Stonehenge', type: 'landmark', locationIds: ['gb_loc2'], xPercent: 32, yPercent: 58 },
    { id: 'gb_lake', name: 'Lake District', type: 'landmark', locationIds: ['gb_loc3'], xPercent: 38, yPercent: 28 },
    { id: 'gb_york', name: 'York', type: 'city', locationIds: ['gb_loc5'], xPercent: 52, yPercent: 32 },
  ],
  br: [
    { id: 'br_rio', name: 'Rio de Janeiro', type: 'city', locationIds: ['br_loc1', 'br_loc2'], xPercent: 72, yPercent: 72 },
    { id: 'br_amazon', name: 'Amazon', type: 'landmark', locationIds: ['br_loc3'], xPercent: 28, yPercent: 38 },
    { id: 'br_iguazu', name: 'Iguazu Falls', type: 'landmark', locationIds: ['br_loc4'], xPercent: 42, yPercent: 82 },
    { id: 'br_saopaulo', name: 'São Paulo', type: 'city', locationIds: ['br_loc5'], xPercent: 48, yPercent: 72 },
  ],
  kr: [
    { id: 'kr_seoul', name: 'Seoul', type: 'city', locationIds: ['kr_loc1', 'kr_loc2', 'kr_loc4'], xPercent: 48, yPercent: 38 },
    { id: 'kr_jeju', name: 'Jeju Island', type: 'landmark', locationIds: ['kr_loc3'], xPercent: 22, yPercent: 82 },
    { id: 'kr_dmz', name: 'DMZ', type: 'landmark', locationIds: ['kr_loc5'], xPercent: 48, yPercent: 28 },
  ],
  th: [
    { id: 'th_bangkok', name: 'Bangkok', type: 'city', locationIds: ['th_loc1', 'th_loc4'], xPercent: 42, yPercent: 52 },
    { id: 'th_phiphi', name: 'Phi Phi Islands', type: 'landmark', locationIds: ['th_loc2'], xPercent: 28, yPercent: 72 },
    { id: 'th_chiangmai', name: 'Chiang Mai', type: 'city', locationIds: ['th_loc3'], xPercent: 38, yPercent: 38 },
    { id: 'th_erawan', name: 'Erawan Falls', type: 'landmark', locationIds: ['th_loc5'], xPercent: 38, yPercent: 58 },
  ],
  ma: [
    { id: 'ma_marrakech', name: 'Marrakech', type: 'city', locationIds: ['ma_loc1', 'ma_loc5'], xPercent: 28, yPercent: 52 },
    { id: 'ma_sahara', name: 'Sahara', type: 'landmark', locationIds: ['ma_loc2'], xPercent: 52, yPercent: 48 },
    { id: 'ma_chefchaouen', name: 'Chefchaouen', type: 'city', locationIds: ['ma_loc3'], xPercent: 22, yPercent: 32 },
    { id: 'ma_fez', name: 'Fez', type: 'city', locationIds: ['ma_loc4'], xPercent: 38, yPercent: 38 },
  ],
  pe: [
    { id: 'pe_cusco', name: 'Cusco & Machu Picchu', type: 'landmark', locationIds: ['pe_loc1', 'pe_loc5'], xPercent: 32, yPercent: 48 },
    { id: 'pe_rainbow', name: 'Rainbow Mountain', type: 'landmark', locationIds: ['pe_loc2'], xPercent: 38, yPercent: 52 },
    { id: 'pe_titicaca', name: 'Lake Titicaca', type: 'landmark', locationIds: ['pe_loc3'], xPercent: 42, yPercent: 62 },
    { id: 'pe_lima', name: 'Lima', type: 'city', locationIds: ['pe_loc4'], xPercent: 28, yPercent: 72 },
  ],
  ke: [
    { id: 'ke_mara', name: 'Maasai Mara', type: 'landmark', locationIds: ['ke_loc1'], xPercent: 58, yPercent: 52 },
    { id: 'ke_mtkenya', name: 'Mount Kenya', type: 'landmark', locationIds: ['ke_loc2'], xPercent: 62, yPercent: 38 },
    { id: 'ke_nairobi', name: 'Nairobi', type: 'city', locationIds: ['ke_loc3', 'ke_loc5'], xPercent: 58, yPercent: 62 },
    { id: 'ke_lamu', name: 'Lamu', type: 'city', locationIds: ['ke_loc4'], xPercent: 72, yPercent: 42 },
  ],
  no: [
    { id: 'no_oslo', name: 'Oslo', type: 'city', locationIds: ['no_loc3'], xPercent: 42, yPercent: 42 },
    { id: 'no_geiranger', name: 'Geirangerfjord', type: 'landmark', locationIds: ['no_loc1'], xPercent: 32, yPercent: 32 },
    { id: 'no_tromso', name: 'Tromsø', type: 'city', locationIds: ['no_loc2'], xPercent: 48, yPercent: 12 },
    { id: 'no_trolltunga', name: 'Trolltunga', type: 'landmark', locationIds: ['no_loc4'], xPercent: 28, yPercent: 38 },
    { id: 'no_bergen', name: 'Bergen', type: 'city', locationIds: ['no_loc5'], xPercent: 22, yPercent: 38 },
  ],
  tr: [
    { id: 'tr_istanbul', name: 'Istanbul', type: 'city', locationIds: ['tr_loc1', 'tr_loc3', 'tr_loc5'], xPercent: 62, yPercent: 38 },
    { id: 'tr_cappadocia', name: 'Cappadocia', type: 'landmark', locationIds: ['tr_loc2'], xPercent: 58, yPercent: 48 },
    { id: 'tr_pamukkale', name: 'Pamukkale', type: 'landmark', locationIds: ['tr_loc4'], xPercent: 38, yPercent: 52 },
  ],
  gr: [
    { id: 'gr_athens', name: 'Athens', type: 'city', locationIds: ['gr_loc1', 'gr_loc5'], xPercent: 48, yPercent: 58 },
    { id: 'gr_santorini', name: 'Santorini', type: 'landmark', locationIds: ['gr_loc2'], xPercent: 52, yPercent: 72 },
    { id: 'gr_olympia', name: 'Olympia', type: 'landmark', locationIds: ['gr_loc3'], xPercent: 32, yPercent: 58 },
    { id: 'gr_meteora', name: 'Meteora', type: 'landmark', locationIds: ['gr_loc4'], xPercent: 42, yPercent: 42 },
  ],
};

export function getCountryMapPins(countryId: string): CountryMapPin[] {
  return COUNTRY_MAP_PINS[countryId] || [];
}

export function getMapPin(countryId: string, pinId: string): CountryMapPin | null {
  const pins = COUNTRY_MAP_PINS[countryId] || [];
  return pins.find((p) => p.id === pinId) ?? null;
}

/** Optional region/direction hint for "Where is this?" (e.g. "in the north of France") */
const PIN_REGION_HINTS: Record<string, string> = {
  fr_paris: 'the capital, in the north',
  fr_mont: 'in the north of France',
  fr_nice: 'in the south, on the Mediterranean',
  jp_tokyo: 'the capital, on the east coast',
  jp_kyoto: 'in the south, near Osaka',
  it_rome: 'the capital, in the center',
  it_venice: 'in the north, on the coast',
  gb_london: 'the capital, in the south',
  mx_cdmx: 'the capital, in the center',
  pe_lima: 'the capital, on the coast',
  kr_seoul: 'the capital, in the northwest',
  no_oslo: 'the capital, in the south',
  gr_athens: 'the capital, in the south',
  ke_nairobi: 'the capital, in the south',
  tr_istanbul: 'in the northwest, between two continents',
};

/** Returns a short educational line: "[Pin] is in [Country][, region]." */
export function getPlaceLocationFact(pinName: string, countryName: string, pinId: string): string {
  const hint = PIN_REGION_HINTS[pinId];
  if (hint) {
    return `${pinName} is in ${countryName}, ${hint}.`;
  }
  return `${pinName} is in ${countryName}.`;
}
