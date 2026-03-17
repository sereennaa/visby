import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { copy } from '../../config/copy';
import { showToast } from '../../store/useToast';
import { RootStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const user = useStore(s => s.user);
  const setUser = useStore(s => s.setUser);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const handleSave = () => {
    if (!displayName.trim() || !username.trim()) {
      setMessage({ text: 'Name and username cannot be empty.', type: 'error' });
      return;
    }
    if (user) {
      setUser({ ...user, displayName: displayName.trim(), username: username.trim() });
    }
    setMessage({ text: 'Your profile has been updated!', type: 'success' });
    showToast(copy.success.profileSaved, 'success');
    timersRef.current.push(setTimeout(() => navigation.goBack(), 1500));
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
    >
      <FloatingParticles count={4} variant="dust" opacity={0.12} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Button title="" onPress={() => navigation.goBack()} variant="ghost" size="sm"
            icon={<Icon name="chevronLeft" size={24} color={colors.text.primary} />}
          />
          <Heading level={2}>Edit Profile</Heading>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {message && (
            <View style={[styles.banner, message.type === 'error' ? styles.bannerError : styles.bannerSuccess]}>
              <Icon
                name={message.type === 'error' ? 'close' : 'checkCircle'}
                size={16}
                color={message.type === 'error' ? colors.status.error : colors.success.emerald}
              />
              <Text
                variant="bodySmall"
                color={message.type === 'error' ? colors.status.error : colors.success.emerald}
                style={styles.bannerText}
              >
                {message.text}
              </Text>
            </View>
          )}
          <Card style={styles.card}>
            <Input
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
            />
            <View style={styles.spacer} />
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="username"
            />
          </Card>
          <Button
            title="Save Changes"
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
          />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  card: { marginBottom: spacing.xl },
  spacer: { height: spacing.md },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: spacing.radius.lg,
    marginBottom: spacing.md,
  },
  bannerError: {
    backgroundColor: colors.status.errorLight,
  },
  bannerSuccess: {
    backgroundColor: colors.success.honeydew,
  },
  bannerText: {
    flex: 1,
  },
});

export default EditProfileScreen;
