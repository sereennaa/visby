import { getCountryLocations, getMythsForCountry, getPhrasesForCountry } from './learningContent';
import { getDishesByCountry } from './worldFoods';

export interface GreetingEntry {
  phrase: string;
  pronunciation: string;
  meaning: string;
  context: string;
}

export interface MannerEntry {
  title: string;
  description: string;
  icon: string;
}

export interface SustainabilityEntry {
  title: string;
  description: string;
  icon: string;
}

export interface MythEntry {
  title: string;
  story: string;
  icon: string;
}

export interface LandmarkEntry {
  name: string;
  description: string;
  funFact: string;
  imageUrl?: string;
}

export interface FoodEntry {
  name: string;
  description: string;
  ingredients?: string[];
  funFact: string;
}

export interface HistoryEntry {
  title: string;
  description: string;
  year?: string;
  icon: string;
}

export interface CultureEntry {
  title: string;
  description: string;
  icon: string;
}

export interface LanguageWordEntry {
  word: string;
  meaning: string;
  usage: string;
}

export interface CountryKnowledge {
  countryId: string;
  greetings: GreetingEntry[];
  manners: MannerEntry[];
  sustainability: SustainabilityEntry[];
  myths: MythEntry[];
  landmarks: LandmarkEntry[];
  food: FoodEntry[];
  history: HistoryEntry[];
  culture: CultureEntry[];
  language: LanguageWordEntry[];
}

const CORE_COUNTRIES = ['jp', 'fr', 'mx', 'it', 'gb', 'br', 'kr', 'th', 'ma', 'pe', 'ke', 'no', 'tr', 'gr'] as const;

