import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface GameLaunchSequenceProps {
  gameName: string;
  gameIcon: IconName;
  countryName?: string;
  countryEmoji?: string;
  rules?: string;
  onComplete: () => void;
}

const COUNTDOWN_ITEMS = ['3', '2', '1', 'GO!'];

export const GameLaunchSequence: React.FC<GameLaunchSequenceProps> = ({
  gameName,
  gameIcon,
  countryName,
  countryEmoji,
  rules,
  onComplete,
}) => {
  const bgOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const rulesOpacity = useSharedValue(0);
  const countdownIndex = useSharedValue(-1);
  const exitOpacity = useSharedValue(1);

  const [currentCountdown, setCurrentCountdown] = React.useState(-1);

  const updateCountdown = React.useCallback((val: number) => {
    setCurrentCountdown(val);
    if (val >= 0 && val < 3) hapticService.tap();
    if (val === 3) hapticService.success();
  }, []);

  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 180 });

    titleScale.value = withDelay(80, withSpring(1, { damping: 9, stiffness: 140 }));
    titleOpacity.value = withDelay(80, withTiming(1, { duration: 220 }));

    if (rules) {
      rulesOpacity.value = withDelay(280, withTiming(1, { duration: 220 }));
    }

    const countdownStart = rules ? 1000 : 600;

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        runOnJS(updateCountdown)(i);
      }, countdownStart + i * 450);
    }

    const totalDuration = countdownStart + 4 * 450 + 200;

    exitOpacity.value = withDelay(totalDuration - 300, withTiming(0, {
      duration: 220,
      easing: Easing.in(Easing.cubic),
    }));

    const timer = setTimeout(onComplete, totalDuration);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value * exitOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  const rulesStyle = useAnimatedStyle(() => ({
    opacity: rulesOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={['rgba(35, 28, 50, 0.96)', 'rgba(25, 18, 40, 0.98)']}
        style={styles.gradient}
      >
        {/* Game icon + title */}
        <Animated.View style={[styles.titleArea, titleStyle]}>
          {countryEmoji && (
            <Text style={styles.countryEmoji}>{countryEmoji}</Text>
          )}
          <View style={styles.iconCircle}>
            <Icon name={gameIcon} size={36} color="#FFFFFF" />
          </View>
          <Heading level={1} style={styles.gameName}>{gameName}</Heading>
          {countryName && (
            <Text variant="caption" style={styles.countryLabel}>{countryName}</Text>
          )}
        </Animated.View>

        {/* Rules hint */}
        {rules && (
          <Animated.View style={[styles.rulesCard, rulesStyle]}>
            <Text variant="body" style={styles.rulesText}>{rules}</Text>
          </Animated.View>
        )}

        {/* Countdown */}
        <View style={styles.countdownArea}>
          {currentCountdown >= 0 && (
            <CountdownNumber
              key={currentCountdown}
              text={COUNTDOWN_ITEMS[currentCountdown]}
              isGo={currentCountdown === 3}
            />
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const CountdownNumber: React.FC<{ text: string; isGo: boolean }> = ({ text, isGo }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(isGo ? 1.35 : 1.18, { damping: 7, stiffness: 170 }),
      withTiming(isGo ? 1.16 : 0.82, { duration: 190 }),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 80 }),
      withDelay(180, withTiming(isGo ? 1 : 0, { duration: 130 })),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.countdownItem, style]}>
      <Text style={[
        styles.countdownText,
        isGo && styles.goText,
      ]}>
        {text}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10001,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  titleArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  countryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(184, 165, 224, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gameName: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  countryLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  rulesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 24,
    maxWidth: SCREEN_W * 0.75,
  },
  rulesText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontSize: 13,
  },
  countdownArea: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 56,
    fontFamily: 'Baloo2-ExtraBold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  goText: {
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
