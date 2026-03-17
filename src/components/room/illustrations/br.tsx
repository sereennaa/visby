import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const Football = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={28} cy={28} r={16} fill="#F8F8F0" stroke="#D0D0C8" strokeWidth={1} />
    <Path d="M28 12 L22 20 L28 26 L34 20 Z" fill="#2A2A2A" />
    <Path d="M14 24 L18 18 L22 20 L20 28 L14 28 Z" fill="#2A2A2A" />
    <Path d="M42 24 L38 18 L34 20 L36 28 L42 28 Z" fill="#2A2A2A" />
    <Path d="M20 36 L20 28 L28 26 L36 28 L36 36 L28 40 Z" fill="none" stroke="#2A2A2A" strokeWidth={0.6} />
    <Path d="M18 38 L20 36 L28 40 L26 44" fill="none" stroke="#2A2A2A" strokeWidth={0.6} />
    <Path d="M38 38 L36 36 L28 40 L30 44" fill="none" stroke="#2A2A2A" strokeWidth={0.6} />
    <Ellipse cx={28} cy={46} rx={10} ry={2} fill="#D0D0C8" opacity={0.3} />
  </Svg>
);

export const CarnivalMask = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="mask_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#E848A0" />
        <Stop offset="1" stopColor="#A830D8" />
      </LinearGradient>
    </Defs>
    <Path d="M8 24 Q8 18 18 16 Q28 14 38 16 Q48 18 48 24 Q48 34 38 36 Q34 32 28 32 Q22 32 18 36 Q8 34 8 24 Z" fill="url(#mask_g)" />
    <Ellipse cx={20} cy={26} rx={5} ry={4} fill="#1A1020" />
    <Ellipse cx={36} cy={26} rx={5} ry={4} fill="#1A1020" />
    <Circle cx={14} cy={20} r={2} fill="#F8D848" />
    <Circle cx={42} cy={20} r={2} fill="#F8D848" />
    <Circle cx={28} cy={18} r={1.8} fill="#48E8A0" />
    <Path d="M12 14 Q10 6 14 4" stroke="#E84880" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <Path d="M16 12 Q16 4 20 2" stroke="#48C8E8" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <Path d="M44 14 Q46 6 42 4" stroke="#F8A848" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <Path d="M40 12 Q40 4 36 2" stroke="#48E868" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <Circle cx={14} cy={4} r={1.5} fill="#E84880" />
    <Circle cx={20} cy={2} r={1.5} fill="#48C8E8" />
    <Circle cx={42} cy={4} r={1.5} fill="#F8A848" />
    <Circle cx={36} cy={2} r={1.5} fill="#48E868" />
  </Svg>
);

export const Macaw = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M22 38 Q18 48 20 52" stroke="#4888E8" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M26 38 Q24 48 26 52" stroke="#E84848" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M24 38 Q22 50 24 54" stroke="#F8D848" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Ellipse cx={24} cy={30} rx={10} ry={12} fill="#E84848" />
    <Ellipse cx={24} cy={28} rx={8} ry={8} fill="#E85858" />
    <Circle cx={24} cy={18} r={9} fill="#4888E8" />
    <Circle cx={24} cy={18} r={7} fill="#58A0F0" />
    <Ellipse cx={24} cy={14} rx={7} ry={4} fill="#F8F8F0" />
    <Circle cx={21} cy={16} r={2} fill="#1A1A2E" />
    <Circle cx={20.5} cy={15.5} r={0.6} fill="#FFFFFF" />
    <Path d="M28 16 Q32 14 30 18 Q28 20 28 16 Z" fill="#F8A848" />
    <Path d="M14 24 Q10 22 8 26" stroke="#48C848" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    <Path d="M34 24 Q38 22 40 26" stroke="#F8D848" strokeWidth={2.5} strokeLinecap="round" fill="none" />
  </Svg>
);

export const BeachPhoto = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#C8A878" stroke="#A08858" strokeWidth={1.5} />
    <Rect x={12} y={12} width={32} height={32} rx={1} fill="#88D0E8" />
    <Path d="M12 36 Q22 30 32 36 Q42 42 44 36 L44 44 L12 44 Z" fill="#F8E8A0" />
    <Circle cx={36} cy={20} r={4} fill="#F8E848" />
    <Ellipse cx={36} cy={20} rx={3} ry={2} fill="#F8F080" opacity={0.5} />
    <Path d="M20 36 L20 28 Q20 26 22 26 Q24 26 24 28" stroke="#A08858" strokeWidth={1.2} fill="none" />
    <Path d="M16 30 L28 30" stroke="#A08858" strokeWidth={0.8} />
    <Path d="M30 38 Q32 34 34 38" fill="#48B868" />
    <Path d="M34 38 Q36 32 38 38" fill="#58C878" />
  </Svg>
);

