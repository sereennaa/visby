import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
  LinearGradient,
  Stop,
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
  skinTone: colors.visby.skin.light,
  hairColor: colors.visby.hair.brown,
  hairStyle: 'default',
  eyeColor: '#4A90D9',
  eyeShape: 'round',
};

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// SVG hat renders keyed by cosmetic ID
const renderHat = (hatId: string | undefined, hairColor: string) => {
  switch (hatId) {
    case 'viking_helmet':
      return (
        <G>
          <Path d="M 30 32 Q 35 8 75 2 Q 115 8 120 32 L 30 32 Z" fill="#8B7355" />
          <Path d="M 30 32 L 120 32" stroke="#A08050" strokeWidth={4} />
          <Circle cx={75} cy={28} r={5} fill="#FFD700" />
          <Path d="M 28 28 Q 18 5 12 15" stroke="#F5F5DC" strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d="M 122 28 Q 132 5 138 15" stroke="#F5F5DC" strokeWidth={7} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'samurai_helmet':
      return (
        <G>
          <Path d="M 28 35 Q 30 5 75 0 Q 120 5 122 35 L 28 35 Z" fill="#2F2F2F" />
          <Path d="M 55 0 L 75 -12 L 95 0" fill="#C41E3A" />
          <Rect x={35} y={30} width={80} height={6} rx={3} fill="#FFD700" />
        </G>
      );
    case 'sombrero':
      return (
        <G>
          <Ellipse cx={75} cy={28} rx={60} ry={12} fill="#D2691E" />
          <Path d="M 45 28 Q 48 2 75 0 Q 102 2 105 28 Z" fill="#8B4513" />
          <Path d="M 45 28 L 105 28" stroke="#FFD700" strokeWidth={3} />
          <Ellipse cx={75} cy={28} rx={60} ry={4} fill={adjustColor('#D2691E', -20)} />
        </G>
      );
    case 'beret':
      return (
        <G>
          <Ellipse cx={75} cy={22} rx={35} ry={18} fill="#1B1B3A" />
          <Circle cx={75} cy={6} r={4} fill="#1B1B3A" />
          <Path d="M 40 22 Q 75 35 110 22" fill={adjustColor('#1B1B3A', 15)} />
        </G>
      );
    case 'fez':
      return (
        <G>
          <Path d="M 52 30 L 55 5 L 95 5 L 98 30 Z" fill="#DC143C" />
          <Rect x={50} y={28} width={50} height={5} rx={2} fill={adjustColor('#DC143C', -20)} />
          <Path d="M 75 5 Q 85 2 90 12" stroke="#1B1B3A" strokeWidth={2} fill="none" />
          <Circle cx={90} cy={12} r={3} fill="#1B1B3A" />
        </G>
      );
    case 'top_hat':
      return (
        <G>
          <Ellipse cx={75} cy={25} rx={40} ry={8} fill="#2F2F2F" />
          <Rect x={50} y={-10} width={50} height={35} rx={5} fill="#2F2F2F" />
          <Rect x={50} y={18} width={50} height={5} fill="#9B89D0" />
        </G>
      );
    case 'rice_hat':
      return (
        <G>
          <Path d="M 15 35 L 75 -5 L 135 35 Z" fill="#F5DEB3" />
          <Path d="M 25 32 L 75 0 L 125 32" stroke="#D2B48C" strokeWidth={2} fill="none" />
          <Circle cx={75} cy={2} r={3} fill="#8B7355" />
        </G>
      );
    case 'crown':
      return (
        <G>
          <Path d="M 42 30 L 45 10 L 55 22 L 65 5 L 75 22 L 85 5 L 95 22 L 105 10 L 108 30 Z" fill="#FFD700" />
          <Rect x={42} y={28} width={66} height={6} rx={2} fill={adjustColor('#FFD700', -30)} />
          <Circle cx={65} cy={22} r={3} fill="#DC143C" />
          <Circle cx={75} cy={18} r={3} fill="#4169E1" />
          <Circle cx={85} cy={22} r={3} fill="#50C878" />
        </G>
      );
    case 'turban':
      return (
        <G>
          <Ellipse cx={75} cy={20} rx={38} ry={25} fill="#FF8C00" />
          <Path d="M 37 20 Q 55 -5 75 5 Q 95 -5 113 20" stroke="#FFD700" strokeWidth={3} fill="none" />
          <Path d="M 45 15 Q 75 -8 105 15" stroke="#FF8C00" strokeWidth={8} fill="none" />
          <Circle cx={75} cy={8} r={5} fill="#DC143C" />
        </G>
      );
    case 'ushanka':
      return (
        <G>
          <Path d="M 30 35 Q 32 10 75 5 Q 118 10 120 35 L 30 35 Z" fill="#8B4513" />
          <Ellipse cx={75} cy={35} rx={48} ry={10} fill="#D2B48C" />
          <Path d="M 28 35 Q 25 45 30 50" fill="#D2B48C" />
          <Path d="M 122 35 Q 125 45 120 50" fill="#D2B48C" />
          <Circle cx={75} cy={18} r={6} fill="#DC143C" />
        </G>
      );
    case 'feather_headdress':
      return (
        <G>
          <Rect x={40} y={25} width={70} height={8} rx={4} fill="#8B4513" />
          <Circle cx={55} cy={29} r={3} fill="#40E0D0" />
          <Circle cx={75} cy={29} r={3} fill="#FFD700" />
          <Circle cx={95} cy={29} r={3} fill="#DC143C" />
          <Path d="M 50 25 L 40 -5" stroke="#40E0D0" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 60 25 L 55 -8" stroke="#FF6347" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 75 25 L 75 -12" stroke="#FFD700" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 90 25 L 95 -8" stroke="#50C878" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M 100 25 L 110 -5" stroke="#9B59B6" strokeWidth={4} fill="none" strokeLinecap="round" />
        </G>
      );
    default:
      // Default tiny viking horn braids (no hat)
      return (
        <G>
          <Path d="M 40 28 Q 30 18 25 25" stroke={hairColor} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 110 28 Q 120 18 125 25" stroke={hairColor} strokeWidth={6} fill="none" strokeLinecap="round" />
        </G>
      );
  }
};

const renderOutfit = (outfitId: string | undefined) => {
  switch (outfitId) {
    case 'kimono':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={35} ry={30} fill="#C41E3A" />
          <Path d="M 60 90 L 60 140" stroke="#FFD700" strokeWidth={2} />
          <Path d="M 90 90 L 90 140" stroke="#FFD700" strokeWidth={2} />
          <Rect x={55} y={100} width={40} height={6} rx={3} fill="#FFD700" />
          <Path d="M 55 95 Q 75 88 95 95" stroke="#FFF" strokeWidth={1} fill="none" />
        </G>
      );
    case 'lederhosen':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={35} ry={30} fill="#F5F5DC" />
          <Path d="M 50 95 L 50 140" stroke="#8B4513" strokeWidth={3} />
          <Path d="M 100 95 L 100 140" stroke="#8B4513" strokeWidth={3} />
          <Rect x={45} y={105} width={60} height={20} rx={4} fill="#8B4513" />
          <Rect x={60} y={108} width={30} height={4} rx={2} fill="#FFD700" />
        </G>
      );
    case 'sari':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={35} ry={30} fill="#FF6347" />
          <Path d="M 45 100 Q 75 85 105 100" stroke="#FFD700" strokeWidth={3} fill="none" />
          <Path d="M 45 110 Q 75 95 105 110" stroke="#FFD700" strokeWidth={1} fill="none" />
          <Path d="M 100 95 Q 115 85 110 115" stroke="#FF6347" strokeWidth={8} fill="none" />
        </G>
      );
    case 'kilt':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={35} ry={30} fill="#2E5090" />
          <Path d="M 42 100 L 108 100 L 108 140 L 42 140 Z" fill="#2E5090" />
          <Path d="M 55 100 L 55 140" stroke="#DC143C" strokeWidth={2} />
          <Path d="M 75 100 L 75 140" stroke="#DC143C" strokeWidth={2} />
          <Path d="M 95 100 L 95 140" stroke="#DC143C" strokeWidth={2} />
          <Path d="M 42 115 L 108 115" stroke="#FFD700" strokeWidth={1} />
          <Path d="M 42 130 L 108 130" stroke="#FFD700" strokeWidth={1} />
        </G>
      );
    case 'hanbok':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={38} ry={32} fill="#E8B4C8" />
          <Rect x={55} y={95} width={40} height={15} rx={5} fill="#FFFFFF" />
          <Path d="M 65 95 L 75 105 L 85 95" stroke="#9B59B6" strokeWidth={2} fill="none" />
          <Rect x={65} y={108} width={20} height={4} rx={2} fill="#9B59B6" />
        </G>
      );
    case 'dashiki':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={35} ry={30} fill="#FF8C00" />
          <Path d="M 60 90 L 90 90 L 95 130 L 55 130 Z" fill="#FFD700" />
          <Circle cx={75} cy={100} r={8} fill="none" stroke="#DC143C" strokeWidth={2} />
          <Path d="M 67 108 L 83 108" stroke="#DC143C" strokeWidth={2} />
          <Path d="M 65 115 L 85 115" stroke="#DC143C" strokeWidth={2} />
        </G>
      );
    case 'poncho':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={42} ry={28} fill="#E8C85A" />
          <Path d="M 33 115 L 75 85 L 117 115" fill="#DC143C" />
          <Path d="M 40 112 L 110 112" stroke="#FFFFFF" strokeWidth={2} />
          <Path d="M 45 118 L 105 118" stroke="#2E5090" strokeWidth={2} />
          <Path d="M 40 124 L 110 124" stroke="#FFFFFF" strokeWidth={2} />
        </G>
      );
    case 'toga':
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={35} ry={30} fill="#F5F5F5" />
          <Path d="M 50 95 Q 40 105 45 130" stroke="#E0D8C8" strokeWidth={3} fill="none" />
          <Path d="M 100 90 Q 110 110 95 130" stroke="#F5F5F5" strokeWidth={8} fill="none" />
          <Rect x={48} y={100} width={55} height={5} rx={2} fill="#FFD700" />
        </G>
      );
    default:
      // Default purple tunic
      return (
        <G>
          <Ellipse cx={75} cy={115} rx={35} ry={30} fill="url(#tunicGradient)" />
          <Rect x={45} y={100} width={60} height={8} rx={4} fill={colors.visby.hair.brown} />
          <Circle cx={75} cy={104} r={4} fill={colors.reward.gold} />
        </G>
      );
  }
};

