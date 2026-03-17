import React, { useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useStore } from '../../store/useStore';
import { getCurrentWeeklyChallenge } from '../../config/seasonalEvents';
import { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WeeklyChallenge'>;
};

const TASK_TIPS: Record<string, { tip: string; screen: string; icon: IconName }> = {
  learn_phrases: { tip: 'Visit a country room and read facts to learn new phrases!', screen: 'CountryWorld', icon: 'globe' },
  complete_lesson: { tip: 'Open the Learn tab to find lessons and complete them.', screen: 'Learn', icon: 'book' },
  play_word_match: { tip: 'Head to Games and play a round of Word Match!', screen: 'WordMatch', icon: 'game' },
  review_flashcards: { tip: 'Review your flashcards to keep knowledge fresh.', screen: 'Flashcards', icon: 'flashcard' },
  hello_languages: { tip: 'Visit different country rooms to learn greetings!', screen: 'CountryWorld', icon: 'language' },
  visit_countries: { tip: 'Explore the world map and visit new countries!', screen: 'CountryWorld', icon: 'globe' },
  daily_streak: { tip: 'Just check in every day to keep your streak going!', screen: 'Home', icon: 'flame' },
  correct_answers: { tip: 'Take quizzes in country rooms to answer questions.', screen: 'Learn', icon: 'check' },
  read_food_facts: { tip: 'Visit country rooms and look for food-related facts.', screen: 'CountryWorld', icon: 'food' },
  play_cooking: { tip: 'Try the Cooking Game in the Games section!', screen: 'CookingGame', icon: 'food' },
  read_myths: { tip: 'Look for mythology stories in country rooms.', screen: 'CountryWorld', icon: 'sparkles' },
  myth_quiz: { tip: 'Complete quizzes in country rooms about myths.', screen: 'Learn', icon: 'sparkles' },
  read_nature: { tip: 'Read animal and nature facts in country rooms.', screen: 'CountryWorld', icon: 'nature' },
  nature_quiz: { tip: 'Take nature-related quizzes in country rooms.', screen: 'Learn', icon: 'nature' },
  read_history: { tip: 'Look for history facts in country rooms.', screen: 'CountryWorld', icon: 'history' },
  history_quiz: { tip: 'Complete history quizzes in country rooms.', screen: 'Learn', icon: 'history' },
  play_treasure: { tip: 'Play the Treasure Hunt game!', screen: 'TreasureHunt', icon: 'game' },
  earn_aura: { tip: 'Earn Aura by completing lessons, quizzes, and exploring!', screen: 'Learn', icon: 'star' },
  endangered_species: { tip: 'Read about endangered species in nature facts.', screen: 'CountryWorld', icon: 'nature' },
  visit_ancient: { tip: 'Visit Greece or Turkey to explore ancient history.', screen: 'CountryWorld', icon: 'history' },
  what_if: { tip: 'Explore What-If questions in country rooms.', screen: 'CountryWorld', icon: 'sparkles' },
};

function getDaysLeftInWeek(): number {
  const now = new Date();
  return 7 - now.getDay();
}

