import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

const HagiaSophiaModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={30} width={40} height={16} rx={1} fill="#E8D8C0" stroke="#C8B898" strokeWidth={0.8} />
    <Path d="M12 30 Q12 16 28 12 Q44 16 44 30 Z" fill="#D8C8A8" stroke="#C0B090" strokeWidth={0.8} />
    <Path d="M20 30 Q20 22 28 18 Q36 22 36 30 Z" fill="#E0D0B8" />
    <Circle cx={28} cy={14} r={2} fill="#D8B868" />
    <Path d="M26 14 L28 8 L30 14" fill="none" stroke="#D8B868" strokeWidth={1} />
    <Rect x={6} y={12} width={3} height={34} rx={1} fill="#D0C0A0" />
    <Rect x={47} y={12} width={3} height={34} rx={1} fill="#D0C0A0" />
    <Path d="M6 12 Q7.5 10 9 12" fill="#D8B868" />
    <Path d="M47 12 Q48.5 10 50 12" fill="#D8B868" />
    <Rect x={14} y={36} width={6} height={10} rx={1} fill="#B8A888" />
    <Rect x={24} y={34} width={8} height={12} rx={2} fill="#B8A888" />
    <Rect x={36} y={36} width={6} height={10} rx={1} fill="#B8A888" />
    <Rect x={8} y={44} width={40} height={4} rx={1} fill="#D8C8A8" />
  </Svg>
);

const TurkishLamp = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="tr_lamp" cx="0.5" cy="0.4" r="0.5">
        <Stop offset="0" stopColor="#F8E868" />
        <Stop offset="1" stopColor="#E8A030" />
      </RadialGradient>
    </Defs>
    <Line x1={28} y1={2} x2={28} y2={12} stroke="#A08858" strokeWidth={1.5} />
    <Rect x={24} y={10} width={8} height={3} rx={1.5} fill="#C8A868" />
    <Path d="M24 13 Q18 22 18 30 Q18 38 24 42 L32 42 Q38 38 38 30 Q38 22 32 13 Z" fill="url(#tr_lamp)" opacity={0.8} />
    <Circle cx={22} cy={22} r={2} fill="#E84848" opacity={0.6} />
    <Circle cx={34} cy={22} r={2} fill="#4888D8" opacity={0.6} />
    <Circle cx={28} cy={18} r={2} fill="#48B868" opacity={0.6} />
    <Circle cx={22} cy={32} r={2} fill="#4888D8" opacity={0.6} />
    <Circle cx={34} cy={32} r={2} fill="#E84848" opacity={0.6} />
    <Circle cx={28} cy={36} r={2} fill="#48B868" opacity={0.6} />
    <Circle cx={28} cy={27} r={2} fill="#F8C848" opacity={0.5} />
    <Path d="M24 13 Q18 22 18 30 Q18 38 24 42 L32 42 Q38 38 38 30 Q38 22 32 13 Z" fill="none" stroke="#C89830" strokeWidth={0.8} />
    <Path d="M28 42 L28 48 L26 52" fill="none" stroke="#A08858" strokeWidth={1} strokeLinecap="round" />
    <Path d="M28 48 L30 52" fill="none" stroke="#A08858" strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

const EvilEyeCharm = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={28} cy={28} r={22} fill="#2868B8" />
    <Circle cx={28} cy={28} r={16} fill="#58A8E8" />
    <Circle cx={28} cy={28} r={10} fill="#F8F8FF" />
    <Circle cx={28} cy={28} r={6} fill="#1848A0" />
    <Circle cx={28} cy={28} r={3} fill="#181828" />
    <Circle cx={30} cy={26} r={1.5} fill="#F8F8FF" opacity={0.6} />
    <Circle cx={28} cy={28} r={22} fill="none" stroke="#1858A8" strokeWidth={1} />
    <Circle cx={28} cy={28} r={16} fill="none" stroke="#4898D8" strokeWidth={0.5} />
  </Svg>
);