const renderAccessory = (accessoryId: string | undefined) => {
  switch (accessoryId) {
    case 'sword':
      return (
        <G>
          <Rect x={112} y={90} width={4} height={35} rx={2} fill="#C0C0C0" />
          <Rect x={106} y={88} width={16} height={5} rx={2} fill="#8B4513" />
          <Circle cx={114} cy={90} r={2} fill="#FFD700" />
        </G>
      );
    case 'shield':
      return (
        <G>
          <Circle cx={25} cy={110} r={18} fill="#2E5090" stroke="#FFD700" strokeWidth={2} />
          <Path d="M 15 110 L 25 100 L 35 110 L 25 120 Z" fill="#FFD700" />
        </G>
      );
    case 'fan':
      return (
        <G>
          <Path d="M 115 100 L 130 80 L 135 85 L 120 105 Z" fill="#DC143C" />
          <Path d="M 118 95 L 128 82" stroke="#FFD700" strokeWidth={1} />
          <Path d="M 120 100 L 132 84" stroke="#FFD700" strokeWidth={1} />
        </G>
      );
    case 'maracas':
      return (
        <G>
          <Rect x={112} y={95} width={3} height={25} rx={1} fill="#8B4513" />
          <Ellipse cx={113.5} cy={92} rx={8} ry={10} fill="#FF6347" />
          <Path d="M 107 88 L 120 88" stroke="#FFD700" strokeWidth={1} />
        </G>
      );
    case 'lantern':
      return (
        <G>
          <Rect x={115} y={85} width={2} height={10} fill="#8B4513" />
          <Ellipse cx={116} cy={102} rx={8} ry={10} fill="#FF4500" opacity={0.8} />
          <Ellipse cx={116} cy={102} rx={5} ry={7} fill="#FFD700" opacity={0.6} />
        </G>
      );
    case 'bagpipes':
      return (
        <G>
          <Ellipse cx={25} cy={105} rx={12} ry={15} fill="#8B4513" />
          <Rect x={20} y={85} width={3} height={20} fill="#2F2F2F" />
          <Rect x={28} y={85} width={3} height={15} fill="#2F2F2F" />
          <Rect x={24} y={88} width={3} height={25} fill="#2F2F2F" />
        </G>
      );
    case 'necklace':
      return (
        <G>
          <Path d="M 50 85 Q 75 95 100 85" stroke="#FFD700" strokeWidth={2} fill="none" />
          <Circle cx={75} cy={93} r={4} fill="#40E0D0" />
        </G>
      );
    case 'scarf':
      return (
        <G>
          <Path d="M 45 80 Q 75 92 105 80" stroke="#DC143C" strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M 45 82 L 35 110" stroke="#DC143C" strokeWidth={5} fill="none" strokeLinecap="round" />
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
  const blink = useSharedValue(1);
  const waveRotation = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      bounce.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      const startBlinking = () => {
        setTimeout(() => {
          blink.value = withSequence(
            withTiming(0, { duration: 100 }),
            withTiming(1, { duration: 100 })
          );
          startBlinking();
        }, Math.random() * 3000 + 2000);
      };
      startBlinking();

      if (mood === 'excited') {
        waveRotation.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 200 }),
            withTiming(15, { duration: 200 })
          ),
          -1,
          true
        );
      }
    }

    return () => {
      bounce.value = 0;
      blink.value = 1;
      waveRotation.value = 0;
    };
  }, [animated, mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const renderEyes = () => {
    switch (mood) {
      case 'happy':
        return (
          <>
            <Path d="M 47 55 Q 54 48 61 55" stroke={appearance.eyeColor} strokeWidth={3} fill="none" strokeLinecap="round" />
            <Path d="M 89 55 Q 96 48 103 55" stroke={appearance.eyeColor} strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        );
      case 'excited':
        return (
          <>
            <Circle cx={54} cy={52} r={6} fill={appearance.eyeColor} />
            <Circle cx={96} cy={52} r={6} fill={appearance.eyeColor} />
            <Circle cx={52} cy={50} r={2} fill="#FFFFFF" />
            <Circle cx={94} cy={50} r={2} fill="#FFFFFF" />
          </>
        );
      case 'sleepy':
        return (
          <>
            <Ellipse cx={54} cy={54} rx={7} ry={3} fill={appearance.eyeColor} />
            <Ellipse cx={96} cy={54} rx={7} ry={3} fill={appearance.eyeColor} />
          </>
        );
      case 'surprised':
        return (
          <>
            <Circle cx={54} cy={52} r={8} fill="#FFFFFF" stroke={appearance.eyeColor} strokeWidth={2} />
            <Circle cx={96} cy={52} r={8} fill="#FFFFFF" stroke={appearance.eyeColor} strokeWidth={2} />
            <Circle cx={54} cy={52} r={4} fill={appearance.eyeColor} />
            <Circle cx={96} cy={52} r={4} fill={appearance.eyeColor} />
          </>
        );
      case 'thinking':
      case 'curious':
        return (
          <>
            <Circle cx={54} cy={50} r={6} fill={appearance.eyeColor} />
            <Circle cx={96} cy={50} r={6} fill={appearance.eyeColor} />
            <Circle cx={56} cy={48} r={2} fill="#FFFFFF" />
            <Circle cx={98} cy={48} r={2} fill="#FFFFFF" />
          </>
        );
      default:
        return (
          <>
            <Circle cx={54} cy={52} r={5} fill={appearance.eyeColor} />
            <Circle cx={96} cy={52} r={5} fill={appearance.eyeColor} />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (mood) {
      case 'happy':
        return <Path d="M 62 72 Q 75 85 88 72" stroke={colors.visby.features.mouth} strokeWidth={3} fill="none" strokeLinecap="round" />;
      case 'excited':
        return <Path d="M 60 70 Q 75 90 90 70" stroke={colors.visby.features.mouth} strokeWidth={3} fill="none" strokeLinecap="round" />;
      case 'sleepy':
        return <Path d="M 65 75 L 85 75" stroke={colors.visby.features.mouth} strokeWidth={2} strokeLinecap="round" />;
      case 'surprised':
        return <Ellipse cx={75} cy={78} rx={6} ry={8} fill={colors.visby.features.mouth} />;
      case 'proud':
      case 'adventurous':
        return <Path d="M 60 70 Q 75 82 90 70" stroke={colors.visby.features.mouth} strokeWidth={3} fill="none" strokeLinecap="round" />;
      default:
        return <Path d="M 65 72 Q 75 80 85 72" stroke={colors.visby.features.mouth} strokeWidth={2} fill="none" strokeLinecap="round" />;
    }
  };

  const safeSize = typeof size === 'number' && !isNaN(size) && size > 0 ? size : 150;

  return (
    <Animated.View style={[styles.container, { width: safeSize, height: safeSize }, animatedStyle]}>
      <Svg width={safeSize} height={safeSize} viewBox="0 0 150 150">
        <Defs>
          <LinearGradient id="tunicGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.primary.wisteria} />
            <Stop offset="100%" stopColor={colors.primary.wisteriaDark} />
          </LinearGradient>
          <LinearGradient id="hairGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={appearance.hairColor} />
            <Stop offset="100%" stopColor={adjustColor(appearance.hairColor, -30)} />
          </LinearGradient>
        </Defs>

        {/* Outfit / Body */}
        {renderOutfit(equipped?.outfit)}

        {/* Backpack straps */}
        {!equipped?.outfit && (
          <G>
            <Path d="M 50 90 L 50 120" stroke={colors.visby.hair.brown} strokeWidth={4} strokeLinecap="round" />
            <Path d="M 100 90 L 100 120" stroke={colors.visby.hair.brown} strokeWidth={4} strokeLinecap="round" />
          </G>
        )}

        {/* Head */}
        <Circle cx={75} cy={55} r={40} fill={appearance.skinTone} />

        {/* Hair */}
        <G>
          <Path
            d="M 35 45 Q 35 15 75 10 Q 115 15 115 45 Q 115 35 100 35 L 50 35 Q 35 35 35 45"
            fill="url(#hairGradient)"
          />
          <Path d="M 55 18 Q 65 8 75 12" stroke={adjustColor(appearance.hairColor, 20)} strokeWidth={2} fill="none" />
        </G>

        {/* Hat (on top of hair) */}
        {renderHat(equipped?.hat, appearance.hairColor)}

        {/* Cheeks */}
        <Circle cx={42} cy={65} r={8} fill={colors.visby.features.blush} opacity={0.5} />
        <Circle cx={108} cy={65} r={8} fill={colors.visby.features.blush} opacity={0.5} />

        {/* Eyes */}
        {renderEyes()}

        {/* Eyebrows */}
        <Path d="M 45 42 L 60 40" stroke={adjustColor(appearance.hairColor, -20)} strokeWidth={2} strokeLinecap="round" />
        <Path d="M 90 40 L 105 42" stroke={adjustColor(appearance.hairColor, -20)} strokeWidth={2} strokeLinecap="round" />

        {/* Nose */}
        <Ellipse cx={75} cy={62} rx={4} ry={5} fill={adjustColor(appearance.skinTone, -10)} />

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
