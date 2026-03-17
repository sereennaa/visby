import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const BuddhaStatue = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="buddha_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8D848" />
        <Stop offset="1" stopColor="#D8A828" />
      </LinearGradient>
    </Defs>
    <Rect x={14} y={44} width={28} height={6} rx={2} fill="#C8A060" />
    <Path d="M18 44 Q18 36 18 32 Q18 28 28 28 Q38 28 38 32 Q38 36 38 44 Z" fill="url(#buddha_g)" />
    <Ellipse cx={28} cy={38} rx={10} ry={2} fill="#D8A828" opacity={0.3} />
    <Circle cx={28} cy={20} r={8} fill="url(#buddha_g)" />
    <Path d="M22 18 Q28 12 34 18" fill="#E8C030" />
    <Ellipse cx={28} cy={16} rx={6} ry={3} fill="#F8D848" opacity={0.5} />
    <Circle cx={28} cy={13} r={2} fill="#F8E060" />
    <Circle cx={25} cy={21} r={1} fill="#C89828" opacity={0.6} />
    <Circle cx={31} cy={21} r={1} fill="#C89828" opacity={0.6} />
    <Path d="M26 24 Q28 26 30 24" fill="none" stroke="#C89828" strokeWidth={0.6} />
    <Path d="M20 32 Q16 30 14 34" fill="none" stroke="#D8A828" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M36 32 Q40 30 42 34" fill="none" stroke="#D8A828" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const ThaiPuppet = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Line x1={28} y1={2} x2={28} y2={14} stroke="#C8A878" strokeWidth={1.5} />
    <Line x1={20} y1={2} x2={20} y2={28} stroke="#C8A878" strokeWidth={1} />
    <Line x1={36} y1={2} x2={36} y2={28} stroke="#C8A878" strokeWidth={1} />
    <Circle cx={28} cy={18} r={6} fill="#FFE0C8" />
    <Path d="M24 16 Q28 12 32 16" fill="#1A1A2E" />
    <Circle cx={26} cy={18} r={1} fill="#1A1A2E" />
    <Circle cx={30} cy={18} r={1} fill="#1A1A2E" />
    <Path d="M26 20 Q28 22 30 20" fill="none" stroke="#E88080" strokeWidth={0.6} />
    <Path d="M22 24 Q22 22 24 22 L32 22 Q34 22 34 24 L36 40 Q36 44 28 44 Q20 44 20 40 Z" fill="#E84878" />
    <Path d="M24 24 L26 28 L28 24 L30 28 L32 24" fill="none" stroke="#F8A0B0" strokeWidth={0.6} />
    <Path d="M22 28 L18 34" stroke="#E84878" strokeWidth={2} strokeLinecap="round" />
    <Path d="M34 28 L38 34" stroke="#E84878" strokeWidth={2} strokeLinecap="round" />
    <Path d="M20 44 L22 52" stroke="#FFE0C8" strokeWidth={2} strokeLinecap="round" />
    <Path d="M36 44 L34 52" stroke="#FFE0C8" strokeWidth={2} strokeLinecap="round" />
    <Rect x={16} y={0} width={24} height={3} rx={1.5} fill="#C8A878" />
  </Svg>
);

export const Orchid = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M28 30 Q26 40 24 50" stroke="#48A838" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M24 40 Q20 38 18 40" fill="#58B848" />
    <Path d="M26 46 Q22 44 20 46" fill="#48A838" />
    <G>
      <Ellipse cx={28} cy={16} rx={6} ry={10} fill="#C868D8" />
      <Ellipse cx={20} cy={20} rx={6} ry={8} fill="#C868D8" transform="rotate(-30, 20, 20)" />
      <Ellipse cx={36} cy={20} rx={6} ry={8} fill="#C868D8" transform="rotate(30, 36, 20)" />
      <Ellipse cx={22} cy={28} rx={5} ry={6} fill="#D880E8" transform="rotate(20, 22, 28)" />
      <Ellipse cx={34} cy={28} rx={5} ry={6} fill="#D880E8" transform="rotate(-20, 34, 28)" />
      <Circle cx={28} cy={22} r={4} fill="#F8E848" />
      <Circle cx={28} cy={22} r={2} fill="#E8C830" />
      <Ellipse cx={26} cy={14} rx={3} ry={5} fill="#D880E8" opacity={0.4} />
      <Ellipse cx={30} cy={14} rx={3} ry={5} fill="#D880E8" opacity={0.4} />
    </G>
  </Svg>
);

