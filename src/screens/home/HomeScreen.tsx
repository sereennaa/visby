import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Platform,
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
import { useStore } from '../../store/useStore';
import { LEVEL_THRESHOLDS } from '../../config/constants';
import { RootStackParamList, StampType } from '../../types';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;

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

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, visby, stamps, bites, badges, currentLocation, dailyCheckIn, getStreakMultiplier } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const visbyFloat = useSharedValue(0);

  useEffect(() => {
    dailyCheckIn();
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
                        mood={user?.currentStreak && user.currentStreak > 0 ? 'excited' : 'happy'}
                        size={110}
                        animated={true}
                      />
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

          {/* ──── ADVENTURES GRID ──── */}
          <Animated.View entering={FadeInDown.duration(500).delay(700)}>
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
  visbyLeft: { marginRight: spacing.lg },
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

  bottomSpacer: { height: 20 },
});

export default HomeScreen;