const TurkishCarpet = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={12} width={44} height={32} rx={1} fill="#B82828" />
    <Rect x={10} y={16} width={36} height={24} fill="none" stroke="#F8D060" strokeWidth={1.2} />
    <Rect x={14} y={20} width={28} height={16} fill="none" stroke="#E8A030" strokeWidth={0.8} />
    <Path d="M28 20 L28 36" stroke="#F8D060" strokeWidth={0.5} />
    <Path d="M14 28 L42 28" stroke="#F8D060" strokeWidth={0.5} />
    <Path d="M20 20 L14 28 L20 36" fill="none" stroke="#E8A030" strokeWidth={0.6} />
    <Path d="M36 20 L42 28 L36 36" fill="none" stroke="#E8A030" strokeWidth={0.6} />
    <Circle cx={28} cy={28} r={4} fill="#F8D060" opacity={0.3} />
    <Path d="M24 24 L28 20 L32 24 L28 28 Z" fill="#E8A030" opacity={0.4} />
    <Path d="M24 32 L28 28 L32 32 L28 36 Z" fill="#E8A030" opacity={0.4} />
    {[8, 14, 20, 26, 32, 38, 44].map((x, i) => (
      <Line key={i} x1={x} y1={44} x2={x} y2={50} stroke="#B82828" strokeWidth={1.5} strokeLinecap="round" />
    ))}
  </Svg>
);

const OttomanCushion = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={40} rx={20} ry={8} fill="#C83050" />
    <Path d="M10 30 Q10 40 28 42 Q46 40 46 30 Z" fill="#D84060" />
    <Ellipse cx={28} cy={30} rx={18} ry={8} fill="#E85070" />
    <Path d="M16 28 Q28 24 40 28" fill="none" stroke="#F8A0B0" strokeWidth={0.8} opacity={0.5} />
    <Circle cx={28} cy={28} r={3} fill="#F8D060" opacity={0.5} />
    <Circle cx={28} cy={28} r={1.5} fill="#F8E888" opacity={0.6} />
    <Path d="M20 32 Q28 36 36 32" fill="none" stroke="#C83050" strokeWidth={0.8} opacity={0.4} />
    <Ellipse cx={28} cy={30} rx={18} ry={8} fill="none" stroke="#B82848" strokeWidth={0.8} />
  </Svg>
);

const Kebabs = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={26} y={4} width={3} height={48} rx={1} fill="#A08050" />
    <Rect x={10} y={12} width={14} height={8} rx={3} fill="#A06040" />
    <Rect x={11} y={13} width={5} height={3} rx={1.5} fill="#B87050" opacity={0.5} />
    <Rect x={10} y={22} width={14} height={6} rx={3} fill="#68A848" />
    <Rect x={10} y={30} width={14} height={8} rx={3} fill="#A06040" />
    <Rect x={11} y={31} width={5} height={3} rx={1.5} fill="#B87050" opacity={0.5} />
    <Rect x={10} y={40} width={14} height={6} rx={2} fill="#E84848" />
    <Circle cx={17} cy={15} r={1} fill="#804830" opacity={0.3} />
    <Circle cx={17} cy={33} r={1} fill="#804830" opacity={0.3} />
    <Rect x={32} y={14} width={14} height={8} rx={3} fill="#E8A040" />
    <Rect x={32} y={24} width={14} height={6} rx={3} fill="#D84848" />
    <Rect x={32} y={32} width={14} height={8} rx={3} fill="#A06040" />
    <Rect x={33} y={33} width={5} height={3} rx={1.5} fill="#B87050" opacity={0.5} />
  </Svg>
);

const Baklava = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="tr_bak" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8C060" />
        <Stop offset="1" stopColor="#D0A040" />
      </LinearGradient>
    </Defs>
    <Path d="M8 26 L28 16 L48 26 L48 40 L8 40 Z" fill="url(#tr_bak)" stroke="#C09030" strokeWidth={0.8} />
    <Path d="M8 30 L48 30" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M8 34 L48 34" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M8 38 L48 38" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M18 26 L18 40" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M28 16 L28 40" stroke="#D8B050" strokeWidth={0.5} />
    <Path d="M38 26 L38 40" stroke="#D8B050" strokeWidth={0.5} />
    <Ellipse cx={28} cy={28} rx={4} ry={2} fill="#A07828" opacity={0.4} />
    <Circle cx={18} cy={32} r={1} fill="#68A040" opacity={0.5} />
    <Circle cx={38} cy={32} r={1} fill="#68A040" opacity={0.5} />
    <Ellipse cx={28} cy={40} rx={20} ry={3} fill="#C8A038" opacity={0.3} />
  </Svg>
);

