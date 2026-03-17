/**
 * SM-2 Spaced Repetition Algorithm for flashcard review scheduling.
 * Cards are graded 0-5 and scheduled for future review based on performance.
 */

import type { FlashcardSRData, FlashcardGrade } from '../types';

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

export function createInitialSRData(cardId: string): FlashcardSRData {
  return {
    cardId,
    ease: DEFAULT_EASE,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastReview: new Date().toISOString(),
  };
}

/**
 * Core SM-2 algorithm. Returns updated card data after grading.
 * Grade scale: 0=blackout, 1=wrong, 2=hard, 3=ok, 4=good, 5=perfect
 */
export function gradeCard(card: FlashcardSRData, grade: FlashcardGrade): FlashcardSRData {
  const now = new Date();
  let { ease, interval, repetitions } = card;

  if (grade >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    repetitions += 1;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  ease = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  ease = Math.max(MIN_EASE, ease);

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    cardId: card.cardId,
    ease,
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastReview: now.toISOString(),
  };
}

/** Get all cards that are due for review (nextReview <= now) */
export function getDueCards(allCards: FlashcardSRData[]): FlashcardSRData[] {
  const now = new Date().toISOString();
  return allCards
    .filter((c) => c.nextReview <= now)
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview));
}

/** Get count of cards due today */
export function getDueCount(allCards: FlashcardSRData[]): number {
  return getDueCards(allCards).length;
}

/** Calculate mastery percentage across all cards */
export function getMasteryPercent(allCards: FlashcardSRData[]): number {
  if (allCards.length === 0) return 0;
  const mastered = allCards.filter((c) => c.repetitions >= 3 && c.interval >= 21);
  return Math.round((mastered.length / allCards.length) * 100);
}

/** Convert "Knew it" / "Still learning" to SM-2 grade */
export function simpleGrade(knewIt: boolean): FlashcardGrade {
  return knewIt ? 4 : 1;
}

/** Get human-readable status for a card */
export function getCardStatus(card: FlashcardSRData): 'new' | 'learning' | 'review' | 'mastered' {
  if (card.repetitions === 0) return 'new';
  if (card.interval < 7) return 'learning';
  if (card.interval >= 21) return 'mastered';
  return 'review';
}

/** Summary stats for a set of SR cards */
export function getSRStats(cards: FlashcardSRData[]): {
  total: number;
  newCards: number;
  learning: number;
  review: number;
  mastered: number;
  dueToday: number;
} {
  const dueToday = getDueCount(cards);
  let newCards = 0, learning = 0, review = 0, mastered = 0;
  for (const c of cards) {
    const status = getCardStatus(c);
    if (status === 'new') newCards++;
    else if (status === 'learning') learning++;
    else if (status === 'review') review++;
    else mastered++;
  }
  return { total: cards.length, newCards, learning, review, mastered, dueToday };
}
