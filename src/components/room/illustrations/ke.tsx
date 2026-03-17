import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

const Binoculars = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={10} y={16} width={14} height={24} rx={7} fill="#485058" stroke="#383E44" strokeWidth={0.8} />
    <Rect x={32} y={16} width={14} height={24} rx={7} fill="#485058" stroke="#383E44" strokeWidth={0.8} />
    <Rect x={22} y={24} width={12} height={6} rx={2} fill="#404850" />
    <Circle cx={17} cy={16} r={7} fill="#505860" stroke="#383E44" strokeWidth={0.8} />
    <Circle cx={39} cy={16} r={7} fill="#505860" stroke="#383E44" strokeWidth={0.8} />
    <Circle cx={17} cy={16} r={4.5} fill="#88C8E8" opacity={0.3} />
    <Circle cx={39} cy={16} r={4.5} fill="#88C8E8" opacity={0.3} />
    <Circle cx={15} cy={14} r={1.5} fill="#A8D8F0" opacity={0.4} />
    <Circle cx={37} cy={14} r={1.5} fill="#A8D8F0" opacity={0.4} />
    <Circle cx={17} cy={40} r={7} fill="#505860" stroke="#383E44" strokeWidth={0.8} />
    <Circle cx={39} cy={40} r={7} fill="#505860" stroke="#383E44" strokeWidth={0.8} />
  </Svg>
);

const MaasaiShield = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={28} rx={16} ry={22} fill="#E83838" stroke="#C82828" strokeWidth={1} />
    <Ellipse cx={28} cy={28} rx={10} ry={18} fill="none" stroke="#F8F0E0" strokeWidth={1.5} />
    <Line x1={28} y1={6} x2={28} y2={50} stroke="#F8F0E0" strokeWidth={2} />
    <Circle cx={28} cy={18} r={2.5} fill="#F8F0E0" />
    <Circle cx={28} cy={28} r={2.5} fill="#F8F0E0" />
    <Circle cx={28} cy={38} r={2.5} fill="#F8F0E0" />
    <Path d="M22 16 L22 22" stroke="#F8F0E0" strokeWidth={1} />
    <Path d="M34 16 L34 22" stroke="#F8F0E0" strokeWidth={1} />
    <Path d="M22 34 L22 40" stroke="#F8F0E0" strokeWidth={1} />
    <Path d="M34 34 L34 40" stroke="#F8F0E0" strokeWidth={1} />
  </Svg>
);

const GiraffePhoto = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#F8F0E0" stroke="#D8C8A0" strokeWidth={1} />
    <Rect x={10} y={10} width={36} height={36} fill="#88C8E8" opacity={0.3} />
    <Rect x={10} y={34} width={36} height={12} fill="#C8D878" opacity={0.5} />
    <Path d="M30 34 L30 18 Q30 14 32 10" fill="none" stroke="#E8A840" strokeWidth={3} strokeLinecap="round" />
    <Circle cx={32} cy={12} r={4} fill="#E8A840" />
    <Circle cx={33} cy={11} r={1} fill="#483828" />
    <Path d="M30 8 L28 4" fill="none" stroke="#E8A840" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M34 8 L36 4" fill="none" stroke="#E8A840" strokeWidth={1.5} strokeLinecap="round" />
    {[0, 1, 2, 3].map(i => (
      <Circle key={i} cx={30 + (i % 2) * 2} cy={20 + i * 4} r={1.2} fill="#C88830" opacity={0.6} />
    ))}
  </Svg>
);

