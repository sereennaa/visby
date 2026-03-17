export interface QuickPhrase {
  text: string;
  category: 'greetings' | 'reactions' | 'explore' | 'vibes';
}

export const QUICK_PHRASES: QuickPhrase[] = [
  { text: 'Hi!', category: 'greetings' },
  { text: 'Hey there!', category: 'greetings' },
  { text: 'Welcome!', category: 'greetings' },
  { text: 'Bye!', category: 'greetings' },
  { text: 'Cool!', category: 'reactions' },
  { text: "That's awesome!", category: 'reactions' },
  { text: 'Haha!', category: 'reactions' },
  { text: 'Whoa!', category: 'reactions' },
  { text: "Let's explore!", category: 'explore' },
  { text: 'Check this out!', category: 'explore' },
  { text: 'Follow me!', category: 'explore' },
  { text: 'I love this room!', category: 'vibes' },
  { text: 'This is so fun!', category: 'vibes' },
  { text: 'Best day ever!', category: 'vibes' },
];

const COUNTRY_GREETINGS: Record<string, string[]> = {
  jp: ['Konnichiwa!', 'Sugoi!'],
  fr: ['Bonjour!', 'Magnifique!'],
  mx: ['Hola!', 'Genial!'],
  it: ['Ciao!', 'Bellissimo!'],
  gb: ['Cheerio!', 'Brilliant!'],
  br: ['Oi!', 'Legal!'],
  kr: ['Annyeong!', 'Daebak!'],
  th: ['Sawasdee!', 'Suay mak!'],
  no: ['Hei!', 'Fantastisk!'],
  tr: ['Merhaba!', 'Harika!'],
  gr: ['Yassou!', 'Omorfi!'],
  ke: ['Jambo!', 'Sawa!'],
  ma: ['Salam!', 'Zwin!'],
  pe: ['Hola!', 'Chevere!'],
};

export function getPhrasesForRoom(countryId?: string): QuickPhrase[] {
  const base = [...QUICK_PHRASES];
  if (countryId && COUNTRY_GREETINGS[countryId]) {
    const extras = COUNTRY_GREETINGS[countryId].map((text) => ({
      text,
      category: 'greetings' as const,
    }));
    base.unshift(...extras);
  }
  return base;
}

export const PHRASE_CATEGORIES = ['greetings', 'reactions', 'explore', 'vibes'] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  greetings: 'Say Hi',
  reactions: 'React',
  explore: 'Explore',
  vibes: 'Vibes',
};
