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
import { EmptyState } from '../../components/ui/EmptyState';
import { copy } from '../../config/copy';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { COUNTRIES } from '../../config/constants';

type DiscoveryLogScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DiscoveryLog'>;
};

export const DiscoveryLogScreen: React.FC<DiscoveryLogScreenProps> = ({ navigation }) => {
  const getDiscoveryLog = useStore((s) => s.getDiscoveryLog);
  const discoveries = getDiscoveryLog();

  return (
    <LinearGradient colors={[colors.calm.skyLight, colors.base.cream]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Discovery log</Heading>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Caption style={styles.subtitle}>What you&apos;ve learned in country rooms</Caption>
          {discoveries.length === 0 ? (
            <EmptyState
              icon="compass"
              title={copy.empty.noDiscoveryLog.title}
              subtitle={copy.empty.noDiscoveryLog.subtitle}
              style={styles.emptyCard}
            />
          ) : (
            <View style={styles.list}>
              {discoveries.map((d) => {
                const country = COUNTRIES.find((c) => c.id === d.countryId);
                const date = new Date(d.learnedAt);
                const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <Card key={d.id} style={styles.itemCard}>
                    <View style={styles.itemRow}>
                      <View style={[styles.itemIconWrap, d.type === 'quiz' && styles.itemIconQuiz]}>
                        <Icon name={d.type === 'fact' ? 'book' : 'trophy'} size={20} color={colors.primary.wisteriaDark} />
                      </View>
                      <View style={styles.itemBody}>
                        <Text variant="body" style={styles.itemTitle}>{d.title}</Text>
                        <Caption style={styles.itemMeta}>{country?.name ?? d.countryId} · {dateStr}</Caption>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
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
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  list: { gap: spacing.sm },
  itemCard: { padding: spacing.md },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemIconQuiz: {
    backgroundColor: colors.reward.peachLight,
  },
  itemBody: { flex: 1 },
  itemTitle: { fontFamily: 'Nunito-SemiBold' },
  itemMeta: { marginTop: 2 },
});

export default DiscoveryLogScreen;
