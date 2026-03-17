import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const Crown = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="crn_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8D848" />
        <Stop offset="1" stopColor="#D8A830" />
      </LinearGradient>
    </Defs>
    <Path d="M10 40 L10 24 L18 32 L28 18 L38 32 L46 24 L46 40 Z" fill="url(#crn_g)" stroke="#C89820" strokeWidth={1} />
    <Rect x={10} y={38} width={36} height={6} rx={2} fill="#D8A830" stroke="#C89820" strokeWidth={0.8} />
    <Circle cx={18} cy={32} r={1} fill="#FFFFFF" opacity={0.4} />
    <Circle cx={28} cy={42} r={2.5} fill="#E84060" />
    <Circle cx={18} cy={42} r={2} fill="#4080E8" />
    <Circle cx={38} cy={42} r={2} fill="#48C878" />
    <Circle cx={10} cy={24} r={2.5} fill="#F8D848" />
    <Circle cx={28} cy={18} r={2.5} fill="#F8D848" />
    <Circle cx={46} cy={24} r={2.5} fill="#F8D848" />
    <Ellipse cx={28} cy={34} rx={8} ry={1} fill="#E8C040" opacity={0.4} />
  </Svg>
);

export const BritishTeaSet = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="bts_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8F0F0" />
        <Stop offset="1" stopColor="#E8D8D8" />
      </LinearGradient>
    </Defs>
    <Path d="M16 20 Q16 42 28 42 Q40 42 40 20 Z" fill="url(#bts_g)" stroke="#D0B8B8" strokeWidth={0.8} />
    <Ellipse cx={28} cy={20} rx={12} ry={4} fill="#F8F0F0" stroke="#D0B8B8" strokeWidth={0.8} />
    <Path d="M40 26 Q48 26 48 32 Q48 38 40 36" fill="none" stroke="#D0B8B8" strokeWidth={1.5} />
    <Path d="M22 16 Q20 10 22 6" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.5} />
    <Path d="M28 14 Q30 8 28 4" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.5} />
    <Circle cx={24} cy={30} r={2} fill="#E8A0B0" opacity={0.4} />
    <Circle cx={32} cy={28} r={1.5} fill="#E8A0B0" opacity={0.3} />
    <Circle cx={8} cy={38} r={5} fill="#F8F0F0" stroke="#D0B8B8" strokeWidth={0.7} />
    <Ellipse cx={8} cy={36} rx={3.5} ry={1.5} fill="#C8986A" opacity={0.5} />
    <Path d="M13 38 Q16 36 16 38" fill="none" stroke="#D0B8B8" strokeWidth={0.8} />
    <Ellipse cx={28} cy={46} rx={8} ry={2} fill="#E8D8D8" opacity={0.4} />
  </Svg>
);

export const BigBenModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ben_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8D8C0" />
        <Stop offset="1" stopColor="#D0C0A0" />
      </LinearGradient>
    </Defs>
    <Rect x={20} y={20} width={16} height={30} rx={1} fill="url(#ben_g)" stroke="#B8A880" strokeWidth={0.8} />
    <Path d="M18 20 L28 8 L38 20 Z" fill="#D0C0A0" stroke="#B8A880" strokeWidth={0.8} />
    <Circle cx={28} cy={14} r={1.5} fill="#F8D848" />
    <Rect x={18} y={18} width={20} height={4} rx={1} fill="#C8B890" />
    <Circle cx={28} cy={32} r={6} fill="#F8F4E8" stroke="#C8B890" strokeWidth={0.8} />
    <Line x1={28} y1={32} x2={28} y2={27} stroke="#4A3828" strokeWidth={1} strokeLinecap="round" />
    <Line x1={28} y1={32} x2={33} y2={30} stroke="#4A3828" strokeWidth={0.8} strokeLinecap="round" />
    <Circle cx={28} cy={32} r={1} fill="#C89030" />
    <Rect x={22} y={42} width={12} height={3} rx={0.5} fill="#C8B890" />
    <Rect x={22} y={46} width={12} height={3} rx={0.5} fill="#C8B890" />
    <Line x1={28} y1={20} x2={28} y2={42} stroke="#C8B890" strokeWidth={0.3} opacity={0.3} />
  </Svg>
);

