/**
 * Subscribes to store and pushes Visby + mission + adventure state to widget data
 * (AsyncStorage + native bridge) so home/lock screen widgets can display it.
 * Uses a single useStore selector so hook order is always stable.
 */

import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore, getGrowthStage } from '../store/useStore';
import { buildWidgetPayload, writeWidgetData } from '../services/widgetData';
import { getDueCount } from '../services/spacedRepetition';

export function useWidgetSync(): void {
  const slice = useStore(
    useShallow((s) => ({
    visby: s.visby,
    user: s.user,
    flashcardSRData: s.flashcardSRData,
    dailyMission: s.dailyMission,
    dailyMissionDateKey: s.dailyMissionDateKey,
    dailyMissionCompletedAt: s.dailyMissionCompletedAt,
    dailyMissionProgress: s.dailyMissionProgress,
    getDailyMission: s.getDailyMission,
    getAdventureOfTheDay: s.getAdventureOfTheDay,
    adventureDateKey: s.adventureDateKey,
    adventureVisitDone: s.adventureVisitDone,
    adventureFactsCount: s.adventureFactsCount,
    adventureGameDone: s.adventureGameDone,
    adventureCompletedAt: s.adventureCompletedAt,
  }))
  );
  const prevJson = useRef<string>('');

  useEffect(() => {
    const mission = slice.getDailyMission();
    const adventure = slice.getAdventureOfTheDay();
    const growthStage = getGrowthStage(slice.user?.totalCarePoints ?? 0);

    const payload = buildWidgetPayload({
      visbyName: slice.visby?.name ?? 'Visby',
      mood: slice.visby?.currentMood ?? 'happy',
      needs: slice.visby?.needs ?? null,
      growthStage,
      dailyMission: mission
        ? {
            label: mission.label,
            completed: !!slice.dailyMissionCompletedAt,
            progress: slice.dailyMissionProgress,
            target: mission.target,
          }
        : null,
      adventure: {
        step1: adventure.step1,
        step2: adventure.step2,
        step3: adventure.step3,
        completed: adventure.completed,
        rewardAura: adventure.rewardAura,
      },
      streakDays: slice.user?.currentStreak ?? 0,
      dueFlashcardsCount: getDueCount(slice.flashcardSRData ?? []),
    });

    const json = JSON.stringify(payload);
    if (json === prevJson.current) return;
    prevJson.current = json;

    writeWidgetData(payload).catch(() => {});
  }, [
    slice.visby?.name,
    slice.visby?.currentMood,
    slice.visby?.needs,
    slice.user?.totalCarePoints,
    slice.user?.currentStreak,
    slice.flashcardSRData,
    slice.dailyMission?.label,
    slice.dailyMission?.target,
    slice.dailyMissionDateKey,
    slice.dailyMissionCompletedAt,
    slice.dailyMissionProgress,
    slice.getDailyMission,
    slice.getAdventureOfTheDay,
    slice.adventureDateKey,
    slice.adventureVisitDone,
    slice.adventureFactsCount,
    slice.adventureGameDone,
    slice.adventureCompletedAt,
  ]);
}