const COUNTRY_MANNERS: Record<string, MannerEntry[]> = {
  jp: [
    { title: 'Bow politely', description: 'A small bow is a respectful greeting in Japan.', icon: 'greeting' },
    { title: 'Indoor shoes off', description: 'Take off your shoes before entering many homes.', icon: 'home' },
    { title: 'Quiet on trains', description: 'People usually keep voices low on public transport.', icon: 'culture' },
    { title: 'Use both hands', description: 'Offer or receive business cards and gifts with care.', icon: 'heart' },
    { title: 'Queue neatly', description: 'Lines are organized and people wait their turn.', icon: 'compass' },
  ],
  fr: [
    { title: 'Say Bonjour first', description: 'Greeting people before asking questions is polite.', icon: 'greeting' },
    { title: 'Keep table manners', description: 'Hands usually stay visible above the table.', icon: 'food' },
    { title: 'Use formal words', description: 'Use "vous" with adults you do not know well.', icon: 'book' },
    { title: 'Wait before eating', description: 'Meals often begin when everyone is served.', icon: 'heart' },
    { title: 'Respect quiet spaces', description: 'Museums and churches are calm and quiet.', icon: 'culture' },
  ],
  mx: [
    { title: 'Greet warmly', description: 'A friendly hello and eye contact are important.', icon: 'greeting' },
    { title: 'Respect elders', description: 'Older family members are treated with special respect.', icon: 'heart' },
    { title: 'Use polite titles', description: 'Senor and Senora are common respectful forms.', icon: 'book' },
    { title: 'Take your time', description: 'Conversations are often social and unhurried.', icon: 'culture' },
    { title: 'Thank your host', description: 'Showing appreciation after meals is expected.', icon: 'food' },
  ],
  it: [
    { title: 'Greet with care', description: 'A warm hello is important in daily life.', icon: 'greeting' },
    { title: 'Coffee culture', description: 'Espresso is often enjoyed standing at a bar.', icon: 'food' },
    { title: 'Respect meal times', description: 'Lunch and dinner hours are valued family time.', icon: 'heart' },
    { title: 'Use indoor voices', description: 'Historic places often require quieter behavior.', icon: 'culture' },
    { title: 'Mind church etiquette', description: 'Cover shoulders in many religious sites.', icon: 'temple' },
  ],
  gb: [
    { title: 'Queue properly', description: 'Taking turns in a line is very important.', icon: 'compass' },
    { title: 'Say please and thanks', description: 'Polite words are used often in daily speech.', icon: 'greeting' },
    { title: 'Personal space', description: 'People often prefer a little distance while talking.', icon: 'culture' },
    { title: 'Tea time manners', description: 'Wait for everyone before starting shared treats.', icon: 'food' },
    { title: 'Quiet on transport', description: 'Phones and loud chats are kept moderate.', icon: 'book' },
  ],
  br: [
    { title: 'Friendly greetings', description: 'People usually greet with warmth and smiles.', icon: 'greeting' },
    { title: 'Respect local rhythms', description: 'Music and dance are joyful parts of gatherings.', icon: 'music' },
    { title: 'Beach cleanliness', description: 'Keeping beaches clean is part of good manners.', icon: 'leaf' },
    { title: 'Share food', description: 'Meals are often social and meant to be shared.', icon: 'food' },
    { title: 'Use polite forms', description: 'Showing respect in language is always appreciated.', icon: 'book' },
  ],
  kr: [
    { title: 'Bow slightly', description: 'A bow is a common respectful greeting.', icon: 'greeting' },
    { title: 'Use both hands', description: 'Give and receive items with two hands.', icon: 'heart' },
    { title: 'Elders first', description: 'Older people are often served before younger ones.', icon: 'culture' },
    { title: 'Indoor etiquette', description: 'Shoes are removed in many homes.', icon: 'home' },
    { title: 'Quiet public spaces', description: 'Subways and buses are usually calm.', icon: 'book' },
  ],
  th: [
    { title: 'Use the wai', description: 'Press palms together to greet respectfully.', icon: 'greeting' },
    { title: 'Head respect', description: 'Avoid touching someone\'s head in Thai culture.', icon: 'heart' },
    { title: 'Temple manners', description: 'Dress modestly and speak softly at temples.', icon: 'temple' },
    { title: 'Smile culture', description: 'A friendly smile is an important social cue.', icon: 'culture' },
    { title: 'Remove shoes', description: 'Shoes are often removed in homes and temples.', icon: 'home' },
  ],
  ma: [
    { title: 'Greet before business', description: 'Warm greetings come first in many interactions.', icon: 'greeting' },
    { title: 'Tea hospitality', description: 'Accepting mint tea is often a sign of respect.', icon: 'food' },
    { title: 'Right-hand custom', description: 'Use the right hand when sharing food.', icon: 'culture' },
    { title: 'Market manners', description: 'Bargaining can be friendly and respectful.', icon: 'compass' },
    { title: 'Respect prayer times', description: 'Be mindful around mosques and prayer hours.', icon: 'temple' },
  ],
  pe: [
    { title: 'Polite greetings', description: 'A friendly greeting is expected in shops and homes.', icon: 'greeting' },
    { title: 'Respect heritage sites', description: 'Follow rules at Inca and pre-Inca landmarks.', icon: 'landmark' },
    { title: 'Mountain courtesy', description: 'Listen to local safety advice in high altitudes.', icon: 'mountain' },
    { title: 'Market respect', description: 'Ask before taking photos in artisan markets.', icon: 'culture' },
    { title: 'Share meals', description: 'Family-style meals are common and social.', icon: 'food' },
  ],
  ke: [
    { title: 'Warm greetings', description: 'Greetings can be an important social ritual.', icon: 'greeting' },
    { title: 'Community respect', description: 'Respect for elders and community is highly valued.', icon: 'heart' },
    { title: 'Wildlife etiquette', description: 'Keep distance from animals on safari.', icon: 'nature' },
    { title: 'Ask before photos', description: 'Always ask before photographing people.', icon: 'culture' },
    { title: 'Conservation rules', description: 'Follow park rules to protect nature.', icon: 'leaf' },
  ],
  no: [
    { title: 'Respect nature', description: 'Outdoor spaces are cared for and kept clean.', icon: 'leaf' },
    { title: 'Queue and turn-taking', description: 'Orderly lines and fairness matter.', icon: 'compass' },
    { title: 'Quiet public tone', description: 'People often speak softly in shared spaces.', icon: 'book' },
    { title: 'Cabin etiquette', description: 'Remove shoes in many homes and cabins.', icon: 'home' },
    { title: 'Punctual culture', description: 'Being on time is considered respectful.', icon: 'culture' },
  ],
  tr: [
    { title: 'Offer tea', description: 'Tea is a common sign of hospitality.', icon: 'food' },
    { title: 'Respect elders', description: 'Elders are greeted with extra politeness.', icon: 'heart' },
    { title: 'Mosque etiquette', description: 'Dress modestly and remove shoes in mosques.', icon: 'temple' },
    { title: 'Market courtesy', description: 'Friendly conversation is part of shopping.', icon: 'culture' },
    { title: 'Table sharing', description: 'Meals are often shared with family and guests.', icon: 'greeting' },
  ],
  gr: [
    { title: 'Friendly hellos', description: 'Warm greetings are part of daily social life.', icon: 'greeting' },
    { title: 'Respect historic ruins', description: 'Do not climb protected ancient monuments.', icon: 'landmark' },
    { title: 'Slow meals', description: 'Meals are social and often enjoyed slowly.', icon: 'food' },
    { title: 'Island courtesy', description: 'Keep beaches and villages clean and quiet at night.', icon: 'leaf' },
    { title: 'Polite requests', description: 'Use courteous words in shops and cafes.', icon: 'book' },
  ],
};

