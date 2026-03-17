import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type AddFriendScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddFriend'>;
};

export const AddFriendScreen: React.FC<AddFriendScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const user = useStore(s => s.user);
  const friends = useStore(s => s.friends);
  const sendFriendRequest = useStore(s => s.sendFriendRequest);

  const handleSend = () => {
    setMessage(null);
    const result = sendFriendRequest(username);
    if (result.success) {
      setMessage({ type: 'success', text: `Friend request sent to ${username.trim()}! They can accept in Friends.` });
      setUsername('');
    } else {
      setMessage({ type: 'error', text: result.error || 'Could not send request' });
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
          <Heading level={3} style={styles.headerTitle}>Add friend</Heading>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Caption style={styles.hint}>Enter their Visby username. They'll get a friend request and can accept in Friends.</Caption>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={colors.text.muted}
            value={username}
            onChangeText={(t) => { setUsername(t); setMessage(null); }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {message && (
            <View style={[styles.messageWrap, message.type === 'error' ? styles.messageError : styles.messageSuccess]}>
              <Icon name={message.type === 'error' ? 'close' : 'check'} size={18} color={message.type === 'error' ? colors.status.error : colors.success.emerald} />
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          )}
          <Button title="Send request" onPress={handleSend} variant="primary" size="lg" fullWidth disabled={!username.trim()} />
        </KeyboardAvoidingView>
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
  headerSpacer: { width: 40 },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
  },
  hint: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.base.cream,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary.wisteriaLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  messageWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  messageSuccess: { backgroundColor: colors.success.honeydew + '80' },
  messageError: { backgroundColor: colors.status.error + '15' },
  messageText: { fontFamily: 'Nunito-Medium', fontSize: 14, flex: 1 },
});

export default AddFriendScreen;
