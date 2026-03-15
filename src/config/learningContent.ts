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
  icon: string;
  deck: string;
}

export interface LessonSlide {
  text: string;
  icon: string;
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

  // NEW COUNTRY QUESTIONS (40)
  { id: 'nkr1', question: 'Kimchi is a famous fermented food from which country?', options: ['Japan', 'South Korea', 'China', 'Thailand'], correct: 1, category: 'culture' },
  { id: 'nkr2', question: 'What is the traditional Korean dress called?', options: ['Kimono', 'Sari', 'Hanbok', 'Ao dai'], correct: 2, category: 'culture' },
  { id: 'nkr3', question: 'K-pop music comes from which country?', options: ['Japan', 'China', 'Thailand', 'South Korea'], correct: 3, category: 'culture' },
  { id: 'nkr4', question: 'Which Korean martial art is an Olympic sport?', options: ['Karate', 'Judo', 'Taekwondo', 'Kung fu'], correct: 2, category: 'culture' },
  { id: 'nkr5', question: 'Bibimbap is a Korean dish served in a...', options: ['Tortilla', 'Bowl', 'Baguette', 'Crepe'], correct: 1, category: 'geography' },

  { id: 'nth1', question: 'Thailand has over 40,000 Buddhist...', options: ['Schools', 'Statues', 'Temples', 'Bridges'], correct: 2, category: 'geography' },
  { id: 'nth2', question: 'Songkran is the Thai New Year festival celebrated with...', options: ['Fire', 'Water', 'Flowers', 'Kites'], correct: 1, category: 'culture' },
  { id: 'nth3', question: 'What is the national animal of Thailand?', options: ['Tiger', 'Elephant', 'Panda', 'Dragon'], correct: 1, category: 'geography' },
  { id: 'nth4', question: 'Pad Thai is a dish made with stir-fried...', options: ['Rice', 'Bread', 'Noodles', 'Potatoes'], correct: 2, category: 'culture' },
  { id: 'nth5', question: 'Muay Thai is also known as...', options: ['Thai cooking', 'Thai boxing', 'Thai dancing', 'Thai singing'], correct: 1, category: 'culture' },

  { id: 'nma1', question: 'Moroccan medinas are famous old walled...', options: ['Castles', 'Cities', 'Gardens', 'Temples'], correct: 1, category: 'geography' },
  { id: 'nma2', question: 'Morocco is partly covered by which desert?', options: ['Gobi', 'Kalahari', 'Sahara', 'Atacama'], correct: 2, category: 'geography' },
  { id: 'nma3', question: 'A tagine is a Moroccan...', options: ['Dance', 'Clay cooking pot', 'Musical instrument', 'Hat'], correct: 1, category: 'culture' },
  { id: 'nma4', question: 'Moroccan mint tea is poured from...', options: ['Very low', 'Very high up', 'Behind the back', 'Sitting down'], correct: 1, category: 'culture' },
  { id: 'nma5', question: 'Zellige is a Moroccan art of making...', options: ['Music', 'Tile mosaics', 'Carpets', 'Pottery'], correct: 1, category: 'culture' },

  { id: 'npe1', question: 'Machu Picchu was built by which civilization?', options: ['Maya', 'Aztec', 'Inca', 'Roman'], correct: 2, category: 'history' },
  { id: 'npe2', question: 'Peru is home to which mountain range?', options: ['Alps', 'Himalayas', 'Rockies', 'Andes'], correct: 3, category: 'geography' },
  { id: 'npe3', question: 'Ceviche is Peru\'s national dish made with...', options: ['Cooked beef', 'Raw fish and lime', 'Fried chicken', 'Baked potatoes'], correct: 1, category: 'culture' },
  { id: 'npe4', question: 'Quipus were knotted strings used by the Inca for...', options: ['Fishing', 'Record keeping', 'Decoration', 'Music'], correct: 1, category: 'history' },
  { id: 'npe5', question: 'Peru is the birthplace of which common vegetable?', options: ['Carrot', 'Tomato', 'Potato', 'Onion'], correct: 2, category: 'geography' },

  { id: 'nke1', question: 'The Great Migration happens in Kenya\'s...', options: ['Sahara', 'Amazon', 'Maasai Mara', 'Serengeti only'], correct: 2, category: 'geography' },
  { id: 'nke2', question: 'The Maasai people are known for wearing which color?', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 2, category: 'culture' },
  { id: 'nke3', question: 'Kenya grows some of the world\'s best...', options: ['Rice', 'Coffee', 'Wheat', 'Corn'], correct: 1, category: 'geography' },
  { id: 'nke4', question: 'Kenyan runners are famous for winning...', options: ['Sprints', 'Swimming', 'Long-distance races', 'Cycling'], correct: 2, category: 'culture' },
  { id: 'nke5', question: 'Ugali is a Kenyan staple food made from...', options: ['Rice', 'Wheat', 'Maize flour', 'Potatoes'], correct: 2, category: 'culture' },

  { id: 'nno1', question: 'Norway\'s fjords were carved by...', options: ['Rivers', 'Earthquakes', 'Glaciers', 'Wind'], correct: 2, category: 'geography' },
  { id: 'nno2', question: 'Vikings originally came from Scandinavia, including...', options: ['Spain', 'Norway', 'Italy', 'Greece'], correct: 1, category: 'history' },
  { id: 'nno3', question: 'The northern lights are also called the aurora...', options: ['Australis', 'Borealis', 'Solaris', 'Lunaris'], correct: 1, category: 'geography' },
  { id: 'nno4', question: 'In Norwegian folklore, trolls turn to stone in...', options: ['Rain', 'Moonlight', 'Sunlight', 'Snow'], correct: 2, category: 'culture' },
  { id: 'nno5', question: '"Friluftsliv" is a Norwegian word meaning...', options: ['Cooking together', 'Open-air living', 'Ice fishing', 'Mountain climbing'], correct: 1, category: 'culture' },

  { id: 'ntr1', question: 'Istanbul\'s Grand Bazaar has over how many shops?', options: ['400', '1,000', '4,000', '10,000'], correct: 2, category: 'geography' },
  { id: 'ntr2', question: 'Istanbul sits on which two continents?', options: ['Asia and Africa', 'Europe and Asia', 'Europe and Africa', 'Asia and Australia'], correct: 1, category: 'geography' },
  { id: 'ntr3', question: 'Turkish delight (lokum) is a type of...', options: ['Bread', 'Cheese', 'Candy', 'Soup'], correct: 2, category: 'culture' },
  { id: 'ntr4', question: 'Cappadocia is famous for its hot air balloons and...', options: ['Beaches', 'Fairy chimneys', 'Waterfalls', 'Forests'], correct: 1, category: 'geography' },
  { id: 'ntr5', question: 'A Turkish hammam is a traditional...', options: ['Kitchen', 'Bathhouse', 'School', 'Market'], correct: 1, category: 'culture' },

  { id: 'ngr1', question: 'Ancient Greeks believed the gods lived on Mount...', options: ['Everest', 'Fuji', 'Olympus', 'Sinai'], correct: 2, category: 'culture' },
  { id: 'ngr2', question: 'Greece has about how many islands?', options: ['100', '600', '2,000', '6,000'], correct: 3, category: 'geography' },
  { id: 'ngr3', question: 'The ancient Olympics were first held in...', options: ['Athens', 'Sparta', 'Olympia', 'Corinth'], correct: 2, category: 'history' },
  { id: 'ngr4', question: 'Greek gyros are wrapped in...', options: ['Tortilla', 'Naan', 'Pita bread', 'Rice paper'], correct: 2, category: 'culture' },
  { id: 'ngr5', question: 'The word "philosophy" comes from Greek and means...', options: ['Love of food', 'Love of wisdom', 'Love of sports', 'Love of music'], correct: 1, category: 'culture' },
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
  { id: 'fg1', front: 'Bonjour', back: 'Hello / Good day (French)', icon: '', deck: 'greetings' },
  { id: 'fg2', front: 'Konnichiwa', back: 'Hello (Japanese)', icon: '', deck: 'greetings' },
  { id: 'fg3', front: 'Hola', back: 'Hello (Spanish)', icon: '', deck: 'greetings' },
  { id: 'fg4', front: 'Ciao', back: 'Hello / Goodbye (Italian)', icon: '', deck: 'greetings' },
  { id: 'fg5', front: 'Olá', back: 'Hello (Portuguese)', icon: '', deck: 'greetings' },
  { id: 'fg6', front: 'Namaste', back: 'Hello / I bow to you (Hindi)', icon: '', deck: 'greetings' },
  { id: 'fg7', front: 'Annyeonghaseyo', back: 'Hello (Korean)', icon: '', deck: 'greetings' },
  { id: 'fg8', front: 'Hej', back: 'Hello (Swedish / Danish)', icon: '', deck: 'greetings' },
  { id: 'fg9', front: 'Merhaba', back: 'Hello (Turkish)', icon: '', deck: 'greetings' },
  { id: 'fg10', front: 'Sawadee', back: 'Hello (Thai)', icon: '', deck: 'greetings' },

