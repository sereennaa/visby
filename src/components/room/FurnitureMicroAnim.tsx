import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

type AnimationType = 'steam' | 'zzz' | 'confetti' | 'book' | 'sparkle' | 'glow_toggle';

interface FurnitureMicroAnimProps {
  type: AnimationType;
  visible: boolean;
  size?: number;
}

export const FurnitureMicroAnim: React.FC<FurnitureMicroAnimProps> = ({ type, visible, size = 60 }) => {
  if (!visible) return null;

  switch (type) {
    case 'steam':
      return <SteamAnim size={size} />;
    case 'zzz':
      return <ZzzAnim size={size} />;
    case 'confetti':
      return <ConfettiBurst size={size} />;
    case 'book':
      return <BookFloat size={size} />;
    case 'sparkle':
      return <SparkleAnim size={size} />;
    case 'glow_toggle':
      return <GlowToggle size={size} />;
    default:
      return null;
  }
};

const SteamAnim: React.FC<{ size: number }> = ({ size }) => {
  const particles = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: size * 0.3 + Math.random() * size * 0.4,
      delay: i * 200,
    })), [size]);

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      {particles.map((p) => (
        <SteamParticle key={p.id} x={p.x} delay={p.delay} size={size} />
      ))}
    </View>
  );
};

const SteamParticle: React.FC<{ x: number; delay: number; size: number }> = ({ x, delay, size }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-size * 0.5, { duration: 1200, easing: Easing.out(Easing.cubic) }),
      ),
      -1, false,
    ));
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.6, { duration: 200 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1, false,
    ));
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.5, { duration: 0 }),
        withTiming(1.5, { duration: 1200 }),
      ),
      -1, false,
    ));
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x,
    bottom: size * 0.5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
};

const ZzzAnim: React.FC<{ size: number }> = ({ size }) => {
  const zzz = ['Z', 'z', 'Z'];
  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      {zzz.map((letter, i) => (
        <ZzzLetter key={i} letter={letter} index={i} size={size} />
      ))}
    </View>
  );
};

const ZzzLetter: React.FC<{ letter: string; index: number; size: number }> = ({ letter, index, size }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 400;
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-size * 0.4 - index * 10, { duration: 1500, easing: Easing.out(Easing.cubic) }),
      ),
      -1, false,
    ));
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0, { duration: 1200 }),
      ),
      -1, false,
    ));
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    right: size * 0.1 + index * 8,
    bottom: size * 0.6,
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[style, { fontSize: 14 - index * 2, color: '#9B8EC4', fontWeight: '700' }]}>
      {letter}
    </Animated.Text>
  );
};

const ConfettiBurst: React.FC<{ size: number }> = ({ size }) => {
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      color: ['#FFD700', '#FF69B4', '#40E0D0', '#FF6347', '#9B59B6', '#87CEEB', '#50C878', '#FF8C00'][i],
      angle: (i / 8) * Math.PI * 2,
    })), []);

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      {particles.map((p) => (
        <ConfettiPiece key={p.id} color={p.color} angle={p.angle} size={size} />
      ))}
    </View>
  );
};

const ConfettiPiece: React.FC<{ color: string; angle: number; size: number }> = ({ color, angle, size }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const dist = size * 0.4;
    translateX.value = withTiming(Math.cos(angle) * dist, { duration: 600, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(Math.sin(angle) * dist, { duration: 600, easing: Easing.out(Easing.cubic) });
    opacity.value = withDelay(400, withTiming(0, { duration: 200 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size / 2,
    top: size / 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
};

const BookFloat: React.FC<{ size: number }> = ({ size }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(-size * 0.5, { duration: 1000, easing: Easing.out(Easing.cubic) }),
    );
    opacity.value = withSequence(
      withTiming(0.9, { duration: 200 }),
      withDelay(500, withTiming(0, { duration: 300 })),
    );
    rotate.value = withSequence(
      withTiming(-10, { duration: 500 }),
      withTiming(10, { duration: 500 }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size * 0.35,
    bottom: size * 0.4,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[style, { fontSize: 18 }]}>
      {'\u{1F4D6}'}
    </Animated.Text>
  );
};

const SparkleAnim: React.FC<{ size: number }> = ({ size }) => {
  const particles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: size * 0.2 + Math.random() * size * 0.6,
      y: size * 0.1 + Math.random() * size * 0.5,
      delay: i * 150,
    })), [size]);

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      {particles.map((p) => (
        <SparklePoint key={p.id} x={p.x} y={p.y} delay={p.delay} />
      ))}
    </View>
  );
};

const SparklePoint: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSequence(
      withTiming(1.5, { duration: 200 }),
      withTiming(0, { duration: 300 }),
    ));
    opacity.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 100 }),
      withDelay(200, withTiming(0, { duration: 200 })),
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x,
    top: y,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
};

const GlowToggle: React.FC<{ size: number }> = ({ size }) => {
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0.5, { duration: 800 }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size * 0.2,
    top: size * 0.1,
    width: size * 0.6,
    height: size * 0.6,
    borderRadius: size * 0.3,
    backgroundColor: 'rgba(255, 220, 130, 0.4)',
    opacity: glow.value,
  }));

  return <Animated.View style={style} />;
};

export function getAnimTypeForInteraction(interactionType?: string): AnimationType | null {
  switch (interactionType) {
    case 'stove':
    case 'table':
      return 'steam';
    case 'bed':
      return 'zzz';
    case 'toy':
      return 'confetti';
    case 'bookshelf':
      return 'book';
    case 'lamp':
      return 'glow_toggle';
    default:
      return 'sparkle';
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
