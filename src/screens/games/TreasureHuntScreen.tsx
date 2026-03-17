import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { LoadingView } from '../../components/ui/LoadingView';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import * as Haptics from 'expo-haptics';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analytics';
import { soundService } from '../../services/sound';
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { getPostGameLine } from '../../config/visbyLines';
import { RootStackParamList } from '../../types';
import { SpeakerButton } from '../../components/ui/SpeakerButton';
import { COUNTRIES } from '../../config/constants';
import { copy } from '../../config/copy';
import { getCountryAtmosphere } from '../../config/countryAtmosphere';
import {
  getRoomsForCountry,
  getRandomRoomForCountry,
  getRoomHuntForPlay,
  getLocationHuntRound,
  countryHasLocationHunt,
  type RoomHuntItem,
  type LocationHuntRound,
} from '../../config/treasureHunt';
import { GameCelebration, getCelebrationTier } from '../../components/effects/GameCelebration';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ROOM_HORIZONTAL_PADDING = spacing.screenPadding;
const AURA_PER_ITEM_FALLBACK = 8;

/** Match CountryRoomScreen layout for immersive room stage */
const ROOM_STAGE_WINDOW_STRIP_HEIGHT = 48;
const ROOM_STAGE_WALL_HEIGHT = 280;
const ROOM_STAGE_FLOOR_HEIGHT = 108;
const ROOM_STAGE_OBJECTS_LAYER_HEIGHT = (ROOM_STAGE_WALL_HEIGHT - ROOM_STAGE_WINDOW_STRIP_HEIGHT) - 32;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Countries that have at least one room for treasure hunt */
function getCountriesWithRooms(): { id: string; name: string; flagEmoji: string; accentColor: string }[] {
  return COUNTRIES.filter((c) => getRoomsForCountry(c.id).length > 0).map((c) => ({
    id: c.id,
    name: c.name,
    flagEmoji: c.flagEmoji,
    accentColor: c.accentColor,
  }));
}

/** Pulsing mystery spot for hidden treasure in room hunt; shakes when wrongTapTargetId matches */
const RoomMysterySpot: React.FC<{ accentColor: string; objId: string; wrongTapTargetId: string | null }> = ({ accentColor, objId, wrongTapTargetId }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.85);
  const translateX = useSharedValue(0);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.7, { duration: 800 })
      ),
      -1,
      true
    );
  }, [accentColor]);
  useEffect(() => {
    if (wrongTapTargetId === objId) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 45 }),
        withTiming(10, { duration: 45 }),
        withTiming(-8, { duration: 45 }),
        withTiming(8, { duration: 45 }),
        withTiming(0, { duration: 45 })
      );
    }
  }, [wrongTapTargetId, objId]);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));
  return (
    <Animated.View style={[styles.mysterySpotOuter, { borderColor: accentColor + '50' }]}>
      <Animated.View style={[styles.mysterySpotInner, { backgroundColor: accentColor + '25' }, animStyle]}>
        <Icon name="compass" size={32} color={accentColor} />
      </Animated.View>
    </Animated.View>
  );
};

type TreasureHuntScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TreasureHunt'>;
  route: RouteProp<RootStackParamList, 'TreasureHunt'>;
};

type GamePhase = 'picker' | 'mission_intro' | 'room_hunt' | 'reveal' | 'complete' | 'location_hunt' | 'location_reveal' | 'location_complete';
type HuntMode = 'room' | 'location';

const GAME_NAME = 'TreasureHunt';

