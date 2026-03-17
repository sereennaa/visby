import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn, BounceIn } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { Text, Heading, Caption } from './Text';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { useStore, getGrowthStage } from '../../store/useStore';
import { soundService } from '../../services/sound';
import { hapticService } from '../../services/haptics';
import type { StoryChapter } from '../../config/storyChapters';
import { BADGE_DEFINITIONS, type BadgeDefinition } from '../../config/badges';
import { AchievementCeremony } from '../effects/AchievementCeremony';

const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice Explorer',
  2: 'Curious Wanderer',
  3: 'Path Finder',
  4: 'Trail Blazer',
  5: 'Globe Trotter',
  6: 'World Walker',
  7: 'Culture Seeker',
  8: 'Memory Keeper',
  9: 'Horizon Chaser',
  10: 'Legendary Voyager',
};

const STAGE_INFO: Record<string, { title: string; desc: string; icon: IconName }> = {
  egg: { title: 'A New Egg!', desc: 'Take care of your Visby to hatch it!', icon: 'sparkles' },
  baby: { title: 'Baby Visby!', desc: 'Your egg hatched! Keep caring for your Visby!', icon: 'heart' },
  kid: { title: 'Kid Visby!', desc: 'Your Visby is growing up! Keep exploring!', icon: 'star' },
  teen: { title: 'Teen Visby!', desc: 'Your Visby is getting stronger and smarter!', icon: 'rocket' },
  adult: { title: 'Adult Visby!', desc: 'Your Visby is fully grown! Legendary explorer!', icon: 'trophy' },
};

const STREAK_MILESTONES = [7, 14, 30, 50, 100];
const RARITY_AURA: Record<string, number> = {
  common: 10,
  uncommon: 25,
  rare: 50,
  epic: 100,
  legendary: 200,
};

interface CeremonyItem {
  id: string;
  icon: IconName;
  title: string;
  subtitle?: string;
  auraReward?: number;
}

