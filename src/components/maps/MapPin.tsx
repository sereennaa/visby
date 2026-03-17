import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, IconName } from '../ui/Icon';
import { Text } from '../ui/Text';
import { colors } from '../../theme/colors';

export type PinState = 'unvisited' | 'visited' | 'mastered';

type MapPinProps = {
  name: string;
  type: 'city' | 'landmark';
  iconName: IconName;
  stopCount: number;
  state: PinState;
  size?: number;
  delay?: number;
  onPress: () => void;
};

const PIN_COLORS = {
  city: {
    gradient: [colors.primary.wisteria, colors.primary.wisteriaDark] as const,
    glow: colors.primary.wisteria,
  },
  landmark: {
    gradient: [colors.reward.peach, colors.reward.peachDark] as const,
    glow: colors.reward.peach,
  },
};

const STATE_CONFIG = {
  unvisited: { opacity: 0.65, saturation: 0.7 },
  visited: { opacity: 1, saturation: 1 },
  mastered: { opacity: 1, saturation: 1 },
};

export const MapPin: React.FC<MapPinProps> = ({
  name,
  type,
  iconName,
  stopCount,
  state,
  size = 52,
  delay = 0,
  onPress,
}) => {
  const pinColors = PIN_COLORS[type];
  const stateConfig = STATE_CONFIG[state];

  // Breathing/pulse animation
  const breathe = useSharedValue(0);
  // Glow ring animation
  const glowPulse = useSharedValue(0);
  // Entrance animation
  const entrance = useSharedValue(0);
  // Press scale
  const pressScale = useSharedValue(1);
  // Mastered sparkle
  const sparkle = useSharedValue(0);

  useEffect(() => {
    // Entrance: spring-bounce pop-in
    entrance.value = withDelay(
      delay,
      withSpring(1, { damping: 8, stiffness: 180, mass: 0.8 }),
    );

    // Breathing animation
    breathe.value = withDelay(
      delay + 300,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
          withTiming(0, { duration: 2000, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
        ),
        -1,
        true,
      ),
    );

    // Glow ring pulse
    glowPulse.value = withDelay(
      delay + 200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );

    // Mastered sparkle
    if (state === 'mastered') {
      sparkle.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false,
      );
    }

    return () => {
      cancelAnimation(breathe);
      cancelAnimation(glowPulse);
      cancelAnimation(sparkle);
    };
  }, [delay, state]);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressScale.value = withSpring(1.15, { damping: 10, stiffness: 200 });
    })
    .onFinalize((_, success) => {
      pressScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      if (success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entrance.value, [0, 1], [0, stateConfig.opacity]),
    transform: [
      { scale: entrance.value * pressScale.value },
      { translateY: interpolate(breathe.value, [0, 1], [0, state === 'unvisited' ? -1.5 : -2.5]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.15, state === 'mastered' ? 0.5 : 0.3]),
    transform: [
      { scale: interpolate(glowPulse.value, [0, 1], [0.9, 1.15]) },
    ],
  }));

  const sparkleStyle = useAnimatedStyle(() => {
    if (state !== 'mastered') return { opacity: 0 };
    return {
      opacity: interpolate(sparkle.value, [0, 0.5, 1], [0.2, 0.6, 0.2]),
      transform: [
        { rotate: `${interpolate(sparkle.value, [0, 1], [0, 360])}deg` },
      ],
    };
  });

  const isMastered = state === 'mastered';
  const iconSize = Math.round(size * 0.4);
  const badgeSize = Math.round(size * 0.34);

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.container, { width: size + 16, minHeight: size + 22 }, containerStyle]}>
        {/* Glow ring */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: size + 12,
              height: size + 12,
              borderRadius: (size + 12) / 2,
              backgroundColor: isMastered ? colors.reward.gold : pinColors.glow,
            },
            glowStyle,
          ]}
        />

        {/* Mastered sparkle overlay */}
        {isMastered && (
          <Animated.View style={[styles.sparkleOverlay, sparkleStyle]}>
            <Text style={styles.sparkleChar}>✦</Text>
          </Animated.View>
        )}

        {/* Pin body */}
        <View
          style={[
            styles.pinBody,
            {
              width: size,
              height: size,
              borderRadius: size * 0.3,
              borderColor: isMastered ? colors.reward.gold : 'rgba(255,255,255,0.4)',
            },
          ]}
        >
          <LinearGradient
            colors={isMastered ? [colors.reward.gold, colors.reward.amber] : [...pinColors.gradient]}
            style={[StyleSheet.absoluteFill, { borderRadius: size * 0.3 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Icon backdrop circle */}
          <View style={[styles.iconBackdrop, { width: iconSize + 10, height: iconSize + 10, borderRadius: (iconSize + 10) / 2 }]}>
            <Icon name={iconName} size={iconSize} color="#FFF" />
          </View>
        </View>

        {/* Pin label (floating tag below) */}
        <View style={styles.labelWrap}>
          <View style={[styles.labelConnector, { backgroundColor: isMastered ? colors.reward.gold : pinColors.glow }]} />
          <View style={[styles.label, { backgroundColor: isMastered ? colors.reward.gold + '20' : 'rgba(255,255,255,0.92)' }]}>
            <Text style={[styles.labelText, isMastered && { color: colors.reward.amber }]} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>

        {/* Stop count badge */}
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              top: -2,
              right: (16 - badgeSize) / 2 + 2,
              backgroundColor: isMastered ? colors.reward.gold : colors.reward.amber,
            },
          ]}
        >
          <Text style={[styles.badgeText, { fontSize: Math.round(badgeSize * 0.55) }]}>{stopCount}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  glowRing: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
  },
  sparkleOverlay: {
    position: 'absolute',
    top: -10,
    right: 0,
    zIndex: 20,
  },
  sparkleChar: {
    fontSize: 12,
    color: colors.reward.gold,
  },
  pinBody: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 3px 12px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  iconBackdrop: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    alignItems: 'center',
    marginTop: -1,
  },
  labelConnector: {
    width: 2,
    height: 4,
    borderRadius: 1,
  },
  label: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  labelText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 9,
    color: colors.text.primary,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
      },
    }),
  },
  badgeText: {
    fontFamily: 'Nunito-Bold',
    color: '#FFF',
  },
});

export default MapPin;
