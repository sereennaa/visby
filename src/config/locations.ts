import { StampType } from '../types';

export interface SampleLocation {
  id: string;
  name: string;
  type: StampType;
  distanceKm: number;
  description: string;
}

export const SAMPLE_LOCATIONS: SampleLocation[] = [
  { id: '1',  name: 'Parc de la Ciutadella',    type: 'park',       distanceKm: 0.4,  description: 'Lush city park with a grand fountain and rowboats' },
  { id: '2',  name: 'Museu Picasso',             type: 'museum',     distanceKm: 0.7,  description: 'World-class collection of early Picasso works' },
  { id: '3',  name: 'Barceloneta Beach',         type: 'beach',      distanceKm: 1.1,  description: 'Golden sand beach along the Mediterranean' },
  { id: '4',  name: 'Gothic Quarter',            type: 'landmark',   distanceKm: 0.3,  description: 'Medieval streets and hidden plazas' },
  { id: '5',  name: 'Montserrat Trail',          type: 'mountain',   distanceKm: 42,   description: 'Dramatic serrated peaks with monastery views' },
  { id: '6',  name: 'Mercat de la Boqueria',     type: 'market',     distanceKm: 0.5,  description: 'Vibrant market overflowing with fresh produce' },
  { id: '7',  name: 'Café de l\'Acadèmia',       type: 'cafe',       distanceKm: 0.2,  description: 'Charming courtyard café with homemade cakes' },
  { id: '8',  name: 'Bunkers del Carmel',         type: 'hidden_gem', distanceKm: 3.8,  description: 'Secret hilltop lookout with 360° city views' },
  { id: '9',  name: 'Sagrada Família',            type: 'landmark',   distanceKm: 1.6,  description: "Gaudí's iconic basilica, still under construction" },
  { id: '10', name: 'El Nacional',                type: 'restaurant', distanceKm: 0.6,  description: 'Multi-space restaurant in a restored warehouse' },
  { id: '11', name: 'Jardins de Mossèn Costa',   type: 'park',       distanceKm: 2.5,  description: 'Hillside gardens with tulips and aquatic plants' },
  { id: '12', name: 'Platja de la Nova Icària',   type: 'beach',      distanceKm: 1.8,  description: 'Calm family-friendly beach near the marina' },
  { id: '13', name: 'Can Culleretes',             type: 'restaurant', distanceKm: 0.4,  description: "Barcelona's oldest restaurant, since 1786" },
  { id: '14', name: 'MACBA',                      type: 'museum',     distanceKm: 0.9,  description: 'Contemporary art museum with a lively plaza' },
  { id: '15', name: 'Santa Caterina Market',      type: 'market',     distanceKm: 0.6,  description: 'Colorful wavy-roofed market with local bites' },
  { id: '16', name: 'Antiga Forn del Passeig',    type: 'cafe',       distanceKm: 1.0,  description: 'Century-old bakery with flaky ensaïmadas' },
  { id: '17', name: 'Palau de la Música',         type: 'landmark',   distanceKm: 0.5,  description: 'Ornate Art Nouveau concert hall' },
  { id: '18', name: 'El Jardí Secret',            type: 'hidden_gem', distanceKm: 1.3,  description: 'Walled garden tucked behind an old chapel' },
  { id: '19', name: 'Tibidabo',                   type: 'mountain',   distanceKm: 8.5,  description: 'Hilltop amusement park with panoramic views' },
  { id: '20', name: 'Fundació Joan Miró',         type: 'museum',     distanceKm: 2.2,  description: "Bright spaces showcasing Miró's playful art" },
  { id: '21', name: 'La Paradeta',                type: 'restaurant', distanceKm: 0.8,  description: 'Pick-your-own seafood cooked to order' },
  { id: '22', name: 'Parc del Laberint d\'Horta', type: 'park',       distanceKm: 6.0,  description: 'Oldest garden in the city with a hedge maze' },
  { id: '23', name: 'Passatge de les Manufactures', type: 'hidden_gem', distanceKm: 0.9, description: 'Tiny alley of street art and vintage shops' },
  { id: '24', name: 'Sant Pau Art Nouveau Site',  type: 'landmark',   distanceKm: 1.9,  description: 'UNESCO World Heritage hospital complex' },
];
