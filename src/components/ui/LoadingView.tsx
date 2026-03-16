import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface LoadingViewProps {
  /** Optional message; default "Loading..." */
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Loading…',
}) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary.wisteriaDark} />
    <Text variant="body" color={colors.text.muted} style={styles.message}>
      {message}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  message: {
    textAlign: 'center',
  },
});
