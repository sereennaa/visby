import React from 'react';
import Svg, { G, Path, Circle, Rect, Line, Polygon, Ellipse } from 'react-native-svg';
import { StyleSheet } from 'react-native';

type Props = {
  countryId: string;
  width: number;
  height: number;
};

const O = 0.12; // base decoration opacity

/**
 * Country-specific decorative SVG elements overlaid on the map.
 * Low-opacity illustrated accents that give each country character.
 */
export const CountryMapDecorations: React.FC<Props> = ({ countryId, width, height }) => {
  const decs = DECORATIONS[countryId];
  if (!decs) return null;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {decs}
    </Svg>
  );
};

// --- Japan: torii gate, Mt. Fuji, cherry blossom ---
const JapanDecorations = (
  <G opacity={O * 2.5}>
    {/* Mt. Fuji silhouette */}
    <Polygon points="88,35 94,22 100,35" fill="#8B6FC0" opacity={0.15} />
    <Polygon points="90,28 94,22 98,28" fill="#FFFFFF" opacity={0.2} />
    {/* Torii gate */}
    <G transform="translate(20, 70)">
      <Rect x="2" y="2" width="1" height="8" fill="#C76B6B" opacity={0.25} />
      <Rect x="9" y="2" width="1" height="8" fill="#C76B6B" opacity={0.25} />
      <Rect x="0" y="0" width="12" height="1.5" rx="0.5" fill="#C76B6B" opacity={0.3} />
      <Rect x="1" y="3" width="10" height="1" fill="#C76B6B" opacity={0.2} />
    </G>
    {/* Cherry blossoms */}
    <Circle cx="15" cy="20" r="1.5" fill="#FFB7C5" opacity={0.35} />
    <Circle cx="18" cy="17" r="1" fill="#FFC0CB" opacity={0.3} />
    <Circle cx="12" cy="23" r="1.2" fill="#FFB7C5" opacity={0.25} />
    <Circle cx="22" cy="15" r="0.8" fill="#FFDBE6" opacity={0.3} />
    <Circle cx="10" cy="18" r="1" fill="#FFB7C5" opacity={0.2} />
    {/* Wave lines (ocean) */}
    <Path d="M 2 50 Q 6 48 10 50 Q 14 52 18 50" stroke="#A8C8E0" strokeWidth="0.5" fill="none" opacity={0.2} />
    <Path d="M 5 55 Q 9 53 13 55 Q 17 57 21 55" stroke="#A8C8E0" strokeWidth="0.5" fill="none" opacity={0.15} />
  </G>
);

// --- France: Eiffel Tower, vineyard, baguette ---
const FranceDecorations = (
  <G opacity={O * 2.5}>
    {/* Eiffel Tower silhouette */}
    <G transform="translate(42, 28)">
      <Line x1="4" y1="0" x2="4" y2="12" stroke="#8B6FC0" strokeWidth="0.8" opacity={0.2} />
      <Line x1="1" y1="12" x2="7" y2="12" stroke="#8B6FC0" strokeWidth="0.6" opacity={0.2} />
      <Line x1="2" y1="8" x2="6" y2="8" stroke="#8B6FC0" strokeWidth="0.5" opacity={0.15} />
      <Line x1="0" y1="12" x2="4" y2="0" stroke="#8B6FC0" strokeWidth="0.4" opacity={0.12} />
      <Line x1="8" y1="12" x2="4" y2="0" stroke="#8B6FC0" strokeWidth="0.4" opacity={0.12} />
    </G>
    {/* Vineyard rows */}
    <G transform="translate(60, 70)" opacity={0.15}>
      <Ellipse cx="3" cy="2" rx="3" ry="1.5" fill="#6B9B6B" />
      <Ellipse cx="9" cy="2" rx="3" ry="1.5" fill="#6B9B6B" />
      <Ellipse cx="6" cy="5" rx="3" ry="1.5" fill="#6B9B6B" />
    </G>
    {/* Lavender dots */}
    <Circle cx="20" cy="60" r="1" fill="#9B6FA6" opacity={0.2} />
    <Circle cx="23" cy="62" r="0.8" fill="#9B6FA6" opacity={0.15} />
    <Circle cx="18" cy="63" r="1.2" fill="#D4A0D8" opacity={0.18} />
  </G>
);

