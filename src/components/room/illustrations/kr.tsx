import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const HanbokDisplay = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="hanbok_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E84878" />
        <Stop offset="1" stopColor="#C83060" />
      </LinearGradient>
    </Defs>
    <Rect x={26} y={4} width={4} height={8} rx={2} fill="#C8A878" />
    <Line x1={20} y1={6} x2={36} y2={6} stroke="#C8A878" strokeWidth={2} strokeLinecap="round" />
    <Rect x={22} y={12} width={12} height={8} rx={1} fill="#F8E8A0" />
    <Path d="M20 18 Q20 14 22 12 L34 12 Q36 14 36 18" fill="none" stroke="#E8D080" strokeWidth={0.8} />
    <Path d="M18 20 Q18 18 22 18 L34 18 Q38 18 38 20 L42 48 Q42 50 28 50 Q14 50 14 48 Z" fill="url(#hanbok_g)" />
    <Path d="M22 20 L26 20 L24 28" fill="none" stroke="#F8A0B0" strokeWidth={1} />
    <Path d="M34 20 L30 20 L32 28" fill="none" stroke="#F8A0B0" strokeWidth={1} />
    <Path d="M18 20 Q28 24 38 20" fill="none" stroke="#D82858" strokeWidth={0.5} />
    <Ellipse cx={28} cy={20} rx={2} ry={1} fill="#F8D848" />
    <Path d="M22 36 Q28 32 34 36" fill="none" stroke="#D82858" strokeWidth={0.5} opacity={0.4} />
  </Svg>
);

export const KpopPoster = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={4} width={40} height={48} rx={3} fill="#F0E0F8" stroke="#D8C0E8" strokeWidth={1} />
    <Rect x={12} y={8} width={32} height={28} rx={2} fill="#D868E8" />
    <Circle cx={22} cy={22} r={6} fill="#FFE0C8" />
    <Path d="M18 18 Q22 14 26 18" fill="#3A1A4A" />
    <Circle cx={20} cy={22} r={1} fill="#3A1A4A" />
    <Circle cx={24} cy={22} r={1} fill="#3A1A4A" />
    <Path d="M20 24 Q22 26 24 24" fill="none" stroke="#E88888" strokeWidth={0.6} />
    <Circle cx={36} cy={20} r={5} fill="#FFE0C8" />
    <Path d="M33 17 Q36 13 39 17" fill="#3A1A4A" />
    <Circle cx={34} cy={20} r={1} fill="#3A1A4A" />
    <Circle cx={38} cy={20} r={1} fill="#3A1A4A" />
    <Path d="M34 22 Q36 24 38 22" fill="none" stroke="#E88888" strokeWidth={0.6} />
    <Rect x={16} y={38} width={24} height={4} rx={1} fill="#E848A0" />
    <Rect x={20} y={44} width={16} height={3} rx={1} fill="#C838A0" opacity={0.5} />
    {[14, 20, 26, 32, 38, 44].map((x, i) => (
      <Circle key={i} cx={x} cy={10 + (i % 2) * 2} r={1} fill="#F8E848" opacity={0.6} />
    ))}
  </Svg>
);