  // Food (10)
  { id: 'ff1', front: 'Sushi', back: 'Vinegared rice with toppings (Japan)', icon: '', deck: 'food' },
  { id: 'ff2', front: 'Croissant', back: 'Buttery crescent-shaped pastry (France)', icon: '', deck: 'food' },
  { id: 'ff3', front: 'Taco', back: 'Folded tortilla with fillings (Mexico)', icon: '', deck: 'food' },
  { id: 'ff4', front: 'Pasta', back: 'Wheat dough in many shapes (Italy)', icon: '', deck: 'food' },
  { id: 'ff5', front: 'Kimchi', back: 'Fermented spicy vegetables (Korea)', icon: '', deck: 'food' },
  { id: 'ff6', front: 'Pho', back: 'Aromatic noodle soup (Vietnam)', icon: '', deck: 'food' },
  { id: 'ff7', front: 'Falafel', back: 'Fried chickpea balls (Middle East)', icon: '', deck: 'food' },
  { id: 'ff8', front: 'Dim Sum', back: 'Small steamed dishes (China)', icon: '', deck: 'food' },
  { id: 'ff9', front: 'Paella', back: 'Saffron rice with seafood (Spain)', icon: '', deck: 'food' },
  { id: 'ff10', front: 'Pierogi', back: 'Stuffed dumplings (Poland)', icon: '', deck: 'food' },

  // Landmarks (8)
  { id: 'fl1', front: 'Eiffel Tower', back: 'Iconic iron tower in Paris, France', icon: '', deck: 'landmarks' },
  { id: 'fl2', front: 'Great Wall', back: 'Ancient wall stretching 13,000+ miles (China)', icon: '', deck: 'landmarks' },
  { id: 'fl3', front: 'Colosseum', back: 'Ancient amphitheater in Rome, Italy', icon: '', deck: 'landmarks' },
  { id: 'fl4', front: 'Machu Picchu', back: 'Inca citadel high in the Andes, Peru', icon: '', deck: 'landmarks' },
  { id: 'fl5', front: 'Taj Mahal', back: 'White marble mausoleum in India', icon: '', deck: 'landmarks' },
  { id: 'fl6', front: 'Pyramids of Giza', back: 'Ancient tombs of pharaohs in Egypt', icon: '', deck: 'landmarks' },
  { id: 'fl7', front: 'Big Ben', back: 'Famous clock tower in London, England', icon: '', deck: 'landmarks' },
  { id: 'fl8', front: 'Statue of Liberty', back: 'Gift from France, stands in New York', icon: '', deck: 'landmarks' },

  // Fun Expressions (8)
  { id: 'fe1', front: 'C\'est la vie', back: 'That\'s life (French)', icon: '', deck: 'expressions' },
  { id: 'fe2', front: 'Kawaii', back: 'Cute / adorable (Japanese)', icon: '', deck: 'expressions' },
  { id: 'fe3', front: 'Hygge', back: 'Cozy comfort & togetherness (Danish)', icon: '', deck: 'expressions' },
  { id: 'fe4', front: 'Wanderlust', back: 'Strong desire to travel (German)', icon: '', deck: 'expressions' },
  { id: 'fe5', front: 'Bon appétit', back: 'Enjoy your meal! (French)', icon: '', deck: 'expressions' },
  { id: 'fe6', front: 'Saudade', back: 'Deep longing & nostalgia (Portuguese)', icon: '', deck: 'expressions' },
  { id: 'fe7', front: 'Fiesta', back: 'Party or celebration (Spanish)', icon: '', deck: 'expressions' },
  { id: 'fe8', front: 'Aloha', back: 'Hello, goodbye & love (Hawaiian)', icon: '', deck: 'expressions' },

  // Korean phrases
  { id: 'fkr1', front: 'Annyeonghaseyo', back: 'Hello (Korean)', icon: '', deck: 'phrases' },
  { id: 'fkr2', front: 'Kamsahamnida', back: 'Thank you (Korean)', icon: '', deck: 'phrases' },
  { id: 'fkr3', front: 'Annyeonghi gaseyo', back: 'Goodbye (Korean)', icon: '', deck: 'phrases' },
  { id: 'fkr4', front: 'Ne', back: 'Yes (Korean)', icon: '', deck: 'phrases' },

  // Thai phrases
  { id: 'fth1', front: 'Sawadee krap/ka', back: 'Hello (Thai)', icon: '', deck: 'phrases' },
  { id: 'fth2', front: 'Khop khun krap/ka', back: 'Thank you (Thai)', icon: '', deck: 'phrases' },
  { id: 'fth3', front: 'Sabai dee mai?', back: 'How are you? (Thai)', icon: '', deck: 'phrases' },
  { id: 'fth4', front: 'Aroi', back: 'Delicious (Thai)', icon: '', deck: 'phrases' },

  // Arabic/Darija phrases (Morocco)
  { id: 'fma1', front: 'Salam', back: 'Hello / Peace (Moroccan Arabic)', icon: '', deck: 'phrases' },
  { id: 'fma2', front: 'Shukran', back: 'Thank you (Arabic)', icon: '', deck: 'phrases' },
  { id: 'fma3', front: 'Labas?', back: 'How are you? (Moroccan Darija)', icon: '', deck: 'phrases' },
  { id: 'fma4', front: 'Bislama', back: 'Goodbye (Moroccan Darija)', icon: '', deck: 'phrases' },

  // Spanish/Quechua phrases (Peru)
  { id: 'fpe1', front: 'Hola', back: 'Hello (Peruvian Spanish)', icon: '', deck: 'phrases' },
  { id: 'fpe2', front: 'Allianchu?', back: 'How are you? (Quechua)', icon: '', deck: 'phrases' },
  { id: 'fpe3', front: 'Añay', back: 'Thank you (Quechua)', icon: '', deck: 'phrases' },
  { id: 'fpe4', front: 'Tupananchiskama', back: 'See you later (Quechua)', icon: '', deck: 'phrases' },

  // Swahili phrases (Kenya)
  { id: 'fke1', front: 'Jambo', back: 'Hello (Swahili)', icon: '', deck: 'phrases' },
  { id: 'fke2', front: 'Asante', back: 'Thank you (Swahili)', icon: '', deck: 'phrases' },
  { id: 'fke3', front: 'Habari?', back: 'How are you? / What\'s the news? (Swahili)', icon: '', deck: 'phrases' },
  { id: 'fke4', front: 'Hakuna matata', back: 'No worries (Swahili)', icon: '', deck: 'phrases' },

  // Norwegian phrases
  { id: 'fno1', front: 'Hei', back: 'Hello (Norwegian)', icon: '', deck: 'phrases' },
  { id: 'fno2', front: 'Takk', back: 'Thank you (Norwegian)', icon: '', deck: 'phrases' },
  { id: 'fno3', front: 'Ha det bra', back: 'Goodbye (Norwegian)', icon: '', deck: 'phrases' },
  { id: 'fno4', front: 'Skål', back: 'Cheers! (Norwegian)', icon: '', deck: 'phrases' },

  // Turkish phrases
  { id: 'ftr1', front: 'Merhaba', back: 'Hello (Turkish)', icon: '', deck: 'phrases' },
  { id: 'ftr2', front: 'Teşekkürler', back: 'Thank you (Turkish)', icon: '', deck: 'phrases' },
  { id: 'ftr3', front: 'Güle güle', back: 'Goodbye (Turkish)', icon: '', deck: 'phrases' },
  { id: 'ftr4', front: 'Evet', back: 'Yes (Turkish)', icon: '', deck: 'phrases' },

  // Greek phrases
  { id: 'fgr1', front: 'Yia sou', back: 'Hello / Goodbye (Greek)', icon: '', deck: 'phrases' },
  { id: 'fgr2', front: 'Efcharistó', back: 'Thank you (Greek)', icon: '', deck: 'phrases' },
  { id: 'fgr3', front: 'Parakaló', back: 'Please / You\'re welcome (Greek)', icon: '', deck: 'phrases' },
  { id: 'fgr4', front: 'Opa!', back: 'Hooray! / expression of joy (Greek)', icon: '', deck: 'phrases' },
];

