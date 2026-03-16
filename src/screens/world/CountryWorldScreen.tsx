import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { COUNTRIES } from '../../config/constants';
import { COUNTRY_SOUVENIRS, COSMETICS_CATALOG, isCosmeticLocked } from '../../config/cosmetics';
import { ExploreStackParamList, UserHouse } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type CountryWorldScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'CountryWorld'>;
};

type ConfirmModal = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
};

export const CountryWorldScreen: React.FC<CountryWorldScreenProps> = ({ navigation }) => {
  const { user, userHouses, spendAura, addUserHouse, incrementCountriesVisited, getStreakMultiplier, visitCountry } = useStore();
  const aura = user?.aura ?? 0;
  const streak = user?.currentStreak ?? 0;
  const multiplier = getStreakMultiplier();
  const visitedCountries = user?.visitedCountries ?? [];

  const [modal, setModal] = useState<ConfirmModal>({
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
  });
  const [infoModal, setInfoModal] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });
  const [nameModal, setNameModal] = useState<{ visible: boolean; countryId: string; countryName: string }>({
    visible: false, countryId: '', countryName: '',
  });
  const [houseName, setHouseName] = useState('');
  const [souvenirModal, setSouvenirModal] = useState<{
    visible: boolean;
    countryName: string;
    souvenirName: string;
    unlockedCount: number;
  }>({ visible: false, countryName: '', souvenirName: '', unlockedCount: 0 });

  const getUnlockedItemCount = (countryId: string) => {
    const country = COUNTRIES.find(c => c.id === countryId);
    if (!country) return 0;
    return COSMETICS_CATALOG.filter(c => c.country === country.name).length;
  };

  const hasHouse = (countryId: string) =>
    userHouses.some((h) => h.countryId === countryId);

  const showInfo = (title: string, message: string) => {
    setInfoModal({ visible: true, title, message });
  };

  const showConfirm = (title: string, message: string, confirmText: string, onConfirm: () => void) => {
    setModal({ visible: true, title, message, confirmText, onConfirm });
  };

  const handleVisit = (countryId: string) => {
    const country = COUNTRIES.find((c) => c.id === countryId);
    if (!country) return;

    if (hasHouse(countryId)) {
      navigation.navigate('CountryRoom', { countryId });
      return;
    }

    const cost = country.visitCostAura;
    if (aura < cost) {
      showInfo(
        'Not enough Aura',
        `You need ${cost} Aura to visit ${country.name}. Earn more by completing quizzes, reading facts, and keeping your streak!`
      );
      return;
    }

    const isFirstVisit = !visitedCountries.includes(countryId);
    const souvenir = COUNTRY_SOUVENIRS[countryId];
    const unlockCount = getUnlockedItemCount(countryId);

    const visitMessage = isFirstVisit && souvenir
      ? `Spend ${cost} Aura to visit and explore.\n\nFirst visit bonus: You'll receive a free ${souvenir.name} and unlock ${unlockCount} items from ${country.name} in the shop!`
      : `Spend ${cost} Aura to visit and explore. Take quizzes and read facts to earn Aura while you're there!`;

    showConfirm(
      `Visit ${country.flagEmoji} ${country.name}?`,
      visitMessage,
      'Visit!',
      () => {
        if (spendAura(cost)) {
          incrementCountriesVisited();
          const grantedSouvenir = visitCountry(countryId);
          setModal((m) => ({ ...m, visible: false }));
          if (grantedSouvenir && souvenir) {
            setSouvenirModal({
              visible: true,
              countryName: country.name,
              souvenirName: souvenir.name,
              unlockedCount: unlockCount,
            });
          } else {
            navigation.navigate('CountryRoom', { countryId });
          }
        } else {
          setModal((m) => ({ ...m, visible: false }));
        }
      }
    );
  };

  const handleBuyHouse = (countryId: string) => {
    const country = COUNTRIES.find((c) => c.id === countryId);
    if (!country || hasHouse(countryId)) return;

    const cost = country.housePriceAura;
    if (aura < cost) {
      showInfo(
        'Not enough Aura',
        `You need ${cost} Aura to buy a house in ${country.name}. Then you can visit anytime for free!`
      );
      return;
    }

    showConfirm(
      `Buy a house in ${country.flagEmoji} ${country.name}?`,
      `Spend ${cost} Aura for your own house with 4 rooms to explore. Visit and walk around whenever you want — no more Aura needed!`,
      'Buy house!',
      () => {
        if (spendAura(cost)) {
          setModal((m) => ({ ...m, visible: false }));
          setHouseName('');
          setNameModal({ visible: true, countryId, countryName: country.name });
        } else {
          setModal((m) => ({ ...m, visible: false }));
        }
      }
    );
  };

  const finishBuyHouse = () => {
    const name = houseName.trim() || `My ${nameModal.countryName} Home`;
    const cid = nameModal.countryId;
    const cname = nameModal.countryName;
    const newHouse: UserHouse = {
      id: `house_${Date.now()}`,
      userId: user?.id || '',
      countryId: cid,
      purchasedAt: new Date(),
      houseName: name,
    };
    addUserHouse(newHouse);
    incrementCountriesVisited();

    const grantedSouvenir = visitCountry(cid);
    const souvenir = COUNTRY_SOUVENIRS[cid];
    setNameModal({ visible: false, countryId: '', countryName: '' });

    if (grantedSouvenir && souvenir) {
      setSouvenirModal({
        visible: true,
        countryName: cname,
        souvenirName: souvenir.name,
        unlockedCount: getUnlockedItemCount(cid),
      });
    } else {
      navigation.navigate('CountryRoom', { countryId: cid });
    }
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight]}
      style={styles.container}
      locations={[0, 0.4, 1]}
    >
      <FloatingParticles count={10} variant="mixed" opacity={0.3} speed="normal" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Heading level={1}>Visit the World</Heading>
            <Caption>Pay Aura to visit a country, or buy a house to visit anytime!</Caption>
            <View style={styles.statsRow}>
              <View style={styles.auraRow}>
                <Icon name="sparkles" size={20} color={colors.reward.gold} />
                <Text variant="body" style={styles.auraText}>{aura} Aura</Text>
              </View>
              {streak > 0 && (
                <View style={styles.streakRow}>
                  <Text style={styles.streakText}>{streak}-day streak</Text>
                  <View style={styles.multiplierBadge}>
                    <Text style={styles.multiplierText}>{multiplier.toFixed(1)}x</Text>
                  </View>
                </View>
              )}
            </View>
            {userHouses.length > 0 && (
              <View style={styles.housesOwnedRow}>
                <Text style={styles.housesOwnedText}>{userHouses.length} house{userHouses.length !== 1 ? 's' : ''} owned</Text>
              </View>
            )}
          </View>

          {(user?.countriesVisited || 0) === 0 && (
            <Card style={styles.tipCard}>
              <View style={styles.tipContent}>
                <Icon name="info" size={20} color={colors.primary.wisteriaDark} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ fontWeight: '600' }}>How It Works</Text>
                  <Caption>Spend Aura to visit a country and explore its rooms. Buy a house for unlimited access. Earn Aura by learning, collecting stamps, and keeping your streak!</Caption>
                </View>
              </View>
            </Card>
          )}

          {COUNTRIES.map((country) => {
            const owned = hasHouse(country.id);
            const visited = visitedCountries.includes(country.id);
            const itemCount = getUnlockedItemCount(country.id);
            return (
              <Card
                key={country.id}
                variant="elevated"
                style={{...styles.countryCard, borderLeftColor: country.accentColor, borderLeftWidth: 4 }}
              >
                <View style={styles.countryRow}>
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagEmoji}>{country.flagEmoji}</Text>
                  </View>
                  <View style={styles.countryInfo}>
                    <View style={styles.countryNameRow}>
                      <Text variant="h2">{country.name}</Text>
                      {owned && <Text style={styles.ownedBadge}>Owned</Text>}
                      {!visited && !owned && <Text style={styles.newBadge}>NEW</Text>}
                    </View>
                    {!visited && itemCount > 0 && (
                      <View style={styles.unlockPreview}>
                        <Icon name="shirt" size={12} color={colors.reward.amber} />
                        <Text style={styles.unlockPreviewText}>
                          Unlocks {itemCount} item{itemCount !== 1 ? 's' : ''} + free souvenir
                        </Text>
                      </View>
                    )}
                    {owned && (() => {
                      const house = userHouses.find((h) => h.countryId === country.id);
                      return house?.houseName ? (
                        <Text style={styles.houseNameText}>"{house.houseName}"</Text>
                      ) : null;
                    })()}
                    <Caption numberOfLines={2}>{country.description}</Caption>
                    <View style={styles.countryMeta}>
                      <Text style={styles.factCount}>{country.facts.length} facts</Text>
                      <Text style={styles.factCount}>Quiz</Text>
                      <Text style={styles.factCount}>4 rooms</Text>
                    </View>
                    <View style={styles.actions}>
                      {owned ? (
                        <Button
                          size="sm"
                          variant="primary"
                          title="Enter my house"
                          onPress={() => handleVisit(country.id)}
                          style={styles.enterBtn}
                        />
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            title={`Visit ${country.visitCostAura}`}
                            onPress={() => handleVisit(country.id)}
                            style={styles.visitBtn}
                          />
                          <TouchableOpacity
                            style={styles.buyHouseBtn}
                            onPress={() => handleBuyHouse(country.id)}
                          >
                            <Icon name="home" size={18} color={colors.primary.wisteriaDark} />
                            <Text variant="caption" color={colors.primary.wisteriaDark}>
                              Buy house {country.housePriceAura}
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
          <View style={styles.footer}>
            <Text variant="caption" color={colors.text.muted} align="center">
              Take quizzes and read facts in each country to earn Aura. Keep your streak for a multiplier!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Confirm Modal */}
      <Modal visible={modal.visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModal((m) => ({ ...m, visible: false }))}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Heading level={3}>{modal.title}</Heading>
            <Text variant="body" style={styles.modalBody}>{modal.message}</Text>
            <View style={styles.modalActions}>
              <Button size="sm" variant="secondary" title="Cancel" onPress={() => setModal((m) => ({ ...m, visible: false }))} />
              <Button size="sm" variant="reward" title={modal.confirmText} onPress={modal.onConfirm} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Info Modal */}
      <Modal visible={infoModal.visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setInfoModal((m) => ({ ...m, visible: false }))}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Heading level={3}>{infoModal.title}</Heading>
            <Text variant="body" style={styles.modalBody}>{infoModal.message}</Text>
            <View style={styles.modalActions}>
              <Button size="sm" variant="primary" title="OK" onPress={() => setInfoModal((m) => ({ ...m, visible: false }))} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Name Your House Modal */}
      <Modal visible={nameModal.visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.nameModalHeader}>
              <Icon name="home" size={48} color={colors.text.primary} />
              <Heading level={3}>Name Your House!</Heading>
              <Caption>You bought a house in {nameModal.countryName}! Give it a name.</Caption>
            </View>
            <TextInput
              style={styles.nameInput}
              placeholder={`My ${nameModal.countryName} Home`}
              placeholderTextColor={colors.text.muted}
              value={houseName}
              onChangeText={setHouseName}
              maxLength={30}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Button size="sm" variant="primary" title="Move In!" onPress={finishBuyHouse} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Souvenir Reward Modal */}
      <Modal visible={souvenirModal.visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay}>
          <Pressable style={styles.souvenirContent} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={['#FFF8E0', '#FFF0F5', '#F0ECFF']}
              style={styles.souvenirGradient}
            >
              <Text style={styles.souvenirEmoji}>🎁</Text>
              <Heading level={2}>Souvenir Unlocked!</Heading>
              <Text variant="body" align="center" style={styles.souvenirBody}>
                Welcome to {souvenirModal.countryName}! You received a free{'\n'}
                <Text variant="body" style={styles.souvenirItemName}>{souvenirModal.souvenirName}</Text>
              </Text>
              {souvenirModal.unlockedCount > 1 && (
                <View style={styles.souvenirUnlockRow}>
                  <Icon name="shirt" size={16} color={colors.primary.wisteriaDark} />
                  <Text variant="caption" color={colors.primary.wisteriaDark}>
                    {souvenirModal.unlockedCount} items from {souvenirModal.countryName} are now available in the shop!
                  </Text>
                </View>
              )}
              <View style={styles.souvenirActions}>
                <Button
                  size="sm"
                  variant="primary"
                  title="Explore!"
                  onPress={() => {
                    const cid = COUNTRIES.find(c => c.name === souvenirModal.countryName)?.id;
                    setSouvenirModal(s => ({ ...s, visible: false }));
                    if (cid) navigation.navigate('CountryRoom', { countryId: cid });
                  }}
                />
                <Button
                  size="sm"
                  variant="reward"
                  title="Visit Shop"
                  onPress={() => {
                    setSouvenirModal(s => ({ ...s, visible: false }));
                    (navigation.getParent() as any)?.getParent()?.navigate('CosmeticShop');
                  }}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl * 4 },
  header: { marginBottom: spacing.lg },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.lg },
  auraRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  auraText: { fontFamily: 'Nunito-SemiBold' },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  streakText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: '#D4760A' },
  multiplierBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  multiplierText: { fontFamily: 'Baloo2-Bold', fontSize: 12, color: '#7A5A00' },
  housesOwnedRow: { marginTop: spacing.xs },
  housesOwnedText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  tipCard: { marginBottom: spacing.md },
  tipContent: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  countryCard: { marginBottom: spacing.md },
  countryRow: { flexDirection: 'row', alignItems: 'flex-start' },
  flagCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.base.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  flagEmoji: { fontSize: 32 },
  countryInfo: { flex: 1 },
  countryNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ownedBadge: { fontFamily: 'Nunito-Bold', fontSize: 12, color: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  newBadge: { fontFamily: 'Nunito-Bold', fontSize: 10, color: colors.reward.amber, backgroundColor: 'rgba(255,191,0,0.12)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden', letterSpacing: 1 },
  unlockPreview: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  unlockPreviewText: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: colors.reward.amber },
  houseNameText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.primary.wisteriaDark, fontStyle: 'italic', marginTop: 2 },
  countryMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  factCount: { fontFamily: 'Nunito-Medium', fontSize: 12, color: colors.text.muted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  visitBtn: { marginRight: spacing.xs },
  enterBtn: {},
  buyHouseBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  footer: { marginTop: spacing.lg, paddingHorizontal: spacing.sm },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    maxWidth: 360,
    width: '100%',
  },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.lg },
  modalActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  nameModalHeader: { alignItems: 'center', marginBottom: spacing.md },
  nameInput: {
    fontFamily: 'Nunito-SemiBold', fontSize: 16, color: colors.text.primary,
    borderWidth: 2, borderColor: colors.primary.wisteriaFaded,
    borderRadius: 16, padding: spacing.md, marginBottom: spacing.lg,
    backgroundColor: '#FAFAFE',
  },

  // Souvenir Modal
  souvenirContent: {
    maxWidth: 360,
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  souvenirGradient: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  souvenirEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  souvenirBody: {
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  souvenirItemName: {
    fontWeight: '700',
    color: colors.primary.wisteriaDark,
  },
  souvenirUnlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    backgroundColor: 'rgba(184, 165, 224, 0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.lg,
  },
  souvenirActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