export const KrGameConsole = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={10} width={40} height={28} rx={3} fill="#2A2A3E" stroke="#3A3A4E" strokeWidth={1} />
    <Rect x={12} y={14} width={32} height={20} rx={2} fill="#1A1A2E" />
    <Rect x={14} y={16} width={28} height={16} rx={1} fill="#284868" />
    <Path d="M20 24 L26 20 L26 28 Z" fill="#48E8A0" opacity={0.7} />
    <Circle cx={36} cy={24} r={2} fill="#E84860" opacity={0.6} />
    <Circle cx={12} cy={42} r={6} fill="#3A3A4E" />
    <Line x1={12} y1={38} x2={12} y2={46} stroke="#5A5A6E" strokeWidth={1.5} />
    <Line x1={8} y1={42} x2={16} y2={42} stroke="#5A5A6E" strokeWidth={1.5} />
    <Circle cx={44} cy={42} r={6} fill="#3A3A4E" />
    <Circle cx={44} cy={40} r={1.5} fill="#E84860" />
    <Circle cx={42} cy={42} r={1.5} fill="#4880E8" />
    <Circle cx={46} cy={42} r={1.5} fill="#48C878" />
    <Circle cx={44} cy={44} r={1.5} fill="#F8C848" />
    <Path d="M18 42 L38 42" stroke="#4A4A5E" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const FanDanceProps = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="fan_kr" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#E84878" />
        <Stop offset="1" stopColor="#C83060" />
      </LinearGradient>
    </Defs>
    <Path d="M28 48 L6 20 A24 24 0 0 1 50 20 Z" fill="url(#fan_kr)" />
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <Line key={i} x1={28} y1={48} x2={6 + i * 7.3} y2={20 - Math.sin(i * 0.45) * 3} stroke="#D82858" strokeWidth={0.4} opacity={0.4} />
    ))}
    <Path d="M28 48 L6 20 A24 24 0 0 1 50 20 Z" fill="none" stroke="#A82048" strokeWidth={1} />
    <Circle cx={18} cy={22} r={2} fill="#F8D848" opacity={0.5} />
    <Circle cx={28} cy={18} r={2.5} fill="#F8D848" opacity={0.5} />
    <Circle cx={38} cy={22} r={2} fill="#F8D848" opacity={0.5} />
    <Path d="M14 26 Q22 20 28 26 Q34 20 42 26" fill="none" stroke="#F8A0B0" strokeWidth={0.8} opacity={0.5} />
    <Rect x={26.5} y={44} width={3} height={10} rx={1.5} fill="#C8A060" />
  </Svg>
);

export const FloorCushion = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="cush_g" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0" stopColor="#B868D8" />
        <Stop offset="1" stopColor="#9848B8" />
      </RadialGradient>
    </Defs>
    <Ellipse cx={28} cy={38} rx={22} ry={10} fill="url(#cush_g)" />
    <Ellipse cx={28} cy={34} rx={20} ry={8} fill="#C878E8" />
    <Ellipse cx={28} cy={34} rx={14} ry={5} fill="#D088F0" opacity={0.4} />
    <Circle cx={28} cy={34} r={3} fill="#E8A8F8" opacity={0.4} />
    <Ellipse cx={28} cy={38} rx={22} ry={10} fill="none" stroke="#8838A8" strokeWidth={0.8} />
    <Path d="M10 34 Q10 38 10 42" fill="none" stroke="#8838A8" strokeWidth={0.5} />
    <Path d="M46 34 Q46 38 46 42" fill="none" stroke="#8838A8" strokeWidth={0.5} />
    <Path d="M18 30 Q28 26 38 30" fill="none" stroke="#D098E8" strokeWidth={0.5} opacity={0.5} />
  </Svg>
);

export const KimchiJars = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <G>
      <Path d="M8 20 Q8 44 18 44 Q28 44 28 20 Z" fill="#D8C8A0" stroke="#C0B088" strokeWidth={0.8} />
      <Ellipse cx={18} cy={20} rx={10} ry={4} fill="#E8D8B8" stroke="#C0B088" strokeWidth={0.5} />
      <Rect x={14} y={14} width={8} height={6} rx={2} fill="#C0B088" />
      <Ellipse cx={18} cy={30} rx={6} ry={3} fill="#E84838" opacity={0.4} />
      <Path d="M14 28 Q18 32 22 28" fill="none" stroke="#C83828" strokeWidth={0.6} opacity={0.5} />
    </G>
    <G>
      <Path d="M30 24 Q30 46 40 46 Q50 46 50 24 Z" fill="#D8C8A0" stroke="#C0B088" strokeWidth={0.8} />
      <Ellipse cx={40} cy={24} rx={10} ry={4} fill="#E8D8B8" stroke="#C0B088" strokeWidth={0.5} />
      <Rect x={36} y={18} width={8} height={6} rx={2} fill="#C0B088" />
      <Ellipse cx={40} cy={34} rx={6} ry={3} fill="#E84838" opacity={0.4} />
      <Path d="M36 32 Q40 36 44 32" fill="none" stroke="#C83828" strokeWidth={0.6} opacity={0.5} />
    </G>
  </Svg>
);