export const PaddingtonBear = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={38} rx={12} ry={12} fill="#C8885A" />
    <Circle cx={28} cy={20} r={10} fill="#C8885A" />
    <Circle cx={20} cy={14} r={4} fill="#C8885A" />
    <Circle cx={20} cy={14} r={2.5} fill="#E8A878" />
    <Circle cx={36} cy={14} r={4} fill="#C8885A" />
    <Circle cx={36} cy={14} r={2.5} fill="#E8A878" />
    <Circle cx={24} cy={20} r={1.5} fill="#1A1A2E" />
    <Circle cx={32} cy={20} r={1.5} fill="#1A1A2E" />
    <Ellipse cx={28} cy={23} rx={2} ry={1.5} fill="#1A1A2E" />
    <Path d="M26 25 Q28 27 30 25" fill="none" stroke="#A06838" strokeWidth={0.6} />
    <Rect x={18} y={8} width={20} height={6} rx={2} fill="#E84040" />
    <Rect x={16} y={12} width={24} height={3} rx={1} fill="#D03030" />
    <Rect x={20} y={30} width={16} height={16} rx={2} fill="#4880C8" />
    <Rect x={20} y={30} width={16} height={4} rx={1} fill="#3868B0" />
    <Circle cx={24} cy={22} r={0.6} fill="#FFFFFF" opacity={0.6} />
    <Circle cx={32} cy={22} r={0.6} fill="#FFFFFF" opacity={0.6} />
  </Svg>
);

export const Fireplace = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={8} width={44} height={40} rx={3} fill="#C88860" />
    <Rect x={8} y={6} width={40} height={4} rx={2} fill="#A87048" />
    <Rect x={8} y={44} width={40} height={6} rx={2} fill="#A87048" />
    <Path d="M14 44 L14 24 Q28 20 42 24 L42 44 Z" fill="#2A2A2A" />
    <Path d="M14 24 Q28 20 42 24" fill="none" stroke="#A87048" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M24 44 Q22 34 26 30 Q28 26 28 22 Q28 26 30 30 Q34 34 32 44" fill="#F88040" opacity={0.9} />
    <Path d="M26 44 Q25 38 28 34 Q31 38 30 44" fill="#F8C040" opacity={0.8} />
    <Path d="M27 44 Q27 40 28 38 Q29 40 29 44" fill="#F8E860" opacity={0.7} />
    <Circle cx={20} cy={42} r={2} fill="#A08070" opacity={0.5} />
    <Circle cx={36} cy={42} r={1.8} fill="#A08070" opacity={0.5} />
  </Svg>
);

export const FishAndChips = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={30} width={44} height={18} rx={3} fill="#F8F0E0" stroke="#E0D0B8" strokeWidth={0.8} />
    <Path d="M10 30 Q12 18 22 16 Q30 14 36 18 Q40 22 42 30" fill="#E8C878" stroke="#D8B060" strokeWidth={0.8} />
    <Ellipse cx={26} cy={24} rx={10} ry={5} fill="#D8B060" opacity={0.3} />
    <Ellipse cx={26} cy={22} rx={6} ry={2} fill="#F0D888" opacity={0.4} />
    {[12, 18, 24, 30, 36, 42].map((x, i) => (
      <Rect key={i} x={x} y={32 + (i % 2) * 2} width={3} height={12} rx={1.5} fill="#F8D868" stroke="#E0C050" strokeWidth={0.4} />
    ))}
    <Circle cx={16} cy={36} r={1.5} fill="#48A040" opacity={0.5} />
    <Circle cx={40} cy={34} r={1} fill="#48A040" opacity={0.4} />
  </Svg>
);

export const Kettle = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ket_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D0D8E0" />
        <Stop offset="1" stopColor="#A8B0B8" />
      </LinearGradient>
    </Defs>
    <Path d="M16 22 Q16 44 28 44 Q40 44 40 22 Z" fill="url(#ket_g)" stroke="#909898" strokeWidth={0.8} />
    <Ellipse cx={28} cy={22} rx={12} ry={4} fill="#C0C8D0" stroke="#909898" strokeWidth={0.8} />
    <Path d="M40 28 Q48 26 48 32 Q48 36 40 36" fill="none" stroke="#909898" strokeWidth={2} strokeLinecap="round" />
    <Path d="M16 28 Q10 22 12 16" fill="none" stroke="#909898" strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 16 L8 12" fill="none" stroke="#909898" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M24 18 Q22 12 24 8" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Path d="M32 18 Q34 10 32 6" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Rect x={24} y={18} width={8} height={3} rx={1.5} fill="#A0A8B0" />
  </Svg>
);

