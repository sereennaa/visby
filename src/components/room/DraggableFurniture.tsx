import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const GRID_SNAP = 10;

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
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const handleDragEnd = useCallback((finalX: number, finalY: number) => {
    const newXPercent = clamp(snapToGrid(((initialX / 100) * containerWidth + finalX) / containerWidth * 100), 5, 95);
    const newYPercent = clamp(snapToGrid(((initialY / 100) * containerHeight + finalY) / containerHeight * 100), 5, 95);
    onPositionChange(newXPercent, newYPercent);
  }, [initialX, initialY, containerWidth, containerHeight, onPositionChange]);

  const panGesture = Gesture.Pan()
    .enabled(isEditMode)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.1, { damping: 12 });
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      scale.value = withSpring(1, { damping: 12 });
      runOnJS(handleDragEnd)(translateX.value, translateY.value);
      translateX.value = withSpring(0, { damping: 14 });
      translateY.value = withSpring(0, { damping: 14 });
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      if (onLongPress) runOnJS(onLongPress)();
    });

  const composed = Gesture.Race(panGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 100 : 1,
    shadowOpacity: isDragging.value ? 0.25 : 0,
    shadowRadius: isDragging.value ? 12 : 0,
    shadowOffset: { width: 0, height: isDragging.value ? 8 : 0 },
    shadowColor: '#000',
  }));

  if (!isEditMode) {
    return <View>{children}</View>;
  }

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        {children}
        {isEditMode && (
          <View style={styles.editIndicator}>
            <View style={styles.editDot} />
          </View>
        )}
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
      {Array.from({ length: cols + 1 }, (_, i) => (
        <View
          key={`col-${i}`}
          style={{
            position: 'absolute',
            left: (i / cols) * width,
            top: 0,
            width: 1,
            height,
            backgroundColor: 'rgba(184, 165, 224, 0.1)',
          }}
        />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <View
          key={`row-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            top: (i / rows) * height,
            width,
            height: 1,
            backgroundColor: 'rgba(184, 165, 224, 0.1)',
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  editIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(184, 165, 224, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
