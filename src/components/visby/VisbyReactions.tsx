import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text } from '../ui/Text';

export type ReactionTrigger =
  | 'purchase_cosmetic'
  | 'purchase_furniture'
  | 'enter_home'
  | 'decorate_room'
  | 'feed'
  | 'play'
  | 'study'
  | 'rest'
  | 'gift'
  | 'milestone';

const REACTION_MESSAGES: Record<ReactionTrigger, string[]> = {
  purchase_cosmetic: [
    'Wow, I love my new look!',
    'This is so cool! Thank you!',
    "I can't wait to show this off!",
  ],
  purchase_furniture: [
    'This is perfect for our home!',
    "Ooh, I love where this is going!",
    'Our room is looking amazing!',
  ],
  enter_home: [
    'Welcome home!',
    "I missed you! Let's hang out!",
    'Home sweet home!',
  ],
  decorate_room: [
    "Ooh, that looks great there!",
    "You're such a good decorator!",
    'I love the vibe!',
  ],
  feed: ['Yummy! This is delicious!', 'Nom nom nom... so good!', 'Thank you for the food!'],
  play: ['Woohoo! So much fun!', "Let's play more!", 'That was awesome!'],
  study: ['I learned something new!', 'Knowledge is power!', 'Ooh, fascinating!'],
  rest: ['Zzz... so comfy...', 'A little nap feels nice...', 'Sweet dreams!'],
  gift: ['You\'re the best!', 'I love presents!', 'This is amazing, thank you!'],
  milestone: ['We did it together!', "Look how far we've come!", "I'm so proud of us!"],
};

interface VisbyReactionsProps {
  trigger: ReactionTrigger | null;
  customMessage?: string;
  onComplete?: () => void;
}

export const VisbyReactions: React.FC<VisbyReactionsProps> = ({ trigger, customMessage, onComplete }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!trigger) return;
    const messages = REACTION_MESSAGES[trigger];
    const text = customMessage || messages[Math.floor(Math.random() * messages.length)];
    setMessage(text);
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2500);
    return () => clearTimeout(timer);
  }, [trigger, customMessage]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <View style={styles.bubble}>
        <View style={styles.bubbleTail} />
        <Text variant="body" style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  bubble: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: 240,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }),
    position: 'relative',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    left: '50%' as unknown as number,
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  text: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
