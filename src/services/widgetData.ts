/**
 * Widget data service: builds a payload from app state and writes it for
 * home/lock screen widgets to read (via native bridge or AsyncStorage).
 */

import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetPayload, WidgetNeeds } from '../types/widget';
import type { VisbyMood, VisbyNeeds, VisbyGrowthStage } from '../types';

const WIDGET_STORAGE_KEY = '@visby/widget_data';

/** Native module name for writing widget data (iOS App Group / Android SharedPreferences) */
const WidgetBridge = NativeModules.WidgetBridge;

const DEFAULT_NEEDS: WidgetNeeds = {
  hunger: 80,
  happiness: 80,
  energy: 80,
  knowledge: 50,
  socialBattery: 80,
};

function needsFromVisby(needs: VisbyNeeds | null | undefined): WidgetNeeds {
  if (!needs) return DEFAULT_NEEDS;
  return {
    hunger: needs.hunger ?? DEFAULT_NEEDS.hunger,
    happiness: needs.happiness ?? DEFAULT_NEEDS.happiness,
    energy: needs.energy ?? DEFAULT_NEEDS.energy,
    knowledge: needs.knowledge ?? DEFAULT_NEEDS.knowledge,
    socialBattery: needs.socialBattery ?? DEFAULT_NEEDS.socialBattery,
  };
}

export interface WidgetDataInput {
  visbyName: string;
  mood: VisbyMood;
  needs: VisbyNeeds | null | undefined;
  growthStage: VisbyGrowthStage;
  dailyMission: {
    label: string;
    completed: boolean;
    progress: number;
    target: number;
  } | null;
  adventure: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    completed: boolean;
    rewardAura: number;
  };
}

/**
 * Build the payload and a short alert line for the lock screen / badge.
 */
export function buildWidgetPayload(input: WidgetDataInput): WidgetPayload {
  const alertParts: string[] = [];
  if (input.dailyMission && !input.dailyMission.completed) {
    alertParts.push('Daily mission');
  }
  if (!input.adventure.completed) {
    if (input.adventure.step1 || input.adventure.step2 || input.adventure.step3) {
      alertParts.push('Adventure in progress');
    } else {
      alertParts.push('Adventure waiting');
    }
  }
  const alertLine =
    alertParts.length > 0 ? alertParts.join(' · ') : null;

  return {
    visbyName: input.visbyName,
    mood: input.mood,
    needs: needsFromVisby(input.needs),
    growthStage: input.growthStage,
    dailyMission: input.dailyMission
      ? {
          label: input.dailyMission.label,
          completed: input.dailyMission.completed,
          progress: input.dailyMission.progress,
          target: input.dailyMission.target,
        }
      : null,
    adventure: {
      step1: input.adventure.step1,
      step2: input.adventure.step2,
      step3: input.adventure.step3,
      completed: input.adventure.completed,
      rewardAura: input.adventure.rewardAura,
    },
    alertLine,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Write payload to AsyncStorage and to native widget bridge if available.
 * Call this whenever visby, daily mission, or adventure state changes.
 */
export async function writeWidgetData(payload: WidgetPayload): Promise<void> {
  const json = JSON.stringify(payload);
  try {
    await AsyncStorage.setItem(WIDGET_STORAGE_KEY, json);
  } catch {
    // ignore
  }
  if (WidgetBridge && typeof WidgetBridge.setWidgetData === 'function') {
    try {
      WidgetBridge.setWidgetData(json);
    } catch {
      // native module not linked yet
    }
  }
}

/**
 * Read last written widget data (e.g. for debugging or widget preview).
 */
export async function readWidgetData(): Promise<WidgetPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WidgetPayload) : null;
  } catch {
    return null;
  }
}
