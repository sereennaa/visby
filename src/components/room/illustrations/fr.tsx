import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const S = 56;

export const EiffelTowerModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="eiffel_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#B0A898" />
        <Stop offset="1" stopColor="#887868" />
      </LinearGradient>
    </Defs>
    <Path d="M28 4 L22 22 L18 48 L14 52 L42 52 L38 48 L34 22 Z" fill="url(#eiffel_g)" />
    <Rect x={20} y={18} width={16} height={3} rx={1} fill="#C8B8A8" />
    <Rect x={22} y={32} width={12} height={2.5} rx={1} fill="#C8B8A8" />
    <Path d="M24 22 L24 32" stroke="#A09080" strokeWidth={0.6} opacity={0.5} />
    <Path d="M28 22 L28 32" stroke="#A09080" strokeWidth={0.6} opacity={0.5} />
    <Path d="M32 22 L32 32" stroke="#A09080" strokeWidth={0.6} opacity={0.5} />
    <Path d="M20 38 L36 38" stroke="#A09080" strokeWidth={0.5} opacity={0.4} />
    <Path d="M18 44 L38 44" stroke="#A09080" strokeWidth={0.5} opacity={0.4} />
    <Ellipse cx={28} cy={12} rx={2} ry={1} fill="#D8C8A0" opacity={0.5} />
    <Line x1={28} y1={2} x2={28} y2={6} stroke="#887868" strokeWidth={1.2} strokeLinecap="round" />
    <Rect x={12} y={50} width={32} height={4} rx={1.5} fill="#A09888" />
  </Svg>
);

export const Painting = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={10} y={10} width={36} height={30} rx={1} fill="#C8A060" stroke="#A08040" strokeWidth={1.5} />
    <Rect x={13} y={13} width={30} height={24} rx={0.5} fill="#F0EDE8" />
    <Path d="M13 30 Q22 20 30 28 Q38 34 43 24" fill="none" stroke="#6080C0" strokeWidth={1.5} opacity={0.7} />
    <Circle cx={22} cy={22} r={4} fill="#E8A060" opacity={0.6} />
    <Circle cx={34} cy={20} r={3} fill="#D06080" opacity={0.5} />
    <Path d="M16 32 Q24 26 32 30 Q38 32 43 28" fill="#88B8A0" opacity={0.3} />
    <Circle cx={28} cy={26} r={2.5} fill="#E8C848" opacity={0.4} />
    <Line x1={28} y1={6} x2={28} y2={10} stroke="#A08040" strokeWidth={1} />
    <Circle cx={28} cy={5} r={1.5} fill="#C8A060" />
  </Svg>
);

export const Chandelier = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <RadialGradient id="ch_glow" cx="0.5" cy="0.4" r="0.5">
        <Stop offset="0" stopColor="#FFF8E0" />
        <Stop offset="1" stopColor="#F8E8C0" stopOpacity={0} />
      </RadialGradient>
    </Defs>
    <Line x1={28} y1={2} x2={28} y2={14} stroke="#C8A870" strokeWidth={1.2} />
    <Circle cx={28} cy={28} r={18} fill="url(#ch_glow)" opacity={0.3} />
    <Ellipse cx={28} cy={16} rx={10} ry={3} fill="#D8C088" stroke="#C8A870" strokeWidth={0.8} />
    <Path d="M18 16 Q16 24 14 28" stroke="#C8A870" strokeWidth={1} fill="none" />
    <Path d="M38 16 Q40 24 42 28" stroke="#C8A870" strokeWidth={1} fill="none" />
    <Path d="M28 19 L28 30" stroke="#C8A870" strokeWidth={0.8} />
    {[14, 28, 42].map((x, i) => (
      <G key={i}>
        <Ellipse cx={x} cy={30} rx={3} ry={4} fill="#FFF0C8" opacity={0.7} />
        <Ellipse cx={x} cy={29} rx={1.5} ry={2} fill="#FFFAE0" opacity={0.8} />
      </G>
    ))}
    <Path d="M14 32 Q16 36 18 34" stroke="#D8C898" strokeWidth={0.5} opacity={0.4} />
    <Path d="M42 32 Q40 36 38 34" stroke="#D8C898" strokeWidth={0.5} opacity={0.4} />
    <Path d="M28 34 Q30 38 32 36" stroke="#D8C898" strokeWidth={0.5} opacity={0.4} />
    <Path d="M28 34 Q26 38 24 36" stroke="#D8C898" strokeWidth={0.5} opacity={0.4} />
  </Svg>
);