const BeadedNecklace = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M14 16 Q14 44 28 46 Q42 44 42 16" fill="none" stroke="#D8C8B0" strokeWidth={1.5} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
      const colors = ['#E83838', '#E8A030', '#48A0D0', '#48A848', '#E83838', '#F8E040', '#E83838', '#48A0D0', '#E8A030', '#48A848', '#F8E040', '#E83838'];
      const angle = -90 + i * 15;
      const rad = (angle * Math.PI) / 180;
      const cx = 28 + Math.cos(rad) * 14;
      const cy = 30 + Math.sin(rad) * 16;
      return <Circle key={i} cx={cx} cy={cy} r={2.5} fill={colors[i]} />;
    })}
    <Path d="M14 16 Q14 10 20 8" fill="none" stroke="#D8C8B0" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M42 16 Q42 10 36 8" fill="none" stroke="#D8C8B0" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const WovenChair = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={12} y={24} width={32} height={6} rx={2} fill="#C8A060" />
    <Rect x={14} y={12} width={28} height={14} rx={2} fill="#D8B878" />
    {[0, 1, 2, 3, 4, 5].map(i => (
      <Line key={i} x1={18 + i * 4.5} y1={14} x2={18 + i * 4.5} y2={24} stroke="#C09848" strokeWidth={1} />
    ))}
    {[0, 1, 2].map(i => (
      <Line key={`h${i}`} x1={16} y1={16 + i * 3} x2={40} y2={16 + i * 3} stroke="#C09848" strokeWidth={0.6} />
    ))}
    <Rect x={14} y={30} width={3} height={18} rx={1} fill="#A08050" />
    <Rect x={39} y={30} width={3} height={18} rx={1} fill="#A08050" />
    <Rect x={20} y={30} width={3} height={18} rx={1} fill="#A08050" />
    <Rect x={33} y={30} width={3} height={18} rx={1} fill="#A08050" />
  </Svg>
);

const Ugali = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={42} rx={20} ry={6} fill="#D8C8B0" stroke="#C0B090" strokeWidth={0.5} />
    <Ellipse cx={28} cy={40} rx={18} ry={5} fill="#E8E0D0" />
    <Path d="M16 28 Q16 40 28 40 Q40 40 40 28 Z" fill="#F8F4E8" />
    <Ellipse cx={28} cy={28} rx={12} ry={5} fill="#FFFFF0" />
    <Ellipse cx={26} cy={26} rx={4} ry={2} fill="#FFFFFF" opacity={0.5} />
    <Path d="M16 28 Q16 40 28 40 Q40 40 40 28" fill="none" stroke="#E0D8C0" strokeWidth={0.8} />
  </Svg>
);

const NyamaChoma = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={4} y={26} width={48} height={3} rx={1.5} fill="#A08050" />
    {[0, 1, 2, 3].map(i => (
      <G key={i}>
        <Rect x={12 + i * 9} y={18} width={7} height={10} rx={3} fill="#A06040" />
        <Rect x={13 + i * 9} y={19} width={5} height={3} rx={1.5} fill="#B87050" opacity={0.5} />
        <Line x1={15.5 + i * 9} y1={20} x2={15.5 + i * 9} y2={26} stroke="#806040" strokeWidth={0.4} opacity={0.3} />
      </G>
    ))}
    <Path d="M18 16 Q16 10 18 6" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Path d="M30 16 Q32 8 30 4" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Rect x={4} y={30} width={2} height={16} rx={1} fill="#A08050" transform="rotate(-15, 4, 30)" />
    <Rect x={50} y={30} width={2} height={16} rx={1} fill="#A08050" transform="rotate(15, 50, 30)" />
  </Svg>
);

const KenyanCoffee = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ke_coff" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8D8C0" />
        <Stop offset="1" stopColor="#C8B898" />
      </LinearGradient>
    </Defs>
    <Path d="M28 34 Q28 44 34 44 Q40 44 40 34 Z" fill="url(#ke_coff)" stroke="#B8A888" strokeWidth={0.8} />
    <Ellipse cx={34} cy={34} rx={6} ry={3} fill="#D8C8B0" />
    <Ellipse cx={34} cy={35} rx={4.5} ry={2} fill="#6A4830" />
    <Path d="M40 36 Q44 36 44 39 Q44 42 40 42" fill="none" stroke="#B8A888" strokeWidth={1.2} strokeLinecap="round" />
    <Path d="M32 32 Q30 26 32 22" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Ellipse cx={18} cy={38} rx={5} ry={4} fill="#6A4830" />
    <Path d="M16 36 Q18 34 20 36" fill="none" stroke="#8A6840" strokeWidth={0.8} />
    <Ellipse cx={14} cy={42} rx={4.5} ry={3.5} fill="#7A5838" />
    <Path d="M12 40 Q14 38 16 40" fill="none" stroke="#9A7848" strokeWidth={0.8} />
    <Ellipse cx={22} cy={44} rx={4} ry={3} fill="#6A4830" />
  </Svg>
);

