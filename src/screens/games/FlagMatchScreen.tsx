import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analytics';
import { COUNTRIES } from '../../config/constants';
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { soundService } from '../../services/sound';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { GameLaunchSequence } from '../../components/effects/GameLaunchSequence';
import { GameCelebration, getCelebrationTier } from '../../components/effects/GameCelebration';
import { speechService } from '../../services/audio';
import type { RootStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ROUNDS = 10;

interface FlagQuestion {
  countryId: string;
  countryName: string;
  flagEmoji: string;
  options: string[];
  correctIndex: number;
}

const CONTINENT_BY_COUNTRY: Record<string, string> = {
  jp: 'Asia',
  kr: 'Asia',
  th: 'Asia',
  tr: 'Asia',
  fr: 'Europe',
  it: 'Europe',
  gb: 'Europe',
  no: 'Europe',
  gr: 'Europe',
  mx: 'North America',
  br: 'South America',
  pe: 'South America',
  ma: 'Africa',
  ke: 'Africa',
};

function generateQuestions(count: number, focusCountryId?: string | null): FlagQuestion[] {
  const pool = COUNTRIES.filter((c) => c.flagEmoji);
  const focus = focusCountryId ? pool.find((c) => c.id === focusCountryId) : undefined;
  const focusContinent = focus?.continent ?? (focusCountryId ? CONTINENT_BY_COUNTRY[focusCountryId] : undefined);
  const regionPool = focusContinent ? pool.filter((c) => (c.continent ?? CONTINENT_BY_COUNTRY[c.id]) === focusContinent) : [];
  const globalPool = pool.filter((c) => !regionPool.some((r) => r.id === c.id));
  const selected = [
    ...[...(focus ? [focus] : []), ...regionPool.filter((c) => c.id !== focus?.id)].sort(() => Math.random() - 0.5).slice(0, Math.ceil(count * 0.7)),
    ...globalPool.sort(() => Math.random() - 0.5).slice(0, count),
  ].slice(0, Math.min(count, pool.length));

  return selected.map((country) => {
    const wrong = pool
      .filter((c) => c.id !== country.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.name);
    const options = [...wrong, country.name].sort(() => Math.random() - 0.5);
    return {
      countryId: country.id,
      countryName: country.name,
      flagEmoji: country.flagEmoji,
      options,
      correctIndex: options.indexOf(country.name),
    };
  });
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FlagMatch'>;
  route: RouteProp<RootStackParamList, 'FlagMatch'>;
};

const GAME_NAME = 'FlagMatch';

export const FlagMatchScreen: React.FC<Props> = ({ navigation, route }) => {
  const pathNodeId = route.params?.pathNodeId;
  const countryId = route.params?.countryId ?? null;
  const addAura = useStore(s => s.addAura);
  const addSkillPoints = useStore(s => s.addSkillPoints);
  const incrementGameStat = useStore(s => s.incrementGameStat);
  const checkDailyMissionCompletion = useStore(s => s.checkDailyMissionCompletion);
  const playWithVisby = useStore(s => s.playWithVisby);
  const completePathNode = useStore(s => s.completePathNode);

  React.useEffect(() => {
    analyticsService.trackGameStart(GAME_NAME);
  }, []);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      speechService.stop();
    };
  }, []);
  const [phase, setPhase] = useState<'launching' | 'playing' | 'result'>('launching');
  const [showCelebration, setShowCelebration] = useState(false);
  const [questions] = useState(() => generateQuestions(ROUNDS, countryId));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [totalAura, setTotalAura] = useState(0);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const question = questions[currentIndex];

  const handleAnswer = useCallback((index: number) => {
    if (selected !== null) return;
    setSelected(index);

    if (index === question.correctIndex) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundService.playMatch();
      setTimeout(() => speechService.speak(question.countryName), 350);
      setScore((s) => s + 1);
      const aura = 15;
      setTotalAura((a) => a + aura);
      addAura(aura);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => speechService.speak(question.countryName), 350);
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }

    timersRef.current.push(setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        playWithVisby();
        addSkillPoints('geography', 5);
        incrementGameStat('gamesPlayed');
        const finalScore = score + (index === question.correctIndex ? 1 : 0);
        analyticsService.trackGameComplete(GAME_NAME, finalScore, finalScore === questions.length);
        checkDailyMissionCompletion('play_minigame', 1);
        if (pathNodeId) completePathNode(pathNodeId);
        const bonus = getGameOfTheDayBonusAura('FlagMatch');
        if (bonus > 0) addAura(bonus);
        setShowCelebration(true);
        setPhase('result');
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1000));
  }, [selected, question, currentIndex, questions.length]);

  if (phase === 'launching') {
    return (
      <GameLaunchSequence
        gameName="Flag Match"
        gameIcon="flag"
        rules="Match each flag to the correct country!"
        onComplete={() => setPhase('playing')}
      />
    );
  }

  if (phase === 'result') {
    const percent = Math.round((score / questions.length) * 100);
    const stars = percent >= 90 ? 3 : percent >= 60 ? 2 : percent >= 30 ? 1 : 0;
    return (
      <View style={styles.container}>
        {showCelebration && (
          <GameCelebration
            tier={getCelebrationTier(score, questions.length)}
            score={score}
            maxScore={questions.length}
            auraEarned={totalAura}
            gameName="Flag Match"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
        <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={StyleSheet.absoluteFill} />
        <FloatingParticles count={8} variant="stars" opacity={0.15} speed="slow" />
        <SafeAreaView style={styles.safeArea}>
          <Animated.View entering={ZoomIn.duration(500)} style={styles.resultCard}>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {Array.from({ length: 3 }, (_, i) => (
                <Icon key={i} name={i < stars ? 'star' : 'starOutline'} size={28} color={colors.reward.gold} />
              ))}
            </View>
            <Heading level={2} style={styles.resultTitle}>
              {percent >= 80 ? 'Flag Expert!' : percent >= 50 ? 'Great Job!' : 'Keep Practicing!'}
            </Heading>
            <Text style={styles.resultScore}>{score}/{questions.length} correct ({percent}%)</Text>
            <View style={styles.resultAuraRow}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text style={styles.resultAura}>+{totalAura} Aura</Text>
            </View>
            <Button title="Play Again" onPress={() => { setPhase('playing'); setCurrentIndex(0); setScore(0); setTotalAura(0); setSelected(null); }} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.lg }} />
            <Button title="Done" onPress={() => navigation.goBack()} variant="ghost" size="md" style={{ marginTop: spacing.sm }} />
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.calm.skyLight, colors.base.cream]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.progress}>{currentIndex + 1}/{questions.length}</Text>
          <View style={styles.scoreChip}>
            <Icon name="sparkles" size={14} color={colors.reward.gold} />
            <Text style={styles.scoreText}>{totalAura}</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex) / questions.length) * 100}%` }]} />
        </View>

        <Animated.View entering={FadeInDown.duration(300)} style={styles.questionArea}>
          <Caption style={styles.prompt}>Which country does this flag belong to?</Caption>
          <Animated.Text style={[styles.flagEmoji, shakeStyle]}>{question.flagEmoji || '🏳️'}</Animated.Text>
        </Animated.View>

        <View style={styles.optionsGrid}>
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = index === question.correctIndex;
            const showResult = selected !== null;

            return (
              <Animated.View key={`${currentIndex}-${index}`} entering={FadeInUp.duration(300).delay(index * 60)}>
                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    showResult && isCorrect && styles.optionCorrect,
                    showResult && isSelected && !isCorrect && styles.optionWrong,
                  ]}
                  onPress={() => handleAnswer(index)}
                  disabled={selected !== null}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    showResult && isCorrect && styles.optionTextCorrect,
                    showResult && isSelected && !isCorrect && styles.optionTextWrong,
                  ]}>
                    {option}
                  </Text>
                  {showResult && isCorrect && <Icon name="check" size={20} color={colors.success.emerald} />}
                  {showResult && isSelected && !isCorrect && <Icon name="close" size={20} color={colors.status.error} />}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  progress: { fontFamily: 'Nunito-Bold', fontSize: 16, color: colors.text.primary },
  scoreChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.reward.peachLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  scoreText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.reward.amber },
  progressBar: { height: 4, backgroundColor: colors.primary.wisteriaFaded, marginHorizontal: spacing.md, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: colors.primary.wisteriaDark, borderRadius: 2 },
  questionArea: { alignItems: 'center', paddingVertical: spacing.xl },
  prompt: { fontSize: 16, color: colors.text.secondary, marginBottom: spacing.md },
  flagEmoji: { fontSize: 96 },
  optionsGrid: { paddingHorizontal: spacing.md, gap: spacing.sm },
  optionBtn: { backgroundColor: colors.surface.card, borderRadius: 16, paddingVertical: 16, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: 'transparent' },
  optionCorrect: { borderColor: colors.success.emerald, backgroundColor: colors.success.honeydew },
  optionWrong: { borderColor: colors.status.error, backgroundColor: colors.status.error + '10' },
  optionText: { fontFamily: 'Nunito-SemiBold', fontSize: 16, color: colors.text.primary, flex: 1 },
  optionTextCorrect: { color: colors.success.emerald },
  optionTextWrong: { color: colors.status.error },
  resultCard: { alignItems: 'center', padding: spacing.xl, margin: spacing.lg, backgroundColor: colors.surface.card, borderRadius: 28 },
  resultStars: { fontSize: 36, marginBottom: spacing.md },
  resultTitle: { textAlign: 'center', marginBottom: spacing.sm },
  resultScore: { fontFamily: 'Nunito-SemiBold', fontSize: 18, color: colors.text.secondary, marginBottom: spacing.md },
  resultAuraRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultAura: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.reward.gold },
});

export default FlagMatchScreen;