const COUNTRY_SUSTAINABILITY: Record<string, SustainabilityEntry[]> = {
  jp: [
    { title: 'Recycling systems', description: 'Japan has detailed sorting rules for recycling waste.', icon: 'leaf' },
    { title: 'Train efficiency', description: 'High-speed and city trains reduce car traffic.', icon: 'compass' },
    { title: 'Eco packaging', description: 'Many cities reduce single-use plastics in stores.', icon: 'nature' },
    { title: 'Forest stewardship', description: 'Large parts of Japan remain forested and managed.', icon: 'mountain' },
    { title: 'Energy innovation', description: 'Japan invests in cleaner energy technology.', icon: 'globe' },
  ],
  fr: [
    { title: 'Rail travel', description: 'France uses extensive trains for lower-emission travel.', icon: 'compass' },
    { title: 'Food waste rules', description: 'Many shops donate surplus food instead of wasting it.', icon: 'food' },
    { title: 'City bike systems', description: 'Bike sharing helps reduce car use in cities.', icon: 'leaf' },
    { title: 'River restoration', description: 'Projects protect major rivers and wetlands.', icon: 'water' },
    { title: 'Green schools', description: 'Students learn sustainability through local projects.', icon: 'book' },
  ],
  mx: [
    { title: 'Sea turtle protection', description: 'Coastal programs protect turtle nesting beaches.', icon: 'water' },
    { title: 'Urban green spaces', description: 'Cities add parks and tree corridors for cleaner air.', icon: 'leaf' },
    { title: 'Community recycling', description: 'Many neighborhoods run local recycling drives.', icon: 'nature' },
    { title: 'Agave and dry farming', description: 'Traditional crops can use water efficiently.', icon: 'mountain' },
    { title: 'Protected reserves', description: 'Mexico has many biosphere reserve areas.', icon: 'globe' },
  ],
  it: [
    { title: 'Historic city walking', description: 'Walkable city centers reduce daily car use.', icon: 'compass' },
    { title: 'Mediterranean farms', description: 'Local seasonal produce supports sustainable food habits.', icon: 'food' },
    { title: 'Marine protection', description: 'Coastal parks protect sea habitats and fish species.', icon: 'water' },
    { title: 'Cultural restoration', description: 'Restoring old buildings avoids wasteful rebuilding.', icon: 'landmark' },
    { title: 'Recycling progress', description: 'Many regions have strong household recycling systems.', icon: 'leaf' },
  ],
  gb: [
    { title: 'Offshore wind', description: 'The UK produces major renewable power from sea wind farms.', icon: 'globe' },
    { title: 'Nature reserves', description: 'Wetlands and coastlines are protected for birds and wildlife.', icon: 'nature' },
    { title: 'Public transport', description: 'Rail and bus links help reduce emissions.', icon: 'compass' },
    { title: 'Plastic reduction', description: 'Policies reduce single-use bags and packaging.', icon: 'leaf' },
    { title: 'School eco clubs', description: 'Many students join projects on recycling and biodiversity.', icon: 'book' },
  ],
  br: [
    { title: 'Rainforest protection', description: 'Amazon conservation supports global climate balance.', icon: 'nature' },
    { title: 'River biodiversity', description: 'Large river systems host unique freshwater species.', icon: 'water' },
    { title: 'Urban reforestation', description: 'Cities plant trees to cool neighborhoods.', icon: 'leaf' },
    { title: 'Sustainable farming', description: 'Programs promote lower-impact farming practices.', icon: 'food' },
    { title: 'Wildlife corridors', description: 'Protected paths help animals move safely.', icon: 'mountain' },
  ],
  kr: [
    { title: 'Recycling leadership', description: 'South Korea has strong recycling and food waste systems.', icon: 'leaf' },
    { title: 'Green transit', description: 'Subways and buses are heavily used in major cities.', icon: 'compass' },
    { title: 'River cleanups', description: 'Urban waterways are restored for people and wildlife.', icon: 'water' },
    { title: 'Eco-tech innovation', description: 'Companies build cleaner batteries and electronics.', icon: 'globe' },
    { title: 'Smart energy', description: 'Cities test efficient lighting and grid systems.', icon: 'book' },
  ],
  th: [
    { title: 'Coral conservation', description: 'Marine parks help protect coral reef ecosystems.', icon: 'water' },
    { title: 'Elephant sanctuaries', description: 'Ethical sanctuaries care for rescued elephants.', icon: 'nature' },
    { title: 'Mangrove restoration', description: 'Coastal mangroves reduce erosion and protect wildlife.', icon: 'leaf' },
    { title: 'Eco-tourism', description: 'Communities run tourism that supports local nature.', icon: 'compass' },
    { title: 'Plastic reduction efforts', description: 'Many businesses reduce single-use plastics.', icon: 'globe' },
  ],
  ma: [
    { title: 'Solar power growth', description: 'Morocco hosts large solar energy projects.', icon: 'globe' },
    { title: 'Water-saving farming', description: 'Dry-region agriculture uses efficient irrigation.', icon: 'water' },
    { title: 'Argan ecosystem care', description: 'Argan forests are protected and managed sustainably.', icon: 'leaf' },
    { title: 'Desert conservation', description: 'Programs protect fragile Sahara-edge ecosystems.', icon: 'mountain' },
    { title: 'Urban mobility plans', description: 'Some cities invest in cleaner transit systems.', icon: 'compass' },
  ],
  pe: [
    { title: 'Amazon guardianship', description: 'Peru protects rainforest biodiversity and indigenous lands.', icon: 'nature' },
    { title: 'Andes water systems', description: 'Mountain glacier and watershed projects support communities.', icon: 'water' },
    { title: 'Terrace farming', description: 'Ancient terrace methods help reduce erosion.', icon: 'mountain' },
    { title: 'Protected reserves', description: 'National reserves protect rare species and habitats.', icon: 'leaf' },
    { title: 'Community tourism', description: 'Local guides help protect places while teaching visitors.', icon: 'compass' },
  ],
  ke: [
    { title: 'Wildlife conservancies', description: 'Community conservancies protect elephants and big cats.', icon: 'nature' },
    { title: 'Anti-poaching programs', description: 'Rangers and tech are used to protect wildlife.', icon: 'leaf' },
    { title: 'Geothermal energy', description: 'Kenya generates large renewable power from geothermal heat.', icon: 'globe' },
    { title: 'Savanna protection', description: 'Grassland ecosystems are managed for biodiversity.', icon: 'mountain' },
    { title: 'Plastic bag ban', description: 'Strong plastic policies help reduce litter.', icon: 'water' },
  ],
  no: [
    { title: 'Hydropower nation', description: 'Most electricity comes from renewable hydropower.', icon: 'water' },
    { title: 'Electric transport', description: 'Norway leads in electric car adoption.', icon: 'globe' },
    { title: 'Fjord protection', description: 'Fjord ecosystems are monitored and protected.', icon: 'nature' },
    { title: 'Circular recycling', description: 'Recycling and reuse programs are widely practiced.', icon: 'leaf' },
    { title: 'Outdoor stewardship', description: 'Leave-no-trace culture protects trails and parks.', icon: 'compass' },
  ],
  tr: [
    { title: 'Wetland reserves', description: 'Important bird habitats are protected in wetlands.', icon: 'water' },
    { title: 'Forest restoration', description: 'Tree planting projects help restore ecosystems.', icon: 'leaf' },
    { title: 'Historic preservation', description: 'Preserving old buildings reduces new material use.', icon: 'landmark' },
    { title: 'Renewable growth', description: 'Solar and wind projects continue to expand.', icon: 'globe' },
    { title: 'Sustainable farming', description: 'Local produce and traditional farming support resilience.', icon: 'food' },
  ],
  gr: [
    { title: 'Island marine parks', description: 'Marine reserves protect sea turtles and coastlines.', icon: 'water' },
    { title: 'Solar sunlight advantage', description: 'Sunny climates support renewable solar energy.', icon: 'globe' },
    { title: 'Olive landscape care', description: 'Traditional groves are managed across generations.', icon: 'leaf' },
    { title: 'Wildfire resilience', description: 'Communities improve planning and prevention practices.', icon: 'fire' },
    { title: 'Eco island tourism', description: 'Many islands promote low-impact travel choices.', icon: 'compass' },
  ],
};

