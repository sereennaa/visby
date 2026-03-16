import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface NavBreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface NavBreadcrumbProps {
  items: NavBreadcrumbItem[];
}

/** Renders "World → France → Paris" style breadcrumb for nested Explore screens */
export const NavBreadcrumb: React.FC<NavBreadcrumbProps> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <View style={styles.wrapper} accessibilityLabel={`Location: ${items.map((i) => i.label).join(', ')}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="chevronRight" size={12} color={colors.text.muted} style={styles.sep} />
          )}
          {item.onPress != null ? (
            <TouchableOpacity
              onPress={item.onPress}
              style={styles.link}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Go to ${item.label}`}
            >
              <Text variant="bodySmall" color={colors.primary.wisteriaDark}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text variant="bodySmall" color={colors.text.secondary}>
              {item.label}
            </Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  sep: {
    marginHorizontal: spacing.xxs,
  },
  link: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xxs,
  },
});
