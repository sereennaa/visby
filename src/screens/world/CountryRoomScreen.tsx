import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { COUNTRIES } from '../../config/constants';
import { useStore } from '../../store/useStore';
import { RootStackParamList, PlacedFurniture } from '../../types';
import type { CountryFact } from '../../types';
import { FURNITURE_CATALOG, WALLPAPER_OPTIONS, FLOORING_OPTIONS } from '../../config/furniture';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { getCountryQuiz, QuizQuestion } from '../../config/learningContent';
import { COUNTRY_HOUSES, RoomObject, HouseRoom } from '../../config/countryRooms';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_SIZE = 70;
const ROOM_HEIGHT = 280;
const FACT_AURA_REWARD = 5;
const QUIZ_AURA_PER_CORRECT = 25;

type CountryRoomScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CountryRoom'>;
  route: { params: { countryId: string } };
};

export const CountryRoomScreen: React.FC<CountryRoomScreenProps> = ({ navigation, route }) => {
  const { countryId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const houseData = COUNTRY_HOUSES[countryId];
  const { visby, user, addAura, getStreakMultiplier, userHouses, ownedFurniture, buyFurniture, placeFurniture, removePlacedFurniture, updateRoomColors, spendAura } = useStore();

  const isOwner = userHouses.some((h) => h.countryId === countryId);
  const rooms = houseData?.rooms ?? [];

  // Room navigation
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const currentRoom: HouseRoom | undefined = rooms[currentRoomIdx];

  // Interactive object modal
  const [activeObject, setActiveObject] = useState<RoomObject | null>(null);
  const [interactedObjects, setInteractedObjects] = useState<Set<string>>(new Set());

  // Facts
  const [learningFact, setLearningFact] = useState<CountryFact | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [readFacts, setReadFacts] = useState<Set<string>>(new Set());

  // Quiz
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  // Edit / Decorate mode
  const [editMode, setEditMode] = useState(false);
  const [showFurniturePanel, setShowFurniturePanel] = useState(false);
  const [showWallpaperPanel, setShowWallpaperPanel] = useState(false);
  const [showFlooringPanel, setShowFlooringPanel] = useState(false);
  const [selectedPlacedItem, setSelectedPlacedItem] = useState<string | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<'furniture' | 'wallpaper' | 'flooring' | null>(null);

  const house = userHouses.find(h => h.countryId === countryId);
  const roomCustomization = house?.roomCustomizations?.[currentRoom?.id ?? ''];
  const placedItems = roomCustomization?.placedFurniture ?? [];
  const effectiveWallColor = roomCustomization?.wallColor || currentRoom?.wallColor || '#FFF8F0';
  const effectiveFloorColor = roomCustomization?.floorColor || currentRoom?.floorColor || '#D4C5A0';

  // Avatar walk
  const avatarX = useSharedValue(SCREEN_WIDTH / 2 - AVATAR_SIZE / 2);
  const avatarDirection = useSharedValue<'left' | 'right'>('right');

  const multiplier = getStreakMultiplier();
  const aura = user?.aura ?? 0;
  const streak = user?.currentStreak ?? 0;

  const defaultAppearance = visby?.appearance ?? {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const moveLeft = useCallback(() => {
    avatarDirection.value = 'left';
    avatarX.value = withSpring(
      Math.max(spacing.lg, avatarX.value - 28),
      { damping: 14, stiffness: 120 }
    );
  }, []);

  const moveRight = useCallback(() => {
    avatarDirection.value = 'right';
    avatarX.value = withSpring(
      Math.min(SCREEN_WIDTH - AVATAR_SIZE - spacing.lg, avatarX.value + 28),
      { damping: 14, stiffness: 120 }
    );
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: avatarX.value },
      { scaleX: avatarDirection.value === 'left' ? -1 : 1 },
    ],
  }));

  // Room navigation
  const goToRoom = useCallback((idx: number) => {
    if (idx >= 0 && idx < rooms.length) {
      setCurrentRoomIdx(idx);
      avatarX.value = withSpring(SCREEN_WIDTH / 2 - AVATAR_SIZE / 2, { damping: 14, stiffness: 120 });
    }
  }, [rooms.length]);

  // Object interaction
  const handleObjectTap = useCallback((obj: RoomObject) => {
    if (!obj.interactive) return;
    setActiveObject(obj);
    if (!interactedObjects.has(obj.id) && obj.auraReward) {
      setInteractedObjects((prev) => new Set(prev).add(obj.id));
      addAura(obj.auraReward);
    }
  }, [interactedObjects, addAura]);

  // Facts
  const openFact = useCallback((fact: CountryFact) => {
    setLearningFact(fact);
    if (!readFacts.has(fact.id)) {
      setReadFacts((prev) => new Set(prev).add(fact.id));
      addAura(FACT_AURA_REWARD);
    }
  }, [readFacts, addAura]);

  const closeFact = useCallback(() => setLearningFact(null), []);

  const nextFact = useCallback(() => {
    if (!country?.facts.length) return;
    const nextIdx = (factIndex + 1) % country.facts.length;
    setFactIndex(nextIdx);
    const next = country.facts[nextIdx];
    setLearningFact(next);
    if (!readFacts.has(next.id)) {
      setReadFacts((prev) => new Set(prev).add(next.id));
      addAura(FACT_AURA_REWARD);
    }
  }, [country?.facts, factIndex, readFacts, addAura]);

  // Quiz
  const startQuiz = useCallback(() => {
    const qs = getCountryQuiz(countryId, 8);
    if (qs.length === 0) return;
    setQuizQuestions(qs);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizSelected(null);
    setQuizActive(true);
  }, [countryId]);

  const handleQuizAnswer = useCallback((optionIndex: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(optionIndex);
    const correct = quizQuestions[quizIndex].correct === optionIndex;
    if (correct) setQuizScore((s) => s + 1);
    setTimeout(() => {
      if (quizIndex + 1 >= quizQuestions.length) {
        const finalScore = correct ? quizScore + 1 : quizScore;
        const reward = finalScore * QUIZ_AURA_PER_CORRECT;
        if (reward > 0) addAura(reward);
        setQuizFinished(true);
      } else {
        setQuizIndex((i) => i + 1);
        setQuizSelected(null);
      }
    }, 800);
  }, [quizSelected, quizIndex, quizQuestions, quizScore, addAura]);

  const totalInteractive = currentRoom?.objects.filter((o) => o.interactive).length ?? 0;
  const roomInteracted = currentRoom?.objects.filter((o) => o.interactive && interactedObjects.has(o.id)).length ?? 0;

  if (!country) {
    return (
      <View style={styles.centered}>
        <Text>Country not found.</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const facts = country.facts;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[country.accentColor + '30', effectiveWallColor, colors.base.parchment]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.45, 1]}
      />
      <FloatingParticles count={6} variant="sparkle" opacity={0.2} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.flagTitle}>{country.flagEmoji} {country.name}</Text>
              {isOwner && <Caption style={styles.ownerTag}>Your House</Caption>}
            </View>
            <View style={styles.auraChip}>
              <Text style={styles.auraChipText}>{aura}</Text>
            </View>
          </View>

          {/* Streak Banner */}
          {streak > 0 && (
            <View style={styles.streakBanner}>
              <Text style={styles.streakText}>{streak}-day streak</Text>
              <View style={styles.multiplierBadge}>
                <Text style={styles.multiplierText}>{multiplier.toFixed(1)}x</Text>
              </View>
            </View>
          )}

          {/* Room tabs */}
          {rooms.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomTabs}>
              {rooms.map((room, idx) => (
                <TouchableOpacity
                  key={room.id}
                  style={[styles.roomTab, idx === currentRoomIdx && styles.roomTabActive]}
                  onPress={() => goToRoom(idx)}
                  activeOpacity={0.8}
                >
                  <Icon name={room.icon as IconName} size={18} color={colors.text.secondary} />
                  <Text style={idx === currentRoomIdx ? { ...styles.roomTabText, ...styles.roomTabTextActive } : styles.roomTabText}>
                    {room.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Room View */}
          {currentRoom && (
            <View style={[styles.roomContainer, { backgroundColor: effectiveWallColor }]}>
              {/* Room name + edit toggle */}
              <View style={styles.roomNameRow}>
                <View style={styles.roomNameInner}>
                  <Icon name={currentRoom.icon as IconName} size={16} color={colors.text.primary} />
                  <Text style={styles.roomNameText}>{currentRoom.name}</Text>
                  {isOwner && (
                    <TouchableOpacity
                      style={[styles.editToggleBtn, editMode && styles.editToggleBtnActive]}
                      onPress={() => {
                        setEditMode((v) => !v);
                        setSelectedPlacedItem(null);
                        setActiveEditTab(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <Icon name="edit" size={14} color={editMode ? '#FFFFFF' : colors.primary.wisteriaDark} />
                      <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 11, color: editMode ? '#FFFFFF' : colors.primary.wisteriaDark }}>
                        {editMode ? 'Done' : 'Edit'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {!editMode && totalInteractive > 0 && (
                  <View style={styles.roomProgressChip}>
                    <Text style={styles.roomProgressText}>{roomInteracted}/{totalInteractive} discovered</Text>
                  </View>
                )}
              </View>

              {/* Interactive objects */}
              <View style={styles.objectsLayer}>
                {currentRoom.objects.map((obj) => {
                  const wasInteracted = interactedObjects.has(obj.id);
                  return (
                    <TouchableOpacity
                      key={obj.id}
                      style={[
                        styles.roomObject,
                        { left: `${obj.x}%` as any, top: `${obj.y}%` as any },
                      ]}
                      onPress={() => obj.interactive && !editMode ? handleObjectTap(obj) : undefined}
                      activeOpacity={obj.interactive && !editMode ? 0.7 : 1}
                      disabled={!obj.interactive || editMode}
                    >
                      <Icon name={obj.icon as IconName} size={30} color={colors.text.primary} />
                      <Text style={wasInteracted ? { ...styles.objectLabel, ...styles.objectLabelDone } : styles.objectLabel}>{obj.label}</Text>
                      {obj.interactive && !wasInteracted && !editMode && (
                        <View style={styles.interactiveDot} />
                      )}
                      {obj.interactive && wasInteracted && (
                        <Icon name="check" size={14} color="#50C878" />
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Placed furniture items */}
                {placedItems.map((placed) => {
                  const catalogItem = FURNITURE_CATALOG.find(f => f.id === placed.furnitureId);
                  if (!catalogItem) return null;
                  return (
                    <TouchableOpacity
                      key={placed.id}
                      style={[
                        styles.placedFurnitureItem,
                        { left: `${placed.x}%` as any, top: `${placed.y}%` as any },
                        selectedPlacedItem === placed.id && styles.placedFurnitureItemSelected,
                      ]}
                      onPress={() => {
                        if (editMode) {
                          setSelectedPlacedItem(selectedPlacedItem === placed.id ? null : placed.id);
                        }
                      }}
                      activeOpacity={editMode ? 0.7 : 1}
                      disabled={!editMode}
                    >
                      <Icon name={catalogItem.icon as IconName} size={28} color={colors.text.primary} />
                      <Text style={styles.placedFurnitureLabel}>{catalogItem.name}</Text>
                      {editMode && selectedPlacedItem === placed.id && (
                        <View style={styles.placedFurniturePopup}>
                          <TouchableOpacity
                            style={styles.removeBtn}
                            onPress={() => {
                              removePlacedFurniture(countryId, currentRoom.id, placed.id);
                              setSelectedPlacedItem(null);
                            }}
                          >
                            <Icon name="close" size={12} color="#FFFFFF" />
                            <Text style={styles.removeBtnText}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Avatar on the floor (hidden in edit mode) */}
              {!editMode && (
                <Animated.View style={[styles.avatarContainer, avatarStyle]}>
                  <VisbyCharacter
                    appearance={defaultAppearance}
                    equipped={visby?.equipped}
                    mood="curious"
                    size={AVATAR_SIZE}
                    animated
                  />
                </Animated.View>
              )}

              {/* Walk controls + floor / Edit toolbar */}
              <View style={[styles.floor, { backgroundColor: effectiveFloorColor }]}>
                {editMode ? (
                  <View style={styles.editToolbar}>
                    {(['furniture', 'wallpaper', 'flooring'] as const).map((tab) => (
                      <TouchableOpacity
                        key={tab}
                        style={[styles.editToolbarBtn, activeEditTab === tab && styles.editToolbarBtnActive]}
                        onPress={() => {
                          setActiveEditTab(tab);
                          if (tab === 'furniture') setShowFurniturePanel(true);
                          else if (tab === 'wallpaper') setShowWallpaperPanel(true);
                          else setShowFlooringPanel(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Icon
                          name={tab === 'furniture' ? 'home' : tab === 'wallpaper' ? 'edit' : 'culture'}
                          size={20}
                          color={activeEditTab === tab ? '#FFFFFF' : colors.primary.wisteriaDark}
                        />
                        <Text style={[styles.editToolbarLabel, activeEditTab === tab && styles.editToolbarLabelActive]}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.walkControls}>
                    <TouchableOpacity style={styles.walkBtn} onPress={moveLeft} activeOpacity={0.8}>
                      <Icon name="chevronLeft" size={28} color={colors.primary.wisteriaDark} />
                    </TouchableOpacity>
                    <Text variant="caption" color={colors.text.muted}>Walk</Text>
                    <TouchableOpacity style={styles.walkBtn} onPress={moveRight} activeOpacity={0.8}>
                      <Icon name="chevronRight" size={28} color={colors.primary.wisteriaDark} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Room nav arrows */}
              {currentRoomIdx > 0 && (
                <TouchableOpacity style={styles.roomNavLeft} onPress={() => goToRoom(currentRoomIdx - 1)}>
                  <View style={styles.doorArrow}>
                    <Text style={styles.doorArrowText}>←</Text>
                    <Text style={styles.doorLabel}>{rooms[currentRoomIdx - 1].name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              {currentRoomIdx < rooms.length - 1 && (
                <TouchableOpacity style={styles.roomNavRight} onPress={() => goToRoom(currentRoomIdx + 1)}>
                  <View style={styles.doorArrow}>
                    <Text style={styles.doorArrowText}>→</Text>
                    <Text style={styles.doorLabel}>{rooms[currentRoomIdx + 1].name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} onPress={startQuiz}>
              <Icon name="quiz" size={28} color={colors.text.primary} />
              <Text style={styles.actionLabel}>Take Quiz</Text>
              <Text style={styles.actionSub}>+{QUIZ_AURA_PER_CORRECT}/correct</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => { if (facts.length > 0) { setFactIndex(0); openFact(facts[0]); } }}>
              <Icon name="book" size={28} color={colors.text.primary} />
              <Text style={styles.actionLabel}>Read Facts</Text>
              <Text style={styles.actionSub}>{readFacts.size}/{facts.length} read</Text>
            </TouchableOpacity>
          </View>

          {/* Fun Facts scroll */}
          <View style={styles.factsSection}>
            <Text style={styles.sectionTitle}>Fun Facts about {country.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.factsScroll}>
              {facts.map((fact, index) => {
                const isRead = readFacts.has(fact.id);
                return (
                  <TouchableOpacity
                    key={fact.id}
                    style={[styles.factChip, { borderColor: country.accentColor }, isRead && styles.factChipRead]}
                    onPress={() => { setFactIndex(index); openFact(fact); }}
                  >
                    <Icon name={fact.icon as any} size={18} color={colors.primary.wisteriaDark} />
                    <Text variant="caption" numberOfLines={1} style={isRead ? styles.factTextRead : undefined}>{fact.title}</Text>
                    {isRead && <Icon name="check" size={14} color="#50C878" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Earning guide */}
          <View style={styles.guideSection}>
            <Text style={styles.sectionTitle}>Earn Aura Here</Text>
            <View style={styles.guideGrid}>
              <View style={styles.guideItem}>
                <Icon name="home" size={24} color={colors.text.primary} />
                <Text style={styles.guideLabel}>Explore rooms</Text>
                <Text style={styles.guideAmount}>+8 per object</Text>
              </View>
              <View style={styles.guideItem}>
                <Icon name="quiz" size={24} color={colors.text.primary} />
                <Text style={styles.guideLabel}>Quiz</Text>
                <Text style={styles.guideAmount}>+{QUIZ_AURA_PER_CORRECT}/correct</Text>
              </View>
              <View style={styles.guideItem}>
                <Icon name="book" size={24} color={colors.text.primary} />
                <Text style={styles.guideLabel}>Read facts</Text>
                <Text style={styles.guideAmount}>+{FACT_AURA_REWARD} each</Text>
              </View>
              <View style={styles.guideItem}>
                <Icon name="flame" size={24} color={colors.text.primary} />
                <Text style={styles.guideLabel}>Streak</Text>
                <Text style={styles.guideAmount}>{multiplier.toFixed(1)}x boost</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Object detail modal */}
      <Modal visible={!!activeObject} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setActiveObject(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {activeObject && (
              <>
                <View style={styles.modalIconRow}>
                  <Icon name={activeObject.icon as IconName} size={48} color={colors.text.primary} />
                </View>
                <Heading level={3}>{activeObject.learnTitle ?? activeObject.label}</Heading>
                <Text variant="body" style={styles.modalBody}>
                  {activeObject.learnContent ?? `This is a ${activeObject.label}.`}
                </Text>
                {activeObject.auraReward && (
                  <View style={styles.auraEarnedRow}>
                    <Text style={styles.auraEarnedText}>
                      +{Math.round(activeObject.auraReward * multiplier)} Aura earned!
                    </Text>
                  </View>
                )}
                <View style={styles.modalActions}>
                  <Button size="sm" variant="primary" title="Cool!" onPress={() => setActiveObject(null)} />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Fact modal */}
      <Modal visible={!!learningFact} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeFact}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {learningFact && (
              <>
                <View style={styles.modalIconRow}>
                  <Text style={styles.modalIcon}>{learningFact.icon}</Text>
                </View>
                <Heading level={3}>{learningFact.title}</Heading>
                <Text variant="body" style={styles.modalBody}>{learningFact.content}</Text>
                <View style={styles.auraEarnedRow}>
                  <Text style={styles.auraEarnedText}>+{FACT_AURA_REWARD} Aura</Text>
                </View>
                <View style={styles.modalActions}>
                  {facts.length > 1 && (
                    <Button size="sm" variant="secondary" title="Next fact" onPress={nextFact} />
                  )}
                  <Button size="sm" variant="primary" title="Got it!" onPress={closeFact} />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Furniture Panel */}
      <Modal visible={showFurniturePanel} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowFurniturePanel(false)}>
          <Pressable style={styles.panelContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.panelHeader}>
              <Heading level={3}>Furniture</Heading>
              <TouchableOpacity onPress={() => setShowFurniturePanel(false)}>
                <Icon name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.furnitureGrid}>
              {FURNITURE_CATALOG.map((item) => {
                const owned = ownedFurniture.includes(item.id);
                return (
                  <View key={item.id} style={styles.furnitureCard}>
                    <View style={styles.furnitureIconWrap}>
                      <Icon name={item.icon as IconName} size={32} color={colors.text.primary} />
                    </View>
                    <Text style={styles.furnitureName} numberOfLines={1}>{item.name}</Text>
                    <Caption style={styles.furnitureRarity}>{item.rarity}</Caption>
                    {owned ? (
                      <TouchableOpacity
                        style={styles.placeBtn}
                        onPress={() => {
                          if (!currentRoom) return;
                          const placed: PlacedFurniture = {
                            id: `${item.id}_${Date.now()}`,
                            furnitureId: item.id,
                            roomId: currentRoom.id,
                            x: 50,
                            y: 50,
                            rotation: 0,
                          };
                          placeFurniture(countryId, currentRoom.id, placed);
                          setShowFurniturePanel(false);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.placeBtnText}>Place</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.buyBtn}
                        onPress={() => {
                          buyFurniture(item.id, item.price);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buyBtnText}>{item.price} Aura</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Wallpaper Panel */}
      <Modal visible={showWallpaperPanel} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowWallpaperPanel(false)}>
          <Pressable style={styles.panelContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.panelHeader}>
              <Heading level={3}>Wallpaper</Heading>
              <TouchableOpacity onPress={() => setShowWallpaperPanel(false)}>
                <Icon name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.colorSwatchGrid}>
              {WALLPAPER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: opt.color },
                    effectiveWallColor === opt.color && styles.colorSwatchActive,
                  ]}
                  onPress={() => {
                    if (currentRoom) updateRoomColors(countryId, currentRoom.id, opt.color, undefined);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.swatchLabel}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Flooring Panel */}
      <Modal visible={showFlooringPanel} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowFlooringPanel(false)}>
          <Pressable style={styles.panelContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.panelHeader}>
              <Heading level={3}>Flooring</Heading>
              <TouchableOpacity onPress={() => setShowFlooringPanel(false)}>
                <Icon name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.colorSwatchGrid}>
              {FLOORING_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: opt.color },
                    effectiveFloorColor === opt.color && styles.colorSwatchActive,
                  ]}
                  onPress={() => {
                    if (currentRoom) updateRoomColors(countryId, currentRoom.id, undefined, opt.color);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.swatchLabel}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Quiz modal */}
      <Modal visible={quizActive} transparent animationType="slide">
        <Pressable style={styles.modalOverlay}>
          <View style={styles.quizModal}>
            {!quizFinished ? (
              quizQuestions.length > 0 ? (
                <>
                  <View style={styles.quizProgress}>
                    <Text style={styles.quizProgressText}>Q {quizIndex + 1}/{quizQuestions.length}</Text>
                    <Text style={styles.quizScoreText}>Score: {quizScore}</Text>
                  </View>
                  <Heading level={3} style={styles.quizQuestion}>{quizQuestions[quizIndex].question}</Heading>
                  <View style={styles.quizOptions}>
                    {quizQuestions[quizIndex].options.map((opt, i) => {
                      const isCorrect = quizQuestions[quizIndex].correct === i;
                      const isSelected = quizSelected === i;
                      return (
                        <TouchableOpacity
                          key={i}
                          style={{
                            ...styles.quizOption,
                            ...(quizSelected !== null && isCorrect ? styles.quizOptionCorrect : {}),
                            ...(quizSelected !== null && isSelected && !isCorrect ? styles.quizOptionWrong : {}),
                          }}
                          onPress={() => handleQuizAnswer(i)}
                          disabled={quizSelected !== null}
                          activeOpacity={0.8}
                        >
                          <Text style={{
                            ...styles.quizOptionText,
                            ...(quizSelected !== null && isCorrect ? styles.quizOptionTextCorrect : {}),
                            ...(quizSelected !== null && isSelected && !isCorrect ? styles.quizOptionTextWrong : {}),
                          }}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              ) : (
                <Text>No quiz available for this country yet.</Text>
              )
            ) : (
              <View style={styles.quizResults}>
                <Icon
                  name={quizScore >= quizQuestions.length * 0.8 ? 'trophy' : quizScore >= quizQuestions.length * 0.5 ? 'star' : 'book'}
                  size={56}
                  color={colors.reward.gold}
                />
                <Heading level={2}>Quiz Complete!</Heading>
                <Text style={styles.quizResultScore}>{quizScore}/{quizQuestions.length} correct</Text>
                <View style={styles.quizRewardRow}>
                  <Text style={styles.quizRewardText}>+{Math.round(quizScore * QUIZ_AURA_PER_CORRECT * multiplier)} Aura</Text>
                  {streak > 0 && <Text style={styles.quizRewardMultiplier}>({multiplier.toFixed(1)}x streak!)</Text>}
                </View>
                <View style={styles.quizResultActions}>
                  <Button title="Try Again" variant="secondary" onPress={startQuiz} style={styles.quizResultBtn} />
                  <Button title="Done" variant="primary" onPress={() => setQuizActive(false)} style={styles.quizResultBtn} />
                </View>
              </View>
            )}
            {!quizFinished && (
              <TouchableOpacity style={styles.quizClose} onPress={() => setQuizActive(false)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="close" size={16} color={colors.text.secondary} />
                  <Text style={styles.quizCloseText}>Close</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl * 3 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerCenter: { alignItems: 'center', flex: 1 },
  flagTitle: { fontSize: 20, fontFamily: 'Baloo2-SemiBold', color: colors.text.primary },
  ownerTag: { color: '#4CAF50', fontFamily: 'Nunito-Bold', fontSize: 12 },
  auraChip: {
    backgroundColor: colors.reward.peach, paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs, borderRadius: 16,
  },
  auraChipText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.reward.gold },

  streakBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    marginHorizontal: spacing.lg, marginBottom: spacing.xs,
    paddingVertical: 6, paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 200, 100, 0.2)', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255, 180, 50, 0.3)',
  },
  streakText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: '#D4760A' },
  multiplierBadge: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  multiplierText: { fontFamily: 'Baloo2-Bold', fontSize: 12, color: '#7A5A00' },

  // Room tabs
  roomTabs: { paddingHorizontal: spacing.md, gap: spacing.xs, paddingVertical: spacing.sm },
  roomTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  roomTabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary.wisteria,
    shadowColor: colors.primary.wisteria, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
  },
  roomTabText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.secondary },
  roomTabTextActive: { color: colors.primary.wisteriaDark, fontFamily: 'Nunito-Bold' },

  // Room container
  roomContainer: {
    marginHorizontal: spacing.md, borderRadius: 24,
    overflow: 'hidden', minHeight: ROOM_HEIGHT,
    position: 'relative',
  },
  roomNameRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
  },
  roomNameInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roomNameText: { fontFamily: 'Baloo2-SemiBold', fontSize: 16, color: colors.text.primary },
  roomProgressChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  roomProgressText: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: '#4CAF50' },

  // Objects
  objectsLayer: {
    height: ROOM_HEIGHT - 80, position: 'relative', marginTop: spacing.xs,
  },
  roomObject: {
    position: 'absolute', alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -16 }],
  },
  objectLabel: { fontFamily: 'Nunito-Medium', fontSize: 9, color: colors.text.secondary, textAlign: 'center', maxWidth: 64 },
  objectLabelDone: { color: '#4CAF50' },
  interactiveDot: {
    position: 'absolute', top: -2, right: -2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FFD700', borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  // Avatar
  avatarContainer: {
    position: 'absolute', left: spacing.lg, bottom: 50,
    width: AVATAR_SIZE, height: AVATAR_SIZE,
  },

  // Floor
  floor: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 50, borderTopLeftRadius: 12, borderTopRightRadius: 12,
    justifyContent: 'center',
  },
  walkControls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
  },
  walkBtn: {
    padding: 6, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16,
  },

  // Door navigation
  roomNavLeft: { position: 'absolute', left: 4, top: '40%' as any, zIndex: 10 },
  roomNavRight: { position: 'absolute', right: 4, top: '40%' as any, zIndex: 10 },
  doorArrow: {
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 6, paddingHorizontal: 8, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  doorArrowText: { fontSize: 16 },
  doorLabel: { fontFamily: 'Nunito-Medium', fontSize: 9, color: colors.text.secondary, maxWidth: 56, textAlign: 'center' },

  // Quick actions
  actionsRow: {
    flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.lg,
  },
  actionCard: {
    flex: 1, alignItems: 'center', padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  actionLabel: { fontFamily: 'Baloo2-SemiBold', fontSize: 14, color: colors.text.primary },
  actionSub: { fontFamily: 'Nunito-Medium', fontSize: 11, color: colors.text.muted },

  // Facts section
  factsSection: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  sectionTitle: { fontFamily: 'Baloo2-Bold', fontSize: 17, color: colors.text.primary, marginBottom: 6 },
  factsScroll: { gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  factChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 18, borderWidth: 2, backgroundColor: colors.base.cream,
  },
  factChipRead: { backgroundColor: 'rgba(200, 230, 200, 0.4)', borderStyle: 'dashed' as any },
  factTextRead: { color: colors.text.muted },
  // Guide
  guideSection: {
    marginHorizontal: spacing.lg, marginTop: spacing.lg,
    padding: spacing.lg, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20,
  },
  guideGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  guideItem: {
    width: '46%' as any, alignItems: 'center', padding: spacing.sm,
    backgroundColor: colors.base.cream, borderRadius: 14,
  },
  guideLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 12, color: colors.text.primary, textAlign: 'center' },
  guideAmount: { fontFamily: 'Nunito-Medium', fontSize: 11, color: colors.text.secondary, textAlign: 'center' },

  // Modals
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    padding: spacing.xl, maxWidth: 340, width: '100%',
  },
  modalIconRow: { alignItems: 'center', marginBottom: spacing.sm },
  modalIcon: { fontSize: 48 },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.sm },
  auraEarnedRow: {
    alignItems: 'center', paddingVertical: 8, marginBottom: spacing.sm,
    backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 12,
  },
  auraEarnedText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: '#D4760A' },
  modalActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },

  // Quiz modal
  quizModal: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    padding: spacing.xl, maxWidth: 400, width: '100%', maxHeight: '85%',
  },
  quizProgress: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  quizProgressText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  quizScoreText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.primary.wisteriaDark },
  quizQuestion: { marginBottom: spacing.lg },
  quizOptions: { gap: spacing.sm },
  quizOption: {
    padding: spacing.md, borderRadius: 16, borderWidth: 2,
    borderColor: colors.primary.wisteriaFaded, backgroundColor: '#FAFAFE',
  },
  quizOptionCorrect: { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  quizOptionWrong: { borderColor: '#F44336', backgroundColor: 'rgba(244, 67, 54, 0.1)' },
  quizOptionText: { fontFamily: 'Nunito-SemiBold', fontSize: 15, color: colors.text.primary },
  quizOptionTextCorrect: { color: '#2E7D32' },
  quizOptionTextWrong: { color: '#C62828' },
  quizClose: { alignSelf: 'center', paddingVertical: spacing.md },
  quizCloseText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.muted },
  quizResults: { alignItems: 'center', paddingVertical: spacing.md },
  quizResultScore: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.text.primary, marginVertical: spacing.sm },
  quizRewardRow: { alignItems: 'center', marginVertical: spacing.md },
  quizRewardText: { fontFamily: 'Baloo2-Bold', fontSize: 18, color: '#D4760A' },
  quizRewardMultiplier: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.reward.gold, marginTop: 4 },
  quizResultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  quizResultBtn: { minWidth: 100 },

  // Edit mode toggle
  editToggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginLeft: spacing.sm, paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.primary.wisteria, backgroundColor: 'rgba(184, 165, 224, 0.1)',
  },
  editToggleBtnActive: {
    backgroundColor: colors.primary.wisteria, borderColor: colors.primary.wisteriaDark,
  },

  // Edit toolbar (replaces walk controls)
  editToolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  editToolbarBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  editToolbarBtnActive: {
    backgroundColor: colors.primary.wisteria, borderColor: colors.primary.wisteriaDark,
  },
  editToolbarLabel: {
    fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.primary.wisteriaDark,
  },
  editToolbarLabelActive: {
    color: '#FFFFFF',
  },

  // Placed furniture
  placedFurnitureItem: {
    position: 'absolute', alignItems: 'center',
    transform: [{ translateX: -22 }, { translateY: -14 }],
    padding: 2, borderRadius: 10,
  },
  placedFurnitureItemSelected: {
    backgroundColor: 'rgba(184, 165, 224, 0.25)',
    borderWidth: 1.5, borderColor: colors.primary.wisteria, borderStyle: 'dashed' as any,
  },
  placedFurnitureLabel: {
    fontFamily: 'Nunito-Medium', fontSize: 8, color: colors.text.secondary,
    textAlign: 'center', maxWidth: 56,
  },
  placedFurniturePopup: {
    position: 'absolute', top: -32, alignSelf: 'center',
    zIndex: 20,
  },
  removeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#E53935', paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 12, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  },
  removeBtnText: { fontFamily: 'Nunito-Bold', fontSize: 10, color: '#FFFFFF' },

  // Panel (shared by furniture / wallpaper / flooring)
  panelContent: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    padding: spacing.xl, maxWidth: 400, width: '100%', maxHeight: '75%',
  },
  panelHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md,
  },

  // Furniture grid
  furnitureGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  furnitureCard: {
    width: '30%' as any, alignItems: 'center', padding: spacing.sm,
    backgroundColor: colors.base.cream, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  furnitureIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  furnitureName: { fontFamily: 'Nunito-SemiBold', fontSize: 10, color: colors.text.primary, textAlign: 'center' },
  furnitureRarity: { fontSize: 9, color: colors.text.muted, textTransform: 'capitalize' as any, marginBottom: 4 },
  placeBtn: {
    paddingVertical: 4, paddingHorizontal: 14,
    backgroundColor: colors.primary.wisteria, borderRadius: 12,
  },
  placeBtnText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: '#FFFFFF' },
  buyBtn: {
    paddingVertical: 4, paddingHorizontal: 10,
    backgroundColor: colors.reward.peach, borderRadius: 12,
  },
  buyBtnText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.reward.gold },

  // Color swatch grid
  colorSwatchGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    justifyContent: 'center', paddingBottom: spacing.md,
  },
  colorSwatch: {
    width: 68, height: 68, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2, elevation: 1,
  },
  colorSwatchActive: {
    borderColor: colors.primary.wisteria, borderWidth: 3,
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  swatchLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 9, color: colors.text.secondary, textAlign: 'center' },
});
