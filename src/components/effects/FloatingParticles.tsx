import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Particle {
  id: number;
  color: string;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  floatDistance: number;
}

interface FloatingParticlesProps {
  count?: number;
  variant?: 'sparkle' | 'stars' | 'mixed' | 'snow' | 'hearts' | 'petals' | 'dust' | 'aurora';
  /** Override particle colors (e.g. country-specific cherry blossoms, castle dust) */
  customColors?: readonly string[];
  opacity?: number;
  speed?: 'slow' | 'normal' | 'fast';
}

const COLOR_SETS: Record<string, string[]> = {
  sparkle: [colors.reward.gold, colors.reward.amber, '#FFE082', '#FFF59D', colors.primary.wisteriaLight],
  stars: [colors.reward.gold, '#FFE082', colors.reward.amber, '#FFF59D', '#FFCC80'],
  mixed: [colors.reward.gold, colors.primary.wisteriaLight, '#FECDD3', '#A5D6A7', '#FFE082', '#B3E5FC', '#E1BEE7', '#FFF59D'],
  snow: ['#E3F2FD', '#BBDEFB', '#E0E0E0', '#F5F5F5', '#CFD8DC'],
  hearts: [colors.primary.wisteriaLight, colors.reward.gold, '#E1BEE7', '#FFE082', '#F5F5F5'],
  petals: ['#FFB6C1', '#FFC0CB', '#FFE4EC', '#FFF0F5', '#F8B4C4', '#FFFFFF'],
  dust: ['#E8DCC8', '#D4C4B0', '#FFE4B5', '#C9B8A8', '#F5F0DC', '#E0D8D0'],
  aurora: ['#A5D6A7', '#81C784', '#B3E5FC', '#90CAF9', '#CE93D8', '#E1BEE7'],
};

const SPEED_MULTIPLIER = { slow: 1.6, normal: 1, fast: 0.6 };

const getColorsForVariant = (variant: keyof typeof COLOR_SETS, customColors?: readonly string[]): string[] => {
  if (customColors && customColors.length > 0) return [...customColors];
  return COLOR_SETS[variant] ?? COLOR_SETS.sparkle;
};

const generateParticles = (count: number, variant: keyof typeof COLOR_SETS, customColors?: readonly string[]): Particle[] => {
  const particleColors = getColorsForVariant(variant, customColors);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: particleColors[i % particleColors.length],
    startX: Math.random() * SCREEN_W,
    startY: Math.random() * SCREEN_H,
    size: 4 + Math.random() * 6,
    duration: 3000 + Math.random() * 4000,
    delay: Math.random() * 3000,
    driftX: -20 + Math.random() * 40,
    floatDistance: 20 + Math.random() * 40,
  }));
};

const ParticleView: React.FC<{ particle: Particle; speedMult: number; baseOpacity: number }> = ({
  particle,
  speedMult,
  baseOpacity,
}) => {
  const progress = useSharedValue(0);
  const twinkle = useSharedValue(0);

  useEffect(() => {
    const dur = particle.duration * speedMult;
    progress.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: dur, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
          withTiming(0, { duration: dur, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
        ),
        -1,
        true,
      ),
    );
    twinkle.value = withDelay(
      particle.delay + 500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0.2, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(twinkle.value, [0, 1], [0.1, baseOpacity]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -particle.floatDistance]) },
      { translateX: interpolate(progress.value, [0, 0.5, 1], [0, particle.driftX, 0]) },
      { scale: interpolate(twinkle.value, [0, 1], [0.6, 1.1]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 15])}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.startX,
          top: particle.startY,
        },
        style,
      ]}
    >
      <View
        style={{
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        }}
      />
    </Animated.View>
  );
};

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 15,
  variant = 'sparkle',
  customColors,
  opacity = 0.7,
  speed = 'normal',
}) => {
  const effectiveVariant = COLOR_SETS[variant] ? variant : 'sparkle';
  const particles = useMemo(
    () => generateParticles(count, effectiveVariant, customColors),
    [count, effectiveVariant, customColors],
  );
  const speedMult = SPEED_MULTIPLIER[speed];

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      {particles.map((p) => (
        <ParticleView key={p.id} particle={p} speedMult={speedMult} baseOpacity={opacity} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});

export default FloatingParticles;
