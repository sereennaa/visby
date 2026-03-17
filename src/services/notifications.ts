/**
 * Context-aware local notifications.
 * Schedules up to 2 per day: one at user's reminder time (context-aware copy), one at 10AM (soft "Visby misses you").
 * Respects settings.notifications; on web we avoid loading expo-notifications.
 */
import { Platform } from 'react-native';

const REMINDER_ID = 'visby-reminder';
const MORNING_ID = 'visby-morning';

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

export interface NotificationContext {
  streakDays?: number;
  visbyMood?: string;
  dueFlashcards?: number;
  nextChapterTitle?: string;
  activeEventName?: string;
  activeEventEndDate?: string;
  /** User's chosen reminder time 'HH:mm', default '19:00' */
  reminderTime?: string;
  /** If false, cancels all notifications */
  notificationsEnabled?: boolean;
}

const MOODS_NEEDING_ATTENTION = ['hungry', 'lonely', 'sick'];

function getReminderMessage(ctx: NotificationContext): string {
  if ((ctx.streakDays ?? 0) > 0) {
    return `Your ${ctx.streakDays}-day streak is on the line! Quick check-in?`;
  }
  if (ctx.visbyMood && MOODS_NEEDING_ATTENTION.includes(ctx.visbyMood)) {
    return `Visby is feeling ${ctx.visbyMood}... come say hi!`;
  }
  if ((ctx.dueFlashcards ?? 0) > 0) {
    return `You have ${ctx.dueFlashcards} flashcards ready to review`;
  }
  if (ctx.nextChapterTitle) {
    return `You're close to unlocking '${ctx.nextChapterTitle}'!`;
  }
  if (ctx.activeEventName) {
    return `${ctx.activeEventName} is happening — bonus Aura!`;
  }
  return 'Visby misses you! Come explore the world together';
}

function getMorningMessage(): string {
  return 'Visby misses you! Come explore the world together';
}

function parseReminderTime(reminderTime: string): { hour: number; minute: number } {
  const match = reminderTime.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour: 19, minute: 0 };
  const hour = Math.min(23, Math.max(0, parseInt(match[1], 10)));
  const minute = Math.min(59, Math.max(0, parseInt(match[2], 10)));
  return { hour, minute };
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

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** @deprecated Use cancelAllNotifications */
export const cancelAllScheduled = cancelAllNotifications;

export async function setupNotifications(context: NotificationContext): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return;
  if (context.notificationsEnabled === false) {
    await cancelAllNotifications();
    return;
  }
  const granted = await requestNotificationPermission();
  if (!granted) return;

  const reminderTime = context.reminderTime ?? '19:00';
  const { hour: reminderHour, minute: reminderMinute } = parseReminderTime(reminderTime);
  const isSameAsMorning = reminderHour === 10 && reminderMinute === 0;

  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  await Notifications.cancelScheduledNotificationAsync(MORNING_ID);

  const reminderBody = getReminderMessage(context);
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: 'Visby',
      body: reminderBody,
      sound: true,
    },
    trigger: {
      hour: reminderHour,
      minute: reminderMinute,
      repeats: true,
    },
  });

  if (!isSameAsMorning) {
    await Notifications.scheduleNotificationAsync({
      identifier: MORNING_ID,
      content: {
        title: 'Visby',
        body: getMorningMessage(),
        sound: true,
      },
      trigger: {
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });
  }
}