export const SambaDrum = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="drum_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8C080" />
        <Stop offset="1" stopColor="#C8985A" />
      </LinearGradient>
    </Defs>
    <Path d="M14 18 L14 40 Q14 44 28 44 Q42 44 42 40 L42 18 Z" fill="url(#drum_g)" />
    <Ellipse cx={28} cy={18} rx={14} ry={6} fill="#F0D8B0" stroke="#C8985A" strokeWidth={0.8} />
    <Ellipse cx={28} cy={18} rx={10} ry={4} fill="#F8E8D0" opacity={0.6} />
    <Path d="M14 26 Q28 30 42 26" fill="none" stroke="#E84848" strokeWidth={1.5} />
    <Path d="M14 34 Q28 38 42 34" fill="none" stroke="#48A848" strokeWidth={1.5} />
    <Rect x={15} y={6} width={2} height={16} rx={1} fill="#A07848" transform="rotate(-15, 15, 6)" />
    <Rect x={39} y={6} width={2} height={16} rx={1} fill="#A07848" transform="rotate(15, 39, 6)" />
    <Circle cx={14} cy={6} r={2.5} fill="#C8985A" />
    <Circle cx={42} cy={6} r={2.5} fill="#C8985A" />
  </Svg>
);

export const AcaiBowl = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="acai_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#8838A8" />
        <Stop offset="1" stopColor="#682888" />
      </LinearGradient>
    </Defs>
    <Path d="M10 24 Q10 44 28 44 Q46 44 46 24 Z" fill="url(#acai_g)" />
    <Ellipse cx={28} cy={24} rx={18} ry={6} fill="#9848B8" />
    <Ellipse cx={28} cy={24} rx={14} ry={4} fill="#A858C8" opacity={0.6} />
    <Circle cx={20} cy={22} r={2} fill="#E84860" />
    <Circle cx={24} cy={20} r={1.8} fill="#E84860" />
    <Circle cx={16} cy={24} r={1.5} fill="#E84860" />
    <Ellipse cx={32} cy={22} rx={4} ry={1.5} fill="#F8E878" />
    <Circle cx={38} cy={24} r={1.5} fill="#48C848" />
    <Circle cx={36} cy={22} r={1} fill="#48C848" />
    <Path d="M24 24 Q26 22 28 24" fill="none" stroke="#F8F0E0" strokeWidth={0.8} />
    <Path d="M26 26 Q28 24 30 26" fill="none" stroke="#F8F0E0" strokeWidth={0.8} />
  </Svg>
);

export const Churrasco = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={27} y={4} width={3} height={48} rx={1.5} fill="#A8A0A0" />
    <Rect x={26} y={42} width={5} height={8} rx={1} fill="#C8A060" />
    <Ellipse cx={28} cy={14} rx={7} ry={5} fill="#C86838" />
    <Ellipse cx={28} cy={12} rx={5} ry={2.5} fill="#D87848" opacity={0.5} />
    <Ellipse cx={28} cy={24} rx={8} ry={5.5} fill="#B85828" />
    <Ellipse cx={28} cy={22} rx={6} ry={3} fill="#C86838" opacity={0.5} />
    <Ellipse cx={28} cy={34} rx={7} ry={5} fill="#C86838" />
    <Ellipse cx={28} cy={32} rx={5} ry={2.5} fill="#D87848" opacity={0.5} />
    <Path d="M22 10 Q20 4 22 2" fill="none" stroke="#D8D0D0" strokeWidth={0.6} opacity={0.4} />
    <Path d="M34 10 Q36 4 34 2" fill="none" stroke="#D8D0D0" strokeWidth={0.6} opacity={0.4} />
  </Svg>
);

