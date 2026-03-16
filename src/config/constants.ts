// Visby App Constants
import { IconName } from '../components/ui/Icon';
import type { Country } from '../types';

// ===================================
// AURA & PROGRESSION
// ===================================

export const AURA_REWARDS = {
  // Stamps
  STAMP_CITY: 50,
  STAMP_COUNTRY: 100,
  STAMP_LANDMARK: 75,
  STAMP_PARK: 40,
  STAMP_BEACH: 60,
  STAMP_MOUNTAIN: 80,
  STAMP_MUSEUM: 55,
  STAMP_RESTAURANT: 30,
  STAMP_CAFE: 25,
  STAMP_MARKET: 35,
  STAMP_HIDDEN_GEM: 150,
  
  // Bites
  BITE_UPLOAD: 25,
  BITE_WITH_RECIPE: 40,
  BITE_FIRST_IN_CUISINE: 75,
  
  // Learning
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 100,
  QUIZ_PASS: 30,
  FLASHCARD_SESSION: 15,
  
  // Social
  DAILY_CHECK_IN: 10,
  STREAK_BONUS_MULTIPLIER: 5, // per day of streak
  FIRST_POST: 25,
  
  // Badges
  BADGE_COMMON: 50,
  BADGE_UNCOMMON: 100,
  BADGE_RARE: 200,
  BADGE_EPIC: 500,
  BADGE_LEGENDARY: 1000,
};

// Fast Travel Costs
export const FAST_TRAVEL_COSTS = {
  BASE_COST: 100,
  DISTANCE_MULTIPLIER: 0.01, // per km
  DISCOUNT_PER_LEVEL: 2, // percentage
  MAX_DISCOUNT: 50, // percentage
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, aura: 0, title: 'Novice Explorer' },
  { level: 2, aura: 100, title: 'Curious Wanderer' },
  { level: 3, aura: 250, title: 'Path Finder' },
  { level: 4, aura: 500, title: 'Trail Blazer' },
  { level: 5, aura: 800, title: 'Globe Trotter' },
  { level: 6, aura: 1200, title: 'World Walker' },
  { level: 7, aura: 1800, title: 'Culture Seeker' },
  { level: 8, aura: 2500, title: 'Memory Keeper' },
  { level: 9, aura: 3500, title: 'Horizon Chaser' },
  { level: 10, aura: 5000, title: 'Legendary Voyager' },
  { level: 11, aura: 7000, title: 'Master Explorer' },
  { level: 12, aura: 10000, title: 'Grand Adventurer' },
  { level: 13, aura: 15000, title: 'Eternal Wanderer' },
  { level: 14, aura: 22000, title: 'Mythic Traveler' },
  { level: 15, aura: 30000, title: 'Visby Legend' },
];

// ===================================
// LOCATION
// ===================================

export const LOCATION_CONFIG = {
  STAMP_RADIUS_METERS: 100, // How close you need to be to collect a stamp
  UPDATE_INTERVAL_MS: 10000, // How often to update location
  HIGH_ACCURACY: true,
};

// ===================================
// COLLECTIONS
// ===================================

export interface StampTypeInfo {
  label: string;
  icon: IconName;
  color: string;
}

export const STAMP_TYPES_INFO: Record<string, StampTypeInfo> = {
  city: { label: 'City', icon: 'city', color: '#9B89D0' },
  country: { label: 'Country', icon: 'country', color: '#6B9B6B' },
  landmark: { label: 'Landmark', icon: 'landmark', color: '#FFD700' },
  park: { label: 'Park', icon: 'park', color: '#4CAF50' },
  beach: { label: 'Beach', icon: 'beach', color: '#64B5F6' },
  mountain: { label: 'Mountain', icon: 'mountain', color: '#8D6E63' },
  museum: { label: 'Museum', icon: 'museum', color: '#9C27B0' },
  restaurant: { label: 'Restaurant', icon: 'restaurant', color: '#FF5722' },
  cafe: { label: 'Café', icon: 'cafe', color: '#795548' },
  market: { label: 'Market', icon: 'market', color: '#FF9800' },
  temple: { label: 'Temple', icon: 'temple', color: '#E91E63' },
  castle: { label: 'Castle', icon: 'castle', color: '#607D8B' },
  monument: { label: 'Monument', icon: 'monument', color: '#3F51B5' },
  nature: { label: 'Nature', icon: 'nature', color: '#8BC34A' },
  hidden_gem: { label: 'Hidden Gem', icon: 'hiddenGem', color: '#00BCD4' },
};

export interface BiteCategoryInfo {
  label: string;
  icon: IconName;
}

export const BITE_CATEGORIES_INFO: Record<string, BiteCategoryInfo> = {
  main_dish: { label: 'Main Dish', icon: 'mainDish' },
  appetizer: { label: 'Appetizer', icon: 'appetizer' },
  dessert: { label: 'Dessert', icon: 'dessert' },
  snack: { label: 'Snack', icon: 'snack' },
  drink: { label: 'Drink', icon: 'drink' },
  street_food: { label: 'Street Food', icon: 'streetFood' },
  breakfast: { label: 'Breakfast', icon: 'breakfast' },
  soup: { label: 'Soup', icon: 'soup' },
  salad: { label: 'Salad', icon: 'salad' },
  bread: { label: 'Bread', icon: 'bread' },
};

// ===================================
// COUNTRIES – Visit, buy a house, walk through & learn (Club Penguin style)
// ===================================