export const Bookshelf = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={6} width={40} height={46} rx={2} fill="#C8A070" stroke="#A08050" strokeWidth={1} />
    <Rect x={8} y={24} width={40} height={2} fill="#B09060" />
    <Rect x={8} y={42} width={40} height={2} fill="#B09060" />
    <Rect x={12} y={10} width={6} height={14} rx={1} fill="#D83848" />
    <Rect x={19} y={8} width={5} height={16} rx={1} fill="#4870C8" />
    <Rect x={25} y={11} width={6} height={13} rx={1} fill="#48A868" />
    <Rect x={32} y={9} width={5} height={15} rx={1} fill="#E8A848" />
    <Rect x={38} y={10} width={6} height={14} rx={1} fill="#9868C8" />
    <Rect x={12} y={26} width={7} height={16} rx={1} fill="#E87858" />
    <Rect x={20} y={28} width={5} height={14} rx={1} fill="#58A0D8" />
    <Rect x={26} y={27} width={6} height={15} rx={1} fill="#D8C848" />
    <Rect x={33} y={26} width={5} height={16} rx={1} fill="#C86888" />
    <Rect x={39} y={28} width={6} height={14} rx={1} fill="#68B888" />
    <Rect x={14} y={44} width={10} height={6} rx={1} fill="#D06848" />
    <Rect x={26} y={45} width={8} height={5} rx={1} fill="#5880B8" />
    <Rect x={36} y={44} width={7} height={6} rx={1} fill="#A8D068" />
  </Svg>
);

export const Roses = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="rose_v" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#C8E8F0" />
        <Stop offset="1" stopColor="#A0C8D8" />
      </LinearGradient>
    </Defs>
    <Path d="M20 34 Q20 50 28 50 Q36 50 36 34 Z" fill="url(#rose_v)" stroke="#88B0C0" strokeWidth={0.8} />
    <Ellipse cx={28} cy={34} rx={8} ry={3} fill="#B0D8E0" />
    <Line x1={22} y1={32} x2={18} y2={16} stroke="#58A050" strokeWidth={1.5} />
    <Line x1={28} y1={32} x2={28} y2={12} stroke="#58A050" strokeWidth={1.5} />
    <Line x1={34} y1={32} x2={36} y2={18} stroke="#58A050" strokeWidth={1.5} />
    <G>
      <Circle cx={18} cy={14} r={5} fill="#E83848" />
      <Path d="M16 14 Q18 10 20 14 Q18 12 16 14 Z" fill="#D02838" />
      <Circle cx={18} cy={12} r={2} fill="#F04858" opacity={0.5} />
    </G>
    <G>
      <Circle cx={28} cy={10} r={5.5} fill="#E84050" />
      <Path d="M26 10 Q28 6 30 10 Q28 8 26 10 Z" fill="#D03040" />
      <Circle cx={28} cy={8} r={2.2} fill="#F05060" opacity={0.5} />
    </G>
    <G>
      <Circle cx={36} cy={16} r={4.5} fill="#E83848" />
      <Path d="M34 16 Q36 12 38 16 Q36 14 34 16 Z" fill="#D02838" />
      <Circle cx={36} cy={14} r={1.8} fill="#F04858" opacity={0.5} />
    </G>
    <Path d="M24 24 Q22 22 20 24" fill="#68A858" />
    <Path d="M32 26 Q34 24 36 26" fill="#68A858" />
  </Svg>
);

