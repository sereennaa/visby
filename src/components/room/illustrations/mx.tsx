import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const Pinata = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="pin_g" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0" stopColor="#F8E080" />
        <Stop offset="1" stopColor="#E8C848" />
      </RadialGradient>
    </Defs>
    <Line x1={28} y1={2} x2={28} y2={14} stroke="#A8A098" strokeWidth={1} />
    <Circle cx={28} cy={24} r={10} fill="url(#pin_g)" />
    <Path d="M28 14 L22 10 L28 14 L18 14 L28 14 L22 20" fill="none" stroke="#E84860" strokeWidth={2} strokeLinecap="round" />
    <Path d="M28 14 L34 10 L28 14 L38 14 L28 14 L34 20" fill="none" stroke="#48A868" strokeWidth={2} strokeLinecap="round" />
    <Path d="M28 34 L22 40 L28 34 L34 40 L28 34 L28 42" fill="none" stroke="#4880E8" strokeWidth={2} strokeLinecap="round" />
    <Path d="M18 24 L12 20 L18 24 L12 28" fill="none" stroke="#E888C0" strokeWidth={2} strokeLinecap="round" />
    <Path d="M38 24 L44 20 L38 24 L44 28" fill="none" stroke="#F8A848" strokeWidth={2} strokeLinecap="round" />
    {[0, 1, 2, 3].map(i => (
      <Rect key={i} x={24 + i * 2.5} y={20 + (i % 2) * 2} width={2} height={6} rx={0.5} fill={['#E84860', '#48A868', '#4880E8', '#F8A848'][i]} opacity={0.6} />
    ))}
    <Ellipse cx={28} cy={22} rx={5} ry={2} fill="#FFF0A0" opacity={0.3} />
  </Svg>
);

export const Guitar = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="gtr_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D8A060" />
        <Stop offset="1" stopColor="#B88040" />
      </LinearGradient>
    </Defs>
    <Rect x={26} y={4} width={4} height={22} rx={1} fill="#8B6840" />
    <Rect x={24} y={4} width={8} height={3} rx={1} fill="#C8A060" />
    {[0, 1, 2].map(i => (
      <Circle key={i} cx={25 + i * 3} cy={5.5} r={0.8} fill="#D8C080" />
    ))}
    <Line x1={27} y1={7} x2={27} y2={46} stroke="#C8C0B0" strokeWidth={0.4} />
    <Line x1={28} y1={7} x2={28} y2={46} stroke="#C8C0B0" strokeWidth={0.4} />
    <Line x1={29} y1={7} x2={29} y2={46} stroke="#C8C0B0" strokeWidth={0.4} />
    <Ellipse cx={28} cy={38} rx={12} ry={10} fill="url(#gtr_g)" stroke="#A07038" strokeWidth={1} />
    <Ellipse cx={28} cy={30} rx={8} ry={7} fill="url(#gtr_g)" stroke="#A07038" strokeWidth={1} />
    <Circle cx={28} cy={38} r={4} fill="#4A3020" />
    <Ellipse cx={28} cy={36} rx={2} ry={1} fill="#5A4030" opacity={0.5} />
    <Rect x={24} y={24} width={8} height={2} rx={0.5} fill="#C8A060" />
  </Svg>
);

