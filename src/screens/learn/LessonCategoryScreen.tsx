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
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';

const CATEGORIES: Record<string, { title: string; icon: IconName; color: string; description: string }> = {
  language: { title: 'Language Basics', icon: 'language', color: '#7FBDE8', description: 'Essential phrases and words' },
  slang: { title: 'Local Slang', icon: 'chat', color: '#FFC780', description: 'Speak like a local' },
  culture: { title: 'Culture & Customs', icon: 'culture', color: '#9B89D0', description: 'Traditions and etiquette' },
  history: { title: 'History', icon: 'history', color: '#5CB85C', description: 'Stories of the past' },
  etiquette: { title: 'Travel Etiquette', icon: 'etiquette', color: '#E6E6FA', description: "Do's and don'ts" },
  geography: { title: 'Geography', icon: 'geography', color: '#CFE9F7', description: 'Maps and places' },
};

const LESSONS_BY_CATEGORY: Record<string, Array<{ id: string; title: string; duration: string; xpReward: number; completed: boolean; locked: boolean }>> = {
  language: [
    { id: 'lang1', title: 'Greetings & Hello', duration: '5 min', xpReward: 25, completed: false, locked: false },
    { id: 'lang2', title: 'Ordering Food', duration: '8 min', xpReward: 30, completed: false, locked: false },
    { id: 'lang3', title: 'Asking for Directions', duration: '7 min', xpReward: 30, completed: false, locked: false },
    { id: 'lang4', title: 'Numbers & Counting', duration: '6 min', xpReward: 25, completed: false, locked: true },
  ],
  slang: [
    { id: 'slang1', title: 'Common Expressions', duration: '6 min', xpReward: 25, completed: false, locked: false },
    { id: 'slang2', title: 'Funny Phrases', duration: '5 min', xpReward: 25, completed: false, locked: false },
    { id: 'slang3', title: 'Street Talk', duration: '7 min', xpReward: 30, completed: false, locked: true },
  ],
  culture: [
    { id: 'cult1', title: 'Festival Traditions', duration: '10 min', xpReward: 40, completed: false, locked: false },
    { id: 'cult2', title: 'Family Values', duration: '8 min', xpReward: 35, completed: false, locked: false },
    { id: 'cult3', title: 'Music & Dance', duration: '9 min', xpReward: 35, completed: false, locked: false },
  ],
  history: [
    { id: 'hist1', title: 'Ancient Origins', duration: '12 min', xpReward: 50, completed: false, locked: false },
    { id: 'hist2', title: 'Famous Leaders', duration: '10 min', xpReward: 45, completed: false, locked: false },
  ],
  etiquette: [
    { id: 'etiq1', title: 'Table Manners', duration: '7 min', xpReward: 30, completed: false, locked: false },
    { id: 'etiq2', title: 'Greeting Customs', duration: '6 min', xpReward: 25, completed: false, locked: false },
  ],
  geography: [
    { id: 'geo1', title: 'Continents & Oceans', duration: '8 min', xpReward: 30, completed: false, locked: false },
    { id: 'geo2', title: 'Famous Landmarks', duration: '10 min', xpReward: 40, completed: false, locked: false },
  ],
};

type LessonCategoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<{ LessonCategory: { categoryId: string } }, 'LessonCategory'>;
};

export const LessonCategoryScreen: React.FC<LessonCategoryScreenProps> = ({ navigation, route }) => {
  const { categoryId } = route.params;
  const category = CATEGORIES[categoryId];
  const lessons = LESSONS_BY_CATEGORY[categoryId] || [];
  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (!category) {
    return (
      <LinearGradient colors={[colors.calm.skyLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.errorContainer}>
            <Heading level={2}>Category not found</Heading>
            <Button title="Go Back" onPress={() => navigation.goBack()} size="md" variant="primary" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[category.color + '30', colors.base.cream]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleRow}>
              <Icon name={category.icon} size={28} color={category.color} />
              <Heading level={1}>{category.title}</Heading>
            </View>
          </View>
          <Caption style={styles.headerDescription}>{category.description}</Caption>

          {/* Progress Card */}
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text variant="h3">Your Progress</Text>
              <Text variant="body" color={category.color}>
                {completedCount}/{lessons.length} lessons
              </Text>
            </View>
            <ProgressBar progress={progress} variant="aura" height={10} />
            <Caption style={styles.progressCaption}>
              {completedCount === lessons.length
                ? 'All lessons complete! Great work!'
                : `${lessons.length - completedCount} lesson${lessons.length - completedCount > 1 ? 's' : ''} remaining`}
            </Caption>
          </Card>

          {/* Lessons List */}
          <View style={styles.lessonsSection}>
            <Heading level={2} style={styles.sectionTitle}>Lessons</Heading>
            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                style={[styles.lessonCard, lesson.locked && styles.lessonLocked]}
                onPress={lesson.locked ? undefined : () => navigation.navigate('Lesson', { lessonId: lesson.id })}
              >
                <View style={styles.lessonContent}>
                  <View style={styles.lessonNumber}>
                    <Text variant="body" color={lesson.locked ? colors.text.muted : colors.text.inverse}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={[
                    styles.lessonIcon,
                    { backgroundColor: lesson.locked ? colors.text.light + '30' : category.color + '30' },
                  ]}>
                    {lesson.locked ? (
                      <Icon name="lock" size={20} color={colors.text.muted} />
                    ) : lesson.completed ? (
                      <Icon name="check" size={20} color={colors.success.emerald} />
                    ) : (
                      <Icon name={category.icon} size={20} color={category.color} />
                    )}
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text
                      variant="body"
                      color={lesson.locked ? colors.text.muted : colors.text.primary}
                    >
                      {lesson.title}
                    </Text>
                    <View style={styles.lessonMeta}>
                      <View style={styles.metaItem}>
                        <Icon name="time" size={12} color={colors.text.muted} />
                        <Caption>{lesson.duration}</Caption>
                      </View>
                      <View style={styles.xpBadge}>
                        <Icon name="sparkles" size={12} color={colors.reward.gold} />
                        <Caption style={styles.xpText}>+{lesson.xpReward}</Caption>
                      </View>
                    </View>
                  </View>
                  {!lesson.locked && (
                    <Icon name="chevronRight" size={16} color={colors.text.muted} />
                  )}
                </View>
              </Card>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  headerDescription: {
    marginLeft: spacing.xxxl + spacing.sm,
    marginBottom: spacing.lg,
  },
  progressCard: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressCaption: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  lessonsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
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
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.wisteria,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
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
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  xpText: {
    color: colors.reward.amber,
  },
});

export default LessonCategoryScreen;