export const Scones = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={44} rx={20} ry={4} fill="#E8D8C8" />
    <Ellipse cx={28} cy={42} rx={18} ry={3} fill="#F8F0E8" stroke="#E0D0C0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={36} rx={10} ry={8} fill="#E8C890" stroke="#D0B070" strokeWidth={0.8} />
    <Ellipse cx={28} cy={33} rx={7} ry={3} fill="#F0D8A8" opacity={0.5} />
    <Line x1={20} y1={34} x2={36} y2={34} stroke="#C8A868" strokeWidth={0.5} />
    <Ellipse cx={28} cy={34} rx={8} ry={1.5} fill="#F8F0E8" opacity={0.8} />
    <Ellipse cx={26} cy={32} rx={3} ry={2} fill="#E84060" opacity={0.7} />
    <Ellipse cx={31} cy={32} rx={2.5} ry={1.8} fill="#F8E8A0" opacity={0.7} />
    <Circle cx={24} cy={30} r={1} fill="#E84060" opacity={0.4} />
  </Svg>
);

export const Biscuits = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={42} rx={20} ry={5} fill="#E8D8C8" stroke="#D0C0A8" strokeWidth={0.5} />
    <Ellipse cx={28} cy={40} rx={18} ry={4} fill="#F8F0E8" />
    <Ellipse cx={22} cy={34} rx={8} ry={5} fill="#E8C878" stroke="#D0B060" strokeWidth={0.6} />
    <Ellipse cx={22} cy={32} rx={5} ry={2} fill="#F0D898" opacity={0.5} />
    <Circle cx={20} cy={34} r={1} fill="#C89848" opacity={0.5} />
    <Circle cx={24} cy={32} r={0.8} fill="#C89848" opacity={0.4} />
    <Ellipse cx={34} cy={32} rx={8} ry={5} fill="#D8A858" stroke="#C09040" strokeWidth={0.6} />
    <Ellipse cx={34} cy={30} rx={5} ry={2} fill="#E8C078" opacity={0.5} />
    <Circle cx={32} cy={32} r={1} fill="#A87838" opacity={0.5} />
    <Circle cx={36} cy={30} r={0.8} fill="#A87838" opacity={0.4} />
    <Ellipse cx={28} cy={28} rx={7} ry={4.5} fill="#E8C070" stroke="#D0A850" strokeWidth={0.6} />
    <Ellipse cx={28} cy={26} rx={4} ry={1.8} fill="#F0D088" opacity={0.5} />
    {[25, 28, 31].map(x => (
      <Circle key={x} cx={x} cy={28} r={0.8} fill="#B89040" opacity={0.5} />
    ))}
  </Svg>
);

export const MeatPie = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="pie_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8C068" />
        <Stop offset="1" stopColor="#D0A848" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={40} rx={20} ry={8} fill="#D8A840" />
    <Path d="M8 36 Q8 28 28 26 Q48 28 48 36" fill="url(#pie_g)" />
    <Ellipse cx={28} cy={36} rx={20} ry={6} fill="url(#pie_g)" stroke="#C09830" strokeWidth={0.8} />
    <Ellipse cx={28} cy={34} rx={14} ry={3} fill="#E8D078" opacity={0.4} />
    <Path d="M14 36 Q18 34 22 36 Q26 38 30 36 Q34 34 38 36 Q42 38 44 36" fill="none" stroke="#C89830" strokeWidth={0.8} />
    <Path d="M24 32 Q26 30 28 32 Q30 30 32 32" fill="none" stroke="#C89830" strokeWidth={0.6} />
    <Path d="M24 18 Q22 12 24 8" fill="none" stroke="#D8D8D8" strokeWidth={0.6} opacity={0.3} />
    <Path d="M30 16 Q32 10 30 6" fill="none" stroke="#D8D8D8" strokeWidth={0.6} opacity={0.3} />
  </Svg>
);

