import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

const MachuPicchuModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M4 44 L16 20 L24 28 L32 18 L44 28 L52 22 L52 44 Z" fill="#A8B878" opacity={0.3} />
    <Rect x={14} y={32} width={8} height={6} rx={0.5} fill="#C8B890" stroke="#A89870" strokeWidth={0.5} />
    <Rect x={24} y={30} width={10} height={8} rx={0.5} fill="#C8B890" stroke="#A89870" strokeWidth={0.5} />
    <Rect x={36} y={34} width={6} height={4} rx={0.5} fill="#C8B890" stroke="#A89870" strokeWidth={0.5} />
    <Rect x={16} y={28} width={4} height={4} rx={0.5} fill="#B8A880" stroke="#A89870" strokeWidth={0.5} />
    <Rect x={26} y={26} width={6} height={4} rx={0.5} fill="#B8A880" stroke="#A89870" strokeWidth={0.5} />
    <Path d="M6 44 L50 44" stroke="#908868" strokeWidth={0.8} />
    <Rect x={6} y={38} width={44} height={6} rx={0.5} fill="#D8C8A0" opacity={0.4} />
    <Circle cx={40} cy={14} r={4} fill="#F8E848" opacity={0.3} />
  </Svg>
);

const AlpacaBlanket = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={10} width={40} height={36} rx={2} fill="#E85040" />
    <Rect x={8} y={10} width={40} height={6} fill="#E8A040" />
    <Rect x={8} y={22} width={40} height={6} fill="#48A0D0" />
    <Rect x={8} y={34} width={40} height={6} fill="#E8A040" />
    <Path d="M18 16 L22 16 L20 19 Z" fill="#F8F0E0" opacity={0.6} />
    <Path d="M30 16 L34 16 L32 19 Z" fill="#F8F0E0" opacity={0.6} />
    <Path d="M18 28 L22 28 L20 31 Z" fill="#F8F0E0" opacity={0.6} />
    <Path d="M30 28 L34 28 L32 31 Z" fill="#F8F0E0" opacity={0.6} />
    <Path d="M18 40 L22 40 L20 43 Z" fill="#F8F0E0" opacity={0.6} />
    <Path d="M30 40 L34 40 L32 43 Z" fill="#F8F0E0" opacity={0.6} />
    <Rect x={8} y={10} width={40} height={36} rx={2} fill="none" stroke="#C83828" strokeWidth={1} />
  </Svg>
);

const PanFlute = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
      <G key={i}>
        <Rect x={8 + i * 5.5} y={10 + i * 4} width={5} height={32 - i * 2.5} rx={2} fill="#D8B060" stroke="#C09848" strokeWidth={0.5} />
        <Ellipse cx={10.5 + i * 5.5} cy={10 + i * 4} rx={2.5} ry={1.2} fill="#E8C878" />
      </G>
    ))}
    <Rect x={6} y={8} width={46} height={3} rx={1.5} fill="#C09040" />
    <Line x1={6} y1={14} x2={52} y2={42} stroke="#B08038" strokeWidth={1.5} />
  </Svg>
);

const LlamaFigure = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={18} y={28} width={20} height={12} rx={4} fill="#F0E0C8" />
    <Rect x={20} y={38} width={4} height={10} rx={1.5} fill="#E8D0B0" />
    <Rect x={32} y={38} width={4} height={10} rx={1.5} fill="#E8D0B0" />
    <Circle cx={38} cy={18} r={6} fill="#F0E0C8" />
    <Path d="M32 28 Q36 22 38 18" fill="none" stroke="#E8D0B0" strokeWidth={4} strokeLinecap="round" />
    <Circle cx={40} cy={17} r={1.2} fill="#483828" />
    <Path d="M42 20 Q43 21 42 22" fill="none" stroke="#E0C0A0" strokeWidth={0.8} />
    <Path d="M36 12 L34 6" fill="none" stroke="#E8D0B0" strokeWidth={2} strokeLinecap="round" />
    <Path d="M40 12 L42 6" fill="none" stroke="#E8D0B0" strokeWidth={2} strokeLinecap="round" />
    <Rect x={20} y={24} width={16} height={6} rx={2} fill="#E85040" opacity={0.7} />
    <Path d="M22 26 L24 24 L26 26 L28 24 L30 26 L32 24 L34 26" fill="none" stroke="#F8E848" strokeWidth={0.8} />
  </Svg>
);

