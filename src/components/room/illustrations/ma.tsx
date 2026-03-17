import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

const ZelligeTiles = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#F8F0E8" stroke="#D8C8A8" strokeWidth={0.8} />
    <G>
      <Path d="M28 14 L34 20 L28 26 L22 20 Z" fill="#2878A8" stroke="#1868A0" strokeWidth={0.5} />
      <Path d="M16 20 L22 26 L16 32 L10 26 Z" fill="#48A878" stroke="#389868" strokeWidth={0.5} />
      <Path d="M40 20 L46 26 L40 32 L34 26 Z" fill="#E8A848" stroke="#D09838" strokeWidth={0.5} />
      <Path d="M28 26 L34 32 L28 38 L22 32 Z" fill="#D85848" stroke="#C84838" strokeWidth={0.5} />
      <Path d="M16 32 L22 38 L16 44 L10 38 Z" fill="#2878A8" stroke="#1868A0" strokeWidth={0.5} />
      <Path d="M40 32 L46 38 L40 44 L34 38 Z" fill="#48A878" stroke="#389868" strokeWidth={0.5} />
      <Path d="M28 38 L34 44 L28 50 L22 44 Z" fill="#E8A848" stroke="#D09838" strokeWidth={0.5} />
    </G>
    <Circle cx={28} cy={20} r={1.5} fill="#F8F0E8" opacity={0.6} />
    <Circle cx={28} cy={32} r={1.5} fill="#F8F0E8" opacity={0.6} />
  </Svg>
);

const Lantern = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ma_lan" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C8883A" />
        <Stop offset="1" stopColor="#A87030" />
      </LinearGradient>
    </Defs>
    <Line x1={28} y1={2} x2={28} y2={10} stroke="#A07830" strokeWidth={1.5} />
    <Rect x={24} y={8} width={8} height={3} rx={1} fill="#C8883A" />
    <Path d="M22 11 Q20 28 22 40 L34 40 Q36 28 34 11 Z" fill="url(#ma_lan)" />
    <Path d="M22 11 L34 11" stroke="#D8A050" strokeWidth={1} />
    <Path d="M22 18 Q28 22 34 18" fill="none" stroke="#F8D878" strokeWidth={0.8} opacity={0.6} />
    <Path d="M22 26 Q28 30 34 26" fill="none" stroke="#F8D878" strokeWidth={0.8} opacity={0.6} />
    <Path d="M22 34 Q28 38 34 34" fill="none" stroke="#F8D878" strokeWidth={0.8} opacity={0.6} />
    <Circle cx={28} cy={25} r={4} fill="#F8E078" opacity={0.3} />
    <Rect x={24} y={40} width={8} height={3} rx={1} fill="#C8883A" />
    <Path d="M28 43 L28 48 L26 52" fill="none" stroke="#A07830" strokeWidth={1} strokeLinecap="round" />
    <Path d="M28 48 L30 52" fill="none" stroke="#A07830" strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

const OrangeTree = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={25} y={34} width={6} height={16} rx={2} fill="#A08060" />
    <Path d="M28 34 Q14 34 12 24 Q10 14 20 10 Q28 4 36 10 Q46 14 44 24 Q42 34 28 34 Z" fill="#48A050" />
    <Circle cx={18} cy={18} r={3.5} fill="#50B060" opacity={0.5} />
    <Circle cx={36} cy={16} r={3} fill="#50B060" opacity={0.4} />
    <Circle cx={28} cy={12} r={3} fill="#50B060" opacity={0.5} />
    <Circle cx={20} cy={24} r={3.5} fill="#F8A030" />
    <Circle cx={20} cy={23} r={1.5} fill="#F8B858" opacity={0.5} />
    <Circle cx={34} cy={22} r={3} fill="#F8A030" />
    <Circle cx={34} cy={21} r={1.3} fill="#F8B858" opacity={0.5} />
    <Circle cx={28} cy={28} r={2.8} fill="#F8A030" />
    <Circle cx={28} cy={27} r={1.2} fill="#F8B858" opacity={0.5} />
  </Svg>
);