const Chapati = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={32} rx={20} ry={16} fill="#E8C878" />
    <Ellipse cx={28} cy={30} rx={18} ry={14} fill="#F0D898" />
    <Ellipse cx={24} cy={28} rx={6} ry={4} fill="#E8C070" opacity={0.4} />
    <Ellipse cx={34} cy={32} rx={5} ry={3.5} fill="#E8C070" opacity={0.3} />
    <Path d="M16 26 Q24 22 32 26 Q38 30 42 26" fill="none" stroke="#D8B060" strokeWidth={0.5} opacity={0.4} />
    <Path d="M14 32 Q22 28 30 32 Q36 36 44 32" fill="none" stroke="#D8B060" strokeWidth={0.5} opacity={0.3} />
    {[18, 24, 30, 36].map((x, i) => (
      <Circle key={i} cx={x} cy={28 + (i % 2) * 4} r={1} fill="#D8B060" opacity={0.3} />
    ))}
  </Svg>
);

const TropicalFruit = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={20} cy={32} rx={10} ry={8} fill="#F8A830" />
    <Ellipse cx={20} cy={30} rx={6} ry={3.5} fill="#F8C060" opacity={0.4} />
    <Path d="M20 24 Q22 20 20 16" fill="none" stroke="#68A848" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M18 24 Q14 20 16 16" fill="none" stroke="#68A848" strokeWidth={1} strokeLinecap="round" />
    <Circle cx={40} cy={34} r={9} fill="#8848A0" />
    <Circle cx={40} cy={32} r={5.5} fill="#9858B0" opacity={0.4} />
    <Path d="M36 28 Q40 24 44 28" fill="#68A848" />
    <Circle cx={40} cy={34} r={4} fill="#E8A838" opacity={0.3} />
    {[0, 1, 2, 3].map(i => (
      <Circle key={i} cx={38 + (i % 2) * 4} cy={32 + Math.floor(i / 2) * 4} r={0.8} fill="#F0C060" opacity={0.4} />
    ))}
  </Svg>
);

const AcaciaTreeModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={26} y={30} width={4} height={18} rx={1.5} fill="#A08050" />
    <Path d="M20 30 Q16 30 14 28" fill="none" stroke="#908048" strokeWidth={2} strokeLinecap="round" />
    <Path d="M36 30 Q40 30 42 28" fill="none" stroke="#908048" strokeWidth={2} strokeLinecap="round" />
    <Ellipse cx={28} cy={22} rx={22} ry={10} fill="#68A848" />
    <Ellipse cx={24} cy={20} rx={8} ry={4} fill="#78B858" opacity={0.5} />
    <Ellipse cx={36} cy={18} rx={6} ry={3} fill="#78B858" opacity={0.4} />
    <Ellipse cx={28} cy={22} rx={22} ry={10} fill="none" stroke="#588838" strokeWidth={0.8} />
    <Rect x={10} y={48} width={36} height={3} rx={1.5} fill="#E8D8A0" opacity={0.4} />
  </Svg>
);

