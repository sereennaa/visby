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