export const Alebrije = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={32} rx={14} ry={10} fill="#48C878" stroke="#38A860" strokeWidth={0.8} />
    <Circle cx={20} cy={24} r={7} fill="#E84860" />
    <Circle cx={18} cy={22} r={2.5} fill="#FFFFFF" />
    <Circle cx={18} cy={22} r={1.2} fill="#1A1A2E" />
    <Circle cx={23} cy={21} r={2} fill="#FFFFFF" />
    <Circle cx={23} cy={21} r={1} fill="#1A1A2E" />
    <Path d="M16 28 L12 30 L16 29" fill="#F8A848" />
    <Path d="M16 18 Q14 14 16 10" fill="none" stroke="#E84860" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M22 18 Q24 14 22 10" fill="none" stroke="#4880E8" strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx={16} cy={10} r={1.5} fill="#F8E848" />
    <Circle cx={22} cy={10} r={1.5} fill="#F8E848" />
    <Path d="M42 32 Q48 28 50 32 Q48 36 42 34" fill="#4880E8" />
    <Path d="M42 30 Q50 24 52 30 Q50 36 42 34" fill="#E84860" opacity={0.6} />
    {[0, 1, 2, 3].map(i => (
      <Circle key={i} cx={22 + i * 5} cy={32 + (i % 2) * 2} r={1.5} fill={['#F8E848', '#4880E8', '#E84860', '#F8A848'][i]} />
    ))}
    <Line x1={22} y1={42} x2={20} y2={50} stroke="#38A860" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={28} y1={42} x2={28} y2={50} stroke="#38A860" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={34} y1={42} x2={36} y2={50} stroke="#38A860" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const Cactus = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="cact_g" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#58A858" />
        <Stop offset="1" stopColor="#78C878" />
      </LinearGradient>
    </Defs>
    <Rect x={22} y={14} width={12} height={32} rx={6} fill="url(#cact_g)" stroke="#48904C" strokeWidth={0.8} />
    <Path d="M22 28 Q12 28 12 20 Q12 14 16 14" fill="none" stroke="#58A858" strokeWidth={5} strokeLinecap="round" />
    <Path d="M34 22 Q44 22 44 16 Q44 10 40 10" fill="none" stroke="#58A858" strokeWidth={5} strokeLinecap="round" />
    <Line x1={28} y1={18} x2={28} y2={42} stroke="#48904C" strokeWidth={0.5} opacity={0.3} />
    <Line x1={25} y1={16} x2={25} y2={44} stroke="#48904C" strokeWidth={0.3} opacity={0.2} />
    <Line x1={31} y1={16} x2={31} y2={44} stroke="#48904C" strokeWidth={0.3} opacity={0.2} />
    <Circle cx={30} cy={16} r={2} fill="#F8E848" />
    <Circle cx={30} cy={16} r={0.8} fill="#E8C030" />
    <Ellipse cx={28} cy={50} rx={10} ry={4} fill="#D8B880" stroke="#C8A870" strokeWidth={0.5} />
  </Svg>
);

export const FridaPainting = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={10} y={8} width={36} height={40} rx={1} fill="#C89040" stroke="#A87830" strokeWidth={1.5} />
    <Rect x={13} y={11} width={30} height={34} rx={0.5} fill="#F8E8C0" />
    <Circle cx={28} cy={28} r={8} fill="#FFE0C0" />
    <Path d="M22 24 Q28 20 34 24" fill="#1A1A2E" />
    <Circle cx={25} cy={27} r={1.3} fill="#1A1A2E" />
    <Circle cx={31} cy={27} r={1.3} fill="#1A1A2E" />
    <Path d="M26 30 Q28 32 30 30" fill="none" stroke="#D07060" strokeWidth={0.8} />
    <Path d="M22 24 L34 24" stroke="#1A1A2E" strokeWidth={1.2} />
    <Circle cx={20} cy={30} r={3} fill="#E84848" opacity={0.5} />
    <Circle cx={36} cy={30} r={3} fill="#E84848" opacity={0.5} />
    <Path d="M20 18 Q22 14 26 16" fill="#68A858" />
    <Path d="M30 16 Q34 14 36 18" fill="#E84860" />
    <Path d="M24 17 Q28 14 32 17" fill="#F8E848" opacity={0.6} />
    <Rect x={16} y={38} width={24} height={4} rx={1} fill="#48A868" opacity={0.4} />
    <Line x1={28} y1={4} x2={28} y2={8} stroke="#A87830" strokeWidth={1} />
    <Circle cx={28} cy={3} r={1.5} fill="#C89040" />
  </Svg>
);

export const Tacos = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="taco_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F0D080" />
        <Stop offset="1" stopColor="#E0B860" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={44} rx={18} ry={4} fill="#E8D8C0" opacity={0.3} />
    <Path d="M10 38 Q10 20 28 20 Q46 20 46 38 Z" fill="url(#taco_g)" stroke="#C8A048" strokeWidth={0.8} />
    <Ellipse cx={28} cy={30} rx={12} ry={4} fill="#68A848" opacity={0.6} />
    <Circle cx={22} cy={28} r={3} fill="#E84848" opacity={0.5} />
    <Circle cx={34} cy={28} r={2.5} fill="#F8A848" opacity={0.5} />
    <Ellipse cx={28} cy={26} rx={6} ry={2.5} fill="#F8F0D0" opacity={0.4} />
    <Circle cx={26} cy={32} r={1.5} fill="#D83838" opacity={0.4} />
    <Circle cx={30} cy={34} r={1} fill="#78B848" opacity={0.5} />
    <Path d="M10 38 Q10 20 28 20 Q46 20 46 38" fill="none" stroke="#B89838" strokeWidth={1} />
  </Svg>
);