const COUNTRY_HISTORY: Record<string, HistoryEntry[]> = {
  jp: [
    { title: 'Nara period temples', description: 'Early capitals built temples and cultural institutions.', year: '700s', icon: 'history' },
    { title: 'Samurai era', description: 'Samurai traditions shaped Japanese society for centuries.', year: '1100-1800', icon: 'history' },
    { title: 'Meiji modernization', description: 'Japan modernized rapidly and built major rail systems.', year: '1868+', icon: 'globe' },
    { title: 'Postwar rebuilding', description: 'Cities rebuilt and became global innovation centers.', year: '1945+', icon: 'landmark' },
    { title: 'High-speed rail', description: 'The Shinkansen changed travel with very fast trains.', year: '1964', icon: 'compass' },
  ],
  fr: [
    { title: 'Medieval cathedrals', description: 'France built famous Gothic cathedrals over centuries.', year: '1100s+', icon: 'temple' },
    { title: 'French Revolution', description: 'Major political changes reshaped rights and government.', year: '1789', icon: 'history' },
    { title: 'Eiffel Tower opening', description: 'The tower became a symbol of Paris and innovation.', year: '1889', icon: 'landmark' },
    { title: 'Art movements', description: 'French artists helped lead impressionism and modern art.', year: '1800-1900s', icon: 'art' },
    { title: 'European cooperation', description: 'France became a key country in European partnerships.', year: '1900s+', icon: 'globe' },
  ],
  mx: [
    { title: 'Maya civilizations', description: 'Maya cities developed astronomy and architecture.', year: 'Ancient era', icon: 'history' },
    { title: 'Aztec capital', description: 'Tenochtitlan was a major city built on a lake.', year: '1300s-1500s', icon: 'landmark' },
    { title: 'Independence movement', description: 'Mexico gained independence after a long struggle.', year: '1810-1821', icon: 'history' },
    { title: 'Cultural blending', description: 'Indigenous and Spanish influences shaped modern culture.', year: '1500s+', icon: 'culture' },
    { title: 'UNESCO heritage sites', description: 'Mexico protects many major historic places.', year: 'Modern era', icon: 'monument' },
  ],
  it: [
    { title: 'Roman Empire', description: 'Rome became one of the largest empires in history.', year: 'Ancient era', icon: 'history' },
    { title: 'Colosseum era', description: 'The Colosseum hosted major public events in Rome.', year: '80 CE', icon: 'landmark' },
    { title: 'Renaissance brilliance', description: 'Artists and thinkers transformed science and art.', year: '1400-1600s', icon: 'art' },
    { title: 'Italian unification', description: 'Different states united into modern Italy.', year: '1861', icon: 'globe' },
    { title: 'Modern design culture', description: 'Italy became known for architecture and design.', year: '1900s+', icon: 'culture' },
  ],
  gb: [
    { title: 'Medieval castles', description: 'Castles and abbeys shaped early British history.', year: '1000s+', icon: 'monument' },
    { title: 'Magna Carta', description: 'Early legal ideas about rights were recorded.', year: '1215', icon: 'book' },
    { title: 'Industrial Revolution', description: 'Factories and railways changed global industry.', year: '1700-1800s', icon: 'globe' },
    { title: 'Scientific pioneers', description: 'Many major scientific discoveries came from the UK.', year: '1600s+', icon: 'history' },
    { title: 'Cultural exports', description: 'Music, literature, and sport spread worldwide.', year: '1900s+', icon: 'music' },
  ],
  br: [
    { title: 'Indigenous roots', description: 'Many Indigenous nations shaped Brazil long before colonization.', year: 'Ancient era', icon: 'history' },
    { title: 'Portuguese language', description: 'Portuguese became Brazil\'s primary language.', year: '1500s+', icon: 'language' },
    { title: 'Independence', description: 'Brazil became independent and developed as a nation.', year: '1822', icon: 'globe' },
    { title: 'Cultural fusion', description: 'African, Indigenous, and European traditions blended.', year: '1800s+', icon: 'culture' },
    { title: 'Modern megacities', description: 'Cities like Sao Paulo became major global centers.', year: '1900s+', icon: 'landmark' },
  ],
  kr: [
    { title: 'Ancient kingdoms', description: 'Early Korean kingdoms developed art and science.', year: 'Ancient era', icon: 'history' },
    { title: 'Hangul invention', description: 'A writing system was designed for easier literacy.', year: '1443', icon: 'book' },
    { title: 'Joseon traditions', description: 'Long Joseon-era customs shaped family and culture.', year: '1392-1897', icon: 'culture' },
    { title: 'Postwar growth', description: 'Rapid rebuilding turned Korea into a tech leader.', year: '1950s+', icon: 'globe' },
    { title: 'Global pop culture', description: 'K-pop and film became major global influences.', year: '2000s+', icon: 'music' },
  ],
  th: [
    { title: 'Sukhothai roots', description: 'Early Thai kingdoms developed language and arts.', year: '1200s+', icon: 'history' },
    { title: 'Ayutthaya era', description: 'A major regional capital traded with many countries.', year: '1300-1700s', icon: 'landmark' },
    { title: 'Bangkok as capital', description: 'Bangkok grew into the modern national capital.', year: '1782+', icon: 'globe' },
    { title: 'Thai identity', description: 'Thailand remained independent through colonial eras.', year: '1800-1900s', icon: 'history' },
    { title: 'Modern tourism', description: 'Cultural and natural attractions draw global visitors.', year: '1900s+', icon: 'compass' },
  ],
  ma: [
    { title: 'Amazigh heritage', description: 'Amazigh cultures shaped Morocco across millennia.', year: 'Ancient era', icon: 'history' },
    { title: 'Imperial cities', description: 'Fez and Marrakech became major learning centers.', year: '800s+', icon: 'landmark' },
    { title: 'Andalusian influence', description: 'Art and architecture blended across regions.', year: 'Medieval era', icon: 'art' },
    { title: 'Modern independence', description: 'Morocco became independent in the 20th century.', year: '1956', icon: 'globe' },
    { title: 'Living crafts', description: 'Traditional crafts remain central to local identity.', year: 'Ongoing', icon: 'culture' },
  ],
  pe: [
    { title: 'Caral civilization', description: 'One of the oldest cities in the Americas is in Peru.', year: '3000 BCE+', icon: 'history' },
    { title: 'Inca roads', description: 'The Inca built massive mountain road networks.', year: '1400s', icon: 'compass' },
    { title: 'Machu Picchu', description: 'A high mountain city became a world icon.', year: '1400s', icon: 'landmark' },
    { title: 'Independence', description: 'Peru gained independence in the 19th century.', year: '1821', icon: 'globe' },
    { title: 'Cultural continuity', description: 'Quechua and Andean traditions remain strong today.', year: 'Ongoing', icon: 'culture' },
  ],
  ke: [
    { title: 'Ancient trade coast', description: 'Swahili coast cities linked Africa and Asia by trade.', year: 'Ancient-medieval', icon: 'history' },
    { title: 'Community traditions', description: 'Many ethnic groups preserve oral history and culture.', year: 'Ongoing', icon: 'culture' },
    { title: 'Independence', description: 'Kenya became independent in the 20th century.', year: '1963', icon: 'globe' },
    { title: 'Conservation legacy', description: 'National parks became central to wildlife protection.', year: '1900s+', icon: 'nature' },
    { title: 'Global athletics', description: 'Kenyan runners became world leaders in distance racing.', year: '1900s+', icon: 'star' },
  ],
  no: [
    { title: 'Viking voyages', description: 'Norse sailors explored wide Atlantic routes.', year: '800-1100', icon: 'history' },
    { title: 'Stave churches', description: 'Unique wooden churches remain from medieval times.', year: '1100s+', icon: 'temple' },
    { title: 'Union history', description: 'Norway experienced unions before modern independence.', year: '1300-1905', icon: 'globe' },
    { title: 'Modern welfare state', description: 'Public systems expanded through the 20th century.', year: '1900s+', icon: 'book' },
    { title: 'Ocean exploration', description: 'Maritime culture remains central in Norway.', year: 'Ongoing', icon: 'water' },
  ],
  tr: [
    { title: 'Ancient Anatolia', description: 'Many ancient civilizations lived in Anatolia.', year: 'Ancient era', icon: 'history' },
    { title: 'Byzantine legacy', description: 'Istanbul was a major Byzantine center.', year: '300-1400s', icon: 'landmark' },
    { title: 'Ottoman era', description: 'The Ottoman Empire influenced three continents.', year: '1300-1900s', icon: 'globe' },
    { title: 'Modern republic', description: 'Turkey became a republic in the 20th century.', year: '1923', icon: 'book' },
    { title: 'Crossroads culture', description: 'Turkey blends traditions from Europe and Asia.', year: 'Ongoing', icon: 'culture' },
  ],
  gr: [
    { title: 'Ancient city-states', description: 'Athens and other city-states shaped democracy ideas.', year: 'Ancient era', icon: 'history' },
    { title: 'Olympic origins', description: 'The first Olympics were held in ancient Greece.', year: '776 BCE', icon: 'star' },
    { title: 'Philosophy roots', description: 'Classical thinkers influenced global education.', year: '500s BCE+', icon: 'book' },
    { title: 'Byzantine continuity', description: 'Greek culture continued through Byzantine centuries.', year: '300-1400s', icon: 'temple' },
    { title: 'Modern heritage', description: 'Greece preserves major archaeological landmarks.', year: 'Modern era', icon: 'landmark' },
  ],
};

