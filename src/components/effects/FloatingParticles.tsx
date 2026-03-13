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
  emoji: string;
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
  variant?: 'sparkle' | 'stars' | 'mixed' | 'snow' | 'hearts';
  opacity?: number;
  speed?: 'slow' | 'normal' | 'fast';
}

const EMOJI_SETS = {
  sparkle: ['✨', '⭐', '💫', '✧', '⋆'],
  stars: ['⭐', '🌟', '💫', '✦', '☆'],
  mixed: ['✨', '⭐', '🌸', '🦋', '💫', '🌙', '⋆', '✧'],
  snow: ['❄️', '✧', '·', '⋆', '°'],
  hearts: ['💜', '💛', '✨', '💫', '🤍'],
};

const SPEED_MULTIPLIER = { slow: 1.6, normal: 1, fast: 0.6 };

const generateParticles = (count: number, variant: keyof typeof EMOJI_SETS): Particle[] => {
  const emojis = EMOJI_SETS[variant];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    startX: Math.random() * SCREEN_W,
    startY: Math.random() * SCREEN_H,
    size: 8 + Math.random() * 16,
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
      <Animated.Text style={{ fontSize: particle.size }}>{particle.emoji}</Animated.Text>
    </Animated.View>
  );
};

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 15,
  variant = 'sparkle',
  opacity = 0.7,
  speed = 'normal',
}) => {
  const particles = useMemo(() => generateParticles(count, variant), [count, variant]);
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
