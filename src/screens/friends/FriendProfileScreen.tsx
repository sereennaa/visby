import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { LevelBadge, AuraBadge } from '../../components/ui/Badge';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { COUNTRIES } from '../../config/constants';
import { RootStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type FriendProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FriendProfile'>;
  route: { params: { friendUserId: string } };
};

export const FriendProfileScreen: React.FC<FriendProfileScreenProps> = ({ navigation, route }) => {
  const { friendUserId } = route.params;
  const { friends, removeFriend } = useStore();
  const friend = friends.find((f) => f.userId === friendUserId);

  if (!friend) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text>Friend not found.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const houseCountryIds = friend.houseCountryIds ?? [];
  const firstCountry = houseCountryIds.length > 0 ? COUNTRIES.find((c) => c.id === houseCountryIds[0]) : null;

  const handleVisitHouse = () => {
    if (firstCountry) {
      (navigation.getParent() as any)?.navigate('Explore', { screen: 'CountryRoom', params: { countryId: firstCountry.id, friendUserId: friend.userId } });
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={StyleSheet.absoluteFill} />
      <FloatingParticles count={4} variant="sparkle" opacity={0.12} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={3} style={styles.headerTitle}>Profile</Heading>
          <TouchableOpacity onPress={() => { removeFriend(friend.userId); navigation.goBack(); }} style={styles.removeBtn}>
            <Icon name="remove" size={22} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Card variant="gradient" gradientColors={[colors.primary.wisteriaFaded, colors.base.cream]} style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <VisbyCharacter
                appearance={{
                  skinTone: colors.visby.skin.light,
                  hairColor: colors.visby.hair.brown,
                  hairStyle: 'default',
                  eyeColor: '#4A90D9',
                  eyeShape: 'round',
                }}
                equipped={{}}
                mood="happy"
                size={100}
                animated
              />
            </View>
            <View style={styles.nameRow}>
              <Text variant="h2">{friend.displayName}</Text>
              <LevelBadge level={friend.level ?? 1} />
            </View>
            <Caption>@{friend.username}</Caption>
            <View style={styles.statsRow}>
              <AuraBadge amount={friend.aura ?? 0} />
              {friend.badgesCount != null && (
                <View style={styles.badgeCount}>
                  <Icon name="trophy" size={18} color={colors.reward.gold} />
                  <Text variant="body">{friend.badgesCount} badges</Text>
                </View>
              )}
            </View>
          </Card>

          {houseCountryIds.length > 0 && (
            <Card style={styles.visitCard}>
              <Text variant="h3" style={styles.visitTitle}>Visit their house</Text>
              <Caption style={styles.visitSub}>See their Visby's home in the world</Caption>
              <Button title={firstCountry ? `Visit ${firstCountry.name}` : 'Visit house'} onPress={handleVisitHouse} variant="primary" style={{ marginTop: spacing.md }} />
            </Card>
          )}

          <TouchableOpacity style={styles.removeFriendLink} onPress={() => { removeFriend(friend.userId); navigation.goBack(); }}>
            <Text style={styles.removeFriendText}>Remove friend</Text>
          </TouchableOpacity>
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
  removeBtn: { padding: spacing.xs },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxl * 2 },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarWrap: { marginBottom: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.sm },
  badgeCount: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  visitCard: { marginBottom: spacing.lg },
  visitTitle: {},
  visitSub: { marginTop: 4 },
  removeFriendLink: { alignSelf: 'center', paddingVertical: spacing.md },
  removeFriendText: { fontFamily: 'Nunito-Medium', fontSize: 14, color: colors.text.muted },
});

export default FriendProfileScreen;