export const Feijoada = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="feij_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C85828" />
        <Stop offset="1" stopColor="#A04020" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={44} rx={18} ry={4} fill="#C8B8A0" opacity={0.3} />
    <Path d="M10 26 Q10 44 28 44 Q46 44 46 26 Z" fill="url(#feij_g)" />
    <Ellipse cx={28} cy={26} rx={18} ry={6} fill="#3A2818" />
    <Circle cx={20} cy={25} r={3} fill="#2A1A10" />
    <Circle cx={28} cy={24} r={3.5} fill="#2A1A10" />
    <Circle cx={36} cy={25} r={2.8} fill="#2A1A10" />
    <Circle cx={24} cy={27} r={2.5} fill="#2A1A10" />
    <Circle cx={34} cy={27} r={2} fill="#2A1A10" />
    <Ellipse cx={28} cy={24} rx={6} ry={2} fill="#4A3828" opacity={0.5} />
    <Path d="M10 26 Q10 22 14 20 L14 26" fill="none" stroke="#A04020" strokeWidth={1.5} />
    <Path d="M46 26 Q46 22 42 20 L42 26" fill="none" stroke="#A04020" strokeWidth={1.5} />
    <Path d="M24 20 Q22 14 24 10" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Path d="M32 20 Q34 12 32 8" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
  </Svg>
);

export const TropicalFruit = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={20} cy={34} rx={10} ry={12} fill="#F8C040" />
    <Ellipse cx={20} cy={30} rx={7} ry={6} fill="#F8D060" opacity={0.5} />
    <Path d="M20 22 Q16 18 20 14" fill="none" stroke="#68A848" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M20 22 Q24 18 20 14" fill="none" stroke="#78B858" strokeWidth={1.2} strokeLinecap="round" />
    <Ellipse cx={20} cy={34} rx={10} ry={12} fill="none" stroke="#E8A830" strokeWidth={0.8} />
    <Circle cx={18} cy={30} r={1} fill="#E8A830" opacity={0.4} />
    <Circle cx={22} cy={36} r={1} fill="#E8A830" opacity={0.4} />
    <Path d="M36 14 L38 10 L42 12 L44 8 L46 12 L48 10 L46 16 L42 14 L40 18 L36 16 Z" fill="#68A848" />
    <Path d="M38 18 Q38 28 36 38 Q34 44 40 46 Q46 44 44 38 Q42 28 42 18 Z" fill="#F8A030" />
    <Path d="M40 18 L40 44" stroke="#E88820" strokeWidth={0.5} opacity={0.4} />
    {[22, 28, 34, 40].map((y, i) => (
      <Path key={i} d={`M38 ${y} Q40 ${y - 1} 42 ${y}`} fill="none" stroke="#E88820" strokeWidth={0.4} opacity={0.3} />
    ))}
  </Svg>
);

export const BrazilCoffee = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="coffee_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8F0E8" />
        <Stop offset="1" stopColor="#E8D8C8" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={46} rx={14} ry={3} fill="#D0C8C0" opacity={0.3} />
    <Path d="M14 22 Q14 44 28 44 Q42 44 42 22 Z" fill="url(#coffee_g)" stroke="#D8C8B0" strokeWidth={0.8} />
    <Ellipse cx={28} cy={22} rx={14} ry={5} fill="#6A4830" />
    <Ellipse cx={28} cy={22} rx={10} ry={3} fill="#7A5838" opacity={0.6} />
    <Path d="M42 28 Q50 28 50 34 Q50 40 42 40" fill="none" stroke="#D8C8B0" strokeWidth={2} strokeLinecap="round" />
    <Path d="M22 18 Q20 10 24 6" fill="none" stroke="#D8D0C8" strokeWidth={0.8} opacity={0.5} />
    <Path d="M28 16 Q30 8 28 4" fill="none" stroke="#D8D0C8" strokeWidth={0.8} opacity={0.5} />
    <Path d="M34 18 Q36 12 34 8" fill="none" stroke="#D8D0C8" strokeWidth={0.8} opacity={0.5} />
  </Svg>
);

export const PalmTree = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M26 24 Q24 40 26 52" stroke="#A08848" strokeWidth={3} strokeLinecap="round" fill="none" />
    <Path d="M28 24 Q30 40 28 52" stroke="#B89858" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.5} />
    <Path d="M28 20 Q14 14 4 18" stroke="#48A838" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    <Path d="M28 18 Q16 10 6 14" stroke="#58B848" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M28 20 Q42 14 52 18" stroke="#48A838" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    <Path d="M28 18 Q40 10 50 14" stroke="#58B848" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M28 16 Q26 4 22 2" stroke="#48A838" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    <Path d="M28 16 Q30 4 34 2" stroke="#58B848" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Circle cx={24} cy={22} r={2} fill="#C8A030" />
    <Circle cx={32} cy={22} r={2} fill="#C8A030" />
    <Circle cx={28} cy={24} r={1.8} fill="#B89028" />
  </Svg>
);

