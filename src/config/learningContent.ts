export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
  /** Optional image URL to show with the question (e.g. landmark, food) */
  imageUrl?: string;
  /** Optional difficulty tier for adaptive quizzes */
  difficulty?: QuizDifficulty;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  icon: string;
  deck: string;
  imageUrl?: string;
}

export interface LessonSlide {
  text: string;
  icon: string;
  /** Optional image URL for a dreamy, visual lesson */
  imageUrl?: string;
}

export interface LessonData {
  title: string;
  slides: LessonSlide[];
}

// ─── QUIZ QUESTIONS (60 across 6 categories) ───

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  // LANGUAGE (10)
  { id: 'lq1', question: 'What does "Bonjour" mean in French?', options: ['Goodbye', 'Hello / Good day', 'Thank you', 'Please'], correct: 1, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { id: 'lq2', question: 'How do you say "thank you" in Japanese?', options: ['Sayonara', 'Konnichiwa', 'Arigatou', 'Sumimasen'], correct: 2, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600' },
  { id: 'lq3', question: 'Which language do they speak in Brazil?', options: ['Spanish', 'French', 'Portuguese', 'English'], correct: 2, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600' },
  { id: 'lq4', question: '"Ciao" in Italian can mean...', options: ['Only hello', 'Only goodbye', 'Both hello and goodbye', 'Thank you'], correct: 2, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600' },
  { id: 'lq5', question: 'What does "Merci" mean in French?', options: ['Sorry', 'Thank you', 'Hello', 'Excuse me'], correct: 1, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600' },
  { id: 'lq6', question: 'How do you say "yes" in German?', options: ['Nein', 'Oui', 'Ja', 'Sí'], correct: 2, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600' },
  { id: 'lq7', question: '"Annyeonghaseyo" is a greeting in which language?', options: ['Chinese', 'Korean', 'Thai', 'Vietnamese'], correct: 1, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
  { id: 'lq8', question: 'What does "Namaste" mean in Hindi?', options: ['Goodbye forever', 'I bow to you', 'Good morning', 'Nice weather'], correct: 1, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1524496128540-801c43a8e2e8?w=600' },
  { id: 'lq9', question: '"Gracias" means "thank you" in which language?', options: ['Italian', 'Portuguese', 'Spanish', 'French'], correct: 2, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600' },
  { id: 'lq10', question: 'How do you say "please" in French?', options: ['Pardon', 'S\'il vous plaît', 'Merci', 'Excusez-moi'], correct: 1, category: 'language', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },

  // GEOGRAPHY (10)
  { id: 'gq1', question: 'Which country is famous for sushi?', options: ['Italy', 'Mexico', 'Japan', 'Brazil'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600' },
  { id: 'gq2', question: 'The Eiffel Tower is in which city?', options: ['London', 'Paris', 'Rome', 'Tokyo'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { id: 'gq3', question: 'Which is the largest continent?', options: ['Africa', 'Europe', 'Asia', 'North America'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1464817739973-0128fe77aed1?w=600' },
  { id: 'gq4', question: 'The Great Barrier Reef is near which country?', options: ['Brazil', 'Australia', 'Japan', 'South Africa'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600' },
  { id: 'gq5', question: 'Which river flows through Egypt?', options: ['Amazon', 'Danube', 'Nile', 'Yangtze'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
  { id: 'gq6', question: 'Mount Fuji is in which country?', options: ['China', 'Korea', 'Japan', 'Nepal'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600' },
  { id: 'gq7', question: 'Which country has the most people?', options: ['USA', 'India', 'Brazil', 'Russia'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600' },
  { id: 'gq8', question: 'The Sahara Desert is on which continent?', options: ['Asia', 'Australia', 'Africa', 'South America'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
  { id: 'gq9', question: 'Big Ben is a landmark in which city?', options: ['New York', 'London', 'Sydney', 'Dublin'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
  { id: 'gq10', question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },

  // CULTURE (10)
  { id: 'cq1', question: 'Diwali, the Festival of Lights, is celebrated in which country?', options: ['Japan', 'India', 'Brazil', 'Mexico'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600' },
  { id: 'cq2', question: 'What is origami?', options: ['Japanese cooking', 'Paper folding art', 'A martial art', 'A dance'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?w=600' },
  { id: 'cq3', question: 'Flamenco dancing comes from which country?', options: ['Italy', 'Argentina', 'Spain', 'Portugal'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' },
  { id: 'cq4', question: 'What do people celebrate during Carnival in Brazil?', options: ['Harvest', 'New Year', 'Music, dance & costumes', 'The moon'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1551649001-7a2482d98d05?w=600' },
  { id: 'cq5', question: 'Hanami is the Japanese tradition of viewing what?', options: ['Fireworks', 'Cherry blossoms', 'Stars', 'Mountains'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600' },
  { id: 'cq6', question: 'The Chinese New Year animal cycle has how many animals?', options: ['8', '10', '12', '14'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=600' },
  { id: 'cq7', question: 'What is a piñata traditionally filled with?', options: ['Water', 'Sand', 'Candy and treats', 'Flowers'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' },
  { id: 'cq8', question: 'Holi, the festival of colors, is from which country?', options: ['Thailand', 'Egypt', 'India', 'Morocco'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1535082623926-b39352a03fb7?w=600' },
  { id: 'cq9', question: 'A kimono is a traditional garment from which country?', options: ['China', 'Korea', 'Japan', 'Vietnam'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
  { id: 'cq10', question: 'Día de los Muertos (Day of the Dead) is celebrated in...', options: ['Spain', 'Mexico', 'Brazil', 'Peru'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600' },

  // HISTORY (10)
  { id: 'hq1', question: 'The Pyramids of Giza are in which country?', options: ['Iraq', 'Egypt', 'Greece', 'Turkey'], correct: 1, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600' },
  { id: 'hq2', question: 'The Great Wall was built to protect which country?', options: ['Japan', 'India', 'China', 'Mongolia'], correct: 2, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600' },
  { id: 'hq3', question: 'The Colosseum is an ancient arena in which city?', options: ['Athens', 'Rome', 'Cairo', 'Istanbul'], correct: 1, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600' },
  { id: 'hq4', question: 'Vikings originally came from which region?', options: ['Britain', 'Scandinavia', 'Russia', 'Germany'], correct: 1, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
  { id: 'hq5', question: 'Machu Picchu was built by which civilization?', options: ['Maya', 'Aztec', 'Inca', 'Olmec'], correct: 2, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
  { id: 'hq6', question: 'The Sphinx has the body of a lion and the head of a...', options: ['Dog', 'Bird', 'Human', 'Cat'], correct: 2, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64b0f5c7a28?w=600' },
  { id: 'hq7', question: 'Samurai warriors lived in which country?', options: ['China', 'Japan', 'Korea', 'Thailand'], correct: 1, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600' },
  { id: 'hq8', question: 'The ancient Olympics were first held in which country?', options: ['Italy', 'Egypt', 'Greece', 'Turkey'], correct: 2, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
  { id: 'hq9', question: 'Hieroglyphics were a writing system from which civilization?', options: ['Roman', 'Greek', 'Egyptian', 'Chinese'], correct: 2, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600' },
  { id: 'hq10', question: 'Stonehenge is located in which country?', options: ['France', 'England', 'Ireland', 'Scotland'], correct: 1, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=600' },

  // ETIQUETTE (10)
  { id: 'eq1', question: 'In Japan, you should remove your shoes before entering a...', options: ['Restaurant', 'Home', 'Store', 'Park'], correct: 1, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
  { id: 'eq2', question: 'In many Asian countries, it\'s polite to use which hand to eat?', options: ['Left', 'Right', 'Either one', 'Neither'], correct: 1, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600' },
  { id: 'eq3', question: 'In France, how many kisses on the cheek is a common greeting?', options: ['One', 'Two', 'Three', 'Four'], correct: 1, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e7b2a2e?w=600' },
  { id: 'eq4', question: 'Tipping 15-20% is expected in restaurants in which country?', options: ['Japan', 'France', 'USA', 'Australia'], correct: 2, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
  { id: 'eq5', question: 'In Thailand, the head is considered...', options: ['Unimportant', 'Sacred', 'Lucky', 'Strong'], correct: 1, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
  { id: 'eq6', question: 'Bowing is a common greeting in which country?', options: ['Brazil', 'France', 'Japan', 'Canada'], correct: 2, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { id: 'eq7', question: 'In India, eating with your left hand is considered...', options: ['Normal', 'Polite', 'Rude', 'Lucky'], correct: 2, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },
  { id: 'eq8', question: 'Slurping noodles in Japan is considered...', options: ['Very rude', 'A compliment', 'Funny', 'Strange'], correct: 1, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600' },
  { id: 'eq9', question: 'In the UK, queuing (lining up) is taken very...', options: ['Casually', 'Seriously', 'As a joke', 'Differently'], correct: 1, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
  { id: 'eq10', question: 'In which country should you NEVER stick chopsticks upright in rice?', options: ['China', 'Japan', 'Both', 'Neither'], correct: 2, category: 'etiquette', imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600' },

  // SLANG (10)
  { id: 'sq1', question: '"C\'est la vie" is a French expression meaning...', options: ['That\'s too bad', 'That\'s life', 'Let\'s go', 'How beautiful'], correct: 1, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },
  { id: 'sq2', question: '"No worries" is a casual phrase from which country?', options: ['USA', 'Canada', 'Australia', 'UK'], correct: 2, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600' },
  { id: 'sq3', question: '"Mate" is a friendly word for "friend" in...', options: ['France', 'Japan', 'Australia & UK', 'Brazil'], correct: 2, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600' },
  { id: 'sq4', question: '"Kawaii" in Japanese means...', options: ['Scary', 'Cute', 'Delicious', 'Big'], correct: 1, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { id: 'sq5', question: '"Hygge" is a Danish word about...', options: ['Cooking', 'Cozy comfort', 'Exercise', 'Travel'], correct: 1, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1543083115-638c32cd3654?w=600' },
  { id: 'sq6', question: '"Saudade" is a Portuguese word for...', options: ['Happiness', 'Deep longing/nostalgia', 'Anger', 'Excitement'], correct: 1, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600' },
  { id: 'sq7', question: '"Bon appétit" means...', options: ['Good morning', 'Enjoy your meal', 'Welcome', 'Cheers'], correct: 1, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
  { id: 'sq8', question: '"Fiesta" in Spanish means...', options: ['Nap', 'Party/festival', 'Food', 'Friends'], correct: 1, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' },
  { id: 'sq9', question: '"Wanderlust" is a German word meaning...', options: ['Homesick', 'Love of travel', 'Love of food', 'Fear of heights'], correct: 1, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600' },
  { id: 'sq10', question: '"Aloha" in Hawaiian can mean...', options: ['Only hello', 'Only goodbye', 'Hello, goodbye, and love', 'Food'], correct: 2, category: 'slang', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },

  // NEW COUNTRY QUESTIONS (40)
  { id: 'nkr1', question: 'Kimchi is a famous fermented food from which country?', options: ['Japan', 'South Korea', 'China', 'Thailand'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=600' },
  { id: 'nkr2', question: 'What is the traditional Korean dress called?', options: ['Kimono', 'Sari', 'Hanbok', 'Ao dai'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
  { id: 'nkr3', question: 'K-pop music comes from which country?', options: ['Japan', 'China', 'Thailand', 'South Korea'], correct: 3, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664f59e1a4?w=600' },
  { id: 'nkr4', question: 'Which Korean martial art is an Olympic sport?', options: ['Karate', 'Judo', 'Taekwondo', 'Kung fu'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
  { id: 'nkr5', question: 'Bibimbap is a Korean dish served in a...', options: ['Tortilla', 'Bowl', 'Baguette', 'Crepe'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600' },

  { id: 'nth1', question: 'Thailand has over 40,000 Buddhist...', options: ['Schools', 'Statues', 'Temples', 'Bridges'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
  { id: 'nth2', question: 'Songkran is the Thai New Year festival celebrated with...', options: ['Fire', 'Water', 'Flowers', 'Kites'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600' },
  { id: 'nth3', question: 'What is the national animal of Thailand?', options: ['Tiger', 'Elephant', 'Panda', 'Dragon'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600' },
  { id: 'nth4', question: 'Pad Thai is a dish made with stir-fried...', options: ['Rice', 'Bread', 'Noodles', 'Potatoes'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600' },
  { id: 'nth5', question: 'Muay Thai is also known as...', options: ['Thai cooking', 'Thai boxing', 'Thai dancing', 'Thai singing'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600' },

  { id: 'nma1', question: 'Moroccan medinas are famous old walled...', options: ['Castles', 'Cities', 'Gardens', 'Temples'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
  { id: 'nma2', question: 'Morocco is partly covered by which desert?', options: ['Gobi', 'Kalahari', 'Sahara', 'Atacama'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
  { id: 'nma3', question: 'A tagine is a Moroccan...', options: ['Dance', 'Clay cooking pot', 'Musical instrument', 'Hat'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600' },
  { id: 'nma4', question: 'Moroccan mint tea is poured from...', options: ['Very low', 'Very high up', 'Behind the back', 'Sitting down'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600' },
  { id: 'nma5', question: 'Zellige is a Moroccan art of making...', options: ['Music', 'Tile mosaics', 'Carpets', 'Pottery'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=600' },

  { id: 'npe1', question: 'Machu Picchu was built by which civilization?', options: ['Maya', 'Aztec', 'Inca', 'Roman'], correct: 2, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
  { id: 'npe2', question: 'Peru is home to which mountain range?', options: ['Alps', 'Himalayas', 'Rockies', 'Andes'], correct: 3, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600' },
  { id: 'npe3', question: 'Ceviche is Peru\'s national dish made with...', options: ['Cooked beef', 'Raw fish and lime', 'Fried chicken', 'Baked potatoes'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600' },
  { id: 'npe4', question: 'Quipus were knotted strings used by the Inca for...', options: ['Fishing', 'Record keeping', 'Decoration', 'Music'], correct: 1, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1531968455002-901e9197d212?w=600' },
  { id: 'npe5', question: 'Peru is the birthplace of which common vegetable?', options: ['Carrot', 'Tomato', 'Potato', 'Onion'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b28d4b4a8d2b?w=600' },

  { id: 'nke1', question: 'The Great Migration happens in Kenya\'s...', options: ['Sahara', 'Amazon', 'Maasai Mara', 'Serengeti only'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
  { id: 'nke2', question: 'The Maasai people are known for wearing which color?', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
  { id: 'nke3', question: 'Kenya grows some of the world\'s best...', options: ['Rice', 'Coffee', 'Wheat', 'Corn'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600' },
  { id: 'nke4', question: 'Kenyan runners are famous for winning...', options: ['Sprints', 'Swimming', 'Long-distance races', 'Cycling'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600' },
  { id: 'nke5', question: 'Ugali is a Kenyan staple food made from...', options: ['Rice', 'Wheat', 'Maize flour', 'Potatoes'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600' },

  { id: 'nno1', question: 'Norway\'s fjords were carved by...', options: ['Rivers', 'Earthquakes', 'Glaciers', 'Wind'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
  { id: 'nno2', question: 'Vikings originally came from Scandinavia, including...', options: ['Spain', 'Norway', 'Italy', 'Greece'], correct: 1, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
  { id: 'nno3', question: 'The northern lights are also called the aurora...', options: ['Australis', 'Borealis', 'Solaris', 'Lunaris'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
  { id: 'nno4', question: 'In Norwegian folklore, trolls turn to stone in...', options: ['Rain', 'Moonlight', 'Sunlight', 'Snow'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600' },
  { id: 'nno5', question: '"Friluftsliv" is a Norwegian word meaning...', options: ['Cooking together', 'Open-air living', 'Ice fishing', 'Mountain climbing'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },

  { id: 'ntr1', question: 'Istanbul\'s Grand Bazaar has over how many shops?', options: ['400', '1,000', '4,000', '10,000'], correct: 2, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
  { id: 'ntr2', question: 'Istanbul sits on which two continents?', options: ['Asia and Africa', 'Europe and Asia', 'Europe and Africa', 'Asia and Australia'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600' },
  { id: 'ntr3', question: 'Turkish delight (lokum) is a type of...', options: ['Bread', 'Cheese', 'Candy', 'Soup'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600' },
  { id: 'ntr4', question: 'Cappadocia is famous for its hot air balloons and...', options: ['Beaches', 'Fairy chimneys', 'Waterfalls', 'Forests'], correct: 1, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600' },
  { id: 'ntr5', question: 'A Turkish hammam is a traditional...', options: ['Kitchen', 'Bathhouse', 'School', 'Market'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=600' },

  { id: 'ngr1', question: 'Ancient Greeks believed the gods lived on Mount...', options: ['Everest', 'Fuji', 'Olympus', 'Sinai'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
  { id: 'ngr2', question: 'Greece has about how many islands?', options: ['100', '600', '2,000', '6,000'], correct: 3, category: 'geography', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600' },
  { id: 'ngr3', question: 'The ancient Olympics were first held in...', options: ['Athens', 'Sparta', 'Olympia', 'Corinth'], correct: 2, category: 'history', imageUrl: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600' },
  { id: 'ngr4', question: 'Greek gyros are wrapped in...', options: ['Tortilla', 'Naan', 'Pita bread', 'Rice paper'], correct: 2, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600' },
  { id: 'ngr5', question: 'The word "philosophy" comes from Greek and means...', options: ['Love of food', 'Love of wisdom', 'Love of sports', 'Love of music'], correct: 1, category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },

  // SUSTAINABILITY (10)
  { id: 'sus1', question: 'Which type of transport usually has a smaller carbon footprint for short trips?', options: ['Private jet', 'Car alone', 'Train or bus', 'Helicopter'], correct: 2, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600' },
  { id: 'sus2', question: 'What does "slow travel" often mean?', options: ['Traveling only at night', 'Staying longer in one place', 'Walking everywhere', 'Never flying'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
  { id: 'sus3', question: 'Eating seasonal and local food often helps because...', options: ['It costs more', 'It uses less energy to grow and transport', 'It is always organic', 'It has no packaging'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600' },
  { id: 'sus4', question: 'Reducing food waste helps the planet by...', options: ['Making more trash', 'Saving resources and cutting landfill', 'Using more plastic', 'Growing more crops'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600' },
  { id: 'sus5', question: 'Why is plastic in the ocean a problem?', options: ['It makes water taste bad', 'It harms marine life and ecosystems', 'It evaporates quickly', 'It only affects beaches'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600' },
  { id: 'sus6', question: 'What is a simple way to help beaches and oceans?', options: ['Throw trash in the water', 'Join or do a beach cleanup', 'Use more single-use plastic', 'Avoid the beach'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600' },
  { id: 'sus7', question: '"Reef-safe" sunscreen is better for the ocean because...', options: ['It is cheaper', 'It does not harm coral and marine life', 'It has no smell', 'It lasts longer'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600' },
  { id: 'sus8', question: 'What does "carbon footprint" mean?', options: ['The size of your shoe', 'The amount of carbon emissions linked to your actions', 'A type of recycling', 'A kind of tree'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600' },
  { id: 'sus9', question: 'Composting food scraps helps by...', options: ['Making more garbage', 'Turning waste into soil and reducing landfill', 'Using more water', 'Burning trash'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600' },
  { id: 'sus10', question: 'Biodiversity means...', options: ['Only one kind of plant', 'The variety of life in an ecosystem', 'A type of fuel', 'A recycling bin'], correct: 1, category: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },

  // MUSIC (10)
  { id: 'muq1', question: 'What instrument is made from a dried gourd?', options: ['Maracas', 'Piano', 'Trumpet', 'Violin'], correct: 0, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600' },
  { id: 'muq2', question: 'Which country invented the bagpipes?', options: ['Ireland', 'Scotland', 'France', 'Spain'], correct: 1, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=600' },
  { id: 'muq3', question: 'The sitar is a stringed instrument from which country?', options: ['Japan', 'China', 'India', 'Thailand'], correct: 2, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600' },
  { id: 'muq4', question: 'What dance style comes from Argentina?', options: ['Salsa', 'Flamenco', 'Tango', 'Samba'], correct: 2, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1545959570-a94084071b5f?w=600' },
  { id: 'muq5', question: 'Which instrument did Mozart famously play as a child?', options: ['Guitar', 'Piano', 'Violin', 'Flute'], correct: 1, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd27eacf42d1?w=600' },
  { id: 'muq6', question: 'Reggae music was born in which Caribbean island?', options: ['Cuba', 'Jamaica', 'Puerto Rico', 'Haiti'], correct: 1, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600' },
  { id: 'muq7', question: 'What are taiko drums?', options: ['Small hand drums', 'Giant Japanese drums', 'African drums', 'Irish drums'], correct: 1, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1528283648649-33347faa5d9e?w=600' },
  { id: 'muq8', question: 'Flamenco combines guitar, singing, and what?', options: ['Harp', 'Dance', 'Trumpet', 'Drums'], correct: 1, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' },
  { id: 'muq9', question: 'The didgeridoo is a wind instrument from which country?', options: ['Brazil', 'Australia', 'New Zealand', 'South Africa'], correct: 1, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600' },
  { id: 'muq10', question: 'What is a gamelan?', options: ['A type of dance', 'An Indonesian orchestra of gongs and metallophones', 'A Japanese flute', 'A Mexican guitar'], correct: 1, category: 'music', imageUrl: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=600' },

  // MYTHS (10)
  { id: 'myq1', question: 'In Greek myths, what creature is half horse, half human?', options: ['Minotaur', 'Centaur', 'Sphinx', 'Hydra'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
  { id: 'myq2', question: 'Who pulled a sword from a stone in legend?', options: ['Robin Hood', 'King Arthur', 'William Tell', 'El Cid'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=600' },
  { id: 'myq3', question: 'In Norse mythology, what animal pulls Thor\'s chariot?', options: ['Wolves', 'Goats', 'Horses', 'Eagles'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
  { id: 'myq4', question: 'The phoenix is a mythical bird that does what when it dies?', options: ['Turns to ice', 'Rises from its own ashes', 'Becomes a star', 'Sinks into the earth'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=600' },
  { id: 'myq5', question: 'In Japanese folklore, what animal can shape-shift and play tricks?', options: ['Dragon', 'Fox (kitsune)', 'Crane', 'Tiger'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600' },
  { id: 'myq6', question: 'Anansi is a trickster spider from which continent\'s stories?', options: ['Asia', 'Europe', 'Africa', 'South America'], correct: 2, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
  { id: 'myq7', question: 'What creature did Saint George famously fight?', options: ['A giant', 'A dragon', 'A wolf', 'A serpent'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=600' },
  { id: 'myq8', question: 'In Maori legend, how did New Zealand\'s islands appear?', options: ['A volcano erupted', 'A demigod fished them from the sea', 'A bird dropped them', 'Giants built them'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600' },
  { id: 'myq9', question: 'The unicorn has a horn on its...', options: ['Tail', 'Forehead', 'Nose', 'Back'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
  { id: 'myq10', question: 'In Egyptian myth, who had the head of a jackal?', options: ['Ra', 'Anubis', 'Horus', 'Osiris'], correct: 1, category: 'myths', imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600' },

  // NATURE (10)
  { id: 'naq1', question: 'What animal can hold its breath for up to 2 hours underwater?', options: ['Dolphin', 'Otter', 'Elephant seal', 'Sea turtle'], correct: 2, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1504349771785-b6a1e83b1c5d?w=600' },
  { id: 'naq2', question: 'Which bird can fly backwards?', options: ['Eagle', 'Hummingbird', 'Parrot', 'Owl'], correct: 1, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=600' },
  { id: 'naq3', question: 'A group of flamingos is called a...', options: ['Herd', 'Flock', 'Flamboyance', 'Stand'], correct: 2, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=600' },
  { id: 'naq4', question: 'What is the only mammal that can truly fly?', options: ['Flying squirrel', 'Bat', 'Flying fish', 'Sugar glider'], correct: 1, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1504349771785-b6a1e83b1c5d?w=600' },
  { id: 'naq5', question: 'Honeybees do a "waggle dance" to tell others where to find...', options: ['Water', 'Flowers', 'The queen', 'Enemies'], correct: 1, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600' },
  { id: 'naq6', question: 'Which animal has the strongest bite of any mammal?', options: ['Lion', 'Hippopotamus', 'Crocodile', 'Great white shark'], correct: 1, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
  { id: 'naq7', question: 'What color is a polar bear\'s skin under its fur?', options: ['White', 'Black', 'Pink', 'Brown'], correct: 1, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600' },
  { id: 'naq8', question: 'Octopuses have how many hearts?', options: ['One', 'Two', 'Three', 'Four'], correct: 2, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=600' },
  { id: 'naq9', question: 'Which insect can lift 50 times its own body weight?', options: ['Ant', 'Beetle', 'Grasshopper', 'Ladybug'], correct: 0, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600' },
  { id: 'naq10', question: 'What is the largest living structure on Earth?', options: ['Mount Everest', 'The Amazon rainforest', 'The Great Barrier Reef', 'The Sahara Desert'], correct: 2, category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600' },

  // SCIENCE (10)
  { id: 'scq1', question: 'What country invented paper?', options: ['Egypt', 'Greece', 'China', 'India'], correct: 2, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600' },
  { id: 'scq2', question: 'Who invented the light bulb?', options: ['Benjamin Franklin', 'Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell'], correct: 1, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600' },
  { id: 'scq3', question: 'What did the ancient Chinese invent that we use for navigation?', options: ['Compass', 'GPS', 'Telescope', 'Microscope'], correct: 0, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=600' },
  { id: 'scq4', question: 'The printing press was invented by Johannes Gutenberg in which country?', options: ['Italy', 'France', 'Germany', 'England'], correct: 2, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600' },
  { id: 'scq5', question: 'What did Marie Curie discover that glows in the dark?', options: ['Phosphorus', 'Radium', 'Uranium', 'Plutonium'], correct: 1, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600' },
  { id: 'scq6', question: 'Which ancient civilization built the first known aqueducts?', options: ['Egyptians', 'Romans', 'Greeks', 'Chinese'], correct: 1, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600' },
  { id: 'scq7', question: 'The telescope was first used for astronomy in which country?', options: ['England', 'Italy', 'Netherlands', 'Germany'], correct: 2, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600' },
  { id: 'scq8', question: 'What did Alexander Graham Bell invent?', options: ['Light bulb', 'Telephone', 'Radio', 'Television'], correct: 1, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?w=600' },
  { id: 'scq9', question: 'The ancient Egyptians used which plant to make the first paper?', options: ['Bamboo', 'Cotton', 'Papyrus', 'Hemp'], correct: 2, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600' },
  { id: 'scq10', question: 'Who wrote the first computer program in the 1840s?', options: ['Alan Turing', 'Ada Lovelace', 'Charles Babbage', 'Grace Hopper'], correct: 1, category: 'science', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600' },
];

/** Assigns difficulty by index: first 40% easy, next 40% medium, last 20% hard */
function getQuestionDifficulty(q: QuizQuestion, indexInAll: number): QuizDifficulty {
  if (q.difficulty) return q.difficulty;
  const total = ALL_QUIZ_QUESTIONS.length;
  const ratio = indexInAll / total;
  return ratio < 0.4 ? 'easy' : ratio < 0.8 ? 'medium' : 'hard';
}

export function getQuizByCategory(category: string, count: number = 10): QuizQuestion[] {
  const pool = ALL_QUIZ_QUESTIONS.filter(q => q.category === category);
  return shuffleArray(pool).slice(0, count);
}

export function getRandomQuiz(count: number = 10): QuizQuestion[] {
  return shuffleArray([...ALL_QUIZ_QUESTIONS]).slice(0, count);
}

/**
 * Returns an adaptive quiz based on user accuracy.
 * - accuracy < 40%: mostly easy (70% easy, 30% medium)
 * - accuracy 40–70%: balanced (30% easy, 50% medium, 20% hard)
 * - accuracy > 70%: challenging (10% easy, 40% medium, 50% hard)
 * When categoryAccuracies is provided, prioritizes categories where accuracy is lowest.
 */
export function getAdaptiveQuiz(
  category: string,
  count: number,
  accuracy: number,
  categoryAccuracies?: Record<string, number>
): QuizQuestion[] {
  let pool = ALL_QUIZ_QUESTIONS.filter(q => q.category === category);
  if (pool.length === 0) return [];

  // Build index map for difficulty assignment
  const indexMap = new Map<string, number>();
  ALL_QUIZ_QUESTIONS.forEach((q, i) => indexMap.set(q.id, i));

  // Assign difficulty to each question
  const withDiff = pool.map(q => ({
    ...q,
    difficulty: getQuestionDifficulty(q, indexMap.get(q.id) ?? 0) as QuizDifficulty,
  }));

  // Difficulty distribution based on accuracy
  let easyPct: number, mediumPct: number, hardPct: number;
  if (accuracy < 40) {
    easyPct = 0.7; mediumPct = 0.3; hardPct = 0;
  } else if (accuracy <= 70) {
    easyPct = 0.3; mediumPct = 0.5; hardPct = 0.2;
  } else {
    easyPct = 0.1; mediumPct = 0.4; hardPct = 0.5;
  }

  const easy = withDiff.filter(q => q.difficulty === 'easy');
  const medium = withDiff.filter(q => q.difficulty === 'medium');
  const hard = withDiff.filter(q => q.difficulty === 'hard');

  const nEasy = Math.round(count * easyPct);
  const nMedium = Math.round(count * mediumPct);
  const nHard = count - nEasy - nMedium;

  const picked = [
    ...shuffleArray(easy).slice(0, nEasy),
    ...shuffleArray(medium).slice(0, nMedium),
    ...shuffleArray(hard).slice(0, Math.max(0, nHard)),
  ].filter(Boolean);

  return shuffleArray(picked).slice(0, count);
}

/**
 * Adaptive mixed quiz across categories. Uses categoryAccuracies to weight toward
 * categories where the user has lowest accuracy.
 */
export function getAdaptiveMixedQuiz(
  count: number,
  categoryAccuracies: Record<string, number>
): QuizQuestion[] {
  const indexMap = new Map<string, number>();
  ALL_QUIZ_QUESTIONS.forEach((q, i) => indexMap.set(q.id, i));

  const withDiff = ALL_QUIZ_QUESTIONS.map(q => ({
    ...q,
    difficulty: getQuestionDifficulty(q, indexMap.get(q.id) ?? 0) as QuizDifficulty,
  }));

  // Sort categories by accuracy ascending (lowest first)
  const categories = Object.keys(categoryAccuracies);
  const sortedCats = [...categories].sort((a, b) => (categoryAccuracies[a] ?? 100) - (categoryAccuracies[b] ?? 100));

  // Weight: give more weight to low-accuracy categories
  const weights: { cat: string; weight: number }[] = sortedCats.map((cat, i) => ({
    cat,
    weight: sortedCats.length - i,
  }));

  const totalWeight = weights.reduce((s, w) => s + w.weight, 0);
  const byCat = new Map<string, QuizQuestion[]>();
  withDiff.forEach(q => {
    const list = byCat.get(q.category) ?? [];
    list.push(q);
    byCat.set(q.category, list);
  });

  const result: QuizQuestion[] = [];
  for (const { cat, weight } of weights) {
    const n = Math.ceil((weight / totalWeight) * count);
    const list = byCat.get(cat) ?? [];
    result.push(...shuffleArray(list).slice(0, n));
  }

  return shuffleArray(result).slice(0, count);
}

// ─── DID YOU KNOW? FACTS (50 share-worthy cultural/world facts) ───

export const DID_YOU_KNOW_FACTS: string[] = [
  'Honey never spoils — archaeologists found 3000-year-old honey in Egyptian tombs that was still edible!',
  'In Japan, there\'s a village with more scarecrows than people — over 350 scarecrows and only 27 residents!',
  'Octopuses have three hearts and blue blood!',
  'The shortest war in history lasted 38 minutes (between Britain and Zanzibar in 1896)!',
  'In Finland, there are more saunas than cars!',
  'A single strand of spaghetti is called a "spaghetto" — the singular of spaghetti!',
  'Bananas are berries, but strawberries aren\'t!',
  'The Eiffel Tower grows about 6 inches in summer when the iron expands in the heat!',
  'There are more possible moves in a game of chess than atoms in the known universe!',
  'The oldest known recipe in the world is for beer — from ancient Mesopotamia, 4,000 years ago!',
  'Cows have best friends and get stressed when they\'re separated!',
  'In Iceland, you can\'t have a dog as a pet in the capital city — but cats are allowed!',
  'The world\'s quietest room is so quiet you can hear your own blood flowing!',
  'Scotland has 421 words for "snow" — including "spitters" for light snowfall!',
  'A group of porcupines is called a "prickle"!',
  'The dot over the letter "i" is called a "tittle"!',
  'In 1962, a kid in Tanzania got so many pen pals the post office gave him his own zip code!',
  'The longest place name in the world is in New Zealand: Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu!',
  'Polar bear fur isn\'t white — it\'s transparent! It just looks white because it reflects light.',
  'The inventor of the Pringles can is buried in a Pringles can!',
  'In Denmark, it\'s illegal to name your baby "Placenta" or "Monkey" — there\'s an approved name list!',
  'A "jiffy" is an actual unit of time: 1/100th of a second!',
  'The oldest living tree is over 5,000 years old — a bristlecone pine in California!',
  'In Switzerland, it\'s illegal to own just one guinea pig — they get lonely!',
  'The first Olympic gold medals were actually made of silver!',
  'A "murder" is the name for a group of crows!',
  'The word "avocado" comes from the Aztec word for "testicle"!',
  'In 1893, New Zealand became the first country to let women vote!',
  'Sloths only poop once a week — and when they do, they lose one-third of their body weight!',
  'The Great Wall of China is NOT visible from space with the naked eye — that\'s a myth!',
  'In Japan, there\'s a train station that exists only for one passenger — a schoolgirl!',
  'A "blob" of jellyfish is called a "smack"!',
  'The first video game was invented in 1958 — it was a simple tennis game!',
  'In Norway, you can\'t be buried in a casket — you have to be cremated or buried in a biodegradable bag!',
  'The world\'s smallest mammal is the bumblebee bat — it weighs less than a penny!',
  'In ancient Rome, people used urine to whiten their teeth!',
  'A "zeedonk" is a real animal — a zebra and donkey hybrid!',
  'The Hawaiian alphabet has only 12 letters: A, E, I, O, U, H, K, L, M, N, P, W!',
  'In 1919, a wave of molasses 25 feet tall flooded Boston — 21 people died!',
  'The first oranges weren\'t orange — they were green!',
  'In Iceland, there are no mosquitoes — the climate is too cold for them!',
  'A "gaggle" is a group of geese on the ground; in the air they\'re a "skein"!',
  'The first computer "bug" was a real moth stuck in a machine in 1947!',
  'In Japan, there\'s a whole island overrun by friendly wild rabbits!',
  'The longest recorded flight of a chicken is 13 seconds!',
  'In France, it\'s illegal to name a pig "Napoleon"!',
  'A "crash" is a group of rhinos!',
  'The first email was sent in 1971 — the sender has forgotten what it said!',
  'In Australia, there are more kangaroos than people!',
  'A "parliament" is a group of owls!',
];

export function getRandomDidYouKnowFact(): string {
  return DID_YOU_KNOW_FACTS[Math.floor(Math.random() * DID_YOU_KNOW_FACTS.length)];
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
  { id: 'fg1', front: 'Bonjour', back: 'Hello / Good day (French)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { id: 'fg2', front: 'Konnichiwa', back: 'Hello (Japanese)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600' },
  { id: 'fg3', front: 'Hola', back: 'Hello (Spanish)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600' },
  { id: 'fg4', front: 'Ciao', back: 'Hello / Goodbye (Italian)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600' },
  { id: 'fg5', front: 'Olá', back: 'Hello (Portuguese)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600' },
  { id: 'fg6', front: 'Namaste', back: 'Hello / I bow to you (Hindi)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1524496128540-801c43a8e2e8?w=600' },
  { id: 'fg7', front: 'Annyeonghaseyo', back: 'Hello (Korean)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
  { id: 'fg8', front: 'Hej', back: 'Hello (Swedish / Danish)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600' },
  { id: 'fg9', front: 'Merhaba', back: 'Hello (Turkish)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
  { id: 'fg10', front: 'Sawadee', back: 'Hello (Thai)', icon: '', deck: 'greetings', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },

  // Food (10)
  { id: 'ff1', front: 'Sushi', back: 'Vinegared rice with toppings (Japan)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600' },
  { id: 'ff2', front: 'Croissant', back: 'Buttery crescent-shaped pastry (France)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f575c4d?w=600' },
  { id: 'ff3', front: 'Taco', back: 'Folded tortilla with fillings (Mexico)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600' },
  { id: 'ff4', front: 'Pasta', back: 'Wheat dough in many shapes (Italy)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600' },
  { id: 'ff5', front: 'Kimchi', back: 'Fermented spicy vegetables (Korea)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=600' },
  { id: 'ff6', front: 'Pho', back: 'Aromatic noodle soup (Vietnam)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600' },
  { id: 'ff7', front: 'Falafel', back: 'Fried chickpea balls (Middle East)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1593001872095-7d5b3868dd20?w=600' },
  { id: 'ff8', front: 'Dim Sum', back: 'Small steamed dishes (China)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600' },
  { id: 'ff9', front: 'Paella', back: 'Saffron rice with seafood (Spain)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600' },
  { id: 'ff10', front: 'Pierogi', back: 'Stuffed dumplings (Poland)', icon: '', deck: 'food', imageUrl: 'https://images.unsplash.com/photo-1587389882198-1f22f10b8420?w=600' },

  // Landmarks (8)
  { id: 'fl1', front: 'Eiffel Tower', back: 'Iconic iron tower in Paris, France', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { id: 'fl2', front: 'Great Wall', back: 'Ancient wall stretching 13,000+ miles (China)', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600' },
  { id: 'fl3', front: 'Colosseum', back: 'Ancient amphitheater in Rome, Italy', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600' },
  { id: 'fl4', front: 'Machu Picchu', back: 'Inca citadel high in the Andes, Peru', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
  { id: 'fl5', front: 'Taj Mahal', back: 'White marble mausoleum in India', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600' },
  { id: 'fl6', front: 'Pyramids of Giza', back: 'Ancient tombs of pharaohs in Egypt', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600' },
  { id: 'fl7', front: 'Big Ben', back: 'Famous clock tower in London, England', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
  { id: 'fl8', front: 'Statue of Liberty', back: 'Gift from France, stands in New York', icon: '', deck: 'landmarks', imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=600' },

  // Fun Expressions (8)
  { id: 'fe1', front: 'C\'est la vie', back: 'That\'s life (French)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },
  { id: 'fe2', front: 'Kawaii', back: 'Cute / adorable (Japanese)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
  { id: 'fe3', front: 'Hygge', back: 'Cozy comfort & togetherness (Danish)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600' },
  { id: 'fe4', front: 'Wanderlust', back: 'Strong desire to travel (German)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600' },
  { id: 'fe5', front: 'Bon appétit', back: 'Enjoy your meal! (French)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
  { id: 'fe6', front: 'Saudade', back: 'Deep longing & nostalgia (Portuguese)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1513735492246-483525079686?w=600' },
  { id: 'fe7', front: 'Fiesta', back: 'Party or celebration (Spanish)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600' },
  { id: 'fe8', front: 'Aloha', back: 'Hello, goodbye & love (Hawaiian)', icon: '', deck: 'expressions', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },

  // Korean phrases
  { id: 'fkr1', front: 'Annyeonghaseyo', back: 'Hello (Korean)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600' },
  { id: 'fkr2', front: 'Kamsahamnida', back: 'Thank you (Korean)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664107314e?w=600' },
  { id: 'fkr3', front: 'Annyeonghi gaseyo', back: 'Goodbye (Korean)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600' },
  { id: 'fkr4', front: 'Ne', back: 'Yes (Korean)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1570521462033-3015e76e7432?w=600' },

  // Thai phrases
  { id: 'fth1', front: 'Sawadee krap/ka', back: 'Hello (Thai)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600' },
  { id: 'fth2', front: 'Khop khun krap/ka', back: 'Thank you (Thai)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600' },
  { id: 'fth3', front: 'Sabai dee mai?', back: 'How are you? (Thai)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600' },
  { id: 'fth4', front: 'Aroi', back: 'Delicious (Thai)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600' },

  // Arabic/Darija phrases (Morocco)
  { id: 'fma1', front: 'Salam', back: 'Hello / Peace (Moroccan Arabic)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600' },
  { id: 'fma2', front: 'Shukran', back: 'Thank you (Arabic)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1545076380-9e0c7e8f8e26?w=600' },
  { id: 'fma3', front: 'Labas?', back: 'How are you? (Moroccan Darija)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1511185307590-3c29c11275ca?w=600' },
  { id: 'fma4', front: 'Bislama', back: 'Goodbye (Moroccan Darija)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1548018560-c7196a4f5e0f?w=600' },

  // Spanish/Quechua phrases (Peru)
  { id: 'fpe1', front: 'Hola', back: 'Hello (Peruvian Spanish)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
  { id: 'fpe2', front: 'Allianchu?', back: 'How are you? (Quechua)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600' },
  { id: 'fpe3', front: 'Añay', back: 'Thank you (Quechua)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1531968455001-5c5272a67c71?w=600' },
  { id: 'fpe4', front: 'Tupananchiskama', back: 'See you later (Quechua)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1548820488-e46acfff3c7d?w=600' },

  // Swahili phrases (Kenya)
  { id: 'fke1', front: 'Jambo', back: 'Hello (Swahili)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
  { id: 'fke2', front: 'Asante', back: 'Thank you (Swahili)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600' },
  { id: 'fke3', front: 'Habari?', back: 'How are you? / What\'s the news? (Swahili)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600' },
  { id: 'fke4', front: 'Hakuna matata', back: 'No worries (Swahili)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600' },

  // Norwegian phrases
  { id: 'fno1', front: 'Hei', back: 'Hello (Norwegian)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
  { id: 'fno2', front: 'Takk', back: 'Thank you (Norwegian)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1520769669658-f07657e5b307?w=600' },
  { id: 'fno3', front: 'Ha det bra', back: 'Goodbye (Norwegian)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600' },
  { id: 'fno4', front: 'Skål', back: 'Cheers! (Norwegian)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },

  // Turkish phrases
  { id: 'ftr1', front: 'Merhaba', back: 'Hello (Turkish)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600' },
  { id: 'ftr2', front: 'Teşekkürler', back: 'Thank you (Turkish)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1530533718754-001d2668365a?w=600' },
  { id: 'ftr3', front: 'Güle güle', back: 'Goodbye (Turkish)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' },
  { id: 'ftr4', front: 'Evet', back: 'Yes (Turkish)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600' },

  // Greek phrases
  { id: 'fgr1', front: 'Yia sou', back: 'Hello / Goodbye (Greek)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600' },
  { id: 'fgr2', front: 'Efcharistó', back: 'Thank you (Greek)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600' },
  { id: 'fgr3', front: 'Parakaló', back: 'Please / You\'re welcome (Greek)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600' },
  { id: 'fgr4', front: 'Opa!', back: 'Hooray! / expression of joy (Greek)', icon: '', deck: 'phrases', imageUrl: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600' },

  // Sustainability / Eco (10)
  { id: 'fs1', front: 'Carbon footprint', back: 'The total carbon emissions linked to what you do or use', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600' },
  { id: 'fs2', front: 'Compost', back: 'Decayed organic matter used to enrich soil; also the process of making it', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600' },
  { id: 'fs3', front: 'Recycle', back: 'To process used materials so they can be made into new products', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600' },
  { id: 'fs4', front: 'Biodiversity', back: 'The variety of life in a habitat or ecosystem', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
  { id: 'fs5', front: 'Single-use', back: 'Describes items meant to be used once then thrown away (e.g. plastic bags)', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600' },
  { id: 'fs6', front: 'Sustainable', back: 'Meeting needs without harming the ability of future generations to meet theirs', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600' },
  { id: 'fs7', front: 'Slow travel', back: 'Traveling fewer places and staying longer to reduce impact and enjoy more', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f7?w=600' },
  { id: 'fs8', front: 'Beach cleanup', back: 'Volunteer activity to remove trash from beaches and shorelines', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600' },
  { id: 'fs9', front: 'Reef-safe', back: 'Product (e.g. sunscreen) that does not harm coral and marine life', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600' },
  { id: 'fs10', front: 'Food waste', back: 'Food that is thrown away instead of being eaten or composted', icon: '', deck: 'sustainability', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600' },
];

export const FLASHCARD_DECKS = [
  { id: 'greetings', title: 'World Greetings', icon: '', count: 10 },
  { id: 'food', title: 'World Foods', icon: '', count: 10 },
  { id: 'food_discovery', title: 'My Discoveries', icon: 'food', count: 0 },
  { id: 'landmarks', title: 'Famous Landmarks', icon: '', count: 8 },
  { id: 'expressions', title: 'Fun Expressions', icon: '', count: 8 },
  { id: 'phrases', title: 'World Phrases', icon: '', count: 32 },
  { id: 'sustainability', title: 'Eco Words', icon: '', count: 10 },
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
      { text: 'Hello! In many languages, the greeting changes based on the time of day.', icon: 'sparkles', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600' },
      { text: '"Bonjour" means good day in French. Use it from morning to evening!', icon: 'language', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: '"Konnichiwa" is hello in Japanese. It literally means "this day is..."', icon: 'language', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { text: '"Hola" is hello in Spanish — simple, warm, and used everywhere!', icon: 'language', imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600' },
      { text: '"Namaste" in Hindi means "I bow to you" — a beautiful, respectful greeting.', icon: 'language', imageUrl: 'https://images.unsplash.com/photo-1524496128540-801c43a8e2e8?w=600' },
      { text: 'Great job! You learned 4 new greetings. Try using one today!', icon: 'gift' },
    ],
  },
  lang2: {
    title: 'Ordering Food',
    slides: [
      { text: 'Hungry? Let\'s learn how to order food around the world!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
      { text: 'In France, say "Je voudrais..." (I would like...) to be polite.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f575c4d?w=600' },
      { text: 'In Japan, point at the menu and say "Kore o kudasai" (This one, please).', icon: '', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600' },
      { text: '"La cuenta, por favor" means "The check, please" in Spanish.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600' },
      { text: 'In Italy, say "Vorrei..." (I\'d like...) — they love when tourists try!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
    ],
  },
  lang3: {
    title: 'Asking for Directions',
    slides: [
      { text: 'Lost? No worries — let\'s learn to ask for directions!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: '"Où est...?" means "Where is...?" in French. Add any place after it!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
      { text: '"Sumimasen, ... wa doko desu ka?" means "Excuse me, where is...?" in Japanese.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { text: '"¿Dónde está...?" is "Where is...?" in Spanish.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: 'Pointing at a map and smiling is universal — and always works!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
    ],
  },
  lang4: {
    title: 'Saying Thank You',
    slides: [
      { text: 'Gratitude is universal! Let\'s learn to say "thank you" around the world.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { text: '"Merci" (mair-SEE) is thank you in French. Add "beaucoup" for "very much!"', icon: '', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: '"Arigatou gozaimasu" is the polite way to say thanks in Japanese.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
      { text: '"Gracias" is thank you in Spanish. "Muchas gracias" means many thanks!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
      { text: '"Danke" in German, "Obrigado/a" in Portuguese, "Xièxiè" in Chinese!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
      { text: 'Saying thanks in the local language always makes people smile!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
    ],
  },
  slang1: {
    title: 'Common Expressions',
    slides: [
      { text: 'Every language has fun everyday expressions! Let\'s learn some.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
      { text: '"C\'est la vie" — That\'s life! A classic French way of accepting things.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: '"No worries" is Australian for "it\'s all good, mate!"', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
      { text: '"Kawaii!" means "cute!" in Japanese — you\'ll hear it everywhere!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { text: '"Fiesta!" means party in Spanish — because every day could be a celebration!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600' },
    ],
  },
  slang2: {
    title: 'Unique Untranslatable Words',
    slides: [
      { text: 'Some words exist in only one language — and they\'re magical!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
      { text: '"Hygge" (HOO-gah) is Danish for cozy comfort and being with friends.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
      { text: '"Saudade" is Portuguese for a deep, beautiful longing for something.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
      { text: '"Wabi-sabi" is Japanese for finding beauty in imperfection.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
      { text: '"Wanderlust" is German for the irresistible desire to travel!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
      { text: 'These words show that every culture sees the world uniquely!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
    ],
  },
  slang3: {
    title: 'Funny False Friends',
    slides: [
      { text: '"False friends" are words that look the same but mean totally different things!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
      { text: '"Gift" means poison in German — not the best birthday surprise!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: '"Embarazada" in Spanish means pregnant, NOT embarrassed!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { text: '"Bras" means arm in French — not what you think!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
      { text: 'These mix-ups are why learning languages is so funny and important!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
    ],
  },
  cult1: {
    title: 'Festival Traditions',
    slides: [
      { text: 'Festivals are celebrations of culture, food, and togetherness!', icon: 'sparkles', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600' },
      { text: 'Diwali, the Festival of Lights, lights up India with lamps and fireworks.', icon: 'culture', imageUrl: 'https://images.unsplash.com/photo-1609873814058-a8928924184a?w=600' },
      { text: 'Carnival in Brazil features samba dancing, wild costumes, and parades!', icon: 'culture', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600' },
      { text: 'Hanami in Japan is the tradition of having picnics under cherry blossoms.', icon: 'culture', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600' },
      { text: 'Día de los Muertos in Mexico honors loved ones with beautiful altars.', icon: 'culture', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600' },
      { text: 'Every festival tells a unique story about its people and their values.', icon: 'gift' },
    ],
  },
  cult2: {
    title: 'Music Around the World',
    slides: [
      { text: 'Music is a language everyone speaks! Let\'s explore world music.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600' },
      { text: 'Flamenco from Spain features passionate guitar and stomping dance.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600' },
      { text: 'Taiko drums from Japan are massive and their beats shake the ground!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' },
      { text: 'Samba from Brazil makes everyone want to move their feet!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd27eacf42d1?w=600' },
      { text: 'Reggae from Jamaica spreads messages of peace and love worldwide.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600' },
      { text: 'K-Pop from South Korea has fans dancing on every continent!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600' },
    ],
  },
  cult3: {
    title: 'Traditional Clothing',
    slides: [
      { text: 'Traditional clothes tell stories about a culture\'s history and values!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
      { text: 'The Japanese kimono is wrapped left over right and tied with an obi belt.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
      { text: 'India\'s sari is one long cloth that can be draped in over 80 different ways!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
      { text: 'The Scottish kilt is a knee-length skirt with a tartan pattern.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
      { text: 'Mexican huipils are colorful embroidered tunics that represent local identity.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
    ],
  },
  hist1: {
    title: 'Ancient Wonders',
    slides: [
      { text: 'The ancient world built things that still amaze us today!', icon: 'sparkles', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
      { text: 'The Pyramids of Giza are over 4,500 years old and almost perfectly aligned.', icon: 'history', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
      { text: 'The Great Wall of China stretches over 13,000 miles across mountains!', icon: 'history', imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600' },
      { text: 'The Colosseum in Rome could hold 50,000 spectators!', icon: 'history', imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600' },
      { text: 'Machu Picchu was hidden in the clouds for centuries until 1911.', icon: 'history', imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600' },
      { text: 'These wonders prove that humans have always dreamed big!', icon: 'gift' },
    ],
  },
  hist2: {
    title: 'Famous Explorers',
    slides: [
      { text: 'Throughout history, brave explorers set out into the unknown!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: 'Marco Polo traveled from Italy to China in the 1200s — a 24-year journey!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
      { text: 'Ibn Battuta from Morocco traveled 75,000 miles across Africa and Asia!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
      { text: 'Zheng He commanded huge Chinese treasure fleets across the Indian Ocean.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { text: 'Sacagawea helped guide Lewis & Clark across North America.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
      { text: 'YOU are an explorer too — discovering the world one lesson at a time!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
    ],
  },
  etiq1: {
    title: 'Table Manners Worldwide',
    slides: [
      { text: 'Table manners are different everywhere — let\'s learn what\'s polite!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
      { text: 'In Japan, slurping noodles is a compliment to the chef!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600' },
      { text: 'In France, keep both hands visible on the table (not in your lap).', icon: '', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f575c4d?w=600' },
      { text: 'In India, always eat with your right hand — the left is considered rude.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600' },
      { text: 'In China, never stick chopsticks straight up in your rice bowl.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600' },
      { text: 'Knowing these customs shows respect for the culture you\'re visiting!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
    ],
  },
  etiq2: {
    title: 'Greeting Customs',
    slides: [
      { text: 'How you say hello changes around the world!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
      { text: 'In Japan, bow to show respect — the deeper the bow, the more respect.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
      { text: 'In France, friends greet with "la bise" — kisses on alternating cheeks.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: 'In Thailand, press your palms together and bow — called a "wai."', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
      { text: 'In New Zealand, the Māori hongi presses foreheads and noses together.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
      { text: 'Every greeting style has a beautiful meaning behind it!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
    ],
  },
  geo1: {
    title: 'Continents & Oceans',
    slides: [
      { text: 'Our planet has 7 continents and 5 oceans — let\'s explore them!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
      { text: 'Asia is the largest continent — home to over 4 billion people!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { text: 'Africa has the most countries (54!) and the Sahara, the biggest hot desert.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
      { text: 'The Pacific Ocean is bigger than ALL the land on Earth combined!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
      { text: 'Antarctica is the coldest continent — penguins love it, but few people live there!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
      { text: 'Every corner of our planet has something amazing to discover!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
      { text: 'Planet fact: The oceans produce over 50% of the world\'s oxygen. Protecting them protects us!', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
    ],
  },
  geo2: {
    title: 'Amazing Natural Wonders',
    slides: [
      { text: 'Nature creates the most incredible sights on Earth!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
      { text: 'The Grand Canyon is so deep, it took the Colorado River 6 million years to carve!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
      { text: 'The Northern Lights (Aurora Borealis) paint the sky with dancing colors.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
      { text: 'The Great Barrier Reef is the largest living structure — visible from space!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
      { text: 'Victoria Falls on the Zambia-Zimbabwe border is called "the smoke that thunders."', icon: '', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
      { text: 'Mount Everest grows about 4mm taller every year!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
    ],
  },
  kr_intro: {
    title: 'Discover South Korea',
    slides: [
      { text: 'South Korea is a small but mighty country in East Asia, famous for technology, music, and delicious food!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
      { text: 'K-pop groups like BTS train for years in singing, dancing, and languages before they debut. Music videos can get billions of views!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600' },
      { text: 'Kimchi is eaten at almost every Korean meal. Families make huge batches together each autumn in a tradition called "kimjang."', icon: '', imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664f59e1a4?w=600' },
      { text: 'Hangul, the Korean alphabet, was invented by King Sejong the Great in 1443 so everyone could learn to read — not just scholars!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
    ],
  },
  th_intro: {
    title: 'Discover Thailand',
    slides: [
      { text: 'Thailand is known as the "Land of Smiles." It has golden temples, tropical beaches, and some of the best street food in the world!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
      { text: 'Thailand has over 40,000 Buddhist temples. Monks walk barefoot each morning to collect food offerings from the community.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600' },
      { text: 'Songkran, the Thai New Year in April, is the world\'s biggest water fight! Everyone splashes each other in the streets for three days.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600' },
      { text: 'Elephants are deeply respected in Thai culture. The white elephant is the royal symbol, and sanctuaries care for rescued elephants.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
    ],
  },
  ma_intro: {
    title: 'Discover Morocco',
    slides: [
      { text: 'Morocco is in North Africa, where the Sahara Desert meets the Atlantic Ocean. Its cities are full of color, spice, and history!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
      { text: 'Moroccan medinas are winding old cities packed with shops. In Marrakech, you can find everything from leather goods to fresh spices!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
      { text: 'Mint tea is poured from high up to create a frothy top. It is offered as a sign of friendship — refusing a glass is considered rude!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=600' },
      { text: 'Berber women in the Atlas Mountains hand-weave carpets with patterns that tell stories. Each symbol has a secret meaning!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
    ],
  },
  pe_intro: {
    title: 'Discover Peru',
    slides: [
      { text: 'Peru is a land of extremes — towering Andes mountains, lush Amazon rainforest, and a long desert coastline all in one country!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
      { text: 'Machu Picchu, the lost Inca city, sits high in the clouds. The stones fit together so perfectly that no mortar was needed!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600' },
      { text: 'Peru is the birthplace of the potato — over 3,000 varieties grow here! Purple, yellow, red, and even blue potatoes.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600' },
      { text: 'Peruvian weavers use techniques passed down for 5,000 years. Alpaca wool is softer than sheep wool and comes in 22 natural colors!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
    ],
  },
  ke_intro: {
    title: 'Discover Kenya',
    slides: [
      { text: 'Kenya is in East Africa and is famous for its incredible wildlife. Safaris here let you see lions, elephants, and giraffes up close!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
      { text: 'The Great Migration sees over 1.5 million wildebeest cross the Maasai Mara each year — one of nature\'s most amazing events!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
      { text: 'The Maasai people are famous for their red clothing, beaded jewelry, and the adumu jumping dance. The highest jumper earns great respect!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600' },
      { text: 'Kenyan runners dominate long-distance races worldwide. Eliud Kipchoge was the first human to run a marathon in under 2 hours!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
    ],
  },
  no_intro: {
    title: 'Discover Norway',
    slides: [
      { text: 'Norway is a Scandinavian country of dramatic fjords, midnight sun, and Viking history. Nature here is truly breathtaking!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
      { text: 'Vikings sailed from Norway over 1,000 years ago. They reached Iceland, Greenland, and even North America in their famous longships!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
      { text: 'The northern lights (aurora borealis) paint Norway\'s sky with dancing ribbons of green, purple, and pink light in winter.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
      { text: 'Norwegians love "friluftsliv" (open-air living). They hike, ski, and enjoy nature all year round — even when it\'s snowing!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
    ],
  },
  tr_intro: {
    title: 'Discover Turkey',
    slides: [
      { text: 'Turkey bridges Europe and Asia. Istanbul is the only major city in the world that sits on two continents!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
      { text: 'The Grand Bazaar in Istanbul has over 4,000 shops and has been open since 1461. You can buy spices, lamps, carpets, and Turkish delight!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600' },
      { text: 'In Cappadocia, hundreds of hot air balloons float over fairy chimneys at dawn. Ancient people carved homes inside these rock towers!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600' },
      { text: 'Turkish hammams (bathhouses) have been a tradition for over 600 years. People go to steam, scrub, and relax together!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
    ],
  },
  gr_intro: {
    title: 'Discover Greece',
    slides: [
      { text: 'Greece is the birthplace of democracy, the Olympics, and Western philosophy. Its sunny islands and ancient ruins attract millions of visitors!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600' },
      { text: 'Ancient Greeks believed 12 gods lived on Mount Olympus. Stories of Zeus, Athena, and Hercules are still told around the world today!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
      { text: 'Greece has about 6,000 islands! Santorini\'s white buildings and blue domes overlooking the sea are one of the most photographed sights on Earth.', icon: '', imageUrl: 'https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?w=600' },
      { text: 'The ancient Olympics began in 776 BC. Athletes competed in running, wrestling, and chariot racing. Wars were paused so they could compete!', icon: '', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600' },
    ],
  },

  // ─── SUSTAINABILITY (Planet & People) ───
  sustain_travel: {
    title: 'Sustainable Travel',
    slides: [
      { text: 'Travel opens our minds — and we can do it in ways that help the planet!', icon: 'compass', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600' },
      { text: 'Trains and buses often have a smaller carbon footprint than flying. For short trips, choose rail or coach when you can.', icon: 'compass', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600' },
      { text: 'Slow travel means staying longer in one place. You see more, stress less, and cut down on back-and-forth trips.', icon: 'compass', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600' },
      { text: 'Support local: eat at neighborhood spots, buy from markets, and choose eco-friendly tours. Your choices matter!', icon: 'compass', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600' },
      { text: 'You\'re already helping by learning about the world. Thoughtful travel makes it even better!', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600' },
    ],
  },
  sustain_food: {
    title: 'Food & the Planet',
    slides: [
      { text: 'What we eat affects the Earth. Small changes can add up to a big difference!', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600' },
      { text: 'Seasonal and local food often uses less energy to grow and transport. Farmers\' markets are a great place to start.', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600' },
      { text: 'Reducing food waste saves money and the planet. Plan meals, use leftovers, and compost when you can.', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600' },
      { text: 'Eating a bit less meat, especially red meat, can lower your carbon footprint. You don\'t have to give it up — just balance it.', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600' },
      { text: 'Every meal is a chance to choose kindness to the planet. You\'ve got this!', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600' },
    ],
  },
  sustain_oceans: {
    title: 'Oceans & Beaches',
    slides: [
      { text: 'Oceans feed us, give us oxygen, and connect every continent. Protecting them matters!', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
      { text: 'Plastic in the sea harms marine life. Saying no to single-use bags and bottles helps keep beaches and water clean.', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600' },
      { text: 'Beach cleanups are a simple way to help. Even 30 minutes of picking up trash makes a difference.', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600' },
      { text: 'Reef-safe sunscreen protects coral. When you swim in the ocean, your choices can help the creatures that live there.', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600' },
      { text: 'You and Visby can be ocean guardians. Every small action counts!', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
    ],
  },
  jp_intro: {
    title: 'Discover Japan',
    slides: [
      { text: 'Welcome to Japan — a land where ancient traditions and futuristic cities live side by side!', icon: 'sparkles', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600' },
      { text: 'Japan is an archipelago — a chain of 6,852 islands! The four main ones are Honshu, Hokkaido, Kyushu, and Shikoku.', icon: 'globe', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600' },
      { text: 'Mount Fuji is Japan\'s tallest peak at 3,776 meters. It\'s a sacred symbol and millions of people hike it each summer!', icon: 'nature', imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600' },
      { text: 'The Japanese writing system uses three scripts: hiragana, katakana, and kanji. Kids learn hiragana first — it has 46 characters!', icon: 'language' },
      { text: '"Konnichiwa" means hello, "Arigatou" means thank you, and "Sumimasen" means excuse me. Try saying them!', icon: 'language' },
      { text: 'Cherry blossom season (hanami) is celebrated every spring. Families picnic under the pink trees — it\'s magical!', icon: 'heart', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600' },
      { text: 'Japan invented sushi, ramen, matcha tea, and Pocky! Japanese food focuses on fresh ingredients and beautiful presentation.', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600' },
      { text: 'You\'ve taken your first steps into Japan! There\'s so much more to discover — temples, robots, anime, and ancient samurai stories await.', icon: 'gift' },
      { text: 'Planet fact: Japan recycles over 84% of its plastic bottles — one of the highest rates in the world!', icon: 'nature' },
    ],
  },
  fr_intro: {
    title: 'Discover France',
    slides: [
      { text: 'Bienvenue en France! A country of art, fashion, incredible food, and one of the most famous towers on Earth.', icon: 'sparkles', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { text: 'France is the most visited country in the world — over 90 million tourists come every year! Paris alone has 2,000+ years of history.', icon: 'globe' },
      { text: 'The Eiffel Tower was built in 1889 and was supposed to be torn down after 20 years. People loved it so much, it stayed forever!', icon: 'landmark', imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600' },
      { text: 'French is spoken on every continent. Over 300 million people speak it worldwide — it\'s one of the most useful languages to learn!', icon: 'language' },
      { text: '"Bonjour" means hello, "Merci" means thank you, and "Oui" means yes. The French love it when visitors try to speak their language!', icon: 'language' },
      { text: 'France is the birthplace of croissants, crème brûlée, baguettes, and crêpes. French chefs are considered some of the best in the world!', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600' },
      { text: 'The Louvre Museum in Paris is the world\'s largest art museum. It would take 100 days to spend 30 seconds with every artwork!', icon: 'culture', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },
      { text: 'Magnifique! You\'ve begun exploring France. Wine-covered valleys, medieval castles, and French phrases await your discovery!', icon: 'gift' },
      { text: 'Planet fact: France banned supermarkets from throwing away unsold food — it must be donated instead. What a great idea!', icon: 'nature' },
    ],
  },
  food1: {
    title: 'Food Around the World',
    slides: [
      { text: 'Food tells the story of a culture! What people eat reveals their history, climate, traditions, and creativity.', icon: 'food' },
      { text: 'In Japan, ramen isn\'t just a quick meal — each region has its own broth style. Tonkotsu, miso, shoyu, shio — they\'re all different!', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600' },
      { text: 'In France, cheese is an art form. There are over 1,600 types of French cheese — one for every day of 4 years!', icon: 'food' },
      { text: 'Mexican street tacos use soft corn tortillas, not the hard shells you might know. The corn tortilla was invented over 10,000 years ago!', icon: 'food', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600' },
      { text: 'In India, spices like turmeric, cumin, and cardamom aren\'t just for flavor — many have been used in traditional medicine for thousands of years.', icon: 'food' },
      { text: 'Italian pasta comes in over 350 shapes! Each shape is designed to hold a specific type of sauce. Design meets deliciousness!', icon: 'food' },
      { text: 'In Ethiopia, people eat from a shared plate using injera — a spongy flatbread that\'s also your utensil. Food brings people together!', icon: 'heart' },
      { text: 'Every dish has a story. As you explore countries in Visby, discover what makes their food special!', icon: 'gift' },
      { text: 'Planet fact: About 1/3 of all food produced globally is wasted. Eating local and seasonal food helps reduce this!', icon: 'nature' },
    ],
  },
  culture1: {
    title: 'Cultures of the World',
    slides: [
      { text: 'Culture is everything that makes a group of people unique — their art, music, stories, celebrations, and ways of life.', icon: 'sparkles' },
      { text: 'In Japan, the tea ceremony (chanoyu) can take hours. Every movement is precise and meaningful — it\'s meditation through tea.', icon: 'culture', imageUrl: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600' },
      { text: 'In West Africa, griots are storytellers who memorize entire histories of their people. They pass down knowledge through songs and tales.', icon: 'culture' },
      { text: 'India\'s Bollywood makes more films per year than Hollywood! Indian cinema combines drama, music, and incredible dance numbers.', icon: 'culture' },
      { text: 'In New Zealand, the Maori "haka" is a powerful ceremonial dance. It\'s performed before important events and even rugby matches!', icon: 'culture' },
      { text: 'The Day of the Dead in Mexico isn\'t scary — it\'s a celebration! Families honor loved ones with altars, marigolds, and their favorite foods.', icon: 'culture', imageUrl: 'https://images.unsplash.com/photo-1509003345712-37614e42c5ce?w=600' },
      { text: 'In Scandinavia, "hygge" is the art of coziness — candles, warm blankets, hot chocolate, and time with loved ones. It\'s a whole lifestyle!', icon: 'heart' },
      { text: 'Every culture has something beautiful to share. Keep exploring and you\'ll see how wonderfully different — and similar — we all are!', icon: 'gift' },
    ],
  },
};

// ─── MYTHS AND LEGENDS ───

export interface Myth {
  id: string;
  title: string;
  countryId: string;
  story: string[];
  moral: string;
  modernConnection: string;
  quiz: { question: string; options: string[]; correct: number }[];
  flashcard: { front: string; back: string };
  imageUrl?: string;
}

export const MYTHS_AND_LEGENDS: Myth[] = [
  {
    id: 'myth_kitsune', title: 'The Kitsune Fox Spirits', countryId: 'jp',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
    story: [
      'In Japanese folklore, foxes (kitsune) are magical creatures that grow more powerful with age. A fox that lives 100 years can shape-shift into a human!',
      'Kitsune can have up to nine tails — the more tails, the older and wiser the fox. A nine-tailed fox is said to be almost a god.',
      'Some kitsune are mischievous tricksters, while others serve as faithful guardians of Inari shrines. You can see fox statues at thousands of shrines across Japan.',
    ],
    moral: 'Wisdom comes with age and experience.',
    modernConnection: 'Kitsune appear in popular anime, video games, and manga — they\'re one of Japan\'s most beloved mythical creatures!',
    quiz: [
      { question: 'How many tails can a kitsune have?', options: ['3', '5', '9', '12'], correct: 2 },
      { question: 'What can a 100-year-old kitsune do?', options: ['Fly', 'Shape-shift', 'Breathe fire', 'Become invisible'], correct: 1 },
      { question: 'Kitsune statues guard which type of shrine?', options: ['Inari', 'Meiji', 'Itsukushima', 'Senso-ji'], correct: 0 },
    ],
    flashcard: { front: 'What is a kitsune?', back: 'A magical fox spirit in Japanese mythology that can shape-shift and grow up to 9 tails' },
  },
  {
    id: 'myth_tanuki', title: 'The Tanuki Trickster', countryId: 'jp',
    imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600',
    story: [
      'The tanuki (raccoon dog) is one of Japan\'s cheekiest mythical characters. In legends, tanuki can shape-shift using leaves placed on their heads!',
      'Tanuki love sake, food, and playing pranks on travelers. They often disguise themselves as monks, merchants, or even teapots to trick people.',
      'Despite their mischief, tanuki bring good luck. Statues of tanuki with big bellies and straw hats stand outside restaurants and shops all over Japan.',
    ],
    moral: 'A little mischief can bring joy, but don\'t take tricks too far!',
    modernConnection: 'The Tanooki Suit in Super Mario was inspired by tanuki mythology — it lets Mario fly and turn into a statue!',
    quiz: [
      { question: 'What does a tanuki place on its head to transform?', options: ['A hat', 'A leaf', 'A flower', 'A stone'], correct: 1 },
      { question: 'Tanuki statues outside shops are meant to bring...', options: ['Rain', 'Good luck', 'Silence', 'Wind'], correct: 1 },
      { question: 'What famous video game features a tanuki suit?', options: ['Zelda', 'Pokémon', 'Super Mario', 'Sonic'], correct: 2 },
    ],
    flashcard: { front: 'What is a tanuki?', back: 'A shape-shifting raccoon dog from Japanese folklore that brings good luck and loves playing pranks' },
  },
  {
    id: 'myth_icarus', title: 'Icarus and the Sun', countryId: 'gr',
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600',
    story: [
      'Daedalus was a brilliant inventor trapped on the island of Crete with his son Icarus. He built wings from feathers and wax so they could fly to freedom.',
      'Before they flew, Daedalus warned Icarus: "Don\'t fly too close to the sun — the wax will melt. And don\'t fly too low — the sea will soak the feathers."',
      'But Icarus was so thrilled by flying that he soared higher and higher. The sun melted the wax, his wings fell apart, and Icarus fell into the sea.',
    ],
    moral: 'Balance and moderation are important. Listen to wise advice!',
    modernConnection: 'We still use the phrase "flying too close to the sun" to describe being too ambitious or reckless.',
    quiz: [
      { question: 'What were the wings made of?', options: ['Metal', 'Feathers and wax', 'Silk', 'Wood'], correct: 1 },
      { question: 'What melted the wings?', options: ['Rain', 'The sun', 'Lightning', 'Wind'], correct: 1 },
      { question: 'Who built the wings?', options: ['Zeus', 'Icarus', 'Daedalus', 'Athena'], correct: 2 },
    ],
    flashcard: { front: 'What happened to Icarus?', back: 'He flew too close to the sun with wax wings that melted, teaching a lesson about hubris and balance' },
  },
  {
    id: 'myth_minotaur', title: 'The Minotaur\'s Labyrinth', countryId: 'gr',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600',
    story: [
      'Deep beneath the palace of Knossos on Crete, King Minos built an impossible maze called the Labyrinth. Inside lived the Minotaur — half man, half bull.',
      'Every nine years, Athens had to send fourteen young people into the Labyrinth as sacrifice. The hero Theseus volunteered to end this terror.',
      'Princess Ariadne gave Theseus a ball of thread. He unraveled it as he walked so he could find his way back. He defeated the Minotaur and followed the thread to freedom!',
    ],
    moral: 'Courage and clever planning can overcome even the most frightening challenges.',
    modernConnection: 'The word "labyrinth" comes from this myth, and mazes in games and movies are inspired by the original!',
    quiz: [
      { question: 'Where was the Labyrinth located?', options: ['Athens', 'Crete', 'Sparta', 'Troy'], correct: 1 },
      { question: 'What did Ariadne give Theseus?', options: ['A sword', 'A map', 'A ball of thread', 'A shield'], correct: 2 },
      { question: 'The Minotaur was half man and half...', options: ['Lion', 'Eagle', 'Bull', 'Horse'], correct: 2 },
    ],
    flashcard: { front: 'What is the Minotaur?', back: 'A half-man, half-bull creature that lived in a Labyrinth on Crete, defeated by Theseus using a thread' },
  },
  {
    id: 'myth_trolls', title: 'The Trolls of Norway', countryId: 'no',
    imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600',
    story: [
      'Norwegian legends are full of trolls — enormous, ancient beings that live in mountains and dark forests. Some are as tall as hills!',
      'Trolls are usually slow and not very clever, but incredibly strong. The biggest danger? Sunlight turns trolls to stone! That\'s why they only come out at night.',
      'Many unusual rock formations in Norway are said to be trolls caught by the sunrise. The famous cliff "Trolltunga" (Troll\'s Tongue) is named after one!',
    ],
    moral: 'Even the strongest creatures have weaknesses. Cleverness beats brute force.',
    modernConnection: 'Trolls appear in Frozen, Lord of the Rings, and Scandinavian fairy tales that inspired J.R.R. Tolkien!',
    quiz: [
      { question: 'What happens to trolls in sunlight?', options: ['They shrink', 'They turn to stone', 'They fly', 'They become invisible'], correct: 1 },
      { question: 'What does "Trolltunga" mean?', options: ['Troll mountain', 'Troll tongue', 'Troll bridge', 'Troll cave'], correct: 1 },
      { question: 'Trolls in Norwegian myths are usually...', options: ['Tiny and clever', 'Huge and slow', 'Fast and invisible', 'Small and musical'], correct: 1 },
    ],
    flashcard: { front: 'What are Norwegian trolls?', back: 'Giant mythical beings that live in mountains, are incredibly strong, but turn to stone in sunlight' },
  },
  {
    id: 'myth_ra', title: 'Ra\'s Journey Through the Sky', countryId: 'eg',
    imageUrl: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600',
    story: [
      'Ancient Egyptians believed the sun god Ra sailed across the sky each day in a golden boat, carrying the sun from east to west.',
      'Every night, Ra traveled through the dangerous underworld, fighting the giant serpent Apophis. If Apophis won, the sun would never rise again!',
      'But Ra always triumphed, and every morning the sun rose once more. The Egyptians celebrated each sunrise as Ra\'s victory over darkness.',
    ],
    moral: 'Every new day is a victory. Even after the darkest night, the light returns.',
    modernConnection: 'The Eye of Ra is one of the most recognizable ancient symbols and appears in jewelry, tattoos, and movies worldwide.',
    quiz: [
      { question: 'How did Ra travel across the sky?', options: ['On a chariot', 'In a golden boat', 'On wings', 'By flying carpet'], correct: 1 },
      { question: 'Who did Ra fight every night?', options: ['Anubis', 'Isis', 'Apophis', 'Osiris'], correct: 2 },
      { question: 'What happened when Ra won each morning?', options: ['It rained', 'The sun rose', 'Stars appeared', 'The moon glowed'], correct: 1 },
    ],
    flashcard: { front: 'Who is Ra?', back: 'The Egyptian sun god who sailed across the sky by day and battled the serpent Apophis through the underworld at night' },
  },
  {
    id: 'myth_anubis', title: 'Anubis, Guardian of the Dead', countryId: 'eg',
    imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600',
    story: [
      'Anubis was the jackal-headed god who guided souls to the afterlife. Ancient Egyptians believed he invented mummification to preserve the body of Osiris.',
      'In the Hall of Truth, Anubis weighed each person\'s heart against the Feather of Ma\'at (truth). A heart lighter than the feather meant a good life.',
      'If the heart was heavy with bad deeds, it would be devoured by the crocodile-headed monster Ammit. Only the pure of heart entered the afterlife paradise.',
    ],
    moral: 'Our actions matter. Living with kindness and truth leads to the best outcomes.',
    modernConnection: 'Anubis appears in countless movies, books, and games — he\'s one of the most iconic figures in world mythology!',
    quiz: [
      { question: 'What animal head does Anubis have?', options: ['Cat', 'Jackal', 'Hawk', 'Crocodile'], correct: 1 },
      { question: 'What did Anubis weigh hearts against?', options: ['A stone', 'Gold', 'A feather', 'A scroll'], correct: 2 },
      { question: 'What did Anubis invent according to myth?', options: ['Writing', 'Mummification', 'Pyramids', 'Papyrus'], correct: 1 },
    ],
    flashcard: { front: 'Who is Anubis?', back: 'The jackal-headed Egyptian god who guided souls to the afterlife and weighed hearts against the Feather of Truth' },
  },
  {
    id: 'myth_llorona', title: 'La Llorona - The Weeping Woman', countryId: 'mx',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600',
    story: [
      'La Llorona is one of Mexico\'s most famous legends. She was a beautiful woman named Maria who, in a moment of jealous rage, lost her children to a river.',
      'Overcome with grief, Maria wandered the riverbanks forever, weeping and searching for her children. Her cries echo through the night: "Ay, mis hijos!" (Oh, my children!)',
      'Mexican children are told to stay away from rivers at night, because La Llorona might mistake them for her own lost children and try to take them.',
    ],
    moral: 'Actions have consequences. Cherish and protect those you love.',
    modernConnection: 'La Llorona has been adapted into films, songs, and even appears in the animated movie Coco\'s cultural world.',
    quiz: [
      { question: 'Where does La Llorona wander?', options: ['Mountains', 'Forests', 'Riverbanks', 'Deserts'], correct: 2 },
      { question: '"Ay, mis hijos" means...', options: ['Help me', 'Oh, my children', 'Where am I', 'Good night'], correct: 1 },
      { question: 'La Llorona is a famous legend from...', options: ['Spain', 'Mexico', 'Peru', 'Cuba'], correct: 1 },
    ],
    flashcard: { front: 'Who is La Llorona?', back: 'The Weeping Woman of Mexican legend who wanders riverbanks crying for her lost children' },
  },
  {
    id: 'myth_quetzalcoatl', title: 'Quetzalcoatl - The Feathered Serpent', countryId: 'mx',
    imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600',
    story: [
      'Quetzalcoatl was one of the most important gods of the Aztec civilization — a magnificent feathered serpent who created humanity and gave people corn, art, and the calendar.',
      'His name means "precious feathered serpent" in Nahuatl. He represented wind, air, and learning. Temples shaped like stepped pyramids were built in his honor.',
      'According to legend, Quetzalcoatl sailed east on a raft of serpents, promising to return one day. When Spanish ships arrived, some Aztecs initially believed the prophecy had come true.',
    ],
    moral: 'Knowledge, creativity, and learning are the greatest gifts.',
    modernConnection: 'Quetzalcoatl appears in video games, movies, and the feathered serpent motif is still a beloved symbol in Mexican art.',
    quiz: [
      { question: 'What does Quetzalcoatl look like?', options: ['A dragon', 'A feathered serpent', 'A giant eagle', 'A winged jaguar'], correct: 1 },
      { question: 'What did Quetzalcoatl give to humans?', options: ['Fire', 'Corn and the calendar', 'Weapons', 'Horses'], correct: 1 },
      { question: 'Quetzalcoatl was a god of which civilization?', options: ['Maya', 'Inca', 'Aztec', 'Olmec'], correct: 2 },
    ],
    flashcard: { front: 'Who is Quetzalcoatl?', back: 'The Aztec feathered serpent god who gave humanity corn, art, and the calendar' },
  },
  {
    id: 'myth_ganesha', title: 'Ganesha - The Elephant God', countryId: 'in',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600',
    story: [
      'Ganesha is one of India\'s most beloved gods — recognized by his elephant head, round belly, and gentle nature. He\'s the remover of obstacles and the god of beginnings.',
      'According to Hindu mythology, Ganesha\'s mother Parvati created him from sandalwood paste to guard her door. When Lord Shiva didn\'t recognize the boy and a conflict arose, Ganesha received an elephant head to be brought back.',
      'Hindus pray to Ganesha before starting anything new — a journey, a business, an exam, or even writing a book. His festival, Ganesh Chaturthi, fills streets with music, dancing, and colorful clay statues!',
    ],
    moral: 'Every new beginning deserves respect and intention.',
    modernConnection: 'Ganesha statues are found worldwide as symbols of good luck, wisdom, and new beginnings.',
    quiz: [
      { question: 'Ganesha has the head of an...', options: ['Lion', 'Elephant', 'Tiger', 'Eagle'], correct: 1 },
      { question: 'Ganesha is the god of...', options: ['War', 'The sea', 'Beginnings and obstacles', 'Thunder'], correct: 2 },
      { question: 'People pray to Ganesha before...', options: ['Sleeping', 'Starting something new', 'Eating dinner', 'Sunset'], correct: 1 },
    ],
    flashcard: { front: 'Who is Ganesha?', back: 'The elephant-headed Hindu god of beginnings who removes obstacles — people pray to him before starting anything new' },
  },
  {
    id: 'myth_maui', title: 'Maui - The Demi-God Who Fished Up Islands', countryId: 'nz',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600',
    story: [
      'In Maori mythology, Maui was a clever demi-god who accomplished impossible feats. His most famous deed? Fishing up the entire North Island of New Zealand from the ocean!',
      'Using a magical fishhook made from his grandmother\'s jawbone, Maui cast his line deep into the sea. He pulled so hard that a massive fish rose from the water — Te Ika-a-Maui (the fish of Maui), which became the North Island.',
      'Maui also slowed down the sun by beating it with ropes so days would be longer, and he stole fire from the underworld goddess Mahuika to give to humans.',
    ],
    moral: 'Cleverness and determination can achieve what seems impossible.',
    modernConnection: 'Disney\'s Moana features Maui as a main character, bringing Polynesian mythology to a global audience!',
    quiz: [
      { question: 'What did Maui fish up from the ocean?', options: ['A whale', 'The North Island of New Zealand', 'A treasure chest', 'A sea monster'], correct: 1 },
      { question: 'Why did Maui slow down the sun?', options: ['To cool Earth', 'For longer days', 'To impress gods', 'For a festival'], correct: 1 },
      { question: 'Where does Maui appear in a popular film?', options: ['Frozen', 'Coco', 'Moana', 'Encanto'], correct: 2 },
    ],
    flashcard: { front: 'Who is Maui?', back: 'A Maori demi-god who fished up the North Island of New Zealand, slowed the sun, and stole fire for humans' },
  },
  {
    id: 'myth_anansi', title: 'Anansi the Spider', countryId: 'gh',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600',
    story: [
      'Anansi is a cunning spider from West African (Ashanti) folklore. Despite being small, Anansi outsmarts creatures much larger and stronger using his wits.',
      'In one famous tale, Anansi wanted to own all the stories in the world. The sky god Nyame said Anansi must capture a python, a leopard, and a swarm of hornets. Everyone laughed — but Anansi did it all through cleverness!',
      'When enslaved Africans were brought to the Caribbean, they carried Anansi stories with them. Anansi became a symbol of resistance and the power of the small against the mighty.',
    ],
    moral: 'Intelligence and creativity are more powerful than size or strength.',
    modernConnection: 'Anansi inspired the character Mr. Nancy in Neil Gaiman\'s American Gods and countless Caribbean folk tales.',
    quiz: [
      { question: 'Anansi is what kind of creature?', options: ['A turtle', 'A spider', 'A snake', 'A bird'], correct: 1 },
      { question: 'Anansi wanted to own all the world\'s...', options: ['Gold', 'Stories', 'Food', 'Music'], correct: 1 },
      { question: 'Anansi comes from which region\'s folklore?', options: ['East Asia', 'West Africa', 'South America', 'Northern Europe'], correct: 1 },
    ],
    flashcard: { front: 'Who is Anansi?', back: 'A clever spider from West African folklore who outsmarts larger creatures and owns all the world\'s stories' },
  },
  {
    id: 'myth_selkie', title: 'The Selkies of Scotland', countryId: 'gb',
    imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=600',
    story: [
      'In Celtic mythology, selkies are magical beings that live as seals in the ocean but can shed their skin to become humans on land.',
      'If a human finds and hides a selkie\'s seal skin, the selkie cannot return to the sea and must stay on land. Many sad love stories tell of selkies longing for the ocean.',
      'Scottish and Irish coastal villages have long told selkie tales. Fishermen believed that seals watching them from rocks might actually be selkies curious about human life.',
    ],
    moral: 'True freedom means being able to return to where you belong.',
    modernConnection: 'The animated film Song of the Sea beautifully tells a selkie story, and selkie legends inspire marine conservation!',
    quiz: [
      { question: 'What are selkies in the sea?', options: ['Dolphins', 'Whales', 'Seals', 'Otters'], correct: 2 },
      { question: 'What must a selkie shed to become human?', options: ['Scales', 'Tail', 'Seal skin', 'Fins'], correct: 2 },
      { question: 'Selkie stories come from which mythology?', options: ['Greek', 'Norse', 'Celtic', 'Egyptian'], correct: 2 },
    ],
    flashcard: { front: 'What is a selkie?', back: 'A magical Celtic being that lives as a seal in the sea but can shed its skin to become human on land' },
  },
  {
    id: 'myth_dragon_king', title: 'The Dragon King of the Sea', countryId: 'cn',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600',
    story: [
      'In Chinese mythology, the Dragon King (Longwang) rules the oceans from a magnificent crystal palace beneath the waves, surrounded by shrimp soldiers and crab generals.',
      'There are actually four Dragon Kings, one for each sea surrounding China. They control rain, floods, and storms — farmers prayed to them for good harvests.',
      'The Monkey King (Sun Wukong) once stole the Dragon King\'s magic iron staff and golden armor! This famous scene is from Journey to the West, one of China\'s greatest novels.',
    ],
    moral: 'Nature\'s power deserves respect, and water sustains all life.',
    modernConnection: 'Dragon Kings appear in anime like Dragon Ball, and Chinese New Year dragon dances honor these water spirits!',
    quiz: [
      { question: 'Where does the Dragon King live?', options: ['A mountain', 'Under the sea', 'In the clouds', 'In a volcano'], correct: 1 },
      { question: 'How many Dragon Kings are there?', options: ['1', '3', '4', '7'], correct: 2 },
      { question: 'Who stole from the Dragon King?', options: ['A phoenix', 'The Monkey King', 'A tiger', 'A crane'], correct: 1 },
    ],
    flashcard: { front: 'Who is the Dragon King?', back: 'Longwang — the Chinese sea deity who rules from a crystal palace and controls rain and storms' },
  },
  {
    id: 'myth_phoenix', title: 'The Fenghuang - Chinese Phoenix', countryId: 'cn',
    imageUrl: 'https://images.unsplash.com/photo-1537531842880-cffb37abe061?w=600',
    story: [
      'The Fenghuang is the Chinese phoenix — a magnificent bird with feathers of five sacred colors. Unlike the Western phoenix, it doesn\'t burn and be reborn from ashes.',
      'The Fenghuang represents harmony, virtue, and grace. It only appears in times of peace and prosperity. Seeing one is the greatest possible omen of good fortune.',
      'In Chinese tradition, the Fenghuang represents the empress while the dragon represents the emperor. Together they symbolize perfect balance and harmony.',
    ],
    moral: 'True beauty comes from inner virtue and harmony.',
    modernConnection: 'The Fenghuang appears on Chinese wedding decorations, imperial robes, and inspired the design of Pokémon like Ho-Oh!',
    quiz: [
      { question: 'The Fenghuang is the Chinese version of a...', options: ['Dragon', 'Phoenix', 'Unicorn', 'Griffin'], correct: 1 },
      { question: 'The Fenghuang appears during times of...', options: ['War', 'Famine', 'Peace', 'Storms'], correct: 2 },
      { question: 'The Fenghuang represents the...', options: ['Emperor', 'Empress', 'Scholar', 'Warrior'], correct: 1 },
    ],
    flashcard: { front: 'What is a Fenghuang?', back: 'The Chinese phoenix with five-colored feathers that only appears in times of peace — it represents the empress' },
  },
  {
    id: 'myth_romulus', title: 'Romulus and Remus - Founders of Rome', countryId: 'it',
    imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600',
    story: [
      'Twin brothers Romulus and Remus were abandoned as babies and left to die by the Tiber River. A she-wolf found them and raised them as her own cubs!',
      'When they grew up, the brothers decided to build a city. But they argued about where to build it. Romulus chose one hill, Remus another.',
      'Romulus won the argument and built his city on the Palatine Hill in 753 BC. He named it after himself — Roma (Rome). It would become the most powerful city in the ancient world!',
    ],
    moral: 'Great things can come from humble and unexpected beginnings.',
    modernConnection: 'The she-wolf with twins is still Rome\'s symbol — you can see the statue everywhere in the city!',
    quiz: [
      { question: 'Who raised Romulus and Remus?', options: ['An eagle', 'A she-wolf', 'A bear', 'A farmer'], correct: 1 },
      { question: 'Rome was founded in which year?', options: ['500 BC', '753 BC', '100 AD', '1000 BC'], correct: 1 },
      { question: 'The city of Rome was named after...', options: ['Remus', 'Romulus', 'The river', 'The wolf'], correct: 1 },
    ],
    flashcard: { front: 'Who founded Rome?', back: 'Romulus — one of twin brothers raised by a she-wolf, who built Rome on the Palatine Hill in 753 BC' },
  },
  {
    id: 'myth_thor', title: 'Thor and the Midgard Serpent', countryId: 'no',
    imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600',
    story: [
      'Thor, the Norse god of thunder, was the strongest of all the gods. He wielded Mjolnir, a magical hammer that always returned to his hand after being thrown.',
      'His greatest enemy was Jörmungandr, the Midgard Serpent — a snake so enormous it wrapped around the entire world and bit its own tail!',
      'Thor once went fishing and hooked Jörmungandr! He pulled the serpent from the ocean, but a terrified giant cut the fishing line. At Ragnarök (the end of the world), Thor and the serpent are fated to destroy each other.',
    ],
    moral: 'Even the mightiest heroes face challenges that test their limits.',
    modernConnection: 'Marvel\'s Thor movies are directly inspired by Norse mythology, making these ancient stories popular worldwide!',
    quiz: [
      { question: 'What is Thor\'s weapon called?', options: ['Excalibur', 'Mjolnir', 'Gungnir', 'Stormbreaker'], correct: 1 },
      { question: 'What is Jörmungandr?', options: ['A wolf', 'A dragon', 'A world-wrapping serpent', 'A frost giant'], correct: 2 },
      { question: 'What is Ragnarök?', options: ['A holiday', 'The end of the world', 'A feast', 'Thor\'s home'], correct: 1 },
    ],
    flashcard: { front: 'Who is Thor?', back: 'The Norse god of thunder who wields Mjolnir and is fated to battle the world-serpent Jörmungandr' },
  },
  {
    id: 'myth_baba_yaga', title: 'Baba Yaga - The Forest Witch', countryId: 'ru',
    imageUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600',
    story: [
      'Deep in Russian forests lives Baba Yaga — a fearsome witch whose house stands on giant chicken legs and can walk around! The fence around her yard is made of bones.',
      'Baba Yaga flies through the air in a giant mortar, using the pestle as a rudder and sweeping her tracks away with a broom.',
      'But Baba Yaga isn\'t always evil. In many tales, brave children who are polite and clever can earn her help. She tests visitors with impossible tasks — and rewards those who pass!',
    ],
    moral: 'Courage and good manners can turn even frightening encounters into opportunities.',
    modernConnection: 'Baba Yaga appears in the John Wick films (as a nickname!), video games, and children\'s books worldwide.',
    quiz: [
      { question: 'What does Baba Yaga\'s house stand on?', options: ['Wheels', 'Chicken legs', 'A hill', 'Stilts'], correct: 1 },
      { question: 'Baba Yaga flies in a...', options: ['Broomstick', 'Carpet', 'Mortar', 'Cauldron'], correct: 2 },
      { question: 'How can children earn Baba Yaga\'s help?', options: ['Fighting her', 'Being polite and clever', 'Running away', 'Singing songs'], correct: 1 },
    ],
    flashcard: { front: 'Who is Baba Yaga?', back: 'A Russian forest witch who lives in a house on chicken legs and tests visitors — helpful to the polite and clever' },
  },
  {
    id: 'myth_dreamtime', title: 'The Dreamtime - Aboriginal Creation', countryId: 'au',
    imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600',
    story: [
      'Aboriginal Australians believe the world was shaped during the Dreamtime — a sacred era when ancestral spirits roamed the Earth, creating mountains, rivers, and all living things.',
      'The Rainbow Serpent is one of the most powerful Dreamtime beings. As it moved across the land, its massive body carved out valleys and rivers. Where it rested, waterholes formed.',
      'Dreamtime isn\'t just the past — Aboriginal people believe it continues to exist alongside our world. Sacred rock art thousands of years old tells these stories still.',
    ],
    moral: 'The land is alive with stories, and we are all connected to creation.',
    modernConnection: 'Aboriginal art is one of the oldest continuous art traditions on Earth — over 65,000 years old!',
    quiz: [
      { question: 'What did the Rainbow Serpent create?', options: ['Stars', 'Valleys and rivers', 'Fire', 'The moon'], correct: 1 },
      { question: 'How old is Aboriginal art?', options: ['1,000 years', '10,000 years', '65,000+ years', '500 years'], correct: 2 },
      { question: 'Dreamtime is...', options: ['A bedtime story', 'An Aboriginal creation era', 'A holiday', 'A type of food'], correct: 1 },
    ],
    flashcard: { front: 'What is the Dreamtime?', back: 'The Aboriginal Australian creation era when ancestral spirits like the Rainbow Serpent shaped the land' },
  },
  {
    id: 'myth_saci', title: 'Saci Pererê - The One-Legged Trickster', countryId: 'br',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
    story: [
      'Saci Pererê is Brazil\'s most beloved folklore character — a one-legged boy who wears a magical red cap and loves causing mischief!',
      'Saci travels inside dust devils (whirlwinds). He hides toys, tangles horses\' manes, burns food on the stove, and makes people lose their way. His red cap gives him his powers.',
      'If you can capture Saci\'s red cap, he must grant you a wish! But be careful — Saci is incredibly quick and tricky. October 31st is Saci Day in Brazil.',
    ],
    moral: 'Mischief has its charm, but there\'s always someone clever enough to outsmart you.',
    modernConnection: 'Saci has his own national holiday in Brazil and stars in TV shows, comics, and animated films!',
    quiz: [
      { question: 'How many legs does Saci have?', options: ['None', 'One', 'Two', 'Three'], correct: 1 },
      { question: 'What gives Saci his powers?', options: ['A wand', 'A red cap', 'A whistle', 'A ring'], correct: 1 },
      { question: 'Saci travels inside...', options: ['Bubbles', 'Rainbows', 'Dust devils', 'Clouds'], correct: 2 },
    ],
    flashcard: { front: 'Who is Saci Pererê?', back: 'A one-legged Brazilian trickster boy with a magical red cap who travels in dust devils and loves mischief' },
  },
  {
    id: 'myth_leprechaun', title: 'Leprechauns and the Pot of Gold', countryId: 'ie',
    imageUrl: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=600',
    story: [
      'Irish legends tell of leprechauns — tiny fairy cobblers who hide pots of gold at the end of rainbows. You can hear them by the tap-tap-tap of their tiny hammer making shoes.',
      'If you catch a leprechaun, he must lead you to his gold. But leprechauns are master tricksters! They\'ll talk and talk, trying to make you look away — and the moment you do, they vanish!',
      'Leprechauns are said to be about three feet tall, wearing green coats and buckled shoes. Each one guards the treasure of the fairy folk.',
    ],
    moral: 'Don\'t be distracted by tricks when pursuing your goals.',
    modernConnection: 'St. Patrick\'s Day celebrations worldwide feature leprechauns, and Ireland\'s tourism uses them as beloved symbols!',
    quiz: [
      { question: 'Where do leprechauns hide their gold?', options: ['In caves', 'Under bridges', 'End of rainbows', 'In trees'], correct: 2 },
      { question: 'What is a leprechaun\'s job?', options: ['Farmer', 'Cobbler (shoemaker)', 'Baker', 'Fisher'], correct: 1 },
      { question: 'How do leprechauns escape?', options: ['By flying', 'By distracting you', 'By fighting', 'By singing'], correct: 1 },
    ],
    flashcard: { front: 'What is a leprechaun?', back: 'A tiny Irish fairy cobbler who hides pots of gold at the end of rainbows and tricks anyone who catches him' },
  },
  {
    id: 'myth_chollima', title: 'Chollima - The Winged Horse', countryId: 'kr',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600',
    story: [
      'In Korean mythology, Chollima is a magnificent winged horse that can gallop a thousand li (about 400 kilometers) in a single day. No mortal has ever been able to ride it.',
      'Chollima represents the spirit of rapid progress, ambition, and the refusal to accept limitations. It gallops through the sky without ever getting tired.',
      'After the Korean War, South Korea used the Chollima spirit to inspire rebuilding. The "Miracle on the Han River" — Korea\'s incredible economic rise — embodies the Chollima\'s unstoppable energy.',
    ],
    moral: 'With determination and courage, you can achieve things others think are impossible.',
    modernConnection: 'Korea\'s rapid transformation from war-torn to high-tech is called the Chollima spirit!',
    quiz: [
      { question: 'How far can Chollima run in a day?', options: ['10 km', '100 km', '400 km', '1000 km'], correct: 2 },
      { question: 'What kind of creature is Chollima?', options: ['A dragon', 'A winged horse', 'A phoenix', 'A tiger'], correct: 1 },
      { question: 'Chollima represents...', options: ['Slowness', 'Rapid progress', 'Sleep', 'The ocean'], correct: 1 },
    ],
    flashcard: { front: 'What is Chollima?', back: 'A mythical Korean winged horse that gallops 400km per day — a symbol of unstoppable progress' },
  },
  {
    id: 'myth_garuda', title: 'Garuda - The Divine Bird King', countryId: 'th',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
    story: [
      'Garuda is a magnificent half-man, half-eagle deity in Thai and Hindu mythology. He\'s the king of all birds and the mount of the god Vishnu.',
      'Garuda has an ancient rivalry with the Nagas (serpent beings). He devours snakes and keeps the cosmic balance between sky and earth.',
      'In Thailand, Garuda is the national symbol! The Garuda emblem appears on government buildings, and the king\'s seal features this powerful divine bird.',
    ],
    moral: 'Loyalty, duty, and strength can carry even the gods.',
    modernConnection: 'Indonesia\'s national airline is named Garuda Indonesia, and Garuda appears on Thailand\'s royal emblem!',
    quiz: [
      { question: 'Garuda is half-man and half...', options: ['Lion', 'Eagle', 'Serpent', 'Fish'], correct: 1 },
      { question: 'Garuda is the mount of which god?', options: ['Shiva', 'Brahma', 'Vishnu', 'Ganesha'], correct: 2 },
      { question: 'Garuda is the national symbol of...', options: ['Japan', 'Thailand', 'India', 'China'], correct: 1 },
    ],
    flashcard: { front: 'What is Garuda?', back: 'A divine half-man, half-eagle bird king from Thai/Hindu mythology — Thailand\'s national symbol' },
  },
  {
    id: 'myth_coyote', title: 'Coyote the Trickster', countryId: 'us',
    imageUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=600',
    story: [
      'In Native American mythology, Coyote is one of the most important characters — a shape-shifting trickster who is both foolish and brilliant at the same time.',
      'Different tribes tell different stories, but in many, Coyote steals fire from the gods to give to humans, similar to Prometheus in Greek myths. His tricks often backfire hilariously.',
      'Coyote represents the chaos and humor in life. He teaches through his mistakes — when he\'s greedy, he loses everything; when he\'s clever, he saves the day.',
    ],
    moral: 'We learn from both our successes and our failures — sometimes the failures teach us more!',
    modernConnection: 'Wile E. Coyote in Looney Tunes is inspired by this mythological trickster character!',
    quiz: [
      { question: 'In many stories, Coyote steals what for humans?', options: ['Water', 'Fire', 'Gold', 'Music'], correct: 1 },
      { question: 'Coyote is known as a...', options: ['Hero', 'Villain', 'Trickster', 'King'], correct: 2 },
      { question: 'Coyote stories come from...', options: ['Greek mythology', 'Native American mythology', 'Norse mythology', 'Egyptian mythology'], correct: 1 },
    ],
    flashcard: { front: 'Who is Coyote in Native American mythology?', back: 'A shape-shifting trickster who steals fire for humans and teaches lessons through his hilarious mistakes' },
  },
  {
    id: 'myth_peris', title: 'The Peris - Persian Fairy Spirits', countryId: 'ir',
    imageUrl: 'https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=600',
    story: [
      'In Persian mythology, Peris are beautiful, winged fairy-like beings descended from fallen angels. They live in a magical realm and feed on the scent of perfume and flowers.',
      'Peris are incredibly beautiful and kind. They were trapped by evil Divs (demons) and guarded by a fearsome being called Simurgh, a giant phoenix-like bird.',
      'Persian poets wrote endlessly about Peris — they inspired the English word "fairy" through French "féerie." Some scholars believe European fairy tales trace back to Persian Peri legends!',
    ],
    moral: 'Beauty and kindness can endure even when imprisoned by darkness.',
    modernConnection: 'The word "paradise" comes from Persian "pairidaeza" — the garden where Peris dwell!',
    quiz: [
      { question: 'Peris feed on the scent of...', options: ['Food', 'Perfume and flowers', 'Gold', 'Smoke'], correct: 1 },
      { question: 'The word "paradise" comes from which language?', options: ['Greek', 'Latin', 'Persian', 'Arabic'], correct: 2 },
      { question: 'Peris are similar to Western...', options: ['Vampires', 'Fairies', 'Witches', 'Elves'], correct: 1 },
    ],
    flashcard: { front: 'What are Peris?', back: 'Beautiful winged fairy spirits from Persian mythology that inspired the English word "fairy" and live in paradise' },
  },
  {
    id: 'myth_jorogumo', title: 'Jorōgumo - The Spider Woman', countryId: 'jp',
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600',
    story: [
      'In Japanese legends, Jorōgumo is a 400-year-old spider that gained magical powers and can shape-shift into a beautiful woman to lure unsuspecting travelers.',
      'She often appears near waterfalls, playing a biwa (Japanese lute) to attract people with beautiful music. Those who follow the music find themselves trapped in her silk web.',
      'But not all Jorōgumo stories are scary — in some versions, she falls genuinely in love with a human and uses her powers to protect him, showing that even monsters can have hearts.',
    ],
    moral: 'Appearances can be deceiving, but genuine love can transform anyone.',
    modernConnection: 'Jorōgumo appears in anime, manga, and video games as a popular yokai (supernatural being)!',
    quiz: [
      { question: 'Jorōgumo is actually a...', options: ['Fox', 'Cat', 'Spider', 'Snake'], correct: 2 },
      { question: 'How old must a spider be to become Jorōgumo?', options: ['100 years', '200 years', '400 years', '1000 years'], correct: 2 },
      { question: 'Jorōgumo lures people with...', options: ['Food', 'Gold', 'Music', 'Riddles'], correct: 2 },
    ],
    flashcard: { front: 'What is a Jorōgumo?', back: 'A 400-year-old magical spider from Japanese folklore that can transform into a beautiful woman' },
  },
  {
    id: 'myth_kraken', title: 'The Kraken - Terror of the Deep', countryId: 'no',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600',
    story: [
      'Norwegian sailors told tales of the Kraken — a sea monster so gigantic that it was mistaken for an island! Ships would anchor on its back, only for the "island" to sink beneath the waves.',
      'The Kraken had enormous tentacles that could pull entire ships underwater. Whirlpools formed when it dove. Fishermen said good catches meant the Kraken was below, herding fish upward.',
      'Scientists now believe Kraken legends were inspired by real giant squid — deep-sea creatures with eyes the size of dinner plates and tentacles up to 13 meters long!',
    ],
    moral: 'The ocean holds mysteries beyond our imagination.',
    modernConnection: 'The Kraken appears in Pirates of the Caribbean, and "Release the Kraken!" is a famous movie quote.',
    quiz: [
      { question: 'What was the Kraken mistaken for?', options: ['A whale', 'An island', 'A ship', 'A cloud'], correct: 1 },
      { question: 'The Kraken was probably inspired by real...', options: ['Whales', 'Giant squid', 'Sharks', 'Dolphins'], correct: 1 },
      { question: 'Kraken legends originated from...', options: ['Greek', 'Norwegian', 'Japanese', 'Indian'], correct: 1 },
    ],
    flashcard: { front: 'What is the Kraken?', back: 'A massive Norwegian sea monster with huge tentacles — likely inspired by real giant squid' },
  },
  {
    id: 'myth_tarasque', title: 'The Tarasque of Provence', countryId: 'fr',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    story: [
      'In southern France, people told stories of the Tarasque, a dragon-like river monster with a spiky shell and a powerful tail.',
      'The creature frightened travelers near the Rhone River until Saint Martha calmed it with courage, kindness, and song.',
      'Today, the town of Tarascon celebrates the legend with giant parade creatures and festivals that keep the story alive.',
    ],
    moral: 'Kindness and courage can tame fear better than force.',
    modernConnection: 'French towns still parade dragon figures inspired by the Tarasque legend.',
    quiz: [
      { question: 'Where was the Tarasque legend told?', options: ['Northern France', 'Southern France', 'Norway', 'Egypt'], correct: 1 },
      { question: 'How was the monster calmed?', options: ['By fire', 'By kindness and courage', 'By an army', 'By a storm'], correct: 1 },
      { question: 'What keeps the legend alive today?', options: ['Parades and festivals', 'TV only', 'No one remembers it', 'Space museums'], correct: 0 },
    ],
    flashcard: { front: 'What is the Tarasque?', back: 'A famous French river monster from Provence that was calmed by Saint Martha.' },
  },
  {
    id: 'myth_ait_hdidou', title: 'Ait Haddidou Mountain Spirit Tales', countryId: 'ma',
    imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    story: [
      'In Amazigh mountain stories from Morocco, travelers speak of guardian spirits that protect valleys, springs, and high passes.',
      'The spirits reward respectful visitors who protect water, share food, and help elders cross rough trails.',
      'Families pass these stories from generation to generation to teach care for land, neighbors, and animals.',
    ],
    moral: 'Respect for people and nature brings protection and trust.',
    modernConnection: 'Many Moroccan folktales are still shared during family gatherings and festivals.',
    quiz: [
      { question: 'Where do these stories come from?', options: ['Amazigh mountain regions', 'Arctic seas', 'Roman arenas', 'Rainforests'], correct: 0 },
      { question: 'What do guardian spirits reward?', options: ['Greed', 'Respectful behavior', 'Loud voices', 'Racing'], correct: 1 },
      { question: 'Why are these tales told?', options: ['To teach care and respect', 'Only to scare kids', 'To sell maps', 'To count sheep'], correct: 0 },
    ],
    flashcard: { front: 'What do Moroccan mountain spirit tales teach?', back: 'They teach respect for nature, elders, and community.' },
  },
  {
    id: 'myth_amaru', title: 'Amaru - The Serpent of the Andes', countryId: 'pe',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    story: [
      'In Andean stories from Peru, Amaru is a powerful serpent spirit connected to mountains, rivers, and storms.',
      'Amaru can move between sky, earth, and underground worlds, linking nature\'s different realms.',
      'People tell this myth to remember that mountain water and weather are sacred and must be respected.',
    ],
    moral: 'Nature is connected, and every part deserves care.',
    modernConnection: 'Amaru symbols appear in Andean textiles, art, and stories today.',
    quiz: [
      { question: 'What kind of being is Amaru?', options: ['A bird', 'A serpent spirit', 'A giant cat', 'A tree'], correct: 1 },
      { question: 'What does Amaru connect?', options: ['Only cities', 'Sky, earth, and underworld', 'Only oceans', 'Only farms'], correct: 1 },
      { question: 'What lesson does the myth teach?', options: ['Ignore weather', 'Respect nature', 'Collect gold', 'Travel at night'], correct: 1 },
    ],
    flashcard: { front: 'Who is Amaru in Peruvian myth?', back: 'A powerful Andean serpent spirit linked to mountains, rivers, and weather.' },
  },
  {
    id: 'myth_nyamgondho', title: 'Nyamgondho and the Lake Spirit', countryId: 'ke',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600',
    story: [
      'In Luo storytelling from Kenya, Nyamgondho was a fisherman who met a mysterious spirit from Lake Victoria.',
      'When he treated the spirit with respect, his family prospered. When people mocked the spirit, they lost that blessing.',
      'The story teaches gratitude and respect for water, food, and the unseen gifts of nature.',
    ],
    moral: 'Gratitude and respect sustain communities.',
    modernConnection: 'Lake stories are still shared around western Kenya to teach values and history.',
    quiz: [
      { question: 'This story is linked to which lake?', options: ['Lake Victoria', 'Lake Baikal', 'Lake Erie', 'Dead Sea'], correct: 0 },
      { question: 'What brought prosperity?', options: ['Mocking others', 'Respect and gratitude', 'Treasure maps', 'Racing boats'], correct: 1 },
      { question: 'What does the tale encourage?', options: ['Waste', 'Respect for nature and people', 'Silence forever', 'Fear of fishing'], correct: 1 },
    ],
    flashcard: { front: 'What is the lesson of Nyamgondho?', back: 'Respect, gratitude, and care for nature bring long-term wellbeing.' },
  },
  {
    id: 'myth_shahmaran', title: 'Shahmaran - The Wise Serpent Queen', countryId: 'tr',
    imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600',
    story: [
      'In Turkish folklore, Shahmaran is a wise half-woman, half-serpent queen who lives in hidden underground gardens.',
      'She shares knowledge of healing plants and medicine with humans who prove trustworthy.',
      'Her story appears in art, jewelry, and stories as a symbol of wisdom, healing, and loyalty.',
    ],
    moral: 'Knowledge should be protected and shared with integrity.',
    modernConnection: 'Shahmaran motifs are common in Turkish crafts and storytelling.',
    quiz: [
      { question: 'What is Shahmaran known for?', options: ['Sailing ships', 'Wisdom and healing knowledge', 'Building castles', 'Flying'], correct: 1 },
      { question: 'Where does she live in stories?', options: ['Desert dunes', 'Underground gardens', 'Snow peaks', 'City towers'], correct: 1 },
      { question: 'What does she symbolize?', options: ['Chaos only', 'Wisdom and loyalty', 'Speed', 'Luck in games'], correct: 1 },
    ],
    flashcard: { front: 'Who is Shahmaran?', back: 'A wise serpent queen from Turkish folklore associated with healing and wisdom.' },
  },
  {
    id: 'myth_sphinx', title: 'The Riddle of the Sphinx', countryId: 'eg',
    imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    story: [
      'The Sphinx sat outside the city of Thebes, asking a riddle to every traveler: "What walks on four legs in the morning, two legs at noon, and three legs in the evening?"',
      'Anyone who answered wrong was devoured! The city lived in terror until the hero Oedipus arrived and solved the riddle: "A human — who crawls as a baby, walks upright as an adult, and uses a cane in old age."',
      'The real Great Sphinx of Giza is the oldest and largest monolith statue in the world — a lion\'s body with a pharaoh\'s face, guarding the pyramids for over 4,500 years.',
    ],
    moral: 'Knowledge and wisdom can overcome any obstacle.',
    modernConnection: 'Sphinxes appear in Harry Potter, ancient temples worldwide, and the concept of "riddles" in culture comes from this myth!',
    quiz: [
      { question: 'What is the answer to the Sphinx\'s riddle?', options: ['A cat', 'A human', 'The sun', 'A river'], correct: 1 },
      { question: 'The Great Sphinx has the body of a...', options: ['Bull', 'Eagle', 'Lion', 'Dragon'], correct: 2 },
      { question: 'How old is the Great Sphinx approximately?', options: ['1,000 years', '2,500 years', '4,500 years', '10,000 years'], correct: 2 },
    ],
    flashcard: { front: 'What is the Sphinx\'s famous riddle?', back: 'What walks on 4 legs, then 2, then 3? Answer: A human (baby crawls, adult walks, elder uses cane)' },
  },
];

export function getMythsForCountry(countryId: string): Myth[] {
  return MYTHS_AND_LEGENDS.filter((m) => m.countryId === countryId);
}

// ─── LANGUAGE PHRASE PACKS (10 essential phrases per language for 14 core countries) ───

export interface LanguagePhrase {
  id: string;
  countryId: string;
  phrase: string;
  pronunciation: string;
  translation: string;
  category: string;
}

export const LANGUAGE_PHRASE_PACKS: LanguagePhrase[] = [
  // Japan (jp) - Japanese
  { id: 'jp_p1', countryId: 'jp', phrase: 'こんにちは', pronunciation: 'Kon-ni-chi-wa', translation: 'Hello', category: 'greeting' },
  { id: 'jp_p2', countryId: 'jp', phrase: 'ありがとうございます', pronunciation: 'A-ri-ga-tou go-zai-mas', translation: 'Thank you', category: 'thanks' },
  { id: 'jp_p3', countryId: 'jp', phrase: 'すみません', pronunciation: 'Su-mi-ma-sen', translation: 'Excuse me', category: 'polite' },
  { id: 'jp_p4', countryId: 'jp', phrase: 'お願いします', pronunciation: 'O-ne-gai shi-mas', translation: 'Please', category: 'polite' },
  { id: 'jp_p5', countryId: 'jp', phrase: 'さようなら', pronunciation: 'Sa-you-na-ra', translation: 'Goodbye', category: 'greeting' },
  { id: 'jp_p6', countryId: 'jp', phrase: 'いくらですか？', pronunciation: 'I-ku-ra des-ka?', translation: 'How much?', category: 'shopping' },
  { id: 'jp_p7', countryId: 'jp', phrase: '美しい', pronunciation: 'U-tsu-ku-shii', translation: 'Beautiful!', category: 'expression' },
  { id: 'jp_p8', countryId: 'jp', phrase: 'おいしい', pronunciation: 'Oi-shii', translation: 'Delicious!', category: 'food' },
  { id: 'jp_p9', countryId: 'jp', phrase: '私の名前は...', pronunciation: 'Wa-ta-shi no na-ma-e wa...', translation: 'My name is...', category: 'intro' },
  { id: 'jp_p10', countryId: 'jp', phrase: '...はどこですか？', pronunciation: '...wa do-ko des-ka?', translation: 'Where is...?', category: 'direction' },
  // France (fr) - French
  { id: 'fr_p1', countryId: 'fr', phrase: 'Bonjour', pronunciation: 'Bon-ZHOOR', translation: 'Hello', category: 'greeting' },
  { id: 'fr_p2', countryId: 'fr', phrase: 'Merci beaucoup', pronunciation: 'Mair-SEE bo-KOO', translation: 'Thank you very much', category: 'thanks' },
  { id: 'fr_p3', countryId: 'fr', phrase: 'Excusez-moi', pronunciation: 'Ex-koo-ZAY mwa', translation: 'Excuse me', category: 'polite' },
  { id: 'fr_p4', countryId: 'fr', phrase: "S'il vous plaît", pronunciation: 'Seel voo PLAY', translation: 'Please', category: 'polite' },
  { id: 'fr_p5', countryId: 'fr', phrase: 'Au revoir', pronunciation: 'Oh ruh-VWAR', translation: 'Goodbye', category: 'greeting' },
  { id: 'fr_p6', countryId: 'fr', phrase: "C'est combien?", pronunciation: 'Say com-BYEHN?', translation: 'How much?', category: 'shopping' },
  { id: 'fr_p7', countryId: 'fr', phrase: 'Magnifique!', pronunciation: 'Man-yee-FEEK', translation: 'Beautiful!', category: 'expression' },
  { id: 'fr_p8', countryId: 'fr', phrase: 'Délicieux!', pronunciation: 'Day-lee-SYUH', translation: 'Delicious!', category: 'food' },
  { id: 'fr_p9', countryId: 'fr', phrase: 'Je m\'appelle...', pronunciation: 'Zhuh ma-PEL...', translation: 'My name is...', category: 'intro' },
  { id: 'fr_p10', countryId: 'fr', phrase: 'Où est...?', pronunciation: 'OO eh...?', translation: 'Where is...?', category: 'direction' },
  // Mexico (mx) - Spanish
  { id: 'mx_p1', countryId: 'mx', phrase: '¡Hola!', pronunciation: 'OH-la', translation: 'Hello', category: 'greeting' },
  { id: 'mx_p2', countryId: 'mx', phrase: 'Gracias', pronunciation: 'GRAH-see-as', translation: 'Thank you', category: 'thanks' },
  { id: 'mx_p3', countryId: 'mx', phrase: 'Disculpe', pronunciation: 'Dis-KOOL-peh', translation: 'Excuse me', category: 'polite' },
  { id: 'mx_p4', countryId: 'mx', phrase: 'Por favor', pronunciation: 'Por fa-VOR', translation: 'Please', category: 'polite' },
  { id: 'mx_p5', countryId: 'mx', phrase: 'Adiós', pronunciation: 'Ah-dee-OS', translation: 'Goodbye', category: 'greeting' },
  { id: 'mx_p6', countryId: 'mx', phrase: '¿Cuánto cuesta?', pronunciation: 'KWAN-toh KWES-ta?', translation: 'How much?', category: 'shopping' },
  { id: 'mx_p7', countryId: 'mx', phrase: '¡Hermoso!', pronunciation: 'Air-MO-so', translation: 'Beautiful!', category: 'expression' },
  { id: 'mx_p8', countryId: 'mx', phrase: '¡Delicioso!', pronunciation: 'Deh-lee-see-OH-so', translation: 'Delicious!', category: 'food' },
  { id: 'mx_p9', countryId: 'mx', phrase: 'Me llamo...', pronunciation: 'Meh YA-mo...', translation: 'My name is...', category: 'intro' },
  { id: 'mx_p10', countryId: 'mx', phrase: '¿Dónde está...?', pronunciation: 'DON-deh es-TA...?', translation: 'Where is...?', category: 'direction' },
  // Italy (it) - Italian
  { id: 'it_p1', countryId: 'it', phrase: 'Ciao!', pronunciation: 'CHOW', translation: 'Hello / Goodbye', category: 'greeting' },
  { id: 'it_p2', countryId: 'it', phrase: 'Grazie mille', pronunciation: 'GRAH-tsee-eh MIL-leh', translation: 'Thank you very much', category: 'thanks' },
  { id: 'it_p3', countryId: 'it', phrase: 'Scusi', pronunciation: 'SKOO-zee', translation: 'Excuse me', category: 'polite' },
  { id: 'it_p4', countryId: 'it', phrase: 'Per favore', pronunciation: 'Pair fa-VO-reh', translation: 'Please', category: 'polite' },
  { id: 'it_p5', countryId: 'it', phrase: 'Arrivederci', pronunciation: 'Ah-ree-veh-DAIR-chee', translation: 'Goodbye', category: 'greeting' },
  { id: 'it_p6', countryId: 'it', phrase: 'Quanto costa?', pronunciation: 'KWAN-toh KOS-ta?', translation: 'How much?', category: 'shopping' },
  { id: 'it_p7', countryId: 'it', phrase: 'Bellissimo!', pronunciation: 'Bel-LEE-see-mo', translation: 'Beautiful!', category: 'expression' },
  { id: 'it_p8', countryId: 'it', phrase: 'Buonissimo!', pronunciation: 'Bwo-NEE-see-mo', translation: 'Delicious!', category: 'food' },
  { id: 'it_p9', countryId: 'it', phrase: 'Mi chiamo...', pronunciation: 'Mee kee-AH-mo...', translation: 'My name is...', category: 'intro' },
  { id: 'it_p10', countryId: 'it', phrase: "Dov'è...?", pronunciation: 'Do-VEH...?', translation: 'Where is...?', category: 'direction' },
  // Brazil (br) - Portuguese
  { id: 'br_p1', countryId: 'br', phrase: 'Olá!', pronunciation: 'Oh-LAH', translation: 'Hello', category: 'greeting' },
  { id: 'br_p2', countryId: 'br', phrase: 'Obrigado / Obrigada', pronunciation: 'Oh-bree-GAH-doo / dah', translation: 'Thank you (m/f)', category: 'thanks' },
  { id: 'br_p3', countryId: 'br', phrase: 'Com licença', pronunciation: 'Kohm lee-SEN-sa', translation: 'Excuse me', category: 'polite' },
  { id: 'br_p4', countryId: 'br', phrase: 'Por favor', pronunciation: 'Por fa-VOR', translation: 'Please', category: 'polite' },
  { id: 'br_p5', countryId: 'br', phrase: 'Tchau!', pronunciation: 'CHOW', translation: 'Goodbye', category: 'greeting' },
  { id: 'br_p6', countryId: 'br', phrase: 'Quanto custa?', pronunciation: 'KWAN-too KOOS-tah?', translation: 'How much?', category: 'shopping' },
  { id: 'br_p7', countryId: 'br', phrase: 'Lindo!', pronunciation: 'LEEN-doo', translation: 'Beautiful!', category: 'expression' },
  { id: 'br_p8', countryId: 'br', phrase: 'Gostoso!', pronunciation: 'Gos-TOH-zoo', translation: 'Delicious!', category: 'food' },
  { id: 'br_p9', countryId: 'br', phrase: 'Meu nome é...', pronunciation: 'Meh-oo NO-mee eh...', translation: 'My name is...', category: 'intro' },
  { id: 'br_p10', countryId: 'br', phrase: 'Onde fica...?', pronunciation: 'ON-jee FEE-kah...?', translation: 'Where is...?', category: 'direction' },
  // Korea (kr) - Korean
  { id: 'kr_p1', countryId: 'kr', phrase: '안녕하세요', pronunciation: 'An-nyeong-ha-se-yo', translation: 'Hello', category: 'greeting' },
  { id: 'kr_p2', countryId: 'kr', phrase: '감사합니다', pronunciation: 'Gam-sa-ham-ni-da', translation: 'Thank you', category: 'thanks' },
  { id: 'kr_p3', countryId: 'kr', phrase: '실례합니다', pronunciation: 'Shil-lye-ham-ni-da', translation: 'Excuse me', category: 'polite' },
  { id: 'kr_p4', countryId: 'kr', phrase: '주세요', pronunciation: 'Ju-se-yo', translation: 'Please (give me)', category: 'polite' },
  { id: 'kr_p5', countryId: 'kr', phrase: '안녕히 가세요', pronunciation: 'An-nyeong-hi ga-se-yo', translation: 'Goodbye', category: 'greeting' },
  { id: 'kr_p6', countryId: 'kr', phrase: '얼마예요?', pronunciation: 'Eol-ma-ye-yo?', translation: 'How much?', category: 'shopping' },
  { id: 'kr_p7', countryId: 'kr', phrase: '아름다워요!', pronunciation: 'A-reum-da-wo-yo!', translation: 'Beautiful!', category: 'expression' },
  { id: 'kr_p8', countryId: 'kr', phrase: '맛있어요!', pronunciation: 'Ma-shi-sseo-yo!', translation: 'Delicious!', category: 'food' },
  { id: 'kr_p9', countryId: 'kr', phrase: '제 이름은...', pronunciation: 'Je i-reum-eun...', translation: 'My name is...', category: 'intro' },
  { id: 'kr_p10', countryId: 'kr', phrase: '...이/가 어디예요?', pronunciation: '...i/ga eo-di-ye-yo?', translation: 'Where is...?', category: 'direction' },
  // Thailand (th) - Thai
  { id: 'th_p1', countryId: 'th', phrase: 'สวัสดี', pronunciation: 'Sa-wat-dee', translation: 'Hello', category: 'greeting' },
  { id: 'th_p2', countryId: 'th', phrase: 'ขอบคุณ', pronunciation: 'Khop-khun', translation: 'Thank you', category: 'thanks' },
  { id: 'th_p3', countryId: 'th', phrase: 'ขอโทษ', pronunciation: 'Khor-toht', translation: 'Excuse me', category: 'polite' },
  { id: 'th_p4', countryId: 'th', phrase: 'ได้โปรด', pronunciation: 'Dai-prohd', translation: 'Please', category: 'polite' },
  { id: 'th_p5', countryId: 'th', phrase: 'ลาก่อน', pronunciation: 'La-gorn', translation: 'Goodbye', category: 'greeting' },
  { id: 'th_p6', countryId: 'th', phrase: 'เท่าไร?', pronunciation: 'Tao-rai?', translation: 'How much?', category: 'shopping' },
  { id: 'th_p7', countryId: 'th', phrase: 'สวยมาก!', pronunciation: 'Suay-mak!', translation: 'Beautiful!', category: 'expression' },
  { id: 'th_p8', countryId: 'th', phrase: 'อร่อยมาก!', pronunciation: 'A-roi-mak!', translation: 'Delicious!', category: 'food' },
  { id: 'th_p9', countryId: 'th', phrase: 'ผม/ฉัน ชื่อ...', pronunciation: 'Phom/Chan chue...', translation: 'My name is...', category: 'intro' },
  { id: 'th_p10', countryId: 'th', phrase: '...อยู่ที่ไหน?', pronunciation: '...yoo tee-nai?', translation: 'Where is...?', category: 'direction' },
  // Germany (de) - German
  { id: 'de_p1', countryId: 'de', phrase: 'Hallo!', pronunciation: 'HA-lo', translation: 'Hello', category: 'greeting' },
  { id: 'de_p2', countryId: 'de', phrase: 'Danke schön', pronunciation: 'DAN-keh SHURN', translation: 'Thank you', category: 'thanks' },
  { id: 'de_p3', countryId: 'de', phrase: 'Entschuldigung', pronunciation: 'Ent-SHOOL-di-gung', translation: 'Excuse me', category: 'polite' },
  { id: 'de_p4', countryId: 'de', phrase: 'Bitte', pronunciation: 'BIT-teh', translation: 'Please', category: 'polite' },
  { id: 'de_p5', countryId: 'de', phrase: 'Auf Wiedersehen', pronunciation: 'Owf VEE-der-zay-en', translation: 'Goodbye', category: 'greeting' },
  { id: 'de_p6', countryId: 'de', phrase: 'Wie viel kostet das?', pronunciation: 'Vee feel KOS-tet das?', translation: 'How much?', category: 'shopping' },
  { id: 'de_p7', countryId: 'de', phrase: 'Wunderschön!', pronunciation: 'VOON-der-shurn', translation: 'Beautiful!', category: 'expression' },
  { id: 'de_p8', countryId: 'de', phrase: 'Lecker!', pronunciation: 'LEK-er', translation: 'Delicious!', category: 'food' },
  { id: 'de_p9', countryId: 'de', phrase: 'Ich heiße...', pronunciation: 'Ikh HY-seh...', translation: 'My name is...', category: 'intro' },
  { id: 'de_p10', countryId: 'de', phrase: 'Wo ist...?', pronunciation: 'Voh ist...?', translation: 'Where is...?', category: 'direction' },
  // Turkey (tr) - Turkish
  { id: 'tr_p1', countryId: 'tr', phrase: 'Merhaba!', pronunciation: 'Mer-HA-ba', translation: 'Hello', category: 'greeting' },
  { id: 'tr_p2', countryId: 'tr', phrase: 'Teşekkürler', pronunciation: 'Te-shek-KOOR-ler', translation: 'Thank you', category: 'thanks' },
  { id: 'tr_p3', countryId: 'tr', phrase: 'Affedersiniz', pronunciation: 'Af-feh-der-SIN-iz', translation: 'Excuse me', category: 'polite' },
  { id: 'tr_p4', countryId: 'tr', phrase: 'Lütfen', pronunciation: 'LOOT-fen', translation: 'Please', category: 'polite' },
  { id: 'tr_p5', countryId: 'tr', phrase: 'Hoşça kalın', pronunciation: 'Hosh-CHA ka-luhn', translation: 'Goodbye', category: 'greeting' },
  { id: 'tr_p6', countryId: 'tr', phrase: 'Ne kadar?', pronunciation: 'Neh ka-DAR?', translation: 'How much?', category: 'shopping' },
  { id: 'tr_p7', countryId: 'tr', phrase: 'Çok güzel!', pronunciation: 'Chok goo-ZEL', translation: 'Beautiful!', category: 'expression' },
  { id: 'tr_p8', countryId: 'tr', phrase: 'Çok lezzetli!', pronunciation: 'Chok lez-ZET-lee', translation: 'Delicious!', category: 'food' },
  { id: 'tr_p9', countryId: 'tr', phrase: 'Benim adım...', pronunciation: 'Be-NIM a-duhm...', translation: 'My name is...', category: 'intro' },
  { id: 'tr_p10', countryId: 'tr', phrase: '...nerede?', pronunciation: '...ne-RE-de?', translation: 'Where is...?', category: 'direction' },
  // Greece (gr) - Greek
  { id: 'gr_p1', countryId: 'gr', phrase: 'Γεια σου!', pronunciation: 'YAH-soo', translation: 'Hello', category: 'greeting' },
  { id: 'gr_p2', countryId: 'gr', phrase: 'Ευχαριστώ', pronunciation: 'Ef-ha-ris-TOH', translation: 'Thank you', category: 'thanks' },
  { id: 'gr_p3', countryId: 'gr', phrase: 'Συγγνώμη', pronunciation: 'Sig-NO-mee', translation: 'Excuse me', category: 'polite' },
  { id: 'gr_p4', countryId: 'gr', phrase: 'Παρακαλώ', pronunciation: 'Pa-ra-ka-LOH', translation: 'Please', category: 'polite' },
  { id: 'gr_p5', countryId: 'gr', phrase: 'Αντίο', pronunciation: 'An-DEE-oh', translation: 'Goodbye', category: 'greeting' },
  { id: 'gr_p6', countryId: 'gr', phrase: 'Πόσο κάνει;', pronunciation: 'PO-so KA-nee?', translation: 'How much?', category: 'shopping' },
  { id: 'gr_p7', countryId: 'gr', phrase: 'Πανέμορφο!', pronunciation: 'Pa-NE-mor-fo', translation: 'Beautiful!', category: 'expression' },
  { id: 'gr_p8', countryId: 'gr', phrase: 'Νόστιμο!', pronunciation: 'NOS-tee-mo', translation: 'Delicious!', category: 'food' },
  { id: 'gr_p9', countryId: 'gr', phrase: 'Με λένε...', pronunciation: 'Meh LE-ne...', translation: 'My name is...', category: 'intro' },
  { id: 'gr_p10', countryId: 'gr', phrase: 'Πού είναι...;', pronunciation: 'POO EE-neh...?', translation: 'Where is...?', category: 'direction' },
  // India (in) - Hindi
  { id: 'in_p1', countryId: 'in', phrase: 'नमस्ते', pronunciation: 'Na-mas-TAY', translation: 'Hello', category: 'greeting' },
  { id: 'in_p2', countryId: 'in', phrase: 'धन्यवाद', pronunciation: 'Dhan-ya-VAAD', translation: 'Thank you', category: 'thanks' },
  { id: 'in_p3', countryId: 'in', phrase: 'माफ़ कीजिए', pronunciation: 'Maaf kee-ji-yeh', translation: 'Excuse me', category: 'polite' },
  { id: 'in_p4', countryId: 'in', phrase: 'कृपया', pronunciation: 'Kri-pa-YA', translation: 'Please', category: 'polite' },
  { id: 'in_p5', countryId: 'in', phrase: 'अलविदा', pronunciation: 'Al-vi-DA', translation: 'Goodbye', category: 'greeting' },
  { id: 'in_p6', countryId: 'in', phrase: 'कितने का है?', pronunciation: 'Kit-ne ka hai?', translation: 'How much?', category: 'shopping' },
  { id: 'in_p7', countryId: 'in', phrase: 'सुंदर!', pronunciation: 'Sun-DAR', translation: 'Beautiful!', category: 'expression' },
  { id: 'in_p8', countryId: 'in', phrase: 'स्वादिष्ट!', pronunciation: 'Swa-DISH-ta', translation: 'Delicious!', category: 'food' },
  { id: 'in_p9', countryId: 'in', phrase: 'मेरा नाम... है', pronunciation: 'Me-ra naam... hai', translation: 'My name is...', category: 'intro' },
  { id: 'in_p10', countryId: 'in', phrase: '...कहाँ है?', pronunciation: '...ka-HAAN hai?', translation: 'Where is...?', category: 'direction' },
  // Norway (no) - Norwegian
  { id: 'no_p1', countryId: 'no', phrase: 'Hei!', pronunciation: 'HAY', translation: 'Hello', category: 'greeting' },
  { id: 'no_p2', countryId: 'no', phrase: 'Tusen takk', pronunciation: 'TOO-sen TAHK', translation: 'Thank you very much', category: 'thanks' },
  { id: 'no_p3', countryId: 'no', phrase: 'Unnskyld', pronunciation: 'OON-shuld', translation: 'Excuse me', category: 'polite' },
  { id: 'no_p4', countryId: 'no', phrase: 'Vær så snill', pronunciation: 'Var so SNILL', translation: 'Please', category: 'polite' },
  { id: 'no_p5', countryId: 'no', phrase: 'Ha det!', pronunciation: 'Ha DEH', translation: 'Goodbye', category: 'greeting' },
  { id: 'no_p6', countryId: 'no', phrase: 'Hvor mye koster det?', pronunciation: 'Vor MY-eh KOS-ter deh?', translation: 'How much?', category: 'shopping' },
  { id: 'no_p7', countryId: 'no', phrase: 'Vakker!', pronunciation: 'VAK-ker', translation: 'Beautiful!', category: 'expression' },
  { id: 'no_p8', countryId: 'no', phrase: 'Deilig!', pronunciation: 'DAY-lee', translation: 'Delicious!', category: 'food' },
  { id: 'no_p9', countryId: 'no', phrase: 'Jeg heter...', pronunciation: 'Yay HEH-ter...', translation: 'My name is...', category: 'intro' },
  { id: 'no_p10', countryId: 'no', phrase: 'Hvor er...?', pronunciation: 'Vor air...?', translation: 'Where is...?', category: 'direction' },
  // Kenya (ke) - Swahili
  { id: 'ke_p1', countryId: 'ke', phrase: 'Jambo!', pronunciation: 'JAM-bo', translation: 'Hello', category: 'greeting' },
  { id: 'ke_p2', countryId: 'ke', phrase: 'Asante sana', pronunciation: 'Ah-SAN-teh SA-na', translation: 'Thank you very much', category: 'thanks' },
  { id: 'ke_p3', countryId: 'ke', phrase: 'Samahani', pronunciation: 'Sa-ma-HA-nee', translation: 'Excuse me', category: 'polite' },
  { id: 'ke_p4', countryId: 'ke', phrase: 'Tafadhali', pronunciation: 'Ta-fa-DHA-lee', translation: 'Please', category: 'polite' },
  { id: 'ke_p5', countryId: 'ke', phrase: 'Kwaheri', pronunciation: 'Kwa-HEH-ree', translation: 'Goodbye', category: 'greeting' },
  { id: 'ke_p6', countryId: 'ke', phrase: 'Bei gani?', pronunciation: 'BAY GA-nee?', translation: 'How much?', category: 'shopping' },
  { id: 'ke_p7', countryId: 'ke', phrase: 'Nzuri sana!', pronunciation: 'N-ZOO-ree SA-na', translation: 'Beautiful!', category: 'expression' },
  { id: 'ke_p8', countryId: 'ke', phrase: 'Tamu sana!', pronunciation: 'TA-moo SA-na', translation: 'Delicious!', category: 'food' },
  { id: 'ke_p9', countryId: 'ke', phrase: 'Jina langu ni...', pronunciation: 'JEE-na LAN-goo nee...', translation: 'My name is...', category: 'intro' },
  { id: 'ke_p10', countryId: 'ke', phrase: '...iko wapi?', pronunciation: '...EE-ko WA-pee?', translation: 'Where is...?', category: 'direction' },
  // Egypt (eg) - Arabic
  { id: 'eg_p1', countryId: 'eg', phrase: 'مرحبا', pronunciation: 'Mar-HA-ba', translation: 'Hello', category: 'greeting' },
  { id: 'eg_p2', countryId: 'eg', phrase: 'شكرا جزيلا', pronunciation: 'SHUK-ran ja-ZEE-lan', translation: 'Thank you very much', category: 'thanks' },
  { id: 'eg_p3', countryId: 'eg', phrase: 'لو سمحت', pronunciation: 'Law sa-MAHT', translation: 'Excuse me', category: 'polite' },
  { id: 'eg_p4', countryId: 'eg', phrase: 'من فضلك', pronunciation: 'Min FAD-lak', translation: 'Please', category: 'polite' },
  { id: 'eg_p5', countryId: 'eg', phrase: 'مع السلامة', pronunciation: "Ma'a as-sa-LA-ma", translation: 'Goodbye', category: 'greeting' },
  { id: 'eg_p6', countryId: 'eg', phrase: 'بكام ده?', pronunciation: 'Bi-KAM da?', translation: 'How much?', category: 'shopping' },
  { id: 'eg_p7', countryId: 'eg', phrase: '!جميل', pronunciation: 'Ga-MEEL!', translation: 'Beautiful!', category: 'expression' },
  { id: 'eg_p8', countryId: 'eg', phrase: '!لذيذ', pronunciation: 'La-ZEEZ!', translation: 'Delicious!', category: 'food' },
  { id: 'eg_p9', countryId: 'eg', phrase: '...اسمي', pronunciation: 'IS-mee...', translation: 'My name is...', category: 'intro' },
  { id: 'eg_p10', countryId: 'eg', phrase: '...فين؟', pronunciation: '...FAYN?', translation: 'Where is...?', category: 'direction' },
];

export function getPhrasesForCountry(countryId: string): LanguagePhrase[] {
  return LANGUAGE_PHRASE_PACKS.filter((p) => p.countryId === countryId);
}

export function getPhraseOfTheDay(): LanguagePhrase {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return LANGUAGE_PHRASE_PACKS[dayOfYear % LANGUAGE_PHRASE_PACKS.length];
}

// ─── NATURE AND ANIMALS ───

export interface NatureEntry {
  id: string;
  name: string;
  countryId: string;
  funFact: string;
  habitat: string;
  conservationStatus: string;
  didYouKnow: string;
}

export const NATURE_AND_ANIMALS: NatureEntry[] = [
  { id: 'nat_snow_monkey', name: 'Japanese Snow Monkey', countryId: 'jp', funFact: 'Snow monkeys (macaques) bathe in natural hot springs during freezing winters — they invented spa culture!', habitat: 'Mountain forests of Nagano', conservationStatus: 'Least Concern', didYouKnow: 'They pass learned behaviors between generations — scientists observed them washing sweet potatoes in the ocean.' },
  { id: 'nat_tanuki_real', name: 'Tanuki (Raccoon Dog)', countryId: 'jp', funFact: 'The tanuki is a real animal that looks like a raccoon but is actually related to dogs and wolves!', habitat: 'Forests across Japan', conservationStatus: 'Least Concern', didYouKnow: 'Tanuki are the inspiration for beloved characters in Japanese folklore and video games.' },
  { id: 'nat_platypus', name: 'Platypus', countryId: 'au', funFact: 'The platypus has a duck bill, beaver tail, and venomous ankle spurs. When first discovered, scientists thought it was a hoax!', habitat: 'Rivers and streams of eastern Australia', conservationStatus: 'Near Threatened', didYouKnow: 'Platypuses can sense electric fields from prey moving underwater using their bills.' },
  { id: 'nat_koala', name: 'Koala', countryId: 'au', funFact: 'Koalas sleep up to 22 hours a day because eucalyptus leaves give them very little energy!', habitat: 'Eucalyptus forests', conservationStatus: 'Vulnerable', didYouKnow: 'Koalas have fingerprints so similar to humans that they have confused crime scene investigators!' },
  { id: 'nat_wildebeest', name: 'Wildebeest', countryId: 'ke', funFact: 'Every year, 1.5 million wildebeest migrate in a massive circle through Kenya and Tanzania — the greatest animal migration on Earth!', habitat: 'Maasai Mara savannahs', conservationStatus: 'Least Concern', didYouKnow: 'Baby wildebeest can stand and run within minutes of being born to escape predators.' },
  { id: 'nat_giraffe', name: 'Giraffe', countryId: 'ke', funFact: 'Giraffes have the same number of neck vertebrae as humans (7!) — theirs are just much, much longer.', habitat: 'East African savannahs', conservationStatus: 'Vulnerable', didYouKnow: 'A giraffe\'s tongue is up to 50cm long and dark purple to protect it from sunburn while eating.' },
  { id: 'nat_puffin', name: 'Atlantic Puffin', countryId: 'no', funFact: 'Puffins can hold up to 12 fish in their beaks at once, arranged neatly in a row. They\'re called "sea parrots!"', habitat: 'Coastal cliffs of Norway', conservationStatus: 'Vulnerable', didYouKnow: 'Puffin beaks glow under UV light! Scientists only recently discovered this.' },
  { id: 'nat_polar_bear', name: 'Polar Bear', countryId: 'no', funFact: 'Polar bear fur isn\'t white — it\'s transparent! Each hair is hollow and reflects light, making them look white.', habitat: 'Arctic Svalbard islands', conservationStatus: 'Vulnerable', didYouKnow: 'Under their fur, polar bears have black skin to absorb heat from the sun.' },
  { id: 'nat_capybara', name: 'Capybara', countryId: 'br', funFact: 'Capybaras are the world\'s largest rodents — like guinea pigs the size of dogs! They\'re incredibly social and relaxed.', habitat: 'Wetlands and rivers of Brazil', conservationStatus: 'Least Concern', didYouKnow: 'Capybaras are so calm that other animals (birds, monkeys, even crocodilians) will sit on top of them!' },
  { id: 'nat_toucan', name: 'Toucan', countryId: 'br', funFact: 'A toucan\'s colorful bill can be one-third of its body length, but it\'s surprisingly lightweight — made of hollow honeycomb bone!', habitat: 'Amazon rainforest canopy', conservationStatus: 'Least Concern', didYouKnow: 'Toucans use their big bills as natural air conditioners — they radiate heat to cool down.' },
  { id: 'nat_axolotl', name: 'Axolotl', countryId: 'mx', funFact: 'Axolotls can regrow entire limbs, parts of their heart, and even their brain! Scientists study them to understand regeneration.', habitat: 'Lake Xochimilco, Mexico City', conservationStatus: 'Critically Endangered', didYouKnow: 'The Aztecs named them after Xolotl, the god of fire and lightning, who disguised himself as a salamander.' },
  { id: 'nat_monarch', name: 'Monarch Butterfly', countryId: 'mx', funFact: 'Monarch butterflies migrate up to 4,800 km from Canada to Mexico — and somehow find the same trees their great-grandparents used!', habitat: 'Oyamel fir forests of Michoacán', conservationStatus: 'Endangered', didYouKnow: 'No single butterfly completes the round trip. It takes 4 generations to make the full journey.' },
  { id: 'nat_chameleon', name: 'Panther Chameleon', countryId: 'mg', funFact: 'Chameleons don\'t change color to blend in — they change color to communicate their mood, like a living mood ring!', habitat: 'Madagascar rainforests', conservationStatus: 'Least Concern', didYouKnow: 'A chameleon\'s tongue can shoot out at 13 miles per hour — faster than a fighter jet taking off!' },
  { id: 'nat_bengal_tiger', name: 'Bengal Tiger', countryId: 'in', funFact: 'No two tigers have the same stripe pattern — it\'s like a fingerprint. Even shaving the fur reveals striped skin underneath!', habitat: 'Indian forests and mangroves', conservationStatus: 'Endangered', didYouKnow: 'Tigers are one of the few big cats that enjoy swimming. They can swim across rivers several miles wide.' },
  { id: 'nat_peacock', name: 'Indian Peacock', countryId: 'in', funFact: 'The peacock\'s spectacular tail feathers (which are actually their back) have eye-shaped spots that shimmer with iridescent color.', habitat: 'Forests and gardens across India', conservationStatus: 'Least Concern', didYouKnow: 'India\'s national bird uses its tail fan to communicate — different displays mean different things!' },
  { id: 'nat_loggerhead_turtle', name: 'Loggerhead Sea Turtle', countryId: 'gr', funFact: 'Loggerhead turtles return to the exact beach where they were born to lay their own eggs, navigating thousands of miles!', habitat: 'Mediterranean beaches of Zakynthos', conservationStatus: 'Vulnerable', didYouKnow: 'The temperature of the sand determines whether baby turtles will be male or female!' },
  { id: 'nat_scarab', name: 'Scarab Beetle', countryId: 'eg', funFact: 'Ancient Egyptians worshipped the scarab beetle because it rolls dung into balls — they saw it as a symbol of the sun moving across the sky!', habitat: 'Desert and Nile Valley', conservationStatus: 'Least Concern', didYouKnow: 'Scarab amulets were the most popular lucky charm in ancient Egypt. Pharaohs were buried with them.' },
  { id: 'nat_iberian_lynx', name: 'Iberian Lynx', countryId: 'es', funFact: 'The Iberian lynx is the world\'s most endangered wild cat — by 2002 only 94 were left! Conservation brought them back to over 1,000.', habitat: 'Mediterranean scrublands of Spain', conservationStatus: 'Endangered', didYouKnow: 'This is one of the greatest conservation comebacks in history — proof that humans can help reverse extinction.' },
  { id: 'nat_red_panda', name: 'Red Panda', countryId: 'cn', funFact: 'Despite their name, red pandas aren\'t closely related to giant pandas. They\'re actually in their own unique family!', habitat: 'Mountain bamboo forests of China', conservationStatus: 'Endangered', didYouKnow: 'The word "panda" likely comes from the Nepali word "ponya" meaning bamboo-eater — and it originally meant the red panda!' },
  { id: 'nat_giant_panda', name: 'Giant Panda', countryId: 'cn', funFact: 'Pandas spend 10-16 hours a day eating bamboo. They need to eat about 38 kg (84 pounds) of it every single day!', habitat: 'Mountain forests of Sichuan', conservationStatus: 'Vulnerable', didYouKnow: 'Pandas have a special "pseudo-thumb" — actually an extended wrist bone — that helps them grip bamboo stalks.' },
  { id: 'nat_flamingo', name: 'Greater Flamingo', countryId: 'ke', funFact: 'Flamingos are born grey-white. They turn pink from eating shrimp and algae that contain natural pink pigments!', habitat: 'Lake Nakuru, Kenya', conservationStatus: 'Least Concern', didYouKnow: 'Over 2 million flamingos gather at Lake Nakuru — creating a pink layer so large it\'s visible from space!' },
  { id: 'nat_wolf', name: 'Grey Wolf', countryId: 'no', funFact: 'Wolves howl to communicate across distances up to 16 km. Each wolf has a unique howl, like a voice fingerprint!', habitat: 'Scandinavian boreal forests', conservationStatus: 'Least Concern', didYouKnow: 'Wolves are incredibly social and form deep family bonds. The "alpha" concept is a myth — they\'re led by parents.' },
  { id: 'nat_camel', name: 'Dromedary Camel', countryId: 'eg', funFact: 'Camels don\'t store water in their humps — they store fat! A thirsty camel can drink 200 liters (53 gallons) in just 3 minutes.', habitat: 'Sahara Desert', conservationStatus: 'Domesticated', didYouKnow: 'Camels can close their nostrils and have three eyelids to protect against sandstorms.' },
  { id: 'nat_angora_cat', name: 'Turkish Angora Cat', countryId: 'tr', funFact: 'Turkish Angora cats are one of the oldest natural cat breeds. They\'re treasured as national treasures in Turkey!', habitat: 'Ankara Zoo breeding program', conservationStatus: 'Protected breed', didYouKnow: 'Many Turkish Angoras have heterochromia — one blue eye and one amber eye — which is considered a sign of good luck in Turkey.' },
  { id: 'nat_african_elephant', name: 'African Elephant', countryId: 'ke', funFact: 'Elephants are the only animals that can\'t jump. But they can communicate using low-frequency sounds that travel through the ground!', habitat: 'Amboseli National Park', conservationStatus: 'Endangered', didYouKnow: 'Elephants mourn their dead, gently touching the bones of deceased family members with their trunks.' },
];

export function getNatureForCountry(countryId: string): NatureEntry[] {
  return NATURE_AND_ANIMALS.filter((n) => n.countryId === countryId);
}

// ─── HISTORY MOMENTS ───

export interface HistoryMoment {
  id: string;
  title: string;
  countryId: string;
  era: string;
  story: string[];
  whatIf: string;
  presentDayConnection: string;
}

export const HISTORY_MOMENTS: HistoryMoment[] = [
  {
    id: 'hist_pyramids', title: 'Building the Great Pyramids', countryId: 'eg', era: '2560 BC',
    story: [
      'Over 4,500 years ago, tens of thousands of skilled workers spent 20 years building the Great Pyramid of Giza. Each stone block weighs as much as a car!',
      'Contrary to popular belief, the builders were not slaves but paid, well-fed workers who lived in a purpose-built village. They were proud of their work.',
      'The pyramid was originally covered in smooth white limestone that gleamed in the desert sun. It was the tallest building in the world for 3,800 years!',
    ],
    whatIf: 'What if the pyramids were never built? Would we still know about Ancient Egypt?',
    presentDayConnection: 'The pyramids are the last surviving Ancient Wonder. They\'ve inspired architecture, from the Louvre\'s glass pyramid to Las Vegas hotels.',
  },
  {
    id: 'hist_samurai', title: 'The Age of the Samurai', countryId: 'jp', era: '1185-1868',
    story: [
      'For nearly 700 years, samurai warriors were the ruling class of Japan. They followed bushido — "the way of the warrior" — a strict code of honor, loyalty, and discipline.',
      'Samurai trained in sword fighting (kenjutsu), archery, and horse riding from childhood. Their katana swords were considered their soul.',
      'The samurai era ended in 1868 when Japan modernized during the Meiji Restoration, replacing swords with modern technology at breathtaking speed.',
    ],
    whatIf: 'What if the samurai never gave up their swords? Would Japan have become the tech powerhouse it is today?',
    presentDayConnection: 'Bushido values of discipline, respect, and craftsmanship still deeply influence Japanese culture, business, and martial arts worldwide.',
  },
  {
    id: 'hist_vikings', title: 'Viking Voyages Across the World', countryId: 'no', era: '793-1066 AD',
    story: [
      'Norwegian Vikings didn\'t just raid — they were incredible explorers and traders. They sailed across the Atlantic in open longships with no compass!',
      'Leif Eriksson reached North America around 1000 AD — nearly 500 years before Columbus! They called it "Vinland" (Wine Land).',
      'Vikings also traveled east to Baghdad and Constantinople, trading furs and amber for silk, silver, and spices along vast river networks.',
    ],
    whatIf: 'What if the Vikings had stayed in North America? How would the history of the Americas be different?',
    presentDayConnection: 'Viking words live on in English: "Thursday" comes from Thor, "husband" and "window" are Old Norse. Many English place names in Britain end in "-by" (Viking for "village").',
  },
  {
    id: 'hist_machu_picchu', title: 'The Hidden City of Machu Picchu', countryId: 'pe', era: '1450 AD',
    story: [
      'The Inca built Machu Picchu 2,430 meters high in the Andes mountains. The city was so hidden in the clouds that the Spanish conquerors never found it!',
      'The Inca had no iron tools, no wheels, and no written language — yet they built perfectly fitted stone walls using nothing but stone hammers and incredible patience.',
      'The city was abandoned around 1572 and remained unknown to the outside world until Hiram Bingham rediscovered it in 1911.',
    ],
    whatIf: 'What if the Spanish had found Machu Picchu? Would this incredible site still exist today?',
    presentDayConnection: 'Machu Picchu is now a UNESCO World Heritage Site and one of the New 7 Wonders of the World, visited by over 1 million people per year.',
  },
  {
    id: 'hist_french_revolution', title: 'The French Revolution', countryId: 'fr', era: '1789',
    story: [
      'In 1789, ordinary French people — hungry, poor, and tired of an unfair system — rose up against their king and the wealthy nobles.',
      'They stormed the Bastille prison (now a national holiday on July 14th), declared "Liberty, Equality, Fraternity," and changed the world forever.',
      'The Revolution abolished the monarchy and inspired democratic movements across the globe. The Declaration of the Rights of Man influenced the US Bill of Rights.',
    ],
    whatIf: 'What if the revolution never happened? Would democracy have spread around the world?',
    presentDayConnection: '"Liberté, Égalité, Fraternité" is still France\'s motto, and Bastille Day is celebrated with fireworks at the Eiffel Tower every year.',
  },
  {
    id: 'hist_great_wall', title: 'Building the Great Wall of China', countryId: 'cn', era: '700 BC - 1644 AD',
    story: [
      'The Great Wall wasn\'t built all at once — it was constructed over 2,000 years by many different dynasties, each adding and rebuilding sections.',
      'At its longest, the wall stretches over 21,000 km including all branches. It\'s not visible from space with the naked eye (that\'s a myth!), but it IS visible from low orbit.',
      'Millions of workers built the wall using stones, bricks, tamped earth, and even sticky rice as mortar. It was a massive feat of human determination.',
    ],
    whatIf: 'What if the wall had never been built? Would China\'s borders and culture be completely different today?',
    presentDayConnection: 'The Great Wall is China\'s most iconic symbol, a UNESCO site, and one of the most visited monuments in the world.',
  },
  {
    id: 'hist_maori_migration', title: 'Maori Migration to Aotearoa', countryId: 'nz', era: '1250-1300 AD',
    story: [
      'Polynesian voyagers sailed across thousands of miles of open Pacific Ocean in double-hulled canoes (waka hourua) to reach New Zealand — guided only by stars, waves, and birds.',
      'They called the land "Aotearoa" — the land of the long white cloud. This was one of the last major landmasses on Earth to be settled by humans.',
      'The Maori developed a rich culture with carved meeting houses (wharenui), the haka war dance, and jade (pounamu) treasures passed down through generations.',
    ],
    whatIf: 'What if the Polynesian voyagers had turned back? Would New Zealand have remained uninhabited for centuries?',
    presentDayConnection: 'Maori culture is central to New Zealand\'s identity today. The haka is performed by the All Blacks rugby team before every match, witnessed by billions.',
  },
  {
    id: 'hist_roman_empire', title: 'The Rise and Fall of Rome', countryId: 'it', era: '753 BC - 476 AD',
    story: [
      'From a tiny village on the Tiber River, Rome grew into an empire that ruled over 70 million people — a quarter of the world\'s population at the time!',
      'Romans invented concrete, built aqueducts that carried water over mountains, and created a road network so well-built that some Roman roads are still used today.',
      'The empire fell in 476 AD, but its legacy lives on in our laws, languages, architecture, and the very calendar we use.',
    ],
    whatIf: 'What if Rome never fell? Would we all still be speaking Latin today?',
    presentDayConnection: 'Romance languages (French, Spanish, Italian, Portuguese, Romanian) all come from Latin. The US Senate is named after Rome\'s Senatus.',
  },
  {
    id: 'hist_silk_road', title: 'The Silk Road - Connecting Civilizations', countryId: 'cn', era: '130 BC - 1453 AD',
    story: [
      'The Silk Road wasn\'t one road — it was a network of trade routes stretching 6,400 km from China to the Mediterranean. Silk, spices, jade, and ideas traveled along it.',
      'Merchants, monks, and explorers carried not just goods but knowledge. Paper, gunpowder, and the compass all reached Europe via the Silk Road.',
      'Caravansaries (roadside inns) dotted the route, where travelers of all cultures shared stories, food, and ideas — the world\'s first cultural exchanges.',
    ],
    whatIf: 'What if the Silk Road never existed? Would different parts of the world still be completely isolated?',
    presentDayConnection: 'China\'s modern "Belt and Road Initiative" is inspired by the ancient Silk Road, aiming to connect Asia, Europe, and Africa through trade.',
  },
  {
    id: 'hist_ancient_olympics', title: 'The First Olympic Games', countryId: 'gr', era: '776 BC',
    story: [
      'The first Olympic Games were held in Olympia, Greece in 776 BC. For 5 days, athletes from warring city-states declared a sacred truce to compete in peace.',
      'Early events included running, wrestling, boxing, chariot racing, and the pentathlon. Athletes competed completely naked and winners received olive wreaths!',
      'The ancient Games continued for nearly 1,200 years until 393 AD. They were revived in Athens in 1896 and continue to this day.',
    ],
    whatIf: 'What if the Olympics hadn\'t included a sacred truce? Would sports ever have become a tool for peace?',
    presentDayConnection: 'The modern Olympic flame is still lit at Olympia, Greece, and carried by torch relay to the host city — a direct link to the ancient tradition.',
  },
  {
    id: 'hist_aztec_tenochtitlan', title: 'Tenochtitlan - The Aztec Island City', countryId: 'mx', era: '1325 AD',
    story: [
      'The Aztecs built their capital Tenochtitlan on an island in the middle of a lake. Connected by causeways, it was larger than any European city of its time — home to 200,000 people!',
      'They created "floating gardens" (chinampas) on the lake to grow food, built towering pyramids, and had a complex calendar more accurate than the European one.',
      'When Spanish conquistadors arrived in 1519, they were stunned. Hernán Cortés wrote that "we could not believe what we saw."',
    ],
    whatIf: 'What if Cortés had never arrived? What would Tenochtitlan look like today?',
    presentDayConnection: 'Mexico City is built directly on top of ancient Tenochtitlan. Archaeologists still find Aztec ruins beneath modern buildings.',
  },
  {
    id: 'hist_rosetta_stone', title: 'Cracking the Code: The Rosetta Stone', countryId: 'eg', era: '196 BC / 1799',
    story: [
      'For centuries, no one could read Egyptian hieroglyphics. The knowledge died with the last priests who used them. Then, in 1799, French soldiers found a stone near Rosetta.',
      'The stone had the same text in three languages: hieroglyphics, Demotic, and Ancient Greek. Since scholars could read Greek, they finally had a key to crack the code!',
      'It took another 20 years, but in 1822, Jean-François Champollion decoded hieroglyphics — suddenly, 3,000 years of Egyptian history could be read for the first time.',
    ],
    whatIf: 'What if the Rosetta Stone was never found? Would Egyptian hieroglyphics still be a mystery?',
    presentDayConnection: 'The Rosetta Stone now lives in the British Museum. "Rosetta Stone" has become a term meaning any key to understanding something new!',
  },
  {
    id: 'hist_han_dynasty', title: 'The Han Dynasty Golden Age', countryId: 'cn', era: '206 BC - 220 AD',
    story: [
      'The Han Dynasty was so influential that the Chinese majority still call themselves "Han" people. It was a golden age of invention, art, and expansion.',
      'During this era, the Chinese invented paper, the seismograph (earthquake detector), and perfected silk production. The Silk Road flourished under Han rule.',
      'The civil service exam system — choosing government officials by test scores rather than birth — was a revolutionary idea that influenced systems worldwide.',
    ],
    whatIf: 'What if paper hadn\'t been invented? How would the world share and store knowledge?',
    presentDayConnection: 'The concept of meritocracy (advancement through ability) that the Han Dynasty pioneered still shapes education systems worldwide.',
  },
  {
    id: 'hist_mughal_taj', title: 'The Mughal Empire and the Taj Mahal', countryId: 'in', era: '1632 AD',
    story: [
      'Emperor Shah Jahan was so heartbroken when his wife Mumtaz Mahal died that he built the most beautiful building in the world as her tomb — the Taj Mahal.',
      'Over 20,000 workers and 1,000 elephants spent 22 years building it. The white marble changes color throughout the day — pink at dawn, white at noon, golden at sunset.',
      'The Mughal Empire blended Persian, Indian, and Islamic art into a stunning cultural fusion that produced some of the world\'s greatest architecture and food.',
    ],
    whatIf: 'What if Shah Jahan had never built the Taj Mahal? Would India have a different symbol to the world?',
    presentDayConnection: 'The Taj Mahal is one of the New 7 Wonders of the World and India\'s most visited monument — a love letter frozen in marble.',
  },
  {
    id: 'hist_greek_democracy', title: 'The Birth of Democracy in Athens', countryId: 'gr', era: '508 BC',
    story: [
      'In 508 BC, Athens tried something the world had never seen: letting citizens vote on laws directly. They called it "demokratia" — rule by the people.',
      'Citizens gathered on a hillside called the Pnyx, debated issues, and voted by show of hands. Any citizen could propose a law or speak their mind.',
      'It wasn\'t perfect — women and enslaved people couldn\'t vote — but it planted a seed that would eventually change how the entire world is governed.',
    ],
    whatIf: 'What if Athens had kept its monarchy? Would democracy exist today?',
    presentDayConnection: 'Nearly every country on Earth is influenced by Athenian democracy. The word "democracy" itself comes directly from ancient Greek.',
  },
  {
    id: 'hist_aboriginal_art', title: 'The World\'s Oldest Art Tradition', countryId: 'au', era: '65,000 years ago',
    story: [
      'Aboriginal Australians created the world\'s oldest continuous art tradition — rock paintings and engravings dating back over 65,000 years, making them older than the Ice Age!',
      'Their art isn\'t decoration — it\'s a map, a history book, and a spiritual guide all in one. Dot paintings encode information about water sources, food, and sacred sites.',
      'These aren\'t just ancient artifacts. Aboriginal art traditions continue to this day, making it the longest unbroken cultural tradition in human history.',
    ],
    whatIf: 'What if Aboriginal Australians hadn\'t maintained their art traditions? Would we know about the earliest human cultures?',
    presentDayConnection: 'Aboriginal Australian art is now collected by major museums worldwide. Indigenous knowledge of land management, including controlled burns, is being adopted globally.',
  },
  {
    id: 'hist_inca_roads', title: 'The Inca Road System', countryId: 'pe', era: '1400-1533 AD',
    story: [
      'Without wheels or horses, the Inca built a 40,000 km road network through some of the most challenging terrain on Earth — over mountains, through jungles, and across deserts.',
      'Chasqui runners carried messages along the roads in a relay system so fast that fresh fish from the coast could reach the emperor in the mountains in just 2 days!',
      'Rope bridges made from woven grass spanned massive gorges. Some were rebuilt annually as community events — a tradition that continues to this day.',
    ],
    whatIf: 'What if the Inca had invented the wheel? Could they have built an even larger empire?',
    presentDayConnection: 'The last Inca rope bridge, Q\'eswachaka, is still rebuilt each year by local communities using the same techniques — a living connection to the past.',
  },
  {
    id: 'hist_printing_press', title: 'Gutenberg\'s Printing Revolution', countryId: 'de', era: '1440 AD',
    story: [
      'Before Johannes Gutenberg, every book had to be copied by hand — it could take a monk an entire year to copy one Bible! Books were rarer than gold.',
      'Gutenberg invented movable type printing, where individual letters could be rearranged and reused. Suddenly, books could be mass-produced affordably.',
      'Within 50 years, 20 million volumes had been printed. The printing press sparked the Renaissance, the Scientific Revolution, and the spread of knowledge to ordinary people.',
    ],
    whatIf: 'What if the printing press was never invented? Would most people still be unable to read?',
    presentDayConnection: 'The printing press is considered the most important invention of the last thousand years. It led directly to newspapers, education for all, and eventually the internet.',
  },
  {
    id: 'hist_korean_hangul', title: 'King Sejong Invents Hangul', countryId: 'kr', era: '1443 AD',
    story: [
      'King Sejong the Great of Korea noticed that only the wealthy could read, because Chinese characters were too complex for ordinary people to learn.',
      'He personally designed a brand-new alphabet called Hangul, scientifically based on the shapes the mouth makes when speaking. It had just 28 letters (24 today).',
      'The elite objected — they wanted to keep knowledge exclusive — but Sejong published it anyway, declaring that all his people deserved to read and write.',
    ],
    whatIf: 'What if King Sejong had listened to the elite? Would Korea have the nearly 100% literacy rate it has today?',
    presentDayConnection: 'Hangul is considered one of the most scientific writing systems ever created. October 9th is Hangul Day in South Korea — a national holiday!',
  },
  {
    id: 'hist_carnival', title: 'The Birth of Brazilian Carnival', countryId: 'br', era: '1723',
    story: [
      'Carnival in Brazil began as a Portuguese tradition but was transformed by African-Brazilians who brought their music, dance, and vibrant creativity.',
      'Samba — the heartbeat of Carnival — evolved from African rhythms, particularly from the Bantu people of Angola. It became the soundtrack of Brazilian identity.',
      'Today, Rio\'s Carnival is the largest festival in the world: 2 million people per day, elaborate costumes that take a year to make, and samba schools competing in parades.',
    ],
    whatIf: 'What if African influences hadn\'t shaped Carnival? What would Brazil\'s culture look like?',
    presentDayConnection: 'Carnival generates $3 billion for Brazil\'s economy. The fusion of cultures that created it reflects Brazil\'s proudly diverse identity.',
  },
];

export function getHistoryForCountry(countryId: string): HistoryMoment[] {
  return HISTORY_MOMENTS.filter((h) => h.countryId === countryId);
}

// ─── COUNTRY-SPECIFIC QUIZ QUESTIONS (10 per country) ───

export const COUNTRY_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  jp: [
    { id: 'jp1', question: 'What is the capital of Japan?', options: ['Osaka', 'Tokyo', 'Kyoto', 'Hiroshima'], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
    { id: 'jp2', question: 'What do Japanese people eat with?', options: ['Forks', 'Hands', 'Chopsticks', 'Spoons'], correct: 2, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600' },
    { id: 'jp3', question: 'What is sushi rice flavored with?', options: ['Soy sauce', 'Vinegar', 'Sugar', 'Ketchup'], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600' },
    { id: 'jp4', question: 'Cherry blossom season in Japan is called...', options: ['Matsuri', 'Hanami', 'Origami', 'Tsunami'], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600' },
    { id: 'jp5', question: 'Mount Fuji is a famous Japanese...', options: ['River', 'Desert', 'Volcano', 'Forest'], correct: 2, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600' },
    { id: 'jp6', question: 'What is origami?', options: ['Cooking', 'Paper folding', 'Sword fighting', 'Painting'], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600' },
    { id: 'jp7', question: 'Samurai were Japanese...', options: ['Chefs', 'Warriors', 'Farmers', 'Teachers'], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600' },
    { id: 'jp8', question: 'What is the traditional Japanese robe called?', options: ['Sari', 'Kimono', 'Hanbok', 'Kilt'], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600' },
    { id: 'jp9', question: 'In Japan, slurping noodles means...', options: ["You're rude", "You're enjoying them", "You're full", "You want more"], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
    { id: 'jp10', question: '"Kawaii" means what in Japanese?', options: ['Scary', 'Cute', 'Big', 'Fast'], correct: 1, category: 'jp', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600' },
  ],
  fr: [
    { id: 'fr1', question: 'What is the capital of France?', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], correct: 1, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
    { id: 'fr2', question: 'The Eiffel Tower was built for which event?', options: ['A wedding', 'World\'s Fair 1889', 'Napoleon\'s victory', 'Christmas'], correct: 1, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600' },
    { id: 'fr3', question: 'What is a croissant shaped like?', options: ['A star', 'A crescent moon', 'A circle', 'A triangle'], correct: 1, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600' },
    { id: 'fr4', question: 'French people greet with kisses on the...', options: ['Forehead', 'Hand', 'Cheeks', 'Nose'], correct: 2, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600' },
    { id: 'fr5', question: '"Merci beaucoup" means...', options: ['Good morning', 'Thank you very much', 'See you later', 'Excuse me'], correct: 1, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },
    { id: 'fr6', question: 'The Louvre in Paris is a famous...', options: ['Restaurant', 'Museum', 'Park', 'Church'], correct: 1, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600' },
    { id: 'fr7', question: 'Baguette is a type of French...', options: ['Dance', 'Song', 'Bread', 'Hat'], correct: 2, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1549931319-a0a151e95b1d?w=600' },
    { id: 'fr8', question: 'France is known for making amazing...', options: ['Sushi', 'Cheese', 'Tacos', 'Curry'], correct: 1, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600' },
    { id: 'fr9', question: 'The French flag has how many colors?', options: ['Two', 'Three', 'Four', 'Five'], correct: 1, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
    { id: 'fr10', question: '"Au revoir" means...', options: ['Hello', 'Please', 'Goodbye', 'Sorry'], correct: 2, category: 'fr', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f575c4d?w=600' },
  ],
  mx: [
    { id: 'mx1', question: 'What is the capital of Mexico?', options: ['Cancún', 'Guadalajara', 'Mexico City', 'Monterrey'], correct: 2, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600' },
    { id: 'mx2', question: 'Día de los Muertos celebrates...', options: ['Sports', 'Loved ones who passed', 'Birthdays', 'Harvests'], correct: 1, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600' },
    { id: 'mx3', question: 'A taco is made with a...', options: ['Bun', 'Tortilla', 'Pita', 'Naan'], correct: 1, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600' },
    { id: 'mx4', question: 'Piñatas are traditionally filled with...', options: ['Water', 'Sand', 'Candy', 'Rice'], correct: 2, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' },
    { id: 'mx5', question: 'The ancient pyramid of Chichén Itzá was built by the...', options: ['Aztecs', 'Incas', 'Maya', 'Romans'], correct: 2, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600' },
    { id: 'mx6', question: 'Mexico\'s currency is the...', options: ['Dollar', 'Euro', 'Peso', 'Yen'], correct: 2, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600' },
    { id: 'mx7', question: 'What instrument is iconic in Mexican mariachi music?', options: ['Piano', 'Trumpet', 'Flute', 'Drums'], correct: 1, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' },
    { id: 'mx8', question: 'Guacamole is made from...', options: ['Tomatoes', 'Avocados', 'Peppers', 'Beans'], correct: 1, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600' },
    { id: 'mx9', question: '"Hola, amigo" means...', options: ['Goodbye friend', 'Hello friend', 'Thank you friend', 'Sorry friend'], correct: 1, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600' },
    { id: 'mx10', question: 'Mexico is bordered by which ocean on the west?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, category: 'mx', imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600' },
  ],
  it: [
    { id: 'it1', question: 'What is the capital of Italy?', options: ['Milan', 'Venice', 'Rome', 'Florence'], correct: 2, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600' },
    { id: 'it2', question: 'The Colosseum was used for...', options: ['Shopping', 'Gladiator games', 'School', 'Farming'], correct: 1, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600' },
    { id: 'it3', question: 'Pizza originated in which Italian city?', options: ['Rome', 'Milan', 'Naples', 'Venice'], correct: 2, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600' },
    { id: 'it4', question: 'Venice is famous for its...', options: ['Mountains', 'Canals', 'Deserts', 'Forests'], correct: 1, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600' },
    { id: 'it5', question: 'Gelato is the Italian word for...', options: ['Cake', 'Cookie', 'Ice cream', 'Candy'], correct: 2, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600' },
    { id: 'it6', question: 'The Leaning Tower is in which city?', options: ['Rome', 'Pisa', 'Venice', 'Milan'], correct: 1, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1585735296932-2a2d10baef48?w=600' },
    { id: 'it7', question: '"Ciao bella" means...', options: ['Good night', 'Hello beautiful', 'Thank you', 'Excuse me'], correct: 1, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600' },
    { id: 'it8', question: 'Italy is shaped like a...', options: ['Star', 'Boot', 'Heart', 'Fish'], correct: 1, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600' },
    { id: 'it9', question: 'Leonardo da Vinci painted the...', options: ['Starry Night', 'Mona Lisa', 'The Scream', 'Girl with a Pearl'], correct: 1, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600' },
    { id: 'it10', question: 'What sport is Italy crazy about?', options: ['Baseball', 'Cricket', 'Football (soccer)', 'Hockey'], correct: 2, category: 'it', imageUrl: 'https://images.unsplash.com/photo-1585735296932-2a2d10baef48?w=600' },
  ],
  gb: [
    { id: 'gb1', question: 'What is the capital of the United Kingdom?', options: ['Edinburgh', 'London', 'Cardiff', 'Dublin'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
    { id: 'gb2', question: 'Big Ben is actually the name of the...', options: ['Tower', 'Bell', 'Clock', 'Bridge'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
    { id: 'gb3', question: 'Afternoon tea is a British tradition of drinking tea with...', options: ['Breakfast', 'Sandwiches & cakes', 'Dinner', 'Soup'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600' },
    { id: 'gb4', question: 'The UK\'s leader lives at 10...', options: ['Baker Street', 'Downing Street', 'Oxford Street', 'Abbey Road'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600' },
    { id: 'gb5', question: 'Which castle is home to the King?', options: ['Edinburgh Castle', 'Windsor Castle', 'Tower of London', 'Warwick Castle'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
    { id: 'gb6', question: '"Brilliant" in British slang means...', options: ['Shiny', 'Awesome/great', 'Terrible', 'Boring'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
    { id: 'gb7', question: 'Fish and chips is a classic British...', options: ['Breakfast', 'Snack', 'Meal', 'Dessert'], correct: 2, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=600' },
    { id: 'gb8', question: 'Harry Potter was written by a British author from...', options: ['London', 'Edinburgh', 'Manchester', 'Liverpool'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
    { id: 'gb9', question: 'The UK drives on which side of the road?', options: ['Right', 'Left', 'Middle', 'It changes'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600' },
    { id: 'gb10', question: 'Stonehenge is a mysterious circle of...', options: ['Trees', 'Stones', 'Water', 'Sand'], correct: 1, category: 'gb', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
  ],
  br: [
    { id: 'br1', question: 'What is the capital of Brazil?', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], correct: 2, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600' },
    { id: 'br2', question: 'Brazil\'s Carnival is famous for...', options: ['Snow', 'Samba & parades', 'Silence', 'Cooking'], correct: 1, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1551649001-7a2482d98d05?w=600' },
    { id: 'br3', question: 'The Amazon Rainforest is the world\'s...', options: ['Smallest', 'Driest', 'Largest', 'Coldest'], correct: 2, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600' },
    { id: 'br4', question: 'What sport is Brazil most famous for?', options: ['Cricket', 'Football (soccer)', 'Baseball', 'Tennis'], correct: 1, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600' },
    { id: 'br5', question: 'Christ the Redeemer statue is in...', options: ['São Paulo', 'Brasília', 'Rio de Janeiro', 'Manaus'], correct: 2, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600' },
    { id: 'br6', question: 'What language do Brazilians speak?', options: ['Spanish', 'Portuguese', 'English', 'French'], correct: 1, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1551649001-7a2482d98d05?w=600' },
    { id: 'br7', question: 'Brazilian açaí bowls are made from...', options: ['Oranges', 'Berries', 'Mangos', 'Bananas'], correct: 1, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600' },
    { id: 'br8', question: 'The Amazon River is the world\'s...', options: ['Shortest', 'Second longest', 'Widest by volume', 'Cleanest'], correct: 2, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600' },
    { id: 'br9', question: '"Obrigado" means what in Portuguese?', options: ['Hello', 'Sorry', 'Thank you', 'Goodbye'], correct: 2, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600' },
    { id: 'br10', question: 'Brazil has the most species of which animal?', options: ['Dogs', 'Birds', 'Fish', 'Cats'], correct: 1, category: 'br', imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600' },
  ],
  kr: [
    { id: 'kr1', question: 'What is the capital of South Korea?', options: ['Busan', 'Seoul', 'Incheon', 'Daegu'], correct: 1, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
    { id: 'kr2', question: 'Kimchi is made primarily from fermented...', options: ['Rice', 'Cabbage', 'Potatoes', 'Corn'], correct: 1, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=600' },
    { id: 'kr3', question: 'What is the Korean alphabet called?', options: ['Kanji', 'Hangul', 'Hiragana', 'Pinyin'], correct: 1, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600' },
    { id: 'kr4', question: 'Which Korean martial art uses powerful kicks?', options: ['Judo', 'Karate', 'Taekwondo', 'Aikido'], correct: 2, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664f59e1a4?w=600' },
    { id: 'kr5', question: 'K-pop stands for...', options: ['Korean pop', 'Kyoto pop', 'Kids pop', 'Kenya pop'], correct: 0, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664f59e1a4?w=600' },
    { id: 'kr6', question: 'Bibimbap means...', options: ['Fried rice', 'Mixed rice', 'Sticky rice', 'Sweet rice'], correct: 1, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600' },
    { id: 'kr7', question: 'The Korean New Year celebration is called...', options: ['Chuseok', 'Seollal', 'Songkran', 'Diwali'], correct: 1, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600' },
    { id: 'kr8', question: 'Who invented the Korean alphabet?', options: ['King Sejong', 'Emperor Meiji', 'Confucius', 'Buddha'], correct: 0, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600' },
    { id: 'kr9', question: '"Annyeonghaseyo" means what in Korean?', options: ['Goodbye', 'Thank you', 'Hello', 'Sorry'], correct: 2, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
    { id: 'kr10', question: 'South Korea is famous for its fast...', options: ['Cars', 'Trains', 'Internet', 'Horses'], correct: 2, category: 'kr', imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664f59e1a4?w=600' },
  ],
  th: [
    { id: 'th1', question: 'What is the capital of Thailand?', options: ['Chiang Mai', 'Phuket', 'Bangkok', 'Pattaya'], correct: 2, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
    { id: 'th2', question: 'What is Thailand\'s national animal?', options: ['Tiger', 'Elephant', 'Dragon', 'Monkey'], correct: 1, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600' },
    { id: 'th3', question: 'Thai temples are called...', options: ['Wats', 'Shrines', 'Pagodas', 'Mosques'], correct: 0, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
    { id: 'th4', question: 'Songkran is celebrated with a massive...', options: ['Fire show', 'Water fight', 'Kite festival', 'Dance battle'], correct: 1, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600' },
    { id: 'th5', question: 'Pad Thai is a dish made with...', options: ['Rice', 'Noodles', 'Bread', 'Potatoes'], correct: 1, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600' },
    { id: 'th6', question: 'Muay Thai uses how many "limbs"?', options: ['Four', 'Six', 'Eight', 'Ten'], correct: 2, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600' },
    { id: 'th7', question: 'Thailand used to be called...', options: ['Burma', 'Siam', 'Ceylon', 'Indochina'], correct: 1, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
    { id: 'th8', question: 'The Thai greeting "wai" involves pressing...', options: ['Fists together', 'Palms together', 'Elbows together', 'Noses together'], correct: 1, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600' },
    { id: 'th9', question: '"Sawadee" means what in Thai?', options: ['Thank you', 'Goodbye', 'Hello', 'Please'], correct: 2, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600' },
    { id: 'th10', question: 'Thai silk is famous for being very...', options: ['Rough', 'Shimmering', 'Stretchy', 'Heavy'], correct: 1, category: 'th', imageUrl: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600' },
  ],
  ma: [
    { id: 'ma1', question: 'What is the capital of Morocco?', options: ['Casablanca', 'Marrakech', 'Rabat', 'Fez'], correct: 2, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=600' },
    { id: 'ma2', question: 'Morocco is on which continent?', options: ['Asia', 'Europe', 'Africa', 'South America'], correct: 2, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
    { id: 'ma3', question: 'A Moroccan medina is an old walled...', options: ['Garden', 'City', 'Castle', 'Farm'], correct: 1, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=600' },
    { id: 'ma4', question: 'What desert partly covers Morocco?', options: ['Gobi', 'Sahara', 'Atacama', 'Kalahari'], correct: 1, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
    { id: 'ma5', question: 'Moroccan mint tea is known as...', options: ['Chai', 'Matcha', 'Moroccan whiskey (a joke name)', 'Green gold'], correct: 2, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600' },
    { id: 'ma6', question: 'A tagine is shaped like a...', options: ['Square', 'Cone', 'Star', 'Tube'], correct: 1, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600' },
    { id: 'ma7', question: 'The Atlas Mountains are in...', options: ['Morocco', 'Egypt', 'Kenya', 'Turkey'], correct: 0, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
    { id: 'ma8', question: 'Zellige is the Moroccan art of...', options: ['Painting', 'Tile mosaic', 'Wood carving', 'Weaving'], correct: 1, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=600' },
    { id: 'ma9', question: '"Shukran" means what in Arabic?', options: ['Hello', 'Goodbye', 'Thank you', 'Please'], correct: 2, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600' },
    { id: 'ma10', question: 'Couscous is traditionally eaten on which day in Morocco?', options: ['Monday', 'Wednesday', 'Friday', 'Sunday'], correct: 2, category: 'ma', imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600' },
  ],
  pe: [
    { id: 'pe1', question: 'What is the capital of Peru?', options: ['Cusco', 'Lima', 'Arequipa', 'Machu Picchu'], correct: 1, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
    { id: 'pe2', question: 'Machu Picchu was built by the...', options: ['Maya', 'Aztec', 'Inca', 'Spanish'], correct: 2, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
    { id: 'pe3', question: 'What is Peru\'s national dish?', options: ['Tacos', 'Ceviche', 'Paella', 'Sushi'], correct: 1, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600' },
    { id: 'pe4', question: 'The Andes Mountains run through...', options: ['Africa', 'Asia', 'South America', 'Europe'], correct: 2, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600' },
    { id: 'pe5', question: 'Peru is the birthplace of the...', options: ['Tomato', 'Potato', 'Carrot', 'Onion'], correct: 1, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600' },
    { id: 'pe6', question: 'Quipus were Inca recording devices made from...', options: ['Stone', 'Clay', 'Knotted strings', 'Metal'], correct: 2, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1531968455002-901e9197d212?w=600' },
    { id: 'pe7', question: 'Which animal provides soft wool in Peru?', options: ['Sheep', 'Alpaca', 'Goat', 'Rabbit'], correct: 1, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600' },
    { id: 'pe8', question: 'Lake Titicaca is the highest navigable lake in...', options: ['Africa', 'Asia', 'The world', 'Europe'], correct: 2, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600' },
    { id: 'pe9', question: 'What language did the Inca speak?', options: ['Spanish', 'Latin', 'Quechua', 'Portuguese'], correct: 2, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1531968455002-901e9197d212?w=600' },
    { id: 'pe10', question: 'Peru\'s purple corn is used to make a drink called...', options: ['Pisco', 'Chicha morada', 'Horchata', 'Maté'], correct: 1, category: 'pe', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
  ],
  ke: [
    { id: 'ke1', question: 'What is the capital of Kenya?', options: ['Mombasa', 'Nairobi', 'Kisumu', 'Nakuru'], correct: 1, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600' },
    { id: 'ke2', question: 'The Maasai Mara is famous for the annual...', options: ['Festival', 'Great Migration', 'Marathon', 'Harvest'], correct: 1, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
    { id: 'ke3', question: 'Kenya\'s Big Five animals do NOT include...', options: ['Lions', 'Elephants', 'Giraffes', 'Rhinos'], correct: 2, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
    { id: 'ke4', question: '"Jambo" means what in Swahili?', options: ['Goodbye', 'Thank you', 'Hello', 'Friend'], correct: 2, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
    { id: 'ke5', question: 'Mount Kenya is Africa\'s...', options: ['Tallest peak', 'Second-highest peak', 'Third-highest peak', 'Lowest peak'], correct: 1, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600' },
    { id: 'ke6', question: 'Ugali is made from...', options: ['Rice flour', 'Maize flour', 'Wheat flour', 'Potato flour'], correct: 1, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600' },
    { id: 'ke7', question: 'Nyama choma means...', options: ['Sweet bread', 'Roasted meat', 'Fried fish', 'Spicy soup'], correct: 1, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600' },
    { id: 'ke8', question: 'The Great Rift Valley runs through...', options: ['South America', 'Europe', 'Kenya', 'Australia'], correct: 2, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600' },
    { id: 'ke9', question: 'Kenyan marathon legend Eliud Kipchoge ran a marathon in under...', options: ['3 hours', '2.5 hours', '2 hours', '1.5 hours'], correct: 2, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
    { id: 'ke10', question: '"Hakuna matata" in Swahili means...', options: ['Good morning', 'No worries', 'Let\'s go', 'Goodbye'], correct: 1, category: 'ke', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
  ],
  no: [
    { id: 'no1', question: 'What is the capital of Norway?', options: ['Bergen', 'Oslo', 'Tromsø', 'Stavanger'], correct: 1, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
    { id: 'no2', question: 'Norwegian fjords were carved by...', options: ['Rivers', 'Wind', 'Glaciers', 'Earthquakes'], correct: 2, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
    { id: 'no3', question: 'Vikings traveled in ships called...', options: ['Galleons', 'Longships', 'Canoes', 'Junks'], correct: 1, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
    { id: 'no4', question: 'The Northern Lights are also called...', options: ['Aurora australis', 'Aurora borealis', 'Solar flare', 'Moonbow'], correct: 1, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
    { id: 'no5', question: 'In Norwegian folklore, trolls turn to stone in...', options: ['Rain', 'Moonlight', 'Sunlight', 'Wind'], correct: 2, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
    { id: 'no6', question: 'Brunost is a Norwegian...', options: ['Bread', 'Fish', 'Brown cheese', 'Soup'], correct: 2, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600' },
    { id: 'no7', question: 'The midnight sun means the sun...', options: ['Is very dim', 'Never sets', 'Is red', 'Sets twice'], correct: 1, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
    { id: 'no8', question: '"Friluftsliv" means...', options: ['Cooking outdoors', 'Open-air living', 'Ice swimming', 'Skiing fast'], correct: 1, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600' },
    { id: 'no9', question: 'Viking runes were a type of...', options: ['Food', 'Weapon', 'Alphabet', 'Dance'], correct: 2, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
    { id: 'no10', question: 'Norway is in which region of Europe?', options: ['Southern', 'Eastern', 'Western', 'Scandinavia'], correct: 3, category: 'no', imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
  ],
  tr: [
    { id: 'tr1', question: 'Istanbul sits on which two continents?', options: ['Africa & Asia', 'Europe & Africa', 'Europe & Asia', 'Asia & Australia'], correct: 2, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
    { id: 'tr2', question: 'The Grand Bazaar in Istanbul has over...', options: ['400 shops', '1,000 shops', '4,000 shops', '10,000 shops'], correct: 2, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
    { id: 'tr3', question: 'Turkish delight is called lokum and is a type of...', options: ['Bread', 'Cheese', 'Candy', 'Drink'], correct: 2, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600' },
    { id: 'tr4', question: 'Cappadocia is famous for fairy chimneys and...', options: ['Volcanoes', 'Hot air balloons', 'Waterfalls', 'Pyramids'], correct: 1, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600' },
    { id: 'tr5', question: 'A Turkish hammam is a...', options: ['Market', 'Bathhouse', 'School', 'Restaurant'], correct: 1, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=600' },
    { id: 'tr6', question: 'Hagia Sophia has been a church, a mosque, and a...', options: ['School', 'Museum-mosque', 'Hospital', 'Palace'], correct: 1, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600' },
    { id: 'tr7', question: 'Whirling dervishes spin as a form of...', options: ['Exercise', 'Entertainment', 'Meditation and prayer', 'Cooking'], correct: 2, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600' },
    { id: 'tr8', question: '"Merhaba" means what in Turkish?', options: ['Goodbye', 'Thank you', 'Hello', 'Please'], correct: 2, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
    { id: 'tr9', question: 'Turkish coffee is served in...', options: ['Large mugs', 'Tiny cups', 'Bowls', 'Coconut shells'], correct: 1, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600' },
    { id: 'tr10', question: 'The nazar boncuğu (evil eye charm) is colored...', options: ['Red', 'Green', 'Blue', 'Yellow'], correct: 2, category: 'tr', imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600' },
  ],
  gr: [
    { id: 'gr1', question: 'What is the capital of Greece?', options: ['Sparta', 'Athens', 'Thessaloniki', 'Olympia'], correct: 1, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
    { id: 'gr2', question: 'The ancient Greeks believed gods lived on Mount...', options: ['Everest', 'Olympus', 'Fuji', 'Sinai'], correct: 1, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
    { id: 'gr3', question: 'The Parthenon was built for the goddess...', options: ['Hera', 'Aphrodite', 'Athena', 'Artemis'], correct: 2, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
    { id: 'gr4', question: 'The ancient Olympics started in which year BC?', options: ['1000 BC', '776 BC', '500 BC', '200 BC'], correct: 1, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600' },
    { id: 'gr5', question: 'Greece has about how many islands?', options: ['600', '1,000', '3,000', '6,000'], correct: 3, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600' },
    { id: 'gr6', question: 'Gyros means what in Greek?', options: ['Meat', 'Turn', 'Wrap', 'Bread'], correct: 1, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600' },
    { id: 'gr7', question: 'Which Greek philosopher taught by asking questions?', options: ['Plato', 'Aristotle', 'Socrates', 'Homer'], correct: 2, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
    { id: 'gr8', question: 'Santorini sits on the rim of a volcanic...', options: ['Mountain', 'Crater', 'Island', 'Valley'], correct: 1, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600' },
    { id: 'gr9', question: '"Efcharistó" means what in Greek?', options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'], correct: 2, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?w=600' },
    { id: 'gr10', question: 'The Mediterranean diet is known for lots of...', options: ['Butter', 'Olive oil', 'Cream', 'Sugar'], correct: 1, category: 'gr', imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600' },
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

export const COUNTRY_LOCATIONS: Record<string, CountryLocation[]> = {
  jp: [
    { id: 'jp_loc1', name: 'Tokyo Tower', description: 'A 333-meter communications tower inspired by the Eiffel Tower, lit up beautifully at night.', category: 'landmark', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
    { id: 'jp_loc2', name: 'Fushimi Inari Shrine', description: 'Thousands of bright orange torii gates line a winding trail up a sacred mountain in Kyoto.', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' },
    { id: 'jp_loc3', name: 'Tsukiji Outer Market', description: 'A bustling Tokyo market where you can try the freshest sushi and street food in the world.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800' },
    { id: 'jp_loc4', name: 'Arashiyama Bamboo Grove', description: 'Walk through towering bamboo stalks that sway and whisper in the wind near Kyoto.', category: 'nature', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800' },
    { id: 'jp_loc5', name: 'Senso-ji Temple', description: 'Tokyo\'s oldest Buddhist temple, with a giant red lantern at the Thunder Gate entrance.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800' },
  ],
  fr: [
    { id: 'fr_loc1', name: 'Eiffel Tower', description: 'The iconic iron lattice tower with 1,665 steps and a sparkling light show every night.', category: 'landmark', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800' },
    { id: 'fr_loc2', name: 'Louvre Museum', description: 'The world\'s largest art museum, home to the Mona Lisa and 38,000 other artworks.', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800' },
    { id: 'fr_loc3', name: 'Mont Saint-Michel', description: 'A fairy-tale abbey perched on a rocky island that becomes surrounded by the sea at high tide.', category: 'landmark', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800' },
    { id: 'fr_loc4', name: 'Palace of Versailles', description: 'A breathtaking royal palace with 2,300 rooms and the stunning Hall of Mirrors.', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800' },
    { id: 'fr_loc5', name: 'Nice Beach', description: 'The sparkling Côte d\'Azur beach with blue Mediterranean waters and colorful pebbles.', category: 'nature', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1523482580671-f216145a2953?w=800' },
  ],
  mx: [
    { id: 'mx_loc1', name: 'Chichén Itzá', description: 'An ancient Mayan pyramid where shadows create a serpent shape during the equinox.', category: 'landmark', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800' },
    { id: 'mx_loc2', name: 'Oaxaca Markets', description: 'Colorful markets overflowing with mole, chapulines, mezcal, and handmade crafts.', category: 'food', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c6a14769?w=800' },
    { id: 'mx_loc3', name: 'Cenote Ik Kil', description: 'A natural sinkhole swimming pool surrounded by hanging vines and lush jungle.', category: 'nature', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1589561253898-768830c460aa?w=800' },
    { id: 'mx_loc4', name: 'Frida Kahlo Museum', description: 'The bright blue house where famous artist Frida Kahlo lived and created her masterpieces.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
    { id: 'mx_loc5', name: 'Monarch Butterfly Sanctuary', description: 'A hidden forest where millions of orange monarch butterflies rest during winter migration.', category: 'hidden_gem', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1535332371349-a5d229f49c5c?w=800' },
  ],
  it: [
    { id: 'it_loc1', name: 'Colosseum', description: 'The massive ancient Roman arena where gladiators once fought before 50,000 spectators.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=800' },
    { id: 'it_loc2', name: 'Venice Canals', description: 'A magical floating city where gondolas glide through winding waterways instead of streets.', category: 'landmark', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800' },
    { id: 'it_loc3', name: 'Pompeii', description: 'An ancient Roman city frozen in time after being buried by a volcanic eruption in 79 AD.', category: 'culture', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800' },
    { id: 'it_loc4', name: 'Amalfi Coast', description: 'Colorful cliffside villages overlooking sparkling turquoise waters along Italy\'s southern coast.', category: 'nature', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800' },
    { id: 'it_loc5', name: 'Trevi Fountain', description: 'A stunning Baroque fountain — toss a coin to make a wish and ensure your return to Rome!', category: 'hidden_gem', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=800' },
  ],
  gb: [
    { id: 'gb_loc1', name: 'Big Ben & Parliament', description: 'London\'s iconic clock tower chimes on the hour beside the Houses of Parliament.', category: 'landmark', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
    { id: 'gb_loc2', name: 'Stonehenge', description: 'A mysterious prehistoric circle of giant stones that has puzzled people for 5,000 years.', category: 'culture', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800' },
    { id: 'gb_loc3', name: 'Lake District', description: 'Rolling green hills and sparkling lakes that inspired poet William Wordsworth.', category: 'nature', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { id: 'gb_loc4', name: 'Borough Market', description: 'London\'s oldest and most famous food market with treats from around the world.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800' },
    { id: 'gb_loc5', name: 'Shambles, York', description: 'A medieval cobbled street that inspired Diagon Alley in Harry Potter!', category: 'hidden_gem', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800' },
  ],
  br: [
    { id: 'br_loc1', name: 'Christ the Redeemer', description: 'The giant statue of Jesus with open arms standing atop Corcovado Mountain in Rio.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600' },
    { id: 'br_loc2', name: 'Copacabana Beach', description: 'A world-famous crescent beach in Rio where locals play soccer and samba on the sand.', category: 'nature', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600' },
    { id: 'br_loc3', name: 'Amazon Rainforest', description: 'The world\'s largest tropical rainforest, home to 10% of all species on Earth.', category: 'nature', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=600' },
    { id: 'br_loc4', name: 'Iguazu Falls', description: 'A breathtaking chain of 275 waterfalls straddling the border with Argentina.', category: 'nature', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1551649001-7a2482d98d05?w=600' },
    { id: 'br_loc5', name: 'São Paulo Food Scene', description: 'The largest city in South America, famous for its incredible mix of cuisines.', category: 'food', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600' },
  ],
  kr: [
    { id: 'kr_loc1', name: 'Gyeongbokgung Palace', description: 'A grand royal palace in Seoul where you can wear a hanbok and feel like royalty!', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600' },
    { id: 'kr_loc2', name: 'Bukchon Hanok Village', description: 'Traditional Korean houses with curved rooftops lining narrow hilltop alleys in Seoul.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1583167616706-59fca7c3ae12?w=600' },
    { id: 'kr_loc3', name: 'Jeju Island', description: 'A volcanic island with lava tubes, waterfalls, and friendly stone grandfather statues.', category: 'nature', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664f59e1a4?w=600' },
    { id: 'kr_loc4', name: 'Gwangjang Market', description: 'Seoul\'s oldest market where you can try bindaetteok pancakes and fresh kimbap rolls.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=600' },
    { id: 'kr_loc5', name: 'DMZ Peace Trail', description: 'A unique hike along the border between North and South Korea through pristine nature.', category: 'hidden_gem', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600' },
  ],
  th: [
    { id: 'th_loc1', name: 'Grand Palace', description: 'A dazzling complex of golden spires, temples, and the sacred Emerald Buddha in Bangkok.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600' },
    { id: 'th_loc2', name: 'Phi Phi Islands', description: 'Crystal-clear turquoise waters, limestone cliffs, and colorful coral reefs.', category: 'nature', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600' },
    { id: 'th_loc3', name: 'Chiang Mai Night Bazaar', description: 'A sprawling evening market full of Thai street food, crafts, and live music.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600' },
    { id: 'th_loc4', name: 'Wat Arun', description: 'The "Temple of Dawn" covered in sparkling porcelain and seashells along the river.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600' },
    { id: 'th_loc5', name: 'Erawan Waterfall', description: 'A seven-tiered waterfall in emerald-green pools where fish nibble your toes!', category: 'hidden_gem', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600' },
  ],
  ma: [
    { id: 'ma_loc1', name: 'Jemaa el-Fnaa', description: 'Marrakech\'s main square that transforms into a carnival of storytellers and food stalls at night.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=600' },
    { id: 'ma_loc2', name: 'Sahara Desert Camp', description: 'Sleep under a million stars in a Berber tent after riding camels over golden dunes.', category: 'nature', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
    { id: 'ma_loc3', name: 'Chefchaouen', description: 'An entire mountain town painted in every shade of blue — a photographer\'s dream!', category: 'hidden_gem', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600' },
    { id: 'ma_loc4', name: 'Fez Medina', description: 'The world\'s largest car-free urban area with 9,000 winding alleyways and ancient tanneries.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
    { id: 'ma_loc5', name: 'Moroccan Cooking Class', description: 'Learn to make tagine and couscous with fresh spices from the souk.', category: 'food', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600' },
  ],
  pe: [
    { id: 'pe_loc1', name: 'Machu Picchu', description: 'The lost Inca city in the clouds, one of the New Seven Wonders of the World.', category: 'landmark', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' },
    { id: 'pe_loc2', name: 'Rainbow Mountain', description: 'A stunning mountain striped with bands of red, gold, lavender, and turquoise minerals.', category: 'nature', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600' },
    { id: 'pe_loc3', name: 'Lake Titicaca', description: 'The highest navigable lake in the world, with floating islands made entirely of reeds.', category: 'nature', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600' },
    { id: 'pe_loc4', name: 'Lima Ceviche Trail', description: 'Taste Peru\'s famous raw fish dish at the best cevicherías in the capital.', category: 'food', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600' },
    { id: 'pe_loc5', name: 'Moray Terraces', description: 'Mysterious circular Inca farming terraces that look like an ancient amphitheater.', category: 'hidden_gem', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1531968455002-901e9197d212?w=600' },
  ],
  ke: [
    { id: 'ke_loc1', name: 'Maasai Mara', description: 'Witness the Great Migration as millions of wildebeest thunder across the golden savanna.', category: 'nature', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
    { id: 'ke_loc2', name: 'Mount Kenya', description: 'Africa\'s second-highest peak with glaciers, alpine lakes, and unique high-altitude plants.', category: 'nature', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600' },
    { id: 'ke_loc3', name: 'Nairobi National Park', description: 'The only national park inside a capital city — see giraffes with skyscrapers behind them!', category: 'hidden_gem', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
    { id: 'ke_loc4', name: 'Lamu Old Town', description: 'A UNESCO World Heritage Swahili town with donkey taxis and hand-carved wooden doors.', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600' },
    { id: 'ke_loc5', name: 'Carnivore Restaurant', description: 'A famous Nairobi restaurant where you can try unique grilled meats from a Maasai sword.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600' },
  ],
  no: [
    { id: 'no_loc1', name: 'Geirangerfjord', description: 'A UNESCO fjord with cascading waterfalls, emerald water, and towering cliffs.', category: 'nature', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=600' },
    { id: 'no_loc2', name: 'Northern Lights, Tromsø', description: 'Watch the sky dance with green, purple, and pink curtains of light above the Arctic.', category: 'nature', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600' },
    { id: 'no_loc3', name: 'Viking Ship Museum', description: 'See real 1,000-year-old Viking longships excavated from burial mounds in Oslo.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
    { id: 'no_loc4', name: 'Trolltunga', description: 'A dramatic rock formation that juts out like a tongue 700 meters above a lake.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600' },
    { id: 'no_loc5', name: 'Bergen Fish Market', description: 'Try the freshest salmon, king crab, and fish cakes at this harbour-side market.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
  ],
  tr: [
    { id: 'tr_loc1', name: 'Hagia Sophia', description: 'A 1,500-year-old architectural marvel that has been a church, a mosque, and a museum.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600' },
    { id: 'tr_loc2', name: 'Cappadocia Balloons', description: 'Float in a hot air balloon over fairy chimneys and ancient cave homes at sunrise.', category: 'nature', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600' },
    { id: 'tr_loc3', name: 'Grand Bazaar', description: 'One of the world\'s oldest and largest covered markets with over 4,000 glittering shops.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600' },
    { id: 'tr_loc4', name: 'Pamukkale', description: 'Terraces of white mineral-rich hot springs that look like frozen waterfalls made of cotton.', category: 'hidden_gem', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600' },
    { id: 'tr_loc5', name: 'Istanbul Street Food Tour', description: 'Try simit bread rings, balik ekmek fish sandwiches, and warm Turkish tea.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=600' },
  ],
  gr: [
    { id: 'gr_loc1', name: 'Acropolis of Athens', description: 'The ancient hilltop citadel with the Parthenon temple, symbol of democracy and civilization.', category: 'landmark', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600' },
    { id: 'gr_loc2', name: 'Santorini Sunset', description: 'Watch the sun dip into the Aegean Sea from the white-and-blue cliffs of Oia village.', category: 'nature', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600' },
    { id: 'gr_loc3', name: 'Olympia', description: 'The birthplace of the Olympic Games — run on the same track athletes used in 776 BC!', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600' },
    { id: 'gr_loc4', name: 'Meteora Monasteries', description: 'Ancient monasteries built on top of towering natural rock pillars reaching into the sky.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?w=600' },
    { id: 'gr_loc5', name: 'Athens Central Market', description: 'A lively market overflowing with olives, feta cheese, fresh fish, and Greek pastries.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600' },
  ],
  eg: [
    { id: 'eg_loc1', name: 'Pyramids of Giza', description: 'The last surviving Ancient Wonder — three massive pyramids built over 4,500 years ago for pharaohs.', category: 'landmark', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600' },
    { id: 'eg_loc2', name: 'Khan el-Khalili Bazaar', description: 'A maze of narrow alleys in Cairo selling spices, lanterns, jewelry, and souvenirs since 1382.', category: 'culture', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600' },
    { id: 'eg_loc3', name: 'Nile Felucca Ride', description: 'Sail on a traditional wooden boat with a white sail — the same way Egyptians have traveled for thousands of years.', category: 'nature', learningPoints: 10, imageUrl: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600' },
    { id: 'eg_loc4', name: 'Egyptian Museum', description: 'Home to King Tut\'s golden mask and over 120,000 ancient artifacts. Mummies, sarcophagi, and treasures!', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64b0f5c7a28?w=600' },
    { id: 'eg_loc5', name: 'Abu Simbel', description: 'Twin temples carved into a mountainside — the whole complex was moved to save it from a rising lake!', category: 'hidden_gem', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600' },
  ],
  za: [
    { id: 'za_loc1', name: 'Kruger National Park', description: 'One of Africa\'s largest game reserves — spot the Big Five: lions, leopards, rhinos, elephants, and buffalo.', category: 'nature', learningPoints: 15, imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600' },
    { id: 'za_loc2', name: 'Table Mountain', description: 'The flat-topped mountain overlooking Cape Town. Take the cable car up for stunning views of the city and ocean.', category: 'landmark', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600' },
    { id: 'za_loc3', name: 'Robben Island', description: 'Where Nelson Mandela was imprisoned for 18 years. Now a museum and UNESCO site — a powerful lesson in history.', category: 'culture', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600' },
    { id: 'za_loc4', name: 'Boulders Beach', description: 'Swim with African penguins! A colony of 3,000 penguins lives on this sheltered beach near Cape Town.', category: 'hidden_gem', learningPoints: 12, imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600' },
    { id: 'za_loc5', name: 'Neighbourgoods Market', description: 'A rooftop market in Johannesburg with food from around Africa — bunny chow, biltong, and craft stalls.', category: 'food', learningPoints: 8, imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=600' },
  ],
};

const locationOverrides = new Map<string, CountryLocation[]>();

export function setCountryLocationsOverride(countryId: string, locations: CountryLocation[]) {
  locationOverrides.set(countryId, locations);
}

export function getCountryLocations(countryId: string): CountryLocation[] {
  return locationOverrides.get(countryId) ?? COUNTRY_LOCATIONS[countryId] ?? [];
}

// ─── FOOD DISCOVERY INTEGRATION ───

import { getDishById, type WorldDish } from './worldFoods';

export function getDiscoveryFlashcards(discoveredDishIds: string[]): FlashcardItem[] {
  const cards: FlashcardItem[] = [];
  for (const id of discoveredDishIds) {
    const dish = getDishById(id);
    if (!dish) continue;
    cards.push({
      id: `fd_${dish.id}`,
      front: `${dish.emoji} ${dish.name} (${dish.countryName})`,
      back: `${dish.originStory}\n\nFun fact: ${dish.funFact}`,
      icon: dish.emoji,
      deck: 'food_discovery',
    });
  }
  return cards;
}

export function getDiscoveryQuizQuestions(discoveredDishIds: string[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (const id of discoveredDishIds) {
    const dish = getDishById(id);
    if (!dish) continue;
    dish.quizQuestions.forEach((dq, qi) => {
      questions.push({
        id: `fdq_${dish.id}_${qi}`,
        question: dq.question,
        options: dq.options,
        correct: dq.correctIndex,
        category: 'food',
        imageUrl: dish.imageUrl,
        difficulty: 'easy',
      });
    });
  }
  return questions;
}

export function getQuizQuestionsWithDiscoveries(discoveredIds: string[]): QuizQuestion[] {
  return [...ALL_QUIZ_QUESTIONS, ...getDiscoveryQuizQuestions(discoveredIds)];
}

export function getFlashcardDeckWithDiscoveries(deckId: string, discoveredIds: string[]): FlashcardItem[] {
  if (deckId === 'food_discovery') {
    return shuffleArray(getDiscoveryFlashcards(discoveredIds));
  }
  return getFlashcardDeck(deckId);
}

export function getAllFlashcardsMixedWithDiscoveries(discoveredIds: string[], count: number = 15): FlashcardItem[] {
  const all = [...ALL_FLASHCARDS, ...getDiscoveryFlashcards(discoveredIds)];
  return shuffleArray(all).slice(0, count);
}