export const RoseBush = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={20} y={38} width={16} height={14} rx={3} fill="#C08848" stroke="#A87038" strokeWidth={0.8} />
    <Path d="M28 38 Q14 38 12 30 Q10 20 18 16 Q24 10 28 8 Q32 10 38 16 Q46 20 44 30 Q42 38 28 38 Z" fill="#48A040" />
    <Circle cx={20} cy={20} r={4} fill="#E84060" />
    <Path d="M18 18 Q20 16 22 18 Q20 20 18 18" fill="#F06080" opacity={0.6} />
    <Circle cx={34} cy={18} r={3.5} fill="#E84060" />
    <Path d="M32 16 Q34 14 36 16 Q34 18 32 16" fill="#F06080" opacity={0.6} />
    <Circle cx={28} cy={12} r={3} fill="#E84060" />
    <Path d="M26 10 Q28 8 30 10 Q28 12 26 10" fill="#F06080" opacity={0.6} />
    <Circle cx={16} cy={28} r={3} fill="#E84060" />
    <Circle cx={40} cy={26} r={2.8} fill="#E84060" />
    <Circle cx={24} cy={32} r={2} fill="#58B048" opacity={0.5} />
    <Circle cx={34} cy={30} r={1.8} fill="#58B048" opacity={0.4} />
  </Svg>
);

export const Fox = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={38} rx={14} ry={10} fill="#E88040" />
    <Circle cx={28} cy={22} r={10} fill="#E88040" />
    <Path d="M18 22 L14 8 L22 18 Z" fill="#E88040" />
    <Path d="M38 22 L42 8 L34 18 Z" fill="#E88040" />
    <Path d="M16 10 L20 18" fill="none" stroke="#F8C8A0" strokeWidth={2} />
    <Path d="M40 10 L36 18" fill="none" stroke="#F8C8A0" strokeWidth={2} />
    <Circle cx={24} cy={22} r={1.5} fill="#1A1A2E" />
    <Circle cx={32} cy={22} r={1.5} fill="#1A1A2E" />
    <Circle cx={24} cy={21.5} r={0.5} fill="#FFFFFF" />
    <Circle cx={32} cy={21.5} r={0.5} fill="#FFFFFF" />
    <Ellipse cx={28} cy={26} rx={2} ry={1.2} fill="#1A1A2E" />
    <Path d="M20 28 Q28 34 36 28" fill="#FFFFFF" />
    <Path d="M22 30 Q28 32 34 30" fill="#F8F0E8" />
    <Path d="M44 36 Q50 32 52 38 Q50 42 46 40" fill="#E88040" />
    <Path d="M50 36 Q52 38 50 40" fill="#FFFFFF" opacity={0.6} />
    <Ellipse cx={28} cy={46} rx={6} ry={2} fill="#E87838" opacity={0.3} />
  </Svg>
);

export const RainCloud = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="cld_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D0D8E0" />
        <Stop offset="1" stopColor="#A8B8C8" />
      </LinearGradient>
    </Defs>
    <Path d="M12 28 Q12 18 20 16 Q22 10 30 10 Q38 10 40 18 Q48 18 48 26 Q48 32 40 32 L16 32 Q12 32 12 28 Z" fill="url(#cld_g)" />
    <Ellipse cx={30} cy={16} rx={8} ry={5} fill="#D8E0E8" opacity={0.5} />
    {[18, 26, 34, 42].map((x, i) => (
      <G key={i}>
        <Line x1={x} y1={34 + i * 1} x2={x - 2} y2={42 + i * 1} stroke="#88B8D8" strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
      </G>
    ))}
    {[22, 30, 38].map((x, i) => (
      <Line key={`d${i}`} x1={x} y1={38 + i} x2={x - 2} y2={48 + i} stroke="#88B8D8" strokeWidth={1} strokeLinecap="round" opacity={0.5} />
    ))}
  </Svg>
);

export const CricketBat = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={22} y={4} width={12} height={30} rx={4} fill="#E8D0A0" stroke="#C8B080" strokeWidth={0.8} />
    <Rect x={24} y={6} width={8} height={8} rx={2} fill="#D8C090" opacity={0.4} />
    <Rect x={26} y={34} width={4} height={14} rx={1.5} fill="#A08060" />
    <Rect x={24} y={46} width={8} height={4} rx={2} fill="#A08060" />
    <Rect x={25} y={38} width={6} height={2} rx={0.5} fill="#C8A878" />
    <Rect x={25} y={42} width={6} height={2} rx={0.5} fill="#C8A878" />
    <Line x1={28} y1={4} x2={28} y2={34} stroke="#C8B080" strokeWidth={0.3} opacity={0.3} />
    <Circle cx={42} cy={40} r={5} fill="#C83030" stroke="#A82020" strokeWidth={0.8} />
    <Path d="M38 40 Q42 36 46 40" fill="none" stroke="#D84040" strokeWidth={0.5} />
    <Path d="M42 36 Q42 40 42 44" fill="none" stroke="#D84040" strokeWidth={0.5} />
  </Svg>
);

