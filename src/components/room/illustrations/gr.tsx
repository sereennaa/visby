import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

const ParthenonModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={42} width={44} height={4} rx={1} fill="#E0D8C8" />
    <Rect x={8} y={38} width={40} height={4} rx={1} fill="#D8D0C0" />
    <Path d="M8 14 L28 6 L48 14 Z" fill="#E8E0D0" stroke="#C8C0B0" strokeWidth={0.8} />
    <Rect x={10} y={14} width={36} height={3} rx={0.5} fill="#D8D0C0" />
    {[14, 22, 30, 38].map((x, i) => (
      <Rect key={i} x={x} y={17} width={4} height={21} rx={1.5} fill="#E0D8C8" stroke="#C8C0B0" strokeWidth={0.5} />
    ))}
    <Ellipse cx={28} cy={26} rx={5} ry={4} fill="#D0C8B8" opacity={0.4} />
    <Line x1={26} y1={24} x2={26} y2={30} stroke="#C0B8A8" strokeWidth={0.6} />
    <Line x1={30} y1={24} x2={30} y2={30} stroke="#C0B8A8" strokeWidth={0.6} />
  </Svg>
);

const Lyre = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M18 42 Q16 28 18 16 Q20 8 28 6 Q36 8 38 16 Q40 28 38 42 Z" fill="none" stroke="#C8A060" strokeWidth={2.5} strokeLinecap="round" />
    <Rect x={18} y={40} width={20} height={6} rx={2} fill="#D8B070" stroke="#C09848" strokeWidth={0.8} />
    <Line x1={22} y1={14} x2={22} y2={40} stroke="#E8D090" strokeWidth={0.8} />
    <Line x1={26} y1={10} x2={26} y2={40} stroke="#E8D090" strokeWidth={0.8} />
    <Line x1={30} y1={10} x2={30} y2={40} stroke="#E8D090" strokeWidth={0.8} />
    <Line x1={34} y1={14} x2={34} y2={40} stroke="#E8D090" strokeWidth={0.8} />
    <Circle cx={18} cy={16} r={2} fill="#D8B070" />
    <Circle cx={38} cy={16} r={2} fill="#D8B070" />
    <Path d="M18 16 Q28 12 38 16" fill="none" stroke="#C8A060" strokeWidth={1.5} />
  </Svg>
);

const SantoriniPhoto = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#F8F0E0" stroke="#D8C8A0" strokeWidth={1} />
    <Rect x={10} y={10} width={36} height={36} fill="#68A8D8" opacity={0.4} />
    <Rect x={10} y={32} width={36} height={14} fill="#4888B8" opacity={0.3} />
    <Rect x={16} y={20} width={8} height={12} rx={1} fill="#F8F8FF" />
    <Path d="M16 20 Q20 16 24 20" fill="#3868A8" />
    <Rect x={28} y={22} width={10} height={10} rx={1} fill="#F8F8FF" />
    <Path d="M28 22 Q33 18 38 22" fill="#3868A8" />
    <Rect x={18} y={26} width={4} height={6} rx={1} fill="#68A8D8" opacity={0.5} />
    <Rect x={30} y={26} width={3} height={6} rx={0.5} fill="#68A8D8" opacity={0.5} />
    <Rect x={34} y={26} width={3} height={6} rx={0.5} fill="#68A8D8" opacity={0.5} />
    <Circle cx={42} cy={14} r={3} fill="#F8E848" opacity={0.5} />
  </Svg>
);

const OliveBranch = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M8 44 Q20 36 28 28 Q36 20 44 8" fill="none" stroke="#78A050" strokeWidth={2} strokeLinecap="round" />
    <Ellipse cx={16} cy={36} rx={4} ry={2.5} fill="#88B060" transform="rotate(-30, 16, 36)" />
    <Ellipse cx={22} cy={32} rx={4} ry={2.5} fill="#78A050" transform="rotate(-40, 22, 32)" />
    <Ellipse cx={28} cy={26} rx={4} ry={2.5} fill="#88B060" transform="rotate(-45, 28, 26)" />
    <Ellipse cx={34} cy={20} rx={3.5} ry={2} fill="#78A050" transform="rotate(-50, 34, 20)" />
    <Ellipse cx={40} cy={14} rx={3.5} ry={2} fill="#88B060" transform="rotate(-55, 40, 14)" />
    <Ellipse cx={12} cy={40} rx={3.5} ry={2.5} fill="#78A050" transform="rotate(-20, 12, 40)" />
    <Circle cx={19} cy={38} r={2} fill="#587838" opacity={0.4} />
    <Circle cx={31} cy={24} r={2} fill="#587838" opacity={0.4} />
    <Circle cx={37} cy={16} r={1.8} fill="#587838" opacity={0.3} />
  </Svg>
);