export const CuteSloth = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={12} y={4} width={32} height={3} rx={1.5} fill="#A08060" />
    <Path d="M22 7 Q22 12 20 16" stroke="#C8A878" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    <Path d="M34 7 Q34 12 36 16" stroke="#C8A878" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    <Ellipse cx={28} cy={32} rx={12} ry={14} fill="#C8A878" />
    <Ellipse cx={28} cy={30} rx={9} ry={8} fill="#D8B888" opacity={0.5} />
    <Circle cx={28} cy={22} r={10} fill="#C8A878" />
    <Ellipse cx={28} cy={24} rx={7} ry={5} fill="#E8D8C0" />
    <Circle cx={24} cy={22} r={3} fill="#E8D8C0" />
    <Circle cx={32} cy={22} r={3} fill="#E8D8C0" />
    <Circle cx={24} cy={22} r={1.5} fill="#1A1A2E" />
    <Circle cx={32} cy={22} r={1.5} fill="#1A1A2E" />
    <Ellipse cx={28} cy={26} rx={2} ry={1.2} fill="#3A2A20" />
    <Path d="M26 28 Q28 30 30 28" fill="none" stroke="#C8907A" strokeWidth={0.8} />
    <Path d="M20 16 Q18 20 16 24" stroke="#C8A878" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M36 16 Q38 20 40 24" stroke="#C8A878" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Circle cx={16} cy={25} r={2.5} fill="#C8A878" />
    <Circle cx={40} cy={25} r={2.5} fill="#C8A878" />
  </Svg>
);

export const Hammock = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={4} y={8} width={3} height={40} rx={1.5} fill="#A08060" />
    <Rect x={49} y={8} width={3} height={40} rx={1.5} fill="#A08060" />
    <Path d="M6 12 Q28 6 50 12" fill="none" stroke="#A08060" strokeWidth={1.5} />
    <Path d="M8 14 Q28 38 48 14" fill="none" stroke="#E8C060" strokeWidth={2} />
    <Path d="M8 14 Q28 42 48 14" fill="#F8E8A0" opacity={0.3} />
    <Path d="M10 16 Q28 40 46 16" fill="none" stroke="#E8A848" strokeWidth={1} opacity={0.5} />
    {[14, 20, 26, 32, 38, 44].map((x, i) => (
      <Line key={i} x1={x} y1={14 - Math.abs(28 - x) * 0.08} x2={x} y2={14 + Math.sin(((x - 8) / 40) * Math.PI) * 24} stroke="#D8B060" strokeWidth={0.5} opacity={0.4} />
    ))}
    <Circle cx={28} cy={28} r={4} fill="#F8E0B0" opacity={0.4} />
  </Svg>
);

export const TropicalFlowers = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M20 42 Q18 34 16 28" stroke="#48A838" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M36 42 Q38 34 40 28" stroke="#48A838" strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M28 44 Q28 36 28 30" stroke="#58B848" strokeWidth={2} strokeLinecap="round" fill="none" />
    <G>
      <Ellipse cx={16} cy={20} rx={5} ry={8} fill="#E84878" transform="rotate(-30, 16, 20)" />
      <Ellipse cx={16} cy={20} rx={5} ry={8} fill="#E84878" transform="rotate(30, 16, 20)" />
      <Ellipse cx={16} cy={20} rx={5} ry={8} fill="#E84878" transform="rotate(90, 16, 20)" />
      <Ellipse cx={16} cy={18} rx={3} ry={5} fill="#F06888" opacity={0.5} transform="rotate(-30, 16, 18)" />
      <Circle cx={16} cy={20} r={3} fill="#F8D848" />
    </G>
    <G>
      <Ellipse cx={40} cy={22} rx={4.5} ry={7} fill="#F86848" transform="rotate(-20, 40, 22)" />
      <Ellipse cx={40} cy={22} rx={4.5} ry={7} fill="#F86848" transform="rotate(40, 40, 22)" />
      <Ellipse cx={40} cy={22} rx={4.5} ry={7} fill="#F86848" transform="rotate(100, 40, 22)" />
      <Circle cx={40} cy={22} r={2.5} fill="#F8E060" />
    </G>
    <Path d="M14 30 Q12 28 10 30" fill="#68B848" />
    <Path d="M18 32 Q20 30 22 32" fill="#58A838" />
    <Path d="M38 30 Q40 28 42 30" fill="#68B848" />
  </Svg>
);

