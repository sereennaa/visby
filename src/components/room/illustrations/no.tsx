import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

const VikingShipModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="no_ship" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C8A060" />
        <Stop offset="1" stopColor="#A08040" />
      </LinearGradient>
    </Defs>
    <Path d="M4 34 Q8 42 28 44 Q48 42 52 34 L46 34 Q44 38 28 40 Q12 38 10 34 Z" fill="url(#no_ship)" stroke="#907030" strokeWidth={0.8} />
    <Path d="M4 34 Q2 32 6 30 L50 30 Q54 32 52 34 Z" fill="#B89050" />
    <Path d="M6 30 L4 26 Q2 24 6 24" fill="none" stroke="#A08040" strokeWidth={2} strokeLinecap="round" />
    <Path d="M50 30 L52 26 Q54 24 50 24" fill="none" stroke="#A08040" strokeWidth={2} strokeLinecap="round" />
    <Rect x={27} y={10} width={2} height={24} rx={1} fill="#A08040" />
    <Path d="M29 12 L42 22 L29 24 Z" fill="#E8E0D0" stroke="#C8B898" strokeWidth={0.5} />
    <Line x1={14} y1={32} x2={14} y2={36} stroke="#907030" strokeWidth={0.8} />
    <Line x1={22} y1={32} x2={22} y2={38} stroke="#907030" strokeWidth={0.8} />
    <Line x1={34} y1={32} x2={34} y2={38} stroke="#907030" strokeWidth={0.8} />
    <Line x1={42} y1={32} x2={42} y2={36} stroke="#907030" strokeWidth={0.8} />
    {[12, 18, 24, 30, 36, 42].map((x, i) => (
      <Circle key={i} cx={x} cy={32} r={2} fill="#C8A060" stroke="#907030" strokeWidth={0.5} />
    ))}
  </Svg>
);

const RuneStones = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M10 46 L18 10 Q20 6 22 10 L26 46 Z" fill="#A0A098" stroke="#888880" strokeWidth={0.8} />
    <Path d="M16 18 L16 36" stroke="#686860" strokeWidth={1} />
    <Path d="M14 24 L18 20" stroke="#686860" strokeWidth={1} />
    <Path d="M14 32 L18 28" stroke="#686860" strokeWidth={1} />
    <Path d="M30 46 L36 14 Q38 10 40 14 L44 46 Z" fill="#989890" stroke="#808078" strokeWidth={0.8} />
    <Path d="M36 22 L38 18 L40 22" fill="none" stroke="#686860" strokeWidth={1} />
    <Path d="M38 26 L38 36" stroke="#686860" strokeWidth={1} />
    <Path d="M36 30 L40 30" stroke="#686860" strokeWidth={1} />
    <Ellipse cx={22} cy={46} rx={14} ry={3} fill="#D8D0C0" opacity={0.4} />
    <Ellipse cx={38} cy={46} rx={10} ry={3} fill="#D8D0C0" opacity={0.3} />
  </Svg>
);

const TrollFigure = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={40} rx={12} ry={10} fill="#78A050" />
    <Circle cx={28} cy={22} r={10} fill="#88B060" />
    <Circle cx={24} cy={20} r={2.5} fill="#FFFFF0" />
    <Circle cx={32} cy={20} r={2.5} fill="#FFFFF0" />
    <Circle cx={24} cy={20} r={1.2} fill="#483828" />
    <Circle cx={32} cy={20} r={1.2} fill="#483828" />
    <Ellipse cx={28} cy={26} rx={4} ry={3} fill="#98C070" />
    <Circle cx={26} cy={25} r={0.8} fill="#78A050" />
    <Circle cx={30} cy={25} r={0.8} fill="#78A050" />
    <Path d="M24 28 Q28 32 32 28" fill="none" stroke="#588838" strokeWidth={1} />
    <Path d="M20 12 Q18 6 14 8" fill="none" stroke="#88B060" strokeWidth={3} strokeLinecap="round" />
    <Path d="M36 12 Q38 6 42 8" fill="none" stroke="#88B060" strokeWidth={3} strokeLinecap="round" />
    <Path d="M28 14 Q28 8 28 4" fill="none" stroke="#68A048" strokeWidth={2} strokeLinecap="round" />
    <Circle cx={28} cy={4} r={2} fill="#E8D060" />
  </Svg>
);

