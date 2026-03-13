import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
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
import { RootStackParamList } from '../../types';

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.resetPassword(email);
      setSent(true);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to send reset email. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <LinearGradient
        colors={[colors.success.honeydew, colors.base.cream]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successContainer}>
            <Icon name="mailOpen" size={64} color={colors.success.emerald} />
            <Text variant="displayTitle" align="center" style={styles.successTitle}>
              Check your inbox!
            </Text>
            <Text variant="body" align="center" color={colors.text.secondary}>
              We've sent a password reset link to
            </Text>
            <Text variant="body" align="center" color={colors.primary.wisteriaDark}>
              {email}
            </Text>
            <Card variant="default" style={styles.tipCard}>
              <View style={styles.tipContent}>
                <Icon name="info" size={16} color={colors.text.secondary} />
                <Text variant="bodySmall" color={colors.text.secondary} style={styles.tipText}>
                  Check your spam folder if you don't see the email within a few minutes.
                </Text>
              </View>
            </Card>
            <Button
              title="Back to Login"
              onPress={() => navigation.navigate('Login')}
              variant="primary"
              size="lg"
              fullWidth
              style={styles.backButton}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.calm.skyLight]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Back button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backNav}
            >
              <Icon name="back" size={20} color={colors.text.secondary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Icon name="key" size={48} color={colors.primary.wisteriaDark} />
              <Text variant="displayTitle" style={styles.title}>
                Forgot password?
              </Text>
              <Text variant="body" align="center" color={colors.text.secondary}>
                No worries! Enter your email and we'll send you a reset link.
              </Text>
            </View>

            {/* Form */}
            <Card variant="elevated" style={styles.formCard}>
              <Input
                label="EMAIL"
                placeholder="explorer@visby.app"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={error}
                leftIcon="mail"
              />

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading}
                variant="primary"
                size="lg"
                fullWidth
                style={styles.submitButton}
              />
            </Card>

            {/* Remember password? */}
            <View style={styles.loginContainer}>
              <Text variant="body" color={colors.text.secondary}>
                Remember your password?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text variant="body" color={colors.primary.wisteriaDark}>
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  backNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
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
    marginBottom: spacing.md,
  },
  formCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  successTitle: {
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  tipCard: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
    paddingVertical: spacing.md,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tipText: {
    flex: 1,
  },
  backButton: {
    marginTop: spacing.md,
  },
});

export default ForgotPasswordScreen;
