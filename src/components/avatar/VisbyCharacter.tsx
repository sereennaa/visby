import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
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
}

export interface VisbyCharacterProps {
  appearance?: VisbyAppearance;
  equipped?: VisbyEquipped;
  mood?: 'happy' | 'excited' | 'sleepy' | 'surprised' | 'thinking' | 'curious' | 'proud' | 'adventurous' | 'cozy' | 'hungry' | 'bored' | 'confused' | 'sick';
  size?: number;
  animated?: boolean;
  stage?: 'egg' | 'baby' | 'kid' | 'teen' | 'adult';
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
    default:
      return null;
  }
};

export const VisbyCharacter: React.FC<VisbyCharacterProps> = ({
  appearance = defaultAppearance,
  equipped,
  mood = 'happy',
  size = 150,
  animated = true,
  stage = 'kid',
}) => {
  const bounce = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    bounce.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(0, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );
    return () => { bounce.value = 0; };
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const skin = appearance.skinTone;
  const skinL = lighten(skin, 25);
  const skinD = darken(skin, 25);
  const eye = appearance.eyeColor;
  const hair = appearance.hairColor;
  const hairL = lighten(hair, 22);

  const EY = 64;
  const LX = 54, RX = 96;
  const ER = 13;

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
    if (mood === 'bored') {
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
      <Ellipse cx={CX} cy={115} rx={28} ry={22} fill="url(#bodyG)" />
      {/* Bigger head */}
      <G transform="translate(75, 60) scale(1.2) translate(-75, -60)">
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

      {/* Tiny feet */}
      <Ellipse cx={60} cy={136} rx={9} ry={5.5} fill={skinD} />
      <Ellipse cx={90} cy={136} rx={9} ry={5.5} fill={skinD} />
      <Ellipse cx={60} cy={135} rx={7.5} ry={4.5} fill={skin} />
      <Ellipse cx={90} cy={135} rx={7.5} ry={4.5} fill={skin} />

      {/* Main body — taller for teen/adult */}
      <Ellipse cx={CX} cy={BY + bodyOffsetY / 2} rx={stage === 'adult' ? 47 : 44} ry={52 + bodyOffsetY / 2} fill="url(#bodyG)" />

      {/* Stub arms — broader for adult */}
      <Ellipse cx={stage === 'adult' ? 25 : 28} cy={86 + bodyOffsetY / 3} rx={stage === 'adult' ? 13 : 11} ry={stage === 'adult' ? 9 : 8} fill={skin} />
      <Ellipse cx={stage === 'adult' ? 25 : 28} cy={85 + bodyOffsetY / 3} rx={stage === 'adult' ? 11 : 9} ry={stage === 'adult' ? 7.5 : 6.5} fill={skinL} />
      <Ellipse cx={stage === 'adult' ? 125 : 122} cy={86 + bodyOffsetY / 3} rx={stage === 'adult' ? 13 : 11} ry={stage === 'adult' ? 9 : 8} fill={skin} />
      <Ellipse cx={stage === 'adult' ? 125 : 122} cy={85 + bodyOffsetY / 3} rx={stage === 'adult' ? 11 : 9} ry={stage === 'adult' ? 7.5 : 6.5} fill={skinL} />

      {/* Cape / outfit */}
      {!hasCustomOutfit && (
        <G>
          <Path d="M 36 98 Q 36 90 75 88 Q 114 90 114 98 L 116 128 Q 75 136 34 128 Z" fill="#F07080" />
          <Path d="M 38 96 Q 38 92 75 90 Q 112 92 112 96" fill="none" stroke="#FF8894" strokeWidth={0.8} opacity={0.5} />
          <Rect x={36} y={110} width={78} height={5.5} rx={2.75} fill="#8B5E3C" />
          <Rect x={36} y={111} width={78} height={2.5} rx={1.25} fill="#A07048" opacity={0.35} />
          <Circle cx={CX} cy={113} r={4} fill="#FFD700" />
          <Circle cx={CX} cy={112.5} r={2.5} fill="#FFF4B0" />
          <Circle cx={74.5} cy={112} r={1} fill="#FFFFFF" opacity={0.7} />
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

      {/* Ears */}
      <Circle cx={32} cy={56} r={8} fill={skin} />
      <Circle cx={32} cy={56} r={5} fill={skinL} />
      <Circle cx={32} cy={56} r={3} fill="#FFACA0" opacity={0.3} />
      <Circle cx={118} cy={56} r={8} fill={skin} />
      <Circle cx={118} cy={56} r={5} fill={skinL} />
      <Circle cx={118} cy={56} r={3} fill="#FFACA0" opacity={0.3} />

      {/* Hair */}
      {renderHairStyle(appearance.hairStyle || 'default', hair, hairL)}

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

      {/* Eyes */}
      {renderEyes()}

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
    </G>
  );

  return (
    <Animated.View style={[styles.container, { width: safeSize, height: safeSize }, animatedStyle]}>
      <Svg width={safeSize} height={safeSize} viewBox="0 0 150 150">
        {stage === 'egg' && renderEgg()}
        {stage === 'baby' && renderBaby()}
        {(stage === 'kid' || stage === 'teen' || stage === 'adult') && renderFullCharacter()}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VisbyCharacter;