// --- Mexico: pyramid, cactus, sun ---
const MexicoDecorations = (
  <G opacity={O * 2.5}>
    {/* Pyramid step */}
    <G transform="translate(35, 50)">
      <Polygon points="0,8 4,0 8,8" fill="#D4C090" opacity={0.2} />
      <Line x1="1" y1="6" x2="7" y2="6" stroke="#C4A86C" strokeWidth="0.4" opacity={0.15} />
      <Line x1="2" y1="4" x2="6" y2="4" stroke="#C4A86C" strokeWidth="0.4" opacity={0.12} />
    </G>
    {/* Cactus */}
    <G transform="translate(15, 35)">
      <Rect x="2" y="0" width="1.5" height="8" rx="0.5" fill="#6B9B6B" opacity={0.2} />
      <Path d="M 0 3 Q 0 1 2 3" fill="#6B9B6B" opacity={0.15} />
      <Path d="M 3.5 4 Q 6 2 5 4" fill="#6B9B6B" opacity={0.15} />
    </G>
    {/* Sun rays */}
    <Circle cx="85" cy="12" r="3" fill="#FFD700" opacity={0.1} />
    <Circle cx="85" cy="12" r="5" fill="#FFD700" opacity={0.05} />
  </G>
);

// --- Italy: Colosseum arches, gondola, olive branch ---
const ItalyDecorations = (
  <G opacity={O * 2.5}>
    {/* Colosseum arches */}
    <G transform="translate(45, 50)">
      <Path d="M 0 6 Q 2 2 4 6" stroke="#D4C090" strokeWidth="0.6" fill="none" opacity={0.2} />
      <Path d="M 4 6 Q 6 2 8 6" stroke="#D4C090" strokeWidth="0.6" fill="none" opacity={0.2} />
      <Path d="M 8 6 Q 10 2 12 6" stroke="#D4C090" strokeWidth="0.6" fill="none" opacity={0.2} />
      <Line x1="0" y1="6" x2="12" y2="6" stroke="#D4C090" strokeWidth="0.4" opacity={0.15} />
    </G>
    {/* Olive branch */}
    <G transform="translate(20, 30)" opacity={0.15}>
      <Path d="M 0 4 Q 4 2 8 4" stroke="#6B9B6B" strokeWidth="0.4" fill="none" />
      <Ellipse cx="2" cy="3" rx="1" ry="0.6" fill="#6B9B6B" />
      <Ellipse cx="5" cy="2.5" rx="1" ry="0.6" fill="#6B9B6B" />
      <Ellipse cx="7" cy="3.5" rx="1" ry="0.6" fill="#6B9B6B" />
    </G>
  </G>
);

// --- UK: Big Ben, crown, tea cup ---
const UKDecorations = (
  <G opacity={O * 2.5}>
    {/* Big Ben tower */}
    <G transform="translate(52, 44)">
      <Rect x="1" y="2" width="3" height="10" fill="#D4C090" opacity={0.2} />
      <Polygon points="0,2 2.5,0 5,2" fill="#D4C090" opacity={0.18} />
      <Rect x="0" y="10" width="5" height="1" fill="#D4C090" opacity={0.15} />
    </G>
    {/* Crown */}
    <G transform="translate(35, 20)" opacity={0.15}>
      <Path d="M 0 4 L 1 0 L 2 3 L 3 0 L 4 3 L 5 0 L 6 4 Z" fill="#FFD700" />
    </G>
    {/* Rolling hills */}
    <Path d="M 20 80 Q 35 72 50 80 Q 65 72 80 80" stroke="#6B9B6B" strokeWidth="0.5" fill="none" opacity={0.1} />
  </G>
);

// --- Brazil: Christ silhouette, tropical leaf, samba ---
const BrazilDecorations = (
  <G opacity={O * 2.5}>
    {/* Christ silhouette */}
    <G transform="translate(70, 65)">
      <Line x1="3" y1="0" x2="3" y2="8" stroke="#D4C090" strokeWidth="0.8" opacity={0.2} />
      <Line x1="0" y1="2" x2="6" y2="2" stroke="#D4C090" strokeWidth="0.7" opacity={0.2} />
      <Circle cx="3" cy="0" r="1.2" fill="#D4C090" opacity={0.15} />
    </G>
    {/* Tropical leaf */}
    <G transform="translate(25, 35)" opacity={0.15}>
      <Path d="M 0 6 Q 3 0 6 6" fill="#6B9B6B" />
      <Line x1="3" y1="1" x2="3" y2="6" stroke="#4A7A4A" strokeWidth="0.3" />
    </G>
    {/* Water ripples */}
    <Path d="M 55 85 Q 60 83 65 85 Q 70 87 75 85" stroke="#A8C8E0" strokeWidth="0.4" fill="none" opacity={0.15} />
  </G>
);

