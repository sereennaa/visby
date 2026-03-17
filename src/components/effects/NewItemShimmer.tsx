import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

interface NewItemShimmerProps {
  children: React.ReactNode;
  isNew: boolean;
  style?: ViewStyle;
  /** Number of shimmer loops before fading. Default 3. */
  loops?: number;
}

export const NewItemShimmer: React.FC<NewItemShimmerProps> = ({
  children,
  isNew,
  style,
  loops = 3,
}) => {
  const shimmer = useSharedValue(0);
  const borderGlow = useSharedValue(0);

  useEffect(() => {
    if (!isNew) return;

    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      loops,
      false,
    );

    borderGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
        withTiming(0.2, { duration: 800, easing: Easing.in(Easing.cubic) }),
      ),
      loops,
      true,
    );

    return () => {
      cancelAnimation(shimmer);
      cancelAnimation(borderGlow);
    };
  }, [isNew]);

  const shimmerOverlayStyle = useAnimatedStyle(() => {
    if (!isNew) return { opacity: 0 };
    return {
      opacity: interpolate(shimmer.value, [0, 0.4, 0.6, 1], [0, 0.35, 0.35, 0]),
      transform: [
        { translateX: interpolate(shimmer.value, [0, 1], [-100, 200]) },
        { skewX: '-20deg' },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    if (!isNew) return {};
    return {
      shadowColor: colors.reward.gold,
      shadowOpacity: interpolate(borderGlow.value, [0, 1], [0, 0.25]),
      shadowRadius: interpolate(borderGlow.value, [0, 1], [0, 8]),
      shadowOffset: { width: 0, height: 0 },
    };
  });

  if (!isNew) {
    return (
      <Animated.View style={style}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[style, glowStyle]}>
      {children}
      <Animated.View style={[styles.shimmerOverlay, shimmerOverlayStyle]} pointerEvents="none">
        <LinearGradient
          colors={['transparent', colors.reward.goldSoft, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 12,
  },
  shimmerGradient: {
    width: 60,
    height: '100%',
  },
});
