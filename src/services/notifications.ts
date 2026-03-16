/**
 * Local notifications: streak reminder and "Visby misses you".
 * Respects settings.notifications; schedules/cancels when settings or app state change.
 * On web we avoid loading expo-notifications so the push token listener is never registered.
 */
import { Platform } from 'react-native';

const STREAK_REMINDER_ID = 'visby-streak-reminder';
const VISBY_MISSES_ID = 'visby-misses-you';

const Notifications = Platform.OS === 'web' ? null : require('expo-notifications');

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (!Notifications) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Visby',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelAllScheduled(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleStreakReminder(streakDays: number): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID);
  const body = streakDays > 0
    ? `Don't lose your ${streakDays}-day streak! Check in with Visby today.`
    : 'Check in with Visby today and start a streak!';
  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_REMINDER_ID,
    content: {
      title: 'Visby',
      body,
      sound: true,
    },
    trigger: {
      hour: 19,
      minute: 0,
      repeats: true,
    },
  });
}

export async function scheduleVisbyMissesYou(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(VISBY_MISSES_ID);
  await Notifications.scheduleNotificationAsync({
    identifier: VISBY_MISSES_ID,
    content: {
      title: 'Visby misses you!',
      body: 'Come play and explore the world together.',
      sound: true,
    },
    trigger: {
      hour: 10,
      minute: 0,
      repeats: true,
    },
  });
}

export async function setupNotifications(
  enabled: boolean,
  currentStreak: number
): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return;
  if (!enabled) {
    await cancelAllScheduled();
    return;
  }
  const granted = await requestNotificationPermission();
  if (!granted) return;
  await scheduleStreakReminder(currentStreak);
  await scheduleVisbyMissesYou();
}
