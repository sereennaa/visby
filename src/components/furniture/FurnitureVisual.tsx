import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Rect, Path, Circle, G, Ellipse, Line, Polygon } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Icon, IconName } from '../ui/Icon';
import type { FurnitureItem, FurnitureInteractionType } from '../../types';
import { colors } from '../../theme/colors';

type Size = 'small' | 'medium' | 'large';

interface FurnitureVisualProps {
  item?: FurnitureItem;
  interactionType?: FurnitureInteractionType;
  icon?: IconName;
  size?: Size | number;
  style?: ViewStyle;
  showHint?: boolean;
  glow?: boolean;
  glowColor?: string;
  imageUrl?: string;
}

const SIZES: Record<string, { w: number; h: number }> = {
  small: { w: 72, h: 60 },
  medium: { w: 100, h: 80 },
  large: { w: 130, h: 104 },
};

// --- Interactive furniture SVGs ---

const TableSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="10" y="28" width="80" height="10" rx="4" fill="#C8A882" stroke="#A88A68" strokeWidth="1.2" />
    <Rect x="12" y="30" width="76" height="5" rx="2.5" fill="#D4B896" opacity={0.5} />
    <Rect x="16" y="38" width="7" height="34" rx="2.5" fill="#A88A68" />
    <Rect x="77" y="38" width="7" height="34" rx="2.5" fill="#A88A68" />
    <Rect x="18" y="66" width="64" height="4" rx="2" fill="#9A7A58" opacity={0.4} />
    <Ellipse cx="50" cy="22" rx="14" ry="8" fill="#F5F0E8" stroke="#E0D8C8" strokeWidth="1" />
    <Circle cx="47" cy="20" r="3.5" fill="#E8B860" opacity={0.7} />
    <Circle cx="55" cy="19" r="2" fill="#D4A040" opacity={0.5} />
  </Svg>
);

const StoveSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="14" y="10" width="72" height="60" rx="8" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.2" />
    <Rect x="16" y="12" width="68" height="16" rx="4" fill="#7B8290" />
    <Circle cx="36" cy="20" r="7" fill="#6B7280" stroke="#4B5563" strokeWidth="1" />
    <Circle cx="64" cy="20" r="7" fill="#6B7280" stroke="#4B5563" strokeWidth="1" />
    <Path d="M 33 12 Q 36 4 39 12" stroke="#FF6B35" strokeWidth="2" fill="none" opacity={0.9} />
    <Path d="M 61 12 Q 64 5 67 12" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity={0.6} />
    <Rect x="16" y="56" width="68" height="12" rx="4" fill="#858B98" />
    <Circle cx="30" cy="62" r="3.5" fill="#6B7280" stroke="#4B5563" strokeWidth="0.6" />
    <Rect x="56" y="34" width="24" height="16" rx="3" fill="#858B98" stroke="#6B7280" strokeWidth="0.5" />
  </Svg>
);

const BedSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 130 80">
    <Rect x="4" y="10" width="16" height="60" rx="5" fill="#A88A68" stroke="#8B7355" strokeWidth="1" />
    <Rect x="7" y="15" width="10" height="20" rx="4" fill="#C8A882" />
    <Rect x="20" y="30" width="106" height="40" rx="5" fill="#E8DCC8" stroke="#D4C4B0" strokeWidth="1" />
    <Rect x="22" y="16" width="42" height="22" rx="8" fill="#F5F0E8" stroke="#E0D8C8" strokeWidth="1" />
    <Rect x="22" y="38" width="100" height="28" rx="4" fill="#B8A0D0" opacity={0.35} />
    <Path d="M 22 46 Q 72 38 122 46" stroke="#9B88B8" strokeWidth="0.8" fill="none" opacity={0.3} />
    <Rect x="118" y="56" width="8" height="18" rx="3" fill="#A88A68" />
  </Svg>
);

const BookshelfSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="8" y="2" width="84" height="76" rx="4" fill="#A88A68" stroke="#8B7355" strokeWidth="1.2" />
    <Rect x="10" y="4" width="80" height="72" rx="3" fill="#C8A882" />
    <Rect x="10" y="28" width="80" height="2.5" fill="#8B7355" />
    <Rect x="10" y="54" width="80" height="2.5" fill="#8B7355" />
    <Rect x="16" y="7" width="9" height="19" rx="1.5" fill="#E57373" />
    <Rect x="27" y="10" width="8" height="16" rx="1.5" fill="#64B5F6" />
    <Rect x="37" y="6" width="10" height="20" rx="1.5" fill="#81C784" />
    <Rect x="49" y="9" width="8" height="17" rx="1.5" fill="#FFD54F" />
    <Rect x="59" y="7" width="9" height="19" rx="1.5" fill="#BA68C8" />
    <Rect x="70" y="8" width="8" height="18" rx="1.5" fill="#4FC3F7" />
    <Rect x="16" y="32" width="10" height="20" rx="1.5" fill="#7986CB" />
    <Rect x="28" y="34" width="8" height="18" rx="1.5" fill="#A1887F" />
    <Rect x="38" y="33" width="9" height="19" rx="1.5" fill="#F06292" />
    <Rect x="56" y="32" width="10" height="20" rx="1.5" fill="#4FC3F7" />
    <Rect x="68" y="34" width="9" height="18" rx="1.5" fill="#FFB74D" />
    <Rect x="16" y="59" width="12" height="15" rx="1.5" fill="#CE93D8" />
    <Circle cx="58" cy="67" r="6" fill="#FFCC80" stroke="#FFB74D" strokeWidth="0.6" />
    <Rect x="72" y="60" width="10" height="14" rx="1.5" fill="#EF9A9A" />
  </Svg>
);

const ToyBoxSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="12" y="20" width="76" height="52" rx="8" fill="#C8A882" stroke="#A88A68" strokeWidth="1.2" />
    <Rect x="12" y="20" width="76" height="14" rx="5" fill="#D4B896" />
    <Rect x="36" y="17" width="28" height="8" rx="4" fill="#A88A68" />
    <Circle cx="30" cy="18" r="8" fill="#FF8A65" stroke="#E57355" strokeWidth="1" />
    <Circle cx="27" cy="15" r="2" fill="#FFF" />
    <Circle cx="33" cy="15" r="2" fill="#FFF" />
    <Path d="M 70 14 L 74 6 L 78 14" fill="#FFD54F" stroke="#FFC107" strokeWidth="1" />
    <Circle cx="55" cy="10" r="5" fill="#81C784" stroke="#4CAF50" strokeWidth="0.8" />
  </Svg>
);

// --- Decorative furniture SVGs ---

const PictureFrameSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="14" y="4" width="72" height="64" rx="4" fill="#A88A68" stroke="#8B7355" strokeWidth="2" />
    <Rect x="20" y="10" width="60" height="52" rx="2" fill="#F5F0E8" />
    <Rect x="22" y="12" width="56" height="48" rx="1.5" fill="#D6EAF8" />
    <Circle cx="38" cy="28" r="8" fill="#FFD54F" />
    <Path d="M22 48 L36 36 L52 46 L66 38 L78 48 L78 60 L22 60 Z" fill="#81C784" opacity={0.7} />
    <Path d="M22 54 L42 42 L62 54 L78 48 L78 60 L22 60 Z" fill="#4CAF50" opacity={0.5} />
  </Svg>
);

/** Vintage shop / wall sign (e.g. Fish & Chips Sign). */
const SignSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Line x1="28" y1="8" x2="28" y2="18" stroke="#8B7355" strokeWidth="1.5" />
    <Line x1="72" y1="8" x2="72" y2="18" stroke="#8B7355" strokeWidth="1.5" />
    <Rect x="12" y="18" width="76" height="54" rx="6" fill="#6B5344" stroke="#5D4037" strokeWidth="2" />
    <Rect x="16" y="22" width="68" height="46" rx="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="0.8" />
    <Rect x="20" y="26" width="60" height="38" rx="3" fill="#FFF8E7" stroke="#D4C4B0" strokeWidth="0.6" />
    <Rect x="24" y="30" width="52" height="8" rx="1" fill="#2E7D32" opacity={0.9} />
    <Rect x="24" y="42" width="52" height="6" rx="1" fill="#558B2F" opacity={0.7} />
    <Rect x="30" y="52" width="40" height="4" rx="1" fill="#8D6E63" opacity={0.5} />
  </Svg>
);

const ClockSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Circle cx="50" cy="40" r="30" fill="#F5F0E8" stroke="#A88A68" strokeWidth="2.5" />
    <Circle cx="50" cy="40" r="27" fill="#FFFFF0" stroke="#D4C4B0" strokeWidth="0.6" />
    <Line x1="50" y1="14" x2="50" y2="20" stroke="#8B7355" strokeWidth="2" />
    <Line x1="50" y1="60" x2="50" y2="66" stroke="#8B7355" strokeWidth="2" />
    <Line x1="24" y1="40" x2="30" y2="40" stroke="#8B7355" strokeWidth="2" />
    <Line x1="70" y1="40" x2="76" y2="40" stroke="#8B7355" strokeWidth="2" />
    <Line x1="50" y1="40" x2="50" y2="22" stroke="#333" strokeWidth="2.5" />
    <Line x1="50" y1="40" x2="64" y2="34" stroke="#333" strokeWidth="2" />
    <Circle cx="50" cy="40" r="2.5" fill="#333" />
  </Svg>
);

const VaseSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Path d="M36 70 Q34 54 28 44 Q24 34 32 26 L42 24 L58 24 L68 26 Q76 34 72 44 Q66 54 64 70 Z" fill="#CE93D8" stroke="#AB47BC" strokeWidth="1.2" />
    <Ellipse cx="50" cy="70" rx="14" ry="4" fill="#AB47BC" />
    <Ellipse cx="50" cy="24" rx="10" ry="4" fill="#E1BEE7" stroke="#AB47BC" strokeWidth="0.6" />
    <Line x1="44" y1="21" x2="36" y2="6" stroke="#4CAF50" strokeWidth="2" />
    <Line x1="50" y1="21" x2="50" y2="3" stroke="#4CAF50" strokeWidth="2" />
    <Line x1="56" y1="21" x2="64" y2="6" stroke="#4CAF50" strokeWidth="2" />
    <Circle cx="36" cy="5" r="4" fill="#F06292" />
    <Circle cx="50" cy="2" r="4.5" fill="#E57373" />
    <Circle cx="64" cy="5" r="4" fill="#FFB74D" />
  </Svg>
);

const LampSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="46" y="50" width="8" height="22" rx="3" fill="#A88A68" />
    <Ellipse cx="50" cy="74" rx="16" ry="5" fill="#8B7355" />
    <Path d="M28 52 L50 10 L72 52 Z" fill="#FFF9C4" stroke="#FFD54F" strokeWidth="1.2" />
    <Path d="M34 52 L50 16 L66 52 Z" fill="#FFFDE7" opacity={0.6} />
    <Ellipse cx="50" cy="8" rx="4" ry="3" fill="#FFD54F" />
  </Svg>
);

const PlantSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Path d="M36 74 Q34 58 36 54 L64 54 Q66 58 64 74 Z" fill="#795548" stroke="#5D4037" strokeWidth="1.2" />
    <Ellipse cx="50" cy="54" rx="16" ry="5" fill="#8D6E63" />
    <Ellipse cx="50" cy="52" rx="13" ry="4" fill="#4CAF50" />
    <Path d="M50 52 Q36 42 30 26" stroke="#4CAF50" strokeWidth="2.5" fill="none" />
    <Ellipse cx="28" cy="24" rx="10" ry="7" fill="#66BB6A" />
    <Path d="M50 52 Q64 38 70 22" stroke="#4CAF50" strokeWidth="2.5" fill="none" />
    <Ellipse cx="72" cy="20" rx="9" ry="6" fill="#81C784" />
    <Path d="M50 52 Q50 36 52 18" stroke="#388E3C" strokeWidth="2.5" fill="none" />
    <Ellipse cx="52" cy="16" rx="8" ry="5" fill="#43A047" />
  </Svg>
);

const RugSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 130 80">
    <Rect x="5" y="18" width="120" height="48" rx="5" fill="#C0392B" opacity={0.8} />
    <Rect x="12" y="24" width="106" height="36" rx="3" fill="#E74C3C" opacity={0.6} />
    <Rect x="18" y="28" width="94" height="28" rx="2" fill="none" stroke="#F5CBA7" strokeWidth="1.2" />
    <Line x1="65" y1="28" x2="65" y2="56" stroke="#F5CBA7" strokeWidth="0.6" />
    <Line x1="18" y1="42" x2="112" y2="42" stroke="#F5CBA7" strokeWidth="0.6" />
    <Circle cx="42" cy="35" r="4" fill="none" stroke="#FDEBD0" strokeWidth="1" />
    <Circle cx="88" cy="35" r="4" fill="none" stroke="#FDEBD0" strokeWidth="1" />
    <Circle cx="42" cy="49" r="4" fill="none" stroke="#FDEBD0" strokeWidth="1" />
    <Circle cx="88" cy="49" r="4" fill="none" stroke="#FDEBD0" strokeWidth="1" />
  </Svg>
);

const GlobeSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="44" y="60" width="12" height="12" rx="3" fill="#A88A68" />
    <Ellipse cx="50" cy="74" rx="18" ry="4" fill="#8B7355" />
    <Circle cx="50" cy="36" r="24" fill="#4FC3F7" stroke="#0288D1" strokeWidth="1.2" />
    <Path d="M30 26 Q38 22 44 28 Q50 34 56 28 Q62 22 70 26" fill="#66BB6A" opacity={0.7} />
    <Path d="M28 40 Q36 36 44 40 Q52 44 62 42 Q68 40 72 42" fill="#4CAF50" opacity={0.6} />
    <Ellipse cx="50" cy="36" rx="24" ry="24" fill="none" stroke="#0288D1" strokeWidth="0.6" />
    <Line x1="50" y1="12" x2="50" y2="60" stroke="#0288D1" strokeWidth="0.6" opacity={0.4} />
    <Ellipse cx="50" cy="36" rx="12" ry="24" fill="none" stroke="#0288D1" strokeWidth="0.6" opacity={0.4} />
  </Svg>
);

const CandleSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Ellipse cx="50" cy="72" rx="20" ry="6" fill="#A88A68" stroke="#8B7355" strokeWidth="1" />
    <Rect x="42" y="30" width="16" height="42" rx="4" fill="#FFF9C4" stroke="#FFD54F" strokeWidth="1" />
    <Path d="M47 30 Q50 18 53 30" fill="#FF9800" stroke="#FF6F00" strokeWidth="0.6" />
    <Ellipse cx="50" cy="18" rx="4" ry="7" fill="#FFB74D" />
    <Ellipse cx="50" cy="15" rx="3" ry="4" fill="#FFF176" />
  </Svg>
);

const BonsaiSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="32" y="60" width="36" height="10" rx="3" fill="#795548" stroke="#5D4037" strokeWidth="1.2" />
    <Ellipse cx="50" cy="60" rx="20" ry="4" fill="#8D6E63" />
    <Rect x="47" y="40" width="6" height="22" rx="2" fill="#5D4037" />
    <Path d="M47 48 Q36 44 30 50" stroke="#5D4037" strokeWidth="2.5" fill="none" />
    <Path d="M53 42 Q64 38 70 44" stroke="#5D4037" strokeWidth="2.5" fill="none" />
    <Ellipse cx="50" cy="32" rx="22" ry="16" fill="#388E3C" />
    <Ellipse cx="36" cy="38" rx="14" ry="10" fill="#4CAF50" />
    <Ellipse cx="64" cy="34" rx="14" ry="10" fill="#43A047" />
    <Circle cx="42" cy="28" r="6" fill="#66BB6A" opacity={0.6} />
    <Circle cx="58" cy="30" r="5" fill="#81C784" opacity={0.5} />
  </Svg>
);

const MosaicLampSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Line x1="50" y1="0" x2="50" y2="16" stroke="#A88A68" strokeWidth="2" />
    <Ellipse cx="50" cy="36" rx="24" ry="20" fill="#FF7043" stroke="#E64A19" strokeWidth="1.2" />
    <Ellipse cx="50" cy="36" rx="20" ry="16" fill="none" stroke="#FFAB91" strokeWidth="0.6" />
    <Circle cx="40" cy="28" r="4" fill="#FFD54F" opacity={0.7} />
    <Circle cx="50" cy="26" r="3.5" fill="#4FC3F7" opacity={0.7} />
    <Circle cx="60" cy="28" r="4" fill="#81C784" opacity={0.7} />
    <Circle cx="42" cy="38" r="3.5" fill="#CE93D8" opacity={0.7} />
    <Circle cx="58" cy="38" r="3.5" fill="#FF8A65" opacity={0.7} />
    <Circle cx="50" cy="44" r="3" fill="#FFD54F" opacity={0.7} />
    <Ellipse cx="50" cy="54" rx="8" ry="3" fill="#FFCCBC" />
  </Svg>
);

const MirrorSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Ellipse cx="50" cy="38" rx="28" ry="34" fill="#A88A68" stroke="#8B7355" strokeWidth="2" />
    <Ellipse cx="50" cy="38" rx="24" ry="30" fill="#D6EAF8" />
    <Ellipse cx="50" cy="38" rx="20" ry="26" fill="#E8F4FD" />
    <Path d="M34 22 Q42 18 45 28" stroke="white" strokeWidth="2" fill="none" opacity={0.6} />
  </Svg>
);

const ShelfSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="4" y="32" width="92" height="8" rx="3" fill="#A88A68" stroke="#8B7355" strokeWidth="1.2" />
    <Rect x="8" y="40" width="6" height="14" rx="2" fill="#8B7355" />
    <Rect x="86" y="40" width="6" height="14" rx="2" fill="#8B7355" />
    <Rect x="14" y="18" width="10" height="14" rx="2" fill="#E57373" />
    <Rect x="28" y="20" width="8" height="12" rx="2" fill="#64B5F6" />
    <Circle cx="52" cy="26" r="7" fill="#FFCC80" stroke="#FFB74D" strokeWidth="0.6" />
    <Rect x="68" y="19" width="9" height="13" rx="2" fill="#81C784" />
  </Svg>
);

// --- New expanded SVGs for country-specific items ---

const ChandelierSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Line x1="50" y1="0" x2="50" y2="14" stroke="#D4AF37" strokeWidth="2" />
    <Circle cx="50" cy="14" r="4" fill="#D4AF37" />
    <Path d="M30 30 Q40 18 50 14 Q60 18 70 30" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
    <Path d="M22 44 Q36 28 50 14 Q64 28 78 44" stroke="#D4AF37" strokeWidth="1" fill="none" />
    {[30, 42, 58, 70].map((x, i) => (
      <G key={i}>
        <Line x1={x} y1="30" x2={x} y2="44" stroke="#D4AF37" strokeWidth="0.8" />
        <Ellipse cx={x} cy="38" rx="3" ry="6" fill="#FFF9C4" opacity={0.8} />
        <Ellipse cx={x} cy="36" rx="2" ry="3" fill="#FFF176" opacity={0.9} />
      </G>
    ))}
    <Circle cx="36" cy="50" r="2" fill="#E0E0E0" opacity={0.5} />
    <Circle cx="50" cy="54" r="2.5" fill="#E0E0E0" opacity={0.5} />
    <Circle cx="64" cy="50" r="2" fill="#E0E0E0" opacity={0.5} />
  </Svg>
);

const HammockSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 130 80">
    <Rect x="6" y="4" width="6" height="72" rx="3" fill="#8D6E63" />
    <Rect x="118" y="4" width="6" height="72" rx="3" fill="#8D6E63" />
    <Path d="M12 20 Q65 60 118 20" stroke="#FF9800" strokeWidth="3" fill="none" />
    <Path d="M12 20 Q65 56 118 20" fill="#FFCC80" opacity={0.4} />
    <Path d="M12 22 Q65 50 118 22" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity={0.6} />
    <Path d="M12 24 Q65 54 118 24" stroke="#E91E63" strokeWidth="1.5" fill="none" opacity={0.6} />
    <Path d="M12 18 Q65 48 118 18" stroke="#2196F3" strokeWidth="1.5" fill="none" opacity={0.6} />
  </Svg>
);

const CushionSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Ellipse cx="50" cy="48" rx="36" ry="22" fill="#E91E63" opacity={0.2} />
    <Path d="M18 40 Q18 20 50 20 Q82 20 82 40 Q82 58 50 58 Q18 58 18 40 Z" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
    <Path d="M22 38 Q22 24 50 24 Q78 24 78 38" fill="#EC407A" opacity={0.4} />
    <Path d="M30 40 Q50 30 70 40" stroke="#F8BBD0" strokeWidth="1" fill="none" opacity={0.5} />
    <Circle cx="50" cy="40" r="3" fill="#F8BBD0" opacity={0.6} />
  </Svg>
);

const FountainSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Ellipse cx="50" cy="68" rx="36" ry="8" fill="#90A4AE" stroke="#607D8B" strokeWidth="1" />
    <Rect x="20" y="54" width="60" height="16" rx="4" fill="#B0BEC5" stroke="#78909C" strokeWidth="0.8" />
    <Rect x="44" y="26" width="12" height="30" rx="3" fill="#90A4AE" />
    <Ellipse cx="50" cy="28" rx="16" ry="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="0.8" />
    <Path d="M50 22 Q48 12 44 6" stroke="#42A5F5" strokeWidth="2" fill="none" opacity={0.7} />
    <Path d="M50 22 Q52 10 56 6" stroke="#42A5F5" strokeWidth="2" fill="none" opacity={0.7} />
    <Path d="M50 22 Q50 8 50 2" stroke="#64B5F6" strokeWidth="1.5" fill="none" opacity={0.5} />
    <Circle cx="44" cy="5" r="2" fill="#42A5F5" opacity={0.5} />
    <Circle cx="56" cy="5" r="2" fill="#42A5F5" opacity={0.5} />
  </Svg>
);

const GuitarSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 80 100">
    <Path d="M40 10 L40 40" stroke="#8D6E63" strokeWidth="3" />
    <Rect x="34" y="4" width="12" height="10" rx="2" fill="#A1887F" />
    {[36, 40, 44].map((x, i) => (
      <Line key={i} x1={x} y1="4" x2={x} y2="14" stroke="#E0E0E0" strokeWidth="0.5" />
    ))}
    <Ellipse cx="40" cy="60" rx="22" ry="26" fill="#D4A056" stroke="#A0845C" strokeWidth="1.5" />
    <Ellipse cx="40" cy="58" rx="18" ry="22" fill="#E8C880" opacity={0.5} />
    <Circle cx="40" cy="60" r="8" fill="#5D4037" />
    <Circle cx="40" cy="60" r="6" fill="#795548" />
    {[36, 38, 40, 42, 44].map((x, i) => (
      <Line key={i} x1={x} y1="14" x2={x} y2="86" stroke="#E0E0E0" strokeWidth="0.3" opacity={0.6} />
    ))}
  </Svg>
);

const MaskSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Path d="M50 8 Q20 12 16 40 Q14 56 30 68 Q40 74 50 72 Q60 74 70 68 Q86 56 84 40 Q80 12 50 8 Z" fill="#FF7043" stroke="#E64A19" strokeWidth="1.5" />
    <Ellipse cx="36" cy="34" rx="10" ry="8" fill="#FFF" stroke="#333" strokeWidth="1.5" />
    <Ellipse cx="64" cy="34" rx="10" ry="8" fill="#FFF" stroke="#333" strokeWidth="1.5" />
    <Circle cx="36" cy="34" r="4" fill="#333" />
    <Circle cx="64" cy="34" r="4" fill="#333" />
    <Path d="M40 54 Q50 62 60 54" stroke="#333" strokeWidth="2" fill="none" />
    <Path d="M28 18 Q38 14 46 20" stroke="#FFD54F" strokeWidth="2" fill="none" />
    <Path d="M72 18 Q62 14 54 20" stroke="#FFD54F" strokeWidth="2" fill="none" />
  </Svg>
);

const LanternSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 80 100">
    <Line x1="40" y1="0" x2="40" y2="14" stroke="#D4AF37" strokeWidth="1.5" />
    <Rect x="32" y="14" width="16" height="6" rx="2" fill="#333" />
    <Path d="M28 20 Q28 50 40 56 Q52 50 52 20 Z" fill="#FF6B35" opacity={0.8} stroke="#D4AF37" strokeWidth="1" />
    <Path d="M32 20 Q32 46 40 52 Q48 46 48 20 Z" fill="#FFB74D" opacity={0.5} />
    <Rect x="32" y="56" width="16" height="6" rx="2" fill="#333" />
    <Ellipse cx="40" cy="36" rx="6" ry="10" fill="#FFF9C4" opacity={0.6} />
  </Svg>
);

const ArmoireSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="10" y="4" width="80" height="68" rx="4" fill="#B8C6DB" stroke="#8FA4BD" strokeWidth="1.5" />
    <Rect x="10" y="4" width="80" height="8" rx="4" fill="#9BB0C8" />
    <Rect x="14" y="14" width="36" height="52" rx="2" fill="#A8B8CC" stroke="#8FA4BD" strokeWidth="0.8" />
    <Rect x="52" y="14" width="36" height="52" rx="2" fill="#A8B8CC" stroke="#8FA4BD" strokeWidth="0.8" />
    <Circle cx="46" cy="40" r="3" fill="#D4AF37" />
    <Circle cx="56" cy="40" r="3" fill="#D4AF37" />
    <Rect x="20" y="20" width="24" height="40" rx="1" fill="none" stroke="#C8D6E6" strokeWidth="0.6" />
    <Rect x="58" y="20" width="24" height="40" rx="1" fill="none" stroke="#C8D6E6" strokeWidth="0.6" />
    <Rect x="14" y="68" width="10" height="8" rx="2" fill="#8FA4BD" />
    <Rect x="78" y="68" width="10" height="8" rx="2" fill="#8FA4BD" />
  </Svg>
);

const TatamiSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 130 60">
    <Rect x="4" y="8" width="122" height="48" rx="3" fill="#C8B88C" stroke="#A89868" strokeWidth="1" />
    <Rect x="8" y="12" width="56" height="40" rx="1" fill="#D4C498" />
    <Rect x="68" y="12" width="56" height="40" rx="1" fill="#CCC090" />
    <Rect x="62" y="10" width="8" height="44" rx="1" fill="#8B7355" opacity={0.3} />
    {[18, 28, 38, 48].map((y, i) => (
      <Line key={i} x1="8" y1={y} x2="64" y2={y} stroke="#A89868" strokeWidth="0.3" opacity={0.4} />
    ))}
    {[18, 28, 38, 48].map((y, i) => (
      <Line key={i} x1="68" y1={y} x2="124" y2={y} stroke="#A89868" strokeWidth="0.3" opacity={0.4} />
    ))}
  </Svg>
);

const TeaSetSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 70">
    <Path d="M30 50 Q28 30 38 24 L52 24 Q62 30 60 50 Z" fill="#F5F0E8" stroke="#D4C4B0" strokeWidth="1.2" />
    <Ellipse cx="45" cy="50" rx="16" ry="4" fill="#E8DCC8" />
    <Ellipse cx="45" cy="24" rx="8" ry="3" fill="#F5F0E8" stroke="#D4C4B0" strokeWidth="0.6" />
    <Path d="M60 32 Q72 32 72 40 Q72 48 60 48" stroke="#D4C4B0" strokeWidth="1.5" fill="none" />
    <Circle cx="74" cy="44" r="6" fill="#F5F0E8" stroke="#D4C4B0" strokeWidth="1" />
    <Circle cx="82" cy="44" r="6" fill="#F5F0E8" stroke="#D4C4B0" strokeWidth="1" />
    <Path d="M42 20 Q44 12 46 20" stroke="#B0BEC5" strokeWidth="1" fill="none" opacity={0.5} />
  </Svg>
);

const ChairSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Rect x="16" y="4" width="48" height="44" rx="6" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.2" />
    <Rect x="20" y="8" width="40" height="36" rx="4" fill="#A1887F" />
    <Rect x="12" y="48" width="56" height="12" rx="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
    <Rect x="14" y="52" width="52" height="6" rx="2" fill="#A1887F" opacity={0.6} />
    <Rect x="16" y="60" width="6" height="16" rx="2" fill="#6D4C41" />
    <Rect x="58" y="60" width="6" height="16" rx="2" fill="#6D4C41" />
    <Path d="M64 28 Q80 28 80 42 Q80 56 64 56" stroke="#5D4037" strokeWidth="4" fill="none" />
    <Path d="M66 32 Q76 32 76 42 Q76 52 66 52" stroke="#6D4C41" strokeWidth="2" fill="none" />
  </Svg>
);

const StatueSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 80 100">
    <Rect x="24" y="80" width="32" height="10" rx="3" fill="#B0BEC5" stroke="#78909C" strokeWidth="1" />
    <Rect x="30" y="70" width="20" height="12" rx="2" fill="#CFD8DC" />
    <Path d="M40 70 Q34 50 36 36 Q38 24 40 18 Q42 24 44 36 Q46 50 40 70 Z" fill="#CFD8DC" stroke="#90A4AE" strokeWidth="1" />
    <Circle cx="40" cy="14" r="8" fill="#CFD8DC" stroke="#90A4AE" strokeWidth="1" />
    <Path d="M36 36 Q26 32 22 38" stroke="#90A4AE" strokeWidth="2" fill="none" />
    <Path d="M44 36 Q54 32 58 38" stroke="#90A4AE" strokeWidth="2" fill="none" />
  </Svg>
);

const PotterySvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 80">
    <Path d="M34 68 Q30 50 32 38 Q36 24 50 22 Q64 24 68 38 Q70 50 66 68 Z" fill="#E0A050" stroke="#C88030" strokeWidth="1.2" />
    <Ellipse cx="50" cy="68" rx="16" ry="4" fill="#C88030" />
    <Ellipse cx="50" cy="22" rx="10" ry="4" fill="#E8B860" stroke="#C88030" strokeWidth="0.6" />
    <Path d="M38 34 Q44 30 50 34 Q56 30 62 34" stroke="#FFF" strokeWidth="1" fill="none" opacity={0.3} />
    <Path d="M36 46 Q43 42 50 46 Q57 42 64 46" stroke="#FFF" strokeWidth="1" fill="none" opacity={0.3} />
    <Circle cx="42" cy="38" r="2" fill="#2196F3" opacity={0.6} />
    <Circle cx="58" cy="38" r="2" fill="#4CAF50" opacity={0.6} />
    <Circle cx="50" cy="52" r="2.5" fill="#FF9800" opacity={0.6} />
  </Svg>
);

const CarpetSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 130 60">
    <Rect x="4" y="6" width="122" height="50" rx="3" fill="#1A237E" opacity={0.7} />
    <Rect x="10" y="10" width="110" height="42" rx="2" fill="#283593" opacity={0.5} />
    <Rect x="16" y="14" width="98" height="34" fill="none" stroke="#FFD54F" strokeWidth="1" opacity={0.6} />
    <Rect x="22" y="18" width="86" height="26" fill="none" stroke="#FFD54F" strokeWidth="0.5" opacity={0.4} />
    <Line x1="65" y1="14" x2="65" y2="48" stroke="#FFD54F" strokeWidth="0.4" opacity={0.3} />
    <Path d="M30 31 L65 18 L100 31 L65 44 Z" fill="none" stroke="#E8B860" strokeWidth="0.8" opacity={0.5} />
  </Svg>
);

const FireplaceSvg = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 120 80">
    <Rect x="10" y="8" width="100" height="68" rx="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.5" />
    <Rect x="6" y="6" width="108" height="12" rx="3" fill="#6D4C41" />
    <Path d="M26 68 L26 32 Q60 24 94 32 L94 68" fill="#3E2723" />
    <Path d="M30 68 L30 36 Q60 28 90 36 L90 68" fill="#1A1A1A" />
    <Path d="M50 68 Q46 50 48 44 Q52 38 56 44 Q58 50 54 68" fill="#FF6D00" opacity={0.8} />
    <Path d="M44 68 Q42 56 46 48 Q50 42 54 48 Q56 56 58 68" fill="#FF9800" opacity={0.6} />
    <Path d="M48 68 Q48 58 50 52 Q52 58 52 68" fill="#FFC107" opacity={0.7} />
  </Svg>
);

// --- Resolve which SVG to use ---

