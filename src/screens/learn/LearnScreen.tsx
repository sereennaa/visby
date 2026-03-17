import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { RootStackParamList } from '../../types';
import { LESSON_CONTENT } from '../../config/learningContent';
import { WORLD_DISHES } from '../../config/worldFoods';
import { getDueCount, getMasteryPercent, getSRStats } from '../../services/spacedRepetition';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const RECOMMENDED_LESSON_ORDER = ['lang1', 'lang2', 'lang3', 'lang4', 'slang1', 'slang2', 'slang3', 'cult1', 'cult2', 'cult3', 'hist1', 'hist2', 'etiq1', 'etiq2', 'geo1', 'geo2'];

type LearnScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Learn'>;
};

interface LessonCategory {
  id: string;
  title: string;
  icon: IconName;
  color: string;
  description: string;
  lessonsCount: number;
  completedCount: number;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: string;
  xpReward: number;
  completed: boolean;
  locked: boolean;
}

// Sample lesson categories
const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'language',
    title: 'Language Basics',
    icon: 'language',
    color: colors.calm.ocean,
    description: 'Essential phrases and words',
    lessonsCount: 20,
    completedCount: 0,
  },
  {
    id: 'slang',
    title: 'Local Slang',
    icon: 'chat',
    color: colors.reward.peachDark,
    description: 'Speak like a local',
    lessonsCount: 15,
    completedCount: 0,
  },
  {
    id: 'culture',
    title: 'Culture & Customs',
    icon: 'culture',
    color: colors.primary.wisteriaDark,
    description: 'Traditions and etiquette',
    lessonsCount: 25,
    completedCount: 0,
  },
  {
    id: 'history',
    title: 'History',
    icon: 'history',
    color: colors.success.emerald,
    description: 'Stories of the past',
    lessonsCount: 18,
    completedCount: 0,
  },
  {
    id: 'etiquette',
    title: 'Travel Etiquette',
    icon: 'etiquette',
    color: colors.accent.lavender,
    description: 'Do\'s and don\'ts',
    lessonsCount: 12,
    completedCount: 0,
  },
  {
    id: 'geography',
    title: 'Geography',
    icon: 'geography',
    color: colors.calm.sky,
    description: 'Maps and places',
    lessonsCount: 22,
    completedCount: 0,
  },
];

// Sample lessons
const SAMPLE_LESSONS: Lesson[] = [
  { id: 'lang1', title: 'Greetings & Hello', category: 'language', duration: '5 min', xpReward: 25, completed: false, locked: false },
  { id: 'lang2', title: 'Ordering Food', category: 'language', duration: '8 min', xpReward: 30, completed: false, locked: false },
  { id: 'slang1', title: 'Common Expressions', category: 'slang', duration: '6 min', xpReward: 25, completed: false, locked: false },
  { id: 'etiq1', title: 'Table Manners', category: 'etiquette', duration: '7 min', xpReward: 30, completed: false, locked: false },
  { id: 'cult1', title: 'Festival Traditions', category: 'culture', duration: '10 min', xpReward: 40, completed: false, locked: false },
  { id: 'hist1', title: 'Ancient Origins', category: 'history', duration: '12 min', xpReward: 50, completed: false, locked: true },
];

