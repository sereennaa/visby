import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
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
import { useStore } from '../../store/useStore';
import { authService } from '../../services/auth';
import { setupNotifications } from '../../services/notifications';
import { RootStackParamList } from '../../types';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { user, logout, settings, updateSettings } = useStore();
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [comingSoonBanner, setComingSoonBanner] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await authService.signOut();
    } catch {
      // proceed even if remote sign-out fails
    }
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const renderRow = (
    icon: IconName,
    label: string,
    onPress: () => void,
    options?: { danger?: boolean; toggle?: boolean; toggleValue?: boolean },
  ) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.rowIconContainer, options?.danger && styles.rowIconDanger]}>
        <Icon
          name={icon}
          size={20}
          color={options?.danger ? colors.status.error : colors.primary.wisteriaDark}
        />
      </View>
      <Text
        variant="body"
        style={options?.danger ? { ...styles.rowLabel, ...styles.dangerText } : styles.rowLabel}
      >
        {label}
      </Text>
      {options?.toggle ? (
        <View
          style={[
            styles.toggle,
            options.toggleValue ? styles.toggleOn : styles.toggleOff,
          ]}
        >
          <View
            style={[
              styles.toggleKnob,
              options.toggleValue ? styles.toggleKnobOn : styles.toggleKnobOff,
            ]}
          />
        </View>
      ) : (
        <Icon name="chevronRight" size={18} color={colors.text.light} />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Settings</Heading>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {comingSoonBanner && (
            <Card style={styles.comingSoonBanner}>
              <View style={styles.bannerContent}>
                <Icon name="info" size={16} color={colors.primary.wisteriaDark} />
                <Text variant="bodySmall" color={colors.primary.wisteriaDark} style={styles.bannerText}>
                  Password change will be available in a future update.
                </Text>
                <TouchableOpacity onPress={() => setComingSoonBanner(false)}>
                  <Icon name="close" size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Account */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            Account
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('person', 'Edit Profile', () => navigation.navigate('EditProfile'))}
            <View style={styles.separator} />
            {renderRow('lock', 'Change Password', () => setComingSoonBanner(true))}
          </Card>

          {/* Preferences */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            Preferences
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('notification', 'Notifications', async () => {
              const next = !((settings as { notifications?: boolean }).notifications ?? true);
              updateSettings({ notifications: next });
              await setupNotifications(next, user?.currentStreak ?? 0);
            }, {
              toggle: true,
              toggleValue: (settings as { notifications?: boolean }).notifications ?? true,
            })}
            <View style={styles.separator} />
            {renderRow('location', 'Location Tracking', () => updateSettings({ locationTracking: !settings.locationTracking }), {
              toggle: true,
              toggleValue: settings.locationTracking,
            })}
            <View style={styles.separator} />
            {renderRow('eye', 'Private Profile', () => updateSettings({ privateProfile: !settings.privateProfile }), {
              toggle: true,
              toggleValue: settings.privateProfile,
            })}
            {renderRow('volumeHigh', 'Sound effects', () => updateSettings({ soundEffects: !((settings as { soundEffects?: boolean }).soundEffects ?? true) }), {
              toggle: true,
              toggleValue: (settings as { soundEffects?: boolean }).soundEffects ?? true,
            })}
          </Card>

          {/* Play time & focus */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            Play time & focus
          </Text>
          <Card style={styles.sectionCard}>
            <View style={styles.sessionTimerRow}>
              <View style={styles.rowIconContainer}>
                <Icon name="time" size={20} color={colors.primary.wisteriaDark} />
              </View>
              <Text variant="body" style={styles.rowLabel}>Session timer</Text>
              <View style={styles.sessionTimerOptions}>
                {([0, 10, 15, 20] as const).map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    style={[
                      styles.sessionTimerBtn,
                      (settings as { sessionTimerMinutes?: number }).sessionTimerMinutes === mins && styles.sessionTimerBtnActive,
                    ]}
                    onPress={() => updateSettings({ sessionTimerMinutes: mins })}
                  >
                    <Text variant="bodySmall" style={(settings as { sessionTimerMinutes?: number }).sessionTimerMinutes === mins ? styles.sessionTimerBtnTextActive : styles.sessionTimerBtnText}>
                      {mins === 0 ? 'Off' : `${mins}m`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.separator} />
            {renderRow('compass', 'Focus mode', () => updateSettings({ focusMode: !((settings as { focusMode?: boolean }).focusMode ?? false) }), {
              toggle: true,
              toggleValue: (settings as { focusMode?: boolean }).focusMode ?? false,
            })}
            <Caption style={styles.settingHint}>Show only today&apos;s adventure on Home</Caption>
            <View style={styles.separator} />
            {renderRow('sparkles', 'Quieter mode', () => updateSettings({ quieterMode: !((settings as { quieterMode?: boolean }).quieterMode ?? false) }), {
              toggle: true,
              toggleValue: (settings as { quieterMode?: boolean }).quieterMode ?? false,
            })}
            <Caption style={styles.settingHint}>Fewer effects, calmer experience</Caption>
            <View style={styles.separator} />
            {renderRow('volumeHigh', 'Ambient sound', () => updateSettings({ ambientSound: !((settings as { ambientSound?: boolean }).ambientSound ?? false) }), {
              toggle: true,
              toggleValue: (settings as { ambientSound?: boolean }).ambientSound ?? false,
            })}
            <Caption style={styles.settingHint}>Calm background in home and country rooms</Caption>
          </Card>

          {/* Parent */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            Family
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('lock', 'Parent dashboard', () => navigation.navigate('ParentDashboard'))}
            <Caption style={[styles.settingHint, { marginLeft: spacing.lg + 36 + spacing.md }]}>Read-only: today&apos;s activity, streak, level. No chat.</Caption>
          </Card>

          {/* About */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            About
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('help', 'Help & Support', () =>
              setInfoModal({ title: 'Help & Support', message: 'For questions or issues, email support@visby.app.' }),
            )}
            <View style={styles.separator} />
            {renderRow('mailSend', 'Send feedback', async () => {
              const url = 'mailto:feedback@visby.app?subject=Visby%20App%20Feedback';
              try {
                const can = await Linking.canOpenURL(url);
                if (can) await Linking.openURL(url);
                else setInfoModal({ title: 'Send feedback', message: 'Email us at feedback@visby.app — we\'d love to hear from you!' });
              } catch {
                setInfoModal({ title: 'Send feedback', message: 'Email us at feedback@visby.app — we\'d love to hear from you!' });
              }
            })}
            <View style={styles.separator} />
            {renderRow('info', 'About Visby', () =>
              setInfoModal({ title: 'Visby', message: 'Version 1.0.1\n\n4 tabs: Home, Explore, Inbox, Profile.' }),
            )}
          </Card>

          {/* Danger Zone */}
          <Text variant="h3" color={colors.status.error} style={styles.sectionLabel}>
            Danger Zone
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('logout', 'Log Out', handleLogout, { danger: true })}
          </Card>
        </ScrollView>

        {/* Info Modal */}
        <Modal visible={!!infoModal} transparent animationType="fade">
          <Pressable style={styles.overlay} onPress={() => setInfoModal(null)}>
            <Pressable style={styles.modalCard}>
              <Text variant="h2" style={styles.modalTitle}>{infoModal?.title}</Text>
              <Text variant="body" color={colors.text.secondary} style={styles.modalMessage}>
                {infoModal?.message}
              </Text>
              <Button title="OK" onPress={() => setInfoModal(null)} variant="primary" size="md" fullWidth />
            </Pressable>
          </Pressable>
        </Modal>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.warmWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    paddingVertical: spacing.xs,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowIconDanger: {
    backgroundColor: colors.status.errorLight,
  },
  rowLabel: {
    flex: 1,
  },
  dangerText: {
    color: colors.status.error,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.base.parchment,
    marginLeft: spacing.lg + 36 + spacing.md,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: colors.success.emerald,
  },
  toggleOff: {
    backgroundColor: colors.text.light,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.base.cream,
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  toggleKnobOff: {
    alignSelf: 'flex-start',
  },
  comingSoonBanner: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bannerText: {
    flex: 1,
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
  sessionTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sessionTimerOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionTimerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.base.parchment,
  },
  sessionTimerBtnActive: {
    backgroundColor: colors.primary.wisteriaDark,
  },
  sessionTimerBtnText: {
    color: colors.text.secondary,
  },
  sessionTimerBtnTextActive: {
    color: colors.base.cream,
  },
  settingHint: {
    marginTop: -spacing.xs,
    marginBottom: spacing.xs,
    marginLeft: spacing.lg + 36 + spacing.md,
    color: colors.text.muted,
  },
});

export default SettingsScreen;
