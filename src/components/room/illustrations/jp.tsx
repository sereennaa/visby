import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const PaperFan = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="fan_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F8E8E0" />
        <Stop offset="1" stopColor="#E8C8B8" />
      </LinearGradient>
    </Defs>
    <Path d="M28 48 L8 18 A22 22 0 0 1 48 18 Z" fill="url(#fan_g)" stroke="#D4A088" strokeWidth={1} />
    {[0, 1, 2, 3, 4, 5].map(i => (
      <Line key={i} x1={28} y1={48} x2={8 + i * 8} y2={18 - Math.sin(i * 0.5) * 3} stroke="#D4A088" strokeWidth={0.5} opacity={0.5} />
    ))}
    <Path d="M28 48 L8 18 A22 22 0 0 1 48 18 Z" fill="none" stroke="#C8907A" strokeWidth={1.2} />
    <Circle cx={20} cy={22} r={2.5} fill="#E8A0A0" opacity={0.6} />
    <Circle cx={36} cy={20} r={2} fill="#E8A0A0" opacity={0.5} />
    <Rect x={26.5} y={44} width={3} height={10} rx={1.5} fill="#C8907A" />
  </Svg>
);

export const HinaDolls = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={18} cy={40} rx={9} ry={12} fill="#E84060" />
    <Circle cx={18} cy={24} r={6} fill="#FFE0C8" />
    <Path d="M14 22 Q18 18 22 22" fill="#1A1A2E" />
    <Circle cx={16} cy={24} r={1} fill="#1A1A2E" />
    <Circle cx={20} cy={24} r={1} fill="#1A1A2E" />
    <Path d="M16 26 Q18 28 20 26" fill="none" stroke="#E88080" strokeWidth={0.8} />
    <Ellipse cx={38} cy={40} rx={9} ry={12} fill="#4060C8" />
    <Circle cx={38} cy={24} r={6} fill="#FFE0C8" />
    <Path d="M34 22 Q38 18 42 22" fill="#1A1A2E" />
    <Circle cx={36} cy={24} r={1} fill="#1A1A2E" />
    <Circle cx={40} cy={24} r={1} fill="#1A1A2E" />
    <Path d="M36 26 Q38 28 40 26" fill="none" stroke="#E88080" strokeWidth={0.8} />
    <Rect x={8} y={50} width={40} height={4} rx={2} fill="#C8A880" />
  </Svg>
);

export const TeaSet = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="tea_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#8BC8A0" />
        <Stop offset="1" stopColor="#68A878" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={42} rx={14} ry={5} fill="#D8C8B0" />
    <Path d="M16 30 Q16 44 28 44 Q40 44 40 30 Z" fill="url(#tea_g)" />
    <Ellipse cx={28} cy={30} rx={12} ry={4} fill="#A0D8B0" />
    <Ellipse cx={28} cy={30} rx={12} ry={4} fill="none" stroke="#68A878" strokeWidth={0.8} />
    <Path d="M40 33 Q46 33 46 37 Q46 41 40 41" fill="none" stroke="#68A878" strokeWidth={1.5} />
    <Circle cx={12} cy={38} r={5} fill="#D8D0C0" stroke="#C0B8A0" strokeWidth={0.8} />
    <Ellipse cx={12} cy={36} rx={4} ry={1.5} fill="#C8E8B8" opacity={0.7} />
    <Path d="M26 26 Q24 20 26 16" fill="none" stroke="#D0D0D0" strokeWidth={0.8} opacity={0.5} />
    <Path d="M30 26 Q32 18 30 14" fill="none" stroke="#D0D0D0" strokeWidth={0.8} opacity={0.5} />
  </Svg>
);

export const KotatsuTable = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={10} y={28} width={36} height={6} rx={2} fill="#B8885A" />
    <Rect x={8} y={24} width={40} height={6} rx={2} fill="#E84848" opacity={0.85} />
    <Path d="M10 24 L10 20 Q28 16 46 20 L46 24 Z" fill="#D03838" opacity={0.7} />
    <Line x1={14} y1={34} x2={14} y2={48} stroke="#A07848" strokeWidth={2.5} strokeLinecap="round" />
    <Line x1={42} y1={34} x2={42} y2={48} stroke="#A07848" strokeWidth={2.5} strokeLinecap="round" />
    <Ellipse cx={28} cy={22} rx={6} ry={2} fill="#F8A848" opacity={0.4} />
  </Svg>
);

