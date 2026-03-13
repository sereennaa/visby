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

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');

  const { setUser, setVisby } = useStore();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setFormError('');
    try {
      const result = await authService.signIn(email, password);
      const authUser = result.user;
      if (authUser) {
        const [profile, visby] = await Promise.all([
          authService.getUserProfile(authUser.id),
          authService.getVisby(authUser.id),
        ]);
        if (!profile) throw new Error('Could not load your profile. Please try again.');
        setUser(profile);
        if (visby) setVisby(visby);
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    } catch (error: any) {
      setFormError(error.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FDFBF8', '#F0ECF9', '#FDFBF8']}
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
                <Icon name="hand" size={30} color={colors.text.primary} />
              </View>
              <Text style={styles.title}>Welcome back!</Text>
              <Text style={styles.subtitle}>Continue your adventure</Text>
            </View>

            <View style={styles.formCard}>
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
                placeholder="Your secret password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon="lock"
                rightIcon={showPassword ? 'eye' : 'eyeOff'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {formError ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

              <Button
                title="Log In"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                variant="primary"
                size="lg"
                fullWidth
                style={styles.loginButton}
              />
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.switchText}>New to Visby? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.switchLink}>Create account</Text>
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
    marginBottom: spacing.xxl,
    gap: spacing.xs,
  },
  backText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 32,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.primary.wisteriaDark,
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
  loginButton: {
    marginTop: spacing.xs,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
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

export default LoginScreen;