export const Croissants = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="crois_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F0D090" />
        <Stop offset="1" stopColor="#D8A860" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={42} rx={18} ry={4} fill="#F0E8D8" opacity={0.4} />
    <Path d="M12 32 Q8 24 16 20 Q22 16 28 22 Q34 16 40 20 Q48 24 44 32 Q40 38 28 38 Q16 38 12 32 Z" fill="url(#crois_g)" stroke="#C89848" strokeWidth={0.8} />
    <Path d="M20 22 Q24 28 28 24 Q32 28 36 22" fill="none" stroke="#C89040" strokeWidth={0.8} opacity={0.5} />
    <Path d="M16 26 Q22 32 28 28 Q34 32 40 26" fill="none" stroke="#C89040" strokeWidth={0.6} opacity={0.4} />
    <Ellipse cx={22} cy={26} rx={4} ry={2} fill="#F8E0A0" opacity={0.4} />
    <Ellipse cx={34} cy={26} rx={4} ry={2} fill="#F8E0A0" opacity={0.4} />
    <Circle cx={28} cy={28} r={1.5} fill="#E8C070" opacity={0.3} />
  </Svg>
);

export const CheeseBoard = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={44} rx={22} ry={6} fill="#C8A870" stroke="#A88850" strokeWidth={0.8} />
    <Ellipse cx={28} cy={42} rx={20} ry={5} fill="#D8B880" />
    <G>
      <Path d="M14 36 L26 36 L20 24 Z" fill="#F8E880" stroke="#E8D060" strokeWidth={0.5} />
      <Circle cx={18} cy={32} r={1} fill="#E8D060" />
      <Circle cx={21} cy={34} r={0.8} fill="#E8D060" />
    </G>
    <G>
      <Ellipse cx={34} cy={34} rx={8} ry={5} fill="#F8F0D0" stroke="#E8D8A0" strokeWidth={0.5} />
      <Ellipse cx={34} cy={32} rx={5} ry={2} fill="#FFF8E0" opacity={0.5} />
    </G>
    <G>
      <Rect x={20} y={28} width={8} height={6} rx={1} fill="#F0C848" stroke="#D8B038" strokeWidth={0.5} />
      <Circle cx={22} cy={30} r={0.7} fill="#D8B038" />
      <Circle cx={26} cy={32} r={0.6} fill="#D8B038" />
    </G>
    <Circle cx={16} cy={38} r={2} fill="#A08868" opacity={0.3} />
    <Path d="M40 38 Q42 36 44 38" fill="#78A848" strokeWidth={0.5} stroke="#68903C" />
  </Svg>
);

export const Baguettes = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="bag_g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F0D090" />
        <Stop offset="1" stopColor="#D8A858" />
      </LinearGradient>
    </Defs>
    <G transform="rotate(-25, 28, 28)">
      <Rect x={12} y={22} width={36} height={8} rx={4} fill="url(#bag_g)" stroke="#C89848" strokeWidth={0.6} />
      <Path d="M18 24 L18 28" stroke="#C89040" strokeWidth={0.5} opacity={0.5} />
      <Path d="M24 23 L24 29" stroke="#C89040" strokeWidth={0.5} opacity={0.5} />
      <Path d="M30 23 L30 29" stroke="#C89040" strokeWidth={0.5} opacity={0.5} />
      <Path d="M36 24 L36 28" stroke="#C89040" strokeWidth={0.5} opacity={0.5} />
      <Ellipse cx={28} cy={24} rx={12} ry={2} fill="#F8E0A0" opacity={0.3} />
    </G>
    <G transform="rotate(-35, 28, 34)">
      <Rect x={14} y={30} width={32} height={7} rx={3.5} fill="#E8C878" stroke="#C89040" strokeWidth={0.6} />
      <Path d="M20 32 L20 35" stroke="#C08838" strokeWidth={0.5} opacity={0.4} />
      <Path d="M26 31.5 L26 36" stroke="#C08838" strokeWidth={0.5} opacity={0.4} />
      <Path d="M32 32 L32 35" stroke="#C08838" strokeWidth={0.5} opacity={0.4} />
    </G>
  </Svg>
);

