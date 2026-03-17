import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, FadeIn, FadeOut, FadeInDown } from 'react-native-reanimated';
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
import { RootStackParamList, SkillProgress, Stamp } from '../../types';
import { getAdaptiveQuiz, getAdaptiveMixedQuiz, getRandomQuiz, getDiscoveryQuizQuestions, QuizQuestion } from '../../config/learningContent';
import { getNodeById } from '../../config/learningPaths';
import { COUNTRIES } from '../../config/constants';

type QuizScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

const ComboBadge: React.FC<{ comboStreak: number }> = ({ comboStreak }) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      true
    );
  }, [comboStreak]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const label = comboStreak >= 6 ? 'FIRE! x2.5 Combo!' : comboStreak >= 4 ? 'x2 Combo!' : 'x1.5 Combo!';
  return (
    <Animated.View style={[styles.comboBadge, animatedStyle]}>
      <Text variant="caption" style={styles.comboBadgeText}>{label}</Text>
    </Animated.View>
  );
};

export const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const category = route.params?.category;
  const pathNodeId = route.params?.pathNodeId;
  const addAura = useStore(s => s.addAura);
  const checkAndAwardBadges = useStore(s => s.checkAndAwardBadges);
  const studyWithVisby = useStore(s => s.studyWithVisby);
  const addSkillPoints = useStore(s => s.addSkillPoints);
  const completePathNode = useStore(s => s.completePathNode);
  const checkDailyMissionCompletion = useStore(s => s.checkDailyMissionCompletion);
  const recordCategoryAnswer = useStore(s => s.recordCategoryAnswer);
  const checkQuests = useStore(s => s.checkQuests);
  const autoAwardStamp = useStore(s => s.autoAwardStamp);
  const getCategoryAccuracy = useStore(s => s.getCategoryAccuracy);
  const categoryAccuracy = useStore(s => s.categoryAccuracy);
  const bites = useStore(s => s.bites);
  const [refreshKey, setRefreshKey] = useState(0);
  const questions = useMemo<QuizQuestion[]>(() => {
    const count = 10;
    const discoveredIds = bites.filter(b => b.worldDishId).map(b => b.worldDishId!);
    const discoveryQs = discoveredIds.length > 0 ? getDiscoveryQuizQuestions(discoveredIds) : [];

    let baseQuestions: QuizQuestion[];
    if (category) {
      const accuracy = getCategoryAccuracy(category);
      baseQuestions = getAdaptiveQuiz(category, count, accuracy);
      if (category === 'food' && discoveryQs.length > 0) {
        const slots = Math.min(3, discoveryQs.length);
        const shuffled = [...discoveryQs].sort(() => Math.random() - 0.5);
        baseQuestions = [...baseQuestions.slice(0, count - slots), ...shuffled.slice(0, slots)];
      }
    } else {
      const accs: Record<string, number> = {};
      Object.keys(categoryAccuracy).forEach(cat => {
        accs[cat] = getCategoryAccuracy(cat);
      });
      if (Object.keys(accs).length > 0) {
        baseQuestions = getAdaptiveMixedQuiz(count, accs);
      } else {
        baseQuestions = getRandomQuiz(count);
      }
      if (discoveryQs.length > 0) {
        const slots = Math.min(2, discoveryQs.length);
        const shuffled = [...discoveryQs].sort(() => Math.random() - 0.5);
        baseQuestions = [...baseQuestions.slice(0, count - slots), ...shuffled.slice(0, slots)];
      }
    }
    return baseQuestions.sort(() => Math.random() - 0.5);
  }, [category, refreshKey, bites]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [comboStreak, setComboStreak] = useState(0);
  const [totalAuraEarned, setTotalAuraEarned] = useState(0);
  const [comboBroken, setComboBroken] = useState(false);
  const [lastCorrectAura, setLastCorrectAura] = useState<number | null>(null);
  const [earnedStamp, setEarnedStamp] = useState<Stamp | null>(null);
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

    const answerCategory = category ?? question.category;
    if (answerCategory) recordCategoryAnswer(answerCategory, isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 1);
      const nextCombo = comboStreak + 1;
      setComboStreak(nextCombo);
      const mult = nextCombo >= 6 ? 2.5 : nextCombo >= 4 ? 2.0 : nextCombo >= 2 ? 1.5 : 1.0;
      const boostedAura = Math.round(20 * mult);
      setTotalAuraEarned(prev => prev + boostedAura);
      addAura(boostedAura);
      setLastCorrectAura(boostedAura);
      setTimeout(() => setLastCorrectAura(null), 800);
    } else {
      setComboStreak(0);
      setComboBroken(true);
      setTimeout(() => setComboBroken(false), 1200);
    }

    advanceTimerRef.current = setTimeout(() => {
      if (isLastQuestion) {
        const finalScore = isCorrect ? score + 1 : score;
        checkAndAwardBadges({ quizPerfect: finalScore === questions.length });
        studyWithVisby();
        const categorySkillMap: Record<string, keyof SkillProgress> = {
          language: 'language',
          geography: 'geography',
          culture: 'culture',
          history: 'history',
          etiquette: 'culture',
          food: 'cooking',
          sustainability: 'sustainability',
        };
        const skill = categorySkillMap[category || 'geography'] || 'geography';
        addSkillPoints(skill, Math.round(finalScore * 2));
        if (pathNodeId) completePathNode(pathNodeId);
        checkDailyMissionCompletion('complete_lesson', 1);
        if (category === 'sustainability') {
          checkDailyMissionCompletion('complete_sustainability_lesson', 1);
          checkQuests();
        }
        const pathNode = pathNodeId ? getNodeById(pathNodeId) : null;
        if (pathNode?.countryId && pathNode?.skillCategory) {
          const countryDef = COUNTRIES.find(c => c.id === pathNode.countryId);
          if (countryDef) {
            const stamp = autoAwardStamp(countryDef.name, countryDef.countryCode, pathNode.skillCategory);
            if (stamp) setEarnedStamp(stamp);
          }
        }
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
                  <Text variant="h2" color={colors.reward.amber}>+{totalAuraEarned}</Text>
                  <Text variant="body" color={colors.text.secondary}>Aura earned</Text>
                </View>
                <ProgressBar progress={percentage} variant="aura" height={10} />
                <Caption style={styles.percentageText}>{percentage}% correct</Caption>
                {earnedStamp && (
                  <View style={styles.stampEarnedRow}>
                    <Icon name="stamp" size={22} color={colors.primary.wisteria} />
                    <View style={{ marginLeft: 8 }}>
                      <Text variant="body" color={colors.primary.wisteriaDark}>New stamp earned!</Text>
                      <Caption color={colors.text.secondary}>{earnedStamp.locationName}</Caption>
                    </View>
                  </View>
                )}
              </View>
            </Card>
            <Button
              title="Try Another Quiz"
              onPress={() => {
                setCurrentQuestion(0);
                setSelectedOption(null);
                setScore(0);
                setIsFinished(false);
                setComboStreak(0);
                setTotalAuraEarned(0);
                setComboBroken(false);
                setLastCorrectAura(null);
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
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
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
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <ProgressBar progress={progress} variant="level" height={8} />
            </View>
            {comboStreak >= 2 && (
              <ComboBadge comboStreak={comboStreak} />
            )}
          </View>
          <View style={styles.progressLabels}>
            <Caption style={styles.progressLabel}>
              Question {currentQuestion + 1} of {questions.length}
            </Caption>
            {comboBroken && (
              <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.comboBrokenText}>
                Combo broken!
              </Animated.Text>
            )}
            {lastCorrectAura !== null && (
              <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.auraPopText}>
                +{lastCorrectAura}
              </Animated.Text>
            )}
          </View>
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    minWidth: 0,
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
    minHeight: 24,
  },
  progressLabel: {
    textAlign: 'center',
  },
  comboBadge: {
    backgroundColor: colors.reward.amber,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.md,
  },
  comboBadgeText: {
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
  },
  comboBrokenText: {
    color: colors.status.error,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
  },
  auraPopText: {
    color: colors.reward.gold,
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
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
  stampEarnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(184, 165, 224, 0.2)',
  },
});

export default QuizScreen;
