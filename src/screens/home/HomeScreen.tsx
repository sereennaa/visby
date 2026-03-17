import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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
import { AnimatedAuraBadge } from '../../components/effects/AnimatedAuraBadge';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCheckInModal } from '../../components/visby/VisbyCheckInModal';
import { VisbyChatInner } from '../../components/visby/VisbyChatInner';
import { NeedsFloatingPanel } from '../../components/visby/NeedsFloatingPanel';
import { ChatFAB } from '../../components/visby/ChatFAB';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { HouseExterior } from '../../components/house/HouseExterior';
import { PulseGlow } from '../../components/effects/Shimmer';
import { useStore } from '../../store/useStore';
import { LEVEL_THRESHOLDS, COUNTRIES } from '../../config/constants';
import { RootStackParamList, VisbyNeeds } from '../../types';
import { DEFAULT_HOME_ROOM, HOME_ATMOSPHERE } from '../../config/homeRoom';
import { getCountryAtmosphere } from '../../config/countryAtmosphere';
import { COUNTRY_HOUSES } from '../../config/countryRooms';
import { HomeRoom } from '../../components/home/HomeRoom';
import { WeeklyRecapModal } from '../../components/home/WeeklyRecapModal';
import { getActiveEvent, getActiveSeasonalVisuals, getCurrentWeeklyChallenge } from '../../config/seasonalEvents';
import { getPhraseOfTheDay } from '../../config/learningContent';
import { speechService } from '../../services/audio';
import { analyticsService } from '../../services/analytics';
import { getDueCount } from '../../services/spacedRepetition';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { DailyGreetingOverlay } from '../../components/home/DailyGreetingOverlay';
import { Tooltip } from '../../components/ui/Tooltip';
import { EmptyState } from '../../components/ui/EmptyState';

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