// --- South Korea: hanbok fan, palace roof ---
const KoreaDecorations = (
  <G opacity={O * 2.5}>
    {/* Palace roof (curved) */}
    <G transform="translate(40, 30)">
      <Path d="M 0 4 Q 5 0 10 4" stroke="#C76B6B" strokeWidth="0.6" fill="none" opacity={0.2} />
      <Rect x="1" y="4" width="8" height="5" fill="#D4C090" opacity={0.12} />
    </G>
    {/* Cherry blossom */}
    <Circle cx="60" cy="25" r="1.2" fill="#FFB7C5" opacity={0.25} />
    <Circle cx="63" cy="22" r="0.8" fill="#FFC0CB" opacity={0.2} />
  </G>
);

// --- Thailand: temple spire, lotus, elephant ---
const ThailandDecorations = (
  <G opacity={O * 2.5}>
    {/* Temple spire */}
    <G transform="translate(45, 18)">
      <Polygon points="3,0 0,10 6,10" fill="#FFD700" opacity={0.15} />
      <Rect x="1" y="10" width="4" height="2" fill="#D4C090" opacity={0.12} />
    </G>
    {/* Lotus */}
    <G transform="translate(25, 65)" opacity={0.18}>
      <Ellipse cx="3" cy="2" rx="2" ry="3" fill="#FFB7C5" />
      <Ellipse cx="6" cy="2" rx="2" ry="3" fill="#FFC0CB" />
      <Ellipse cx="4.5" cy="1" rx="1.5" ry="2.5" fill="#FFE0E8" />
    </G>
  </G>
);

// --- Morocco: arch, star, desert dunes ---
const MoroccoDecorations = (
  <G opacity={O * 2.5}>
    {/* Moorish arch */}
    <G transform="translate(30, 45)">
      <Path d="M 0 8 L 0 3 Q 4 -1 8 3 L 8 8" stroke="#D4C090" strokeWidth="0.6" fill="none" opacity={0.2} />
    </G>
    {/* Star pattern */}
    <G transform="translate(65, 30)" opacity={0.15}>
      <Polygon points="3,0 4,2 6,2 4.5,3.5 5,6 3,4.5 1,6 1.5,3.5 0,2 2,2" fill="#FFD700" />
    </G>
    {/* Desert dunes */}
    <Path d="M 50 80 Q 60 74 70 80 Q 80 74 90 80" stroke="#E8D5A3" strokeWidth="0.6" fill="none" opacity={0.15} />
    <Path d="M 55 84 Q 65 78 75 84" stroke="#D4C090" strokeWidth="0.4" fill="none" opacity={0.1} />
  </G>
);

// --- Peru: llama, Inca sun, mountains ---
const PeruDecorations = (
  <G opacity={O * 2.5}>
    {/* Mountain range */}
    <G transform="translate(15, 20)" opacity={0.15}>
      <Polygon points="0,10 5,2 10,10" fill="#8B8B8B" />
      <Polygon points="8,10 13,0 18,10" fill="#9B9B9B" />
      <Polygon points="12,4 13,0 14,4" fill="#FFFFFF" opacity={0.5} />
    </G>
    {/* Inca sun */}
    <Circle cx="75" cy="20" r="3" fill="#FFD700" opacity={0.12} />
    <G transform="translate(75, 20)" opacity={0.1}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <Line
          key={angle}
          x1={Math.cos((angle * Math.PI) / 180) * 4}
          y1={Math.sin((angle * Math.PI) / 180) * 4}
          x2={Math.cos((angle * Math.PI) / 180) * 6}
          y2={Math.sin((angle * Math.PI) / 180) * 6}
          stroke="#FFD700"
          strokeWidth="0.5"
        />
      ))}
    </G>
  </G>
);

// --- Kenya: acacia tree, shield, sunrise ---
const KenyaDecorations = (
  <G opacity={O * 2.5}>
    {/* Acacia tree */}
    <G transform="translate(20, 55)">
      <Rect x="3" y="4" width="1" height="6" fill="#8B5A3C" opacity={0.2} />
      <Ellipse cx="3.5" cy="3" rx="5" ry="2.5" fill="#6B9B6B" opacity={0.15} />
    </G>
    {/* Sunrise */}
    <G transform="translate(70, 15)" opacity={0.12}>
      <Circle cx="0" cy="0" r="4" fill="#FFD700" />
      <Path d="M -8 0 L 8 0" stroke="#FFD700" strokeWidth="0.3" />
    </G>
    {/* Maasai shield */}
    <G transform="translate(78, 60)" opacity={0.15}>
      <Ellipse cx="2" cy="4" rx="2" ry="4" fill="#C76B6B" />
      <Line x1="2" y1="0" x2="2" y2="8" stroke="#FFFFFF" strokeWidth="0.4" />
    </G>
  </G>
);