export const Guacamole = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="guac_g" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0" stopColor="#A0D868" />
        <Stop offset="1" stopColor="#78B048" />
      </RadialGradient>
    </Defs>
    <Path d="M12 28 Q12 42 28 42 Q44 42 44 28 Z" fill="#C8A870" stroke="#A88850" strokeWidth={0.8} />
    <Ellipse cx={28} cy={28} rx={16} ry={6} fill="url(#guac_g)" />
    <Ellipse cx={26} cy={27} rx={4} ry={2} fill="#B8E878" opacity={0.4} />
    <Circle cx={32} cy={28} r={1.5} fill="#E84848" opacity={0.5} />
    <Circle cx={24} cy={29} r={1} fill="#E84848" opacity={0.4} />
    <Ellipse cx={28} cy={26} rx={2} ry={1} fill="#C8E888" opacity={0.3} />
    <G transform="rotate(-20, 10, 24)">
      <Path d="M4 22 L12 20 L14 24 L6 26 Z" fill="#F0D080" stroke="#D8B860" strokeWidth={0.5} />
    </G>
    <G transform="rotate(25, 46, 22)">
      <Path d="M42 20 L50 18 L52 22 L44 24 Z" fill="#F0D080" stroke="#D8B860" strokeWidth={0.5} />
    </G>
    <G transform="rotate(5, 36, 18)">
      <Path d="M34 14 L42 12 L44 16 L36 18 Z" fill="#F0D080" stroke="#D8B860" strokeWidth={0.5} />
    </G>
  </Svg>
);

export const ChiliPeppers = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <G>
      <Path d="M14 38 Q8 28 14 18 Q18 12 20 18 Q16 28 18 38 Z" fill="#E83838" stroke="#C82828" strokeWidth={0.6} />
      <Ellipse cx={16} cy={24} rx={2} ry={6} fill="#F85050" opacity={0.3} />
      <Path d="M16 14 Q14 10 16 8" stroke="#48A848" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </G>
    <G>
      <Path d="M28 42 Q22 32 28 20 Q32 14 34 20 Q30 30 32 42 Z" fill="#48A848" stroke="#38903C" strokeWidth={0.6} />
      <Ellipse cx={30} cy={28} rx={1.5} ry={7} fill="#58C058" opacity={0.3} />
      <Path d="M30 16 Q28 12 30 10" stroke="#48A848" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </G>
    <G>
      <Path d="M42 40 Q36 30 42 18 Q46 12 48 18 Q44 28 46 40 Z" fill="#E86838" stroke="#D05028" strokeWidth={0.6} />
      <Ellipse cx={44} cy={26} rx={1.5} ry={6} fill="#F88050" opacity={0.3} />
      <Path d="M44 14 Q42 10 44 8" stroke="#48A848" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </G>
  </Svg>
);

export const Chocolate = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="choc_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C87840" />
        <Stop offset="1" stopColor="#A06030" />
      </LinearGradient>
    </Defs>
    <Path d="M16 22 Q16 46 28 46 Q40 46 40 22 Z" fill="url(#choc_g)" stroke="#885028" strokeWidth={1} />
    <Ellipse cx={28} cy={22} rx={12} ry={5} fill="#D89050" stroke="#A06030" strokeWidth={0.8} />
    <Ellipse cx={28} cy={20} rx={9} ry={3} fill="#E8A868" opacity={0.4} />
    <Path d="M24 18 Q22 12 24 8" fill="none" stroke="#D8D0C8" strokeWidth={0.8} opacity={0.4} />
    <Path d="M28 16 Q30 8 28 4" fill="none" stroke="#D8D0C8" strokeWidth={0.8} opacity={0.4} />
    <Path d="M32 18 Q34 14 32 10" fill="none" stroke="#D8D0C8" strokeWidth={0.8} opacity={0.3} />
    <Ellipse cx={28} cy={22} rx={4} ry={1.5} fill="#F8E8D0" opacity={0.3} />
    <Rect x={14} y={16} width={28} height={3} rx={1} fill="#E8D0B0" opacity={0.3} />
  </Svg>
);

