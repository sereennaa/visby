import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
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
    username?: string; email?: string; password?: string; confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState('');

  const { setUser, setVisby } = useStore();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    else if (username.length > LIMITS.MAX_USERNAME_LENGTH) newErrors.username = `Username must be ${LIMITS.MAX_USERNAME_LENGTH} characters or less`;
    else if (!/^[a-zA-Z0-9_]+$/.test(username)) newErrors.username = 'Letters, numbers, and underscores only';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    setFormError('');
    try {
      const { user, visby } = await authService.signUp(email, password, username);
      if (user) setUser(user);
      if (visby) setVisby(visby);
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } catch (error: any) {
      setFormError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FDFBF8', '#E6F2FC', '#FDFBF8']}
      style={styles.container}
      locations={[0, 0.5, 1]}
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="back" size={20} color={colors.text.secondary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Icon name="rocket" size={30} color={colors.text.primary} />
              </View>
              <Text style={styles.title}>Join the adventure!</Text>
              <Text style={styles.subtitle}>Create your explorer profile</Text>
            </View>

            <View style={styles.formCard}>
              <Input
                label="USERNAME"
                placeholder="Your explorer name"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username}
                hint="This will be visible to other explorers"
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

              {formError ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

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

              <Text style={styles.terms}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  backText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.calm.skyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 30,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    fontFamily: 'Nunito-Medium',
    fontSize: 15,
    color: colors.text.secondary,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: spacing.radius.xxl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 3,
  },
  errorBanner: {
    backgroundColor: colors.status.errorLight,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 13,
    color: colors.status.error,
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  terms: {
    fontFamily: 'Nunito-Medium',
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    lineHeight: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  switchText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 15,
    color: colors.text.secondary,
  },
  switchLink: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: colors.primary.wisteriaDark,
  },
});

export default SignUpScreen;
