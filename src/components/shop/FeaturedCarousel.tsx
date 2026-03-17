import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { getFeaturedItems, ShopCosmetic, RARITY_COLORS } from '../../config/cosmetics';

interface FeaturedCarouselProps {
  onItemPress: (item: ShopCosmetic) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ onItemPress }) => {
  const { width: screenW } = useWindowDimensions();
  const cardW = screenW - spacing.screenPadding * 2;
  const featured = getFeaturedItems();
  const visby = useStore((s) => s.visby);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const appearance = visby?.appearance ?? {
    skinTone: '#FFAD6B',
    hairColor: '#B8875A',
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };
  const equipped = visby?.equipped ?? {};

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % featured.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const renderCard = ({ item }: { item: ShopCosmetic }) => {
    const rarityColor = RARITY_COLORS[item.rarity];
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onItemPress(item)}
        style={[styles.card, { width: cardW }]}
      >
        <LinearGradient
          colors={item.rarity === 'legendary' ? ['#FFF8E0', '#FFE8A0'] : ['#F5F0FF', '#FFF6EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.textSide}>
              {item.isNew && (
                <View style={styles.newBadge}>
                  <Text variant="caption" color="#FFFFFF" style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
              <Text variant="h3" numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
              <Caption numberOfLines={2} style={styles.itemDesc}>{item.description}</Caption>
              <View style={styles.priceRow}>
                <View style={[styles.rarityPill, { backgroundColor: `${rarityColor}20` }]}>
                  <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                  <Text variant="caption" color={rarityColor} style={styles.rarityText}>
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </Text>
                </View>
                <View style={styles.pricePill}>
                  <Icon name="sparkles" size={12} color={colors.reward.gold} />
                  <Text variant="body" style={styles.priceText}>
                    {item.price === 0 ? 'Free' : item.price}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.characterSide}>
              <VisbyCharacter
                appearance={appearance}
                equipped={{ ...equipped, [item.type]: item.id }}
                mood="excited"
                size={110}
                animated
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="sparkles" size={16} color={colors.reward.gold} />
        <Text variant="h3" style={styles.headerText}>Featured</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={featured}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + 12}
        decelerationRate="fast"
        contentContainerStyle={{ gap: 12, paddingHorizontal: spacing.screenPadding }}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          scrollX.value = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / (cardW + 12));
          setActiveIndex(idx);
        }}
        initialNumToRender={5}
        maxToRenderPerBatch={4}
        windowSize={3}
      />
      {featured.length > 1 && (
        <View style={styles.dots}>
          {featured.map((_, i) => (
            <AnimatedDot key={i} index={i} scrollX={scrollX} cardW={cardW + 12} />
          ))}
        </View>
      )}
    </View>
  );
};

const AnimatedDot: React.FC<{ index: number; scrollX: Animated.SharedValue<number>; cardW: number }> = ({ index, scrollX, cardW }) => {
  const style = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * cardW, index * cardW, (index + 1) * cardW];
    const width = interpolate(scrollX.value, inputRange, [6, 22, 6], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
    return { width, opacity };
  });

  return <Animated.View style={[styles.dot, style]} />;
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  headerText: { marginBottom: 0 },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: spacing.md,
    borderRadius: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSide: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  characterSide: {
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  newBadgeText: { fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  itemTitle: { marginBottom: 4 },
  itemDesc: { marginBottom: spacing.sm, lineHeight: 18 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rarityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rarityDot: { width: 6, height: 6, borderRadius: 3 },
  rarityText: { fontSize: 11, fontWeight: '600' },
  pricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: { fontWeight: '800', color: '#D4A520', fontSize: 14 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(184, 165, 224, 0.3)',
  },
  dotActive: {
    backgroundColor: colors.primary.wisteriaDark,
    width: 18,
  },
});
