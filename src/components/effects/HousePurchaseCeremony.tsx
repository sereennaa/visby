import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CONFETTI_COLORS = ['#FFD700', '#FF69B4', '#40E0D0', '#9B59B6', '#FF6347', '#50C878', '#87CEEB', '#FF8C00'];
const RIBBON_COUNT = 6;

interface HousePurchaseCeremonyProps {
  countryName: string;
  countryEmoji: string;
  accentColor?: string;
  onDismiss: () => void;
  onNameHouse?: () => void;
}

export const HousePurchaseCeremony: React.FC<HousePurchaseCeremonyProps> = ({
  countryName,
  countryEmoji,
  accentColor = '#4A3870',
  onDismiss,
  onNameHouse,
}) => {
  const bgOpacity = useSharedValue(0);
  const wrapperScale = useSharedValue(0.3);
  const wrapperOpacity = useSharedValue(1);
  const tearProgress = useSharedValue(0);
  const houseScale = useSharedValue(0);
  const houseGlow = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    hapticService.press();

    bgOpacity.value = withTiming(1, { duration: 400 });

    wrapperScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 100 }));

    tearProgress.value = withDelay(1200, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));

    wrapperOpacity.value = withDelay(1500, withTiming(0, { duration: 300 }));

    houseScale.value = withDelay(1500, withSequence(
      withSpring(1.15, { damping: 5, stiffness: 100 }),
      withSpring(1, { damping: 8 }),
    ));

    houseGlow.value = withDelay(1600, withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 }),
      ),
      3,
      true,
    ));

    shimmer.value = withDelay(1800, withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false,
    ));

    titleOpacity.value = withDelay(1800, withTiming(1, { duration: 400 }));
    buttonOpacity.value = withDelay(2200, withTiming(1, { duration: 400 }));

    const timers = [
      setTimeout(() => hapticService.success(), 1600),
      setTimeout(() => hapticService.tap(), 1800),
    ];
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimation(shimmer);
      cancelAnimation(houseGlow);
    };
  }, []);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wrapperScale.value }],
    opacity: wrapperOpacity.value,
  }));

  const tearLeftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tearProgress.value, [0, 1], [0, -60]) },
      { rotate: `${interpolate(tearProgress.value, [0, 1], [0, -15])}deg` },
    ],
    opacity: interpolate(tearProgress.value, [0, 0.8, 1], [1, 0.5, 0]),
  }));

  const tearRightStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tearProgress.value, [0, 1], [0, 60]) },
      { rotate: `${interpolate(tearProgress.value, [0, 1], [0, 15])}deg` },
    ],
    opacity: interpolate(tearProgress.value, [0, 0.8, 1], [1, 0.5, 0]),
  }));

  const houseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: houseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: houseGlow.value * 0.3,
    transform: [{ scale: interpolate(houseGlow.value, [0.4, 1], [1, 1.6]) }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: interpolate(titleOpacity.value, [0, 1], [20, 0]) }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonOpacity.value }],
  }));

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <LinearGradient
        colors={['rgba(35, 28, 50, 0.96)', accentColor + 'CC', 'rgba(20, 15, 35, 0.98)']}
        style={styles.gradient}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <HouseConfetti key={i} index={i} />
        ))}

        <Animated.View style={[styles.glow, glowStyle]} />

        {/* Wrapped gift (tears apart) */}
        <View style={styles.giftArea}>
          <Animated.View style={[styles.tearHalf, styles.tearLeft, tearLeftStyle]}>
            {Array.from({ length: RIBBON_COUNT }, (_, i) => (
              <View key={i} style={[styles.ribbon, { top: 10 + i * 15, backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }]} />
            ))}
          </Animated.View>
          <Animated.View style={[styles.tearHalf, styles.tearRight, tearRightStyle]}>
            {Array.from({ length: RIBBON_COUNT }, (_, i) => (
              <View key={i} style={[styles.ribbon, { top: 10 + i * 15, backgroundColor: CONFETTI_COLORS[(i + 3) % CONFETTI_COLORS.length] }]} />
            ))}
          </Animated.View>
        </View>

        {/* Wrapper (scales in then fades) */}
        <Animated.View style={[styles.wrapperBox, wrapperStyle]}>
          <Icon name="gift" size={48} color={colors.reward.peachDark} />
        </Animated.View>

        {/* Revealed house */}
        <Animated.View style={[styles.houseReveal, houseStyle]}>
          <Text style={styles.houseEmoji}>{countryEmoji}</Text>
          <Icon name="home" size={36} color={colors.primary.wisteriaDark} />
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Heading level={1} style={styles.title}>New Home!</Heading>
          <Text variant="body" style={styles.subtitle}>
            Your house in {countryName} is ready
          </Text>
        </Animated.View>

        <Animated.View style={buttonStyle}>
          <TouchableOpacity
            style={styles.nameButton}
            onPress={onNameHouse || onDismiss}
            activeOpacity={0.8}
          >
            <Text variant="label" style={styles.nameButtonText}>Name Your House</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDismiss} style={styles.skipButton}>
            <Text variant="caption" style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const HouseConfetti: React.FC<{ index: number }> = ({ index }) => {
  const translateY = useSharedValue(-10);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  const randoms = useMemo(() => ({
    startX: Math.random() * SCREEN_W,
    fallDuration: 2000 + Math.random() * 1000,
    driftX: (Math.random() - 0.5) * 100,
    rotDir: Math.random() > 0.5 ? 1 : -1,
  }), []);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const isGold = index % 4 === 0;

  useEffect(() => {
    const delay = 1500 + index * 35;
    opacity.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 150 }),
      withDelay(1800, withTiming(0, { duration: 400 })),
    ));
    translateY.value = withDelay(delay, withTiming(SCREEN_H * 0.8, {
      duration: randoms.fallDuration,
      easing: Easing.out(Easing.quad),
    }));
    translateX.value = withDelay(delay, withTiming(randoms.driftX, {
      duration: 2000,
    }));
    rotation.value = withDelay(delay, withTiming(360 * randoms.rotDir, {
      duration: 2000,
    }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: randoms.startX,
    top: -10,
    width: isGold ? 8 : 6,
    height: isGold ? 8 : 4,
    borderRadius: isGold ? 4 : 1,
    backgroundColor: isGold ? '#FFD700' : color,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  giftArea: {
    position: 'absolute',
    width: 140,
    height: 100,
    flexDirection: 'row',
  },
  tearHalf: {
    width: 70,
    height: 100,
    overflow: 'hidden',
  },
  tearLeft: { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
  tearRight: { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  ribbon: {
    position: 'absolute',
    left: 5,
    right: 5,
    height: 3,
    borderRadius: 1.5,
  },
  wrapperBox: {
    width: 100,
    height: 100,
    borderRadius: spacing.radius.lg,
    backgroundColor: 'rgba(255, 200, 100, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.radius.lg,
  },
  giftEmoji: { fontSize: 50 },
  houseReveal: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  houseEmoji: { fontSize: 48 },
  homeIcon: { fontSize: 36, marginTop: -8 },
  title: {
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  nameButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: spacing.xxl,
    paddingVertical: 14,
    borderRadius: spacing.radius.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nameButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontFamily: 'Baloo2-Bold',
  },
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.overlay.whiteMuted,
  },
});
