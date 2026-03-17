import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export type ParticleShape = 'circle' | 'petal' | 'raindrop' | 'snowflake' | 'star' | 'leaf';

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
  rotation: number;
}

interface FloatingParticlesProps {
  count?: number;
  variant?: 'sparkle' | 'stars' | 'mixed' | 'snow' | 'hearts' | 'petals' | 'dust' | 'aurora'
    | 'cherry_blossom' | 'sand' | 'northern_lights' | 'fireflies' | 'autumn_leaves' | 'ocean_bubbles';
  customColors?: readonly string[];
  opacity?: number;
  speed?: 'slow' | 'normal' | 'fast';
  shape?: ParticleShape;
}

const MAX_PARTICLES = 15;

const COLOR_SETS: Record<string, string[]> = {
  sparkle: [colors.reward.gold, colors.reward.amber, '#FFE082', '#FFF59D', colors.primary.wisteriaLight],
  stars: [colors.reward.gold, '#FFE082', colors.reward.amber, '#FFF59D', '#FFCC80'],
  mixed: [colors.reward.gold, colors.primary.wisteriaLight, '#FECDD3', '#A5D6A7', '#FFE082', '#B3E5FC'],
  snow: ['#E3F2FD', '#BBDEFB', '#E0E0E0', '#F5F5F5', '#CFD8DC'],
  hearts: [colors.primary.wisteriaLight, colors.reward.gold, '#E1BEE7', '#FFE082'],
  petals: ['#FFB6C1', '#FFC0CB', '#FFE4EC', '#FFF0F5', '#F8B4C4'],
  dust: ['#E8DCC8', '#D4C4B0', '#FFE4B5', '#C9B8A8', '#F5F0DC'],
  cherry_blossom: ['#FFB7C5', '#FFC0CB', '#FFE0E8', '#FF9EAF', '#FFDBE6', '#FFD1DC'],
  sand: ['#E8D5A3', '#D4C090', '#C4A86C', '#B89B5E', '#F0E0B8', '#DCC898'],
  northern_lights: ['#43E97B', '#38D9A9', '#38C9D4', '#5B9EE1', '#7B68EE', '#9B59B6'],
  fireflies: ['#FFEB3B', '#FFC107', '#FFD54F', '#FFF176', '#FFEE58', '#FDD835'],
  autumn_leaves: ['#E65100', '#FF6D00', '#FF9100', '#D84315', '#BF360C', '#F9A825'],
  ocean_bubbles: ['#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#E0F7FA', '#B2EBF2'],
  aurora: ['#A5D6A7', '#81C784', '#B3E5FC', '#90CAF9', '#CE93D8'],
};

const VARIANT_DEFAULT_SHAPE: Partial<Record<string, ParticleShape>> = {
  petals: 'petal',
  snow: 'snowflake',
  stars: 'star',
  aurora: 'leaf',
};

const SPEED_MULTIPLIER = { slow: 1.6, normal: 1, fast: 0.6 };

const getColorsForVariant = (variant: keyof typeof COLOR_SETS, customColors?: readonly string[]): string[] => {
  if (customColors && customColors.length > 0) return [...customColors];
  return COLOR_SETS[variant] ?? COLOR_SETS.sparkle;
};

const generateParticles = (count: number, variant: keyof typeof COLOR_SETS, customColors?: readonly string[]): Particle[] => {
  const particleColors = getColorsForVariant(variant, customColors);
  const capped = Math.min(count, MAX_PARTICLES);
  return Array.from({ length: capped }, (_, i) => ({
    id: i,
    color: particleColors[i % particleColors.length],
    startX: Math.random() * SCREEN_W,
    startY: Math.random() * SCREEN_H,
    size: 4 + Math.random() * 5,
    duration: 4000 + Math.random() * 3000,
    delay: Math.random() * 2000,
    driftX: -15 + Math.random() * 30,
    floatDistance: 15 + Math.random() * 30,
    rotation: Math.random() * 360,
  }));
};

