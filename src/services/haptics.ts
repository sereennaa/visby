import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let _getStore: (() => { settings: { hapticFeedback?: boolean } }) | null = null;

export function setHapticStoreAccessor(accessor: () => { settings: { hapticFeedback?: boolean } }) {
  _getStore = accessor;
}

function isEnabled(): boolean {
  if (Platform.OS === 'web') return false;
  if (!_getStore) return true;
  return _getStore().settings.hapticFeedback !== false;
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
