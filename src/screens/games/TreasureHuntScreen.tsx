import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';

interface HuntItem {
  id: string;
  name: string;
  icon: IconName;
  x: number;
  y: number;
}

interface DecorItem {
  icon: IconName;
  x: number;
  y: number;
  size: number;
}

interface TreasureHunt {
  theme: string;
  bgColor: string;
  accentColor: string;
  items: HuntItem[];
  decor: DecorItem[];
}

const TREASURE_HUNTS: TreasureHunt[] = [
  {
    theme: 'Japan',
    bgColor: '#FFF0E0',
    accentColor: '#FF6B6B',
    items: [
      { id: 'fan', name: 'Paper Fan', icon: 'culture', x: 15, y: 30 },
      { id: 'origami', name: 'Origami Crane', icon: 'star', x: 72, y: 55 },
      { id: 'lantern', name: 'Paper Lantern', icon: 'flame', x: 45, y: 12 },
      { id: 'chopsticks', name: 'Chopsticks', icon: 'food', x: 85, y: 70 },
      { id: 'bonsai', name: 'Bonsai Tree', icon: 'nature', x: 30, y: 78 },
    ],
    decor: [
      { icon: 'temple', x: 50, y: 5, size: 30 },
      { icon: 'nature', x: 10, y: 60, size: 20 },
      { icon: 'cafe', x: 80, y: 25, size: 16 },
    ],
  },
  {
    theme: 'France',
    bgColor: '#F0F0FF',
    accentColor: '#6B6BFF',
    items: [
      { id: 'baguette', name: 'Baguette', icon: 'food', x: 20, y: 45 },
      { id: 'beret', name: 'Beret', icon: 'crown', x: 65, y: 20 },
      { id: 'croissant', name: 'Croissant', icon: 'food', x: 80, y: 65 },
      { id: 'perfume', name: 'Perfume Bottle', icon: 'sparkles', x: 40, y: 75 },
      { id: 'painting', name: 'Painting', icon: 'edit', x: 55, y: 10 },
    ],
    decor: [
      { icon: 'landmark', x: 50, y: 8, size: 28 },
      { icon: 'cafe', x: 15, y: 70, size: 18 },
      { icon: 'nature', x: 85, y: 40, size: 20 },
    ],
  },
  {
    theme: 'Mexico',
    bgColor: '#FFF5E0',
    accentColor: '#FF9F43',
    items: [
      { id: 'sombrero', name: 'Sombrero', icon: 'crown', x: 25, y: 15 },
      { id: 'maracas', name: 'Maracas', icon: 'sparkles', x: 70, y: 40 },
      { id: 'cactus', name: 'Cactus', icon: 'nature', x: 85, y: 75 },
      { id: 'taco', name: 'Taco', icon: 'food', x: 40, y: 60 },
      { id: 'guitar', name: 'Guitar', icon: 'sparkles', x: 15, y: 55 },
    ],
    decor: [
      { icon: 'monument', x: 50, y: 5, size: 26 },
      { icon: 'nature', x: 90, y: 30, size: 18 },
    ],
  },
  {
    theme: 'Egypt',
    bgColor: '#FFF8E0',
    accentColor: '#D4A843',
    items: [
      { id: 'scarab', name: 'Scarab Beetle', icon: 'star', x: 30, y: 50 },
      { id: 'scroll', name: 'Papyrus Scroll', icon: 'book', x: 75, y: 30 },
      { id: 'ankh', name: 'Ankh Symbol', icon: 'culture', x: 50, y: 70 },
      { id: 'cat', name: 'Cat Statue', icon: 'star', x: 15, y: 65 },
      { id: 'vase', name: 'Clay Vase', icon: 'home', x: 85, y: 55 },
    ],
    decor: [
      { icon: 'landmark', x: 50, y: 5, size: 30 },
      { icon: 'nature', x: 20, y: 25, size: 18 },
    ],
  },
  {
    theme: 'India',
    bgColor: '#FFF0F5',
    accentColor: '#E07B8A',
    items: [
      { id: 'elephant', name: 'Elephant Figure', icon: 'star', x: 20, y: 40 },
      { id: 'spices', name: 'Spice Jar', icon: 'food', x: 75, y: 60 },
      { id: 'sitar', name: 'Sitar', icon: 'sparkles', x: 40, y: 25 },
      { id: 'lotus', name: 'Lotus Flower', icon: 'nature', x: 60, y: 75 },
      { id: 'diya', name: 'Diya Lamp', icon: 'flame', x: 85, y: 20 },
    ],
    decor: [
      { icon: 'temple', x: 50, y: 5, size: 28 },
      { icon: 'culture', x: 10, y: 70, size: 18 },
    ],
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ROOM_HORIZONTAL_PADDING = spacing.screenPadding;
const ROOM_WIDTH = SCREEN_WIDTH - ROOM_HORIZONTAL_PADDING * 2;
const ROOM_HEIGHT = ROOM_WIDTH * 0.85;
const AURA_PER_ITEM = 8;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface FoundItemGlowProps {
  accentColor: string;
}

const FoundItemGlow: React.FC<FoundItemGlowProps> = ({ accentColor }) => {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 1.5 - pulseScale.value,
  }));

  return (
    <Animated.View
      style={[
        styles.glowRing,
        { backgroundColor: accentColor },
        animatedStyle,
      ]}
    />
  );
};

type TreasureHuntScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TreasureHunt'>;
  route: RouteProp<RootStackParamList, 'TreasureHunt'>;
};

export const TreasureHuntScreen: React.FC<TreasureHuntScreenProps> = ({ navigation }) => {
  const { addAura, playWithVisby } = useStore();

  const [huntIndex, setHuntIndex] = useState(() => Math.floor(Math.random() * TREASURE_HUNTS.length));
  const hunt = TREASURE_HUNTS[huntIndex];

  const [foundItems, setFoundItems] = useState<Set<string>>(new Set());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [gamePhase, setGamePhase] = useState<'playing' | 'complete'>('playing');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gamePhase === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, huntIndex]);

  const handleItemFound = useCallback(
    (itemId: string) => {
      if (gamePhase !== 'playing') return;
      if (foundItems.has(itemId)) return;

      const next = new Set(foundItems);
      next.add(itemId);
      setFoundItems(next);

      if (next.size >= hunt.items.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        const totalAura = hunt.items.length * AURA_PER_ITEM;
        setTimeout(() => {
          setGamePhase('complete');
          addAura(totalAura);
          playWithVisby();
        }, 500);
      }
    },
    [gamePhase, foundItems, hunt, addAura, playWithVisby],
  );

  const handlePlayAgain = () => {
    const newIndex = (huntIndex + 1) % TREASURE_HUNTS.length;
    setHuntIndex(newIndex);
    setFoundItems(new Set());
    setElapsedSeconds(0);
    setGamePhase('playing');
  };

  const totalAura = hunt.items.length * AURA_PER_ITEM;

  if (gamePhase === 'complete') {
    return (
      <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Animated.View entering={ZoomIn.delay(200).duration(400)}>
                  <Icon name="trophy" size={64} color={colors.reward.gold} />
                </Animated.View>

                <Heading level={1} style={styles.resultsTitle}>
                  All Found!
                </Heading>

                <Text variant="body" color={colors.text.secondary} style={styles.resultsSubtitle}>
                  You explored {hunt.theme} and found every treasure
                </Text>

                <View style={styles.resultsDivider} />

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Icon name="time" size={20} color={colors.calm.ocean} />
                    <Text variant="h3" color={colors.calm.ocean}>
                      {formatTime(elapsedSeconds)}
                    </Text>
                    <Caption>Time</Caption>
                  </View>
                  <View style={styles.statDividerVertical} />
                  <View style={styles.statItem}>
                    <Icon name="sparkles" size={20} color={colors.reward.gold} />
                    <Text variant="h3" color={colors.reward.amber}>
                      +{totalAura}
                    </Text>
                    <Caption>Aura</Caption>
                  </View>
                </View>

                <View style={styles.foundItemsList}>
                  {hunt.items.map((item, i) => (
                    <Animated.View
                      key={item.id}
                      entering={FadeInUp.delay(300 + i * 100).duration(300)}
                      style={[styles.foundListChip, { borderColor: hunt.accentColor + '40' }]}
                    >
                      <Icon name={item.icon} size={14} color={hunt.accentColor} />
                      <Text variant="bodySmall" color={colors.text.secondary}>
                        {item.name}
                      </Text>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </Card>

            <Button
              title="Explore Another Room"
              onPress={handlePlayAgain}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="lg"
              fullWidth
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: hunt.bgColor }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Heading level={2}>{hunt.theme}</Heading>
          </View>

          <View style={styles.timerBadge}>
            <Icon name="time" size={16} color={colors.calm.ocean} />
            <Text variant="bodySmall" color={colors.calm.ocean} style={styles.timerText}>
              {formatTime(elapsedSeconds)}
            </Text>
          </View>
        </View>

        {/* Hint Bar */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hintBar}>
          <Caption style={styles.hintBarLabel}>Find these items:</Caption>
          <View style={styles.hintItemsRow}>
            {hunt.items.map((item) => {
              const isFound = foundItems.has(item.id);
              return (
                <View key={item.id} style={styles.hintItem}>
                  <View
                    style={[
                      styles.hintCircle,
                      {
                        backgroundColor: isFound ? hunt.accentColor + '20' : 'rgba(0,0,0,0.04)',
                        borderColor: isFound ? hunt.accentColor : 'rgba(0,0,0,0.08)',
                      },
                    ]}
                  >
                    {isFound ? (
                      <Icon name="check" size={16} color={hunt.accentColor} />
                    ) : (
                      <Icon name={item.icon} size={16} color={colors.text.muted} />
                    )}
                  </View>
                  <Text
                    variant="caption"
                    color={isFound ? hunt.accentColor : colors.text.muted}
                    align="center"
                    numberOfLines={1}
                    style={styles.hintItemName}
                  >
                    {item.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Progress */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(foundItems.size / hunt.items.length) * 100}%`,
                  backgroundColor: hunt.accentColor,
                },
              ]}
            />
          </View>
          <Caption>
            {foundItems.size}/{hunt.items.length}
          </Caption>
        </View>

        {/* Room Scene */}
        <View style={styles.roomContainer}>
          <View style={[styles.room, { backgroundColor: hunt.bgColor }]}>
            {/* Border / frame */}
            <View style={[styles.roomBorder, { borderColor: hunt.accentColor + '30' }]} />

            {/* Decor (background, faded) */}
            {hunt.decor.map((d, i) => (
              <View
                key={`decor-${i}`}
                style={[
                  styles.decorItem,
                  {
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                  },
                ]}
              >
                <Icon name={d.icon} size={d.size} color={hunt.accentColor + '18'} />
              </View>
            ))}

            {/* Hidden Items */}
            {hunt.items.map((item) => {
              const isFound = foundItems.has(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleItemFound(item.id)}
                  disabled={isFound}
                  activeOpacity={0.7}
                  style={[
                    styles.hiddenItem,
                    {
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                    },
                  ]}
                  accessibilityLabel={`Hidden item: ${item.name}`}
                  accessibilityRole="button"
                >
                  {isFound && <FoundItemGlow accentColor={hunt.accentColor} />}
                  <Animated.View
                    style={[
                      styles.hiddenItemInner,
                      {
                        backgroundColor: isFound
                          ? hunt.accentColor + '20'
                          : hunt.bgColor,
                        borderColor: isFound ? hunt.accentColor : hunt.bgColor,
                        borderWidth: isFound ? 2 : 0,
                      },
                    ]}
                    {...(isFound && { entering: ZoomIn.duration(300) })}
                  >
                    <Icon
                      name={item.icon}
                      size={22}
                      color={
                        isFound
                          ? hunt.accentColor
                          : blendWithBg(hunt.bgColor, 0.35)
                      }
                    />
                  </Animated.View>
                  {isFound && (
                    <Animated.View
                      entering={FadeInUp.delay(150).duration(200)}
                      style={styles.foundLabel}
                    >
                      <Text
                        variant="caption"
                        color={hunt.accentColor}
                        style={styles.foundLabelText}
                      >
                        {item.name}
                      </Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

/**
 * Darkens a hex color to make hidden items slightly visible but camouflaged.
 * `factor` 0 = fully transparent, 1 = fully opaque difference.
 */
function blendWithBg(hexBg: string, factor: number): string {
  const r = parseInt(hexBg.slice(1, 3), 16);
  const g = parseInt(hexBg.slice(3, 5), 16);
  const b = parseInt(hexBg.slice(5, 7), 16);
  const darken = (c: number) => Math.round(c * (1 - factor * 0.5));
  return `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: spacing.radius.round,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  timerText: {
    fontFamily: 'Nunito-Bold',
    minWidth: 36,
  },
  hintBar: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  hintBarLabel: {
    marginBottom: spacing.xs,
  },
  hintItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hintItem: {
    alignItems: 'center',
    flex: 1,
  },
  hintCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: spacing.xxs,
  },
  hintItemName: {
    fontSize: 9,
    fontFamily: 'Nunito-Regular',
    maxWidth: 56,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: spacing.radius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: spacing.radius.round,
  },
  roomContainer: {
    flex: 1,
    paddingHorizontal: ROOM_HORIZONTAL_PADDING,
    paddingBottom: spacing.lg,
  },
  room: {
    flex: 1,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  roomBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: spacing.radius.xl,
    borderWidth: 2,
    zIndex: 0,
  },
  decorItem: {
    position: 'absolute',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    zIndex: 1,
  },
  hiddenItem: {
    position: 'absolute',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    alignItems: 'center',
    zIndex: 10,
  },
  hiddenItemInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.3,
  },
  foundLabel: {
    position: 'absolute',
    bottom: -16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
  },
  foundLabelText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 9,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.lg,
  },
  resultsCard: {
    paddingVertical: spacing.xxxl,
  },
  resultsContent: {
    alignItems: 'center',
  },
  resultsTitle: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultsSubtitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resultsDivider: {
    width: 80,
    height: 2,
    backgroundColor: colors.primary.wisteriaLight,
    marginVertical: spacing.md,
    borderRadius: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statDividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: colors.text.light,
  },
  foundItemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  foundListChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
    borderWidth: 1,
  },
});

export default TreasureHuntScreen;