export const GrapeJuice = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="grape_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#B868C8" />
        <Stop offset="1" stopColor="#8848A0" />
      </LinearGradient>
    </Defs>
    <Path d="M22 20 L20 46 Q20 50 28 50 Q36 50 36 46 L34 20 Z" fill="url(#grape_g)" opacity={0.7} />
    <Path d="M22 20 L20 46 Q20 50 28 50 Q36 50 36 46 L34 20 Z" fill="none" stroke="#A060B8" strokeWidth={0.8} />
    <Ellipse cx={28} cy={20} rx={6} ry={2} fill="#D8D0E8" stroke="#A060B8" strokeWidth={0.6} />
    <Ellipse cx={26} cy={28} rx={3} ry={1.5} fill="#C878D8" opacity={0.3} />
    <Rect x={26} y={12} width={4} height={8} rx={2} fill="#D0C8D8" stroke="#A8A0B0" strokeWidth={0.5} />
    <Ellipse cx={28} cy={42} rx={5} ry={2} fill="#A050B8" opacity={0.3} />
  </Svg>
);

export const Patisserie = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={46} rx={20} ry={5} fill="#F0E8E0" stroke="#D8D0C8" strokeWidth={0.5} />
    <G>
      <Circle cx={16} cy={38} r={5} fill="#F8A0B8" />
      <Circle cx={16} cy={36} r={3} fill="#FFBCD0" opacity={0.5} />
    </G>
    <G>
      <Circle cx={28} cy={36} r={5} fill="#A0D880" />
      <Circle cx={28} cy={34} r={3} fill="#B8E898" opacity={0.5} />
    </G>
    <G>
      <Circle cx={40} cy={38} r={5} fill="#F8E080" />
      <Circle cx={40} cy={36} r={3} fill="#FFF0A0" opacity={0.5} />
    </G>
    <G>
      <Circle cx={22} cy={28} r={5} fill="#A8C8F0" />
      <Circle cx={22} cy={26} r={3} fill="#C0D8F8" opacity={0.5} />
    </G>
    <G>
      <Circle cx={34} cy={28} r={5} fill="#E8A8D0" />
      <Circle cx={34} cy={26} r={3} fill="#F0C0E0" opacity={0.5} />
    </G>
    <G>
      <Circle cx={28} cy={20} r={5} fill="#D8B0F0" />
      <Circle cx={28} cy={18} r={3} fill="#E8C8F8" opacity={0.5} />
    </G>
  </Svg>
);

export const Sunflowers = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Line x1={28} y1={30} x2={28} y2={52} stroke="#58A050" strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M28 40 Q20 38 16 42" fill="#68A858" />
    <Path d="M28 44 Q36 42 38 46" fill="#68A858" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
      const angle = (i * 45 * Math.PI) / 180;
      const cx = 28 + Math.cos(angle) * 11;
      const cy = 20 + Math.sin(angle) * 11;
      return (
        <Ellipse key={i} cx={cx} cy={cy} rx={5} ry={3} fill="#F8D040" transform={`rotate(${i * 45}, ${cx}, ${cy})`} />
      );
    })}
    <Circle cx={28} cy={20} r={7} fill="#8B6830" />
    <Circle cx={28} cy={19} r={4} fill="#A07838" opacity={0.5} />
    <Circle cx={26} cy={18} r={1} fill="#6B4820" opacity={0.3} />
    <Circle cx={30} cy={20} r={0.8} fill="#6B4820" opacity={0.3} />
  </Svg>
);

export const Fountain = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="ftn_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D0C8C0" />
        <Stop offset="1" stopColor="#A8A098" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={28} cy={48} rx={22} ry={6} fill="url(#ftn_g)" stroke="#908880" strokeWidth={0.8} />
    <Ellipse cx={28} cy={46} rx={18} ry={4} fill="#88C8E0" opacity={0.5} />
    <Rect x={26} y={20} width={4} height={28} rx={2} fill="#B8B0A8" />
    <Ellipse cx={28} cy={34} rx={10} ry={3} fill="#C0B8B0" />
    <Ellipse cx={28} cy={33} rx={8} ry={2} fill="#88C8E0" opacity={0.4} />
    <Ellipse cx={28} cy={22} rx={6} ry={2} fill="#C8C0B8" />
    <Path d="M28 18 Q26 12 22 14" fill="none" stroke="#88C8E0" strokeWidth={1} opacity={0.5} />
    <Path d="M28 18 Q30 12 34 14" fill="none" stroke="#88C8E0" strokeWidth={1} opacity={0.5} />
    <Path d="M28 18 Q28 10 28 8" fill="none" stroke="#88C8E0" strokeWidth={1} opacity={0.5} />
    <Circle cx={24} cy={14} r={1} fill="#88C8E0" opacity={0.4} />
    <Circle cx={32} cy={14} r={1} fill="#88C8E0" opacity={0.4} />
  </Svg>
);

