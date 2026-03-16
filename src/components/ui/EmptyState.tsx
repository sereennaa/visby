import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, Heading, Caption } from './Text';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface EmptyStateProps {
  /** Icon name from Icon component */
  icon: IconName;
  /** Main heading */
  title: string;
  /** Short explanation */
  subtitle: string;
  /** Primary button label; omit to hide button */
  actionLabel?: string;
  /** Primary button press */
  onAction?: () => void;
  /** Optional secondary action (e.g. "Explore nearby" link) */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Optional custom illustration (overrides icon) */
  illustration?: React.ReactNode;
  /** Container style when used inside a list or card */
  style?: ViewStyle;
  /** Accessibility label for the empty state container */
  accessibilityLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  illustration,
  style,
  accessibilityLabel,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="none"
    >
      {illustration != null ? (
        <View style={styles.iconWrap}>{illustration}</View>
      ) : (
        <View style={styles.iconWrap}>
          <Icon name={icon} size={spacing.icon.xxl} color={colors.primary.wisteria} />
        </View>
      )}
      <Heading level={3} align="center" style={styles.title}>
        {title}
      </Heading>
      <Caption align="center" color={colors.text.muted} style={styles.subtitle}>
        {subtitle}
      </Caption>
      {actionLabel != null && onAction != null && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.primaryButton}
          accessibilityLabel={actionLabel}
        />
      )}
      {secondaryLabel != null && onSecondary != null && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSecondary}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={secondaryLabel}
        >
          <Icon name="map" size={spacing.icon.sm} color={colors.primary.wisteriaDark} />
          <Text variant="body" color={colors.primary.wisteriaDark}>
            {secondaryLabel}
          </Text>
        </TouchableOpacity>
      )}
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
  primaryButton: {
    marginBottom: spacing.md,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
