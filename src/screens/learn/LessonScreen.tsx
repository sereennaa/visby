import React, { useState } from 'react';
import {
  View,
  StyleSheet,
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
import { Icon } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { LESSON_CONTENT } from '../../config/learningContent';

const DEFAULT_CONTENT = {
  title: 'Lesson',
  slides: [
    { text: 'Welcome! New content is on the way.', emoji: '📚' },
    { text: 'Check back soon for more exciting material!', emoji: '✨' },
  ],
};

type LessonScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<{ Lesson: { lessonId: string } }, 'Lesson'>;
};

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
  const { lessonId } = route.params;
  const lesson = LESSON_CONTENT[lessonId] || DEFAULT_CONTENT;
  const { addAura, updateLessonProgress, completeLessonToday } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const isLastSlide = currentSlide === lesson.slides.length - 1;
  const progress = ((currentSlide + 1) / lesson.slides.length) * 100;
  const slide = lesson.slides[currentSlide];

  const handleNext = () => {
    if (isLastSlide) {
      addAura(50);
      updateLessonProgress(lessonId, { completed: true, completedAt: new Date() });
      completeLessonToday();
      setIsFinished(true);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  if (isFinished) {
    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Text variant="heroTitle" align="center" style={styles.resultsEmoji}>
                  🎉
                </Text>
                <Heading level={1} style={styles.resultsTitle}>Lesson Complete!</Heading>
                <View style={styles.scoreDivider} />
                <View style={styles.auraRow}>
                  <Icon name="sparkles" size={24} color={colors.reward.gold} />
                  <Text variant="h2" color={colors.reward.amber}>+50</Text>
                  <Text variant="body" color={colors.text.secondary}>Aura earned</Text>
                </View>
              </View>
            </Card>
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
              <Text variant="heroTitle" align="center" style={styles.emoji}>
                {slide.emoji}
              </Text>
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
  emoji: {
    fontSize: 72,
    marginBottom: spacing.xl,
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
  },
  resultsContent: {
    alignItems: 'center',
  },
  resultsEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scoreDivider: {
    width: 80,
    height: 2,
    backgroundColor: colors.primary.wisteriaLight,
    marginBottom: spacing.md,
  },
  auraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

export default LessonScreen;
