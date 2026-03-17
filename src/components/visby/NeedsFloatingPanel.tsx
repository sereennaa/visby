import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { NeedsDisplay, CareHintCard, NEED_INFO, NeedKey } from './NeedsShared';
import { getShadowStyle } from '../../theme/shadows';

const PANEL_SHADOW = getShadowStyle({
  shadowColor: 'rgba(0,0,0,0.12)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 4,
});

function getNeedColor(val: number) {
  return val > 60 ? '#4CAF50' : val > 30 ? '#FF9800' : '#E74C3C';
}

interface NeedsFloatingPanelProps {
  onNavigateAway?: (screen: string, params?: object) => void;
}

export const NeedsFloatingPanel: React.FC<NeedsFloatingPanelProps> = ({ onNavigateAway }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeHint, setActiveHint] = useState<NeedKey | null>(null);
  const getVisbyNeeds = useStore((s) => s.getVisbyNeeds);
  const needs = getVisbyNeeds();

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
    if (expanded) setActiveHint(null);
  }, [expanded]);

  const handleTapNeed = useCallback((key: NeedKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveHint((prev) => (prev === key ? null : key));
  }, []);

  const handleCareAction = useCallback((screen: string, params?: object) => {
    setActiveHint(null);
    setExpanded(false);
    onNavigateAway?.(screen, params);
  }, [onNavigateAway]);

  const handleDismissHint = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveHint(null);
  }, []);

  const lowestNeed = NEED_INFO.reduce((low, ni) => {
    const val = needs[ni.key] ?? 100;
    return val < (needs[low.key] ?? 100) ? ni : low;
  }, NEED_INFO[0]);
  const lowestVal = needs[lowestNeed.key] ?? 100;

  if (!expanded) {
    return (
      <TouchableOpacity
        style={styles.collapsedContainer}
        onPress={toggle}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Visby's needs"
      >
        <View style={styles.collapsedDots}>
          {NEED_INFO.map((ni) => {
            const val = needs[ni.key] ?? 0;
            return (
              <View key={ni.key} style={styles.dotWrapper}>
                <View style={[styles.dotBg]}>
                  <View
                    style={[
                      styles.dotFill,
                      {
                        height: `${val}%`,
                        backgroundColor: getNeedColor(val),
                      },
                    ]}
                  />
                </View>
                <Icon name={ni.icon} size={10} color={ni.color} />
              </View>
            );
          })}
        </View>
        {lowestVal < 30 && (
          <Caption style={styles.collapsedHint}>{lowestNeed.hint}</Caption>
        )}
        <Icon name="chevronRight" size={12} color={colors.text.muted} style={styles.expandIcon} />
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      style={styles.expandedContainer}
    >
      <View style={styles.expandedHeader}>
        <Icon name="heart" size={14} color={colors.accent.coral} />
        <Text style={styles.expandedTitle}>Visby&apos;s Needs</Text>
        <TouchableOpacity onPress={toggle} hitSlop={12} style={styles.collapseBtn}>
          <Icon name="close" size={16} color={colors.text.muted} />
        </TouchableOpacity>
      </View>
      <NeedsDisplay activeHint={activeHint} onTapNeed={handleTapNeed} />
      {activeHint && (
        <CareHintCard
          needKey={activeHint}
          onAction={handleCareAction}
          onDismiss={handleDismissHint}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  collapsedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(184,165,224,0.2)',
    ...PANEL_SHADOW,
  },
  collapsedDots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dotWrapper: {
    alignItems: 'center',
    gap: 2,
  },
  dotBg: {
    width: 12,
    height: 18,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  dotFill: {
    width: '100%',
    borderRadius: 6,
  },
  collapsedHint: {
    fontSize: 10,
    color: colors.accent.coral,
    fontWeight: '600',
    marginLeft: 2,
  },
  expandIcon: {
    marginLeft: 2,
    transform: [{ rotate: '90deg' }],
  },
  expandedContainer: {
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(184,165,224,0.2)',
    ...PANEL_SHADOW,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  expandedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  collapseBtn: {
    padding: 4,
  },
});