const COUNTRY_CULTURE: Record<string, CultureEntry[]> = {
  jp: [
    { title: 'Hanami', description: 'Cherry blossom viewing is a beloved spring tradition.', icon: 'culture' },
    { title: 'Tea ceremony', description: 'Tea rituals teach calm, respect, and focus.', icon: 'food' },
    { title: 'Anime and manga', description: 'Japan has a global influence on storytelling arts.', icon: 'art' },
    { title: 'Matsuri festivals', description: 'Seasonal festivals include music and parades.', icon: 'music' },
    { title: 'Craft traditions', description: 'Paper, pottery, and textile crafts are highly valued.', icon: 'sparkles' },
  ],
  fr: [
    { title: 'Cafe life', description: 'Cafes are social spaces for conversation and ideas.', icon: 'food' },
    { title: 'Art museums', description: 'France preserves world-famous art collections.', icon: 'art' },
    { title: 'Bastille Day', description: 'National celebrations include parades and fireworks.', icon: 'sparkles' },
    { title: 'Film culture', description: 'French cinema helped shape modern filmmaking.', icon: 'music' },
    { title: 'Regional traditions', description: 'Different regions keep unique customs and foods.', icon: 'culture' },
  ],
  mx: [
    { title: 'Day of the Dead', description: 'Families celebrate memory with vibrant altars.', icon: 'culture' },
    { title: 'Mariachi music', description: 'Mariachi bands are important in celebrations.', icon: 'music' },
    { title: 'Colorful crafts', description: 'Textiles, papel picado, and pottery are iconic arts.', icon: 'art' },
    { title: 'Food heritage', description: 'Corn-based dishes connect modern and ancient traditions.', icon: 'food' },
    { title: 'Community festivals', description: 'Town festivals unite music, dance, and history.', icon: 'sparkles' },
  ],
  it: [
    { title: 'Family meals', description: 'Meals are often long and shared with loved ones.', icon: 'food' },
    { title: 'Opera and music', description: 'Opera has deep historical roots in Italy.', icon: 'music' },
    { title: 'Renaissance art', description: 'Italian cities preserve major artworks and architecture.', icon: 'art' },
    { title: 'Regional festivals', description: 'Local festivals celebrate saints and harvests.', icon: 'culture' },
    { title: 'Craft excellence', description: 'Fashion, glass, and design are important traditions.', icon: 'sparkles' },
  ],
  gb: [
    { title: 'Tea traditions', description: 'Tea time is a classic social custom.', icon: 'food' },
    { title: 'Literary heritage', description: 'British literature is taught around the world.', icon: 'book' },
    { title: 'Royal ceremonies', description: 'Historic ceremonies remain part of public life.', icon: 'monument' },
    { title: 'Football culture', description: 'Football is a major part of community identity.', icon: 'star' },
    { title: 'Music scenes', description: 'The UK has influenced global music for decades.', icon: 'music' },
  ],
  br: [
    { title: 'Carnival', description: 'Carnival combines samba, costumes, and street parades.', icon: 'sparkles' },
    { title: 'Capoeira', description: 'Capoeira blends movement, rhythm, and history.', icon: 'culture' },
    { title: 'Football passion', description: 'Football is central to national sports culture.', icon: 'star' },
    { title: 'Regional cuisines', description: 'Different regions have distinct dishes and ingredients.', icon: 'food' },
    { title: 'Afro-Brazilian arts', description: 'Music and dance traditions shape modern culture.', icon: 'music' },
  ],
  kr: [
    { title: 'K-pop and dance', description: 'Pop music and choreography are globally popular.', icon: 'music' },
    { title: 'Hanbok celebrations', description: 'Traditional clothing is worn on holidays.', icon: 'culture' },
    { title: 'K-food culture', description: 'Shared dishes and side plates are common at meals.', icon: 'food' },
    { title: 'E-sports scene', description: 'Gaming and e-sports are major youth cultures.', icon: 'star' },
    { title: 'K-drama storytelling', description: 'K-dramas are watched by audiences worldwide.', icon: 'art' },
  ],
  th: [
    { title: 'Songkran', description: 'Thai New Year includes community water celebrations.', icon: 'water' },
    { title: 'Temple festivals', description: 'Many festivals include merit-making and parades.', icon: 'temple' },
    { title: 'Street food culture', description: 'Street markets are important social food spaces.', icon: 'food' },
    { title: 'Classical dance', description: 'Traditional dance uses elegant hand and body motions.', icon: 'art' },
    { title: 'Craft markets', description: 'Silk and craft traditions continue across regions.', icon: 'culture' },
  ],
  ma: [
    { title: 'Medina markets', description: 'Old city markets blend crafts, spices, and music.', icon: 'culture' },
    { title: 'Zellige patterns', description: 'Geometric tile art is a hallmark of architecture.', icon: 'art' },
    { title: 'Mint tea ritual', description: 'Tea service is central to hospitality.', icon: 'food' },
    { title: 'Berber traditions', description: 'Amazigh music and weaving remain vibrant.', icon: 'music' },
    { title: 'Festival heritage', description: 'Cultural festivals celebrate poetry, music, and history.', icon: 'sparkles' },
  ],
  pe: [
    { title: 'Andean textiles', description: 'Traditional weaving patterns carry local stories.', icon: 'art' },
    { title: 'Inca legacy', description: 'Architecture and trails reflect long traditions.', icon: 'landmark' },
    { title: 'Culinary fusion', description: 'Peruvian cuisine blends coastal and mountain influences.', icon: 'food' },
    { title: 'Music and dance', description: 'Regional dances use colorful clothing and instruments.', icon: 'music' },
    { title: 'Indigenous languages', description: 'Quechua remains important in many communities.', icon: 'book' },
  ],
  ke: [
    { title: 'Maasai beadwork', description: 'Colorful bead designs carry social meaning.', icon: 'art' },
    { title: 'Swahili coast culture', description: 'Coastal culture blends African and ocean trade history.', icon: 'culture' },
    { title: 'Storytelling traditions', description: 'Oral storytelling is a valued learning tool.', icon: 'book' },
    { title: 'Music and dance', description: 'Percussion and dance are key in celebrations.', icon: 'music' },
    { title: 'Shared meals', description: 'Community meals are part of social life.', icon: 'food' },
  ],
  no: [
    { title: 'Friluftsliv', description: 'Open-air living is a core cultural value.', icon: 'mountain' },
    { title: 'Folk tales', description: 'Stories of trolls and heroes are widely known.', icon: 'sparkles' },
    { title: 'Winter sports', description: 'Skiing traditions are important in many communities.', icon: 'star' },
    { title: 'Coastal heritage', description: 'Fishing and maritime life shaped culture.', icon: 'water' },
    { title: 'Nordic design', description: 'Simple functional design influences homes and art.', icon: 'art' },
  ],
  tr: [
    { title: 'Grand Bazaar culture', description: 'Markets are social hubs full of crafts and trade.', icon: 'culture' },
    { title: 'Whirling dervishes', description: 'Sema ceremonies blend music and spiritual movement.', icon: 'music' },
    { title: 'Tea and breakfast', description: 'Large breakfasts and tea are central daily rituals.', icon: 'food' },
    { title: 'Carpet arts', description: 'Regional carpet patterns preserve symbols and stories.', icon: 'art' },
    { title: 'Bridge of continents', description: 'Life reflects influences from Europe and Asia.', icon: 'globe' },
  ],
  gr: [
    { title: 'Island festivals', description: 'Local island feasts include music and dance.', icon: 'music' },
    { title: 'Greek cuisine', description: 'Olive oil, vegetables, fish, and cheese are staples.', icon: 'food' },
    { title: 'Theater roots', description: 'Ancient theater traditions still influence performance arts.', icon: 'art' },
    { title: 'Orthodox traditions', description: 'Religious holidays shape annual community life.', icon: 'temple' },
    { title: 'Hospitality values', description: 'Philoxenia means welcoming guests with generosity.', icon: 'heart' },
  ],
};

