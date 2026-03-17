import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { copy } from '../../config/copy';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { COUNTRIES } from '../../config/constants';

const DISCOVERY_MILESTONES = [25, 50, 100, 150, 200];

type DiscoveryLogScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DiscoveryLog'>;
};

export const DiscoveryLogScreen: React.FC<DiscoveryLogScreenProps> = ({ navigation }) => {
  const getDiscoveryLog = useStore((s) => s.getDiscoveryLog);
  const discoveries = getDiscoveryLog();
  const count = discoveries.length;
  const progressPercent = Math.min(100, (count / 200) * 100);

  const groupedByCountry = useMemo(() => {
    const groups: Record<string, typeof discoveries> = {};
    for (const d of discoveries) {
      if (!groups[d.countryId]) groups[d.countryId] = [];
      groups[d.countryId].push(d);
    }
    return groups;
  }, [discoveries]);

  const showShareMilestone = DISCOVERY_MILESTONES.includes(count);

  const handleShareMilestone = () => {
    Share.share({
      message: `I've discovered ${count} things about the world in Visby! 🌍✨ #Visby`,
    });
  };

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
          <View style={styles.collectionHeader}>
            <Text variant="h3" style={styles.collectionTitle}>Your Discoveries: {count}/200</Text>
            <ProgressBar progress={progressPercent} variant="aura" height={8} style={styles.progressBar} />
          </View>

          {showShareMilestone && (
            <Card style={styles.milestoneCard}>
              <Icon name="sparkles" size={28} color={colors.reward.gold} />
              <View style={styles.milestoneContent}>
                <Text variant="body" style={styles.milestoneTitle}>{count} discoveries! 🎉</Text>
                <Caption style={styles.milestoneSub}>Share your milestone with friends!</Caption>
                <Button title="Share" onPress={handleShareMilestone} variant="primary" size="sm" style={styles.shareBtn} />
              </View>
            </Card>
          )}

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
              {Object.entries(groupedByCountry).map(([countryId, items]) => {
                const country = COUNTRIES.find((c) => c.id === countryId);
                const flagEmoji = country?.flagEmoji ?? '🌍';
                return (
                  <View key={countryId} style={styles.countryGroup}>
                    <View style={styles.countryGroupHeader}>
                      <Text style={styles.countryFlag}>{flagEmoji}</Text>
                      <Text variant="body" style={styles.countryGroupTitle}>{country?.name ?? countryId}</Text>
                      <Caption style={styles.countryGroupCount}>{items.length} discoveries</Caption>
                    </View>
                    {items.map((d) => {
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
                              <Caption style={styles.itemMeta}>{dateStr}</Caption>
                            </View>
                          </View>
                        </Card>
                      );
                    })}
                  </View>
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
  collectionHeader: {
    marginBottom: spacing.md,
  },
  collectionTitle: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  progressBar: {
    marginBottom: spacing.sm,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.reward.peachLight,
  },
  milestoneContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  milestoneTitle: {
    fontFamily: 'Nunito-Bold',
    marginBottom: spacing.xs,
  },
  milestoneSub: {
    marginBottom: spacing.sm,
  },
  shareBtn: {
    alignSelf: 'flex-start',
  },
  countryGroup: {
    marginBottom: spacing.lg,
  },
  countryGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryGroupTitle: {
    fontFamily: 'Nunito-SemiBold',
    flex: 1,
  },
  countryGroupCount: {
    color: colors.text.muted,
  },
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
