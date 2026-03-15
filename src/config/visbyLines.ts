/**
 * Visby mood-aware and post-action lines (rule-based).
 * Used after mini-games and lessons to make Visby feel responsive.
 */
import type { VisbyMood } from '../types';

type GameKey = 'WordMatch' | 'MemoryCards' | 'CookingGame' | 'TreasureHunt';

const LINES = {
  game_won: {
    excited: ['We did it!', 'So much fun!', 'You\'re amazing!'],
    happy: ['Nice one!', 'Great job!', 'Well played!'],
    sleepy: ['Good game... *yawn*', 'We won! Time for a nap?'],
    hungry: ['We won! Can we eat now?', 'Good job! I\'m getting hungry.'],
    bored: ['That was fun! What next?', 'You made it interesting!'],
    lonely: ['Playing with you was nice!', 'Thanks for playing with me!'],
    confused: ['We did it? We did it!', 'I think we won!'],
    sick: ['You did great even though I don\'t feel well.', 'Thank you for playing.'],
  },
  game_lost: {
    excited: ['Next time we\'ll get it!', 'That was close!'],
    happy: ['Let\'s try again!', 'Good try!'],
    sleepy: ['Maybe after a nap...', 'I\'ll do better when I\'m awake!'],
    hungry: ['I was too hungry to focus!', 'Let\'s eat and try again.'],
    bored: ['Let\'s try a different game?', 'Again?'],
    lonely: ['Playing with you still made me happy!', 'Try again with me?'],
    confused: ['I got confused! One more try?', 'That was tricky!'],
    sick: ['I didn\'t feel my best. Try again?', 'Next time!'],
  },
  game_perfect: {
    excited: ['PERFECT! You\'re a star!', 'Wow! Perfect!'],
    happy: ['Perfect! So proud!', 'Flawless!'],
    sleepy: ['Perfect... *happy yawn*', 'We aced it!'],
    hungry: ['Perfect! Now snacks!', 'Amazing!'],
    bored: ['Perfect! That was cool!', 'You made it look easy!'],
    lonely: ['Perfect! You\'re the best!', 'We\'re a great team!'],
    confused: ['We did it perfectly!', 'I understood that one!'],
    sick: ['You did perfect for both of us!', 'Thank you!'],
  },
  lesson: {
    excited: ['We learned something new!', 'Learning is fun!'],
    happy: ['Good studying!', 'We\'re getting smarter!'],
    sleepy: ['My brain is full... but happy!', 'Good lesson!'],
    hungry: ['Knowledge and snacks!', 'Learned something!'],
    bored: ['That was actually interesting!', 'Good one!'],
    lonely: ['Studying with you is nice!', 'Thanks for learning with me!'],
    confused: ['I think I get it now!', 'More lessons help!'],
    sick: ['You studied for both of us!', 'Thank you!'],
  },
} as const;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getPostGameLine(
  gameKey: GameKey,
  outcome: 'won' | 'lost' | 'perfect',
  mood: VisbyMood
): string {
  const key = outcome === 'perfect' ? 'game_perfect' : outcome === 'won' ? 'game_won' : 'game_lost';
  const byMood = LINES[key];
  const lines = byMood[mood] ?? byMood.happy;
  return pick(lines);
}

export function getPostLessonLine(mood: VisbyMood): string {
  const lines = LINES.lesson[mood] ?? LINES.lesson.happy;
  return pick(lines);
}

/** One-off lines when entering a country room (by countryId) */
const ROOM_ENTRY_LINES: Record<string, string[]> = {
  jp: ['Wow, so many cool things here!', 'I love this room!', 'Let\'s explore!'],
  fr: ['Ooh la la!', 'So much to discover!', 'This room is lovely!'],
  mx: ['So colorful!', 'I want to explore everything!', 'What\'s that over there?'],
  it: ['Bellissimo!', 'So much to learn here!', 'I like this place!'],
  gb: ['Fancy!', 'Lots to see!', 'Shall we look around?'],
  br: ['So green and lively!', 'I love the vibe!', 'Let\'s explore!'],
  kr: ['So cool!', 'So many things to tap!', 'I\'m excited!'],
  th: ['Beautiful!', 'Let\'s discover something!', 'I like it here!'],
  ma: ['So pretty!', 'So much to learn!', 'Tap the objects!'],
  pe: ['Amazing!', 'I want to see everything!', 'Explore with me!'],
  ke: ['Wow!', 'So much nature!', 'Let\'s look around!'],
};

const DEFAULT_ROOM_LINES = ['Tap objects to learn!', 'So much to discover!', 'Let\'s explore!'];

export function getRoomEntryLine(countryId: string): string {
  const lines = ROOM_ENTRY_LINES[countryId] ?? DEFAULT_ROOM_LINES;
  return pick(lines);
}
