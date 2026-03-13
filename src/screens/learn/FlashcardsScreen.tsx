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
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';

const FLASHCARDS = [
  { id: 'f1', front: 'Bonjour', back: 'Hello (French)', emoji: '🇫🇷' },
  { id: 'f2', front: 'Konnichiwa', back: 'Hello (Japanese)', emoji: '🇯🇵' },
  { id: 'f3', front: 'Hola', back: 'Hello (Spanish)', emoji: '🇲🇽' },
  { id: 'f4', front: 'Ciao', back: 'Hello/Goodbye (Italian)', emoji: '🇮🇹' },
  { id: 'f5', front: 'Sushi', back: 'Vinegared rice with toppings (Japan)', emoji: '🍣' },
  { id: 'f6', front: 'Croissant', back: 'Buttery crescent roll (France)', emoji: '🥐' },
  { id: 'f7', front: 'Taco', back: 'Filled tortilla (Mexico)', emoji: '🌮' },
  { id: 'f8', front: 'Olá', back: 'Hello (Portuguese/Brazil)', emoji: '🇧🇷' },
];

type FlashcardsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ navigation }) => {
  const { addAura } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knewCount, setKnewCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const card = FLASHCARDS[currentIndex];
  const progress = ((currentIndex + (isFinished ? 1 : 0)) / FLASHCARDS.length) * 100;
  const isLastCard = currentIndex === FLASHCARDS.length - 1;

  const advanceCard = (knew: boolean) => {
    if (knew) setKnewCount(prev => prev + 1);

    if (isLastCard) {
      addAura(15);
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
    const stillLearning = FLASHCARDS.length - knewCount;

    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Text variant="heroTitle" align="center" style={styles.resultsEmoji}>
                  {knewCount === FLASHCARDS.length ? '🌟' : knewCount > FLASHCARDS.length / 2 ? '💪' : '📚'}
                </Text>
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
                  <Text variant="h2" color={colors.reward.amber}>+15</Text>
                  <Text variant="body" color={colors.text.secondary}>Aura earned</Text>
                </View>
                <ProgressBar
                  progress={Math.round((knewCount / FLASHCARDS.length) * 100)}
                  variant="aura"
                  height={10}
                />
                <Caption style={styles.progressCaption}>
                  {Math.round((knewCount / FLASHCARDS.length) * 100)}% mastered
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={2}>Flashcards</Heading>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} variant="default" height={8} />
          <Caption style={styles.progressLabel}>
            {currentIndex + 1} of {FLASHCARDS.length}
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
                <Text variant="heroTitle" align="center" style={styles.flashcardEmoji}>
                  {card.emoji}
                </Text>
                <Heading level={1} style={styles.flashcardText}>
                  {isFlipped ? card.back : card.front}
                </Heading>
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
  flashcardEmoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  flashcardText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
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
  resultsEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
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