function toGreetings(countryId: string): GreetingEntry[] {
  return getPhrasesForCountry(countryId)
    .filter((p) => ['greeting', 'thanks', 'polite'].includes(p.category))
    .slice(0, 5)
    .map((p) => ({
      phrase: p.phrase,
      pronunciation: p.pronunciation,
      meaning: p.translation,
      context: p.category === 'greeting' ? 'Use for hello or goodbye in everyday settings.' : p.category === 'thanks' ? 'Use to show gratitude.' : 'Use for respectful requests.',
    }));
}

function toLanguageWords(countryId: string): LanguageWordEntry[] {
  return getPhrasesForCountry(countryId)
    .slice(0, 5)
    .map((p) => ({
      word: p.phrase,
      meaning: p.translation,
      usage: `Common ${p.category} phrase used in daily conversation.`,
    }));
}

function toLandmarks(countryId: string): LandmarkEntry[] {
  return getCountryLocations(countryId).slice(0, 5).map((loc) => ({
    name: loc.name,
    description: loc.description,
    funFact: `Exploring this place can earn ${loc.learningPoints} learning points in the app.`,
    imageUrl: loc.imageUrl,
  }));
}

function toFood(countryId: string): FoodEntry[] {
  return getDishesByCountry(countryId).slice(0, 5).map((dish) => ({
    name: dish.name,
    description: dish.culturalSignificance,
    ingredients: dish.keyIngredients,
    funFact: dish.funFact,
  }));
}