export const Tamales = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="tam_g" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#D8C890" />
        <Stop offset="1" stopColor="#C8B878" />
      </LinearGradient>
    </Defs>
    <Rect x={16} y={14} width={24} height={32} rx={3} fill="url(#tam_g)" stroke="#B0A060" strokeWidth={0.8} />
    <Path d="M16 14 Q22 10 28 14 Q34 10 40 14" fill="none" stroke="#A09050" strokeWidth={1} />
    <Path d="M16 46 Q22 50 28 46 Q34 50 40 46" fill="none" stroke="#A09050" strokeWidth={1} />
    <Line x1={20} y1={14} x2={20} y2={46} stroke="#B8A868" strokeWidth={0.4} opacity={0.4} />
    <Line x1={28} y1={14} x2={28} y2={46} stroke="#B8A868" strokeWidth={0.4} opacity={0.4} />
    <Line x1={36} y1={14} x2={36} y2={46} stroke="#B8A868" strokeWidth={0.4} opacity={0.4} />
    <Rect x={20} y={24} width={16} height={10} rx={1} fill="#E8C068" opacity={0.4} />
    <Ellipse cx={28} cy={28} rx={5} ry={3} fill="#D84838" opacity={0.3} />
    <Path d="M22 22 L34 22" stroke="#C8B070" strokeWidth={0.5} opacity={0.5} />
    <Path d="M22 36 L34 36" stroke="#C8B070" strokeWidth={0.5} opacity={0.5} />
  </Svg>
);

export const Bougainvillea = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M28 52 Q28 40 24 32 Q20 24 28 16 Q36 24 32 32 Q28 40 28 52" fill="none" stroke="#68905C" strokeWidth={2} />
    <Path d="M24 32 Q16 28 12 32" fill="none" stroke="#68905C" strokeWidth={1.2} />
    <Path d="M32 24 Q38 20 42 22" fill="none" stroke="#68905C" strokeWidth={1.2} />
    {[
      [20, 18], [28, 12], [36, 16], [14, 28], [22, 24],
      [34, 20], [42, 24], [18, 34], [38, 30], [28, 28],
    ].map(([x, y], i) => (
      <G key={i}>
        <Path d={`M${x} ${y} Q${x - 3} ${y - 4} ${x} ${y - 5} Q${x + 3} ${y - 4} ${x} ${y}`} fill={i % 2 === 0 ? '#E868A0' : '#F080B0'} opacity={0.7} />
      </G>
    ))}
    <Path d="M26 14 Q28 10 30 14" fill="#78A868" />
    <Path d="M12 30 Q10 28 14 28" fill="#78A868" />
  </Svg>
);

export const MexicanFountain = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="mftn_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8C880" />
        <Stop offset="1" stopColor="#C8A868" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={48} rx={22} ry={6} fill="url(#mftn_g)" stroke="#A88848" strokeWidth={0.8} />
    <Rect x={14} y={42} width={28} height={8} rx={1} fill="#C8A868" />
    {[0, 1, 2, 3].map(i => (
      <Rect key={i} x={16 + i * 8} y={42} width={4} height={8} rx={0.5} fill={['#4880E8', '#E84860', '#F8E848', '#48A868'][i]} opacity={0.5} />
    ))}
    <Ellipse cx={28} cy={42} rx={14} ry={4} fill="#88C8E0" opacity={0.5} />
    <Rect x={26} y={20} width={4} height={24} rx={2} fill="#C8A868" />
    <Ellipse cx={28} cy={32} rx={8} ry={2.5} fill="#C8A868" />
    <Ellipse cx={28} cy={31} rx={6} ry={1.5} fill="#88C8E0" opacity={0.4} />
    <Ellipse cx={28} cy={22} rx={5} ry={2} fill="#D8B878" />
    <Path d="M28 18 Q26 12 22 14" fill="none" stroke="#88C8E0" strokeWidth={1} opacity={0.5} />
    <Path d="M28 18 Q30 12 34 14" fill="none" stroke="#88C8E0" strokeWidth={1} opacity={0.5} />
    <Path d="M28 18 L28 10" fill="none" stroke="#88C8E0" strokeWidth={1} opacity={0.5} />
  </Svg>
);