type PlanTask = {
  id: string;
  icon: IconName;
  label: string;
  done: boolean;
  onPress: () => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isDesktop } = useResponsiveLayout();
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
    getWeeklyChallengeProgress,
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
    getWeeklyChallengeProgress: s.getWeeklyChallengeProgress,
  })));

  const challengeProgress = useMemo(() => getWeeklyChallengeProgress(), [getWeeklyChallengeProgress]);

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
  const handleVisitWorldFromHouses = useCallback(() => navigation.navigate('Explore', { screen: 'CountryWorld' }), [navigation]);
  const handleWeeklyChallengePress = useCallback(() => navigation.navigate('WeeklyChallenge'), [navigation]);

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

  const handleNeedsPanelNavigate = useCallback((screen: string, params?: object) => {
    if (params) (navigation as any).navigate(screen, params);
    else navigation.navigate(screen as any);
  }, [navigation]);

  const handleDesktopChatNavigate = useCallback((screen: string, params?: object) => {
    if (params) (navigation as any).navigate(screen, params);
    else navigation.navigate(screen as any);
  }, [navigation]);

  const handleEventBannerPress = useCallback(() => {
    const activeEvent = getActiveEvent();
    if (activeEvent) analyticsService.trackEventParticipation(activeEvent.id);
  }, []);

  const adventure = useMemo(() => getAdventureOfTheDay(), [getAdventureOfTheDay, lessonProgress, stamps, userHouses]);

  const todaysPlanTasks = useMemo<PlanTask[]>(() => {
    const adv = getAdventureOfTheDay();
    const tasks: PlanTask[] = [
      {
        id: 'adv1',
        icon: 'globe',
        label: 'Explore a country',
        done: !!adv.step1,
        onPress: () => navigation.navigate('Explore', { screen: 'CountryWorld' }),
      },
      {
        id: 'adv2',
        icon: 'book',
        label: 'Learn 2 new things',
        done: !!adv.step2,
        onPress: () => navigation.navigate('Learn'),
      },
      {
        id: 'adv3',
        icon: 'quiz',
        label: 'Play a mini-game',
        done: !!adv.step3,
        onPress: () => (navigation as any).navigate('WordMatch'),
      },
    ];

    if (dailyMission && !dailyMissionCompletedAt) {
      tasks.push({
        id: 'mission',
        icon: 'target',
        label: `${dailyMission.label} (${dailyMissionProgress}/${dailyMission.target})`,
        done: false,
        onPress: handleDailyMissionPress,
      });
    }

    if (adv.completed) {
      const needs = getVisbyNeeds();
      const minNeed = Math.min(needs.hunger, needs.happiness, needs.energy, needs.knowledge, needs.socialBattery ?? 80);
      if (minNeed < 20) {
        tasks.push({
          id: 'care',
          icon: 'heart',
          label: 'Care for Visby',
          done: false,
          onPress: () => setShowVisbyCheckIn(true),
        });
      } else {
        const dueCount = getDueCount(flashcardSRData);
        if (dueCount > 0) {
          tasks.push({
            id: 'review',
            icon: 'cards',
            label: `Review ${dueCount} flashcard${dueCount > 1 ? 's' : ''}`,
            done: false,
            onPress: () => navigation.navigate('Flashcards'),
          });
        }
      }
    }

    return tasks;
  }, [getAdventureOfTheDay, lessonProgress, stamps, userHouses, dailyMission, dailyMissionCompletedAt, dailyMissionProgress, handleDailyMissionPress, getVisbyNeeds, flashcardSRData, navigation]);

  const planDoneCount = useMemo(() => todaysPlanTasks.filter((t) => t.done).length, [todaysPlanTasks]);
  const planAllDone = planDoneCount === todaysPlanTasks.length && todaysPlanTasks.length > 0;

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

  const eventBannerElement = useMemo(() => {
    const activeEvent = getActiveEvent();
    if (!activeEvent) return null;
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(380)}>
        <AnimatedPressable onPress={handleEventBannerPress} scaleDown={0.97}>
          <LinearGradient colors={activeEvent.bgGradient} style={styles.eventBannerGradient}>
            <View style={styles.eventBannerRow}>
              <Icon name={activeEvent.icon as any} size={28} color={colors.text.primary} />
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

  const scrollContent = (
    <>
      {refreshing && (
        <View style={styles.refreshPeek}>
          <Icon name="compass" size={28} color={colors.primary.wisteriaDark} />
          <Caption style={styles.refreshPeekText}>Visby is looking around...</Caption>
        </View>
      )}

      {/* ──── HEADER ──── */}
      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="body" color={colors.text.muted} style={styles.greetingText}>
            {greeting}, {user?.username || 'Explorer'}
          </Text>
          <Heading level={1} style={styles.titleText}>
            {currentLevel.title}
          </Heading>
        </View>
        <View style={styles.headerBadges}>
          {(user?.currentStreak ?? 0) > 0 && (
            <View style={styles.streakChip}>
              <Icon name="flame" size={14} color={colors.status.streak} />
              <Caption style={styles.streakChipText}>{user?.currentStreak}</Caption>
            </View>
          )}
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
              <AnimatedAuraBadge amount={currentAura} />
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

      {/* ──── TODAY'S PLAN ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(250)} style={styles.todaysPlanSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Icon name="compass" size={18} color={colors.primary.wisteriaDark} />
                <Heading level={2} style={styles.sectionTitle}>Today&apos;s Plan</Heading>
              </View>
              <View style={styles.planProgressChip}>
                <Text variant="bodySmall" style={styles.planProgressText}>
                  {planDoneCount}/{todaysPlanTasks.length}
                </Text>
              </View>
            </View>

            {planAllDone ? (
              <View style={styles.planDoneCard}>
                <Icon name="trophy" size={22} color={colors.reward.gold} />
                <View style={styles.planDoneTextWrap}>
                  <Text variant="body" style={styles.planDoneTitle}>All done for today!</Text>
                  <Caption>+{adventure.rewardAura} Aura earned</Caption>
                </View>
              </View>
            ) : (
              <View style={styles.planTaskList}>
                {todaysPlanTasks.map((task, i) => (
                  <TouchableOpacity
                    key={task.id}
                    style={[
                      styles.planTaskRow,
                      i === todaysPlanTasks.length - 1 && styles.planTaskRowLast,
                    ]}
                    onPress={task.done ? undefined : task.onPress}
                    activeOpacity={task.done ? 1 : 0.7}
                    disabled={task.done}
                    accessibilityRole="button"
                    accessibilityLabel={task.label}
                  >
                    <View style={[styles.planTaskCheck, task.done && styles.planTaskCheckDone]}>
                      {task.done ? (
                        <Icon name="check" size={12} color={colors.text.inverse} />
                      ) : (
                        <Icon name={task.icon} size={14} color={colors.text.muted} />
                      )}
                    </View>
                    <Text
                      variant="body"
                      style={[styles.planTaskLabel, task.done && styles.planTaskLabelDone]}
                    >
                      {task.label}
                    </Text>
                    {!task.done && (
                      <Icon name="chevronRight" size={16} color={colors.text.muted} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {lessonProgress.length === 0 && stamps.length === 0 && (
              <Tooltip
                id="home_first_action"
                text="Tap a task to begin your first adventure!"
              />
            )}
          </Animated.View>

          {/* ──── PHRASE OF THE DAY (compact) ──── */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <View style={styles.phraseCompactCard}>
              <View style={[styles.phraseCompactIcon, { backgroundColor: colors.semantic.successAccent + '30' }]}>
                <Icon name="language" size={18} color={colors.semantic.success} />
              </View>
              <View style={styles.phraseCompactBody}>
                <Text variant="body" style={styles.phraseCompactText}>{phraseOfTheDay.phrase}</Text>
                <Caption style={styles.phraseCompactSub}>
                  {phraseOfTheDay.pronunciation} · {phraseOfTheDay.translation}
                </Caption>
              </View>
              <TouchableOpacity
                style={styles.phraseCompactBtn}
                onPress={() => speechService.speak(phraseOfTheDay.phrase, phraseOfTheDay.countryId)}
                accessibilityLabel="Listen to pronunciation"
                accessibilityRole="button"
              >
                <Icon name="music" size={16} color={colors.semantic.success} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ──── MY WORLD (promoted houses) ──── */}
          {userHouses.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(400).delay(340)}>
              <EmptyState
                icon="home"
                title="No houses yet!"
                message="Visit a country and buy your first house to start decorating."
                ctaLabel="Explore the world"
                onCta={handleVisitWorldFromHouses}
              />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.duration(400).delay(340)} style={styles.myWorldSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="globe" size={18} color={colors.primary.wisteriaDark} />
                  <Heading level={2} style={styles.sectionTitle}>My World</Heading>
                  <View style={styles.countryCountChip}>
                    <Caption style={styles.countryCountText}>
                      {userHouses.length} {userHouses.length === 1 ? 'country' : 'countries'}
                    </Caption>
                  </View>
                </View>
                <TouchableOpacity onPress={handleVisitWorldFromHouses} accessibilityRole="button" accessibilityLabel="Explore more">
                  <Text variant="bodySmall" color={colors.primary.wisteriaDark}>Explore more</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myWorldScroll}>
                {userHouses.map((house) => {
                  const country = COUNTRIES.find((c) => c.id === house.countryId);
                  const furnitureCount = Object.values(house.roomCustomizations || {}).reduce(
                    (sum, r) => sum + (r?.placedFurniture?.length || 0), 0,
                  );
                  return (
                    <AnimatedPressable
                      key={house.id}
                      style={styles.myWorldCard}
                      onPress={() => handleHousePress(house.countryId)}
                      scaleDown={0.95}
                      accessibilityRole="button"
                      accessibilityLabel={`Visit ${house.houseName}`}
                    >
                      <HouseExterior
                        theme={country?.roomTheme ?? 'traditional'}
                        countryId={house.countryId}
                        houseName={house.houseName}
                        flagEmoji={country?.flagEmoji}
                        furnitureCount={furnitureCount}
                        size={130}
                        seasonalDecoration={getActiveSeasonalVisuals()?.houseDecoration}
                      />
                      <Caption style={styles.myWorldCountry}>{country?.name ?? house.countryId}</Caption>
                      {furnitureCount > 0 && (
                        <Caption style={styles.myWorldFurniture}>{furnitureCount} items</Caption>
                      )}
                    </AnimatedPressable>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}

          {/* ──── WEEKLY PROGRESS (compact) ──── */}
          <Animated.View entering={FadeInDown.duration(400).delay(360)}>
            <AnimatedPressable onPress={handleWeeklyChallengePress} scaleDown={0.97}>
              <View style={styles.weeklyProgressCard}>
                <View style={[styles.weeklyProgressIcon, { backgroundColor: colors.semantic.warmOrangeAccent + '30' }]}>
                  <Icon name={(weeklyChallenge.icon || 'star') as IconName} size={18} color={colors.semantic.warmOrange} />
                </View>
                <View style={styles.weeklyProgressBody}>
                  <Text variant="body" style={styles.weeklyProgressTitle}>{weeklyChallenge.title}</Text>
                  <View style={styles.weeklyProgressDots}>
                    {weeklyChallenge.tasks.map((task: { type: string; target: number }, i: number) => {
                      const taskDone = (challengeProgress[task.type] ?? 0) >= task.target;
                      return (
                        <View
                          key={i}
                          style={[styles.weeklyProgressDot, taskDone && styles.weeklyProgressDotDone]}
                        />
                      );
                    })}
                  </View>
                </View>
                <View style={styles.weeklyProgressBadge}>
                  <Text variant="bodySmall" style={styles.weeklyProgressBadgeText}>+{weeklyChallenge.auraBonus}</Text>
                </View>
                <Icon name="chevronRight" size={16} color={colors.text.muted} />
              </View>
            </AnimatedPressable>
          </Animated.View>

      {/* ──── SEASONAL EVENT BANNER ──── */}
      {eventBannerElement}

      <View style={styles.bottomSpacer} />
    </>
  );

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
        {isDesktop ? (
          <View style={styles.desktopRow}>
            <ScrollView
              style={styles.desktopMainCol}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary.wisteria}
                  colors={[colors.primary.wisteria, colors.reward.gold]}
                  progressBackgroundColor={colors.base.cream}
                />
              }
            >
              {scrollContent}
            </ScrollView>
            <View style={styles.desktopSidebar}>
              <NeedsFloatingPanel onNavigateAway={handleNeedsPanelNavigate} />
              <View style={styles.desktopChatWrap}>
                <VisbyChatInner
                  active
                  onNavigateAway={handleDesktopChatNavigate}
                  showNeeds={false}
                />
              </View>
            </View>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary.wisteria}
                  colors={[colors.primary.wisteria, colors.reward.gold]}
                  progressBackgroundColor={colors.base.cream}
                />
              }
            >
              {scrollContent}
            </ScrollView>
            <View style={styles.mobileNeedsWrap}>
              <NeedsFloatingPanel onNavigateAway={handleNeedsPanelNavigate} />
            </View>
            <ChatFAB onPress={handleShowVisbyCheckIn} />
          </>
        )}
      </SafeAreaView>

      {/* Daily Reward Modal */}
      <Modal visible={showDailyReward} transparent animationType="fade">
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

      {!isDesktop && (
        <VisbyCheckInModal visible={showVisbyCheckIn} onClose={handleCloseVisbyCheckIn} />
      )}

      {/* Story beat: Visby milestone message */}
      <Modal visible={showStoryBeat} transparent animationType="fade">
        <Pressable style={styles.careOverlay} onPress={handleStoryBeatDismiss}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.careModal} onPress={handleCareModalStopPropagation}>
            <View style={[styles.careIconCircle, { backgroundColor: colors.primary.wisteriaFaded }]}>
              <Icon name="heart" size={36} color={colors.primary.wisteriaDark} />
            </View>
            <Caption style={styles.storyBeatLabel}>Visby says</Caption>
            <Heading level={2} style={styles.careTitle}>We're really going to see the world together!</Heading>
            <Text variant="body" style={styles.careDesc}>You visited your first place. There's so much more to explore — and I'll be right there with you.</Text>
            <Button title="Let's go!" onPress={handleStoryBeatDismiss} variant="primary" style={{ marginTop: spacing.lg }} />
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Streak freeze offer: you missed a day, use a freeze? */}
      <Modal visible={pendingStreakFreezeOffer} transparent animationType="fade">
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
      <Modal visible={showComebackReward} transparent animationType="fade">
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
      <Modal visible={showSurpriseBonus} transparent animationType="fade">
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
      <Modal visible={!!careHint} transparent animationType="fade">
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
    paddingBottom: spacing.xxl,
  },

  /* Desktop two-column layout */
  desktopRow: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopMainCol: {
    flex: 1,
  },
  desktopSidebar: {
    width: 340,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(184,165,224,0.15)',
    backgroundColor: colors.base.cream,
    padding: spacing.md,
    gap: spacing.md,
  },
  desktopChatWrap: {
    flex: 1,
    backgroundColor: colors.base.cream,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(184,165,224,0.2)',
    padding: spacing.sm,
    overflow: 'hidden',
  },

  /* Mobile floating needs panel */
  mobileNeedsWrap: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    zIndex: 90,
    maxWidth: 280,
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
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.status.streakBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.status.streak + '40',
  },
  streakChipText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: colors.status.streak,
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

  /* Today's Plan */
  todaysPlanSection: {
    marginBottom: spacing.lg,
  },
  planProgressChip: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  planProgressText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: colors.primary.wisteriaDark,
  },
  planDoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.semantic.successBg,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.semantic.successAccent + '30',
  },
  planDoneTextWrap: { flex: 1 },
  planDoneTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
  },
  planTaskList: {
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
    overflow: 'hidden',
  },
  planTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(184, 165, 224, 0.12)',
  },
  planTaskRowLast: {
    borderBottomWidth: 0,
  },
  planTaskCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.text.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTaskCheckDone: {
    backgroundColor: colors.success.emerald,
    borderColor: colors.success.emerald,
  },
  planTaskLabel: {
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
  },
  planTaskLabelDone: {
    textDecorationLine: 'line-through' as const,
    color: colors.text.muted,
  },

  /* Phrase of the Day (compact) */
  phraseCompactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.semantic.successAccent + '20',
  },
  phraseCompactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phraseCompactBody: { flex: 1 },
  phraseCompactText: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    fontSize: 15,
  },
  phraseCompactSub: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 1,
  },
  phraseCompactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.semantic.success + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* My World */
  myWorldSection: {
    marginBottom: spacing.lg,
  },
  countryCountChip: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countryCountText: {
    fontSize: 11,
    color: colors.primary.wisteriaDark,
    fontFamily: 'Nunito-SemiBold',
  },
  myWorldScroll: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  myWorldCard: {
    width: 140,
    borderRadius: 16,
    overflow: 'hidden',
  },
  myWorldCountry: {
    marginTop: 2,
    fontSize: 11,
    color: colors.text.muted,
  },
  myWorldFurniture: {
    fontSize: 9,
    color: colors.text.light,
  },

  /* Weekly Progress (compact) */
  weeklyProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.semantic.warmOrangeAccent + '20',
  },
  weeklyProgressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weeklyProgressBody: { flex: 1 },
  weeklyProgressTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    fontSize: 14,
  },
  weeklyProgressDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  weeklyProgressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.semantic.checkboxBorder,
  },
  weeklyProgressDotDone: {
    backgroundColor: colors.semantic.successAccent,
    borderColor: colors.semantic.successAccent,
  },
  weeklyProgressBadge: {
    backgroundColor: colors.semantic.warmOrangeAccent + '30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  weeklyProgressBadgeText: {
    color: colors.semantic.warmOrange,
    fontWeight: '600' as const,
    fontSize: 12,
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
  refreshPeek: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  refreshPeekEmoji: {
    fontSize: 28,
  },
  refreshPeekText: {
    textAlign: 'center',
  },
});

export default HomeScreen;
