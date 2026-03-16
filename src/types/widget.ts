/**
 * Payload sent from the app to home/lock screen widgets.
 * Widgets read this from shared storage (App Group on iOS, SharedPreferences on Android).
 */

import type { VisbyMood } from './index';

export interface WidgetNeeds {
  hunger: number;
  happiness: number;
  energy: number;
  knowledge: number;
  socialBattery: number;
}

export interface WidgetPayload {
  /** Visby display name */
  visbyName: string;
  /** Current mood for widget icon/expression */
  mood: VisbyMood;
  /** Needs 0–100 for bar display */
  needs: WidgetNeeds;
  /** Growth stage for optional visual */
  growthStage: 'egg' | 'baby' | 'kid' | 'teen' | 'adult';
  /** Daily mission: label and whether completed */
  dailyMission: {
    label: string;
    completed: boolean;
    progress: number;
    target: number;
  } | null;
  /** Adventure of the day: steps and completed */
  adventure: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    completed: boolean;
    rewardAura: number;
  };
  /** Short alert line for lock screen / badge, e.g. "Daily mission waiting" */
  alertLine: string | null;
  /** ISO timestamp when this payload was written */
  updatedAt: string;
}
