import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Ellipse,
  Path,
  G,
  Rect,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);
import { colors } from '../../theme/colors';

export interface VisbyAppearance {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  eyeShape: string;
}

export interface VisbyEquipped {
  hat?: string;
  outfit?: string;
  accessory?: string;
  shoes?: string;
  backpack?: string;
  companion?: string;
}

export type VisbyReactionType = 'excited_jump' | 'happy_wiggle' | 'love' | 'sparkle' | null;

export interface VisbyCharacterProps {
  appearance?: VisbyAppearance;
  equipped?: VisbyEquipped;
  mood?: 'happy' | 'excited' | 'sleepy' | 'surprised' | 'thinking' | 'curious' | 'proud' | 'adventurous' | 'cozy' | 'hungry' | 'bored' | 'confused' | 'sick' | 'lonely';
  size?: number;
  animated?: boolean;
  stage?: 'egg' | 'baby' | 'kid' | 'teen' | 'adult';
  reaction?: VisbyReactionType;
  onReactionComplete?: () => void;
  glowColor?: string;
}

const defaultAppearance: VisbyAppearance = {
  skinTone: '#FFAD6B',
  hairColor: '#B8875A',
  hairStyle: 'default',
  eyeColor: '#2A1A0A',
  eyeShape: 'round',
};