export const Butterflies = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <G>
      <Ellipse cx={18} cy={22} rx={6} ry={8} fill="#E888C0" opacity={0.7} transform="rotate(-20, 18, 22)" />
      <Ellipse cx={28} cy={22} rx={6} ry={8} fill="#E888C0" opacity={0.7} transform="rotate(20, 28, 22)" />
      <Ellipse cx={20} cy={28} rx={4} ry={6} fill="#D070A8" opacity={0.6} transform="rotate(-15, 20, 28)" />
      <Ellipse cx={26} cy={28} rx={4} ry={6} fill="#D070A8" opacity={0.6} transform="rotate(15, 26, 28)" />
      <Rect x={22} y={16} width={2} height={18} rx={1} fill="#6A4060" />
      <Circle cx={20} cy={20} r={1.5} fill="#F8C0E0" opacity={0.6} />
      <Circle cx={26} cy={20} r={1.5} fill="#F8C0E0" opacity={0.6} />
      <Path d="M22 16 Q20 10 18 8" stroke="#6A4060" strokeWidth={0.8} fill="none" />
      <Path d="M24 16 Q26 10 28 8" stroke="#6A4060" strokeWidth={0.8} fill="none" />
      <Circle cx={18} cy={8} r={1} fill="#6A4060" />
      <Circle cx={28} cy={8} r={1} fill="#6A4060" />
    </G>
    <G>
      <Ellipse cx={38} cy={36} rx={4} ry={5.5} fill="#88C8E8" opacity={0.6} transform="rotate(-15, 38, 36)" />
      <Ellipse cx={44} cy={36} rx={4} ry={5.5} fill="#88C8E8" opacity={0.6} transform="rotate(15, 44, 36)" />
      <Ellipse cx={39} cy={40} rx={3} ry={4} fill="#68A8D0" opacity={0.5} transform="rotate(-10, 39, 40)" />
      <Ellipse cx={43} cy={40} rx={3} ry={4} fill="#68A8D0" opacity={0.5} transform="rotate(10, 43, 40)" />
      <Rect x={40} y={32} width={1.5} height={12} rx={0.75} fill="#385870" />
    </G>
  </Svg>
);

export const Lavender = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    {[16, 24, 32, 40].map((x, i) => (
      <G key={i}>
        <Line x1={x} y1={52} x2={x - 2 + i} y2={22 + i * 2} stroke="#68905C" strokeWidth={1.5} strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map(j => (
          <Ellipse
            key={j}
            cx={x - 2 + i}
            cy={22 + i * 2 + j * 4}
            rx={2.5}
            ry={1.8}
            fill={j < 2 ? '#B888D0' : '#A070B8'}
            opacity={0.8 - j * 0.08}
          />
        ))}
      </G>
    ))}
    <Path d="M24 36 Q20 34 16 36" fill="#78A868" />
    <Path d="M32 38 Q36 36 40 38" fill="#78A868" />
  </Svg>
);

export const LeCoq = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Ellipse cx={28} cy={34} rx={12} ry={10} fill="#E8D8C0" stroke="#C8B8A0" strokeWidth={0.8} />
    <Circle cx={28} cy={20} r={8} fill="#E8D8C0" stroke="#C8B8A0" strokeWidth={0.8} />
    <Path d="M26 10 Q28 4 30 10 Q28 6 26 10 Z" fill="#E84040" />
    <Path d="M24 10 Q26 6 28 10" fill="#D83030" />
    <Path d="M28 10 Q30 6 32 10" fill="#D83030" />
    <Circle cx={24} cy={18} r={1.5} fill="#1A1A2E" />
    <Circle cx={24} cy={17.5} r={0.5} fill="#FFFFFF" />
    <Path d="M20 22 L16 21 L20 20" fill="#F0A830" stroke="#D89020" strokeWidth={0.5} />
    <Path d="M32 26 Q36 24 34 22" fill="#E84040" />
    <Path d="M32 28 Q38 26 36 22" fill="#D83030" opacity={0.8} />
    <Path d="M40 36 Q48 32 46 28" fill="#4870C8" />
    <Path d="M40 34 Q50 30 48 24" fill="#E84848" />
    <Path d="M40 38 Q46 36 44 32" fill="#48A868" />
    <Line x1={22} y1={44} x2={20} y2={52} stroke="#F0A830" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={34} y1={44} x2={36} y2={52} stroke="#F0A830" strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={20} y1={52} x2={17} y2={52} stroke="#F0A830" strokeWidth={1.2} strokeLinecap="round" />
    <Line x1={36} y1={52} x2={39} y2={52} stroke="#F0A830" strokeWidth={1.2} strokeLinecap="round" />
  </Svg>
);

