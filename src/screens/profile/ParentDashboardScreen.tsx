import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';

type ParentDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ParentDashboard'>;
};

export const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({ navigation }) => {
  const user = useStore((s) => s.user);
  const getLessonsCompletedToday = useStore((s) => s.getLessonsCompletedToday);
  const stamps = useStore((s) => s.stamps);
  const lessonsToday = getLessonsCompletedToday();
  const countriesVisited = user?.visitedCountries?.length ?? 0;

  return (
    <LinearGradient colors={[colors.base.cream, colors.primary.wisteriaFaded]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Parent view</Heading>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Caption style={styles.subtitle}>Read-only. No chat or personal content.</Caption>

          <Card style={styles.card}>
            <Text variant="h3" style={styles.cardTitle}>Today</Text>
            <View style={styles.statRow}>
              <Icon name="book" size={20} color={colors.primary.wisteriaDark} />
              <Text variant="body">Lessons completed: {lessonsToday}</Text>
            </View>
            <View style={styles.statRow}>
              <Icon name="compass" size={20} color={colors.calm.ocean} />
              <Text variant="body">Countries visited: {countriesVisited}</Text>
            </View>
            <View style={styles.statRow}>
              <Icon name="stamp" size={20} color={colors.reward.peachDark} />
              <Text variant="body">Stamps collected: {stamps.length}</Text>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text variant="h3" style={styles.cardTitle}>Overall</Text>
            <View style={styles.statRow}>
              <Icon name="flame" size={20} color={colors.status.streak} />
              <Text variant="body">Current streak: {user?.currentStreak ?? 0} days</Text>
            </View>
            <View style={styles.statRow}>
              <Icon name="star" size={20} color={colors.reward.gold} />
              <Text variant="body">Level: {user?.level ?? 1}</Text>
            </View>
          </Card>

          <Caption style={styles.footer}>You're in charge. Only friends they add can see their house. Place chat is moderated.</Caption>
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
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  footer: {
    marginTop: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});

export default ParentDashboardScreen;