const MtKenyaPhoto = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={2} fill="#F8F0E0" stroke="#D8C8A0" strokeWidth={1} />
    <Rect x={10} y={10} width={36} height={36} fill="#88C8E8" opacity={0.3} />
    <Path d="M10 38 L22 18 L28 24 L36 14 L46 38 Z" fill="#8888A0" />
    <Path d="M22 18 L28 24 L36 14" fill="#C8C8D8" opacity={0.5} />
    <Path d="M24 18 L28 22 L34 16" fill="#F8F8FF" opacity={0.4} />
    <Rect x={10} y={36} width={36} height={10} fill="#68A848" opacity={0.5} />
    <Circle cx={40} cy={16} r={3} fill="#F8E848" opacity={0.5} />
  </Svg>
);

const RunningShoes = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M6 32 Q6 26 14 24 L36 24 Q44 24 46 28 L50 32 L50 36 L6 36 Z" fill="#E84848" />
    <Path d="M6 36 L50 36 L50 38 Q50 40 48 40 L8 40 Q6 40 6 38 Z" fill="#F0F0F0" />
    <Path d="M14 24 Q14 20 20 18 L30 18 Q34 18 36 22 L36 24" fill="#C83838" />
    <Ellipse cx={24} cy={18} rx={5} ry={2} fill="#D84848" opacity={0.5} />
    <Path d="M16 28 L20 26 L24 28 L28 26 L32 28" fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.6} />
    <Circle cx={42} cy={30} r={3} fill="#F8F0F0" opacity={0.3} />
    <Path d="M10 30 Q12 28 14 30" fill="none" stroke="#FFFFFF" strokeWidth={0.8} opacity={0.4} />
  </Svg>
);

const Drum = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ke_drum" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C88040" />
        <Stop offset="1" stopColor="#A06830" />
      </LinearGradient>
    </Defs>
    <Path d="M16 16 Q14 28 14 40 L42 40 Q44 28 42 16 Z" fill="url(#ke_drum)" />
    <Ellipse cx={28} cy={16} rx={14} ry={6} fill="#E8D0B0" stroke="#C8A070" strokeWidth={0.8} />
    <Ellipse cx={28} cy={40} rx={14} ry={5} fill="#A06830" />
    <Ellipse cx={28} cy={16} rx={10} ry={3.5} fill="#F0E0C8" opacity={0.5} />
    <Path d="M16 22 Q28 26 42 22" fill="none" stroke="#B87838" strokeWidth={0.8} opacity={0.5} />
    <Path d="M16 28 Q28 32 42 28" fill="none" stroke="#B87838" strokeWidth={0.8} opacity={0.4} />
    <Path d="M16 34 Q28 38 42 34" fill="none" stroke="#B87838" strokeWidth={0.8} opacity={0.3} />
    <Line x1={16} y1={16} x2={14} y2={40} stroke="#D8A060" strokeWidth={1} opacity={0.5} />
    <Line x1={40} y1={16} x2={42} y2={40} stroke="#D8A060" strokeWidth={1} opacity={0.5} />
  </Svg>
);

const MapOfKenya = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M26 12 Q34 14 38 18 Q42 22 40 28 Q38 34 42 38 Q40 42 36 44 Q30 44 26 42 Q22 40 18 36 Q16 32 18 26 Q20 20 22 16 Q24 12 26 12 Z" fill="#A8D8A0" stroke="#78A870" strokeWidth={0.8} />
    <Circle cx={30} cy={24} r={1.5} fill="#E84860" />
    <Circle cx={26} cy={32} r={1} fill="#E84860" opacity={0.6} />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const keIllustrations: Record<string, React.FC<{ size?: number }>> = {
  ke_l1: Binoculars,
  ke_l2: MaasaiShield,
  ke_l3: GiraffePhoto,
  ke_l4: BeadedNecklace,
  ke_l5: WovenChair,
  ke_k1: Ugali,
  ke_k2: NyamaChoma,
  ke_k3: KenyanCoffee,
  ke_k4: Chapati,
  ke_k5: TropicalFruit,
  ke_c1: AcaciaTreeModel,
  ke_c2: MtKenyaPhoto,
  ke_c3: RunningShoes,
  ke_c4: Drum,
  ke_c5: MapOfKenya,
};
