import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { jpIllustrations } from './jp';
import { frIllustrations } from './fr';
import { mxIllustrations } from './mx';
import { itIllustrations } from './it';
import { gbIllustrations } from './gb';
import { brIllustrations } from './br';
import { krIllustrations } from './kr';
import { thIllustrations } from './th';
import { maIllustrations } from './ma';
import { peIllustrations } from './pe';
import { keIllustrations } from './ke';
import { noIllustrations } from './no';
import { trIllustrations } from './tr';
import { grIllustrations } from './gr';

const ALL_ILLUSTRATIONS: Record<string, React.FC<{ size?: number }>> = {
  ...jpIllustrations,
  ...frIllustrations,
  ...mxIllustrations,
  ...itIllustrations,
  ...gbIllustrations,
  ...brIllustrations,
  ...krIllustrations,
  ...thIllustrations,
  ...maIllustrations,
  ...peIllustrations,
  ...keIllustrations,
  ...noIllustrations,
  ...trIllustrations,
  ...grIllustrations,
};

export function getObjectIllustration(objectId: string): React.FC<{ size?: number }> | null {
  return ALL_ILLUSTRATIONS[objectId] ?? null;
}

interface RoomObjectIllustrationProps {
  objectId: string;
  size?: number;
  animated?: boolean;
  interactive?: boolean;
  discovered?: boolean;
}

export const RoomObjectIllustration: React.FC<RoomObjectIllustrationProps> = React.memo(({
  objectId,
  size = 56,
  animated = true,
  interactive = false,
  discovered = false,
}) => {
  const Illustration = ALL_ILLUSTRATIONS[objectId];
  const bob = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    bob.value = withRepeat(
      withSequence(
        withTiming(-1.5, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.5, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [animated]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  if (!Illustration) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.illustrationWrap, animated && bobStyle]}>
        {interactive && !discovered && <View style={[styles.glowRing, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2 }]} />}
        <Illustration size={size} />
      </Animated.View>
      {discovered && (
        <View style={styles.checkBadge}>
          <View style={styles.checkInner} />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  checkInner: {
    width: 6,
    height: 3,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }, { translateY: -0.5 }],
  },
});
