import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useToastStore, type ToastItem } from '../../store/useToast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { Icon, IconName } from './Icon';

const TOAST_ICONS: Record<ToastItem['type'], IconName> = {
  success: 'checkCircle',
  error: 'close',
  info: 'info',
};

const TOAST_BG: Record<ToastItem['type'], string> = {
  success: colors.success.honeydew,
  error: colors.status.errorLight,
  info: colors.status.infoLight,
};

const TOAST_ICON_COLOR: Record<ToastItem['type'], string> = {
  success: colors.success.emerald,
  error: colors.status.error,
  info: colors.status.info,
};

function SingleToast({ item }: { item: ToastItem }) {
  const dismissToast = useToastStore((s) => s.dismissToast);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const dismiss = () => {
    translateY.value = withTiming(-100, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(dismissToast)(item.id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const iconName = TOAST_ICONS[item.type];
  const bg = TOAST_BG[item.type];
  const iconColor = TOAST_ICON_COLOR[item.type];

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg }, animatedStyle]}>
      <Pressable onPress={dismiss} style={styles.pressable} accessibilityLabel="Dismiss">
        <Icon name={iconName} size={20} color={iconColor} />
        <Text style={[styles.message, { color: colors.text.primary }]} numberOfLines={2}>
          {item.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { pointerEvents: 'box-none' }]}>
      {toasts.map((item) => (
        <SingleToast key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.gutter,
    paddingTop: Platform.OS === 'ios' ? 56 : spacing.lg,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.sm,
    maxWidth: '100%',
    minWidth: 200,
    elevation: 4,
    ...getShadowStyle({ shadowColor: colors.shadow.strong, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8 }),
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  message: {
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
  },
});
