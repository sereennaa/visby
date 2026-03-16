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
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore, DEFAULT_SKILLS } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import type { SkillProgress } from '../../types';

type ProgressScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Progress'>;
};

const SKILL_CONFIG: { key: keyof SkillProgress; label: string; icon: IconName; hint: string }[] = [
  { key: 'language', label: 'Language', icon: 'language', hint: 'Lessons, Word Match, quizzes' },
  { key: 'geography', label: 'Geography', icon: 'geography', hint: 'Treasure Hunt, map exploration' },
  { key: 'culture', label: 'Culture', icon: 'culture', hint: 'Lessons, quizzes, stamps' },
  { key: 'history', label: 'History', icon: 'history', hint: 'History lessons, quizzes' },
  { key: 'cooking', label: 'Cooking', icon: 'food', hint: 'Cooking game, bites' },
  { key: 'exploration', label: 'Exploration', icon: 'compass', hint: 'Treasure Hunt, locations' },
];

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const user = useStore((s) => s.user);
  const skills = user?.skills ?? DEFAULT_SKILLS;

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
          <Card style={styles.card}>
            {SKILL_CONFIG.map(({ key, label, icon, hint }) => (
              <View key={key} style={styles.skillRow}>
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
              </View>
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
});

export default ProgressScreen;
