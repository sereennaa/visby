/**
 * Privacy-first analytics service.
 * Tracks anonymous events locally, batches uploads when backend is configured.
 * COPPA-compliant: no PII, no device IDs, no location in events.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { AnalyticsEvent } from '../types';

const STORAGE_KEY = 'visby_analytics_queue';
const BATCH_SIZE = 25;
const FLUSH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let eventQueue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

export const analyticsService = {
  /** Track an event (queued locally, flushed periodically) */
  track(name: string, properties?: Record<string, string | number | boolean>): void {
    const event: AnalyticsEvent = {
      name,
      properties: properties || {},
      timestamp: new Date().toISOString(),
    };
    eventQueue.push(event);

    if (eventQueue.length >= BATCH_SIZE) {
      this.flush();
    }
  },

  // ─── COMMON EVENT HELPERS ───

  trackScreenView(screenName: string): void {
    this.track('screen_view', { screen: screenName });
  },

  trackGameStart(gameType: string, countryId?: string): void {
    this.track('game_start', { game_type: gameType, ...(countryId ? { country_id: countryId } : {}) });
  },

  trackGameComplete(gameType: string, score: number, perfect: boolean): void {
    this.track('game_complete', { game_type: gameType, score, perfect });
  },

  trackLessonComplete(lessonId: string, category: string): void {
    this.track('lesson_complete', { lesson_id: lessonId, category });
  },

  trackStampCollected(stampType: string, isFastTravel: boolean): void {
    this.track('stamp_collected', { stamp_type: stampType, fast_travel: isFastTravel });
  },

  trackBiteAdded(cuisine: string): void {
    this.track('bite_added', { cuisine });
  },

  trackCountryVisited(countryId: string): void {
    this.track('country_visited', { country_id: countryId });
  },

  trackChatMessage(): void {
    this.track('visby_chat');
  },

  trackBadgeEarned(badgeId: string): void {
    this.track('badge_earned', { badge_id: badgeId });
  },

  trackOnboardingStep(step: number): void {
    this.track('onboarding_step', { step });
  },

  trackRetention(day: number, streak: number): void {
    this.track('retention_check', { day, streak });
  },

  trackSessionLength(durationSeconds: number): void {
    this.track('session_length', { duration_seconds: durationSeconds });
  },

  trackEventParticipation(eventId: string): void {
    this.track('event_participation', { event_id: eventId });
  },

  trackPurchase(productId: string, amount: number): void {
    this.track('purchase', { product_id: productId, amount });
  },

  // ─── FLUSH / PERSISTENCE ───

  async flush(): Promise<void> {
    if (eventQueue.length === 0) return;

    const batch = [...eventQueue];
    eventQueue = [];

    if (isSupabaseConfigured) {
      try {
        await supabase.from('analytics_events').insert(
          batch.map((e) => ({
            event_name: e.name,
            properties: e.properties,
            created_at: e.timestamp,
          })),
        );
        return;
      } catch {
        // Fall through to local storage
      }
    }

    // Store locally if remote fails
    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      const stored: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
      const combined = [...stored, ...batch].slice(-500); // cap at 500
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    } catch {
      // silently fail
    }
  },

  /** Start periodic flush (call on app mount) */
  startPeriodicFlush(): void {
    if (flushTimer) return;
    flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
  },

  /** Stop periodic flush (call on app unmount) */
  stopPeriodicFlush(): void {
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
  },

  /** Try to flush stored events from previous sessions */
  async retryStoredEvents(): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const events: AnalyticsEvent[] = JSON.parse(stored);
      if (events.length === 0) return;

      await supabase.from('analytics_events').insert(
        events.map((e) => ({
          event_name: e.name,
          properties: e.properties,
          created_at: e.timestamp,
        })),
      );
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // silently fail
    }
  },

  /** Get local event count (for debugging) */
  getQueueSize(): number {
    return eventQueue.length;
  },
};
