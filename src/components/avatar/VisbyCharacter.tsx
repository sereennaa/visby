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

// Visby appearance types
interface VisbyAppearance {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  eyeShape: string;
}

interface VisbyCharacterProps {
  appearance?: VisbyAppearance;
  mood?: 'happy' | 'excited' | 'sleepy' | 'surprised' | 'thinking';
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

export const VisbyCharacter: React.FC<VisbyCharacterProps> = ({
  appearance = defaultAppearance,
  mood = 'happy',
  size = 150,
  animated = true,
}) => {
  // Animation values
  const bounce = useSharedValue(0);
  const blink = useSharedValue(1);
  const waveRotation = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      // Gentle bouncing
      bounce.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Occasional blinking
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

      // Wave for excited mood
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

  // Eye rendering based on mood (using fixed viewBox coordinates)
  const renderEyes = () => {
    switch (mood) {
      case 'happy':
        return (
          <>
            {/* Happy arc eyes */}
            <Path
              d="M 47 55 Q 54 48 61 55"
              stroke={appearance.eyeColor}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 89 55 Q 96 48 103 55"
              stroke={appearance.eyeColor}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Star-like excited eyes */}
            <Circle cx={54} cy={52} r={6} fill={appearance.eyeColor} />
            <Circle cx={96} cy={52} r={6} fill={appearance.eyeColor} />
            <Circle cx={52} cy={50} r={2} fill="#FFFFFF" />
            <Circle cx={94} cy={50} r={2} fill="#FFFFFF" />
          </>
        );
      case 'sleepy':
        return (
          <>
            {/* Half-closed sleepy eyes */}
            <Ellipse cx={54} cy={54} rx={7} ry={3} fill={appearance.eyeColor} />
            <Ellipse cx={96} cy={54} rx={7} ry={3} fill={appearance.eyeColor} />
          </>
        );
      case 'surprised':
        return (
          <>
            {/* Wide open surprised eyes */}
            <Circle cx={54} cy={52} r={8} fill="#FFFFFF" stroke={appearance.eyeColor} strokeWidth={2} />
            <Circle cx={96} cy={52} r={8} fill="#FFFFFF" stroke={appearance.eyeColor} strokeWidth={2} />
            <Circle cx={54} cy={52} r={4} fill={appearance.eyeColor} />
            <Circle cx={96} cy={52} r={4} fill={appearance.eyeColor} />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Looking up thinking eyes */}
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

  // Mouth rendering based on mood (using fixed viewBox coordinates)
  const renderMouth = () => {
    switch (mood) {
      case 'happy':
        return (
          <Path
            d="M 62 72 Q 75 85 88 72"
            stroke={colors.visby.features.mouth}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        );
      case 'excited':
        return (
          <Path
            d="M 60 70 Q 75 90 90 70"
            stroke={colors.visby.features.mouth}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        );
      case 'sleepy':
        return (
          <Path
            d="M 65 75 L 85 75"
            stroke={colors.visby.features.mouth}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      case 'surprised':
        return (
          <Ellipse cx={75} cy={78} rx={6} ry={8} fill={colors.visby.features.mouth} />
        );
      case 'thinking':
        return (
          <Path
            d="M 65 76 Q 72 72 80 76"
            stroke={colors.visby.features.mouth}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <Path
            d="M 65 72 Q 75 80 85 72"
            stroke={colors.visby.features.mouth}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        );
    }
  };

  // Ensure size is a valid number
  const safeSize = typeof size === 'number' && !isNaN(size) && size > 0 ? size : 150;

  return (
    <Animated.View style={[styles.container, { width: safeSize, height: safeSize }, animatedStyle]}>
      <Svg width={safeSize} height={safeSize} viewBox="0 0 150 150">
        <Defs>
          {/* Gradient for tunic */}
          <LinearGradient id="tunicGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.primary.wisteria} />
            <Stop offset="100%" stopColor={colors.primary.wisteriaDark} />
          </LinearGradient>
          {/* Gradient for hair */}
          <LinearGradient id="hairGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={appearance.hairColor} />
            <Stop offset="100%" stopColor={adjustColor(appearance.hairColor, -30)} />
          </LinearGradient>
        </Defs>

        {/* Body / Tunic */}
        <Ellipse cx={75} cy={115} rx={35} ry={30} fill="url(#tunicGradient)" />
        
        {/* Belt */}
        <Rect x={45} y={100} width={60} height={8} rx={4} fill={colors.visby.hair.brown} />
        <Circle cx={75} cy={104} r={4} fill={colors.reward.gold} />

        {/* Head */}
        <Circle cx={75} cy={55} r={40} fill={appearance.skinTone} />

        {/* Hair */}
        <G>
          {/* Main hair shape */}
          <Path
            d="M 35 45 Q 35 15 75 10 Q 115 15 115 45 Q 115 35 100 35 L 50 35 Q 35 35 35 45"
            fill="url(#hairGradient)"
          />
          {/* Hair texture details */}
          <Path
            d="M 55 18 Q 65 8 75 12"
            stroke={adjustColor(appearance.hairColor, 20)}
            strokeWidth={2}
            fill="none"
          />
        </G>

        {/* Viking helmet hint (little horns/braids) */}
        <Path
          d="M 40 28 Q 30 18 25 25"
          stroke={appearance.hairColor}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 110 28 Q 120 18 125 25"
          stroke={appearance.hairColor}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />

        {/* Cheeks */}
        <Circle cx={42} cy={65} r={8} fill={colors.visby.features.blush} opacity={0.5} />
        <Circle cx={108} cy={65} r={8} fill={colors.visby.features.blush} opacity={0.5} />

        {/* Eyes */}
        {renderEyes()}

        {/* Eyebrows */}
        <Path
          d="M 45 42 L 60 40"
          stroke={adjustColor(appearance.hairColor, -20)}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Path
          d="M 90 40 L 105 42"
          stroke={adjustColor(appearance.hairColor, -20)}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Nose */}
        <Ellipse cx={75} cy={62} rx={4} ry={5} fill={adjustColor(appearance.skinTone, -10)} />

        {/* Mouth */}
        {renderMouth()}

        {/* Backpack straps hint */}
        <Path
          d="M 50 90 L 50 120"
          stroke={colors.visby.hair.brown}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Path
          d="M 100 90 L 100 120"
          stroke={colors.visby.hair.brown}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VisbyCharacter;
