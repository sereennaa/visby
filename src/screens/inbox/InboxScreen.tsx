import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { getGameOfTheDay } from '../../config/gameOfTheDay';
import { RootStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { whimsicalCopy } from '../../theme/whimsical';

type InboxScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Inbox'>;
};

type ActivityItem = {
  id: string;
  type: 'streak' | 'badge' | 'stamp' | 'bite' | 'message' | 'friend_request' | 'mission' | 'game_of_the_day';
  icon: IconName;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  onPress?: () => void;
};

export const InboxScreen: React.FC<InboxScreenProps> = ({ navigation }) => {
  const { user, stamps, bites, badges, friendRequests, getDailyMission, dailyMissionCompletedAt } = useStore();

  const incomingRequests = useMemo(() => friendRequests.filter((r) => r.toUserId === user?.id), [friendRequests, user?.id]);
  const dailyMission = getDailyMission();
  const showMissionPrompt = dailyMission && !dailyMissionCompletedAt;

  const activityItems = useMemo((): ActivityItem[] => {
    const items: ActivityItem[] = [];

    if (incomingRequests.length > 0) {
      items.push({
        id: 'friend-requests',
        type: 'friend_request',
        icon: 'people',
        title: 'Friend requests',
        subtitle: `${incomingRequests.length} pending — tap to accept or reject`,
        color: colors.primary.wisteriaDark,
        bg: colors.primary.wisteriaFaded,
        onPress: () => navigation.navigate('Friends'),
      });
    }

    if (showMissionPrompt && dailyMission) {
      items.push({
        id: 'mission',
        type: 'mission',
        icon: 'target',
        title: "Today's mission",
        subtitle: dailyMission.label,
        color: colors.reward.peachDark,
        bg: colors.reward.peachLight,
        onPress: () => navigation.navigate('Home'),
      });
    }

    const gotd = getGameOfTheDay();
    items.push({
      id: 'game-of-the-day',
      type: 'game_of_the_day',
      icon: 'sparkles',
      title: "Today's game",
      subtitle: `${gotd.label} — play for +${gotd.bonusAura} Aura bonus`,
      color: colors.reward.gold,
      bg: colors.reward.peachLight,
      onPress: () => (navigation as any).navigate(gotd.gameKey),
    });

    if (user?.currentStreak && user.currentStreak > 0) {
      items.push({
        id: 'streak',
        type: 'streak',
        icon: 'flame',
        title: `${user.currentStreak}-day streak!`,
        subtitle: 'Keep checking in to grow your streak',
        color: colors.status.streak,
        bg: colors.status.streakBg,
        onPress: () => navigation.navigate('Home'),
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
        onPress: () => navigation.navigate('Badges'),
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
        onPress: () => navigation.navigate('Stamps'),
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
        onPress: () => navigation.navigate('Bites'),
      });
    }

    return items.slice(0, 10);
  }, [user?.currentStreak, stamps, bites, badges, incomingRequests.length, showMissionPrompt, dailyMission, navigation]);

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
                  <TouchableOpacity
                    style={[styles.activityCard, { backgroundColor: item.bg }]}
                    onPress={item.onPress}
                    activeOpacity={item.onPress ? 0.7 : 1}
                    disabled={!item.onPress}
                  >
                    <View style={[styles.activityIconWrap, { backgroundColor: item.color + '20' }]}>
                      <Icon name={item.icon} size={22} color={item.color} />
                    </View>
                    <View style={styles.activityText}>
                      <Text variant="body" style={styles.activityTitle}>{item.title}</Text>
                      <Caption numberOfLines={1}>{item.subtitle}</Caption>
                    </View>
                    {item.onPress && <Icon name="chevronRight" size={18} color={item.color} />}
                  </TouchableOpacity>
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
