import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { AuraBadge } from '../../components/ui/Badge';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCheckInModal } from '../../components/visby/VisbyCheckInModal';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { HouseExterior } from '../../components/house/HouseExterior';
import { PulseGlow } from '../../components/effects/Shimmer';
import { useStore } from '../../store/useStore';
import { LEVEL_THRESHOLDS, COUNTRIES } from '../../config/constants';
import { RootStackParamList, VisbyNeeds, VisbyGrowthStage } from '../../types';
import { DEFAULT_HOME_ROOM, HOME_ATMOSPHERE } from '../../config/homeRoom';
import { getCountryAtmosphere } from '../../config/countryAtmosphere';
import { COUNTRY_HOUSES } from '../../config/countryRooms';
import { HomeRoom } from '../../components/home/HomeRoom';
import { WeeklyRecapModal } from '../../components/home/WeeklyRecapModal';
import { getActiveEvent, getActiveSeasonalVisuals, getCurrentWeeklyChallenge } from '../../config/seasonalEvents';
import { getPhraseOfTheDay } from '../../config/learningContent';
import { speechService } from '../../services/audio';
import { analyticsService } from '../../services/analytics';
import { getUnlockableNodes } from '../../config/learningPaths';
import { getDueCount } from '../../services/spacedRepetition';
import { STORY_CHAPTERS, getChapterUnlockCurrent } from '../../config/storyChapters';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { DailyGreetingOverlay } from '../../components/home/DailyGreetingOverlay';
import { Tooltip } from '../../components/ui/Tooltip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STAGE_LABELS: Record<VisbyGrowthStage, string> = {
  egg: 'Egg',
  baby: 'Baby',
  kid: 'Kid',
  teen: 'Teen',
  adult: 'Adult',
};