const ShapedParticle: React.FC<{ shape: ParticleShape; size: number; color: string }> = ({ shape, size, color }) => {
  switch (shape) {
    case 'petal':
      return (
        <View style={{
          width: size * 1.2,
          height: size * 0.7,
          borderTopLeftRadius: size,
          borderTopRightRadius: size * 0.2,
          borderBottomLeftRadius: size * 0.2,
          borderBottomRightRadius: size,
          backgroundColor: color,
        }} />
      );
    case 'raindrop':
      return (
        <View style={{
          width: size * 0.5,
          height: size * 1.3,
          borderTopLeftRadius: size * 0.1,
          borderTopRightRadius: size * 0.1,
          borderBottomLeftRadius: size,
          borderBottomRightRadius: size,
          backgroundColor: color,
        }} />
      );
    case 'snowflake':
      return (
        <Text style={{ fontSize: size * 1.8, color, lineHeight: size * 2.2 }}>{'\u2744'}</Text>
      );
    case 'star':
      return (
        <Text style={{ fontSize: size * 1.5, color, lineHeight: size * 2 }}>{'\u2726'}</Text>
      );
    case 'leaf':
      return (
        <View style={{
          width: size * 1.1,
          height: size * 0.6,
          borderTopLeftRadius: size,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: size,
          backgroundColor: color,
        }} />
      );
    default:
      return (
        <View style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }} />
      );
  }
};

const ParticleView = React.memo<{ particle: Particle; speedMult: number; baseOpacity: number; shape: ParticleShape }>(({
  particle,
  speedMult,
  baseOpacity,
  shape,
}) => {
  const progress = useSharedValue(0);

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
    return () => cancelAnimation(progress);
  }, []);

  const style = useAnimatedStyle(() => {
    const rot = shape !== 'circle'
      ? interpolate(progress.value, [0, 1], [particle.rotation, particle.rotation + 45])
      : 0;
    return {
      opacity: interpolate(progress.value, [0, 0.5, 1], [0.1, baseOpacity, 0.1]),
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [0, -particle.floatDistance]) },
        { translateX: interpolate(progress.value, [0, 0.5, 1], [0, particle.driftX, 0]) },
        { scale: interpolate(progress.value, [0, 0.5, 1], [0.7, 1.05, 0.7]) },
        { rotate: `${rot}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        { position: 'absolute', left: particle.startX, top: particle.startY },
        style,
      ]}
    >
      <ShapedParticle shape={shape} size={particle.size} color={particle.color} />
    </Animated.View>
  );
});

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 6,
  variant = 'sparkle',
  customColors,
  opacity = 0.7,
  speed = 'normal',
  shape,
}) => {
  const effectiveVariant = COLOR_SETS[variant] ? variant : 'sparkle';
  const effectiveShape = shape ?? VARIANT_DEFAULT_SHAPE[effectiveVariant] ?? 'circle';
  const particles = useMemo(
    () => generateParticles(count, effectiveVariant, customColors),
    [count, effectiveVariant, customColors],
  );
  const speedMult = SPEED_MULTIPLIER[speed];

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      {particles.map((p) => (
        <ParticleView key={p.id} particle={p} speedMult={speedMult} baseOpacity={opacity} shape={effectiveShape} />
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

export function getCountryParticleVariant(countryId: string): {
  variant: FloatingParticlesProps['variant'];
  speed: FloatingParticlesProps['speed'];
  opacity: number;
} {
  const map: Record<string, { variant: FloatingParticlesProps['variant']; speed: FloatingParticlesProps['speed']; opacity: number }> = {
    jp: { variant: 'cherry_blossom', speed: 'slow', opacity: 0.5 },
    eg: { variant: 'sand', speed: 'normal', opacity: 0.3 },
    no: { variant: 'northern_lights', speed: 'slow', opacity: 0.4 },
    ke: { variant: 'fireflies', speed: 'slow', opacity: 0.5 },
    fr: { variant: 'autumn_leaves', speed: 'slow', opacity: 0.4 },
    au: { variant: 'dust', speed: 'normal', opacity: 0.3 },
    br: { variant: 'petals', speed: 'normal', opacity: 0.4 },
    it: { variant: 'sparkle', speed: 'slow', opacity: 0.3 },
    mx: { variant: 'mixed', speed: 'normal', opacity: 0.35 },
    gr: { variant: 'ocean_bubbles', speed: 'slow', opacity: 0.3 },
    gb: { variant: 'snow', speed: 'slow', opacity: 0.3 },
    cn: { variant: 'stars', speed: 'slow', opacity: 0.35 },
    in: { variant: 'hearts', speed: 'slow', opacity: 0.3 },
    kr: { variant: 'sparkle', speed: 'normal', opacity: 0.35 },
    th: { variant: 'petals', speed: 'slow', opacity: 0.35 },
    tr: { variant: 'dust', speed: 'slow', opacity: 0.3 },
  };
  return map[countryId] || { variant: 'sparkle', speed: 'slow', opacity: 0.3 };
}

export default FloatingParticles;