export const SilkFabric = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="silk_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#E84878" />
        <Stop offset="0.5" stopColor="#D838C0" />
        <Stop offset="1" stopColor="#A830D8" />
      </LinearGradient>
    </Defs>
    <Path d="M8 16 L48 12 L44 44 L12 48 Z" fill="url(#silk_g)" />
    <Path d="M8 16 L48 12 L44 20 L8 24 Z" fill="#F06888" opacity={0.3} />
    <Path d="M12 28 Q28 24 44 28" fill="none" stroke="#F8D848" strokeWidth={0.8} opacity={0.5} />
    <Path d="M12 36 Q28 32 44 36" fill="none" stroke="#F8D848" strokeWidth={0.8} opacity={0.5} />
    <Path d="M20 16 Q20 44 20 48" fill="none" stroke="#F8A0B0" strokeWidth={0.3} opacity={0.3} />
    <Path d="M36 14 Q36 42 36 46" fill="none" stroke="#F8A0B0" strokeWidth={0.3} opacity={0.3} />
    <Path d="M8 16 L48 12" fill="none" stroke="#C83060" strokeWidth={0.8} />
    <Path d="M8 16 L12 48" fill="none" stroke="#C83060" strokeWidth={0.5} />
    <Path d="M44 44 L48 12" fill="none" stroke="#8828B8" strokeWidth={0.5} />
  </Svg>
);

export const FloorMat = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="mat_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D8C0A0" />
        <Stop offset="1" stopColor="#C0A880" />
      </LinearGradient>
    </Defs>
    <Path d="M4 24 L52 20 L52 44 L4 48 Z" fill="url(#mat_g)" />
    <Path d="M4 24 L52 20 L52 24 L4 28 Z" fill="#E8D0B0" opacity={0.4} />
    {[0, 1, 2, 3, 4, 5].map(i => (
      <Line key={i} x1={4 + i * 10} y1={24 + i * 0.4} x2={4 + i * 10} y2={48 - i * 0.4} stroke="#B8A078" strokeWidth={0.4} opacity={0.3} />
    ))}
    {[0, 1, 2, 3].map(i => (
      <Line key={i} x1={4} y1={28 + i * 6} x2={52} y2={24 + i * 6} stroke="#B8A078" strokeWidth={0.4} opacity={0.3} />
    ))}
    <Path d="M4 24 L52 20" fill="none" stroke="#A89070" strokeWidth={0.8} />
  </Svg>
);

export const PadThai = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={40} rx={20} ry={6} fill="#E8D8C0" stroke="#D0C0A0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={38} rx={18} ry={5} fill="#F8F0E8" />
    <Path d="M14 36 Q20 42 28 36 Q36 30 42 36" fill="none" stroke="#E8C878" strokeWidth={1.5} />
    <Path d="M16 38 Q22 44 30 38 Q38 32 44 38" fill="none" stroke="#E8C878" strokeWidth={1} opacity={0.5} />
    <Circle cx={18} cy={34} r={2} fill="#E84848" opacity={0.5} />
    <Circle cx={38} cy={34} r={2} fill="#68A848" opacity={0.5} />
    <Path d="M24 34 Q26 32 28 34" fill="#F8D848" opacity={0.6} />
    <Circle cx={34} cy={32} r={1.5} fill="#E88040" opacity={0.4} />
    <Path d="M22 30 L20 34" stroke="#A08060" strokeWidth={0.5} opacity={0.5} />
    <Path d="M34 30 L36 34" stroke="#A08060" strokeWidth={0.5} opacity={0.5} />
    <Rect x={42} y={24} width={1.5} height={18} rx={0.75} fill="#8B6848" transform="rotate(15, 42, 24)" />
    <Rect x={45} y={24} width={1.5} height={18} rx={0.75} fill="#8B6848" transform="rotate(15, 45, 24)" />
    <Path d="M12 32 Q10 28 12 24" fill="none" stroke="#48A838" strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

