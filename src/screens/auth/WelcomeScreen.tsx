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
          withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sine) }),
          withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sine) }),
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
    opacity: interpolate(wave.value, [0, 0.5, 1], [0.15, 0.35, 0.15]),
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
  const visbyTranslate = useSharedValue(60);
  const visbyOpacity = useSharedValue(0);
  const visbyFloat = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslate = useSharedValue(40);
  const ringScale = useSharedValue(0.5);
  const ringOpacity = useSharedValue(0);
  const taglineLetters = useSharedValue(0);

  useEffect(() => {
    // Ring pulse behind character
    ringScale.value = withDelay(400, withSpring(1, { damping: 8, stiffness: 60 }));
    ringOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // Logo entrance with bounce
    logoScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 80 }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    // Character flies in from below
    visbyTranslate.value = withDelay(500, withSpring(0, { damping: 12, stiffness: 70 }));
    visbyOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));

    // Gentle float loop for character
    visbyFloat.value = withDelay(
      1100,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );

    // Content slides up
    contentTranslate.value = withDelay(800, withSpring(0, { damping: 14 }));
    contentOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));

    // Tagline typewriter-ish
    taglineLetters.value = withDelay(1200, withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: interpolate(ringOpacity.value, [0, 1], [0, 0.25]),
  }));

  const visbyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: visbyTranslate.value + visbyFloat.value },
    ],
    opacity: visbyOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslate.value }],
    opacity: contentOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineLetters.value,
    transform: [{ translateY: interpolate(taglineLetters.value, [0, 1], [8, 0]) }],
  }));

  return (
    <View style={styles.container}>
      {/* Deep magical gradient background */}
      <LinearGradient
        colors={['#1A1035', '#2D1B69', '#1A1035']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Colored overlay for warmth */}
      <LinearGradient
        colors={[
          'rgba(199, 184, 234, 0.15)',
          'rgba(127, 189, 232, 0.1)',
          'rgba(255, 182, 193, 0.08)',
          'transparent',
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Aurora waves */}
      <AuroraWave delay={0} color="rgba(199, 184, 234, 0.4)" yOffset={height * 0.08} />
      <AuroraWave delay={2000} color="rgba(127, 189, 232, 0.3)" yOffset={height * 0.15} />
      <AuroraWave delay={4000} color="rgba(255, 182, 193, 0.25)" yOffset={height * 0.22} />

      {/* Floating particles */}
      <FloatingParticles count={20} variant="stars" opacity={0.6} speed="slow" />

      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Text style={styles.logoText}>Visby</Text>
          <Animated.View style={taglineStyle}>
            <Text style={styles.tagline}>Explore · Collect · Wonder</Text>
          </Animated.View>
        </Animated.View>

        {/* Character with glow ring */}
        <View style={styles.characterSection}>
          <Animated.View style={[styles.glowRing, ringStyle]}>
            <LinearGradient
              colors={[
                'rgba(199, 184, 234, 0.3)',
                'rgba(255, 215, 0, 0.15)',
                'rgba(127, 189, 232, 0.2)',
                'transparent',
              ]}
              style={styles.ringGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </Animated.View>
          <Animated.View style={visbyStyle}>
            <PulseGlow
              color="rgba(199, 184, 234, 0.6)"
              intensity={30}
              speed={3000}
            >
              <VisbyCharacter
                appearance={{
                  skinTone: colors.visby.skin.light,
                  hairColor: colors.visby.hair.blonde,
                  hairStyle: 'default',
                  eyeColor: '#4A90D9',
                  eyeShape: 'round',
                }}
                equipped={{ hat: 'viking_helmet' }}
                mood="excited"
                size={220}
                animated={true}
              />
            </PulseGlow>
          </Animated.View>
        </View>

        {/* Welcome Content */}
        <Animated.View style={[styles.content, contentStyle]}>
          <Text variant="h1" align="center" style={styles.welcomeTitle}>
            Your adventure awaits
          </Text>
          <Text variant="body" align="center" style={styles.welcomeText}>
            Collect stamps, discover food, dress your Viking,
            buy houses around the world, and learn about cultures everywhere you go.
          </Text>

          {/* Feature pills */}
          <View style={styles.featurePills}>
            {['🗺️ Explore', '👘 Dress Up', '🏠 Build', '📚 Learn'].map((feat, i) => (
              <View key={i} style={styles.pill}>
                <Text style={styles.pillText}>{feat}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttons}>
            <Button
              title="Begin Your Journey ✨"
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

        {/* Bottom */}
        <View style={styles.bottomDecoration}>
          <View style={styles.madeWithRow}>
            <Text style={styles.madeWith}>Made with </Text>
            <Icon name="heart" size={12} color={colors.primary.wisteria} />
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
    paddingTop: 50,
    paddingBottom: spacing.md,
  },
  auroraWave: {
    position: 'absolute',
    left: -width * 0.2,
    width: width * 1.4,
    height: 120,
  },
  auroraGradient: {
    flex: 1,
    borderRadius: 60,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  logoText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 58,
    color: '#F0E8FF',
    textShadowColor: 'rgba(199, 184, 234, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.sm,
    letterSpacing: 3,
  },
  characterSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  glowRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
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
    textShadowColor: 'rgba(199, 184, 234, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: spacing.radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pillText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
  },
  loginButton: {
    marginTop: spacing.xs,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  bottomDecoration: {
    marginTop: spacing.md,
  },
  madeWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  madeWith: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
  },
});

export default WelcomeScreen;
