import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { Icon, IconName } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { getQuizByCategory, getRandomQuiz, QuizQuestion } from '../../config/learningContent';

type QuizScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

export const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const category = route.params?.category;
  const { addAura, checkAndAwardBadges, studyWithVisby } = useStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const questions = useMemo<QuizQuestion[]>(
    () => category ? getQuizByCategory(category, 10) : getRandomQuiz(10),
    [category, refreshKey],
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const question = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + (isFinished ? 1 : 0)) / questions.length) * 100 : 0;
  const isLastQuestion = questions.length > 0 && currentQuestion === questions.length - 1;

  if (questions.length === 0) {
    return (
      <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Icon name="quiz" size={64} color={colors.text.muted} />
                <Heading level={2} style={styles.resultsTitle}>No Questions Available</Heading>
                <Caption>Check back later for new quiz questions.</Caption>
              </View>
            </Card>
            <Button title="Go Back" onPress={() => navigation.goBack()} variant="primary" size="lg" fullWidth />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const isCorrect = index === question.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    advanceTimerRef.current = setTimeout(() => {
      if (isLastQuestion) {
        const finalScore = isCorrect ? score + 1 : score;
        const auraEarned = finalScore * 20;
        addAura(auraEarned);
        checkAndAwardBadges({ quizPerfect: finalScore === questions.length });
        studyWithVisby();
        setIsFinished(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      }
    }, 1200);
  };

  const getOptionStyle = (index: number) => {
    if (selectedOption === null) return {};
    if (index === question.correct) {
      return { backgroundColor: colors.success.honeydew, borderColor: colors.success.emerald, borderWidth: 2 };
    }
    if (index === selectedOption && index !== question.correct) {
      return { backgroundColor: colors.status.errorLight, borderColor: colors.status.error, borderWidth: 2 };
    }
    return { opacity: 0.5 };
  };

  const getOptionTextColor = (index: number) => {
    if (selectedOption === null) return colors.text.primary;
    if (index === question.correct) return colors.success.emerald;
    if (index === selectedOption && index !== question.correct) return colors.status.error;
    return colors.text.muted;
  };

  if (isFinished) {
    const auraEarned = score * 20;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <View style={styles.resultsIconWrap}>
                  <Icon
                    name={(percentage >= 80 ? 'trophy' : percentage >= 60 ? 'star' : 'hand') as IconName}
                    size={64}
                    color={percentage >= 80 ? colors.reward.gold : percentage >= 60 ? colors.reward.amber : colors.primary.wisteriaDark}
                  />
                </View>
                <Heading level={1} style={styles.resultsTitle}>Quiz Complete!</Heading>
                <View style={styles.scoreRow}>
                  <Text variant="h2" color={colors.primary.wisteriaDark}>
                    {score}/{questions.length}
                  </Text>
                  <Caption>correct answers</Caption>
                </View>
                <View style={styles.scoreDivider} />
                <View style={styles.auraRow}>
                  <Icon name="sparkles" size={24} color={colors.reward.gold} />
                  <Text variant="h2" color={colors.reward.amber}>+{auraEarned}</Text>
                  <Text variant="body" color={colors.text.secondary}>Aura earned</Text>
                </View>
                <ProgressBar progress={percentage} variant="aura" height={10} />
                <Caption style={styles.percentageText}>{percentage}% correct</Caption>
              </View>
            </Card>
            <Button
              title="Try Another Quiz"
              onPress={() => {
                setCurrentQuestion(0);
                setSelectedOption(null);
                setScore(0);
                setIsFinished(false);
                setRefreshKey(k => k + 1);
              }}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="Back to Learning"
              onPress={() => navigation.goBack()}
              variant="secondary"
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
          <Heading level={2}>Quiz Time!</Heading>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} variant="level" height={8} />
          <Caption style={styles.progressLabel}>
            Question {currentQuestion + 1} of {questions.length}
          </Caption>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Card style={styles.questionCard}>
            <View style={styles.questionBadge}>
              <Icon name="quiz" size={24} color={colors.primary.wisteriaDark} />
            </View>
            <Heading level={2} style={styles.questionText}>{question.question}</Heading>
          </Card>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectOption(index)}
                disabled={selectedOption !== null}
                activeOpacity={0.8}
              >
                <Card style={[styles.optionCard, getOptionStyle(index)]}>
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionLetter,
                      selectedOption !== null && index === question.correct && { backgroundColor: colors.success.emerald },
                      selectedOption === index && index !== question.correct && { backgroundColor: colors.status.error },
                    ]}>
                      <Text variant="body" color={colors.text.inverse}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text variant="body" color={getOptionTextColor(index)} style={styles.optionText}>
                      {option}
                    </Text>
                    {selectedOption !== null && index === question.correct && (
                      <Icon name="check" size={20} color={colors.success.emerald} />
                    )}
                    {selectedOption === index && index !== question.correct && (
                      <Icon name="close" size={20} color={colors.status.error} />
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
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
  questionContainer: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  questionCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  questionBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  questionText: {
    textAlign: 'center',
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  optionCard: {
    marginBottom: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.wisteria,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
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
  resultsIconWrap: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  resultsTitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scoreRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreDivider: {
    width: 80,
    height: 2,
    backgroundColor: colors.primary.wisteriaLight,
    marginVertical: spacing.md,
    borderRadius: 1,
  },
  auraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  percentageText: {
    marginTop: spacing.sm,
  },
});

export default QuizScreen;
