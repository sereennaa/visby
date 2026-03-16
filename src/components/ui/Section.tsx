import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Heading, Caption, Text } from './Text';
import { Icon, IconName } from './Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface SectionProps {
  /** Section title (e.g. Heading level 2) */
  title: string;
  /** Optional icon left of title */
  icon?: IconName;
  /** Optional "See all" or similar action label */
  actionLabel?: string;
  /** Called when action is pressed */
  onAction?: () => void;
  /** Optional caption below title */
  caption?: string;
  /** Content below the header */
  children: React.ReactNode;
  /** Outer container style */
  style?: ViewStyle;
  /** If true, use compact top margin (e.g. when section is not first) */
  compact?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  icon,
  actionLabel,
  onAction,
  caption,
  children,
  style,
  compact = false,
}) => {
  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact, style]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon != null && (
            <View style={styles.iconWrap}>
              <Icon name={icon} size={spacing.icon.sm} color={colors.primary.wisteriaDark} />
            </View>
          )}
          <Heading level={2} style={styles.title}>
            {title}
          </Heading>
          {actionLabel != null && onAction != null && (
            <TouchableOpacity
              onPress={onAction}
              style={styles.action}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
            >
              <Text variant="body" color={colors.primary.wisteriaDark}>
                {actionLabel}
              </Text>
              <Icon name="chevronRight" size={spacing.icon.xs} color={colors.primary.wisteriaDark} />
            </TouchableOpacity>
          )}
        </View>
        {caption != null && (
          <Caption color={colors.text.muted} style={styles.caption}>
            {caption}
          </Caption>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.sectionGap,
  },
  wrapperCompact: {
    marginTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  iconWrap: {
    marginRight: spacing.xxs,
  },
  title: {
    flex: 1,
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  caption: {
    marginTop: spacing.xxs,
  },
});
