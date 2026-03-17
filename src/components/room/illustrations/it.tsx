import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const ColosseumModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="col_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F0E0C8" />
        <Stop offset="1" stopColor="#D8C8A8" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={44} rx={22} ry={6} fill="#E8D8C0" />
    <Path d="M10 22 Q10 44 28 44 Q46 44 46 22" fill="url(#col_g)" stroke="#C8B898" strokeWidth={0.8} />
    <Ellipse cx={28} cy={22} rx={18} ry={6} fill="#E8D8C0" stroke="#C8B898" strokeWidth={0.8} />
    {[14, 20, 26, 32, 38].map((x, i) => (
      <G key={i}>
        <Rect x={x} y={24} width={3} height={8} rx={1.5} fill="none" stroke="#C8B090" strokeWidth={0.7} />
        <Rect x={x} y={34} width={3} height={7} rx={1.5} fill="none" stroke="#C8B090" strokeWidth={0.7} />
      </G>
    ))}
    <Line x1={12} y1={32} x2={44} y2={32} stroke="#C8B898" strokeWidth={0.6} />
  </Svg>
);

export const VeniceMask = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="mask_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F0D860" />
        <Stop offset="1" stopColor="#D8B830" />
      </LinearGradient>
    </Defs>
    <Path d="M10 24 Q10 14 28 12 Q46 14 46 24 Q46 36 28 38 Q10 36 10 24 Z" fill="url(#mask_g)" stroke="#C8A020" strokeWidth={1} />
    <Ellipse cx={20} cy={24} rx={5} ry={4} fill="#1A1A2E" />
    <Ellipse cx={36} cy={24} rx={5} ry={4} fill="#1A1A2E" />
    <Ellipse cx={20} cy={23} rx={3} ry={2} fill="#2A2A3E" opacity={0.5} />
    <Ellipse cx={36} cy={23} rx={3} ry={2} fill="#2A2A3E" opacity={0.5} />
    <Path d="M24 28 Q28 30 32 28" fill="none" stroke="#C8A020" strokeWidth={0.8} />
    <Path d="M14 16 Q10 10 6 8" fill="none" stroke="#C8A020" strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx={6} cy={8} r={2} fill="#E84860" />
    <Path d="M42 16 Q46 10 50 8" fill="none" stroke="#C8A020" strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx={50} cy={8} r={2} fill="#4880E8" />
    <Path d="M16 18 Q20 16 24 18" fill="none" stroke="#D8C040" strokeWidth={0.5} />
    <Path d="M32 18 Q36 16 40 18" fill="none" stroke="#D8C040" strokeWidth={0.5} />
    <Rect x={6} y={36} width={3} height={14} rx={1.5} fill="#C8A878" transform="rotate(-15, 6, 36)" />
  </Svg>
);

export const VintageSofa = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="sofa_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C83848" />
        <Stop offset="1" stopColor="#A02838" />
      </LinearGradient>
    </Defs>
    <Rect x={6} y={22} width={44} height={20} rx={4} fill="url(#sofa_g)" />
    <Path d="M8 22 Q8 14 14 14 L42 14 Q48 14 48 22" fill="#D84858" />
    <Rect x={4} y={24} width={6} height={14} rx={3} fill="#B83040" />
    <Rect x={46} y={24} width={6} height={14} rx={3} fill="#B83040" />
    <Path d="M14 28 Q20 26 28 28 Q36 26 42 28" fill="none" stroke="#A02030" strokeWidth={0.6} />
    <Circle cx={18} cy={20} r={2} fill="#D84858" />
    <Circle cx={38} cy={20} r={2} fill="#D84858" />
    <Rect x={10} y={42} width={4} height={6} rx={1} fill="#8B6848" />
    <Rect x={42} y={42} width={4} height={6} rx={1} fill="#8B6848" />
  </Svg>
);

