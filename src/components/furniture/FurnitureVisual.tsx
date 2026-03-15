import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Icon, IconName } from '../ui/Icon';
import type { FurnitureInteractionType } from '../../types';
import { colors } from '../../theme/colors';

type Size = 'small' | 'medium' | 'large';

interface FurnitureVisualProps {
  /** Table, stove, bed, bookshelf, toy — renders as a recognizable piece of furniture */
  interactionType: FurnitureInteractionType;
  /** Fallback icon name when no shape is drawn */
  icon?: IconName;
  /** Size of the visual */
  size?: Size;
  /** Optional style override */
  style?: ViewStyle;
  /** Show a small "use" hint (plate, flame, etc.) on the furniture */
  showHint?: boolean;
}

const SIZES: Record<Size, { w: number; h: number }> = {
  small: { w: 36, h: 28 },
  medium: { w: 52, h: 40 },
  large: { w: 64, h: 48 },
};

export const FurnitureVisual: React.FC<FurnitureVisualProps> = ({
  interactionType,
  icon = 'home',
  size = 'medium',
  style,
  showHint = true,
}) => {
  const { w, h } = SIZES[size];
  const isWide = interactionType === 'table' || interactionType === 'bed';
  const boxW = isWide ? w * 1.4 : w;
  const boxH = h;

  const containerStyle: ViewStyle = {
    width: boxW,
    height: boxH,
    alignItems: 'center',
    justifyContent: 'flex-end',
  };

  return (
    <View style={[styles.outer, containerStyle, style]}>
      {interactionType === 'table' && (
        <>
          <View style={[styles.tableTop, { width: boxW * 0.95, height: boxH * 0.35 }]} />
          <View style={[styles.tableLegs, { width: boxW * 0.95 }]}>
            <View style={styles.leg} />
            <View style={styles.leg} />
          </View>
          {showHint && (
            <View style={styles.tablePlate}>
              <Icon name="food" size={Math.min(14, boxW * 0.22)} color={colors.text.secondary} />
            </View>
          )}
        </>
      )}
      {interactionType === 'stove' && (
        <>
          <View style={[styles.stoveBody, { width: boxW * 0.9, height: boxH * 0.75 }]}>
            <View style={styles.burnerRow}>
              <View style={[styles.burner, { width: boxW * 0.2, height: boxW * 0.2 }]} />
              <View style={[styles.burner, { width: boxW * 0.2, height: boxW * 0.2 }]} />
            </View>
            {showHint && (
              <View style={styles.stoveFlame}>
                <Icon name="flame" size={Math.min(14, boxW * 0.28)} color={colors.reward.peachDark} />
              </View>
            )}
          </View>
        </>
      )}
      {interactionType === 'bed' && (
        <>
          <View style={[styles.mattress, { width: boxW * 0.95, height: boxH * 0.5 }]} />
          <View style={[styles.pillow, { width: boxW * 0.3, height: boxH * 0.2 }]} />
        </>
      )}
      {interactionType === 'bookshelf' && (
        <>
          <View style={[styles.shelfBody, { width: boxW * 0.85, height: boxH * 0.9 }]}>
            <View style={[styles.shelfLine, { top: boxH * 0.9 * 0.25 }]} />
            <View style={[styles.shelfLine, { top: boxH * 0.9 * 0.5 }]} />
            <View style={[styles.shelfLine, { top: boxH * 0.9 * 0.75 }]} />
          </View>
          {showHint && (
            <View style={styles.shelfBook}>
              <Icon name="book" size={Math.min(12, boxW * 0.22)} color={colors.primary.wisteriaDark} />
            </View>
          )}
        </>
      )}
      {interactionType === 'toy' && (
        <>
          <View style={[styles.toyBox, { width: boxW * 0.9, height: boxH * 0.7 }]} />
          {showHint && (
            <View style={styles.toyStar}>
              <Icon name="sparkles" size={Math.min(14, boxW * 0.28)} color={colors.reward.gold} />
            </View>
          )}
        </>
      )}
      {!['table', 'stove', 'bed', 'bookshelf', 'toy'].includes(interactionType) && (
        <View style={[styles.fallback, { width: boxW, height: boxH }]}>
          <Icon name={icon as IconName} size={Math.min(24, boxW * 0.5)} color={colors.text.primary} />
        </View>
      )}
    </View>
  );
};

const wood = { main: '#C8A882', dark: '#B89870', leg: '#8B7355' };
const metal = { main: '#9CA3AF', dark: '#6B7280' };
const fabric = { mattress: '#E8DCC8', pillow: '#F5F0E8', border: '#D4C4B0' };

const styles = StyleSheet.create({
  outer: {
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tableTop: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    alignSelf: 'center',
    backgroundColor: wood.main,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: wood.dark,
  },
  tableLegs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  leg: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: wood.leg,
  },
  tablePlate: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.shadow.light,
  },
  stoveBody: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: metal.main,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: metal.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burnerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  burner: {
    borderRadius: 999,
    backgroundColor: metal.dark,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  stoveFlame: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
  },
  mattress: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: fabric.mattress,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: fabric.border,
  },
  pillow: {
    position: 'absolute',
    top: 4,
    left: 6,
    backgroundColor: fabric.pillow,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: fabric.border,
  },
  shelfBody: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: wood.dark,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: wood.leg,
    paddingHorizontal: 4,
  },
  shelfLine: {
    position: 'absolute',
    left: 6,
    right: 6,
    height: 2,
    backgroundColor: wood.leg,
  },
  shelfBook: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
  },
  toyBox: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: wood.main,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: wood.dark,
  },
  toyStar: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
  },
  fallback: {
    backgroundColor: colors.surface.cardWarm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FurnitureVisual;
