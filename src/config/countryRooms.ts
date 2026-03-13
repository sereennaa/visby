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
}

export interface HouseRoom {
  id: string;
  name: string;
  icon: string;
  wallColor: string;
  floorColor: string;
  objects: RoomObject[];
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
        objects: [
          { id: 'jp_l1', icon: 'culture', label: 'Paper Fan', x: 15, y: 25 },
          { id: 'jp_l2', icon: 'culture', label: 'Hina Dolls', x: 75, y: 20, interactive: true, learnTitle: 'Hina Dolls', learnContent: "These dolls are displayed during Hinamatsuri (Girls' Day) on March 3rd. Each doll represents a member of the imperial court — families pass them down for generations!", auraReward: 8 },
          { id: 'jp_l3', icon: 'cafe', label: 'Tea Set', x: 45, y: 55, interactive: true, learnTitle: 'Japanese Tea Ceremony', learnContent: 'The Japanese tea ceremony (Chadō) is an art form hundreds of years old. Every movement — from holding the bowl to sipping — has meaning. It teaches patience and respect.', auraReward: 8 },
          { id: 'jp_l4', icon: 'home', label: 'Kotatsu Table', x: 50, y: 70 },
          { id: 'jp_l5', icon: 'culture', label: 'Scroll Painting', x: 85, y: 15 },
        ],
      },
      {
        id: 'jp_kitchen', name: 'Kitchen', icon: 'food',
        wallColor: '#FFF5F5', floorColor: '#C9B99A',
        objects: [
          { id: 'jp_k1', icon: 'food', label: 'Sushi Plate', x: 30, y: 45, interactive: true, learnTitle: 'Sushi', learnContent: 'Real sushi is made with vinegared rice and fresh fish. In Japan, sushi chefs train for years — some spend 3 years just learning to cook rice properly!', auraReward: 8 },
          { id: 'jp_k2', icon: 'food', label: 'Ramen Bowl', x: 65, y: 50, interactive: true, learnTitle: 'Ramen', learnContent: 'Ramen comes in many styles: tonkotsu (pork bone), miso, shio (salt), and shoyu (soy sauce). Each region of Japan has its own special recipe!', auraReward: 8 },
          { id: 'jp_k3', icon: 'food', label: 'Chopsticks', x: 50, y: 65 },
          { id: 'jp_k4', icon: 'cafe', label: 'Teapot', x: 15, y: 30 },
          { id: 'jp_k5', icon: 'food', label: 'Dango', x: 80, y: 35, interactive: true, learnTitle: 'Dango', learnContent: 'Dango are sweet rice dumplings on a stick, often colored pink, white, and green. They\'re eaten during hanami (cherry blossom viewing) season!', auraReward: 8 },
        ],
      },
      {
        id: 'jp_garden', name: 'Zen Garden', icon: 'nature',
        wallColor: '#F0FFF0', floorColor: '#A8C8A0',
        objects: [
          { id: 'jp_g1', icon: 'nature', label: 'Cherry Tree', x: 20, y: 15, interactive: true, learnTitle: 'Sakura', learnContent: 'Cherry blossoms (sakura) bloom for just 1-2 weeks each spring. Japanese people celebrate with picnics under the trees — it reminds them that beautiful things are precious because they don\'t last forever.', auraReward: 8 },
          { id: 'jp_g2', icon: 'temple', label: 'Torii Gate', x: 75, y: 20, interactive: true, learnTitle: 'Torii Gates', learnContent: 'These red gates mark the entrance to Shinto shrines. Fushimi Inari in Kyoto has over 10,000 of them forming a tunnel path up a mountain!', auraReward: 8 },
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
        objects: [
          { id: 'fr_l1', icon: 'landmark', label: 'Eiffel Tower Model', x: 20, y: 20, interactive: true, learnTitle: 'Eiffel Tower', learnContent: "The Eiffel Tower was built in 1889 and was supposed to be temporary! It's 330 meters tall and gets repainted every 7 years — it takes 60 tons of paint.", auraReward: 8 },
          { id: 'fr_l2', icon: 'culture', label: 'Painting', x: 75, y: 15, interactive: true, learnTitle: 'French Art', learnContent: 'France is home to the Louvre, the world\'s largest museum. It would take 200 days to spend 30 seconds looking at each piece of art!', auraReward: 8 },
          { id: 'fr_l3', icon: 'star', label: 'Chandelier', x: 50, y: 10 },
          { id: 'fr_l4', icon: 'book', label: 'Bookshelf', x: 85, y: 45 },
          { id: 'fr_l5', icon: 'nature', label: 'Roses', x: 15, y: 55 },
        ],
      },
      {
        id: 'fr_kitchen', name: 'La Cuisine', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#D4C0A0',
        objects: [
          { id: 'fr_k1', icon: 'food', label: 'Croissants', x: 30, y: 40, interactive: true, learnTitle: 'Croissants', learnContent: 'A perfect croissant has 27 flaky layers! French bakers wake up at 3am to make them fresh. The word "croissant" means "crescent" because of its moon shape.', auraReward: 8 },
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
          { id: 'fr_g4', icon: 'nature', label: 'Lavender', x: 35, y: 70, interactive: true, learnTitle: 'Lavender Fields', learnContent: 'Lavender fields in Provence turn the landscape purple every June-August. The scent is used in perfumes — France is the perfume capital of the world!', auraReward: 8 },
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
        objects: [
          { id: 'mx_l1', icon: 'gift', label: 'Piñata', x: 50, y: 15, interactive: true, learnTitle: 'Piñatas', learnContent: 'Piñatas originated in Mexico for religious celebrations. The traditional star-shaped one has 7 points representing the seven deadly sins — breaking it represents overcoming them!', auraReward: 8 },
          { id: 'mx_l2', icon: 'culture', label: 'Guitar', x: 15, y: 35, interactive: true, learnTitle: 'Mariachi Music', learnContent: 'Mariachi bands wear trajes de charro (fancy suits) and play trumpets, violins, and guitars. UNESCO declared mariachi music an important cultural treasure!', auraReward: 8 },
          { id: 'mx_l3', icon: 'culture', label: 'Alebrije', x: 75, y: 40, interactive: true, learnTitle: 'Alebrijes', learnContent: 'Alebrijes are brightly colored fantasy creatures made of paper-mâché or carved wood. They were invented by Pedro Linares in 1936 during a fever dream!', auraReward: 8 },
          { id: 'mx_l4', icon: 'nature', label: 'Cactus', x: 85, y: 60 },
          { id: 'mx_l5', icon: 'culture', label: 'Frida Painting', x: 30, y: 20 },
        ],
      },
      {
        id: 'mx_kitchen', name: 'Cocina', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C8A870',
        objects: [
          { id: 'mx_k1', icon: 'food', label: 'Tacos', x: 35, y: 45, interactive: true, learnTitle: 'Tacos', learnContent: 'Tacos have been eaten in Mexico for thousands of years! There are over 20 types: al pastor (pork), carnitas, barbacoa, and many more. Each region has its specialty.', auraReward: 8 },
          { id: 'mx_k2', icon: 'food', label: 'Guacamole', x: 65, y: 40, interactive: true, learnTitle: 'Guacamole', learnContent: 'The word "guacamole" comes from the Aztec word "ahuacamolli" (avocado sauce). Mexico produces more avocados than any other country!', auraReward: 8 },
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
        objects: [
          { id: 'it_l1', icon: 'landmark', label: 'Colosseum Model', x: 20, y: 20, interactive: true, learnTitle: 'The Colosseum', learnContent: 'The Colosseum could hold 50,000 people! Romans watched gladiator battles, animal hunts, and even mock sea battles (they flooded the arena). It had a retractable roof made of sailcloth!', auraReward: 8 },
          { id: 'it_l2', icon: 'culture', label: 'Venice Mask', x: 75, y: 25, interactive: true, learnTitle: 'Carnival of Venice', learnContent: 'Venice\'s Carnival has been celebrated since the 12th century. Everyone wears elaborate masks — historically, this let rich and poor celebrate together as equals!', auraReward: 8 },
          { id: 'it_l3', icon: 'home', label: 'Vintage Sofa', x: 50, y: 55 },
          { id: 'it_l4', icon: 'culture', label: 'Violin', x: 85, y: 40, interactive: true, learnTitle: 'Italian Music', learnContent: 'Italy invented opera, and Stradivarius made the most famous violins ever in Cremona. Musical terms like piano, forte, and tempo are all Italian words!', auraReward: 8 },
          { id: 'it_l5', icon: 'time', label: 'Clock', x: 15, y: 35 },
        ],
      },
      {
        id: 'it_kitchen', name: 'Cucina', icon: 'food',
        wallColor: '#FFFFF0', floorColor: '#C8B090',
        objects: [
          { id: 'it_k1', icon: 'food', label: 'Pizza', x: 35, y: 40, interactive: true, learnTitle: 'Pizza', learnContent: "The original pizza Margherita was made in Naples in 1889 for Queen Margherita. The red tomato, white mozzarella, and green basil represent Italy's flag colors!", auraReward: 8 },
          { id: 'it_k2', icon: 'food', label: 'Pasta', x: 65, y: 45, interactive: true, learnTitle: 'Italian Pasta', learnContent: 'Italy has over 350 shapes of pasta! Each shape is designed to hold sauce differently. Italians eat about 23 kg of pasta per person per year.', auraReward: 8 },
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
        objects: [
          { id: 'gb_l1', icon: 'crown', label: 'Crown', x: 50, y: 15, interactive: true, learnTitle: 'The British Crown', learnContent: "The Imperial State Crown has 2,868 diamonds, 273 pearls, 17 sapphires, 11 emeralds, and 5 rubies! It's kept in the Tower of London and worn for the State Opening of Parliament.", auraReward: 8 },
          { id: 'gb_l2', icon: 'cafe', label: 'Tea Set', x: 25, y: 40, interactive: true, learnTitle: 'Afternoon Tea', learnContent: "Afternoon tea was invented by Duchess Anna of Bedford in the 1840s because she got hungry between lunch and dinner. Now it's a whole tradition with sandwiches, scones, and cakes!", auraReward: 8 },
          { id: 'gb_l3', icon: 'landmark', label: 'Big Ben Model', x: 75, y: 25, interactive: true, learnTitle: 'Big Ben', learnContent: "Big Ben is actually the name of the bell, not the tower! The tower is called Elizabeth Tower. The bell weighs 13.5 tons and has been keeping time since 1859.", auraReward: 8 },
          { id: 'gb_l4', icon: 'star', label: 'Paddington Bear', x: 15, y: 55 },
          { id: 'gb_l5', icon: 'home', label: 'Fireplace', x: 85, y: 50 },
        ],
      },
      {
        id: 'gb_kitchen', name: 'Kitchen', icon: 'cafe',
        wallColor: '#FFFFF5', floorColor: '#B8A898',
        objects: [
          { id: 'gb_k1', icon: 'food', label: 'Fish & Chips', x: 35, y: 40, interactive: true, learnTitle: 'Fish and Chips', learnContent: "Fish and chips became popular in the 1860s. British people eat 382 million portions per year! The traditional way is wrapped in paper with salt and vinegar.", auraReward: 8 },
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
};