export const StoneCircle = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={44} rx={24} ry={6} fill="#C8D0A8" opacity={0.4} />
    <Rect x={10} y={24} width={5} height={20} rx={1} fill="#A0A098" stroke="#888880" strokeWidth={0.5} />
    <Rect x={18} y={20} width={5} height={24} rx={1} fill="#989890" stroke="#808078" strokeWidth={0.5} />
    <Rect x={33} y={20} width={5} height={24} rx={1} fill="#989890" stroke="#808078" strokeWidth={0.5} />
    <Rect x={41} y={24} width={5} height={20} rx={1} fill="#A0A098" stroke="#888880" strokeWidth={0.5} />
    <Rect x={17} y={18} width={22} height={4} rx={1} fill="#A8A8A0" stroke="#909088" strokeWidth={0.5} />
    <Rect x={26} y={26} width={4} height={18} rx={1} fill="#90908A" opacity={0.5} />
    <Ellipse cx={13} cy={28} rx={2} ry={1} fill="#B0B0A8" opacity={0.3} />
    <Ellipse cx={44} cy={28} rx={2} ry={1} fill="#B0B0A8" opacity={0.3} />
  </Svg>
);

export const HPBooks = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={16} width={10} height={32} rx={1} fill="#4A2080" />
    <Rect x={19} y={14} width={10} height={34} rx={1} fill="#C83030" />
    <Rect x={30} y={18} width={10} height={30} rx={1} fill="#2060A0" />
    <Rect x={41} y={16} width={8} height={32} rx={1} fill="#E8A030" />
    <Rect x={10} y={20} width={6} height={4} rx={1} fill="#F8D848" opacity={0.7} />
    <Rect x={21} y={18} width={6} height={4} rx={1} fill="#F8D848" opacity={0.7} />
    <Rect x={32} y={22} width={6} height={4} rx={1} fill="#F8D848" opacity={0.7} />
    <Path d="M12 28 L14 26 L14 30 Z" fill="#F8D848" opacity={0.5} />
    <Circle cx={24} cy={30} r={2} fill="#F8D848" opacity={0.4} />
    <Path d="M34 30 L36 28 L36 32 Z" fill="#F8D848" opacity={0.4} />
    <Rect x={8} y={46} width={41} height={4} rx={1} fill="#D8C8B0" />
  </Svg>
);

export const Shakespeare = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="scr_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F8F0D8" />
        <Stop offset="1" stopColor="#E8D8B8" />
      </LinearGradient>
    </Defs>
    <Rect x={16} y={12} width={28} height={36} rx={2} fill="url(#scr_g)" stroke="#C8B890" strokeWidth={0.8} />
    <Ellipse cx={16} cy={30} rx={3} ry={18} fill="#E0D0B0" />
    {[18, 22, 26, 30, 34, 38].map(y => (
      <Line key={y} x1={22} y1={y} x2={38} y2={y} stroke="#C8C0A8" strokeWidth={0.4} />
    ))}
    <Path d="M24 20 Q28 18 32 20 Q30 22 28 26" fill="none" stroke="#6A5A40" strokeWidth={0.6} />
    <Rect x={4} y={8} width={3} height={40} rx={1} fill="#8B6848" transform="rotate(-10, 4, 8)" />
    <Path d="M4 8 L10 6 L8 10 Z" fill="#2A2A2A" />
    <Circle cx={6} cy={48} r={2} fill="#2A2A2A" opacity={0.4} />
  </Svg>
);

