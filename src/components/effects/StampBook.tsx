import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const STAMPS_PER_PAGE = 6;

function usePageDimensions() {
  const { width } = useWindowDimensions();
  const pageWidth = width - 48;
  return { pageWidth, pageHeight: pageWidth * 1.35 };
}

interface StampItem {
  id: string;
  name: string;
  country: string;
  countryEmoji: string;
  type: string;
  collectedAt: Date;
  isNew?: boolean;
}

interface StampBookProps {
  stamps: StampItem[];
}

const StampPage: React.FC<{
  stamps: StampItem[];
  pageIndex: number;
  totalPages: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
  pageHeight: number;
}> = ({ stamps, pageIndex, totalPages, scrollX, pageWidth, pageHeight }) => {
  const inputRange = [
    (pageIndex - 1) * pageWidth,
    pageIndex * pageWidth,
    (pageIndex + 1) * pageWidth,
  ];

  const pageStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [35, 0, -35],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.85, 1, 0.85],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { scale },
      ],
      opacity,
    };
  });

  const slotWidth = (pageWidth - 52) / 2;
  const slotHeight = (pageHeight - 120) / 3;

  return (
    <Animated.View style={[styles.page, { width: pageWidth, height: pageHeight }, pageStyle]}>
      <LinearGradient
        colors={[colors.base.parchment, colors.base.cream, '#F5EDDE']}
        style={styles.pageGradient}
      >
        {/* Page header */}
        <View style={styles.pageHeader}>
          <View style={styles.pageCorner} />
          <Caption style={styles.pageNumber}>
            Page {pageIndex + 1} of {totalPages}
          </Caption>
          <View style={styles.pageCorner} />
        </View>

        {/* Stamps grid */}
        <View style={styles.stampsGrid}>
          {stamps.map((stamp, i) => (
            <StampEntry key={stamp.id} stamp={stamp} index={i} slotWidth={slotWidth} slotHeight={slotHeight} />
          ))}
          {stamps.length < STAMPS_PER_PAGE &&
            Array.from({ length: STAMPS_PER_PAGE - stamps.length }, (_, i) => (
              <View key={`empty_${i}`} style={[styles.emptyStamp, { width: slotWidth, height: slotHeight }]}>
                <View style={styles.emptyStampDashed}>
                  <Icon name="stamp" size={20} color={colors.text.light} />
                </View>
              </View>
            ))}
        </View>

        {/* Page decoration */}
        <View style={styles.pageFooter}>
          <View style={styles.stampLine} />
          <Text variant="caption" style={styles.passportText}>VISBY PASSPORT</Text>
          <View style={styles.stampLine} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const StampEntry: React.FC<{ stamp: StampItem; index: number; slotWidth: number; slotHeight: number }> = ({ stamp, index, slotWidth, slotHeight }) => {
  const rotation = -5 + Math.random() * 10;

  return (
    <View style={[styles.stampSlot, { width: slotWidth, height: slotHeight }]}>
      <View style={[styles.stampFrame, { transform: [{ rotate: `${rotation}deg` }] }]}>
        <LinearGradient
          colors={['rgba(184, 165, 224, 0.15)', 'rgba(255, 209, 160, 0.1)']}
          style={styles.stampInner}
        >
          <Text style={styles.stampEmoji}>{stamp.countryEmoji}</Text>
          <Text variant="caption" style={styles.stampName} numberOfLines={1}>
            {stamp.name}
          </Text>
          <Text style={styles.stampDate}>
            {new Date(stamp.collectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </LinearGradient>
        {stamp.isNew && (
          <View style={styles.newDot} />
        )}
      </View>
    </View>
  );
};

export const StampBook: React.FC<StampBookProps> = ({ stamps }) => {
  const { pageWidth, pageHeight } = usePageDimensions();
  const scrollX = useSharedValue(0);

  const pages = React.useMemo(() => {
    const result: StampItem[][] = [];
    for (let i = 0; i < stamps.length; i += STAMPS_PER_PAGE) {
      result.push(stamps.slice(i, i + STAMPS_PER_PAGE));
    }
    if (result.length === 0) result.push([]);
    return result;
  }, [stamps]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => `page_${i}`}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={pageWidth}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <StampPage
            stamps={item}
            pageIndex={index}
            totalPages={pages.length}
            scrollX={scrollX}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
          />
        )}
      />

      {/* Page indicator dots */}
      <View style={styles.dots}>
        {pages.map((_, i) => (
          <PageDot key={i} index={i} scrollX={scrollX} pageWidth={pageWidth} />
        ))}
      </View>
    </View>
  );
};

const PageDot: React.FC<{ index: number; scrollX: SharedValue<number>; pageWidth: number }> = ({ index, scrollX, pageWidth }) => {
  const style = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth];
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1.3, 0.8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  return (
    <Animated.View style={[styles.dot, style]} />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
  },
  page: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  pageGradient: {
    flex: 1,
    padding: 16,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageCorner: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  pageNumber: {
    color: colors.text.muted,
    fontSize: 10,
    letterSpacing: 1,
  },
  stampsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  stampSlot: {
    padding: 4,
  },
  stampFrame: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(184, 165, 224, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  stampInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  stampEmoji: { fontSize: 28, marginBottom: 4 },
  stampName: {
    color: colors.text.secondary,
    fontSize: 10,
    textAlign: 'center',
  },
  stampDate: {
    fontSize: 8,
    color: colors.text.muted,
    marginTop: 2,
  },
  newDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.reward.gold,
  },
  emptyStamp: {
    padding: 4,
  },
  emptyStampDashed: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(184, 165, 224, 0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  stampLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(184, 165, 224, 0.15)',
  },
  passportText: {
    fontSize: 8,
    color: colors.text.light,
    letterSpacing: 2,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.wisteria,
  },
});
