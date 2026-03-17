import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useStore } from '../store/useStore';

function isEnabled(): boolean {
  if (Platform.OS === 'web') return false;
  const settings = useStore.getState().settings as { hapticFeedback?: boolean };
  return settings.hapticFeedback !== false;
}

export const hapticService = {
  tap: () => isEnabled() && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  press: () => isEnabled() && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => isEnabled() && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => isEnabled() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => isEnabled() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  warning: () => isEnabled() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  selection: () => isEnabled() && Haptics.selectionAsync(),
};