const Carpet = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={12} width={44} height={32} rx={1} fill="#C83838" />
    <Rect x={10} y={16} width={36} height={24} rx={1} fill="none" stroke="#F8D878" strokeWidth={1} />
    <Rect x={14} y={20} width={28} height={16} rx={1} fill="none" stroke="#E8A848" strokeWidth={0.8} />
    <Path d="M28 20 L28 36" stroke="#F8D878" strokeWidth={0.5} opacity={0.5} />
    <Path d="M14 28 L42 28" stroke="#F8D878" strokeWidth={0.5} opacity={0.5} />
    <Circle cx={21} cy={24} r={2} fill="#E8A848" opacity={0.6} />
    <Circle cx={35} cy={24} r={2} fill="#E8A848" opacity={0.6} />
    <Circle cx={21} cy={32} r={2} fill="#E8A848" opacity={0.6} />
    <Circle cx={35} cy={32} r={2} fill="#E8A848" opacity={0.6} />
    <Circle cx={28} cy={28} r={3} fill="#F8D878" opacity={0.4} />
    {[8, 14, 20, 26, 32, 38, 44].map((x, i) => (
      <Line key={i} x1={x} y1={44} x2={x} y2={50} stroke="#C83838" strokeWidth={1.5} strokeLinecap="round" />
    ))}
    {[8, 14, 20, 26, 32, 38, 44].map((x, i) => (
      <Line key={`t${i}`} x1={x} y1={12} x2={x} y2={6} stroke="#C83838" strokeWidth={1.5} strokeLinecap="round" />
    ))}
  </Svg>
);

const Fountain = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ma_water" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#88C8E8" />
        <Stop offset="1" stopColor="#68A8D0" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={46} rx={22} ry={6} fill="#D8C8A0" stroke="#C0B090" strokeWidth={0.8} />
    <Ellipse cx={28} cy={44} rx={20} ry={5} fill="url(#ma_water)" />
    <Rect x={25} y={22} width={6} height={22} rx={2} fill="#D8C8A0" />
    <Ellipse cx={28} cy={22} rx={8} ry={3} fill="#D0B890" stroke="#C0A880" strokeWidth={0.8} />
    <Ellipse cx={28} cy={21} rx={6} ry={2} fill="url(#ma_water)" />
    <Path d="M28 18 Q26 10 22 14" fill="none" stroke="#88C8E8" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
    <Path d="M28 18 Q30 10 34 14" fill="none" stroke="#88C8E8" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
    <Path d="M28 18 Q28 8 28 12" fill="none" stroke="#88C8E8" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
    <Circle cx={24} cy={12} r={1} fill="#A8D8F0" opacity={0.5} />
    <Circle cx={32} cy={13} r={0.8} fill="#A8D8F0" opacity={0.4} />
  </Svg>
);

const TaginePot = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ma_tag" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D89858" />
        <Stop offset="1" stopColor="#C08040" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={46} rx={18} ry={5} fill="#B07838" />
    <Rect x={12} y={36} width={32} height={10} rx={2} fill="#C08848" />
    <Ellipse cx={28} cy={36} rx={16} ry={5} fill="#D09858" />
    <Path d="M16 36 Q18 24 22 18 Q28 8 34 18 Q38 24 40 36" fill="url(#ma_tag)" />
    <Circle cx={28} cy={10} r={3} fill="#D89858" stroke="#C08040" strokeWidth={0.8} />
    <Path d="M20 28 Q28 24 36 28" fill="none" stroke="#E8B878" strokeWidth={0.8} opacity={0.5} />
    <Path d="M18 32 Q28 28 38 32" fill="none" stroke="#E8B878" strokeWidth={0.8} opacity={0.4} />
    <Ellipse cx={28} cy={10} rx={1.5} ry={1} fill="#E8B878" opacity={0.5} />
  </Svg>
);

const MintTeaSet = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M14 22 Q14 42 24 42 L24 22 Z" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth={0.8} />
    <Ellipse cx={19} cy={22} rx={5} ry={2.5} fill="#D0D0D0" stroke="#A0A0A0" strokeWidth={0.5} />
    <Path d="M24 28 Q30 26 30 32 Q30 38 24 36" fill="none" stroke="#A0A0A0" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M14 28 Q10 24 12 18" fill="none" stroke="#A0A0A0" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M17 18 Q16 12 18 8" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.5} />
    <Path d="M36 28 Q36 44 42 44 Q48 44 48 28 Z" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth={0.6} />
    <Ellipse cx={42} cy={28} rx={6} ry={2.5} fill="#D8D8D8" />
    <Ellipse cx={42} cy={30} rx={4} ry={1.5} fill="#78B868" opacity={0.5} />
    <Circle cx={42} cy={30} r={1} fill="#48A040" opacity={0.6} />
    <Path d="M38 26 Q36 22 38 18" fill="none" stroke="#D0D0D0" strokeWidth={0.6} opacity={0.4} />
  </Svg>
);

