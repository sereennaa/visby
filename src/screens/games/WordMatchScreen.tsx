import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  FadeIn,
  FadeInUp,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';

type WordMatchScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WordMatch'>;
  route: RouteProp<RootStackParamList, 'WordMatch'>;
};

interface WordPair {
  foreign: string;
  english: string;
  language: string;
}

const WORD_PAIRS: WordPair[] = [
  { foreign: 'Bonjour', english: 'Hello', language: 'French' },
  { foreign: 'Merci', english: 'Thank you', language: 'French' },
  { foreign: 'Konnichiwa', english: 'Hello', language: 'Japanese' },
  { foreign: 'Arigatou', english: 'Thank you', language: 'Japanese' },
  { foreign: 'Gracias', english: 'Thank you', language: 'Spanish' },
  { foreign: 'Hola', english: 'Hello', language: 'Spanish' },
  { foreign: 'Danke', english: 'Thank you', language: 'German' },
  { foreign: 'Guten Tag', english: 'Good day', language: 'German' },
  { foreign: 'Ciao', english: 'Hello/Bye', language: 'Italian' },
  { foreign: 'Grazie', english: 'Thank you', language: 'Italian' },
  { foreign: 'Namaste', english: 'I bow to you', language: 'Hindi' },
  { foreign: 'Annyeong', english: 'Hello', language: 'Korean' },
  { foreign: 'Sawadee', english: 'Hello', language: 'Thai' },
  { foreign: 'Obrigado', english: 'Thank you', language: 'Portuguese' },
  { foreign: 'Shukran', english: 'Thank you', language: 'Arabic' },
  { foreign: 'Xie Xie', english: 'Thank you', language: 'Chinese' },
  { foreign: 'Ni Hao', english: 'Hello', language: 'Chinese' },
  { foreign: 'Sayonara', english: 'Goodbye', language: 'Japanese' },
  { foreign: 'Au Revoir', english: 'Goodbye', language: 'French' },
  { foreign: 'Adiós', english: 'Goodbye', language: 'Spanish' },
  { foreign: 'Oui', english: 'Yes', language: 'French' },
  { foreign: 'Hai', english: 'Yes', language: 'Japanese' },
  { foreign: 'Sí', english: 'Yes', language: 'Spanish' },
  { foreign: 'Non', english: 'No', language: 'French' },
  { foreign: 'Iie', english: 'No', language: 'Japanese' },
  { foreign: 'Bitte', english: 'Please', language: 'German' },
  { foreign: "S'il vous plaît", english: 'Please', language: 'French' },
  { foreign: 'Por favor', english: 'Please', language: 'Spanish' },
  { foreign: 'Sumimasen', english: 'Excuse me', language: 'Japanese' },
  { foreign: 'Entschuldigung', english: 'Excuse me', language: 'German' },
];

const AURA_PER_MATCH = 5;
const ROUND_SIZE = 5;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRound(): { pairs: WordPair[]; shuffledEnglish: string[] } {
  const picked = shuffle(WORD_PAIRS).slice(0, ROUND_SIZE);
  const shuffledEnglish = shuffle(picked.map((p) => p.english));
  return { pairs: picked, shuffledEnglish };
}