export const Declaration = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={12} y={8} width={32} height={40} rx={2} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={0.8} />
    <Ellipse cx={28} cy={8} rx={14} ry={3} fill="#D8C8A0" />
    <Ellipse cx={28} cy={48} rx={14} ry={3} fill="#D8C8A0" />
    <Path d="M18 16 L38 16" stroke="#A8A090" strokeWidth={0.6} />
    <Path d="M18 20 L38 20" stroke="#A8A090" strokeWidth={0.6} />
    <Path d="M18 24 L38 24" stroke="#A8A090" strokeWidth={0.6} />
    <Path d="M18 28 L34 28" stroke="#A8A090" strokeWidth={0.5} />
    <Path d="M18 32 L38 32" stroke="#A8A090" strokeWidth={0.5} />
    <Path d="M18 36 L30 36" stroke="#A8A090" strokeWidth={0.5} />
    <Rect x={24} y={12} width={8} height={2} rx={1} fill="#4870A8" opacity={0.4} />
    <Circle cx={28} cy={42} r={3} fill="#D8A040" opacity={0.4} />
    <Circle cx={28} cy={42} r={1.5} fill="#C89030" opacity={0.3} />
  </Svg>
);

export const MapOfFrance = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={8} y={8} width={40} height={40} rx={3} fill="#FFF8E8" stroke="#D8C8A0" strokeWidth={1} />
    <Path d="M28 12 L38 16 L40 24 L36 34 L30 40 L22 42 L16 36 L14 28 L16 20 L22 14 Z" fill="#A0C8E8" stroke="#7098B8" strokeWidth={0.8} />
    <Circle cx={30} cy={22} r={1.5} fill="#E84860" />
    <Circle cx={24} cy={30} r={1} fill="#E84860" opacity={0.6} />
    <Circle cx={34} cy={30} r={1} fill="#E84860" opacity={0.5} />
    <Path d="M12 44 L44 44" stroke="#D8D0C0" strokeWidth={0.4} />
    <Path d="M12 12 L16 12" stroke="#D8D0C0" strokeWidth={0.5} />
    <Path d="M12 12 L12 16" stroke="#D8D0C0" strokeWidth={0.5} />
  </Svg>
);

export const QuillPen = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <G>
      <Rect x={10} y={38} width={14} height={12} rx={2} fill="#2A2A3A" stroke="#1A1A2A" strokeWidth={0.8} />
      <Ellipse cx={17} cy={40} rx={5} ry={2} fill="#3A3A4A" />
      <Ellipse cx={17} cy={41} rx={4} ry={1.5} fill="#1A1A3A" opacity={0.5} />
    </G>
    <G transform="rotate(-30, 28, 28)">
      <Path d="M26 44 L28 44 L30 10 Q28 6 26 10 Z" fill="#E8E0D0" />
      <Path d="M27 44 L28 10" stroke="#D8D0C0" strokeWidth={0.5} />
      <Path d="M30 10 Q34 14 36 20 Q32 16 30 14" fill="#D8D0C0" opacity={0.5} />
      <Path d="M26 10 Q22 14 20 20 Q24 16 26 14" fill="#D8D0C0" opacity={0.5} />
      <Rect x={26} y={40} width={2} height={6} fill="#A08060" />
    </G>
  </Svg>
);