export const ScrollPainting = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={16} y={6} width={24} height={40} rx={1} fill="#FFF8F0" stroke="#D4C0A0" strokeWidth={0.8} />
    <Ellipse cx={28} cy={8} rx={13} ry={2.5} fill="#C8A878" />
    <Ellipse cx={28} cy={46} rx={13} ry={2.5} fill="#C8A878" />
    <Path d="M22 20 Q28 16 34 20 Q30 22 28 28" fill="none" stroke="#4A6848" strokeWidth={1} opacity={0.6} />
    <Circle cx={24} cy={18} r={1.5} fill="#E8A0A0" opacity={0.7} />
    <Circle cx={32} cy={17} r={1.2} fill="#E8A0A0" opacity={0.6} />
    <Circle cx={28} cy={15} r={1} fill="#E8A0A0" opacity={0.5} />
    <Path d="M20 32 L36 32" stroke="#A0A0A0" strokeWidth={0.4} opacity={0.3} />
    <Path d="M22 36 L34 36" stroke="#A0A0A0" strokeWidth={0.4} opacity={0.3} />
  </Svg>
);

export const SushiPlate = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={42} rx={22} ry={6} fill="#E8E0D8" stroke="#D0C8C0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={40} rx={20} ry={5} fill="#F8F4F0" />
    <G>
      <Rect x={12} y={28} width={12} height={8} rx={4} fill="#F8F0E0" stroke="#E8D8C0" strokeWidth={0.5} />
      <Rect x={13} y={26} width={10} height={4} rx={2} fill="#E86850" />
      <Ellipse cx={18} cy={27} rx={3} ry={1} fill="#F88070" opacity={0.5} />
    </G>
    <G>
      <Rect x={28} y={28} width={12} height={8} rx={4} fill="#F8F0E0" stroke="#E8D8C0" strokeWidth={0.5} />
      <Rect x={29} y={26} width={10} height={4} rx={2} fill="#F8A060" />
      <Ellipse cx={34} cy={27} rx={3} ry={1} fill="#F8B878" opacity={0.5} />
    </G>
    <G>
      <Circle cx={22} cy={36} r={4} fill="#2A3A28" />
      <Ellipse cx={22} cy={35} rx={2.5} ry={1.5} fill="#F8F0E0" />
      <Circle cx={22} cy={35} r={1} fill="#E86850" />
    </G>
    <Rect x={8} y={18} width={1.5} height={22} rx={0.75} fill="#8B6848" transform="rotate(-30, 8, 18)" />
    <Rect x={11} y={18} width={1.5} height={22} rx={0.75} fill="#8B6848" transform="rotate(-30, 11, 18)" />
  </Svg>
);

export const RamenBowl = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ramen_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F0E8E0" />
        <Stop offset="1" stopColor="#D8C8B8" />
      </LinearGradient>
    </Defs>
    <Path d="M8 24 Q8 46 28 46 Q48 46 48 24 Z" fill="url(#ramen_g)" stroke="#C8B8A0" strokeWidth={1} />
    <Ellipse cx={28} cy={24} rx={20} ry={6} fill="#F0D8A0" />
    <Path d="M14 22 Q20 28 28 22 Q36 16 42 22" fill="none" stroke="#E8C878" strokeWidth={1.5} />
    <Path d="M16 24 Q22 30 30 24 Q38 18 44 24" fill="none" stroke="#E8C878" strokeWidth={1.2} opacity={0.6} />
    <Circle cx={20} cy={22} r={2.5} fill="#68A040" opacity={0.7} />
    <Circle cx={36} cy={21} r={2} fill="#E87060" opacity={0.6} />
    <Ellipse cx={28} cy={20} rx={3} ry={2} fill="#F8E8D0" opacity={0.5} />
    <Path d="M22 18 Q20 10 22 6" fill="none" stroke="#D8D8D8" strokeWidth={0.8} opacity={0.4} />
    <Path d="M28 16 Q30 8 28 4" fill="none" stroke="#D8D8D8" strokeWidth={0.8} opacity={0.4} />
    <Path d="M34 18 Q36 12 34 8" fill="none" stroke="#D8D8D8" strokeWidth={0.8} opacity={0.4} />
    <Rect x={44} y={14} width={2} height={20} rx={1} fill="#8B6848" transform="rotate(15, 44, 14)" />
    <Rect x={47} y={14} width={2} height={20} rx={1} fill="#8B6848" transform="rotate(15, 47, 14)" />
  </Svg>
);