export const Violin = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="vio_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C88040" />
        <Stop offset="1" stopColor="#A06830" />
      </LinearGradient>
    </Defs>
    <Rect x={27} y={4} width={2} height={14} rx={1} fill="#8B6848" />
    <Rect x={24} y={4} width={8} height={3} rx={1} fill="#A07848" />
    <Line x1={25} y1={4} x2={25} y2={7} stroke="#D8C0A0" strokeWidth={0.5} />
    <Line x1={31} y1={4} x2={31} y2={7} stroke="#D8C0A0" strokeWidth={0.5} />
    <Path d="M22 18 Q18 22 18 28 Q18 32 22 34 Q20 36 20 38 Q20 42 24 44 Q28 46 32 44 Q36 42 36 38 Q36 36 34 34 Q38 32 38 28 Q38 22 34 18 Z" fill="url(#vio_g)" stroke="#906828" strokeWidth={0.8} />
    <Path d="M22 34 Q28 32 34 34" fill="none" stroke="#906828" strokeWidth={0.6} />
    <Path d="M22 18 Q28 20 34 18" fill="none" stroke="#906828" strokeWidth={0.6} />
    <Ellipse cx={25} cy={30} rx={1.5} ry={2} fill="#704820" />
    <Ellipse cx={31} cy={30} rx={1.5} ry={2} fill="#704820" />
    <Rect x={27} y={22} width={2} height={18} rx={0.5} fill="#D8B878" />
    <Line x1={26} y1={18} x2={26} y2={44} stroke="#E8D8C0" strokeWidth={0.3} />
    <Line x1={28} y1={18} x2={28} y2={44} stroke="#E8D8C0" strokeWidth={0.3} />
    <Line x1={30} y1={18} x2={30} y2={44} stroke="#E8D8C0" strokeWidth={0.3} />
    <Rect x={8} y={10} width={2} height={40} rx={1} fill="#A07848" transform="rotate(-20, 8, 10)" />
  </Svg>
);

export const OrnateClock = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="clk_g" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0" stopColor="#FFF8F0" />
        <Stop offset="1" stopColor="#F0E8D8" />
      </RadialGradient>
    </Defs>
    <Circle cx={28} cy={28} r={22} fill="#D8A040" />
    <Circle cx={28} cy={28} r={20} fill="url(#clk_g)" stroke="#C89030" strokeWidth={1} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
      const a = (i * 30 - 90) * Math.PI / 180;
      return <Circle key={i} cx={28 + 16 * Math.cos(a)} cy={28 + 16 * Math.sin(a)} r={1.2} fill="#8B6848" />;
    })}
    <Line x1={28} y1={28} x2={28} y2={14} stroke="#4A3828" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={28} y1={28} x2={38} y2={24} stroke="#4A3828" strokeWidth={1.2} strokeLinecap="round" />
    <Circle cx={28} cy={28} r={2} fill="#C89030" />
    <Path d="M22 6 Q28 2 34 6" fill="none" stroke="#D8A040" strokeWidth={2} strokeLinecap="round" />
    <Circle cx={28} cy={3} r={2} fill="#D8A040" />
  </Svg>
);

export const Pizza = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="piz_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8D868" />
        <Stop offset="1" stopColor="#E8C048" />
      </LinearGradient>
    </Defs>
    <Path d="M28 6 L6 48 L50 48 Z" fill="url(#piz_g)" stroke="#D8A838" strokeWidth={1} />
    <Path d="M8 44 Q28 40 48 44 L50 48 L6 48 Z" fill="#D8A030" />
    <Ellipse cx={24} cy={28} rx={3.5} ry={3} fill="#E84040" opacity={0.85} />
    <Ellipse cx={34} cy={32} rx={3} ry={2.8} fill="#E84040" opacity={0.85} />
    <Ellipse cx={28} cy={38} rx={3.2} ry={3} fill="#E84040" opacity={0.85} />
    <Circle cx={20} cy={36} r={1.5} fill="#48A040" opacity={0.7} />
    <Circle cx={36} cy={40} r={1.2} fill="#48A040" opacity={0.7} />
    <Circle cx={30} cy={24} r={1.5} fill="#2A2A2A" opacity={0.4} />
    <Circle cx={22} cy={42} r={1} fill="#2A2A2A" opacity={0.4} />
    <Path d="M28 6 L6 48" fill="none" stroke="#D8A838" strokeWidth={0.8} />
    <Path d="M28 6 L50 48" fill="none" stroke="#D8A838" strokeWidth={0.8} />
  </Svg>
);

