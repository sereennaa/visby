export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  emoji: string;
  deck: string;
}

export interface LessonSlide {
  text: string;
  emoji: string;
}

export interface LessonData {
  title: string;
  slides: LessonSlide[];
}

// ─── QUIZ QUESTIONS (60 across 6 categories) ───

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  // LANGUAGE (10)
  { id: 'lq1', question: 'What does "Bonjour" mean in French?', options: ['Goodbye', 'Hello / Good day', 'Thank you', 'Please'], correct: 1, category: 'language' },
  { id: 'lq2', question: 'How do you say "thank you" in Japanese?', options: ['Sayonara', 'Konnichiwa', 'Arigatou', 'Sumimasen'], correct: 2, category: 'language' },
  { id: 'lq3', question: 'Which language do they speak in Brazil?', options: ['Spanish', 'French', 'Portuguese', 'English'], correct: 2, category: 'language' },
  { id: 'lq4', question: '"Ciao" in Italian can mean...', options: ['Only hello', 'Only goodbye', 'Both hello and goodbye', 'Thank you'], correct: 2, category: 'language' },
  { id: 'lq5', question: 'What does "Merci" mean in French?', options: ['Sorry', 'Thank you', 'Hello', 'Excuse me'], correct: 1, category: 'language' },
  { id: 'lq6', question: 'How do you say "yes" in German?', options: ['Nein', 'Oui', 'Ja', 'Sí'], correct: 2, category: 'language' },
  { id: 'lq7', question: '"Annyeonghaseyo" is a greeting in which language?', options: ['Chinese', 'Korean', 'Thai', 'Vietnamese'], correct: 1, category: 'language' },
  { id: 'lq8', question: 'What does "Namaste" mean in Hindi?', options: ['Goodbye forever', 'I bow to you', 'Good morning', 'Nice weather'], correct: 1, category: 'language' },
  { id: 'lq9', question: '"Gracias" means "thank you" in which language?', options: ['Italian', 'Portuguese', 'Spanish', 'French'], correct: 2, category: 'language' },
  { id: 'lq10', question: 'How do you say "please" in French?', options: ['Pardon', 'S\'il vous plaît', 'Merci', 'Excusez-moi'], correct: 1, category: 'language' },

  // GEOGRAPHY (10)
  { id: 'gq1', question: 'Which country is famous for sushi?', options: ['Italy', 'Mexico', 'Japan', 'Brazil'], correct: 2, category: 'geography' },
  { id: 'gq2', question: 'The Eiffel Tower is in which city?', options: ['London', 'Paris', 'Rome', 'Tokyo'], correct: 1, category: 'geography' },
  { id: 'gq3', question: 'Which is the largest continent?', options: ['Africa', 'Europe', 'Asia', 'North America'], correct: 2, category: 'geography' },
  { id: 'gq4', question: 'The Great Barrier Reef is near which country?', options: ['Brazil', 'Australia', 'Japan', 'South Africa'], correct: 1, category: 'geography' },
  { id: 'gq5', question: 'Which river flows through Egypt?', options: ['Amazon', 'Danube', 'Nile', 'Yangtze'], correct: 2, category: 'geography' },
  { id: 'gq6', question: 'Mount Fuji is in which country?', options: ['China', 'Korea', 'Japan', 'Nepal'], correct: 2, category: 'geography' },
  { id: 'gq7', question: 'Which country has the most people?', options: ['USA', 'India', 'Brazil', 'Russia'], correct: 1, category: 'geography' },
  { id: 'gq8', question: 'The Sahara Desert is on which continent?', options: ['Asia', 'Australia', 'Africa', 'South America'], correct: 2, category: 'geography' },
  { id: 'gq9', question: 'Big Ben is a landmark in which city?', options: ['New York', 'London', 'Sydney', 'Dublin'], correct: 1, category: 'geography' },
  { id: 'gq10', question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, category: 'geography' },

  // CULTURE (10)
  { id: 'cq1', question: 'Diwali, the Festival of Lights, is celebrated in which country?', options: ['Japan', 'India', 'Brazil', 'Mexico'], correct: 1, category: 'culture' },
  { id: 'cq2', question: 'What is origami?', options: ['Japanese cooking', 'Paper folding art', 'A martial art', 'A dance'], correct: 1, category: 'culture' },
  { id: 'cq3', question: 'Flamenco dancing comes from which country?', options: ['Italy', 'Argentina', 'Spain', 'Portugal'], correct: 2, category: 'culture' },
  { id: 'cq4', question: 'What do people celebrate during Carnival in Brazil?', options: ['Harvest', 'New Year', 'Music, dance & costumes', 'The moon'], correct: 2, category: 'culture' },
  { id: 'cq5', question: 'Hanami is the Japanese tradition of viewing what?', options: ['Fireworks', 'Cherry blossoms', 'Stars', 'Mountains'], correct: 1, category: 'culture' },
  { id: 'cq6', question: 'The Chinese New Year animal cycle has how many animals?', options: ['8', '10', '12', '14'], correct: 2, category: 'culture' },
  { id: 'cq7', question: 'What is a piñata traditionally filled with?', options: ['Water', 'Sand', 'Candy and treats', 'Flowers'], correct: 2, category: 'culture' },
  { id: 'cq8', question: 'Holi, the festival of colors, is from which country?', options: ['Thailand', 'Egypt', 'India', 'Morocco'], correct: 2, category: 'culture' },
  { id: 'cq9', question: 'A kimono is a traditional garment from which country?', options: ['China', 'Korea', 'Japan', 'Vietnam'], correct: 2, category: 'culture' },
  { id: 'cq10', question: 'Día de los Muertos (Day of the Dead) is celebrated in...', options: ['Spain', 'Mexico', 'Brazil', 'Peru'], correct: 1, category: 'culture' },

  // HISTORY (10)
  { id: 'hq1', question: 'The Pyramids of Giza are in which country?', options: ['Iraq', 'Egypt', 'Greece', 'Turkey'], correct: 1, category: 'history' },
  { id: 'hq2', question: 'The Great Wall was built to protect which country?', options: ['Japan', 'India', 'China', 'Mongolia'], correct: 2, category: 'history' },
  { id: 'hq3', question: 'The Colosseum is an ancient arena in which city?', options: ['Athens', 'Rome', 'Cairo', 'Istanbul'], correct: 1, category: 'history' },
  { id: 'hq4', question: 'Vikings originally came from which region?', options: ['Britain', 'Scandinavia', 'Russia', 'Germany'], correct: 1, category: 'history' },
  { id: 'hq5', question: 'Machu Picchu was built by which civilization?', options: ['Maya', 'Aztec', 'Inca', 'Olmec'], correct: 2, category: 'history' },
  { id: 'hq6', question: 'The Sphinx has the body of a lion and the head of a...', options: ['Dog', 'Bird', 'Human', 'Cat'], correct: 2, category: 'history' },
  { id: 'hq7', question: 'Samurai warriors lived in which country?', options: ['China', 'Japan', 'Korea', 'Thailand'], correct: 1, category: 'history' },
  { id: 'hq8', question: 'The ancient Olympics were first held in which country?', options: ['Italy', 'Egypt', 'Greece', 'Turkey'], correct: 2, category: 'history' },
  { id: 'hq9', question: 'Hieroglyphics were a writing system from which civilization?', options: ['Roman', 'Greek', 'Egyptian', 'Chinese'], correct: 2, category: 'history' },
  { id: 'hq10', question: 'Stonehenge is located in which country?', options: ['France', 'England', 'Ireland', 'Scotland'], correct: 1, category: 'history' },

  // ETIQUETTE (10)
  { id: 'eq1', question: 'In Japan, you should remove your shoes before entering a...', options: ['Restaurant', 'Home', 'Store', 'Park'], correct: 1, category: 'etiquette' },
  { id: 'eq2', question: 'In many Asian countries, it\'s polite to use which hand to eat?', options: ['Left', 'Right', 'Either one', 'Neither'], correct: 1, category: 'etiquette' },
  { id: 'eq3', question: 'In France, how many kisses on the cheek is a common greeting?', options: ['One', 'Two', 'Three', 'Four'], correct: 1, category: 'etiquette' },
  { id: 'eq4', question: 'Tipping 15-20% is expected in restaurants in which country?', options: ['Japan', 'France', 'USA', 'Australia'], correct: 2, category: 'etiquette' },
  { id: 'eq5', question: 'In Thailand, the head is considered...', options: ['Unimportant', 'Sacred', 'Lucky', 'Strong'], correct: 1, category: 'etiquette' },
  { id: 'eq6', question: 'Bowing is a common greeting in which country?', options: ['Brazil', 'France', 'Japan', 'Canada'], correct: 2, category: 'etiquette' },
  { id: 'eq7', question: 'In India, eating with your left hand is considered...', options: ['Normal', 'Polite', 'Rude', 'Lucky'], correct: 2, category: 'etiquette' },
  { id: 'eq8', question: 'Slurping noodles in Japan is considered...', options: ['Very rude', 'A compliment', 'Funny', 'Strange'], correct: 1, category: 'etiquette' },
  { id: 'eq9', question: 'In the UK, queuing (lining up) is taken very...', options: ['Casually', 'Seriously', 'As a joke', 'Differently'], correct: 1, category: 'etiquette' },
  { id: 'eq10', question: 'In which country should you NEVER stick chopsticks upright in rice?', options: ['China', 'Japan', 'Both', 'Neither'], correct: 2, category: 'etiquette' },

  // SLANG (10)
  { id: 'sq1', question: '"C\'est la vie" is a French expression meaning...', options: ['That\'s too bad', 'That\'s life', 'Let\'s go', 'How beautiful'], correct: 1, category: 'slang' },
  { id: 'sq2', question: '"No worries" is a casual phrase from which country?', options: ['USA', 'Canada', 'Australia', 'UK'], correct: 2, category: 'slang' },
  { id: 'sq3', question: '"Mate" is a friendly word for "friend" in...', options: ['France', 'Japan', 'Australia & UK', 'Brazil'], correct: 2, category: 'slang' },
  { id: 'sq4', question: '"Kawaii" in Japanese means...', options: ['Scary', 'Cute', 'Delicious', 'Big'], correct: 1, category: 'slang' },
  { id: 'sq5', question: '"Hygge" is a Danish word about...', options: ['Cooking', 'Cozy comfort', 'Exercise', 'Travel'], correct: 1, category: 'slang' },
  { id: 'sq6', question: '"Saudade" is a Portuguese word for...', options: ['Happiness', 'Deep longing/nostalgia', 'Anger', 'Excitement'], correct: 1, category: 'slang' },
  { id: 'sq7', question: '"Bon appétit" means...', options: ['Good morning', 'Enjoy your meal', 'Welcome', 'Cheers'], correct: 1, category: 'slang' },
  { id: 'sq8', question: '"Fiesta" in Spanish means...', options: ['Nap', 'Party/festival', 'Food', 'Friends'], correct: 1, category: 'slang' },
  { id: 'sq9', question: '"Wanderlust" is a German word meaning...', options: ['Homesick', 'Love of travel', 'Love of food', 'Fear of heights'], correct: 1, category: 'slang' },
  { id: 'sq10', question: '"Aloha" in Hawaiian can mean...', options: ['Only hello', 'Only goodbye', 'Hello, goodbye, and love', 'Food'], correct: 2, category: 'slang' },
];