const WhiteVase = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="gr_vase" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#F0E8D8" />
        <Stop offset="0.5" stopColor="#F8F4EC" />
        <Stop offset="1" stopColor="#E8D8C0" />
      </LinearGradient>
    </Defs>
    <Path d="M22 10 Q20 10 20 14 Q16 18 14 28 Q12 38 18 44 L38 44 Q44 38 42 28 Q40 18 36 14 Q36 10 34 10 Z" fill="url(#gr_vase)" stroke="#C8B898" strokeWidth={1} />
    <Ellipse cx={28} cy={10} rx={6} ry={2.5} fill="#F0E8D8" stroke="#C8B898" strokeWidth={0.8} />
    <Path d="M18 28 Q22 24 28 28 Q34 32 38 28" fill="none" stroke="#C87838" strokeWidth={1} />
    <Path d="M16 34 Q22 30 28 34 Q34 38 40 34" fill="none" stroke="#C87838" strokeWidth={0.8} opacity={0.6} />
    <Circle cx={22} cy={30} r={1.5} fill="#C87838" opacity={0.4} />
    <Circle cx={34} cy={30} r={1.5} fill="#C87838" opacity={0.4} />
    <Ellipse cx={28} cy={46} rx={12} ry={3} fill="#D8D0C0" opacity={0.4} />
  </Svg>
);

const GreekSalad = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="gr_bowl" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F0E8D8" />
        <Stop offset="1" stopColor="#D8C8A8" />
      </LinearGradient>
    </Defs>
    <Path d="M8 26 Q8 46 28 46 Q48 46 48 26 Z" fill="url(#gr_bowl)" stroke="#C8B890" strokeWidth={0.8} />
    <Ellipse cx={28} cy={26} rx={20} ry={7} fill="#98C878" />
    <Circle cx={20} cy={24} r={3.5} fill="#E84848" />
    <Circle cx={20} cy={23} r={1.5} fill="#F06060" opacity={0.4} />
    <Rect x={26} y={20} width={8} height={6} rx={1} fill="#F8F0E0" />
    <Circle cx={36} cy={26} r={2.5} fill="#383828" />
    <Circle cx={16} cy={28} r={2} fill="#383828" opacity={0.7} />
    <Circle cx={40} cy={24} r={2.2} fill="#E84848" opacity={0.7} />
    <Path d="M24 28 Q28 30 32 28" fill="none" stroke="#78A858" strokeWidth={0.6} />
    <Ellipse cx={22} cy={26} rx={2} ry={1} fill="#A8D888" opacity={0.4} />
  </Svg>
);

const Gyros = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M14 10 Q10 10 10 16 L10 44 Q10 48 14 48 L20 48 Q28 46 28 36 L28 22 Q28 12 20 10 Z" fill="#E8D0A0" stroke="#D0B878" strokeWidth={0.8} />
    <Path d="M14 14 Q18 14 22 18 L22 44 Q18 46 14 46 Z" fill="#A06840" opacity={0.6} />
    <Circle cx={16} cy={22} r={2} fill="#E84848" opacity={0.6} />
    <Circle cx={18} cy={30} r={1.5} fill="#78A848" opacity={0.6} />
    <Circle cx={16} cy={38} r={2} fill="#E84848" opacity={0.5} />
    <Ellipse cx={20} cy={26} rx={1.5} ry={2.5} fill="#F8F0E0" opacity={0.5} />
    <Rect x={34} y={14} width={14} height={28} rx={4} fill="#E8D0A0" stroke="#D0B878" strokeWidth={0.8} />
    <Rect x={36} y={18} width={10} height={8} rx={2} fill="#A06840" opacity={0.5} />
    <Rect x={36} y={30} width={10} height={8} rx={2} fill="#A06840" opacity={0.5} />
    <Circle cx={40} cy={22} r={1.5} fill="#E84848" opacity={0.5} />
    <Circle cx={42} cy={34} r={1.5} fill="#78A848" opacity={0.5} />
  </Svg>
);

