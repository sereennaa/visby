import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown, ZoomIn, ZoomInEasyDown, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analytics';
import { COUNTRIES } from '../../config/constants';
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { soundService } from '../../services/sound';
import { speechService } from '../../services/audio';
import { WorldMapBackground } from '../../components/maps/WorldMapBackground';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { GameLaunchSequence } from '../../components/effects/GameLaunchSequence';
import { GameCelebration, getCelebrationTier } from '../../components/effects/GameCelebration';
import type { RootStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH - spacing.md * 2;
const MAP_HEIGHT = MAP_WIDTH * 0.55;
const ROUNDS = 8;

interface MapQuestion {
  countryId: string;
  countryName: string;
  approxX: number; // 0-100 percentage on simplified world map
  approxY: number; // 0-100 percentage
  continent: string;
}

const COUNTRY_POSITIONS: MapQuestion[] = [
  { countryId: 'jp', countryName: 'Japan', approxX: 85, approxY: 32, continent: 'Asia' },
  { countryId: 'fr', countryName: 'France', approxX: 48, approxY: 28, continent: 'Europe' },
  { countryId: 'br', countryName: 'Brazil', approxX: 32, approxY: 62, continent: 'South America' },
  { countryId: 'mx', countryName: 'Mexico', approxX: 18, approxY: 38, continent: 'North America' },
  { countryId: 'it', countryName: 'Italy', approxX: 51, approxY: 30, continent: 'Europe' },
  { countryId: 'gb', countryName: 'United Kingdom', approxX: 46, approxY: 24, continent: 'Europe' },
  { countryId: 'ke', countryName: 'Kenya', approxX: 58, approxY: 52, continent: 'Africa' },
  { countryId: 'kr', countryName: 'South Korea', approxX: 83, approxY: 32, continent: 'Asia' },
  { countryId: 'no', countryName: 'Norway', approxX: 49, approxY: 18, continent: 'Europe' },
  { countryId: 'gr', countryName: 'Greece', approxX: 53, approxY: 32, continent: 'Europe' },
  { countryId: 'th', countryName: 'Thailand', approxX: 78, approxY: 42, continent: 'Asia' },
  { countryId: 'pe', countryName: 'Peru', approxX: 24, approxY: 58, continent: 'South America' },
  { countryId: 'in', countryName: 'India', approxX: 72, approxY: 38, continent: 'Asia' },
  { countryId: 'au', countryName: 'Australia', approxX: 85, approxY: 65, continent: 'Oceania' },
  { countryId: 'tr', countryName: 'Turkey', approxX: 56, approxY: 30, continent: 'Asia' },
  { countryId: 'ma', countryName: 'Morocco', approxX: 44, approxY: 36, continent: 'Africa' },
  { countryId: 'eg', countryName: 'Egypt', approxX: 54, approxY: 38, continent: 'Africa' },
  { countryId: 'za', countryName: 'South Africa', approxX: 52, approxY: 72, continent: 'Africa' },
];

function shuffleAndPick(count: number): MapQuestion[] {
  return [...COUNTRY_POSITIONS].sort(() => Math.random() - 0.5).slice(0, count);
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MapPin'>;
  route: RouteProp<RootStackParamList, 'MapPin'>;
};

const GAME_NAME = 'MapPin';

export const MapPinScreen: React.FC<Props> = ({ navigation, route }) => {
  const pathNodeId = route.params?.pathNodeId;
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
  const [questions] = useState(() => shuffleAndPick(ROUNDS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAura, setTotalAura] = useState(0);
  const [tappedPos, setTappedPos] = useState<{ x: number; y: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastDist, setLastDist] = useState(0);

  const question = questions[currentIndex];
  useEffect(() => {
    if (!question && phase === 'playing') {
      setShowCelebration(true);
      setPhase('result');
    }
  }, [question, phase]);

  const handleMapTap = useCallback((evt: any) => {
    if (showAnswer || !question) return;
    const { locationX, locationY } = evt.nativeEvent;
    const tapX = (locationX / MAP_WIDTH) * 100;
    const tapY = (locationY / MAP_HEIGHT) * 100;
    setTappedPos({ x: tapX, y: tapY });

    const dist = Math.sqrt((tapX - question.approxX) ** 2 + (tapY - question.approxY) ** 2);
    const isClose = dist < 12;

    setLastDist(dist);
    setShowAnswer(true);

    if (isClose) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundService.playMatch();
      setTimeout(() => speechService.speak(question.countryName), 350);
      const aura = dist < 6 ? 20 : 12;
      setScore((s) => s + 1);
      setTotalAura((a) => a + aura);
      addAura(aura);
    } else if (dist < 20) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(() => speechService.speak(question.countryName), 350);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => speechService.speak(question.countryName), 350);
    }

    timersRef.current.push(setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const finalScore = score + (isClose ? 1 : 0);
        playWithVisby();
        addSkillPoints('geography', 6);
        incrementGameStat('gamesPlayed');
        analyticsService.trackGameComplete(GAME_NAME, finalScore, finalScore === questions.length);
        checkDailyMissionCompletion('play_minigame', 1);
        if (pathNodeId) completePathNode(pathNodeId);
        const bonus = getGameOfTheDayBonusAura('MapPin');
        if (bonus > 0) addAura(bonus);
        setShowCelebration(true);
        setPhase('result');
      } else {
        setCurrentIndex((i) => i + 1);
        setTappedPos(null);
        setShowAnswer(false);
      }
    }, 1500));
  }, [showAnswer, question, currentIndex, questions.length, score]);

  if (phase === 'launching') {
    return (
      <GameLaunchSequence
        gameName="Map Pin"
        gameIcon="pin"
        rules="Tap the map where each country is located!"
        onComplete={() => setPhase('playing')}
      />
    );
  }

  if (phase === 'result') {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <View style={styles.container}>
        {showCelebration && (
          <GameCelebration
            tier={getCelebrationTier(score, questions.length)}
            score={score}
            maxScore={questions.length}
            auraEarned={totalAura}
            gameName="Map Pin"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
        <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={StyleSheet.absoluteFill} />
        {percent >= 50 && <FloatingParticles count={8} variant="mixed" opacity={0.3} speed="slow" />}
        <SafeAreaView style={styles.safeArea}>
          <Animated.View entering={ZoomIn.duration(500)} style={styles.resultCard}>
            <Heading level={2}>{percent >= 80 ? 'Geography Master!' : percent >= 50 ? 'Well Done!' : 'Keep Exploring!'}</Heading>
            <Text style={styles.resultScore}>{score}/{questions.length} correct</Text>
            <View style={styles.resultAuraRow}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text style={styles.resultAura}>+{totalAura} Aura</Text>
            </View>
            <Button title="Play Again" onPress={() => { setPhase('playing'); setCurrentIndex(0); setScore(0); setTotalAura(0); setTappedPos(null); setShowAnswer(false); setLastDist(0); }} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.lg }} />
            <Button title="Done" onPress={() => navigation.goBack()} variant="ghost" size="md" style={{ marginTop: spacing.sm }} />
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.journey.heroBg, colors.base.cream]} style={StyleSheet.absoluteFill} />
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

        <Animated.View entering={FadeInDown.duration(300)} style={styles.questionArea}>
          <Heading level={3} style={styles.prompt}>
            Tap where {question?.countryName} is!
          </Heading>
          <Caption>Hint: {question?.continent}</Caption>
        </Animated.View>

        <View style={styles.mapContainer}>
          <View
            style={styles.mapArea}
            onStartShouldSetResponder={() => true}
            onResponderRelease={handleMapTap}
          >
            <WorldMapBackground
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              oceanColor={colors.journey.mapOcean}
              landColor={colors.journey.mapLand}
              landStroke="rgba(160,140,120,0.35)"
            />

            <Svg width={MAP_WIDTH} height={MAP_HEIGHT} style={StyleSheet.absoluteFill} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
              {/* Distance line from tap to correct */}
              {showAnswer && tappedPos && question && (
                <SvgLine
                  x1={tappedPos.x / 100 * MAP_WIDTH}
                  y1={tappedPos.y / 100 * MAP_HEIGHT}
                  x2={question.approxX / 100 * MAP_WIDTH}
                  y2={question.approxY / 100 * MAP_HEIGHT}
                  stroke={lastDist < 12 ? colors.success.emerald : colors.accent.coral}
                  strokeWidth={1.5}
                  strokeDasharray="4,3"
                  opacity={0.6}
                />
              )}

              {/* User tap marker */}
              {tappedPos && (
                <Circle cx={tappedPos.x / 100 * MAP_WIDTH} cy={tappedPos.y / 100 * MAP_HEIGHT} r={8} fill={colors.accent.coral + '80'} stroke={colors.accent.coral} strokeWidth={2} />
              )}

              {/* Correct position (shown after tap) */}
              {showAnswer && question && (
                <>
                  <Circle cx={question.approxX / 100 * MAP_WIDTH} cy={question.approxY / 100 * MAP_HEIGHT} r={10} fill={colors.success.emerald + '40'} stroke={colors.success.emerald} strokeWidth={2} />
                  <SvgText x={question.approxX / 100 * MAP_WIDTH} y={question.approxY / 100 * MAP_HEIGHT - 14} textAnchor="middle" fontSize={10} fill={colors.success.emerald} fontWeight="bold">{question.countryName}</SvgText>
                </>
              )}
            </Svg>

            {/* Animated pulse ring on correct answer */}
            {showAnswer && question && (
              <Animated.View
                entering={ZoomInEasyDown.duration(400).springify()}
                style={{
                  position: 'absolute',
                  left: (question.approxX / 100) * MAP_WIDTH - 16,
                  top: (question.approxY / 100) * MAP_HEIGHT - 16,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: colors.success.emerald + '50',
                }}
                pointerEvents="none"
              />
            )}
          </View>

          {/* Distance feedback */}
          {showAnswer && (
            <Animated.View entering={FadeInDown.duration(200)} style={styles.feedbackChip}>
              <Text style={[
                styles.feedbackText,
                { color: lastDist < 6 ? colors.success.emerald : lastDist < 12 ? colors.reward.amber : colors.accent.coral },
              ]}>
                {lastDist < 6 ? 'Bullseye!' : lastDist < 12 ? 'Close!' : lastDist < 20 ? 'Almost there!' : 'Way off!'}
              </Text>
            </Animated.View>
          )}
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
  questionArea: { alignItems: 'center', paddingVertical: spacing.lg },
  prompt: { textAlign: 'center', marginBottom: spacing.xs },
  mapContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, gap: spacing.sm },
  mapArea: { width: MAP_WIDTH, height: MAP_HEIGHT, borderRadius: 16, overflow: 'hidden', borderWidth: 1.5, borderColor: colors.journey.cardBorder, position: 'relative' },
  feedbackChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  feedbackText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  resultCard: { alignItems: 'center', padding: spacing.xl, margin: spacing.lg, backgroundColor: colors.surface.card, borderRadius: 28 },
  resultScore: { fontFamily: 'Nunito-SemiBold', fontSize: 18, color: colors.text.secondary, marginVertical: spacing.sm },
  resultAuraRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultAura: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.reward.gold },
});

export default MapPinScreen;