export const BibimbapBowl = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="bib_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#4A4A4A" />
        <Stop offset="1" stopColor="#2A2A2A" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={44} rx={16} ry={4} fill="#C8C0B8" opacity={0.3} />
    <Path d="M10 24 Q10 44 28 44 Q46 44 46 24 Z" fill="url(#bib_g)" />
    <Ellipse cx={28} cy={24} rx={18} ry={6} fill="#F8F0E0" />
    <Path d="M14 24 L28 24 L28 18 L14 24 Z" fill="#E84848" opacity={0.7} />
    <Path d="M28 24 L42 24 L42 20 L28 18 Z" fill="#F8A848" opacity={0.7} />
    <Path d="M18 24 L22 20 L28 24 Z" fill="#68A848" opacity={0.6} />
    <Path d="M34 24 L38 19 L28 24 Z" fill="#C88040" opacity={0.6} />
    <Circle cx={28} cy={22} r={3} fill="#F8D848" />
    <Ellipse cx={28} cy={21.5} rx={2} ry={1.2} fill="#F8E878" opacity={0.6} />
    <Path d="M22 26 Q28 22 34 26" fill="none" stroke="#D8D0C0" strokeWidth={0.4} opacity={0.5} />
  </Svg>
);

export const KrChopsticks = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={12} y={6} width={2} height={40} rx={1} fill="#C0C0C8" transform="rotate(-6, 12, 6)" />
    <Rect x={18} y={6} width={2} height={40} rx={1} fill="#B0B0B8" transform="rotate(4, 18, 6)" />
    <Rect x={11.5} y={6} width={3} height={6} rx={0.5} fill="#D8D0C0" transform="rotate(-6, 12, 6)" />
    <Rect x={17.5} y={6} width={3} height={6} rx={0.5} fill="#D8D0C0" transform="rotate(4, 18, 6)" />
    <Path d="M11 6 Q12.5 4 14 6" fill="none" stroke="#E8D8B8" strokeWidth={0.5} />
    <Path d="M17 6 Q18.5 4 20 6" fill="none" stroke="#E8D8B8" strokeWidth={0.5} />
    <Ellipse cx={38} cy={36} rx={10} ry={6} fill="#F8F0E8" stroke="#E8D8C8" strokeWidth={0.8} />
    <Ellipse cx={38} cy={34} rx={8} ry={4} fill="#F8F8F0" />
    <Ellipse cx={38} cy={34} rx={6} ry={2.5} fill="#F8F0E0" opacity={0.5} />
    <Ellipse cx={28} cy={44} rx={8} ry={2} fill="#D0C8C0" opacity={0.2} />
  </Svg>
);

export const RiceCake = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={38} width={40} height={6} rx={2} fill="#E8D8C0" />
    <Ellipse cx={16} cy={34} rx={5} ry={6} fill="#E84878" rx-ry="3" />
    <Ellipse cx={16} cy={32} rx={3.5} ry={3} fill="#F06888" opacity={0.4} />
    <Ellipse cx={28} cy={32} rx={5} ry={8} fill="#F8D848" />
    <Ellipse cx={28} cy={30} rx={3.5} ry={4} fill="#F8E878" opacity={0.4} />
    <Ellipse cx={40} cy={34} rx={5} ry={6} fill="#68C848" />
    <Ellipse cx={40} cy={32} rx={3.5} ry={3} fill="#88D868" opacity={0.4} />
    <Circle cx={22} cy={20} r={4} fill="#F8F0E8" stroke="#E8D8C8" strokeWidth={0.5} />
    <Circle cx={34} cy={18} r={4.5} fill="#E8A0C0" />
    <Ellipse cx={34} cy={17} rx={3} ry={2} fill="#F0B0D0" opacity={0.4} />
    <Circle cx={28} cy={12} r={3.5} fill="#A0D8A0" />
    <Ellipse cx={28} cy={11} rx={2.5} ry={1.5} fill="#B0E8B0" opacity={0.4} />
  </Svg>
);

