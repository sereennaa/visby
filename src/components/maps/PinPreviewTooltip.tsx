import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Text, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

type PinPreviewTooltipProps = {
  name: string;
  type: 'city' | 'landmark';
  stopCount: number;
  regionHint?: string | null;
  imageUrl?: string | null;
  iconName: IconName;
  onGo: () => void;
  onDismiss: () => void;
};

export const PinPreviewTooltip: React.FC<PinPreviewTooltipProps> = ({
  name,
  type,
  stopCount,
  regionHint,
  imageUrl,
  iconName,
  onGo,
  onDismiss,
}) => {
  const pinColor = type === 'city' ? colors.primary.wisteria : colors.reward.peach;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={styles.backdrop}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />
      </Animated.View>

      {/* Card */}
      <Animated.View
        entering={SlideInUp.duration(300).springify().damping(14)}
        exiting={FadeOut.duration(150)}
        style={styles.card}
      >
        {/* Arrow pointer */}
        <View style={[styles.arrow, { borderBottomColor: imageUrl ? '#000' : colors.surface.card }]} />

        <View style={styles.cardInner}>
          {/* Image header */}
          {imageUrl ? (
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.imageOverlay}
              />
              <View style={styles.imageContent}>
                <View style={[styles.typeBadge, { backgroundColor: pinColor }]}>
                  <Icon name={iconName} size={12} color="#FFF" />
                  <Text style={styles.typeBadgeText}>
                    {type === 'city' ? 'City' : 'Landmark'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.iconHeader, { backgroundColor: pinColor + '15' }]}>
              <View style={[styles.iconCircle, { backgroundColor: pinColor + '25' }]}>
                <Icon name={iconName} size={24} color={pinColor} />
              </View>
            </View>
          )}

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.metaRow}>
              <Icon name="compass" size={12} color={colors.text.muted} />
              <Caption>
                {stopCount} stop{stopCount !== 1 ? 's' : ''} to explore
              </Caption>
            </View>
            {regionHint ? (
              <Caption style={styles.hint}>{regionHint}</Caption>
            ) : null}
          </View>

          {/* Go button */}
          <TouchableOpacity style={styles.goBtn} onPress={onGo} activeOpacity={0.8}>
            <LinearGradient
              colors={[pinColor, pinColor + 'DD']}
              style={styles.goBtnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.goBtnText}>Explore</Text>
              <Icon name="chevronRight" size={16} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 50,
  },
  card: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '35%',
    zIndex: 51,
    width: 240,
  },
  arrow: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.surface.card,
  },
  cardInner: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface.card,
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
      },
    }),
  },
  imageWrap: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  imageContent: {
    position: 'absolute',
    bottom: 8,
    left: 10,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: '#FFF',
  },
  iconHeader: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.sm,
    paddingBottom: 4,
  },
  name: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hint: {
    marginTop: 2,
    fontStyle: 'italic',
    color: colors.text.muted,
  },
  goBtn: {
    margin: spacing.sm,
    marginTop: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  goBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  goBtnText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#FFF',
  },
});

export default PinPreviewTooltip;