export const Pasta = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="pst_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F0E8E0" />
        <Stop offset="1" stopColor="#D8C8B8" />
      </LinearGradient>
    </Defs>
    <Path d="M8 26 Q8 46 28 46 Q48 46 48 26 Z" fill="url(#pst_g)" stroke="#C8B8A0" strokeWidth={1} />
    <Ellipse cx={28} cy={26} rx={20} ry={6} fill="#F8E8A0" />
    <Path d="M16 24 Q22 30 28 24 Q34 18 40 24" fill="none" stroke="#E8D080" strokeWidth={1.5} />
    <Path d="M14 26 Q20 32 28 26 Q36 20 42 26" fill="none" stroke="#E8D080" strokeWidth={1.2} opacity={0.6} />
    <Path d="M18 22 Q24 28 30 22 Q36 16 40 22" fill="none" stroke="#E8D080" strokeWidth={1} opacity={0.4} />
    <Circle cx={28} cy={22} r={3.5} fill="#D83030" opacity={0.7} />
    <Circle cx={24} cy={24} r={2} fill="#D83030" opacity={0.5} />
    <Circle cx={32} cy={24} r={2} fill="#D83030" opacity={0.5} />
    <Circle cx={22} cy={20} r={1} fill="#48A040" opacity={0.6} />
    <Circle cx={35} cy={21} r={1.2} fill="#48A040" opacity={0.6} />
  </Svg>
);

export const Garlic = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={34} rx={14} ry={14} fill="#F8F0E8" stroke="#E0D8C8" strokeWidth={0.8} />
    <Path d="M20 28 Q20 18 28 16 Q36 18 36 28" fill="#F0E8E0" stroke="#E0D8C8" strokeWidth={0.5} />
    <Path d="M24 28 Q24 20 28 18 Q32 20 32 28" fill="#F8F0E8" stroke="#E0D0C0" strokeWidth={0.4} />
    <Path d="M28 16 L26 8 Q28 6 30 8 Z" fill="#B8C890" />
    <Line x1={28} y1={22} x2={28} y2={40} stroke="#E8D8C8" strokeWidth={0.5} />
    <Line x1={20} y1={30} x2={20} y2={42} stroke="#E8D8C8" strokeWidth={0.4} opacity={0.6} />
    <Line x1={36} y1={30} x2={36} y2={42} stroke="#E8D8C8" strokeWidth={0.4} opacity={0.6} />
    <Ellipse cx={28} cy={35} rx={12} ry={12} fill="none" stroke="#D8C8B8" strokeWidth={0.5} />
  </Svg>
);

export const OliveOil = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="oil_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D8C840" />
        <Stop offset="1" stopColor="#B8A830" />
      </LinearGradient>
    </Defs>
    <Rect x={18} y={20} width={20} height={28} rx={3} fill="#D8E8D0" stroke="#A8C098" strokeWidth={0.8} />
    <Rect x={20} y={24} width={16} height={20} rx={2} fill="url(#oil_g)" opacity={0.6} />
    <Rect x={24} y={8} width={8} height={12} rx={2} fill="#D8E8D0" stroke="#A8C098" strokeWidth={0.8} />
    <Rect x={23} y={6} width={10} height={4} rx={2} fill="#A08060" />
    <Rect x={22} y={30} width={12} height={8} rx={1} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={0.5} />
    <Circle cx={28} cy={33} r={2} fill="#68A848" opacity={0.7} />
    <Ellipse cx={32} cy={26} rx={2} ry={4} fill="#E8D850" opacity={0.3} />
  </Svg>
);

export const Gelato = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={14} y={28} width={28} height={20} rx={4} fill="#F8E8D8" stroke="#E0D0C0" strokeWidth={0.8} />
    <Ellipse cx={22} cy={24} rx={8} ry={8} fill="#F8A0B0" />
    <Ellipse cx={22} cy={22} rx={5} ry={3} fill="#F8B8C0" opacity={0.5} />
    <Ellipse cx={34} cy={24} rx={8} ry={8} fill="#90D878" />
    <Ellipse cx={34} cy={22} rx={5} ry={3} fill="#A8E890" opacity={0.5} />
    <Ellipse cx={28} cy={18} rx={7} ry={7} fill="#F8E088" />
    <Ellipse cx={28} cy={16} rx={4} ry={2.5} fill="#F8E8A0" opacity={0.6} />
    <Rect x={14} y={28} width={28} height={3} rx={1} fill="#E8D8C0" />
    <Circle cx={20} cy={36} r={1} fill="#E88080" opacity={0.6} />
    <Circle cx={36} cy={38} r={0.8} fill="#E88080" opacity={0.5} />
  </Svg>
);