export const LearnScreen: React.FC<LearnScreenProps> = ({ navigation }) => {
  const bites = useStore(s => s.bites);
  const getLessonsCompletedToday = useStore(s => s.getLessonsCompletedToday);
  const lessonProgress = useStore(s => s.lessonProgress);
  const isLoading = useStore(s => s.isLoading);
  const flashcardSRData = useStore(s => s.flashcardSRData);

  const discoveredCount = useMemo(() => bites.filter(b => b.worldDishId).length, [bites]);
  const totalDishes = WORLD_DISHES.length;
  const undiscoveredCount = totalDishes - discoveredCount;

  const dailyGoal = 3;
  const lessonsToday = getLessonsCompletedToday();
  const dailyProgress = (lessonsToday / dailyGoal) * 100;

  const completedSet = useMemo(
    () => new Set(lessonProgress.filter(p => p.completed).map(p => p.lessonId)),
    [lessonProgress]
  );

  const nextLesson = useMemo(() => {
    const nextId = RECOMMENDED_LESSON_ORDER.find(id => !completedSet.has(id) && LESSON_CONTENT[id]);
    return nextId ? { id: nextId, title: LESSON_CONTENT[nextId].title } : null;
  }, [completedSet]);

  const completedByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    LESSON_CATEGORIES.forEach(cat => {
      map[cat.id] = lessonProgress.filter(p => p.lessonId.startsWith(cat.id) && p.completed).length;
    });
    return map;
  }, [lessonProgress]);

  const renderCategoryCard = (category: LessonCategory) => {
    const completed = completedByCategory[category.id] ?? 0;
    const progress = completed / category.lessonsCount * 100;
    
    return (
      <AnimatedPressable
        key={category.id}
        style={styles.categoryCard}
        onPress={() => navigation.navigate('LessonCategory', { categoryId: category.id })}
        scaleDown={0.97}
      >
        <LinearGradient
          colors={[category.color + '30', colors.base.cream]}
          style={styles.categoryGradient}
        >
          <View style={[styles.categoryIcon, { backgroundColor: category.color + '30' }]}>
            <Icon name={category.icon} size={28} color={category.color} />
          </View>
          <View style={styles.categoryInfo}>
            <Text variant="body" style={styles.categoryTitle}>
              {category.title}
            </Text>
            <Caption>{category.description}</Caption>
          </View>
          <View style={styles.categoryProgress}>
            <Caption>{completed}/{category.lessonsCount}</Caption>
            <View style={[styles.progressDot, { backgroundColor: category.color }]} />
          </View>
        </LinearGradient>
      </AnimatedPressable>
    );
  };

  const renderLessonCard = ({ item }: { item: Lesson }) => {
    const category = LESSON_CATEGORIES.find(c => c.id === item.category);
    
    return (
      <Card
        style={item.locked ? { ...styles.lessonCard, ...styles.lessonLocked } : styles.lessonCard}
        onPress={item.locked ? undefined : () => navigation.navigate('Lesson', { lessonId: item.id })}
      >
        <View style={styles.lessonContent}>
          <View style={[styles.lessonIcon, { backgroundColor: category?.color + '30' }]}>
            {item.locked ? (
              <Icon name="lock" size={20} color={colors.text.muted} />
            ) : item.completed ? (
              <Icon name="check" size={20} color={colors.success.emerald} />
            ) : (
              <Icon name={category?.icon || 'book'} size={20} color={category?.color || colors.text.secondary} />
            )}
          </View>
          <View style={styles.lessonInfo}>
            <Text variant="body" color={item.locked ? colors.text.muted : colors.text.primary}>
              {item.title}
            </Text>
            <View style={styles.lessonMeta}>
              <Caption>{item.duration}</Caption>
              <View style={styles.xpBadge}>
                <Icon name="sparkles" size={12} color={colors.reward.gold} />
                <Caption style={styles.xpText}>+{item.xpReward}</Caption>
              </View>
            </View>
          </View>
          {!item.locked && (
            <Icon name="chevronRight" size={16} color={colors.text.muted} />
          )}
        </View>
      </Card>
    );
  };

  return (
    <LinearGradient
      colors={[colors.calm.skyLight, colors.base.cream]}
      style={styles.container}
    >
      <FloatingParticles count={4} variant="dust" opacity={0.15} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Heading level={1}>Learn</Heading>
              <Caption>Expand your world knowledge</Caption>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Flashcards')}
              style={styles.flashcardsButton}
            >
              <Icon name="flashcard" size={24} color={colors.calm.ocean} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.skeletonBlock}>
              <SkeletonCard height={80} style={styles.skeletonRow} />
              <SkeletonCard height={100} style={styles.skeletonRow} />
              <View style={styles.skeletonRowWrap}>
                <SkeletonCard width={160} height={100} style={styles.skeletonSmall} />
                <SkeletonCard width={160} height={100} style={styles.skeletonSmall} />
              </View>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} height={72} style={styles.skeletonRow} />
              ))}
            </View>
          ) : (
            <>
          {/* Next up — suggested next step */}
          {nextLesson && (
            <AnimatedPressable
              style={styles.nextUpCard}
              onPress={() => navigation.navigate('Lesson', { lessonId: nextLesson.id })}
              scaleDown={0.97}
            >
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.calm.skyLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextUpGradient}
              >
                <View style={styles.nextUpLeft}>
                  <View style={styles.nextUpIconWrap}>
                    <Icon name="target" size={22} color={colors.primary.wisteriaDark} />
                  </View>
                  <View>
                    <Caption style={styles.nextUpLabel}>Next up</Caption>
                    <Text variant="body" style={styles.nextUpTitle}>{nextLesson.title}</Text>
                  </View>
                </View>
                <Icon name="chevronRight" size={20} color={colors.primary.wisteriaDark} />
              </LinearGradient>
            </AnimatedPressable>
          )}

          {/* Due for Review */}
          {flashcardSRData.length > 0 && (() => {
            const stats = getSRStats(flashcardSRData);
            const mastery = getMasteryPercent(flashcardSRData);
            if (stats.dueToday === 0 && mastery < 100) return null;
            return (
              <AnimatedPressable
                style={styles.dueReviewCard}
                onPress={() => navigation.navigate('Flashcards')}
                scaleDown={0.97}
              >
                <LinearGradient
                  colors={[colors.reward.peachLight, colors.base.cream]}
                  style={styles.dueReviewGradient}
                >
                  <View style={styles.dueReviewLeft}>
                    <View style={[styles.dueReviewIconWrap]}>
                      <Icon name="cards" size={22} color={colors.reward.peachDark} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={styles.dueReviewTitle}>
                        {stats.dueToday > 0 ? `${stats.dueToday} card${stats.dueToday > 1 ? 's' : ''} ready to review` : 'Flashcard Mastery'}
                      </Text>
                      <View style={styles.dueReviewStats}>
                        <Caption>{mastery}% mastered</Caption>
                        <Caption> · </Caption>
                        <Caption>{stats.learning} learning</Caption>
                        <Caption> · </Caption>
                        <Caption>{stats.mastered} mastered</Caption>
                      </View>
                    </View>
                  </View>
                  <Icon name="chevronRight" size={20} color={colors.reward.peachDark} />
                </LinearGradient>
              </AnimatedPressable>
            );
          })()}

          {/* Daily Goal */}
          <Card style={styles.dailyGoalCard}>
            <View style={styles.dailyGoalHeader}>
              <View style={styles.dailyGoalTitle}>
                <Icon name="target" size={24} color={colors.reward.gold} />
                <Text variant="h3">Daily Goal</Text>
              </View>
              <View style={styles.goalCount}>
                <Text variant="h2" color={colors.reward.gold}>{lessonsToday}</Text>
                <Text variant="body" color={colors.text.secondary}>/{dailyGoal}</Text>
              </View>
            </View>
            <ProgressBar progress={dailyProgress} variant="aura" height={8} />
            <Caption style={styles.goalCaption}>
              {lessonsToday >= dailyGoal
                ? 'Goal reached! Great work!'
                : `${dailyGoal - lessonsToday} more lesson${dailyGoal - lessonsToday > 1 ? 's' : ''} to reach your daily goal`}
            </Caption>
          </Card>

          {/* World Review - Interleaved Review */}
          <AnimatedPressable
            style={styles.worldReviewCard}
            onPress={() => navigation.navigate('Quiz', { mode: 'world_review' })}
            scaleDown={0.97}
          >
            <LinearGradient
              colors={['#FFE082', '#FFF8E1', colors.base.cream]}
              style={styles.worldReviewGradient}
            >
              <View style={styles.worldReviewLeft}>
                <View style={[styles.worldReviewIcon, { backgroundColor: '#FFB300' + '30' }]}>
                  <Icon name="globe" size={28} color="#FF8F00" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={styles.worldReviewTitle}>World Review</Text>
                  <Caption>Mix questions from all visited countries</Caption>
                </View>
              </View>
              <Icon name="chevronRight" size={22} color="#FF8F00" />
            </LinearGradient>
          </AnimatedPressable>

          {/* Geography: link to World Map */}
          <TouchableOpacity
            style={styles.worldMapCard}
            onPress={() => navigation.navigate('Main', { screen: 'Explore', params: { screen: 'WorldMap' } })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.calm.skyLight, colors.primary.wisteriaFaded]}
              style={styles.worldMapCardGradient}
            >
              <View style={styles.worldMapCardLeft}>
                <View style={[styles.worldMapCardIcon, { backgroundColor: colors.calm.ocean + '35' }]}>
                  <Icon name="map" size={26} color={colors.calm.ocean} />
                </View>
                <View>
                  <Text variant="body" style={styles.worldMapCardTitle}>Explore the World Map</Text>
                  <Caption style={styles.worldMapCardSub}>See where every country is on the globe</Caption>
                </View>
              </View>
              <Icon name="chevronRight" size={22} color={colors.primary.wisteriaDark} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Food Discovery */}
          <TouchableOpacity
            style={styles.foodDiscoveryCard}
            onPress={() => navigation.navigate('AddBite' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.foodDiscoveryGradient}>
              <View style={styles.foodDiscoveryLeft}>
                <Text style={styles.foodDiscoveryEmoji}>🍽️</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="h3" style={{ color: colors.reward.peachDark }}>Discover a Dish</Text>
                  <Caption>{discoveredCount} / {totalDishes} dishes discovered</Caption>
                  {undiscoveredCount > 0 && (
                    <Text variant="caption" style={{ color: colors.reward.peachDark, marginTop: 2 }}>
                      {undiscoveredCount} new {undiscoveredCount === 1 ? 'dish' : 'dishes'} to discover!
                    </Text>
                  )}
                </View>
              </View>
              <Icon name="chevronRight" size={20} color={colors.reward.peachDark} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Quiz')}
            >
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.base.cream]}
                style={styles.quickActionGradient}
              >
                <Icon name="quiz" size={32} color={colors.primary.wisteriaDark} />
                <Text variant="body">Take a Quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Flashcards')}
            >
              <LinearGradient
                colors={[colors.reward.peachLight, colors.base.cream]}
                style={styles.quickActionGradient}
              >
                <Icon name="flashcard" size={32} color={colors.reward.peachDark} />
                <Text variant="body">Flashcards</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Learning Path */}
          <TouchableOpacity
            style={styles.learningPathBanner}
            onPress={() => (navigation as any).navigate('LearningPath')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={[colors.primary.wisteriaFaded, colors.calm.skyLight]} style={styles.learningPathGradient}>
              <Icon name="map" size={28} color={colors.primary.wisteriaDark} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text variant="h3" style={{ color: colors.primary.wisteriaDark }}>Learning Path</Text>
                <Caption>Follow the skill tree to unlock new activities!</Caption>
              </View>
              <Icon name="chevronRight" size={20} color={colors.primary.wisteriaDark} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Mini-Games */}
          <View style={styles.section}>
            <Heading level={2} style={styles.sectionTitle}>
              Mini-Games
            </Heading>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesRow}>
              {([
                { key: 'WordMatch', label: 'Word Match', icon: 'language' as IconName, color: colors.primary.wisteriaDark, bg: colors.primary.wisteriaFaded },
                { key: 'MemoryCards', label: 'Memory', icon: 'flashcard' as IconName, color: colors.calm.ocean, bg: colors.calm.skyLight },
                { key: 'CookingGame', label: 'Cooking', icon: 'food' as IconName, color: colors.reward.peachDark, bg: colors.reward.peachLight },
                { key: 'TreasureHunt', label: 'Treasure Hunt', icon: 'compass' as IconName, color: colors.success.emerald, bg: colors.success.honeydew },
                { key: 'FlagMatch', label: 'Flag Match', icon: 'flag' as IconName, color: '#4A90D9', bg: '#CFE9F7' },
                { key: 'MapPin', label: 'Map Pin', icon: 'map' as IconName, color: '#6B8E23', bg: '#DFF5E1' },
                { key: 'CultureDressUp', label: 'Dress Up', icon: 'shirt' as IconName, color: colors.accent.coral, bg: colors.accent.blush },
                { key: 'SortCategorize', label: 'Sort & Match', icon: 'filter' as IconName, color: '#9B59B6', bg: '#F3E8FF' },
                { key: 'StoryBuilder', label: 'Story Builder', icon: 'book' as IconName, color: '#E67E22', bg: '#FFF3E0' },
              ] as const).map((game) => (
                <TouchableOpacity
                  key={game.key}
                  style={styles.gameCard}
                  onPress={() => (navigation as any).navigate(game.key)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[game.bg, colors.base.cream]}
                    style={styles.gameCardGradient}
                  >
                    <View style={[styles.gameIconWrap, { backgroundColor: game.color + '25' }]}>
                      <Icon name={game.icon} size={26} color={game.color} />
                    </View>
                    <Text variant="bodySmall" style={styles.gameLabel}>{game.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Heading level={2} style={styles.sectionTitle}>
              Topics
            </Heading>
            <View style={styles.categoriesGrid}>
              {LESSON_CATEGORIES.map(renderCategoryCard)}
            </View>
          </View>

          {/* Continue Learning */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heading level={2}>{lessonProgress.length > 0 ? 'Continue Learning' : 'Start Learning'}</Heading>
              <TouchableOpacity onPress={() => navigation.navigate('LessonCategory', { categoryId: LESSON_CATEGORIES[0].id })}>
                <Text variant="body" color={colors.primary.wisteriaDark}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            {SAMPLE_LESSONS.slice(0, 4).map(lesson => (
              <View key={lesson.id}>
                {renderLessonCard({ item: lesson })}
              </View>
            ))}
          </View>
            </>
          )}
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
  skeletonBlock: {
    gap: spacing.md,
  },
  skeletonRow: {
    width: '100%',
    alignSelf: 'stretch',
  },
  skeletonRowWrap: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  skeletonSmall: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  flashcardsButton: {
    padding: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.lg,
  },
  nextUpCard: {
    marginBottom: spacing.md,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  nextUpGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  nextUpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nextUpIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.wisteria + '35',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  nextUpLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.primary.wisteriaDark,
    marginBottom: 2,
  },
  nextUpTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
  },
  dueReviewCard: {
    marginBottom: spacing.md,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  dueReviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  dueReviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dueReviewIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.reward.peachDark + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dueReviewTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
  },
  dueReviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dailyGoalCard: {
    marginBottom: spacing.lg,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dailyGoalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  goalCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalCaption: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  worldReviewCard: {
    marginBottom: spacing.lg,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
  },
  worldReviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: spacing.radius.lg,
  },
  worldReviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  worldReviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  worldReviewTitle: {
    fontFamily: 'Nunito-Bold',
  },
  worldMapCard: {
    marginBottom: spacing.lg,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
  },
  worldMapCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaLight + '40',
    borderRadius: spacing.radius.lg,
  },
  worldMapCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  worldMapCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  worldMapCardTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
  },
  worldMapCardSub: {
    marginTop: 2,
    color: colors.text.secondary,
  },
  foodDiscoveryCard: {
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodDiscoveryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  foodDiscoveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  foodDiscoveryEmoji: {
    fontSize: 32,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionGradient: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    gap: spacing.sm,
  },
  categoryCard: {
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  categoryTitle: {
    fontFamily: 'Baloo2-Medium',
    marginBottom: 2,
  },
  categoryProgress: {
    alignItems: 'flex-end',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  lessonCard: {
    marginBottom: spacing.sm,
  },
  lessonLocked: {
    opacity: 0.6,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxs,
    gap: spacing.md,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.reward.peachLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
  },
  learningPathBanner: {
    marginBottom: spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  learningPathGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
  },
  gamesRow: {
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
  },
  gameCard: {
    width: 100,
    marginRight: spacing.sm,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
  },
  gameCardGradient: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: spacing.radius.lg,
  },
  gameIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    textAlign: 'center',
  },
  xpText: {
    color: colors.reward.amber,
    fontFamily: 'Nunito-Bold',
  },
});

export default LearnScreen;