export const TreasureHuntScreen: React.FC<TreasureHuntScreenProps> = ({ navigation, route }) => {
  const pathNodeId = route.params?.pathNodeId;
  const initialCountryId = route.params?.countryId ?? null;
  const {
    addAura,
    playWithVisby,
    incrementGameStat,
    addSkillPoints,
    checkDailyMissionCompletion,
    setAdventureGamePlayed,
    getTreasureHuntProgress,
    completeTreasureHuntRoom,
    completeTreasureHuntLocation,
    getVisbyMood,
    markGamePlayed,
    addDiscovery,
    completePathNode,
  } = useStore();

  React.useEffect(() => {
    analyticsService.trackGameStart(GAME_NAME);
  }, []);

  const countriesWithRooms = useMemo(() => getCountriesWithRooms(), []);

  const [huntMode, setHuntMode] = useState<HuntMode>('room');
  const [phase, setPhase] = useState<GamePhase>(initialCountryId ? 'room_hunt' : 'picker');
  const [countryId, setCountryId] = useState<string | null>(initialCountryId);
  const [roomHuntData, setRoomHuntData] = useState<{
    room: { id: string; name: string; wallColor: string; floorColor: string; roomImageUrl?: string; objects: { id: string; label: string; icon: string; x: number; y: number }[] };
    items: RoomHuntItem[];
  } | null>(null);
  const [clueIndex, setClueIndex] = useState(0);
  const [wrongTapMessage, setWrongTapMessage] = useState<string | null>(null);
  const [wrongTapTargetId, setWrongTapTargetId] = useState<string | null>(null);
  const [wrongTapCount, setWrongTapCount] = useState(0);
  const [revealItem, setRevealItem] = useState<RoomHuntItem | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [foundItemsForSummary, setFoundItemsForSummary] = useState<RoomHuntItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [locationRounds, setLocationRounds] = useState<LocationHuntRound[]>([]);
  const [locationRoundIndex, setLocationRoundIndex] = useState(0);
  const [locationFoundForSummary, setLocationFoundForSummary] = useState<{ name: string; learningPoints: number; imageUrl?: string; description?: string }[]>([]);
  const [locationReveal, setLocationReveal] = useState<LocationHuntRound['target'] | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const country = countryId ? COUNTRIES.find((c) => c.id === countryId) : null;
  const accentColor = country?.accentColor ?? colors.primary.wisteria;
  const roomBgColor = roomHuntData?.room.wallColor ?? colors.base.cream;

  useEffect(() => {
    if (initialCountryId && !roomHuntData && phase === 'room_hunt') {
      const progress = getTreasureHuntProgress(initialCountryId);
      const room = getRandomRoomForCountry(initialCountryId, progress.completedRoomIds);
      if (room) {
        const hunt = getRoomHuntForPlay(initialCountryId, room.id, 5);
        if (hunt) {
          setCountryId(initialCountryId);
          setRoomHuntData({ room, items: hunt.items });
          setClueIndex(0);
          setWrongTapCount(0);
        } else {
          setPhase('picker');
          setCountryId(null);
        }
      } else {
        setPhase('picker');
        setCountryId(null);
      }
    }
  }, [initialCountryId, phase, roomHuntData, getTreasureHuntProgress]);

  useEffect(() => {
    if (phase === 'room_hunt' && roomHuntData) {
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, roomHuntData]);

  const startHuntInCountry = useCallback(
    (cid: string) => {
      setCountryId(cid);
      setWrongTapMessage(null);
      setElapsedSeconds(0);
      setShowCelebration(false);

      if (huntMode === 'location') {
        const rounds: LocationHuntRound[] = [];
        for (let i = 0; i < 3; i++) {
          const r = getLocationHuntRound(cid);
          if (r) rounds.push(r);
        }
        if (rounds.length === 0) return;
        setLocationRounds(rounds);
        setLocationRoundIndex(0);
        setLocationFoundForSummary([]);
        setLocationReveal(null);
        setPhase('mission_intro');
      } else {
        const progress = getTreasureHuntProgress(cid);
        const room = getRandomRoomForCountry(cid, progress.completedRoomIds);
        if (!room) return;
        const hunt = getRoomHuntForPlay(cid, room.id, 5);
        if (!hunt) return;
        setRoomHuntData({ room, items: hunt.items });
        setClueIndex(0);
        setRevealItem(null);
        setWrongTapCount(0);
        setFoundItemsForSummary([]);
        setPhase('mission_intro');
      }
    },
    [getTreasureHuntProgress, huntMode]
  );

  const handleObjectTap = useCallback(
    (itemId: string) => {
      if (!roomHuntData || phase !== 'room_hunt') return;
      const currentTarget = roomHuntData.items[clueIndex];
      if (!currentTarget) return;
      if (itemId === currentTarget.id) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        soundService.playMatch();
        setFoundItemsForSummary((prev) => [...prev, currentTarget]);
        setRevealItem(currentTarget);
        setPhase('reveal');
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        soundService.playTap();
        setWrongTapCount((c) => c + 1);
        setWrongTapTargetId(itemId);
        setWrongTapMessage(copy.treasureHunt.wrongTap);
        setTimeout(() => {
          setWrongTapMessage(null);
          setWrongTapTargetId(null);
        }, 1500);
      }
    },
    [roomHuntData, phase, clueIndex]
  );

  const handleRevealNext = useCallback(() => {
    if (!roomHuntData) return;
    setRevealItem(null);
    if (clueIndex + 1 >= roomHuntData.items.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      soundService.playMissionComplete();
      const totalAura = roomHuntData.items.reduce(
        (sum, i) => sum + (i.auraReward ?? AURA_PER_ITEM_FALLBACK),
        0
      );
      setShowCelebration(true);
      setPhase('complete');
      addAura(totalAura);
      const bonus = getGameOfTheDayBonusAura('TreasureHunt');
      if (bonus > 0) addAura(bonus);
      playWithVisby();
      incrementGameStat('gamesPlayed');
      analyticsService.trackGameComplete(GAME_NAME, roomHuntData.items.length, true);
      checkDailyMissionCompletion?.('play_minigame', 1);
      setAdventureGamePlayed?.();
      incrementGameStat('treasureHuntsCompleted');
      addSkillPoints('exploration', 3);
      if (pathNodeId) completePathNode(pathNodeId);
      if (countryId) {
        completeTreasureHuntRoom(countryId, roomHuntData.room.id);
        markGamePlayed(countryId);
        addDiscovery(`Treasure Hunt: ${roomHuntData.room.name ?? 'Room'}`, countryId, 'treasure');
      }
    } else {
      setClueIndex((i) => i + 1);
      setPhase('room_hunt');
    }
  }, [roomHuntData, clueIndex, countryId, addAura, playWithVisby, incrementGameStat, addSkillPoints, completeTreasureHuntRoom, markGamePlayed, checkDailyMissionCompletion, setAdventureGamePlayed]);

  const handleLocationCardTap = useCallback(
    (locationId: string) => {
      if (locationRounds.length === 0 || phase !== 'location_hunt') return;
      const round = locationRounds[locationRoundIndex];
      if (!round) return;
      if (locationId === round.target.id) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        soundService.playMatch();
        setLocationFoundForSummary((prev) => [...prev, { name: round.target.name, learningPoints: round.target.learningPoints, imageUrl: round.target.imageUrl, description: round.target.description }]);
        addAura(round.target.learningPoints);
        if (countryId) completeTreasureHuntLocation(countryId, round.target.id);
        setLocationReveal(round.target);
        setPhase('location_reveal');
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        soundService.playTap();
        setWrongTapMessage(copy.treasureHunt.wrongTap);
        setTimeout(() => setWrongTapMessage(null), 1500);
      }
    },
    [locationRounds, locationRoundIndex, countryId, addAura, completeTreasureHuntLocation, phase]
  );

  const handleLocationRevealNext = useCallback(() => {
    setLocationReveal(null);
    if (locationRoundIndex + 1 >= locationRounds.length) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      soundService.playMissionComplete();
      setShowCelebration(true);
      setPhase('location_complete');
      const bonus = getGameOfTheDayBonusAura('TreasureHunt');
      if (bonus > 0) addAura(bonus);
      playWithVisby();
      incrementGameStat('gamesPlayed');
      analyticsService.trackGameComplete(GAME_NAME, locationRounds.length, true);
      checkDailyMissionCompletion?.('play_minigame', 1);
      setAdventureGamePlayed?.();
      incrementGameStat('treasureHuntsCompleted');
      addSkillPoints('exploration', 3);
      if (pathNodeId) completePathNode(pathNodeId);
      if (countryId) {
        markGamePlayed(countryId);
        addDiscovery('Location Treasure Hunt', countryId, 'treasure');
      }
    } else {
      setLocationRoundIndex((i) => i + 1);
      setPhase('location_hunt');
    }
  }, [locationRoundIndex, locationRounds.length, countryId, playWithVisby, incrementGameStat, addSkillPoints, markGamePlayed, checkDailyMissionCompletion, setAdventureGamePlayed]);

  const handleExploreAnotherRoom = useCallback(() => {
    if (!countryId) {
      setPhase('picker');
      setCountryId(null);
      setRoomHuntData(null);
      return;
    }
    const progress = getTreasureHuntProgress(countryId);
    const room = getRandomRoomForCountry(countryId, progress.completedRoomIds);
    if (!room) {
      setPhase('picker');
      setCountryId(null);
      setRoomHuntData(null);
      return;
    }
    const hunt = getRoomHuntForPlay(countryId, room.id, 5);
    if (!hunt) {
      setPhase('picker');
      setCountryId(null);
      setRoomHuntData(null);
      return;
    }
    setRoomHuntData({ room, items: hunt.items });
    setClueIndex(0);
    setWrongTapMessage(null);
    setWrongTapCount(0);
    setRevealItem(null);
    setFoundItemsForSummary([]);
    setElapsedSeconds(0);
    setShowCelebration(false);
    setPhase('room_hunt');
  }, [countryId, getTreasureHuntProgress]);

  const totalAura = roomHuntData?.items.reduce(
    (sum, i) => sum + (i.auraReward ?? AURA_PER_ITEM_FALLBACK),
    0
  ) ?? 0;

  const countriesForMode = useMemo(
    () => (huntMode === 'location' ? countriesWithRooms.filter((c) => countryHasLocationHunt(c.id)) : countriesWithRooms),
    [huntMode, countriesWithRooms]
  );

  // --- Picker: hero, mode cards, country list, surprise me ---
  if (phase === 'picker') {
    return (
      <LinearGradient colors={[colors.base.cream, colors.primary.wisteriaFaded]} style={styles.container}>
        <FloatingParticles count={6} variant="sparkle" opacity={0.18} speed="slow" />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.pickerHero}>
            <View style={styles.pickerHeroIconWrap}>
              <Icon name="compass" size={36} color={colors.primary.wisteriaDark} />
            </View>
            <Heading level={1} style={styles.pickerHeroTitle}>{copy.treasureHunt.title}</Heading>
            <Caption style={styles.pickerHeroTagline}>
              {huntMode === 'room' ? copy.treasureHunt.taglineRoom : copy.treasureHunt.taglineLocation}
            </Caption>
          </View>
          <View style={styles.modeCardsRow}>
            <TouchableOpacity
              style={[styles.modeCard, huntMode === 'room' && styles.modeCardActive]}
              onPress={() => setHuntMode('room')}
              activeOpacity={0.85}
            >
              <View style={[styles.modeCardIconWrap, huntMode === 'room' && styles.modeCardIconWrapActive]}>
                <Icon name="home" size={28} color={huntMode === 'room' ? '#FFF' : colors.primary.wisteriaDark} />
              </View>
              <Text variant="body" style={[styles.modeCardLabel, huntMode === 'room' && styles.modeCardLabelActive]}>{copy.treasureHunt.modeRoom}</Text>
              <Caption style={[styles.modeCardDesc, huntMode !== 'room' && styles.modeCardDescInactive]} numberOfLines={2}>{copy.treasureHunt.modeRoomDesc}</Caption>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeCard, huntMode === 'location' && styles.modeCardActive]}
              onPress={() => setHuntMode('location')}
              activeOpacity={0.85}
            >
              <View style={[styles.modeCardIconWrap, huntMode === 'location' && styles.modeCardIconWrapActive]}>
                <Icon name="landmark" size={28} color={huntMode === 'location' ? '#FFF' : colors.primary.wisteriaDark} />
              </View>
              <Text variant="body" style={[styles.modeCardLabel, huntMode === 'location' && styles.modeCardLabelActive]}>{copy.treasureHunt.modeLocation}</Text>
              <Caption style={[styles.modeCardDesc, huntMode !== 'location' && styles.modeCardDescInactive]} numberOfLines={2}>{copy.treasureHunt.modeLocationDesc}</Caption>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerScroll} contentContainerStyle={styles.pickerScrollContent} showsVerticalScrollIndicator={false}>
            {countriesForMode.map((c) => {
              const progress = getTreasureHuntProgress(c.id);
              const roomCount = getRoomsForCountry(c.id).length;
              const progressLabel = huntMode === 'room'
                ? `${progress.completedRoomIds.length}/${roomCount} rooms`
                : `${progress.completedLocationIds?.length ?? 0} places`;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.countryPickCard, { borderLeftColor: c.accentColor }]}
                  onPress={() => startHuntInCountry(c.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagEmoji}>{c.flagEmoji}</Text>
                  </View>
                  <View style={styles.countryPickTextWrap}>
                    <Text variant="body" style={styles.countryPickName}>{c.name}</Text>
                    <Caption style={styles.countryPickProgress}>{progressLabel}</Caption>
                  </View>
                  <Icon name="chevronRight" size={20} color={colors.text.muted} />
                </TouchableOpacity>
              );
            })}
            {countriesForMode.length === 0 ? (
              <Text variant="body" color={colors.text.muted} style={{ textAlign: 'center', paddingVertical: spacing.lg }}>
                {copy.treasureHunt.noCountriesLocation}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.surpriseCard}
              onPress={() => {
                const c = countriesForMode[Math.floor(Math.random() * countriesForMode.length)];
                if (c) startHuntInCountry(c.id);
              }}
              activeOpacity={0.85}
              disabled={countriesForMode.length === 0}
            >
              <LinearGradient
                colors={[colors.reward.goldSoft + '40', colors.reward.peachLight + '60']}
                style={styles.surpriseCardGradient}
              >
                <Icon name="sparkles" size={32} color={colors.reward.gold} />
                <Text variant="body" style={styles.surpriseText}>{copy.treasureHunt.surpriseMe}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // --- Mission intro: adventure briefing before hunt starts ---
  if (phase === 'mission_intro' && country) {
    const isRoom = huntMode === 'room' && roomHuntData;
    const missionTitle = isRoom
      ? copy.treasureHunt.missionRoom.replace('{count}', String(roomHuntData!.items.length)).replace('{roomName}', roomHuntData!.room.name)
      : copy.treasureHunt.missionLocation.replace('{count}', String(locationRounds.length)).replace('{countryName}', country.name);
    return (
      <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={styles.container}>
        <FloatingParticles count={4} variant="sparkle" opacity={0.15} speed="slow" />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                setPhase('picker');
                setCountryId(null);
                setRoomHuntData(null);
                setLocationRounds([]);
              }}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.missionIntroWrap}>
            <Card style={styles.missionIntroCard}>
              <View style={[styles.missionIntroIconWrap, { backgroundColor: accentColor + '20' }]}>
                <Icon name="compass" size={48} color={accentColor} />
              </View>
              <Heading level={2} style={styles.missionIntroTitle}>Your mission</Heading>
              <Text variant="body" color={colors.text.secondary} style={styles.missionIntroText}>
                {missionTitle}
              </Text>
              <Button
                title={copy.treasureHunt.startHunt}
                onPress={() => setPhase(huntMode === 'room' ? 'room_hunt' : 'location_hunt')}
                variant="primary"
                size="lg"
                fullWidth
                style={styles.missionIntroButton}
              />
            </Card>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // --- Location complete: results + play again / pick country / back ---
  if (phase === 'location_complete' && country) {
    const locationTotalAura = locationFoundForSummary.reduce((s, x) => s + x.learningPoints, 0);
    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SparkleBurst />
        <FloatingParticles count={8} variant="sparkle" opacity={0.22} speed="slow" />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Animated.View entering={ZoomIn.delay(200).duration(400)}>
                  <Icon name="gift" size={64} color={colors.reward.gold} />
                </Animated.View>
                <Heading level={1} style={styles.resultsTitle}>{copy.treasureHunt.completeLocation}</Heading>
                <Text variant="body" color={colors.text.secondary} style={styles.resultsSubtitle}>
                  {copy.treasureHunt.completeSubtitleLocation.replace('{countryName}', country.name)}
                </Text>
                <View style={styles.resultsDivider} />
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Icon name="sparkles" size={20} color={colors.reward.gold} />
                    <Text variant="h3" color={colors.reward.amber}>+{locationTotalAura}</Text>
                    <Caption>Aura</Caption>
                  </View>
                </View>
                <View style={styles.foundItemsList}>
                  {locationFoundForSummary.map((item, i) => (
                    <Animated.View key={i} entering={FadeInUp.delay(300 + i * 100).duration(300)} style={[styles.foundListChip, styles.foundListChipWithThumb, { borderColor: accentColor + '40' }]}>
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={styles.foundItemThumb} resizeMode="cover" />
                      ) : (
                        <Icon name="landmark" size={18} color={accentColor} />
                      )}
                      <View style={styles.foundItemTextWrap}>
                        <Text variant="bodySmall" color={colors.text.secondary} numberOfLines={1} style={styles.foundItemLabel}>{item.name}</Text>
                        {item.description ? (
                          <Text variant="caption" color={colors.text.light} numberOfLines={1} style={styles.foundItemCaption}>{item.description}</Text>
                        ) : null}
                      </View>
                    </Animated.View>
                  ))}
                </View>
                <View style={styles.visbyLineWrap}>
                  <Text variant="body" style={styles.visbyLine}>
                    — Visby: "{getPostGameLine('TreasureHunt', 'won', getVisbyMood())}"
                  </Text>
                </View>
              </View>
            </Card>
            <Button title={copy.actions.playAgain} onPress={() => startHuntInCountry(countryId!)} variant="primary" size="lg" fullWidth />
            <Button title={copy.treasureHunt.pickAnotherCountry} onPress={() => { setPhase('picker'); setCountryId(null); setLocationRounds([]); }} variant="secondary" size="lg" fullWidth />
            <Button title={copy.treasureHunt.back} onPress={() => navigation.goBack()} variant="secondary" size="lg" fullWidth />
          </Animated.View>
        </SafeAreaView>
        {showCelebration && (
          <GameCelebration
            tier={getCelebrationTier(locationFoundForSummary.length, locationRounds.length)}
            score={locationFoundForSummary.length}
            maxScore={locationRounds.length}
            auraEarned={locationTotalAura}
            gameName="Treasure Hunt"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
      </LinearGradient>
    );
  }

  // --- Room complete: results + explore another room / pick country / back ---
  if (phase === 'complete' && country && roomHuntData) {
    const roomCount = getRoomsForCountry(country.id).length;
    const completedCount = getTreasureHuntProgress(country.id).completedRoomIds.length;
    const completionTitle =
      wrongTapCount === 0
        ? copy.treasureHunt.completeTitleFlawless
        : wrongTapCount <= 2
          ? copy.treasureHunt.completeTitleGreat
          : copy.treasureHunt.completeTitleExplored;
    const timePhrase =
      elapsedSeconds < 60
        ? `${copy.treasureHunt.completeTimeLightning} ${formatTime(elapsedSeconds)}`
        : copy.treasureHunt.completeTimePhrase.replace('{time}', formatTime(elapsedSeconds));
    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SparkleBurst />
        <FloatingParticles count={8} variant="sparkle" opacity={0.22} speed="slow" />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Animated.View entering={ZoomIn.delay(200).duration(400)}>
                  <Icon name="gift" size={64} color={colors.reward.gold} />
                </Animated.View>
                <Heading level={1} style={styles.resultsTitle}>{completionTitle}</Heading>
                <Text variant="body" color={colors.text.secondary} style={styles.resultsSubtitle}>
                  {copy.treasureHunt.completeSubtitleRoom.replace('{roomName}', roomHuntData.room.name).replace('{countryName}', country.name)} {timePhrase}
                </Text>
                {roomCount > 0 && (
                  <Caption style={styles.resultsExploredLine}>
                    You've explored {completedCount} of {roomCount} rooms in {country.name}.
                  </Caption>
                )}
                <View style={styles.resultsDivider} />
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Icon name="time" size={20} color={colors.calm.ocean} />
                    <Text variant="h3" color={colors.calm.ocean}>{formatTime(elapsedSeconds)}</Text>
                    <Caption>Time</Caption>
                  </View>
                  <View style={styles.statDividerVertical} />
                  <View style={styles.statItem}>
                    <Icon name="sparkles" size={20} color={colors.reward.gold} />
                    <Text variant="h3" color={colors.reward.amber}>+{totalAura}</Text>
                    <Caption>Aura</Caption>
                  </View>
                </View>
                <View style={styles.foundItemsList}>
                  {foundItemsForSummary.map((item, i) => (
                    <Animated.View
                      key={item.id}
                      entering={FadeInUp.delay(300 + i * 100).duration(300)}
                      style={[styles.foundListChip, styles.foundListChipWithThumb, { borderColor: accentColor + '40' }]}
                    >
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={styles.foundItemThumb} resizeMode="cover" />
                      ) : (
                        <Icon name={item.icon as IconName} size={18} color={accentColor} />
                      )}
                      <Text variant="bodySmall" color={colors.text.secondary} numberOfLines={1} style={styles.foundItemLabel}>{item.label}</Text>
                    </Animated.View>
                  ))}
                </View>
                <View style={styles.visbyLineWrap}>
                  <Text variant="body" style={styles.visbyLine}>
                    — Visby: "{getPostGameLine('TreasureHunt', 'won', getVisbyMood())}"
                  </Text>
                </View>
              </View>
            </Card>
            <Button title={copy.treasureHunt.exploreAnotherRoom} onPress={handleExploreAnotherRoom} variant="primary" size="lg" fullWidth />
            <Button title={copy.treasureHunt.pickAnotherCountry} onPress={() => { setPhase('picker'); setCountryId(null); setRoomHuntData(null); }} variant="secondary" size="lg" fullWidth />
            <Button title={copy.treasureHunt.back} onPress={() => navigation.goBack()} variant="secondary" size="lg" fullWidth />
          </Animated.View>
        </SafeAreaView>
        {showCelebration && (
          <GameCelebration
            tier={getCelebrationTier(foundItemsForSummary.length, roomHuntData.items.length)}
            score={foundItemsForSummary.length}
            maxScore={roomHuntData.items.length}
            auraEarned={totalAura}
            gameName="Treasure Hunt"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
      </LinearGradient>
    );
  }

  // --- Loading: preparing hunt ---
  const showRoomLoading = (phase === 'room_hunt' || phase === 'reveal') && !roomHuntData;
  const showLocationLoading = (phase === 'location_hunt' || phase === 'location_reveal') && locationRounds.length === 0;
  if (showRoomLoading || showLocationLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.base.cream, colors.primary.wisteriaFaded]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Heading level={2} style={styles.headerCenter}>{copy.treasureHunt.title}</Heading>
            <View style={{ width: 40 }} />
          </View>
          <LoadingView message={copy.treasureHunt.preparingHunt} />
        </SafeAreaView>
      </View>
    );
  }

  // --- Location hunt: clue, grid, reveal modal ---
  if (phase === 'location_hunt' || phase === 'location_reveal') {
    const locRound = locationRounds[locationRoundIndex];
    if (!locRound) return null;
    return (
      <>
        <View style={[styles.container, { backgroundColor: colors.base.cream }]}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
                <Icon name="chevronLeft" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Heading level={2}>Location Hunt</Heading>
                <Caption>{country?.name} · Round {locationRoundIndex + 1}/{locationRounds.length}</Caption>
              </View>
              <View style={{ width: 40 }} />
            </View>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.clueScrollWrap}>
              <View style={styles.clueScrollInner}>
                <Icon name="compass" size={18} color={accentColor} style={styles.clueScrollIcon} />
                <View style={styles.clueScrollTextWrap}>
                  <Caption style={styles.hintBarLabel}>Clue</Caption>
                  <Text variant="body" style={styles.clueText} accessibilityLabel={`Clue: ${locRound.clue}`}>{locRound.clue}</Text>
                </View>
              </View>
            </Animated.View>
            {wrongTapMessage ? (
              <View style={styles.wrongTapWrap}>
                <Text variant="bodySmall" color={colors.text.muted}>{wrongTapMessage}</Text>
              </View>
            ) : null}
            <View style={styles.locationGrid}>
              {locRound.options.map((loc) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.locationCard, { borderColor: accentColor + '30' }]}
                  onPress={() => handleLocationCardTap(loc.id)}
                  activeOpacity={0.9}
                  accessibilityLabel={`Location: ${loc.name}`}
                  accessibilityRole="button"
                >
                  <View style={styles.locationCardImageWrap}>
                    {loc.imageUrl ? (
                      <Image source={{ uri: loc.imageUrl }} style={styles.locationCardImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.locationCardImage, styles.locationCardPlaceholder]}>
                        <Icon name="landmark" size={40} color={colors.primary.wisteriaLight} />
                      </View>
                    )}
                    <View style={styles.locationCardCompassBadge}>
                      <Icon name="compass" size={14} color={colors.text.primary} />
                    </View>
                    <View style={styles.locationCardNameWrap}>
                      <Text variant="bodySmall" style={styles.locationCardName} numberOfLines={2}>{loc.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
        {phase === 'location_reveal' && locationReveal && (
          <TreasureRevealModal
            visible
            accentColor={accentColor}
            icon="landmark"
            imageUrl={locationReveal.imageUrl}
            title={locationReveal.name}
            description={locationReveal.description}
            auraReward={locationReveal.learningPoints}
            visbyLine={copy.treasureHunt.revealVisbyLine}
            primaryLabel={locationRoundIndex + 1 >= locationRounds.length ? copy.treasureHunt.revealFinish : copy.treasureHunt.revealNext}
            onPrimaryPress={handleLocationRevealNext}
            onOverlayPress={handleLocationRevealNext}
          />
        )}
      </>
    );
  }

  // --- Room hunt: immersive room stage, clue, treasure slots, reveal modal ---
  if (!roomHuntData) return null;
  const currentClue = roomHuntData.items[clueIndex];
  const room = roomHuntData.room;
  const huntItemIds = new Set(roomHuntData.items.map((i) => i.id));
  const foundIds = new Set(foundItemsForSummary.map((i) => i.id));
  const atmosphere = countryId ? getCountryAtmosphere(countryId) : null;
  const effectiveWallColor = room.wallColor;
  const effectiveFloorColor = room.floorColor;

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.base.cream }]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Heading level={2}>{room.name}</Heading>
              <Caption>{country?.name}</Caption>
            </View>
            <View style={styles.timerBadge}>
              <Icon name="time" size={16} color={colors.calm.ocean} />
              <Text variant="bodySmall" color={colors.calm.ocean} style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.duration(400)} style={styles.clueScrollWrap}>
            <View style={styles.clueScrollInner}>
              <Icon name="compass" size={18} color={accentColor} style={styles.clueScrollIcon} />
              <View style={styles.clueScrollTextWrap}>
                <Caption style={styles.hintBarLabel}>Clue</Caption>
                <Text variant="body" style={styles.clueText} accessibilityLabel={`Clue: ${currentClue?.clue}`}>{currentClue?.clue}</Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.treasureSlotsRow}>
            {Array.from({ length: roomHuntData.items.length }).map((_, i) => (
              <View key={i} style={styles.treasureSlotWrap}>
                <View style={[styles.treasureSlot, i < foundItemsForSummary.length ? styles.treasureSlotFilled : null, i < foundItemsForSummary.length ? { borderColor: accentColor, backgroundColor: accentColor + '20' } : null]}>
                  <Icon name={i < foundItemsForSummary.length ? 'gift' : 'giftOutline'} size={20} color={i < foundItemsForSummary.length ? accentColor : colors.text.light} />
                </View>
              </View>
            ))}
            <Caption style={styles.treasureSlotsCaption}>{foundItemsForSummary.length}/{roomHuntData.items.length}</Caption>
          </View>

          {wrongTapMessage ? (
            <View style={styles.wrongTapWrap}>
              <Text variant="bodySmall" color={colors.text.muted}>{wrongTapMessage}</Text>
            </View>
          ) : null}

          <View style={styles.roomContainer}>
            <View style={styles.roomStageFrame}>
              <FloatingParticles count={8} variant="sparkle" opacity={0.5} speed="slow" />
              {/* Window strip (sky) */}
              {atmosphere && (
                <LinearGradient
                  colors={[atmosphere.windowSky[0], atmosphere.windowSky[1], atmosphere.windowSky[2] ?? atmosphere.windowSky[1]]}
                  style={[styles.roomWindowStrip, { height: ROOM_STAGE_WINDOW_STRIP_HEIGHT }]}
                  locations={[0, 0.6, 1]}
                >
                  <View style={styles.roomWindowArch} />
                </LinearGradient>
              )}
              {/* Wall with depth gradient */}
              <LinearGradient
                colors={[
                  effectiveWallColor,
                  effectiveWallColor,
                  (accentColor) + '18',
                ]}
                style={[styles.roomWall, { height: ROOM_STAGE_WALL_HEIGHT - ROOM_STAGE_WINDOW_STRIP_HEIGHT }]}
                locations={[0, 0.7, 1]}
              >
                {room.roomImageUrl ? (
                  <Image
                    source={{ uri: room.roomImageUrl }}
                    style={styles.roomStageBgImage}
                    resizeMode="cover"
                  />
                ) : null}
                <View style={[styles.objectsLayer, { height: ROOM_STAGE_OBJECTS_LAYER_HEIGHT }]}>
                  {room.objects.map((obj) => {
                    const inHunt = huntItemIds.has(obj.id);
                    const found = foundIds.has(obj.id);
                    if (!inHunt) {
                      return (
                        <View
                          key={obj.id}
                          style={[styles.roomObjectDecor, { left: `${obj.x}%`, top: `${obj.y}%` }, { pointerEvents: 'none' }]}
                        >
                          <View style={styles.roomObjectIconWrapMuted}>
                            <Icon name={obj.icon as IconName} size={30} color={colors.text.light} />
                          </View>
                          <Text variant="caption" color={colors.text.light} style={styles.objectLabelMuted} numberOfLines={1}>{obj.label}</Text>
                        </View>
                      );
                    }
                    if (found) {
                      return (
                        <View key={obj.id} style={[styles.roomObjectFound, { left: `${obj.x}%`, top: `${obj.y}%` }, { pointerEvents: 'none' }]}>
                          <View style={[styles.roomObjectIconWrapFound, { borderColor: accentColor + '40' }]}>
                            <Icon name={obj.icon as IconName} size={22} color={accentColor} />
                          </View>
                          <Icon name="check" size={12} color={colors.success.emerald} style={styles.objectCheck} />
                          <Text variant="caption" color={colors.text.secondary} style={styles.foundLabelText}>{obj.label}</Text>
                        </View>
                      );
                    }
                    return (
                      <TouchableOpacity
                        key={obj.id}
                        onPress={() => handleObjectTap(obj.id)}
                        activeOpacity={0.8}
                        style={[styles.roomObjectMystery, { left: `${obj.x}%`, top: `${obj.y}%` }]}
                        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                        accessibilityLabel={`Find: ${obj.label}`}
                        accessibilityRole="button"
                      >
                        <RoomMysterySpot accentColor={accentColor} objId={obj.id} wrongTapTargetId={wrongTapTargetId} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </LinearGradient>
              {/* Baseboard */}
              <View style={[styles.roomBaseboard, { backgroundColor: effectiveFloorColor }]} />
              {/* Floor */}
              <LinearGradient
                colors={[effectiveFloorColor, effectiveFloorColor, accentColor + '08']}
                style={styles.roomFloor}
                locations={[0, 0.6, 1]}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {phase === 'reveal' && revealItem && (
        <TreasureRevealModal
          visible
          accentColor={accentColor}
          icon={revealItem.imageUrl ? undefined : (revealItem.icon as IconName)}
          imageUrl={revealItem.imageUrl}
          title={revealItem.learnTitle ?? revealItem.label}
          description={revealItem.learnContent ?? undefined}
          auraReward={revealItem.auraReward}
          visbyLine={copy.treasureHunt.revealVisbyLine}
          primaryLabel={copy.treasureHunt.revealNext}
          onPrimaryPress={handleRevealNext}
          onOverlayPress={handleRevealNext}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: spacing.radius.round,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  timerText: {
    fontFamily: 'Nunito-Bold',
    minWidth: 36,
  },
  hintBar: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  clueScrollWrap: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    borderRadius: spacing.radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: colors.base.parchment,
    overflow: 'hidden',
  },
  clueScrollInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
  },
  clueScrollIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  clueScrollTextWrap: {
    flex: 1,
  },
  hintBarLabel: {
    marginBottom: spacing.xs,
  },
  hintItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hintItem: {
    alignItems: 'center',
    flex: 1,
  },
  hintCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: spacing.xxs,
  },
  hintItemName: {
    fontSize: 9,
    fontFamily: 'Nunito-Regular',
    maxWidth: 56,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: spacing.radius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: spacing.radius.round,
  },
  treasureSlotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  treasureSlotWrap: {
    alignItems: 'center',
  },
  treasureSlot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.text.light,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treasureSlotFilled: {},
  treasureSlotsCaption: {
    marginLeft: spacing.sm,
    fontFamily: 'Nunito-Bold',
  },
  roomContainer: {
    flex: 1,
    paddingHorizontal: ROOM_HORIZONTAL_PADDING,
    paddingBottom: spacing.lg,
  },
  roomStageFrame: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: ROOM_STAGE_WALL_HEIGHT + 6 + ROOM_STAGE_FLOOR_HEIGHT,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  roomWindowStrip: {
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  roomWindowArch: {
    width: '70%',
    height: 12,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  roomWall: {
    paddingTop: spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  roomStageBgImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22,
  },
  objectsLayer: {
    position: 'relative',
    marginTop: spacing.xs,
  },
  roomObjectDecor: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -20 }],
  },
  roomObjectIconWrapMuted: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  objectLabelMuted: {
    fontFamily: 'Nunito-Regular',
    fontSize: 9,
    color: colors.text.light,
    maxWidth: 56,
    textAlign: 'center',
  },
  roomObjectFound: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -20 }],
  },
  roomObjectIconWrapFound: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    borderWidth: 2,
  },
  objectCheck: {
    position: 'absolute',
    top: -2,
    right: -4,
  },
  roomObjectMystery: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -28 }, { translateY: -28 }],
  },
  mysterySpotOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mysterySpotInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomBaseboard: {
    height: 6,
    width: '100%',
  },
  roomFloor: {
    height: ROOM_STAGE_FLOOR_HEIGHT,
    width: '100%',
  },
  room: {
    flex: 1,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  roomBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: spacing.radius.xl,
    borderWidth: 2,
    zIndex: 0,
  },
  decorItem: {
    position: 'absolute',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    zIndex: 1,
  },
  hiddenItem: {
    position: 'absolute',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    alignItems: 'center',
    zIndex: 10,
  },
  hiddenItemInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.3,
  },
  foundLabel: {
    position: 'absolute',
    bottom: -16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
  },
  foundLabelText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 9,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.lg,
  },
  resultsCard: {
    paddingVertical: spacing.xxxl,
  },
  resultsContent: {
    alignItems: 'center',
  },
  visbyLineWrap: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  visbyLine: {
    fontStyle: 'italic',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  resultsTitle: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultsSubtitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  resultsExploredLine: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.text.muted,
  },
  resultsDivider: {
    width: 80,
    height: 2,
    backgroundColor: colors.primary.wisteriaLight,
    marginVertical: spacing.md,
    borderRadius: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statDividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: colors.text.light,
  },
  foundItemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  foundListChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
    borderWidth: 1,
  },
  foundListChipWithThumb: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  foundItemThumb: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  foundItemLabel: {
  },
  foundItemTextWrap: {
    flex: 1,
    maxWidth: 140,
  },
  foundItemCaption: {
    fontSize: 10,
    marginTop: 1,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerScrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  countryPickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: spacing.md,
    borderRadius: spacing.radius.lg,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  flagCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  flagEmoji: {
    fontSize: 24,
  },
  countryPickName: {
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
  },
  surpriseCard: {
    marginTop: spacing.sm,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  surpriseCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  surpriseText: {
    fontFamily: 'Nunito-Bold',
    color: colors.reward.amber,
  },
  revealOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  revealCardWrap: {
    width: SCREEN_WIDTH - spacing.screenPadding * 2,
    maxWidth: '100%',
  },
  revealCard: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    maxWidth: '100%',
    width: SCREEN_WIDTH - spacing.screenPadding * 2,
  },
  revealIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  revealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  revealTitle: {
    textAlign: 'center',
  },
  revealContent: {
    textAlign: 'center',
    lineHeight: 22,
  },
  revealVisbyLine: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontFamily: 'Nunito-Regular',
    color: colors.primary.wisteriaDark,
  },
  wrongTapWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  clueText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
  },
  pickerHero: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  pickerHeroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  pickerHeroTitle: {
    textAlign: 'center',
    marginBottom: spacing.xxs,
  },
  pickerHeroTagline: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  modeCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  modeCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  modeCardActive: {
    borderColor: colors.primary.wisteria,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  modeCardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.wisteriaLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modeCardIconWrapActive: {
    backgroundColor: colors.primary.wisteria,
  },
  modeCardLabel: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  modeCardLabelActive: {
    color: colors.primary.wisteriaDark,
  },
  modeCardDesc: {
    textAlign: 'center',
    fontSize: 11,
  },
  modeCardDescInactive: {
    color: colors.text.muted,
  },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  modeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.lg,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  modeToggleBtnActive: {
    backgroundColor: colors.primary.wisteria,
  },
  countryPickTextWrap: {
    flex: 1,
  },
  countryPickProgress: {
    marginTop: 2,
    color: colors.text.muted,
  },
  missionIntroWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  missionIntroCard: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  missionIntroIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  missionIntroTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  missionIntroText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  missionIntroButton: {
    marginTop: spacing.sm,
  },
  locationGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.screenPadding,
    gap: spacing.sm,
  },
  locationCard: {
    width: (SCREEN_WIDTH - spacing.screenPadding * 2 - spacing.sm) / 2,
    aspectRatio: 0.85,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  locationCardImageWrap: {
    flex: 1,
    position: 'relative',
  },
  locationCardCompassBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCardImage: {
    width: '100%',
    height: '100%',
  },
  locationCardPlaceholder: {
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCardNameWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  locationCardName: {
    color: '#FFF',
    fontFamily: 'Nunito-SemiBold',
  },
  revealLocationImage: {
    width: '100%',
    height: 160,
    borderRadius: spacing.radius.lg,
    marginBottom: spacing.md,
  },
  revealAuraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});

