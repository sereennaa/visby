import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LevelProgress } from '../../components/ui/ProgressBar';
import { AuraBadge, LevelBadge } from '../../components/ui/Badge';
import { Icon, IconName, IconBadge } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { VisbyCheckInModal } from '../../components/visby/VisbyCheckInModal';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { copy } from '../../config/copy';
import { PulseGlow, MagicBorder } from '../../components/effects/Shimmer';
import { useStore, getGrowthStage } from '../../store/useStore';
import { LEVEL_THRESHOLDS, COUNTRIES } from '../../config/constants';
import { RootStackParamList, VisbyNeeds, VisbyGrowthStage } from '../../types';
import { DEFAULT_HOME_ROOM, HOME_ATMOSPHERE } from '../../config/homeRoom';
import { getCountryAtmosphere } from '../../config/countryAtmosphere';
import { COUNTRY_HOUSES } from '../../config/countryRooms';
import { FURNITURE_CATALOG } from '../../config/furniture';
import { FurnitureVisual } from '../../components/furniture/FurnitureVisual';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;

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

const HOME_ROOM_WINDOW_H = 40;
const HOME_ROOM_WALL_H = 140;
const HOME_ROOM_FLOOR_H = 100;
const HOME_VISBY_SIZE = 88;

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
  const { user, visby, currentLocation, userHouses, dailyCheckIn, getStreakMultiplier, updateVisbyNeeds, getVisbyNeeds, getVisbyMood, getGrowthStage, shouldShowVisbyCheckIn, getDailyMission, dailyMissionCompletedAt, dailyMissionProgress, trySurprise, pendingStreakFreezeOffer, useStreakFreeze, declineStreakFreezeOffer, streakFreezesRemaining, storyBeatsShown, markStoryBeatShown, getAdventureOfTheDay, awardAdventureIfCompleted, settings } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [careHint, setCareHint] = React.useState<typeof NEED_CONFIG[number] | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState(0);
  const [showVisbyCheckIn, setShowVisbyCheckIn] = useState(false);
  const [showSurpriseBonus, setShowSurpriseBonus] = useState(false);
  const [surpriseAura, setSurpriseAura] = useState(0);
  const [showStoryBeat, setShowStoryBeat] = useState(false);

  const dailyMission = getDailyMission();
  const showFirstCountryBeat = (user?.countriesVisited ?? 0) >= 1 && !storyBeatsShown.includes('first_country');

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
    if (shouldShowVisbyCheckIn()) {
      const t = setTimeout(() => setShowVisbyCheckIn(true), 700);
      return () => clearTimeout(t);
    }
    const surprise = trySurprise();
    if (surprise.granted && surprise.aura) {
      setSurpriseAura(surprise.aura);
      setShowSurpriseBonus(true);
    }
    if (showFirstCountryBeat) setShowStoryBeat(true);
    awardAdventureIfCompleted();
  }, [showFirstCountryBeat, awardAdventureIfCompleted]);

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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        const { stampsService } = await import('../../services/stamps');
        const { bitesService } = await import('../../services/bites');
        const [freshStamps, freshBites] = await Promise.all([
          stampsService.getUserStamps(user.id),
          bitesService.getUserBites(user.id),
        ]);
        useStore.getState().setStamps(freshStamps);
        useStore.getState().setBites(freshBites);
      }
    } catch (e) {
      if (__DEV__) console.error('Refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Sweet dreams';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Goodnight';
  };

  const getCurrentLevel = () => {
    const aura = user?.aura || 0;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (aura >= LEVEL_THRESHOLDS[i].aura) return LEVEL_THRESHOLDS[i];
    }
    return LEVEL_THRESHOLDS[0];
  };

  const getNextLevel = () => {
    const level = user?.level || 1;
    return LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)];
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const currentAura = user?.aura || 0;
  const progressAura = currentAura - currentLevel.aura;
  const requiredAura = Math.max(1, nextLevel.aura - currentLevel.aura);

  const defaultAppearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const openCareHintForMood = (mood: string) => {
    const needKey = MOOD_TO_NEED_KEY[mood];
    if (needKey) {
      const need = NEED_CONFIG.find((n) => n.key === needKey);
      if (need) setCareHint(need);
    }
  };

  return (
    <View style={styles.container}>
      {/* Layered gradient background */}
      <LinearGradient
        colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight, colors.reward.peachLight, colors.base.cream]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      <FloatingParticles
        count={(settings as { quieterMode?: boolean }).quieterMode ? 2 : 6}
        variant="sparkle"
        opacity={(settings as { quieterMode?: boolean }).quieterMode ? 0.12 : 0.3}
        speed="slow"
      />

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
                {getGreeting()}, {user?.username || 'Explorer'}
              </Text>
              <Heading level={1} style={styles.titleText}>
                {currentLevel.title}
              </Heading>
              <Caption style={styles.dashboardCaption}>
                Your home base — learn, play, and see what&apos;s new.
              </Caption>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AuraStore')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="View Aura Store"
            >
              <PulseGlow color="rgba(255, 215, 0, 0.35)" intensity={14} speed={3000}>
                <AuraBadge amount={currentAura} />
              </PulseGlow>
            </TouchableOpacity>
          </Animated.View>

          {/* ──── HOME ROOM: Visby in their space (Club Penguin / Sims style) ──── */}
          {(() => {
            const firstHouse = userHouses[0];
            const homeCountryId = firstHouse?.countryId ?? null;
            const houseData = homeCountryId ? COUNTRY_HOUSES[homeCountryId] : null;
            const homeRoom = houseData?.rooms?.[0] ?? DEFAULT_HOME_ROOM;
            const roomCustomization = firstHouse?.roomCustomizations?.[homeRoom.id];
            const placedItems = roomCustomization?.placedFurniture ?? [];
            const effectiveWallColor = roomCustomization?.wallColor || homeRoom.wallColor;
            const effectiveFloorColor = roomCustomization?.floorColor || homeRoom.floorColor;
            const atmosphere = homeCountryId ? getCountryAtmosphere(homeCountryId) : { windowSky: HOME_ATMOSPHERE.windowSky };
            const currentMood = getVisbyMood?.() ?? visby?.currentMood ?? 'happy';
            const moodInfo = MOOD_LABELS[currentMood] ?? MOOD_LABELS.happy;
            return (
              <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.homeRoomWrap}>
                <View style={styles.homeRoomFrame}>
                  <LinearGradient
                    colors={[...atmosphere.windowSky]}
                    style={[styles.homeRoomWindow, { height: HOME_ROOM_WINDOW_H }]}
                    locations={[0, 0.6, 1]}
                  />
                  <LinearGradient
                    colors={[effectiveWallColor, effectiveWallColor, (COUNTRIES.find(c => c.id === homeCountryId)?.accentColor ?? colors.primary.wisteria) + '18']}
                    style={[styles.homeRoomWall, { height: HOME_ROOM_WALL_H }]}
                    locations={[0, 0.7, 1]}
                  >
                    <View style={styles.homeRoomObjectsLayer}>
                      {homeRoom.objects.slice(0, 4).map((obj) => (
                        <View key={obj.id} style={[styles.homeRoomDecor, { left: `${obj.x}%`, top: `${obj.y}%` }]}>
                          <View style={styles.homeRoomDecorIconWrap}>
                            <Icon name={obj.icon as IconName} size={20} color={colors.text.secondary} />
                          </View>
                        </View>
                      ))}
                      {placedItems.slice(0, 6).map((placed) => {
                        const catalogItem = FURNITURE_CATALOG.find(f => f.id === placed.furnitureId);
                        if (!catalogItem) return null;
                        return (
                          <View key={placed.id} style={[styles.homeRoomPlaced, { left: `${placed.x}%`, top: `${placed.y}%` }]}>
                            {catalogItem.interactionType ? (
                              <FurnitureVisual
                                interactionType={catalogItem.interactionType}
                                icon={catalogItem.icon as IconName}
                                size="small"
                                showHint={false}
                              />
                            ) : (
                              <View style={styles.homeRoomDecorIconWrap}>
                                <Icon name={catalogItem.icon as IconName} size={20} color={colors.text.secondary} />
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </LinearGradient>
                  <View style={[styles.homeRoomBaseboard, { backgroundColor: effectiveFloorColor }]} />
                  <LinearGradient
                    colors={[effectiveFloorColor, effectiveFloorColor, (COUNTRIES.find(c => c.id === homeCountryId)?.accentColor ?? '#000') + '08']}
                    style={[styles.homeRoomFloor, { height: HOME_ROOM_FLOOR_H }]}
                    locations={[0, 0.6, 1]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.95}
                      onPress={() => setShowVisbyCheckIn(true)}
                      style={styles.homeVisbyTouch}
                      accessibilityRole="button"
                      accessibilityLabel={`${visby?.name || 'Visby'}, ${moodInfo.label}. Tap to chat.`}
                    >
                      <Animated.View style={[styles.homeVisbyWrap, visbyAnimStyle]}>
                        <View style={styles.homeVisbyShadow} />
                        <VisbyCharacter
                          appearance={defaultAppearance}
                          equipped={visby?.equipped}
                          mood={currentMood}
                          size={HOME_VISBY_SIZE}
                          animated
                          stage={getGrowthStage()}
                        />
                        <TouchableOpacity
                          style={[styles.homeMoodBubble, { backgroundColor: colors.base.cream }]}
                          onPress={() => openCareHintForMood(currentMood)}
                          activeOpacity={MOOD_TO_NEED_KEY[currentMood] ? 0.7 : 1}
                          disabled={!MOOD_TO_NEED_KEY[currentMood]}
                        >
                          <Icon name={moodInfo.icon} size={14} color={colors.primary.wisteriaDark} />
                          <Text style={styles.homeMoodLabel}>{moodInfo.label}</Text>
                        </TouchableOpacity>
                      </Animated.View>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                <TouchableOpacity
                  style={styles.homeRoomSubtitle}
                  onPress={() => navigation.navigate('Avatar')}
                  activeOpacity={0.8}
                >
                  <Caption color={colors.text.muted}>{visby?.name || 'Your Visby'} · Tap to chat or customize</Caption>
                </TouchableOpacity>
              </Animated.View>
            );
          })()}

          {/* ──── QUICK: Today's adventure + My Houses ──── */}
          {(() => {
            const adventure = getAdventureOfTheDay();
            return (
              <Animated.View entering={FadeInDown.duration(400).delay(320)} style={styles.homeQuickRow}>
                {!adventure.completed && (
                  <TouchableOpacity
                    style={styles.homeQuickCta}
                    onPress={() => {
                      if (!adventure.step1) navigation.navigate('Explore', { screen: 'CountryWorld' });
                      else if (!adventure.step2) navigation.navigate('Learn');
                      else (navigation as any).navigate('WordMatch');
                    }}
                    activeOpacity={0.85}
                  >
                    <Icon name="compass" size={18} color={colors.primary.wisteriaDark} />
                    <Text variant="bodySmall" style={styles.homeQuickCtaText}>Today&apos;s adventure</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.homeQuickCta}
                  onPress={() => navigation.navigate('Explore', { screen: 'CountryWorld' })}
                  activeOpacity={0.85}
                >
                  <Icon name="globe" size={18} color={colors.primary.wisteriaDark} />
                  <Text variant="bodySmall" style={styles.homeQuickCtaText}>{userHouses.length > 0 ? 'Visit World' : 'Explore World'}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })()}

          {userHouses.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(360)} style={styles.myHousesSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="home" size={18} color={colors.primary.wisteriaDark} />
                  <Heading level={2} style={styles.sectionTitle}>My Houses</Heading>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Explore', { screen: 'CountryWorld' })} accessibilityRole="button" accessibilityLabel="Visit world">
                  <Text variant="bodySmall" color={colors.primary.wisteriaDark}>Visit World</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myHousesScroll}>
                {userHouses.map((house) => {
                  const country = COUNTRIES.find((c) => c.id === house.countryId);
                  return (
                    <TouchableOpacity
                      key={house.id}
                      style={styles.myHouseCard}
                      onPress={() => navigation.navigate('Explore', { screen: 'CountryRoom', params: { countryId: house.countryId } })}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`Visit ${house.houseName}`}
                    >
                      <LinearGradient colors={[colors.surface.lavender, colors.primary.wisteriaFaded]} style={styles.myHouseGradient}>
                        <View style={styles.myHouseIconWrap}>
                          <Icon name="home" size={24} color={colors.primary.wisteriaDark} />
                        </View>
                        <Text variant="body" style={styles.myHouseName} numberOfLines={1}>{house.houseName}</Text>
                        <Caption style={styles.myHouseCountry}>{country?.name ?? house.countryId}</Caption>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      {/* Daily Reward Modal */}
      <Modal visible={showDailyReward} transparent animationType="fade">
        <Pressable style={styles.careOverlay} onPress={() => setShowDailyReward(false)}>
          <Pressable style={styles.careModal} onPress={(e) => e.stopPropagation()}>
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
            <Button title="Collect!" onPress={() => setShowDailyReward(false)} variant="primary" style={{ marginTop: spacing.lg }} />
          </Pressable>
        </Pressable>
      </Modal>

      <VisbyCheckInModal visible={showVisbyCheckIn} onClose={() => setShowVisbyCheckIn(false)} />

      {/* Story beat: Visby milestone message */}
      <Modal visible={showStoryBeat} transparent animationType="fade">
        <Pressable style={styles.careOverlay} onPress={() => { setShowStoryBeat(false); markStoryBeatShown('first_country'); }}>
          <Pressable style={styles.careModal} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.careIconCircle, { backgroundColor: colors.primary.wisteriaFaded }]}>
              <Icon name="heart" size={36} color={colors.primary.wisteriaDark} />
            </View>
            <Caption style={styles.storyBeatLabel}>Visby says</Caption>
            <Heading level={2} style={styles.careTitle}>We're really going to see the world together!</Heading>
            <Text variant="body" style={styles.careDesc}>You visited your first place. There's so much more to explore — and I'll be right there with you. 🌍</Text>
            <Button title="Let's go!" onPress={() => { setShowStoryBeat(false); markStoryBeatShown('first_country'); }} variant="primary" style={{ marginTop: spacing.lg }} />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Streak freeze offer: you missed a day, use a freeze? */}
      <Modal visible={pendingStreakFreezeOffer} transparent animationType="fade">
        <Pressable style={styles.careOverlay} onPress={() => {}}>
          <Pressable style={styles.careModal} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.careIconCircle, { backgroundColor: colors.calm.skyLight }]}>
              <Icon name="flame" size={36} color={colors.status.streak} />
            </View>
            <Heading level={2} style={styles.careTitle}>You missed a day!</Heading>
            <Text variant="body" style={styles.careDesc}>
              Use a streak freeze to keep your {user?.currentStreak ?? 0}-day streak? You have {streakFreezesRemaining} left this month.
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
              <Button title="Start over" onPress={() => { declineStreakFreezeOffer(); }} variant="secondary" style={{ flex: 1 }} />
              <Button title="Use freeze" onPress={() => { useStreakFreeze(); }} variant="primary" style={{ flex: 1 }} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Surprise: Visby found a gift! */}
      <Modal visible={showSurpriseBonus} transparent animationType="fade">
        <Pressable style={styles.careOverlay} onPress={() => setShowSurpriseBonus(false)}>
          <Animated.View entering={ZoomIn.duration(400).springify()}>
            <Pressable style={styles.careModal} onPress={(e) => e.stopPropagation()}>
              <View style={[styles.careIconCircle, { backgroundColor: colors.reward.peachLight }]}>
              <Icon name="gift" size={36} color={colors.reward.peachDark} />
            </View>
            <Heading level={2} style={styles.careTitle}>Visby found a gift!</Heading>
            <Text style={styles.dailyRewardText}>+{surpriseAura} Aura</Text>
            <Caption style={{ textAlign: 'center', marginTop: 4 }}>Lucky you! Come back tomorrow for more surprises.</Caption>
            <Button title="Yay!" onPress={() => setShowSurpriseBonus(false)} variant="primary" style={{ marginTop: spacing.lg }} />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Care Hint Modal */}
      <Modal visible={!!careHint} transparent animationType="fade">
        <Pressable style={styles.careOverlay} onPress={() => setCareHint(null)}>
          <Pressable style={styles.careModal} onPress={(e) => e.stopPropagation()}>
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
                    ? 'Feed your Visby by logging the foods you eat! Try the Cooking Game too.'
                    : careHint.key === 'happiness'
                    ? 'Make your Visby happy by collecting stamps, exploring countries, and playing mini-games!'
                    : careHint.key === 'energy'
                    ? 'Your Visby rests when you check in each day. Come back tomorrow for more energy!'
                    : 'Teach your Visby by taking quizzes, completing lessons, and playing Word Match!'}
                </Text>
                <View style={styles.careActions}>
                  {careHint.key === 'hunger' && (
                    <>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={() => { setCareHint(null); navigation.navigate('AddBite'); }}>
                        <Icon name="food" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Log a Bite</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={() => { setCareHint(null); (navigation as any).navigate('CookingGame'); }}>
                        <Icon name="sparkles" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Cooking Game</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {careHint.key === 'happiness' && (
                    <>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={() => { setCareHint(null); navigation.navigate('CollectStamp', { locationId: 'quick' }); }}>
                        <Icon name="stamp" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Collect Stamp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={() => { setCareHint(null); (navigation as any).navigate('TreasureHunt'); }}>
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
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={() => { setCareHint(null); navigation.navigate('Quiz'); }}>
                        <Icon name="quiz" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Take a Quiz</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.careBtn, { backgroundColor: careHint.bgColor }]} onPress={() => { setCareHint(null); (navigation as any).navigate('WordMatch'); }}>
                        <Icon name="language" size={20} color={careHint.color} />
                        <Text style={[styles.careBtnText, { color: careHint.color }]}>Word Match</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <TouchableOpacity style={styles.careDismiss} onPress={() => setCareHint(null)}>
                  <Text style={styles.careDismissText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

/* ─── Styles ─── */
const STAT_SIZE = (width - spacing.screenPadding * 2 - CARD_GAP * 3) / 4;
const ADV_CARD_W = (width - spacing.screenPadding * 2 - CARD_GAP * 2) / 3;

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

  /* Home Room (Club Penguin / Sims style) */
  homeRoomWrap: {
    marginBottom: spacing.lg,
  },
  homeRoomFrame: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.base.cream,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  homeRoomWindow: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  homeRoomWall: {
    width: '100%',
    position: 'relative',
  },
  homeRoomObjectsLayer: {
    position: 'relative',
    height: HOME_ROOM_WALL_H - 32,
    marginTop: 4,
  },
  homeRoomDecor: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -18 }, { translateY: -14 }],
  },
  homeRoomDecorIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  homeRoomPlaced: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -18 }, { translateY: -12 }],
  },
  homeRoomBaseboard: {
    height: 8,
    width: '100%',
  },
  homeRoomFloor: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeVisbyTouch: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  homeVisbyWrap: {
    alignItems: 'center',
    width: HOME_VISBY_SIZE,
    height: HOME_VISBY_SIZE + 28,
  },
  homeVisbyShadow: {
    position: 'absolute',
    bottom: 2,
    width: HOME_VISBY_SIZE * 0.5,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  homeMoodBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.3)',
  },
  homeMoodLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: colors.primary.wisteriaDark,
  },
  homeRoomSubtitle: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  homeQuickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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

  /* Visby Hero Card (kept for modals / reuse) */
  visbyCardOuter: {
    marginBottom: spacing.xl,
    ...(Platform.OS !== 'web' ? {
      shadowColor: 'rgba(184, 165, 224, 0.4)',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 28,
      elevation: 8,
    } : {}),
  },
  visbyCardInner: {
    padding: spacing.lg + 4,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(184, 165, 224, 0.06)',
    top: -40,
    right: -30,
  },
  decorCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    bottom: -20,
    left: -10,
  },
  visbyContent: { flexDirection: 'row', alignItems: 'center' },
  visbyLeft: { marginRight: spacing.lg, alignItems: 'center' },
  stageLabel: {
    fontSize: 11,
    color: colors.primary.wisteriaDark,
    marginTop: 4,
    fontFamily: 'Nunito-Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  visbyRight: { flex: 1 },
  visbyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  visbyName: { fontSize: 20 },
  levelProgress: { marginBottom: spacing.sm },
  tapHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatWithVisbyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 12,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: spacing.xl,
  },
  statBubble: {
    width: STAT_SIZE,
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xs,
    ...(Platform.OS !== 'web' ? {
      shadowColor: 'rgba(0,0,0,0.06)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
    } : {}),
  },
  statIconRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    color: colors.text.primary,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 1,
  },

  /* Adventure of the day */
  adventureOfDayCard: {
    marginBottom: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
  adventureOfDayGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 20,
  },
  adventureOfDayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adventureOfDayIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  adventureOfDayTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
  },
  adventureOfDaySteps: {
    marginTop: 2,
  },
  adventureOfDayCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  adventureOfDayCtaText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.primary.wisteriaDark,
  },
  moreToDoLabel: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },

  /* Streak */
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

  questsCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: 16,
  },
  questsTitle: { marginBottom: 2 },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
  },
  questRowDone: { opacity: 0.85 },
  questRowLeft: { flex: 1 },
  questLabel: { fontFamily: 'Nunito-SemiBold', color: colors.text.primary },
  questSub: { marginTop: 2, color: colors.text.muted },
  streakCard: {
    marginBottom: spacing.xl,
    borderRadius: 20,
    overflow: 'hidden',
    ...(Platform.OS !== 'web' ? {
      shadowColor: 'rgba(255, 107, 61, 0.15)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    } : {}),
  },
  streakGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: 20,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakFireWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 61, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDays: {
    color: colors.visby.hair.brown,
    fontSize: 16,
  },
  streakBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.reward.peachDark,
    alignItems: 'center',
    justifyContent: 'center',
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
  myHouseGradient: {
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  myHouseIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(167, 139, 219, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  myHouseName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.text.primary,
  },
  myHouseCountry: {
    marginTop: 2,
    fontSize: 11,
    color: colors.text.muted,
  },

  /* Location */
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  locationPulse: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(184, 165, 224, 0.08)',
    left: -4,
  },
  locationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrap: { flex: 1 },
  locationArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
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
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  stampsScroll: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },

  /* Empty stamp card */
  emptyStampCard: {
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  emptyStampState: {
    paddingVertical: spacing.sm,
  },

  /* Mini-games row */
  gameOfTheDayChipWrap: { marginBottom: spacing.sm },
  gameOfTheDayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.reward.gold + '18',
    borderRadius: 12,
  },
  gameOfTheDayChipText: { color: colors.reward.amber, fontFamily: 'Nunito-SemiBold' },
  gameHomeCardHighlight: { borderWidth: 2, borderColor: colors.reward.gold },
  gameOfTheDayBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.reward.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamesScrollRow: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  gameHomeCard: {
    width: 100,
    marginRight: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gameHomeGradient: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  gameHomeIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameHomeLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center',
    color: colors.text.primary,
    lineHeight: 16,
  },

  /* Adventures grid */
  adventuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  adventureCard: {
    width: ADV_CARD_W,
    borderRadius: 20,
    overflow: 'hidden',
    ...(Platform.OS !== 'web' ? {
      shadowColor: 'rgba(0,0,0,0.06)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 3,
    } : {}),
  },
  adventureTouch: { borderRadius: 20 },
  adventureGradient: {
    alignItems: 'center',
    paddingVertical: spacing.lg + 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
    gap: 6,
  },
  adventureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  adventureLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.text.primary,
  },
  adventureSub: {
    fontSize: 10,
    color: colors.text.muted,
  },

  /* Needs HUD */
  needsContainer: {
    marginBottom: spacing.xl,
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    padding: spacing.md,
    ...(Platform.OS !== 'web' ? {
      shadowColor: 'rgba(0,0,0,0.05)',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    } : {}),
  },
  needsAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  needsAlertText: {
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
  },
  needsBarsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  needItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  needIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.wisteriaFaded,
    overflow: 'hidden',
  },
  needBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  needLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 9,
    color: colors.text.muted,
    textAlign: 'center',
  },

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