const Fireplace = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={8} width={44} height={40} rx={3} fill="#989088" stroke="#787068" strokeWidth={1} />
    <Path d="M12 48 L12 24 Q12 20 16 20 L40 20 Q44 20 44 24 L44 48 Z" fill="#282420" />
    <Path d="M22 48 Q22 36 28 30 Q34 36 34 48 Z" fill="#E86838" />
    <Path d="M25 48 Q25 40 28 34 Q31 40 31 48 Z" fill="#F8A838" />
    <Path d="M27 48 Q27 44 28 40 Q29 44 29 48 Z" fill="#F8E060" />
    <Rect x={10} y={8} width={36} height={4} rx={1} fill="#A89888" />
    <Rect x={8} y={48} width={40} height={4} rx={1} fill="#A89888" />
    <Circle cx={16} cy={14} r={1} fill="#B8A898" />
    <Circle cx={22} cy={14} r={1} fill="#B8A898" />
    <Circle cx={34} cy={14} r={1} fill="#B8A898" />
    <Circle cx={40} cy={14} r={1} fill="#B8A898" />
  </Svg>
);

const ReindeerPelt = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M28 6 Q12 10 8 28 Q6 40 14 48 Q22 52 28 50 Q34 52 42 48 Q50 40 48 28 Q44 10 28 6 Z" fill="#D8C0A0" />
    <Path d="M28 6 Q22 10 18 18 Q16 26 18 34 Q20 40 28 42 Q36 40 38 34 Q40 26 38 18 Q34 10 28 6 Z" fill="#E8D0B0" opacity={0.5} />
    <Path d="M18 14 L14 8 L10 10" fill="none" stroke="#C8A880" strokeWidth={2} strokeLinecap="round" />
    <Path d="M38 14 L42 8 L46 10" fill="none" stroke="#C8A880" strokeWidth={2} strokeLinecap="round" />
    <Ellipse cx={28} cy={28} rx={8} ry={10} fill="#D0B890" opacity={0.3} />
    <Path d="M12 36 L8 42" fill="none" stroke="#C8A880" strokeWidth={2} strokeLinecap="round" />
    <Path d="M44 36 L48 42" fill="none" stroke="#C8A880" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const Brunost = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="no_bru" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C88840" />
        <Stop offset="1" stopColor="#A87030" />
      </LinearGradient>
    </Defs>
    <Path d="M10 24 L14 18 L46 18 L46 40 L10 40 Z" fill="url(#no_bru)" />
    <Rect x={10} y={24} width={36} height={16} fill="#B87838" />
    <Path d="M10 24 L14 18 L46 18 L46 24 Z" fill="#D89848" />
    <Path d="M10 24 L14 18" stroke="#A87030" strokeWidth={0.8} />
    <Path d="M10 40 L46 40 L46 18" fill="none" stroke="#987028" strokeWidth={0.8} />
    <Ellipse cx={28} cy={32} rx={10} ry={4} fill="#C88840" opacity={0.3} />
    <Rect x={44} y={22} width={6} height={10} rx={1} fill="#D8D0C8" stroke="#C0B8B0" strokeWidth={0.5} />
    <Path d="M47 22 L47 18 L50 18" fill="none" stroke="#C0B8B0" strokeWidth={0.8} />
  </Svg>
);

