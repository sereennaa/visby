import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface SkeletonCardProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = 160,
  height = 200,
  style,
}) => (
  <View style={[styles.card, { width, height }, style]}>
    <View style={styles.placeholder} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface.cardWarm,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.base.parchment,
    opacity: 0.6,
  },
});
