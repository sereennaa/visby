import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
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
  FadeIn,
  ZoomIn,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { VisbyMini } from '../avatar/VisbyMini';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CONFETTI_COLORS = ['#FFD700', '#FF69B4', '#40E0D0', '#FF6347', '#9B59B6', '#87CEEB', '#50C878', '#FF8C00', '#7B68EE', '#B8A5E0'];

interface PinCompleteCelebrationProps {
  pinName: string;
  totalAura: number;
  stopCount: number;
  onDismiss: () => void;
}

export const PinCompleteCelebration: React.FC<PinCompleteCelebrationProps> = ({
  pinName,
  totalAura,
  stopCount,
  onDismiss,
}) => {
  const bgOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const detailsOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const confettiProgress = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    hapticService.press();

    bgOpacity.value = withTiming(1, { duration: 400 });
    iconScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 140, mass: 0.8 }));
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    detailsOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));

    confettiProgress.value = withDelay(200, withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }));

    shimmer.value = withDelay(600, withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    ));

    const timer = setTimeout(() => {
      hapticService.tap();
    }, 300);

    return () => {
      clearTimeout(timer);
      cancelAnimation(bgOpacity);
      cancelAnimation(iconScale);
      cancelAnimation(shimmer);
      cancelAnimation(confettiProgress);
    };
  }, []);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const detailsStyle = useAnimatedStyle(() => ({ opacity: detailsOpacity.value }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.6, 1]),
  }));

  const confetti = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    startX: Math.random() * SCREEN_W,
    delay: Math.random() * 600,
    size: 4 + Math.random() * 6,
    drift: -30 + Math.random() * 60,
    spin: Math.random() * 360,
  }));

  return (
    <Animated.View style={[styles.overlay, bgStyle]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />
      <LinearGradient
        colors={['rgba(35, 20, 50, 0.94)', 'rgba(20, 12, 35, 0.97)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Confetti */}
      {confetti.map((c) => (
        <ConfettiPiece key={c.id} piece={c} progress={confettiProgress} />
      ))}

      {/* Central glow */}
      <Animated.View style={[styles.glow, shimmerStyle]} />

      <View style={styles.content}>
        {/* Icon + Visby */}
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <LinearGradient
            colors={[colors.reward.gold, colors.reward.amber]}
            style={styles.iconCircle}
          >
            <View style={styles.checkBg}>
              <Icon name="check" size={36} color="#FFF" />
            </View>
          </LinearGradient>
          <View style={styles.visbyBubble}>
            <VisbyMini size={32} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={titleStyle}>
          <Heading level={2} style={styles.title}>Pin Explored!</Heading>
          <Heading level={3} style={styles.pinName}>{pinName}</Heading>
        </Animated.View>

        {/* Details */}
        <Animated.View style={[styles.details, detailsStyle]}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Icon name="compass" size={20} color={colors.reward.gold} />
              <Text style={styles.statValue}>{stopCount}</Text>
              <Text style={styles.statLabel}>stop{stopCount !== 1 ? 's' : ''} explored</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text style={styles.statValue}>+{totalAura}</Text>
              <Text style={styles.statLabel}>Aura earned</Text>
            </View>
          </View>
        </Animated.View>

        {/* Button */}
        <Animated.View style={buttonStyle}>
          <TouchableOpacity onPress={onDismiss} activeOpacity={0.85}>
            <LinearGradient
              colors={[colors.primary.wisteria, colors.primary.wisteriaDark]}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="map" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Back to Map</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const ConfettiPiece: React.FC<{
  piece: { startX: number; delay: number; size: number; color: string; drift: number; spin: number };
  progress: SharedValue<number>;
}> = ({ piece, progress }) => {
  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(p, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
      transform: [
        { translateY: interpolate(p, [0, 1], [-40, SCREEN_H * 0.7]) },
        { translateX: piece.drift * p },
        { rotate: `${piece.spin + p * 720}deg` },
        { scale: interpolate(p, [0, 0.2, 1], [0, 1, 0.6]) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: piece.startX,
          top: -20,
          width: piece.size,
          height: piece.size * 0.6,
          borderRadius: 2,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.reward.gold,
    opacity: 0.08,
    ...Platform.select({
      web: { boxShadow: '0 0 120px rgba(255,215,0,0.3)' },
      default: {
        shadowColor: colors.reward.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 60,
      },
    }),
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  iconWrap: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 20px rgba(255,215,0,0.4)' },
      default: {
        shadowColor: colors.reward.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
  },
  checkBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visbyBubble: {
    position: 'absolute',
    bottom: -8,
    right: -12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.base.cream,
    borderWidth: 2,
    borderColor: colors.reward.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.reward.gold,
    textAlign: 'center',
    marginBottom: 4,
  },
  pinName: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  details: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statValue: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 24,
    color: '#FFF',
  },
  statLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#FFF',
  },
});

export default PinCompleteCelebration;