export const TheaterMasks = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <G>
      <Path d="M6 16 Q6 8 20 8 Q34 8 34 16 Q34 30 20 32 Q6 30 6 16 Z" fill="#FFF0D0" stroke="#E8D0A0" strokeWidth={0.8} />
      <Circle cx={14} cy={18} r={2.5} fill="#2A2A3A" />
      <Circle cx={26} cy={18} r={2.5} fill="#2A2A3A" />
      <Path d="M14 24 Q20 30 26 24" fill="none" stroke="#E8A060" strokeWidth={1.5} strokeLinecap="round" />
    </G>
    <G>
      <Path d="M22 24 Q22 16 36 16 Q50 16 50 24 Q50 38 36 40 Q22 38 22 24 Z" fill="#C0D8F0" stroke="#98B8D8" strokeWidth={0.8} />
      <Circle cx={30} cy={26} r={2.5} fill="#2A2A3A" />
      <Circle cx={42} cy={26} r={2.5} fill="#2A2A3A" />
      <Path d="M30 34 Q36 30 42 34" fill="none" stroke="#7898B8" strokeWidth={1.5} strokeLinecap="round" />
    </G>
    <Line x1={20} y1={8} x2={22} y2={4} stroke="#E8D0A0" strokeWidth={1} strokeLinecap="round" />
    <Line x1={36} y1={16} x2={38} y2={12} stroke="#98B8D8" strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

export const CastleModel = ({ size = S }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Defs>
      <LinearGradient id="castle_g" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E8E0D8" />
        <Stop offset="1" stopColor="#C8C0B8" />
      </LinearGradient>
    </Defs>
    <Rect x={8} y={28} width={40} height={22} rx={1} fill="url(#castle_g)" stroke="#A8A098" strokeWidth={0.8} />
    <Rect x={22} y={36} width={12} height={14} rx={1} fill="#A08870" />
    <Path d="M22 36 Q28 32 34 36" fill="#907860" />
    <Rect x={14} y={20} width={8} height={10} rx={0.5} fill="#D8D0C8" stroke="#A8A098" strokeWidth={0.6} />
    <Rect x={34} y={20} width={8} height={10} rx={0.5} fill="#D8D0C8" stroke="#A8A098" strokeWidth={0.6} />
    <Path d="M14 20 L15 18 L17 20 L19 18 L21 20 L22 18" fill="none" stroke="#B8B0A8" strokeWidth={0.8} />
    <Path d="M34 20 L35 18 L37 20 L39 18 L41 20 L42 18" fill="none" stroke="#B8B0A8" strokeWidth={0.8} />
    <Rect x={24} y={12} width={8} height={18} rx={0.5} fill="#D8D0C8" stroke="#A8A098" strokeWidth={0.6} />
    <Path d="M24 12 L25 10 L27 12 L29 10 L31 12 L32 10" fill="none" stroke="#B8B0A8" strokeWidth={0.8} />
    <Path d="M8 28 L9 26 L11 28 L13 26 L15 28" fill="none" stroke="#B8B0A8" strokeWidth={0.6} />
    <Path d="M41 28 L43 26 L45 28 L47 26 L48 28" fill="none" stroke="#B8B0A8" strokeWidth={0.6} />
    <Rect x={26} y={16} width={4} height={5} rx={0.5} fill="#88B8D8" opacity={0.5} />
    <Circle cx={28} cy={8} r={1.5} fill="#4870A8" />
    <Line x1={28} y1={10} x2={28} y2={12} stroke="#4870A8" strokeWidth={1} />
  </Svg>
);

export const frIllustrations: Record<string, React.FC<{ size?: number }>> = {
  fr_l1: EiffelTowerModel,
  fr_l2: Painting,
  fr_l3: Chandelier,
  fr_l4: Bookshelf,
  fr_l5: Roses,
  fr_k1: Croissants,
  fr_k2: CheeseBoard,
  fr_k3: Baguettes,
  fr_k4: GrapeJuice,
  fr_k5: Patisserie,
  fr_g1: Sunflowers,
  fr_g2: Fountain,
  fr_g3: Butterflies,
  fr_g4: Lavender,
  fr_g5: LeCoq,
  fr_s1: Declaration,
  fr_s2: MapOfFrance,
  fr_s3: QuillPen,
  fr_s4: TheaterMasks,
  fr_s5: CastleModel,
};