const WovenRug = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={14} width={40} height={28} rx={1} fill="#D86838" />
    <Rect x={12} y={18} width={32} height={20} fill="none" stroke="#F8E080" strokeWidth={1} />
    <Path d="M12 24 L44 24" stroke="#F8E080" strokeWidth={0.5} />
    <Path d="M12 32 L44 32" stroke="#F8E080" strokeWidth={0.5} />
    <Path d="M28 18 L28 38" stroke="#F8E080" strokeWidth={0.5} />
    <Path d="M20 22 L24 18 L28 22 L32 18 L36 22" fill="none" stroke="#F0F0E0" strokeWidth={0.8} />
    <Path d="M20 34 L24 38 L28 34 L32 38 L36 34" fill="none" stroke="#F0F0E0" strokeWidth={0.8} />
    <Circle cx={20} cy={28} r={2.5} fill="#F8E080" opacity={0.5} />
    <Circle cx={36} cy={28} r={2.5} fill="#F8E080" opacity={0.5} />
    {[10, 16, 22, 28, 34, 40, 46].map((x, i) => (
      <Line key={i} x1={x} y1={42} x2={x} y2={48} stroke="#D86838" strokeWidth={1.2} strokeLinecap="round" />
    ))}
  </Svg>
);

const Ceviche = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="pe_bowl" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8E0D8" />
        <Stop offset="1" stopColor="#C8B8A8" />
      </LinearGradient>
    </Defs>
    <Path d="M8 26 Q8 46 28 46 Q48 46 48 26 Z" fill="url(#pe_bowl)" stroke="#B8A898" strokeWidth={0.8} />
    <Ellipse cx={28} cy={26} rx={20} ry={7} fill="#F8F0E8" />
    <Ellipse cx={24} cy={24} rx={4} ry={2.5} fill="#F8C8B0" />
    <Ellipse cx={34} cy={25} rx={3.5} ry={2} fill="#F8C8B0" />
    <Circle cx={18} cy={26} r={2} fill="#E8E040" opacity={0.6} />
    <Circle cx={38} cy={24} r={1.5} fill="#E8E040" opacity={0.5} />
    <Circle cx={28} cy={22} r={1.5} fill="#E84848" opacity={0.5} />
    <Path d="M20 28 Q24 30 28 28" fill="none" stroke="#68A848" strokeWidth={0.8} />
    <Circle cx={30} cy={28} r={1} fill="#68A848" opacity={0.6} />
  </Svg>
);

const PotatoVarieties = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={16} cy={36} rx={8} ry={6} fill="#C8A060" />
    <Ellipse cx={16} cy={34} rx={5} ry={2.5} fill="#D8B878" opacity={0.4} />
    <Ellipse cx={32} cy={34} rx={7} ry={5.5} fill="#8868A0" />
    <Ellipse cx={32} cy={32} rx={4.5} ry={2.2} fill="#9878B0" opacity={0.4} />
    <Ellipse cx={44} cy={38} rx={6} ry={5} fill="#E8C060" />
    <Ellipse cx={44} cy={36} rx={3.5} ry={2} fill="#F0D078" opacity={0.4} />
    <Ellipse cx={24} cy={22} rx={6.5} ry={5} fill="#D88878" />
    <Ellipse cx={24} cy={20} rx={4} ry={2} fill="#E89888" opacity={0.4} />
    <Ellipse cx={40} cy={24} rx={5.5} ry={4.5} fill="#C8A868" />
    <Ellipse cx={40} cy={22.5} rx={3.5} ry={1.8} fill="#D8B878" opacity={0.4} />
    <Rect x={4} y={44} width={48} height={4} rx={2} fill="#D8C8A0" opacity={0.4} />
  </Svg>
);