function resolveSvg(item: FurnitureItem | undefined, interactionType?: FurnitureInteractionType): string {
  if (item) {
    const id = item.id.toLowerCase();
    if (id.includes('bonsai')) return 'bonsai';
    if (id.includes('mosaic') || id.includes('turkish_lamp') || id.includes('diya')) return 'mosaic_lamp';
    if (id.includes('chandelier')) return 'chandelier';
    if (id.includes('hammock')) return 'hammock';
    if (id.includes('cushion') || id.includes('zabuton')) return 'cushion';
    if (id.includes('fountain')) return 'fountain';
    if (id.includes('guitar') || id.includes('oar')) return 'guitar';
    if (id.includes('mask') || id.includes('skull')) return 'mask';
    if (id.includes('lantern') || id.includes('chochin')) return 'lantern';
    if (id.includes('armoire') || id.includes('tansu') || id.includes('wardrobe')) return 'armoire';
    if (id.includes('tatami')) return 'tatami';
    if (id.includes('tea') && (id.includes('set') || id.includes('trolley'))) return 'tea_set';
    if (id.includes('chair') || id.includes('wingback') || id.includes('leather')) return 'chair';
    if (id.includes('sphinx') || id.includes('bust') || id.includes('elephant') || id.includes('statue')) return 'statue';
    if (id.includes('pottery') || id.includes('talavera') || id.includes('canopic') || id.includes('olive')) return 'pottery';
    if (id.includes('carpet') || id.includes('tapestry') || id.includes('otomi') || id.includes('embroidery')) return 'carpet';
    if (id.includes('fireplace') || id.includes('fender') || id.includes('hearth')) return 'fireplace';
    if (id.includes('clock')) return 'clock';
    if (id.includes('vase') || id.includes('flower') || id.includes('limoges')) return 'vase';
    if (id.includes('lamp')) return 'lamp';
    if (id.includes('plant') || id.includes('cactus')) return 'plant';
    if (id.includes('rug') || id.includes('sarape') || id.includes('throw') || id.includes('tartan')) return 'rug';
    if (id.includes('globe')) return 'globe';
    if (id.includes('candle')) return 'candle';
    if (id.includes('fish_chips_sign') || (id.includes('sign') && item.category === 'wall')) return 'sign';
    if (id.includes('frame') || id.includes('painting') || id.includes('picture') || id.includes('impressionist')) return 'picture';
    if (id.includes('mirror')) return 'mirror';
    if (id.includes('shelf') || id.includes('rack') || id.includes('nook')) return 'shelf';
    if (id.includes('screen') || id.includes('shoji')) return 'picture';
    if (id.includes('espresso') || id.includes('cafe')) return 'tea_set';

    if (item.interactionType) return item.interactionType;
    if (item.category === 'wall') return 'picture';
    if (item.category === 'floor') return 'rug';
    if (item.category === 'decor') return 'vase';
  }
  return interactionType || 'fallback';
}

const SVG_MAP: Record<string, React.FC<{ w: number; h: number }>> = {
  table: TableSvg,
  stove: StoveSvg,
  bed: BedSvg,
  bookshelf: BookshelfSvg,
  toy: ToyBoxSvg,
  picture: PictureFrameSvg,
  sign: SignSvg,
  clock: ClockSvg,
  vase: VaseSvg,
  lamp: LampSvg,
  plant: PlantSvg,
  rug: RugSvg,
  globe: GlobeSvg,
  candle: CandleSvg,
  bonsai: BonsaiSvg,
  mosaic_lamp: MosaicLampSvg,
  mirror: MirrorSvg,
  shelf: ShelfSvg,
  chandelier: ChandelierSvg,
  hammock: HammockSvg,
  cushion: CushionSvg,
  fountain: FountainSvg,
  guitar: GuitarSvg,
  mask: MaskSvg,
  lantern: LanternSvg,
  armoire: ArmoireSvg,
  tatami: TatamiSvg,
  tea_set: TeaSetSvg,
  chair: ChairSvg,
  statue: StatueSvg,
  pottery: PotterySvg,
  carpet: CarpetSvg,
  fireplace: FireplaceSvg,
};

const GlowRing: React.FC<{ w: number; h: number; color: string }> = ({ w, h, color }) => {
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -4,
          left: -4,
          width: w + 8,
          height: h + 8,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: color,
        },
        animStyle,
      ]}
      pointerEvents="none"
    />
  );
};

export const FurnitureVisual: React.FC<FurnitureVisualProps> = ({
  item,
  interactionType,
  icon = 'home',
  size = 'medium',
  style,
  showHint = true,
  glow = false,
  glowColor = colors.primary.wisteria,
  imageUrl,
}) => {
  const dim = typeof size === 'number' ? { w: size, h: size * 0.8 } : SIZES[size] || SIZES.medium;
  const { w, h } = dim;
  const resolved = resolveSvg(item, interactionType);
  const SvgComponent = SVG_MAP[resolved];
  const itemImageUrl = imageUrl || item?.imageUrl;

  const renderFurniture = () => {
    if (SvgComponent) {
      return <SvgComponent w={w} h={h} />;
    }

    if (itemImageUrl) {
      return (
        <View style={[styles.imageFrame, { width: w, height: h }]}>
          <Image
            source={{ uri: itemImageUrl }}
            style={{ width: w - 6, height: h - 6, borderRadius: 10 }}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
          />
        </View>
      );
    }

    return (
      <View style={[styles.fallback, { width: w, height: h }]}>
        <Icon name={(item?.icon || icon) as IconName} size={Math.min(36, w * 0.4)} color={colors.text.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.outer, { width: w + 8, height: h + 8 }, style]}>
      {glow && <GlowRing w={w} h={h} color={glowColor} />}
      <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
        {renderFurniture()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    backgroundColor: colors.surface.cardWarm,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.08)' }
      : { elevation: 2 }),
  },
  imageFrame: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.wisteriaFaded,
    backgroundColor: colors.surface.cardWarm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 3px 8px rgba(0,0,0,0.12)' }
      : { elevation: 3 }),
  },
});

export default FurnitureVisual;