export const GreenCurry = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="curry_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8D0B0" />
        <Stop offset="1" stopColor="#C8A880" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={44} rx={16} ry={4} fill="#C8C0B0" opacity={0.3} />
    <Path d="M10 24 Q10 44 28 44 Q46 44 46 24 Z" fill="url(#curry_g)" stroke="#B89870" strokeWidth={0.8} />
    <Ellipse cx={28} cy={24} rx={18} ry={6} fill="#78B848" />
    <Ellipse cx={28} cy={24} rx={14} ry={4} fill="#88C858" opacity={0.6} />
    <Circle cx={22} cy={22} r={2} fill="#48A030" />
    <Circle cx={34} cy={22} r={1.8} fill="#48A030" />
    <Ellipse cx={28} cy={26} rx={3} ry={1.5} fill="#F8F0E0" opacity={0.5} />
    <Circle cx={20} cy={26} r={1.5} fill="#E84848" opacity={0.4} />
    <Path d="M24 20 Q22 14 24 10" fill="none" stroke="#D8D8D0" strokeWidth={0.7} opacity={0.4} />
    <Path d="M32 20 Q34 12 32 8" fill="none" stroke="#D8D8D0" strokeWidth={0.7} opacity={0.4} />
  </Svg>
);

export const StickyRice = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="basket_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D8B880" />
        <Stop offset="1" stopColor="#B89858" />
      </LinearGradient>
    </Defs>
    <Path d="M16 20 L12 44 Q12 48 28 48 Q44 48 44 44 L40 20 Z" fill="url(#basket_g)" />
    {[0, 1, 2, 3].map(i => (
      <Path key={i} d={`M${14 + i * 0.5} ${24 + i * 6} Q28 ${26 + i * 6} ${42 - i * 0.5} ${24 + i * 6}`} fill="none" stroke="#A08048" strokeWidth={0.5} opacity={0.4} />
    ))}
    <Ellipse cx={28} cy={20} rx={12} ry={5} fill="#F8F0E0" stroke="#D8C8A0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={18} rx={8} ry={3} fill="#F8F8F0" opacity={0.6} />
    <Path d="M16 16 Q16 8 20 6 Q24 4 28 6 Q32 4 36 6 Q40 8 40 16" fill="none" stroke="#C8A868" strokeWidth={1.5} />
    <Path d="M22 8 Q28 4 34 8" fill="none" stroke="#B89858" strokeWidth={1} opacity={0.5} />
  </Svg>
);

export const ChiliPeppers = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <G>
      <Path d="M16 14 Q12 24 16 38 Q18 42 20 38 Q24 24 20 14 Z" fill="#E83828" />
      <Ellipse cx={18} cy={20} rx={2} ry={6} fill="#F05040" opacity={0.4} />
      <Rect x={16} y={8} width={4} height={6} rx={1} fill="#48A838" />
    </G>
    <G>
      <Path d="M28 10 Q24 20 28 34 Q30 38 32 34 Q36 20 32 10 Z" fill="#D82818" />
      <Ellipse cx={30} cy={18} rx={2} ry={6} fill="#E83828" opacity={0.4} />
      <Rect x={28} y={4} width={4} height={6} rx={1} fill="#48A838" />
    </G>
    <G>
      <Path d="M38 16 Q34 26 38 40 Q40 44 42 40 Q46 26 42 16 Z" fill="#E83828" />
      <Ellipse cx={40} cy={24} rx={2} ry={6} fill="#F05040" opacity={0.4} />
      <Rect x={38} y={10} width={4} height={6} rx={1} fill="#48A838" />
    </G>
  </Svg>
);

export const ThaiIcedTea = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="thaitea_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8A040" />
        <Stop offset="1" stopColor="#E87820" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={48} rx={10} ry={2.5} fill="#D0C8C0" opacity={0.3} />
    <Path d="M18 12 L14 46 Q14 48 28 48 Q42 48 42 46 L38 12 Z" fill="#F0F0E8" stroke="#D8D0C8" strokeWidth={0.5} />
    <Path d="M19 16 L15 44 Q16 46 28 46 Q40 46 41 44 L37 16 Z" fill="url(#thaitea_g)" />
    <Ellipse cx={28} cy={12} rx={10} ry={3.5} fill="#F0F0E8" stroke="#D8D0C8" strokeWidth={0.5} />
    <Ellipse cx={28} cy={20} rx={8} ry={2} fill="#F8F0E8" opacity={0.3} />
    <Ellipse cx={28} cy={26} rx={7} ry={1.5} fill="#F8F0E8" opacity={0.2} />
    <Path d="M22 10 Q20 4 22 2" fill="none" stroke="#E8D0C0" strokeWidth={0.6} opacity={0.3} />
    <Rect x={24} y={4} width={1.5} height={10} rx={0.75} fill="#D8D0C8" />
    <Circle cx={24} cy={4} r={2} fill="#E84848" />
  </Svg>
);

