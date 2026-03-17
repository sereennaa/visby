import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  FadeIn,
  FadeInDown,
  SlideInRight,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { Country, UserHouse } from '../../types';

const { width: SCREEN_W } = Dimensions.get('window');

interface HousePurchaseModalProps {
  visible: boolean;
  country: Country;
  onClose: () => void;
  onComplete: (house: UserHouse) => void;
}

export const HousePurchaseModal: React.FC<HousePurchaseModalProps> = ({
  visible,
  country,
  onClose,
  onComplete,
}) => {
  const user = useStore(s => s.user);
  const visby = useStore(s => s.visby);
  const spendAura = useStore(s => s.spendAura);
  const addUserHouse = useStore(s => s.addUserHouse);
  const addBondPoints = useStore(s => s.addBondPoints);
  const [phase, setPhase] = useState(1);
  const [houseName, setHouseName] = useState('');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const appearance = visby?.appearance ?? {
    skinTone: '#FFAD6B',
    hairColor: '#B8875A',
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };
  const equipped = visby?.equipped ?? {};

  const COUNTRY_PLACEHOLDERS: Record<string, string> = {
    jp: 'Maison de Visby',
    fr: 'Château Visby',
    mx: 'Casa Bonita',
    gb: 'Visby Manor',
    de: 'Haus Visby',
    it: 'Villa Visby',
  };
  const placeholder = COUNTRY_PLACEHOLDERS[country.id] ?? 'My Visby House';

  useEffect(() => {
    if (visible) {
      setPhase(1);
      setHouseName('');
    }
  }, [visible]);

  const handleBuy = () => {
    if (!user) return;
    if (user.aura < country.housePriceAura) {
      Alert.alert('Not Enough Aura', `You need ${country.housePriceAura} Aura to buy this house.`);
      return;
    }
    setPhase(2);
  };

  const handleNameSubmit = () => {
    setPhase(3);
    timersRef.current.push(setTimeout(() => setPhase(4), 2500));
  };

  const handleFinish = () => {
    const success = spendAura(country.housePriceAura);
    if (!success) return;
    const house: UserHouse = {
      id: `house_${country.id}_${Date.now()}`,
      userId: user?.id ?? '',
      countryId: country.id,
      purchasedAt: new Date(),
      houseName: houseName.trim() || placeholder,
      unlockedRooms: [],
    };
    addUserHouse(house);
    addBondPoints(5, 'house_purchase');
    onComplete(house);
    onClose();
  };

  const renderPhase = () => {
    switch (phase) {
      case 1:
        return (
          <Animated.View entering={FadeIn.duration(400)} style={styles.phaseContainer}>
            <View style={styles.flagCircle}>
              <Text variant="h1" style={styles.flag}>{country.flagEmoji}</Text>
            </View>
            <Heading level={2} align="center">Discover {country.name}!</Heading>
            <Caption align="center" style={styles.desc}>
              Your very own home in {country.name}! Decorate it, invite friends, and learn about the culture.
            </Caption>
            <View style={styles.priceSection}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text variant="h2" color={colors.reward.amber}>{country.housePriceAura}</Text>
              <Text variant="body" color={colors.text.muted}> Aura</Text>
            </View>
            <Button title="Buy This House!" onPress={handleBuy} style={styles.button} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text variant="body" color={colors.text.muted}>Maybe Later</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.phaseContainer}>
            <Icon name="home" size={48} color={colors.primary.wisteriaDark} />
            <Heading level={2} align="center">Name Your House</Heading>
            <Caption align="center" style={styles.desc}>
              Give your new home a special name!
            </Caption>
            <TextInput
              style={styles.nameInput}
              placeholder={placeholder}
              placeholderTextColor={colors.text.muted}
              value={houseName}
              onChangeText={setHouseName}
              maxLength={30}
              autoFocus
            />
            <Button title="Move In!" onPress={handleNameSubmit} style={styles.button} />
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeIn.duration(400)} style={styles.phaseContainer}>
            <Heading level={2} align="center">Moving in...</Heading>
            <View style={styles.moveInCharacter}>
              <VisbyCharacter
                appearance={appearance}
                equipped={equipped}
                mood="adventurous"
                size={160}
                animated
              />
            </View>
            <Text variant="body" color={colors.text.muted} style={styles.movingText}>
              Visby is exploring their new home!
            </Text>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View entering={FadeInDown.springify().damping(14)} style={styles.phaseContainer}>
            <View style={styles.celebrationBadge}>
              <Text variant="h1" style={styles.celebEmoji}>🎉</Text>
            </View>
            <Heading level={2} align="center">Welcome Home!</Heading>
            <Caption align="center" style={styles.desc}>
              {houseName.trim() || placeholder} is ready! Start decorating with furniture from the Workshop.
            </Caption>
            <VisbyCharacter
              appearance={appearance}
              equipped={equipped}
              mood="excited"
              size={120}
              animated
            />
            <Button title="Start Decorating!" onPress={handleFinish} style={styles.button} />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View entering={ZoomIn.duration(300).springify()} style={styles.modal}>
          <LinearGradient
            colors={['#FFFFFF', '#FAF8FF']}
            style={styles.modalGradient}
          >
            {renderPhase()}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: SCREEN_W - spacing.lg * 2,
    borderRadius: 28,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: spacing.xl,
    borderRadius: 28,
  },
  phaseContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  flagCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(184,165,224,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  flag: { fontSize: 40 },
  desc: {
    marginBottom: spacing.sm,
    maxWidth: 260,
    lineHeight: 20,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
    marginTop: spacing.sm,
  },
  closeButton: {
    padding: spacing.sm,
  },
  nameInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(184,165,224,0.3)',
    borderRadius: 16,
    padding: spacing.md,
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  moveInCharacter: {
    marginVertical: spacing.lg,
  },
  movingText: { marginBottom: spacing.lg },
  celebrationBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,215,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebEmoji: { fontSize: 40 },
});