export const CristoStatue = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="cristo_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F0F0E8" />
        <Stop offset="1" stopColor="#D8D8D0" />
      </LinearGradient>
    </Defs>
    <Path d="M24 48 L20 52 L36 52 L32 48 Z" fill="#A8A098" />
    <Rect x={22} y={24} width={12} height={24} rx={2} fill="url(#cristo_g)" />
    <Path d="M4 20 Q4 16 14 16 L22 16 L22 24 L14 24 Q4 24 4 20 Z" fill="url(#cristo_g)" />
    <Path d="M52 20 Q52 16 42 16 L34 16 L34 24 L42 24 Q52 24 52 20 Z" fill="url(#cristo_g)" />
    <Circle cx={28} cy={12} r={6} fill="url(#cristo_g)" />
    <Circle cx={26} cy={12} r={1} fill="#B8B8B0" opacity={0.5} />
    <Circle cx={30} cy={12} r={1} fill="#B8B8B0" opacity={0.5} />
    <Path d="M26 14 Q28 16 30 14" fill="none" stroke="#C8C8C0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={54} rx={16} ry={2} fill="#C8C0B8" opacity={0.3} />
  </Svg>
);

export const AmazonMap = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={8} width={44} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M10 28 Q18 24 26 30 Q34 36 44 28" fill="none" stroke="#48A8D8" strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 32 Q20 28 28 34 Q36 38 46 32" fill="none" stroke="#68B8E0" strokeWidth={1} opacity={0.4} />
    <Path d="M14 20 Q20 18 26 22 Q32 26 38 22 Q42 20 44 22" fill="#A8D8A0" opacity={0.4} />
    <Path d="M12 34 Q18 30 24 36 Q30 40 36 36 Q40 34 44 36" fill="#A8D8A0" opacity={0.3} />
    <Circle cx={18} cy={24} r={1.5} fill="#48A838" />
    <Circle cx={30} cy={26} r={1.5} fill="#48A838" />
    <Circle cx={38} cy={22} r={1.2} fill="#48A838" />
    <Path d="M10 44 L46 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M10 12 L14 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M10 12 L10 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const SambaShoes = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="shoe_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F8D848" />
        <Stop offset="1" stopColor="#E8B830" />
      </LinearGradient>
    </Defs>
    <Path d="M6 34 Q6 28 16 26 Q24 24 26 30 Q28 36 20 38 Q10 40 6 34 Z" fill="url(#shoe_g)" stroke="#D8A828" strokeWidth={0.8} />
    <Path d="M12 30 Q14 26 18 28" fill="none" stroke="#F8E880" strokeWidth={1} />
    <Circle cx={14} cy={30} r={1} fill="#F8F0C0" opacity={0.6} />
    <Circle cx={18} cy={28} r={0.8} fill="#F8F0C0" opacity={0.6} />
    <Circle cx={10} cy={32} r={0.8} fill="#F8F0C0" opacity={0.6} />
    <Path d="M30 30 Q30 24 40 22 Q48 20 50 26 Q52 32 44 34 Q34 36 30 30 Z" fill="url(#shoe_g)" stroke="#D8A828" strokeWidth={0.8} />
    <Path d="M36 26 Q38 22 42 24" fill="none" stroke="#F8E880" strokeWidth={1} />
    <Circle cx={38} cy={26} r={1} fill="#F8F0C0" opacity={0.6} />
    <Circle cx={42} cy={24} r={0.8} fill="#F8F0C0" opacity={0.6} />
    <Circle cx={34} cy={28} r={0.8} fill="#F8F0C0" opacity={0.6} />
    <Path d="M16 38 Q14 44 16 48" stroke="#D8A828" strokeWidth={1} fill="none" />
    <Path d="M40 34 Q38 40 40 44" stroke="#D8A828" strokeWidth={1} fill="none" />
  </Svg>
);