const Corn = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M22 8 Q20 28 22 46 Q28 50 34 46 Q36 28 34 8 Z" fill="#E8C848" stroke="#D0B030" strokeWidth={0.8} />
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <G key={i}>
        <Circle cx={25} cy={12 + i * 5} r={2} fill="#F0D858" />
        <Circle cx={28} cy={12 + i * 5} r={2} fill="#F0D858" />
        <Circle cx={31} cy={12 + i * 5} r={2} fill="#E8C040" />
      </G>
    ))}
    <Path d="M22 8 Q18 4 14 8 Q18 12 22 10" fill="#68A848" />
    <Path d="M34 8 Q38 4 42 8 Q38 12 34 10" fill="#68A848" />
    <Path d="M28 6 Q28 2 30 0" fill="none" stroke="#589838" strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

const Quinoa = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M10 28 Q10 46 28 46 Q46 46 46 28 Z" fill="#D8C098" stroke="#C0A878" strokeWidth={0.8} />
    <Ellipse cx={28} cy={28} rx={18} ry={6} fill="#E8D8B8" />
    <Path d="M16 26 Q22 22 28 26 Q34 22 40 26" fill="#F0E0C0" stroke="#D8C8A0" strokeWidth={0.3} />
    {[16, 20, 24, 28, 32, 36, 40].map((x, i) => (
      <G key={i}>
        <Circle cx={x} cy={25 + (i % 3)} r={1} fill="#E8D0A0" />
        <Circle cx={x - 2} cy={27 + (i % 2)} r={0.8} fill="#D8C090" />
      </G>
    ))}
    <Path d="M24 22 Q22 16 24 12" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
    <Path d="M32 22 Q34 14 32 10" fill="none" stroke="#D0D0D0" strokeWidth={0.7} opacity={0.4} />
  </Svg>
);

const Emoliente = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="pe_emo" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8A830" />
        <Stop offset="1" stopColor="#C88820" />
      </LinearGradient>
    </Defs>
    <Path d="M18 18 Q16 42 20 44 L36 44 Q40 42 38 18 Z" fill="#E8D8C8" stroke="#C8B8A0" strokeWidth={0.8} />
    <Ellipse cx={28} cy={18} rx={10} ry={4} fill="#F0E8D8" stroke="#C8B8A0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={20} rx={8} ry={3} fill="url(#pe_emo)" />
    <Path d="M38 26 Q44 24 44 30 Q44 36 38 34" fill="none" stroke="#C8B8A0" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M24 16 Q22 10 24 6" fill="none" stroke="#D8D0C0" strokeWidth={0.7} opacity={0.5} />
    <Path d="M32 16 Q34 8 32 4" fill="none" stroke="#D8D0C0" strokeWidth={0.7} opacity={0.5} />
    <Circle cx={26} cy={22} r={1} fill="#68A040" opacity={0.5} />
  </Svg>
);

const Loom = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={10} y={8} width={4} height={40} rx={1} fill="#A08060" />
    <Rect x={42} y={8} width={4} height={40} rx={1} fill="#A08060" />
    <Rect x={10} y={8} width={36} height={3} rx={1} fill="#B89070" />
    <Rect x={10} y={44} width={36} height={3} rx={1} fill="#B89070" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
      <Line key={i} x1={16 + i * 3.5} y1={11} x2={16 + i * 3.5} y2={44} stroke="#D8C8A0" strokeWidth={0.6} />
    ))}
    <Rect x={14} y={18} width={28} height={4} rx={1} fill="#E85040" opacity={0.7} />
    <Rect x={14} y={24} width={28} height={4} rx={1} fill="#E8A840" opacity={0.7} />
    <Rect x={14} y={30} width={28} height={4} rx={1} fill="#48A0D0" opacity={0.7} />
    <Rect x={14} y={36} width={28} height={4} rx={1} fill="#E85040" opacity={0.7} />
  </Svg>
);