export function getQuizByCategory(category: string, count: number = 10): QuizQuestion[] {
  const pool = ALL_QUIZ_QUESTIONS.filter(q => q.category === category);
  return shuffleArray(pool).slice(0, count);
}

export function getRandomQuiz(count: number = 10): QuizQuestion[] {
  return shuffleArray([...ALL_QUIZ_QUESTIONS]).slice(0, count);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── FLASHCARD DECKS ───

export const ALL_FLASHCARDS: FlashcardItem[] = [
  // Greetings (10)
  { id: 'fg1', front: 'Bonjour', back: 'Hello / Good day (French)', emoji: '🇫🇷', deck: 'greetings' },
  { id: 'fg2', front: 'Konnichiwa', back: 'Hello (Japanese)', emoji: '🇯🇵', deck: 'greetings' },
  { id: 'fg3', front: 'Hola', back: 'Hello (Spanish)', emoji: '🇪🇸', deck: 'greetings' },
  { id: 'fg4', front: 'Ciao', back: 'Hello / Goodbye (Italian)', emoji: '🇮🇹', deck: 'greetings' },
  { id: 'fg5', front: 'Olá', back: 'Hello (Portuguese)', emoji: '🇧🇷', deck: 'greetings' },
  { id: 'fg6', front: 'Namaste', back: 'Hello / I bow to you (Hindi)', emoji: '🇮🇳', deck: 'greetings' },
  { id: 'fg7', front: 'Annyeonghaseyo', back: 'Hello (Korean)', emoji: '🇰🇷', deck: 'greetings' },
  { id: 'fg8', front: 'Hej', back: 'Hello (Swedish / Danish)', emoji: '🇸🇪', deck: 'greetings' },
  { id: 'fg9', front: 'Merhaba', back: 'Hello (Turkish)', emoji: '🇹🇷', deck: 'greetings' },
  { id: 'fg10', front: 'Sawadee', back: 'Hello (Thai)', emoji: '🇹🇭', deck: 'greetings' },

  // Food (10)
  { id: 'ff1', front: 'Sushi', back: 'Vinegared rice with toppings (Japan)', emoji: '🍣', deck: 'food' },
  { id: 'ff2', front: 'Croissant', back: 'Buttery crescent-shaped pastry (France)', emoji: '🥐', deck: 'food' },
  { id: 'ff3', front: 'Taco', back: 'Folded tortilla with fillings (Mexico)', emoji: '🌮', deck: 'food' },
  { id: 'ff4', front: 'Pasta', back: 'Wheat dough in many shapes (Italy)', emoji: '🍝', deck: 'food' },
  { id: 'ff5', front: 'Kimchi', back: 'Fermented spicy vegetables (Korea)', emoji: '🥬', deck: 'food' },
  { id: 'ff6', front: 'Pho', back: 'Aromatic noodle soup (Vietnam)', emoji: '🍜', deck: 'food' },
  { id: 'ff7', front: 'Falafel', back: 'Fried chickpea balls (Middle East)', emoji: '🧆', deck: 'food' },
  { id: 'ff8', front: 'Dim Sum', back: 'Small steamed dishes (China)', emoji: '🥟', deck: 'food' },
  { id: 'ff9', front: 'Paella', back: 'Saffron rice with seafood (Spain)', emoji: '🥘', deck: 'food' },
  { id: 'ff10', front: 'Pierogi', back: 'Stuffed dumplings (Poland)', emoji: '🥟', deck: 'food' },

  // Landmarks (8)
  { id: 'fl1', front: 'Eiffel Tower', back: 'Iconic iron tower in Paris, France', emoji: '🗼', deck: 'landmarks' },
  { id: 'fl2', front: 'Great Wall', back: 'Ancient wall stretching 13,000+ miles (China)', emoji: '🏯', deck: 'landmarks' },
  { id: 'fl3', front: 'Colosseum', back: 'Ancient amphitheater in Rome, Italy', emoji: '🏟️', deck: 'landmarks' },
  { id: 'fl4', front: 'Machu Picchu', back: 'Inca citadel high in the Andes, Peru', emoji: '🏔️', deck: 'landmarks' },
  { id: 'fl5', front: 'Taj Mahal', back: 'White marble mausoleum in India', emoji: '🕌', deck: 'landmarks' },
  { id: 'fl6', front: 'Pyramids of Giza', back: 'Ancient tombs of pharaohs in Egypt', emoji: '🔺', deck: 'landmarks' },
  { id: 'fl7', front: 'Big Ben', back: 'Famous clock tower in London, England', emoji: '🕐', deck: 'landmarks' },
  { id: 'fl8', front: 'Statue of Liberty', back: 'Gift from France, stands in New York', emoji: '🗽', deck: 'landmarks' },

  // Fun Expressions (8)
  { id: 'fe1', front: 'C\'est la vie', back: 'That\'s life (French)', emoji: '🤷', deck: 'expressions' },
  { id: 'fe2', front: 'Kawaii', back: 'Cute / adorable (Japanese)', emoji: '🥰', deck: 'expressions' },
  { id: 'fe3', front: 'Hygge', back: 'Cozy comfort & togetherness (Danish)', emoji: '🕯️', deck: 'expressions' },
  { id: 'fe4', front: 'Wanderlust', back: 'Strong desire to travel (German)', emoji: '✈️', deck: 'expressions' },
  { id: 'fe5', front: 'Bon appétit', back: 'Enjoy your meal! (French)', emoji: '👨‍🍳', deck: 'expressions' },
  { id: 'fe6', front: 'Saudade', back: 'Deep longing & nostalgia (Portuguese)', emoji: '💭', deck: 'expressions' },
  { id: 'fe7', front: 'Fiesta', back: 'Party or celebration (Spanish)', emoji: '🎉', deck: 'expressions' },
  { id: 'fe8', front: 'Aloha', back: 'Hello, goodbye & love (Hawaiian)', emoji: '🌺', deck: 'expressions' },
];

export const FLASHCARD_DECKS = [
  { id: 'greetings', title: 'World Greetings', emoji: '👋', count: 10 },
  { id: 'food', title: 'World Foods', emoji: '🍜', count: 10 },
  { id: 'landmarks', title: 'Famous Landmarks', emoji: '🗼', count: 8 },
  { id: 'expressions', title: 'Fun Expressions', emoji: '💬', count: 8 },
];

export function getFlashcardDeck(deckId: string): FlashcardItem[] {
  return shuffleArray(ALL_FLASHCARDS.filter(f => f.deck === deckId));
}

export function getAllFlashcardsMixed(count: number = 15): FlashcardItem[] {
  return shuffleArray([...ALL_FLASHCARDS]).slice(0, count);
}

// ─── LESSON CONTENT (all 17 lessons) ───

export const LESSON_CONTENT: Record<string, LessonData> = {
  lang1: {
    title: 'Greetings & Hello',
    slides: [
      { text: 'Hello! In many languages, the greeting changes based on the time of day.', emoji: '👋' },
      { text: '"Bonjour" means good day in French. Use it from morning to evening!', emoji: '🇫🇷' },
      { text: '"Konnichiwa" is hello in Japanese. It literally means "this day is..."', emoji: '🇯🇵' },
      { text: '"Hola" is hello in Spanish — simple, warm, and used everywhere!', emoji: '🇪🇸' },
      { text: '"Namaste" in Hindi means "I bow to you" — a beautiful, respectful greeting.', emoji: '🇮🇳' },
      { text: 'Great job! You learned 4 new greetings. Try using one today!', emoji: '⭐' },
    ],
  },
  lang2: {
    title: 'Ordering Food',
    slides: [
      { text: 'Hungry? Let\'s learn how to order food around the world!', emoji: '🍽️' },
      { text: 'In France, say "Je voudrais..." (I would like...) to be polite.', emoji: '🇫🇷' },
      { text: 'In Japan, point at the menu and say "Kore o kudasai" (This one, please).', emoji: '🇯🇵' },
      { text: '"La cuenta, por favor" means "The check, please" in Spanish.', emoji: '🇪🇸' },
      { text: 'In Italy, say "Vorrei..." (I\'d like...) — they love when tourists try!', emoji: '🇮🇹' },
    ],
  },
  lang3: {
    title: 'Asking for Directions',
    slides: [
      { text: 'Lost? No worries — let\'s learn to ask for directions!', emoji: '🗺️' },
      { text: '"Où est...?" means "Where is...?" in French. Add any place after it!', emoji: '🇫🇷' },
      { text: '"Sumimasen, ... wa doko desu ka?" means "Excuse me, where is...?" in Japanese.', emoji: '🇯🇵' },
      { text: '"¿Dónde está...?" is "Where is...?" in Spanish.', emoji: '🇪🇸' },
      { text: 'Pointing at a map and smiling is universal — and always works!', emoji: '📍' },
    ],
  },
  lang4: {
    title: 'Saying Thank You',
    slides: [
      { text: 'Gratitude is universal! Let\'s learn to say "thank you" around the world.', emoji: '🙏' },
      { text: '"Merci" (mair-SEE) is thank you in French. Add "beaucoup" for "very much!"', emoji: '🇫🇷' },
      { text: '"Arigatou gozaimasu" is the polite way to say thanks in Japanese.', emoji: '🇯🇵' },
      { text: '"Gracias" is thank you in Spanish. "Muchas gracias" means many thanks!', emoji: '🇪🇸' },
      { text: '"Danke" in German, "Obrigado/a" in Portuguese, "Xièxiè" in Chinese!', emoji: '🌍' },
      { text: 'Saying thanks in the local language always makes people smile!', emoji: '😊' },
    ],
  },
  slang1: {
    title: 'Common Expressions',
    slides: [
      { text: 'Every language has fun everyday expressions! Let\'s learn some.', emoji: '💬' },
      { text: '"C\'est la vie" — That\'s life! A classic French way of accepting things.', emoji: '🇫🇷' },
      { text: '"No worries" is Australian for "it\'s all good, mate!"', emoji: '🇦🇺' },
      { text: '"Kawaii!" means "cute!" in Japanese — you\'ll hear it everywhere!', emoji: '🇯🇵' },
      { text: '"Fiesta!" means party in Spanish — because every day could be a celebration!', emoji: '🇪🇸' },
    ],
  },
  slang2: {
    title: 'Unique Untranslatable Words',
    slides: [
      { text: 'Some words exist in only one language — and they\'re magical!', emoji: '✨' },
      { text: '"Hygge" (HOO-gah) is Danish for cozy comfort and being with friends.', emoji: '🇩🇰' },
      { text: '"Saudade" is Portuguese for a deep, beautiful longing for something.', emoji: '🇧🇷' },
      { text: '"Wabi-sabi" is Japanese for finding beauty in imperfection.', emoji: '🇯🇵' },
      { text: '"Wanderlust" is German for the irresistible desire to travel!', emoji: '🇩🇪' },
      { text: 'These words show that every culture sees the world uniquely!', emoji: '🌈' },
    ],
  },
  slang3: {
    title: 'Funny False Friends',
    slides: [
      { text: '"False friends" are words that look the same but mean totally different things!', emoji: '😂' },
      { text: '"Gift" means poison in German — not the best birthday surprise!', emoji: '🇩🇪' },
      { text: '"Embarazada" in Spanish means pregnant, NOT embarrassed!', emoji: '🇪🇸' },
      { text: '"Bras" means arm in French — not what you think!', emoji: '🇫🇷' },
      { text: 'These mix-ups are why learning languages is so funny and important!', emoji: '📚' },
    ],
  },
  cult1: {
    title: 'Festival Traditions',
    slides: [
      { text: 'Festivals are celebrations of culture, food, and togetherness!', emoji: '🎉' },
      { text: 'Diwali, the Festival of Lights, lights up India with lamps and fireworks.', emoji: '🪔' },
      { text: 'Carnival in Brazil features samba dancing, wild costumes, and parades!', emoji: '🎭' },
      { text: 'Hanami in Japan is the tradition of having picnics under cherry blossoms.', emoji: '🌸' },
      { text: 'Día de los Muertos in Mexico honors loved ones with beautiful altars.', emoji: '💀' },
      { text: 'Every festival tells a unique story about its people and their values.', emoji: '🌍' },
    ],
  },
  cult2: {
    title: 'Music Around the World',
    slides: [
      { text: 'Music is a language everyone speaks! Let\'s explore world music.', emoji: '🎵' },
      { text: 'Flamenco from Spain features passionate guitar and stomping dance.', emoji: '🇪🇸' },
      { text: 'Taiko drums from Japan are massive and their beats shake the ground!', emoji: '🥁' },
      { text: 'Samba from Brazil makes everyone want to move their feet!', emoji: '🇧🇷' },
      { text: 'Reggae from Jamaica spreads messages of peace and love worldwide.', emoji: '🇯🇲' },
      { text: 'K-Pop from South Korea has fans dancing on every continent!', emoji: '🇰🇷' },
    ],
  },
  cult3: {
    title: 'Traditional Clothing',
    slides: [
      { text: 'Traditional clothes tell stories about a culture\'s history and values!', emoji: '👘' },
      { text: 'The Japanese kimono is wrapped left over right and tied with an obi belt.', emoji: '🇯🇵' },
      { text: 'India\'s sari is one long cloth that can be draped in over 80 different ways!', emoji: '🇮🇳' },
      { text: 'The Scottish kilt is a knee-length skirt with a tartan pattern.', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { text: 'Mexican huipils are colorful embroidered tunics that represent local identity.', emoji: '🇲🇽' },
    ],
  },
  hist1: {
    title: 'Ancient Wonders',
    slides: [
      { text: 'The ancient world built things that still amaze us today!', emoji: '🏛️' },
      { text: 'The Pyramids of Giza are over 4,500 years old and almost perfectly aligned.', emoji: '🔺' },
      { text: 'The Great Wall of China stretches over 13,000 miles across mountains!', emoji: '🇨🇳' },
      { text: 'The Colosseum in Rome could hold 50,000 spectators!', emoji: '🇮🇹' },
      { text: 'Machu Picchu was hidden in the clouds for centuries until 1911.', emoji: '🏔️' },
      { text: 'These wonders prove that humans have always dreamed big!', emoji: '⭐' },
    ],
  },
  hist2: {
    title: 'Famous Explorers',
    slides: [
      { text: 'Throughout history, brave explorers set out into the unknown!', emoji: '🧭' },
      { text: 'Marco Polo traveled from Italy to China in the 1200s — a 24-year journey!', emoji: '🇮🇹' },
      { text: 'Ibn Battuta from Morocco traveled 75,000 miles across Africa and Asia!', emoji: '🇲🇦' },
      { text: 'Zheng He commanded huge Chinese treasure fleets across the Indian Ocean.', emoji: '🇨🇳' },
      { text: 'Sacagawea helped guide Lewis & Clark across North America.', emoji: '🗺️' },
      { text: 'YOU are an explorer too — discovering the world one lesson at a time!', emoji: '🌟' },
    ],
  },
  etiq1: {
    title: 'Table Manners Worldwide',
    slides: [
      { text: 'Table manners are different everywhere — let\'s learn what\'s polite!', emoji: '🍽️' },
      { text: 'In Japan, slurping noodles is a compliment to the chef!', emoji: '🇯🇵' },
      { text: 'In France, keep both hands visible on the table (not in your lap).', emoji: '🇫🇷' },
      { text: 'In India, always eat with your right hand — the left is considered rude.', emoji: '🇮🇳' },
      { text: 'In China, never stick chopsticks straight up in your rice bowl.', emoji: '🇨🇳' },
      { text: 'Knowing these customs shows respect for the culture you\'re visiting!', emoji: '🌏' },
    ],
  },
  etiq2: {
    title: 'Greeting Customs',
    slides: [
      { text: 'How you say hello changes around the world!', emoji: '🤝' },
      { text: 'In Japan, bow to show respect — the deeper the bow, the more respect.', emoji: '🇯🇵' },
      { text: 'In France, friends greet with "la bise" — kisses on alternating cheeks.', emoji: '🇫🇷' },
      { text: 'In Thailand, press your palms together and bow — called a "wai."', emoji: '🇹🇭' },
      { text: 'In New Zealand, the Māori hongi presses foreheads and noses together.', emoji: '🇳🇿' },
      { text: 'Every greeting style has a beautiful meaning behind it!', emoji: '💫' },
    ],
  },
  geo1: {
    title: 'Continents & Oceans',
    slides: [
      { text: 'Our planet has 7 continents and 5 oceans — let\'s explore them!', emoji: '🌍' },
      { text: 'Asia is the largest continent — home to over 4 billion people!', emoji: '🌏' },
      { text: 'Africa has the most countries (54!) and the Sahara, the biggest hot desert.', emoji: '🏜️' },
      { text: 'The Pacific Ocean is bigger than ALL the land on Earth combined!', emoji: '🌊' },
      { text: 'Antarctica is the coldest continent — penguins love it, but few people live there!', emoji: '🐧' },
      { text: 'Every corner of our planet has something amazing to discover!', emoji: '✨' },
    ],
  },
  geo2: {
    title: 'Amazing Natural Wonders',
    slides: [
      { text: 'Nature creates the most incredible sights on Earth!', emoji: '🌋' },
      { text: 'The Grand Canyon is so deep, it took the Colorado River 6 million years to carve!', emoji: '🏜️' },
      { text: 'The Northern Lights (Aurora Borealis) paint the sky with dancing colors.', emoji: '🌌' },
      { text: 'The Great Barrier Reef is the largest living structure — visible from space!', emoji: '🐠' },
      { text: 'Victoria Falls on the Zambia-Zimbabwe border is called "the smoke that thunders."', emoji: '💨' },
      { text: 'Mount Everest grows about 4mm taller every year!', emoji: '🏔️' },
    ],
  },
};
