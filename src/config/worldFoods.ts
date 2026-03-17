import { BiteCategory, Recipe } from '../types';

export interface DishQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface WorldDish {
  id: string;
  name: string;
  country: string;
  countryName: string;
  region: string;
  category: BiteCategory;
  emoji: string;
  imageUrl: string;
  originStory: string;
  culturalSignificance: string;
  funFact: string;
  keyIngredients: string[];
  recipe: Recipe;
  quizQuestions: DishQuizQuestion[];
  tags: string[];
}

const COUNTRY_FLAGS: Record<string, string> = {
  jp: 'JP',
  fr: 'FR',
  mx: 'MX',
  it: 'IT',
  kr: 'KR',
  th: 'TH',
  in: 'IN',
  vn: 'VN',
  gb: 'GB',
  es: 'ES',
  de: 'DE',
  tr: 'TR',
  lb: 'LB',
  br: 'BR',
  pe: 'PE',
  us: 'US',
  ma: 'MA',
  ke: 'KE',
};

export const WORLD_DISHES: WorldDish[] = [
  {
    id: 'dish_jp_sushi',
    name: 'Sushi',
    country: 'jp',
    countryName: 'Japan',
    region: 'Asia',
    category: 'main_dish',
    emoji: '🍣',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&fit=crop',
    originStory: 'Early sushi began as a way to preserve fish with fermented rice in Japan. Over time it evolved into the fresh, delicate style served today.',
    culturalSignificance: 'Sushi highlights Japanese respect for seasonality, precision, and balance.',
    funFact: 'The word "sushi" refers to the seasoned rice, not just the fish on top.',
    keyIngredients: ['sushi rice', 'rice vinegar', 'nori', 'fish', 'soy sauce'],
    recipe: {
      ingredients: ['2 cups sushi rice', '3 tbsp rice vinegar', '1 tbsp sugar', 'nori sheets', 'sliced cucumber', 'sliced avocado', 'cooked or raw fish'],
      instructions: ['Cook the sushi rice and season it with vinegar, sugar, and a pinch of salt.', 'Lay nori on a bamboo mat and spread a thin layer of rice over it.', 'Add fillings in a line across the center.', 'Roll tightly, slice into pieces, and serve.'],
      prepTime: 25,
      cookTime: 20,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What does the word "sushi" mainly refer to?',
        options: ['Raw fish', 'Seasoned rice', 'Seaweed wrap', 'Soy sauce'],
        correctIndex: 1,
      },
      {
        question: 'What value is often reflected in sushi making?',
        options: ['Speed', 'Huge portions', 'Precision and balance', 'Heavy spices'],
        correctIndex: 2,
      },
    ],
    tags: ['rice', 'seafood', 'japanese', 'traditional'],
  },
  {
    id: 'dish_jp_ramen',
    name: 'Ramen',
    country: 'jp',
    countryName: 'Japan',
    region: 'Asia',
    category: 'soup',
    emoji: '🍜',
    imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&fit=crop',
    originStory: 'Ramen grew in Japan from noodle dishes influenced by Chinese cooking. Different regions created their own broths, toppings, and styles.',
    culturalSignificance: 'Ramen shops are everyday gathering places and regional pride points across Japan.',
    funFact: 'Some Japanese cities are famous for one ramen style, like miso ramen in Sapporo or tonkotsu in Fukuoka.',
    keyIngredients: ['noodles', 'broth', 'soy sauce', 'egg', 'green onion'],
    recipe: {
      ingredients: ['4 packs ramen noodles', '4 cups chicken broth', '2 tbsp soy sauce', '2 soft-boiled eggs', '2 green onions', '1 cup mushrooms'],
      instructions: ['Heat the broth with soy sauce until steaming.', 'Cook the noodles separately until just tender.', 'Divide noodles into bowls and pour the hot broth over them.', 'Top with eggs, mushrooms, and green onions.'],
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What helped inspire ramen in Japan?',
        options: ['French pastries', 'Chinese noodle dishes', 'Mexican street food', 'Indian curries'],
        correctIndex: 1,
      },
      {
        question: 'Why are some cities famous for ramen?',
        options: ['Each region created its own style', 'Only one city can serve it', 'It is only eaten at festivals', 'It has no broth differences'],
        correctIndex: 0,
      },
    ],
    tags: ['noodles', 'broth', 'japanese', 'comfort-food'],
  },
  {
    id: 'dish_jp_mochi',
    name: 'Mochi',
    country: 'jp',
    countryName: 'Japan',
    region: 'Asia',
    category: 'dessert',
    emoji: '🍡',
    imageUrl: 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=600&fit=crop',
    originStory: 'Mochi is made from pounded glutinous rice and has been enjoyed in Japan for centuries. It often appears during New Year celebrations and special ceremonies.',
    culturalSignificance: 'Mochi is tied to holidays, family traditions, and ideas of good luck.',
    funFact: 'Traditional mochi pounding, called mochitsuki, can be a team activity with one person pounding and another turning the dough.',
    keyIngredients: ['glutinous rice flour', 'water', 'sugar', 'cornstarch', 'red bean paste'],
    recipe: {
      ingredients: ['1 cup glutinous rice flour', '3/4 cup water', '1/4 cup sugar', 'cornstarch for dusting', '1/2 cup sweet red bean paste'],
      instructions: ['Mix rice flour, water, and sugar until smooth.', 'Microwave or steam the mixture until thick and stretchy.', 'Dust a surface with cornstarch and flatten the dough.', 'Wrap small pieces around red bean paste and seal.'],
      prepTime: 20,
      cookTime: 10,
      servings: 6,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What is mochi made from?',
        options: ['Potatoes', 'Pounded rice', 'Wheat noodles', 'Sesame seeds'],
        correctIndex: 1,
      },
      {
        question: 'Mochi is often connected to which kind of events?',
        options: ['Beach picnics only', 'New Year and ceremonies', 'Car races', 'School exams'],
        correctIndex: 1,
      },
    ],
    tags: ['dessert', 'rice', 'japanese', 'holiday'],
  },
  {
    id: 'dish_fr_croissant',
    name: 'Croissant',
    country: 'fr',
    countryName: 'France',
    region: 'Europe',
    category: 'breakfast',
    emoji: '🥐',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f575c4d?w=600&fit=crop',
    originStory: 'The croissant became a French bakery icon through careful lamination, where butter is folded into dough again and again. Bakers prize its flaky layers and golden crust.',
    culturalSignificance: 'Croissants are closely linked with French breakfast and neighborhood bakery culture.',
    funFact: 'A great croissant should be crisp outside, soft inside, and filled with many airy layers.',
    keyIngredients: ['flour', 'butter', 'milk', 'yeast', 'sugar'],
    recipe: {
      ingredients: ['3 cups flour', '1 cup cold butter', '1 cup milk', '2 tsp yeast', '2 tbsp sugar'],
      instructions: ['Make a soft yeast dough and chill it.', 'Fold cold butter into the dough several times to build layers.', 'Cut triangles and roll them into crescent shapes.', 'Bake until puffed and deeply golden.'],
      prepTime: 40,
      cookTime: 20,
      servings: 8,
      difficulty: 'hard',
    },
    quizQuestions: [
      {
        question: 'What gives a croissant its flaky texture?',
        options: ['Lots of syrup', 'Laminated butter layers', 'Boiling the dough', 'Rice flour'],
        correctIndex: 1,
      },
      {
        question: 'Croissants are especially tied to what in France?',
        options: ['Neighborhood bakery breakfasts', 'Late-night soups', 'Street festivals only', 'Mountain camping'],
        correctIndex: 0,
      },
    ],
    tags: ['bakery', 'french', 'breakfast', 'pastry'],
  },
  {
    id: 'dish_fr_ratatouille',
    name: 'Ratatouille',
    country: 'fr',
    countryName: 'France',
    region: 'Europe',
    category: 'main_dish',
    emoji: '🍆',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&fit=crop',
    originStory: 'Ratatouille comes from southern France, where summer vegetables are cooked slowly together. It began as a simple countryside dish and became a classic.',
    culturalSignificance: 'It celebrates seasonal produce and the relaxed cooking style of Provence.',
    funFact: 'Although it looks fancy in some versions, ratatouille started as a humble vegetable stew.',
    keyIngredients: ['eggplant', 'zucchini', 'tomatoes', 'bell pepper', 'olive oil'],
    recipe: {
      ingredients: ['1 eggplant', '2 zucchini', '3 tomatoes', '1 bell pepper', '1 onion', '2 tbsp olive oil'],
      instructions: ['Dice the vegetables into small pieces.', 'Saute onion and pepper in olive oil.', 'Add the remaining vegetables and cook slowly until soft.', 'Season and simmer until the flavors blend.'],
      prepTime: 20,
      cookTime: 35,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Where does ratatouille come from?',
        options: ['Northern Germany', 'Southern France', 'Mexico City', 'Tokyo'],
        correctIndex: 1,
      },
      {
        question: 'What does ratatouille celebrate?',
        options: ['Winter meats', 'Seasonal vegetables', 'Frozen desserts', 'Seafood only'],
        correctIndex: 1,
      },
    ],
    tags: ['vegetables', 'french', 'provence', 'seasonal'],
  },
  {
    id: 'dish_mx_tacos',
    name: 'Tacos',
    country: 'mx',
    countryName: 'Mexico',
    region: 'Americas',
    category: 'street_food',
    emoji: '🌮',
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&fit=crop',
    originStory: 'Tacos have deep roots in Mexican food history, where tortillas became a handy way to hold many fillings. They grew into beloved street food with countless regional styles.',
    culturalSignificance: 'Tacos show how one simple base can reflect local ingredients and family traditions.',
    funFact: 'A taco can change a lot from one region to another, from fish tacos by the coast to slow-cooked meats inland.',
    keyIngredients: ['corn tortillas', 'meat or beans', 'onion', 'cilantro', 'lime'],
    recipe: {
      ingredients: ['8 corn tortillas', '2 cups cooked filling', '1/2 onion', '1 handful cilantro', '2 limes'],
      instructions: ['Warm the tortillas in a dry pan.', 'Add the cooked filling to each tortilla.', 'Top with onion and cilantro.', 'Serve with lime wedges for squeezing.'],
      prepTime: 15,
      cookTime: 10,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Why are tacos so varied across Mexico?',
        options: ['Only one recipe is allowed', 'They reflect local ingredients and traditions', 'They are always dessert', 'They are never eaten outside homes'],
        correctIndex: 1,
      },
      {
        question: 'What is a common taco base?',
        options: ['Rice paper', 'Corn tortilla', 'Pizza dough', 'Croissant dough'],
        correctIndex: 1,
      },
    ],
    tags: ['street-food', 'mexican', 'tortilla', 'savory'],
  },
  {
    id: 'dish_mx_churros',
    name: 'Churros',
    country: 'mx',
    countryName: 'Mexico',
    region: 'Americas',
    category: 'dessert',
    emoji: '🍩',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&fit=crop',
    originStory: 'Churros are ridged fried pastries that became popular in Spanish-speaking countries, including Mexico. In Mexico they are often served warm with cinnamon sugar and chocolate.',
    culturalSignificance: 'They are a favorite treat for fairs, cafes, and family outings.',
    funFact: 'The ridged shape is not just pretty, it helps churros cook evenly and stay crisp.',
    keyIngredients: ['flour', 'water', 'butter', 'cinnamon', 'sugar'],
    recipe: {
      ingredients: ['1 cup water', '2 tbsp butter', '1 cup flour', '2 eggs', '1/2 cup sugar', '1 tsp cinnamon'],
      instructions: ['Boil water and butter, then stir in flour to make a dough.', 'Beat in eggs until smooth.', 'Pipe strips into hot oil and fry until golden.', 'Roll in cinnamon sugar before serving.'],
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'How are churros usually served in Mexico?',
        options: ['Cold with soy sauce', 'Warm with cinnamon sugar', 'With seaweed', 'Stuffed with rice'],
        correctIndex: 1,
      },
      {
        question: 'Why do churros have ridges?',
        options: ['Only for decoration', 'To hold soup', 'To help them cook evenly', 'To make them salty'],
        correctIndex: 2,
      },
    ],
    tags: ['dessert', 'mexican', 'fried', 'sweet'],
  },
  {
    id: 'dish_it_pizza_margherita',
    name: 'Pizza Margherita',
    country: 'it',
    countryName: 'Italy',
    region: 'Europe',
    category: 'main_dish',
    emoji: '🍕',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&fit=crop',
    originStory: 'Pizza Margherita is linked to Naples and is famous for its simple toppings of tomato, mozzarella, and basil. Its colors are often said to echo the Italian flag.',
    culturalSignificance: 'It represents the Italian love of quality ingredients used with restraint.',
    funFact: 'A classic Margherita depends as much on the dough and oven as the toppings.',
    keyIngredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil', 'olive oil'],
    recipe: {
      ingredients: ['1 pizza dough ball', '1/2 cup tomato sauce', '1 ball mozzarella', 'fresh basil leaves', '1 tbsp olive oil'],
      instructions: ['Stretch the dough into a round.', 'Spread a thin layer of tomato sauce over the surface.', 'Add mozzarella pieces and bake in a very hot oven.', 'Finish with basil and a drizzle of olive oil.'],
      prepTime: 20,
      cookTime: 12,
      servings: 2,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Pizza Margherita is most strongly linked to which Italian city?',
        options: ['Venice', 'Milan', 'Naples', 'Turin'],
        correctIndex: 2,
      },
      {
        question: 'What do the toppings on a Margherita often symbolize?',
        options: ['The Italian flag colors', 'The weather', 'The moon phases', 'A sports team'],
        correctIndex: 0,
      },
    ],
    tags: ['italian', 'pizza', 'naples', 'classic'],
  },
  {
    id: 'dish_it_gelato',
    name: 'Gelato',
    country: 'it',
    countryName: 'Italy',
    region: 'Europe',
    category: 'dessert',
    emoji: '🍨',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&fit=crop',
    originStory: 'Gelato became famous in Italy for its dense, smooth texture and rich flavor. It is churned more slowly than many ice creams, which keeps in less air.',
    culturalSignificance: 'Stopping for gelato is part of everyday strolling and social life in many Italian towns.',
    funFact: 'Because it contains less air, gelato can taste more intense even at a small serving size.',
    keyIngredients: ['milk', 'cream', 'sugar', 'egg yolks', 'vanilla'],
    recipe: {
      ingredients: ['2 cups milk', '1 cup cream', '1/2 cup sugar', '4 egg yolks', '1 tsp vanilla'],
      instructions: ['Warm the milk and cream gently.', 'Whisk yolks with sugar and slowly combine with the warm dairy.', 'Cook until slightly thick, then chill well.', 'Churn until smooth and freeze briefly before serving.'],
      prepTime: 25,
      cookTime: 15,
      servings: 6,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Why does gelato often taste intense?',
        options: ['It is full of air', 'It contains less air', 'It is always extra salty', 'It is served frozen solid'],
        correctIndex: 1,
      },
      {
        question: 'What is one social role of gelato in Italy?',
        options: ['Only ceremonial food', 'Part of everyday strolling and socializing', 'Only eaten for breakfast', 'Mainly airplane food'],
        correctIndex: 1,
      },
    ],
    tags: ['italian', 'dessert', 'cold', 'sweet'],
  },
  {
    id: 'dish_kr_kimchi',
    name: 'Kimchi',
    country: 'kr',
    countryName: 'South Korea',
    region: 'Asia',
    category: 'appetizer',
    emoji: '🥬',
    imageUrl: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=600&fit=crop',
    originStory: 'Kimchi developed in Korea as a way to preserve vegetables through fermentation. Today many households still keep family recipes and preferred flavors.',
    culturalSignificance: 'It is a symbol of Korean home cooking, shared meals, and food heritage.',
    funFact: 'There are hundreds of kimchi varieties, not just the spicy cabbage version many people know best.',
    keyIngredients: ['napa cabbage', 'gochugaru', 'garlic', 'ginger', 'salt'],
    recipe: {
      ingredients: ['1 napa cabbage', '2 tbsp salt', '2 tbsp gochugaru', '3 garlic cloves', '1 tsp ginger', '2 green onions'],
      instructions: ['Salt the cabbage and let it soften.', 'Make a paste with gochugaru, garlic, ginger, and a little water.', 'Coat the cabbage well with the paste.', 'Pack into a jar and let it ferment before chilling.'],
      prepTime: 30,
      cookTime: 0,
      servings: 6,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Why did kimchi first develop?',
        options: ['To preserve vegetables', 'To decorate tables', 'To replace bread', 'To sweeten tea'],
        correctIndex: 0,
      },
      {
        question: 'What makes kimchi especially connected to Korean families?',
        options: ['It is never homemade', 'It often follows family recipes', 'It can only be bought abroad', 'It is only one exact recipe'],
        correctIndex: 1,
      },
    ],
    tags: ['fermented', 'korean', 'vegetables', 'traditional'],
  },
  {
    id: 'dish_th_pad_thai',
    name: 'Pad Thai',
    country: 'th',
    countryName: 'Thailand',
    region: 'Asia',
    category: 'main_dish',
    emoji: '🍜',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&fit=crop',
    originStory: 'Pad Thai is a stir-fried noodle dish that became a national favorite in Thailand in the 20th century. It mixes sweet, sour, salty, and savory flavors in one plate.',
    culturalSignificance: 'It reflects the Thai love of balanced flavors and lively street food culture.',
    funFact: 'A squeeze of lime right before eating brightens the whole dish.',
    keyIngredients: ['rice noodles', 'tamarind', 'fish sauce', 'bean sprouts', 'peanuts'],
    recipe: {
      ingredients: ['8 oz rice noodles', '2 tbsp tamarind sauce', '1 tbsp fish sauce', '1 egg', '1 cup bean sprouts', '2 tbsp peanuts'],
      instructions: ['Soak the noodles until flexible.', 'Stir-fry the sauce ingredients, then add noodles and toss well.', 'Add egg and cook until set.', 'Finish with bean sprouts and peanuts.'],
      prepTime: 20,
      cookTime: 10,
      servings: 2,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Pad Thai is known for balancing which kinds of flavors?',
        options: ['Only sweet and creamy', 'Sweet, sour, salty, and savory', 'Only bitter and spicy', 'Salty and cold'],
        correctIndex: 1,
      },
      {
        question: 'What fresh finishing touch is often added to Pad Thai?',
        options: ['A lime squeeze', 'Maple syrup', 'Chocolate', 'Seaweed'],
        correctIndex: 0,
      },
    ],
    tags: ['thai', 'noodles', 'street-food', 'balanced-flavors'],
  },
  {
    id: 'dish_in_chai',
    name: 'Chai',
    country: 'in',
    countryName: 'India',
    region: 'Asia',
    category: 'drink',
    emoji: '🫖',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&fit=crop',
    originStory: 'Masala chai blends black tea with milk, sugar, and warming spices. It became a daily favorite across India and is often sold by street vendors and tea stalls.',
    culturalSignificance: 'Chai is about hospitality, conversation, and taking a shared pause in the day.',
    funFact: 'Families often have their own spice mix, so chai can taste a little different from one home to the next.',
    keyIngredients: ['black tea', 'milk', 'cardamom', 'ginger', 'sugar'],
    recipe: {
      ingredients: ['2 cups water', '1 cup milk', '2 tsp black tea', '4 cardamom pods', '1 tsp grated ginger', 'sugar to taste'],
      instructions: ['Simmer the water with cardamom and ginger.', 'Add tea leaves and cook briefly.', 'Pour in milk and sugar, then bring to a gentle boil.', 'Strain into cups and serve hot.'],
      prepTime: 10,
      cookTime: 10,
      servings: 2,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What does masala chai usually combine with black tea?',
        options: ['Pickles and rice', 'Milk, sugar, and spices', 'Seaweed and lemon', 'Yogurt and mint'],
        correctIndex: 1,
      },
      {
        question: 'Why is chai culturally important?',
        options: ['It is only for athletes', 'It supports hospitality and conversation', 'It is never shared', 'It is only served cold'],
        correctIndex: 1,
      },
    ],
    tags: ['tea', 'indian', 'spiced', 'drink'],
  },
  {
    id: 'dish_vn_pho',
    name: 'Pho',
    country: 'vn',
    countryName: 'Vietnam',
    region: 'Asia',
    category: 'soup',
    emoji: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&fit=crop',
    originStory: 'Pho is a Vietnamese noodle soup built around fragrant broth, rice noodles, and fresh herbs. It grew into a beloved everyday dish enjoyed morning, noon, or night.',
    culturalSignificance: 'Pho reflects the Vietnamese love of freshness, aroma, and customizable meals.',
    funFact: 'The fresh herbs and lime are added at the table, so each bowl can be adjusted to taste.',
    keyIngredients: ['rice noodles', 'broth', 'beef or chicken', 'herbs', 'lime'],
    recipe: {
      ingredients: ['8 oz rice noodles', '5 cups broth', '2 cups sliced beef or chicken', '1 handful basil', '1 lime', 'bean sprouts'],
      instructions: ['Heat the broth until fragrant and hot.', 'Cook the rice noodles according to package directions.', 'Place noodles in bowls and top with thin slices of meat.', 'Pour hot broth over the top and serve with herbs, sprouts, and lime.'],
      prepTime: 20,
      cookTime: 25,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What is one of the key ideas behind pho?',
        options: ['A fragrant broth with noodles and herbs', 'A dry pastry with jam', 'A fried dough snack', 'Only sweet ingredients'],
        correctIndex: 0,
      },
      {
        question: 'Why are herbs and lime often added at the table?',
        options: ['To make each bowl personal', 'To cool the bowl instantly', 'Because the broth is frozen', 'To replace the noodles'],
        correctIndex: 0,
      },
    ],
    tags: ['vietnamese', 'soup', 'herbs', 'noodles'],
  },
  // --- Batch 1: kr, th, in, gb ---
  {
    id: 'dish_kr_bibimbap',
    name: 'Bibimbap',
    country: 'kr',
    countryName: 'South Korea',
    region: 'Asia',
    category: 'main_dish',
    emoji: '🍚',
    imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&fit=crop',
    originStory: 'Bibimbap means "mixed rice" and likely originated from the practice of mixing leftover side dishes with rice before New Year so nothing went to waste.',
    culturalSignificance: 'The dish represents Korean balance—five colors symbolize the five elements of nature in traditional philosophy.',
    funFact: 'The sizzling stone-bowl version, dolsot bibimbap, creates a crispy rice crust at the bottom that Koreans prize as the best part.',
    keyIngredients: ['rice', 'gochujang', 'sesame oil', 'vegetables', 'egg', 'beef'],
    recipe: {
      ingredients: ['2 cups cooked rice', '1 cup seasoned vegetables (spinach, carrots, bean sprouts)', '2 tbsp gochujang', '1 tbsp sesame oil', '2 eggs', 'sliced beef or tofu'],
      instructions: ['Arrange cooked rice in a bowl.', 'Top with seasoned vegetables and protein in sections.', 'Fry an egg and place on top.', 'Add gochujang and sesame oil, then mix everything together before eating.'],
      prepTime: 30,
      cookTime: 15,
      servings: 2,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What does "bibimbap" literally mean?',
        options: ['Hot stone', 'Mixed rice', 'Spicy soup', 'Sweet pancake'],
        correctIndex: 1,
      },
      {
        question: 'What do the five colors in bibimbap represent?',
        options: ['Five seasons', 'Five Korean cities', 'Five elements of nature', 'Five royal families'],
        correctIndex: 2,
      },
    ],
    tags: ['korean', 'rice', 'vegetables', 'traditional'],
  },
  {
    id: 'dish_kr_tteokbokki',
    name: 'Tteokbokki',
    country: 'kr',
    countryName: 'South Korea',
    region: 'Asia',
    category: 'street_food',
    emoji: '🌶️',
    imageUrl: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=600&fit=crop',
    originStory: 'Once a royal court dish made with soy sauce, tteokbokki was reinvented in the 1950s with spicy gochujang and became Korea\'s most beloved street food.',
    culturalSignificance: 'Tteokbokki is the ultimate Korean comfort food, found at every street stall and school snack shop—it unites generations over shared plates.',
    funFact: 'Rice cakes for tteokbokki are so chewy because the dough is pounded dozens of times, giving them their signature bouncy texture.',
    keyIngredients: ['rice cakes', 'gochujang', 'sugar', 'fish cake', 'scallions'],
    recipe: {
      ingredients: ['400g cylindrical rice cakes', '3 tbsp gochujang', '1 tbsp sugar', '2 cups water', '2 sheets fish cake', 'scallions'],
      instructions: ['Soak rice cakes in warm water for 10 minutes.', 'Bring water, gochujang, and sugar to a boil.', 'Add rice cakes and fish cake, cook until sauce thickens.', 'Garnish with scallions and serve hot.'],
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What was tteokbokki\'s original sauce before the 1950s?',
        options: ['Gochujang', 'Soy sauce', 'Tomato sauce', 'Curry paste'],
        correctIndex: 1,
      },
      {
        question: 'What gives tteokbokki rice cakes their famous chewiness?',
        options: ['They are frozen overnight', 'The dough is pounded many times', 'They contain eggs', 'They are deep-fried first'],
        correctIndex: 1,
      },
    ],
    tags: ['korean', 'street_food', 'spicy', 'rice_cakes'],
  },
  {
    id: 'dish_th_green_curry',
    name: 'Green Curry',
    country: 'th',
    countryName: 'Thailand',
    region: 'Asia',
    category: 'main_dish',
    emoji: '🍛',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&fit=crop',
    originStory: 'Thai green curry gets its color from fresh green chilies pounded into a fragrant paste with herbs. It evolved from earlier Central Thai cooking traditions.',
    culturalSignificance: 'Curries sit at the heart of a Thai meal—each family has their own paste recipe, passed down through generations as a point of pride.',
    funFact: 'Despite its name, green curry is often the spiciest Thai curry because green chilies can be hotter than dried red ones.',
    keyIngredients: ['green curry paste', 'coconut milk', 'Thai basil', 'chicken', 'bamboo shoots', 'fish sauce'],
    recipe: {
      ingredients: ['3 tbsp green curry paste', '400ml coconut milk', '300g chicken', '1 cup bamboo shoots', 'Thai basil leaves', '2 tbsp fish sauce', '1 tbsp palm sugar'],
      instructions: ['Fry curry paste in a splash of coconut cream until fragrant.', 'Add chicken and cook through.', 'Pour in remaining coconut milk and bamboo shoots, simmer 10 minutes.', 'Season with fish sauce and sugar, stir in Thai basil, and serve with jasmine rice.'],
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What gives Thai green curry its green color?',
        options: ['Spinach', 'Fresh green chilies', 'Food coloring', 'Green tea'],
        correctIndex: 1,
      },
      {
        question: 'Compared to red curry, green curry is usually…',
        options: ['Milder', 'Spicier', 'Sweeter', 'Sour'],
        correctIndex: 1,
      },
    ],
    tags: ['thai', 'curry', 'coconut', 'spicy'],
  },
  {
    id: 'dish_th_mango_sticky_rice',
    name: 'Mango Sticky Rice',
    country: 'th',
    countryName: 'Thailand',
    region: 'Asia',
    category: 'dessert',
    emoji: '🥭',
    imageUrl: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=600&fit=crop',
    originStory: 'Mango sticky rice emerged as a seasonal treat during Thailand\'s mango harvest. Vendors began pairing the ripe fruit with sweetened glutinous rice and coconut cream.',
    culturalSignificance: 'It marks the arrival of mango season (April–May) and is a festive dessert shared at celebrations and sold from street carts across Bangkok.',
    funFact: 'Thai sticky rice is steamed in a special cone-shaped bamboo basket, not boiled in water like regular rice.',
    keyIngredients: ['glutinous rice', 'coconut milk', 'sugar', 'ripe mango', 'salt'],
    recipe: {
      ingredients: ['1 cup glutinous rice (soaked overnight)', '200ml coconut milk', '3 tbsp sugar', 'pinch of salt', '2 ripe mangoes'],
      instructions: ['Steam soaked sticky rice for 20 minutes.', 'Warm coconut milk with sugar and salt until dissolved.', 'Pour half the coconut sauce over hot rice, let it absorb.', 'Serve rice alongside sliced mango, drizzle remaining coconut sauce on top.'],
      prepTime: 15,
      cookTime: 25,
      servings: 2,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'How is Thai sticky rice traditionally cooked?',
        options: ['Boiled in water', 'Steamed in a bamboo basket', 'Fried in a wok', 'Baked in an oven'],
        correctIndex: 1,
      },
      {
        question: 'When is mango sticky rice most popular in Thailand?',
        options: ['Winter holidays', 'Mango season in April–May', 'Rainy season', 'Year-round equally'],
        correctIndex: 1,
      },
    ],
    tags: ['thai', 'dessert', 'mango', 'coconut', 'street_food'],
  },
  {
    id: 'dish_in_butter_chicken',
    name: 'Butter Chicken',
    country: 'in',
    countryName: 'India',
    region: 'Asia',
    category: 'main_dish',
    emoji: '🍗',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&fit=crop',
    originStory: 'Created in 1950s Delhi, butter chicken was born when cooks at Moti Mahal restaurant mixed leftover tandoori chicken into a rich tomato-and-butter gravy.',
    culturalSignificance: 'It became India\'s unofficial ambassador dish, loved globally as an accessible introduction to the depth of Indian spices.',
    funFact: 'Butter chicken, tikka masala, and dal makhani were all invented at the same Delhi restaurant by the same family of cooks.',
    keyIngredients: ['chicken', 'tomato', 'butter', 'cream', 'garam masala', 'ginger', 'garlic'],
    recipe: {
      ingredients: ['500g chicken thighs', '2 cups tomato puree', '3 tbsp butter', '1/2 cup cream', '1 tsp garam masala', '1 tsp cumin', 'ginger-garlic paste'],
      instructions: ['Marinate chicken in yogurt and spices for 1 hour.', 'Grill or pan-sear chicken until charred.', 'Simmer tomato puree with butter and spices for 15 minutes.', 'Add chicken and cream, cook 10 more minutes, serve with naan.'],
      prepTime: 70,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'How was butter chicken originally created?',
        options: ['Ancient Mughal recipe', 'Leftover tandoori chicken mixed with tomato gravy', 'British colonial invention', 'Vegetarian dish adapted with chicken'],
        correctIndex: 1,
      },
      {
        question: 'In which city was butter chicken invented?',
        options: ['Mumbai', 'Kolkata', 'Delhi', 'Chennai'],
        correctIndex: 2,
      },
    ],
    tags: ['indian', 'curry', 'chicken', 'creamy'],
  },
  {
    id: 'dish_in_samosa',
    name: 'Samosa',
    country: 'in',
    countryName: 'India',
    region: 'Asia',
    category: 'street_food',
    emoji: '🥟',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&fit=crop',
    originStory: 'The samosa traveled to India from Central Asia via medieval trade routes. Traders needed portable, shelf-stable food and the filled pastry was perfect.',
    culturalSignificance: 'Samosas are the heartbeat of Indian street food culture—sold at every corner, served at every celebration, and debated endlessly for whose recipe is best.',
    funFact: 'The samosa appears in a 10th-century Persian text under the name "sanbosag," making it over 1,000 years old.',
    keyIngredients: ['flour', 'potatoes', 'peas', 'cumin', 'coriander', 'green chilies', 'oil'],
    recipe: {
      ingredients: ['2 cups flour', '3 potatoes (boiled, mashed)', '1/2 cup peas', '1 tsp cumin seeds', '1 tsp coriander', 'green chilies to taste', 'oil for frying'],
      instructions: ['Make a firm dough with flour, water, and oil; rest 30 minutes.', 'Cook peas and mashed potatoes with spices for the filling.', 'Roll dough into semicircles, fill with potato mixture, seal into cones.', 'Deep-fry until golden and crispy, serve with chutney.'],
      prepTime: 40,
      cookTime: 20,
      servings: 8,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Where did the samosa originate before reaching India?',
        options: ['China', 'Central Asia', 'South America', 'Australia'],
        correctIndex: 1,
      },
      {
        question: 'Approximately how old is the samosa?',
        options: ['100 years', '500 years', 'Over 1,000 years', 'Only 50 years'],
        correctIndex: 2,
      },
    ],
    tags: ['indian', 'street_food', 'fried', 'vegetarian'],
  },
  {
    id: 'dish_in_naan',
    name: 'Naan',
    country: 'in',
    countryName: 'India',
    region: 'Asia',
    category: 'main_dish',
    emoji: '🫓',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&fit=crop',
    originStory: 'Naan has roots in ancient Persian and Mughal kitchens. The tandoor oven, brought to the Indian subcontinent centuries ago, gives naan its signature char and puff.',
    culturalSignificance: 'In many Indian households, bread is torn and shared from a communal plate, making naan a symbol of togetherness at the table.',
    funFact: 'A tandoor oven can reach 480 °C (900 °F)—naan cooks in just 60 to 90 seconds slapped against its inner wall.',
    keyIngredients: ['flour', 'yogurt', 'yeast', 'butter', 'garlic'],
    recipe: {
      ingredients: ['3 cups flour', '1/2 cup yogurt', '1 tsp yeast', '1 tsp sugar', 'warm water', '2 tbsp melted butter', 'minced garlic (optional)'],
      instructions: ['Mix flour, yeast, sugar, yogurt, and warm water into a soft dough.', 'Knead for 5 minutes, then let rise for 1 hour.', 'Divide into balls, roll into oval shapes.', 'Cook on a very hot skillet or under a broiler until puffed and charred, brush with garlic butter.'],
      prepTime: 75,
      cookTime: 10,
      servings: 6,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What type of oven gives naan its signature char?',
        options: ['Microwave', 'Tandoor', 'Convection oven', 'Slow cooker'],
        correctIndex: 1,
      },
      {
        question: 'How long does naan take to cook in a traditional tandoor?',
        options: ['10 minutes', '60 to 90 seconds', '30 minutes', '5 minutes'],
        correctIndex: 1,
      },
    ],
    tags: ['indian', 'bread', 'tandoor', 'garlic'],
  },
  {
    id: 'dish_gb_fish_and_chips',
    name: 'Fish and Chips',
    country: 'gb',
    countryName: 'United Kingdom',
    region: 'Europe',
    category: 'main_dish',
    emoji: '🐟',
    imageUrl: 'https://images.unsplash.com/photo-1579208030886-b1715a638711?w=600&fit=crop',
    originStory: 'Fish and chips became popular in 1860s England when railway networks made fresh fish available inland. Jewish immigrants introduced the battered-fish technique.',
    culturalSignificance: 'It\'s the original British takeaway—wrapped in paper, eaten by the seaside, and fiercely debated across regions for who does it best.',
    funFact: 'During World War II, fish and chips were one of the few foods never rationed in the UK because the government considered them too important for morale.',
    keyIngredients: ['white fish', 'flour', 'beer', 'potatoes', 'salt', 'malt vinegar'],
    recipe: {
      ingredients: ['4 fillets white fish (cod or haddock)', '1 cup flour', '1 cup cold beer', '4 large potatoes', 'oil for frying', 'salt', 'malt vinegar'],
      instructions: ['Cut potatoes into thick chips, soak in cold water, then dry.', 'Whisk flour and cold beer into a batter.', 'Dip fish fillets in batter and deep-fry until golden.', 'Fry chips until crispy, season with salt, serve with malt vinegar.'],
      prepTime: 20,
      cookTime: 25,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Why were fish and chips never rationed during WWII?',
        options: ['Fish was too expensive', 'They were considered vital for morale', 'No one ate them during the war', 'They were only served to soldiers'],
        correctIndex: 1,
      },
      {
        question: 'Which immigrant community introduced battered fish to England?',
        options: ['Italian', 'Jewish', 'French', 'Chinese'],
        correctIndex: 1,
      },
    ],
    tags: ['british', 'fried', 'seafood', 'classic'],
  },
  {
    id: 'dish_gb_scones',
    name: 'Scones',
    country: 'gb',
    countryName: 'United Kingdom',
    region: 'Europe',
    category: 'dessert',
    emoji: '🧁',
    imageUrl: 'https://images.unsplash.com/photo-1558303292-0c86921cac32?w=600&fit=crop',
    originStory: 'Scones trace back to 1500s Scotland, where they were originally flat oat cakes cooked on a griddle. The fluffy, baked version came later with the rise of baking powder.',
    culturalSignificance: 'Scones are the centerpiece of afternoon tea—a tradition started by Anna, Duchess of Bedford, in the 1840s to fill the gap between lunch and dinner.',
    funFact: 'The "cream tea" debate rages on: in Devon, cream goes on first; in Cornwall, it\'s jam first. Both sides feel very strongly about this.',
    keyIngredients: ['flour', 'butter', 'sugar', 'milk', 'baking powder', 'clotted cream', 'jam'],
    recipe: {
      ingredients: ['2 cups flour', '1 tbsp baking powder', '3 tbsp cold butter', '2 tbsp sugar', '3/4 cup milk', 'clotted cream', 'strawberry jam'],
      instructions: ['Mix flour, baking powder, and sugar; rub in cold butter.', 'Stir in milk until just combined—don\'t overwork.', 'Pat out, cut rounds, and bake at 220 °C (425 °F) for 12 minutes.', 'Serve warm with clotted cream and jam.'],
      prepTime: 15,
      cookTime: 12,
      servings: 8,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Who started the afternoon tea tradition?',
        options: ['Queen Victoria', 'Anna, Duchess of Bedford', 'King Henry VIII', 'Shakespeare'],
        correctIndex: 1,
      },
      {
        question: 'What is the Devon vs Cornwall scone debate about?',
        options: ['Sugar vs salt', 'Cream first vs jam first', 'Round vs square', 'Hot vs cold'],
        correctIndex: 1,
      },
    ],
    tags: ['british', 'dessert', 'tea', 'baking'],
  },
  {
    id: 'dish_gb_shepherds_pie',
    name: "Shepherd's Pie",
    country: 'gb',
    countryName: 'United Kingdom',
    region: 'Europe',
    category: 'main_dish',
    emoji: '🥧',
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&fit=crop',
    originStory: 'Shepherd\'s pie emerged in the 1700s as a thrifty way for rural families to repurpose leftover roast meat under a blanket of mashed potatoes.',
    culturalSignificance: 'It embodies British "waste-not" cooking—hearty, economical, and served in homes and pubs across the country for over 200 years.',
    funFact: 'Technically, it\'s only "shepherd\'s pie" if made with lamb. If beef is used, it\'s called "cottage pie"—and the British take this distinction very seriously.',
    keyIngredients: ['lamb mince', 'potatoes', 'onion', 'carrots', 'peas', 'Worcestershire sauce', 'butter'],
    recipe: {
      ingredients: ['500g lamb mince', '4 large potatoes', '1 onion', '2 carrots', '1/2 cup peas', '2 tbsp Worcestershire sauce', '3 tbsp butter', '1/2 cup milk'],
      instructions: ['Brown lamb mince with diced onion and carrots, add Worcestershire sauce and peas.', 'Boil and mash potatoes with butter and milk.', 'Pour the meat mixture into a baking dish, spread mash on top.', 'Bake at 200 °C (400 °F) for 25 minutes until the top is golden.'],
      prepTime: 20,
      cookTime: 40,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What meat makes it a "shepherd\'s" pie rather than a "cottage" pie?',
        options: ['Beef', 'Pork', 'Lamb', 'Chicken'],
        correctIndex: 2,
      },
      {
        question: 'Why was shepherd\'s pie originally invented?',
        options: ['For royal banquets', 'To use up leftover roast meat', 'As a competition dish', 'For vegetarians'],
        correctIndex: 1,
      },
    ],
    tags: ['british', 'comfort_food', 'lamb', 'potatoes'],
  },
  // --- Batch 2: es, de, tr, lb ---
  {
    id: 'dish_es_paella',
    name: 'Paella',
    country: 'es',
    countryName: 'Spain',
    region: 'Europe',
    category: 'main_dish',
    emoji: '🥘',
    imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&fit=crop',
    originStory: 'Paella originated with Valencian farmers and laborers who cooked rice over open fires with whatever was available—snails, rabbit, beans, and seasonal vegetables.',
    culturalSignificance: 'It is Spain\'s most iconic communal dish, cooked outdoors in wide shallow pans and shared family-style during Sunday gatherings.',
    funFact: 'True Valencians insist there is no chorizo in authentic paella—adding it is considered a culinary crime in the region.',
    keyIngredients: ['rice', 'saffron', 'chicken', 'seafood', 'olive oil', 'tomato'],
    recipe: {
      ingredients: ['2 cups bomba rice', 'pinch of saffron', '300g chicken thighs', '200g shrimp', '3 tbsp olive oil', '1 cup crushed tomato', 'chicken stock'],
      instructions: ['Sauté chicken in olive oil in a wide pan until golden.', 'Add tomato and cook down, then stir in rice and saffron.', 'Pour in hot stock, arrange shrimp on top.', 'Cook without stirring until rice absorbs liquid and a crispy crust (socarrat) forms on the bottom.'],
      prepTime: 15,
      cookTime: 40,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Where in Spain did paella originate?',
        options: ['Barcelona', 'Madrid', 'Valencia', 'Seville'],
        correctIndex: 2,
      },
      {
        question: 'What is the prized crispy bottom layer of paella called?',
        options: ['Socarrat', 'Sofrito', 'Salmorejo', 'Sangria'],
        correctIndex: 0,
      },
    ],
    tags: ['spanish', 'rice', 'seafood', 'saffron'],
  },
  {
    id: 'dish_es_gazpacho',
    name: 'Gazpacho',
    country: 'es',
    countryName: 'Spain',
    region: 'Europe',
    category: 'soup',
    emoji: '🍅',
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&fit=crop',
    originStory: 'Gazpacho has ancient Roman roots as a bread-and-garlic soup. After tomatoes arrived from the Americas in the 16th century, Andalusian cooks transformed it into the cold tomato soup we know today.',
    culturalSignificance: 'It is the taste of Spanish summer—served ice-cold to beat the Andalusian heat, it appears at every family table from June to September.',
    funFact: 'Traditional gazpacho is blended in a wooden bowl called a dornillo, and some families still pass their dornillo down through generations.',
    keyIngredients: ['tomatoes', 'cucumber', 'bell pepper', 'garlic', 'olive oil', 'bread', 'sherry vinegar'],
    recipe: {
      ingredients: ['6 ripe tomatoes', '1 cucumber', '1 bell pepper', '2 cloves garlic', '3 tbsp olive oil', '1 slice stale bread', '2 tbsp sherry vinegar'],
      instructions: ['Roughly chop all vegetables.', 'Soak bread in water for 5 minutes, squeeze out.', 'Blend everything together until smooth.', 'Chill for at least 2 hours, serve cold with a drizzle of olive oil.'],
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Gazpacho is traditionally served…',
        options: ['Boiling hot', 'Warm', 'Room temperature', 'Ice-cold'],
        correctIndex: 3,
      },
      {
        question: 'Which ingredient was NOT in the original Roman version of gazpacho?',
        options: ['Bread', 'Garlic', 'Tomatoes', 'Olive oil'],
        correctIndex: 2,
      },
    ],
    tags: ['spanish', 'soup', 'cold', 'summer', 'vegetarian'],
  },
  {
    id: 'dish_es_tortilla',
    name: 'Tortilla Española',
    country: 'es',
    countryName: 'Spain',
    region: 'Europe',
    category: 'main_dish',
    emoji: '🥚',
    imageUrl: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=600&fit=crop',
    originStory: 'The Spanish tortilla (potato omelette) appeared in the 19th century as a cheap, filling meal for peasants. Just eggs, potatoes, and olive oil fed entire families.',
    culturalSignificance: 'Every bar in Spain serves it as a tapa. The great national debate: should it be runny in the middle or fully cooked through?',
    funFact: 'A survey found that over 65% of Spaniards prefer their tortilla with the center still slightly runny—a style called "jugosa."',
    keyIngredients: ['eggs', 'potatoes', 'olive oil', 'onion', 'salt'],
    recipe: {
      ingredients: ['6 eggs', '4 medium potatoes', '1/2 cup olive oil', '1 onion (optional)', 'salt'],
      instructions: ['Thinly slice potatoes and fry gently in olive oil until tender.', 'Beat eggs in a bowl, season with salt.', 'Mix the cooked potatoes into the eggs and let rest 5 minutes.', 'Cook in a skillet on medium, flip with a plate, and cook the other side.'],
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What is the Spanish national debate about tortilla?',
        options: ['Size of the pan', 'Runny vs fully cooked center', 'With or without cheese', 'Hot vs cold'],
        correctIndex: 1,
      },
      {
        question: 'What are the essential ingredients of a tortilla española?',
        options: ['Flour and water', 'Eggs and potatoes', 'Rice and beans', 'Bread and tomato'],
        correctIndex: 1,
      },
    ],
    tags: ['spanish', 'eggs', 'potatoes', 'tapas'],
  },
  {
    id: 'dish_de_bratwurst',
    name: 'Bratwurst',
    country: 'de',
    countryName: 'Germany',
    region: 'Europe',
    category: 'street_food',
    emoji: '🌭',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&fit=crop',
    originStory: 'Bratwurst dates back to 1313 in the city of Nuremberg, where strict regulations controlled its size, ingredients, and preparation to maintain quality.',
    culturalSignificance: 'It is the centerpiece of German street food culture, served at markets, Christmas markets, and football stadiums across the country.',
    funFact: 'Germany has over 40 regional varieties of bratwurst—Nuremberg\'s are tiny (the size of a finger), while Thuringian ones are huge and heavily spiced.',
    keyIngredients: ['pork', 'veal', 'marjoram', 'caraway', 'bread roll', 'mustard'],
    recipe: {
      ingredients: ['4 bratwurst sausages', 'bread rolls', 'German mustard', 'sauerkraut (optional)', '1 tbsp oil'],
      instructions: ['Grill or pan-fry sausages over medium heat for 10–12 minutes, turning frequently.', 'Toast bread rolls lightly.', 'Serve sausage in the roll with a generous stripe of mustard.', 'Add sauerkraut on the side if desired.'],
      prepTime: 5,
      cookTime: 12,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Which German city is famous for its tiny finger-sized bratwurst?',
        options: ['Berlin', 'Munich', 'Nuremberg', 'Hamburg'],
        correctIndex: 2,
      },
      {
        question: 'Approximately how many regional bratwurst varieties exist in Germany?',
        options: ['5', '15', 'Over 40', 'Over 200'],
        correctIndex: 2,
      },
    ],
    tags: ['german', 'street_food', 'sausage', 'grilled'],
  },
  {
    id: 'dish_de_pretzel',
    name: 'Pretzel',
    country: 'de',
    countryName: 'Germany',
    region: 'Europe',
    category: 'street_food',
    emoji: '🥨',
    imageUrl: 'https://images.unsplash.com/photo-1574274194030-a3b64e2cfd46?w=600&fit=crop',
    originStory: 'Monks in southern Germany may have invented the pretzel shape in the Middle Ages, folding dough to resemble arms crossed in prayer.',
    culturalSignificance: 'The Brezel is a daily staple in Bavaria, eaten fresh from bakeries for breakfast or as a beer garden snack with white sausage and sweet mustard.',
    funFact: 'The dark brown crust comes from dipping the dough in a lye solution before baking—this chemical reaction creates the pretzel\'s unique flavor and shine.',
    keyIngredients: ['flour', 'yeast', 'butter', 'lye', 'coarse salt'],
    recipe: {
      ingredients: ['4 cups flour', '1 packet yeast', '2 tbsp butter', '1/4 cup baking soda (home lye substitute)', 'coarse salt', 'warm water'],
      instructions: ['Make a dough with flour, yeast, butter, and warm water; knead until smooth.', 'Divide into pieces, roll into ropes, and twist into pretzel shapes.', 'Dip each pretzel briefly in a baking soda bath.', 'Place on a baking sheet, sprinkle with coarse salt, bake at 230 °C (450 °F) for 12 minutes.'],
      prepTime: 30,
      cookTime: 12,
      servings: 8,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What gives pretzels their distinctive dark brown color?',
        options: ['Chocolate coating', 'A lye solution bath', 'Burnt sugar', 'Soy sauce glaze'],
        correctIndex: 1,
      },
      {
        question: 'Who is believed to have invented the pretzel shape?',
        options: ['Roman soldiers', 'German monks', 'French bakers', 'Swiss farmers'],
        correctIndex: 1,
      },
    ],
    tags: ['german', 'bread', 'baking', 'bavarian'],
  },
  {
    id: 'dish_de_black_forest_cake',
    name: 'Black Forest Cake',
    country: 'de',
    countryName: 'Germany',
    region: 'Europe',
    category: 'dessert',
    emoji: '🍰',
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&fit=crop',
    originStory: 'Named after the Black Forest region in southwest Germany, this layered cake was first documented in the 1930s, combining the area\'s famous cherries and kirsch (cherry brandy).',
    culturalSignificance: 'Schwarzwälder Kirschtorte is Germany\'s most famous dessert export, protected by strict guidelines—it must contain kirsch to earn its name.',
    funFact: 'In Germany, if a cake is labeled "Black Forest," it legally must contain at least 80ml of kirschwasser (cherry brandy) per kilogram of cream.',
    keyIngredients: ['chocolate', 'cherries', 'cream', 'kirsch', 'sugar', 'cocoa'],
    recipe: {
      ingredients: ['chocolate sponge layers', '2 cups cherries', '2 cups whipped cream', '3 tbsp kirsch', 'chocolate shavings', 'sugar'],
      instructions: ['Bake chocolate sponge layers and let cool.', 'Soak each layer with a mixture of cherry juice and kirsch.', 'Layer with whipped cream and cherries between each sponge.', 'Cover with cream, decorate with chocolate shavings and whole cherries.'],
      prepTime: 45,
      cookTime: 30,
      servings: 10,
      difficulty: 'hard',
    },
    quizQuestions: [
      {
        question: 'What must a Black Forest cake contain in Germany to use that name legally?',
        options: ['Strawberries', 'Kirsch (cherry brandy)', 'Coffee', 'Cinnamon'],
        correctIndex: 1,
      },
      {
        question: 'Which region of Germany is the cake named after?',
        options: ['Bavaria', 'The Rhine Valley', 'The Black Forest', 'Saxony'],
        correctIndex: 2,
      },
    ],
    tags: ['german', 'dessert', 'chocolate', 'cherries', 'cake'],
  },
  {
    id: 'dish_tr_baklava',
    name: 'Baklava',
    country: 'tr',
    countryName: 'Turkey',
    region: 'Middle East',
    category: 'dessert',
    emoji: '🍯',
    imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&fit=crop',
    originStory: 'Baklava was perfected in the Ottoman palace kitchens of Istanbul, where chefs layered paper-thin phyllo dough with pistachios and drenched it in syrup.',
    culturalSignificance: 'It is the crown jewel of Turkish desserts, served at weddings, religious holidays, and as a gesture of generosity and welcome.',
    funFact: 'The world\'s largest baklava was made in Turkey in 2018, weighing over 2,500 kg—about the same as a small car.',
    keyIngredients: ['phyllo dough', 'pistachios', 'butter', 'sugar', 'lemon juice', 'rose water'],
    recipe: {
      ingredients: ['1 package phyllo dough', '2 cups pistachios (chopped)', '1 cup melted butter', '1 cup sugar', '1 cup water', '1 tbsp lemon juice', 'splash of rose water'],
      instructions: ['Layer phyllo sheets in a buttered pan, brushing each with melted butter.', 'Spread a layer of chopped pistachios every 5–6 sheets.', 'Cut into diamond shapes and bake at 175 °C (350 °F) for 45 minutes.', 'Make syrup by boiling sugar, water, and lemon juice; add rose water. Pour hot syrup over the baked baklava and let soak.'],
      prepTime: 30,
      cookTime: 45,
      servings: 20,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Where was baklava perfected into its modern form?',
        options: ['Greek islands', 'Ottoman palace kitchens', 'Egyptian temples', 'Persian markets'],
        correctIndex: 1,
      },
      {
        question: 'What nut is most traditional in Turkish baklava?',
        options: ['Walnuts', 'Almonds', 'Pistachios', 'Cashews'],
        correctIndex: 2,
      },
    ],
    tags: ['turkish', 'dessert', 'pastry', 'pistachios', 'sweet'],
  },
  {
    id: 'dish_tr_kebab',
    name: 'Kebab',
    country: 'tr',
    countryName: 'Turkey',
    region: 'Middle East',
    category: 'main_dish',
    emoji: '🥩',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&fit=crop',
    originStory: 'Turkish soldiers grilled meat on their swords over open fires—this battlefield cooking evolved into the kebab tradition spanning hundreds of regional styles.',
    culturalSignificance: 'Kebab culture is central to Turkish social life; kebab houses are gathering places, and the döner kebab became the world\'s most popular street food.',
    funFact: 'The döner kebab was popularized in 1970s Berlin by Turkish immigrants, making it Germany\'s most-consumed fast food—more popular than hamburgers.',
    keyIngredients: ['lamb', 'onion', 'tomato', 'spices', 'flatbread', 'yogurt'],
    recipe: {
      ingredients: ['500g lamb or chicken', '1 onion', '2 tomatoes', '1 tsp cumin', '1 tsp paprika', 'flatbread', '1/2 cup yogurt'],
      instructions: ['Marinate cubed meat in spices, onion, and yogurt for at least 1 hour.', 'Thread onto skewers alternating with vegetables.', 'Grill over high heat, turning frequently, for 10–12 minutes.', 'Serve with warm flatbread, salad, and yogurt sauce.'],
      prepTime: 70,
      cookTime: 12,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Which city made the döner kebab a global street food phenomenon?',
        options: ['Istanbul', 'Berlin', 'London', 'Paris'],
        correctIndex: 1,
      },
      {
        question: 'How did the kebab tradition originally begin?',
        options: ['Palace chefs invented it', 'Soldiers grilled meat on swords over fires', 'Fishermen smoked fish on sticks', 'Farmers roasted vegetables'],
        correctIndex: 1,
      },
    ],
    tags: ['turkish', 'grilled', 'meat', 'street_food'],
  },
  {
    id: 'dish_tr_turkish_delight',
    name: 'Turkish Delight',
    country: 'tr',
    countryName: 'Turkey',
    region: 'Middle East',
    category: 'dessert',
    emoji: '🍬',
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&fit=crop',
    originStory: 'Known as lokum, Turkish delight was created in the late 1700s by confectioner Bekir Effendi, whose Istanbul shop still operates today after 200+ years.',
    culturalSignificance: 'Lokum is the traditional sweet offered to guests with Turkish coffee—refusing it would be impolite. It represents Turkish hospitality.',
    funFact: 'Turkish delight became famous in the West through C.S. Lewis\'s "The Chronicles of Narnia," where the White Witch uses it to tempt Edmund.',
    keyIngredients: ['sugar', 'cornstarch', 'rose water', 'pistachios', 'powdered sugar'],
    recipe: {
      ingredients: ['2 cups sugar', '1/2 cup cornstarch', '2 cups water', '1 tbsp rose water', '1/2 cup pistachios', 'powdered sugar for dusting'],
      instructions: ['Dissolve sugar in 1 cup water and bring to 118 °C (240 °F).', 'Mix cornstarch with remaining water, slowly add to the sugar syrup.', 'Stir constantly on low heat for 1 hour until very thick and pulling from sides.', 'Stir in rose water and pistachios, pour into a greased pan, cool overnight, cut and dust with powdered sugar.'],
      prepTime: 10,
      cookTime: 75,
      servings: 30,
      difficulty: 'hard',
    },
    quizQuestions: [
      {
        question: 'In which book series does Turkish delight play a famous role?',
        options: ['Harry Potter', 'The Chronicles of Narnia', 'Lord of the Rings', 'Percy Jackson'],
        correctIndex: 1,
      },
      {
        question: 'Turkish delight is traditionally served alongside…',
        options: ['Tea only', 'Turkish coffee', 'Lemonade', 'Nothing—it\'s eaten alone'],
        correctIndex: 1,
      },
    ],
    tags: ['turkish', 'dessert', 'candy', 'rose_water', 'traditional'],
  },
  {
    id: 'dish_lb_hummus',
    name: 'Hummus',
    country: 'lb',
    countryName: 'Lebanon',
    region: 'Middle East',
    category: 'main_dish',
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&fit=crop',
    originStory: 'Hummus has roots stretching back thousands of years in the Levant. A 13th-century Egyptian cookbook contains one of the earliest written recipes for it.',
    culturalSignificance: 'In Lebanon, hummus is more than a dip—it\'s a cultural identity. Families compete over whose recipe is creamiest, and entire restaurants are devoted solely to it.',
    funFact: 'Lebanon and Israel have competed for the world\'s largest plate of hummus. The current record is over 10,000 kg, set by Lebanon in 2010.',
    keyIngredients: ['chickpeas', 'tahini', 'lemon juice', 'garlic', 'olive oil'],
    recipe: {
      ingredients: ['2 cups cooked chickpeas', '1/4 cup tahini', '2 tbsp lemon juice', '1 clove garlic', '3 tbsp olive oil', 'salt', 'paprika for garnish'],
      instructions: ['Blend chickpeas, tahini, lemon juice, garlic, and a splash of cold water until very smooth.', 'Season with salt and blend again.', 'Spread on a plate, create a swirl with a spoon.', 'Drizzle generously with olive oil and sprinkle paprika.'],
      prepTime: 10,
      cookTime: 0,
      servings: 6,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What is tahini, a key hummus ingredient?',
        options: ['Ground sesame paste', 'Yogurt', 'Olive paste', 'Ground almonds'],
        correctIndex: 0,
      },
      {
        question: 'Which country holds the record for the world\'s largest plate of hummus?',
        options: ['Israel', 'Egypt', 'Lebanon', 'Syria'],
        correctIndex: 2,
      },
    ],
    tags: ['lebanese', 'dip', 'chickpeas', 'vegetarian', 'middle_eastern'],
  },
  {
    id: 'dish_lb_falafel',
    name: 'Falafel',
    country: 'lb',
    countryName: 'Lebanon',
    region: 'Middle East',
    category: 'street_food',
    emoji: '🧆',
    imageUrl: 'https://images.unsplash.com/photo-1593001872095-7d5b3868dd20?w=600&fit=crop',
    originStory: 'Falafel likely originated in Egypt as a Coptic Christian alternative to meat during Lent, made from fava beans. Lebanese cooks adapted it using chickpeas.',
    culturalSignificance: 'It is the king of Levantine street food—wrapped in pita with pickles and tahini, falafel is an everyday lunch across Beirut and the entire Middle East.',
    funFact: 'Despite being fried, falafel is considered health food in the Middle East because the base is just chickpeas, herbs, and spices—no meat, no dairy.',
    keyIngredients: ['chickpeas', 'parsley', 'cilantro', 'onion', 'garlic', 'cumin', 'oil'],
    recipe: {
      ingredients: ['2 cups dried chickpeas (soaked overnight)', '1 cup parsley', '1/2 cup cilantro', '1 onion', '3 cloves garlic', '1 tsp cumin', 'oil for frying'],
      instructions: ['Blend soaked (uncooked) chickpeas with herbs, onion, garlic, and spices until coarse.', 'Chill the mixture for 1 hour.', 'Shape into small balls or patties.', 'Deep-fry at 175 °C (350 °F) until golden brown, about 3–4 minutes.'],
      prepTime: 75,
      cookTime: 15,
      servings: 6,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What bean was originally used to make falafel in Egypt?',
        options: ['Chickpeas', 'Lentils', 'Fava beans', 'Black beans'],
        correctIndex: 2,
      },
      {
        question: 'Why was falafel originally created?',
        options: ['As a royal feast dish', 'As a meat alternative during Lent', 'To use up leftover bread', 'For long sea voyages'],
        correctIndex: 1,
      },
    ],
    tags: ['lebanese', 'street_food', 'fried', 'vegetarian', 'chickpeas'],
  },
  {
    id: 'dish_lb_tabbouleh',
    name: 'Tabbouleh',
    country: 'lb',
    countryName: 'Lebanon',
    region: 'Middle East',
    category: 'main_dish',
    emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&fit=crop',
    originStory: 'Tabbouleh is a salad from the mountains of Lebanon, where parsley grows abundantly. The key is that parsley is the star—not a garnish.',
    culturalSignificance: 'It is served at every Lebanese gathering, from casual lunches to weddings. Arguing about the right parsley-to-bulgur ratio is a national pastime.',
    funFact: 'In authentic Lebanese tabbouleh, parsley makes up about 80% of the salad. If you see mostly bulgur wheat, it\'s not the real thing.',
    keyIngredients: ['parsley', 'bulgur wheat', 'tomato', 'lemon juice', 'olive oil', 'mint'],
    recipe: {
      ingredients: ['3 large bunches parsley (finely chopped)', '2 tbsp fine bulgur wheat', '3 tomatoes (diced)', '1/4 cup lemon juice', '3 tbsp olive oil', 'fresh mint leaves', 'salt'],
      instructions: ['Soak bulgur in water for 15 minutes, drain and squeeze dry.', 'Finely chop the parsley (this takes patience—it should be very fine).', 'Toss parsley, bulgur, tomatoes, and mint together.', 'Dress with lemon juice and olive oil, season with salt. Serve immediately.'],
      prepTime: 25,
      cookTime: 0,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What is the main ingredient in authentic Lebanese tabbouleh?',
        options: ['Bulgur wheat', 'Lettuce', 'Parsley', 'Couscous'],
        correctIndex: 2,
      },
      {
        question: 'About what percentage of real tabbouleh is parsley?',
        options: ['20%', '50%', '80%', '100%'],
        correctIndex: 2,
      },
    ],
    tags: ['lebanese', 'salad', 'parsley', 'vegetarian', 'fresh'],
  },
  // --- Batch 3: br, pe, us, ma, ke ---
  {
    id: 'dish_br_acai',
    name: 'Açaí Bowl',
    country: 'br',
    countryName: 'Brazil',
    region: 'South America',
    category: 'dessert',
    emoji: '🫐',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&fit=crop',
    originStory: 'Indigenous Amazonian tribes have eaten açaí berries for centuries as a staple food. Surfers in Rio popularized the frozen bowl version in the 1970s.',
    culturalSignificance: 'Açaí is a Brazilian obsession—stands selling frozen bowls are on every street corner, and it fuels everyone from athletes to students.',
    funFact: 'An açaí palm can produce up to 20 kg of berries per year, and the berries must be processed within 24 hours of picking before they spoil.',
    keyIngredients: ['açaí berries', 'banana', 'granola', 'honey', 'guaraná syrup'],
    recipe: {
      ingredients: ['2 packets frozen açaí puree', '1 banana', '1/4 cup granola', '1 tbsp honey', 'sliced fruit for topping'],
      instructions: ['Blend frozen açaí with half the banana and a splash of juice until thick.', 'Pour into a bowl.', 'Top with granola, sliced banana, and other fruits.', 'Drizzle with honey and serve immediately.'],
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Where do açaí berries come from originally?',
        options: ['Southeast Asia', 'The Amazon rainforest', 'Hawaii', 'The Mediterranean'],
        correctIndex: 1,
      },
      {
        question: 'Who popularized the açaí bowl as we know it today?',
        options: ['French chefs', 'Brazilian surfers', 'Japanese monks', 'American health gurus'],
        correctIndex: 1,
      },
    ],
    tags: ['brazilian', 'dessert', 'healthy', 'fruit', 'superfood'],
  },
  {
    id: 'dish_br_feijoada',
    name: 'Feijoada',
    country: 'br',
    countryName: 'Brazil',
    region: 'South America',
    category: 'main_dish',
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&fit=crop',
    originStory: 'Feijoada evolved from Portuguese bean stews but was transformed in Brazil with black beans and various cuts of pork. It is considered Brazil\'s national dish.',
    culturalSignificance: 'Saturday is feijoada day across Brazil—families and restaurant crowds gather for the slow-cooked stew, always served with rice, farofa, and orange slices.',
    funFact: 'A proper feijoada takes at least 4 hours to cook, and some families start theirs the night before to let flavors deepen overnight.',
    keyIngredients: ['black beans', 'pork', 'sausage', 'rice', 'orange', 'garlic', 'bay leaf'],
    recipe: {
      ingredients: ['2 cups dried black beans (soaked overnight)', '300g pork ribs', '200g smoked sausage', 'garlic', 'bay leaves', 'cooked rice', 'orange slices'],
      instructions: ['Simmer soaked beans with pork ribs and bay leaves for 2–3 hours.', 'Add sliced sausage and garlic, cook another hour until thick.', 'Serve ladled over white rice.', 'Garnish with orange slices on the side—they aid digestion.'],
      prepTime: 30,
      cookTime: 240,
      servings: 8,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What day of the week is feijoada traditionally eaten in Brazil?',
        options: ['Monday', 'Wednesday', 'Saturday', 'Sunday'],
        correctIndex: 2,
      },
      {
        question: 'Why are orange slices served alongside feijoada?',
        options: ['For color', 'To aid digestion', 'They are used in the recipe', 'To replace dessert'],
        correctIndex: 1,
      },
    ],
    tags: ['brazilian', 'stew', 'beans', 'pork', 'national_dish'],
  },
  {
    id: 'dish_br_pao_de_queijo',
    name: 'Pão de Queijo',
    country: 'br',
    countryName: 'Brazil',
    region: 'South America',
    category: 'street_food',
    emoji: '🧀',
    imageUrl: 'https://images.unsplash.com/photo-1598142982127-18f0fe2a05c4?w=600&fit=crop',
    originStory: 'These cheese bread balls come from Minas Gerais, where slaves in the 18th century used tapioca flour (the only starch available) and mixed it with leftover cheese.',
    culturalSignificance: 'Pão de queijo is Brazil\'s most beloved snack—served warm at breakfast, coffee breaks, and parties. Every Brazilian has childhood memories of their aroma from the oven.',
    funFact: 'The dough is naturally gluten-free because it uses tapioca starch instead of wheat flour, making it one of the world\'s oldest gluten-free breads.',
    keyIngredients: ['tapioca flour', 'cheese', 'eggs', 'milk', 'oil'],
    recipe: {
      ingredients: ['2 cups tapioca flour', '1 cup grated cheese (queijo minas or Parmesan)', '2 eggs', '1/2 cup milk', '1/4 cup oil', 'salt'],
      instructions: ['Heat milk and oil together until just boiling.', 'Pour over tapioca flour and stir until a dough forms.', 'Let cool slightly, then mix in eggs and cheese.', 'Roll into small balls, bake at 190 °C (375 °F) for 20 minutes until golden and puffed.'],
      prepTime: 15,
      cookTime: 20,
      servings: 20,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Why is pão de queijo naturally gluten-free?',
        options: ['It uses rice flour', 'It uses tapioca starch', 'It has no flour at all', 'The cheese replaces flour'],
        correctIndex: 1,
      },
      {
        question: 'Which Brazilian state is pão de queijo from?',
        options: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia'],
        correctIndex: 2,
      },
    ],
    tags: ['brazilian', 'cheese', 'bread', 'snack', 'gluten_free'],
  },
  {
    id: 'dish_pe_ceviche',
    name: 'Ceviche',
    country: 'pe',
    countryName: 'Peru',
    region: 'South America',
    category: 'main_dish',
    emoji: '🐟',
    imageUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&fit=crop',
    originStory: 'Peruvian ceviche dates back to the Moche civilization 2,000 years ago, who marinated fish in fermented fruit juice. Spanish limes later replaced the fruit.',
    culturalSignificance: 'Ceviche is Peru\'s national dish with its own holiday—Día del Ceviche is celebrated every June 28. Lunchtime cevicherías are packed daily.',
    funFact: 'The citrus juice doesn\'t actually "cook" the fish—it denatures the proteins, changing the texture without heat, in a process called acid denaturation.',
    keyIngredients: ['white fish', 'lime juice', 'red onion', 'cilantro', 'chili pepper', 'sweet potato'],
    recipe: {
      ingredients: ['500g fresh white fish (cubed)', '1 cup lime juice', '1 red onion (thinly sliced)', 'cilantro', '1 chili pepper (minced)', 'boiled sweet potato slices', 'salt'],
      instructions: ['Toss cubed fish with lime juice and salt in a bowl.', 'Let marinate 15–20 minutes until the fish turns opaque.', 'Add sliced onion, cilantro, and chili.', 'Serve immediately with sweet potato slices and toasted corn.'],
      prepTime: 25,
      cookTime: 0,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'How does lime juice "cook" the fish in ceviche?',
        options: ['It heats the fish', 'It freezes the fish', 'It denatures the proteins with acid', 'It adds bacteria'],
        correctIndex: 2,
      },
      {
        question: 'When is Peru\'s Día del Ceviche celebrated?',
        options: ['January 1', 'June 28', 'December 25', 'October 31'],
        correctIndex: 1,
      },
    ],
    tags: ['peruvian', 'seafood', 'raw', 'citrus', 'national_dish'],
  },
  {
    id: 'dish_pe_lomo_saltado',
    name: 'Lomo Saltado',
    country: 'pe',
    countryName: 'Peru',
    region: 'South America',
    category: 'main_dish',
    emoji: '🥩',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop',
    originStory: 'Lomo saltado is the ultimate fusion dish: Chinese immigrants (chifa) brought wok-frying to Peru and combined it with local beef, potatoes, and ají peppers.',
    culturalSignificance: 'It represents Peru\'s multicultural identity—Chinese technique, Peruvian ingredients, and Spanish influences all on one plate.',
    funFact: 'Peru has more Chinese restaurants (called chifas) per capita than any country outside Asia, and lomo saltado is the dish that bridges both cultures.',
    keyIngredients: ['beef sirloin', 'onion', 'tomato', 'soy sauce', 'french fries', 'rice', 'ají amarillo'],
    recipe: {
      ingredients: ['400g beef sirloin (sliced)', '1 red onion (sliced)', '2 tomatoes (wedged)', '3 tbsp soy sauce', '1 tbsp vinegar', 'french fries', 'cooked rice'],
      instructions: ['Sear beef strips in a very hot wok until browned.', 'Add onion and tomato, toss quickly to keep vegetables crisp.', 'Deglaze with soy sauce and vinegar.', 'Toss in french fries and serve immediately alongside white rice.'],
      prepTime: 15,
      cookTime: 10,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Which immigrant community influenced lomo saltado\'s cooking technique?',
        options: ['Japanese', 'Italian', 'Chinese', 'African'],
        correctIndex: 2,
      },
      {
        question: 'What is unusual about serving lomo saltado?',
        options: ['It\'s served cold', 'It comes with both fries AND rice', 'It\'s always vegetarian', 'It\'s cooked underground'],
        correctIndex: 1,
      },
    ],
    tags: ['peruvian', 'beef', 'fusion', 'wok', 'chifa'],
  },
  {
    id: 'dish_us_clam_chowder',
    name: 'Clam Chowder',
    country: 'us',
    countryName: 'United States',
    region: 'North America',
    category: 'soup',
    emoji: '🥣',
    imageUrl: 'https://images.unsplash.com/photo-1588710920931-f9c66e14e299?w=600&fit=crop',
    originStory: 'New England clam chowder was invented by 18th-century fishermen in Massachusetts who combined their catch with salt pork, potatoes, and cream in a communal pot.',
    culturalSignificance: 'It is the soul of New England cuisine, served in bread bowls at Fisherman\'s Wharf and debated fiercely: cream-based (New England) vs tomato-based (Manhattan).',
    funFact: 'In 1939, a Maine legislator introduced a bill to make it illegal to put tomatoes in clam chowder. It didn\'t pass, but it shows how seriously New Englanders take it.',
    keyIngredients: ['clams', 'potatoes', 'cream', 'butter', 'onion', 'bacon'],
    recipe: {
      ingredients: ['2 cans clams (with juice)', '4 potatoes (diced)', '1 cup heavy cream', '3 strips bacon', '1 onion', '2 tbsp butter', '2 tbsp flour'],
      instructions: ['Cook bacon until crispy, remove and crumble. Sauté onion in the bacon fat.', 'Add butter and flour to make a roux, then pour in clam juice.', 'Add potatoes and simmer until tender.', 'Stir in clams and cream, heat through without boiling. Top with crumbled bacon.'],
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What distinguishes New England chowder from Manhattan chowder?',
        options: ['Noodles vs rice', 'Cream-based vs tomato-based', 'Fish vs chicken', 'Hot vs cold'],
        correctIndex: 1,
      },
      {
        question: 'A Maine legislator once tried to ban what ingredient from clam chowder?',
        options: ['Potatoes', 'Cream', 'Tomatoes', 'Clams'],
        correctIndex: 2,
      },
    ],
    tags: ['american', 'soup', 'seafood', 'creamy', 'new_england'],
  },
  {
    id: 'dish_us_bbq_ribs',
    name: 'BBQ Ribs',
    country: 'us',
    countryName: 'United States',
    region: 'North America',
    category: 'main_dish',
    emoji: '🍖',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop',
    originStory: 'American BBQ ribs trace back to Indigenous and African cooking traditions. Enslaved people in the South slow-cooked tough cuts over wood smoke, transforming them into tender, flavorful meals.',
    culturalSignificance: 'BBQ is a regional identity across America—Kansas City, Memphis, Texas, and the Carolinas all claim their style is the best and the original.',
    funFact: 'The four major BBQ regions each have a signature sauce: Kansas City (thick & sweet), Texas (no sauce needed), Carolina (vinegar-based), Memphis (dry rub).',
    keyIngredients: ['pork ribs', 'brown sugar', 'paprika', 'garlic powder', 'BBQ sauce', 'wood chips'],
    recipe: {
      ingredients: ['2 racks pork ribs', '1/4 cup brown sugar', '2 tbsp paprika', '1 tbsp garlic powder', '1 tbsp onion powder', 'BBQ sauce', 'salt and pepper'],
      instructions: ['Mix dry rub ingredients and coat ribs generously.', 'Wrap tightly in foil and bake at 135 °C (275 °F) for 3 hours.', 'Unwrap, brush with BBQ sauce.', 'Grill or broil for 10 minutes until caramelized and sticky.'],
      prepTime: 15,
      cookTime: 190,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'Which BBQ region is known for serving ribs without sauce?',
        options: ['Kansas City', 'Memphis', 'Texas', 'Carolina'],
        correctIndex: 2,
      },
      {
        question: 'What cooking traditions influenced American BBQ?',
        options: ['French and Italian', 'Indigenous and African', 'Chinese and Japanese', 'German and Swedish'],
        correctIndex: 1,
      },
    ],
    tags: ['american', 'bbq', 'pork', 'smoked', 'southern'],
  },
  {
    id: 'dish_us_cornbread',
    name: 'Cornbread',
    country: 'us',
    countryName: 'United States',
    region: 'North America',
    category: 'main_dish',
    emoji: '🌽',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&fit=crop',
    originStory: 'Native Americans taught European settlers to make bread from corn, as wheat didn\'t grow well in the New World. Cornbread became a survival staple of the American South.',
    culturalSignificance: 'It is the bread of Southern soul food—served with chili, collard greens, and fried chicken. The debate: should it be sweet or savory?',
    funFact: 'Southern purists insist real cornbread should NEVER contain sugar. Northern-style cornbread is sweeter and cake-like—this divide mirrors the Mason-Dixon line.',
    keyIngredients: ['cornmeal', 'buttermilk', 'eggs', 'butter', 'baking powder'],
    recipe: {
      ingredients: ['1.5 cups cornmeal', '1 cup buttermilk', '2 eggs', '3 tbsp melted butter', '1 tsp baking powder', '1/2 tsp salt'],
      instructions: ['Preheat a cast-iron skillet with butter in a 220 °C (425 °F) oven.', 'Mix cornmeal, baking powder, and salt. Stir in buttermilk and eggs.', 'Pour batter into the sizzling hot skillet.', 'Bake 20–25 minutes until golden with a crispy crust.'],
      prepTime: 10,
      cookTime: 25,
      servings: 8,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What is the great American cornbread debate?',
        options: ['Round vs square', 'Sweet vs savory', 'Yellow vs white', 'Thick vs thin'],
        correctIndex: 1,
      },
      {
        question: 'Who taught European settlers how to make corn-based bread?',
        options: ['African traders', 'Native Americans', 'Mexican explorers', 'French colonists'],
        correctIndex: 1,
      },
    ],
    tags: ['american', 'bread', 'corn', 'southern', 'soul_food'],
  },
  {
    id: 'dish_ma_tagine',
    name: 'Tagine',
    country: 'ma',
    countryName: 'Morocco',
    region: 'Africa',
    category: 'main_dish',
    emoji: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&fit=crop',
    originStory: 'The tagine is named after its cone-shaped clay cooking pot, used by Berber people for centuries. The lid traps steam and returns moisture, slow-cooking meat to extreme tenderness.',
    culturalSignificance: 'It is the centerpiece of Moroccan hospitality—guests are served tagine communally, eating from the same pot with bread, symbolizing shared generosity.',
    funFact: 'The cone shape of the tagine lid isn\'t just decorative—it acts as a natural condenser, recycling steam so the dish essentially bastes itself.',
    keyIngredients: ['lamb', 'preserved lemon', 'olives', 'saffron', 'onion', 'cinnamon'],
    recipe: {
      ingredients: ['500g lamb shoulder (cubed)', '1 preserved lemon', '1/2 cup green olives', 'pinch of saffron', '1 onion', '1 tsp cinnamon', '1 tsp ginger', 'olive oil'],
      instructions: ['Brown lamb in olive oil, then remove.', 'Sauté onion with spices until soft, return lamb.', 'Add water to cover, bring to a simmer, cook covered for 1.5 hours.', 'Add preserved lemon and olives for the last 15 minutes. Serve with bread.'],
      prepTime: 15,
      cookTime: 105,
      servings: 4,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What is special about the cone-shaped tagine lid?',
        options: ['It looks pretty', 'It traps and recycles steam', 'It lets smoke escape', 'It keeps the dish cold'],
        correctIndex: 1,
      },
      {
        question: 'Which people originally developed tagine cooking?',
        options: ['Romans', 'Berber people', 'Egyptians', 'Arabs'],
        correctIndex: 1,
      },
    ],
    tags: ['moroccan', 'stew', 'lamb', 'slow_cooked', 'traditional'],
  },
  {
    id: 'dish_ma_couscous',
    name: 'Moroccan Couscous',
    country: 'ma',
    countryName: 'Morocco',
    region: 'Africa',
    category: 'main_dish',
    emoji: '🍚',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&fit=crop',
    originStory: 'Couscous originated with Berber communities in North Africa over 1,000 years ago. The tiny granules are made by hand-rolling semolina with water—a skill passed between generations.',
    culturalSignificance: 'Friday couscous is a sacred tradition in Morocco. After prayers, families gather for the weekly feast—it is the most important meal of the week.',
    funFact: 'In 2020, UNESCO recognized couscous as an Intangible Cultural Heritage, shared by Morocco, Algeria, Tunisia, and Mauritania.',
    keyIngredients: ['couscous', 'vegetables', 'chickpeas', 'lamb', 'butter', 'saffron'],
    recipe: {
      ingredients: ['2 cups couscous', 'mixed vegetables (carrots, zucchini, turnips)', '1 cup chickpeas', '300g lamb', '2 tbsp butter', 'pinch of saffron', 'cinnamon'],
      instructions: ['Steam couscous in a couscoussier (or colander over a pot) for 20 minutes.', 'Simmer lamb and vegetables with saffron and cinnamon in a broth below.', 'Fluff couscous with butter, steam again.', 'Mound couscous on a platter, arrange meat and vegetables on top, ladle broth over.'],
      prepTime: 20,
      cookTime: 60,
      servings: 6,
      difficulty: 'medium',
    },
    quizQuestions: [
      {
        question: 'What day is the traditional couscous day in Morocco?',
        options: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
        correctIndex: 2,
      },
      {
        question: 'What international recognition did couscous receive in 2020?',
        options: ['World Record', 'UNESCO Intangible Cultural Heritage', 'Nobel Food Prize', 'Michelin Star'],
        correctIndex: 1,
      },
    ],
    tags: ['moroccan', 'couscous', 'communal', 'friday', 'traditional'],
  },
  {
    id: 'dish_ma_mint_tea',
    name: 'Moroccan Mint Tea',
    country: 'ma',
    countryName: 'Morocco',
    region: 'Africa',
    category: 'dessert',
    emoji: '🍵',
    imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&fit=crop',
    originStory: 'Moroccan mint tea arrived when British merchants introduced Chinese gunpowder green tea in the 18th century. Moroccans added fresh mint and generous sugar, making it uniquely their own.',
    culturalSignificance: 'Pouring tea is an art and a sign of respect. The host pours from a height to create a frothy top, and refusing tea is considered deeply rude.',
    funFact: 'The tea is always poured three times—there\'s a Moroccan saying: "The first glass is as gentle as life, the second is as strong as love, the third is as bitter as death."',
    keyIngredients: ['gunpowder green tea', 'fresh mint', 'sugar', 'boiling water'],
    recipe: {
      ingredients: ['2 tbsp gunpowder green tea', 'large bunch fresh mint', '4 tbsp sugar (or to taste)', '4 cups boiling water'],
      instructions: ['Rinse the tea in the pot with a splash of hot water (discard this first water).', 'Add fresh mint and sugar to the pot, fill with boiling water.', 'Let steep 3–4 minutes.', 'Pour from a height into small glasses to create froth, then pour back and repeat. Serve.'],
      prepTime: 5,
      cookTime: 5,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'Why does the host pour Moroccan tea from a height?',
        options: ['To cool it down', 'To create a frothy top', 'It\'s faster', 'To test the pot'],
        correctIndex: 1,
      },
      {
        question: 'How many times is Moroccan tea traditionally poured?',
        options: ['Once', 'Twice', 'Three times', 'Five times'],
        correctIndex: 2,
      },
    ],
    tags: ['moroccan', 'tea', 'mint', 'ceremony', 'hospitality'],
  },
  {
    id: 'dish_ke_ugali',
    name: 'Ugali',
    country: 'ke',
    countryName: 'Kenya',
    region: 'Africa',
    category: 'main_dish',
    emoji: '🫓',
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&fit=crop',
    originStory: 'Ugali is East Africa\'s answer to rice or bread—a dense cornmeal porridge that has been the staple food of Kenyan families for generations.',
    culturalSignificance: 'A Kenyan meal isn\'t complete without ugali. It is eaten by hand, pinched into balls, and used to scoop up stews and vegetables—a communal act of sharing.',
    funFact: 'Ugali has only two ingredients (cornmeal and water) but getting the perfect consistency—firm enough to pinch but not crumbly—is a skill that takes years to master.',
    keyIngredients: ['cornmeal', 'water'],
    recipe: {
      ingredients: ['2 cups white cornmeal (maize flour)', '4 cups water', 'pinch of salt'],
      instructions: ['Bring water to a boil in a heavy pot.', 'Slowly add cornmeal while stirring constantly to prevent lumps.', 'Keep stirring vigorously as the mixture thickens—this takes 10–15 minutes of strong stirring.', 'When it pulls cleanly from the sides, turn onto a plate and shape into a dome. Serve with sukuma wiki (collard greens) and stew.'],
      prepTime: 5,
      cookTime: 15,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'How many ingredients are in ugali?',
        options: ['5', '3', '2', '10'],
        correctIndex: 2,
      },
      {
        question: 'How is ugali traditionally eaten?',
        options: ['With a fork and knife', 'Pinched into balls by hand', 'With chopsticks', 'Sliced like bread'],
        correctIndex: 1,
      },
    ],
    tags: ['kenyan', 'staple', 'cornmeal', 'simple', 'east_african'],
  },
  {
    id: 'dish_ke_nyama_choma',
    name: 'Nyama Choma',
    country: 'ke',
    countryName: 'Kenya',
    region: 'Africa',
    category: 'main_dish',
    emoji: '🥩',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&fit=crop',
    originStory: 'Nyama choma literally means "roasted meat" in Swahili. It is the simplest concept—meat, fire, salt—but the technique of slow-roasting over charcoal makes it unforgettable.',
    culturalSignificance: 'It is Kenya\'s ultimate social food. Nyama choma joints line every road, and weekends revolve around gathering with friends over a shared platter of grilled goat or beef.',
    funFact: 'Goat is the preferred meat for nyama choma—Kenyans consume more goat meat per capita than almost any other country in the world.',
    keyIngredients: ['goat meat', 'salt', 'lime', 'chili', 'charcoal'],
    recipe: {
      ingredients: ['1 kg goat or beef ribs', 'coarse salt', '2 limes', 'chili sauce (kachumbari on the side)', 'charcoal for grilling'],
      instructions: ['Season meat generously with salt and a squeeze of lime.', 'Grill slowly over hot charcoal, turning occasionally, for 45–60 minutes.', 'The meat should be charred on the outside but juicy within.', 'Serve on a wooden board with ugali, kachumbari (tomato-onion salad), and cold drinks.'],
      prepTime: 10,
      cookTime: 60,
      servings: 4,
      difficulty: 'easy',
    },
    quizQuestions: [
      {
        question: 'What does "nyama choma" mean in Swahili?',
        options: ['Spicy stew', 'Roasted meat', 'Fried fish', 'Boiled beans'],
        correctIndex: 1,
      },
      {
        question: 'What is the most popular meat for nyama choma in Kenya?',
        options: ['Chicken', 'Beef', 'Goat', 'Pork'],
        correctIndex: 2,
      },
    ],
    tags: ['kenyan', 'grilled', 'goat', 'social', 'charcoal'],
  },
];