export const Parrot = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={30} rx={10} ry={14} fill="#48C848" stroke="#38A838" strokeWidth={0.8} />
    <Circle cx={28} cy={16} r={8} fill="#58D858" stroke="#48C048" strokeWidth={0.8} />
    <Circle cx={25} cy={14} r={2} fill="#FFFFFF" />
    <Circle cx={25} cy={14} r={1} fill="#1A1A2E" />
    <Path d="M30 16 L36 14 L34 18 Z" fill="#F8C030" stroke="#E8A020" strokeWidth={0.5} />
    <Path d="M24 10 Q26 6 30 8" fill="#E84860" />
    <Path d="M26 10 Q28 4 32 6" fill="#4880E8" opacity={0.7} />
    <Path d="M38 28 Q44 26 48 30 Q44 32 42 28" fill="#E84860" />
    <Path d="M38 32 Q46 30 50 34 Q46 38 42 32" fill="#4880E8" />
    <Path d="M38 36 Q44 36 46 40 Q42 42 38 38" fill="#F8E848" />
    <Path d="M18 28 Q14 26 10 28 Q14 30 16 28" fill="#E84860" opacity={0.6} />
    <Line x1={24} y1={44} x2={22} y2={52} stroke="#A0A098" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={32} y1={44} x2={34} y2={52} stroke="#A0A098" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={22} y1={52} x2={20} y2={52} stroke="#A0A098" strokeWidth={1} strokeLinecap="round" />
    <Line x1={34} y1={52} x2={36} y2={52} stroke="#A0A098" strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

export const SugarSkull = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M16 28 Q16 10 28 10 Q40 10 40 28 Q40 38 36 42 L20 42 Q16 38 16 28 Z" fill="#FFF8F0" stroke="#E8D8C8" strokeWidth={0.8} />
    <Rect x={20} y={42} width={16} height={6} rx={2} fill="#F8F0E8" stroke="#E8D8C8" strokeWidth={0.6} />
    <G>
      <Circle cx={22} cy={24} r={4.5} fill="none" stroke="#E84860" strokeWidth={1.5} />
      <Circle cx={22} cy={24} r={2} fill="#1A1A2E" />
      <Path d="M18 20 L20 22" stroke="#E84860" strokeWidth={0.8} />
      <Path d="M24 20 L22 22" stroke="#E84860" strokeWidth={0.8} />
      <Path d="M18 28 L20 26" stroke="#E84860" strokeWidth={0.8} />
      <Path d="M24 28 L22 26" stroke="#E84860" strokeWidth={0.8} />
    </G>
    <G>
      <Circle cx={34} cy={24} r={4.5} fill="none" stroke="#4880E8" strokeWidth={1.5} />
      <Circle cx={34} cy={24} r={2} fill="#1A1A2E" />
      <Path d="M30 20 L32 22" stroke="#4880E8" strokeWidth={0.8} />
      <Path d="M36 20 L34 22" stroke="#4880E8" strokeWidth={0.8} />
      <Path d="M30 28 L32 26" stroke="#4880E8" strokeWidth={0.8} />
      <Path d="M36 28 L34 26" stroke="#4880E8" strokeWidth={0.8} />
    </G>
    <Ellipse cx={28} cy={32} rx={1.5} ry={2} fill="#1A1A2E" opacity={0.5} />
    <Path d="M22 38 L24 36 L26 38 L28 36 L30 38 L32 36 L34 38" fill="none" stroke="#E8D0C0" strokeWidth={1} />
    <Circle cx={28} cy={14} r={1.5} fill="#F8E848" opacity={0.5} />
    <Path d="M22 14 Q28 10 34 14" fill="none" stroke="#48C878" strokeWidth={0.8} opacity={0.5} />
  </Svg>
);