export const SunsetView = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="sun_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F8A848" />
        <Stop offset="0.5" stopColor="#F88060" />
        <Stop offset="1" stopColor="#D06080" />
      </LinearGradient>
    </Defs>
    <Rect x={4} y={4} width={48} height={48} rx={4} fill="url(#sun_g)" />
    <Circle cx={28} cy={30} r={10} fill="#F8D060" opacity={0.8} />
    <Circle cx={28} cy={30} r={7} fill="#F8E080" opacity={0.6} />
    <Path d="M4 34 Q14 30 28 34 Q42 38 52 34 L52 52 L4 52 Z" fill="#306088" opacity={0.4} />
    <Path d="M4 38 Q16 34 28 38 Q40 42 52 38 L52 52 L4 52 Z" fill="#284870" opacity={0.5} />
    {[10, 18, 38, 46].map((x, i) => (
      <Ellipse key={i} cx={x} cy={8 + i * 2} rx={4} ry={1.5} fill="#F8C878" opacity={0.3} />
    ))}
  </Svg>
);

export const LemonTree = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={25} y={32} width={6} height={18} rx={2} fill="#A08060" />
    <Path d="M28 32 Q14 32 12 24 Q10 14 20 10 Q28 4 36 10 Q46 14 44 24 Q42 32 28 32 Z" fill="#48A040" />
    <Circle cx={18} cy={18} r={3.5} fill="#F8E040" />
    <Ellipse cx={18} cy={17} rx={2} ry={1} fill="#F8E868" opacity={0.6} />
    <Circle cx={36} cy={16} r={3} fill="#F8E040" />
    <Ellipse cx={36} cy={15} rx={1.8} ry={0.8} fill="#F8E868" opacity={0.6} />
    <Circle cx={28} cy={12} r={2.8} fill="#F8E040" />
    <Circle cx={24} cy={26} r={2.5} fill="#F8E040" />
    <Circle cx={34} cy={24} r={2.2} fill="#F8E040" />
    <Circle cx={20} cy={24} r={2} fill="#58B048" opacity={0.5} />
    <Circle cx={32} cy={28} r={1.8} fill="#58B048" opacity={0.4} />
    <Rect x={20} y={48} width={16} height={5} rx={2} fill="#C8A878" />
  </Svg>
);

export const GondolaModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={42} rx={24} ry={4} fill="#88C8E0" opacity={0.3} />
    <Path d="M4 36 Q4 32 12 32 L44 32 Q52 32 52 36 Q52 40 44 40 L12 40 Q4 40 4 36 Z" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth={0.8} />
    <Path d="M4 36 Q2 34 4 32" fill="none" stroke="#1A1A1A" strokeWidth={1} />
    <Path d="M52 36 Q56 34 54 30 Q52 28 50 30" fill="none" stroke="#1A1A1A" strokeWidth={1.2} strokeLinecap="round" />
    <Rect x={24} y={18} width={2} height={14} rx={1} fill="#A07848" />
    <Path d="M26 18 Q34 16 34 20 L26 22 Z" fill="#E84040" opacity={0.8} />
    <Path d="M14 32 Q14 28 18 28 L22 28 Q22 32 18 32" fill="#C8A060" opacity={0.5} />
    <Line x1={12} y1={36} x2={44} y2={36} stroke="#3A3A3A" strokeWidth={0.4} />
  </Svg>
);

export const Pottery = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="pot_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8A060" />
        <Stop offset="1" stopColor="#C87840" />
      </LinearGradient>
    </Defs>
    <Path d="M18 18 Q14 28 16 38 Q18 46 28 46 Q38 46 40 38 Q42 28 38 18 Z" fill="url(#pot_g)" stroke="#B06830" strokeWidth={0.8} />
    <Ellipse cx={28} cy={18} rx={10} ry={4} fill="#D89050" stroke="#B06830" strokeWidth={0.8} />
    <Ellipse cx={28} cy={18} rx={7} ry={2.5} fill="#C87840" opacity={0.4} />
    <Path d="M18 28 Q22 26 28 28 Q34 30 38 28" fill="none" stroke="#F8D080" strokeWidth={0.8} />
    <Path d="M18 34 Q22 32 28 34 Q34 36 38 34" fill="none" stroke="#F8D080" strokeWidth={0.8} />
    <Circle cx={22} cy={31} r={1.5} fill="#F8D080" opacity={0.5} />
    <Circle cx={34} cy={31} r={1.5} fill="#F8D080" opacity={0.5} />
    <Circle cx={28} cy={40} r={1.2} fill="#F8D080" opacity={0.4} />
  </Svg>
);

