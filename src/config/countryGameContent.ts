import { LANGUAGE_PHRASE_PACKS, getCountryLocations } from './learningContent';
import { getDishesByCountry } from './worldFoods';
import { COUNTRIES } from './constants';

export interface CountryWordPair {
  foreign: string;
  english: string;
  language: string;
  imageUrl?: string;
}

export interface CountryMemoryPair {
  id: string;
  text: string;
  match: string;
  icon: string;
  imageUrl?: string;
}

export interface CountrySortCategory {
  id: string;
  name: string;
  color: string;
}

export interface CountrySortItem {
  id: string;
  text: string;
  category: string;
  icon: string;
}

export interface CountrySortChallenge {
  title: string;
  categories: CountrySortCategory[];
  items: CountrySortItem[];
}

export interface CountryStorySegment {
  text: string;
  blank?: { answer: string; options: string[] };
}

export interface CountryStoryTemplate {
  id: string;
  title: string;
  countryId: string;
  countryName: string;
  segments: CountryStorySegment[];
}

const COUNTRY_LANGUAGE_NAMES: Record<string, string> = {
  jp: 'Japanese',
  fr: 'French',
  mx: 'Spanish',
  it: 'Italian',
  gb: 'English',
  br: 'Portuguese',
  kr: 'Korean',
  th: 'Thai',
  ma: 'Arabic',
  pe: 'Spanish',
  ke: 'Swahili',
  no: 'Norwegian',
  tr: 'Turkish',
  gr: 'Greek',
};

const COUNTRY_COLORS: Record<string, string> = {
  jp: '#E8B4B8',
  fr: '#87CEEB',
  mx: '#90EE90',
  it: '#A5D6A7',
  gb: '#B39DDB',
  br: '#81C784',
  kr: '#90CAF9',
  th: '#FFCC80',
  ma: '#FFAB91',
  pe: '#D7CCC8',
  ke: '#A5D6A7',
  no: '#B3E5FC',
  tr: '#FFCDD2',
  gr: '#BBDEFB',
};

const CORE_COUNTRIES = ['jp', 'fr', 'mx', 'it', 'gb', 'br', 'kr', 'th', 'ma', 'pe', 'ke', 'no', 'tr', 'gr'] as const;

