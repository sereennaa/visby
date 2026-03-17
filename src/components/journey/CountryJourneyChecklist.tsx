import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useStore } from '../../store/useStore';
import type { JourneyTier, JourneyAction } from '../../types';

const TIER_ORDER: JourneyTier[] = ['newcomer', 'explorer', 'adventurer', 'local', 'master'];
const TIER_LABELS: Record<JourneyTier, string> = {
  newcomer: 'Newcomer',
  explorer: 'Explorer',
  adventurer: 'Adventurer',
  local: 'Local',
  master: 'Master',
};
const TIER_ICONS: Record<JourneyTier, IconName> = {
  newcomer: 'compass',
  explorer: 'map',
  adventurer: 'star',
  local: 'home',
  master: 'crown',
};
const TIER_COLORS: Record<JourneyTier, string> = {
  newcomer: colors.calm.ocean,
  explorer: colors.primary.wisteria,
  adventurer: colors.reward.amber,
  local: '#50C878',
  master: colors.reward.gold,
};

const CATEGORY_ICONS: Record<JourneyAction['category'], IconName> = {
  facts: 'book',
  quiz: 'quiz',
  places: 'compass',
  games: 'game',
  dishes: 'food',
  treasure: 'sparkles',
};

const CATEGORY_LABELS: Record<JourneyAction['category'], string> = {
  facts: 'Facts',
  quiz: 'Quiz',
  places: 'Places',
  games: 'Games',
  dishes: 'Dishes',
  treasure: 'Treasure',
};

interface CountryJourneyChecklistProps {
  countryId: string;
  countryName: string;
  onNavigate?: (action: JourneyAction) => void;
}

export const CountryJourneyChecklist: React.FC<CountryJourneyChecklistProps> = ({
  countryId,
  countryName,
  onNavigate,
}) => {
  const getCountryJourneyProgress = useStore((s) => s.getCountryJourneyProgress);
  const progress = useMemo(() => getCountryJourneyProgress(countryId), [countryId, getCountryJourneyProgress]);

  const { done, total, tier, actions } = progress;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const currentTierIdx = TIER_ORDER.indexOf(tier);
  const nextTier = currentTierIdx < TIER_ORDER.length - 1 ? TIER_ORDER[currentTierIdx + 1] : null;

  const grouped = useMemo(() => {
    const map: Partial<Record<JourneyAction['category'], JourneyAction[]>> = {};
    for (const a of actions) {
      if (!map[a.category]) map[a.category] = [];
      map[a.category]!.push(a);
    }
    return map;
  }, [actions]);

  const categories: JourneyAction['category'][] = ['facts', 'quiz', 'games', 'places', 'dishes', 'treasure'];

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.container}>
      {/* Tier badge and progress */}
      <View style={styles.headerRow}>
        <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[tier] + '20', borderColor: TIER_COLORS[tier] + '40' }]}>
          <Icon name={TIER_ICONS[tier]} size={18} color={TIER_COLORS[tier]} />
          <Text style={[styles.tierText, { color: TIER_COLORS[tier] }]}>{TIER_LABELS[tier]}</Text>
        </View>
        <Caption>{done}/{total} complete</Caption>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: TIER_COLORS[tier] }]} />
        {TIER_ORDER.map((t, i) => {
          const pos = i === 0 ? 0 : i === TIER_ORDER.length - 1 ? 100 : [0, 20, 45, 75, 100][i];
          const reached = TIER_ORDER.indexOf(tier) >= i;
          return (
            <View key={t} style={[styles.tierDot, { left: `${pos}%`, backgroundColor: reached ? TIER_COLORS[t] : colors.text.light }]}>
              {reached && i <= currentTierIdx && <View style={styles.tierDotInner} />}
            </View>
          );
        })}
      </View>
      {nextTier && (
        <Caption style={styles.nextTierHint}>
          Next: {TIER_LABELS[nextTier]}
        </Caption>
      )}

      {/* Action groups */}
      {categories.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const catDone = items.filter((a) => a.done).length;
        return (
          <View key={cat} style={styles.group}>
            <View style={styles.groupHeader}>
              <Icon name={CATEGORY_ICONS[cat]} size={16} color={colors.text.secondary} />
              <Text style={styles.groupLabel}>{CATEGORY_LABELS[cat]}</Text>
              <Caption>{catDone}/{items.length}</Caption>
            </View>
            {items.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionRow}
                onPress={() => !action.done && onNavigate?.(action)}
                activeOpacity={action.done ? 1 : 0.7}
                disabled={action.done}
              >
                <View style={[styles.actionCheck, action.done && styles.actionCheckDone]}>
                  {action.done && <Icon name="check" size={10} color="#FFF" />}
                </View>
                <Text style={[styles.actionLabel, action.done && styles.actionLabelDone]} numberOfLines={1}>
                  {action.label}
                </Text>
                {!action.done && (
                  <Icon name="chevronRight" size={14} color={colors.text.light} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  tierText: { fontFamily: 'Nunito-Bold', fontSize: 13 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.journey.progressTrack,
    marginBottom: 4,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tierDot: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierDotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
  nextTierHint: {
    textAlign: 'right',
    marginBottom: spacing.sm,
    fontSize: 11,
  },
  group: {
    marginTop: spacing.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.journey.cardBorder,
  },
  groupLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.text.primary,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  actionCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.text.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCheckDone: {
    backgroundColor: colors.success.emerald,
    borderColor: colors.success.emerald,
  },
  actionLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.text.primary,
    flex: 1,
  },
  actionLabelDone: {
    color: colors.text.muted,
    textDecorationLine: 'line-through',
  },
});

export default CountryJourneyChecklist;
