import React from 'react';
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
import { RootStackParamList } from '../../types';

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
  const { getLessonsCompletedToday, lessonProgress } = useStore();

  const dailyGoal = 3;
  const lessonsToday = getLessonsCompletedToday();
  const dailyProgress = (lessonsToday / dailyGoal) * 100;

  const getCompletedForCategory = (categoryId: string): number =>
    lessonProgress.filter(p => p.lessonId.startsWith(categoryId) && p.completed).length;

  const renderCategoryCard = (category: LessonCategory) => {
    const completed = getCompletedForCategory(category.id);
    const progress = completed / category.lessonsCount * 100;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={styles.categoryCard}
        onPress={() => navigation.navigate('LessonCategory', { categoryId: category.id })}
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
      </TouchableOpacity>
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
