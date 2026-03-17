import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { Icon } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { getShadowStyle } from '../../theme/shadows';

const FAB_SIZE = 56;

const FAB_SHADOW = getShadowStyle({
  shadowColor: 'rgba(0,0,0,0.2)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 6,
});

interface ChatFABProps {
  onPress: () => void;
}

export const ChatFAB: React.FC<ChatFABProps> = ({ onPress }) => {
  const visby = useStore((s) => s.visby);
  const visbyMood = useStore((s) => s.getVisbyMood());
  const defaultAppearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const bounce = useSharedValue(0);
  React.useEffect(() => {
    bounce.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 600 }),
          withTiming(0, { duration: 600 }),
        ),
        3,
        true,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <Animated.View style={[styles.fabWrapper, animStyle]}>
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Chat with Visby"
      >
        <View style={styles.avatarWrap}>
          <VisbyCharacter
            appearance={defaultAppearance}
            equipped={visby?.equipped}
            mood={visbyMood as any}
            size={36}
            animated={false}
          />
        </View>
        <View style={styles.chatBadge}>
          <Icon name="chat" size={12} color={colors.text.inverse} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    zIndex: 100,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary.wisteria,
    ...FAB_SHADOW,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary.wisteria,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.base.cream,
  },
});