const COUNTRY_STORY_TEMPLATES: Record<string, CountryStoryTemplate> = {
  jp: {
    id: 'jp_story',
    title: 'Tea Time in Japan',
    countryId: 'jp',
    countryName: 'Japan',
    segments: [
      { text: 'In Japan, a calm tradition called the ' },
      { text: '', blank: { answer: 'tea ceremony', options: ['tea ceremony', 'pizza festival', 'snow race', 'drum parade'] } },
      { text: ' teaches respect and focus. Guests say ' },
      { text: '', blank: { answer: 'arigatou', options: ['arigatou', 'bonjour', 'hola', 'ciao'] } },
      { text: ' and enjoy warm ' },
      { text: '', blank: { answer: 'matcha', options: ['matcha', 'soda', 'cocoa', 'juice'] } },
      { text: ' in a quiet room.' },
    ],
  },
  fr: {
    id: 'fr_story',
    title: 'Morning in Paris',
    countryId: 'fr',
    countryName: 'France',
    segments: [
      { text: 'In France, people greet with ' },
      { text: '', blank: { answer: 'bonjour', options: ['bonjour', 'namaste', 'sawadee', 'annyeong'] } },
      { text: ' before buying a flaky ' },
      { text: '', blank: { answer: 'croissant', options: ['croissant', 'taco', 'sushi', 'bibimbap'] } },
      { text: ' and walking near the ' },
      { text: '', blank: { answer: 'Eiffel Tower', options: ['Eiffel Tower', 'Machu Picchu', 'Mount Fuji', 'Big Ben'] } },
      { text: '.' },
    ],
  },
  mx: {
    id: 'mx_story',
    title: 'Festival Day in Mexico',
    countryId: 'mx',
    countryName: 'Mexico',
    segments: [
      { text: 'During a colorful celebration, families build ' },
      { text: '', blank: { answer: 'ofrendas', options: ['ofrendas', 'igloos', 'pagodas', 'cabins'] } },
      { text: ' and share ' },
      { text: '', blank: { answer: 'tamales', options: ['tamales', 'sushi rolls', 'ramen', 'waffles'] } },
      { text: '. Everyone says ' },
      { text: '', blank: { answer: 'gracias', options: ['gracias', 'merci', 'grazie', 'xie xie'] } },
      { text: ' with a smile.' },
    ],
  },
  it: {
    id: 'it_story',
    title: 'Italian Food Adventure',
    countryId: 'it',
    countryName: 'Italy',
    segments: [
      { text: 'In Italy, families gather for fresh ' },
      { text: '', blank: { answer: 'pasta', options: ['pasta', 'curry', 'sashimi', 'arepas'] } },
      { text: ' and say ' },
      { text: '', blank: { answer: 'grazie', options: ['grazie', 'arigatou', 'obrigado', 'khop-khun'] } },
      { text: '. In Rome, the ancient ' },
      { text: '', blank: { answer: 'Colosseum', options: ['Colosseum', 'Sphinx', 'Acropolis', 'Taj Mahal'] } },
      { text: ' reminds visitors of history.' },
    ],
  },
  gb: {
    id: 'gb_story',
    title: 'A Day in London',
    countryId: 'gb',
    countryName: 'United Kingdom',
    segments: [
      { text: 'In the UK, people often queue politely and say ' },
      { text: '', blank: { answer: 'please', options: ['please', 'adios', 'namaste', 'opa'] } },
      { text: '. Afternoon ' },
      { text: '', blank: { answer: 'tea', options: ['tea', 'sushi', 'kimchi', 'ceviche'] } },
      { text: ' is a classic tradition near landmarks like ' },
      { text: '', blank: { answer: 'Big Ben', options: ['Big Ben', 'Tokyo Tower', 'Angkor Wat', 'Petra'] } },
      { text: '.' },
    ],
  },
  br: {
    id: 'br_story',
    title: 'Rhythms of Brazil',
    countryId: 'br',
    countryName: 'Brazil',
    segments: [
      { text: 'In Brazil, the beat of ' },
      { text: '', blank: { answer: 'samba', options: ['samba', 'waltz', 'opera', 'kabuki'] } },
      { text: ' fills festival streets. Families share ' },
      { text: '', blank: { answer: 'feijoada', options: ['feijoada', 'pad thai', 'paella', 'gyro'] } },
      { text: ' and cheer near ' },
      { text: '', blank: { answer: 'Rio', options: ['Rio', 'Oslo', 'Athens', 'Seoul'] } },
      { text: '.' },
    ],
  },
  kr: {
    id: 'kr_story',
    title: 'Seoul Spotlight',
    countryId: 'kr',
    countryName: 'South Korea',
    segments: [
      { text: 'In Korea, students learn ' },
      { text: '', blank: { answer: 'Hangul', options: ['Hangul', 'Latin', 'Cyrillic', 'Runes'] } },
      { text: ' and greet with ' },
      { text: '', blank: { answer: 'annyeonghaseyo', options: ['annyeonghaseyo', 'bonjour', 'hola', 'ciao'] } },
      { text: '. A favorite dish is ' },
      { text: '', blank: { answer: 'kimchi', options: ['kimchi', 'gelato', 'taco', 'hummus'] } },
      { text: '.' },
    ],
  },
  th: {
    id: 'th_story',
    title: 'Smiles in Thailand',
    countryId: 'th',
    countryName: 'Thailand',
    segments: [
      { text: 'In Thailand, people greet with a ' },
      { text: '', blank: { answer: 'wai', options: ['wai', 'handshake race', 'high five', 'salute'] } },
      { text: ' and say ' },
      { text: '', blank: { answer: 'sawadee', options: ['sawadee', 'gracias', 'merci', 'hej'] } },
      { text: '. Street vendors serve tasty ' },
      { text: '', blank: { answer: 'pad thai', options: ['pad thai', 'lasagna', 'poutine', 'pierogi'] } },
      { text: '.' },
    ],
  },
  ma: {
    id: 'ma_story',
    title: 'Market Morning in Morocco',
    countryId: 'ma',
    countryName: 'Morocco',
    segments: [
      { text: 'In Morocco\'s medina, colorful ' },
      { text: '', blank: { answer: 'markets', options: ['markets', 'ice rinks', 'subways', 'stadiums'] } },
      { text: ' sell spices and crafts. Guests are offered ' },
      { text: '', blank: { answer: 'mint tea', options: ['mint tea', 'root beer', 'smoothies', 'cocoa'] } },
      { text: ' and often say ' },
      { text: '', blank: { answer: 'shukran', options: ['shukran', 'arigatou', 'grazie', 'xe xe'] } },
      { text: '.' },
    ],
  },
  pe: {
    id: 'pe_story',
    title: 'High in the Andes',
    countryId: 'pe',
    countryName: 'Peru',
    segments: [
      { text: 'In Peru, ancient paths lead to ' },
      { text: '', blank: { answer: 'Machu Picchu', options: ['Machu Picchu', 'Big Ben', 'Louvre', 'Kremlin'] } },
      { text: '. Families may share fresh ' },
      { text: '', blank: { answer: 'ceviche', options: ['ceviche', 'ramen', 'pizza', 'baklava'] } },
      { text: ' and greet with ' },
      { text: '', blank: { answer: 'hola', options: ['hola', 'bonjour', 'hej', 'sawasdee'] } },
      { text: '.' },
    ],
  },
  ke: {
    id: 'ke_story',
    title: 'Kenya Safari Morning',
    countryId: 'ke',
    countryName: 'Kenya',
    segments: [
      { text: 'In Kenya, visitors on safari may spot ' },
      { text: '', blank: { answer: 'giraffes', options: ['giraffes', 'penguins', 'pandas', 'reindeer'] } },
      { text: ' in the savanna. A friendly greeting is ' },
      { text: '', blank: { answer: 'jambo', options: ['jambo', 'ciao', 'namaste', 'bonjour'] } },
      { text: '. Many families enjoy ' },
      { text: '', blank: { answer: 'ugali', options: ['ugali', 'croissant', 'sushi', 'moussaka'] } },
      { text: ' at shared meals.' },
    ],
  },
  no: {
    id: 'no_story',
    title: 'Night Sky in Norway',
    countryId: 'no',
    countryName: 'Norway',
    segments: [
      { text: 'In Norway, winter skies can glow with the ' },
      { text: '', blank: { answer: 'Northern Lights', options: ['Northern Lights', 'desert sun', 'volcano ash', 'city neon'] } },
      { text: '. Deep sea valleys called ' },
      { text: '', blank: { answer: 'fjords', options: ['fjords', 'deltas', 'atolls', 'reefs'] } },
      { text: ' cut through mountains, and people greet with ' },
      { text: '', blank: { answer: 'hei', options: ['hei', 'hola', 'merhaba', 'salaam'] } },
      { text: '.' },
    ],
  },
  tr: {
    id: 'tr_story',
    title: 'Bridges of Istanbul',
    countryId: 'tr',
    countryName: 'Turkey',
    segments: [
      { text: 'In Turkey, Istanbul connects ' },
      { text: '', blank: { answer: 'Europe and Asia', options: ['Europe and Asia', 'Africa and America', 'North and South poles', 'two islands only'] } },
      { text: '. Visitors taste sweet ' },
      { text: '', blank: { answer: 'lokum', options: ['lokum', 'mochi', 'gelato', 'tiramisu'] } },
      { text: ' and greet with ' },
      { text: '', blank: { answer: 'merhaba', options: ['merhaba', 'bonjour', 'annyeong', 'ola'] } },
      { text: '.' },
    ],
  },
  gr: {
    id: 'gr_story',
    title: 'Legends of Greece',
    countryId: 'gr',
    countryName: 'Greece',
    segments: [
      { text: 'In Greece, ancient stories tell of gods on Mount ' },
      { text: '', blank: { answer: 'Olympus', options: ['Olympus', 'Everest', 'Fuji', 'Atlas'] } },
      { text: '. A famous landmark is the ' },
      { text: '', blank: { answer: 'Acropolis', options: ['Acropolis', 'Colosseum', 'Petra', 'Alhambra'] } },
      { text: ', and people may cheerfully say ' },
      { text: '', blank: { answer: 'yassas', options: ['yassas', 'hej', 'xin chao', 'shalom'] } },
      { text: '.' },
    ],
  },
};