export const MexicanMask = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M14 24 Q14 8 28 8 Q42 8 42 24 Q42 40 28 44 Q14 40 14 24 Z" fill="#48A868" stroke="#38905C" strokeWidth={1} />
    <Path d="M14 24 Q14 20 18 16 Q22 12 28 12 Q34 12 38 16 Q42 20 42 24" fill="#E84860" />
    <G>
      <Ellipse cx={22} cy={24} rx={4} ry={5} fill="#F8E848" />
      <Circle cx={22} cy={24} r={2} fill="#1A1A2E" />
    </G>
    <G>
      <Ellipse cx={34} cy={24} rx={4} ry={5} fill="#F8E848" />
      <Circle cx={34} cy={24} r={2} fill="#1A1A2E" />
    </G>
    <Ellipse cx={28} cy={32} rx={2} ry={1.5} fill="#1A1A2E" opacity={0.6} />
    <Path d="M22 36 Q28 40 34 36" fill="none" stroke="#2A6A40" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M16 14 Q18 10 22 12" fill="none" stroke="#F8A848" strokeWidth={1.5} />
    <Path d="M40 14 Q38 10 34 12" fill="none" stroke="#F8A848" strokeWidth={1.5} />
    <Circle cx={28} cy={12} r={2} fill="#4880E8" opacity={0.6} />
    <Path d="M20 8 Q22 4 24 8" fill="#E84860" opacity={0.5} />
    <Path d="M32 8 Q34 4 36 8" fill="#E84860" opacity={0.5} />
  </Svg>
);

export const PyramidModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="pyr_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8D8B0" />
        <Stop offset="1" stopColor="#C8B888" />
      </LinearGradient>
    </Defs>
    <Path d="M28 8 L48 46 L8 46 Z" fill="url(#pyr_g)" stroke="#A89868" strokeWidth={0.8} />
    <Path d="M8 46 L28 38 L48 46" fill="#B8A878" opacity={0.4} />
    <Path d="M28 8 L28 38" stroke="#B8A878" strokeWidth={0.5} opacity={0.4} />
    <Line x1={14} y1={36} x2={42} y2={36} stroke="#B8A878" strokeWidth={0.5} opacity={0.3} />
    <Line x1={18} y1={30} x2={38} y2={30} stroke="#B8A878" strokeWidth={0.5} opacity={0.3} />
    <Line x1={22} y1={24} x2={34} y2={24} stroke="#B8A878" strokeWidth={0.5} opacity={0.3} />
    <Line x1={25} y1={18} x2={31} y2={18} stroke="#B8A878" strokeWidth={0.5} opacity={0.3} />
    <Rect x={6} y={44} width={44} height={4} rx={1} fill="#D8C898" />
    <Ellipse cx={28} cy={10} rx={3} ry={1.5} fill="#F8E8B0" opacity={0.3} />
  </Svg>
);

export const AztecCalendar = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={28} cy={28} r={22} fill="#D8C898" stroke="#A89868" strokeWidth={1.2} />
    <Circle cx={28} cy={28} r={17} fill="none" stroke="#B8A878" strokeWidth={0.8} />
    <Circle cx={28} cy={28} r={12} fill="none" stroke="#B8A878" strokeWidth={0.8} />
    <Circle cx={28} cy={28} r={7} fill="#C8B888" stroke="#A89868" strokeWidth={0.8} />
    <Circle cx={28} cy={28} r={3} fill="#A89060" />
    <Circle cx={26} cy={27} r={1} fill="#1A1A2E" />
    <Circle cx={30} cy={27} r={1} fill="#1A1A2E" />
    <Path d="M26 30 L28 32 L30 30" fill="none" stroke="#1A1A2E" strokeWidth={0.8} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 28 + Math.cos(angle) * 12;
      const y1 = 28 + Math.sin(angle) * 12;
      const x2 = 28 + Math.cos(angle) * 17;
      const y2 = 28 + Math.sin(angle) * 17;
      return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A89868" strokeWidth={0.8} />;
    })}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => {
      const angle = (i * 22.5 * Math.PI) / 180;
      const x1 = 28 + Math.cos(angle) * 17;
      const y1 = 28 + Math.sin(angle) * 17;
      const x2 = 28 + Math.cos(angle) * 20;
      const y2 = 28 + Math.sin(angle) * 20;
      return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B8A878" strokeWidth={0.5} />;
    })}
    {[0, 1, 2, 3].map(i => {
      const angle = (i * 90 * Math.PI) / 180;
      const cx = 28 + Math.cos(angle) * 9;
      const cy = 28 + Math.sin(angle) * 9;
      return <Circle key={i} cx={cx} cy={cy} r={1.5} fill="#A89060" opacity={0.6} />;
    })}
  </Svg>
);