const Salmon = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="no_salm" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8A888" />
        <Stop offset="1" stopColor="#E88868" />
      </LinearGradient>
    </Defs>
    <Path d="M8 28 Q14 18 28 18 Q42 18 48 24 L52 20 L52 36 L48 32 Q42 38 28 38 Q14 38 8 28 Z" fill="url(#no_salm)" stroke="#D87858" strokeWidth={0.8} />
    <Ellipse cx={14} cy={26} rx={2} ry={1.5} fill="#1A1A2E" />
    <Path d="M18 24 Q28 20 38 24" fill="none" stroke="#F8C0A8" strokeWidth={0.8} opacity={0.5} />
    <Path d="M18 28 Q28 24 38 28" fill="none" stroke="#F8C0A8" strokeWidth={0.8} opacity={0.4} />
    <Path d="M18 32 Q28 28 38 32" fill="none" stroke="#F8C0A8" strokeWidth={0.8} opacity={0.3} />
    <Path d="M52 20 Q48 28 52 36" fill="none" stroke="#D87858" strokeWidth={1} />
    <Line x1={50} y1={24} x2={52} y2={24} stroke="#D87858" strokeWidth={0.5} />
    <Line x1={50} y1={32} x2={52} y2={32} stroke="#D87858" strokeWidth={0.5} />
  </Svg>
);

const Waffles = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="no_waf" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8C878" />
        <Stop offset="1" stopColor="#D8B060" />
      </LinearGradient>
    </Defs>
    <Path d="M28 8 L14 22 L14 34 L28 48 L42 34 L42 22 Z" fill="url(#no_waf)" stroke="#C8A048" strokeWidth={1} />
    <Path d="M20 18 Q28 14 36 18" fill="none" stroke="#C8A048" strokeWidth={0.6} />
    <Path d="M16 24 Q28 20 40 24" fill="none" stroke="#C8A048" strokeWidth={0.6} />
    <Path d="M16 30 Q28 26 40 30" fill="none" stroke="#C8A048" strokeWidth={0.6} />
    <Path d="M20 36 Q28 32 36 36" fill="none" stroke="#C8A048" strokeWidth={0.6} />
    <Path d="M24 14 L24 42" stroke="#C8A048" strokeWidth={0.5} />
    <Path d="M28 10 L28 46" stroke="#C8A048" strokeWidth={0.5} />
    <Path d="M32 14 L32 42" stroke="#C8A048" strokeWidth={0.5} />
    <Circle cx={24} cy={24} r={2} fill="#E84040" opacity={0.6} />
    <Circle cx={32} cy={28} r={1.5} fill="#E84040" opacity={0.5} />
    <Circle cx={28} cy={20} r={1.8} fill="#E84040" opacity={0.55} />
    <Ellipse cx={28} cy={36} rx={4} ry={2} fill="#F8E878" opacity={0.4} />
  </Svg>
);

const Lingonberries = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M26 14 Q24 8 28 6 Q32 8 30 14" fill="#48A048" />
    <Path d="M22 16 Q18 10 22 8" fill="#58A858" strokeWidth={0.5} />
    <Path d="M34 16 Q38 10 34 8" fill="#58A858" strokeWidth={0.5} />
    <Circle cx={20} cy={28} r={5} fill="#D83040" />
    <Circle cx={20} cy={26} r={2} fill="#E85060" opacity={0.4} />
    <Circle cx={32} cy={26} r={5.5} fill="#C82838" />
    <Circle cx={32} cy={24} r={2.2} fill="#E04858" opacity={0.4} />
    <Circle cx={26} cy={36} r={5} fill="#D83040" />
    <Circle cx={26} cy={34} r={2} fill="#E85060" opacity={0.4} />
    <Circle cx={38} cy={34} r={4.5} fill="#C82838" />
    <Circle cx={38} cy={32} r={1.8} fill="#E04858" opacity={0.4} />
    <Circle cx={14} cy={36} r={4} fill="#D83040" />
    <Circle cx={14} cy={34.5} r={1.5} fill="#E85060" opacity={0.4} />
    <Circle cx={44} cy={30} r={3.5} fill="#C82838" />
  </Svg>
);