export const COUNTRIES: Country[] = [
  {
    id: 'jp',
    name: 'Japan',
    countryCode: 'JP',
    flagEmoji: '',
    visitCostAura: 80,
    housePriceAura: 500,
    description: 'Land of cherry blossoms, sushi, and friendly bowing!',
    roomTheme: 'traditional',
    accentColor: '#E8B4B8',
    facts: [
      { id: 'jp1', countryId: 'jp', title: 'Bowing hello', content: 'In Japan people bow to say hello instead of shaking hands. The deeper the bow, the more respect!', icon: 'culture', category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
      { id: 'jp2', countryId: 'jp', title: 'Yummy sushi', content: 'Sushi started in Japan over 1,000 years ago. The word "sushi" means "sour rice."', icon: 'food', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1579584421515-5bd6b6e31993?w=600' },
      { id: 'jp3', countryId: 'jp', title: 'Say konnichiwa', content: '"Konnichiwa" means "hello" in Japanese. Try saying it: cone-nee-chee-wah!', icon: 'language', category: 'language', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600' },
      { id: 'jp4', countryId: 'jp', title: 'Cherry blossoms', content: 'In spring, pink cherry blossoms bloom everywhere. Families have picnics under the trees!', icon: 'nature', category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600' },
      { id: 'jp5', countryId: 'jp', title: 'Take off your shoes', content: 'In Japanese homes and some restaurants you take off your shoes at the door. Slippers wait for you!', icon: 'culture', category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
    ],
  },
  {
    id: 'fr',
    name: 'France',
    countryCode: 'FR',
    flagEmoji: '',
    visitCostAura: 75,
    housePriceAura: 450,
    description: 'Home of the Eiffel Tower, croissants, and saying "Ooh la la!"',
    roomTheme: 'city',
    accentColor: '#A8D4E6',
    facts: [
      { id: 'fr1', countryId: 'fr', title: 'Bonjour!', content: '"Bonjour" means "hello" in French. Say it with a smile: bon-ZHOOR!', icon: 'language', category: 'language', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
      { id: 'fr2', countryId: 'fr', title: 'Croissants for breakfast', content: 'French people love fresh croissants in the morning. They are flaky and buttery!', icon: 'food', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600' },
      { id: 'fr3', countryId: 'fr', title: 'The Eiffel Tower', content: 'The Eiffel Tower in Paris is one of the most famous landmarks in the world. It has 1,665 steps!', icon: 'landmark', category: 'fun', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6deeacac5c13?w=600' },
      { id: 'fr4', countryId: 'fr', title: 'Cheese please', content: 'France has over 1,000 types of cheese. Saying "fromage" (fro-MAHJ) means "cheese"!', icon: 'food', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600' },
      { id: 'fr5', countryId: 'fr', title: 'Kiss on the cheek', content: 'Friends in France often greet each other with a light kiss on each cheek. It\'s called "la bise"!', icon: 'culture', category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e7b2a2e?w=600' },
    ],
  },
  {
    id: 'mx',
    name: 'Mexico',
    countryCode: 'MX',
    flagEmoji: '',
    visitCostAura: 60,
    housePriceAura: 350,
    description: 'Colorful markets, tacos, and the home of chocolate!',
    roomTheme: 'coastal',
    accentColor: '#86EFAC',
    facts: [
      { id: 'mx1', countryId: 'mx', title: 'Hola!', content: '"Hola" means "hello" in Spanish. Mexico has the most Spanish speakers in the world!', icon: 'language', category: 'language', imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600' },
      { id: 'mx2', countryId: 'mx', title: 'Chocolate started here', content: 'Chocolate was first made in Mexico thousands of years ago. The Aztecs loved it!', icon: 'history', category: 'history', imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600' },
      { id: 'mx3', countryId: 'mx', title: 'Tacos any time', content: 'Tacos are a favorite food. You can put meat, beans, salsa, and lime in a soft or crunchy shell!', icon: 'food', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c6a14769?w=600' },
      { id: 'mx4', countryId: 'mx', title: 'Day of the Dead', content: 'Dia de los Muertos is a happy celebration to remember loved ones. There are flowers, music, and treats!', icon: 'culture', category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600' },
      { id: 'mx5', countryId: 'mx', title: 'Beautiful butterflies', content: 'Millions of monarch butterflies fly to Mexico every winter. They rest in the trees like orange clouds!', icon: 'nature', category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1535332371349-a5d229f49c5c?w=600' },
    ],
  },
  {
    id: 'it',
    name: 'Italy',
    countryCode: 'IT',
    flagEmoji: '',
    visitCostAura: 85,
    housePriceAura: 520,
    description: 'Pizza, pasta, gelato, and ancient ruins!',
    roomTheme: 'traditional',
    accentColor: '#FDE047',
    facts: [
      { id: 'it1', countryId: 'it', title: 'Ciao!', content: '"Ciao" means both "hello" and "goodbye" in Italian. Say it: CHOW!', icon: 'language', category: 'language', imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600' },
      { id: 'it2', countryId: 'it', title: 'Pizza was born here', content: 'Pizza started in Naples, Italy. The first pizza was made over 200 years ago!', icon: 'food', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600' },
      { id: 'it3', countryId: 'it', title: 'Leaning Tower', content: 'The Leaning Tower of Pisa really leans! It started leaning while it was being built 800 years ago.', icon: 'landmark', category: 'fun', imageUrl: 'https://images.unsplash.com/photo-1585735296932-2a2d10baef48?w=600' },
      { id: 'it4', countryId: 'it', title: 'Gelato', content: 'Italian gelato is like ice cream but creamier and often made fresh every day. Yum!', icon: 'food', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600' },
      { id: 'it5', countryId: 'it', title: 'Romans and gladiators', content: 'Ancient Rome was in Italy. Gladiators fought in big arenas. Today we can visit the old ruins!', icon: 'history', category: 'history', imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=600' },
    ],
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    countryCode: 'GB',
    flagEmoji: '',
    visitCostAura: 70,
    housePriceAura: 400,
    description: 'Tea time, castles, and the home of Harry Potter!',
    roomTheme: 'modern',
    accentColor: '#C4B5FD',
    facts: [
      { id: 'gb1', countryId: 'gb', title: 'Tea time', content: 'In the UK many people have "tea" in the afternoon with sandwiches, scones, and of course tea!', icon: 'culture', category: 'culture', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600' },
      { id: 'gb2', countryId: 'gb', title: 'Cheerio!', content: '"Cheerio" is a friendly way to say goodbye in Britain. "Hello" is hello there too!', icon: 'language', category: 'language', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
      { id: 'gb3', countryId: 'gb', title: 'Castles everywhere', content: 'The UK has lots of old castles. Kings and queens used to live in them!', icon: 'history', category: 'history', imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600' },
      { id: 'gb4', countryId: 'gb', title: 'Fish and chips', content: 'A classic British meal is fish and chips -- fried fish with thick fries. Often wrapped in paper!', icon: 'food', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=600' },
      { id: 'gb5', countryId: 'gb', title: 'Double-decker buses', content: 'London is famous for red double-decker buses. You can sit on the top and see the whole street!', icon: 'sparkles', category: 'fun', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600' },
    ],
  },
  {
    id: 'br',
    name: 'Brazil',
    countryCode: 'BR',
    flagEmoji: '',
    visitCostAura: 65,
    housePriceAura: 380,
    description: 'Rainforests, carnival, and the Amazon!',
    roomTheme: 'nature',
    accentColor: '#FECDD3',
    facts: [
      { id: 'br1', countryId: 'br', title: 'Ola!', content: '"Ola" means "hello" in Portuguese. Brazil is the biggest country in South America!', icon: 'language', category: 'language' },
      { id: 'br2', countryId: 'br', title: 'The Amazon', content: 'The Amazon rainforest is in Brazil. It has more types of plants and animals than almost anywhere on Earth!', icon: 'nature', category: 'nature' },
      { id: 'br3', countryId: 'br', title: 'Carnival', content: 'Carnival is a huge party with music, dancing, and colorful costumes. It happens every year!', icon: 'culture', category: 'culture' },
      { id: 'br4', countryId: 'br', title: 'Yummy fruits', content: 'Brazil has amazing fruits like acai, passion fruit, and guava. Try acai bowls -- they\'re like a smoothie!', icon: 'food', category: 'food' },
      { id: 'br5', countryId: 'br', title: 'Soccer passion', content: 'Brazilians love soccer (they call it "futebol"). Brazil has won the World Cup more than any other country!', icon: 'sparkles', category: 'fun' },
    ],
  },
  {
    id: 'kr',
    name: 'South Korea',
    countryCode: 'KR',
    flagEmoji: '',
    visitCostAura: 500,
    housePriceAura: 2000,
    description: 'K-pop beats, kimchi flavors, and high-tech wonders!',
    roomTheme: 'modern',
    accentColor: '#A8C8FF',
    facts: [
      { id: 'kr1', countryId: 'kr', title: 'K-pop fever', content: 'K-pop groups like BTS and BLACKPINK have millions of fans worldwide. Music videos are famous for their amazing choreography and colorful sets!', icon: 'culture', category: 'culture' },
      { id: 'kr2', countryId: 'kr', title: 'Kimchi with everything', content: 'Koreans eat kimchi (fermented spicy cabbage) with almost every meal. There are over 200 types of kimchi!', icon: 'food', category: 'food' },
      { id: 'kr3', countryId: 'kr', title: 'Tech capital', content: 'South Korea is one of the most connected countries on Earth. It has super-fast internet and is home to Samsung and LG!', icon: 'sparkles', category: 'fun' },
      { id: 'kr4', countryId: 'kr', title: 'Hanbok tradition', content: 'The hanbok is a traditional Korean dress with a wrap-around top and wide skirt. People wear them during holidays like Chuseok and Seollal!', icon: 'culture', category: 'culture' },
      { id: 'kr5', countryId: 'kr', title: 'Say annyeong!', content: '"Annyeonghaseyo" means "hello" in Korean. Try saying it: ahn-nyeong-ha-se-yo!', icon: 'language', category: 'language' },
    ],
  },
  {
    id: 'th',
    name: 'Thailand',
    countryCode: 'TH',
    flagEmoji: '',
    visitCostAura: 400,
    housePriceAura: 1800,
    description: 'Golden temples, spicy food, and gentle elephants!',
    roomTheme: 'traditional',
    accentColor: '#FFD700',
    facts: [
      { id: 'th1', countryId: 'th', title: 'Temple treasures', content: 'Thailand has over 40,000 Buddhist temples! The most famous, Wat Phra Kaew, holds a tiny jade Buddha statue that is very sacred.', icon: 'temple', category: 'culture' },
      { id: 'th2', countryId: 'th', title: 'Pad Thai perfection', content: 'Pad Thai is a stir-fried noodle dish with peanuts, lime, and bean sprouts. Street food vendors make it fresh in giant woks!', icon: 'food', category: 'food' },
      { id: 'th3', countryId: 'th', title: 'Songkran splash', content: 'Songkran is the Thai New Year water festival. For three days, everyone has massive water fights in the streets!', icon: 'culture', category: 'culture' },
      { id: 'th4', countryId: 'th', title: 'Gentle giants', content: 'Elephants are the national animal of Thailand. They are deeply respected and there are sanctuaries where rescued elephants live happily.', icon: 'nature', category: 'nature' },
      { id: 'th5', countryId: 'th', title: 'Muay Thai', content: 'Muay Thai (Thai boxing) is called the "Art of Eight Limbs" because fighters use fists, elbows, knees, and shins. It has been practiced for centuries!', icon: 'star', category: 'culture' },
    ],
  },
  {
    id: 'ma',
    name: 'Morocco',
    countryCode: 'MA',
    flagEmoji: '',
    visitCostAura: 450,
    housePriceAura: 1900,
    description: 'Colorful markets, Saharan sands, and mint tea!',
    roomTheme: 'traditional',
    accentColor: '#E07848',
    facts: [
      { id: 'ma1', countryId: 'ma', title: 'Magical medinas', content: 'Moroccan medinas are old walled cities with winding streets full of shops selling spices, leather goods, and pottery. Marrakech has the most famous one!', icon: 'landmark', category: 'culture' },
      { id: 'ma2', countryId: 'ma', title: 'Beautiful tiles', content: 'Moroccan buildings are decorated with zellige — tiny hand-cut tiles arranged in stunning geometric patterns. Craftspeople train for years to master this art!', icon: 'culture', category: 'culture' },
      { id: 'ma3', countryId: 'ma', title: 'Sahara adventure', content: 'The Sahara Desert covers part of southern Morocco. You can ride camels over golden sand dunes and sleep under millions of stars!', icon: 'nature', category: 'nature' },
      { id: 'ma4', countryId: 'ma', title: 'Mint tea ritual', content: 'Moroccan mint tea is poured from high up to create a frothy top. It is served three times — the first glass is gentle, the second strong, and the third sweet.', icon: 'cafe', category: 'food' },
      { id: 'ma5', countryId: 'ma', title: 'Carpet weaving', content: 'Berber carpets are handwoven by women in the Atlas Mountains. Each pattern tells a story, and a single carpet can take months to complete!', icon: 'culture', category: 'culture' },
    ],
  },
  {
    id: 'pe',
    name: 'Peru',
    countryCode: 'PE',
    flagEmoji: '',
    visitCostAura: 500,
    housePriceAura: 2100,
    description: 'Ancient Inca ruins, llamas, and the mighty Andes!',
    roomTheme: 'nature',
    accentColor: '#D4A574',
    facts: [
      { id: 'pe1', countryId: 'pe', title: 'Machu Picchu', content: 'Machu Picchu is an ancient Inca city perched high in the Andes Mountains. It was hidden from the world for hundreds of years until 1911!', icon: 'landmark', category: 'history' },
      { id: 'pe2', countryId: 'pe', title: 'Inca ingenuity', content: 'The Inca Empire built roads, bridges, and cities without using wheels or iron tools. They kept records using knotted strings called quipus!', icon: 'history', category: 'history' },
      { id: 'pe3', countryId: 'pe', title: 'Ceviche delight', content: "Ceviche is Peru's national dish — fresh raw fish 'cooked' in lime juice with onions and chili peppers. It has been made for thousands of years!", icon: 'food', category: 'food' },
      { id: 'pe4', countryId: 'pe', title: 'Amazon and Andes', content: 'Peru has it all: the Andes Mountains, the Amazon Rainforest, and a desert coast. It is one of the most biodiverse countries on Earth!', icon: 'mountain', category: 'nature' },
      { id: 'pe5', countryId: 'pe', title: 'Colorful textiles', content: 'Peruvian weavers use techniques passed down for thousands of years. Alpaca wool is softer than sheep wool, and each pattern represents a village or family!', icon: 'culture', category: 'culture' },
    ],
  },
  {
    id: 'ke',
    name: 'Kenya',
    countryCode: 'KE',
    flagEmoji: '',
    visitCostAura: 450,
    housePriceAura: 1800,
    description: 'Safari adventures, Maasai warriors, and the Great Rift Valley!',
    roomTheme: 'nature',
    accentColor: '#C8846E',
    facts: [
      { id: 'ke1', countryId: 'ke', title: 'Safari wonderland', content: "Kenya's Maasai Mara reserve is home to the Great Migration, where over a million wildebeest cross the plains. Lions, elephants, and giraffes roam freely!", icon: 'nature', category: 'nature' },
      { id: 'ke2', countryId: 'ke', title: 'Maasai culture', content: 'The Maasai people are famous for their red clothing, beaded jewelry, and incredible jumping dances. They have lived alongside wildlife for centuries!', icon: 'culture', category: 'culture' },
      { id: 'ke3', countryId: 'ke', title: 'Great Rift Valley', content: "The Great Rift Valley runs through Kenya and is so big it can be seen from space! It was formed millions of years ago as the Earth's plates pulled apart.", icon: 'mountain', category: 'nature' },
      { id: 'ke4', countryId: 'ke', title: 'Kenyan coffee', content: "Kenya grows some of the world's best coffee beans on the slopes of Mount Kenya. Coffee is one of the country's most important crops!", icon: 'cafe', category: 'food' },
      { id: 'ke5', countryId: 'ke', title: 'Running champions', content: 'Kenyan runners are the fastest long-distance athletes in the world! Many champions come from the highlands, where training at high altitude builds incredible endurance.', icon: 'star', category: 'culture' },
    ],
  },
  {
    id: 'no',
    name: 'Norway',
    countryCode: 'NO',
    flagEmoji: '',
    visitCostAura: 500,
    housePriceAura: 2200,
    description: 'Majestic fjords, northern lights, and Viking legends!',
    roomTheme: 'modern',
    accentColor: '#87CEEB',
    facts: [
      { id: 'no1', countryId: 'no', title: 'Fabulous fjords', content: "Norway's fjords are long, narrow inlets carved by glaciers thousands of years ago. They have steep cliffs and crystal-clear water — some are over 1,000 meters deep!", icon: 'mountain', category: 'nature' },
      { id: 'no2', countryId: 'no', title: 'Viking voyagers', content: 'Vikings sailed from Norway over 1,000 years ago in longships. They explored Iceland, Greenland, and even reached North America before Columbus!', icon: 'history', category: 'history' },
      { id: 'no3', countryId: 'no', title: 'Northern lights', content: "The aurora borealis lights up Norway's sky with green, purple, and pink ribbons of light. It happens when particles from the sun hit Earth's atmosphere!", icon: 'sparkles', category: 'nature' },
      { id: 'no4', countryId: 'no', title: 'Troll tales', content: 'Norwegian folklore is full of trolls — big creatures that live in mountains and turn to stone in sunlight. You can see troll statues all over Norway!', icon: 'culture', category: 'culture' },
      { id: 'no5', countryId: 'no', title: 'Friluftsliv', content: '"Friluftsliv" means "open-air living" in Norwegian. Norwegians love hiking, skiing, and being outdoors all year — even in snowy winters!', icon: 'nature', category: 'culture' },
    ],
  },
  {
    id: 'tr',
    name: 'Turkey',
    countryCode: 'TR',
    flagEmoji: '',
    visitCostAura: 400,
    housePriceAura: 1700,
    description: 'Grand bazaars, hot air balloons, and ancient empires!',
    roomTheme: 'traditional',
    accentColor: '#E8A87C',
    facts: [
      { id: 'tr1', countryId: 'tr', title: 'Grand Bazaar', content: "Istanbul's Grand Bazaar is one of the oldest and largest covered markets in the world. It has over 4,000 shops selling everything from spices to lanterns!", icon: 'landmark', category: 'culture' },
      { id: 'tr2', countryId: 'tr', title: 'Cappadocia balloons', content: "Every morning, hundreds of hot air balloons float over Cappadocia's fairy chimneys — tall, thin rock formations shaped by wind and rain over millions of years!", icon: 'sparkles', category: 'nature' },
      { id: 'tr3', countryId: 'tr', title: 'Turkish delights', content: 'Turkish delight (lokum) is a chewy, sweet candy dusted with powdered sugar. It has been made since the 1700s and comes in flavors like rose, lemon, and pistachio!', icon: 'food', category: 'food' },
      { id: 'tr4', countryId: 'tr', title: 'Hammam tradition', content: "Turkish hammams (bathhouses) have been a tradition for over 600 years. People go to steam, scrub, and relax — it's like a spa for the whole community!", icon: 'culture', category: 'culture' },
      { id: 'tr5', countryId: 'tr', title: 'Two continents', content: 'Istanbul is the only major city in the world that sits on two continents — Europe and Asia! The Bosphorus strait divides the two sides.', icon: 'landmark', category: 'history' },
    ],
  },
  {
    id: 'gr',
    name: 'Greece',
    countryCode: 'GR',
    flagEmoji: '',
    visitCostAura: 450,
    housePriceAura: 1900,
    description: 'Ancient myths, sunny islands, and the birthplace of the Olympics!',
    roomTheme: 'coastal',
    accentColor: '#6EA8D7',
    facts: [
      { id: 'gr1', countryId: 'gr', title: 'Mythical gods', content: 'Ancient Greeks believed gods like Zeus, Athena, and Poseidon lived on Mount Olympus. Their stories of heroes and monsters are still told today!', icon: 'history', category: 'culture' },
      { id: 'gr2', countryId: 'gr', title: 'Island paradise', content: 'Greece has about 6,000 islands, but only 227 are inhabited! Santorini is famous for its white buildings with blue domes overlooking the sparkling sea.', icon: 'nature', category: 'nature' },
      { id: 'gr3', countryId: 'gr', title: 'Greek food', content: 'Greeks love fresh food — olive oil, feta cheese, fresh fish, and honey drizzled on thick yogurt. The Mediterranean diet is one of the healthiest in the world!', icon: 'food', category: 'food' },
      { id: 'gr4', countryId: 'gr', title: 'Olympic beginnings', content: 'The ancient Olympics started in Greece in 776 BC! Athletes competed in running, wrestling, and chariot racing. Winners received olive wreaths, not gold medals.', icon: 'star', category: 'history' },
      { id: 'gr5', countryId: 'gr', title: 'Love of wisdom', content: 'The word "philosophy" comes from Greek and means "love of wisdom." Great thinkers like Socrates, Plato, and Aristotle changed how the world thinks!', icon: 'book', category: 'culture' },
    ],
  },
  // --- 48 more countries (60 total): festivals & places worldwide ---
  { id: 'ca', name: 'Canada', countryCode: 'CA', flagEmoji: '', visitCostAura: 70, housePriceAura: 420, description: 'Maple syrup, hockey, and northern lights!', roomTheme: 'nature', accentColor: '#E63946', facts: [
    { id: 'ca1', countryId: 'ca', title: 'Maple syrup', content: 'Canada makes most of the world\'s maple syrup. It comes from tapping maple trees in spring!', icon: 'food', category: 'food' },
    { id: 'ca2', countryId: 'ca', title: 'Bonjour and hello', content: 'Canada has two official languages: English and French. In Quebec people say "Bonjour"!', icon: 'language', category: 'language' },
    { id: 'ca3', countryId: 'ca', title: 'Niagara Falls', content: 'Niagara Falls is one of the most powerful waterfalls in the world. You can feel the mist from far away!', icon: 'nature', category: 'nature' },
    { id: 'ca4', countryId: 'ca', title: 'Hockey nation', content: 'Canadians love ice hockey. It\'s the national winter sport and was invented in Canada!', icon: 'culture', category: 'culture' },
    { id: 'ca5', countryId: 'ca', title: 'Polar bears', content: 'Churchill, Manitoba is called the polar bear capital. In fall, bears gather there before the ice forms!', icon: 'nature', category: 'nature' },
  ]},
  { id: 'lb', name: 'Lebanon', countryCode: 'LB', flagEmoji: '', visitCostAura: 65, housePriceAura: 380, description: 'Ancient ruins, cedar trees, and delicious mezze!', roomTheme: 'traditional', accentColor: '#C41E3A', facts: [
    { id: 'lb1', countryId: 'lb', title: 'Cedars of Lebanon', content: 'The cedar tree is on the flag. Ancient Egyptians used Lebanese cedar wood for ships!', icon: 'nature', category: 'nature' },
    { id: 'lb2', countryId: 'lb', title: 'Mezze feasts', content: 'Mezze is lots of small dishes to share — hummus, tabbouleh, falafel. Everyone eats together!', icon: 'food', category: 'food' },
    { id: 'lb3', countryId: 'lb', title: 'Byblos', content: 'Byblos is one of the oldest cities in the world. People have lived there for over 7,000 years!', icon: 'history', category: 'history' },
    { id: 'lb4', countryId: 'lb', title: 'Arabic and French', content: 'Many Lebanese speak Arabic and French. "Marhaba" means hello in Arabic!', icon: 'language', category: 'language' },
    { id: 'lb5', countryId: 'lb', title: 'Mountain and sea', content: 'You can ski in the morning and swim in the Mediterranean in the afternoon. Lebanon has both!', icon: 'nature', category: 'fun' },
  ]},
  { id: 'cu', name: 'Cuba', countryCode: 'CU', flagEmoji: '', visitCostAura: 60, housePriceAura: 360, description: 'Classic cars, salsa, and mojitos!', roomTheme: 'city', accentColor: '#002A8F', facts: [
    { id: 'cu1', countryId: 'cu', title: 'Vintage cars', content: 'Havana is full of colorful old American cars from the 1950s. They drive past every day!', icon: 'culture', category: 'culture' },
    { id: 'cu2', countryId: 'cu', title: 'Salsa dancing', content: 'Salsa music and dance started in Cuba. The rhythm makes everyone want to move!', icon: 'culture', category: 'culture' },
    { id: 'cu3', countryId: 'cu', title: 'Hola, Cuba!', content: '"Hola" means hello in Spanish. Cubans are famous for being friendly and welcoming!', icon: 'language', category: 'language' },
    { id: 'cu4', countryId: 'cu', title: 'Sugar and cigars', content: 'Cuba is known for sugar cane and hand-rolled cigars. The tobacco grows in rich soil!', icon: 'food', category: 'food' },
    { id: 'cu5', countryId: 'cu', title: 'Colonial Havana', content: 'Old Havana has beautiful plazas and forts from the 1500s. It\'s a UNESCO World Heritage site!', icon: 'landmark', category: 'history' },
  ]},
  { id: 'us', name: 'United States', countryCode: 'US', flagEmoji: '', visitCostAura: 75, housePriceAura: 480, description: 'From Mardi Gras to national parks — 50 states of adventure!', roomTheme: 'modern', accentColor: '#3C3B6E', facts: [
    { id: 'us1', countryId: 'us', title: 'Mardi Gras', content: 'New Orleans throws Mardi Gras with parades, beads, and king cake. It\'s a giant street party!', icon: 'culture', category: 'culture' },
    { id: 'us2', countryId: 'us', title: 'National parks', content: 'The USA has over 60 national parks — from Grand Canyon to Yellowstone with geysers and bison!', icon: 'nature', category: 'nature' },
    { id: 'us3', countryId: 'us', title: 'Hello!', content: 'Americans say "Hi" or "Hello." English is the main language, and many others are spoken too!', icon: 'language', category: 'language' },
    { id: 'us4', countryId: 'us', title: 'Thanksgiving', content: 'Families gather for a big meal with turkey, stuffing, and pie. It\'s a day to be thankful!', icon: 'food', category: 'culture' },
    { id: 'us5', countryId: 'us', title: 'Fourth of July', content: 'Americans celebrate Independence Day with barbecues, parades, and fireworks in the sky!', icon: 'sparkles', category: 'culture' },
  ]},
  { id: 'ae', name: 'United Arab Emirates', countryCode: 'AE', flagEmoji: '', visitCostAura: 90, housePriceAura: 600, description: 'Desert dunes, Burj Khalifa, and golden souks!', roomTheme: 'city', accentColor: '#00732F', facts: [
    { id: 'ae1', countryId: 'ae', title: 'Burj Khalifa', content: 'The Burj Khalifa in Dubai is the tallest building in the world. The view from the top is amazing!', icon: 'landmark', category: 'fun' },
    { id: 'ae2', countryId: 'ae', title: 'Desert safari', content: 'People ride over sand dunes in 4x4s and try sandboarding. At night there are feasts under the stars!', icon: 'nature', category: 'nature' },
    { id: 'ae3', countryId: 'ae', title: 'Marhaba', content: '"Marhaba" means hello in Arabic. The UAE is home to people from all over the world!', icon: 'language', category: 'language' },
    { id: 'ae4', countryId: 'ae', title: 'Dates and coffee', content: 'Dates and Arabic coffee are offered to guests as a sign of welcome. It\'s a tradition!', icon: 'food', category: 'food' },
    { id: 'ae5', countryId: 'ae', title: 'Dubai Shopping Festival', content: 'Every winter Dubai has fireworks, concerts, and celebrations. The city lights up!', icon: 'sparkles', category: 'culture' },
  ]},
  { id: 'do', name: 'Dominican Republic', countryCode: 'DO', flagEmoji: '', visitCostAura: 55, housePriceAura: 340, description: 'Merengue, beaches, and carnival!', roomTheme: 'coastal', accentColor: '#002D62', facts: [
    { id: 'do1', countryId: 'do', title: 'Merengue music', content: 'Merengue is the national dance. Fast and fun — everyone dances at parties and festivals!', icon: 'culture', category: 'culture' },
    { id: 'do2', countryId: 'do', title: 'Carnival', content: 'Dominican Carnival has colorful masks and costumes. It mixes Spanish, African, and Taino traditions!', icon: 'culture', category: 'culture' },
    { id: 'do3', countryId: 'do', title: 'Hola!', content: 'People speak Spanish. "Hola" and "Buenos días" are how you say hello!', icon: 'language', category: 'language' },
    { id: 'do4', countryId: 'do', title: 'Mangú', content: 'Mangú is mashed plantains for breakfast, often with eggs and cheese. A classic start to the day!', icon: 'food', category: 'food' },
    { id: 'do5', countryId: 'do', title: 'Whales in Samaná', content: 'In winter, humpback whales come to Samaná Bay. You can watch them from boats!', icon: 'nature', category: 'nature' },
  ]},
  { id: 'jm', name: 'Jamaica', countryCode: 'JM', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Reggae, jerk chicken, and Junkanoo vibes!', roomTheme: 'coastal', accentColor: '#009B3A', facts: [
    { id: 'jm1', countryId: 'jm', title: 'Reggae', content: 'Reggae music was born in Jamaica. Bob Marley made it famous around the world!', icon: 'culture', category: 'culture' },
    { id: 'jm2', countryId: 'jm', title: 'Junkanoo', content: 'Parades with amazing costumes and drums happen at Christmas and Boxing Day. So colorful!', icon: 'culture', category: 'culture' },
    { id: 'jm3', countryId: 'jm', title: 'Jerk chicken', content: 'Jerk is a spicy way of cooking with special spices. Chicken and pork are cooked over wood fire!', icon: 'food', category: 'food' },
    { id: 'jm4', countryId: 'jm', title: 'Wah gwaan?', content: '"Wah gwaan?" means "What\'s going on?" in Jamaican Patois. It\'s a friendly greeting!', icon: 'language', category: 'language' },
    { id: 'jm5', countryId: 'jm', title: 'Blue Mountain coffee', content: 'Jamaican Blue Mountain coffee is some of the best in the world. It grows in the misty mountains!', icon: 'cafe', category: 'food' },
  ]},
  { id: 'bb', name: 'Barbados', countryCode: 'BB', flagEmoji: '', visitCostAura: 62, housePriceAura: 370, description: 'Crop Over festival, flying fish, and coral beaches!', roomTheme: 'coastal', accentColor: '#00267F', facts: [
    { id: 'bb1', countryId: 'bb', title: 'Crop Over', content: 'Crop Over is a harvest festival with music, dancing, and colorful costumes. It lasts for weeks!', icon: 'culture', category: 'culture' },
    { id: 'bb2', countryId: 'bb', title: 'Flying fish', content: 'Flying fish are the national symbol. They can glide over the water for short distances!', icon: 'nature', category: 'nature' },
    { id: 'bb3', countryId: 'bb', title: 'Bajan welcome', content: 'People say "Wuh gine on?" for "What\'s going on?" Barbadians are known for being warm and friendly!', icon: 'language', category: 'language' },
    { id: 'bb4', countryId: 'bb', title: 'Cou-cou and fish', content: 'The national dish is cou-cou (cornmeal and okra) with flying fish. Delicious!', icon: 'food', category: 'food' },
    { id: 'bb5', countryId: 'bb', title: 'Rum', content: 'Barbados is the birthplace of rum. Sugar cane has been grown there for hundreds of years!', icon: 'food', category: 'history' },
  ]},
  { id: 'nl', name: 'Netherlands', countryCode: 'NL', flagEmoji: '', visitCostAura: 72, housePriceAura: 430, description: 'Tulips, windmills, and King\'s Day!', roomTheme: 'city', accentColor: '#FF6600', facts: [
    { id: 'nl1', countryId: 'nl', title: 'King\'s Day', content: 'On King\'s Day everyone wears orange and has street parties and flea markets. The whole country celebrates!', icon: 'culture', category: 'culture' },
    { id: 'nl2', countryId: 'nl', title: 'Tulips', content: 'The Netherlands is famous for tulips. In spring the fields are a rainbow of colors!', icon: 'nature', category: 'nature' },
    { id: 'nl3', countryId: 'nl', title: 'Hallo!', content: '"Hallo" means hello in Dutch. Many Dutch people also speak English very well!', icon: 'language', category: 'language' },
    { id: 'nl4', countryId: 'nl', title: 'Bicycles', content: 'There are more bikes than people in the Netherlands. Everyone cycles to work and school!', icon: 'culture', category: 'culture' },
    { id: 'nl5', countryId: 'nl', title: 'Windmills', content: 'Windmills were used to pump water and grind grain. You can still see them in the countryside!', icon: 'landmark', category: 'history' },
  ]},
  { id: 'be', name: 'Belgium', countryCode: 'BE', flagEmoji: '', visitCostAura: 70, housePriceAura: 410, description: 'Chocolate, waffles, and medieval squares!', roomTheme: 'traditional', accentColor: '#FDDA0D', facts: [
    { id: 'be1', countryId: 'be', title: 'Belgian chocolate', content: 'Belgium is famous for chocolate. Master chocolatiers make pralines and truffles by hand!', icon: 'food', category: 'food' },
    { id: 'be2', countryId: 'be', title: 'Waffles', content: 'Belgian waffles are crispy outside and soft inside. Top them with fruit, chocolate, or whipped cream!', icon: 'food', category: 'food' },
    { id: 'be3', countryId: 'be', title: 'Three languages', content: 'Belgium has three official languages: Dutch, French, and German. "Hallo" or "Bonjour" depending where you are!', icon: 'language', category: 'language' },
    { id: 'be4', countryId: 'be', title: 'Carnival of Binche', content: 'In Binche, people wear giant feathered costumes and throw oranges. It\'s a UNESCO tradition!', icon: 'culture', category: 'culture' },
    { id: 'be5', countryId: 'be', title: 'Comics', content: 'Belgium is the home of Tintin and the Smurfs. Brussels has a whole comics museum!', icon: 'culture', category: 'fun' },
  ]},
  { id: 'hr', name: 'Croatia', countryCode: 'HR', flagEmoji: '', visitCostAura: 68, housePriceAura: 400, description: 'Adriatic coast, Game of Thrones walls, and festivals!', roomTheme: 'coastal', accentColor: '#FF0000', facts: [
    { id: 'hr1', countryId: 'hr', title: 'Dubrovnik', content: 'Dubrovnik\'s old town was used in Game of Thrones. Walk the walls and see the red roofs and sea!', icon: 'landmark', category: 'fun' },
    { id: 'hr2', countryId: 'hr', title: 'Bok!', content: '"Bok" means "hi" in Croatian. People are very welcoming to visitors!', icon: 'language', category: 'language' },
    { id: 'hr3', countryId: 'hr', title: 'Plitvice Lakes', content: 'Plitvice has turquoise lakes and waterfalls connected by wooden paths. Like a fairy tale!', icon: 'nature', category: 'nature' },
    { id: 'hr4', countryId: 'hr', title: 'Sea and olives', content: 'Croatian food uses lots of olive oil, fish, and fresh vegetables from the coast!', icon: 'food', category: 'food' },
    { id: 'hr5', countryId: 'hr', title: 'Summer festivals', content: 'In summer there are music and dance festivals by the sea. Everyone joins in!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'hu', name: 'Hungary', countryCode: 'HU', flagEmoji: '', visitCostAura: 65, housePriceAura: 380, description: 'Thermal baths, paprika, and Budapest!', roomTheme: 'traditional', accentColor: '#477050', facts: [
    { id: 'hu1', countryId: 'hu', title: 'Thermal baths', content: 'Budapest has natural hot springs. People have been bathing there for over 2,000 years!', icon: 'culture', category: 'culture' },
    { id: 'hu2', countryId: 'hu', title: 'Paprika', content: 'Hungarian paprika is famous. Goulash is a hearty stew made with lots of paprika!', icon: 'food', category: 'food' },
    { id: 'hu3', countryId: 'hu', title: 'Szia!', content: '"Szia" means "hi" in Hungarian. Hungarian is a unique language — not like its neighbors!', icon: 'language', category: 'language' },
    { id: 'hu4', countryId: 'hu', title: 'Budapest', content: 'The Danube River splits Budapest into Buda and Pest. The Parliament building glows at night!', icon: 'landmark', category: 'nature' },
    { id: 'hu5', countryId: 'hu', title: 'Folk dance', content: 'Hungarian folk dancing is fast and colorful. Dancers wear embroidered costumes!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'cn', name: 'China', countryCode: 'CN', flagEmoji: '', visitCostAura: 80, housePriceAura: 500, description: 'Lantern festivals, Great Wall, and dumplings!', roomTheme: 'traditional', accentColor: '#DE2910', facts: [
    { id: 'cn1', countryId: 'cn', title: 'Lantern Festival', content: 'At the end of Lunar New Year, thousands of lanterns light up the night. People solve riddles on them!', icon: 'star', category: 'culture' },
    { id: 'cn2', countryId: 'cn', title: 'Mid-Autumn Festival', content: 'Families share mooncakes and admire the full moon. Lanterns glow in the streets!', icon: 'star', category: 'culture' },
    { id: 'cn3', countryId: 'cn', title: 'Nihao!', content: '"Nihao" means "hello" in Mandarin. Try it: nee-how!', icon: 'language', category: 'language' },
    { id: 'cn4', countryId: 'cn', title: 'Great Wall', content: 'The Great Wall stretches over 13,000 miles. It was built to protect China long ago!', icon: 'landmark', category: 'history' },
    { id: 'cn5', countryId: 'cn', title: 'Dumplings', content: 'Dumplings (jiaozi) are eaten at New Year for good luck. Fillings can be pork, shrimp, or veggies!', icon: 'food', category: 'food' },
  ]},
  { id: 'tw', name: 'Taiwan', countryCode: 'TW', flagEmoji: '', visitCostAura: 72, housePriceAura: 440, description: 'Pingxi lanterns, night markets, and bubble tea!', roomTheme: 'city', accentColor: '#000095', facts: [
    { id: 'tw1', countryId: 'tw', title: 'Pingxi Lantern Festival', content: 'People release sky lanterns and make wishes. The sky fills with floating lights!', icon: 'star', category: 'culture' },
    { id: 'tw2', countryId: 'tw', title: 'Bubble tea', content: 'Bubble tea was invented in Taiwan! Chewy tapioca pearls in sweet tea — so good!', icon: 'food', category: 'food' },
    { id: 'tw3', countryId: 'tw', title: 'Night markets', content: 'Night markets have street food, games, and snacks. Stinky tofu is a famous (smelly!) treat!', icon: 'food', category: 'culture' },
    { id: 'tw4', countryId: 'tw', title: 'Ni hao!', content: 'People speak Mandarin. "Ni hao" means hello. Taiwanese are very friendly!', icon: 'language', category: 'language' },
    { id: 'tw5', countryId: 'tw', title: 'Taroko Gorge', content: 'Taroko has marble cliffs and turquoise rivers. One of the most beautiful places in Asia!', icon: 'nature', category: 'nature' },
  ]},
  { id: 'id', name: 'Indonesia', countryCode: 'ID', flagEmoji: '', visitCostAura: 60, housePriceAura: 360, description: 'Thousands of islands, temples, and rice terraces!', roomTheme: 'nature', accentColor: '#CE1126', facts: [
    { id: 'id1', countryId: 'id', title: 'Over 17,000 islands', content: 'Indonesia is the world\'s biggest island country. Java, Bali, and Sumatra are the most famous!', icon: 'nature', category: 'nature' },
    { id: 'id2', countryId: 'id', title: 'Borobudur', content: 'Borobudur is a huge ancient Buddhist temple with hundreds of statues. Sunrise there is magical!', icon: 'temple', category: 'history' },
    { id: 'id3', countryId: 'id', title: 'Halo!', content: '"Halo" means hello in Indonesian. The language is easy to learn!', icon: 'language', category: 'language' },
    { id: 'id4', countryId: 'id', title: 'Nasi goreng', content: 'Nasi goreng is fried rice with egg and spices. It\'s the national dish and eaten anytime!', icon: 'food', category: 'food' },
    { id: 'id5', countryId: 'id', title: 'Bali', content: 'Bali has temples, rice terraces, and beaches. Dance and music are part of daily life!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'cw', name: 'Curaçao', countryCode: 'CW', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Colorful Willemstad, diving, and Caribbean sun!', roomTheme: 'coastal', accentColor: '#002868', facts: [
    { id: 'cw1', countryId: 'cw', title: 'Willemstad', content: 'The capital has bright pink, yellow, and blue buildings. It looks like a candy-colored town!', icon: 'landmark', category: 'culture' },
    { id: 'cw2', countryId: 'cw', title: 'Papiamento', content: 'People speak Papiamento — a mix of Portuguese, Spanish, Dutch, and more. "Bon dia" means good day!', icon: 'language', category: 'language' },
    { id: 'cw3', countryId: 'cw', title: 'Diving', content: 'The sea around Curaçao is clear and full of fish and coral. Perfect for snorkeling and diving!', icon: 'nature', category: 'nature' },
    { id: 'cw4', countryId: 'cw', title: 'Keshi yena', content: 'Keshi yena is a dish of cheese stuffed with spiced meat. A classic from the island!', icon: 'food', category: 'food' },
    { id: 'cw5', countryId: 'cw', title: 'Carnival', content: 'Curaçao Carnival has parades, music, and costumes. Everyone dances in the streets!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'pl', name: 'Poland', countryCode: 'PL', flagEmoji: '', visitCostAura: 65, housePriceAura: 390, description: 'Pierogi, castles, and amber!', roomTheme: 'traditional', accentColor: '#DC143C', facts: [
    { id: 'pl1', countryId: 'pl', title: 'Pierogi', content: 'Pierogi are dumplings filled with cheese, meat, or fruit. They\'re boiled or fried — delicious!', icon: 'food', category: 'food' },
    { id: 'pl2', countryId: 'pl', title: 'Czesc!', content: '"Czesc" means "hi" in Polish. Polish has lots of consonants — try: cheshch!', icon: 'language', category: 'language' },
    { id: 'pl3', countryId: 'pl', title: 'Krakow', content: 'Krakow has a huge market square and a castle. The dragon legend says a dragon lived under the hill!', icon: 'landmark', category: 'history' },
    { id: 'pl4', countryId: 'pl', title: 'Amber', content: 'The Baltic coast has amber — fossilized tree resin. Sometimes you find insects inside!', icon: 'nature', category: 'nature' },
    { id: 'pl5', countryId: 'pl', title: 'Folk traditions', content: 'Polish folk art has paper cutouts and painted Easter eggs. Very colorful!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'es', name: 'Spain', countryCode: 'ES', flagEmoji: '', visitCostAura: 75, housePriceAura: 460, description: 'La Tomatina, flamenco, and tapas!', roomTheme: 'traditional', accentColor: '#F1BF00', facts: [
    { id: 'es1', countryId: 'es', title: 'La Tomatina', content: 'In Buñol everyone throws tomatoes at each other! A giant messy food fight once a year!', icon: 'food', category: 'fun' },
    { id: 'es2', countryId: 'es', title: 'Flamenco', content: 'Flamenco is dance, guitar, and song from southern Spain. It\'s passionate and powerful!', icon: 'culture', category: 'culture' },
    { id: 'es3', countryId: 'es', title: 'Hola!', content: '"Hola" means hello in Spanish. Spain has several languages including Catalan and Basque!', icon: 'language', category: 'language' },
    { id: 'es4', countryId: 'es', title: 'Tapas', content: 'Tapas are small dishes to share — olives, cheese, tortilla, ham. Perfect with friends!', icon: 'food', category: 'food' },
    { id: 'es5', countryId: 'es', title: 'Sagrada Familia', content: 'Gaudí\'s church in Barcelona is still being built after 100 years. It looks like a stone forest!', icon: 'landmark', category: 'fun' },
  ]},
  { id: 'ba', name: 'Bosnia and Herzegovina', countryCode: 'BA', flagEmoji: '', visitCostAura: 55, housePriceAura: 330, description: 'Old bridges, coffee culture, and mountains!', roomTheme: 'traditional', accentColor: '#002395', facts: [
    { id: 'ba1', countryId: 'ba', title: 'Stari Most', content: 'The Old Bridge in Mostar was rebuilt after the war. Divers jump off it into the river below!', icon: 'landmark', category: 'culture' },
    { id: 'ba2', countryId: 'ba', title: 'Coffee', content: 'Bosnian coffee is strong and served in small cups with sugar cubes. It\'s a ritual to share!', icon: 'cafe', category: 'food' },
    { id: 'ba3', countryId: 'ba', title: 'Zdravo!', content: '"Zdravo" means hello. Bosnia has three main languages: Bosnian, Serbian, Croatian!', icon: 'language', category: 'language' },
    { id: 'ba4', countryId: 'ba', title: 'Mountains', content: 'Bosnia has green mountains and rivers. Great for hiking and rafting!', icon: 'nature', category: 'nature' },
    { id: 'ba5', countryId: 'ba', title: 'Cevapi', content: 'Cevapi are grilled meat sausages in flatbread. Street food favorite!', icon: 'food', category: 'food' },
  ]},
  { id: 'mc', name: 'Monaco', countryCode: 'MC', flagEmoji: '', visitCostAura: 95, housePriceAura: 700, description: 'Grand Prix, palace, and the Mediterranean!', roomTheme: 'city', accentColor: '#CE1126', facts: [
    { id: 'mc1', countryId: 'mc', title: 'Grand Prix', content: 'Monaco hosts the most famous Formula 1 race. Cars zoom through the streets of the city!', icon: 'culture', category: 'fun' },
    { id: 'mc2', countryId: 'mc', title: 'Tiny country', content: 'Monaco is the second smallest country in the world. You can walk across it in under an hour!', icon: 'landmark', category: 'fun' },
    { id: 'mc3', countryId: 'mc', title: 'Bonjour!', content: 'People speak French. "Bonjour" is hello. Monaco is on the French coast!', icon: 'language', category: 'language' },
    { id: 'mc4', countryId: 'mc', title: 'Prince\'s Palace', content: 'The Prince of Monaco lives in a palace on the rock. There\'s a ceremony when the guards change!', icon: 'landmark', category: 'history' },
    { id: 'mc5', countryId: 'mc', title: 'Yachts and sea', content: 'The harbor is full of huge yachts. The Mediterranean is blue and beautiful!', icon: 'nature', category: 'nature' },
  ]},
  { id: 'me', name: 'Montenegro', countryCode: 'ME', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Bay of Kotor, mountains, and old towns!', roomTheme: 'coastal', accentColor: '#C41E3A', facts: [
    { id: 'me1', countryId: 'me', title: 'Bay of Kotor', content: 'The bay is like a fjord with mountains and medieval towns. Sail in and explore!', icon: 'nature', category: 'nature' },
    { id: 'me2', countryId: 'me', title: 'Zdravo!', content: '"Zdravo" means hello. Montenegrin is similar to Serbian and Croatian!', icon: 'language', category: 'language' },
    { id: 'me3', countryId: 'me', title: 'Old towns', content: 'Kotor and Budva have stone streets and walls. Cats everywhere!', icon: 'landmark', category: 'history' },
    { id: 'me4', countryId: 'me', title: 'Njeguši cheese', content: 'Smoked cheese from the village of Njeguši is a specialty. Try it with prosciutto!', icon: 'food', category: 'food' },
    { id: 'me5', countryId: 'me', title: 'Durmitor', content: 'Durmitor National Park has peaks and a canyon. In winter people ski; in summer they hike!', icon: 'mountain', category: 'nature' },
  ]},
  { id: 'ec', name: 'Ecuador', countryCode: 'EC', flagEmoji: '', visitCostAura: 60, housePriceAura: 370, description: 'Galápagos, equator line, and quinoa!', roomTheme: 'nature', accentColor: '#FFD100', facts: [
    { id: 'ec1', countryId: 'ec', title: 'Galápagos', content: 'The Galápagos Islands have unique animals — giant tortoises, blue-footed boobies! Darwin studied there!', icon: 'nature', category: 'nature' },
    { id: 'ec2', countryId: 'ec', title: 'Middle of the world', content: 'Ecuador is named after the equator. You can stand with one foot in each hemisphere!', icon: 'landmark', category: 'fun' },
    { id: 'ec3', countryId: 'ec', title: 'Hola!', content: '"Hola" means hello in Spanish. Ecuador has Spanish and indigenous languages!', icon: 'language', category: 'language' },
    { id: 'ec4', countryId: 'ec', title: 'Quinoa', content: 'Quinoa has been grown in the Andes for thousands of years. It\'s super healthy!', icon: 'food', category: 'food' },
    { id: 'ec5', countryId: 'ec', title: 'Otavalo market', content: 'Otavalo has one of the biggest markets in South America. Textiles, crafts, and music!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'ar', name: 'Argentina', countryCode: 'AR', flagEmoji: '', visitCostAura: 70, housePriceAura: 430, description: 'Tango, steak, and Iguazú Falls!', roomTheme: 'city', accentColor: '#75AADB', facts: [
    { id: 'ar1', countryId: 'ar', title: 'Tango', content: 'Tango was born in Buenos Aires. Dancers move together in a passionate embrace!', icon: 'culture', category: 'culture' },
    { id: 'ar2', countryId: 'ar', title: 'Tango Festival', content: 'Every year Buenos Aires has a huge tango festival. Dancers from all over the world come!', icon: 'culture', category: 'culture' },
    { id: 'ar3', countryId: 'ar', title: 'Hola!', content: '"Hola" means hello in Spanish. Argentina is the biggest Spanish-speaking country!', icon: 'language', category: 'language' },
    { id: 'ar4', countryId: 'ar', title: 'Asado', content: 'Asado is a barbecue with lots of meat — beef, chorizo, ribs. A big social event!', icon: 'food', category: 'food' },
    { id: 'ar5', countryId: 'ar', title: 'Iguazú Falls', content: 'Iguazú Falls are huge — hundreds of waterfalls in the jungle. The roar is amazing!', icon: 'nature', category: 'nature' },
  ]},
  { id: 'ch', name: 'Switzerland', countryCode: 'CH', flagEmoji: '', visitCostAura: 85, housePriceAura: 550, description: 'Alps, apres ski, and chocolate!', roomTheme: 'mountain', accentColor: '#FF0000', facts: [
    { id: 'ch1', countryId: 'ch', title: 'Apres ski', content: 'After skiing in the Alps, everyone gathers for hot chocolate, cheese, and cozy fun!', icon: 'flame', category: 'culture' },
    { id: 'ch2', countryId: 'ch', title: 'Chocolate', content: 'Swiss chocolate is famous. Milk chocolate was invented in Switzerland!', icon: 'food', category: 'food' },
    { id: 'ch3', countryId: 'ch', title: 'Grüezi!', content: '"Grüezi" means hello in Swiss German. Switzerland has four national languages!', icon: 'language', category: 'language' },
    { id: 'ch4', countryId: 'ch', title: 'Alps', content: 'The Swiss Alps have snow-capped peaks, cows with bells, and green valleys. So pretty!', icon: 'mountain', category: 'nature' },
    { id: 'ch5', countryId: 'ch', title: 'Fondue', content: 'Fondue is melted cheese you dip bread into. Perfect after a day in the snow!', icon: 'food', category: 'food' },
  ]},
  { id: 'bg', name: 'Bulgaria', countryCode: 'BG', flagEmoji: '', visitCostAura: 55, housePriceAura: 340, description: 'Roses, yogurt, and ancient Thracian gold!', roomTheme: 'traditional', accentColor: '#00966E', facts: [
    { id: 'bg1', countryId: 'bg', title: 'Rose Valley', content: 'Bulgaria grows roses for perfume. In June they harvest petals and it smells amazing!', icon: 'nature', category: 'nature' },
    { id: 'bg2', countryId: 'bg', title: 'Yogurt', content: 'Bulgarian yogurt has special bacteria. It\'s been made the same way for centuries!', icon: 'food', category: 'food' },
    { id: 'bg3', countryId: 'bg', title: 'Zdravey!', content: '"Zdravey" means "hello" or "health" in Bulgarian. Say it: zdrah-vey!', icon: 'language', category: 'language' },
    { id: 'bg4', countryId: 'bg', title: 'Thracian gold', content: 'Ancient Thracians left beautiful gold treasures. Museums have masks and cups thousands of years old!', icon: 'history', category: 'history' },
    { id: 'bg5', countryId: 'bg', title: 'Nestinari', content: 'In some villages people dance on hot coals! A traditional ritual that amazes visitors!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'ro', name: 'Romania', countryCode: 'RO', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Dracula\'s castle, painted monasteries, and Transylvania!', roomTheme: 'traditional', accentColor: '#002B7F', facts: [
    { id: 'ro1', countryId: 'ro', title: 'Bran Castle', content: 'Bran Castle is linked to the Dracula legend. It sits on a hill in Transylvania!', icon: 'castle', category: 'fun' },
    { id: 'ro2', countryId: 'ro', title: 'Painted monasteries', content: 'Monasteries in Bucovina have outside walls painted with Bible stories. Unique in the world!', icon: 'temple', category: 'culture' },
    { id: 'ro3', countryId: 'ro', title: 'Buna!', content: '"Buna" means "hello" in Romanian. Romanian is a Romance language like Spanish and Italian!', icon: 'language', category: 'language' },
    { id: 'ro4', countryId: 'ro', title: 'Sarmale', content: 'Sarmale are cabbage rolls stuffed with meat and rice. A traditional favorite!', icon: 'food', category: 'food' },
    { id: 'ro5', countryId: 'ro', title: 'Carpathians', content: 'The Carpathian Mountains have bears, wolves, and wild forests. Great for hiking!', icon: 'mountain', category: 'nature' },
  ]},
  { id: 'si', name: 'Slovenia', countryCode: 'SI', flagEmoji: '', visitCostAura: 65, housePriceAura: 390, description: 'Lake Bled, caves, and green valleys!', roomTheme: 'nature', accentColor: '#005DA4', facts: [
    { id: 'si1', countryId: 'si', title: 'Lake Bled', content: 'Lake Bled has a church on an island and a castle on the cliff. Row a boat to the island!', icon: 'nature', category: 'nature' },
    { id: 'si2', countryId: 'si', title: 'Postojna Cave', content: 'Postojna Cave has a train inside! You ride through amazing stalactites and see "dragon" salamanders!', icon: 'nature', category: 'fun' },
    { id: 'si3', countryId: 'si', title: 'Zdravo!', content: '"Zdravo" means hello in Slovenian. Slovenia is small but has mountains, coast, and lakes!', icon: 'language', category: 'language' },
    { id: 'si4', countryId: 'si', title: 'Potica', content: 'Potica is a sweet nut roll. Families make it for holidays and special occasions!', icon: 'food', category: 'food' },
    { id: 'si5', countryId: 'si', title: 'Beekeeping', content: 'Slovenia loves bees! Painted beehive panels show folk stories. Beekeeping is a tradition!', icon: 'nature', category: 'culture' },
  ]},
  { id: 'sk', name: 'Slovakia', countryCode: 'SK', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Castles, folk art, and High Tatras!', roomTheme: 'mountain', accentColor: '#0B4EA2', facts: [
    { id: 'sk1', countryId: 'sk', title: 'High Tatras', content: 'The High Tatras are dramatic mountains. People hike and ski there!', icon: 'mountain', category: 'nature' },
    { id: 'sk2', countryId: 'sk', title: 'Bratislava', content: 'Bratislava is the capital on the Danube. The castle looks over the old town!', icon: 'landmark', category: 'history' },
    { id: 'sk3', countryId: 'sk', title: 'Ahoj!', content: '"Ahoj" means "hi" in Slovak — like sailors saying "ahoy"!', icon: 'language', category: 'language' },
    { id: 'sk4', countryId: 'sk', title: 'Bryndza', content: 'Bryndza is soft sheep cheese. It goes in traditional dumplings and spreads!', icon: 'food', category: 'food' },
    { id: 'sk5', countryId: 'sk', title: 'Wooden churches', content: 'Slovakia has beautiful wooden churches in the countryside. No nails — just wood!', icon: 'temple', category: 'culture' },
  ]},
  { id: 'at', name: 'Austria', countryCode: 'AT', flagEmoji: '', visitCostAura: 78, housePriceAura: 480, description: 'Apres ski, Mozart, and Sachertorte!', roomTheme: 'mountain', accentColor: '#ED2939', facts: [
    { id: 'at1', countryId: 'at', title: 'Apres ski', content: 'After a day on the slopes, skiers gather for hot chocolate, music, and cozy fun in the Alps!', icon: 'flame', category: 'culture' },
    { id: 'at2', countryId: 'at', title: 'Mozart', content: 'Mozart was born in Salzburg. The city is full of music and chocolate "Mozartkugeln"!', icon: 'culture', category: 'culture' },
    { id: 'at3', countryId: 'at', title: 'Grüss Gott!', content: '"Grüss Gott" means "greet God" — a friendly hello in Austrian German!', icon: 'language', category: 'language' },
    { id: 'at4', countryId: 'at', title: 'Sachertorte', content: 'Sachertorte is chocolate cake with apricot jam. Invented in Vienna and still famous!', icon: 'food', category: 'food' },
    { id: 'at5', countryId: 'at', title: 'Alps', content: 'Austria is covered in Alps. In winter everyone skis; in summer they hike and climb!', icon: 'mountain', category: 'nature' },
  ]},
  { id: 'cz', name: 'Czech Republic', countryCode: 'CZ', flagEmoji: '', visitCostAura: 68, housePriceAura: 410, description: 'Prague, beer culture, and fairy-tale castles!', roomTheme: 'traditional', accentColor: '#D7141A', facts: [
    { id: 'cz1', countryId: 'cz', title: 'Beer culture', content: 'Czechs love beer! Pilsner was invented here. There are festivals and cozy pubs everywhere!', icon: 'culture', category: 'culture' },
    { id: 'cz2', countryId: 'cz', title: 'Prague', content: 'Prague has a castle, old square, and astronomical clock. The bridge is full of statues!', icon: 'landmark', category: 'history' },
    { id: 'cz3', countryId: 'cz', title: 'Ahoj!', content: '"Ahoj" means "hi" in Czech. Easy to remember — like "ahoy"!', icon: 'language', category: 'language' },
    { id: 'cz4', countryId: 'cz', title: 'Trdelník', content: 'Trdelník is sweet dough rolled on a stick and grilled. Often with sugar and ice cream!', icon: 'food', category: 'food' },
    { id: 'cz5', countryId: 'cz', title: 'Puppets', content: 'Puppet theater is a Czech tradition. Marionettes tell stories in old theaters!', icon: 'culture', category: 'fun' },
  ]},
  { id: 'de', name: 'Germany', countryCode: 'DE', flagEmoji: '', visitCostAura: 75, housePriceAura: 460, description: 'Oktoberfest, castles, and Christmas markets!', roomTheme: 'traditional', accentColor: '#000000', facts: [
    { id: 'de1', countryId: 'de', title: 'Oktoberfest', content: 'Oktoberfest in Munich is the world\'s biggest folk festival. Parades, music, and Bavarian fun!', icon: 'culture', category: 'culture' },
    { id: 'de2', countryId: 'de', title: 'Guten Tag!', content: '"Guten Tag" means "good day" in German. Say it: GOO-ten tahk!', icon: 'language', category: 'language' },
    { id: 'de3', countryId: 'de', title: 'Castles', content: 'Neuschwanstein looks like a fairy-tale castle. King Ludwig built it in the mountains!', icon: 'castle', category: 'fun' },
    { id: 'de4', countryId: 'de', title: 'Bratwurst', content: 'German sausages are famous. Bratwurst, currywurst — each region has its own!', icon: 'food', category: 'food' },
    { id: 'de5', countryId: 'de', title: 'Christmas markets', content: 'In December towns have Christmas markets with lights, treats, and handmade gifts!', icon: 'star', category: 'culture' },
  ]},
  { id: 'pt', name: 'Portugal', countryCode: 'PT', flagEmoji: '', visitCostAura: 70, housePriceAura: 420, description: 'Fado, pasteis de nata, and explorers!', roomTheme: 'coastal', accentColor: '#006600', facts: [
    { id: 'pt1', countryId: 'pt', title: 'Fado', content: 'Fado is sad, beautiful Portuguese music. Singers tell stories with guitars!', icon: 'culture', category: 'culture' },
    { id: 'pt2', countryId: 'pt', title: 'Pastéis de nata', content: 'Pastéis de nata are custard tarts with cinnamon. Best fresh from the bakery!', icon: 'food', category: 'food' },
    { id: 'pt3', countryId: 'pt', title: 'Olá!', content: '"Olá" means "hello" in Portuguese. Portugal is one of the oldest nations in Europe!', icon: 'language', category: 'language' },
    { id: 'pt4', countryId: 'pt', title: 'Explorers', content: 'Portuguese sailors explored the world long ago. Vasco da Gama reached India by sea!', icon: 'history', category: 'history' },
    { id: 'pt5', countryId: 'pt', title: 'Azulejos', content: 'Portuguese tiles (azulejos) cover buildings in blue and white patterns. So pretty!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'tn', name: 'Tunisia', countryCode: 'TN', flagEmoji: '', visitCostAura: 55, housePriceAura: 330, description: 'Medinas, Star Wars sets, and the Sahara!', roomTheme: 'traditional', accentColor: '#E70013', facts: [
    { id: 'tn1', countryId: 'tn', title: 'Star Wars', content: 'Parts of Star Wars were filmed in Tunisia. You can visit Luke Skywalker\'s home!', icon: 'culture', category: 'fun' },
    { id: 'tn2', countryId: 'tn', title: 'Sahara', content: 'The Sahara Desert reaches Tunisia. You can ride camels and sleep in a Bedouin camp!', icon: 'nature', category: 'nature' },
    { id: 'tn3', countryId: 'tn', title: 'Marhaba!', content: '"Marhaba" means hello in Arabic. Tunisian Arabic has its own flavor!', icon: 'language', category: 'language' },
    { id: 'tn4', countryId: 'tn', title: 'Couscous', content: 'Couscous is steamed semolina with vegetables and meat. The national dish!', icon: 'food', category: 'food' },
    { id: 'tn5', countryId: 'tn', title: 'Carthage', content: 'Carthage was an ancient city. Hannibal and his elephants set off from here!', icon: 'history', category: 'history' },
  ]},
  { id: 'al', name: 'Albania', countryCode: 'AL', flagEmoji: '', visitCostAura: 52, housePriceAura: 320, description: 'Mountains, bunkers, and hospitality!', roomTheme: 'nature', accentColor: '#E41E20', facts: [
    { id: 'al1', countryId: 'al', title: 'Bunkers', content: 'Albania has thousands of small bunkers from the past. Now some are turned into art or cafes!', icon: 'history', category: 'history' },
    { id: 'al2', countryId: 'al', title: 'Albanian Alps', content: 'The mountains in the north are wild and beautiful. Great for hiking!', icon: 'mountain', category: 'nature' },
    { id: 'al3', countryId: 'al', title: 'Tungjatjeta!', content: '"Tungjatjeta" means "long life" — a formal hello in Albanian!', icon: 'language', category: 'language' },
    { id: 'al4', countryId: 'al', title: 'Byrek', content: 'Byrek is flaky pastry with cheese, meat, or spinach. Eaten any time of day!', icon: 'food', category: 'food' },
    { id: 'al5', countryId: 'al', title: 'Guest welcome', content: 'Albanians are famous for welcoming guests. "Besa" means keeping your word and looking after visitors!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'lc', name: 'Saint Lucia', countryCode: 'LC', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Piton mountains, jazz, and Caribbean spice!', roomTheme: 'coastal', accentColor: '#6CF0A5', facts: [
    { id: 'lc1', countryId: 'lc', title: 'Pitons', content: 'The Pitons are two pointy mountains by the sea. They\'re a UNESCO site and super photogenic!', icon: 'mountain', category: 'nature' },
    { id: 'lc2', countryId: 'lc', title: 'Jazz Festival', content: 'Saint Lucia has a famous jazz festival. Music by the sea under the stars!', icon: 'culture', category: 'culture' },
    { id: 'lc3', countryId: 'lc', title: 'Hello!', content: 'People speak English. "Hello" and "Good morning" — plus Creole phrases!', icon: 'language', category: 'language' },
    { id: 'lc4', countryId: 'lc', title: 'Green figs and saltfish', content: 'The national dish is green bananas with salted cod. A classic breakfast!', icon: 'food', category: 'food' },
    { id: 'lc5', countryId: 'lc', title: 'Sulphur springs', content: 'Drive-in volcano! You can drive right up to bubbling sulphur springs. Smells like eggs!', icon: 'nature', category: 'fun' },
  ]},
  { id: 'cl', name: 'Chile', countryCode: 'CL', flagEmoji: '', visitCostAura: 68, housePriceAura: 410, description: 'Easter Island, Atacama, and wine!', roomTheme: 'nature', accentColor: '#0039A6', facts: [
    { id: 'cl1', countryId: 'cl', title: 'Easter Island', content: 'Easter Island has giant stone heads (moai). Nobody knows exactly how they were moved!', icon: 'landmark', category: 'history' },
    { id: 'cl2', countryId: 'cl', title: 'Atacama Desert', content: 'The Atacama is the driest place on Earth. At night the stars are incredible!', icon: 'nature', category: 'nature' },
    { id: 'cl3', countryId: 'cl', title: 'Hola!', content: '"Hola" means hello in Spanish. Chile is long and thin — from desert to glaciers!', icon: 'language', category: 'language' },
    { id: 'cl4', countryId: 'cl', title: 'Empanadas', content: 'Chilean empanadas are often filled with meat, olive, and egg. Baked or fried!', icon: 'food', category: 'food' },
    { id: 'cl5', countryId: 'cl', title: 'Wine', content: 'Chile grows great wine in valleys between the mountains and the sea!', icon: 'food', category: 'culture' },
  ]},
  { id: 'uy', name: 'Uruguay', countryCode: 'UY', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Mate, tango, and beaches!', roomTheme: 'coastal', accentColor: '#0038A8', facts: [
    { id: 'uy1', countryId: 'uy', title: 'Mate', content: 'Uruguayans drink mate — a bitter tea in a gourd with a metal straw. They carry it everywhere!', icon: 'food', category: 'food' },
    { id: 'uy2', countryId: 'uy', title: 'Tango', content: 'Uruguay shares tango with Argentina. Montevideo has milongas where people dance!', icon: 'culture', category: 'culture' },
    { id: 'uy3', countryId: 'uy', title: 'Hola!', content: '"Hola" means hello in Spanish. Uruguay is small but has lots of coast!', icon: 'language', category: 'language' },
    { id: 'uy4', countryId: 'uy', title: 'Asado', content: 'Like Argentina, Uruguayans love asado — big barbecues with family and friends!', icon: 'food', category: 'food' },
    { id: 'uy5', countryId: 'uy', title: 'Colonia', content: 'Colonia del Sacramento has cobbled streets and old Portuguese and Spanish buildings!', icon: 'landmark', category: 'history' },
  ]},
  { id: 'co', name: 'Colombia', countryCode: 'CO', flagEmoji: '', visitCostAura: 62, housePriceAura: 380, description: 'Coffee, salsa, and Carnival of Barranquilla!', roomTheme: 'nature', accentColor: '#FCD116', facts: [
    { id: 'co1', countryId: 'co', title: 'Coffee', content: 'Colombian coffee is world-famous. The mountains are perfect for growing beans!', icon: 'cafe', category: 'food' },
    { id: 'co2', countryId: 'co', title: 'Carnival of Barranquilla', content: 'One of the biggest carnivals! Parades, costumes, and dancing for days!', icon: 'culture', category: 'culture' },
    { id: 'co3', countryId: 'co', title: 'Hola!', content: '"Hola" means hello in Spanish. Colombia has coast, mountains, and rainforest!', icon: 'language', category: 'language' },
    { id: 'co4', countryId: 'co', title: 'Arepas', content: 'Arepas are corn cakes you can fill with cheese, egg, or meat. Breakfast or snack!', icon: 'food', category: 'food' },
    { id: 'co5', countryId: 'co', title: 'Emeralds', content: 'Colombia produces most of the world\'s emeralds. The green gems come from the mountains!', icon: 'nature', category: 'fun' },
  ]},
  { id: 'va', name: 'Vatican City', countryCode: 'VA', flagEmoji: '', visitCostAura: 88, housePriceAura: 580, description: 'The smallest country — art, history, and St. Peter\'s!', roomTheme: 'traditional', accentColor: '#FFE000', facts: [
    { id: 'va1', countryId: 'va', title: 'Smallest country', content: 'Vatican City is the smallest country in the world. You can walk across it in minutes!', icon: 'landmark', category: 'fun' },
    { id: 'va2', countryId: 'va', title: 'Sistine Chapel', content: 'Michelangelo painted the ceiling of the Sistine Chapel. Look up and see the Creation!', icon: 'culture', category: 'culture' },
    { id: 'va3', countryId: 'va', title: 'St. Peter\'s', content: 'St. Peter\'s Basilica is one of the biggest churches in the world. The dome is huge!', icon: 'temple', category: 'history' },
    { id: 'va4', countryId: 'va', title: 'Italian', content: 'People speak Italian. Vatican is inside Rome!', icon: 'language', category: 'language' },
    { id: 'va5', countryId: 'va', title: 'Swiss Guards', content: 'The Pope\'s guards wear colorful striped uniforms. They\'ve protected the Vatican for centuries!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'tz', name: 'Tanzania', countryCode: 'TZ', flagEmoji: '', visitCostAura: 55, housePriceAura: 340, description: 'Serengeti, Kilimanjaro, and the Great Migration!', roomTheme: 'nature', accentColor: '#00A3DD', facts: [
    { id: 'tz1', countryId: 'tz', title: 'Great Migration', content: 'Millions of wildebeest cross the Serengeti. Lions, cheetahs, and crocodiles follow!', icon: 'nature', category: 'nature' },
    { id: 'tz2', countryId: 'tz', title: 'Kilimanjaro', content: 'Mount Kilimanjaro is Africa\'s highest peak. You can climb through rainforest to snow!', icon: 'mountain', category: 'nature' },
    { id: 'tz3', countryId: 'tz', title: 'Jambo!', content: '"Jambo" means "hello" in Swahili. Swahili is spoken across East Africa!', icon: 'language', category: 'language' },
    { id: 'tz4', countryId: 'tz', title: 'Zanzibar', content: 'Zanzibar has spice farms and white beaches. The old Stone Town is full of history!', icon: 'nature', category: 'culture' },
    { id: 'tz5', countryId: 'tz', title: 'Maasai', content: 'The Maasai people live near the parks. They have rich traditions and live alongside wildlife!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'mg', name: 'Madagascar', countryCode: 'MG', flagEmoji: '', visitCostAura: 55, housePriceAura: 340, description: 'Lemurs, baobabs, and unique wildlife!', roomTheme: 'nature', accentColor: '#FC3F32', facts: [
    { id: 'mg1', countryId: 'mg', title: 'Lemurs', content: 'Lemurs only live in Madagascar! From tiny mouse lemurs to dancing sifakas!', icon: 'nature', category: 'nature' },
    { id: 'mg2', countryId: 'mg', title: 'Baobabs', content: 'The Avenue of the Baobabs has huge ancient trees. They look like they\'re upside down!', icon: 'nature', category: 'nature' },
    { id: 'mg3', countryId: 'mg', title: 'Manao ahoana!', content: '"Manao ahoana" means "how are you?" in Malagasy. Madagascar has its own language!', icon: 'language', category: 'language' },
    { id: 'mg4', countryId: 'mg', title: 'Intakoza', content: 'Intakoza celebrates the first harvest with music, dance, and family feasts!', icon: 'culture', category: 'culture' },
    { id: 'mg5', countryId: 'mg', title: 'Vanilla', content: 'Madagascar produces most of the world\'s vanilla. It grows on orchids!', icon: 'food', category: 'food' },
  ]},
  { id: 'fi', name: 'Finland', countryCode: 'FI', flagEmoji: '', visitCostAura: 72, housePriceAura: 440, description: 'Sauna, northern lights, and Santa!', roomTheme: 'nature', accentColor: '#003580', facts: [
    { id: 'fi1', countryId: 'fi', title: 'Sauna', content: 'Finland has more saunas than cars! Almost every house has one. Relax and get warm!', icon: 'culture', category: 'culture' },
    { id: 'fi2', countryId: 'fi', title: 'Santa Claus', content: 'Santa\'s official home is in Rovaniemi, Finland. You can visit him any time of year!', icon: 'culture', category: 'fun' },
    { id: 'fi3', countryId: 'fi', title: 'Hei!', content: '"Hei" means "hi" in Finnish. Finnish is very different from other European languages!', icon: 'language', category: 'language' },
    { id: 'fi4', countryId: 'fi', title: 'Midnight sun', content: 'In summer the sun doesn\'t set in the north. People play and hike at "night"!', icon: 'star', category: 'nature' },
    { id: 'fi5', countryId: 'fi', title: 'Reindeer', content: 'Reindeer live in Lapland. Some families herd them. You can take a reindeer sleigh ride!', icon: 'nature', category: 'nature' },
  ]},
  { id: 'se', name: 'Sweden', countryCode: 'SE', flagEmoji: '', visitCostAura: 75, housePriceAura: 460, description: 'Midsummer, meatballs, and IKEA!', roomTheme: 'nature', accentColor: '#006AA7', facts: [
    { id: 'se1', countryId: 'se', title: 'Midsummer', content: 'On Midsummer\'s Eve Swedes dance around a maypole and wear flower crowns. The sun barely sets!', icon: 'culture', category: 'culture' },
    { id: 'se2', countryId: 'se', title: 'Hej!', content: '"Hej" means "hi" in Swedish. Say it: hey! Easy and friendly!', icon: 'language', category: 'language' },
    { id: 'se3', countryId: 'se', title: 'Meatballs', content: 'Swedish meatballs with gravy and lingonberry are famous. IKEA made them world-known!', icon: 'food', category: 'food' },
    { id: 'se4', countryId: 'se', title: 'ABBA', content: 'ABBA is from Sweden! "Dancing Queen" and "Mamma Mia" — everyone knows them!', icon: 'culture', category: 'fun' },
    { id: 'se5', countryId: 'se', title: 'Archipelago', content: 'Stockholm is built on islands. Thousands of islands dot the coast — take a boat!', icon: 'nature', category: 'nature' },
  ]},
  { id: 'in', name: 'India', countryCode: 'IN', flagEmoji: '', visitCostAura: 65, housePriceAura: 400, description: 'Holi, Diwali, and the Taj Mahal!', roomTheme: 'traditional', accentColor: '#FF9933', facts: [
    { id: 'in1', countryId: 'in', title: 'Holi', content: 'Holi is the festival of colors! People throw bright powder and water to celebrate spring!', icon: 'sparkles', category: 'culture' },
    { id: 'in2', countryId: 'in', title: 'Diwali', content: 'Diwali is the festival of lights. Lamps, sweets, and fireworks celebrate good over evil!', icon: 'star', category: 'culture' },
    { id: 'in3', countryId: 'in', title: 'Namaste!', content: '"Namaste" means "I bow to you" — hands together, a respectful hello!', icon: 'language', category: 'language' },
    { id: 'in4', countryId: 'in', title: 'Taj Mahal', content: 'The Taj Mahal is a white marble palace built for love. One of the Seven Wonders!', icon: 'landmark', category: 'history' },
    { id: 'in5', countryId: 'in', title: 'Curry and chai', content: 'Indian food has spices like turmeric and cumin. Chai (tea with milk and spices) is drunk everywhere!', icon: 'food', category: 'food' },
  ]},
  { id: 'vn', name: 'Vietnam', countryCode: 'VN', flagEmoji: '', visitCostAura: 58, housePriceAura: 350, description: 'Lanterns in Hoi An, pho, and Halong Bay!', roomTheme: 'traditional', accentColor: '#DA251D', facts: [
    { id: 'vn1', countryId: 'vn', title: 'Hoi An lanterns', content: 'Hoi An lights up with thousands of silk lanterns on the river. Magical at night!', icon: 'star', category: 'culture' },
    { id: 'vn2', countryId: 'vn', title: 'Pho', content: 'Pho is noodle soup with herbs and beef or chicken. Breakfast, lunch, or dinner!', icon: 'food', category: 'food' },
    { id: 'vn3', countryId: 'vn', title: 'Xin chào!', content: '"Xin chào" means "hello" in Vietnamese. Say it: sin chow!', icon: 'language', category: 'language' },
    { id: 'vn4', countryId: 'vn', title: 'Halong Bay', content: 'Halong Bay has thousands of limestone islands. Sail through on a boat!', icon: 'nature', category: 'nature' },
    { id: 'vn5', countryId: 'vn', title: 'Tet', content: 'Tet is Lunar New Year. Families gather, give red envelopes, and eat special foods!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'is', name: 'Iceland', countryCode: 'IS', flagEmoji: '', visitCostAura: 82, housePriceAura: 520, description: 'Northern lights, geysers, and Vikings!', roomTheme: 'nature', accentColor: '#02529C', facts: [
    { id: 'is1', countryId: 'is', title: 'Northern lights', content: 'Iceland is one of the best places to see the aurora. Green and purple dance in the sky!', icon: 'sparkles', category: 'nature' },
    { id: 'is2', countryId: 'is', title: 'Geysers', content: 'Geysers shoot hot water into the air. Strokkur erupts every few minutes!', icon: 'nature', category: 'nature' },
    { id: 'is3', countryId: 'is', title: 'Halló!', content: '"Halló" means "hello" in Icelandic. Vikings spoke an old form of this language!', icon: 'language', category: 'language' },
    { id: 'is4', countryId: 'is', title: 'No mosquitoes', content: 'Iceland has no mosquitoes! The climate is too cold for them. Unique in the world!', icon: 'nature', category: 'fun' },
    { id: 'is5', countryId: 'is', title: 'Hot springs', content: 'Icelanders love hot pools. The Blue Lagoon is a famous geothermal spa!', icon: 'nature', category: 'culture' },
  ]},
  { id: 'au', name: 'Australia', countryCode: 'AU', flagEmoji: '', visitCostAura: 78, housePriceAura: 480, description: 'Kangaroos, Great Barrier Reef, and surf!', roomTheme: 'nature', accentColor: '#00008B', facts: [
    { id: 'au1', countryId: 'au', title: 'Kangaroos', content: 'Kangaroos hop across the country. There are more kangaroos than people in Australia!', icon: 'nature', category: 'nature' },
    { id: 'au2', countryId: 'au', title: 'G\'day!', content: '"G\'day" means "good day" — a classic Aussie greeting!', icon: 'language', category: 'language' },
    { id: 'au3', countryId: 'au', title: 'Great Barrier Reef', content: 'The Great Barrier Reef is the world\'s biggest coral reef. Snorkel with fish and turtles!', icon: 'nature', category: 'nature' },
    { id: 'au4', countryId: 'au', title: 'Vegemite', content: 'Vegemite is a spread made from yeast. Australians love it on toast for breakfast!', icon: 'food', category: 'food' },
    { id: 'au5', countryId: 'au', title: 'Aboriginal culture', content: 'Aboriginal people have lived in Australia for over 65,000 years. Art and stories are passed down!', icon: 'culture', category: 'culture' },
  ]},
  { id: 'nz', name: 'New Zealand', countryCode: 'NZ', flagEmoji: '', visitCostAura: 75, housePriceAura: 460, description: 'Hobbiton, Maori culture, and fjords!', roomTheme: 'nature', accentColor: '#00247D', facts: [
    { id: 'nz1', countryId: 'nz', title: 'Hobbiton', content: 'The Lord of the Rings was filmed in New Zealand. You can visit the Hobbit holes!', icon: 'culture', category: 'fun' },
    { id: 'nz2', countryId: 'nz', title: 'Kia ora!', content: '"Kia ora" means "hello" and "thank you" in Maori. Maori is an official language!', icon: 'language', category: 'language' },
    { id: 'nz3', countryId: 'nz', title: 'Maori haka', content: 'The haka is a powerful Maori dance. The All Blacks do it before rugby games!', icon: 'culture', category: 'culture' },
    { id: 'nz4', countryId: 'nz', title: 'Milford Sound', content: 'Milford Sound is a fjord with cliffs and waterfalls. Dolphins and seals live there!', icon: 'nature', category: 'nature' },
    { id: 'nz5', countryId: 'nz', title: 'Sheep', content: 'New Zealand has way more sheep than people. Lamb and wool are big!', icon: 'nature', category: 'fun' },
  ]},
];

// ===================================
// UI CONSTANTS
// ===================================

export const ANIMATION_CONFIG = {
  SPRING: {
    damping: 15,
    stiffness: 150,
  },
  GENTLE: {
    damping: 20,
    stiffness: 100,
  },
};

// ===================================
// LIMITS
// ===================================

export const LIMITS = {
  MAX_USERNAME_LENGTH: 20,
  MAX_DISPLAY_NAME_LENGTH: 30,
  MAX_NOTE_LENGTH: 500,
  MAX_CAPTION_LENGTH: 280,
  MAX_PHOTO_SIZE_MB: 10,
  NEARBY_LOCATIONS_RADIUS_KM: 50,
};
