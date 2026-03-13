import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { BADGE_DEFINITIONS } from '../../config/constants';
import { RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');
const CARD_GAP = spacing.md;
const CARD_WIDTH = (width - spacing.screenPadding * 2 - CARD_GAP) / 2;

type BadgesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Badges'>;
};

type BadgeDef = (typeof BADGE_DEFINITIONS)[number];

const REQUIREMENT_LABELS: Record<string, string> = {
  stamp_count: 'stamps',
  bite_count: 'bites',
  country_count: 'countries',
  streak: 'day streak',
  stamp_type: 'stamps',
  lesson_count: 'lessons',
  perfect_quiz: 'perfect quizzes',
};

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ navigation }) => {
  const { stamps, bites, badges, user, lessonProgress } = useStore();

  const earnedBadgeIds = new Set(badges.map((b) => b.badgeId));

  const getProgress = (badge: BadgeDef): number => {
    switch (badge.type) {
      case 'stamp_count':
        return stamps.length;
      case 'bite_count':
        return bites.length;
      case 'country_count':
        return user?.countriesVisited ?? 0;
      case 'streak':
        return user?.longestStreak ?? 0;
      case 'stamp_type': {
        const stampType = (badge as any).stampType;
        return stampType
          ? stamps.filter((s) => s.type === stampType).length
          : 0;
      }
      case 'lesson_count':
        return lessonProgress.filter((lp) => lp.completed).length;
      case 'perfect_quiz':
        return lessonProgress.filter((lp) => lp.quizScore === 100).length;
      default:
        return 0;
    }
  };

  const renderBadge = ({ item }: { item: BadgeDef }) => {
    const earned = earnedBadgeIds.has(item.id);
    const current = getProgress(item);
    const ratio = Math.min(current / item.requirement, 1);
    const label = REQUIREMENT_LABELS[item.type] || 'actions';

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
            : `${current}/${item.requirement} ${label}`}
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Badges</Heading>
          <View style={styles.countBadge}>
            <Text variant="body" color={colors.primary.wisteriaDark}>
              {badges.length}/{BADGE_DEFINITIONS.length}
            </Text>
          </View>
        </View>

        <FlatList
          data={BADGE_DEFINITIONS}
          renderItem={renderBadge}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