const Coffee = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="no_cof" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8E0D8" />
        <Stop offset="1" stopColor="#D0C0B0" />
      </LinearGradient>
    </Defs>
    <Path d="M14 20 Q12 40 16 44 L40 44 Q44 40 42 20 Z" fill="url(#no_cof)" stroke="#B8A890" strokeWidth={0.8} />
    <Ellipse cx={28} cy={20} rx={14} ry={5} fill="#E8E0D0" stroke="#B8A890" strokeWidth={0.5} />
    <Ellipse cx={28} cy={22} rx={11} ry={3.5} fill="#6A4830" />
    <Ellipse cx={26} cy={21} rx={4} ry={1.5} fill="#7A5838" opacity={0.5} />
    <Path d="M42 26 Q48 26 48 32 Q48 38 42 38" fill="none" stroke="#B8A890" strokeWidth={2} strokeLinecap="round" />
    <Path d="M24 18 Q22 12 24 8" fill="none" stroke="#D0D0D0" strokeWidth={0.8} opacity={0.4} />
    <Path d="M28 16 Q30 8 28 4" fill="none" stroke="#D0D0D0" strokeWidth={0.8} opacity={0.4} />
    <Path d="M32 18 Q34 12 32 8" fill="none" stroke="#D0D0D0" strokeWidth={0.8} opacity={0.4} />
  </Svg>
);

const AuroraPhoto = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#1A1A2E" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M10 20 Q20 10 30 18 Q40 10 46 16" fill="none" stroke="#48E888" strokeWidth={2.5} opacity={0.6} />
    <Path d="M10 24 Q22 14 32 22 Q42 14 46 20" fill="none" stroke="#48C8E8" strokeWidth={2} opacity={0.5} />
    <Path d="M10 28 Q24 18 34 26 Q44 18 46 24" fill="none" stroke="#88E8A8" strokeWidth={1.5} opacity={0.4} />
    <Path d="M10 32 Q26 22 36 30 Q44 24 46 28" fill="none" stroke="#A8E8C8" strokeWidth={1} opacity={0.3} />
    <Rect x={10} y={38} width={36} height={8} fill="#1A2A1E" />
    <Path d="M14 38 L16 32 L18 38" fill="#2A3A2E" />
    <Path d="M30 38 L34 30 L38 38" fill="#2A3A2E" />
    {[14, 22, 30, 38, 44].map((x, i) => (
      <Circle key={i} cx={x} cy={14 + (i % 3) * 2} r={0.8} fill="#F8F0E0" opacity={0.5} />
    ))}
  </Svg>
);

const FjordPainting = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#F8F0E0" stroke="#C8A870" strokeWidth={1.5} />
    <Rect x={10} y={10} width={36} height={36} fill="#88C0D8" opacity={0.4} />
    <Path d="M10 28 L18 14 L24 20 L32 10 L40 18 L46 12 L46 28 Z" fill="#708898" />
    <Path d="M18 14 L24 20 L32 10" fill="#8898A8" opacity={0.5} />
    <Path d="M20 14 L24 18 L30 12" fill="#F0F8FF" opacity={0.3} />
    <Rect x={10} y={28} width={36} height={18} fill="#4888A8" opacity={0.5} />
    <Path d="M10 30 Q20 28 30 30 Q40 32 46 30" fill="none" stroke="#68A8C8" strokeWidth={0.5} opacity={0.5} />
    <Path d="M10 34 Q20 32 30 34 Q40 36 46 34" fill="none" stroke="#68A8C8" strokeWidth={0.5} opacity={0.4} />
  </Svg>
);

