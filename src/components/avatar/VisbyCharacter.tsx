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
  mood?: 'happy' | 'excited' | 'sleepy' | 'surprised' | 'thinking' | 'curious' | 'proud' | 'adventurous' | 'cozy';
  size?: number;
  animated?: boolean;
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

const renderHat = (hatId: string | undefined, hair: string, hairL: string) => {
  switch (hatId) {
    case 'viking_helmet':
      return (
        <G>
          {/* Hair side tufts */}
          <Path d="M 38 42 Q 28 54 26 70 Q 24 80 30 86" stroke={hair} strokeWidth={11} fill="none" strokeLinecap="round" />
          <Path d="M 38 42 Q 30 56 28 68 Q 26 76 30 82" stroke={hairL} strokeWidth={5.5} fill="none" strokeLinecap="round" />
          <Path d="M 112 42 Q 122 54 124 70 Q 126 80 120 86" stroke={hair} strokeWidth={11} fill="none" strokeLinecap="round" />
          <Path d="M 112 42 Q 120 56 122 68 Q 124 76 120 82" stroke={hairL} strokeWidth={5.5} fill="none" strokeLinecap="round" />
          {/* Hair bangs */}
          <Path d="M 44 40 Q 50 50 47 57" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 44 40 Q 49 48 47 54" stroke={hairL} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <Path d="M 106 40 Q 100 50 103 57" stroke={hair} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M 106 40 Q 101 48 103 54" stroke={hairL} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <Path d="M 56 38 Q 54 45 55 51" stroke={hair} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 94 38 Q 96 45 95 51" stroke={hair} strokeWidth={6} fill="none" strokeLinecap="round" />
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

  const renderEyes = () => {
    switch (mood) {
      case 'sleepy':
        return (
          <G>
            {[LX, RX].map((cx, i) => (
              <Path key={i} d={`M ${cx - 9} ${EY} L ${cx + 9} ${EY}`}
                stroke={eye} strokeWidth={3} strokeLinecap="round" />
            ))}
          </G>
        );
      case 'cozy':
        return (
          <G>
            {[LX, RX].map((cx, i) => (
              <Path key={i} d={`M ${cx - 9} ${EY + 2} Q ${cx} ${EY - 8} ${cx + 9} ${EY + 2}`}
                stroke={eye} strokeWidth={3} fill="none" strokeLinecap="round" />
            ))}
          </G>
        );
      case 'surprised':
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
      case 'thinking':
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
      case 'happy':
      case 'excited':
      case 'proud':
      case 'curious':
      case 'adventurous':
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

  return (
    <Animated.View style={[styles.container, { width: safeSize, height: safeSize }, animatedStyle]}>
      <Svg width={safeSize} height={safeSize} viewBox="0 0 150 150">
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

        {/* Ground shadow */}
        <Ellipse cx={CX} cy={143} rx={30} ry={5} fill="rgba(0,0,0,0.06)" />

        {/* Tiny feet */}
        <Ellipse cx={60} cy={136} rx={9} ry={5.5} fill={skinD} />
        <Ellipse cx={90} cy={136} rx={9} ry={5.5} fill={skinD} />
        <Ellipse cx={60} cy={135} rx={7.5} ry={4.5} fill={skin} />
        <Ellipse cx={90} cy={135} rx={7.5} ry={4.5} fill={skin} />

        {/* Main body */}
        <Ellipse cx={CX} cy={BY} rx={44} ry={52} fill="url(#bodyG)" />

        {/* Stub arms */}
        <Ellipse cx={28} cy={86} rx={11} ry={8} fill={skin} />
        <Ellipse cx={28} cy={85} rx={9} ry={6.5} fill={skinL} />
        <Ellipse cx={122} cy={86} rx={11} ry={8} fill={skin} />
        <Ellipse cx={122} cy={85} rx={9} ry={6.5} fill={skinL} />

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

        {/* Hat (includes hair for viking helmet) */}
        {renderHat(equipped?.hat, hair, hairL)}

        {/* Blush cheeks */}
        <Circle cx={36} cy={74} r={12} fill="url(#blL)" />
        <Circle cx={114} cy={74} r={12} fill="url(#blR)" />

        {/* Eyes */}
        {renderEyes()}

        {/* Mouth */}
        {renderMouth()}

        {/* Accessory */}
        {renderAccessory(equipped?.accessory)}
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
