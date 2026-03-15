import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
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
  withTiming,
  withSequence,
  interpolate,
  FadeIn,
  FadeInUp,
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
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { RootStackParamList } from '../../types';

type MemoryCardsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MemoryCards'>;
  route: RouteProp<RootStackParamList, 'MemoryCards'>;
};

interface MemoryPair {
  id: string;
  text: string;
  match: string;
  icon: IconName;
}

const MEMORY_PAIRS: MemoryPair[] = [
  { id: 'eiffel', text: 'Eiffel Tower', match: 'Paris, France', icon: 'landmark' },
  { id: 'sushi', text: 'Sushi', match: 'Japan', icon: 'food' },
  { id: 'pyramids', text: 'Pyramids', match: 'Egypt', icon: 'landmark' },
  { id: 'colosseum', text: 'Colosseum', match: 'Rome, Italy', icon: 'castle' },
  { id: 'sakura', text: 'Cherry Blossoms', match: 'Sakura, Japan', icon: 'nature' },
  { id: 'carnival', text: 'Carnival', match: 'Rio, Brazil', icon: 'sparkles' },
  { id: 'wall', text: 'Great Wall', match: 'China', icon: 'landmark' },
  { id: 'kimchi', text: 'Kimchi', match: 'Korea', icon: 'food' },
  { id: 'taj', text: 'Taj Mahal', match: 'India', icon: 'temple' },
  { id: 'fjord', text: 'Fjords', match: 'Norway', icon: 'mountain' },
  { id: 'machu', text: 'Machu Picchu', match: 'Peru', icon: 'mountain' },
  { id: 'opera', text: 'Opera House', match: 'Sydney, Australia', icon: 'landmark' },
  { id: 'tulips', text: 'Tulips', match: 'Netherlands', icon: 'nature' },
  { id: 'pizza', text: 'Pizza', match: 'Italy', icon: 'food' },
  { id: 'flamenco', text: 'Flamenco', match: 'Spain', icon: 'culture' },
  { id: 'vikings', text: 'Vikings', match: 'Scandinavia', icon: 'viking' },
  { id: 'tango', text: 'Tango', match: 'Argentina', icon: 'culture' },
  { id: 'sphinx', text: 'Sphinx', match: 'Egypt', icon: 'landmark' },
  { id: 'tea', text: 'Tea Ceremony', match: 'Japan', icon: 'cafe' },
  { id: 'pasta', text: 'Pasta', match: 'Italy', icon: 'food' },
];

const PAIRS_PER_GAME = 6;
const GRID_COLS = 4;
const GRID_ROWS = 3;
const AURA_PER_PAIR = 3;
const BONUS_THREE_STAR = 10;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface GameCard {
  uid: string;
  pairId: string;
  content: string;
  icon: IconName;
  side: 'a' | 'b';
}

function buildDeck(): GameCard[] {
  const selected = shuffle(MEMORY_PAIRS).slice(0, PAIRS_PER_GAME);
  const cards: GameCard[] = [];
  selected.forEach((pair) => {
    cards.push({ uid: `${pair.id}-a`, pairId: pair.id, content: pair.text, icon: pair.icon, side: 'a' });
    cards.push({ uid: `${pair.id}-b`, pairId: pair.id, content: pair.match, icon: pair.icon, side: 'b' });
  });
  return shuffle(cards);
}

type FlipState = 'down' | 'up' | 'matched';

