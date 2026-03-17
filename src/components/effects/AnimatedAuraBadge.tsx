import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  runOnJS,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W } = Dimensions.get('window');
const PARTICLE_COUNT = 12;

const GOLD_COLORS = ['#FFD700', '#FFBF00', '#FFE57F', '#FFC107', '#FF9800', '#FFE082'];

interface AnimatedAuraBadgeProps {
  amount: number;
  style?: ViewStyle;
  showParticles?: boolean;
}

interface GoldParticle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
  delay: number;
}

const GoldParticleView: React.FC<{ particle: GoldParticle; trigger: { value: number } }> = ({
  particle,
  trigger,
}) => {
  const style = useAnimatedStyle(() => {
    if (trigger.value === 0) return { opacity: 0 };
    const progress = trigger.value;
    return {
      opacity: interpolate(progress, [0, 0.2, 0.7, 1], [0, 1, 1, 0]),
      transform: [
        { translateX: interpolate(progress, [0, 1], [particle.startX, particle.endX]) },
        { translateY: interpolate(progress, [0, 1], [particle.startY, particle.endY]) },
        { scale: interpolate(progress, [0, 0.3, 0.7, 1], [0.3, 1.2, 1, 0.2]) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
        style,
      ]}
    />
  );
};

export const AnimatedAuraBadge: React.FC<AnimatedAuraBadgeProps> = ({
  amount,
  style,
  showParticles = true,
}) => {
  const prevAmount = useRef(amount);
  const displayedAmount = useSharedValue(amount);
  const displayText = useSharedValue(amount.toString());
  const badgeScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const particleTrigger = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const [displayNum, setDisplayNum] = React.useState(amount);

  const particles = React.useMemo<GoldParticle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const dist = 25 + Math.random() * 35;
      return {
        id: i,
        startX: (Math.random() - 0.5) * 60 - 20,
        startY: 30 + Math.random() * 20,
        endX: Math.cos(angle) * dist,
        endY: Math.sin(angle) * dist - 10,
        color: GOLD_COLORS[i % GOLD_COLORS.length],
        size: 3 + Math.random() * 4,
        delay: i * 30,
      };
    });
  }, []);

  const updateDisplay = React.useCallback((val: number) => {
    setDisplayNum(val);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const diff = amount - prevAmount.current;
    if (diff > 0 && prevAmount.current > 0) {
      hapticService.success();

      badgeScale.value = withSequence(
        withTiming(1.25, { duration: 150, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );

      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 150 }),
        withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }),
      );

      sparkleRotation.value = withSequence(
        withTiming(sparkleRotation.value + 180, { duration: 400, easing: Easing.out(Easing.cubic) }),
      );

      if (showParticles) {
        particleTrigger.value = 0;
        particleTrigger.value = withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.cubic),
        });
      }

      const steps = Math.min(diff, 20);
      const stepDur = Math.min(300 / steps, 50);
      const start = prevAmount.current;

      for (let i = 1; i <= steps; i++) {
        const val = Math.round(start + (diff * i) / steps);
        timers.push(setTimeout(() => {
          runOnJS(updateDisplay)(val);
        }, stepDur * i));
      }
      timers.push(setTimeout(() => {
        runOnJS(updateDisplay)(amount);
      }, stepDur * steps + 50));
    } else {
      setDisplayNum(amount);
    }
    prevAmount.current = amount;
    return () => { timers.forEach(clearTimeout); };
  }, [amount]);

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0, 0.8], [0.8, 1.4]) }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  return (
    <View style={[styles.wrapper, style]}>
      {showParticles && (
        <View style={styles.particleContainer} pointerEvents="none">
          {particles.map((p) => (
            <GoldParticleView key={p.id} particle={p} trigger={particleTrigger} />
          ))}
        </View>
      )}

      <Animated.View style={[styles.glowRing, glowStyle]} pointerEvents="none" />

      <Animated.View style={[styles.badgeRow, badgeAnimStyle]}>
        <Animated.View style={sparkleStyle}>
          <Icon name="sparkles" size={16} color={colors.reward.gold} />
        </Animated.View>
        <LinearGradient
          colors={[colors.reward.gold, colors.reward.amber]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <Text variant="label" style={styles.text}>
            {displayNum}
          </Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badge: {
    borderRadius: spacing.radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.text.primary,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glowRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
  },
});
