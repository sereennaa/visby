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
import { StampMini } from '../../components/collectibles/StampCard';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { PulseGlow, MagicBorder } from '../../components/effects/Shimmer';
import { useStore, DEFAULT_NEEDS } from '../../store/useStore';
import { LEVEL_THRESHOLDS, COUNTRIES } from '../../config/constants';
import { RootStackParamList, StampType, VisbyNeeds, VisbyGrowthStage } from '../../types';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;

const STAGE_LABELS: Record<VisbyGrowthStage, string> = {
  egg: 'Egg',
  baby: 'Baby',
  kid: 'Kid',
  teen: 'Teen',
  adult: 'Adult',
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

/* ─── Animated stat bubble ─── */
const StatBubble: React.FC<{
  icon: IconName;
  value: number;
  label: string;
  delay: number;
  iconBg: string;
  iconColor: string;
}> = ({ icon, value, label, delay, iconBg, iconColor }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 90 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.statBubble, style]}>
      <View style={[styles.statIconRing, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <Text variant="h2" style={styles.statValue}>{value}</Text>
      <Caption style={styles.statLabel}>{label}</Caption>
    </Animated.View>
  );
};

/* ─── Adventure card (quick action) ─── */
const AdventureCard: React.FC<{
  icon: IconName;
  label: string;
  subtitle: string;
  gradient: [string, string];
  iconBg: string;
  onPress: () => void;
  delay: number;
}> = ({ icon, label, subtitle, gradient, iconBg, onPress, delay }) => {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withSpring(0, { damping: 14, stiffness: 80 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.adventureCard, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.adventureTouch}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adventureGradient}
        >
          <View style={[styles.adventureIconWrap, { backgroundColor: iconBg }]}>
            <Icon name={icon} size={22} color="#FFFFFF" />
          </View>
          <Text variant="bodySmall" style={styles.adventureLabel}>{label}</Text>
          <Caption style={styles.adventureSub}>{subtitle}</Caption>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

/* ─── Needs HUD ─── */
const NEED_CONFIG: { key: keyof Omit<VisbyNeeds, 'lastUpdated'>; icon: IconName; label: string; color: string; bgColor: string; hint: string; howTo: string }[] = [
  { key: 'hunger', icon: 'food', label: 'Food', color: '#E8A04E', bgColor: '#FFEAD0', hint: 'Hungry!', howTo: 'Log a bite or play Cooking Game' },
  { key: 'happiness', icon: 'heart', label: 'Joy', color: '#E07A8A', bgColor: '#FFE0E8', hint: 'Bored!', howTo: 'Collect stamps or play games' },
  { key: 'energy', icon: 'flash', label: 'Energy', color: '#5EA0D4', bgColor: '#E0F0FF', hint: 'Tired!', howTo: 'Check in daily to rest' },
  { key: 'knowledge', icon: 'book', label: 'Smarts', color: '#8B6FC0', bgColor: '#EDE3FA', hint: 'Curious!', howTo: 'Take a quiz or finish a lesson' },
];

const NeedsHUD: React.FC<{
  needs: VisbyNeeds;
  onNeedTap: (need: typeof NEED_CONFIG[number]) => void;
}> = ({ needs, onNeedTap }) => {
  const lowestNeed = NEED_CONFIG.reduce((low, n) =>
    (needs[n.key] as number) < (needs[low.key] as number) ? n : low
  , NEED_CONFIG[0]);
  const lowestVal = needs[lowestNeed.key] as number;

  return (
    <View style={styles.needsContainer}>
      {/* Urgent hint */}
      {lowestVal < 40 && (
        <TouchableOpacity
          style={[styles.needsAlert, { backgroundColor: lowestNeed.bgColor }]}
          onPress={() => onNeedTap(lowestNeed)}
          activeOpacity={0.8}
        >
          <Icon name={lowestNeed.icon} size={16} color={lowestNeed.color} />
          <Text style={[styles.needsAlertText, { color: lowestNeed.color }]}>
            {lowestNeed.hint} {lowestNeed.howTo}
          </Text>
          <Icon name="chevronRight" size={14} color={lowestNeed.color} />
        </TouchableOpacity>
      )}
      {/* Bars */}
      <View style={styles.needsBarsRow}>
        {NEED_CONFIG.map((need) => {
          const value = needs[need.key] as number;
          const isLow = value < 30;
          const isCritical = value < 15;
          return (
            <TouchableOpacity
              key={need.key}
              style={styles.needItem}
              onPress={() => onNeedTap(need)}
              activeOpacity={0.7}
            >
              <View style={[styles.needIconWrap, { backgroundColor: need.bgColor }]}>
                <Icon name={need.icon} size={14} color={need.color} />
              </View>
              <View style={styles.needBarTrack}>
                <View
                  style={[
                    styles.needBarFill,
                    {
                      width: `${value}%` as any,
                      backgroundColor: isCritical ? colors.status.error : isLow ? colors.status.warning : need.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.needLabel, isLow && { color: colors.status.error }]}>{need.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, visby, stamps, bites, badges, currentLocation, userHouses, dailyCheckIn, getStreakMultiplier, updateVisbyNeeds, getVisbyNeeds, getGrowthStage } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [careHint, setCareHint] = React.useState<typeof NEED_CONFIG[number] | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState(0);

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
  }, []);

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

  const stampCounts: Record<StampType, number> = {
    city: 0, country: 0, landmark: 0, park: 0, beach: 0,
    mountain: 0, museum: 0, restaurant: 0, cafe: 0, market: 0,
    temple: 0, castle: 0, monument: 0, nature: 0, hidden_gem: 0,
  };
  stamps.forEach(stamp => {
    if (stampCounts[stamp.type] !== undefined) stampCounts[stamp.type]++;
  });

  const statItems = [
    { icon: 'stamp' as IconName, value: stamps.length, label: 'Stamps', iconBg: '#EDE3FA', iconColor: colors.primary.wisteriaDark },
    { icon: 'food' as IconName, value: bites.length, label: 'Bites', iconBg: '#FFEAD0', iconColor: '#E08A3A' },
    { icon: 'trophy' as IconName, value: badges.length, label: 'Badges', iconBg: '#DFF5E1', iconColor: colors.success.emerald },
    { icon: 'globe' as IconName, value: user?.countriesVisited || 0, label: 'Places', iconBg: '#E6F2FC', iconColor: colors.calm.ocean },
  ];

  const adventures = [
    { icon: 'globe' as IconName, label: 'World', subtitle: 'Explore', gradient: ['#F6EDFF', '#EDE3FA'] as [string, string], iconBg: '#A78BDB', onPress: () => navigation.navigate('CountryWorld') },
    { icon: 'stamp' as IconName, label: 'Stamp', subtitle: 'Collect', gradient: ['#FFF5E6', '#FFEAD0'] as [string, string], iconBg: '#E8A04E', onPress: () => navigation.navigate('CollectStamp', { locationId: 'quick' }) },
    { icon: 'bowl' as IconName, label: 'Bite', subtitle: 'Log food', gradient: ['#FFF0F0', '#FFE0DE'] as [string, string], iconBg: '#E07A6A', onPress: () => navigation.navigate('AddBite') },
    { icon: 'book' as IconName, label: 'Learn', subtitle: 'Study', gradient: ['#E8F4FF', '#D6ECFF'] as [string, string], iconBg: '#5EA0D4', onPress: () => navigation.navigate('Learn') },
    { icon: 'trophy' as IconName, label: 'Badges', subtitle: 'Earn', gradient: ['#E8FFE8', '#D4F7D4'] as [string, string], iconBg: '#48B048', onPress: () => navigation.navigate('Badges') },
    { icon: 'shirt' as IconName, label: 'Shop', subtitle: 'Style', gradient: ['#FFF0F7', '#FFE0ED'] as [string, string], iconBg: '#D46B9B', onPress: () => navigation.navigate('CosmeticShop') },
    { icon: 'home' as IconName, label: 'Furniture', subtitle: 'Decorate', gradient: ['#F0EDF5', '#E8E0F0'] as [string, string], iconBg: '#8B7BA8', onPress: () => navigation.navigate('FurnitureShop') },
  ];

  return (
    <View style={styles.container}>
      {/* Layered gradient background */}
      <LinearGradient
        colors={['#FDFBF8', '#F3EAFF', '#EAF2FF', '#FFF8F2', '#FDFBF8']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      <FloatingParticles count={6} variant="sparkle" opacity={0.3} speed="slow" />

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

          {/* ──── VISBY CHARACTER HERO ──── */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => navigation.navigate('Avatar')}
              accessibilityRole="button"
              accessibilityLabel="Customize your Visby"
            >
              <MagicBorder
                borderRadius={28}
                borderWidth={2}
                colors={['#D4C4F0', '#FFD700', '#90C8EE', '#FFB6C1', '#D4C4F0']}
                style={styles.visbyCardOuter}
              >
                <LinearGradient
                  colors={['#FAF5FF', '#FFF9F0', '#F0F7FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.visbyCardInner}
                >
                  {/* Decorative background circles */}
                  <View style={styles.decorCircle1} />
                  <View style={styles.decorCircle2} />

                  <View style={styles.visbyContent}>
                    <Animated.View style={[styles.visbyLeft, visbyAnimStyle]}>
                      <VisbyCharacter
                        appearance={defaultAppearance}
                        equipped={visby?.equipped}
                        mood={visby?.currentMood || 'happy'}
                        size={110}
                        animated={true}
                        stage={getGrowthStage()}
                      />
                      <Caption style={styles.stageLabel}>
                        {STAGE_LABELS[getGrowthStage()]} Visby
                      </Caption>
                    </Animated.View>

                    <View style={styles.visbyRight}>
                      <View style={styles.visbyNameRow}>
                        <Text variant="h2" style={styles.visbyName}>
                          {visby?.name || 'Your Visby'}
                        </Text>
                        <LevelBadge level={user?.level || 1} />
                      </View>

                      <LevelProgress
                        currentXP={progressAura}
                        requiredXP={requiredAura}
                        level={user?.level || 1}
                        style={styles.levelProgress}
                      />

                      <View style={styles.tapHintRow}>
                        <Icon name="sparkles" size={12} color={colors.reward.gold} />
                        <Caption color={colors.text.muted}>Tap to customize</Caption>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </MagicBorder>
            </TouchableOpacity>
          </Animated.View>

          {/* ──── VISBY NEEDS ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
            <NeedsHUD
              needs={getVisbyNeeds()}
              onNeedTap={(need) => setCareHint(need)}
            />
          </Animated.View>

          {/* ──── QUICK STATS ──── */}
          <View style={styles.statsRow}>
            {statItems.map((stat, i) => (
              <StatBubble
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                delay={350 + i * 80}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
              />
            ))}
          </View>

          {/* ──── STREAK ──── */}
          {user?.currentStreak !== undefined && user.currentStreak > 0 && (
            <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.streakCard}>
              <LinearGradient
                colors={['#FFF3EC', '#FFE8DA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.streakGradient}
              >
                <View style={styles.streakLeft}>
                  <View style={styles.streakFireWrap}>
                    <Icon name="flame" size={28} color="#FF6B3D" />
                  </View>
                  <View>
                    <Text variant="h3" style={styles.streakDays}>
                      {user.currentStreak} day streak
                    </Text>
                    <Caption color="#C4763A">
                      {getStreakMultiplier().toFixed(1)}x aura multiplier
                    </Caption>
                  </View>
                </View>
                <View style={styles.streakBadge}>
                  <Icon name="flash" size={14} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* ──── MY HOUSES ──── */}
          {userHouses.length > 0 && (
            <Animated.View entering={FadeInDown.duration(500).delay(530)} style={styles.myHousesSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="home" size={18} color={colors.primary.wisteriaDark} />
                  <Heading level={2} style={styles.sectionTitle}>My Houses</Heading>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('CountryWorld')} accessibilityRole="button" accessibilityLabel="Visit world">
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
                      onPress={() => navigation.navigate('CountryRoom', { countryId: house.countryId })}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`Visit ${house.houseName}`}
                    >
                      <LinearGradient colors={['#F5EFFF', '#EDE3FA']} style={styles.myHouseGradient}>
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

          {/* ──── LOCATION ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(550)}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Map')}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Explore nearby"
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8F5FF']}
                style={styles.locationCard}
              >
                <View style={styles.locationLeft}>
                  <View style={styles.locationPulse} />
                  <View style={styles.locationIconWrap}>
                    <Icon name="location" size={22} color={colors.primary.wisteriaDark} />
                  </View>
                  <View style={styles.locationTextWrap}>
                    <Text variant="h3" numberOfLines={1}>
                      {currentLocation?.city || 'Unknown Location'}
                    </Text>
                    <Caption color={colors.text.muted} numberOfLines={1}>
                      {currentLocation?.country || 'Enable location to explore'}
                    </Caption>
                  </View>
                </View>
                <View style={styles.locationArrow}>
                  <Icon name="chevronRight" size={18} color={colors.primary.wisteria} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* ──── YOUR STAMPS ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(600)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Icon name="stamp" size={18} color={colors.primary.wisteriaDark} />
                <Heading level={2} style={styles.sectionTitle}>Your Stamps</Heading>
              </View>
              {stamps.length > 0 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Stamps')}
                  accessibilityRole="button"
                  accessibilityLabel="See all stamps"
                  style={styles.seeAllBtn}
                >
                  <Text variant="bodySmall" color={colors.primary.wisteriaDark}>See All</Text>
                  <Icon name="chevronRight" size={14} color={colors.primary.wisteriaDark} />
                </TouchableOpacity>
              )}
            </View>

            {stamps.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stampsScroll}
              >
                {(['city', 'park', 'beach', 'landmark', 'restaurant'] as StampType[]).map(
                  (type) => (
                    <StampMini
                      key={type}
                      type={type}
                      count={stampCounts[type]}
                      onPress={() => navigation.navigate('Stamps')}
                    />
                  )
                )}
              </ScrollView>
            ) : (
              <LinearGradient
                colors={['#FAF5FF', '#FFF8F0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyStampCard}
              >
                <View style={styles.emptyStampIconWrap}>
                  <Icon name="stamp" size={32} color={colors.primary.wisteriaDark} />
                </View>
                <View style={styles.emptyStampText}>
                  <Text variant="h3">Start Your Collection</Text>
                  <Caption color={colors.text.muted}>
                    Visit a place nearby to collect your first stamp!
                  </Caption>
                </View>
                <Button
                  title="Collect a Stamp"
                  onPress={() => navigation.navigate('CollectStamp', { locationId: 'quick' })}
                  variant="primary"
                  size="sm"
                />
              </LinearGradient>
            )}
          </Animated.View>

          {/* ──── MINI-GAMES ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(700)}>
            <View style={styles.sectionHeader}>
              <Heading level={2}>Play</Heading>
              <Caption>Learn while having fun</Caption>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesScrollRow}>
              {([
                { key: 'WordMatch', label: 'Word\nMatch', icon: 'language' as IconName, gradient: ['#EDE3FA', '#FAF5FF'] as [string, string], iconColor: colors.primary.wisteriaDark },
                { key: 'MemoryCards', label: 'Memory\nCards', icon: 'flashcard' as IconName, gradient: ['#E0F0FF', '#F0F7FF'] as [string, string], iconColor: colors.calm.ocean },
                { key: 'CookingGame', label: 'World\nCooking', icon: 'food' as IconName, gradient: ['#FFEAD0', '#FFF5E8'] as [string, string], iconColor: colors.reward.peachDark },
                { key: 'TreasureHunt', label: 'Treasure\nHunt', icon: 'compass' as IconName, gradient: ['#DFF5E1', '#F0FFF0'] as [string, string], iconColor: colors.success.emerald },
              ] as const).map((game, i) => (
                <Animated.View key={game.key} entering={FadeInDown.duration(400).delay(750 + i * 80)}>
                  <TouchableOpacity
                    style={styles.gameHomeCard}
                    onPress={() => (navigation as any).navigate(game.key)}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={game.gradient}
                      style={styles.gameHomeGradient}
                    >
                      <View style={[styles.gameHomeIconWrap, { backgroundColor: game.iconColor + '20' }]}>
                        <Icon name={game.icon} size={28} color={game.iconColor} />
                      </View>
                      <Text style={styles.gameHomeLabel}>{game.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* ──── ADVENTURES GRID ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(900)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Icon name="rocket" size={18} color={colors.primary.wisteriaDark} />
                <Heading level={2} style={styles.sectionTitle}>Adventures</Heading>
              </View>
            </View>

            <View style={styles.adventuresGrid}>
              {adventures.map((adv, i) => (
                <AdventureCard
                  key={adv.label}
                  icon={adv.icon}
                  label={adv.label}
                  subtitle={adv.subtitle}
                  gradient={adv.gradient}
                  iconBg={adv.iconBg}
                  onPress={adv.onPress}
                  delay={700 + i * 60}
                />
              ))}
            </View>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      {/* Daily Reward Modal */}
      <Modal visible={showDailyReward} transparent animationType="fade">
        <Pressable style={styles.careOverlay} onPress={() => setShowDailyReward(false)}>
          <Pressable style={styles.careModal} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.careIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="flame" size={36} color="#FF6B3D" />
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

  /* Visby Hero Card */
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

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: spacing.xl,
  },
  statBubble: {
    width: STAT_SIZE,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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

  /* Streak */
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
    color: '#8B4513',
    fontSize: 16,
  },
  streakBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF8C42',
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
    gap: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
    borderStyle: 'dashed',
  },
  emptyStampIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStampText: {
    alignItems: 'center',
    gap: 4,
  },

  /* Mini-games row */
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F0EDF5',
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
    backgroundColor: '#FFFFFF',
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
    color: '#FFB020',
    textAlign: 'center' as const,
  },

  bottomSpacer: { height: 20 },
});

export default HomeScreen;
