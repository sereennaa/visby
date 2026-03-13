import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { PulseGlow } from '../../components/effects/Shimmer';
import { RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const AuroraWave: React.FC<{ delay: number; color: string; yOffset: number }> = ({ delay, color, yOffset }) => {
  const wave = useSharedValue(0);

  useEffect(() => {
    wave.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 7000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0, { duration: 7000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(wave.value, [0, 1], [-width * 0.3, width * 0.3]) },
      { scaleY: interpolate(wave.value, [0, 0.5, 1], [0.8, 1.2, 0.8]) },
    ],
    opacity: interpolate(wave.value, [0, 0.5, 1], [0.12, 0.3, 0.12]),
  }));

  return (
    <Animated.View style={[styles.auroraWave, { top: yOffset }, style]}>
      <LinearGradient
        colors={['transparent', color, 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.auroraGradient}
      />
    </Animated.View>
  );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const visbyTranslate = useSharedValue(50);
  const visbyOpacity = useSharedValue(0);
  const visbyFloat = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslate = useSharedValue(30);
  const ringScale = useSharedValue(0.5);
  const ringOpacity = useSharedValue(0);
  const taglineLetters = useSharedValue(0);

  useEffect(() => {
    ringScale.value = withDelay(400, withSpring(1, { damping: 8, stiffness: 60 }));
    ringOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    logoScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 80 }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    visbyTranslate.value = withDelay(500, withSpring(0, { damping: 12, stiffness: 70 }));
    visbyOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    visbyFloat.value = withDelay(
      1100,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 2200, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
          withTiming(0, { duration: 2200, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
        ),
        -1, true,
      ),
    );
    contentTranslate.value = withDelay(800, withSpring(0, { damping: 14 }));
    contentOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    taglineLetters.value = withDelay(1200, withTiming(1, { duration: 1000, easing: Easing.bezier(0, 0, 0.58, 1) }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: interpolate(ringOpacity.value, [0, 1], [0, 0.2]),
  }));

  const visbyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: visbyTranslate.value + visbyFloat.value }],
    opacity: visbyOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslate.value }],
    opacity: contentOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineLetters.value,
    transform: [{ translateY: interpolate(taglineLetters.value, [0, 1], [6, 0]) }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#180E30', '#2A1860', '#1E1248']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <LinearGradient
        colors={[
          'rgba(184, 165, 224, 0.12)',
          'rgba(107, 176, 224, 0.08)',
          'rgba(255, 180, 190, 0.06)',
          'transparent',
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <AuroraWave delay={0} color="rgba(184, 165, 224, 0.35)" yOffset={height * 0.06} />
      <AuroraWave delay={2500} color="rgba(107, 176, 224, 0.25)" yOffset={height * 0.14} />
      <AuroraWave delay={5000} color="rgba(255, 180, 190, 0.2)" yOffset={height * 0.22} />

      <FloatingParticles count={18} variant="stars" opacity={0.5} speed="slow" />

      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Text style={styles.logoText}>Visby</Text>
          <Animated.View style={taglineStyle}>
            <Text style={styles.tagline}>Explore  ·  Collect  ·  Wonder</Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.characterSection}>
          <Animated.View style={[styles.glowRing, ringStyle]}>
            <LinearGradient
              colors={[
                'rgba(184, 165, 224, 0.25)',
                'rgba(255, 215, 0, 0.12)',
                'rgba(107, 176, 224, 0.15)',
                'transparent',
              ]}
              style={styles.ringGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </Animated.View>
          <Animated.View style={visbyStyle}>
            <PulseGlow color="rgba(184, 165, 224, 0.5)" intensity={25} speed={3200}>
              <VisbyCharacter
                appearance={{
                  skinTone: '#FFAD6B',
                  hairColor: '#B8875A',
                  hairStyle: 'default',
                  eyeColor: '#2A1A0A',
                  eyeShape: 'round',
                }}
                equipped={{ hat: 'viking_helmet' }}
                mood="happy"
                size={200}
                animated={true}
              />
            </PulseGlow>
          </Animated.View>
        </View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text variant="h1" align="center" style={styles.welcomeTitle}>
            Your adventure awaits
          </Text>
          <Text variant="body" align="center" style={styles.welcomeText}>
            Explore the world, collect stamps, dress your Viking, and learn about cultures everywhere you go.
          </Text>

          <View style={styles.featurePills}>
            {['🗺️ Explore', '👘 Dress Up', '🏠 Build', '📚 Learn'].map((feat, i) => (
              <View key={i} style={styles.pill}>
                <Text style={styles.pillText}>{feat}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttons}>
            <Button
              title="Begin Your Journey"
              onPress={() => navigation.navigate('SignUp')}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="I already have an account"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              size="md"
              fullWidth
              style={styles.loginButton}
              textStyle={styles.loginText}
            />
          </View>
        </Animated.View>

        <View style={styles.bottomDecoration}>
          <View style={styles.madeWithRow}>
            <Text style={styles.madeWith}>Made with </Text>
            <Icon name="heart" size={11} color="rgba(184, 165, 224, 0.6)" />
            <Text style={styles.madeWith}> for little explorers</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 44,
    paddingBottom: spacing.md,
  },
  auroraWave: {
    position: 'absolute',
    left: -width * 0.2,
    width: width * 1.4,
    height: 100,
  },
  auroraGradient: {
    flex: 1,
    borderRadius: 50,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  logoText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontSize: 54,
    color: '#EDE4FF',
    textShadowColor: 'rgba(184, 165, 224, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
    letterSpacing: 3,
  },
  tagline: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: spacing.xs,
    letterSpacing: 4,
  },
  characterSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  glowRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
  },
  ringGradient: {
    flex: 1,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(184, 165, 224, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.55)',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.radius.round,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
  },
  loginButton: {
    marginTop: spacing.xxs,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  bottomDecoration: {
    marginTop: spacing.md,
  },
  madeWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  madeWith: {
    fontFamily: 'Nunito-Medium',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.25)',
  },
});

export default WelcomeScreen;
