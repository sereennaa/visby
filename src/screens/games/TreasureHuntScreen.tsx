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
import * as Haptics from 'expo-haptics';
import { useStore } from '../../store/useStore';
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { RootStackParamList } from '../../types';
import { COUNTRIES } from '../../config/constants';
import {
  getRoomsForCountry,
  getRandomRoomForCountry,
  getRoomHuntForPlay,
  getLocationHuntRound,
  countryHasLocationHunt,
  type RoomHuntItem,
  type LocationHuntRound,
} from '../../config/treasureHunt';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ROOM_HORIZONTAL_PADDING = spacing.screenPadding;
const AURA_PER_ITEM_FALLBACK = 8;

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

type TreasureHuntScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TreasureHunt'>;
  route: RouteProp<RootStackParamList, 'TreasureHunt'>;
};

type GamePhase = 'picker' | 'room_hunt' | 'reveal' | 'complete' | 'location_hunt' | 'location_reveal' | 'location_complete';
type HuntMode = 'room' | 'location';

export const TreasureHuntScreen: React.FC<TreasureHuntScreenProps> = ({ navigation, route }) => {
  const initialCountryId = route.params?.countryId ?? null;
  const {
    addAura,
    playWithVisby,
    incrementGameStat,
    addSkillPoints,
    checkDailyMissionCompletion,
    getTreasureHuntProgress,
    completeTreasureHuntRoom,
    completeTreasureHuntLocation,
  } = useStore();

  const countriesWithRooms = useMemo(() => getCountriesWithRooms(), []);

  const [huntMode, setHuntMode] = useState<HuntMode>('room');
  const [phase, setPhase] = useState<GamePhase>(initialCountryId ? 'room_hunt' : 'picker');
  const [countryId, setCountryId] = useState<string | null>(initialCountryId);
  const [roomHuntData, setRoomHuntData] = useState<{
    room: { id: string; name: string; wallColor: string; floorColor: string; objects: { id: string; label: string; icon: string; x: number; y: number }[] };
    items: RoomHuntItem[];
  } | null>(null);
  const [clueIndex, setClueIndex] = useState(0);
  const [wrongTapMessage, setWrongTapMessage] = useState<string | null>(null);
  const [revealItem, setRevealItem] = useState<RoomHuntItem | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [foundItemsForSummary, setFoundItemsForSummary] = useState<RoomHuntItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [locationRounds, setLocationRounds] = useState<LocationHuntRound[]>([]);
  const [locationRoundIndex, setLocationRoundIndex] = useState(0);
  const [locationFoundForSummary, setLocationFoundForSummary] = useState<{ name: string; learningPoints: number }[]>([]);
  const [locationReveal, setLocationReveal] = useState<LocationHuntRound['target'] | null>(null);

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
        setPhase('location_hunt');
      } else {
        const progress = getTreasureHuntProgress(cid);
        const room = getRandomRoomForCountry(cid, progress.completedRoomIds);
        if (!room) return;
        const hunt = getRoomHuntForPlay(cid, room.id, 5);
        if (!hunt) return;
        setRoomHuntData({ room, items: hunt.items });
        setClueIndex(0);
        setRevealItem(null);
        setFoundItemsForSummary([]);
        setPhase('room_hunt');
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
        setFoundItemsForSummary((prev) => [...prev, currentTarget]);
        setRevealItem(currentTarget);
        setPhase('reveal');
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        setWrongTapMessage('Not this one — try the clue again');
        setTimeout(() => setWrongTapMessage(null), 1500);
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
      const totalAura = roomHuntData.items.reduce(
        (sum, i) => sum + (i.auraReward ?? AURA_PER_ITEM_FALLBACK),
        0
      );
      setPhase('complete');
      addAura(totalAura);
      const bonus = getGameOfTheDayBonusAura('TreasureHunt');
      if (bonus > 0) addAura(bonus);
      playWithVisby();
      incrementGameStat('gamesPlayed');
      checkDailyMissionCompletion?.('play_minigame', 1);
      incrementGameStat('treasureHuntsCompleted');
      addSkillPoints('exploration', 3);
      if (countryId) completeTreasureHuntRoom(countryId, roomHuntData.room.id);
    } else {
      setClueIndex((i) => i + 1);
      setPhase('room_hunt');
    }
  }, [roomHuntData, clueIndex, countryId, addAura, playWithVisby, incrementGameStat, addSkillPoints, completeTreasureHuntRoom, checkDailyMissionCompletion]);

  const handleLocationCardTap = useCallback(
    (locationId: string) => {
      if (locationRounds.length === 0 || phase !== 'location_hunt') return;
      const round = locationRounds[locationRoundIndex];
      if (!round) return;
      if (locationId === round.target.id) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        setLocationFoundForSummary((prev) => [...prev, { name: round.target.name, learningPoints: round.target.learningPoints }]);
        addAura(round.target.learningPoints);
        if (countryId) completeTreasureHuntLocation(countryId, round.target.id);
        setLocationReveal(round.target);
        setPhase('location_reveal');
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        setWrongTapMessage('Not this one — try the clue again');
        setTimeout(() => setWrongTapMessage(null), 1500);
      }
    },
    [locationRounds, locationRoundIndex, countryId, addAura, completeTreasureHuntLocation, phase]
  );

  const handleLocationRevealNext = useCallback(() => {
    setLocationReveal(null);
    if (locationRoundIndex + 1 >= locationRounds.length) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setPhase('location_complete');
      const bonus = getGameOfTheDayBonusAura('TreasureHunt');
      if (bonus > 0) addAura(bonus);
      playWithVisby();
      incrementGameStat('gamesPlayed');
      checkDailyMissionCompletion?.('play_minigame', 1);
      incrementGameStat('treasureHuntsCompleted');
      addSkillPoints('exploration', 3);
    } else {
      setLocationRoundIndex((i) => i + 1);
      setPhase('location_hunt');
    }
  }, [locationRoundIndex, locationRounds.length, playWithVisby, incrementGameStat, addSkillPoints, checkDailyMissionCompletion]);

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
    setRevealItem(null);
    setFoundItemsForSummary([]);
    setElapsedSeconds(0);
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

  if (phase === 'picker') {
    return (
      <LinearGradient colors={[colors.base.cream, colors.primary.wisteriaFaded]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Heading level={2} style={styles.headerCenter}>Treasure Hunt</Heading>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeToggleBtn, huntMode === 'room' && styles.modeToggleBtnActive]}
              onPress={() => setHuntMode('room')}
            >
              <Icon name="home" size={20} color={huntMode === 'room' ? '#FFF' : colors.text.secondary} />
              <Text variant="bodySmall" style={{ color: huntMode === 'room' ? '#FFF' : colors.text.secondary, fontFamily: 'Nunito-SemiBold' }}>Room Hunt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeToggleBtn, huntMode === 'location' && styles.modeToggleBtnActive]}
              onPress={() => setHuntMode('location')}
            >
              <Icon name="landmark" size={20} color={huntMode === 'location' ? '#FFF' : colors.text.secondary} />
              <Text variant="bodySmall" style={{ color: huntMode === 'location' ? '#FFF' : colors.text.secondary, fontFamily: 'Nunito-SemiBold' }}>Location Hunt</Text>
            </TouchableOpacity>
          </View>
          <Caption style={{ paddingHorizontal: spacing.screenPadding, marginBottom: spacing.md }}>
            {huntMode === 'room' ? 'Find items in a room using clues!' : 'Match the clue to the right place — real photos from the country.'}
          </Caption>
          <ScrollView style={styles.pickerScroll} contentContainerStyle={styles.pickerScrollContent} showsVerticalScrollIndicator={false}>
            {countriesForMode.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.countryPickCard, { borderLeftColor: c.accentColor }]}
                onPress={() => startHuntInCountry(c.id)}
                activeOpacity={0.8}
              >
                <View style={styles.flagCircle}>
                  <Text style={styles.flagEmoji}>{c.flagEmoji}</Text>
                </View>
                <Text variant="body" style={styles.countryPickName}>{c.name}</Text>
                <Icon name="chevronRight" size={20} color={colors.text.muted} />
              </TouchableOpacity>
            ))}
            {countriesForMode.length === 0 ? (
              <Text variant="body" color={colors.text.muted} style={{ textAlign: 'center', paddingVertical: spacing.lg }}>
                No countries with enough locations for this mode. Try Room Hunt!
              </Text>
            ) : null}
            <TouchableOpacity
              style={[styles.countryPickCard, styles.surpriseCard]}
              onPress={() => {
                const c = countriesForMode[Math.floor(Math.random() * countriesForMode.length)];
                if (c) startHuntInCountry(c.id);
              }}
              activeOpacity={0.8}
              disabled={countriesForMode.length === 0}
            >
              <Icon name="sparkles" size={28} color={colors.reward.gold} />
              <Text variant="body" style={styles.surpriseText}>Surprise me</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (phase === 'location_complete' && country) {
    const locationTotalAura = locationFoundForSummary.reduce((s, x) => s + x.learningPoints, 0);
    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Animated.View entering={ZoomIn.delay(200).duration(400)}>
                  <Icon name="trophy" size={64} color={colors.reward.gold} />
                </Animated.View>
                <Heading level={1} style={styles.resultsTitle}>All Found!</Heading>
                <Text variant="body" color={colors.text.secondary} style={styles.resultsSubtitle}>
                  You matched every place in {country.name}
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
                    <Animated.View key={i} entering={FadeInUp.delay(300 + i * 100).duration(300)} style={[styles.foundListChip, { borderColor: accentColor + '40' }]}>
                      <Icon name="landmark" size={14} color={accentColor} />
                      <Text variant="bodySmall" color={colors.text.secondary}>{item.name}</Text>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </Card>
            <Button title="Play Again" onPress={() => startHuntInCountry(countryId!)} variant="primary" size="lg" fullWidth />
            <Button title="Pick Another Country" onPress={() => { setPhase('picker'); setCountryId(null); setLocationRounds([]); }} variant="secondary" size="lg" fullWidth />
            <Button title="Back" onPress={() => navigation.goBack()} variant="secondary" size="lg" fullWidth />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (phase === 'complete' && country && roomHuntData) {
    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Animated.View entering={ZoomIn.delay(200).duration(400)}>
                  <Icon name="trophy" size={64} color={colors.reward.gold} />
                </Animated.View>
                <Heading level={1} style={styles.resultsTitle}>All Found!</Heading>
                <Text variant="body" color={colors.text.secondary} style={styles.resultsSubtitle}>
                  You explored {roomHuntData.room.name} in {country.name} and found every treasure
                </Text>
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
                      style={[styles.foundListChip, { borderColor: accentColor + '40' }]}
                    >
                      <Icon name={item.icon as IconName} size={14} color={accentColor} />
                      <Text variant="bodySmall" color={colors.text.secondary}>{item.label}</Text>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </Card>
            <Button title="Explore Another Room" onPress={handleExploreAnotherRoom} variant="primary" size="lg" fullWidth />
            <Button title="Pick Another Country" onPress={() => { setPhase('picker'); setCountryId(null); setRoomHuntData(null); }} variant="secondary" size="lg" fullWidth />
            <Button title="Back" onPress={() => navigation.goBack()} variant="secondary" size="lg" fullWidth />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const showRoomLoading = (phase === 'room_hunt' || phase === 'reveal') && !roomHuntData;
  const showLocationLoading = (phase === 'location_hunt' || phase === 'location_reveal') && locationRounds.length === 0;
  if (showRoomLoading || showLocationLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Heading level={2} style={styles.headerCenter}>Loading…</Heading>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
            <Animated.View entering={FadeInDown.duration(400)} style={styles.hintBar}>
              <Caption style={styles.hintBarLabel}>Clue:</Caption>
              <Text variant="body" style={styles.clueText} accessibilityLabel={`Clue: ${locRound.clue}`}>{locRound.clue}</Text>
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
                  style={styles.locationCard}
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
          <Modal visible transparent animationType="fade">
            <Pressable style={styles.revealOverlay} onPress={handleLocationRevealNext}>
              <Pressable style={styles.revealCard} onPress={(e) => e.stopPropagation()}>
                {locationReveal.imageUrl ? (
                  <Image source={{ uri: locationReveal.imageUrl }} style={styles.revealLocationImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.revealIconWrap, { backgroundColor: accentColor + '20' }]}>
                    <Icon name="landmark" size={48} color={accentColor} />
                  </View>
                )}
                <Heading level={3} style={styles.revealTitle}>{locationReveal.name}</Heading>
                <Text variant="body" color={colors.text.secondary} style={styles.revealContent}>{locationReveal.description}</Text>
                <View style={styles.revealAuraRow}>
                  <Icon name="sparkles" size={18} color={colors.reward.gold} />
                  <Text variant="bodySmall" style={{ color: colors.reward.amber, fontFamily: 'Nunito-SemiBold' }}>+{locationReveal.learningPoints} Aura</Text>
                </View>
                <Button title={locationRoundIndex + 1 >= locationRounds.length ? 'Finish' : 'Next round'} onPress={handleLocationRevealNext} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.md }} />
              </Pressable>
            </Pressable>
          </Modal>
        )}
      </>
    );
  }

  const currentClue = roomHuntData.items[clueIndex];
  const room = roomHuntData.room;

  return (
    <>
      <View style={[styles.container, { backgroundColor: roomBgColor }]}>
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

          <Animated.View entering={FadeInDown.duration(400)} style={styles.hintBar}>
            <Caption style={styles.hintBarLabel}>Clue:</Caption>
            <Text variant="body" style={styles.clueText} accessibilityLabel={`Clue: ${currentClue?.clue}`}>{currentClue?.clue}</Text>
          </Animated.View>

          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View
                style={[styles.progressBarFill, { width: `${(foundItemsForSummary.length / roomHuntData.items.length) * 100}%`, backgroundColor: accentColor }]}
              />
            </View>
            <Caption>{foundItemsForSummary.length}/{roomHuntData.items.length}</Caption>
          </View>

          {wrongTapMessage ? (
            <View style={styles.wrongTapWrap}>
              <Text variant="bodySmall" color={colors.text.muted}>{wrongTapMessage}</Text>
            </View>
          ) : null}

          <View style={styles.roomContainer}>
            <View style={[styles.room, { backgroundColor: roomBgColor }]}>
              <View style={[styles.roomBorder, { borderColor: accentColor + '30' }]} />
              {room.objects.map((obj) => (
                <TouchableOpacity
                  key={obj.id}
                  onPress={() => handleObjectTap(obj.id)}
                  activeOpacity={0.8}
                  style={[styles.hiddenItem, { left: `${obj.x}%`, top: `${obj.y}%` }]}
                  accessibilityLabel={`Object: ${obj.label}`}
                  accessibilityRole="button"
                >
                  <View style={[styles.hiddenItemInner, { backgroundColor: accentColor + '18', borderColor: accentColor + '40', borderWidth: 1.5 }]}>
                    <Icon name={obj.icon as IconName} size={22} color={accentColor} />
                  </View>
                  <Text variant="caption" color={colors.text.secondary} style={styles.foundLabelText}>{obj.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </View>

      {phase === 'reveal' && revealItem && (
        <Modal visible transparent animationType="fade">
          <Pressable style={styles.revealOverlay} onPress={handleRevealNext}>
            <Pressable style={styles.revealCard} onPress={(e) => e.stopPropagation()}>
              <View style={[styles.revealIconWrap, { backgroundColor: accentColor + '20' }]}>
                <Icon name={revealItem.icon as IconName} size={48} color={accentColor} />
              </View>
              <Heading level={3} style={styles.revealTitle}>{revealItem.learnTitle ?? revealItem.label}</Heading>
              {revealItem.learnContent ? (
                <Text variant="body" color={colors.text.secondary} style={styles.revealContent}>{revealItem.learnContent}</Text>
              ) : null}
              <Button title="Next" onPress={handleRevealNext} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.md }} />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

/**
 * Darkens a hex color to make hidden items slightly visible but camouflaged.
 * `factor` 0 = fully transparent, 1 = fully opaque difference.
 */
function blendWithBg(hexBg: string, factor: number): string {
  const r = parseInt(hexBg.slice(1, 3), 16);
  const g = parseInt(hexBg.slice(3, 5), 16);
  const b = parseInt(hexBg.slice(5, 7), 16);
  const darken = (c: number) => Math.round(c * (1 - factor * 0.5));
  return `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`;
}

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
  roomContainer: {
    flex: 1,
    paddingHorizontal: ROOM_HORIZONTAL_PADDING,
    paddingBottom: spacing.lg,
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
  resultsTitle: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultsSubtitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
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
    borderLeftColor: colors.reward.gold,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  surpriseText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.reward.amber,
  },
  revealOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
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
  revealTitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  revealContent: {
    textAlign: 'center',
    lineHeight: 22,
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
    backgroundColor: 'rgba(0,0,0,0.06)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  locationCardImageWrap: {
    flex: 1,
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

export default TreasureHuntScreen;