const TurkishCoffee = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="tr_cez" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D89848" />
        <Stop offset="1" stopColor="#B87830" />
      </LinearGradient>
    </Defs>
    <Path d="M20 16 Q18 36 20 42 L36 42 Q38 36 36 16 Z" fill="url(#tr_cez)" stroke="#A07028" strokeWidth={0.8} />
    <Ellipse cx={28} cy={16} rx={8} ry={3} fill="#E8B060" stroke="#C89040" strokeWidth={0.5} />
    <Ellipse cx={28} cy={18} rx={6} ry={2} fill="#5A3820" />
    <Path d="M36 22 L44 14" stroke="#B87830" strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M36 20 Q32 12 34 6" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Path d="M28 14 Q26 8 28 4" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Ellipse cx={28} cy={44} rx={10} ry={3} fill="#C8A040" opacity={0.3} />
  </Svg>
);

const TurkishDelight = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={20} width={40} height={24} rx={2} fill="#F0E8D8" stroke="#D8C8A0" strokeWidth={0.8} />
    <Rect x={12} y={24} width={10} height={10} rx={2} fill="#E86880" />
    <Rect x={12} y={24} width={10} height={10} rx={2} fill="none" stroke="#F8F0F0" strokeWidth={0.3} opacity={0.5} />
    <Rect x={24} y={24} width={10} height={10} rx={2} fill="#88C868" />
    <Rect x={36} y={24} width={10} height={10} rx={2} fill="#F8D068" />
    <Rect x={12} y={36} width={10} height={6} rx={2} fill="#A878C8" />
    <Rect x={24} y={36} width={10} height={6} rx={2} fill="#E86880" />
    <Rect x={36} y={36} width={10} height={6} rx={2} fill="#88C868" />
    {[17, 29, 41].map((x, i) => (
      <Circle key={i} cx={x} cy={29} r={0.8} fill="#F8F8F0" opacity={0.5} />
    ))}
  </Svg>
);

const Simit = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={28} cy={28} r={18} fill="#D8A040" />
    <Circle cx={28} cy={28} r={10} fill="#FFF8E8" />
    <Circle cx={28} cy={28} r={18} fill="none" stroke="#C89030" strokeWidth={1} />
    <Circle cx={28} cy={28} r={10} fill="none" stroke="#C89030" strokeWidth={0.8} />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 28 + Math.cos(rad) * 14;
      const cy = 28 + Math.sin(rad) * 14;
      return <Circle key={i} cx={cx} cy={cy} r={1} fill="#E8C060" opacity={0.6} />;
    })}
    <Ellipse cx={22} cy={22} rx={3} ry={2} fill="#E8B848" opacity={0.3} />
  </Svg>
);

const SpiceStall = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={30} width={44} height={4} rx={1} fill="#A08858" />
    <Path d="M10 30 Q10 20 16 20 Q22 20 22 30 Z" fill="#E8A030" />
    <Ellipse cx={16} cy={20} rx={6} ry={3} fill="#F0B848" opacity={0.6} />
    <Path d="M24 30 Q24 22 30 22 Q36 22 36 30 Z" fill="#D84040" />
    <Ellipse cx={30} cy={22} rx={6} ry={3} fill="#E85858" opacity={0.6} />
    <Path d="M38 30 Q38 24 44 24 Q50 24 50 30 Z" fill="#48A848" />
    <Ellipse cx={44} cy={24} rx={6} ry={3} fill="#58B858" opacity={0.6} />
    <Rect x={8} y={36} width={10} height={12} rx={2} fill="#E8C060" />
    <Rect x={22} y={38} width={10} height={10} rx={2} fill="#C86838" />
    <Rect x={36} y={36} width={10} height={12} rx={2} fill="#F8E080" />
    <Rect x={6} y={48} width={44} height={3} rx={1} fill="#A08858" />
  </Svg>
);

