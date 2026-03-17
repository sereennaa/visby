import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Text } from './Text';
import { Icon } from './Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const LOADING_MESSAGES = [
  'Packing the bags...',
  'Drawing the map...',
  'Brushing Visby\u2019s hair...',
  'Polishing the compass...',
  'Counting the stars...',
  'Warming up the teapot...',
  'Tuning the ukulele...',
  'Feeding the parrot...',
  'Folding paper cranes...',
  'Choosing the perfect hat...',
];

interface VisbyLoaderProps {
  message?: string;
  compact?: boolean;
}

export const VisbyLoader: React.FC<VisbyLoaderProps> = ({ message, compact }) => {
  const bounce = useSharedValue(0);
  const [msgIndex, setMsgIndex] = useState(() => Math.floor(Math.random() * LOADING_MESSAGES.length));

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.bounce) }),
      ),
      -1,
      false,
    );

    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);

    return () => {
      cancelAnimation(bounce);
      clearInterval(interval);
    };
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const displayMessage = message || LOADING_MESSAGES[msgIndex];

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Animated.View style={bounceStyle}>
          <Icon name="compass" size={32} color={colors.primary.wisteriaDark} />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={bounceStyle}>
        <Icon name="compass" size={48} color={colors.primary.wisteriaDark} />
      </Animated.View>
      <Text variant="body" color={colors.text.muted} style={styles.message}>
        {displayMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  compactContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  message: {
    textAlign: 'center',
  },
});