const Couscous = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ma_cb" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8D0A0" />
        <Stop offset="1" stopColor="#C8A870" />
      </LinearGradient>
    </Defs>
    <Path d="M8 30 Q8 48 28 48 Q48 48 48 30 Z" fill="url(#ma_cb)" stroke="#B89860" strokeWidth={1} />
    <Ellipse cx={28} cy={30} rx={20} ry={7} fill="#F0E0B8" />
    <Path d="M16 28 Q20 24 28 26 Q36 24 42 28" fill="#F8E8C8" stroke="#E8D0A0" strokeWidth={0.5} />
    {[18, 24, 30, 36].map((x, i) => (
      <Circle key={i} cx={x} cy={27 + (i % 2)} r={1} fill="#D8B878" opacity={0.5} />
    ))}
    <Circle cx={22} cy={24} r={1.5} fill="#E87848" opacity={0.6} />
    <Circle cx={34} cy={25} r={1.2} fill="#48A848" opacity={0.5} />
    <Circle cx={28} cy={23} r={1} fill="#E8C848" opacity={0.6} />
  </Svg>
);

const SpiceJars = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={28} width={12} height={18} rx={3} fill="#E8A030" />
    <Rect x={6} y={24} width={12} height={6} rx={2} fill="#C08828" />
    <Ellipse cx={12} cy={36} rx={4} ry={2} fill="#F0B848" opacity={0.4} />
    <Rect x={22} y={30} width={12} height={16} rx={3} fill="#D84040" />
    <Rect x={22} y={26} width={12} height={6} rx={2} fill="#B83030" />
    <Ellipse cx={28} cy={38} rx={4} ry={2} fill="#E85858" opacity={0.4} />
    <Rect x={38} y={32} width={12} height={14} rx={3} fill="#48A858" />
    <Rect x={38} y={28} width={12} height={6} rx={2} fill="#389848" />
    <Ellipse cx={44} cy={38} rx={4} ry={2} fill="#58B868" opacity={0.4} />
    <Rect x={4} y={46} width={48} height={4} rx={2} fill="#C8B090" />
  </Svg>
);

const Flatbread = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={34} rx={20} ry={14} fill="#E8C888" />
    <Ellipse cx={28} cy={32} rx={18} ry={12} fill="#F0D8A0" />
    <Ellipse cx={28} cy={30} rx={14} ry={8} fill="#E8C888" opacity={0.3} />
    {[20, 26, 32, 24, 36].map((x, i) => (
      <Circle key={i} cx={x} cy={30 + (i % 3) * 2} r={1 + (i % 2) * 0.5} fill="#D8B070" opacity={0.4} />
    ))}
    <Path d="M16 30 Q22 26 28 30 Q34 34 40 30" fill="none" stroke="#D8B878" strokeWidth={0.5} opacity={0.4} />
  </Svg>
);

const LeatherGoods = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ma_leath" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C87838" />
        <Stop offset="1" stopColor="#A06028" />
      </LinearGradient>
    </Defs>
    <Path d="M14 18 L14 42 Q14 46 18 46 L38 46 Q42 46 42 42 L42 18 Z" fill="url(#ma_leath)" />
    <Path d="M14 18 Q28 14 42 18" fill="#D88848" stroke="#B07030" strokeWidth={0.5} />
    <Rect x={18} y={24} width={20} height={12} rx={2} fill="#B87030" />
    <Rect x={20} y={26} width={16} height={8} rx={1} fill="none" stroke="#D09050" strokeWidth={0.8} />
    <Circle cx={28} cy={30} r={2} fill="#D09050" />
    <Circle cx={28} cy={30} r={1} fill="#C08040" />
    <Path d="M22 10 Q28 6 34 10" fill="none" stroke="#A06028" strokeWidth={2} strokeLinecap="round" />
    <Line x1={22} y1={10} x2={22} y2={18} stroke="#A06028" strokeWidth={1.5} />
    <Line x1={34} y1={10} x2={34} y2={18} stroke="#A06028" strokeWidth={1.5} />
  </Svg>
);

