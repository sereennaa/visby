import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Platform, GestureResponderEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Icon } from './Icon';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { speechService, LANGUAGE_NAME_TO_CODE } from '../../services/audio';
import { useStore } from '../../store/useStore';

interface SpeakerButtonProps {
  text: string;
  countryId?: string;
  languageCode?: string;
  languageName?: string;
  size?: number;
  color?: string;
  compact?: boolean;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  countryId,
  languageCode,
  languageName,
  size = 18,
  color = colors.primary.wisteriaDark,
  compact = false,
}) => {
  const readAloud = useStore(
    (s) => (s.settings as { readAloud?: boolean }).readAloud ?? true,
  );
  const [speaking, setSpeaking] = useState(false);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const startPulse = useCallback(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 500 }),
        withTiming(0.95, { duration: 500 }),
      ),
      -1,
      true,
    );
  }, [scale]);

  const stopPulse = useCallback(() => {
    cancelAnimation(scale);
    scale.value = withTiming(1, { duration: 150 });
  }, [scale]);

  const handlePress = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    if (speaking) {
      speechService.stop();
      setSpeaking(false);
      stopPulse();
      return;
    }

    setSpeaking(true);
    startPulse();

    const onDone = () => {
      setSpeaking(false);
      stopPulse();
    };

    const code =
      languageCode ??
      (languageName ? LANGUAGE_NAME_TO_CODE[languageName] : undefined);

    if (code) {
      speechService.speakWord(text, code, onDone);
    } else {
      speechService.speak(text, countryId, onDone);
    }
  }, [text, countryId, languageCode, languageName, speaking, startPulse, stopPulse]);

  if (!readAloud) return null;

  if (compact) {
    return (
      <Animated.View style={animStyle}>
        <Pressable
          onPress={handlePress}
          style={[styles.compactButton, speaking && styles.compactButtonActive]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Listen to pronunciation"
        >
          <Icon
            name={speaking ? 'volumeOff' : 'volumeHigh'}
            size={size}
            color={speaking ? colors.primary.wisteria : color}
          />
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        style={[styles.pillButton, speaking && styles.pillButtonActive]}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        accessibilityRole="button"
        accessibilityLabel="Listen to pronunciation"
      >
        <Icon
          name={speaking ? 'volumeOff' : 'volumeHigh'}
          size={size}
          color={speaking ? colors.primary.wisteria : color}
        />
        <Text
          variant="bodySmall"
          color={speaking ? colors.primary.wisteria : color}
          style={styles.label}
        >
          {speaking ? 'Stop' : 'Listen'}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  compactButton: {
    padding: 5,
    borderRadius: 14,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactButtonActive: {
    backgroundColor: colors.primary.wisteriaLight,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  pillButtonActive: {
    backgroundColor: colors.primary.wisteriaLight,
  },
  label: {
    fontWeight: '600',
  },
});