export const Chopsticks = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={18} y={4} width={2} height={46} rx={1} fill="#C8A070" transform="rotate(-8, 18, 4)" />
    <Rect x={24} y={4} width={2} height={46} rx={1} fill="#B89060" transform="rotate(4, 24, 4)" />
    <Rect x={17} y={4} width={4} height={8} rx={1} fill="#A07848" transform="rotate(-8, 18, 4)" />
    <Rect x={23} y={4} width={4} height={8} rx={1} fill="#A07848" transform="rotate(4, 24, 4)" />
    <Ellipse cx={32} cy={40} rx={8} ry={3} fill="#D8C8B0" opacity={0.4} />
  </Svg>
);

export const Teapot = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M18 22 Q18 42 28 42 Q38 42 38 22 Z" fill="#8BC0A0" stroke="#68A878" strokeWidth={1} />
    <Ellipse cx={28} cy={22} rx={10} ry={4} fill="#A0D8B0" stroke="#68A878" strokeWidth={0.8} />
    <Path d="M38 28 Q46 26 46 32 Q46 38 38 36" fill="none" stroke="#68A878" strokeWidth={2} strokeLinecap="round" />
    <Path d="M18 28 Q12 24 14 18" fill="none" stroke="#68A878" strokeWidth={2} strokeLinecap="round" />
    <Circle cx={28} cy={18} r={2.5} fill="#68A878" />
    <Rect x={26} y={14} width={4} height={4} rx={2} fill="#78B890" />
    <Path d="M24 18 Q22 12 24 8" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Path d="M32 18 Q34 10 32 6" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
  </Svg>
);

export const Dango = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={27} y={8} width={2.5} height={40} rx={1.25} fill="#C8A878" />
    <Circle cx={28} cy={16} r={7} fill="#F0A0B0" />
    <Ellipse cx={28} cy={14} rx={4} ry={2} fill="#F8B8C0" opacity={0.5} />
    <Circle cx={28} cy={28} r={7} fill="#FFFFFF" stroke="#E0D8D0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={26} rx={4} ry={2} fill="#FFFFFF" opacity={0.6} />
    <Circle cx={28} cy={40} r={7} fill="#90C878" />
    <Ellipse cx={28} cy={38} rx={4} ry={2} fill="#A8D890" opacity={0.5} />
  </Svg>
);

export const CherryTree = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={25} y={32} width={6} height={20} rx={2} fill="#A08060" />
    <Path d="M28 34 Q16 34 14 28 Q12 18 22 14 Q28 8 34 14 Q44 18 42 28 Q40 34 28 34 Z" fill="#FFB8C8" />
    <Circle cx={20} cy={20} r={3} fill="#FFC8D8" opacity={0.7} />
    <Circle cx={36} cy={18} r={2.5} fill="#FFC8D8" opacity={0.6} />
    <Circle cx={28} cy={14} r={2.5} fill="#FFC8D8" opacity={0.7} />
    <Circle cx={24} cy={28} r={2} fill="#FFC8D8" opacity={0.5} />
    <Circle cx={34} cy={26} r={2.2} fill="#FFC8D8" opacity={0.6} />
    {[18, 24, 32, 38].map((x, i) => (
      <Circle key={i} cx={x} cy={8 + i * 2} r={1.2} fill="#FFD0E0" opacity={0.4 + i * 0.1} />
    ))}
  </Svg>
);

export const ToriiGate = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={12} y={12} width={5} height={40} rx={1} fill="#D83030" />
    <Rect x={39} y={12} width={5} height={40} rx={1} fill="#D83030" />
    <Rect x={8} y={10} width={40} height={5} rx={2} fill="#E84040" />
    <Path d="M6 10 Q28 4 50 10" fill="none" stroke="#E84040" strokeWidth={3} strokeLinecap="round" />
    <Rect x={12} y={20} width={32} height={3} rx={1} fill="#D83030" />
    <Rect x={25.5} y={10} width={5} height={13} rx={1} fill="#C82828" opacity={0.5} />
  </Svg>
);