const Pottery = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M18 18 Q16 36 18 44 L38 44 Q40 36 38 18 Z" fill="#F0F0F8" stroke="#88A8D8" strokeWidth={1} />
    <Ellipse cx={28} cy={18} rx={10} ry={4} fill="#F8F8FF" stroke="#88A8D8" strokeWidth={0.8} />
    <Path d="M18 26 Q28 30 38 26" fill="none" stroke="#3868A8" strokeWidth={1} />
    <Path d="M18 32 Q28 28 38 32" fill="none" stroke="#3868A8" strokeWidth={1} />
    <Circle cx={23} cy={29} r={2} fill="#3868A8" opacity={0.5} />
    <Circle cx={33} cy={29} r={2} fill="#3868A8" opacity={0.5} />
    <Circle cx={28} cy={37} r={2.5} fill="#3868A8" opacity={0.4} />
    <Path d="M24 38 Q28 42 32 38" fill="none" stroke="#3868A8" strokeWidth={0.8} opacity={0.5} />
    <Ellipse cx={28} cy={46} rx={12} ry={3} fill="#D8D8E8" />
  </Svg>
);

const BrassTray = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="ma_brass" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0" stopColor="#E8C868" />
        <Stop offset="1" stopColor="#C8A040" />
      </RadialGradient>
    </Defs>
    <Ellipse cx={28} cy={34} rx={22} ry={12} fill="url(#ma_brass)" stroke="#B89030" strokeWidth={1} />
    <Ellipse cx={28} cy={32} rx={20} ry={10} fill="none" stroke="#D8B850" strokeWidth={0.8} />
    <Ellipse cx={28} cy={32} rx={14} ry={7} fill="none" stroke="#D8B850" strokeWidth={0.6} />
    <Ellipse cx={28} cy={32} rx={8} ry={4} fill="none" stroke="#D8B850" strokeWidth={0.5} />
    <Path d="M20 30 Q24 28 28 30 Q32 32 36 30" fill="none" stroke="#E8D070" strokeWidth={0.4} />
    <Ellipse cx={28} cy={32} rx={3} ry={1.5} fill="#E8D070" opacity={0.4} />
  </Svg>
);

const WovenBasket = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M12 22 Q10 44 16 46 L40 46 Q46 44 44 22 Z" fill="#D8B070" stroke="#C09848" strokeWidth={0.8} />
    <Ellipse cx={28} cy={22} rx={16} ry={5} fill="#E8C888" stroke="#C09848" strokeWidth={0.8} />
    {[0, 1, 2, 3, 4, 5].map(i => (
      <Path key={i} d={`M${14 + i * 5} 24 L${14 + i * 5} 44`} stroke="#B08840" strokeWidth={0.8} opacity={0.5} />
    ))}
    {[0, 1, 2, 3].map(i => (
      <Path key={`h${i}`} d={`M12 ${28 + i * 5} Q28 ${30 + i * 5} 44 ${28 + i * 5}`} fill="none" stroke="#C89848" strokeWidth={0.8} opacity={0.4} />
    ))}
  </Svg>
);

const MapOfMorocco = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M18 14 Q14 18 14 24 Q16 28 14 32 Q12 36 16 40 Q22 42 28 40 Q34 38 36 34 Q38 28 36 22 Q34 18 30 16 Q26 12 18 14 Z" fill="#E8C888" stroke="#C8A060" strokeWidth={0.8} />
    <Circle cx={22} cy={22} r={1.5} fill="#E84860" />
    <Circle cx={28} cy={30} r={1} fill="#E84860" opacity={0.6} />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const maIllustrations: Record<string, React.FC<{ size?: number }>> = {
  ma_l1: ZelligeTiles,
  ma_l2: Lantern,
  ma_l3: OrangeTree,
  ma_l4: Carpet,
  ma_l5: Fountain,
  ma_k1: TaginePot,
  ma_k2: MintTeaSet,
  ma_k3: Couscous,
  ma_k4: SpiceJars,
  ma_k5: Flatbread,
  ma_c1: LeatherGoods,
  ma_c2: Pottery,
  ma_c3: BrassTray,
  ma_c4: WovenBasket,
  ma_c5: MapOfMorocco,
};