export const ProgressionOverlay: React.FC = () => {
  const user = useStore(s => s.user);
  const badges = useStore(s => s.badges);
  const getNextChapterToShow = useStore(s => s.getNextChapterToShow);
  const markStoryBeatShown = useStore(s => s.markStoryBeatShown);

  const [chapterToShow, setChapterToShow] = useState<StoryChapter | null>(null);

  const [ceremonyQueue, setCeremonyQueue] = useState<CeremonyItem[]>([]);
  const [activeCeremony, setActiveCeremony] = useState<CeremonyItem | null>(null);

  const lastCelebratedLevelRef = useRef(user?.level || 1);
  const lastStageRef = useRef(getGrowthStage(user?.totalCarePoints || 0));
  const lastBadgeCountRef = useRef(badges.length);
  const lastStreakRef = useRef(user?.currentStreak ?? 0);

  const chapterUnlockKey = useStore((s) =>
    `${s.user?.visitedCountries?.length ?? 0}-${s.bites.length}-${s.stamps.length}-${s.badges.length}-${s.lessonProgress.filter((p) => p.completed).length}-${s.userHouses.length}-${s.user?.currentStreak ?? 0}-${s.storyBeatsShown.length}`
  );

  const enqueueCeremony = useCallback((item: CeremonyItem) => {
    setCeremonyQueue((prev) => [...prev, item]);
  }, []);

  useEffect(() => {
    if (activeCeremony || ceremonyQueue.length === 0) return;
    setCeremonyQueue((prev) => {
      const [next, ...rest] = prev;
      if (next) setActiveCeremony(next);
      return rest;
    });
  }, [ceremonyQueue, activeCeremony]);

  useEffect(() => {
    if (!user) return;

    if (user.level > lastCelebratedLevelRef.current) {
      soundService.playLevelUp();
      hapticService.success();
      enqueueCeremony({
        id: `level_${user.level}`,
        icon: 'star',
        title: 'Level Up!',
        subtitle: LEVEL_TITLES[user.level] || 'Explorer',
        auraReward: 0,
      });
      lastCelebratedLevelRef.current = user.level;
    }

    const currentStage = getGrowthStage(user.totalCarePoints || 0);
    if (currentStage !== lastStageRef.current) {
      const stageInfo = STAGE_INFO[currentStage];
      soundService.playLevelUp();
      hapticService.success();
      enqueueCeremony({
        id: `stage_${currentStage}`,
        icon: stageInfo?.icon || 'sparkles',
        title: stageInfo?.title || 'Evolution!',
        subtitle: stageInfo?.desc || 'Your Visby evolved!',
        auraReward: 50,
      });
      lastStageRef.current = currentStage;
    }
  }, [user?.level, user?.totalCarePoints, enqueueCeremony]);

  useEffect(() => {
    if (badges.length > lastBadgeCountRef.current) {
      const newBadges = badges.slice(lastBadgeCountRef.current);
      for (const badge of newBadges) {
        const def = BADGE_DEFINITIONS.find((b: BadgeDefinition) => b.id === badge.badgeId);
        if (def) {
          soundService.playBadgeEarned();
          enqueueCeremony({
            id: `badge_${badge.badgeId}`,
            icon: def.icon,
            title: `Badge Unlocked!`,
            subtitle: def.name,
            auraReward: RARITY_AURA[def.rarity] || 10,
          });
        }
      }
    }
    lastBadgeCountRef.current = badges.length;
  }, [badges.length, badges, enqueueCeremony]);

  useEffect(() => {
    const currentStreak = user?.currentStreak ?? 0;
    if (currentStreak > lastStreakRef.current) {
      for (const milestone of STREAK_MILESTONES) {
        if (currentStreak >= milestone && lastStreakRef.current < milestone) {
          soundService.playStreakMilestone();
          enqueueCeremony({
            id: `streak_${milestone}`,
            icon: 'flame',
            title: `${milestone}-Day Streak!`,
            subtitle: `You've explored for ${milestone} days straight!`,
          });
        }
      }
    }
    lastStreakRef.current = currentStreak;
  }, [user?.currentStreak, enqueueCeremony]);

  useEffect(() => {
    const next = getNextChapterToShow();
    if (next) {
      setChapterToShow(next);
      soundService.playChapterUnlocked();
      hapticService.success();
    }
  }, [chapterUnlockKey, getNextChapterToShow]);

  const dismissChapter = useCallback(() => {
    if (chapterToShow) {
      markStoryBeatShown(chapterToShow.storyBeatId);
      setChapterToShow(null);
    }
  }, [chapterToShow, markStoryBeatShown]);

  const dismissActiveCeremony = useCallback(() => {
    setActiveCeremony(null);
  }, []);

  return (
    <>
      {/* Chapter unlock modal */}
      <Modal visible={!!chapterToShow} transparent animationType="none">
        <View style={s.overlay}>
          <Animated.View entering={ZoomIn.duration(300).springify()} style={s.card}>
            <LinearGradient colors={[colors.primary.wisteriaLight, colors.primary.wisteriaDark]} style={s.iconCircle}>
              <Icon name="compass" size={48} color={colors.text.inverse} />
            </LinearGradient>
            <Animated.View entering={BounceIn.delay(300)}>
              <Heading level={1} style={s.title}>{chapterToShow?.title}</Heading>
            </Animated.View>
            <Text style={s.desc}>{chapterToShow?.subtitle}</Text>
            <Button title="Let's go!" onPress={dismissChapter} variant="primary" style={s.btn} />
          </Animated.View>
        </View>
      </Modal>

      {/* Queued ceremonies (level-up, stage-up, badges, streaks) */}
      {activeCeremony && (
        <AchievementCeremony
          icon={activeCeremony.icon}
          title={activeCeremony.title}
          subtitle={activeCeremony.subtitle}
          auraReward={activeCeremony.auraReward}
          onDismiss={dismissActiveCeremony}
        />
      )}
    </>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: spacing.radius.xxl,
    maxWidth: 320,
    width: '85%',
    alignItems: 'center',
    padding: 32,
    elevation: 12,
    ...getShadowStyle({ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24 }),
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  desc: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
  btn: {
    marginTop: spacing.xl,
  },
});

export default ProgressionOverlay;
