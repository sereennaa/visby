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
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const visbyTranslate = useSharedValue(50);
  const visbyOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslate = useSharedValue(30);
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animations
    logoScale.value = withDelay(300, withSpring(1, { damping: 12 }));
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));

    visbyTranslate.value = withDelay(600, withSpring(0, { damping: 15 }));
    visbyOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));

    contentTranslate.value = withDelay(900, withSpring(0, { damping: 15 }));
    contentOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));

    // Sparkle animations
    sparkle1.value = withDelay(1200, withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.5, { duration: 500 })
    ));
    sparkle2.value = withDelay(1400, withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.5, { duration: 500 })
    ));
    sparkle3.value = withDelay(1600, withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.5, { duration: 500 })
    ));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const visbyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: visbyTranslate.value }],
    opacity: visbyOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslate.value }],
    opacity: contentOpacity.value,
  }));

  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1.value,
    transform: [{ scale: sparkle1.value }],
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2.value,
    transform: [{ scale: sparkle2.value }],
  }));

  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3.value,
    transform: [{ scale: sparkle3.value }],
  }));

  const defaultAppearance = {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  return (
    <LinearGradient
      colors={[colors.primary.wisteriaFaded, colors.base.cream, colors.calm.skyLight]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* Background decorations */}
        <View style={styles.decorations}>
          <Animated.View style={[styles.sparkle, styles.sparkle1, sparkle1Style]}>
            <Icon name="sparkles" size={24} color={colors.reward.gold} />
          </Animated.View>
          <Animated.View style={[styles.sparkle, styles.sparkle2, sparkle2Style]}>
            <Icon name="star" size={24} color={colors.reward.gold} />
          </Animated.View>
          <Animated.View style={[styles.sparkle, styles.sparkle3, sparkle3Style]}>
            <Icon name="star" size={20} color={colors.reward.goldSoft} />
          </Animated.View>
        </View>

        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Text style={styles.logoText}>Visby</Text>
          <Text style={styles.tagline}>Explore • Collect • Learn</Text>
        </Animated.View>

        {/* Visby Character */}
        <Animated.View style={[styles.visbyContainer, visbyStyle]}>
          <VisbyCharacter
            appearance={defaultAppearance}
            mood="excited"
            size={200}
            animated={true}
          />
        </Animated.View>

        {/* Welcome Content */}
        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.welcomeTitleRow}>
            <Text variant="h2" align="center" style={styles.welcomeTitle}>
              Your adventure awaits!
            </Text>
            <Icon name="map" size={24} color={colors.primary.wisteriaDark} style={styles.titleIcon} />
          </View>
          <Text variant="body" align="center" style={styles.welcomeText}>
            Collect stamps from real places, discover amazing food,
            and learn about cultures around the world.
          </Text>

          <View style={styles.buttons}>
            <Button
              title="Start Journey"
              onPress={() => navigation.navigate('SignUp')}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="I have an account"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              size="md"
              fullWidth
              style={styles.loginButton}
            />
          </View>
        </Animated.View>

        {/* Bottom decoration */}
        <View style={styles.bottomDecoration}>
          <View style={styles.madeWithRow}>
            <Text style={styles.madeWith}>Made with </Text>
            <Icon name="heart" size={14} color={colors.primary.wisteria} />
            <Text style={styles.madeWith}> for explorers</Text>
          </View>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 60, // Account for status bar + extra space for logo
    paddingBottom: spacing.lg,
  },
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: height * 0.12,
    left: width * 0.12,
  },
  sparkle2: {
    top: height * 0.16,
    right: width * 0.12,
  },
  sparkle3: {
    top: height * 0.28,
    left: width * 0.78,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    width: '100%',
  },
  logoText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 52,
    color: colors.primary.wisteriaDark,
    textShadowColor: colors.shadow.colored,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  tagline: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    letterSpacing: 2,
  },
  visbyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  welcomeTitle: {
    color: colors.text.primary,
  },
  titleIcon: {
    marginLeft: spacing.sm,
  },
  welcomeText: {
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    lineHeight: 24,
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  bottomDecoration: {
    marginTop: spacing.lg,
  },
  madeWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  madeWith: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 12,
    color: colors.text.muted,
  },
});

export default WelcomeScreen;
