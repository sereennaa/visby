import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
import { SpeakerButton } from '../../components/ui/SpeakerButton';
import { GameLaunchSequence } from '../../components/effects/GameLaunchSequence';
import { GameCelebration, getCelebrationTier } from '../../components/effects/GameCelebration';
import { speechService } from '../../services/audio';
import type { RootStackParamList } from '../../types';

interface SortItem {
  id: string;
  text: string;
  category: string;
  icon: string;
}

interface SortChallenge {
  title: string;
  categories: Array<{ id: string; name: string; color: string }>;
  items: SortItem[];
}

const CHALLENGES: SortChallenge[] = [
  {
    title: 'Sort by Country',
    categories: [
      { id: 'jp', name: 'Japan', color: '#E8B4B8' },
      { id: 'fr', name: 'France', color: '#87CEEB' },
      { id: 'mx', name: 'Mexico', color: '#90EE90' },
    ],
    items: [
      { id: 's1', text: 'Sushi', category: 'jp', icon: '🍣' },
      { id: 's2', text: 'Croissant', category: 'fr', icon: '🥐' },
      { id: 's3', text: 'Tacos', category: 'mx', icon: '🌮' },
      { id: 's4', text: 'Kimono', category: 'jp', icon: '👘' },
      { id: 's5', text: 'Beret', category: 'fr', icon: '🎨' },
      { id: 's6', text: 'Piñata', category: 'mx', icon: '🎉' },
      { id: 's7', text: 'Origami', category: 'jp', icon: '🦢' },
      { id: 's8', text: 'Eiffel Tower', category: 'fr', icon: '🗼' },
      { id: 's9', text: 'Mariachi', category: 'mx', icon: '🎺' },
    ],
  },
  {
    title: 'Sort by Type',
    categories: [
      { id: 'food', name: 'Food', color: '#FFD8A8' },
      { id: 'landmark', name: 'Landmark', color: '#CFE9F7' },
      { id: 'tradition', name: 'Tradition', color: '#DFF5E1' },
    ],
    items: [
      { id: 't1', text: 'Pizza', category: 'food', icon: '🍕' },
      { id: 't2', text: 'Big Ben', category: 'landmark', icon: '🕐' },
      { id: 't3', text: 'Tea Ceremony', category: 'tradition', icon: '🍵' },
      { id: 't4', text: 'Pad Thai', category: 'food', icon: '🍜' },
      { id: 't5', text: 'Great Wall', category: 'landmark', icon: '🏯' },
      { id: 't6', text: 'Carnival', category: 'tradition', icon: '🎭' },
      { id: 't7', text: 'Ramen', category: 'food', icon: '🍲' },
      { id: 't8', text: 'Colosseum', category: 'landmark', icon: '🏛️' },
      { id: 't9', text: 'Day of Dead', category: 'tradition', icon: '💀' },
    ],
  },
  {
    title: 'Sort by Continent',
    categories: [
      { id: 'europe', name: 'Europe', color: '#C7B8EA' },
      { id: 'asia', name: 'Asia', color: '#E8B4B8' },
      { id: 'americas', name: 'Americas', color: '#90EE90' },
    ],
    items: [
      { id: 'c1', text: 'France', category: 'europe', icon: '🇫🇷' },
      { id: 'c2', text: 'Japan', category: 'asia', icon: '🇯🇵' },
      { id: 'c3', text: 'Brazil', category: 'americas', icon: '🇧🇷' },
      { id: 'c4', text: 'Italy', category: 'europe', icon: '🇮🇹' },
      { id: 'c5', text: 'Thailand', category: 'asia', icon: '🇹🇭' },
      { id: 'c6', text: 'Mexico', category: 'americas', icon: '🇲🇽' },
      { id: 'c7', text: 'Norway', category: 'europe', icon: '🇳🇴' },
      { id: 'c8', text: 'India', category: 'asia', icon: '🇮🇳' },
      { id: 'c9', text: 'Peru', category: 'americas', icon: '🇵🇪' },
    ],
  },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SortCategorize'>;
  route: RouteProp<RootStackParamList, 'SortCategorize'>;
};

const GAME_NAME = 'SortCategorize';

