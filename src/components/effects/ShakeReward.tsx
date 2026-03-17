import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Text, Heading } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { hapticService } from '../../services/haptics';

interface ShakeRewardProps {
  aura: number;
  message: string;
  onComplete: () => void;
}

export const ShakeReward: React.FC<ShakeRewardProps> = ({ aura, message, onComplete }) => {
  const { width, height } = useWindowDimensions();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const slideY = useSharedValue(20);
  const coinScale = useSharedValue(0);

  useEffect(() => {
    hapticService.success();

    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1, { damping: 8, stiffness: 150 });
    slideY.value = withSpring(0, { damping: 12 });

    coinScale.value = withDelay(200, withSequence(
      withSpring(1.3, { damping: 6 }),
      withSpring(1, { damping: 10 }),
    ));

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.8, { duration: 300 });
      setTimeout(onComplete, 350);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: slideY.value },
    ],
  }));

  const coinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coinScale.value }],
  }));

  const topOffset = Math.min(height * 0.14, 120);

  return (
    <View style={[styles.overlay, { top: topOffset }]} pointerEvents="none">
      <Animated.View style={[styles.card, { maxWidth: width * 0.8 }, containerStyle]}>
        <Animated.View style={coinStyle}>
          <Icon name="sparkles" size={24} color={colors.reward.gold} />
        </Animated.View>
        <Text variant="body" style={styles.message}>{message}</Text>
        {aura > 0 && (
          <Text variant="h3" style={styles.aura}>+{aura} Aura</Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    backgroundColor: 'rgba(45, 35, 60, 0.95)',
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.reward.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    color: colors.overlay.whiteSoft,
    textAlign: 'center',
  },
  aura: {
    color: colors.reward.gold,
  },
});