export const BarleyTea = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="btea_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8D8C0" />
        <Stop offset="1" stopColor="#D0C0A0" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={46} rx={12} ry={3} fill="#C8C0B0" opacity={0.3} />
    <Path d="M16 22 Q16 44 28 44 Q40 44 40 22 Z" fill="url(#btea_g)" stroke="#C0B090" strokeWidth={0.8} />
    <Ellipse cx={28} cy={22} rx={12} ry={4.5} fill="#C89848" opacity={0.7} />
    <Ellipse cx={28} cy={22} rx={9} ry={3} fill="#D0A858" opacity={0.5} />
    <Path d="M40 28 Q46 28 46 33 Q46 38 40 38" fill="none" stroke="#C0B090" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M24 18 Q22 12 24 8" fill="none" stroke="#D8D0C8" strokeWidth={0.7} opacity={0.4} />
    <Path d="M32 18 Q34 10 32 6" fill="none" stroke="#D8D0C8" strokeWidth={0.7} opacity={0.4} />
  </Svg>
);

export const HangulChart = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={4} width={44} height={48} rx={3} fill="#FFF8F0" stroke="#E8D8C0" strokeWidth={1} />
    <Rect x={10} y={8} width={36} height={8} rx={2} fill="#4880E8" />
    <Rect x={14} y={10} width={28} height={4} rx={1} fill="#68A0F8" opacity={0.5} />
    {[0, 1, 2, 3].map(row => (
      <G key={row}>
        {[0, 1, 2, 3].map(col => (
          <Rect key={col} x={10 + col * 9.5} y={20 + row * 8} width={8} height={6} rx={1} fill="#F8F0E8" stroke="#E0D0C0" strokeWidth={0.4} />
        ))}
      </G>
    ))}
    <Path d="M14 23 L14 24 L16 24 M14 23 L16 23" stroke="#4A4A5E" strokeWidth={0.8} />
    <Path d="M24 23 L24 25 M23 23 L25 23" stroke="#4A4A5E" strokeWidth={0.8} />
    <Path d="M33 22 Q34.5 23 33 24 Q34.5 25 33 26" stroke="#4A4A5E" strokeWidth={0.8} fill="none" />
    <Circle cx={43} cy={24} r={2} fill="none" stroke="#4A4A5E" strokeWidth={0.8} />
  </Svg>
);

export const TaekwondoBelt = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M8 26 Q28 20 48 26 Q48 32 28 28 Q8 32 8 26 Z" fill="#1A1A2E" />
    <Path d="M8 26 Q28 20 48 26" fill="none" stroke="#2A2A3E" strokeWidth={0.5} />
    <Path d="M24 28 L20 40" stroke="#1A1A2E" strokeWidth={3} strokeLinecap="round" />
    <Path d="M32 28 L36 40" stroke="#1A1A2E" strokeWidth={3} strokeLinecap="round" />
    <Path d="M20 40 L18 46" stroke="#1A1A2E" strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M36 40 L38 46" stroke="#1A1A2E" strokeWidth={2.5} strokeLinecap="round" />
    <Circle cx={28} cy={26} r={3} fill="#2A2A3E" />
    <Path d="M28 24 Q30 26 28 28" fill="none" stroke="#3A3A4E" strokeWidth={0.5} />
    <Ellipse cx={28} cy={28} rx={6} ry={1.5} fill="#1A1A2E" opacity={0.3} />
  </Svg>
);