export const RockGarden = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={44} rx={24} ry={8} fill="#E8E0D0" />
    {[0, 1, 2, 3, 4].map(i => (
      <Path key={i} d={`M${6 + i * 2} ${40 + (i % 2) * 2} Q${28} ${38 + (i % 2) * 2} ${50 - i * 2} ${40 + (i % 2) * 2}`} fill="none" stroke="#D0C8B8" strokeWidth={0.6} />
    ))}
    <Ellipse cx={20} cy={38} rx={6} ry={5} fill="#A8A098" />
    <Ellipse cx={20} cy={36} rx={4} ry={2} fill="#B8B0A8" opacity={0.5} />
    <Ellipse cx={38} cy={36} rx={4} ry={3.5} fill="#989088" />
    <Ellipse cx={38} cy={34.5} rx={2.5} ry={1.5} fill="#A8A098" opacity={0.5} />
    <Circle cx={30} cy={40} r={2.5} fill="#908880" />
  </Svg>
);

export const KoiPond = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="koi_water" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0" stopColor="#88C8E0" />
        <Stop offset="1" stopColor="#68A8C8" />
      </RadialGradient>
    </Defs>
    <Ellipse cx={28} cy={32} rx={22} ry={16} fill="url(#koi_water)" />
    <Ellipse cx={28} cy={32} rx={22} ry={16} fill="none" stroke="#508898" strokeWidth={1} />
    <G>
      <Ellipse cx={22} cy={30} rx={5} ry={2.5} fill="#F88040" />
      <Path d="M27 30 L30 28 L30 32 Z" fill="#F88040" />
      <Circle cx={19} cy={29.5} r={0.8} fill="#1A1A2E" />
      <Ellipse cx={22} cy={29} rx={3} ry={1} fill="#F89858" opacity={0.4} />
    </G>
    <G>
      <Ellipse cx={36} cy={34} rx={4} ry={2} fill="#FFFFFF" />
      <Path d="M32 34 L29 32.5 L29 35.5 Z" fill="#FFFFFF" />
      <Circle cx={38.5} cy={33.5} r={0.7} fill="#1A1A2E" />
      <Circle cx={35} cy={33} r={1.5} fill="#E84040" opacity={0.5} />
    </G>
    <Circle cx={14} cy={26} r={3} fill="#68A848" opacity={0.5} />
    <Circle cx={40} cy={28} r={2.5} fill="#68A848" opacity={0.4} />
  </Svg>
);

export const Bamboo = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={24} y={4} width={4} height={48} rx={2} fill="#68A848" />
    <Line x1={24} y1={16} x2={28} y2={16} stroke="#508838" strokeWidth={1} />
    <Line x1={24} y1={28} x2={28} y2={28} stroke="#508838" strokeWidth={1} />
    <Line x1={24} y1={40} x2={28} y2={40} stroke="#508838" strokeWidth={1} />
    <Path d="M28 14 Q34 10 38 12" fill="#78B858" stroke="#68A848" strokeWidth={0.5} />
    <Path d="M28 26 Q34 22 40 24" fill="#88C868" stroke="#78B858" strokeWidth={0.5} />
    <Path d="M24 38 Q18 34 14 36" fill="#78B858" stroke="#68A848" strokeWidth={0.5} />
    <Rect x={34} y={6} width={3} height={44} rx={1.5} fill="#78B858" opacity={0.6} />
    <Line x1={34} y1={20} x2={37} y2={20} stroke="#68A848" strokeWidth={0.8} opacity={0.6} />
    <Line x1={34} y1={34} x2={37} y2={34} stroke="#68A848" strokeWidth={0.8} opacity={0.6} />
  </Svg>
);