const OliveOil = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="gr_oil" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C8D868" />
        <Stop offset="1" stopColor="#A8B848" />
      </LinearGradient>
    </Defs>
    <Path d="M20 16 Q18 36 20 46 L36 46 Q38 36 36 16 Z" fill="#E8F0E0" stroke="#B8C8A0" strokeWidth={0.8} />
    <Ellipse cx={28} cy={46} rx={8} ry={3} fill="#D0D8C0" opacity={0.4} />
    <Rect x={24} y={8} width={8} height={8} rx={1} fill="#D8D0C0" stroke="#B8B0A0" strokeWidth={0.5} />
    <Rect x={26} y={6} width={4} height={4} rx={1} fill="#C8B898" />
    <Ellipse cx={28} cy={32} rx={6} ry={8} fill="url(#gr_oil)" opacity={0.6} />
    <Rect x={20} y={24} width={16} height={6} rx={1} fill="#F8F0E0" opacity={0.7} />
    <Rect x={22} y={26} width={12} height={2} rx={0.5} fill="#78A050" opacity={0.5} />
    <Ellipse cx={24} cy={18} rx={2} ry={4} fill="#F8F8F0" opacity={0.3} />
  </Svg>
);

const HoneyJar = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="gr_hon" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8D060" />
        <Stop offset="1" stopColor="#E8B030" />
      </LinearGradient>
    </Defs>
    <Path d="M18 16 Q16 32 18 44 L38 44 Q40 32 38 16 Z" fill="url(#gr_hon)" stroke="#D0A028" strokeWidth={0.8} />
    <Ellipse cx={28} cy={16} rx={10} ry={4} fill="#F8E080" stroke="#D8B848" strokeWidth={0.5} />
    <Rect x={22} y={10} width={12} height={6} rx={1} fill="#F8F0E0" stroke="#D8C8A0" strokeWidth={0.5} />
    <Path d="M22 10 Q28 8 34 10" fill="none" stroke="#D8C8A0" strokeWidth={0.8} />
    <Ellipse cx={28} cy={30} rx={6} ry={4} fill="#F8E080" opacity={0.4} />
    <Ellipse cx={24} cy={20} rx={3} ry={5} fill="#F8E888" opacity={0.3} />
    <Rect x={20} y={36} width={16} height={4} rx={1} fill="#F8F0E0" opacity={0.6} />
    <Path d="M24 38 L32 38" stroke="#D0A028" strokeWidth={0.5} opacity={0.5} />
  </Svg>
);

const GrBaklava = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="gr_bak" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8C060" />
        <Stop offset="1" stopColor="#D0A040" />
      </LinearGradient>
    </Defs>
    <Path d="M10 22 L28 14 L46 22 L46 38 L10 38 Z" fill="url(#gr_bak)" stroke="#C09030" strokeWidth={0.8} />
    <Path d="M10 26 L46 26" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M10 30 L46 30" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M10 34 L46 34" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M22 22 L22 38" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M28 14 L28 38" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M34 22 L34 38" stroke="#D8B050" strokeWidth={0.5} />
    <Ellipse cx={28} cy={26} rx={3} ry={1.5} fill="#A07828" opacity={0.3} />
    <Circle cx={22} cy={30} r={0.8} fill="#68A040" opacity={0.5} />
    <Ellipse cx={28} cy={42} rx={18} ry={3} fill="#E8D8B0" opacity={0.3} />
    <Path d="M18 40 Q28 44 38 40" fill="none" stroke="#D8B848" strokeWidth={0.8} opacity={0.4} />
  </Svg>
);

const ZeusStatue = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={20} y={46} width={16} height={4} rx={1} fill="#D8D0C0" />
    <Rect x={24} y={34} width={8} height={12} rx={1} fill="#E0D8C8" />
    <Circle cx={28} cy={24} r={8} fill="#E8E0D0" />
    <Path d="M22 22 Q24 18 28 18 Q32 18 34 22" fill="#D0C8B0" />
    <Circle cx={25} cy={24} r={1.2} fill="#A09888" />
    <Circle cx={31} cy={24} r={1.2} fill="#A09888" />
    <Path d="M25 28 Q28 30 31 28" fill="none" stroke="#B0A890" strokeWidth={0.8} />
    <Path d="M22 28 Q20 30 22 32 Q24 34 22 36" fill="none" stroke="#D0C8B0" strokeWidth={1.5} />
    <Path d="M34 28 Q36 30 34 32 Q32 34 34 36" fill="none" stroke="#D0C8B0" strokeWidth={1.5} />
    <Path d="M14 20 L18 24 L22 18" fill="none" stroke="#F8D848" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M16 22 L20 18" fill="none" stroke="#F8D848" strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

