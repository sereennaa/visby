import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ReAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { RootStackParamList } from '../../types';

const TOTAL_STEPS = 5;

const GRADIENTS: [string, string, string][] = [
  ['#FDFBF8', '#FFF8E7', '#F5E6C8'],
  ['#FDFBF8', '#F0ECF9', '#E6E0FA'],
  ['#FDFBF8', '#E6F2FC', '#D4ECFA'],
  ['#FDFBF8', '#FFEAD0', '#FFD1A0'],
  ['#F0ECF9', '#E6E0FA', '#DDD4F2'],
];

interface CareItemData {
  icon: IconName;
  iconColor: string;
  iconBg: string;
  label: string;
  description: string;
}

const CARE_ITEMS: CareItemData[] = [
  { icon: 'food', iconColor: colors.reward.coral, iconBg: colors.accent.blush, label: 'Food', description: 'Log the foods you eat!' },
  { icon: 'heart', iconColor: '#E06080', iconBg: colors.accent.rose, label: 'Joy', description: 'Explore and play games!' },
  { icon: 'flash', iconColor: colors.reward.amber, iconBg: colors.reward.peachLight, label: 'Energy', description: 'Come back every day!' },
  { icon: 'book', iconColor: colors.calm.ocean, iconBg: colors.calm.skyLight, label: 'Smarts', description: 'Take quizzes and learn!' },
];

const GAME_ITEMS: { icon: IconName; iconColor: string; iconBg: string; label: string }[] = [
  { icon: 'language', iconColor: colors.primary.wisteriaDark, iconBg: colors.primary.wisteriaFaded, label: 'Word Match' },
  { icon: 'grid', iconColor: colors.calm.ocean, iconBg: colors.calm.skyLight, label: 'Memory' },
  { icon: 'bowl', iconColor: colors.reward.coral, iconBg: colors.accent.blush, label: 'Cooking' },
  { icon: 'compass', iconColor: colors.success.emerald, iconBg: colors.success.honeydew, label: 'Treasure Hunt' },
];

const WORLD_ITEMS: { icon: IconName; label: string; bg: string; color: string }[] = [
  { icon: 'globe', label: 'Countries', bg: colors.calm.skyLight, color: colors.calm.ocean },
  { icon: 'home', label: 'Rooms', bg: colors.accent.lavender, color: colors.primary.wisteriaDark },
  { icon: 'stamp', label: 'Passport', bg: colors.success.honeydew, color: colors.success.emerald },
];

const SPARKLE_POSITIONS = [
  { x: -80, y: -60, size: 18, delay: 0 },
  { x: 70, y: -50, size: 14, delay: 100 },
  { x: -50, y: 40, size: 12, delay: 200 },
  { x: 60, y: 50, size: 16, delay: 150 },
  { x: -20, y: -80, size: 10, delay: 250 },
  { x: 30, y: 70, size: 13, delay: 300 },
  { x: -70, y: 10, size: 11, delay: 180 },
  { x: 80, y: -10, size: 15, delay: 80 },
];

// --- Sub-components (hooks-safe) ---

const CareItemRow: React.FC<{ item: CareItemData; index: number; active: boolean }> = ({
  item,
  index,
  active,
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-30);

  useEffect(() => {
    if (active) {
      opacity.value = withDelay(index * 200 + 300, withTiming(1, { duration: 400 }));
      translateX.value = withDelay(
        index * 200 + 300,
        withSpring(0, { damping: 14, stiffness: 160 }),
      );
    } else {
      opacity.value = 0;
      translateX.value = -30;
    }
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <ReAnimated.View style={[styles.careRow, animStyle]}>
      <View style={[styles.careIconCircle, { backgroundColor: item.iconBg }]}>
        <Icon name={item.icon} size={28} color={item.iconColor} />
      </View>
      <View style={styles.careTextCol}>
        <Text variant="h3" style={styles.careLabel}>{item.label}</Text>
        <Text variant="bodySmall" color={colors.text.secondary}>{item.description}</Text>
      </View>
    </ReAnimated.View>
  );
};

const SparkleParticle: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  active: boolean;
}> = ({ x, y, size, delay, active }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (active) {
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(800, withTiming(0, { duration: 600 })),
        ),
      );
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.2, { damping: 6, stiffness: 140 }),
          withDelay(600, withTiming(0, { duration: 400 })),
        ),
      );
    } else {
      opacity.value = 0;
      scale.value = 0;
    }
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <ReAnimated.View
      style={[styles.sparkle, { marginLeft: x, marginTop: y }, animStyle]}
    >
      <Icon name="sparkles" size={size} color={colors.reward.gold} />
    </ReAnimated.View>
  );
};

