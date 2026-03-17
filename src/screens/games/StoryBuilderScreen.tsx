import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { analyticsService } from '../../services/analytics';
import { soundService } from '../../services/sound';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { GameLaunchSequence } from '../../components/effects/GameLaunchSequence';
import { GameCelebration, getCelebrationTier } from '../../components/effects/GameCelebration';
import { SpeakerButton } from '../../components/ui/SpeakerButton';
import type { RootStackParamList } from '../../types';
import { getAllStoryTemplates, getStoryTemplateForCountry } from '../../config/countryGameContent';

interface StoryTemplate {
  id: string;
  title: string;
  countryId: string;
  countryName: string;
  segments: StorySegment[];
}

interface StorySegment {
  text: string;
  blank?: {
    answer: string;
    options: string[];
  };
}

const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: 'jp_tea',
    title: 'Tea Time in Japan',
    countryId: 'jp',
    countryName: 'Japan',
    segments: [
      { text: 'In Japan, there is a beautiful tradition called the ' },
      { text: '', blank: { answer: 'tea ceremony', options: ['tea ceremony', 'pizza party', 'swimming race', 'pillow fight'] } },
      { text: '. It takes place in a special room called a ' },
      { text: '', blank: { answer: 'chashitsu', options: ['chashitsu', 'gymnasium', 'library', 'kitchen'] } },
      { text: '. The host carefully prepares ' },
      { text: '', blank: { answer: 'matcha', options: ['matcha', 'coffee', 'lemonade', 'hot cocoa'] } },
      { text: ' green tea using a bamboo whisk. Before drinking, guests ' },
      { text: '', blank: { answer: 'bow', options: ['bow', 'jump', 'clap', 'whistle'] } },
      { text: ' to show respect and gratitude. The tea ceremony teaches patience, respect, and mindfulness.' },
    ],
  },
  {
    id: 'mx_dia',
    title: 'Day of the Dead',
    countryId: 'mx',
    countryName: 'Mexico',
    segments: [
      { text: 'Every year on November 1st and 2nd, Mexico celebrates ' },
      { text: '', blank: { answer: 'Día de los Muertos', options: ['Día de los Muertos', 'Christmas', 'New Year', 'Easter'] } },
      { text: '. Families build colorful altars called ' },
      { text: '', blank: { answer: 'ofrendas', options: ['ofrendas', 'piñatas', 'sombreros', 'tacos'] } },
      { text: ' to remember loved ones who have passed. They decorate with bright ' },
      { text: '', blank: { answer: 'marigold flowers', options: ['marigold flowers', 'blue roses', 'white daisies', 'green cactus'] } },
      { text: ' and offer favorite foods and drinks. It is a joyful celebration of ' },
      { text: '', blank: { answer: 'life and memory', options: ['life and memory', 'scary things', 'winter snow', 'homework'] } },
      { text: '!' },
    ],
  },
  {
    id: 'it_pasta',
    title: 'The Art of Italian Pasta',
    countryId: 'it',
    countryName: 'Italy',
    segments: [
      { text: 'Italy is famous for its ' },
      { text: '', blank: { answer: 'pasta', options: ['pasta', 'burgers', 'fish and chips', 'tacos'] } },
      { text: ', with over 300 different shapes! The word "spaghetti" means "' },
      { text: '', blank: { answer: 'little strings', options: ['little strings', 'big circles', 'tiny stars', 'small clouds'] } },
      { text: '" in Italian. In Italy, pasta is always cooked ' },
      { text: '', blank: { answer: 'al dente', options: ['al dente', 'until mushy', 'frozen', 'raw'] } },
      { text: ', which means "to the tooth" — slightly firm when you bite it. Italians eat pasta as a ' },
      { text: '', blank: { answer: 'first course', options: ['first course', 'dessert', 'breakfast only', 'midnight snack'] } },
      { text: ' before the main dish. Buon appetito!' },
    ],
  },
  {
    id: 'no_aurora',
    title: 'The Northern Lights',
    countryId: 'no',
    countryName: 'Norway',
    segments: [
      { text: 'In Norway, you can see the magical ' },
      { text: '', blank: { answer: 'Northern Lights', options: ['Northern Lights', 'shooting stars', 'rainbows', 'fireworks'] } },
      { text: ' dancing across the sky. Scientists call them ' },
      { text: '', blank: { answer: 'Aurora Borealis', options: ['Aurora Borealis', 'Luna Eclipse', 'Solar Winds', 'Star Dust'] } },
      { text: '. They happen when particles from the ' },
      { text: '', blank: { answer: 'sun', options: ['sun', 'moon', 'stars', 'comets'] } },
      { text: ' hit gases in Earth\'s atmosphere. The Vikings believed the lights were reflections from the ' },
      { text: '', blank: { answer: "Valkyries' armor", options: ["Valkyries' armor", 'ocean waves', 'mountain ice', 'dragon fire'] } },
      { text: '. The best time to see them is during the dark winter months.' },
    ],
  },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StoryBuilder'>;
  route: RouteProp<RootStackParamList, 'StoryBuilder'>;
};

