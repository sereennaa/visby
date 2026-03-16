import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore, DEFAULT_SKILLS } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import type { SkillProgress } from '../../types';
import { getSkillConfig } from '../../config/skills';
import { copy } from '../../config/copy';

type SkillDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SkillDetail'>;
  route: RouteProp<RootStackParamList, 'SkillDetail'>;
};

const MILESTONES = [25, 50, 75, 100];

export const SkillDetailScreen: React.FC<SkillDetailScreenProps> = ({ navigation, route }) => {
  const { skillKey } = route.params;
  const user = useStore((s) => s.user);
  const skills = user?.skills ?? DEFAULT_SKILLS;
  const score = skills[skillKey];
  const config = getSkillConfig(skillKey);

  const nextMilestone = MILESTONES.find((m) => m > score) ?? 100;
  const isMax = score >= 100;

  const whatsNextText = isMax
    ? copy.profile.skillDetail.maxScore
    : score >= 50
      ? copy.profile.skillDetail.keepGoing.replace('{score}', String(score))
      : copy.profile.skillDetail.nextMilestone.replace('{next}', String(nextMilestone));

  const handleAction = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      navigation.navigate(screen as keyof RootStackParamList, params as never);
    },
    [navigation]
  );

  if (!config) {
    return null;
  }

  return (
    <LinearGradient colors={[colors.calm.skyLight, colors.base.cream]} style={styles.container}>
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
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconWrap}>
              <Icon name={config.icon} size={24} color={colors.primary.wisteriaDark} />
            </View>
            <Heading level={1}>{config.label}</Heading>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.scoreCard}>
            <Caption style={styles.scoreLabel}>{copy.profile.skillDetail.yourScore}</Caption>
            <Text style={styles.scoreValue}>{score}</Text>
            <Caption style={styles.scoreMax}>/ 100</Caption>
          </Card>

          <Card style={styles.sectionCard}>
            <Heading level={3} style={styles.sectionTitle}>
              {copy.profile.skillDetail.howToImprove}
            </Heading>
            <Caption style={styles.hintText}>{config.hint}</Caption>
          </Card>

          <Card style={styles.sectionCard}>
            <Heading level={3} style={styles.sectionTitle}>
              {copy.profile.skillDetail.whatsNext}
            </Heading>
            <Caption style={styles.hintText}>{whatsNextText}</Caption>
          </Card>

          <View style={styles.actionsSection}>
            <Heading level={3} style={styles.actionsTitle}>
              {copy.profile.skillDetail.actionsTitle}
            </Heading>
            {config.actions.map((action, idx) => (
              <Button
                key={idx}
                title={action.label}
                onPress={() => handleAction(action.screen, action.params)}
                variant="primary"
                size="md"
                style={styles.actionButton}
              />
            ))}
          </View>
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
  headerTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxxl },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  scoreLabel: {
    marginBottom: spacing.xs,
  },
  scoreValue: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
    color: colors.primary.wisteriaDark,
  },
  scoreMax: {
    marginTop: 2,
    color: colors.text.muted,
  },
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  hintText: {
    lineHeight: 22,
  },
  actionsSection: {
    marginTop: spacing.sm,
  },
  actionsTitle: {
    marginBottom: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

export default SkillDetailScreen;