export const SpiritHouse = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="spirit_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8D848" />
        <Stop offset="1" stopColor="#E8B830" />
      </LinearGradient>
    </Defs>
    <Rect x={26} y={36} width={4} height={16} rx={1} fill="#C8A060" />
    <Rect x={12} y={24} width={32} height={14} rx={2} fill="url(#spirit_g)" />
    <Rect x={14} y={26} width={10} height={10} rx={1} fill="#D8A828" opacity={0.3} />
    <Rect x={32} y={26} width={10} height={10} rx={1} fill="#D8A828" opacity={0.3} />
    <Rect x={24} y={28} width={8} height={8} rx={1} fill="#8B6848" />
    <Rect x={26} y={30} width={4} height={6} rx={0.5} fill="#6A4830" />
    <Path d="M8 24 Q28 14 48 24" fill="#E84848" stroke="#D83838" strokeWidth={0.5} />
    <Path d="M10 24 Q28 16 46 24" fill="#F06060" opacity={0.4} />
    <Path d="M6 24 Q28 12 50 24" fill="none" stroke="#D83838" strokeWidth={0.8} />
    <Circle cx={28} cy={18} r={1.5} fill="#F8D848" />
    <Line x1={14} y1={38} x2={14} y2={24} stroke="#D8A828" strokeWidth={1} />
    <Line x1={42} y1={38} x2={42} y2={24} stroke="#D8A828" strokeWidth={1} />
  </Svg>
);

export const ElephantStatue = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={48} rx={18} ry={3} fill="#C8C0B8" opacity={0.3} />
    <Ellipse cx={30} cy={32} rx={14} ry={12} fill="#A0A8B0" />
    <Ellipse cx={30} cy={30} rx={10} ry={7} fill="#B0B8C0" opacity={0.4} />
    <Circle cx={24} cy={22} r={10} fill="#A0A8B0" />
    <Circle cx={16} cy={24} r={6} fill="#98A0A8" />
    <Ellipse cx={16} cy={24} rx={4} ry={5} fill="#A8B0B8" opacity={0.4} />
    <Circle cx={36} cy={24} r={5} fill="#98A0A8" />
    <Circle cx={21} cy={20} r={2} fill="#1A1A2E" />
    <Circle cx={20.5} cy={19.5} r={0.6} fill="#FFFFFF" />
    <Path d="M18 28 Q16 38 14 42 Q13 44 16 44" fill="none" stroke="#A0A8B0" strokeWidth={2.5} strokeLinecap="round" />
    <Rect x={20} y={40} width={5} height={8} rx={2.5} fill="#98A0A8" />
    <Rect x={30} y={40} width={5} height={8} rx={2.5} fill="#98A0A8" />
    <Rect x={36} y={42} width={5} height={6} rx={2.5} fill="#98A0A8" />
    <Path d="M38 32 Q44 30 44 34 Q44 36 40 36" fill="none" stroke="#A0A8B0" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const LotusPond = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="pond_g" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0" stopColor="#88C8E0" />
        <Stop offset="1" stopColor="#68A8C8" />
      </RadialGradient>
    </Defs>
    <Ellipse cx={28} cy={36} rx={24} ry={14} fill="url(#pond_g)" />
    <Ellipse cx={28} cy={36} rx={24} ry={14} fill="none" stroke="#5898A8" strokeWidth={0.8} />
    <Ellipse cx={18} cy={38} rx={8} ry={3} fill="#48A848" opacity={0.5} />
    <Ellipse cx={40} cy={34} rx={7} ry={2.5} fill="#48A848" opacity={0.4} />
    <G>
      <Ellipse cx={28} cy={24} rx={4} ry={7} fill="#F8A0B8" />
      <Ellipse cx={22} cy={26} rx={4} ry={6} fill="#F8A0B8" transform="rotate(-25, 22, 26)" />
      <Ellipse cx={34} cy={26} rx={4} ry={6} fill="#F8A0B8" transform="rotate(25, 34, 26)" />
      <Ellipse cx={24} cy={30} rx={3.5} ry={5} fill="#F0B0C0" transform="rotate(15, 24, 30)" />
      <Ellipse cx={32} cy={30} rx={3.5} ry={5} fill="#F0B0C0" transform="rotate(-15, 32, 30)" />
      <Circle cx={28} cy={28} r={3} fill="#F8D848" />
      <Circle cx={28} cy={28} r={1.5} fill="#E8C030" />
    </G>
    <Circle cx={12} cy={40} r={1.5} fill="#A8E0F0" opacity={0.4} />
    <Circle cx={44} cy={38} r={1} fill="#A8E0F0" opacity={0.4} />
  </Svg>
);