export const Herbs = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={16} y={32} width={24} height={18} rx={3} fill="#D08848" stroke="#B87038" strokeWidth={0.8} />
    <Ellipse cx={28} cy={32} rx={12} ry={2} fill="#C07838" />
    <Rect x={18} y={48} width={20} height={4} rx={1} fill="#E0A060" />
    <Path d="M22 32 Q20 22 22 14" stroke="#48A040" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <Path d="M28 32 Q28 20 28 10" stroke="#58B048" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <Path d="M34 32 Q36 22 34 14" stroke="#48A040" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <Ellipse cx={20} cy={14} rx={3} ry={4} fill="#68B850" opacity={0.8} />
    <Ellipse cx={28} cy={10} rx={3} ry={4} fill="#78C860" opacity={0.8} />
    <Ellipse cx={36} cy={14} rx={3} ry={4} fill="#68B850" opacity={0.8} />
    <Ellipse cx={24} cy={18} rx={2.5} ry={3} fill="#58A848" opacity={0.6} />
    <Ellipse cx={32} cy={16} rx={2.5} ry={3} fill="#58A848" opacity={0.6} />
  </Svg>
);

export const DaVinciNotebook = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={6} y={10} width={22} height={36} rx={2} fill="#F0E8D0" stroke="#D0C0A0" strokeWidth={0.8} />
    <Rect x={28} y={10} width={22} height={36} rx={2} fill="#F8F0E0" stroke="#D0C0A0" strokeWidth={0.8} />
    <Line x1={28} y1={10} x2={28} y2={46} stroke="#C8B890" strokeWidth={1} />
    <Circle cx={18} cy={26} r={6} fill="none" stroke="#8B6848" strokeWidth={0.6} />
    <Line x1={12} y1={26} x2={24} y2={26} stroke="#8B6848" strokeWidth={0.4} />
    <Line x1={18} y1={20} x2={18} y2={32} stroke="#8B6848" strokeWidth={0.4} />
    <Path d="M14 22 L22 30" fill="none" stroke="#8B6848" strokeWidth={0.3} />
    <Path d="M14 30 L22 22" fill="none" stroke="#8B6848" strokeWidth={0.3} />
    {[16, 20, 24, 28, 32, 36].map(y => (
      <Line key={y} x1={32} y1={y} x2={46} y2={y} stroke="#C8C0B0" strokeWidth={0.3} />
    ))}
    <Path d="M34 18 Q38 16 42 18 Q40 20 38 22" fill="none" stroke="#8B6848" strokeWidth={0.5} />
    <Path d="M34 26 L42 26 L42 32 L34 32" fill="none" stroke="#8B6848" strokeWidth={0.4} />
  </Svg>
);

export const DavidStatue = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={18} y={44} width={20} height={6} rx={2} fill="#D0C8C0" />
    <Rect x={22} y={40} width={12} height={6} rx={1} fill="#E0D8D0" />
    <Ellipse cx={28} cy={18} rx={5} ry={6} fill="#F0E8E0" />
    <Path d="M24 14 Q28 10 32 14" fill="#E0D8C8" />
    <Circle cx={26} cy={18} r={0.8} fill="#A09888" />
    <Circle cx={30} cy={18} r={0.8} fill="#A09888" />
    <Path d="M26 20 Q28 21 30 20" fill="none" stroke="#B0A898" strokeWidth={0.5} />
    <Path d="M24 24 L24 32 Q24 36 26 38 L26 40" fill="none" stroke="#E0D8D0" strokeWidth={4} strokeLinecap="round" />
    <Path d="M32 24 L32 32 Q32 36 30 38 L30 40" fill="none" stroke="#E0D8D0" strokeWidth={4} strokeLinecap="round" />
    <Rect x={24} y={24} width={8} height={10} rx={2} fill="#E8E0D8" />
    <Path d="M24 28 L18 32" stroke="#E0D8D0" strokeWidth={3} strokeLinecap="round" />
    <Path d="M32 26 L38 22" stroke="#E0D8D0" strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