/** Short burst of sparkles radiating from center when reveal opens */
function SparkleBurst() {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 650 });
  }, []);
  const angles = useMemo(() => Array.from({ length: 12 }, (_, i) => (i * 360) / 12), []);
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      {angles.map((angleDeg, i) => {
        const angle = (angleDeg * Math.PI) / 180;
        return (
          <SparkleParticle key={i} angle={angle} progress={progress} />
        );
      })}
    </View>
  );
}

function SparkleParticle({ angle, progress }: { angle: number; progress: import('react-native-reanimated').SharedValue<number> }) {
  const animStyle = useAnimatedStyle(() => {
    'worklet';
    const d = progress.value * 100;
    return {
      opacity: 1 - progress.value,
      transform: [
        { translateX: Math.cos(angle) * d },
        { translateY: Math.sin(angle) * d },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: 5,
          backgroundColor: colors.reward.gold,
        },
        animStyle,
      ]}
    />
  );
}

/** Shared reveal modal for room item or location: icon/image, title, description, aura, optional Visby line, primary button */
function TreasureRevealModal(props: {
  visible: boolean;
  accentColor: string;
  icon?: IconName;
  imageUrl?: string;
  title: string;
  description?: string;
  auraReward?: number;
  visbyLine?: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  onOverlayPress?: () => void;
}) {
  const { visible, accentColor, icon, imageUrl, title, description, auraReward, visbyLine, primaryLabel, onPrimaryPress, onOverlayPress } = props;
  if (!visible) return null;
  return (
    <Modal visible transparent animationType="fade">
      <Pressable style={styles.revealOverlay} onPress={onOverlayPress ?? onPrimaryPress}>
        <SparkleBurst />
        <Animated.View entering={ZoomIn.duration(350).springify()} style={styles.revealCardWrap}>
          <Pressable style={styles.revealCard} onPress={(e) => e.stopPropagation()}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.revealLocationImage} resizeMode="cover" />
            ) : icon ? (
              <View style={[styles.revealIconWrap, { backgroundColor: accentColor + '20' }]}>
                <Icon name={icon} size={48} color={accentColor} />
              </View>
            ) : null}
            <View style={styles.revealTitleRow}>
              <Heading level={3} style={styles.revealTitle}>{title}</Heading>
              <SpeakerButton text={description ? `${title}. ${description}` : title} size={18} compact />
            </View>
            {description ? (
              <Text variant="body" color={colors.text.secondary} style={styles.revealContent}>{description}</Text>
            ) : null}
            {visbyLine ? (
              <Text variant="bodySmall" color={colors.primary.wisteriaDark} style={styles.revealVisbyLine}>
                — Visby: "{visbyLine}"
              </Text>
            ) : null}
            {auraReward != null && auraReward > 0 ? (
              <View style={styles.revealAuraRow}>
                <Icon name="sparkles" size={18} color={colors.reward.gold} />
                <Text variant="bodySmall" style={{ color: colors.reward.amber, fontFamily: 'Nunito-SemiBold' }}>+{auraReward} Aura</Text>
              </View>
            ) : null}
            <Button title={primaryLabel} onPress={onPrimaryPress} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.md }} />
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default TreasureHuntScreen;