const Quipu = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={4} rx={2} fill="#C8A060" />
    {[14, 22, 30, 38, 46].map((x, i) => {
      const colors = ['#E85040', '#E8A840', '#48A0D0', '#68A848', '#C860A0'];
      const lengths = [32, 26, 36, 24, 30];
      return (
        <G key={i}>
          <Line x1={x} y1={12} x2={x} y2={12 + lengths[i]} stroke={colors[i]} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={x} cy={18 + i * 2} r={1.5} fill={colors[i]} />
          <Circle cx={x} cy={26 + i * 1.5} r={1.5} fill={colors[i]} />
          {i < 3 && <Circle cx={x} cy={34 + i} r={1.5} fill={colors[i]} />}
        </G>
      );
    })}
  </Svg>
);

const AlpacaWool = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={18} cy={34} r={10} fill="#F0E0C8" />
    <Circle cx={18} cy={32} r={6} fill="#F8ECD8" opacity={0.5} />
    <Path d="M18 24 Q22 18 18 12" fill="none" stroke="#E8D8C0" strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx={38} cy={28} r={9} fill="#E8A8A8" />
    <Circle cx={38} cy={26} r={5.5} fill="#F0B8B8" opacity={0.5} />
    <Path d="M38 19 Q42 14 38 8" fill="none" stroke="#E09898" strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx={28} cy={42} r={8} fill="#A8C8E8" />
    <Circle cx={28} cy={40} r={5} fill="#B8D8F0" opacity={0.5} />
    <Path d="M28 34 Q32 28 28 22" fill="none" stroke="#98B8D8" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const ChulloHat = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Path d="M12 32 Q12 14 28 10 Q44 14 44 32 Z" fill="#E85040" />
    <Rect x={12} y={30} width={32} height={6} rx={1} fill="#E8A040" />
    <Rect x={12} y={36} width={32} height={6} rx={1} fill="#48A0D0" />
    <Rect x={12} y={42} width={32} height={4} rx={1} fill="#E85040" />
    <Path d="M12 36 L8 48" stroke="#E85040" strokeWidth={3} strokeLinecap="round" />
    <Path d="M44 36 L48 48" stroke="#E85040" strokeWidth={3} strokeLinecap="round" />
    <Circle cx={8} cy={50} r={3} fill="#F8E848" />
    <Circle cx={48} cy={50} r={3} fill="#F8E848" />
    <Circle cx={28} cy={8} r={3} fill="#F8E848" />
    <Path d="M18 32 L20 30 L22 32 L24 30 L26 32 L28 30 L30 32 L32 30 L34 32 L36 30 L38 32" fill="none" stroke="#F8F0E0" strokeWidth={0.8} />
  </Svg>
);

const IncaTrailMap = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M20 14 Q16 20 18 28 Q20 34 16 38 Q14 42 20 44 Q28 46 34 42 Q40 38 38 30 Q36 24 38 18 Q36 14 30 12 Q24 10 20 14 Z" fill="#A8D8A0" stroke="#78A870" strokeWidth={0.8} />
    <Path d="M24 18 Q28 22 30 28 Q32 34 28 38" fill="none" stroke="#D8A050" strokeWidth={1.2} strokeDasharray="2 2" />
    <Circle cx={24} cy={18} r={1.5} fill="#E84860" />
    <Circle cx={28} cy={38} r={1.5} fill="#E84860" />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const peIllustrations: Record<string, React.FC<{ size?: number }>> = {
  pe_l1: MachuPicchuModel,
  pe_l2: AlpacaBlanket,
  pe_l3: PanFlute,
  pe_l4: LlamaFigure,
  pe_l5: WovenRug,
  pe_k1: Ceviche,
  pe_k2: PotatoVarieties,
  pe_k3: Corn,
  pe_k4: Quinoa,
  pe_k5: Emoliente,
  pe_w1: Loom,
  pe_w2: Quipu,
  pe_w3: AlpacaWool,
  pe_w4: ChulloHat,
  pe_w5: IncaTrailMap,
};