export const MangaCollection = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={14} width={10} height={34} rx={1} fill="#E84860" />
    <Rect x={19} y={12} width={10} height={36} rx={1} fill="#4880E8" />
    <Rect x={30} y={16} width={10} height={32} rx={1} fill="#48C878" />
    <Rect x={41} y={14} width={8} height={34} rx={1} fill="#F8A848" />
    <Rect x={10} y={18} width={6} height={4} rx={1} fill="#FFFFFF" opacity={0.6} />
    <Rect x={21} y={16} width={6} height={4} rx={1} fill="#FFFFFF" opacity={0.6} />
    <Rect x={32} y={20} width={6} height={4} rx={1} fill="#FFFFFF" opacity={0.6} />
    <Circle cx={13} cy={30} r={3} fill="#F8C8D0" opacity={0.5} />
    <Circle cx={24} cy={28} r={3} fill="#B8D0F8" opacity={0.5} />
    <Rect x={8} y={46} width={41} height={4} rx={1} fill="#D8C8B0" />
  </Svg>
);

export const CalligraphySet = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={10} y={36} width={36} height={12} rx={2} fill="#2A2A2A" />
    <Rect x={12} y={38} width={14} height={8} rx={1} fill="#1A1A1A" />
    <Ellipse cx={19} cy={42} rx={5} ry={3} fill="#2A2A2A" />
    <Rect x={34} y={10} width={3} height={30} rx={1} fill="#C8A060" />
    <Path d="M34 40 L36 40 L35.5 46 L34.5 46 Z" fill="#2A2A2A" />
    <Rect x={14} y={14} width={16} height={18} rx={1} fill="#FFF8F0" stroke="#E0D8D0" strokeWidth={0.5} />
    <Path d="M18 20 Q22 18 26 22 Q24 26 20 28" fill="none" stroke="#2A2A2A" strokeWidth={1.5} />
  </Svg>
);

export const GameConsole = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={18} width={40} height={24} rx={6} fill="#E8E0E8" stroke="#C8C0C8" strokeWidth={1} />
    <Circle cx={20} cy={30} r={5} fill="#D0C8D0" />
    <Line x1={20} y1={26} x2={20} y2={34} stroke="#A8A0A8" strokeWidth={1.5} />
    <Line x1={16} y1={30} x2={24} y2={30} stroke="#A8A0A8" strokeWidth={1.5} />
    <Circle cx={38} cy={28} r={2.5} fill="#E84860" />
    <Circle cx={34} cy={32} r={2.5} fill="#4880E8" />
    <Circle cx={42} cy={32} r={2.5} fill="#48C878" />
    <Circle cx={38} cy={36} r={2.5} fill="#F8C848" />
    <Rect x={24} y={36} width={8} height={2} rx={1} fill="#B8B0B8" />
  </Svg>
);

export const OrigamiPaper = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M28 8 L46 28 L28 48 L10 28 Z" fill="#E84860" />
    <Path d="M28 8 L46 28 L28 28 Z" fill="#D03848" />
    <Path d="M28 28 L46 28 L28 48 Z" fill="#C02838" opacity={0.8} />
    <Path d="M28 8 L28 28 L10 28 Z" fill="#F05868" />
    <Path d="M28 20 L36 28 L28 36 L20 28 Z" fill="#F8F0F0" opacity={0.15} />
    <Path d="M28 8 L46 28 L28 48 L10 28 Z" fill="none" stroke="#B82838" strokeWidth={0.8} />
  </Svg>
);

export const MapOfJapan = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M28 14 Q32 16 30 22 Q28 28 32 32 Q34 36 30 40 Q28 42 26 40 Q22 36 24 30 Q26 24 24 20 Q22 16 28 14 Z" fill="#A8D8A0" stroke="#78A870" strokeWidth={0.8} />
    <Circle cx={30} cy={24} r={1.5} fill="#E84860" />
    <Circle cx={28} cy={18} r={1} fill="#E84860" opacity={0.6} />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const jpIllustrations: Record<string, React.FC<{ size?: number }>> = {
  jp_l1: PaperFan,
  jp_l2: HinaDolls,
  jp_l3: TeaSet,
  jp_l4: KotatsuTable,
  jp_l5: ScrollPainting,
  jp_k1: SushiPlate,
  jp_k2: RamenBowl,
  jp_k3: Chopsticks,
  jp_k4: Teapot,
  jp_k5: Dango,
  jp_g1: CherryTree,
  jp_g2: ToriiGate,
  jp_g3: RockGarden,
  jp_g4: KoiPond,
  jp_g5: Bamboo,
  jp_s1: MangaCollection,
  jp_s2: CalligraphySet,
  jp_s3: GameConsole,
  jp_s4: OrigamiPaper,
  jp_s5: MapOfJapan,
};
