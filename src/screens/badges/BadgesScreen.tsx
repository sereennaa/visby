import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { BADGE_DEFINITIONS, BadgeDefinition } from '../../config/badges';
import { getBadgeProgress, BadgeCheckContext } from '../../services/badges';
import { EmptyState } from '../../components/ui/EmptyState';
import { RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');
const CARD_GAP = spacing.md;
const CARD_WIDTH = (width - spacing.screenPadding * 2 - CARD_GAP) / 2;

type BadgesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Badges'>;
};

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ navigation }) => {
  const stamps = useStore(s => s.stamps);
  const bites = useStore(s => s.bites);
  const badges = useStore(s => s.badges);
  const user = useStore(s => s.user);
  const lessonProgress = useStore(s => s.lessonProgress);
  const userHouses = useStore(s => s.userHouses);
  const visby = useStore(s => s.visby);

  const earnedBadgeIds = useMemo(
    () => new Set(badges.map((b) => b.badgeId)),
    [badges]
  );

  const context = useMemo<BadgeCheckContext>(() => ({
    stamps: stamps.length,
    bites: bites.length,
    countriesVisited: user?.countriesVisited ?? 0,
    totalAuraEarned: user?.totalAuraEarned ?? 0,
    currentStreak: user?.currentStreak ?? 0,
    longestStreak: user?.longestStreak ?? 0,
    lessonsCompleted: lessonProgress.filter((lp) => lp.completed).length,
    housesOwned: userHouses.length,
    cosmeticsOwned: visby?.ownedCosmetics.length ?? 0,
    cuisinesCount: new Set(bites.map((b) => b.cuisine)).size,
    quizPerfect: false,
    earnedBadgeIds: badges.map((b) => b.badgeId),
    gamesPlayed: user?.gamesPlayed ?? 0,
    perfectCookingGames: user?.perfectCookingGames ?? 0,
    perfectWordMatches: user?.perfectWordMatches ?? 0,
    treasureHuntsCompleted: user?.treasureHuntsCompleted ?? 0,
  }), [stamps, bites, user, lessonProgress, userHouses, visby, badges]);

  const renderBadge = ({ item }: { item: BadgeDefinition }) => {
    const earned = earnedBadgeIds.has(item.id);
    const { current, target, label } = getBadgeProgress(item.id, context);
    const ratio = Math.min(current / target, 1);

    return (
      <Card
        style={[
          styles.badgeCard,
          earned && styles.badgeCardEarned,
          !earned && styles.badgeCardLocked,
        ]}
      >
        <View style={[styles.iconContainer, earned && styles.iconContainerEarned]}>
          <Icon
            name={item.icon as IconName}
            size={32}
            color={earned ? colors.reward.gold : colors.text.muted}
          />
          {earned && (
            <View style={styles.checkBadge}>
              <Icon name="check" size={12} color={colors.base.cream} />
            </View>
          )}
        </View>

        <Text
          variant="body"
          align="center"
          style={[styles.badgeName, !earned && styles.lockedText]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Caption align="center" style={!earned ? styles.lockedText : undefined}>
          {earned
            ? 'Earned!'
            : `${current}/${target} ${label}`}
        </Caption>

        {/* Progress bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${ratio * 100}%`,
                backgroundColor: earned
                  ? colors.reward.gold
                  : colors.primary.wisteria,
              },
            ]}
          />
        </View>
      </Card>
    );
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Badges</Heading>
          <View style={styles.countBadge}>
            <Text variant="body" color={colors.primary.wisteriaDark}>
              {badges.length}/{BADGE_DEFINITIONS.length}
            </Text>
          </View>
        </Animated.View>

        {badges.length === 0 && (
          <EmptyState
            icon="medal"
            title="Your badge journey begins!"
            message="Explore countries, play games, and learn new things to earn your first badge."
            ctaLabel="Start exploring"
            onCta={() => navigation.goBack()}
          />
        )}

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.badgeListWrap}>
        <FlatList
          data={BADGE_DEFINITIONS}
          renderItem={renderBadge}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={true}
        />
        </Animated.View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.warmWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  countBadge: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  badgeListWrap: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  badgeCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  badgeCardEarned: {
    borderWidth: 2,
    borderColor: colors.reward.gold,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.base.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconContainerEarned: {
    backgroundColor: colors.reward.peachLight,
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  lockedText: {
    color: colors.text.muted,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.base.parchment,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default BadgesScreen;