function darken(c: string, n: number): string {
  const v = parseInt(c.replace('#', ''), 16);
  const r = Math.max(0, (v >> 16) - n);
  const g = Math.max(0, ((v >> 8) & 0xff) - n);
  const b = Math.max(0, (v & 0xff) - n);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function lighten(c: string, n: number): string {
  const v = parseInt(c.replace('#', ''), 16);
  const r = Math.min(255, (v >> 16) + n);
  const g = Math.min(255, ((v >> 8) & 0xff) + n);
  const b = Math.min(255, (v & 0xff) + n);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const CX = 75;
const BY = 78;

const renderHairStyle = (style: string, hair: string, hairL: string) => {
  switch (style) {
    case 'short':
      return (
        <G>
          <Path d="M 42 38 Q 50 46 46 52" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d="M 42 38 Q 49 44 46 49" stroke={hairL} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 108 38 Q 100 46 104 52" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d="M 108 38 Q 101 44 104 49" stroke={hairL} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 54 36 Q 52 42 53 47" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M 96 36 Q 98 42 97 47" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'long':
      return (
        <G>
          <Path d="M 38 40 Q 24 60 22 85 Q 20 100 28 110" stroke={hair} strokeWidth={12} fill="none" strokeLinecap="round" />
          <Path d="M 38 40 Q 26 62 24 82 Q 22 96 28 106" stroke={hairL} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 112 40 Q 126 60 128 85 Q 130 100 122 110" stroke={hair} strokeWidth={12} fill="none" strokeLinecap="round" />
          <Path d="M 112 40 Q 124 62 126 82 Q 128 96 122 106" stroke={hairL} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 44 38 Q 50 48 47 56" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 106 38 Q 100 48 103 56" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 56 36 Q 54 44 55 50" stroke={hair} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 94 36 Q 96 44 95 50" stroke={hair} strokeWidth={6} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'curly':
      return (
        <G>
          <Path d="M 38 40 Q 26 50 28 64 Q 30 72 24 80" stroke={hair} strokeWidth={10} fill="none" strokeLinecap="round" />
          <Circle cx={24} cy={80} r={7} fill={hair} />
          <Circle cx={24} cy={79} r={4} fill={hairL} opacity={0.5} />
          <Path d="M 112 40 Q 124 50 122 64 Q 120 72 126 80" stroke={hair} strokeWidth={10} fill="none" strokeLinecap="round" />
          <Circle cx={126} cy={80} r={7} fill={hair} />
          <Circle cx={126} cy={79} r={4} fill={hairL} opacity={0.5} />
          <Path d="M 44 38 Q 50 48 46 56" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Circle cx={44} cy={56} r={5} fill={hair} />
          <Path d="M 106 38 Q 100 48 104 56" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Circle cx={106} cy={56} r={5} fill={hair} />
          <Circle cx={56} cy={42} r={4.5} fill={hair} />
          <Circle cx={94} cy={42} r={4.5} fill={hair} />
          <Circle cx={75} cy={38} r={5} fill={hair} />
          <Circle cx={75} cy={37} r={3} fill={hairL} opacity={0.4} />
        </G>
      );
    case 'braids':
      return (
        <G>
          <Path d="M 38 40 Q 28 54 26 68" stroke={hair} strokeWidth={10} fill="none" strokeLinecap="round" />
          <Path d="M 26 68 Q 24 76 22 84 Q 20 92 24 100" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 28 72 L 22 78 L 28 84 L 22 90 L 28 96" stroke={hairL} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Circle cx={24} cy={102} r={5} fill={hair} />
          <Path d="M 112 40 Q 122 54 124 68" stroke={hair} strokeWidth={10} fill="none" strokeLinecap="round" />
          <Path d="M 124 68 Q 126 76 128 84 Q 130 92 126 100" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 122 72 L 128 78 L 122 84 L 128 90 L 122 96" stroke={hairL} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Circle cx={126} cy={102} r={5} fill={hair} />
          <Path d="M 44 38 Q 50 48 47 54" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d="M 106 38 Q 100 48 103 54" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d="M 56 36 Q 54 42 55 48" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M 94 36 Q 96 42 95 48" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'bun':
      return (
        <G>
          <Circle cx={CX} cy={20} r={14} fill={hair} />
          <Circle cx={CX} cy={18} r={10} fill={hairL} opacity={0.4} />
          <Circle cx={72} cy={14} r={3} fill="#FFFFFF" opacity={0.2} />
          <Path d="M 44 38 Q 50 48 47 54" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d="M 106 38 Q 100 48 103 54" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d="M 38 40 Q 28 52 26 66 Q 24 74 30 80" stroke={hair} strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M 112 40 Q 122 52 124 66 Q 126 74 120 80" stroke={hair} strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M 56 36 Q 54 42 55 48" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M 94 36 Q 96 42 95 48" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'default':
    default:
      return (
        <G>
          <Path d="M 38 42 Q 28 54 26 70 Q 24 80 30 86" stroke={hair} strokeWidth={11} fill="none" strokeLinecap="round" />
          <Path d="M 38 42 Q 30 56 28 68 Q 26 76 30 82" stroke={hairL} strokeWidth={5.5} fill="none" strokeLinecap="round" />
          <Path d="M 112 42 Q 122 54 124 70 Q 126 80 120 86" stroke={hair} strokeWidth={11} fill="none" strokeLinecap="round" />
          <Path d="M 112 42 Q 120 56 122 68 Q 124 76 120 82" stroke={hairL} strokeWidth={5.5} fill="none" strokeLinecap="round" />
          <Path d="M 44 40 Q 50 50 47 57" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 44 40 Q 49 48 47 54" stroke={hairL} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <Path d="M 106 40 Q 100 50 103 57" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 106 40 Q 101 48 103 54" stroke={hairL} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <Path d="M 56 38 Q 54 45 55 51" stroke={hair} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 94 38 Q 96 45 95 51" stroke={hair} strokeWidth={6} fill="none" strokeLinecap="round" />
        </G>
      );
  }
};

const renderHat = (hatId: string | undefined, hair: string, hairL: string) => {
  switch (hatId) {
    case 'viking_helmet':
      return (
        <G>
          {/* Helmet dome */}
          <Path d="M 40 40 Q 42 10 75 3 Q 108 10 110 40 Z" fill="#A0A0B4" />
          <Path d="M 44 36 Q 46 16 75 10 Q 104 16 106 36" fill="#B5B5C8" />
          <Path d="M 56 20 Q 64 13 74 16" fill="none" stroke="#D4D4E0" strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
          {/* Helmet brim */}
          <Ellipse cx={CX} cy={40} rx={37} ry={5.5} fill="#8A8A9E" />
          <Ellipse cx={CX} cy={39} rx={35} ry={4} fill="#A0A0B4" />
          {/* Horns */}
          <Path d="M 40 33 Q 24 8 16 18" stroke="#F5F0E8" strokeWidth={10} fill="none" strokeLinecap="round" />
          <Path d="M 110 33 Q 126 8 134 18" stroke="#F5F0E8" strokeWidth={10} fill="none" strokeLinecap="round" />
          <Circle cx={16} cy={18} r={5} fill="#F5F0E8" />
          <Circle cx={134} cy={18} r={5} fill="#F5F0E8" />
          <Circle cx={15} cy={16.5} r={2.2} fill="#FFFFFF" opacity={0.7} />
          <Circle cx={133} cy={16.5} r={2.2} fill="#FFFFFF" opacity={0.7} />
          {/* Horn highlights */}
          <Path d="M 39 30 Q 28 14 20 20" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.2} />
          <Path d="M 111 30 Q 122 14 130 20" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.2} />
          {/* Center gem */}
          <Circle cx={CX} cy={23} r={5.5} fill="#FFD700" />
          <Circle cx={CX} cy={22} r={3.5} fill="#FFF4B0" />
          <Circle cx={74} cy={21} r={1.5} fill="#FFFFFF" opacity={0.9} />
          {/* Studs */}
          <Circle cx={55} cy={38} r={2.5} fill="#E0C060" />
          <Circle cx={95} cy={38} r={2.5} fill="#E0C060" />
        </G>
      );
    case 'crown':
      return (
        <G>
          <Path d="M 46 40 L 50 12 L 58 24 L 66 6 L 75 24 L 84 6 L 92 24 L 100 12 L 104 40 Z" fill="#FFD700" />
          <Rect x={46} y={36} width={58} height={6} rx={3} fill="#E8B800" />
          <Circle cx={66} cy={22} r={3} fill="#DC143C" />
          <Circle cx={CX} cy={16} r={3.5} fill="#4169E1" />
          <Circle cx={84} cy={22} r={3} fill="#50C878" />
        </G>
      );
    case 'samurai_helmet':
      return (
        <G>
          <Path d="M 38 42 Q 40 6 75 0 Q 110 6 112 42 Z" fill="#2F3040" />
          <Path d="M 60 0 L 75 -12 L 90 0" fill="#C41E3A" />
          <Rect x={36} y={38} width={78} height={5} rx={2.5} fill="#FFD700" />
        </G>
      );
    case 'sombrero':
      return (
        <G>
          <Ellipse cx={CX} cy={34} rx={54} ry={9} fill="#D4883A" />
          <Path d="M 54 34 Q 58 8 75 4 Q 92 8 96 34 Z" fill="#A06020" />
          <Ellipse cx={CX} cy={34} rx={50} ry={3.5} fill="none" stroke="#FFD700" strokeWidth={2} />
        </G>
      );
    case 'beret':
      return (
        <G>
          <Ellipse cx={72} cy={26} rx={30} ry={16} fill="#2C2C54" />
          <Circle cx={72} cy={12} r={4} fill="#3D3D6B" />
        </G>
      );
    case 'top_hat':
      return (
        <G>
          <Ellipse cx={CX} cy={32} rx={34} ry={7} fill="#1A1A2E" />
          <Rect x={56} y={0} width={38} height={32} rx={5} fill="#2A2A3E" />
          <Rect x={56} y={22} width={38} height={4} rx={1.5} fill="#9B89D0" />
        </G>
      );
    case 'rice_hat':
      return (
        <G>
          <Path d="M 24 40 L 75 2 L 126 40 Z" fill="#F5DEB3" />
          <Path d="M 34 36 L 75 8 L 116 36" fill="none" stroke="#D4B896" strokeWidth={1.5} />
        </G>
      );
    case 'turban':
      return (
        <G>
          <Ellipse cx={CX} cy={26} rx={32} ry={20} fill="#FF8C00" />
          <Path d="M 46 24 Q 58 4 75 10 Q 92 4 104 24" stroke="#FFB040" strokeWidth={3.5} fill="none" />
          <Circle cx={CX} cy={10} r={6} fill="#DC143C" />
        </G>
      );
    case 'fez':
      return (
        <G>
          <Path d="M 60 40 L 64 12 L 86 12 L 90 40 Z" fill="#DC143C" />
          <Rect x={58} y={37} width={34} height={5} rx={2.5} fill="#B01030" />
          <Path d="M 75 12 Q 84 8 88 16" stroke="#2C2C54" strokeWidth={1.5} fill="none" />
          <Circle cx={88} cy={16} r={3} fill="#2C2C54" />
        </G>
      );
    case 'ushanka':
      return (
        <G>
          <Path d="M 40 40 Q 42 12 75 6 Q 108 12 110 40 Z" fill="#6B3A20" />
          <Ellipse cx={CX} cy={40} rx={40} ry={8} fill="#E8D0B4" />
          <Circle cx={CX} cy={18} r={5} fill="#DC143C" />
        </G>
      );
    case 'feather_headdress':
      return (
        <G>
          <Rect x={44} y={34} width={62} height={6} rx={3} fill="#8B5A30" />
          {[
            { x: 54, a: -14, c: '#40E0D0' }, { x: 64, a: -6, c: '#FF6347' },
            { x: 74, a: 0, c: '#FFD700' }, { x: 84, a: 6, c: '#50C878' },
            { x: 94, a: 14, c: '#9B59B6' },
          ].map((f, i) => (
            <Path key={i} d={`M ${f.x} 34 Q ${f.x + f.a * 0.3} 8 ${f.x + f.a * 0.4} -4`}
              stroke={f.c} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          ))}
        </G>
      );
    case 'pharaoh_crown':
      return (
        <G>
          <Path d="M 40 40 Q 42 8 75 0 Q 108 8 110 40 Z" fill="#2C5AA0" />
          <Path d="M 55 0 L 75 -14 L 95 0" fill="#FFD700" />
          <Rect x={38} y={36} width={74} height={6} rx={3} fill="#FFD700" />
          <Circle cx={CX} cy={20} r={5} fill="#FFD700" />
          <Path d="M 70 -10 Q 75 -18 80 -10" fill="#DC143C" />
        </G>
      );
    case 'geisha_hairpin':
      return (
        <G>
          <Path d="M 92 18 L 94 38" stroke="#2F2F2F" strokeWidth={2} strokeLinecap="round" />
          <Circle cx={92} cy={14} r={7} fill="#FF69B4" />
          <Circle cx={92} cy={13} r={4} fill="#FFB6C1" />
          <Circle cx={88} cy={10} r={3} fill="#FF1493" opacity={0.6} />
          <Circle cx={96} cy={10} r={2.5} fill="#FF69B4" opacity={0.5} />
          <Path d="M 86 20 L 84 28" stroke="#FFD700" strokeWidth={1.2} strokeLinecap="round" />
          <Circle cx={84} cy={30} r={2} fill="#FFD700" />
        </G>
      );
    case 'cowboy_hat':
      return (
        <G>
          <Ellipse cx={CX} cy={34} rx={50} ry={8} fill="#8B5A30" />
          <Path d="M 50 34 Q 52 10 75 6 Q 98 10 100 34 Z" fill="#A0703C" />
          <Ellipse cx={CX} cy={34} rx={46} ry={3} fill="none" stroke="#6B3A20" strokeWidth={1.5} />
          <Rect x={62} y={28} width={26} height={4} rx={2} fill="#6B3A20" />
          <Circle cx={CX} cy={30} r={2} fill="#FFD700" />
        </G>
      );
    case 'toque_chef_hat':
      return (
        <G>
          <Rect x={52} y={18} width={46} height={22} rx={4} fill="#FFFFFF" />
          <Ellipse cx={CX} cy={14} rx={28} ry={16} fill="#FFFFFF" />
          <Ellipse cx={CX} cy={12} rx={24} ry={12} fill="#F8F8F8" />
          <Path d="M 58 14 Q 62 6 68 10" stroke="#E8E8E8" strokeWidth={1} fill="none" />
        </G>
      );
    case 'conical_straw_hat':
      return (
        <G>
          <Path d="M 28 42 L 75 0 L 122 42 Z" fill="#DEB887" />
          <Path d="M 38 38 L 75 6 L 112 38" fill="none" stroke="#C4A060" strokeWidth={1.5} />
          <Path d="M 48 34 L 75 12 L 102 34" fill="none" stroke="#C4A060" strokeWidth={1} />
          <Ellipse cx={CX} cy={42} rx={48} ry={4} fill="#C4A060" />
        </G>
      );
    case 'flower_crown':
      return (
        <G>
          <Path d="M 42 36 Q 58 28 75 30 Q 92 28 108 36" stroke="#228B22" strokeWidth={4} fill="none" strokeLinecap="round" />
          {[
            { cx: 48, cy: 32, c: '#FF69B4' }, { cx: 58, cy: 28, c: '#FFD700' },
            { cx: 68, cy: 26, c: '#FF6347' }, { cx: 78, cy: 25, c: '#DA70D6' },
            { cx: 88, cy: 27, c: '#87CEEB' }, { cx: 98, cy: 30, c: '#FFB6C1' },
          ].map((f, i) => (
            <G key={i}>
              <Circle cx={f.cx} cy={f.cy} r={5} fill={f.c} />
              <Circle cx={f.cx} cy={f.cy} r={2.5} fill="#FFFFFF" opacity={0.4} />
            </G>
          ))}
        </G>
      );
    case 'pirate_hat':
      return (
        <G>
          <Ellipse cx={CX} cy={30} rx={38} ry={20} fill="#2F2F2F" />
          <Path d="M 40 30 Q 50 8 75 12 Q 100 8 110 30" fill="#2F2F2F" />
          <Ellipse cx={CX} cy={30} rx={36} ry={4} fill="#3D3D3D" />
          <Circle cx={CX} cy={18} r={6} fill="#FFFFFF" />
          <Path d="M 72 14 L 75 18 L 78 14 L 76 18 L 79 16 L 76 19 L 75 22 L 74 19 L 71 16 L 74 18 Z" fill="#2F2F2F" />
        </G>
      );
    case 'astronaut_helmet':
      return (
        <G>
          <Ellipse cx={CX} cy={40} rx={42} ry={38} fill="#D0D0D8" />
          <Ellipse cx={CX} cy={38} rx={36} ry={32} fill="#1A2744" opacity={0.6} />
          <Ellipse cx={CX} cy={36} rx={32} ry={28} fill="#87CEEB" opacity={0.3} />
          <Path d="M 54 18 Q 62 10 72 14" stroke="#FFFFFF" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.5} />
          <Rect x={44} y={66} width={62} height={6} rx={3} fill="#A0A0B4" />
        </G>
      );
    case 'festival_headband':
      return (
        <G>
          <Rect x={42} y={32} width={66} height={6} rx={3} fill="#FF6B9D" />
          {[48, 58, 68, 78, 88, 98].map((x, i) => (
            <Circle key={i} cx={x} cy={35} r={2.5} fill={['#FFD700', '#40E0D0', '#FF6347', '#9B59B6', '#50C878', '#FF69B4'][i]} />
          ))}
          <Path d="M 42 35 Q 36 40 34 50" stroke="#FF6B9D" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 108 35 Q 114 40 116 50" stroke="#FF6B9D" strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'arctic_hood':
      return (
        <G>
          <Path d="M 36 44 Q 38 10 75 4 Q 112 10 114 44 Z" fill="#4A6E8C" />
          <Ellipse cx={CX} cy={44} rx={42} ry={8} fill="#E8D8C4" />
          <Ellipse cx={CX} cy={44} rx={38} ry={5} fill="#F5EDE0" />
        </G>
      );
    default:
      return null;
  }
};

const renderAccessory = (accessoryId: string | undefined) => {
  switch (accessoryId) {
    case 'sword':
      return (
        <G>
          <Rect x={120} y={76} width={3.5} height={30} rx={1.75} fill="#D0D0D8" />
          <Rect x={114} y={74} width={15} height={4} rx={2} fill="#6B4020" />
          <Circle cx={121.5} cy={76} r={2} fill="#FFD700" />
        </G>
      );
    case 'shield':
      return (
        <G>
          <Path d="M 10 78 L 26 68 L 42 78 L 26 100 Z" fill="#2E5090" stroke="#FFD700" strokeWidth={1.5} />
          <Path d="M 20 80 L 26 74 L 32 80 L 26 92 Z" fill="#FFD700" />
        </G>
      );
    case 'scarf':
      return (
        <G>
          <Path d="M 44 92 Q 75 100 106 92" stroke="#DC143C" strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 44 94 L 34 112" stroke="#DC143C" strokeWidth={5} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'necklace':
      return (
        <G>
          <Path d="M 48 90 Q 75 98 102 90" stroke="#FFD700" strokeWidth={1.5} fill="none" />
          <Circle cx={CX} cy={96} r={4} fill="#40E0D0" />
        </G>
      );
    case 'fan':
      return (
        <G>
          <Path d="M 120 78 L 130 60 Q 140 54 144 62 L 130 82 Z" fill="#F5E6D0" />
          <Path d="M 122 76 L 132 62" stroke="#DC143C" strokeWidth={0.8} fill="none" />
          <Path d="M 126 78 L 136 62" stroke="#DC143C" strokeWidth={0.8} fill="none" />
          <Rect x={118} y={78} width={14} height={3} rx={1.5} fill="#8B5A30" />
        </G>
      );
    case 'maracas':
      return (
        <G>
          <Rect x={120} y={80} width={3} height={18} rx={1.5} fill="#8B5A30" />
          <Ellipse cx={121.5} cy={76} rx={7} ry={8} fill="#FF6347" />
          <Path d="M 117 74 Q 121 70 126 74" stroke="#FFD700" strokeWidth={1.5} fill="none" />
        </G>
      );
    case 'lantern':
      return (
        <G>
          <Path d="M 120 66 L 122 62 L 128 62 L 130 66" stroke="#8B5A30" strokeWidth={1.5} fill="none" />
          <Ellipse cx={125} cy={76} rx={8} ry={10} fill="#FF4500" opacity={0.8} />
          <Ellipse cx={125} cy={76} rx={5} ry={7} fill="#FFD700" opacity={0.5} />
          <Rect x={122} y={64} width={6} height={3} rx={1} fill="#DC143C" />
        </G>
      );
    case 'bagpipes':
      return (
        <G>
          <Ellipse cx={16} cy={90} rx={10} ry={8} fill="#8B4513" />
          <Rect x={14} y={76} width={3} height={14} rx={1} fill="#2F2F2F" />
          <Rect x={20} y={72} width={3} height={10} rx={1} fill="#2F2F2F" />
          <Rect x={8} y={80} width={3} height={10} rx={1} fill="#2F2F2F" />
          <Path d="M 26 90 Q 35 92 44 88" stroke="#3D6B3D" strokeWidth={3} fill="none" />
        </G>
      );
    case 'magic_wand':
      return (
        <G>
          <Rect x={120} y={68} width={3} height={28} rx={1.5} fill="#5C4D7D" />
          <Path d="M 121.5 64 L 123 60 L 124.5 64 L 128.5 65.5 L 124.5 67 L 123 71 L 121.5 67 L 117.5 65.5 Z" fill="#FFD700" />
          <Circle cx={121.5} cy={65.5} r={2} fill="#FFFFFF" opacity={0.6} />
        </G>
      );
    case 'compass_acc':
      return (
        <G>
          <Circle cx={124} cy={84} r={8} fill="#D4A060" />
          <Circle cx={124} cy={84} r={6.5} fill="#F5F0E8" />
          <Path d="M 124 78 L 124 90 M 118 84 L 130 84" stroke="#DC143C" strokeWidth={1} />
          <Path d="M 122 82 L 124 78 L 126 82" fill="#DC143C" />
        </G>
      );
    case 'telescope':
      return (
        <G>
          <Rect x={118} y={72} width={4} height={22} rx={2} fill="#8B6F4E" />
          <Rect x={116} y={68} width={8} height={6} rx={2} fill="#6B5030" />
          <Circle cx={120} cy={68} r={4.5} fill="#87CEEB" opacity={0.4} />
        </G>
      );
    case 'golden_necklace':
      return (
        <G>
          <Path d="M 46 90 Q 75 100 104 90" stroke="#FFD700" strokeWidth={2} fill="none" />
          <Circle cx={CX} cy={98} r={5} fill="#FFD700" />
          <Circle cx={CX} cy={97} r={3} fill="#FFF4B0" />
          <Circle cx={74} cy={96} r={1} fill="#FFFFFF" opacity={0.8} />
        </G>
      );
    case 'friendship_bracelet':
      return (
        <G>
          <Ellipse cx={28} cy={94} rx={6} ry={3} fill="none" stroke="#FF69B4" strokeWidth={2.5} />
          <Ellipse cx={28} cy={94} rx={6} ry={3} fill="none" stroke="#40E0D0" strokeWidth={1} strokeDasharray="2 2" />
        </G>
      );
    case 'drum':
      return (
        <G>
          <Ellipse cx={CX} cy={118} rx={16} ry={4} fill="#6B3A20" />
          <Rect x={59} y={106} width={32} height={12} rx={2} fill="#A0522D" />
          <Ellipse cx={CX} cy={106} rx={16} ry={4} fill="#D4A060" />
          <Path d="M 59 110 L 91 110" stroke="#FFD700" strokeWidth={1} />
        </G>
      );
    case 'paintbrush':
      return (
        <G>
          <Rect x={120} y={74} width={3} height={20} rx={1} fill="#D4A060" />
          <Path d="M 118 70 Q 121.5 64 125 70 L 123 76 L 120 76 Z" fill="#4169E1" />
          <Circle cx={121} cy={68} r={1.5} fill="#FFFFFF" opacity={0.4} />
        </G>
      );
    case 'camera_acc':
      return (
        <G>
          <Rect x={114} y={78} width={18} height={12} rx={3} fill="#2F2F2F" />
          <Circle cx={123} cy={84} r={4} fill="#1A1A2E" />
          <Circle cx={123} cy={84} r={2.5} fill="#4A6E8C" />
          <Circle cx={122} cy={83} r={1} fill="#FFFFFF" opacity={0.5} />
          <Rect x={118} y={76} width={6} height={3} rx={1} fill="#3D3D3D" />
        </G>
      );
    case 'fishing_rod':
      return (
        <G>
          <Path d="M 124 60 L 124 110" stroke="#8B5A30" strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M 124 60 Q 130 56 136 62" stroke="#A0A0B4" strokeWidth={1} fill="none" />
          <Path d="M 136 62 L 136 72" stroke="#A0A0B4" strokeWidth={0.8} />
          <Circle cx={136} cy={74} r={2} fill="#FF6347" />
        </G>
      );
    case 'musical_instrument':
      return (
        <G>
          <Circle cx={18} cy={94} r={10} fill="#D4A060" />
          <Circle cx={18} cy={94} r={4} fill="#2F2F2F" />
          <Rect x={26} y={80} width={3} height={20} rx={1} fill="#8B5A30" />
          <Path d="M 27 80 L 27 76 M 25 76 L 29 76" stroke="#A0A0B4" strokeWidth={1} />
        </G>
      );
    default:
      return null;
  }
};

const renderShoes = (shoeId: string | undefined) => {
  switch (shoeId) {
    case 'default_boots':
      return (
        <G>
          <Rect x={50} y={128} width={20} height={12} rx={4} fill="#8B5A30" />
          <Rect x={80} y={128} width={20} height={12} rx={4} fill="#8B5A30" />
          <Rect x={50} y={128} width={20} height={5} rx={2} fill="#A0703C" />
          <Rect x={80} y={128} width={20} height={5} rx={2} fill="#A0703C" />
        </G>
      );
    case 'wooden_clogs':
      return (
        <G>
          <Path d="M 48 132 Q 48 126 60 126 Q 72 126 72 132 L 72 140 Q 60 142 48 140 Z" fill="#DEB887" />
          <Path d="M 78 132 Q 78 126 90 126 Q 102 126 102 132 L 102 140 Q 90 142 78 140 Z" fill="#DEB887" />
          <Path d="M 50 130 L 70 130" stroke="#C4A060" strokeWidth={1} />
          <Path d="M 80 130 L 100 130" stroke="#C4A060" strokeWidth={1} />
        </G>
      );
    case 'sandals':
      return (
        <G>
          <Ellipse cx={60} cy={136} rx={10} ry={5} fill="#D4A060" />
          <Ellipse cx={90} cy={136} rx={10} ry={5} fill="#D4A060" />
          <Path d="M 54 134 Q 60 128 66 134" stroke="#8B5A30" strokeWidth={2} fill="none" />
          <Path d="M 84 134 Q 90 128 96 134" stroke="#8B5A30" strokeWidth={2} fill="none" />
        </G>
      );
    case 'cowboy_boots':
      return (
        <G>
          <Path d="M 48 124 L 48 140 L 72 140 L 72 134 L 64 134 L 64 124 Z" fill="#6B3A20" />
          <Path d="M 78 124 L 78 140 L 102 140 L 102 134 L 94 134 L 94 124 Z" fill="#6B3A20" />
          <Rect x={48} y={126} width={16} height={3} rx={1} fill="#8B5A30" />
          <Rect x={78} y={126} width={16} height={3} rx={1} fill="#8B5A30" />
          <Path d="M 50 132 L 62 132" stroke="#A0522D" strokeWidth={1} />
          <Path d="M 80 132 L 92 132" stroke="#A0522D" strokeWidth={1} />
        </G>
      );
    case 'ballet_slippers':
      return (
        <G>
          <Ellipse cx={60} cy={136} rx={10} ry={5} fill="#FFB6C1" />
          <Ellipse cx={90} cy={136} rx={10} ry={5} fill="#FFB6C1" />
          <Path d="M 56 130 Q 60 124 64 130" stroke="#FF69B4" strokeWidth={1.5} fill="none" />
          <Path d="M 86 130 Q 90 124 94 130" stroke="#FF69B4" strokeWidth={1.5} fill="none" />
          <Circle cx={60} cy={132} r={2} fill="#FF69B4" />
          <Circle cx={90} cy={132} r={2} fill="#FF69B4" />
        </G>
      );
    case 'ninja_tabi':
      return (
        <G>
          <Rect x={50} y={128} width={20} height={10} rx={3} fill="#1A1A1A" />
          <Rect x={80} y={128} width={20} height={10} rx={3} fill="#1A1A1A" />
          <Path d="M 60 138 L 60 130" stroke="#2D2D2D" strokeWidth={1} />
          <Path d="M 90 138 L 90 130" stroke="#2D2D2D" strokeWidth={1} />
        </G>
      );
    case 'hiking_boots':
      return (
        <G>
          <Rect x={48} y={126} width={22} height={14} rx={4} fill="#5C4033" />
          <Rect x={80} y={126} width={22} height={14} rx={4} fill="#5C4033" />
          <Rect x={48} y={138} width={24} height={4} rx={2} fill="#3D2B1F" />
          <Rect x={80} y={138} width={24} height={4} rx={2} fill="#3D2B1F" />
          <Path d="M 52 130 L 66 130 M 52 134 L 66 134" stroke="#FFD700" strokeWidth={1} />
          <Path d="M 84 130 L 98 130 M 84 134 L 98 134" stroke="#FFD700" strokeWidth={1} />
        </G>
      );
    case 'gladiator_sandals':
      return (
        <G>
          <Ellipse cx={60} cy={138} rx={10} ry={4} fill="#A0703C" />
          <Ellipse cx={90} cy={138} rx={10} ry={4} fill="#A0703C" />
          {[126, 130, 134].map((y) => (
            <G key={y}>
              <Path d={`M 52 ${y} L 68 ${y}`} stroke="#8B5A30" strokeWidth={2} />
              <Path d={`M 82 ${y} L 98 ${y}`} stroke="#8B5A30" strokeWidth={2} />
            </G>
          ))}
        </G>
      );
    case 'snow_boots':
      return (
        <G>
          <Rect x={46} y={124} width={24} height={18} rx={6} fill="#4A6E8C" />
          <Rect x={80} y={124} width={24} height={18} rx={6} fill="#4A6E8C" />
          <Ellipse cx={58} cy={126} rx={13} ry={4} fill="#F5EDE0" />
          <Ellipse cx={92} cy={126} rx={13} ry={4} fill="#F5EDE0" />
          <Rect x={46} y={138} width={26} height={5} rx={2.5} fill="#3A5A72" />
          <Rect x={80} y={138} width={26} height={5} rx={2.5} fill="#3A5A72" />
        </G>
      );
    case 'moon_boots':
      return (
        <G>
          <Rect x={44} y={122} width={26} height={20} rx={6} fill="#C0C0D0" />
          <Rect x={80} y={122} width={26} height={20} rx={6} fill="#C0C0D0" />
          <Rect x={44} y={140} width={28} height={5} rx={2.5} fill="#A0A0B4" />
          <Rect x={80} y={140} width={28} height={5} rx={2.5} fill="#A0A0B4" />
          <Path d="M 50 126 L 64 126 M 50 132 L 64 132" stroke="#87CEEB" strokeWidth={1.5} />
          <Path d="M 86 126 L 100 126 M 86 132 L 100 132" stroke="#87CEEB" strokeWidth={1.5} />
        </G>
      );
    case 'running_shoes':
      return (
        <G>
          <Rect x={48} y={130} width={22} height={10} rx={5} fill="#4169E1" />
          <Rect x={80} y={130} width={22} height={10} rx={5} fill="#4169E1" />
          <Path d="M 52 134 L 58 132 L 64 134" stroke="#FFFFFF" strokeWidth={1.5} fill="none" />
          <Path d="M 84 134 L 90 132 L 96 134" stroke="#FFFFFF" strokeWidth={1.5} fill="none" />
          <Rect x={48} y={138} width={24} height={3} rx={1.5} fill="#2F2F8F" />
          <Rect x={80} y={138} width={24} height={3} rx={1.5} fill="#2F2F8F" />
        </G>
      );
    default:
      return null;
  }
};

const renderBackpack = (backpackId: string | undefined) => {
  switch (backpackId) {
    case 'default_backpack':
      return (
        <G>
          <Rect x={56} y={88} width={38} height={30} rx={6} fill="#6B5B95" />
          <Rect x={60} y={92} width={30} height={10} rx={3} fill="#5C4D7D" />
          <Rect x={68} y={86} width={14} height={6} rx={2} fill="#7B6BA5" />
        </G>
      );
    case 'explorer_backpack':
      return (
        <G>
          <Rect x={54} y={86} width={42} height={34} rx={6} fill="#5C4033" />
          <Rect x={58} y={90} width={34} height={12} rx={3} fill="#6B4D3A" />
          <Rect x={66} y={84} width={18} height={8} rx={3} fill="#7B5D4A" />
          <Circle cx={CX} cy={84} r={2.5} fill="#FFD700" />
          <Path d="M 62 98 L 88 98" stroke="#8B5A30" strokeWidth={1.5} />
        </G>
      );
    case 'samurai_pack':
      return (
        <G>
          <Rect x={56} y={86} width={38} height={32} rx={4} fill="#2F3040" />
          <Path d="M 56 90 L 94 90 M 56 100 L 94 100" stroke="#FFD700" strokeWidth={1} />
          <Circle cx={CX} cy={95} r={4} fill="#C41E3A" />
        </G>
      );
    case 'school_backpack':
      return (
        <G>
          <Rect x={56} y={88} width={38} height={30} rx={8} fill="#4169E1" />
          <Rect x={62} y={92} width={26} height={10} rx={3} fill="#2E5090" />
          <Rect x={68} y={86} width={14} height={6} rx={3} fill="#5588DD" />
          <Circle cx={CX} cy={88} r={2} fill="#FFD700" />
        </G>
      );
    case 'treasure_chest_pack':
      return (
        <G>
          <Rect x={56} y={90} width={38} height={26} rx={4} fill="#8B5A30" />
          <Rect x={56} y={88} width={38} height={8} rx={3} fill="#A0703C" />
          <Rect x={72} y={98} width={6} height={6} rx={1} fill="#FFD700" />
          <Circle cx={CX} cy={101} r={2} fill="#FFF4B0" />
        </G>
      );
    case 'camping_backpack':
      return (
        <G>
          <Rect x={52} y={84} width={46} height={38} rx={6} fill="#228B22" />
          <Rect x={56} y={88} width={38} height={14} rx={3} fill="#1B6B1B" />
          <Rect x={64} y={82} width={22} height={8} rx={3} fill="#2EA02E" />
          <Ellipse cx={CX} cy={126} rx={8} ry={4} fill="#3D3D3D" />
          <Path d="M 60 94 L 90 94" stroke="#FFD700" strokeWidth={1.5} />
        </G>
      );
    case 'jetpack':
      return (
        <G>
          <Rect x={58} y={86} width={14} height={28} rx={4} fill="#A0A0B4" />
          <Rect x={78} y={86} width={14} height={28} rx={4} fill="#A0A0B4" />
          <Rect x={60} y={88} width={10} height={6} rx={2} fill="#87CEEB" opacity={0.5} />
          <Rect x={80} y={88} width={10} height={6} rx={2} fill="#87CEEB" opacity={0.5} />
          <Ellipse cx={65} cy={118} rx={5} ry={8} fill="#FF6347" opacity={0.6} />
          <Ellipse cx={85} cy={118} rx={5} ry={8} fill="#FF6347" opacity={0.6} />
          <Ellipse cx={65} cy={116} rx={3} ry={5} fill="#FFD700" opacity={0.4} />
          <Ellipse cx={85} cy={116} rx={3} ry={5} fill="#FFD700" opacity={0.4} />
        </G>
      );
    case 'messenger_bag':
      return (
        <G>
          <Path d="M 42 86 Q 42 82 46 82 L 108 82 Q 112 82 112 86" stroke="#8B5A30" strokeWidth={2.5} fill="none" />
          <Rect x={86} y={90} width={28} height={22} rx={4} fill="#A0703C" />
          <Rect x={88} y={94} width={24} height={8} rx={2} fill="#8B5A30" />
          <Circle cx={100} cy={92} r={2} fill="#FFD700" />
        </G>
      );
    case 'drum_backpack':
      return (
        <G>
          <Ellipse cx={CX} cy={92} rx={18} ry={4} fill="#8B5A30" />
          <Rect x={57} y={92} width={36} height={22} rx={2} fill="#A0522D" />
          <Ellipse cx={CX} cy={114} rx={18} ry={4} fill="#8B5A30" />
          <Path d="M 62 96 L 88 110 M 88 96 L 62 110" stroke="#F5DEB3" strokeWidth={1.5} />
        </G>
      );
    default:
      return null;
  }
};

const renderCompanion = (companionId: string | undefined) => {
  switch (companionId) {
    case 'shiba_inu':
      return (
        <G>
          <Ellipse cx={130} cy={134} rx={10} ry={8} fill="#D4883A" />
          <Circle cx={134} cy={126} r={7} fill="#D4883A" />
          <Path d="M 130 120 L 128 114 L 132 120" fill="#D4883A" />
          <Path d="M 136 120 L 138 114 L 140 120" fill="#D4883A" />
          <Circle cx={132} cy={125} r={1.5} fill="#2F2F2F" />
          <Circle cx={137} cy={125} r={1.5} fill="#2F2F2F" />
          <Ellipse cx={134.5} cy={128} rx={2} ry={1.5} fill="#2F2F2F" />
          <Path d="M 120 136 Q 116 130 118 126" stroke="#D4883A" strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'parrot':
      return (
        <G>
          <Ellipse cx={34} cy={56} rx={6} ry={8} fill="#FF4500" />
          <Circle cx={34} cy={48} r={5} fill="#FF6347" />
          <Circle cx={32} cy={47} r={1.5} fill="#2F2F2F" />
          <Path d="M 36 48 L 40 47 L 37 50" fill="#FFD700" />
          <Path d="M 30 62 Q 28 70 32 74" stroke="#40E0D0" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 34 62 Q 32 70 36 74" stroke="#FFD700" strokeWidth={2} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'cat':
      return (
        <G>
          <Ellipse cx={130} cy={136} rx={8} ry={6} fill="#6B6B6B" />
          <Circle cx={134} cy={130} r={5.5} fill="#6B6B6B" />
          <Path d="M 130 126 L 129 120 L 132 125" fill="#6B6B6B" />
          <Path d="M 137 126 L 139 120 L 140 125" fill="#6B6B6B" />
          <Circle cx={132} cy={129} r={1.2} fill="#50C878" />
          <Circle cx={136} cy={129} r={1.2} fill="#50C878" />
          <Path d="M 122 138 Q 118 134 120 130" stroke="#6B6B6B" strokeWidth={2} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'penguin':
      return (
        <G>
          <Ellipse cx={130} cy={134} rx={8} ry={10} fill="#2F2F2F" />
          <Ellipse cx={130} cy={136} rx={5} ry={7} fill="#FFFFFF" />
          <Circle cx={130} cy={126} r={6} fill="#2F2F2F" />
          <Circle cx={128} cy={125} r={1.5} fill="#FFFFFF" />
          <Circle cx={132} cy={125} r={1.5} fill="#FFFFFF" />
          <Circle cx={128} cy={125.5} r={0.8} fill="#2F2F2F" />
          <Circle cx={132} cy={125.5} r={0.8} fill="#2F2F2F" />
          <Path d="M 129 128 L 130 130 L 131 128" fill="#FF8C00" />
          <Ellipse cx={128} cy={142} rx={3} ry={1.5} fill="#FF8C00" />
          <Ellipse cx={132} cy={142} rx={3} ry={1.5} fill="#FF8C00" />
        </G>
      );
    case 'baby_dragon':
      return (
        <G>
          <Ellipse cx={18} cy={42} rx={8} ry={6} fill="#50C878" />
          <Circle cx={18} cy={34} r={6} fill="#50C878" />
          <Circle cx={16} cy={33} r={1.5} fill="#FFD700" />
          <Circle cx={20} cy={33} r={1.5} fill="#FFD700" />
          <Path d="M 16 37 L 18 39 L 20 37" fill="#FF6347" />
          <Path d="M 12 36 Q 6 30 10 26" stroke="#50C878" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 24 36 Q 30 30 26 26" stroke="#50C878" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 26 42 Q 30 46 28 50" stroke="#50C878" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M 16 30 L 14 26 L 18 28" fill="#50C878" />
          <Path d="M 20 30 L 22 26 L 24 28" fill="#50C878" />
        </G>
      );
    case 'owl':
      return (
        <G>
          <Ellipse cx={34} cy={52} rx={7} ry={9} fill="#8B6F4E" />
          <Circle cx={34} cy={44} r={6} fill="#A08060" />
          <Circle cx={32} cy={43} r={3} fill="#FFFFFF" />
          <Circle cx={36} cy={43} r={3} fill="#FFFFFF" />
          <Circle cx={32} cy={43.5} r={1.5} fill="#2F2F2F" />
          <Circle cx={36} cy={43.5} r={1.5} fill="#2F2F2F" />
          <Path d="M 33 47 L 34 48.5 L 35 47" fill="#D4A060" />
          <Path d="M 30 38 L 28 34 L 31 37" fill="#A08060" />
          <Path d="M 38 38 L 40 34 L 37 37" fill="#A08060" />
        </G>
      );
    case 'panda':
      return (
        <G>
          <Ellipse cx={130} cy={134} rx={10} ry={8} fill="#FFFFFF" />
          <Circle cx={130} cy={126} r={7} fill="#FFFFFF" />
          <Circle cx={128} cy={125} r={3.5} fill="#2F2F2F" />
          <Circle cx={132} cy={125} r={3.5} fill="#2F2F2F" />
          <Circle cx={128} cy={125} r={1.5} fill="#FFFFFF" />
          <Circle cx={132} cy={125} r={1.5} fill="#FFFFFF" />
          <Ellipse cx={130} cy={128.5} rx={2} ry={1.5} fill="#2F2F2F" />
          <Circle cx={126} cy={120} r={3} fill="#2F2F2F" />
          <Circle cx={134} cy={120} r={3} fill="#2F2F2F" />
          <Ellipse cx={122} cy={136} rx={3} ry={5} fill="#2F2F2F" />
          <Ellipse cx={138} cy={136} rx={3} ry={5} fill="#2F2F2F" />
        </G>
      );
    case 'fox':
      return (
        <G>
          <Ellipse cx={130} cy={136} rx={8} ry={6} fill="#D4620A" />
          <Circle cx={132} cy={128} r={6} fill="#D4620A" />
          <Path d="M 128 124 L 126 118 L 130 123" fill="#D4620A" />
          <Path d="M 136 124 L 138 118 L 140 123" fill="#D4620A" />
          <Circle cx={130} cy={127} r={1.2} fill="#2F2F2F" />
          <Circle cx={134} cy={127} r={1.2} fill="#2F2F2F" />
          <Ellipse cx={132} cy={130} rx={1.5} ry={1} fill="#2F2F2F" />
          <Ellipse cx={132} cy={132} rx={3} ry={2} fill="#FFFFFF" />
          <Path d="M 122 138 Q 118 132 116 128" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'butterfly_swarm':
      return (
        <G>
          {[
            { x: 18, y: 30, c: '#FF69B4', s: 4 },
            { x: 128, y: 26, c: '#87CEEB', s: 3.5 },
            { x: 22, y: 50, c: '#FFD700', s: 3 },
            { x: 132, y: 46, c: '#DA70D6', s: 4.5 },
            { x: 16, y: 70, c: '#40E0D0', s: 3 },
          ].map((b, i) => (
            <G key={i}>
              <Path d={`M ${b.x} ${b.y} Q ${b.x - b.s} ${b.y - b.s} ${b.x - b.s * 1.2} ${b.y} Q ${b.x - b.s} ${b.y + b.s} ${b.x} ${b.y}`} fill={b.c} opacity={0.7} />
              <Path d={`M ${b.x} ${b.y} Q ${b.x + b.s} ${b.y - b.s} ${b.x + b.s * 1.2} ${b.y} Q ${b.x + b.s} ${b.y + b.s} ${b.x} ${b.y}`} fill={b.c} opacity={0.7} />
            </G>
          ))}
        </G>
      );
    case 'golden_eagle':
      return (
        <G>
          <Ellipse cx={20} cy={24} rx={6} ry={4} fill="#8B6F4E" />
          <Circle cx={20} cy={18} r={4.5} fill="#D4A060" />
          <Circle cx={18.5} cy={17} r={1.2} fill="#2F2F2F" />
          <Path d="M 22 18 L 26 17 L 23 20" fill="#FFD700" />
          <Path d="M 14 22 Q 4 16 8 8" stroke="#8B6F4E" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 26 22 Q 36 16 32 8" stroke="#8B6F4E" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 5 10 L 8 8 L 6 6" fill="#8B6F4E" />
          <Path d="M 35 10 L 32 8 L 34 6" fill="#8B6F4E" />
        </G>
      );
    default:
      return null;
  }
};

const ReactionParticles: React.FC<{ reaction: VisbyReactionType; size: number; onDone?: () => void }> = ({ reaction, size, onDone }) => {
  const particles = useMemo(() => {
    if (reaction === 'love') {
      return Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: size * 0.3 + Math.random() * size * 0.4,
        delay: i * 120,
        symbol: '\u2764',
        color: '#FF69B4',
      }));
    }
    if (reaction === 'sparkle') {
      return Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: size * 0.15 + Math.random() * size * 0.7,
        delay: i * 80,
        symbol: '\u2728',
        color: '#FFD700',
      }));
    }
    return [];
  }, [reaction, size]);

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', pointerEvents: 'none' }]}>
      {particles.map((p) => (
        <ReactionDot key={p.id} x={p.x} delay={p.delay} symbol={p.symbol} size={size} onDone={p.id === 0 ? onDone : undefined} />
      ))}
    </View>
  );
};

const ReactionDot: React.FC<{ x: number; delay: number; symbol: string; size: number; onDone?: () => void }> = ({ x, delay, symbol, size, onDone }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(delay, withTiming(-size * 0.6, { duration: 900, easing: Easing.out(Easing.cubic) }));
    opacity.value = withDelay(delay + 600, withTiming(0, { duration: 300 }, () => {
      if (onDone) {
        // runOnJS(onDone)() - we call it from the parent timeout instead
      }
    }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x,
    top: size * 0.3,
    fontSize: size * 0.1,
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.Text style={style}>{symbol}</Animated.Text>;
};

export const VisbyCharacter: React.FC<VisbyCharacterProps> = React.memo(({
  appearance = defaultAppearance,
  equipped,
  mood = 'happy',
  size = 150,
  animated = true,
  stage = 'kid',
  reaction = null,
  onReactionComplete,
  glowColor,
}) => {
  const bounce = useSharedValue(0);
  const breathe = useSharedValue(0);
  const blink = useSharedValue(1);
  const hairSway = useSharedValue(0);
  const reactionY = useSharedValue(0);
  const reactionRotate = useSharedValue(0);
  const reactionScale = useSharedValue(1);

  useEffect(() => {
    if (!reaction) return;

    if (reaction === 'excited_jump') {
      reactionScale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withSpring(1.05, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12 }),
      );
      reactionY.value = withSequence(
        withTiming(0, { duration: 100 }),
        withSpring(-20, { damping: 6, stiffness: 180 }),
        withSpring(0, { damping: 10 }),
      );
    } else if (reaction === 'happy_wiggle') {
      reactionRotate.value = withSequence(
        withTiming(5, { duration: 60 }),
        withTiming(-5, { duration: 60 }),
        withTiming(4, { duration: 60 }),
        withTiming(-4, { duration: 60 }),
        withTiming(3, { duration: 60 }),
        withTiming(-3, { duration: 60 }),
        withTiming(0, { duration: 80 }),
      );
    }

    const timeout = setTimeout(() => {
      onReactionComplete?.();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [reaction]);

  useEffect(() => {
    if (!animated) return;

    bounce.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(0, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );

    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(0, { duration: 1500, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );

    hairSway.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(-1, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );

    const startBlink = () => {
      const delay = 2500 + Math.random() * 3000;
      blink.value = withDelay(delay,
        withSequence(
          withTiming(0.05, { duration: 80 }),
          withTiming(1, { duration: 120 }),
          withDelay(200 + Math.random() * 800,
            withSequence(
              withTiming(0.05, { duration: 80 }),
              withTiming(1, { duration: 120 }),
            ),
          ),
        ),
      );
    };

    startBlink();
    const blinkInterval = setInterval(startBlink, 4000 + Math.random() * 2000);

    return () => {
      cancelAnimation(bounce);
      cancelAnimation(breathe);
      cancelAnimation(blink);
      cancelAnimation(hairSway);
      clearInterval(blinkInterval);
    };
  }, [animated]);

  const EY = 64;
  const LX = 54, RX = 96;
  const ER = 13;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value + reactionY.value },
      { rotate: `${reactionRotate.value}deg` },
      { scale: reactionScale.value },
    ],
  }));

  const bodyAnimatedProps = useAnimatedProps(() => ({
    transform: `translate(${CX}, ${BY}) scale(${interpolate(breathe.value, [0, 1], [1, 0.997])}, ${interpolate(breathe.value, [0, 1], [1, 1.012])}) translate(${-CX}, ${-BY})`,
  }));

  const eyeAnimatedProps = useAnimatedProps(() => ({
    transform: `translate(${CX}, ${EY}) scale(1, ${blink.value}) translate(${-CX}, ${-EY})`,
  }));

  const hairAnimatedProps = useAnimatedProps(() => ({
    transform: `rotate(${interpolate(hairSway.value, [-1, 1], [-1.5, 1.5])}, ${CX}, 40)`,
  }));

  const skin = appearance.skinTone;
  const skinL = lighten(skin, 25);
  const skinD = darken(skin, 25);
  const eye = appearance.eyeColor;
  const hair = appearance.hairColor;
  const hairL = lighten(hair, 22);

  const eyeShape = appearance.eyeShape || 'round';

  const renderEyes = () => {
    if (mood === 'sleepy') {
      return (
        <G>
          {[LX, RX].map((cx, i) => (
            <Path key={i} d={`M ${cx - 9} ${EY} L ${cx + 9} ${EY}`}
              stroke={eye} strokeWidth={3} strokeLinecap="round" />
          ))}
        </G>
      );
    }
    if (mood === 'cozy') {
      return (
        <G>
          {[LX, RX].map((cx, i) => (
            <Path key={i} d={`M ${cx - 9} ${EY + 2} Q ${cx} ${EY - 8} ${cx + 9} ${EY + 2}`}
              stroke={eye} strokeWidth={3} fill="none" strokeLinecap="round" />
          ))}
        </G>
      );
    }
    if (mood === 'surprised') {
      return (
        <G>
          {[LX, RX].map((cx, i) => (
            <G key={i}>
              <Circle cx={cx} cy={EY} r={ER + 2} fill="#FFFFFF" />
              <Circle cx={cx} cy={EY + 1} r={ER - 2} fill={eye} />
              <Circle cx={cx - 4} cy={EY - 5} r={5} fill="#FFFFFF" />
              <Circle cx={cx + 3} cy={EY + 4} r={3} fill="#FFFFFF" opacity={0.6} />
            </G>
          ))}
        </G>
      );
    }
    if (mood === 'thinking') {
      return (
        <G>
          <G>
            <Circle cx={LX} cy={EY} r={ER} fill="#FFFFFF" />
            <Circle cx={LX + 2} cy={EY + 1} r={ER - 4} fill={eye} />
            <Circle cx={LX - 3} cy={EY - 4} r={4.5} fill="#FFFFFF" />
            <Circle cx={LX + 3} cy={EY + 3} r={2.5} fill="#FFFFFF" opacity={0.5} />
          </G>
          <Path d={`M ${RX - 9} ${EY + 1} Q ${RX} ${EY - 7} ${RX + 9} ${EY - 1}`}
            stroke={eye} strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      );
    }
    if (mood === 'hungry') {
      return (
        <G>
          {[LX, RX].map((cx, i) => (
            <G key={i}>
              <Circle cx={cx} cy={EY} r={ER + 1} fill="#FFFFFF" />
              <Circle cx={cx} cy={EY - 2} r={ER - 3} fill={eye} />
              <Circle cx={cx - 4} cy={EY - 6} r={4.5} fill="#FFFFFF" />
              <Circle cx={cx + 3} cy={EY + 2} r={2.5} fill="#FFFFFF" opacity={0.6} />
              <Path d={`M ${cx - 10} ${EY - 8} Q ${cx} ${EY - 4} ${cx + 10} ${EY - 8}`}
                stroke={darken(eye, 15)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            </G>
          ))}
        </G>
      );
    }
    if (mood === 'bored' || mood === 'lonely') {
      return (
        <G>
          {[LX, RX].map((cx, i) => (
            <G key={i}>
              <Circle cx={cx} cy={EY} r={ER} fill="#FFFFFF" />
              <Circle cx={cx} cy={EY + 1.5} r={ER - 4} fill={eye} />
              <Circle cx={cx - 4} cy={EY - 4} r={4} fill="#FFFFFF" />
              <Path d={`M ${cx - 12} ${EY - 5} L ${cx + 12} ${EY - 5}`}
                stroke={darken(eye, 10)} strokeWidth={3} strokeLinecap="round" />
            </G>
          ))}
        </G>
      );
    }
    if (mood === 'confused') {
      return (
        <G>
          {[LX, RX].map((cx, i) => (
            <G key={i}>
              <Circle cx={cx} cy={EY} r={ER} fill="#FFFFFF" />
              <Circle cx={cx} cy={EY + 1.5} r={ER - 4} fill={eye} />
              <Circle cx={cx - 4} cy={EY - 4} r={5} fill="#FFFFFF" />
              <Circle cx={cx + 3.5} cy={EY + 4} r={2.5} fill="#FFFFFF" opacity={0.55} />
            </G>
          ))}
          {/* Raised left eyebrow */}
          <Path d={`M ${LX - 12} ${EY - 18} Q ${LX} ${EY - 26} ${LX + 12} ${EY - 20}`}
            stroke={darken(eye, 10)} strokeWidth={2.8} fill="none" strokeLinecap="round" />
          {/* Flat right eyebrow */}
          <Path d={`M ${RX - 10} ${EY - 17} L ${RX + 10} ${EY - 17}`}
            stroke={darken(eye, 10)} strokeWidth={2.8} fill="none" strokeLinecap="round" />
          {/* Small question mark */}
          <Path d={`M ${RX + 14} ${EY - 20} Q ${RX + 18} ${EY - 24} ${RX + 14} ${EY - 28} Q ${RX + 10} ${EY - 32} ${RX + 14} ${EY - 36}`}
            stroke={darken(eye, 10)} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Circle cx={RX + 14} cy={EY - 17} r={1.2} fill={darken(eye, 10)} />
        </G>
      );
    }
    if (mood === 'sick') {
      const sickEyeColor = '#6B8E6B';
      return (
        <G>
          {[LX, RX].map((cx, i) => (
            <G key={i}>
              <Path d={`M ${cx - 6} ${EY - 6} L ${cx + 6} ${EY + 6}`}
                stroke={sickEyeColor} strokeWidth={3} strokeLinecap="round" />
              <Path d={`M ${cx + 6} ${EY - 6} L ${cx - 6} ${EY + 6}`}
                stroke={sickEyeColor} strokeWidth={3} strokeLinecap="round" />
            </G>
          ))}
        </G>
      );
    }

    switch (eyeShape) {
      case 'almond':
        return (
          <G>
            {[LX, RX].map((cx, i) => (
              <G key={i}>
                <Path d={`M ${cx - 11} ${EY} Q ${cx} ${EY - 14} ${cx + 11} ${EY} Q ${cx} ${EY + 10} ${cx - 11} ${EY}`} fill="#FFFFFF" />
                <Ellipse cx={cx} cy={EY + 1} rx={6} ry={7} fill={eye} />
                <Circle cx={cx - 3} cy={EY - 3} r={3.5} fill="#FFFFFF" />
                <Circle cx={cx + 2} cy={EY + 3} r={2} fill="#FFFFFF" opacity={0.5} />
              </G>
            ))}
          </G>
        );
      case 'big':
        return (
          <G>
            {[LX, RX].map((cx, i) => (
              <G key={i}>
                <Circle cx={cx} cy={EY} r={ER + 2} fill="#FFFFFF" />
                <Circle cx={cx} cy={EY + 1} r={ER - 3} fill={eye} />
                <Circle cx={cx - 5} cy={EY - 5} r={6} fill="#FFFFFF" />
                <Circle cx={cx + 4} cy={EY + 4} r={3.5} fill="#FFFFFF" opacity={0.6} />
                <Circle cx={cx - 2} cy={EY - 7} r={2} fill="#FFFFFF" opacity={0.4} />
              </G>
            ))}
          </G>
        );
      case 'sleepy':
        return (
          <G>
            {[LX, RX].map((cx, i) => (
              <G key={i}>
                <Circle cx={cx} cy={EY + 2} r={ER - 1} fill="#FFFFFF" />
                <Path d={`M ${cx - 13} ${EY - 4} L ${cx + 13} ${EY - 4}`} stroke={darken(eye, 20)} strokeWidth={3} strokeLinecap="round" />
                <Ellipse cx={cx} cy={EY + 3} rx={ER - 5} ry={ER - 6} fill={eye} />
                <Circle cx={cx - 3} cy={EY} r={3} fill="#FFFFFF" />
              </G>
            ))}
          </G>
        );
      case 'sparkle':
        return (
          <G>
            {[LX, RX].map((cx, i) => (
              <G key={i}>
                <Circle cx={cx} cy={EY} r={ER} fill="#FFFFFF" />
                <Circle cx={cx} cy={EY + 1.5} r={ER - 4} fill={eye} />
                <Circle cx={cx - 4} cy={EY - 4} r={5} fill="#FFFFFF" />
                <Circle cx={cx + 3.5} cy={EY + 4} r={2.5} fill="#FFFFFF" opacity={0.55} />
                {/* Star sparkles */}
                <Path d={`M ${cx + 5} ${EY - 7} L ${cx + 6} ${EY - 10} L ${cx + 7} ${EY - 7} L ${cx + 10} ${EY - 6} L ${cx + 7} ${EY - 5} L ${cx + 6} ${EY - 2} L ${cx + 5} ${EY - 5} L ${cx + 2} ${EY - 6} Z`}
                  fill="#FFD700" opacity={0.9} />
                <Path d={`M ${cx - 8} ${EY + 5} L ${cx - 7} ${EY + 3} L ${cx - 6} ${EY + 5} L ${cx - 4} ${EY + 6} L ${cx - 6} ${EY + 7} L ${cx - 7} ${EY + 9} L ${cx - 8} ${EY + 7} L ${cx - 10} ${EY + 6} Z`}
                  fill="#FFD700" opacity={0.6} />
              </G>
            ))}
          </G>
        );
      case 'round':
      default:
        return (
          <G>
            {[LX, RX].map((cx, i) => (
              <G key={i}>
                <Circle cx={cx} cy={EY} r={ER} fill="#FFFFFF" />
                <Circle cx={cx} cy={EY + 1.5} r={ER - 4} fill={eye} />
                <Circle cx={cx - 4} cy={EY - 4} r={5} fill="#FFFFFF" />
                <Circle cx={cx + 3.5} cy={EY + 4} r={2.5} fill="#FFFFFF" opacity={0.55} />
                <Circle cx={cx - 1} cy={EY - 6} r={1.5} fill="#FFFFFF" opacity={0.3} />
              </G>
            ))}
          </G>
        );
    }
  };

  const renderMouth = () => {
    switch (mood) {
      case 'excited':
      case 'adventurous':
        return (
          <G>
            <Path d="M 67 78 Q 75 87 83 78" fill="#D07060" />
            <Path d="M 69 78 Q 75 76 81 78" fill="#FFFFFF" />
          </G>
        );
      case 'sleepy':
        return <Path d="M 71 80 L 79 80" stroke="#D07060" strokeWidth={2} strokeLinecap="round" />;
      case 'surprised':
        return <Ellipse cx={CX} cy={80} rx={4} ry={5} fill="#D07060" />;
      case 'thinking':
        return <Path d="M 73 80 Q 78 78 83 80" stroke="#D07060" strokeWidth={2} fill="none" strokeLinecap="round" />;
      case 'hungry':
        return <Ellipse cx={CX} cy={81} rx={5} ry={4} fill="#D07060" />;
      case 'bored':
      case 'lonely':
        return <Path d="M 69 80 L 81 80" stroke="#D07060" strokeWidth={2} strokeLinecap="round" />;
      case 'confused':
        return <Path d="M 67 80 Q 71 82 75 79 Q 79 76 83 80" stroke="#D07060" strokeWidth={2} fill="none" strokeLinecap="round" />;
      case 'sick':
        return <Path d="M 67 82 Q 75 77 83 82" stroke="#8B9B6B" strokeWidth={2.2} fill="none" strokeLinecap="round" />;
      case 'happy':
      case 'proud':
      case 'cozy':
      case 'curious':
      default:
        return <Path d="M 69 79 L 75 83 L 81 79" stroke="#D07060" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    }
  };

  const safeSize = typeof size === 'number' && !isNaN(size) && size > 0 ? size : 150;
  const hasCustomOutfit = equipped?.outfit && equipped.outfit !== 'default';
  const hasHat = !!equipped?.hat;

  const bodyOffsetY = stage === 'teen' ? 8 : stage === 'adult' ? 15 : 0;

  const renderEgg = () => (
    <G>
      <Defs>
        <LinearGradient id="eggGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFF8E7" />
          <Stop offset="50%" stopColor="#F5E6C8" />
          <Stop offset="100%" stopColor="#E8D4A0" />
        </LinearGradient>
        <RadialGradient id="eggGlow" cx="50%" cy="40%" r="60%">
          <Stop offset="0%" stopColor="#FFFDF0" stopOpacity={0.7} />
          <Stop offset="100%" stopColor="#F5E6C8" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={CX} cy={143} rx={24} ry={4} fill="rgba(0,0,0,0.06)" />
      <Ellipse cx={CX} cy={BY + 10} rx={35} ry={45} fill="url(#eggGradient)" />
      <Ellipse cx={CX} cy={BY + 10} rx={35} ry={45} fill="url(#eggGlow)" />
      <Path d="M 55 72 L 60 65 L 68 70" stroke="#D8C8A0" strokeWidth={1.5} fill="none" />
      <Path d="M 82 68 L 88 62 L 92 69" stroke="#D8C8A0" strokeWidth={1.2} fill="none" />
      <Path d="M 62 80 L 66 76 L 70 80" stroke="#D8C8A0" strokeWidth={1} fill="none" opacity={0.6} />
      <Circle cx={65} cy={68} r={3} fill={eye} />
      <Circle cx={85} cy={68} r={3} fill={eye} />
      <Circle cx={64} cy={67} r={1.2} fill="#FFFFFF" opacity={0.8} />
      <Circle cx={84} cy={67} r={1.2} fill="#FFFFFF" opacity={0.8} />
    </G>
  );

  const renderBaby = () => (
    <G>
      <Defs>
        <RadialGradient id="bodyG" cx="40%" cy="35%" r="62%">
          <Stop offset="0%" stopColor={skinL} />
          <Stop offset="85%" stopColor={skin} />
          <Stop offset="100%" stopColor={skinD} />
        </RadialGradient>
        <RadialGradient id="blL" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF8899" stopOpacity={0.65} />
          <Stop offset="100%" stopColor="#FF8899" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="blR" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF8899" stopOpacity={0.65} />
          <Stop offset="100%" stopColor="#FF8899" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={CX} cy={143} rx={22} ry={4} fill="rgba(0,0,0,0.06)" />
      {/* Smaller round body base (no legs) */}
      <Ellipse cx={CX} cy={115} rx={28} ry={22} fill={skin} />
      <Ellipse cx={CX} cy={115} rx={28} ry={22} fill="url(#bodyG)" />
      {/* Bigger head */}
      <G transform="translate(75, 60) scale(1.2) translate(-75, -60)">
        <Ellipse cx={CX} cy={60} rx={38} ry={40} fill={skin} />
        <Ellipse cx={CX} cy={60} rx={38} ry={40} fill="url(#bodyG)" />
        {/* Ears */}
        <Circle cx={36} cy={52} r={7} fill={skin} />
        <Circle cx={36} cy={52} r={4.5} fill={skinL} />
        <Circle cx={114} cy={52} r={7} fill={skin} />
        <Circle cx={114} cy={52} r={4.5} fill={skinL} />
        {/* Hair */}
        {renderHairStyle(appearance.hairStyle || 'default', hair, hairL)}
        {/* Blush */}
        <Circle cx={40} cy={68} r={10} fill="url(#blL)" />
        <Circle cx={110} cy={68} r={10} fill="url(#blR)" />
        {/* Bigger eyes */}
        <G>
          {[LX, RX].map((cx, i) => (
            <G key={i}>
              <Circle cx={cx} cy={EY} r={ER + 2} fill="#FFFFFF" />
              <Circle cx={cx} cy={EY + 1.5} r={ER - 2} fill={eye} />
              <Circle cx={cx - 4} cy={EY - 5} r={5.5} fill="#FFFFFF" />
              <Circle cx={cx + 3.5} cy={EY + 4} r={3} fill="#FFFFFF" opacity={0.55} />
            </G>
          ))}
        </G>
        {renderMouth()}
      </G>
      {/* Stub arms */}
      <Ellipse cx={38} cy={100} rx={9} ry={6.5} fill={skin} />
      <Ellipse cx={38} cy={99} rx={7} ry={5} fill={skinL} />
      <Ellipse cx={112} cy={100} rx={9} ry={6.5} fill={skin} />
      <Ellipse cx={112} cy={99} rx={7} ry={5} fill={skinL} />
      {/* Baby bonnet */}
      <G transform="translate(75, 60) scale(1.2) translate(-75, -60)">
        <Path d="M 42 42 Q 50 18 75 14 Q 100 18 108 42" stroke="#B8D8F0" strokeWidth={8} fill="none" strokeLinecap="round" />
        <Path d="M 44 40 Q 52 20 75 16 Q 98 20 106 40" stroke="#D0E8F8" strokeWidth={4} fill="none" strokeLinecap="round" />
        <Circle cx={CX} cy={14} r={5} fill="#B8D8F0" />
        <Circle cx={CX} cy={13} r={3} fill="#D0E8F8" />
      </G>
    </G>
  );

  const renderFullCharacter = () => (
    <G>
      <Defs>
        {glowColor && (
          <RadialGradient id="equippedGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={glowColor} stopOpacity={0.4} />
            <Stop offset="60%" stopColor={glowColor} stopOpacity={0.15} />
            <Stop offset="100%" stopColor={glowColor} stopOpacity={0} />
          </RadialGradient>
        )}
        <RadialGradient id="bodyG" cx="40%" cy="35%" r="62%">
          <Stop offset="0%" stopColor={skinL} />
          <Stop offset="85%" stopColor={skin} />
          <Stop offset="100%" stopColor={skinD} />
        </RadialGradient>
        <RadialGradient id="blL" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF8899" stopOpacity={0.65} />
          <Stop offset="100%" stopColor="#FF8899" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="blR" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF8899" stopOpacity={0.65} />
          <Stop offset="100%" stopColor="#FF8899" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="sickTint" cx="50%" cy="40%" r="55%">
          <Stop offset="0%" stopColor="#90B870" stopOpacity={0.35} />
          <Stop offset="100%" stopColor="#90B870" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="sickBlush" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#A0C880" stopOpacity={0.5} />
          <Stop offset="100%" stopColor="#A0C880" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Equipped item rarity glow */}
      {glowColor && (
        <Ellipse cx={CX} cy={BY + bodyOffsetY / 2} rx={55} ry={65} fill="url(#equippedGlow)" />
      )}

      {/* Adult sparkle/glow effect */}
      {stage === 'adult' && (
        <G>
          <Path d="M 20 25 L 22 20 L 24 25 L 29 27 L 24 29 L 22 34 L 20 29 L 15 27 Z" fill="#FFD700" opacity={0.7} />
          <Path d="M 125 18 L 127 13 L 129 18 L 134 20 L 129 22 L 127 27 L 125 22 L 120 20 Z" fill="#FFD700" opacity={0.6} />
          <Path d="M 130 55 L 131.5 51 L 133 55 L 137 56.5 L 133 58 L 131.5 62 L 130 58 L 126 56.5 Z" fill="#FFD700" opacity={0.5} />
          <Path d="M 12 60 L 13.5 56 L 15 60 L 19 61.5 L 15 63 L 13.5 67 L 12 63 L 8 61.5 Z" fill="#FFD700" opacity={0.5} />
          <Path d="M 22 105 L 23 102 L 24 105 L 27 106 L 24 107 L 23 110 L 22 107 L 19 106 Z" fill="#FFD700" opacity={0.4} />
          <Path d="M 128 95 L 129 92 L 130 95 L 133 96 L 130 97 L 129 100 L 128 97 L 125 96 Z" fill="#FFD700" opacity={0.4} />
        </G>
      )}

      {/* Ground shadow */}
      <Ellipse cx={CX} cy={143} rx={30} ry={5} fill="rgba(0,0,0,0.06)" />

      {/* Backpack (behind body) */}
      {renderBackpack(equipped?.backpack)}

      {/* Feet / Shoes */}
      {equipped?.shoes ? renderShoes(equipped.shoes) : (
        <G>
          <Ellipse cx={60} cy={136} rx={9} ry={5.5} fill={skinD} />
          <Ellipse cx={90} cy={136} rx={9} ry={5.5} fill={skinD} />
          <Ellipse cx={60} cy={135} rx={7.5} ry={4.5} fill={skin} />
          <Ellipse cx={90} cy={135} rx={7.5} ry={4.5} fill={skin} />
        </G>
      )}

      {/* Main body — solid skin fill as fallback (gradient on top) */}
      <AnimatedG animatedProps={animated ? bodyAnimatedProps : undefined}>
        <Ellipse cx={CX} cy={BY + bodyOffsetY / 2} rx={stage === 'adult' ? 47 : 44} ry={52 + bodyOffsetY / 2} fill={skin} />
        <Ellipse cx={CX} cy={BY + bodyOffsetY / 2} rx={stage === 'adult' ? 47 : 44} ry={52 + bodyOffsetY / 2} fill="url(#bodyG)" />
      </AnimatedG>

      {/* Stub arms — broader for adult */}
      <Ellipse cx={stage === 'adult' ? 25 : 28} cy={86 + bodyOffsetY / 3} rx={stage === 'adult' ? 13 : 11} ry={stage === 'adult' ? 9 : 8} fill={skin} />
      <Ellipse cx={stage === 'adult' ? 25 : 28} cy={85 + bodyOffsetY / 3} rx={stage === 'adult' ? 11 : 9} ry={stage === 'adult' ? 7.5 : 6.5} fill={skinL} />
      <Ellipse cx={stage === 'adult' ? 125 : 122} cy={86 + bodyOffsetY / 3} rx={stage === 'adult' ? 13 : 11} ry={stage === 'adult' ? 9 : 8} fill={skin} />
      <Ellipse cx={stage === 'adult' ? 125 : 122} cy={85 + bodyOffsetY / 3} rx={stage === 'adult' ? 11 : 9} ry={stage === 'adult' ? 7.5 : 6.5} fill={skinL} />

      {/* Default outfit: open vest so arms and neck/torso show */}
      {!hasCustomOutfit && (
        <G>
          {/* Vest body — narrower so arms stay visible (arm centers ~28 and 122) */}
          <Path d="M 48 96 Q 48 92 75 90 Q 102 92 102 96 L 104 124 Q 75 130 46 124 Z" fill="#F07080" />
          <Path d="M 50 94 Q 50 91 75 89.5 Q 100 91 100 94" fill="none" stroke="#FF8894" strokeWidth={0.8} opacity={0.5} />
          {/* Belt and buckle */}
          <Rect x={48} y={112} width={54} height={4} rx={2} fill="#8B5E3C" />
          <Rect x={48} y={113} width={54} height={1.5} rx={0.75} fill="#A07048" opacity={0.35} />
          <Circle cx={CX} cy={114} r={3.5} fill="#FFD700" />
          <Circle cx={CX} cy={113.5} r={2} fill="#FFF4B0" />
          <Circle cx={74.5} cy={113} r={0.8} fill="#FFFFFF" opacity={0.7} />
        </G>
      )}

      {/* Custom outfits */}
      {hasCustomOutfit && equipped?.outfit === 'kimono' && (
        <G>
          <Path d="M 36 98 Q 36 90 75 88 Q 114 90 114 98 L 116 128 Q 75 136 34 128 Z" fill="#C41E3A" />
          <Rect x={58} y={108} width={34} height={4.5} rx={2.25} fill="#FFD700" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'hanbok' && (
        <G>
          <Rect x={52} y={92} width={46} height={12} rx={6} fill="#FFFFFF" />
          <Path d="M 38 104 Q 38 98 75 104 Q 112 98 112 104 L 116 130 Q 75 138 34 130 Z" fill="#E8B4C8" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'dashiki' && (
        <G>
          <Path d="M 36 98 Q 36 90 75 88 Q 114 90 114 98 L 116 128 Q 75 136 34 128 Z" fill="#FF8C00" />
          <Circle cx={CX} cy={110} r={7} fill="none" stroke="#DC143C" strokeWidth={1.5} />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'poncho' && (
        <G>
          <Path d="M 28 108 L 75 82 L 122 108 Z" fill="#E8C85A" />
          <Path d="M 34 106 L 75 86 L 116 106" fill="none" stroke="#DC143C" strokeWidth={2.5} />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'sari' && (
        <G>
          <Path d="M 36 98 Q 36 90 75 88 Q 114 90 114 98 L 116 128 Q 75 136 34 128 Z" fill="#FF6347" />
          <Path d="M 48 102 Q 75 94 102 102" stroke="#FFD700" strokeWidth={2} fill="none" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'hawaiian_shirt' && (
        <G>
          <Path d="M 40 96 Q 40 92 75 90 Q 110 92 110 96 L 112 126 Q 75 132 38 126 Z" fill="#00AA66" />
          <Path d="M 44 98 L 44 118 M 106 98 L 106 118" stroke="#FF6B9D" strokeWidth={2.5} fill="none" />
          <Circle cx={58} cy={108} r={4} fill="#FFD700" />
          <Circle cx={75} cy={112} r={4} fill="#FF6B9D" />
          <Circle cx={92} cy={108} r={4} fill="#00AA66" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'lederhosen' && (
        <G>
          <Path d="M 44 100 L 44 128 Q 75 132 106 128 L 106 100 Q 75 96 44 100 Z" fill="#8B4513" />
          <Path d="M 44 100 Q 75 92 106 100" stroke="#A0522D" strokeWidth={1.5} fill="none" />
          <Rect x={70} y={98} width={10} height={14} fill="#8B4513" />
          <Circle cx={75} cy={104} r={2} fill="#DAA520" />
          <Path d="M 38 102 L 72 92 M 112 102 L 78 92" stroke="#5D3A1A" strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'toga' && (
        <G>
          <Path d="M 32 94 L 75 88 L 118 94 L 116 130 Q 75 136 34 130 Z" fill="#F5F5DC" />
          <Path d="M 40 98 Q 75 92 110 98" fill="none" stroke="#E8E8D0" strokeWidth={1} opacity={0.6} />
          <Path d="M 50 100 L 75 124 L 100 100" fill="none" stroke="#DEB887" strokeWidth={1.5} opacity={0.5} />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'ninja_outfit' && (
        <G>
          <Path d="M 36 98 Q 36 90 75 88 Q 114 90 114 98 L 116 128 Q 75 136 34 128 Z" fill="#1A1A1A" />
          <Path d="M 40 96 Q 75 94 110 96" fill="none" stroke="#2D2D2D" strokeWidth={1} opacity={0.6} />
          <Rect x={70} y={108} width={10} height={6} rx={1} fill="#333" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'knight_armor' && (
        <G>
          <Path d="M 38 96 Q 38 92 75 90 Q 112 92 112 96 L 114 126 Q 75 132 36 126 Z" fill="#C0C0C0" />
          <Path d="M 42 94 Q 75 91 108 94" fill="none" stroke="#A0A0A0" strokeWidth={1.2} />
          <Circle cx={75} cy={110} r={5} fill="#B8860B" />
          <Circle cx={75} cy={109.5} r={2.5} fill="#DAA520" />
          <Path d="M 44 98 L 44 120 M 106 98 L 106 120" stroke="#8B8B8B" strokeWidth={2} fill="none" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'kilt' && (
        <G>
          <Path d="M 38 98 Q 38 92 75 90 Q 112 92 112 98 L 114 128 Q 75 134 36 128 Z" fill="#1B4332" />
          <Path d="M 42 96 L 42 124 M 58 96 L 58 124 M 75 96 L 75 124 M 92 96 L 92 124 M 108 96 L 108 124" stroke="#DC143C" strokeWidth={1.5} fill="none" />
          <Path d="M 38 106 L 112 106" stroke="#FFD700" strokeWidth={1} />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'pharaoh_robe' && (
        <G>
          <Path d="M 36 96 Q 36 90 75 88 Q 114 90 114 96 L 116 128 Q 75 136 34 128 Z" fill="#1A1A6B" />
          <Path d="M 48 100 Q 75 94 102 100" stroke="#FFD700" strokeWidth={2} fill="none" />
          <Path d="M 52 110 Q 75 106 98 110" stroke="#FFD700" strokeWidth={1.5} fill="none" />
          <Circle cx={CX} cy={102} r={4} fill="#40E0D0" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'mariachi_suit' && (
        <G>
          <Path d="M 38 96 Q 38 92 75 90 Q 112 92 112 96 L 114 128 Q 75 134 36 128 Z" fill="#1A1A1A" />
          <Path d="M 44 96 L 44 126 M 106 96 L 106 126" stroke="#FFD700" strokeWidth={2} fill="none" />
          <Path d="M 50 104 Q 60 100 70 104 M 80 104 Q 90 100 100 104" stroke="#FFD700" strokeWidth={1} fill="none" />
          <Circle cx={CX} cy={100} r={3} fill="#FFD700" />
          <Circle cx={CX} cy={108} r={2.5} fill="#FFD700" />
          <Circle cx={CX} cy={115} r={2} fill="#FFD700" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'safari_outfit' && (
        <G>
          <Path d="M 40 96 Q 40 92 75 90 Q 110 92 110 96 L 112 126 Q 75 132 38 126 Z" fill="#C4A060" />
          <Rect x={70} y={104} width={10} height={8} rx={2} fill="#A08050" />
          <Path d="M 44 94 L 44 110" stroke="#8B6F4E" strokeWidth={2} fill="none" />
          <Path d="M 106 94 L 106 110" stroke="#8B6F4E" strokeWidth={2} fill="none" />
          <Rect x={62} y={116} width={26} height={3} rx={1.5} fill="#8B5A30" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'space_suit' && (
        <G>
          <Path d="M 36 96 Q 36 92 75 90 Q 114 92 114 96 L 116 128 Q 75 134 34 128 Z" fill="#D0D0D8" />
          <Path d="M 42 94 Q 75 91 108 94" fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.5} />
          <Circle cx={CX} cy={108} r={6} fill="#87CEEB" opacity={0.4} />
          <Rect x={62} y={118} width={26} height={4} rx={2} fill="#A0A0B4" />
          <Circle cx={52} cy={106} r={2.5} fill="#FF6347" />
          <Circle cx={98} cy={106} r={2.5} fill="#4169E1" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'pirate_coat' && (
        <G>
          <Path d="M 36 96 Q 36 92 75 90 Q 114 92 114 96 L 116 130 Q 75 138 34 130 Z" fill="#2F2F2F" />
          <Path d="M 42 94 L 44 126" stroke="#FFD700" strokeWidth={1.5} fill="none" />
          <Path d="M 108 94 L 106 126" stroke="#FFD700" strokeWidth={1.5} fill="none" />
          <Circle cx={60} cy={102} r={2} fill="#FFD700" />
          <Circle cx={60} cy={110} r={2} fill="#FFD700" />
          <Rect x={62} y={120} width={26} height={4} rx={2} fill="#8B5A30" />
          <Circle cx={CX} cy={122} r={2.5} fill="#FFD700" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'hula_outfit' && (
        <G>
          <Path d="M 42 110 Q 75 106 108 110 L 110 130 Q 75 136 40 130 Z" fill="#228B22" />
          {[46, 54, 62, 70, 78, 86, 94, 102].map((x, i) => (
            <Path key={i} d={`M ${x} 110 L ${x + 2} 128`} stroke="#2EA02E" strokeWidth={2.5} fill="none" />
          ))}
          <Path d="M 48 96 Q 75 104 102 96" stroke="#FF6347" strokeWidth={3} fill="none" />
          <Circle cx={60} cy={98} r={3} fill="#FFD700" />
          <Circle cx={75} cy={100} r={3} fill="#FFD700" />
          <Circle cx={90} cy={98} r={3} fill="#FFD700" />
        </G>
      )}
      {hasCustomOutfit && equipped?.outfit === 'flamenco_dress' && (
        <G>
          <Path d="M 36 96 Q 36 92 75 90 Q 114 92 114 96 L 118 130 Q 75 140 32 130 Z" fill="#DC143C" />
          <Path d="M 42 94 Q 75 90 108 94" fill="none" stroke="#B01030" strokeWidth={1} />
          <Path d="M 38 118 Q 75 124 112 118" stroke="#1A1A1A" strokeWidth={2} fill="none" />
          <Path d="M 36 124 Q 75 132 114 124" stroke="#1A1A1A" strokeWidth={1.5} fill="none" />
          {[44, 60, 76, 92].map((x, i) => (
            <Circle key={i} cx={x} cy={108} r={1.5} fill="#1A1A1A" />
          ))}
        </G>
      )}
      {/* Generic fallback: any other outfit shows a colored tunic so every purchase is visible */}
      {hasCustomOutfit && equipped?.outfit && !['kimono', 'hanbok', 'dashiki', 'poncho', 'sari', 'hawaiian_shirt', 'lederhosen', 'toga', 'default_tunic', 'ninja_outfit', 'knight_armor', 'kilt', 'pharaoh_robe', 'mariachi_suit', 'safari_outfit', 'space_suit', 'pirate_coat', 'hula_outfit', 'flamenco_dress'].includes(equipped.outfit) && (() => {
        const palette = ['#6B5B95', '#2E86AB', '#1B4332', '#5C4D7D', '#9B59B6', '#E74C3C', '#16A085', '#8E44AD'];
        const idx = equipped.outfit.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
        const fill = palette[idx];
        return (
          <G>
            <Path d="M 38 98 Q 38 92 75 90 Q 112 92 112 98 L 114 128 Q 75 134 36 128 Z" fill={fill} />
            <Path d="M 42 96 Q 42 93 75 91 Q 108 93 108 96" fill="none" stroke={fill} strokeWidth={1} opacity={0.4} />
          </G>
        );
      })()}

      {/* Ears */}
      <Circle cx={32} cy={56} r={8} fill={skin} />
      <Circle cx={32} cy={56} r={5} fill={skinL} />
      <Circle cx={32} cy={56} r={3} fill="#FFACA0" opacity={0.3} />
      <Circle cx={118} cy={56} r={8} fill={skin} />
      <Circle cx={118} cy={56} r={5} fill={skinL} />
      <Circle cx={118} cy={56} r={3} fill="#FFACA0" opacity={0.3} />

      {/* Hair (with sway) */}
      <AnimatedG animatedProps={animated ? hairAnimatedProps : undefined}>
        {renderHairStyle(appearance.hairStyle || 'default', hair, hairL)}
      </AnimatedG>

      {/* Teen extra hair strands */}
      {(stage === 'teen' || stage === 'adult') && (
        <G>
          <Path d="M 48 39 Q 52 32 50 26" stroke={hair} strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 102 39 Q 98 32 100 26" stroke={hair} strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 65 36 Q 63 28 66 22" stroke={hair} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 85 36 Q 87 28 84 22" stroke={hair} strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      )}

      {/* Hat (rendered on top of hair) */}
      {renderHat(equipped?.hat, hair, hairL)}

      {/* Sick overlay */}
      {mood === 'sick' && (
        <Ellipse cx={CX} cy={52} rx={32} ry={20} fill="url(#sickTint)" />
      )}

      {/* Blush cheeks */}
      <Circle cx={36} cy={74} r={12} fill={mood === 'sick' ? 'url(#sickBlush)' : 'url(#blL)'} />
      <Circle cx={114} cy={74} r={12} fill={mood === 'sick' ? 'url(#sickBlush)' : 'url(#blR)'} />

      {/* Eyes (with blink) */}
      <AnimatedG animatedProps={animated ? eyeAnimatedProps : undefined}>
        {renderEyes()}
      </AnimatedG>

      {/* Mouth — bigger smile for adult */}
      {stage === 'adult' ? (
        <G>
          <Path d="M 65 78 Q 75 90 85 78" fill="#D07060" />
          <Path d="M 67 78 Q 75 76 83 78" fill="#FFFFFF" />
        </G>
      ) : renderMouth()}

      {/* Teen angular jawline accents */}
      {stage === 'teen' && (
        <G>
          <Path d="M 38 85 Q 42 95 50 100" stroke={skinD} strokeWidth={1} fill="none" opacity={0.3} />
          <Path d="M 112 85 Q 108 95 100 100" stroke={skinD} strokeWidth={1} fill="none" opacity={0.3} />
        </G>
      )}

      {/* Accessory */}
      {renderAccessory(equipped?.accessory)}

      {/* Companion */}
      {renderCompanion(equipped?.companion)}
    </G>
  );

  return (
    <View style={[styles.container, { width: safeSize, height: safeSize }]}>
      <Animated.View style={[{ width: safeSize, height: safeSize }, animatedStyle]}>
        <Svg width={safeSize} height={safeSize} viewBox="0 0 150 150">
          {stage === 'egg' && renderEgg()}
          {stage === 'baby' && renderBaby()}
          {(stage === 'kid' || stage === 'teen' || stage === 'adult') && renderFullCharacter()}
        </Svg>
      </Animated.View>
      {reaction && (reaction === 'love' || reaction === 'sparkle') && (
        <ReactionParticles reaction={reaction} size={safeSize} onDone={onReactionComplete} />
      )}
    </View>
  );
}) as React.FC<VisbyCharacterProps>;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VisbyCharacter;
