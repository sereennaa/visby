import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { whimsicalCopy } from '../../theme/whimsical';

type InboxScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Inbox'>;
};

type ActivityItem = {
  id: string;
  type: 'streak' | 'badge' | 'stamp' | 'bite' | 'message';
  icon: IconName;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
};

export const InboxScreen: React.FC<InboxScreenProps> = ({ navigation }) => {
  const { user, stamps, bites, badges } = useStore();

  const activityItems = useMemo((): ActivityItem[] => {
    const items: ActivityItem[] = [];

    if (user?.currentStreak && user.currentStreak > 0) {
      items.push({
        id: 'streak',
        type: 'streak',
        icon: 'flame',
        title: `${user.currentStreak}-day streak!`,
        subtitle: 'Keep checking in to grow your streak',
        color: colors.status.streak,
        bg: colors.status.streakBg,
      });
    }

    const latestBadge = badges[badges.length - 1];
    if (latestBadge) {
      items.push({
        id: `badge-${latestBadge.badgeId}`,
        type: 'badge',
        icon: 'trophy',
        title: 'Badge earned',
        subtitle: latestBadge.badgeId.replace(/_/g, ' '),
        color: colors.reward.gold,
        bg: colors.reward.peachLight,
      });
    }

    const latestStamp = stamps[stamps.length - 1];
    if (latestStamp) {
      items.push({
        id: `stamp-${latestStamp.id}`,
        type: 'stamp',
        icon: 'stamp',
        title: 'Stamp collected',
        subtitle: latestStamp.locationName || latestStamp.type,
        color: colors.primary.wisteriaDark,
        bg: colors.surface.lavender,
      });
    }

    const latestBite = bites[bites.length - 1];
    if (latestBite) {
      items.push({
        id: `bite-${latestBite.id}`,
        type: 'bite',
        icon: 'food',
        title: 'Bite logged',
        subtitle: latestBite.name || latestBite.cuisine,
        color: colors.reward.peachDark,
        bg: colors.surface.peach,
      });
    }

    return items.slice(0, 8);
  }, [user?.currentStreak, stamps, bites, badges]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, colors.calm.skyLight, colors.primary.wisteriaFaded, colors.base.cream]}
        locations={[0, 0.4, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <FloatingParticles count={4} variant="sparkle" opacity={0.2} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.header}>
            <Heading level={1}>Inbox</Heading>
            <Caption style={styles.subtitle}>
              Notifications and activity
            </Caption>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <View style={styles.sectionRow}>
              <Icon name="flash" size={18} color={colors.primary.wisteriaDark} />
              <Text variant="body" style={styles.sectionLabel}>Activity</Text>
            </View>

            {activityItems.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconWrap}>
                  <Icon name="mailOpen" size={32} color={colors.text.muted} />
                </View>
                <Text variant="body" style={styles.emptyTitle}>No activity yet</Text>
                <Caption style={styles.emptySubtitle}>
                  {whimsicalCopy.noActivityYet}
                </Caption>
              </View>
            ) : (
              activityItems.map((item, i) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.duration(400).delay(250 + i * 60)}
                >
                  <View style={[styles.activityCard, { backgroundColor: item.bg }]}>
                    <View style={[styles.activityIconWrap, { backgroundColor: item.color + '20' }]}>
                      <Icon name={item.icon} size={22} color={item.color} />
                    </View>
                    <View style={styles.activityText}>
                      <Text variant="body" style={styles.activityTitle}>{item.title}</Text>
                      <Caption numberOfLines={1}>{item.subtitle}</Caption>
                    </View>
                  </View>
                </Animated.View>
              ))
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(400)}>
            <View style={styles.sectionRow}>
              <Icon name="mail" size={18} color={colors.primary.wisteriaDark} />
              <Text variant="body" style={styles.sectionLabel}>Messages</Text>
            </View>
            <View style={styles.comingSoonCard}>
              <Icon name="mailOutline" size={36} color={colors.primary.wisteria} />
              <Text variant="body" style={styles.comingSoonTitle}>{whimsicalCopy.comingSoon}</Text>
              <Caption style={styles.comingSoonSubtitle}>
                Messages and notifications from your trips will appear here.
              </Caption>
            </View>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 120,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  emptyCard: {
    padding: spacing.xl,
    backgroundColor: 'rgba(184, 165, 224, 0.06)',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyIconWrap: {
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: 'Nunito-Bold',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.sm,
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityText: { flex: 1 },
  activityTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
  },
  comingSoonCard: {
    padding: spacing.xl,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary.wisteriaLight,
    borderStyle: 'dashed',
  },
  comingSoonTitle: {
    fontFamily: 'Nunito-SemiBold',
    marginTop: spacing.sm,
    color: colors.primary.wisteriaDark,
  },
  comingSoonSubtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});

export default InboxScreen;