function toMyths(countryId: string): MythEntry[] {
  return getMythsForCountry(countryId).slice(0, 3).map((myth) => ({
    title: myth.title,
    story: myth.story[0] ?? 'A famous story passed through generations.',
    icon: 'sparkles',
  }));
}

function withFallbacks(countryId: string): CountryKnowledge {
  const greetings = toGreetings(countryId);
  const language = toLanguageWords(countryId);
  const landmarks = toLandmarks(countryId);
  const food = toFood(countryId);
  const myths = toMyths(countryId);

  return {
    countryId,
    greetings,
    manners: COUNTRY_MANNERS[countryId] ?? [],
    sustainability: COUNTRY_SUSTAINABILITY[countryId] ?? [],
    myths: myths.length > 0 ? myths : [
      { title: 'Local legend', story: 'Every region has oral stories that teach values and history.', icon: 'sparkles' },
      { title: 'Hero tale', story: 'Heroes and clever characters appear in many traditional stories.', icon: 'book' },
      { title: 'Nature spirit tale', story: 'Many stories explain mountains, rivers, and skies through myth.', icon: 'nature' },
    ],
    landmarks: landmarks.length > 0 ? landmarks : [],
    food: food.length > 0 ? food : [],
    history: COUNTRY_HISTORY[countryId] ?? [],
    culture: COUNTRY_CULTURE[countryId] ?? [],
    language,
  };
}