const GAME_NAME = 'StoryBuilder';

export const StoryBuilderScreen: React.FC<Props> = ({ navigation, route }) => {
  const pathNodeId = route.params?.pathNodeId;
  const countryId = route.params?.countryId ?? null;
  const addAura = useStore(s => s.addAura);
  const addSkillPoints = useStore(s => s.addSkillPoints);
  const incrementGameStat = useStore(s => s.incrementGameStat);
  const checkDailyMissionCompletion = useStore(s => s.checkDailyMissionCompletion);
  const studyWithVisby = useStore(s => s.studyWithVisby);
  const completePathNode = useStore(s => s.completePathNode);

  React.useEffect(() => {
    analyticsService.trackGameStart(GAME_NAME);
  }, []);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);
  const templates = useMemo<StoryTemplate[]>(() => {
    const generated = getAllStoryTemplates() as StoryTemplate[];
    const byId = new Map<string, StoryTemplate>();
    [...generated, ...STORY_TEMPLATES].forEach((template) => {
      if (!byId.has(template.id)) byId.set(template.id, template);
    });
    return [...byId.values()];
  }, []);

  const [storyIndex, setStoryIndex] = useState(() => {
    if (!countryId) return 0;
    const target = getStoryTemplateForCountry(countryId);
    if (!target) return 0;
    const idx = templates.findIndex((item) => item.id === target.id);
    return idx >= 0 ? idx : 0;
  });
  const [phase, setPhase] = useState<'launching' | 'playing' | 'complete' | 'result'>('launching');
  const [showCelebration, setShowCelebration] = useState(false);
  const [blankIndex, setBlankIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAura, setTotalAura] = useState(0);

  const story = templates[storyIndex % templates.length];
  const blanks = useMemo(
    () => story.segments.filter((s) => s.blank).map((s) => s.blank!),
    [storyIndex],
  );

  const currentBlank = blanks[blankIndex];
  const allFilled = blankIndex >= blanks.length;

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentBlank?.answer;
    setAnswers((prev) => [...prev, answer]);

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundService.playMatch();
      setCorrectCount((c) => c + 1);
      const aura = 15;
      setTotalAura((a) => a + aura);
      addAura(aura);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    if (blankIndex + 1 >= blanks.length) {
      const finalScore = correctCount + (isCorrect ? 1 : 0);
      studyWithVisby();
      addSkillPoints('culture', 5);
      addSkillPoints('history', 3);
      incrementGameStat('gamesPlayed');
      analyticsService.trackGameComplete(GAME_NAME, finalScore, finalScore === blanks.length);
      checkDailyMissionCompletion('play_minigame', 1);
      if (pathNodeId) completePathNode(pathNodeId);
      const bonus = getGameOfTheDayBonusAura('StoryBuilder');
      if (bonus > 0) addAura(bonus);
      setShowCelebration(true);
      timersRef.current.push(setTimeout(() => setPhase('complete'), 600));
    } else {
      timersRef.current.push(setTimeout(() => setBlankIndex((i) => i + 1), 600));
    }
  };

  const renderStory = () => {
    let blankCounter = 0;
    return story.segments.map((seg, i) => {
      if (seg.blank) {
        const idx = blankCounter;
        blankCounter++;
        const answered = answers[idx];
        const isCorrect = answered === seg.blank.answer;
        if (answered) {
          return (
            <Text
              key={i}
              style={[styles.storyText, isCorrect ? styles.correctWord : styles.wrongWord]}
            >
              {answered}
            </Text>
          );
        }
        if (idx === blankIndex) {
          return <Text key={i} style={[styles.storyText, styles.blankActive]}>{'_____'}</Text>;
        }
        return <Text key={i} style={[styles.storyText, styles.blankEmpty]}>{'_____'}</Text>;
      }
      return <Text key={i} style={styles.storyText}>{seg.text}</Text>;
    });
  };

  if (phase === 'complete') {
    return (
      <View style={styles.container}>
        {showCelebration && (
          <GameCelebration
            tier={getCelebrationTier(correctCount, blanks.length)}
            score={correctCount}
            maxScore={blanks.length}
            auraEarned={totalAura}
            gameName="Story Builder"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
        <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={StyleSheet.absoluteFill} />
        <FloatingParticles count={8} variant="stars" opacity={0.15} speed="slow" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.completeContent}>
            <Animated.View entering={ZoomIn.duration(400)} style={styles.resultCard}>
              <Heading level={2} style={{ textAlign: 'center' }}>{story.title}</Heading>
              <Caption style={{ marginBottom: spacing.md }}>{story.countryName}</Caption>
              <View style={styles.fullStory}>{renderStory()}</View>
              <View style={styles.resultAuraRow}>
                <Icon name="sparkles" size={20} color={colors.reward.gold} />
                <Text style={styles.resultAura}>+{totalAura} Aura</Text>
              </View>
              <Text style={styles.resultScore}>{correctCount}/{blanks.length} correct</Text>
              <Button title="Next Story" onPress={() => {
                setStoryIndex((i) => i + 1);
                setBlankIndex(0);
                setAnswers([]);
                setCorrectCount(0);
                setPhase('playing');
              }} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.lg }} />
              <Button title="Done" onPress={() => navigation.goBack()} variant="ghost" size="md" style={{ marginTop: spacing.sm }} />
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={3}>Story Builder</Heading>
          <View style={styles.scoreChip}>
            <Icon name="sparkles" size={14} color={colors.reward.gold} />
            <Text style={styles.scoreText}>{totalAura}</Text>
          </View>
        </View>

        <View style={styles.storyHeader}>
          <Heading level={2} style={styles.storyTitle}>{story.title}</Heading>
          <Caption>{story.countryName}</Caption>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(blankIndex / blanks.length) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.storyScroll} contentContainerStyle={styles.storyContainer}>
          <View style={styles.storyBlock}>{renderStory()}</View>
          <View style={styles.storySpeaker}>
            <SpeakerButton
              text={story.segments.reduce<{ text: string; idx: number }>((acc, seg) => {
                if (!seg.blank) return { ...acc, text: acc.text + seg.text };
                const word = answers[acc.idx] ?? seg.blank.answer;
                return { text: acc.text + word, idx: acc.idx + 1 };
              }, { text: '', idx: 0 }).text}
              countryId={story.countryId}
            />
          </View>
        </ScrollView>

        {currentBlank && (
          <Animated.View entering={FadeInUp.duration(300)} style={styles.optionsArea}>
            <Caption style={styles.optionsPrompt}>Fill in the blank:</Caption>
            <View style={styles.optionsGrid}>
              {currentBlank.options.map((option, i) => (
                <TouchableOpacity
                  key={`${blankIndex}-${i}`}
                  style={styles.optionBtn}
                  onPress={() => handleAnswer(option)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  scoreChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.reward.peachLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  scoreText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.reward.amber },
  storyHeader: { alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  storyTitle: { textAlign: 'center', marginBottom: spacing.xs },
  progressBar: { height: 4, width: '100%', backgroundColor: colors.primary.wisteriaFaded, borderRadius: 2, marginTop: spacing.sm },
  progressFill: { height: 4, backgroundColor: colors.primary.wisteriaDark, borderRadius: 2 },
  storyScroll: { flex: 1 },
  storyContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  storyBlock: { flexDirection: 'row', flexWrap: 'wrap' },
  storySpeaker: { alignItems: 'flex-start', marginTop: spacing.sm },
  storyText: { fontFamily: 'Nunito-Medium', fontSize: 17, color: colors.text.primary, lineHeight: 28 },
  blankActive: { color: colors.primary.wisteriaDark, fontFamily: 'Nunito-Bold', textDecorationLine: 'underline' },
  blankEmpty: { color: colors.text.light },
  correctWord: { color: colors.success.emerald, fontFamily: 'Nunito-Bold', backgroundColor: colors.success.honeydew, borderRadius: 4, overflow: 'hidden' },
  wrongWord: { color: colors.status.error, fontFamily: 'Nunito-Bold', textDecorationLine: 'line-through' },
  optionsArea: { padding: spacing.md, backgroundColor: colors.surface.card, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  optionsPrompt: { textAlign: 'center', marginBottom: spacing.sm },
  optionsGrid: { gap: spacing.sm },
  optionBtn: { backgroundColor: colors.base.cream, borderRadius: 14, paddingVertical: 12, paddingHorizontal: spacing.md, borderWidth: 2, borderColor: colors.primary.wisteriaLight },
  optionText: { fontFamily: 'Nunito-SemiBold', fontSize: 15, color: colors.text.primary, textAlign: 'center' },
  completeContent: { paddingBottom: spacing.xxl },
  resultCard: { alignItems: 'center', padding: spacing.xl, margin: spacing.lg, backgroundColor: colors.surface.card, borderRadius: 28 },
  fullStory: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg, paddingHorizontal: spacing.sm },
  resultScore: { fontFamily: 'Nunito-SemiBold', fontSize: 16, color: colors.text.secondary, marginTop: spacing.sm },
  resultAuraRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  resultAura: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.reward.gold },
});

export default StoryBuilderScreen;
