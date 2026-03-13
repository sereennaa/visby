import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
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
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LevelProgress, StreakProgress } from '../../components/ui/ProgressBar';
import { AuraBadge, LevelBadge } from '../../components/ui/Badge';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { StampMini } from '../../components/collectibles/StampCard';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { PulseGlow } from '../../components/effects/Shimmer';
import { useStore } from '../../store/useStore';
import { LEVEL_THRESHOLDS } from '../../config/constants';
import { RootStackParamList, StampType } from '../../types';

const { width } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const MagicStatCard: React.FC<{
  icon: IconName;
  value: number;
  label: string;
  delay: number;
  gradient: [string, string];
}> = ({ icon, value, label, delay, gradient }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 10, stiffness: 80 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.statCard, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statGradient}
      >
        <View style={styles.statIconBubble}>
          <Icon name={icon} size={20} color={colors.primary.wisteriaDark} />
        </View>
        <Text variant="h2" align="center" style={styles.statValue}>{value}</Text>
        <Text variant="caption" align="center" color={colors.text.secondary}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const MagicActionCard: React.FC<{
  icon: IconName;
  label: string;
  gradient: [string, string];
  onPress: () => void;
  delay: number;
}> = ({ icon, label, gradient, onPress, delay }) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const hoverGlow = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withSpring(0, { damping: 12 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    hoverGlow.value = withDelay(
      delay + 800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
    shadowColor: colors.primary.wisteria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: interpolate(hoverGlow.value, [0, 1], [0, 0.3]),
    shadowRadius: interpolate(hoverGlow.value, [0, 1], [0, 12]),
  }));

  return (
    <Animated.View style={[styles.actionCard, style]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.actionGradient}
        >
          <Icon name={icon} size={28} color={colors.text.primary} />
          <Text variant="bodySmall" align="center" style={styles.actionLabel}>
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, visby, stamps, bites, badges, currentLocation, dailyCheckIn, getStreakMultiplier } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const headerOpacity = useSharedValue(0);
  const visbyScale = useSharedValue(0.7);
  const visbyOpacity = useSharedValue(0);
  const visbyFloat = useSharedValue(0);

  useEffect(() => {
    dailyCheckIn();
  }, []);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    visbyScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 60 }));
    visbyOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));

    visbyFloat.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 2500, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
          withTiming(0, { duration: 2500, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const visbyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: visbyScale.value }, { translateY: visbyFloat.value }],
    opacity: visbyOpacity.value,
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

  const getGreetingIcon = (): IconName => {
    const hour = new Date().getHours();
    if (hour < 6) return 'star';
    if (hour < 12) return 'sparkles';
    if (hour < 17) return 'star';
    if (hour < 21) return 'sparkles';
    return 'sparkles';
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

  const statItems: { icon: IconName; value: number; label: string; gradient: [string, string] }[] = [
    { icon: 'stamp', value: stamps.length, label: 'Stamps', gradient: [colors.primary.wisteriaFaded, '#F3EAFF'] },
    { icon: 'food', value: bites.length, label: 'Bites', gradient: [colors.reward.peachLight, '#FFF5E6'] },
    { icon: 'trophy', value: badges.length, label: 'Badges', gradient: [colors.success.honeydew, '#E8FFE8'] },
    { icon: 'globe', value: user?.countriesVisited || 0, label: 'Places', gradient: [colors.calm.skyLight, '#E6F5FF'] },
  ];

  const actionItems: { icon: IconName; label: string; colors: [string, string]; onPress: () => void }[] = [
    { icon: 'globe', label: 'Visit World', colors: ['#FFF0DB', '#FFEACC'], onPress: () => navigation.navigate('CountryWorld') },
    { icon: 'stamp', label: 'Collect Stamp', colors: ['#F3EAFF', '#EDE3FA'], onPress: () => navigation.navigate('CollectStamp', { locationId: 'quick' }) },
    { icon: 'bowl', label: 'Log Food', colors: ['#FFF5E6', '#FFEDD5'], onPress: () => navigation.navigate('AddBite') },
    { icon: 'book', label: 'Learn', colors: ['#E6F5FF', '#D6ECFF'], onPress: () => navigation.navigate('Learn') },
    { icon: 'trophy', label: 'Badges', colors: ['#E8FFE8', '#D4F7D4'], onPress: () => navigation.navigate('Badges') },
    { icon: 'shirt', label: 'Shop', colors: ['#FFE8F0', '#F3EAFF'], onPress: () => navigation.navigate('CosmeticShop') },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, '#F5EEFF', '#EAF5FF', colors.base.cream]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.3, 0.6, 1]}
      />

      {/* Subtle floating particles */}
      <FloatingParticles count={8} variant="sparkle" opacity={0.35} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <Animated.View style={[styles.header, headerStyle]}>
            <View style={styles.headerLeft}>
              <View style={styles.greetingRow}>
                <Icon name={getGreetingIcon()} size={18} color={colors.text.secondary} />
                <Text variant="body" color={colors.text.secondary}>
                  {getGreeting()}, {user?.username || 'Explorer'}!
                </Text>
              </View>
              <Text variant="h1" style={styles.levelTitle}>
                {currentLevel.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AuraStore')}
              activeOpacity={0.8}
            >
              <PulseGlow color="rgba(255, 215, 0, 0.4)" intensity={12} speed={3000}>
                <AuraBadge amount={currentAura} />
              </PulseGlow>
            </TouchableOpacity>
          </Animated.View>

          {/* Visby Character Card */}
          <Animated.View style={visbyStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Avatar')}
            >
              <LinearGradient
                colors={['#F3EAFF', '#FFF8F0', '#EAF5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.visbyCard}
              >
                <View style={styles.visbyContent}>
                  <View style={styles.visbyLeft}>
                    <VisbyCharacter
                      appearance={defaultAppearance}
                      equipped={visby?.equipped}
                      mood={user?.currentStreak && user.currentStreak > 0 ? 'excited' : 'happy'}
                      size={120}
                      animated={true}
                    />
                  </View>
                  <View style={styles.visbyRight}>
                    <View style={styles.visbyNameRow}>
                      <Text variant="h2">{visby?.name || 'Your Visby'}</Text>
                      <LevelBadge level={user?.level || 1} />
                    </View>
                    <LevelProgress
                      currentXP={progressAura}
                      requiredXP={requiredAura}
                      level={user?.level || 1}
                      style={styles.levelProgress}
                    />
                    <Text variant="caption" color={colors.text.muted}>
                      Tap to customize
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            {statItems.map((stat, index) => (
              <MagicStatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                delay={400 + index * 100}
                gradient={stat.gradient}
              />
            ))}
          </View>

          {/* Streak Card */}
          {user?.currentStreak !== undefined && user.currentStreak > 0 && (
            <View style={styles.streakWrapper}>
              <LinearGradient
                colors={['#FFF0F0', '#FFE8E0', '#FFF5F0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.streakGradient}
              >
                <StreakProgress
                  currentStreak={user.currentStreak}
                  targetStreak={7}
                />
                <View style={styles.streakMultiplierRow}>
                  <Text style={styles.streakMultiplierLabel}>Aura Multiplier</Text>
                  <View style={styles.streakMultiplierBadge}>
                    <Text style={styles.streakMultiplierValue}>{getStreakMultiplier().toFixed(1)}x</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Location */}
          <Card style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconBubble}>
                <Icon name="location" size={22} color={colors.primary.wisteriaDark} />
              </View>
              <View style={styles.locationText}>
                <Text variant="h3">
                  {currentLocation?.city || 'Unknown Location'}
                </Text>
                <Text variant="caption" color={colors.text.secondary}>
                  {currentLocation?.country || 'Enable location to explore'}
                </Text>
              </View>
            </View>
            <Button
              title="Explore"
              onPress={() => navigation.navigate('Map')}
              variant="secondary"
              size="sm"
            />
          </Card>

          {/* Stamp Collection */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="stamp" size={20} color={colors.text.primary} />
              <Heading level={2}>Your Stamps</Heading>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Stamps')}>
              <View style={styles.seeAllRow}>
                <Text variant="body" color={colors.primary.wisteriaDark}>See All</Text>
                <Icon name="chevronRight" size={16} color={colors.primary.wisteriaDark} />
              </View>
            </TouchableOpacity>
          </View>
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

          {/* Quick Actions */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="flash" size={20} color={colors.text.primary} />
              <Heading level={2}>Adventures</Heading>
            </View>
          </View>
          <View style={styles.actionsGrid}>
            {actionItems.map((action, index) => (
              <MagicActionCard
                key={action.label}
                icon={action.icon}
                label={action.label}
                gradient={action.colors}
                onPress={action.onPress}
                delay={600 + index * 80}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerLeft: { flex: 1 },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  levelTitle: {
    color: colors.text.primary,
    marginTop: spacing.xxs,
  },
  visbyCard: {
    borderRadius: spacing.radius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: 'rgba(184, 165, 224, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 5,
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
  levelProgress: { marginBottom: spacing.sm },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  statCard: { flex: 1 },
  statGradient: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
    borderRadius: spacing.radius.xl,
    gap: spacing.xxs,
  },
  statIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: { color: colors.text.primary },
  streakWrapper: {
    marginBottom: spacing.xl,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  streakGradient: { padding: spacing.lg, borderRadius: spacing.radius.xl },
  streakMultiplierRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  streakMultiplierLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: '#D4760A' },
  streakMultiplierBadge: { backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  streakMultiplierValue: { fontFamily: 'Baloo2-Bold', fontSize: 14, color: '#7A5A00' },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  locationIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  seeAllRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  stampsScroll: { paddingVertical: spacing.sm, marginBottom: spacing.xl },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: (width - spacing.screenPadding * 2 - spacing.md * 2) / 3,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  actionGradient: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    borderRadius: spacing.radius.xl,
  },
  actionLabel: {
    color: colors.text.primary,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
  },
});

export default HomeScreen;