export const FLASHCARD_DECKS = [
  { id: 'greetings', title: 'World Greetings', icon: '', count: 10 },
  { id: 'food', title: 'World Foods', icon: '', count: 10 },
  { id: 'landmarks', title: 'Famous Landmarks', icon: '', count: 8 },
  { id: 'expressions', title: 'Fun Expressions', icon: '', count: 8 },
  { id: 'phrases', title: 'World Phrases', icon: '', count: 32 },
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
      { text: 'Hello! In many languages, the greeting changes based on the time of day.', icon: '' },
      { text: '"Bonjour" means good day in French. Use it from morning to evening!', icon: '' },
      { text: '"Konnichiwa" is hello in Japanese. It literally means "this day is..."', icon: '' },
      { text: '"Hola" is hello in Spanish — simple, warm, and used everywhere!', icon: '' },
      { text: '"Namaste" in Hindi means "I bow to you" — a beautiful, respectful greeting.', icon: '' },
      { text: 'Great job! You learned 4 new greetings. Try using one today!', icon: '' },
    ],
  },
  lang2: {
    title: 'Ordering Food',
    slides: [
      { text: 'Hungry? Let\'s learn how to order food around the world!', icon: '' },
      { text: 'In France, say "Je voudrais..." (I would like...) to be polite.', icon: '' },
      { text: 'In Japan, point at the menu and say "Kore o kudasai" (This one, please).', icon: '' },
      { text: '"La cuenta, por favor" means "The check, please" in Spanish.', icon: '' },
      { text: 'In Italy, say "Vorrei..." (I\'d like...) — they love when tourists try!', icon: '' },
    ],
  },
  lang3: {
    title: 'Asking for Directions',
    slides: [
      { text: 'Lost? No worries — let\'s learn to ask for directions!', icon: '' },
      { text: '"Où est...?" means "Where is...?" in French. Add any place after it!', icon: '' },
      { text: '"Sumimasen, ... wa doko desu ka?" means "Excuse me, where is...?" in Japanese.', icon: '' },
      { text: '"¿Dónde está...?" is "Where is...?" in Spanish.', icon: '' },
      { text: 'Pointing at a map and smiling is universal — and always works!', icon: '' },
    ],
  },
  lang4: {
    title: 'Saying Thank You',
    slides: [
      { text: 'Gratitude is universal! Let\'s learn to say "thank you" around the world.', icon: '' },
      { text: '"Merci" (mair-SEE) is thank you in French. Add "beaucoup" for "very much!"', icon: '' },
      { text: '"Arigatou gozaimasu" is the polite way to say thanks in Japanese.', icon: '' },
      { text: '"Gracias" is thank you in Spanish. "Muchas gracias" means many thanks!', icon: '' },
      { text: '"Danke" in German, "Obrigado/a" in Portuguese, "Xièxiè" in Chinese!', icon: '' },
      { text: 'Saying thanks in the local language always makes people smile!', icon: '' },
    ],
  },
  slang1: {
    title: 'Common Expressions',
    slides: [
      { text: 'Every language has fun everyday expressions! Let\'s learn some.', icon: '' },
      { text: '"C\'est la vie" — That\'s life! A classic French way of accepting things.', icon: '' },
      { text: '"No worries" is Australian for "it\'s all good, mate!"', icon: '' },
      { text: '"Kawaii!" means "cute!" in Japanese — you\'ll hear it everywhere!', icon: '' },
      { text: '"Fiesta!" means party in Spanish — because every day could be a celebration!', icon: '' },
    ],
  },
  slang2: {
    title: 'Unique Untranslatable Words',
    slides: [
      { text: 'Some words exist in only one language — and they\'re magical!', icon: '' },
      { text: '"Hygge" (HOO-gah) is Danish for cozy comfort and being with friends.', icon: '' },
      { text: '"Saudade" is Portuguese for a deep, beautiful longing for something.', icon: '' },
      { text: '"Wabi-sabi" is Japanese for finding beauty in imperfection.', icon: '' },
      { text: '"Wanderlust" is German for the irresistible desire to travel!', icon: '' },
      { text: 'These words show that every culture sees the world uniquely!', icon: '' },
    ],
  },
  slang3: {
    title: 'Funny False Friends',
    slides: [
      { text: '"False friends" are words that look the same but mean totally different things!', icon: '' },
      { text: '"Gift" means poison in German — not the best birthday surprise!', icon: '' },
      { text: '"Embarazada" in Spanish means pregnant, NOT embarrassed!', icon: '' },
      { text: '"Bras" means arm in French — not what you think!', icon: '' },
      { text: 'These mix-ups are why learning languages is so funny and important!', icon: '' },
    ],
  },
  cult1: {
    title: 'Festival Traditions',
    slides: [
      { text: 'Festivals are celebrations of culture, food, and togetherness!', icon: '' },
      { text: 'Diwali, the Festival of Lights, lights up India with lamps and fireworks.', icon: '' },
      { text: 'Carnival in Brazil features samba dancing, wild costumes, and parades!', icon: '' },
      { text: 'Hanami in Japan is the tradition of having picnics under cherry blossoms.', icon: '' },
      { text: 'Día de los Muertos in Mexico honors loved ones with beautiful altars.', icon: '' },
      { text: 'Every festival tells a unique story about its people and their values.', icon: '' },
    ],
  },
  cult2: {
    title: 'Music Around the World',
    slides: [
      { text: 'Music is a language everyone speaks! Let\'s explore world music.', icon: '' },
      { text: 'Flamenco from Spain features passionate guitar and stomping dance.', icon: '' },
      { text: 'Taiko drums from Japan are massive and their beats shake the ground!', icon: '' },
      { text: 'Samba from Brazil makes everyone want to move their feet!', icon: '' },
      { text: 'Reggae from Jamaica spreads messages of peace and love worldwide.', icon: '' },
      { text: 'K-Pop from South Korea has fans dancing on every continent!', icon: '' },
    ],
  },
  cult3: {
    title: 'Traditional Clothing',
    slides: [
      { text: 'Traditional clothes tell stories about a culture\'s history and values!', icon: '' },
      { text: 'The Japanese kimono is wrapped left over right and tied with an obi belt.', icon: '' },
      { text: 'India\'s sari is one long cloth that can be draped in over 80 different ways!', icon: '' },
      { text: 'The Scottish kilt is a knee-length skirt with a tartan pattern.', icon: '' },
      { text: 'Mexican huipils are colorful embroidered tunics that represent local identity.', icon: '' },
    ],
  },
  hist1: {
    title: 'Ancient Wonders',
    slides: [
      { text: 'The ancient world built things that still amaze us today!', icon: '' },
      { text: 'The Pyramids of Giza are over 4,500 years old and almost perfectly aligned.', icon: '' },
      { text: 'The Great Wall of China stretches over 13,000 miles across mountains!', icon: '' },
      { text: 'The Colosseum in Rome could hold 50,000 spectators!', icon: '' },
      { text: 'Machu Picchu was hidden in the clouds for centuries until 1911.', icon: '' },
      { text: 'These wonders prove that humans have always dreamed big!', icon: '' },
    ],
  },
  hist2: {
    title: 'Famous Explorers',
    slides: [
      { text: 'Throughout history, brave explorers set out into the unknown!', icon: '' },
      { text: 'Marco Polo traveled from Italy to China in the 1200s — a 24-year journey!', icon: '' },
      { text: 'Ibn Battuta from Morocco traveled 75,000 miles across Africa and Asia!', icon: '' },
      { text: 'Zheng He commanded huge Chinese treasure fleets across the Indian Ocean.', icon: '' },
      { text: 'Sacagawea helped guide Lewis & Clark across North America.', icon: '' },
      { text: 'YOU are an explorer too — discovering the world one lesson at a time!', icon: '' },
    ],
  },
  etiq1: {
    title: 'Table Manners Worldwide',
    slides: [
      { text: 'Table manners are different everywhere — let\'s learn what\'s polite!', icon: '' },
      { text: 'In Japan, slurping noodles is a compliment to the chef!', icon: '' },
      { text: 'In France, keep both hands visible on the table (not in your lap).', icon: '' },
      { text: 'In India, always eat with your right hand — the left is considered rude.', icon: '' },
      { text: 'In China, never stick chopsticks straight up in your rice bowl.', icon: '' },
      { text: 'Knowing these customs shows respect for the culture you\'re visiting!', icon: '' },
    ],
  },
  etiq2: {
    title: 'Greeting Customs',
    slides: [
      { text: 'How you say hello changes around the world!', icon: '' },
      { text: 'In Japan, bow to show respect — the deeper the bow, the more respect.', icon: '' },
      { text: 'In France, friends greet with "la bise" — kisses on alternating cheeks.', icon: '' },
      { text: 'In Thailand, press your palms together and bow — called a "wai."', icon: '' },
      { text: 'In New Zealand, the Māori hongi presses foreheads and noses together.', icon: '' },
      { text: 'Every greeting style has a beautiful meaning behind it!', icon: '' },
    ],
  },
  geo1: {
    title: 'Continents & Oceans',
    slides: [
      { text: 'Our planet has 7 continents and 5 oceans — let\'s explore them!', icon: '' },
      { text: 'Asia is the largest continent — home to over 4 billion people!', icon: '' },
      { text: 'Africa has the most countries (54!) and the Sahara, the biggest hot desert.', icon: '' },
      { text: 'The Pacific Ocean is bigger than ALL the land on Earth combined!', icon: '' },
      { text: 'Antarctica is the coldest continent — penguins love it, but few people live there!', icon: '' },
      { text: 'Every corner of our planet has something amazing to discover!', icon: '' },
    ],
  },
  geo2: {
    title: 'Amazing Natural Wonders',
    slides: [
      { text: 'Nature creates the most incredible sights on Earth!', icon: '' },
      { text: 'The Grand Canyon is so deep, it took the Colorado River 6 million years to carve!', icon: '' },
      { text: 'The Northern Lights (Aurora Borealis) paint the sky with dancing colors.', icon: '' },
      { text: 'The Great Barrier Reef is the largest living structure — visible from space!', icon: '' },
      { text: 'Victoria Falls on the Zambia-Zimbabwe border is called "the smoke that thunders."', icon: '' },
      { text: 'Mount Everest grows about 4mm taller every year!', icon: '' },
    ],
  },
  kr_intro: {
    title: 'Discover South Korea',
    slides: [
      { text: 'South Korea is a small but mighty country in East Asia, famous for technology, music, and delicious food!', icon: '' },
      { text: 'K-pop groups like BTS train for years in singing, dancing, and languages before they debut. Music videos can get billions of views!', icon: '' },
      { text: 'Kimchi is eaten at almost every Korean meal. Families make huge batches together each autumn in a tradition called "kimjang."', icon: '' },
      { text: 'Hangul, the Korean alphabet, was invented by King Sejong the Great in 1443 so everyone could learn to read — not just scholars!', icon: '' },
    ],
  },
  th_intro: {
    title: 'Discover Thailand',
    slides: [
      { text: 'Thailand is known as the "Land of Smiles." It has golden temples, tropical beaches, and some of the best street food in the world!', icon: '' },
      { text: 'Thailand has over 40,000 Buddhist temples. Monks walk barefoot each morning to collect food offerings from the community.', icon: '' },
      { text: 'Songkran, the Thai New Year in April, is the world\'s biggest water fight! Everyone splashes each other in the streets for three days.', icon: '' },
      { text: 'Elephants are deeply respected in Thai culture. The white elephant is the royal symbol, and sanctuaries care for rescued elephants.', icon: '' },
    ],
  },
  ma_intro: {
    title: 'Discover Morocco',
    slides: [
      { text: 'Morocco is in North Africa, where the Sahara Desert meets the Atlantic Ocean. Its cities are full of color, spice, and history!', icon: '' },
      { text: 'Moroccan medinas are winding old cities packed with shops. In Marrakech, you can find everything from leather goods to fresh spices!', icon: '' },
      { text: 'Mint tea is poured from high up to create a frothy top. It is offered as a sign of friendship — refusing a glass is considered rude!', icon: '' },
      { text: 'Berber women in the Atlas Mountains hand-weave carpets with patterns that tell stories. Each symbol has a secret meaning!', icon: '' },
    ],
  },
  pe_intro: {
    title: 'Discover Peru',
    slides: [
      { text: 'Peru is a land of extremes — towering Andes mountains, lush Amazon rainforest, and a long desert coastline all in one country!', icon: '' },
      { text: 'Machu Picchu, the lost Inca city, sits high in the clouds. The stones fit together so perfectly that no mortar was needed!', icon: '' },
      { text: 'Peru is the birthplace of the potato — over 3,000 varieties grow here! Purple, yellow, red, and even blue potatoes.', icon: '' },
      { text: 'Peruvian weavers use techniques passed down for 5,000 years. Alpaca wool is softer than sheep wool and comes in 22 natural colors!', icon: '' },
    ],
  },
  ke_intro: {
    title: 'Discover Kenya',
    slides: [
      { text: 'Kenya is in East Africa and is famous for its incredible wildlife. Safaris here let you see lions, elephants, and giraffes up close!', icon: '' },
      { text: 'The Great Migration sees over 1.5 million wildebeest cross the Maasai Mara each year — one of nature\'s most amazing events!', icon: '' },
      { text: 'The Maasai people are famous for their red clothing, beaded jewelry, and the adumu jumping dance. The highest jumper earns great respect!', icon: '' },
      { text: 'Kenyan runners dominate long-distance races worldwide. Eliud Kipchoge was the first human to run a marathon in under 2 hours!', icon: '' },
    ],
  },
  no_intro: {
    title: 'Discover Norway',
    slides: [
      { text: 'Norway is a Scandinavian country of dramatic fjords, midnight sun, and Viking history. Nature here is truly breathtaking!', icon: '' },
      { text: 'Vikings sailed from Norway over 1,000 years ago. They reached Iceland, Greenland, and even North America in their famous longships!', icon: '' },
      { text: 'The northern lights (aurora borealis) paint Norway\'s sky with dancing ribbons of green, purple, and pink light in winter.', icon: '' },
      { text: 'Norwegians love "friluftsliv" (open-air living). They hike, ski, and enjoy nature all year round — even when it\'s snowing!', icon: '' },
    ],
  },
  tr_intro: {
    title: 'Discover Turkey',
    slides: [
      { text: 'Turkey bridges Europe and Asia. Istanbul is the only major city in the world that sits on two continents!', icon: '' },
      { text: 'The Grand Bazaar in Istanbul has over 4,000 shops and has been open since 1461. You can buy spices, lamps, carpets, and Turkish delight!', icon: '' },
      { text: 'In Cappadocia, hundreds of hot air balloons float over fairy chimneys at dawn. Ancient people carved homes inside these rock towers!', icon: '' },
      { text: 'Turkish hammams (bathhouses) have been a tradition for over 600 years. People go to steam, scrub, and relax together!', icon: '' },
    ],
  },
  gr_intro: {
    title: 'Discover Greece',
    slides: [
      { text: 'Greece is the birthplace of democracy, the Olympics, and Western philosophy. Its sunny islands and ancient ruins attract millions of visitors!', icon: '' },
      { text: 'Ancient Greeks believed 12 gods lived on Mount Olympus. Stories of Zeus, Athena, and Hercules are still told around the world today!', icon: '' },
      { text: 'Greece has about 6,000 islands! Santorini\'s white buildings and blue domes overlooking the sea are one of the most photographed sights on Earth.', icon: '' },
      { text: 'The ancient Olympics began in 776 BC. Athletes competed in running, wrestling, and chariot racing. Wars were paused so they could compete!', icon: '' },
    ],
  },
};