export const COUNTRY_KNOWLEDGE: Record<string, CountryKnowledge> = CORE_COUNTRIES.reduce<Record<string, CountryKnowledge>>((acc, countryId) => {
  acc[countryId] = withFallbacks(countryId);
  return acc;
}, {});

export function getCountryKnowledge(countryId: string): CountryKnowledge | null {
  return COUNTRY_KNOWLEDGE[countryId] ?? null;
}

export function getCountryGreetings(countryId: string): GreetingEntry[] {
  return getCountryKnowledge(countryId)?.greetings ?? [];
}

export function getCountryManners(countryId: string): MannerEntry[] {
  return getCountryKnowledge(countryId)?.manners ?? [];
}

export function getCountrySustainability(countryId: string): SustainabilityEntry[] {
  return getCountryKnowledge(countryId)?.sustainability ?? [];
}

export function getCountryMyths(countryId: string): MythEntry[] {
  return getCountryKnowledge(countryId)?.myths ?? [];
}

export function getCountryLandmarks(countryId: string): LandmarkEntry[] {
  return getCountryKnowledge(countryId)?.landmarks ?? [];
}

export function getCountryFoodHighlights(countryId: string): FoodEntry[] {
  return getCountryKnowledge(countryId)?.food ?? [];
}

export function getCountryHistory(countryId: string): HistoryEntry[] {
  return getCountryKnowledge(countryId)?.history ?? [];
}

export function getCountryCulture(countryId: string): CultureEntry[] {
  return getCountryKnowledge(countryId)?.culture ?? [];
}

export function getCountryLanguageWords(countryId: string): LanguageWordEntry[] {
  return getCountryKnowledge(countryId)?.language ?? [];
}