const MemoryCard: React.FC<{
  card: GameCard;
  state: FlipState;
  onPress: () => void;
  index: number;
}> = ({ card, state, onPress, index }) => {
  const flipProgress = useSharedValue(0);
  const matchScale = useSharedValue(1);

  useEffect(() => {
    if (state === 'up' || state === 'matched') {
      flipProgress.value = withTiming(1, { duration: 250 });
    } else {
      flipProgress.value = withTiming(0, { duration: 250 });
    }
  }, [state]);

  useEffect(() => {
    if (state === 'matched') {
      matchScale.value = withSequence(
        withSpring(1.08, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 12, stiffness: 300 }),
      );
    }
  }, [state]);

  const frontAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(flipProgress.value, [0, 0.5, 0.5, 1], [1, 1, 0, 0]);
    const scaleX = interpolate(flipProgress.value, [0, 0.5, 0.5, 1], [1, 0, 0, 1]);
    return {
      opacity,
      transform: [{ scaleX }, { scale: matchScale.value }],
    };
  });

  const backAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(flipProgress.value, [0, 0.5, 0.5, 1], [0, 0, 1, 1]);
    const scaleX = interpolate(flipProgress.value, [0, 0.5, 0.5, 1], [1, 0, 0, 1]);
    return {
      opacity,
      transform: [{ scaleX }, { scale: matchScale.value }],
    };
  });

  const glowStyle = state === 'matched'
    ? {
        borderColor: colors.success.emerald,
        borderWidth: 2,
        ...Platform.select({
          ios: {
            shadowColor: colors.success.emerald,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
          },
          android: { elevation: 6 },
        }),
      }
    : {};

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 40).duration(300)}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={state !== 'down'}
        activeOpacity={0.85}
        style={styles.cardTouchable}
      >
        {/* Face-down */}
        <Animated.View style={[styles.memoryCard, styles.cardFaceDown, frontAnimStyle]}>
          <LinearGradient
            colors={[colors.primary.wisteriaDark, colors.primary.wisteria]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="help" size={28} color={colors.primary.wisteriaFaded} />
          </LinearGradient>
        </Animated.View>

        {/* Face-up */}
        <Animated.View style={[styles.memoryCard, styles.cardFaceUp, backAnimStyle, glowStyle]}>
          <Icon name={card.icon} size={22} color={state === 'matched' ? colors.success.emerald : colors.primary.wisteriaDark} />
          <Text
            variant="bodySmall"
            color={state === 'matched' ? colors.success.emerald : colors.text.primary}
            style={styles.cardText}
            numberOfLines={2}
            align="center"
          >
            {card.content}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MemoryCardsScreen: React.FC<MemoryCardsScreenProps> = ({ navigation }) => {
  const { addAura, studyWithVisby, playWithVisby, incrementGameStat, addSkillPoints, checkDailyMissionCompletion } = useStore();
  const [deck, setDeck] = useState(() => buildDeck());
  const [cardStates, setCardStates] = useState<FlipState[]>(
    () => Array(PAIRS_PER_GAME * 2).fill('down'),
  );
  const [firstFlip, setFirstFlip] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const isProcessingRef = useRef(false);
  const flipBackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (flipBackTimerRef.current) clearTimeout(flipBackTimerRef.current);
    };
  }, []);

  const timeTaken = endTime ? Math.round((endTime - startTime) / 1000) : 0;

  const starRating = useMemo(() => {
    if (!isFinished) return 0;
    if (moves <= 15) return 3;
    if (moves <= 25) return 2;
    return 1;
  }, [isFinished, moves]);

  const auraEarned = useMemo(() => {
    const base = matchedPairs * AURA_PER_PAIR;
    const bonus = starRating >= 3 ? BONUS_THREE_STAR : 0;
    return base + bonus;
  }, [matchedPairs, starRating]);

  const haptic = useCallback((style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style).catch(() => {});
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCardPress = useCallback(
    (index: number) => {
      if (isProcessingRef.current || cardStates[index] !== 'down') return;

      haptic(Haptics.ImpactFeedbackStyle.Light);

      const newStates = [...cardStates];
      newStates[index] = 'up';
      setCardStates(newStates);

      if (firstFlip === null) {
        setFirstFlip(index);
        return;
      }

      isProcessingRef.current = true;
      setMoves((prev) => prev + 1);
      const firstCard = deck[firstFlip];
      const secondCard = deck[index];
      const isMatch = firstCard.pairId === secondCard.pairId;

      if (isMatch) {
        haptic(Haptics.ImpactFeedbackStyle.Medium);
        const { soundService } = require('../../services/sound');
        soundService.playMatch();
        const matchStates = [...newStates];
        matchStates[firstFlip] = 'matched';
        matchStates[index] = 'matched';
        setCardStates(matchStates);
        setFirstFlip(null);
        isProcessingRef.current = false;

        const newMatched = matchedPairs + 1;
        setMatchedPairs(newMatched);
        addAura(AURA_PER_PAIR);

        if (newMatched === PAIRS_PER_GAME) {
          const finishTime = Date.now();
          setEndTime(finishTime);
          const finalMoves = moves + 1;
          if (finalMoves <= 15) {
            addAura(BONUS_THREE_STAR);
          }
          const bonus = getGameOfTheDayBonusAura('MemoryCards');
          if (bonus > 0) addAura(bonus);
          studyWithVisby();
          playWithVisby();
          incrementGameStat('gamesPlayed');
          checkDailyMissionCompletion('play_minigame', 1);
          addSkillPoints('culture', 3);
          setTimeout(() => setIsFinished(true), 500);
        }
      } else {
        flipBackTimerRef.current = setTimeout(() => {
          setCardStates((prev) =>
            prev.map((s, i) =>
              (i === firstFlip || i === index) && s === 'up' ? 'down' : s,
            ),
          );
          setFirstFlip(null);
          isProcessingRef.current = false;
        }, 900);
      }
    },
    [firstFlip, cardStates, deck, matchedPairs, moves, haptic, addAura, studyWithVisby, playWithVisby, incrementGameStat],
  );

  const handlePlayAgain = useCallback(() => {
    const newDeck = buildDeck();
    setDeck(newDeck);
    setCardStates(Array(PAIRS_PER_GAME * 2).fill('down'));
    setFirstFlip(null);
    setMoves(0);
    setMatchedPairs(0);
    setIsFinished(false);
    setEndTime(null);
    isProcessingRef.current = false;
  }, []);

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

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
                  All Matched!
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
                      {formatTime(timeTaken)}
                    </Text>
                    <Caption>Time</Caption>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Icon name="target" size={20} color={colors.primary.wisteriaDark} />
                    <Text variant="h3" color={colors.text.primary}>
                      {moves}
                    </Text>
                    <Caption>Moves</Caption>
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

                {starRating >= 3 && (
                  <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.bonusBadge}>
                    <Icon name="flash" size={16} color={colors.reward.gold} />
                    <Text variant="bodySmall" color={colors.reward.amber} style={styles.bonusText}>
                      +{BONUS_THREE_STAR} Bonus Aura
                    </Text>
                  </Animated.View>
                )}
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
      colors={[colors.calm.skyLight, colors.base.cream]}
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
          <Heading level={2}>Memory Cards</Heading>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statPill}>
            <Icon name="time" size={16} color={colors.calm.ocean} />
            <Text variant="bodySmall" color={colors.text.secondary} style={styles.statPillText}>
              {formatTime(elapsed)}
            </Text>
          </View>
          <View style={styles.statPill}>
            <Icon name="target" size={16} color={colors.primary.wisteriaDark} />
            <Text variant="bodySmall" color={colors.text.secondary} style={styles.statPillText}>
              {moves} moves
            </Text>
          </View>
          <View style={styles.statPill}>
            <Icon name="sparkles" size={16} color={colors.reward.gold} />
            <Text variant="bodySmall" color={colors.reward.amber} style={styles.statPillText}>
              {matchedPairs * AURA_PER_PAIR}
            </Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${(matchedPairs / PAIRS_PER_GAME) * 100}%` },
              ]}
            />
          </View>
          <Caption style={styles.progressLabel}>
            {matchedPairs}/{PAIRS_PER_GAME}
          </Caption>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {deck.map((card, index) => (
              <MemoryCard
                key={card.uid}
                card={card}
                state={cardStates[index]}
                onPress={() => handleCardPress(index)}
                index={index}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = spacing.sm;
const GRID_PADDING = spacing.screenPadding;
const CARD_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

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
  headerSpacer: {
    width: 40,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
    gap: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow.light,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  statPillText: {
    fontFamily: typography.fonts.bodySemiBold,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.calm.skyLight,
    borderRadius: spacing.radius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.calm.ocean,
    borderRadius: spacing.radius.round,
  },
  progressLabel: {
    minWidth: 30,
    textAlign: 'right',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: GRID_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    justifyContent: 'center',
  },
  cardWrapper: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.2,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
  },
  memoryCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: spacing.radius.md,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  cardFaceDown: {
    zIndex: 1,
  },
  cardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radius.md,
  },
  cardFaceUp: {
    zIndex: 2,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow.medium,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  cardText: {
    marginTop: spacing.xs,
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
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
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.reward.peachLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    gap: spacing.xs,
  },
  bonusText: {
    fontFamily: typography.fonts.bodyBold,
  },
});

export default MemoryCardsScreen;
