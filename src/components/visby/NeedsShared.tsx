import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { useStore } from '../../store/useStore';

export type NeedKey = 'hunger' | 'happiness' | 'knowledge' | 'energy';

export interface NeedInfo {
  key: NeedKey;
  icon: IconName;
  label: string;
  color: string;
  bgColor: string;
  hint: string;
  description: string;
  actions: { label: string; icon: IconName; screen: string; params?: object }[];
}

export const NEED_INFO: NeedInfo[] = [
  {
    key: 'hunger', icon: 'food', label: 'Food', color: colors.reward.peachDark, bgColor: colors.reward.peachLight,
    hint: 'Hungry!', description: 'Feed your Visby by discovering dishes from around the world. Try the Cooking Game too.',
    actions: [
      { label: 'Discover a Dish', icon: 'food', screen: 'AddBite' },
      { label: 'Cooking Game', icon: 'sparkles', screen: 'CookingGame' },
    ],
  },
  {
    key: 'happiness', icon: 'sparkles', label: 'Joy', color: colors.accent.coral, bgColor: colors.accent.blush,
    hint: 'Bored!', description: 'Explore countries, learn new things, and play mini-games — your Visby loves adventure!',
    actions: [
      { label: 'Explore a country', icon: 'globe', screen: 'Main', params: { screen: 'Explore', params: { screen: 'WorldMap' } } },
      { label: 'Treasure Hunt', icon: 'compass', screen: 'TreasureHunt' },
    ],
  },
  {
    key: 'knowledge', icon: 'book', label: 'Smarts', color: colors.primary.wisteriaDark, bgColor: colors.primary.wisteriaFaded,
    hint: 'Curious!', description: 'Teach your Visby by taking quizzes, completing lessons, and playing Word Match!',
    actions: [
      { label: 'Take a Quiz', icon: 'quiz', screen: 'Quiz' },
      { label: 'Word Match', icon: 'language', screen: 'WordMatch' },
    ],
  },
  {
    key: 'energy', icon: 'star', label: 'Energy', color: colors.calm.ocean, bgColor: colors.calm.skyLight,
    hint: 'Tired!', description: 'Your Visby rests when you check in each day. Come back tomorrow for more energy!',
    actions: [],
  },
];

function getNeedColor(val: number) {
  return val > 60 ? '#4CAF50' : val > 30 ? '#FF9800' : '#E74C3C';
}

export interface NeedsDisplayProps {
  activeHint: NeedKey | null;
  onTapNeed: (key: NeedKey) => void;
}

export const NeedsDisplay: React.FC<NeedsDisplayProps> = ({ activeHint, onTapNeed }) => {
  const getVisbyNeeds = useStore((s) => s.getVisbyNeeds);
  const needs = getVisbyNeeds();

  return (
    <View style={qaStyles.container}>
      {NEED_INFO.map((ni) => {
        const value = needs[ni.key] ?? 0;
        const isActive = activeHint === ni.key;
        return (
          <TouchableOpacity
            key={ni.key}
            style={[qaStyles.action, isActive && { opacity: 1 }]}
            onPress={() => onTapNeed(ni.key)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${ni.label}: ${value}%`}
          >
            <View style={[qaStyles.iconWrap, { backgroundColor: isActive ? ni.bgColor : 'rgba(184,165,224,0.12)' }]}>
              <Icon name={ni.icon} size={16} color={isActive ? ni.color : colors.primary.wisteriaDark} />
            </View>
            <View style={qaStyles.meterBg}>
              <View style={[qaStyles.meterFill, { width: `${value}%`, backgroundColor: getNeedColor(value) }]} />
            </View>
            <Text style={qaStyles.label}>{ni.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export interface CareHintCardProps {
  needKey: NeedKey;
  onAction: (screen: string, params?: object) => void;
  onDismiss: () => void;
}

export const CareHintCard: React.FC<CareHintCardProps> = ({ needKey, onAction, onDismiss }) => {
  const getVisbyNeeds = useStore((s) => s.getVisbyNeeds);
  const needs = getVisbyNeeds();
  const info = NEED_INFO.find((n) => n.key === needKey);
  if (!info) return null;
  const value = needs[needKey] ?? 0;
  const isLow = value < 30;

  return (
    <View style={[careStyles.card, { borderColor: info.bgColor }]}>
      <View style={careStyles.cardHeader}>
        <View style={[careStyles.iconCircle, { backgroundColor: info.bgColor }]}>
          <Icon name={info.icon} size={20} color={info.color} />
        </View>
        <View style={careStyles.cardHeaderText}>
          <Text style={[careStyles.cardTitle, { color: info.color }]}>
            {isLow ? `Your Visby is ${info.hint.replace('!', '')}!` : `${info.label}: ${value}%`}
          </Text>
          <Text style={careStyles.cardDesc}>{info.description}</Text>
        </View>
        <TouchableOpacity onPress={onDismiss} hitSlop={12} style={careStyles.dismissBtn}>
          <Icon name="close" size={16} color={colors.text.muted} />
        </TouchableOpacity>
      </View>
      {info.actions.length > 0 && (
        <View style={careStyles.actionsRow}>
          {info.actions.map((a) => (
            <TouchableOpacity
              key={a.screen}
              style={[careStyles.actionBtn, { backgroundColor: info.bgColor }]}
              onPress={() => onAction(a.screen, a.params)}
              activeOpacity={0.7}
            >
              <Icon name={a.icon} size={16} color={info.color} />
              <Text style={[careStyles.actionText, { color: info.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const qaStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 6, marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  action: { flex: 1, alignItems: 'center', gap: 3 },
  iconWrap: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  meterBg: { width: '100%', height: 3, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' },
  meterFill: { height: 3, borderRadius: 2 },
  label: { fontSize: 9, fontWeight: '600', color: colors.text.muted },
});

const careStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontWeight: '700', fontSize: 13, marginBottom: 2 },
  cardDesc: { fontSize: 12, color: colors.text.secondary, lineHeight: 17 },
  dismissBtn: { padding: 4 },
  actionsRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8, borderRadius: 12,
  },
  actionText: { fontWeight: '700', fontSize: 12 },
});
