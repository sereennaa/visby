export interface RoomObject {
  id: string;
  icon: string;
  label: string;
  x: number; // percentage 0-100 horizontal position
  y: number; // percentage 0-100 vertical position (0=top)
  interactive?: boolean;
  learnTitle?: string;
  learnContent?: string;
  auraReward?: number;
  /** Optional image URL for treasure hunt reveal (e.g. real photo of the object) */
  imageUrl?: string;
}

export interface HouseRoom {
  id: string;
  name: string;
  icon: string;
  wallColor: string;
  floorColor: string;
  objects: RoomObject[];
  /** Optional background image for treasure hunt room stage (subtle, behind wall) */
  roomImageUrl?: string;
}

export interface CountryHouseData {
  rooms: HouseRoom[];
}

export const COUNTRY_HOUSES: Record<string, CountryHouseData> = {
  jp: {
    rooms: [
      {
        id: 'jp_living', name: 'Tatami Room', icon: 'temple',
        wallColor: '#FFF8F0', floorColor: '#D4C5A0',
        roomImageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
        objects: [
          { id: 'jp_l1', icon: 'culture', label: 'Paper Fan', x: 15, y: 25 },
          { id: 'jp_l2', icon: 'culture', label: 'Hina Dolls', x: 75, y: 20, interactive: true, learnTitle: 'Hina Dolls', learnContent: "These dolls are displayed during Hinamatsuri (Girls' Day) on March 3rd. Each doll represents a member of the imperial court — families pass them down for generations!", auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1580309237429-66190167e2b6?w=800' },
          { id: 'jp_l3', icon: 'cafe', label: 'Tea Set', x: 45, y: 55, interactive: true, learnTitle: 'Japanese Tea Ceremony', learnContent: 'The Japanese tea ceremony (Chadō) is an art form hundreds of years old. Every movement — from holding the bowl to sipping — has meaning. It teaches patience and respect.', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800' },
          { id: 'jp_l4', icon: 'home', label: 'Kotatsu Table', x: 50, y: 70 },
          { id: 'jp_l5', icon: 'culture', label: 'Scroll Painting', x: 85, y: 15 },
        ],
      },
      {
        id: 'jp_kitchen', name: 'Kitchen', icon: 'food',
        wallColor: '#FFF5F5', floorColor: '#C9B99A',
        roomImageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        objects: [
          { id: 'jp_k1', icon: 'food', label: 'Sushi Plate', x: 30, y: 45, interactive: true, learnTitle: 'Sushi', learnContent: 'Real sushi is made with vinegared rice and fresh fish. In Japan, sushi chefs train for years — some spend 3 years just learning to cook rice properly!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800' },
          { id: 'jp_k2', icon: 'food', label: 'Ramen Bowl', x: 65, y: 50, interactive: true, learnTitle: 'Ramen', learnContent: 'Ramen comes in many styles: tonkotsu (pork bone), miso, shio (salt), and shoyu (soy sauce). Each region of Japan has its own special recipe!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a2853994fc7?w=800' },
          { id: 'jp_k3', icon: 'food', label: 'Chopsticks', x: 50, y: 65 },
          { id: 'jp_k4', icon: 'cafe', label: 'Teapot', x: 15, y: 30 },
          { id: 'jp_k5', icon: 'food', label: 'Dango', x: 80, y: 35, interactive: true, learnTitle: 'Dango', learnContent: 'Dango are sweet rice dumplings on a stick, often colored pink, white, and green. They\'re eaten during hanami (cherry blossom viewing) season!', auraReward: 8 },
        ],
      },
      {
        id: 'jp_garden', name: 'Zen Garden', icon: 'nature',
        wallColor: '#F0FFF0', floorColor: '#A8C8A0',
        objects: [
          { id: 'jp_g1', icon: 'nature', label: 'Cherry Tree', x: 20, y: 15, interactive: true, learnTitle: 'Sakura', learnContent: 'Cherry blossoms (sakura) bloom for just 1-2 weeks each spring. Japanese people celebrate with picnics under the trees — it reminds them that beautiful things are precious because they don\'t last forever.', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800' },
          { id: 'jp_g2', icon: 'temple', label: 'Torii Gate', x: 75, y: 20, interactive: true, learnTitle: 'Torii Gates', learnContent: 'These red gates mark the entrance to Shinto shrines. Fushimi Inari in Kyoto has over 10,000 of them forming a tunnel path up a mountain!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' },
          { id: 'jp_g3', icon: 'nature', label: 'Rock Garden', x: 50, y: 60 },
          { id: 'jp_g4', icon: 'nature', label: 'Koi Pond', x: 35, y: 75, interactive: true, learnTitle: 'Koi Fish', learnContent: 'Koi fish can live over 100 years! In Japanese culture, they represent perseverance — legend says a koi that swims upstream becomes a dragon.', auraReward: 8 },
          { id: 'jp_g5', icon: 'nature', label: 'Bamboo', x: 90, y: 40 },
        ],
      },
      {
        id: 'jp_study', name: 'Study Room', icon: 'book',
        wallColor: '#F8F0FF', floorColor: '#C8B8A0',
        objects: [
          { id: 'jp_s1', icon: 'book', label: 'Manga Collection', x: 20, y: 25, interactive: true, learnTitle: 'Manga', learnContent: 'Manga (Japanese comics) are read right-to-left. Japan publishes billions of manga volumes per year — they cover every topic from cooking to space travel!', auraReward: 8 },
          { id: 'jp_s2', icon: 'edit', label: 'Calligraphy Set', x: 70, y: 30, interactive: true, learnTitle: 'Japanese Writing', learnContent: 'Japanese uses three writing systems: Hiragana, Katakana, and Kanji. Kids learn all three in school — Kanji alone has thousands of characters borrowed from Chinese!', auraReward: 8 },
          { id: 'jp_s3', icon: 'star', label: 'Game Console', x: 45, y: 55 },
          { id: 'jp_s4', icon: 'culture', label: 'Origami Paper', x: 80, y: 65 },
          { id: 'jp_s5', icon: 'map', label: 'Map of Japan', x: 50, y: 15 },
        ],
      },
    ],
  },
  fr: {
    rooms: [
      {
        id: 'fr_living', name: 'Le Salon', icon: 'home',
        wallColor: '#FFF8F0', floorColor: '#C8A882',
        roomImageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
        objects: [
          { id: 'fr_l1', icon: 'landmark', label: 'Eiffel Tower Model', x: 20, y: 20, interactive: true, learnTitle: 'Eiffel Tower', learnContent: "The Eiffel Tower was built in 1889 and was supposed to be temporary! It's 330 meters tall and gets repainted every 7 years — it takes 60 tons of paint.", auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800' },
          { id: 'fr_l2', icon: 'culture', label: 'Painting', x: 75, y: 15, interactive: true, learnTitle: 'French Art', learnContent: 'France is home to the Louvre, the world\'s largest museum. It would take 200 days to spend 30 seconds looking at each piece of art!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800' },
          { id: 'fr_l3', icon: 'star', label: 'Chandelier', x: 50, y: 10 },
          { id: 'fr_l4', icon: 'book', label: 'Bookshelf', x: 85, y: 45 },
          { id: 'fr_l5', icon: 'nature', label: 'Roses', x: 15, y: 55 },
        ],
      },
      {
        id: 'fr_kitchen', name: 'La Cuisine', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#D4C0A0',
        objects: [
          { id: 'fr_k1', icon: 'food', label: 'Croissants', x: 30, y: 40, interactive: true, learnTitle: 'Croissants', learnContent: 'A perfect croissant has 27 flaky layers! French bakers wake up at 3am to make them fresh. The word "croissant" means "crescent" because of its moon shape.', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800' },
          { id: 'fr_k2', icon: 'food', label: 'Cheese Board', x: 65, y: 45, interactive: true, learnTitle: 'French Cheese', learnContent: 'France makes over 1,600 types of cheese! Charles de Gaulle once said "How can you govern a country that has 246 varieties of cheese?" — and that was an undercount!', auraReward: 8 },
          { id: 'fr_k3', icon: 'food', label: 'Baguettes', x: 15, y: 30, interactive: true, learnTitle: 'Baguettes', learnContent: 'French law says a traditional baguette can only contain flour, water, salt, and yeast. France sells 10 billion baguettes per year — that\'s 320 per second!', auraReward: 8 },
          { id: 'fr_k4', icon: 'cafe', label: 'Grape Juice', x: 80, y: 30 },
          { id: 'fr_k5', icon: 'food', label: 'Pâtisserie', x: 50, y: 65 },
        ],
      },
      {
        id: 'fr_garden', name: 'Le Jardin', icon: 'nature',
        wallColor: '#F0FFF8', floorColor: '#90C890',
        objects: [
          { id: 'fr_g1', icon: 'nature', label: 'Sunflowers', x: 20, y: 25, interactive: true, learnTitle: 'Provence', learnContent: 'The south of France (Provence) is famous for lavender and sunflower fields. Van Gogh painted his famous Sunflowers while living there!', auraReward: 8 },
          { id: 'fr_g2', icon: 'monument', label: 'Fountain', x: 50, y: 50 },
          { id: 'fr_g3', icon: 'nature', label: 'Butterflies', x: 75, y: 30 },
          { id: 'fr_g4', icon: 'nature', label: 'Lavender', x: 35, y: 70, interactive: true, learnTitle: 'Lavender Fields', learnContent: 'Lavender fields in Provence turn the landscape purple every June-August. The scent is used in perfumes — France is the perfume capital of the world!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800' },
          { id: 'fr_g5', icon: 'nature', label: 'Le Coq', x: 85, y: 60, interactive: true, learnTitle: 'The French Rooster', learnContent: 'The rooster (le coq) is France\'s national animal! It became the symbol because the Latin word for rooster (gallus) sounds like Gaul, the ancient name for France.', auraReward: 8 },
        ],
      },
      {
        id: 'fr_study', name: "La Bibliothèque", icon: 'book',
        wallColor: '#F5F0FF', floorColor: '#B8A888',
        objects: [
          { id: 'fr_s1', icon: 'history', label: 'Declaration', x: 25, y: 20, interactive: true, learnTitle: 'French Revolution', learnContent: 'The French Revolution in 1789 changed the world! The motto "Liberté, Égalité, Fraternité" (Freedom, Equality, Brotherhood) became France\'s guiding principle.', auraReward: 8 },
          { id: 'fr_s2', icon: 'map', label: 'Map', x: 70, y: 25 },
          { id: 'fr_s3', icon: 'edit', label: 'Quill Pen', x: 45, y: 50, interactive: true, learnTitle: 'French Literature', learnContent: 'The Little Prince by Antoine de Saint-Exupéry is one of the most translated books ever. It looks like a children\'s book but teaches deep lessons about life and love.', auraReward: 8 },
          { id: 'fr_s4', icon: 'culture', label: 'Theater Masks', x: 80, y: 55 },
          { id: 'fr_s5', icon: 'castle', label: 'Castle Model', x: 15, y: 60, interactive: true, learnTitle: 'Châteaux', learnContent: 'The Loire Valley has over 300 castles! Château de Chambord has 440 rooms, 365 fireplaces, and 84 staircases. King Francis I built it as a hunting lodge!', auraReward: 8 },
        ],
      },
    ],
  },
  mx: {
    rooms: [
      {
        id: 'mx_living', name: 'Sala', icon: 'home',
        wallColor: '#FFF5E8', floorColor: '#D4A870',
        roomImageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800',
        objects: [
          { id: 'mx_l1', icon: 'gift', label: 'Piñata', x: 50, y: 15, interactive: true, learnTitle: 'Piñatas', learnContent: 'Piñatas originated in Mexico for religious celebrations. The traditional star-shaped one has 7 points representing the seven deadly sins — breaking it represents overcoming them!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
          { id: 'mx_l2', icon: 'culture', label: 'Guitar', x: 15, y: 35, interactive: true, learnTitle: 'Mariachi Music', learnContent: 'Mariachi bands wear trajes de charro (fancy suits) and play trumpets, violins, and guitars. UNESCO declared mariachi music an important cultural treasure!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800' },
          { id: 'mx_l3', icon: 'culture', label: 'Alebrije', x: 75, y: 40, interactive: true, learnTitle: 'Alebrijes', learnContent: 'Alebrijes are brightly colored fantasy creatures made of paper-mâché or carved wood. They were invented by Pedro Linares in 1936 during a fever dream!', auraReward: 8 },
          { id: 'mx_l4', icon: 'nature', label: 'Cactus', x: 85, y: 60 },
          { id: 'mx_l5', icon: 'culture', label: 'Frida Painting', x: 30, y: 20 },
        ],
      },
      {
        id: 'mx_kitchen', name: 'Cocina', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C8A870',
        objects: [
          { id: 'mx_k1', icon: 'food', label: 'Tacos', x: 35, y: 45, interactive: true, learnTitle: 'Tacos', learnContent: 'Tacos have been eaten in Mexico for thousands of years! There are over 20 types: al pastor (pork), carnitas, barbacoa, and many more. Each region has its specialty.', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c6a14769?w=800' },
          { id: 'mx_k2', icon: 'food', label: 'Guacamole', x: 65, y: 40, interactive: true, learnTitle: 'Guacamole', learnContent: 'The word "guacamole" comes from the Aztec word "ahuacamolli" (avocado sauce). Mexico produces more avocados than any other country!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
          { id: 'mx_k3', icon: 'food', label: 'Chili Peppers', x: 20, y: 30 },
          { id: 'mx_k4', icon: 'food', label: 'Chocolate', x: 80, y: 50, interactive: true, learnTitle: 'Mexican Chocolate', learnContent: 'Mexico invented chocolate! The Aztecs made a bitter cacao drink called "xocolatl." Hot chocolate in Mexico is made with cinnamon and whipped until frothy.', auraReward: 8 },
          { id: 'mx_k5', icon: 'food', label: 'Tamales', x: 50, y: 65 },
        ],
      },
      {
        id: 'mx_courtyard', name: 'Patio', icon: 'nature',
        wallColor: '#FFF0F0', floorColor: '#D4A068',
        objects: [
          { id: 'mx_c1', icon: 'nature', label: 'Bougainvillea', x: 15, y: 20 },
          { id: 'mx_c2', icon: 'monument', label: 'Fountain', x: 50, y: 45 },
          { id: 'mx_c3', icon: 'nature', label: 'Parrot', x: 75, y: 25, interactive: true, learnTitle: 'Mexican Wildlife', learnContent: 'Mexico is one of the most biodiverse countries on Earth! It has jaguars, quetzal birds, axolotls, and monarch butterflies that migrate 4,000 km from Canada each year.', auraReward: 8 },
          { id: 'mx_c4', icon: 'culture', label: 'Sugar Skull', x: 30, y: 60, interactive: true, learnTitle: 'Día de los Muertos', learnContent: "Day of the Dead isn't scary — it's a celebration! Families build altars (ofrendas) with photos, marigolds, and favorite foods to honor loved ones who've passed.", auraReward: 8 },
          { id: 'mx_c5', icon: 'culture', label: 'Mask', x: 85, y: 55 },
        ],
      },
      {
        id: 'mx_study', name: 'Estudio', icon: 'book',
        wallColor: '#F8F0FF', floorColor: '#C0A080',
        objects: [
          { id: 'mx_s1', icon: 'landmark', label: 'Pyramid Model', x: 25, y: 25, interactive: true, learnTitle: 'Ancient Pyramids', learnContent: 'Chichén Itzá\'s pyramid has 365 steps — one for each day of the year! During the spring equinox, shadows create a serpent slithering down the stairs.', auraReward: 8 },
          { id: 'mx_s2', icon: 'calendar', label: 'Aztec Calendar', x: 70, y: 30, interactive: true, learnTitle: 'Aztec Calendar', learnContent: 'The Aztec Sun Stone weighs 24 tons and was carved around 1502. It\'s not actually a calendar but shows how the Aztecs understood the universe and cycles of time.', auraReward: 8 },
          { id: 'mx_s3', icon: 'map', label: 'Map', x: 50, y: 15 },
          { id: 'mx_s4', icon: 'nature', label: 'Quetzal Feather', x: 15, y: 55 },
          { id: 'mx_s5', icon: 'book', label: 'Books', x: 80, y: 60 },
        ],
      },
    ],
  },
  it: {
    rooms: [
      {
        id: 'it_living', name: 'Soggiorno', icon: 'landmark',
        wallColor: '#FFFFF5', floorColor: '#D0C0A0',
        roomImageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
        objects: [
          { id: 'it_l1', icon: 'landmark', label: 'Colosseum Model', x: 20, y: 20, interactive: true, learnTitle: 'The Colosseum', learnContent: 'The Colosseum could hold 50,000 people! Romans watched gladiator battles, animal hunts, and even mock sea battles (they flooded the arena). It had a retractable roof made of sailcloth!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1552832238-c57a64f85ad4?w=800' },
          { id: 'it_l2', icon: 'culture', label: 'Venice Mask', x: 75, y: 25, interactive: true, learnTitle: 'Carnival of Venice', learnContent: 'Venice\'s Carnival has been celebrated since the 12th century. Everyone wears elaborate masks — historically, this let rich and poor celebrate together as equals!', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800' },
          { id: 'it_l3', icon: 'home', label: 'Vintage Sofa', x: 50, y: 55 },
          { id: 'it_l4', icon: 'culture', label: 'Violin', x: 85, y: 40, interactive: true, learnTitle: 'Italian Music', learnContent: 'Italy invented opera, and Stradivarius made the most famous violins ever in Cremona. Musical terms like piano, forte, and tempo are all Italian words!', auraReward: 8 },
          { id: 'it_l5', icon: 'time', label: 'Clock', x: 15, y: 35 },
        ],
      },
      {
        id: 'it_kitchen', name: 'Cucina', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C8B090',
        objects: [
          { id: 'it_k1', icon: 'food', label: 'Pizza', x: 35, y: 40, interactive: true, learnTitle: 'Pizza', learnContent: "The original pizza Margherita was made in Naples in 1889 for Queen Margherita. The red tomato, white mozzarella, and green basil represent Italy's flag colors!", auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800' },
          { id: 'it_k2', icon: 'food', label: 'Pasta', x: 65, y: 45, interactive: true, learnTitle: 'Italian Pasta', learnContent: 'Italy has over 350 shapes of pasta! Each shape is designed to hold sauce differently. Italians eat about 23 kg of pasta per person per year.', auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1f81111?w=800' },
          { id: 'it_k3', icon: 'food', label: 'Garlic', x: 20, y: 55 },
          { id: 'it_k4', icon: 'food', label: 'Olive Oil', x: 80, y: 35, interactive: true, learnTitle: 'Olive Oil', learnContent: 'Italy is the world\'s second-largest producer of olive oil. Some olive trees in Italy are over 1,000 years old and still producing olives!', auraReward: 8 },
          { id: 'it_k5', icon: 'food', label: 'Gelato', x: 50, y: 65 },
        ],
      },
      {
        id: 'it_terrace', name: 'Terrazza', icon: 'beach',
        wallColor: '#F0F8FF', floorColor: '#C8B8A8',
        objects: [
          { id: 'it_t1', icon: 'beach', label: 'Sunset View', x: 50, y: 15 },
          { id: 'it_t2', icon: 'nature', label: 'Lemon Tree', x: 20, y: 35, interactive: true, learnTitle: 'Amalfi Lemons', learnContent: 'The Amalfi Coast grows giant lemons the size of softballs! They\'re used to make limoncello, a famous lemon drink. The terraced lemon groves have existed since Roman times.', auraReward: 8 },
          { id: 'it_t3', icon: 'landmark', label: 'Gondola Model', x: 75, y: 40, interactive: true, learnTitle: 'Venice Gondolas', learnContent: 'Venice has 400 gondolas navigating 150 canals. Every gondola is made from 8 types of wood and takes 2 months to build. They\'re all painted black by tradition!', auraReward: 8 },
          { id: 'it_t4', icon: 'culture', label: 'Pottery', x: 40, y: 60 },
          { id: 'it_t5', icon: 'nature', label: 'Herbs', x: 85, y: 55 },
        ],
      },
      {
        id: 'it_study', name: 'Studio', icon: 'culture',
        wallColor: '#FFF5F0', floorColor: '#B8A890',
        objects: [
          { id: 'it_s1', icon: 'culture', label: 'Da Vinci Notebook', x: 25, y: 25, interactive: true, learnTitle: 'Leonardo da Vinci', learnContent: 'Da Vinci was a painter, inventor, scientist, and musician. He wrote backwards (mirror writing) in his notebooks — you need a mirror to read them!', auraReward: 8 },
          { id: 'it_s2', icon: 'monument', label: 'David Statue', x: 70, y: 30, interactive: true, learnTitle: "Michelangelo's David", learnContent: "Michelangelo carved David from a single block of marble that other sculptors had given up on. It took 3 years and stands 5 meters tall — it's been in Florence since 1504!", auraReward: 8 },
          { id: 'it_s3', icon: 'star', label: 'Ferrari Model', x: 50, y: 55 },
          { id: 'it_s4', icon: 'star', label: 'Football', x: 80, y: 60 },
          { id: 'it_s5', icon: 'map', label: 'Roman Map', x: 15, y: 50 },
        ],
      },
    ],
  },
  gb: {
    rooms: [
      {
        id: 'gb_living', name: 'Drawing Room', icon: 'castle',
        wallColor: '#FFF8F5', floorColor: '#A89080',
        roomImageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
        objects: [
          { id: 'gb_l1', icon: 'crown', label: 'Crown', x: 50, y: 15, interactive: true, learnTitle: 'The British Crown', learnContent: "The Imperial State Crown has 2,868 diamonds, 273 pearls, 17 sapphires, 11 emeralds, and 5 rubies! It's kept in the Tower of London and worn for the State Opening of Parliament.", auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
          { id: 'gb_l2', icon: 'cafe', label: 'Tea Set', x: 25, y: 40, interactive: true, learnTitle: 'Afternoon Tea', learnContent: "Afternoon tea was invented by Duchess Anna of Bedford in the 1840s because she got hungry between lunch and dinner. Now it's a whole tradition with sandwiches, scones, and cakes!", auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800' },
          { id: 'gb_l3', icon: 'landmark', label: 'Big Ben Model', x: 75, y: 25, interactive: true, learnTitle: 'Big Ben', learnContent: "Big Ben is actually the name of the bell, not the tower! The tower is called Elizabeth Tower. The bell weighs 13.5 tons and has been keeping time since 1859.", auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
          { id: 'gb_l4', icon: 'star', label: 'Paddington Bear', x: 15, y: 55 },
          { id: 'gb_l5', icon: 'home', label: 'Fireplace', x: 85, y: 50 },
        ],
      },
      {
        id: 'gb_kitchen', name: 'Kitchen', icon: 'cafe',
        wallColor: '#FFFFF5', floorColor: '#B8A898',
        objects: [
          { id: 'gb_k1', icon: 'food', label: 'Fish & Chips', x: 35, y: 40, interactive: true, learnTitle: 'Fish and Chips', learnContent: "Fish and chips became popular in the 1860s. British people eat 382 million portions per year! The traditional way is wrapped in paper with salt and vinegar.", auraReward: 8, imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800' },
          { id: 'gb_k2', icon: 'cafe', label: 'Kettle', x: 65, y: 35 },
          { id: 'gb_k3', icon: 'food', label: 'Scones', x: 20, y: 50, interactive: true, learnTitle: 'Cream Tea', learnContent: "Devon and Cornwall have been arguing for centuries: do you put cream or jam on your scone first? In Devon it's cream first, in Cornwall it's jam. Very serious business!", auraReward: 8 },
          { id: 'gb_k4', icon: 'food', label: 'Biscuits', x: 80, y: 55 },
          { id: 'gb_k5', icon: 'food', label: 'Meat Pie', x: 50, y: 65 },
        ],
      },
      {
        id: 'gb_garden', name: 'English Garden', icon: 'nature',
        wallColor: '#F5FFF5', floorColor: '#88B888',
        objects: [
          { id: 'gb_g1', icon: 'nature', label: 'Rose Bush', x: 20, y: 30, interactive: true, learnTitle: 'English Roses', learnContent: "The rose is England's national flower. The War of the Roses (1455-1487) was a battle between two families, each with their own rose color — red for Lancaster, white for York!", auraReward: 8 },
          { id: 'gb_g2', icon: 'nature', label: 'Fox', x: 70, y: 45, interactive: true, learnTitle: 'British Wildlife', learnContent: "Red foxes live all over Britain — even in London! The UK also has badgers, hedgehogs, and red squirrels. The Highland coo (cow) with its shaggy hair is Scotland's most famous animal.", auraReward: 8 },
          { id: 'gb_g3', icon: 'nature', label: 'Rain Cloud', x: 50, y: 10 },
          { id: 'gb_g4', icon: 'star', label: 'Cricket Bat', x: 40, y: 60 },
          { id: 'gb_g5', icon: 'monument', label: 'Stone Circle', x: 85, y: 55, interactive: true, learnTitle: 'Stonehenge', learnContent: "Stonehenge is over 5,000 years old — older than the pyramids! Nobody knows exactly how people moved 25-ton stones from Wales (250 km away) without modern machinery.", auraReward: 8 },
        ],
      },
      {
        id: 'gb_study', name: 'Library', icon: 'book',
        wallColor: '#F8F5FF', floorColor: '#A09080',
        objects: [
          { id: 'gb_s1', icon: 'book', label: 'HP Books', x: 25, y: 25, interactive: true, learnTitle: 'Harry Potter', learnContent: "J.K. Rowling wrote the first Harry Potter book in Edinburgh cafés. 12 publishers rejected it before Bloomsbury said yes! The series has sold over 500 million copies in 80 languages.", auraReward: 8 },
          { id: 'gb_s2', icon: 'culture', label: 'Shakespeare', x: 70, y: 30, interactive: true, learnTitle: 'William Shakespeare', learnContent: "Shakespeare invented over 1,700 English words including 'lonely,' 'generous,' 'eyeball,' and 'bedroom.' The Globe Theatre in London still performs his plays today!", auraReward: 8 },
          { id: 'gb_s3', icon: 'search', label: 'Magnifier', x: 45, y: 55 },
          { id: 'gb_s4', icon: 'map', label: 'Empire Map', x: 80, y: 50 },
          { id: 'gb_s5', icon: 'flash', label: 'Science Kit', x: 15, y: 60 },
        ],
      },
    ],
  },
  br: {
    rooms: [
      {
        id: 'br_living', name: 'Sala de Estar', icon: 'home',
        wallColor: '#FFFFF5', floorColor: '#C8B090',
        objects: [
          { id: 'br_l1', icon: 'star', label: 'Football', x: 20, y: 30, interactive: true, learnTitle: 'Brazilian Football', learnContent: "Brazil has won the World Cup 5 times — more than any other country! Pelé scored over 1,000 goals in his career. Football is practically a religion in Brazil.", auraReward: 8 },
          { id: 'br_l2', icon: 'culture', label: 'Carnival Mask', x: 75, y: 25, interactive: true, learnTitle: 'Carnival', learnContent: "Rio's Carnival is the world's biggest party — 2 million people dance in the streets daily! Samba schools practice all year for the parade. Costumes can weigh over 30 kg.", auraReward: 8 },
          { id: 'br_l3', icon: 'nature', label: 'Macaw', x: 50, y: 15, interactive: true, learnTitle: 'Macaws', learnContent: "Brazil has 18 species of macaw! These colorful parrots can live 60-80 years. They mate for life and can learn to mimic human speech.", auraReward: 8 },
          { id: 'br_l4', icon: 'beach', label: 'Beach Photo', x: 85, y: 50 },
          { id: 'br_l5', icon: 'culture', label: 'Drum', x: 15, y: 55 },
        ],
      },
      {
        id: 'br_kitchen', name: 'Cozinha', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C0A880',
        objects: [
          { id: 'br_k1', icon: 'food', label: 'Açaí Bowl', x: 35, y: 40, interactive: true, learnTitle: 'Açaí', learnContent: "Açaí berries grow on palm trees in the Amazon. Brazilians have eaten them for centuries! They're packed with antioxidants and served frozen in bowls with granola and banana.", auraReward: 8 },
          { id: 'br_k2', icon: 'food', label: 'Churrasco', x: 65, y: 45, interactive: true, learnTitle: 'Churrasco', learnContent: "Brazilian churrasco (barbecue) is a social event where huge skewers of meat are roasted over open flames. Waiters walk around with swords of meat — you just say yes or no!", auraReward: 8 },
          { id: 'br_k3', icon: 'food', label: 'Feijoada', x: 20, y: 55, interactive: true, learnTitle: 'Feijoada', learnContent: "Feijoada is Brazil's national dish — a rich black bean stew with pork, served with rice, greens, and orange slices. It's traditionally eaten on Wednesdays and Saturdays.", auraReward: 8 },
          { id: 'br_k4', icon: 'food', label: 'Tropical Fruit', x: 80, y: 35 },
          { id: 'br_k5', icon: 'cafe', label: 'Coffee', x: 50, y: 65 },
        ],
      },
      {
        id: 'br_outdoor', name: 'Quintal', icon: 'nature',
        wallColor: '#F0FFF0', floorColor: '#88B878',
        objects: [
          { id: 'br_o1', icon: 'nature', label: 'Palm Tree', x: 15, y: 20 },
          { id: 'br_o2', icon: 'nature', label: 'Sloth', x: 70, y: 30, interactive: true, learnTitle: 'Amazon Wildlife', learnContent: "The Amazon Rainforest has 10% of all species on Earth! You can find jaguars, pink river dolphins, poison dart frogs, and sloths that only come down from trees once a week.", auraReward: 8 },
          { id: 'br_o3', icon: 'beach', label: 'Hammock', x: 45, y: 50 },
          { id: 'br_o4', icon: 'nature', label: 'Tropical Flowers', x: 30, y: 65 },
          { id: 'br_o5', icon: 'monument', label: 'Cristo', x: 85, y: 20, interactive: true, learnTitle: 'Christ the Redeemer', learnContent: "Christ the Redeemer stands 30 meters tall on top of Corcovado mountain in Rio. It was built in 1931 and is one of the New Seven Wonders of the World!", auraReward: 8 },
        ],
      },
      {
        id: 'br_study', name: 'Escritório', icon: 'book',
        wallColor: '#F5F0FF', floorColor: '#B0A090',
        objects: [
          { id: 'br_s1', icon: 'nature', label: 'Amazon Map', x: 25, y: 25, interactive: true, learnTitle: 'Amazon Rainforest', learnContent: "The Amazon is so big it would be the 9th largest country in the world! It produces 20% of Earth's oxygen. The Amazon River carries more water than the next 7 largest rivers combined.", auraReward: 8 },
          { id: 'br_s2', icon: 'culture', label: 'Samba Shoes', x: 70, y: 35, interactive: true, learnTitle: 'Samba', learnContent: "Samba originated from African rhythms brought by enslaved people. It became Brazil's signature dance and music genre. During Carnival, samba schools compete in spectacular parades!", auraReward: 8 },
          { id: 'br_s3', icon: 'culture', label: 'Bossa Nova Record', x: 45, y: 55 },
          { id: 'br_s4', icon: 'book', label: 'Books', x: 80, y: 60 },
          { id: 'br_s5', icon: 'map', label: 'World Map', x: 15, y: 50 },
        ],
      },
    ],
  },
  kr: {
    rooms: [
      {
        id: 'kr_living', name: 'Hanok Room', icon: 'home',
        wallColor: '#FFF8F0', floorColor: '#C8B898',
        objects: [
          { id: 'kr_l1', icon: 'culture', label: 'Hanbok Display', x: 20, y: 20, interactive: true, learnTitle: 'Hanbok', learnContent: 'The hanbok is Korea\'s traditional clothing. The jeogori (jacket) and chima (skirt) create a graceful bell shape. Koreans wear hanboks during Chuseok (harvest festival) and Seollal (Lunar New Year)!', auraReward: 8 },
          { id: 'kr_l2', icon: 'culture', label: 'K-pop Poster', x: 75, y: 25, interactive: true, learnTitle: 'K-pop Music', learnContent: 'K-pop groups train for years before debuting. They learn singing, dancing, and even acting. BTS was the first K-pop group to top the US Billboard chart!', auraReward: 8 },
          { id: 'kr_l3', icon: 'star', label: 'Game Console', x: 50, y: 55 },
          { id: 'kr_l4', icon: 'culture', label: 'Fan Dance Props', x: 85, y: 40, interactive: true, learnTitle: 'Buchaechum', learnContent: 'Buchaechum is a beautiful Korean fan dance performed by groups of dancers. They use large, colorful fans to create shapes like flowers, butterflies, and waves!', auraReward: 8 },
          { id: 'kr_l5', icon: 'home', label: 'Floor Cushion', x: 15, y: 60 },
        ],
      },
      {
        id: 'kr_kitchen', name: 'Korean Kitchen', icon: 'food',
        wallColor: '#FFF5F5', floorColor: '#C0A888',
        objects: [
          { id: 'kr_k1', icon: 'food', label: 'Kimchi Jars', x: 30, y: 40, interactive: true, learnTitle: 'Kimchi', learnContent: 'Kimchi is fermented vegetables (usually cabbage) with chili, garlic, and ginger. Korean families make huge batches together each autumn in a tradition called "kimjang"!', auraReward: 8 },
          { id: 'kr_k2', icon: 'food', label: 'Bibimbap Bowl', x: 65, y: 45, interactive: true, learnTitle: 'Bibimbap', learnContent: 'Bibimbap means "mixed rice." It\'s a bowl of rice topped with vegetables, meat, egg, and spicy gochujang sauce. You mix everything together before eating!', auraReward: 8 },
          { id: 'kr_k3', icon: 'food', label: 'Chopsticks', x: 50, y: 65 },
          { id: 'kr_k4', icon: 'food', label: 'Tteok (Rice Cake)', x: 15, y: 30, interactive: true, learnTitle: 'Tteok', learnContent: 'Tteok are chewy Korean rice cakes. Tteokbokki (spicy rice cakes) is the most popular street food in Korea. Rainbow tteok is eaten during celebrations!', auraReward: 8 },
          { id: 'kr_k5', icon: 'cafe', label: 'Barley Tea', x: 80, y: 35 },
        ],
      },
      {
        id: 'kr_culture', name: 'K-Culture Room', icon: 'star',
        wallColor: '#F0F0FF', floorColor: '#B8A8C8',
        objects: [
          { id: 'kr_c1', icon: 'book', label: 'Hangul Chart', x: 25, y: 20, interactive: true, learnTitle: 'Hangul', learnContent: 'Hangul is the Korean alphabet, invented by King Sejong in 1443 so that everyone could learn to read — not just scholars. It has 14 consonants and 10 vowels and is considered one of the most scientific writing systems!', auraReward: 8 },
          { id: 'kr_c2', icon: 'culture', label: 'Taekwondo Belt', x: 70, y: 35, interactive: true, learnTitle: 'Taekwondo', learnContent: 'Taekwondo is a Korean martial art known for powerful kicks. It became an Olympic sport in 2000. The word means "the way of the foot and fist"!', auraReward: 8 },
          { id: 'kr_c3', icon: 'star', label: 'LED Light', x: 50, y: 55 },
          { id: 'kr_c4', icon: 'culture', label: 'Drum', x: 85, y: 50, interactive: true, learnTitle: 'Samulnori', learnContent: 'Samulnori is a Korean drumming performance using four traditional instruments. The rhythms represent wind, rain, clouds, and thunder — the sounds of nature!', auraReward: 8 },
          { id: 'kr_c5', icon: 'map', label: 'Map of Korea', x: 15, y: 45 },
        ],
      },
    ],
  },
  th: {
    rooms: [
      {
        id: 'th_living', name: 'Sala Room', icon: 'temple',
        wallColor: '#FFF8E8', floorColor: '#C8A870',
        objects: [
          { id: 'th_l1', icon: 'temple', label: 'Buddha Statue', x: 50, y: 15, interactive: true, learnTitle: 'Thai Buddhism', learnContent: 'About 95% of Thai people practice Buddhism. Thai temples (wats) have golden spires and colorful murals. Monks walk barefoot each morning collecting food from the community!', auraReward: 8 },
          { id: 'th_l2', icon: 'culture', label: 'Thai Puppet', x: 20, y: 35, interactive: true, learnTitle: 'Hun Krabok Puppets', learnContent: 'Thai rod puppets (hun krabok) are beautifully carved and dressed in silk. Puppeteers use them to tell stories from ancient Thai legends and the Ramakien epic!', auraReward: 8 },
          { id: 'th_l3', icon: 'nature', label: 'Orchid', x: 75, y: 30 },
          { id: 'th_l4', icon: 'culture', label: 'Silk Fabric', x: 85, y: 55, interactive: true, learnTitle: 'Thai Silk', learnContent: 'Thai silk is famous for its brilliant colors and shimmering texture. Silkworms spin cocoons that are carefully unwound into threads — one cocoon produces up to 900 meters of silk!', auraReward: 8 },
          { id: 'th_l5', icon: 'home', label: 'Floor Mat', x: 40, y: 65 },
        ],
      },
      {
        id: 'th_kitchen', name: 'Thai Kitchen', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C0A868',
        objects: [
          { id: 'th_k1', icon: 'food', label: 'Pad Thai', x: 35, y: 40, interactive: true, learnTitle: 'Pad Thai', learnContent: 'Pad Thai is Thailand\'s most famous dish — stir-fried rice noodles with shrimp, peanuts, lime, and bean sprouts. It was promoted as a national dish in the 1930s to build Thai identity!', auraReward: 8 },
          { id: 'th_k2', icon: 'food', label: 'Green Curry', x: 65, y: 45, interactive: true, learnTitle: 'Thai Curry', learnContent: 'Thai curries use coconut milk and fresh herbs. Green curry is the spiciest! The paste is made by pounding chilies, lemongrass, galangal, and kaffir lime leaves with a mortar and pestle.', auraReward: 8 },
          { id: 'th_k3', icon: 'food', label: 'Sticky Rice', x: 20, y: 55, interactive: true, learnTitle: 'Sticky Rice', learnContent: 'Sticky rice (khao niao) is eaten with your hands in northern Thailand. Mango sticky rice is a beloved dessert — sweet coconut rice topped with ripe mango slices!', auraReward: 8 },
          { id: 'th_k4', icon: 'food', label: 'Chili Peppers', x: 80, y: 30 },
          { id: 'th_k5', icon: 'cafe', label: 'Thai Iced Tea', x: 50, y: 65 },
        ],
      },
      {
        id: 'th_garden', name: 'Temple Garden', icon: 'nature',
        wallColor: '#F0FFF0', floorColor: '#90C080',
        objects: [
          { id: 'th_g1', icon: 'temple', label: 'Spirit House', x: 20, y: 25, interactive: true, learnTitle: 'Spirit Houses', learnContent: 'Almost every Thai building has a small spirit house outside. People leave offerings of food, flowers, and incense to bring good luck and keep the land spirits happy!', auraReward: 8 },
          { id: 'th_g2', icon: 'nature', label: 'Elephant Statue', x: 70, y: 35, interactive: true, learnTitle: 'Thai Elephants', learnContent: 'The white elephant is Thailand\'s royal symbol. Elephants helped build ancient cities and temples. Today, sanctuaries protect rescued elephants where visitors can feed and bathe them!', auraReward: 8 },
          { id: 'th_g3', icon: 'nature', label: 'Lotus Pond', x: 45, y: 55, interactive: true, learnTitle: 'Lotus Flowers', learnContent: 'The lotus is sacred in Thai culture. It grows in muddy water but blooms perfectly clean — a symbol of purity and spiritual growth. Thai people offer lotus flowers at temples.', auraReward: 8 },
          { id: 'th_g4', icon: 'nature', label: 'Frangipani Tree', x: 85, y: 20 },
          { id: 'th_g5', icon: 'nature', label: 'Bamboo', x: 15, y: 60 },
        ],
      },
    ],
  },
  ma: {
    rooms: [
      {
        id: 'ma_living', name: 'Riad Courtyard', icon: 'landmark',
        wallColor: '#FFF5E0', floorColor: '#D4A870',
        objects: [
          { id: 'ma_l1', icon: 'culture', label: 'Zellige Tiles', x: 20, y: 20, interactive: true, learnTitle: 'Zellige Mosaic', learnContent: 'Zellige tiles are hand-cut from clay and arranged into dazzling geometric patterns. No two tiles are exactly alike! This art has decorated Moroccan palaces and mosques for over 1,000 years.', auraReward: 8 },
          { id: 'ma_l2', icon: 'landmark', label: 'Lantern', x: 75, y: 25, interactive: true, learnTitle: 'Moroccan Lanterns', learnContent: 'Moroccan lanterns are made from metal with intricate cut-out patterns. When lit, they cast beautiful star and flower shapes on the walls — turning any room into a magical space!', auraReward: 8 },
          { id: 'ma_l3', icon: 'nature', label: 'Orange Tree', x: 50, y: 50 },
          { id: 'ma_l4', icon: 'culture', label: 'Carpet', x: 85, y: 45, interactive: true, learnTitle: 'Berber Carpets', learnContent: 'Berber women in the Atlas Mountains hand-weave carpets using wool from their own sheep. Each symbol woven into the carpet has meaning — diamonds for protection, zigzags for water!', auraReward: 8 },
          { id: 'ma_l5', icon: 'monument', label: 'Fountain', x: 40, y: 70 },
        ],
      },
      {
        id: 'ma_kitchen', name: 'Moroccan Kitchen', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C8A068',
        objects: [
          { id: 'ma_k1', icon: 'food', label: 'Tagine Pot', x: 30, y: 40, interactive: true, learnTitle: 'Tagine', learnContent: 'A tagine is both a cone-shaped clay pot and the dish cooked inside it. The cone traps steam so food stays incredibly tender. Lamb tagine with apricots and almonds is a Moroccan classic!', auraReward: 8 },
          { id: 'ma_k2', icon: 'cafe', label: 'Mint Tea Set', x: 65, y: 45, interactive: true, learnTitle: 'Moroccan Mint Tea', learnContent: 'Making mint tea is an art in Morocco. Green tea and fresh mint are brewed with lots of sugar, then poured from high up to create foam. Refusing a glass is considered rude!', auraReward: 8 },
          { id: 'ma_k3', icon: 'food', label: 'Couscous', x: 20, y: 55, interactive: true, learnTitle: 'Couscous', learnContent: 'Couscous is tiny steamed wheat granules served with vegetables and meat. Moroccan families gather every Friday to share a big couscous meal — it is a weekly tradition!', auraReward: 8 },
          { id: 'ma_k4', icon: 'food', label: 'Spice Jars', x: 80, y: 30 },
          { id: 'ma_k5', icon: 'food', label: 'Flatbread', x: 50, y: 65 },
        ],
      },
      {
        id: 'ma_craft', name: 'Craft Workshop', icon: 'culture',
        wallColor: '#FFF0E8', floorColor: '#B89870',
        objects: [
          { id: 'ma_c1', icon: 'culture', label: 'Leather Goods', x: 25, y: 25, interactive: true, learnTitle: 'Fez Tanneries', learnContent: 'The leather tanneries of Fez have operated the same way for 1,000 years! Hides are soaked in stone vats of natural dyes — saffron for yellow, indigo for blue, mint for green.', auraReward: 8 },
          { id: 'ma_c2', icon: 'culture', label: 'Pottery', x: 70, y: 30, interactive: true, learnTitle: 'Moroccan Pottery', learnContent: 'Moroccan pottery from Fez and Safi features hand-painted blue and white designs. Each piece is shaped on a wheel, painted freehand, and fired in a kiln — no two are identical!', auraReward: 8 },
          { id: 'ma_c3', icon: 'star', label: 'Brass Tray', x: 50, y: 55 },
          { id: 'ma_c4', icon: 'culture', label: 'Woven Basket', x: 15, y: 50, interactive: true, learnTitle: 'Moroccan Basketry', learnContent: 'Moroccan women weave beautiful baskets from palm leaves and raffia. They are used for shopping, bread-making, and storage. Bright wool pompoms are added for decoration!', auraReward: 8 },
          { id: 'ma_c5', icon: 'map', label: 'Map of Morocco', x: 85, y: 60 },
        ],
      },
    ],
  },
  pe: {
    rooms: [
      {
        id: 'pe_living', name: 'Andean Living Room', icon: 'mountain',
        wallColor: '#FFF5E8', floorColor: '#C8A878',
        objects: [
          { id: 'pe_l1', icon: 'landmark', label: 'Machu Picchu Model', x: 20, y: 20, interactive: true, learnTitle: 'Machu Picchu', learnContent: 'Machu Picchu sits 2,430 meters above sea level in the Andes. The Inca built it around 1450 without mortar — the stones fit together so tightly that a knife blade cannot fit between them!', auraReward: 8 },
          { id: 'pe_l2', icon: 'culture', label: 'Alpaca Blanket', x: 75, y: 30, interactive: true, learnTitle: 'Peruvian Textiles', learnContent: 'Peruvian weavers have made textiles for over 5,000 years — longer than any other culture! Alpaca fiber is warmer than sheep wool and comes in 22 natural colors.', auraReward: 8 },
          { id: 'pe_l3', icon: 'culture', label: 'Pan Flute', x: 50, y: 50, interactive: true, learnTitle: 'Andean Music', learnContent: 'The pan flute (zampoña) and charango (tiny guitar made from armadillo shell) create the beautiful sound of Andean music. These instruments have been played for over 2,000 years!', auraReward: 8 },
          { id: 'pe_l4', icon: 'nature', label: 'Llama Figure', x: 85, y: 55 },
          { id: 'pe_l5', icon: 'home', label: 'Woven Rug', x: 15, y: 60 },
        ],
      },
      {
        id: 'pe_kitchen', name: 'Peruvian Kitchen', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C0A070',
        objects: [
          { id: 'pe_k1', icon: 'food', label: 'Ceviche', x: 35, y: 40, interactive: true, learnTitle: 'Ceviche', learnContent: 'Peru\'s national dish uses fresh fish marinated in lime juice with onions and chili. The acid in the lime "cooks" the fish! Peru even has a national holiday for ceviche on June 28th.', auraReward: 8 },
          { id: 'pe_k2', icon: 'food', label: 'Potato Varieties', x: 65, y: 45, interactive: true, learnTitle: 'Peruvian Potatoes', learnContent: 'Peru is the birthplace of the potato! Over 3,000 varieties grow in the Andes — purple, yellow, red, and even blue. The Inca freeze-dried potatoes 1,000 years before modern technology!', auraReward: 8 },
          { id: 'pe_k3', icon: 'food', label: 'Corn', x: 20, y: 55, interactive: true, learnTitle: 'Peruvian Corn', learnContent: 'Peru grows corn with the largest kernels in the world — some as big as coins! Purple corn is used to make a delicious drink called chicha morada.', auraReward: 8 },
          { id: 'pe_k4', icon: 'food', label: 'Quinoa', x: 80, y: 30 },
          { id: 'pe_k5', icon: 'cafe', label: 'Emoliente', x: 50, y: 65 },
        ],
      },
      {
        id: 'pe_weaving', name: 'Weaving Room', icon: 'culture',
        wallColor: '#FFF0E0', floorColor: '#B89868',
        objects: [
          { id: 'pe_w1', icon: 'culture', label: 'Loom', x: 25, y: 25, interactive: true, learnTitle: 'Backstrap Loom', learnContent: 'The backstrap loom is tied to a post and wrapped around the weaver\'s body. This simple tool creates incredibly complex patterns. Inca weavers made textiles so fine that Spanish explorers mistook them for silk!', auraReward: 8 },
          { id: 'pe_w2', icon: 'history', label: 'Quipu', x: 70, y: 30, interactive: true, learnTitle: 'Quipus', learnContent: 'Quipus are knotted strings the Inca used to keep records. Different colors, knots, and positions recorded numbers, stories, and even calendars. Scholars are still decoding them today!', auraReward: 8 },
          { id: 'pe_w3', icon: 'nature', label: 'Alpaca Wool', x: 50, y: 55 },
          { id: 'pe_w4', icon: 'culture', label: 'Chullo Hat', x: 15, y: 50, interactive: true, learnTitle: 'Chullo Hats', learnContent: 'The chullo is a knitted hat with earflaps from the Andes. Each region has its own patterns and colors. Traditionally, young men knit their own chullos to show they are ready for marriage!', auraReward: 8 },
          { id: 'pe_w5', icon: 'map', label: 'Inca Trail Map', x: 85, y: 60 },
        ],
      },
    ],
  },
  ke: {
    rooms: [
      {
        id: 'ke_living', name: 'Safari Lodge', icon: 'nature',
        wallColor: '#FFF5E0', floorColor: '#C8A060',
        objects: [
          { id: 'ke_l1', icon: 'nature', label: 'Binoculars', x: 20, y: 25, interactive: true, learnTitle: 'Safari Animals', learnContent: 'Kenya is home to the "Big Five" — lions, leopards, elephants, rhinos, and buffalo. The Great Migration in the Maasai Mara sees over 1.5 million wildebeest crossing the plains each year!', auraReward: 8 },
          { id: 'ke_l2', icon: 'culture', label: 'Maasai Shield', x: 75, y: 20, interactive: true, learnTitle: 'Maasai Warriors', learnContent: 'Maasai warriors (morani) are known for their bravery, red shuka clothing, and amazing jumping dance called "adumu." The highest jumper earns great respect from the community!', auraReward: 8 },
          { id: 'ke_l3', icon: 'nature', label: 'Giraffe Photo', x: 50, y: 45 },
          { id: 'ke_l4', icon: 'culture', label: 'Beaded Necklace', x: 85, y: 50, interactive: true, learnTitle: 'Maasai Beadwork', learnContent: 'Maasai women create stunning beaded jewelry. Each color has meaning: red for bravery, blue for the sky, green for the land, and white for peace. The patterns tell stories about the wearer!', auraReward: 8 },
          { id: 'ke_l5', icon: 'home', label: 'Woven Chair', x: 15, y: 60 },
        ],
      },
      {
        id: 'ke_kitchen', name: 'Kenyan Kitchen', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#B89860',
        objects: [
          { id: 'ke_k1', icon: 'food', label: 'Ugali', x: 30, y: 40, interactive: true, learnTitle: 'Ugali', learnContent: 'Ugali is Kenya\'s staple food — a thick porridge made from maize flour. You pinch off a piece with your right hand and use it to scoop up stews and vegetables. It is eaten at almost every meal!', auraReward: 8 },
          { id: 'ke_k2', icon: 'food', label: 'Nyama Choma', x: 65, y: 45, interactive: true, learnTitle: 'Nyama Choma', learnContent: 'Nyama choma means "roasted meat" in Swahili. It is Kenya\'s most popular social food — friends and family gather around a charcoal grill to share tender goat or beef!', auraReward: 8 },
          { id: 'ke_k3', icon: 'cafe', label: 'Kenyan Coffee', x: 20, y: 55, interactive: true, learnTitle: 'Kenyan Coffee', learnContent: 'Kenya grows some of the world\'s finest coffee on volcanic soil near Mount Kenya. The beans are washed in mountain streams, giving them a bright, fruity flavor loved worldwide!', auraReward: 8 },
          { id: 'ke_k4', icon: 'food', label: 'Chapati', x: 80, y: 30 },
          { id: 'ke_k5', icon: 'food', label: 'Tropical Fruit', x: 50, y: 65 },
        ],
      },
      {
        id: 'ke_culture', name: 'Maasai Room', icon: 'culture',
        wallColor: '#FFF0E0', floorColor: '#B88850',
        objects: [
          { id: 'ke_c1', icon: 'nature', label: 'Acacia Tree Model', x: 25, y: 25, interactive: true, learnTitle: 'African Savanna', learnContent: 'Kenya\'s savanna is dotted with flat-topped acacia trees. These trees provide shade for elephants and food for giraffes. Some acacias have thorns that house biting ants to protect the tree!', auraReward: 8 },
          { id: 'ke_c2', icon: 'mountain', label: 'Mt Kenya Photo', x: 70, y: 30, interactive: true, learnTitle: 'Mount Kenya', learnContent: 'Mount Kenya is Africa\'s second-highest peak at 5,199 meters. The Kikuyu people believe it is the home of their god Ngai. Its glaciers are shrinking due to climate change.', auraReward: 8 },
          { id: 'ke_c3', icon: 'star', label: 'Running Shoes', x: 50, y: 55, interactive: true, learnTitle: 'Kenyan Runners', learnContent: 'Kenyan athletes have won over 100 Olympic medals! The Kalenjin people from Kenya\'s highlands are the world\'s greatest distance runners. Eliud Kipchoge was the first person to run a marathon in under 2 hours!', auraReward: 8 },
          { id: 'ke_c4', icon: 'culture', label: 'Drum', x: 85, y: 55 },
          { id: 'ke_c5', icon: 'map', label: 'Map of Kenya', x: 15, y: 50 },
        ],
      },
    ],
  },
  no: {
    rooms: [
      {
        id: 'no_living', name: 'Viking Hall', icon: 'history',
        wallColor: '#FFF8F0', floorColor: '#A89878',
        objects: [
          { id: 'no_l1', icon: 'history', label: 'Viking Ship Model', x: 20, y: 20, interactive: true, learnTitle: 'Viking Longships', learnContent: 'Viking longships were engineering marvels — light enough to carry over land and strong enough to cross the Atlantic Ocean. They had dragon-head prows to scare enemies and evil spirits!', auraReward: 8 },
          { id: 'no_l2', icon: 'history', label: 'Rune Stones', x: 75, y: 25, interactive: true, learnTitle: 'Viking Runes', learnContent: 'Vikings carved runes (an ancient alphabet) into stones, wood, and metal. Each rune had a name and magical meaning. The runic alphabet is called the Futhark, named after its first six letters!', auraReward: 8 },
          { id: 'no_l3', icon: 'culture', label: 'Troll Figure', x: 50, y: 50, interactive: true, learnTitle: 'Norwegian Trolls', learnContent: 'In Norwegian folklore, trolls are creatures that live in mountains and forests. They turn to stone if sunlight touches them! Rock formations all over Norway are said to be frozen trolls.', auraReward: 8 },
          { id: 'no_l4', icon: 'home', label: 'Fireplace', x: 85, y: 45 },
          { id: 'no_l5', icon: 'nature', label: 'Reindeer Pelt', x: 15, y: 55 },
        ],
      },
      {
        id: 'no_kitchen', name: 'Norwegian Kitchen', icon: 'food',
        wallColor: '#FFFFF5', floorColor: '#B8A888',
        objects: [
          { id: 'no_k1', icon: 'food', label: 'Brunost', x: 30, y: 40, interactive: true, learnTitle: 'Brown Cheese', learnContent: 'Brunost (brown cheese) is Norway\'s most unique food — sweet, caramel-colored cheese made from whey. Norwegians eat it on bread for breakfast. It\'s so beloved there was a national crisis when a truck carrying brunost caught fire in a tunnel!', auraReward: 8 },
          { id: 'no_k2', icon: 'food', label: 'Salmon', x: 65, y: 45, interactive: true, learnTitle: 'Norwegian Salmon', learnContent: 'Norway is the world\'s largest producer of Atlantic salmon. Norwegian fishers actually introduced raw salmon to Japanese sushi chefs in the 1980s — before that, salmon sushi didn\'t exist!', auraReward: 8 },
          { id: 'no_k3', icon: 'food', label: 'Waffles', x: 20, y: 55, interactive: true, learnTitle: 'Norwegian Waffles', learnContent: 'Norwegian waffles are heart-shaped and thinner than Belgian ones. They\'re served with brunost, jam, and sour cream. Waffle Day (Vaffeldagen) is celebrated on March 25th!', auraReward: 8 },
          { id: 'no_k4', icon: 'food', label: 'Lingonberries', x: 80, y: 30 },
          { id: 'no_k5', icon: 'cafe', label: 'Coffee', x: 50, y: 65 },
        ],
      },
      {
        id: 'no_aurora', name: 'Aurora Cabin', icon: 'sparkles',
        wallColor: '#F0F0FF', floorColor: '#8888A8',
        objects: [
          { id: 'no_a1', icon: 'sparkles', label: 'Aurora Photo', x: 25, y: 15, interactive: true, learnTitle: 'Northern Lights', learnContent: 'The aurora borealis appears when charged particles from the sun collide with gases in Earth\'s atmosphere. In northern Norway, the lights dance across the sky from September to March in greens, purples, and pinks!', auraReward: 8 },
          { id: 'no_a2', icon: 'mountain', label: 'Fjord Painting', x: 70, y: 25, interactive: true, learnTitle: 'Norwegian Fjords', learnContent: 'Fjords are narrow inlets with towering cliffs carved by glaciers over millions of years. Geirangerfjord and Nærøyfjord are UNESCO World Heritage Sites. Some cliffs rise over 1,000 meters straight from the water!', auraReward: 8 },
          { id: 'no_a3', icon: 'nature', label: 'Polar Bear Toy', x: 50, y: 50 },
          { id: 'no_a4', icon: 'nature', label: 'Midnight Sun Photo', x: 15, y: 40, interactive: true, learnTitle: 'Midnight Sun', learnContent: 'In summer, northern Norway has 24 hours of sunlight — the sun never sets! This "midnight sun" lets people hike, fish, and play outside all night. In winter, the opposite happens — the "polar night" has no sunrise for weeks.', auraReward: 8 },
          { id: 'no_a5', icon: 'star', label: 'Ski Equipment', x: 85, y: 55 },
        ],
      },
    ],
  },
  tr: {
    rooms: [
      {
        id: 'tr_living', name: 'Ottoman Salon', icon: 'landmark',
        wallColor: '#FFF5E0', floorColor: '#C8A068',
        objects: [
          { id: 'tr_l1', icon: 'landmark', label: 'Hagia Sophia Model', x: 20, y: 20, interactive: true, learnTitle: 'Hagia Sophia', learnContent: 'Hagia Sophia in Istanbul was built in 537 AD and has been a church, a mosque, and now a museum-mosque. Its massive dome was the largest in the world for nearly 1,000 years!', auraReward: 8 },
          { id: 'tr_l2', icon: 'culture', label: 'Turkish Lamp', x: 75, y: 25, interactive: true, learnTitle: 'Mosaic Lamps', learnContent: 'Turkish mosaic lamps are made from hundreds of tiny colored glass pieces fitted together by hand. When lit, they scatter rainbow patterns across the room. They are a symbol of the Grand Bazaar!', auraReward: 8 },
          { id: 'tr_l3', icon: 'culture', label: 'Evil Eye Charm', x: 50, y: 45, interactive: true, learnTitle: 'Nazar Boncuğu', learnContent: 'The blue "evil eye" charm (nazar boncuğu) is everywhere in Turkey — on doors, in cars, and as jewelry. It is believed to protect against bad luck. The tradition goes back over 3,000 years!', auraReward: 8 },
          { id: 'tr_l4', icon: 'culture', label: 'Carpet', x: 85, y: 55 },
          { id: 'tr_l5', icon: 'home', label: 'Ottoman Cushion', x: 15, y: 60 },
        ],
      },
      {
        id: 'tr_kitchen', name: 'Turkish Kitchen', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C0A060',
        objects: [
          { id: 'tr_k1', icon: 'food', label: 'Kebabs', x: 35, y: 40, interactive: true, learnTitle: 'Turkish Kebab', learnContent: 'Turkey is the home of the kebab! Döner kebab (meat cooked on a rotating spit) was invented in the 1800s. There are over 300 types of kebab in Turkey — from Adana to İskender.', auraReward: 8 },
          { id: 'tr_k2', icon: 'food', label: 'Baklava', x: 65, y: 45, interactive: true, learnTitle: 'Baklava', learnContent: 'Baklava has layers of paper-thin phyllo dough filled with chopped nuts and soaked in honey syrup. The best baklava from Gaziantep can have up to 40 layers — each one thinner than paper!', auraReward: 8 },
          { id: 'tr_k3', icon: 'cafe', label: 'Turkish Coffee', x: 20, y: 55, interactive: true, learnTitle: 'Turkish Coffee', learnContent: 'Turkish coffee is brewed in a small copper pot (cezve) and served unfiltered in tiny cups. The grounds settle to the bottom, and fortune tellers read the patterns they leave behind!', auraReward: 8 },
          { id: 'tr_k4', icon: 'food', label: 'Turkish Delight', x: 80, y: 30 },
          { id: 'tr_k5', icon: 'food', label: 'Simit', x: 50, y: 65 },
        ],
      },
      {
        id: 'tr_bazaar', name: 'Bazaar Room', icon: 'market',
        wallColor: '#FFF0E0', floorColor: '#B89058',
        objects: [
          { id: 'tr_b1', icon: 'market', label: 'Spice Stall', x: 25, y: 25, interactive: true, learnTitle: 'Spice Bazaar', learnContent: 'Istanbul\'s Spice Bazaar (Mısır Çarşısı) has been open since 1660! Stalls overflow with colorful spices, dried fruits, and Turkish delight. The building was originally funded by Egyptian trade taxes.', auraReward: 8 },
          { id: 'tr_b2', icon: 'culture', label: 'Whirling Figure', x: 70, y: 30, interactive: true, learnTitle: 'Whirling Dervishes', learnContent: 'Whirling dervishes spin in circles as a form of meditation and prayer. Founded by Rumi in the 1200s, the dance represents the soul\'s journey toward truth. They spin on their left foot for up to 30 minutes!', auraReward: 8 },
          { id: 'tr_b3', icon: 'sparkles', label: 'Hot Air Balloon', x: 50, y: 15, interactive: true, learnTitle: 'Cappadocia Balloons', learnContent: 'Every dawn, up to 150 hot air balloons rise over Cappadocia\'s fairy chimneys. These rock towers were formed by volcanic eruptions millions of years ago. Ancient people carved homes and churches inside them!', auraReward: 8 },
          { id: 'tr_b4', icon: 'culture', label: 'Turkish Towel', x: 85, y: 55 },
          { id: 'tr_b5', icon: 'map', label: 'Map of Turkey', x: 15, y: 50 },
        ],
      },
    ],
  },
  gr: {
    rooms: [
      {
        id: 'gr_living', name: 'Aegean Room', icon: 'beach',
        wallColor: '#F0F8FF', floorColor: '#C8C8D8',
        objects: [
          { id: 'gr_l1', icon: 'landmark', label: 'Parthenon Model', x: 20, y: 20, interactive: true, learnTitle: 'The Parthenon', learnContent: 'The Parthenon in Athens was built in 447 BC as a temple for the goddess Athena. Its columns look straight but actually curve slightly — the ancient Greeks used optical illusions to make it look perfect!', auraReward: 8 },
          { id: 'gr_l2', icon: 'culture', label: 'Lyre', x: 75, y: 25, interactive: true, learnTitle: 'Greek Music', learnContent: 'The lyre was ancient Greece\'s most important instrument — the god Apollo was always shown playing one. The word "music" itself comes from the Greek "mousike" meaning "art of the Muses."', auraReward: 8 },
          { id: 'gr_l3', icon: 'beach', label: 'Santorini Photo', x: 50, y: 45, interactive: true, learnTitle: 'Greek Islands', learnContent: 'Greece has about 6,000 islands scattered across blue seas! Santorini sits on the rim of a volcanic crater. Its white buildings and blue domes are one of the most photographed sights in the world.', auraReward: 8 },
          { id: 'gr_l4', icon: 'nature', label: 'Olive Branch', x: 85, y: 50 },
          { id: 'gr_l5', icon: 'home', label: 'White Vase', x: 15, y: 55 },
        ],
      },
      {
        id: 'gr_kitchen', name: 'Greek Kitchen', icon: 'food',
        wallColor: '#FFFFF5', floorColor: '#C0B8A8',
        objects: [
          { id: 'gr_k1', icon: 'food', label: 'Greek Salad', x: 35, y: 40, interactive: true, learnTitle: 'Greek Salad', learnContent: 'A real Greek salad (horiatiki) has tomatoes, cucumbers, olives, onions, and a big slab of feta cheese on top — never lettuce! Greeks drizzle it with olive oil from their own trees.', auraReward: 8 },
          { id: 'gr_k2', icon: 'food', label: 'Gyros', x: 65, y: 45, interactive: true, learnTitle: 'Gyros', learnContent: 'Gyros are made from meat cooked on a vertical spit, sliced thin, and wrapped in pita bread with tomato, onion, and tzatziki sauce. The word "gyros" means "turn" in Greek!', auraReward: 8 },
          { id: 'gr_k3', icon: 'food', label: 'Olive Oil', x: 20, y: 55, interactive: true, learnTitle: 'Greek Olive Oil', learnContent: 'Greece produces the most olive oil per person in the world! Some olive trees in Greece are over 2,000 years old and still producing fruit. The olive branch is a universal symbol of peace.', auraReward: 8 },
          { id: 'gr_k4', icon: 'food', label: 'Honey Jar', x: 80, y: 30 },
          { id: 'gr_k5', icon: 'food', label: 'Baklava', x: 50, y: 65 },
        ],
      },
      {
        id: 'gr_mythology', name: 'Mythology Room', icon: 'history',
        wallColor: '#FFF8F0', floorColor: '#C8B8A0',
        objects: [
          { id: 'gr_m1', icon: 'history', label: 'Zeus Statue', x: 25, y: 20, interactive: true, learnTitle: 'Greek Gods', learnContent: 'The ancient Greeks believed 12 major gods lived on Mount Olympus. Zeus ruled the sky with thunder, Poseidon ruled the sea, and Athena was the goddess of wisdom. Each city had a patron god!', auraReward: 8 },
          { id: 'gr_m2', icon: 'star', label: 'Olympic Torch', x: 70, y: 30, interactive: true, learnTitle: 'Ancient Olympics', learnContent: 'The Olympics began in Olympia, Greece in 776 BC. Athletes competed naked! Events included chariot racing, wrestling, and the pentathlon. Wars were paused so athletes could travel safely to compete.', auraReward: 8 },
          { id: 'gr_m3', icon: 'book', label: 'Philosophy Scroll', x: 50, y: 55, interactive: true, learnTitle: 'Greek Philosophy', learnContent: 'Socrates, Plato, and Aristotle asked big questions like "What is justice?" and "What makes a good life?" Socrates taught by asking questions, not giving answers — the Socratic Method is still used in schools today!', auraReward: 8 },
          { id: 'gr_m4', icon: 'culture', label: 'Theater Mask', x: 85, y: 50 },
          { id: 'gr_m5', icon: 'map', label: 'Ancient Greek Map', x: 15, y: 45 },
        ],
      },
    ],
  },
};
