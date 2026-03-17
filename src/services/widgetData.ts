/**
 * Widget data service: builds a payload from app state and writes it for
 * home/lock screen widgets to read (via native bridge or AsyncStorage).
 */

import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetPayload, WidgetNeeds } from '../types/widget';
import type { VisbyMood, VisbyNeeds, VisbyGrowthStage } from '../types';
import { getDueCount } from './spacedRepetition';

const WIDGET_STORAGE_KEY = '@visby/widget_data';

/** Native module name for writing widget data (iOS App Group / Android SharedPreferences) */
const WidgetBridge = NativeModules.WidgetBridge;

/** Visby expression for widget face (subset of moods) */
const VISBY_EXPRESSIONS = ['happy', 'sad', 'sleepy', 'hungry', 'excited', 'sick', 'lonely'] as const;
type VisbyExpression = (typeof VISBY_EXPRESSIONS)[number];

function moodToExpression(mood: VisbyMood): VisbyExpression {
  const map: Record<string, VisbyExpression> = {
    happy: 'happy',
    excited: 'excited',
    sleepy: 'sleepy',
    hungry: 'hungry',
    sick: 'sick',
    lonely: 'lonely',
    bored: 'sad',
    confused: 'sad',
    curious: 'excited',
    proud: 'happy',
    adventurous: 'excited',
    cozy: 'happy',
  };
  return map[mood] ?? 'happy';
}

/** 30 fun cultural facts for kids — rotates daily by date */
const WIDGET_FACTS = [
  "In Japan, people slurp noodles loudly to show they're delicious!",
  "In France, you might eat snails (escargot) — they're considered a treat!",
  "Mexico invented chocolate — the Aztecs drank it as a spicy drink!",
  "In India, people often eat with their hands — it's a tradition!",
  "Scotland has a monster legend in Loch Ness — have you heard of Nessie?",
  "In Brazil, the Amazon rainforest has more species than anywhere on Earth!",
  "Egypt has pyramids that are over 4,500 years old!",
  "In Italy, pizza was first made in Naples in the 1700s!",
  "China invented paper over 2,000 years ago!",
  "In Australia, kangaroos can hop up to 25 feet in one jump!",
  "Greece is the birthplace of the Olympic Games!",
  "In Kenya, the Maasai people are famous for their jumping dances!",
  "Sweden has a tradition of fika — a cozy coffee and cake break!",
  "In Thailand, there's a festival where people throw water at each other!",
  "Ireland is known for leprechauns and four-leaf clovers!",
  "In Peru, llamas were used to carry goods in the Andes!",
  "Norway has the Northern Lights — magical dancing lights in the sky!",
  "In Morocco, souks are colorful markets full of spices and crafts!",
  "South Korea has a holiday for children's day — kids get the day off!",
  "In Russia, nesting dolls (matryoshka) hide inside each other!",
  "New Zealand was the last place on Earth to be discovered by humans!",
  "In Spain, people take a siesta — a nap after lunch!",
  "Canada has the most lakes of any country in the world!",
  "In Nigeria, jollof rice is a beloved party dish!",
  "Iceland has no mosquitoes — they can't survive there!",
  "In Vietnam, pho soup is eaten for breakfast, lunch, and dinner!",
  "Portugal gave the world explorers like Vasco da Gama!",
  "In Argentina, tango dancing started in the streets of Buenos Aires!",
  "Finland has more saunas than cars!",
  "In Jamaica, reggae music was born from the island's soul!",
];

function getDailyFact(): string {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const index = seed % WIDGET_FACTS.length;
  return WIDGET_FACTS[index];
}

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
  streakDays: number;
  dueFlashcardsCount: number;
}

function getQuickAction(
  needs: WidgetNeeds,
  dueFlashcardsCount: number
): { label: string; deepLink: string } {
  const anyNeedLow = Object.values(needs).some((n) => n < 20);
  if (anyNeedLow) return { label: 'Feed Visby', deepLink: 'visby://addBite' };
  if (dueFlashcardsCount > 0) return { label: 'Review Cards', deepLink: 'visby://flashcards' };
  return { label: 'Explore', deepLink: 'visby://explore' };
}

function getNeedsAlert(needs: WidgetNeeds): string | null {
  if (needs.hunger < 20) return "Visby hasn't eaten in 2 days";
  if (needs.energy < 20) return 'Visby needs to rest!';
  if (needs.socialBattery < 20) return 'Visby feels lonely!';
  if (needs.happiness < 20) return 'Visby needs to play!';
  if (needs.knowledge < 20) return 'Visby wants to learn!';
  return null;
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

  const needs = needsFromVisby(input.needs);
  const quickAction = getQuickAction(needs, input.dueFlashcardsCount);
  const needsAlert = getNeedsAlert(needs);

  return {
    visbyName: input.visbyName,
    mood: input.mood,
    needs,
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
    visbyExpression: moodToExpression(input.mood),
    streakDays: input.streakDays,
    streakFlame: input.streakDays > 0,
    dailyFact: getDailyFact(),
    quickAction,
    needsAlert,
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