const MOOD_LABELS: Record<string, { label: string; icon: IconName }> = {
  happy: { label: 'Happy', icon: 'heart' },
  excited: { label: 'Excited', icon: 'star' },
  curious: { label: 'Curious', icon: 'compass' },
  sleepy: { label: 'Sleepy', icon: 'star' },
  proud: { label: 'Proud', icon: 'trophy' },
  adventurous: { label: 'Adventurous', icon: 'rocket' },
  cozy: { label: 'Cozy', icon: 'home' },
  hungry: { label: 'Hungry', icon: 'food' },
  bored: { label: 'Bored', icon: 'time' },
  confused: { label: 'Confused', icon: 'quiz' },
  sick: { label: 'Sick', icon: 'flash' },
  lonely: { label: 'Lonely', icon: 'chat' },
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

/* ─── Need config for Care Hint modal (opened from mood bubble when low) ─── */
const NEED_CONFIG: { key: keyof Omit<VisbyNeeds, 'lastUpdated'>; icon: IconName; label: string; color: string; bgColor: string; hint: string; howTo: string }[] = [
  { key: 'hunger', icon: 'food', label: 'Food', color: colors.reward.peachDark, bgColor: colors.reward.peachLight, hint: 'Hungry!', howTo: 'Log a bite or play Cooking Game' },
  { key: 'happiness', icon: 'heart', label: 'Joy', color: colors.accent.coral, bgColor: colors.accent.blush, hint: 'Bored!', howTo: 'Collect stamps or play games' },
  { key: 'energy', icon: 'flash', label: 'Energy', color: colors.calm.ocean, bgColor: colors.calm.skyLight, hint: 'Tired!', howTo: 'Check in daily to rest' },
  { key: 'knowledge', icon: 'book', label: 'Smarts', color: colors.primary.wisteriaDark, bgColor: colors.primary.wisteriaFaded, hint: 'Curious!', howTo: 'Take a quiz or finish a lesson' },
  { key: 'socialBattery', icon: 'chat', label: 'Social', color: colors.accent.rose, bgColor: colors.accent.blush, hint: 'Lonely!', howTo: 'Chat with Visby or hang out with friends' },
];

/** Map mood to need key so tapping mood bubble can open the care hint for that need */
const MOOD_TO_NEED_KEY: Record<string, keyof Omit<VisbyNeeds, 'lastUpdated'>> = {
  hungry: 'hunger',
  bored: 'happiness',
  sleepy: 'energy',
  curious: 'knowledge',
  lonely: 'socialBattery',
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    user, visby, userHouses, settings, discoveryLog, flashcardSRData,
    completedPathNodes, lessonProgress, stamps, bites, badges, storyBeatsShown,
    dailyMissionDateKey, dailyMissionCompletedAt, dailyMissionProgress,
    pendingStreakFreezeOffer, streakFreezesRemaining, showComebackReward,
    lastComebackAura, lastWeeklyRecapShown, lastGreetingDateKey,
  } = useStore(useShallow((s) => ({
    user: s.user, visby: s.visby, userHouses: s.userHouses,
    settings: s.settings, discoveryLog: s.discoveryLog,
    flashcardSRData: s.flashcardSRData, completedPathNodes: s.completedPathNodes,
    lessonProgress: s.lessonProgress, stamps: s.stamps, bites: s.bites,
    badges: s.badges, storyBeatsShown: s.storyBeatsShown,
    dailyMissionDateKey: s.dailyMissionDateKey,
    dailyMissionCompletedAt: s.dailyMissionCompletedAt,
    dailyMissionProgress: s.dailyMissionProgress,
    pendingStreakFreezeOffer: s.pendingStreakFreezeOffer,
    streakFreezesRemaining: s.streakFreezesRemaining,
    showComebackReward: s.showComebackReward,
    lastComebackAura: s.lastComebackAura,
    lastWeeklyRecapShown: s.lastWeeklyRecapShown,
    lastGreetingDateKey: s.lastGreetingDateKey,
  })));

  const {
    dailyCheckIn, getStreakMultiplier, updateVisbyNeeds, getVisbyNeeds,
    getVisbyMood, getGrowthStage, shouldShowVisbyCheckIn, getDailyMission,
    trySurprise, useStreakFreeze, declineStreakFreezeOffer,
    dismissComebackReward, markWeeklyRecapShown, getCurrentWeekKey,
    markStoryBeatShown, getAdventureOfTheDay, awardAdventureIfCompleted,
  } = useStore(useShallow((s) => ({
    dailyCheckIn: s.dailyCheckIn, getStreakMultiplier: s.getStreakMultiplier,
    updateVisbyNeeds: s.updateVisbyNeeds, getVisbyNeeds: s.getVisbyNeeds,
    getVisbyMood: s.getVisbyMood, getGrowthStage: s.getGrowthStage,
    shouldShowVisbyCheckIn: s.shouldShowVisbyCheckIn,
    getDailyMission: s.getDailyMission, trySurprise: s.trySurprise,
    useStreakFreeze: s.useStreakFreeze,
    declineStreakFreezeOffer: s.declineStreakFreezeOffer,
    dismissComebackReward: s.dismissComebackReward,
    markWeeklyRecapShown: s.markWeeklyRecapShown,
    getCurrentWeekKey: s.getCurrentWeekKey,
    markStoryBeatShown: s.markStoryBeatShown,
    getAdventureOfTheDay: s.getAdventureOfTheDay,
    awardAdventureIfCompleted: s.awardAdventureIfCompleted,
  })));

  const [refreshing, setRefreshing] = useState(false);
  const [careHint, setCareHint] = useState<typeof NEED_CONFIG[number] | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState(0);
  const [showVisbyCheckIn, setShowVisbyCheckIn] = useState(false);
  const [showSurpriseBonus, setShowSurpriseBonus] = useState(false);
  const [surpriseAura, setSurpriseAura] = useState(0);
  const [showStoryBeat, setShowStoryBeat] = useState(false);
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingSurpriseAura, setGreetingSurpriseAura] = useState(0);

  const dailyMission = useMemo(
    () => getDailyMission(),
    [getDailyMission, dailyMissionDateKey, dailyMissionCompletedAt, dailyMissionProgress],
  );
  const showFirstCountryBeat = useMemo(
    () => (user?.countriesVisited ?? 0) >= 1 && !storyBeatsShown.includes('first_country'),
    [user?.countriesVisited, storyBeatsShown],
  );

  const phraseOfTheDay = useMemo(() => getPhraseOfTheDay(), []);
  const weeklyChallenge = useMemo(() => getCurrentWeeklyChallenge(), []);

  const visbyFloat = useSharedValue(0);

  useEffect(() => {
    const prevAura = user?.aura || 0;
    dailyCheckIn();
    updateVisbyNeeds();
    const newAura = useStore.getState().user?.aura || 0;
    if (newAura > prevAura) {
      setDailyRewardAmount(newAura - prevAura);
      setShowDailyReward(true);
    }
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Daily greeting overlay (once per day)
    const todayKey = new Date().toISOString().slice(0, 10);
    if (lastGreetingDateKey !== todayKey) {
      const surprise = trySurprise();
      if (surprise.granted && surprise.aura) {
        setGreetingSurpriseAura(surprise.aura);
      }
      setShowGreeting(true);
    } else {
      if (shouldShowVisbyCheckIn()) {
        timers.push(setTimeout(() => setShowVisbyCheckIn(true), 700));
      }
      const surprise = trySurprise();
      if (surprise.granted && surprise.aura) {
        setSurpriseAura(surprise.aura);
        setShowSurpriseBonus(true);
      }
    }

    if (showFirstCountryBeat) setShowStoryBeat(true);
    awardAdventureIfCompleted();
    if (new Date().getDay() === 0) {
      const weekKey = getCurrentWeekKey();
      if (lastWeeklyRecapShown !== weekKey) {
        timers.push(setTimeout(() => setShowWeeklyRecap(true), 500));
      }
    }
    return () => timers.forEach(clearTimeout);
  }, [showFirstCountryBeat, awardAdventureIfCompleted, getCurrentWeekKey, lastWeeklyRecapShown]);

  useEffect(() => {
    visbyFloat.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 2800, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
          withTiming(0, { duration: 2800, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const visbyAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: visbyFloat.value }],
  }));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const userId = useStore.getState().user?.id;
      if (userId) {
        const { stampsService } = await import('../../services/stamps');
        const { bitesService } = await import('../../services/bites');
        const [freshStamps, freshBites] = await Promise.all([
          stampsService.getUserStamps(userId),
          bitesService.getUserBites(userId),
        ]);
        useStore.getState().setStamps(freshStamps);
        useStore.getState().setBites(freshBites);
      }
    } catch (e) {
      if (__DEV__) console.error('Refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Sweet dreams';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Goodnight';
  }, []);

  const { currentLevel, nextLevel, currentAura, progressAura, requiredAura } = useMemo(() => {
    const aura = user?.aura || 0;
    let currentLevel = LEVEL_THRESHOLDS[0];
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (aura >= LEVEL_THRESHOLDS[i].aura) {
        currentLevel = LEVEL_THRESHOLDS[i];
        break;
      }
    }
    const level = user?.level || 1;
    const nextLevel = LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)];
    const progressAura = aura - currentLevel.aura;
    const requiredAura = Math.max(1, nextLevel.aura - currentLevel.aura);
    return { currentLevel, nextLevel, currentAura: aura, progressAura, requiredAura };
  }, [user?.aura, user?.level]);

  const defaultAppearance = useMemo(
    () =>
      visby?.appearance || {
        skinTone: colors.visby.skin.light,
        hairColor: colors.visby.hair.brown,
        hairStyle: 'default',
        eyeColor: colors.visby.features.eyeDefault,
        eyeShape: 'round',
      },
    [visby?.appearance],
  );

  const openCareHintForMood = useCallback((mood: string) => {
    const needKey = MOOD_TO_NEED_KEY[mood];
    if (needKey) {
      const need = NEED_CONFIG.find((n) => n.key === needKey);
      if (need) setCareHint(need);
    }
  }, []);

  const handleNavigateAuraStore = useCallback(() => navigation.navigate('AuraStore'), [navigation]);
  const handleSetCareHint = useCallback((nc: (typeof NEED_CONFIG)[number]) => setCareHint(nc), []);
  const handleDismissCareHint = useCallback(() => setCareHint(null), []);
  const handleShowVisbyCheckIn = useCallback(() => setShowVisbyCheckIn(true), []);
  const handleCloseVisbyCheckIn = useCallback(() => setShowVisbyCheckIn(false), []);
  const handleTapSubtitle = useCallback(() => navigation.navigate('Avatar'), [navigation]);
  const handleCloseDailyReward = useCallback(() => setShowDailyReward(false), []);
  const handleStoryBeatDismiss = useCallback(() => {
    setShowStoryBeat(false);
    markStoryBeatShown('first_country');
  }, [markStoryBeatShown]);
  const handleDeclineStreakFreeze = useCallback(() => declineStreakFreezeOffer(), [declineStreakFreezeOffer]);
  const handleUseStreakFreeze = useCallback(() => useStreakFreeze(), [useStreakFreeze]);
  const handleCloseSurpriseBonus = useCallback(() => setShowSurpriseBonus(false), []);
  const handleDismissGreeting = useCallback(() => {
    setShowGreeting(false);
    const todayKey = new Date().toISOString().slice(0, 10);
    useStore.setState({ lastGreetingDateKey: todayKey });
  }, []);
  const handleDismissComebackReward = useCallback(() => dismissComebackReward(), [dismissComebackReward]);
  const handleCloseWeeklyRecap = useCallback(() => {
    setShowWeeklyRecap(false);
    markWeeklyRecapShown();
  }, [markWeeklyRecapShown]);
  const handleVisitWorld = useCallback(() => navigation.navigate('Explore', { screen: 'CountryWorld' }), [navigation]);
  const handleVisitWorldFromHouses = useCallback(() => navigation.navigate('Explore', { screen: 'CountryWorld' }), [navigation]);

  const handleDailyAdventureCta = useCallback(() => {
    const adventure = getAdventureOfTheDay();
    if (!adventure.step1) navigation.navigate('Explore', { screen: 'CountryWorld' });
    else if (!adventure.step2) navigation.navigate('Learn');
    else (navigation as any).navigate('WordMatch');
  }, [navigation, getAdventureOfTheDay]);

  const handleDailyMissionPress = useCallback(() => {
    if (!dailyMission) return;
    if (dailyMission.type === 'collect_stamp') navigation.navigate('Explore', { screen: 'Map' });
    else if (dailyMission.type === 'add_bite') navigation.navigate('AddBite');
    else if (dailyMission.type === 'play_minigame') (navigation as any).navigate('WordMatch');
    else if (dailyMission.type === 'chat_with_visby') setShowVisbyCheckIn(true);
    else if (dailyMission.type === 'read_facts') navigation.navigate('Explore', { screen: 'CountryWorld' });
    else if (dailyMission.type === 'complete_lesson') navigation.navigate('Learn');
  }, [navigation, dailyMission]);

  const handleHousePress = useCallback(
    (countryId: string) => navigation.navigate('Explore', { screen: 'CountryRoom', params: { countryId } }),
    [navigation],
  );

  const handleEventBannerPress = useCallback(() => {
    const activeEvent = getActiveEvent();
    if (activeEvent) analyticsService.trackEventParticipation(activeEvent.id);
  }, []);

  const smartNudge = useMemo<{ icon: IconName; label: string; cta: string; action: string; progress?: string } | null>(() => {
    const needs = getVisbyNeeds();
    const minNeed = Math.min(needs.hunger, needs.happiness, needs.energy, needs.knowledge, needs.socialBattery ?? 80);

    if (dailyMission && !dailyMissionCompletedAt) {
      return { icon: 'target', label: dailyMission.label, cta: 'Do it', action: 'daily_mission', progress: `${dailyMissionProgress}/${dailyMission.target}` };
    }
    if (minNeed < 20) {
      const worstKey = (['hunger', 'happiness', 'energy', 'knowledge', 'socialBattery'] as const).reduce((a, b) => ((needs[a] as number) < (needs[b] as number) ? a : b));
      const labels: Record<string, string> = { hunger: 'Feed Visby', happiness: 'Play with Visby', energy: 'Let Visby rest', knowledge: 'Study with Visby', socialBattery: 'Chat with Visby' };
      return { icon: 'heart', label: labels[worstKey] || 'Care for Visby', cta: 'Help', action: 'care_visby' };
    }
    const adventure = getAdventureOfTheDay();
    if (!adventure.completed) {
      const step = !adventure.step1 ? 'Explore a new country' : !adventure.step2 ? 'Learn 2 new things' : 'Play a mini-game';
      return { icon: 'compass', label: step, cta: "Let's go", action: 'adventure' };
    }
    const dueCount = getDueCount(flashcardSRData);
    if (dueCount > 0) {
      return { icon: 'cards', label: `Review ${dueCount} flashcard${dueCount > 1 ? 's' : ''}`, cta: 'Review', action: 'flashcards' };
    }
    const sustainLessons = lessonProgress.filter((p) => p.completed && ['sustain_travel', 'sustain_food', 'sustain_oceans'].includes(p.lessonId)).length;
    const context = {
      countriesVisited: user?.visitedCountries?.length ?? 0,
      bitesCount: bites.length,
      lessonsCompleted: lessonProgress.filter((p) => p.completed).length,
      badgesCount: badges.length,
      stampsCount: stamps.length,
      housesOwned: userHouses.length,
      streakDays: user?.currentStreak ?? 0,
      sustainabilityLessonsCompleted: sustainLessons,
    };
    for (const chapter of STORY_CHAPTERS) {
      if (storyBeatsShown.includes(chapter.storyBeatId)) continue;
      const current = getChapterUnlockCurrent(chapter.unlock.type, context);
      const pct = Math.min(100, Math.round((current / chapter.unlock.value) * 100));
      if (pct >= 75) {
        return { icon: 'book', label: `Almost unlocked: ${chapter.title}`, cta: 'Go', action: 'learn', progress: `${pct}%` };
      }
      break;
    }
    const activeEvent = getActiveEvent();
    if (activeEvent) {
      return { icon: 'star', label: `${activeEvent.name} — ${activeEvent.auraMultiplier}x Aura!`, cta: 'Explore', action: 'explore' };
    }
    const nextNodes = getUnlockableNodes(completedPathNodes);
    if (nextNodes.length > 0) {
      return { icon: 'sparkles', label: `Next up: ${nextNodes[0].title}`, cta: 'Start', action: 'learning_path' };
    }
    return null;
  }, [dailyMission, dailyMissionCompletedAt, dailyMissionProgress, getVisbyNeeds, getAdventureOfTheDay, flashcardSRData, user, lessonProgress, stamps, bites, badges, userHouses, storyBeatsShown, completedPathNodes]);

  const handleSmartNudgePress = useCallback(() => {
    if (!smartNudge) return;
    switch (smartNudge.action) {
      case 'daily_mission': handleDailyMissionPress(); break;
      case 'care_visby': setShowVisbyCheckIn(true); break;
      case 'adventure': handleDailyAdventureCta(); break;
      case 'flashcards': navigation.navigate('Flashcards'); break;
      case 'learn': navigation.navigate('Learn'); break;
      case 'explore': navigation.navigate('Explore', { screen: 'CountryWorld' }); break;
      case 'learning_path': navigation.navigate('LearningPath'); break;
      default: break;
    }
  }, [smartNudge, handleDailyMissionPress, handleDailyAdventureCta, navigation]);

  const handleCareDismissAndNavigate = useCallback(
    (screen: string, params?: object) => {
      setCareHint(null);
      if (params) (navigation as any).navigate(screen, params);
      else navigation.navigate(screen as any);
    },
    [navigation],
  );

  const handleCareLogBite = useCallback(() => handleCareDismissAndNavigate('AddBite'), [handleCareDismissAndNavigate]);
  const handleCareCookingGame = useCallback(() => handleCareDismissAndNavigate('CookingGame'), [handleCareDismissAndNavigate]);
  const handleCareExploreCountry = useCallback(
    () => handleCareDismissAndNavigate('Learn'),
    [handleCareDismissAndNavigate],
  );
  const handleCareTreasureHunt = useCallback(() => handleCareDismissAndNavigate('TreasureHunt'), [handleCareDismissAndNavigate]);
  const handleCareQuiz = useCallback(() => handleCareDismissAndNavigate('Quiz'), [handleCareDismissAndNavigate]);
  const handleCareWordMatch = useCallback(() => handleCareDismissAndNavigate('WordMatch'), [handleCareDismissAndNavigate]);

  const handleCareModalStopPropagation = useCallback((e: any) => e.stopPropagation(), []);

  const seasonalVisuals = useMemo(() => {
    const seasonal = getActiveSeasonalVisuals();
    const quieter = (settings as { quieterMode?: boolean }).quieterMode;
    return (
      <>
        <FloatingParticles
          count={quieter ? 2 : 6}
          variant={seasonal?.particleVariant ?? 'sparkle'}
          customColors={seasonal?.particleColors}
          opacity={quieter ? 0.12 : 0.3}
          speed="slow"
          shape={seasonal?.particleShape}
        />
        {seasonal && (
          <View
            style={[StyleSheet.absoluteFill, {
              backgroundColor: seasonal.backgroundTint,
              opacity: seasonal.backgroundTintOpacity,
              pointerEvents: 'none' as const,
            }]}
          />
        )}
      </>
    );
  }, [settings]);

  const homeRoomElement = useMemo(() => {
    const firstHouse = userHouses[0];
    const homeCountryId = firstHouse?.countryId ?? null;
    const houseData = homeCountryId ? COUNTRY_HOUSES[homeCountryId] : null;
    const homeRoom = houseData?.rooms?.[0] ?? DEFAULT_HOME_ROOM;
    const roomCustomization = firstHouse?.roomCustomizations?.[homeRoom.id];
    const homeCountry = homeCountryId ? COUNTRIES.find((c) => c.id === homeCountryId) : null;
    const atmosphere = homeCountryId ? getCountryAtmosphere(homeCountryId) : { windowSky: HOME_ATMOSPHERE.windowSky };
    const currentMood = getVisbyMood?.() ?? visby?.currentMood ?? 'happy';
    const moodInfo = MOOD_LABELS[currentMood] ?? MOOD_LABELS.happy;
    return (
      <HomeRoom
        homeRoom={homeRoom}
        roomCustomization={roomCustomization ?? null}
        homeCountryId={homeCountryId}
        roomLabel={homeCountry ? `${homeRoom.name} · ${homeCountry.name}` : homeRoom.name}
        windowSky={atmosphere.windowSky}
        effectiveWallColor={roomCustomization?.wallColor || homeRoom.wallColor}
        effectiveFloorColor={roomCustomization?.floorColor || homeRoom.floorColor}
        visby={visby}
        defaultAppearance={defaultAppearance}
        getGrowthStage={getGrowthStage}
        currentMood={currentMood}
        moodInfo={moodInfo}
        onTapVisby={handleShowVisbyCheckIn}
        onTapMood={() => openCareHintForMood(currentMood)}
        canOpenMoodHint={!!MOOD_TO_NEED_KEY[currentMood]}
        onTapSubtitle={handleTapSubtitle}
      />
    );
  }, [userHouses, visby, defaultAppearance, getGrowthStage, getVisbyMood, handleShowVisbyCheckIn, openCareHintForMood, handleTapSubtitle]);

  const adventure = useMemo(() => getAdventureOfTheDay(), [getAdventureOfTheDay, lessonProgress, stamps, userHouses]);

  const dailyAdventureElement = useMemo(() => {
    const showVisitWorld = userHouses.length === 0;
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(320)} style={styles.dailyAdventureSection}>
        <View style={styles.sectionTitleRow}>
          <Icon name="compass" size={18} color={colors.primary.wisteriaDark} />
          <Heading level={2} style={styles.sectionTitle}>Daily adventure</Heading>
        </View>
        <View style={styles.dailyAdventureCard}>
          <View style={styles.dailyAdventureSteps}>
            <View style={[styles.dailyAdventureStep, adventure.step1 && styles.dailyAdventureStepDone]}>
              <Icon name={adventure.step1 ? 'check' : 'globe'} size={18} color={adventure.step1 ? colors.success.emerald : colors.text.muted} />
              <Caption style={styles.dailyAdventureStepLabel}>Explore a new country</Caption>
            </View>
            <View style={[styles.dailyAdventureStep, adventure.step2 && styles.dailyAdventureStepDone]}>
              <Icon name={adventure.step2 ? 'check' : 'book'} size={18} color={adventure.step2 ? colors.success.emerald : colors.text.muted} />
              <Caption style={styles.dailyAdventureStepLabel}>Learn 2 new things</Caption>
            </View>
            <View style={[styles.dailyAdventureStep, adventure.step3 && styles.dailyAdventureStepDone]}>
              <Icon name={adventure.step3 ? 'check' : 'quiz'} size={18} color={adventure.step3 ? colors.success.emerald : colors.text.muted} />
              <Caption style={styles.dailyAdventureStepLabel}>Play a mini-game</Caption>
            </View>
          </View>
          {!adventure.completed ? (
            <TouchableOpacity
              style={styles.dailyAdventureCta}
              onPress={handleDailyAdventureCta}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Continue daily adventure"
            >
              <Text variant="bodySmall" style={styles.dailyAdventureCtaText}>
                {!adventure.step1 ? "Let's go" : !adventure.step2 ? 'Do a lesson' : 'Play game'}
              </Text>
              <Icon name="chevronRight" size={16} color={colors.primary.wisteriaDark} />
            </TouchableOpacity>
          ) : (
            <View style={styles.dailyAdventureDone}>
              <Icon name="trophy" size={18} color={colors.reward.gold} />
              <Caption style={styles.dailyAdventureDoneText}>Done! +{adventure.rewardAura} Aura</Caption>
            </View>
          )}
        </View>
        {showVisitWorld && (
          <TouchableOpacity
            style={styles.homeQuickCta}
            onPress={handleVisitWorld}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Explore the world"
          >
            <Icon name="globe" size={18} color={colors.primary.wisteriaDark} />
            <Text variant="bodySmall" style={styles.homeQuickCtaText}>Explore World</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }, [adventure, userHouses.length, handleDailyAdventureCta, handleVisitWorld]);

  const eventBannerElement = useMemo(() => {
    const activeEvent = getActiveEvent();
    if (!activeEvent) return null;
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(380)}>
        <AnimatedPressable onPress={handleEventBannerPress} scaleDown={0.97}>
          <LinearGradient colors={activeEvent.bgGradient} style={styles.eventBannerGradient}>
            <View style={styles.eventBannerRow}>
              <Text style={styles.eventBannerIcon}>{activeEvent.icon}</Text>
              <View style={styles.eventBannerTextWrap}>
                <Text variant="h3" style={styles.eventBannerName}>{activeEvent.name}</Text>
                <Caption>{activeEvent.description}</Caption>
                {activeEvent.auraMultiplier > 1 && (
                  <Text variant="bodySmall" style={styles.eventBannerAura}>
                    {activeEvent.auraMultiplier}x Aura bonus active!
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </AnimatedPressable>
      </Animated.View>
    );
  }, [handleEventBannerPress]);

  return (
    <View style={styles.container}>
      {/* Layered gradient background */}
      <LinearGradient
        colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight, colors.reward.peachLight, colors.base.cream]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      {seasonalVisuals}

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* ──── HEADER ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.header}>
            <View style={styles.headerLeft}>
              <Text variant="body" color={colors.text.muted} style={styles.greetingText}>
                {greeting}, {user?.username || 'Explorer'}
              </Text>
              <Heading level={1} style={styles.titleText}>
                {currentLevel.title}
              </Heading>
              <Caption style={styles.dashboardCaption}>
                Your home base — learn, play, and see what&apos;s new.
              </Caption>
            </View>
            <View style={styles.headerBadges}>
              <TouchableOpacity
                onPress={() => navigation.navigate('DiscoveryLog')}
                style={styles.discoveryChip}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Discovery journal"
              >
                <Icon name="book" size={14} color={colors.calm.ocean} />
                <Caption style={styles.discoveryChipText}>{discoveryLog.length}/200</Caption>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNavigateAuraStore}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="View Aura Store"
                style={{ position: 'relative' as const }}
              >
                <PulseGlow color="rgba(255, 215, 0, 0.35)" intensity={14} speed={3000}>
                  <AuraBadge amount={currentAura} />
                </PulseGlow>
                <Tooltip
                  id="home_aura_badge"
                  text="This is Aura -- earn it by learning and exploring!"
                  position="below"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ──── HOME ROOM: full Club Penguin / Sims style room ──── */}
          {homeRoomElement}

          {/* ──── TODAY'S FOCUS: Hero Card ──── */}
          {smartNudge && (
            <Animated.View entering={FadeInDown.duration(500).delay(250)} style={{ position: 'relative' as const }}>
              {lessonProgress.length === 0 && stamps.length === 0 && (
                <Tooltip
                  id="home_first_action"
                  text="Tap here to begin your first adventure!"
                />
              )}
              <AnimatedPressable
                style={styles.todayFocusCard}
                onPress={handleSmartNudgePress}
                scaleDown={0.97}
              >
                <LinearGradient
                  colors={[colors.primary.wisteriaFaded, colors.surface.lavender, colors.calm.skyLight]}
                  locations={[0, 0.6, 1]}
                  style={styles.todayFocusGradient}
                >
                  <View style={styles.todayFocusIconWrap}>
                    <Icon name={smartNudge.icon} size={28} color={colors.primary.wisteriaDark} />
                  </View>
                  <View style={styles.todayFocusTextWrap}>
                    <Caption style={styles.todayFocusHint}>Today's focus</Caption>
                    <Heading level={3} style={styles.todayFocusLabel}>{smartNudge.label}</Heading>
                    {smartNudge.progress && <Caption style={styles.todayFocusProgress}>{smartNudge.progress}</Caption>}
                  </View>
                  <View style={styles.todayFocusCta}>
                    <Text variant="body" style={styles.todayFocusCtaText}>{smartNudge.cta}</Text>
                    <Icon name="chevronRight" size={18} color={colors.text.inverse} />
                  </View>
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>
          )}

          {/* ──── QUICK ACTIONS ──── */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionPill} onPress={() => navigation.navigate('Learn')} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Learn">
              <Icon name="book" size={18} color={colors.primary.wisteriaDark} />
              <Text variant="bodySmall" style={styles.quickActionText}>Learn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionPill} onPress={() => navigation.navigate('Explore', { screen: 'CountryWorld' })} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Explore the world">
              <Icon name="globe" size={18} color={colors.calm.ocean} />
              <Text variant="bodySmall" style={styles.quickActionText}>Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionPill} onPress={() => (navigation as any).navigate('WordMatch')} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Play games">
              <Icon name="quiz" size={18} color={colors.reward.peachDark} />
              <Text variant="bodySmall" style={styles.quickActionText}>Games</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionPill} onPress={() => navigation.navigate('ShopHub')} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Visit shop">
              <Icon name="gift" size={18} color={colors.accent.coral} />
              <Text variant="bodySmall" style={styles.quickActionText}>Shop</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ──── DAILY ADVENTURE ──── */}
          {dailyAdventureElement}

          {/* ──── DAILY MISSION ──── */}
          {dailyMission && !dailyMissionCompletedAt && (
            <Animated.View entering={FadeInDown.duration(400).delay(360)} style={styles.dailyMissionSection}>
              <View style={styles.sectionTitleRow}>
                <Icon name="target" size={18} color={colors.primary.wisteriaDark} />
                <Heading level={2} style={styles.sectionTitle}>Today&apos;s mission</Heading>
              </View>
              <AnimatedPressable
                style={[styles.dailyMissionCard, { marginTop: spacing.xs }]}
                onPress={handleDailyMissionPress}
                scaleDown={0.97}
              >
                <LinearGradient colors={[colors.surface.lavender, colors.primary.wisteriaFaded]} style={styles.dailyMissionGradient}>
                  <View style={styles.dailyMissionLeft}>
                    <View style={styles.dailyMissionIconWrap}>
                      <Icon name="target" size={22} color={colors.primary.wisteriaDark} />
                    </View>
                    <View>
                      <Text variant="body" style={styles.dailyMissionTitle}>{dailyMission.label}</Text>
                      <Caption style={styles.dailyMissionLabel}>
                        {dailyMissionProgress}/{dailyMission.target} completed
                      </Caption>
                    </View>
                  </View>
                  <View style={styles.dailyMissionCta}>
                    <Text variant="bodySmall" style={styles.dailyMissionCtaText}>Do it</Text>
                    <Icon name="chevronRight" size={16} color={colors.primary.wisteriaDark} />
                  </View>
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>
          )}

          {/* ── Phrase of the Day ── */}
          <Animated.View entering={FadeInDown.duration(400).delay(340)} style={styles.phraseCard}>
            <LinearGradient
              colors={[colors.semantic.successBg, colors.semantic.successBgAlt, colors.base.cream]}
              style={styles.phraseGradient}
            >
              <View style={styles.phraseTop}>
                <View style={[styles.phraseIcon, { backgroundColor: colors.semantic.successAccent + '30' }]}>
                  <Icon name="language" size={22} color={colors.semantic.success} />
                </View>
                <Caption style={styles.phraseLabel}>Phrase of the Day</Caption>
              </View>
              <Text variant="heading" style={styles.phraseText}>{phraseOfTheDay.phrase}</Text>
              <Text variant="body" style={styles.phrasePronunciation}>{phraseOfTheDay.pronunciation}</Text>
              <View style={styles.phraseBottom}>
                <Text variant="bodySmall" style={styles.phraseTranslation}>{phraseOfTheDay.translation}</Text>
                <TouchableOpacity
                  style={styles.phraseSpeakBtn}
                  onPress={() => speechService.speak(phraseOfTheDay.phrase)}
                  accessibilityLabel="Listen to pronunciation"
                  accessibilityRole="button"
                >
                  <Icon name="music" size={16} color={colors.semantic.success} />
                  <Text variant="bodySmall" style={styles.phraseSpeakText}>Listen</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Weekly Challenge ── */}
          <Animated.View entering={FadeInDown.duration(400).delay(360)} style={styles.challengeCard}>
            <LinearGradient
              colors={[colors.semantic.warmOrangeBg, colors.semantic.warmOrangeBgAlt, colors.base.cream]}
              style={styles.challengeGradient}
            >
              <View style={styles.challengeHeader}>
                <View style={[styles.challengeIconWrap, { backgroundColor: colors.semantic.warmOrangeAccent + '30' }]}>
                  <Icon name={(weeklyChallenge.icon || 'star') as IconName} size={22} color={colors.semantic.warmOrange} />
                </View>
                <View style={styles.challengeTextWrap}>
                  <Text variant="body" style={styles.challengeTitle}>{weeklyChallenge.title}</Text>
                  <Caption>Complete 5 tasks for {weeklyChallenge.cosmeticRewardName}</Caption>
                </View>
                <View style={styles.challengeBadge}>
                  <Text variant="bodySmall" style={styles.challengeBadgeText}>+{weeklyChallenge.auraBonus}</Text>
                </View>
              </View>
              <View style={styles.challengeTasks}>
                {weeklyChallenge.tasks.map((task, i) => (
                  <View key={i} style={styles.challengeTask}>
                    <View style={[styles.challengeCheckbox, i < 1 && styles.challengeCheckboxDone]}>
                      {i < 1 && <Icon name="check" size={10} color={colors.text.inverse} />}
                    </View>
                    <Text variant="bodySmall" style={[styles.challengeTaskText, i < 1 && styles.challengeTaskDone]}>{task.description}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ──── SEASONAL EVENT BANNER ──── */}
          {eventBannerElement}

          {userHouses.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(380)} style={styles.myHousesSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="home" size={18} color={colors.primary.wisteriaDark} />
                  <Heading level={2} style={styles.sectionTitle}>My Houses</Heading>
                </View>
                <TouchableOpacity onPress={handleVisitWorldFromHouses} accessibilityRole="button" accessibilityLabel="Visit world">
                  <Text variant="bodySmall" color={colors.primary.wisteriaDark}>Visit World</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.streetSceneWrap}>
                <View style={styles.streetGrass} />
                <View style={styles.streetPath} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myHousesScroll}>
                  {userHouses.map((house) => {
                    const country = COUNTRIES.find((c) => c.id === house.countryId);
                    const furnitureCount = Object.values(house.roomCustomizations || {}).reduce(
                      (sum, r) => sum + (r?.placedFurniture?.length || 0), 0,
                    );
                    return (
                      <AnimatedPressable
                        key={house.id}
                        style={styles.myHouseCard}
                        onPress={() => handleHousePress(house.countryId)}
                        scaleDown={0.95}
                        accessibilityRole="button"
                        accessibilityLabel={`Visit ${house.houseName}`}
                      >
                        <HouseExterior
                          theme={country?.roomTheme ?? 'traditional'}
                          houseName={house.houseName}
                          flagEmoji={country?.flagEmoji}
                          furnitureCount={furnitureCount}
                          size={130}
                          seasonalDecoration={getActiveSeasonalVisuals()?.houseDecoration}
                        />
                        <Caption style={styles.myHouseCountry}>{country?.name ?? house.countryId}</Caption>
                        {furnitureCount > 0 && (
                          <Caption style={styles.myHouseFurnitureCount}>{furnitureCount} items</Caption>
                        )}
                      </AnimatedPressable>
                    );
                  })}
                </ScrollView>
              </View>
            </Animated.View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      {/* Daily Reward Modal */}
      <Modal visible={showDailyReward} transparent animationType="none">
        <Pressable style={styles.careOverlay} onPress={handleCloseDailyReward}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.careModal} onPress={handleCareModalStopPropagation}>
            <View style={[styles.careIconCircle, { backgroundColor: colors.status.streakBg }]}>
              <Icon name="flame" size={36} color={colors.status.streak} />
            </View>
            <Heading level={2} style={styles.careTitle}>Daily Check-in!</Heading>
            <Text style={styles.dailyRewardText}>+{dailyRewardAmount} Aura</Text>
            {user?.currentStreak && user.currentStreak > 1 && (
              <Caption style={{ textAlign: 'center', marginTop: 4 }}>
                {user.currentStreak}-day streak! {getStreakMultiplier().toFixed(1)}x bonus!
              </Caption>
            )}
            <Button title="Collect!" onPress={handleCloseDailyReward} variant="primary" style={{ marginTop: spacing.lg }} />
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      <VisbyCheckInModal visible={showVisbyCheckIn} onClose={handleCloseVisbyCheckIn} />

      {/* Story beat: Visby milestone message */}
      <Modal visible={showStoryBeat} transparent animationType="none">
        <Pressable style={styles.careOverlay} onPress={handleStoryBeatDismiss}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.careModal} onPress={handleCareModalStopPropagation}>
            <View style={[styles.careIconCircle, { backgroundColor: colors.primary.wisteriaFaded }]}>
              <Icon name="heart" size={36} color={colors.primary.wisteriaDark} />
            </View>
            <Caption style={styles.storyBeatLabel}>Visby says</Caption>
            <Heading level={2} style={styles.careTitle}>We're really going to see the world together!</Heading>
            <Text variant="body" style={styles.careDesc}>You visited your first place. There's so much more to explore — and I'll be right there with you. 🌍</Text>
            <Button title="Let's go!" onPress={handleStoryBeatDismiss} variant="primary" style={{ marginTop: spacing.lg }} />
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Streak freeze offer: you missed a day, use a freeze? */}
      <Modal visible={pendingStreakFreezeOffer} transparent animationType="none">
        <Pressable style={styles.careOverlay} onPress={() => {}}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.careModal} onPress={handleCareModalStopPropagation}>
            <View style={[styles.careIconCircle, { backgroundColor: colors.calm.skyLight }]}>
              <Icon name="flame" size={36} color={colors.status.streak} />
            </View>
            <Heading level={2} style={styles.careTitle}>You missed a day!</Heading>
            <Text variant="body" style={styles.careDesc}>
              Use a streak freeze to keep your {user?.currentStreak ?? 0}-day streak? You have {streakFreezesRemaining} left this month.
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
              <Button title="Start over" onPress={handleDeclineStreakFreeze} variant="secondary" style={{ flex: 1 }} />
              <Button title="Use freeze" onPress={handleUseStreakFreeze} variant="primary" style={{ flex: 1 }} />
            </View>
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Comeback: Welcome back! bonus */}
      <Modal visible={showComebackReward} transparent animationType="none">
        <Pressable style={styles.careOverlay} onPress={handleDismissComebackReward}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.careModal} onPress={handleCareModalStopPropagation}>
            <View style={[styles.careIconCircle, { backgroundColor: colors.primary.wisteriaFaded }]}>
              <Icon name="rocket" size={36} color={colors.primary.wisteriaDark} />
            </View>
            <Heading level={2} style={styles.careTitle}>Welcome back, explorer!</Heading>
            <Text variant="body" style={styles.careDesc}>We missed you! Here&apos;s a bonus to get you started again.</Text>
            <Text style={styles.dailyRewardText}>+{lastComebackAura} Aura</Text>
            <Button title="Let's explore!" onPress={handleDismissComebackReward} variant="primary" style={{ marginTop: spacing.lg }} />
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Surprise: Visby found a gift! */}
      <Modal visible={showSurpriseBonus} transparent animationType="none">
        <Pressable style={styles.careOverlay} onPress={handleCloseSurpriseBonus}>
          <Animated.View entering={ZoomIn.duration(400).springify()}>
            <Pressable style={styles.careModal} onPress={handleCareModalStopPropagation}>
              <View style={[styles.careIconCircle, { backgroundColor: colors.reward.peachLight }]}>
              <Icon name="gift" size={36} color={colors.reward.peachDark} />
            </View>
            <Heading level={2} style={styles.careTitle}>Visby found a gift!</Heading>
            <Text style={styles.dailyRewardText}>+{surpriseAura} Aura</Text>
            <Caption style={{ textAlign: 'center', marginTop: 4 }}>Lucky you! Come back tomorrow for more surprises.</Caption>
            <Button title="Yay!" onPress={handleCloseSurpriseBonus} variant="primary" style={{ marginTop: spacing.lg }} />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      <WeeklyRecapModal visible={showWeeklyRecap} onClose={handleCloseWeeklyRecap} />

      {/* Daily greeting overlay */}
      {showGreeting && (
        <DailyGreetingOverlay
          onDismiss={handleDismissGreeting}
          surpriseAura={greetingSurpriseAura || undefined}
        />
      )}

      {/* Care Hint Modal */}
      <Modal visible={!!careHint} transparent animationType="none">
        <Pressable style={styles.careOverlay} onPress={handleDismissCareHint}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.careModal} onPress={handleCareModalStopPropagation}>
            {careHint && (
              <>
                <View style={[styles.careIconCircle, { backgroundColor: careHint.bgColor }]}>
                  <Icon name={careHint.icon} size={36} color={careHint.color} />
                </View>
                <Heading level={2} style={styles.careTitle}>
                  {(getVisbyNeeds()[careHint.key] as number) < 30
                    ? `Your Visby is ${careHint.hint.replace('!', '')}!`
                    : `${careHint.label}: ${getVisbyNeeds()[careHint.key]}%`}
                </Heading>
                <Text variant="body" style={styles.careDesc}>
                  {careHint.key === 'hunger'
                    ? 'Feed your Visby by discovering dishes from around the world. Try the Cooking Game too.'
                    : careHint.key === 'happiness'
                    ? 'Add places to your passport, explore countries, and play mini-games—your Visby loves adventure!'
                    : careHint.key === 'energy'
                    ? 'Your Visby rests when you check in each day. Come back tomorrow for more energy!'
                    : 'Teach your Visby by taking quizzes, completing lessons, and playing Word Match!'}
                </Text>
                <View style={styles.careActions}>
                  {careHint.key === 'hunger' && (
                    <>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={handleCareLogBite}>
                        <Icon name="food" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Discover a Dish</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={handleCareCookingGame}>
                        <Icon name="sparkles" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Cooking Game</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {careHint.key === 'happiness' && (
                    <>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={handleCareExploreCountry}>
                        <Icon name="book" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Start a lesson</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={handleCareTreasureHunt}>
                        <Icon name="compass" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Treasure Hunt</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {careHint.key === 'energy' && (
                    <View style={[styles.careBtn, { backgroundColor: careHint.bgColor }]}>
                      <Icon name="time" size={20} color={careHint.color} />
                      <Text style={[styles.careBtnText, { color: careHint.color }]}>Restores daily at check-in</Text>
                    </View>
                  )}
                  {careHint.key === 'knowledge' && (
                    <>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={handleCareQuiz}>
                        <Icon name="quiz" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Take a Quiz</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={handleCareWordMatch}>
                        <Icon name="language" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Word Match</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <TouchableOpacity style={styles.careDismiss} onPress={handleDismissCareHint}>
                  <Text style={styles.careDismissText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

/* ─── Styles ─── */
const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 120,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  headerLeft: { flex: 1 },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  discoveryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.calm.skyLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.calm.ocean + '40',
  },
  discoveryChipText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: colors.calm.ocean,
  },
  greetingText: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
  titleText: {
    fontSize: 28,
    letterSpacing: -0.5,
    color: colors.text.primary,
    marginTop: 2,
  },
  dashboardCaption: {
    marginTop: 4,
    color: colors.text.muted,
    fontSize: 12,
  },

  homeQuickCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  homeQuickCtaText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.primary.wisteriaDark,
  },

  /* Today's Focus hero card */
  todayFocusCard: {
    marginBottom: spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
  },
  todayFocusGradient: {
    padding: spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.25)',
    gap: spacing.md,
  },
  todayFocusIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(167, 139, 219, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayFocusTextWrap: {
    flex: 1,
  },
  todayFocusHint: {
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: colors.primary.wisteriaDark,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  todayFocusLabel: {
    fontFamily: 'Baloo2-SemiBold',
    color: colors.text.primary,
    fontSize: 20,
  },
  todayFocusProgress: {
    marginTop: 2,
    color: colors.text.muted,
    fontSize: 11,
  },
  todayFocusCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary.wisteriaDark,
    borderRadius: 16,
  },
  todayFocusCtaText: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.inverse,
  },

  /* Quick actions */
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickActionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    backgroundColor: colors.surface.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  quickActionText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
    fontSize: 12,
  },

  /* Daily adventure */
  dailyAdventureSection: {
    marginBottom: spacing.lg,
  },
  dailyAdventureCard: {
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  dailyAdventureSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dailyAdventureStep: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  dailyAdventureStepDone: {
    opacity: 1,
  },
  dailyAdventureStepLabel: {
    fontSize: 10,
    color: colors.text.muted,
  },
  dailyAdventureCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 12,
  },
  dailyAdventureCtaText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.primary.wisteriaDark,
  },
  dailyAdventureDone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  dailyAdventureDoneText: {
    color: colors.text.secondary,
    fontFamily: 'Nunito-SemiBold',
  },

  /* Daily mission */
  dailyMissionSection: {
    marginBottom: spacing.lg,
  },
  dailyMissionCard: {
    marginBottom: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dailyMissionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 20,
  },
  dailyMissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dailyMissionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dailyMissionTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
  },
  dailyMissionLabel: {
    marginTop: 2,
  },
  dailyMissionCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  dailyMissionCtaText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.primary.wisteriaDark,
  },

  /* Phrase of the Day */
  phraseCard: {
    marginBottom: spacing.md,
  },
  phraseGradient: {
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
  },
  phraseTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  phraseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phraseText: {
    fontSize: 26,
    color: colors.text.primary,
    marginBottom: 2,
  },
  phrasePronunciation: {
    color: colors.text.secondary,
    fontStyle: 'italic' as const,
    marginBottom: spacing.sm,
  },
  phraseBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phraseTranslation: {
    color: colors.text.primary,
    fontWeight: '600' as const,
  },
  phraseLabel: {
    color: colors.semantic.success,
  },
  phraseSpeakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.semantic.success + '18',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.radius.md,
  },
  phraseSpeakText: {
    color: colors.semantic.success,
    marginLeft: 4,
  },

  /* Weekly Challenge */
  challengeCard: {
    marginBottom: spacing.md,
  },
  challengeGradient: {
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  challengeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTextWrap: {
    flex: 1,
  },
  challengeTitle: {
    fontWeight: '700' as const,
    color: colors.semantic.warmOrange,
  },
  challengeBadge: {
    backgroundColor: colors.semantic.warmOrangeAccent + '30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
  },
  challengeBadgeText: {
    color: colors.semantic.warmOrange,
    fontWeight: '600' as const,
    fontSize: 12,
  },
  challengeTasks: {
    gap: 8,
  },
  challengeTask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  challengeCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.semantic.checkboxBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeCheckboxDone: {
    backgroundColor: colors.semantic.successAccent,
    borderColor: colors.semantic.successAccent,
  },
  challengeTaskText: {
    color: colors.text.secondary,
    flex: 1,
  },
  challengeTaskDone: {
    textDecorationLine: 'line-through' as const,
    color: colors.text.muted,
  },

  /* Event banner */
  eventBannerGradient: {
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  eventBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eventBannerIcon: {
    fontSize: 28,
  },
  eventBannerTextWrap: {
    flex: 1,
  },
  eventBannerName: {
    color: colors.text.primary,
  },
  eventBannerAura: {
    color: colors.reward.amber,
    fontFamily: 'Nunito-Bold',
    marginTop: 2,
  },

  /* My Houses */
  myHousesSection: {
    marginBottom: spacing.lg,
  },
  myHousesScroll: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  myHouseCard: {
    width: 140,
    borderRadius: 16,
    overflow: 'hidden',
  },
  myHouseCountry: {
    marginTop: 2,
    fontSize: 11,
    color: colors.text.muted,
  },
  myHouseFurnitureCount: {
    fontSize: 9,
    color: colors.text.light,
  },
  streetSceneWrap: {
    position: 'relative',
    paddingBottom: spacing.xs,
  },
  streetGrass: {
    position: 'absolute',
    bottom: 0,
    left: -spacing.screenPadding,
    right: -spacing.screenPadding,
    height: 24,
    backgroundColor: 'rgba(139, 195, 74, 0.15)',
    borderRadius: 12,
  },
  streetPath: {
    position: 'absolute',
    bottom: 4,
    left: -spacing.screenPadding,
    right: -spacing.screenPadding,
    height: 8,
    backgroundColor: 'rgba(188, 170, 164, 0.2)',
    borderRadius: 4,
  },

  /* Section headers */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: { fontSize: 18 },

  /* Care Hint Modal */
  careOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  careModal: {
    backgroundColor: colors.surface.card,
    borderRadius: 28,
    padding: spacing.xl,
    maxWidth: 340,
    width: '100%',
    alignItems: 'center',
  },
  careIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  careTitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  storyBeatLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.primary.wisteriaDark,
    marginBottom: spacing.xs,
  },
  careDesc: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  careActions: {
    width: '100%',
    gap: spacing.sm,
  },
  careBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
  },
  careBtnText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  careDismiss: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  careDismissText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: colors.text.muted,
  },

  dailyRewardText: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 28,
    color: colors.reward.gold,
    textAlign: 'center' as const,
  },

  bottomSpacer: { height: 20 },
});

export default HomeScreen;
