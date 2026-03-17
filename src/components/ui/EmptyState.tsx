import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Text, Heading } from './Text';
import { Button } from './Button';
import { IconBadge, IconName } from './Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  ctaLabel,
  onCta,
  style,
}) => {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 600, easing: Easing.in(Easing.bounce) }),
      ),
      -1,
      false,
    );
    return () => { cancelAnimation(bounce); };
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={bounceStyle}>
        <IconBadge
          name={icon}
          size={40}
          color={colors.primary.wisteriaDark}
          backgroundColor={colors.primary.wisteriaFaded}
          padding={spacing.md}
        />
      </Animated.View>
      <Heading level={2} style={styles.title}>{title}</Heading>
      <Text variant="body" color={colors.text.muted} style={styles.message}>
        {message}
      </Text>
      {ctaLabel && onCta && (
        <Button
          title={ctaLabel}
          onPress={onCta}
          variant="primary"
          style={styles.cta}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
  cta: {
    marginTop: spacing.md,
  },
});