// --- Norway: fjord, aurora, Viking ship ---
const NorwayDecorations = (
  <G opacity={O * 2.5}>
    {/* Aurora lines */}
    <Path d="M 30 8 Q 45 4 60 8 Q 75 12 90 8" stroke="#43E97B" strokeWidth="0.6" fill="none" opacity={0.15} />
    <Path d="M 35 12 Q 50 8 65 12 Q 80 16 95 12" stroke="#38D9A9" strokeWidth="0.5" fill="none" opacity={0.12} />
    <Path d="M 25 16 Q 40 12 55 16" stroke="#5B9EE1" strokeWidth="0.4" fill="none" opacity={0.1} />
    {/* Viking ship */}
    <G transform="translate(12, 75)" opacity={0.15}>
      <Path d="M 0 4 Q 4 6 8 4 Q 4 8 0 4" fill="#8B5A3C" />
      <Line x1="4" y1="0" x2="4" y2="4" stroke="#8B5A3C" strokeWidth="0.5" />
      <Polygon points="4,0 4,3 6,2" fill="#D4C090" opacity={0.8} />
    </G>
  </G>
);

// --- Turkey: mosque dome, tulip, carpet ---
const TurkeyDecorations = (
  <G opacity={O * 2.5}>
    {/* Mosque dome + minaret */}
    <G transform="translate(60, 30)">
      <Path d="M 0 6 Q 4 0 8 6" fill="#D4C090" opacity={0.18} />
      <Rect x="9" y="1" width="0.8" height="7" fill="#D4C090" opacity={0.15} />
      <Circle cx="9.4" cy="0.8" r="0.6" fill="#D4C090" opacity={0.15} />
    </G>
    {/* Tulip */}
    <G transform="translate(30, 50)" opacity={0.18}>
      <Path d="M 1 0 Q 0 2 1 4 Q 2 2 3 0 Q 2 -0.5 1 0" fill="#C76B6B" />
      <Line x1="2" y1="4" x2="2" y2="7" stroke="#6B9B6B" strokeWidth="0.4" />
    </G>
  </G>
);

// --- Greece: column, amphora, olive ---
const GreeceDecorations = (
  <G opacity={O * 2.5}>
    {/* Doric column */}
    <G transform="translate(35, 35)">
      <Rect x="0" y="0" width="3" height="1" fill="#D4C090" opacity={0.2} />
      <Rect x="0.3" y="1" width="2.4" height="8" fill="#D4C090" opacity={0.18} />
      <Rect x="0" y="9" width="3" height="1" fill="#D4C090" opacity={0.2} />
      <Line x1="1" y1="1" x2="1" y2="9" stroke="#C4B090" strokeWidth="0.2" opacity={0.15} />
      <Line x1="2" y1="1" x2="2" y2="9" stroke="#C4B090" strokeWidth="0.2" opacity={0.15} />
    </G>
    {/* Olive branch */}
    <G transform="translate(55, 25)" opacity={0.15}>
      <Path d="M 0 3 Q 3 1 6 3" stroke="#6B9B6B" strokeWidth="0.3" fill="none" />
      <Ellipse cx="2" cy="2" rx="0.8" ry="0.5" fill="#6B9B6B" />
      <Ellipse cx="4" cy="2" rx="0.8" ry="0.5" fill="#6B9B6B" />
    </G>
    {/* Wave */}
    <Path d="M 60 80 Q 65 77 70 80 Q 75 83 80 80" stroke="#A8C8E0" strokeWidth="0.5" fill="none" opacity={0.15} />
  </G>
);

const DECORATIONS: Record<string, React.ReactElement> = {
  jp: JapanDecorations,
  fr: FranceDecorations,
  mx: MexicoDecorations,
  it: ItalyDecorations,
  gb: UKDecorations,
  br: BrazilDecorations,
  kr: KoreaDecorations,
  th: ThailandDecorations,
  ma: MoroccoDecorations,
  pe: PeruDecorations,
  ke: KenyaDecorations,
  no: NorwayDecorations,
  tr: TurkeyDecorations,
  gr: GreeceDecorations,
};

export default CountryMapDecorations;