// ─── COUNTRY-SPECIFIC QUIZ QUESTIONS (10 per country) ───

export const COUNTRY_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  jp: [
    { id: 'jp1', question: 'What is the capital of Japan?', options: ['Osaka', 'Tokyo', 'Kyoto', 'Hiroshima'], correct: 1, category: 'jp' },
    { id: 'jp2', question: 'What do Japanese people eat with?', options: ['Forks', 'Hands', 'Chopsticks', 'Spoons'], correct: 2, category: 'jp' },
    { id: 'jp3', question: 'What is sushi rice flavored with?', options: ['Soy sauce', 'Vinegar', 'Sugar', 'Ketchup'], correct: 1, category: 'jp' },
    { id: 'jp4', question: 'Cherry blossom season in Japan is called...', options: ['Matsuri', 'Hanami', 'Origami', 'Tsunami'], correct: 1, category: 'jp' },
    { id: 'jp5', question: 'Mount Fuji is a famous Japanese...', options: ['River', 'Desert', 'Volcano', 'Forest'], correct: 2, category: 'jp' },
    { id: 'jp6', question: 'What is origami?', options: ['Cooking', 'Paper folding', 'Sword fighting', 'Painting'], correct: 1, category: 'jp' },
    { id: 'jp7', question: 'Samurai were Japanese...', options: ['Chefs', 'Warriors', 'Farmers', 'Teachers'], correct: 1, category: 'jp' },
    { id: 'jp8', question: 'What is the traditional Japanese robe called?', options: ['Sari', 'Kimono', 'Hanbok', 'Kilt'], correct: 1, category: 'jp' },
    { id: 'jp9', question: 'In Japan, slurping noodles means...', options: ["You're rude", "You're enjoying them", "You're full", "You want more"], correct: 1, category: 'jp' },
    { id: 'jp10', question: '"Kawaii" means what in Japanese?', options: ['Scary', 'Cute', 'Big', 'Fast'], correct: 1, category: 'jp' },
  ],
  fr: [
    { id: 'fr1', question: 'What is the capital of France?', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], correct: 1, category: 'fr' },
    { id: 'fr2', question: 'The Eiffel Tower was built for which event?', options: ['A wedding', 'World\'s Fair 1889', 'Napoleon\'s victory', 'Christmas'], correct: 1, category: 'fr' },
    { id: 'fr3', question: 'What is a croissant shaped like?', options: ['A star', 'A crescent moon', 'A circle', 'A triangle'], correct: 1, category: 'fr' },
    { id: 'fr4', question: 'French people greet with kisses on the...', options: ['Forehead', 'Hand', 'Cheeks', 'Nose'], correct: 2, category: 'fr' },
    { id: 'fr5', question: '"Merci beaucoup" means...', options: ['Good morning', 'Thank you very much', 'See you later', 'Excuse me'], correct: 1, category: 'fr' },
    { id: 'fr6', question: 'The Louvre in Paris is a famous...', options: ['Restaurant', 'Museum', 'Park', 'Church'], correct: 1, category: 'fr' },
    { id: 'fr7', question: 'Baguette is a type of French...', options: ['Dance', 'Song', 'Bread', 'Hat'], correct: 2, category: 'fr' },
    { id: 'fr8', question: 'France is known for making amazing...', options: ['Sushi', 'Cheese', 'Tacos', 'Curry'], correct: 1, category: 'fr' },
    { id: 'fr9', question: 'The French flag has how many colors?', options: ['Two', 'Three', 'Four', 'Five'], correct: 1, category: 'fr' },
    { id: 'fr10', question: '"Au revoir" means...', options: ['Hello', 'Please', 'Goodbye', 'Sorry'], correct: 2, category: 'fr' },
  ],
  mx: [
    { id: 'mx1', question: 'What is the capital of Mexico?', options: ['Cancún', 'Guadalajara', 'Mexico City', 'Monterrey'], correct: 2, category: 'mx' },
    { id: 'mx2', question: 'Día de los Muertos celebrates...', options: ['Sports', 'Loved ones who passed', 'Birthdays', 'Harvests'], correct: 1, category: 'mx' },
    { id: 'mx3', question: 'A taco is made with a...', options: ['Bun', 'Tortilla', 'Pita', 'Naan'], correct: 1, category: 'mx' },
    { id: 'mx4', question: 'Piñatas are traditionally filled with...', options: ['Water', 'Sand', 'Candy', 'Rice'], correct: 2, category: 'mx' },
    { id: 'mx5', question: 'The ancient pyramid of Chichén Itzá was built by the...', options: ['Aztecs', 'Incas', 'Maya', 'Romans'], correct: 2, category: 'mx' },
    { id: 'mx6', question: 'Mexico\'s currency is the...', options: ['Dollar', 'Euro', 'Peso', 'Yen'], correct: 2, category: 'mx' },
    { id: 'mx7', question: 'What instrument is iconic in Mexican mariachi music?', options: ['Piano', 'Trumpet', 'Flute', 'Drums'], correct: 1, category: 'mx' },
    { id: 'mx8', question: 'Guacamole is made from...', options: ['Tomatoes', 'Avocados', 'Peppers', 'Beans'], correct: 1, category: 'mx' },
    { id: 'mx9', question: '"Hola, amigo" means...', options: ['Goodbye friend', 'Hello friend', 'Thank you friend', 'Sorry friend'], correct: 1, category: 'mx' },
    { id: 'mx10', question: 'Mexico is bordered by which ocean on the west?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, category: 'mx' },
  ],
  it: [
    { id: 'it1', question: 'What is the capital of Italy?', options: ['Milan', 'Venice', 'Rome', 'Florence'], correct: 2, category: 'it' },
    { id: 'it2', question: 'The Colosseum was used for...', options: ['Shopping', 'Gladiator games', 'School', 'Farming'], correct: 1, category: 'it' },
    { id: 'it3', question: 'Pizza originated in which Italian city?', options: ['Rome', 'Milan', 'Naples', 'Venice'], correct: 2, category: 'it' },
    { id: 'it4', question: 'Venice is famous for its...', options: ['Mountains', 'Canals', 'Deserts', 'Forests'], correct: 1, category: 'it' },
    { id: 'it5', question: 'Gelato is the Italian word for...', options: ['Cake', 'Cookie', 'Ice cream', 'Candy'], correct: 2, category: 'it' },
    { id: 'it6', question: 'The Leaning Tower is in which city?', options: ['Rome', 'Pisa', 'Venice', 'Milan'], correct: 1, category: 'it' },
    { id: 'it7', question: '"Ciao bella" means...', options: ['Good night', 'Hello beautiful', 'Thank you', 'Excuse me'], correct: 1, category: 'it' },
    { id: 'it8', question: 'Italy is shaped like a...', options: ['Star', 'Boot', 'Heart', 'Fish'], correct: 1, category: 'it' },
    { id: 'it9', question: 'Leonardo da Vinci painted the...', options: ['Starry Night', 'Mona Lisa', 'The Scream', 'Girl with a Pearl'], correct: 1, category: 'it' },
    { id: 'it10', question: 'What sport is Italy crazy about?', options: ['Baseball', 'Cricket', 'Football (soccer)', 'Hockey'], correct: 2, category: 'it' },
  ],
  gb: [
    { id: 'gb1', question: 'What is the capital of the United Kingdom?', options: ['Edinburgh', 'London', 'Cardiff', 'Dublin'], correct: 1, category: 'gb' },
    { id: 'gb2', question: 'Big Ben is actually the name of the...', options: ['Tower', 'Bell', 'Clock', 'Bridge'], correct: 1, category: 'gb' },
    { id: 'gb3', question: 'Afternoon tea is a British tradition of drinking tea with...', options: ['Breakfast', 'Sandwiches & cakes', 'Dinner', 'Soup'], correct: 1, category: 'gb' },
    { id: 'gb4', question: 'The UK\'s leader lives at 10...', options: ['Baker Street', 'Downing Street', 'Oxford Street', 'Abbey Road'], correct: 1, category: 'gb' },
    { id: 'gb5', question: 'Which castle is home to the King?', options: ['Edinburgh Castle', 'Windsor Castle', 'Tower of London', 'Warwick Castle'], correct: 1, category: 'gb' },
    { id: 'gb6', question: '"Brilliant" in British slang means...', options: ['Shiny', 'Awesome/great', 'Terrible', 'Boring'], correct: 1, category: 'gb' },
    { id: 'gb7', question: 'Fish and chips is a classic British...', options: ['Breakfast', 'Snack', 'Meal', 'Dessert'], correct: 2, category: 'gb' },
    { id: 'gb8', question: 'Harry Potter was written by a British author from...', options: ['London', 'Edinburgh', 'Manchester', 'Liverpool'], correct: 1, category: 'gb' },
    { id: 'gb9', question: 'The UK drives on which side of the road?', options: ['Right', 'Left', 'Middle', 'It changes'], correct: 1, category: 'gb' },
    { id: 'gb10', question: 'Stonehenge is a mysterious circle of...', options: ['Trees', 'Stones', 'Water', 'Sand'], correct: 1, category: 'gb' },
  ],
  br: [
    { id: 'br1', question: 'What is the capital of Brazil?', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], correct: 2, category: 'br' },
    { id: 'br2', question: 'Brazil\'s Carnival is famous for...', options: ['Snow', 'Samba & parades', 'Silence', 'Cooking'], correct: 1, category: 'br' },
    { id: 'br3', question: 'The Amazon Rainforest is the world\'s...', options: ['Smallest', 'Driest', 'Largest', 'Coldest'], correct: 2, category: 'br' },
    { id: 'br4', question: 'What sport is Brazil most famous for?', options: ['Cricket', 'Football (soccer)', 'Baseball', 'Tennis'], correct: 1, category: 'br' },
    { id: 'br5', question: 'Christ the Redeemer statue is in...', options: ['São Paulo', 'Brasília', 'Rio de Janeiro', 'Manaus'], correct: 2, category: 'br' },
    { id: 'br6', question: 'What language do Brazilians speak?', options: ['Spanish', 'Portuguese', 'English', 'French'], correct: 1, category: 'br' },
    { id: 'br7', question: 'Brazilian açaí bowls are made from...', options: ['Oranges', 'Berries', 'Mangos', 'Bananas'], correct: 1, category: 'br' },
    { id: 'br8', question: 'The Amazon River is the world\'s...', options: ['Shortest', 'Second longest', 'Widest by volume', 'Cleanest'], correct: 2, category: 'br' },
    { id: 'br9', question: '"Obrigado" means what in Portuguese?', options: ['Hello', 'Sorry', 'Thank you', 'Goodbye'], correct: 2, category: 'br' },
    { id: 'br10', question: 'Brazil has the most species of which animal?', options: ['Dogs', 'Birds', 'Fish', 'Cats'], correct: 1, category: 'br' },
  ],
  kr: [
    { id: 'kr1', question: 'What is the capital of South Korea?', options: ['Busan', 'Seoul', 'Incheon', 'Daegu'], correct: 1, category: 'kr' },
    { id: 'kr2', question: 'Kimchi is made primarily from fermented...', options: ['Rice', 'Cabbage', 'Potatoes', 'Corn'], correct: 1, category: 'kr' },
    { id: 'kr3', question: 'What is the Korean alphabet called?', options: ['Kanji', 'Hangul', 'Hiragana', 'Pinyin'], correct: 1, category: 'kr' },
    { id: 'kr4', question: 'Which Korean martial art uses powerful kicks?', options: ['Judo', 'Karate', 'Taekwondo', 'Aikido'], correct: 2, category: 'kr' },
    { id: 'kr5', question: 'K-pop stands for...', options: ['Korean pop', 'Kyoto pop', 'Kids pop', 'Kenya pop'], correct: 0, category: 'kr' },
    { id: 'kr6', question: 'Bibimbap means...', options: ['Fried rice', 'Mixed rice', 'Sticky rice', 'Sweet rice'], correct: 1, category: 'kr' },
    { id: 'kr7', question: 'The Korean New Year celebration is called...', options: ['Chuseok', 'Seollal', 'Songkran', 'Diwali'], correct: 1, category: 'kr' },
    { id: 'kr8', question: 'Who invented the Korean alphabet?', options: ['King Sejong', 'Emperor Meiji', 'Confucius', 'Buddha'], correct: 0, category: 'kr' },
    { id: 'kr9', question: '"Annyeonghaseyo" means what in Korean?', options: ['Goodbye', 'Thank you', 'Hello', 'Sorry'], correct: 2, category: 'kr' },
    { id: 'kr10', question: 'South Korea is famous for its fast...', options: ['Cars', 'Trains', 'Internet', 'Horses'], correct: 2, category: 'kr' },
  ],
  th: [
    { id: 'th1', question: 'What is the capital of Thailand?', options: ['Chiang Mai', 'Phuket', 'Bangkok', 'Pattaya'], correct: 2, category: 'th' },
    { id: 'th2', question: 'What is Thailand\'s national animal?', options: ['Tiger', 'Elephant', 'Dragon', 'Monkey'], correct: 1, category: 'th' },
    { id: 'th3', question: 'Thai temples are called...', options: ['Wats', 'Shrines', 'Pagodas', 'Mosques'], correct: 0, category: 'th' },
    { id: 'th4', question: 'Songkran is celebrated with a massive...', options: ['Fire show', 'Water fight', 'Kite festival', 'Dance battle'], correct: 1, category: 'th' },
    { id: 'th5', question: 'Pad Thai is a dish made with...', options: ['Rice', 'Noodles', 'Bread', 'Potatoes'], correct: 1, category: 'th' },
    { id: 'th6', question: 'Muay Thai uses how many "limbs"?', options: ['Four', 'Six', 'Eight', 'Ten'], correct: 2, category: 'th' },
    { id: 'th7', question: 'Thailand used to be called...', options: ['Burma', 'Siam', 'Ceylon', 'Indochina'], correct: 1, category: 'th' },
    { id: 'th8', question: 'The Thai greeting "wai" involves pressing...', options: ['Fists together', 'Palms together', 'Elbows together', 'Noses together'], correct: 1, category: 'th' },
    { id: 'th9', question: '"Sawadee" means what in Thai?', options: ['Thank you', 'Goodbye', 'Hello', 'Please'], correct: 2, category: 'th' },
    { id: 'th10', question: 'Thai silk is famous for being very...', options: ['Rough', 'Shimmering', 'Stretchy', 'Heavy'], correct: 1, category: 'th' },
  ],
  ma: [
    { id: 'ma1', question: 'What is the capital of Morocco?', options: ['Casablanca', 'Marrakech', 'Rabat', 'Fez'], correct: 2, category: 'ma' },
    { id: 'ma2', question: 'Morocco is on which continent?', options: ['Asia', 'Europe', 'Africa', 'South America'], correct: 2, category: 'ma' },
    { id: 'ma3', question: 'A Moroccan medina is an old walled...', options: ['Garden', 'City', 'Castle', 'Farm'], correct: 1, category: 'ma' },
    { id: 'ma4', question: 'What desert partly covers Morocco?', options: ['Gobi', 'Sahara', 'Atacama', 'Kalahari'], correct: 1, category: 'ma' },
    { id: 'ma5', question: 'Moroccan mint tea is known as...', options: ['Chai', 'Matcha', 'Moroccan whiskey (a joke name)', 'Green gold'], correct: 2, category: 'ma' },
    { id: 'ma6', question: 'A tagine is shaped like a...', options: ['Square', 'Cone', 'Star', 'Tube'], correct: 1, category: 'ma' },
    { id: 'ma7', question: 'The Atlas Mountains are in...', options: ['Morocco', 'Egypt', 'Kenya', 'Turkey'], correct: 0, category: 'ma' },
    { id: 'ma8', question: 'Zellige is the Moroccan art of...', options: ['Painting', 'Tile mosaic', 'Wood carving', 'Weaving'], correct: 1, category: 'ma' },
    { id: 'ma9', question: '"Shukran" means what in Arabic?', options: ['Hello', 'Goodbye', 'Thank you', 'Please'], correct: 2, category: 'ma' },
    { id: 'ma10', question: 'Couscous is traditionally eaten on which day in Morocco?', options: ['Monday', 'Wednesday', 'Friday', 'Sunday'], correct: 2, category: 'ma' },
  ],
  pe: [
    { id: 'pe1', question: 'What is the capital of Peru?', options: ['Cusco', 'Lima', 'Arequipa', 'Machu Picchu'], correct: 1, category: 'pe' },
    { id: 'pe2', question: 'Machu Picchu was built by the...', options: ['Maya', 'Aztec', 'Inca', 'Spanish'], correct: 2, category: 'pe' },
    { id: 'pe3', question: 'What is Peru\'s national dish?', options: ['Tacos', 'Ceviche', 'Paella', 'Sushi'], correct: 1, category: 'pe' },
    { id: 'pe4', question: 'The Andes Mountains run through...', options: ['Africa', 'Asia', 'South America', 'Europe'], correct: 2, category: 'pe' },
    { id: 'pe5', question: 'Peru is the birthplace of the...', options: ['Tomato', 'Potato', 'Carrot', 'Onion'], correct: 1, category: 'pe' },
    { id: 'pe6', question: 'Quipus were Inca recording devices made from...', options: ['Stone', 'Clay', 'Knotted strings', 'Metal'], correct: 2, category: 'pe' },
    { id: 'pe7', question: 'Which animal provides soft wool in Peru?', options: ['Sheep', 'Alpaca', 'Goat', 'Rabbit'], correct: 1, category: 'pe' },
    { id: 'pe8', question: 'Lake Titicaca is the highest navigable lake in...', options: ['Africa', 'Asia', 'The world', 'Europe'], correct: 2, category: 'pe' },
    { id: 'pe9', question: 'What language did the Inca speak?', options: ['Spanish', 'Latin', 'Quechua', 'Portuguese'], correct: 2, category: 'pe' },
    { id: 'pe10', question: 'Peru\'s purple corn is used to make a drink called...', options: ['Pisco', 'Chicha morada', 'Horchata', 'Maté'], correct: 1, category: 'pe' },
  ],
  ke: [
    { id: 'ke1', question: 'What is the capital of Kenya?', options: ['Mombasa', 'Nairobi', 'Kisumu', 'Nakuru'], correct: 1, category: 'ke' },
    { id: 'ke2', question: 'The Maasai Mara is famous for the annual...', options: ['Festival', 'Great Migration', 'Marathon', 'Harvest'], correct: 1, category: 'ke' },
    { id: 'ke3', question: 'Kenya\'s Big Five animals do NOT include...', options: ['Lions', 'Elephants', 'Giraffes', 'Rhinos'], correct: 2, category: 'ke' },
    { id: 'ke4', question: '"Jambo" means what in Swahili?', options: ['Goodbye', 'Thank you', 'Hello', 'Friend'], correct: 2, category: 'ke' },
    { id: 'ke5', question: 'Mount Kenya is Africa\'s...', options: ['Tallest peak', 'Second-highest peak', 'Third-highest peak', 'Lowest peak'], correct: 1, category: 'ke' },
    { id: 'ke6', question: 'Ugali is made from...', options: ['Rice flour', 'Maize flour', 'Wheat flour', 'Potato flour'], correct: 1, category: 'ke' },
    { id: 'ke7', question: 'Nyama choma means...', options: ['Sweet bread', 'Roasted meat', 'Fried fish', 'Spicy soup'], correct: 1, category: 'ke' },
    { id: 'ke8', question: 'The Great Rift Valley runs through...', options: ['South America', 'Europe', 'Kenya', 'Australia'], correct: 2, category: 'ke' },
    { id: 'ke9', question: 'Kenyan marathon legend Eliud Kipchoge ran a marathon in under...', options: ['3 hours', '2.5 hours', '2 hours', '1.5 hours'], correct: 2, category: 'ke' },
    { id: 'ke10', question: '"Hakuna matata" in Swahili means...', options: ['Good morning', 'No worries', 'Let\'s go', 'Goodbye'], correct: 1, category: 'ke' },
  ],
  no: [
    { id: 'no1', question: 'What is the capital of Norway?', options: ['Bergen', 'Oslo', 'Tromsø', 'Stavanger'], correct: 1, category: 'no' },
    { id: 'no2', question: 'Norwegian fjords were carved by...', options: ['Rivers', 'Wind', 'Glaciers', 'Earthquakes'], correct: 2, category: 'no' },
    { id: 'no3', question: 'Vikings traveled in ships called...', options: ['Galleons', 'Longships', 'Canoes', 'Junks'], correct: 1, category: 'no' },
    { id: 'no4', question: 'The Northern Lights are also called...', options: ['Aurora australis', 'Aurora borealis', 'Solar flare', 'Moonbow'], correct: 1, category: 'no' },
    { id: 'no5', question: 'In Norwegian folklore, trolls turn to stone in...', options: ['Rain', 'Moonlight', 'Sunlight', 'Wind'], correct: 2, category: 'no' },
    { id: 'no6', question: 'Brunost is a Norwegian...', options: ['Bread', 'Fish', 'Brown cheese', 'Soup'], correct: 2, category: 'no' },
    { id: 'no7', question: 'The midnight sun means the sun...', options: ['Is very dim', 'Never sets', 'Is red', 'Sets twice'], correct: 1, category: 'no' },
    { id: 'no8', question: '"Friluftsliv" means...', options: ['Cooking outdoors', 'Open-air living', 'Ice swimming', 'Skiing fast'], correct: 1, category: 'no' },
    { id: 'no9', question: 'Viking runes were a type of...', options: ['Food', 'Weapon', 'Alphabet', 'Dance'], correct: 2, category: 'no' },
    { id: 'no10', question: 'Norway is in which region of Europe?', options: ['Southern', 'Eastern', 'Western', 'Scandinavia'], correct: 3, category: 'no' },
  ],
  tr: [
    { id: 'tr1', question: 'Istanbul sits on which two continents?', options: ['Africa & Asia', 'Europe & Africa', 'Europe & Asia', 'Asia & Australia'], correct: 2, category: 'tr' },
    { id: 'tr2', question: 'The Grand Bazaar in Istanbul has over...', options: ['400 shops', '1,000 shops', '4,000 shops', '10,000 shops'], correct: 2, category: 'tr' },
    { id: 'tr3', question: 'Turkish delight is called lokum and is a type of...', options: ['Bread', 'Cheese', 'Candy', 'Drink'], correct: 2, category: 'tr' },
    { id: 'tr4', question: 'Cappadocia is famous for fairy chimneys and...', options: ['Volcanoes', 'Hot air balloons', 'Waterfalls', 'Pyramids'], correct: 1, category: 'tr' },
    { id: 'tr5', question: 'A Turkish hammam is a...', options: ['Market', 'Bathhouse', 'School', 'Restaurant'], correct: 1, category: 'tr' },
    { id: 'tr6', question: 'Hagia Sophia has been a church, a mosque, and a...', options: ['School', 'Museum-mosque', 'Hospital', 'Palace'], correct: 1, category: 'tr' },
    { id: 'tr7', question: 'Whirling dervishes spin as a form of...', options: ['Exercise', 'Entertainment', 'Meditation and prayer', 'Cooking'], correct: 2, category: 'tr' },
    { id: 'tr8', question: '"Merhaba" means what in Turkish?', options: ['Goodbye', 'Thank you', 'Hello', 'Please'], correct: 2, category: 'tr' },
    { id: 'tr9', question: 'Turkish coffee is served in...', options: ['Large mugs', 'Tiny cups', 'Bowls', 'Coconut shells'], correct: 1, category: 'tr' },
    { id: 'tr10', question: 'The nazar boncuğu (evil eye charm) is colored...', options: ['Red', 'Green', 'Blue', 'Yellow'], correct: 2, category: 'tr' },
  ],
  gr: [
    { id: 'gr1', question: 'What is the capital of Greece?', options: ['Sparta', 'Athens', 'Thessaloniki', 'Olympia'], correct: 1, category: 'gr' },
    { id: 'gr2', question: 'The ancient Greeks believed gods lived on Mount...', options: ['Everest', 'Olympus', 'Fuji', 'Sinai'], correct: 1, category: 'gr' },
    { id: 'gr3', question: 'The Parthenon was built for the goddess...', options: ['Hera', 'Aphrodite', 'Athena', 'Artemis'], correct: 2, category: 'gr' },
    { id: 'gr4', question: 'The ancient Olympics started in which year BC?', options: ['1000 BC', '776 BC', '500 BC', '200 BC'], correct: 1, category: 'gr' },
    { id: 'gr5', question: 'Greece has about how many islands?', options: ['600', '1,000', '3,000', '6,000'], correct: 3, category: 'gr' },
    { id: 'gr6', question: 'Gyros means what in Greek?', options: ['Meat', 'Turn', 'Wrap', 'Bread'], correct: 1, category: 'gr' },
    { id: 'gr7', question: 'Which Greek philosopher taught by asking questions?', options: ['Plato', 'Aristotle', 'Socrates', 'Homer'], correct: 2, category: 'gr' },
    { id: 'gr8', question: 'Santorini sits on the rim of a volcanic...', options: ['Mountain', 'Crater', 'Island', 'Valley'], correct: 1, category: 'gr' },
    { id: 'gr9', question: '"Efcharistó" means what in Greek?', options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'], correct: 2, category: 'gr' },
    { id: 'gr10', question: 'The Mediterranean diet is known for lots of...', options: ['Butter', 'Olive oil', 'Cream', 'Sugar'], correct: 1, category: 'gr' },
  ],
};