const WhirlingFigure = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={28} cy={14} r={5} fill="#F8E0C8" />
    <Circle cx={26} cy={13} r={1} fill="#483828" />
    <Circle cx={30} cy={13} r={1} fill="#483828" />
    <Path d="M26 16 Q28 17.5 30 16" fill="none" stroke="#E0A080" strokeWidth={0.6} />
    <Path d="M24 10 Q28 4 32 10" fill="#C8B090" />
    <Rect x={26} y={19} width={4} height={12} rx={1} fill="#F8F0E8" />
    <Path d="M12 44 Q20 32 28 32 Q36 32 44 44 Z" fill="#F8F0E8" stroke="#E8D8C8" strokeWidth={0.8} />
    <Path d="M14 42 Q22 34 28 34 Q34 34 42 42" fill="none" stroke="#E8D8C8" strokeWidth={0.5} />
    <Path d="M16 40 Q24 36 28 36 Q32 36 40 40" fill="none" stroke="#E8D8C8" strokeWidth={0.5} />
    <Line x1={28} y1={44} x2={24} y2={52} stroke="#F8E0C8" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={28} y1={44} x2={32} y2={52} stroke="#F8E0C8" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M18 26 L10 22" fill="none" stroke="#F8E0C8" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M38 26 L46 22" fill="none" stroke="#F8E0C8" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const HotAirBalloon = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M28 4 Q10 4 10 22 Q10 34 22 38 L34 38 Q46 34 46 22 Q46 4 28 4 Z" fill="#E85050" />
    <Path d="M28 4 Q22 4 18 10 L18 36 Q22 38 28 38 Q34 38 38 36 L38 10 Q34 4 28 4 Z" fill="#F8D050" opacity={0.6} />
    <Path d="M28 4 Q24 4 22 10 L22 37 Q25 38 28 38 Q31 38 34 37 L34 10 Q32 4 28 4 Z" fill="#F8F0E0" opacity={0.3} />
    <Path d="M22 38 L22 42 L34 42 L34 38" fill="none" stroke="#C8A040" strokeWidth={1} />
    <Rect x={22} y={42} width={12} height={8} rx={1} fill="#C8A060" stroke="#A88848" strokeWidth={0.5} />
    <Line x1={22} y1={38} x2={22} y2={42} stroke="#C8A040" strokeWidth={0.8} />
    <Line x1={34} y1={38} x2={34} y2={42} stroke="#C8A040" strokeWidth={0.8} />
  </Svg>
);

const TurkishTowel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={12} y={6} width={32} height={44} rx={2} fill="#F8F0E8" />
    <Rect x={12} y={6} width={32} height={6} fill="#4888C8" />
    <Rect x={12} y={14} width={32} height={3} fill="#E8A040" />
    <Rect x={12} y={19} width={32} height={2} fill="#4888C8" opacity={0.5} />
    <Rect x={12} y={38} width={32} height={2} fill="#4888C8" opacity={0.5} />
    <Rect x={12} y={42} width={32} height={3} fill="#E8A040" />
    <Rect x={12} y={47} width={32} height={3} fill="#4888C8" />
    {[14, 20, 26, 32, 38, 44].map((x, i) => (
      <Line key={i} x1={x} y1={50} x2={x} y2={54} stroke="#D8D0C0" strokeWidth={1.2} strokeLinecap="round" />
    ))}
    <Rect x={12} y={6} width={32} height={44} rx={2} fill="none" stroke="#E0D8D0" strokeWidth={0.5} />
  </Svg>
);

const MapOfTurkey = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M12 24 Q16 20 22 22 Q28 18 36 20 Q42 22 46 26 Q44 30 40 32 Q36 36 30 34 Q24 36 18 34 Q14 32 12 28 Z" fill="#A8D8A0" stroke="#78A870" strokeWidth={0.8} />
    <Circle cx={32} cy={26} r={1.5} fill="#E84860" />
    <Circle cx={22} cy={26} r={1} fill="#E84860" opacity={0.6} />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const trIllustrations: Record<string, React.FC<{ size?: number }>> = {
  tr_l1: HagiaSophiaModel,
  tr_l2: TurkishLamp,
  tr_l3: EvilEyeCharm,
  tr_l4: TurkishCarpet,
  tr_l5: OttomanCushion,
  tr_k1: Kebabs,
  tr_k2: Baklava,
  tr_k3: TurkishCoffee,
  tr_k4: TurkishDelight,
  tr_k5: Simit,
  tr_b1: SpiceStall,
  tr_b2: WhirlingFigure,
  tr_b3: HotAirBalloon,
  tr_b4: TurkishTowel,
  tr_b5: MapOfTurkey,
};