export function getWordPairsForCountry(countryId: string): CountryWordPair[] {
  const language = COUNTRY_LANGUAGE_NAMES[countryId] ?? 'Local';
  const phrasePairs = LANGUAGE_PHRASE_PACKS
    .filter((p) => p.countryId === countryId)
    .slice(0, 15)
    .map((p) => ({
      foreign: p.phrase,
      english: p.translation,
      language,
    }));

  return phrasePairs;
}

export function getMemoryPairsForCountry(countryId: string): CountryMemoryPair[] {
  const locationPairs = getCountryLocations(countryId).slice(0, 5).map((loc, idx) => ({
    id: `${countryId}_loc_${idx}`,
    text: loc.name,
    match: loc.category.replace('_', ' '),
    icon: loc.category === 'food' ? 'food' : loc.category === 'nature' ? 'nature' : 'landmark',
    imageUrl: loc.imageUrl,
  }));

  const dishPairs = getDishesByCountry(countryId).slice(0, 5).map((dish, idx) => ({
    id: `${countryId}_dish_${idx}`,
    text: dish.name,
    match: dish.countryName,
    icon: 'food',
    imageUrl: dish.imageUrl,
  }));

  return [...locationPairs, ...dishPairs];
}

export function getSortChallengesForCountry(countryId: string): CountrySortChallenge[] {
  const country = COUNTRIES.find((c) => c.id === countryId);
  const color = COUNTRY_COLORS[countryId] ?? '#CFE9F7';
  const dishes = getDishesByCountry(countryId).slice(0, 3);
  const locations = getCountryLocations(countryId).slice(0, 3);
  const phrases = LANGUAGE_PHRASE_PACKS.filter((p) => p.countryId === countryId).slice(0, 3);

  const localItems: CountrySortItem[] = [
    ...dishes.map((d, i) => ({ id: `d_${i}`, text: d.name, category: 'food', icon: d.emoji })),
    ...locations.map((l, i) => ({ id: `l_${i}`, text: l.name, category: 'landmark', icon: 'landmark' })),
    ...phrases.map((p, i) => ({ id: `p_${i}`, text: p.phrase, category: 'language', icon: 'language' })),
  ];

  const worldDistractors: CountrySortItem[] = [
    { id: 'w1', text: 'Pizza', category: 'world', icon: 'food' },
    { id: 'w2', text: 'Eiffel Tower', category: 'world', icon: 'landmark' },
    { id: 'w3', text: 'Bonjour', category: 'world', icon: 'language' },
  ];

  return [
    {
      title: `${country?.name ?? countryId} Discovery Sort`,
      categories: [
        { id: 'food', name: 'Food', color },
        { id: 'landmark', name: 'Landmarks', color: '#CFE9F7' },
        { id: 'language', name: 'Language', color: '#DFF5E1' },
      ],
      items: localItems.slice(0, 9),
    },
    {
      title: `${country?.name ?? countryId} or World?`,
      categories: [
        { id: countryId, name: country?.name ?? 'This Country', color },
        { id: 'world', name: 'Other Places', color: '#FFD8A8' },
      ],
      items: [
        ...dishes.slice(0, 2).map((d, i) => ({ id: `cw_d_${i}`, text: d.name, category: countryId, icon: d.emoji })),
        ...locations.slice(0, 2).map((l, i) => ({ id: `cw_l_${i}`, text: l.name, category: countryId, icon: 'landmark' })),
        ...phrases.slice(0, 2).map((p, i) => ({ id: `cw_p_${i}`, text: p.phrase, category: countryId, icon: 'language' })),
        ...worldDistractors,
      ],
    },
  ];
}

export function getStoryTemplateForCountry(countryId: string): CountryStoryTemplate | null {
  return COUNTRY_STORY_TEMPLATES[countryId] ?? null;
}

export function getAllStoryTemplates(): CountryStoryTemplate[] {
  return CORE_COUNTRIES.map((id) => COUNTRY_STORY_TEMPLATES[id]).filter(Boolean);
}