const PolarBearToy = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={38} rx={14} ry={10} fill="#F0F0F0" />
    <Circle cx={28} cy={22} r={10} fill="#F8F8F8" />
    <Circle cx={22} cy={14} r={4} fill="#F0F0F0" />
    <Circle cx={34} cy={14} r={4} fill="#F0F0F0" />
    <Circle cx={22} cy={14} r={2} fill="#E8D8D8" />
    <Circle cx={34} cy={14} r={2} fill="#E8D8D8" />
    <Circle cx={24} cy={20} r={2} fill="#383838" />
    <Circle cx={32} cy={20} r={2} fill="#383838" />
    <Circle cx={24} cy={19} r={0.8} fill="#F8F8F8" />
    <Circle cx={32} cy={19} r={0.8} fill="#F8F8F8" />
    <Ellipse cx={28} cy={24} rx={3} ry={2} fill="#383838" />
    <Ellipse cx={28} cy={24.5} rx={1.5} ry={0.8} fill="#585858" opacity={0.5} />
    <Path d="M26 26 Q28 28 30 26" fill="none" stroke="#C0B0B0" strokeWidth={0.8} />
    <Ellipse cx={18} cy={42} rx={4} ry={3} fill="#E8E8E8" />
    <Ellipse cx={38} cy={42} rx={4} ry={3} fill="#E8E8E8" />
  </Svg>
);

const MidnightSunPhoto = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#F8F0E0" stroke="#D8C8A0" strokeWidth={1} />
    <Defs>
      <LinearGradient id="no_sky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8C868" />
        <Stop offset="1" stopColor="#E88848" />
      </LinearGradient>
    </Defs>
    <Rect x={10} y={10} width={36} height={36} fill="url(#no_sky)" opacity={0.5} />
    <Path d="M10 36 L46 36 L46 46 L10 46 Z" fill="#486888" opacity={0.4} />
    <Circle cx={28} cy={36} r={8} fill="#F8D868" />
    <Circle cx={28} cy={36} r={5} fill="#F8E888" opacity={0.6} />
    <Path d="M10 38 Q20 34 30 38 Q40 42 46 38" fill="none" stroke="#5888A8" strokeWidth={0.5} opacity={0.4} />
    <Circle cx={28} cy={36} r={12} fill="#F8E888" opacity={0.15} />
  </Svg>
);

const SkiEquipment = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={18} y={4} width={3} height={46} rx={1.5} fill="#3870B8" />
    <Rect x={24} y={4} width={3} height={46} rx={1.5} fill="#E84848" />
    <Path d="M18 4 Q19.5 2 21 4" fill="#3870B8" />
    <Path d="M24 4 Q25.5 2 27 4" fill="#E84848" />
    <Path d="M17 48 Q19.5 50 22 48" fill="none" stroke="#3870B8" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M23 48 Q25.5 50 28 48" fill="none" stroke="#E84848" strokeWidth={1.5} strokeLinecap="round" />
    <Rect x={34} y={6} width={2} height={40} rx={1} fill="#A08050" />
    <Rect x={40} y={6} width={2} height={40} rx={1} fill="#A08050" />
    <Circle cx={35} cy={6} r={2.5} fill="#C8B090" />
    <Circle cx={41} cy={6} r={2.5} fill="#C8B090" />
    <Circle cx={35} cy={46} r={3} fill="#C8B090" stroke="#A08050" strokeWidth={0.5} />
    <Circle cx={41} cy={46} r={3} fill="#C8B090" stroke="#A08050" strokeWidth={0.5} />
  </Svg>
);

export const noIllustrations: Record<string, React.FC<{ size?: number }>> = {
  no_l1: VikingShipModel,
  no_l2: RuneStones,
  no_l3: TrollFigure,
  no_l4: Fireplace,
  no_l5: ReindeerPelt,
  no_k1: Brunost,
  no_k2: Salmon,
  no_k3: Waffles,
  no_k4: Lingonberries,
  no_k5: Coffee,
  no_a1: AuroraPhoto,
  no_a2: FjordPainting,
  no_a3: PolarBearToy,
  no_a4: MidnightSunPhoto,
  no_a5: SkiEquipment,
};
