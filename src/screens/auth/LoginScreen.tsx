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

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { setUser, setVisby } = useStore();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const { user: authUser } = await authService.signIn(email, password);
      
      if (authUser) {
        // Get user profile and visby
        const profile = await authService.getUserProfile(authUser.id);
        const visby = await authService.getVisby(authUser.id);
        
        if (profile) {
          setUser(profile);
        }
        if (visby) {
          setVisby(visby);
        }
        
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
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
              <Icon name="hand" size={48} color={colors.primary.wisteriaDark} />
              <Text variant="displayTitle" style={styles.title}>
                Welcome back!
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                Continue your adventure
              </Text>
            </View>

            {/* Login Form */}
            <Card variant="elevated" style={styles.formCard}>
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

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPassword}
              >
                <Text variant="bodySmall" color={colors.primary.wisteriaDark}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

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
            </Card>

            {/* Sign up link */}
            <View style={styles.signUpContainer}>
              <Text variant="body" color={colors.text.secondary}>
                New to Visby?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text variant="body" color={colors.primary.wisteriaDark}>
                  Create account
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
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  backText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
});

export default LoginScreen;