const _dishMap = new Map<string, WorldDish>();
const _countryDishMap = new Map<string, WorldDish[]>();

function _rebuildMaps() {
  _dishMap.clear();
  _countryDishMap.clear();
  WORLD_DISHES.forEach((dish) => {
    _dishMap.set(dish.id, dish);
    const list = _countryDishMap.get(dish.country) ?? [];
    list.push(dish);
    _countryDishMap.set(dish.country, list);
  });
}
_rebuildMaps();

export function getDishById(id: string): WorldDish | undefined {
  return _dishMap.get(id);
}

export function getDishesByCountry(countryId: string): WorldDish[] {
  return _countryDishMap.get(countryId) ?? [];
}

export function getDishCountryId(worldDishId: string): string | undefined {
  return _dishMap.get(worldDishId)?.country;
}

export function searchDishes(query: string): WorldDish[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return WORLD_DISHES;

  return WORLD_DISHES.filter((dish) => {
    const haystacks = [
      dish.name,
      dish.countryName,
      dish.region,
      dish.keyIngredients.join(' '),
      dish.tags.join(' '),
    ].join(' ').toLowerCase();

    return haystacks.includes(normalizedQuery);
  });
}

const COMMON_WRONG_INGREDIENTS = [
  'Ketchup', 'Maple Syrup', 'Cream Cheese', 'Wasabi',
  'Tortilla', 'Pasta', 'Soy Sauce', 'Mustard',
  'Peanut Butter', 'Marshmallows', 'Cornflakes', 'Chocolate Chips',
];

