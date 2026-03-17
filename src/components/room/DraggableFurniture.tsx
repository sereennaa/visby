import React, { useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';

const GRID_SNAP = 5;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SNAP) * GRID_SNAP;
}

function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

interface DraggableFurnitureProps {
  children: React.ReactNode;
  initialX: number;
  initialY: number;
  containerWidth: number;
  containerHeight: number;
  isEditMode: boolean;
  onPositionChange: (x: number, y: number) => void;
  onLongPress?: () => void;
  onTap?: () => void;
}

export const DraggableFurniture: React.FC<DraggableFurnitureProps> = ({
  children,
  initialX,
  initialY,
  containerWidth,
  containerHeight,
  isEditMode,
  onPositionChange,
  onLongPress,
  onTap,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const lastSnappedX = useSharedValue(-1);
  const lastSnappedY = useSharedValue(-1);

  const fireSnapHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleDragEnd = useCallback((finalX: number, finalY: number) => {
    const newXPercent = clamp(snapToGrid(((initialX / 100) * containerWidth + finalX) / containerWidth * 100), 5, 95);
    const newYPercent = clamp(snapToGrid(((initialY / 100) * containerHeight + finalY) / containerHeight * 100), 5, 95);
    onPositionChange(newXPercent, newYPercent);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [initialX, initialY, containerWidth, containerHeight, onPositionChange]);

  const panGesture = Gesture.Pan()
    .enabled(isEditMode)
    .minDistance(4)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.12, { damping: 10, stiffness: 200 });
      startX.value = translateX.value;
      startY.value = translateY.value;
      lastSnappedX.value = -1;
      lastSnappedY.value = -1;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;

      const currentXPct = Math.round(((initialX / 100) * containerWidth + translateX.value) / containerWidth * 100);
      const currentYPct = Math.round(((initialY / 100) * containerHeight + translateY.value) / containerHeight * 100);
      const snappedX = snapToGrid(currentXPct);
      const snappedY = snapToGrid(currentYPct);
      if (snappedX !== lastSnappedX.value || snappedY !== lastSnappedY.value) {
        lastSnappedX.value = snappedX;
        lastSnappedY.value = snappedY;
        runOnJS(fireSnapHaptic)();
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      scale.value = withSpring(1, { damping: 14, stiffness: 180 });
      runOnJS(handleDragEnd)(translateX.value, translateY.value);
      translateX.value = withSpring(0, { damping: 16, stiffness: 160 });
      translateY.value = withSpring(0, { damping: 16, stiffness: 160 });
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      if (onLongPress) runOnJS(onLongPress)();
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (onTap) runOnJS(onTap)();
    });

  const composed = Gesture.Race(panGesture, Gesture.Simultaneous(longPressGesture, tapGesture));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 100 : 1,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: isDragging.value
            ? '0px 8px 24px rgba(0,0,0,0.2)'
            : '0px 0px 0px rgba(0,0,0,0)',
        }
      : {
          shadowOpacity: isDragging.value ? 0.25 : 0,
          shadowRadius: isDragging.value ? 16 : 0,
          shadowOffset: { width: 0, height: isDragging.value ? 10 : 0 },
          shadowColor: '#000',
        }),
  }));

  if (!isEditMode) {
    return <View>{children}</View>;
  }

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        {children}
        <View style={styles.editIndicator}>
          <View style={styles.editDot} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

interface GridOverlayProps {
  width: number;
  height: number;
  visible: boolean;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ width, height, visible }) => {
  if (!visible) return null;

  const cols = Math.floor(100 / GRID_SNAP);
  const rows = Math.floor(100 / GRID_SNAP);

  return (
    <View style={[StyleSheet.absoluteFill, { width, height, pointerEvents: 'none' }]}>
      {Array.from({ length: cols + 1 }, (_, i) => {
        const isMajor = i % 2 === 0;
        return (
          <View
            key={`col-${i}`}
            style={{
              position: 'absolute',
              left: (i / cols) * width,
              top: 0,
              width: isMajor ? 1 : 0.5,
              height,
              backgroundColor: isMajor
                ? 'rgba(184, 165, 224, 0.18)'
                : 'rgba(184, 165, 224, 0.08)',
            }}
          />
        );
      })}
      {Array.from({ length: rows + 1 }, (_, i) => {
        const isMajor = i % 2 === 0;
        return (
          <View
            key={`row-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              top: (i / rows) * height,
              width,
              height: isMajor ? 1 : 0.5,
              backgroundColor: isMajor
                ? 'rgba(184, 165, 224, 0.18)'
                : 'rgba(184, 165, 224, 0.08)',
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  editIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary.wisteria,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
