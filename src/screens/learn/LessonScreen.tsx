import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
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
import { RootStackParamList, Stamp } from '../../types';
import { LESSON_CONTENT } from '../../config/learningContent';
import { analyticsService } from '../../services/analytics';
import { AURA_REWARDS, COUNTRIES } from '../../config/constants';
import { SpeakerButton } from '../../components/ui/SpeakerButton';
import { speechService } from '../../services/audio';

import { getNodeById } from '../../config/learningPaths';

type RecallPrompt = {
  afterSlide: number;
  question: string;
  correctOption: string;
  wrongOption: string;
};

const RECALL_PROMPTS: Record<string, RecallPrompt> = {
  lang1: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Greetings in different languages',
    wrongOption: 'How to order food',
  },
  geo1: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Continents, oceans, and Earth\'s geography',
    wrongOption: 'Famous landmarks and cities',
  },
  cult1: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Festival traditions around the world',
    wrongOption: 'Traditional clothing styles',
  },
  hist1: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Ancient wonders like pyramids and the Great Wall',
    wrongOption: 'Modern inventions and technology',
  },
  food1: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Food and cuisine from different cultures',
    wrongOption: 'Sports and games worldwide',
  },
  sustain_travel: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Sustainable travel choices like trains and slow travel',
    wrongOption: 'The fastest ways to get to the airport',
  },
  sustain_food: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Food, waste reduction, and eating for the planet',
    wrongOption: 'How to cook fancy restaurant meals',
  },
  sustain_oceans: {
    afterSlide: 2,
    question: 'What did we just learn about?',
    correctOption: 'Oceans, plastic, and how to help beaches and marine life',
    wrongOption: 'How to sail around the world',
  },
  jp_intro: {
    afterSlide: 3,
    question: 'What did we just discover about Japan?',
    correctOption: 'Japan is an island chain with Mount Fuji and three writing scripts',
    wrongOption: 'Japan is a single large island famous for its deserts',
  },
  fr_intro: {
    afterSlide: 3,
    question: 'What did we just discover about France?',
    correctOption: 'France is the most visited country and the Eiffel Tower almost got torn down',
    wrongOption: 'France is famous for its tropical beaches and volcanoes',
  },
  culture1: {
    afterSlide: 3,
    question: 'What did we learn about world cultures?',
    correctOption: 'Tea ceremonies, griots, Bollywood, and the haka are all cultural traditions',
    wrongOption: 'All cultures celebrate the same festivals on the same dates',
  },
};

type CuriosityHook = {
  question: string;
  hint?: string;
};

const CURIOSITY_HOOKS: Record<string, CuriosityHook> = {
  lang1: { question: 'Did you know the word for "hello" changes depending on the TIME of day in many languages?', hint: 'Morning, afternoon, and evening all have different greetings!' },
  lang2: { question: 'In one country, pointing at a menu is more polite than trying to say the food name. Which country?', hint: 'It\'s an island nation in East Asia...' },
  lang3: { question: 'What if you\'re lost in a foreign city and can\'t use your phone? How would you ask for help?', hint: 'Just 3 words can save you anywhere.' },
  lang4: { question: '"Thank you" in one language literally means "I bow to you." Which language?', hint: 'It\'s spoken by over a billion people!' },
  geo1: { question: 'One continent has more countries than any other. Can you guess which one?', hint: 'It\'s also the second-largest continent.' },
  geo2: { question: 'There\'s a country that sits on TWO continents. Can you name it?', hint: 'It has a famous city with a bridge connecting Europe and Asia.' },
  cult1: { question: 'In one culture, a fierce war dance is performed before... sports matches! Where?', hint: 'It\'s an island nation in the Pacific.' },
  cult2: { question: 'In one country, leaving food on your plate is actually a COMPLIMENT. Where?', hint: 'It\'s in East Asia.' },
  hist1: { question: 'The Great Pyramid was already ancient when Cleopatra was born. How old was it by then?', hint: 'Over 2,000 years old — older than the Roman Empire!' },
  hist2: { question: 'Which civilization built a city so hidden in the mountains that the Spanish conquistadors never found it?', hint: 'It\'s in South America.' },
  jp_intro: { question: 'Japan has 6,852 islands — but did you know its writing system uses THREE different alphabets?', hint: 'Most kids learn the first one by age 6!' },
  fr_intro: { question: 'Which country gets MORE tourists per year than it has people living in it?', hint: 'It\'s famous for a very tall iron tower...' },
  food1: { question: 'One country has over 1,600 types of just ONE food. Which food and which country?', hint: 'It\'s a dairy product from a very fashionable European nation.' },
  culture1: { question: 'In one country, a storyteller called a "griot" memorizes the ENTIRE history of their people. Where?', hint: 'It\'s in West Africa.' },
  slang1: { question: '"No worries" isn\'t just a phrase — it\'s an entire LIFESTYLE in one country. Which one?', hint: 'Think kangaroos and beaches!' },
  etiq1: { question: 'In one country, removing your shoes before entering a home isn\'t just polite — it\'s required. Where?', hint: 'This same country has heated toilet seats!' },
  sustain_travel: { question: 'What if taking a slower trip could actually make it MORE fun AND help the planet?', hint: 'Some travelers are choosing trains over planes for this reason.' },
  sustain_food: { question: 'Nearly ONE THIRD of all food produced in the world is never eaten. Where does it all go?', hint: 'It doesn\'t just disappear...' },
  sustain_oceans: { question: 'The sunscreen you wear to the beach might be hurting the ocean. How?', hint: 'Some chemicals in sunscreen affect coral reefs.' },
};

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

