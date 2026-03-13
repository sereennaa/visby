import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/auth';
import { RootStackParamList } from '../../types';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { user, logout } = useStore();

  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [locationTracking, setLocationTracking] = useState(user?.settings?.locationTracking ?? true);
  const [privateProfile, setPrivateProfile] = useState(user?.settings?.privateProfile ?? false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.signOut();
          } catch {
            // proceed even if remote sign-out fails
          }
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
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
        style={[styles.rowLabel, options?.danger && styles.dangerText]}
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
          {/* Account */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            Account
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('person', 'Edit Profile', () => navigation.navigate('EditProfile'))}
            <View style={styles.separator} />
            {renderRow('lock', 'Change Password', () =>
              Alert.alert('Coming Soon', 'Password change will be available in a future update.'),
            )}
          </Card>

          {/* Preferences */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            Preferences
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('notification', 'Notifications', () => setNotifications((v) => !v), {
              toggle: true,
              toggleValue: notifications,
            })}
            <View style={styles.separator} />
            {renderRow('location', 'Location Tracking', () => setLocationTracking((v) => !v), {
              toggle: true,
              toggleValue: locationTracking,
            })}
            <View style={styles.separator} />
            {renderRow('eye', 'Private Profile', () => setPrivateProfile((v) => !v), {
              toggle: true,
              toggleValue: privateProfile,
            })}
          </Card>

          {/* About */}
          <Text variant="h3" color={colors.text.secondary} style={styles.sectionLabel}>
            About
          </Text>
          <Card style={styles.sectionCard}>
            {renderRow('help', 'Help & Support', () =>
              Alert.alert('Help & Support', 'For questions or issues, email support@visby.app.'),
            )}
            <View style={styles.separator} />
            {renderRow('info', 'About Visby', () =>
              Alert.alert('Visby', 'Version 1.0.0\n\nExplore the world, one stamp at a time.'),
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
});

export default SettingsScreen;
