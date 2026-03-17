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
        <Animated.Text style={[styles.character, styles.compactCharacter, bounceStyle]}>
          {'🧭'}
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.character, bounceStyle]}>
        {'🧭'}
      </Animated.Text>
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
  character: {
    fontSize: 48,
  },
  compactCharacter: {
    fontSize: 32,
  },
  message: {
    textAlign: 'center',
  },
});