const StepDot: React.FC<{ active: boolean }> = ({ active }) => {
  const width = useSharedValue(active ? 24 : 8);

  useEffect(() => {
    width.value = withTiming(active ? 24 : 8, { duration: 250 });
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    width: width.value,
    backgroundColor: active ? colors.primary.wisteria : 'rgba(0, 0, 0, 0.10)',
  }));

  return <ReAnimated.View style={[styles.dot, animStyle]} />;
};

// --- Main screen ---

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [hatchPhase, setHatchPhase] = useState<'idle' | 'wobble' | 'shake' | 'reveal' | 'done'>('idle');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const contentOpacity = useSharedValue(1);
  const contentScale = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);

  const eggScale = useSharedValue(0);
  const eggRotation = useSharedValue(0);

  const hatchEggRotation = useSharedValue(0);
  const hatchEggScale = useSharedValue(1);
  const hatchEggOpacity = useSharedValue(1);
  const babyScale = useSharedValue(0);
  const babyOpacity = useSharedValue(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, []);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 400 });
    contentScale.value = withSpring(1, { damping: 16, stiffness: 180 });
    contentTranslateY.value = withSpring(0, { damping: 16, stiffness: 180 });

    if (step === 0) {
      eggScale.value = 0;
      eggScale.value = withSpring(1, { damping: 8, stiffness: 120 });
      eggRotation.value = withSequence(
        withDelay(500, withTiming(-5, { duration: 150 })),
        withTiming(5, { duration: 150 }),
        withTiming(-3, { duration: 120 }),
        withTiming(3, { duration: 120 }),
        withTiming(0, { duration: 100 }),
      );
    }

    if (step === 4) {
      startHatching();
    }
  }, [step]);

  const startHatching = () => {
    clearTimers();
    setHatchPhase('wobble');
    hatchEggScale.value = 1;
    hatchEggOpacity.value = 1;
    hatchEggRotation.value = 0;
    babyScale.value = 0;
    babyOpacity.value = 0;

    hatchEggRotation.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(6, { duration: 200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      4,
      true,
    );

    const t1 = setTimeout(() => {
      setHatchPhase('shake');
      hatchEggRotation.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 80 }),
          withTiming(12, { duration: 80 }),
        ),
        6,
        true,
      );
    }, 1600);

    const t2 = setTimeout(() => {
      setHatchPhase('reveal');
      hatchEggRotation.value = withTiming(0, { duration: 100 });
      hatchEggScale.value = withTiming(0.1, {
        duration: 400,
        easing: Easing.bezier(0.4, 0, 1, 1),
      });
      hatchEggOpacity.value = withTiming(0, { duration: 400 });
      babyOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
      babyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    }, 2600);

    const t3 = setTimeout(() => {
      setHatchPhase('done');
    }, 4200);

    timersRef.current = [t1, t2, t3];
  };

  const animateOut = useCallback((next: number) => {
    contentOpacity.value = withTiming(0, { duration: 200 });
    contentScale.value = withTiming(0.92, { duration: 200 });
    contentTranslateY.value = withTiming(-10, { duration: 200 }, () => {
      runOnJS(setStep)(next);
    });
  }, []);

  const handleNext = () => {
    if (step === TOTAL_STEPS - 1) {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } else {
      animateOut(step + 1);
    }
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { scale: contentScale.value },
      { translateY: contentTranslateY.value },
    ],
  }));

  const eggStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: eggScale.value },
      { rotate: `${eggRotation.value}deg` },
    ],
  }));

  const hatchEggStyle = useAnimatedStyle(() => ({
    opacity: hatchEggOpacity.value,
    transform: [
      { scale: hatchEggScale.value },
      { rotate: `${hatchEggRotation.value}deg` },
    ],
  }));

  const babyRevealStyle = useAnimatedStyle(() => ({
    opacity: babyOpacity.value,
    transform: [{ scale: babyScale.value }],
  }));

  const buttonTitle = [
    'Next',
    'Got it!',
    'Cool!',
    "Let's go!",
    'Start Playing!',
  ][step];

  const isLastStep = step === TOTAL_STEPS - 1;
  const showButton = step !== 4 || hatchPhase === 'done';

  return (
    <LinearGradient
      colors={GRADIENTS[step]}
      style={styles.container}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={styles.safeArea}>
        <ReAnimated.View style={[styles.content, contentStyle]}>

          {/* Step 0 — Your Visby Egg! */}
          {step === 0 && (
            <View style={styles.stepCenter}>
              <ReAnimated.View style={eggStyle}>
                <View style={styles.eggGlow}>
                  <VisbyCharacter stage="egg" size={180} animated={false} />
                </View>
              </ReAnimated.View>
              <Text variant="displayTitle" align="center" style={styles.titleBaloo}>
                Your Visby Egg!
              </Text>
              <Text
                variant="bodyLarge"
                align="center"
                color={colors.text.secondary}
                style={styles.descriptionNunito}
              >
                This is your Visby egg! Take care of it and it will hatch!
              </Text>
            </View>
          )}

          {/* Step 1 — How to Care */}
          {step === 1 && (
            <View style={styles.stepCenter}>
              <Text variant="displayTitle" align="center" style={styles.titleBaloo}>
                How to Care
              </Text>
              <Text
                variant="bodyLarge"
                align="center"
                color={colors.text.secondary}
                style={styles.careSubtitle}
              >
                Your Visby needs 4 things:
              </Text>
              <View style={styles.careList}>
                {CARE_ITEMS.map((item, i) => (
                  <CareItemRow key={item.label} item={item} index={i} active={step === 1} />
                ))}
              </View>
            </View>
          )}

          {/* Step 2 — Explore the World! */}
          {step === 2 && (
            <View style={styles.stepCenter}>
              <Text variant="displayTitle" align="center" style={styles.titleBaloo}>
                Explore the World!
              </Text>
              <Text
                variant="bodyLarge"
                align="center"
                color={colors.text.secondary}
                style={styles.descriptionNunito}
              >
                Visit countries, add places to your passport, and decorate your house!
              </Text>
              <View style={styles.worldIconsRow}>
                {WORLD_ITEMS.map((item) => (
                  <View key={item.label} style={styles.worldIconItem}>
                    <View style={[styles.worldIconCircle, { backgroundColor: item.bg }]}>
                      <Icon name={item.icon} size={32} color={item.color} />
                    </View>
                    <Text variant="caption" align="center" style={styles.worldIconLabel}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.miniCard}>
                <LinearGradient colors={['#E6F2FC', '#D4ECFA']} style={styles.miniCardInner}>
                  <Icon name="globe" size={24} color={colors.calm.ocean} />
                  <Text variant="h3" style={styles.miniCardTitle}>Japan</Text>
                  <View style={styles.miniCardRow}>
                    <Icon name="stamp" size={14} color={colors.text.muted} />
                    <Text variant="caption" style={styles.miniCardStat}>12 places</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Step 3 — Play and Learn! */}
          {step === 3 && (
            <View style={styles.stepCenter}>
              <Text variant="displayTitle" align="center" style={styles.titleBaloo}>
                Play and Learn!
              </Text>
              <Text
                variant="bodyLarge"
                align="center"
                color={colors.text.secondary}
                style={styles.descriptionNunito}
              >
                Play fun games to learn about the world and keep your Visby happy!
              </Text>
              <View style={styles.gameGrid}>
                {GAME_ITEMS.map((item) => (
                  <View key={item.label} style={styles.gameItem}>
                    <View style={[styles.gameIconCircle, { backgroundColor: item.iconBg }]}>
                      <Icon name={item.icon} size={32} color={item.iconColor} />
                    </View>
                    <Text variant="bodySmall" align="center" style={styles.gameLabel}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Step 4 — Your Visby is Hatching... */}
          {step === 4 && (
            <View style={styles.stepCenter}>
              <View style={styles.hatchContainer}>
                <ReAnimated.View style={[styles.hatchCharacter, hatchEggStyle]}>
                  <VisbyCharacter stage="egg" size={180} animated={false} />
                </ReAnimated.View>
                <ReAnimated.View style={[styles.hatchCharacter, babyRevealStyle]}>
                  <VisbyCharacter stage="baby" size={180} mood="excited" />
                </ReAnimated.View>
                {SPARKLE_POSITIONS.map((sp, i) => (
                  <SparkleParticle
                    key={i}
                    x={sp.x}
                    y={sp.y}
                    size={sp.size}
                    delay={sp.delay}
                    active={hatchPhase === 'reveal' || hatchPhase === 'done'}
                  />
                ))}
              </View>
              <Text variant="displayTitle" align="center" style={styles.titleBaloo}>
                {hatchPhase === 'done'
                  ? 'Welcome to the world, little Visby!'
                  : 'Your Visby is Hatching...'}
              </Text>
              {hatchPhase !== 'done' && (
                <Text
                  variant="bodyLarge"
                  align="center"
                  color={colors.text.secondary}
                  style={styles.descriptionNunito}
                >
                  Something magical is happening...
                </Text>
              )}
            </View>
          )}

        </ReAnimated.View>

        <View style={styles.bottom}>
          <View style={styles.dots}>
            {GRADIENTS.map((_, index) => (
              <StepDot key={index} active={index === step} />
            ))}
          </View>

          {showButton && (
            <Button
              title={buttonTitle}
              onPress={handleNext}
              variant={isLastStep ? 'reward' : 'primary'}
              size="lg"
              fullWidth
              icon={
                isLastStep
                  ? <Icon name="sparkles" size={20} color="#7A5A00" />
                  : <Icon name="forward" size={18} color="#FFFFFF" />
              }
              iconPosition="right"
            />
          )}
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  stepCenter: {
    alignItems: 'center',
  },

  titleBaloo: {
    fontFamily: 'Baloo2-SemiBold',
    marginBottom: spacing.md,
  },
  descriptionNunito: {
    fontFamily: 'Nunito-Regular',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },

  // Step 0
  eggGlow: {
    elevation: 8,
    marginBottom: spacing.xxxl,
    ...getShadowStyle({ shadowColor: colors.reward.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 30 }),
  },

  // Step 1
  careSubtitle: {
    fontFamily: 'Nunito-Regular',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  careList: {
    width: '100%',
    gap: spacing.md,
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  careIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  careTextCol: {
    flex: 1,
  },
  careLabel: {
    fontFamily: 'Nunito-Bold',
    marginBottom: spacing.xxs,
  },

  // Step 2
  worldIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  worldIconItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  worldIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    ...getShadowStyle({ shadowColor: 'rgba(0, 0, 0, 0.06)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12 }),
  },
  worldIconLabel: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.secondary,
  },
  miniCard: {
    width: '70%',
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    elevation: 4,
    ...getShadowStyle({ shadowColor: 'rgba(0, 0, 0, 0.08)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16 }),
  },
  miniCardInner: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  miniCardTitle: {
    fontFamily: 'Baloo2-SemiBold',
  },
  miniCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  miniCardStat: {
    fontFamily: 'Nunito-Regular',
  },

  // Step 3
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  gameItem: {
    alignItems: 'center',
    width: 100,
    gap: spacing.sm,
  },
  gameIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    ...getShadowStyle({ shadowColor: 'rgba(0, 0, 0, 0.06)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12 }),
  },
  gameLabel: {
    fontFamily: 'Nunito-Bold',
    color: colors.text.secondary,
  },

  // Step 4
  hatchContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  hatchCharacter: {
    position: 'absolute',
  },
  sparkle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },

  // Bottom
  bottom: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
