import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import { LevelBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { copy } from '../../config/copy';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type FriendsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Friends'>;
};

export const FriendsScreen: React.FC<FriendsScreenProps> = ({ navigation }) => {
  const { user, friends, friendRequests, acceptFriendRequest, rejectFriendRequest, getWeeklyAura } = useStore();
  const incoming = friendRequests.filter((r) => r.toUserId === user?.id && r.status === 'pending');
  const weeklyAura = getWeeklyAura();
  const leaderboardEntries = [
    ...(user ? [{ type: 'you' as const, displayName: user.displayName, username: user.username, level: user.level }] : []),
    ...friends.map((f) => ({ type: 'friend' as const, displayName: f.displayName, username: f.username, level: f.level ?? 0 })),
  ].sort((a, b) => (b.level ?? 0) - (a.level ?? 0));

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={StyleSheet.absoluteFill} />
      <FloatingParticles count={4} variant="sparkle" opacity={0.12} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={3} style={styles.headerTitle}>Friends</Heading>
          <TouchableOpacity onPress={() => navigation.navigate('AddFriend')} style={styles.addBtn}>
            <Icon name="add" size={24} color={colors.primary.wisteriaDark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Leaderboard */}
          <Card style={styles.leaderboardCard}>
            <View style={styles.leaderboardHeader}>
              <Icon name="trophy" size={22} color={colors.reward.gold} />
              <Text style={styles.leaderboardTitle}>Leaderboard</Text>
            </View>
            <View style={styles.weeklyRow}>
              <Caption>This week</Caption>
              <Text variant="h3" color={colors.reward.gold}>{weeklyAura} Aura</Text>
            </View>
            <Caption style={styles.byLevelLabel}>By level</Caption>
            {leaderboardEntries.slice(0, 10).map((entry, index) => (
              <View key={entry.type === 'you' ? 'you' : entry.username} style={styles.leaderboardRow}>
                <Text style={styles.rankText}>#{index + 1}</Text>
                <View style={styles.leaderboardEntry}>
                  <Text variant="body" style={entry.type === 'you' ? styles.youLabel : undefined}>
                    {entry.displayName}{entry.type === 'you' ? ' (you)' : ''}
                  </Text>
                  <LevelBadge level={entry.level ?? 1} />
                </View>
              </View>
            ))}
          </Card>

          {/* Incoming requests */}
          {incoming.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Friend requests</Text>
              {incoming.map((req) => (
                <Card key={req.id} style={styles.requestCard}>
                  <View style={styles.requestRow}>
                    <View style={styles.requestAvatar}>
                      <Icon name="person" size={28} color={colors.primary.wisteriaDark} />
                    </View>
                    <View style={styles.requestInfo}>
                      <Text variant="h3">{req.fromDisplayName}</Text>
                      <Caption>@{req.fromUsername} wants to be friends</Caption>
                    </View>
                    <View style={styles.requestActions}>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptFriendRequest(req.id)}>
                        <Icon name="check" size={20} color="#FFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectFriendRequest(req.id)}>
                        <Icon name="close" size={20} color={colors.text.secondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Friends list */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your friends ({friends.length})</Text>
            {friends.length === 0 ? (
              <Card style={styles.emptyCard}>
                <EmptyState
                  icon="people"
                  title={copy.empty.noFriends.title}
                  subtitle={copy.empty.noFriends.subtitle}
                  actionLabel={copy.actions.addFriend}
                  onAction={() => navigation.navigate('AddFriend')}
                />
              </Card>
            ) : (
              friends.map((friend) => (
                <TouchableOpacity
                  key={friend.userId}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('FriendProfile', { friendUserId: friend.userId })}
                >
                  <Card style={styles.friendCard}>
                    <View style={styles.friendRow}>
                      <View style={styles.friendAvatar}>
                        <Icon name="person" size={28} color={colors.primary.wisteriaDark} />
                      </View>
                      <View style={styles.friendInfo}>
                        <Text variant="h3">{friend.displayName}</Text>
                        <Caption>@{friend.username}</Caption>
                        {friend.level != null && (
                          <View style={styles.friendMeta}>
                            <LevelBadge level={friend.level} />
                            {friend.badgesCount != null && (
                              <Text variant="caption" color={colors.text.muted}> · {friend.badgesCount} badges</Text>
                            )}
                          </View>
                        )}
                      </View>
                      <Icon name="chevronRight" size={22} color={colors.text.muted} />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: { flex: 1, textAlign: 'center' },
  addBtn: { padding: spacing.xs },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxl * 2 },
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderboardCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  leaderboardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  leaderboardTitle: { fontFamily: 'Nunito-SemiBold', fontSize: 18, color: colors.text.primary },
  weeklyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  byLevelLabel: { marginBottom: spacing.xs, color: colors.text.muted },
  leaderboardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, gap: spacing.sm },
  rankText: { fontFamily: 'Nunito-SemiBold', width: 28, color: colors.text.muted },
  leaderboardEntry: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  youLabel: { fontFamily: 'Nunito-SemiBold', color: colors.primary.wisteriaDark },
  requestCard: { marginBottom: spacing.sm },
  requestRow: { flexDirection: 'row', alignItems: 'center' },
  requestAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  requestInfo: { flex: 1 },
  requestActions: { flexDirection: 'row', gap: spacing.sm },
  acceptBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.cardWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: { marginTop: spacing.sm },
  emptySub: { textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.lg },
  friendCard: { marginBottom: spacing.sm },
  friendRow: { flexDirection: 'row', alignItems: 'center' },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  friendInfo: { flex: 1 },
  friendMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
});

export default FriendsScreen;
