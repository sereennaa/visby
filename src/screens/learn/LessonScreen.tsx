import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
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
import { LESSON_CONTENT } from '../../config/learningContent';
import { AURA_REWARDS } from '../../config/constants';

const DEFAULT_CONTENT = {
  title: 'Lesson',
  slides: [
    { text: 'Welcome! New content is on the way.', icon: 'book' },
    { text: 'Check back soon for more exciting material!', icon: 'sparkles' },
  ],
};

type LessonScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<{ Lesson: { lessonId: string } }, 'Lesson'>;
};

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
  const { lessonId } = route.params;
  const lesson = LESSON_CONTENT[lessonId] || DEFAULT_CONTENT;
  const { addAura, updateLessonProgress, completeLessonToday, checkAndAwardBadges, studyWithVisby, addSkillPoints } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const isLastSlide = currentSlide === lesson.slides.length - 1;
  const progress = ((currentSlide + 1) / lesson.slides.length) * 100;
  const slide = lesson.slides[currentSlide];

  const handleNext = () => {
    if (isLastSlide) {
      addAura(AURA_REWARDS.LESSON_COMPLETE);
      updateLessonProgress(lessonId, { completed: true, completedAt: new Date() });
      completeLessonToday();
      checkAndAwardBadges();
      studyWithVisby();
      addSkillPoints('language', 3);
      addSkillPoints('culture', 2);
      setIsFinished(true);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  if (isFinished) {
    return (
      <LinearGradient
        colors={[colors.primary.wisteriaFaded, colors.reward.peachLight, colors.base.cream]}
        locations={[0, 0.4, 1]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultsContainer}>
            <View style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <View style={styles.resultsIconWrap}>
                  <Icon name="sparkles" size={48} color={colors.reward.gold} />
                  <Icon name="gift" size={56} color={colors.reward.gold} style={{ marginHorizontal: 4 }} />
                  <Icon name="sparkles" size={48} color={colors.reward.gold} />
                </View>
                <Heading level={1} style={styles.resultsTitle}>Level complete!</Heading>
                <Text variant="body" style={styles.resultsSubtitle}>Another step on your journey ✨</Text>
                <View style={styles.scoreDivider} />
                <View style={styles.auraRow}>
                  <Icon name="sparkles" size={24} color={colors.reward.amber} />
                  <Text variant="h2" color={colors.reward.amber}>+{AURA_REWARDS.LESSON_COMPLETE}</Text>
                  <Text variant="body" color={colors.text.secondary}> Aura earned</Text>
                </View>
              </View>
            </View>
            <Button
              title="Back to Learning"
              onPress={() => navigation.goBack()}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={2}>Lesson</Heading>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} variant="aura" height={8} />
          <Caption style={styles.progressLabel}>
            {currentSlide + 1} of {lesson.slides.length}
          </Caption>
        </View>

        {/* Slide Content */}
        <View style={styles.slideContainer}>
          <Card style={styles.slideCard}>
            <View style={styles.slideContent}>
              {slide.imageUrl ? (
                <View style={styles.slideImageWrap}>
                  <Image source={{ uri: slide.imageUrl }} style={styles.slideImage} resizeMode="cover" />
                </View>
              ) : (
                <View style={styles.slideIconWrap}>
                  <Icon name={(slide.icon || 'book') as IconName} size={72} color={colors.primary.wisteriaDark} />
                </View>
              )}
              <Heading level={2} style={styles.lessonTitle}>{lesson.title}</Heading>
              <Text variant="bodyLarge" align="center" style={styles.slideText}>
                {slide.text}
              </Text>
            </View>
          </Card>
        </View>

        {/* Navigation */}
        <View style={styles.footer}>
          <Button
            title={isLastSlide ? 'Complete Lesson' : 'Next'}
            onPress={handleNext}
            variant={isLastSlide ? 'reward' : 'primary'}
            size="lg"
            fullWidth
          />
        </View>
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
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  progressLabel: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  slideCard: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
  },
  slideImageWrap: {
    width: '100%', maxHeight: 200, borderRadius: 20, overflow: 'hidden', marginBottom: spacing.xl,
    backgroundColor: colors.base.skyLight, borderWidth: 1, borderColor: colors.primary.wisteriaLight + '50',
  },
  slideImage: { width: '100%', height: 200 },
  slideIconWrap: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  lessonTitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  slideText: {
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.lg,
  },
  resultsCard: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    borderRadius: 28,
    backgroundColor: colors.base.cream + 'ee',
    borderWidth: 1,
    borderColor: colors.primary.wisteriaLight + '40',
    shadowColor: colors.primary.wisteriaDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  resultsContent: {
    alignItems: 'center',
  },
  resultsIconWrap: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsTitle: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  resultsSubtitle: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  scoreDivider: {
    width: 80,
    height: 2,
    backgroundColor: colors.primary.wisteriaLight,
    marginBottom: spacing.md,
    borderRadius: 1,
  },
  auraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

export default LessonScreen;
