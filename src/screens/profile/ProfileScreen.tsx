import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LevelBadge, AuraBadge } from '../../components/ui/Badge';
import { LevelProgress } from '../../components/ui/ProgressBar';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { useStore, DEFAULT_SKILLS } from '../../store/useStore';
import { authService } from '../../services/auth';
import { LEVEL_THRESHOLDS } from '../../config/constants';
import { RootStackParamList } from '../../types';
import { RadarChart } from '../../components/ui/RadarChart';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, visby, stamps, bites, badges, logout } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await authService.signOut();
      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      if (__DEV__) console.error('Logout error:', error);
    }
  };

  const getCurrentLevel = () => {
    const aura = user?.aura || 0;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (aura >= LEVEL_THRESHOLDS[i].aura) {
        return LEVEL_THRESHOLDS[i];
      }
    }
    return LEVEL_THRESHOLDS[0];
  };

  const getNextLevel = () => {
    const level = user?.level || 1;
    return LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)];
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const currentAura = user?.aura || 0;
  const progressAura = currentAura - currentLevel.aura;
  const requiredAura = Math.max(1, nextLevel.aura - currentLevel.aura);

  const defaultAppearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const statItems: { icon: IconName; label: string; value: number }[] = [
    { icon: 'stamp', label: 'Stamps', value: stamps.length },
    { icon: 'food', label: 'Bites', value: bites.length },
    { icon: 'trophy', label: 'Badges', value: badges.length },
    { icon: 'globe', label: 'Countries', value: user?.countriesVisited || 0 },
    { icon: 'city', label: 'Cities', value: user?.citiesVisited || 0 },
    { icon: 'flame', label: 'Best Streak', value: user?.longestStreak || 0 },
  ];

  const skills = user?.skills || DEFAULT_SKILLS;

  const menuItems: { icon: IconName; label: string; screen: keyof RootStackParamList }[] = [
    { icon: 'person', label: 'Edit Profile', screen: 'EditProfile' },
    { icon: 'shirt', label: 'Wardrobe & Avatar', screen: 'Avatar' },
    { icon: 'sparkles', label: 'Cosmetic Shop', screen: 'CosmeticShop' },
    { icon: 'trophy', label: 'Membership', screen: 'Membership' },
    { icon: 'settings', label: 'Settings', screen: 'Settings' },
  ];

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
    >
      <FloatingParticles count={5} variant="sparkle" opacity={0.2} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Heading level={1}>Profile</Heading>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <Card
            variant="gradient"
            gradientColors={[colors.primary.wisteriaFaded, colors.base.cream]}
            style={styles.profileCard}
          >
            <View style={styles.profileTop}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Avatar')}
                style={styles.avatarContainer}
              >
                <VisbyCharacter
                  appearance={defaultAppearance}
                  equipped={visby?.equipped}
                  mood="happy"
                  size={100}
                  animated={true}
                />
                <View style={styles.editBadge}>
                  <Icon name="edit" size={14} color={colors.text.secondary} />
                </View>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text variant="h2">{user?.displayName || user?.username}</Text>
                  <LevelBadge level={user?.level || 1} />
                </View>
                <Text variant="body" color={colors.text.secondary}>
                  @{user?.username}
                </Text>
                <Text variant="caption" color={colors.text.muted}>
                  {currentLevel.title}
                </Text>
              </View>
            </View>

            <View style={styles.auraRow}>
              <AuraBadge amount={currentAura} />
              <Text variant="caption" color={colors.text.secondary}>
                Total earned: {user?.totalAuraEarned?.toLocaleString() || 0}
              </Text>
            </View>

            <LevelProgress
              currentXP={progressAura}
              requiredXP={requiredAura}
              level={user?.level || 1}
            />
          </Card>

          {/* Stats Grid */}
          {(stamps.length + bites.length + badges.length) > 0 ? (
            <View style={styles.statsGrid}>
              {statItems.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                  <Icon name={stat.icon} size={20} color={colors.primary.wisteriaDark} />
                  <Text variant="h2" align="center">
                    {stat.value}
                  </Text>
                  <Caption align="center">{stat.label}</Caption>
                </Card>
              ))}
            </View>
          ) : (
            <Card style={styles.welcomeCard}>
              <View style={styles.welcomeContent}>
                <Icon name="rocket" size={40} color={colors.primary.wisteriaDark} />
                <Text variant="h3" align="center">Your Adventure Begins</Text>
                <Caption align="center">Start exploring, collecting stamps, and learning to fill up your stats!</Caption>
              </View>
            </Card>
          )}

          {/* Streak Info */}
          {user?.currentStreak !== undefined && user.currentStreak > 0 && (
            <Card style={styles.streakCard}>
              <View style={styles.streakContent}>
                <Icon name="flame" size={32} color={colors.reward.coral} />
                <View style={styles.streakInfo}>
                  <Text variant="h3">
                    {user.currentStreak} Day Streak!
                  </Text>
                  <Caption>
                    Keep exploring to maintain your streak
                  </Caption>
                </View>
              </View>
            </Card>
          )}

          {/* Skills Radar */}
          <Card style={styles.skillsCard}>
            <View style={styles.sectionHeader}>
              <Heading level={2}>Skills</Heading>
              <Caption>Grow by learning and exploring</Caption>
            </View>
            <RadarChart
              data={[
                { label: 'Language', value: skills.language },
                { label: 'Geography', value: skills.geography },
                { label: 'Culture', value: skills.culture },
                { label: 'History', value: skills.history },
                { label: 'Cooking', value: skills.cooking },
                { label: 'Exploration', value: skills.exploration },
              ]}
              size={220}
            />
          </Card>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen as never)}
              >
                <Icon name={item.icon} size={20} color={colors.text.secondary} />
                <Text variant="body" style={styles.menuLabel}>
                  {item.label}
                </Text>
                <Icon name="chevronRight" size={16} color={colors.text.muted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="ghost"
            size="md"
            fullWidth
            style={styles.logoutButton}
          />

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text variant="caption" align="center" color={colors.text.muted}>
              Visby v1.0.0
            </Text>
            <View style={styles.madeWithRow}>
              <Text variant="caption" color={colors.text.muted}>Made with </Text>
              <Icon name="heart" size={12} color={colors.primary.wisteria} />
              <Text variant="caption" color={colors.text.muted}> for explorers</Text>
            </View>
          </View>
        </ScrollView>

        {/* Logout Confirmation Modal */}
        <Modal visible={showLogoutConfirm} transparent animationType="fade">
          <Pressable style={styles.overlay} onPress={() => setShowLogoutConfirm(false)}>
            <Pressable style={styles.modalCard}>
              <Text variant="h2" style={styles.modalTitle}>Log Out</Text>
              <Text variant="body" color={colors.text.secondary} style={styles.modalMessage}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setShowLogoutConfirm(false)}
                  variant="ghost"
                  size="md"
                  style={styles.modalActionButton}
                />
                <Button
                  title="Log Out"
                  onPress={confirmLogout}
                  variant="primary"
                  size="md"
                  style={styles.modalActionButton}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: -5,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
    padding: spacing.xxs,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxs,
  },
  auraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  welcomeCard: { marginBottom: spacing.lg },
  welcomeContent: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  streakCard: {
    marginBottom: spacing.lg,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakInfo: {
    flex: 1,
  },
  skillsCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  menuSection: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.base.parchment,
    gap: spacing.md,
  },
  menuLabel: {
    flex: 1,
  },
  logoutButton: {
    marginBottom: spacing.lg,
  },
  appInfo: {
    marginTop: spacing.md,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  madeWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    width: '85%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    marginBottom: spacing.sm,
  },
  modalMessage: {
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalActionButton: {
    flex: 1,
  },
});

export default ProfileScreen;