export interface CookingGameRecipe {
  name: string;
  country: string;
  correctIngredients: string[];
  wrongIngredients: string[];
  icon: string;
  isDiscovery?: boolean;
}

export function getDiscoveryCookingRecipes(discoveredDishIds: string[]): CookingGameRecipe[] {
  const recipes: CookingGameRecipe[] = [];
  for (const id of discoveredDishIds) {
    const dish = _dishMap.get(id);
    if (!dish) continue;
    if (!['main_dish', 'soup', 'street_food'].includes(dish.category)) continue;

    const correct = dish.keyIngredients
      .slice(0, 5)
      .map(i => i.charAt(0).toUpperCase() + i.slice(1));

    const otherDishIngredients = WORLD_DISHES
      .filter(d => d.id !== id)
      .flatMap(d => d.keyIngredients)
      .map(i => i.charAt(0).toUpperCase() + i.slice(1));

    const wrongPool = [...new Set([...COMMON_WRONG_INGREDIENTS, ...otherDishIngredients])]
      .filter(w => !correct.some(c => c.toLowerCase() === w.toLowerCase()));

    const wrong = wrongPool.sort(() => Math.random() - 0.5).slice(0, 3);

    recipes.push({
      name: `${dish.countryName} ${dish.name}`,
      country: dish.countryName,
      correctIngredients: correct,
      wrongIngredients: wrong,
      icon: 'food',
      isDiscovery: true,
    });
  }
  return recipes;
}

export function getCountriesWithDishes(): {
  id: string;
  name: string;
  flag: string;
  dishCount: number;
  region: string;
}[] {
  const countryMap = new Map<string, { id: string; name: string; flag: string; dishCount: number; region: string }>();

  WORLD_DISHES.forEach((dish) => {
    const current = countryMap.get(dish.country);
    if (current) {
      current.dishCount += 1;
      return;
    }

    countryMap.set(dish.country, {
      id: dish.country,
      name: dish.countryName,
      flag: COUNTRY_FLAGS[dish.country] ?? '',
      dishCount: 1,
      region: dish.region,
    });
  });

  return Array.from(countryMap.values());
}
