import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { authService } from '../../services/auth';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { LIMITS } from '../../config/constants';

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { setUser, setVisby } = useStore();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (username.length > LIMITS.MAX_USERNAME_LENGTH) {
      newErrors.username = `Username must be ${LIMITS.MAX_USERNAME_LENGTH} characters or less`;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { user, visby } = await authService.signUp(email, password, username);

      if (user) setUser(user);
      if (visby) setVisby(visby);

      Alert.alert(
        'Welcome to Visby! ✨',
        `Your explorer ${username} is ready for adventure!`,
        [{
          text: "Let's Go!",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          },
        }],
      );
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.calm.skyLight, colors.base.cream]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="back" size={20} color={colors.text.secondary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Icon name="rocket" size={48} color={colors.calm.ocean} />
              <Text variant="displayTitle" style={styles.title}>
                Join the adventure!
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                Create your explorer profile
              </Text>
            </View>

            {/* Sign Up Form */}
            <Card variant="elevated" style={styles.formCard}>
              <Input
                label="USERNAME"
                placeholder="Your explorer name"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username}
                hint={`This will be visible to other explorers`}
                leftIcon="tag"
              />

              <Input
                label="EMAIL"
                placeholder="explorer@visby.app"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                leftIcon="mail"
              />

              <Input
                label="PASSWORD"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
                hint="At least 6 characters"
                leftIcon="lock"
                rightIcon={showPassword ? 'eye' : 'eyeOff'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <Input
                label="CONFIRM PASSWORD"
                placeholder="Type your password again"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                error={errors.confirmPassword}
                leftIcon="lock"
              />

              <Button
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                disabled={loading}
                variant="primary"
                size="lg"
                fullWidth
                style={styles.signUpButton}
              />

              <Text variant="caption" align="center" style={styles.terms}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </Card>

            {/* Login link */}
            <View style={styles.loginContainer}>
              <Text variant="body" color={colors.text.secondary}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text variant="body" color={colors.primary.wisteriaDark}>
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  backText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  formCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  signUpButton: {
    marginTop: spacing.lg,
  },
  terms: {
    marginTop: spacing.lg,
    color: colors.text.muted,
    paddingHorizontal: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});

export default SignUpScreen;
