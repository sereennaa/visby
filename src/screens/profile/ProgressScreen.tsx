import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Icon } from '../../components/ui/Icon';
import { useStore, DEFAULT_SKILLS } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { SKILL_CONFIG } from '../../config/skills';

type ProgressScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Progress'>;
};

/** Maps quiz categories to display skill categories for accuracy aggregation */
const QUIZ_TO_SKILL: Record<string, string> = {
  language: 'language',
  slang: 'language',
  geography: 'geography',
  culture: 'culture',
  etiquette: 'culture',
  music: 'culture',
  myths: 'culture',
  history: 'history',
  science: 'history',
  food: 'cooking',
  nature: 'exploration',
};

const SKILL_ACCURACY_DISPLAY = [
  { key: 'language', label: 'Language', icon: 'language' as const },
  { key: 'geography', label: 'Geography', icon: 'geography' as const },
  { key: 'culture', label: 'Culture', icon: 'culture' as const },
  { key: 'history', label: 'History', icon: 'history' as const },
  { key: 'cooking', label: 'Cooking', icon: 'food' as const },
  { key: 'exploration', label: 'Exploration', icon: 'compass' as const },
];

function getAggregatedAccuracy(
  categoryAccuracy: Record<string, { correct: number; total: number }>,
  skillKey: string
): number {
  let correct = 0;
  let total = 0;
  for (const [quizCat, skill] of Object.entries(QUIZ_TO_SKILL)) {
    if (skill !== skillKey) continue;
    const rec = categoryAccuracy[quizCat];
    if (rec) {
      correct += rec.correct;
      total += rec.total;
    }
  }
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

function getAccuracyLabel(pct: number): string {
  if (pct >= 70) return 'Strong';
  if (pct >= 40) return 'Learning';
  return 'Needs work';
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const user = useStore((s) => s.user);
  const skills = user?.skills ?? DEFAULT_SKILLS;
  const categoryAccuracy = useStore((s) => s.categoryAccuracy);

  return (
    <LinearGradient colors={[colors.calm.skyLight, colors.base.cream]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Progress</Heading>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Caption style={styles.subtitle}>Level up each skill by learning and playing. Max 100 per skill.</Caption>

          <Heading level={2} style={styles.sectionTitle}>Quiz Accuracy by Category</Heading>
          <Caption style={styles.sectionSubtitle}>Based on your quiz answers. Take more quizzes to improve!</Caption>
          <Card style={styles.card}>
            {SKILL_ACCURACY_DISPLAY.map(({ key, label, icon }) => {
              const accuracy = getAggregatedAccuracy(categoryAccuracy, key);
              const labelText = getAccuracyLabel(accuracy);
              const hasData = Object.keys(categoryAccuracy).some(cat => QUIZ_TO_SKILL[cat] === key);
              return (
                <View key={key} style={styles.accuracyRow}>
                  <View style={styles.accuracyHeader}>
                    <View style={styles.skillIconWrap}>
                      <Icon name={icon} size={20} color={colors.primary.wisteriaDark} />
                    </View>
                    <View style={styles.accuracyLabelWrap}>
                      <Text variant="body" style={styles.skillLabel}>{label}</Text>
                      <Caption style={styles.accuracyLabel}>
                        {hasData ? `${accuracy}% · ${labelText}` : 'No quiz data yet'}
                      </Caption>
                    </View>
                  </View>
                  <View style={styles.accuracyBarBg}>
                    <View
                      style={[
                        styles.accuracyBarFill,
                        {
                          width: `${hasData ? accuracy : 0}%`,
                          backgroundColor:
                            accuracy >= 70
                              ? colors.success.emerald
                              : accuracy >= 40
                              ? colors.reward.amber
                              : colors.status.error,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </Card>

          <Heading level={2} style={styles.sectionTitle}>Skill Levels</Heading>
          <Card style={styles.card}>
            {SKILL_CONFIG.map(({ key, label, icon, hint }) => (
              <TouchableOpacity
                key={key}
                style={styles.skillRow}
                onPress={() => navigation.navigate('SkillDetail', { skillKey: key })}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${label}, score ${skills[key]}. Tap to see how to improve.`}
              >
                <View style={styles.skillHeader}>
                  <View style={styles.skillIconWrap}>
                    <Icon name={icon} size={20} color={colors.primary.wisteriaDark} />
                  </View>
                  <View style={styles.skillLabelWrap}>
                    <Text variant="body" style={styles.skillLabel}>{label}</Text>
                    <Caption style={styles.skillHint}>{hint}</Caption>
                  </View>
                  <Text variant="h3" color={colors.primary.wisteriaDark}>{skills[key]}</Text>
                </View>
                <ProgressBar progress={skills[key]} variant="aura" height={8} style={styles.progressBar} />
              </TouchableOpacity>
            ))}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backButton: { padding: spacing.xs, marginLeft: -spacing.xs },
  headerSpacer: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxxl },
  subtitle: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  card: { padding: spacing.lg },
  skillRow: { marginBottom: spacing.lg },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  skillIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  skillLabelWrap: { flex: 1 },
  skillLabel: { fontFamily: 'Nunito-Bold' },
  skillHint: { marginTop: 2 },
  progressBar: { marginTop: spacing.xs },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: spacing.md,
  },
  accuracyRow: {
    marginBottom: spacing.lg,
  },
  accuracyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  accuracyLabelWrap: { flex: 1 },
  accuracyLabel: { marginTop: 2 },
  accuracyBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.wisteriaFaded,
    overflow: 'hidden',
  },
  accuracyBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProgressScreen;