export function getCountryQuiz(countryId: string, count: number = 8): QuizQuestion[] {
  const pool = COUNTRY_QUIZ_QUESTIONS[countryId] || [];
  return shuffleArray(pool).slice(0, count);
}

// ─── COUNTRY LOCATIONS ("Stops to Visit") ───

export interface CountryLocation {
  id: string;
  name: string;
  description: string;
  category: 'landmark' | 'food' | 'nature' | 'culture' | 'hidden_gem';
  learningPoints: number;
  imageUrl?: string;
}

const COUNTRY_LOCATIONS: Record<string, CountryLocation[]> = {
  jp: [
    { id: 'jp_loc1', name: 'Tokyo Tower', description: 'A 333-meter communications tower inspired by the Eiffel Tower, lit up beautifully at night.', category: 'landmark', learningPoints: 10 },
    { id: 'jp_loc2', name: 'Fushimi Inari Shrine', description: 'Thousands of bright orange torii gates line a winding trail up a sacred mountain in Kyoto.', category: 'culture', learningPoints: 12 },
    { id: 'jp_loc3', name: 'Tsukiji Outer Market', description: 'A bustling Tokyo market where you can try the freshest sushi and street food in the world.', category: 'food', learningPoints: 8 },
    { id: 'jp_loc4', name: 'Arashiyama Bamboo Grove', description: 'Walk through towering bamboo stalks that sway and whisper in the wind near Kyoto.', category: 'nature', learningPoints: 10 },
    { id: 'jp_loc5', name: 'Senso-ji Temple', description: 'Tokyo\'s oldest Buddhist temple, with a giant red lantern at the Thunder Gate entrance.', category: 'culture', learningPoints: 10 },
  ],
  fr: [
    { id: 'fr_loc1', name: 'Eiffel Tower', description: 'The iconic iron lattice tower with 1,665 steps and a sparkling light show every night.', category: 'landmark', learningPoints: 10 },
    { id: 'fr_loc2', name: 'Louvre Museum', description: 'The world\'s largest art museum, home to the Mona Lisa and 38,000 other artworks.', category: 'culture', learningPoints: 12 },
    { id: 'fr_loc3', name: 'Mont Saint-Michel', description: 'A fairy-tale abbey perched on a rocky island that becomes surrounded by the sea at high tide.', category: 'landmark', learningPoints: 15 },
    { id: 'fr_loc4', name: 'Palace of Versailles', description: 'A breathtaking royal palace with 2,300 rooms and the stunning Hall of Mirrors.', category: 'culture', learningPoints: 12 },
    { id: 'fr_loc5', name: 'Nice Beach', description: 'The sparkling Côte d\'Azur beach with blue Mediterranean waters and colorful pebbles.', category: 'nature', learningPoints: 8 },
  ],
  mx: [
    { id: 'mx_loc1', name: 'Chichén Itzá', description: 'An ancient Mayan pyramid where shadows create a serpent shape during the equinox.', category: 'landmark', learningPoints: 15 },
    { id: 'mx_loc2', name: 'Oaxaca Markets', description: 'Colorful markets overflowing with mole, chapulines, mezcal, and handmade crafts.', category: 'food', learningPoints: 10 },
    { id: 'mx_loc3', name: 'Cenote Ik Kil', description: 'A natural sinkhole swimming pool surrounded by hanging vines and lush jungle.', category: 'nature', learningPoints: 12 },
    { id: 'mx_loc4', name: 'Frida Kahlo Museum', description: 'The bright blue house where famous artist Frida Kahlo lived and created her masterpieces.', category: 'culture', learningPoints: 10 },
    { id: 'mx_loc5', name: 'Monarch Butterfly Sanctuary', description: 'A hidden forest where millions of orange monarch butterflies rest during winter migration.', category: 'hidden_gem', learningPoints: 15 },
  ],
  it: [
    { id: 'it_loc1', name: 'Colosseum', description: 'The massive ancient Roman arena where gladiators once fought before 50,000 spectators.', category: 'landmark', learningPoints: 12 },
    { id: 'it_loc2', name: 'Venice Canals', description: 'A magical floating city where gondolas glide through winding waterways instead of streets.', category: 'landmark', learningPoints: 10 },
    { id: 'it_loc3', name: 'Pompeii', description: 'An ancient Roman city frozen in time after being buried by a volcanic eruption in 79 AD.', category: 'culture', learningPoints: 15 },
    { id: 'it_loc4', name: 'Amalfi Coast', description: 'Colorful cliffside villages overlooking sparkling turquoise waters along Italy\'s southern coast.', category: 'nature', learningPoints: 10 },
    { id: 'it_loc5', name: 'Trevi Fountain', description: 'A stunning Baroque fountain — toss a coin to make a wish and ensure your return to Rome!', category: 'hidden_gem', learningPoints: 8 },
  ],
  gb: [
    { id: 'gb_loc1', name: 'Big Ben & Parliament', description: 'London\'s iconic clock tower chimes on the hour beside the Houses of Parliament.', category: 'landmark', learningPoints: 10 },
    { id: 'gb_loc2', name: 'Stonehenge', description: 'A mysterious prehistoric circle of giant stones that has puzzled people for 5,000 years.', category: 'culture', learningPoints: 15 },
    { id: 'gb_loc3', name: 'Lake District', description: 'Rolling green hills and sparkling lakes that inspired poet William Wordsworth.', category: 'nature', learningPoints: 10 },
    { id: 'gb_loc4', name: 'Borough Market', description: 'London\'s oldest and most famous food market with treats from around the world.', category: 'food', learningPoints: 8 },
    { id: 'gb_loc5', name: 'Shambles, York', description: 'A medieval cobbled street that inspired Diagon Alley in Harry Potter!', category: 'hidden_gem', learningPoints: 12 },
  ],
  br: [
    { id: 'br_loc1', name: 'Christ the Redeemer', description: 'The giant statue of Jesus with open arms standing atop Corcovado Mountain in Rio.', category: 'landmark', learningPoints: 12 },
    { id: 'br_loc2', name: 'Copacabana Beach', description: 'A world-famous crescent beach in Rio where locals play soccer and samba on the sand.', category: 'nature', learningPoints: 8 },
    { id: 'br_loc3', name: 'Amazon Rainforest', description: 'The world\'s largest tropical rainforest, home to 10% of all species on Earth.', category: 'nature', learningPoints: 15 },
    { id: 'br_loc4', name: 'Iguazu Falls', description: 'A breathtaking chain of 275 waterfalls straddling the border with Argentina.', category: 'nature', learningPoints: 12 },
    { id: 'br_loc5', name: 'São Paulo Food Scene', description: 'The largest city in South America, famous for its incredible mix of cuisines.', category: 'food', learningPoints: 10 },
  ],
  kr: [
    { id: 'kr_loc1', name: 'Gyeongbokgung Palace', description: 'A grand royal palace in Seoul where you can wear a hanbok and feel like royalty!', category: 'culture', learningPoints: 12 },
    { id: 'kr_loc2', name: 'Bukchon Hanok Village', description: 'Traditional Korean houses with curved rooftops lining narrow hilltop alleys in Seoul.', category: 'culture', learningPoints: 10 },
    { id: 'kr_loc3', name: 'Jeju Island', description: 'A volcanic island with lava tubes, waterfalls, and friendly stone grandfather statues.', category: 'nature', learningPoints: 12 },
    { id: 'kr_loc4', name: 'Gwangjang Market', description: 'Seoul\'s oldest market where you can try bindaetteok pancakes and fresh kimbap rolls.', category: 'food', learningPoints: 8 },
    { id: 'kr_loc5', name: 'DMZ Peace Trail', description: 'A unique hike along the border between North and South Korea through pristine nature.', category: 'hidden_gem', learningPoints: 15 },
  ],
  th: [
    { id: 'th_loc1', name: 'Grand Palace', description: 'A dazzling complex of golden spires, temples, and the sacred Emerald Buddha in Bangkok.', category: 'landmark', learningPoints: 12 },
    { id: 'th_loc2', name: 'Phi Phi Islands', description: 'Crystal-clear turquoise waters, limestone cliffs, and colorful coral reefs.', category: 'nature', learningPoints: 10 },
    { id: 'th_loc3', name: 'Chiang Mai Night Bazaar', description: 'A sprawling evening market full of Thai street food, crafts, and live music.', category: 'food', learningPoints: 8 },
    { id: 'th_loc4', name: 'Wat Arun', description: 'The "Temple of Dawn" covered in sparkling porcelain and seashells along the river.', category: 'culture', learningPoints: 10 },
    { id: 'th_loc5', name: 'Erawan Waterfall', description: 'A seven-tiered waterfall in emerald-green pools where fish nibble your toes!', category: 'hidden_gem', learningPoints: 12 },
  ],
  ma: [
    { id: 'ma_loc1', name: 'Jemaa el-Fnaa', description: 'Marrakech\'s main square that transforms into a carnival of storytellers and food stalls at night.', category: 'culture', learningPoints: 10 },
    { id: 'ma_loc2', name: 'Sahara Desert Camp', description: 'Sleep under a million stars in a Berber tent after riding camels over golden dunes.', category: 'nature', learningPoints: 15 },
    { id: 'ma_loc3', name: 'Chefchaouen', description: 'An entire mountain town painted in every shade of blue — a photographer\'s dream!', category: 'hidden_gem', learningPoints: 12 },
    { id: 'ma_loc4', name: 'Fez Medina', description: 'The world\'s largest car-free urban area with 9,000 winding alleyways and ancient tanneries.', category: 'landmark', learningPoints: 12 },
    { id: 'ma_loc5', name: 'Moroccan Cooking Class', description: 'Learn to make tagine and couscous with fresh spices from the souk.', category: 'food', learningPoints: 10 },
  ],
  pe: [
    { id: 'pe_loc1', name: 'Machu Picchu', description: 'The lost Inca city in the clouds, one of the New Seven Wonders of the World.', category: 'landmark', learningPoints: 15 },
    { id: 'pe_loc2', name: 'Rainbow Mountain', description: 'A stunning mountain striped with bands of red, gold, lavender, and turquoise minerals.', category: 'nature', learningPoints: 12 },
    { id: 'pe_loc3', name: 'Lake Titicaca', description: 'The highest navigable lake in the world, with floating islands made entirely of reeds.', category: 'nature', learningPoints: 12 },
    { id: 'pe_loc4', name: 'Lima Ceviche Trail', description: 'Taste Peru\'s famous raw fish dish at the best cevicherías in the capital.', category: 'food', learningPoints: 10 },
    { id: 'pe_loc5', name: 'Moray Terraces', description: 'Mysterious circular Inca farming terraces that look like an ancient amphitheater.', category: 'hidden_gem', learningPoints: 12 },
  ],
  ke: [
    { id: 'ke_loc1', name: 'Maasai Mara', description: 'Witness the Great Migration as millions of wildebeest thunder across the golden savanna.', category: 'nature', learningPoints: 15 },
    { id: 'ke_loc2', name: 'Mount Kenya', description: 'Africa\'s second-highest peak with glaciers, alpine lakes, and unique high-altitude plants.', category: 'nature', learningPoints: 12 },
    { id: 'ke_loc3', name: 'Nairobi National Park', description: 'The only national park inside a capital city — see giraffes with skyscrapers behind them!', category: 'hidden_gem', learningPoints: 10 },
    { id: 'ke_loc4', name: 'Lamu Old Town', description: 'A UNESCO World Heritage Swahili town with donkey taxis and hand-carved wooden doors.', category: 'culture', learningPoints: 12 },
    { id: 'ke_loc5', name: 'Carnivore Restaurant', description: 'A famous Nairobi restaurant where you can try unique grilled meats from a Maasai sword.', category: 'food', learningPoints: 8 },
  ],
  no: [
    { id: 'no_loc1', name: 'Geirangerfjord', description: 'A UNESCO fjord with cascading waterfalls, emerald water, and towering cliffs.', category: 'nature', learningPoints: 15 },
    { id: 'no_loc2', name: 'Northern Lights, Tromsø', description: 'Watch the sky dance with green, purple, and pink curtains of light above the Arctic.', category: 'nature', learningPoints: 12 },
    { id: 'no_loc3', name: 'Viking Ship Museum', description: 'See real 1,000-year-old Viking longships excavated from burial mounds in Oslo.', category: 'culture', learningPoints: 10 },
    { id: 'no_loc4', name: 'Trolltunga', description: 'A dramatic rock formation that juts out like a tongue 700 meters above a lake.', category: 'landmark', learningPoints: 12 },
    { id: 'no_loc5', name: 'Bergen Fish Market', description: 'Try the freshest salmon, king crab, and fish cakes at this harbour-side market.', category: 'food', learningPoints: 8 },
  ],
  tr: [
    { id: 'tr_loc1', name: 'Hagia Sophia', description: 'A 1,500-year-old architectural marvel that has been a church, a mosque, and a museum.', category: 'landmark', learningPoints: 12 },
    { id: 'tr_loc2', name: 'Cappadocia Balloons', description: 'Float in a hot air balloon over fairy chimneys and ancient cave homes at sunrise.', category: 'nature', learningPoints: 15 },
    { id: 'tr_loc3', name: 'Grand Bazaar', description: 'One of the world\'s oldest and largest covered markets with over 4,000 glittering shops.', category: 'culture', learningPoints: 10 },
    { id: 'tr_loc4', name: 'Pamukkale', description: 'Terraces of white mineral-rich hot springs that look like frozen waterfalls made of cotton.', category: 'hidden_gem', learningPoints: 12 },
    { id: 'tr_loc5', name: 'Istanbul Street Food Tour', description: 'Try simit bread rings, balik ekmek fish sandwiches, and warm Turkish tea.', category: 'food', learningPoints: 8 },
  ],
  gr: [
    { id: 'gr_loc1', name: 'Acropolis of Athens', description: 'The ancient hilltop citadel with the Parthenon temple, symbol of democracy and civilization.', category: 'landmark', learningPoints: 15 },
    { id: 'gr_loc2', name: 'Santorini Sunset', description: 'Watch the sun dip into the Aegean Sea from the white-and-blue cliffs of Oia village.', category: 'nature', learningPoints: 10 },
    { id: 'gr_loc3', name: 'Olympia', description: 'The birthplace of the Olympic Games — run on the same track athletes used in 776 BC!', category: 'culture', learningPoints: 12 },
    { id: 'gr_loc4', name: 'Meteora Monasteries', description: 'Ancient monasteries built on top of towering natural rock pillars reaching into the sky.', category: 'landmark', learningPoints: 12 },
    { id: 'gr_loc5', name: 'Athens Central Market', description: 'A lively market overflowing with olives, feta cheese, fresh fish, and Greek pastries.', category: 'food', learningPoints: 8 },
  ],
};

export function getCountryLocations(countryId: string): CountryLocation[] {
  return COUNTRY_LOCATIONS[countryId] || [];
}
