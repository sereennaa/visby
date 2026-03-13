import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
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

const LESSON_CONTENT: Record<string, { title: string; slides: Array<{ text: string; emoji: string }> }> = {
  lang1: {
    title: 'Greetings & Hello',
    slides: [
      { text: 'Hello! In many languages, the greeting changes based on the time of day.', emoji: '👋' },
      { text: '"Bonjour" means good day in French. Use it in the morning and afternoon!', emoji: '🇫🇷' },
      { text: '"Konnichiwa" is hello in Japanese. It literally means "this day is..."', emoji: '🇯🇵' },
      { text: '"Hola" is hello in Spanish. Simple and friendly!', emoji: '🇲🇽' },
      { text: 'Great job! You learned 3 new greetings. Try using them today!', emoji: '⭐' },
    ],
  },
  lang2: {
    title: 'Ordering Food',
    slides: [
      { text: 'Hungry? Let\'s learn how to order food around the world!', emoji: '🍽️' },
      { text: 'In France, say "Je voudrais..." (I would like...) to be polite.', emoji: '🇫🇷' },
      { text: 'In Japan, point at the menu and say "Kore o kudasai" (This one, please).', emoji: '🇯🇵' },
      { text: '"La cuenta, por favor" means "The check, please" in Spanish.', emoji: '🇪🇸' },
    ],
  },
  lang3: {
    title: 'Asking for Directions',
    slides: [
      { text: 'Lost? No worries — let\'s learn to ask for directions!', emoji: '🗺️' },
      { text: '"Où est...?" means "Where is...?" in French.', emoji: '🇫🇷' },
      { text: '"Sumimasen, ... wa doko desu ka?" means "Excuse me, where is...?" in Japanese.', emoji: '🇯🇵' },
      { text: 'Pointing at a map is universal — and always helpful!', emoji: '📍' },
    ],
  },
  slang1: {
    title: 'Common Expressions',
    slides: [
      { text: 'Every language has fun everyday expressions!', emoji: '💬' },
      { text: '"C\'est la vie" — That\'s life! A classic French expression.', emoji: '🇫🇷' },
      { text: '"No worries" is Australian for "it\'s all good, mate!"', emoji: '🇦🇺' },
    ],
  },
  cult1: {
    title: 'Festival Traditions',
    slides: [
      { text: 'Festivals are celebrations of culture, food, and togetherness!', emoji: '🎉' },
      { text: 'Diwali, the Festival of Lights, is celebrated across India.', emoji: '🪔' },
      { text: 'Carnival in Brazil features samba, costumes, and parades!', emoji: '🎭' },
      { text: 'Hanami in Japan is the tradition of enjoying cherry blossoms.', emoji: '🌸' },
      { text: 'Every festival tells a unique story about its people.', emoji: '🌍' },
    ],
  },
  hist1: {
    title: 'Ancient Origins',
    slides: [
      { text: 'History helps us understand where we came from!', emoji: '📜' },
      { text: 'The Pyramids of Giza are over 4,500 years old.', emoji: '🏛️' },
      { text: 'The Great Wall of China stretches over 13,000 miles!', emoji: '🇨🇳' },
    ],
  },
};

const DEFAULT_CONTENT = {
  title: 'Lesson',
  slides: [
    { text: 'Welcome to this lesson! New content is on the way.', emoji: '📚' },
    { text: 'Check back soon for more exciting learning material!', emoji: '✨' },
  ],
};

type LessonScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<{ Lesson: { lessonId: string } }, 'Lesson'>;
};

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
  const { lessonId } = route.params;
  const lesson = LESSON_CONTENT[lessonId] || DEFAULT_CONTENT;
  const { addAura } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const isLastSlide = currentSlide === lesson.slides.length - 1;
  const progress = ((currentSlide + 1) / lesson.slides.length) * 100;
  const slide = lesson.slides[currentSlide];

  const handleNext = () => {
    if (isLastSlide) {
      addAura(50);
      Alert.alert('Lesson Complete!', '+50 Aura ✨', [
        { text: 'Awesome!', onPress: () => navigation.goBack() },
      ]);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

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
});

export default LessonScreen;
