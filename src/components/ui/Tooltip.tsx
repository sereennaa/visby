import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Caption } from './Text';
import { useStore } from '../../store/useStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ARROW_SIZE = 8;

interface TooltipProps {
  id: string;
  text: string;
  position?: 'above' | 'below';
  onDismiss?: () => void;
}

export const Tooltip: React.FC<TooltipProps> = ({
  id,
  text,
  position = 'below',
  onDismiss,
}) => {
  const shownTooltips = useStore((s) => s.shownTooltips);
  const alreadyShown = shownTooltips.includes(id);

  const anchorRef = useRef<View>(null);
  const [measured, setMeasured] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [visible, setVisible] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(position === 'below' ? -8 : 8);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (alreadyShown) return;
    const timer = setTimeout(() => {
      anchorRef.current?.measureInWindow((x, y, w, h) => {
        if (typeof x === 'number' && typeof y === 'number') {
          setMeasured({ x, y, w, h });
          setVisible(true);
        }
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [alreadyShown]);

  useEffect(() => {
    if (!visible) return;
    opacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(200, withSpring(0, { damping: 12, stiffness: 120 }));
    scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 120 }));
  }, [visible]);

  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.9, { duration: 200 });
    setTimeout(() => {
      setVisible(false);
      useStore.setState((s) => ({
        shownTooltips: [...s.shownTooltips, id],
      }));
      onDismiss?.();
    }, 220);
  }, [id, onDismiss]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (alreadyShown) return <View ref={anchorRef} style={styles.anchor} />;

  const bubbleTop = measured
    ? position === 'below'
      ? measured.y + measured.h + ARROW_SIZE + 4
      : measured.y - ARROW_SIZE - 4
    : 0;

  const bubbleLeft = measured
    ? Math.max(12, Math.min(measured.x + measured.w / 2 - 120, SCREEN_WIDTH - 252))
    : 12;

  const arrowLeft = measured
    ? Math.max(20, Math.min(measured.x + measured.w / 2 - bubbleLeft - ARROW_SIZE, 240 - ARROW_SIZE * 2 - 8))
    : 100;

  return (
    <>
      <View ref={anchorRef} style={styles.anchor} collapsable={false} />
      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleDismiss}>
          <Animated.View
            style={[
              styles.bubbleAbsolute,
              { top: bubbleTop, left: bubbleLeft },
              position === 'above' && { transform: [{ translateY: -60 }] },
              animStyle,
            ]}
          >
            <View style={styles.bubble}>
              <View
                style={[
                  styles.arrow,
                  position === 'below' ? styles.arrowAbove : styles.arrowBelow,
                  { left: arrowLeft },
                ]}
              />
              <Text variant="bodySmall" style={styles.text}>{text}</Text>
              <Caption style={styles.dismiss}>Got it</Caption>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  modalOverlay: {
    flex: 1,
  },
  bubbleAbsolute: {
    position: 'absolute',
    zIndex: 100,
  },
  bubble: {
    backgroundColor: colors.primary.wisteriaDark,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    maxWidth: 240,
    minWidth: 160,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowAbove: {
    top: -ARROW_SIZE,
    borderBottomWidth: ARROW_SIZE,
    borderBottomColor: colors.primary.wisteriaDark,
  },
  arrowBelow: {
    bottom: -ARROW_SIZE,
    borderTopWidth: ARROW_SIZE,
    borderTopColor: colors.primary.wisteriaDark,
  },
  text: {
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: 18,
  },
  dismiss: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontSize: 11,
  },
});