export const MapOfMexico = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M14 20 Q12 18 14 16 L20 14 Q28 12 34 16 Q38 18 40 22 Q42 26 38 30 Q34 34 30 38 Q26 42 22 40 Q18 38 16 34 Q14 30 14 26 Z" fill="#A0D8A0" stroke="#78A870" strokeWidth={0.8} />
    <Path d="M14 20 Q10 24 12 28" fill="none" stroke="#78A870" strokeWidth={0.6} />
    <Circle cx={28} cy={24} r={1.5} fill="#E84860" />
    <Circle cx={22} cy={30} r={1} fill="#E84860" opacity={0.6} />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const QuetzalFeather = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="qf_g" x1="0" y1="0" x2="0.5" y2="1">
        <Stop offset="0" stopColor="#48C878" />
        <Stop offset="0.5" stopColor="#38A860" />
        <Stop offset="1" stopColor="#288848" />
      </LinearGradient>
    </Defs>
    <Path d="M28 6 Q18 20 16 34 Q14 44 20 50 Q24 46 26 38 Q28 30 28 6 Z" fill="url(#qf_g)" />
    <Path d="M28 6 Q38 20 40 34 Q42 44 36 50 Q32 46 30 38 Q28 30 28 6 Z" fill="#58D878" opacity={0.7} />
    <Line x1={28} y1={6} x2={28} y2={50} stroke="#288848" strokeWidth={1} opacity={0.5} />
    <Path d="M22 22 Q26 24 28 20" fill="none" stroke="#208838" strokeWidth={0.5} opacity={0.4} />
    <Path d="M34 22 Q30 24 28 20" fill="none" stroke="#208838" strokeWidth={0.5} opacity={0.4} />
    <Path d="M20 32 Q24 34 28 30" fill="none" stroke="#208838" strokeWidth={0.5} opacity={0.4} />
    <Path d="M36 32 Q32 34 28 30" fill="none" stroke="#208838" strokeWidth={0.5} opacity={0.4} />
    <Path d="M20 42 Q24 44 28 40" fill="none" stroke="#208838" strokeWidth={0.5} opacity={0.3} />
    <Ellipse cx={28} cy={10} rx={3} ry={4} fill="#78F898" opacity={0.2} />
  </Svg>
);

export const Books = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <G>
      <Rect x={12} y={38} width={32} height={8} rx={1} fill="#E84860" />
      <Rect x={14} y={40} width={8} height={4} rx={0.5} fill="#FFFFFF" opacity={0.4} />
    </G>
    <G>
      <Rect x={14} y={30} width={28} height={7} rx={1} fill="#4880E8" />
      <Rect x={16} y={32} width={6} height={3} rx={0.5} fill="#FFFFFF" opacity={0.4} />
    </G>
    <G>
      <Rect x={10} y={22} width={34} height={7} rx={1} fill="#48A868" />
      <Rect x={12} y={24} width={8} height={3} rx={0.5} fill="#FFFFFF" opacity={0.4} />
    </G>
    <G>
      <Rect x={16} y={14} width={26} height={7} rx={1} fill="#F8A848" />
      <Rect x={18} y={16} width={6} height={3} rx={0.5} fill="#FFFFFF" opacity={0.4} />
    </G>
    <G>
      <Rect x={18} y={8} width={22} height={5} rx={1} fill="#B868C8" />
      <Rect x={20} y={9.5} width={5} height={2} rx={0.5} fill="#FFFFFF" opacity={0.4} />
    </G>
    <Rect x={8} y={46} width={40} height={4} rx={1.5} fill="#D8C8B0" />
  </Svg>
);

export const mxIllustrations: Record<string, React.FC<{ size?: number }>> = {
  mx_l1: Pinata,
  mx_l2: Guitar,
  mx_l3: Alebrije,
  mx_l4: Cactus,
  mx_l5: FridaPainting,
  mx_k1: Tacos,
  mx_k2: Guacamole,
  mx_k3: ChiliPeppers,
  mx_k4: Chocolate,
  mx_k5: Tamales,
  mx_c1: Bougainvillea,
  mx_c2: MexicanFountain,
  mx_c3: Parrot,
  mx_c4: SugarSkull,
  mx_c5: MexicanMask,
  mx_s1: PyramidModel,
  mx_s2: AztecCalendar,
  mx_s3: MapOfMexico,
  mx_s4: QuetzalFeather,
  mx_s5: Books,
};