const OlympicTorch = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="gr_torch" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D8A848" />
        <Stop offset="1" stopColor="#B88830" />
      </LinearGradient>
    </Defs>
    <Path d="M24 24 L22 48 L34 48 L32 24 Z" fill="url(#gr_torch)" stroke="#A07828" strokeWidth={0.8} />
    <Rect x={20} y={22} width={16} height={4} rx={1.5} fill="#C8A040" />
    <Path d="M22 22 Q22 14 28 8 Q34 14 34 22 Z" fill="#E87838" />
    <Path d="M24 22 Q24 16 28 12 Q32 16 32 22 Z" fill="#F8A848" />
    <Path d="M26 22 Q26 18 28 14 Q30 18 30 22 Z" fill="#F8D060" />
    <Path d="M27 18 Q28 12 29 18" fill="#F8E888" opacity={0.6} />
    <Rect x={20} y={46} width={16} height={4} rx={1.5} fill="#C8A040" />
  </Svg>
);

const PhilosophyScroll = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={14} y={12} width={28} height={36} rx={1} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={0.8} />
    <Ellipse cx={14} cy={12} rx={3} ry={4} fill="#E8D8B8" stroke="#C8B898" strokeWidth={0.5} />
    <Ellipse cx={42} cy={12} rx={3} ry={4} fill="#E8D8B8" stroke="#C8B898" strokeWidth={0.5} />
    <Ellipse cx={14} cy={48} rx={3} ry={4} fill="#E8D8B8" stroke="#C8B898" strokeWidth={0.5} />
    <Ellipse cx={42} cy={48} rx={3} ry={4} fill="#E8D8B8" stroke="#C8B898" strokeWidth={0.5} />
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <Line key={i} x1={18} y1={18 + i * 4} x2={38} y2={18 + i * 4} stroke="#C8B898" strokeWidth={0.5} opacity={0.5} />
    ))}
    <Path d="M20 20 Q26 18 30 22 Q32 26 28 28" fill="none" stroke="#888070" strokeWidth={0.8} opacity={0.6} />
  </Svg>
);

const TheaterMask = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M10 14 Q10 44 28 48 Q46 44 46 14 Z" fill="#F8E8C8" stroke="#D8C8A0" strokeWidth={1} />
    <Circle cx={20} cy={24} r={5} fill="#F8F0E0" stroke="#C8B898" strokeWidth={0.8} />
    <Circle cx={36} cy={24} r={5} fill="#F8F0E0" stroke="#C8B898" strokeWidth={0.8} />
    <Circle cx={20} cy={24} r={2.5} fill="#483828" />
    <Circle cx={36} cy={24} r={2.5} fill="#483828" />
    <Circle cx={19} cy={23} r={1} fill="#685848" opacity={0.5} />
    <Circle cx={35} cy={23} r={1} fill="#685848" opacity={0.5} />
    <Path d="M18 36 Q28 44 38 36" fill="none" stroke="#C8A878" strokeWidth={2} strokeLinecap="round" />
    <Path d="M14 18 Q16 14 20 16" fill="none" stroke="#D8C090" strokeWidth={1.2} />
    <Path d="M42 18 Q40 14 36 16" fill="none" stroke="#D8C090" strokeWidth={1.2} />
    <Ellipse cx={28} cy={30} rx={2} ry={1.5} fill="#D8C8A0" opacity={0.4} />
  </Svg>
);

const AncientGreekMap = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M22 14 Q18 18 20 24 Q22 28 18 32 Q16 36 20 40 Q24 42 28 40 Q32 42 34 38 Q36 34 34 28 Q32 24 34 20 Q36 16 32 12 Q28 10 22 14 Z" fill="#A8D8A0" stroke="#78A870" strokeWidth={0.8} />
    <Circle cx={22} cy={20} r={1} fill="#E84860" opacity={0.6} />
    <Circle cx={28} cy={26} r={1.5} fill="#E84860" />
    <Path d="M30 30 Q34 30 36 34" fill="none" stroke="#78A870" strokeWidth={0.5} />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const grIllustrations: Record<string, React.FC<{ size?: number }>> = {
  gr_l1: ParthenonModel,
  gr_l2: Lyre,
  gr_l3: SantoriniPhoto,
  gr_l4: OliveBranch,
  gr_l5: WhiteVase,
  gr_k1: GreekSalad,
  gr_k2: Gyros,
  gr_k3: OliveOil,
  gr_k4: HoneyJar,
  gr_k5: GrBaklava,
  gr_m1: ZeusStatue,
  gr_m2: OlympicTorch,
  gr_m3: PhilosophyScroll,
  gr_m4: TheaterMask,
  gr_m5: AncientGreekMap,
};
