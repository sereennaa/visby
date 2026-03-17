import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
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
import { getFlashcardDeckWithDiscoveries, getAllFlashcardsMixedWithDiscoveries, FlashcardItem, FLASHCARD_DECKS } from '../../config/learningContent';
import { AURA_REWARDS } from '../../config/constants';
import { SpeakerButton } from '../../components/ui/SpeakerButton';

type FlashcardsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Flashcards'>;
  route: RouteProp<RootStackParamList, 'Flashcards'>;
};

export const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ navigation, route }) => {
  const addAura = useStore(s => s.addAura);
  const bites = useStore(s => s.bites);
  const completePathNode = useStore(s => s.completePathNode);
  const gradeFlashcard = useStore(s => s.gradeFlashcard);
  const initFlashcardSR = useStore(s => s.initFlashcardSR);
  const studyWithVisby = useStore(s => s.studyWithVisby);
  const deckId = route.params?.deckId;
  const pathNodeId = route.params?.pathNodeId;
  const deckMeta = deckId ? FLASHCARD_DECKS.find(d => d.id === deckId) : undefined;
  const [cards] = useState<FlashcardItem[]>(() => {
    const discoveredIds = bites.filter(b => b.worldDishId).map(b => b.worldDishId!);
    return deckId
      ? getFlashcardDeckWithDiscoveries(deckId, discoveredIds)
      : getAllFlashcardsMixedWithDiscoveries(discoveredIds, 12);
  });

  useEffect(() => {
    if (cards.length > 0) {
      initFlashcardSR(cards.map((c) => c.id));
    }
  }, [cards, initFlashcardSR]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knewCount, setKnewCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const card = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + (isFinished ? 1 : 0)) / cards.length) * 100 : 0;
  const isLastCard = cards.length > 0 && currentIndex === cards.length - 1;

  if (cards.length === 0) {
    return (
      <LinearGradient colors={[colors.calm.skyLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Icon name="flashcard" size={64} color={colors.text.muted} />
                <Heading level={2} style={styles.resultsTitle}>No Cards Available</Heading>
                <Caption>Check back later for new flashcards.</Caption>
              </View>
            </Card>
            <Button title="Go Back" onPress={() => navigation.goBack()} variant="primary" size="lg" fullWidth />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const advanceCard = (knew: boolean) => {
    if (knew) setKnewCount(prev => prev + 1);
    gradeFlashcard(card.id, knew);

    if (isLastCard) {
      addAura(AURA_REWARDS.FLASHCARD_SESSION);
      studyWithVisby();
      if (pathNodeId) completePathNode(pathNodeId);
      setIsFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnewCount(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const stillLearning = cards.length - knewCount;

    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <View style={styles.resultsIconWrap}>
                  <Icon
                    name={(knewCount === cards.length ? 'star' : knewCount > cards.length / 2 ? 'hand' : 'book') as IconName}
                    size={64}
                    color={knewCount === cards.length ? colors.reward.gold : knewCount > cards.length / 2 ? colors.primary.wisteriaDark : colors.calm.ocean}
                  />
                </View>
                <Heading level={1} style={styles.resultsTitle}>Practice Complete!</Heading>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text variant="h2" color={colors.success.emerald}>{knewCount}</Text>
                    <Caption>Knew it</Caption>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text variant="h2" color={colors.calm.ocean}>{stillLearning}</Text>
                    <Caption>Still learning</Caption>
                  </View>
                </View>
                <View style={styles.auraRow}>
                  <Icon name="sparkles" size={24} color={colors.reward.gold} />
                  <Text variant="h2" color={colors.reward.amber}>+{AURA_REWARDS.FLASHCARD_SESSION}</Text>
                  <Text variant="body" color={colors.text.secondary}>Aura earned</Text>
                </View>
                <ProgressBar
                  progress={Math.round((knewCount / cards.length) * 100)}
                  variant="aura"
                  height={10}
                />
                <Caption style={styles.progressCaption}>
                  {Math.round((knewCount / cards.length) * 100)}% mastered
                </Caption>
              </View>
            </Card>
            <View style={styles.resultsActions}>
              <Button
                title="Practice Again"
                onPress={handleRestart}
                variant="secondary"
                size="lg"
                fullWidth
              />
              <Button
                title="Try Another Deck"
                onPress={() => {
                  navigation.goBack();
                  navigation.navigate('Flashcards');
                }}
                variant="secondary"
                size="lg"
                fullWidth
              />
              <Button
                title="Done"
                onPress={() => navigation.goBack()}
                variant="primary"
                size="lg"
                fullWidth
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.calm.skyLight, colors.base.cream]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={2}>{deckMeta ? deckMeta.title : 'Flashcards'}</Heading>
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Progress */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} variant="default" height={8} />
          <Caption style={styles.progressLabel}>
            {currentIndex + 1} of {cards.length}
          </Caption>
        </View>

        {/* Flashcard */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            onPress={() => setIsFlipped(prev => !prev)}
            activeOpacity={0.9}
            style={styles.flashcardTouchable}
          >
            <Card style={styles.flashcard}>
              <LinearGradient
                colors={isFlipped
                  ? [colors.success.honeydew, colors.base.cream]
                  : [colors.primary.wisteriaFaded, colors.base.cream]
                }
                style={styles.flashcardGradient}
              >
                {card.imageUrl ? (
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.flashcardImage}
                    contentFit="cover"
                    transition={200}
                    placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
                  />
                ) : (
                  <View style={styles.flashcardIconWrap}>
                    <Icon name="flashcard" size={64} color={colors.primary.wisteriaDark} />
                  </View>
                )}
                <Heading level={1} style={styles.flashcardText}>
                  {isFlipped ? card.back : card.front}
                </Heading>
                <View style={styles.flashcardSpeaker}>
                  <SpeakerButton text={isFlipped ? card.back : card.front} size={22} />
                </View>
                <View style={styles.flipHint}>
                  <Icon name="flashcard" size={16} color={colors.text.muted} />
                  <Caption>{isFlipped ? 'Tap to see front' : 'Tap to reveal'}</Caption>
                </View>
              </LinearGradient>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.stillLearningButton}
              onPress={() => advanceCard(false)}
            >
              <Icon name="book" size={20} color={colors.calm.ocean} />
              <Text variant="body" color={colors.calm.ocean}>Still learning</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.knewItButton}
              onPress={() => advanceCard(true)}
            >
              <Icon name="check" size={20} color={colors.success.emerald} />
              <Text variant="body" color={colors.success.emerald}>Knew it!</Text>
            </TouchableOpacity>
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
  progressLabel: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  flashcardTouchable: {
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  flashcard: {
    padding: 0,
    overflow: 'hidden',
  },
  flashcardGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 1.5,
    paddingHorizontal: spacing.xl,
    minHeight: 300,
  },
  flashcardIconWrap: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  flashcardImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: spacing.lg,
    alignSelf: 'center',
  },
  flashcardText: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  flashcardSpeaker: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  flipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    opacity: 0.6,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stillLearningButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: spacing.button.lg,
    borderRadius: spacing.radius.xl,
    backgroundColor: colors.calm.skyLight,
    borderWidth: 2,
    borderColor: colors.calm.skyDark,
  },
  knewItButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: spacing.button.lg,
    borderRadius: spacing.radius.xl,
    backgroundColor: colors.success.honeydew,
    borderWidth: 2,
    borderColor: colors.success.honeydewDark,
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 2,
    height: 40,
    backgroundColor: colors.primary.wisteriaLight,
    borderRadius: 1,
  },
  auraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  progressCaption: {
    marginTop: spacing.sm,
  },
  resultsActions: {
    gap: spacing.sm,
  },
});

export default FlashcardsScreen;
