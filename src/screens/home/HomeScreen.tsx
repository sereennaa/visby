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
import { useStore } from '../../store/useStore';
import { LEVEL_THRESHOLDS, STAMP_TYPES_INFO } from '../../config/constants';
import { RootStackParamList, StampType } from '../../types';

const { width } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, visby, stamps, bites, badges, currentLocation } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const visbyScale = useSharedValue(0.8);
  const statsOpacity = useSharedValue(0);
  const cardsTranslate = useSharedValue(50);

  useEffect(() => {
    // Staggered entrance animations
    headerOpacity.value = withTiming(1, { duration: 400 });
    visbyScale.value = withDelay(200, withSpring(1, { damping: 12 }));
    statsOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    cardsTranslate.value = withDelay(500, withSpring(0, { damping: 15 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const visbyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: visbyScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const cardsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardsTranslate.value }],
    opacity: statsOpacity.value,
  }));

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data from Supabase
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentLevel = () => {
    const aura = user?.aura || 0;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (aura >= LEVEL_THRESHOLDS[i].aura) {
        return LEVEL_THRESHOLDS[i];
      }
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
  const auraForCurrentLevel = currentLevel.aura;
  const auraForNextLevel = nextLevel.aura;
  const progressAura = currentAura - auraForCurrentLevel;
  const requiredAura = auraForNextLevel - auraForCurrentLevel;

  const defaultAppearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  // Count stamps by type
  const stampCounts: Record<StampType, number> = {
    city: 0, country: 0, landmark: 0, park: 0, beach: 0,
    mountain: 0, museum: 0, restaurant: 0, cafe: 0, market: 0,
    temple: 0, castle: 0, monument: 0, nature: 0, hidden_gem: 0,
  };
  stamps.forEach(stamp => {
    if (stampCounts[stamp.type] !== undefined) {
      stampCounts[stamp.type]++;
    }
  });

  const statItems: { icon: IconName; value: number; label: string }[] = [
    { icon: 'stamp', value: stamps.length, label: 'Stamps' },
    { icon: 'food', value: bites.length, label: 'Bites' },
    { icon: 'trophy', value: badges.length, label: 'Badges' },
    { icon: 'globe', value: user?.countriesVisited || 0, label: 'Countries' },
  ];

  const actionItems: { icon: IconName; label: string; colors: [string, string]; onPress: () => void }[] = [
    { icon: 'stamp', label: 'Collect Stamp', colors: [colors.primary.wisteriaFaded, colors.base.cream], onPress: () => navigation.navigate('CollectStamp', { locationId: 'quick' }) },
    { icon: 'bowl', label: 'Log Food', colors: [colors.reward.peachLight, colors.base.cream], onPress: () => navigation.navigate('AddBite') },
    { icon: 'book', label: 'Learn', colors: [colors.calm.skyLight, colors.base.cream], onPress: () => navigation.navigate('Learn') },
    { icon: 'trophy', label: 'Badges', colors: [colors.success.honeydew, colors.base.cream], onPress: () => navigation.navigate('Badges') },
  ];

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight]}
      style={styles.container}
      locations={[0, 0.5, 1]}
    >
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
                <Text variant="bodySmall" color={colors.text.secondary}>
                  {getGreeting()}, {user?.username || 'Explorer'}!
                </Text>
                <Icon name="hand" size={16} color={colors.text.secondary} />
              </View>
              <Text variant="h1" style={styles.levelTitle}>
                {currentLevel.title}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <AuraBadge amount={currentAura} />
            </View>
          </Animated.View>

          {/* Visby Character Card */}
          <Animated.View style={visbyStyle}>
            <Card
              variant="gradient"
              gradientColors={[colors.primary.wisteriaFaded, colors.base.cream]}
              style={styles.visbyCard}
              onPress={() => navigation.navigate('Avatar')}
            >
              <View style={styles.visbyContent}>
                <View style={styles.visbyLeft}>
                  <VisbyCharacter
                    appearance={defaultAppearance}
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
                    Tap to customize your Visby
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View style={[styles.statsRow, statsStyle]}>
            {statItems.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <Icon name={stat.icon} size={24} color={colors.primary.wisteriaDark} />
                <Text variant="h2" align="center">{stat.value}</Text>
                <Text variant="caption" align="center">{stat.label}</Text>
              </Card>
            ))}
          </Animated.View>

          {/* Streak Card */}
          {user?.currentStreak !== undefined && user.currentStreak > 0 && (
            <Animated.View style={cardsStyle}>
              <StreakProgress
                currentStreak={user.currentStreak}
                targetStreak={7}
                style={styles.streakCard}
              />
            </Animated.View>
          )}

          {/* Current Location */}
          <Animated.View style={cardsStyle}>
            <Card style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Icon name="location" size={28} color={colors.primary.wisteriaDark} />
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
                title="Explore Nearby"
                onPress={() => navigation.navigate('Map')}
                variant="secondary"
                size="sm"
              />
            </Card>
          </Animated.View>

          {/* Stamp Collection Preview */}
          <Animated.View style={cardsStyle}>
            <View style={styles.sectionHeader}>
              <Heading level={2}>Your Stamps</Heading>
              <TouchableOpacity onPress={() => navigation.navigate('Stamps')}>
                <View style={styles.seeAllRow}>
                  <Text variant="body" color={colors.primary.wisteriaDark}>
                    See All
                  </Text>
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
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={[styles.actionsContainer, cardsStyle]}>
            <Heading level={2} style={styles.sectionTitle}>
              Quick Actions
            </Heading>
            <View style={styles.actionsGrid}>
              {actionItems.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={action.onPress}
                >
                  <LinearGradient
                    colors={action.colors}
                    style={styles.actionGradient}
                  >
                    <Icon name={action.icon} size={32} color={colors.text.primary} />
                    <Text variant="bodySmall" align="center">
                      {action.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerRight: {
    marginLeft: spacing.md,
  },
  levelTitle: {
    color: colors.text.primary,
    marginTop: spacing.xxs,
  },
  visbyCard: {
    marginBottom: spacing.lg,
  },
  visbyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visbyLeft: {
    marginRight: spacing.md,
  },
  visbyRight: {
    flex: 1,
  },
  visbyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  levelProgress: {
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  streakCard: {
    marginBottom: spacing.lg,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  locationText: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  stampsScroll: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionsContainer: {
    marginTop: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: (width - spacing.screenPadding * 2 - spacing.md) / 2 - spacing.md / 2,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionGradient: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
});

export default HomeScreen;