export const Magnifier = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="mag_g" cx="0.4" cy="0.4" r="0.6">
        <Stop offset="0" stopColor="#E8F0F8" />
        <Stop offset="1" stopColor="#C0D8E8" />
      </RadialGradient>
    </Defs>
    <Circle cx={24} cy={22} r={14} fill="none" stroke="#C8A060" strokeWidth={3} />
    <Circle cx={24} cy={22} r={12} fill="url(#mag_g)" opacity={0.6} />
    <Ellipse cx={20} cy={18} rx={4} ry={3} fill="#FFFFFF" opacity={0.4} />
    <Rect x={34} y={32} width={5} height={18} rx={2} fill="#A07848" transform="rotate(-45, 36, 40)" />
    <Rect x={35} y={34} width={3} height={4} rx={1} fill="#C89868" transform="rotate(-45, 36, 36)" />
  </Svg>
);

export const EmpireMap = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="emap_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F8F0D8" />
        <Stop offset="1" stopColor="#E8D8B8" />
      </LinearGradient>
    </Defs>
    <Rect x={6} y={8} width={44} height={40} rx={2} fill="url(#emap_g)" stroke="#C8B890" strokeWidth={0.8} />
    <Path d="M14 20 Q18 18 20 22 Q22 26 18 30" fill="#E8A8A8" opacity={0.5} />
    <Path d="M28 16 Q34 14 38 18 Q40 22 36 28 Q32 32 28 30" fill="#E8A8A8" opacity={0.5} />
    <Path d="M40 32 Q44 30 46 34 Q44 38 40 36" fill="#E8A8A8" opacity={0.3} />
    <Ellipse cx={12} cy={36} rx={4} ry={3} fill="#E8A8A8" opacity={0.4} />
    <Path d="M8 12 L48 12" stroke="#D8C8A8" strokeWidth={0.3} />
    <Path d="M8 28 L48 28" stroke="#D8C8A8" strokeWidth={0.3} />
    <Path d="M8 44 L48 44" stroke="#D8C8A8" strokeWidth={0.3} />
    <Path d="M20 8 L20 48" stroke="#D8C8A8" strokeWidth={0.3} />
    <Path d="M36 8 L36 48" stroke="#D8C8A8" strokeWidth={0.3} />
    <Circle cx={20} cy={22} r={1.5} fill="#C83030" opacity={0.6} />
    <Circle cx={36} cy={18} r={1.5} fill="#C83030" opacity={0.6} />
  </Svg>
);

export const ScienceKit = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M18 14 L18 30 L8 46 L32 46 L22 30 L22 14 Z" fill="#D8E8F0" stroke="#A0B8C8" strokeWidth={0.8} />
    <Rect x={16} y={12} width={8} height={4} rx={1} fill="#A0B8C8" />
    <Path d="M12 40 Q20 36 28 40" fill="#88C8E0" opacity={0.5} />
    <Ellipse cx={20} cy={42} rx={8} ry={3} fill="#88C8E0" opacity={0.4} />
    <Circle cx={16} cy={38} r={1.5} fill="#E8E048" opacity={0.6} />
    <Circle cx={24} cy={40} r={1} fill="#E8E048" opacity={0.5} />
    <Path d="M36 20 Q36 14 40 14 Q44 14 44 20 L46 42 Q46 48 40 48 Q34 48 34 42 Z" fill="#D8E8F0" stroke="#A0B8C8" strokeWidth={0.8} />
    <Ellipse cx={40} cy={40} rx={5} ry={6} fill="#E8A0E0" opacity={0.4} />
    <Circle cx={38} cy={38} r={2} fill="#E8A0E0" opacity={0.3} />
    <Rect x={36} y={14} width={8} height={3} rx={1} fill="#A0B8C8" />
    <Path d="M38 18 Q36 12 38 8" fill="none" stroke="#D0D0D0" strokeWidth={0.6} opacity={0.3} />
  </Svg>
);

export const gbIllustrations: Record<string, React.FC<{ size?: number }>> = {
  gb_l1: Crown,
  gb_l2: BritishTeaSet,
  gb_l3: BigBenModel,
  gb_l4: PaddingtonBear,
  gb_l5: Fireplace,
  gb_k1: FishAndChips,
  gb_k2: Kettle,
  gb_k3: Scones,
  gb_k4: Biscuits,
  gb_k5: MeatPie,
  gb_g1: RoseBush,
  gb_g2: Fox,
  gb_g3: RainCloud,
  gb_g4: CricketBat,
  gb_g5: StoneCircle,
  gb_s1: HPBooks,
  gb_s2: Shakespeare,
  gb_s3: Magnifier,
  gb_s4: EmpireMap,
  gb_s5: ScienceKit,
};