export const FrangipaniTree = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={25} y={30} width={6} height={22} rx={2} fill="#A08060" />
    <Path d="M28 32 Q16 30 12 24 Q10 16 18 12 Q24 8 30 12 Q36 8 42 12 Q48 16 44 24 Q40 30 28 32 Z" fill="#48A838" />
    <Ellipse cx={20} cy={20} rx={4} ry={3} fill="#58B848" opacity={0.5} />
    <Ellipse cx={36} cy={18} rx={3.5} ry={2.5} fill="#58B848" opacity={0.4} />
    <G>
      <Ellipse cx={22} cy={16} rx={2} ry={3.5} fill="#F8F0E0" transform="rotate(-30, 22, 16)" />
      <Ellipse cx={22} cy={16} rx={2} ry={3.5} fill="#F8F0E0" transform="rotate(42, 22, 16)" />
      <Ellipse cx={22} cy={16} rx={2} ry={3.5} fill="#F8F0E0" transform="rotate(114, 22, 16)" />
      <Ellipse cx={22} cy={16} rx={2} ry={3.5} fill="#F8F0E0" transform="rotate(186, 22, 16)" />
      <Ellipse cx={22} cy={16} rx={2} ry={3.5} fill="#F8F0E0" transform="rotate(258, 22, 16)" />
      <Circle cx={22} cy={16} r={1.5} fill="#F8E060" />
    </G>
    <G>
      <Ellipse cx={34} cy={14} rx={1.8} ry={3} fill="#F8F0E0" transform="rotate(-20, 34, 14)" />
      <Ellipse cx={34} cy={14} rx={1.8} ry={3} fill="#F8F0E0" transform="rotate(52, 34, 14)" />
      <Ellipse cx={34} cy={14} rx={1.8} ry={3} fill="#F8F0E0" transform="rotate(124, 34, 14)" />
      <Ellipse cx={34} cy={14} rx={1.8} ry={3} fill="#F8F0E0" transform="rotate(196, 34, 14)" />
      <Ellipse cx={34} cy={14} rx={1.8} ry={3} fill="#F8F0E0" transform="rotate(268, 34, 14)" />
      <Circle cx={34} cy={14} r={1.2} fill="#F8E060" />
    </G>
  </Svg>
);

export const ThBamboo = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={14} y={4} width={4} height={48} rx={2} fill="#68A848" />
    <Line x1={14} y1={16} x2={18} y2={16} stroke="#508838" strokeWidth={1} />
    <Line x1={14} y1={28} x2={18} y2={28} stroke="#508838" strokeWidth={1} />
    <Line x1={14} y1={40} x2={18} y2={40} stroke="#508838" strokeWidth={1} />
    <Path d="M18 14 Q24 10 28 12" fill="#78B858" stroke="#68A848" strokeWidth={0.5} />
    <Path d="M14 26 Q8 22 4 24" fill="#78B858" stroke="#68A848" strokeWidth={0.5} />
    <Rect x={26} y={8} width={3.5} height={44} rx={1.75} fill="#78B858" />
    <Line x1={26} y1={22} x2={29.5} y2={22} stroke="#68A848" strokeWidth={0.8} />
    <Line x1={26} y1={36} x2={29.5} y2={36} stroke="#68A848" strokeWidth={0.8} />
    <Path d="M29.5 20 Q35 16 39 18" fill="#88C868" stroke="#78B858" strokeWidth={0.5} />
    <Rect x={38} y={12} width={3} height={40} rx={1.5} fill="#88C868" opacity={0.7} />
    <Line x1={38} y1={26} x2={41} y2={26} stroke="#78B858" strokeWidth={0.7} />
    <Line x1={38} y1={38} x2={41} y2={38} stroke="#78B858" strokeWidth={0.7} />
    <Path d="M38 24 Q34 20 30 22" fill="#78B858" stroke="#68A848" strokeWidth={0.4} opacity={0.6} />
  </Svg>
);

export const thIllustrations: Record<string, React.FC<{ size?: number }>> = {
  th_l1: BuddhaStatue,
  th_l2: ThaiPuppet,
  th_l3: Orchid,
  th_l4: SilkFabric,
  th_l5: FloorMat,
  th_k1: PadThai,
  th_k2: GreenCurry,
  th_k3: StickyRice,
  th_k4: ChiliPeppers,
  th_k5: ThaiIcedTea,
  th_g1: SpiritHouse,
  th_g2: ElephantStatue,
  th_g3: LotusPond,
  th_g4: FrangipaniTree,
  th_g5: ThBamboo,
};