export const FerrariModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="fer_g" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#E83030" />
        <Stop offset="1" stopColor="#D02020" />
      </LinearGradient>
    </Defs>
    <Path d="M8 32 L14 24 Q20 20 32 20 L42 22 Q48 24 50 32 Z" fill="url(#fer_g)" />
    <Rect x={6} y={32} width={46} height={8} rx={3} fill="#D02828" />
    <Path d="M14 24 Q18 22 28 22 L28 32 L14 32 Z" fill="#A8D8F0" opacity={0.5} />
    <Path d="M28 22 L40 23 Q44 24 46 32 L28 32 Z" fill="#90C8E0" opacity={0.4} />
    <Circle cx={16} cy={40} r={5} fill="#3A3A3A" />
    <Circle cx={16} cy={40} r={3} fill="#5A5A5A" />
    <Circle cx={16} cy={40} r={1} fill="#8A8A8A" />
    <Circle cx={42} cy={40} r={5} fill="#3A3A3A" />
    <Circle cx={42} cy={40} r={3} fill="#5A5A5A" />
    <Circle cx={42} cy={40} r={1} fill="#8A8A8A" />
    <Circle cx={10} cy={30} r={1.5} fill="#F8E848" />
    <Circle cx={48} cy={30} r={1.5} fill="#E84040" />
  </Svg>
);

export const Football = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx={28} cy={28} r={18} fill="#F8F8F8" stroke="#D0D0D0" strokeWidth={1} />
    <Path d="M28 10 L22 18 L28 24 L34 18 Z" fill="#2A2A2A" />
    <Path d="M12 22 L14 30 L22 30 L22 18 Z" fill="#2A2A2A" />
    <Path d="M44 22 L42 30 L34 30 L34 18 Z" fill="#2A2A2A" />
    <Path d="M16 38 L22 30 L28 36 L22 44 Z" fill="#2A2A2A" />
    <Path d="M40 38 L34 30 L28 36 L34 44 Z" fill="#2A2A2A" />
    <Circle cx={28} cy={28} r={18} fill="none" stroke="#C8C8C8" strokeWidth={0.8} />
    <Ellipse cx={22} cy={14} rx={3} ry={1.5} fill="#FFFFFF" opacity={0.4} />
  </Svg>
);

export const RomanMap = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="rmap_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F8F0D8" />
        <Stop offset="1" stopColor="#E8D8B8" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={10} cy={28} rx={4} ry={18} fill="#E0D0B0" />
    <Ellipse cx={46} cy={28} rx={4} ry={18} fill="#E0D0B0" />
    <Rect x={10} y={10} width={36} height={36} fill="url(#rmap_g)" />
    <Rect x={10} y={10} width={36} height={36} fill="none" stroke="#C8B890" strokeWidth={0.5} />
    <Path d="M20 18 L24 22 L20 28 L26 32 L22 38" fill="none" stroke="#B08040" strokeWidth={1} />
    <Path d="M32 16 L36 24 L32 30 L38 36" fill="none" stroke="#B08040" strokeWidth={0.8} opacity={0.6} />
    <Circle cx={24} cy={22} r={2} fill="#C83030" opacity={0.6} />
    <Circle cx={32} cy={30} r={1.5} fill="#C83030" opacity={0.5} />
    <Circle cx={26} cy={32} r={1.5} fill="#C83030" opacity={0.4} />
    <Path d="M14 42 L18 42" stroke="#C8B890" strokeWidth={0.4} />
    <Path d="M14 14 L18 14" stroke="#C8B890" strokeWidth={0.4} />
    <Rect x={8} y={10} width={4} height={4} rx={2} fill="#C8A878" />
    <Rect x={8} y={42} width={4} height={4} rx={2} fill="#C8A878" />
    <Rect x={44} y={10} width={4} height={4} rx={2} fill="#C8A878" />
    <Rect x={44} y={42} width={4} height={4} rx={2} fill="#C8A878" />
  </Svg>
);

export const itIllustrations: Record<string, React.FC<{ size?: number }>> = {
  it_l1: ColosseumModel,
  it_l2: VeniceMask,
  it_l3: VintageSofa,
  it_l4: Violin,
  it_l5: OrnateClock,
  it_k1: Pizza,
  it_k2: Pasta,
  it_k3: Garlic,
  it_k4: OliveOil,
  it_k5: Gelato,
  it_t1: SunsetView,
  it_t2: LemonTree,
  it_t3: GondolaModel,
  it_t4: Pottery,
  it_t5: Herbs,
  it_s1: DaVinciNotebook,
  it_s2: DavidStatue,
  it_s3: FerrariModel,
  it_s4: Football,
  it_s5: RomanMap,
};