export const BossaNovaRecord = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={28} cy={28} r={20} fill="#1A1A2E" />
    <Circle cx={28} cy={28} r={18} fill="#2A2A3E" />
    {[12, 14, 16].map(r => (
      <Circle key={r} cx={28} cy={28} r={r} fill="none" stroke="#3A3A4E" strokeWidth={0.3} />
    ))}
    <Circle cx={28} cy={28} r={6} fill="#E84860" />
    <Circle cx={28} cy={28} r={4} fill="#F06878" />
    <Circle cx={28} cy={28} r={1.5} fill="#1A1A2E" />
    <Ellipse cx={28} cy={28} rx={18} ry={18} fill="none" stroke="#3A3A4E" strokeWidth={0.2} />
    <Path d="M28 10 Q32 10 34 12" fill="none" stroke="#4A4A5E" strokeWidth={0.5} opacity={0.3} />
    <Circle cx={28} cy={28} r={20} fill="none" stroke="#2A2A3E" strokeWidth={1} />
  </Svg>
);

export const BrazilBooks = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={10} y={32} width={36} height={8} rx={1} fill="#48A848" />
    <Rect x={12} y={34} width={12} height={4} rx={0.5} fill="#58B858" opacity={0.5} />
    <Rect x={8} y={22} width={36} height={10} rx={1} fill="#E84860" />
    <Rect x={10} y={24} width={14} height={6} rx={0.5} fill="#F06878" opacity={0.5} />
    <Rect x={12} y={14} width={34} height={8} rx={1} fill="#4880E8" />
    <Rect x={14} y={16} width={10} height={4} rx={0.5} fill="#68A0F8" opacity={0.5} />
    <Rect x={14} y={6} width={30} height={8} rx={1} fill="#F8A848" />
    <Rect x={16} y={8} width={8} height={4} rx={0.5} fill="#F8C070" opacity={0.5} />
    <Rect x={8} y={40} width={40} height={4} rx={1} fill="#D8C8B0" />
  </Svg>
);

export const BrazilWorldMap = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={4} y={6} width={48} height={40} rx={2} fill="#E8F0F8" stroke="#C0D0E0" strokeWidth={0.8} />
    <Path d="M8 20 Q10 18 14 20 Q16 22 14 26 Q12 30 8 28 Z" fill="#A8D8A0" stroke="#88B888" strokeWidth={0.4} />
    <Path d="M18 16 Q22 14 26 16 Q28 20 26 24 L24 28 Q22 32 18 34 Q14 32 16 26 Q14 20 18 16 Z" fill="#A8D8A0" stroke="#88B888" strokeWidth={0.4} />
    <Path d="M30 14 Q38 10 44 14 Q46 18 44 24 Q40 20 36 18 Q34 16 30 18 Z" fill="#A8D8A0" stroke="#88B888" strokeWidth={0.4} />
    <Path d="M38 22 Q42 24 44 28 Q42 32 38 30 Q36 26 38 22 Z" fill="#A8D8A0" stroke="#88B888" strokeWidth={0.4} />
    <Circle cx={20} cy={26} r={2} fill="#E84860" />
    <Circle cx={20} cy={26} r={3.5} fill="none" stroke="#E84860" strokeWidth={0.5} opacity={0.5} />
    <Line x1={4} y1={26} x2={52} y2={26} stroke="#C0D0E0" strokeWidth={0.3} strokeDasharray="2,2" />
    <Rect x={4} y={46} width={48} height={4} rx={1} fill="#C8A878" />
  </Svg>
);

export const brIllustrations: Record<string, React.FC<{ size?: number }>> = {
  br_l1: Football,
  br_l2: CarnivalMask,
  br_l3: Macaw,
  br_l4: BeachPhoto,
  br_l5: SambaDrum,
  br_k1: AcaiBowl,
  br_k2: Churrasco,
  br_k3: Feijoada,
  br_k4: TropicalFruit,
  br_k5: BrazilCoffee,
  br_o1: PalmTree,
  br_o2: CuteSloth,
  br_o3: Hammock,
  br_o4: TropicalFlowers,
  br_o5: CristoStatue,
  br_s1: AmazonMap,
  br_s2: SambaShoes,
  br_s3: BossaNovaRecord,
  br_s4: BrazilBooks,
  br_s5: BrazilWorldMap,
};
