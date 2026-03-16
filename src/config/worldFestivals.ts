/**
 * World festivals: celebrations from different places for the story arc.
 * Used in story chapters and to theme country discovery (Holi, lanterns, apres ski, etc.).
 */

export interface WorldFestival {
  id: string;
  name: string;
  countryId: string;
  countryName: string;
  /** Short kid-friendly description */
  description: string;
  /** When it's typically celebrated (e.g. "March", "Mid-Autumn") */
  when: string;
  /** Icon hint for UI */
  icon: string;
}

export const WORLD_FESTIVALS: WorldFestival[] = [
  { id: 'holi', name: 'Holi', countryId: 'in', countryName: 'India', description: 'The festival of colors! People throw bright powder and water to celebrate spring.', when: 'March', icon: 'sparkles' },
  { id: 'lantern', name: 'Lantern Festival', countryId: 'cn', countryName: 'China', description: 'Thousands of glowing lanterns light up the night to mark the end of Lunar New Year.', when: 'February', icon: 'star' },
  { id: 'pingxi', name: 'Pingxi Lantern Festival', countryId: 'tw', countryName: 'Taiwan', description: 'People release sky lanterns and make wishes. The sky fills with floating lights!', when: 'February', icon: 'star' },
  { id: 'apres_ski', name: 'Apres Ski', countryId: 'at', countryName: 'Austria', description: 'After a day on the slopes, skiers gather for hot chocolate, music, and cozy fun in the Alps.', when: 'Winter', icon: 'flame' },
  { id: 'carnival_br', name: 'Carnival', countryId: 'br', countryName: 'Brazil', description: 'Parades, samba dancing, and colorful costumes take over the streets!', when: 'February', icon: 'sparkles' },
  { id: 'day_of_dead', name: 'Dia de los Muertos', countryId: 'mx', countryName: 'Mexico', description: 'A joyful celebration to remember loved ones with flowers, music, and sugar skulls.', when: 'November', icon: 'heart' },
  { id: 'songkran', name: 'Songkran', countryId: 'th', countryName: 'Thailand', description: 'The Thai New Year water festival — everyone has giant water fights in the streets!', when: 'April', icon: 'sparkles' },
  { id: 'hanami', name: 'Hanami', countryId: 'jp', countryName: 'Japan', description: 'Cherry blossom viewing! Families picnic under pink trees and celebrate spring.', when: 'March–April', icon: 'nature' },
  { id: 'oktoberfest', name: 'Oktoberfest', countryId: 'de', countryName: 'Germany', description: 'The world\'s biggest folk festival with parades, music, and traditional Bavarian fun.', when: 'September–October', icon: 'culture' },
  { id: 'la_tomatina', name: 'La Tomatina', countryId: 'es', countryName: 'Spain', description: 'A giant tomato fight in the streets! Everyone gets messy and has a blast.', when: 'August', icon: 'food' },
  { id: 'diwali', name: 'Diwali', countryId: 'in', countryName: 'India', description: 'The festival of lights. People light lamps, share sweets, and celebrate good over evil.', when: 'October–November', icon: 'star' },
  { id: 'mardi_gras', name: 'Mardi Gras', countryId: 'us', countryName: 'USA', description: 'New Orleans throws a huge party with beads, masks, and parades before Lent.', when: 'February–March', icon: 'sparkles' },
  { id: 'mid_autumn', name: 'Mid-Autumn Festival', countryId: 'cn', countryName: 'China', description: 'Families share mooncakes and admire the full moon. Lanterns glow everywhere.', when: 'September', icon: 'star' },
  { id: 'loy_krathong', name: 'Loy Krathong', countryId: 'th', countryName: 'Thailand', description: 'People float banana-leaf boats with candles on the water and make wishes.', when: 'November', icon: 'star' },
  { id: 'junkanoo', name: 'Junkanoo', countryId: 'jm', countryName: 'Jamaica', description: 'A parade with amazing costumes, drums, and dancing at dawn on Boxing Day!', when: 'December', icon: 'culture' },
  { id: 'crop_over', name: 'Crop Over', countryId: 'bb', countryName: 'Barbados', description: 'A harvest festival with music, dancing, and colorful costumes in the Caribbean sun.', when: 'July–August', icon: 'sparkles' },
  { id: 'midnight_sun', name: 'Midnight Sun', countryId: 'no', countryName: 'Norway', description: 'In summer the sun barely sets. People celebrate with bonfires, music, and long sunny nights.', when: 'June', icon: 'star' },
  { id: 'up_helly_aa', name: 'Up Helly Aa', countryId: 'gb', countryName: 'UK', description: 'A Viking fire festival in Scotland! A torchlit parade and a Viking longship set ablaze.', when: 'January', icon: 'flame' },
  { id: 'santorini', name: 'Santorini Summer', countryId: 'gr', countryName: 'Greece', description: 'Greek islands celebrate with music, feasts, and sunset parties by the sea.', when: 'Summer', icon: 'sparkles' },
  { id: 'beer_spa', name: 'Czech Beer Culture', countryId: 'cz', countryName: 'Czech Republic', description: 'The Czechs love their beer! Festivals and cozy pubs celebrate the world\'s best pilsner.', when: 'Year-round', icon: 'culture' },
  { id: 'apres_ski_ch', name: 'Apres Ski', countryId: 'ch', countryName: 'Switzerland', description: 'After skiing in the Alps, everyone gathers for hot chocolate, cheese, and cozy mountain fun.', when: 'Winter', icon: 'flame' },
  { id: 'tango_marathon', name: 'Tango Festival', countryId: 'ar', countryName: 'Argentina', description: 'Dancers from around the world come to Buenos Aires for tango under the stars.', when: 'August', icon: 'culture' },
  { id: 'carnival_venice', name: 'Carnevale di Venezia', countryId: 'it', countryName: 'Italy', description: 'Venice fills with masked balls, costumes, and canals lit by lanterns.', when: 'February', icon: 'star' },
  { id: 'bastille', name: 'Bastille Day', countryId: 'fr', countryName: 'France', description: 'France\'s national day: parades, fireworks, and dancing in the streets.', when: 'July', icon: 'sparkles' },
  { id: 'hue_lantern', name: 'Hoi An Lantern Festival', countryId: 'vn', countryName: 'Vietnam', description: 'The ancient town lights up with thousands of silk lanterns on the river.', when: 'Monthly full moon', icon: 'star' },
  { id: 'dubai_lights', name: 'Dubai Shopping Festival', countryId: 'ae', countryName: 'UAE', description: 'Fireworks, concerts, and celebrations light up the desert city.', when: 'December–January', icon: 'sparkles' },
  { id: 'carnival_dom', name: 'Carnival', countryId: 'do', countryName: 'Dominican Republic', description: 'Colorful parades, merengue music, and costumes fill the streets.', when: 'February', icon: 'culture' },
  { id: 'intakoza', name: 'Intakoza', countryId: 'mg', countryName: 'Madagascar', description: 'A celebration of the first harvest with music, dance, and family feasts.', when: 'June', icon: 'nature' },
  { id: 'wildebeest', name: 'Great Migration', countryId: 'tz', countryName: 'Tanzania', description: 'Millions of wildebeest cross the plains. Communities celebrate with storytelling and feasts.', when: 'July–October', icon: 'nature' },
];

/** Get festivals for a country (for story arc / discovery) */
export function getFestivalsForCountry(countryId: string): WorldFestival[] {
  return WORLD_FESTIVALS.filter((f) => f.countryId === countryId);
}

/** Get a festival by id */
export function getFestivalById(id: string): WorldFestival | undefined {
  return WORLD_FESTIVALS.find((f) => f.id === id);
}