function shuffleOptions<T>(arr: [T, T]): [T, T] {
  return Math.random() < 0.5 ? arr : [arr[1], arr[0]];
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
  const { lessonId } = route.params;
  const pathNodeId = route.params.pathNodeId;
  const lesson = LESSON_CONTENT[lessonId] || DEFAULT_CONTENT;
  const rawCountryPrefix = lessonId.includes('_') ? lessonId.split('_')[0] : undefined;
  const lessonCountryId = rawCountryPrefix && speechService.hasLanguageCode(rawCountryPrefix) ? rawCountryPrefix : undefined;
  const isLanguageLesson = lessonId.startsWith('lang') || lessonId.startsWith('slang') || !!lessonCountryId;
  const addAura = useStore(s => s.addAura);
  const updateLessonProgress = useStore(s => s.updateLessonProgress);
  const completeLessonToday = useStore(s => s.completeLessonToday);
  const checkAndAwardBadges = useStore(s => s.checkAndAwardBadges);
  const studyWithVisby = useStore(s => s.studyWithVisby);
  const addSkillPoints = useStore(s => s.addSkillPoints);
  const completePathNode = useStore(s => s.completePathNode);
  const checkDailyMissionCompletion = useStore(s => s.checkDailyMissionCompletion);
  const checkQuests = useStore(s => s.checkQuests);
  const autoAwardStamp = useStore(s => s.autoAwardStamp);

  const [showCuriosityHook, setShowCuriosityHook] = useState(!!CURIOSITY_HOOKS[lessonId]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStamp, setEarnedStamp] = useState<Stamp | null>(null);
  const [showingRecall, setShowingRecall] = useState(false);
  const [recallAnswered, setRecallAnswered] = useState(false);
  const [recallOptions, setRecallOptions] = useState<[string, string] | null>(null);

  const curiosityHook = CURIOSITY_HOOKS[lessonId];
  const recallPrompt = RECALL_PROMPTS[lessonId];
  const shouldShowRecallAfterCurrent = recallPrompt && recallPrompt.afterSlide === currentSlide && currentSlide < lesson.slides.length - 1;

  const isLastSlide = currentSlide === lesson.slides.length - 1;
  const progress = ((currentSlide + 1) / lesson.slides.length) * 100;
  const slide = lesson.slides[currentSlide];

  const handleNext = () => {
    if (showingRecall) return; // Recall handled by option tap + auto-advance
    if (isLastSlide) {
      const baseAura = AURA_REWARDS.LESSON_COMPLETE;
      const bonus = lessonId.startsWith('sustain_') ? AURA_REWARDS.SUSTAINABILITY_LESSON_BONUS : 0;
      addAura(baseAura + bonus);
      updateLessonProgress(lessonId, { completed: true, completedAt: new Date() });
      completeLessonToday();
      const category = lessonId.startsWith('sustain_') ? 'sustainability' : lessonId.replace(/\d+$/, '') || 'general';
      analyticsService.trackLessonComplete(lessonId, category);
      if (pathNodeId) completePathNode(pathNodeId);
      checkAndAwardBadges();
      studyWithVisby();
      if (lessonId.startsWith('sustain_')) {
        addSkillPoints('sustainability', 8);
        addSkillPoints('culture', 2);
        checkDailyMissionCompletion('complete_sustainability_lesson', 1);
        checkQuests();
      } else {
        addSkillPoints('language', 3);
        addSkillPoints('culture', 2);
      }
      const pathNode = pathNodeId ? getNodeById(pathNodeId) : null;
      if (pathNode?.countryId && pathNode?.skillCategory) {
        const country = COUNTRIES.find(c => c.id === pathNode.countryId);
        if (country) {
          const stamp = autoAwardStamp(country.name, country.countryCode, pathNode.skillCategory);
          if (stamp) setEarnedStamp(stamp);
        }
      }
      setIsFinished(true);
    } else if (shouldShowRecallAfterCurrent) {
      setRecallOptions(shuffleOptions([recallPrompt.correctOption, recallPrompt.wrongOption]));
      setShowingRecall(true);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleRecallOptionTap = () => {
    if (recallAnswered) return;
    setRecallAnswered(true);
    setTimeout(() => {
      setShowingRecall(false);
      setRecallAnswered(false);
      setRecallOptions(null);
      setCurrentSlide(prev => prev + 1);
    }, 1000);
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
                <Text variant="body" style={styles.resultsSubtitle}>Another step on your journey</Text>
                <View style={styles.scoreDivider} />
                <View style={styles.auraRow}>
                  <Icon name="sparkles" size={24} color={colors.reward.amber} />
                  <Text variant="h2" color={colors.reward.amber}>
                    +{AURA_REWARDS.LESSON_COMPLETE + (lessonId.startsWith('sustain_') ? AURA_REWARDS.SUSTAINABILITY_LESSON_BONUS : 0)}
                  </Text>
                  <Text variant="body" color={colors.text.secondary}> Aura earned</Text>
                </View>
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

  if (showCuriosityHook && curiosityHook) {
    return (
      <LinearGradient colors={['#2D1B69', '#1A0F3C', '#0F0826']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.hookContainer}>
            <View style={styles.hookContent}>
              <Icon name="sparkles" size={48} color="#FFD700" />
              <Text style={styles.hookLabel}>Before we begin...</Text>
              <Heading level={2} style={styles.hookQuestion}>{curiosityHook.question}</Heading>
              {curiosityHook.hint && (
                <Text style={styles.hookHint}>{curiosityHook.hint}</Text>
              )}
            </View>
            <Button
              title="Find out!"
              onPress={() => setShowCuriosityHook(false)}
              variant="reward"
              size="lg"
              fullWidth
            />
            <TouchableOpacity onPress={() => setShowCuriosityHook(false)} style={styles.hookSkip}>
              <Caption style={{ color: 'rgba(255,255,255,0.5)' }}>Skip to lesson</Caption>
            </TouchableOpacity>
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
          <Heading level={2}>Lesson</Heading>
          <View style={styles.headerSpacer} />
        </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ flex: 1 }}>
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
            {showingRecall && recallPrompt && recallOptions ? (
              <View style={styles.recallContent}>
                <Text variant="h3" style={styles.recallBadge}>Quick check!</Text>
                <Text variant="bodyLarge" align="center" style={styles.recallQuestion}>
                  {recallPrompt.question}
                </Text>
                <View style={styles.recallOptions}>
                  {recallOptions.map((opt) => {
                    const isCorrect = opt === recallPrompt.correctOption;
                    const showGreen = recallAnswered && isCorrect;
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.recallOption, showGreen && styles.recallOptionCorrect]}
                        onPress={handleRecallOptionTap}
                        disabled={recallAnswered}
                        activeOpacity={0.8}
                      >
                        <Text variant="body" style={showGreen ? styles.recallOptionTextCorrect : undefined}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View style={styles.slideContent}>
                {slide.imageUrl ? (
                  <View style={styles.slideImageWrap}>
                    <Image
                    source={{ uri: slide.imageUrl }}
                    style={styles.slideImage}
                    contentFit="cover"
                    transition={200}
                    placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
                  />
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
                {isLanguageLesson && (
                  <View style={styles.slideSpeakerRow}>
                    <SpeakerButton text={slide.text} countryId={lessonCountryId} size={22} />
                  </View>
                )}
              </View>
            )}
          </Card>
        </View>

        {/* Navigation */}
        {!showingRecall && (
          <View style={styles.footer}>
            <Button
              title={isLastSlide ? 'Complete Lesson' : 'Next'}
              onPress={handleNext}
              variant={isLastSlide ? 'reward' : 'primary'}
              size="lg"
              fullWidth
            />
          </View>
        )}
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
  slideSpeakerRow: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  recallContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  recallBadge: {
    color: colors.primary.wisteriaDark,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  recallQuestion: {
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  recallOptions: {
    width: '100%',
    gap: spacing.sm,
  },
  recallOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.primary.wisteriaFaded,
    borderWidth: 2,
    borderColor: colors.primary.wisteriaLight,
  },
  recallOptionCorrect: {
    backgroundColor: colors.success.honeydew,
    borderColor: colors.success.emerald,
  },
  recallOptionTextCorrect: {
    color: colors.success.emerald,
    fontWeight: '600',
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
  stampEarnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(184, 165, 224, 0.2)',
  },
  hookContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  hookContent: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  hookLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hookQuestion: {
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: spacing.md,
  },
  hookHint: {
    fontFamily: 'Nunito-Medium',
    fontSize: 15,
    color: 'rgba(255,215,0,0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  hookSkip: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
});

export default LessonScreen;