const WeeklyChallengeScreen: React.FC<Props> = ({ navigation }) => {
  const weeklyChallengeProgress = useStore((s) => s.getWeeklyChallengeProgress());
  const weeklyChallengeCompleted = useStore((s) => s.weeklyChallengeCompleted);

  const challenge = useMemo(() => getCurrentWeeklyChallenge(), []);
  const daysLeft = useMemo(() => getDaysLeftInWeek(), []);

  const completedCount = useMemo(() =>
    challenge.tasks.filter((t) => (weeklyChallengeProgress[t.type] ?? 0) >= t.target).length,
    [challenge.tasks, weeklyChallengeProgress],
  );

  const handleNavigate = useCallback((screen: string) => {
    if (screen === 'Home') {
      navigation.goBack();
    } else if (screen === 'CountryWorld') {
      navigation.navigate('Explore', { screen: 'CountryWorld' });
    } else if (screen === 'Learn') {
      navigation.navigate('Learn' as any);
    } else if (screen === 'WordMatch') {
      navigation.navigate('WordMatch' as any);
    } else if (screen === 'CookingGame') {
      navigation.navigate('CookingGame' as any);
    } else if (screen === 'TreasureHunt') {
      navigation.navigate('TreasureHunt' as any);
    } else if (screen === 'Flashcards') {
      navigation.navigate('Flashcards' as any);
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, colors.semantic.warmOrangeAccent + '15', colors.base.cream]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.challengeIconWrap}>
                <Icon name={(challenge.icon || 'star') as IconName} size={28} color={colors.semantic.warmOrange} />
              </View>
              <Heading level={1} style={styles.title}>{challenge.title}</Heading>
              <Caption style={styles.subtitle}>Weekly Challenge</Caption>
            </View>
          </Animated.View>

          {/* Stats row */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.statsRow}>
            <View style={styles.statChip}>
              <Icon name="check" size={14} color={colors.semantic.successAccent} />
              <Text variant="bodySmall" style={styles.statText}>{completedCount}/{challenge.tasks.length} tasks</Text>
            </View>
            <View style={styles.statChip}>
              <Icon name="time" size={14} color={colors.calm.ocean} />
              <Text variant="bodySmall" style={styles.statText}>{daysLeft} days left</Text>
            </View>
          </Animated.View>

          {/* Overall progress */}
          <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.progressSection}>
            <ProgressBar progress={(completedCount / challenge.tasks.length) * 100} height={10} />
          </Animated.View>

          {/* Reward preview */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <LinearGradient
              colors={weeklyChallengeCompleted
                ? [colors.semantic.successAccent + '20', colors.semantic.successAccent + '08']
                : [colors.semantic.warmOrangeAccent + '20', colors.semantic.warmOrangeAccent + '08']
              }
              style={styles.rewardCard}
            >
              {weeklyChallengeCompleted ? (
                <View style={styles.rewardRow}>
                  <Icon name="trophy" size={24} color={colors.semantic.successAccent} />
                  <View style={styles.rewardTextWrap}>
                    <Text variant="body" style={styles.rewardTitle}>Challenge Complete!</Text>
                    <Caption>You earned +{challenge.auraBonus} Aura and {challenge.cosmeticRewardName}</Caption>
                  </View>
                </View>
              ) : (
                <View style={styles.rewardRow}>
                  <Icon name="gift" size={24} color={colors.semantic.warmOrange} />
                  <View style={styles.rewardTextWrap}>
                    <Text variant="body" style={styles.rewardTitle}>Complete all tasks to earn:</Text>
                    <Caption>+{challenge.auraBonus} Aura &middot; {challenge.cosmeticRewardName}</Caption>
                  </View>
                </View>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Task list */}
          <View style={styles.taskList}>
            {challenge.tasks.map((task, idx) => {
              const current = weeklyChallengeProgress[task.type] ?? 0;
              const isDone = current >= task.target;
              const progress = Math.min(100, (current / task.target) * 100);
              const tipInfo = TASK_TIPS[task.type];

              return (
                <Animated.View
                  key={task.type + idx}
                  entering={FadeInDown.duration(350).delay(250 + idx * 60)}
                >
                  <Card style={[styles.taskCard, isDone && styles.taskCardDone]}>
                    <View style={styles.taskHeader}>
                      <View style={[styles.taskCheck, isDone && styles.taskCheckDone]}>
                        {isDone && <Icon name="check" size={14} color="#FFF" />}
                      </View>
                      <View style={styles.taskInfo}>
                        <Text
                          variant="body"
                          style={[styles.taskDesc, isDone && styles.taskDescDone]}
                        >
                          {task.description}
                        </Text>
                        <View style={styles.taskProgressRow}>
                          <View style={styles.taskProgressBarWrap}>
                            <ProgressBar progress={progress} height={6} variant={isDone ? 'level' : 'default'} />
                          </View>
                          <Caption style={styles.taskCount}>
                            {Math.min(current, task.target)}/{task.target}
                          </Caption>
                        </View>
                      </View>
                    </View>

                    {/* Tip + CTA */}
                    {!isDone && tipInfo && (
                      <TouchableOpacity
                        style={styles.tipRow}
                        onPress={() => handleNavigate(tipInfo.screen)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={tipInfo.tip}
                      >
                        <Icon name={tipInfo.icon} size={14} color={colors.primary.wisteriaDark} />
                        <Text variant="bodySmall" style={styles.tipText} numberOfLines={2}>
                          {tipInfo.tip}
                        </Text>
                        <Icon name="chevronRight" size={14} color={colors.primary.wisteriaDark} />
                      </TouchableOpacity>
                    )}
                  </Card>
                </Animated.View>
              );
            })}
          </View>

          {/* Motivational footer */}
          {!weeklyChallengeCompleted && (
            <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.footer}>
              <Text variant="bodySmall" style={styles.footerText}>
                Keep going! Complete all tasks to unlock {challenge.cosmeticRewardName}
              </Text>
            </Animated.View>
          )}

          <View style={{ height: spacing.xxxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WeeklyChallengeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: spacing.md,
    padding: spacing.xs,
    zIndex: 1,
  },
  headerCenter: {
    alignItems: 'center',
  },
  challengeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.semantic.warmOrangeAccent + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
    color: colors.text.primary,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.text.muted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statText: {
    color: colors.text.secondary,
    fontFamily: 'Nunito-SemiBold',
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  rewardCard: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rewardTextWrap: { flex: 1 },
  rewardTitle: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    marginBottom: 2,
  },
  taskList: {
    gap: spacing.sm,
  },
  taskCard: {
    padding: spacing.md,
  },
  taskCardDone: {
    backgroundColor: colors.semantic.successAccent + '08',
    borderColor: colors.semantic.successAccent + '30',
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  taskCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.semantic.checkboxBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  taskCheckDone: {
    backgroundColor: colors.semantic.successAccent,
    borderColor: colors.semantic.successAccent,
  },
  taskInfo: { flex: 1 },
  taskDesc: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: 6,
  },
  taskDescDone: {
    textDecorationLine: 'line-through',
    color: colors.text.muted,
  },
  taskProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  taskProgressBarWrap: { flex: 1 },
  taskCount: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: colors.text.muted,
    minWidth: 30,
    textAlign: 'right',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.semantic.checkboxBorder + '60',
  },
  tipText: {
    flex: 1,
    color: colors.primary.wisteriaDark,
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  footerText: {
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: 'Nunito-Medium',
  },
});
