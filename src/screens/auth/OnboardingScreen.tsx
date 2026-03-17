import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Pressable } from 'react-native';
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
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { RootStackParamList } from '../../types';
import { useStore } from '../../store/useStore';
import { Visby } from '../../types';
import { DEFAULT_NEEDS } from '../../store/useStore';

const TOTAL_STEPS = 6;

const GRADIENTS: [string, string, string][] = [
  ['#FDFBF8', '#FFF8E7', '#F5E6C8'],
  ['#FDFBF8', '#F0ECF9', '#E6E0FA'],
  ['#FDFBF8', '#E6F2FC', '#D4ECFA'],
  ['#FDFBF8', '#FFEAD0', '#FFD1A0'],
  ['#F0ECF9', '#E6E0FA', '#DDD4F2'],
  ['#FDFBF8', '#F0ECF9', '#E6F2FC'],
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

const REMINDER_OPTIONS: { label: string; value: string }[] = [
  { label: 'Morning (9 AM)', value: '09:00' },
  { label: 'Afternoon (3 PM)', value: '15:00' },
  { label: 'Evening (7 PM)', value: '19:00' },
];

const FOOD_OPTIONS = [
  { emoji: '🍣', label: 'Sushi' },
  { emoji: '🍜', label: 'Ramen' },
  { emoji: '🍡', label: 'Mochi' },
];

function createDefaultVisby(userId: string, displayName: string): Visby {
  return {
    id: `visby_${userId}`,
    userId,
    name: `${displayName}'s Visby`,
    createdAt: new Date(),
    appearance: { skinTone: '#FFBA6B', hairColor: '#A67B5B', hairStyle: 'default', eyeColor: '#3A2010', eyeShape: 'round' },
    equipped: { outfit: 'default_tunic', hat: 'viking_helmet' },
    ownedCosmetics: ['default_tunic', 'default_boots', 'default_backpack', 'viking_helmet'],
    currentMood: 'happy',
    needs: { ...DEFAULT_NEEDS },
  };
}

// --- Sub-components ---

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
  const user = useStore(s => s.user);
  const visby = useStore(s => s.visby);
  const setVisby = useStore(s => s.setVisby);
  const addAura = useStore(s => s.addAura);
  const feedVisby = useStore(s => s.feedVisby);
  const updateSettings = useStore(s => s.updateSettings);

  const [step, setStep] = useState(0);
  const [step0Phase, setStep0Phase] = useState<'wobble' | 'hatch' | 'name'>('wobble');
  const [visbyName, setVisbyName] = useState(visby?.name || '');
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [auraEarned, setAuraEarned] = useState(false);
  const [reminderTime, setReminderTime] = useState('19:00');

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

  const auraTextOpacity = useSharedValue(0);
  const auraTextTranslateY = useSharedValue(20);
  const visbyHappyScale = useSharedValue(1);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, []);

  // Step 0: wobble -> hatch -> name
  useEffect(() => {
    if (step !== 0) return;
    if (step0Phase === 'wobble') {
      eggScale.value = 0;
      eggScale.value = withSpring(1, { damping: 8, stiffness: 120 });
      eggRotation.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(5, { duration: 200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1,
        true,
      );
      const t = setTimeout(() => {
        setStep0Phase('hatch');
      }, 2200);
      timersRef.current = [t];
    }
  }, [step, step0Phase]);

  useEffect(() => {
    if (step !== 0 || step0Phase !== 'hatch') return;
    clearTimers();
    eggRotation.value = withTiming(0, { duration: 100 });
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
      hatchEggRotation.value = withTiming(0, { duration: 100 });
      hatchEggScale.value = withTiming(0.1, { duration: 400, easing: Easing.bezier(0.4, 0, 1, 1) });
      hatchEggOpacity.value = withTiming(0, { duration: 400 });
      babyOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
      babyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    }, 2600);

    const t3 = setTimeout(() => {
      setStep0Phase('name');
    }, 4200);

    timersRef.current = [t1, t2, t3];
  }, [step, step0Phase]);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 400 });
    contentScale.value = withSpring(1, { damping: 16, stiffness: 180 });
    contentTranslateY.value = withSpring(0, { damping: 16, stiffness: 180 });

    if (step === 5) {
      babyOpacity.value = 0;
      babyScale.value = 0;
      babyOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
      babyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    }
  }, [step]);

  const animateOut = useCallback((next: number) => {
    contentOpacity.value = withTiming(0, { duration: 200 });
    contentScale.value = withTiming(0.92, { duration: 200 });
    contentTranslateY.value = withTiming(-10, { duration: 200 }, () => {
      runOnJS(setStep)(next);
    });
  }, []);

  const handleStep0Next = () => {
    const nameToSave = (visbyName || visby?.name || `${user?.displayName || 'Explorer'}'s Visby`).trim();
    const currentVisby = visby || (user ? createDefaultVisby(user.id, user.displayName) : null);
    if (currentVisby) {
      setVisby({ ...currentVisby, name: nameToSave });
    }
    animateOut(1);
  };

  const handleStep1Cool = () => {
    addAura(5);
    setAuraEarned(true);
    auraTextOpacity.value = 0;
    auraTextTranslateY.value = 20;
    auraTextOpacity.value = withTiming(1, { duration: 400 });
    auraTextTranslateY.value = withSpring(0, { damping: 12, stiffness: 120 });
  };

  const handleStep1Next = () => {
    animateOut(2);
  };

  const handleStep2FoodTap = (label: string) => {
    if (selectedFood) return;
    setSelectedFood(label);
    feedVisby();
    visbyHappyScale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 }),
    );
  };

  const handleStep2Next = () => {
    animateOut(3);
  };

  const handleStep3Next = () => {
    animateOut(4);
  };

  const handleStep4Next = () => {
    updateSettings({ reminderTime });
    animateOut(5);
  };

  const handleStep5Start = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
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

  const auraTextStyle = useAnimatedStyle(() => ({
    opacity: auraTextOpacity.value,
    transform: [{ translateY: auraTextTranslateY.value }],
  }));

  const visbyHappyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: visbyHappyScale.value }],
  }));

  const getButtonConfig = () => {
    if (step === 0) {
      const show = step0Phase === 'name';
      return { show, title: 'Next', onPress: handleStep0Next, variant: 'primary' as const };
    }
    if (step === 1) {
      return {
        show: true,
        title: auraEarned ? 'Next' : 'Cool!',
        onPress: auraEarned ? handleStep1Next : handleStep1Cool,
        variant: 'primary' as const,
      };
    }
    if (step === 2) {
      return { show: true, title: 'Next', onPress: handleStep2Next, variant: 'primary' as const };
    }
    if (step === 3) {
      return { show: true, title: "Let's go!", onPress: handleStep3Next, variant: 'primary' as const };
    }
    if (step === 4) {
      return { show: true, title: 'Next', onPress: handleStep4Next, variant: 'primary' as const };
    }
    return {
      show: true,
      title: "Let's explore!",
      onPress: handleStep5Start,
      variant: 'reward' as const,
    };
  };

  const buttonConfig = getButtonConfig();
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <LinearGradient
      colors={GRADIENTS[step]}
      style={styles.container}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={styles.safeArea}>
        <ReAnimated.View style={[styles.content, contentStyle]}>

          {/* Step 0 — Name your Visby: egg wobble -> hatch -> name input */}
          {step === 0 && (
            <View style={styles.stepCenter}>
              <View style={styles.hatchContainer}>
                {step0Phase === 'wobble' && (
                  <ReAnimated.View style={eggStyle}>
                    <View style={styles.eggGlow}>
                      <VisbyCharacter stage="egg" size={180} animated={false} />
                    </View>
                  </ReAnimated.View>
                )}
                {(step0Phase === 'hatch' || step0Phase === 'name') && (
                  <>
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
                        active={step0Phase === 'name'}
                      />
                    ))}
                  </>
                )}
              </View>
              {step0Phase === 'wobble' && (
                <>
                  <Heading level={1} align="center" style={styles.titleBaloo}>
                    Your Visby Egg!
                  </Heading>
                  <Caption align="center" color={colors.text.secondary} style={styles.descriptionNunito}>
                    Something magical is about to happen...
                  </Caption>
                </>
              )}
              {step0Phase === 'hatch' && (
                <Heading level={1} align="center" style={styles.titleBaloo}>
                  Your Visby is Hatching...
                </Heading>
              )}
              {step0Phase === 'name' && (
                <>
                  <Heading level={1} align="center" style={styles.titleBaloo}>
                    Name your Visby!
                  </Heading>
                  <Caption align="center" color={colors.text.secondary} style={styles.descriptionNunito}>
                    Give your new companion a name
                  </Caption>
                  <TextInput
                    style={styles.nameInput}
                    placeholder="Enter a name"
                    placeholderTextColor={colors.text.muted}
                    value={visbyName}
                    onChangeText={setVisbyName}
                    autoCapitalize="words"
                    maxLength={24}
                  />
                </>
              )}
            </View>
          )}

          {/* Step 1 — First taste of the world: Japan fact card */}
          {step === 1 && (
            <View style={styles.stepCenter}>
              <View style={styles.japanCardWrapper}>
                {auraEarned && (
                  <>
                    {SPARKLE_POSITIONS.slice(0, 6).map((sp, i) => (
                      <SparkleParticle
                        key={i}
                        x={sp.x}
                        y={sp.y}
                        size={sp.size}
                        delay={sp.delay}
                        active={true}
                      />
                    ))}
                  </>
                )}
                <View style={styles.japanCard}>
                  <LinearGradient colors={['#E6F2FC', '#D4ECFA']} style={styles.japanCardInner}>
                    <View style={styles.templeIconCircle}>
                      <Icon name="temple" size={48} color={colors.calm.ocean} />
                    </View>
                    <Heading level={2} align="center" style={styles.japanCardTitle}>
                      Japan
                    </Heading>
                    <Text variant="bodyLarge" align="center" color={colors.text.secondary} style={styles.japanFact}>
                      In Japan, people bow to say hello!
                    </Text>
                    {auraEarned && (
                      <ReAnimated.View style={[styles.auraEarnedBadge, auraTextStyle]}>
                        <Icon name="sparkles" size={20} color={colors.reward.gold} />
                        <Text variant="h3" style={styles.auraEarnedText}>+5 Aura</Text>
                      </ReAnimated.View>
                    )}
                  </LinearGradient>
                </View>
              </View>
              <Caption align="center" color={colors.text.secondary} style={styles.step1Hint}>
                {auraEarned ? "You earned your first Aura! Tap Next to continue." : "Tap Cool! to earn your first Aura"}
              </Caption>
            </View>
          )}

          {/* Step 2 — First care action: feed Visby */}
          {step === 2 && (
            <View style={styles.stepCenter}>
              <ReAnimated.View style={visbyHappyStyle}>
                <VisbyCharacter
                  stage="baby"
                  size={140}
                  mood={selectedFood ? 'excited' : 'hungry'}
                />
              </ReAnimated.View>
              <Heading level={2} align="center" style={styles.titleBaloo}>
                {selectedFood ? "Yum! Visby loved that!" : "I'm hungry from the trip!"}
              </Heading>
              <Caption align="center" color={colors.text.secondary} style={styles.descriptionNunito}>
                {selectedFood ? "Visby is happy and ready to explore!" : "Pick something to feed your Visby"}
              </Caption>
              <View style={styles.foodRow}>
                {FOOD_OPTIONS.map(({ emoji, label }) => (
                  <Pressable
                    key={label}
                    style={[
                      styles.foodCard,
                      selectedFood === label && styles.foodCardSelected,
                    ]}
                    onPress={() => handleStep2FoodTap(label)}
                    disabled={!!selectedFood}
                  >
                    <Text style={styles.foodEmoji}>{emoji}</Text>
                    <Text variant="bodySmall" style={styles.foodLabel}>{label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Step 3 — Your mission */}
          {step === 3 && (
            <View style={styles.stepCenter}>
              <View style={styles.missionCard}>
                <LinearGradient colors={['#F0ECF9', '#E6E0FA']} style={styles.missionCardInner}>
                  <View style={styles.targetIconCircle}>
                    <Icon name="target" size={40} color={colors.primary.wisteriaDark} />
                  </View>
                  <Heading level={2} align="center" style={styles.missionTitle}>
                    Your mission
                  </Heading>
                  <Text variant="bodyLarge" align="center" color={colors.text.secondary} style={styles.missionSubtitle}>
                    Every day you'll get a fun mission!
                  </Text>
                  <View style={styles.exampleMission}>
                    <Icon name="stamp" size={24} color={colors.primary.wisteriaDark} />
                    <Text variant="h3">Collect 1 stamp</Text>
                  </View>
                  <Caption align="center" color={colors.text.muted} style={styles.missionHint}>
                    Complete missions to earn bonus Aura and keep your Visby happy!
                  </Caption>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Step 4 — Set your reminder */}
          {step === 4 && (
            <View style={styles.stepCenter}>
              <Heading level={2} align="center" style={styles.titleBaloo}>
                Set your reminder
              </Heading>
              <Caption align="center" color={colors.text.secondary} style={styles.descriptionNunito}>
                We'll remind you to come back and play!
              </Caption>
              <View style={styles.reminderPills}>
                {REMINDER_OPTIONS.map(({ label, value }) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.reminderPill,
                      reminderTime === value && styles.reminderPillSelected,
                    ]}
                    onPress={() => setReminderTime(value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      variant="body"
                      style={[
                        styles.reminderPillText,
                        reminderTime === value && styles.reminderPillTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 5 — Welcome Home */}
          {step === 5 && (
            <View style={styles.stepCenter}>
              <FloatingParticles count={10} variant="sparkle" opacity={0.5} speed="slow" />
              <View style={styles.welcomeHomeRoom}>
                <View style={styles.welcomeHomeWall} />
                <View style={styles.welcomeHomeFloor} />
                <ReAnimated.View style={[styles.welcomeHomeVisby, babyRevealStyle]}>
                  <VisbyCharacter stage="baby" size={140} mood="excited" />
                </ReAnimated.View>
              </View>
              <Heading level={1} align="center" style={styles.titleBaloo}>
                Welcome Home!
              </Heading>
              <Caption align="center" color={colors.text.secondary} style={styles.descriptionNunito}>
                This is your home! Visby lives here.{'\n'}Explore the world, learn new things, and make it yours!
              </Caption>
            </View>
          )}

        </ReAnimated.View>

        <View style={styles.bottom}>
          <View style={styles.dots}>
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
              <StepDot key={index} active={index === step} />
            ))}
          </View>

          {buttonConfig.show && (
            <Button
              title={buttonConfig.title}
              onPress={buttonConfig.onPress}
              variant={buttonConfig.variant}
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
  eggGlow: {
    elevation: 8,
    ...getShadowStyle({ shadowColor: colors.reward.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 30 }),
  },
  nameInput: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    color: colors.text.primary,
  },

  // Step 1
  japanCardWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  japanCard: {
    width: '90%',
    maxWidth: 320,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    elevation: 4,
    ...getShadowStyle({ shadowColor: 'rgba(0, 0, 0, 0.08)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16 }),
  },
  japanCardInner: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  templeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  japanCardTitle: {
    fontFamily: 'Baloo2-SemiBold',
  },
  japanFact: {
    fontFamily: 'Nunito-SemiBold',
    lineHeight: 24,
  },
  auraEarnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  auraEarnedText: {
    fontFamily: 'Baloo2-SemiBold',
    color: colors.reward.gold,
  },
  step1Hint: {
    marginTop: spacing.lg,
  },

  // Step 2
  foodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  foodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    minWidth: 90,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  foodCardSelected: {
    borderColor: colors.primary.wisteria,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  foodEmoji: {
    fontSize: 36,
  },
  foodLabel: {
    fontFamily: 'Nunito-Bold',
  },

  // Step 3
  missionCard: {
    width: '90%',
    maxWidth: 320,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    elevation: 4,
    ...getShadowStyle({ shadowColor: 'rgba(0, 0, 0, 0.08)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16 }),
  },
  missionCardInner: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  targetIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionTitle: {
    fontFamily: 'Baloo2-SemiBold',
  },
  missionSubtitle: {
    fontFamily: 'Nunito-SemiBold',
    lineHeight: 24,
  },
  exampleMission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius.md,
  },
  missionHint: {
    fontFamily: 'Nunito-Regular',
    lineHeight: 20,
  },

  // Step 4
  reminderPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  reminderPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius.round,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reminderPillSelected: {
    backgroundColor: colors.primary.wisteriaFaded,
    borderColor: colors.primary.wisteria,
  },
  reminderPillText: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.secondary,
  },
  reminderPillTextSelected: {
    color: colors.primary.wisteriaDark,
  },

  // Step 5
  welcomeHomeRoom: {
    width: 260,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  welcomeHomeWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#FFF8F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  welcomeHomeFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: '#D4C5A0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeHomeVisby: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -70,
  },

  // Shared
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
