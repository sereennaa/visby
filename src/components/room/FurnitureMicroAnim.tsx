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

type AnimationType = 'steam' | 'zzz' | 'confetti' | 'book' | 'sparkle' | 'glow_toggle'
  | 'candle' | 'fish' | 'clock' | 'bubble' | 'cat_stretch' | 'plant_sway';

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
    case 'candle':
      return <CandleFlicker size={size} />;
    case 'fish':
      return <FishSwim size={size} />;
    case 'clock':
      return <ClockTick size={size} />;
    case 'bubble':
      return <BubbleRise size={size} />;
    case 'cat_stretch':
      return <CatStretch size={size} />;
    case 'plant_sway':
      return <PlantSway size={size} />;
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

// --- New ambient micro-animations ---

const CandleFlicker: React.FC<{ size: number }> = ({ size }) => {
  const flicker = useSharedValue(0.6);
  const sway = useSharedValue(0);

  useEffect(() => {
    flicker.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 150 + Math.random() * 200 }),
        withTiming(0.4, { duration: 200 + Math.random() * 300 }),
        withTiming(0.8, { duration: 100 + Math.random() * 150 }),
      ),
      -1,
      true,
    );
    sway.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(-3, { duration: 500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    return () => {
      cancelAnimation(flicker);
      cancelAnimation(sway);
    };
  }, []);

  const flameStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size * 0.42,
    bottom: size * 0.45,
    width: 8,
    height: 14,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: '#FF9800',
    opacity: flicker.value,
    transform: [{ rotate: `${sway.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size * 0.25,
    bottom: size * 0.35,
    width: size * 0.4,
    height: size * 0.4,
    borderRadius: size * 0.2,
    backgroundColor: 'rgba(255, 180, 50, 0.15)',
    opacity: flicker.value * 0.5,
  }));

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      <Animated.View style={glowStyle} />
      <Animated.View style={flameStyle} />
    </View>
  );
};

const FishSwim: React.FC<{ size: number }> = ({ size }) => {
  const x = useSharedValue(size * 0.2);
  const flip = useSharedValue(1);

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(size * 0.7, { duration: 3000, easing: Easing.inOut(Easing.cubic) }),
        withTiming(size * 0.2, { duration: 3000, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      false,
    );
    flip.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(-1, { duration: 3000 }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(x);
      cancelAnimation(flip);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x.value,
    top: size * 0.4,
    transform: [{ scaleX: flip.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      <Animated.Text style={[style, { fontSize: 14 }]}>🐠</Animated.Text>
    </View>
  );
};

const ClockTick: React.FC<{ size: number }> = ({ size }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 60000, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, []);

  const handStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size * 0.48,
    top: size * 0.2,
    width: 2,
    height: size * 0.15,
    backgroundColor: '#555',
    borderRadius: 1,
    transformOrigin: 'bottom',
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      <Animated.View style={handStyle} />
    </View>
  );
};

const BubbleRise: React.FC<{ size: number }> = ({ size }) => {
  const bubbles = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: size * 0.3 + Math.random() * size * 0.4,
      delay: i * 600,
      bubSize: 4 + Math.random() * 4,
    })), [size]);

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      {bubbles.map((b) => (
        <BubbleParticle key={b.id} x={b.x} delay={b.delay} size={size} bubSize={b.bubSize} />
      ))}
    </View>
  );
};

const BubbleParticle: React.FC<{ x: number; delay: number; size: number; bubSize: number }> = ({ x, delay, size, bubSize }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const wobble = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-size * 0.5, { duration: 2000, easing: Easing.out(Easing.cubic) }),
      ),
      -1,
      false,
    ));
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 1800 }),
      ),
      -1,
      false,
    ));
    wobble.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(4, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(-4, { duration: 500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    ));
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(wobble);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x,
    bottom: size * 0.3,
    width: bubSize,
    height: bubSize,
    borderRadius: bubSize / 2,
    borderWidth: 1,
    borderColor: 'rgba(180, 220, 255, 0.6)',
    backgroundColor: 'rgba(200, 230, 255, 0.15)',
    transform: [{ translateY: translateY.value }, { translateX: wobble.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
};

const CatStretch: React.FC<{ size: number }> = ({ size }) => {
  const stretch = useSharedValue(0);
  const tail = useSharedValue(0);

  useEffect(() => {
    const triggerStretch = () => {
      stretch.value = withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.cubic) }),
      );
    };
    const interval = setInterval(() => {
      if (Math.random() < 0.3) triggerStretch();
    }, 5000);
    tail.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-8, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    return () => {
      clearInterval(interval);
      cancelAnimation(stretch);
      cancelAnimation(tail);
    };
  }, []);

  const catStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size * 0.3,
    bottom: size * 0.2,
    transform: [
      { scaleX: 1 + stretch.value * 0.15 },
      { scaleY: 1 - stretch.value * 0.1 },
    ],
  }));

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      <Animated.Text style={[catStyle, { fontSize: 20 }]}>🐱</Animated.Text>
    </View>
  );
};

const PlantSway: React.FC<{ size: number }> = ({ size }) => {
  const sway = useSharedValue(0);

  useEffect(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(sway);
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: size * 0.3,
    bottom: size * 0.25,
    transformOrigin: 'bottom',
    transform: [{ rotate: `${sway.value}deg` }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size, pointerEvents: 'none' }]}>
      <Animated.Text style={[style, { fontSize: 22 }]}>🌿</Animated.Text>
    </View>
  );
};

export function getAnimTypeForInteraction(interactionType?: string): AnimationType | null {
  switch (interactionType) {
    case 'stove':
    case 'table':
    case 'teapot':
    case 'kettle':
    case 'coffee':
      return 'steam';
    case 'bed':
      return 'zzz';
    case 'toy':
      return 'confetti';
    case 'bookshelf':
      return 'book';
    case 'lamp':
      return 'glow_toggle';
    case 'candle':
    case 'incense':
    case 'lantern':
      return 'candle';
    case 'fishbowl':
    case 'aquarium':
      return 'fish';
    case 'clock':
      return 'clock';
    case 'fountain':
    case 'bath':
    case 'hot_spring':
      return 'bubble';
    case 'cat':
    case 'pet':
      return 'cat_stretch';
    case 'plant':
    case 'bonsai':
    case 'flower':
      return 'plant_sway';
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