export const SortCategorizeScreen: React.FC<Props> = ({ navigation, route }) => {
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
    return () => timersRef.current.forEach(clearTimeout);
  }, []);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [phase, setPhase] = useState<'launching' | 'playing' | 'result'>('launching');
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SortItem | null>(null);
  const [sorted, setSorted] = useState<Record<string, string[]>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAura, setTotalAura] = useState(0);

  const challenge = CHALLENGES[challengeIndex % CHALLENGES.length];
  const shuffledItems = useMemo(
    () => [...challenge.items].sort(() => Math.random() - 0.5),
    [challengeIndex],
  );

  const remainingItems = useMemo(
    () => shuffledItems.filter((item) => !Object.values(sorted).flat().includes(item.id)),
    [shuffledItems, sorted],
  );

  const handleSelectItem = (item: SortItem) => {
    setSelectedItem(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDropOnCategory = useCallback((categoryId: string) => {
    if (!selectedItem) return;

    const isCorrect = selectedItem.category === categoryId;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundService.playMatch();
      const aura = 10;
      setTotalAura((a) => a + aura);
      addAura(aura);
      setCorrectCount((c) => c + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setSorted((prev) => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), selectedItem.id],
    }));
    setSelectedItem(null);

    // Check if all items are sorted
    const totalSorted = Object.values(sorted).flat().length + 1;
    if (totalSorted >= challenge.items.length) {
      timersRef.current.push(setTimeout(() => {
        const finalCorrect = correctCount + (isCorrect ? 1 : 0);
        playWithVisby();
        addSkillPoints('culture', 5);
        incrementGameStat('gamesPlayed');
        analyticsService.trackGameComplete(GAME_NAME, finalCorrect, finalCorrect === challenge.items.length);
        checkDailyMissionCompletion('play_minigame', 1);
        if (pathNodeId) completePathNode(pathNodeId);
        const bonus = getGameOfTheDayBonusAura('SortCategorize');
        if (bonus > 0) addAura(bonus);
        setShowCelebration(true);
        setPhase('result');
      }, 500));
    }
  }, [selectedItem, sorted, challenge.items.length]);

  if (phase === 'launching') {
    return (
      <GameLaunchSequence
        gameName="Sort & Categorize"
        gameIcon="grid"
        rules="Sort each item into the correct category!"
        onComplete={() => setPhase('playing')}
      />
    );
  }

  if (phase === 'result') {
    const percent = Math.round((correctCount / challenge.items.length) * 100);
    return (
      <View style={styles.container}>
        {showCelebration && (
          <GameCelebration
            tier={getCelebrationTier(correctCount, challenge.items.length)}
            score={correctCount}
            maxScore={challenge.items.length}
            auraEarned={totalAura}
            gameName="Sort & Categorize"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
        <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safeArea}>
          <Animated.View entering={ZoomIn.duration(500)} style={styles.resultCard}>
            <Heading level={2}>{percent >= 80 ? 'Sorting Star!' : percent >= 50 ? 'Nice Work!' : 'Keep Trying!'}</Heading>
            <Text style={styles.resultScore}>{correctCount}/{challenge.items.length} correct ({percent}%)</Text>
            <View style={styles.resultAuraRow}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text style={styles.resultAura}>+{totalAura} Aura</Text>
            </View>
            <Button title="Next Challenge" onPress={() => {
              setChallengeIndex((i) => i + 1);
              setSorted({});
              setCorrectCount(0);
              setPhase('playing');
              setSelectedItem(null);
            }} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.lg }} />
            <Button title="Done" onPress={() => navigation.goBack()} variant="ghost" size="md" style={{ marginTop: spacing.sm }} />
          </Animated.View>
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
          <Heading level={3}>Sort & Categorize</Heading>
          <View style={styles.scoreChip}>
            <Icon name="sparkles" size={14} color={colors.reward.gold} />
            <Text style={styles.scoreText}>{totalAura}</Text>
          </View>
        </View>

        <View style={styles.subtitleRow}>
          <Caption style={styles.subtitle}>{challenge.title}</Caption>
          <SpeakerButton text={`${challenge.title}. Tap an item, then tap the category it belongs to. Categories: ${challenge.categories.map(c => c.name).join(', ')}`} compact />
        </View>
        <Caption style={{ textAlign: 'center', color: colors.text.muted, marginBottom: spacing.sm }}>
          Tap an item, then tap the category it belongs to
        </Caption>

        {/* Categories (drop targets) */}
        <View style={styles.categoriesRow}>
          {challenge.categories.map((cat) => {
            const sortedHere = (sorted[cat.id] || []).length;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryBucket, { backgroundColor: cat.color + '30', borderColor: selectedItem ? cat.color : 'transparent' }]}
                onPress={() => handleDropOnCategory(cat.id)}
                disabled={!selectedItem}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryName, { color: cat.color }]}>{cat.name}</Text>
                <Text style={styles.categoryCount}>{sortedHere}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Items to sort */}
        <ScrollView style={styles.itemsScroll} contentContainerStyle={styles.itemsGrid}>
          {remainingItems.map((item) => (
            <Animated.View key={item.id} entering={FadeInUp.duration(200)}>
              <TouchableOpacity
                style={[styles.itemChip, selectedItem?.id === item.id && styles.itemChipSelected]}
                onPress={() => handleSelectItem(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <Text style={styles.itemText}>{item.text}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          {remainingItems.length === 0 && (
            <Caption style={{ textAlign: 'center', marginTop: spacing.lg }}>All sorted!</Caption>
          )}
        </ScrollView>
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
  subtitle: { textAlign: 'center', fontFamily: 'Nunito-Bold', fontSize: 16, color: colors.text.primary },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: spacing.xs },
  categoriesRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  categoryBucket: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: 16, borderWidth: 2 },
  categoryName: { fontFamily: 'Nunito-Bold', fontSize: 14 },
  categoryCount: { fontFamily: 'Nunito-Medium', fontSize: 12, color: colors.text.muted, marginTop: 2 },
  itemsScroll: { flex: 1 },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.sm, justifyContent: 'center' },
  itemChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface.card, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  itemChipSelected: { borderColor: colors.primary.wisteriaDark, backgroundColor: colors.primary.wisteriaFaded },
  itemIcon: { fontSize: 20 },
  itemText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.primary },
  resultCard: { alignItems: 'center', padding: spacing.xl, margin: spacing.lg, backgroundColor: colors.surface.card, borderRadius: 28 },
  resultScore: { fontFamily: 'Nunito-SemiBold', fontSize: 18, color: colors.text.secondary, marginVertical: spacing.sm },
  resultAuraRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultAura: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.reward.gold },
});

export default SortCategorizeScreen;
