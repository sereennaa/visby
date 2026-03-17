import { COUNTRIES } from './constants';
import { getCountryKnowledge } from './countryKnowledge';
import {
  getMemoryPairsForCountry,
  getSortChallengesForCountry,
  getStoryTemplateForCountry,
  getWordPairsForCountry,
} from './countryGameContent';

const FALLBACK_COUNTRY_ID = COUNTRIES[0]?.id ?? 'jp';
const COUNTRY_ID_SET = new Set(COUNTRIES.map((country) => country.id));

export function isSupportedCountryId(countryId: string | null | undefined): countryId is string {
  return !!countryId && COUNTRY_ID_SET.has(countryId);
}

export function normalizeCountryId(countryId: string | null | undefined, fallbackId = FALLBACK_COUNTRY_ID): string {
  return isSupportedCountryId(countryId) ? countryId : fallbackId;
}

export function getCountryIdFromParams(
  params: { countryId?: string | null } | undefined,
  fallbackId = FALLBACK_COUNTRY_ID,
): string {
  return normalizeCountryId(params?.countryId, fallbackId);
}

export function getSafeCountryKnowledge(countryId: string | null | undefined) {
  return getCountryKnowledge(normalizeCountryId(countryId));
}

export function getSafeCountryGameContent(countryId: string | null | undefined) {
  const safeCountryId = normalizeCountryId(countryId);
  return {
    countryId: safeCountryId,
    words: getWordPairsForCountry(safeCountryId),
    memory: getMemoryPairsForCountry(safeCountryId),
    sort: getSortChallengesForCountry(safeCountryId),
    story: getStoryTemplateForCountry(safeCountryId),
  };
}
