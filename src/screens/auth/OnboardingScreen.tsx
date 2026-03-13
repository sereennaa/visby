import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { RootStackParamList } from '../../types';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

interface OnboardingStep {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  gradient: [string, string, string];
}

const steps: OnboardingStep[] = [
  {
    icon: 'viking',
    iconBg: colors.primary.wisteriaFaded,
    iconColor: colors.primary.wisteriaDark,
    title: 'Meet Your Visby!',
    description:
      'This is your Viking explorer. Customize their look, dress them up, and take them on adventures around the world!',
    gradient: ['#FDFBF8', '#F0ECF9', '#E6E0FA'],
  },
  {
    icon: 'globe',
    iconBg: colors.calm.skyLight,
    iconColor: colors.calm.ocean,
    title: 'Explore the World',
    description:
      'Visit countries, walk through houses, and learn amazing facts about cultures, food, and history. Earn Aura along the way!',
    gradient: ['#FDFBF8', '#E6F2FC', '#D4ECFA'],
  },
  {
    icon: 'stamp',
    iconBg: colors.success.honeydew,
    iconColor: colors.success.emerald,
    title: 'Collect & Learn',
    description:
      'Collect stamps from places you visit, log delicious foods you try, and earn badges for your achievements.',
    gradient: ['#FDFBF8', '#F0ECF9', '#DDD4F2'],
  },
  {
    icon: 'sparkles',
    iconBg: colors.reward.peachLight,
    iconColor: '#D4880A',
    title: 'Your Adventure Begins!',
    description:
      "You start with 200 Aura. Spend it to visit countries, buy cosmetics, or save up for your first house. Let's go!",
    gradient: ['#FDFBF8', '#FFF4E0', '#FFEAD0'],
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const animateToStep = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setCurrentStep(nextStep);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 14, stiffness: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      handleDone();
    } else {
      animateToStep(currentStep + 1);
    }
  };

  const handleDone = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <LinearGradient
      colors={step.gradient}
      style={styles.container}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          {!isLastStep && (
            <TouchableOpacity onPress={handleDone} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: step.iconBg }]}>
            <View style={styles.iconInner}>
              <Icon name={step.icon} size={80} color={step.iconColor} />
            </View>
          </View>

          <Text variant="displayTitle" align="center" style={styles.title}>
            {step.title}
          </Text>

          <Text
            variant="bodyLarge"
            align="center"
            color={colors.text.secondary}
            style={styles.description}
          >
            {step.description}
          </Text>
        </Animated.View>

        <View style={styles.bottom}>
          <View style={styles.dots}>
            {steps.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <Button
            title={isLastStep ? 'Start Exploring' : 'Next'}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
  },
  headerSpacer: {
    width: 60,
  },
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  skipText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    color: colors.text.muted,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
  iconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.lg,
  },
  description: {
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary.wisteria,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
