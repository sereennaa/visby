import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Heading, Caption } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { copy } from '../../config/copy';

export interface ErrorStateProps {
  /** Optional custom title; defaults to copy.errors.loadFailed */
  title?: string;
  /** Optional custom subtitle */
  subtitle?: string;
  /** Label for retry button; defaults to copy.actions.tryAgain */
  retryLabel?: string;
  /** Called when user taps Try again */
  onRetry: () => void;
  /** Container style */
  style?: ViewStyle;
  /** Accessibility label for the error state */
  accessibilityLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = copy.errors.loadFailed,
  subtitle,
  retryLabel = copy.actions.tryAgain,
  onRetry,
  style,
  accessibilityLabel,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="none"
    >
      <View style={styles.iconWrap}>
        <Icon name="warning" size={spacing.icon.xxl} color={colors.status.error} />
      </View>
      <Heading level={3} align="center" style={styles.title}>
        {title}
      </Heading>
      {subtitle != null && (
        <Caption align="center" color={colors.text.muted} style={styles.subtitle}>
          {subtitle}
        </Caption>
      )}
      <Button
        title={retryLabel}
        onPress={onRetry}
        variant="primary"
        size="md"
        style={styles.button}
        accessibilityLabel={retryLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconWrap: {
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {},
});