type CardState = 'idle' | 'selected' | 'matched' | 'wrong';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ForeignCard: React.FC<{
  word: string;
  language: string;
  state: CardState;
  onPress: () => void;
  index: number;
}> = ({ word, language, state, onPress, index }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (state === 'wrong') {
      translateX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [state]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const handlePressIn = () => {
    if (state === 'matched') return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const bg =
    state === 'matched'
      ? colors.success.honeydew
      : state === 'selected'
        ? colors.primary.wisteriaLight
        : state === 'wrong'
          ? colors.status.errorLight
          : colors.primary.wisteriaFaded;

  const borderColor =
    state === 'matched'
      ? colors.success.emerald
      : state === 'selected'
        ? colors.primary.wisteriaDark
        : state === 'wrong'
          ? colors.status.error
          : 'transparent';

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(400)}>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={state === 'matched'}
        activeOpacity={0.85}
        style={animStyle}
      >
        <View
          style={[
            styles.wordCard,
            styles.foreignCard,
            { backgroundColor: bg, borderColor, borderWidth: state !== 'idle' ? 2 : 0 },
          ]}
        >
          {state === 'matched' ? (
            <View style={styles.matchedBadge}>
              <Icon name="check" size={16} color={colors.success.emerald} />
            </View>
          ) : null}
          <Text
            variant="body"
            color={state === 'matched' ? colors.success.emerald : colors.text.primary}
            style={styles.wordText}
            numberOfLines={2}
          >
            {word}
          </Text>
          <Caption
            color={state === 'matched' ? colors.success.honeydewDark : colors.text.muted}
            style={styles.languageLabel}
          >
            {language}
          </Caption>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

const EnglishCard: React.FC<{
  word: string;
  state: CardState;
  onPress: () => void;
  index: number;
}> = ({ word, state, onPress, index }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (state === 'wrong') {
      translateX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [state]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const handlePressIn = () => {
    if (state === 'matched') return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const bg =
    state === 'matched'
      ? colors.success.honeydew
      : state === 'selected'
        ? colors.reward.peachLight
        : state === 'wrong'
          ? colors.status.errorLight
          : colors.reward.peachLight;

  const borderColor =
    state === 'matched'
      ? colors.success.emerald
      : state === 'selected'
        ? colors.reward.peachDark
        : state === 'wrong'
          ? colors.status.error
          : 'transparent';

  return (
    <Animated.View entering={FadeInDown.delay(index * 80 + 200).duration(400)}>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={state === 'matched'}
        activeOpacity={0.85}
        style={animStyle}
      >
        <View
          style={[
            styles.wordCard,
            styles.englishCard,
            { backgroundColor: bg, borderColor, borderWidth: state !== 'idle' ? 2 : 0 },
          ]}
        >
          {state === 'matched' ? (
            <View style={styles.matchedBadge}>
              <Icon name="check" size={16} color={colors.success.emerald} />
            </View>
          ) : null}
          <Text
            variant="body"
            color={state === 'matched' ? colors.success.emerald : colors.text.primary}
            style={styles.wordText}
            numberOfLines={2}
          >
            {word}
          </Text>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

const AuraPopup: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <Animated.View entering={ZoomIn.duration(300)} style={styles.auraPopup}>
      <Icon name="sparkles" size={14} color={colors.reward.gold} />
      <Text variant="bodySmall" color={colors.reward.amber} style={styles.auraPopupText}>
        +{AURA_PER_MATCH}
      </Text>
    </Animated.View>
  );
};

export const WordMatchScreen: React.FC<WordMatchScreenProps> = ({ navigation }) => {
  const { addAura, studyWithVisby, addSkillPoints } = useStore();
  const [round, setRound] = useState(() => pickRound());
  const [selectedForeign, setSelectedForeign] = useState<number | null>(null);
  const [foreignStates, setForeignStates] = useState<CardState[]>(
    Array(ROUND_SIZE).fill('idle'),
  );
  const [englishStates, setEnglishStates] = useState<CardState[]>(
    Array(ROUND_SIZE).fill('idle'),
  );
  const [matchedCount, setMatchedCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showAuraAt, setShowAuraAt] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const isProcessingRef = useRef(false);

  const totalAttempts = matchedCount + wrongAttempts;
  const accuracy = totalAttempts > 0 ? Math.round((matchedCount / totalAttempts) * 100) : 100;
  const timeTaken = endTime ? Math.round((endTime - startTime) / 1000) : 0;
  const auraEarned = matchedCount * AURA_PER_MATCH;

  const starRating = useMemo(() => {
    if (!isFinished) return 0;
    if (accuracy >= 90 && timeTaken <= 30) return 3;
    if (accuracy >= 70) return 2;
    return 1;
  }, [isFinished, accuracy, timeTaken]);

  const haptic = useCallback((style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style).catch(() => {});
    }
  }, []);

  const handleForeignPress = useCallback(
    (index: number) => {
      if (foreignStates[index] === 'matched' || isProcessingRef.current) return;

      haptic(Haptics.ImpactFeedbackStyle.Light);

      if (selectedForeign === index) {
        setSelectedForeign(null);
        setForeignStates((prev) => prev.map((s, i) => (i === index ? 'idle' : s)));
        return;
      }

      setSelectedForeign(index);
      setForeignStates((prev) =>
        prev.map((s, i) => {
          if (s === 'matched') return 'matched';
          return i === index ? 'selected' : 'idle';
        }),
      );
    },
    [selectedForeign, foreignStates, haptic],
  );

  const handleEnglishPress = useCallback(
    (englishIndex: number) => {
      if (
        selectedForeign === null ||
        englishStates[englishIndex] === 'matched' ||
        isProcessingRef.current
      )
        return;

      isProcessingRef.current = true;
      const foreignPair = round.pairs[selectedForeign];
      const selectedEnglish = round.shuffledEnglish[englishIndex];
      const isCorrect = foreignPair.english === selectedEnglish;

      if (isCorrect) {
        haptic(Haptics.ImpactFeedbackStyle.Medium);
        setForeignStates((prev) =>
          prev.map((s, i) => (i === selectedForeign ? 'matched' : s)),
        );
        setEnglishStates((prev) =>
          prev.map((s, i) => (i === englishIndex ? 'matched' : s)),
        );
        setShowAuraAt(englishIndex);
        const newMatched = matchedCount + 1;
        setMatchedCount(newMatched);
        addAura(AURA_PER_MATCH);
        setSelectedForeign(null);

        setTimeout(() => setShowAuraAt(null), 800);

        if (newMatched === ROUND_SIZE) {
          const finishTime = Date.now();
          setEndTime(finishTime);
          studyWithVisby();
          addSkillPoints('language', 5);
          setTimeout(() => setIsFinished(true), 600);
        }
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
      } else {
        haptic(Haptics.ImpactFeedbackStyle.Heavy);
        setWrongAttempts((prev) => prev + 1);
        setForeignStates((prev) =>
          prev.map((s, i) => (i === selectedForeign ? 'wrong' : s)),
        );
        setEnglishStates((prev) =>
          prev.map((s, i) => (i === englishIndex ? 'wrong' : s)),
        );

        setTimeout(() => {
          setForeignStates((prev) =>
            prev.map((s) => (s === 'wrong' ? 'idle' : s)),
          );
          setEnglishStates((prev) =>
            prev.map((s) => (s === 'wrong' ? 'idle' : s)),
          );
          setSelectedForeign(null);
          isProcessingRef.current = false;
        }, 600);
      }
    },
    [selectedForeign, englishStates, round, matchedCount, haptic, addAura, studyWithVisby],
  );

  const handlePlayAgain = useCallback(() => {
    setRound(pickRound());
    setSelectedForeign(null);
    setForeignStates(Array(ROUND_SIZE).fill('idle'));
    setEnglishStates(Array(ROUND_SIZE).fill('idle'));
    setMatchedCount(0);
    setWrongAttempts(0);
    setShowAuraAt(null);
    setIsFinished(false);
    setEndTime(null);
    isProcessingRef.current = false;
  }, []);

  if (isFinished) {
    return (
      <LinearGradient
        colors={[colors.reward.peachLight, colors.base.cream]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Animated.View entering={FadeIn.duration(500)} style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Animated.View entering={ZoomIn.delay(200).duration(400)} style={styles.resultsIconWrap}>
                  <Icon
                    name={starRating >= 3 ? 'trophy' : starRating >= 2 ? 'star' : 'hand'}
                    size={64}
                    color={
                      starRating >= 3
                        ? colors.reward.gold
                        : starRating >= 2
                          ? colors.reward.amber
                          : colors.primary.wisteriaDark
                    }
                  />
                </Animated.View>

                <Heading level={1} align="center" style={styles.resultsTitle}>
                  Round Complete!
                </Heading>

                <View style={styles.starsRow}>
                  {[1, 2, 3].map((s) => (
                    <Animated.View key={s} entering={ZoomIn.delay(400 + s * 150).duration(300)}>
                      <Icon
                        name={s <= starRating ? 'star' : 'starOutline'}
                        size={36}
                        color={s <= starRating ? colors.reward.gold : colors.text.light}
                      />
                    </Animated.View>
                  ))}
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Icon name="time" size={20} color={colors.calm.ocean} />
                    <Text variant="h3" color={colors.text.primary}>
                      {timeTaken}s
                    </Text>
                    <Caption>Time</Caption>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Icon name="target" size={20} color={colors.success.emerald} />
                    <Text variant="h3" color={colors.text.primary}>
                      {accuracy}%
                    </Text>
                    <Caption>Accuracy</Caption>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Icon name="sparkles" size={20} color={colors.reward.gold} />
                    <Text variant="h3" color={colors.reward.amber}>
                      +{auraEarned}
                    </Text>
                    <Caption>Aura</Caption>
                  </View>
                </View>
              </View>
            </Card>

            <Button
              title="Play Again"
              onPress={handlePlayAgain}
              variant="primary"
              size="lg"
              fullWidth
              icon={<Icon name="refresh" size={20} color={colors.text.inverse} />}
            />
            <Button
              title="Done"
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="lg"
              fullWidth
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.accent.lavender]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={2}>Word Match</Heading>
          <View style={styles.headerRight}>
            <Icon name="sparkles" size={18} color={colors.reward.gold} />
            <Text variant="bodySmall" color={colors.reward.amber} style={styles.auraHeaderText}>
              {matchedCount * AURA_PER_MATCH}
            </Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${(matchedCount / ROUND_SIZE) * 100}%` },
              ]}
            />
          </View>
          <Caption style={styles.progressLabel}>
            {matchedCount}/{ROUND_SIZE}
          </Caption>
        </View>

        <ScrollView
          style={styles.gameArea}
          contentContainerStyle={styles.gameContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.columnsContainer}>
            <View style={styles.column}>
              <Text variant="label" color={colors.primary.wisteriaDark} style={styles.columnTitle}>
                Foreign
              </Text>
              {round.pairs.map((pair, i) => (
                <ForeignCard
                  key={`foreign-${i}-${pair.foreign}`}
                  word={pair.foreign}
                  language={pair.language}
                  state={foreignStates[i]}
                  onPress={() => handleForeignPress(i)}
                  index={i}
                />
              ))}
            </View>

            <View style={styles.column}>
              <Text variant="label" color={colors.reward.peachDark} style={styles.columnTitle}>
                English
              </Text>
              {round.shuffledEnglish.map((word, i) => (
                <View key={`english-${i}-${word}`}>
                  <EnglishCard
                    word={word}
                    state={englishStates[i]}
                    onPress={() => handleEnglishPress(i)}
                    index={i}
                  />
                  {showAuraAt === i && <AuraPopup visible />}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing.screenPadding * 2 - spacing.md) / 2;

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
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.reward.peachLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
    gap: spacing.xs,
  },
  auraHeaderText: {
    fontFamily: typography.fonts.bodyBold,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: spacing.radius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.wisteria,
    borderRadius: spacing.radius.round,
  },
  progressLabel: {
    minWidth: 30,
    textAlign: 'right',
  },
  gameArea: {
    flex: 1,
  },
  gameContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  column: {
    flex: 1,
    gap: spacing.sm,
  },
  columnTitle: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  wordCard: {
    width: '100%',
    minHeight: 68,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  foreignCard: {},
  englishCard: {},
  matchedBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  wordText: {
    textAlign: 'center',
    fontFamily: typography.fonts.bodySemiBold,
  },
  languageLabel: {
    marginTop: spacing.xxs,
    textAlign: 'center',
  },
  auraPopup: {
    position: 'absolute',
    top: -8,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.reward.peachLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radius.round,
    gap: spacing.xxs,
  },
  auraPopupText: {
    fontFamily: typography.fonts.bodyBold,
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
  },
  resultsTitle: {
    marginBottom: spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.primary.wisteriaLight,
  },
});

export default WordMatchScreen;