export const LEDLight = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="led_g" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#E848A0" />
        <Stop offset="0.5" stopColor="#A848E8" />
        <Stop offset="1" stopColor="#4888E8" />
      </LinearGradient>
    </Defs>
    <Path d="M8 12 Q8 8 28 8 Q48 8 48 12 Q48 16 28 16 Q8 16 8 12 Z" fill="url(#led_g)" opacity={0.3} />
    <Path d="M10 12 Q10 8 28 8 Q46 8 46 12" fill="none" stroke="url(#led_g)" strokeWidth={3} strokeLinecap="round" />
    <Path d="M10 12 Q10 8 28 8 Q46 8 46 12" fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.4} />
    <Circle cx={14} cy={10} r={1.5} fill="#E848A0" />
    <Circle cx={22} cy={9} r={1.5} fill="#C848D8" />
    <Circle cx={30} cy={9} r={1.5} fill="#8848E8" />
    <Circle cx={38} cy={10} r={1.5} fill="#5868E8" />
    <Circle cx={46} cy={12} r={1.5} fill="#4888E8" />
    <Path d="M14 12 L14 6" stroke="#E8D8C0" strokeWidth={0.5} opacity={0.3} />
    <Path d="M42 12 L42 6" stroke="#E8D8C0" strokeWidth={0.5} opacity={0.3} />
    <Rect x={14} y={4} width={28} height={2} rx={1} fill="#E8D8C0" opacity={0.2} />
  </Svg>
);

export const KrDrum = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="krdrum_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8D0A0" />
        <Stop offset="1" stopColor="#C8A870" />
      </LinearGradient>
    </Defs>
    <Path d="M8 24 L8 36 Q8 40 28 40 Q48 40 48 36 L48 24 Z" fill="url(#krdrum_g)" />
    <Ellipse cx={28} cy={24} rx={20} ry={8} fill="#F0E0C0" stroke="#C8A870" strokeWidth={0.8} />
    <Ellipse cx={28} cy={24} rx={14} ry={5} fill="#F8ECD0" opacity={0.5} />
    <Path d="M8 28 Q28 32 48 28" fill="none" stroke="#E84848" strokeWidth={1.5} />
    <Path d="M8 34 Q28 38 48 34" fill="none" stroke="#4880E8" strokeWidth={1.5} />
    <Circle cx={14} cy={24} r={2} fill="#E84848" opacity={0.3} />
    <Circle cx={42} cy={24} r={2} fill="#4880E8" opacity={0.3} />
    <Rect x={2} y={18} width={2} height={14} rx={1} fill="#C8A070" transform="rotate(-20, 2, 18)" />
    <Circle cx={1} cy={17} r={2.5} fill="#D8B080" />
    <Rect x={52} y={18} width={2} height={14} rx={1} fill="#C8A070" transform="rotate(20, 52, 18)" />
    <Circle cx={53} cy={17} r={2.5} fill="#D8B080" />
  </Svg>
);

export const MapOfKorea = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={6} width={40} height={44} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M26 12 Q30 14 32 18 Q34 24 30 28 Q28 30 26 34 Q24 38 26 42 Q28 44 30 42" fill="none" stroke="#78A870" strokeWidth={2} strokeLinecap="round" />
    <Path d="M26 12 Q30 14 32 18 Q34 24 30 28 Q28 30 26 34 Q24 38 26 42 Q28 44 30 42" fill="#A8D8A0" opacity={0.3} strokeWidth={0} />
    <Line x1={28} y1={30} x2={28} y2={30.5} stroke="#A0A0A0" strokeWidth={0.5} strokeDasharray="1,1" />
    <Circle cx={30} cy={20} r={2} fill="#E84860" />
    <Circle cx={28} cy={36} r={1.5} fill="#4880E8" opacity={0.6} />
    <Path d="M12 46 L44 46" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 10 L16 10" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 10 L12 14" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const krIllustrations: Record<string, React.FC<{ size?: number }>> = {
  kr_l1: HanbokDisplay,
  kr_l2: KpopPoster,
  kr_l3: KrGameConsole,
  kr_l4: FanDanceProps,
  kr_l5: FloorCushion,
  kr_k1: KimchiJars,
  kr_k2: BibimbapBowl,
  kr_k3: KrChopsticks,
  kr_k4: RiceCake,
  kr_k5: BarleyTea,
  kr_c1: HangulChart,
  kr_c2: TaekwondoBelt,
  kr_c3: LEDLight,
  kr_c4: KrDrum,
  kr_c5: MapOfKorea,
};
